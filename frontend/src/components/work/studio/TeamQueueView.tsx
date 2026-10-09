'use client';

/**
 * Hàng đợi của MỘT bộ phận (S1): thẻ của bộ phận ở mọi dự án người xem vào
 * được và đang bật mô-đun teams. Lọc dự án / trạng thái / chưa người nhận;
 * trưởng bộ phận (hoặc người sửa được thẻ) giao người ngay trong hàng.
 * Cột phải: bàn giao đang chờ bộ phận này nhận + thành viên.
 */

import Link from 'next/link';
import { useState } from 'react';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CheckCircle2, Crown, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  userName, workError, workStudioApi, workStudioKeys, type TeamQueueItem, type WorkTeam, type WorkspaceDetail,
} from '@/lib/work-api';
import { EmptyState, PageLoading, PickerList, Popover, PriorityIcon, Spinner, UserAvatar, formatDate } from '../ui';
import { usePick } from '../fields';
import { Select } from '../settings/shared';
import HandoffCard from './HandoffCard';
import { useStudioInvalidate } from './shared';
import { wt } from '@/components/work/i18n';

const PAGE = 50;

function AssignCell({ ws, team, item, canAssign }: { ws: WorkspaceDetail; team: WorkTeam; item: TeamQueueItem; canAssign: boolean }) {
  const invalidate = useStudioInvalidate();
  const p = usePick();
  const assign = useMutation({
    mutationFn: (uid: number | null) => workStudioApi.assignFromQueue(ws.id, team.id, item.id, uid),
    onSuccess: (_r, uid) => { toast.success(uid ? `${item.key} assigned` : `${item.key} unassigned`); invalidate(); },
    onError: (err) => toast.error(workError(err, wt('studio.assignFailed'))),
  });
  if (!canAssign) {
    return (
      <span className="flex min-w-0 items-center gap-1.5 text-[13px]">
        <UserAvatar user={item.assignee} size={20} />
        <span className={cn('truncate', !item.assignee && 'text-[var(--w-text-3)]')}>{item.assignee ? userName(item.assignee) : wt('common.unassigned')}</span>
      </span>
    );
  }
  return (
    <>
      <button ref={p.ref} type="button" onClick={p.toggle} disabled={assign.isPending} className="flex h-7 min-w-0 max-w-full items-center gap-1.5 rounded-[6px] px-1.5 text-[13px] hover:bg-[var(--w-hover)]" aria-label={wt('studio.assignK', { k: item.key })}>
        {assign.isPending ? <Spinner size={14} /> : <UserAvatar user={item.assignee} size={20} />}
        <span className={cn('truncate', !item.assignee && 'text-[var(--w-accent-text)]')}>{item.assignee ? userName(item.assignee) : wt('studio.assignDots')}</span>
      </button>
      <Popover open={p.on} onClose={p.close} anchorRef={p.ref} width={240} align="end">
        <PickerList
          options={[{ value: 0, label: wt('common.unassigned'), icon: <UserAvatar user={null} size={16} /> }, ...team.members.map((m) => ({ value: m.id, label: userName(m), keywords: m.username, icon: <UserAvatar user={m} size={16} />, hint: m.teamRole === 'LEAD' ? wt('studio.lead') : undefined }))]}
          selected={[item.assignee?.id ?? 0]}
          onPick={(v) => { p.close(); assign.mutate(v || null); }}
          placeholder={wt('studio.assignToMember')}
        />
      </Popover>
    </>
  );
}

