import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  product: string; // _id
  title: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

interface CartState {
  cartItems: CartItem[];
}

const initialState: CartState = {
  cartItems: typeof window !== 'undefined' && localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems') as string)
    : [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload;
      const existItem = state.cartItems.find(x => x.product === item.product && x.size === item.size && x.color === item.color);

      if (existItem) {
        state.cartItems = state.cartItems.map(x => 
          x.product === existItem.product && x.size === existItem.size && x.color === existItem.color ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action: PayloadAction<{product: string, size: string, color: string}>) => {
      state.cartItems = state.cartItems.filter(x => 
        !(x.product === action.payload.product && x.size === action.payload.size && x.color === action.payload.color)
      );
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    }
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
