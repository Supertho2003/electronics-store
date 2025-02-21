import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  ApiResponse,
  OrderDto,
  OrderResponseWithPaymentUrl,
} from "./order.type";
import { RootState } from "../store"; 
import { AddAddressRequest } from "../address/address.type";
import { baseUrl } from "../../api";

export const orderApi = createApi({
  reducerPath: "orderApi",
  tagTypes: ["Orders"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/orders/`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (build) => ({
    getAllOrders: build.query<any, void>({
      query: () => "/all",
      providesTags: ["Orders"],
    }),
    createOrder: build.mutation<
      any,
      {
        address: AddAddressRequest;
        note: string;
        paymentMethod: string;
        deliveryMethod: string;
        discountAmount: number;
        totalPayable : number;
      }
    >({
      query: ({
        address,
        note,
        paymentMethod,
        deliveryMethod,
        discountAmount,
        totalPayable
      }) => ({
        url: `/place?note=${encodeURIComponent(
          note
        )}&paymentMethod=${encodeURIComponent(
          paymentMethod
        )}&deliveryMethod=${encodeURIComponent(
          deliveryMethod
        )}&discountAmount=${discountAmount}&totalPayable=${totalPayable}`, 
        method: "POST",
        body: address,
      }),
      invalidatesTags: ["Orders"],
    }),
    getOrderById: build.query<any, number>({
      query: (orderId) => `/${orderId}/order`,
      providesTags: (result, error, orderId) => [
        { type: "Orders", id: orderId },
      ],
    }),
    getUserOrders: build.query<ApiResponse<OrderDto[]>, number>({
      query: (userId) => `/user/${userId}/order`,
      providesTags: (result, error, userId) => [{ type: "Orders", id: userId }],
    }),
    updateOrderStatus: build.mutation<
      any,
      { orderId: number; newStatus: string }
    >({
      query: ({ orderId, newStatus }) => ({
        url: `/${orderId}/update-status?newStatus=${encodeURIComponent(
          newStatus
        )}`,
        method: "PUT",
      }),
      invalidatesTags: ["Orders"],
    }),
    getTotalOrders: build.query<ApiResponse<number>, void>({
      query: () => "/total-orders",
    }),
    getUserOrdersByStatus: build.query<any, string>({
      query: (status) => `/user/status/${status}`,
      providesTags: (result, error) => [{ type: "Orders", id: "LIST" }],
    }),
    getTotalSales: build.query<ApiResponse<number>, void>({
      query: () => "/total-sales",
    }),
    getTotalItemsSold: build.query<ApiResponse<number>, void>({
      query: () => "/total-items-sold",
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useCreateOrderMutation,
  useGetOrderByIdQuery,
  useGetUserOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetTotalOrdersQuery,
  useGetTotalSalesQuery,
  useGetUserOrdersByStatusQuery,
  useGetTotalItemsSoldQuery,
} = orderApi;
