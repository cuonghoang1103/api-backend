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

type Tab = 'queues' | 'problems' | 'reports' | 'settings';
const VIEWS: QueueView[] = ['open', 'unassigned', 'mine', 'at_risk', 'breached', 'waiting', 'team', 'resolved'];
const TYPE_KEYS: RequestTypeKey[] = ['INCIDENT', 'SERVICE_REQUEST', 'QUESTION', 'CHANGE'];
const TYPE_SHORT: Record<RequestTypeKey, string> = { INCIDENT: 'Incident', SERVICE_REQUEST: 'Service request', QUESTION: 'Question', CHANGE: 'Change' };
const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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
        <div className="flex gap-1.5" role="tablist" aria-label="Queues">
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
          <input className="w-input !h-8 !pl-7" placeholder="Search key or title" value={text} onChange={(e) => setText(e.target.value)} aria-label="Search requests" />
        </label>
        {view === 'team' && (
          <Select aria-label="Team" className="!h-8 !w-auto" value={teamId ?? ''} onChange={(e) => setTeamId(e.target.value ? Number(e.target.value) : null)}>
            <option value="">All teams</option>
            {(q.data?.teams ?? []).map((t) => <option key={t.id} value={t.id}>{t.key} · {t.name}</option>)}
          </Select>
        )}
        <Select aria-label="Request type" className="!h-8 !w-auto" value={type} onChange={(e) => setType(e.target.value as RequestTypeKey | '')}>
          <option value="">All types</option>
          {TYPE_KEYS.map((k) => <option key={k} value={k}>{TYPE_SHORT[k]}</option>)}
        </Select>
        <Select aria-label="Priority" className="!h-8 !w-auto" value={prio} onChange={(e) => setPrio(e.target.value as DeskPriority | '')}>
          <option value="">All priorities</option>
          {DESK_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
        </Select>
        <Select aria-label="Sort" className="!h-8 !w-auto" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="sla">Sort: SLA (most urgent)</option>
          <option value="priority">Sort: priority</option>
          <option value="created">Sort: newest</option>
          <option value="updated">Sort: recently updated</option>
        </Select>
        {config.permissions.workDesk && (
          <button type="button" className="w-btn w-btn-primary w-btn-sm ml-auto" onClick={() => setCreating(true)} data-testid="desk-new"><Plus size={14} /> New request</button>
        )}
      </div>
      {q.isLoading ? <PageLoading rows={5} /> : q.error ? <EmptyState title="Could not load the queue" body={workError(q.error)} /> : !q.data?.items.length ? (
        <EmptyState icon={<Inbox size={20} />} title={view === 'breached' ? 'No breached requests' : view === 'at_risk' ? 'Nothing at risk' : 'No requests here'} body="Requests from the client portal and ones the team logs land in these queues, each with its SLA clocks." />
      ) : (
        <>
          {/* Bảng ≥ lg */}
          <div className="w-card hidden overflow-x-auto lg:block" data-testid="desk-queue">
            <table className="w-full min-w-[980px] text-[13px]">
              <thead>
                <tr className="border-b border-[var(--w-border)] text-left text-[11.5px] font-medium uppercase tracking-[0.04em] text-[var(--w-text-3)]">
                  <th className="px-3 py-2">Request</th>
                  <th className="px-2 py-2">P</th>
                  <th className="px-2 py-2">Requester</th>
                  <th className="px-2 py-2">Assignee</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2">First response</th>
                  <th className="px-2 py-2">Resolution</th>
                  <th className="px-3 py-2 text-right">Created</th>
                </tr>
              </thead>
              <tbody>
                {q.data.items.map((r) => (
                  <tr key={r.number} className="border-b border-[var(--w-border)] last:border-b-0 hover:bg-[var(--w-hover)]" data-testid={`desk-row-${r.number}`}>
                    <td className="max-w-[340px] px-3 py-2">
                      <Link href={`${base}/issue/${r.number}`} className="block min-w-0">
                        <span className="flex min-w-0 items-center gap-2">
                          <span className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)]">{r.key}</span>
                          <span className="truncate font-medium">{r.title}</span>
                        </span>
                        <span className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-[var(--w-text-3)]">
                          {r.requestTypeName}{r.channel === 'PORTAL' && ' · portal'}{r.waiting && <Pill tone="neutral" className="!h-[18px] !px-1.5 !text-[11px]">Waiting for customer</Pill>}
                        </span>
                      </Link>
                    </td>
                    <td className="px-2 py-2"><PriorityBadge p={r.priority} /></td>
                    <td className="px-2 py-2"><Person u={r.requester} /></td>
                    <td className="px-2 py-2"><Person u={r.assignee} empty="Unassigned" /></td>
                    <td className="px-2 py-2"><StatusBadge status={r.status} /></td>
                    <td className="px-2 py-2"><SlaClock t={r.firstResponse} fetchedAt={fetchedAt} compact label="First response" /></td>
                    <td className="px-2 py-2"><SlaClock t={r.resolution} fetchedAt={fetchedAt} compact label="Resolution" /></td>
                    <td className="whitespace-nowrap px-3 py-2 text-right text-[12px] text-[var(--w-text-3)]">{relativeTime(r.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Thẻ < lg */}
          <ul className="space-y-2 lg:hidden" data-testid="desk-queue-cards">
            {q.data.items.map((r) => <QueueCard key={r.number} r={r} base={base} fetchedAt={fetchedAt} />)}
          </ul>
          {q.data.truncated && <p className="mt-2 text-[12px] text-[var(--w-text-3)]">Showing the first 500 — narrow the filters to see the rest.</p>}
        </>
      )}
      <NewRequestDialog config={config} open={creating} onClose={() => setCreating(false)} />
    </div>
  );
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
          {r.waiting && <span>· waiting for customer</span>}
          <span>· {r.assignee ? userName(r.assignee) : 'Unassigned'}</span>
        </div>
        <div className="mt-2.5 grid grid-cols-2 gap-3">
          <div><div className="mb-0.5 text-[11px] text-[var(--w-text-3)]">First response</div><SlaClock t={r.firstResponse} fetchedAt={fetchedAt} /></div>
          <div><div className="mb-0.5 text-[11px] text-[var(--w-text-3)]">Resolution</div><SlaClock t={r.resolution} fetchedAt={fetchedAt} /></div>
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
      toast.success(issueNumber ? 'Added to the service desk' : 'Request logged');
      invalidate();
      onClose();
      if (!issueNumber) router.refresh();
    },
    onError: (err) => toast.error(workError(err, 'Could not save the request')),
  });
  return (
    <Dialog open={open} onClose={onClose} title={issueNumber ? 'Add to service desk' : 'Log a request'} width={600}
      footer={<>
        <button type="button" className="w-btn" onClick={onClose}>Cancel</button>
        <button type="button" className="w-btn w-btn-primary" disabled={create.isPending || (!issueNumber && !title.trim())} onClick={() => create.mutate()} data-testid="desk-create">
          {create.isPending ? <Spinner size={12} /> : <Plus size={13} />} {issueNumber ? 'Add' : 'Log request'}
        </button>
      </>}>
      {settings.isLoading ? <PageLoading rows={3} /> : (
        <div className="space-y-1">
          <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
            <Field label="Request type">
              <Select aria-label="Request type" value={type} onChange={(e) => setType(e.target.value as RequestTypeKey)}>
                {(settings.data?.requestTypes ?? []).map((x) => <option key={x.key} value={x.key}>{x.name}{x.enabled ? '' : ' (hidden from portal)'}</option>)}
              </Select>
            </Field>
            <Field label="Requester" hint="Who asked — they get the CSAT survey">
              <PersonSelect config={config} value={requester} onChange={setRequester} label="Requester" empty="Not recorded" />
            </Field>
          </div>
          {!issueNumber && (
            <>
              <Field label="Title"><input className="w-input" value={title} maxLength={255} onChange={(e) => setTitle(e.target.value)} autoFocus data-testid="desk-title" /></Field>
              <Field label="Details"><textarea className="w-input min-h-[80px] py-2" value={desc} onChange={(e) => setDesc(e.target.value)} /></Field>
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
            <Field label="Impact"><Select aria-label="Impact" value={impact} onChange={(e) => setImpact(e.target.value as DeskLevel)}>{DESK_LEVELS.map((l) => <option key={l} value={l}>{LEVEL_LABEL[l]}</option>)}</Select></Field>
            <Field label="Urgency"><Select aria-label="Urgency" value={urgency} onChange={(e) => setUrgency(e.target.value as DeskLevel)}>{DESK_LEVELS.map((l) => <option key={l} value={l}>{LEVEL_LABEL[l]}</option>)}</Select></Field>
            <Field label="Priority"><div className="flex h-9 items-center">{p && <PriorityBadge p={p} long />}</div></Field>
          </div>
          {p && settings.data && <p className="text-[12px] text-[var(--w-text-3)]">Respond within {settings.data.targetsText[p].respond} · resolve within {settings.data.targetsText[p].resolve}.</p>}
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
        <p className="min-w-0 flex-1 text-[13px] text-[var(--w-text-2)]">A problem is the underlying cause behind one or more incidents (ITIL). Link the incidents, record the root cause and workaround, then write a blameless postmortem.</p>
        {q.data?.canWork && <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={() => setCreating(true)} data-testid="problem-new"><Plus size={14} /> New problem</button>}
      </div>
      {q.isLoading ? <PageLoading rows={3} /> : q.error ? <EmptyState title="Could not load problems" body={workError(q.error)} /> : !q.data?.items.length ? (
        <EmptyState icon={<Siren size={20} />} title="No problems recorded" body="When several incidents share a cause, group them under a problem." />
      ) : (
        <ul className="w-card overflow-hidden" data-testid="problem-list">
          {q.data.items.map((p) => (
            <li key={p.number} className="border-b border-[var(--w-border)] last:border-b-0">
              <button type="button" onClick={() => setOpen(p.number)} className="flex w-full min-w-0 flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 text-left hover:bg-[var(--w-hover)]">
                <span className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)]">{p.key}</span>
                <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium">{p.title}</span>
                <span className="text-[12px] text-[var(--w-text-3)]">{p.incidentCount} incident{p.incidentCount === 1 ? '' : 's'}</span>
                {p.postmortem && <span className="flex items-center gap-1 text-[12px] text-[var(--w-text-3)]"><FileText size={12} />postmortem</span>}
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
    onSuccess: (p) => { toast.success(`${p.key} created`); invalidate(); onClose(); onCreated(p.number); },
    onError: (err) => toast.error(workError(err, 'Could not create the problem')),
  });
  return (
    <Dialog open={open} onClose={onClose} title="New problem" width={560}
      footer={<><button type="button" className="w-btn" onClick={onClose}>Cancel</button><button type="button" className="w-btn w-btn-primary" disabled={!title.trim() || create.isPending} onClick={() => create.mutate()} data-testid="problem-create">{create.isPending ? <Spinner size={12} /> : <Plus size={13} />} Create</button></>}>
      <Field label="Title"><input className="w-input" value={title} maxLength={255} autoFocus onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Payment gateway times out under load" data-testid="problem-title" /></Field>
      <Field label="Description"><textarea className="w-input min-h-[72px] py-2" value={desc} onChange={(e) => setDesc(e.target.value)} /></Field>
      <Field label="Incidents" hint={`Keys or numbers, e.g. ${config.key}-12, ${config.key}-15`}><input className="w-input" value={incidents} onChange={(e) => setIncidents(e.target.value)} data-testid="problem-incidents" /></Field>
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
    onSuccess: () => { toast.success('Saved'); invalidate(); },
    onError: (err) => toast.error(workError(err, 'Could not save')),
  });
  const linkM = useMutation({ mutationFn: () => deskApi.linkIncidents(pid, num!, parseNums(link)), onSuccess: () => { setLink(''); invalidate(); }, onError: (err) => toast.error(workError(err, 'Could not link')) });
  const unlink = useMutation({ mutationFn: (n: number) => deskApi.unlinkIncident(pid, num!, n), onSuccess: () => invalidate(), onError: (err) => toast.error(workError(err)) });
  const pm = useMutation({
    mutationFn: () => deskApi.postmortem(pid, num!),
    onSuccess: (r) => { toast.success('Postmortem created in Docs'); invalidate(); router.push(`${base}/docs/${r.pageNumber}`); },
    onError: (err) => toast.error(workError(err, 'Could not create the postmortem')),
  });
  const ro = !p?.canWork;
  const fetchedAt = q.dataUpdatedAt || Date.now();
  return (
    <Dialog open={!!num} onClose={onClose} width={760} title={p ? <span className="flex min-w-0 items-center gap-2"><span className="font-mono text-[13px] text-[var(--w-accent-text)]">{p.key}</span><span className="truncate">{p.title}</span></span> : 'Loading…'}
      footer={p && !ro ? <>
        {p.postmortem
          ? <Link href={`${base}/docs/${p.postmortem.number}`} className="w-btn mr-auto"><FileText size={13} /> Open postmortem</Link>
          : p.docsEnabled && <button type="button" className="w-btn mr-auto" disabled={pm.isPending} onClick={() => pm.mutate()} data-testid="problem-postmortem">{pm.isPending ? <Spinner size={12} /> : <FileText size={13} />} Create postmortem</button>}
        <button type="button" className="w-btn w-btn-primary" disabled={!f.title.trim() || saveP.isPending} onClick={() => saveP.mutate()} data-testid="problem-save">{saveP.isPending ? <Spinner size={12} /> : <Save size={13} />} Save</button>
      </> : undefined}>
      {q.isLoading || !p ? <PageLoading rows={4} /> : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-[1fr_180px_180px]">
            <Field label="Title"><input className="w-input" value={f.title} disabled={ro} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field>
            <Field label="Status">
              <Select aria-label="Status" value={f.status} disabled={ro} onChange={(e) => setF({ ...f, status: e.target.value as ProblemStatus })}>
                {PROBLEM_STATUSES.map((s) => <option key={s} value={s}>{PROBLEM_STATUS_LABEL[s]}</option>)}
              </Select>
            </Field>
            <Field label="Owner"><PersonSelect config={config} value={f.ownerId} onChange={(v) => setF({ ...f, ownerId: v })} label="Owner" staffOnly disabled={ro} /></Field>
          </div>
          <Field label="Description"><textarea className="w-input min-h-[60px] py-2" disabled={ro} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></Field>
          <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
            <Field label="Root cause"><textarea className="w-input min-h-[70px] py-2" disabled={ro} value={f.rootCause} onChange={(e) => setF({ ...f, rootCause: e.target.value })} placeholder="Why it happened — the system, not a person" /></Field>
            <Field label="Workaround"><textarea className="w-input min-h-[70px] py-2" disabled={ro} value={f.workaround} onChange={(e) => setF({ ...f, workaround: e.target.value })} /></Field>
          </div>
          <section>
            <h3 className="w-section-title mb-2">Linked incidents</h3>
            {p.incidents.length ? (
              <ul className="overflow-hidden rounded-[8px] border border-[var(--w-border)]" data-testid="problem-incidents-list">
                {p.incidents.map((i) => (
                  <li key={i.number} className="grid grid-cols-[1fr_auto] items-center gap-2 border-b border-[var(--w-border)] px-3 py-2 last:border-b-0 sm:grid-cols-[1fr_120px_120px_auto]">
                    <Link href={`${base}/issue/${i.number}`} className="flex min-w-0 items-center gap-2 text-[13px]">
                      <PriorityBadge p={i.priority} />
                      <span className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)]">{i.key}</span>
                      <span className="truncate">{i.title}</span>
                    </Link>
                    <div className="hidden sm:block"><SlaClock t={i.firstResponse} fetchedAt={fetchedAt} compact label="First response" /></div>
                    <div className="hidden sm:block"><SlaClock t={i.resolution} fetchedAt={fetchedAt} compact label="Resolution" /></div>
                    {!ro && <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={`Unlink ${i.key}`} onClick={() => unlink.mutate(i.number)}><Unlink size={13} /></button>}
                  </li>
                ))}
              </ul>
            ) : <p className="text-[13px] text-[var(--w-text-3)]">No incidents linked yet.</p>}
            {!ro && (
              <div className="mt-2 flex gap-2">
                <input className="w-input !h-8" placeholder={`${config.key}-12, ${config.key}-15`} value={link} onChange={(e) => setLink(e.target.value)} aria-label="Incidents to link" />
                <button type="button" className="w-btn w-btn-sm shrink-0" disabled={!parseNums(link).length || linkM.isPending} onClick={() => linkM.mutate()}><Link2 size={13} /> Link</button>
              </div>
            )}
            {!p.docsEnabled && <p className="mt-2 text-[12px] text-[var(--w-text-3)]">Turn on the Docs module to create a postmortem from the template.</p>}
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
    try { save(await deskApi.reportXlsx(pid, months), `${config.key}-service-desk-sla.xlsx`); } catch (err) { toast.error(workError(err, 'Could not export')); } finally { setExporting(false); }
  };
  if (q.isLoading) return <PageLoading rows={5} />;
  if (q.error || !q.data) return <EmptyState title="Could not load the report" body={workError(q.error)} />;
  const r = q.data;
  const tot = r.byPriority[p];
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1" role="tablist" aria-label="Priority">
          {(['ALL', ...DESK_PRIORITIES] as const).map((x) => (
            <button key={x} type="button" role="tab" aria-selected={p === x} onClick={() => setP(x)}
              className={cn('h-8 rounded-[7px] border px-2.5 text-[12.5px] font-medium', p === x ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : 'border-[var(--w-border)] text-[var(--w-text-2)] hover:bg-[var(--w-hover)]')}>
              {x === 'ALL' ? 'All priorities' : x}
            </button>
          ))}
        </div>
        <Select aria-label="Period" className="!h-8 !w-auto" value={months} onChange={(e) => setMonths(Number(e.target.value))}>
          {[3, 6, 12].map((n) => <option key={n} value={n}>Last {n} months</option>)}
        </Select>
        <button type="button" className="w-btn w-btn-sm ml-auto" disabled={exporting} onClick={() => void exportX()} data-testid="desk-export">{exporting ? <Spinner size={12} /> : <FileDown size={13} />} Export .xlsx</button>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Kpi label="Responded on time" value={pct(tot.frPercent)} sub={`${tot.frMet}/${tot.frDone} with an outcome`} tone={toneOf(tot.frPercent)} />
        <Kpi label="Resolved on time" value={pct(tot.resPercent)} sub={`${tot.resMet}/${tot.resDone} with an outcome`} tone={toneOf(tot.resPercent)} />
        <Kpi label="MTTR" value={hours(tot.mttrMin)} sub="mean time to resolve (wall clock)" />
        <Kpi label="Breaches" value={tot.breaches} sub={`${tot.tickets} requests`} tone={tot.breaches ? 'red' : undefined} />
        <Kpi label="CSAT" value={tot.csatAvg === null ? '—' : `${tot.csatAvg}/5`} sub={`${tot.csatCount} rating${tot.csatCount === 1 ? '' : 's'}`} />
      </div>
      <section className="w-card overflow-x-auto">
        <table className="w-full min-w-[640px] text-[13px]" data-testid="desk-report-table">
          <thead>
            <tr className="border-b border-[var(--w-border)] text-left text-[11.5px] font-medium uppercase tracking-[0.04em] text-[var(--w-text-3)]">
              <th className="px-3 py-2">Month</th><th className="px-2 py-2 text-right">Requests</th><th className="px-2 py-2">First response met</th><th className="px-2 py-2">Resolution met</th>
              <th className="px-2 py-2 text-right">Breaches</th><th className="px-2 py-2 text-right">MTTR</th><th className="px-3 py-2 text-right">CSAT</th>
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
          <h2 className="w-section-title mb-2">Recent breaches</h2>
          {r.breaches.length ? (
            <ul className="space-y-1.5 text-[13px]">
              {r.breaches.map((b, i) => (
                <li key={`${b.number}-${b.target}-${i}`} className="flex min-w-0 items-center gap-2">
                  <PriorityBadge p={b.priority} />
                  <Link href={`${base}/issue/${b.number}`} className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)]">{b.key}</Link>
                  <span className="min-w-0 flex-1 truncate">{b.title}</span>
                  <span className="shrink-0 text-[12px] text-[var(--w-text-3)]">{b.target === 'FIRST_RESPONSE' ? 'response' : 'resolution'} · {formatDate(b.at)}</span>
                </li>
              ))}
            </ul>
          ) : <p className="text-[13px] text-[var(--w-text-3)]">No breaches in this period.</p>}
        </section>
        <section className="w-card p-4">
          <h2 className="w-section-title mb-2">Customer feedback</h2>
          {r.feedback.length ? (
            <ul className="space-y-2 text-[13px]">
              {r.feedback.map((f) => (
                <li key={f.number} className="min-w-0">
                  <div className="flex min-w-0 items-center gap-2"><Stars n={f.rating} /><Link href={`${base}/issue/${f.number}`} className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)]">{f.key}</Link><span className="truncate text-[var(--w-text-3)]">{f.title}</span></div>
                  {f.comment && <p className="mt-0.5 text-[12.5px] text-[var(--w-text-2)] [overflow-wrap:anywhere]">“{f.comment}”</p>}
                </li>
              ))}
            </ul>
          ) : <p className="text-[13px] text-[var(--w-text-3)]">No CSAT answers yet. Requesters are asked when their request is resolved.</p>}
        </section>
      </div>
      <p className="text-[12px] text-[var(--w-text-3)]">% met counts targets with an outcome (met, or breached — including still-open ones that already breached). Times in {r.timezone}.</p>
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
  return <span className="shrink-0 tabular-nums text-[var(--w-orange)]" aria-label={`${n} out of 5`}>{'★'.repeat(n)}<span className="text-[var(--w-text-3)] opacity-50">{'★'.repeat(5 - n)}</span></span>;
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
    return `${d} business day${d === 1 ? '' : 's'}${r ? ` ${minutesText(r)}` : ''}`;
  }
  return `${minutesText(min)} business`;
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
    onSuccess: () => { toast.success('Service desk settings saved'); invalidate(); },
    onError: (err) => toast.error(workError(err, 'Could not save')),
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
      {ro && <p className="rounded-[8px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2 text-[12.5px] text-[var(--w-text-2)]">Only a project admin can change these settings.</p>}
      {!s.saved && <p className="rounded-[8px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2 text-[12.5px] text-[var(--w-text-2)]">Using the default settings. Save once to make them this project’s own.</p>}

      <section className="w-card p-4 md:p-5">
        <h2 className="w-section-title mb-3 flex items-center gap-2"><CalendarClock size={15} /> Working hours</h2>
        <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-[1fr_120px_120px]">
          <Field label="Time zone" hint="IANA name, e.g. Asia/Ho_Chi_Minh"><input className="w-input" disabled={ro} value={s.calendar.timezone} onChange={(e) => setCal({ timezone: e.target.value })} /></Field>
          <Field label="Start"><input type="time" className="w-input" disabled={ro} value={toHm(s.calendar.startMin)} onChange={(e) => setCal({ startMin: fromHm(e.target.value) })} /></Field>
          <Field label="End"><input type="time" className="w-input" disabled={ro} value={toHm(s.calendar.endMin === 1440 ? 1439 : s.calendar.endMin)} onChange={(e) => setCal({ endMin: fromHm(e.target.value) })} /></Field>
        </div>
        <div className="mb-3 flex flex-wrap gap-1.5" role="group" aria-label="Working days">
          {DAY_NAMES.map((n, i) => {
            const on = s.calendar.workDays.includes(i + 1);
            return (
              <button key={n} type="button" disabled={ro} aria-pressed={on} onClick={() => setCal({ workDays: on ? s.calendar.workDays.filter((d) => d !== i + 1) : [...s.calendar.workDays, i + 1].sort() })}
                className={cn('h-8 w-12 rounded-[7px] border text-[12.5px] font-medium', on ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : 'border-[var(--w-border)] text-[var(--w-text-3)]')}>{n}</button>
            );
          })}
        </div>
        <Field label="Public holidays" hint="One date per line (YYYY-MM-DD). Lunar holidays (Tết, Hùng Kings) change every year — add them yourself.">
          <textarea className="w-input min-h-[90px] py-2 font-mono text-[12.5px]" disabled={ro} value={holidayText} onChange={(e) => setHolidayText(e.target.value)} />
        </Field>
        {!ro && <button type="button" className="w-btn w-btn-sm" onClick={addVnHolidays}><Plus size={13} /> Add Vietnam fixed-date holidays</button>}
      </section>

      <section className="w-card p-4 md:p-5">
        <h2 className="w-section-title mb-3 flex items-center gap-2"><BarChart3 size={15} /> SLA goals</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-[13px]">
            <thead><tr className="text-left text-[11.5px] uppercase tracking-[0.04em] text-[var(--w-text-3)]"><th className="py-1.5 pr-2">Priority</th><th className="px-2 py-1.5">First response (min)</th><th className="px-2 py-1.5">Resolution (min)</th><th className="px-2 py-1.5">Clock</th></tr></thead>
            <tbody>
              {DESK_PRIORITIES.map((p) => (
                <tr key={p} className="border-t border-[var(--w-border)]">
                  <td className="py-2 pr-2"><PriorityBadge p={p} long /></td>
                  <td className="px-2 py-2"><input type="number" min={1} className="w-input !h-8 !w-[110px]" disabled={ro} value={s.goals[p].firstResponseMin} onChange={(e) => setGoal(p, { firstResponseMin: Number(e.target.value) })} aria-label={`${p} first response minutes`} /> <span className="text-[12px] text-[var(--w-text-3)]">{goalText(s.goals[p].firstResponseMin, s.goals[p].calendar, perDay)}</span></td>
                  <td className="px-2 py-2"><input type="number" min={1} className="w-input !h-8 !w-[110px]" disabled={ro} value={s.goals[p].resolutionMin} onChange={(e) => setGoal(p, { resolutionMin: Number(e.target.value) })} aria-label={`${p} resolution minutes`} /> <span className="text-[12px] text-[var(--w-text-3)]">{goalText(s.goals[p].resolutionMin, s.goals[p].calendar, perDay)}</span></td>
                  <td className="px-2 py-2">
                    <Select aria-label={`${p} clock`} className="!h-8 !w-auto" disabled={ro} value={s.goals[p].calendar} onChange={(e) => setGoal(p, { calendar: e.target.value as SlaGoal['calendar'] })}>
                      <option value="BUSINESS">Working hours</option>
                      <option value="ALWAYS">24/7</option>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px]">
          <span>At risk when</span>
          <input type="number" min={10} max={99} className="w-input !h-8 !w-[80px]" disabled={ro} value={s.atRiskPercent} onChange={(e) => setS({ ...s, atRiskPercent: Number(e.target.value) })} aria-label="At-risk threshold" />
          <span>% of the goal is used.</span>
        </div>
      </section>

      <section className="w-card p-4 md:p-5">
        <h2 className="w-section-title mb-1">Priority matrix (impact × urgency)</h2>
        <p className="mb-3 text-[12.5px] text-[var(--w-text-3)]">Clients only describe who is affected and how badly — the matrix turns that into P1–P4.</p>
        <div className="overflow-x-auto">
          <table className="text-[13px]">
            <thead><tr><th className="p-1.5 text-left text-[11.5px] uppercase text-[var(--w-text-3)]">Impact ↓ / Urgency →</th>{DESK_LEVELS.map((u) => <th key={u} className="p-1.5 text-[12px] font-medium">{LEVEL_LABEL[u]}</th>)}</tr></thead>
            <tbody>
              {DESK_LEVELS.map((i) => (
                <tr key={i}>
                  <th className="p-1.5 text-left text-[12px] font-medium">{LEVEL_LABEL[i]}</th>
                  {DESK_LEVELS.map((u) => (
                    <td key={u} className="p-1.5">
                      <Select aria-label={`Impact ${i}, urgency ${u}`} className="!h-8 !w-[76px]" disabled={ro} value={s.matrix[i][u]} onChange={(e) => setCell(i, u, e.target.value as DeskPriority)}>
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
        <h2 className="w-section-title mb-3">Request types</h2>
        <div className="space-y-3">
          {s.requestTypes.map((t) => (
            <div key={t.key} className="rounded-[10px] border border-[var(--w-border)] p-3">
              <div className="flex flex-wrap items-center gap-2">
                <label className="flex items-center gap-2 text-[13px] font-medium"><input type="checkbox" disabled={ro} checked={t.enabled} onChange={(e) => setType(t.key, { enabled: e.target.checked })} />{TYPE_SHORT[t.key]}</label>
                <span className="text-[12px] text-[var(--w-text-3)]">{t.enabled ? 'shown in the client portal' : 'hidden'}</span>
              </div>
              <div className="mt-2 grid grid-cols-1 gap-x-3 sm:grid-cols-2">
                <Field label="Name (what clients see)"><input className="w-input" disabled={ro} value={t.name} maxLength={60} onChange={(e) => setType(t.key, { name: e.target.value })} /></Field>
                <Field label="Description"><input className="w-input" disabled={ro} value={t.description} maxLength={200} onChange={(e) => setType(t.key, { description: e.target.value })} /></Field>
              </div>
              <div className="grid grid-cols-2 gap-x-3 sm:grid-cols-[1fr_1fr_auto]">
                <Field label="Default impact"><Select aria-label="Default impact" disabled={ro} value={t.defaultImpact} onChange={(e) => setType(t.key, { defaultImpact: e.target.value as DeskLevel })}>{DESK_LEVELS.map((l) => <option key={l} value={l}>{LEVEL_LABEL[l]}</option>)}</Select></Field>
                <Field label="Default urgency"><Select aria-label="Default urgency" disabled={ro} value={t.defaultUrgency} onChange={(e) => setType(t.key, { defaultUrgency: e.target.value as DeskLevel })}>{DESK_LEVELS.map((l) => <option key={l} value={l}>{LEVEL_LABEL[l]}</option>)}</Select></Field>
                <Field label="Default P"><div className="flex h-9 items-center"><PriorityBadge p={s.matrix[t.defaultImpact][t.defaultUrgency]} /></div></Field>
              </div>
              <label className="flex items-center gap-2 text-[12.5px]"><input type="checkbox" disabled={ro} checked={t.askImpact} onChange={(e) => setType(t.key, { askImpact: e.target.checked })} />Ask the client who is affected and how urgent it is</label>
              {t.key === 'CHANGE' && <label className="mt-1 flex items-center gap-2 text-[12.5px]"><input type="checkbox" disabled={ro} checked={t.useChangeRequest !== false} onChange={(e) => setType(t.key, { useChangeRequest: e.target.checked })} />Also open a draft change request (when the Change requests module is on)</label>}
              <div className="mt-2">
                <div className="mb-1 text-[12px] font-medium text-[var(--w-text-3)]">Form fields</div>
                {t.fields.map((f, idx) => (
                  <div key={idx} className="mb-1.5 flex flex-wrap items-center gap-1.5">
                    <input className="w-input !h-8 min-w-[160px] flex-1" disabled={ro} value={f.label} onChange={(e) => setType(t.key, { fields: t.fields.map((x, j) => (j === idx ? { ...x, label: e.target.value } : x)) })} aria-label="Field label" />
                    <Select aria-label="Field kind" className="!h-8 !w-auto" disabled={ro} value={f.kind} onChange={(e) => setType(t.key, { fields: t.fields.map((x, j) => (j === idx ? { ...x, kind: e.target.value as typeof f.kind } : x)) })}>
                      <option value="text">Short text</option><option value="textarea">Long text</option><option value="date">Date</option>
                    </Select>
                    <label className="flex items-center gap-1 text-[12px]"><input type="checkbox" disabled={ro} checked={f.required} onChange={(e) => setType(t.key, { fields: t.fields.map((x, j) => (j === idx ? { ...x, required: e.target.checked } : x)) })} />required</label>
                    {!ro && <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label="Remove field" onClick={() => setType(t.key, { fields: t.fields.filter((_, j) => j !== idx) })}><Trash2 size={13} /></button>}
                  </div>
                ))}
                {!ro && t.fields.length < 8 && (
                  <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => {
                    const label = 'New field';
                    let key = slug(label); let n = 2;
                    while (t.fields.some((f) => f.key === key)) key = `${slug(label)}_${n++}`;
                    setType(t.key, { fields: [...t.fields, { key, label, kind: 'text', required: false }] });
                  }}><Plus size={13} /> Add field</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="w-card p-4 md:p-5">
        <h2 className="w-section-title mb-1">Statuses</h2>
        <p className="mb-3 text-[12.5px] text-[var(--w-text-3)]">Moving a request into a “waiting” status pauses its clock (the customer’s reply resumes it and moves it back). A “response” status counts as the first response.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {(['pauseStatusIds', 'responseStatusIds'] as const).map((k) => (
            <div key={k}>
              <div className="mb-1.5 text-[12.5px] font-medium">{k === 'pauseStatusIds' ? 'Waiting for customer (pauses)' : 'Counts as first response'}</div>
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
        <h2 className="w-section-title mb-2">How is SLA computed?</h2>
        <ul className="list-disc space-y-1 pl-5 text-[13px] text-[var(--w-text-2)]">{s.rules.map((r) => <li key={r}>{r}</li>)}</ul>
      </section>

      {!ro && (
        <div className="sticky bottom-0 -mx-4 flex justify-end border-t border-[var(--w-border)] bg-[var(--w-bg)] px-4 py-3">
          <button type="button" className="w-btn w-btn-primary" disabled={saveM.isPending} onClick={() => saveM.mutate()} data-testid="desk-settings-save">{saveM.isPending ? <Spinner size={12} /> : <Save size={13} />} Save settings</button>
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
      { id: 'queues', label: 'Queues', icon: Inbox },
      { id: 'problems', label: 'Problems', icon: Siren },
      { id: 'reports', label: 'Reports', icon: BarChart3 },
      { id: 'settings', label: 'Settings', icon: Settings2 },
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
        <div className="flex gap-1" role="tablist" aria-label="Service desk">
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
