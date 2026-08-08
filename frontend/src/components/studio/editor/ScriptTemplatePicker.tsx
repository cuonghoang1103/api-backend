'use client';

// ScriptTemplatePicker — the "start from a professional skeleton"
// dialog for the Script tab.
//
// Two sources, one list:
//   • BUILT-IN templates from lib/studio-templates.ts. They ship
//     with the app, are bilingual, and are ordered by relevance to
//     the project's content type (a LECTURE project sees the
//     lecture skeleton first).
//   • MY templates from the database — whatever the user saved
//     from their own scripts.
//
// The body inserted is chosen by the project's RECORDING language
// (`scriptLang`), not the interface language: someone reading a
// Vietnamese UI while recording an English lecture must get the
// English skeleton. User-saved templates may have only one side
// filled in, so we fall back to `body` when `bodyEn` is absent.

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
 BookOpen,
 Check,
 Clock,
 FileText,
 Search,
 Sparkles,
 Star,
 Trash2,
 X,
} from 'lucide-react';
import {
 BUILTIN_SCRIPT_TEMPLATES,
 templatesForType,
 type BuiltinScriptTemplate,
} from '@/lib/studio-templates';
import { CONTENT_TYPE_META } from '@/lib/studio-meta';
import { pick, useStudioT } from '@/lib/studio-i18n';
import { useDeleteScriptTemplate, useScriptTemplates } from '@/hooks/useContentQueries';
import { contentApi } from '@/lib/api';
import type { ContentType, ScriptLang, ScriptTemplate } from '@/types';

/** One row in the merged list. `saved` carries the DB row so the
 *  delete button knows which id to remove; built-ins have none. */
interface PickerEntry {
 key: string;
 name: string;
 description: string;
 body: string;
 minutes: number | null;
 contentType: ContentType | null;
 useCount: number | null;
 saved?: ScriptTemplate;
}

interface ScriptTemplatePickerProps {
 open: boolean;
 onClose: () => void;
 /** The project's type — drives built-in ordering. */
 projectType: ContentType;
 /** The language the video is RECORDED in. */
 scriptLang: ScriptLang;
 /** True when the script already has content, so we can warn that
  *  applying replaces it (after snapshotting). */
 hasExistingScript: boolean;
 onApply: (body: string, templateName: string) => void;
}

