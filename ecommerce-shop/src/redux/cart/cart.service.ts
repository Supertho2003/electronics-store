import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../api";
import { RootState } from "../store";
import { CartResponse } from './cart.type';

export const cartApi = createApi({
    reducerPath: 'cartApi',
    tagTypes: ['Carts'],
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseUrl}/carts/`,
        prepareHeaders: (headers, { getState }) => {
           
            const token = (getState() as RootState).auth.accessToken; 
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (build) => ({
        getCart: build.query<any, void>({
             query: () => "my-cart",
             providesTags: (result) => 
               result ? 
                 [
                   { type: 'Carts', id: 'LIST' }
                 ] : 
                 [{ type: 'Carts', id: 'LIST' }],
           }),
    }),
});


export const { useGetCartQuery } = cartApi;
