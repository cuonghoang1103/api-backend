'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { Course, Semester } from '@/types';
import { BookOpen, ChevronDown, ChevronRight, GraduationCap, Layers3, PlayCircle } from 'lucide-react';
import { toast } from 'sonner';
import AcademyBackground from '@/components/academy/AcademyBackground';
import { SafeImage } from '@/components/ui/SafeImage';
import { useSemesters, useCoursesBySemesters } from '@/hooks/useAcademyQueries';

export default function AcademyPage() {
  const { data: semesters = [], isLoading: loadingSemesters, error: semestersError } = useSemesters();
  const coursesQueries = useCoursesBySemesters(semesters);

  // Build the courses-by-semester map once all parallel queries finish.
  const coursesBySemester = useMemo<Record<number, Course[]>>(() => {
    const map: Record<number, Course[]> = {};
    semesters.forEach((semester, idx) => {
      map[semester.id] = coursesQueries[idx]?.data ?? [];
    });
    return map;
  }, [semesters, coursesQueries]);

  const loading = loadingSemesters || coursesQueries.some((q) => q.isLoading && !q.data);

  const [expanded, setExpanded] = useState<number[]>([]);
  useEffect(() => {
    // Auto-expand the first two semesters once data arrives.
    if (semesters.length > 0 && expanded.length === 0) {
      setExpanded(semesters.slice(0, 2).map((s) => s.id));
    }
  }, [semesters, expanded.length]);

  useEffect(() => {
    if (semestersError) toast.error('Không tải được Academy FPT');
  }, [semestersError]);

  const totalCourses = useMemo(
    () => Object.values(coursesBySemester).reduce((sum, courses) => sum + courses.length, 0),
    [coursesBySemester]
  );

  const toggleSemester = (semesterId: number) => {
    setExpanded((prev) => prev.includes(semesterId)
      ? prev.filter((item) => item !== semesterId)
      : [...prev, semesterId]);
  };

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: '#050314' }}>
      <AcademyBackground />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <section className="rounded-3xl border border-darkborder bg-darkcard p-8 overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.16),transparent_30%)]" />
          <div className="relative z-10 grid gap-6 lg:grid-cols-[1.4fr_0.8fr] items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-violet/30 bg-neon-violet/10 text-neon-violet text-sm mb-5">
                <GraduationCap className="w-4 h-4" /> FPT University Academy
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-text-primary leading-tight">
                Lộ trình học theo <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-indigo to-neon-violet">9 kỳ FPT</span>
              </h1>
              <p className="text-text-secondary text-lg mt-4 max-w-3xl">
                Học theo đúng cấu trúc môn học, chương, bài giảng, ghi chú và bài tập. Chọn kỳ học để khám phá từng môn và vào ngay bài học cần xem.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-darkborder bg-darkbg/80 p-5">
                <p className="text-text-muted text-sm">Kỳ học</p>
                <p className="text-3xl font-bold text-text-primary mt-2">{semesters.length}</p>
              </div>
              <div className="rounded-2xl border border-darkborder bg-darkbg/80 p-5">
                <p className="text-text-muted text-sm">Môn học</p>
                <p className="text-3xl font-bold text-text-primary mt-2">{totalCourses}</p>
              </div>
              <div className="rounded-2xl border border-darkborder bg-darkbg/80 p-5 col-span-2">
                <p className="text-text-muted text-sm">Truy cập nhanh</p>
                <p className="text-text-primary mt-2">Mở từng kỳ để xem danh sách môn học và vào ngay màn hình học tập.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-2xl border border-darkborder bg-darkcard p-4 h-fit lg:sticky lg:top-24">
            <div className="flex items-center gap-3 mb-4">
              <Layers3 className="w-5 h-5 text-neon-violet" />
              <h2 className="text-lg font-semibold text-text-primary">Semester navigator</h2>
            </div>
            <div className="space-y-2">
              {semesters.map((semester) => {
                const isOpen = expanded.includes(semester.id);
                const courses = coursesBySemester[semester.id] || [];
                return (
                  <div key={semester.id} className="rounded-2xl border border-darkborder overflow-hidden bg-darkbg/60">
                    <button
                      onClick={() => toggleSemester(semester.id)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition text-left"
                    >
                      <div>
                        <p className="font-semibold text-text-primary">{semester.name}</p>
                        <p className="text-xs text-text-muted">{courses.length} môn học</p>
                      </div>
                      {isOpen ? <ChevronDown className="w-4 h-4 text-text-muted" /> : <ChevronRight className="w-4 h-4 text-text-muted" />}
                    </button>
                    {isOpen && (
                      <div className="border-t border-darkborder divide-y divide-darkborder/60">
                        {courses.map((course) => (
                          <Link key={course.id} href={`/courses/${course.slug}`} className="block px-4 py-3 hover:bg-neon-violet/10 transition">
                            <p className="text-sm font-medium text-text-primary">{course.courseCode || 'COURSE'}</p>
                            <p className="text-sm text-text-secondary line-clamp-2">{course.title}</p>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>

          <div className="space-y-6">
            {semesters.map((semester) => {
              const courses = coursesBySemester[semester.id] || [];
              return (
                <section key={semester.id} className="rounded-2xl border border-darkborder bg-darkcard p-5">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-2xl font-heading font-bold text-text-primary">{semester.name}</h3>
                      <p className="text-text-muted">{semester.description || 'Danh sách môn học theo kỳ'}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full border border-neon-violet/30 bg-neon-violet/10 text-neon-violet text-sm">
                      {courses.length} môn
                    </span>
                  </div>

                  {courses.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-darkborder p-8 text-center text-text-muted">
                      Chưa có môn học cho kỳ này.
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {courses.map((course) => (
                        <Link
                          key={course.id}
                          href={`/courses/${course.slug}`}
                          className="group rounded-2xl border border-darkborder bg-darkbg/70 hover:border-neon-violet/40 transition overflow-hidden"
                        >
                          <div className="aspect-video bg-gradient-to-br from-neon-indigo/20 via-neon-violet/10 to-transparent flex items-center justify-center overflow-hidden relative">
                            {course.thumbnailUrl ? (
                              <SafeImage
                                src={course.thumbnailUrl}
                                alt={course.title}
                                label={course.title}
                                className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                              />
                            ) : (
                              <PlayCircle className="w-12 h-12 text-white/80 group-hover:scale-110 transition-transform relative z-10" />
                            )}
                          </div>
                          <div className="p-4 space-y-3">
                            <div className="flex items-center justify-between gap-2">
                              <span className="px-2.5 py-1 rounded-full bg-neon-violet/10 text-neon-violet text-xs font-semibold">
                                {course.courseCode || semester.code}
                              </span>
                              <span className="text-xs text-text-muted">{course.totalLessons || 0} lessons</span>
                            </div>
                            <h4 className="text-lg font-semibold text-text-primary line-clamp-2">{course.title}</h4>
                            <p className="text-sm text-text-secondary line-clamp-3">{course.shortDescription || course.description || 'Khóa học theo cấu trúc chương và bài giảng.'}</p>
                            <div className="flex items-center justify-between text-sm text-text-muted pt-1">
                              <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {course.totalLessons || 0} bài</span>
                              <span className="text-neon-violet group-hover:text-neon-indigo">Vào học</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
