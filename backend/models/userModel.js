const mongoose = require('../cluster');
const uniqueValidator = require('mongoose-unique-validator');

const userModel = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

userModel.plugin(uniqueValidator);

module.exports = mongoose.model('user', userModel);