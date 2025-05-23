"use client";
import { RecipeType } from "@/feautures/recipes/types";
import styles from "./Recipe.module.scss";
import React, { useState } from "react";
import Tag from "../Tag/Tag";
import MyBtn from "../MyBtn/MyBtn";
import Link from "next/link";
import { BiTimer } from "react-icons/bi";
import { truncateText } from "@/shared/utils/utils";
import User from "../User/User";
import { IoBookmark } from "react-icons/io5";
import {
  useChangeFavoriteMutation,
  useChangeRecipeMutation,
} from "@/feautures/recipes/recipesApi";
import clsx from "clsx";

const Recipe = ({
  data,
  access = false,

}: {
  data: RecipeType;
  access?: boolean;
 
}) => {
  const [changeMutation] = useChangeFavoriteMutation();

  const [changeRecipe] = useChangeRecipeMutation();
  const [isFavorited, setIsFavorited] = useState<boolean>(data.is_favorited);
  console.log(data.is_favorited);

  const handleFavorite = async () => {
    try {
      await changeMutation({
        id: data.id,
        type: isFavorited ? "DELETE" : "POST",
      }).unwrap();
      setIsFavorited((prev) => !prev);
    } catch (e) {
      console.error("error favorite", e);
    }
  };
  const handeRecipe = async () => {
    try {
      await changeRecipe({
        id: data.id,
        type: "DELETE",
      }).unwrap();
     
    } catch (e) {
      console.error("error delete recipe", e);
    }
  };
  return (
    <div className={styles.recipeContainer}>
      <div className={styles.imageContainer}>
        <img className={styles.img} src={data.image} alt="" />
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.firstST}>
          <h2 className={styles.name}>{truncateText(data.name, 30)}</h2>
          <div className={styles.timeCook}>
            <BiTimer size={35} />
            <div>{data.cooking_time} Мин</div>
          </div>
        </div>
        <div className={styles.tags}>
          {data.tags.slice(0, 3).map((elem, id) => (
            <Tag key={id} size={11} name={elem.name} id={elem.id} />
          ))}
          {data.tags.length > 3 && <span className={styles.ellipsis}>...</span>}
        </div>
        <div className={styles.user}>
          <User username={data.author.username} avatar={data.author.avatar} />
        </div>
        <div className={styles.buttonContainer}>
          <MyBtn>
            <Link href={`/recipe/${data.id}`}>Читать</Link>
          </MyBtn>
          {access ? (
            <MyBtn onClick={handeRecipe} style={{ backgroundColor: "#751b08" }}>
              Удалить
            </MyBtn>
          ) : null}

          <button
            onClick={handleFavorite}
            className={clsx(
              styles.bookMark,
              isFavorited ? styles.favoriteBookMark : null
            )}
          >
            <IoBookmark size={30} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Recipe;
