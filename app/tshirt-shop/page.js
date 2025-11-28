export default function TShirtShop() {
  return (
    <div style={{ 
      minHeight: 'calc(100vh - 70px)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '40px 20px'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '16px', color: 'var(--text-primary)' }}>
          T-Shirt Shop
        </h1>
        <p style={{ fontSize: '20px', color: 'var(--text-secondary)' }}>
          Coming soon...
        </p>
      </div>
    </div>
  )
}

