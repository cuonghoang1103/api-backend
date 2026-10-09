'use client';

/**
 * Hỏi "người đang đăng nhập có phải admin?" MỘT lần cho mỗi người dùng mỗi phiên trình duyệt.
 *
 * Vì sao (QA 10/10, P2-5): Navbar + NavigationDock nằm ở layout gốc, mỗi cái tự `fetch('/api/auth/admin-check')`
 * và gọi lại khi auth hydrate ⇒ người KHÔNG phải admin mở 18 trang /work sinh 72 lượt gọi, lượt nào cũng 403
 * (bẩn console, tốn một vòng proxy → backend /profile mỗi lượt).
 *
 * Cách làm:
 *   - react-query, khoá theo NGƯỜI DÙNG (`['admin-check', userKey]`) ⇒ hai component dùng chung một lượt gọi;
 *     `staleTime` 30 phút ⇒ điều hướng phía client không gọi lại.
 *   - Kết quả CHẮC CHẮN (200 = admin, 403 = không phải admin) được nhớ trong `sessionStorage` theo người dùng ⇒ tải lại
 *     trang / mở trang mới trong cùng phiên cũng không gọi lại. 401 / lỗi mạng KHÔNG được nhớ (có thể chỉ là token
 *     đang làm mới) — lần sau hỏi lại.
 *   - Đăng nhập / đổi vai / đăng xuất (sự kiện `auth-changed`) ⇒ xoá nhớ + hỏi lại.
 *
 * Đây chỉ là gợi ý cho GIAO DIỆN (hiện nút Admin). Quyền thật vẫn do backend + middleware `/admin` kiểm từng lượt.
 */

import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const STORE_PREFIX = 'adminCheck:v1:';
const TTL_MS = 30 * 60_000;

type Cached = { isAdmin: boolean; at: number };

function readCache(userKey: string): Cached | undefined {
  try {
    const raw = sessionStorage.getItem(STORE_PREFIX + userKey);
    if (!raw) return undefined;
    const c = JSON.parse(raw) as Cached;
    if (typeof c?.isAdmin !== 'boolean' || typeof c.at !== 'number' || Date.now() - c.at > TTL_MS) return undefined;
    return c;
  } catch {
    return undefined;
  }
}

function writeCache(userKey: string, isAdmin: boolean) {
  try { sessionStorage.setItem(STORE_PREFIX + userKey, JSON.stringify({ isAdmin, at: Date.now() } satisfies Cached)); } catch { /* chế độ riêng tư */ }
}

export function clearAdminCheckCache() {
  try {
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const k = sessionStorage.key(i);
      if (k?.startsWith(STORE_PREFIX)) sessionStorage.removeItem(k);
    }
  } catch { /* bỏ qua */ }
}

/** Đếm lượt gọi mạng thật — để đo lại số lượt (QA). Không dùng cho logic. */
let networkCalls = 0;
export const _adminCheckNetworkCalls = () => networkCalls;

async function fetchIsAdmin(userKey: string): Promise<boolean> {
  networkCalls++;
  const res = await fetch('/api/auth/admin-check', { credentials: 'include', cache: 'no-store' });
  if (res.ok) {
    const data = await res.json().catch(() => null);
    const isAdmin = ((data?.data?.roles ?? []) as string[]).some((r) => (r || '').replace('ROLE_', '').toUpperCase() === 'ADMIN');
    writeCache(userKey, isAdmin);
    return isAdmin;
  }
  if (res.status === 403) { writeCache(userKey, false); return false; }
  // 401 / 5xx: không kết luận được — trả false nhưng KHÔNG nhớ, để lần sau hỏi lại.
  throw new Error(`admin-check ${res.status}`);
}

/**
 * `userKey`: id/username/email của người đang đăng nhập; `null` = chưa đăng nhập (không gọi gì — khách không thể là admin).
 * `hint`: vai đã biết ở client (vd roles trong localStorage) — chỉ dùng làm giá trị ban đầu khi chưa có kết quả nhớ.
 */
export function useAdminCheck(userKey: string | null, hint = false): boolean {
  const qc = useQueryClient();
  const key = userKey ? String(userKey) : null;

  useEffect(() => {
    const onAuth = () => {
      clearAdminCheckCache();
      void qc.invalidateQueries({ queryKey: ['admin-check'] });
    };
    window.addEventListener('auth-changed', onAuth);
    window.addEventListener('auth-updated', onAuth);
    return () => {
      window.removeEventListener('auth-changed', onAuth);
      window.removeEventListener('auth-updated', onAuth);
    };
  }, [qc]);

  const cached = typeof window !== 'undefined' && key ? readCache(key) : undefined;
  const q = useQuery({
    queryKey: ['admin-check', key],
    queryFn: () => fetchIsAdmin(key!),
    enabled: !!key,
    staleTime: TTL_MS,
    gcTime: TTL_MS,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    initialData: cached?.isAdmin,
    initialDataUpdatedAt: cached?.at,
  });
  if (!key) return false;
  return q.data ?? hint;
}

/** Khoá người dùng cho `useAdminCheck` từ những gì client đang có (store backend → phiên OAuth → localStorage 'user'). */
export function adminCheckUserKey(
  backendUser: { id?: number | string | null; username?: string | null } | null | undefined,
  session: { user?: { email?: string | null; name?: string | null } | null } | null | undefined,
): { key: string | null; hint: boolean } {
  let stored: { id?: unknown; username?: unknown; roles?: unknown } | null = null;
  try { stored = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null; } catch { stored = null; }
  const hint = Array.isArray(stored?.roles) && (stored!.roles as unknown[]).some((r) => String(r || '').replace('ROLE_', '').toUpperCase() === 'ADMIN');
  const id = backendUser?.id ?? backendUser?.username ?? session?.user?.email ?? (stored?.id as string | number | undefined) ?? (stored?.username as string | undefined) ?? null;
  return { key: id === null || id === undefined || id === '' ? null : String(id), hint };
}
