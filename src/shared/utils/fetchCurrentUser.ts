import { store } from "@/store/store"; 
import { authWithJWT } from "@/feautures/auth/authApi"; 
import { setUser } from "@/feautures/auth/authSlice";
import Cookies from "js-cookie";

export const fetchCurrentUser = async () => {
  try {
    const token = Cookies.get('token');
    console.log(token)
    if (!token) {
      console.warn("No token found in cookies.");
      return null;
    }

    const result = await store.dispatch(authWithJWT.endpoints.getInfoUser.initiate(null));

    if ('data' in result && result.data) {
      store.dispatch(setUser(result.data));
      return result.data;
    } else {
      console.error("Error fetching user:", result.error);
      return null;
    }

  } catch (error) {
    console.error("Unexpected error while fetching user:", error);
    return null;
  }
}
