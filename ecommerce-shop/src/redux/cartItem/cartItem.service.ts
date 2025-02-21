import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../api";
import { RootState } from "../store";

export const cartItemApi = createApi({
    reducerPath: 'cartItemApi',
    tagTypes: ['Carts'],
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseUrl}/cartItems/`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.accessToken; 
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (build) => ({
        addCart: build.mutation<{ message: string; cartId: number }, { productId: number; quantity: number,colorId: number }>({
            query(body) {
                return {
                    url: `item/add?productId=${body.productId}&quantity=${body.quantity}&colorId=${body.colorId}`,
                    method: 'POST',
                };
            },
            invalidatesTags: [{ type: 'Carts', id: 'LIST' }, { type: 'Carts', id: 'TOTAL_QUANTITY' }],
        }),
        
        removeItem: build.mutation<{ message: string }, { itemId: number }>({
            query({ itemId }) {
                return {
                    url: `cart/item/${itemId}/remove`,
                    method: 'DELETE',
                };
            },
            invalidatesTags: [{ type: 'Carts', id: 'LIST' }, { type: 'Carts', id: 'TOTAL_QUANTITY' }],
        }),

        updateItemQuantity: build.mutation<{ message: string }, { itemId: number; quantity: number }>({
            query({  itemId, quantity }) {
                return {
                    url: `cart/item/${itemId}/update?quantity=${quantity}`,
                    method: 'PUT',
                };
            },
            invalidatesTags: [{ type: 'Carts', id: 'LIST' }, { type: 'Carts', id: 'TOTAL_QUANTITY' }],
        }),
        getTotalQuantity: build.query<{ message: string; data: number }, void>({
            query: () => `total-quantity`, 
            providesTags: [{ type: 'Carts', id: 'TOTAL_QUANTITY' }],
        }),
    }),
});

export const { useAddCartMutation, useRemoveItemMutation, useUpdateItemQuantityMutation, useGetTotalQuantityQuery } = cartItemApi;
