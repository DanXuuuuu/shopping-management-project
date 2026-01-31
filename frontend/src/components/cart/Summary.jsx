import {
    Box,
    Stack,
    Typography,
    Button
  } from "@mui/material";
  import { useSelector } from "react-redux";
  
  export default function Summary(){

    const { cartItems = [], promo } = useSelector((state) => state.cart || {});
  
    const subtotal = cartItems.reduce((sum, item) => {
      const price = item.product?.price || 0;
      const qty = item.qty || 0;
      return sum + (price * qty);
  }, 0);
  
    const tax = subtotal * 0.1;
    const discount = promo.discount || 0;
    const total = Math.max(0, subtotal + tax - discount);
    const money = (n) => n.toFixed(2);

    return(

        <Box sx={{ px: 2, py: 2 }}>
          <Stack spacing={1.2} sx={{ mb: 2 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Subtotal</Typography>
              <Typography fontWeight={700}>${money(subtotal)}</Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Tax</Typography>
              <Typography fontWeight={700}>${money(tax)}</Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Discount</Typography>
              <Typography fontWeight={700}>-${money(discount)}</Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography fontWeight={800}>Estimated total</Typography>
              <Typography fontWeight={800}>${money(total)}</Typography>
            </Stack>
          </Stack>

          <Button
            fullWidth
            variant="contained"
            size="large"
            disabled={cartItems.length === 0}
            onClick={() => alert("Checkout coming soon")}
            sx={{
              bgcolor: "#4b47ff",
              textTransform: "none",
              py: 1.4,
              fontWeight: 700,
              "&:hover": { bgcolor: "#3c38ff" },
            }}
          >
            Continue to checkout
          </Button>
        </Box>
    )
  }