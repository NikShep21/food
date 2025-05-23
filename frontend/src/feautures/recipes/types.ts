export interface GetIngredient{
    id:number
    name:string
    measurement_unit:string
}
interface IngredientInRecipe extends GetIngredient{
    amount:number
}
export interface Tags{
    id:number
    name:string
    slug:string
    color:string
}
export interface CreateRecipe {
  name: string;
  text: string;
  cooking_time: number;
  tags: number[];
  ingredients: { id: number; amount: number }[];
  image: string;         
}
export interface RecipeType {
    id:number
    name:string
    text:string
    image:string
    cooking_time:string
    author:{
        id:number
        email:string
        username:string
        first_name:string
        last_name:string
        avatar:null|string
        is_subscribed:boolean

    }
    tags:{
        id:number
        name:string
        slug:string
        color:string
    }[]
    ingredients:IngredientInRecipe[]
    is_favorited:boolean
    is_in_shopping_card:boolean
}
export interface fullRecipe{
    count:number
    next:string|null
    previous:string|null
    results:RecipeType[]
}