import { RecipeType } from "@/feautures/recipes/types";
import React from "react";
import styles from "./FieldRecipes.module.scss";

import Recipe from "../ui/Recipe/Recipe";

const FieldRecipes = ({
  data,
  access = false,
 
}: {
  data: RecipeType[] | undefined;
  access?: boolean;

}) => {
  if (data)
    return (
      <section className={styles.mainContainer}>
        {data.map((elem, id) => (
          <Recipe access={access} key={id} data={elem}  />
        ))}
      </section>
    );
};

export default FieldRecipes;
