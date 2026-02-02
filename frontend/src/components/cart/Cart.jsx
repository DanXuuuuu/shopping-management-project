import {
  Drawer,
  Box,
  Divider,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import Items from "./Items"
import Summary from "./Summary";
import Promo from "./Promo";
import Header from "./Header";

import { closeCart,saveCart,fetchCart } from "../../store/cartSlice";
import { useEffect } from "react";

import { loginSuccess } from "../../store/authSlice";




export default function Cart() {
  
  const dispatch = useDispatch();
  const { isOpen,cartItems, dirty } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);

  useEffect(()=>{
     
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if(token && userStr){
      try{
        const user = JSON.parse(userStr);
        dispatch(loginSuccess({
          user: user,
          token: token
        })); 
        // reload cart 
        dispatch(fetchCart());
    
        console.log('Login state restored from localStorage ');

      }catch(error){

        console.error('Failed to restore login state:',error);
        // if localStorage data error ,clean localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');

      }
    }
  }, [dispatch]);

  useEffect(() => {
    if (token && dirty) {
     
      const timer = setTimeout(() => {
        console.log("Auto-saving cart to server...");
        // auto-save cart
        dispatch(saveCart(cartItems)); 
      }, 500); 
      // clean function excuting before next effect & component remove 
      return () => clearTimeout(timer);
    }
  }, [cartItems, dirty, token, dispatch]);


  return (
    <Drawer anchor="right" open={isOpen} onClose={() => dispatch(closeCart())}>
      
      <Box sx={{ width: { xs: 360, sm: 480 } }}>
        <Header />
        <Items />
        <Promo />
        <Divider />
        <Summary />
      </Box>

    </Drawer>
  );
}



