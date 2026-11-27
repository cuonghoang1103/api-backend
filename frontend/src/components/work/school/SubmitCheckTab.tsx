'use client';

/**
 * dm5 G2 (27/11/2026) B14 — "Soát trước nộp": tên UC (SRS) ↔ tiêu đề thẻ ↔ WBS + checklist 10 lỗi bút đỏ (mẫu Docs
 * sep490-red-pen-checklist). Chỉ ĐỌC — mỗi mục xanh / đỏ (kèm chi tiết) / xám (chưa áp dụng). MCP: ctwork_read submit_check.
 */

import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, CircleDashed, RefreshCw, XCircle } from 'lucide-react';
import { workDm5bApi, workDm5bKeys } from '@/lib/work-dm5b-api';
import { wt } from '@/components/work/i18n';
import { EmptyState, PageLoading } from '../ui';

export default function SubmitCheckTab({ pid }: { pid: number }) {
  const q = useQuery({ queryKey: workDm5bKeys.submit(pid), queryFn: () => workDm5bApi.submitCheck(pid) });
  if (q.isLoading) return <PageLoading />;
  if (!q.data) return <EmptyState title={wt('common.couldNotLoad')} />;
  const r = q.data;
  return (
    <div className="flex flex-col gap-3" data-testid="school-submit-check">
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[13px] text-[var(--w-text-2)]">{wt('g2.submitIntro')}</p>
          <p className="mt-1 text-[13px] font-medium">{wt('g2.submitPassed', { p: r.passed, f: r.failed, n: r.notApplicable })}</p>
        </div>
        <button type="button" className="w-btn w-btn-sm" onClick={() => q.refetch()} disabled={q.isFetching}><RefreshCw size={13} className={q.isFetching ? 'animate-spin' : ''} /> {wt('g2.recheck')}</button>
      </div>
      <ol className="m-0 flex list-none flex-col gap-2 p-0">
        {r.items.map((it) => (
          <li key={it.key} className="rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)] px-3 py-2">
            <div className="flex items-start gap-2 text-[13px]">
              {it.ok === true ? <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[var(--w-green-text)]" aria-label="OK" />
                : it.ok === false ? <XCircle size={16} className="mt-0.5 shrink-0 text-[var(--w-red-text)]" aria-label="!" />
                  : <CircleDashed size={16} className="mt-0.5 shrink-0 text-[var(--w-text-3)]" aria-label="—" />}
              <span className="min-w-0 flex-1">
                <span className="font-medium">{it.n}. {it.title}</span>
                {it.ok === null && <span className="ml-2 text-[12px] text-[var(--w-text-3)]">{wt('g2.submitNa')}</span>}
                {!!it.details.length && (
                  <ul className="mb-0 mt-1 list-disc pl-5 text-[12.5px] text-[var(--w-text-2)]">
                    {it.details.slice(0, 15).map((d, i) => <li key={i}>{d}</li>)}
                    {it.details.length > 15 && <li>… +{it.details.length - 15}</li>}
                  </ul>
                )}
              </span>
            </div>
          </li>
        ))}
      </ol>
      {!!r.ucNames.length && (
        <section aria-labelledby="ucnames" className="rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)] p-3">
          <h2 id="ucnames" className="mb-2 text-[13px] font-semibold">{wt('g2.submitUcNames')}</h2>
          <ul className="m-0 list-none space-y-1 p-0 text-[12.5px]">
            {r.ucNames.map((u) => (
              <li key={u.uc} className="flex items-start gap-2">
                {u.ok ? <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-[var(--w-green-text)]" /> : <XCircle size={14} className="mt-0.5 shrink-0 text-[var(--w-red-text)]" />}
                <span className="w-12 shrink-0 font-mono">{u.uc}</span>
                <span className="min-w-0 flex-1">{u.name}{u.issue ? <span className="text-[var(--w-text-2)]"> ↔ {u.issue} “{u.issueTitle}”</span> : <span className="text-[var(--w-red-text)]"> — no issue</span>}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
