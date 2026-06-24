'use client';

// SaveIndicator — the small pill that shows whether the
// editor is idle / saving / saved / error. Lives in the
// editor topbar.

import { motion, AnimatePresence } from 'framer-motion';
import { Check, CircleAlert, Loader2, Pencil } from 'lucide-react';

export type SaveStatus = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';

interface SaveIndicatorProps {
 status: SaveStatus;
 /** Optional last-saved timestamp for the tooltip. */
 lastSavedAt?: Date | null;
}

export default function SaveIndicator({ status, lastSavedAt }: SaveIndicatorProps) {
 // Labels are kept short to fit the topbar. The full
 // meaning is in the title attribute below. The word
 // "Editing" was renamed to "Unsaved" because users
 // confused it with the *production-stage* pill
 // (Idea / Scripting / Filming / Editing / …) shown
 // right next to it.
 const config: Record<
 SaveStatus,
 { label: string; className: string; icon: React.ComponentType<{ className?: string }> }
 > = {
 idle: { label: 'Ready', className: 'text-text-muted', icon: Pencil },
 dirty: { label: 'Unsaved', className: 'text-amber-300', icon: Pencil },
 saving: { label: 'Saving…', className: 'text-blue-300', icon: Loader2 },
 saved: { label: 'Saved', className: 'text-emerald-300', icon: Check },
 error: { label: 'Save failed', className: 'text-red-300', icon: CircleAlert },
 };
 const { label, className, icon: Icon } = config[status];

 // Tooltip on hover — clarifies what each state means.
 // Without this, users couldn't tell the dirty state
 // apart from the production stage pill.
 const tooltip: Record<SaveStatus, string> = {
 idle: 'No unsaved changes — autosave is up to date.',
 dirty: 'You have unsaved changes. Autosave fires 1.2s after the last edit, or click “Save now”.',
 saving: 'Sending your changes to the server…',
 saved: lastSavedAt
 ? `All changes saved at ${fmtTime(lastSavedAt)}.`
 : 'All changes saved.',
 error: 'Could not save. Check your connection and try “Save now”.',
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
 · {fmtTime(lastSavedAt)}
 </span>
 )}
 </motion.div>
 </AnimatePresence>
 );
}

function fmtTime(d: Date): string {
 return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}
