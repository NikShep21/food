'use client';
import { IoTrashOutline } from "react-icons/io5";
import { useEffect, useRef, useState } from 'react';
import styles from './DropZone.module.scss';
import { fileToBase64 } from '@/shared/utils/utils';
import { FaFileUpload } from "react-icons/fa";
type DropZoneProps = {
  onChange: (base64: string | null) => void;
  value?: string | null;
};

const DropZone = ({ onChange, value }: DropZoneProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(value ?? null);
  const dropRef = useRef<HTMLDivElement>(null);

  const handleFile = async (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      try {
        const base64 = await fileToBase64(file);
        onChange(base64);
      } catch (err) {
        console.error('Ошибка при конвертации файла:', err);
        onChange(null);
      }
    } else {
      onChange(null);
    }
  };

  const handleManualSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDelete = () => {
    setPreviewUrl(null);
    onChange(null);
  };

  useEffect(() => {
    if (value) setPreviewUrl(value);
  }, [value]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className={styles.dropZoneContainer}>
      <div
        className={styles.dropArea}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        ref={dropRef}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="preview" className={styles.previewImage} />
        ) : (
          <div className={styles.placeholder}>
            
            <FaFileUpload size={50}/>
            <p>Перетащите изображение сюда</p>
          </div>
        )}
      </div>

      <div className={styles.controls}>
        <label className={styles.customButton}>
          Выбрать изображение
          <input type="file" accept="image/*" onChange={handleManualSelect} hidden />
        </label>

        <div className={styles.deleteIcon} onClick={handleDelete}>
          <IoTrashOutline size={35}/>
        </div>
      </div>
    </div>
  );
};

export default DropZone;
