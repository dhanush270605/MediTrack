const router = require('express').Router();
const { body, param } = require('express-validator');
const {
  getHistory, getStats, getByMedication, recordLog, updateLog, deleteLog,
} = require('../controllers/adherenceController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

router.use(protect);

// GET /api/adherence
router.get('/', getHistory);

// GET /api/adherence/stats
router.get('/stats', getStats);

// GET /api/adherence/medication/:medicationId
router.get('/medication/:medicationId', [param('medicationId').isUUID()], validate, getByMedication);

// POST /api/adherence
router.post(
  '/',
  [
    body('medication_id').isUUID().withMessage('Valid medication_id is required.'),
    body('scheduled_for').isISO8601().withMessage('scheduled_for must be a valid datetime.'),
    body('status').isIn(['taken', 'missed', 'skipped', 'late']).withMessage('status must be taken, missed, skipped, or late.'),
    body('actual_time').optional({ nullable: true }).isISO8601(),
    body('notes').optional().isString().isLength({ max: 500 }),
  ],
  validate,
  recordLog
);

// PUT /api/adherence/:id
router.put(
  '/:id',
  [
    param('id').isUUID(),
    body('status').optional().isIn(['taken', 'missed', 'skipped', 'late']),
    body('notes').optional().isString().isLength({ max: 500 }),
  ],
  validate,
  updateLog
);

// DELETE /api/adherence/:id
router.delete('/:id', [param('id').isUUID()], validate, deleteLog);

module.exports = router;
