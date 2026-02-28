'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight, TrendingUp, Users, Briefcase, MapPin,
  Star, ChevronRight, Building, Zap
} from 'lucide-react';
import { getJobs } from '@/lib/api';
import { CATEGORY_ICONS, CATEGORIES, timeAgo, formatSalary } from '@/lib/utils';
import JobCard from '@/components/jobs/JobCard';
import { JobCardSkeleton } from '@/components/ui/Skeleton';
import SearchBar from '@/components/jobs/SearchBar';

const FEATURED_CATEGORIES = [
  { name: 'Engineering',    count: '1.2k', color: 'bg-blue-50 text-blue-700 border-blue-100', hoverColor: 'hover:bg-blue-100' },
  { name: 'Design',         count: '420',  color: 'bg-pink-50 text-pink-700 border-pink-100',  hoverColor: 'hover:bg-pink-100' },
  { name: 'Marketing',      count: '310',  color: 'bg-amber-50 text-amber-700 border-amber-100', hoverColor: 'hover:bg-amber-100' },
  { name: 'Finance',        count: '265',  color: 'bg-green-50 text-green-700 border-green-100', hoverColor: 'hover:bg-green-100' },
  { name: 'Product',        count: '198',  color: 'bg-purple-50 text-purple-700 border-purple-100', hoverColor: 'hover:bg-purple-100' },
  { name: 'Data',           count: '340',  color: 'bg-cyan-50 text-cyan-700 border-cyan-100',   hoverColor: 'hover:bg-cyan-100' },
  { name: 'Operations',     count: '175',  color: 'bg-orange-50 text-orange-700 border-orange-100', hoverColor: 'hover:bg-orange-100' },
  { name: 'Human Resources',count: '140',  color: 'bg-rose-50 text-rose-700 border-rose-100',  hoverColor: 'hover:bg-rose-100' },
];

const STATS = [
  { icon: Briefcase, label: 'Jobs Listed',     value: '5,000+', color: 'text-indigo-600' },
  { icon: Building,  label: 'Companies',        value: '1,200+', color: 'text-violet-600' },
  { icon: Users,     label: 'Job Seekers',      value: '80,000+', color: 'text-blue-600'  },
  { icon: Star,      label: 'Placements/Month', value: '2,400+', color: 'text-amber-500'  },
];

