import MyInputAuth from '@/components/ui/MyInputAuth/MyInputAuth';
import React from 'react'
import { Control, Controller } from 'react-hook-form';

interface FormValues {
    email: string;
    password: string;
}
interface LoginInputsProps{
  control: Control<FormValues>;

};
const InputsLogin = ({control}:LoginInputsProps) => {
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
                        message: "Invalid email address",
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
                      message: "Password must be at least 8 characters long",
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
    </>
  )
}

export default InputsLogin