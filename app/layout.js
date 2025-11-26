import './globals.css'

export const metadata = {
  title: 'Custom Sticker Shop - Order Your Stickers',
  description: 'Create your perfect custom stickers',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

