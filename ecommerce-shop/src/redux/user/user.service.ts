import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LoginResponse, LoginUser, User, UserResponse } from "./user.type";
import { baseUrl } from "../../api";
import { RootState } from "../store";

export const userApi = createApi({
  reducerPath: "userApi",
  tagTypes: ["Users"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (build) => ({
    addUser: build.mutation<any, Omit<LoginUser, "id">>({
      query(body) {
        return {
          url: "users/add",
          method: "POST",
          body,
        };
      },
    }),

    getUserById: build.query<any, void>({
      query: () => "users/user",
    }),

    getAllUsers: build.query<any, void>({
      query: () => "users/all",
      providesTags: ["Users"],
    }),

    countUsers: build.query<any, void>({
      query: () => "users/count",
    }),
    toggleUserStatus: build.mutation<any, number>({
      query(userId) {
        return {
          url: `users/user/${userId}/toggle-active`,
          method: "PUT",
        };
      },
      invalidatesTags: ["Users"],
    }),

    addRoleToUser: build.mutation<any, { userId: number; role: string }>({
      query({ userId, role }) {
        return {
          url: `users/user/${userId}/add-role?role=${encodeURIComponent(role)}`, 
          method: "PUT",
        };
      },
      invalidatesTags: ["Users"],
    }),

    updateUsername: build.mutation<UserResponse, { newUserName: string }>({
      query({ newUserName }) {
        return {
          url: `users/user/update-username?newUserName=${encodeURIComponent(
            newUserName
          )}`,
          method: "PUT",
        };
      },
      invalidatesTags: ["Users"],
    }),

    deleteUser : build.mutation<any, number>({
      query(userId) {
        return {
          url: `users/user/${userId}/delete`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Users"],
    }),
  }),
  
});

export const {
  useAddUserMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useCountUsersQuery,
  useToggleUserStatusMutation,
  useAddRoleToUserMutation,
  useUpdateUsernameMutation,
  useDeleteUserMutation,
} = userApi;
