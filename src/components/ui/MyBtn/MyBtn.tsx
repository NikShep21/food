import React from 'react'
import clsx from 'clsx'
import styles from './MyBtn.module.scss'
interface PropsType extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    
}
const MyBtn = ({children, className, ...props}:PropsType) => {
  return (
    <button {...props} className={clsx(className, styles.btn)}>
        {children}
    </button>
  )
}

export default MyBtn