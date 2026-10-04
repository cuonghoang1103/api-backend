'use client';

/** /work/<slug>/<KEY>/desk — service desk & SLA (đợt S5a, mô-đun serviceDesk): hàng đợi, Problem, báo cáo SLA, cấu hình. */

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import ProjectHeader from '@/components/work/ProjectHeader';
import { useProject, useProjectRealtime } from '@/components/work/hooks';
import { EmptyState, PageLoading } from '@/components/work/ui';
import { ModuleOff, studioOn } from '@/components/work/studio/shared';
import DeskView from '@/components/work/desk/DeskView';
import { workError } from '@/lib/work-api';

function Inner() {
  const params = useParams<{ ws: string; key: string }>();
  const { pid, config, isLoading, error } = useProject(params.ws, params.key);
  useProjectRealtime(pid);
  if (isLoading) return <PageLoading />;
  if (error || !config || !pid) return <EmptyState title="Project not found" body={error ? workError(error) : undefined} />;
  return (
    <div className="flex h-full flex-col">
      <ProjectHeader config={config} title="Service desk" />
      {!studioOn(config, 'serviceDesk') ? <ModuleOff config={config} label="The service desk" />
        : !config.permissions.viewDesk ? <EmptyState title="Only for the project team" body="Clients send requests and follow them in the client portal." />
          : <DeskView config={config} />}
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={<PageLoading />}><Inner /></Suspense>;
}
