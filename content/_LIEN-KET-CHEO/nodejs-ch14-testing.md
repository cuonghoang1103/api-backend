# Liên kết chéo Node.js Chương 14 (Kiểm thử) ↔ Testing

Đợt 10 video Node.js, 08/11/2026. Deep link: `/courses/<slug-khoá>/learn?lessonSlug=<slug-bài>` (Courses: `nodejs`, `testing`).
Khối `<a class="link-card lien-ket-cheo">` trước mục 🧪 Thực hành (nếu có) hoặc cuối `ml-en` / `ml-vi`, HAI CHIỀU. Thẻ ở bài Node nói "Học sâu hơn ở Testing — bài x.y";
thẻ ở bài Testing nói "Gặp lại ở khoá Node.js — 14.x". Lời video (`src/bai/node-14-*/kichban.ts`) nhắc cùng các bài ở đúng cảnh và ghi trong `LIEN_KET`.
Số đo của Node chạy trong môi trường sạch (`scratchpad/node/chay-c14.mjs`, biến môi trường GIẢ), Node 22.23.3 · vitest 5.1.0 · @vitest/coverage-v8 5.1.0 · jest 30.5.2 ·
supertest 7.3.2 · Express 5.3.0 · zod 4.6.7 · pg 8.23.1 · PostgreSQL 17 trong Docker (container `node14-pg`, `node14-throw`, đã gỡ) · node:22-alpine sạch cho CI.

| Node.js | Testing | Giống | Node.js thêm (đo thật) |
|---|---|---|---|
| `nodejs-14-1-vi-sao-test` | `tst-0-1-kim-tu-thap` | ba tầng test, giá và thứ bắt được | cùng một luật: 0,001 / 2,398 / 2,110 ms mỗi test (e2e rẻ hơn integration); node:test 0,09 s vs vitest 0,49 vs jest 0,44 (6 test) |
| `nodejs-14-2-unit-test` | `tst-3-4-thiet-ke` | truyền phụ thuộc vào để thay bằng hàng giả | 12 test 3 + 5 ms; bốn test rỗng: vitest bắt 1, 2 / lọt 3, 4; node:test t.plan bắt 3; 404 → 403 ⇒ 1 đỏ |
| `nodejs-14-3-supertest` | `tst-5-1-supertest` | tách createApp khỏi listen, hợp đồng thành khẳng định | 6 test HTTP + PostgreSQL 147 ms; 404 phải đọc lại dòng; supertest chênh server sống 0,29 ms/request |
| `nodejs-14-4-db-that` | `tst-4-1-vi-sao` | vì sao cần cơ sở dữ liệu thật | 5 yêu cầu trùng: giả 5 × 201, thật 4 × 500 (23505) → sửa 4 × 409; 0/10 vs 10/10 1,36 s vs 10/10 0,87 s; pg_isready 2.015 vs SELECT 1 2.345 ms |
| `nodejs-14-5-do-phu-flaky-ci` | `tst-8-1-do-phu` | độ phủ đếm cái đã chạy | slug.mjs 100 % bốn cột mà canEdit(EDITOR) = true; 20 test 90,62 %, repo 17–25 chưa phủ |
| `nodejs-14-5-do-phu-flaky-ci` | `tst-8-3-flaky` | bốn nguyên nhân chập chờn | cả bốn đã đo trong chương: 0/10, "expected 2 to be 1", đồng hồ thật, cuộc đua 23505; npm ci 21.142 vs test 842 ms |

Chiều Testing → Node đã có từ trước cho 14.2 (`tst-3-4-thiet-ke`, `tst-10-1-tdd`), 14.3 (`tst-5-1-supertest`), 14.4 (`tst-4-1-vi-sao`, `tst-11-2-backend`), 14.5 (`tst-8-1-do-phu`, `tst-8-3-flaky`, `tst-9-1-github-actions`) —
đợt này thêm chiều Node → Testing cho các cặp đó, và CẢ HAI chiều cho 14.1 ↔ `tst-0-1-kim-tu-thap`.
Có sẵn từ trước (không thêm lại): Node 14.2 → `tst-10-1-tdd` · Node 14.4 → `tst-11-2-backend` · Node 14.5 → `tst-9-1-github-actions`.
**Sửa bài web cùng đợt (EN + VI, `s14-testing.mjs`):** 14.1 `npm test` nay 190 file test (43 file test DB), không còn "ba file, 272 dòng, 20 test 1297 ms" ·
14.2 `cv.test.ts` không còn là "file lớn nhất trong ba", và câu "fails the build…" là CHÚ THÍCH của bước CV linter eval, không phải tên bước ·
14.4 website nay CÓ 43 file test DB + job CI `work-db-tests` (pgvector pg16, pg_isready, dựng schema từ migration, bước test 451 s) — câu "không có test DB, CI không bao giờ dựng PostgreSQL" đã sai từ 10/2026 ·
14.5 CI nay ba job, 8 lượt gần nhất 8m24s–11m51s và ĐỎ ở bước type-check (không còn "1m30s–2m08s, xanh"; cả câu trắc nghiệm) · 14.5 đường deploy nay `deploy-nha.sh` (dựng ở máy nhà → GHCR → VPS tráo + smoke test → bộ kiểm CI trên worktree sạch → đẩy GitHub nếu xanh), không còn `deploy.sh` + người thử + push tay ·
thêm ghi chú "Đo lại cho video (08/11/2026)" ở 14.1 (tầng test + bộ chạy), 14.3 (147 ms; chênh 0,29 ms/request ⇒ 600 request ≈ 0,17 s), 14.4 (pool NGUỘI cũng đua; container 443 / 2.015 / 2.345 ms), 14.5 (độ phủ 20 test 90,62 %) — giữ số gốc của bài.
**Chỉ nhắc trong lời video, CHƯA đặt thẻ web:** Node 1.5, 4.2, 6, 8.3; Testing 1.3, 2.1, 2.2, 3.1, 4.2, 4.3, 4.4, 5.2, 5.4, 8.2, 9.3; Web Foundations 13.1; PostgreSQL 11.1; Code Lab Node.js "Testing, Deployment, and Production Readiness" / "Advanced Testing, CI/CD, and Deployment".
