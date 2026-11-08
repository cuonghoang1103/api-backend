/** SDN302 · 6.1 — Nối React, triển khai & BaaS: cấu hình qua env (12-factor), client React gọi API với Bearer token, xử lý lỗi mạng/401/502, các bước deploy, BaaS (CLO7). */
import { doiDau, KHOA, bai, cs, q, qn, ord, tn } from './_sdn.mjs';

const J = String.raw;

const E1 = cs({
  ten: 'Deploying and BaaS: config in the environment, not in code', kho: 'EASY', phut: 8,
  en: 'The deployment ideas of the lesson and CLO7 (Backend-as-a-Service).',
  vi: 'Các ý về triển khai của bài và CLO7 (Backend-as-a-Service).',
  cau: [
    q('d1', ['The API works locally but answers 500 on Render right after deploy. What is the most likely cause?', 'API chạy ở máy nhưng trả 500 trên Render ngay sau khi deploy. Nguyên nhân khả dĩ nhất?'],
      ['An environment variable (MONGODB_URI, JWT_SECRET) was never set in the host dashboard', 'Render does not support Express', 'MongoDB Atlas blocks every request coming from a host', 'The React app is not deployed yet'],
      ['"Setting env vars in the host dashboard is a separate step from pushing code."', '"Đặt biến môi trường trên bảng điều khiển của host là một bước riêng, khác với việc push mã."']),
    q('d2', ['What does the 12-factor config rule say?', 'Luật cấu hình 12-factor nói gì?'],
      ['The same code runs everywhere; only environment variables differ between local and production', 'Each environment needs its own branch of the code', 'Config files must be committed so the host can read them', 'Ports and URLs should be hard-coded for speed'],
      ['Local Mongo vs Atlas, dev secret vs prod secret: the code reads <code>process.env</code> and never changes.', 'Mongo cục bộ vs Atlas, secret dev vs secret prod: mã đọc <code>process.env</code> và không bao giờ đổi.']),
    q('d3', ['When does a BaaS (Firebase, Supabase, Atlas App Services) make sense?', 'Khi nào BaaS (Firebase, Supabase, Atlas App Services) hợp lý?'],
      ['A small app where speed matters more than control: ready-made auth, database and storage, no server to build', 'Whenever you need custom business rules that must run on your own server', 'Only for apps without users', 'Never — BaaS cannot do authentication'],
      ['BaaS handles secure client–server communication for you; the trade-off is control (rules live in the vendor\'s console).', 'BaaS lo giao tiếp client–server an toàn cho bạn; cái giá là quyền kiểm soát (luật nằm trong console của nhà cung cấp).']),
    qn('d4', ['The React app on <code>https://myapp.vercel.app</code> calls the API on Render. What must be configured? (choose all)', 'App React ở <code>https://myapp.vercel.app</code> gọi API trên Render. Phải cấu hình gì? (chọn hết)'],
      ['CORS on the API allowing <code>https://myapp.vercel.app</code>', 'The API URL in the React build (e.g. <code>VITE_API_URL</code>)', 'MONGODB_URI and JWT_SECRET on Render', 'The JWT secret inside the React code', 'MongoDB credentials inside the React code'],
      [0, 1, 2],
      ['Anything in the React bundle is public. Secrets live only on the server.', 'Mọi thứ trong bundle React đều công khai. Bí mật chỉ nằm ở server.']),
  ],
  goiY: [['Ask: where does this value live — client, server or host?', 'Hỏi: giá trị này nằm ở đâu — client, server hay host?'], ['A React build is public.', 'Bản build React là công khai.']],
  loi: [['Forgetting env vars on the host.', 'Quên biến môi trường trên host.'], ['Shipping secrets in the front-end.', 'Đưa bí mật vào front-end.']],
  tns: [tn('BaaS', 'Backend-as-a-Service'), tn('12-factor app', 'ứng dụng 12 yếu tố')],
  kn: ['deploy', 'BaaS'],
});

