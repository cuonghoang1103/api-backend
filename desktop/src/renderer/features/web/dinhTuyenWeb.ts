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
 * ra đúng 21 đường dẫn. Ngày 22/08/2026 thêm cây Phỏng vấn (5 đường), đối
 * chiếu bằng:
 *   find frontend/src/app/interview -name page.tsx
 * ⇒ 26 đường dẫn. Ngày 22/08/2026 thêm cây CV Builder (9 đường), đối chiếu
 * bằng `find frontend/src/app/cv -name page.tsx` ⇒ 35 đường dẫn dưới đây.
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

  /* ── Phỏng vấn ──
     Đo 22/08/2026: 6 tệp, 1.983 dòng, dính Next.js 7 chỗ (4 link, 3
     navigation) — đều đã có shim. `layout.tsx` chỉ khai `metadata`, không có
     bố cục nào để dựng lại.

     Ở đây tĩnh và động KHÔNG tranh nhau như bên `/language`: `khopTuyenWeb`
     đòi bằng SỐ ĐOẠN, mà `/interview/drill` dài 2 đoạn còn
     `/interview/session/:id` dài 3. Vẫn xếp tĩnh trước để ai thêm
     `/interview/:x` sau này không phải nhớ lại luật. */
  { mau: '/interview', nap: () => import('@/app/interview/page') },
  { mau: '/interview/drill', nap: () => import('@/app/interview/drill/page') },
  { mau: '/interview/history', nap: () => import('@/app/interview/history/page') },
  { mau: '/interview/session/:id', nap: () => import('@/app/interview/session/[id]/page') },
  { mau: '/interview/report/:id', nap: () => import('@/app/interview/report/[id]/page') },

  /* ── CV Builder ──
     Đo 22/08/2026: 12 tệp, 3.048 dòng, dính Next.js 16 chỗ (9 `next/link`,
     14 `useRouter`, 2 `useParams`) — shim đã đủ, không phải viết thêm.

     Chín màn, thay cho MỘT màn native cũ (`features/cv/CvPage.tsx`) vốn chỉ
     sửa được khối liên hệ. Riêng `/cv/profile` của web đã 760 dòng và có đủ
     kinh nghiệm · dự án · học vấn · giải thưởng · kỹ năng · chứng chỉ ·
     ngoại ngữ.

     `/cv/builder/:id` dài 3 đoạn, tám màn còn lại dài 2 — không tranh nhau,
     nhưng vẫn xếp tĩnh trước cho khỏi phải nhớ luật. */
  { mau: '/cv', nap: () => import('@/app/cv/page') },
  { mau: '/cv/import', nap: () => import('@/app/cv/import/page') },
  { mau: '/cv/intake', nap: () => import('@/app/cv/intake/page') },
  { mau: '/cv/profile', nap: () => import('@/app/cv/profile/page') },
  { mau: '/cv/recruiter-view', nap: () => import('@/app/cv/recruiter-view/page') },
  { mau: '/cv/review', nap: () => import('@/app/cv/review/page') },
  { mau: '/cv/target', nap: () => import('@/app/cv/target/page') },
  { mau: '/cv/xem', nap: () => import('@/app/cv/xem/page') },
  { mau: '/cv/builder/:id', nap: () => import('@/app/cv/builder/[id]/page') },

  /* ═══ MƯỜI CÂY CÒN LẠI — 22/08/2026 ═══════════════════════════
     Đo trước khi làm: 60 tệp · 13.928 dòng · 39 chỗ dính Next.js, TOÀN BỘ là
     `next/link` và `next/navigation`. KHÔNG có `next/image`, KHÔNG có
     `next/dynamic` — nên không phải viết shim nào mới.

     ⚠️ BỐN chỗ TĨNH ĐỤNG ĐỘNG ở đây, nhiều hơn mọi cây trước cộng lại. Đánh
     dấu từng chỗ bên dưới; đảo thứ tự là trang tĩnh bị đọc thành tham số động
     và hỏng CÂM — đúng như `/language/notebook` đã dạy. */

  /* ── Maker Lab ── */
  { mau: '/maker-lab', nap: () => import('@/app/maker-lab/page') },
  { mau: '/maker-lab/:slug', nap: () => import('@/app/maker-lab/[slug]/page') },

  /* ── Xưởng nội dung ── */
  { mau: '/creator', nap: () => import('@/app/creator/page') },
  { mau: '/creator/calendar', nap: () => import('@/app/creator/calendar/page') },
  { mau: '/creator/ideas', nap: () => import('@/app/creator/ideas/page') },
  { mau: '/creator/list', nap: () => import('@/app/creator/list/page') },
  { mau: '/creator/pipeline', nap: () => import('@/app/creator/pipeline/page') },
  { mau: '/creator/projects/:id', nap: () => import('@/app/creator/projects/[id]/page') },

  /* ── Dự án ── */
  { mau: '/projects', nap: () => import('@/app/projects/page') },
  // ⚠️ TĨNH TRƯỚC ĐỘNG: `/projects/search` cùng hình dạng với `/projects/:slug`.
  { mau: '/projects/search', nap: () => import('@/app/projects/search/page') },
  { mau: '/projects/:slug', nap: () => import('@/app/projects/[slug]/page') },

  /* ── Kho mã ── */
  { mau: '/repos', nap: () => import('@/app/repos/page') },
  { mau: '/repos/:id', nap: () => import('@/app/repos/[id]/page') },
  { mau: '/repos/tag/:slug', nap: () => import('@/app/repos/tag/[slug]/page') },

  /* ── Exp Hub ── */
  { mau: '/exp-hub', nap: () => import('@/app/exp-hub/page') },
  { mau: '/exp-hub/:slug', nap: () => import('@/app/exp-hub/[slug]/page') },

  /* ── Trò chơi ── */
  { mau: '/games', nap: () => import('@/app/games/page') },
  // ⚠️ TĨNH TRƯỚC ĐỘNG: đường dưới cùng hình dạng với `/games/:slug`.
  { mau: '/games/leaderboard', nap: () => import('@/app/games/leaderboard/page') },
  /*
   * ⛔ `/games/love-me` CỐ Ý KHÔNG có ở đây (24/08/2026, người dùng quyết).
   *
   * Trang đó chỉ `redirect` sang một FILE HTML TĨNH
   * (`frontend/public/games/love-me-game/love-me.html`, 1,9MB, 5 tệp). Trong
   * app nó không có chỗ chứa hợp lệ: desktop không gói `frontend/public`, CSP
   * đặt `frame-src 'none'`, trình duyệt trong app chỉ nhận http/https, còn
   * `window.location` thì điều hướng CẢ renderer ra khỏi app.
   *
   * Đường duy nhất làm nó chạy trong app là nới `frame-src` — mở đúng lớp đang
   * giữ mọi thứ khác, cho một game nhỏ. Không đáng.
   *
   * Bấm vào nó vẫn ÊM: `/games` thuộc cây web nên chủ cây được dựng, rồi
   * `TrangWebTheoTuyen` hiện "Không tìm thấy" KÈM NÚT QUAY VỀ.
   */
  { mau: '/games/:slug', nap: () => import('@/app/games/[slug]/page') },

  /* ── Tài chính (13 màn, nhiều nhất) ── */
  { mau: '/finance', nap: () => import('@/app/finance/page') },
  { mau: '/finance/currency', nap: () => import('@/app/finance/currency/page') },
  { mau: '/finance/debts', nap: () => import('@/app/finance/debts/page') },
  { mau: '/finance/expenses', nap: () => import('@/app/finance/expenses/page') },
  { mau: '/finance/income', nap: () => import('@/app/finance/income/page') },
  { mau: '/finance/investments', nap: () => import('@/app/finance/investments/page') },
  { mau: '/finance/reports', nap: () => import('@/app/finance/reports/page') },
  { mau: '/finance/savings', nap: () => import('@/app/finance/savings/page') },
  { mau: '/finance/wallets', nap: () => import('@/app/finance/wallets/page') },
  // ⚠️ TĨNH TRƯỚC ĐỘNG: `/finance/debts/calendar` cùng hình dạng với
  //    `/finance/debts/:id` — cả hai đều ba đoạn.
  { mau: '/finance/debts/calendar', nap: () => import('@/app/finance/debts/calendar/page') },
  { mau: '/finance/expenses/recurring', nap: () => import('@/app/finance/expenses/recurring/page') },
  { mau: '/finance/debts/:id', nap: () => import('@/app/finance/debts/[id]/page') },
  { mau: '/finance/wallets/:id', nap: () => import('@/app/finance/wallets/[id]/page') },

  /* ── Diễn đàn ── */
  { mau: '/forum', nap: () => import('@/app/forum/page') },
  { mau: '/forum/:id', nap: () => import('@/app/forum/[id]/page') },

  /* ── Đã lưu ── */
  { mau: '/saved', nap: () => import('@/app/saved/page') },

  /* ── Trang cá nhân ── */
  { mau: '/profile', nap: () => import('@/app/profile/page') },
  { mau: '/profile/:id', nap: () => import('@/app/profile/[id]/page') },
  { mau: '/profile/:id/v2', nap: () => import('@/app/profile/[id]/v2/page') },
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
export const GOC_WEB: readonly string[] = [
  '/language', '/roadmap', '/interview', '/cv',
  '/maker-lab', '/creator', '/projects', '/repos', '/exp-hub',
  '/games', '/finance', '/forum', '/saved', '/profile',
];

/** Đường dẫn này có thuộc một cây web không (kể cả các trang con động). */
export function thuocCayWeb(duong: string): boolean {
  return GOC_WEB.some((g) => duong === g || duong.startsWith(`${g}/`));
}
