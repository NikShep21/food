import MyInputAuth from '@/components/ui/MyInputAuth/MyInputAuth';
import React from 'react'
import { Control, Controller, UseFormWatch } from 'react-hook-form';

interface FormValues {
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    password: string;
    confirmPassword: string;
}
interface LoginInputsProps{
  control: Control<FormValues>;
  watch: UseFormWatch<FormValues>
};
const InputsRegister= ({control, watch}:LoginInputsProps) => {
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
        name="username"
        control={control}
        rules={
            {
                required: "Username is required",
                minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters long",
                },
            }
        }
        render={({ field, fieldState }) => (
            <MyInputAuth
                type="text"
                label="Username"
                value={field.value || ''}
                onChange={field.onChange}
                error={fieldState.error?.message}
            />
        )}
    />
      <Controller
      name="first_name"
      control={control}
      
      rules={
          {
              required: "Username is required",
              minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters long",
              },
          }
      }
      render={({ field, fieldState }) => (
          <MyInputAuth
              type="text"
              label="Name"
              value={field.value || ''}
              onChange={field.onChange}
              error={fieldState.error?.message}
          />
      )}
    />
        <Controller
        name="last_name"
        control={control}
        rules={
            {
                required: "Username is required",
                minLength: {
                    value: 3,
                    message: "Surname must be at least 3 characters long",
                },
            }
        }
        render={({ field, fieldState }) => (
            <MyInputAuth
                type="text"
                label="Surname"
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

      
        
      <Controller
          name="confirmPassword"
          control={control}
          rules={
              {
                  required: "Confirm Password is required",
                  validate: (value) => {
                      return value === watch("password") || "Passwords do not match";
                  }
              }
          }
          render={({ field, fieldState }) => (

              <MyInputAuth
                  type="password"
                  label="Confirm Password"
                  value={field.value || ''}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
              />
          )}
      />
    </>
  )
}

export default InputsRegister