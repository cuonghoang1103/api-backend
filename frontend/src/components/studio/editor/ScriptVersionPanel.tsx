'use client';

// ScriptVersionPanel — the script's history, as a slide-over.
//
// Why history exists at all: the editor autosaves `script` every
// ~1.2 seconds, so "undo" in the textarea is the ONLY safety net
// during a session, and it is gone the moment the page reloads.
// A version is an explicit snapshot that autosave never touches.
//
// Restoring is deliberately non-destructive: the server snapshots
// the current text (origin RESTORE) before overwriting, so the
// state you restored away from becomes the newest entry. That
// means a mis-click is always one more restore from being undone,
// and it is why this panel never asks "are you sure?" twice.

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
 Clock,
 FileText,
 History,
 RotateCcw,
 Trash2,
 X,
} from 'lucide-react';
import {
 useDeleteScriptVersion,
 useRestoreScriptVersion,
 useScriptVersions,
} from '@/hooks/useContentQueries';
import { contentApi } from '@/lib/api';
import { useStudioT, type StudioKey } from '@/lib/studio-i18n';
import type { ContentScriptVersion, ScriptVersionOrigin } from '@/types';

/** Origin → colour. Manual saves are the ones the user made on
 *  purpose, so they read as the "real" history; the automatic
 *  ones are dimmer. */
const ORIGIN_STYLE: Record<ScriptVersionOrigin, string> = {
 MANUAL: 'bg-studio-500/15 text-studio-300 ring-studio-500/30',
 TEMPLATE: 'bg-blue-500/15 text-blue-300 ring-blue-500/30',
 RESTORE: 'bg-purple-500/15 text-purple-300 ring-purple-500/30',
 AUTO: 'bg-slate-500/15 text-slate-300 ring-slate-500/30',
};

interface ScriptVersionPanelProps {
 open: boolean;
 onClose: () => void;
 projectId: number;
 /** Called after a successful restore so the editor can adopt
  *  the restored body without waiting for a refetch. */
 onRestored: (script: string) => void;
}

