import Link from 'next/link'
import styles from './Footer.module.scss'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <h1 className={styles.logo}>
          <Link href={'/'}>FOOD</Link>
        </h1>
        
      </div>
    </footer>
  )
}

export default Footer