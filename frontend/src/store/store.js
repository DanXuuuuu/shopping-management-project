import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import authReducer from './slices/authSlice';

// store data 
const store = configureStore({
    reducer:{
        cart:cartReducer,
        auth: authReducer
    }
});

export default store;
