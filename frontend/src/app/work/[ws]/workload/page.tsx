'use client';

/** /work/<slug>/workload — khối lượng việc nhiều dự án theo người × tuần (đợt S3a, chỉ đọc). */

import { usePathname, useParams, useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { workApi, workError } from '@/lib/work-api';
import { wk } from '@/components/work/hooks';
import { EmptyState, PageLoading } from '@/components/work/ui';
import { PageHeader } from '@/components/work/settings/shared';
import { Crumb, CrumbSep } from '@/components/work/ProjectHeader';
import WorkloadView from '@/components/work/portfolio/WorkloadView';
import { WorkspaceAgentsDashboard } from '@/components/work/agents/PeopleVsAgents';
import { cn } from '@/lib/utils';
import { wt } from '@/components/work/i18n';

export default function WorkloadPage() {
  return <Suspense fallback={<PageLoading />}><WorkloadInner /></Suspense>;
}

function WorkloadInner() {
  const params = useParams<{ ws: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  // CTW-28 A15: tab "People vs Agents" (?tab=agents) cạnh lưới tải việc.
  const tab = search?.get('tab') === 'agents' ? 'agents' : 'load';
  const slug = decodeURIComponent(params?.ws ?? '');
  const q = useQuery({ queryKey: wk.workspace(slug), queryFn: () => workApi.workspaceBySlug(slug), enabled: !!slug, staleTime: 30_000 });
  const ws = q.data;
  if (q.isLoading) return <PageLoading />;
  return (
    <div className="flex h-full flex-col">
      <PageHeader title={ws ? <><Crumb href={`/work/${slug}`} className="max-w-[220px] font-normal">{ws.name}</Crumb><CrumbSep className="mx-1.5" />{wt('pages.workload')}</> : wt('pages.workload')} />
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        {!ws ? (
          <EmptyState title={wt('pages.wsNotFound')} body={workError(q.error, wt('pages.wsNotFoundBody'))} />
        ) : ws.role === 'GUEST' ? (
          <EmptyState title={wt('pages.workloadMembers')} body={wt('pages.guests')} />
        ) : (
          <>
            <div className="shrink-0 border-b border-[var(--w-border)] px-4" role="tablist" aria-label={wt('pages.workloadViews')}>
              {([['load', wt('pages.workload')], ['agents', wt('pages.peopleVsAgents')]] as const).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={tab === id}
                  onClick={() => router.replace(id === 'load' ? pathname! : `${pathname}?tab=agents`, { scroll: false })}
                  className={cn('-mb-px whitespace-nowrap border-b-2 px-2.5 py-2.5 text-[13px] font-medium', tab === id ? 'border-[var(--w-accent)] text-[var(--w-text)]' : 'border-transparent text-[var(--w-text-2)] hover:text-[var(--w-text)]')}
                >
                  {label}
                </button>
              ))}
            </div>
            {tab === 'agents' ? <WorkspaceAgentsDashboard ws={ws} /> : <WorkloadView ws={ws} />}
          </>
        )}
      </div>
    </div>
  );
}
