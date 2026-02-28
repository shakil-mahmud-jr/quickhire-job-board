'use client';
import { useState } from 'react';
import { createJob } from '@/lib/api';
import { CATEGORIES, JOB_TYPES } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { Briefcase, Building, MapPin, Tag, Clock, FileText, DollarSign, Image, CheckCircle } from 'lucide-react';

const initialForm = {
  title: '',
  company: '',
  location: '',
  category: '',
  type: 'Full-time',
  description: '',
  requirements: '',
  companyLogo: '',
  salaryMin: '',
  salaryMax: '',
};

export default function AdminJobForm({ onJobCreated }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Job title is required';
    if (!form.company.trim()) e.company = 'Company name is required';
    if (!form.location.trim()) e.location = 'Location is required';
    if (!form.category) e.category = 'Category is required';
    if (!form.type) e.type = 'Job type is required';
    if (!form.description.trim()) e.description = 'Description is required';
    else if (form.description.trim().length < 20) e.description = 'Description must be at least 20 characters';
    if (form.companyLogo && !/^https?:\/\/.+/.test(form.companyLogo)) {
      e.companyLogo = 'Must be a valid URL';
    }
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    setLoading(true);
    setServerError('');
    try {
      const payload = {
        title: form.title,
        company: form.company,
        location: form.location,
        category: form.category,
        type: form.type,
        description: form.description,
        requirements: form.requirements,
        companyLogo: form.companyLogo || undefined,
        salary: form.salaryMin || form.salaryMax
          ? { min: Number(form.salaryMin) || null, max: Number(form.salaryMax) || null, currency: 'USD' }
          : undefined,
      };
      const data = await createJob(payload);
      setSuccess(true);
      setForm(initialForm);
      onJobCreated?.(data.data);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      if (err.errors) {
        const fieldErrors = {};
        err.errors.forEach((e) => { fieldErrors[e.field] = e.message; });
        setErrors(fieldErrors);
      } else {
        setServerError(err.message || 'Failed to create job. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ name, label, icon: Icon, type = 'text', placeholder, required, hint }) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
        {hint && <span className="text-slate-400 font-normal ml-1">({hint})</span>}
      </label>
      <div className="relative">
        {Icon && <div className="absolute left-3 top-3 text-slate-400"><Icon className="w-4 h-4" /></div>}
        <input
          type={type}
          name={name}
          value={form[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full ${Icon ? 'pl-10' : 'pl-3'} pr-4 py-2.5 text-sm rounded-xl border transition-colors outline-none ${
            errors[name] ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50 focus:border-indigo-400 focus:bg-white'
          }`}
        />
      </div>
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'Syne, sans-serif' }}>
          Post a New Job
        </h2>
        <p className="text-slate-500 text-sm mt-1">Fill in the details to publish a new job listing.</p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-5 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-green-700 text-sm font-medium">Job listing created successfully!</p>
        </div>
      )}

      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField name="title" label="Job Title" icon={Briefcase} placeholder="e.g. Senior React Developer" required />
          <InputField name="company" label="Company Name" icon={Building} placeholder="e.g. Acme Corp" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField name="location" label="Location" icon={MapPin} placeholder="e.g. New York, NY or Remote" required />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border appearance-none cursor-pointer outline-none transition-colors ${
                  errors.category ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50 focus:border-indigo-400 focus:bg-white'
                }`}
              >
                <option value="">Select category...</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Job Type <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 appearance-none cursor-pointer outline-none focus:border-indigo-400 focus:bg-white transition-colors"
              >
                {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Min Salary <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="number"
                name="salaryMin"
                value={form.salaryMin}
                onChange={handleChange}
                placeholder="e.g. 80000"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-indigo-400 focus:bg-white transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Max Salary <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="number"
                name="salaryMax"
                value={form.salaryMax}
                onChange={handleChange}
                placeholder="e.g. 120000"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-indigo-400 focus:bg-white transition-colors"
              />
            </div>
          </div>
        </div>

        <InputField
          name="companyLogo"
          label="Company Logo URL"
          icon={Image}
          type="url"
          placeholder="https://example.com/logo.png"
          hint="optional"
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Job Description <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={6}
              placeholder="Describe the role, responsibilities, and what makes this position exciting..."
              className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border transition-colors outline-none resize-none ${
                errors.description ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50 focus:border-indigo-400 focus:bg-white'
              }`}
            />
          </div>
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Requirements <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <textarea
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
            rows={4}
            placeholder="• 3+ years of React experience&#10;• TypeScript proficiency&#10;• Strong communication skills"
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-indigo-400 focus:bg-white transition-colors resize-none"
          />
        </div>

        <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
          <Briefcase className="w-4 h-4" />
          Publish Job Listing
        </Button>
      </form>
    </div>
  );
}
