'use client';
import { useId } from 'react';
import styles from './MyInput.module.scss';

interface Props {
  type?: 'text' | 'number';         // проконтролируем допустимые типы
  label?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  error?: string;
}

const MyInput = ({
  type = 'text',
  label = '',
  value,
  onChange,
  error
}: Props) => {
  const id = useId();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === 'number') {
      // e.target.valueAsNumber — число или NaN
      const num = e.target.valueAsNumber;
      onChange(isNaN(num) ? 0 : num);
    } else {
      onChange(e.target.value);
    }
  };

  return (
    <div className={styles.inputContainer}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={styles.input}
        value={value}
        onChange={handleChange}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};

export default MyInput;
