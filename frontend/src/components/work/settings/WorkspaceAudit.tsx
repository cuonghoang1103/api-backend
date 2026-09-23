'use client';

/**
 * Nhật ký quản trị của không gian: đổi quyền, xoá/khôi phục, link công khai,
 * GitHub, nhập dữ liệu… Chỉ quản trị không gian đọc được (backend trả 403).
 * Lọc theo dự án + hành động (backend lọc theo TIỀN TỐ mã hành động).
 */

import { useMemo, useState } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Database, FolderKanban, Lock, Plug, Share2, Users, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workApi, workError, workErrorStatus, type AuditItem } from '@/lib/work-api';
import { wk } from '../hooks';
import { EmptyState, relativeTime, Spinner } from '../ui';
import { Section, Select } from './shared';

type Group = 'members' | 'projects' | 'sharing' | 'integrations' | 'data' | 'other';

const GROUPS: Record<Group, { label: string; Icon: LucideIcon; color: string }> = {
  members: { label: 'Members', Icon: Users, color: 'var(--w-blue)' },
  projects: { label: 'Projects & workspace', Icon: FolderKanban, color: 'var(--w-accent-text)' },
  sharing: { label: 'Sharing', Icon: Share2, color: 'var(--w-green)' },
  integrations: { label: 'Integrations', Icon: Plug, color: 'var(--w-orange)' },
  data: { label: 'Data', Icon: Database, color: 'var(--w-red)' },
  other: { label: 'Other', Icon: Database, color: 'var(--w-text-3)' },
};

/** Mã hành động ⇒ nhãn + nhóm. Mã lạ vẫn hiện được (nhóm đoán theo tiền tố). */
const ACTIONS: Record<string, { label: string; group: Group }> = {
  'workspace.member_role': { label: 'Changed workspace role', group: 'members' },
  'workspace.member_remove': { label: 'Removed workspace member', group: 'members' },
  'project.member_role': { label: 'Changed project role', group: 'members' },
  'project.member_remove': { label: 'Removed project member', group: 'members' },
  'workspace.delete': { label: 'Deleted workspace', group: 'projects' },
  'workspace.restore': { label: 'Restored workspace', group: 'projects' },
  'project.delete': { label: 'Deleted project', group: 'projects' },
  'project.restore': { label: 'Restored project', group: 'projects' },
  'project.archive': { label: 'Archived project', group: 'projects' },
  'project.unarchive': { label: 'Unarchived project', group: 'projects' },
  'share.create': { label: 'Created public link', group: 'sharing' },
  'share.revoke': { label: 'Revoked public link', group: 'sharing' },
  'github.connect': { label: 'Connected GitHub', group: 'integrations' },
  'github.disconnect': { label: 'Disconnected GitHub', group: 'integrations' },
  'github.rotate_secret': { label: 'Rotated GitHub secret', group: 'integrations' },
  'project.import': { label: 'Imported issues', group: 'data' },
  'issue.delete': { label: 'Moved issue to trash', group: 'data' },
  'issue.restore': { label: 'Restored issue', group: 'data' },
  'issue.purge': { label: 'Permanently deleted issue', group: 'data' },
};

function describe(action: string): { label: string; group: Group } {
  const known = ACTIONS[action];
  if (known) return known;
  const [prefix, rest = ''] = action.split('.');
  const group: Group =
    prefix === 'share' ? 'sharing'
      : prefix === 'github' || prefix.includes('token') ? 'integrations'
        : prefix === 'issue' ? 'data'
          : rest.startsWith('member') ? 'members'
            : prefix === 'project' || prefix === 'workspace' ? 'projects' : 'other';
  const words = `${prefix} ${rest}`.replace(/[_.]/g, ' ').trim();
  return { label: words.charAt(0).toUpperCase() + words.slice(1), group };
}

