'use client';

// KanbanColumn — one vertical lane in the pipeline.
// Owns its own droppable area + count + the editorial
// "What's next in this stage" microcopy so the user
// understands the work that lives in each lane.

import { ReactNode } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { CONTENT_STATUS_META } from '@/lib/studio-meta';
import { useStudioStore } from '@/store/studioStore';
import { cn } from '@/lib/utils';
import type { ContentStatus } from '@/types';

interface KanbanColumnProps {
 status: ContentStatus;
 count: number;
 children: ReactNode;
}

export default function KanbanColumn({ status, count, children }: KanbanColumnProps) {
 const { setNodeRef, isOver } = useDroppable({
 id: `column-${status}`,
 data: { type: 'column', status },
 });
 const meta = CONTENT_STATUS_META[status];
 const openCreateModal = useStudioStore((s) => s.openCreateModal);

 // New projects always start in the IDEA column, so
 // that's the only column that gets the "+" affordance.
 // For other columns the user drags from elsewhere, or
 // uses the topbar / dashboard button.
 const canAdd = status === 'IDEA';

 return (
 <div
 ref={setNodeRef}
 className={cn(
 'flex flex-col w-72 shrink-0 rounded-2xl border transition-colors',
 isOver
 ? 'border-studio-500/60 bg-studio-500/5'
 : 'border-darkborder bg-darkcard/40',
 )}
 >
 {/* Header strip — colored dot + status label + count */}
 <div className="px-3 py-2.5 border-b border-darkborder flex items-center justify-between">
 <div className="flex items-center gap-2">
 <span
 className="w-2 h-2 rounded-full"
 style={{ background: meta.color }}
 />
 <h3 className="font-heading text-sm font-semibold text-text-primary">
 {meta.label}
 </h3>
 </div>
 <div className="flex items-center gap-1.5">
 <span className="text-xs text-text-muted font-semibold">{count}</span>
 {canAdd && (
 <button
 type="button"
 onClick={() => openCreateModal()}
 aria-label={`Add project to ${meta.label}`}
 title={`Add project to ${meta.label}`}
 className="inline-flex items-center justify-center w-6 h-6 rounded-md text-text-muted hover:text-studio-300 hover:bg-studio-500/15 transition-colors"
 >
 <Plus className="w-3.5 h-3.5" />
 </button>
 )}
 </div>
 </div>

 {/* Drop zone — scroll if it overflows. Min-height so an
 empty column still shows a clear target. */}
 <div className="flex-1 p-2 space-y-2 overflow-y-auto min-h-[200px] max-h-[calc(100dvh-20rem)]">
 {children}
 {count === 0 && (
 <motion.p
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 className="text-[11px] text-text-muted italic text-center py-6 px-2"
 >
 Drop a card here to set status to{' '}
 <span style={{ color: meta.color }}>{meta.label}</span>
 </motion.p>
 )}
 </div>

 {/* Footer — small description of what lives in this stage */}
 <div className="px-3 py-2 border-t border-darkborder">
 <p className="text-[10px] text-text-muted leading-relaxed">{meta.description}</p>
 </div>
 </div>
 );
}
