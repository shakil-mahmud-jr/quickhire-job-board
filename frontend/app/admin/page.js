'use client';
import { useState, useEffect, useCallback } from 'react';
import { Shield, PlusCircle, List, Briefcase, Users, TrendingUp, Eye } from 'lucide-react';
import { getJobs, getApplications } from '@/lib/api';
import AdminJobForm from '@/components/admin/AdminJobForm';
import AdminJobList from '@/components/admin/AdminJobList';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('list');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalJobs: 0, totalApplications: 0 });

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const [jobsData, appsData] = await Promise.allSettled([
        getJobs({ limit: 50, sort: '-createdAt' }),
        getApplications({ limit: 1 }),
      ]);

      const jobsList = jobsData.status === 'fulfilled' ? jobsData.value.data || [] : [];
      setJobs(jobsList);

      const totalApps =
        appsData.status === 'fulfilled' ? appsData.value.pagination?.total || 0 : 0;

      setStats({
        totalJobs: jobsData.status === 'fulfilled' ? jobsData.value.pagination?.total || 0 : 0,
        totalApplications: totalApps,
      });
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleJobCreated = (newJob) => {
    setJobs((prev) => [newJob, ...prev]);
    setStats((s) => ({ ...s, totalJobs: s.totalJobs + 1 }));
    setActiveTab('list');
  };

  const handleJobDeleted = (deletedId) => {
    setJobs((prev) => prev.filter((j) => j._id !== deletedId));
    setStats((s) => ({ ...s, totalJobs: Math.max(0, s.totalJobs - 1) }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 text-sm font-medium mb-1">
                <Shield className="w-4 h-4" />
                Admin Panel
              </div>
              <h1
                className="text-3xl font-bold text-slate-900"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                Manage Job Listings
              </h1>
            </div>

            {/* Stats */}
            <div className="flex gap-4">
              <div className="bg-indigo-50 rounded-xl px-5 py-3 text-center">
                <p className="text-2xl font-bold text-indigo-700" style={{ fontFamily: 'Syne, sans-serif' }}>
                  {stats.totalJobs}
                </p>
                <p className="text-xs text-indigo-500 font-medium">Active Jobs</p>
              </div>
              <div className="bg-violet-50 rounded-xl px-5 py-3 text-center">
                <p className="text-2xl font-bold text-violet-700" style={{ fontFamily: 'Syne, sans-serif' }}>
                  {stats.totalApplications}
                </p>
                <p className="text-xs text-violet-500 font-medium">Applications</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ─── Left: Tabs + Content ──────────────────────────────────── */}
          <div className="lg:col-span-2">
            {/* Tab Switcher */}
            <div className="flex gap-2 bg-white border border-slate-100 rounded-xl p-1.5 shadow-sm mb-6 w-fit">
              <button
                onClick={() => setActiveTab('list')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'list'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <List className="w-4 h-4" />
                All Listings
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                    activeTab === 'list' ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {stats.totalJobs}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'create'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                Post New Job
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'list' ? (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2
                    className="text-lg font-bold text-slate-900"
                    style={{ fontFamily: 'Syne, sans-serif' }}
                  >
                    Active Job Listings
                  </h2>
                  <button
                    onClick={fetchJobs}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                  >
                    Refresh
                  </button>
                </div>
                <AdminJobList jobs={jobs} loading={loading} onJobDeleted={handleJobDeleted} />
              </div>
            ) : (
              <AdminJobForm onJobCreated={handleJobCreated} />
            )}
          </div>

          {/* ─── Right: Quick Actions / Tips ──────────────────────────── */}
          <div className="space-y-5">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
              <h3
                className="font-bold text-slate-900 mb-4"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                Quick Actions
              </h3>
              <div className="space-y-2.5">
                <button
                  onClick={() => setActiveTab('create')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  Post New Job
                </button>
                <button
                  onClick={() => setActiveTab('list')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                >
                  <Briefcase className="w-4 h-4" />
                  View All Listings
                </button>
              </div>
            </div>

            {/* Stats overview */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
              <h3
                className="font-bold text-slate-900 mb-4"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                Overview
              </h3>
              <div className="space-y-4">
                {[
                  { icon: Briefcase, label: 'Active Listings', value: stats.totalJobs, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                  { icon: Users, label: 'Total Applications', value: stats.totalApplications, color: 'text-violet-600', bg: 'bg-violet-50' },
                  { icon: TrendingUp, label: 'Avg. per Listing', value: stats.totalJobs ? Math.round(stats.totalApplications / stats.totalJobs) : 0, color: 'text-green-600', bg: 'bg-green-50' },
                ].map(({ icon: Icon, label, value, color, bg }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-400">{label}</p>
                      <p className="text-lg font-bold text-slate-800" style={{ fontFamily: 'Syne, sans-serif' }}>
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-5">
              <h3 className="font-bold text-indigo-900 mb-3 text-sm">💡 Tips for Better Results</h3>
              <ul className="space-y-2 text-xs text-indigo-700">
                <li>• Add a clear, specific job title</li>
                <li>• Include salary range — 40% more applications</li>
                <li>• List concrete requirements, not vague traits</li>
                <li>• Add a company logo URL for visual appeal</li>
                <li>• Keep description concise but compelling</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
