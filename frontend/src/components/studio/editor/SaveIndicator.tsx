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
 const config: Record<
 SaveStatus,
 { label: string; className: string; icon: React.ComponentType<{ className?: string }> }
 > = {
 idle: { label: 'Ready', className: 'text-text-muted', icon: Pencil },
 dirty: { label: 'Editing…', className: 'text-amber-300', icon: Pencil },
 saving: { label: 'Saving…', className: 'text-blue-300', icon: Loader2 },
 saved: { label: 'Saved', className: 'text-emerald-300', icon: Check },
 error: { label: 'Save failed', className: 'text-red-300', icon: CircleAlert },
 };
 const { label, className, icon: Icon } = config[status];

 return (
 <AnimatePresence mode="wait">
 <motion.div
 key={status}
 initial={{ opacity: 0, y: -4 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: 4 }}
 transition={{ duration: 0.15 }}
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
