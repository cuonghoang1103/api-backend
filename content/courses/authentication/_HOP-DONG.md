# Hợp đồng soạn khoá "Authentication" (/courses/authentication)

> Đọc HẾT tệp này trước khi sửa một dòng. Viết 01/11/2026 cùng đợt mẫu **Mục 0 + Chương 1** (bản chuẩn — chỗ nào tệp
> này không nói, bắt chước đúng `authentication/s00/*.mjs`, `s01/*.mjs` + deck `scripts/slides-src/auth-00-*`, `auth-01-*`,
> `auth-lab-1`). Hai khoá mẫu đã trọn để tham chiếu: `testing/_HOP-DONG.md` (cây tệp sNN/ + `_ma.mjs` sinh tự động) và
> `api-design/_HOP-DONG.md` (LabFlow, http(), liên kết SDN302). Khoá này chép cây tệp của Testing.

## 0. Khoá này là gì, dạy ai, chuẩn bắt buộc

- **Người học:** SV SE FPT kỳ 5, chuyên ngành hẹp Node.js (SDN302 ⇒ khoá `nodejs`), sắp làm đồ án (SWP391/SEP490 — đồ án
  nào cũng có đăng nhập) và cần dựng **xác thực thật** khi đi làm. Tiếng Anh yếu ⇒ giảng tiếng Việt, **thuật ngữ Anh lần
  đầu luôn kèm nghĩa Việt trong ngoặc** (`bearer token (tín vật kiểu "ai cầm là người đó")`), lần sau dùng thẳng.
- **7 điểm chuẩn của chủ kênh (31/10)** — kiểm từng điểm trước khi báo một chương "xong":
  1. Mở đầu khoá + **mỗi chương + mỗi bài** nói học xong **làm được gì** và **vì sao đáng học** (khối "After this lesson / Học xong bài này" trong `lead` + đoạn đầu; bài đầu chương có thêm khối "Học xong Chương N").
  2. **Tự đủ từ số 0**: khái niệm nào dùng cũng đã dạy hoặc dạy tại chỗ; link sang khoá khác chỉ là "đọc thêm".
  3. Thực hành đủ: ví dụ chạy thật, 🧪 Practice có lời giải + output thật + "Done when", quiz chương 10 câu, Code Lab mỗi bài, Lab chương có thang chấm + máy chấm, dự án cuối khoá (Ch12).
  4. Thực chiến: sự cố thật có nguồn (WebFetch kiểm, ghi ngày đọc), bẫy hay gặp, góc phỏng vấn/đi làm.
  5. **DỄ HIỂU là số 1**: ví dụ đời thường TRƯỚC, định nghĩa SAU; sơ đồ `lz-flow`/`lz-stack` ở chỗ trừu tượng.
  6. Liên kết chéo đúng bài, hai chiều khi bên kia là bài viết tay (mục 7).
  7. Được tự bổ sung/sửa chỗ sai — **mọi con số phải đo lại**, không chép số từ bản cũ.
- **Mọi output CHẠY THẬT** (Node 22.23.3, phiên bản ghim — mục 3.2), trong **môi trường sạch** (mục 4). Không bịa output,
  không "khoảng chừng" khi đo được. Số đo phụ thuộc máy ⇒ ghi máy (macOS arm64, máy soạn) và nói rõ khi lệch số của khoá khác.

## 1. Cây tệp

| Tệp | Vai trò |
|---|---|
| `content/courses/authentication.mjs` | Manifest. `syncOrder: true` (thứ tự bài = thứ tự tệp). Chương đã soạn lại = `sNN-*.mjs` mỏng import từng bài trong `sNN/`. |
| `authentication/sNN-<tên>.mjs` | Chương: `title` **GIỮ NGUYÊN** (seeder neo chương bằng tiêu đề), `description`, `lessons: [...]`. |
| `authentication/sNN/<bài>.mjs` | Một bài (`slug`, `type`, `isFreePreview`, `title` EN\|\|\|VI, `description` tiếng Việt, `content`). |
| `authentication/sNN/_ma.mjs` | `CODE` (mã nguồn) + `OUT` (output chạy thật) — **SINH TỰ ĐỘNG** bằng `scripts/tst/sinh-ma.mjs`, không sửa tay. |
| `authentication/giang/auth-NN-M.mjs` | Lời giảng EN/VI dưới từng slide: `walkAuth(deck, tênEN, tênVI, [[n, 'Tiêu đề slide', '<p>EN</p>', '<p>VI</p>'], …])`. |
| `authentication/_slides.mjs` | `walkAuth`, `ma(lang, src)`, `ra(output)`, `lienKet({ khoa, bai, … })`, `nguon(...)`, bảng **`VER`**. Chỉ sửa `VER`. |
| `authentication/_labflow-id/` | **Ảnh chụp dự án LabFlow ID** (không node_modules/data/tmp/wordlists) ở cuối chương mới nhất đã soạn — mục 3. |
| `scripts/slides-src/_auth-chung.mjs` | Khuôn slide = `_tst-chung.mjs` + `http()`/`req()` của `_api-chung.mjs`. Chỉ THÊM tuỳ chọn, không đổi mặc định. |
| `scripts/slides-src/auth-NN-M.mjs`, `auth-lab-N.mjs` | Deck từng bài / lab. |
| `scripts/auth/` | `chay.sh` (chụp output trong `env -i`), `nen.sh` (máy chủ demo chạy nền, tắt theo PID), `quet-bi-mat.mjs` (so output với `.env` thật). Kiểm slide/ghép ảnh/sinh `_ma` dùng chung `scripts/tst/{kiem-slide,ghep-anh,sinh-ma}.mjs`. |
| `content/codelab/authentication-practice/` | Code Lab (mục 10). |
| `content/_LIEN-KET-CHEO/authentication.md` | Sổ liên kết chéo của khoá (mục 7). |

