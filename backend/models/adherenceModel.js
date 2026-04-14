const { pool } = require('../config/db');
const { generateId } = require('../utils/helpers');

const AdherenceModel = {

  async findByMedication(medicationId, { startDate, endDate } = {}) {
    let query = `SELECT al.*, m.name AS medication_name
                 FROM adherence_logs al
                 JOIN medications m ON al.medication_id = m.id
                 WHERE al.medication_id = $1`;
    const values = [medicationId];

    if (startDate) {
      values.push(startDate);
      query += ` AND al.scheduled_for >= $${values.length}`;
    }
    if (endDate) {
      values.push(endDate);
      query += ` AND al.scheduled_for <= $${values.length}`;
    }
    query += ' ORDER BY al.scheduled_for DESC';

    const { rows } = await pool.query(query, values);
    return rows;
  },

  async findByUser(ownerUserId, { startDate, endDate, page = 1, limit = 50 } = {}) {
    const offset = (page - 1) * limit;
    let query = `
      SELECT al.*, m.name AS medication_name, m.color_hex
      FROM adherence_logs al
      JOIN medications m ON al.medication_id = m.id
      WHERE m.owner_user_id = $1`;
    const values = [ownerUserId];

    if (startDate) {
      values.push(startDate);
      query += ` AND al.scheduled_for >= $${values.length}`;
    }
    if (endDate) {
      values.push(endDate);
      query += ` AND al.scheduled_for <= $${values.length}`;
    }
    query += ` ORDER BY al.scheduled_for DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(limit, offset);

    const { rows } = await pool.query(query, values);
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM adherence_logs WHERE id = $1 LIMIT 1',
      [id]
    );
    return rows[0] || null;
  },

  async create({ medication_id, schedule_id = null, scheduled_for, status, actual_time = null, recorded_by_user_id, notes = null }) {
    const id = generateId();
    const { rows } = await pool.query(
      `INSERT INTO adherence_logs (id, medication_id, schedule_id, scheduled_for, status, actual_time, recorded_by_user_id, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [id, medication_id, schedule_id, scheduled_for, status, actual_time, recorded_by_user_id, notes]
    );
    return rows[0];
  },

  async update(id, fields) {
    const allowed = ['status', 'actual_time', 'notes'];
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
      `UPDATE adherence_logs SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`,
      values
    );
    return rows[0] || null;
  },

  async delete(id) {
    const { rowCount } = await pool.query('DELETE FROM adherence_logs WHERE id = $1', [id]);
    return rowCount > 0;
  },

  /**
   * Aggregated adherence stats per medication for a given user
   */
  async getStatsForUser(ownerUserId) {
    const { rows } = await pool.query(
      `SELECT
         m.id AS medication_id,
         m.name AS medication_name,
         COUNT(*) FILTER (WHERE al.status = 'taken') AS total_taken,
         COUNT(*) AS total_scheduled,
         ROUND(
           100.0 * COUNT(*) FILTER (WHERE al.status = 'taken') / NULLIF(COUNT(*), 0), 1
         ) AS adherence_rate,
         MAX(al.actual_time) FILTER (WHERE al.status = 'taken') AS last_taken
       FROM medications m
       LEFT JOIN adherence_logs al ON al.medication_id = m.id
       WHERE m.owner_user_id = $1
       GROUP BY m.id, m.name
       ORDER BY m.name`,
      [ownerUserId]
    );
    return rows;
  },
};

module.exports = AdherenceModel;
