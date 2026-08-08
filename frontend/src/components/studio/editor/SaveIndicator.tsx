'use client';

// SaveIndicator — the small pill that shows whether the
// editor is idle / saving / saved / error. Lives in the
// editor topbar.

import { motion, AnimatePresence } from 'framer-motion';
import { Check, CircleAlert, Loader2, Pencil } from 'lucide-react';
import { useStudioT, type StudioKey } from '@/lib/studio-i18n';

export type SaveStatus = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';

interface SaveIndicatorProps {
 status: SaveStatus;
 /** Optional last-saved timestamp for the tooltip. */
 lastSavedAt?: Date | null;
}

export default function SaveIndicator({ status, lastSavedAt }: SaveIndicatorProps) {
 const { t, lang } = useStudioT();
 // Labels are kept short to fit the topbar. The full
 // meaning is in the title attribute below. The word
 // "Editing" was renamed to "Unsaved" because users
 // confused it with the *production-stage* pill
 // (Idea / Scripting / Filming / Editing / …) shown
 // right next to it.
 const config: Record<
 SaveStatus,
 { labelKey: StudioKey; className: string; icon: React.ComponentType<{ className?: string }> }
 > = {
 idle: { labelKey: 'saveReady', className: 'text-text-muted', icon: Pencil },
 dirty: { labelKey: 'unsaved', className: 'text-amber-300', icon: Pencil },
 saving: { labelKey: 'saving', className: 'text-blue-300', icon: Loader2 },
 saved: { labelKey: 'saved', className: 'text-emerald-300', icon: Check },
 error: { labelKey: 'saveFailed', className: 'text-red-300', icon: CircleAlert },
 };
 const { labelKey, className, icon: Icon } = config[status];
 const label = t(labelKey);

 // Tooltip on hover — clarifies what each state means.
 // Without this, users couldn't tell the dirty state
 // apart from the production stage pill.
 // The pill itself is one word; the tooltip carries the
 // meaning. Composed from the shared keys rather than five
 // more sentence-length entries in the dictionary.
 const tooltip: Record<SaveStatus, string> = {
 idle: t('saved'),
 dirty: t('unsaved'),
 saving: t('saving'),
 saved: lastSavedAt ? t('savedAt', { time: fmtTime(lastSavedAt, lang) }) : t('saved'),
 error: t('saveFailed'),
 };

 return (
 <AnimatePresence mode="wait">
 <motion.div
 key={status}
 initial={{ opacity: 0, y: -4 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: 4 }}
 transition={{ duration: 0.15 }}
 title={tooltip[status]}
 className={`inline-flex items-center gap-1.5 px-2 h-7 rounded-full text-xs font-medium ${className}`}
 >
 <Icon className={`w-3 h-3 ${status === 'saving' ? 'animate-spin' : ''}`} />
 {label}
 {status === 'saved' && lastSavedAt && (
 <span className="text-text-muted hidden sm:inline">
 · {fmtTime(lastSavedAt, lang)}
 </span>
 )}
 </motion.div>
 </AnimatePresence>
 );
}

function fmtTime(d: Date, lang: 'vi' | 'en'): string {
 return d.toLocaleTimeString(lang === 'vi' ? 'vi-VN' : 'en-GB', {
 hour: '2-digit',
 minute: '2-digit',
 });
}
