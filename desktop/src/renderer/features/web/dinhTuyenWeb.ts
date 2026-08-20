/**
 * Bảng tra ĐƯỜNG DẪN → TRANG WEB, cho những trang app dùng lại nguyên của web.
 *
 * ─── Vì sao cần bảng này ───
 * App desktop khớp route CHÍNH XÁC (`findRoute` trong routes.ts dùng `===`).
 * Nhưng cây Ngoại ngữ và Lộ trình của web có đường dẫn ĐỘNG: `/language/ja`,
 * `/language/ja/vocab`, `/roadmap/frontend`. Không có bảng này thì mọi cú bấm
 * vào một ngôn ngữ hay một lộ trình đều rơi vào màn hình "Không tìm thấy".
 *
 * ─── Vì sao liệt kê TAY thay vì quét thư mục ───
 * Quét được thì hay, nhưng bản dựng của Vite cần biết trước danh sách module
 * để gộp. Liệt kê tay còn cho chỗ ghi ra những chỗ Next có luật ngầm — xem
 * `/language/notebook` ngay dưới.
 *
 * ⚠️ TĨNH THẮNG ĐỘNG. `/language/notebook` phải đứng TRƯỚC `/language/:code`,
 * nếu không "notebook" sẽ bị đọc thành mã ngôn ngữ và trang sổ tay không bao
 * giờ mở được — nó sẽ gọi API với `code=notebook` rồi hiện "không tìm thấy
 * ngôn ngữ". Next.js cũng ưu tiên tĩnh trước động; `khopTuyenWeb()` giữ đúng
 * thứ tự mảng nên chỉ cần liệt kê đúng thứ tự.
 *
 * Đối chiếu ngày 20/08/2026 bằng:
 *   find frontend/src/app/language frontend/src/app/roadmap -name page.tsx
 * ra đúng 21 đường dẫn dưới đây.
 */
import type { ComponentType } from 'react';

export interface TuyenWeb {
  /** Mẫu đường dẫn; `:ten` là một đoạn động. */
  mau: string;
  /** Nạp chậm — 51.000 dòng mã web không nên nằm trong gói khởi động. */
  nap: () => Promise<{ default: ComponentType }>;
}

export const TUYEN_WEB: readonly TuyenWeb[] = [
  /* ── Ngoại ngữ ── */
  { mau: '/language', nap: () => import('@/app/language/page') },
  // TĨNH trước ĐỘNG — xem cảnh báo ở đầu tệp.
  { mau: '/language/notebook', nap: () => import('@/app/language/notebook/page') },
  { mau: '/language/:code', nap: () => import('@/app/language/[code]/page') },
  { mau: '/language/:code/alphabet', nap: () => import('@/app/language/[code]/alphabet/page') },
  { mau: '/language/:code/alphabet/practice', nap: () => import('@/app/language/[code]/alphabet/practice/page') },
  { mau: '/language/:code/conversation', nap: () => import('@/app/language/[code]/conversation/page') },
  { mau: '/language/:code/grammar', nap: () => import('@/app/language/[code]/grammar/page') },
  { mau: '/language/:code/grammar-check', nap: () => import('@/app/language/[code]/grammar-check/page') },
  { mau: '/language/:code/hanzi', nap: () => import('@/app/language/[code]/hanzi/page') },
  { mau: '/language/:code/listening', nap: () => import('@/app/language/[code]/listening/page') },
  { mau: '/language/:code/practice', nap: () => import('@/app/language/[code]/practice/page') },
  { mau: '/language/:code/qna', nap: () => import('@/app/language/[code]/qna/page') },
  { mau: '/language/:code/reading', nap: () => import('@/app/language/[code]/reading/page') },
  { mau: '/language/:code/roadmap', nap: () => import('@/app/language/[code]/roadmap/page') },
  { mau: '/language/:code/roleplay', nap: () => import('@/app/language/[code]/roleplay/page') },
  { mau: '/language/:code/stats', nap: () => import('@/app/language/[code]/stats/page') },
  { mau: '/language/:code/translate', nap: () => import('@/app/language/[code]/translate/page') },
  { mau: '/language/:code/vocab', nap: () => import('@/app/language/[code]/vocab/page') },
  { mau: '/language/:code/writing', nap: () => import('@/app/language/[code]/writing/page') },

  /* ── Lộ trình ── */
  { mau: '/roadmap', nap: () => import('@/components/roadmap/RoadmapLanding') },
  { mau: '/roadmap/:slug', nap: () => import('@/app/roadmap/[slug]/page') },
];

export interface KhopTuyen {
  tuyen: TuyenWeb;
  thamSo: Readonly<Record<string, string>>;
}

/**
 * Khớp một đường dẫn với bảng trên, trả kèm tham số động.
 *
 * Duyệt theo THỨ TỰ MẢNG và lấy cái khớp đầu tiên — đó là thứ giữ luật
 * "tĩnh thắng động" mà không cần chấm điểm độ ưu tiên.
 */
export function khopTuyenWeb(duong: string): KhopTuyen | null {
  const doan = duong.split('/').filter(Boolean);
  for (const tuyen of TUYEN_WEB) {
    const mauDoan = tuyen.mau.split('/').filter(Boolean);
    if (mauDoan.length !== doan.length) continue;
    const thamSo: Record<string, string> = {};
    let khop = true;
    for (let i = 0; i < mauDoan.length; i += 1) {
      const m = mauDoan[i]!;
      const d = doan[i]!;
      if (m.startsWith(':')) thamSo[m.slice(1)] = decodeURIComponent(d);
      else if (m !== d) { khop = false; break; }
    }
    if (khop) return { tuyen, thamSo };
  }
  return null;
}

/** Gốc của những cây route mà trang web sở hữu — dùng cho router của app. */
export const GOC_WEB: readonly string[] = ['/language', '/roadmap'];

/** Đường dẫn này có thuộc một cây web không (kể cả các trang con động). */
export function thuocCayWeb(duong: string): boolean {
  return GOC_WEB.some((g) => duong === g || duong.startsWith(`${g}/`));
}
