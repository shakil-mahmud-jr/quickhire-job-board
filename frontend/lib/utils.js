import { clsx } from 'clsx';

export function cn(...args) {
  return clsx(args);
}

export function timeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
  return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ago`;
}

export function formatSalary(salary) {
  if (!salary || (!salary.min && !salary.max)) return null;
  const fmt = (n) =>
    n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;
  if (salary.min && salary.max) return `${fmt(salary.min)} – ${fmt(salary.max)}`;
  if (salary.min) return `From ${fmt(salary.min)}`;
  if (salary.max) return `Up to ${fmt(salary.max)}`;
  return null;
}

export const JOB_TYPE_COLORS = {
  'Full-time': 'bg-green-100 text-green-700',
  'Part-time': 'bg-blue-100 text-blue-700',
  'Contract': 'bg-orange-100 text-orange-700',
  'Freelance': 'bg-purple-100 text-purple-700',
  'Internship': 'bg-pink-100 text-pink-700',
  'Remote': 'bg-indigo-100 text-indigo-700',
};

export const CATEGORY_ICONS = {
  Engineering: '⚙️',
  Design: '🎨',
  Marketing: '📣',
  Sales: '💼',
  Finance: '💰',
  'Human Resources': '👥',
  Product: '🧩',
  Operations: '🔧',
  'Customer Support': '🎧',
  Legal: '⚖️',
  Data: '📊',
  Other: '🌐',
};

export const CATEGORIES = [
  'Engineering', 'Design', 'Marketing', 'Sales', 'Finance',
  'Human Resources', 'Product', 'Operations', 'Customer Support',
  'Legal', 'Data', 'Other',
];

export const JOB_TYPES = [
  'Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', 'Remote',
];
