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

import { closeCart,saveCart } from "../../store/cartSlice";
import { useEffect } from "react";
export default function Cart() {
  
  const dispatch = useDispatch();
  const isOpen = useSelector((s) => s.cart.isOpen);
  const items = useSelector((s) => s.cart.items);
  const dirty = useSelector((s) => s.cart.dirty);

  useEffect(() => {

    if (!dirty) return;

    const timer = setTimeout(() => {
      dispatch(saveCart(items));
    }, 1000);

    return () => clearTimeout(timer);
  },[items, dirty,dispatch])


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




