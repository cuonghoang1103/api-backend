'use client';

// AcademyBindingFields — "what is this video about, and how long
// should it be?"
//
// Shared by the Overview tab and the create modal so a project can
// arrive already bound instead of needing a second editing pass.
// Both surfaces render the identical field set; only the wrapper
// chrome differs (`compact` drops the section header and tightens
// the grid for the modal).
//
// ── Why the course/exam pickers write two fields ────────────────
// Selecting a course sets BOTH `courseSlug` (the stable key) and
// `courseTitle` (a display snapshot). The snapshot is what keeps a
// pipeline card readable after the course is renamed or unpublished
// — the alternative is a card that silently reads "—" one day
// because a row moved in a table nobody was thinking about.
//
// The exam list is filtered to the selected course when there is
// one. Unfiltered it is hundreds of rows across every subject,
// which is not a picker so much as a haystack.

import { useMemo } from 'react';
import { GraduationCap, Clock, Hash, Languages, Layers } from 'lucide-react';
import { useAcademyRefs } from '@/hooks/useContentQueries';
import { useStudioT } from '@/lib/studio-i18n';
import { CONTENT_TYPE_META } from '@/lib/studio-meta';
import type { ContentAcademyBinding, ContentType, ScriptLang } from '@/types';

export interface AcademyBindingFieldsProps {
 value: Partial<ContentAcademyBinding>;
 /** The project's content type — decides whether the exam picker
  *  is worth showing at all. */
 contentType: ContentType;
 onChange: (patch: Partial<ContentAcademyBinding>) => void;
 /** Tighter layout without the section header, for the modal. */
 compact?: boolean;
}

/** Target-duration presets, in minutes. Free numeric entry is
 *  still allowed; these just cover the shapes people actually
 *  record so the common case is one click. */
const DURATION_PRESETS = [1, 5, 10, 15, 20, 30, 45, 60];

