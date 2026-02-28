const Application = require('../models/Application');
const Job = require('../models/Job');

// ─── Helper: build API response ────────────────────────────────────────────
const sendResponse = (res, statusCode, success, message, data = {}) => {
  res.status(statusCode).json({ success, message, ...data });
};

// ─── @desc    Submit a job application
// ─── @route   POST /api/applications
// ─── @access  Public
const submitApplication = async (req, res, next) => {
  try {
    const { jobId, name, email, resumeLink, coverNote } = req.body;

    // Check job exists and is active
    const job = await Job.findById(jobId);
    if (!job) {
      return sendResponse(res, 404, false, 'Job not found');
    }
    if (!job.isActive) {
      return sendResponse(res, 400, false, 'This job listing is no longer active');
    }

    // Check for duplicate application
    const existingApplication = await Application.findOne({ job: jobId, email });
    if (existingApplication) {
      return sendResponse(
        res,
        409,
        false,
        'You have already applied to this job with this email address'
      );
    }

    const application = await Application.create({
      job: jobId,
      name,
      email,
      resumeLink,
      coverNote,
    });

    // Populate job info in response
    await application.populate('job', 'title company location');

    sendResponse(res, 201, true, 'Application submitted successfully!', {
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Get all applications (Admin)
// ─── @route   GET /api/applications
// ─── @access  Admin
const getAllApplications = async (req, res, next) => {
  try {
    const { jobId, status, page = 1, limit = 20 } = req.query;

    const query = {};
    if (jobId) query.job = jobId;
    if (status) query.status = status;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [applications, total] = await Promise.all([
      Application.find(query)
        .populate('job', 'title company location category')
        .sort('-createdAt')
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Application.countDocuments(query),
    ]);

    sendResponse(res, 200, true, 'Applications fetched successfully', {
      data: applications,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Get applications for a specific job (Admin)
// ─── @route   GET /api/applications/job/:jobId
// ─── @access  Admin
const getApplicationsByJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return sendResponse(res, 404, false, 'Job not found');
    }

    const applications = await Application.find({ job: jobId })
      .sort('-createdAt')
      .lean();

    sendResponse(res, 200, true, 'Applications fetched successfully', {
      data: applications,
      total: applications.length,
      job: { title: job.title, company: job.company },
    });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Get single application by ID (Admin)
// ─── @route   GET /api/applications/:id
// ─── @access  Admin
const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job', 'title company location category type')
      .lean();

    if (!application) {
      return sendResponse(res, 404, false, 'Application not found');
    }

    sendResponse(res, 200, true, 'Application fetched successfully', {
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Update application status (Admin)
// ─── @route   PATCH /api/applications/:id/status
// ─── @access  Admin
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Reviewed', 'Shortlisted', 'Rejected'];

    if (!status || !validStatuses.includes(status)) {
      return sendResponse(
        res,
        400,
        false,
        `Status must be one of: ${validStatuses.join(', ')}`
      );
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('job', 'title company');

    if (!application) {
      return sendResponse(res, 404, false, 'Application not found');
    }

    sendResponse(res, 200, true, 'Application status updated', { data: application });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Delete an application (Admin)
// ─── @route   DELETE /api/applications/:id
// ─── @access  Admin
const deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return sendResponse(res, 404, false, 'Application not found');
    }

    await Application.findByIdAndDelete(req.params.id);

    sendResponse(res, 200, true, 'Application deleted successfully', {
      data: { deletedId: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitApplication,
  getAllApplications,
  getApplicationsByJob,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
};