export default function HomePage() {
  const router = useRouter();
  const [latestJobs, setLatestJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJobs({ limit: 6, sort: '-createdAt' })
      .then((d) => setLatestJobs(d.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = useCallback(({ search, category, location, type }) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (location) params.set('location', location);
    if (type) params.set('type', type);
    router.push(`/jobs?${params.toString()}`);
  }, [router]);

  return (
    <>
      {/* ─── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-hero-gradient pt-28 pb-20">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100 rounded-full -translate-y-1/2 translate-x-1/3 opacity-60 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-violet-100 rounded-full translate-y-1/2 -translate-x-1/3 opacity-50 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6 animate-fade-up">
                <Zap className="w-4 h-4" />
                Over 5,000 active jobs
              </div>
              <h1
                className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6 animate-fade-up delay-100"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                Discover more than{' '}
                <span className="text-indigo-600 relative">
                  5000+
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                    <path d="M0 6 Q50 0 100 5 Q150 10 200 4" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" fill="none" />
                  </svg>
                </span>{' '}
                Jobs
              </h1>
              <p className="text-slate-600 text-lg leading-relaxed mb-8 animate-fade-up delay-200 max-w-lg">
                Find your perfect career match. Browse thousands of opportunities
                from top companies worldwide — remote, hybrid, and on-site.
              </p>

              {/* Search bar */}
              <div className="animate-fade-up delay-300">
                <SearchBar onSearch={handleSearch} />
              </div>

              {/* Popular searches */}
              <div className="mt-5 flex flex-wrap items-center gap-2 animate-fade-up delay-400">
                <span className="text-slate-500 text-sm">Popular:</span>
                {['React Developer', 'UI Designer', 'Product Manager', 'Remote'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleSearch({ search: tag })}
                    className="px-3 py-1 text-xs bg-white border border-slate-200 text-slate-600 rounded-full hover:border-indigo-300 hover:text-indigo-600 transition-colors shadow-sm"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Right — floating cards */}
            <div className="hidden lg:block relative">
              <div className="relative animate-float">
                {/* Main card */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Senior UI Designer</p>
                      <p className="text-slate-500 text-sm">TechCorp Inc. · Remote</p>
                    </div>
                    <span className="ml-auto bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">New</span>
                  </div>
                  <div className="flex gap-2 flex-wrap mb-5">
                    {['Full-time', 'Design', '$90k–$120k'].map((t) => (
                      <span key={t} className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full">{t}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {['#818cf8','#f472b6','#34d399','#fb923c'].map((c, i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white" style={{ background: c }} />
                      ))}
                    </div>
                    <span className="text-slate-500 text-xs">+24 applicants</span>
                  </div>
                </div>

                {/* Floating mini cards */}
                <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border border-slate-100 w-48">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center text-sm">🎨</div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">UX Researcher</p>
                      <p className="text-xs text-slate-400">Creative Studio</p>
                    </div>
                  </div>
                  <span className="text-xs text-indigo-600 font-medium">$70k – $90k</span>
                </div>

                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-slate-100 w-52">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-sm">⚙️</div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">Backend Engineer</p>
                      <p className="text-xs text-slate-400">DataFlow · NYC</p>
                    </div>
                  </div>
                  <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-indigo-500 h-1.5 rounded-full w-3/4" />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">18/24 spots filled</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white rounded-2xl border border-slate-100 shadow-card px-8 py-6">
            {STATS.map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex flex-col items-center text-center md:border-r last:border-r-0 border-slate-100">
                <Icon className={`w-5 h-5 mb-2 ${color}`} />
                <p className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Syne, sans-serif' }}>{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
                Explore by Category
              </h2>
              <p className="text-slate-500">Discover jobs across every industry and skill set</p>
            </div>
            <Link
              href="/jobs"
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {FEATURED_CATEGORIES.map(({ name, count, color, hoverColor }, i) => (
              <Link
                key={name}
                href={`/jobs?category=${encodeURIComponent(name)}`}
                className={`group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border ${color} ${hoverColor} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <span className="text-3xl">{CATEGORY_ICONS[name]}</span>
                <div className="text-center">
                  <p className="font-semibold text-sm">{name}</p>
                  <p className="text-xs opacity-70 mt-0.5">{count} openings</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ────────────────────────────────────────────────── */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl overflow-hidden relative">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>
            <div className="relative z-10 px-8 py-12 md:px-16 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>
                  Start posting jobs today
                </h2>
                <p className="text-indigo-200 text-lg">
                  Reach thousands of qualified candidates in minutes.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <Link
                  href="/admin"
                  className="px-8 py-3.5 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg text-sm whitespace-nowrap"
                >
                  Post a Job — It's Free
                </Link>
                <Link
                  href="/jobs"
                  className="px-8 py-3.5 border-2 border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors text-sm whitespace-nowrap"
                >
                  Browse Jobs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LATEST JOBS ───────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
                Latest Jobs Open
              </h2>
              <p className="text-slate-500">Fresh opportunities posted this week</p>
            </div>
            <Link
              href="/jobs"
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-medium hover:border-indigo-300 hover:text-indigo-600 transition-colors shadow-sm"
            >
              View All Jobs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => <JobCardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {latestJobs.map((job, i) => (
                <JobCard key={job._id} job={job} style={{ animationDelay: `${i * 80}ms` }} />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-md text-sm"
            >
              Explore All Jobs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── TRUSTED COMPANIES ─────────────────────────────────────────── */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-8">
            Trusted by companies worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {['TechCorp', 'DataFlow', 'CreativeStudio', 'InnovateLab', 'CloudBase', 'GrowthHive'].map((name) => (
              <div key={name} className="text-xl font-bold text-slate-200 hover:text-slate-400 transition-colors" style={{ fontFamily: 'Syne, sans-serif' }}>
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
