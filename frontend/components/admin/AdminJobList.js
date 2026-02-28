'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Trash2, Eye, MapPin, Calendar, Users, AlertTriangle } from 'lucide-react';
import { deleteJob } from '@/lib/api';
import { timeAgo, CATEGORY_ICONS } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { JobCardSkeleton } from '@/components/ui/Skeleton';

function DeleteConfirmModal({ job, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-fade-up">
        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-lg font-bold text-center text-slate-900 mb-2">Delete Job Listing?</h3>
        <p className="text-slate-500 text-sm text-center mb-1">
          You're about to delete:
        </p>
        <p className="text-slate-800 font-medium text-center text-sm mb-4">
          "{job.title}" at {job.company}
        </p>
        <p className="text-xs text-red-500 bg-red-50 rounded-lg p-3 mb-5 text-center">
          This will also delete all applications for this job. This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" className="flex-1" onClick={onConfirm} loading={loading}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminJobList({ jobs, loading, onJobDeleted }) {
  const [deletingJob, setDeletingJob] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDeleteConfirm = async () => {
    if (!deletingJob) return;
    setDeleteLoading(true);
    setError('');
    try {
      await deleteJob(deletingJob._id);
      onJobDeleted?.(deletingJob._id);
      setDeletingJob(null);
    } catch (err) {
      setError(err.message || 'Failed to delete job');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => <JobCardSkeleton key={i} />)}
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">📋</span>
        </div>
        <p className="text-slate-600 font-medium mb-1">No job listings yet</p>
        <p className="text-slate-400 text-sm">Create your first job posting using the form.</p>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white rounded-xl border border-slate-100 p-4 hover:border-slate-200 transition-colors"
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-lg flex-shrink-0">
                {job.companyLogo ? (
                  <img src={job.companyLogo} alt={job.company} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  CATEGORY_ICONS[job.category] || '🏢'
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start gap-2 mb-1">
                  <h3 className="font-semibold text-slate-900 text-sm leading-tight">{job.title}</h3>
                  <Badge label={job.type} type="jobType" />
                  <Badge label={job.category} type="indigo" />
                </div>
                <p className="text-slate-500 text-xs font-medium mb-2">{job.company}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <div className="flex items-center gap-1 text-slate-400 text-xs">
                    <MapPin className="w-3 h-3" /> {job.location}
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 text-xs">
                    <Calendar className="w-3 h-3" /> {timeAgo(job.createdAt)}
                  </div>
                  {job.applicationCount !== undefined && (
                    <div className="flex items-center gap-1 text-slate-400 text-xs">
                      <Users className="w-3 h-3" /> {job.applicationCount} applicant{job.applicationCount !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/jobs/${job._id}`}
                  className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                  title="View job"
                >
                  <Eye className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setDeletingJob(job)}
                  className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete job"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {deletingJob && (
        <DeleteConfirmModal
          job={deletingJob}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingJob(null)}
          loading={deleteLoading}
        />
      )}
    </>
  );
}
