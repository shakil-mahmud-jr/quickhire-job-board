import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock, DollarSign, ArrowRight } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { timeAgo, formatSalary, JOB_TYPE_COLORS, CATEGORY_ICONS } from '@/lib/utils';

export default function JobCard({ job, style }) {
  const salary = formatSalary(job.salary);

  return (
    <Link href={`/jobs/${job._id}`} className="block group" style={style}>
      <article className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-card-hover hover:border-indigo-100 transition-all duration-300 hover:-translate-y-0.5 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          {/* Company Logo */}
          <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-slate-50 border border-slate-100 flex items-center justify-center">
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.company}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className={`w-full h-full items-center justify-center text-lg ${job.companyLogo ? 'hidden' : 'flex'}`}
            >
              {CATEGORY_ICONS[job.category] || '🏢'}
            </div>
          </div>

          {/* Title + Company */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 text-base leading-tight mb-1 group-hover:text-indigo-600 transition-colors line-clamp-2">
              {job.title}
            </h3>
            <p className="text-slate-500 text-sm font-medium truncate">{job.company}</p>
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-4">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate max-w-[120px]">{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{timeAgo(job.createdAt)}</span>
          </div>
          {salary && (
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <DollarSign className="w-3.5 h-3.5 text-slate-400" />
              <span>{salary}</span>
            </div>
          )}
        </div>

        {/* Description snippet */}
        <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
          {job.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
          <div className="flex gap-2 flex-wrap">
            <Badge label={job.type} type="jobType" />
            <Badge label={job.category} type="indigo" />
          </div>
          <span className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs font-medium">
            Apply <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </article>
    </Link>
  );
}
