'use client';

/** /work/<slug>/teams/<id> — hàng đợi việc của một bộ phận + bàn giao đang chờ nó nhận. */

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { workApi, workError, workStudioApi } from '@/lib/work-api';
import { wk } from '@/components/work/hooks';
import { EmptyState, PageLoading } from '@/components/work/ui';
import { PageHeader } from '@/components/work/settings/shared';
import { Crumb, CrumbSep } from '@/components/work/ProjectHeader';
import TeamQueueView from '@/components/work/studio/TeamQueueView';
import { TeamChip } from '@/components/work/studio/shared';
import { useAuthStore } from '@/store/authStore';
import { wt } from '@/components/work/i18n';

export default function TeamQueuePage() {
  const params = useParams<{ ws: string; teamId: string }>();
  const slug = decodeURIComponent(params?.ws ?? '');
  const teamId = Number(params?.teamId);
  const meId = useAuthStore((s) => s.user?.id);
  const q = useQuery({ queryKey: wk.workspace(slug), queryFn: () => workApi.workspaceBySlug(slug), enabled: !!slug, staleTime: 30_000 });
  const ws = q.data;
  const team = useQuery({ queryKey: ['work', 'teams', ws?.id ?? 0, 'one', teamId], queryFn: () => workStudioApi.team(ws!.id, teamId), enabled: !!ws && Number.isInteger(teamId), staleTime: 30_000 });
  if (q.isLoading) return <PageLoading />;
  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title={ws ? (
          <>
            <Crumb href={`/work/${slug}`} className="max-w-[160px] font-normal max-md:!hidden">{ws.name}</Crumb>
            <CrumbSep className="mx-1.5 max-md:!hidden" />
            <Crumb href={`/work/${slug}/teams`} className="font-normal">{wt('studio.mod_teams')}</Crumb>
            <CrumbSep className="mx-1.5" />
            {team.data ? <span className="flex min-w-0 items-center gap-2"><TeamChip team={team.data} /><span className="truncate">{team.data.name}</span></span> : wt('studio.team')}
          </>
        ) : wt('studio.team')}
      />
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        {!ws || !Number.isInteger(teamId) ? (
          <EmptyState title={wt('studio.teamNotFound')} body={workError(q.error, wt('pages.wsNotFoundBody'))} />
        ) : (
          <TeamQueueView ws={ws} teamId={teamId} meId={meId} />
        )}
      </div>
    </div>
  );
}
