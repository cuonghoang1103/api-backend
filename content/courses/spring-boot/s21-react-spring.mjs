/**
 * Spring Boot — Chương 21: React ↔ Spring Boot trọn vẹn (soạn 22/11/2026).
 * Phủ phần SBA301 còn thiếu. Đặt CUỐI khoá (không chèn giữa, không đánh số lại); slug khớp khung trong spring-boot.mjs
 * (sb-21-N-…). Mốc dự án 22 (sb-moc-22) và bài bảo vệ được spring-boot.mjs chèn vào chương này.
 * Mọi output chạy thật trên máy Mac của người dùng: Spring Boot 4.1.2 + Spring Security 7.1.2 (dự án mẫu "gearloan" —
 * cùng khung mẫu của các mốc ./_du-an-mau.mjs, thêm refresh cookie), Java 21.0.9, React 19.3 + Vite 8.3.8 (npm create vite),
 * Node 26.8, trình duyệt Chromium của Playwright 1.61 (đọc console thật), nginx 1.27-alpine + Docker Compose (Docker 29.8).
 * Không trùng: JWT/refresh phía server (Ch.9 — bài 9.5 xoay vòng refresh token), CORS cơ bản (Ch.10/12), React (khoá react)
 * — chỉ liên kết sang. KHÔNG backtick trần trong content; mã mẫu đi qua java()/js()/yml()/bash()/xml()/out().
 */
import { java, js, yml, bash, xml, out, tl } from './_chung.mjs';

const Q = (id, question, options, correctIndex, explanation) => ({ id, question, options, correctIndex, points: 1, explanation });
const t = (en) => (a, b) => (en ? a : b);

/* ═════════════ 21.1 — Kiến trúc SPA + API ═════════════ */
const C1_VITE = js(`
// vite.config.js — khi dev: trình duyệt chỉ nói chuyện với Vite (5173); Vite chuyển /api sang Spring (8090)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { '/api': { target: 'http://localhost:8090', changeOrigin: false } },
  },
})

// src/api.js — MỘT chỗ quyết định API nằm ở đâu
const BASE = import.meta.env.VITE_API_URL ?? '/api';   // dev: '/api' qua proxy; build: đặt lúc build
`);
const O1_PROXY = out(`
$ npm create vite@latest gearweb -- --template react --no-interactive && cd gearweb && npm install
$ npx vite --port 5173
  ➜  Local:   http://localhost:5173/
$ curl -s localhost:5173/api/gear
{"items":[{"id":1,"name":"Canon EOS 200D","category":"camera","status":"AVAILABLE"},{"id":2,"name":"Rode VideoMic",…
`);
const O1_CORS = out(`
# build trỏ thẳng API ở origin khác, chạy bằng vite preview (cổng 4173); Spring chỉ cho phép http://localhost:5173
$ VITE_API_URL=http://localhost:8090/api npx vite build && npx vite preview --port 4173
# console của Chromium (Playwright đọc lại):
[console.error] Access to fetch at 'http://localhost:8090/api/gear' from origin 'http://localhost:4173' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
[console.error] Access to fetch at 'http://localhost:8090/api/auth/refresh' from origin 'http://localhost:4173' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
page text: Club gear Log in Failed to fetch
# cùng request bằng curl, giả Origin:
$ curl -s -i localhost:8090/api/gear -H "Origin: http://localhost:4173"
HTTP/1.1 403
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
Invalid CORS request
`);
const O1_ENV = out(`
$ VITE_API_URL=http://localhost:8090/api VITE_MAP_KEY=khoa-gia-cho-bai-hoc-123 npx vite build
dist/assets/index-b2Cscg93.js  223.04 kB │ gzip: 69.92 kB
✓ built in 78ms
$ grep -o "http://localhost:8090/api" dist/assets/*.js
http://localhost:8090/api
$ grep -o "khoa-gia-cho-bai-hoc-123" dist/assets/*.js
khoa-gia-cho-bai-hoc-123
`);

const L1 = (en) => { const T = t(en); return `
<div class="${T('ml-en', 'ml-vi')}">
<span class="eyebrow">${T('Chapter 21 · React ↔ Spring Boot', 'Chương 21 · React ↔ Spring Boot')}</span>
<h2>${T('21.1 — SPA + API architecture: dev proxy, CORS or same origin', '21.1 — Kiến trúc SPA + API: dev proxy, CORS hay cùng origin')}</h2>
<p class="lead">${T(
  'A React single-page app is a bundle of static files that runs in the browser and calls your Spring API with fetch. The first design decision is not React and not Spring — it is <strong>where the browser thinks each one lives</strong>. Same origin (scheme + host + port) and the browser stays out of the way; different origins and every call goes through CORS. This lesson builds the club-gear front end with Vite and measures the three set-ups you will meet: a dev proxy, two origins, and one origin behind nginx.',
  'App React một trang (SPA) là một gói file tĩnh chạy trong trình duyệt và gọi API Spring bằng fetch. Quyết định thiết kế đầu tiên không nằm ở React, cũng không ở Spring — mà là <strong>trình duyệt nghĩ mỗi bên nằm ở đâu</strong>. Cùng origin (scheme + host + cổng) thì trình duyệt đứng ngoài; khác origin thì mọi lời gọi phải qua CORS. Bài này dựng frontend kho thiết bị CLB bằng Vite và đo ba cách bố trí bạn sẽ gặp: dev proxy, hai origin, và một origin sau nginx.')}</p>

<h3>${T('An everyday picture', 'Liên tưởng đời thường')}</h3>
<p>${T(
  'A guard at a building lets residents walk between flats freely, but anyone carrying a letter to a different building must show it at the gate, and the other building must have written down that it accepts letters from yours. Origins are buildings, CORS is that list at the gate. A dev proxy is the trick of putting a mailbox for the other building inside your own lobby: you never cross the street, so the guard never asks.',
  'Bảo vệ toà nhà cho cư dân đi lại giữa các căn thoải mái, nhưng ai mang thư sang toà khác phải trình ở cổng, và toà bên kia phải ghi sẵn là nhận thư từ toà bạn. Origin là toà nhà, CORS là danh sách ở cổng đó. Dev proxy là mẹo đặt một hòm thư của toà bên kia ngay trong sảnh toà mình: bạn không bao giờ băng qua đường, nên bảo vệ không bao giờ hỏi.')}</p>

<h3>${T('Set-up 1 — development: Vite proxy, no CORS at all', 'Cách 1 — khi dev: proxy của Vite, không CORS gì cả')}</h3>
${C1_VITE}
${O1_PROXY}
<p>${T(
  'The browser only ever talks to <code>localhost:5173</code>; Vite forwards <code>/api/**</code> to Spring on 8090. Same origin from the browser’s point of view, so no preflight, no <code>Access-Control-*</code> headers, and the refresh cookie of lesson 21.2 just works. The API client uses the relative <code>/api</code> unless a build sets <code>VITE_API_URL</code>.',
  'Trình duyệt chỉ nói chuyện với <code>localhost:5173</code>; Vite chuyển <code>/api/**</code> sang Spring ở 8090. Từ góc nhìn của trình duyệt là cùng origin, nên không preflight, không header <code>Access-Control-*</code>, và cookie refresh của bài 21.2 chạy luôn. API client dùng đường dẫn tương đối <code>/api</code> trừ khi bản build đặt <code>VITE_API_URL</code>.')}</p>

<h3>${T('Set-up 2 — two origins: CORS decides, measured', 'Cách 2 — hai origin: CORS quyết định, đo thật')}</h3>
${O1_CORS}
<p>${T(
  'Read the two console lines carefully — they are different failures. The GET is a “simple” request: the browser sent it, got an answer without <code>Access-Control-Allow-Origin</code>, and refused to hand it to JavaScript. The POST to <code>/auth/refresh</code> carries a custom header, so the browser first sent a <em>preflight</em> <code>OPTIONS</code>, which failed, so the POST was never sent. Spring is stricter than many servers: for an origin not on its list it answers 403 <code>Invalid CORS request</code> and does not run the controller. In JavaScript all of this is one opaque <code>TypeError: Failed to fetch</code> — the details exist only in the console. The fix is server configuration (lesson 21.3), never something in React.',
  'Đọc kỹ hai dòng console — đó là hai kiểu hỏng khác nhau. Lệnh GET là request “đơn giản”: trình duyệt đã gửi, nhận phản hồi không có <code>Access-Control-Allow-Origin</code>, và từ chối trao nó cho JavaScript. Lệnh POST tới <code>/auth/refresh</code> có header tuỳ biến, nên trình duyệt gửi trước một <em>preflight</em> <code>OPTIONS</code>, preflight hỏng, nên POST không bao giờ được gửi. Spring chặt hơn nhiều server khác: với origin không có trong danh sách, nó trả 403 <code>Invalid CORS request</code> và không chạy controller. Trong JavaScript tất cả chỉ là một <code>TypeError: Failed to fetch</code> mù mờ — chi tiết chỉ có trong console. Cách sửa nằm ở cấu hình server (bài 21.3), không bao giờ ở React.')}</p>
<div class="pitfall co-tieu-de"><p><strong>${T('Trap — a CORS failure is not a response.', 'Bẫy — lỗi CORS không phải là một phản hồi.')}</strong> ${T(
  'The first version of this app showed “Checking session…” forever on port 4173: the start-up <code>refresh().then(setMe)</code> had no rejection handler, and a blocked fetch rejects instead of resolving with a status. Every network call needs a failure path — <code>refresh().then(setMe, () =&gt; setMe(null))</code> fixed it.',
  'Bản đầu của app này hiện “Checking session…” mãi mãi ở cổng 4173: lời gọi <code>refresh().then(setMe)</code> lúc khởi động không có nhánh xử lý lỗi, mà fetch bị chặn thì reject chứ không resolve kèm mã trạng thái. Mọi lời gọi mạng đều cần nhánh hỏng — <code>refresh().then(setMe, () =&gt; setMe(null))</code> đã sửa được.')}</p></div>

<h3>${T('Set-up 3 — production: one origin behind a reverse proxy', 'Cách 3 — production: một origin sau reverse proxy')}</h3>
<p>${T(
  'nginx serves the built files at <code>/</code> and forwards <code>/api/</code> to Spring — exactly what the dev proxy did, so the code path you tested is the one you ship, and CORS disappears from production. Lesson 21.4 deploys it and finds the one proxy header that still matters. Two origins (app on Vercel or S3, API elsewhere) remain valid; then CORS must be exact and cookies need <code>SameSite</code> thinking (21.2–21.3).',
  'nginx phục vụ file đã build ở <code>/</code> và chuyển <code>/api/</code> sang Spring — y như dev proxy đã làm, nên đường đi bạn đã test chính là đường bạn ship, và CORS biến mất khỏi production. Bài 21.4 deploy cách này và tìm ra header proxy duy nhất vẫn còn quan trọng. Hai origin (app trên Vercel hay S3, API ở chỗ khác) vẫn hợp lệ; khi đó CORS phải chính xác và cookie cần tính tới <code>SameSite</code> (21.2–21.3).')}</p>
<table>
<thead><tr><th></th><th>${T('Dev proxy', 'Dev proxy')}</th><th>${T('Two origins + CORS', 'Hai origin + CORS')}</th><th>${T('Same origin (nginx)', 'Cùng origin (nginx)')}</th></tr></thead>
<tbody>
<tr><td>${T('Browser sees', 'Trình duyệt thấy')}</td><td>localhost:5173</td><td>${T('app.example + api.example', 'app.example + api.example')}</td><td>example.com</td></tr>
<tr><td>CORS</td><td>${T('none', 'không')}</td><td>${T('exact origin list, credentials', 'danh sách origin chính xác, credentials')}</td><td>${T('none', 'không')}</td></tr>
<tr><td>${T('Refresh cookie', 'Cookie refresh')}</td><td>${T('first-party', 'first-party')}</td><td>${T('cross-origin; same-site only if both share a registrable domain', 'khác origin; chỉ same-site khi hai bên chung tên miền đăng ký')}</td><td>${T('first-party', 'first-party')}</td></tr>
<tr><td>VITE_API_URL</td><td>${T('unset (/api)', 'không đặt (/api)')}</td><td>https://api.example/api</td><td>${T('unset (/api)', 'không đặt (/api)')}</td></tr>
</tbody>
</table>

<div class="pitfall co-tieu-de"><p><strong>${T('Hacker’s view — VITE_ variables are public.', 'Góc hacker — biến VITE_ là công khai.')}</strong> ${T(
  'Vite copies every <code>import.meta.env.VITE_*</code> value <em>literally</em> into the JavaScript bundle at build time — the same mechanism as <code>NEXT_PUBLIC_*</code> in Next.js. Build with a fake map key and grep the output:',
  'Vite chép <em>nguyên văn</em> mọi giá trị <code>import.meta.env.VITE_*</code> vào gói JavaScript lúc build — cùng cơ chế với <code>NEXT_PUBLIC_*</code> của Next.js. Build với một khoá bản đồ giả rồi grep đầu ra:')}</p>
${O1_ENV}
<p>${T(
  'Anyone who opens DevTools has it. The API URL is fine to publish; a third-party API key, a JWT secret or an admin password is not. Keys that must stay secret live in Spring (environment variables on the server) behind a small authenticated endpoint that calls the third party for the browser. Also note the corollary: the value is fixed at build time, so changing it means rebuilding, not restarting.',
  'Ai mở DevTools cũng thấy. URL của API công khai thì không sao; khoá API bên thứ ba, bí mật JWT hay mật khẩu quản trị thì không được. Khoá phải giữ kín nằm ở Spring (biến môi trường trên server), sau một endpoint nhỏ có xác thực, endpoint đó gọi bên thứ ba thay cho trình duyệt. Và hệ quả đi kèm: giá trị bị đóng cứng lúc build, nên đổi nó là phải build lại, không phải khởi động lại.')}</p></div>

<h3>${T('🧪 Practice (20 minutes)', '🧪 Thực hành (20 phút)')}</h3>
<div class="callout ok"><ol>
<li>${T('Create a Vite React app next to your API, add the <code>/api</code> proxy, and list your main resource from <code>fetch(\'/api/…\')</code>.', 'Tạo một app Vite React cạnh API, thêm proxy <code>/api</code>, và liệt kê tài nguyên chính bằng <code>fetch(\'/api/…\')</code>.')}</li>
<li>${T('Build with <code>VITE_API_URL</code> pointing straight at Spring and run <code>vite preview</code>; copy the two console errors.', 'Build với <code>VITE_API_URL</code> trỏ thẳng vào Spring rồi chạy <code>vite preview</code>; chép lại hai lỗi console.')}</li>
<li>${T('grep <code>dist/</code> for every <code>VITE_</code> value you use and confirm none is a secret.', 'grep <code>dist/</code> tìm mọi giá trị <code>VITE_</code> bạn dùng và xác nhận không cái nào là bí mật.')}</li>
</ol>
<p><strong>${T('Done when:', 'Đạt khi:')}</strong> ${T('you can explain, from the console text alone, whether a request was sent and blocked or never sent (preflight), and your README says which of the three set-ups you will deploy.', 'chỉ nhìn chữ trong console bạn giải thích được request đã được gửi rồi bị chặn hay không hề được gửi (preflight), và README ghi bạn sẽ deploy theo cách nào trong ba cách.')}</p></div>

<h3>${T('🎤 What interviewers ask', '🎤 Người phỏng vấn hay hỏi')}</h3>
<ol>
<li><strong>${T('“What is an origin, and when does CORS apply?”', '“Origin là gì, khi nào CORS áp dụng?”')}</strong> — ${T('Scheme + host + port. CORS applies when a page’s script calls a different origin; the server opts in with Access-Control-* headers, the browser enforces.', 'Scheme + host + cổng. CORS áp dụng khi script của một trang gọi sang origin khác; server đồng ý bằng header Access-Control-*, trình duyệt là bên thi hành.')}</li>
<li><strong>${T('“What is a preflight?”', '“Preflight là gì?”')}</strong> — ${T('An OPTIONS request the browser sends before a non-simple request (custom headers, JSON body, PUT/DELETE) to ask the server for permission.', 'Request OPTIONS trình duyệt gửi trước một request không đơn giản (header tuỳ biến, body JSON, PUT/DELETE) để xin phép server.')}</li>
<li><strong>${T('“Can I keep an API key in a React env variable?”', '“Giữ khoá API trong biến môi trường của React được không?”')}</strong> — ${T('No — VITE_/NEXT_PUBLIC_ values are inlined into the public bundle. Proxy through the backend.', 'Không — giá trị VITE_/NEXT_PUBLIC_ được chép vào gói công khai. Đi qua backend.')}</li>
</ol>

<h3>${T('🗂 Key terms', '🗂 Thuật ngữ')}</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Origin</span><span class="v">${T('scheme://host:port of a page or API.', 'scheme://host:cổng của một trang hay API.')}</span></div>
  <div class="kv"><span class="k">Dev proxy</span><span class="v">${T('Vite forwards /api to the backend so the browser sees one origin.', 'Vite chuyển /api sang backend để trình duyệt chỉ thấy một origin.')}</span></div>
  <div class="kv"><span class="k">Preflight</span><span class="v">${T('OPTIONS request asking permission before the real one.', 'Request OPTIONS xin phép trước request thật.')}</span></div>
  <div class="kv"><span class="k">import.meta.env</span><span class="v">${T('Build-time variables in Vite; VITE_* end up in the bundle.', 'Biến lúc build của Vite; VITE_* nằm trong gói đầu ra.')}</span></div>
</div>

<h3>${T('📌 Summary', '📌 Tóm tắt')}</h3>
<ul>
<li>${T('Dev: Vite proxy ⇒ same origin, no CORS. Production: nginx in front ⇒ same origin, no CORS.', 'Dev: proxy Vite ⇒ cùng origin, không CORS. Production: nginx đứng trước ⇒ cùng origin, không CORS.')}</li>
<li>${T('Two origins ⇒ CORS; failures show only in the console; Spring answers 403 Invalid CORS request.', 'Hai origin ⇒ CORS; lỗi chỉ hiện trong console; Spring trả 403 Invalid CORS request.')}</li>
<li>${T('A blocked fetch rejects — every call needs a failure path.', 'fetch bị chặn thì reject — lời gọi nào cũng cần nhánh hỏng.')}</li>
<li>${T('VITE_* is public and fixed at build time.', 'VITE_* là công khai và đóng cứng lúc build.')}</li>
</ul>
${tl('https://vite.dev/config/server-options#server-proxy', '⚡', 'Vite — server.proxy', T('Forwarding API calls during development', 'Chuyển lời gọi API khi dev'))}
${tl('https://vite.dev/guide/env-and-mode', '⚡', 'Vite — Env variables and modes', T('Why VITE_ values are exposed to the client', 'Vì sao giá trị VITE_ lộ ra phía client'))}
${tl('https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS', '📘', 'MDN — Cross-Origin Resource Sharing', T('Simple requests, preflight, credentials', 'Request đơn giản, preflight, credentials'))}
</div>
`; };

