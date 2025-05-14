'use client'
import { useLoginMutation, useRegisterMutation } from '@/feautures/auth/authApi';
import { useRouter } from 'next/navigation';
import React from 'react'
import {SubmitHandler, useForm } from 'react-hook-form';

import MyBtn from '../ui/MyBtn/MyBtn';
import styles from './Auth.module.scss'
import InputsRegister from './inputs/InputsRegister';
import Link from 'next/link';

interface FormValues {
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    password: string;
    confirmPassword: string;
}
const AuthRegister = () => {

    const [registerMutation] = useRegisterMutation();
    const [loginMutation] = useLoginMutation();
    const router = useRouter();
     const onSubmit: SubmitHandler<FormValues> = async (data) => {
        const { confirmPassword, ...safeData } = data;
        try{
            const result = await registerMutation(safeData).unwrap()
            await loginMutation({password:confirmPassword, email:result.email})
            
            router.push('/')
            
        }catch(error:any){
             console.log(error)
        }
     }
      const {
             control,
             watch,
             handleSubmit,
         } = useForm<FormValues>({mode:"onChange"})
  return (
    <div>
        <div className={styles.authContainer}>
            <h2 className={styles.header}>Регистрация</h2>
            <form  onSubmit={handleSubmit(onSubmit)} noValidate className={styles.form}>

                <InputsRegister control={control} watch={watch}/>
                <Link href={'/login'} className={styles.Redirect}>Войти</Link>
                <MyBtn type="submit" className={styles.btn}>Регистрация</MyBtn>

            </form>
        </div>
    </div>
  )
}

export default AuthRegister