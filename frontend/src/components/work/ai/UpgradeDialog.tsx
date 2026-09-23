'use client';

/** Hết lượt AI miễn phí trong ngày (HTTP 402) — mời nâng cấp, không báo lỗi. */

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Dialog } from '../ui';

export default function UpgradeDialog({ open, onClose, limit }: { open: boolean; onClose: () => void; limit?: number | null }) {
  const n = limit && limit > 0 ? limit : null;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      width={440}
      title={<span className="inline-flex items-center gap-2"><Sparkles size={16} className="text-[var(--w-accent-text)]" />You&apos;re out of free AI requests</span>}
      footer={(
        <>
          <button type="button" className="w-btn" onClick={onClose}>Maybe later</button>
          <Link href="/pro" className="w-btn w-btn-primary" onClick={onClose}>Upgrade to Pro</Link>
        </>
      )}
    >
      <div className="space-y-3 text-[13px] leading-relaxed text-[var(--w-text-2)]">
        <p>
          Free accounts get {n ? <strong className="text-[var(--w-text)]">{n} AI request{n === 1 ? '' : 's'}</strong> : 'a few AI requests'} per day.
          Your allowance resets tomorrow.
        </p>
        <p>
          <strong className="text-[var(--w-text)]">Pro</strong> gives you unlimited use of the assistant: planning help, user stories,
          test cases, bug-report cleanup and sprint check-ins, whenever you need them.
        </p>
      </div>
    </Dialog>
  );
}
