import { createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { BASE_API } from "../constants";
import { RootState } from "../../store/store";
import Cookies from "js-cookie";

const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: BASE_API,

  prepareHeaders: (headers) => {
    const token = Cookies.get('token');
    console.log(token)
    if (token) headers.set("Authorization", `Token ${token}`);
    return headers;
  },
});


const baseQueryWithoutAuth = fetchBaseQuery({
  baseUrl: BASE_API,
});


export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithAuth,
  endpoints: () => ({}),
});

export const publicApi = createApi({
  reducerPath: "publicApi",
  baseQuery: baseQueryWithoutAuth,
  endpoints: () => ({}),
});