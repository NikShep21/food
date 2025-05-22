import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { setUser, setInitialized, logout } from '@/feautures/auth/authSlice';

export const useLogout = (path:string|null = null) => {
  const dispatch = useDispatch();
  const router = useRouter();

  return () => {
    dispatch(logout());
    {
      path ? 
      router.push(path)
      :
      null
    }
  };
};