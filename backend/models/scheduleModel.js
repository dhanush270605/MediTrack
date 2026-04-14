const { pool } = require('../config/db');
const { generateId } = require('../utils/helpers');

const ScheduleModel = {

  async findByMedication(medicationId) {
    const { rows } = await pool.query(
      'SELECT * FROM medication_schedules WHERE medication_id = $1 ORDER BY scheduled_time ASC',
      [medicationId]
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM medication_schedules WHERE id = $1 LIMIT 1',
      [id]
    );
    return rows[0] || null;
  },

  /**
   * Get all schedules for a user's medications (for the daily view)
   */
  async findDailyForUser(ownerUserId) {
    const { rows } = await pool.query(
      `SELECT ms.*, m.name AS medication_name, m.dosage_value, m.unit, m.color_hex
       FROM medication_schedules ms
       JOIN medications m ON ms.medication_id = m.id
       WHERE m.owner_user_id = $1 AND ms.is_active = true
       ORDER BY ms.scheduled_time ASC`,
      [ownerUserId]
    );
    return rows;
  },

  async create({ medication_id, scheduled_time, day_of_week = null, reminder_enabled = true }) {
    const id = generateId();
    const { rows } = await pool.query(
      `INSERT INTO medication_schedules (id, medication_id, scheduled_time, day_of_week, reminder_enabled)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id, medication_id, scheduled_time, day_of_week, reminder_enabled]
    );
    return rows[0];
  },

  async update(id, fields) {
    const allowed = ['scheduled_time', 'day_of_week', 'is_active', 'reminder_enabled'];
    const updates = [];
    const values = [];

    Object.entries(fields).forEach(([key, val]) => {
      if (allowed.includes(key) && val !== undefined) {
        updates.push(`${key} = $${updates.length + 1}`);
        values.push(val);
      }
    });

    if (!updates.length) return null;

    values.push(id);
    const { rows } = await pool.query(
      `UPDATE medication_schedules SET ${updates.join(', ')}
       WHERE id = $${values.length}
       RETURNING *`,
      values
    );
    return rows[0] || null;
  },

  async delete(id) {
    const { rowCount } = await pool.query(
      'DELETE FROM medication_schedules WHERE id = $1',
      [id]
    );
    return rowCount > 0;
  },

  async deleteByMedication(medicationId) {
    await pool.query('DELETE FROM medication_schedules WHERE medication_id = $1', [medicationId]);
  },
};

module.exports = ScheduleModel;
