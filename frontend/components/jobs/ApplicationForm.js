'use client';
import { useState } from 'react';
import { Send, User, Mail, Link, FileText, CheckCircle } from 'lucide-react';
import { submitApplication } from '@/lib/api';
import Button from '@/components/ui/Button';

export default function ApplicationForm({ jobId, jobTitle }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    resumeLink: '',
    coverNote: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.resumeLink.trim()) e.resumeLink = 'Resume link is required';
    else if (!/^https?:\/\/.+/.test(form.resumeLink)) e.resumeLink = 'Must be a valid URL (https://...)';
    if (!form.coverNote.trim()) e.coverNote = 'Cover note is required';
    else if (form.coverNote.trim().length < 10) e.coverNote = 'Cover note must be at least 10 characters';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
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
      await submitApplication({ jobId, ...form });
      setSubmitted(true);
    } catch (err) {
      setServerError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center animate-fade-up">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">Application Submitted!</h3>
        <p className="text-green-600 text-sm">
          Your application for <strong>{jobTitle}</strong> has been received. We'll be in touch
          soon. Good luck! 🎉
        </p>
      </div>
    );
  }

  const Field = ({ name, label, icon: Icon, type = 'text', placeholder, required, as }) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-3 text-slate-400">
          <Icon className="w-4 h-4" />
        </div>
        {as === 'textarea' ? (
          <textarea
            name={name}
            value={form[name]}
            onChange={handleChange}
            placeholder={placeholder}
            rows={5}
            className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border transition-colors outline-none resize-none ${
              errors[name]
                ? 'border-red-300 bg-red-50 focus:border-red-400'
                : 'border-slate-200 bg-slate-50 focus:border-indigo-400 focus:bg-white'
            }`}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={form[name]}
            onChange={handleChange}
            placeholder={placeholder}
            className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border transition-colors outline-none ${
              errors[name]
                ? 'border-red-300 bg-red-50 focus:border-red-400'
                : 'border-slate-200 bg-slate-50 focus:border-indigo-400 focus:bg-white'
            }`}
          />
        )}
      </div>
      {errors[name] && (
        <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'Syne, sans-serif' }}>
          Apply for this Position
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Fill in your details and we'll pass them to the hiring team.
        </p>
      </div>

      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field name="name" label="Full Name" icon={User} placeholder="Jane Doe" required />
        <Field name="email" label="Email Address" icon={Mail} type="email" placeholder="jane@example.com" required />
        <Field name="resumeLink" label="Resume / Portfolio URL" icon={Link} type="url" placeholder="https://linkedin.com/in/yourname" required />
        <Field name="coverNote" label="Cover Note" icon={FileText} placeholder="Tell us why you're a great fit for this role..." required as="textarea" />

        <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2">
          <Send className="w-4 h-4" />
          Submit Application
        </Button>
      </form>
    </div>
  );
}
