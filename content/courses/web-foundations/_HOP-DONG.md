# Hợp đồng soạn khoá "Nền tảng Web" (/courses/web-foundations)

> Viết 01/11/2026 khi nâng cấp 48 bài mỏng (text < 6.000 ký tự). Khuôn chép từ `testing/_HOP-DONG.md` và `api-design/_HOP-DONG.md`,
> thu gọn cho khoá này. Chỗ nào file này không nói ⇒ bắt chước bài đã nâng cấp gần nhất (Ch11 trở đi).

## 0. Khoá này dạy ai

- Người **chưa biết gì** về web (HTML/CSS/JS/HTTP/DevTools/Git). DỄ HIỂU là tiêu chí số 1; thuật ngữ Anh lần đầu luôn kèm giải nghĩa
  `closure (bao đóng)`, các lần sau dùng thẳng.
- Song ngữ: mỗi bài một cặp `<div class="ml-en">` + `<div class="ml-vi">` **đầy đủ tương đương** (không tóm tắt).
- Mọi output trong bài là **output chạy thật** (Chromium thật qua Playwright, hoặc công cụ thật — Vitest, Vite… — trong thư mục
  scratch), chép nguyên văn qua `_ma.mjs`. Không bịa output.

## 1. Cây file

| File | Vai trò |
|---|---|
| `content/courses/web-foundations.mjs` | Khoá, import 15 chương `sNN-*.mjs`. |
| `web-foundations/sNN-*.mjs` | Chương (một file). Bài nâng cấp có thể tách ra `web-foundations/sNN/<bai>.mjs` rồi import vào chương. |
| `web-foundations/_slides.mjs` | `gallery()` (deck CHƯƠNG cũ `wf-html`…), **`walkWf()`** (deck BÀI `wf-N-M` + lời giảng EN/VI), `ma()`, `ra()`, `lienKet()`, `nguon()`, bảng `VER`. |
| `web-foundations/_demo/<N-M>/…` | Mã ví dụ của bài (`.js` script cổ điển, `.mjs` module, `.html` trang) + output đã chụp `*.out.txt`. |
| `web-foundations/_ma.mjs` | **SINH TỰ ĐỘNG** bởi `scripts/wf/sinh-ma.mjs`: `CODE[đường dẫn]`, `OUT[đường dẫn bỏ đuôi]`. Không sửa tay. |
| `web-foundations/_demo/_t13/` | Dự án Vitest của Ch13 (không có node_modules). Dựng lại: chép ra scratch, `npm install`, `PATH=<node22>/bin:$PATH FORCE_COLOR=0 npx vitest run …` > `out/*.out.txt`, bỏ dòng ` RUN ` và mã màu ANSI. Thư mục `_` không bị chay-demo chạy. |
| `web-foundations/_demo/_t14/` | Dự án Vite của Ch14 (không có node_modules, `env.demo` là giá trị GIẢ). Dựng lại: chép ra scratch, `npm install`, chạy `npx vite build`, `node server.mjs [--spa]`, `node smoke.mjs`, `node perf/measure.mjs` (Playwright, giả lập 1,6 Mbps/150 ms/CPU ×4); output ghi tay vào `out/*.out.txt`. |
| `scripts/wf/chay-demo.mjs` | Chạy mọi demo trong **Chromium thật** (Playwright), ghi `*.out.txt` (console + lỗi chưa bắt) và ảnh `*.png` khi trang khai `<meta name="chup">`. |
| `scripts/slides-src/wf-N-M.mjs` | Deck bài, khuôn **`_pg-chung.mjs`** (`lamDeck({ khoa: 'Web Foundations', duong: 'courses/web-foundations', bieuTuong: '🌐', … })`), slide **tiếng Anh**. |
| `content/_LIEN-KET-CHEO/web-foundations.md` | Bảng liên kết chéo hai chiều (FER202, PRJ301, react, testing, git, nodejs, nextjs…). |

