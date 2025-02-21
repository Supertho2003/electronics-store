import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse, Attribute, AttributeResponse, AttributesResponse } from "./attribute.type";
import { baseUrl } from "../../api";
import { RootState } from "../store";

export const attributeApi = createApi({
  reducerPath: "attributeApi",
  tagTypes: ["Attributes"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/attributes/`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken; 
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (build) => ({
    getAllAttributes: build.query<AttributesResponse, void>({
      query: () => "all",
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Attributes" as const, id })),
              { type: "Attributes", id: "LIST" },
            ]
          : [{ type: "Attributes", id: "LIST" }],
    }),

    getAttribute: build.query<AttributeResponse, number>({
      query: (id) => ({
        url: `${id}/attribute`,
      }),
    }),

    addAttribute: build.mutation<AttributeResponse, Omit<Attribute, "id">>({
      query(body) {
        return {
          url: "add",
          method: "POST",
          body,
        };
      },
      invalidatesTags: [{ type: "Attributes", id: "LIST" }],
    }),

    updateAttribute: build.mutation<AttributeResponse, { id: number; body: Attribute }>({
      query(data) {
        return {
          url: `attribute/${data.id}/update`,
          method: "PUT",
          body: data.body,
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: "Attributes", id }],
    }),

    deleteAttribute: build.mutation<AttributeResponse, number>({
      query(id) {
        return {
          url: `attribute/${id}/delete`,
          method: "DELETE",
        };
      },
      invalidatesTags: (result, error, id) => [{ type: "Attributes", id }],
    }),
  }),
});

export const {
  useGetAllAttributesQuery,
  useGetAttributeQuery,
  useAddAttributeMutation,
  useUpdateAttributeMutation,
  useDeleteAttributeMutation,
} = attributeApi;
