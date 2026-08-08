'use client';

// SeriesGeneratorModal — "record this whole subject" in one dialog.
//
// Recording an Academy subject means one video per lesson. CEA201
// alone is ~50 lessons; creating those one at a time through the
// New-project modal is fifty rounds of retyping a title that is
// already in the database.
//
// So this reads the outline that already exists — a course's
// sections → lessons, or a project's milestones — and mints one
// ContentProject per selected item, pre-bound to the source, with
// continuous episode numbers and (optionally) a script skeleton
// already in place.
//
// ── Two deliberate choices ──────────────────────────────────────
// 1. Titles are taken VERBATIM from the source. A generated title
//    that paraphrases the lesson would drift the moment the course
//    is edited, and the whole point is that these two lists stay
//    recognisably the same list.
// 2. Quizzes are hidden by default but not removed. A quiz
//    walkthrough is a legitimate video; it just isn't what you
//    want selected when you tick "all".

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
 CheckCircle2,
 GraduationCap,
 Layers,
 Loader2,
 Sparkles,
 Wand2,
 X,
} from 'lucide-react';
import {
 useAcademyRefs,
 useBulkCreateProjects,
 useOutline,
} from '@/hooks/useContentQueries';
import { pick, useStudioT } from '@/lib/studio-i18n';
import { CONTENT_TYPE_META, TYPE_ORDER } from '@/lib/studio-meta';
import { BUILTIN_SCRIPT_TEMPLATES } from '@/lib/studio-templates';
import type { BulkCreateResult, ContentType, ScriptLang } from '@/types';

interface SeriesGeneratorModalProps {
 open: boolean;
 onClose: () => void;
}

type SourceKind = 'course' | 'project';

