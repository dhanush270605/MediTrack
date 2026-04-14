const logger = require('../utils/logger');

/**
 * Global error handler — must be registered LAST in Express middleware chain.
 * Catches any error thrown with next(err) or unhandled throws.
 */
const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Log full stack in development, just message in production
  logger.error(`[${req.method}] ${req.originalUrl} → ${status}: ${err.stack || message}`);

  res.status(status).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong. Please try again.' : message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

/**
 * 404 handler for unmatched routes
 */
const notFound = (req, res, next) => {
  const err = new Error(`Route not found: [${req.method}] ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
};

module.exports = { errorHandler, notFound };
