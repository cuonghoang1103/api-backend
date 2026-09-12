'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { Course, Semester } from '@/types';
import { BookOpen, ChevronDown, ChevronRight, GraduationCap, Layers3, PlayCircle, RefreshCw, Search, Sparkles, X } from 'lucide-react';
import { toast } from 'sonner';
import AcademyBackground from '@/components/academy/AcademyBackground';
import AcademyOnboarding from '@/components/academy/AcademyOnboarding';
import { SafeImage } from '@/components/ui/SafeImage';
import { useSemesters, useCoursesBySemesters } from '@/hooks/useAcademyQueries';
import { useAcademyProfile } from '@/hooks/useAcademyProfile';
import { getCombo, getMajor, isPlaceholderCode, placeholderLabel, relevantCourseCodes, semesterPlan, subjectName } from '@/data/fptuCurriculum';
import { useTranslation } from '@/context/LocaleContext';
import { cn, pickLang } from '@/lib/utils';

/**
 * One card of the personalised "Môn của ngành bạn" strip. It deliberately
 * mirrors the card used inside the semester accordion below (same link target
 * `/courses/<slug>`, same chrome) and only adds the provenance badge — "Combo
 * <tên>" or "Chuyên ngành" — so a student can tell at a glance WHY a course is
 * at the top of their page. `CourseCard` is not reused here: it links to
 * `/academy/courses/<slug>` and has no slot for that badge.
 */
function PersonalCourseCard({ course, badge }: { course: Course; badge: string }) {
  const { locale } = useTranslation();
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group rounded-2xl border border-darkborder bg-darkbg/70 hover:border-neon-violet/40 transition overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-violet"
    >
      <div className="aspect-video bg-gradient-to-br from-neon-indigo/20 via-neon-violet/10 to-transparent flex items-center justify-center overflow-hidden relative">
        {course.thumbnailUrl ? (
          <SafeImage
            src={course.thumbnailUrl}
            alt={pickLang(course.title, locale)}
            label={pickLang(course.title, locale)}
            className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          />
        ) : (
          <PlayCircle className="w-12 h-12 text-white/80 group-hover:scale-110 transition-transform relative z-10" />
        )}
        <span className="absolute top-3 left-3 max-w-[calc(100%-1.5rem)] truncate px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-neon-cyan/30 text-neon-cyan text-xs font-semibold">
          {badge}
        </span>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="px-2.5 py-1 rounded-full bg-neon-violet/10 text-neon-violet text-xs font-semibold">
            {course.courseCode || 'COURSE'}
          </span>
          <span className="text-xs text-text-muted">{course.totalLessons || 0} lessons</span>
        </div>
        <h4 className="text-lg font-semibold text-text-primary line-clamp-2">{pickLang(course.title, locale)}</h4>
        <p className="text-sm text-text-secondary line-clamp-3">{pickLang(course.shortDescription || course.description, locale) || 'Khóa học theo cấu trúc chương và bài giảng.'}</p>
        <div className="flex items-center justify-between text-sm text-text-muted pt-1">
          <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {course.totalLessons || 0} bài</span>
          <span className="text-neon-violet group-hover:text-neon-indigo">Vào học</span>
        </div>
      </div>
    </Link>
  );
}

