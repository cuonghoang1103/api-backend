/** SDN302 · Lab Chương 1 — Server ghi chú không framework: http thuần + fs.promises (nạp lúc khởi động, ghi khi thêm), URL + query, đọc thân từng mẩu, 400/404/405/415, Location. Đề "bản in". */
import { doiDau, KHOA, bai, cs, q, qn, tn } from './_sdn.mjs';

const J = String.raw;
const NOTES = [{ id: 1, title: 'Read lesson 1.1', done: true }, { id: 2, title: 'Build the raw server', done: false }, { id: 3, title: 'Compare with Express', done: false }];

const L1 = cs({
  ten: 'Lab 1 · warm-up — what the lab server does on one thread', kho: 'EASY', phut: 8, dangBai: 'lab',
  en: 'Before coding the lab: reason about the server you are going to build (Node 22, http module, fs.promises).',
  vi: 'Trước khi viết lab: suy luận về server bạn sắp dựng (Node 22, module http, fs.promises).',
  cau: [
    q('w1', ['The server must load <code>data/notes.json</code> before answering. Where should <code>await fs.promises.readFile</code> happen?', 'Server phải nạp <code>data/notes.json</code> trước khi trả lời. <code>await fs.promises.readFile</code> nên nằm ở đâu?'],
      ['Once, in an async start-up function, before the server starts listening', 'Inside every request handler, before answering', 'With readFileSync at the top of every request, to be safe', 'After listen, in a setTimeout of 1 second'],
      ['Load once at start-up (non-blocking), then serve from memory; writes go back to the file asynchronously.', 'Nạp một lần lúc khởi động (không chặn), rồi phục vụ từ bộ nhớ; ghi lại tệp bất đồng bộ.']),
    q('w2', ['Two POST requests arrive at the same time. The first is still receiving its body chunks. What happens to the second?', 'Hai request POST đến cùng lúc. Cái đầu vẫn đang nhận các mẩu thân. Cái thứ hai ra sao?'],
      ['It is served too: chunks of both requests are handled as they arrive, interleaved on the same thread', 'It waits until the first request has completely finished', 'Node rejects it with 503', 'It is queued by the operating system for 30 seconds'],
      ['Receiving a body is I/O: while waiting for chunks the thread handles other events.', 'Nhận thân là I/O: trong lúc chờ mẩu, luồng xử lý các sự kiện khác.']),
    qn('w3', ['Which answers must the lab server write BY HAND because there is no Express? (choose all)', 'Câu trả lời nào server lab phải tự viết TAY vì không có Express? (chọn hết)'],
      ['The <code>Content-Type: application/json</code> header', 'Parsing <code>/api/notes/2</code> into an id', 'Collecting and parsing the JSON body', 'Accepting TCP connections', 'Sending the bytes over the network'],
      [0, 1, 2], ['The http module handles connections and transport; routing, parsing and headers are yours.', 'Module http lo kết nối và truyền tải; định tuyến, đọc thân và header là việc của bạn.']),
    q('w4', ['<code>DELETE /api/notes</code> (the list) — the path exists, the method does not. Which status?', '<code>DELETE /api/notes</code> (danh sách) — đường có, phương thức thì không. Mã nào?'],
      ['405 with an <code>Allow</code> header listing the methods that exist', '404 because there is no DELETE route', '400 because the request is wrong', '200 with an empty list'],
      ['405 tells the client the resource exists and what it may do with it.', '405 cho client biết tài nguyên có tồn tại và được làm gì với nó.']),
  ],
  goiY: [['Start-up vs per request.', 'Lúc khởi động vs mỗi request.'], ['Waiting is not working.', 'Chờ không phải là làm.']],
  loi: [['Reading the file in every request.', 'Đọc tệp ở mỗi request.'], ['404 for a wrong method.', '404 cho sai phương thức.']],
  tns: [tn('start-up', 'khởi động'), tn('interleaved', 'xen kẽ')],
  kn: ['event loop', 'http'],
});

