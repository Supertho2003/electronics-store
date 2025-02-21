import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CategoriesResponse, Category, CategoryResponse } from "./category.type";
import { baseUrl } from "../../api";
import { RootState } from "../store";


export const categoryApi = createApi({
  reducerPath: "categoryApi",
  tagTypes: ["Categories"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/categories/`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken; 
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (build) => ({
    getAllCategories: build.query<CategoriesResponse, void>({
      query: () => "all",
      providesTags: (result) => 
        result ? 
          [
            ...result.data.map(({ id }) => ({ type: 'Categories' as const, id })), 
            { type: 'Categories', id: 'LIST' }
          ] : 
          [{ type: 'Categories', id: 'LIST' }],
    }),

    getCategory: build.query<CategoryResponse, number>({
      query: (id) => ({
        url: `${id}/category`
      })
    }),

    addCategory: build.mutation<any,{ name: string; file: File } >({
      query({ name, file }) {
        const formData = new FormData();
        formData.append("name", name); 
        formData.append("file", file);
        return {
          url: "add",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [{ type: 'Categories', id: 'LIST' }],
    }),

    updateCategory: build.mutation<CategoryResponse, { id: number; name: string; file: File }>({
      query(data) {
        const formData = new FormData();
        formData.append("name", data.name); 
        formData.append("file", data.file);
        return {
          url: `category/${data.id}/update`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Categories', id }],
    }),

    deleteCategory: build.mutation<CategoryResponse, number>({
      query(id) {
        return {
          url: `category/${id}/delete`,
          method: 'DELETE'
        };
      },
      invalidatesTags: (result, error, id) => [{  type: 'Categories', id }]
    }),
  }),
});

export const { useGetAllCategoriesQuery,useGetCategoryQuery, useAddCategoryMutation, useUpdateCategoryMutation ,useDeleteCategoryMutation} = categoryApi;
