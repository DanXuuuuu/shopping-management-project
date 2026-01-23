import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { 
  Container, Grid, Typography, Box, Button, Chip, Stack 
} from '@mui/material';
import { Link } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const { products } = useSelector((state => state.products))
  console.log("URL ID:", id, typeof id);
  console.log("Redux Products:", products);
  const product = products.find((p) => String(p._id) === String(id));
  if (!product) {
    return (
        <Container sx={{ py: 10, textAlign: 'center' }}>
            <Typography variant="h5">Product not found</Typography>
            <Typography color="text.secondary">ID: {id}</Typography>
        </Container>
    );
  }


return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ mb: 4 }}>
        <Typography 
            variant="h4" 
            component="h1" 
            fontWeight="bold" 
            sx={{ 
                color: '#1a1a1a', 
                textAlign: { xs: 'center', sm: 'left' },
                width: { xs: '100%', sm: 'auto' }
            }}
        >
            Products Detail
        </Typography>
      </Box>
      <Grid container spacing={6}>
        
        {/* left side */}
        
        <Grid size={{ xs: 12, md: 6 }}>
          <Box 
            sx={{ 
              width: '100%', 
              height: '400px', 
              bgcolor: '#f5f5f5', 
              borderRadius: 2,
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              overflow: 'hidden'
            }}
            
          >
            <Box 
              component="img" 
              src={product.imageUrl} 
              alt={product.name}
              sx={{ 
                maxWidth: '90%', 
                maxHeight: '90%', 
                objectFit: 'contain' 
              }}
            />
          </Box>
        </Grid>

        {/* right side */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={2}>
            
            <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
              {product.category}
            </Typography>

            <Typography variant="h4" fontWeight="bold">
              {product.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h4" fontWeight="bold" sx={{ color: '#1a1a1a' }}>
                ${product.price}
              </Typography>
              {product.countInStock === 0 && (
                <Chip label="Out of Stock" color="error" size="small" variant="outlined" />
              )}
            </Box>

            <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
              {product.description}
            </Typography>

            <Box sx={{ pt: 2, display: 'flex', gap: 2 }}>
               
               {/* Add To Cart Button */}
               <Button 
                 variant="contained" 
                 size="large"
                 disabled={product.countInStock === 0}
                 sx={{ 
                   bgcolor: '#5346bd', 
                   py: 1.5, 
                   px: 4, 
                   fontWeight: 'bold',
                   textTransform: 'none',
                   '&:hover': { bgcolor: '#403599' }
                 }}
               >
                 Add To Cart
               </Button>

               {/* Edit Button */}
               <Button 
                 variant="outlined" 
                 size="large"
                 component={Link}       
                 to={`/product/edit/${product._id}`}
                 sx={{ 
                   py: 1.5, 
                   px: 4, 
                   fontWeight: 'bold',
                   textTransform: 'none',
                   color: '#1a1a1a',
                   borderColor: '#ccc',
                   '&:hover': { 
                      borderColor: '#1a1a1a',
                      bgcolor: '#f5f5f5' 
                   }
                 }}
               >
                 Edit
               </Button>

            </Box>

          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail;