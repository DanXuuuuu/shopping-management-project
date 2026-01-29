import React from 'react';
import { AppBar, Toolbar, Box, Container } from '@mui/material';
import Logo from './Logo';
import SearchBar from './SearchBar';
import UserStatus from './UserStatus';

const Header = () => {
  return (
    <AppBar 
      position="static" 
      sx={{ 
        bgcolor: '#111827', // 对应设计稿深色背景
        boxShadow: 'none',
        py: { xs: 1, sm: 0.5 } // 手机端稍微增加上下间距
      }}
    >
      <Container maxWidth="xl">
        <Toolbar 
          disableGutters 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            flexWrap: 'wrap', // 允许内容换行
            minHeight: { xs: 'auto', sm: 64 } 
          }}
        >
          
          {/* 1. 左侧 Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Logo />
          </Box>

          {/* 2. 中间搜索框 - 核心响应式逻辑 */}
          <Box 
            sx={{ 
              // 在桌面端排在第 2 位，手机端排在第 3 位（换行显示）
              order: { xs: 3, sm: 2 }, 
              width: { xs: '100%', sm: 'auto' }, // 手机端全宽
              mt: { xs: 1.5, sm: 0 }, // 手机端换行后加个间距
              flexGrow: { sm: 1 },
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <SearchBar />
          </Box>

          {/* 3. 右侧用户状态 (Sign In/Cart) */}
          <Box sx={{ order: { xs: 2, sm: 3 } }}>
            <UserStatus />
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;