# Hợp đồng soạn khoá "API & System Design" (/courses/api-design)

> Đọc HẾT tệp này trước khi sửa một dòng. Đợt mẫu (Mục 0 + Chương 1) đã được điều phối duyệt 01/11/2026 — commit `dd95fa51e`. Chương 2 soạn 01/11/2026 (`s02-loi-phan-hoi.mjs`), Chương 3, 4, 5, 6 cùng ngày (`s03-danh-sach.mjs`, `s04-phien-ban.mjs`, `s05-tin-cay.mjs`, `s06-bao-mat.mjs`). Từ Ch5: mỗi bài 25–40k ký tự (kể cả giảng), tách bài nếu dài hơn.
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
├── s03-danh-sach.mjs                   # Chương 3 (phân trang/lọc/sắp; số đo PostgreSQL)
├── s04-phien-ban.mjs                   # Chương 4 (phiên bản, khai tử, app không cập nhật)
├── s05-tin-cay.mjs                     # Chương 5 (idempotency, thử lại, giới hạn tần suất, ETag)
├── s06-bao-mat.mjs                     # Chương 6 (xác thực JWT, BOLA, OWASP API Top 10, CORS/CSRF)
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
  - `http(text, { sm, wrap, title, hl })` — terminal tô màu output `curl -i / -v` / HTTPie (dòng `$ `, dòng trạng thái theo họ mã, tên header). `wrap: true` cho dòng dài (như terminal thật); `wrap: 'any'` bẻ cả chuỗi dài không dấu cách (JSON, token) — dùng từ Ch6 khi cột hẹp bị lấn phải.
  - `req([[dòng thô, chú thích HTML]…])` — giải phẫu request/response.
  - `sql(src, { lang: 'javascript' | 'json' | 'bash' | 'plaintext' | 'http' | 'powershell', sm, hl })` — khối mã Dark+.
  - `two(a, b, 'r46'|'r64'|'r37'|'r73')` (mỗi cột tự bọc `<div>`), `vsd(sai, dung, nhãnSai, nhãnĐúng)`, `box(h, html, 'xanh'|'do2'|'lam'|'')`.
  - Bảng: `<table class="t">` (19–21px) hoặc `class="t lon"` (22px).
- Một deck mỗi bài, 14–17 slide: bìa → mục tiêu → ví dụ đời thường → khái niệm + lệnh/output thật → hình/so sánh → bẫy (`vsd`) → phỏng vấn/bảng tra → tóm tắt + "Next". Lab: 8 slide (yêu cầu, Part A/B/C, rubric, nộp bài).
- Slide ít chữ: `{ to: true }` (28px) và/hoặc `{ giua: true }`. Mã ≤ ~14 dòng; dòng dài thì tách bằng `\\` hoặc `wrap`.
- **Output trên slide = output thật** (được cắt bớt bằng `…`, không sửa chữ).
- **Phép kiểm TỰ ĐỘNG bắt buộc** (yêu cầu điều phối 31/10): mọi slide — phần tử pre/table/code/.term có `scrollWidth > clientWidth` ⇒ TRÀN; vùng nội dung < 70% chiều cao khung ⇒ TRỐNG. Bộ đo: `node scripts/_api-kiem-slide.mjs scripts/slides-src/<deck>.mjs` — đo trong Playwright `.pg .nd` (`scrollHeight`, bounding box con cuối, `scrollWidth` của PRE/TABLE/TD/CODE/.vs/.term). Phải 0 slide cần xem rồi mới upload; ghi số slide đã sửa vào báo cáo. Từ đợt Ch3 bộ đo còn báo `TRÀN DƯỚI Npx` (hộp con vượt đáy vùng nội dung) và `<tag.class> cắt dọc N` (mọi phần tử `overflow:hidden` có `scrollHeight > clientHeight + 8`) — lỗ hổng cũ: một req() 12 dòng bị cắt mất nửa trong `.apireq` mà vẫn "0 slide cần xem" (nay bộ đo bắt: `TRÀN DƯỚI 74px · div.apireq cắt dọc 86`). Vẫn luôn XEM ẢNH, và tránh req() quá 8 dòng.
- Chuỗi base64 dài KHÔNG xuống dòng trong `http()` ⇒ cắt bằng `…` (`eyJjcmVhdGVkQXQiOiIyMD…`), ghi trong slide là đã cắt.
- ⚠ Tự động chèn cờ `giua/to` bằng regex `\n  \{ ` từng chèn nhầm vào dòng mã `{ id: 'lab_1'…` trong template ⇒ sau mỗi lần sửa tự động: `grep -n "{ giua: true, \|{ to: true, " scripts/slides-src/api-*.mjs | grep -v "t: '\|cover\|nhan"` phải rỗng.
- Render + XEM ẢNH: `node scripts/_render-slides.mjs --deck scripts/slides-src/api-NN-M.mjs --out <dir>`; ghép 4 ảnh `node scripts/_api-ghep-slide.mjs <dir>/<deck> 1 2 3 4` rồi Read từng tấm.
- Upload: `node --env-file=.env scripts/upload-academy-slides.mjs --dir <dir> --prefix API/v1 --decks api-NN-M` ⇒ `images/academy/API/v1/<deck>/<NNN>.webp`. **KHÔNG GET URL media.cuongthai.com trước khi upload** (Cloudflare cache 404). Dựng lại deck đã upload ⇒ prefix mới `API/v2` + ghi vào `VER` trong `_slides.mjs` (hiện: `{ 'api-01-3': 'v2', 'api-02-3': 'v2', 'api-04-2': 'v2', 'api-05-1': 'v2' }`; gitleaks bắt UUID mẫu như khoá API ⇒ trên slide cắt bằng …). Không sửa `_render-slides.mjs`, `_cs-chung.mjs`, `_pg-chung.mjs`.
- Giảng `giang/api-NN-M.mjs`: phủ ĐỦ mọi slide đúng thứ tự (walkApi tự kiểm); EN dịch sát ý VI; VI giải nghĩa thuật ngữ. Kiểm số slide = số dòng giảng.

