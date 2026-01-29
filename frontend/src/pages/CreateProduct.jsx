import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Container, Typography, TextField, Button, Box, 
  Paper, Stack, CircularProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { createProduct, updateProduct, fetchProducts, deleteProduct } from '../store/productSlice';

const CreateProduct = () => {
  // Get the ID from the URL (e.g., /product/edit/123)
    const { id } = useParams(); 
    const isEditMode = id ? true : false;

    const dispatch = useDispatch();
    const navigate = useNavigate();
    // This ref is used to click the hidden file input
    const fileInputRef = useRef(null);
    // Get product list and status from Redux store
    const { products } = useSelector((state) => state.products);
    const { status } = useSelector((state) => state.products);
    const isLoading = status === 'loading';

    //Local State: Store values for each input field
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState(''); 
    const [price, setPrice] = useState('');
    const [countInStock, setCountInStock] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    // useEffect: Auto-fill the form if we are editing
    useEffect(() => {
      // If we are editing but don't have products yet, fetch them from the server
        if (isEditMode && status === 'idle') {
          dispatch(fetchProducts());
        }
        
        if (isEditMode && products.length > 0) {
            const productToEdit = products.find(p => String(p._id) === String(id));
            if (productToEdit) {
              // Update local state with the existing product data
                setName(productToEdit.name);
                setDescription(productToEdit.description);
                setCategory(productToEdit.category);
                setPrice(productToEdit.price);
                setCountInStock(productToEdit.countInStock);
                setImageUrl(productToEdit.imageUrl);
            }
        }
    }, [id, isEditMode, products, status, dispatch]);
    // Event Handlers: Update state when user types in the input fields
    const handleNameChange = (e) => setName(e.target.value);
    const handleDescriptionChange = (e) => setDescription(e.target.value);
    const handleCategoryChange = (e) => setCategory(e.target.value);
    const handlePriceChange = (e) => setPrice(e.target.value);
    const handleStockChange = (e) => setCountInStock(e.target.value);
    const handleImageLinkChange = (e) => setImageUrl(e.target.value);
    // Handle file upload from computer
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
        const reader = new FileReader();
        reader.onloadend = () => { 
          setImageUrl(reader.result);
        };
        reader.readAsDataURL(file);
        }
    };
    // Handle Delete button click
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            try {
                await dispatch(deleteProduct(id)).unwrap();
                navigate('/product');
            } catch (err) {
                console.error('Delete failed:', err);
                alert('Delete failed');
            }
        }
    };
    // Handle Form Submission (Create or Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
      // basic validation
        if (!name || !price) {
            alert("Please fill in name and price");
            return;
        }
    // Prepare the data object to send to the server
        const productData = {
            name: name,
            description: description,
            category: category,
            price: Number(price),            
            countInStock: Number(countInStock), 
            imageUrl: imageUrl
        };

        try {
            if (isEditMode) {
                // edit mode
                await dispatch(updateProduct({ ...productData, _id: id })).unwrap();
            } else {
                // create mode
                await dispatch(createProduct(productData)).unwrap();
            }
            navigate('/product'); 
        } catch (err) {
            console.error('Failed to save product:', err);
            alert('Operation failed');
        }
    };

    const Label = ({ text }) => (
        <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 'bold', color: '#444' }}>
        {text}
        </Typography>
    );

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight="800" sx={{ mb: 3 }}>
            {isEditMode ? 'Edit Product' : 'Create Product'}
        </Typography>
        <Paper elevation={0} sx={{ p: 4, border: '1px solid #e0e0e0', borderRadius: 3 }}>
            <form onSubmit={handleSubmit}>
            <Stack spacing={3}>

            {/* 1. Name */}
            <Box>
              <Label text="Product Name" />
              <TextField 
                fullWidth size="small" name="name" placeholder="iWatch"
                value={name} onChange={handleNameChange} 
              />
            </Box>

            {/* 2. Description */}
            <Box>
              <Label text="Product Description" />
              <TextField 
                fullWidth multiline rows={4} name="description" placeholder="Description..."
                value={description} onChange={handleDescriptionChange} 
              />
            </Box>

            {/* 3. Category & Price */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Box sx={{ flex: 1 }}>
                <Label text="Category" />
                <TextField 
                  select fullWidth size="small" name="category" 
                  value={category} onChange={handleCategoryChange}
                  SelectProps={{ native: true }} 
                >
                  <option value="" disabled>Select Category</option>
                  <option value="category1">category1</option>
                  <option value="category2">category2</option>
                  <option value='category3'>category3</option>
                </TextField>
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <Label text="Price" />
                <TextField 
                  fullWidth size="small" type="number" name="price" placeholder="50"
                  value={price} onChange={handlePriceChange} 
                  inputProps={{ min: 0 }}
                />
              </Box>
            </Stack>

            {/* 4. Stock & Link */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Box sx={{ flex: 1 }}>
                <Label text="In Stock Quantity" />
                <TextField 
                  fullWidth size="small" type="number" name="countInStock" placeholder="100"
                  value={countInStock} onChange={handleStockChange} 
                  inputProps={{ min: 0 }}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Label text="Add Image Link" />
                <Stack direction="row" spacing={1}>
                  <TextField 
                    fullWidth size="small" name="imageUrl" placeholder="http://"
                    value={imageUrl} onChange={handleImageLinkChange} 
                  />
                  <Button variant="contained" onClick={() => fileInputRef.current.click()} sx={{ bgcolor: '#5346bd' }}>
                    Upload
                  </Button>
                </Stack>
                <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleFileChange} />
              </Box>
            </Stack>

            {/* 5. Image Preview */}
            <Box sx={{ 
               height: 200, border: '2px dashed #ddd', borderRadius: 2, 
               display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fafafa'
            }}>
               {imageUrl ? (
                 <img src={imageUrl} alt="Preview" style={{ maxHeight: '100%', maxWidth: '100%' }} />
               ) : (
                 <Stack alignItems="center" color="#bbb">
                   <CloudUploadIcon sx={{ fontSize: 40 }} />
                   <Typography variant="body2">Image Preview</Typography>
                 </Stack>
               )}
            </Box>

            {/* 6. Submit Button */}
          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button 
              type="submit" variant="contained" size="large" disabled={isLoading}
              sx={{ bgcolor: '#5346bd', py: 1.5, fontWeight: 'bold' }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : (isEditMode ? 'Update Product' : 'Add Product')}
            </Button>

            {isEditMode && (
                <Button 
                  type="button" 
                  variant="outlined" 
                  color="error" 
                  size="large"
                  onClick={handleDelete}
                  disabled={isLoading}
                  sx={{ py: 1.5, fontWeight: 'bold', px: 4 }}
                >
                  Delete
                </Button>
              )}
          </Stack>
            

          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateProduct;