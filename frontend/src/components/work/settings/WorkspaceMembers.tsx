'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Search, X } from 'lucide-react';
import { userName, workApi, workError, type WorkspaceDetail, type WorkspaceMember, type WorkspaceRole } from '@/lib/work-api';
import { useAuthStore } from '@/store/authStore';
import { wk } from '../hooks';
import { EmptyState, Spinner, UserAvatar, formatDate } from '../ui';
import { ConfirmDialog, Section, Select, WS_ROLE_HELP, WS_ROLE_LABEL } from './shared';
import { wt } from '@/components/work/i18n';

export const wsMembersKey = (wsId: number) => ['work', 'ws-members', wsId] as const;

const ASSIGNABLE: Array<Exclude<WorkspaceRole, 'OWNER'>> = ['ADMIN', 'MEMBER', 'GUEST'];

export default function WorkspaceMembers({ ws }: { ws: WorkspaceDetail }) {
  const qc = useQueryClient();
  const me = useAuthStore((s) => s.user?.id);
  const canManage = ws.role === 'OWNER' || ws.role === 'ADMIN';
  const isOwner = ws.role === 'OWNER';
  const [filter, setFilter] = useState('');

  const q = useQuery({ queryKey: wsMembersKey(ws.id), queryFn: () => workApi.members(ws.id), staleTime: 15_000 });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: wsMembersKey(ws.id) });
    qc.invalidateQueries({ queryKey: wk.workspace(ws.slug) });
    qc.invalidateQueries({ queryKey: wk.workspaces });
  };

  const setRole = useMutation({
    mutationFn: (v: { userId: number; role: WorkspaceRole }) => workApi.setMemberRole(ws.id, v.userId, v.role),
    onSuccess: () => { toast.success(wt('settings.wsRoleUpdated')); refresh(); },
    onError: (err) => toast.error(workError(err, wt('settings.roleFailed'))),
  });

  const [removing, setRemoving] = useState<WorkspaceMember | null>(null);
  const remove = useMutation({
    mutationFn: (userId: number) => workApi.removeMember(ws.id, userId),
    onSuccess: () => { toast.success(wt('settings.memberRemoved')); setRemoving(null); refresh(); },
    onError: (err) => toast.error(workError(err, wt('settings.removeFailed'))),
  });

  const [transferTo, setTransferTo] = useState<number | ''>('');
  const [confirmTransfer, setConfirmTransfer] = useState(false);
  const transfer = useMutation({
    mutationFn: (userId: number) => workApi.transferOwnership(ws.id, userId),
    onSuccess: () => {
      toast.success(wt('settings.ownershipDone'));
      setConfirmTransfer(false);
      setTransferTo('');
      refresh();
    },
    onError: (err) => toast.error(workError(err, wt('settings.ownershipFailed'))),
  });

  // CTW-28: AI agent nằm ở mục riêng (không tính vào số người, không đổi vai/xoá ở đây — quản lý ở trang AI agents).
  const agents = useMemo(() => (q.data ?? []).filter((m) => m.kind === 'AGENT'), [q.data]);
  const humans = useMemo(() => (q.data ?? []).filter((m) => m.kind !== 'AGENT'), [q.data]);
  const members = useMemo(() => {
    const t = filter.trim().toLowerCase();
    const list = humans;
    return t ? list.filter((m) => `${userName(m)} ${m.username}`.toLowerCase().includes(t)) : list;
  }, [humans, filter]);

  const transferCandidates = humans.filter((m) => m.id !== me && m.role !== 'GUEST' && m.role !== 'OWNER');
  const target = q.data?.find((m) => m.id === transferTo);

  if (q.isLoading) return <div className="flex justify-center py-12"><Spinner size={18} /></div>;
  if (q.error) return <EmptyState title={wt('settings.membersLoadFailed')} body={workError(q.error)} />;

  return (
    <div>
      <Section
        title={wt('common.members')}
        description={wt('settings.nPeopleAccess', { count: humans.length })}
      >
        <div className="mb-3 grid grid-cols-1 gap-x-6 gap-y-1 text-[12px] text-[var(--w-text-2)] sm:grid-cols-3">
          {ASSIGNABLE.map((r) => (
            <div key={r}><span className="font-medium text-[var(--w-text)]">{WS_ROLE_LABEL[r]}</span> — {WS_ROLE_HELP[r].charAt(0).toLowerCase() + WS_ROLE_HELP[r].slice(1)}</div>
          ))}
        </div>

        {humans.length > 8 && (
          <div className="relative mb-3 max-w-[280px]">
            <Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--w-text-3)]" />
            <input className="w-input pl-8" placeholder={wt('settings.filterMembers')} value={filter} onChange={(e) => setFilter(e.target.value)} />
          </div>
        )}

        <div className="overflow-hidden rounded-[8px] border border-[var(--w-border)]">
          {members.map((m) => {
            const self = m.id === me;
            const editable = canManage && m.role !== 'OWNER' && !self;
            return (
              <div key={m.id} className="flex items-center gap-3 border-b border-[var(--w-border)] px-3 py-2.5 last:border-b-0">
                <UserAvatar user={m} size={28} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 truncate text-[13px] font-medium">
                    <span className="truncate">{userName(m)}</span>
                    {self && <span className="shrink-0 text-[11px] font-normal text-[var(--w-text-3)]">({wt('common.you')})</span>}
                  </div>
                  <div className="truncate text-[12px] text-[var(--w-text-3)]">
                    @{m.username}
                    <span className="hidden sm:inline"> · Joined {formatDate(m.joinedAt)}</span>
                  </div>
                </div>
                {m.role === 'OWNER' || !editable ? (
                  <span className="w-[110px] shrink-0 px-2.5 text-[13px] text-[var(--w-text-2)]">{WS_ROLE_LABEL[m.role]}</span>
                ) : (
                  <Select
                    className="h-7 w-[110px] shrink-0 text-[12px]"
                    value={m.role}
                    disabled={setRole.isPending}
                    onChange={(e) => setRole.mutate({ userId: m.id, role: e.target.value as WorkspaceRole })}
                    aria-label={wt('settings.roleOf', { name: userName(m) })}
                  >
                    {ASSIGNABLE.map((r) => <option key={r} value={r}>{WS_ROLE_LABEL[r]}</option>)}
                  </Select>
                )}
                <div className="w-7 shrink-0">
                  {editable && (
                    <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={() => setRemoving(m)} aria-label={wt('tests.removeK', { key: userName(m) })} title={wt('settings.removeFromWs')}>
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {!members.length && <div className="px-3 py-6 text-center text-[13px] text-[var(--w-text-3)]">No members match “{filter}”.</div>}
        </div>
      </Section>

      {agents.length > 0 && (
        <Section
          title={wt('fields.aiAgents')}
          description={wt('settings.agentsDesc')}
          action={<Link href={`/work/${ws.slug}/agents`} className="w-btn w-btn-sm">{wt('settings.manageAgents')}</Link>}
        >
          <div className="overflow-hidden rounded-[8px] border border-[var(--w-border)]" data-testid="ws-members-agents">
            {agents.map((m) => (
              <div key={m.id} className="flex items-center gap-3 border-b border-[var(--w-border)] px-3 py-2.5 last:border-b-0">
                <UserAvatar user={m} size={28} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium">{userName(m)}</div>
                  <div className="truncate text-[12px] text-[var(--w-text-3)]">@{m.username}</div>
                </div>
                <span className="shrink-0 text-[12px] text-[var(--w-text-2)]">AI agent</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {isOwner && (
        <Section title={wt('settings.transferOwnership')} description={wt('settings.transferDesc')}>
          {transferCandidates.length ? (
            <form
              className="flex max-w-[520px] flex-col gap-2 sm:flex-row"
              onSubmit={(e) => { e.preventDefault(); if (transferTo) setConfirmTransfer(true); }}
            >
              <Select value={transferTo} onChange={(e) => setTransferTo(e.target.value ? Number(e.target.value) : '')} className="sm:flex-1">
                <option value="">{wt('settings.chooseMember')}</option>
                {transferCandidates.map((m) => <option key={m.id} value={m.id}>{userName(m)} (@{m.username})</option>)}
              </Select>
              <button type="submit" className="w-btn shrink-0" disabled={!transferTo}>{wt('settings.transferOwnership')}</button>
            </form>
          ) : (
            <p className="text-[13px] text-[var(--w-text-3)]">{wt('settings.addAdminFirst')}</p>
          )}
        </Section>
      )}

      <ConfirmDialog
        open={!!removing}
        onClose={() => setRemoving(null)}
        title={wt('settings.removeMemberQ')}
        body={wt('settings.removeMemberBody', { name: removing ? userName(removing) : '' })}
        confirmLabel={wt('common.remove')}
        pending={remove.isPending}
        onConfirm={() => removing && remove.mutate(removing.id)}
      />
      <ConfirmDialog
        open={confirmTransfer}
        onClose={() => setConfirmTransfer(false)}
        title={wt('settings.transferQ')}
        body={wt('settings.transferBody', { name: target ? userName(target) : '', ws: ws.name })}
        confirmLabel={wt('settings.transferOwnership')}
        pending={transfer.isPending}
        onConfirm={() => typeof transferTo === 'number' && transfer.mutate(transferTo)}
      />
    </div>
  );
}
