import { cn, JOB_TYPE_COLORS } from '@/lib/utils';

export default function Badge({ label, type = 'default', className = '' }) {
  const colors =
    type === 'jobType'
      ? JOB_TYPE_COLORS[label] || 'bg-slate-100 text-slate-600'
      : {
          default: 'bg-slate-100 text-slate-600',
          indigo: 'bg-indigo-100 text-indigo-700',
          green: 'bg-green-100 text-green-700',
          amber: 'bg-amber-100 text-amber-700',
          red: 'bg-red-100 text-red-700',
        }[type] || 'bg-slate-100 text-slate-600';

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        colors,
        className
      )}
    >
      {label}
    </span>
  );
}
