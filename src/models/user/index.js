const userSchema = require('./userSchema');
const mongoose = require('mongoose');

module.exports = mongoose.model('User', userSchema);