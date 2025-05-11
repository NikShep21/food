import React from 'react';
import styles from './Tag.module.scss';

type TagProps = {
  id: number;
  name: string;
  color?: string;
  selected?: boolean;
  onClick?: (id: number) => void;
  size?:number
};

const Tag: React.FC<TagProps> = ({ size=17, id, name, color = '#b69a94', selected = false, onClick }) => {
  const handleClick = () => {
    if (onClick) onClick(id);
  };

  return (
    <button
      type="button"
      className={`${styles.tag} ${selected ? styles.selected : ''}`}
      style={{
        borderColor: color,
        backgroundColor: selected ? color : 'transparent',
        color: selected ? '#fff' : color,
        fontSize:size
      }}
      onClick={handleClick}
    >
      {name}
    </button>
  );
};

export default Tag;
