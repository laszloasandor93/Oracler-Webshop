'use client'

import { useState } from 'react'
import styles from './page.module.css'

export default function Home() {
  const [shape, setShape] = useState('rectangle')
  const [lamination, setLamination] = useState('no')
  const [laminationType, setLaminationType] = useState('gloss')
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [diameter, setDiameter] = useState('')
  const [quantity, setQuantity] = useState('')
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [country, setCountry] = useState('')
  const [region, setRegion] = useState('')
  const [street, setStreet] = useState('')
  const [number, setNumber] = useState('')
  const [postalCode, setPostalCode] = useState('')

  const handleShapeChange = (e) => {
    setShape(e.target.value)
    // Clear size inputs when switching shapes
    if (e.target.value === 'circle') {
      setWidth('')
      setHeight('')
    } else {
      setDiameter('')
    }
  }

  const handleLaminationChange = (e) => {
    setLamination(e.target.value)
    if (e.target.value === 'no') {
      setLaminationType('gloss') // Reset to default
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/tiff', 'image/tif']
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase()
      const allowedExtensions = ['png', 'jpg', 'jpeg', 'tiff', 'tif']

      if (allowedTypes.includes(selectedFile.type) || allowedExtensions.includes(fileExtension)) {
        setFile(selectedFile)
        setFileName(`Selected: ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(2)} KB)`)
      } else {
        alert('Please select a valid image file (.png, .jpg, .tiff)')
        e.target.value = ''
        setFile(null)
        setFileName('')
      }
    } else {
      setFile(null)
      setFileName('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    if (lamination === 'yes' && !laminationType) {
      alert('Please select a lamination type')
      return
    }

    if (!file) {
      alert('Please upload your sticker design file')
      return
    }

    // Validate size inputs based on shape
    if (shape === 'rectangle') {
      if (!width || !height || parseFloat(width) <= 0 || parseFloat(height) <= 0) {
        alert('Please enter valid width and height')
        return
      }
    } else {
      if (!diameter || parseFloat(diameter) <= 0) {
        alert('Please enter a valid diameter')
        return
      }
    }

    if (!quantity || parseInt(quantity) <= 0) {
      alert('Please enter a valid quantity')
      return
    }

    // Show modal for customer information
    setShowModal(true)
  }

  const handleModalSubmit = async (e) => {
    e.preventDefault()

    // Validate customer information
    if (!customerName.trim()) {
      alert('Please enter your name')
      return
    }

    if (!customerEmail.trim()) {
      alert('Please enter your email address')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(customerEmail.trim())) {
      alert('Please enter a valid email address')
      return
    }

    if (!customerPhone.trim()) {
      alert('Please enter your phone number')
      return
    }

    if (!country.trim() || !region.trim() || !street.trim() || !number.trim() || !postalCode.trim()) {
      alert('Please fill in all address fields')
      return
    }

    setIsSubmitting(true)
    setShowModal(false)

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('shape', shape)
      formData.append('lamination', lamination)
      if (lamination === 'yes') {
        formData.append('laminationType', laminationType)
      }
      formData.append('quantity', quantity)
      formData.append('file', file)
      formData.append('customerName', customerName)
      formData.append('customerEmail', customerEmail)
      formData.append('customerPhone', customerPhone)
      formData.append('country', country)
      formData.append('region', region)
      formData.append('street', street)
      formData.append('number', number)
      formData.append('postalCode', postalCode)

      if (shape === 'rectangle') {
        formData.append('width', width)
        formData.append('height', height)
      } else {
        formData.append('diameter', diameter)
      }

      // Send to API route
      const response = await fetch('/api/order', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        alert(`Order submitted successfully!\n\nOrder ID: ${data.orderId}\nWe will process your order shortly.`)
        // Reset form
        setShape('rectangle')
        setLamination('no')
        setLaminationType('gloss')
        setWidth('')
        setHeight('')
        setDiameter('')
        setQuantity('')
        setFile(null)
        setFileName('')
        setCustomerName('')
        setCustomerEmail('')
        setCustomerPhone('')
        setCountry('')
        setRegion('')
        setStreet('')
        setNumber('')
        setPostalCode('')
        const form = document.querySelector('form')
        if (form) form.reset()
      } else {
        alert(`Error: ${data.error || 'Failed to submit order'}`)
        setShowModal(true) // Reopen modal if submission failed
      }
    } catch (error) {
      console.error('Error submitting order:', error)
      alert('An error occurred while submitting your order. Please try again.')
      setShowModal(true) // Reopen modal if submission failed
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseModal = () => {
    if (!isSubmitting) {
      setShowModal(false)
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <img
            src="/logo.png"
            alt="Logo"
            className={styles.logo}
            onError={(e) => {
              console.error('Failed to load logo.png')
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>
        <h1>Sticker Shop</h1>
        <p className={styles.subtitle}>Create your perfect stickers</p>
      </header>

      <form onSubmit={handleSubmit} className={styles.orderForm}>
        {/* Shape Selection */}
        <div className={styles.formSection}>
          <label className={styles.sectionLabel}>Choose Sticker Shape</label>
          <div className={styles.shapeOptions}>
            <label className={styles.radioOption}>
              <input
                type="radio"
                name="shape"
                value="rectangle"
                checked={shape === 'rectangle'}
                onChange={handleShapeChange}
                required
              />
              <span className={styles.radioCustom}></span>
              <span className={styles.radioLabel}>Rectangle</span>
            </label>
            <label className={styles.radioOption}>
              <input
                type="radio"
                name="shape"
                value="circle"
                checked={shape === 'circle'}
                onChange={handleShapeChange}
              />
              <span className={styles.radioCustom}></span>
              <span className={styles.radioLabel}>Circle</span>
            </label>
          </div>
        </div>

        {/* Size Inputs */}
        <div className={styles.formSection}>
          <label className={styles.sectionLabel} htmlFor="width">
            Dimensions (mm)
          </label>
          {shape === 'rectangle' ? (
            <div className={styles.sizeInputs}>
              <div className={styles.inputGroup}>
                <label htmlFor="width">Width</label>
                <input
                  type="number"
                  id="width"
                  name="width"
                  min="1"
                  step="0.1"
                  placeholder="e.g. 50"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  required
                />
                <span className={styles.unit}>mm</span>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="height">Height</label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  min="1"
                  step="0.1"
                  placeholder="e.g. 30"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  required
                />
                <span className={styles.unit}>mm</span>
              </div>
            </div>
          ) : (
            <div className={styles.sizeInputs}>
              <div className={styles.inputGroup}>
                <label htmlFor="diameter">Diameter</label>
                <input
                  type="number"
                  id="diameter"
                  name="diameter"
                  min="1"
                  step="0.1"
                  placeholder="e.g. 40"
                  value={diameter}
                  onChange={(e) => setDiameter(e.target.value)}
                  required
                />
                <span className={styles.unit}>mm</span>
              </div>
            </div>
          )}
        </div>

        {/* Lamination */}
        <div className={styles.formSection}>
          <label className={styles.sectionLabel}>Lamination</label>
          <div className={styles.laminationOptions}>
            <label className={styles.radioOption}>
              <input
                type="radio"
                name="lamination"
                value="no"
                checked={lamination === 'no'}
                onChange={handleLaminationChange}
                required
              />
              <span className={styles.radioCustom}></span>
              <span className={styles.radioLabel}>No Lamination</span>
            </label>
            <label className={styles.radioOption}>
              <input
                type="radio"
                name="lamination"
                value="yes"
                checked={lamination === 'yes'}
                onChange={handleLaminationChange}
              />
              <span className={styles.radioCustom}></span>
              <span className={styles.radioLabel}>Yes, Add Lamination</span>
            </label>
          </div>
        </div>

        {/* Lamination Type (conditional) */}
        {lamination === 'yes' && (
          <div className={styles.formSection}>
            <label className={styles.sectionLabel}>Lamination Type</label>
            <div className={styles.laminationTypeOptions}>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="laminationType"
                  value="gloss"
                  checked={laminationType === 'gloss'}
                  onChange={(e) => setLaminationType(e.target.value)}
                  required
                />
                <span className={styles.radioCustom}></span>
                <span className={styles.radioLabel}>Gloss</span>
              </label>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="laminationType"
                  value="matt"
                  checked={laminationType === 'matt'}
                  onChange={(e) => setLaminationType(e.target.value)}
                />
                <span className={styles.radioCustom}></span>
                <span className={styles.radioLabel}>Matt</span>
              </label>
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className={styles.formSection}>
          <label className={styles.sectionLabel} htmlFor="quantity">
            Quantity
          </label>
          <div className={styles.inputGroup}>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              step="1"
              placeholder="e.g. 100"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
            <span className={styles.unit}>pcs</span>
          </div>
        </div>

        {/* File Upload */}
        <div className={styles.formSection}>
          <label className={styles.sectionLabel} htmlFor="stickerFile">
            Upload Your Design
          </label>
          <div className={styles.fileUploadWrapper}>
            <input
              type="file"
              id="stickerFile"
              name="stickerFile"
              accept=".png,.jpg,.jpeg,.tiff,.tif"
              onChange={handleFileChange}
              required
            />
            <label htmlFor="stickerFile" className={styles.fileUploadLabel}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <span>{file ? 'Change file' : 'Choose file (.png, .jpg, .tiff)'}</span>
            </label>
            {fileName && <div className={`${styles.fileName} ${styles.show}`}>{fileName}</div>}
          </div>
        </div>

        {/* Order Button */}
        <button type="submit" className={styles.orderButton} disabled={isSubmitting}>
          <span>{isSubmitting ? 'Processing...' : 'Place Order'}</span>
          {!isSubmitting && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </form>

      {/* Customer Information Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Customer Information</h2>
              <button 
                className={styles.modalClose} 
                onClick={handleCloseModal}
                disabled={isSubmitting}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleModalSubmit} className={styles.modalForm}>
              <div className={styles.modalFormGroup}>
                <label htmlFor="customerName">Full Name *</label>
                <input
                  type="text"
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  disabled={isSubmitting}
                  placeholder="Enter your full name"
                />
              </div>

              <div className={styles.modalFormGroup}>
                <label htmlFor="customerEmail">Email Address *</label>
                <input
                  type="email"
                  id="customerEmail"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  placeholder="Enter your email address"
                />
              </div>

              <div className={styles.modalFormGroup}>
                <label htmlFor="customerPhone">Phone Number *</label>
                <input
                  type="tel"
                  id="customerPhone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                  disabled={isSubmitting}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className={styles.modalFormGroup}>
                <label htmlFor="country">Country *</label>
                <input
                  type="text"
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                  disabled={isSubmitting}
                  placeholder="Enter country"
                />
              </div>

              <div className={styles.modalFormGroup}>
                <label htmlFor="region">Region/State *</label>
                <input
                  type="text"
                  id="region"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  required
                  disabled={isSubmitting}
                  placeholder="Enter region or state"
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div className={styles.modalFormGroup} style={{ flex: '2' }}>
                  <label htmlFor="street">Street *</label>
                  <input
                    type="text"
                    id="street"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    required
                    disabled={isSubmitting}
                    placeholder="Enter street name"
                  />
                </div>

                <div className={styles.modalFormGroup} style={{ flex: '1' }}>
                  <label htmlFor="number">Number *</label>
                  <input
                    type="text"
                    id="number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    required
                    disabled={isSubmitting}
                    placeholder="No."
                  />
                </div>
              </div>

              <div className={styles.modalFormGroup}>
                <label htmlFor="postalCode">Postal Code *</label>
                <input
                  type="text"
                  id="postalCode"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                  disabled={isSubmitting}
                  placeholder="Enter postal code"
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.modalCancel}
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.modalSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

