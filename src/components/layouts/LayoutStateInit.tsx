'use client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';

import { setInitialized, setUser, logout } from '@/feautures/auth/authSlice';
import { fetchCurrentUser } from '@/shared/utils/fetchCurrentUser';

export default function AppInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const token = Cookies.get('token');


  useEffect(() => {
    if (!token) {
      dispatch(setInitialized());
    } else{
      fetchCurrentUser()
      dispatch(setInitialized());
    }
  }, [token, dispatch]);

  return <>{children}</>;
}
