const Product = require('../models/productModel')

//@desc    Fetch all products
//@route   GET /api/products
//@access  Public
const getProducts = async (req, res) => {
    try {
        const pageSize = 8;
        const page = Number(req.query.pageNumber) || 1;

        const keyword = req.query.keyword ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i'
            }
        } : {};
        let sortOption = { createdAt: -1 };
        switch (req.query.sort) {
            case 'price-asc':
                sortOption = { price: 1 }; 
                break;
            case 'price-desc':
                sortOption = { price: -1 }; 
                break;
            case 'last-added':
                sortOption = { createdAt: -1 }; 
                break;
            default:
                sortOption = { createdAt: -1 };
    }
        const count = await Product.countDocuments({ ...keyword });

        const products = await Product.find({ ...keyword })
            .sort(sortOption)
            .skip(pageSize * (page - 1))
            .limit(pageSize);
        res.json({
            products, 
            page, 
            pages: Math.ceil(count / pageSize)
        });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Desc:   Fetch single product
// Route:  GET /api/products/:id
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)

        if (product) {
            res.json(product)
        } else {
            res.status(404).json({ message: 'Product not found' })
        }
    } catch (error) {
        res.status(404).json({ message: 'Product not found' })
    }
}

//@desc    Create a product
//@route   POST /api/products
//@access  Private/Admin
const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, countInStock, imageUrl } = req.body;

        const product = new Product({
            name,
            description,
            price,
            category,
            countInStock,
            imageUrl,
            //user: req.user._id,
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: 'Invalid product data: ' + error.message });
    }
}

//@desc    Update a product
//@route   PUT /api/products/:id
//@access  Private/Admin
const updateProduct = async (req, res) => {
    try {
        const { name, price, description, imageUrl, category, countInStock } = req.body

        const product = await Product.findById(req.params.id)

        if (product) {

            product.name = name || product.name
            product.price = price || product.price
            product.description = description || product.description
            product.imageUrl = imageUrl || product.imageUrl
            product.category = category || product.category
          
            if (countInStock !== undefined) {
                product.countInStock = countInStock
            }

            const updatedProduct = await product.save()
            res.json(updatedProduct)
        } else {
            res.status(404).json({ message: 'Product not found' })
        }
    } catch (error) {
        console.error(error) 
        res.status(400).json({ message: 'Update failed', error: error.message })
    }
}

// Desc:   Delete a product
// Route:  DELETE /api/products/:id
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)

        if (product) {
            await product.deleteOne() 
            res.json({ message: 'Product removed' })
        } else {
            res.status(404).json({ message: 'Product not found' })
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' })
    }
}

module.exports = {
    getProducts,
    createProduct,
    updateProduct,
    getProductById,
    deleteProduct
};