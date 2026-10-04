'use client';

/**
 * Khu "Service desk" trong CHI TIẾT THẺ (đợt S5a). Một lời gọi GET /issues/:n/desk — mô-đun tắt / người xem
 * không phải người của đội ⇒ không vẽ gì (dự án cũ thấy thẻ y như trước). Thẻ chưa vào desk ⇒ nút "Add to
 * service desk" (người xử lý được). Thẻ đã vào: P1–P4 (đổi impact/urgency ⇒ tính lại), hai đồng hồ SLA, chờ
 * khách, người yêu cầu, câu trả lời form, Problem / CR liên quan, CSAT, nhật ký sự kiện SLA.
 */

import Link from 'next/link';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ChevronDown, ChevronRight, Headset, Pause, Play, Plus } from 'lucide-react';
import { userName, workError, type ProjectConfig } from '@/lib/work-api';
import { DESK_LEVELS, LEVEL_LABEL, deskApi, deskKeys, type DeskLevel } from '@/lib/work-s5a-api';
import { Spinner, UserAvatar } from '../ui';
import { Select } from '../settings/shared';
import { studioOn } from '../studio/shared';
import { NewRequestDialog, Stars } from './DeskView';
import { EVENT_LABEL, PriorityBadge, SlaClock } from './shared';

/**
 * `show="ticket"`: chỉ vẽ khi thẻ ĐÃ là yêu cầu desk (đặt trên mô tả). `show="add"`: chỉ nút "Add to service desk"
 * cho thẻ chưa vào desk (đặt cuối, không chen lên đầu mọi thẻ). Hai chỗ dùng chung một truy vấn (cache).
 */
