# LabFlow ID — dự án xuyên khoá Authentication (cuongthai.com/courses/authentication)

Dịch vụ danh tính của nền tảng LabFlow (cùng thế giới với LabFlow API của khoá API Design và LabFlow Lite của khoá Testing).
Ảnh chụp này = **cuối Chương 12** (v1.0 — khoá trọn). Hợp đồng soạn: `content/courses/authentication/_HOP-DONG.md`.

Chương 4 thêm `src/jwt/` (base64url, keyring, sign, verify, jwks — EdDSA/HS256, 7 claim, JWKS + kid, xoay khoá; đối chiếu `jose` 6.1.0),
`POST /token` + `/.well-known/jwks.json`, `demo4/`, `lab4/` + `scripts/cham-lab-4.mjs`, `test/jwt.test.js`.
Chương 5 thêm `src/refresh/` (layer rotation + reuse detection + grace window, pg-store, memory-store), `sql/003_refresh.sql` (bảng
`refresh_tokens` theo họ, lưu digest), `POST /refresh` + `GET /me/devices` + `/me/devices/revoke` trong `src/server.js`, `demo5/`,
`lab5/` + `scripts/cham-lab-5.mjs` (Lab 5, 8 phép), `test/refresh.test.js`.
Chương 6 thêm `src/lifecycle/` (token một lần: issue/consume theo mục đích + requestPasswordReset chống dò tài khoản, pg-store, memory-store),
`src/email/` (hộp thư giả + `normalize.js`: NFKC + cờ trộn hệ chữ), `sql/004_lifecycle.sql` (cột `email_verified_at` + `status` trên `users`, bảng `one_time_tokens`),
`POST /sign-up` (chống dò, băm cả hai nhánh) + `GET|POST /verify-email` + `/forgot-password`(`-naive`) + `/reset-password` + `/me/email` + `/me/delete`
trong `src/server.js`, `demo6/`, `lab6/` + `scripts/cham-lab-6.mjs` (Lab 6, 6 phép), `test/lifecycle.test.js`.
Chương 7 thêm `src/totp/` (TOTP viết tay RFC 6238/4226 + recovery codes), `src/webauthn/` (passkey trên @simplewebauthn/server),
`src/mfa/store.js`, `sql/005_mfa.sql` (bảng `totp_secrets`, `recovery_codes`, `passkeys`), các tuyến `/mfa/totp/*` + `/webauthn/*` trong
`src/server.js`, `demo7/` (vector RFC + Chromium thật qua Playwright virtual authenticator), `lab7/` + `scripts/cham-lab-7.mjs` (Lab 7, 6 phép), `test/totp.test.js`.
DEPS MỚI: `@simplewebauthn/server`, `otplib` — chạy `npm ci` (ảnh chụp này KHÔNG kèm node_modules).
Chương 8 thêm `src/oidc/` (provider: discovery + authorize + token PKCE; client: begin + 7 phép; verify.js lõi thuần),
`sql/006_oidc.sql` (bảng `oauth_clients`), tuyến `/.well-known/openid-configuration` + `/oauth/authorize` + `/oauth/token` trong
`src/server.js`, `demo8/oidc-flow.mjs` (provider :4800 + client :4810 chạy thật, không trình duyệt), `lab8/` + `scripts/cham-lab-8.mjs` (Lab 8, 6 phép), `test/oidc.test.js`.
Chương 9 thêm `src/authz/` (`policy.js`: cổng duy nhất `can(user, action, resource)` gộp RBAC `ROLE_GRANTS` + ABAC sở hữu + ReBAC trưởng khoa,
tenant kiểm TRƯỚC + `explain()`; `gate.js`: middleware `authorize(action, loadResource)` tự nạp tài nguyên ⇒ 401/404/403, khác tenant = 404),
`demo9/authz-matrix.mjs` (một câu hỏi, năm đáp án) + `demo9/http-gate.mjs` (cổng thật qua HTTP :4812, bốn kết cục), `lab9/` + `scripts/cham-lab-9.mjs`
(Lab 9, 6 phép, đạt 7), `test/authz.test.js`. Thuần — không CSDL, không mạng.
Chương 10 thêm `src/defense/stuffing.js` (phòng thủ nhồi mật khẩu: `decide(signal)` ⇒ allow/challenge/block — chặn IP/độ lan, thách đố con người, KHÔNG khoá tài khoản đơn lẻ), `demo10/` (stuffing-run: 10k spray đo thật; relay: AiTM password/TOTP vs passkey gắn-origin; session-channels: ma trận bốn kênh; mfa-fatigue: ghép số; pre-hijack-race: chiếm-trước + TOCTOU), `lab10/` + `scripts/cham-lab-10.mjs` (Lab 10, 6 phép, đạt 7), `test/defense.test.js`. Thuần — không CSDL, không mạng.
Chương 11 thêm `src/secrets/load.js` (loadConfig fail-fast + redactedConfig), `src/ops/` (rotation xoay khoá chồng lấn, ratelimit cửa sổ cố định chung, audit safeAudit allow-list, triage runbook sáu tín hiệu), `demo11/` (secrets, rotate, ratelimit, audit, signals), `lab11/` + `scripts/cham-lab-11.mjs` (Lab 11, 6 phép, đạt 7), `test/ops.test.js`. Thuần — không CSDL, không mạng.
Chương 12 thêm `demo12/` (diagnose mã-trạng-thái, shapes tám dáng, toolbox giải JWT/cookie bằng tay), và DỰ ÁN CUỐI KHOÁ: `scripts/cham-cuoi-khoa.mjs` (12 kịch bản tấn công thật, 100 điểm, đạt 70) chấm `sub-cuoi/` (tham-khảo 100/100 nối mọi module đã cứng, yếu 25/100, khởi đầu 0/100). Không thêm module src/ hay test (chẩn đoán + dự án cuối dùng lại cả khoá). Thuần — không CSDL, không mạng.

