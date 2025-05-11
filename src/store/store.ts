import { configureStore } from "@reduxjs/toolkit";
import {publicApi, authApi} from "../shared/api/baseApi";
import authReducer from '../feautures/auth/authSlice'
export const store = configureStore({
    

    reducer: {
        [publicApi.reducerPath]:publicApi.reducer,
        [authApi.reducerPath]:authApi.reducer,
        auth: authReducer,
        
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
        .concat(authApi.middleware)
        .concat(publicApi.middleware),

    });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;