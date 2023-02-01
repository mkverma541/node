const Product = require('../models/products.model');
const Category = require('../models/admin/productsCategories.model')
const APIFeatures = require('../utils/apiFeatures');



// display products by category

exports.test = async(req, res) => {

    try {

        let params = req.params.category;

        let category = await Category.find({ name: params })
        let query = await Product.find({ category: category }).populate('category');

        const data = query;

        res.status(200).json({
            status: 'success',
            response: data,
            message: 'Product fetched successfully'
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            response: err
        })
    }

}