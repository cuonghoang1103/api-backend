'use client';

/** /work/<slug>/<KEY>/resources — thư viện link của dự án (Resources, 06/10/2026, mô-đun resources). */

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import ProjectHeader from '@/components/work/ProjectHeader';
import { useProject, useProjectRealtime } from '@/components/work/hooks';
import { EmptyState, PageLoading } from '@/components/work/ui';
import { ModuleOff, studioOn } from '@/components/work/studio/shared';
import ResourcesView from '@/components/work/resources/ResourcesView';
import { workError } from '@/lib/work-api';

function Inner() {
  const params = useParams<{ ws: string; key: string }>();
  const { pid, config, isLoading, error } = useProject(params.ws, params.key);
  useProjectRealtime(pid);
  if (isLoading) return <PageLoading />;
  if (error || !config || !pid) return <EmptyState title="Project not found" body={error ? workError(error) : undefined} />;
  return (
    <div className="flex h-full flex-col">
      <ProjectHeader config={config} title="Resources" />
      {!studioOn(config, 'resources') ? <ModuleOff config={config} label="The resource library" /> : <div className="min-h-0 flex-1 overflow-y-auto"><ResourcesView config={config} /></div>}
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={<PageLoading />}><Inner /></Suspense>;
}
