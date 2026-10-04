'use client';

/** /work/<slug>/<KEY>/finance — tài chính dự án (đợt S4, mô-đun finance): timesheet, ngân sách vs thực tế, mốc thanh toán. */

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import ProjectHeader from '@/components/work/ProjectHeader';
import { useProject, useProjectRealtime } from '@/components/work/hooks';
import { EmptyState, PageLoading } from '@/components/work/ui';
import { ModuleOff, studioOn } from '@/components/work/studio/shared';
import FinanceView from '@/components/work/finance/FinanceView';
import { workError } from '@/lib/work-api';

function Inner() {
  const params = useParams<{ ws: string; key: string }>();
  const { pid, config, isLoading, error } = useProject(params.ws, params.key);
  useProjectRealtime(pid);
  if (isLoading) return <PageLoading />;
  if (error || !config || !pid) return <EmptyState title="Project not found" body={error ? workError(error) : undefined} />;
  return (
    <div className="flex h-full flex-col">
      <ProjectHeader config={config} title="Finance" />
      {!studioOn(config, 'finance') ? <ModuleOff config={config} label="Finance" />
        : !config.permissions.viewFinance ? <EmptyState title="Only for the project team" body="Project finance is visible to project admins, and members see their own timesheet." />
          : <FinanceView config={config} />}
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={<PageLoading />}><Inner /></Suspense>;
}
