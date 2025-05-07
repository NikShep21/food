import Auth from '@/components/Auth/Auth'
import styles from './page.module.scss'
const register = () => {
   return(
       <div className={styles.registerContainer}>
            
                <Auth type='Register'/>
            
       </div>
   )
}
export default register