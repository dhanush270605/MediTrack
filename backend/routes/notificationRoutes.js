const router = require('express').Router();
const { param } = require('express-validator');
const { getNotifications, markAllAsRead, markAsRead, deleteNotification } = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

router.use(protect);

router.get('/', getNotifications);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', [param('id').isUUID()], validate, markAsRead);
router.delete('/:id', [param('id').isUUID()], validate, deleteNotification);

module.exports = router;
