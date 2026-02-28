'use client';
import { useState } from 'react';
import { Search, MapPin, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { CATEGORIES, JOB_TYPES } from '@/lib/utils';

export default function SearchBar({ onSearch, initialValues = {} }) {
  const [query, setQuery] = useState(initialValues.search || '');
  const [category, setCategory] = useState(initialValues.category || '');
  const [location, setLocation] = useState(initialValues.location || '');
  const [type, setType] = useState(initialValues.type || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ search: query, category, location, type });
  };

  const handleReset = () => {
    setQuery(''); setCategory(''); setLocation(''); setType('');
    onSearch({ search: '', category: '', location: '', type: '' });
  };

  const hasFilters = query || category || location || type;

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Main search row */}
      <div className="flex flex-col md:flex-row gap-3 bg-white rounded-2xl shadow-card border border-slate-100 p-3">
        {/* Keyword search */}
        <div className="flex-1 flex items-center gap-3 px-3 py-1 rounded-xl bg-slate-50 border border-transparent focus-within:border-indigo-200 focus-within:bg-white transition-all">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Job title, keyword, or company..."
            className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
          />
        </div>

        {/* Location */}
        <div className="flex items-center gap-3 px-3 py-1 rounded-xl bg-slate-50 border border-transparent focus-within:border-indigo-200 focus-within:bg-white transition-all md:w-48">
          <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location..."
            className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <Search className="w-4 h-4" />
          Search Jobs
        </button>
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-3 mt-3">
        <div className="flex items-center gap-1.5 text-slate-500 text-sm">
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters:</span>
        </div>

        {/* Category */}
        <div className="relative">
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); onSearch({ search: query, category: e.target.value, location, type }); }}
            className="appearance-none pl-3 pr-8 py-1.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-600 hover:border-indigo-300 focus:outline-none focus:border-indigo-400 cursor-pointer transition-colors"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        </div>

        {/* Job Type */}
        <div className="relative">
          <select
            value={type}
            onChange={(e) => { setType(e.target.value); onSearch({ search: query, category, location, type: e.target.value }); }}
            className="appearance-none pl-3 pr-8 py-1.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-600 hover:border-indigo-300 focus:outline-none focus:border-indigo-400 cursor-pointer transition-colors"
          >
            <option value="">All Types</option>
            {JOB_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        </div>

        {/* Clear */}
        {hasFilters && (
          <button
            type="button"
            onClick={handleReset}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            Clear all
          </button>
        )}
      </div>
    </form>
  );
}
