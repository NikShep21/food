
import styles from './page.module.scss'
import AuthRegister from '@/components/Auth/AuthRegister'
const register = () => {
   return(
       <div className={styles.registerContainer}>
            
                <AuthRegister/>
            
       </div>
   )
}
export default register