import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/axios';

export interface Banner {
  _id: string;
  imageUrl: string;
  linkUrl: string;
  title: string;
  isActive: boolean;
}

export interface HomeState {
  banners: Banner[];
  newArrivals: any[]; // Assuming products
  womensCollection: any[];
  mensCollection: any[];
  categories: any[];
  loading: boolean;
  error: string | null;
}

const initialState: HomeState = {
  banners: [],
  newArrivals: [],
  womensCollection: [],
  mensCollection: [],
  categories: [],
  loading: false,
  error: null,
};

// Thunks
export const fetchHomeData = createAsyncThunk(
  'home/fetchHomeData',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/api/homepage');
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch home data');
    }
  }
);

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeData.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload.banners || [];
        state.newArrivals = action.payload.latestProducts || [];
        state.womensCollection = action.payload.womensProducts || [];
        state.mensCollection = action.payload.mensProducts || [];
        state.categories = action.payload.categories || [];
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default homeSlice.reducer;
