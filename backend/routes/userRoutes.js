const router = require('express').Router();
const { param, body } = require('express-validator');
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

router.use(protect); // All user routes require auth

// GET /api/users  (admin only)
router.get('/', authorize('administrator'), getAllUsers);

// GET /api/users/:id
router.get(
  '/:id',
  [param('id').isUUID().withMessage('Invalid user ID.')],
  validate,
  getUserById
);

// PUT /api/users/:id
router.put(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid user ID.'),
    body('full_name').optional().trim().isLength({ min: 2, max: 100 }),
    body('timezone').optional().isString(),
    body('avatar_url').optional().isURL().withMessage('avatar_url must be a valid URL.'),
  ],
  validate,
  updateUser
);

// DELETE /api/users/:id
router.delete(
  '/:id',
  [param('id').isUUID().withMessage('Invalid user ID.')],
  validate,
  deleteUser
);

module.exports = router;
