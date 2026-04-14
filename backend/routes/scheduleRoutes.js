const router = require('express').Router();
const { body, param } = require('express-validator');
const {
  getDailySchedule, getSchedulesByMedication, createSchedule, updateSchedule, deleteSchedule,
} = require('../controllers/scheduleController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

router.use(protect);

// GET /api/schedules/daily
router.get('/daily', getDailySchedule);

// GET /api/schedules/medication/:medicationId
router.get('/medication/:medicationId', [param('medicationId').isUUID()], validate, getSchedulesByMedication);

// POST /api/schedules
router.post(
  '/',
  [
    body('medication_id').isUUID().withMessage('Valid medication_id UUID is required.'),
    body('scheduled_time')
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .withMessage('scheduled_time must be in HH:MM format.'),
    body('reminder_enabled').optional().isBoolean(),
  ],
  validate,
  createSchedule
);

// PUT /api/schedules/:id
router.put(
  '/:id',
  [
    param('id').isUUID(),
    body('scheduled_time').optional().matches(/^([01]\d|2[0-3]):([0-5]\d)/),
    body('is_active').optional().isBoolean(),
    body('reminder_enabled').optional().isBoolean(),
  ],
  validate,
  updateSchedule
);

// DELETE /api/schedules/:id
router.delete('/:id', [param('id').isUUID()], validate, deleteSchedule);

module.exports = router;
