# Custom Sticker Shop - Next.js Web Application

A modern, mobile-first web shop for ordering custom stickers built with Next.js.

## Features

- **Shape Selection**: Choose between rectangle or circle stickers
- **Dynamic Size Inputs**: 
  - Rectangle: Width and Height (mm)
  - Circle: Diameter (mm)
- **Lamination Options**: 
  - Optional lamination
  - If selected: Choose between Gloss or Matt finish
- **Quantity Input**: Specify the number of stickers needed
- **File Upload**: Upload design files (.png, .jpg, .tiff)
- **Backend API**: Next.js API route for processing orders

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Email account for sending order notifications (Gmail, Outlook, etc.)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure email settings:
   - Copy `.env.example` to `.env.local`
   - Update `config/email.js` with your recipient email address
   - Fill in SMTP credentials in `.env.local`:
     ```
     SMTP_HOST=smtp.gmail.com
     SMTP_PORT=587
     SMTP_USER=your-email@gmail.com
     SMTP_PASSWORD=your-app-password
     ```
   
   **For Gmail:**
   - Enable 2-factor authentication
   - Generate an App Password (not your regular password)
   - Use the App Password in `SMTP_PASSWORD`

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── api/
│   │   └── order/
│   │       └── route.js      # API endpoint for order submission
│   ├── globals.css           # Global styles
│   ├── layout.js             # Root layout component
│   ├── page.js               # Main page component (client-side)
│   └── page.module.css       # Component-specific styles
├── uploads/                  # Uploaded files directory (created automatically)
├── next.config.js            # Next.js configuration
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## API Endpoint

### POST `/api/order`

Handles sticker order submissions.

**Request Body (FormData):**
- `shape`: "rectangle" | "circle"
- `width`: number (required for rectangle)
- `height`: number (required for rectangle)
- `diameter`: number (required for circle)
- `lamination`: "yes" | "no"
- `laminationType`: "gloss" | "matt" (required if lamination is "yes")
- `quantity`: number
- `file`: File object (.png, .jpg, .tiff)

**Response:**
```json
{
  "success": true,
  "orderId": "ORD-1234567890",
  "message": "Order received successfully",
  "order": { ... }
}
```

## File Uploads

Uploaded files are saved to the `uploads/` directory with a timestamp prefix to prevent naming conflicts.

## Email Configuration

When an order is submitted, an email is automatically sent to the recipient address configured in `config/email.js`.

**To configure email:**
1. Edit `config/email.js` and set `recipientEmail` to your desired email address
2. Set up SMTP credentials in `.env.local` (see `.env.example` for template)
3. For Gmail, use an App Password (not your regular password)

The email includes:
- Order ID
- Order date and time
- Shape, size, lamination details
- Quantity
- File information
- File location on server

## Next Steps

To make this production-ready, consider:

1. **Database Integration**: Store orders in a database (PostgreSQL, MongoDB, etc.)
2. **File Storage**: Use cloud storage (AWS S3, Cloudinary, etc.) instead of local filesystem
3. **Authentication**: Add user authentication and order history
4. **Payment Processing**: Integrate payment gateway (Stripe, PayPal, etc.)
5. **Admin Dashboard**: Create admin panel for managing orders
6. **Image Processing**: Add image validation and optimization
7. **Email Templates**: Customize email templates for different order types

## License

MIT

