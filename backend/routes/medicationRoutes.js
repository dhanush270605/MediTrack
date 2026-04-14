const router = require('express').Router();
const { body, param } = require('express-validator');
const {
  getAllMedications, getMedicationById, createMedication, updateMedication, deleteMedication,
} = require('../controllers/medicationController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

router.use(protect);

// GET /api/medications
router.get('/', getAllMedications);

// GET /api/medications/:id
router.get('/:id', [param('id').isUUID()], validate, getMedicationById);

// POST /api/medications
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Medication name is required.'),
    body('dosage_value').isFloat({ min: 0.01 }).withMessage('dosage_value must be a positive number.'),
    body('unit').isIn(['mg', 'ml', 'tablet', 'capsule', 'injection', 'drops', 'iu']).withMessage('Invalid unit.'),
    body('frequency').isIn(['daily', 'twice-daily', 'three-times-daily', 'weekly', 'monthly', 'as-needed']).withMessage('Invalid frequency.'),
    body('reason').trim().notEmpty().withMessage('Reason is required.'),
    body('prescribed_date').isISO8601().withMessage('prescribed_date must be a valid date (YYYY-MM-DD).'),
    body('end_date').optional({ nullable: true }).isISO8601(),
    body('color_hex').optional().matches(/^#[0-9A-Fa-f]{6}$/).withMessage('color_hex must be a valid hex color.'),
  ],
  validate,
  createMedication
);

// PUT /api/medications/:id
router.put(
  '/:id',
  [
    param('id').isUUID(),
    body('dosage_value').optional().isFloat({ min: 0.01 }),
    body('unit').optional().isIn(['mg', 'ml', 'tablet', 'capsule', 'injection', 'drops', 'iu']),
    body('frequency').optional().isIn(['daily', 'twice-daily', 'three-times-daily', 'weekly', 'monthly', 'as-needed']),
    body('color_hex').optional().matches(/^#[0-9A-Fa-f]{6}$/),
  ],
  validate,
  updateMedication
);

// DELETE /api/medications/:id
router.delete('/:id', [param('id').isUUID()], validate, deleteMedication);

module.exports = router;