## 2. Khung chương và bài

- **Slug cũ GIỮ NGUYÊN** (`auth-N-M-<tên>`, M = 1..5 bài dạy, 6 = quiz). Bài mới: Mục 0 dùng `auth-0-8-…`/`auth-0-9-…` cho
  2 bài "Bắt đầu tại đây"; **Lab chương** = `auth-N-7-lab-<tên>` (đặt TRƯỚC quiz trong mảng); bài tách thêm = số chưa dùng.
- Thứ tự trong chương: bài dạy → Lab → Quiz. Mục 0: Bắt đầu 1/2 → Bắt đầu 2/2 → 0.1 → 0.2 → 0.3 → Quiz Mục 0.
- Bài (`type: 'LESSON'`, `isFreePreview: true`), `content` theo thứ tự:
  1. `${G}` — "📑 Học theo slide" (import từ `giang/`).
  2. `<div class="ml-en">`: `eyebrow` → `h2` → `p.lead` (vì sao bài này đáng học) → khối **After this lesson you can** (`div.callout.ok`, 3–5 gạch) →
     các `h3` (mã `ma()`, output `ra()`, bảng, `.lz-flow`/`.lz-stack`, `div.pitfall.co-tieu-de`) → **In interviews / at work** →
     **🧪 Practice (15–20 min)** trong `div.callout.ok` (đề + **lời giải + output thật** + **Done when**) → **🗂 Key terms** (`div.kv-grid`, 6–8)
     → **📌 Summary** (5–6 ý) → thẻ nguồn `nguon(...)` có ngày đọc → thẻ `lienKet(...)` (mục 7). `</div>`
  3. `<div class="ml-vi">` — bản tiếng Việt **đầy đủ tương đương** (không tóm tắt), cùng mã/output. VI: `Thuật ngữ (nghĩa Việt)`.
- **Độ dài: 30–40k ký tự/bài kể cả phần giảng** (đo `content.length` sau khi dựng). Giảng ngắn: 10–13 slide, 40–50 từ/slide.
  ⚠ Đợt mẫu VƯỢT mức này: 44–55k/bài (Bắt đầu 48k/44k, 0.1 45k, 0.2 49k, 0.3 55k, 1.1 51k, 1.2 51k, 1.3 55k, 1.4 53k, 1.5 54k, Lab 46k) — mỗi
  mã/output in hai lần (EN + VI) và phần giảng ~8–10k. Chương sau: ≤ 45k — tối đa ~6 khối output/bài, mã dài chỉ trích dòng, bỏ bớt câu mở rộng.
  Output dài ⇒ LỌC DÒNG bằng hằng ở đầu tệp bài (chỉ bỏ dòng, không sửa chữ) — mẫu `s01/so-sanh.mjs`.
