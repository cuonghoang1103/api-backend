'use client';

/**
 * SERVICE DESK — /work/<ws>/<KEY>/desk (đợt S5a, mô-đun serviceDesk). Bốn thẻ:
 *   Queues   — hàng đợi (All open · Unassigned · My open · At risk · Breached · Waiting for customer · By team ·
 *              Resolved) với hai đồng hồ SLA đếm ngược (first response, resolution), lọc + sắp xếp, tự tải lại 30 giây;
 *   Problems — Problem gom nhiều Incident, "Create postmortem" ⇒ trang Docs;
 *   Reports  — % đạt theo tháng × P, MTTR, vi phạm, CSAT, xuất .xlsx;
 *   Settings — loại yêu cầu, ma trận Impact × Urgency, mục tiêu SLA, lịch làm việc, trạng thái tạm dừng (ADMIN sửa).
 * Mọi số liệu SLA do server tính (slaRules.ts) — giao diện chỉ hiển thị.
 */

import Link from 'next/link';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  BarChart3, CalendarClock, FileDown, FileText, Headset, Inbox, Link2, Plus, Save, Search, Settings2, Siren, Trash2, Unlink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { userName, workError, type ProjectConfig } from '@/lib/work-api';
import {
  DESK_LEVELS, DESK_PRIORITIES, LEVEL_LABEL, PROBLEM_STATUSES, PROBLEM_STATUS_LABEL, deskApi, deskKeys,
  type DeskLevel, type DeskPriority, type DeskSettings, type Matrix, type ProblemStatus, type QueueItem, type QueueView, type RequestTypeConfig,
  type RequestTypeKey, type SlaGoal,
} from '@/lib/work-s5a-api';
import { Dialog, EmptyState, Field, PageLoading, Spinner, StatusBadge, UserAvatar, formatDate, relativeTime } from '../ui';
import { Select } from '../settings/shared';
import { Pill } from '../studio/shared';
import { PersonSelect } from '../governance/shared';
import { PriorityBadge, SlaClock, VIEW_LABEL, minutesText } from './shared';
import { wt } from '@/components/work/i18n';
import DataTable, { type DataColumn } from '../table/DataTable';

type Tab = 'queues' | 'problems' | 'reports' | 'settings';
const VIEWS: QueueView[] = ['open', 'unassigned', 'mine', 'at_risk', 'breached', 'waiting', 'team', 'resolved'];
const TYPE_KEYS: RequestTypeKey[] = ['INCIDENT', 'SERVICE_REQUEST', 'QUESTION', 'CHANGE'];
const TYPE_SHORT: Record<RequestTypeKey, string> = { get INCIDENT() { return wt('desk.typeIncident'); }, get SERVICE_REQUEST() { return wt('desk.typeServiceRequest'); }, get QUESTION() { return wt('desk.typeQuestion'); }, get CHANGE() { return wt('desk.typeChange'); } };
const dayNames = () => wt('desk.dayNames').split(',');

function useDeskInvalidate(pid: number) {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: deskKeys.all(pid) });
    for (const k of ['issue', 'issues', 'board', 'backlog']) qc.invalidateQueries({ queryKey: ['work', k] });
  };
}

