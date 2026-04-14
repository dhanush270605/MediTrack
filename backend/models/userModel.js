const { pool } = require('../config/db');
const { generateId } = require('../utils/helpers');

const UserModel = {
  // ─── Lookups ─────────────────────────────────────────────────────────────

  async findByEmail(email) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND is_active = true LIMIT 1',
      [email.toLowerCase().trim()]
    );
    return rows[0] || null;
  },

  async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE id = $1 AND is_active = true LIMIT 1',
      [id]
    );
    return rows[0] || null;
  },

  async findAll({ page = 1, limit = 20 } = {}) {
    const offset = (page - 1) * limit;
    const { rows } = await pool.query(
      `SELECT id, email, full_name, role, avatar_url, timezone, is_active, last_login_at, created_at, updated_at
       FROM users
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    const { rows: countRows } = await pool.query('SELECT COUNT(*) FROM users WHERE is_active = true');
    return { users: rows, total: parseInt(countRows[0].count, 10) };
  },

  // ─── Write ───────────────────────────────────────────────────────────────

  async create({ email, full_name, password_hash, role = 'user', timezone = 'UTC' }) {
    const id = generateId();
    const { rows } = await pool.query(
      `INSERT INTO users (id, email, full_name, password_hash, role, timezone)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, full_name, role, timezone, is_active, created_at`,
      [id, email.toLowerCase().trim(), full_name.trim(), password_hash, role, timezone]
    );
    return rows[0];
  },

  async update(id, fields) {
    const allowed = ['full_name', 'avatar_url', 'timezone'];
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
      `UPDATE users SET ${updates.join(', ')}, updated_at = NOW()
       WHERE id = $${values.length} AND is_active = true
       RETURNING id, email, full_name, role, avatar_url, timezone, updated_at`,
      values
    );
    return rows[0] || null;
  },

  async updateLastLogin(id) {
    await pool.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [id]);
  },

  async softDelete(id) {
    const { rowCount } = await pool.query(
      'UPDATE users SET is_active = false, updated_at = NOW() WHERE id = $1',
      [id]
    );
    return rowCount > 0;
  },
};

module.exports = UserModel;
