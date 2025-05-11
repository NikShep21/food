'use client'
import { useLoginMutation } from '@/feautures/auth/authApi';
import { useRouter } from 'next/navigation';
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import styles from './Auth.module.scss'
import MyBtn from '../ui/MyBtn/MyBtn';

import InputsLogin from './inputs/InputsLogin';
import { Errors } from '@/feautures/auth/types';
import { useDispatch } from 'react-redux';
interface FormValues {
    email: string;
    password: string;
    
}
const AuthLogin = () => {
    const [loginMutation, {isLoading}] = useLoginMutation();
    console.log(isLoading)
    const router = useRouter();
    const dispatch = useDispatch()
   
     const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try{
        await loginMutation(data).unwrap()
            
            router.push('/')
        }catch(error:any){
                console.log(error.data)
        }
          
    }

        
     const {
        control,
        handleSubmit,
         } = useForm<FormValues>({mode:"onChange"})
     
                
  return (
    <div className={styles.authContainer}>
            <h2 className={styles.header}>Login</h2>
            <form  onSubmit={handleSubmit(onSubmit)} noValidate className={styles.form}>
                 <InputsLogin control={control}/>
                <MyBtn type="submit" className={styles.btn}>Login</MyBtn>
            </form>
    </div>
        
  )
}

export default AuthLogin