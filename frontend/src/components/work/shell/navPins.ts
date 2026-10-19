'use client';

/**
 * Đợt 8D (19/10/2026) — GHIM / BỎ GHIM mục trên thanh bên dự án, theo NGƯỜI DÙNG + dự án.
 *
 * Nguồn sự thật: `users.preferences.work.navPins` trên máy chủ (GET/PATCH /users/me/preferences — cùng chỗ với
 * ngôn ngữ CT Work) ⇒ web, app CuongThai và app CT Work desktop thấy cùng một thanh bên. localStorage chỉ là bản
 * đệm để vẽ ngay khi mở trang và là chỗ lùi khi máy chủ chưa nhận khoá này (bản backend cũ âm thầm bỏ khoá lạ).
 *
 * Dữ liệu mỗi dự án: { pin, hide } — `pin` = mục ngoài bộ cốt lõi kéo lên nhóm chính, `hide` = mục cốt lõi cất
 * vào "Thêm…". Vắng = chưa tuỳ chỉnh. Gọi API trực tiếp bằng `api` (không đụng `preferencesApi` trong lib/api.ts).
 */

import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import type { NavPinEntry, NavPinMap } from './sidebarNav';

const LS_KEY = (uid: number | string) => `ctwork.navPins.${uid}`;
const QK = (uid: number | string) => ['work', 'navPins', uid] as const;

function readLocal(uid: number | string): NavPinMap {
  try {
    const v = JSON.parse(window.localStorage.getItem(LS_KEY(uid)) ?? '{}') as unknown;
    return v && typeof v === 'object' && !Array.isArray(v) ? (v as NavPinMap) : {};
  } catch { return {}; }
}
function writeLocal(uid: number | string, map: NavPinMap) {
  try { window.localStorage.setItem(LS_KEY(uid), JSON.stringify(map)); } catch { /* cửa sổ riêng tư / bộ nhớ đầy */ }
}

export function useNavPins() {
  const uid = useAuthStore((s) => s.user?.id);
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: QK(uid ?? 0),
    enabled: !!uid,
    staleTime: Infinity,
    retry: false,
    // Vẽ ngay bằng bản đệm, rồi máy chủ thắng (nếu máy chủ biết khoá này).
    initialData: () => (uid && typeof window !== 'undefined' ? readLocal(uid) : undefined),
    initialDataUpdatedAt: 0,
    queryFn: async (): Promise<NavPinMap> => {
      const r = await api.get<{ data?: { preferences?: { work?: { navPins?: NavPinMap; locale?: unknown } } } }>('/users/me/preferences');
      const work = r.data?.data?.preferences?.work;
      // Máy chủ không có khoá này (chưa ai ghim, hoặc bản backend cũ không lưu được) ⇒ giữ bản máy này.
      if (!work?.navPins || typeof work.navPins !== 'object') return readLocal(uid!);
      writeLocal(uid!, work.navPins);
      return work.navPins;
    },
  });

  const set = useCallback((pid: number, entry: NavPinEntry | null) => {
    if (!uid) return;
    const prev = (qc.getQueryData<NavPinMap>(QK(uid)) ?? {});
    const next: NavPinMap = { ...prev };
    if (entry) next[String(pid)] = entry; else delete next[String(pid)];
    qc.setQueryData(QK(uid), next);
    writeLocal(uid, next);
    void api.patch('/users/me/preferences', { preferences: { work: { navPins: { [String(pid)]: entry } } } }).catch(() => undefined);
  }, [qc, uid]);

  return { map: q.data ?? {}, set };
}