const L2 = bai({
  ten: 'Lab 1 — Notes API with Node\'s http module only', kho: 'HARD', phut: 75, dangBai: 'lab', lib: ['http'],
  en: J`<p>Build the Notes API of the chapter without any framework. See the full brief (requirements, data, rubric) in the statement.</p>`,
  vi: J`<p>Dựng API Ghi chú của chương mà không dùng framework nào. Xem đề đầy đủ (yêu cầu, dữ liệu, thang điểm) trong tờ đề.</p>`,
  yc: [['Follow the brief.', 'Làm theo tờ đề.'], ['Export <code>createServer</code>.', 'Export <code>createServer</code>.']],
  viDu: [['await (await createServer()).inject({ url: \'/api/notes?done=false\' })', '200 [{"id":2,…},{"id":3,…}]', 'Notes loaded from data/notes.json at start-up.', 'Ghi chú được nạp từ data/notes.json lúc khởi động.']],
  goiY: [['Write <code>send(res, status, data, headers)</code> and <code>readBody(req)</code> (a Promise of the raw text) first.', 'Viết <code>send(res, status, data, headers)</code> và <code>readBody(req)</code> (một Promise của chữ thô) trước tiên.'], ['Route by <code>url.pathname</code>: list (<code>/api/notes</code>), one (<code>/^\\/api\\/notes\\/([^/]+)$/</code>), else 404; then check the method (405).', 'Định tuyến theo <code>url.pathname</code>: danh sách (<code>/api/notes</code>), một cái (<code>/^\\/api\\/notes\\/([^/]+)$/</code>), còn lại 404; rồi mới kiểm phương thức (405).']],
  loi: [['Reading the notes file in every request, or with readFileSync.', 'Đọc tệp ghi chú ở mỗi request, hoặc bằng readFileSync.'], ['Parsing the body in a <code>data</code> handler instead of <code>end</code>.', 'Parse thân trong handler <code>data</code> thay vì <code>end</code>.'], ['Forgetting <code>Allow</code> on 405, or the <code>Location</code> header on 201.', 'Quên <code>Allow</code> khi 405, hoặc header <code>Location</code> khi 201.']],
  gt: ['The lab rebuilds by hand everything Express gives you: an async start-up that loads state once, routing by path then method (which is how 404 and 405 differ), a body reader that collects chunks and parses once, and explicit headers on every answer. Persisting with <code>fs.promises.writeFile</code> keeps the event loop free while the disk works.', 'Lab tự tay dựng lại mọi thứ Express cho bạn: khởi động bất đồng bộ nạp trạng thái một lần, định tuyến theo đường rồi theo phương thức (đó là chỗ 404 và 405 khác nhau), bộ đọc thân gom mẩu rồi parse một lần, và header tường minh ở mọi câu trả lời. Lưu bằng <code>fs.promises.writeFile</code> giữ event loop rảnh trong lúc đĩa làm việc.'],
  kn: ['http module', 'fs.promises', 'routing by hand'],
  tns: [tn('start-up state', 'trạng thái nạp lúc khởi động'), tn('persist', 'lưu bền')],
  banIn: {
    tieuDe: { en: 'Lab 1 — Notes API without a framework', vi: 'Lab 1 — API Ghi chú không framework' },
    phu: { en: 'Node.js 22 · http · fs.promises · 75 minutes · 10 marks', vi: 'Node.js 22 · http · fs.promises · 75 phút · 10 điểm' },
    moTa: { en: '<p>Write <code>async function createServer()</code> in <code>answer.js</code>: it loads the notes from <code>data/notes.json</code>, then returns an <code>http</code> server (do not call <code>listen</code>). The grader sends requests with <code>server.inject({ method, url, headers, body })</code>. Every answer is JSON with <code>Content-Type: application/json</code>.</p>', vi: '<p>Viết <code>async function createServer()</code> trong <code>answer.js</code>: nó nạp ghi chú từ <code>data/notes.json</code>, rồi trả về một server <code>http</code> (không gọi <code>listen</code>). Máy chấm gửi request bằng <code>server.inject({ method, url, headers, body })</code>. Mọi câu trả lời là JSON với <code>Content-Type: application/json</code>.</p>' },
    chucNangChinh: [{ en: 'List, filter, read, create and delete notes', vi: 'Liệt kê, lọc, đọc, tạo và xoá ghi chú' }, { en: 'Notes persist in a JSON file', vi: 'Ghi chú được lưu bền trong một tệp JSON' }],
    yeuCauChung: [
      { en: 'Only <code>require(\'http\')</code>, <code>require(\'fs\')</code> (promises API) and <code>require(\'path\')</code> — no Express.', vi: 'Chỉ dùng <code>require(\'http\')</code>, <code>require(\'fs\')</code> (API promises) và <code>require(\'path\')</code> — không Express.' },
      { en: 'No <code>readFileSync</code> / <code>writeFileSync</code>.', vi: 'Không <code>readFileSync</code> / <code>writeFileSync</code>.' },
      { en: 'A missing <code>data/notes.json</code> means "no notes yet" (start with <code>[]</code>); any other read error must make <code>createServer()</code> reject.', vi: '<code>data/notes.json</code> không có nghĩa là "chưa có ghi chú" (bắt đầu với <code>[]</code>); lỗi đọc khác thì <code>createServer()</code> phải reject.' },
      { en: 'Export: <code>module.exports = { createServer };</code>', vi: 'Export: <code>module.exports = { createServer };</code>' },
    ],
    cayThuMuc: 'answer.js          ← your code\ndata/notes.json    ← the notes (array)\nlib/core.js, lib/http.js  ← provided',
    moHinh: { ten: 'Note', truong: [['id', 'Number', { en: 'unique, next id = biggest + 1', vi: 'duy nhất, id kế = lớn nhất + 1' }], ['title', 'String', { en: '1–100 characters after trim', vi: '1–100 ký tự sau trim' }], ['done', 'Boolean', { en: 'default false', vi: 'mặc định false' }]] },
    duLieuMau: JSON.stringify(NOTES, null, 2),
    chucNang: [
      { ten: { en: 'List notes (+ ?done filter)', vi: 'Liệt kê ghi chú (+ lọc ?done)' }, diem: 2, yeuCau: [
        { en: '<code>GET /api/notes</code> → 200 + all notes.', vi: '<code>GET /api/notes</code> → 200 + mọi ghi chú.' },
        { en: '<code>?done=true</code> / <code>?done=false</code> filters; any other value → 400 <code>{ "error": "done must be true or false" }</code>.', vi: '<code>?done=true</code> / <code>?done=false</code> lọc; giá trị khác → 400 <code>{ "error": "done must be true or false" }</code>.' }] },
      { ten: { en: 'Read one note', vi: 'Đọc một ghi chú' }, diem: 2, yeuCau: [
        { en: '<code>GET /api/notes/:id</code> → 200 + the note.', vi: '<code>GET /api/notes/:id</code> → 200 + ghi chú.' },
        { en: 'id not a positive integer → 400 <code>{ "error": "Invalid id" }</code>; unknown → 404 <code>{ "error": "Note not found" }</code>.', vi: 'id không phải số nguyên dương → 400 <code>{ "error": "Invalid id" }</code>; không có → 404 <code>{ "error": "Note not found" }</code>.' }] },
      { ten: { en: 'Create a note (read the body, persist)', vi: 'Tạo ghi chú (đọc thân, lưu bền)' }, diem: 3, yeuCau: [
        { en: '<code>POST /api/notes</code>, Content-Type must start with <code>application/json</code> → else 415 <code>{ "error": "Content-Type must be application/json" }</code>.', vi: '<code>POST /api/notes</code>, Content-Type phải bắt đầu bằng <code>application/json</code> → không thì 415 <code>{ "error": "Content-Type must be application/json" }</code>.' },
        { en: 'Invalid JSON → 400 <code>{ "error": "Invalid JSON" }</code>; title missing / not 1–100 characters → 400 <code>{ "error": "title must be 1-100 characters" }</code>.', vi: 'JSON hỏng → 400 <code>{ "error": "Invalid JSON" }</code>; thiếu title / không 1–100 ký tự → 400 <code>{ "error": "title must be 1-100 characters" }</code>.' },
        { en: '201 + <code>{ id, title, done: false }</code> + header <code>Location: /api/notes/&lt;id&gt;</code>; then the whole array is written to <code>data/notes.json</code> with <code>fs.promises.writeFile</code> (2-space JSON).', vi: '201 + <code>{ id, title, done: false }</code> + header <code>Location: /api/notes/&lt;id&gt;</code>; rồi cả mảng được ghi vào <code>data/notes.json</code> bằng <code>fs.promises.writeFile</code> (JSON thụt 2 dấu cách).' }] },
      { ten: { en: 'Delete a note', vi: 'Xoá ghi chú' }, diem: 1.5, yeuCau: [
        { en: '<code>DELETE /api/notes/:id</code> → 204 (empty body) and the file is rewritten; 400 / 404 as in feature 2.', vi: '<code>DELETE /api/notes/:id</code> → 204 (thân rỗng) và tệp được ghi lại; 400 / 404 như chức năng 2.' }] },
      { ten: { en: '404 / 405 and JSON everywhere', vi: '404 / 405 và JSON ở mọi nơi' }, diem: 1.5, yeuCau: [
        { en: 'Other methods on <code>/api/notes</code> → 405 + <code>Allow: GET, POST</code>; on <code>/api/notes/:id</code> → 405 + <code>Allow: GET, DELETE</code>; body <code>{ "error": "Method not allowed" }</code>.', vi: 'Phương thức khác trên <code>/api/notes</code> → 405 + <code>Allow: GET, POST</code>; trên <code>/api/notes/:id</code> → 405 + <code>Allow: GET, DELETE</code>; thân <code>{ "error": "Method not allowed" }</code>.' },
        { en: 'Any other path → 404 <code>{ "error": "Not found" }</code>.', vi: 'Đường khác → 404 <code>{ "error": "Not found" }</code>.' }] },
    ],
    truDiem: [
      { en: 'readFileSync / writeFileSync anywhere: −1.', vi: 'Có readFileSync / writeFileSync: −1.' },
      { en: 'A request that never gets an answer (missing <code>res.end</code>) loses the whole feature.', vi: 'Request không bao giờ được trả lời (thiếu <code>res.end</code>) mất điểm cả chức năng.' },
    ],
    nopBai: { en: 'Submit <code>answer.js</code>. The grader seeds <code>data/notes.json</code> itself.', vi: 'Nộp <code>answer.js</code>. Máy chấm tự tạo <code>data/notes.json</code>.' },
  },
  dau: J`const http = require('http');
const fs = require('fs');

async function createServer() {
  const notes = JSON.parse(fs.readFileSync('data/notes.json', 'utf8'));
  return http.createServer((req, res) => {
    if (req.url === '/api/notes') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(notes));
    }
  });
}

module.exports = { createServer };
`,
  giai: J`const http = require('http');
const fs = require('fs');

const FILE = 'data/notes.json';

function send(res, status, data, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json', ...headers });
  res.end(data === undefined ? undefined : JSON.stringify(data));
}

// the body arrives in chunks: resolve with the whole text once it has ended
function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => { raw += chunk; });
    req.on('end', () => resolve(raw));
    req.on('error', reject);
  });
}

async function loadNotes() {
  try {
    return JSON.parse(await fs.promises.readFile(FILE, 'utf8'));     // non-blocking, once
  } catch (err) {
    if (err.code === 'ENOENT') return [];                           // no file yet = no notes yet
    throw err;                                                      // anything else: fail start-up
  }
}

async function createServer() {
  const notes = await loadNotes();
  const save = () => fs.promises.writeFile(FILE, JSON.stringify(notes, null, 2));
  const parseId = (s) => (/^[1-9]\d*$/.test(s) ? Number(s) : null);

  return http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const one = url.pathname.match(/^\/api\/notes\/([^/]+)$/);
    const isList = url.pathname === '/api/notes';

    if (!isList && !one) return send(res, 404, { error: 'Not found' });

    if (isList) {
      if (req.method === 'GET') {
        const done = url.searchParams.get('done');
        if (done === null) return send(res, 200, notes);
        if (done !== 'true' && done !== 'false') return send(res, 400, { error: 'done must be true or false' });
        return send(res, 200, notes.filter((n) => n.done === (done === 'true')));
      }
      if (req.method === 'POST') {
        if (!(req.headers['content-type'] || '').startsWith('application/json')) {
          return send(res, 415, { error: 'Content-Type must be application/json' });
        }
        let data;
        try { data = JSON.parse(await readBody(req)); } catch { return send(res, 400, { error: 'Invalid JSON' }); }
        const title = data && typeof data.title === 'string' ? data.title.trim() : '';
        if (title.length < 1 || title.length > 100) return send(res, 400, { error: 'title must be 1-100 characters' });
        const note = { id: notes.reduce((m, n) => Math.max(m, n.id), 0) + 1, title, done: false };
        notes.push(note);
        await save();                                               // persist without blocking
        return send(res, 201, note, { Location: '/api/notes/' + note.id });
      }
      return send(res, 405, { error: 'Method not allowed' }, { Allow: 'GET, POST' });
    }

    // /api/notes/:id
    if (req.method !== 'GET' && req.method !== 'DELETE') {
      return send(res, 405, { error: 'Method not allowed' }, { Allow: 'GET, DELETE' });
    }
    const id = parseId(one[1]);
    if (id === null) return send(res, 400, { error: 'Invalid id' });
    const i = notes.findIndex((n) => n.id === id);
    if (i < 0) return send(res, 404, { error: 'Note not found' });
    if (req.method === 'GET') return send(res, 200, notes[i]);
    notes.splice(i, 1);
    await save();
    res.writeHead(204);
    res.end();
  });
}

module.exports = { createServer };
`,
  chuanBi: `__disk.put('data/notes.json', ${JSON.stringify(JSON.stringify(NOTES))}, 30); const server = await module.exports.createServer();
const go = async (method, url, body, type = 'application/json') => { const r = await server.inject({ method, url, body, headers: body !== undefined && type ? { 'content-type': type } : {} }); return { status: r.status, allow: r.headers.allow || null, location: r.headers.location || null, json: /json/.test(r.headers['content-type'] || '') || r.status === 204, body: r.body ? JSON.parse(r.body) : null }; };
const file = () => JSON.parse(__disk.get('data/notes.json'));`,
  cases: [
    { goi: `[await go('GET', '/api/notes'), await go('GET', '/api/notes?done=false')]`, nhom: 'f1', moTa: ['GET all notes and ?done=false', 'GET mọi ghi chú và ?done=false'] },
    { goi: `await go('GET', '/api/notes?done=yes')`, nhom: 'f1', an: true },
    { goi: `[await go('GET', '/api/notes/2'), await go('GET', '/api/notes/9')]`, nhom: 'f2', moTa: ['GET one: 200 / 404', 'GET một: 200 / 404'] },
    { goi: `[await go('GET', '/api/notes/abc'), await go('GET', '/api/notes/0'), await go('GET', '/api/notes/1.5')]`, nhom: 'f2', an: true },
    { goi: `[await go('POST', '/api/notes', '{"title":"  Write the lab  "}'), file().length]`, nhom: 'f3', moTa: ['POST → 201 + Location, and the file is rewritten', 'POST → 201 + Location, và tệp được ghi lại'] },
    { goi: `[await go('POST', '/api/notes', '{"title": oops}'), await go('POST', '/api/notes', '{"title":""}'), await go('POST', '/api/notes', 'title=x', 'application/x-www-form-urlencoded')]`, nhom: 'f3', moTa: ['400 Invalid JSON / 400 title / 415', '400 Invalid JSON / 400 title / 415'] },
    { goi: `[await go('POST', '/api/notes', JSON.stringify({ title: 'x'.repeat(101) })), (await go('POST', '/api/notes', '{"title":"A","done":true,"id":1}')).body, file().map((n) => n.id)]`, nhom: 'f3', an: true },
    { goi: `[await go('DELETE', '/api/notes/1'), await go('DELETE', '/api/notes/1'), file().map((n) => n.id)]`, nhom: 'f4', moTa: ['DELETE → 204, then 404; the file no longer has it', 'DELETE → 204, rồi 404; tệp không còn nó'] },
    { goi: `[await go('PUT', '/api/notes'), await go('PATCH', '/api/notes/1'), await go('GET', '/api/users')]`, nhom: 'f5', moTa: ['405 with Allow, 404 for unknown paths', '405 kèm Allow, 404 cho đường lạ'] },
    { goi: `(__disk.del('data/notes.json'), await (async () => { const s = await module.exports.createServer(); const r = await s.inject({ url: '/api/notes' }); return [r.status, r.body]; })())`, nhom: 'f1', an: true, moTa: ['No data file → start with []', 'Không có tệp dữ liệu → bắt đầu với []'] },
  ],
  kiemThem: [{ kiem: 'ma-nguon', moTa: { en: 'No readFileSync / writeFileSync', vi: 'Không readFileSync / writeFileSync' }, khop: '(readFileSync|writeFileSync)', phuDinh: true, tep: 'answer.js', nhom: 'f3' }],
});

export default doiDau({
  slug: 'sdn302-1-lab-raw-notes-server',
  ten: 'Lab 1 — Notes API without a framework',
  khoa: KHOA,
  baiHoc: 'sdn302-1-2-http-server',
  de: [L1, L2],
});
