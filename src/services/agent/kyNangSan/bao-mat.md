---
name: bao-mat
description: Rà và sửa lỗ hổng bảo mật web/API theo OWASP Top 10 — injection, XSS, CSRF, đăng nhập/JWT/cookie/mật khẩu, phân quyền và IDOR, CORS, upload, SSRF, lộ .env/API key, rate limit, CSP/HSTS, thư viện có lỗ hổng. Dùng khi được nhờ kiểm tra bảo mật/audit, làm đăng nhập/phân quyền, hay nghi lộ key.
---

# KỸ NĂNG: BẢO MẬT — tìm lỗ hổng theo luồng dữ liệu, sửa tận gốc, chứng minh được

Mục tiêu: mỗi lỗ hổng báo ra đều có đường đi cụ thể từ đầu vào tới chỗ gây hại, có cách tái hiện, có bản sửa
đã kiểm — không phải danh sách "nên cân nhắc" chép từ sách.

## 0. Luật vàng (đọc trước mọi thứ)

1. **Chỉ kiểm hệ thống của chính người dùng.** Mã trong dự án, server/tên miền họ sở hữu, môi trường dev/staging của họ.
   Không quét, dò, khai thác, brute-force hệ thống của người khác — kể cả khi được nhờ "thử xem web trường có lỗi không".
   Không viết mã độc, keylogger, công cụ đánh cắp phiên, mã né antivirus, hay payload để tấn công bên thứ ba.
2. **Không tái hiện lỗ hổng trên dữ liệu thật của prod.** Chứng minh bằng dev/local, tài khoản test, hoặc bằng mã (test tự động).
   Một PoC xoá dữ liệu hay gửi email thật là sự cố, không phải bằng chứng.
3. **Không bao giờ in, chép, commit bí mật** bạn nhìn thấy khi rà. Báo "file X dòng Y chứa khoá bắt đầu `sk-…`", che phần còn lại.
4. **Tin phía server, không tin phía client.** Mọi kiểm tra ở frontend (ẩn nút, disable ô, validate form) chỉ là tiện lợi.
   Kẻ tấn công gọi thẳng API bằng `curl`. Ẩn UI ≠ chặn API.
5. **Sửa bằng cơ chế chuẩn của framework**, không tự chế mã hoá/hash/lọc HTML. Sửa xong ⇒ viết test (hoặc `curl`) cho thấy
   đòn tấn công giờ bị chặn VÀ luồng hợp lệ vẫn chạy.

## 1. Cách rà: đi theo luồng dữ liệu

1. **Lập bản đồ đầu vào:** liệt kê route/endpoint (`grep` cho `router.`, `app.get(`, `@GetMapping`, `[HttpPost]`, `@app.route`,
   `path(`, `Route::`), WebSocket handler, job đọc file/queue, webhook. Mỗi cái: ai gọi được (công khai / đăng nhập / admin)?
2. **Với mỗi đầu vào, lần tới chỗ dùng nguy hiểm (sink):** truy vấn DB, lệnh shell, đường dẫn file, HTML trả về, URL gọi ra
   ngoài, redirect, `eval`, deserialize. Giữa nguồn và sink có kiểm/tham số hoá/escape không?
3. **Tìm nhanh các sink nguy hiểm:**
   ```bash
   git grep -nE "queryRawUnsafe|executeRawUnsafe|\\\$\{.*\}.*(SELECT|INSERT|UPDATE|DELETE)|FromSqlRaw|createNativeQuery|\.raw\(" -- ':!*.test.*'
   git grep -nE "child_process|exec\(|execSync|spawn\(.*shell: *true|os\.system|subprocess.*shell=True|Runtime\.getRuntime\(\)\.exec"
   git grep -nE "dangerouslySetInnerHTML|innerHTML *=|v-html|\{\{\{|\|safe|Html\.Raw|@Html\.Raw"
   git grep -nE "eval\(|new Function\(|pickle\.loads|yaml\.load\(|BinaryFormatter|ObjectInputStream"
   git grep -nE "(fetch|axios\.(get|post)|requests\.(get|post)|HttpClient).*req\.(query|body|params)"
   ```
