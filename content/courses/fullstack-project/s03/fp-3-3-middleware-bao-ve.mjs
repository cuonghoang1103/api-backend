/**
 * 3.3 — Middleware xác thực và route được bảo vệ (soạn 24/11/2026, agent fsp).
 * Output THẬT trên máy nhà (jose 6.2.18, express-rate-limit 8.7.5, Express 5.3.0), repo chiase tag ch3.
 * Phát hiện thật 24/11: apiRouter.use(requireAuth) làm MỌI đường dẫn tới sau nó (kể cả không tồn tại) trả 401 thay vì 404 —
 * checkpoint-2 bắt được hồi quy ("route lạ → 401") ⇒ gắn requireAuth từng route + checkpoint-3 gọi mọi route bảo vệ không token;
 * token alg "none", token sửa sub, token sai audience đều 401 TOKEN_KHONG_HOP_LE, token hết hạn 401 TOKEN_HET_HAN;
 * sau đăng xuất access token cũ VẪN 200 (tới 15 phút); giới hạn 10 lần/15 phút dùng chung cho đăng ký + đăng nhập, khoá luôn
 * cả người gõ đúng mật khẩu (429), X-Forwarded-For giả không lách được khi chưa bật trust proxy.
 * Nguồn (GET 200, 24/11/2026): Auth0 blog — Tim McLean "Critical vulnerabilities in JSON Web Token libraries" (cập nhật 20/04/2015);
 * Wikipedia "2022 Optus data breach".
 */
import { lienKet, spring, nguon } from '../_chung.mjs';

const MA_REQUIRE = `import type { NextFunction, Request, Response } from 'express';
import { kiemAccessToken } from '../lib/tokens.js';

// 401 = "tôi không biết bạn là ai" (thiếu/sai/hết hạn token). 403 = "biết bạn là ai, nhưng bạn không được làm việc này".
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const [kieu, token] = (req.get('authorization') ?? '').split(' ');
  if (kieu !== 'Bearer' || !token) {
    res
      .set('WWW-Authenticate', 'Bearer')
      .status(401)
      .json({ error: { code: 'CHUA_DANG_NHAP', message: 'Cần đăng nhập' } });
    return;
  }
  const kq = await kiemAccessToken(token);
  if (!kq.ok) {
    // Mã riêng cho HẾT HẠN: frontend (Chương 6) thấy mã này mới gọi /auth/refresh rồi thử lại
    const code = kq.lyDo === 'HET_HAN' ? 'TOKEN_HET_HAN' : 'TOKEN_KHONG_HOP_LE';
    res
      .set('WWW-Authenticate', \`Bearer error="invalid_token"\`)
      .status(401)
      .json({ error: { code, message: 'Token không dùng được' } });
    return;
  }
  req.user = { id: kq.userId };
  next();
}`;

const MA_EXPRESS_D = `// Mở rộng kiểu Request của Express: sau requireAuth, req.user có mặt (TypeScript biết nhờ "declaration merging").
declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}
export {};`;

const OUT_401 = `$ curl -si localhost:41815/api/me | grep -i "^\\(HTTP\\|WWW\\)"; curl -s localhost:41815/api/me; echo
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer
{"error":{"code":"CHUA_DANG_NHAP","message":"Cần đăng nhập"}}
$ curl -s localhost:41815/api/me -H "Authorization: $TOKEN"; echo                # quên chữ Bearer
{"error":{"code":"CHUA_DANG_NHAP","message":"Cần đăng nhập"}}
$ curl -s localhost:41815/api/me -H "Authorization: Bearer $HET"; echo           # token hết hạn 100 giây trước
{"error":{"code":"TOKEN_HET_HAN","message":"Token không dùng được"}}
$ curl -s localhost:41815/api/me -H "Authorization: Bearer $SUA"; echo           # sửa sub, giữ chữ ký cũ
{"error":{"code":"TOKEN_KHONG_HOP_LE","message":"Token không dùng được"}}
$ echo "$NONE" | cut -d. -f1 | base64 -d 2&gt;/dev/null; echo
{"alg":"none","typ":"JWT"}
$ curl -s localhost:41815/api/me -H "Authorization: Bearer $NONE"; echo          # alg "none", không chữ ký
{"error":{"code":"TOKEN_KHONG_HOP_LE","message":"Token không dùng được"}}
$ curl -s localhost:41815/api/me -H "Authorization: Bearer $AUD"; echo           # đúng khoá, sai audience
{"error":{"code":"TOKEN_KHONG_HOP_LE","message":"Token không dùng được"}}`;

const MA_USER_SVC = `import { prisma } from '../db/prisma.js';
import { HttpError } from '../lib/http-error.js';

export async function layToi(userId: string) {
  const u = await prisma.user.findUnique({ where: { id: userId } }); // omit toàn cục: không có passwordHash
  // Token còn hạn nhưng tài khoản đã bị xoá ⇒ 401 (không phải 404): danh tính trong token không còn giá trị
  if (!u) throw new HttpError(401, 'TAI_KHOAN_KHONG_CON', 'Tài khoản không còn tồn tại');
  return u;
}

// Danh sách phiên đăng nhập (refresh token còn sống) của MỘT người — chỉ chính người đó được xem.
export async function layPhien(nguoiXem: string, userId: string) {
  if (nguoiXem !== userId)
    throw new HttpError(403, 'KHONG_DUOC_PHEP', 'Bạn không được xem phiên của người khác');
  return prisma.refreshToken.findMany({
    where: { userId, revokedAt: null, expiresAt: { gt: new Date() } },
    select: { id: true, createdAt: true, expiresAt: true, userAgent: true },
    orderBy: { createdAt: 'desc' },
  });
}`;

