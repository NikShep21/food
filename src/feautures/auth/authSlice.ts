import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import Cookies from 'js-cookie'
import { UserType } from './types'

interface AuthState {
  user: UserType | null
  initialized: boolean,
 
}

const initialState: AuthState = {
  user: null,
  initialized: false,

}

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        setUser(state, action: PayloadAction<UserType>){
            state.user = action.payload
        },
        logout: (state) => {
            state.user = null;
           
            Cookies.remove('token');
        },
        setInitialized: (state) => {
            state.initialized = true;
        },
    }
})
export const {setUser, logout, setInitialized} = authSlice.actions
export default authSlice.reducer