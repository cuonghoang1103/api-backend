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


## ⏸ ĐIỂM DỪNG 01/11 (tối) — việc còn lại, theo thứ tự

1. **Code Lab Ch1** (`nguon/wf-1-2-vscode.mjs`, `nguon/wf-1-4-github.mjs`, loại `js`, 6 đề/module). Ý tưởng đã chốt:
   - 1.2: khớp tên file kiểu Ctrl+P (fuzzy + xếp hạng), bật/tắt chú thích dòng (Ctrl+/), dời dòng (Alt+↑↓), chọn lần xuất hiện kế (Ctrl+D),
     đổi tên định danh bỏ qua chuỗi/chú thích, đọc JSONC (settings.json: bỏ chú thích + dấu phẩy cuối).
   - 1.4: tách URL remote HTTPS/SSH → {host, owner, repo}; đếm ahead/behind từ hai danh sách commit; quyết định push
     (up-to-date / fast-forward / rejected fetch first); khớp mẫu .gitignore (`dir/`, `*.log`, `!keep.log`, `.env*`); kiểm lời nhắn commit.
   - Rồi `node scripts/codelab-kiem-de-web.mjs --xuat` + `npx tsx scripts/codelab-kiem-cham-trinh-duyet.mjs --track web-foundations-practice` (đang 243/243 · 1440 kiểm).
   - Bài 1.2 và 1.4 đã hứa "Code Lab module 1.2/1.4" trong phần Luyện tập.
2. **15 bài slide x.0** (chữ < 6000): thêm lời giảng từng slide (đọc deck chương `scripts/slides-src/wf-*.mjs` tương ứng) cho đủ ≥ 6000 chữ.
3. **14 bài quiz**: thêm tờ ôn tập (tóm tắt chương + câu hỏi tự kiểm có đáp án gập) cho đủ ≥ 6000 chữ.
4. **Liên kết chéo**: tạo `content/_LIEN-KET-CHEO/web-foundations.md` (bảng mọi lienKet() đã đặt trong Ch1, Ch11–14) và thêm thẻ chiều ngược
   ở bài đích (git 14.1/5.1/5.2/6.1/15.1, nextjs 20.1, deploy-vps 1.3, react, testing…) — kiểm `git status` + đầu file
   "FILE SINH TỰ ĐỘNG" trước khi sửa (academy ⇒ sửa ở flm-nguon).
5. Kiểm cuối: `node scripts/course-content-check.mjs ./content/courses/web-foundations.mjs` (0 lỗi), `node scripts/wf/do-bai.mjs` (đang 29 bài mỏng = 15 slide + 14 quiz).

Ghi chú: bài nâng cấp hơi vượt 35k chữ (đo gộp EN+VI + lời giảng slide; mỗi ngôn ngữ ~20k).
