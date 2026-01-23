import React from 'react';
import { Stack, Button, Badge, Typography } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useDispatch, useSelector } from "react-redux";
import { mockProductsById } from '../../../mock/mockProducts';
import { openCart } from '../../../store/cartSlice';

const UserStatus = () => {
  
  const isLoggedIn = false; 
  const dispatch = useDispatch();
  const items = useSelector((s) => s.cart.items);
  const productIds = Object.keys(items);
  const cartItemCount = Object.values(items).reduce((sum, qty) => sum + qty, 0);
  
  const subtotal = productIds.reduce((sum, productId) => {
    const qty = items[productId];
    const product = mockProductsById[productId];
    if (!product) return sum;
    return sum + product.price * qty;
  }, 0);

  const money = (n) => n.toFixed(2);

  return (
    <Stack direction="row" spacing={{ xs: 1, sm: 2 }} alignItems="center">
      
      {isLoggedIn ? (
        <Button 
          color="inherit" 
          startIcon={<PersonOutlineIcon />}
          sx={{ textTransform: 'none', fontWeight: 500, fontSize: '0.9rem' }}
        >
          Sign Out
        </Button>
      ) : (
        <Button 
          color="inherit" 
          startIcon={<PersonOutlineIcon />}
          sx={{ textTransform: 'none', fontWeight: 500, fontSize: '0.9rem' }}
        >
          Sign In
        </Button>
      )}

      <Button 
        color="inherit" 
        sx={{ 
          textTransform: 'none', 
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
        onClick={() => dispatch(openCart())}
      >
        <Badge badgeContent={cartItemCount} color="error">
          <ShoppingCartOutlinedIcon />
        </Badge>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
        ${money(subtotal)}
        </Typography>
      </Button>

    </Stack>
  );
};

export default UserStatus;