const OUT_403 = `$ curl -s localhost:41815/api/users/$CHI_ID/sessions -H "Authorization: Bearer $TOKEN" | head -c 160; echo
[{"id":"01a20d8a-62c8-75b7-b20e-51dcc5c6fdbf","createdAt":"2026-11-24T12:31:42.791Z","expiresAt":"2026-12-24T12:31:42.791Z","userAgent":"curl/8.18.0"},{"id":"01
$ curl -s -w "  [HTTP %{http_code}]\\n" localhost:41815/api/users/$CHI_ID/sessions -H "Authorization: Bearer $AN_TOKEN"     # An xem phiên của Chi
{"error":{"code":"KHONG_DUOC_PHEP","message":"Bạn không được xem phiên của người khác"}}  [HTTP 403]
$ curl -s -w "  [HTTP %{http_code}]\\n" localhost:41815/api/users/$CHI_ID/sessions     # không token
{"error":{"code":"CHUA_DANG_NHAP","message":"Cần đăng nhập"}}  [HTTP 401]`;

const MA_ROUTES_USE = `// --- Cần đăng nhập: mọi route khai báo SAU dòng này đi qua requireAuth ---
apiRouter.use(requireAuth);
apiRouter.get('/me', getToi);
apiRouter.get('/users/:id/sessions', getPhien);`;

const OUT_BAY_404 = `$ node scripts/checkpoint-2.mjs      # sau khi thêm apiRouter.use(requireAuth)
(… các dòng ✔ lược bớt …)
== 5. API sống và dùng được
  ✘ route lạ → 401 JSON (CHUA_DANG_NHAP)`;

const MA_ROUTES = `import { Router } from 'express';
import { getInfo } from '../controllers/info.controller.js';
import { getHealth } from '../controllers/health.controller.js';
import { postDangKy, postDangNhap, postLamMoi, postDangXuat } from '../controllers/auth.controller.js';
import { getToi, getPhien } from '../controllers/user.controller.js';
import { validateBody } from '../middlewares/validate.js';
import { requireAuth } from '../middlewares/require-auth.js';
import { gioiHanXacThuc } from '../middlewares/rate-limit.js';
import { dangKySchema, dangNhapSchema } from '../schemas/auth.schema.js';

// Route: chỉ ánh xạ METHOD + đường dẫn ⇒ (middleware…) ⇒ controller. Đọc tệp này là biết route nào CÔNG KHAI, route nào cần đăng nhập.
export const apiRouter = Router();

// --- Công khai ---
apiRouter.get('/', getInfo);
apiRouter.get('/health', getHealth);
apiRouter.post('/auth/register', gioiHanXacThuc, validateBody(dangKySchema), postDangKy);
apiRouter.post('/auth/login', gioiHanXacThuc, validateBody(dangNhapSchema), postDangNhap);
apiRouter.post('/auth/refresh', postLamMoi); // xác thực bằng cookie refresh, không cần access token
apiRouter.post('/auth/logout', postDangXuat);

// --- Cần đăng nhập: GẮN requireAuth vào TỪNG route. KHÔNG dùng apiRouter.use(requireAuth): nó chạy cho MỌI đường dẫn
// tới sau nó, kể cả đường không tồn tại ⇒ route lạ trả 401 thay vì 404 (Checkpoint 2 bắt được, bài 3.3).
// Quên gắn = route công khai ⇒ checkpoint-3 gọi từng route dưới đây không token, phải ra 401.
apiRouter.get('/me', requireAuth, getToi);
apiRouter.get('/users/:id/sessions', requireAuth, getPhien);`;

const OUT_LOGOUT = `$ curl -s -b jar.txt -c jar.txt -X POST localhost:41815/api/auth/logout -w "HTTP %{http_code}\\n"; grep -c "rt" jar.txt
HTTP 204
0
$ curl -s -b jar.txt -X POST localhost:41815/api/auth/refresh; echo
{"error":{"code":"THIEU_REFRESH","message":"Chưa đăng nhập"}}
$ curl -s localhost:41815/api/me -H "Authorization: Bearer $TOKEN" -w "  [HTTP %{http_code}]\\n"     # access token CŨ, sau đăng xuất
{"id":"01a20d88-84fa-7b3d-9c29-26c548e4fe29","email":"chi@mail.com","displayName":"Chi Lê","createdAt":"2026-11-24T12:29:40.442Z"}  [HTTP 200]`;

const MA_RATE = `import { rateLimit } from 'express-rate-limit';

// Chặn dò mật khẩu: tối đa 10 lần thử đăng nhập/đăng ký mỗi 15 phút cho mỗi IP. Bộ đếm nằm trong RAM của tiến trình:
// đủ cho một máy chủ; chạy nhiều bản (Chương 11) thì cần kho chung (Redis) — ghi chú lại, chưa làm.
export const gioiHanXacThuc = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: Number(process.env.AUTH_RATE_LIMIT ?? 10),
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: { code: 'QUA_NHIEU_LAN', message: 'Thử quá nhiều lần, hãy đợi 15 phút' } },
});`;

