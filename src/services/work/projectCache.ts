/**
 * Đợt 6 (D3) — BỘ ĐỆM NGẮN THEO DỰ ÁN cho báo cáo nặng (CFD, cycle time, KPI, dữ liệu thô của Đóng góp).
 *
 * Vì sao: đo 10k thẻ với 8 request song song (8 người cùng mở dashboard), mỗi lượt tính lại từ đầu trên MỘT luồng Node
 * ⇒ p95 CFD 549 ms, Đóng góp 1,35 s. Hai cơ chế:
 *   - single-flight: request trùng khoá đang chạy ⇒ chờ chung một Promise (8 người = 1 lần tính);
 *   - TTL ngắn (mặc định 15 s) + XOÁ NGAY khi dự án có sự kiện work (thẻ/sprint/trang… đổi) ⇒ người vừa sửa thấy số mới.
 * Chỉ đệm phần KHÔNG phụ thuộc người xem (kiểm quyền vẫn chạy mỗi request, TRƯỚC khi đọc đệm).
 * Một tiến trình (VPS một container backend) ⇒ Map trong RAM là đủ; nhiều tiến trình thì mỗi cái tự đệm, vẫn đúng.
 */
import { onWorkEvent } from './events.js';

interface Entry { at: number; p: Promise<unknown> }
const store = new Map<string, Entry>();
const MAX_ENTRIES = 500;
let hooked = false;

function hook() {
  if (hooked) return;
  hooked = true;
  onWorkEvent((e) => { if ('projectId' in e && typeof e.projectId === 'number') invalidateProject(e.projectId); });
}

export function invalidateProject(projectId: number): void {
  const prefix = `${projectId}|`;
  for (const k of store.keys()) if (k.startsWith(prefix)) store.delete(k);
}

/**
 * Tắt mặc định khi CHẠY TEST (test DB hay ghi thẳng prisma rồi đọc báo cáo ngay — không qua sự kiện) và khi
 * WORK_CACHE_DISABLED=1. Bật lại trong test bằng _setProjectCacheDisabledForTests(false).
 */
let disabled = process.env.WORK_CACHE_DISABLED === '1' || process.env.WORK_DB_TEST === '1' || process.env.NODE_ENV === 'test' || !!process.env.NODE_TEST_CONTEXT;
export function _setProjectCacheDisabledForTests(v: boolean) { disabled = v; store.clear(); }

export async function projectCached<T>(projectId: number, key: string, fn: () => Promise<T>, ttlMs = 15_000): Promise<T> {
  if (disabled) return fn();
  hook();
  const k = `${projectId}|${key}`;
  const hit = store.get(k);
  if (hit && Date.now() - hit.at < ttlMs) return hit.p as Promise<T>;
  if (store.size >= MAX_ENTRIES) store.delete(store.keys().next().value as string);
  const p = fn();
  store.set(k, { at: Date.now(), p });
  // Lỗi không được đệm (lần sau thử lại).
  p.catch(() => { if (store.get(k)?.p === p) store.delete(k); });
  return p;
}
