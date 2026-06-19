import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
  phone?: string;
  gender?: string;
  addresses?: any[];
  avatar?: string;
  hasPassword?: boolean;
  permissions?: string[];
  rewards?: number;
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: typeof window !== 'undefined' && localStorage.getItem('userInfo') 
    ? JSON.parse(localStorage.getItem('userInfo') as string) 
    : null,
  isAuthenticated: typeof window !== 'undefined' && !!localStorage.getItem('userInfo'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('userInfo');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