function save(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

// ═══ Queues ═══════════════════════════════════════════════════════

function QueuesTab({ config }: { config: ProjectConfig }) {
  const pid = config.id;
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const view = (VIEWS.includes(search?.get('view') as QueueView) ? search!.get('view') : 'open') as QueueView;
  const [teamId, setTeamId] = useState<number | null>(null);
  const [type, setType] = useState<RequestTypeKey | ''>('');
  const [prio, setPrio] = useState<DeskPriority | ''>('');
  const [text, setText] = useState('');
  const [sort, setSort] = useState('sla');
  const [creating, setCreating] = useState(false);
  const extra = `${teamId ?? ''}|${type}|${prio}|${text}|${sort}`;
  const q = useQuery({
    queryKey: deskKeys.queue(pid, view, extra),
    queryFn: () => deskApi.queue(pid, { view, teamId: view === 'team' ? teamId : null, requestType: type, priority: prio, q: text.trim() || undefined, sort }),
    refetchInterval: 30_000,
  });
  const fetchedAt = q.dataUpdatedAt || Date.now();
  const setView = (v: QueueView) => {
    const p = new URLSearchParams(search?.toString());
    p.set('tab', 'queues');
    p.set('view', v);
    router.replace(`${pathname}?${p.toString()}`, { scroll: false });
  };
  const base = `/work/${config.workspace.slug}/${config.key}`;
  return (
    <div>
      <div className="-mx-4 mb-3 overflow-x-auto px-4">
        <div className="flex gap-1.5" role="tablist" aria-label={wt('desk.queues')}>
          {VIEWS.map((v) => {
            const n = q.data?.counts[v];
            const alert = (v === 'breached' || v === 'at_risk') && !!n;
            return (
              <button key={v} type="button" role="tab" aria-selected={view === v} onClick={() => setView(v)} data-testid={`desk-view-${v}`}
                className={cn('flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[7px] border px-2.5 text-[12.5px] font-medium',
                  view === v ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : 'border-[var(--w-border)] text-[var(--w-text-2)] hover:bg-[var(--w-hover)]')}>
                {VIEW_LABEL[v]}
                {n !== undefined && (
                  <span className="rounded-full px-1.5 text-[11px] tabular-nums" style={alert ? { background: `color-mix(in srgb, var(--w-${v === 'breached' ? 'red' : 'orange'}) 18%, transparent)`, color: `var(--w-${v === 'breached' ? 'red' : 'orange'})` } : { background: 'var(--w-sunken)' }}>{n}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <label className="relative min-w-[180px] flex-1 sm:max-w-[280px]">
          <Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--w-text-3)]" />
          <input className="w-input !h-8 !pl-7" placeholder={wt('desk.searchKeyTitle')} value={text} onChange={(e) => setText(e.target.value)} aria-label={wt('desk.searchRequests')} />
        </label>
        {view === 'team' && (
          <Select aria-label={wt('desk.team')} className="!h-8 !w-auto" value={teamId ?? ''} onChange={(e) => setTeamId(e.target.value ? Number(e.target.value) : null)}>
            <option value="">{wt('desk.allTeams')}</option>
            {(q.data?.teams ?? []).map((t) => <option key={t.id} value={t.id}>{t.key} · {t.name}</option>)}
          </Select>
        )}
        <Select aria-label={wt('desk.requestType')} className="!h-8 !w-auto" value={type} onChange={(e) => setType(e.target.value as RequestTypeKey | '')}>
          <option value="">{wt('desk.allTypes')}</option>
          {TYPE_KEYS.map((k) => <option key={k} value={k}>{TYPE_SHORT[k]}</option>)}
        </Select>
        <Select aria-label={wt('common.priority')} className="!h-8 !w-auto" value={prio} onChange={(e) => setPrio(e.target.value as DeskPriority | '')}>
          <option value="">{wt('desk.allPriorities')}</option>
          {DESK_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
        </Select>
        <Select aria-label={wt('common.sort')} className="!h-8 !w-auto" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="sla">{wt('desk.sortSla')}</option>
          <option value="priority">{wt('desk.sortPriority')}</option>
          <option value="created">{wt('desk.sortNewest')}</option>
          <option value="updated">{wt('desk.sortUpdated')}</option>
        </Select>
        {config.permissions.workDesk && (
          <button type="button" className="w-btn w-btn-primary w-btn-sm ml-auto" onClick={() => setCreating(true)} data-testid="desk-new"><Plus size={14} /> {wt('desk.newRequest')}</button>
        )}
      </div>
      {q.isLoading ? <PageLoading rows={5} /> : q.error ? <EmptyState title={wt('desk.loadQueueFailed')} body={workError(q.error)} /> : !q.data?.items.length ? (
        <EmptyState icon={<Inbox size={20} />} title={view === 'breached' ? wt('desk.noBreached') : view === 'at_risk' ? wt('desk.nothingAtRisk') : wt('desk.noRequests')} body={wt('desk.noRequestsBody')} />
      ) : (
        <>
          {/* Bảng ≥ lg — UX-C: bảng chung (sắp xếp theo cột, chọn/ẩn cột, xuất CSV/xlsx, bàn phím). Thứ tự gốc vẫn theo ô "Sort". */}
          <div className="w-card hidden overflow-hidden lg:block">
            <DataTable
              id="desk-queue"
              label={VIEW_LABEL[view]}
              rows={q.data.items}
              columns={deskColumns(base, fetchedAt)}
              rowKey={(r) => r.number}
              height="auto"
              quickFilter={false}
              onRowOpen={(r) => router.push(`${base}/issue/${r.number}`)}
              exportName={`${config.key}-desk-${view}`}
              testId="desk-queue"
            />
          </div>
          {/* Thẻ < lg */}
          <ul className="space-y-2 lg:hidden" data-testid="desk-queue-cards">
            {q.data.items.map((r) => <QueueCard key={r.number} r={r} base={base} fetchedAt={fetchedAt} />)}
          </ul>
          {q.data.truncated && <p className="mt-2 text-[12px] text-[var(--w-text-3)]">{wt('desk.showingFirst500')}</p>}
        </>
      )}
      <NewRequestDialog config={config} open={creating} onClose={() => setCreating(false)} />
    </div>
  );
}

const PRIO_RANK: Record<string, number> = { P1: 1, P2: 2, P3: 3, P4: 4 };
/** Phút còn lại của đồng hồ SLA (đã dừng ⇒ cuối danh sách). */
const slaLeft = (t: QueueItem['firstResponse']) => (t.stopped ? null : t.remainingMin);

function deskColumns(base: string, fetchedAt: number): DataColumn<QueueItem>[] {
  return [
    {
      id: 'request', header: wt('desk.request'), width: 320, grow: true, required: true,
      value: (r) => r.title, text: (r) => `${r.key} ${r.title} ${r.requestTypeName}`, exportValue: (r) => `${r.key} ${r.title}`,
      cell: (r) => (
        <Link href={`${base}/issue/${r.number}`} className="block min-w-0" data-testid={`desk-row-${r.number}`}>
          <span className="flex min-w-0 items-center gap-2">
            <span className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)]">{r.key}</span>
            <span className="truncate font-medium">{r.title}</span>
          </span>
          <span className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-[var(--w-text-3)]">
            {r.requestTypeName}{r.channel === 'PORTAL' && wt('desk.portalSuffix')}{r.waiting && <Pill tone="neutral" className="!h-[18px] !px-1.5 !text-[11px]">{wt('desk.waitingCustomer')}</Pill>}
          </span>
        </Link>
      ),
    },
    { id: 'priority', header: 'P', width: 56, headerTitle: wt('common.priority'), value: (r) => PRIO_RANK[r.priority] ?? 9, exportValue: (r) => r.priority, cell: (r) => <PriorityBadge p={r.priority} /> },
    { id: 'type', header: wt('desk.requestType'), width: 140, defaultHidden: true, value: (r) => r.requestTypeName },
    { id: 'team', header: wt('desk.team'), width: 110, defaultHidden: true, value: (r) => r.team?.key ?? null },
    { id: 'requester', header: wt('desk.requester'), width: 150, value: (r) => (r.requester ? userName(r.requester) : null), cell: (r) => <Person u={r.requester} /> },
    { id: 'assignee', header: wt('common.assignee'), width: 150, value: (r) => (r.assignee ? userName(r.assignee) : null), cell: (r) => <Person u={r.assignee} empty={wt('common.unassigned')} /> },
    { id: 'status', header: wt('common.status'), width: 130, value: (r) => r.status.name, cell: (r) => <StatusBadge status={r.status} /> },
    { id: 'first', header: wt('desk.firstResponse'), width: 140, value: (r) => slaLeft(r.firstResponse), exportValue: (r) => r.firstResponse.label, cell: (r) => <SlaClock t={r.firstResponse} fetchedAt={fetchedAt} compact label={wt('desk.firstResponse')} /> },
    { id: 'resolution', header: wt('desk.resolution'), width: 140, value: (r) => slaLeft(r.resolution), exportValue: (r) => r.resolution.label, cell: (r) => <SlaClock t={r.resolution} fetchedAt={fetchedAt} compact label={wt('desk.resolution')} /> },
    { id: 'created', header: wt('common.created'), width: 110, align: 'right', value: (r) => r.createdAt, exportValue: (r) => r.createdAt.slice(0, 10), cell: (r) => <span className="whitespace-nowrap text-[12px] text-[var(--w-text-3)]">{relativeTime(r.createdAt)}</span> },
    { id: 'updated', header: wt('common.updated'), width: 110, align: 'right', defaultHidden: true, value: (r) => r.updatedAt, exportValue: (r) => r.updatedAt.slice(0, 10), cell: (r) => <span className="whitespace-nowrap text-[12px] text-[var(--w-text-3)]">{relativeTime(r.updatedAt)}</span> },
  ];
}

function Person({ u, empty = '—' }: { u: QueueItem['assignee']; empty?: string }) {
  if (!u) return <span className="text-[12px] text-[var(--w-text-3)]">{empty}</span>;
  return <span className="flex min-w-0 items-center gap-1.5"><UserAvatar user={u} size={18} /><span className="max-w-[110px] truncate text-[12.5px]">{userName(u)}</span></span>;
}

function QueueCard({ r, base, fetchedAt }: { r: QueueItem; base: string; fetchedAt: number }) {
  return (
    <li className="w-card">
      <Link href={`${base}/issue/${r.number}`} className="block px-3.5 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <PriorityBadge p={r.priority} />
          <span className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)]">{r.key}</span>
          <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium">{r.title}</span>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-[var(--w-text-3)]">
          <StatusBadge status={r.status} />
          <span>{r.requestTypeName}</span>
          {r.waiting && <span>{wt('desk.waitingCustomerDot')}</span>}
          <span>· {r.assignee ? userName(r.assignee) : wt('common.unassigned')}</span>
        </div>
        <div className="mt-2.5 grid grid-cols-2 gap-3">
          <div><div className="mb-0.5 text-[11px] text-[var(--w-text-3)]">{wt('desk.firstResponse')}</div><SlaClock t={r.firstResponse} fetchedAt={fetchedAt} /></div>
          <div><div className="mb-0.5 text-[11px] text-[var(--w-text-3)]">{wt('desk.resolution')}</div><SlaClock t={r.resolution} fetchedAt={fetchedAt} /></div>
        </div>
      </Link>
    </li>
  );
}

/** Nhân viên ghi một yêu cầu thay khách (điện thoại, chat) — hoặc đưa một thẻ có sẵn vào service desk. */
export function NewRequestDialog({ config, open, onClose, issueNumber }: { config: ProjectConfig; open: boolean; onClose: () => void; issueNumber?: number }) {
  const pid = config.id;
  const invalidate = useDeskInvalidate(pid);
  const settings = useQuery({ queryKey: deskKeys.settings(pid), queryFn: () => deskApi.settings(pid), enabled: open });
  const [type, setType] = useState<RequestTypeKey>('INCIDENT');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [impact, setImpact] = useState<DeskLevel>('MEDIUM');
  const [urgency, setUrgency] = useState<DeskLevel>('MEDIUM');
  const [requester, setRequester] = useState<number | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const t = settings.data?.requestTypes.find((x) => x.key === type);
  useEffect(() => { if (t) { setImpact(t.defaultImpact); setUrgency(t.defaultUrgency); setFields({}); } }, [t]);
  useEffect(() => { if (open) { setTitle(''); setDesc(''); setRequester(null); } }, [open]);
  const p = settings.data ? settings.data.matrix[impact][urgency] : null;
  const router = useRouter();
  const create = useMutation({
    mutationFn: () => deskApi.createTicket(pid, { requestType: type, impact, urgency, requesterId: requester, fields, ...(issueNumber ? { issueNumber } : { title, description: desc || null }) }),
    onSuccess: () => {
      toast.success(issueNumber ? wt('desk.addedToDesk') : wt('desk.requestLogged'));
      invalidate();
      onClose();
      if (!issueNumber) router.refresh();
    },
    onError: (err) => toast.error(workError(err, wt('desk.saveRequestFailed'))),
  });
  return (
    <Dialog open={open} onClose={onClose} title={issueNumber ? wt('desk.addToDesk') : wt('desk.logRequestTitle')} width={600}
      footer={<>
        <button type="button" className="w-btn" onClick={onClose}>{wt('common.cancel')}</button>
        <button type="button" className="w-btn w-btn-primary" disabled={create.isPending || (!issueNumber && !title.trim())} onClick={() => create.mutate()} data-testid="desk-create">
          {create.isPending ? <Spinner size={12} /> : <Plus size={13} />} {issueNumber ? wt('common.add') : wt('desk.logRequest')}
        </button>
      </>}>
      {settings.isLoading ? <PageLoading rows={3} /> : (
        <div className="space-y-1">
          <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
            <Field label={wt('desk.requestType')}>
              <Select aria-label={wt('desk.requestType')} value={type} onChange={(e) => setType(e.target.value as RequestTypeKey)}>
                {(settings.data?.requestTypes ?? []).map((x) => <option key={x.key} value={x.key}>{x.name}{x.enabled ? '' : wt('desk.hiddenFromPortal')}</option>)}
              </Select>
            </Field>
            <Field label={wt('desk.requester')} hint={wt('desk.requesterHint')}>
              <PersonSelect config={config} value={requester} onChange={setRequester} label={wt('desk.requester')} empty={wt('desk.notRecorded')} />
            </Field>
          </div>
          {!issueNumber && (
            <>
              <Field label={wt('common.title')}><input className="w-input" value={title} maxLength={255} onChange={(e) => setTitle(e.target.value)} autoFocus data-testid="desk-title" /></Field>
              <Field label={wt('desk.details')}><textarea className="w-input min-h-[80px] py-2" value={desc} onChange={(e) => setDesc(e.target.value)} /></Field>
            </>
          )}
          {t?.fields.map((f) => (
            <Field key={f.key} label={`${f.label}${f.required ? ' *' : ''}`}>
              {f.kind === 'textarea'
                ? <textarea className="w-input min-h-[64px] py-2" value={fields[f.key] ?? ''} onChange={(e) => setFields((x) => ({ ...x, [f.key]: e.target.value }))} />
                : <input type={f.kind === 'date' ? 'date' : 'text'} className="w-input" value={fields[f.key] ?? ''} onChange={(e) => setFields((x) => ({ ...x, [f.key]: e.target.value }))} />}
            </Field>
          ))}
          <div className="grid grid-cols-2 gap-x-3 sm:grid-cols-[1fr_1fr_auto]">
            <Field label={wt('desk.impact')}><Select aria-label={wt('desk.impact')} value={impact} onChange={(e) => setImpact(e.target.value as DeskLevel)}>{DESK_LEVELS.map((l) => <option key={l} value={l}>{LEVEL_LABEL[l]}</option>)}</Select></Field>
            <Field label={wt('desk.urgency')}><Select aria-label={wt('desk.urgency')} value={urgency} onChange={(e) => setUrgency(e.target.value as DeskLevel)}>{DESK_LEVELS.map((l) => <option key={l} value={l}>{LEVEL_LABEL[l]}</option>)}</Select></Field>
            <Field label={wt('common.priority')}><div className="flex h-9 items-center">{p && <PriorityBadge p={p} long />}</div></Field>
          </div>
          {p && settings.data && <p className="text-[12px] text-[var(--w-text-3)]">{wt('desk.respondWithin', { a: settings.data.targetsText[p].respond, b: settings.data.targetsText[p].resolve })}</p>}
        </div>
      )}
    </Dialog>
  );
}

// ═══ Problems ══════════════════════════════════════════════════════

const PROBLEM_TONE: Record<ProblemStatus, 'orange' | 'blue' | 'accent' | 'green' | 'neutral'> = { OPEN: 'orange', INVESTIGATING: 'blue', KNOWN_ERROR: 'accent', RESOLVED: 'green', CLOSED: 'neutral' };

function parseNums(s: string): number[] {
  return [...new Set(s.split(/[\s,;]+/).map((x) => Number(x.replace(/^[A-Z][A-Z0-9]*-/i, ''))).filter((n) => Number.isInteger(n) && n > 0))];
}

function ProblemsTab({ config }: { config: ProjectConfig }) {
  const pid = config.id;
  const q = useQuery({ queryKey: deskKeys.problems(pid), queryFn: () => deskApi.problems(pid) });
  const search = useSearchParams();
  const [open, setOpen] = useState<number | null>(Number(search?.get('problem')) || null);
  const [creating, setCreating] = useState(false);
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <p className="min-w-0 flex-1 text-[13px] text-[var(--w-text-2)]">{wt('desk.problemIntro')}</p>
        {q.data?.canWork && <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={() => setCreating(true)} data-testid="problem-new"><Plus size={14} /> {wt('desk.newProblem')}</button>}
      </div>
      {q.isLoading ? <PageLoading rows={3} /> : q.error ? <EmptyState title={wt('desk.loadProblemsFailed')} body={workError(q.error)} /> : !q.data?.items.length ? (
        <EmptyState icon={<Siren size={20} />} title={wt('desk.noProblems')} body={wt('desk.noProblemsBody')} />
      ) : (
        <ul className="w-card overflow-hidden" data-testid="problem-list">
          {q.data.items.map((p) => (
            <li key={p.number} className="border-b border-[var(--w-border)] last:border-b-0">
              <button type="button" onClick={() => setOpen(p.number)} className="flex w-full min-w-0 flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 text-left hover:bg-[var(--w-hover)]">
                <span className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)]">{p.key}</span>
                <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium">{p.title}</span>
                <span className="text-[12px] text-[var(--w-text-3)]">{wt('desk.nIncidents', { count: p.incidentCount })}</span>
                {p.postmortem && <span className="flex items-center gap-1 text-[12px] text-[var(--w-text-3)]"><FileText size={12} />{wt('desk.postmortem')}</span>}
                <Pill tone={PROBLEM_TONE[p.status]}>{PROBLEM_STATUS_LABEL[p.status]}</Pill>
              </button>
            </li>
          ))}
        </ul>
      )}
      <NewProblemDialog config={config} open={creating} onClose={() => setCreating(false)} onCreated={(n) => setOpen(n)} />
      <ProblemDialog config={config} num={open} onClose={() => setOpen(null)} />
    </div>
  );
}

