import Cookies from "js-cookie";

export const useAuth = ()=>{
    
    const token = Cookies.get('token')
    
    const isAuth = Boolean(token)
    return {isAuth}

}