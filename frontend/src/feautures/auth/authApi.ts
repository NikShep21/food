    import cookies from 'js-cookie'
    import {authApi, publicApi} from '../../shared/api/baseApi'
    import { Errors, loginResponse, RegisterResponse, UserType } from './types';
    import { headers } from 'next/headers';



    type QueryFulfilled = { data: { auth_token: string }, meta?:any };

    const handleToken = async (queryFulfilled: Promise<QueryFulfilled>) => {
        
        try {
        
            const { data } = await queryFulfilled;
        
            const token = data.auth_token;
            
            if (token) {
                cookies.set('token', token, {
                    secure: false, 
                    expires: 7,
                    sameSite: 'Strict',
                });
                
            } else {
                console.error('Token not found in response');
            }
        } catch (error) {
            console.error('Error processing token: ', error);
        }
    };


    export const auth = publicApi.injectEndpoints({
        endpoints: (build) => ({
            register: build.mutation<{email:string, first_name:string, last_name:string}, RegisterResponse>  ({
                query: (data) => ({
                    url: 'users/',
                    method: 'POST',
                    body: data,
                }),
                
            }),
            
            login: build.mutation<{auth_token:string}, loginResponse, Errors>  ({
                query: (data) => ({
                    url: '/auth/token/login/',
                    method: 'POST',
                    body: data,
                }),
                onQueryStarted: async (arg, {queryFulfilled }) =>{
                await handleToken(queryFulfilled)
                }
            }),
        

        })
    })


export const authWithJWT = authApi.injectEndpoints({
  endpoints: (build) => ({
    getInfoUser: build.query<UserType, null>({
      query: () => ({
        url: 'users/me/',
        method: 'GET',
      }),
      providesTags: ['User'],  
    }),

    setAvatar: build.mutation<any, { avatar: string }>({
      query: (data) => ({
        url: '/users/me/avatar/',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User', 'Recipes'],  
    }),
  }),
});

    export const {useLoginMutation, useRegisterMutation} = auth
    export const {useGetInfoUserQuery, useSetAvatarMutation} = authWithJWT
