"use client";
import styles from "./page.module.scss";
import { useParams } from "next/navigation";
import { useGetRecipeQuery } from "@/feautures/recipes/recipesApi";
import Tag from "@/components/ui/Tag/Tag";
const page = () => {
  const params = useParams();

  const { data } = useGetRecipeQuery({ id: Number(params.id) });

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
