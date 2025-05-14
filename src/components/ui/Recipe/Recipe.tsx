import { RecipeType } from "@/feautures/recipes/types";
import styles from "./Recipe.module.scss";
import React from "react";
import Tag from "../Tag/Tag";
import MyBtn from "../MyBtn/MyBtn";
import Link from "next/link";
import { BiTimer } from "react-icons/bi";
import { truncateText } from "@/shared/utils/utils";
import User from "../User/User";
import { IoBookmark } from "react-icons/io5";

const Recipe = ({ data }: { data: RecipeType }) => {
  const handleFavorite = ()=>{
    
  }
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
            <Link href={`recipe/${data.id}`}>Читать</Link>
          </MyBtn>
          <button style={data.is_favorited? {color:'#b69a94'}:{color:'gray'}} className={styles.bookMark}>

            <IoBookmark size={30}/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Recipe;
