'use client';

/** /work/<slug>/<KEY>/feed — Bảng tin của dự án (21/10/2026). Vai CLIENT không bao giờ thấy (máy chủ không trả phạm vi). */

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import ProjectHeader from '@/components/work/ProjectHeader';
import { useProject } from '@/components/work/hooks';
import { EmptyState, PageLoading } from '@/components/work/ui';
import FeedView from '@/components/work/feed/FeedView';
import { workError } from '@/lib/work-api';
import { wt } from '@/components/work/i18n';

function Inner() {
  const params = useParams<{ ws: string; key: string }>();
  const { pid, config, isLoading, error } = useProject(params.ws, params.key);
  if (isLoading) return <PageLoading />;
  if (error || !config || !pid) return <EmptyState title={wt('common.projectNotFound')} body={error ? workError(error) : undefined} />;
  return (
    <div className="flex h-full flex-col">
      <ProjectHeader config={config} title={wt('feed.title')} />
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden" data-testid="feed-scroll">
        <FeedView mode="project" workspaceId={config.workspace.id} projectId={pid} />
      </div>
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={<PageLoading />}><Inner /></Suspense>;
}
