'use client';

/**
 * CỔNG KHÁCH (đợt S2b) — /work/<ws>/<KEY>/portal.
 *
 * Một trang, sáu thẻ: Overview · Requests · Approvals · Documents · Deliverables ·
 * Activity. Mọi dữ liệu đến từ /portal/** (portal.service.ts) — server đã lọc
 * "như khách thấy". Ba kiểu người xem:
 *   - khách: xem + gửi yêu cầu, trả lời, duyệt bước của chính mình;
 *   - nhân viên ở chế độ quản lý: thêm khối "Clients" (mời khách) + "Request UAT sign-off";
 *   - nhân viên "Preview as client" (`?preview=1`): đúng dữ liệu khách thấy, CHỈ ĐỌC.
 */

import Link from 'next/link';
import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Activity, ArrowLeft, BadgeCheck, CalendarClock, CheckCircle2, Circle, CircleDot, Download, Eye, FileText, Flag, Inbox, LayoutDashboard, MessageSquare,
  PackageCheck, Paperclip, Plus, Rocket, Send, Receipt, FileBarChart, Library,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  userName, workApi, workError, workPortalApi, workPortalKeys, type PortalRequestKind, type PortalTab, type PortalViewer,
  type ProjectConfig, type TiptapDoc,
} from '@/lib/work-api';
import RichEditor, { isDocEmpty, RichView } from '../RichEditor';
import { Dialog, EmptyState, formatBytes, formatDate, PageLoading, ProjectMark, relativeTime, Spinner, StatusBadge, UserAvatar } from '../ui';
import { Select } from '../settings/shared';
import { Pill, STAGE_STATUS } from '../studio/shared';
import { ClientPill } from './ClientShare';
import { ApprovalsTab, PortalApprovalDialog } from './PortalApprovals';
import { StaffPanel } from './PortalStaff';
import { MeetingsTab, PortalMeetingDialog } from './PortalMeetings';
import { PaymentsTab, ReportsTab } from './PortalS4';
import { DeskRequestDialog, PortalSlaPanel } from '../desk/PortalDesk';
import { AddToCalendar } from '../ctw';
import PortalResources from '../resources/PortalResources';

export const PORTAL_TABS: Array<{ id: PortalTab; label: string; icon: typeof Inbox }> = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'requests', label: 'Requests', icon: Inbox },
  { id: 'approvals', label: 'Approvals', icon: BadgeCheck },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'deliverables', label: 'Deliverables', icon: PackageCheck },
  // Đợt S3b — chỉ khi mô-đun meetings bật (lọc trong PortalView).
  { id: 'meetings', label: 'Meetings', icon: CalendarClock },
  // Đợt S4 — mốc thanh toán đã chia sẻ (mô-đun finance) + lịch sử báo cáo tuần (mô-đun reports).
  { id: 'payments', label: 'Payments', icon: Receipt },
  { id: 'reports', label: 'Reports', icon: FileBarChart },
  // Resources (06/10/2026) — link đội đã chia sẻ (mô-đun resources).
  { id: 'resources', label: 'Resources', icon: Library },
  { id: 'activity', label: 'Activity', icon: Activity },
];

export function usePortalParams() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const tab = (PORTAL_TABS.some((t) => t.id === sp?.get('tab')) ? sp!.get('tab') : 'overview') as PortalTab;
  const set = useCallback((patch: Record<string, string | null>) => {
    const next = new URLSearchParams(sp?.toString() ?? '');
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    const s = next.toString();
    router.replace(s ? `${pathname}?${s}` : pathname!, { scroll: false });
  }, [sp, pathname, router]);
  return {
    tab,
    preview: sp?.get('preview') === '1',
    issue: Number(sp?.get('issue')) || null,
    approval: Number(sp?.get('approval')) || null,
    doc: Number(sp?.get('doc')) || null,
    meeting: Number(sp?.get('meeting')) || null,
    report: Number(sp?.get('report')) || null,
    set,
  };
}

const card = 'w-card p-4 md:p-5';

function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <h2 className="w-section-title">{children}</h2>
      {action && <div className="ml-auto">{action}</div>}
    </div>
  );
}

function Bar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--w-sunken)]" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-[var(--w-accent)] transition-[width] duration-500" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

// ─── Overview ────────────────────────────────────────────────────