const OUT_429 = `$ for i in $(seq 1 12); do curl -s -o /dev/null -w "%{http_code} " -X POST localhost:41815/api/auth/login -H "Content-Type: application/json" -d '{"email":"chi@mail.com","password":"doan-thu-'$i'"}'; done; echo
401 401 401 401 401 401 401 401 401 401 429 429 
$ curl -si -X POST localhost:41815/api/auth/login -H "Content-Type: application/json" -d '{"email":"chi@mail.com","password":"mat-khau-cua-chi"}' | grep -i "^\\(HTTP\\|ratelimit\\|retry\\)\\|error"
HTTP/1.1 429 Too Many Requests
RateLimit: "10-in-15min"; r=0; t=900
RateLimit-Policy: "10-in-15min"; q=10; w=900; pk=:YmIwY2Q1MTM2YWU1:
Retry-After: 900
{"error":{"code":"QUA_NHIEU_LAN","message":"Thử quá nhiều lần, hãy đợi 15 phút"}}
$ curl -s -o /dev/null -w "%{http_code}\\n" -X POST localhost:41815/api/auth/login -H "X-Forwarded-For: 1.2.3.4" -H "Content-Type: application/json" -d '{"email":"chi@mail.com","password":"x"}'     # giả IP khác?
429`;

