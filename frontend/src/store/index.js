import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice'; 


const store = configureStore({
  reducer: {
    // Register the product reducer to manage the 'products' state slice
    products: productReducer,
  },
});

export default store;