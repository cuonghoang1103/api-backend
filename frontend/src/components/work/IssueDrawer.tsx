'use client';

/**
 * Ngăn kéo bên phải hiện chi tiết thẻ trên board/danh sách. Esc để đóng
 * (trừ khi đang có lớp nổi khác mở — Popover/Dialog tự nuốt Esc của nó).
 */

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { workApi } from '@/lib/work-api';
import { wk } from './hooks';
import IssueDetail from './IssueDetail';
import { isTyping, Spinner, WorkPortal } from './ui';

export default function IssueDrawer({ pid, num, onClose, onOpenIssue }: {
  pid: number;
  num: number | null;
  onClose: () => void;
  /** Mở thẻ khác trong cùng ngăn kéo; bỏ trống thì ngăn kéo tự đổi số. */
  onOpenIssue?: (num: number) => void;
}) {
  const [current, setCurrent] = useState<number | null>(num);
  useEffect(() => setCurrent(num), [num]);
  // Cùng khoá với trang dự án ⇒ thường đã có sẵn trong cache, không tải lại.
  const { data: cfg } = useQuery({ queryKey: wk.project(pid), queryFn: () => workApi.project(pid), enabled: !!pid, staleTime: 60_000 });

  useEffect(() => {
    if (current === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      // Đang gõ trong ô nhập thì Esc thuộc về ô đó (huỷ sửa), không đóng ngăn kéo.
      if (isTyping(e.target)) return;
      if (document.querySelector('[role="dialog"]')) return;
      onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [current, onClose]);

  if (current === null) return null;
  const open = (n: number) => (onOpenIssue ? onOpenIssue(n) : setCurrent(n));

  return (
    <WorkPortal>
      <div className="fixed inset-0 z-[60] bg-black/20 md:bg-black/10" onMouseDown={onClose} />
      <div
        className="fixed inset-y-0 right-0 z-[61] flex w-full flex-col border-l border-[var(--w-border)] bg-[var(--w-panel)] sm:w-[min(920px,92vw)]"
        style={{ boxShadow: 'var(--w-shadow-pop)' }}
      >
        {cfg ? (
          <IssueDetail pid={pid} num={current} config={cfg} onClose={onClose} onOpenIssue={open} variant="drawer" />
        ) : (
          <div className="flex h-full items-center justify-center"><Spinner size={20} /></div>
        )}
      </div>
    </WorkPortal>
  );
}
