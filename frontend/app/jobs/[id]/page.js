'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  MapPin, Clock, DollarSign, Briefcase, ArrowLeft,
  Building, Calendar, Users, Share2, BookmarkPlus, ChevronRight
} from 'lucide-react';
import { getJob, getJobs } from '@/lib/api';
import { timeAgo, formatSalary, JOB_TYPE_COLORS, CATEGORY_ICONS } from '@/lib/utils';
import ApplicationForm from '@/components/jobs/ApplicationForm';
import JobCard from '@/components/jobs/JobCard';
import Badge from '@/components/ui/Badge';
import { JobDetailSkeleton } from '@/components/ui/Skeleton';

export default function JobDetailPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    getJob(id)
      .then(async (data) => {
        setJob(data.data);
        // Fetch related jobs by category
        try {
          const related = await getJobs({ category: data.data.category, limit: 3 });
          setRelatedJobs((related.data || []).filter((j) => j._id !== id));
        } catch {}
      })
      .catch((err) => setError(err.message || 'Job not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <JobDetailSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 flex items-center justify-center">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Job Not Found</h2>
          <p className="text-slate-500 mb-6">{error || 'This job listing may have been removed.'}</p>
          <Link
            href="/jobs"
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            Browse All Jobs
          </Link>
        </div>
      </div>
    );
  }

  const salary = formatSalary(job.salary);

  // Format description with newlines into paragraphs
  const formatDescription = (text) => {
    if (!text) return null;
    return text.split('\n\n').map((para, i) => {
      const lines = para.split('\n');
      if (lines.every((l) => l.trim().startsWith('•') || l.trim().startsWith('-'))) {
        return (
          <ul key={i} className="list-disc pl-5 space-y-1.5 mb-4 text-slate-600 text-sm leading-relaxed">
            {lines.map((l, j) => (
              <li key={j}>{l.replace(/^[•\-]\s*/, '')}</li>
            ))}
          </ul>
        );
      }
      return (
        <p key={i} className="text-slate-600 text-sm leading-relaxed mb-4 last:mb-0">
          {para}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-slate-700 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/jobs" className="hover:text-slate-700 transition-colors">Jobs</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-800 font-medium truncate max-w-xs">{job.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ─── Left Column: Job Details ─────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Back button */}
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to jobs
            </Link>

            {/* Job Header Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                {/* Logo */}
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                  {job.companyLogo ? (
                    <img
                      src={job.companyLogo}
                      alt={job.company}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                    />
                  ) : null}
                  <div className={`w-full h-full items-center justify-center text-2xl ${job.companyLogo ? 'hidden' : 'flex'}`}>
                    {CATEGORY_ICONS[job.category] || '🏢'}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <h1
                        className="text-2xl lg:text-3xl font-bold text-slate-900 mb-1"
                        style={{ fontFamily: 'Syne, sans-serif' }}
                      >
                        {job.title}
                      </h1>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Building className="w-4 h-4 text-slate-400" />
                        <span className="font-medium">{job.company}</span>
                      </div>
                    </div>
                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigator.share?.({ title: job.title, url: window.location.href })}
                        className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                        title="Share"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                        title="Save"
                      >
                        <BookmarkPlus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge label={job.type} type="jobType" />
                    <Badge label={job.category} type="indigo" />
                  </div>

                  {/* Meta grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                        <MapPin className="w-3.5 h-3.5" /> Location
                      </div>
                      <p className="text-sm font-medium text-slate-700">{job.location}</p>
                    </div>
                    {salary && (
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                          <DollarSign className="w-3.5 h-3.5" /> Salary
                        </div>
                        <p className="text-sm font-medium text-slate-700">{salary}</p>
                      </div>
                    )}
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                        <Calendar className="w-3.5 h-3.5" /> Posted
                      </div>
                      <p className="text-sm font-medium text-slate-700">{timeAgo(job.createdAt)}</p>
                    </div>
                    {job.applicationCount !== undefined && (
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                          <Users className="w-3.5 h-3.5" /> Applicants
                        </div>
                        <p className="text-sm font-medium text-slate-700">{job.applicationCount}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 lg:p-8">
              <h2 className="text-lg font-bold text-slate-900 mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
                About This Role
              </h2>
              <div className="job-prose">
                {formatDescription(job.description)}
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 lg:p-8">
                <h2 className="text-lg font-bold text-slate-900 mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
                  Requirements
                </h2>
                <div className="job-prose">
                  {formatDescription(job.requirements)}
                </div>
              </div>
            )}

            {/* Mobile: Application form */}
            <div className="lg:hidden">
              <ApplicationForm jobId={job._id} jobTitle={job.title} />
            </div>

            {/* Related jobs */}
            {relatedJobs.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
                  Similar Jobs in {job.category}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedJobs.slice(0, 2).map((j) => (
                    <JobCard key={j._id} job={j} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ─── Right Column: Apply Form ──────────────────────────────── */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <ApplicationForm jobId={job._id} jobTitle={job.title} />

              {/* Quick info card */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
                <h3 className="font-semibold text-slate-800 text-sm mb-3">Job Summary</h3>
                <dl className="space-y-2.5">
                  {[
                    { label: 'Job Type', value: job.type },
                    { label: 'Category', value: job.category },
                    { label: 'Location', value: job.location },
                    ...(salary ? [{ label: 'Salary', value: salary }] : []),
                    { label: 'Posted', value: timeAgo(job.createdAt) },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center">
                      <dt className="text-xs text-slate-400">{label}</dt>
                      <dd className="text-xs font-medium text-slate-700 text-right max-w-[55%] truncate">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