export function IssueDesk({ config, issueNumber, show = 'ticket' }: { config: ProjectConfig; issueNumber: number; show?: 'ticket' | 'add' }) {
  const pid = config.id;
  const enabled = studioOn(config, 'serviceDesk') && !!config.permissions.viewDesk;
  const qc = useQueryClient();
  const q = useQuery({ queryKey: deskKeys.issue(pid, issueNumber), queryFn: () => deskApi.issue(pid, issueNumber), enabled, refetchInterval: 60_000 });
  const [adding, setAdding] = useState(false);
  const [log, setLog] = useState(false);
  const refresh = () => {
    qc.invalidateQueries({ queryKey: deskKeys.all(pid) });
    for (const k of ['issue', 'history']) qc.invalidateQueries({ queryKey: ['work', k] });
  };
  const wait = useMutation({
    mutationFn: (waiting: boolean) => deskApi.setWaiting(pid, issueNumber, waiting),
    onSuccess: (_d, waiting) => { toast.success(waiting ? 'Waiting for customer — SLA paused' : 'Resumed — SLA running'); refresh(); },
    onError: (err) => toast.error(workError(err, 'Could not update')),
  });
  const upd = useMutation({
    mutationFn: (patch: { impact?: DeskLevel; urgency?: DeskLevel }) => deskApi.updateTicket(pid, issueNumber, patch),
    onSuccess: (d) => { if (d.enabled && d.ticket) toast.success(`Priority ${d.ticket.priority} — SLA goals recomputed`); refresh(); },
    onError: (err) => toast.error(workError(err, 'Could not change the priority')),
  });
  if (!enabled || !q.data || !q.data.enabled) return null;
  const d = q.data;
  const t = d.ticket;
  const fetchedAt = q.dataUpdatedAt || Date.now();
  const base = `/work/${config.workspace.slug}/${config.key}`;
  if (!t) {
    if (!d.canWork || show !== 'add') return null;
    return (
      <section data-testid="issue-desk">
        <div className="flex items-center">
          <h3 className="w-section-title flex items-center gap-1.5"><Headset size={14} /> Service desk</h3>
          <button type="button" className="w-btn w-btn-ghost w-btn-sm ml-auto" onClick={() => setAdding(true)} data-testid="issue-desk-add"><Plus size={13} /> Add to service desk</button>
        </div>
        <NewRequestDialog config={config} open={adding} onClose={() => { setAdding(false); refresh(); }} issueNumber={issueNumber} />
      </section>
    );
  }
  if (show !== 'ticket') return null;
  const resolved = t.resolution.stopped;
  return (
    <section data-testid="issue-desk">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <h3 className="w-section-title flex items-center gap-1.5"><Headset size={14} /> Service desk</h3>
        <PriorityBadge p={t.priority} long />
        <span className="text-[12px] text-[var(--w-text-3)]">{t.requestTypeName}{t.channel === 'PORTAL' ? ' · from the client portal' : ''}</span>
        {d.canWork && !resolved && (
          t.waiting
            ? <button type="button" className="w-btn w-btn-sm ml-auto" disabled={wait.isPending} onClick={() => wait.mutate(false)} data-testid="desk-resume"><Play size={13} /> Resume</button>
            : <button type="button" className="w-btn w-btn-sm ml-auto" disabled={wait.isPending} onClick={() => wait.mutate(true)} data-testid="desk-wait"><Pause size={13} /> Waiting for customer</button>
        )}
      </div>
      <div className="rounded-[10px] border border-[var(--w-border)] p-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div><div className="mb-1 text-[11.5px] font-medium text-[var(--w-text-3)]">Time to first response</div><SlaClock t={t.firstResponse} fetchedAt={fetchedAt} label="First response" /></div>
          <div><div className="mb-1 text-[11.5px] font-medium text-[var(--w-text-3)]">Time to resolution</div><SlaClock t={t.resolution} fetchedAt={fetchedAt} label="Resolution" /></div>
        </div>
        {t.waiting && <p className="mt-2 text-[12px] text-[var(--w-text-3)]">Waiting for the customer — the clock is paused until they reply.</p>}
        <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-[12.5px] sm:grid-cols-4">
          <label className="min-w-0">
            <span className="mb-0.5 block text-[11.5px] text-[var(--w-text-3)]">Impact</span>
            <Select aria-label="Impact" className="!h-8" disabled={!d.canWork || upd.isPending} value={t.impact} onChange={(e) => upd.mutate({ impact: e.target.value as DeskLevel })} data-testid="desk-impact">
              {DESK_LEVELS.map((l) => <option key={l} value={l}>{LEVEL_LABEL[l]}</option>)}
            </Select>
          </label>
          <label className="min-w-0">
            <span className="mb-0.5 block text-[11.5px] text-[var(--w-text-3)]">Urgency</span>
            <Select aria-label="Urgency" className="!h-8" disabled={!d.canWork || upd.isPending} value={t.urgency} onChange={(e) => upd.mutate({ urgency: e.target.value as DeskLevel })} data-testid="desk-urgency">
              {DESK_LEVELS.map((l) => <option key={l} value={l}>{LEVEL_LABEL[l]}</option>)}
            </Select>
          </label>
          <div className="min-w-0">
            <span className="mb-0.5 block text-[11.5px] text-[var(--w-text-3)]">Requester</span>
            {t.requester ? <span className="flex min-w-0 items-center gap-1.5"><UserAvatar user={t.requester} size={18} /><span className="truncate">{userName(t.requester)}</span></span> : <span className="text-[var(--w-text-3)]">—</span>}
          </div>
          <div className="min-w-0">
            <span className="mb-0.5 block text-[11.5px] text-[var(--w-text-3)]">First response</span>
            <span className="[overflow-wrap:anywhere]">{t.firstResponseAt ? `${new Date(t.firstResponseAt).toLocaleString()}${t.firstResponseBy ? ` · ${t.firstResponseBy}` : ''}` : 'Not yet — reply with “Reply to client”'}</span>
          </div>
        </div>
        {t.fields.length > 0 && (
          <dl className="mt-3 space-y-1.5 border-t border-[var(--w-border)] pt-2 text-[12.5px]">
            {t.fields.map((f) => <div key={f.key}><dt className="text-[11.5px] text-[var(--w-text-3)]">{f.label}</dt><dd className="whitespace-pre-wrap [overflow-wrap:anywhere]">{f.value}</dd></div>)}
          </dl>
        )}
        {(t.problem || t.changeRequest || t.csat.rating !== null) && (
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-[var(--w-border)] pt-2 text-[12.5px]">
            {t.problem && <Link href={`${base}/desk?tab=problems&problem=${t.problem.number}`} className="text-[var(--w-accent-text)] hover:underline">PRB-{t.problem.number} {t.problem.title}</Link>}
            {t.changeRequest && <Link href={`${base}/changes/${t.changeRequest.number}`} className="text-[var(--w-accent-text)] hover:underline">CR-{t.changeRequest.number} {t.changeRequest.title}</Link>}
            {t.csat.rating !== null && <span className="flex min-w-0 items-center gap-1.5">CSAT <Stars n={t.csat.rating} />{t.csat.comment && <span className="truncate text-[var(--w-text-3)]">“{t.csat.comment}”</span>}</span>}
          </div>
        )}
        <button type="button" className="mt-2 flex items-center gap-1 text-[12px] text-[var(--w-text-3)] hover:text-[var(--w-text)]" onClick={() => setLog((x) => !x)} aria-expanded={log}>
          {log ? <ChevronDown size={12} /> : <ChevronRight size={12} />} SLA log ({t.events.length})
        </button>
        {log && (
          <ol className="mt-1.5 space-y-1 text-[12px]" data-testid="desk-events">
            {t.events.map((e) => (
              <li key={e.id} className="flex min-w-0 flex-wrap gap-x-2">
                <span className="shrink-0 tabular-nums text-[var(--w-text-3)]">{new Date(e.at).toLocaleString()}</span>
                <span>{EVENT_LABEL[e.kind] ?? e.kind}{e.kind === 'PRIORITY' && e.note ? ` (${e.note})` : ''}</span>
                {e.actor && <span className="text-[var(--w-text-3)]">· {e.actor}</span>}
              </li>
            ))}
          </ol>
        )}
      </div>
      {upd.isPending && <Spinner size={12} />}
    </section>
  );
}
