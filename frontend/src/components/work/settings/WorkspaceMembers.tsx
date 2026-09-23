'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Search, X } from 'lucide-react';
import { userName, workApi, workError, type WorkspaceDetail, type WorkspaceMember, type WorkspaceRole } from '@/lib/work-api';
import { useAuthStore } from '@/store/authStore';
import { wk } from '../hooks';
import { EmptyState, Spinner, UserAvatar, formatDate } from '../ui';
import { ConfirmDialog, Section, Select, WS_ROLE_HELP, WS_ROLE_LABEL } from './shared';

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
    onSuccess: () => { toast.success('Role updated'); refresh(); },
    onError: (err) => toast.error(workError(err, 'Could not change the role')),
  });

  const [removing, setRemoving] = useState<WorkspaceMember | null>(null);
  const remove = useMutation({
    mutationFn: (userId: number) => workApi.removeMember(ws.id, userId),
    onSuccess: () => { toast.success('Member removed'); setRemoving(null); refresh(); },
    onError: (err) => toast.error(workError(err, 'Could not remove the member')),
  });

  const [transferTo, setTransferTo] = useState<number | ''>('');
  const [confirmTransfer, setConfirmTransfer] = useState(false);
  const transfer = useMutation({
    mutationFn: (userId: number) => workApi.transferOwnership(ws.id, userId),
    onSuccess: () => {
      toast.success('Ownership transferred. You are now an admin.');
      setConfirmTransfer(false);
      setTransferTo('');
      refresh();
    },
    onError: (err) => toast.error(workError(err, 'Could not transfer ownership')),
  });

  const members = useMemo(() => {
    const t = filter.trim().toLowerCase();
    const list = q.data ?? [];
    return t ? list.filter((m) => `${userName(m)} ${m.username}`.toLowerCase().includes(t)) : list;
  }, [q.data, filter]);

  const transferCandidates = (q.data ?? []).filter((m) => m.id !== me && m.role !== 'GUEST' && m.role !== 'OWNER');
  const target = q.data?.find((m) => m.id === transferTo);

  if (q.isLoading) return <div className="flex justify-center py-12"><Spinner size={18} /></div>;
  if (q.error) return <EmptyState title="Couldn't load members" body={workError(q.error)} />;

  return (
    <div>
      <Section
        title="Members"
        description={`${q.data?.length ?? 0} ${q.data?.length === 1 ? 'person has' : 'people have'} access to this workspace.`}
      >
        <div className="mb-3 grid grid-cols-1 gap-x-6 gap-y-1 text-[12px] text-[var(--w-text-2)] sm:grid-cols-3">
          {ASSIGNABLE.map((r) => (
            <div key={r}><span className="font-medium text-[var(--w-text)]">{WS_ROLE_LABEL[r]}</span> — {WS_ROLE_HELP[r].charAt(0).toLowerCase() + WS_ROLE_HELP[r].slice(1)}</div>
          ))}
        </div>

        {(q.data?.length ?? 0) > 8 && (
          <div className="relative mb-3 max-w-[280px]">
            <Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--w-text-3)]" />
            <input className="w-input pl-8" placeholder="Filter members" value={filter} onChange={(e) => setFilter(e.target.value)} />
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
                    {self && <span className="shrink-0 text-[11px] font-normal text-[var(--w-text-3)]">(you)</span>}
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
                    aria-label={`Role of ${userName(m)}`}
                  >
                    {ASSIGNABLE.map((r) => <option key={r} value={r}>{WS_ROLE_LABEL[r]}</option>)}
                  </Select>
                )}
                <div className="w-7 shrink-0">
                  {editable && (
                    <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={() => setRemoving(m)} aria-label={`Remove ${userName(m)}`} title="Remove from workspace">
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

      {isOwner && (
        <Section title="Transfer ownership" description="The new owner gets full control, including deleting the workspace. You will become an admin.">
          {transferCandidates.length ? (
            <form
              className="flex max-w-[520px] flex-col gap-2 sm:flex-row"
              onSubmit={(e) => { e.preventDefault(); if (transferTo) setConfirmTransfer(true); }}
            >
              <Select value={transferTo} onChange={(e) => setTransferTo(e.target.value ? Number(e.target.value) : '')} className="sm:flex-1">
                <option value="">Choose a member…</option>
                {transferCandidates.map((m) => <option key={m.id} value={m.id}>{userName(m)} (@{m.username})</option>)}
              </Select>
              <button type="submit" className="w-btn shrink-0" disabled={!transferTo}>Transfer ownership</button>
            </form>
          ) : (
            <p className="text-[13px] text-[var(--w-text-3)]">Add another admin or member first — guests cannot become the owner.</p>
          )}
        </Section>
      )}

      <ConfirmDialog
        open={!!removing}
        onClose={() => setRemoving(null)}
        title="Remove member?"
        body={<><span className="font-medium text-[var(--w-text)]">{removing ? userName(removing) : ''}</span> will lose access to this workspace and all of its projects. Issues they created or were assigned stay in place.</>}
        confirmLabel="Remove"
        pending={remove.isPending}
        onConfirm={() => removing && remove.mutate(removing.id)}
      />
      <ConfirmDialog
        open={confirmTransfer}
        onClose={() => setConfirmTransfer(false)}
        title="Transfer ownership?"
        body={<><span className="font-medium text-[var(--w-text)]">{target ? userName(target) : ''}</span> will become the owner of {ws.name}. You will become an admin and can no longer delete the workspace.</>}
        confirmLabel="Transfer ownership"
        pending={transfer.isPending}
        onConfirm={() => typeof transferTo === 'number' && transfer.mutate(transferTo)}
      />
    </div>
  );
}
