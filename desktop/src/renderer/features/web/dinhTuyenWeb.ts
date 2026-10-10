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
  /** Tham số CỐ ĐỊNH gộp vào tham số động — vd. cây `/ielts` của app là `/language/en/ielts` của web. */
  thamSoCo?: Readonly<Record<string, string>>;
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
  // Khoá học kiểu sách (28/09/2026): IELTS 4 kỹ năng và tiếng Nhật できる日本語 —
  // cùng bộ khung components/sach-hoc, tải nội dung từng buổi theo import().
  { mau: '/language/:code/ielts', nap: () => import('@/app/language/[code]/ielts/page') },
  { mau: '/language/:code/ielts/phong-thi', nap: () => import('@/app/language/[code]/ielts/phong-thi/page') },
  { mau: '/language/:code/ielts/luyen-them', nap: () => import('@/app/language/[code]/ielts/luyen-them/page') },
  { mau: '/language/:code/ielts/thi-may', nap: () => import('@/app/language/[code]/ielts/thi-may/page') },
  { mau: '/language/:code/ielts/the-tu', nap: () => import('@/app/language/[code]/ielts/the-tu/page') },
  { mau: '/language/:code/ielts/so-loi', nap: () => import('@/app/language/[code]/ielts/so-loi/page') },

  /* ── IELTS — mục riêng trên thanh bên (03/10/2026); cùng trang web, code='en'. ── */
  { mau: '/ielts', nap: () => import('@/app/language/[code]/ielts/page'), thamSoCo: { code: 'en' } },
  { mau: '/ielts/phong-thi', nap: () => import('@/app/language/[code]/ielts/phong-thi/page'), thamSoCo: { code: 'en' } },
  { mau: '/ielts/luyen-them', nap: () => import('@/app/language/[code]/ielts/luyen-them/page'), thamSoCo: { code: 'en' } },
  // Đợt 1 nâng cấp IELTS (07/10/2026): phòng thi máy tính, flashcard SRS, sổ lỗi.
  { mau: '/ielts/thi-may', nap: () => import('@/app/language/[code]/ielts/thi-may/page'), thamSoCo: { code: 'en' } },
  { mau: '/ielts/the-tu', nap: () => import('@/app/language/[code]/ielts/the-tu/page'), thamSoCo: { code: 'en' } },
  { mau: '/ielts/so-loi', nap: () => import('@/app/language/[code]/ielts/so-loi/page'), thamSoCo: { code: 'en' } },
  { mau: '/language/:code/dekiru', nap: () => import('@/app/language/[code]/dekiru/page') },
  { mau: '/language/:code/dekiru/sach-goc', nap: () => import('@/app/language/[code]/dekiru/sach-goc/page') },
  /* ── JP & CH — mục riêng dưới IELTS (05/10/2026), cùng bộ khung sách-học. ── */
  { mau: '/language/:code/jp', nap: () => import('@/app/language/[code]/jp/page') },
  { mau: '/language/:code/ch', nap: () => import('@/app/language/[code]/ch/page') },
  { mau: '/jp', nap: () => import('@/app/language/[code]/jp/page'), thamSoCo: { code: 'ja' } },
  { mau: '/jp/tren-lop', nap: () => import('@/app/language/[code]/dekiru/page'), thamSoCo: { code: 'ja' } },
  { mau: '/jp/tren-lop/sach-goc', nap: () => import('@/app/language/[code]/dekiru/sach-goc/page'), thamSoCo: { code: 'ja' } },
  { mau: '/ch', nap: () => import('@/app/language/[code]/ch/page'), thamSoCo: { code: 'zh' } },

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

  /* ── Code Lab (04/10/2026) ──
     Thay màn native cũ (`features/codelab/CodeLabPage` bản 630 dòng, chỉ đọc
     đề + lời giải) bằng nguyên cây web: sổ bài nhiều tệp có lưu tiến độ, AI
     giảng bài, huấn luyện viên (vấn đáp, soát yêu cầu, chấm zip), Phòng Lab.
     Đối chiếu bằng `find frontend/src/app/code-lab -name page.tsx` ⇒ 6 trang.

     ⚠️ TĨNH TRƯỚC ĐỘNG, HAI chỗ: `search`/`phong-lab` cùng hình dạng với
     `/code-lab/:trackSlug`, và `phong-lab/:id` cùng hình dạng với
     `/code-lab/:trackSlug/:exerciseSlug`. Đảo thứ tự là "phong-lab" bị đọc
     thành slug track — trang mở ra rồi báo "không tìm thấy track", hỏng CÂM. */
  { mau: '/code-lab', nap: () => import('@/app/code-lab/page') },
  { mau: '/code-lab/search', nap: () => import('@/app/code-lab/search/page') },
  { mau: '/code-lab/phong-lab', nap: () => import('@/app/code-lab/phong-lab/page') },
  { mau: '/code-lab/phong-lab/:id', nap: () => import('@/app/code-lab/phong-lab/[id]/page') },
  { mau: '/code-lab/:trackSlug', nap: () => import('@/app/code-lab/[trackSlug]/page') },
  { mau: '/code-lab/:trackSlug/:exerciseSlug', nap: () => import('@/app/code-lab/[trackSlug]/[exerciseSlug]/page') },

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

  /* ── Học viện: hai trang tư vấn ──
     App có màn Học viện RIÊNG (`features/academy/HocVienPage`) vì nó cần đọc
     được khi ngoại tuyến — trang web không có phần đó. Nhưng hai trang dưới
     đây thì app chưa từng có, và người dùng nêu đích danh 15/09/2026: *"chưa
     có chọn ngành, tư vấn ngành hẹp, sơ đồ"*.

     Dùng lại nguyên của web thay vì viết lại: cả hai đều là cây tư vấn dựa
     trên bảng ngành/khoa/combo (`data/academyCatalog.ts`), tức là KIẾN THỨC
     chứ không phải mã — chép sang đây là chép một bảng dữ liệu sẽ đổi theo
     chương trình đào tạo, rồi hai bản lệch nhau lúc nào không hay. */
  { mau: '/academy/tu-van-nganh', nap: () => import('@/app/academy/tu-van-nganh/page') },
  { mau: '/academy/so-do-mon-hoc', nap: () => import('@/app/academy/so-do-mon-hoc/page') },

  /* ── Tech Trends ──
     TĨNH TRƯỚC ĐỘNG. Sáu trang chuyên đề (`/news`, `/ielts`, `/hoc-sql`…) đều
     dài đúng 2 đoạn giống `/tech-trends/:slug` của bài viết, nên xếp sau mẫu
     động là chúng bị nuốt: mở "Việc làm Claude Code" sẽ ra một trang bài viết
     RỖNG chứ không phải lỗi — hỏng im lặng, đúng cảnh báo ở đầu tệp. */
  { mau: '/tech-trends', nap: () => import('@/app/tech-trends/page') },
  { mau: '/tech-trends/news', nap: () => import('@/app/tech-trends/news/page') },
  { mau: '/tech-trends/ielts', nap: () => import('@/app/tech-trends/ielts/page') },
  { mau: '/tech-trends/hoc-sql', nap: () => import('@/app/tech-trends/hoc-sql/page') },
  { mau: '/tech-trends/on-thi-jpd113', nap: () => import('@/app/tech-trends/on-thi-jpd113/page') },
  { mau: '/tech-trends/tieng-anh-giao-tiep', nap: () => import('@/app/tech-trends/tieng-anh-giao-tiep/page') },
  { mau: '/tech-trends/viec-lam-claude-code', nap: () => import('@/app/tech-trends/viec-lam-claude-code/page') },
  { mau: '/tech-trends/:slug', nap: () => import('@/app/tech-trends/[slug]/page') },

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

  /* ── Content Creator (tên cũ: Xưởng nội dung) ── */
  { mau: '/creator', nap: () => import('@/app/creator/page') },
  /* 04/10/2026 — hai màn AI: Quay khoá học + Ý tưởng AI. */
  { mau: '/creator/quay-khoa-hoc', nap: () => import('@/app/creator/quay-khoa-hoc/page') },
  { mau: '/creator/y-tuong-ai', nap: () => import('@/app/creator/y-tuong-ai/page') },
  { mau: '/creator/calendar', nap: () => import('@/app/creator/calendar/page') },
  { mau: '/creator/ideas', nap: () => import('@/app/creator/ideas/page') },
  { mau: '/creator/list', nap: () => import('@/app/creator/list/page') },
  { mau: '/creator/pipeline', nap: () => import('@/app/creator/pipeline/page') },
  { mau: '/creator/projects/:id', nap: () => import('@/app/creator/projects/[id]/page') },

  /* ── Dự án ── */
  { mau: '/projects', nap: () => import('@/app/projects/page') },
  // ⚠️ TĨNH TRƯỚC ĐỘNG: `/projects/search` cùng hình dạng với `/projects/:slug`.
  { mau: '/projects/search', nap: () => import('@/app/projects/search/page') },
  /* Chi tiết dự án (04/10/2026): `[slug]/page.tsx` là SERVER component (chỉ dựng
     metadata SEO) bọc `ProjectPageClient` — phần client đó tự đọc slug bằng
     `useParams`, nên app nạp THẲNG nó. Thiếu tuyến này thì nút "Mở trang đầy đủ"
     trong Projects ra "Không có trang cho đường dẫn /projects/<slug>". */
  { mau: '/projects/:slug', nap: () => import('@/app/projects/[slug]/ProjectPageClient') },

  /* ── Kho mã ── */

  /* ── Exp Hub ── */
  { mau: '/exp-hub', nap: () => import('@/app/exp-hub/page') },
  /* Chi tiết EXP_Hub (04/10/2026): `[slug]/page.tsx` là server component `async`
     — app nạp bản CLIENT `ChiTietSnippetClient` (tải qua API, dựng chung giao diện). */
  { mau: '/exp-hub/:slug', nap: () => import('@/app/exp-hub/[slug]/ChiTietSnippetClient') },

  /* ── Trò chơi ── */
  // ⚠️ TĨNH TRƯỚC ĐỘNG: đường dưới cùng hình dạng với `/games/:slug`.
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

  /* ── Tài chính (13 màn, nhiều nhất) ── */
  // Huấn luyện học kỳ (02/10/2026) — xem docs/hoc-tap-coach-plan.md.
  { mau: '/hoc-tap', nap: () => import('@/app/hoc-tap/page') },
  { mau: '/hoc-tap/mon/:id', nap: () => import('@/app/hoc-tap/mon/[id]/page') },
  { mau: '/finance', nap: () => import('@/app/finance/page') },
  { mau: '/finance/phan-tich', nap: () => import('@/app/finance/phan-tich/page') },
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


  /* ⛔⛔ TÁM TRANG BỊ GỠ — chúng là SERVER COMPONENT (24/08/2026) ────────────
   *
   *   /repos · /repos/:id · /repos/tag/:slug          (CẢ cây)
   *   /games · /games/leaderboard · /games/:slug      (CẢ cây)
   *   (`/exp-hub/:slug` và `/projects/:slug` đã đưa LẠI 04/10/2026 — nạp phần client.)
   *   (`/projects/:slug` đã đưa LẠI vào 04/10/2026 — nạp thẳng ProjectPageClient.)
   *
   * Chúng khai `export default async function` — component BẤT ĐỒNG BỘ, thứ
   * chỉ Next chạy được ở phía MÁY CHỦ. Dựng chúng trong cây React phía client
   * cho ra `Minified React error #31 … [object Promise]`: React nhận một lời
   * hứa ở chỗ đáng lẽ là phần tử.
   *
   * Đây KHÔNG phải lỗ hổng shim — không shim nào vá được. Muốn đưa vào app thì
   * phải VIẾT LẠI chúng thành client component, và việc đó đổi cả hành vi trên
   * web (mất kết xuất phía máy chủ ⇒ ảnh hưởng SEO), nên là quyết định riêng.
   *
   * ⚠️ Cách đo của tôi đã bỏ sót chuyện này: tôi đếm import từ `next/*` mà
   * KHÔNG hỏi "trang này là server hay client component" — câu hỏi cơ bản hơn.
   * Đếm bằng: grep -L "use client" rồi grep "export default async".
   *
   * `/projects` và `/exp-hub` GIỮ trang danh sách (chúng là client component
   * và chạy tốt); bấm vào một mục thì rơi vào "Không tìm thấy" kèm nút quay về.
   */

  /* ── Diễn đàn ── */
  { mau: '/forum', nap: () => import('@/app/forum/page') },
  { mau: '/forum/:id', nap: () => import('@/app/forum/[id]/page') },

  /* ── Đã lưu ── */
  { mau: '/saved', nap: () => import('@/app/saved/page') },

  /* ── Trang cá nhân ── */
  /* ── Thông báo (04/10/2026) ── */
  { mau: '/notifications', nap: () => import('@/app/notifications/page') },

  /* Hồ sơ: tên đăng nhập + tên hiển thị + ảnh + tiểu sử — dùng chung trang web (04/10/2026). */
  /* App đặt ở `/ho-so`: `/settings` là màn Cài đặt native của app, nuốt mọi đường con. */
  { mau: '/ho-so', nap: () => import('@/app/settings/profile/page') },
  /* Cài đặt thông báo — khớp chính xác ở NATIVE_PAGES (CaiDatThongBaoPage). */
  { mau: '/settings/notifications', nap: () => import('@/app/settings/notifications/page') },
  { mau: '/profile', nap: () => import('@/app/profile/page') },
  { mau: '/profile/:id', nap: () => import('@/app/profile/[id]/page') },
  { mau: '/profile/:id/v2', nap: () => import('@/app/profile/[id]/v2/page') },

  /* ── CT Work (kiểu Jira) — 23/09/2026 ──
     Đối chiếu bằng `find frontend/src/app/work -name page.tsx` ⇒ 40 trang (06/10/2026, sau Resources).
     Khung chung (`app/work/layout.tsx`: thanh bên, bảng lệnh ⌘K, AI, `#work-portal`,
     `work.css`) do `CtWorkPage` dựng — xem tệp đó.

     ⚠️ TĨNH TRƯỚC ĐỘNG, BA chỗ: `/work/invite/:token`, `/work/share/:token` cùng
     hình dạng với `/work/:ws/:key`, còn `/work/developer` và `/work/search` cùng hình dạng với
     `/work/:ws`. Đảo thứ tự là "developer" bị đọc thành slug không gian làm việc
     và trang hiện "workspace not found" — hỏng CÂM.
     Tương tự `/work/:ws/settings` phải đứng trước `/work/:ws/:key` (không thì
     "settings" thành mã dự án), và `/work/:ws/:key/tests/cycles/:cycleId` dài 6
     đoạn nên không đụng `/work/:ws/:key/tests/:num` (5 đoạn). */
  { mau: '/work', nap: () => import('@/app/work/page') },
  { mau: '/work/developer', nap: () => import('@/app/work/developer/page') },
  /* Tìm thẻ mọi dự án (24/09) — tĩnh, phải đứng TRƯỚC `/work/:ws`. */
  { mau: '/work/search', nap: () => import('@/app/work/search/page') },
  /* CTW đợt 5 (10/10/2026): hub giảng viên + lớp học — tĩnh, phải đứng TRƯỚC `/work/:ws` (không thì "teaching" thành slug). */
  { mau: '/work/teaching', nap: () => import('@/app/work/teaching/page') },
  { mau: '/work/classes', nap: () => import('@/app/work/classes/page') },
  { mau: '/work/invite/:token', nap: () => import('@/app/work/invite/[token]/page') },
  { mau: '/work/share/:token', nap: () => import('@/app/work/share/[token]/page') },
  { mau: '/work/survey/:token', nap: () => import('@/app/work/survey/[token]/page') }, // 6b: khảo sát công khai
  { mau: '/work/mockup-review/:token', nap: () => import('@/app/work/mockup-review/[token]/page') }, // 6b: khách duyệt prototype
  { mau: '/work/:ws', nap: () => import('@/app/work/[ws]/page') },
  { mau: '/work/:ws/settings', nap: () => import('@/app/work/[ws]/settings/page') },
  /* Lớp studio Đợt S1 (04/10/2026): bộ phận — tĩnh "teams" phải đứng TRƯỚC
     `/work/:ws/:key`, và `/teams/:teamId` (4 đoạn) trước `/:key/board`. */
  { mau: '/work/:ws/teams', nap: () => import('@/app/work/[ws]/teams/page') },
  { mau: '/work/:ws/teams/:teamId', nap: () => import('@/app/work/[ws]/teams/[teamId]/page') },
  /* Đợt S3a (04/10/2026): danh mục dự án + khối lượng việc — tĩnh, phải đứng TRƯỚC `/work/:ws/:key`. */
  { mau: '/work/:ws/portfolio', nap: () => import('@/app/work/[ws]/portfolio/page') },
  { mau: '/work/:ws/workload', nap: () => import('@/app/work/[ws]/workload/page') },
  /* CTW-28 A14 (09/10/2026): AI agent thành viên — tĩnh, phải đứng TRƯỚC `/work/:ws/:key`; `/agents/:id` (4 đoạn) cũng
     trước `/:key/board` (cùng 4 đoạn — "agents" không bao giờ là mã dự án vì mã VIẾT HOA). */
  { mau: '/work/:ws/agents', nap: () => import('@/app/work/[ws]/agents/page') },
  { mau: '/work/:ws/agents/:id', nap: () => import('@/app/work/[ws]/agents/[id]/page') },
  { mau: '/work/:ws/:key', nap: () => import('@/app/work/[ws]/[key]/page') },
  { mau: '/work/:ws/:key/board', nap: () => import('@/app/work/[ws]/[key]/board/page') },
  { mau: '/work/:ws/:key/backlog', nap: () => import('@/app/work/[ws]/[key]/backlog/page') },
  { mau: '/work/:ws/:key/list', nap: () => import('@/app/work/[ws]/[key]/list/page') },
  { mau: '/work/:ws/:key/timeline', nap: () => import('@/app/work/[ws]/[key]/timeline/page') },
  { mau: '/work/:ws/:key/releases', nap: () => import('@/app/work/[ws]/[key]/releases/page') },
  { mau: '/work/:ws/:key/reports', nap: () => import('@/app/work/[ws]/[key]/reports/page') },
  { mau: '/work/:ws/:key/dashboards', nap: () => import('@/app/work/[ws]/[key]/dashboards/page') },
  { mau: '/work/:ws/:key/tests', nap: () => import('@/app/work/[ws]/[key]/tests/page') },
  /* CTW đợt 3B (09/10/2026): báo cáo Excel nộp trường (WBS, Project Tracking, Weekly Report, AI Usage). */
  { mau: '/work/:ws/:key/school', nap: () => import('@/app/work/[ws]/[key]/school/page') },
  { mau: '/work/:ws/:key/team', nap: () => import('@/app/work/[ws]/[key]/team/page') }, // UX-C: Team overview
  { mau: '/work/:ws/:key/settings', nap: () => import('@/app/work/[ws]/[key]/settings/page') },
  // Lớp studio Đợt S1: giai đoạn & cổng, phê duyệt có chữ ký.
  { mau: '/work/:ws/:key/stages', nap: () => import('@/app/work/[ws]/[key]/stages/page') },
  { mau: '/work/:ws/:key/approvals', nap: () => import('@/app/work/[ws]/[key]/approvals/page') },
  // Đợt S2a: tài liệu dự án kiểu Confluence (mô-đun docs).
  { mau: '/work/:ws/:key/docs', nap: () => import('@/app/work/[ws]/[key]/docs/page') },
  { mau: '/work/:ws/:key/docs/:num', nap: () => import('@/app/work/[ws]/[key]/docs/[num]/page') },
  // Đợt S2b: cổng khách (mô-đun clientPortal) + biên bản nghiệm thu in được.
  { mau: '/work/:ws/:key/portal', nap: () => import('@/app/work/[ws]/[key]/portal/page') },
  { mau: '/work/:ws/:key/portal/uat/:aid', nap: () => import('@/app/work/[ws]/[key]/portal/uat/[aid]/page') },
  // Đợt S3b (04/10/2026): họp · yêu cầu thay đổi · sổ RAID.
  { mau: '/work/:ws/:key/meetings', nap: () => import('@/app/work/[ws]/[key]/meetings/page') },
  { mau: '/work/:ws/:key/meetings/:num', nap: () => import('@/app/work/[ws]/[key]/meetings/[num]/page') },
  { mau: '/work/:ws/:key/changes', nap: () => import('@/app/work/[ws]/[key]/changes/page') },
  { mau: '/work/:ws/:key/changes/:num', nap: () => import('@/app/work/[ws]/[key]/changes/[num]/page') },
  { mau: '/work/:ws/:key/raid', nap: () => import('@/app/work/[ws]/[key]/raid/page') },
  // Đợt S4 (04/10/2026): tài chính dự án · chế độ thuyết trình.
  { mau: '/work/:ws/:key/finance', nap: () => import('@/app/work/[ws]/[key]/finance/page') },
  { mau: '/work/:ws/:key/present', nap: () => import('@/app/work/[ws]/[key]/present/page') },
  // Đợt S5a (04/10/2026): service desk & SLA.
  { mau: '/work/:ws/:key/desk', nap: () => import('@/app/work/[ws]/[key]/desk/page') },
  /* Đợt S6 (05/10/2026): Spec quality — chấm Spec Fidelity tập thẻ yêu cầu + lịch sử. */
  { mau: '/work/:ws/:key/spec', nap: () => import('@/app/work/[ws]/[key]/spec/page') },
  /* CTW đợt 4 (09/10/2026): Requirements — SRS có cấu trúc (UC/actor/BR/màn/phân quyền) + RTM. */
  { mau: '/work/:ws/:key/requirements', nap: () => import('@/app/work/[ws]/[key]/requirements/page') },
  /* Resources (06/10/2026): thư viện link của dự án. */
  { mau: '/work/:ws/:key/resources', nap: () => import('@/app/work/[ws]/[key]/resources/page') },
  /* CTW K-3 (10/10/2026): kênh chat dự án (?c= kênh, ?m= tin, ?t= luồng). */
  { mau: '/work/:ws/:key/chat', nap: () => import('@/app/work/[ws]/[key]/chat/page') },
  /* CTW Diagram (10/10/2026): Diagram Studio (?d= mở một sơ đồ). */
  { mau: '/work/:ws/:key/diagrams', nap: () => import('@/app/work/[ws]/[key]/diagrams/page') },
  /* CTW đợt 4b (10/10/2026): hồ sơ SWR302 theo Wiegers (?tab= overview|features|requirements|priority|glossary|dictionary|six-links). */
  { mau: '/work/:ws/:key/wiegers', nap: () => import('@/app/work/[ws]/[key]/wiegers/page') },
  { mau: '/work/:ws/:key/reviews', nap: () => import('@/app/work/[ws]/[key]/reviews/page') }, // CTW đợt 6: review/inspection + baseline
  { mau: '/work/:ws/:key/tests/:num', nap: () => import('@/app/work/[ws]/[key]/tests/[num]/page') },
  { mau: '/work/:ws/:key/issue/:num', nap: () => import('@/app/work/[ws]/[key]/issue/[num]/page') },
  { mau: '/work/:ws/:key/tests/cycles/:cycleId', nap: () => import('@/app/work/[ws]/[key]/tests/cycles/[cycleId]/page') },
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
    if (khop) return { tuyen, thamSo: { ...tuyen.thamSoCo, ...thamSo } };
  }
  return null;
}

