import {
    Box,
    Stack,
    Typography,
    IconButton,
    Button
  } from "@mui/material";
  import AddIcon from "@mui/icons-material/Add";
  import RemoveIcon from "@mui/icons-material/Remove";
  import { useDispatch, useSelector } from "react-redux";
  import { mockProductsById } from "../../mock/mockProducts";
  
  import {
    increaseQty,
    decreaseQty,
    removeItem
  } from "../../store/cartSlice";

  export default function Items(){

    const dispatch = useDispatch();
    
    const items = useSelector((s) => s.cart.items); 
  
    const productIds = Object.keys(items);

    const money = (n) => n.toFixed(2);
   
   
   
    return (
         
         <Box sx={{ px: 2 }}>
         {productIds.length === 0 ? (
           <Typography sx={{ py: 3 }} color="text.secondary">
             Your cart is empty.
           </Typography>
         ) : (
           productIds.map((productId) => {
             const qty = items[productId];
             const product = mockProductsById[productId];
             if (!product) return null;

             return (
               <Box key={productId}>
                 <Stack
                   direction="row"
                   spacing={2}
                   alignItems="center"
                   sx={{ py: 2 }}
                 >
                   <img
                     src={product.imageUrl}
                     alt={product.name}
                     width={90}
                     height={90}
                     style={{ borderRadius: 6, objectFit: "cover" }}
                   />

                   <Stack flex={1} spacing={1.5}>
                     <Stack
                       direction="row"
                       justifyContent="space-between"
                       alignItems="flex-start"
                     >
                       <Typography fontWeight={700}>{product.name}</Typography>
                       <Typography fontWeight={600}>
                         ${money(product.price)}
                       </Typography>
                     </Stack>

                     <Stack direction="row" spacing={1} alignItems="center">
                       <IconButton
                         size="small"
                         onClick={() => dispatch(decreaseQty({ productId }))}
                       >
                         <RemoveIcon fontSize="small" />
                       </IconButton>

                       <Typography sx={{ width: 24, textAlign: "center" }}>
                         {qty}
                       </Typography>

                       <IconButton
                         size="small"
                         onClick={() => dispatch(increaseQty({ productId }))}
                       >
                         <AddIcon fontSize="small" />
                       </IconButton>

                       <Box sx={{ flexGrow: 1 }} />

                       <Button
                         variant="text"
                         size="small"
                         onClick={() => dispatch(removeItem({ productId }))}
                         sx={{ ml: "auto", textTransform: "none" }}
                       >
                         Remove
                       </Button>
                     </Stack>
                   </Stack>
                 </Stack>
               </Box>
             );
           })
         )}
       </Box>
    )
  }