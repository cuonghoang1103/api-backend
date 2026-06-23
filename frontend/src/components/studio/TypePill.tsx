'use client';

// TypePill — same shape as StatusPill but for content
// type (Vlog / Affiliate / Code Review / etc). Used in
// cards and the editor sidebar.

import type { ContentType } from '@/types';
import { CONTENT_TYPE_META } from '@/lib/studio-meta';

interface TypePillProps {
 type: ContentType;
 size?: 'xs' | 'sm' | 'md';
 className?: string;
}

export default function TypePill({ type, size = 'sm', className = '' }: TypePillProps) {
 const meta = CONTENT_TYPE_META[type];
 const sizeClass =
 size === 'xs'
 ? 'px-1.5 h-5 text-[10px]'
 : size === 'md'
 ? 'px-3 h-7 text-xs'
 : 'px-2 h-6 text-[11px]';

 return (
 <span
 className={`inline-flex items-center gap-1 rounded-full font-semibold uppercase tracking-wider border border-darkborder bg-darkcard/60 text-text-secondary ${sizeClass} ${className}`}
 >
 <span className="text-[11px] leading-none">{meta.emoji}</span>
 {meta.label}
 </span>
 );
}