export default function AcademyBindingFields({
 value,
 contentType,
 onChange,
 compact = false,
}: AcademyBindingFieldsProps) {
 const { t, lang } = useStudioT();

 // Only fetched when this panel is on screen. The catalogue is
 // cached for an hour (see useAcademyRefs), so opening the second
 // project in a session costs nothing.
 const { data: refs, isLoading } = useAcademyRefs();

 const courses = refs?.courses ?? [];

 // Exams for the bound course. With no course bound we show every
 // exam — the user may be doing an exam video without having
 // picked the course first.
 const exams = useMemo(() => {
 const all = refs?.exams ?? [];
 if (!value.courseSlug) return all;
 const course = courses.find((c) => c.slug === value.courseSlug);
 if (!course) return all;
 return all.filter((e) => e.courseId === course.id);
 }, [refs?.exams, courses, value.courseSlug]);

 const typeMeta = CONTENT_TYPE_META[contentType];
 // Exam binding is noise on a vlog; show it for the teaching
 // formats, and always when something is already bound (so an
 // existing value is never orphaned by a type change).
 const showExam = typeMeta.academic || value.examId != null;

 const targetMinutes = value.targetDurationSec
 ? Math.round(value.targetDurationSec / 60)
 : null;

 const setCourse = (slug: string) => {
 if (!slug) {
 onChange({ courseSlug: null, courseTitle: null });
 return;
 }
 const course = courses.find((c) => c.slug === slug);
 onChange({
 courseSlug: slug,
 courseTitle: course
 ? [course.courseCode, course.title].filter(Boolean).join(' · ')
 : null,
 });
 };

 const setExam = (raw: string) => {
 const id = raw ? parseInt(raw, 10) : NaN;
 if (!Number.isFinite(id)) {
 onChange({ examId: null, examTitle: null });
 return;
 }
 const exam = exams.find((e) => e.id === id);
 onChange({
 examId: id,
 examTitle: exam
 ? [exam.code, lang === 'vi' ? exam.titleVi : exam.titleEn].filter(Boolean).join(' · ')
 : null,
 });
 };

 const body = (
 <>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {/* Course */}
 <label className="block">
 <span className="block text-[11px] uppercase tracking-wider text-text-muted mb-1.5">
 {t('fieldCourse')}
 </span>
 <select
 value={value.courseSlug ?? ''}
 onChange={(e) => setCourse(e.target.value)}
 disabled={isLoading}
 className="w-full h-10 px-3 rounded-lg bg-bg-elevated/60 border border-darkborder text-sm text-text-primary focus:outline-none focus:border-studio-500/50 disabled:opacity-50"
 >
 <option value="">{isLoading ? t('loadingAcademyRefs') : t('fieldCoursePlaceholder')}</option>
 {courses.map((c) => (
 <option key={c.slug} value={c.slug}>
 {[c.courseCode, c.title].filter(Boolean).join(' · ')}
 </option>
 ))}
 </select>
 </label>

 {/* Exam */}
 {showExam && (
 <label className="block">
 <span className="block text-[11px] uppercase tracking-wider text-text-muted mb-1.5">
 {t('fieldExam')}
 </span>
 <select
 value={value.examId ?? ''}
 onChange={(e) => setExam(e.target.value)}
 disabled={isLoading}
 className="w-full h-10 px-3 rounded-lg bg-bg-elevated/60 border border-darkborder text-sm text-text-primary focus:outline-none focus:border-studio-500/50 disabled:opacity-50"
 >
 <option value="">{t('fieldExamPlaceholder')}</option>
 {exams.map((e) => (
 <option key={e.id} value={e.id}>
 {[e.kind, e.code, lang === 'vi' ? e.titleVi : e.titleEn]
 .filter(Boolean)
 .join(' · ')}
 </option>
 ))}
 </select>
 </label>
 )}

 {/* Chapter / lesson reference */}
 <label className="block">
 <span className="block text-[11px] uppercase tracking-wider text-text-muted mb-1.5">
 {t('fieldLessonRef')}
 </span>
 <input
 type="text"
 value={value.lessonRef ?? ''}
 onChange={(e) => onChange({ lessonRef: e.target.value || null })}
 placeholder={t('fieldLessonRefPlaceholder')}
 maxLength={255}
 className="w-full h-10 px-3 rounded-lg bg-bg-elevated/60 border border-darkborder text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-studio-500/50"
 />
 </label>

 {/* Series + episode share a row: an episode number without a
     series name means nothing, so they read as one control. */}
 <div className="grid grid-cols-[minmax(0,1fr)_84px] gap-2">
 <label className="block">
 <span className="block text-[11px] uppercase tracking-wider text-text-muted mb-1.5">
 <Layers className="w-3 h-3 inline mr-1 -mt-0.5" />
 {t('fieldSeries')}
 </span>
 <input
 type="text"
 value={value.seriesName ?? ''}
 onChange={(e) => onChange({ seriesName: e.target.value || null })}
 placeholder={t('fieldSeriesPlaceholder')}
 maxLength={200}
 className="w-full h-10 px-3 rounded-lg bg-bg-elevated/60 border border-darkborder text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-studio-500/50"
 />
 </label>
 <label className="block">
 <span className="block text-[11px] uppercase tracking-wider text-text-muted mb-1.5">
 <Hash className="w-3 h-3 inline mr-1 -mt-0.5" />
 {t('fieldEpisode')}
 </span>
 <input
 type="number"
 min={1}
 value={value.episodeNumber ?? ''}
 onChange={(e) =>
 onChange({ episodeNumber: e.target.value ? Number(e.target.value) : null })
 }
 className="w-full h-10 px-3 rounded-lg bg-bg-elevated/60 border border-darkborder text-sm text-text-primary focus:outline-none focus:border-studio-500/50"
 />
 </label>
 </div>
 </div>

 {/* Target duration */}
 <div className="mt-3">
 <span className="block text-[11px] uppercase tracking-wider text-text-muted mb-1.5">
 <Clock className="w-3 h-3 inline mr-1 -mt-0.5" />
 {t('fieldTargetDuration')}
 </span>
 <div className="flex flex-wrap items-center gap-1.5">
 {DURATION_PRESETS.map((m) => {
 const active = targetMinutes === m;
 return (
 <button
 key={m}
 type="button"
 onClick={() => onChange({ targetDurationSec: active ? null : m * 60 })}
 className={`h-8 px-2.5 rounded-lg text-xs font-semibold transition-colors ${
 active
 ? 'bg-studio-500/20 text-studio-200 ring-1 ring-studio-500/40'
 : 'bg-bg-elevated/60 text-text-muted hover:text-text-primary'
 }`}
 >
 {m} {t('minutesShort')}
 </button>
 );
 })}
 <input
 type="number"
 min={1}
 value={targetMinutes ?? ''}
 onChange={(e) =>
 onChange({
 targetDurationSec: e.target.value ? Number(e.target.value) * 60 : null,
 })
 }
 placeholder="—"
 className="w-16 h-8 px-2 rounded-lg bg-bg-elevated/60 border border-darkborder text-xs text-text-primary text-center focus:outline-none focus:border-studio-500/50"
 />
 </div>
 <p className="text-[11px] text-text-muted mt-1.5">{t('fieldTargetDurationHint')}</p>
 </div>

 {/* Recording language */}
 <div className="mt-3">
 <span className="block text-[11px] uppercase tracking-wider text-text-muted mb-1.5">
 <Languages className="w-3 h-3 inline mr-1 -mt-0.5" />
 {t('fieldScriptLang')}
 </span>
 <div className="inline-flex rounded-lg bg-bg-elevated/60 p-0.5">
 {(['VI', 'EN'] as ScriptLang[]).map((l) => (
 <button
 key={l}
 type="button"
 onClick={() => onChange({ scriptLang: l })}
 className={`px-3 h-8 rounded-md text-xs font-semibold transition-colors ${
 (value.scriptLang ?? 'VI') === l
 ? 'bg-studio-500/20 text-studio-200'
 : 'text-text-muted hover:text-text-primary'
 }`}
 >
 {t(l === 'VI' ? 'vietnamese' : 'english')}
 </button>
 ))}
 </div>
 <p className="text-[11px] text-text-muted mt-1.5">{t('fieldScriptLangHint')}</p>
 </div>
 </>
 );

 if (compact) return <div className="space-y-1">{body}</div>;

 return (
 <section className="rounded-2xl border border-darkborder bg-darkcard/60 p-5">
 <div className="flex items-center gap-2 mb-1">
 <GraduationCap className="w-4 h-4 text-studio-400" />
 <h2 className="font-heading text-sm font-semibold text-text-primary uppercase tracking-wider">
 {t('academySection')}
 </h2>
 </div>
 <p className="text-[11px] text-text-muted mb-3 leading-relaxed">{t('academyHint')}</p>
 {body}
 </section>
 );
}
