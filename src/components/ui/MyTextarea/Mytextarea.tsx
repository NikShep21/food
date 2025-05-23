import React, { useId } from 'react'
import styles from './Mytextarea.module.scss'

interface Props {       
  label?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  error?: string;
}

const Mytextarea = ({label='', value, onChange, error=''}:Props) => {
     const id = useId();
  return (
      <div className={styles.textareaContainer}>
        {label && (
          <label className={styles.label} htmlFor={id}>
            {label}
          </label>
        )}
        <textarea
            rows={6}
          id={id}
         wrap="soft"
          className={styles.textarea}
          value={value}
          onChange={e=>onChange(e.target.value)}
        />
        {error && <span className={styles.error}>{error}</span>}
      </div>
    );
  };
  


export default Mytextarea