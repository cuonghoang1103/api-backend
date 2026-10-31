/** API Design · 0.3 — Dựng khung LabFlow: thứ tự dựng dự án, thứ tự middleware, lỗi luôn là JSON; tự viết bộ định tuyến route(). */
import { doiDau, KHOA, cs, q, ord, tn, jsBai, nguon, goi, pre } from './_api.mjs';

/* ── 1. Thứ tự dựng ── */
const L1 = cs({
  ten: 'Skeleton 1 — Build the project in the right order', kho: 'EASY', phut: 6, loai: 'order',
  en: 'Lesson 0.3 builds LabFlow from an empty folder. Put the steps in the order that works on the first try.',
  vi: 'Bài 0.3 dựng LabFlow từ một thư mục trống. Sắp các bước theo thứ tự chạy được ngay lần đầu.',
  cau: [
    ord('o1', ['From an empty folder to curl -i /labs', 'Từ thư mục trống tới curl -i /labs'], [
      'node -v prints v22.x (install with nvm if not)',
      'mkdir labflow-api && cd labflow-api && npm init -y',
      'npm install express@5, then npm ls express to see the real version',
      'Add "type": "module" and the dev script "node --watch src/server.js" to package.json',
      'Write src/db.js, src/app.js and src/server.js',
      'npm run dev in terminal 1',
      'curl -i http://localhost:4000/labs in terminal 2',
    ], ['Check the runtime first, then the package, then the config that makes import work, then code, then run, then call. Running before "type": "module" gives the ES-module warning/error.', 'Kiểm môi trường chạy trước, rồi gói, rồi cấu hình để import chạy được, rồi code, rồi chạy, rồi gọi. Chạy trước khi có "type": "module" sẽ gặp cảnh báo/lỗi ES module.']),
  ],
  goiY: [['You cannot install a package before package.json exists.', 'Không cài gói được trước khi có package.json.'], ['Two terminals: one runs the server, one sends requests.', 'Hai terminal: một chạy server, một gửi request.']],
  loi: [['Running the server before adding "type": "module".', 'Chạy server trước khi thêm "type": "module".'], ['Assuming npm install express gives Express 5 — always check with npm ls.', 'Cho rằng npm install express cho ra Express 5 — luôn kiểm bằng npm ls.']],
  tns: [tn('package.json', 'tệp mô tả dự án npm'), tn('ES module', 'mô-đun ES', 'Dùng import/export.')],
  kn: ['project setup'],
});