```bash
npm ci                                   # Node 22.12+ (khoá đo trên 22.23.3)
mkdir -p wordlists && curl -sLo wordlists/10k-most-common.txt \
  https://raw.githubusercontent.com/danielmiessler/SecLists/master/Passwords/Common-Credentials/10k-most-common.txt
npm test                                 # 54 test: …+authz(2)+defense(1)+ops(5) [secrets/rotation/ratelimit/audit/triage] — không cần CSDL
node scripts/cham-lab-1.mjs src/crypto   # 10/10 · lab1/yeu 2/10 · lab1/starter 0/10
node scripts/cham-lab-2.mjs src/passwords # 10/10 · lab2/yeu 3.5/10 · lab2/starter 0/10 (kho giả, không cần CSDL)
node scripts/cham-lab-3.mjs src/sessions  # 10/10 · lab3/yeu 2/10 · lab3/starter 0/10 (cổng 4806/4807 + Chromium của Playwright)
node scripts/cham-lab-4.mjs lab4/tham-khao # 10/10 · lab4/yeu 3.5/10 · lab4/starter 0/10 (không cần CSDL — gọi makeVerifier)
node scripts/cham-lab-5.mjs lab5/tham-khao # 10/10 · lab5/yeu 3.5/10 · lab5/starter 0/10 (không cần CSDL — kho trong bộ nhớ + đồng hồ giả)
node scripts/cham-lab-6.mjs lab6/tham-khao # 10/10 · lab6/yeu 3/10 · lab6/starter 0/10 (không cần CSDL — kho trong bộ nhớ + đồng hồ giả)
node scripts/cham-lab-7.mjs lab7/tham-khao # 10/10 · lab7/yeu 5,5/10 · lab7/starter 0/10 (không cần CSDL — vector RFC 4226/6238)
node scripts/cham-lab-8.mjs lab8/tham-khao # 10/10 · lab8/yeu 3/10 · lab8/starter 0/10 (không cần CSDL — 7 phép ID token)
node scripts/cham-lab-9.mjs lab9/tham-khao # 10/10 · lab9/yeu 6,5/10 · lab9/starter 1,5/10 (không cần CSDL — can() RBAC/ABAC/ReBAC/tenant)
node scripts/cham-lab-10.mjs lab10/tham-khao # 10/10 · lab10/yeu 3/10 · lab10/starter 1/10 (không cần CSDL — decide() allow/challenge/block)
node scripts/cham-lab-11.mjs lab11/tham-khao # 10/10 · lab11/yeu 2/10 · lab11/starter 2/10 (không cần CSDL — safeAudit + triage)
node scripts/cham-cuoi-khoa.mjs sub-cuoi/tham-khao # 100/100 · sub-cuoi/yeu 25/100 · sub-cuoi/starter 0/100 (DỰ ÁN CUỐI — 12 kịch bản tấn công)

# Từ Chương 2 máy chủ cần PostgreSQL 17:
docker run -d --name labflow-id-pg -p 127.0.0.1:4832:5432 \
  -e POSTGRES_USER=labflow -e POSTGRES_PASSWORD=labflow-demo-pw -e POSTGRES_DB=labflow_id postgres:17
export DATABASE_URL=postgres://labflow:labflow-demo-pw@127.0.0.1:4832/labflow_id
npm run migrate && npm run seed          # users + sessions (002: hết hạn, last_seen, auth_at, ip/ua); An/Bình/Cô Lan bằng argon2id
npm start                                # LabFlow ID v1.0 trên http://localhost:4800 (…+ OIDC provider: /oauth/authorize, /oauth/token, discovery)
# demo3/where.mjs + redis-store.mjs cần Redis: docker run -d --name labflow-id-redis -p 127.0.0.1:4833:6379 redis:7
```

