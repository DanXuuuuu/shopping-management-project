import React from 'react';
import { Stack, Button, Badge, Typography } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; 
import { mockProductsById } from '../../../mock/mockProducts';
import { openCart,fetchCart } from '../../../store/cartSlice';

const UserStatus = () => {
  
  const isLoggedIn = true; 
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const handleCartClick = async() => {
    if (!isLoggedIn) {
      alert("Please sign in to view your cart.");
      navigate("/login");
      return;
    }
    dispatch(openCart());

    // const action = await dispatch(fetchCart());
    
    // if (fetchCart.fulfilled.match(action)) {
    //   dispatch(openCart());
    // } else {
    //   alert(action.payload || "Failed to load cart");
    // }
  };

  const handleSignOutClick = () => {
    // TODO: later connect real auth logout
    alert("Sign out is not wired yet.");
  };

  return (
    <Stack direction="row" spacing={{ xs: 1, sm: 2 }} alignItems="center">
      
      {isLoggedIn ? (
        <Button 
          color="inherit" 
          startIcon={<PersonOutlineIcon />}
          sx={{ textTransform: 'none', fontWeight: 500, fontSize: '0.9rem' }}
          onClick={handleSignOutClick}
        >
         { user?.username } Sign Out
        </Button>
      ) : (
        <Button 
          color="inherit" 
          onClick={handleSignIn}
          startIcon={<PersonOutlineIcon />}
          sx={{ textTransform: 'none', fontWeight: 500, fontSize: '0.9rem' }}
          onClick={() => navigate("/login")}
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
        onClick={handleCartClick}
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