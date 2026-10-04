'use client';

/** /work/<slug>/workload — khối lượng việc nhiều dự án theo người × tuần (đợt S3a, chỉ đọc). */

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { workApi, workError } from '@/lib/work-api';
import { wk } from '@/components/work/hooks';
import { EmptyState, PageLoading } from '@/components/work/ui';
import { PageHeader } from '@/components/work/settings/shared';
import { Crumb, CrumbSep } from '@/components/work/ProjectHeader';
import WorkloadView from '@/components/work/portfolio/WorkloadView';

export default function WorkloadPage() {
  const params = useParams<{ ws: string }>();
  const slug = decodeURIComponent(params?.ws ?? '');
  const q = useQuery({ queryKey: wk.workspace(slug), queryFn: () => workApi.workspaceBySlug(slug), enabled: !!slug, staleTime: 30_000 });
  const ws = q.data;
  if (q.isLoading) return <PageLoading />;
  return (
    <div className="flex h-full flex-col">
      <PageHeader title={ws ? <><Crumb href={`/work/${slug}`} className="max-w-[220px] font-normal">{ws.name}</Crumb><CrumbSep className="mx-1.5" />Workload</> : 'Workload'} />
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        {!ws ? (
          <EmptyState title="Workspace not found" body={workError(q.error, 'This workspace does not exist or you no longer have access to it.')} />
        ) : ws.role === 'GUEST' ? (
          <EmptyState title="Workload is for workspace members" body="Guests (clients, teachers) only see the projects they are added to." />
        ) : (
          <WorkloadView ws={ws} />
        )}
      </div>
    </div>
  );
}
