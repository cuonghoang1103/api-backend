'use client';

/**
 * CT Work 27/10/2026 — nút "CuongMini review": nhờ CuongMini đọc diff THẬT của PR (hoặc PR/nhánh của thẻ), đối chiếu tiêu
 * chí "Xong khi" + Definition of Done, lưu một phiên review CODE và bình luận vào thẻ. Chỉ hiện với người được review
 * (permissions.aiCodeReview — server kiểm lại theo thẻ/PR). Người review quyết định; CuongMini không duyệt, không merge.
 */

import { useState } from 'react';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { Sparkles } from 'lucide-react';
import { workError } from '@/lib/work-api';
import { cn } from '@/lib/utils';
import { Spinner } from '../ui';
import { wt } from '@/components/work/i18n';
import { codeApi, codeKeys, type AiReviewResult } from './codeApi';

export default function AiReviewButton({ pid, reviewsHref, pr, issue, compact, className }: {
  pid: number;
  /** /work/<ws>/<KEY>/reviews — link mở phiên vừa lưu. */
  reviewsHref: string;
  pr?: number;
  issue?: number;
  compact?: boolean;
  className?: string;
}) {
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [notify, setNotify] = useState(true);
  const [done, setDone] = useState<AiReviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setBusy(true);
    setError(null);
    try {
      const r = await codeApi.aiReview(pid, { ...(pr ? { pr } : {}), ...(issue ? { issue } : {}), notify });
      setDone(r);
      void qc.invalidateQueries({ queryKey: ['work', 'project', pid] });
      void qc.invalidateQueries({ queryKey: codeKeys.all(pid) });
    } catch (err) {
      setError(workError(err, wt('code.aiReviewFailed')));
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    const verdict = wt(`code.verdict${done.verdict}` as 'code.verdictAPPROVE');
    return (
      <div className={cn('flex flex-wrap items-center gap-1.5 text-[12px]', className)}>
        <Sparkles size={12} className="shrink-0 text-[var(--w-accent-text)]" aria-hidden="true" />
        <span className={cn('font-medium', done.verdict === 'CHANGES' ? 'text-[var(--w-red,#dc2626)]' : done.verdict === 'APPROVE' ? 'text-[var(--w-green)]' : 'text-[var(--w-text-2)]')}>{verdict}</span>
        <span className="text-[var(--w-text-3)]">· {wt('code.aiReviewDone', { key: done.key, n: done.findings })}</span>
        <Link href={`${reviewsHref}?review=${done.review}`} className="font-medium text-[var(--w-accent-text)] hover:underline">{wt('code.aiReviewOpen')}</Link>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className={cn('w-btn', compact && 'h-7 px-2 text-[12px]')} onClick={run} disabled={busy} title={wt('code.aiReviewHint')}>
          {busy ? <Spinner size={11} /> : <Sparkles size={13} aria-hidden="true" />}
          <span>{busy ? wt('code.aiReviewing') : wt('code.aiReview')}</span>
        </button>
        {!compact && !busy && (
          <label className="inline-flex items-center gap-1 text-[11.5px] text-[var(--w-text-2)]">
            <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} />
            {wt('code.aiReviewNotify')}
          </label>
        )}
      </div>
      {error && <p className="text-[11.5px] text-[var(--w-red,#dc2626)]" role="alert">{error}</p>}
    </div>
  );
}
