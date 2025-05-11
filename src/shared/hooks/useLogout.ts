'use client'
import { useDispatch } from 'react-redux'
import { clearUser } from '@/feautures/auth/authSlice'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

export const useLogout = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  return () => {
    Cookies.remove('token')
    dispatch(clearUser())
    router.push('/')
  }
}
