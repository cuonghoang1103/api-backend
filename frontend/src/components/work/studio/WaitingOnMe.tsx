'use client';

/**
 * "Waiting on me" trong My work (lớp studio S1): phê duyệt tới lượt tôi +
 * bàn giao chờ tôi nhận, ở MỌI dự án (/me/approvals, /me/handoffs — server đã
 * lọc dự án bật mô-đun + quyền). Không có gì thì không vẽ gì: người không dùng
 * studio thấy My work y như cũ.
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BadgeCheck, FileText, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workStudioApi, workStudioKeys, type MyApproval } from '@/lib/work-api';
import { formatDate, relativeTime } from '../ui';
import { ApprovalDialog } from './ApprovalDetail';
import HandoffCard from './HandoffCard';
import { Pill } from './shared';

export default function WaitingOnMe() {
  const approvals = useQuery({ queryKey: workStudioKeys.myApprovals, queryFn: workStudioApi.myApprovals, staleTime: 15_000 });
  const handoffs = useQuery({ queryKey: workStudioKeys.myHandoffs, queryFn: workStudioApi.myHandoffs, staleTime: 15_000 });
  const [open, setOpen] = useState<MyApproval | null>(null);
  const a = approvals.data ?? [];
  const h = handoffs.data ?? [];
  if (!a.length && !h.length) return null;
  return (
    <section aria-label="Waiting on me" className="space-y-3">
      <h2 className="flex items-center gap-2 text-[14px] font-semibold">
        Waiting on me
        <span className="rounded-full bg-[var(--w-accent-soft)] px-2 text-[12px] font-medium leading-[20px] tabular-nums text-[var(--w-accent-text)]">{a.length + h.length}</span>
      </h2>
      <div className={cn('grid grid-cols-1 gap-3', a.length && h.length && 'xl:grid-cols-2')}>
        {a.length > 0 && (
          <div>
            <h3 className="mb-1.5 text-[12px] font-medium text-[var(--w-text-3)]">Approvals · your turn</h3>
            <ul className="w-card overflow-hidden">
              {a.map((x) => (
                <li key={x.id} className="border-b border-[var(--w-border)] last:border-b-0">
                  <button type="button" onClick={() => setOpen(x)} className="flex w-full min-w-0 items-center gap-3 px-4 py-2.5 text-left hover:bg-[var(--w-hover)]">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]">
                      {x.targetType === 'STAGE_GATE' ? <Flag size={14} /> : x.targetType === 'DOC' ? <FileText size={14} /> : <BadgeCheck size={14} />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex min-w-0 items-center gap-2">
                        {x.issueKey && <span className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)]">{x.issueKey}</span>}
                        <span className="truncate text-[14px] font-medium">{x.title}</span>
                      </span>
                      <span className="mt-0.5 flex min-w-0 flex-wrap items-center gap-x-2 text-[12px] text-[var(--w-text-3)]">
                        <span className="truncate">{x.project.name}</span>
                        <span aria-hidden="true">·</span>
                        <span>{x.dueAt ? `Due ${formatDate(x.dueAt)}` : `Asked ${relativeTime(x.createdAt)}`}</span>
                        {x.contentChanged && <Pill tone="orange">Changed</Pill>}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {h.length > 0 && (
          <div>
            <h3 className="mb-1.5 text-[12px] font-medium text-[var(--w-text-3)]">Incoming handoffs</h3>
            <div className="w-card divide-y divide-[var(--w-border)] overflow-hidden">
              {h.map((x) => <HandoffCard key={`${x.id}-${x.status}`} h={x} issueHref={`/work/${x.project.workspaceSlug}/${x.project.key}/issue/${x.issue.number}`} />)}
            </div>
          </div>
        )}
      </div>
      <ApprovalDialog pid={open?.projectId ?? 0} approvalId={open?.id ?? null} base={open ? `/work/${open.project.workspaceSlug}/${open.project.key}` : undefined} onClose={() => setOpen(null)} />
    </section>
  );
}
