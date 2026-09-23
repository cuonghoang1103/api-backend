'use client';

/**
 * Releases (version): bảng version + chi tiết một version (`?v=`) gồm thẻ
 * theo nhóm trạng thái và release notes (sửa tay / nhờ AI viết nháp).
 *
 * Quyền quản lý version đi theo quyền quản lý sprint (backend: 'sprint.manage').
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';
import { ArrowLeft, MoreHorizontal, Plus, Rocket, Search, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  isAiQuotaError, workApi, workError,
  type AiQuota, type IssueCard, type ProjectConfig, type VersionStatus, type VersionSummary, type WorkVersion,
} from '@/lib/work-api';
import { wk, type Lookups } from './hooks';
import UpgradeDialog from './ai/UpgradeDialog';
import { ConfirmDialog } from './settings/shared';
import { Dialog, EmptyState, Field, formatDate, IssueTypeIcon, Popover, Spinner, StatusBadge, UserAvatar, useToggle } from './ui';

function todayStr(): string {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
}
const dateInput = (iso: string | null | undefined) => (iso ? iso.slice(0, 10) : '');

const STATUS_LABEL: Record<VersionStatus, string> = { UNRELEASED: 'Unreleased', RELEASED: 'Released', ARCHIVED: 'Archived' };
const STATUS_STYLE: Record<VersionStatus, string> = {
  UNRELEASED: 'bg-[var(--w-sunken)] text-[var(--w-text-2)] border-[var(--w-border-strong)]',
  RELEASED: 'bg-[color-mix(in_srgb,var(--w-green)_14%,transparent)] text-[var(--w-green)] border-[color-mix(in_srgb,var(--w-green)_40%,transparent)]',
  ARCHIVED: 'bg-transparent text-[var(--w-text-3)] border-[var(--w-border)]',
};

export function VersionStatusBadge({ status }: { status: VersionStatus }) {
  return (
    <span className={cn('inline-flex h-[22px] items-center whitespace-nowrap rounded-[4px] border px-1.5 text-[11px] font-semibold uppercase tracking-[0.02em]', STATUS_STYLE[status])}>
      {STATUS_LABEL[status]}
    </span>
  );
}

function Progress({ done, total, wide }: { done: number; total: number; wide?: boolean }) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <div className={cn('flex items-center gap-2', wide ? 'w-full' : 'w-[150px]')} title={`${done} of ${total} issues done`}>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--w-sunken)]">
        <div className="h-full rounded-full bg-[var(--w-green)]" style={{ width: `${pct}%` }} />
      </div>
      <span className="shrink-0 text-[11.5px] tabular text-[var(--w-text-3)]">{done}/{total}</span>
    </div>
  );
}

// ─── Hộp thoại tạo / sửa ────────────────────────────────────────

function VersionDialog({ open, onClose, pid, version }: { open: boolean; onClose: () => void; pid: number; version: WorkVersion | null }) {
  const qc = useQueryClient();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [start, setStart] = useState('');
  const [release, setRelease] = useState('');
  useEffect(() => {
    if (!open) return;
    setName(version?.name ?? '');
    setDescription(version?.description ?? '');
    setStart(dateInput(version?.startDate));
    setRelease(dateInput(version?.releaseDate));
    // Theo id: danh sách tải lại khi đang sửa không được xoá chữ đang gõ.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, version?.id]);

  const badDates = !!start && !!release && start > release;
  const save = useMutation({
    mutationFn: () => {
      const body = { name: name.trim(), description: description.trim() || null, startDate: start || null, releaseDate: release || null };
      return version ? workApi.updateVersion(pid, version.id, body) : workApi.createVersion(pid, body);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: wk.versions(pid) });
      toast.success(version ? 'Version updated' : 'Version created');
      onClose();
    },
    onError: (err) => toast.error(workError(err, 'Could not save the version')),
  });

  return (
    <Dialog open={open} onClose={onClose} title={version ? 'Edit version' : 'Create version'} width={480}>
      <form onSubmit={(e) => { e.preventDefault(); if (name.trim() && !badDates && !save.isPending) save.mutate(); }}>
        <Field label="Name">
          <input className="w-input" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} placeholder="e.g. v1.2.0" autoFocus />
        </Field>
        <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
          <Field label="Start date">
            <input type="date" className="w-input" value={start} onChange={(e) => setStart(e.target.value)} />
          </Field>
          <Field label="Release date">
            <input type="date" className="w-input" value={release} onChange={(e) => setRelease(e.target.value)} />
          </Field>
        </div>
        {badDates && <p className="-mt-2 mb-3 text-[12px] text-[var(--w-red)]">The start date must be on or before the release date.</p>}
        <Field label="Description">
          <textarea className="w-input min-h-[80px] py-2" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What is this release about?" />
        </Field>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" className="w-btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="w-btn w-btn-primary" disabled={!name.trim() || badDates || save.isPending}>
            {save.isPending && <Spinner size={12} />}
            {version ? 'Save' : 'Create'}
          </button>
        </div>
      </form>
    </Dialog>
  );
}

// ─── Hộp thoại phát hành ────────────────────────────────────────

function ReleaseDialog({ open, onClose, pid, version, versions }: {
  open: boolean; onClose: () => void; pid: number; version: VersionSummary | null; versions: VersionSummary[];
}) {
  const qc = useQueryClient();
  const [date, setDate] = useState(todayStr());
  const [target, setTarget] = useState<string>('none');
  const others = useMemo(() => versions.filter((v) => v.status === 'UNRELEASED' && v.id !== version?.id), [versions, version]);
  const unfinished = version ? version.total - version.done : 0;
  // Chỉ đặt mặc định lúc mở — danh sách tải lại (realtime) không được xoá lựa chọn của người dùng.
  const firstOther = others[0]?.id;
  const versionId = version?.id;
  const versionDate = version?.releaseDate;
  useEffect(() => {
    if (!open) return;
    setDate(dateInput(versionDate) || todayStr());
    setTarget(firstOther ? String(firstOther) : 'none');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, versionId]);

  const release = useMutation({
    mutationFn: () => workApi.releaseVersion(pid, version!.id, { moveUnresolvedTo: target === 'none' ? null : Number(target), releaseDate: date || null }),
    onSuccess: (r) => {
      qc.invalidateQueries({ queryKey: wk.versions(pid) });
      qc.invalidateQueries({ queryKey: wk.issues(pid) });
      toast.success(r.moved ? `${r.version.name} released · ${r.moved} unfinished issue${r.moved === 1 ? '' : 's'} moved` : `${r.version.name} released`);
      onClose();
    },
    onError: (err) => toast.error(workError(err, 'Could not release the version')),
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      width={460}
      title={<span className="inline-flex items-center gap-2"><Rocket size={15} /> Release {version?.name}</span>}
      footer={(
        <>
          <button type="button" className="w-btn" onClick={onClose}>Cancel</button>
          <button type="button" className="w-btn w-btn-primary" disabled={!version || release.isPending} onClick={() => release.mutate()}>
            {release.isPending && <Spinner size={12} />} Release
          </button>
        </>
      )}
    >
      <Field label="Release date">
        <input type="date" className="w-input" value={date} onChange={(e) => setDate(e.target.value)} />
      </Field>
      {unfinished > 0 ? (
        <Field
          label={`Move ${unfinished} unfinished issue${unfinished === 1 ? '' : 's'} to`}
          hint="Unfinished issues can't ship in this release. Pick where they go next."
        >
          <select className="w-input" value={target} onChange={(e) => setTarget(e.target.value)}>
            {others.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
            <option value="none">Remove from version</option>
          </select>
        </Field>
      ) : (
        <p className="text-[13px] text-[var(--w-text-2)]">All {version?.total ?? 0} issues in this version are done.</p>
      )}
    </Dialog>
  );
}

// ─── Menu thao tác một dòng ─────────────────────────────────────

type VersionAction = 'edit' | 'release' | 'unrelease' | 'archive' | 'unarchive' | 'delete';

function ActionsMenu({ version, onAction }: { version: VersionSummary; onAction: (a: VersionAction) => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const t = useToggle();
  const items: Array<{ id: VersionAction; label: string; danger?: boolean }> = [
    { id: 'edit', label: 'Edit' },
    ...(version.status === 'UNRELEASED' ? [{ id: 'release' as const, label: 'Release' }] : []),
    ...(version.status === 'RELEASED' ? [{ id: 'unrelease' as const, label: 'Unrelease' }] : []),
    version.status === 'ARCHIVED' ? { id: 'unarchive' as const, label: 'Unarchive' } : { id: 'archive' as const, label: 'Archive' },
    { id: 'delete', label: 'Delete', danger: true },
  ];
  return (
    <>
      <button ref={ref} type="button" onClick={(e) => { e.stopPropagation(); t.toggle(); }} className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={`Actions for ${version.name}`}>
        <MoreHorizontal size={15} />
      </button>
      <Popover open={t.on} onClose={t.close} anchorRef={ref} width={170} align="end">
        <div className="p-1" onClick={(e) => e.stopPropagation()}>
          {items.map((i) => (
            <button
              key={i.id}
              type="button"
              onClick={() => { t.close(); onAction(i.id); }}
              className={cn('flex w-full items-center rounded-[5px] px-2 py-1.5 text-left text-[13px] hover:bg-[var(--w-hover)]', i.danger && 'text-[var(--w-red)]')}
            >
              {i.label}
            </button>
          ))}
        </div>
      </Popover>
    </>
  );
}

/** Mọi thao tác trên version gom một chỗ để bảng và trang chi tiết dùng chung. */
function useVersionActions(pid: number, versions: VersionSummary[], onDeleted?: () => void) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<WorkVersion | null>(null);
  const [creating, setCreating] = useState(false);
  const [releasing, setReleasing] = useState<VersionSummary | null>(null);
  const [deleting, setDeleting] = useState<VersionSummary | null>(null);

  const setStatus = useMutation({
    mutationFn: ({ v, status }: { v: VersionSummary; status: 'UNRELEASED' | 'ARCHIVED' }) => workApi.updateVersion(pid, v.id, { status }),
    onSuccess: (out, { v, status }) => {
      qc.invalidateQueries({ queryKey: wk.versions(pid) });
      toast.success(status === 'ARCHIVED' ? `${out.name} archived` : v.status === 'ARCHIVED' ? `${out.name} restored as unreleased` : `${out.name} is unreleased again`);
    },
    onError: (err) => toast.error(workError(err, 'Could not update the version')),
  });
  const del = useMutation({
    mutationFn: (v: VersionSummary) => workApi.deleteVersion(pid, v.id),
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: wk.versions(pid) });
      qc.invalidateQueries({ queryKey: wk.issues(pid) });
      toast.success(`${v.name} deleted`);
      setDeleting(null);
      onDeleted?.();
    },
    onError: (err) => toast.error(workError(err, 'Could not delete the version')),
  });

  const run = (v: VersionSummary, a: VersionAction) => {
    if (a === 'edit') setEditing(v);
    else if (a === 'release') setReleasing(v);
    else if (a === 'unrelease' || a === 'unarchive') setStatus.mutate({ v, status: 'UNRELEASED' });
    else if (a === 'archive') setStatus.mutate({ v, status: 'ARCHIVED' });
    else if (a === 'delete') setDeleting(v);
  };

  const dialogs = (
    <>
      <VersionDialog open={creating || !!editing} onClose={() => { setCreating(false); setEditing(null); }} pid={pid} version={editing} />
      <ReleaseDialog open={!!releasing} onClose={() => setReleasing(null)} pid={pid} version={releasing} versions={versions} />
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && del.mutate(deleting)}
        pending={del.isPending}
        title={`Delete ${deleting?.name ?? 'version'}?`}
        confirmLabel="Delete version"
        body={deleting?.total
          ? <>The version will be removed from <strong className="text-[var(--w-text)]">{deleting.total} issue{deleting.total === 1 ? '' : 's'}</strong>. The issues themselves are kept. This can&apos;t be undone.</>
          : <>This version has no issues. This can&apos;t be undone.</>}
      />
    </>
  );
  return { run, create: () => setCreating(true), dialogs };
}