/* ═════════════ 21.2 — access token trong bộ nhớ, refresh cookie ═════════════ */
const C2_SERVER = java(`
// AuthController — phần mới so với bài 9.5: cookie gắn Path=/api/auth, refresh đòi header tuỳ biến
@PostMapping("/refresh")
ResponseEntity<?> refresh(@CookieValue(name = "rt", required = false) String rt,
                          @RequestHeader(name = "X-Requested-With", required = false) String xrw) {
    if (!"gearweb".equals(xrw)) return problem(HttpStatus.FORBIDDEN, "missing X-Requested-With");   // chống CSRF
    if (rt == null) return problem(HttpStatus.UNAUTHORIZED, "no refresh cookie");
    var r = refresh.rotate(rt);                          // xoay vòng + phát hiện dùng lại (bài 9.5)
    log.info("refresh → {}", r instanceof RefreshTokens.Rejected x ? x : "ok, rotated");   // KHÔNG log token
    if (r instanceof RefreshTokens.Rejected(var reason)) return problem(HttpStatus.UNAUTHORIZED, "refresh rejected: " + reason);
    var ok = (RefreshTokens.Ok) r;
    return tokens(members.findById(ok.memberId()).orElseThrow(), ok.newToken());
}

private ResponseCookie cookie(String value, Duration maxAge) {
    return ResponseCookie.from("rt", value).httpOnly(true).secure(secureCookie).sameSite("Strict")
            .path("/api/auth").maxAge(maxAge).build();
}
`);
const O2_SERVER = out(`
$ curl -s -i -c jar -X POST localhost:8090/api/auth/login -H "Content-Type: application/json" -d "$LOGIN"
HTTP/1.1 200
Set-Cookie: rt=<…>; Path=/api/auth; Max-Age=604800; Expires=Sun, 29 Nov 2026 14:39:03 GMT; HttpOnly; SameSite=Strict
$ curl -s -b jar -X POST localhost:8090/api/auth/refresh
{"detail":"missing X-Requested-With","instance":"/api/auth/refresh","status":403,"title":"Forbidden"}
$ curl -s -b jar -c jar -X POST localhost:8090/api/auth/refresh -H "X-Requested-With: gearweb"
{"accessToken":"eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnZWFybG9hbiIsInN1YiI6IjEiLCJyb2x…
`);
const C2_CLIENT = js(`
// src/api.js — token trong BỘ NHỚ, refresh đơn tuyến (single-flight), thử lại đúng một lần
let accessToken = null;                     // KHÔNG localStorage: script lạ (XSS) không đọc được biến này
let refreshing = null;                      // một lời hứa refresh dùng chung cho mọi request đang chờ

async function send(path, { method = 'GET', body, headers = {}, auth = true } = {}) {
  return fetch(BASE + path, {
    method,
    credentials: 'include',                 // gửi/nhận cookie rt kể cả khi API ở origin khác
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(auth && accessToken ? { Authorization: 'Bearer ' + accessToken } : {}),   // /auth/refresh: KHÔNG gửi token cũ
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

export function refresh() {
  refreshing ??= (async () => {
    const res = await send('/auth/refresh', { method: 'POST', auth: false, headers: { 'X-Requested-With': 'gearweb' } });
    if (!res.ok) { accessToken = null; return null; }
    const t = await res.json();
    accessToken = t.accessToken;
    return t;
  })().finally(() => { refreshing = null; });
  return refreshing;
}

export async function api(path, opts = {}) {
  let res = await send(path, opts);
  if (res.status === 401 && !path.startsWith('/auth/')) {      // access token hết hạn ⇒ refresh rồi thử lại ĐÚNG một lần
    if (await refresh()) res = await send(path, opts);
  }
  if (res.status === 401) window.dispatchEvent(new Event('auth:logout'));
  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, data);
  return data;
}

// App.jsx — tải lại trang: thử đổi cookie lấy access token trước khi vẽ gì khác
useEffect(() => { refresh().then(setMe, () => setMe(null)) }, [])
`);
const O2_RELOAD = out(`
$ node pw.mjs reload            # Chromium thật, app dev qua proxy Vite (React StrictMode)
  ← 401 /api/auth/refresh        # lần đầu: chưa có cookie
first load: login form
  ← 200 /api/auth/login
after login: Hi An (MEMBER)
  ← 200 /api/auth/refresh        # F5: token trong bộ nhớ đã mất, cookie đổi lấy token mới
after reload: Hi An (MEMBER)
requests on reload: [ 'POST /api/auth/refresh', 'GET /api/gear', 'GET /api/gear' ]
  ← 204 /api/auth/logout
  ← 401 /api/auth/refresh
after logout + reload, login form visible: true
`);
const O2_SKEW = out(`
# access token đặt sống 20 giây (gear.jwt.access-ttl=20s); đợi 22 giây rồi gọi:
3 parallel calls after expiry: { statuses: [ 404, 404, 404 ], refreshCalls: 0 }
requests: [ 'GET /api/loans/1', 'GET /api/loans/2', 'GET /api/loans/3' ]
# ⇒ token "hết hạn" vẫn được nhận: JwtTimestampValidator mặc định cho lệch đồng hồ 60 giây
`);
const O2_BUG = out(`
# bản đầu của send(): /auth/refresh cũng mang header Authorization chứa token ĐÃ hết hạn. Đợi 82 giây (20 + 60):
  ← 401 /api/auth/refresh
3 parallel calls after expiry: { statuses: [ 401, 401, 401 ], refreshCalls: 1 }
requests: [ 'GET /api/loans/1', 'GET /api/loans/2', 'GET /api/loans/3', 'POST /api/auth/refresh' ]
# log server: KHÔNG có dòng "refresh → …" nào — request bị BearerTokenAuthenticationFilter chặn trước controller,
# dù /api/auth/** là permitAll: token có mặt mà sai/hết hạn ⇒ 401 ngay.
`);
const O2_FIX = out(`
# sau khi refresh gửi auth: false
  ← 200 /api/auth/refresh
3 parallel calls after expiry: { statuses: [ 404, 404, 404 ], refreshCalls: 1 }
requests: [
  'GET /api/loans/1', 'GET /api/loans/2', 'GET /api/loans/3',
  'POST /api/auth/refresh',
  'GET /api/loans/1', 'GET /api/loans/2', 'GET /api/loans/3'
]
refresh → ok, rotated
# 404 = request đã tới service (các lượt mượn đó không tồn tại) — điều cần nhìn là: 3 × 401 ⇒ 1 refresh ⇒ thử lại cả 3
`);
const O2_RACE = out(`
# hai đoạn mã (hai tab, hoặc một client không có single-flight) refresh CÙNG một cookie, song song:
two refreshes in parallel: [ '401 refresh rejected: reused — family revoked', '200 new token' ]
refresh → Rejected[reason=reused — family revoked]
after reload, login form visible: true          # người dùng thật bị đăng xuất
`);
const O2_XSS = out(`
# giả lập một đoạn script lạ lọt vào trang (XSS), chạy sau khi An đăng nhập:
what an injected script sees: { cookie: '', localStorage: [], refreshFromInjectedScript: 200 }
# bản "lưu token vào localStorage" mà nhiều tutorial dạy:
if the app had used localStorage, injected script reads: eyJ…(access token)
`);

