import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice'; 
import cartReducer from './cartSlice';


const store = configureStore({
  reducer: {
    // Register the product reducer to manage the 'products' state slice
    products: productReducer,
    cart: cartReducer,
  },
});

export default store;