const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log("Database connected");
  } catch (err) {
    console.error("Database connection failed", err);
  }
};

module.exports = { pool, testConnection };
