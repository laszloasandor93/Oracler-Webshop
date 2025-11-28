'use client'

import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.homeContainer}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Welcome to Our Shop</h1>
          <p className={styles.heroSubtitle}>
            Custom stickers and T-shirts made just for you
          </p>
          
          <div className={styles.shopCards}>
            <Link href="/sticker-shop" className={styles.shopCard}>
              <div className={styles.cardIcon}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <path d="M9 9h6v6H9z"></path>
                </svg>
              </div>
              <h2>Sticker Shop</h2>
              <p>Create custom stickers in any shape and size</p>
              <span className={styles.cardLink}>Shop Now →</span>
            </Link>

            <Link href="/tshirt-shop" className={styles.shopCard}>
              <div className={styles.cardIcon}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 7h16M4 7l-1 8h18l-1-8M4 7V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2"></path>
                  <path d="M9 11v6M15 11v6"></path>
                </svg>
              </div>
              <h2>T-Shirt Shop</h2>
              <p>Design your perfect custom T-shirt</p>
              <span className={styles.cardLink}>Shop Now →</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
