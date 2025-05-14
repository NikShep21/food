"use client";
import { useId } from "react";
import styles from "./MyInput.module.scss";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  // проконтролируем допустимые типы
  label?: string;
  value: string;
  changer: (value: string) => void;
  error?: string;
}

const MyInput = ({ label = "", value, changer, error, ...props }: Props) => {
  const id = useId();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    changer(e.target.value);
  };

  return (
    <div className={styles.inputContainer}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      )}
      <input
        {...props}
        id={id}
        type='text'
        className={styles.input}
        value={value}
        onChange={handleChange}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};

export default MyInput;
