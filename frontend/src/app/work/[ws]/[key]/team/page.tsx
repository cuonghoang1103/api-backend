'use client';

/** /work/<slug>/<KEY>/team — Team overview cho trưởng nhóm (UX-C): ai làm gì, tải, trễ, kẹt, review, họp, hồ sơ FPT, Q&A. */

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import ProjectHeader from '@/components/work/ProjectHeader';
import { useProject, useProjectRealtime } from '@/components/work/hooks';
import { EmptyState, PageLoading } from '@/components/work/ui';
import TeamOverview from '@/components/work/team/TeamOverview';
import { workError } from '@/lib/work-api';
import { wt } from '@/components/work/i18n';

function Inner() {
  const params = useParams<{ ws: string; key: string }>();
  const { pid, config, isLoading, error } = useProject(params.ws, params.key);
  useProjectRealtime(pid);
  if (isLoading) return <PageLoading />;
  if (error || !config || !pid) return <EmptyState title={wt('common.projectNotFound')} body={error ? workError(error) : undefined} />;
  return (
    <div className="flex h-full flex-col">
      <ProjectHeader config={config} title={wt('uxc.navTeam')} />
      {config.role === 'CLIENT' || config.clientView
        ? <EmptyState title={wt('pages.onlyTeam')} body={wt('uxc.teamOnly')} />
        : <TeamOverview config={config} />}
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={<PageLoading />}><Inner /></Suspense>;
}
