const UserModel = require('../models/userModel');
const { hashPassword, verifyPassword, sanitizeUser, successResponse, errorResponse } = require('../utils/helpers');
const { signToken } = require('../utils/jwt');
const logger = require('../utils/logger');

// POST /api/auth/signup
const signup = async (req, res, next) => {
  try {
    const { email, full_name, password, role = 'user', timezone } = req.body;

    const existing = await UserModel.findByEmail(email);
    if (existing) {
      return errorResponse(res, 'An account with this email already exists.', 409);
    }

    const password_hash = await hashPassword(password);
    const user = await UserModel.create({ email, full_name, password_hash, role, timezone });

    const token = signToken({ id: user.id, email: user.email, role: user.role, full_name: user.full_name });

    logger.info(`New user registered: ${user.email} [${user.role}]`);
    return successResponse(res, { user: sanitizeUser(user), token }, 'Account created successfully.', 201);
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findByEmail(email);
    if (!user) {
      return errorResponse(res, 'Invalid email or password.', 401);
    }

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      logger.warn(`Failed login attempt for: ${email}`);
      return errorResponse(res, 'Invalid email or password.', 401);
    }

    await UserModel.updateLastLogin(user.id);
    const token = signToken({ id: user.id, email: user.email, role: user.role, full_name: user.full_name });

    logger.info(`User logged in: ${user.email}`);
    return successResponse(res, { user: sanitizeUser(user), token }, 'Login successful.');
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) return errorResponse(res, 'User not found.', 404);
    return successResponse(res, { user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, login, getMe };