export default function AcademyPage() {
  const { locale } = useTranslation();
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

  // Flat list of every academy course (dedup across semesters) for search.
  const allCourses = useMemo(() => {
    const seen = new Set<number>();
    const out: Course[] = [];
    semesters.forEach((s) => (coursesBySemester[s.id] || []).forEach((c) => {
      if (!seen.has(c.id)) { seen.add(c.id); out.push(c); }
    }));
    return out;
  }, [semesters, coursesBySemester]);

  // Search by course code (also matches title). An exact code match is
  // ranked first, so typing "CEA" lists CEA203/CEA102… while "CEA203"
  // surfaces exactly that course at the top.
  const [query, setQuery] = useState('');
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allCourses
      .filter((c) => (c.courseCode || '').toLowerCase().includes(q) || c.title.toLowerCase().includes(q))
      .sort((a, b) => {
        const ac = (a.courseCode || '').toLowerCase();
        const bc = (b.courseCode || '').toLowerCase();
        const aExact = ac === q ? 0 : 1;
        const bExact = bc === q ? 0 : 1;
        if (aExact !== bExact) return aExact - bExact;
        return ac.localeCompare(bc);
      })
      .slice(0, 12);
  }, [query, allCourses]);

  // ── Personalisation (ngành / combo FPTU) ────────────────────────────────
  // The robot asks once; after that the answer only REORDERS this page — the
  // full 9-semester accordion below stays exactly as it was, so nothing a
  // student might need is ever hidden by their own answer.
  const { profile, needsOnboarding } = useAcademyProfile();
  /** Dismissing the robot without answering must not re-open it on every
   *  render — `needsOnboarding` stays true until an answer is saved. */
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);
  /** "Đổi ngành" re-opens the dialog straight at the major step. */
  const [reopenAtMajor, setReopenAtMajor] = useState(false);
  const onboardingOpen = reopenAtMajor || (needsOnboarding && !onboardingDismissed);

  const major = getMajor(profile.major);
  const combo = getCombo(profile.major, profile.combo);
  /** `isStudent === false` = "không phải sinh viên FPTU": show nothing at all,
   *  the page must behave exactly as it did before onboarding existed. */
  const isStudent = profile.isStudent === true;

  const coursesByCode = useMemo(() => {
    const map = new Map<string, Course>();
    allCourses.forEach((c) => {
      const key = (c.courseCode || '').trim().toUpperCase();
      if (key && !map.has(key)) map.set(key, c);
    });
    return map;
  }, [allCourses]);

  /** Only courses that REALLY exist in the loaded Academy data — a code with
   *  no course behind it is dropped, never rendered as an empty placeholder. */
  const personal = useMemo(() => {
    if (!isStudent || !major) return null;
    const codes = relevantCourseCodes(major.id, combo?.id ?? null);
    const pick = (list: string[]) => list
      .map((code) => coursesByCode.get(code.trim().toUpperCase()))
      .filter((c): c is Course => Boolean(c));
    return { comboCourses: pick(codes.combo), majorCourses: pick(codes.major) };
  }, [isStudent, major, combo, coursesByCode]);

  const showPersonalSection = !!personal
    && (personal.comboCourses.length > 0 || personal.majorCourses.length > 0 || !!combo);

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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

          {/* "Ngành của bạn" — only for a visitor who said they ARE an FPTU
              student AND picked a major. Someone who answered "không phải sinh
              viên" sees nothing here at all. */}
          {isStudent && major && (
            <div className="relative z-10 mt-6 rounded-2xl border border-neon-violet/30 bg-darkbg/80 p-4 sm:p-5">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <span aria-hidden className="text-3xl leading-none">{major.icon}</span>
                <div className="min-w-0 flex-1 basis-40">
                  <p className="text-xs uppercase tracking-wide text-text-muted">Ngành của bạn</p>
                  <p className="text-lg font-semibold text-text-primary break-words">{major.nameVi}</p>
                  <p className="text-xs text-text-muted break-words">{major.name}</p>
                </div>
                {combo && (
                  <span className="inline-flex items-center gap-1.5 max-w-full px-3 py-1.5 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan text-sm">
                    <span aria-hidden>{combo.icon}</span>
                    <span className="truncate">Combo {combo.nameVi}</span>
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setReopenAtMajor(true)}
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl border border-darkborder bg-darkcard text-text-primary hover:border-neon-violet/50 hover:text-neon-violet transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-violet"
                >
                  <RefreshCw className="w-4 h-4" aria-hidden /> Đổi ngành
                </button>
              </div>
              {major.comboNote && (
                <p className="mt-3 text-sm text-text-secondary">{major.comboNote}</p>
              )}
              <p className="mt-2 text-xs text-text-muted">
                Khung {major.curriculumCode} · {major.credits} tín chỉ · nguồn: FLM (View Curriculum, curid {major.curriculumId}).
              </p>
            </div>
          )}
        </section>

        {/* Course-code search — kept OUTSIDE the hero card because the hero
            uses overflow-hidden (for its rounded radial background), which
            would clip this dropdown. A dropdown/popover must never live
            inside an overflow-hidden/clip ancestor. */}
        <div className="relative z-20 max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm môn học theo mã (VD: CEA203, PRO192)…"
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-darkcard border border-darkborder text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              aria-label="Xoá tìm kiếm"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {query.trim() && (
            <div className="absolute left-0 right-0 z-30 mt-2 rounded-2xl border border-darkborder bg-darkcard shadow-2xl shadow-black/40 overflow-hidden max-h-[420px] overflow-y-auto">
              {searchResults.length === 0 ? (
                <div className="px-4 py-6 text-center text-text-muted text-sm">Không tìm thấy môn học khớp “{query.trim()}”.</div>
              ) : (
                searchResults.map((course) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.slug}`}
                    onClick={() => setQuery('')}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-neon-violet/10 transition border-b border-darkborder/50 last:border-b-0"
                  >
                    <div className="w-16 h-10 rounded-lg overflow-hidden bg-darkbg shrink-0 flex items-center justify-center">
                      {course.thumbnailUrl ? (
                        <SafeImage src={course.thumbnailUrl} alt={pickLang(course.title, locale)} label={pickLang(course.title, locale)} className="w-full h-full object-cover" />
                      ) : (
                        <PlayCircle className="w-5 h-5 text-white/60" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-neon-violet truncate">{course.courseCode || 'COURSE'}</p>
                      <p className="text-sm text-text-secondary truncate">{pickLang(course.title, locale)}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-text-muted shrink-0" />
                  </Link>
                ))
              )}
            </div>
          )}
        </div>

        {/* Personalised ORDERING, never hiding: the student's own combo/major
            courses are lifted to the top; the complete 9-semester accordion
            still follows below, untouched. */}
        {showPersonalSection && personal && major && (
          <section className="rounded-2xl border border-neon-violet/25 bg-darkcard p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="min-w-0">
                <h2 className="text-2xl font-heading font-bold text-text-primary flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-neon-violet shrink-0" aria-hidden /> Môn của ngành bạn
                </h2>
                <p className="text-text-muted text-sm mt-1">
                  Các môn Academy đang có cho {major.nameVi}{combo ? ` · combo ${combo.nameVi}` : ''}. Toàn bộ 9 kỳ vẫn ở ngay bên dưới.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full border border-neon-violet/30 bg-neon-violet/10 text-neon-violet text-sm">
                {personal.comboCourses.length + personal.majorCourses.length} môn đã có bài
              </span>
            </div>

            {combo && personal.comboCourses.length === 0 && (
              <p className="rounded-2xl border border-dashed border-darkborder px-4 py-3 text-sm text-text-secondary mb-4">
                Combo {combo.nameVi} chưa có môn nào trong Academy — các môn chung bên dưới vẫn dùng được.
              </p>
            )}

            {/* Thẻ lớn CHỈ dành cho môn của combo — đó là thứ riêng của người
                học này. Mọi môn khác trong khung nằm ở lộ trình 9 kỳ ngay dưới:
                một ngành có ~40 môn, dựng 40 thẻ ảnh lớn thì lộ trình bị đẩy
                xuống quá xa và trang nặng vô ích. */}
            {personal.comboCourses.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {personal.comboCourses.map((course) => (
                  <PersonalCourseCard key={`combo-${course.id}`} course={course} badge={`Combo ${combo?.nameVi ?? ''}`.trim()} />
                ))}
              </div>
            )}

            {/* Lộ trình 9 kỳ ĐÚNG khung của ngành (và combo) sinh viên chọn.
                Mã nào Academy đã có thì bấm vào học được; mã chưa có vẫn hiện
                TÊN THẬT của môn (bảng SUBJECT_NAMES lấy từ FAP + FLM) thay vì
                giấu đi — sinh viên cần biết kỳ đó trường dạy gì, kể cả khi
                Academy chưa dựng bài. Ô giữ chỗ combo chỉ hiện khi người học
                chưa chọn combo. */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <Layers3 className="w-4 h-4 text-neon-cyan shrink-0" aria-hidden />
                Lộ trình 9 kỳ của {major.nameVi}
                {combo ? <span className="text-neon-cyan">· combo {combo.nameVi}</span> : null}
              </h3>
              <p className="text-xs text-text-muted mt-1">
                Theo khung {major.curriculumCode} của trường. Môn có viền sáng là Academy đã dựng bài — bấm vào học ngay.
              </p>

              <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {semesterPlan(major.id, combo?.id ?? null).map(({ semester, codes }) => (
                  <div key={semester} className="rounded-2xl border border-darkborder bg-darkbg/60 p-3">
                    <p className="text-xs uppercase tracking-wide text-text-muted mb-2">
                      {semester === 0 ? 'Trước kỳ 1 (chuẩn bị)' : `Kỳ ${semester}`}
                    </p>
                    <ul className="space-y-1.5">
                      {codes.map((code) => {
                        const course = coursesByCode.get(code.trim().toUpperCase());
                        const slot = isPlaceholderCode(code);
                        if (course) {
                          return (
                            <li key={code}>
                              <Link
                                href={`/courses/${course.slug}`}
                                className="flex items-baseline gap-2 rounded-lg px-2 py-1 border border-neon-violet/30 bg-neon-violet/[0.07] hover:border-neon-violet/70 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-violet"
                              >
                                <span className="font-mono text-xs text-neon-violet shrink-0">{code}</span>
                                <span className="text-xs text-text-primary truncate">
                                  {pickLang(course.title, locale)}
                                </span>
                              </Link>
                            </li>
                          );
                        }
                        return (
                          <li key={code} className="flex items-baseline gap-2 px-2 py-1">
                            <span className={cn('font-mono text-xs shrink-0', slot ? 'text-text-muted' : 'text-text-secondary')}>
                              {code}
                            </span>
                            <span className="text-xs text-text-muted truncate">
                              {slot ? placeholderLabel(code) : (subjectName(code) ?? 'Chưa có trong Academy')}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* A sticky column MUST cap its own height and scroll internally.
              With 9 semesters (2 auto-expanded) this aside is ~1450px tall
              while a laptop viewport is ~900px: once `position: sticky` pins
              it at top-24 the bottom ~640px sits below the fold forever —
              the page keeps scrolling but the navigator sits frozen, so the
              lower semesters are unreachable. max-height + overflow-y makes
              the sidebar scroll on its own; `overscroll-contain` stops that
              scroll from chaining into the page when it hits the end. */}
          <aside className="thin-scroll rounded-2xl border border-darkborder bg-darkcard p-4 h-fit lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto overscroll-contain">
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
                            <p className="text-sm text-text-secondary line-clamp-2">{pickLang(course.title, locale)}</p>
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
                                alt={pickLang(course.title, locale)}
                                label={pickLang(course.title, locale)}
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
                            <h4 className="text-lg font-semibold text-text-primary line-clamp-2">{pickLang(course.title, locale)}</h4>
                            <p className="text-sm text-text-secondary line-clamp-3">{pickLang(course.shortDescription || course.description, locale) || 'Khóa học theo cấu trúc chương và bài giảng.'}</p>
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

      {onboardingOpen && (
        <AcademyOnboarding
          open
          initialStep={reopenAtMajor ? 'major' : 'ask'}
          onClose={() => { setReopenAtMajor(false); setOnboardingDismissed(true); }}
        />
      )}
    </div>
  );
}
