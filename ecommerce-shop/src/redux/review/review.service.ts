import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../api";
import { Review } from "./review.type";
import { RootState } from "../store";

export const reviewApi = createApi({
  reducerPath: "reviewApi",
  tagTypes: ["Reviews"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/reviews/`,
      prepareHeaders: (headers, { getState }) => {
          const token = (getState() as RootState).auth.accessToken;
          if (token) {
            headers.set("Authorization", `Bearer ${token}`);
          }
          return headers;
        },
  }),

  endpoints: (build) => ({
    getAllReviews: build.query<any, void>({
      query: () => "all",
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }: { id: number }) => ({
                type: "Reviews" as const,
                id,
              })),
              { type: "Reviews", id: "LIST" },
            ]
          : [{ type: "Reviews", id: "LIST" }],
    }),

  
     getVisibleReviewsByProduct: build.query<any, { productId: number }>({
      query: ({ productId }) => ({
        url: `/review/${productId}/visible`,
      }),
    }),
    

    getAllReviewsProduct: build.query<any, { productId: number }>({
      query: ({ productId }) => ({
        url: `/review/${productId}/by-product`,
      }),
    }),

    addReview: build.mutation<{ message: string }, Omit<Review, "id">>({
      query(body) {
        return {
          url: "add",
          method: "POST",
          body,
        };
      },
     
      invalidatesTags: (result, error, { productId }) => [
        { type: "Reviews", id: "LIST" }, 
        { type: "Reviews", id: productId }, 
      ],
    }),

    hideReview: build.mutation<{ message: string }, { reviewId: number }>({
      query: ({ reviewId }) => ({
        url: `/review/${reviewId}/hide`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, { reviewId }) => [
        { type: "Reviews", id: reviewId },
        { type: "Reviews", id: "LIST" },
      ],
    }),
    
    unhideReview: build.mutation<{ message: string }, { reviewId: number }>({
      query: ({ reviewId }) => ({
        url: `/review/${reviewId}/unhide`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, { reviewId }) => [
        { type: "Reviews", id: reviewId },
        { type: "Reviews", id: "LIST" },
      ],
    }),
    

   
  }),
});

export const {
  useAddReviewMutation,
  useGetAllReviewsProductQuery,
  useGetAllReviewsQuery,
  useHideReviewMutation,
  useUnhideReviewMutation,
  useGetVisibleReviewsByProductQuery,
} = reviewApi;
