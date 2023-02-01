const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true
    },
    image: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
    }
})

const ProductsCategories = mongoose.model('ProductsCategories', schema);

module.exports = ProductsCategories;