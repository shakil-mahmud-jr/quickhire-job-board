require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// ─── Connect to MongoDB ────────────────────────────────────────────────────
connectDB();

const app = express();

// ─── CORS Configuration ────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'http://localhost:3001',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, mobile apps, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// ─── Body Parsing ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ──────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 QuickHire API is running',
    version: '1.0.0',
    endpoints: {
      jobs: '/api/jobs',
      jobFilters: '/api/jobs/filters',
      applications: '/api/applications',
    },
    docs: 'See README.md for full API documentation',
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    environment: process.env.NODE_ENV || 'development',
  });
});

// ─── API Routes ────────────────────────────────────────────────────────────
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// ─── Error Handlers ────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('');
  console.log('─────────────────────────────────────────────');
  console.log(`🚀  QuickHire API Server`);
  console.log('─────────────────────────────────────────────');
  console.log(`📡  Port     : ${PORT}`);
  console.log(`🌍  Env      : ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗  Base URL : http://localhost:${PORT}`);
  console.log(`📋  Jobs API : http://localhost:${PORT}/api/jobs`);
  console.log(`📝  Apps API : http://localhost:${PORT}/api/applications`);
  console.log('─────────────────────────────────────────────');
  console.log('');
});

module.exports = app;
