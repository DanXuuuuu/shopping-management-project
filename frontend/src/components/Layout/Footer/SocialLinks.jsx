import React from 'react';
import { Stack, Link } from '@mui/material';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';

const SocialLinks = () => {
  return (
    <Stack direction="row" spacing={3} sx={{ color: 'white' }}>
      <Link href="#" color="inherit"><YouTubeIcon /></Link>
      <Link href="#" color="inherit"><TwitterIcon /></Link>
      <Link href="#" color="inherit"><FacebookIcon /></Link>
    </Stack>
  );
};

export default SocialLinks;