function NewProblemDialog({ config, open, onClose, onCreated }: { config: ProjectConfig; open: boolean; onClose: () => void; onCreated: (n: number) => void }) {
  const invalidate = useDeskInvalidate(config.id);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [incidents, setIncidents] = useState('');
  useEffect(() => { if (open) { setTitle(''); setDesc(''); setIncidents(''); } }, [open]);
  const create = useMutation({
    mutationFn: () => deskApi.createProblem(config.id, { title, description: desc || null, incidentNumbers: parseNums(incidents) }),
    onSuccess: (p) => { toast.success(wt('desk.keyCreated', { key: p.key })); invalidate(); onClose(); onCreated(p.number); },
    onError: (err) => toast.error(workError(err, wt('desk.createProblemFailed'))),
  });
  return (
    <Dialog open={open} onClose={onClose} title={wt('desk.newProblem')} width={560}
      footer={<><button type="button" className="w-btn" onClick={onClose}>{wt('common.cancel')}</button><button type="button" className="w-btn w-btn-primary" disabled={!title.trim() || create.isPending} onClick={() => create.mutate()} data-testid="problem-create">{create.isPending ? <Spinner size={12} /> : <Plus size={13} />} {wt('common.create')}</button></>}>
      <Field label={wt('common.title')}><input className="w-input" value={title} maxLength={255} autoFocus onChange={(e) => setTitle(e.target.value)} placeholder={wt('desk.problemTitlePh')} data-testid="problem-title" /></Field>
      <Field label={wt('common.description')}><textarea className="w-input min-h-[72px] py-2" value={desc} onChange={(e) => setDesc(e.target.value)} /></Field>
      <Field label={wt('desk.incidents')} hint={wt('desk.incidentsHint', { a: `${config.key}-12`, b: `${config.key}-15` })}><input className="w-input" value={incidents} onChange={(e) => setIncidents(e.target.value)} data-testid="problem-incidents" /></Field>
    </Dialog>
  );
}