const L2 = (en) => { const T = t(en); return `
<div class="${T('ml-en', 'ml-vi')}">
<span class="eyebrow">${T('Chapter 21 · React ↔ Spring Boot', 'Chương 21 · React ↔ Spring Boot')}</span>
<h2>${T('21.2 — Login, access token in memory, refresh token in an HttpOnly cookie', '21.2 — Đăng nhập, access token trong bộ nhớ, refresh token trong cookie HttpOnly')}</h2>
<p class="lead">${T(
  'Lesson 9.5 built the server half: short JWTs, rotated refresh tokens stored as hashes, reuse detection. This lesson is the browser half, which is where most real bugs live: where the access token is kept, how a page reload stays logged in, what happens when three requests hit an expired token at once, and why a cookie that JavaScript cannot read still needs CSRF protection. Everything below was measured in a real Chromium driven by Playwright.',
  'Bài 9.5 đã dựng nửa phía server: JWT ngắn hạn, refresh token xoay vòng lưu dạng băm, phát hiện dùng lại. Bài này là nửa phía trình duyệt, nơi phần lớn lỗi thật nằm: access token giữ ở đâu, tải lại trang mà vẫn đăng nhập thế nào, chuyện gì xảy ra khi ba request cùng đụng token hết hạn, và vì sao một cookie JavaScript không đọc được vẫn cần chống CSRF. Mọi thứ bên dưới đo trên Chromium thật do Playwright điều khiển.')}</p>

<h3>${T('An everyday picture', 'Liên tưởng đời thường')}</h3>
<p>${T(
  'At a festival you wear a wristband that lasts one hour (access token) and keep a ticket stub in a locked pocket (refresh token). Every hour you show the stub at the booth and get a new wristband; the booth punches the stub and gives you a new one. You keep the wristband on your wrist, not stuck to the entrance noticeboard where anyone can copy it — that noticeboard is localStorage.',
  'Ở lễ hội bạn đeo vòng tay có hạn một giờ (access token) và giữ cuống vé trong túi khoá kín (refresh token). Mỗi giờ bạn đưa cuống vé ra quầy để lấy vòng tay mới; quầy bấm lỗ cuống cũ và đưa bạn cuống mới. Bạn đeo vòng tay trên cổ tay, không dán lên bảng tin ở cổng nơi ai cũng chép được — bảng tin đó chính là localStorage.')}</p>

<h3>${T('The server contract for a browser client', 'Hợp đồng phía server cho client trình duyệt')}</h3>
${C2_SERVER}
${O2_SERVER}
<ul>
<li>${T('<code>HttpOnly</code>: JavaScript cannot read the cookie. <code>Path=/api/auth</code>: the browser sends it only to login/refresh/logout, not with every API call. <code>SameSite=Strict</code>: not sent on requests started by another site. <code>Secure</code>: HTTPS only (in this local run it was switched off; lesson 21.4 shows what Secure does on plain HTTP).', '<code>HttpOnly</code>: JavaScript không đọc được cookie. <code>Path=/api/auth</code>: trình duyệt chỉ gửi nó tới login/refresh/logout, không kèm mọi lời gọi API. <code>SameSite=Strict</code>: không gửi trên request do site khác khởi phát. <code>Secure</code>: chỉ HTTPS (lần chạy cục bộ này tắt đi; bài 21.4 cho thấy Secure làm gì trên HTTP thường).')}</li>
<li>${T('The refresh endpoint is authenticated by a cookie the browser attaches <em>automatically</em> — that is exactly the CSRF situation of lesson 19.5. A custom header (<code>X-Requested-With</code>) is a cheap, solid guard: a forged form or image cannot set headers, and a cross-origin script that tries triggers a preflight that CORS refuses.', 'Endpoint refresh được xác thực bằng một cookie trình duyệt gắn <em>tự động</em> — đúng tình huống CSRF của bài 19.5. Một header tuỳ biến (<code>X-Requested-With</code>) là rào chắn rẻ mà chắc: form hay ảnh giả không đặt được header, còn script khác origin nếu thử thì kích hoạt preflight mà CORS từ chối.')}</li>
</ul>

<h3>${T('The client: one module, token in memory, single-flight refresh', 'Phía client: một module, token trong bộ nhớ, refresh đơn tuyến')}</h3>
${C2_CLIENT}
${O2_RELOAD}
<p>${T(
  'Reload wipes the JavaScript variable — on purpose. The first thing the app does is trade the cookie for a fresh access token; if that fails, it shows the login form. Note the reload line: <code>GET /api/gear</code> twice (React StrictMode runs effects twice in development) but <code>POST /api/auth/refresh</code> only once, because both effect runs shared the same pending promise. Remember that line; the race below is what happens without it.',
  'Tải lại trang xoá biến JavaScript — có chủ ý. Việc đầu tiên app làm là đổi cookie lấy access token mới; hỏng thì hiện form đăng nhập. Để ý dòng tải lại: <code>GET /api/gear</code> hai lần (React StrictMode chạy effect hai lần khi dev) nhưng <code>POST /api/auth/refresh</code> chỉ một lần, vì cả hai lượt effect dùng chung một lời hứa đang chờ. Nhớ dòng đó; cuộc đua bên dưới là chuyện xảy ra khi thiếu nó.')}</p>

<h3>${T('Three surprises when the token expires — measured', 'Ba điều bất ngờ khi token hết hạn — đo thật')}</h3>
<p>${T('<strong>1. “Expired” is 60 seconds later than you think.</strong>', '<strong>1. “Hết hạn” muộn hơn bạn nghĩ 60 giây.</strong>')}</p>
${O2_SKEW}
<p>${T('Spring Security’s JWT validator allows 60 seconds of clock skew by default. Test expiry with a wait longer than TTL + 60 s, or configure a smaller skew in tests.', 'Bộ kiểm JWT của Spring Security mặc định cho lệch đồng hồ 60 giây. Test hết hạn thì đợi lâu hơn TTL + 60 giây, hoặc cấu hình độ lệch nhỏ hơn trong test.')}</p>
<p>${T('<strong>2. Sending the old token to /refresh breaks refresh.</strong>', '<strong>2. Gửi token cũ tới /refresh làm hỏng refresh.</strong>')}</p>
${O2_BUG}
${O2_FIX}
<p>${T(
  '<code>permitAll()</code> means “no authentication required”, not “authentication ignored”: when a bearer token is present, the resource-server filter validates it and rejects the request if it is expired. The client must not attach the access token to the refresh call — the <code>auth: false</code> flag above. With that fixed, three parallel 401s caused exactly one refresh, then three retries.',
  '<code>permitAll()</code> nghĩa là “không bắt buộc xác thực”, không phải “bỏ qua xác thực”: khi có bearer token, filter của resource server vẫn kiểm nó và từ chối request nếu token hết hạn. Client không được gắn access token vào lời gọi refresh — cờ <code>auth: false</code> ở trên. Sửa xong, ba lỗi 401 song song chỉ gây đúng một lần refresh, rồi thử lại cả ba.')}</p>
<p>${T('<strong>3. Two refreshes with the same cookie log the user out.</strong>', '<strong>3. Hai lần refresh cùng một cookie làm người dùng bị đăng xuất.</strong>')}</p>
${O2_RACE}
<p>${T(
  'Rotation plus reuse detection (lesson 9.5) cannot tell a thief from your own app firing two refreshes at once: the second request presents a token that the first just rotated, so the server revokes the whole family. Single-flight in the client fixes it within one tab. Across tabs, either accept the rare logout, add a few seconds of grace for the previous token on the server, or coordinate tabs with a BroadcastChannel.',
  'Xoay vòng kèm phát hiện dùng lại (bài 9.5) không phân biệt được kẻ trộm với chính app của bạn bắn hai lần refresh cùng lúc: request thứ hai đưa ra token mà request thứ nhất vừa xoay, nên server huỷ cả họ token. Single-flight ở client sửa được trong một tab. Giữa nhiều tab thì hoặc chấp nhận hiếm khi bị đăng xuất, hoặc cho token liền trước vài giây ân hạn ở server, hoặc phối hợp các tab bằng BroadcastChannel.')}</p>

<div class="pitfall co-tieu-de"><p><strong>${T('Hacker’s view — localStorage and XSS, honestly.', 'Góc hacker — localStorage và XSS, nói cho thật.')}</strong> ${T(
  'What a script injected into the page (lesson 19.2’s stored XSS) can and cannot do:',
  'Một script lọt vào trang (stored XSS của bài 19.2) làm được gì và không làm được gì:')}</p>
${O2_XSS}
<p>${T(
  'With the token in localStorage, one line exfiltrates it and the attacker uses it from their own machine until it expires — or forever, if it was a long-lived token. With the token in memory and the refresh token HttpOnly, the script finds nothing to steal. But notice <code>refreshFromInjectedScript: 200</code>: while the victim keeps the page open, injected code can still <em>use</em> the session through the browser. HttpOnly limits the damage to the time the page is open; it does not make XSS harmless. The real fix for XSS is not rendering untrusted HTML (React escapes by default; avoid <code>dangerouslySetInnerHTML</code>) plus a Content-Security-Policy.',
  'Với token trong localStorage, một dòng là lấy được và kẻ tấn công dùng nó từ máy của họ tới khi hết hạn — hoặc mãi mãi nếu đó là token sống lâu. Với token trong bộ nhớ và refresh token HttpOnly, script không tìm thấy gì để lấy. Nhưng để ý <code>refreshFromInjectedScript: 200</code>: trong lúc nạn nhân còn mở trang, mã chèn vào vẫn <em>dùng</em> được phiên qua trình duyệt. HttpOnly giới hạn thiệt hại trong thời gian trang còn mở; nó không làm XSS vô hại. Cách vá thật cho XSS là không dựng HTML không tin cậy (React thoát ký tự mặc định; tránh <code>dangerouslySetInnerHTML</code>) cộng Content-Security-Policy.')}</p></div>

<h3>${T('🧪 Practice (40 minutes)', '🧪 Thực hành (40 phút)')}</h3>
<div class="callout ok"><ol>
<li>${T('Add <code>/auth/refresh</code> and <code>/auth/logout</code> with the cookie attributes above and the custom-header check (reuse your rotation code from lesson 9.5).', 'Thêm <code>/auth/refresh</code> và <code>/auth/logout</code> với các thuộc tính cookie ở trên và phép kiểm header tuỳ biến (dùng lại mã xoay vòng của bài 9.5).')}</li>
<li>${T('Write the API client module: token in memory, <code>credentials: \'include\'</code>, single-flight refresh, retry once, no Authorization on refresh.', 'Viết module API client: token trong bộ nhớ, <code>credentials: \'include\'</code>, refresh đơn tuyến, thử lại một lần, không gắn Authorization khi refresh.')}</li>
<li>${T('Set the access TTL to 20 s and wait 82 s; fire three calls with <code>Promise.all</code> and count refresh requests in the Network tab.', 'Đặt TTL access 20 giây và đợi 82 giây; bắn ba lời gọi bằng <code>Promise.all</code> và đếm request refresh trong tab Network.')}</li>
</ol>
<p><strong>${T('Done when:', 'Đạt khi:')}</strong> ${T('F5 keeps you logged in, logout + F5 shows the login form, three expired calls produce exactly one refresh, and <code>document.cookie</code> and <code>localStorage</code> contain no token.', 'F5 vẫn còn đăng nhập, đăng xuất + F5 hiện form đăng nhập, ba lời gọi hết hạn sinh đúng một lần refresh, và <code>document.cookie</code> lẫn <code>localStorage</code> không chứa token nào.')}</p></div>

<h3>${T('🎤 What interviewers ask', '🎤 Người phỏng vấn hay hỏi')}</h3>
<ol>
<li><strong>${T('“Where do you store a JWT in a SPA?”', '“Lưu JWT ở đâu trong SPA?”')}</strong> — ${T('Access token in memory, refresh token in an HttpOnly Secure SameSite cookie scoped to the auth path. Explain what XSS can still do.', 'Access token trong bộ nhớ, refresh token trong cookie HttpOnly Secure SameSite giới hạn ở đường dẫn auth. Giải thích XSS vẫn làm được gì.')}</li>
<li><strong>${T('“Why does a cookie-based refresh endpoint need CSRF protection when the API does not?”', '“Vì sao endpoint refresh dùng cookie cần chống CSRF còn API thì không?”')}</strong> — ${T('The browser attaches cookies automatically; it never attaches a bearer header by itself.', 'Trình duyệt tự gắn cookie; nó không bao giờ tự gắn header bearer.')}</li>
<li><strong>${T('“Several requests get 401 at the same time — what should the client do?”', '“Nhiều request cùng nhận 401 — client nên làm gì?”')}</strong> — ${T('Share one refresh promise, then retry each request once; never refresh in parallel with rotating tokens.', 'Dùng chung một lời hứa refresh, rồi thử lại từng request một lần; không bao giờ refresh song song khi token xoay vòng.')}</li>
</ol>

<h3>${T('🗂 Key terms', '🗂 Thuật ngữ')}</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">HttpOnly</span><span class="v">${T('Cookie flag: invisible to JavaScript.', 'Cờ cookie: JavaScript không thấy.')}</span></div>
  <div class="kv"><span class="k">SameSite</span><span class="v">${T('Whether a cookie is sent on requests started by another site.', 'Cookie có được gửi trên request do site khác khởi phát hay không.')}</span></div>
  <div class="kv"><span class="k">Single-flight</span><span class="v">${T('Concurrent callers share one in-progress operation.', 'Nhiều bên gọi đồng thời dùng chung một thao tác đang chạy.')}</span></div>
  <div class="kv"><span class="k">Clock skew</span><span class="v">${T('Tolerance for clock differences when checking exp (60 s default).', 'Độ dung sai lệch đồng hồ khi kiểm exp (mặc định 60 giây).')}</span></div>
  <div class="kv"><span class="k">credentials: include</span><span class="v">${T('fetch option to send and accept cookies cross-origin.', 'Tuỳ chọn fetch để gửi và nhận cookie khác origin.')}</span></div>
</div>

<h3>${T('📌 Summary', '📌 Tóm tắt')}</h3>
<ul>
<li>${T('Access token in a variable; refresh token in an HttpOnly, Path-scoped, SameSite, Secure cookie; refresh guarded by a custom header.', 'Access token trong biến; refresh token trong cookie HttpOnly, giới hạn Path, SameSite, Secure; refresh có header tuỳ biến canh gác.')}</li>
<li>${T('On load, refresh first; on 401, refresh once (shared promise) and retry once.', 'Lúc tải trang, refresh trước tiên; gặp 401 thì refresh một lần (lời hứa dùng chung) và thử lại một lần.')}</li>
<li>${T('Measured traps: 60 s clock skew, stale bearer on /refresh ⇒ 401, parallel refresh + rotation ⇒ logout.', 'Bẫy đã đo: lệch đồng hồ 60 giây, bearer cũ gửi tới /refresh ⇒ 401, refresh song song + xoay vòng ⇒ bị đăng xuất.')}</li>
<li>${T('HttpOnly stops token theft by XSS, not XSS itself.', 'HttpOnly chặn XSS lấy trộm token, không chặn được bản thân XSS.')}</li>
</ul>
${tl('https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps', '🔐', 'IETF — OAuth 2.0 for Browser-Based Applications', T('Token storage and refresh in SPAs', 'Lưu token và refresh trong SPA'))}
${tl('https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies', '🍪', 'MDN — Using HTTP cookies', T('HttpOnly, Secure, SameSite, Path', 'HttpOnly, Secure, SameSite, Path'))}
</div>
`; };

