import Link from 'next/link'
import styles from './Header.module.scss'
import MyBtn from '@/components/ui/MyBtn/MyBtn'

const Header = () => {
  return (
    <div className={styles.header}>
        <div className={styles.headerContainer}>
            <h1 className={styles.logo}>
                <Link href={'/'}>FOOD</Link>
            </h1>
            
            <nav>
                <ul className={styles.navList}>
                    <li>
                        <Link  href={'/'}>ddddddd</Link>
                    </li>
                    <li>
                        <Link href={'/'}>ddddddd</Link>
                    </li>
                </ul>
            </nav>
           
            <ul className={styles.authContainer}>
                <li>
                    <Link href={'/login'} className={styles.login}>Login</Link>
                </li>
                <li>
                    <Link href={'/register'} className={styles.register}>
                        <MyBtn>Register</MyBtn>
                    </Link>
                </li>
            </ul>
        </div>

    </div>
  )
}

export default Header