function ProblemDialog({ config, num, onClose }: { config: ProjectConfig; num: number | null; onClose: () => void }) {
  const pid = config.id;
  const invalidate = useDeskInvalidate(pid);
  const q = useQuery({ queryKey: deskKeys.problem(pid, num ?? 0), queryFn: () => deskApi.problem(pid, num!), enabled: !!num, refetchInterval: 60_000 });
  const p = q.data;
  const [f, setF] = useState({ title: '', description: '', rootCause: '', workaround: '', status: 'OPEN' as ProblemStatus, ownerId: null as number | null });
  const [link, setLink] = useState('');
  useEffect(() => { if (p) setF({ title: p.title, description: p.description ?? '', rootCause: p.rootCause ?? '', workaround: p.workaround ?? '', status: p.status, ownerId: p.ownerId }); }, [p]);
  const router = useRouter();
  const base = `/work/${config.workspace.slug}/${config.key}`;
  const saveP = useMutation({
    mutationFn: () => deskApi.updateProblem(pid, num!, { title: f.title, description: f.description || null, rootCause: f.rootCause || null, workaround: f.workaround || null, status: f.status, ownerId: f.ownerId }),
    onSuccess: () => { toast.success(wt('common.saved')); invalidate(); },
    onError: (err) => toast.error(workError(err, wt('common.couldNotSave'))),
  });
  const linkM = useMutation({ mutationFn: () => deskApi.linkIncidents(pid, num!, parseNums(link)), onSuccess: () => { setLink(''); invalidate(); }, onError: (err) => toast.error(workError(err, wt('desk.linkFailed'))) });
  const unlink = useMutation({ mutationFn: (n: number) => deskApi.unlinkIncident(pid, num!, n), onSuccess: () => invalidate(), onError: (err) => toast.error(workError(err)) });
  const pm = useMutation({
    mutationFn: () => deskApi.postmortem(pid, num!),
    onSuccess: (r) => { toast.success(wt('desk.postmortemCreated')); invalidate(); router.push(`${base}/docs/${r.pageNumber}`); },
    onError: (err) => toast.error(workError(err, wt('desk.createPostmortemFailed'))),
  });
  const ro = !p?.canWork;
  const fetchedAt = q.dataUpdatedAt || Date.now();
  return (
    <Dialog open={!!num} onClose={onClose} width={760} title={p ? <span className="flex min-w-0 items-center gap-2"><span className="font-mono text-[13px] text-[var(--w-accent-text)]">{p.key}</span><span className="truncate">{p.title}</span></span> : wt('common.loading')}
      footer={p && !ro ? <>
        {p.postmortem
          ? <Link href={`${base}/docs/${p.postmortem.number}`} className="w-btn mr-auto"><FileText size={13} /> {wt('desk.openPostmortem')}</Link>
          : p.docsEnabled && <button type="button" className="w-btn mr-auto" disabled={pm.isPending} onClick={() => pm.mutate()} data-testid="problem-postmortem">{pm.isPending ? <Spinner size={12} /> : <FileText size={13} />} {wt('desk.createPostmortem')}</button>}
        <button type="button" className="w-btn w-btn-primary" disabled={!f.title.trim() || saveP.isPending} onClick={() => saveP.mutate()} data-testid="problem-save">{saveP.isPending ? <Spinner size={12} /> : <Save size={13} />} {wt('common.save')}</button>
      </> : undefined}>
      {q.isLoading || !p ? <PageLoading rows={4} /> : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-[1fr_180px_180px]">
            <Field label={wt('common.title')}><input className="w-input" value={f.title} disabled={ro} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field>
            <Field label={wt('common.status')}>
              <Select aria-label={wt('common.status')} value={f.status} disabled={ro} onChange={(e) => setF({ ...f, status: e.target.value as ProblemStatus })}>
                {PROBLEM_STATUSES.map((s) => <option key={s} value={s}>{PROBLEM_STATUS_LABEL[s]}</option>)}
              </Select>
            </Field>
            <Field label={wt('desk.owner')}><PersonSelect config={config} value={f.ownerId} onChange={(v) => setF({ ...f, ownerId: v })} label={wt('desk.owner')} staffOnly disabled={ro} /></Field>
          </div>
          <Field label={wt('common.description')}><textarea className="w-input min-h-[60px] py-2" disabled={ro} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></Field>
          <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
            <Field label={wt('desk.rootCause')}><textarea className="w-input min-h-[70px] py-2" disabled={ro} value={f.rootCause} onChange={(e) => setF({ ...f, rootCause: e.target.value })} placeholder={wt('desk.rootCausePh')} /></Field>
            <Field label={wt('desk.workaround')}><textarea className="w-input min-h-[70px] py-2" disabled={ro} value={f.workaround} onChange={(e) => setF({ ...f, workaround: e.target.value })} /></Field>
          </div>
          <section>
            <h3 className="w-section-title mb-2">{wt('desk.linkedIncidents')}</h3>
            {p.incidents.length ? (
              <ul className="overflow-hidden rounded-[8px] border border-[var(--w-border)]" data-testid="problem-incidents-list">
                {p.incidents.map((i) => (
                  <li key={i.number} className="grid grid-cols-[1fr_auto] items-center gap-2 border-b border-[var(--w-border)] px-3 py-2 last:border-b-0 sm:grid-cols-[1fr_120px_120px_auto]">
                    <Link href={`${base}/issue/${i.number}`} className="flex min-w-0 items-center gap-2 text-[13px]">
                      <PriorityBadge p={i.priority} />
                      <span className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)]">{i.key}</span>
                      <span className="truncate">{i.title}</span>
                    </Link>
                    <div className="hidden sm:block"><SlaClock t={i.firstResponse} fetchedAt={fetchedAt} compact label={wt('desk.firstResponse')} /></div>
                    <div className="hidden sm:block"><SlaClock t={i.resolution} fetchedAt={fetchedAt} compact label={wt('desk.resolution')} /></div>
                    {!ro && <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={wt('desk.unlinkKey', { key: i.key })} onClick={() => unlink.mutate(i.number)}><Unlink size={13} /></button>}
                  </li>
                ))}
              </ul>
            ) : <p className="text-[13px] text-[var(--w-text-3)]">{wt('desk.noIncidentsLinked')}</p>}
            {!ro && (
              <div className="mt-2 flex gap-2">
                <input className="w-input !h-8" placeholder={`${config.key}-12, ${config.key}-15`} value={link} onChange={(e) => setLink(e.target.value)} aria-label={wt('desk.incidentsToLink')} />
                <button type="button" className="w-btn w-btn-sm shrink-0" disabled={!parseNums(link).length || linkM.isPending} onClick={() => linkM.mutate()}><Link2 size={13} /> {wt('desk.link')}</button>
              </div>
            )}
            {!p.docsEnabled && <p className="mt-2 text-[12px] text-[var(--w-text-3)]">{wt('desk.turnOnDocs')}</p>}
          </section>
        </div>
      )}
    </Dialog>
  );
}

