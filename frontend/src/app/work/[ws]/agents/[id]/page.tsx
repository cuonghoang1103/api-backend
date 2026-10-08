'use client';

/** /work/<slug>/agents/<id> — một AI agent: token, webhook, hộp thư, tạm dừng/retire (CTW-28 A14). */

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { workApi, workError } from '@/lib/work-api';
import { wk } from '@/components/work/hooks';
import { EmptyState, PageLoading } from '@/components/work/ui';
import { PageHeader } from '@/components/work/settings/shared';
import { Crumb, CrumbSep } from '@/components/work/ProjectHeader';
import AgentDetail from '@/components/work/agents/AgentDetail';

export default function AgentPage() {
  const params = useParams<{ ws: string; id: string }>();
  const slug = decodeURIComponent(params?.ws ?? '');
  const agentId = Number(params?.id);
  const q = useQuery({ queryKey: wk.workspace(slug), queryFn: () => workApi.workspaceBySlug(slug), enabled: !!slug, staleTime: 30_000 });
  const ws = q.data;
  if (q.isLoading) return <PageLoading />;
  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title={ws ? (
          <>
            <Crumb href={`/work/${slug}`} className="max-w-[200px] font-normal max-sm:!hidden">{ws.name}</Crumb>
            <CrumbSep className="mx-1.5 max-sm:!hidden" />
            <Crumb href={`/work/${slug}/agents`} className="font-normal">AI agents</Crumb>
          </>
        ) : 'AI agent'}
      />
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        {!ws ? (
          <EmptyState title="Workspace not found" body={workError(q.error, 'This workspace does not exist or you no longer have access to it.')} />
        ) : ws.role === 'GUEST' ? (
          <EmptyState title="AI agents are for workspace members" body="Guests (clients, teachers) only see the projects they are added to." />
        ) : !Number.isInteger(agentId) || agentId <= 0 ? (
          <EmptyState title="Agent not found" />
        ) : (
          <AgentDetail ws={ws} agentId={agentId} />
        )}
      </div>
    </div>
  );
}
