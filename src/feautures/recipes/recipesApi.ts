import { authApi, publicApi } from "@/shared/api/baseApi";
import { CreateRecipe, fullRecipe, GetIngredient, RecipeType, Tags } from "./types";

// 🔧 ВАЖНО: указываем типы тегов для кэширования
const tagTypes = ["Recipes", "Recipe", "Tags", "Ingredients"] as const;

export const recipesWithAuth = authApi.injectEndpoints({
  endpoints: (build) => ({
    CreateRecipe: build.mutation<any, CreateRecipe>({
      query: (data) => ({
        url: "recipes/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Recipes", id: "LIST" }],
    }),

    changeFavorite: build.mutation<any, { type: "POST" | "DELETE"; id: number }>({
      query: ({ type, id }) => ({
        url: `recipes/${id}/favorite/`,
        method: type,
      }),
      // можно не инвалидировать, если это только внутри рецепта
    }),

    GetRecipes: build.query<fullRecipe, {
      page: number;
      tags?: string[];
      is_favorited?: number;
      author?: number;
    }>({
      query: ({ page, tags, is_favorited, author }) => {
        const params: Record<string, any> = { page };
        if (tags) params.tags = tags;
        if (is_favorited !== undefined) params.is_favorited = is_favorited;
        if (author !== undefined) params.author = author;

        return {
          url: "recipes/",
          method: "GET",
          params,
        };
      },
      // 📦 Обозначаем, что этот запрос предоставляет список рецептов
      providesTags: (result) =>
        result?.results
          ? [
              ...result.results.map((recipe) => ({ type: "Recipes" as const, id: recipe.id })),
              { type: "Recipes", id: "LIST" },
            ]
          : [{ type: "Recipes", id: "LIST" }],
    }),

    changeRecipe: build.mutation<any, { type: "PATCH" | "DELETE"; id: number }>({
      query: ({ type, id }) => ({
        url: `recipes/${id}/`,
        method: type,
      }),
      // ❗ Инвалидируем конкретный рецепт и список
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Recipes", id },
        { type: "Recipes", id: "LIST" },
      ],
    }),
  }),

  // 👇 Добавляем глобально типы тегов
  overrideExisting: true,
});

export const recipesWithoutAuth = publicApi.injectEndpoints({
  endpoints: (build) => ({
    GetIngredients: build.query<GetIngredient[], null>({
      query: () => ({
        url: "ingredients/",
        method: "GET",
      }),
      providesTags: [{ type: "Ingredients", id: "LIST" }],
    }),

    GetTags: build.query<Tags[], null>({
      query: () => ({
        url: "tags/",
        method: "GET",
      }),
      providesTags: [{ type: "Tags", id: "LIST" }],
    }),

    GetRecipe: build.query<RecipeType, { id: number }>({
      query: ({ id }) => ({
        url: `recipes/${id}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, { id }) => [{ type: "Recipes", id }],
    }),
  }),

  overrideExisting: true,
});

export const {
  useCreateRecipeMutation,
  useGetRecipesQuery,
  useChangeFavoriteMutation,
  useChangeRecipeMutation,
} = recipesWithAuth;

export const {
  useGetIngredientsQuery,
  useGetTagsQuery,
  useGetRecipeQuery,
} = recipesWithoutAuth;
