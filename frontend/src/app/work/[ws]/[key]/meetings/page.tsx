'use client';

/** /work/<slug>/<KEY>/meetings — cuộc họp của dự án (đợt S3b, mô-đun meetings). */

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import ProjectHeader from '@/components/work/ProjectHeader';
import { useProject, useProjectRealtime } from '@/components/work/hooks';
import { EmptyState, PageLoading } from '@/components/work/ui';
import { ModuleOff, studioOn } from '@/components/work/studio/shared';
import MeetingsView from '@/components/work/governance/MeetingsView';
import { workError } from '@/lib/work-api';

function Inner() {
  const params = useParams<{ ws: string; key: string }>();
  const { pid, config, isLoading, error } = useProject(params.ws, params.key);
  useProjectRealtime(pid);
  if (isLoading) return <PageLoading />;
  if (error || !config || !pid) return <EmptyState title="Project not found" body={error ? workError(error) : undefined} />;
  return (
    <div className="flex h-full flex-col">
      <ProjectHeader config={config} title="Meetings" />
      {!studioOn(config, 'meetings') ? <ModuleOff config={config} label="The Meetings module" />
        : !config.permissions.viewGovernance ? <EmptyState title="Only for the project team" body="Meeting minutes and action items are internal to the team. Meetings you are invited to appear in the client portal." />
          : <MeetingsView config={config} />}
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={<PageLoading />}><Inner /></Suspense>;
}