// ─── Bảng version ───────────────────────────────────────────────

type Tab = 'all' | VersionStatus;
const TABS: Array<{ id: Tab; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'UNRELEASED', label: 'Unreleased' },
  { id: 'RELEASED', label: 'Released' },
  { id: 'ARCHIVED', label: 'Archived' },
];

export function ReleasesList({ config, pid, onOpenVersion }: { config: ProjectConfig; pid: number; onOpenVersion: (id: number) => void }) {
  const canManage = config.permissions.manageSprints;
  const q = useQuery({ queryKey: wk.versions(pid), queryFn: () => workApi.versions(pid) });
  const versions = useMemo(() => q.data ?? [], [q.data]);
  const actions = useVersionActions(pid, versions);
  const [tab, setTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');

  const shown = versions.filter((v) => (tab === 'all' || v.status === tab) && (!search.trim() || v.name.toLowerCase().includes(search.trim().toLowerCase())));
  const counts = useMemo(() => {
    const c: Record<Tab, number> = { all: versions.length, UNRELEASED: 0, RELEASED: 0, ARCHIVED: 0 };
    versions.forEach((v) => { c[v.status] += 1; });
    return c;
  }, [versions]);

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-5">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="inline-flex overflow-hidden rounded-[6px] border border-[var(--w-border-strong)]" role="group" aria-label="Filter by status">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              aria-pressed={tab === t.id}
              className={cn('h-[28px] px-2.5 text-[12px] font-medium', tab === t.id ? 'bg-[var(--w-active)] text-[var(--w-text)]' : 'text-[var(--w-text-2)] hover:bg-[var(--w-hover)]')}
            >
              {t.label} <span className="tabular text-[var(--w-text-3)]">{counts[t.id]}</span>
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--w-text-3)]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search versions" className="w-input h-[28px] w-[180px] pl-7 text-[12px]" />
        </div>
        {canManage && (
          <button type="button" className="w-btn w-btn-primary w-btn-sm ml-auto" onClick={actions.create}>
            <Plus size={14} /> Create version
          </button>
        )}
      </div>

      {q.isLoading ? (
        <div className="flex justify-center py-16"><Spinner size={20} /></div>
      ) : q.error ? (
        <EmptyState title="Could not load versions" body={workError(q.error)} action={<button type="button" className="w-btn" onClick={() => q.refetch()}>Try again</button>} />
      ) : !versions.length ? (
        <EmptyState
          title="No versions yet"
          body="Versions group the issues you plan to ship together. Track progress toward a release date and publish release notes when it ships."
          action={canManage ? <button type="button" className="w-btn w-btn-primary" onClick={actions.create}><Plus size={14} /> Create version</button> : undefined}
        />
      ) : !shown.length ? (
        <EmptyState title="No versions match" body="Try another status or clear the search." />
      ) : (
        <div className="overflow-x-auto rounded-[var(--w-radius-lg)] border border-[var(--w-border)]">
          <table className="w-full min-w-[760px] border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-[var(--w-border)] bg-[var(--w-sunken)] text-left text-[11.5px] font-medium text-[var(--w-text-3)]">
                <th className="px-3 py-2 font-medium">Version</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Progress</th>
                <th className="px-3 py-2 font-medium">Start date</th>
                <th className="px-3 py-2 font-medium">Release date</th>
                <th className="px-3 py-2 font-medium">Description</th>
                <th className="w-10 px-2 py-2" />
              </tr>
            </thead>
            <tbody>
              {shown.map((v) => (
                <tr key={v.id} onClick={() => onOpenVersion(v.id)} className="cursor-pointer border-b border-[var(--w-border)] last:border-b-0 hover:bg-[var(--w-hover)]">
                  <td className="px-3 py-2.5">
                    <button type="button" onClick={(e) => { e.stopPropagation(); onOpenVersion(v.id); }} className="font-medium text-[var(--w-accent-text)] hover:underline">{v.name}</button>
                  </td>
                  <td className="px-3 py-2.5"><VersionStatusBadge status={v.status} /></td>
                  <td className="px-3 py-2.5"><Progress done={v.done} total={v.total} /></td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-[var(--w-text-2)]">{formatDate(v.startDate) || <span className="text-[var(--w-text-3)]">—</span>}</td>
                  <td className="whitespace-nowrap px-3 py-2.5">
                    <span className={v.overdue ? 'text-[var(--w-red)]' : 'text-[var(--w-text-2)]'}>{formatDate(v.releaseDate) || <span className="text-[var(--w-text-3)]">—</span>}</span>
                    {v.overdue && <span className="ml-1.5 rounded-[4px] bg-[color-mix(in_srgb,var(--w-red)_14%,transparent)] px-1.5 py-0.5 text-[10.5px] font-semibold uppercase text-[var(--w-red)]">Overdue</span>}
                  </td>
                  <td className="max-w-[280px] truncate px-3 py-2.5 text-[var(--w-text-2)]" title={v.description ?? undefined}>{v.description}</td>
                  <td className="px-2 py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                    {canManage && <ActionsMenu version={v} onAction={(a) => actions.run(v, a)} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {actions.dialogs}
    </div>
  );
}

// ─── Chi tiết một version ───────────────────────────────────────

function IssueGroup({ title, issues, lk, onOpenIssue }: { title: string; issues: IssueCard[]; lk: Lookups; onOpenIssue: (n: number) => void }) {
  if (!issues.length) return null;
  return (
    <div className="mb-4">
      <div className="mb-1.5 flex items-center gap-2 text-[11.5px] font-medium uppercase tracking-wide text-[var(--w-text-3)]">
        {title} <span className="tabular">{issues.length}</span>
      </div>
      <div className="overflow-hidden rounded-[var(--w-radius-lg)] border border-[var(--w-border)]">
        {issues.map((i) => {
          const st = lk.statuses.get(i.statusId);
          return (
            <button
              key={i.id}
              type="button"
              onClick={() => onOpenIssue(i.number)}
              className="flex w-full items-center gap-2 border-b border-[var(--w-border)] px-3 py-2 text-left last:border-b-0 hover:bg-[var(--w-hover)]"
            >
              <IssueTypeIcon type={lk.types.get(i.typeId)} size={13} />
              <span className={cn('shrink-0 font-mono text-[11.5px] text-[var(--w-text-3)]', st?.category === 'DONE' && 'line-through')}>{lk.issueKey(i.number)}</span>
              <span className="min-w-0 flex-1 truncate text-[13px]">{i.title}</span>
              <StatusBadge status={st} className="hidden sm:inline-flex" />
              <UserAvatar user={i.assigneeId ? lk.members.get(i.assigneeId) : null} size={20} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ReleaseNotes({ config, pid, version }: { config: ProjectConfig; pid: number; version: WorkVersion }) {
  const qc = useQueryClient();
  const canManage = config.permissions.manageSprints;
  const canAi = config.permissions.useAi && canManage;
  const [text, setText] = useState(version.releaseNotes ?? '');
  const [mode, setMode] = useState<'write' | 'preview'>(canManage ? 'write' : 'preview');
  const [audience, setAudience] = useState<'users' | 'team'>('users');
  const [language, setLanguage] = useState<'en' | 'vi'>('en');
  const [quota, setQuota] = useState<AiQuota | null>(null);
  const [upgrade, setUpgrade] = useState(false);
  const saved = version.releaseNotes ?? '';
  const dirty = text !== saved;

  // Server đổi (người khác lưu) mà mình chưa sửa gì ⇒ theo bản mới.
  const dirtyRef = useRef(dirty);
  dirtyRef.current = dirty;
  useEffect(() => { if (!dirtyRef.current) setText(version.releaseNotes ?? ''); }, [version.releaseNotes]);

  const save = useMutation({
    mutationFn: () => workApi.updateVersion(pid, version.id, { releaseNotes: text.trim() ? text : null }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: wk.versions(pid) });
      toast.success('Release notes saved');
    },
    onError: (err) => toast.error(workError(err, 'Could not save the release notes')),
  });
  const gen = useMutation({
    mutationFn: () => workApi.aiReleaseNotes(pid, version.id, { audience, language }),
    onSuccess: (r) => {
      setText(r.notes);
      setQuota(r.quota);
      setMode('write');
      toast.success('Draft ready — review it, then save');
    },
    onError: (err) => {
      if (isAiQuotaError(err)) setUpgrade(true);
      else toast.error(workError(err, 'The AI could not write release notes'));
    },
  });

  return (
    <div className="rounded-[var(--w-radius-lg)] border border-[var(--w-border)] bg-[var(--w-panel)]">
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--w-border)] px-3 py-2">
        <div className="text-[13px] font-semibold">Release notes</div>
        <div className="ml-auto inline-flex overflow-hidden rounded-[6px] border border-[var(--w-border-strong)]" role="tablist">
          {(['write', 'preview'] as const).filter((m) => canManage || m === 'preview').map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={cn('h-[24px] px-2 text-[12px] font-medium capitalize', mode === m ? 'bg-[var(--w-active)] text-[var(--w-text)]' : 'text-[var(--w-text-2)] hover:bg-[var(--w-hover)]')}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {canAi && (
        <div className="flex flex-wrap items-center gap-2 border-b border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2">
          <select className="w-input h-[28px] w-auto py-0 text-[12px]" value={audience} onChange={(e) => setAudience(e.target.value as 'users' | 'team')} aria-label="Audience">
            <option value="users">For users</option>
            <option value="team">For the team</option>
          </select>
          <select className="w-input h-[28px] w-auto py-0 text-[12px]" value={language} onChange={(e) => setLanguage(e.target.value as 'en' | 'vi')} aria-label="Language">
            <option value="en">English</option>
            <option value="vi">Vietnamese</option>
          </select>
          <button type="button" className="w-btn w-btn-sm" disabled={gen.isPending} onClick={() => gen.mutate()}>
            {gen.isPending ? <Spinner size={12} /> : <Sparkles size={13} className="text-[var(--w-accent-text)]" />} Generate with AI
          </button>
          {quota && (
            <span className="text-[11.5px] text-[var(--w-text-3)]">
              {quota.remaining === null ? 'Unlimited AI requests (Pro)' : `${quota.remaining} AI request${quota.remaining === 1 ? '' : 's'} left today`}
            </span>
          )}
        </div>
      )}

      <div className="p-3">
        {mode === 'write' && canManage ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={'Write release notes in Markdown.\n\n## New\n- …\n\n## Bug fixes\n- …'}
            className="w-input min-h-[280px] resize-y py-2 font-mono text-[12.5px] leading-relaxed"
            disabled={gen.isPending}
          />
        ) : text.trim() ? (
          <div className="w-prose min-w-0 overflow-x-hidden">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                table: ({ children }) => (
                  <div className="mb-2 max-w-full overflow-x-auto">
                    <table className="w-full border-collapse text-[13px] [&_td]:border [&_td]:border-[var(--w-border)] [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:border-[var(--w-border)] [&_th]:px-2 [&_th]:py-1 [&_th]:text-left">{children}</table>
                  </div>
                ),
                a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>,
              }}
            >
              {text}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="py-6 text-center text-[13px] text-[var(--w-text-3)]">No release notes yet.</p>
        )}
      </div>

      {canManage && (
        <div className="flex items-center justify-end gap-2 border-t border-[var(--w-border)] px-3 py-2">
          {dirty && <span className="mr-auto text-[12px] text-[var(--w-text-3)]">Unsaved changes</span>}
          {dirty && <button type="button" className="w-btn w-btn-sm" onClick={() => setText(saved)}>Discard</button>}
          <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={!dirty || save.isPending} onClick={() => save.mutate()}>
            {save.isPending && <Spinner size={12} />} Save
          </button>
        </div>
      )}
      <UpgradeDialog open={upgrade} onClose={() => setUpgrade(false)} limit={quota?.limit} />
    </div>
  );
}

export function VersionDetail({ config, pid, lk, versionId, onBack, onOpenIssue }: {
  config: ProjectConfig; pid: number; lk: Lookups; versionId: number; onBack: () => void; onOpenIssue: (n: number) => void;
}) {
  const canManage = config.permissions.manageSprints;
  const detail = useQuery({ queryKey: wk.version(pid, versionId), queryFn: () => workApi.version(pid, versionId) });
  const list = useQuery({ queryKey: wk.versions(pid), queryFn: () => workApi.versions(pid) });
  const versions = useMemo(() => list.data ?? [], [list.data]);
  const summary = versions.find((v) => v.id === versionId) ?? null;
  const actions = useVersionActions(pid, versions, onBack);

  const groups = useMemo(() => {
    const g = { done: [] as IssueCard[], progress: [] as IssueCard[], todo: [] as IssueCard[] };
    for (const i of detail.data?.issues ?? []) {
      const cat = lk.statuses.get(i.statusId)?.category;
      if (cat === 'DONE' || i.resolvedAt) g.done.push(i);
      else if (cat === 'IN_PROGRESS') g.progress.push(i);
      else g.todo.push(i);
    }
    return g;
  }, [detail.data, lk]);

  if (detail.isLoading) return <div className="flex justify-center py-16"><Spinner size={20} /></div>;
  if (detail.error || !detail.data) {
    return (
      <EmptyState
        title="Version not found"
        body={detail.error ? workError(detail.error) : 'It may have been deleted.'}
        action={<button type="button" className="w-btn" onClick={onBack}><ArrowLeft size={14} /> All versions</button>}
      />
    );
  }
  const v = detail.data.version;
  const total = detail.data.issues.length;

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-5">
      <button type="button" onClick={onBack} className="mb-3 inline-flex items-center gap-1 text-[12.5px] text-[var(--w-text-2)] hover:text-[var(--w-text)]">
        <ArrowLeft size={13} /> All versions
      </button>
      <div className="mb-5 flex flex-wrap items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-[20px] font-semibold">{v.name}</h1>
            <VersionStatusBadge status={v.status} />
            {summary?.overdue && <span className="rounded-[4px] bg-[color-mix(in_srgb,var(--w-red)_14%,transparent)] px-1.5 py-0.5 text-[10.5px] font-semibold uppercase text-[var(--w-red)]">Overdue</span>}
          </div>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-[var(--w-text-2)]">
            {v.startDate && <span>Start: {formatDate(v.startDate)}</span>}
            <span className={summary?.overdue ? 'text-[var(--w-red)]' : undefined}>Release: {formatDate(v.releaseDate) || 'Not set'}</span>
            {v.releasedAt && <span>Released {formatDate(v.releasedAt)}</span>}
          </div>
          {v.description && <p className="mt-2 max-w-[680px] whitespace-pre-wrap text-[13px] text-[var(--w-text-2)]">{v.description}</p>}
        </div>
        {canManage && summary && (
          <div className="flex items-center gap-2">
            {v.status === 'UNRELEASED' && (
              <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={() => actions.run(summary, 'release')}><Rocket size={13} /> Release</button>
            )}
            <ActionsMenu version={summary} onAction={(a) => actions.run(summary, a)} />
          </div>
        )}
      </div>

      {summary && <div className="mb-5 max-w-[420px]"><Progress done={summary.done} total={summary.total} wide /></div>}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)]">
        <div className="min-w-0">
          {total ? (
            <>
              <IssueGroup title="Done" issues={groups.done} lk={lk} onOpenIssue={onOpenIssue} />
              <IssueGroup title="In progress" issues={groups.progress} lk={lk} onOpenIssue={onOpenIssue} />
              <IssueGroup title="To do" issues={groups.todo} lk={lk} onOpenIssue={onOpenIssue} />
            </>
          ) : (
            <div className="rounded-[var(--w-radius-lg)] border border-dashed border-[var(--w-border-strong)] px-4 py-10 text-center text-[13px] text-[var(--w-text-2)]">
              No issues in this version yet. Set the <strong className="text-[var(--w-text)]">Fix version</strong> field on an issue to add it.
            </div>
          )}
        </div>
        <div className="min-w-0">
          {/* key theo version: đổi version là bỏ bản nháp của version cũ. */}
          <ReleaseNotes key={v.id} config={config} pid={pid} version={v} />
        </div>
      </div>
      {actions.dialogs}
    </div>
  );
}
