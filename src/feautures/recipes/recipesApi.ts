import { authApi, publicApi } from "@/shared/api/baseApi";
import { METHODS } from "http";
import { url } from "inspector";
import { CreateRecipe, fullRecipe, GetIngredient, RecipeType, Tags } from "./types";

export const recipesWithAuth = authApi.injectEndpoints({
    endpoints: (build)=>({
        CreateRecipe: build.mutation<any, CreateRecipe>({
            query: (data) =>({
                url:'recipes/',
                method:'POST',
                body:data
            })

        })

    })
})

export const recipesWithoutAuth =  publicApi.injectEndpoints({
    endpoints: (build)=>({
        GetIngredients: build.query<GetIngredient[],null>({
            query: () =>({
                url:'ingredients/',
                method:'GET',
                
            })

        }),
        GetTags:build.query<Tags[],null>({
            query: () =>({
                url:"tags/",
                method:'GET'
            })
        }),
       GetRecipes: build.query<fullRecipe, { page: number; tags?: string[];}>({
        query: ({ page, tags}) => ({
            url: 'recipes/',
            method: 'GET',
            params: {
            page,
            tags   

            }
        })
        }),

        GetRecipe:build.query<RecipeType,{id:number}>({
            query: (data) =>({
                url:`recipes/${data.id}/`,
                method: 'GET'
            }),
            
        }),
        
        
})  })

export const {useCreateRecipeMutation} = recipesWithAuth
export const {useGetIngredientsQuery, useGetTagsQuery, useGetRecipesQuery, useGetRecipeQuery} = recipesWithoutAuth