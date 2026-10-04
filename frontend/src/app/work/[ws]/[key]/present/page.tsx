'use client';

/** /work/<slug>/<KEY>/present — chế độ thuyết trình (đợt S4, mô-đun reports): slide toàn màn hình từ dữ liệu dự án. */

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import ProjectHeader from '@/components/work/ProjectHeader';
import { useProject } from '@/components/work/hooks';
import { EmptyState, PageLoading } from '@/components/work/ui';
import { ModuleOff, studioOn } from '@/components/work/studio/shared';
import PresentView from '@/components/work/present/PresentView';
import { workError } from '@/lib/work-api';

function Inner() {
  const params = useParams<{ ws: string; key: string }>();
  const { pid, config, isLoading, error } = useProject(params.ws, params.key);
  if (isLoading) return <PageLoading />;
  if (error || !config || !pid) return <EmptyState title="Project not found" body={error ? workError(error) : undefined} />;
  return (
    <div className="flex h-full flex-col">
      <ProjectHeader config={config} title="Present" />
      {!studioOn(config, 'reports') ? <ModuleOff config={config} label="Client reports & present" />
        : !config.permissions.viewReports ? <EmptyState title="Only for the project team" body="Present mode is for the people working on this project." />
          : <PresentView config={config} />}
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={<PageLoading />}><Inner /></Suspense>;
}
