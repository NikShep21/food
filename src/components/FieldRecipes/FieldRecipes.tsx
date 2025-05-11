import { RecipeType } from '@/feautures/recipes/types'
import React from 'react'
import styles from './FieldRecipes.module.scss'

import Recipe from '../ui/Recipe/Recipe'

const FieldRecipes = ({data}:{data:RecipeType[] | undefined}) => {
    if (data)
  return (
    <section className={styles.mainContainer}>
        {
           data.map((elem,id)=>(
            <Recipe key = {id} data = {elem}/>
           ))
        }
    </section>
  )
}

export default FieldRecipes