'use client';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './DropZone.module.scss';

type DropZoneProps = {
  onChange: (base64: string | null) => void;
  value?: string | null;
};

const DropZone = ({ onChange, value }: DropZoneProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(value ?? null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file && file.type.startsWith('image/')) {

        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);


        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string; // "data:image/...;base64,..."
          onChange(dataUrl);
        };
        reader.onerror = () => {
          console.error('Ошибка чтения файла', reader.error);
          onChange(null);
        };
        reader.readAsDataURL(file);
      } else {
        onChange(null);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  useEffect(() => {

    if (value) {
      setPreviewUrl(value);
    }
  }, [value]);

  useEffect(() => {

    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className={styles.dropZoneContainer}>
      <div {...getRootProps()} className={styles.image}>
        <input {...getInputProps()} />
        <div className={styles.content}>
          {previewUrl ? (
            <img src={previewUrl} alt="preview" className={styles.previewImage} />
          ) : (
            <p>{isDragActive ? 'Отпустите файл здесь...' : 'Перетащите файл или нажмите'}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DropZone;
