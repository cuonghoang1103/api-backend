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
import { wt } from '@/components/work/i18n';

function Inner() {
  const params = useParams<{ ws: string; key: string; num: string }>();
  const { pid, config, isLoading, error } = useProject(params.ws, params.key);
  useProjectRealtime(pid);
  if (isLoading) return <PageLoading />;
  if (error || !config || !pid) return <EmptyState title={wt('common.projectNotFound')} body={error ? workError(error) : undefined} />;
  return (
    <div className="flex h-full flex-col">
      <ProjectHeader config={config} title={wt('portal.kCr')} />
      {!studioOn(config, 'changeRequests') ? <ModuleOff config={config} label={wt('studio.mod_changeRequests')} />
        : !config.permissions.viewGovernance ? <EmptyState title={wt('pages.onlyTeam')} body={wt('pages.crInternal')} />
          : <ChangeDetail config={config} num={Number(params.num)} key={params.num} />}
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={<PageLoading />}><Inner /></Suspense>;
}
