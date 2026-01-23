import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
//import axios from 'axios';

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (updatedProductData) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return updatedProductData; 
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (newProductData) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const mockSavedProduct = {
      ...newProductData,
      _id: Date.now().toString(), 
    };

    return mockSavedProduct; 
  }
);

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts', 
    async () => {
    console.log("Fetching products...");
  return [];
});

const initialState = {
  // 2. mock data
  products: [
    {
      _id: "1",
      name: "iPhone 13 Pro",
      description: "Apple's latest smartphone with A15 Bionic chip, offering huge performance gains.",
      category: "Electronics",
      price: 999,
      countInStock: 10,
      imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60" 
    },
    {
      _id: "2",
      name: "Sony WH-1000XM4",
      description: "Industry leading noise canceling headphones with premium sound quality.",
      category: "Electronics",
      price: 348,
      countInStock: 5,
      imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
    },
    {
      _id: "3",
      name: "MacBook Air M1",
      description: "M1 chip, 8GB RAM, 256GB SSD. The future of Mac.",
      category: "Computers",
      price: 999,
      countInStock: 0, // test 'Out of Stock' style
      imageUrl: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
    },
    {
      _id: "4",
      name: "Canon EOS R5",
      description: "Professional mirrorless camera for photographers.",
      category: "Camera",
      price: 3899,
      countInStock: 3,
      imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
    },
  ],

  // 3. state management
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,

  // 4. pagination
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 4,
  }
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    sortProducts: (state, action) => {
      const sortType = action.payload;
      if (sortType === 'price-asc') {
        // price from low to high
        state.products.sort((a, b) => a.price - b.price);
      } else if (sortType === 'price-desc') {
        // price from high to low
        state.products.sort((a, b) => b.price - a.price);
      } else if (sortType === 'last-added') {
        // latest added (assuming _id is greater means newer, or reverse the array)
        state.products.sort((a, b) => b._id.localeCompare(a._id));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload); 
        state.status = 'succeeded';
      })
     
      .addCase(createProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
    
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.status = 'succeeded';
      })
      .addCase(updateProduct.pending, (state) => { state.status = 'loading'; 

      })
      .addCase(updateProduct.rejected, (state, action) => { state.status = 'failed'; 

      })
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // after connect to database will be hcange to state.products = action.payload;
        // state.products = action.payload; 
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { sortProducts } = productSlice.actions;
export default productSlice.reducer;