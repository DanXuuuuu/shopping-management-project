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
        bgcolor: '#111827', 
        boxShadow: 'none',
        py: { xs: 1, sm: 0.5 } // 手机端增加上下间距
      }}
    >
      <Container maxWidth="xl">
        <Toolbar 
          disableGutters 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            flexWrap: 'wrap', 
            minHeight: { xs: 'auto', sm: 64 } 
          }}
        >
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Logo />
          </Box>

          <Box 
            sx={{ 
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

          <Box sx={{ order: { xs: 2, sm: 3 } }}>
            <UserStatus />
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;