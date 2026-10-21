/**
 * CT Work — trần kích thước tệp phía trình duyệt (22/10/2026). NGUỒN SỰ THẬT ở máy chủ: `src/services/work/limits.ts`
 * (đổi bằng env WORK_MAX_FILE_MB / WORK_MAX_IMAGE_MB / WORK_MAX_IMPORT_MB / WORK_FORM_MAX_TOTAL_MB …).
 *
 * Mặc định dưới đây TRÙNG số mặc định của máy chủ để kiểm được ngay cả trước khi gọi mạng; lần đầu `workLimits()` được
 * gọi thì nạp số thật từ `GET /work/limits` (một lần mỗi phiên) — admin đổi env thì trình duyệt theo, không cần build.
 * Máy chủ vẫn là chốt cuối: kiểm ở đây chỉ để báo sớm, khỏi tải 100 MB rồi mới bị từ chối.
 *
 * Câu báo lỗi lấy số qua `mb()` — KHÔNG viết cứng "10 MB" vào chuỗi i18n nữa (dùng biến {mb}).
 */

import { api } from '@/lib/api';

const MB = 1024 * 1024;

export interface WorkLimits {
  /** Đính kèm thẻ / bình luận / chat / lớp học / bài nộp / bằng chứng test / nguồn dự án. */
  fileBytes: number;
  /** Ảnh: Docs, ảnh bìa, ảnh nhận diện, ảnh câu hỏi. */
  imageBytes: number;
  /** Nhập: Excel FPT 5.1–5.3, báo cáo CI, phân tích tĩnh, sơ đồ, CSV, danh sách lớp, sổ điểm. */
  importBytes: number;
  /** Tổng tệp một lần gửi form. */
  formTotalBytes: number;
  /** Tệp gửi kèm cho trợ lý AI. */
  aiFileBytes: number;
  /** Xem trước Office. */
  officePreviewBytes: number;
}

export const DEFAULT_WORK_LIMITS: Readonly<WorkLimits> = Object.freeze({
  fileBytes: 100 * MB,
  imageBytes: 50 * MB,
  importBytes: 100 * MB,
  formTotalBytes: 50 * MB,
  aiFileBytes: 50 * MB,
  officePreviewBytes: 50 * MB,
});

let current: WorkLimits = { ...DEFAULT_WORK_LIMITS };
let loading: Promise<WorkLimits> | null = null;

function valid(x: unknown): x is WorkLimits {
  if (!x || typeof x !== 'object') return false;
  return (Object.keys(DEFAULT_WORK_LIMITS) as Array<keyof WorkLimits>).every((k) => {
    const v = (x as Record<string, unknown>)[k];
    return typeof v === 'number' && Number.isFinite(v) && v > 0;
  });
}

/** Nạp số thật từ máy chủ (một lần; lỗi mạng ⇒ giữ mặc định, thử lại lần gọi sau). */
export function loadWorkLimits(): Promise<WorkLimits> {
  if (typeof window === 'undefined') return Promise.resolve(current);
  if (!loading) {
    loading = api.get('/work/limits')
      .then((r) => { const v = (r.data as { data?: unknown })?.data; if (valid(v)) current = { ...v }; return current; })
      .catch(() => { loading = null; return current; });
  }
  return loading;
}

/** Trần đang hiệu lực (đồng bộ). Gọi lần đầu sẽ kích nạp số thật ở nền. */
export function workLimits(): WorkLimits {
  void loadWorkLimits();
  return current;
}

/** "100 MB" — dùng làm biến {mb} trong chuỗi báo lỗi. */
export function mb(bytes: number): string {
  const v = bytes / MB;
  return `${Number.isInteger(v) ? v : v.toFixed(1)} MB`;
}

/**
 * Hạn chờ (ms) cho một lần tải `bytes` lên qua backend: tối thiểu 3 phút, cộng thêm theo kích thước (≈ 100 KB/s mạng
 * chậm) — trước đây cứng 180 s nên tệp 100 MB trên Wi-Fi yếu sẽ bị axios cắt giữa chừng.
 */
export function uploadTimeoutMs(bytes: number): number {
  return Math.max(180_000, Math.ceil(bytes / 100_000) * 1000 + 60_000);
}
