'use client';
import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Briefcase } from 'lucide-react';
import { getJobs } from '@/lib/api';
import SearchBar from '@/components/jobs/SearchBar';
import JobGrid from '@/components/jobs/JobGrid';
import Pagination from '@/components/jobs/Pagination';

function JobsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentFilters = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    location: searchParams.get('location') || '',
    type: searchParams.get('type') || '',
    page: parseInt(searchParams.get('page') || '1'),
  };

  const fetchJobs = useCallback(async (filters) => {
    setLoading(true);
    try {
      const data = await getJobs({ ...filters, limit: 12 });
      setJobs(data.data || []);
      setPagination(data.pagination || null);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs(currentFilters);
  }, [searchParams]);

  const updateURL = (newParams) => {
    const params = new URLSearchParams();
    Object.entries(newParams).forEach(([k, v]) => { if (v) params.set(k, v); });
    router.push(`/jobs?${params.toString()}`);
  };

  const handleSearch = (filters) => {
    updateURL({ ...filters, page: '1' });
  };

  const handlePageChange = (page) => {
    updateURL({ ...currentFilters, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeFilterCount = [
    currentFilters.search,
    currentFilters.category,
    currentFilters.location,
    currentFilters.type,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-24">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-indigo-600 text-sm font-medium mb-2">
              <Briefcase className="w-4 h-4" />
              Job Listings
            </div>
            <h1
              className="text-3xl font-bold text-slate-900"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Browse All Jobs
              {pagination && (
                <span className="ml-3 text-2xl font-normal text-slate-400">
                  ({pagination.total.toLocaleString()})
                </span>
              )}
            </h1>
          </div>
          <SearchBar onSearch={handleSearch} initialValues={currentFilters} />
        </div>
      </div>

      {/* Active filter pills */}
      {activeFilterCount > 0 && (
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap gap-2 items-center">
            <span className="text-xs text-slate-500">Active filters:</span>
            {currentFilters.search && (
              <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full">
                Search: "{currentFilters.search}"
              </span>
            )}
            {currentFilters.category && (
              <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full">
                {currentFilters.category}
              </span>
            )}
            {currentFilters.location && (
              <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full">
                📍 {currentFilters.location}
              </span>
            )}
            {currentFilters.type && (
              <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full">
                {currentFilters.type}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Jobs grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <JobGrid jobs={jobs} loading={loading} totalJobs={pagination?.total} />
        <Pagination pagination={pagination} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 pt-24" />}>
      <JobsContent />
    </Suspense>
  );
}
