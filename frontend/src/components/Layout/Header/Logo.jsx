import React from 'react';
import { Typography, Box } from '@mui/material';

const Logo = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'baseline', color: 'white', cursor: 'pointer' }}>
      <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
        Management
      </Typography>
      <Typography variant="caption" sx={{ ml: 0.5, fontSize: '0.75rem', opacity: 0.9 }}>
        Chuwa
      </Typography>
    </Box>
  );
};

export default Logo;