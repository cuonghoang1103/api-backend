# Hợp đồng soạn khoá "API & System Design" (/courses/api-design)

> Đọc HẾT tệp này trước khi sửa một dòng. Đợt mẫu (Mục 0 + Chương 1) đã được điều phối duyệt 01/11/2026 — commit `dd95fa51e`. Chương 2 soạn 01/11/2026 (`s02-loi-phan-hoi.mjs`).
> Chỗ nào tệp này không nói: bắt chước đúng `s01-tai-nguyen.mjs` + deck `scripts/slides-src/api-01-*.mjs`.

## 1. Người học và giọng văn

- Sinh viên SE FPT kỳ 5, chuyên ngành hẹp Node.js (SDN302), học thêm Spring Boot; mục tiêu backend đi làm + đồ án **LabFlow AI**.
- Yếu tiếng Anh ⇒ khối VI giảng tiếng Việt, **thuật ngữ Anh lần đầu luôn kèm nghĩa Việt trong ngoặc**; khối EN song song đầy đủ ý (không rút gọn).
- DỄ HIỂU là ưu tiên 1: ví dụ đời thường TRƯỚC, định nghĩa SAU; từng bước; bẫy có thật; khoá **tự đủ** (khái niệm nào dùng cũng phải đã dạy hoặc dạy tại chỗ).
- Không bịa số liệu, sự cố, trích dẫn. Sự cố/lịch sử: kiểm nguồn (WebFetch) + link; tình huống sinh viên ghi rõ "minh hoạ".

## 2. Cấu trúc tệp

```
content/courses/api-design.mjs          # manifest: [s00, s01, …, ...khung('api', […]).slice(N)]
content/courses/api-design/
├── _HOP-DONG.md                        # tệp này
├── _slides.mjs                         # walkApi(), slide(), img(), VER (phiên bản prefix R2 theo deck)
├── giang/api-NN-M.mjs                  # giảng EN/VI dưới từng slide: walkApi(deck, tenEn, tenVi, [[n, title, en, vi]…])
├── s00-intro.mjs                       # Mục 0
├── s01-tai-nguyen.mjs                  # Chương 1
├── s02-loi-phan-hoi.mjs                # Chương 2
└── sNN-<ten>.mjs                       # chương mới: thay phần tử khung tương ứng trong manifest
scripts/slides-src/_api-chung.mjs       # khuôn slide (KHÔNG đổi mặc định; chỉ thêm tuỳ chọn)
scripts/slides-src/api-NN-M.mjs         # deck mỗi bài (NN đệm 2 chữ số: api-02-1); lab: api-lab-N
content/codelab/api-design-practice/    # Code Lab (mục 8)
content/_LIEN-KET-CHEO/sdn302-api-design.md   # bảng liên kết chéo (mục 7)
```

- **Thay chương khung**: tạo `sNN-*.mjs`, import vào manifest, đổi `.slice(N)` để bỏ phần tử khung đã thay. **GIỮ `title` chương** đúng như khung (seeder neo chương bằng title) và **GIỮ slug bài cũ** (`api-N-M-<ten>` do `khung()` sinh). Bài mới: slug `api-N-K-<ten>` với K chưa dùng (lab `api-N-5-lab`, quiz `api-N-6-quiz` khi chương có 4 bài).
- `title` bài: `'N.M — English|||N.M — Tiếng Việt'` ≤ 255 ký tự; `description` 1 câu tiếng Việt; `isFreePreview: true`.
- Thứ tự trong chương: 4 bài dạy → lab (`type: 'LESSON'`) → quiz (`type: 'QUIZ'`). `syncOrder: true` đánh số theo thứ tự tệp.

## 3. Khung một bài dạy (đúng thứ tự)

`content: \`${GNNM}` + khối `<div class="ml-en">…</div>` + khối `<div class="ml-vi">…</div>`. Trong mỗi khối:

1. `eyebrow` (`Chapter N · Lesson N.M`) + `h2` + `lead` (vì sao bài này quan trọng).
2. Thân bài: các `h3`, mỗi ý có **lệnh thật + output thật** (`<pre><code class="language-bash">` rồi `<div class="out">`), bảng, `.lz-flow`, `.callout ok|warn`, `.pitfall`.
3. "In interviews / at work" (`h3`) — 2–4 câu hỏi phỏng vấn hay gặp + câu trả lời ngắn.
4. `<h3>🧪 Practice (15–20 min)</h3>` / `<h3>🧪 Thực hành (15–20 phút)</h3>` — `<div class="callout ok"><ol>…</ol><p><strong>Done when:</strong> … / <strong>Đạt khi:</strong> …</p></div>`, tình huống LabFlow thật, kiểm được.
5. `<h3>🗂 Key terms</h3>` / `<h3>🗂 Thuật ngữ trong bài</h3>` — `.kv-grid` 6–8 mục; VI: `Thuật ngữ (nghĩa Việt)` → 1 câu.
6. `<h3>📌 Summary</h3>` / `<h3>📌 Tóm tắt</h3>` — 5–6 ý.
7. Thẻ liên kết chéo (nếu có) đặt CUỐI khối (mục 7).

