
'use client'

import Link from 'next/link'
import styles from './Header.module.scss'
import MyBtn from '@/components/ui/MyBtn/MyBtn'
import { useGetInfoUserQuery } from '@/feautures/auth/authApi'
import { useState } from 'react'
import { useLogout } from '@/shared/hooks/useLogout'
import User from '@/components/ui/User/User'
import clsx from 'clsx'

const Header = () => {
  
  const [showDropdown, setShowDropdown] = useState(false)
  const logout = useLogout()
  const {data:user} = useGetInfoUserQuery(null)


  return (
    <div className={styles.header}>
      <div className={styles.headerContainer}>
        <h1 className={styles.logo}>
          <Link href="/">FOOD</Link>
        </h1>
        <nav>
          <ul className={styles.navList}>
            <li><Link href="/recipe">Создать</Link></li>
            <li><Link href="/">Мои рецепты</Link></li>
          </ul>
        </nav>

        {user ? (
          <div
            className={clsx(styles.userContainer,showDropdown? styles.active:null)}
            onClick={() => setShowDropdown(prev => !prev)}
          >
            
            <User username={user.username} avatar={user.avatar}/>
            
            {showDropdown && (
              <ul className={styles.dropdown}>
                <li><Link href="/profile">Профиль</Link></li>
                <li><button onClick={logout}>Выйти</button></li>
              </ul>
            )}
          </div>
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
