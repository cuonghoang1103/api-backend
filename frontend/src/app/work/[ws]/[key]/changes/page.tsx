'use client';

/** /work/<slug>/<KEY>/changes — sổ yêu cầu thay đổi (CR) (đợt S3b, mô-đun changeRequests). */

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import ProjectHeader from '@/components/work/ProjectHeader';
import { useProject, useProjectRealtime } from '@/components/work/hooks';
import { EmptyState, PageLoading } from '@/components/work/ui';
import { ModuleOff, studioOn } from '@/components/work/studio/shared';
import ChangesView from '@/components/work/governance/ChangesView';
import { workError } from '@/lib/work-api';

function Inner() {
  const params = useParams<{ ws: string; key: string }>();
  const { pid, config, isLoading, error } = useProject(params.ws, params.key);
  useProjectRealtime(pid);
  if (isLoading) return <PageLoading />;
  if (error || !config || !pid) return <EmptyState title="Project not found" body={error ? workError(error) : undefined} />;
  return (
    <div className="flex h-full flex-col">
      <ProjectHeader config={config} title="Change requests" />
      {!studioOn(config, 'changeRequests') ? <ModuleOff config={config} label="The Change requests module" />
        : !config.permissions.viewGovernance ? <EmptyState title="Only for the project team" body="Change requests are internal to the team working on this project." />
          : <ChangesView config={config} />}
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={<PageLoading />}><Inner /></Suspense>;
}
