'use client';

/**
 * CT Work đợt 7a — nghe `work:agile` (OKR/poker/retro đổi trong dự án) và `work:timer` (timer của tôi đổi ở tab/app
 * khác). Sự kiện chỉ mang loại + id ⇒ làm tươi qua REST (REST che lá bài / tác giả ẩn danh). Phòng `work:project:<id>`
 * do useProjectRealtime vào sẵn; phòng `user:<id>` có từ lúc kết nối.
 */

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { connectSocket } from '@/lib/socket';
import { agileKeys } from '@/lib/work-agile-api';

type AgileEvent = { projectId: number; kind: 'okr' | 'poker' | 'retro'; id: number; action: string };

export function useAgileRealtime(pid: number | undefined, onEvent?: (e: AgileEvent) => void) {
  const qc = useQueryClient();
  useEffect(() => {
    if (!pid) return;
    let alive = true;
    let s: Awaited<ReturnType<typeof connectSocket>> | null = null;
    const handler = (e: AgileEvent) => {
      if (e.projectId !== pid) return;
      onEvent?.(e);
      if (e.kind === 'okr') qc.invalidateQueries({ queryKey: agileKeys.okrAll });
      if (e.kind === 'poker') qc.invalidateQueries({ queryKey: agileKeys.poker(pid) });
      if (e.kind === 'retro') qc.invalidateQueries({ queryKey: agileKeys.retros(pid) });
    };
    connectSocket().then((sock) => { if (!alive) return; s = sock; sock.on('work:agile', handler); }).catch(() => {});
    return () => { alive = false; s?.off('work:agile', handler); };
    // onEvent cố ý không nằm trong deps — handler mới mỗi render sẽ gỡ/gắn lại liên tục.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pid, qc]);
}

export function useTimerRealtime() {
  const qc = useQueryClient();
  useEffect(() => {
    let alive = true;
    let s: Awaited<ReturnType<typeof connectSocket>> | null = null;
    const handler = () => qc.invalidateQueries({ queryKey: agileKeys.timer });
    connectSocket().then((sock) => { if (!alive) return; s = sock; sock.on('work:timer', handler); }).catch(() => {});
    return () => { alive = false; s?.off('work:timer', handler); };
  }, [qc]);
}
