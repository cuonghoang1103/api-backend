'use client';

/** /work/<slug>/<KEY>/changes/<n> — một yêu cầu thay đổi (đợt S3b, mô-đun changeRequests). */

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import ProjectHeader from '@/components/work/ProjectHeader';
import { useProject, useProjectRealtime } from '@/components/work/hooks';
import { EmptyState, PageLoading } from '@/components/work/ui';
import { ModuleOff, studioOn } from '@/components/work/studio/shared';
import ChangeDetail from '@/components/work/governance/ChangeDetail';
import { workError } from '@/lib/work-api';

function Inner() {
  const params = useParams<{ ws: string; key: string; num: string }>();
  const { pid, config, isLoading, error } = useProject(params.ws, params.key);
  useProjectRealtime(pid);
  if (isLoading) return <PageLoading />;
  if (error || !config || !pid) return <EmptyState title="Project not found" body={error ? workError(error) : undefined} />;
  return (
    <div className="flex h-full flex-col">
      <ProjectHeader config={config} title="Change request" />
      {!studioOn(config, 'changeRequests') ? <ModuleOff config={config} label="The Change requests module" />
        : !config.permissions.viewGovernance ? <EmptyState title="Only for the project team" body="Change requests are internal to the team working on this project." />
          : <ChangeDetail config={config} num={Number(params.num)} key={params.num} />}
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={<PageLoading />}><Inner /></Suspense>;
}
