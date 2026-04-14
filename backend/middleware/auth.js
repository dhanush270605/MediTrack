const { verifyToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/helpers');
const logger = require('../utils/logger');

/**
 * Protect routes — require a valid Bearer JWT in Authorization header.
 * Attaches decoded user payload to req.user.
 */
const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Authentication required. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    req.user = decoded; // { id, email, role, full_name }
    next();
  } catch (err) {
    logger.warn(`Auth middleware failure: ${err.message} — IP: ${req.ip}`);
    if (err.name === 'TokenExpiredError') {
      return errorResponse(res, 'Session expired. Please log in again.', 401);
    }
    return errorResponse(res, 'Invalid or malformed token.', 401);
  }
};

/**
 * Role-based access guard.
 * Usage: authorize('caregiver', 'administrator')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return errorResponse(
        res,
        `Access denied. Role '${req.user?.role}' is not authorised for this resource.`,
        403
      );
    }
    next();
  };
};

module.exports = { protect, authorize };
