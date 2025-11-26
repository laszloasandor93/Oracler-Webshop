import nodemailer from 'nodemailer'
import { emailConfig } from '../config/email.js'
import { readFileSync } from 'fs'

// Create transporter - configure with your SMTP settings
// For Gmail, you'll need an App Password
// For other providers, adjust the settings accordingly
const createTransporter = () => {
  // Use environment variables for SMTP configuration
  // Set these in your .env.local file
  const smtpUser = process.env.SMTP_USER
  const smtpPassword = process.env.SMTP_PASSWORD
  
  if (!smtpUser || !smtpPassword) {
    console.warn('SMTP credentials not configured. Email sending will be skipped.')
    return null
  }

  try {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    })
  } catch (error) {
    console.error('Error creating email transporter:', error)
    return null
  }
}

export async function sendOrderEmail(orderData) {
  try {
    const transporter = createTransporter()
    
    if (!transporter) {
      throw new Error('Email transporter not available. SMTP may not be configured.')
    }

    // Format order details for email
    const sizeInfo = orderData.shape === 'rectangle'
      ? `Width: ${orderData.size.width}mm, Height: ${orderData.size.height}mm`
      : `Diameter: ${orderData.size.diameter}mm`

    const laminationInfo = orderData.lamination
      ? `Yes (${orderData.laminationType})`
      : 'No'

    const emailBody = `
New Sticker Order Received

Order ID: ${orderData.orderId}
Date: ${new Date(orderData.createdAt).toLocaleString()}

Customer Information:
- Name: ${orderData.customer?.name || 'N/A'}
- Phone: ${orderData.customer?.phone || 'N/A'}
- Address: ${orderData.customer?.address ? `${orderData.customer.address.street} ${orderData.customer.address.number}, ${orderData.customer.address.postalCode} ${orderData.customer.address.region}, ${orderData.customer.address.country}` : 'N/A'}

Order Details:
- Shape: ${orderData.shape}
- Size: ${sizeInfo}
- Lamination: ${laminationInfo}
- Quantity: ${orderData.quantity}
- File Name: ${orderData.fileName}
- File Size: ${(orderData.fileSize / 1024).toFixed(2)} KB

The design file has been saved to: ${orderData.savedFilePath}

Please process this order accordingly.
    `.trim()

    // Attach the uploaded file
    const attachments = []
    if (orderData.savedFilePath) {
      try {
        const fileContent = readFileSync(orderData.savedFilePath)
        attachments.push({
          filename: orderData.fileName,
          content: fileContent,
        })
      } catch (fileError) {
        console.error('Error reading file for attachment:', fileError)
        // Continue without attachment if file can't be read
      }
    }

    const mailOptions = {
      from: process.env.SMTP_USER || 'noreply@stickershop.com',
      to: emailConfig.recipientEmail,
      subject: `${emailConfig.subjectPrefix} New Order - ${orderData.orderId}`,
      text: emailBody,
      attachments: attachments,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">New Sticker Order Received</h2>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Order ID:</strong> ${orderData.orderId}</p>
            <p><strong>Date:</strong> ${new Date(orderData.createdAt).toLocaleString()}</p>
          </div>

          <h3 style="color: #1f2937; margin-top: 30px;">Customer Information:</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px; font-weight: bold;">Name:</td>
              <td style="padding: 10px;">${orderData.customer?.name || 'N/A'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px; font-weight: bold;">Phone:</td>
              <td style="padding: 10px;">${orderData.customer?.phone || 'N/A'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px; font-weight: bold;">Country:</td>
              <td style="padding: 10px;">${orderData.customer?.address?.country || 'N/A'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px; font-weight: bold;">Region/State:</td>
              <td style="padding: 10px;">${orderData.customer?.address?.region || 'N/A'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px; font-weight: bold;">Street:</td>
              <td style="padding: 10px;">${orderData.customer?.address?.street || 'N/A'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px; font-weight: bold;">Number:</td>
              <td style="padding: 10px;">${orderData.customer?.address?.number || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Postal Code:</td>
              <td style="padding: 10px;">${orderData.customer?.address?.postalCode || 'N/A'}</td>
            </tr>
          </table>

          <h3 style="color: #1f2937; margin-top: 30px;">Order Details:</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px; font-weight: bold;">Shape:</td>
              <td style="padding: 10px;">${orderData.shape}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px; font-weight: bold;">Size:</td>
              <td style="padding: 10px;">${sizeInfo}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px; font-weight: bold;">Lamination:</td>
              <td style="padding: 10px;">${laminationInfo}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px; font-weight: bold;">Quantity:</td>
              <td style="padding: 10px;">${orderData.quantity}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px; font-weight: bold;">File Name:</td>
              <td style="padding: 10px;">${orderData.fileName}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">File Size:</td>
              <td style="padding: 10px;">${(orderData.fileSize / 1024).toFixed(2)} KB</td>
            </tr>
          </table>

          <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
            The design file "${orderData.fileName}" is attached to this email.
          </p>

          <p style="color: #6b7280; font-size: 14px; margin-top: 10px;">
            File location: <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px;">${orderData.savedFilePath}</code>
          </p>

          <p style="margin-top: 30px; color: #6b7280;">
            Please process this order accordingly.
          </p>
        </div>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

