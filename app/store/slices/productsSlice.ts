import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  discount: {
    percentage: number;
    discountedPrice: number;
    savings: number;
  };
}

// Types for product-related state management
interface ProductsState {
  items: Product[];  // Array of all products
  status: 'idle' | 'loading' | 'succeeded' | 'failed';  // API request status
  error: string | null;  // Error message if API request fails
  filters: {
    category: string[];  // Selected category filters
    sortBy: 'biggestDiscount' | 'biggestSaving' | 'lowestPrice' | 'highestPrice';  // Current sort method
    searchQuery: string;  // Current search term
  };
}

// Initial state configuration
const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
  filters: {
    category: [],
    sortBy: 'biggestDiscount',
    searchQuery: '',
  },
};

// Utility function to format category names
const capitalizeWords = (str: string): string => {
  return str.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

// Generate a random discount between 10% and 50%, rounded to nearest 5%
const generateDiscount = (price: number) => {
  const minDiscount = 10;
  const maxDiscount = 50;
  const randomDiscount = Math.floor(Math.random() * (maxDiscount - minDiscount + 1) + minDiscount);
  const roundedDiscount = Math.round(randomDiscount / 5) * 5;
  const discountedPrice = Number((price * (1 - roundedDiscount / 100)).toFixed(2));
  const savings = Number((price - discountedPrice).toFixed(2));

  return {
    percentage: roundedDiscount,
    discountedPrice,
    savings,
  };
};

// Async thunk for fetching products from the API
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const response = await fetch('https://fakestoreapi.com/products');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data: Product[] = await response.json();
    
    // Transform API data: capitalize categories and add random discounts
    return data.map(product => ({
      ...product,
      category: capitalizeWords(product.category),
      discount: generateDiscount(product.price),
    }));
  }
);

// Main products slice with reducers and async logic
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Toggle category filter
    setCategory: (state, action: PayloadAction<string>) => {
      const category = action.payload;
      const index = state.filters.category.indexOf(category);
      if (index === -1) {
        state.filters.category.push(category);
      } else {
        state.filters.category.splice(index, 1);
      }
    },
    
    // Update sort method
    setSortBy: (state, action: PayloadAction<ProductsState['filters']['sortBy']>) => {
      state.filters.sortBy = action.payload;
    },
    
    // Update search query
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload;
    },
    
    // Regenerate random discounts for all products
    regenerateDiscounts: (state) => {
      state.items = state.items.map(product => ({
        ...product,
        discount: generateDiscount(product.price),
      }));
    },
  },
  
  // Handle async API states
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to fetch products';
      });
  },
});

// Export actions for use in components
export const { setCategory, setSortBy, setSearchQuery, regenerateDiscounts } = productsSlice.actions;
export default productsSlice.reducer; 