'use client';

/** /work/<slug>/<KEY>/stages — giai đoạn + cổng (lớp studio S1, mô-đun stages). */

import { useParams } from 'next/navigation';
import ProjectHeader from '@/components/work/ProjectHeader';
import { useProject, useProjectRealtime } from '@/components/work/hooks';
import { EmptyState, PageLoading } from '@/components/work/ui';
import StagesView from '@/components/work/studio/StagesView';
import { ModuleOff, studioOn } from '@/components/work/studio/shared';
import { workError } from '@/lib/work-api';
import { wt } from '@/components/work/i18n';

export default function StagesPage() {
  const params = useParams<{ ws: string; key: string }>();
  const { pid, config, isLoading, error } = useProject(params.ws, params.key);
  useProjectRealtime(pid);
  if (isLoading) return <PageLoading />;
  if (error || !config || !pid) return <EmptyState title={wt('common.projectNotFound')} body={error ? workError(error) : undefined} />;
  return (
    <div className="flex h-full flex-col">
      <ProjectHeader config={config} title={wt('pf.stage')} />
      <div className="min-h-0 flex-1">
        {studioOn(config, 'stages') ? <StagesView config={config} /> : <ModuleOff config={config} label={wt('studio.mod_stages')} />}
      </div>
    </div>
  );
}
