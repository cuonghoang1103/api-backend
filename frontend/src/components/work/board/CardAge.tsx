'use client';

/**
 * dm5 G1 (A18): TUỔI THẺ trên board — số ngày thẻ đã nằm ở cột hiện tại (lịch sử statusId; chưa đổi lần nào ⇒ từ lúc tạo).
 * Board tải một lần (GET /projects/:pid/board/ages, làm tươi theo sự kiện board) rồi phát qua context — không phải luồn prop
 * qua Cell/CardBody. Chỉ hiện từ 2 ngày; ≥ 5 ngày cam, ≥ 10 ngày đỏ. Cột Done không hiện.
 */

import { createContext, useContext } from 'react';
import { Hourglass } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { dm5Api } from '@/lib/work-dm5a-api';
import { wk } from '../hooks';
import { wt } from '@/components/work/i18n';

export const CardAgesCtx = createContext<Record<number, number> | null>(null);

/** Tuổi thẻ của dự án — khoá nằm dưới wk.board(pid) nên realtime làm tươi cùng board. */
export function useCardAges(pid: number) {
  return useQuery({ queryKey: [...wk.board(pid), 'ages'], queryFn: () => dm5Api.boardAges(pid), staleTime: 60_000 }).data ?? null;
}

export function CardAgeBadge({ number, inDone }: { number: number; inDone: boolean }) {
  const ages = useContext(CardAgesCtx);
  const n = ages?.[number];
  if (inDone || n == null || n < 2) return null;
  const color = n >= 10 ? 'var(--w-red)' : n >= 5 ? 'var(--w-orange)' : 'var(--w-text-3)';
  const label = wt('pboard.ageDays', { n });
  return (
    <span
      className="pointer-events-none absolute -top-2 right-2 inline-flex h-4 items-center gap-0.5 rounded-full bg-[var(--w-raised)] px-1.5 text-[10.5px] font-medium tabular shadow-[0_0_0_1px_var(--w-border)]"
      style={{ color }} title={label} aria-label={label}
    >
      <Hourglass size={10} aria-hidden="true" />{n}d
    </span>
  );
}
