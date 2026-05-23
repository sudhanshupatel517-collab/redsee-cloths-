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
  loading: boolean;
  error: string | null;
}

const initialState: HomeState = {
  banners: [],
  newArrivals: [],
  womensCollection: [],
  mensCollection: [],
  loading: false,
  error: null,
};

// Thunks
export const fetchHomeData = createAsyncThunk(
  'home/fetchHomeData',
  async (_, { rejectWithValue }) => {
    try {
      const [bannersRes, newArrivalsRes, womensRes, mensRes] = await Promise.all([
        api.get('/api/banners').catch(() => ({ data: [] })), // Graceful fallback
        api.get('/api/products?limit=10'), // Get latest
        api.get('/api/products?category=Women&limit=6'),
        api.get('/api/products?category=Men&limit=6'),
      ]);

      return {
        banners: bannersRes.data,
        newArrivals: newArrivalsRes.data.slice(0, 10), // Ensure max 10
        womensCollection: womensRes.data.slice(0, 6),
        mensCollection: mensRes.data.slice(0, 6),
      };
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
        state.banners = action.payload.banners;
        state.newArrivals = action.payload.newArrivals;
        state.womensCollection = action.payload.womensCollection;
        state.mensCollection = action.payload.mensCollection;
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default homeSlice.reducer;
