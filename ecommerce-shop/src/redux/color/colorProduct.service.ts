import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  colorProduct,
  ColorResponse,
  ColorsResponse,
} from "./colorProduct.type";
import { baseUrl } from "../../api";
import { RootState } from "../store";

export const colorApi = createApi({
  reducerPath: "colorApi",
  tagTypes: ["Colors"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/colors/`,
    prepareHeaders: (headers, { getState }) => {
          const token = (getState() as RootState).auth.accessToken; 
          if (token) {
            headers.set("Authorization", `Bearer ${token}`);
          }
          return headers;
        },
  }),

  endpoints: (build) => ({
    getAllColors: build.query<ColorsResponse, void>({
      query: () => "all",
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Colors" as const, id })),
              { type: "Colors", id: "LIST" },
            ]
          : [{ type: "Colors", id: "LIST" }],
    }),

    getColor: build.query<ColorResponse, number>({
      query: (id) => ({
        url: `${id}/color`,
      }),
    }),

    addColor: build.mutation<ColorResponse, Omit<colorProduct, "id">>({
      query(body) {
        return {
          url: "add",
          method: "POST",
          body,
        };
      },
      invalidatesTags: [{ type: "Colors", id: "LIST" }],
    }),

    updateColor: build.mutation<
      ColorResponse,
      { id: number; body: colorProduct }
    >({
      query(data) {
        return {
          url: `color/${data.id}/update`,
          method: "PUT",
          body: data.body,
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: "Colors", id }],
    }),

    deleteColor: build.mutation<ColorResponse, number>({
      query(id) {
        return {
          url: `color/${id}/delete`,
          method: "DELETE",
        };
      },

      invalidatesTags: (result, error, id) => [{ type: "Colors", id }],
    }),
  }),
});

export const {
  useGetAllColorsQuery,
  useGetColorQuery,
  useAddColorMutation,
  useUpdateColorMutation,
  useDeleteColorMutation,
} = colorApi;
