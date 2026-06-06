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
  justDropped: any[];
  trendingNow: any[];
  bestSellers: any[];
  mensCollection: any[];
  womensCollection: any[];
  limitedDrops: any[];
  offersForYou: any[];
  newArrivals: any[];
  categories: any[];
  loading: boolean;
  error: string | null;
}

const initialState: HomeState = {
  banners: [],
  justDropped: [],
  trendingNow: [],
  bestSellers: [],
  mensCollection: [],
  womensCollection: [],
  limitedDrops: [],
  offersForYou: [],
  newArrivals: [],
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
        state.justDropped = action.payload.justDropped || [];
        state.trendingNow = action.payload.trendingNow || [];
        state.bestSellers = action.payload.bestSellers || [];
        state.mensCollection = action.payload.mensCollection || [];
        state.womensCollection = action.payload.womensCollection || [];
        state.limitedDrops = action.payload.limitedDrops || [];
        state.offersForYou = action.payload.offersForYou || [];
        state.newArrivals = action.payload.newArrivals || [];
        state.categories = action.payload.categories || [];
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default homeSlice.reducer;
