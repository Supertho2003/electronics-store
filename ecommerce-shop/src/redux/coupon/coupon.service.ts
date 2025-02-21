import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../api";
import { RootState } from "../store";
import { Coupon } from "./coupon.type";

export const couponApi = createApi({
  reducerPath: "couponApi",
  tagTypes: ["Coupons"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/coupons/`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (build) => ({
    getAllCoupons: build.query<any, void>({
      query: () => "all",
    }),

    addCoupon: build.mutation<any, Omit<Coupon, "id">>({
      query(body) {
        return {
          url: "add",
          method: "POST",
          body,
        };
      },
      invalidatesTags: [{ type: "Coupons", id: "LIST" }],
    }),

    updateCoupon: build.mutation<any, { id: number; body: Coupon }>({
      query({ id, body }) {
        return {
          url: `${id}/update`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Coupons", id },
        { type: "Coupons", id: "LIST" },
      ], 
    }),

    getCouponById: build.query<any, number>({
      query: (id) => `coupon/${id}`,
    }),

    deleteCoupon: build.mutation<any, number>({
      query(id) {
        return {
          url: `${id}/delete`,
          method: "DELETE",
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: "Coupons", id },
        { type: "Coupons", id: "LIST" },
      ], // Làm mới danh sách mã giảm giá
    }),

    applyDiscount: build.mutation<any, string>({
      query(discountCode) {
        return {
          url: `apply-discount?discountCode=${encodeURIComponent(
            discountCode
          )}`, // Send as query parameter
          method: "POST",
        };
      },
    }),
    setActiveStatus: build.mutation<any, { id: number; isActive: boolean }>({
      query({ id, isActive }) {
        return {
          url: `${id}/active?isActive=${isActive}`,
          method: "PUT",
        };
      },
      invalidatesTags: [{ type: "Coupons", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllCouponsQuery,
  useAddCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useApplyDiscountMutation,
  useGetCouponByIdQuery,
  useSetActiveStatusMutation,
} = couponApi;
