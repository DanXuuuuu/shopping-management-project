import {
    Box,
    Stack,
    Typography,
    IconButton,
  } from "@mui/material";
  import CloseIcon from "@mui/icons-material/Close";
  import { useDispatch, useSelector } from "react-redux";
  import { closeCart } from "../../store/cartSlice";

  export default function Header(){
   
    const dispatch = useDispatch();

    const { cartItems = [] } = useSelector((state) => state.cart || {});

    const cartCount = cartItems.reduce((sum, item) => {
    return sum + (item.qty || 0);
  }, 0);
  
    return(
        <Box sx={{ bgcolor: "#4b47ff", color: "white", px: 2, py: 1.5 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography fontWeight={800}>Cart ({cartCount})</Typography>
            <IconButton
              onClick={() => dispatch(closeCart())}
              sx={{ color: "white" }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </Box>
    )
  }