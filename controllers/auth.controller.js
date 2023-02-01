const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const sendEmail = require('../utils/email');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

exports.signup = async(req, res, next) => {

    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    });

    const token = signToken(newUser._id);


    try {
        await sendEmail({
            email: 'mkverma541@gmail.com',
            subject: 'test email'
        })

        res.status(201).json({
            status: 'success',
            token: token,
            data: {
                user: newUser
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            error: err
        })
    }
}


exports.login = async(req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    // check if email and password exist

    if (!email || !password) {
        return res.status(400).json({
            status: 'fail',
            response: 'Please provide email or password'
        });
    }


    // check if user exists && and password is correct

    const user = await User.findOne({ email }).select('+password');
    console.log(user)

    if (!user || !(await user.correctPassword(password, user.password))) {
        return res.status(400).json({
            status: 'fail',
            response: 'Please provide valid password'
        })
    }

    // if everything ok, then send token to the client

    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token
    })

}


exports.protect = async(req, res, next) => {
    // getting token and check of it's there

    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    console.log(token)

    if (!token) {
        return res.status(401).json({
            status: 'fail',
            response: 'You are not logged in. Please login to get access.'
        })
    }


    next();
}