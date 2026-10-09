'use client';

/** Nút "?" ở header dự án — mở Trợ giúp đúng bài của trang đang xem. */

import { CircleHelp } from 'lucide-react';
import { openContextualHelp } from './store';
import { wt } from '@/components/work/i18n';

export default function HelpButton() {
  return (
    <button
      type="button"
      className="w-btn"
      onClick={openContextualHelp}
      aria-label={wt('shell.helpGuide')}
      title={wt('shell.helpGuideKey')}
    >
      <CircleHelp size={14} className="text-[var(--w-text-2)]" />
      <span className="max-xl:hidden">{wt('shell.helpShort')}</span>
    </button>
  );
}
