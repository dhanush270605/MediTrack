const ScheduleModel = require('../models/scheduleModel');
const MedicationModel = require('../models/medicationModel');
const { successResponse, errorResponse } = require('../utils/helpers');

// GET /api/schedules/daily
const getDailySchedule = async (req, res, next) => {
  try {
    const schedules = await ScheduleModel.findDailyForUser(req.user.id);
    return successResponse(res, { schedules });
  } catch (err) {
    next(err);
  }
};

// GET /api/schedules/medication/:medicationId
const getSchedulesByMedication = async (req, res, next) => {
  try {
    // Verify ownership
    const med = await MedicationModel.findById(req.params.medicationId, req.user.id);
    if (!med) return errorResponse(res, 'Medication not found.', 404);

    const schedules = await ScheduleModel.findByMedication(req.params.medicationId);
    return successResponse(res, { schedules });
  } catch (err) {
    next(err);
  }
};

// POST /api/schedules
const createSchedule = async (req, res, next) => {
  try {
    const { medication_id, scheduled_time, day_of_week, reminder_enabled } = req.body;

    // Verify the medication belongs to this user
    const med = await MedicationModel.findById(medication_id, req.user.id);
    if (!med) return errorResponse(res, 'Medication not found or access denied.', 404);

    const schedule = await ScheduleModel.create({ medication_id, scheduled_time, day_of_week, reminder_enabled });
    return successResponse(res, { schedule }, 'Schedule created.', 201);
  } catch (err) {
    next(err);
  }
};

// PUT /api/schedules/:id
const updateSchedule = async (req, res, next) => {
  try {
    const existing = await ScheduleModel.findById(req.params.id);
    if (!existing) return errorResponse(res, 'Schedule not found.', 404);

    // Verify ownership via medication
    const med = await MedicationModel.findById(existing.medication_id, req.user.id);
    if (!med) return errorResponse(res, 'Access denied.', 403);

    const updated = await ScheduleModel.update(req.params.id, req.body);
    return successResponse(res, { schedule: updated }, 'Schedule updated.');
  } catch (err) {
    next(err);
  }
};

// DELETE /api/schedules/:id
const deleteSchedule = async (req, res, next) => {
  try {
    const existing = await ScheduleModel.findById(req.params.id);
    if (!existing) return errorResponse(res, 'Schedule not found.', 404);

    const med = await MedicationModel.findById(existing.medication_id, req.user.id);
    if (!med) return errorResponse(res, 'Access denied.', 403);

    await ScheduleModel.delete(req.params.id);
    return successResponse(res, null, 'Schedule deleted.');
  } catch (err) {
    next(err);
  }
};

module.exports = { getDailySchedule, getSchedulesByMedication, createSchedule, updateSchedule, deleteSchedule };