/**
 * Tuỳ chọn lọc hành động. Backend lọc theo tiền tố ⇒ nhóm nào có chung một
 * tiền tố thì lọc cả nhóm, còn lại lọc từng mã.
 */
const FILTERS: Array<{ group: Group; options: Array<{ value: string; label: string }> }> = [
  { group: 'members', options: [
    { value: 'workspace.member_', label: 'Workspace member changes' },
    { value: 'project.member_', label: 'Project member changes' },
  ] },
  { group: 'projects', options: [
    { value: 'project.delete', label: 'Deleted project' },
    { value: 'project.restore', label: 'Restored project' },
    { value: 'project.archive', label: 'Archived project' },
    { value: 'project.unarchive', label: 'Unarchived project' },
    { value: 'workspace.delete', label: 'Deleted workspace' },
    { value: 'workspace.restore', label: 'Restored workspace' },
  ] },
  { group: 'sharing', options: [{ value: 'share.', label: 'All sharing events' }] },
  { group: 'integrations', options: [{ value: 'github.', label: 'All GitHub events' }] },
  { group: 'data', options: [
    { value: 'project.import', label: 'Imported issues' },
    { value: 'issue.', label: 'Issue deletions and restores' },
  ] },
];

const PAGE = 50;

function Row({ item }: { item: AuditItem }) {
  const d = describe(item.action);
  const g = GROUPS[d.group];
  const exact = new Date(item.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  return (
    <tr className="border-t border-[var(--w-border)] align-top">
      <td className="whitespace-nowrap px-3 py-2 text-[var(--w-text-2)]">
        <time dateTime={item.createdAt} title={exact}>{relativeTime(item.createdAt)}</time>
      </td>
      <td className="px-3 py-2">
        <span className="block max-w-[160px] truncate" title={item.actorName ?? undefined}>
          {item.actorName ?? <span className="text-[var(--w-text-3)]">System</span>}
        </span>
      </td>
      <td className="px-3 py-2">
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap" title={item.action}>
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px]" style={{ background: `color-mix(in srgb, ${g.color} 14%, transparent)`, color: g.color }}>
            <g.Icon size={12} />
          </span>
          {d.label}
        </span>
      </td>
      <td className="px-3 py-2 text-[var(--w-text-2)]"><span className="break-words">{item.summary}</span></td>
      <td className="px-3 py-2">
        {item.project ? (
          <span className="inline-flex h-[20px] max-w-[140px] items-center rounded-[4px] border border-[var(--w-border-strong)] px-1.5 font-mono text-[11px] text-[var(--w-text-2)]" title={item.project.name}>
            <span className="truncate">{item.project.key}</span>
          </span>
        ) : (
          <span className="text-[12px] text-[var(--w-text-3)]">Workspace</span>
        )}
      </td>
    </tr>
  );
}