const E2 = cs({
  ten: 'Deployment steps, in order', kho: 'EASY', phut: 5, loai: 'order',
  en: 'The deployment steps of the lesson, plus the check that proves it worked.',
  vi: 'Các bước triển khai của bài, cộng phép kiểm chứng minh nó chạy.',
  cau: [ord('s1', ['Order the steps of the first deploy of your API.', 'Sắp các bước của lần deploy API đầu tiên.'],
    ['Read PORT, MONGODB_URI, JWT_SECRET from <code>process.env</code> in the code', 'Push the code to GitHub (with <code>.env</code> git-ignored)', 'Create the service on Render/Railway; it runs <code>npm start</code>', 'Add the same variables in the host dashboard', 'Call a public route (e.g. <code>GET /api/products</code>) on the live URL'],
    ['Code first reads config from the environment; Git carries only code; the host builds and starts it; the variables are a separate dashboard step; a real request is the only proof it works.', 'Mã đọc cấu hình từ môi trường trước; Git chỉ mang mã; host build và khởi động; biến môi trường là một bước riêng trên bảng điều khiển; một request thật là bằng chứng duy nhất nó chạy.'])],
  goiY: [['Config before code leaves your machine.', 'Cấu hình trước khi mã rời máy bạn.'], ['Testing is last.', 'Kiểm thử là bước cuối.']],
  loi: [['Committing .env to make the host work.', 'Commit .env để host chạy được.'], ['Never calling the live URL.', 'Không bao giờ gọi URL thật.']],
  tns: [tn('host', 'nơi chạy ứng dụng')],
  kn: ['deploy'],
});

