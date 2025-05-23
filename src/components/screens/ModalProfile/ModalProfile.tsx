import React, { useState, useRef, ChangeEvent } from 'react'
import styles from './ModalProfile.module.scss'
import { IoClose } from 'react-icons/io5'
import { RxAvatar } from 'react-icons/rx'
import { UserType } from '@/feautures/auth/types'
import { useSetAvatarMutation } from '@/feautures/auth/authApi'

interface Props {
  user: UserType
  onClose: () => void
  onLogout: () => void
}

const ModalProfile = ({ user, onClose, onLogout }: Props) => {
  const [preview, setPreview] = useState<string | null>(user.avatar || null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [setAvatar, { isLoading, error }] = useSetAvatarMutation()

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64 = reader.result as string
      setPreview(base64)

      try {
        await setAvatar({ avatar: base64 }).unwrap()
        console.log(base64)
      } catch (err) {
        console.error('Ошибка при загрузке аватара:', err)
      }
    }

    reader.readAsDataURL(file)
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          <IoClose size={24} />
        </button>

        <div className={styles.avatarSection}>
          <div className={styles.avatarWrapper} onClick={handleImageClick}>
            {preview ? (
              <img src={preview} alt="avatar" />
            ) : (
              <RxAvatar size={120} className={styles.fallbackIcon} />
            )}
            <div className={styles.avatarOverlay}>
              {isLoading ? 'Загрузка...' : 'Изменить'}
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </div>
          <p className={styles.userName}>{user.username}</p>
        </div>

        <div className={styles.info}>
          <p><strong>Имя:</strong> {user.first_name || '—'}</p>
          <p><strong>Фамилия:</strong> {user.last_name || '—'}</p>
          <p><strong>Email:</strong> {user.email || '—'}</p>
        </div>

        <button className={styles.logoutBtn} onClick={onLogout}>
          Выйти
        </button>
      </div>
    </div>
  )
}

export default ModalProfile
