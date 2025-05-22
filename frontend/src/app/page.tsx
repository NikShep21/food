// page.tsx
"use client";

import { useState } from "react";
import { useGetTagsQuery } from "@/feautures/recipes/recipesApi";
import TagSelector from "@/components/TagSelector/Tagselector";
import styles from "./page.module.scss";
import LazyAllRecipes from "@/components/LazyLists/LazyAllRecipes";

export default function Home() {
  const { data: tags = [] } = useGetTagsQuery(null);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  const handleSelected = (param: number[]) => {
    setSelectedTags(param);
  };

  return (
    <main className={styles.mainContainer}>
      <div className={styles.innerContainer}>
        <h2>Тэги:</h2>
        <TagSelector tags={tags} selected={selectedTags} onChange={handleSelected} />
        <LazyAllRecipes selectedTags={selectedTags} />
      </div>
    </main>
  );
}
