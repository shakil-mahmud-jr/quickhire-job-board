const { body, validationResult } = require('express-validator');

// ─── Reusable error handler ────────────────────────────────────────────────
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// ─── Job Validators ────────────────────────────────────────────────────────
const validateJob = [
  body('title')
    .trim()
    .notEmpty().withMessage('Job title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),

  body('company')
    .trim()
    .notEmpty().withMessage('Company name is required')
    .isLength({ max: 100 }).withMessage('Company name cannot exceed 100 characters'),

  body('location')
    .trim()
    .notEmpty().withMessage('Location is required'),

  body('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .isIn([
      'Engineering', 'Design', 'Marketing', 'Sales', 'Finance',
      'Human Resources', 'Product', 'Operations', 'Customer Support',
      'Legal', 'Data', 'Other',
    ]).withMessage('Invalid category selected'),

  body('type')
    .trim()
    .notEmpty().withMessage('Job type is required')
    .isIn(['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', 'Remote'])
    .withMessage('Invalid job type selected'),

  body('description')
    .trim()
    .notEmpty().withMessage('Job description is required')
    .isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),

  body('requirements')
    .optional()
    .trim(),

  body('salary.min')
    .optional({ nullable: true })
    .isNumeric().withMessage('Minimum salary must be a number'),

  body('salary.max')
    .optional({ nullable: true })
    .isNumeric().withMessage('Maximum salary must be a number'),

  body('companyLogo')
    .optional({ nullable: true })
    .trim()
    .isURL().withMessage('Company logo must be a valid URL'),

  handleValidationErrors,
];

// ─── Application Validators ────────────────────────────────────────────────
const validateApplication = [
  body('name')
    .trim()
    .notEmpty().withMessage('Your name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email address is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('resumeLink')
    .trim()
    .notEmpty().withMessage('Resume link is required')
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Resume link must be a valid URL (must start with http:// or https://)'),

  body('coverNote')
    .trim()
    .notEmpty().withMessage('Cover note is required')
    .isLength({ min: 10 }).withMessage('Cover note must be at least 10 characters')
    .isLength({ max: 2000 }).withMessage('Cover note cannot exceed 2000 characters'),

  handleValidationErrors,
];

module.exports = { validateJob, validateApplication };
