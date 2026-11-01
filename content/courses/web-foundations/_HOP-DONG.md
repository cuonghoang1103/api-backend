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
