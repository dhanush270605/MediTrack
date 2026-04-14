const { Pool } = require('pg');
const logger = require('../utils/logger');

const pool = new Pool({
  host: "meditrack-db-123.postgres.database.azure.com",
  user: "postgresadmin@meditrack-db-123",
  password: "9786@Sridevi",
  database: "meditrack",
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('connect', () => {
  logger.info('PostgreSQL pool: new client connected');
});

pool.on('error', (err) => {
  logger.error(`PostgreSQL pool error: ${err.message}`);
  process.exit(1);
});

// Test connection on startup
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    logger.info(`Database connected successfully at ${result.rows[0].now}`);
    client.release();
  } catch (err) {
    logger.error(`Database connection failed: ${err.message}`);
    process.exit(1);
  }
};

module.exports = { pool, testConnection };