/* ═════════════ 21.3 — Lỗi và CORS trọn tuyến ═════════════ */
const C3_ERR = js(`
// src/api.js — một kiểu lỗi cho cả app, đọc thẳng ProblemDetail của Spring (bài 5.4)
export class ApiError extends Error {
  constructor(status, body) {
    super(body?.detail ?? body?.title ?? 'HTTP ' + status);
    this.status = status;
    this.title = body?.title;
    this.fieldErrors = body?.errors ?? {};          // { name: 'must not be blank' } từ ApiErrors của Spring
  }
}

// App.jsx — form đặt lỗi cạnh ĐÚNG ô, phân biệt 400 / 403 / còn lại
function GearForm({ onCreated }) {
  const [errors, setErrors] = useState({})
  const [msg, setMsg] = useState(null)
  async function submit(e) {
    e.preventDefault()
    const f = Object.fromEntries(new FormData(e.target))
    try { await api('/gear', { method: 'POST', body: f }); setErrors({}); setMsg('Added'); onCreated() }
    catch (x) {
      if (x.status === 400) setErrors(x.fieldErrors)                 // lỗi từng trường ⇒ cạnh đúng ô
      else if (x.status === 403) setMsg('Only staff can add gear')    // đăng nhập rồi nhưng không đủ quyền
      else setMsg(x.message)
    }
  }
  return (
    <form onSubmit={submit} aria-label="new gear">
      <label>Name <input name="name" aria-invalid={!!errors.name} /></label>
      {errors.name && <small data-field="name">{errors.name}</small>}
      <label>Category <input name="category" aria-invalid={!!errors.category} /></label>
      {errors.category && <small data-field="category">{errors.category}</small>}
      <button>Add</button>
      {msg && <p role="status">{msg}</p>}
    </form>
  )
}
`);
const O3_PD = out(`
$ curl -s -X POST localhost:8080/api/gear -H "Authorization: Bearer $STAFF" -H "Content-Type: application/json" -d '{"name":"","category":""}'
{"detail":"Request body is invalid","instance":"/api/gear","status":400,"title":"Bad Request","errors":{"name":"must not be blank","category":"must not be blank"}} [400]
$ curl -s -i -X POST localhost:8080/api/gear -H "Authorization: Bearer $MEMBER" -d '{"name":"Zoom H6","category":"audio"}'
HTTP/1.1 403
WWW-Authenticate: Bearer error="insufficient_scope", error_description="The request requires higher privileges than provided by the access token.", …
$ curl -s -i localhost:8080/api/loans/1 -H "Authorization: Bearer \${MEMBER%?}x"        # đổi ký tự cuối của chữ ký
HTTP/1.1 401
WWW-Authenticate: Bearer error="invalid_token", error_description="An error occurred while attempting to decode the Jwt: Signed JWT rejected: Invalid signature", …
`);
const O3_FORM = out(`
# Playwright bấm "Add" trên form trống, rồi trên form hợp lệ, với hai tài khoản:
staff  Chi, empty form  ⇒ { fieldErrors: [ 'name: must not be blank', 'category: must not be blank' ], invalidInputs: [ 'name', 'category' ], status: null }
member An,  empty form  ⇒ { fieldErrors: [ 'name: must not be blank', 'category: must not be blank' ], invalidInputs: [ 'name', 'category' ], status: null }
member An,  "Zoom H5"   ⇒ { fieldErrors: [], invalidInputs: [], status: 'Only staff can add gear' }
staff  Chi, "Zoom H5"   ⇒ { fieldErrors: [], invalidInputs: [], status: 'Added' }
`);
const C3_CORS = java(`
@Bean
CorsConfigurationSource corsConfigurationSource(@Value("\${gear.cors.origins}") List<String> origins,
                                                @Value("\${gear.cors.mode:strict}") String mode) {
    var c = new CorsConfiguration();
    if (mode.equals("open")) {                                      // ⚠️ CHỈ để minh hoạ góc hacker bên dưới
        c.setAllowedOriginPatterns(List.of("*"));                   // phản chiếu MỌI origin…
    } else {
        c.setAllowedOrigins(origins);                               // danh sách cụ thể, KHÔNG "*"
    }
    c.setAllowCredentials(true);                                    // …kèm cookie ⇒ trang lạ đọc được phản hồi
    c.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE"));
    c.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With"));
    c.setMaxAge(3600L);
    var src = new UrlBasedCorsConfigurationSource();
    src.registerCorsConfiguration("/api/**", c);
    return src;
}
`);
const O3_STAR = out(`
# allowedOrigins("*") + allowCredentials(true) — Spring từ chối ngay khi kiểm origin:
IllegalArgumentException: When allowCredentials is true, allowedOrigins cannot contain the special value "*" since that cannot be set on the "Access-Control-Allow-Origin" response header. To allow credentials to a set of origins, list them explicitly or consider using "allowedOriginPatterns" instead.
`);
const O3_ALLOW = out(`
# thêm http://localhost:4173 vào gear.cors.origins, build hai origin như bài 21.1:
$ node pw.mjs reload http://localhost:4173/
first load: login form
after login: Hi An (MEMBER)
  ← 200 /api/auth/refresh
after reload: Hi An (MEMBER)
requests on reload: [ 'POST /api/auth/refresh', 'GET /api/gear' ]        # bản build: không StrictMode ⇒ một GET
after logout + reload, login form visible: true
`);
const C3_EVIL = xml(`
<!doctype html><meta charset="utf-8"><title>Free stickers</title>
<pre id="out">…</pre>
<script>
// Trang của kẻ gian (cổng 7777). Nó thử đổi cookie refresh của nạn nhân lấy access token.
fetch('http://localhost:8090/api/auth/refresh', { method: 'POST', credentials: 'include', headers: { 'X-Requested-With': 'gearweb' } })
  .then((r) => r.json()).then((t) => { out.textContent = 'STOLEN: ' + t.name + ' ' + t.accessToken.slice(0, 20) + '…' })
  .catch((e) => { out.textContent = 'blocked: ' + e });
</script>
`);
const O3_EVIL = out(`
# nạn nhân đăng nhập ở http://localhost:4173 rồi mở trang http://localhost:7777 trong CÙNG trình duyệt
--- strict CORS (danh sách origin cụ thể):
[console.error] Access to fetch at 'http://localhost:8090/api/auth/refresh' from origin 'http://localhost:7777' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
evil page shows: blocked: TypeError: Failed to fetch
--- open CORS (allowedOriginPatterns "*" + allowCredentials true):
evil page shows: STOLEN: An eyJhbGciOiJIUzI1NiJ9…
$ curl -s -i -X OPTIONS localhost:8090/api/auth/refresh -H "Origin: https://evil.example" -H "Access-Control-Request-Method: POST" -H "Access-Control-Request-Headers: x-requested-with"
HTTP/1.1 200
Access-Control-Allow-Origin: https://evil.example
Access-Control-Allow-Credentials: true
`);

