'use client';

/** /work/<slug>/<KEY>/raid — sổ RAID (Risks · Assumptions · Issues · Dependencies) (đợt S3b, mô-đun raid). */

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import ProjectHeader from '@/components/work/ProjectHeader';
import { useProject, useProjectRealtime } from '@/components/work/hooks';
import { EmptyState, PageLoading } from '@/components/work/ui';
import { ModuleOff, studioOn } from '@/components/work/studio/shared';
import RaidView from '@/components/work/governance/RaidView';
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
      <ProjectHeader config={config} title={wt('studio.mod_raid')} />
      {!studioOn(config, 'raid') ? <ModuleOff config={config} label={wt('studio.mod_raid')} />
        : !config.permissions.viewGovernance ? <EmptyState title={wt('pages.onlyTeam')} body={wt('pages.raidInternal')} />
          : <RaidView config={config} />}
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={<PageLoading />}><Inner /></Suspense>;
}