Độ dài đợt mẫu (chữ thuần, gồm giảng slide): bài dạy 20–29k ký tự mỗi ngôn ngữ; lab ~15k; bài "Bắt đầu" ~20k.

**Thoát ký tự trong template literal** (bộ kiểm chặn): `<` `>` `&` → `&lt;` `&gt;` `&amp;` trong code/output; backtick → `&#96;`; `${` → `\${`;
`\"` trong output JSON → viết `\\"`; regex `\d` → `\\d`; dấu `\` nối dòng shell → `\\`. Chuỗi JS nháy đơn (title/quiz): không `\'`, dùng `’` hoặc nháy kép.
KHÔNG `<svg>`/script/style/details trong nội dung bài — hình đi qua slide.

## 4. Slide (khuôn `_api-chung.mjs`)

- Chép dáng khoá PostgreSQL (khuôn chuẩn chủ kênh chốt 25/10): nền trắng, tiêu đề xám #404040 căn giữa, dải chân cam–nâu, logo **CuongThai.com**, KHÔNG FPT. **Nội dung slide FULL TIẾNG ANH.**
- Import: `lamDeck, sql, http, req, run, tbl, two, three, box, steps, cards, kw, flow, vsd, c, cap, psql, sh`.
  - `http(text, { sm, wrap, title, hl })` — terminal tô màu output `curl -i / -v` / HTTPie (dòng `$ `, dòng trạng thái theo họ mã, tên header). `wrap: true` cho dòng dài (như terminal thật).
  - `req([[dòng thô, chú thích HTML]…])` — giải phẫu request/response.
  - `sql(src, { lang: 'javascript' | 'json' | 'bash' | 'plaintext' | 'http' | 'powershell', sm, hl })` — khối mã Dark+.
  - `two(a, b, 'r46'|'r64'|'r37'|'r73')` (mỗi cột tự bọc `<div>`), `vsd(sai, dung, nhãnSai, nhãnĐúng)`, `box(h, html, 'xanh'|'do2'|'lam'|'')`.
  - Bảng: `<table class="t">` (19–21px) hoặc `class="t lon"` (22px).
- Một deck mỗi bài, 14–17 slide: bìa → mục tiêu → ví dụ đời thường → khái niệm + lệnh/output thật → hình/so sánh → bẫy (`vsd`) → phỏng vấn/bảng tra → tóm tắt + "Next". Lab: 8 slide (yêu cầu, Part A/B/C, rubric, nộp bài).
- Slide ít chữ: `{ to: true }` (28px) và/hoặc `{ giua: true }`. Mã ≤ ~14 dòng; dòng dài thì tách bằng `\\` hoặc `wrap`.
- **Output trên slide = output thật** (được cắt bớt bằng `…`, không sửa chữ).
- **Phép kiểm TỰ ĐỘNG bắt buộc** (yêu cầu điều phối 31/10): mọi slide — phần tử pre/table/code/.term có `scrollWidth > clientWidth` ⇒ TRÀN; vùng nội dung < 70% chiều cao khung ⇒ TRỐNG. Bộ đo: `node scripts/_api-kiem-slide.mjs scripts/slides-src/<deck>.mjs` — đo trong Playwright `.pg .nd` (`scrollHeight`, bounding box con cuối, `scrollWidth` của PRE/TABLE/TD/CODE/.vs/.term). Phải 0 slide cần xem rồi mới upload; ghi số slide đã sửa vào báo cáo. ⚠ Bộ đo KHÔNG thấy tràn dọc bị cắt bên trong `.apireq` (req()) — đợt Ch2 một slide req() 12 dòng bị cắt mất nửa mà vẫn "0 slide cần xem" ⇒ luôn XEM ẢNH, và tránh req() quá 8 dòng (dùng http() + bảng chú thích).
- ⚠ Tự động chèn cờ `giua/to` bằng regex `\n  \{ ` từng chèn nhầm vào dòng mã `{ id: 'lab_1'…` trong template ⇒ sau mỗi lần sửa tự động: `grep -n "{ giua: true, \|{ to: true, " scripts/slides-src/api-*.mjs | grep -v "t: '\|cover\|nhan"` phải rỗng.
- Render + XEM ẢNH: `node scripts/_render-slides.mjs --deck scripts/slides-src/api-NN-M.mjs --out <dir>`; ghép 4 ảnh `node scripts/_api-ghep-slide.mjs <dir>/<deck> 1 2 3 4` rồi Read từng tấm.
- Upload: `node --env-file=.env scripts/upload-academy-slides.mjs --dir <dir> --prefix API/v1 --decks api-NN-M` ⇒ `images/academy/API/v1/<deck>/<NNN>.webp`. **KHÔNG GET URL media.cuongthai.com trước khi upload** (Cloudflare cache 404). Dựng lại deck đã upload ⇒ prefix mới `API/v2` + ghi vào `VER` trong `_slides.mjs` (hiện: `{ 'api-01-3': 'v2', 'api-02-3': 'v2' }`). Không sửa `_render-slides.mjs`, `_cs-chung.mjs`, `_pg-chung.mjs`.
- Giảng `giang/api-NN-M.mjs`: phủ ĐỦ mọi slide đúng thứ tự (walkApi tự kiểm); EN dịch sát ý VI; VI giải nghĩa thuật ngữ. Kiểm số slide = số dòng giảng.

