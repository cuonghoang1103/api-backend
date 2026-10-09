'use client';

/**
 * Lời mời xem hướng dẫn 5 phút cho người chưa có không gian nào (trang /work).
 * Ẩn được, nhớ trong localStorage. Mặc định ẩn cho tới khi đọc xong
 * localStorage (tránh nháy khi render phía máy chủ).
 */

import { useEffect, useState } from 'react';
import { ArrowRight, Compass, X } from 'lucide-react';
import { openHelp } from './store';
import { wt } from '@/components/work/i18n';

const KEY = 'ctwork-help:tour-dismissed';

export default function HelpTourCard() {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    try {
      setHidden(window.localStorage.getItem(KEY) === '1');
    } catch {
      setHidden(false);
    }
  }, []);

  const dismiss = () => {
    setHidden(true);
    try {
      window.localStorage.setItem(KEY, '1');
    } catch {
      /* không lưu được thì chỉ ẩn trong phiên này */
    }
  };

  if (hidden) return null;
  return (
    <div className="mb-5 flex items-start gap-3 rounded-[var(--w-radius-lg)] border border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] px-4 py-3">
      <Compass size={18} className="mt-0.5 shrink-0 text-[var(--w-accent-text)]" />
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-semibold">{wt('shell.tourTitle')}</div>
        <p className="mt-0.5 text-[12.5px] leading-relaxed text-[var(--w-text-2)]">
          {wt('shell.tourBody')}
        </p>
        <button type="button" className="w-btn w-btn-primary w-btn-sm mt-2.5" onClick={() => openHelp('getting-started')}>
          {wt('shell.startTour')} <ArrowRight size={13} />
        </button>
      </div>
      <button type="button" onClick={dismiss} className="w-btn w-btn-ghost w-btn-icon w-btn-sm shrink-0" aria-label={wt('shell.dismiss')} title={wt('shell.dismiss')}>
        <X size={14} />
      </button>
    </div>
  );
}
