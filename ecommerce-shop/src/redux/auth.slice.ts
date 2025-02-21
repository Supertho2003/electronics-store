import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  id: number | null;
  accessToken: string | null;
  refreshToken: string | null;
  roles: string[]; 
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  id: null,
  accessToken: null,
  refreshToken: null, 
  roles: [],
  isAuthenticated: false,
};

const getLocalStorage = (): AuthState => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken'); 
  const roles = localStorage.getItem('roles');
  const id = localStorage.getItem('id');

  return {
    id: id ? parseInt(id) : null,
    accessToken: accessToken,
    refreshToken: refreshToken, 
    roles: roles ? JSON.parse(roles) : [],
    isAuthenticated: !!accessToken, 
  };
};


const localStorageState = getLocalStorage();

const authSlice = createSlice({
  name: 'auth',
  initialState: { ...initialState, ...localStorageState },
  reducers: {
    setCredentials: (state, action: PayloadAction<{ id: number; accessToken: string; refreshToken: string; roles: string[] }>) => {
      const { id, accessToken, refreshToken, roles } = action.payload;
      
      state.id = id;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken; 
      state.roles = roles; 
      state.isAuthenticated = true;

      // Lưu vào localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('id', id.toString());
      localStorage.setItem('roles', JSON.stringify(roles));
    },
    logout: (state) => {
      state.id = null;
      state.accessToken = null;
      state.refreshToken = null; 
      state.roles = [];
      state.isAuthenticated = false;

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken'); 
      localStorage.removeItem('id');
      localStorage.removeItem('roles');

      window.location.href = '/dang-nhap';
    },
  },
});

const authReducer = authSlice.reducer;
export const { setCredentials, logout } = authSlice.actions;
export default authReducer;