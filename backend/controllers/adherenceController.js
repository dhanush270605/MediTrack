const AdherenceModel = require('../models/adherenceModel');
const MedicationModel = require('../models/medicationModel');
const { successResponse, errorResponse } = require('../utils/helpers');

// GET /api/adherence  — full history for this user
const getHistory = async (req, res, next) => {
  try {
    const { startDate, endDate, page, limit } = req.query;
    const logs = await AdherenceModel.findByUser(req.user.id, { startDate, endDate, page, limit });
    return successResponse(res, { logs });
  } catch (err) {
    next(err);
  }
};

// GET /api/adherence/stats  — adherence % per medication
const getStats = async (req, res, next) => {
  try {
    const stats = await AdherenceModel.getStatsForUser(req.user.id);
    return successResponse(res, { stats });
  } catch (err) {
    next(err);
  }
};

// GET /api/adherence/medication/:medicationId
const getByMedication = async (req, res, next) => {
  try {
    const med = await MedicationModel.findById(req.params.medicationId, req.user.id);
    if (!med) return errorResponse(res, 'Medication not found.', 404);

    const { startDate, endDate } = req.query;
    const logs = await AdherenceModel.findByMedication(req.params.medicationId, { startDate, endDate });
    return successResponse(res, { logs });
  } catch (err) {
    next(err);
  }
};

// POST /api/adherence  — record taken / missed / skipped
const recordLog = async (req, res, next) => {
  try {
    const { medication_id, schedule_id, scheduled_for, status, actual_time, notes } = req.body;

    // Verify ownership
    const med = await MedicationModel.findById(medication_id, req.user.id);
    if (!med) return errorResponse(res, 'Medication not found or access denied.', 404);

    const log = await AdherenceModel.create({
      medication_id,
      schedule_id: schedule_id || null,
      scheduled_for,
      status,
      actual_time: actual_time || (status === 'taken' ? new Date().toISOString() : null),
      recorded_by_user_id: req.user.id,
      notes: notes || null,
    });

    return successResponse(res, { log }, `Dose recorded as "${status}".`, 201);
  } catch (err) {
    next(err);
  }
};

// PUT /api/adherence/:id
const updateLog = async (req, res, next) => {
  try {
    const existing = await AdherenceModel.findById(req.params.id);
    if (!existing) return errorResponse(res, 'Adherence log not found.', 404);

    // Verify ownership
    const med = await MedicationModel.findById(existing.medication_id, req.user.id);
    if (!med) return errorResponse(res, 'Access denied.', 403);

    const updated = await AdherenceModel.update(req.params.id, req.body);
    return successResponse(res, { log: updated }, 'Log updated.');
  } catch (err) {
    next(err);
  }
};

// DELETE /api/adherence/:id
const deleteLog = async (req, res, next) => {
  try {
    const existing = await AdherenceModel.findById(req.params.id);
    if (!existing) return errorResponse(res, 'Adherence log not found.', 404);

    const med = await MedicationModel.findById(existing.medication_id, req.user.id);
    if (!med) return errorResponse(res, 'Access denied.', 403);

    await AdherenceModel.delete(req.params.id);
    return successResponse(res, null, 'Log deleted.');
  } catch (err) {
    next(err);
  }
};

module.exports = { getHistory, getStats, getByMedication, recordLog, updateLog, deleteLog };
