'use client';

/** Nút "?" ở header dự án — mở Trợ giúp đúng bài của trang đang xem. */

import { CircleHelp } from 'lucide-react';
import { openContextualHelp } from './store';

export default function HelpButton() {
  return (
    <button
      type="button"
      className="w-btn"
      onClick={openContextualHelp}
      aria-label="Help & guide"
      title="Help & guide (?)"
    >
      <CircleHelp size={14} className="text-[var(--w-text-2)]" />
      <span className="max-md:hidden">Help</span>
    </button>
  );
}
