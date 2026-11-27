'use client';

/**
 * dm5 G1 (A22): dòng cảnh báo ở Backlog khi việc Must chiếm quá `settings.moscowCapPct` (mặc định 60%) effort của mọi
 * thẻ đang mở (trường MoSCoW). Không có trường MoSCoW / không vượt trần / đã tắt (0) ⇒ không vẽ gì.
 */

import { useQuery } from '@tanstack/react-query';
import { Scale } from 'lucide-react';
import { dm5Api, dm5Keys } from '@/lib/work-dm5a-api';
import { wt } from '@/components/work/i18n';

export default function MoscowStrip({ pid }: { pid: number }) {
  const q = useQuery({ queryKey: dm5Keys.moscow(pid, 'open'), queryFn: () => dm5Api.moscow(pid), staleTime: 60_000 });
  const m = q.data;
  if (!m?.enabled || !m.over || m.mustPct == null) return null;
  return (
    <div role="status" className="flex items-start gap-2 rounded-[8px] border border-[color-mix(in_srgb,var(--w-orange)_40%,transparent)] bg-[color-mix(in_srgb,var(--w-orange)_8%,transparent)] px-3 py-2 text-[12.5px]" data-testid="moscow-strip">
      <Scale size={13} className="mt-0.5 shrink-0 text-[var(--w-orange)]" aria-hidden="true" />
      <span>{wt('backlog.moscowOver', { pct: m.mustPct, cap: m.cap ?? 60 })}</span>
    </div>
  );
}