const E3 = bai({
  ten: 'Config via env: loadConfig(env) that fails loudly', kho: 'MEDIUM', phut: 15, lib: [],
  en: J`<p>Write <code>loadConfig(env)</code> (called once at startup with <code>process.env</code>) that returns</p>
<pre>{ port, mongoUri, jwtSecret, corsOrigin }</pre>
<ul><li><code>port</code> — <code>Number(env.PORT)</code>, default <code>3000</code> when PORT is absent or empty; a PORT that is not a whole number ⇒ throw <code>Error('PORT must be a number')</code>;</li>
<li><code>mongoUri</code> ← <code>MONGODB_URI</code>, <code>jwtSecret</code> ← <code>JWT_SECRET</code>: both required — if any is missing or empty throw ONE error listing all missing names: <code>Error('Missing environment variables: MONGODB_URI, JWT_SECRET')</code>;</li>
<li><code>corsOrigin</code> ← <code>CORS_ORIGIN</code>, default <code>http://localhost:5173</code>.</li></ul>
<p>Check order: missing variables first, then PORT.</p>`,
  vi: J`<p>Viết <code>loadConfig(env)</code> (gọi một lần lúc khởi động với <code>process.env</code>) trả</p>
<pre>{ port, mongoUri, jwtSecret, corsOrigin }</pre>
<ul><li><code>port</code> — <code>Number(env.PORT)</code>, mặc định <code>3000</code> khi PORT vắng hoặc rỗng; PORT không phải số nguyên ⇒ ném <code>Error('PORT must be a number')</code>;</li>
<li><code>mongoUri</code> ← <code>MONGODB_URI</code>, <code>jwtSecret</code> ← <code>JWT_SECRET</code>: cả hai bắt buộc — thiếu hay rỗng cái nào thì ném MỘT lỗi liệt kê mọi tên thiếu: <code>Error('Missing environment variables: MONGODB_URI, JWT_SECRET')</code>;</li>
<li><code>corsOrigin</code> ← <code>CORS_ORIGIN</code>, mặc định <code>http://localhost:5173</code>.</li></ul>
<p>Thứ tự kiểm: biến thiếu trước, rồi tới PORT.</p>`,
  yc: [['Never default a secret.', 'Không bao giờ đặt mặc định cho bí mật.'], ['Do not read the real <code>process.env</code> inside — use the <code>env</code> argument (easy to test).', 'Đừng đọc <code>process.env</code> thật bên trong — dùng đối số <code>env</code> (dễ kiểm thử).']],
  viDu: [['loadConfig({ MONGODB_URI: "mongodb+srv://…", JWT_SECRET: "s3cret" })', '{"port":3000,"mongoUri":"mongodb+srv://…","jwtSecret":"s3cret","corsOrigin":"http://localhost:5173"}', 'Defaults for PORT and CORS_ORIGIN.', 'Mặc định cho PORT và CORS_ORIGIN.'], ['loadConfig({ PORT: "8080" })', 'throws Error: Missing environment variables: MONGODB_URI, JWT_SECRET', 'Both names in one message.', 'Cả hai tên trong một thông báo.']],
  goiY: [['<code>const missing = [\'MONGODB_URI\', \'JWT_SECRET\'].filter((k) => !env[k]);</code>', '<code>const missing = [\'MONGODB_URI\', \'JWT_SECRET\'].filter((k) => !env[k]);</code>'], ['<code>Number.isInteger(Number(env.PORT))</code> rejects "abc" and "80.5".', '<code>Number.isInteger(Number(env.PORT))</code> từ chối "abc" và "80.5".']],
  loi: [['<code>jwtSecret: env.JWT_SECRET || \'dev\'</code> — production quietly signs tokens with "dev".', '<code>jwtSecret: env.JWT_SECRET || \'dev\'</code> — production lặng lẽ ký token bằng "dev".'], ['Throwing on the first missing variable only: you fix one, redeploy, and discover the next.', 'Chỉ ném ở biến thiếu đầu tiên: sửa một cái, deploy lại, rồi mới thấy cái tiếp theo.'], ['Keeping PORT as a string — fine for listen, wrong for anything that compares numbers.', 'Giữ PORT dạng chuỗi — listen thì được, nhưng sai với mọi chỗ so số.']],
  gt: ['Reading every setting once, validating it and failing at startup turns "500 in production" into a clear crash log that names the missing variables — the fastest possible feedback for the deploy step that the lesson warns about.', 'Đọc mọi cấu hình một lần, kiểm tra và hỏng ngay lúc khởi động biến "500 ở production" thành log sập rõ ràng nêu tên các biến thiếu — phản hồi nhanh nhất có thể cho bước deploy mà bài cảnh báo.'],
  kn: ['configuration', 'fail fast'],
  tns: [tn('fail fast', 'hỏng sớm'), tn('environment variable', 'biến môi trường')],
  dau: J`function loadConfig(env) {
  return {
    port: env.PORT || 3000,
    mongoUri: env.MONGODB_URI || 'mongodb://localhost/test',
    jwtSecret: env.JWT_SECRET || 'dev',
    corsOrigin: env.CORS_ORIGIN,
  };
}
`,
  giai: J`function loadConfig(env) {
  // 1) required settings: report ALL missing names at once
  const missing = ['MONGODB_URI', 'JWT_SECRET'].filter((k) => !env[k]);
  if (missing.length) throw new Error('Missing environment variables: ' + missing.join(', '));

  // 2) PORT: optional, but if present it must be a whole number
  let port = 3000;
  if (env.PORT !== undefined && env.PORT !== '') {
    port = Number(env.PORT);
    if (!Number.isInteger(port)) throw new Error('PORT must be a number');
  }

  return {
    port,
    mongoUri: env.MONGODB_URI,
    jwtSecret: env.JWT_SECRET,                         // never defaulted
    corsOrigin: env.CORS_ORIGIN || 'http://localhost:5173',
  };
}
`,
  cases: [
    { goi: `loadConfig({ MONGODB_URI: 'mongodb+srv://u:p@c/shop', JWT_SECRET: 's3cret' })`, moTa: ['Defaults for PORT and CORS_ORIGIN', 'Mặc định cho PORT và CORS_ORIGIN'] },
    { goi: `loadConfig({ PORT: '8080' })`, nem: 'Error', thongDiep: 'Missing environment variables: MONGODB_URI, JWT_SECRET', moTa: ['Both missing → one error naming both', 'Thiếu cả hai → một lỗi nêu cả hai'] },
    { goi: `loadConfig({ MONGODB_URI: 'x', JWT_SECRET: 'y', PORT: 'abc' })`, nem: 'Error', thongDiep: 'PORT must be a number', moTa: ['PORT=abc → error', 'PORT=abc → lỗi'] },
    { goi: `loadConfig({ MONGODB_URI: 'x', JWT_SECRET: 'y', PORT: '9999', CORS_ORIGIN: 'https://myapp.vercel.app' })`, an: true },
    { goi: `[(() => { try { loadConfig({ MONGODB_URI: 'x', JWT_SECRET: '' }); } catch (e) { return e.message; } })(), loadConfig({ MONGODB_URI: 'x', JWT_SECRET: 'y', PORT: '' }).port]`, an: true },
  ],
});