/* ── 2. Thứ tự middleware & lỗi JSON ── */
const R404 = `$ curl -i http://localhost:4000/rooms
HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8
Content-Length: 70

{
  "error": "ROUTE_NOT_FOUND",
  "message": "Không có GET /rooms"
}`;
const L2 = cs({
  ten: 'Skeleton 2 — Always answer JSON', kho: 'MEDIUM', phut: 10,
  en: `The skeleton answers JSON even for a route that does not exist (real output, shortened):${pre(R404)}`,
  vi: `Bộ khung trả JSON kể cả với route không tồn tại (output thật, rút gọn):${pre(R404)}`,
  cau: [
    q('c1', ['Where must app.use((req, res) => res.status(404).json(…)) go?', 'app.use((req, res) => res.status(404).json(…)) phải đặt ở đâu?'], ['After every route — Express tries handlers in registration order', 'Before every route, so unknown paths are caught early', 'Anywhere — Express sorts handlers by specificity', 'Inside server.js, after app.listen()'], ['A middleware without a path matches everything. Placed first, it would answer 404 for /labs too.', 'Middleware không có path khớp mọi thứ. Đặt đầu tiên thì /labs cũng bị trả 404.']),
    q('c2', ['What makes Express treat a function as an error handler?', 'Điều gì khiến Express coi một hàm là bộ xử lý lỗi?'], ['It declares exactly four parameters (err, req, res, next)', 'Its name ends with “Error”', 'It is registered with app.error()', 'It returns a status code of 500'], ['Express checks the function’s length. Four parameters = error handler; it runs when a route throws, and it also goes last.', 'Express kiểm số tham số của hàm. Bốn tham số = bộ xử lý lỗi; nó chạy khi một route ném lỗi, và cũng đặt cuối cùng.']),
    q('c3', ['Without the error handler, a bug that throws in a route returns …', 'Không có bộ xử lý lỗi, một bug ném lỗi trong route sẽ trả về …'], ['500 with Express’s default HTML page — a client calling JSON.parse breaks', 'a 500 JSON body {error: "INTERNAL"} automatically', 'nothing — the request hangs forever', '200 with an empty body'], ['Express’s fallback handler writes HTML (and the stack trace outside production). The contract says “always JSON”, so we add our own handler.', 'Bộ xử lý mặc định của Express viết HTML (kèm stack trace khi không ở production). Hợp đồng nói "luôn JSON", nên ta tự thêm bộ xử lý.']),
    q('c4', ['Why does every error body have both error and message?', 'Vì sao body lỗi nào cũng có cả error và message?'], ['error is a stable code for programs; message is text for people and may change', 'error is for English users, message for Vietnamese users', 'message is required by RFC 9110, error is optional', 'Two fields make the JSON valid; one field would not be'], ['Clients branch on LAB_NOT_FOUND, never on the sentence, so the sentence can be reworded or translated freely (Chapter 2 turns this into RFC 9457).', 'Client rẽ nhánh theo LAB_NOT_FOUND, không bao giờ theo câu chữ, nên câu chữ có thể sửa hay dịch thoải mái (Chương 2 nâng thành RFC 9457).']),
    q('c5', ['In GET /labs/:labId the 404 line is written “return res.status(404).json(…)”. What does return prevent?', 'Trong GET /labs/:labId dòng 404 viết "return res.status(404).json(…)". return ngăn điều gì?'], ['Running on to res.json(lab) and sending a second response', 'Express sending the 404 twice to the client', 'The server process from stopping', 'The JSON being sent without Content-Type'], ['Without return the code continues. If the second res.json has a real body, Node throws ERR_HTTP_HEADERS_SENT (measured in lesson 0.3).', 'Thiếu return thì code chạy tiếp. Nếu res.json thứ hai có body thật, Node ném ERR_HTTP_HEADERS_SENT (đã đo trong bài 0.3).']),
  ],
  goiY: [['Express is a list of handlers tried top to bottom.', 'Express là một danh sách handler được thử từ trên xuống.'], ['Ask what a program (not a person) needs from an error.', 'Hỏi một chương trình (không phải con người) cần gì từ một lỗi.']],
  loi: [['Putting the 404 catch-all before the routes.', 'Đặt lưới hứng 404 trước các route.'], ['Writing the error handler with three parameters — it then becomes normal middleware.', 'Viết bộ xử lý lỗi với ba tham số — khi đó nó thành middleware thường.']],
  tns: [tn('middleware', 'phần mềm trung gian'), tn('catch-all', 'lưới hứng mọi thứ'), tn('error handler', 'bộ xử lý lỗi')],
  kn: ['Express', 'error contract'],
});