const L3 = (en) => { const T = t(en); return `
<div class="${T('ml-en', 'ml-vi')}">
<span class="eyebrow">${T('Chapter 21 · React ↔ Spring Boot', 'Chương 21 · React ↔ Spring Boot')}</span>
<h2>${T('21.3 — Errors and CORS end to end: ProblemDetail in React forms', '21.3 — Lỗi và CORS trọn tuyến: ProblemDetail trong form React')}</h2>
<p class="lead">${T(
  'Chapter 5 made every Spring error a ProblemDetail with a stable shape. This lesson cashes that in on the React side: one error type, field errors next to the right input, a different message for “not allowed” and “not logged in”. Then it turns to the errors that never reach your code at all — CORS — and measures the configuration that every “just make CORS work” answer online recommends, by stealing a session with it.',
  'Chương 5 biến mọi lỗi Spring thành ProblemDetail có hình dạng ổn định. Bài này thu hoạch thành quả đó ở phía React: một kiểu lỗi, lỗi từng trường nằm cạnh đúng ô nhập, thông báo khác nhau cho “không được phép” và “chưa đăng nhập”. Rồi chuyển sang những lỗi không bao giờ tới được mã của bạn — CORS — và đo thử cấu hình mà mọi câu trả lời “làm sao cho CORS chạy” trên mạng khuyên dùng, bằng cách lấy trộm một phiên với nó.')}</p>

<h3>${T('An everyday picture', 'Liên tưởng đời thường')}</h3>
<p>${T(
  'A good office form returns with a sticky note on the exact box you filled wrong, not a letter saying “something is wrong somewhere”. A bad receptionist, on the other hand, hands your file to anyone who says “I’m from the company” — that receptionist is a CORS configuration that trusts every origin.',
  'Một văn phòng tử tế trả lại tờ khai có dán giấy nhớ ngay ô bạn điền sai, chứ không gửi thư nói “có gì đó sai ở đâu đó”. Còn một lễ tân tồi thì đưa hồ sơ của bạn cho bất kỳ ai nói “tôi là người của công ty” — lễ tân đó là cấu hình CORS tin mọi origin.')}</p>

<h3>${T('One error type, three behaviours', 'Một kiểu lỗi, ba cách xử lý')}</h3>
${C3_ERR}
${O3_PD}
${O3_FORM}
<ul>
<li>${T('<strong>400</strong> carries <code>errors</code>: the form maps each key to its input, sets <code>aria-invalid</code> (screen readers announce it) and keeps what the user typed.', '<strong>400</strong> mang <code>errors</code>: form ánh xạ từng khoá vào ô của nó, đặt <code>aria-invalid</code> (trình đọc màn hình đọc lên) và giữ nguyên thứ người dùng đã gõ.')}</li>
<li>${T('<strong>403</strong> means “we know you, you may not”: show a message, never redirect to login. <strong>401</strong> means “we do not know you (any more)”: the API client already tried one refresh and fired <code>auth:logout</code>. The <code>WWW-Authenticate</code> header says which (<code>insufficient_scope</code> vs <code>invalid_token</code>).', '<strong>403</strong> nghĩa là “biết bạn, nhưng không được”: hiện thông báo, không bao giờ đẩy về trang đăng nhập. <strong>401</strong> nghĩa là “không (còn) biết bạn là ai”: API client đã thử refresh một lần và phát <code>auth:logout</code>. Header <code>WWW-Authenticate</code> nói rõ trường hợp nào (<code>insufficient_scope</code> hay <code>invalid_token</code>).')}</li>
<li>${T('A measured surprise: the member An submitting an <em>empty</em> form got 400 field errors, not 403. Bean Validation of <code>@RequestBody</code> runs while Spring resolves the arguments — before <code>@PreAuthorize</code> wraps the method call. Harmless here, but do not rely on validation order to hide what fields exist, and do not build UI logic that assumes 403 comes first.', 'Một bất ngờ đo được: thành viên An gửi form <em>trống</em> nhận lỗi 400 theo trường, không phải 403. Bean Validation của <code>@RequestBody</code> chạy lúc Spring dựng tham số — trước khi <code>@PreAuthorize</code> bọc lời gọi hàm. Ở đây vô hại, nhưng đừng dựa vào thứ tự validation để giấu có những trường nào, và đừng viết logic giao diện giả định 403 tới trước.')}</li>
</ul>

<h3>${T('CORS configured for credentials', 'Cấu hình CORS cho credentials')}</h3>
${C3_CORS}
<p>${T(
  'With <code>credentials: \'include\'</code> the browser sends cookies cross-origin only if the response says <code>Access-Control-Allow-Credentials: true</code> <em>and</em> names the exact origin. The CORS spec forbids <code>*</code> there, and Spring enforces it:',
  'Với <code>credentials: \'include\'</code>, trình duyệt chỉ gửi cookie sang origin khác khi phản hồi có <code>Access-Control-Allow-Credentials: true</code> <em>và</em> nêu đúng origin. Đặc tả CORS cấm <code>*</code> ở đó, và Spring thi hành điều này:')}</p>
${O3_STAR}
${O3_ALLOW}
<p>${T(
  'The bean must be named <code>corsConfigurationSource</code> for <code>.cors(Customizer.withDefaults())</code> to find it — milestone 13 recorded a preflight that answered 200 with no CORS headers because the method had another name. And every custom header the client sends (here <code>X-Requested-With</code>) must be in <code>allowedHeaders</code>, or the preflight fails.',
  'Bean phải tên <code>corsConfigurationSource</code> thì <code>.cors(Customizer.withDefaults())</code> mới tìm thấy — mốc 13 đã ghi lại một preflight trả 200 mà không có header CORS nào vì hàm đặt tên khác. Và mọi header tuỳ biến client gửi (ở đây <code>X-Requested-With</code>) phải nằm trong <code>allowedHeaders</code>, không thì preflight hỏng.')}</p>

<h3>${T('Reading CORS errors in the console', 'Đọc lỗi CORS trong console')}</h3>
<table>
<thead><tr><th>${T('Console says', 'Console nói')}</th><th>${T('Meaning', 'Nghĩa là')}</th><th>${T('Fix on the server', 'Sửa ở server')}</th></tr></thead>
<tbody>
<tr><td>No 'Access-Control-Allow-Origin' header is present</td><td>${T('Origin not allowed (Spring answered 403 Invalid CORS request), or the bean is not wired', 'Origin không được phép (Spring trả 403 Invalid CORS request), hoặc bean chưa được nối')}</td><td>${T('Add the exact origin; check the bean name', 'Thêm đúng origin; kiểm tên bean')}</td></tr>
<tr><td>Response to preflight request doesn't pass access control check</td><td>${T('The OPTIONS failed; the real request was never sent', 'OPTIONS hỏng; request thật chưa từng được gửi')}</td><td>${T('Allowed methods/headers; make sure OPTIONS is not blocked by security', 'Method/header được phép; bảo đảm OPTIONS không bị security chặn')}</td></tr>
<tr><td>…must not be the wildcard '*' when the request's credentials mode is 'include'</td><td>${T('Wildcard with cookies', 'Ký tự đại diện kèm cookie')}</td><td>${T('List origins explicitly', 'Liệt kê origin cụ thể')}</td></tr>
<tr><td>net::ERR_FAILED / TypeError: Failed to fetch</td><td>${T('What JavaScript sees for all of the above', 'Thứ JavaScript thấy cho mọi trường hợp trên')}</td><td>${T('Read the line above it in the console', 'Đọc dòng ngay trên nó trong console')}</td></tr>
</tbody>
</table>

<div class="pitfall co-tieu-de"><p><strong>${T('Hacker’s view — CORS wide open with credentials.', 'Góc hacker — CORS mở toang kèm credentials.')}</strong> ${T(
  'The error message above suggests <code>allowedOriginPatterns</code>. Set it to <code>"*"</code> and Spring will happily <em>reflect</em> any origin back with credentials allowed. An attacker’s page, measured:',
  'Thông báo lỗi ở trên gợi ý <code>allowedOriginPatterns</code>. Đặt nó thành <code>"*"</code> là Spring vui vẻ <em>phản chiếu</em> mọi origin kèm cho phép credentials. Trang của kẻ tấn công, đo thật:')}</p>
${C3_EVIL}
${O3_EVIL}
<p>${T(
  'With strict CORS the browser blocked the read. With the reflected origin, the attacker’s page exchanged the victim’s refresh cookie for a fresh access token and read it — the custom header did not help, because CORS itself approved it. Why did the <code>SameSite=Strict</code> cookie go along? Because <em>site</em> ignores ports: <code>localhost:7777</code> and <code>localhost:8090</code> are the same site. In production the same is true for any page on a sibling subdomain (a forgotten <code>blog.yourclub.vn</code> with an XSS). Defence in depth: an exact origin list, SameSite, the custom header, and a refresh path that answers only your app’s origin.',
  'Với CORS chặt, trình duyệt chặn việc đọc. Với origin bị phản chiếu, trang của kẻ tấn công đổi cookie refresh của nạn nhân lấy access token mới và đọc được — header tuỳ biến không giúp gì, vì chính CORS đã chấp thuận. Vì sao cookie <code>SameSite=Strict</code> vẫn được gửi theo? Vì <em>site</em> không tính cổng: <code>localhost:7777</code> và <code>localhost:8090</code> là cùng một site. Ở production điều tương tự đúng với mọi trang trên subdomain anh em (một <code>blog.yourclub.vn</code> bị bỏ quên có XSS). Phòng thủ nhiều lớp: danh sách origin chính xác, SameSite, header tuỳ biến, và đường refresh chỉ trả lời origin của app bạn.')}</p></div>

<h3>${T('🧪 Practice (30 minutes)', '🧪 Thực hành (30 phút)')}</h3>
<div class="callout ok"><ol>
<li>${T('Add an ApiError class to your client and a form that shows field errors beside inputs with <code>aria-invalid</code>.', 'Thêm lớp ApiError vào client và một form hiện lỗi từng trường cạnh ô nhập kèm <code>aria-invalid</code>.')}</li>
<li>${T('Trigger 400, 401, 403, 409/422 from the UI and screenshot what the user sees for each.', 'Kích hoạt 400, 401, 403, 409/422 từ giao diện và chụp màn hình thứ người dùng thấy ở mỗi trường hợp.')}</li>
<li>${T('Serve a one-file “evil” page on another port that calls your refresh endpoint with credentials; run it against your real CORS config.', 'Phục vụ một trang “kẻ gian” một file ở cổng khác, gọi endpoint refresh của bạn kèm credentials; chạy nó với cấu hình CORS thật của bạn.')}</li>
</ol>
<p><strong>${T('Done when:', 'Đạt khi:')}</strong> ${T('each status has its own UI behaviour, and the evil page shows “blocked” — with the console line pasted into SECURITY.md.', 'mỗi mã trạng thái có cách hiển thị riêng, và trang kẻ gian hiện “blocked” — kèm dòng console dán vào SECURITY.md.')}</p></div>

<h3>${T('🎤 What interviewers ask', '🎤 Người phỏng vấn hay hỏi')}</h3>
<ol>
<li><strong>${T('“How do you show server validation errors in a React form?”', '“Hiện lỗi validation của server trong form React thế nào?”')}</strong> — ${T('A consistent error body (ProblemDetail + field map), one client error type, map keys to inputs, keep user input.', 'Thân lỗi nhất quán (ProblemDetail + map theo trường), một kiểu lỗi ở client, ánh xạ khoá vào ô nhập, giữ dữ liệu người dùng.')}</li>
<li><strong>${T('“401 vs 403 in the UI?”', '“401 khác 403 thế nào ở giao diện?”')}</strong> — ${T('401: refresh or go to login. 403: stay, explain the missing permission.', '401: refresh hoặc về trang đăng nhập. 403: ở lại, giải thích thiếu quyền gì.')}</li>
<li><strong>${T('“Is CORS a security feature of the server?”', '“CORS có phải tính năng bảo mật của server không?”')}</strong> — ${T('It is the browser relaxing the same-origin policy on the server’s say-so. A wrong config weakens browsers’ protection; it never protects against curl.', 'Đó là trình duyệt nới lỏng chính sách cùng origin theo lời cho phép của server. Cấu hình sai làm yếu lớp bảo vệ của trình duyệt; nó không bao giờ chống được curl.')}</li>
</ol>

<h3>${T('🗂 Key terms', '🗂 Thuật ngữ')}</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ProblemDetail</span><span class="v">${T('RFC 9457 error body: type, title, status, detail + extensions.', 'Thân lỗi RFC 9457: type, title, status, detail + phần mở rộng.')}</span></div>
  <div class="kv"><span class="k">aria-invalid</span><span class="v">${T('Marks an input as invalid for assistive technology.', 'Đánh dấu ô nhập sai cho công nghệ hỗ trợ.')}</span></div>
  <div class="kv"><span class="k">Allow-Credentials</span><span class="v">${T('Lets the page read a response to a request that carried cookies.', 'Cho trang đọc phản hồi của request có mang cookie.')}</span></div>
  <div class="kv"><span class="k">${T('Origin reflection', 'Phản chiếu origin')}</span><span class="v">${T('Echoing any Origin back — equivalent to trusting everyone.', 'Trả lại bất kỳ Origin nào — tương đương tin tất cả.')}</span></div>
  <div class="kv"><span class="k">${T('Site vs origin', 'Site và origin')}</span><span class="v">${T('Site ignores port and subdomain; SameSite works on sites.', 'Site bỏ qua cổng và subdomain; SameSite làm việc theo site.')}</span></div>
</div>

<h3>${T('📌 Summary', '📌 Tóm tắt')}</h3>
<ul>
<li>${T('One ApiError; 400 ⇒ beside the input, 403 ⇒ message, 401 ⇒ refresh then login.', 'Một ApiError; 400 ⇒ cạnh ô nhập, 403 ⇒ thông báo, 401 ⇒ refresh rồi về đăng nhập.')}</li>
<li>${T('Validation can answer before authorisation — measured.', 'Validation có thể trả lời trước phân quyền — đã đo.')}</li>
<li>${T('Credentials need exact origins; Spring rejects "*" — and allowedOriginPatterns("*") reopens the hole.', 'Credentials cần origin chính xác; Spring từ chối "*" — còn allowedOriginPatterns("*") mở lại lỗ hổng.')}</li>
<li>${T('An evil page stole an access token through reflected CORS; SameSite did not stop it because ports share a site.', 'Một trang kẻ gian lấy được access token qua CORS phản chiếu; SameSite không chặn vì khác cổng vẫn cùng site.')}</li>
</ul>
${tl('https://docs.spring.io/spring-security/reference/servlet/integrations/cors.html', '🔐', 'Spring Security — CORS', T('CorsConfigurationSource and the filter chain', 'CorsConfigurationSource và chuỗi filter'))}
${tl('https://portswigger.net/web-security/cors', '🛡️', 'PortSwigger Web Security Academy — CORS', T('Origin reflection and other CORS vulnerabilities, with labs', 'Phản chiếu origin và các lỗ hổng CORS khác, có lab'))}
</div>
`; };

