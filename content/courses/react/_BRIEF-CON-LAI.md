# Khoá React — phần CÒN LẠI (chốt 25/09/2026, sau khi cloud hết credit)

Đã xong + lên prod (d997c3ef): Mục 0, Ch1–7, Ch11 — xem `s00…s07`, `s11`, deck `rx-00…07`, `rx-11`, R2 `RX/v1`.
Luật cứng: `_HOP-DONG.md` (cùng thư mục). Mẫu chất lượng: `s11-ben-trong.mjs` + `scripts/slides-src/rx-11.mjs`.
Dự án xuyên suốt: app "Đặt lịch phòng khám" — mỗi chương kết thúc bằng "🛠 Tự gõ tiếp dự án" + lời giải trong `<details>`.

## Cách làm tiếp ở máy (tối đa 3 agent cùng lúc, Opus cho soạn chương)
Mỗi agent một chương: tạo `content/courses/react/sNN-*.mjs` + `scripts/slides-src/rx-NN.mjs`, KHÔNG sửa file khác,
không commit/upload/seed. Người điều phối (phiên chính): thay phần tử khung của chương đó trong `content/courses/react.mjs`
bằng import file thật → render (`scripts/_render-slides.mjs`) → `_kiem-tran-slide` → `scripts/rx-ghep-chuong.mjs <file>
--render <dir> --moi` → `course-content-check` → upload `--prefix RX/v1 --decks rx-NN` → `--cdn` → seed thử → commit → deploy-nha.
GIỮ slug + title chương + slug bài đang có trong khung (Ch8–10). Ch12–14 là section MỚI (slug rx-12…rx-14).

## Chương còn thiếu (thứ tự ưu tiên)
1. **Ch8 — Hiệu năng và khả năng tiếp cận** (khung có sẵn: Profiler · memo/useMemo/useCallback khi nào có ích · chia bundle
   & lazy · component dễ tiếp cận). Đo THẬT bằng React Profiler/Lighthouse, không bịa số.
2. **Ch12 — React 19 & concurrent** (MỚI): Suspense cho dữ liệu, useTransition, useDeferredValue, Actions, useActionState,
   useOptimistic, use(), React Compiler (bật thử, đo trước/sau), Server Components mức khái niệm (bắc cầu Next.js).
3. **Ch9 — Test React** (khung: Testing Library · test UI bất đồng bộ/gọi API · test hook tự viết · câu hỏi phỏng vấn).
   Vitest + Testing Library + MSW, output test THẬT.
4. **Ch10 — Dự án giữa khoá: giao diện đặt lịch** (khung: thiết kế → cây component · dựng · hoàn thiện · deploy & checklist).
   Đổi vai thành "dự án giữa khoá" (bài thi cuối khoá KHÔNG ở đây nữa).
5. **Ch13 — Mẫu thiết kế & kiến trúc** (MỚI): compound component, headless, polymorphic `as`, custom hook tốt, Tailwind vs
   CSS Modules, virtualization (đo thật), XSS & dangerouslySetInnerHTML, i18n cơ bản.
6. **Ch14 — Lên production** (MỚI): đăng nhập/token/route bảo vệ, 401 → refresh, lỗi mạng, env Vite, build + đo bundle,
   deploy tĩnh + CI (trỏ khoá github-actions), checklist phỏng vấn middle + 15 câu, **thi cuối khoá rx-14-5-thi-cuoi-khoa
   20 câu, đáp án 5/5/5/5, timeLimitSeconds 1800**.

## Việc phụ
- ~7 chỗ `CHAY-O-MAY` trong Ch0/3/5/7 (bộ gõ tiếng Việt trên Windows/macOS/Android thật, React DevTools, deploy host tĩnh):
  việc tay — làm khi có thiết bị, không bắt buộc.
- Video YouTube cho khoá (`content/course-videos/react.mjs` chưa có): theo quy trình `ghep-video-khoa.mjs` +
  `yt-search/yt-check/yt-desc` + kiểm playabilityStatus (xem cách làm cho github-actions 25/09).
