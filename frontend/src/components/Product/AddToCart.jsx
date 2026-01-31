import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ButtonGroup, Typography, Box } from '@mui/material';
import { addToCart, increaseQty, decreaseQty } from '../../store/cartSlice';

const AddToCart = ({ product }) => {
  const dispatch = useDispatch();

  // Check the Redux store: Is this specific product already in the cart?
  const cartItems = useSelector((state) => state.cart.cartItems);
  //search the 'cartItems' array using the product ID.
  const cartItem = cartItems.find((item) => {
      return item.product._id === product._id;
  });
  
  // Determine the current quantity
  const qty = cartItem ? cartItem.qty : 0;

  //Event Handlers

  // 1.First time adding the product
  const handleAddToCart = (e) => {
    e.preventDefault(); 
    // stopPropagation/preventDefault prevents the click from bubbling up.
    //We send the FULL product object because Redux needs the all info to create the new cart item.
    dispatch(addToCart(product)); 
  };

  //2. Clicking the "+" butto
  const handleIncrease = (e) => {
    e.preventDefault();
    dispatch(increaseQty({ productId: product._id, maxQty: product.countInStock }));
  };

  // 3. Clicking the "-" button -> Early Return Pattern
  const handleDecrease = (e) => {
    e.preventDefault();
    dispatch(decreaseQty({productId: product._id}));
  };

  // --- Rendering Logic ---

  // Case 1: Product is completely sold out
  // We return early here so the rest of the code doesn't run.
  if (product.countInStock === 0) {
     return (
        <Button variant="contained" disabled fullWidth sx={{ fontWeight: 'bold', height: '40px', width: '150px'}}>
           Out of Stock
        </Button>
     );
  }

  // Case 2: Product is in stock, but user hasn't added it yet (Qty is 0)
  // Show the purple "Add" button.
  if (qty === 0) {
    return (
      <Button 
        variant="contained" 
        fullWidth 
        onClick={handleAddToCart}
        sx={{ bgcolor: '#5346bd', fontWeight: 'bold', height: '40px', width: '130px', '&:hover': { bgcolor: '#4335a7' } }}
      >
        Add 
      </Button>
    );
  }

  // Case 3: Product is already in cart (Qty > 0)
  // Show the control bar [ - QTY + ]
  return (
    <ButtonGroup 
      disableElevation 
      variant="contained" 
      fullWidth
      sx={{ 
        bgcolor: '#5346bd', 
        height: '40px',
        width: '120px',
        '& .MuiButtonGroup-grouped': { border: 'none' } // 去掉按钮间的分割线
      }}
    >
      <Button onClick={handleDecrease} sx={{ bgcolor: '#5346bd', width: '60px', fontSize: '1.2rem' }}>-</Button>
      
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1, bgcolor: '#5346bd', cursor: 'default' }}>
        <Typography variant="body1" fontWeight="bold" color="white">{qty}</Typography>
      </Box>

      <Button 
        onClick={handleIncrease} 
        disabled={qty >= product.countInStock} 
        sx={{ bgcolor: '#5346bd', width: '60px', fontSize: '1.2rem' }}
      >
        +
      </Button>
    </ButtonGroup>
  );
};

export default AddToCart;