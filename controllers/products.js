const Product = require('../models/products.model');
const Category = require('../models/admin/productsCategories.model')
const APIFeatures = require('../utils/apiFeatures');



exports.aliasTopProducts = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-rating,price';
    req.query.fields = 'title,price,rating';
    next();
}

exports.getAllProducts = async(req, res) => {
    try {

        // filtering
        const queryObj = {...req.query };
        console.log(queryObj)
        const excludeFields = ['page', 'sort', 'limit', 'fields', 'category'];
        excludeFields.forEach(el => delete queryObj[el]);

        // advanced filtering

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`); // replace match value add $ symbol prefix

        let query = Product.find(JSON.parse(queryStr)).populate('category');
        console.log(query, 'ass')

        // sorting

        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy)
        } else {
            query = query.sort('-createdAt');
        }

        // fields limiting

        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v')
        }

        // pagination

        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);


        if (req.query.page) {
            const totalDocuments = await Product.countDocuments();
            if (skip > totalDocuments) {
                throw new Error('This page does not exist');
            }
        }


        // execute query

        // const features = new APIFeatures(Product.find(), req.query)
        //     .filter()
        //     .sort()
        //     .limitFields()
        //     .paginate();

        // const data = await features.query;

        const data = await query;

        res.status(200).json({
            status: 'success',
            results: data.length,
            data: data
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            response: err
        })
    }

}

exports.getProduct = async(req, res) => {

    try {
        const data = await Product.findById(req.params.id).populate('category');

        res.status(200).json({
            status: 'success',
            response: data,
            message: 'Products fetch successfully'

        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            response: 'Product not found !'
        })
    }
}


exports.addProduct = async(req, res) => {

    try {
        const product = await Product.insertMany(req.body);

        res.status(201).json({
            status: 'success',
            response: product
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }

}

exports.updateProduct = async(req, res) => {

    try {
        const data = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            response: data,
            message: "Product updated successfully"
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            response: err,

        })
    }
}

exports.deleteProduct = async(req, res) => {

    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: 'success',
            response: 'Product deleted successfully'
        })
    } catch {
        res.status(400).json({
            status: 'fail',
            response: 'Invalid Product ID'
        })
    }
}


// display products by category

exports.getProductsByCategory = async(req, res) => {

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