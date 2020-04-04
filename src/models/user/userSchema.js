const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true }
});

userSchema._middlewares = {
    hashPassword: function(next) {
        const user = this;
        if (!user.isModified('password')) {
            return next();
        }

        bcrypt.genSalt(SALT_ROUNDS, (err, salt) => {
            if (err) return next(err); 

            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) return next(err);
                user.password = hash;
                next();
            })
        });
    }
};

userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return callback(err);
        callback(null, isMatch);
    })
};

userSchema.pre('save', userSchema._middlewares.hashPassword);

module.exports = userSchema;
