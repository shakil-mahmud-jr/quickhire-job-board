import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl font-extrabold text-indigo-100 mb-0" style={{ fontFamily: 'Syne, sans-serif' }}>
          404
        </div>
        <div className="relative -mt-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>
            Page Not Found
          </h1>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">
            Hmm, that page doesn't exist. Maybe the job was filled, or the URL is incorrect.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors"
            >
              <Home className="w-4 h-4" /> Go Home
            </Link>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:border-indigo-300 hover:text-indigo-600 transition-colors"
            >
              <Search className="w-4 h-4" /> Browse Jobs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