export default function ScriptTemplatePicker({
 open,
 onClose,
 projectType,
 scriptLang,
 hasExistingScript,
 onApply,
}: ScriptTemplatePickerProps) {
 const { t, lang } = useStudioT();
 const [tab, setTab] = useState<'builtin' | 'mine'>('builtin');
 const [query, setQuery] = useState('');
 const [previewKey, setPreviewKey] = useState<string | null>(null);

 const { data: savedTemplates = [] } = useScriptTemplates();
 const deleteTemplate = useDeleteScriptTemplate();

 // Which side of each bilingual pair to insert. Note this follows
 // the RECORDING language, not `lang` (the UI language).
 const bodyLang: 'vi' | 'en' = scriptLang === 'EN' ? 'en' : 'vi';

 const builtinEntries: PickerEntry[] = useMemo(() => {
 const ordered: BuiltinScriptTemplate[] = templatesForType(projectType);
 return ordered.map((tpl) => ({
 key: `builtin:${tpl.id}`,
 name: pick(tpl.name, lang),
 description: pick(tpl.description, lang),
 body: pick(tpl.body, bodyLang),
 minutes: tpl.minutes,
 contentType: tpl.contentType,
 useCount: null,
 }));
 }, [projectType, lang, bodyLang]);

 const savedEntries: PickerEntry[] = useMemo(
 () =>
 savedTemplates.map((tpl) => ({
 key: `saved:${tpl.id}`,
 // A user-saved template may only have the Vietnamese side
 // filled in; fall back rather than render an empty label.
 name: (lang === 'en' ? tpl.nameEn : tpl.name) || tpl.name,
 description: (lang === 'en' ? tpl.descriptionEn : tpl.description) || tpl.description || '',
 body: (bodyLang === 'en' ? tpl.bodyEn : tpl.body) || tpl.body,
 minutes: null,
 contentType: tpl.contentType,
 useCount: tpl.useCount,
 saved: tpl,
 })),
 [savedTemplates, lang, bodyLang],
 );

 const entries = tab === 'builtin' ? builtinEntries : savedEntries;

 const filtered = useMemo(() => {
 const q = query.trim().toLowerCase();
 if (!q) return entries;
 return entries.filter(
 (e) =>
 e.name.toLowerCase().includes(q) ||
 e.description.toLowerCase().includes(q) ||
 e.body.toLowerCase().includes(q),
 );
 }, [entries, query]);

 const preview = filtered.find((e) => e.key === previewKey) ?? filtered[0] ?? null;

 const handleApply = (entry: PickerEntry) => {
 if (hasExistingScript) {
 if (!confirm(t('confirmApplyTemplate', { name: entry.name }))) return;
 }
 // Best-effort usage counter — a failure here must never block
 // the apply the user actually asked for.
 if (entry.saved) {
 void contentApi.scriptTemplates.markUsed(entry.saved.id).catch(() => {});
 }
 onApply(entry.body, entry.name);
 onClose();
 };

 const handleDelete = async (entry: PickerEntry) => {
 if (!entry.saved) return;
 if (!confirm(t('confirmDeleteTemplate', { name: entry.name }))) return;
 await deleteTemplate.mutateAsync(entry.saved.id);
 if (previewKey === entry.key) setPreviewKey(null);
 };

 return (
 <AnimatePresence>
 {open && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm"
 onClick={onClose}
 >
 <motion.div
 initial={{ opacity: 0, scale: 0.97, y: 10 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.97, y: 10 }}
 transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
 onClick={(e) => e.stopPropagation()}
 className="w-full max-w-5xl max-h-[90dvh] flex flex-col rounded-2xl border border-studio-500/25 bg-darkcard shadow-2xl overflow-hidden"
 >
 {/* Header */}
 <div className="flex items-start gap-3 p-4 sm:p-5 border-b border-darkborder">
 <div className="w-10 h-10 rounded-xl bg-studio-500/15 flex items-center justify-center shrink-0">
 <BookOpen className="w-5 h-5 text-studio-300" />
 </div>
 <div className="min-w-0 flex-1">
 <h2 className="font-heading text-base sm:text-lg font-bold text-text-primary">
 {t('templatesTitle')}
 </h2>
 <p className="text-xs text-text-secondary mt-0.5">{t('templatesSubtitle')}</p>
 </div>
 <button
 type="button"
 onClick={onClose}
 className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
 aria-label={t('close')}
 >
 <X className="w-4 h-4" />
 </button>
 </div>

 {/* Tabs + search */}
 <div className="flex flex-wrap items-center gap-2 px-4 sm:px-5 py-3 border-b border-darkborder">
 <div className="inline-flex rounded-lg bg-bg-elevated/60 p-0.5">
 {(['builtin', 'mine'] as const).map((id) => (
 <button
 key={id}
 type="button"
 onClick={() => {
 setTab(id);
 setPreviewKey(null);
 }}
 className={`inline-flex items-center gap-1.5 px-3 h-8 rounded-md text-xs font-semibold transition-colors ${
 tab === id
 ? 'bg-studio-500/20 text-studio-200'
 : 'text-text-muted hover:text-text-primary'
 }`}
 >
 {id === 'builtin' ? <Sparkles className="w-3.5 h-3.5" /> : <Star className="w-3.5 h-3.5" />}
 {t(id === 'builtin' ? 'templatesBuiltin' : 'templatesMine')}
 <span className="text-[10px] opacity-60">
 {id === 'builtin' ? BUILTIN_SCRIPT_TEMPLATES.length : savedTemplates.length}
 </span>
 </button>
 ))}
 </div>

 <div className="relative flex-1 min-w-[180px]">
 <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
 <input
 value={query}
 onChange={(e) => setQuery(e.target.value)}
 placeholder={t('search')}
 className="w-full h-8 pl-8 pr-3 rounded-lg bg-bg-elevated/60 border border-darkborder text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-studio-500/50"
 />
 </div>

 {/* Which language body will be inserted — worth stating,
     because it follows the recording language, not the UI. */}
 <span className="text-[10px] uppercase tracking-wider text-text-muted px-2 h-6 inline-flex items-center rounded-full bg-bg-elevated/60 border border-darkborder">
 {scriptLang === 'EN' ? t('english') : t('vietnamese')}
 </span>
 </div>

 {/* Body: list + preview */}
 <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
 {/* List */}
 <div className="overflow-y-auto border-b md:border-b-0 md:border-r border-darkborder max-h-[38vh] md:max-h-none">
 {filtered.length === 0 ? (
 <p className="p-5 text-xs text-text-muted italic">
 {tab === 'mine' ? t('templatesNoneMine') : t('listNoMatch')}
 </p>
 ) : (
 <ul className="p-2 space-y-1">
 {filtered.map((entry) => {
 const isActive = preview?.key === entry.key;
 const typeMeta = entry.contentType ? CONTENT_TYPE_META[entry.contentType] : null;
 return (
 <li key={entry.key}>
 <button
 type="button"
 onClick={() => setPreviewKey(entry.key)}
 className={`w-full text-left p-2.5 rounded-lg border transition-colors ${
 isActive
 ? 'border-studio-500/40 bg-studio-500/10'
 : 'border-transparent hover:bg-white/5'
 }`}
 >
 <div className="flex items-start gap-2">
 <span className="text-base leading-none mt-0.5">
 {typeMeta?.emoji ?? '📄'}
 </span>
 <div className="min-w-0 flex-1">
 <p className="text-sm font-medium text-text-primary truncate">
 {entry.name}
 </p>
 <p className="text-[11px] text-text-muted line-clamp-2 mt-0.5">
 {entry.description}
 </p>
 <div className="flex flex-wrap items-center gap-2 mt-1.5">
 <span className="text-[10px] text-text-muted">
 {typeMeta
 ? t('templateForType', { type: pick(typeMeta.label, lang) })
 : t('templateGeneric')}
 </span>
 {entry.minutes != null && (
 <span className="inline-flex items-center gap-0.5 text-[10px] text-studio-300">
 <Clock className="w-2.5 h-2.5" />
 {entry.minutes} {t('minutesShort')}
 </span>
 )}
 {entry.useCount != null && entry.useCount > 0 && (
 <span className="text-[10px] text-text-muted">
 {t('templateUsedN', { n: entry.useCount })}
 </span>
 )}
 </div>
 </div>
 </div>
 </button>
 </li>
 );
 })}
 </ul>
 )}
 </div>

 {/* Preview */}
 <div className="flex flex-col min-h-0">
 {preview ? (
 <>
 <div className="flex items-center gap-2 px-4 py-2.5 border-b border-darkborder">
 <FileText className="w-3.5 h-3.5 text-text-muted shrink-0" />
 <p className="text-xs font-semibold text-text-primary truncate flex-1">
 {preview.name}
 </p>
 {preview.saved && (
 <button
 type="button"
 onClick={() => void handleDelete(preview)}
 className="p-1.5 rounded-md text-text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
 title={t('delete')}
 >
 <Trash2 className="w-3.5 h-3.5" />
 </button>
 )}
 </div>
 <pre className="flex-1 overflow-auto px-4 py-3 text-[11px] leading-relaxed text-text-secondary font-mono whitespace-pre-wrap max-h-[42vh]">
 {preview.body}
 </pre>
 </>
 ) : (
 <div className="flex-1 flex items-center justify-center p-6 text-xs text-text-muted italic">
 {t('templatesNoneMine')}
 </div>
 )}
 </div>
 </div>

 {/* Footer */}
 <div className="flex flex-wrap items-center gap-2 p-3 sm:p-4 border-t border-darkborder bg-bg-elevated/30">
 {hasExistingScript && (
 <p className="text-[11px] text-amber-300/80 flex-1 min-w-[200px]">
 {t('applyTemplateReplaceWarn')}
 </p>
 )}
 <div className="flex-1" />
 <button
 type="button"
 onClick={onClose}
 className="px-3 h-9 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
 >
 {t('cancel')}
 </button>
 <button
 type="button"
 disabled={!preview}
 onClick={() => preview && handleApply(preview)}
 className="inline-flex items-center gap-1.5 px-4 h-9 rounded-lg bg-studio-gradient text-studio-950 font-semibold text-sm disabled:opacity-40"
 >
 <Check className="w-4 h-4" />
 {t('applyTemplate')}
 </button>
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>
 );
}
