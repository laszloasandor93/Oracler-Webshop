import './globals.css'
import Navigation from '../components/Navigation'

export const metadata = {
  title: 'Oracler Shop - Custom Stickers & T-Shirts',
  description: 'Create your perfect custom stickers and T-shirts',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  )
}



