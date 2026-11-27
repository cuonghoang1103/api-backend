/**
 * CT Work — CHẾ ĐỘ ĐÓNG VAI ở trình duyệt (27/11/2026). Máy chủ: `src/services/work/vaiDong.ts`.
 *
 * Một tài khoản đóng 5 vai C1–C5. Vai đang đóng NHỚ THEO DỰ ÁN ở localStorage (`ctw-vai:<projectId>`) và đi kèm MỌI
 * yêu cầu của dự án đó qua header `X-CTW-Vai` (interceptor trong lib/api.ts). Chỉ gửi khi dự án bật
 * `settings.soloRoles` (VaiPicker đánh dấu bằng `danhDauSolo`) — dự án khác không bao giờ nhận vai.
 * Lệnh ghi trái vai ⇒ máy chủ trả `X-CTW-Vai-Nhac: C5` ⇒ phát sự kiện `ctw-vai-nhac` để giao diện nhắc nhẹ.
 * File thuần (không React) — hook ở components/work/VaiPicker.tsx.
 */

export const VAI = ['C1', 'C2', 'C3', 'C4', 'C5'] as const;
export type Vai = (typeof VAI)[number];
export const isVai = (v: unknown): v is Vai => typeof v === 'string' && (VAI as readonly string[]).includes(v);

/** Cùng màu với trường Role (C1–C5) + nhãn C1…C5 của bộ mẫu SOLO5 (projectBlueprints.ts). */
export const VAI_MAU: Record<Vai, string> = { C1: '#7c3aed', C2: '#0891b2', C3: '#2563eb', C4: '#16a34a', C5: '#ca8a04' };
export const VAI_NGAN: Record<Vai, string> = { C1: 'PM', C2: 'BA', C3: 'BE', C4: 'FE', C5: 'QA' };
export const nhanVai = (v: Vai) => `${v} · ${VAI_NGAN[v]}`;

const KHOA = (pid: number) => `ctw-vai:${pid}`;
const daNap = new Map<number, Vai | null>();
const solo = new Set<number>();
const nghe = new Set<() => void>();
const bao = () => nghe.forEach((f) => f());

export function ngheVai(f: () => void): () => void {
  nghe.add(f);
  return () => { nghe.delete(f); };
}

export function layVai(pid: number): Vai | null {
  if (daNap.has(pid)) return daNap.get(pid)!;
  let v: Vai | null = null;
  try { const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(KHOA(pid)) : null; v = isVai(raw) ? raw : null; } catch { /* chế độ riêng tư */ }
  daNap.set(pid, v);
  return v;
}

export function datVai(pid: number, v: Vai | null): void {
  daNap.set(pid, v);
  try { if (v) localStorage.setItem(KHOA(pid), v); else localStorage.removeItem(KHOA(pid)); } catch { /* bỏ qua */ }
  bao();
}

/** VaiPicker gọi khi dự án bật chế độ đóng vai (và tắt khi không). */
export function danhDauSolo(pid: number, bat: boolean): void {
  if (bat) solo.add(pid); else solo.delete(pid);
}

const URL_DU_AN = /\/work\/projects\/(\d+)(?:[/?#]|$)/;

/** Vai cho một URL API (`/work/projects/12/...`) — chỉ dự án bật chế độ. */
export function vaiChoUrl(url: string | undefined | null): Vai | null {
  const m = URL_DU_AN.exec(url ?? '');
  if (!m) return null;
  const pid = Number(m[1]);
  return solo.has(pid) ? layVai(pid) : null;
}

export interface NhacVai { pid: number; vai: Vai; dung: Vai[] }

/** Interceptor phản hồi gọi: header `x-ctw-vai-nhac` ⇒ sự kiện `ctw-vai-nhac`. */
export function baoNhacTuPhanHoi(url: string | undefined | null, header: unknown): void {
  if (typeof header !== 'string' || !header || typeof window === 'undefined') return;
  const m = URL_DU_AN.exec(url ?? '');
  if (!m) return;
  const pid = Number(m[1]);
  const vai = solo.has(pid) ? layVai(pid) : null;
  const dung = header.split(',').map((s) => s.trim()).filter(isVai);
  if (!vai || !dung.length) return;
  window.dispatchEvent(new CustomEvent<NhacVai>('ctw-vai-nhac', { detail: { pid, vai, dung } }));
}
