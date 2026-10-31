/** API Design · 6.4 — CORS, CSRF và trình duyệt: preflight, allow-list (đo bằng Chromium thật + log server). */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'CORS 1 — What the browser measurement showed', kho: 'EASY', phut: 10,
  en: 'Facts from lesson 6.4 (pages on :5173 and :5174 calling LabFlow on :4000 in a real Chromium, with the server log on).',
  vi: 'Những điều từ bài 6.4 (trang ở :5173 và :5174 gọi LabFlow ở :4000 trong Chromium thật, có bật log server).',
  cau: [
    q('c1', ['The page on :5174 (not allowed) did GET /v2/labs and saw “Failed to fetch”. What did the server log show?', 'Trang ở :5174 (không được phép) gọi GET /v2/labs và thấy “Failed to fetch”. Log server cho thấy gì?'],
      ['The GET reached the server and was answered — the browser only hid the response', 'Nothing — the browser blocked the GET before it left the page', 'An OPTIONS preflight, then nothing else from that page at all', 'The GET reached the server, which answered 403 Forbidden to it'],
      ['A simple request is sent; CORS decides only whether the page may READ the answer. CORS protects users’ browsers, not your server.', 'Request đơn giản vẫn được gửi; CORS chỉ quyết định trang có được ĐỌC câu trả lời không. CORS bảo vệ trình duyệt người dùng, không bảo vệ server.']),
    q('c2', ['The same page tried POST /v2/auth/login with a JSON body. What reached the server?', 'Cùng trang đó thử POST /v2/auth/login với body JSON. Cái gì tới được server?'],
      ['Only the OPTIONS preflight — the POST was never sent', 'The POST, followed by an OPTIONS request after the answer', 'Both, but the POST body arrived at the server empty', 'Nothing, because the browser knew the origin in advance'],
      ['Content-Type: application/json makes it non-simple ⇒ preflight first; no permission ⇒ the real request is not sent.', 'Content-Type: application/json làm nó không còn đơn giản ⇒ preflight trước; không có quyền ⇒ request thật không được gửi.']),
    q('c3', ['Why does LabFlow send Vary: Origin on every answer?', 'Vì sao LabFlow gửi Vary: Origin trên mọi câu trả lời?'],
      ['The answer differs by Origin, so caches must not reuse one origin’s answer for another', 'Because browsers refuse every response that does not carry it', 'To tell the client which origins are allowed to call the API', 'Because Express requires it whenever a route sets a header'],
      ['Without it a CDN could serve the allowed origin’s Access-Control-Allow-Origin to a stranger, or the reverse.', 'Thiếu nó, một CDN có thể đưa Access-Control-Allow-Origin của origin được phép cho người lạ, hoặc ngược lại.']),
    q('c4', ['With LABFLOW_VULN=1 the server answers Origin: https://evil.example with that same origin and Allow-Credentials: true. Consequence?', 'Với LABFLOW_VULN=1 server trả lời Origin: https://evil.example bằng đúng origin đó kèm Allow-Credentials: true. Hệ quả?'],
      ['Any website can read logged-in users’ data through their browsers', 'Nothing, since browsers ignore Allow-Credentials on GET requests', 'Only evil.example’s own server can call the API from now on', 'The API stops working for the allowed front-end on :5173'],
      ['Browsers refuse * with credentials exactly for this; reflecting the origin bypasses the guard.', 'Trình duyệt từ chối * kèm credentials chính vì lý do này; phản chiếu origin là lách qua hàng rào.']),
  ],
  goiY: [['Simple request: sent, then hidden. Non-simple: asked first.', 'Request đơn giản: gửi rồi giấu. Không đơn giản: hỏi trước.'], ['Read the server log, not only the browser console.', 'Đọc log server, không chỉ console trình duyệt.']],
  loi: [['Thinking CORS protects the server.', 'Nghĩ rằng CORS bảo vệ server.'], ['Reflecting the Origin header back.', 'Phản chiếu lại header Origin.']],
  tns: [tn('origin', 'scheme + host + cổng'), tn('preflight', 'request OPTIONS hỏi quyền trước')],
  kn: ['CORS', 'browser security'],
});

