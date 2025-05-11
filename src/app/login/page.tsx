
import styles from './page.module.scss'
import AuthLogin from '@/components/Auth/AuthLogin'
 const login = () => {
    return(
        <div className={styles.loginContainer}>
            <AuthLogin/>
        </div>
    )
 }
 export default login