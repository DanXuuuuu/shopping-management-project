import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Container, Typography, TextField, Button, Box, 
  Paper, Stack, CircularProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { createProduct, updateProduct } from '../store/productSlice';

const CreateProduct = () => {
    const { id } = useParams(); //fetch id from url 
    const isEditMode = !!id;

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const { products, status } = useSelector((state) => state.products);
    const isLoading = status === 'loading';

    const [formData, setFormData] = useState({
        name: '', description: '', category: '', price: '', countInStock: '', imageUrl: ''
    });

    // 3. find product by id from redux may change later (under edit mode)
    useEffect(() => {
        if (isEditMode) {
        const productToEdit = products.find(p => p._id === id);
        if (productToEdit) {
            setFormData(productToEdit); // auto fullfill form 
        }
        }
    }, [id, isEditMode, products]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setFormData(prev => ({ ...prev, imageUrl: reader.result }));
        reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.price) return alert("Required fields missing!");
    
        const productData = {
            ...formData,
            price: Number(formData.price),
            countInStock: Number(formData.countInStock)
        };

        if (isEditMode) {
        // 4. edit mode：Dispatch Update
            dispatch(updateProduct({ ...productData, _id: id }))
            .unwrap()
            .then(() => navigate('/product'));
        } else {
      // 5. create mode：Dispatch Create
        dispatch(createProduct(productData))
            .unwrap()
            .then(() => navigate('/product'));
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
                value={formData.name} onChange={handleChange} 
              />
            </Box>

            {/* 2. Description */}
            <Box>
              <Label text="Product Description" />
              <TextField 
                fullWidth multiline rows={4} name="description" placeholder="Description..."
                value={formData.description} onChange={handleChange} 
              />
            </Box>

            {/* 3. Category & Price */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Box sx={{ flex: 1 }}>
                <Label text="Category" />
                <TextField 
                  select fullWidth size="small" name="category" 
                  value={formData.category} onChange={handleChange}
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
                  value={formData.price} onChange={handleChange} 
                />
              </Box>
            </Stack>

            {/* 4. Stock & Link */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Box sx={{ flex: 1 }}>
                <Label text="In Stock Quantity" />
                <TextField 
                  fullWidth size="small" type="number" name="countInStock" placeholder="100"
                  value={formData.countInStock} onChange={handleChange} 
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Label text="Add Image Link" />
                <Stack direction="row" spacing={1}>
                  <TextField 
                    fullWidth size="small" name="imageUrl" placeholder="http://"
                    value={formData.imageUrl} onChange={handleChange} 
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
               {formData.imageUrl ? (
                 <img src={formData.imageUrl} alt="Preview" style={{ maxHeight: '100%', maxWidth: '100%' }} />
               ) : (
                 <Stack alignItems="center" color="#bbb">
                   <CloudUploadIcon sx={{ fontSize: 40 }} />
                   <Typography variant="body2">Image Preview</Typography>
                 </Stack>
               )}
            </Box>

            {/* 6. Submit Button */}
            <Button 
              type="submit" variant="contained" size="large" disabled={isLoading}
              sx={{ bgcolor: '#5346bd', py: 1.5, fontWeight: 'bold' }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Add Product'}
            </Button>

          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateProduct;