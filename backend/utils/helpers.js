const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

/**
 * Hash a plain-text password
 */
const hashPassword = async (plain) => {
  const rounds = parseInt(process.env.BCRYPT_ROUNDS, 10) || 12;
  return bcrypt.hash(plain, rounds);
};

/**
 * Compare a plain password to a stored hash
 */
const verifyPassword = async (plain, hash) => {
  return bcrypt.compare(plain, hash);
};

/**
 * Generate a new UUID v4
 */
const generateId = () => uuidv4();

/**
 * Build a standard success response payload
 */
const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Build a standard error response payload
 */
const errorResponse = (res, message = 'An error occurred', statusCode = 500, errors = null) => {
  const payload = { success: false, message };
  if (errors) payload.errors = errors;
  return res.status(statusCode).json(payload);
};

/**
 * Strip sensitive fields from a user object before sending to client
 */
const sanitizeUser = (user) => {
  const { password_hash, ...safe } = user;
  return safe;
};

module.exports = {
  hashPassword,
  verifyPassword,
  generateId,
  successResponse,
  errorResponse,
  sanitizeUser,
};