// ═══ Reports ═══════════════════════════════════════════════════════

const pct = (v: number | null) => (v === null ? '—' : `${v}%`);
const hours = (m: number | null) => (m === null ? '—' : m < 60 ? `${Math.round(m)}m` : `${Math.round((m / 60) * 10) / 10}h`);

function Kpi({ label, value, sub, tone }: { label: string; value: ReactNode; sub?: ReactNode; tone?: 'red' | 'orange' | 'green' }) {
  return (
    <div className="w-card min-w-0 px-4 py-3">
      <div className="text-[12px] font-medium text-[var(--w-text-3)]">{label}</div>
      <div className="mt-1 text-[20px] font-semibold leading-tight tabular-nums tracking-[-0.015em]" style={tone ? { color: `var(--w-${tone})` } : undefined}>{value}</div>
      {sub && <div className="mt-0.5 text-[12px] text-[var(--w-text-3)]">{sub}</div>}
    </div>
  );
}

const toneOf = (v: number | null) => (v === null ? undefined : v >= 90 ? 'green' as const : v >= 75 ? 'orange' as const : 'red' as const);

function ReportsTab({ config }: { config: ProjectConfig }) {
  const pid = config.id;
  const [months, setMonths] = useState(6);
  const [p, setP] = useState<'ALL' | DeskPriority>('ALL');
  const [exporting, setExporting] = useState(false);
  const q = useQuery({ queryKey: deskKeys.report(pid, months), queryFn: () => deskApi.report(pid, months) });
  const base = `/work/${config.workspace.slug}/${config.key}`;
  const exportX = async () => {
    setExporting(true);
    try { save(await deskApi.reportXlsx(pid, months), `${config.key}-service-desk-sla.xlsx`); } catch (err) { toast.error(workError(err, wt('desk.exportFailed'))); } finally { setExporting(false); }
  };
  if (q.isLoading) return <PageLoading rows={5} />;
  if (q.error || !q.data) return <EmptyState title={wt('desk.loadReportFailed')} body={workError(q.error)} />;
  const r = q.data;
  const tot = r.byPriority[p];
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1" role="tablist" aria-label={wt('common.priority')}>
          {(['ALL', ...DESK_PRIORITIES] as const).map((x) => (
            <button key={x} type="button" role="tab" aria-selected={p === x} onClick={() => setP(x)}
              className={cn('h-8 rounded-[7px] border px-2.5 text-[12.5px] font-medium', p === x ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : 'border-[var(--w-border)] text-[var(--w-text-2)] hover:bg-[var(--w-hover)]')}>
              {x === 'ALL' ? wt('desk.allPriorities') : x}
            </button>
          ))}
        </div>
        <Select aria-label={wt('desk.period')} className="!h-8 !w-auto" value={months} onChange={(e) => setMonths(Number(e.target.value))}>
          {[3, 6, 12].map((n) => <option key={n} value={n}>{wt('desk.lastNMonths', { n })}</option>)}
        </Select>
        <button type="button" className="w-btn w-btn-sm ml-auto" disabled={exporting} onClick={() => void exportX()} data-testid="desk-export">{exporting ? <Spinner size={12} /> : <FileDown size={13} />} {wt('desk.exportXlsx')}</button>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Kpi label={wt('desk.respondedOnTime')} value={pct(tot.frPercent)} sub={wt('desk.withOutcome', { a: tot.frMet, b: tot.frDone })} tone={toneOf(tot.frPercent)} />
        <Kpi label={wt('desk.resolvedOnTime')} value={pct(tot.resPercent)} sub={wt('desk.withOutcome', { a: tot.resMet, b: tot.resDone })} tone={toneOf(tot.resPercent)} />
        <Kpi label="MTTR" value={hours(tot.mttrMin)} sub={wt('desk.mttrSub')} />
        <Kpi label={wt('desk.breaches')} value={tot.breaches} sub={wt('desk.nRequests', { count: tot.tickets })} tone={tot.breaches ? 'red' : undefined} />
        <Kpi label="CSAT" value={tot.csatAvg === null ? '—' : `${tot.csatAvg}/5`} sub={`${tot.csatCount} rating${tot.csatCount === 1 ? '' : 's'}`} />
      </div>
      <section className="w-card overflow-x-auto">
        <table className="w-full min-w-[640px] text-[13px]" data-testid="desk-report-table">
          <thead>
            <tr className="border-b border-[var(--w-border)] text-left text-[11.5px] font-medium uppercase tracking-[0.04em] text-[var(--w-text-3)]">
              <th className="px-3 py-2">{wt('desk.month')}</th><th className="px-2 py-2 text-right">{wt('desk.requests')}</th><th className="px-2 py-2">{wt('desk.frMet')}</th><th className="px-2 py-2">{wt('desk.resMet')}</th>
              <th className="px-2 py-2 text-right">{wt('desk.breaches')}</th><th className="px-2 py-2 text-right">MTTR</th><th className="px-3 py-2 text-right">CSAT</th>
            </tr>
          </thead>
          <tbody>
            {[...r.months].reverse().map((m) => {
              const c = r.cells[m][p];
              return (
                <tr key={m} className="border-b border-[var(--w-border)] last:border-b-0">
                  <td className="px-3 py-2 font-medium tabular-nums">{m}</td>
                  <td className="px-2 py-2 text-right tabular-nums">{c.tickets}</td>
                  <td className="px-2 py-2"><Bar v={c.frPercent} /></td>
                  <td className="px-2 py-2"><Bar v={c.resPercent} /></td>
                  <td className="px-2 py-2 text-right tabular-nums" style={c.breaches ? { color: 'var(--w-red-text)' } : undefined}>{c.breaches}</td>
                  <td className="px-2 py-2 text-right tabular-nums">{hours(c.mttrMin)}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{c.csatAvg === null ? '—' : c.csatAvg}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="w-card p-4">
          <h2 className="w-section-title mb-2">{wt('desk.recentBreaches')}</h2>
          {r.breaches.length ? (
            <ul className="space-y-1.5 text-[13px]">
              {r.breaches.map((b, i) => (
                <li key={`${b.number}-${b.target}-${i}`} className="flex min-w-0 items-center gap-2">
                  <PriorityBadge p={b.priority} />
                  <Link href={`${base}/issue/${b.number}`} className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)]">{b.key}</Link>
                  <span className="min-w-0 flex-1 truncate">{b.title}</span>
                  <span className="shrink-0 text-[12px] text-[var(--w-text-3)]">{b.target === 'FIRST_RESPONSE' ? wt('desk.responseLc') : wt('desk.resolutionLc')} · {formatDate(b.at)}</span>
                </li>
              ))}
            </ul>
          ) : <p className="text-[13px] text-[var(--w-text-3)]">{wt('desk.noBreachesPeriod')}</p>}
        </section>
        <section className="w-card p-4">
          <h2 className="w-section-title mb-2">{wt('desk.customerFeedback')}</h2>
          {r.feedback.length ? (
            <ul className="space-y-2 text-[13px]">
              {r.feedback.map((f) => (
                <li key={f.number} className="min-w-0">
                  <div className="flex min-w-0 items-center gap-2"><Stars n={f.rating} /><Link href={`${base}/issue/${f.number}`} className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)]">{f.key}</Link><span className="truncate text-[var(--w-text-3)]">{f.title}</span></div>
                  {f.comment && <p className="mt-0.5 text-[12.5px] text-[var(--w-text-2)] [overflow-wrap:anywhere]">“{f.comment}”</p>}
                </li>
              ))}
            </ul>
          ) : <p className="text-[13px] text-[var(--w-text-3)]">{wt('desk.noCsat')}</p>}
        </section>
      </div>
      <p className="text-[12px] text-[var(--w-text-3)]">{wt('desk.metNote', { tz: r.timezone })}</p>
    </div>
  );
}

