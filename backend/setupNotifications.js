require('dotenv').config();
const { Client } = require('pg');

const config = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'meditrack'
};

async function createNotificationTable() {
  const client = new Client(config);
  try {
    await client.connect();
    console.log('Connected to meditrack. Creating notifications table...');

    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'system',
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Let's insert a welcome notification for all existing users so there is something to show!
    await client.query(`
      INSERT INTO notifications (user_id, title, message, type)
      SELECT id, 'Welcome to MediTrack Core', 'Your real-time notification system is now securely active via PostgreSQL.', 'system'
      FROM users
      WHERE NOT EXISTS (
          SELECT 1 FROM notifications WHERE user_id = users.id AND title = 'Welcome to MediTrack Core'
      );
    `);

    console.log('Table created successfully!');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

createNotificationTable();
