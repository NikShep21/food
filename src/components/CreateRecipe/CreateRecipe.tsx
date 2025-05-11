import { GetIngredient, Tags } from "@/feautures/recipes/types";
import React from "react";
import { Control, Controller, UseFormHandleSubmit } from "react-hook-form";
import DropDownList, {
  SelectedIngredient,
} from "../ui/DropDownList/DropDownList";
import MyInput from "../ui/MyInput/MyInput";
import DropZone from "../ui/DropZone/DropZone";
import styles from "./CreateRecipe.module.scss";
import MyBtn from "../ui/MyBtn/MyBtn";
import TagSelector from "../TagSelector/Tagselector";
import Mytextarea from "../ui/MyTextarea/Mytextarea";

export interface RecipeFormValues {
  name: string;
  text: string;
  cooking_time: number;
  ingredients: SelectedIngredient[];
  image: string | null;
  tags: number[];
}

export interface CreateRecipeProps {
  control: Control<RecipeFormValues>;
  handleSubmit: UseFormHandleSubmit<RecipeFormValues>;
  onSubmit: (data: RecipeFormValues) => void;
  creating: boolean;
  ingredientsData?: GetIngredient[];
  tagData: Tags[];
}
const CreateRecipe = ({
  control,
  handleSubmit,
  onSubmit,
  creating,
  ingredientsData,
  tagData,
}: CreateRecipeProps) => {
  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      {/* Поле: изображение (загрузчик файлов) */}
      <section className={styles.baseDescriptionContainer}>
        <Controller
          name="image"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <DropZone value={field.value} onChange={field.onChange} />
          )}
        />
        <div className={styles.baseDescription}>
          {/* Поле: название рецепта */}
          <Controller
            name="name"
            control={control}
            rules={{ required: "Введите название рецепта" }}
            render={({ field, fieldState }) => (
              <MyInput
                label="Название"
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
          {/* Поле: время приготовления */}
          <div className={styles.cookTime}>
            <span>Время приготовления:</span>
            <Controller
              name="cooking_time"
              control={control}
              rules={{
                required: "Укажите время приготовления",
                min: { value: "1", message: "Минимальное значение — 1" },
              }}
              render={({ field, fieldState }) => (
                <MyInput
                  type="number"
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                />
              )}
            />
          </div>
          <Controller
            name="ingredients"
            control={control}
            rules={{
              validate: (value) =>
                (value && value.length > 0) ||
                "Добавьте хотя бы один ингредиент",
            }}
            render={({ field, fieldState }) => (
              <DropDownList
                ingredients={ingredientsData || []}
                selected={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </section>

     
      <section className={styles.mainDescription}>
        <Controller
          name="tags"
          control={control}
          rules={{
            validate: (v) => (v && v.length > 0) || "Выберите хотя бы один тег",
          }}
          render={({ field, fieldState }) => (
            <>
              <TagSelector
                layout='Выберите тэги'
                tags={tagData} // все теги
                selected={field.value || []} // выбранные ID
                onChange={field.onChange} // установка новых ID
              />
              {fieldState.error && (
                <p className={styles.error}>{fieldState.error.message}</p>
              )}
            </>
          )}
        />
        <Controller
          name="text"
          control={control}
          rules={{ required: "Введите описание" }}
          render={({ field, fieldState }) => (
            <Mytextarea
              label="Описание"
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />
        <div>
          <MyBtn type="submit" disabled={creating}>
            {creating ? "Сохраняем..." : "Создать рецепт"}
          </MyBtn>
        </div>
      </section>

      {/* Поле: ингредиенты (мультивыбор) */}
    </form>
  );
};

export default CreateRecipe;