/** Gốc của những cây route mà trang web sở hữu — dùng cho router của app. */
export const GOC_WEB: readonly string[] = [
  '/language', '/ielts', '/jp', '/ch', '/roadmap', '/interview', '/cv',
  /* Code Lab — cả cây (04/10/2026); `/code-lab` chính nó cũng là trang web. */
  '/code-lab',
  '/maker-lab', '/creator', '/projects', '/exp-hub',
  '/finance', '/forum', '/saved', '/profile', '/ho-so',
  '/tech-trends',
  /* ⚠️ `/academy` CHÍNH NÓ vẫn là màn native (`HocVienPage`, có đọc ngoại
     tuyến) — `nativePageFor` khớp chính xác TRƯỚC khi hỏi tới cây web, nên
     mục này chỉ mở đường cho các trang CON: `tu-van-nganh`, `so-do-mon-hoc`. */
  '/academy',
  /* CT Work — cả cây, gồm hai đường công khai `invite/*` và `share/*`. */
  '/work',
  /* Huấn luyện học kỳ — `/hoc-tap/mon/:id`. */
  '/hoc-tap',
  /* Sổ tay: `/notes` là màn `NotesPage` (khớp chính xác); mục này mở đường cho
     `/notes/graph` — "Đồ thị liên kết" trong ⌘K và trang chủ Sổ tay. */
  '/notes',
];

/** Đường dẫn này có thuộc một cây web không (kể cả các trang con động). */
export function thuocCayWeb(duong: string): boolean {
  return GOC_WEB.some((g) => duong === g || duong.startsWith(`${g}/`));
}