/* ═════════════ 21.4 — Triển khai app React và API Spring ═════════════ */
const B4_DOCKER = bash(`
# web/Dockerfile — giai đoạn 1: build app React (không đi vào image cuối)
FROM node:22-alpine AS build
WORKDIR /src
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL=/api            # cùng origin sau nginx ⇒ đường dẫn tương đối, không CORS
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# giai đoạn 2: chỉ nginx + file tĩnh
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/dist /usr/share/nginx/html
`);
const B4_NGINX = bash(`
# web/nginx.conf
server {
    listen 80;
    root /usr/share/nginx/html;

    # API: cùng origin với trang ⇒ trình duyệt không cần CORS, cookie rt đi kèm như thường
    location /api/ {
        proxy_pass http://api:8090;
        proxy_set_header Host $http_host;         # GIỮ cả cổng: Spring so Origin với Host để biết có phải CORS không
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # file có mã băm trong tên ⇒ cache 1 năm
    location /assets/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # mọi đường dẫn khác của SPA ⇒ index.html (không cache, để bản deploy mới có hiệu lực ngay)
    location / {
        add_header Cache-Control "no-cache";
        try_files $uri /index.html;
    }
}
`);
const Y4_COMPOSE = yml(`
services:
  web:
    build: ./web
    ports: ["127.0.0.1:8080:80"]       # cổng DUY NHẤT mở ra ngoài
    depends_on:
      api: { condition: service_healthy }
  api:
    build: { context: ., dockerfile: Dockerfile.api }   # bản multi-stage đầy đủ: Chương 17 / mốc 18
    environment:
      DB_URL: jdbc:postgresql://db:5432/gearloan
      DB_PASSWORD: \${DB_PASSWORD:?đặt DB_PASSWORD trong .env}
      JWT_SECRET: \${JWT_SECRET:?đặt JWT_SECRET trong .env}
      MONGO_URI: mongodb://mongo:27017/gearloan
      SPRING_DATA_REDIS_HOST: redis
      REDIS_PORT: 6379
      CORS_ORIGINS: http://localhost:8080   # cùng origin thì CORS không dùng tới; để chặt cho chắc
    healthcheck:
      test: ["CMD-SHELL", "bash -c 'exec 3<>/dev/tcp/127.0.0.1/8090 && printf \\"GET /actuator/health/readiness HTTP/1.0\\\\r\\\\n\\\\r\\\\n\\" >&3 && grep -q UP <&3'"]
      interval: 5s
      retries: 20
    depends_on:
      db: { condition: service_healthy }
      redis: { condition: service_started }
      mongo: { condition: service_started }
  db:
    image: postgres:16-alpine
    environment: { POSTGRES_DB: gearloan, POSTGRES_PASSWORD: "\${DB_PASSWORD}" }
    healthcheck: { test: ["CMD-SHELL", "pg_isready -U postgres"], interval: 3s, retries: 20 }
  redis:
    image: redis:7-alpine
  mongo:
    image: mongo:7
`);
const O4_UP = out(`
$ docker compose -p ch21 up -d --build
 Container ch21-api-1 Healthy
 Container ch21-web-1 Started
$ docker compose -p ch21 ps --format '{{.Service}} {{.Status}} {{.Ports}}'
api Up 20 seconds (healthy) 8090/tcp
db Up 23 seconds (healthy) 5432/tcp
mongo Up 23 seconds 27017/tcp
redis Up 23 seconds 6379/tcp
web Up 9 seconds 127.0.0.1:8080->80/tcp
$ docker images ch21-web --format '{{.Size}}'; docker run --rm ch21-web du -sh /usr/share/nginx/html
76.3MB
256.0K	/usr/share/nginx/html
`);
const B4_SMOKE = bash(`
#!/bin/bash
# smoke.sh — sau mỗi deploy: trang, đường dẫn sâu của SPA, API công khai, API cần đăng nhập, cache, đăng nhập + refresh
B=\${1:-http://localhost:8080}; fail=0
chk() { local want=$1 got=$2 name=$3; if [ "$got" = "$want" ]; then echo "ok   $name ($got)"; else echo "FAIL $name: want $want got $got"; fail=1; fi; }
code() { curl -s -o /dev/null -w "%{http_code}" "$@"; }
chk 200 "$(code $B/)" "index"
chk 200 "$(code $B/loans/1)" "SPA deep link"
chk 200 "$(code $B/api/gear)" "public API through nginx"
chk 401 "$(code $B/api/loans/1)" "protected API"
JS=$(curl -s $B/ | grep -o '/assets/[^"]*\\.js' | head -1)
chk immutable "$(curl -sI $B$JS | grep -io 'immutable')" "assets cached"
chk no-cache "$(curl -sI $B/ | grep -io 'no-cache')" "index not cached"
J=$(mktemp)
BODY=$(printf '{"email":"%s","password":"%s"}' "$SMOKE_EMAIL" "$SMOKE_PASSWORD")   # tài khoản thử, lấy từ biến môi trường
chk 200 "$(code -c $J -X POST $B/api/auth/login -H 'Content-Type: application/json' -d "$BODY")" "login"
chk 200 "$(code -b $J -X POST $B/api/auth/refresh -H 'X-Requested-With: gearweb')" "refresh cookie"
chk 403 "$(code -b $J -X POST $B/api/auth/refresh)" "refresh without CSRF header"
rm -f $J; exit $fail
`);
const O4_SMOKE = out(`
$ SMOKE_EMAIL=… SMOKE_PASSWORD=… ./smoke.sh
ok   index (200)
ok   SPA deep link (200)
ok   public API through nginx (200)
ok   protected API (401)
ok   assets cached (immutable)
ok   index not cached (no-cache)
ok   login (200)
ok   refresh cookie (200)
ok   refresh without CSRF header (403)
exit 0
`);
const O4_TRY = out(`
# cùng image, nhưng nginx.conf bỏ dòng try_files:
no try_files  / -> 200
no try_files  /loans/1 -> 404          # người dùng F5 ở /loans/1, hoặc mở link được chia sẻ ⇒ trang 404 của nginx
`);
const O4_HOST = out(`
# lượt đầu, nginx ghi proxy_set_header Host $host  (= tên máy, MẤT cổng). Trình duyệt mở http://gear.test:8080:
  ← 403 /api/auth/login
$ curl -s -X POST localhost:8080/api/auth/login -H "Host: gear.test:8080" -H "Origin: http://gear.test:8080" -d "$LOGIN"
Invalid CORS request [403]
# Spring thấy Host = gear.test (cổng 80) còn Origin = http://gear.test:8080 ⇒ coi là request KHÁC origin ⇒ origin lạ ⇒ 403
# đổi thành proxy_set_header Host $http_host (giữ nguyên "gear.test:8080"):
after fix [200]
`);
const O4_SECURE = out(`
# cookie có cờ Secure, trang phục vụ bằng HTTP thường:
--- http://localhost:8080          (trình duyệt coi localhost là ngữ cảnh an toàn)
  Set-Cookie on login: rt=<…>; Path=/api/auth; Max-Age=604800; …; Secure; HttpOnly; SameSite=Strict
after login: Hi An (MEMBER)
  ← 200 /api/auth/refresh
after reload: Hi An (MEMBER)
--- http://gear.test:8080          (tên máy thật, HTTP thường)
  Set-Cookie on login: rt=<…>; Path=/api/auth; Max-Age=604800; …; Secure; HttpOnly; SameSite=Strict
after login: Hi An (MEMBER)
  ← 401 /api/auth/refresh          # trình duyệt đã BỎ cookie Secure ⇒ F5 là mất đăng nhập
`);

const L4 = (en) => { const T = t(en); return `
<div class="${T('ml-en', 'ml-vi')}">
<span class="eyebrow">${T('Chapter 21 · React ↔ Spring Boot', 'Chương 21 · React ↔ Spring Boot')}</span>
<h2>${T('21.4 — Deploying the React app and the Spring API together', '21.4 — Triển khai app React và API Spring cùng nhau')}</h2>
<p class="lead">${T(
  'The front end is a folder of static files; the API is a container. The simplest robust production set-up puts nginx in front of both on one origin: nginx serves the files and forwards <code>/api/</code>. This lesson builds that with Docker Compose, writes a smoke test that checks both halves after every deploy, and records three failures that only appear once there is a proxy and a real hostname: deep links returning 404, a same-origin request treated as cross-origin, and a Secure cookie silently dropped.',
  'Frontend là một thư mục file tĩnh; API là một container. Cách triển khai production đơn giản mà chắc nhất là đặt nginx đứng trước cả hai trên một origin: nginx phục vụ file và chuyển tiếp <code>/api/</code>. Bài này dựng như vậy bằng Docker Compose, viết một smoke test kiểm cả hai nửa sau mỗi lần deploy, và ghi lại ba lỗi chỉ xuất hiện khi đã có proxy và tên máy thật: link sâu trả 404, request cùng origin bị coi là khác origin, và cookie Secure bị bỏ lặng lẽ.')}</p>

<h3>${T('An everyday picture', 'Liên tưởng đời thường')}</h3>
<p>${T(
  'A shopping-centre reception desk: visitors only ever see the front door. Leaflets (static files) are handed out right there; anything else (“I want to return a camera”) the receptionist phones through to the back office (the API). If the receptionist reads the shop number wrong when forwarding, the back office thinks the call comes from another building.',
  'Quầy lễ tân của một trung tâm thương mại: khách chỉ thấy cửa trước. Tờ rơi (file tĩnh) được phát ngay tại đó; mọi việc khác (“tôi muốn trả máy ảnh”) lễ tân gọi điện vào văn phòng phía sau (API). Nếu lễ tân đọc sai số gian hàng khi chuyển máy, văn phòng sẽ tưởng cuộc gọi tới từ toà nhà khác.')}</p>

<h3>${T('Build the front end into an nginx image', 'Build frontend thành một image nginx')}</h3>
${B4_DOCKER}
${B4_NGINX}
<p>${T(
  '<code>VITE_API_URL</code> is a build argument because Vite bakes it in (lesson 21.1); with one origin it stays <code>/api</code> and the same image works on any domain. Files under <code>/assets/</code> have a content hash in their name, so they can be cached for a year; <code>index.html</code> must not be cached, or users keep loading the old bundle names after a deploy.',
  '<code>VITE_API_URL</code> là build argument vì Vite đóng cứng nó vào gói (bài 21.1); với một origin nó giữ <code>/api</code> và cùng image chạy được ở mọi tên miền. File trong <code>/assets/</code> có mã băm nội dung trong tên, nên cache được một năm; <code>index.html</code> thì không được cache, không thì người dùng cứ tải tên gói cũ sau mỗi lần deploy.')}</p>

<h3>${T('Compose: one public port', 'Compose: một cổng công khai')}</h3>
${Y4_COMPOSE}
${O4_UP}
<p>${T(
  'Only <code>web</code> publishes a port, and only on 127.0.0.1 (a reverse proxy or tunnel with TLS sits in front on a server). The API, PostgreSQL, Redis and MongoDB are reachable only on the compose network — the open-MongoDB mistake of lesson 20.1 cannot happen here. Secrets come from <code>.env</code>, which is in <code>.gitignore</code>; <code>:?</code> makes compose refuse to start if one is missing. The runtime image of the front end is nginx plus 256 KB of files.',
  'Chỉ <code>web</code> mở cổng, và chỉ trên 127.0.0.1 (trên server, một reverse proxy hoặc tunnel có TLS đứng phía trước). API, PostgreSQL, Redis và MongoDB chỉ với tới được trong mạng của compose — lỗi MongoDB mở toang của bài 20.1 không thể xảy ra ở đây. Bí mật lấy từ <code>.env</code>, file nằm trong <code>.gitignore</code>; <code>:?</code> khiến compose từ chối khởi động nếu thiếu. Image chạy của frontend là nginx cộng 256 KB file.')}</p>

<h3>${T('A smoke test for both halves', 'Smoke test cho cả hai nửa')}</h3>
${B4_SMOKE}
${O4_SMOKE}
<p>${T('Nine checks, under a second, run after every deploy (the course’s own deploy script works the same way). Each line exists because something like it broke once:', 'Chín phép kiểm, chưa tới một giây, chạy sau mỗi lần deploy (chính script deploy của khoá học làm y như vậy). Mỗi dòng tồn tại vì từng có thứ tương tự hỏng:')}</p>
${O4_TRY}
<p>${T(
  'React routes exist only in JavaScript. Without <code>try_files … /index.html</code>, nginx looks for a file called <code>loans/1</code>, finds none and returns 404 — the home page works, every shared link and every F5 on an inner page does not.',
  'Route của React chỉ tồn tại trong JavaScript. Thiếu <code>try_files … /index.html</code>, nginx đi tìm một file tên <code>loans/1</code>, không có và trả 404 — trang chủ chạy, còn mọi link được chia sẻ và mọi lần F5 ở trang bên trong thì không.')}</p>

<h3>${T('The proxy header that broke a same-origin login', 'Header proxy làm hỏng đăng nhập cùng origin')}</h3>
${O4_HOST}
<p>${T(
  'Browsers send an <code>Origin</code> header on every POST, even same-origin ones. Spring decides whether a request is cross-origin by comparing it with the request’s own scheme, host and port — which, behind a proxy, come from the headers the proxy forwards. <code>$host</code> drops the port, so Spring computed a different origin and applied CORS to a same-origin request. It worked on <code>localhost:8080</code> only by luck: that origin happened to be in the CORS list. Forward the original host with <code>$http_host</code>, and for HTTPS also make Spring honour <code>X-Forwarded-Proto</code> (<code>server.forward-headers-strategy=native</code> when the proxy is trusted).',
  'Trình duyệt gửi header <code>Origin</code> trên mọi POST, kể cả cùng origin. Spring quyết định một request có khác origin không bằng cách so với scheme, host và cổng của chính request — mà sau proxy, những thứ đó đến từ header proxy chuyển tiếp. <code>$host</code> làm mất cổng, nên Spring tính ra một origin khác và áp CORS lên một request cùng origin. Ở <code>localhost:8080</code> nó chạy chỉ nhờ may: origin đó tình cờ có trong danh sách CORS. Chuyển nguyên host gốc bằng <code>$http_host</code>, và với HTTPS thì cho Spring tin <code>X-Forwarded-Proto</code> (<code>server.forward-headers-strategy=native</code> khi proxy đáng tin).')}</p>

<h3>${T('HTTPS and the Secure cookie', 'HTTPS và cookie Secure')}</h3>
${O4_SECURE}
<p>${T(
  'Same image, same cookie, two hostnames. Browsers treat <code>localhost</code> as a secure context, so a Secure cookie works over plain HTTP there — which is why “it works on my machine”. On any real hostname over HTTP the browser accepted the login response but discarded the Secure cookie, so the next reload had nothing to refresh with. The fix is not removing Secure; it is serving the site over HTTPS (a TLS-terminating proxy or tunnel in front of <code>web</code>). Once the page is HTTPS, every API call must be HTTPS too — an <code>http://</code> API URL from an <code>https://</code> page is blocked as mixed content, another reason to keep the API on the same origin.',
  'Cùng image, cùng cookie, hai tên máy. Trình duyệt coi <code>localhost</code> là ngữ cảnh an toàn, nên cookie Secure vẫn chạy trên HTTP thường ở đó — đó là lý do “máy em chạy được”. Trên mọi tên máy thật qua HTTP, trình duyệt nhận phản hồi đăng nhập nhưng vứt cookie Secure, nên lần tải lại sau không còn gì để refresh. Cách sửa không phải bỏ Secure; mà là phục vụ site bằng HTTPS (một proxy hoặc tunnel kết thúc TLS đứng trước <code>web</code>). Khi trang đã HTTPS, mọi lời gọi API cũng phải HTTPS — URL API <code>http://</code> gọi từ trang <code>https://</code> bị chặn vì mixed content, thêm một lý do giữ API cùng origin.')}</p>

<div class="pitfall co-tieu-de"><p><strong>${T('Hacker’s view — what the deploy leaks.', 'Góc hacker — bản deploy làm lộ gì.')}</strong> ${T(
  'Three cheap checks before going live. (1) Source maps: <code>vite build</code> does not emit them by default — if you turn them on, do not upload them to the public server, they hand out your original source. (2) The bundle: grep <code>dist/</code> for anything that looks like a key (lesson 21.1). (3) Ports: <code>docker compose ps</code> should show exactly one published port; a database port bound to 0.0.0.0 on a VPS is found by scanners within hours.',
  'Ba phép kiểm rẻ trước khi lên mạng. (1) Source map: <code>vite build</code> mặc định không sinh ra — nếu bật, đừng tải lên server công khai, chúng trao luôn mã nguồn gốc của bạn. (2) Gói đầu ra: grep <code>dist/</code> tìm thứ trông như khoá (bài 21.1). (3) Cổng: <code>docker compose ps</code> chỉ được hiện đúng một cổng công khai; cổng CSDL bind 0.0.0.0 trên VPS sẽ bị máy quét tìm thấy trong vài giờ.')}</p></div>

<h3>${T('🧪 Practice (45 minutes)', '🧪 Thực hành (45 phút)')}</h3>
<div class="callout ok"><ol>
<li>${T('Write <code>web/Dockerfile</code> and <code>nginx.conf</code> for your front end and add <code>web</code> to your project’s compose file; only <code>web</code> publishes a port.', 'Viết <code>web/Dockerfile</code> và <code>nginx.conf</code> cho frontend và thêm <code>web</code> vào compose của dự án; chỉ <code>web</code> mở cổng.')}</li>
<li>${T('Adapt <code>smoke.sh</code> to your routes and run it; then remove <code>try_files</code> once and watch the deep-link check fail.', 'Sửa <code>smoke.sh</code> theo route của bạn và chạy; rồi bỏ <code>try_files</code> một lần và xem phép kiểm link sâu hỏng.')}</li>
<li>${T('Open the app through a hostname that is not localhost (an <code>/etc/hosts</code> entry) and log in; reload; explain what happened to the cookie.', 'Mở app qua một tên máy không phải localhost (một dòng trong <code>/etc/hosts</code>) và đăng nhập; tải lại; giải thích chuyện gì xảy ra với cookie.')}</li>
</ol>
<p><strong>${T('Done when:', 'Đạt khi:')}</strong> ${T('<code>docker compose up -d --build</code> from a clean clone plus <code>smoke.sh</code> prints only “ok” lines, and the README says how HTTPS is provided in production.', '<code>docker compose up -d --build</code> từ một bản clone sạch cộng <code>smoke.sh</code> chỉ in dòng “ok”, và README ghi production có HTTPS bằng cách nào.')}</p></div>

<h3>${T('🎤 What interviewers ask', '🎤 Người phỏng vấn hay hỏi')}</h3>
<ol>
<li><strong>${T('“How do you deploy a React SPA with a Spring API?”', '“Triển khai SPA React với API Spring thế nào?”')}</strong> — ${T('Build static files, serve them with nginx (try_files for client routes, long cache for hashed assets), reverse-proxy /api to Spring on the same origin, TLS in front.', 'Build file tĩnh, phục vụ bằng nginx (try_files cho route phía client, cache dài cho asset có mã băm), reverse-proxy /api sang Spring cùng origin, TLS phía trước.')}</li>
<li><strong>${T('“Why does refreshing /orders/5 give 404 in production but not in dev?”', '“Vì sao F5 ở /orders/5 bị 404 trên production mà khi dev thì không?”')}</strong> — ${T('The dev server falls back to index.html; nginx needs try_files to do the same.', 'Dev server tự lùi về index.html; nginx cần try_files mới làm được như vậy.')}</li>
<li><strong>${T('“What changes behind a reverse proxy?”', '“Đứng sau reverse proxy thì điều gì thay đổi?”')}</strong> — ${T('Host, scheme and client IP come from forwarded headers; configure the proxy to send them and the app to trust them only from the proxy.', 'Host, scheme và IP client đến từ header chuyển tiếp; cấu hình proxy gửi chúng và app chỉ tin chúng khi đến từ proxy.')}</li>
</ol>

<h3>${T('🗂 Key terms', '🗂 Thuật ngữ')}</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">try_files</span><span class="v">${T('nginx fallback: serve index.html for unknown paths.', 'Đường lùi của nginx: trả index.html cho đường dẫn lạ.')}</span></div>
  <div class="kv"><span class="k">$http_host</span><span class="v">${T('The original Host header, including the port.', 'Header Host gốc, có cả cổng.')}</span></div>
  <div class="kv"><span class="k">${T('Secure context', 'Ngữ cảnh an toàn')}</span><span class="v">${T('HTTPS pages, plus localhost; Secure cookies need one.', 'Trang HTTPS, cộng localhost; cookie Secure cần một ngữ cảnh như vậy.')}</span></div>
  <div class="kv"><span class="k">Mixed content</span><span class="v">${T('HTTP requests from an HTTPS page; blocked by browsers.', 'Request HTTP từ một trang HTTPS; trình duyệt chặn.')}</span></div>
  <div class="kv"><span class="k">Smoke test</span><span class="v">${T('A few fast checks after deploy that prove the main paths work.', 'Vài phép kiểm nhanh sau deploy chứng minh đường chính chạy.')}</span></div>
</div>

<h3>${T('📌 Summary', '📌 Tóm tắt')}</h3>
<ul>
<li>${T('nginx serves dist/ and proxies /api on one origin; only it publishes a port.', 'nginx phục vụ dist/ và proxy /api trên một origin; chỉ nó mở cổng.')}</li>
<li>${T('Hashed assets: cache a year; index.html: no-cache; client routes: try_files.', 'Asset có mã băm: cache một năm; index.html: no-cache; route phía client: try_files.')}</li>
<li>${T('Forward Host with its port, or Spring treats same-origin requests as CORS — measured 403.', 'Chuyển Host kèm cổng, không thì Spring coi request cùng origin là CORS — đo được 403.')}</li>
<li>${T('Secure cookies work on localhost over HTTP and nowhere else: production needs HTTPS.', 'Cookie Secure chạy trên localhost qua HTTP và không ở đâu khác: production cần HTTPS.')}</li>
<li>${T('A smoke test that checks both halves after every deploy.', 'Một smoke test kiểm cả hai nửa sau mỗi lần deploy.')}</li>
</ul>
${tl('https://vite.dev/guide/static-deploy', '⚡', 'Vite — Deploying a static site', T('Build output and hosting options', 'Đầu ra build và các cách host'))}
${tl('https://docs.spring.io/spring-boot/how-to/webserver.html#howto.webserver.use-behind-a-proxy-server', '📘', 'Spring Boot — Running behind a front-end proxy server', T('Forwarded headers and forward-headers-strategy', 'Header chuyển tiếp và forward-headers-strategy'))}
${tl('https://nginx.org/en/docs/http/ngx_http_core_module.html#try_files', '🧭', 'nginx — try_files', T('Fallback for single-page apps', 'Đường lùi cho app một trang'))}
</div>
`; };

