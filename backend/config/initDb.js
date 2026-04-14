const { pool } = require('./db');
const logger = require('../utils/logger');

async function initializeDatabase() {
  const client = await pool.connect();
  try {
    logger.info('Running Azure-safe Database Initialization...');

    // 1. Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        avatar_url VARCHAR(1024),
        timezone VARCHAR(100) DEFAULT 'UTC',
        is_active BOOLEAN DEFAULT true,
        last_login_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Medications Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS medications (
        id UUID PRIMARY KEY,
        owner_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        dependent_id UUID,
        name VARCHAR(255) NOT NULL,
        brand_name VARCHAR(255),
        dosage_value DECIMAL(10,2) NOT NULL,
        unit VARCHAR(50) NOT NULL,
        frequency VARCHAR(100) NOT NULL,
        category VARCHAR(100),
        reason VARCHAR(255) NOT NULL,
        color_hex VARCHAR(7) DEFAULT '#00f5ff',
        instructions TEXT,
        side_effects TEXT[],
        prescribed_by VARCHAR(255),
        prescribed_date DATE,
        end_date DATE,
        is_ongoing BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Medication Schedules Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS medication_schedules (
        id UUID PRIMARY KEY,
        medication_id UUID REFERENCES medications(id) ON DELETE CASCADE,
        scheduled_time TIME NOT NULL,
        day_of_week INTEGER,
        is_active BOOLEAN DEFAULT true,
        reminder_enabled BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Adherence Logs Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS adherence_logs (
        id UUID PRIMARY KEY,
        medication_id UUID REFERENCES medications(id) ON DELETE CASCADE,
        schedule_id UUID REFERENCES medication_schedules(id) ON DELETE SET NULL,
        scheduled_for TIMESTAMP NOT NULL,
        status VARCHAR(20) NOT NULL,
        actual_time TIMESTAMP,
        recorded_by_user_id UUID REFERENCES users(id),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. Notifications Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'system',
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    logger.info('All tables validated successfully via Azure-safe schema.');
  } catch (err) {
    logger.error(`Database initialization failure: ${err.message}`);
  } finally {
    client.release();
  }
}

module.exports = { initializeDatabase };
