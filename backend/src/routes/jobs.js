const express = require('express');
const router = express.Router();

const {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getFilters,
} = require('../controllers/jobController');

const { validateJob } = require('../middleware/validate');

// ─── Public Routes ─────────────────────────────────────────────────────────

// GET /api/jobs/filters  ← must be before /:id to avoid conflict
router.get('/filters', getFilters);

// GET /api/jobs?search=&category=&location=&type=&page=&limit=
router.get('/', getAllJobs);

// GET /api/jobs/:id
router.get('/:id', getJobById);

// ─── Admin Routes ──────────────────────────────────────────────────────────

// POST /api/jobs
router.post('/', validateJob, createJob);

// PUT /api/jobs/:id
router.put('/:id', validateJob, updateJob);

// DELETE /api/jobs/:id
router.delete('/:id', deleteJob);

module.exports = router;