/* ═════════════ 21.5 — Lab ═════════════ */
const L5 = (en) => { const T = t(en); return `
<div class="${T('ml-en', 'ml-vi')}">
<span class="eyebrow">${T('Chapter 21 · Lab', 'Chương 21 · Lab')}</span>
<h2>${T('21.5 — Chapter 21 lab + interview questions', '21.5 — Lab chương 21 + câu hỏi phỏng vấn')}</h2>
<p class="lead">${T(
  'Give the LabFlow booking API of this course (or your own course project) a React front end with three real screens, a session that survives reloads, server errors in the right place, and a one-command deployment behind nginx. The React itself is deliberately small — the course “React” on this site covers components and hooks; here the grade is for the seams between the two halves.',
  'Làm frontend React cho LabFlow API của khoá (hoặc dự án cuối khoá của bạn) với ba màn hình thật, phiên đăng nhập sống qua F5, lỗi server hiện đúng chỗ, và triển khai sau nginx bằng một lệnh. Phần React cố ý nhỏ — khoá “React” trên trang này dạy component và hook; ở đây điểm nằm ở các mối nối giữa hai nửa.')}</p>
<h3>${T('Tasks', 'Nhiệm vụ')}</h3>
<ol>
<li>${T('Vite app with the <code>/api</code> dev proxy; one <code>api.js</code> module (base URL from env, ApiError, token in memory, single-flight refresh, retry once, no bearer on refresh).', 'App Vite có dev proxy <code>/api</code>; một module <code>api.js</code> (base URL từ env, ApiError, token trong bộ nhớ, refresh đơn tuyến, thử lại một lần, không gắn bearer khi refresh).')}</li>
<li>${T('Server: <code>/auth/refresh</code> and <code>/auth/logout</code> with an HttpOnly, Secure, SameSite cookie on <code>Path=/api/auth</code>, rotation from lesson 9.5, a custom-header CSRF check.', 'Server: <code>/auth/refresh</code> và <code>/auth/logout</code> với cookie HttpOnly, Secure, SameSite ở <code>Path=/api/auth</code>, xoay vòng theo bài 9.5, kiểm CSRF bằng header tuỳ biến.')}</li>
<li>${T('Three screens: lab list (loading, empty, error states), booking detail, booking form with field errors beside inputs; 403 and 409 shown as messages.', 'Ba màn hình: danh sách phòng lab (trạng thái đang tải, rỗng, lỗi), chi tiết lượt đặt, form đặt lịch có lỗi từng trường cạnh ô nhập; 403 và 409 hiện thành thông báo.')}</li>
<li>${T('<code>web/Dockerfile</code> + <code>nginx.conf</code> (try_files, cache headers, <code>Host $http_host</code>) + compose with one published port.', '<code>web/Dockerfile</code> + <code>nginx.conf</code> (try_files, header cache, <code>Host $http_host</code>) + compose chỉ một cổng công khai.')}</li>
<li>${T('<code>smoke.sh</code> covering both halves; a Playwright (or manual, with screenshots) run of: login → F5 still logged in → create booking → logout → F5 shows login.', '<code>smoke.sh</code> phủ cả hai nửa; một lượt Playwright (hoặc làm tay, kèm ảnh chụp) cho: đăng nhập → F5 vẫn đăng nhập → tạo lượt đặt → đăng xuất → F5 hiện trang đăng nhập.')}</li>
<li>${T('SECURITY.md rows: token storage, the evil-origin test against your CORS config, grep of <code>dist/</code> for secrets.', 'Các dòng SECURITY.md: nơi lưu token, phép thử origin kẻ gian với cấu hình CORS của bạn, grep <code>dist/</code> tìm bí mật.')}</li>
</ol>
<h3>${T('Rubric (10 points)', 'Rubric (10 điểm)')}</h3>
<table><thead><tr><th>${T('Criterion', 'Tiêu chí')}</th><th>${T('Points', 'Điểm')}</th></tr></thead><tbody>
<tr><td>${T('API client: one module, refresh single-flight, 401/403 handled distinctly', 'API client: một module, refresh đơn tuyến, xử lý 401/403 riêng biệt')}</td><td>2</td></tr>
<tr><td>${T('Session: survives F5, logout really ends it, no token in localStorage/document.cookie', 'Phiên: sống qua F5, đăng xuất thật sự kết thúc, không token nào trong localStorage/document.cookie')}</td><td>2</td></tr>
<tr><td>${T('Three screens with loading/empty/error states; field errors beside inputs', 'Ba màn hình có trạng thái đang tải/rỗng/lỗi; lỗi trường cạnh ô nhập')}</td><td>2</td></tr>
<tr><td>${T('Deployment: compose up from a clean clone, one public port, smoke test green', 'Triển khai: compose up từ bản clone sạch, một cổng công khai, smoke test xanh')}</td><td>2</td></tr>
<tr><td>${T('Security evidence: CSRF header check, exact CORS (evil page blocked), no secrets in dist/', 'Bằng chứng bảo mật: kiểm header CSRF, CORS chính xác (trang kẻ gian bị chặn), không bí mật trong dist/')}</td><td>2</td></tr>
</tbody></table>
<details><summary>${T('Hint for testing expiry without waiting', 'Gợi ý test hết hạn mà không phải chờ')}</summary>
<p>${T(
  'Make the access-token lifetime a property (<code>gear.jwt.access-ttl=20s</code> in a dev profile) and remember the 60-second default clock skew (lesson 21.2): the token is rejected only after TTL + 60 s. In a Spring test you can build the <code>JwtDecoder</code> with a <code>JwtTimestampValidator</code> of zero skew instead.',
  'Đưa thời gian sống của access token thành thuộc tính (<code>gear.jwt.access-ttl=20s</code> trong profile dev) và nhớ độ lệch đồng hồ mặc định 60 giây (bài 21.2): token chỉ bị từ chối sau TTL + 60 giây. Trong test Spring có thể dựng <code>JwtDecoder</code> với <code>JwtTimestampValidator</code> độ lệch bằng 0.')}</p>
</details>
<h3>🎤 ${T('Interview questions for this chapter', 'Câu hỏi phỏng vấn của chương')}</h3>
<ol>
<li>${T('Dev proxy, two origins, or same origin behind nginx — which would you choose for production, and why?', 'Dev proxy, hai origin, hay cùng origin sau nginx — bạn chọn cách nào cho production, vì sao?')}</li>
<li>${T('Where do you keep the access token and the refresh token in a SPA? What can XSS still do?', 'Trong SPA bạn giữ access token và refresh token ở đâu? XSS vẫn làm được gì?')}</li>
<li>${T('Why does the refresh endpoint need CSRF protection when the rest of the API does not?', 'Vì sao endpoint refresh cần chống CSRF trong khi phần còn lại của API thì không?')}</li>
<li>${T('Three requests get 401 at the same time. Walk through what your client does.', 'Ba request cùng nhận 401. Trình bày client của bạn làm gì.')}</li>
<li>${T('Why is allowedOriginPatterns("*") with allowCredentials(true) dangerous? Show the attack.', 'Vì sao allowedOriginPatterns("*") kèm allowCredentials(true) nguy hiểm? Mô tả cuộc tấn công.')}</li>
<li>${T('F5 on /bookings/7 returns 404 in production. Diagnose and fix.', 'F5 ở /bookings/7 trả 404 trên production. Chẩn đoán và sửa.')}</li>
<li>${T('Login works on localhost but users are logged out after every reload in production. What do you check first?', 'Đăng nhập chạy ở localhost nhưng người dùng bị đăng xuất sau mỗi lần tải lại trên production. Bạn kiểm gì đầu tiên?')}</li>
</ol>
</div>
`; };