const THE = [
  lienKet({ khoa: 'authentication', bai: 'auth-4-2-truong-alg', title: 'Authentication 4.2 — Cái token TỰ NÓI cho máy chủ cách kiểm nó', sub: 'alg=none và nhầm thuật toán, chuyên sâu.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'authentication', bai: 'auth-5-3-nam-su-kien', title: 'Authentication 5.3 — Năm sự kiện bắt buộc phải kết thúc một phiên', sub: 'Đăng xuất, đổi mật khẩu… và cửa sổ 15 phút của access token.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-8-3-requireauth-phan-quyen', title: 'Node.js 8.3 — requireAuth, phân quyền, và xoá bỏ AUTHOR_ID = 1', sub: 'Bài khái niệm gốc của middleware bảo vệ.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-8-4-cookie-csrf-thu-hoi', title: 'Node.js 8.4 — Cookie, CSRF, thu hồi phiên và chặn dò mật khẩu', sub: 'Giới hạn tần suất và thu hồi, chuyên sâu.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'api-design', bai: 'api-1-3-status', title: 'API Design 1.3 — Mã trạng thái có ý nghĩa: 401 và 403…', sub: 'Chọn đúng mã trạng thái cho từng tình huống.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📰', 'Auth0 blog — Critical vulnerabilities in JSON Web Token libraries (Tim McLean, 2015)', 'Thuật toán "none" và nhầm RS256/HS256: thư viện tin trường alg do token tự khai.', 'https://auth0.com/blog/critical-vulnerabilities-in-json-web-token-libraries/'),
  nguon('📰', 'Wikipedia — 2022 Optus data breach', '09/2022: tới 10 triệu khách hàng bị lộ dữ liệu; người trong nội bộ và Chính phủ Úc nói lỗi con người làm hở một API, Optus phủ nhận và gọi là tấn công tinh vi.', 'https://en.wikipedia.org/wiki/2022_Optus_data_breach'),
  nguon('📘', 'MDN — WWW-Authenticate', 'Header đi kèm 401: cho client biết cần kiểu xác thực nào.', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/WWW-Authenticate'),
  nguon('📘', 'Express — Express behind proxies', 'trust proxy và X-Forwarded-For khi chạy sau Nginx.', 'https://expressjs.com/en/guide/behind-proxies.html'),
].join('\n');

const MERMAID = `flowchart TD
  R["Request tới route bảo vệ"] --> H{"Có header Authorization: Bearer …?"}
  H -->|không| U1["401 CHUA_DANG_NHAP"]
  H -->|có| V{"jwtVerify: HS256, chữ ký, exp, iss, aud"}
  V -->|hết hạn| U2["401 TOKEN_HET_HAN"]
  V -->|sai bất kỳ| U3["401 TOKEN_KHONG_HOP_LE"]
  V -->|đúng| S["req.user = { id }"]
  S --> Q{"Service: người này được làm việc này?"}
  Q -->|không| F["403 KHONG_DUOC_PHEP"]
  Q -->|được| OK["200"]`;

export default {
  title: '3.3 — Auth middleware and protected routes|||3.3 — Middleware xác thực và route được bảo vệ',
  slug: 'fp-3-3-middleware-bao-ve',
  type: 'LESSON',
  isFreePreview: true,
  description: 'requireAuth kiểm JWT và gắn req.user (declaration merging); sáu kiểu token hỏng đều 401 kể cả alg "none"; 401 khác 403 (phiên của người khác); bẫy thật apiRouter.use(requireAuth) biến 404 thành 401 và checkpoint cũ bắt được; đăng xuất rồi access token vẫn chạy 15 phút (đo) và các cách đánh đổi; giới hạn tần suất 10 lần/15 phút, IP dùng chung, trust proxy — kèm vụ JWT "none" 2015 và Optus 2022.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Protect</span>
<h2>One middleware between the internet and your users' data — and every way a token can be wrong</h2>
<p class="lead">Login now produces tokens; this lesson makes them <em>mean</em> something. A middleware checks the access token on protected routes and tells the rest of the code who is calling. We throw six kinds of broken tokens at it, separate "who are you?" (401) from "you may not" (403), measure what logout really ends, and add the rate limit promised in lesson 3.1. We also hit a real regression — our own Chapter 2 checkpoint caught it.</p>

<pre><code class="language-mermaid">${MERMAID}</code></pre>

<h3>1. <code>requireAuth</code> and <code>req.user</code></h3>
<pre><code class="language-ts">${MA_REQUIRE}</code></pre>
<pre><code class="language-ts">${MA_EXPRESS_D}</code></pre>
<p>The middleware does exactly one thing: turn a header into <code>req.user = { id }</code> or stop the request with 401. It does not load the user from the database — that would cost a query on every request and defeat the point of a stateless access token. The <code>.d.ts</code> file tells TypeScript that <code>Request</code> now has an optional <code>user</code>. <code>WWW-Authenticate</code> is the standard header that accompanies a 401. A separate code for an <em>expired</em> token matters: Chapter 6's frontend refreshes only on <code>TOKEN_HET_HAN</code>, not on a forged token.</p>

<h3>2. Six wrong tokens</h3>
<div class="out">${OUT_401}</div>
<p>The token with <code>sub</code> changed to another user kept its original signature — the signature covers header and payload, so any change breaks it. The <code>"alg":"none"</code> token has no signature at all. The wrong-audience token is perfectly signed with our key but was minted "for another app". All refused, because <code>jwtVerify</code> is called with a fixed algorithm, issuer and audience.</p>

<h3>🕵️ Hacker's corner — "alg": "none", 2015</h3>
<p>In 2015 Tim McLean published, on the Auth0 blog, that several popular JWT libraries trusted the <code>alg</code> field inside the token. Send <code>"alg":"none"</code> with an empty signature and some libraries accepted any payload — anyone could log in as anyone. A second variant: a server using RS256 (public/private key) could be tricked into verifying with HS256 using the <em>public</em> key as the HMAC secret, which every attacker has. Libraries were patched, but the lesson stays: the server decides the algorithm, never the token. You just watched <code>jose</code> refuse it.</p>

<h3>3. 401 or 403?</h3>
<pre><code class="language-ts">${MA_USER_SVC}</code></pre>
<div class="out">${OUT_403}</div>
<p><strong>401</strong>: "I do not know who you are" — missing, broken or expired credentials; logging in again might help. <strong>403</strong>: "I know exactly who you are, and you may not do this" — logging in again will not help. An's token is valid, but the sessions belong to Chi. Notice the ownership check lives in the <em>service</em>, not in a route: Chapter 4 does the same for "only the author may edit a post", and Spring Boot lesson 10.2 shows what happens when it is forgotten (IDOR).</p>

<h3>4. The trap: one line that turned 404 into 401</h3>
<p>Our first version protected routes like this — tidy and "secure by default":</p>
<pre><code class="language-ts">${MA_ROUTES_USE}</code></pre>
<p>Then we ran the Chapter 2 checkpoint, as every chapter does:</p>
<div class="out">${OUT_BAY_404}</div>
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>router.use(middleware)</code> runs for every path that reaches it, including paths that do not exist.</strong> An unknown URL without a token never reaches the 404 handler; it is stopped by <code>requireAuth</code> with 401. The API contract from Chapter 2 ("unknown route → 404 JSON") silently broke. This is exactly why each checkpoint runs the previous one.</p></div>
<p>Two honest options. Keep <code>use(requireAuth)</code> and accept 401 for unknown URLs when anonymous (Spring Security's <code>anyRequest().authenticated()</code> behaves like that). Or attach <code>requireAuth</code> to each protected route and keep 404. We chose the second — it keeps the contract and is the usual Express style — and paid for its weakness (forgetting it makes a route public) with a test: Checkpoint 3 calls every protected route without a token and expects 401. When Chapter 4 adds routes, the list grows.</p>
<pre><code class="language-ts">${MA_ROUTES}</code></pre>

<h3>5. What logout really ends</h3>
<div class="out">${OUT_LOGOUT}</div>
<p>Logout revoked the refresh family and deleted the cookie: refresh is now impossible. But the access token in hand still answered <strong>200</strong>. Nothing is wrong — the server does not store access tokens, so it cannot forget one. The window is at most 15 minutes. If that is not acceptable for an action (changing password, banning a user), the options are: shorter access tokens (more refreshes), a per-user <code>tokenVersion</code> checked in the database on sensitive routes, or a deny-list of token ids until they expire. ChiaSe accepts 15 minutes and writes it down in the README — a decision, not an accident.</p>

<h3>6. Rate limiting</h3>
<pre><code class="language-ts">${MA_RATE}</code></pre>
<div class="out">${OUT_429}</div>
<p>Ten guesses, then 429 with <code>Retry-After: 900</code> and the standard <code>RateLimit</code> headers. Three things the output shows. The limit counts <em>successful</em> attempts too, and register and login share one bucket (same limiter object) — fine for us. The real owner typing the right password was also refused: rate limiting protects the account at the cost of locking out everyone behind the same IP. At FPT University's dorm or a company office, hundreds of people share one public IP; a production system adds a per-account limit and, later, CAPTCHA. Finally, a fake <code>X-Forwarded-For</code> did not bypass anything — because Express is not told to trust proxies. In Chapter 11 the API sits behind Nginx; without <code>app.set('trust proxy', 1)</code> every user would appear as Nginx's IP and share a single bucket, and with <code>trust proxy</code> set carelessly an attacker could pick their own IP with that header.</p>

<h3>🕵️ Hacker's corner — Optus, 2022</h3>
<p>In September 2022 Australian telco Optus lost data of up to 10 million current and former customers. An insider and the Australian government said a human error had left an API reachable without proper authentication; Optus denied this and described a sophisticated attack. Whichever account is right, the scenario it describes is the cheapest breach there is: one route that should have been behind <code>requireAuth</code> and was not. That is why our checkpoint calls every protected route anonymously — a test, not a memory.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">route declares requireAuth</span><span class="lz-d">per route — keeps unknown paths at 404</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">header</span><span class="lz-d">missing or not "Bearer …" ⇒ 401 CHUA_DANG_NHAP</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">jwtVerify</span><span class="lz-d">fixed HS256 + iss + aud; expired ⇒ TOKEN_HET_HAN, anything else ⇒ TOKEN_KHONG_HOP_LE</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">req.user = { id }</span><span class="lz-d">no database query</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">service</span><span class="lz-d">ownership check ⇒ 403 KHONG_DUOC_PHEP or the data</span></div>
</div>

<h3>In everyday life</h3>
<p>401 is the security guard who does not let you into the building without a badge. 403 is the receptionist on the 5th floor who knows you work here but will not open the director's office. Logging out is handing back your badge — but the day pass you printed this morning still opens the lobby turnstile until it expires tonight.</p>

<h3>On a real job</h3>
<p>Code review checklists at outsourcing companies almost always include "every new endpoint: who may call it, and where is that checked?". Expect testers to file "logout does not invalidate the token" — answer with the measured window and the decision in the README. And when a client says "users at our office keep getting 429", you now know to ask whether they all share one IP and whether the API trusts its proxy.</p>

${spring(true, 'Spring Security puts JWT checking in a filter (<code>BearerTokenAuthenticationFilter</code> via <code>oauth2ResourceServer().jwt()</code>) and authorization in <code>SecurityFilterChain</code> rules or <code>@PreAuthorize</code>; it returns 401 via <code>AuthenticationEntryPoint</code> and 403 via <code>AccessDeniedHandler</code>. Rate limiting is not built in (Bucket4j is common).', [
  ['sb-9-4-jwt-filter', 'Spring Boot 9.4 — Checking the JWT on every request'],
  ['sb-9-6-phan-quyen-role', 'Spring Boot 9.6 — Roles and method-level authorization'],
  ['sb-10-5-rate-limit-secret', 'Spring Boot 10.5 — Rate limiting, secrets and exposed Actuator'],
])}

<h3>🎤 What the interviewer will ask</h3>
<ol>
<li><strong>"401 vs 403?"</strong> — 401: not authenticated (missing/invalid/expired credentials). 403: authenticated but not allowed.</li>
<li><strong>"Why can't you revoke a JWT access token, and what do you do about it?"</strong> — The server does not store it; keep it short, add a version check or deny-list where needed.</li>
<li><strong>"How do you make sure no endpoint is accidentally public?"</strong> — Deny by default, or explicit per-route guards plus an automated test hitting every protected route without credentials.</li>
<li><strong>"What is the 'alg none' attack?"</strong> — Trusting the token's own algorithm; fix by fixing the algorithm server-side.</li>
<li><strong>"Rate limiting behind a reverse proxy?"</strong> — Configure trust proxy precisely, otherwise all clients share the proxy IP, or clients spoof X-Forwarded-For.</li>
</ol>

<h3>🧪 Lab 3.3 (60 minutes)</h3>
<div class="callout ok">
<ol>
<li>Write <code>requireAuth</code>, <code>types/express.d.ts</code>, <code>GET /api/me</code> and <code>GET /api/users/:id/sessions</code>.</li>
<li>Write a small script that mints the broken tokens (expired, <code>none</code>, wrong audience) with your key; reproduce all six 401 results.</li>
<li>Reproduce the 403 with the two seed users.</li>
<li>Try <code>apiRouter.use(requireAuth)</code> first, run <code>node scripts/checkpoint-2.mjs</code> and watch it fail; then switch to per-route guards.</li>
<li>Log out and measure how long the old access token keeps working (shorten <code>ACCESS_TTL_S=60</code> to see it die).</li>
<li>Add the rate limiter; reproduce the 429 and the failed X-Forwarded-For trick.</li>
</ol>
<p><strong>Done when:</strong> unknown routes still return 404, every protected route returns 401 without a token, and you can explain why the old access token still worked after logout.</p>
<p><strong>Scoring (10):</strong> middleware + typing (2) · six 401 cases (2) · 403 in the service (2) · 404 contract kept + test (2) · logout window measured (1) · rate limit (1).</p>
</div>
<details><summary>Solution</summary>
<p>Tag <code>ch3</code>: <code>middlewares/require-auth.ts</code>, <code>middlewares/rate-limit.ts</code>, <code>services/user.service.ts</code>, <code>routes/index.ts</code>. If <code>req.user</code> is "possibly undefined" in a controller, that is TypeScript doing its job: use <code>req.user!</code> only in routes that passed <code>requireAuth</code>, or write a helper that throws. If your expired token returns <code>TOKEN_KHONG_HOP_LE</code>, you are catching errors before checking <code>instanceof errors.JWTExpired</code>.</p>
</details>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">middleware</span><span class="v">Function run before the controller; may stop the request or enrich it.</span></div>
  <div class="kv"><span class="k">declaration merging</span><span class="v">Adding fields to an existing TypeScript interface (Express.Request).</span></div>
  <div class="kv"><span class="k">401 Unauthorized</span><span class="v">Not authenticated. Comes with WWW-Authenticate.</span></div>
  <div class="kv"><span class="k">403 Forbidden</span><span class="v">Authenticated, not allowed.</span></div>
  <div class="kv"><span class="k">429 Too Many Requests</span><span class="v">Rate limit reached; Retry-After says when to come back.</span></div>
  <div class="kv"><span class="k">trust proxy</span><span class="v">Express setting deciding whether X-Forwarded-For is believed.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>requireAuth</code>: header → verified token → <code>req.user</code>, or 401 with a distinct code for expiry.</li>
<li>Fixed algorithm, issuer, audience: forged, "none" and foreign tokens all fail.</li>
<li>401 = who are you; 403 = not allowed; ownership checks live in services.</li>
<li><code>router.use(requireAuth)</code> turned 404 into 401 — per-route guards + a test instead.</li>
<li>Logout ends refresh, not the 15-minute access token; rate limit 10/15 min with known trade-offs.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bảo vệ</span>
<h2>Một middleware đứng giữa Internet và dữ liệu người dùng — và mọi kiểu một token có thể sai</h2>
<p class="lead">Đăng nhập giờ đã sinh ra token; bài này làm cho token <em>có nghĩa</em>. Một middleware kiểm access token ở các route được bảo vệ và báo cho phần mã còn lại biết ai đang gọi. Ta ném sáu kiểu token hỏng vào nó, tách "bạn là ai?" (401) khỏi "bạn không được" (403), đo xem đăng xuất thật sự kết thúc cái gì, và thêm giới hạn tần suất đã hứa ở bài 3.1. Ta còn vấp một hồi quy thật — chính checkpoint Chương 2 bắt được.</p>

<pre><code class="language-mermaid">${MERMAID}</code></pre>

<h3>1. <code>requireAuth</code> và <code>req.user</code></h3>
<pre><code class="language-ts">${MA_REQUIRE}</code></pre>
<pre><code class="language-ts">${MA_EXPRESS_D}</code></pre>
<p>Middleware làm đúng một việc: biến một header thành <code>req.user = { id }</code>, hoặc dừng request với 401. Nó không tải người dùng từ CSDL — làm vậy thì mọi request tốn một truy vấn và mất luôn ý nghĩa của access token không trạng thái. Tệp <code>.d.ts</code> báo cho TypeScript rằng <code>Request</code> giờ có thêm <code>user</code> tuỳ chọn. <code>WWW-Authenticate</code> là header chuẩn đi kèm 401. Mã riêng cho token <em>hết hạn</em> là quan trọng: frontend ở Chương 6 chỉ refresh khi gặp <code>TOKEN_HET_HAN</code>, không refresh với token giả mạo.</p>

<h3>2. Sáu kiểu token sai</h3>
<div class="out">${OUT_401}</div>
<p>Token bị sửa <code>sub</code> sang người khác vẫn giữ chữ ký gốc — chữ ký phủ cả header lẫn payload, sửa gì cũng làm nó hỏng. Token <code>"alg":"none"</code> không có chữ ký nào. Token sai audience được ký đúng bằng khoá của ta nhưng làm ra "cho ứng dụng khác". Tất cả bị từ chối, vì <code>jwtVerify</code> được gọi với thuật toán, issuer và audience cố định.</p>

<h3>🕵️ Góc hacker — "alg": "none", 2015</h3>
<p>Năm 2015, Tim McLean công bố trên blog Auth0 rằng nhiều thư viện JWT phổ biến tin vào trường <code>alg</code> nằm trong chính token. Gửi <code>"alg":"none"</code> với chữ ký rỗng là vài thư viện chấp nhận mọi payload — ai cũng đăng nhập được thành bất kỳ ai. Biến thể thứ hai: server dùng RS256 (cặp khoá công khai/bí mật) có thể bị lừa kiểm bằng HS256 với <em>khoá công khai</em> làm bí mật HMAC, thứ mà kẻ tấn công nào cũng có. Các thư viện đã vá, nhưng bài học còn nguyên: server quyết định thuật toán, không bao giờ để token quyết. Bạn vừa thấy <code>jose</code> từ chối nó.</p>

<h3>3. 401 hay 403?</h3>
<pre><code class="language-ts">${MA_USER_SVC}</code></pre>
<div class="out">${OUT_403}</div>
<p><strong>401</strong>: "Tôi không biết bạn là ai" — thiếu, hỏng hoặc hết hạn thông tin xác thực; đăng nhập lại có thể giúp. <strong>403</strong>: "Tôi biết rõ bạn là ai, và bạn không được làm việc này" — đăng nhập lại cũng không giúp gì. Token của An hợp lệ, nhưng các phiên là của Chi. Để ý phép kiểm quyền sở hữu nằm trong <em>service</em>, không nằm ở route: Chương 4 làm y như vậy cho "chỉ tác giả được sửa bài viết", và bài 10.2 của khoá Spring Boot cho thấy chuyện gì xảy ra khi quên nó (IDOR).</p>

<h3>4. Cái bẫy: một dòng biến 404 thành 401</h3>
<p>Bản đầu tiên của ta bảo vệ route thế này — gọn gàng và "an toàn mặc định":</p>
<pre><code class="language-ts">${MA_ROUTES_USE}</code></pre>
<p>Rồi ta chạy checkpoint Chương 2, như mọi chương vẫn làm:</p>
<div class="out">${OUT_BAY_404}</div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>router.use(middleware)</code> chạy cho MỌI đường dẫn đi tới nó, kể cả đường dẫn không tồn tại.</strong> Một URL lạ không kèm token không bao giờ tới được bộ xử lý 404; nó bị <code>requireAuth</code> chặn lại với 401. Hợp đồng API từ Chương 2 ("route lạ → 404 JSON") đã vỡ mà không ai hay. Đây đúng là lý do mỗi checkpoint chạy lại checkpoint trước nó.</p></div>
<p>Có hai lựa chọn trung thực. Giữ <code>use(requireAuth)</code> và chấp nhận 401 cho URL lạ khi chưa đăng nhập (<code>anyRequest().authenticated()</code> của Spring Security cư xử như vậy). Hoặc gắn <code>requireAuth</code> vào từng route bảo vệ và giữ 404. Ta chọn cách thứ hai — giữ hợp đồng và là phong cách Express quen thuộc — và trả giá cho điểm yếu của nó (quên gắn là route thành công khai) bằng một phép thử: Checkpoint 3 gọi mọi route bảo vệ không kèm token và đòi 401. Chương 4 thêm route thì danh sách dài thêm.</p>
<pre><code class="language-ts">${MA_ROUTES}</code></pre>

<h3>5. Đăng xuất thật sự kết thúc cái gì</h3>
<div class="out">${OUT_LOGOUT}</div>
<p>Đăng xuất đã thu hồi họ refresh và xoá cookie: không thể refresh nữa. Nhưng access token đang cầm vẫn trả <strong>200</strong>. Không có gì sai — server không lưu access token, nên không thể "quên" một cái. Khoảng hở tối đa 15 phút. Nếu điều đó không chấp nhận được với một hành động (đổi mật khẩu, khoá người dùng), các lựa chọn là: access token ngắn hơn (refresh nhiều hơn), một cột <code>tokenVersion</code> theo người dùng được kiểm trong CSDL ở các route nhạy cảm, hoặc danh sách chặn id token cho tới khi chúng hết hạn. ChiaSe chấp nhận 15 phút và ghi điều đó vào README — một quyết định, không phải một sự cố.</p>

<h3>6. Giới hạn tần suất</h3>
<pre><code class="language-ts">${MA_RATE}</code></pre>
<div class="out">${OUT_429}</div>
<p>Mười lần đoán, rồi 429 kèm <code>Retry-After: 900</code> và các header <code>RateLimit</code> chuẩn. Output cho thấy ba điều. Giới hạn đếm cả lần <em>thành công</em>, và đăng ký với đăng nhập dùng chung một bộ đếm (cùng một đối tượng limiter) — với ta là ổn. Chủ tài khoản thật gõ đúng mật khẩu cũng bị từ chối: giới hạn tần suất bảo vệ tài khoản bằng cái giá khoá luôn mọi người sau cùng một IP. Ở ký túc xá Đại học FPT hay một văn phòng công ty, hàng trăm người dùng chung một IP công cộng; hệ thống production thêm giới hạn theo tài khoản và, về sau, CAPTCHA. Cuối cùng, <code>X-Forwarded-For</code> giả không lách được gì — vì Express chưa được bảo là tin proxy. Ở Chương 11, API đứng sau Nginx; thiếu <code>app.set('trust proxy', 1)</code> thì mọi người dùng hiện ra cùng IP của Nginx và chung một bộ đếm, còn đặt <code>trust proxy</code> cẩu thả thì kẻ tấn công tự chọn IP của mình bằng chính header đó.</p>

<h3>🕵️ Góc hacker — Optus, 2022</h3>
<p>Tháng 9/2022, nhà mạng Úc Optus bị lộ dữ liệu của tới 10 triệu khách hàng hiện tại và cũ. Một người trong nội bộ và Chính phủ Úc nói lỗi con người đã để một API truy cập được mà không xác thực đúng cách; Optus phủ nhận và mô tả đó là một cuộc tấn công tinh vi. Dù bên nào đúng, kịch bản được mô tả là kiểu rò rỉ rẻ nhất có thể: một route lẽ ra phải đứng sau <code>requireAuth</code> mà không. Đó là lý do checkpoint của ta gọi mọi route bảo vệ khi chưa đăng nhập — một phép thử, không phải một trí nhớ.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">route khai báo requireAuth</span><span class="lz-d">từng route — đường lạ vẫn 404</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">header</span><span class="lz-d">thiếu hoặc không phải "Bearer …" ⇒ 401 CHUA_DANG_NHAP</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">jwtVerify</span><span class="lz-d">cố định HS256 + iss + aud; hết hạn ⇒ TOKEN_HET_HAN, còn lại ⇒ TOKEN_KHONG_HOP_LE</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">req.user = { id }</span><span class="lz-d">không truy vấn CSDL</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">service</span><span class="lz-d">kiểm quyền sở hữu ⇒ 403 KHONG_DUOC_PHEP hoặc trả dữ liệu</span></div>
</div>

<h3>Liên hệ đời thường</h3>
<p>401 là anh bảo vệ không cho bạn vào toà nhà khi không có thẻ. 403 là chị lễ tân tầng 5 biết bạn làm ở đây nhưng không mở phòng giám đốc cho bạn. Đăng xuất là trả lại thẻ nhân viên — nhưng tấm vé ngày bạn in sáng nay vẫn mở được cửa xoay ở sảnh cho tới khi hết hạn tối nay.</p>

<h3>Đi làm thật</h3>
<p>Danh sách review mã ở các công ty outsourcing gần như luôn có dòng "mỗi endpoint mới: ai được gọi, kiểm ở đâu?". Hãy chờ tester báo "đăng xuất không vô hiệu token" — trả lời bằng khoảng hở đã đo và quyết định ghi trong README. Và khi khách hàng nói "người dùng ở văn phòng chúng tôi cứ bị 429", bạn biết phải hỏi xem họ có dùng chung một IP không, và API có tin proxy của nó không.</p>

${spring(false, 'Spring Security đặt việc kiểm JWT trong một filter (<code>BearerTokenAuthenticationFilter</code> qua <code>oauth2ResourceServer().jwt()</code>) và phân quyền trong luật của <code>SecurityFilterChain</code> hoặc <code>@PreAuthorize</code>; trả 401 qua <code>AuthenticationEntryPoint</code> và 403 qua <code>AccessDeniedHandler</code>. Giới hạn tần suất không có sẵn (hay dùng Bucket4j).', [
  ['sb-9-4-jwt-filter', 'Spring Boot 9.4 — Kiểm JWT trên mọi request'],
  ['sb-9-6-phan-quyen-role', 'Spring Boot 9.6 — Vai trò và phân quyền cấp phương thức'],
  ['sb-10-5-rate-limit-secret', 'Spring Boot 10.5 — Giới hạn tần suất, bí mật và lộ Actuator'],
])}

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"401 khác 403 thế nào?"</strong> — 401: chưa xác thực (thiếu/sai/hết hạn thông tin xác thực). 403: đã xác thực nhưng không được phép.</li>
<li><strong>"Sao không thu hồi được access token JWT, và bạn xử lý thế nào?"</strong> — Server không lưu nó; giữ nó ngắn, thêm kiểm phiên bản hoặc danh sách chặn ở chỗ cần.</li>
<li><strong>"Làm sao chắc không endpoint nào vô tình thành công khai?"</strong> — Chặn mặc định, hoặc gắn bảo vệ từng route cộng một phép thử tự động gọi mọi route bảo vệ mà không có thông tin xác thực.</li>
<li><strong>"Tấn công 'alg none' là gì?"</strong> — Tin thuật toán do token tự khai; sửa bằng cách cố định thuật toán phía server.</li>
<li><strong>"Giới hạn tần suất sau reverse proxy?"</strong> — Cấu hình trust proxy chính xác, nếu không mọi client chung IP của proxy, hoặc client tự giả X-Forwarded-For.</li>
</ol>

<h3>🧪 Lab 3.3 (60 phút)</h3>
<div class="callout ok">
<ol>
<li>Viết <code>requireAuth</code>, <code>types/express.d.ts</code>, <code>GET /api/me</code> và <code>GET /api/users/:id/sessions</code>.</li>
<li>Viết một script nhỏ tạo các token hỏng (hết hạn, <code>none</code>, sai audience) bằng khoá của bạn; tái hiện đủ sáu kết quả 401.</li>
<li>Tái hiện 403 với hai người dùng mẫu.</li>
<li>Thử <code>apiRouter.use(requireAuth)</code> trước, chạy <code>node scripts/checkpoint-2.mjs</code> và xem nó trượt; rồi chuyển sang gắn từng route.</li>
<li>Đăng xuất rồi đo access token cũ còn dùng được bao lâu (đặt <code>ACCESS_TTL_S=60</code> để thấy nó chết).</li>
<li>Thêm bộ giới hạn tần suất; tái hiện 429 và mẹo X-Forwarded-For thất bại.</li>
</ol>
<p><strong>Xong khi:</strong> route lạ vẫn trả 404, mọi route bảo vệ trả 401 khi không có token, và bạn giải thích được vì sao access token cũ vẫn chạy sau khi đăng xuất.</p>
<p><strong>Thang điểm (10):</strong> middleware + kiểu (2) · sáu trường hợp 401 (2) · 403 trong service (2) · giữ hợp đồng 404 + phép thử (2) · đo khoảng hở sau đăng xuất (1) · giới hạn tần suất (1).</p>
</div>
<details><summary>Lời giải</summary>
<p>Tag <code>ch3</code>: <code>middlewares/require-auth.ts</code>, <code>middlewares/rate-limit.ts</code>, <code>services/user.service.ts</code>, <code>routes/index.ts</code>. Nếu <code>req.user</code> báo "possibly undefined" trong controller, đó là TypeScript đang làm đúng việc: chỉ dùng <code>req.user!</code> trong route đã qua <code>requireAuth</code>, hoặc viết hàm phụ ném lỗi. Nếu token hết hạn trả <code>TOKEN_KHONG_HOP_LE</code>, bạn đang bắt lỗi trước khi kiểm <code>instanceof errors.JWTExpired</code>.</p>
</details>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">middleware</span><span class="v">Hàm chạy trước controller; có thể dừng request hoặc bổ sung thông tin cho nó.</span></div>
  <div class="kv"><span class="k">declaration merging</span><span class="v">Gộp khai báo: thêm trường vào interface TypeScript có sẵn (Express.Request).</span></div>
  <div class="kv"><span class="k">401 Unauthorized</span><span class="v">Chưa xác thực. Đi kèm WWW-Authenticate.</span></div>
  <div class="kv"><span class="k">403 Forbidden</span><span class="v">Đã xác thực, không được phép.</span></div>
  <div class="kv"><span class="k">429 Too Many Requests</span><span class="v">Chạm giới hạn tần suất; Retry-After cho biết khi nào quay lại.</span></div>
  <div class="kv"><span class="k">trust proxy</span><span class="v">Thiết lập Express quyết định có tin X-Forwarded-For hay không.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>requireAuth</code>: header → token đã kiểm → <code>req.user</code>, hoặc 401 với mã riêng cho hết hạn.</li>
<li>Cố định thuật toán, issuer, audience: token giả, "none" và token của ứng dụng khác đều trượt.</li>
<li>401 = bạn là ai; 403 = không được phép; kiểm quyền sở hữu nằm trong service.</li>
<li><code>router.use(requireAuth)</code> biến 404 thành 401 — thay bằng gắn từng route + phép thử.</li>
<li>Đăng xuất kết thúc refresh, không kết thúc access token 15 phút; giới hạn 10 lần/15 phút với các đánh đổi đã biết.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
