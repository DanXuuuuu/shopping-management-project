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
  
  import {
    increaseQty,
    decreaseQty,
    removeItem
  } from "../../store/cartSlice";

  export default function Items(){

    const dispatch = useDispatch();
    
    const { cartItems = [] } = useSelector((state) => state.cart || {});

    const money = (n=0) => Number(n).toFixed(2);
   
   
   
    return (
         
         <Box sx={{ px: 2 }}>
         {cartItems.length === 0 ? (
           <Typography sx={{ py: 3 }} color="text.secondary">
             Your cart is empty.
           </Typography>
         ) : (
           cartItems.map((item) => {
             const { product, qty, productId } = item;
             if(!product){
              return (
                <Box key={productId || item.product}/>
              );
             }

             return (
               <Box key={product._id}>
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
                        {/* ? make sure avoid this siutation of undefined or null */}
                         ${money(product?.price)}
                       </Typography>
                     </Stack>

                     <Stack direction="row" spacing={1} alignItems="center">
                       <IconButton
                         size="small"
                         onClick={() => dispatch(decreaseQty({ productId: product._id }))}
                       >
                         <RemoveIcon fontSize="small" />
                       </IconButton>

                       <Typography sx={{ width: 24, textAlign: "center" }}>
                         {qty}
                       </Typography>

                       <IconButton
                         size="small"
                         onClick={() => dispatch(increaseQty({ productId: product._id, maxQty: product.countInStock }))}
                       >
                         <AddIcon fontSize="small" />
                       </IconButton>

                       <Box sx={{ flexGrow: 1 }} />

                       <Button
                         variant="text"
                         size="small"
                         onClick={() => dispatch(removeItem({ productId: product._id }))}
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