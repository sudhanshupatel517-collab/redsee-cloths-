import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import cartReducer from './cartSlice';
import homeReducer from './homeSlice';
import productReducer from './productSlice';
import recentlyViewedReducer from './recentlyViewedSlice';
import wishlistReducer from './wishlistSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    home: homeReducer,
    products: productReducer,
    recentlyViewed: recentlyViewedReducer,
    wishlist: wishlistReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