const E4 = bai({
  ten: 'The React side: fetchProducts(apiUrl, token)', kho: 'MEDIUM', phut: 15, lib: [],
  en: J`<p>Write the function a React component calls (the lesson's snippet, finished): <code>fetchProducts(apiUrl, token)</code></p>
<ul><li><code>GET ´@{apiUrl}/api/products´</code> with header <code>Authorization: Bearer &lt;token&gt;</code>;</li>
<li>status 401 ⇒ throw <code>Error('Session expired, please log in again')</code>;</li>
<li>any other non-2xx ⇒ throw <code>Error('Request failed: &lt;status&gt;')</code>;</li>
<li>otherwise return the parsed JSON.</li></ul>
<p><code>fetch</code> is simulated by the grader (no network): it answers from a table and records every call.</p>`,
  vi: J`<p>Viết hàm mà một component React gọi (đoạn mã của bài, làm cho xong): <code>fetchProducts(apiUrl, token)</code></p>
<ul><li><code>GET ´@{apiUrl}/api/products´</code> kèm header <code>Authorization: Bearer &lt;token&gt;</code>;</li>
<li>mã 401 ⇒ ném <code>Error('Session expired, please log in again')</code>;</li>
<li>mã không phải 2xx khác ⇒ ném <code>Error('Request failed: &lt;status&gt;')</code>;</li>
<li>còn lại trả JSON đã parse.</li></ul>
<p><code>fetch</code> do máy chấm giả lập (không có mạng): nó trả lời theo một bảng và ghi lại mọi lời gọi.</p>`,
  yc: [['<code>fetch</code> does NOT reject on 401/500 — check <code>res.ok</code> / <code>res.status</code> yourself.', '<code>fetch</code> KHÔNG reject khi 401/500 — tự kiểm <code>res.ok</code> / <code>res.status</code>.'], ['Do not add a trailing slash problem: <code>apiUrl</code> has no trailing slash.', 'Đừng tạo lỗi dấu gạch cuối: <code>apiUrl</code> không có gạch chéo cuối.']],
  viDu: [['await fetchProducts("https://api.shop.dev", "tok123")', '[{"id":1,"name":"Book"}]', 'Header sent: Authorization: Bearer tok123.', 'Header đã gửi: Authorization: Bearer tok123.'], ['the API answers 401', 'throws Error: Session expired, please log in again', 'The UI can send the user to /login.', 'Giao diện có thể đưa người dùng về /login.']],
  goiY: [['<code>const res = await fetch(´@{apiUrl}/api/products´, { headers: { Authorization: ´Bearer @{token}´ } });</code>', '<code>const res = await fetch(´@{apiUrl}/api/products´, { headers: { Authorization: ´Bearer @{token}´ } });</code>'], ['<code>if (res.status === 401) throw new Error(…); if (!res.ok) throw new Error(\'Request failed: \' + res.status);</code>', '<code>if (res.status === 401) throw new Error(…); if (!res.ok) throw new Error(\'Request failed: \' + res.status);</code>']],
  loi: [['<code>return res.json()</code> without checking <code>res.ok</code>: the error body becomes the "products" and the page shows nothing.', '<code>return res.json()</code> không kiểm <code>res.ok</code>: thân lỗi thành "sản phẩm" và trang không hiện gì.'], ['<code>Authorization: token</code> without "Bearer " — requireAuth answers 401.', '<code>Authorization: token</code> thiếu "Bearer " — requireAuth trả 401.']],
  gt: ['The front-end half of the contract: send the JWT in the Authorization header, read the status code before the body, and turn 401 into a specific, actionable error. This mirrors the back-end: the API chose the codes, the client acts on them.', 'Nửa phía front-end của hợp đồng: gửi JWT trong header Authorization, đọc mã trạng thái trước thân, và biến 401 thành một lỗi cụ thể, xử lý được. Nó soi gương phía back-end: API chọn mã, client hành động theo mã.'],
  kn: ['fetch', 'Bearer token'],
  tns: [tn('fetch', 'API gửi request của trình duyệt'), tn('res.ok', 'đúng khi mã 200–299')],
  dau: J`async function fetchProducts(apiUrl, token) {
  const res = await fetch(apiUrl + '/api/products', { headers: { Authorization: token } });
  return res.json();
}
`,
  giai: J`async function fetchProducts(apiUrl, token) {
  const res = await fetch(´@{apiUrl}/api/products´, {
    headers: { Authorization: ´Bearer @{token}´ },      // the JWT travels in the header
  });
  // fetch only rejects on NETWORK failure — HTTP errors must be checked by hand
  if (res.status === 401) throw new Error('Session expired, please log in again');
  if (!res.ok) throw new Error('Request failed: ' + res.status);
  return res.json();
}
`,
  cases: [
    { goi: `[await fetchProducts('https://api.shop.dev', 'tok123'), __fetchDaGoi.map((c) => c.method + ' ' + c.url + ' ' + (c.headers.Authorization || c.headers.authorization))]`, fetchGia: { 'GET https://api.shop.dev/api/products': { json: [{ id: 1, name: 'Book' }] } }, moTa: ['200 → the JSON; the Bearer header was sent', '200 → JSON; header Bearer đã gửi'] },
    { goi: `await fetchProducts('https://api.shop.dev', 'old')`, nem: 'Error', thongDiep: 'Session expired', fetchGia: { 'GET https://api.shop.dev/api/products': { status: 401, json: { error: 'Token expired' } } }, moTa: ['401 → Session expired error', '401 → lỗi Session expired'] },
    { goi: `await fetchProducts('https://api.shop.dev', 't').catch((e) => e.message)`, fetchGia: { 'GET https://api.shop.dev/api/products': { status: 500, json: { error: 'Internal Server Error' } } }, moTa: ['500 → Request failed: 500', '500 → Request failed: 500'] },
    { goi: `await fetchProducts('http://localhost:3000', 'abc')`, fetchGia: { 'GET http://localhost:3000/api/products': { json: [] } }, an: true },
    { goi: `await fetchProducts('https://api.shop.dev', 't').catch((e) => e.message)`, fetchGia: { 'GET https://api.shop.dev/api/products': { status: 403, json: { error: 'Forbidden' } } }, an: true },
  ],
});

