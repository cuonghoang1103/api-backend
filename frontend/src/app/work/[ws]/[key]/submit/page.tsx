'use client';

/** /work/<slug>/<KEY>/submit — Trang Nộp bài: gom deliverable + tải tất cả + bằng chứng đúng giờ. */

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import ProjectHeader from '@/components/work/ProjectHeader';
import { useProject, useProjectRealtime } from '@/components/work/hooks';
import { EmptyState, PageLoading } from '@/components/work/ui';
import Submissions from '@/components/work/submit/Submissions';
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
      <ProjectHeader config={config} title={wt('nav.n_Submit')} />
      {config.clientView
        ? <EmptyState title={wt('pages.onlyTeam')} />
        : <div className="min-h-0 flex-1 overflow-auto"><Submissions pid={pid} config={config} /></div>}
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={<PageLoading />}><Inner /></Suspense>;
}
