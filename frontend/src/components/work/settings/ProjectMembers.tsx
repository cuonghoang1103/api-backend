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
import DataTable, { type DataColumn } from '../table/DataTable';

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

  // UX-C: bảng chung (lọc nhanh, sắp xếp, cột, xuất, chọn nhiều ⇒ đổi vai hàng loạt).
  const infoOf = (m: ProjectMember) => {
    const wr = wsRole.get(m.id);
    const wsAdmin = wr === 'OWNER' || wr === 'ADMIN';
    const self = m.id === me;
    return { wr, wsAdmin, self, editable: canManage && !wsAdmin && !self };
  };
  const [bulkRole, setBulkRole] = useState<ProjectRole>('MEMBER');
  const bulk = useMutation({
    mutationFn: async (ids: number[]) => {
      let ok = 0;
      for (const userId of ids) {
        try { await workApi.setProjectMember(config.id, userId, bulkRole); ok += 1; } catch { /* đếm phần lỗi bên dưới */ }
      }
      return { ok, failed: ids.length - ok };
    },
    onSuccess: (r) => {
      if (r.ok) toast.success(wt('uxc.rolesUpdated', { count: r.ok }));
      if (r.failed) toast.error(wt('uxc.rolesFailed', { count: r.failed }));
      invalidate();
    },
  });
  const columns: DataColumn<ProjectMember>[] = [
    {
      id: 'member', header: wt('uxc.colMember'), width: 240, grow: true, required: true,
      value: (m) => userName(m), text: (m) => `${userName(m)} ${m.username}`,
      cell: (m) => (
        <span className="flex min-w-0 items-center gap-2.5">
          <UserAvatar user={m} size={24} />
          <span className="min-w-0">
            <span className="flex items-center gap-1.5 text-[13px] font-medium">
              <span className="truncate">{userName(m)}</span>
              {m.id === me && <span className="shrink-0 text-[11px] font-normal text-[var(--w-text-3)]">({wt('common.you')})</span>}
            </span>
            <span className="block truncate text-[11.5px] text-[var(--w-text-3)]">@{m.username}</span>
          </span>
        </span>
      ),
    },
    { id: 'wsRole', header: wt('uxc.colWsRole'), width: 130, hideBelow: 'sm', value: (m) => { const r = wsRole.get(m.id); return r ? WS_ROLE_LABEL[r] : null; } },
    {
      id: 'source', header: wt('uxc.colSource'), width: 170, hideBelow: 'md',
      value: (m) => (infoOf(m).wsAdmin ? wt('settings.adminWs') : m.explicit ? wt('settings.setForProject') : wt('settings.defaultFromWs')),
    },
    {
      id: 'role', header: wt('settings.projRole'), width: 200, value: (m) => PROJECT_ROLE_LABEL[m.role],
      cell: (m) => {
        const i = infoOf(m);
        if (i.wsAdmin) return <span className="text-[13px] text-[var(--w-text-2)]">{wt('settings.adminWs')}</span>;
        if (!i.editable) return <span className="text-[13px] text-[var(--w-text-2)]">{PROJECT_ROLE_LABEL[m.role]}</span>;
        return (
          <span className="flex items-center gap-1">
            <Select
              className="h-7 w-[108px] text-[12px]"
              value={m.role}
              disabled={busyId === m.id}
              onChange={(e) => setRole.mutate({ userId: m.id, role: e.target.value as ProjectRole })}
              aria-label={wt('settings.roleOf', { name: userName(m) })}
            >
              {ROLES.map((r) => <option key={r} value={r}>{PROJECT_ROLE_LABEL[r]}</option>)}
            </Select>
            {m.explicit && (
              <button type="button" className="w-btn w-btn-ghost w-btn-sm max-sm:!hidden" disabled={busyId === m.id} onClick={() => reset.mutate(m.id)} title={wt('settings.useWsRole')}>
                {wt('settings.resetDefault')}
              </button>
            )}
          </span>
        );
      },
    },
  ];

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
          <DataTable
            id="project-members"
            label={wt('common.members')}
            rows={config.members}
            columns={columns}
            rowKey={(m) => m.id}
            height="auto"
            quickFilter={config.members.length > 8}
            selectable={canManage}
            exportName={`${config.key}-members`}
            empty={<div className="px-3 py-6 text-center text-[13px] text-[var(--w-text-3)]">{wt('settings.noMembers')}</div>}
            bulkActions={(rows, clear) => {
              const ids = rows.filter((m) => infoOf(m).editable).map((m) => m.id);
              return (
                <span className="flex items-center gap-1.5">
                  <Select value={bulkRole} onChange={(e) => setBulkRole(e.target.value as ProjectRole)} className="h-7 w-[120px] text-[12px]" aria-label={wt('settings.projRole')}>
                    {ROLES.map((r) => <option key={r} value={r}>{PROJECT_ROLE_LABEL[r]}</option>)}
                  </Select>
                  <button type="button" className="w-btn w-btn-sm" disabled={!ids.length || bulk.isPending} onClick={() => bulk.mutate(ids, { onSuccess: clear })} title={ids.length < rows.length ? wt('uxc.someLocked') : undefined}>
                    {bulk.isPending && <Spinner size={12} />} {wt('uxc.setRoleN', { count: ids.length })}
                  </button>
                </span>
              );
            }}
          />
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
