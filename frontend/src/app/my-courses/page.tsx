'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';
import { BookOpen, Loader2, Search } from 'lucide-react';
import { coursesApi } from '@/lib/api';
import MyCourseCard from '@/components/academy/MyCourseCard';
import type { Enrollment } from '@/types';

export default function MyCoursesPage() {
  const { data: session, status } = useSession();
  const { isAuthenticated: isBackendAuth, isLoading: isBackendLoading } = useAuthStore();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'completed'>('all');
  const [search, setSearch] = useState('');
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isLoading = isBackendLoading || status === 'loading';
  // Authenticated if either backend auth OR social login session exists
  const isAuthenticated = mounted && (isBackendAuth || status === 'authenticated');

  useEffect(() => {
    if (!mounted || isLoading) return;
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!mounted || isLoading || !isAuthenticated) return;
    loadEnrollments();
  }, [mounted, isLoading, isAuthenticated]);

  const loadEnrollments = async () => {
    setLoading(true);
    try {
      const res = await coursesApi.getAllMyCourses();
      setEnrollments(res.data.data || []);
    } catch {
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = enrollments.filter(e => {
    if (filter === 'in_progress') return e.progressPercent > 0 && e.progressPercent < 100;
    if (filter === 'completed') return e.progressPercent === 100;
    return true;
  }).filter(e =>
    !search || e.courseTitle.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: enrollments.length,
    inProgress: enrollments.filter(e => e.progressPercent > 0 && e.progressPercent < 100).length,
    completed: enrollments.filter(e => e.progressPercent === 100).length,
  };

  return (
    <div className="min-h-screen bg-darkbg pt-20">
      {/* Hero */}
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-neon-indigo/15 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-neon-violet/15 rounded-full blur-[150px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-2">
              My Learning
            </h1>
            <p className="text-text-secondary">Track your enrolled courses and continue learning</p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Courses', value: stats.total, color: 'text-neon-violet' },
            { label: 'In Progress', value: stats.inProgress, color: 'text-yellow-400' },
            { label: 'Completed', value: stats.completed, color: 'text-green-400' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-darkcard border border-darkborder rounded-2xl p-4 text-center"
            >
              <p className={`text-2xl font-heading font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-text-muted mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search my courses..."
              className="w-full pl-10 pr-4 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'in_progress', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                  filter === f
                    ? 'bg-neon-violet/20 border-neon-violet text-neon-violet'
                    : 'bg-darkcard border-darkborder text-text-secondary hover:border-neon-violet/30'
                }`}
              >
                {f === 'all' ? 'All' : f === 'in_progress' ? 'In Progress' : 'Completed'}
              </button>
            ))}
          </div>
        </div>

        {/* Course grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-neon-violet" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-text-muted/30 mx-auto mb-4" />
            <h3 className="text-xl font-heading font-bold text-text-primary mb-2">No courses found</h3>
            <p className="text-text-muted mb-6">{
              filter !== 'all'
                ? 'No courses match this filter'
                : search
                ? 'No courses match your search'
                : 'You haven\'t enrolled in any courses yet'
            }</p>
            <Link
              href="/academy"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((enrollment, i) => (
              <MyCourseCard key={enrollment.id} enrollment={enrollment} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
