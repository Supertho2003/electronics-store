export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface UsersResponse {
  message: string;
  data: User[];
}

export interface UserResponse {
  message: string;
  data: User;
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface LoginResponse {
  data: {
    id: number;
    accessToken: string;
    refreshToken: string;
  };
}
