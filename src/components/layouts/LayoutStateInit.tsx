'use client'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Cookies from 'js-cookie'
import { useGetInfoUserQuery } from '@/feautures/auth/authApi'
import { setInitialized, setUser } from '@/feautures/auth/authSlice'

export default function AppInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch()
  const token = Cookies.get('token')

  const { data: user, isLoading, isError } = useGetInfoUserQuery(null, {
    skip: !token,
  })

  useEffect(() => {
    if (!token || isError) {
      dispatch(setInitialized())
    } else if (!isLoading && user) {
      dispatch(setUser(user))
      dispatch(setInitialized())
    }
  }, [token, isLoading, user, isError, dispatch])

  return <>{children}</>
}