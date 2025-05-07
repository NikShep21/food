import MyBtn from "../ui/MyBtn/MyBtn";
import styles from "./Auth.module.scss";

const Auth = ({type}:{type:'Register'|'Login'}) => {
    return(
        <div className={styles.authContainer}>
            <h2 className={styles.header}>{type}</h2>
            <form className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" required/>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" required/>
                </div>
                {type === 'Register' && (
                    <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input type="password" id="confirmPassword" required/>
                    </div>
                )}
                <div className={styles.formGroup}>
                    <MyBtn>{type}</MyBtn>
                    
                </div>
            </form>
        </div>
    )
    
}
export default Auth