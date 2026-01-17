import React from 'react';
import { Stack, Link } from '@mui/material';

const FooterLinks = () => {
  return (
    <Stack 
      direction="row" 
      spacing={4} 
      sx={{ 
        '& a': { 
          color: 'white', 
          textDecoration: 'none', 
          fontSize: '0.875rem',
          '&:hover': { textDecoration: 'underline' }
        } 
      }}
    >
      <Link href="#">Contact us</Link>
      <Link href="#">Privacy Policies</Link>
      <Link href="#">Help</Link>
    </Stack>
  );
};

export default FooterLinks;