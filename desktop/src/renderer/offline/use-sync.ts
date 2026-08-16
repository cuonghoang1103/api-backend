/**
 * Hook nối hàng đợi đồng bộ vào giao diện.
 *
 * `userId` là `null` cho tới khi có đăng nhập (Phase 4). Lúc đó hook trả trạng
 * thái `'chua-dang-nhap'` chứ KHÔNG trả "đã đồng bộ" — chưa đăng nhập thì
 * không có gì để đồng bộ, và báo xanh lúc đó là báo láo.
 *
 * `transport` cũng là `null` cho tới Phase 4. Không có transport thì hook vẫn
 * đếm và hiển thị việc đang chờ, nhưng KHÔNG chạy đồng bộ — thà để người dùng
 * thấy "3 việc đang chờ" mãi còn hơn thấy chúng biến mất mà không ai gửi đi đâu.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  queueCounts,
  retryFailed,
  runSync,
  type QueueCounts,
  type Transport,
} from './sync-queue';

export type SyncState =
  | 'chua-dang-nhap'
  | 'chua-noi-may-chu'
  | 'ngoai-tuyen'
  | 'dang-dong-bo'
  | 'cho-mang'
  | 'that-bai'
  | 'can-xu-ly'
  | 'da-dong-bo';

export interface SyncInfo {
  state: SyncState;
  label: string;
  counts: QueueCounts;
  /** Chạy một lượt ngay. Không có transport thì không làm gì. */
  syncNow: () => Promise<void>;
  retry: () => Promise<void>;
}

const EMPTY: QueueCounts = {
  pending: 0,
  syncing: 0,
  failed: 0,
  rejected: 0,
  conflict: 0,
};

/** Đồng bộ nền mỗi 30 giây khi có mạng. */
const INTERVAL_MS = 30_000;

export function useSync(options: {
  userId: number | null;
  transport: Transport | null;
  online: boolean;
}): SyncInfo {
  const { userId, transport, online } = options;
  const [counts, setCounts] = useState<QueueCounts>(EMPTY);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    if (userId === null) {
      setCounts(EMPTY);
      return;
    }
    setCounts(await queueCounts(userId));
  }, [userId]);

  const syncNow = useCallback(async () => {
    if (userId === null || transport === null || !online) {
      // Vẫn làm mới số đếm để giao diện không đứng im, nhưng không giả vờ là
      // đã gửi được gì.
      await refresh();
      return;
    }
    setBusy(true);
    try {
      await runSync({ userId, transport, online });
      await refresh();
    } finally {
      setBusy(false);
    }
  }, [userId, transport, online, refresh]);

  const retry = useCallback(async () => {
    if (userId === null) return;
    await retryFailed(userId);
    await syncNow();
  }, [userId, syncNow]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Có mạng trở lại thì chạy ngay một lượt, đừng đợi hết chu kỳ 30 giây —
  // khoảnh khắc người dùng thấy "Trực tuyến" là lúc họ mong việc được gửi đi.
  useEffect(() => {
    if (!online) return;
    void syncNow();
    const timer = setInterval(() => void syncNow(), INTERVAL_MS);
    return () => clearInterval(timer);
  }, [online, syncNow]);

  return useMemo<SyncInfo>(() => {
    const { state, label } = describe({ userId, transport, online, counts, busy });
    return { state, label, counts, syncNow, retry };
  }, [userId, transport, online, counts, busy, syncNow, retry]);
}

function describe(input: {
  userId: number | null;
  transport: Transport | null;
  online: boolean;
  counts: QueueCounts;
  busy: boolean;
}): { state: SyncState; label: string } {
  const { userId, transport, online, counts, busy } = input;

  if (userId === null) return { state: 'chua-dang-nhap', label: 'Chưa đăng nhập' };
  if (transport === null) {
    return { state: 'chua-noi-may-chu', label: 'Đồng bộ: chưa nối máy chủ' };
  }

  // Thứ tự ưu tiên: cái cần người dùng ra tay phải hiện trước cái tự khỏi được.
  if (counts.conflict > 0 || counts.rejected > 0) {
    return {
      state: 'can-xu-ly',
      label: `Cần xử lý: ${counts.conflict + counts.rejected}`,
    };
  }
  if (counts.failed > 0) return { state: 'that-bai', label: `Lỗi: ${counts.failed}` };
  if (busy || counts.syncing > 0) return { state: 'dang-dong-bo', label: 'Đang đồng bộ…' };
  if (!online) {
    return counts.pending > 0
      ? { state: 'cho-mang', label: `Chờ mạng: ${counts.pending}` }
      : { state: 'ngoai-tuyen', label: 'Ngoại tuyến' };
  }
  if (counts.pending > 0) return { state: 'cho-mang', label: `Đang chờ: ${counts.pending}` };
  return { state: 'da-dong-bo', label: 'Đã đồng bộ' };
}