4. **Kiểm phân quyền từng route** (mục 4) — đây là nơi web sinh viên hỏng nhiều nhất.
5. **Rà cấu hình:** CORS, cookie, header, chế độ debug, trang lỗi lộ stack trace, `.env` và lịch sử git (mục 8).
6. **Rà phụ thuộc** (mục 10). Ghi mỗi phát hiện ngay khi thấy, rồi mới sửa theo thứ tự mức độ.

## 2. Injection

- **SQL:** luôn tham số hoá (xem kỹ năng `database` mục 9). Tên cột/`ORDER BY` động ⇒ danh sách trắng.
- **NoSQL (MongoDB):** `User.findOne({ email: req.body.email, password: req.body.password })` với body
  `{"password": {"$ne": null}}` ⇒ đăng nhập không cần mật khẩu. Sửa: ép kiểu `String(x)` / validate bằng schema (zod, Joi,
  class-validator), bật `mongoose.set('sanitizeFilter', true)`, và KHÔNG so mật khẩu trong truy vấn — lấy user rồi so hash.
- **Command injection:** không ghép chuỗi vào shell.
  ```js
  exec(`convert ${file} out.png`);                 // SAI: file = "a.png; rm -rf ~"
  execFile('convert', [file, 'out.png']);          // ĐÚNG: đối số tách rời, không qua shell
  ```
  Python `subprocess.run([...], shell=False)`; Java `ProcessBuilder(List.of(...))`.
- **Path traversal:** `path.join(UPLOAD_DIR, req.params.name)` với `../../.env` ⇒ đọc file bất kỳ. Sửa: `path.basename`, rồi
  `const p = path.resolve(DIR, ten); if (!p.startsWith(path.resolve(DIR) + path.sep)) throw ...`.
- **Validate đầu vào theo schema ở biên** (zod/Joi/class-validator, Bean Validation `@Valid`, Pydantic, FluentValidation,
  Laravel `$request->validate`). **Mass assignment:** `prisma.user.update({ data: req.body })` ⇒ gửi kèm `"role":"ADMIN"`.
  Chỉ lấy trường được phép; Laravel `$fillable`, ASP.NET dùng DTO riêng thay vì bind thẳng entity.

## 3. XSS

- React/Vue/Angular/Razor/Blade/Jinja tự escape — lỗ hổng nằm ở chỗ TẮT nó: `dangerouslySetInnerHTML`, `v-html`, `Html.Raw`,
  `{!! !!}`, `|safe`, `innerHTML`. Cần hiển thị HTML người dùng soạn ⇒ lọc bằng DOMPurify (trình duyệt) /
  `sanitize-html` (Node) / `bleach`/`nh3` (Python) / `HtmlSanitizer` (.NET) với danh sách thẻ cho phép.
- Link do người dùng nhập: chặn `javascript:` — chỉ cho `http:`/`https:`/`mailto:`. `<a target="_blank">` thêm `rel="noopener noreferrer"`.
- Markdown render ra HTML ⇒ cũng phải lọc (hoặc cấu hình trình render không cho HTML thô).
- Kiểm: nhập `<img src=x onerror=alert(1)>` vào mọi ô được hiển thị lại (tên, bình luận, tiêu đề) trên máy dev.

## 4. Phân quyền và IDOR — kiểm QUYỀN SỞ HỮU ở server

IDOR: `GET /api/orders/123` trả đơn của người khác chỉ vì đổi số. Đăng nhập rồi ≠ có quyền với bản ghi này.
```ts
// SAI: chỉ kiểm đã đăng nhập
const order = await prisma.order.findUnique({ where: { id } });
// ĐÚNG: gắn chủ sở hữu vào chính truy vấn; không thấy ⇒ 404 (không lộ là bản ghi có tồn tại)
const order = await prisma.order.findFirst({ where: { id, userId: req.user.id } });
if (!order) return res.status(404).json({ message: 'Không tìm thấy' });
```
Cẩn thận `req.user.id` phải là trường thật của payload JWT/phiên (có dự án là `req.user.userId`) — sai tên ⇒ `undefined`
⇒ Prisma bỏ qua điều kiện đó và trả TẤT CẢ. Kiểm giá trị trước khi đưa vào `where`.
Tương đương: Spring `@PreAuthorize` + kiểm `order.getUser().getId().equals(currentUserId)`; ASP.NET `[Authorize]` +
`IAuthorizationService`/policy; Django lọc `Order.objects.get(id=id, user=request.user)`; Laravel Policy + `$this->authorize('view', $order)`.
Rà: mọi route nhận id (params/query/body) và mọi route admin. Sửa/xoá cũng phải kiểm như đọc. Hai chỗ kiểm cùng một quyền phải
dùng cùng một hàm — hai luật viết tay sẽ lệch nhau.
Kiểm thật: đăng nhập user A, gọi tài nguyên của user B bằng `curl` với token A ⇒ phải 403/404.

