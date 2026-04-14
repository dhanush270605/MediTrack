require('dotenv').config();
const { Client } = require('pg');

const config = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

async function setup() {
  console.log('Starting DB Setup...');
  
  // Connect to default 'postgres' database first to create the target db
  let client = new Client({ ...config, database: 'postgres' });
  try {
    await client.connect();
    const res = await client.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = 'meditrack'`);
    if (res.rowCount === 0) {
      console.log('Creating meditrack database...');
      await client.query(`CREATE DATABASE meditrack`);
    } else {
      console.log('Database meditrack already exists.');
    }
  } catch (err) {
    console.error('Error creating database:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }

  // Now connect to the newly created database and run schema queries
  client = new Client({ ...config, database: 'meditrack' });
  try {
    await client.connect();
    console.log('Connected to meditrack database. Creating tables...');

    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    // Tables schema
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'patient',
        avatar_url VARCHAR(1024),
        timezone VARCHAR(100) DEFAULT 'UTC',
        is_active BOOLEAN DEFAULT true,
        last_login_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS medications (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

    await client.query(`
      CREATE TABLE IF NOT EXISTS medication_schedules (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        medication_id UUID REFERENCES medications(id) ON DELETE CASCADE,
        scheduled_time TIME NOT NULL,
        day_of_week INTEGER,
        is_active BOOLEAN DEFAULT true,
        reminder_enabled BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS adherence_logs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

    console.log('Tables created successfully!');
  } catch (err) {
    console.error('Error creating tables:', err.message);
  } finally {
    await client.end();
  }
}

setup();
