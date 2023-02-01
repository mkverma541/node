const User = require('../models/user.model');

exports.getAllUsers = async(req, res) => {
    try {

        // filtering
        const queryObj = {...req.query };
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach(el => delete queryObj[el]);

        // advanced filtering

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`); // replace match value add $ symbol prefix

        let query = User.find(JSON.parse(queryStr));

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
            const totalDocuments = await User.countDocuments();
            if (skip > totalDocuments) {
                throw new Error('This page does not exist');
            }

        }

        // execute query

        // const features = new APIFeatures(User.find(), req.query)
        //     .filter()
        //     .sort()
        //     .limitFields()
        //     .paginate();

        // const data = await features.query;

        const data = await query;

        res.status(200).json({
            status: 'success',
            results: data.length,
            response: data
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            response: err
        })
    }

}

exports.getUser = async(req, res) => {

    try {
        const data = await User.findById(req.params.id);

        res.status(200).json({
            status: 'success',
            response: data
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            response: 'User not found !'
        })
    }
}


exports.addUser = async(req, res) => {

    try {
        const User = await User.insertOne(req.body);
        res.status(201).json({
            status: 'success',
            response: User
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }

}

exports.updateUser = async(req, res) => {

    try {
        const data = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            response: data,
            message: "User updated successfully"
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            response: err,
        })
    }
}

exports.deleteUser = async(req, res) => {

    try {
        const User = await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: 'success',
            response: 'User deleted successfully'
        })
    } catch {
        res.status(400).json({
            status: 'fail',
            response: 'Invalid User ID'
        })
    }

}