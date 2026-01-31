import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { 
  Container, Grid, Typography, Box, Button, Chip, Stack, 
  Alert } from '@mui/material';
import { useEffect } from 'react';
import { fetchProductDetail } from '../store/productSlice';
import AddToCart from '../components/Product/AddToCart';

const ProductDetail = () => {
  const { id } = useParams();
  //Get the dispatch function to trigger Redux actions
  const dispatch = useDispatch();
  //Select specific data from the Redux store:
  //currentProduct: the details of the single product we are looking at
  const { currentProduct, status, error } = useSelector((state) => state.products);

  useEffect(() => {
    if (id) {
      // Trigger the action to fetch data from the backend
      dispatch(fetchProductDetail(id));
    }
  }, [id, dispatch]);

  const product = currentProduct;
// Conditional Rendering: Loading State
  if (status === 'loading') {
    return (
      <Container sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h5">Loading...</Typography>
      </Container>
    );
  }


  if (status === 'failed' || !product) {
    return (
      <Container sx={{ py: 10, textAlign: 'center' }}>
        <Alert severity="error">{error || 'Product not found'}</Alert>
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
            {/* Buttons Area */}
            <Box sx={{ pt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
               
              <Box sx={{ width: '180px' }}>
                  <AddToCart product={product} />
               </Box>

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