function Bar({ v }: { v: number | null }) {
  if (v === null) return <span className="text-[var(--w-text-3)]">—</span>;
  const color = v >= 90 ? 'var(--w-green)' : v >= 75 ? 'var(--w-orange)' : 'var(--w-red)';
  return (
    <span className="flex items-center gap-2">
      <span className="h-1.5 w-[80px] overflow-hidden rounded-full bg-[var(--w-sunken)]"><span className="block h-full rounded-full" style={{ width: `${v}%`, background: color }} /></span>
      <span className="tabular-nums">{v}%</span>
    </span>
  );
}

export function Stars({ n }: { n: number }) {
  return <span className="shrink-0 tabular-nums text-[var(--w-orange)]" aria-label={wt('desk.outOf5', { n })}>{'★'.repeat(n)}<span className="text-[var(--w-text-3)] opacity-50">{'★'.repeat(5 - n)}</span></span>;
}

// ═══ Settings ══════════════════════════════════════════════════════

const toHm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const fromHm = (s: string) => { const [h, m] = s.split(':').map(Number); return (h || 0) * 60 + (m || 0); };
/** Mục tiêu bằng chữ theo đúng loại đồng hồ: giờ làm ⇒ "3 business days" (ngày = độ dài ngày làm), 24/7 ⇒ "1d 3h". */
function goalText(min: number, cal: SlaGoal['calendar'], perDay: number): string {
  if (cal === 'ALWAYS') return minutesText(min);
  if (min >= perDay) {
    const d = Math.floor(min / perDay);
    const r = min - d * perDay;
    return `${wt('desk.businessDays', { count: d })}${r ? ` ${minutesText(r)}` : ''}`;
  }
  return wt('desk.businessSuffix', { t: minutesText(min) });
}
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').replace(/^(\d)/, 'f$1').slice(0, 32) || 'field';

