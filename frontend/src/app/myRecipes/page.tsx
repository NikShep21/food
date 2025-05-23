
"use client";

import { useEffect, useState } from "react";
import { useGetTagsQuery } from "@/feautures/recipes/recipesApi";
import TagSelector from "@/components/TagSelector/Tagselector";
import styles from './page.module.scss'
import LazyAllRecipes from "@/components/LazyLists/LazyAllRecipes";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function page() {
  const { data: tags = [] } = useGetTagsQuery(null);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
     const router = useRouter();
    
      const user = useSelector((state: RootState) => state.auth.user);
      
    
      useEffect(() => {
        if (!user) {
          router.push("/login");
        }
      }, [user, router]);
  const handleSelected = (param: number[]) => {
    setSelectedTags(param);
  };
  if(user)
  return (
    <main className={styles.mainContainer}>
      <div className={styles.innerContainer}>
        <h2>Тэги:</h2>
        <TagSelector tags={tags} selected={selectedTags} onChange={handleSelected} />
        <LazyAllRecipes access={true} selectedTags={selectedTags} id={user.id}/>
      </div>
    </main>
  );
}
