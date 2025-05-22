'use client'
import { useId, useState } from 'react'
import styles from './MyInputAuth.module.scss'
interface Props{
    type: 'email' | 'password' | 'text'
    label: string 
    value: string
    onChange: (value:string) => void
    error?: string
}
const MyInputAuth = ({type, label, value, onChange, error }:Props) => {
  
  const id = useId()
 
 
  return (
    <div className={styles.inputContainer}>

        <label htmlFor={id} className={styles.label}>{label}</label>
        <input onChange={e => onChange(e.target.value)} value={value} className={styles.input} type={type} id={id}/>
        {error && <span className={styles.error}>{error}</span>}
    </div>
  )
}

export default MyInputAuth