- Mỗi bài có: ≥ 1 sơ đồ `lz-flow|lz-stack`, ≥ 1 bẫy có thật chạy ra (đỏ/lộ/sai), 1 bảng "khi nào dùng gì", ≥ 2 thẻ nguồn.
- **Luật chữ** (bộ kiểm `scripts/course-content-check.mjs`): trong thân template literal **không backtick, không `\`**, `${` chỉ cho
  nội suy thật; biểu thức có `'\n'` ⇒ hằng ở đầu tệp. HTML trong chữ: `&lt;` `&gt;` `&amp;` (kể cả `=&gt;` trong `<code>`). `ma()`/`ra()` tự thoát.
  Chuỗi nháy đơn (title/quiz): không `\'`, dùng `’`. Không `<svg>`/`<script>`/`<style>` trong bài — hình đi qua slide.

## 3. Dự án xuyên khoá: **LabFlow ID**

### 3.1 Quyết định (01/11/2026)
- **LabFlow ID = dịch vụ danh tính (identity service) của nền tảng LabFlow** — cùng thế giới với `api-design` (LabFlow API,
  đặt phòng lab/thiết bị) và `testing` (LabFlow Lite). Cùng ba người dùng, cùng vai: `usr_1` **An** (STUDENT,
  `an@student.labflow.example`, mật khẩu `an-lab-2026`), `usr_2` **Bình** (STUDENT, `binh@student.labflow.example`, mật khẩu
  **`123456`** — cố ý yếu, nằm thứ 2 trong danh sách SecLists), `usr_3` **Cô Lan** (LAB_MANAGER, `lan@labflow.example`, `lan-lab-2026`).
  Token demo thấp-entropy `tok_an`/`tok_bin`/`tok_lan` (như api-design; gitleaks `curl-auth-header` chặn token entropy cao sau `-H Authorization`).
- **Vì sao một dự án riêng thay vì sửa LabFlow API:** khoá này đi SÂU hơn api-design Ch6 ở mọi mảnh (nguyên hàm, mật khẩu,
  phiên, JWT bên trong, xoay vòng, MFA/passkey, OIDC, phân quyền, tấn công, vận hành). Một dịch vụ danh tính riêng là đúng
  kiến trúc đi làm (IdP tách khỏi API nghiệp vụ) và tới **Ch8 LabFlow ID thành nhà cung cấp OpenID Connect cho chính LabFlow API**
  — đó là chỗ hai khoá nối vào nhau, có liên kết chéo.
- Cổng: **LabFlow ID 4800**, máy chủ "bên thứ ba/kẻ tấn công" 4801, thí nghiệm phụ 4802–4809. PostgreSQL (từ Ch2) 4832.
  Phiên soạn: container/tiến trình tự đặt tên tiền tố `auth0-`/theo PID của `nen.sh`, cổng 48xx; KHÔNG đụng 4000/5432 (phiên khác).
- Lộ trình mã (mỗi chương đóng một lỗ của bài 0.3, mã trong `src/`, thí nghiệm trong `demoN/`):

| Chương | Phiên bản | Thay đổi chính trong `src/` |
|---|---|---|
| Mục 0 | v0 (`demo0/server-v0.js` = `src/server.js` lúc bài 0.3) | Express 5 + kho JSON `data/db.json`; 6 lỗ: mật khẩu thô · thông báo lộ email · id phiên `Date.now()` · không hết hạn/đăng xuất · header tự chế ⇒ JS giữ phiên · không giới hạn lượt thử |
| Ch1 | v0.1 | `src/crypto/` (newToken, tokenDigest, safeEqual, signValue/verifyValue có kid + hết hạn, redact) + `src/log.js` (pino, allow-list) — id phiên từ CSPRNG, CSDL chỉ giữ SHA-256 của token (lỗ 3 đóng) |
| Ch2 | v0.2 | PostgreSQL 17 (`users`), argon2id (`argon2` 0.45.1 — cùng bản khoá nodejs; bcrypt 6.0.0 để so), chuỗi tự mô tả + tham số theo đo, nâng cấp băm khi đăng nhập, chính sách NIST + kiểm mật khẩu đã lộ (k-anonymity) — lỗ 1 |
| Ch3 | v0.3 | bảng `sessions` (digest, expires_at, last_seen, ip/ua), cookie `__Host-lfid_ses` HttpOnly/Secure/SameSite, tái sinh phiên, CSRF — lỗ 4, 5 (phía phiên) |
| Ch4 | v0.4 | JWT tự dựng rồi đối chiếu `jose` (EdDSA/ES256 + JWKS + kid), 7 claim, nơi cất token trong trình duyệt — dùng lại `signValue` để hiểu |
| Ch5 | v0.5 | access 15 phút + refresh xoay vòng theo họ, phát hiện tái dùng, danh sách thiết bị, cuộc đua refresh |
| Ch6 | v0.6 | đăng ký, xác minh email (hộp thư giả), đặt lại mật khẩu (token một lần, băm, 15–30 phút), chống dò tài khoản (thông điệp + thời gian) — lỗ 2 |
| Ch7 | v0.7 | TOTP tự viết theo RFC 6238 (so với `otplib`), mã khôi phục, passkey bằng `@simplewebauthn/server` + Chromium thật (virtual authenticator) |
| Ch8 | v0.8 | LabFlow ID làm **OIDC provider** cho LabFlow API (code + PKCE, state/nonce, ID token, discovery, JWKS); client thật ở cổng 4810 |
| Ch9 | v0.9 | RBAC/ABAC/ReBAC trên tài nguyên LabFlow (phòng, lượt đặt), đa tenant (khoa/cơ sở), một chỗ đặt phép kiểm |
| Ch10 | v0.10 | tấn công theo tần suất trên chính LabFlow ID: nhồi mật khẩu, relay phishing, cướp phiên, MFA fatigue, pre-hijacking, race — lỗ 6 |
| Ch11 | v0.11 | bí mật tới tiến trình, xoay khoá 2 bản sống, rate limit (Redis), audit log, 6 tín hiệu + runbook |
| Ch12 | **v1.0** | chẩn đoán, soát mã người khác, **dự án cuối khoá** (mục 12) |

### 3.2 Phiên bản ghim (đo 01/11/2026)
Node **22.23.3** (`~/.nvm/versions/node/v22.23.3/bin` — node mặc định của máy soạn là 26, luôn đặt PATH), npm 10.9.9,
Express **5.3.0**, pino **10.4.0**, axios **1.21.0** (dev, bài 1.5), Vite **8.3.5** (dev, bài 1.5), Playwright **1.64.1**
(dev; Chromium **156.0.8078.4**; `PLAYWRIGHT_BROWSERS_PATH=~/Library/Caches/ms-playwright` khi chạy trong `env -i`), curl 8.7.1,
gitleaks **8.30.1**, git 2.51.1. Danh sách mật khẩu: SecLists `Passwords/Common-Credentials/10k-most-common.txt` (10.001 dòng,
tải về `wordlists/` — KHÔNG đưa vào repo). Cài gói luôn `--save-exact`.

### 3.3 Cây dự án cuối Ch1 (ảnh chụp `_labflow-id/`)
```
package.json            # type module, engines node >=22.12, scripts dev/start/seed/test ("test/**/*.test.js")
src/server.js           # v0.1  · src/store.js (data/db.json) · src/log.js (pino + allow-list)
src/crypto/             # tokens.js compare.js signed.js redact.js index.js  ← Lab 1 (lời giải tham khảo)
test/crypto.test.js     # 6 test node:test (npm test)
scripts/seed.mjs        # tạo An/Bình/Cô Lan qua POST /sign-up · scripts/cham-lab-1.mjs (máy chấm Lab 1)
lab1/starter/  lab1/yeu/   # khởi đầu (0/10) · lần thử đầu "chạy được" (2/10)
demo0/  demo1/          # thí nghiệm từng bài (forget, gates, enumerate, guess-session, brute, storage-xss, first-proof,
                        #   linkedin-replay, bearer, third-party, open-reset, predict-math-random, timing-*, webhook,
                        #   length-extension + sha256, shared-key, encrypt-not-protect, log-demo, axios-error, git/, web/)
```
Dựng lại: `cp -r content/courses/authentication/_labflow-id <SCRATCH>/labflow-id && cd … && npm ci && mkdir -p wordlists &&
curl -sLo wordlists/10k-most-common.txt https://raw.githubusercontent.com/danielmiessler/SecLists/master/Passwords/Common-Credentials/10k-most-common.txt`.
Kiểm: `npm test` (6 pass) · `node scripts/cham-lab-1.mjs src/crypto` (10/10) · `… lab1/yeu` (2/10) · `… lab1/starter` (0/10).
Xong chương ⇒ cập nhật ảnh chụp (rsync bỏ `node_modules data tmp wordlists demo1/web/dist`) và chạy lại ba lệnh trên.

## 4. Chụp output — môi trường sạch, không lộ bí mật

```bash
source <SCRATCH>/env.sh       # S, P, R, AUTH_RUN, AUTH_HOME, PATH Node 22; hàm chay() = bash $R/chay.sh $P, nen() = bash $R/nen.sh
nen start v01 $P node src/server.js                         # máy chủ nền trong env -i, PID ghi ở $AUTH_RUN/v01.pid
chay "curl -s -w '\n' localhost:4800/me -H \"x-session: \$S\"" > $S/out1/13-v01-me.txt
AUTH_ENV="DEMO_API_KEY=fake…" chay "node demo1/…"            # bí mật demo LUÔN giả, truyền tường minh
{ echo '$ node src/server.js'; nen log v01; } > $S/out1/15-v01-log.txt; nen stop v01
node scripts/auth/quet-bi-mat.mjs $S/out0 $S/out1 --im      # PHẢI "0 khớp giá trị thật" trước khi sinh _ma
node scripts/tst/sinh-ma.mjs $S/map1.json                   # ⇒ authentication/s01/_ma.mjs
```
- **`chay.sh` chạy trong `env -i`**: tiến trình con chỉ thấy PATH, HOME tạm, LANG, TZ (Asia/Ho_Chi_Minh), NO_COLOR và biến GIẢ
  qua `AUTH_ENV`. Lý do: 01/11 một agent khác lộ 2 token thật vì demo thừa hưởng biến của shell. Không bao giờ `source .env` khi chụp.
- Bí mật demo có chữ `demo`/`fake` hoặc là `newToken()` sinh tại chỗ (dùng một lần). `.env` thật CHỈ dùng để upload slide.
- Tên tệp `.txt` = khoá `OUT` (`<bài><số>-<tên>`: `13-do-strict`, `lab-yeu`). `[exit N]` bị cắt khi sinh. Đường dẫn dự án → `…/labflow-id`, HOME tạm → `~`.
- Mã màu (gitleaks, Playwright) ⇒ `perl -pi -e 's/\e\[[0-9;]*m//g'` trước khi sinh `_ma`.
- Log máy chủ nền chép kèm dòng đầu `$ node <tệp>` (lệnh thật đã chạy nó).
- Số đo ngẫu nhiên/thời gian: đo ≥ 2–3 lần, in đủ các lần (bài 1.3: ba lần đo từ xa +125/−126/−42 ns).
- `rm` với biến: viết `"${O:?}"/…` hoặc đường tuyệt đối (công cụ chặn `rm $O/*`).

## 5. Slide

- Deck `scripts/slides-src/auth-NN-M.mjs` (NN 2 chữ số; Mục 0 Bắt đầu = `auth-00-8`, `auth-00-9`) và `auth-lab-N.mjs`.
  `export const deck = { key, code: 'AUTH N.M', title, sub }`, `export const slides = lamDeck({ chuong: 'Chapter N — …', bai: 'N.M' | 'Lab N' | 'Start 1/2' }, [...])`.
- Helper (`_auth-chung.mjs`): `js(src, { hl, sm })` · `vt(text)` terminal kiểu test (✓/✗) · `http(text, { wrap })` curl -i/-v ·
  `sh(text)` terminal thường · `req([[dòng, chú thích]])` · `two/three/box/steps/cards/kw/vsd/c/zm/tbl/flow`.
- Luật: **FULL TIẾNG ANH** (cả chú thích trong mã — mã dự án viết comment tiếng Anh), logo CuongThai.com, **KHÔNG logo/tên FPT**,
  chữ thân 24–28px, mã ≤ ~14 dòng/khối, **output trên slide = output thật** (cắt bằng `…`, không sửa chữ), token dài cắt `…`.
- Deck 10–13 slide: bìa → "What you will take away" → ví dụ đời thường → lệnh/output thật → hình/so sánh → bẫy (`vsd`) →
  bảng tra/phỏng vấn → tóm tắt + "Next". Lab: 9 slide (bìa, nhiệm vụ, mã khởi đầu, 9 phép chấm, lần thử đầu, tham khảo, rubric, gợi ý, checklist).
- **Kiểm TỰ ĐỘNG** mọi deck: `node scripts/tst/kiem-slide.mjs scripts/slides-src/auth-NN-M.mjs` ⇒ `0 slide có vấn đề` (TRÀN ngang/dọc,
  chữ mã tràn, TRỐNG < 70%). Rồi render + **XEM TỪNG ẢNH**: `node scripts/_render-slides.mjs --deck … --out <SCRATCH>/final` ⇒
  `node scripts/tst/ghep-anh.mjs <SCRATCH>/final/<deck> <SCRATCH>/sheets` ⇒ Read từng tấm 2×2. Đối chiếu số trên slide với `_ma.mjs`.
- **Upload** (chủ ý chạm R2 thật): `node --env-file=.env scripts/upload-academy-slides.mjs --dir <SCRATCH>/final --prefix AUTH/v1 --decks <deck,…>`
  ⇒ `images/academy/AUTH/v1/<deck>/NNN.webp`. **KHÔNG GET URL media.cuongthai.com trước khi đẩy.** Dựng lại deck đã đẩy ⇒ `AUTH/v2`
  + ghi `VER` trong `_slides.mjs`. Hiện (01/11): 11 deck Mục 0 + Ch1 ở v1 — 127 ảnh (00-8 11, 00-9 11, 00-1 12, 00-2 12, 00-3 13,
  01-1 11, 01-2 11, 01-3 13, 01-4 12, 01-5 12, lab-1 9). Deck import thẳng `OUT`/`CODE` từ `sNN/_ma.mjs` (không chép tay output) ⇒ chụp lại
  output là phải render + đẩy lại (lên v2).
- Không sửa `_render-slides.mjs`, `_pg-chung.mjs`, `_tst-chung.mjs`, `_api-chung.mjs`.

## 6. Lời giảng (`giang/auth-NN-M.mjs`)
- Đúng **một dòng/slide**, đủ 1..N (walkAuth ném lỗi nếu thiếu/trùng). EN 40–70 từ, VI tương đương; giải thích **vì sao**, không đọc lại slide.
- Tiêu đề cột 2 ≡ `t:` của slide (bỏ `<br>`). Kiểm: so bằng lệnh nhỏ (mẫu trong lịch sử commit đợt mẫu).

## 7. Liên kết chéo (`<a class="link-card lien-ket-cheo">` cuối `ml-en` VÀ `ml-vi`)

- Courses → Courses/Academy: `${lienKet({ khoa: '<slug khoá>', bai: '<slug bài>', title, sub, cta })}`; `sub` nói **Giống** gì,
  **Khác/sâu thêm** gì, và "chưa học vẫn tự đứng được". Thẻ ở bài kia (chiều ngược): "Go deeper in the Authentication course — lesson …".
- Academy: SDN302 = `server-side-development-nodejs-express-mongodb` (`content/academy/SDN302.mjs`, viết tay, HTML trong template:
  chèn thẻ ngay sau thẻ `lien-ket-cheo` cuối của khối ml-en/ml-vi của bài), PRJ301 = `java-web-application-development`
  (`PRJ301.mjs` viết tay; `prj301/chuyen-sau.mjs` là **FILE SINH TỰ ĐỘNG** ⇒ sửa nguồn `~/Documents/FLM-nguon/_repo/PRJ301/gen/`, sinh lại, diff phải rỗng),
  SWT301 = `software-testing`. **Trước khi sửa tệp dùng chung: `git diff HEAD -- <tệp>`; có thay đổi của phiên khác ⇒ bỏ qua, ghi báo cáo.**
- `web-security` là khung ⇒ chỉ một chiều, tới trang khoá.
- Sổ: `content/_LIEN-KET-CHEO/authentication.md` (đợt mẫu: 12 cặp hai chiều + 1 một chiều) — mọi cặp mới ghi vào đó.
- Video YouTube ngoài: `content/course-videos/authentication.mjs` (đợt mẫu thay 1.2–1.5 cho đúng chủ đề, thêm 0-8, 0-9, Lab 1;
  `verify-youtube-videos.mjs --fix-credits` 66/66 sống). Bài mới ⇒ thêm video cùng lúc. Đã có từ trước (KHÔNG thêm lại):
  `nodejs-ch8-auth-apidesign.md` (Node 8.x ↔ auth 2.1/2.2/3.4/4.2/5.2/9.5/11.3), `nodejs-ch9-bao-mat.md` (Node 9.4 ↔ auth 1.3/11.1, Node 9.2 ↔ auth 4.5),
  `prj301-nodejs-auth-postgresql.md` (PRJ301 cookie-session ↔ auth 3.2; SDN302 ↔ auth 3.2).
- Số giữ nhất quán với các khoá kia: access token **15 phút (900 s)**; lần sai thứ 6 ⇒ 429 (Node: Retry-After 60, API Design: 180 —
  cấu hình khác nhau, nói rõ); SHA-256 thô ~2.010.039/s, bcrypt cost 12 ≈ 3,6/s (nodejs 8.1, Node 22.23.3); HMAC thô ~880k/s/nhân (nodejs 9.4).
  Đo lại trên máy mình mà lệch ⇒ ghi cả hai số + lý do (máy khác, phiên bản khác).

## 8. Lab chương (`auth-N-7-lab-<tên>`, bài LESSON đứng trước quiz)

- Mỗi Lab: Setup · nhiệm vụ (bắt đầu từ HÀNH VI cần có, không từ phép chấm) · bảng phép chấm (+ "với người dùng nghĩa là gì") ·
  **lần thử đầu "chạy được" chạy thật và trượt** (Lab 1: 2/10) + giải thích từng phép trượt · **thang chấm 10 điểm, đạt 7** ·
  gợi ý nhẹ → mạnh · **lời giải tham khảo + output 10/10** · checklist nộp.
- Máy chấm = `scripts/cham-lab-N.mjs <thư mục>` trong dự án: chỉ GỌI hàm/endpoint của người học + đọc mã nguồn (cấm Math.random…),
  in từng phép ✓/✗ + điểm + lý do, exit 0 khi ≥ 7. Phép chấm hành vi trước, đọc mã sau cùng.
- ⚠ Phép đo thời gian trong máy chấm phải **dùng kết quả** (`if (f()) hits++`) và xoay vòng 8 bản sao đầu vào — không thì JIT xoá
  phép so sánh và đo vòng rỗng (đã dính khi viết T5 Lab 1: `===` "đạt" 1,0×).
- Kế hoạch Lab: L1 bộ công cụ nguyên hàm (xong) · L2 lưu mật khẩu + nâng cấp băm (máy chấm dump bảng, thử 10k mật khẩu, đo thời gian đăng nhập hai nhánh) ·
  L3 phiên cookie đầy đủ (Playwright kiểm cờ cookie, tái sinh, CSRF chéo trang) · L4 kiểm JWT (bộ 20 token độc: alg none/HS↔RS, kid lạ, exp/nbf/aud) ·
  L5 refresh xoay vòng (đua hai tab, tái dùng ⇒ thu hồi họ) · L6 đặt lại mật khẩu (máy chấm thử dò email + đo thời gian + token một lần) ·
  L7 TOTP + passkey (virtual authenticator) · L8 OIDC client↔provider (state/nonce/PKCE tấn công) · L9 ma trận phân quyền (vai × tài nguyên × hành động) ·
  L10 phòng thủ nhồi mật khẩu (kịch bản tấn công chạy thật, phải chặn mà không khoá người thật) · L11 runbook + audit log · L12 = dự án cuối khoá.

## 9. Quiz chương
- `type: 'QUIZ'`, slug giữ (`auth-N-6-quiz`, Mục 0 `auth-0-4-quiz`, Ch12 `auth-12-6-kiem-cuoi-khoa` 20 câu).
- `quiz: { timeLimitSeconds: 900, questions: [10] }`; câu `{ question: 'EN|||VI', options: ['EN|||VI' ×4], correctIndex, points: 1, explanation: 'EN: …|||VI: …' }`.
- Câu **tình huống trên LabFlow ID với số đo của bài**; giải thích: vì sao đúng + vì sao phương án hấp dẫn nhất sai + chỉ bài.
  **Rải đáp án** mỗi chữ A–D 2–3 lần (ghi phân bố ở chú thích đầu tệp); phương án sai đồng dạng, dài tương đương.

## 10. Code Lab (`content/codelab/authentication-practice/`)
- Theo `content/codelab/README.md`. Bộ dựng `nguon/_auth.mjs` (chép `api-design-practice/nguon/_api.mjs`, KHOA = `authentication`):
  `cs()` choice/order/table (xáo theo nội dung, không viết tay a/b/c/d), `jsBai()` viết hàm — `mongDoi` tính bằng chạy lời giải trong
  node:vm (realm MỚI: không `Buffer`/`crypto`/`TextEncoder`/`URL` ⇒ lời giải chỉ dùng JS thuần; đề cần SHA-256/HMAC đưa sẵn hàm
  `sha256Bytes()` thuần JS trong mã khởi đầu và lời giải). Module slug = slug bài; Lab = module `auth-N-7-lab-…` (`dangBai: 'lab'`).
- Lệnh: `node content/codelab/authentication-practice/nguon/_dung-track.mjs` → `node scripts/codelab-xuat-de.mjs --track authentication-practice`
  → `npx tsx scripts/codelab-kiem-cham-trinh-duyet.mjs --track authentication-practice` (lời giải 100%, khởi đầu trượt ≥ 1)
  → `node scripts/codelab-kiem-noi-dung.mjs --track authentication-practice`.
- **Đăng ký track là sửa mã — phiên điều phối làm, KHÔNG phải người soạn.** Dòng đề xuất cho `src/services/codeLab.practice.ts`:
  ```ts
  // PRACTICE_TRACK_BY_COURSE (sau dòng 'api-design'):
    authentication: 'authentication-practice',
  // PRACTICE_CATALOG (sau dòng API & System Design):
    { loai: 'course', ten: 'Authentication', courseSlug: 'authentication', trackSlug: 'authentication-practice' },
  ```
  Deploy bước 3.12a tự seed `content/codelab/*-practice` (track mới cần `codelab-create-track` lần đầu — xem README §4).
- **Đợt mẫu (01/11):** 11 module, 43 đề (0-8, 0-9, 0-1, 0-2, 0-3, 1-1 … 1-5: 4 đề/module; lab `auth-1-7-lab-bo-cong-cu`: 3 đề). Xuất sạch; kiểm
  trình duyệt: lời giải 254/254 kiểm (CSP web và `--app`), mọi khởi đầu trượt ≥ 1; `codelab-kiem-noi-dung` 0 lỗi; gitleaks sạch (bảng SHA-1 của
  0-9 dựng lúc nạp module để khỏi bị bắt nhầm). Module đọc `s00/_ma.mjs`/`s01/_ma.mjs` khi xuất ⇒ chụp lại output thì XUẤT LẠI track.
  Đề viết hàm khó: `checkCard`, `crackUnsalted`, `parseCookieHeader`/`readBearer`, `getProfile` (ba cổng), `referrerFor`, `unbiasedDigits`,
  `verifyWebhook`, HMAC-SHA256 dựng từ SHA-256 thuần JS, `scanSecrets` (gitleaks thu nhỏ), `signValue`/`verifyValue` (lab).

## 11. Kế hoạch toàn khoá (giữ slug; mỗi chương + Lab + quiz 10 câu)

| Chương | Bài (slug giữ) — trọng tâm đo thật | Trùng/nối |
|---|---|---|
| Mục 0 | 0.8/0.9 Bắt đầu (HMAC "thẻ đóng dấu" 12 dòng; sự cố có nguồn + phát lại LinkedIn 2012: 10.001 SHA-1 trong 11,8 ms) · 0.1 HTTP quên (IP/kết nối/thẻ mang theo) · 0.2 ba cổng (IDOR, 401/403/404) · 0.3 v0 sáu lỗ (đoán phiên 36.839 lượt/4,37 s; 10.001 mật khẩu/3,48 s không 429) · Quiz | api-design 0.x, 6.2 (BOLA) |
| Ch1 | 1.1 bearer + URL/Referer (Chromium 156) · 1.2 CSPRNG, dự đoán Math.random từ 4 số · 1.3 so sánh hằng thời gian (đo trong tiến trình + qua HTTP) · 1.4 băm/MAC/chữ ký, length extension, CTR vs GCM · 1.5 rò bí mật (log, lỗi axios, git, bundle, env) · Lab 1 · Quiz | nodejs 9.4, api-design 6.1, 10.4 (webhook) |
| Ch2 | 2.1 đã có CSDL (dump PG thật, bảng tra) · 2.2 chọn + chỉnh băm theo đo (argon2id/scrypt/bcrypt, RAM, song song) · 2.3 luồng đăng nhập nhánh đều (thời gian) · 2.4 chính sách NIST 800-63B rev 4 + HIBP k-anonymity · 2.5 chuyển đổi băm cũ · Lab 2 · Quiz | nodejs 8.1 (dẫn sang, không đo lại cái đã đo; đo cái mới: tham số theo máy, argon2 song song) |
| Ch3 | 3.1 bảng phiên · 3.2 từng thuộc tính cookie (Chromium thật) · 3.3 tái sinh phiên (session fixation) · 3.4 CSRF ba lớp · 3.5 phiên sống ở đâu (PG/Redis/ký) · Lab 3 · Quiz | nodejs 8.4 (ma trận SameSite Chromium 149 — đo lại trên 156, nói rõ), PRJ301 cookie-session, SDN302 5.1 |
| Ch4 | 4.1 giải mã tay · 4.2 alg (none, HS/RS confusion) · 4.3 bảy claim · 4.4 khoá/kid/JWKS/xoay · 4.5 cất token ở đâu · Lab 4 · Quiz | api-design 6.1 (HS256 tự dựng), nodejs 8.2 (jsonwebtoken 9.0.3) |
| Ch5 | 5.1 hai token · 5.2 xoay vòng + tái dùng · 5.3 năm sự kiện kết thúc phiên · 5.4 danh sách thiết bị · 5.5 cuộc đua refresh · Lab 5 · Quiz | nodejs 8.2 |
| Ch6 | 6.1 đăng ký · 6.2 xác minh email (máy quét bấm link) · 6.3 đặt lại mật khẩu · 6.4 dò tài khoản (thời gian) · 6.5 đổi email/xoá · Lab 6 · Quiz | — |
| Ch7 | 7.1 yếu tố thứ hai · 7.2 TOTP 30 dòng · 7.3 đăng ký + khôi phục · 7.4 passkey · 7.5 triển khai passkey · Lab 7 · Quiz | dùng `randomInt` của bài 1.2 cho mã |
| Ch8 | 8.1–8.5 OAuth 2.1/OIDC (LabFlow ID là provider, LabFlow API là client) · Lab 8 · Quiz | api-design 6.1 (OAuth tổng quan) |
| Ch9 | 9.1–9.5 phân quyền · Lab 9 · Quiz | api-design 6.2, nodejs 8.3, testing 5.2 |
| Ch10 | 10.1–10.5 tấn công theo tần suất · Lab 10 · Quiz | nodejs 8.4, api-design 6.1 (429), web-security (một chiều) |
| Ch11 | 11.1–11.5 vận hành · Lab 11 · Quiz | nodejs 9.4, api-design 12.x (checklist) |
| Ch12 | 12.1–12.5 chẩn đoán + soát mã · **Lab 12 = dự án cuối khoá** · thi cuối khoá 20 câu | testing 5.2 (test xác thực) |

## 12. Dự án cuối khoá (Ch12, `auth-12-7-lab-du-an-cuoi-khoa`, 100 điểm, đạt 70)
LabFlow ID v1.0 chạy được ở production cho LabFlow API: argon2id + nâng cấp băm · phiên cookie `__Host-` + CSRF · access 15 phút +
refresh xoay vòng phát hiện tái dùng · đặt lại mật khẩu an toàn · TOTP + passkey · OIDC provider (code + PKCE) cho LabFlow API ·
RBAC/ABAC phòng lab · rate limit chống nhồi mật khẩu · audit log + runbook. Máy chấm `scripts/cham-cuoi-khoa.mjs` chạy ~12 kịch
bản tấn công THẬT (dump CSDL, dò email theo thời gian, đoán phiên, alg none, tái dùng refresh, CSRF chéo trang, relay TOTP, IDOR,
nhồi 10k mật khẩu…) + kiểm cấu hình production; có bản yếu đo được điểm thấp và bản tham khảo 100/100; kể dự án theo STAR cho CV.

## 13. Quy trình một chương + kiểm trước commit
1. Đọc bài cũ (giữ slug, giữ ý đúng, sửa ý sai) + bài trùng ở nodejs/api-design (đừng đo lại cái họ đã đo — dẫn sang).
2. Viết mã vào LabFlow ID (scratch), chạy trong `env -i`, bắt lỗi/bẫy thật. 3. Chụp output, quét bí mật, sinh `_ma.mjs`.
4. Deck → `kiem-slide` 0 lỗi → render → xem ảnh. 5. `giang/` → bài EN/VI → Lab (+ máy chấm, bản yếu, lời giải) → quiz.
6. Code Lab module mỗi bài → xuất → kiểm trình duyệt 100%. 7. Liên kết chéo + sổ. 8. Upload slide. 9. Cập nhật `_labflow-id/` + tệp này.
```bash
node scripts/course-content-check.mjs ./content/courses/authentication.mjs     # 0 lỗi
node scripts/course-content-check.mjs ./content/courses/authentication/sNN-*.mjs
node scripts/course-depth-audit.mjs ./content/courses/authentication.mjs
gitleaks dir <tệp> --config .gitleaks.toml --no-banner
```
Commit bằng **index riêng** trong `bash -c` (zsh không tách từ): `export GIT_INDEX_FILE=$(mktemp); git read-tree HEAD; git add <đúng tệp>;
git diff --cached --stat; git commit -m …; unset GIT_INDEX_FILE; git reset -q HEAD -- <đúng các tệp đó>` — KHÔNG `git reset` trần,
không `git add -A`, không stash, không Co-Authored-By, không push/deploy.

## 14. Đính chính so với bản cũ (đo lại 01/11/2026)
- Bản cũ in output không tái lập được (gọi cuongthai.com/api.vidu.com bằng token thật) và output dựng tay (mã HMAC "8f1a2c05…",
  "<Buffer 3d 9c…>", bảng thời gian ===) ⇒ thay toàn bộ bằng output thật trên LabFlow ID localhost.
- "Referer gửi URL đầy đủ cho mọi script bên thứ ba" — SAI với mặc định hiện nay: Chromium 156 mặc định
  `strict-origin-when-cross-origin` chỉ gửi **origin** sang bên thứ ba; URL đầy đủ (kèm token) vẫn tới **cùng origin** và tới bên
  thứ ba khi trang đặt `no-referrer-when-downgrade`/`unsafe-url` (đo trong bài 1.1).
- Số đo `===` cũ ("4,11 → 26,31 ns, chênh 6 lần") là bịa/không tái lập. Đo đúng (vòng xoay 8 bản sao, dùng kết quả): 64 ký tự 4,61 → 6,56 ns
  (bậc thang theo khối, không theo từng ký tự); 1024 ký tự 4,61 → 38,05 ns. Đo NGÂY THƠ (một đối tượng) ra 0,99 ns phẳng — JIT kéo phép so ra
  khỏi vòng lặp. Qua HTTP localhost 20.000 lượt: chênh trung vị +125 / −126 / −42 ns (nhiễu ±100 ns ≫ tín hiệu 2 ns).
- "Math.random khôi phục từ một nhúm giá trị" — giờ ĐO: 3 số ⇒ 116/128 bit, đoán sai; **4 số ⇒ 128/128 bit, đoán đúng 5/5 số tiếp theo**.
- Quiz cũ 6–8 câu, đáp án gần như luôn B ⇒ quiz mới 10 câu, đáp án rải.
- Mục 0 cũ dùng Prisma + PostgreSQL ngay bài 0.3 ⇒ đổi sang Node + Express + tệp JSON (10 phút cài, không Docker); PostgreSQL vào từ Ch2.
