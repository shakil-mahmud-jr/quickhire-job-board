const express = require('express');
const router = express.Router();

const {
  submitApplication,
  getAllApplications,
  getApplicationsByJob,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
} = require('../controllers/applicationController');

const { validateApplication } = require('../middleware/validate');

// ─── Public Routes ─────────────────────────────────────────────────────────

// POST /api/applications
router.post('/', validateApplication, submitApplication);

// ─── Admin Routes ──────────────────────────────────────────────────────────

// GET /api/applications?jobId=&status=&page=&limit=
router.get('/', getAllApplications);

// GET /api/applications/job/:jobId
router.get('/job/:jobId', getApplicationsByJob);

// GET /api/applications/:id
router.get('/:id', getApplicationById);

// PATCH /api/applications/:id/status
router.patch('/:id/status', updateApplicationStatus);

// DELETE /api/applications/:id
router.delete('/:id', deleteApplication);

module.exports = router;