export default function TeamQueueView({ ws, teamId, meId }: { ws: WorkspaceDetail; teamId: number; meId?: number }) {
  const [projectId, setProjectId] = useState<number | ''>('');
  const [status, setStatus] = useState<'open' | 'done' | 'all'>('open');
  const [unassigned, setUnassigned] = useState(false);
  const q = useInfiniteQuery({
    queryKey: [...workStudioKeys.teamQueue(ws.id, teamId), projectId, status, unassigned],
    queryFn: ({ pageParam }) => workStudioApi.teamQueue(ws.id, teamId, { projectId: projectId || undefined, status, unassigned, limit: PAGE, offset: pageParam as number }),
    initialPageParam: 0,
    getNextPageParam: (last) => (last.offset + last.items.length < last.total ? last.offset + last.items.length : undefined),
  });
  const handoffs = useQuery({ queryKey: workStudioKeys.myHandoffs, queryFn: workStudioApi.myHandoffs, staleTime: 15_000 });

  if (q.isLoading) return <PageLoading rows={6} />;
  if (q.error || !q.data) return <EmptyState title={wt('studio.teamNotFound')} body={workError(q.error)} />;
  const first = q.data.pages[0];
  const team = first.team;
  const items = q.data.pages.flatMap((p) => p.items);
  const isAdmin = ws.role === 'OWNER' || ws.role === 'ADMIN';
  const canAssign = first.isLead || isAdmin;
  const incoming = (handoffs.data ?? []).filter((h) => h.toTeamId === team.id);
  const studioProjects = ws.projects.filter((p) => p.modules?.teams && !p.archivedAt);

  return (
    <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-6 px-4 py-5 md:px-6 lg:flex-row">
      <div className="min-w-0 flex-1">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Select aria-label={wt('common.project')} value={projectId} onChange={(e) => setProjectId(e.target.value ? Number(e.target.value) : '')} className="!h-8 !w-auto max-w-[220px]">
            <option value="">{wt('studio.allProjects')}</option>
            {studioProjects.map((p) => <option key={p.id} value={p.id}>{p.key} — {p.name}</option>)}
          </Select>
          <div className="inline-flex rounded-[7px] border border-[var(--w-border-strong)] p-0.5" role="radiogroup" aria-label={wt('common.status')}>
            {(['open', 'done', 'all'] as const).map((s) => (
              <button key={s} type="button" role="radio" aria-checked={status === s} onClick={() => setStatus(s)} className={cn('h-7 rounded-[5px] px-2.5 text-[12px] font-medium', status === s ? 'bg-[var(--w-active)] text-[var(--w-text)]' : 'text-[var(--w-text-2)] hover:text-[var(--w-text)]')}>
                {s === 'open' ? wt('common.open') : s === 'done' ? wt('common.done') : wt('common.all')}
              </button>
            ))}
          </div>
          <button type="button" aria-pressed={unassigned} className={cn('w-btn w-btn-sm', unassigned && 'w-btn-on')} onClick={() => setUnassigned((v) => !v)}>{wt('studio.unassignedOnly')}</button>
          <span className="ml-auto text-[12px] tabular text-[var(--w-text-3)]">{first.total} {first.total === 1 ? 'issue' : 'issues'}</span>
        </div>
        {canAssign && <p className="mb-3 text-[12px] text-[var(--w-text-3)]">{first.isLead ? wt('studio.youLead') : wt('studio.youManage')}{wt('studio.assignFromQueue')}</p>}
        {items.length ? (
          <ul className="w-card overflow-hidden">
            {items.map((it) => (
              <li key={it.id} className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-[var(--w-border)] px-4 py-2.5 last:border-b-0 md:flex-nowrap">
                <Link href={`/work/${ws.slug}/${it.projectKey}/issue/${it.number}`} className="flex min-w-0 flex-1 basis-full items-center gap-2 hover:underline md:basis-auto">
                  <span className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)]">{it.key}</span>
                  <span className={cn('min-w-0 truncate text-[14px] font-medium', it.resolvedAt && 'text-[var(--w-text-3)] line-through')}>{it.title}</span>
                </Link>
                <span className="flex shrink-0 items-center gap-2.5 text-[12px] text-[var(--w-text-3)]">
                  <span className="max-w-[120px] truncate" title={it.projectName}>{it.projectName}</span>
                  <PriorityIcon priority={it.priority} size={13} />
                  {it.dueDate && <span className="tabular">{formatDate(it.dueDate)}</span>}
                  {it.resolvedAt && <CheckCircle2 size={13} className="text-[var(--w-green)]" aria-label={wt('common.done')} />}
                </span>
                <span className="ml-auto flex min-w-0 shrink-0 justify-end md:w-[180px]"><AssignCell ws={ws} team={team} item={it} canAssign={canAssign} /></span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon={<Inbox size={20} />} title={unassigned ? wt('studio.nothingAssign') : wt('studio.queueEmpty')} body={studioProjects.length ? wt('studio.queueBody') : wt('studio.noTeamsModule')} />
        )}
        {q.hasNextPage && (
          <div className="mt-3 flex justify-center">
            <button type="button" className="w-btn w-btn-sm" disabled={q.isFetchingNextPage} onClick={() => q.fetchNextPage()}>{q.isFetchingNextPage && <Spinner size={11} />} {wt('studio.loadMore')}</button>
          </div>
        )}
      </div>

      <aside className="shrink-0 space-y-5 lg:w-[340px]">
        <section>
          <h2 className="w-section-title mb-2">{wt('studio.incomingHo')} {incoming.length > 0 && <span className="w-count ml-1">{incoming.length}</span>}</h2>
          {incoming.length ? (
            <div className="w-card divide-y divide-[var(--w-border)] overflow-hidden">
              {incoming.map((h) => <HandoffCard key={`${h.id}-${h.status}`} h={h} issueHref={`/work/${h.project.workspaceSlug}/${h.project.key}/issue/${h.issue.number}`} />)}
            </div>
          ) : (
            <p className="text-[12px] text-[var(--w-text-3)]">{team.leadIds.includes(meId ?? -1) || isAdmin ? wt('studio.noHoWaiting') : wt('studio.hoByLead')}</p>
          )}
        </section>
        <section>
          <h2 className="w-section-title mb-2">{wt('studio.people')}</h2>
          <ul className="w-card divide-y divide-[var(--w-border)] overflow-hidden">
            {team.members.map((m) => (
              <li key={m.id} className="flex items-center gap-2 px-3 py-2 text-[13px]">
                <UserAvatar user={m} size={22} />
                <span className="min-w-0 flex-1 truncate">{userName(m)}</span>
                {m.teamRole === 'LEAD' && <span className="flex items-center gap-1 text-[12px] text-[var(--w-text-3)]"><Crown size={12} className="text-[var(--w-yellow)]" /> {wt('studio.lead')}</span>}
              </li>
            ))}
            {!team.members.length && <li className="px-3 py-2 text-[12px] text-[var(--w-text-3)]">{wt('studio.noOneInTeam')}</li>}
          </ul>
        </section>
      </aside>
    </div>
  );
}
