const express = require('express')
const router = express.Router()

const {
    getProducts,
    createProduct,
    updateProduct,
    getProductById,
    deleteProduct
} = require('../controllers/productController')

// Define routes
router.route('/').get(getProducts).post(createProduct)
router.route('/:id').put(updateProduct).get(getProductById).delete(deleteProduct)


module.exports = router
