'use client';

// /creator/projects/[id] — thin wrapper that hands the
// id to the editor shell. Kept separate so we can later
// add page-level concerns (analytics, breadcrumb schema)
// without bloating the shell.

import { use } from 'react';
import ProjectEditorShell from '@/components/studio/editor/ProjectEditorShell';

interface PageProps {
 params: Promise<{ id: string }>;
}

export default function CreatorProjectEditorPage({ params }: PageProps) {
 const { id } = use(params);
 const projectId = parseInt(id, 10);
 if (!Number.isFinite(projectId) || projectId <= 0) {
 return (
 <div className="px-4 sm:px-6 lg:px-8 py-12 text-center">
 <h1 className="font-heading text-2xl font-bold text-text-primary">Invalid project id</h1>
 <p className="text-text-secondary text-sm mt-2">
 The link you followed doesn't point at a real project.
 </p>
 </div>
 );
 }
 return <ProjectEditorShell projectId={projectId} />;
}
