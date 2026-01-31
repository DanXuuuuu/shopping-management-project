import React from 'react';
import { Box, Container, Typography, Stack } from '@mui/material';
import SocialLinks from './SocialLinks';
import FooterLinks from './FooterLinks';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: '#111827', 
        color: 'white', 
        py: 4, 
        mt: 'auto' 
      }}
    >
      <Container maxWidth="xl">
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          justifyContent="space-between" 
          alignItems="center" 
          spacing={3}
        >
          
          <Typography variant="body2" sx={{ opacity: 0.8, order: { xs: 2, md: 1 } }}>
            ©2026 All Rights Reserved.
          </Typography>

          <Box sx={{ order: { xs: 1, md: 2 } }}>
            <SocialLinks />
          </Box>

          <Box sx={{ order: { xs: 3, md: 3 } }}>
            <FooterLinks />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;