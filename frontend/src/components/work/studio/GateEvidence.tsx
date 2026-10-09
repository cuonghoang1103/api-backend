'use client';

/**
 * CTW-1 (06/10/2026): BẰNG CHỨNG của phê duyệt cổng giai đoạn — tiêu chí (thẻ cổng), thẻ của giai đoạn
 * + thẻ ghim, tệp ghim + tệp bàn giao, tài liệu. Dùng chung cho cổng khách (PortalApprovalDialog) và
 * trang phê duyệt của đội (ApprovalBody). Dữ liệu đã được backend lọc theo người xem (khách chỉ thấy
 * thứ đã chia sẻ), ở đây chỉ vẽ.
 */

import { useState } from 'react';
import { toast } from 'sonner';
import { CheckCircle2, Circle, Download, FileText, ListChecks, Paperclip, Pin } from 'lucide-react';
import { workApi, workError } from '@/lib/work-api';
import type { GateEvidence } from '@/lib/work-ctw-api';
import { formatBytes, Spinner, StatusBadge } from '../ui';
import { Pill } from './shared';
import { wt } from '@/components/work/i18n';

export function GateEvidenceView({ pid, ev, clientView, docHref }: { pid: number; ev: GateEvidence; clientView: boolean; docHref?: (num: number) => string }) {
  const [opening, setOpening] = useState<number | null>(null);
  const open = async (id: number) => {
    setOpening(id);
    try {
      window.open(await workApi.attachmentUrl(pid, id, true), '_blank', 'noopener');
    } catch (e) {
      toast.error(workError(e, wt('studio.openFileFailed')));
    } finally {
      setOpening(null);
    }
  };
  const empty = !ev.criteria && !ev.issues.length && !ev.files.length && !ev.pages.length;
  return (
    <section className="space-y-3" data-testid="gate-evidence">
      <h3 className="w-section-title flex items-center gap-1.5"><ListChecks size={14} />{clientView ? wt('studio.whatApproving') : wt('studio.evidenceGate')}</h3>
      {empty && <p className="text-[12.5px] text-[var(--w-text-3)]">{clientView ? wt('studio.noItemsClient') : wt('studio.noItemsTeam')}</p>}

      {ev.criteria && (
        <div className="rounded-[8px] border border-[var(--w-border)] p-3">
          <div className="mb-1 flex flex-wrap items-center gap-2 text-[12.5px]">
            <span className="font-medium">{wt('studio.exitCriteria')}</span>
            <span className="font-mono text-[12px] text-[var(--w-accent-text)]">{ev.criteria.key}</span>
            {ev.criteria.done ? <Pill tone="green">{wt('studio.met')}</Pill> : <Pill tone="neutral">{wt('common.open')}</Pill>}
          </div>
          <div className="text-[13px] font-medium">{ev.criteria.title}</div>
          {ev.criteria.text && <p className="mt-1 max-h-48 overflow-auto whitespace-pre-line text-[12.5px] text-[var(--w-text-2)]">{ev.criteria.text}</p>}
        </div>
      )}

      {ev.issues.length > 0 && (
        <div>
          <div className="mb-1 text-[12.5px] text-[var(--w-text-3)]">{wt('studio.itemsDone', { a: ev.issueDone, count: ev.issueTotal })}</div>
          <ul className="divide-y divide-[var(--w-border)] rounded-[8px] border border-[var(--w-border)]">
            {ev.issues.map((i) => (
              <li key={i.number} className="flex min-w-0 items-center gap-2 px-3 py-2 text-[13px]">
                {i.done ? <CheckCircle2 size={14} className="shrink-0 text-[var(--w-green,#16a34a)]" /> : <Circle size={14} className="shrink-0 text-[var(--w-text-3)]" />}
                <span className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)]">{i.key}</span>
                <span className="min-w-0 flex-1 truncate" title={i.title}>{i.title}</span>
                {i.pinned && !clientView && <Pin size={12} className="shrink-0 text-[var(--w-text-3)]" aria-label={wt('studio.pinnedEv')} />}
                <StatusBadge status={i.status} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {ev.files.length > 0 && (
        <div>
          <div className="mb-1 flex items-center gap-1 text-[12.5px] text-[var(--w-text-3)]"><Paperclip size={12} />{wt('portal.files')}</div>
          <ul className="flex flex-col gap-1">
            {ev.files.map((f) => (
              <li key={f.id} className="flex min-w-0 items-center gap-2 text-[13px]">
                <button type="button" className="flex min-w-0 items-center gap-1.5 text-left text-[var(--w-accent-text)] hover:underline" onClick={() => void open(f.id)}>
                  {opening === f.id ? <Spinner size={12} /> : <Download size={12} className="shrink-0" />}
                  <span className="truncate">{f.fileName}</span>
                </button>
                <span className="shrink-0 text-[12px] text-[var(--w-text-3)]">{formatBytes(f.size)} · {f.issueKey}</span>
                {f.deliverable && <Pill tone="blue">{wt('portal.deliverable')}</Pill>}
                {!clientView && f.clientVisible === false && <Pill tone="neutral" title={wt('studio.notSharedFile')}>{wt('docs.internalTag')}</Pill>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {ev.pages.length > 0 && (
        <div>
          <div className="mb-1 flex items-center gap-1 text-[12.5px] text-[var(--w-text-3)]"><FileText size={12} />{wt('portal.tDocuments')}</div>
          <ul className="flex flex-col gap-1 text-[13px]">
            {ev.pages.map((p) => (
              <li key={p.number} className="flex min-w-0 items-center gap-2">
                {docHref ? <a href={docHref(p.number)} className="truncate text-[var(--w-accent-text)] hover:underline">{p.title}</a> : <span className="truncate">{p.title}</span>}
                <span className="shrink-0 text-[12px] text-[var(--w-text-3)]">{p.status.toLowerCase().replace('_', ' ')}</span>
                {!clientView && p.visibility && p.visibility !== 'CLIENT' && <Pill tone="neutral">{wt('docs.internalTag')}</Pill>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!clientView && !!ev.openAtRequest && (
        <p className="rounded-[8px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2 text-[12.5px]">
          {wt('studio.sentWithOpen', { count: ev.openAtRequest })}{ev.openReason ? <> — “{ev.openReason}”</> : ''}{wt('studio.onlyTeamNote')}
        </p>
      )}
    </section>
  );
}
