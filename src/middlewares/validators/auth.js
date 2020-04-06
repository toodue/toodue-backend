const { body } = require('express-validator');

exports.sign_up = [
  body('email').
    isEmail().withMessage('This email is not in a valid format'),
  body('name').
    isLength({ min: 1 }).withMessage('The name field cannot be empty'),
  body('password').
    isLength({ min: 8, max: 30 }).withMessage('The password field must have between 8 and 30 characters'),
];
