import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import AddToCart from './AddToCart';

const ProductCard = ({ product, isAdmin }) => {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        width: '100%',
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: '8px', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)', 
        border: '1px solid #eee',
        transition: '0.3s',
        position: 'relative',
        '&:hover': { boxShadow: '0 5px 20px rgba(0,0,0,0.1)' } 
      }}
    >
      {/* 1. image area */}
      <Box sx={{ position: 'relative', p: 2, bgcolor: '#fff', display: 'flex', justifyContent: 'center' }}>
        <Box 
          sx={{ 
            width: '100%',     
            height: '200px',    
            display: 'flex',  
  
            justifyContent: 'center', 
            alignItems: 'center',    
            bgcolor: '#fff',   
            overflow: 'hidden', 
            mx: 'auto',         
            my: 2               
          }}
        >
        <Link
          to={`/product/${product._id}`}
          style={{
            display: 'flex',         
            width: '100%',          
            height: '100%',        
            alignItems: 'center',   
            justifyContent: 'center' 
          }}>
          <CardMedia
            component="img"
            image={product.imageUrl} 
            alt={product.name}
            sx={{ 
             width: '100%',
             height: '100%',
             objectFit: 'contain', 
          }} 
        />
        </Link>
        </Box>
        {/* Out of Stock */}
        {product.countInStock === 0 && (
          <Chip 
            label="Out of Stock" 
            color="error" 
            size="small" 
            sx={{ position: 'absolute', top: 10, right: 10 }}
          />
        )}
      </Box>

      {/* 2. content area */}
      <CardContent sx={{ flexGrow: 1, pt: 1 }}>

        <Typography 
          variant="body2" 
          color="text.secondary" 
          gutterBottom
          sx={{ fontSize: '0.875rem' }}
        >
          {product.category}
        </Typography>
        
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ fontWeight: 'bold', mb: 1, 
            lineHeight: 1.2, 
            display: '-webkit-box',
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
            height: '2.4em' }}
        >
          {product.name}
        </Typography>

        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', color: '#1a1a1a' }}>
          ${product.price}
        </Typography>
      </CardContent>
    

      {/* 3. button area */}
      <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
        {/* Add Button */}
        <Box sx={{ flex: 1 }}> 
            <AddToCart product={product} />
        </Box>

        {/* Edit Button (Outlined) */}
      {isAdmin && (<Button 
          variant="outlined" 
          fullWidth
          component={Link}
          to={`/product/edit/${product._id}`}
          sx={{ 
            borderColor: '#ddd',
            color: '#333',
            textTransform: 'none',
            '&:hover': { borderColor: '#999', bgcolor: '#f5f5f5' }
          }}
        >
          Edit
        </Button> )}
        
      </Box>
    </Card>
  );
};

export default ProductCard;