export default function WorkspaceAudit({ workspaceId }: { workspaceId: number }) {
  const [projectId, setProjectId] = useState<number | null>(null);
  const [action, setAction] = useState('');

  // Danh sách dự án cho ô lọc: tìm slug của không gian rồi dùng chung cache wk.workspace(slug).
  const wsList = useQuery({ queryKey: wk.workspaces, queryFn: () => workApi.workspaces(), staleTime: 60_000 });
  const slug = wsList.data?.find((w) => w.id === workspaceId)?.slug;
  const ws = useQuery({ queryKey: wk.workspace(slug ?? ''), queryFn: () => workApi.workspaceBySlug(slug!), enabled: !!slug, staleTime: 60_000 });

  const q = useInfiniteQuery({
    queryKey: [...wk.audit(workspaceId), projectId, action],
    queryFn: ({ pageParam }) => workApi.audit(workspaceId, { projectId: projectId ?? undefined, action: action || undefined, before: pageParam, limit: PAGE }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (last) => last.nextBefore ?? undefined,
    retry: (n, err) => workErrorStatus(err) !== 403 && n < 2,
  });
  const items = useMemo(() => q.data?.pages.flatMap((p) => p.items) ?? [], [q.data]);

  // Dự án đã xoá không còn trong không gian nhưng vẫn có trong nhật ký ⇒ gộp cả hai nguồn.
  const projects = useMemo(() => {
    const m = new Map<number, { id: number; key: string; name: string }>();
    ws.data?.projects.forEach((p) => m.set(p.id, { id: p.id, key: p.key, name: p.name }));
    items.forEach((i) => i.project && !m.has(i.project.id) && m.set(i.project.id, i.project));
    return [...m.values()].sort((a, b) => a.key.localeCompare(b.key));
  }, [ws.data, items]);

  if (q.isError && workErrorStatus(q.error) === 403) {
    return (
      <Section title="Audit log">
        <div className="flex items-start gap-2.5 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-4 py-3 text-[13px] text-[var(--w-text-2)]">
          <Lock size={14} className="mt-0.5 shrink-0" />
          <span>Only workspace owners and admins can view the audit log. Ask an admin if you need to know who changed something.</span>
        </div>
      </Section>
    );
  }

  const filtered = projectId !== null || !!action;

  return (
    <Section
      title="Audit log"
      description="Administrative changes across the workspace — roles, deletions and restores, public links, integrations and imports. Everyday issue edits are in each issue’s history."
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Select value={projectId ?? ''} onChange={(e) => setProjectId(e.target.value ? Number(e.target.value) : null)} aria-label="Filter by project" className="w-full sm:w-[220px]">
          <option value="">All projects</option>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.key} — {p.name}</option>)}
        </Select>
        <Select value={action} onChange={(e) => setAction(e.target.value)} aria-label="Filter by action" className="w-full sm:w-[260px]">
          <option value="">All actions</option>
          {FILTERS.map((f) => (
            <optgroup key={f.group} label={GROUPS[f.group].label}>
              {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </optgroup>
          ))}
        </Select>
        {filtered && (
          <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => { setProjectId(null); setAction(''); }}>Clear filters</button>
        )}
      </div>

      {q.isLoading ? (
        <div className="flex justify-center py-10"><Spinner /></div>
      ) : q.isError ? (
        <p className="text-[13px] text-[var(--w-red)]">{workError(q.error, 'Could not load the audit log')}</p>
      ) : !items.length ? (
        <div className="rounded-[8px] border border-dashed border-[var(--w-border-strong)]">
          <EmptyState title={filtered ? 'No matching events' : 'No events yet'} body={filtered ? 'Try another project or action.' : 'Administrative changes will be recorded here.'} />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-[8px] border border-[var(--w-border)]">
            <table className="w-full min-w-[760px] border-collapse text-[12.5px]">
              <thead className="bg-[var(--w-sunken)] text-left text-[11px] font-medium uppercase tracking-wide text-[var(--w-text-3)]">
                <tr>
                  <th className="w-[96px] px-3 py-2">Time</th>
                  <th className="w-[150px] px-3 py-2">Actor</th>
                  <th className="w-[220px] px-3 py-2">Action</th>
                  <th className="px-3 py-2">Details</th>
                  <th className="w-[100px] px-3 py-2">Project</th>
                </tr>
              </thead>
              <tbody>{items.map((i) => <Row key={i.id} item={i} />)}</tbody>
            </table>
          </div>
          <div className={cn('mt-3 flex items-center gap-3', !q.hasNextPage && 'text-[12px] text-[var(--w-text-3)]')}>
            {q.hasNextPage ? (
              <button type="button" className="w-btn w-btn-sm" disabled={q.isFetchingNextPage} onClick={() => void q.fetchNextPage()}>
                {q.isFetchingNextPage && <Spinner size={12} />}
                Load more
              </button>
            ) : (
              <span>{items.length} {items.length === 1 ? 'event' : 'events'} · end of log</span>
            )}
          </div>
        </>
      )}
    </Section>
  );
}
