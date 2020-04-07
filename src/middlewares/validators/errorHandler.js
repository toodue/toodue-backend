const expressValidator = require('express-validator');

module.exports = (req, res, next) => {
  const errors = expressValidator.validationResult(req);
  if (!errors.isEmpty()) {
    const errorResponse = {}
    errors.array().forEach((error) => {
      errorResponse[error.param] = error.msg;
    });
    return res.status(422).json({ error: errorResponse });
  }

  next();
}
