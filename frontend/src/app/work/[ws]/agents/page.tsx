'use client';

/** /work/<slug>/agents — AI agent của không gian (CTW-28 A14). Chỉ thành viên (không phải khách) xem được. */

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { workApi, workError } from '@/lib/work-api';
import { useAuthStore } from '@/store/authStore';
import { wk } from '@/components/work/hooks';
import { EmptyState, PageLoading } from '@/components/work/ui';
import { PageHeader } from '@/components/work/settings/shared';
import { Crumb, CrumbSep } from '@/components/work/ProjectHeader';
import AgentsView from '@/components/work/agents/AgentsView';
import { wt } from '@/components/work/i18n';

export default function AgentsPage() {
  const params = useParams<{ ws: string }>();
  const slug = decodeURIComponent(params?.ws ?? '');
  const meId = useAuthStore((s) => s.user?.id);
  const q = useQuery({ queryKey: wk.workspace(slug), queryFn: () => workApi.workspaceBySlug(slug), enabled: !!slug, staleTime: 30_000 });
  const ws = q.data;
  if (q.isLoading) return <PageLoading />;
  return (
    <div className="flex h-full flex-col">
      <PageHeader title={ws ? <><Crumb href={`/work/${slug}`} className="max-w-[220px] font-normal">{ws.name}</Crumb><CrumbSep className="mx-1.5" />{wt('pages.aiAgents')}</> : wt('pages.aiAgents')} />
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        {!ws ? (
          <EmptyState title={wt('pages.wsNotFound')} body={workError(q.error, wt('pages.wsNotFoundBody'))} />
        ) : ws.role === 'GUEST' ? (
          <EmptyState title={wt('pages.agentsMembers')} body={wt('pages.guests')} />
        ) : (
          <AgentsView ws={ws} meId={meId} />
        )}
      </div>
    </div>
  );
}
