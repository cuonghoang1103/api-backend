'use client';

/**
 * Sơ đồ môn học — timeline 9 kỳ của đúng ngành/ngành hẹp người dùng chọn.
 * Giúp hiểu: học xong ra trường làm gì, mỗi môn đóng góp gì cho nghề — để học
 * SÂU, có động lực, không chỉ pass môn. Bấm từng môn xem chi tiết + vào học.
 */

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Sparkles, X, GraduationCap, Briefcase, BookOpen, ChevronRight, Lightbulb } from 'lucide-react';
import AcademyBackground from '@/components/academy/AcademyBackground';
import { useSemesters, useCoursesBySemesters } from '@/hooks/useAcademyQueries';
import { getFaculty, getCatMajor, getCatCombo, leafSemesterPlan } from '@/data/academyCatalog';
import { phaseOf, careerFor, COURSE_HINTS } from '@/data/academyRoadmap';
import { useTranslation } from '@/context/LocaleContext';
import { pickLang, cn } from '@/lib/utils';
import { isPlaceholderCode, subjectName } from '@/data/fptuCurriculum';
import type { Course } from '@/types';

export const dynamic = 'force-dynamic';

/** Tầng của tháp môn học: nền tảng ở ĐÁY (rộng nhất) → chuyên sâu ở ĐỈNH. */
const PYRAMID = [
  { key: 'advanced', label: 'Chuyên sâu & Đồ án', sems: [7, 8, 9], color: '#a3e635', w: 'sm:w-[48%]' },
  { key: 'ojt', label: 'Thực tập (OJT)', sems: [6], color: '#f59e0b', w: 'sm:w-[66%]' },
  { key: 'core', label: 'Cốt lõi chuyên ngành', sems: [3, 4, 5], color: '#8b5cf6', w: 'sm:w-[84%]' },
  { key: 'foundation', label: 'Nền tảng', sems: [1, 2], color: '#22d3ee', w: 'sm:w-full' },
] as const;

