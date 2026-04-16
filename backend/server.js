require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const { pool, testConnection } = require('./config/db');
const { initializeDatabase } = require('./config/initDb');

// ── Route modules ──────────────────────────────────────────────────────────
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const medicationRoutes = require('./routes/medicationRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const adherenceRoutes = require('./routes/adherenceRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "*"
}));
app.use(express.json());

// ── MANDATORY AZURE TEST ROUTES ────────────────────────────────────────────
app.get('/api', (req, res) => {
  res.status(200).json({ success: true, message: 'MediTrack API is working' });
});

app.get('/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.status(200).json({ success: true, time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Application Routes ─────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/adherence', adherenceRoutes);
app.use('/api/notifications', notificationRoutes);

// ── Global Error Handler ───────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Internal Server Error:", err);
  res.status(500).json({ success: false, error: "Internal Server Error" });
});

// ── Startup ────────────────────────────────────────────────────────────────
// Azure Requirement: Listen immediately to avoid port-binding timeouts
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
  
  // Non-blocking initialization
  testConnection();
  initializeDatabase();
});

process.on('unhandledRejection', (reason) => {
  console.error(`Unhandled Promise Rejection: ${reason}`);
});

process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});
