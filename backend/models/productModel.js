const mongoose = require('mongoose')

const productSchema = mongoose.Schema(
    {
        //product name
        name: {
            type: String,
            required: [true, 'Please add a name'],
        }, 
        //product description
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        //price
        price: {
            type: Number,
            required: [true, 'Please add a price'],
            min: 0,
        },
        //category 
        category: {
            type: String,
            required: [true, 'please select a category'],
        },
        //in stock quantity
        countInStock: {
            type: Number,
            required: [true, 'please add a stock quantity'],
            default: 0
        },
        //add image link
        imageUrl: {
            type: String,
            required: [true, 'please add an image URL'],
        },
        //userId -> for admin use
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Product', productSchema)