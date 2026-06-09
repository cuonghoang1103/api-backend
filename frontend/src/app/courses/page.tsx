'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Search, Filter, ChevronDown, Loader2 } from 'lucide-react';
import CourseCard from '@/components/course/CourseCard';
import { coursesApi, courseCategoryApi } from '@/lib/api';
import type { Course, CourseCategory } from '@/types';

const LEVELS = [
  { value: '', label: 'All' },
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'ADVANCED', label: 'Advanced' },
];

function CoursesContent() {
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [keyword, setKeyword] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [page, setPage] = useState(0);
  const [size] = useState(12);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    courseCategoryApi.getAll().then(r => setCategories(r.data.data || [])).catch(() => {});
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await coursesApi.getAll({ page: page + 1, size, keyword: keyword || undefined, category: category || undefined, level: level || undefined });
      const coursesData = res.data?.data;
      const pagination = res.data?.pagination;
      setCourses(Array.isArray(coursesData) ? coursesData : []);
      setTotalPages(pagination?.totalPages || 0);
      setTotalElements(pagination?.total || 0);
    } catch {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [page, category, level]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchCourses();
  };

  return (
    <div className="min-h-screen bg-darkbg">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-neon-indigo/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-neon-violet/10 rounded-full blur-[150px]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-text-primary mb-4">
            Online <span className="bg-gradient-to-r from-neon-indigo to-neon-violet bg-clip-text text-transparent">Courses</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-8">
            Learn programming from beginner to advanced with high-quality courses,
            detailed lessons and hands-on materials.
          </p>
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                placeholder="Search courses..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-darkcard border border-darkborder text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 pb-20">
        {/* Filter bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-darkcard border border-darkborder rounded-lg text-text-primary text-sm hover:border-neon-violet/30 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {categories.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => { setCategory(''); setPage(0); }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    !category ? 'bg-neon-violet text-white' : 'bg-darkcard border border-darkborder text-text-muted hover:text-text-primary'
                  }`}
                >
                    All
                  </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { setCategory(cat.slug); setPage(0); }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      category === cat.slug ? 'bg-neon-violet text-white' : 'bg-darkcard border border-darkborder text-text-muted hover:text-text-primary'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <select
            value={level}
            onChange={e => { setLevel(e.target.value); setPage(0); }}
            className="px-4 py-2 bg-darkcard border border-darkborder rounded-lg text-text-primary text-sm focus:outline-none focus:border-neon-violet/50"
          >
            {LEVELS.map(l => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-text-muted text-sm">
            {loading ? 'Loading...' : `Found ${totalElements.toLocaleString('vi-VN')} courses`}
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-neon-violet" />
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">No courses yet</h3>
            <p className="text-text-muted">Try changing filters or search keywords.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 bg-darkcard border border-darkborder rounded-lg text-text-primary text-sm hover:border-neon-violet/30 disabled:opacity-30 transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const p = page < 3 ? i : page > totalPages - 4 ? totalPages - 7 + i : page - 3 + i;
                  if (p < 0 || p >= totalPages) return null;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        p === page
                          ? 'bg-gradient-to-r from-neon-indigo to-neon-violet text-white'
                          : 'bg-darkcard border border-darkborder text-text-muted hover:text-text-primary'
                      }`}
                    >
                      {p + 1}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-4 py-2 bg-darkcard border border-darkborder rounded-lg text-text-primary text-sm hover:border-neon-violet/30 disabled:opacity-30 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-darkbg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neon-violet" />
      </div>
    }>
      <CoursesContent />
    </Suspense>
  );
}
