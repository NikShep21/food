'use client'
import React from 'react'
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { usePathname } from 'next/navigation'
import Header from '../screens/Header/Header';
interface LayoutStoreProps {
  children: React.ReactNode;
}
const LayoutStore:React.FC<LayoutStoreProps> = ({children}) => {
    const pathname = usePathname()
      const hiddenRoutes = ['/login', '/register']
  return (
    <>
    <Provider store = {store}>
      {hiddenRoutes.includes(pathname)? null:<Header/>}
        {children}
    </Provider>
    </>
  )
}

export default LayoutStore