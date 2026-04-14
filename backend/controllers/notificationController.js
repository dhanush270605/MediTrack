const NotificationModel = require('../models/notificationModel');
const { successResponse, errorResponse } = require('../utils/helpers');

// GET /api/notifications
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await NotificationModel.findAllForUser(req.user.id);
    return successResponse(res, { notifications });
  } catch (err) {
    next(err);
  }
};

// PUT /api/notifications/read-all
const markAllAsRead = async (req, res, next) => {
  try {
    await NotificationModel.markAllAsRead(req.user.id);
    return successResponse(res, null, 'All notifications marked as read.');
  } catch (err) {
    next(err);
  }
};

// PUT /api/notifications/:id/read
const markAsRead = async (req, res, next) => {
  try {
    const updated = await NotificationModel.markAsRead(req.params.id, req.user.id);
    if (!updated) return errorResponse(res, 'Notification not found.', 404);
    return successResponse(res, { notification: updated }, 'Marked as read.');
  } catch (err) {
    next(err);
  }
};

// DELETE /api/notifications/:id
const deleteNotification = async (req, res, next) => {
  try {
    const deleted = await NotificationModel.delete(req.params.id, req.user.id);
    if (!deleted) return errorResponse(res, 'Notification not found.', 404);
    return successResponse(res, null, 'Notification deleted.');
  } catch (err) {
    next(err);
  }
};

module.exports = { getNotifications, markAllAsRead, markAsRead, deleteNotification };
