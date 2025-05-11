import React from 'react';
import styles from './TagSelector.module.scss';
import Tag from '../ui/Tag/Tag';

export type TagType = { id: number; name: string; slug: string; color: string };

type Props = {
  tags: TagType[];
  selected: number[];
  layout:string
  onChange: (ids: number[]) => void;
};

const TagSelector: React.FC<Props> = ({ tags,layout, selected, onChange }) => {
  const toggle = (id: number) => {
    if (selected.includes(id)) {
      onChange(selected.filter(x => x !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className={styles.container}>
        <h2>{layout}</h2>
        <div className={styles.tagsContainer}>
            {tags.map(tag => (
                <Tag
                key={tag.id}
                id={tag.id}
                name={tag.name}
                color={tag.color}
                selected={selected.includes(tag.id)}
                onClick={toggle}
                />
            ))}

        </div>
    </div>
  );
};

export default TagSelector;
