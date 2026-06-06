import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/axios';

export interface RecentlyViewedState {
  items: any[];
  loading: boolean;
  error: string | null;
}

const initialState: RecentlyViewedState = {
  items: [],
  loading: false,
  error: null,
};

// Fetch recently viewed items from backend database
export const fetchRecentlyViewed = createAsyncThunk(
  'recentlyViewed/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/api/users/recently-viewed');
      return data; // returns array of full Product objects
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recently viewed items');
    }
  }
);

// Add recently viewed item to database (non-blocking call)
export const addRecentlyViewedBackend = createAsyncThunk(
  'recentlyViewed/addBackend',
  async (productId: string, { rejectWithValue }) => {
    try {
      await api.post('/api/users/recently-viewed', { productId });
      return productId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add recently viewed item');
    }
  }
);

// Merge local storage history list with MongoDB database
export const mergeRecentlyViewedBackend = createAsyncThunk(
  'recentlyViewed/mergeBackend',
  async (history: { productId: string; viewedAt: string }[], { rejectWithValue }) => {
    try {
      const { data } = await api.post('/api/users/recently-viewed/merge', { history });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to merge recently viewed items');
    }
  }
);

const recentlyViewedSlice = createSlice({
  name: 'recentlyViewed',
  initialState,
  reducers: {
    // Add item locally (guest user path)
    addRecentlyViewedLocal: (state, action: PayloadAction<any>) => {
      const product = action.payload;
      if (!product || !product._id) return;
      
      // Filter out duplicate if it already exists
      const filtered = state.items.filter((item) => item._id !== product._id);
      
      // Add first and cap at 20 products
      state.items = [product, ...filtered].slice(0, 20);
      
      // Synchronize in local storage
      if (typeof window !== 'undefined') {
        const localHistory = localStorage.getItem('redsee_recently_viewed');
        let parsed = localHistory ? JSON.parse(localHistory) : [];
        parsed = parsed.filter((item: any) => item.productId !== product._id);
        parsed.unshift({ productId: product._id, viewedAt: new Date().toISOString() });
        localStorage.setItem('redsee_recently_viewed', JSON.stringify(parsed.slice(0, 20)));
      }
    },
    // Load local history directly into state
    loadRecentlyViewedLocal: (state, action: PayloadAction<any[]>) => {
      state.items = action.payload;
    },
    // Clear recently viewed lists
    clearRecentlyViewed: (state) => {
      state.items = [];
      if (typeof window !== 'undefined') {
        localStorage.removeItem('redsee_recently_viewed');
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Recently Viewed
      .addCase(fetchRecentlyViewed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentlyViewed.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchRecentlyViewed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { addRecentlyViewedLocal, loadRecentlyViewedLocal, clearRecentlyViewed } = recentlyViewedSlice.actions;
export default recentlyViewedSlice.reducer;
