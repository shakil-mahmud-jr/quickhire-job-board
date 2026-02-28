const Job = require('../models/Job');
const Application = require('../models/Application');

// ─── Helper: build API response ────────────────────────────────────────────
const sendResponse = (res, statusCode, success, message, data = {}) => {
  res.status(statusCode).json({ success, message, ...data });
};

// ─── @desc    Get all jobs (with search, filter, pagination)
// ─── @route   GET /api/jobs
// ─── @access  Public
const getAllJobs = async (req, res, next) => {
  try {
    const {
      search = '',
      category = '',
      location = '',
      type = '',
      page = 1,
      limit = 10,
      sort = '-createdAt',
    } = req.query;

    // Build query object
    const query = { isActive: true };

    // Text search across title, company, description
    if (search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { company: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { location: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Filter by category
    if (category.trim()) {
      query.category = { $regex: category.trim(), $options: 'i' };
    }

    // Filter by location
    if (location.trim()) {
      query.location = { $regex: location.trim(), $options: 'i' };
    }

    // Filter by job type
    if (type.trim()) {
      query.type = { $regex: type.trim(), $options: 'i' };
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const [jobs, total] = await Promise.all([
      Job.find(query).sort(sort).skip(skip).limit(limitNum).lean(),
      Job.countDocuments(query),
    ]);

    sendResponse(res, 200, true, 'Jobs fetched successfully', {
      data: jobs,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Get single job by ID
// ─── @route   GET /api/jobs/:id
// ─── @access  Public
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).lean();

    if (!job) {
      return sendResponse(res, 404, false, 'Job not found');
    }

    // Also return number of applications for this job
    const applicationCount = await Application.countDocuments({ job: req.params.id });

    sendResponse(res, 200, true, 'Job fetched successfully', {
      data: { ...job, applicationCount },
    });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Create a new job
// ─── @route   POST /api/jobs
// ─── @access  Admin
const createJob = async (req, res, next) => {
  try {
    const {
      title,
      company,
      location,
      category,
      type,
      description,
      requirements,
      salary,
      companyLogo,
    } = req.body;

    const job = await Job.create({
      title,
      company,
      location,
      category,
      type,
      description,
      requirements,
      salary,
      companyLogo,
    });

    sendResponse(res, 201, true, 'Job created successfully', { data: job });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Update a job
// ─── @route   PUT /api/jobs/:id
// ─── @access  Admin
const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return sendResponse(res, 404, false, 'Job not found');
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    sendResponse(res, 200, true, 'Job updated successfully', { data: updatedJob });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Delete a job (and its applications)
// ─── @route   DELETE /api/jobs/:id
// ─── @access  Admin
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return sendResponse(res, 404, false, 'Job not found');
    }

    // Delete the job AND all its applications (cascade)
    await Promise.all([
      Job.findByIdAndDelete(req.params.id),
      Application.deleteMany({ job: req.params.id }),
    ]);

    sendResponse(res, 200, true, 'Job and related applications deleted successfully', {
      data: { deletedId: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Get distinct filter values (for dropdowns)
// ─── @route   GET /api/jobs/filters
// ─── @access  Public
const getFilters = async (req, res, next) => {
  try {
    const [categories, locations, types] = await Promise.all([
      Job.distinct('category', { isActive: true }),
      Job.distinct('location', { isActive: true }),
      Job.distinct('type', { isActive: true }),
    ]);

    sendResponse(res, 200, true, 'Filter options fetched successfully', {
      data: { categories, locations, types },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getFilters,
};
