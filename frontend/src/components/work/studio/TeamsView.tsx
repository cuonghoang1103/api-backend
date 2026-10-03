'use client';

/**
 * Trang Teams của một không gian (S1, mô-đun teams): danh sách bộ phận, tạo /
 * sửa / lưu trữ, thành viên + trưởng bộ phận (LEAD). Bộ phận ở cấp KHÔNG GIAN
 * nên một bộ phận phục vụ nhiều dự án. Tạo/sửa = OWNER/ADMIN không gian; khách
 * (GUEST) không xem được (server chặn, ta cũng không hiện mục).
 */

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Archive, ArchiveRestore, Crown, Pencil, Plus, Users, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  userName, workApi, workError, workStudioApi, type WorkTeam, type WorkUser, type WorkspaceDetail,
} from '@/lib/work-api';
import { Dialog, EmptyState, Field, PageLoading, PickerList, Popover, Spinner, UserAvatar, useToggle } from '../ui';
import { usePick } from '../fields';
import { ConfirmDialog } from '../settings/shared';
import { TeamChip, useStudioInvalidate, useWorkspaceTeams } from './shared';

const COLORS = ['#4f5bd5', '#148a8a', '#d0621f', '#9a45b8', '#2f8a4e', '#b0840f', '#c63a62', '#5f6878'];

type Draft = { userId: number; role: 'LEAD' | 'MEMBER' };