/* ── 3. Tự viết: route() ── */
function route(labs, method, path) {
  if (method === 'GET' && path === '/health') return { status: 200, body: { status: 'ok' } };
  if (method === 'GET' && path === '/labs') return { status: 200, body: { data: labs } };
  var m = /^\/labs\/([^/]+)$/.exec(path);
  if (method === 'GET' && m) {
    var lab = labs.find(function (l) { return l.id === m[1]; });
    if (!lab) return { status: 404, body: { error: 'LAB_NOT_FOUND', message: 'Không có phòng lab ' + m[1] } };
    return { status: 200, body: lab };
  }
  return { status: 404, body: { error: 'ROUTE_NOT_FOUND', message: 'Không có ' + method + ' ' + path } }; // the catch-all, last
}
const LABS = [
  { id: 'lab_1', code: 'AL-201', name: 'Phòng Lab Mạng máy tính', building: 'Alpha', capacity: 30 },
  { id: 'lab_2', code: 'AL-305', name: 'Phòng Lab IoT', building: 'Alpha', capacity: 24 },
  { id: 'lab_3', code: 'BE-102', name: 'Phòng Lab Phần mềm', building: 'Beta', capacity: 40 },
];
const L3 = jsBai({
  ten: 'Skeleton 3 — Write route(labs, method, path): the skeleton without Express', kho: 'MEDIUM', phut: 15,
  en: `<p>To see that Express is “just” a list of rules tried in order, write the LabFlow skeleton as a pure function <code>route(labs, method, path)</code> ⇒ <code>{ status, body }</code>, matching the real responses of lesson 0.3:</p><ul>
<li><code>GET /health</code> ⇒ 200 <code>{ status: 'ok' }</code>; <code>GET /labs</code> ⇒ 200 <code>{ data: labs }</code></li>
<li><code>GET /labs/&lt;id&gt;</code> (exactly one segment after /labs/) ⇒ 200 with that lab, or 404 <code>{ error: 'LAB_NOT_FOUND', message: 'Không có phòng lab &lt;id&gt;' }</code></li>
<li>Anything else — another method, another path, <code>/labs/lab_1/devices</code> — ⇒ 404 <code>{ error: 'ROUTE_NOT_FOUND', message: 'Không có &lt;METHOD&gt; &lt;path&gt;' }</code></li></ul>`,
  vi: `<p>Để thấy Express "chỉ là" một danh sách luật được thử theo thứ tự, hãy viết bộ khung LabFlow thành hàm thuần <code>route(labs, method, path)</code> ⇒ <code>{ status, body }</code>, khớp các response thật của bài 0.3:</p><ul>
<li><code>GET /health</code> ⇒ 200 <code>{ status: 'ok' }</code>; <code>GET /labs</code> ⇒ 200 <code>{ data: labs }</code></li>
<li><code>GET /labs/&lt;id&gt;</code> (đúng một đoạn sau /labs/) ⇒ 200 với phòng đó, hoặc 404 <code>{ error: 'LAB_NOT_FOUND', message: 'Không có phòng lab &lt;id&gt;' }</code></li>
<li>Còn lại — phương thức khác, path khác, <code>/labs/lab_1/devices</code> — ⇒ 404 <code>{ error: 'ROUTE_NOT_FOUND', message: 'Không có &lt;METHOD&gt; &lt;path&gt;' }</code></li></ul>`,
  dauVao: ['labs — array of labs; method — "GET", "POST"…; path — without query.', 'labs — mảng phòng; method — "GET", "POST"…; path — không có query.'],
  dauRa: ['{ status: number, body: object }', '{ status: số, body: object }'],
  goiY: [['Check the most specific rules first and end with the catch-all.', 'Kiểm luật cụ thể nhất trước và kết thúc bằng lưới hứng.'], ['/^\\/labs\\/([^/]+)$/ matches one segment only.', '/^\\/labs\\/([^/]+)$/ chỉ khớp đúng một đoạn.']],
  loi: [['path.startsWith("/labs/") — /labs/lab_1/devices would be treated as a lab id.', 'path.startsWith("/labs/") — /labs/lab_1/devices bị coi là id phòng.'], ['Answering POST /labs with the list because the path matches.', 'Trả danh sách cho POST /labs chỉ vì path khớp.']],
  gt: ['A route is method + path pattern. Express keeps them in a list and stops at the first match, so the order of rules — and a catch-all at the end — is the whole design.', 'Một route là phương thức + mẫu path. Express giữ chúng trong một danh sách và dừng ở cái khớp đầu tiên, nên thứ tự luật — và lưới hứng ở cuối — là toàn bộ thiết kế.'],
  kn: ['routing'],
  tns: [tn('route parameter', 'tham số đường dẫn', ':labId trong /labs/:labId.'), tn('pure function', 'hàm thuần')],
  dau: `/** labs, method, path ⇒ { status, body } — like the LabFlow skeleton */
function route(labs, method, path) {
  // Write your solution here
  if (path === '/labs') return { status: 200, body: { data: labs } };
  var id = path.split('/')[2];
  return { status: 200, body: labs.find(function (l) { return l.id === id; }) };
}
`,
  giai: '// Reference solution\n' + nguon(route),
  cases: [
    { goi: goi('route', LABS, 'GET', '/labs/lab_2') },
    { goi: goi('route', LABS, 'GET', '/rooms') },
    { goi: goi('route', LABS, 'GET', '/health') },
    { goi: goi('route', LABS, 'GET', '/labs/lab_9'), an: true },
    { goi: goi('route', LABS, 'POST', '/labs'), an: true },
    { goi: goi('route', LABS, 'GET', '/labs/lab_1/devices'), an: true },
    { goi: goi('route', LABS.slice(2), 'GET', '/labs'), an: true },
    { goi: goi('route', LABS, 'DELETE', '/labs/lab_1'), an: true },
  ],
});

export default doiDau({ slug: 'api-0-3-du-an-labflow', ten: '0.3 Set up: your LabFlow API skeleton', khoa: KHOA, baiHoc: 'api-0-3-du-an-labflow', de: [L1, L2, L3] });
