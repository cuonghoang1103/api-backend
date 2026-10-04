'use client';

/** /work/<slug>/portfolio — danh mục dự án của không gian (đợt S3a, chỉ đọc). */

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { workApi, workError } from '@/lib/work-api';
import { wk } from '@/components/work/hooks';
import { EmptyState, PageLoading } from '@/components/work/ui';
import { PageHeader } from '@/components/work/settings/shared';
import { Crumb, CrumbSep } from '@/components/work/ProjectHeader';
import PortfolioView from '@/components/work/portfolio/PortfolioView';

export default function PortfolioPage() {
  const params = useParams<{ ws: string }>();
  const slug = decodeURIComponent(params?.ws ?? '');
  const q = useQuery({ queryKey: wk.workspace(slug), queryFn: () => workApi.workspaceBySlug(slug), enabled: !!slug, staleTime: 30_000 });
  const ws = q.data;
  if (q.isLoading) return <PageLoading />;
  return (
    <div className="flex h-full flex-col">
      <PageHeader title={ws ? <><Crumb href={`/work/${slug}`} className="max-w-[220px] font-normal">{ws.name}</Crumb><CrumbSep className="mx-1.5" />Portfolio</> : 'Portfolio'} />
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        {!ws ? (
          <EmptyState title="Workspace not found" body={workError(q.error, 'This workspace does not exist or you no longer have access to it.')} />
        ) : (
          <PortfolioView ws={ws} />
        )}
      </div>
    </div>
  );
}
