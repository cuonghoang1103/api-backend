'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { userName, workApi, workError, type ProjectConfig, type ProjectMember, type ProjectRole } from '@/lib/work-api';
import { useAuthStore } from '@/store/authStore';
import { Spinner, UserAvatar } from '../ui';
import { PROJECT_ROLE_HELP, PROJECT_ROLE_LABEL, Section, Select, WS_ROLE_LABEL } from './shared';
import { useProjectInvalidate } from './useProjectInvalidate';
import { wsMembersKey } from './WorkspaceMembers';
import { wt } from '@/components/work/i18n';

const ROLES: ProjectRole[] = ['ADMIN', 'MEMBER', 'VIEWER', 'TEACHER', 'CLIENT'];

export default function ProjectMembers({ config, slug }: { config: ProjectConfig; slug: string }) {
  const invalidate = useProjectInvalidate(config.id, slug);
  const me = useAuthStore((s) => s.user?.id);
  const canManage = config.permissions.manageMembers;
  const [busyId, setBusyId] = useState<number | null>(null);
  const [addId, setAddId] = useState<number | ''>('');
  const [addRole, setAddRole] = useState<ProjectRole>('VIEWER');

  // Vai trò trong không gian — để biết ai là quản trị không gian (luôn là Admin dự án).
  const wsMembers = useQuery({
    queryKey: wsMembersKey(config.workspace.id),
    queryFn: () => workApi.members(config.workspace.id),
    staleTime: 30_000,
  });
  const wsRole = useMemo(() => new Map(wsMembers.data?.map((m) => [m.id, m.role]) ?? []), [wsMembers.data]);

  // Người trong không gian nhưng chưa thấy dự án (khách, hoặc dự án riêng tư).
  const outsiders = useMemo(() => {
    const inProject = new Set(config.members.map((m) => m.id));
    return (wsMembers.data ?? []).filter((m) => !inProject.has(m.id));
  }, [wsMembers.data, config.members]);

  const add = useMutation({
    mutationFn: () => workApi.setProjectMember(config.id, Number(addId), addRole),
    onSuccess: () => { toast.success(wt('settings.addedToProject')); setAddId(''); invalidate(); },
    onError: (err) => toast.error(workError(err, wt('settings.addPersonFailed'))),
  });

  const setRole = useMutation({
    mutationFn: (v: { userId: number; role: ProjectRole }) => workApi.setProjectMember(config.id, v.userId, v.role),
    onMutate: (v) => setBusyId(v.userId),
    onSuccess: () => { toast.success(wt('settings.roleUpdated')); invalidate(); },
    onError: (err) => toast.error(workError(err, wt('settings.roleFailed'))),
    onSettled: () => setBusyId(null),
  });
  const reset = useMutation({
    mutationFn: (userId: number) => workApi.removeProjectMember(config.id, userId),
    onMutate: (userId) => setBusyId(userId),
    onSuccess: () => { toast.success(wt('settings.roleReset')); invalidate(); },
    onError: (err) => toast.error(workError(err, wt('settings.roleResetFailed'))),
    onSettled: () => setBusyId(null),
  });

  const row = (m: ProjectMember) => {
    const wr = wsRole.get(m.id);
    const wsAdmin = wr === 'OWNER' || wr === 'ADMIN';
    const self = m.id === me;
    const editable = canManage && !wsAdmin && !self;
    return (
      <div key={m.id} className="flex items-center gap-3 border-b border-[var(--w-border)] px-3 py-2.5 last:border-b-0">
        <UserAvatar user={m} size={28} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[13px] font-medium">
            <span className="truncate">{userName(m)}</span>
            {self && <span className="shrink-0 text-[11px] font-normal text-[var(--w-text-3)]">({wt('common.you')})</span>}
          </div>
          <div className="truncate text-[12px] text-[var(--w-text-3)]">
            @{m.username}
            {wr && <span className="hidden sm:inline"> · Workspace {WS_ROLE_LABEL[wr].toLowerCase()}</span>}
            {!wsAdmin && <span className="hidden sm:inline"> · {m.explicit ? wt('settings.setForProject') : wt('settings.defaultFromWs')}</span>}
          </div>
        </div>
        {wsAdmin ? (
          <span className="shrink-0 text-[13px] text-[var(--w-text-2)]">{wt('settings.adminWs')}</span>
        ) : editable ? (
          <div className="flex shrink-0 items-center gap-1">
            {m.explicit && (
              <button
                type="button"
                className="w-btn w-btn-ghost w-btn-sm max-sm:!hidden"
                disabled={busyId === m.id}
                onClick={() => reset.mutate(m.id)}
                title={wt('settings.useWsRole')}
              >
                {wt('settings.resetDefault')}
              </button>
            )}
            <Select
              className="h-7 w-[108px] text-[12px]"
              value={m.role}
              disabled={busyId === m.id}
              onChange={(e) => setRole.mutate({ userId: m.id, role: e.target.value as ProjectRole })}
              aria-label={wt('settings.roleOf', { name: userName(m) })}
            >
              {ROLES.map((r) => <option key={r} value={r}>{PROJECT_ROLE_LABEL[r]}</option>)}
            </Select>
          </div>
        ) : (
          <span className="shrink-0 text-[13px] text-[var(--w-text-2)]">{PROJECT_ROLE_LABEL[m.role]}</span>
        )}
      </div>
    );
  };

  return (
    <Section
      title={wt('common.members')}
      description={
        config.visibility === 'PRIVATE'
          ? wt('settings.privateDesc')
          : wt('settings.publicDesc')
      }
    >
      <div className="mb-4 grid grid-cols-1 gap-x-6 gap-y-1 text-[12px] text-[var(--w-text-2)] sm:grid-cols-2">
        {ROLES.map((r) => (
          <div key={r}><span className="font-medium text-[var(--w-text)]">{PROJECT_ROLE_LABEL[r]}</span> — {PROJECT_ROLE_HELP[r].charAt(0).toLowerCase() + PROJECT_ROLE_HELP[r].slice(1)}</div>
        ))}
      </div>
      {wsMembers.isLoading ? (
        <div className="flex justify-center py-6"><Spinner size={16} /></div>
      ) : (
        <div className="overflow-hidden rounded-[8px] border border-[var(--w-border)]">
          {config.members.map(row)}
          {!config.members.length && <div className="px-3 py-6 text-center text-[13px] text-[var(--w-text-3)]">{wt('settings.noMembers')}</div>}
        </div>
      )}
      {canManage && outsiders.length > 0 && (
        <form
          className="mt-3 flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => { e.preventDefault(); if (addId && !add.isPending) add.mutate(); }}
        >
          <Select value={addId} onChange={(e) => setAddId(e.target.value ? Number(e.target.value) : '')} className="sm:flex-1" aria-label={wt('settings.wsMemberToAdd')}>
            <option value="">{wt('settings.addWsMember')}</option>
            {outsiders.map((m) => <option key={m.id} value={m.id}>{userName(m)} (@{m.username}) · {WS_ROLE_LABEL[m.role]}</option>)}
          </Select>
          <Select value={addRole} onChange={(e) => setAddRole(e.target.value as ProjectRole)} className="sm:w-[120px]" aria-label={wt('settings.projRole')}>
            {ROLES.map((r) => <option key={r} value={r}>{PROJECT_ROLE_LABEL[r]}</option>)}
          </Select>
          <button type="submit" className="w-btn shrink-0" disabled={!addId || add.isPending}>
            {add.isPending && <Spinner size={12} />}
            {wt('common.add')}
          </button>
        </form>
      )}
      <p className="mt-3 text-[12px] text-[var(--w-text-3)]">
        {wt('settings.inviteA')}{' '}
        <Link href={`/work/${slug}/settings?tab=invitations`} className="text-[var(--w-accent-text)] hover:underline">{wt('settings.inviteLink')}</Link>{' '}
        {wt('settings.inviteB')}
      </p>
    </Section>
  );
}
