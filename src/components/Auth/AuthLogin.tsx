"use client";
import {
  useGetInfoUserQuery,
  useLoginMutation,
} from "@/feautures/auth/authApi";
import { useRouter } from "next/navigation";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import styles from "./Auth.module.scss";
import MyBtn from "../ui/MyBtn/MyBtn";
import InputsLogin from "./inputs/InputsLogin";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { setUser } from "@/feautures/auth/authSlice";
import { fetchCurrentUser } from "@/shared/utils/fetchCurrentUser";

interface FormValues {
  email: string;
  password: string;
  non_field_errors?: string;
}
const AuthLogin = () => {
  const [loginMutation, { isLoading }] = useLoginMutation();
  const router = useRouter();
  const dispatch = useDispatch();

  const { control, handleSubmit, setError } = useForm<FormValues>({
    mode: "onChange",
  });
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      await loginMutation(data).unwrap();
      await fetchCurrentUser()

      router.push("/");
    } catch (error: any) {
      console.log(error)
      const apiErrors = error?.data;

      Object.entries(apiErrors).forEach(([field, messages]) => {
        const message = Array.isArray(messages) ? messages[0] : messages;

        if (field in data) {
          setError(field as keyof FormValues, { type: "server", message });
        } else if (field === "non_field_errors") {
          setError("non_field_errors", { type: "server", message });
        }
      });
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2 className={styles.header}>Login</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className={styles.form}
      >
        <InputsLogin control={control} />
        <Link className={styles.Redirect} href={"/register"}>
          Регистрация
        </Link>
        <MyBtn type="submit" className={styles.btn}>
          Вход
        </MyBtn>
      </form>
    </div>
  );
};

export default AuthLogin;
