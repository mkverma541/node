const Product = require("../models/products.model");

exports.products = async() => {
    const products = await Product.find();
    return products;
}

exports.productById = async(id) => {
    const product = await Product.findById(id);
    return product;
}

exports.createProduct = async(payload) => {
    const newProduct = await Product.create(payload);
    return newProduct;
}

exports.removeProduct = async(id) => {
    const product = await Product.findByIdAndRemove(id);
    return product;
}

exports.updateProductQuantity = async(productId, quantity) => {
    const product = await Product.findByIdAndUpdate(productId, { quantity: `${quantity}` });
    return product;
}