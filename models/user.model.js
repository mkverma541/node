const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!']

    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    avatar: String,
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minLength: 8,
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confim your password'],
        select: false,
        validate: {
            validator: function(el) {
                return el === this.password;
            },
            message: 'Password are not the same.'
        }
    }
})

userSchema.pre('save', async function(next) {

    // only run this function if password was actually modified

    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();

})


userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}



const User = mongoose.model('User', userSchema);

module.exports = User;