'use client'
import styles from "./page.module.scss";
import { useGetRecipesQuery } from "@/feautures/recipes/recipesApi";
import { useEffect, useState } from "react";
import FieldRecipes from "@/components/FieldRecipes/FieldRecipes";
import { RecipeType } from "@/feautures/recipes/types";

export default function Home() {
  const {data} = useGetRecipesQuery(null)
  const [Cards, setCards] = useState<undefined|RecipeType[]>(undefined)
  useEffect(()=>{
    setCards(data)
  },[data])
  
  return (
    <main className={styles.mainContainer}>
      <FieldRecipes data={Cards}/>
    </main>
  );
}