function TeamDialog({ open, onClose, ws, team }: { open: boolean; onClose: () => void; ws: WorkspaceDetail; team: WorkTeam | null }) {
  const invalidate = useStudioInvalidate();
  const [key, setKey] = useState('');
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [description, setDescription] = useState('');
  const [draft, setDraft] = useState<Draft[]>([]);
  const pick = usePick();
  const membersQ = useQuery({ queryKey: ['work', 'ws-members', ws.id], queryFn: () => workApi.members(ws.id), enabled: open, staleTime: 60_000 });
  useEffect(() => {
    if (!open) return;
    setKey(team?.key ?? ''); setName(team?.name ?? ''); setColor(team?.color ?? COLORS[0]); setDescription(team?.description ?? '');
    setDraft(team ? team.members.map((m) => ({ userId: m.id, role: m.teamRole })) : []);
    // Chỉ nạp lại khi mở hộp / đổi bộ phận — tải lại danh sách giữa chừng không được xoá chữ đang gõ.
  }, [open, team?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const people = (membersQ.data ?? []).filter((m) => m.role !== 'GUEST');
  const byId = new Map<number, WorkUser>([...(membersQ.data ?? []), ...(team?.members ?? [])].map((m) => [m.id, m]));

  // Sửa bộ phận có sẵn: thành viên đổi NGAY (một lời gọi mỗi lần), để không có nút Lưu "quên bấm".
  const member = useMutation({
    mutationFn: (v: { userId: number; role: 'LEAD' | 'MEMBER' | null }) => (v.role
      ? workStudioApi.setTeamMember(ws.id, team!.id, v.userId, v.role)
      : workStudioApi.removeTeamMember(ws.id, team!.id, v.userId)),
    onSuccess: (t) => { setDraft(t.members.map((m) => ({ userId: m.id, role: m.teamRole }))); invalidate(); },
    onError: (err) => toast.error(workError(err, 'Could not change the team members')),
  });
  const setRole = (userId: number, role: 'LEAD' | 'MEMBER' | null) => {
    if (team) member.mutate({ userId, role });
    else setDraft((d) => (role ? (d.some((x) => x.userId === userId) ? d.map((x) => (x.userId === userId ? { ...x, role } : x)) : [...d, { userId, role }]) : d.filter((x) => x.userId !== userId)));
  };

  const save = useMutation({
    mutationFn: () => (team
      ? workStudioApi.updateTeam(ws.id, team.id, { name: name.trim(), color, description: description.trim() || null })
      : workStudioApi.createTeam(ws.id, {
        key: key.trim().toUpperCase(), name: name.trim(), color, description: description.trim() || null,
        leadIds: draft.filter((d) => d.role === 'LEAD').map((d) => d.userId), memberIds: draft.filter((d) => d.role === 'MEMBER').map((d) => d.userId),
      })),
    onSuccess: (t) => { toast.success(team ? 'Team saved' : `Team ${t.key} created`); invalidate(); onClose(); },
    onError: (err) => toast.error(workError(err, 'Could not save the team')),
  });
  const keyOk = /^[A-Z][A-Z0-9_]{1,15}$/.test(key.trim().toUpperCase());
  const ok = name.trim() && (team || keyOk);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={team ? `Edit team ${team.key}` : 'New team'}
      width={560}
      footer={
        <>
          <button type="button" className="w-btn" onClick={onClose}>{team ? 'Close' : 'Cancel'}</button>
          <button type="button" className="w-btn w-btn-primary" disabled={!ok || save.isPending} onClick={() => save.mutate()}>{save.isPending && <Spinner size={12} />} {team ? 'Save details' : 'Create team'}</button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-[120px_1fr]">
        <Field label="Key" hint={team ? 'Keys cannot change.' : 'e.g. BA, DEV, QA'}>
          <input className="w-input font-mono uppercase" value={key} disabled={!!team} maxLength={16} onChange={(e) => setKey(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ''))} aria-invalid={!!key && !keyOk} />
        </Field>
        <Field label="Name"><input className="w-input" autoFocus value={name} maxLength={80} onChange={(e) => setName(e.target.value)} placeholder="e.g. Business Analysis" /></Field>
      </div>
      <Field label="Colour">
        <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Team colour">
          {COLORS.map((c) => (
            <button key={c} type="button" role="radio" aria-checked={color === c} aria-label={c} onClick={() => setColor(c)} className={cn('h-6 w-6 rounded-full border-2', color === c ? 'border-[var(--w-text)]' : 'border-transparent')} style={{ background: c }} />
          ))}
        </div>
      </Field>
      <Field label="What does this team do? (optional)"><textarea className="w-input" rows={2} maxLength={2000} value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
      <Field label="People" hint="Leads assign work from the team queue and accept handoffs sent to the team. Guests (clients, teachers) cannot join a team.">
        <ul className="mb-2 divide-y divide-[var(--w-border)] overflow-hidden rounded-[6px] border border-[var(--w-border)]">
          {draft.map((d) => {
            const u = byId.get(d.userId);
            return (
              <li key={d.userId} className="flex items-center gap-2 px-2.5 py-1.5 text-[13px]">
                <UserAvatar user={u} size={20} />
                <span className="min-w-0 flex-1 truncate">{u ? userName(u) : `User ${d.userId}`}</span>
                <div className="inline-flex rounded-[6px] border border-[var(--w-border-strong)] p-0.5" role="radiogroup" aria-label="Role in team">
                  {(['LEAD', 'MEMBER'] as const).map((r) => (
                    <button key={r} type="button" role="radio" aria-checked={d.role === r} disabled={member.isPending} onClick={() => d.role !== r && setRole(d.userId, r)} className={cn('h-6 rounded-[4px] px-2 text-[12px] font-medium', d.role === r ? 'bg-[var(--w-active)] text-[var(--w-text)]' : 'text-[var(--w-text-2)]')}>
                      {r === 'LEAD' ? 'Lead' : 'Member'}
                    </button>
                  ))}
                </div>
                <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" disabled={member.isPending} onClick={() => setRole(d.userId, null)} aria-label={`Remove ${u ? userName(u) : 'person'}`}><X size={12} /></button>
              </li>
            );
          })}
          {!draft.length && <li className="px-2.5 py-2 text-[12px] text-[var(--w-text-3)]">No one yet.</li>}
        </ul>
        <button ref={pick.ref} type="button" className="w-btn w-btn-sm" onClick={pick.toggle}><Plus size={12} /> Add person</button>
        <Popover open={pick.on} onClose={pick.close} anchorRef={pick.ref} width={260}>
          <PickerList
            options={people.filter((m) => !draft.some((d) => d.userId === m.id)).map((m) => ({ value: m.id, label: userName(m), keywords: m.username, icon: <UserAvatar user={m} size={16} /> }))}
            selected={[]}
            onPick={(v) => { setRole(v, draft.length === 0 ? 'LEAD' : 'MEMBER'); pick.close(); }}
            placeholder="Find a workspace member…"
            empty={membersQ.isLoading ? 'Loading…' : 'Everyone is already in the team'}
          />
        </Popover>
      </Field>
    </Dialog>
  );
}

function TeamCard({ t, ws, canManage, onEdit, onArchive }: { t: WorkTeam; ws: WorkspaceDetail; canManage: boolean; onEdit: () => void; onArchive: () => void }) {
  const leads = t.members.filter((m) => m.teamRole === 'LEAD');
  return (
    <div className={cn('w-card relative flex min-w-0 flex-col overflow-hidden p-4 pl-5', t.archivedAt && 'opacity-70')}>
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[3px]" style={{ background: t.color }} />
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <TeamChip team={t} />
            <Link href={`/work/${ws.slug}/teams/${t.id}`} className="min-w-0 truncate text-[15px] font-semibold tracking-[-0.01em] hover:underline">{t.name}</Link>
            {t.archivedAt && <span className="shrink-0 rounded-full border border-[var(--w-border-strong)] px-2 text-[11px] leading-[18px] text-[var(--w-text-3)]">Archived</span>}
          </div>
          {t.description && <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-[var(--w-text-2)]">{t.description}</p>}
        </div>
        {canManage && (
          <div className="flex shrink-0 gap-0.5">
            <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={onEdit} aria-label={`Edit ${t.name}`} title="Edit team"><Pencil size={13} /></button>
            <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={onArchive} aria-label={t.archivedAt ? `Unarchive ${t.name}` : `Archive ${t.name}`} title={t.archivedAt ? 'Unarchive' : 'Archive'}>
              {t.archivedAt ? <ArchiveRestore size={13} /> : <Archive size={13} />}
            </button>
          </div>
        )}
      </div>
      <div className="min-h-[12px] flex-1" />
      <div className="mt-3 flex items-center justify-between gap-3 border-t border-[var(--w-border)] pt-3 text-[13px] text-[var(--w-text-2)]">
        <span className="flex min-w-0 items-center gap-2">
          {leads.length ? (
            <>
              <Crown size={13} className="shrink-0 text-[var(--w-yellow)]" aria-label="Lead" />
              <span className="flex -space-x-1">{leads.slice(0, 3).map((m) => <UserAvatar key={m.id} user={m} size={20} className="ring-2 ring-[var(--w-raised)]" />)}</span>
              <span className="truncate">{leads.length === 1 ? userName(leads[0]) : `${leads.length} leads`}</span>
            </>
          ) : <span className="text-[var(--w-text-3)]">No lead</span>}
          <span className="shrink-0 text-[var(--w-text-3)]">· {t.members.length} {t.members.length === 1 ? 'person' : 'people'}</span>
        </span>
        <Link href={`/work/${ws.slug}/teams/${t.id}`} className="shrink-0 font-medium text-[var(--w-accent-text)] hover:underline">
          <span className="tabular">{t.openIssues}</span> open · Queue
        </Link>
      </div>
    </div>
  );
}

export default function TeamsView({ ws }: { ws: WorkspaceDetail }) {
  const invalidate = useStudioInvalidate();
  const canManage = ws.role === 'OWNER' || ws.role === 'ADMIN';
  const showArchived = useToggle(false);
  const q = useWorkspaceTeams(ws.id, true, true);
  const [editing, setEditing] = useState<WorkTeam | null | 'new'>(null);
  const [archiving, setArchiving] = useState<WorkTeam | null>(null);
  const archive = useMutation({
    mutationFn: (t: WorkTeam) => workStudioApi.updateTeam(ws.id, t.id, { archived: !t.archivedAt }),
    onSuccess: (t) => { toast.success(t.archivedAt ? `Team ${t.key} archived` : `Team ${t.key} is back`); setArchiving(null); invalidate(); },
    onError: (err) => toast.error(workError(err, 'Could not change the team')),
  });
  const teams = useMemo(() => (q.data ?? []).filter((t) => showArchived.on || !t.archivedAt), [q.data, showArchived.on]);
  const archivedCount = (q.data ?? []).filter((t) => t.archivedAt).length;
  const studioProjects = ws.projects.filter((p) => p.modules?.teams && !p.archivedAt);

  if (q.isLoading) return <PageLoading rows={5} />;
  if (q.error) return <EmptyState title="Could not load the teams" body={workError(q.error)} />;
  return (
    <div className="mx-auto w-full max-w-[1120px] px-4 py-5 md:px-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <p className="min-w-0 flex-1 text-[13px] leading-relaxed text-[var(--w-text-2)]">
          Teams are departments shared by every project in <b className="font-medium text-[var(--w-text)]">{ws.name}</b>. Issues get a Team field in projects with the Teams module on
          {studioProjects.length ? ` (${studioProjects.map((p) => p.key).join(', ')})` : ' — none yet'}.
        </p>
        {archivedCount > 0 && (
          <button type="button" className={cn('w-btn w-btn-sm', showArchived.on && 'w-btn-on')} onClick={showArchived.toggle} aria-pressed={showArchived.on}>
            <Archive size={12} /> Archived · {archivedCount}
          </button>
        )}
        {canManage && <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={() => setEditing('new')}><Plus size={13} /> New team</button>}
      </div>
      {teams.length ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))]">
          {teams.map((t) => <TeamCard key={t.id} t={t} ws={ws} canManage={canManage} onEdit={() => setEditing(t)} onArchive={() => (t.archivedAt ? archive.mutate(t) : setArchiving(t))} />)}
        </div>
      ) : (
        <EmptyState
          icon={<Users size={20} />}
          title="No teams yet"
          body="Create departments such as BA, Design, Development and QA. Each team gets a work queue across projects, and its lead assigns from it."
          action={canManage ? <button type="button" className="w-btn w-btn-primary" onClick={() => setEditing('new')}><Plus size={13} /> Create the first team</button> : undefined}
        />
      )}
      <TeamDialog open={editing !== null} onClose={() => setEditing(null)} ws={ws} team={editing === 'new' ? null : (q.data?.find((t) => editing && t.id === editing.id) ?? null)} />
      <ConfirmDialog
        open={!!archiving}
        onClose={() => setArchiving(null)}
        onConfirm={() => archiving && archive.mutate(archiving)}
        pending={archive.isPending}
        danger={false}
        title={`Archive team ${archiving?.key ?? ''}`}
        body="The team disappears from pickers. Its issues keep the team so history stays readable, and you can unarchive it any time."
        confirmLabel="Archive team"
      />
    </div>
  );
}
