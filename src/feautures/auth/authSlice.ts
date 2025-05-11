import {createSlice, PayloadAction} from '@reduxjs/toolkit'

type User = {
 
    username: string
    email:string
    first_name:string
    last_name:string
}
interface AuthState {
  user: User | null
  initialized: boolean
}

const initialState: AuthState = {
  user: null,
  initialized: false
}

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        setUser(state, action: PayloadAction<User>){
            state.user = action.payload
        },
        clearUser(state){
            state.user = null
        },
        setInitialized(state){
            state.initialized = true
        }
    }
})
export const {setUser, clearUser, setInitialized} = authSlice.actions
export default authSlice.reducer