function SettingsTab({ config }: { config: ProjectConfig }) {
  const pid = config.id;
  const invalidate = useDeskInvalidate(pid);
  const q = useQuery({ queryKey: deskKeys.settings(pid), queryFn: () => deskApi.settings(pid) });
  const [s, setS] = useState<DeskSettings | null>(null);
  const [holidayText, setHolidayText] = useState('');
  useEffect(() => { if (q.data) { setS(q.data); setHolidayText(q.data.calendar.holidays.join('\n')); } }, [q.data]);
  const saveM = useMutation({
    mutationFn: () => deskApi.saveSettings(pid, {
      timezone: s!.calendar.timezone, workDays: s!.calendar.workDays, workStart: s!.calendar.startMin, workEnd: s!.calendar.endMin,
      holidays: holidayText.split(/[\s,]+/).map((x) => x.trim()).filter(Boolean),
      goals: s!.goals, matrix: s!.matrix, requestTypes: s!.requestTypes, pauseStatusIds: s!.pauseStatusIds, responseStatusIds: s!.responseStatusIds, atRiskPercent: s!.atRiskPercent,
    }),
    onSuccess: () => { toast.success(wt('desk.settingsSaved')); invalidate(); },
    onError: (err) => toast.error(workError(err, wt('common.couldNotSave'))),
  });
  if (q.isLoading || !s) return <PageLoading rows={6} />;
  const ro = !s.canConfigure;
  const perDay = Math.max(1, s.calendar.endMin - s.calendar.startMin);
  const setCal = (patch: Partial<DeskSettings['calendar']>) => setS({ ...s, calendar: { ...s.calendar, ...patch } });
  const setGoal = (p: DeskPriority, patch: Partial<SlaGoal>) => setS({ ...s, goals: { ...s.goals, [p]: { ...s.goals[p], ...patch } } });
  const setType = (k: RequestTypeKey, patch: Partial<RequestTypeConfig>) => setS({ ...s, requestTypes: s.requestTypes.map((t) => (t.key === k ? { ...t, ...patch } : t)) });
  const setCell = (i: DeskLevel, u: DeskLevel, p: DeskPriority) => setS({ ...s, matrix: { ...s.matrix, [i]: { ...s.matrix[i], [u]: p } } as Matrix });
  const toggleId = (list: number[], id: number) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  const addVnHolidays = () => {
    const y = new Date().getFullYear();
    const extra = [y, y + 1].flatMap((yy) => ['01-01', '04-30', '05-01', '09-02'].map((md) => `${yy}-${md}`));
    setHolidayText([...new Set([...holidayText.split(/\s+/).filter(Boolean), ...extra])].sort().join('\n'));
  };
  return (
    <div className="space-y-4">
      {ro && <p className="rounded-[8px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2 text-[12.5px] text-[var(--w-text-2)]">{wt('desk.onlyAdmin')}</p>}
      {!s.saved && <p className="rounded-[8px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2 text-[12.5px] text-[var(--w-text-2)]">{wt('desk.usingDefaults')}</p>}

      <section className="w-card p-4 md:p-5">
        <h2 className="w-section-title mb-3 flex items-center gap-2"><CalendarClock size={15} /> {wt('desk.workingHours')}</h2>
        <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-[1fr_120px_120px]">
          <Field label={wt('desk.timeZone')} hint={wt('desk.timeZoneHint')}><input className="w-input" disabled={ro} value={s.calendar.timezone} onChange={(e) => setCal({ timezone: e.target.value })} /></Field>
          <Field label={wt('desk.start')}><input type="time" className="w-input" disabled={ro} value={toHm(s.calendar.startMin)} onChange={(e) => setCal({ startMin: fromHm(e.target.value) })} /></Field>
          <Field label={wt('desk.end')}><input type="time" className="w-input" disabled={ro} value={toHm(s.calendar.endMin === 1440 ? 1439 : s.calendar.endMin)} onChange={(e) => setCal({ endMin: fromHm(e.target.value) })} /></Field>
        </div>
        <div className="mb-3 flex flex-wrap gap-1.5" role="group" aria-label={wt('desk.workingDays')}>
          {dayNames().map((n, i) => {
            const on = s.calendar.workDays.includes(i + 1);
            return (
              <button key={n} type="button" disabled={ro} aria-pressed={on} onClick={() => setCal({ workDays: on ? s.calendar.workDays.filter((d) => d !== i + 1) : [...s.calendar.workDays, i + 1].sort() })}
                className={cn('h-8 w-12 rounded-[7px] border text-[12.5px] font-medium', on ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : 'border-[var(--w-border)] text-[var(--w-text-3)]')}>{n}</button>
            );
          })}
        </div>
        <Field label={wt('desk.holidays')} hint={wt('desk.holidaysHint')}>
          <textarea className="w-input min-h-[90px] py-2 font-mono text-[12.5px]" disabled={ro} value={holidayText} onChange={(e) => setHolidayText(e.target.value)} />
        </Field>
        {!ro && <button type="button" className="w-btn w-btn-sm" onClick={addVnHolidays}><Plus size={13} /> {wt('desk.addVnHolidays')}</button>}
      </section>

      <section className="w-card p-4 md:p-5">
        <h2 className="w-section-title mb-3 flex items-center gap-2"><BarChart3 size={15} /> {wt('desk.slaGoals')}</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-[13px]">
            <thead><tr className="text-left text-[11.5px] uppercase tracking-[0.04em] text-[var(--w-text-3)]"><th className="py-1.5 pr-2">{wt('common.priority')}</th><th className="px-2 py-1.5">{wt('desk.frMin')}</th><th className="px-2 py-1.5">{wt('desk.resMin')}</th><th className="px-2 py-1.5">{wt('desk.clock')}</th></tr></thead>
            <tbody>
              {DESK_PRIORITIES.map((p) => (
                <tr key={p} className="border-t border-[var(--w-border)]">
                  <td className="py-2 pr-2"><PriorityBadge p={p} long /></td>
                  <td className="px-2 py-2"><input type="number" min={1} className="w-input !h-8 !w-[110px]" disabled={ro} value={s.goals[p].firstResponseMin} onChange={(e) => setGoal(p, { firstResponseMin: Number(e.target.value) })} aria-label={wt('desk.pFrMinutes', { p })} /> <span className="text-[12px] text-[var(--w-text-3)]">{goalText(s.goals[p].firstResponseMin, s.goals[p].calendar, perDay)}</span></td>
                  <td className="px-2 py-2"><input type="number" min={1} className="w-input !h-8 !w-[110px]" disabled={ro} value={s.goals[p].resolutionMin} onChange={(e) => setGoal(p, { resolutionMin: Number(e.target.value) })} aria-label={wt('desk.pResMinutes', { p })} /> <span className="text-[12px] text-[var(--w-text-3)]">{goalText(s.goals[p].resolutionMin, s.goals[p].calendar, perDay)}</span></td>
                  <td className="px-2 py-2">
                    <Select aria-label={wt('desk.pClock', { p })} className="!h-8 !w-auto" disabled={ro} value={s.goals[p].calendar} onChange={(e) => setGoal(p, { calendar: e.target.value as SlaGoal['calendar'] })}>
                      <option value="BUSINESS">{wt('desk.workingHours')}</option>
                      <option value="ALWAYS">24/7</option>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px]">
          <span>{wt('desk.atRiskWhen')}</span>
          <input type="number" min={10} max={99} className="w-input !h-8 !w-[80px]" disabled={ro} value={s.atRiskPercent} onChange={(e) => setS({ ...s, atRiskPercent: Number(e.target.value) })} aria-label={wt('desk.atRiskThreshold')} />
          <span>{wt('desk.goalUsed')}</span>
        </div>
      </section>

      <section className="w-card p-4 md:p-5">
        <h2 className="w-section-title mb-1">{wt('desk.matrixTitle')}</h2>
        <p className="mb-3 text-[12.5px] text-[var(--w-text-3)]">{wt('desk.matrixDesc')}</p>
        <div className="overflow-x-auto">
          <table className="text-[13px]">
            <thead><tr><th className="p-1.5 text-left text-[11.5px] uppercase text-[var(--w-text-3)]">{wt('desk.matrixHead')}</th>{DESK_LEVELS.map((u) => <th key={u} className="p-1.5 text-[12px] font-medium">{LEVEL_LABEL[u]}</th>)}</tr></thead>
            <tbody>
              {DESK_LEVELS.map((i) => (
                <tr key={i}>
                  <th className="p-1.5 text-left text-[12px] font-medium">{LEVEL_LABEL[i]}</th>
                  {DESK_LEVELS.map((u) => (
                    <td key={u} className="p-1.5">
                      <Select aria-label={wt('desk.cellAria', { i: LEVEL_LABEL[i], u: LEVEL_LABEL[u] })} className="!h-8 !w-[76px]" disabled={ro} value={s.matrix[i][u]} onChange={(e) => setCell(i, u, e.target.value as DeskPriority)}>
                        {DESK_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                      </Select>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="w-card p-4 md:p-5">
        <h2 className="w-section-title mb-3">{wt('desk.requestTypes')}</h2>
        <div className="space-y-3">
          {s.requestTypes.map((t) => (
            <div key={t.key} className="rounded-[10px] border border-[var(--w-border)] p-3">
              <div className="flex flex-wrap items-center gap-2">
                <label className="flex items-center gap-2 text-[13px] font-medium"><input type="checkbox" disabled={ro} checked={t.enabled} onChange={(e) => setType(t.key, { enabled: e.target.checked })} />{TYPE_SHORT[t.key]}</label>
                <span className="text-[12px] text-[var(--w-text-3)]">{t.enabled ? wt('desk.shownInPortal') : wt('desk.hidden')}</span>
              </div>
              <div className="mt-2 grid grid-cols-1 gap-x-3 sm:grid-cols-2">
                <Field label={wt('desk.nameClients')}><input className="w-input" disabled={ro} value={t.name} maxLength={60} onChange={(e) => setType(t.key, { name: e.target.value })} /></Field>
                <Field label={wt('common.description')}><input className="w-input" disabled={ro} value={t.description} maxLength={200} onChange={(e) => setType(t.key, { description: e.target.value })} /></Field>
              </div>
              <div className="grid grid-cols-2 gap-x-3 sm:grid-cols-[1fr_1fr_auto]">
                <Field label={wt('desk.defaultImpact')}><Select aria-label={wt('desk.defaultImpact')} disabled={ro} value={t.defaultImpact} onChange={(e) => setType(t.key, { defaultImpact: e.target.value as DeskLevel })}>{DESK_LEVELS.map((l) => <option key={l} value={l}>{LEVEL_LABEL[l]}</option>)}</Select></Field>
                <Field label={wt('desk.defaultUrgency')}><Select aria-label={wt('desk.defaultUrgency')} disabled={ro} value={t.defaultUrgency} onChange={(e) => setType(t.key, { defaultUrgency: e.target.value as DeskLevel })}>{DESK_LEVELS.map((l) => <option key={l} value={l}>{LEVEL_LABEL[l]}</option>)}</Select></Field>
                <Field label={wt('desk.defaultP')}><div className="flex h-9 items-center"><PriorityBadge p={s.matrix[t.defaultImpact][t.defaultUrgency]} /></div></Field>
              </div>
              <label className="flex items-center gap-2 text-[12.5px]"><input type="checkbox" disabled={ro} checked={t.askImpact} onChange={(e) => setType(t.key, { askImpact: e.target.checked })} />{wt('desk.askImpact')}</label>
              {t.key === 'CHANGE' && <label className="mt-1 flex items-center gap-2 text-[12.5px]"><input type="checkbox" disabled={ro} checked={t.useChangeRequest !== false} onChange={(e) => setType(t.key, { useChangeRequest: e.target.checked })} />{wt('desk.alsoCr')}</label>}
              <div className="mt-2">
                <div className="mb-1 text-[12px] font-medium text-[var(--w-text-3)]">{wt('desk.formFields')}</div>
                {t.fields.map((f, idx) => (
                  <div key={idx} className="mb-1.5 flex flex-wrap items-center gap-1.5">
                    <input className="w-input !h-8 min-w-[160px] flex-1" disabled={ro} value={f.label} onChange={(e) => setType(t.key, { fields: t.fields.map((x, j) => (j === idx ? { ...x, label: e.target.value } : x)) })} aria-label={wt('desk.fieldLabel')} />
                    <Select aria-label={wt('desk.fieldKind')} className="!h-8 !w-auto" disabled={ro} value={f.kind} onChange={(e) => setType(t.key, { fields: t.fields.map((x, j) => (j === idx ? { ...x, kind: e.target.value as typeof f.kind } : x)) })}>
                      <option value="text">{wt('desk.shortText')}</option><option value="textarea">{wt('desk.longText')}</option><option value="date">{wt('desk.date')}</option>
                    </Select>
                    <label className="flex items-center gap-1 text-[12px]"><input type="checkbox" disabled={ro} checked={f.required} onChange={(e) => setType(t.key, { fields: t.fields.map((x, j) => (j === idx ? { ...x, required: e.target.checked } : x)) })} />{wt('desk.required')}</label>
                    {!ro && <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={wt('desk.removeField')} onClick={() => setType(t.key, { fields: t.fields.filter((_, j) => j !== idx) })}><Trash2 size={13} /></button>}
                  </div>
                ))}
                {!ro && t.fields.length < 8 && (
                  <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => {
                    const label = wt('desk.newField');
                    let key = slug(label); let n = 2;
                    while (t.fields.some((f) => f.key === key)) key = `${slug(label)}_${n++}`;
                    setType(t.key, { fields: [...t.fields, { key, label, kind: 'text', required: false }] });
                  }}><Plus size={13} /> {wt('desk.addField')}</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="w-card p-4 md:p-5">
        <h2 className="w-section-title mb-1">{wt('desk.statuses')}</h2>
        <p className="mb-3 text-[12.5px] text-[var(--w-text-3)]">{wt('desk.statusesDesc')}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {(['pauseStatusIds', 'responseStatusIds'] as const).map((k) => (
            <div key={k}>
              <div className="mb-1.5 text-[12.5px] font-medium">{k === 'pauseStatusIds' ? wt('desk.pausesLabel') : wt('desk.countsFr')}</div>
              <ul className="max-h-[220px] space-y-1 overflow-y-auto rounded-[8px] border border-[var(--w-border)] p-2">
                {s.statuses.map((st) => (
                  <li key={st.id}>
                    <label className="flex items-center gap-2 text-[12.5px]">
                      <input type="checkbox" disabled={ro} checked={s[k].includes(st.id)} onChange={() => setS({ ...s, [k]: toggleId(s[k], st.id) })} />
                      <span className="truncate">{st.name}</span>
                      <span className="truncate text-[11.5px] text-[var(--w-text-3)]">· {st.workflow}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="w-card p-4 md:p-5">
        <h2 className="w-section-title mb-2">{wt('desk.howSla')}</h2>
        <ul className="list-disc space-y-1 pl-5 text-[13px] text-[var(--w-text-2)]">{s.rules.map((r) => <li key={r}>{r}</li>)}</ul>
      </section>

      {!ro && (
        <div className="sticky bottom-0 -mx-4 flex justify-end border-t border-[var(--w-border)] bg-[var(--w-bg)] px-4 py-3">
          <button type="button" className="w-btn w-btn-primary" disabled={saveM.isPending} onClick={() => saveM.mutate()} data-testid="desk-settings-save">{saveM.isPending ? <Spinner size={12} /> : <Save size={13} />} {wt('desk.saveSettings')}</button>
        </div>
      )}
    </div>
  );
}

// ═══ Khung ════════════════════════════════════════════════════════

export default function DeskView({ config }: { config: ProjectConfig }) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const tabs = useMemo(() => {
    const t: Array<{ id: Tab; label: string; icon: typeof Headset }> = [
      { id: 'queues', label: wt('desk.queues'), icon: Inbox },
      { id: 'problems', label: wt('desk.problems'), icon: Siren },
      { id: 'reports', label: wt('desk.reports'), icon: BarChart3 },
      { id: 'settings', label: wt('common.settings'), icon: Settings2 },
    ];
    return t;
  }, []);
  const raw = search?.get('tab') as Tab | null;
  const tab: Tab = raw && tabs.some((t) => t.id === raw) ? raw : 'queues';
  const setTab = (id: Tab) => {
    const p = new URLSearchParams();
    p.set('tab', id);
    router.replace(`${pathname}?${p.toString()}`, { scroll: false });
  };
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 overflow-x-auto border-b border-[var(--w-border)] px-4">
        <div className="flex gap-1" role="tablist" aria-label={wt('desk.serviceDesk')}>
          {tabs.map((t) => (
            <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} data-testid={`desk-tab-${t.id}`}
              className={cn('-mb-px flex items-center gap-1.5 whitespace-nowrap border-b-2 px-2.5 py-2.5 text-[13px] font-medium transition-colors', tab === t.id ? 'border-[var(--w-accent)] text-[var(--w-text)]' : 'border-transparent text-[var(--w-text-2)] hover:text-[var(--w-text)]')}>
              <t.icon size={14} />{t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        <div className="w-page">
          {tab === 'queues' && <QueuesTab config={config} />}
          {tab === 'problems' && <ProblemsTab config={config} />}
          {tab === 'reports' && <ReportsTab config={config} />}
          {tab === 'settings' && <SettingsTab config={config} />}
        </div>
      </div>
    </div>
  );
}