function corsAnswer(method, origin, requestMethod, allowed) {
  const headers = { Vary: 'Origin' };
  if (!origin) return { status: null, headers };
  const ok = allowed.includes(origin);
  if (ok) headers['Access-Control-Allow-Origin'] = origin;
  if (method === 'OPTIONS' && requestMethod) {
    if (ok) {
      headers['Access-Control-Allow-Methods'] = 'GET, HEAD, POST, PUT, PATCH, DELETE';
      headers['Access-Control-Max-Age'] = '600';
    }
    return { status: 204, headers };
  }
  return { status: null, headers };
}
const AL = ['http://localhost:5173'];
const E2 = jsBai({
  ten: 'CORS 2 — Write corsAnswer(method, origin, requestMethod, allowed): LabFlow’s CORS middleware', kho: 'MEDIUM', phut: 15,
  en: `<p>Return <code>{ status, headers }</code> — <code>status: 204</code> when the middleware answers a preflight itself, <code>null</code> when the request goes on to the route.</p><ul>
<li>Always <code>Vary: 'Origin'</code>. No <code>origin</code> ⇒ nothing else, <code>status: null</code>.</li>
<li>Origin in <code>allowed</code> ⇒ <code>Access-Control-Allow-Origin</code> = that exact origin (never <code>*</code>).</li>
<li>A preflight is <code>method === 'OPTIONS'</code> with a <code>requestMethod</code>. Answer 204; if allowed, also <code>Access-Control-Allow-Methods: 'GET, HEAD, POST, PUT, PATCH, DELETE'</code> and <code>Access-Control-Max-Age: '600'</code>.</li></ul>
<p>(The real middleware also sets Expose-Headers and Allow-Headers; they are left out here.)</p>`,
  vi: `<p>Trả <code>{ status, headers }</code> — <code>status: 204</code> khi middleware tự trả lời preflight, <code>null</code> khi request đi tiếp vào route.</p><ul>
<li>Luôn có <code>Vary: 'Origin'</code>. Không có <code>origin</code> ⇒ không thêm gì, <code>status: null</code>.</li>
<li>Origin nằm trong <code>allowed</code> ⇒ <code>Access-Control-Allow-Origin</code> = đúng origin đó (không bao giờ <code>*</code>).</li>
<li>Preflight là <code>method === 'OPTIONS'</code> kèm <code>requestMethod</code>. Trả 204; nếu được phép thì thêm <code>Access-Control-Allow-Methods: 'GET, HEAD, POST, PUT, PATCH, DELETE'</code> và <code>Access-Control-Max-Age: '600'</code>.</li></ul>
<p>(Middleware thật còn đặt Expose-Headers và Allow-Headers; ở đây bỏ qua.)</p>`,
  dauVao: ['method, origin (string | null), requestMethod (string | null), allowed (string[])', 'method, origin (chuỗi | null), requestMethod (chuỗi | null), allowed (string[])'],
  dauRa: ['{ status: 204 | null, headers }', '{ status: 204 | null, headers }'],
  goiY: [['Vary goes on every answer, allowed or not.', 'Vary có trên mọi câu trả lời, được phép hay không.'], ['A stranger’s preflight still gets 204 — just without permission headers.', 'Preflight của người lạ vẫn nhận 204 — chỉ là không có header cấp quyền.']],
  loi: [['Answering * — refused with credentials and leaks without them.', 'Trả * — bị từ chối khi có credentials và rò rỉ khi không có.'], ['Treating every OPTIONS as a preflight.', 'Coi mọi OPTIONS là preflight.']],
  gt: ['Lesson 6.4: :5173 got the full preflight; :5174 got 204 with only Vary: Origin; GET /v2/labs from :5174 got 200 without Access-Control-Allow-Origin.', 'Bài 6.4: :5173 nhận preflight đầy đủ; :5174 nhận 204 chỉ có Vary: Origin; GET /v2/labs từ :5174 nhận 200 không có Access-Control-Allow-Origin.'],
  kn: ['CORS'],
  tns: [tn('allow-list', 'danh sách cho phép'), tn('Max-Age', 'trình duyệt nhớ kết quả preflight bao lâu (giây)')],
  dau: `/** what LabFlow's CORS middleware answers */
function corsAnswer(method, origin, requestMethod, allowed) {
  // Write your solution here
  return { status: method === 'OPTIONS' ? 204 : null, headers: { 'Access-Control-Allow-Origin': '*' } };
}
`,
  giai: '// Reference solution\n' + nguon(corsAnswer),
  cases: [
    { goi: goi('corsAnswer', 'OPTIONS', 'http://localhost:5173', 'POST', AL), moTa: ['Preflight from the allowed page', 'Preflight từ trang được phép'] },
    { goi: goi('corsAnswer', 'OPTIONS', 'http://localhost:5174', 'POST', AL), moTa: ['Preflight from the stranger', 'Preflight từ người lạ'] },
    { goi: goi('corsAnswer', 'GET', 'http://localhost:5174', null, AL), an: true, moTa: ['Simple GET from the stranger', 'GET đơn giản từ người lạ'] },
    { goi: goi('corsAnswer', 'GET', null, null, AL), an: true, moTa: ['curl (no Origin)', 'curl (không có Origin)'] },
    { goi: goi('corsAnswer', 'OPTIONS', 'http://localhost:5173', null, AL), an: true, moTa: ['OPTIONS that is not a preflight', 'OPTIONS không phải preflight'] },
    { goi: goi('corsAnswer', 'PATCH', 'https://app.labflow.example', null, ['http://localhost:5173', 'https://app.labflow.example']), an: true },
  ],
});

export default doiDau({ slug: 'api-6-4-cors', ten: '6.4 CORS, CSRF and browsers', khoa: KHOA, baiHoc: 'api-6-4-cors', de: [E1, E2] });