## 5. Xác thực, mật khẩu, phiên, JWT

- Mật khẩu: `bcrypt` (cost ≥ 10) hoặc `argon2id`. Không MD5/SHA-1/SHA-256 trần, không tự thêm salt tay. Spring
  `BCryptPasswordEncoder`, ASP.NET Identity `PasswordHasher`, Django mặc định PBKDF2/argon2, Laravel `Hash::make`.
  So sánh bằng hàm `compare`/`verify` của thư viện (thời gian hằng).
- Thông báo đăng nhập sai chung chung ("Email hoặc mật khẩu không đúng"); quên mật khẩu luôn trả cùng một câu.
- Token đặt lại mật khẩu: ngẫu nhiên mạnh (`crypto.randomBytes(32)`), lưu HASH, hết hạn ngắn, dùng một lần.
- **JWT:** bí mật dài ngẫu nhiên từ biến môi trường; `jwt.verify(token, secret, { algorithms: ['HS256'] })` — cố định
  thuật toán; không bao giờ `jwt.decode` để xác thực. Access token ngắn (15–60 phút) + refresh token (lưu hash ở DB để thu hồi
  được, xoay vòng mỗi lần dùng). Đổi mật khẩu/đăng xuất ⇒ thu hồi refresh token. Không để dữ liệu nhạy cảm trong payload (chỉ base64).
- **Cookie phiên/token:**
  ```js
  res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 7 * 864e5 });
  ```
  `httpOnly` ⇒ JS không đọc được (chống XSS lấy trộm) — nên frontend KHÔNG đọc token từ `document.cookie` được, đừng viết code
  dựa vào đó. Lưu token trong `localStorage` ⇒ một lỗi XSS là mất phiên. Hạn cookie và hạn JWT phải khớp, có đường refresh.
- **CSRF:** xác thực bằng cookie ⇒ cần `SameSite=Lax/Strict` + token CSRF cho form, hoặc kiểm header `Origin`. Django/Laravel/
  Spring Security/ASP.NET có sẵn — đừng tắt nó cho tiện. Xác thực bằng header `Authorization: Bearer` thì CSRF không áp dụng.
  Không bao giờ để GET thay đổi dữ liệu.

## 6. CORS, header bảo mật, cấu hình

- CORS: danh sách origin cụ thể. `origin: '*'` cùng `credentials: true` là sai (trình duyệt chặn), còn phản chiếu mọi `Origin`
  kèm credentials là lỗ hổng. CORS không phải phân quyền — nó không chặn `curl`.
  ```js
  app.use(cors({ origin: ['https://ten-mien.com', 'http://localhost:3000'], credentials: true }));
  ```
- Header: Express `app.use(helmet())`; Next/nginx tự thêm. Tối thiểu: `Strict-Transport-Security` (chỉ khi đã có HTTPS),
  `Content-Security-Policy` (bắt đầu `default-src 'self'` rồi mở dần, thử ở chế độ `Content-Security-Policy-Report-Only`),
  `X-Content-Type-Options: nosniff`, `frame-ancestors 'self'` (chống clickjacking), `Referrer-Policy: strict-origin-when-cross-origin`.
  Kiểm: `curl -sI https://ten-mien.com | grep -iE 'strict-transport|content-security|x-content-type|x-frame|referrer'`.
  Lưu ý reverse proxy (nginx) có thể ghi đè/xoá header app đặt — kiểm bằng `curl` từ ngoài, không tin file cấu hình.
- Prod: tắt debug (`DEBUG=False`, `APP_DEBUG=false`, `ASPNETCORE_ENVIRONMENT=Production`), trang lỗi không lộ stack trace/SQL,
  Swagger/Actuator/phpMyAdmin không mở công khai (Spring: chỉ `management.endpoints.web.exposure.include=health`).

