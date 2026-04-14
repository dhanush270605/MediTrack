const { pool } = require('../config/db');
const { generateId } = require('../utils/helpers');

const MedicationModel = {

  async findAllForUser(ownerUserId, { page = 1, limit = 50 } = {}) {
    const offset = (page - 1) * limit;
    const { rows } = await pool.query(
      `SELECT * FROM medications
       WHERE owner_user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [ownerUserId, limit, offset]
    );
    const { rows: countRows } = await pool.query(
      'SELECT COUNT(*) FROM medications WHERE owner_user_id = $1',
      [ownerUserId]
    );
    return { medications: rows, total: parseInt(countRows[0].count, 10) };
  },

  async findAllForDependent(dependentId) {
    const { rows } = await pool.query(
      'SELECT * FROM medications WHERE dependent_id = $1 ORDER BY created_at DESC',
      [dependentId]
    );
    return rows;
  },

  async findById(id, ownerUserId) {
    const { rows } = await pool.query(
      'SELECT * FROM medications WHERE id = $1 AND owner_user_id = $2 LIMIT 1',
      [id, ownerUserId]
    );
    return rows[0] || null;
  },

  async create({
    owner_user_id,
    dependent_id = null,
    name,
    brand_name = null,
    dosage_value,
    unit,
    frequency,
    category = null,
    reason,
    color_hex = '#00f5ff',
    instructions = null,
    side_effects = [],
    prescribed_by = null,
    prescribed_date,
    end_date = null,
    is_ongoing = true,
  }) {
    const id = generateId();
    const { rows } = await pool.query(
      `INSERT INTO medications (
         id, owner_user_id, dependent_id, name, brand_name, dosage_value, unit,
         frequency, category, reason, color_hex, instructions, side_effects,
         prescribed_by, prescribed_date, end_date, is_ongoing
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
       RETURNING *`,
      [
        id, owner_user_id, dependent_id, name, brand_name, dosage_value, unit,
        frequency, category, reason, color_hex, instructions, side_effects,
        prescribed_by, prescribed_date, end_date, is_ongoing,
      ]
    );
    return rows[0];
  },

  async update(id, ownerUserId, fields) {
    const allowed = [
      'name', 'brand_name', 'dosage_value', 'unit', 'frequency', 'category',
      'reason', 'color_hex', 'instructions', 'side_effects', 'is_ongoing',
      'prescribed_by', 'end_date',
    ];
    const updates = [];
    const values = [];

    Object.entries(fields).forEach(([key, val]) => {
      if (allowed.includes(key) && val !== undefined) {
        updates.push(`${key} = $${updates.length + 1}`);
        values.push(val);
      }
    });

    if (!updates.length) return null;

    values.push(id, ownerUserId);
    const { rows } = await pool.query(
      `UPDATE medications SET ${updates.join(', ')}
       WHERE id = $${values.length - 1} AND owner_user_id = $${values.length}
       RETURNING *`,
      values
    );
    return rows[0] || null;
  },

  async delete(id, ownerUserId) {
    const { rowCount } = await pool.query(
      'DELETE FROM medications WHERE id = $1 AND owner_user_id = $2',
      [id, ownerUserId]
    );
    return rowCount > 0;
  },
};

module.exports = MedicationModel;
