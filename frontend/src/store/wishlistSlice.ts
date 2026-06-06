import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/axios';

export interface WishlistState {
  items: any[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

// Fetch wishlist items from backend database
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/api/users/wishlist');
      return data; // returns array of full Product objects
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist items');
    }
  }
);

// Toggle wishlist item in database
export const toggleWishlistBackend = createAsyncThunk(
  'wishlist/toggleBackend',
  async (productId: string, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/api/users/wishlist', { productId });
      return { productId, list: data.wishlist };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle wishlist item');
    }
  }
);

// Merge local storage wishlist items with MongoDB database
export const mergeWishlistBackend = createAsyncThunk(
  'wishlist/mergeBackend',
  async (wishlistIds: string[], { rejectWithValue }) => {
    try {
      const { data } = await api.post('/api/users/wishlist/merge', { wishlistIds });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to merge wishlist items');
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    // Toggle item locally (guest user path)
    toggleWishlistLocal: (state, action: PayloadAction<any>) => {
      const product = action.payload;
      if (!product || !product._id) return;
      
      const exists = state.items.some((item) => item._id === product._id);
      if (exists) {
        state.items = state.items.filter((item) => item._id !== product._id);
      } else {
        state.items = [...state.items, product];
      }
      
      // Synchronize in local storage
      if (typeof window !== 'undefined') {
        const localWishlist = localStorage.getItem('redsee_wishlist');
        let parsed = localWishlist ? JSON.parse(localWishlist) : [];
        if (parsed.includes(product._id)) {
          parsed = parsed.filter((id: string) => id !== product._id);
        } else {
          parsed.push(product._id);
        }
        localStorage.setItem('redsee_wishlist', JSON.stringify(parsed));
      }
    },
    // Load local wishlist directly into state
    loadWishlistLocal: (state, action: PayloadAction<any[]>) => {
      state.items = action.payload;
    },
    // Clear wishlist lists
    clearWishlist: (state) => {
      state.items = [];
      if (typeof window !== 'undefined') {
        localStorage.removeItem('redsee_wishlist');
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Toggle Wishlist Backend
      .addCase(toggleWishlistBackend.fulfilled, (state, action) => {
        // Optimistically we'll let page components update or refetch
        // But we can also remove if it is no longer in the returned wishlist list or add it if it's there
      });
  }
});

export const { toggleWishlistLocal, loadWishlistLocal, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