const QUIZ21 = [
  Q('21-1', 'During development, React on localhost:5173 calls fetch("/api/gear") and Vite proxies /api to Spring on 8090. Does the browser apply CORS?|||Khi dev, React ở localhost:5173 gọi fetch("/api/gear") và Vite proxy /api sang Spring ở 8090. Trình duyệt có áp CORS không?', [
    'Yes, because Spring runs on a different port|||Có, vì Spring chạy ở cổng khác',
    'No: the browser only talks to localhost:5173, so the request is same-origin|||Không: trình duyệt chỉ nói chuyện với localhost:5173, nên request là cùng origin',
    'Only for POST requests|||Chỉ với request POST',
    'Only when cookies are sent|||Chỉ khi có gửi cookie',
  ], 1, 'Lesson 21.1: the proxy forwards server-side; the browser never sees port 8090.|||Bài 21.1: proxy chuyển tiếp ở phía server; trình duyệt không bao giờ thấy cổng 8090.'),
  Q('21-2', 'A Vite app is built with VITE_MAP_KEY=… . Where can an attacker find the value?|||App Vite được build với VITE_MAP_KEY=… . Kẻ tấn công tìm giá trị đó ở đâu?', [
    'Nowhere; env variables stay on the build machine|||Không ở đâu; biến môi trường nằm lại trên máy build',
    'In the JavaScript bundle served to every visitor|||Trong gói JavaScript phục vụ cho mọi người truy cập',
    'Only in the server logs|||Chỉ trong log server',
    'Only if source maps are enabled|||Chỉ khi bật source map',
  ], 1, 'Lesson 21.1: grep found the value in dist/assets/*.js.|||Bài 21.1: grep tìm thấy giá trị trong dist/assets/*.js.'),
  Q('21-3', 'Why keep the access token in a JavaScript variable rather than localStorage?|||Vì sao giữ access token trong biến JavaScript thay vì localStorage?', [
    'localStorage is slower|||localStorage chậm hơn',
    'An injected script can read localStorage and send the token away; a variable in a module closure is not reachable that way|||Script bị chèn đọc được localStorage và gửi token đi; biến trong closure của module thì không với tới theo cách đó',
    'localStorage is cleared on every request|||localStorage bị xoá sau mỗi request',
    'Browsers forbid JWTs in localStorage|||Trình duyệt cấm lưu JWT trong localStorage',
  ], 1, 'Lesson 21.2 measured both; HttpOnly + memory leaves nothing to steal, though XSS can still use the open session.|||Bài 21.2 đã đo cả hai; HttpOnly + bộ nhớ không để lại gì để lấy, dù XSS vẫn dùng được phiên đang mở.'),
  Q('21-4', 'The refresh endpoint reads an HttpOnly cookie. Why does it also require an X-Requested-With header?|||Endpoint refresh đọc một cookie HttpOnly. Vì sao nó còn đòi header X-Requested-With?', [
    'To identify the browser version|||Để nhận dạng phiên bản trình duyệt',
    'Because cookies are sent automatically; a forged cross-site request cannot add a custom header without a preflight that CORS refuses|||Vì cookie được tự gửi; request giả từ site khác không thêm được header tuỳ biến nếu không qua preflight mà CORS từ chối',
    'Spring Security requires it for every POST|||Spring Security bắt buộc nó cho mọi POST',
    'It replaces the refresh token|||Nó thay cho refresh token',
  ], 1, 'CSRF defence for a cookie-authenticated endpoint (lessons 19.5 and 21.2).|||Chống CSRF cho endpoint xác thực bằng cookie (bài 19.5 và 21.2).'),
  Q('21-5', 'An access token with a 20-second lifetime is still accepted 22 seconds after issue. Why?|||Access token sống 20 giây vẫn được nhận sau 22 giây. Vì sao?', [
    'The token was refreshed automatically|||Token đã được refresh tự động',
    'Spring Security’s JwtTimestampValidator allows 60 seconds of clock skew by default|||JwtTimestampValidator của Spring Security mặc định cho lệch đồng hồ 60 giây',
    'HS256 tokens ignore exp|||Token HS256 bỏ qua exp',
    'The browser caches the response|||Trình duyệt cache phản hồi',
  ], 1, 'Measured in lesson 21.2: rejection started only after TTL + 60 s.|||Đo ở bài 21.2: chỉ bị từ chối sau TTL + 60 giây.'),
  Q('21-6', 'The client calls POST /api/auth/refresh (permitAll) with the expired access token still in the Authorization header. What happens?|||Client gọi POST /api/auth/refresh (permitAll) mà header Authorization vẫn mang access token đã hết hạn. Chuyện gì xảy ra?', [
    'permitAll ignores the header, so refresh succeeds|||permitAll bỏ qua header, nên refresh thành công',
    '401 from the bearer-token filter before the controller runs|||401 từ filter bearer token trước khi controller chạy',
    '403 because of CSRF|||403 vì CSRF',
    'The server issues a new token for the expired one|||Server phát token mới thay cho token hết hạn',
  ], 1, 'Lesson 21.2: no "refresh →" log line at all; fixed by not sending Authorization on refresh.|||Bài 21.2: không có dòng log "refresh →" nào; sửa bằng cách không gửi Authorization khi refresh.'),
  Q('21-7', 'With refresh-token rotation and reuse detection, two tabs refresh with the same cookie at the same moment. Likely result?|||Có xoay vòng refresh token và phát hiện dùng lại, hai tab refresh cùng một cookie cùng lúc. Kết quả khả năng cao?', [
    'Both get new tokens|||Cả hai nhận token mới',
    'One succeeds, the other is treated as reuse and the whole token family is revoked — the user is logged out|||Một cái thành công, cái kia bị coi là dùng lại và cả họ token bị thu hồi — người dùng bị đăng xuất',
    'The server queues the second request|||Server xếp hàng request thứ hai',
    'The browser merges the two requests|||Trình duyệt gộp hai request',
  ], 1, 'Measured in lesson 21.2; single-flight in the client prevents it within a tab.|||Đo ở bài 21.2; single-flight ở client ngăn được trong một tab.'),
  Q('21-8', 'Spring CORS: allowCredentials(true) with allowedOrigins("*"). What happens?|||CORS của Spring: allowCredentials(true) với allowedOrigins("*"). Chuyện gì xảy ra?', [
    'Every origin is allowed with cookies|||Mọi origin được phép kèm cookie',
    'Spring throws IllegalArgumentException; listing origins (or patterns) is required|||Spring ném IllegalArgumentException; phải liệt kê origin (hoặc pattern)',
    'Credentials are silently disabled|||Credentials bị tắt lặng lẽ',
    'Only localhost is allowed|||Chỉ localhost được phép',
  ], 1, 'Lesson 21.3 — and allowedOriginPatterns("*") then reflects any origin, which the evil page exploited.|||Bài 21.3 — và allowedOriginPatterns("*") khi đó phản chiếu mọi origin, thứ trang kẻ gian đã khai thác.'),
  Q('21-9', 'nginx serves the React build. The home page works but refreshing /loans/1 gives 404. What is missing?|||nginx phục vụ bản build React. Trang chủ chạy nhưng F5 ở /loans/1 trả 404. Thiếu gì?', [
    'A Spring @GetMapping("/loans/{id}")|||Một @GetMapping("/loans/{id}") của Spring',
    'try_files $uri /index.html in the location block|||try_files $uri /index.html trong khối location',
    'CORS headers on /loans|||Header CORS trên /loans',
    'A longer cache time for index.html|||Thời gian cache dài hơn cho index.html',
  ], 1, 'Lesson 21.4: 200 for /, 404 for /loans/1 without try_files.|||Bài 21.4: không có try_files thì / trả 200, /loans/1 trả 404.'),
  Q('21-10', 'Login works on http://localhost:8080 but on http://gear.test:8080 the user is logged out after reload. The refresh cookie has Secure; HttpOnly; SameSite=Strict. Why?|||Đăng nhập chạy ở http://localhost:8080 nhưng ở http://gear.test:8080 người dùng bị đăng xuất sau khi tải lại. Cookie refresh có Secure; HttpOnly; SameSite=Strict. Vì sao?', [
    'SameSite=Strict blocks same-origin requests|||SameSite=Strict chặn request cùng origin',
    'Browsers treat localhost as a secure context; on another host over plain HTTP the Secure cookie is discarded — serve HTTPS|||Trình duyệt coi localhost là ngữ cảnh an toàn; ở tên máy khác qua HTTP thường cookie Secure bị bỏ — hãy dùng HTTPS',
    'HttpOnly cookies expire on reload|||Cookie HttpOnly hết hạn khi tải lại',
    'nginx strips cookies|||nginx gỡ bỏ cookie',
  ], 1, 'Measured in lesson 21.4: the next refresh returned 401.|||Đo ở bài 21.4: lần refresh sau trả 401.'),
];

const LESSONS = [
  { title: '21.1 — SPA + API architecture: dev proxy, CORS or same origin|||21.1 — Kiến trúc SPA + API: dev proxy, CORS hay cùng origin', slug: 'sb-21-1-kien-truc-spa', type: 'LESSON', isFreePreview: true, description: 'Proxy của Vite, hai origin với lỗi CORS đọc từ console Chromium thật, cùng origin sau nginx, và biến VITE_ bị chép nguyên văn vào bundle.', content: L1(true) + L1(false) },
  { title: '21.2 — Login, access token in memory, refresh token in an HttpOnly cookie|||21.2 — Đăng nhập, access token trong bộ nhớ, refresh token trong cookie HttpOnly', slug: 'sb-21-2-jwt-refresh-cookie', type: 'LESSON', isFreePreview: true, description: 'API client có refresh đơn tuyến, F5 vẫn đăng nhập, ba bẫy đo thật (lệch đồng hồ 60 s, bearer cũ chặn /refresh, refresh song song bị đăng xuất), XSS và localStorage.', content: L2(true) + L2(false) },
  { title: '21.3 — Errors and CORS end to end: ProblemDetail in React forms|||21.3 — Lỗi và CORS trọn tuyến: ProblemDetail trong form React', slug: 'sb-21-3-cors-loi', type: 'LESSON', isFreePreview: true, description: 'Một ApiError cho cả app, lỗi trường cạnh ô nhập (Playwright đo), 401 vs 403, đọc lỗi CORS trong console, và một trang kẻ gian lấy access token qua CORS phản chiếu.', content: L3(true) + L3(false) },
  { title: '21.4 — Deploying the React app and the Spring API together|||21.4 — Triển khai app React và API Spring cùng nhau', slug: 'sb-21-4-deploy-spa-api', type: 'LESSON', isFreePreview: true, description: 'nginx + compose một cổng, smoke test chín phép kiểm, và ba lỗi đo thật: link sâu 404, header Host mất cổng ⇒ 403 CORS, cookie Secure bị bỏ trên HTTP.', content: L4(true) + L4(false) },
  { title: '21.5 — Chapter 21 lab + interview questions|||21.5 — Lab chương 21 + câu hỏi phỏng vấn', slug: 'sb-21-5-lab-21', type: 'LESSON', isFreePreview: true, description: 'Ba màn hình React cho LabFlow, phiên sống qua F5, lỗi đúng chỗ, triển khai sau nginx + smoke test, bằng chứng bảo mật; rubric 10 điểm, 7 câu phỏng vấn full-stack.', content: L5(true) + L5(false) },
  {
    title: '21.6 — Chapter 21 quiz|||21.6 — Kiểm tra chương 21',
    slug: 'sb-21-6-quiz',
    type: 'QUIZ',
    isFreePreview: true,
    description: 'Mười câu tiếng Anh về dev proxy, biến VITE_, nơi lưu token, CSRF cho refresh, lệch đồng hồ, refresh song song, CORS credentials, try_files và cookie Secure — đều lấy từ thứ đã chạy thật trong chương.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 21 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Every question comes from something you saw running in this chapter. If you miss one, the explanation names the lesson.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 21 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Câu nào cũng lấy từ thứ bạn đã thấy chạy thật trong chương. Sai câu nào thì lời giải nêu đúng bài cần đọc lại.</p>
</div>
`,
    quiz: { timeLimitSeconds: 900, questions: QUIZ21 },
  },
];

export default {
  title: 'Chapter 21 — React ↔ Spring Boot, end to end|||Chương 21 — React ↔ Spring Boot trọn vẹn',
  description: 'SBA301: SPA gọi API Spring — đăng nhập, refresh token bằng cookie, CORS, lỗi ProblemDetail trong form, triển khai cả hai.',
  lessons: LESSONS,
};
