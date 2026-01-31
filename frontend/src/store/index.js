import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice'; 
import cartReducer from './cartSlice';
import authReducer from './authSlice';


const store = configureStore({
  reducer: {
    // Register the product reducer to manage the 'products' state slice
    products: productReducer,
    cart: cartReducer,
    auth: authReducer
  },
});

export default store;