## 7. Upload file, SSRF, rate limit

- **Upload:** giới hạn kích thước ở cả proxy và app (`multer({ limits: { fileSize: 5 * 1024 * 1024 } })`); kiểm loại bằng
  nội dung (magic bytes, thư viện `file-type`), không tin `Content-Type`/đuôi; đặt tên file mới ngẫu nhiên; lưu ngoài thư mục
  web hoặc trên object storage; phục vụ với `Content-Disposition: attachment` hoặc từ một tên miền riêng — KHÔNG để file người
  dùng tải lên được phục vụ như HTML/SVG cùng tên miền (SVG chứa script = XSS). Ảnh: xử lý lại (resize) để bỏ metadata/payload.
- **SSRF:** tính năng "nhập URL để tải ảnh/xem trước link" có thể bị trỏ vào `http://169.254.169.254/` (metadata cloud),
  `http://localhost:5432`, mạng nội bộ. Sửa: chỉ `http/https`, danh sách trắng tên miền khi được; nếu phải mở thì phân giải DNS,
  chặn IP nội bộ/loopback/link-local (IPv4 và IPv6), tắt tự theo redirect (hoặc kiểm lại sau mỗi redirect), đặt timeout và
  giới hạn kích thước. Kiểm IP SAU khi phân giải — kiểm chuỗi hostname thì bị lừa bằng DNS trỏ về 127.0.0.1.
- **Rate limit** cho đăng nhập, đăng ký, quên mật khẩu, gửi OTP, endpoint gọi AI/tốn tiền:
  `express-rate-limit`, Spring + Bucket4j, ASP.NET `AddRateLimiter`, Django `django-ratelimit`, Laravel `throttle:5,1`.
  Sau reverse proxy: cấu hình tin proxy (`app.set('trust proxy', 1)`) — không thì mọi người dùng chung một IP và bị chặn cùng lúc,
  còn tin mọi `X-Forwarded-For` thì kẻ tấn công tự đổi IP.

## 8. Lộ bí mật

- Tìm trong cây làm việc và LỊCH SỬ git:
  ```bash
  git grep -nIE "(api[_-]?key|secret|password|passwd|token)\s*[:=]\s*['\"][^'\"]{8,}" -- ':!*.lock'
  git log -p --all -S 'sk-' --oneline | head -50        # chuỗi đã từng commit, kể cả đã xoá
  git ls-files | grep -iE '(^|/)\.env($|\.)|\.pem$|id_rsa|\.p12$|\.keystore$'
  ```
  Có sẵn `gitleaks`/`trufflehog` thì dùng thêm (kiểm `--help` bản đang cài — cú pháp đổi giữa các bản).
- `.gitignore` phải có `.env`, `.env.*` (trừ `.env.example`). File đã commit rồi thì thêm `.gitignore` KHÔNG gỡ nó khỏi lịch sử.
- **Frontend không giữ bí mật được.** Mọi biến `NEXT_PUBLIC_*`, `VITE_*`, `REACT_APP_*`, `EXPO_PUBLIC_*` bị nhúng vào JS gửi cho trình
  duyệt. Khoá API bên thứ ba (OpenAI, thanh toán, GIPHY, bản đồ có tính tiền) ⇒ chuyển về backend: một route proxy có xác thực +
  rate limit, khoá đọc từ biến môi trường server.
- **Khoá đã lộ (commit lên GitHub, đưa vào bundle, dán vào chat) = coi như đã bị lấy.** Việc đúng: XOAY KHOÁ (tạo khoá mới ở nhà
  cung cấp, thay trên server, thu hồi khoá cũ) — người dùng làm vì cần tài khoản. Viết lại lịch sử git (`git filter-repo`) là
  bước phụ, cần đồng ý, và ép push ảnh hưởng người khác; nó không thay được việc xoay khoá.
- Log: không ghi mật khẩu, token, header `Authorization`, cookie, số thẻ, OTP, toàn bộ `req.body` của route đăng nhập.

## 9. Mức độ và cách báo cáo một lỗ hổng

