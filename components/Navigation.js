'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Navigation.module.css'

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          <img src="/logo.png" alt="Logo" className={styles.logoImage} />
        </Link>
        
        <div className={styles.navLinks}>
          <Link 
            href="/" 
            className={pathname === '/' ? styles.active : ''}
          >
            Home
          </Link>
          <Link 
            href="/about" 
            className={pathname === '/about' ? styles.active : ''}
          >
            About Us
          </Link>
          <Link 
            href="/sticker-shop" 
            className={pathname === '/sticker-shop' ? styles.active : ''}
          >
            Sticker Shop
          </Link>
          <Link 
            href="/tshirt-shop" 
            className={pathname === '/tshirt-shop' ? styles.active : ''}
          >
            T-Shirt Shop
          </Link>
        </div>

        <div className={styles.authButtons}>
          <Link href="/login" className={styles.loginBtn}>
            <span>Login</span>
          </Link>
          <Link href="/register" className={styles.registerBtn}>
            <span>Register</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}

