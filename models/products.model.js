const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductsCategories",
        default: null
    },
    tags: {
        type: Array
    },
    sku: {
        type: String
    },
    regularPrice: {
        type: Number,
    },
    salePrice: {
        type: Number,
    },
    price: {
        type: Number
    },
    quantity: {
        type: Number
    },
    stockStatus: {
        type: String
    },
    weight: {
        type: String
    },
    dimension: {
        type: String,
    },
    attributes: {

        type: String,
    },
    isEnabledReviews: {
        type: Boolean
    },
    rating: {
        type: Number
    },
    shortDescription: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    thumbnail: {
        type: Array
    },
    images: {
        type: Array,
    },

    status: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    updatedAt: {
        type: Date,
    }
})

const Product = mongoose.model('Products', productSchema);

module.exports = Product;