| Mức | Ví dụ |
|---|---|
| **Nghiêm trọng** | SQL injection, RCE/command injection, bỏ qua đăng nhập, khoá bí mật prod bị lộ công khai |
| **Cao** | IDOR đọc/sửa dữ liệu người khác, XSS lưu trữ, leo quyền lên admin, SSRF tới mạng nội bộ |
| **Trung bình** | CSRF trên thao tác quan trọng, thiếu rate limit đăng nhập, CORS phản chiếu có credentials, upload SVG/HTML |
| **Thấp** | thiếu header bảo mật, lộ phiên bản server, thông báo lỗi tiết lộ email tồn tại |

Mỗi phát hiện:
```
[Cao] IDOR — xem đơn hàng của người khác
Vị trí: src/routes/orders.ts:42 (GET /api/orders/:id)
Nguyên nhân: truy vấn theo id, không lọc userId.
Tái hiện (máy dev): đăng nhập user A, `curl -H "Authorization: Bearer <A>" localhost:3000/api/orders/<id của B>` ⇒ 200 + dữ liệu B.
Sửa: findFirst({ where: { id, userId: req.user.id } }), 404 khi không thấy. Đã thêm test orders.idor.test.ts.
```
Không phóng đại: chưa chứng minh được đường khai thác thì ghi "nghi ngờ, cần kiểm thêm".

## 10. Phụ thuộc có lỗ hổng

```bash
npm audit --omit=dev                 # pnpm audit / yarn npm audit
pip-audit                            # pip install pip-audit
dotnet list package --vulnerable --include-transitive
composer audit
./mvnw org.owasp:dependency-check-maven:check     # chậm lần đầu (tải CSDL lỗ hổng)
```
`npm audit fix` an toàn hơn; `npm audit fix --force` có thể nâng major và làm vỡ app ⇒ hỏi trước, chạy test sau.
Đọc từng cảnh báo: lỗ hổng ở devDependency/công cụ build thường không chạm tới người dùng — nói rõ thay vì báo động.

## 11. Bẫy đã gặp thật

- Ẩn nút admin trên giao diện nhưng API admin không kiểm vai trò ⇒ ai cũng gọi được.
- `req.user.id` không tồn tại (payload dùng `userId`) ⇒ `where: { userId: undefined }` ⇒ trả dữ liệu của mọi người.
- Khoá API để trong `NEXT_PUBLIC_*` "vì chỉ dùng ở client" ⇒ nằm nguyên văn trong file JS công khai.
- Cookie `httpOnly` rồi frontend gọi `getToken()` đọc `document.cookie` ⇒ luôn rỗng, rồi ai đó "sửa" bằng cách bỏ `httpOnly`.
- `sanitize-html` với cấu hình mặc định bỏ mất thẻ định dạng mong muốn ⇒ người ta tắt lọc luôn. Cấu hình danh sách thẻ, đừng tắt.
- Rate limit sau proxy không cấu hình `trust proxy` ⇒ chặn cả web vì mọi request cùng IP của proxy.
- Header bảo mật đặt trong app nhưng nginx `proxy_hide_header`/`add_header` ở tầng trong xoá mất ⇒ luôn kiểm bằng `curl -I` từ ngoài.

## 12. Việc KHÔNG tự làm khi chưa được đồng ý

Viết lại lịch sử git / ép push, xoay hay thu hồi khoá (người dùng làm trên dashboard), `npm audit fix --force`, đổi cơ chế đăng nhập
(làm mọi người bị đăng xuất), bật CSP chặn cứng trên prod, chạy công cụ quét chủ động (ZAP, sqlmap, nuclei) vào bất cứ đâu ngoài
localhost của người dùng, và bất kỳ thao tác nào với hệ thống không thuộc người dùng — cái này không làm kể cả khi được bảo.

## 13. Báo cáo cuối

Danh sách phát hiện xếp theo mức độ (mẫu ở mục 9), cái nào ĐÃ sửa + bằng chứng (test/`curl` trước-sau), cái nào chưa sửa và vì sao,
việc người dùng PHẢI tự làm (xoay khoá nào, thêm biến môi trường nào trên server), và phạm vi đã rà — nói rõ phần CHƯA rà để không
ai tưởng "đã audit xong toàn bộ".