const E5 = bai({
  ten: 'A small API client for the whole app: apiRequest(path, options)', kho: 'HARD', phut: 20, lib: [],
  en: J`<p>Write <code>createApi(baseUrl)</code> → <code>apiRequest(path, { method = 'GET', body, token } = {})</code> used by every React page:</p>
<ul><li>sends JSON: if <code>body</code> is given, <code>Content-Type: application/json</code> and <code>JSON.stringify(body)</code>; adds <code>Authorization: Bearer …</code> when <code>token</code> is given;</li>
<li>a network failure (fetch rejects) ⇒ throw <code>Error('Network error — is the API running?')</code>;</li>
<li><code>204</code> ⇒ return <code>null</code> (no body to parse);</li>
<li>a response whose <code>Content-Type</code> is not JSON (e.g. a host's HTML 502 page) ⇒ throw <code>Error('Server error ' + status)</code>;</li>
<li>a JSON error (non-2xx) ⇒ throw <code>Error(body.error || 'Request failed: ' + status)</code> with a property <code>status</code>;</li>
<li>otherwise return the parsed JSON.</li></ul>`,
  vi: J`<p>Viết <code>createApi(baseUrl)</code> → <code>apiRequest(path, { method = 'GET', body, token } = {})</code> dùng cho mọi trang React:</p>
<ul><li>gửi JSON: có <code>body</code> thì <code>Content-Type: application/json</code> và <code>JSON.stringify(body)</code>; có <code>token</code> thì thêm <code>Authorization: Bearer …</code>;</li>
<li>mạng hỏng (fetch reject) ⇒ ném <code>Error('Network error — is the API running?')</code>;</li>
<li><code>204</code> ⇒ trả <code>null</code> (không có thân để parse);</li>
<li>response có <code>Content-Type</code> không phải JSON (vd trang HTML 502 của host) ⇒ ném <code>Error('Server error ' + status)</code>;</li>
<li>lỗi JSON (không phải 2xx) ⇒ ném <code>Error(body.error || 'Request failed: ' + status)</code> kèm thuộc tính <code>status</code>;</li>
<li>còn lại trả JSON đã parse.</li></ul>`,
  yc: [['Read the type with <code>res.headers.get(\'content-type\')</code>.', 'Đọc kiểu bằng <code>res.headers.get(\'content-type\')</code>.'], ['Check 204 BEFORE trying to parse.', 'Kiểm 204 TRƯỚC khi parse.']],
  viDu: [['await api(\'/api/products\', { method: \'POST\', body: { name: \'Pen\' }, token: \'t\' })', '{"_id":"p1","name":"Pen"}', 'JSON in, JSON out.', 'JSON vào, JSON ra.'], ['the host answers 502 with an HTML page', 'throws Error: Server error 502', 'Not "Unexpected token <".', 'Không phải "Unexpected token <".']],
  goiY: [['<code>let res; try { res = await fetch(baseUrl + path, init); } catch { throw new Error(\'Network error — is the API running?\'); }</code>', '<code>let res; try { res = await fetch(baseUrl + path, init); } catch { throw new Error(\'Network error — is the API running?\'); }</code>'], ['<code>const isJson = (res.headers.get(\'content-type\') || \'\').includes(\'application/json\');</code>', '<code>const isJson = (res.headers.get(\'content-type\') || \'\').includes(\'application/json\');</code>']],
  loi: [['<code>await res.json()</code> on an HTML 502: "Unexpected token &lt;" reaches the user instead of a readable message.', '<code>await res.json()</code> trên trang HTML 502: "Unexpected token &lt;" tới tay người dùng thay vì một thông báo đọc được.'], ['Parsing a 204: there is no body.', 'Parse một 204: không có thân.'], ['Sending a JS object as <code>body</code> without <code>JSON.stringify</code>: fetch sends "[object Object]".', 'Gửi đối tượng JS làm <code>body</code> mà không <code>JSON.stringify</code>: fetch gửi "[object Object]".']],
  gt: ['One client function encodes the whole HTTP contract on the React side: JSON in both directions, the token in a header, and every failure mode turned into one readable Error — network down, the host\'s HTML error page during a deploy, the API\'s own <code>{ error }</code> envelope (with its status kept for the UI), and the empty 204.', 'Một hàm client mã hoá toàn bộ hợp đồng HTTP ở phía React: JSON cả hai chiều, token trong header, và mọi kiểu thất bại thành một Error đọc được — mạng sập, trang lỗi HTML của host lúc deploy, vỏ <code>{ error }</code> của chính API (giữ lại mã cho giao diện), và 204 rỗng.'],
  kn: ['fetch', 'error handling'],
  tns: [tn('API client', 'hàm gọi API dùng chung')],
  dau: J`function createApi(baseUrl) {
  return async function apiRequest(path, { method = 'GET', body, token } = {}) {
    const res = await fetch(baseUrl + path, { method, body, headers: { Authorization: 'Bearer ' + token } });
    return res.json();
  };
}
`,
  giai: J`function createApi(baseUrl) {
  return async function apiRequest(path, { method = 'GET', body, token } = {}) {
    const headers = {};
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (token) headers.Authorization = 'Bearer ' + token;

    let res;
    try {
      res = await fetch(baseUrl + path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
    } catch {
      throw new Error('Network error — is the API running?');      // fetch rejects only when there is no response
    }

    if (res.status === 204) return null;                            // nothing to parse
    const isJson = (res.headers.get('content-type') || '').includes('application/json');
    if (!isJson) throw new Error('Server error ' + res.status);      // e.g. the host's HTML 502 page
    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data.error || 'Request failed: ' + res.status);
      err.status = res.status;                                      // the UI can react to 401/403/404
      throw err;
    }
    return data;
  };
}
`,
  chuanBi: `const api = createApi('https://api.shop.dev'); const fail = (p) => p.then((v) => ({ ok: v }), (e) => ({ error: e.message, status: e.status === undefined ? null : e.status }));
const call0 = () => { const c = __fetchDaGoi[0]; const h = {}; Object.keys(c.headers || {}).forEach((k) => { h[k.toLowerCase()] = c.headers[k]; }); return { method: c.method, url: c.url, headers: h, body: c.body == null ? null : JSON.parse(c.body) }; };`,
  cases: [
    { goi: `[await api('/api/products', { method: 'POST', body: { name: 'Pen' }, token: 't' }), call0()]`, fetchGia: { 'POST https://api.shop.dev/api/products': { status: 201, json: { _id: 'p1', name: 'Pen' } } }, moTa: ['POST sends JSON + headers and returns the JSON', 'POST gửi JSON + header và trả JSON'] },
    { goi: `await fail(api('/api/products/p1', { method: 'DELETE', token: 't' }))`, fetchGia: { 'DELETE https://api.shop.dev/api/products/p1': { status: 204, text: '' } }, moTa: ['204 → null', '204 → null'] },
    { goi: `await fail(api('/api/products'))`, fetchGia: { 'GET https://api.shop.dev/api/products': { status: 502, text: '<html><body>Bad Gateway</body></html>', headers: { 'content-type': 'text/html' } } }, moTa: ['HTML 502 → Server error 502', 'HTML 502 → Server error 502'] },
    { goi: `await fail(api('/api/products', { method: 'POST', body: {} }))`, fetchGia: { 'POST https://api.shop.dev/api/products': { status: 400, json: { error: 'name and price required' } } }, moTa: ['JSON 400 → its error message + status', 'JSON 400 → thông báo lỗi của nó + status'] },
    { goi: `await fail(api('/api/products'))`, fetchGia: { 'GET https://api.shop.dev/api/products': { loiMang: true } }, moTa: ['Network down → readable error', 'Mạng sập → lỗi đọc được'] },
    { goi: `[await fail(api('/api/me', { token: 'x' })), call0().headers]`, fetchGia: { 'GET https://api.shop.dev/api/me': { status: 401, json: {} } }, an: true },
    { goi: `[await api('/api/products'), call0()]`, fetchGia: { 'GET https://api.shop.dev/api/products': { json: [] } }, an: true },
  ],
});

export default doiDau({
  slug: 'sdn302-6-1-react-deploy',
  ten: '6.1 Connect React, deploy & BaaS',
  khoa: KHOA,
  baiHoc: 'sdn302-6-1-react-deploy',
  de: [E1, E2, E3, E4, E5],
});