function OverviewTab({ pid, asClient, go }: { pid: number; asClient: boolean; go: (patch: Record<string, string | null>) => void }) {
  const q = useQuery({ queryKey: workPortalKeys.tab(pid, 'overview', asClient), queryFn: () => workPortalApi.overview(pid, asClient) });
  if (q.isLoading) return <PageLoading rows={4} />;
  if (q.error || !q.data) return <EmptyState title="Could not load the overview" body={workError(q.error)} />;
  const o = q.data;
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="min-w-0 space-y-4">
        <section className={card}>
          <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
            <div className="min-w-0 flex-1">
              <div className="w-eyebrow">Overall progress</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-[34px] font-semibold leading-none tracking-[-0.03em] tabular">{o.overallPercent ?? 0}%</span>
                {o.currentStage && <span className="truncate text-[13px] text-[var(--w-text-2)]">Now: {o.currentStage.n}. {o.currentStage.name}</span>}
              </div>
              <div className="mt-3"><Bar value={o.overallPercent ?? 0} /></div>
            </div>
            <dl className="grid grid-cols-3 gap-4 text-center max-sm:w-full">
              {[['Open', o.counts.sharedOpen], ['Done', o.counts.sharedDone], [o.viewer.isClient ? 'Your requests' : 'Client requests', o.counts.requestsOpen]].map(([l, n]) => (
                <div key={l as string}><dt className="text-[11.5px] text-[var(--w-text-3)]">{l}</dt><dd className="text-[20px] font-semibold tabular">{n}</dd></div>
              ))}
            </dl>
          </div>
        </section>

        <section className={card}>
          <SectionTitle>Progress by stage</SectionTitle>
          {o.stages.length ? (
            <ol className="space-y-2.5">
              {o.stages.map((s) => (
                <li key={s.id} className="grid grid-cols-[22px_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1">
                  {s.status === 'DONE' ? <CheckCircle2 size={18} className="text-[var(--w-green)]" /> : s.status === 'NOT_STARTED' ? <Circle size={18} className="text-[var(--w-text-3)]" /> : <CircleDot size={18} className="text-[var(--w-accent-text)]" />}
                  <span className={cn('min-w-0 truncate text-[13.5px]', s.status === 'NOT_STARTED' && 'text-[var(--w-text-2)]')}>{s.n}. {s.name}</span>
                  <span className="flex items-center gap-2">
                    <span className="tabular text-[12px] text-[var(--w-text-3)]">{s.percent}%</span>
                    <Pill tone={STAGE_STATUS[s.status].tone} className="max-sm:hidden">{STAGE_STATUS[s.status].label}</Pill>
                  </span>
                  <span />
                  <div className="col-span-2"><Bar value={s.percent} /></div>
                </li>
              ))}
            </ol>
          ) : <p className="text-[13px] text-[var(--w-text-3)]">The team has not set up stages for this project yet.</p>}
        </section>
      </div>

      <div className="min-w-0 space-y-4">
        <section className={card}>
          <SectionTitle>Waiting on you</SectionTitle>
          {o.waitingOnClient.length ? (
            <ul className="space-y-2">
              {o.waitingOnClient.map((w) => (
                <li key={w.id}>
                  <button type="button" onClick={() => go({ tab: 'approvals', approval: String(w.id) })} className="flex w-full items-start gap-2.5 rounded-[8px] border border-[var(--w-border)] px-3 py-2.5 text-left hover:bg-[var(--w-hover)]">
                    {w.kind === 'UAT' ? <Flag size={15} className="mt-0.5 shrink-0 text-[var(--w-orange)]" /> : <BadgeCheck size={15} className="mt-0.5 shrink-0 text-[var(--w-accent-text)]" />}
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13.5px] font-medium [overflow-wrap:anywhere]">{w.title}</span>
                      <span className="text-[12px] text-[var(--w-text-3)]">{w.kind === 'UAT' ? 'UAT sign-off' : 'Approval'}{w.dueAt ? ` · due ${formatDate(w.dueAt)}` : ` · ${relativeTime(w.createdAt)}`}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : <p className="text-[13px] text-[var(--w-text-3)]">Nothing needs your decision right now.</p>}
        </section>
        <section className={card}>
          <SectionTitle>Upcoming milestones</SectionTitle>
          {o.milestones.length ? (
            <ul className="space-y-3">
              {o.milestones.map((m) => (
                <li key={m.id}>
                  <div className="flex items-center gap-2 text-[13.5px]">
                    <Rocket size={14} className="shrink-0 text-[var(--w-text-3)]" />
                    <span className="min-w-0 flex-1 truncate font-medium">{m.name}</span>
                    <span className="shrink-0 text-[12px] text-[var(--w-text-3)]">{m.status === 'RELEASED' ? `Released ${formatDate(m.releasedAt)}` : m.releaseDate ? formatDate(m.releaseDate) : 'No date'}</span>
                    {/* CTW-25 */}
                    {m.status !== 'RELEASED' && m.releaseDate && (
                      <AddToCalendar label="" className="!h-6 !px-1.5" event={{ title: `${o.project.name}: ${m.name}`, start: m.releaseDate.slice(0, 10), allDay: true }} />
                    )}
                  </div>
                  <div className="mt-1.5 flex items-center gap-2"><Bar value={m.items ? (m.done / m.items) * 100 : 0} /><span className="shrink-0 tabular text-[11.5px] text-[var(--w-text-3)]">{m.done}/{m.items}</span></div>
                </li>
              ))}
            </ul>
          ) : <p className="text-[13px] text-[var(--w-text-3)]">No milestones shared yet.</p>}
        </section>
      </div>
    </div>
  );
}

// ─── Requests ────────────────────────────────────────────────────

const KINDS: Array<{ id: PortalRequestKind; label: string; hint: string }> = [
  { id: 'BUG', label: 'Report a problem', hint: 'Something is broken or behaves unexpectedly' },
  { id: 'CHANGE', label: 'Request a change', hint: 'A new feature or a change to what was agreed' },
  { id: 'QUESTION', label: 'Ask a question', hint: 'Anything you want the team to clarify' },
  { id: 'FEEDBACK', label: 'Give feedback', hint: 'Comments on a design, a demo or the process' },
];

function NewRequestDialog({ pid, open, onClose, onCreated }: { pid: number; open: boolean; onClose: () => void; onCreated: (n: number) => void }) {
  const qc = useQueryClient();
  const [kind, setKind] = useState<PortalRequestKind>('BUG');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const send = useMutation({
    mutationFn: () => workPortalApi.submitRequest(pid, { kind, title, description: desc || null }),
    onSuccess: (r) => {
      toast.success(`Sent as ${r.key} — the team has been notified`);
      qc.invalidateQueries({ queryKey: workPortalKeys.all(pid) });
      setTitle(''); setDesc(''); onClose(); onCreated(r.number);
    },
    onError: (err) => toast.error(workError(err, 'Could not send your request')),
  });
  return (
    <Dialog open={open} onClose={onClose} title="New request" width={560} footer={(
      <>
        <button type="button" className="w-btn w-btn-ghost" onClick={onClose}>Cancel</button>
        <button type="button" className="w-btn w-btn-primary" disabled={!title.trim() || send.isPending} onClick={() => send.mutate()} data-testid="portal-send-request">
          {send.isPending ? <Spinner size={12} /> : <Send size={13} />} Send to the team
        </button>
      </>
    )}>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1" role="radiogroup" aria-label="Type of request">
          {KINDS.map((k) => (
            <button key={k.id} type="button" role="radio" aria-checked={kind === k.id} onClick={() => setKind(k.id)}
              className={cn('rounded-[8px] border px-3 py-2 text-left', kind === k.id ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)]' : 'border-[var(--w-border)] hover:bg-[var(--w-hover)]')}>
              <span className="block text-[13px] font-medium">{k.label}</span>
              <span className="block text-[11.5px] text-[var(--w-text-3)]">{k.hint}</span>
            </button>
          ))}
        </div>
        <label className="block">
          <span className="mb-1 block text-[12.5px] font-medium">Title</span>
          <input className="w-input" value={title} maxLength={255} onChange={(e) => setTitle(e.target.value)} placeholder="Short summary" data-testid="portal-request-title" />
        </label>
        <label className="block">
          <span className="mb-1 block text-[12.5px] font-medium">Details</span>
          <textarea className="w-input min-h-[110px] py-2" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="What happened, where, and what you expected. Steps help a lot." />
        </label>
      </div>
    </Dialog>
  );
}

function RequestsTab({ pid, asClient, viewer, openIssue, deskOn }: { pid: number; asClient: boolean; viewer?: PortalViewer; openIssue: (n: number) => void; deskOn?: boolean }) {
  const [filter, setFilter] = useState<'all' | 'open' | 'done' | 'mine'>('all');
  const [creating, setCreating] = useState(false);
  const q = useQuery({ queryKey: [...workPortalKeys.tab(pid, 'requests', asClient), filter], queryFn: () => workPortalApi.requests(pid, asClient, filter) });
  const canSubmit = (q.data?.viewer ?? viewer)?.canSubmitRequest && (q.data?.viewer ?? viewer)?.clientView;
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Select aria-label="Show" value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)} className="!h-8 !w-auto">
          <option value="all">All shared items</option>
          <option value="open">Open</option>
          <option value="done">Done</option>
          <option value="mine">Sent by me</option>
        </Select>
        {canSubmit && (
          <button type="button" className="w-btn w-btn-primary w-btn-sm ml-auto" onClick={() => setCreating(true)} data-testid="portal-new-request"><Plus size={14} /> New request</button>
        )}
      </div>
      {q.isLoading ? <PageLoading rows={4} /> : q.error ? <EmptyState title="Could not load requests" body={workError(q.error)} /> : q.data?.items.length ? (
        <ul className="w-card overflow-hidden" data-testid="portal-requests">
          {q.data.items.map((r) => (
            <li key={r.number} className="border-b border-[var(--w-border)] last:border-b-0">
              <button type="button" onClick={() => openIssue(r.number)} className="flex w-full min-w-0 items-start gap-3 px-4 py-3 text-left hover:bg-[var(--w-hover)] md:items-center">
                <span className="min-w-0 flex-1 md:flex md:items-center md:gap-3">
                  <span className="flex min-w-0 items-center gap-2 md:flex-1">
                    <span className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)]">{r.key}</span>
                    <span className="truncate text-[14px] font-medium">{r.title}</span>
                  </span>
                  <span className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12px] text-[var(--w-text-3)] md:mt-0 md:shrink-0">
                    <StatusBadge status={r.status} />
                    <span>{r.type.name}</span>
                    {r.fromClient && <span className="rounded-full border border-[var(--w-border)] px-1.5">from you</span>}
                    {r.replies > 0 && <span className="flex items-center gap-0.5"><MessageSquare size={11} />{r.replies}</span>}
                    {r.files > 0 && <span className="flex items-center gap-0.5"><Paperclip size={11} />{r.files}</span>}
                    <span className="whitespace-nowrap">{relativeTime(r.updatedAt)}</span>
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState icon={<Inbox size={20} />} title="Nothing here yet" body="Items the team shares with you, and requests you send, show up here." />
      )}
      {/* Đợt S5a: mô-đun serviceDesk bật ⇒ form theo loại yêu cầu + tác động/khẩn cấp (hệ thống ra P, có SLA). */}
      {deskOn
        ? <DeskRequestDialog pid={pid} open={creating} onClose={() => setCreating(false)} onCreated={openIssue} />
        : <NewRequestDialog pid={pid} open={creating} onClose={() => setCreating(false)} onCreated={openIssue} />}
    </div>
  );
}

