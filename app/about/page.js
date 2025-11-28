export default function About() {
  return (
    <div style={{ 
      minHeight: 'calc(100vh - 70px)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '40px 20px'
    }}>
      <div style={{ 
        maxWidth: '800px', 
        textAlign: 'center' 
      }}>
        <h1 style={{ 
          fontSize: '48px', 
          marginBottom: '24px', 
          color: 'var(--text-primary)',
          background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          About Us
        </h1>
        <p style={{ 
          fontSize: '18px', 
          color: 'var(--text-secondary)',
          lineHeight: '1.8',
          marginBottom: '24px'
        }}>
          We are a custom printing company specializing in high-quality stickers and T-shirts.
        </p>
        <p style={{ 
          fontSize: '18px', 
          color: 'var(--text-secondary)',
          lineHeight: '1.8'
        }}>
          Our mission is to help you bring your creative ideas to life with premium products and excellent service.
        </p>
      </div>
    </div>
  )
}

