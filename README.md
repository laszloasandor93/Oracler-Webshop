# Custom Sticker Shop - Next.js Web Application

A modern, mobile-first web shop for ordering custom stickers built with Next.js and Supabase.

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
- **Database Integration**: Orders saved to Supabase PostgreSQL database
- **Email Notifications**: Automatic email with order details

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (for database)
- Email account for sending order notifications (Gmail, Outlook, etc.)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up Supabase:
   - Create a Supabase project at [https://supabase.com](https://supabase.com)
   - Go to your project settings and get your Project URL and anon/public key
   - Run the SQL script in `supabase-schema.sql` in your Supabase SQL Editor to create the orders table
   - Add Supabase credentials to `.env.local`:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

3. Configure email settings:
   - Update `config/email.js` with your recipient email address
   - Fill in SMTP credentials in `.env.local`:
     ```
     SMTP_HOST=smtp.mail.yahoo.com
     SMTP_PORT=587
     SMTP_USER=your-email@yahoo.com
     SMTP_PASSWORD=your-app-password
     ```
   
   **For Yahoo Mail:**
   - Enable 2-factor authentication
   - Generate an App Password (not your regular password)
   - Use the App Password in `SMTP_PASSWORD`

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

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
│   ├── sticker-shop/
│   │   ├── page.js           # Sticker shop order form
│   │   └── page.module.css   # Sticker shop styles
│   ├── globals.css           # Global styles
│   ├── layout.js             # Root layout component
│   └── page.js               # Home page
├── components/
│   ├── Navigation.js         # Navigation bar component
│   └── Navigation.module.css # Navigation styles
├── lib/
│   ├── email.js              # Email sending utility
│   └── supabase-server.js    # Supabase client configuration
├── config/
│   └── email.js              # Email configuration
├── uploads/                  # Uploaded files directory (created automatically)
├── supabase-schema.sql       # Database schema SQL
├── next.config.js            # Next.js configuration
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## Database Setup

1. Create a Supabase project
2. Go to SQL Editor in your Supabase dashboard
3. Copy and run the SQL from `supabase-schema.sql`
4. This will create the `orders` table with all necessary fields

## API Endpoint

### POST `/api/order`

Handles sticker order submissions and saves to Supabase database.

**Request Body (FormData):**
- `shape`: "rectangle" | "circle"
- `width`: number (required for rectangle)
- `height`: number (required for rectangle)
- `diameter`: number (required for circle)
- `lamination`: "yes" | "no"
- `laminationType`: "gloss" | "matt" (required if lamination is "yes")
- `quantity`: number
- `file`: File object (.png, .jpg, .tiff)
- `customerName`: string
- `customerEmail`: string
- `customerPhone`: string
- `country`: string
- `region`: string
- `street`: string
- `number`: string
- `postalCode`: string

**Response:**
```json
{
  "success": true,
  "orderId": "ORD-1234567890",
  "dbOrderId": 123,
  "message": "Order received successfully",
  "emailSent": true,
  "order": { ... }
}
```

## File Uploads

Uploaded files are saved to the `uploads/` directory with a timestamp prefix to prevent naming conflicts.

## Email Configuration

When an order is submitted, an email is automatically sent to the recipient address configured in `config/email.js`. The customer is CC'd on the email.

## Next Steps

To make this production-ready, consider:

1. **File Storage**: Use Supabase Storage or cloud storage (AWS S3, Cloudinary, etc.) instead of local filesystem
2. **Authentication**: Add user authentication with Supabase Auth
3. **Payment Processing**: Integrate payment gateway (Stripe, PayPal, etc.)
4. **Admin Dashboard**: Create admin panel for managing orders
5. **Image Processing**: Add image validation and optimization
6. **Order Status Tracking**: Add order status updates

## License

MIT
