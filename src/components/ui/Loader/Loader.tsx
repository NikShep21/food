import React from 'react';
import styles from './Loader.module.scss';




const Loader = ({ size = 30 }:{size?:number}) => {
  return (
    
        <span
          className={styles.spinner}
          style={{ 
              '--size': `${size}px`
    } as React.CSSProperties} 
        />
    
    
  );
};

export default Loader;
