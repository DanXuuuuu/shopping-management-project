import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// --- ASYNC THUNKS ---

// 1. Fetch all products
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts', 
    async ({ keyword = '', pageNumber = 1, sort = 'last-added' }) => {
      const{ data } = await axios.get(
        `/api/products?keyword=${keyword}&pageNumber=${pageNumber}&sort=${sort}`
      );
    return data;
});
// 2. Create a new product
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (newProductData, { rejectWithValue, getState }) => {
    try{
      const { auth } = getState();
      const token = auth && auth.token;

      const config = {
        headers:{
          Authorization: `Bearer ${token}`,
        },
      };
      const{ data } = await axios.post('/api/products', newProductData, config);
      return data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
// 3. Update an existing product
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (updatedProductData, { rejectWithValue, getState }) => {
    try{
      const { auth } = getState();
      const token = auth && auth.token;

      const config = {
        headers:{
          Authorization: `Bearer ${token}`,
        },
      };
      const { _id, ...updatedFields } = updatedProductData;
      const { data } = await axios.put(`/api/products/${_id}`, updatedFields, config);
      return data;

    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
    
  }
);

// 4. Fetch details for a single product by ID
export const fetchProductDetail = createAsyncThunk(
  'products/fetchProductDetail',
  async (id) => {
    const { data } = await axios.get(`/api/products/${id}`);
    return data;
  }
);
// 5. Delete a product
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth && auth.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`/api/products/${id}`, config);
      return id; 

    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
    
  }
);

// --- INITIAL STATE  ---
const initialState = {
  products: [],
  currentProduct: null,// Details of the single selected product
  // state management
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  page: 1,
  pages: 1,
};

// --- SLICE ---
const productSlice = createSlice({
  name: 'products',
  initialState,
  
  reducers: {
  },
  // Extra Reducers (Asynchronous logic)
  extraReducers: (builder) => {
    builder
     // --- Fetch Products ---
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload.products;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // --- Create Product ---
      .addCase(createProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products.unshift(action.payload);
      })
      .addCase(createProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // --- Update Product ---
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = state.products.filter((p) => p._id !== action.payload._id);
        state.products.unshift(action.payload);
      })
      .addCase(updateProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = 'failed';
      })
      // --- getProductById ---
      .addCase(fetchProductDetail.pending, (state) => {
        state.status = 'loading';
        state.currentProduct = null;
        state.error = null;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentProduct = action.payload; 
      })
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // --- deleteProduct ---
      .addCase(deleteProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = 'succeeded'; 
        state.products = state.products.filter((p) => p._id !== action.payload);
        if (state.pagination && state.pagination.totalItems) {
            state.pagination.totalItems -= 1;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message; 
      });
  },
});

export const { sortProducts } = productSlice.actions;
export default productSlice.reducer;