import JobCard from './JobCard';
import { JobCardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';

export default function JobGrid({ jobs, loading, totalJobs }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <JobCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <EmptyState
        title="No jobs found"
        description="Try adjusting your search or filters to find what you're looking for."
        action={{ href: '/jobs', label: 'View All Jobs' }}
      />
    );
  }

  return (
    <div>
      {totalJobs !== undefined && (
        <p className="text-slate-500 text-sm mb-5">
          Showing <span className="font-semibold text-slate-700">{jobs.length}</span> of{' '}
          <span className="font-semibold text-slate-700">{totalJobs}</span> jobs
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {jobs.map((job, i) => (
          <JobCard
            key={job._id}
            job={job}
            style={{ animationDelay: `${i * 60}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
