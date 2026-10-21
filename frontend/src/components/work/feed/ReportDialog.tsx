'use client';

/** Báo cáo bài / bình luận (App Store 1.2): lý do + chi tiết. Gửi xong ⇒ nội dung biến khỏi bảng tin của người báo. */

import { useState } from 'react';
import { toast } from 'sonner';
import { workError } from '@/lib/work-api';
import { FEED_REPORT_REASONS, feedApi, type FeedReportReason } from '@/lib/work-feed-api';
import { Dialog, Spinner } from '@/components/work/ui';
import { wt } from '@/components/work/i18n';

export function ReportDialog({ target, onClose, onDone }: {
  target: { kind: 'post' | 'comment'; id: number } | null; onClose: () => void; onDone: () => void;
}) {
  const [reason, setReason] = useState<FeedReportReason>('spam');
  const [detail, setDetail] = useState('');
  const [busy, setBusy] = useState(false);
  const send = async () => {
    if (!target) return;
    setBusy(true);
    try {
      const r = target.kind === 'post' ? await feedApi.report(target.id, reason, detail) : await feedApi.reportComment(target.id, reason, detail);
      toast.success(r.duplicate ? wt('feed.alreadyReported') : wt('feed.reportedToast'));
      setDetail('');
      onDone();
    } catch (err) {
      toast.error(workError(err));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Dialog
      open={!!target}
      onClose={onClose}
      title={wt('feed.reportTitle')}
      width={460}
      footer={(
        <>
          <button type="button" className="w-btn" onClick={onClose}>{wt('feed.cancel')}</button>
          <button type="button" className="w-btn w-btn-danger-solid" disabled={busy} onClick={send}>{busy && <Spinner size={12} />}{wt('feed.reportSend')}</button>
        </>
      )}
    >
      <p className="mb-3 text-[13.5px] text-[var(--w-text-2)]">{wt('feed.reportBody')}</p>
      <fieldset className="grid gap-1">
        <legend className="sr-only">{wt('feed.reportTitle')}</legend>
        {FEED_REPORT_REASONS.map((r) => (
          <label key={r} className="flex h-9 cursor-pointer items-center gap-2.5 rounded-[6px] px-2 text-[14px] hover:bg-[var(--w-hover)]">
            <input type="radio" name="feed-report" value={r} checked={reason === r} onChange={() => setReason(r)} className="accent-[var(--w-accent)]" />
            {wt(`feed.reason_${r}` as 'feed.reason_spam')}
          </label>
        ))}
      </fieldset>
      <label className="mt-3 block text-[12.5px] font-medium text-[var(--w-text-2)]" htmlFor="feed-report-detail">{wt('feed.reportDetail')}</label>
      <textarea id="feed-report-detail" className="w-input mt-1 min-h-[72px] w-full py-2" maxLength={1000} value={detail} onChange={(e) => setDetail(e.target.value)} />
      <p className="mt-2 text-[12px] text-[var(--w-text-3)]">{wt('feed.blockHint')}</p>
    </Dialog>
  );
}