async function downloadFile(pid: number, aid: number) {
  try { window.open(await workApi.attachmentUrl(pid, aid), '_blank', 'noopener'); } catch (err) { toast.error(workError(err, 'Could not download')); }
}

/** Một thẻ như khách thấy: mô tả, tệp đã chia sẻ, các trả lời công khai + ô trả lời. */
export function RequestDialog({ pid, num, asClient, onClose, deskOn }: { pid: number; num: number | null; asClient: boolean; onClose: () => void; deskOn?: boolean }) {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: workPortalKeys.request(pid, num ?? 0, asClient), queryFn: () => workPortalApi.request(pid, num!, asClient), enabled: !!num });
  const [doc, setDoc] = useState<TiptapDoc | null>(null);
  const [key, setKey] = useState(0);
  const send = useMutation({
    // Khách: server luôn ghi PUBLIC. Nhân viên trong cổng: đây là "Reply to client".
    mutationFn: () => workApi.addComment(pid, num!, doc!, q.data?.viewer.isClient ? undefined : 'PUBLIC'),
    onSuccess: () => { setDoc(null); setKey((k) => k + 1); qc.invalidateQueries({ queryKey: workPortalKeys.all(pid) }); },
    onError: (err) => toast.error(workError(err, 'Could not send')),
  });
  const r = q.data;
  const canReply = r && !r.viewer.preview;
  return (
    <Dialog open={!!num} onClose={onClose} width={720} title={r ? <span className="flex min-w-0 items-center gap-2"><span className="font-mono text-[13px] text-[var(--w-accent-text)]">{r.key}</span><span className="truncate">{r.title}</span></span> : 'Loading…'}>
      {q.isLoading ? <PageLoading rows={3} /> : q.error || !r ? <EmptyState title="Not available" body={workError(q.error)} /> : (
        <div className="space-y-5">
          {!r.viewer.isClient && <ClientPill label={r.viewer.preview ? 'Preview — exactly what the client sees' : 'Visible to client'} />}
          {deskOn && num && <PortalSlaPanel pid={pid} num={num} asClient={asClient} />}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12.5px] text-[var(--w-text-3)]">
            <StatusBadge status={r.status} />
            <span>{r.type.name}</span>
            {r.stage && <span>Stage: {r.stage.n}. {r.stage.name}</span>}
            {r.parent && <span>Part of: {r.parent.title}</span>}
            {r.fixVersion && <span>Release: {r.fixVersion.name}</span>}
            {r.reporter && <span className="flex items-center gap-1"><UserAvatar user={r.reporter} size={16} />{userName(r.reporter)}</span>}
            <span>Updated {relativeTime(r.updatedAt)}</span>
          </div>
          <section>
            <h3 className="w-section-title mb-2">Description</h3>
            {r.descriptionJson && !isDocEmpty(r.descriptionJson) ? <RichView value={r.descriptionJson} /> : <p className="text-[13px] text-[var(--w-text-3)]">No description.</p>}
          </section>
          {r.attachments.length > 0 && (
            <section>
              <h3 className="w-section-title mb-2">Files</h3>
              <ul className="space-y-1.5">
                {r.attachments.map((a) => (
                  <li key={a.id} className="flex min-w-0 items-center gap-2 text-[13px]">
                    <FileText size={14} className="shrink-0 text-[var(--w-text-3)]" />
                    <span className="min-w-0 flex-1 truncate">{a.fileName}</span>
                    {a.deliverable && <ClientPill label="Deliverable" />}
                    <span className="shrink-0 text-[12px] text-[var(--w-text-3)]">{formatBytes(a.size)}</span>
                    <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={`Download ${a.fileName}`} onClick={() => void downloadFile(pid, a.id)}><Download size={13} /></button>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section>
            <h3 className="w-section-title mb-3">Conversation {r.comments.length > 0 && <span className="font-normal text-[var(--w-text-3)]">{r.comments.length}</span>}</h3>
            <div className="space-y-4" data-testid="portal-comments">
              {r.comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <UserAvatar user={c.author} size={26} className="mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2 text-[12px]">
                      <span className="font-semibold">{c.isAi ? 'CT Work AI' : userName(c.author)}</span>
                      {c.author && r.clientIds.includes(c.author.id) ? <span className="text-[var(--w-text-3)]">client</span> : <span className="text-[var(--w-text-3)]">team</span>}
                      <span className="text-[var(--w-text-3)]">{relativeTime(c.createdAt)}</span>
                    </div>
                    <RichView value={c.bodyJson} />
                  </div>
                </div>
              ))}
              {!r.comments.length && <p className="text-[13px] text-[var(--w-text-3)]">No replies yet.</p>}
            </div>
            {canReply && (
              <div className={cn('mt-4', !r.viewer.isClient && 'w-reply-client')}>
                {!r.viewer.isClient && <p className="mb-1.5 text-[11.5px] text-[var(--w-yellow)]">Reply to client — visible to the client, they get an email.</p>}
                <RichEditor key={key} value={doc} onChange={setDoc} placeholder={r.viewer.isClient ? 'Write a reply to the team…' : 'Reply to the client…'} minHeight={64} onSubmit={() => !isDocEmpty(doc) && send.mutate()} />
                <div className="mt-2 flex justify-end">
                  <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={isDocEmpty(doc) || send.isPending} onClick={() => send.mutate()} data-testid="portal-reply">
                    {send.isPending ? <Spinner size={12} /> : <Send size={13} />} {r.viewer.isClient ? 'Send reply' : 'Reply to client'}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </Dialog>
  );
}

// ─── Documents / Deliverables / Activity ─────────────────────────

function DocumentDialog({ pid, num, asClient, onClose }: { pid: number; num: number | null; asClient: boolean; onClose: () => void }) {
  const q = useQuery({ queryKey: workPortalKeys.doc(pid, num ?? 0, asClient), queryFn: () => workPortalApi.document(pid, num!, asClient), enabled: !!num });
  return (
    <Dialog open={!!num} onClose={onClose} width={820} title={q.data?.title ?? 'Document'}>
      {q.isLoading ? <PageLoading rows={4} /> : q.error || !q.data ? <EmptyState title="Not available" body={workError(q.error)} /> : (
        <div>
          <p className="mb-4 text-[12.5px] text-[var(--w-text-3)]">{q.data.stage ? `${q.data.stage} · ` : ''}Updated {relativeTime(q.data.updatedAt)}</p>
          <RichView value={q.data.contentJson} docs />
        </div>
      )}
    </Dialog>
  );
}

function DocumentsTab({ pid, asClient, openDoc }: { pid: number; asClient: boolean; openDoc: (n: number) => void }) {
  const q = useQuery({ queryKey: workPortalKeys.tab(pid, 'documents', asClient), queryFn: () => workPortalApi.documents(pid, asClient) });
  if (q.isLoading) return <PageLoading rows={4} />;
  if (q.error || !q.data) return <EmptyState title="Could not load documents" body={workError(q.error)} />;
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className={card}>
        <SectionTitle>Project documents</SectionTitle>
        {q.data.pages.length ? (
          <ul className="space-y-1" data-testid="portal-docs">
            {q.data.pages.map((p) => (
              <li key={p.number}>
                <button type="button" onClick={() => openDoc(p.number)} className="flex w-full min-w-0 items-center gap-2.5 rounded-[6px] px-2 py-2 text-left hover:bg-[var(--w-hover)]">
                  <FileText size={15} className="shrink-0 text-[var(--w-text-3)]" />
                  <span className="min-w-0 flex-1"><span className="block truncate text-[13.5px] font-medium">{p.title}</span><span className="block truncate text-[12px] text-[var(--w-text-3)]">{p.stage ?? 'General'} · {relativeTime(p.updatedAt)}</span></span>
                </button>
              </li>
            ))}
          </ul>
        ) : <p className="text-[13px] text-[var(--w-text-3)]">No documents have been shared yet.</p>}
      </section>
      <section className={card}>
        <SectionTitle>Shared files</SectionTitle>
        {q.data.files.length ? (
          <ul className="space-y-1">
            {q.data.files.map((f) => (
              <li key={f.id} className="flex min-w-0 items-center gap-2 px-2 py-1.5 text-[13px]">
                <Paperclip size={14} className="shrink-0 text-[var(--w-text-3)]" />
                <span className="min-w-0 flex-1"><span className="block truncate">{f.fileName}</span><span className="block truncate text-[11.5px] text-[var(--w-text-3)]">{f.issue.key} · {formatBytes(f.size)}</span></span>
                <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={`Download ${f.fileName}`} onClick={() => void downloadFile(pid, f.id)}><Download size={13} /></button>
              </li>
            ))}
          </ul>
        ) : <p className="text-[13px] text-[var(--w-text-3)]">No files shared yet.</p>}
      </section>
    </div>
  );
}

function DeliverablesTab({ pid, asClient }: { pid: number; asClient: boolean }) {
  const q = useQuery({ queryKey: workPortalKeys.tab(pid, 'deliverables', asClient), queryFn: () => workPortalApi.deliverables(pid, asClient) });
  if (q.isLoading) return <PageLoading rows={4} />;
  if (q.error || !q.data) return <EmptyState title="Could not load deliverables" body={workError(q.error)} />;
  if (!q.data.files.length && !q.data.releases.length) return <EmptyState icon={<PackageCheck size={20} />} title="No deliverables yet" body="Files and releases the team hands over to you will be listed here for download." />;
  return (
    <div className="space-y-4">
      {q.data.files.length > 0 && (
        <section className={card}>
          <SectionTitle>Delivered files</SectionTitle>
          <ul className="divide-y divide-[var(--w-border)]" data-testid="portal-deliverables">
            {q.data.files.map((f) => (
              <li key={f.id} className="flex min-w-0 items-center gap-3 py-2.5">
                <PackageCheck size={16} className="shrink-0 text-[var(--w-green)]" />
                <span className="min-w-0 flex-1"><span className="block truncate text-[13.5px] font-medium">{f.fileName}</span><span className="block truncate text-[12px] text-[var(--w-text-3)]">{f.issue.key} {f.issue.title}{f.issue.version ? ` · ${f.issue.version}` : ''} · {formatBytes(f.size)}</span></span>
                <span className="shrink-0 text-[12px] text-[var(--w-text-3)] max-sm:hidden">{formatDate(f.deliveredAt ?? f.createdAt)}</span>
                <button type="button" className="w-btn w-btn-sm" onClick={() => void downloadFile(pid, f.id)}><Download size={13} /> <span className="max-sm:hidden">Download</span></button>
              </li>
            ))}
          </ul>
        </section>
      )}
      {q.data.releases.length > 0 && (
        <section className={card}>
          <SectionTitle>Releases</SectionTitle>
          <ul className="space-y-3">
            {q.data.releases.map((r) => (
              <li key={r.id}>
                <div className="flex items-center gap-2 text-[13.5px] font-medium"><Rocket size={14} className="text-[var(--w-text-3)]" />{r.name}<span className="ml-auto text-[12px] font-normal text-[var(--w-text-3)]">{formatDate(r.releasedAt)}</span></div>
                <ul className="ml-6 mt-1 list-disc text-[13px] text-[var(--w-text-2)]">{r.items.map((i) => <li key={i.number}>{i.key} {i.title}</li>)}</ul>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function ActivityTab({ pid, asClient, go }: { pid: number; asClient: boolean; go: (patch: Record<string, string | null>) => void }) {
  const q = useQuery({ queryKey: workPortalKeys.tab(pid, 'activity', asClient), queryFn: () => workPortalApi.activity(pid, asClient) });
  if (q.isLoading) return <PageLoading rows={5} />;
  if (q.error || !q.data) return <EmptyState title="Could not load activity" body={workError(q.error)} />;
  if (!q.data.items.length) return <EmptyState icon={<Activity size={20} />} title="No activity yet" body="Shared updates, replies, approvals and deliveries will appear here." />;
  return (
    <ol className="w-card divide-y divide-[var(--w-border)]" data-testid="portal-activity">
      {q.data.items.map((e) => (
        <li key={e.id}>
          <button
            type="button"
            disabled={!e.issueNumber && !e.pageNumber && !e.approvalId}
            onClick={() => go(e.issueNumber ? { issue: String(e.issueNumber) } : e.pageNumber ? { tab: 'documents', doc: String(e.pageNumber) } : { tab: 'approvals', approval: String(e.approvalId) })}
            className="flex w-full items-start gap-3 px-4 py-3 text-left enabled:hover:bg-[var(--w-hover)]"
          >
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--w-accent)]" aria-hidden="true" />
            <span className="min-w-0 flex-1 text-[13.5px] [overflow-wrap:anywhere]">{e.text}</span>
            <span className="shrink-0 whitespace-nowrap text-[12px] text-[var(--w-text-3)]" title={new Date(e.at).toLocaleString('en-US')}>{relativeTime(e.at)}</span>
          </button>
        </li>
      ))}
    </ol>
  );
}

// ─── Khung trang ─────────────────────────────────────────────────

export default function PortalView({ config, pid }: { config: ProjectConfig; pid: number }) {
  const p = usePortalParams();
  const isClient = !!config.clientView;
  const asClient = !isClient && p.preview;
  const overview = useQuery({ queryKey: workPortalKeys.tab(pid, 'overview', asClient), queryFn: () => workPortalApi.overview(pid, asClient) });
  const viewer = overview.data?.viewer;
  const meetingsOn = !!config.modules?.meetings;
  const financeOn = !!config.modules?.finance;
  const reportsOn = !!config.modules?.reports;
  const deskOn = !!config.modules?.serviceDesk;
  const resourcesOn = !!config.modules?.resources;
  const tabs = useMemo(() => PORTAL_TABS.filter((t) => (t.id !== 'meetings' || meetingsOn) && (t.id !== 'payments' || financeOn) && (t.id !== 'reports' || reportsOn) && (t.id !== 'resources' || resourcesOn)), [meetingsOn, financeOn, reportsOn, resourcesOn]);
  const waiting = overview.data?.waitingOnClient.length ?? 0;

  return (
    <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
      {asClient && (
        <div className="sticky top-0 z-10 flex flex-wrap items-center gap-2 border-b border-[var(--w-border)] bg-[color-mix(in_srgb,var(--w-yellow)_12%,var(--w-panel))] px-4 py-2 text-[12.5px] md:px-6" role="status">
          <Eye size={14} className="text-[var(--w-yellow)]" />
          <span className="min-w-0 flex-1"><b>Preview as client</b> — exactly what your client sees. Read-only; you are not signed in as anyone else.</span>
          <button type="button" className="w-btn w-btn-sm" onClick={() => p.set({ preview: null })} data-testid="portal-exit-preview"><ArrowLeft size={13} /> Exit preview</button>
        </div>
      )}
      <div className="mx-auto w-full max-w-[1120px] px-4 py-5 md:px-6">
        <div className="mb-5 flex min-w-0 items-start gap-3">
          {/* CTW-23: nhận diện dự án trong cổng khách. */}
          <span className="mt-1 shrink-0"><ProjectMark k={config.key} size={44} letters={2} brand={overview.data?.project ?? config} /></span>
          <div className="min-w-0 flex-1">
            <div className="w-eyebrow">{isClient || asClient ? 'Client portal' : 'Client portal · team view'}</div>
            <h1 className="mt-1 text-[22px] font-semibold tracking-[-0.02em] [overflow-wrap:anywhere] md:text-[26px]">{config.name}</h1>
            {overview.data?.project.organization && <p className="text-[13px] text-[var(--w-text-3)]">for {overview.data.project.organization}</p>}
          </div>
          {overview.data?.project.workspaceLogoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={overview.data.project.workspaceLogoUrl} alt={overview.data.project.workspaceName} title={overview.data.project.workspaceName} className="h-10 max-w-[140px] shrink-0 object-contain" data-testid="portal-studio-logo" />
          )}
        </div>
        {!isClient && !asClient && <StaffPanel config={config} pid={pid} onPreview={() => p.set({ preview: '1' })} />}
        <nav className="-mx-4 mb-5 overflow-x-auto px-4 md:mx-0 md:px-0" aria-label="Portal sections">
          <div className="inline-flex min-w-max gap-1 border-b border-[var(--w-border)]" role="tablist">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={p.tab === t.id}
                onClick={() => p.set({ tab: t.id === 'overview' ? null : t.id, issue: null, approval: null, doc: null, meeting: null, report: null })}
                className={cn('-mb-px flex h-9 items-center gap-1.5 whitespace-nowrap border-b-2 px-2.5 text-[13px] font-medium', p.tab === t.id ? 'border-[var(--w-accent)] text-[var(--w-text)]' : 'border-transparent text-[var(--w-text-3)] hover:text-[var(--w-text-2)]')}
                data-testid={`portal-tab-${t.id}`}
              >
                <t.icon size={14} /> {t.label}
                {t.id === 'approvals' && waiting > 0 && <span className="w-count">{waiting}</span>}
              </button>
            ))}
          </div>
        </nav>
        {p.tab === 'overview' && <OverviewTab pid={pid} asClient={asClient} go={p.set} />}
        {p.tab === 'requests' && <RequestsTab pid={pid} asClient={asClient} viewer={viewer} openIssue={(n) => p.set({ issue: String(n) })} deskOn={deskOn} />}
        {p.tab === 'approvals' && <ApprovalsTab pid={pid} asClient={asClient} config={config} openApproval={(id) => p.set({ approval: String(id) })} />}
        {p.tab === 'documents' && <DocumentsTab pid={pid} asClient={asClient} openDoc={(n) => p.set({ doc: String(n) })} />}
        {p.tab === 'deliverables' && <DeliverablesTab pid={pid} asClient={asClient} />}
        {p.tab === 'meetings' && meetingsOn && <MeetingsTab pid={pid} asClient={asClient} openMeeting={(n) => p.set({ meeting: String(n) })} />}
        {p.tab === 'payments' && financeOn && <PaymentsTab pid={pid} asClient={asClient} />}
        {p.tab === 'reports' && reportsOn && <ReportsTab pid={pid} asClient={asClient} openId={p.report} setOpenId={(id) => p.set({ report: id ? String(id) : null })} />}
        {p.tab === 'resources' && resourcesOn && <PortalResources pid={pid} asClient={asClient} />}
        {p.tab === 'activity' && <ActivityTab pid={pid} asClient={asClient} go={p.set} />}
        {!isClient && !asClient && (
          <p className="mt-6 text-[12px] text-[var(--w-text-3)]">
            Only issues you <b>Share with client</b>, replies marked <b>Reply to client</b>, documents set to <b>Team and client</b> and shared files appear here.{' '}
            <Link href={`/work/${config.workspace.slug}/${config.key}/board`} className="text-[var(--w-accent-text)] hover:underline">Back to the board</Link>
          </p>
        )}
      </div>
      <RequestDialog pid={pid} num={p.issue} asClient={asClient} onClose={() => p.set({ issue: null })} deskOn={deskOn} />
      <PortalApprovalDialog pid={pid} id={p.approval} asClient={asClient} config={config} onClose={() => p.set({ approval: null })} />
      <DocumentDialog pid={pid} num={p.doc} asClient={asClient} onClose={() => p.set({ doc: null })} />
      {meetingsOn && <PortalMeetingDialog pid={pid} num={p.meeting} asClient={asClient} onClose={() => p.set({ meeting: null })} />}
    </div>
  );
}
