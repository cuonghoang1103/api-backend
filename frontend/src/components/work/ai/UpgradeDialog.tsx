'use client';

/** Hết lượt AI miễn phí trong ngày (HTTP 402) — mời nâng cấp, không báo lỗi. */

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Dialog } from '../ui';
import { wt } from '@/components/work/i18n';

export default function UpgradeDialog({ open, onClose, limit }: { open: boolean; onClose: () => void; limit?: number | null }) {
  const n = limit && limit > 0 ? limit : null;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      width={440}
      title={<span className="inline-flex items-center gap-2"><Sparkles size={16} className="text-[var(--w-accent-text)]" />{wt('ai.outOfFree')}</span>}
      footer={(
        <>
          <button type="button" className="w-btn" onClick={onClose}>{wt('ai.maybeLater')}</button>
          <Link href="/pro" className="w-btn w-btn-primary" onClick={onClose}>{wt('ai.upgradePro')}</Link>
        </>
      )}
    >
      <div className="space-y-3 text-[13px] leading-relaxed text-[var(--w-text-2)]">
        <p>
          {wt('ai.freeGetN', { n: n ?? wt('ai.aFew') })} {wt('ai.resetsTomorrow')}
        </p>
        <p>
          <strong className="text-[var(--w-text)]">Pro</strong> {wt('ai.proGives')}
        </p>
      </div>
    </Dialog>
  );
}
