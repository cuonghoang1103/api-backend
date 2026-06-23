'use client';

// /creator/pipeline — Kanban board for moving projects
// across production stages. The DnD logic + status
// updates live in PipelineBoard so this page stays a
// thin layout wrapper.

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { KanbanSquare } from 'lucide-react';
import PipelineBoard from '@/components/studio/kanban/PipelineBoard';

function PipelineContent() {
 const search = useSearchParams();
 const focus = search.get('status');
 return (
 <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-[100rem] mx-auto">
 {/* Page header — collapses on mobile */}
 <div className="flex items-center justify-between mb-4">
 <div className="flex items-center gap-2.5">
 <div className="w-9 h-9 rounded-xl bg-studio-500/15 ring-1 ring-studio-500/30 flex items-center justify-center">
 <KanbanSquare className="w-5 h-5 text-studio-400" />
 </div>
 <div>
 <h1 className="font-heading text-2xl font-bold text-text-primary">
 Pipeline
 </h1>
 <p className="text-xs text-text-muted">
 {focus
 ? `Focusing on ${focus.toLowerCase()} — drag cards across to update status.`
 : 'Drag a card across the columns to update its status.'}
 </p>
 </div>
 </div>
 </div>

 <PipelineBoard />
 </div>
 );
}

export default function PipelinePage() {
 // useSearchParams in a client component requires a
 // Suspense boundary (Next.js 14 requirement for static
 // rendering). The fallback just shows the same shell.
 return (
 <Suspense fallback={
 <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-[100rem] mx-auto">
 <div className="flex items-center gap-2.5 mb-4">
 <div className="w-9 h-9 rounded-xl bg-studio-500/15 ring-1 ring-studio-500/30 flex items-center justify-center">
 <KanbanSquare className="w-5 h-5 text-studio-400" />
 </div>
 <div>
 <h1 className="font-heading text-2xl font-bold text-text-primary">Pipeline</h1>
 <p className="text-xs text-text-muted">Loading…</p>
 </div>
 </div>
 </div>
 }>
 <PipelineContent />
 </Suspense>
 );
}