## 2. Khung một bài nâng cấp (15–35k ký tự kể cả lời giảng slide)

`content` theo thứ tự:
1. `${G}` = `walkWf('wf-N-M', 'Tên EN', 'Tên VI', [[n, 'Slide title', '<p>EN</p>', '<p>VI</p>'], …])` — 8–11 slide, lời giảng 40–70 từ/slide.
2. `<div class="ml-en">`: `span.eyebrow` → `h2` → `p.lead` (**học xong làm được gì + vì sao cần**) → các mục `h3` dễ hiểu dần
   → ít nhất **một sơ đồ** `div.lz-flow` / `div.lz-stack` / `div.lz-map` → mã `ma()` + output `ra()` chạy thật
   → **≥ 2 bẫy** `div.pitfall.co-tieu-de` (`<p><strong>Trap — …</strong> …</p>`) → bảng "khi nào dùng gì" nếu có
   → **🧪 Practice** trong `div.callout.ok` (đề + gợi ý + **Done when**) → **🗂 Key terms (EN–VI)** `div.kv-grid`
   → **📌 Summary** (`ul`) → thẻ nguồn `nguon()` + liên kết chéo `lienKet()`. `</div>`
3. `<div class="ml-vi">` — bản Việt đầy đủ, cùng mã/output.

