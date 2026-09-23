'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowDown, ArrowUp, Check, Copy, Download } from 'lucide-react';
import { userName, workApi, workError, type ContributionRow, type ProjectConfig } from '@/lib/work-api';
import { wk } from '@/components/work/hooks';
import { EmptyState, Spinner, UserAvatar } from '@/components/work/ui';
import { cn } from '@/lib/utils';
import { num, unitLabel, useAllSprints, useReportableSprints } from './shared';

type SortKey = 'name' | 'resolved' | 'points' | 'subtasks' | 'created' | 'comments' | 'updates' | 'open';

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'range';

export default function ContributionsTab({ pid, config }: { pid: number; config: ProjectConfig }) {
  const sprintsQ = useAllSprints(pid);
  const sprints = useReportableSprints(sprintsQ.data);
  const [range, setRange] = useState('all');
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'points', dir: 'desc' });
  const [copied, setCopied] = useState(false);

  // "Last N days" tính một lần mỗi khi đổi lựa chọn — tính trong render thì khoá query đổi mỗi mili giây.
  const params = useMemo(() => {
    if (range === '7d' || range === '30d') {
      const days = range === '7d' ? 7 : 30;
      return { from: new Date(Date.now() - days * 86_400_000).toISOString(), to: new Date().toISOString() };
    }
    if (range.startsWith('s:')) return { sprintId: Number(range.slice(2)) };
    return {};
  }, [range]);

  const rangeName = useMemo(() => {
    if (range === '7d') return 'Last 7 days';
    if (range === '30d') return 'Last 30 days';
    if (range.startsWith('s:')) return sprints.find((s) => s.id === Number(range.slice(2)))?.name ?? 'Sprint';
    return 'All time';
  }, [range, sprints]);

  const q = useQuery({
    queryKey: [...wk.reports(pid), 'contributions', range],
    queryFn: () => workApi.contributions(pid, params),
  });

  const u = unitLabel(q.data?.unit);
  const rows = useMemo(() => {
    const list = [...(q.data?.members ?? [])];
    const val = (r: ContributionRow) => (sort.key === 'name' ? userName(r.user).toLowerCase() : r[sort.key]);
    list.sort((a, b) => {
      const x = val(a), y = val(b);
      const c = x < y ? -1 : x > y ? 1 : 0;
      return sort.dir === 'asc' ? c : -c;
    });
    return list;
  }, [q.data, sort]);

  const table = () => {
    const header = ['Member', 'Username', 'Completed issues', `Points (${u})`, 'Share %', 'Sub-tasks done', 'Created', 'Comments', 'Updates', 'Open now'];
    const body = rows.map((r) => [userName(r.user), r.user.username, r.resolved, num(r.points), r.share, r.subtasks, r.created, r.comments, r.updates, r.open].map(String));
    return [header, ...body];
  };

  const exportCsv = () => {
    const esc = (v: string) => (/[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
    const csv = table().map((r) => r.map(esc).join(',')).join('\r\n');
    // BOM để Excel đọc đúng UTF-8 (tên tiếng Việt).
    const blob = new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.key}-contributions-${slug(rangeName)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const copyText = async () => {
    const text = table().map((r) => r.map((c) => c.replace(/[\t\n]/g, ' ')).join('\t')).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard bị chặn (http, quyền) — không có gì để làm */
    }
  };

  const th = (k: SortKey, label: string, right?: boolean) => {
    const on = sort.key === k;
    return (
      <th key={k} className={cn('px-3 py-2 font-medium', right && 'text-right')} aria-sort={on ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
        <button
          type="button"
          onClick={() => setSort((s) => ({ key: k, dir: s.key === k ? (s.dir === 'asc' ? 'desc' : 'asc') : k === 'name' ? 'asc' : 'desc' }))}
          className={cn('inline-flex items-center gap-1 uppercase tracking-wide hover:text-[var(--w-text)]', on && 'text-[var(--w-text)]')}
        >
          {label}
          {on && (sort.dir === 'asc' ? <ArrowUp size={11} /> : <ArrowDown size={11} />)}
        </button>
      </th>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <select aria-label="Time range" value={range} onChange={(e) => setRange(e.target.value)} className="w-input h-[28px] w-auto max-w-full py-0 pr-7 text-[12px]">
          <option value="all">All time</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          {sprints.length > 0 && (
            <optgroup label="Sprints">
              {sprints.map((s) => (
                <option key={s.id} value={`s:${s.id}`}>{s.name}{s.state === 'ACTIVE' ? ' (active)' : ''}</option>
              ))}
            </optgroup>
          )}
        </select>
        <div className="ml-auto flex items-center gap-2">
          <button type="button" className="w-btn w-btn-sm" onClick={copyText} disabled={!rows.length}>
            {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copied' : 'Copy as text'}
          </button>
          <button type="button" className="w-btn w-btn-sm" onClick={exportCsv} disabled={!rows.length}>
            <Download size={12} /> Export CSV
          </button>
        </div>
      </div>
      <p className="text-[12px] text-[var(--w-text-3)]">
        Counts come from issue history. Work done by the AI assistant or automation is not credited to anyone.
      </p>

      {q.isLoading ? (
        <div className="flex justify-center py-16"><Spinner size={20} /></div>
      ) : q.error ? (
        <EmptyState title="Could not load contributions" body={workError(q.error)} action={<button type="button" className="w-btn" onClick={() => q.refetch()}>Try again</button>} />
      ) : !rows.length ? (
        <EmptyState title="No activity in this range" body="Try a wider time range." />
      ) : (
        <div className="overflow-x-auto rounded-[var(--w-radius-lg)] border border-[var(--w-border)] bg-[var(--w-panel)]">
          <table className="w-full min-w-[860px] text-[13px]">
            <thead>
              <tr className="border-b border-[var(--w-border)] text-left text-[11px] text-[var(--w-text-3)]">
                {th('name', 'Member')}
                {th('resolved', 'Completed', true)}
                {th('points', 'Points')}
                {th('subtasks', 'Sub-tasks', true)}
                {th('created', 'Created', true)}
                {th('comments', 'Comments', true)}
                {th('updates', 'Updates', true)}
                {th('open', 'Open now', true)}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.user.id} className="border-b border-[var(--w-border)] last:border-0">
                  <td className="px-3 py-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <UserAvatar user={r.user} size={22} />
                      <div className="min-w-0">
                        <div className="truncate font-medium">{userName(r.user)}</div>
                        <div className="truncate text-[11px] text-[var(--w-text-3)]">@{r.user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.resolved}</td>
                  <td className="w-[200px] px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="w-14 shrink-0 tabular-nums">{num(r.points)} {u}</span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--w-sunken)]" title={`${r.share}% of team ${u === 'h' ? 'hours' : 'points'}`}>
                        <div className="h-full rounded-full bg-[var(--w-accent)]" style={{ width: `${Math.min(100, Math.max(0, r.share))}%` }} />
                      </div>
                      <span className="w-9 shrink-0 text-right text-[11px] tabular-nums text-[var(--w-text-3)]">{r.share}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.subtasks}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.created}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.comments}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.updates}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-[var(--w-text-2)]">{r.open}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
