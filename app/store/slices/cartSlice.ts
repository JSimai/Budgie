import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  discount: {
    percentage: number;
    discountedPrice: number;
    savings: number;
  };
}

// Types for cart-related state management
interface CartState {
  items: CartItem[];  // Array of items in cart
  totalItems: number;  // Total quantity of all items
  totalPrice: number;  // Total price before discounts
  totalDiscount: number;  // Total savings from discounts
  isOpen: boolean;  // Cart drawer open state
}

// Initial cart state
const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  totalDiscount: 0,
  isOpen: false,
};

// Utility function to calculate cart totals
const calculateTotals = (items: CartItem[]) => {
  return items.reduce(
    (acc, item) => {
      const itemTotal = item.price * item.quantity;
      const discountedTotal = item.discount.discountedPrice * item.quantity;
      return {
        totalItems: acc.totalItems + item.quantity,
        totalPrice: acc.totalPrice + itemTotal,
        totalDiscount: acc.totalDiscount + (itemTotal - discountedTotal),
      };
    },
    { totalItems: 0, totalPrice: 0, totalDiscount: 0 }
  );
};

// Main cart slice with reducers
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add item to cart or increment quantity if exists
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      
      // Update cart totals after adding item
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
      state.totalDiscount = totals.totalDiscount;
    },
    
    // Remove item from cart completely
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
      state.totalDiscount = totals.totalDiscount;
    },
    
    // Update item quantity or remove if quantity becomes 0
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(0, action.payload.quantity);
        if (item.quantity === 0) {
          state.items = state.items.filter(i => i.id !== action.payload.id);
        }
      }
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
      state.totalDiscount = totals.totalDiscount;
    },
    
    // Clear all items from cart
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
      state.totalDiscount = 0;
    },
    
    // Toggle cart drawer visibility
    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

// Export actions for use in components
export const { addToCart, removeFromCart, updateQuantity, clearCart, setCartOpen } = cartSlice.actions;
export default cartSlice.reducer; 