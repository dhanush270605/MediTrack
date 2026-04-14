const UserModel = require('../models/userModel');
const { sanitizeUser, successResponse, errorResponse } = require('../utils/helpers');

// GET /api/users  (admin only)
const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const result = await UserModel.findAll({ page, limit });
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

// GET /api/users/:id
const getUserById = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return errorResponse(res, 'User not found.', 404);

    // Non-admins can only view their own profile
    if (req.user.role !== 'administrator' && req.user.id !== user.id) {
      return errorResponse(res, 'Access denied.', 403);
    }

    return successResponse(res, { user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
};

// PUT /api/users/:id
const updateUser = async (req, res, next) => {
  try {
    if (req.user.role !== 'administrator' && req.user.id !== req.params.id) {
      return errorResponse(res, 'Access denied.', 403);
    }

    const updated = await UserModel.update(req.params.id, req.body);
    if (!updated) return errorResponse(res, 'User not found or no updatable fields provided.', 404);

    return successResponse(res, { user: sanitizeUser(updated) }, 'User updated successfully.');
  } catch (err) {
    next(err);
  }
};

// DELETE /api/users/:id  (soft delete)
const deleteUser = async (req, res, next) => {
  try {
    if (req.user.role !== 'administrator' && req.user.id !== req.params.id) {
      return errorResponse(res, 'Access denied.', 403);
    }

    const deleted = await UserModel.softDelete(req.params.id);
    if (!deleted) return errorResponse(res, 'User not found.', 404);

    return successResponse(res, null, 'Account deactivated successfully.');
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };
