"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useGetTagsQuery } from "@/feautures/recipes/recipesApi";
import styles from "./page.module.scss";
import {
  useGetIngredientsQuery,
  useCreateRecipeMutation,
} from "@/feautures/recipes/recipesApi";
import CreateRecipe, {
  RecipeFormValues,
} from "@/components/CreateRecipe/CreateRecipe";
import { useAuth } from "@/shared/hooks/useAuth"; // убедись, что путь правильный

export default function CreateRecipePage() {
  const router = useRouter();
  const { isAuth } = useAuth();

  // ⛔ Редирект, если не авторизован
  useEffect(() => {
    if (!isAuth) {
      router.push("/login"); // или другой путь к авторизации
    }
  }, [isAuth, router]);

  const { data: tagData = [] } = useGetTagsQuery(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RecipeFormValues>({
    defaultValues: {
      name: "",
      text: "",
      cooking_time: 1,
      tags: [],
      ingredients: [],
      image: "",
    },
  });

  const { data: ingredientsData, isLoading: ingredientsLoading } =
    useGetIngredientsQuery(null);
  const [createRecipe, { isLoading: creating }] = useCreateRecipeMutation();

  const onSubmit = async (formData: any) => {
    try {
      const res = await createRecipe(formData).unwrap();
      router.push("/");
    } catch (err) {
      console.error("Ошибка при создании рецепта:", err);
    }
  };

  return (
    <main className={styles.mainContainer}>
     
      {!isAuth ? null : (
        <CreateRecipe
          control={control}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          creating={creating}
          ingredientsData={ingredientsData}
          tagData={tagData}
        />
      )}
    </main>
  );
}