export default function SeriesGeneratorModal({ open, onClose }: SeriesGeneratorModalProps) {
 const { t, lang } = useStudioT();
 const router = useRouter();

 const [sourceKind, setSourceKind] = useState<SourceKind>('course');
 const [courseSlug, setCourseSlug] = useState('');
 const [projectSlug, setProjectSlug] = useState('');
 const [hideQuiz, setHideQuiz] = useState(true);
 const [chosen, setChosen] = useState<Set<string>>(new Set());

 const [type, setType] = useState<ContentType>('LECTURE');
 const [seriesName, setSeriesName] = useState('');
 const [minutes, setMinutes] = useState<number | ''>(15);
 const [scriptLang, setScriptLang] = useState<ScriptLang>('VI');
 const [templateId, setTemplateId] = useState<string>('lecture-standard');
 const [result, setResult] = useState<BulkCreateResult | null>(null);

 const { data: refs } = useAcademyRefs(open);
 const bulkCreate = useBulkCreateProjects();

 const outlineParams = useMemo(() => {
 if (sourceKind === 'course' && courseSlug) return { courseSlug };
 if (sourceKind === 'project' && projectSlug.trim()) return { projectSlug: projectSlug.trim() };
 return null;
 }, [sourceKind, courseSlug, projectSlug]);

 const { data: outline, isFetching: loadingOutline } = useOutline(open ? outlineParams : null);

 // Reset everything on each open so a previous run's selection
 // never leaks into the next one.
 useEffect(() => {
 if (!open) return;
 setChosen(new Set());
 setResult(null);
 }, [open]);

 // A fresh outline pre-selects everything worth recording and
 // pre-fills the series name — the common case is "all of it".
 useEffect(() => {
 if (!outline) return;
 setSeriesName(outline.suggestedSeries);
 setChosen(
 new Set(
 outline.items.filter((i) => i.kind !== 'QUIZ').map((i) => i.key),
 ),
 );
 }, [outline]);

 const visibleItems = useMemo(() => {
 if (!outline) return [];
 return hideQuiz ? outline.items.filter((i) => i.kind !== 'QUIZ') : outline.items;
 }, [outline, hideQuiz]);

 const titleOf = (item: { titleVi: string; titleEn: string }) =>
 scriptLang === 'EN' ? item.titleEn : item.titleVi;
 const groupOf = (item: { groupVi: string; groupEn: string }) =>
 scriptLang === 'EN' ? item.groupEn : item.groupVi;

 const selectedItems = visibleItems.filter((i) => chosen.has(i.key));

 const template = BUILTIN_SCRIPT_TEMPLATES.find((tpl) => tpl.id === templateId);

 const toggle = (key: string) =>
 setChosen((prev) => {
 const next = new Set(prev);
 if (next.has(key)) next.delete(key);
 else next.add(key);
 return next;
 });

 const handleCreate = async () => {
 if (selectedItems.length === 0 || !outline) return;
 const course = refs?.courses.find((c) => c.slug === outline.sourceSlug);

 const res = await bulkCreate.mutateAsync({
 items: selectedItems.map((i) => ({
 title: titleOf(i),
 lessonRef: groupOf(i),
 episodeNumber: i.ordinal,
 })),
 type,
 status: 'IDEA',
 seriesName: seriesName.trim() || null,
 courseSlug: outline.sourceType === 'course' ? outline.sourceSlug : null,
 courseTitle:
 outline.sourceType === 'course'
 ? [course?.courseCode, scriptLang === 'EN' ? outline.sourceTitleEn : outline.sourceTitleVi]
 .filter(Boolean)
 .join(' · ')
 : null,
 projectSlug: outline.sourceType === 'project' ? outline.sourceSlug : null,
 targetDurationSec: typeof minutes === 'number' && minutes > 0 ? minutes * 60 : null,
 scriptLang,
 // Skeleton in the RECORDING language, matching what the
 // Script tab would have inserted by hand.
 scriptTemplate: template ? pick(template.body, scriptLang === 'EN' ? 'en' : 'vi') : null,
 });
 setResult(res.data.data);
 };

 const close = () => {
 // Refresh whatever list is underneath so the new projects appear
 // without the user having to reload.
 if (result?.created.length) router.refresh();
 onClose();
 };

 return (
 <AnimatePresence>
 {open && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm"
 onClick={close}
 >
 <motion.div
 initial={{ opacity: 0, scale: 0.97, y: 10 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.97, y: 10 }}
 transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
 onClick={(e) => e.stopPropagation()}
 className="w-full max-w-4xl max-h-[92dvh] flex flex-col rounded-2xl border border-studio-500/25 bg-darkcard shadow-2xl overflow-hidden"
 >
 {/* Header */}
 <div className="flex items-start gap-3 p-4 sm:p-5 border-b border-darkborder">
 <div className="w-10 h-10 rounded-xl bg-studio-500/15 flex items-center justify-center shrink-0">
 <Wand2 className="w-5 h-5 text-studio-300" />
 </div>
 <div className="min-w-0 flex-1">
 <h2 className="font-heading text-base sm:text-lg font-bold text-text-primary">
 {t('seriesGenTitle')}
 </h2>
 <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
 {t('seriesGenSubtitle')}
 </p>
 </div>
 <button
 type="button"
 onClick={close}
 className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
 aria-label={t('close')}
 >
 <X className="w-4 h-4" />
 </button>
 </div>

 {/* Done state — replaces the form so the outcome is the
     only thing on screen. */}
 {result ? (
 <div className="flex-1 overflow-y-auto p-6 text-center">
 <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/15 ring-1 ring-emerald-500/30 mb-4">
 <CheckCircle2 className="w-7 h-7 text-emerald-400" />
 </div>
 <p className="text-lg font-heading font-bold text-text-primary">
 {t('seriesDoneCreated', { n: result.created.length })}
 </p>
 {result.skipped.length > 0 && (
 <p className="text-xs text-text-muted mt-1.5">
 {t('seriesDoneSkipped', { n: result.skipped.length })}
 </p>
 )}
 <ul className="mt-4 max-w-lg mx-auto text-left space-y-1 max-h-[40vh] overflow-y-auto">
 {result.created.map((c) => (
 <li
 key={c.id}
 className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-elevated/40 text-xs"
 >
 {c.episodeNumber != null && (
 <span className="text-studio-300 font-semibold tabular-nums shrink-0">
 {t('episodeShort', { n: c.episodeNumber })}
 </span>
 )}
 <span className="text-text-secondary truncate">{c.title}</span>
 </li>
 ))}
 </ul>
 <button
 type="button"
 onClick={close}
 className="mt-6 inline-flex items-center gap-1.5 px-4 h-10 rounded-xl bg-studio-gradient text-studio-950 font-semibold text-sm"
 >
 {t('close')}
 </button>
 </div>
 ) : (
 <>
 {/* Source picker */}
 <div className="p-4 sm:p-5 border-b border-darkborder space-y-3">
 <div className="flex flex-wrap items-center gap-2">
 <span className="text-[11px] uppercase tracking-wider text-text-muted w-16 shrink-0">
 {t('seriesSource')}
 </span>
 <div className="inline-flex rounded-lg bg-bg-elevated/60 p-0.5">
 {(['course', 'project'] as const).map((k) => (
 <button
 key={k}
 type="button"
 onClick={() => {
 setSourceKind(k);
 setChosen(new Set());
 }}
 className={`px-3 h-8 rounded-md text-xs font-semibold transition-colors ${
 sourceKind === k
 ? 'bg-studio-500/20 text-studio-200'
 : 'text-text-muted hover:text-text-primary'
 }`}
 >
 {t(k === 'course' ? 'seriesSourceCourse' : 'seriesSourceProject')}
 </button>
 ))}
 </div>

 {sourceKind === 'course' ? (
 <select
 value={courseSlug}
 onChange={(e) => {
 setCourseSlug(e.target.value);
 setChosen(new Set());
 }}
 className="flex-1 min-w-[220px] h-9 px-3 rounded-lg bg-bg-elevated/60 border border-darkborder text-sm text-text-primary focus:outline-none focus:border-studio-500/50"
 >
 <option value="">{t('seriesPickCourse')}</option>
 {(refs?.courses ?? []).map((c) => (
 <option key={c.slug} value={c.slug}>
 {[c.courseCode, c.title].filter(Boolean).join(' · ')}
 </option>
 ))}
 </select>
 ) : (
 <input
 value={projectSlug}
 onChange={(e) => {
 setProjectSlug(e.target.value);
 setChosen(new Set());
 }}
 placeholder={t('seriesPickProject')}
 className="flex-1 min-w-[220px] h-9 px-3 rounded-lg bg-bg-elevated/60 border border-darkborder text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-studio-500/50"
 />
 )}
 </div>
 </div>

 {/* Body: outline list + settings */}
 <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_260px]">
 {/* Outline */}
 <div className="overflow-y-auto border-b md:border-b-0 md:border-r border-darkborder max-h-[40vh] md:max-h-none">
 {loadingOutline ? (
 <p className="p-5 text-xs text-text-muted inline-flex items-center gap-2">
 <Loader2 className="w-3.5 h-3.5 animate-spin" />
 {t('seriesLoadingOutline')}
 </p>
 ) : !outline ? (
 <p className="p-5 text-xs text-text-muted italic">{t('seriesPickCourse')}</p>
 ) : visibleItems.length === 0 ? (
 <p className="p-5 text-xs text-text-muted italic">{t('seriesNoOutline')}</p>
 ) : (
 <>
 <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 border-b border-darkborder sticky top-0 bg-darkcard z-10">
 <span className="text-[11px] text-text-muted">
 {t('seriesItemsFound', { n: visibleItems.length })} ·{' '}
 <strong className="text-studio-300">
 {t('seriesSelected', { n: selectedItems.length })}
 </strong>
 </span>
 <span className="flex-1" />
 <button
 type="button"
 onClick={() => setChosen(new Set(visibleItems.map((i) => i.key)))}
 className="text-[11px] font-semibold text-studio-300 hover:text-studio-200"
 >
 {t('seriesSelectAll')}
 </button>
 <button
 type="button"
 onClick={() => setChosen(new Set())}
 className="text-[11px] font-semibold text-text-muted hover:text-text-primary"
 >
 {t('seriesSelectNone')}
 </button>
 <label className="inline-flex items-center gap-1 text-[11px] text-text-muted cursor-pointer">
 <input
 type="checkbox"
 checked={hideQuiz}
 onChange={(e) => setHideQuiz(e.target.checked)}
 className="accent-studio-500"
 />
 {t('seriesHideQuiz')}
 </label>
 </div>

 <ul className="p-2 space-y-0.5">
 {visibleItems.map((item, i) => {
 const prev = visibleItems[i - 1];
 const newGroup = !prev || groupOf(prev) !== groupOf(item);
 return (
 <li key={item.key}>
 {newGroup && (
 <div className="flex items-center gap-1.5 px-2 pt-3 pb-1 text-[10px] uppercase tracking-wider text-text-muted">
 <Layers className="w-3 h-3" />
 <span className="truncate">{groupOf(item)}</span>
 </div>
 )}
 <label className="flex items-start gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer">
 <input
 type="checkbox"
 checked={chosen.has(item.key)}
 onChange={() => toggle(item.key)}
 className="mt-0.5 accent-studio-500 shrink-0"
 />
 <span className="text-[11px] text-studio-300 tabular-nums shrink-0 w-8">
 {t('episodeShort', { n: item.ordinal })}
 </span>
 <span className="text-xs text-text-secondary min-w-0 flex-1">
 {titleOf(item)}
 </span>
 {item.kind === 'QUIZ' && (
 <span className="text-[9px] uppercase tracking-wider text-text-muted bg-bg-elevated/60 px-1.5 h-4 rounded inline-flex items-center shrink-0">
 quiz
 </span>
 )}
 </label>
 </li>
 );
 })}
 </ul>
 </>
 )}
 </div>

 {/* Settings */}
 <div className="overflow-y-auto p-4 space-y-3.5 max-h-[40vh] md:max-h-none">
 <p className="text-[11px] uppercase tracking-wider text-text-muted">
 {t('seriesOptions')}
 </p>

 <label className="block">
 <span className="block text-[11px] text-text-muted mb-1">{t('fieldSeries')}</span>
 <input
 value={seriesName}
 onChange={(e) => setSeriesName(e.target.value)}
 placeholder={t('fieldSeriesPlaceholder')}
 className="w-full h-9 px-2.5 rounded-lg bg-bg-elevated/60 border border-darkborder text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-studio-500/50"
 />
 </label>

 <label className="block">
 <span className="block text-[11px] text-text-muted mb-1">{t('fieldType')}</span>
 <select
 value={type}
 onChange={(e) => setType(e.target.value as ContentType)}
 className="w-full h-9 px-2.5 rounded-lg bg-bg-elevated/60 border border-darkborder text-xs text-text-primary focus:outline-none focus:border-studio-500/50"
 >
 {TYPE_ORDER.map((ct) => (
 <option key={ct} value={ct}>
 {CONTENT_TYPE_META[ct].emoji} {pick(CONTENT_TYPE_META[ct].label, lang)}
 </option>
 ))}
 </select>
 </label>

 <label className="block">
 <span className="block text-[11px] text-text-muted mb-1">
 {t('fieldTargetDuration')}
 </span>
 <div className="flex items-center gap-1.5">
 <input
 type="number"
 min={1}
 value={minutes}
 onChange={(e) => setMinutes(e.target.value ? Number(e.target.value) : '')}
 className="w-20 h-9 px-2.5 rounded-lg bg-bg-elevated/60 border border-darkborder text-xs text-text-primary focus:outline-none focus:border-studio-500/50"
 />
 <span className="text-[11px] text-text-muted">{t('minutesShort')}</span>
 </div>
 </label>

 <label className="block">
 <span className="block text-[11px] text-text-muted mb-1">
 {t('fieldScriptLang')}
 </span>
 <div className="inline-flex rounded-lg bg-bg-elevated/60 p-0.5 w-full">
 {(['VI', 'EN'] as ScriptLang[]).map((l) => (
 <button
 key={l}
 type="button"
 onClick={() => setScriptLang(l)}
 className={`flex-1 h-8 rounded-md text-xs font-semibold transition-colors ${
 scriptLang === l
 ? 'bg-studio-500/20 text-studio-200'
 : 'text-text-muted hover:text-text-primary'
 }`}
 >
 {t(l === 'VI' ? 'vietnamese' : 'english')}
 </button>
 ))}
 </div>
 </label>

 <label className="block">
 <span className="block text-[11px] text-text-muted mb-1">
 {t('seriesApplyTemplate')}
 </span>
 <select
 value={templateId}
 onChange={(e) => setTemplateId(e.target.value)}
 className="w-full h-9 px-2.5 rounded-lg bg-bg-elevated/60 border border-darkborder text-xs text-text-primary focus:outline-none focus:border-studio-500/50"
 >
 <option value="">{t('seriesNoTemplate')}</option>
 {BUILTIN_SCRIPT_TEMPLATES.map((tpl) => (
 <option key={tpl.id} value={tpl.id}>
 {pick(tpl.name, lang)}
 </option>
 ))}
 </select>
 <span className="block text-[10px] text-text-muted mt-1 leading-relaxed">
 {t('seriesApplyTemplateHint')}
 </span>
 </label>
 </div>
 </div>

 {/* Footer */}
 <div className="flex flex-wrap items-center gap-2 p-3 sm:p-4 border-t border-darkborder bg-bg-elevated/30">
 <p className="text-[11px] text-text-muted flex-1 min-w-[200px] inline-flex items-center gap-1.5">
 <Sparkles className="w-3 h-3 text-studio-400 shrink-0" />
 {t('seriesDedupeHint')}
 </p>
 <button
 type="button"
 onClick={close}
 className="px-3 h-9 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
 >
 {t('cancel')}
 </button>
 <button
 type="button"
 disabled={selectedItems.length === 0 || bulkCreate.isPending}
 onClick={() => void handleCreate()}
 className="inline-flex items-center gap-1.5 px-4 h-9 rounded-lg bg-studio-gradient text-studio-950 font-semibold text-sm disabled:opacity-40"
 >
 {bulkCreate.isPending ? (
 <>
 <Loader2 className="w-4 h-4 animate-spin" />
 {t('seriesCreating')}
 </>
 ) : (
 <>
 <GraduationCap className="w-4 h-4" />
 {t('seriesCreate', { n: selectedItems.length })}
 </>
 )}
 </button>
 </div>
 </>
 )}
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>
 );
}
