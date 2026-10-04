/**
 * Gọi API quản trị từ app desktop (05/10/2026).
 *
 * Khác `api.request` ở ba chỗ, đều có lý do:
 *  1. Trả NGUYÊN phong bì `{ data, pagination, … }` — danh sách quản trị cần `pagination`,
 *     còn `request()` bóc mất chỉ để lại `data`.
 *  2. Nhận ra 403 `MFA_REQUIRED` / `MFA_SETUP_REQUIRED`: tài khoản quản trị đã bật MFA
 *     thì MỌI thao tác quản trị cần token có claim `mfaAt` (xem src/services/mfa/adminMfa.ts).
 *     Phiên app đăng nhập bằng mật khẩu không có claim đó ⇒ trước đây mọi nút quản trị
 *     trong app đều 403 câm (đúng lỗi "Chỉ tài khoản quản trị mới rút được…" người dùng
 *     gặp ở trang Nhạc). Ở đây: bật hộp nhập mã (XacMinhMfa), xác minh xong GỌI LẠI.
 *  3. Hết hạn 60 giây thay vì 30 — vài thao tác (xuất báo cáo, quét) chậm hơn.
 */
import type { ApiClient } from '../../api/client';

export type PhongBi<T> = { success?: boolean; data: T; message?: string; code?: string; pagination?: { page: number; limit: number; total: number; totalPages: number } };

export class LoiAdmin extends Error {
  constructor(message: string, readonly status: number, readonly code?: string) { super(message); }
}

/* Hộp MFA dùng chung: lời gọi nào gặp MFA_REQUIRED thì cùng chờ MỘT lần xác minh. */
type ChoMfa = { hua: Promise<boolean>; xong: (ok: boolean) => void };
let dangCho: ChoMfa | null = null;
const nguoiNghe = new Set<(loai: 'MFA_REQUIRED' | 'MFA_SETUP_REQUIRED') => void>();

export function ngheYeuCauMfa(f: (loai: 'MFA_REQUIRED' | 'MFA_SETUP_REQUIRED') => void): () => void {
  nguoiNghe.add(f);
  return () => { nguoiNghe.delete(f); };
}
/** Hộp MFA gọi khi người dùng xác minh xong (true) hoặc huỷ (false). */
export function ketThucMfa(ok: boolean) {
  const c = dangCho; dangCho = null;
  c?.xong(ok);
}
function choXacMinh(loai: 'MFA_REQUIRED' | 'MFA_SETUP_REQUIRED'): Promise<boolean> {
  if (!dangCho) {
    let xong!: (ok: boolean) => void;
    const hua = new Promise<boolean>((r) => { xong = r; });
    dangCho = { hua, xong };
    for (const f of nguoiNghe) f(loai);
  }
  return dangCho.hua;
}

export async function goi<T>(
  api: ApiClient,
  duong: string,
  tuy: { method?: string; body?: unknown; query?: Record<string, string | number | boolean | undefined | null>; daThu?: boolean } = {},
): Promise<PhongBi<T>> {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(tuy.query ?? {})) if (v !== undefined && v !== null && v !== '') q.set(k, String(v));
  const url = `${api.baseUrlForForms()}/api/v1${duong}${q.size ? `?${q}` : ''}`;
  const ctrl = new AbortController();
  const hen = setTimeout(() => ctrl.abort(), 60_000);
  let res: Response;
  try {
    res = await fetch(url, {
      method: tuy.method ?? 'GET',
      headers: { ...api.authHeaders(), ...(tuy.body !== undefined ? { 'Content-Type': 'application/json' } : {}) },
      body: tuy.body !== undefined ? JSON.stringify(tuy.body) : null,
      signal: ctrl.signal,
      cache: 'no-store',
      credentials: 'omit',
    });
  } catch {
    throw new LoiAdmin(ctrl.signal.aborted ? 'Máy chủ không phản hồi sau 60 giây.' : 'Không kết nối được máy chủ.', 0);
  } finally {
    clearTimeout(hen);
  }
  const than = (await res.json().catch(() => null)) as (PhongBi<T> & { error?: { code?: string } }) | null;
  if (res.ok) return (than ?? { data: undefined as T }) as PhongBi<T>;
  const code = than?.code ?? than?.error?.code;
  if (res.status === 403 && (code === 'MFA_REQUIRED' || code === 'MFA_SETUP_REQUIRED') && !tuy.daThu) {
    const ok = await choXacMinh(code);
    if (ok) return goi<T>(api, duong, { ...tuy, daThu: true });
    throw new LoiAdmin('Cần xác minh MFA để làm việc này.', 403, code);
  }
  throw new LoiAdmin(than?.message ?? `Máy chủ trả về lỗi ${res.status}.`, res.status, code);
}