export default function CourseRoadmapPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { locale } = useTranslation();
  const facultyId = params.get('faculty');
  const majorId = params.get('major');
  const comboId = params.get('combo');

  const faculty = getFaculty(facultyId);
  const major = getCatMajor(facultyId, majorId);
  const combo = getCatCombo(facultyId, majorId, comboId);
  const career = careerFor(facultyId, majorId, comboId);

  const { data: semesters = [] } = useSemesters();
  const coursesQueries = useCoursesBySemesters(semesters);
  const coursesByCode = useMemo(() => {
    const m = new Map<string, Course>();
    coursesQueries.forEach((q) => (q.data ?? []).forEach((c: Course) => {
      const k = (c.courseCode || '').trim().toUpperCase();
      if (k && !m.has(k)) m.set(k, c);
    }));
    return m;
  }, [coursesQueries]);

  const plan = useMemo(
    () => leafSemesterPlan(facultyId, majorId, comboId).filter((s) => s.semester >= 1 && s.codes.length),
    [facultyId, majorId, comboId],
  );

  // Project OJT (INT6xx) — CHỈ cho SE + Node.JS/C#. Dùng cho tháp & Kỳ 6.
  const projectCodes = useMemo(
    () => ((majorId === 'se' && (comboId === 'react-nodejs' || comboId === 'dotnet'))
      ? [...coursesByCode.keys()].filter((k) => /^INT6\d\d$/.test(k)).sort()
      : []),
    [majorId, comboId, coursesByCode],
  );
  const isProject = (code: string) => projectCodes.includes(code.trim().toUpperCase());

  const phaseGroups = useMemo(() => PYRAMID.map((ph) => {
    let codes = plan.filter((s) => (ph.sems as readonly number[]).includes(s.semester)).flatMap((s) => s.codes).filter((c) => !isPlaceholderCode(c));
    if (ph.key === 'ojt') codes = [...codes, ...projectCodes];
    return { ...ph, codes: [...new Set(codes)] };
  }), [plan, projectCodes]);

  const [selected, setSelected] = useState<string | null>(null);
  const selCourse = selected ? coursesByCode.get(selected.trim().toUpperCase()) : undefined;
  const selName = selected ? (selCourse ? pickLang(selCourse.title, locale) : (subjectName(selected) ?? selected)) : '';
  const selSemester = useMemo(() => {
    if (!selected) return 0;
    for (const s of plan) if (s.codes.includes(selected)) return s.semester;
    return 0;
  }, [selected, plan]);
  const selHint = selected ? (COURSE_HINTS[selected.trim().toUpperCase()] || phaseOf(selSemester).desc) : '';

  const backToAcademy = () => router.push(`/academy?tuvan=${facultyId ?? ''}.${majorId ?? ''}`);

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: '#050314' }}>
      <AcademyBackground />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={backToAcademy} className="inline-flex items-center gap-2 min-h-[44px] px-3 rounded-xl border border-darkborder bg-darkcard text-text-primary hover:border-neon-violet/50 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-violet">
            <ArrowLeft className="w-4 h-4" /> Về Academy
          </button>
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-neon-violet shrink-0" /> Sơ đồ môn học
            </h1>
            {(faculty || major || combo) && (
              <p className="text-sm text-text-muted truncate">
                {faculty?.nameVi}{major ? ` · ${major.nameVi}` : ''}{combo ? ` · ${combo.nameVi}` : ''}
              </p>
            )}
          </div>
        </div>

        {/* Career outcome */}
        <div className="rounded-3xl border border-neon-violet/30 bg-gradient-to-br from-neon-violet/10 via-darkcard to-darkcard p-6">
          <div className="flex items-start gap-3">
            <span className="text-3xl">🎓</span>
            <div>
              <h2 className="text-lg font-bold text-text-primary flex items-center gap-2"><Briefcase className="w-5 h-5 text-neon-cyan" /> Học xong ra trường bạn làm được gì?</h2>
              <p className="text-text-secondary mt-1">{career.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {career.roles.map((r) => (
                  <span key={r} className="px-3 py-1 rounded-full bg-neon-cyan/10 text-neon-cyan text-sm border border-neon-cyan/30">{r}</span>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-text-muted flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" /> Bấm vào từng môn để xem môn đó cho bạn kỹ năng gì và đóng góp gì cho công việc sau này — học để <strong className="text-text-secondary">dùng được</strong>, không chỉ để qua môn.
          </p>
        </div>

        {/* THÁP môn học — nhìn tổng quan tầm quan trọng theo tầng */}
        {plan.length > 0 && (
          <div className="rounded-3xl border border-darkborder bg-darkcard p-5 sm:p-8">
            <h2 className="text-lg font-bold text-text-primary">🔺 Tháp môn học — tầm quan trọng theo tầng</h2>
            <p className="text-xs text-text-muted mt-1">Nền tảng ở <strong className="text-text-secondary">đáy</strong> (rộng nhất — học chắc, đỡ cả chương trình) → chuyên sâu &amp; đồ án ở <strong className="text-text-secondary">đỉnh</strong>. Bấm một môn để xem môn đó cho bạn gì &amp; đóng góp gì cho nghề.</p>
            <div className="mt-6 flex flex-col items-center gap-2.5" style={{ perspective: '1200px' }}>
              {phaseGroups.map((ph) => (
                <div key={ph.key} className={cn('w-full', ph.w)}>
                  <div
                    className="rounded-2xl px-3 py-3 text-center"
                    style={{
                      background: `linear-gradient(180deg, ${ph.color}2e, ${ph.color}0f)`,
                      border: `1px solid ${ph.color}66`,
                      boxShadow: `0 12px 26px -12px ${ph.color}70, inset 0 1px 0 ${ph.color}55`,
                    }}
                  >
                    <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: ph.color }}>{ph.label}</p>
                    <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                      {ph.codes.length === 0 ? <span className="text-[11px] text-text-muted">—</span> : ph.codes.map((code) => {
                        const c = coursesByCode.get(code.trim().toUpperCase());
                        const proj = isProject(code);
                        return (
                          <button
                            key={code}
                            onClick={() => setSelected(code)}
                            title={c ? pickLang(c.title, locale) : code}
                            className={cn('px-2 py-1 rounded-lg text-[11px] font-semibold border transition hover:brightness-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan',
                              proj ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-black/30 text-text-primary border-white/10 hover:border-white/25')}
                          >
                            {proj && '🚀 '}{code}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-center text-xs text-text-muted">Chi tiết đầy đủ theo từng kỳ ở ngay bên dưới ↓</p>
          </div>
        )}

        {plan.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-darkborder p-8 text-center text-text-secondary">
            Chưa có khung lộ trình cho lựa chọn này. Hãy chọn ngành hẹp cụ thể rồi quay lại.
          </div>
        ) : (
          <div className="relative pl-4 sm:pl-6">
            {/* spine */}
            <div className="absolute left-[7px] sm:left-[11px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-neon-cyan via-neon-violet to-neon-green rounded-full" aria-hidden />
            <div className="space-y-6">
              {plan.map(({ semester, codes }) => {
                const ph = phaseOf(semester);
                const real = [...codes.filter((c) => !isPlaceholderCode(c)), ...(semester === 6 ? projectCodes : [])];
                return (
                  <div key={semester} className="relative">
                    <span className="absolute -left-4 sm:-left-6 top-1.5 w-3.5 h-3.5 rounded-full ring-4 ring-[#050314]" style={{ background: ph.color }} aria-hidden />
                    <div className="mb-2">
                      <h3 className="text-lg font-bold text-text-primary flex flex-wrap items-center gap-2">
                        {semester === 6 ? 'Kỳ 6' : `Kỳ ${semester}`}
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold" style={{ background: `${ph.color}22`, color: ph.color, border: `1px solid ${ph.color}55` }}>{ph.label}</span>
                      </h3>
                      <p className="text-xs text-text-muted">{ph.desc}</p>
                    </div>
                    <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                      {real.map((code) => {
                        const c = coursesByCode.get(code.trim().toUpperCase());
                        const name = c ? pickLang(c.title, locale) : (subjectName(code) ?? code);
                        const proj = isProject(code);
                        return (
                          <button
                            key={code}
                            onClick={() => setSelected(code)}
                            className="text-left rounded-xl border bg-darkcard p-3 hover:bg-white/[0.04] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan"
                            style={{ borderColor: proj ? '#10b98166' : `${ph.color}44` }}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono text-xs font-semibold" style={{ color: proj ? '#34d399' : ph.color }}>{proj && '🚀 '}{code}</span>
                              {proj ? <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">PROJECT</span>
                                : c ? <span className="text-[10px] px-1.5 py-0.5 rounded bg-neon-green/10 text-neon-green border border-neon-green/30">có bài</span>
                                : <span className="text-[10px] text-text-muted">khung</span>}
                            </div>
                            <p className="text-sm text-text-primary mt-1 line-clamp-2">{name}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Drawer chi tiết môn */}
      {selected && (
        <div className="fixed inset-0 z-[120]">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)} aria-hidden />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-darkcard border-l border-darkborder shadow-2xl p-5 overflow-y-auto">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="font-mono text-xs font-semibold" style={{ color: phaseOf(selSemester).color }}>{selected} · {phaseOf(selSemester).label}</span>
                <h3 className="text-lg font-bold text-text-primary mt-1">{selName}</h3>
              </div>
              <button onClick={() => setSelected(null)} className="shrink-0 w-9 h-9 inline-flex items-center justify-center rounded-full hover:bg-white/10 text-text-muted"><X className="w-5 h-5" /></button>
            </div>

            <div className="mt-4 rounded-2xl border border-neon-violet/25 bg-neon-violet/5 p-4">
              <p className="text-sm font-semibold text-neon-violet flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> Đóng góp cho nghề nghiệp</p>
              <p className="text-sm text-text-secondary mt-1">{selHint}</p>
            </div>

            {selCourse?.shortDescription && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-text-primary flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-neon-cyan" /> Môn học về gì</p>
                <p className="text-sm text-text-secondary mt-1">{pickLang(selCourse.shortDescription, locale)}</p>
              </div>
            )}

            <div className="mt-5">
              {selCourse ? (
                <Link href={`/courses/${selCourse.slug}`} className="w-full inline-flex items-center justify-center gap-2 min-h-[48px] rounded-2xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold hover:opacity-90 transition">
                  <GraduationCap className="w-5 h-5" /> Vào học môn này <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <p className="text-center text-sm text-text-muted rounded-2xl border border-dashed border-darkborder py-3">Môn này Academy chưa dựng bài — sẽ bổ sung.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
