import React from 'react';
import { Stack, Button, Badge, Typography } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

const UserStatus = () => {
  // 模拟登录状态，Phase I 之后将由全局 Auth 状态控制
  const isLoggedIn = false; 
  // 模拟购物车数量
  const cartItemCount = 0;

  return (
    <Stack direction="row" spacing={{ xs: 1, sm: 2 }} alignItems="center">
      
      {/* 登录/退出状态控制 */}
      {isLoggedIn ? (
        <Button 
          color="inherit" 
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

      {/* 购物车状态 - 包含图标、数量角标和金额 */}
      <Button 
        color="inherit" 
        sx={{ 
          textTransform: 'none', 
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <Badge badgeContent={cartItemCount} color="error">
          <ShoppingCartOutlinedIcon />
        </Badge>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          $0.00
        </Typography>
      </Button>

    </Stack>
  );
};

export default UserStatus;