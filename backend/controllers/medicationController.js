const MedicationModel = require('../models/medicationModel');
const { successResponse, errorResponse } = require('../utils/helpers');

// GET /api/medications
const getAllMedications = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const result = await MedicationModel.findAllForUser(req.user.id, { page, limit });
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

// GET /api/medications/:id
const getMedicationById = async (req, res, next) => {
  try {
    const med = await MedicationModel.findById(req.params.id, req.user.id);
    if (!med) return errorResponse(res, 'Medication not found.', 404);
    return successResponse(res, { medication: med });
  } catch (err) {
    next(err);
  }
};

// POST /api/medications
const createMedication = async (req, res, next) => {
  try {
    const med = await MedicationModel.create({
      ...req.body,
      owner_user_id: req.user.id,
    });
    return successResponse(res, { medication: med }, 'Medication added successfully.', 201);
  } catch (err) {
    next(err);
  }
};

// PUT /api/medications/:id
const updateMedication = async (req, res, next) => {
  try {
    const updated = await MedicationModel.update(req.params.id, req.user.id, req.body);
    if (!updated) return errorResponse(res, 'Medication not found or nothing to update.', 404);
    return successResponse(res, { medication: updated }, 'Medication updated.');
  } catch (err) {
    next(err);
  }
};

// DELETE /api/medications/:id
const deleteMedication = async (req, res, next) => {
  try {
    const deleted = await MedicationModel.delete(req.params.id, req.user.id);
    if (!deleted) return errorResponse(res, 'Medication not found.', 404);
    return successResponse(res, null, 'Medication deleted.');
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllMedications, getMedicationById, createMedication, updateMedication, deleteMedication };
