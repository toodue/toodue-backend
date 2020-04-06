const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');

const validators = require('../middlewares/validators');
const User = require('../models/user');

router.post('/sign_up', validators.auth.sign_up, validators.errorHandler, (req, res) => {
  const { name, email, password } = req.body
  const user = User({ name: name, email: email, password: password})
  user.save((err) => {
    if (err) return res.status(500).json({ error: err });
    return res.status(201).json({ user: {
      email: user.email,
      name: user.name,
    }});
  });
});

module.exports = router
