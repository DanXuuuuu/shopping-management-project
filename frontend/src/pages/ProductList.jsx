import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Grid, Container, Typography, Button, Box, 
  Select, MenuItem, FormControl, Pagination
} from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/Product/ProductCard';
import { sortProducts, fetchProducts } from '../store/productSlice'; // import sort action from product slice


const ProductList = () => {
  const dispatch = useDispatch();
  const { keyword } = useParams();

  const { products } = useSelector((state) => state.products);
  const { status } = useSelector((state) => state.products);
  const { pages } = useSelector((state) => state.products);

  const [sort, setSort] = useState('last-added'); // default sort state
  const [page, setPage] = useState(1);

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const isAdmin = isAuthenticated && user && user.role === 'admin';

  useEffect(() => {
    dispatch(fetchProducts({ 
      keyword, 
      pageNumber: page, 
      sort: sort 
    }));
  }, [dispatch, keyword, page, sort]);

  const handlePageChange = (event, value) => {
    // console.log("Current page:", value);
    setPage(value);
    // scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth'});
  }

  // handle sort change
  const handleSortChange = (event) => {
    const value = event.target.value;
    setSort(value);
    setPage(1); //back to first page after sorting
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, bgcolor: '#f9f9f9', minHeight: '80vh' }}>
      
      {/* Header area */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        gap: 2,

      }}>
        {/* left side header */}
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ color: '#1a1a1a', textAlign: { xs: 'center', sm: 'left' },
                width: { xs: '100%', sm: 'auto' }}}>
          Products
        </Typography>

        {/* right side controls */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {/* sort dropdown */}
          <FormControl size="small" sx={{ minWidth: 150, bgcolor: 'white' }}>
            <Select
              value={sort}
              onChange={handleSortChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Sort by' }}
            >
              <MenuItem value="last-added">Last added</MenuItem>
              <MenuItem value="price-asc">Price: low to high</MenuItem>
              <MenuItem value="price-desc">Price: high to low</MenuItem>
            </Select>
          </FormControl>

          {/* Add Product button */}
          {isAdmin && (<Button 
            variant="contained" 
            size="large"
            component={Link}
            to="/product/new"
            sx={{ 
              bgcolor: '#5346bd', 
              textTransform: 'none',
              fontWeight: 'bold',
              '&:hover': { bgcolor: '#403599' }
            }}
          >
            Add Product
          </Button>  )}
          
        </Box>
      </Box>

      {/* product grid list */}
      <Grid container spacing={3} sx={{ justifyContent:{ xs: 'center', sm:'flex-start'}}}>
        {products.map((product) => (
          // xs=12 (mobile: 1 per row), sm=6 (ipad: 2 per row), md=4 (laptop: 3 per row), lg=3 (monitor: 4 per row)
          <Grid key={product._id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }} sx={{ display: 'flex' }}>
            <ProductCard product={product} isAdmin={isAdmin} />
          </Grid>
        ))}
      </Grid>

      {/* Pagination area */}
      {pages > 1 && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          mt: 6, 
          mb: 2  
        }}>
          <Pagination
            count={pages}     
            page={page}       
            onChange={handlePageChange}
            shape="rounded"    
            color="primary"   
            sx={{
              '& .Mui-selected': {
                backgroundColor: '#5346bd !important',
                color: '#fff',
                fontWeight: 'bold'
              },
              '& .MuiPaginationItem-root:hover': {
                 backgroundColor: '#f0f0f0'
              }
            }}
          />
        </Box>
      )}
    </Container>
  );
};

export default ProductList;