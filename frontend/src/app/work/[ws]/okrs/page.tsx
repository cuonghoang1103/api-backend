'use client';

/** /work/<slug>/okrs — OKR cấp không gian (đợt 7a): objective của không gian + objective các dự án người xem thấy. */

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { workApi, workError } from '@/lib/work-api';
import { wk } from '@/components/work/hooks';
import { EmptyState, PageLoading } from '@/components/work/ui';
import { PageHeader } from '@/components/work/settings/shared';
import { Crumb, CrumbSep } from '@/components/work/ProjectHeader';
import OkrBoard from '@/components/work/agile/OkrBoard';
import { wt } from '@/components/work/i18n';

export default function WorkspaceOkrsPage() {
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
      <PageHeader title={ws ? <><Crumb href={`/work/${slug}`} className="max-w-[220px] font-normal">{ws.name}</Crumb><CrumbSep className="mx-1.5" />{wt('agile.okrWsTitle')}</> : wt('agile.okrWsTitle')} />
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        <div className="mx-auto w-full max-w-[1400px] p-4">
          {!ws ? <EmptyState title={wt('pages.wsNotFound')} body={workError(q.error, wt('pages.wsNotFoundBody'))} />
            : ws.role === 'GUEST' ? <EmptyState title={wt('agile.okrWsTitle')} body={wt('pages.guests')} />
            : <OkrBoard scope={{ wid: ws.id }} />}
        </div>
      </div>
    </div>
  );
}
