"use client";
import styles from "./page.module.scss";
import { useParams } from "next/navigation";
import { useGetRecipeQuery } from "@/feautures/recipes/recipesApi";
import Tag from "@/components/ui/Tag/Tag";
import { BiTimer } from "react-icons/bi";
import User from "@/components/ui/User/User";

const page = () => {
  const params = useParams();

  const { data } = useGetRecipeQuery({ id: Number(params.id) });
  console.log(data);
  if (data)
    return (
      <main className={styles.mainContainer}>
        <section className={styles.sectionInfo}>

          <div className={styles.imageContainer}>
            <img className={styles.img} src={data.image} alt="" />
          </div>

          <div className={styles.baseInfo}>

            <h1 className={styles.name}>{data.name}</h1>

            <div className={styles.tags}>
              {data.tags.map((elem, id) => (
                <Tag key={id} size={18} name={elem.name} id={elem.id} />
              ))}
            </div>
            
            <div className={styles.timeCook}>
              <BiTimer size={40}/> 
              <p>{data.cooking_time} Мин</p>
              
            </div>
              
              <User username={data.author.username} avatar={data.author.avatar}/>
            <h2>Ингредиенты:</h2>
            <ul className={styles.ingredientsContainer}>
              {data.ingredients.map((elem, id) => (
                <li key={id}>
                  {elem.name} — {elem.amount}
                  {elem.measurement_unit}
                </li>
              ))}
            </ul>

          </div>

        </section>
        <section className={styles.textContainer}>
          <h2>Готовка</h2>
          {data.text}
        </section>
      </main>
    );
};

export default page;
