import MyInputAuth from '@/components/ui/MyInputAuth/MyInputAuth';
import React from 'react'
import { Control, Controller, useFormState } from 'react-hook-form';

interface FormValues {
    email: string;
    password: string;
    non_field_errors?:string
}
interface LoginInputsProps{
  control: Control<FormValues>;

};
const InputsLogin = ({control}:LoginInputsProps) => {
    const {errors} = useFormState({control})
    console.log(errors.non_field_errors)
  return (
    <>
        <Controller
            name="email"
            control={control}
            
            rules={
                {
                    required: "Email is required",
                    pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Неправильная почта",
                    },
                    

                }
            }
            render={({ field, fieldState }) => (
                <MyInputAuth
                    type="email"
                    label="email"
                    value={field.value || ''}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                />
            )}
        />
        
        <Controller
          name="password"
          control={control}
          rules={
              {
                  required: "Password is required",
                  minLength: {
                      value: 8,
                      message: "Слишком короткий пароль(минимум 8 символов)",
                  },
              }
          }
          render={({ field, fieldState }) => (
              <MyInputAuth
                  type="password"
                  label="Password"
                  value={field.value || ''}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
              />
          )}
        />
        {errors.non_field_errors && (
        <p  style={{ color: "red", marginTop: "8px" }}>
          {errors.non_field_errors.message}
        </p>
      )}
    </>
  )
}

export default InputsLogin