export default function ScriptVersionPanel({
 open,
 onClose,
 projectId,
 onRestored,
}: ScriptVersionPanelProps) {
 const { t, lang } = useStudioT();
 const { data: versions = [], isLoading } = useScriptVersions(open ? projectId : null);
 const restore = useRestoreScriptVersion();
 const removeVersion = useDeleteScriptVersion();

 const [previewing, setPreviewing] = useState<ContentScriptVersion | null>(null);
 const [busyId, setBusyId] = useState<number | null>(null);

 const fmtWhen = (iso: string) =>
 new Date(iso).toLocaleString(lang === 'vi' ? 'vi-VN' : 'en-GB', {
 day: '2-digit',
 month: 'short',
 hour: '2-digit',
 minute: '2-digit',
 });

 const handlePreview = async (v: ContentScriptVersion) => {
 setBusyId(v.id);
 try {
 const res = await contentApi.scriptVersions.get(projectId, v.id);
 setPreviewing(res.data.data);
 } finally {
 setBusyId(null);
 }
 };

 const handleRestore = async (v: ContentScriptVersion) => {
 if (!confirm(t('confirmRestoreVersion', { n: v.version }))) return;
 setBusyId(v.id);
 try {
 const res = await restore.mutateAsync({ projectId, versionId: v.id });
 const restored = res.data.data.project.script ?? '';
 onRestored(restored);
 setPreviewing(null);
 } finally {
 setBusyId(null);
 }
 };

 const handleDelete = async (v: ContentScriptVersion) => {
 if (!confirm(t('confirmDeleteVersion', { n: v.version }))) return;
 setBusyId(v.id);
 try {
 await removeVersion.mutateAsync({ projectId, versionId: v.id });
 if (previewing?.id === v.id) setPreviewing(null);
 } finally {
 setBusyId(null);
 }
 };

 return (
 <AnimatePresence>
 {open && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm"
 onClick={onClose}
 >
 <motion.aside
 initial={{ x: 40, opacity: 0 }}
 animate={{ x: 0, opacity: 1 }}
 exit={{ x: 40, opacity: 0 }}
 transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
 onClick={(e) => e.stopPropagation()}
 className="w-full max-w-md h-full flex flex-col bg-darkcard border-l border-studio-500/25 shadow-2xl"
 >
 {/* Header */}
 <div className="flex items-start gap-3 p-4 border-b border-darkborder">
 <div className="w-9 h-9 rounded-xl bg-studio-500/15 flex items-center justify-center shrink-0">
 <History className="w-4.5 h-4.5 text-studio-300" />
 </div>
 <div className="min-w-0 flex-1">
 <h2 className="font-heading text-sm font-bold text-text-primary">
 {t('versionHistory')}
 </h2>
 <p className="text-[11px] text-text-secondary mt-0.5 leading-snug">
 {t('versionHistorySub')}
 </p>
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

 {/* List */}
 <div className="flex-1 overflow-y-auto p-3">
 {isLoading ? (
 <p className="text-xs text-text-muted p-3">{t('loading')}</p>
 ) : versions.length === 0 ? (
 <div className="rounded-xl border border-dashed border-darkborder bg-bg-elevated/30 p-5 text-center">
 <FileText className="w-6 h-6 text-text-muted mx-auto mb-2" />
 <p className="text-xs text-text-muted italic">{t('noVersions')}</p>
 </div>
 ) : (
 <ul className="space-y-2">
 {versions.map((v) => {
 const originKey = `origin${v.origin}` as StudioKey;
 return (
 <li
 key={v.id}
 className="rounded-xl border border-darkborder bg-bg-elevated/40 p-3 hover:border-studio-500/30 transition-colors"
 >
 <div className="flex items-center gap-2 mb-1.5">
 <span className="font-heading text-sm font-bold text-studio-300">
 v{v.version}
 </span>
 <span
 className={`px-1.5 h-5 rounded-full text-[10px] font-semibold ring-1 inline-flex items-center ${
 ORIGIN_STYLE[v.origin] ?? ORIGIN_STYLE.MANUAL
 }`}
 >
 {t(originKey)}
 </span>
 <span className="flex-1" />
 <span className="inline-flex items-center gap-1 text-[10px] text-text-muted">
 <Clock className="w-2.5 h-2.5" />
 {fmtWhen(v.createdAt)}
 </span>
 </div>

 {v.label && (
 <p className="text-xs text-text-secondary mb-1.5 line-clamp-2">{v.label}</p>
 )}

 <div className="flex items-center gap-1.5">
 <span className="text-[10px] text-text-muted">
 {t('words', { n: v.wordCount })}
 </span>
 <span className="flex-1" />
 <button
 type="button"
 disabled={busyId === v.id}
 onClick={() => void handlePreview(v)}
 className="px-2 h-7 rounded-md text-[11px] font-semibold text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors disabled:opacity-40"
 >
 {t('preview')}
 </button>
 <button
 type="button"
 disabled={busyId === v.id}
 onClick={() => void handleRestore(v)}
 className="inline-flex items-center gap-1 px-2 h-7 rounded-md bg-studio-500/15 text-studio-300 text-[11px] font-semibold hover:bg-studio-500/25 transition-colors disabled:opacity-40"
 >
 <RotateCcw className="w-3 h-3" />
 {t('restore')}
 </button>
 <button
 type="button"
 disabled={busyId === v.id}
 onClick={() => void handleDelete(v)}
 className="p-1.5 rounded-md text-text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-40"
 aria-label={t('delete')}
 >
 <Trash2 className="w-3 h-3" />
 </button>
 </div>
 </li>
 );
 })}
 </ul>
 )}
 </div>

 {/* Inline preview — pushed up from the bottom so the list
     stays visible and the comparison is one glance. */}
 <AnimatePresence>
 {previewing && (
 <motion.div
 initial={{ height: 0, opacity: 0 }}
 animate={{ height: 'auto', opacity: 1 }}
 exit={{ height: 0, opacity: 0 }}
 className="border-t border-darkborder bg-bg-elevated/40 overflow-hidden shrink-0"
 >
 <div className="flex items-center gap-2 px-3 py-2 border-b border-darkborder">
 <FileText className="w-3.5 h-3.5 text-studio-300" />
 <p className="text-[11px] font-semibold text-text-primary flex-1">
 {t('previewVersion', { n: previewing.version })}
 </p>
 <button
 type="button"
 onClick={() => setPreviewing(null)}
 className="p-1 rounded text-text-muted hover:text-text-primary"
 aria-label={t('close')}
 >
 <X className="w-3.5 h-3.5" />
 </button>
 </div>
 <pre className="max-h-56 overflow-auto px-3 py-2 text-[11px] leading-relaxed text-text-secondary font-mono whitespace-pre-wrap">
 {previewing.script}
 </pre>
 </motion.div>
 )}
 </AnimatePresence>
 </motion.aside>
 </motion.div>
 )}
 </AnimatePresence>
 );
}