## 5. Dự án xuyên khoá: LabFlow API

- Node **22** (máy có `~/.nvm/versions/node/v22.23.3/bin`; node mặc định là 26 — luôn `export PATH=$HOME/.nvm/versions/node/v22.23.3/bin:$PATH`), Express **5.3.0**, curl 8.7.1, HTTPie 3.2.4, macOS. Cổng 4000 (LabFlow), 4001 (echo.mjs), 4002–4006 thí nghiệm phụ.
- Mã cuối Chương 1 (tham chiếu): `src/{server,app,db,http,auth}.js`, `src/routes/{labs,devices,bookings}.js` — toàn văn trong bài 1.1–1.4 (+ lời giải lab `routes/issues.js` ở bài 1.5). Đợt mẫu dựng ở scratchpad `apid/labflow-api` (KHÔNG trong repo). Agent sau: dựng lại từ các khối mã trong bài (đã kiểm: ghép khối mã bài 1.1 chạy đúng output) rồi thêm phần chương mình.
- Dữ liệu mẫu cố định: labs `lab_1..lab_4` (lab_4 `retiredAt`), devices `dev_1..dev_3`, users `usr_1` An (STUDENT) · `usr_2` Bình (STUDENT) · `usr_3` Cô Lan (LAB_MANAGER); token GIẢ `tok_an`, `tok_bin`, `tok_lan` (KHÔNG dùng tên token entropy cao — gitleaks rule `curl-auth-header` chặn commit, vd `tok_binh` từng bị chặn). Id chuỗi có tiền tố (`lab_`, `dev_`, `bk_`, `iss_`), giờ UTC `Z`.
- **Từ Chương 2** (mã cuối chương = lời giải Lab 2, bài 2.5): lỗi RFC 9457 `application/problem+json` (`type` = `https://labflow.example/problems/<code-kebab>`, `title`, `status`, `detail`, `instance` = path, mở rộng `code`, `errors[{pointer|parameter, detail}]`, `conflictWith`/`existing`…) do `src/problems.js › sendProblem` sinh; `new HttpError(status, CODE, params, more)` — câu chữ vi/en ở `src/messages.js`, chọn theo `Accept-Language` (`src/i18n.js`, mặc định vi, kèm `Content-Language` + `Vary`). Kiểm dữ liệu: Zod 4 `src/schemas.js` (strictObject, `text()` = trim + NFC) + `src/validate.js` (`req.valid.body/query`; Express 5 `req.query` chỉ đọc). Cửa: 415 nếu body không phải JSON, `express.json` limit 10kb ⇒ 413. Response qua `src/views.js` (allow-list, trường tuỳ chọn luôn có, rỗng = null; danh sách `{ data: [...] }`). `GET /me`. JSON thụt lề trừ `NODE_ENV=production`. Chương sau dùng đúng các tệp này, không tạo hình dạng lỗi/response thứ hai.
- Mỗi lần chạy: khởi động lại server (dữ liệu RAM về đầu) để id/ETag tái lập được; chép output nguyên văn (Date/ETag là của lần chạy).
- Lộ trình mã: Ch2 lỗi RFC 9457 + validate (Zod hoặc tự viết) · Ch3 phân trang/lọc · Ch4 version · Ch5 idempotency/rate limit · Ch6 auth thật · Ch7 OpenAPI · Ch12 PostgreSQL.

