const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    }
});

userSchema.methods.generateToken = function() {
    const token = jwt.sign({_id: this._id}, config.get('jwtKey'));
    return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        userName: Joi.string().required().min(5).max(50),
        email: Joi.string().required().min(5).max(50).email(),
        password: Joi.string().required().min(5).max(1024)
    });
    const result = schema.validate(user);
    return result;
}

module.exports.User = User;
module.exports.validateUser = validateUser;