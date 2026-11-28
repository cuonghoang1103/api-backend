/**
 * Chèn mục 🔁 Luyện câu 2 chiều + ✍️ Tập viết (28/11/2026, Bài 1–10) vào danh sách bài — bộ nạp `index.ts` và
 * `scripts/course-manifest.mts` gọi CÙNG hàm này nên mục lục khớp nội dung.
 *
 * `bN-luyen-cau` + `bN-tap-viet` đứng ngay sau `bN-luyen-nho` (học xong cốt lõi ⇒ luyện nhớ từ ⇒ luyện câu ⇒ tập viết;
 * nhom.ts xếp cả hai vào ① Học trước). Mục ôn thi thêm (vd. `b3-thi-thu-viet-113`) nối cuối — nhom.ts xếp vào ④.
 * Dữ liệu: luyenCauB13.ts (Bài 1–3) · luyenCauB47.ts (Bài 4–7) · luyenCauB810.ts (Bài 8–10), xuất `LUYEN_CAU[n]`.
 *
 * Chỉ `import type` — script Node thuần nạp tệp này.
 */
import type { Lesson } from '@/components/sach-hoc/types';

export const CO_LUYEN_CAU = (n: number) => n >= 1 && n <= 10;

export function chenLuyenCau(n: number, ls: Lesson[], lc: Lesson[] | undefined): Lesson[] {
  if (!lc?.length) return ls;
  const moi = lc.filter((l) => !ls.some((x) => x.id === l.id));
  const loi = moi.filter((l) => l.id === `b${n}-luyen-cau` || l.id === `b${n}-tap-viet`);
  const sau = moi.filter((l) => !loi.includes(l));
  let i = ls.findIndex((l) => l.id === `b${n}-luyen-nho`);
  if (i < 0) i = ls.findIndex((l) => l.id === `b${n}-bai-tap`);
  if (i < 0) i = ls.length - 1;
  return [...ls.slice(0, i + 1), ...loi, ...ls.slice(i + 1), ...sau];
}
