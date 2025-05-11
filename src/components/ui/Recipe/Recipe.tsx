import { RecipeType } from '@/feautures/recipes/types'
import styles from './Recipe.module.scss'
import React from 'react'
import Tag from '../Tag/Tag'
import MyBtn from '../MyBtn/MyBtn'
import Link from 'next/link'

const Recipe = ({data}:{data:RecipeType}) => {
    console.log(data)
  return (
    <div className={styles.recipeContainer}>
        <div className={styles.imageContainer}>
            <img className={styles.img} src={data.image} alt="" />
        </div>
        <div className={styles.contentContainer}>
            <h2 className={styles.name}>{data.name}</h2>
            <div className={styles.TimeCook}>Время готовки {data.cooking_time} Минут</div>
            <div className={styles.tags}>
                {
                    data.tags.map((elem,id)=>(
                        <Tag size={11} name={elem.name} id={elem.id} />
                    ))
                }
            </div>
            <div className={styles.user}>
                <p>{data.author.username}</p>
            </div>
            <div className={styles.buttonContainer}>
                <MyBtn>
                    <Link href={`recipe/${data.id}`}>Смотреть</Link>
                </MyBtn>
            </div>
        </div>
    </div>
  )
}

export default Recipe