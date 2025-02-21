import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AddAddressRequest, AddressResponse } from "./address.type"; // Đảm bảo bạn đã định nghĩa các kiểu này
import { baseUrl } from "../../api";
import { RootState } from "../store";

export const addressApi = createApi({
  reducerPath: "addressApi",
  tagTypes: ["Addresses"], // Tag cho địa chỉ
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/addresses/`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken; 
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (build) => ({
    addAddress: build.mutation<AddressResponse, Omit<AddAddressRequest, "id">>({
      query(body) {
        return {
          url: `addresses/add`, 
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Addresses"], 
    }),

    updateAddress: build.mutation<any, { addressId: number; body: AddAddressRequest }>({
      query({ addressId, body }) {
        return {
          url: `addresses/${addressId}/update`,
          method: "PUT",
          body: body,
        };
      },
      invalidatesTags: ["Addresses"], 
    }),

    getAddresses: build.query<any, void>({
      query: () => "users/addresses",
      providesTags: ["Addresses"], 
    }),

    getAddressById: build.query<any, number>({
      query: (addressId) => `addresses/${addressId}`, 
      providesTags: ["Addresses"],
    }),

  
    deleteAddress: build.mutation<any, number>({
      query: (addressId) => ({
        url: `addresses/${addressId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Addresses"], 
    }),
  }),
});


export const { 
  useAddAddressMutation, 
  useUpdateAddressMutation, 
  useGetAddressesQuery,
  useGetAddressByIdQuery, 
  useDeleteAddressMutation, 
} = addressApi;