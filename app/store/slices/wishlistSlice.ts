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

// Types for wishlist-related state management
interface WishlistState {
  items: WishlistItem[];  // Array of items in wishlist with optional price alerts
}

// Initial wishlist state
const initialState: WishlistState = {
  items: [],
};

// Main wishlist slice with reducers
export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    // Add item to wishlist if not already present
    addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
      if (!state.items.some(item => item.id === action.payload.id)) {
        state.items.push(action.payload);
      }
    },
    
    // Remove item from wishlist
    removeFromWishlist: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    
    // Set price alert for wishlist item
    setWishlistAlert: (state, action: PayloadAction<{ 
      productId: number; 
      alert: { type: 'percentage' | 'price'; value: number; }
    }>) => {
      const item = state.items.find(item => item.id === action.payload.productId);
      if (item) {
        item.alert = action.payload.alert;
      }
    },
    
    // Remove price alert from wishlist item
    clearWishlistAlert: (state, action: PayloadAction<number>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        delete item.alert;
      }
    },
  },
});

// Export actions for use in components
export const { 
  addToWishlist, 
  removeFromWishlist, 
  setWishlistAlert, 
  clearWishlistAlert 
} = wishlistSlice.actions;

export default wishlistSlice.reducer; 