### Luật chữ trong template literal (bộ kiểm `scripts/course-content-check.mjs` bắt)
- Trong thân `` `...` ``: **không backtick, không `\`**, `${` chỉ cho nội suy thật. Mã có backtick/`${}` ⇒ đặt trong `_demo/` và chèn bằng
  `${ma('javascript', CODE['11-1/dem.js'])}` (tự thoát HTML).
- HTML: `<` `>` `&` trong chữ thường ⇒ `&lt;` `&gt;` `&amp;`.

## 3. Slide

- Dựng: `node scripts/_render-slides.mjs --deck scripts/slides-src/wf-11-1.mjs --out <SCRATCH>/wf-slides`
- Kiểm: `node scripts/_api-kiem-slide.mjs scripts/slides-src/wf-11-1.mjs` ⇒ **0 slide cần xem** (không tràn, dùng ≥ 70% khung).
- Soát mắt: `node scripts/tst/ghep-anh.mjs <SCRATCH>/wf-slides/wf-11-1 <SCRATCH>/ghep` rồi MỞ ẢNH RA NHÌN.
- Đẩy: `node --env-file=.env scripts/upload-academy-slides.mjs --dir <SCRATCH>/wf-slides --prefix WF/v1 --decks wf-11-1,…`
  ⇒ `images/academy/WF/v1/<deck>/<NNN>.webp`. **Không GET URL media.cuongthai.com trước khi đẩy** (Cloudflare nhớ 404).
  Dựng lại deck đã đẩy ⇒ prefix mới (`WF/v2`) + ghi vào `VER` trong `_slides.mjs`, không ghi đè.

## 4. Code Lab (`web-foundations-practice`)

- Nguồn `content/codelab/web-foundations-practice/nguon/<slug-bài>.mjs` (lược đồ `_luoc-do.mjs`), 6–8 đề/module, EASY → MEDIUM → HARD.
- Mới từ 01/11: `kiem[].moTa` viết `"EN|||VI"`.
- Xuất: `node scripts/codelab-kiem-de-web.mjs --xuat` · Kiểm máy chấm thật: `npx tsx scripts/codelab-kiem-cham-trinh-duyet.mjs --track web-foundations-practice` ⇒ 100%.

## 5. Kiểm trước commit

```bash
node scripts/course-content-check.mjs ./content/courses/web-foundations.mjs   # 0 lỗi
node scripts/course-depth-audit.mjs ./content/courses/web-foundations.mjs     # MỎNG giảm dần → 0
```
Commit theo nhóm chương bằng index riêng (`GIT_INDEX_FILE=$(mktemp)`), không Co-Authored-By, không push/deploy.

## 6. Tiến độ (cập nhật cuối mỗi đợt)

| Đợt | Bài | Trạng thái |
|---|---|---|
| Ch11 | 11.1–11.5 | ✅ 01/11 — bài 32–38k chữ, deck wf-11-1…5 (63 slide, WF/v1), Code Lab 5 module × 6 đề (máy chấm trình duyệt 170/170) |
| Ch12 | 12.1–12.4 | ✅ 01/11 — bài 34–36k chữ, ảnh chụp thật trong deck wf-12-1…4 (46 slide, WF/v1), Code Lab 4 module × 6 đề (dom + 2 js; kiểm `chiTrinhDuyet` cho var/@layer), máy chấm trình duyệt 194/194 |
| Ch13 | 13.1–13.4 | ✅ 01/11 — bài 28–33k chữ; dự án Vitest `_demo/_t13` (Vitest 5.0.5, jsdom 30.1.3, Testing Library 10.4.2, user-event 14.6.8, Node 22.23.3, actionlint) chạy thật, output ở `_t13/out/`; deck wf-13-1…4 (47 slide); Code Lab 4 module × 6 đề (js + dom), máy chấm trình duyệt 218/218 |
| Ch14 | 14.1–14.4 | ✅ 01/11 — bài 25–35k chữ; dự án Vite `_demo/_t14` (Vite 8.3.5, Node 22.23.3, Lighthouse 13.6.0) dựng/đo thật: dev 6 req/224,9 KB vs build 3 req/1,4 KB, lộ VITE_ trong bundle, fail-fast config, lịch sử git giữ bí mật, máy chủ tĩnh + SPA fallback + smoke-test, 3 phiên bản trang đo LCP/CLS/TBT; deck wf-14-1…4 (44 slide); Code Lab 4 module (6+6+6+7 đề, js), máy chấm trình duyệt 243/243 · 1440 kiểm |
| Ch1 | 1.2, 1.4 | ✅ 01/11 — bài 1.2 VS Code (40,6k chữ) + 1.4 GitHub (41,9k chữ), giữ video YouTube cũ; demo `_demo/_t1/vscode` (Prettier 3.9.10, ESLint 10.14.0, TypeScript 5.9.3 cho F2) và `_demo/_t1/github` (`sim.sh`: kho trần đóng vai github.com, git 2.51.1; `ssh.sh`: khoá tạo trong thư mục tạm rồi xoá); deck wf-1-2, wf-1-4 (22 slide, WF/v1). ⏳ CHƯA có Code Lab cho 1.2/1.4 |
| Mục 0 | 0.1–0.4 | ✅ 02/11 — bài 30–36k chữ, tệp `s00/`; demo `_demo/0-1`, `0-2`, `0-4`, `_t0` (`chay-web.sh`, `chay-may.sh`: máy chủ Node + curl + dig + kiem-may.mjs); deck wf-0-1…4 (41 slide) |
| Ch2 | 2.1–2.5 | ✅ 02/11 — bài 29–33k chữ, tệp `s02/`; demo `_demo/2-1…2-5`, `_t2/chay.mjs` (ariaSnapshot, phím Tab thật, form tới máy chủ thật, ảnh chậm 1 s); deck wf-2-1…5 (52 slide); Code Lab giữ nguyên 7 đề/bài |
| Ch3 | 3.1–3.5 | ✅ 02/11 — bài 23–33k chữ, tệp `s03/`; demo `_demo/3-1…3-5`, `_t3/chay.mjs` (phím Tab với order, iPhone 13 giả lập, ba bề rộng); deck wf-3-1…5 (51 slide); Code Lab giữ nguyên 7 đề/bài |
| Ch4 | 4.1–4.5 | ✅ 02/11 — bài 24–36k chữ, tệp `s04/`; demo `_demo/4-1…4-5` (34 tệp, gồm XSS đo thật và app todo có ảnh); deck wf-4-1…5 (47 slide); Code Lab giữ nguyên 7 đề/bài |
| Ch5 | 5.1–5.5 | ✅ 02/11 — bài 24–29k chữ, tệp `s05/`; demo `_demo/5-1…5-5`, `_t5/api.mjs` + `_t5/chay.mjs` (API Node thật: POST 201/400, timeout; module mở bằng file:// bị CORS chặn); deck wf-5-1…5 (46 slide). ⚠️ Demo đo thời gian (5-1/chan, dong-bang; 5-2/ket-hop; 5-3) cho số hơi khác mỗi lần chạy — chạy lại thì soát chữ bài khớp output. JS demo cần chờ lâu: dòng đầu `// cho: 1500` (chay-demo đọc, sinh-ma bỏ dòng đó) |
| Ch6 | 6.1–6.5 | ✅ 02/11 — bài 27–43k chữ, tệp `s06/`; API Node không thư viện `_demo/_t6/server.mjs` (cổng 3456) + `_t6/chay.sh` (curl: 14 mã, PUT/PATCH, ETag/304, CSV, query, limit=abc) + `_t6/chay.mjs` (Chromium: prefetch tự gọi GET-xoá, form method="put"→GET, fetch theo từng mã, CDP: 304 mà JS thấy 200, form GET) + `_t6/raw.mjs` + `_t6/idor.mjs`; demo `6-1/url.js`, `6-3/thong-bao.html`, `6-4/json.js`, `6-5/tham-so.js`; deck wf-6-1…5 (46 slide). **Code Lab MỚI**: 5 module wf-6-1…5 (34 đề, loại js, có fetchGia ở 6.3). Chạy lại `_t6/chay.sh` là chạy lại CẢ khối (id/ETag phụ thuộc thứ tự lệnh) — soát chữ bài nếu đổi thứ tự |
| Ch7 | 7.1–7.5 | ✅ 02/11 — bài 25–37k chữ, tệp `s07/`; app Node không thư viện `_demo/_t7/app.mjs` (phiên cookie, scrypt, cổng 3457; `COOKIE_SAMESITE=None` cho demo CSRF) + `_t7/chay.sh` (curl: HTTP quên bạn, Basic=base64, 401/403, đăng xuất ⇒ cookie cũ 401) + `_t7/chay.mjs` (Chromium: HttpOnly vs localStorage, CSRF Lax chặn/None chuyển tiền, CORS: request vẫn tới máy chủ, preflight, * + credentials) + `_t7/jwt-tay.mjs` (đồng hồ cố định, jsonwebtoken ra cùng chuỗi) + `_t7/mat-khau.mjs` (bcryptjs, số đo thay đổi mỗi lần chạy — bài ghi "~") + `_t7/https.sh` (mạng thật: example.com, badssl.com); deck wf-7-1…5 (47 slide). **Code Lab MỚI** 5 module wf-7-1…5 (31 đề; 7.3/7.4 cho sẵn hàm Base64URL / hash đồ chơi vì máy chấm không có crypto). ⚠️ gitleaks bắt `curl -u user:pass` và `Bearer user-token` trong mã demo ⇒ viết qua biến (`CREDS`, `AUTH_USER`) |
| Ch8 | 8.1–8.5 | ✅ 02/11 — bài 25–33k chữ, tệp `s08/`; CSDL mẫu `_demo/_t8/blog.sql` (users/posts/comments) + `_t8/chay.sh` (sqlite3 3.54 qua stdin: ràng buộc, SELECT/NULL/GROUP BY, chỉ mục 300 000 dòng SCAN→SEARCH ~22→6 ms — số đo đổi mỗi lần chạy, bài ghi "khoảng"; RETURNING, UPDATE thiếu WHERE, chuyển tiền (a)/(b)/(c) — (b) BEGIN…COMMIT chạy tiếp sau lỗi VẪN commit nửa đầu; JOIN, CASCADE, chặn xoá) + `nhieu-nhieu.sh` + Node 22.23 `node:sqlite`: `json-vs-db.mjs` (mất ~½ lượt thích + đọc tệp ghi dở), `injection.mjs`, `n-plus-1.mjs`; `_t8/prisma/chay-prisma.sh` chạy Prisma 5.22 của repo trên SQLite trong thư mục TẠM (client sinh ra ở tạm, symlink node_modules — KHÔNG đụng node_modules/.prisma của repo) + `check.ts` (tsc bắt lỗi). Deck wf-8-1…5 (45 slide); `_wf-bai.mjs` thêm `sqlm`. **Code Lab MỚI** 5 module wf-8-1…5 (30 đề, js — mô phỏng CSDL bằng JS). ⚠️ chạy lại `chay.sh` ⇒ số đo chỉ mục đổi: soát lại 8.2 |
| Ch9 | 9.1–9.5 | ✅ 02/11 — bài 25,5–28,6k chữ, tệp `s09/`; demo `_demo/_t9/chay.sh` (tsc 5.9 của repo `--noEmit --strict` + `--declaration`, Node 22.23 `--experimental-strip-types`, tsx, zod): giỏ hàng "5000" JS vs TS, 5 lỗi thường ngày, kiểu bị xoá (runtime.ts sập), suy kiểu, any vs unknown, 5 lỗi hình dạng, kiểu API Chương 6, union `kind` + `never`, 5 lỗi hàm, generic giữ kiểu + 3 lỗi generic, legacy.ts 0 lỗi (strict tắt) → 7 lỗi, dự án `shop/` tsconfig → dist → node (thiếu DATABASE_URL hỏng sớm), thiếu @types/node, enum bị Node từ chối/tsx chạy, zod safeParse. Deck wf-9-1…5 (45 slide). **Code Lab MỚI** 5 module wf-9-1…5 (30 đề, js — phần lúc chạy của khái niệm kiểu). Bài kiểm tra Ch9 trỏ bộ đề chương + track TypeScript |


## ✅ HOÀN TẤT ĐỢT NÂNG CẤP 02/11/2026

- Code Lab Ch1: `nguon/wf-1-2-vscode.mjs` (Ctrl+/, Alt+↑↓, Ctrl+D, Ctrl+P fuzzy, JSONC, đổi tên định danh) và
  `nguon/wf-1-4-github.mjs` (URL remote, status -sb, ahead/behind, kết quả push, lint commit, .gitignore) — 12 đề;
  máy chấm trình duyệt toàn track 255/255 đề · 1476 kiểm.
- 15 bài slide x.0: lời giảng EN/VI dưới từng slide — `_giang/<deck>.mjs` (191 slide) + `galleryGiang()` trong `_slides.mjs`.
  Sửa một deck chương ⇒ sửa lời giảng tương ứng (galleryGiang ném lỗi nếu số lời giảng ≠ `DECKS[deck].total`).
- 14 bài quiz: tờ ôn — `_on-tap/<slug-quiz>.mjs` (bai / bay / hoi) + `onTapBai(slug)` chèn cuối content.
- Liên kết chéo: `content/_LIEN-KET-CHEO/web-foundations.md` (44 cặp) — thẻ ngược chèn bằng `scripts/wf/the-nguoc.py`.
- Đo cuối: `scripts/wf/do-bai.mjs` ⇒ **0 bài mỏng** (chữ < 6000); content-check 0 lỗi.

## Còn có thể làm tiếp (không chặn)
- Ch2–Ch10: bài nội dung 6–10k chữ (không "mỏng" theo ngưỡng 6000 nhưng dưới khung 15–35k của bài nâng cấp) — nâng như Ch11–14
  (demo chạy thật trong `_demo/`, deck bài `wf-N-M`, Code Lab theo bài) khi có thời gian; mỗi bài nâng xong thêm lienKet + hàng vào bảng liên kết chéo.
- Bài nâng cấp đo 36–42k chữ (gộp EN+VI + lời giảng slide; mỗi ngôn ngữ ~20k) — chấp nhận, ghi lại để không ai "cắt cho vừa".
