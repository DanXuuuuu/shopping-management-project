import {
    Box,
    Stack,
    Typography,
    Button,
    TextField,
  } from "@mui/material";
  import { useDispatch, useSelector } from "react-redux";
  import { mockProductsById } from "../../mock/mockProducts";
  import { validatePromo } from "./validatePromo";
  import { useState } from "react";
  
  import {
    setPromoInput,
    applyPromo
  } from "../../store/cartSlice";
  
  export default function Promo() {

    const {promoInput,setPromoInput} = useState('');

    const dispatch = useDispatch();

    const items = useSelector((s) => s.cart.items); 
  
    // const promoInput = useSelector((s) => s.cart.promoInput);//笨，不如local state
    const promo = useSelector((s) => s.cart.promo);
  
  
    const productIds = Object.keys(items);
    const subtotal = productIds.reduce((sum, productId) => {
      const qty = items[productId];
      const product = mockProductsById[productId];
      if (!product) return sum;
      return sum + product.price * qty;
    }, 0);
  

    return (

        <Box sx={{ px: 2, py: 2 }}>
          <Typography fontWeight={700} sx={{ mb: 1 }}>
            Apply Promotion Code
          </Typography>

          <Stack direction="row" spacing={1}>
            <TextField
              size="small"
              placeholder="20 DOLLAR OFF"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              sx={{
                width: 180,
              }}
            />
            <Box sx={{ flexGrow: 1 }} />
            <Button
              variant="contained"
              onClick={() => {
                const result = validatePromo(promoInput);//后端api call，拆解验证promoInput
                dispatch(applyPromo(result));// async redux thunk reducer
              }}
              sx={{
                textTransform: "none",
                whiteSpace: "nowrap",
                bgcolor: "#4b47ff",
                py: 1.4,
                fontWeight: 700,
                "&:hover": { bgcolor: "#3c38ff" },
              }}
            >
              Apply
            </Button>
          </Stack>

          {!!promo.message && (
            <Typography
              sx={{ mt: 1, fontSize: 13 }}
              color={promo.isValid ? "success.main" : "error.main"}
            >
              {promo.message}
            </Typography>
          )}
        </Box>
    )

}