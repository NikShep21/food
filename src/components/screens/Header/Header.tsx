  'use client'

  import Link from 'next/link'
  import styles from './Header.module.scss'
  import MyBtn from '@/components/ui/MyBtn/MyBtn'
  import ModalProfile from '@/components/screens/ModalProfile/ModalProfile'
  import { useState } from 'react'
  import { useLogout } from '@/shared/hooks/useLogout'
  import User from '@/components/ui/User/User'
  import { useSelector } from 'react-redux'
  import { RootState } from '@/store/store'
import { useGetInfoUserQuery } from '@/feautures/auth/authApi'

  const Header = () => {
    const logout = useLogout()
   const { data: user } = useGetInfoUserQuery(null)

    const [showModal, setShowModal] = useState(false)

    return (
      <div className={styles.header}>
        <div className={styles.headerContainer}>
          <h1 className={styles.logo}>
            <Link href="/">FOOD</Link>
          </h1>

          <nav>
            <ul className={styles.navList}>
              <li><Link href="/recipe">Создать</Link></li>
              <li><Link href="/myRecipes">Мои рецепты</Link></li>
              <li><Link href="/favorite">Избранное</Link></li>
            </ul>
          </nav>

          {user ? (
            <>
              <div
                className={styles.userContainer}
                onClick={() => setShowModal(true)}
              >
                <User username={user.username} avatar={user.avatar} />
              </div>

              {showModal && (
                <ModalProfile user = {user} onClose={() => setShowModal(false)} onLogout={logout} />
              )}
            </>
          ) : (
            <ul className={styles.authContainer}>
              <li>
                <Link href="/login" className={styles.login}>Login</Link>
              </li>
              <li>
                <Link href="/register" className={styles.register}>
                  <MyBtn>Register</MyBtn>
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    )
  }

  export default Header
