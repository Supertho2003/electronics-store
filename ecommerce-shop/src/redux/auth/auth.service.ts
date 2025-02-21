import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from '@reduxjs/toolkit/query'
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,

} from '@reduxjs/toolkit/query'
import { RootState } from "../store";
import { logout, setCredentials } from "../auth.slice";
import { LoginResponse, LoginUser  } from "../user/user.type";
import { baseUrl } from "../../api";

interface RefreshTokenResponse {
  id: number;
  accessToken: string;
  refreshToken: string;
  roles: string[];
}

// Base query with authorization header
const baseQuery = fetchBaseQuery({
  baseUrl: `${baseUrl}/auth`,
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    console.log("Access token expired. Attempting to refresh...");

    const refreshToken = (api.getState() as RootState).auth.refreshToken;

    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: "/refresh",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const data = refreshResult.data as RefreshTokenResponse;

        // Store the new tokens
        api.dispatch(
          setCredentials({
            id: data.id,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            roles: data.roles,
          })
        );


        result = await baseQuery(args, api, extraOptions);
      } else {
        console.log("Token refresh failed. Logging out...");
        api.dispatch(logout());
      }
    } else {
      console.log("No refresh token found. Logging out...");
      api.dispatch(logout());
    }
  }

  return result;
};
// Create the auth API slice
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Users"],
  endpoints: (build) => ({
    loginUser : build.mutation<LoginResponse, LoginUser >({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
    }),
    logoutUser : build.mutation<void, string>({
      query: (refreshToken) => ({
        url: "/logout",
        method: "POST",
        body: { refreshToken },
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const { useLoginUserMutation, useLogoutUserMutation } = authApi;