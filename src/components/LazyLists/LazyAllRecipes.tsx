"use client";

import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useGetRecipesQuery } from "@/feautures/recipes/recipesApi";
import { RecipeType } from "@/feautures/recipes/types";
import FieldRecipes from "@/components/FieldRecipes/FieldRecipes";
import Loader from "@/components/ui/Loader/Loader";

interface LazyAllRecipesProps {
  selectedTags?: number[];
  id?:number;
  is_favorited?:number
  access?:boolean // если нужно фильтровать по тегам
}

const LazyAllRecipes = ({ selectedTags = [],id, is_favorited, access = false }: LazyAllRecipesProps) => {
  const [page, setPage] = useState(1);
  const [recipes, setRecipes] = useState<RecipeType[]>([]);

  const { data } = useGetRecipesQuery({ page,
  is_favorited: is_favorited,
  author: id, });

  useEffect(() => {
    if (data?.results && page === 1) {
      setRecipes(data.results); // первая страница — перезаписываем
    } else if (data?.results) {
      setRecipes((prev) => [...prev, ...data.results]); // следующие — добавляем
    }
  }, [data, page]);

  const fetchMoreData = () => {
    if (data?.next) {
      setPage((prev) => prev + 1);
    }
  };
 
  // фильтрация по тегам, если переданы
  const filteredRecipes = selectedTags.length
    ? recipes.filter((recipe) => {
        const tagIds = recipe.tags.map((tag) => tag.id);
        return selectedTags.every((tagId) => tagIds.includes(tagId));
      })
    : recipes;
  if (filteredRecipes) console.log(filteredRecipes[1]);
  return (
    <InfiniteScroll
      dataLength={filteredRecipes.length}
      next={fetchMoreData}
      hasMore={!!data?.next}
      loader={
        <div style={{ padding: "30px", width: "100%" }}>
          <Loader size={30} />
        </div>
      }
    >
      <FieldRecipes  access={access} data={filteredRecipes} />
    </InfiniteScroll>
  );
};

export default LazyAllRecipes;
