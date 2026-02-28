const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Engineering',
        'Design',
        'Marketing',
        'Sales',
        'Finance',
        'Human Resources',
        'Product',
        'Operations',
        'Customer Support',
        'Legal',
        'Data',
        'Other',
      ],
    },
    type: {
      type: String,
      required: [true, 'Job type is required'],
      enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', 'Remote'],
      default: 'Full-time',
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      minlength: [20, 'Description must be at least 20 characters'],
    },
    requirements: {
      type: String,
      trim: true,
    },
    salary: {
      min: { type: Number, default: null },
      max: { type: Number, default: null },
      currency: { type: String, default: 'USD' },
    },
    companyLogo: {
      type: String,
      trim: true,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for text search
jobSchema.index({ title: 'text', company: 'text', description: 'text' });

// Index for filter queries
jobSchema.index({ category: 1, location: 1, type: 1 });

module.exports = mongoose.model('Job', jobSchema);
