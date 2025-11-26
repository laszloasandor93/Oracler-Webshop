import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { sendOrderEmail } from '../../../lib/email.js'

export async function POST(request) {
  try {
    const formData = await request.formData()

    // Extract form fields
    const shape = formData.get('shape')
    const lamination = formData.get('lamination')
    const laminationType = formData.get('laminationType')
    const quantity = formData.get('quantity')
    const file = formData.get('file')
    const width = formData.get('width')
    const height = formData.get('height')
    const diameter = formData.get('diameter')
    const customerName = formData.get('customerName')
    const customerPhone = formData.get('customerPhone')
    const country = formData.get('country')
    const region = formData.get('region')
    const street = formData.get('street')
    const number = formData.get('number')
    const postalCode = formData.get('postalCode')

    // Validate required fields
    if (!shape || !quantity || !file) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate customer information
    if (!customerName || !customerPhone || !country || !region || !street || !number || !postalCode) {
      return NextResponse.json(
        { error: 'Missing customer information. Please fill in all required fields.' },
        { status: 400 }
      )
    }

    // Validate shape-specific dimensions
    if (shape === 'rectangle' && (!width || !height)) {
      return NextResponse.json(
        { error: 'Width and height are required for rectangle shape' },
        { status: 400 }
      )
    }

    if (shape === 'circle' && !diameter) {
      return NextResponse.json(
        { error: 'Diameter is required for circle shape' },
        { status: 400 }
      )
    }

    // Validate lamination type if lamination is selected
    if (lamination === 'yes' && !laminationType) {
      return NextResponse.json(
        { error: 'Lamination type is required when lamination is selected' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/tiff', 'image/tif']
    const fileExtension = file.name.split('.').pop().toLowerCase()
    const allowedExtensions = ['png', 'jpg', 'jpeg', 'tiff', 'tif']

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload .png, .jpg, or .tiff files' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${timestamp}_${sanitizedFileName}`
    const filePath = join(uploadsDir, fileName)

    // Save file to disk
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Create order object
    const orderData = {
      orderId: `ORD-${timestamp}`,
      shape,
      size: shape === 'rectangle' 
        ? { width: parseFloat(width), height: parseFloat(height) }
        : { diameter: parseFloat(diameter) },
      lamination: lamination === 'yes',
      laminationType: lamination === 'yes' ? laminationType : null,
      quantity: parseInt(quantity),
      fileName: file.name,
      fileSize: file.size,
      savedFilePath: filePath,
      customer: {
        name: customerName,
        phone: customerPhone,
        address: {
          country,
          region,
          street,
          number,
          postalCode,
        },
      },
      createdAt: new Date().toISOString(),
    }

    // Here you would typically:
    // 1. Save order to database
    // 2. Process payment (if applicable)
    // 3. Queue for production

    // Log order
    console.log('Order received:', orderData)

    // Send email notification
    let emailSent = false
    let emailError = null
    try {
      await sendOrderEmail(orderData)
      emailSent = true
      console.log('Order email sent successfully')
    } catch (emailErr) {
      emailError = emailErr.message || 'Unknown email error'
      console.error('Failed to send order email:', emailErr)
      // Don't fail the order if email fails, just log the error
      // The order is still saved successfully
    }

    return NextResponse.json(
      {
        success: true,
        orderId: orderData.orderId,
        message: 'Order received successfully',
        emailSent,
        emailError: emailError || null,
        order: orderData,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing order:', error)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      { 
        error: 'Internal server error. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

