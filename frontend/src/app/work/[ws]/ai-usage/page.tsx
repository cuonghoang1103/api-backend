'use client';

/** /work/<slug>/ai-usage — AI trong không gian (CTW đợt 8B, 19/10/2026): ai dùng AI nối CT Work, chi phí, thay đổi AI đã làm. */

import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { workApi, workError } from '@/lib/work-api';
import { wk } from '@/components/work/hooks';
import { EmptyState, PageLoading } from '@/components/work/ui';
import { PageHeader } from '@/components/work/settings/shared';
import { Crumb, CrumbSep } from '@/components/work/ProjectHeader';
import AiUsageView from '@/components/work/aiUsage/AiUsageView';
import { wt } from '@/components/work/i18n';

export default function AiUsagePage() {
  return <Suspense fallback={<PageLoading />}><AiUsageInner /></Suspense>;
}

function AiUsageInner() {
  const params = useParams<{ ws: string }>();
  const slug = decodeURIComponent(params?.ws ?? '');
  const q = useQuery({ queryKey: wk.workspace(slug), queryFn: () => workApi.workspaceBySlug(slug), enabled: !!slug, staleTime: 30_000 });
  const ws = q.data;
  if (q.isLoading) return <PageLoading />;
  return (
    <div className="flex h-full flex-col">
      <PageHeader title={ws ? <><Crumb href={`/work/${slug}`} className="max-w-[220px] font-normal">{ws.name}</Crumb><CrumbSep className="mx-1.5" />{wt('aiu.title')}</> : wt('aiu.title')} />
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 sm:px-6">
        {!ws ? (
          <EmptyState title={wt('pages.wsNotFound')} body={workError(q.error, wt('pages.wsNotFoundBody'))} />
        ) : ws.role === 'GUEST' ? (
          <EmptyState title={wt('aiu.title')} body={wt('aiu.forbidden')} />
        ) : (
          <AiUsageView scope="workspace" id={ws.id} />
        )}
      </div>
    </div>
  );
}
