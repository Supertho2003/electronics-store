import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Product, ProductResponse, ProductsResponse } from "./product.type";
import { baseUrl } from "../../api";
import { RootState } from "../store";

export const productApi = createApi({
  reducerPath: "productApi",
  tagTypes: ["Products"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/products/`,
      prepareHeaders: (headers, { getState }) => {
          const token = (getState() as RootState).auth.accessToken;
          if (token) {
            headers.set("Authorization", `Bearer ${token}`);
          }
          return headers;
        },
  }),

  endpoints: (build) => ({
    getAllProducts: build.query<any, void>({
      query: () => "/all",
      providesTags: ["Products"],
    }),
    getProduct: build.query<any, number>({
      query: (id) => ({
        url: `${id}/product`,
      }),
    }),

    getProductByCategory: build.query<any, string>({
      query: (categoryName) => ({
        url: `/product/${categoryName}/all/products`,
      }),
    }),

    getProductsByPrice: build.query<
      ProductsResponse,
      { minPrice: number; maxPrice: number }
    >({
      query: ({ minPrice, maxPrice }) => ({
        url: `/product/price?minPrice=${minPrice}&maxPrice=${maxPrice}`,
      }),
    }),

    getProductsByName: build.query<ProductsResponse, string>({
      query: (name) => ({
        url: `/products/${name}/products`,
      }),
    }),

    getProductsByBrand: build.query<ProductsResponse, string>({
      query: (brand) => ({
        url: `/product/brand/${brand}`,
      }),
    }),

    getProductsByCategoryAndBrand: build.query<
      ProductsResponse,
      { category: string; brand: string }
    >({
      query: ({ category, brand }) => ({
        url: `product/by/category-and-brand?category=${category}&brand=${brand}`,
      }),
    }),

    getProductsByCategoryAndPriceRange: build.query<
      ProductsResponse,
      { category: string; minPrice: number; maxPrice: number }
    >({
      query: ({ category, minPrice, maxPrice }) => ({
        url: `/product/by/category-and-price?category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}`,
      }),
    }),

    addProduct: build.mutation<
      ProductResponse,
      {
        name: string;
        brand: string;
        price: number;
        colors: number[];
        attributes: string;
        isAvailable: boolean;
        stock: number;
        description: string;
        categoryName: string;
        file: File;
      }
    >({
      query(data) {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("brand", data.brand);
        formData.append("price", data.price.toString());
        formData.append("stock", data.stock.toString());
        formData.append("isAvailable", data.isAvailable ? "true" : "false");
        formData.append("description", data.description);
        formData.append("categoryName", data.categoryName);
        data.colors.forEach((color) => {
          formData.append("colors", color.toString());
        });
        formData.append("attributes", data.attributes);
        formData.append("file", data.file);
        return {
          url: "/add",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),

    updateProduct: build.mutation<
      ProductResponse,
      {
        id: number;
        name: string;
        brand: string;
        price: number;
        attributes: string;
        colors: number[];
        isAvailable: boolean;
        stock: number;
        description: string;
        categoryName: string;
        file: File;
      }
    >({
      query(data) {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("brand", data.brand);
        formData.append("price", data.price.toString());
        formData.append("stock", data.stock.toString());
        formData.append("description", data.description);
        formData.append("categoryName", data.categoryName);
        formData.append("isAvailable", data.isAvailable ? "true" : "false");
        formData.append("file", data.file);
        data.colors.forEach((color) => {
          formData.append("colors", color.toString());
        });
        formData.append("attributes", data.attributes);
        return {
          url: `/product/${data.id}/update`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: "Products", id }],
    }),

    deleteProduct: build.mutation<ProductResponse, number>({
      query(id) {
        return {
          url: `product/${id}/delete`,
          method: "DELETE",
        };
      },
      invalidatesTags: (result, error, id) => [{ type: "Products", id }],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useAddProductMutation,
  useDeleteProductMutation,
  useGetProductQuery,
  useUpdateProductMutation,
  useGetProductByCategoryQuery,
  useGetProductsByBrandQuery,
  useGetProductsByPriceQuery,
  useGetProductsByCategoryAndBrandQuery,
  useGetProductsByCategoryAndPriceRangeQuery,
  useGetProductsByNameQuery,
} = productApi;
