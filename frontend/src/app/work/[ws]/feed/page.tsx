'use client';

/**
 * /work/<slug>/feed — Bảng tin của không gian (21/10/2026): bài chung của không gian + bài các dự án người xem thấy.
 * `?post=<id>&comment=<id>` mở khung chi tiết (đường dẫn sâu của thông báo — mọi bài, kể cả bài dự án); `?tab=reports`
 * hàng chờ báo cáo cho quản trị. Khách cổng / agent: máy chủ không trả phạm vi nào ⇒ trang báo "chưa có bảng tin".
 */

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { workApi, workError } from '@/lib/work-api';
import { wk } from '@/components/work/hooks';
import { EmptyState, PageLoading } from '@/components/work/ui';
import { PageHeader } from '@/components/work/settings/shared';
import { Crumb, CrumbSep } from '@/components/work/ProjectHeader';
import FeedView from '@/components/work/feed/FeedView';
import { wt } from '@/components/work/i18n';

export default function WorkspaceFeedPage() {
  return <Suspense fallback={<PageLoading />}><Inner /></Suspense>;
}

function Inner() {
  const params = useParams<{ ws: string }>();
  const slug = decodeURIComponent(params?.ws ?? '');
  const q = useQuery({ queryKey: wk.workspace(slug), queryFn: () => workApi.workspaceBySlug(slug), enabled: !!slug, staleTime: 30_000 });
  const ws = q.data;
  if (q.isLoading) return <PageLoading />;
  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title={ws ? <><Crumb href={`/work/${slug}`} className="max-w-[220px] font-normal">{ws.name}</Crumb><CrumbSep className="mx-1.5" />{wt('feed.title')}</> : wt('feed.title')}
        sub={ws ? wt('feed.subWs', { name: ws.name }) : undefined}
      />
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden" data-testid="feed-scroll">
        {!ws ? <EmptyState title={wt('pages.wsNotFound')} body={workError(q.error, wt('pages.wsNotFoundBody'))} />
          : <FeedView mode="workspace" workspaceId={ws.id} />}
      </div>
    </div>
  );
}
