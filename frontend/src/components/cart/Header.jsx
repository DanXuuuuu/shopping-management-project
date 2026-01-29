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

    const items = useSelector((s) => s.cart.items); 

    const cartCount = Object.values(items).reduce((sum, qty) => sum + qty, 0);

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