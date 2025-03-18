import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WishlistItem {
  id: number;
  title: string;
  price: number;
  image: string;
  discount: {
    percentage: number;
    discountedPrice: number;
    savings: number;
  };
  alert?: {
    type: 'percentage' | 'price';
    value: number;
  };
}

interface WishlistState {
  items: WishlistItem[];
}

const initialState: WishlistState = {
  items: [],
};

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
      if (!state.items.some(item => item.id === action.payload.id)) {
        state.items.push(action.payload);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    setWishlistAlert: (state, action: PayloadAction<{ 
      productId: number; 
      alert: { type: 'percentage' | 'price'; value: number; }
    }>) => {
      const item = state.items.find(item => item.id === action.payload.productId);
      if (item) {
        item.alert = action.payload.alert;
      }
    },
    clearWishlistAlert: (state, action: PayloadAction<number>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        delete item.alert;
      }
    },
  },
});

export const { 
  addToWishlist, 
  removeFromWishlist,
  setWishlistAlert,
  clearWishlistAlert,
} = wishlistSlice.actions;

export default wishlistSlice.reducer; 