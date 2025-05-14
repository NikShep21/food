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
                required: "Почта обязательна",
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
        name="username"
        control={control}
        rules={
            {
                required: "Ник обязателен",
                minLength: {
                    value: 3,
                    message: "Слишком короткий ник",
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
              required: "Имя обязательно",
              minLength: {
                  value: 3,
                  message: "Слишком короткое имя",
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
                required: "Фамилия обязательна",
                minLength: {
                    value: 3,
                    message: "Слишком короткая фамилия",
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
                  required: "Пароль обязателен",
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

      
        
      <Controller
          name="confirmPassword"
          control={control}
          rules={
              {
                  required: "Подтверждение пароля обязательно",
                  validate: (value) => {
                      return value === watch("password") || "Пароли не совпадают";
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