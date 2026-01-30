import React, { useState } from 'react';
import { Paper, InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../../../store/productSlice';
const SearchBar = () => {
  // --- state management ---
  const [keyword, setKeyword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // --- handle submit ---
  const submitHandler = (e) => {
    e.preventDefault();

    if (keyword.trim()){ //trim space
      dispatch(fetchProducts(keyword));
      navigate('/product');
    } else {
      dispatch(fetchProducts(''));
      navigate('/product');
    }
  };
  return (
    <Paper
      component="form"
      onSubmit={submitHandler}
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: { xs: '100%', sm: 400, md: 500 }, 
        borderRadius: 1, 
        boxShadow: 'none',
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search"
        inputProps={{ 'aria-label': 'search products' }}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default SearchBar;