## 6. Quiz chương

- `type: 'QUIZ'`, slug `api-N-6-quiz` (hoặc số kế tiếp), `content` = 2 khối (eyebrow, h2, lead, "Self-check before you start" 6 dòng).
- `quiz: { timeLimitSeconds: 900, questions: [10 câu] }`; mỗi câu `{ question: 'EN|||VI', options: ['EN|||VI' ×4], correctIndex, points: 1, explanation: 'EN: …|||VI: …' }`.
- Câu tình huống trên LabFlow; giải thích nói vì sao đúng + vì sao phương án hấp dẫn nhất sai + chỉ bài. Rải đáp án: mỗi vị trí A–D 2–3 lần. Phương án sai đồng dạng, độ dài tương đương.

## 7. Liên kết chéo Academy ↔ Courses

- Chỉ khi liên quan thật. Courses → Academy: `<a class="link-card lien-ket-cheo" href="/courses/<slug-khoá-Academy>/learn?lessonSlug=<slug>" target="_blank" rel="noopener">` với `lc-ico 🔗 / lc-title "You met this in SDN302 — lesson …" / lc-sub (Giống · Khác · Bài này thêm · chưa học vẫn tự đứng được) / lc-cta`, cuối `ml-en` và `ml-vi`.
- Academy → Courses (chiều ngược): "Go deeper in the API Design course (Courses) — lesson …" / "Học sâu hơn ở khoá API Design (Courses)…", cta `OPEN LESSON →` / `MỞ BÀI →`. Script mẫu: `<scratchpad>/apid/lkc.py`.
- Slug khoá Academy: SDN302 `server-side-development-nodejs-express-mongodb`, PRJ301 `java-web-application-development`, SWR302 `software-requirements`.
- Ghi mọi cặp vào `content/_LIEN-KET-CHEO/sdn302-api-design.md` (đã có cặp Mục 0/Ch1 + ứng viên cho Ch2–Ch6).

## 8. Code Lab (`content/codelab/api-design-practice/`)

- Theo `content/codelab/README.md`. Module slug = slug bài (nút "🏋️ Luyện tập"), `khoa: 'api-design'`, `baiHoc` = slug bài.
- Bộ dựng chung `nguon/_api.mjs` (chép `networking-practice/nguon/_net.mjs`): `cs()` trắc nghiệm/sắp thứ tự/bảng (xáo theo nội dung, không viết tay a/b/c/d), `jsBai()` bài viết hàm — `mongDoi` tính bằng chạy lời giải trong node:vm, tự kiểm code khởi đầu trượt ≥ 1, bắt buộc có kiểm ẩn.
- Mỗi module 3–5 đề EASY → HARD; bài lab chương 1 module `api-N-5-lab` (`dangBai: 'lab'`).
- Lệnh: `node content/codelab/api-design-practice/nguon/_dung-track.mjs` → `node scripts/codelab-xuat-de.mjs --track api-design-practice` → `npx tsx scripts/codelab-kiem-cham-trinh-duyet.mjs --track api-design-practice` (lời giải 100%, khởi đầu trượt ≥ 1) → `node scripts/codelab-kiem-noi-dung.mjs --track api-design-practice`.
- KHÔNG sửa `src/services/codeLab.practice.ts`; báo cáo 2 dòng cần thêm (`PRACTICE_TRACK_BY_COURSE['api-design'] = 'api-design-practice'` + mục `PRACTICE_CATALOG`).

## 9. Kiểm trước khi commit

```bash
node scripts/course-content-check.mjs ./content/courses/api-design.mjs          # 0 lỗi
node scripts/course-content-check.mjs ./content/courses/api-design/sNN-*.mjs     # quét cả giang/ (backslash, backtick)
gitleaks dir <tệp> --config .gitleaks.toml --no-banner                          # hook pre-commit dùng đúng lệnh này
```
Commit bằng index riêng (nhiều phiên chung repo): `export GIT_INDEX_FILE=$(mktemp); git read-tree HEAD; git add <tệp của mình>; git commit …; unset GIT_INDEX_FILE; git reset -q HEAD -- <đúng tệp đó>` — chạy trong `bash -c` (zsh không tách từ biến). Không Co-Authored-By, không push, không deploy, không `--no-verify`.
