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

import { closeCart } from "../../store/cartSlice";

export default function Cart() {
  
  const dispatch = useDispatch();
  const isOpen = useSelector((s) => s.cart.isOpen);


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