| Thư mục | Nội dung |
|---|---|
| `src/` | máy chủ v0.8 (`server.js`), `db.js` (pg), `users.js`, `jwt/` (Lab 4), `refresh/` (Lab 5), `sessions/` (Lab 3), `passwords/` (Lab 2), `crypto/` (Lab 1), `lifecycle/` (Lab 6), `email/` (hộp thư giả), `totp/` (Lab 7: TOTP RFC 6238 + recovery), `webauthn/` (passkey), `mfa/`, `oidc/` (Lab 8: provider + client + 7 phép ID token), `log.js`; `store.js` (JSON) chỉ còn cho demo0 |
| `sql/` | migration (`001_users.sql`…`004_lifecycle.sql`), áp bằng `scripts/migrate.mjs` |
| `demo0/` | thí nghiệm Mục 0 |
| `demo1/` | thí nghiệm Chương 1 |
| `demo2/` | thí nghiệm Chương 2 (bẻ 4 cách lưu, bảng thời gian, tune/load argon2id, chuỗi tự mô tả, scrypt maxmem, bcrypt 72 byte, đăng nhập ngây thơ vs v0.2 đo thời gian, NFC, pepper, mật khẩu dài, luật pha trộn, HIBP, chuyển MD5 cũ) |
| `demo3/` | thí nghiệm Chương 3 (đồng hồ giả cho hai mốc hết hạn, chi phí ghi last_seen, đăng xuất mọi nơi, ma trận cookie + SameSite trong Chromium, HttpOnly vs XSS, session fixation, đổi mật khẩu, ma trận CSRF, PG/Redis/cookie có ký) |
| `lab1/`…`lab6/` | `starter/` (khởi đầu) và `yeu/` (lần thử đầu "chạy được") — chấm bằng `scripts/cham-lab-N.mjs` |

Mọi bí mật trong demo là GIẢ (truyền qua biến môi trường, có chữ `demo`/`fake`, hoặc sinh bằng `newToken()` tại chỗ).
Các demo dùng cổng 4800–4804 (PostgreSQL 4832); Playwright cần trình duyệt đã cài (`npx playwright install chromium`).
`demo2/hibp.mjs` và lượt đăng ký của máy chủ gọi API công khai `api.pwnedpasswords.com` (chỉ gửi 5 ký tự hex của SHA-1).
