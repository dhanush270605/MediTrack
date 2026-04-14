const { validationResult } = require('express-validator');
const { errorResponse } = require('../utils/helpers');

/**
 * Run after express-validator chains.
 * Returns 422 with a map of field → error messages if validation fails.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().reduce((acc, err) => {
      acc[err.path] = err.msg;
      return acc;
    }, {});
    return errorResponse(res, 'Validation failed. Please check your input.', 422, formatted);
  }
  next();
};

module.exports = { validate };
