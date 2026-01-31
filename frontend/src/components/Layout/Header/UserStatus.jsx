import React from 'react';
import { Stack, Button, Badge, Typography } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; 
import { openCart } from '../../../store/cartSlice';
import { logout } from '../../../store/authSlice'; 

const UserStatus = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 1. 获取 Auth 状态
  const { user, isAuthenticated } = useSelector((state) => state.auth || {});

  // 2. ✨ 核心修改点：适配最新的 cartSlice
  // 最新的 slice 里状态叫 cartItems，所以这里要解构 cartItems
  const { cartItems } = useSelector((state) => state.cart || {});
  
  // 增加空值保护，确保它永远是数组
  const safeCartItems = cartItems || []; 

  // 3. 计算逻辑 (使用 safeCartItems)
  const cartItemCount = safeCartItems.reduce((sum, item) => sum + (item.qty || 0), 0);

  const subtotal = safeCartItems.reduce((sum, item) => {
    // 兼容处理：确保能找到 price (item.product.price)
    const price = item.product?.price || item.price || 0; 
    return sum + (price * (item.qty || 0));
  }, 0);

  const money = (n) => n.toFixed(2);

  // --- 事件处理 ---

  const handleCartClick = () => {
    dispatch(openCart());
  };

  const handleSignInClick = () => {
    navigate("/signin");
  };

  const handleSignOutClick = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <Stack direction="row" spacing={{ xs: 1, sm: 2 }} alignItems="center">
      
      {isAuthenticated && user ? (
        <Button 
          color="inherit" 
          startIcon={<PersonOutlineIcon />}
          sx={{ textTransform: 'none', fontWeight: 500, fontSize: '0.9rem' }}
          onClick={handleSignOutClick}
        >
         Hi, { user.username || 'User' } (Sign Out)
        </Button>
      ) : (
        <Button 
          color="inherit" 
          startIcon={<PersonOutlineIcon />}
          sx={{ textTransform: 'none', fontWeight: 500, fontSize: '0.9rem' }}
          onClick={handleSignInClick}
        >
          Sign In
        </Button>
      )}

      {/* 购物车按钮 */}
      <Button 
        color="inherit" 
        sx={{ 
          textTransform: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1
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