## 5. Dự án xuyên khoá: LabFlow API

- Node **22** (máy có `~/.nvm/versions/node/v22.23.3/bin`; node mặc định là 26 — luôn `export PATH=$HOME/.nvm/versions/node/v22.23.3/bin:$PATH`), Express **5.3.0**, curl 8.7.1, HTTPie 3.2.4, macOS. Cổng 4000 (LabFlow), 4001 (echo.mjs), 4002–4006 thí nghiệm phụ.
- Mã cuối Chương 1 (tham chiếu): `src/{server,app,db,http,auth}.js`, `src/routes/{labs,devices,bookings}.js` — toàn văn trong bài 1.1–1.4 (+ lời giải lab `routes/issues.js` ở bài 1.5). Đợt mẫu dựng ở scratchpad `apid/labflow-api` (KHÔNG trong repo). Agent sau: dựng lại từ các khối mã trong bài (đã kiểm: ghép khối mã bài 1.1 chạy đúng output) rồi thêm phần chương mình.
- Dữ liệu mẫu cố định: labs `lab_1..lab_4` (lab_4 `retiredAt`), devices `dev_1..dev_3`, users `usr_1` An (STUDENT) · `usr_2` Bình (STUDENT) · `usr_3` Cô Lan (LAB_MANAGER); token GIẢ `tok_an`, `tok_bin`, `tok_lan` (KHÔNG dùng tên token entropy cao — gitleaks rule `curl-auth-header` chặn commit, vd `tok_binh` từng bị chặn). Id chuỗi có tiền tố (`lab_`, `dev_`, `bk_`, `iss_`), giờ UTC `Z`.
- **Từ Chương 2** (mã cuối chương = lời giải Lab 2, bài 2.5): lỗi RFC 9457 `application/problem+json` (`type` = `https://labflow.example/problems/<code-kebab>`, `title`, `status`, `detail`, `instance` = path, mở rộng `code`, `errors[{pointer|parameter, detail}]`, `conflictWith`/`existing`…) do `src/problems.js › sendProblem` sinh; `new HttpError(status, CODE, params, more)` — câu chữ vi/en ở `src/messages.js`, chọn theo `Accept-Language` (`src/i18n.js`, mặc định vi, kèm `Content-Language` + `Vary`). Kiểm dữ liệu: Zod 4 `src/schemas.js` (strictObject, `text()` = trim + NFC) + `src/validate.js` (`req.valid.body/query`; Express 5 `req.query` chỉ đọc). Cửa: 415 nếu body không phải JSON, `express.json` limit 10kb ⇒ 413. Response qua `src/views.js` (allow-list, trường tuỳ chọn luôn có, rỗng = null; danh sách `{ data: [...] }`). `GET /me`. JSON thụt lề trừ `NODE_ENV=production`. Chương sau dùng đúng các tệp này, không tạo hình dạng lỗi/response thứ hai.
- Mỗi lần chạy: khởi động lại server (dữ liệu RAM về đầu) để id/ETag tái lập được; chép output nguyên văn (Date/ETag là của lần chạy).
- **Từ Chương 3** (mã cuối chương = lời giải Lab 3, bài 3.5): `SEED_BOOKINGS=200 SEED_ISSUES=60` nạp dữ liệu cố định (`src/seed.js`); `src/paging.js` (`idNum`, `orderBy(sort, ranks)` luôn có id làm khoá phụ cùng chiều, `fingerprint` sha256 8 hex của bộ lọc + sort, `encodeCursor/decodeCursor` base64url `{ v, id, f }` ⇒ 400 `INVALID_CURSOR` / `CURSOR_MISMATCH`); `GET /bookings` có `limit` 1–100 (mặc định 20), `cursor`, `labId`, `status` (danh sách phẩy), `from`/`to` (CHỒNG LÊN `[from, to)`, refine `TO_AFTER_FROM` dịch qua `RULE_TEXT`), `q` (fold), `sort`, `fields`, `include=lab`; `Link: rel="next"` + `page: { limit, next }` (không còn `offset`/`total`). `GET /issues` tương tự (sort `-severity` theo thứ hạng, `include=device`). Lỗi query = 400 `INVALID_QUERY` kèm `errors[{parameter, detail}]`.
- **Từ Chương 4** (mã cuối chương = lời giải Lab 4, bài 4.5): MỘT router `api` gắn ở `/v1` và `/v2` (`src/versioning.js › inVersion`, `req.apiVersion`, header `LabFlow-Version`); đường cũ không số (`/labs`, `/devices`, `/issues`, `/bookings`, `/me`) = v1 qua `fromHeader` (header `LabFlow-Version`, mặc định 1, kèm `Vary`) và ĐÃ KHAI TỬ bằng `src/deprecation.js › deprecate()` (Deprecation `@1793491200`, Sunset 2027-05-01, `Link rel="deprecation"` + `rel="successor-version"`, hết hạn ⇒ 410 `API_SUNSET`; đồng hồ giả `LABFLOW_NOW`); báo cáo `GET /v1/admin/deprecations`. View theo phiên bản: `views.js › VIEWS/viewsOf(req)` — v2: booking `period {start,end}` + `checkedInAt`, device `serialNumber`; v1 ánh xạ `CHECKED_IN` ⇒ `PENDING` (`v1Status`). Lược đồ: `validate(where, { 1: …, 2: … })`. `/v1/devices` khai tử riêng (Lab 4, sunset 2027-06-01). App: header `LabFlow-Client: android/1.4.0`, `GET /app-config` đứng TRƯỚC `appVersionGuard` (400 `APP_VERSION_UNSUPPORTED`). Check-in `POST /v2/bookings/:id/check-in` chỉ v2. Test hợp đồng `test/contract-v1.test.mjs` (`npm test` = `node --test --test-reporter=spec`). Chương sau thêm route mới vào `api` (không gắn thẳng vào `app`) và Location/Link dùng `req.baseUrl`.
- **Từ Chương 5** (mã cuối chương = lời giải Lab 5): `src/chaos.js` (CHỈ để học: `LABFLOW_DROP_FIRST`, `LABFLOW_SLOW_MS`/`_COUNT`, `LABFLOW_OUTAGE_MS` + `LABFLOW_CAPACITY` + `GET /chaos/arrivals`), `src/idempotency.js › idempotent()` (Idempotency-Key theo draft-08: 400/422/409 + Retry-After, theo người gọi, ghi khi kết nối đóng, chỉ phát lại 2xx, header `Idempotent-Replayed`), `src/rateLimit.js` (xô token, `RateLimit-Policy`/`RateLimit` draft-11, 429 + Retry-After; `bookingLimit` 5/60 s/người, `reportLimit` 3/60 s/người, `ipLimit` `LABFLOW_IP_LIMIT`), `app.set('trust proxy', LABFLOW_TRUST_PROXY)` (mặc định false) + `/debug/ip` khi `LABFLOW_DEBUG_IP`, `src/concurrency.js` (ETag mạnh `"<id>-v<version>"`, `checkIfMatch` ⇒ 412, `bump`) trên devices và issues. Client mẫu: `retry.mjs › fetchWithRetry`, `proxy.mjs` (8081/8082). If-Match và Idempotency-Key là TUỲ CHỌN trên endpoint cũ (bắt buộc = thay đổi phá vỡ).
- **Từ Chương 6** (mã cuối chương = lời giải Lab 6): `src/passwords.js` (scrypt + timingSafeEqual), `src/auth.js` (JWT HS256 tự dựng, TTL 900 s, `verifyJwt` từ chối alg≠HS256 / sai chữ ký / sai iss ⇒ 401 INVALID_TOKEN, hết hạn ⇒ 401 TOKEN_EXPIRED; `LABFLOW_JWT_SECRET` BẮT BUỘC khi `NODE_ENV=production`, dev mặc định `dev-only-secret-change-me`; API key `lf_live_…` lưu sha256, hiện một lần; token demo `tok_*` chỉ ngoài production và khi `LABFLOW_DEMO_TOKENS` ≠ 0), `routes/auth.js` (POST /v2/auth/login, `loginLimit` 5/900 s theo `ip|email`, một lỗi INVALID_CREDENTIALS cho mọi trường hợp + hash giả), `routes/me.js` (PATCH /me schema chặt chỉ `name`; POST/GET /me/api-keys), `src/policy.js` (`POLICIES`, `can`, `authorize` ⇒ 404; dùng ở GET /bookings/:id/receipt — GET /bookings/:id cũ GIỮ 403), giới hạn 3 booking còn hiệu lực/sinh viên ⇒ 422 TOO_MANY_ACTIVE_BOOKINGS, `src/safeFetch.js` (https, phân giải rồi chặn dải nội bộ ⇒ 422 URL_NOT_ALLOWED, `redirect: 'error'`; POST /devices/:id/manual cho quản lý), `src/cors.js` (allow-list `LABFLOW_CORS_ORIGINS`, mặc định http://localhost:5173, Vary: Origin, Expose-Headers, preflight 204, Max-Age 600), `LABFLOW_LOG` (log request). Mật khẩu demo: an-lab-2026 / binh-lab-2026 / lan-lab-2026. **`LABFLOW_VULN=1` (CHỈ để học, `src/vuln.js`)** mở lại: alg none + bỏ hạn, bỏ loginLimit, gán hàng loạt PATCH /me, BOLA biên nhận, safeFetch không chặn + theo chuyển hướng, CORS phản chiếu kèm credentials. Kịch bản: `forge.mjs`, `authz-matrix.mjs`, `audit.mjs` (OWASP), `test/security.test.mjs` (5 test), `web/` (trang :5173/:5174 + `browser.mjs` Playwright). Thứ tự chạy: ma trận TRƯỚC audit (audit cố ý khoá đăng nhập của Bình). Token/khoá trong output và slide phải cắt bằng `…` (gitleaks).
- Số đo PostgreSQL (Ch3): PG 18.4 riêng của phiên (`/opt/homebrew/opt/postgresql@18/bin`, cổng 55432, `unix_socket_directories=''`), bảng `bookings` 1 triệu dòng + index `(created_at DESC, id DESC)` và `(lab_id, start_at)`. Bảng số: OFFSET 0/100k/900k = 0,053/9,037/78,316 ms · count(*) 25,178 ms · keyset ở 900 000 = 0,064 ms · lọc lab_7 36,183 → 0,242 ms · N+1 21 truy vấn 2,16 ms vs JOIN 0,25 ms. Muốn đo lại: dựng lại đúng như vậy, đừng dùng container của phiên khác.
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
- ⚠ `mongDoi` tính trong node:vm realm MỚI — không có `URL`, `Buffer`, `fetch`, `TextEncoder`: lời giải tham khảo chỉ được dùng JavaScript thuần (Ch6 `urlVerdict` từng ra toàn "bad url" vì `new URL` ném trong realm đó; nay tách scheme/host bằng regex).
- KHÔNG sửa `src/services/codeLab.practice.ts` — track đã khai ở `7873ec4e0` (`PRACTICE_TRACK_BY_COURSE['api-design']` + `PRACTICE_CATALOG`); module mới chỉ cần `baiHoc` = slug bài, không thêm dòng nào.

## 9. Kiểm trước khi commit

```bash
node scripts/course-content-check.mjs ./content/courses/api-design.mjs          # 0 lỗi
node scripts/course-content-check.mjs ./content/courses/api-design/sNN-*.mjs     # quét cả giang/ (backslash, backtick)
gitleaks dir <tệp> --config .gitleaks.toml --no-banner                          # hook pre-commit dùng đúng lệnh này
```
Commit bằng index riêng (nhiều phiên chung repo): `export GIT_INDEX_FILE=$(mktemp); git read-tree HEAD; git add <tệp của mình>; git commit …; unset GIT_INDEX_FILE; git reset -q HEAD -- <đúng tệp đó>` — chạy trong `bash -c` (zsh không tách từ biến). Không Co-Authored-By, không push, không deploy, không `--no-verify`.
