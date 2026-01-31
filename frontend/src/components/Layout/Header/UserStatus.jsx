import React from 'react';
import { Stack, Button, Badge, Typography } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useNavigate } from 'react-router-dom';
import { useSelector , useDispatch  } from 'react-redux';
import { logout } from '../../../store/authSlice';


const UserStatus = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // --- 1. 获取用户状态 (目前是模拟，未来可以从 state.user 获取) ---
  // 如果你已经做好了 User Auth，可以用下面这就话代替:
  // const { userInfo } = useSelector((state) => state.user);
  //const { isAuthenticated, user } = useSelector(state => state.auth);

  // --- 2. 获取购物车数据 ---
  // 我们使用你之前定义的 cartItems 数组
  const { cartItems } = useSelector((state) => state.cart);

  // --- 3. 计算数量和总价 ---
  // 你的 cartItems 是数组 [{qty: 1, price: 99}, ...]，所以直接累加即可
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.price * item.qty);
  }, 0);

  // 金额格式化小助手
  const money = (n) => n.toFixed(2);

  // --- 4. 事件处理 ---

  // read the login state from redux
  const { isAuthenticated, user } = useSelector(state=> state.auth);

  // 模拟登录状态，Phase I 之后将由全局 Auth 状态控制

  // deal with the signin button 
  const handleSignIn = () => {
    navigate('/signin');
  };

  const handleSignOut = () => {
    dispatch(logout());
    navigate('/signin');
  };

  const handleCartClick = () => {
    navigate('/cart');
    // 如果你想用侧边栏抽屉模式，可以用队友写的: dispatch(openCart())
  };

  return (
    <Stack direction="row" spacing={{ xs: 1, sm: 2 }} alignItems="center">
      
      {/* 登录/退出状态控制 */}
      {isAuthenticated ? (
        <Button 
          color="inherit" 
          onClick={handleSignOut}
          startIcon={<PersonOutlineIcon />}
          sx={{ textTransform: 'none', fontWeight: 500, fontSize: '0.9rem' }}
        >
         { user?.username } Sign Out
        </Button>
      ) : (
        <Button 
          color="inherit" 
          onClick={handleSignIn}
          startIcon={<PersonOutlineIcon />}
          sx={{ textTransform: 'none', fontWeight: 500, fontSize: '0.9rem' }}
        >
          Sign In
        </Button>
      )}

      {/* 购物车按钮 */}
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