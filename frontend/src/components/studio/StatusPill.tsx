'use client';

// StatusPill — the single source of truth for rendering a
// content status as a pill. Used by the Dashboard, Pipeline
// (column header + cards), and Editor sidebar. Pairs with
// `CONTENT_STATUS_META` in `@/lib/studio-meta` so the
// colour/label is defined in exactly one place.

import type { ContentStatus } from '@/types';
import { CONTENT_STATUS_META } from '@/lib/studio-meta';

interface StatusPillProps {
 status: ContentStatus;
 size?: 'xs' | 'sm' | 'md';
 /** When true, drops the ring border (used in dense lists). */
 bare?: boolean;
 className?: string;
}

export default function StatusPill({
 status,
 size = 'sm',
 bare = false,
 className = '',
}: StatusPillProps) {
 const meta = CONTENT_STATUS_META[status];
 const sizeClass =
 size === 'xs'
 ? 'px-1.5 h-5 text-[10px]'
 : size === 'md'
 ? 'px-3 h-7 text-xs'
 : 'px-2 h-6 text-[11px]';

 // `bare` removes the ring/border to fit in dense rows
 // (e.g. the dashboard "Next to film" list).
 const colorClasses = bare
 ? meta.pillClass.replace(/ring-1\s+ring-[a-z]+-\d+\/\d+/g, '')
 : meta.pillClass;

 return (
 <span
 className={`inline-flex items-center gap-1 rounded-full font-semibold uppercase tracking-wider ${sizeClass} ${colorClasses} ${className}`}
 >
 <span
 className="w-1.5 h-1.5 rounded-full"
 style={{ background: meta.color }}
 />
 {meta.label}
 </span>
 );
}
