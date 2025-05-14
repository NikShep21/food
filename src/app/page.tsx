"use client";

import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState, useMemo } from "react";
import { useGetRecipesQuery, useGetTagsQuery } from "@/feautures/recipes/recipesApi";
import FieldRecipes from "@/components/FieldRecipes/FieldRecipes";
import { RecipeType } from "@/feautures/recipes/types";
import styles from "./page.module.scss";
import Loader from "@/components/ui/Loader/Loader";
import TagSelector from "@/components/TagSelector/Tagselector";

export default function Home() {
  const { data: tags = [] } = useGetTagsQuery(null);
  const [page, setPage] = useState(1);
  const [allRecipes, setAllRecipes] = useState<RecipeType[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  const { data } = useGetRecipesQuery({ page });


  useEffect(() => {
    if (data?.results) {
      setAllRecipes((prev) => [...prev, ...data.results]);
    }
  }, [data]);

  
  const fetchMoreData = () => {
    if (data?.next) {
      setPage((prev) => prev + 1);
    }
  };

 
  const handleSelected = (param: number[]) => {
    setSelectedTags(param);
  };


const filteredRecipes = useMemo(() => {
  if (selectedTags.length === 0) return allRecipes;

  return allRecipes.filter((recipe) => {
    const recipeTagIds = recipe.tags.map((tag) => tag.id);
    const recipeTagSet = new Set(recipeTagIds);

    return selectedTags.every((tagId) => recipeTagSet.has(tagId));
  });
}, [selectedTags, allRecipes]);



  return (
    <main className={styles.mainContainer}>
      <div className={styles.innerContainer}>
        <h2>Тэги:</h2>
        <TagSelector tags={tags} selected={selectedTags} onChange={handleSelected} />

        <InfiniteScroll
          dataLength={filteredRecipes.length}
          next={fetchMoreData}
          hasMore={!!data?.next}
          loader={
            <div className={styles.loader}>
              <Loader size={30} />
            </div>
          }
        >
          <FieldRecipes data={filteredRecipes} />
        </InfiniteScroll>

      </div>
    </main>
  );
}
