/** Node.js · Lab 9 — Gia cố Notes API: thứ tự middleware, chuỗi middleware kiểu Express, và một app Notes bị lỗ hổng phải vá đủ 9.1–9.4. */
import { modul, cs, ord, tn, jsBai, nguon, MOI_TRUONG } from './_node-c9-11.mjs';

/* ─── L1. EASY · order ─── */
const L1 = {
  ...cs({
    ten: 'Lab 9 · 1 — Put the perimeter in the right order', kho: 'EASY', phut: 8, loai: 'order',
    en: 'Lesson 9.1: "helmet() and cors() only affect responses that pass through them. Mount them before your routes, and mount your error handler last — otherwise an error response can go out with none of these headers." Put the pieces in order.',
    vi: 'Bài 9.1: "helmet() và cors() chỉ tác động lên phản hồi đi qua chúng. Gắn chúng trước route, và gắn error handler sau cùng — không thì phản hồi lỗi có thể đi ra mà không có header nào." Sắp các phần theo đúng thứ tự.',
    cau: [
      ord('o1', ['Order the middleware of the Notes API exactly as cuongthai.com mounts them in src/index.ts (first → last).', 'Sắp middleware của Notes API đúng thứ tự cuongthai.com gắn trong src/index.ts (đầu → cuối).'],
        ['request-id (so even the earliest failure has an id)', 'helmet (security headers)', 'CORS with an explicit allow-list', 'body parsers with a size limit', 'the routes (POST /notes, GET /feed…)', 'the error handler (opaque 5xx + request id)'],
        ['Request id first so every log line and every error has it; headers and CORS before anything can fail; parsers before the routes that read req.body; the error handler last because Express sends next(err) to the handlers mounted AFTER the failing one.', 'Request id đầu tiên để mọi dòng log và mọi lỗi đều có; header và CORS trước bất cứ thứ gì có thể hỏng; parser trước các route đọc req.body; error handler sau cùng vì Express chuyển next(err) tới handler gắn SAU chỗ hỏng.']),
      ord('o2', ['The link-preview route receives <code>?url=…</code>. Order the steps of a safe fetch (lesson 9.3).', 'Route xem trước link nhận <code>?url=…</code>. Sắp các bước của một lần fetch an toàn (bài 9.3).'],
        ['Parse the URL with new URL() (reject what does not parse)', 'Require https: and an allow-listed hostname', 'fetch it with redirect: \'manual\'', 'On a 3xx, resolve Location and go back to the check', 'Only on a non-3xx answer, read the body and return'],
        ['Parse before you judge (127.1 and 2130706433 only reveal themselves after parsing); check before every request; manual redirects so each hop returns to the check.', 'Phân tích trước khi phán (127.1 và 2130706433 chỉ lộ mặt sau khi phân tích); kiểm trước mọi request; tự xử lý chuyển hướng để mỗi bước quay lại phép kiểm.']),
    ],
    goiY: [['Ask for each piece: "what must already have happened for this to work?"', 'Hỏi với mỗi phần: "điều gì phải xảy ra trước để cái này chạy được?"'], ['An error handler only receives errors from middleware mounted before it.', 'Error handler chỉ nhận lỗi từ middleware gắn trước nó.']],
    loi: [['Mounting helmet after the routes: every response the routes send goes out without headers.', 'Gắn helmet sau route: mọi phản hồi route gửi đi đều không có header.'], ['Checking the URL once, then letting fetch follow redirects.', 'Kiểm URL một lần rồi để fetch tự đi theo chuyển hướng.']],
    tns: [tn('middleware order', 'thứ tự middleware', 'Express chạy theo đúng thứ tự app.use')],
    kn: ['middleware', 'SSRF'],
  }),
  dangBai: 'lab',
};

/* ─── L2. MEDIUM · js — chuỗi middleware kiểu Express ─── */
function compose(middlewares, errorHandler) {
  return async function app(req, res) {
    let failed = false;
    const fail = async (err) => {
      if (failed) return;              // one error handler run per request
      failed = true;
      await errorHandler(err, req, res, () => {});
    };
    const run = async (i) => {
      if (i === middlewares.length) {
        // Fell off the end and nobody answered: that is a 404, not a hang.
        if (!res.ended) res.status(404).json({ error: 'NOT_FOUND' });
        return;
      }
      let nextP = null;
      const next = (err) => {
        // next(err) jumps straight to the error handler; next() runs the following middleware.
        nextP = err !== undefined ? fail(err) : run(i + 1);
        return nextP;
      };
      try {
        await middlewares[i](req, res, next);   // async middleware: a rejected promise is an error too
      } catch (err) {
        return fail(err);                         // a THROW (sync or async) is treated like next(err)
      }
      if (nextP) await nextP;                     // wait for the rest of the chain before resolving
    };
    await run(0);
  };
}

const CHAIN = String.raw`
async function call(app, init) {
  const u = new URL(init.url || '/', 'https://api.cuongthai.com');
  const req = { method: init.method || 'GET', url: u.pathname + u.search, path: u.pathname, query: Object.fromEntries(u.searchParams), headers: init.headers || {}, rawBody: init.rawBody, user: init.user };
  const res = makeRes(); await app(req, res);
  return { status: res.statusCode, headers: res.headers, body: res.body === undefined ? null : res.body };
}
const trace = [];
const mark = (name) => (req, res, next) => { trace.push(name); next(); };
const headers = (req, res, next) => { res.setHeader('X-Content-Type-Options', 'nosniff'); next(); };
const onErr = (err, req, res, next) => { trace.push('error:' + err.message); res.status(500).json({ error: 'INTERNAL' }); };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
`;

const L2 = jsBai({
  ten: 'Lab 9 · 2 — Build the middleware chain that makes order matter', kho: 'MEDIUM', phut: 25, dangBai: 'lab',
  en: `<p>Order only matters because of how Express walks the chain. Write <code>compose(middlewares, errorHandler)</code> → <code>async app(req, res)</code> with Express’s rules:</p>
<ul><li>run <code>middlewares</code> in order; each gets <code>(req, res, next)</code>; <code>next()</code> runs the following one;</li>
<li><code>next(err)</code> — or a middleware that <b>throws</b>, or an async one that <b>rejects</b> — skips everything left and calls <code>errorHandler(err, req, res, next)</code> once;</li>
<li>a middleware that neither calls <code>next</code> nor throws stops the chain (it answered, or it is waiting);</li>
<li>if the chain runs past the last middleware and <code>res.ended</code> is still false → <code>res.status(404).json({ error: 'NOT_FOUND' })</code>;</li>
<li><code>app</code> resolves only after the whole chain (including async middleware and the error handler) has finished.</li></ul>
<p>The tests use small middlewares that push their name into <code>trace</code>, and <code>call(app, { method, url })</code> which builds a fake request.</p>${MOI_TRUONG.en}`,
  vi: `<p>Thứ tự chỉ quan trọng vì cách Express đi qua chuỗi. Viết <code>compose(middlewares, errorHandler)</code> → <code>async app(req, res)</code> theo luật của Express:</p>
<ul><li>chạy <code>middlewares</code> theo thứ tự; mỗi cái nhận <code>(req, res, next)</code>; <code>next()</code> chạy cái tiếp theo;</li>
<li><code>next(err)</code> — hoặc middleware <b>ném lỗi</b>, hoặc middleware async bị <b>reject</b> — bỏ qua mọi thứ còn lại và gọi <code>errorHandler(err, req, res, next)</code> một lần;</li>
<li>middleware không gọi <code>next</code> cũng không ném lỗi thì chuỗi dừng (nó đã trả lời, hoặc đang chờ);</li>
<li>nếu chuỗi chạy quá middleware cuối mà <code>res.ended</code> vẫn false → <code>res.status(404).json({ error: 'NOT_FOUND' })</code>;</li>
<li><code>app</code> chỉ xong khi cả chuỗi (kể cả middleware async và error handler) đã chạy xong.</li></ul>
<p>Bộ kiểm dùng các middleware nhỏ đẩy tên vào <code>trace</code>, và <code>call(app, { method, url })</code> dựng request giả.</p>${MOI_TRUONG.vi}`,
  yc: [['Do not use real Express; write the chain walker yourself.', 'Không dùng Express thật; tự viết bộ đi chuỗi.'], ['The error handler runs at most once per request.', 'Error handler chạy nhiều nhất một lần mỗi request.']],
  goiY: [['Write <code>run(i)</code> that calls <code>middlewares[i]</code> with a <code>next</code> that calls <code>run(i + 1)</code>.', 'Viết <code>run(i)</code> gọi <code>middlewares[i]</code> với <code>next</code> gọi <code>run(i + 1)</code>.'], ['Wrap the call in <code>try { await … } catch (err) { … }</code> — that catches both a throw and a rejected promise.', 'Bọc lời gọi trong <code>try { await … } catch (err) { … }</code> — bắt được cả ném lỗi lẫn promise bị reject.'], ['Keep the promise returned by <code>next</code> and await it after the middleware returns, so <code>app</code> waits for the rest of the chain.', 'Giữ promise mà <code>next</code> trả về và await nó sau khi middleware trả về, để <code>app</code> chờ phần còn lại của chuỗi.']],
  loi: [['A plain loop over the middlewares: it ignores whether next() was called and runs routes after an error.', 'Một vòng lặp thường qua các middleware: bỏ qua việc next() có được gọi không và chạy route cả sau khi lỗi.'], ['Not awaiting async middleware: a rejection becomes an unhandled promise instead of a 500.', 'Không await middleware async: reject thành promise không ai bắt thay vì lỗi 500.'], ['Forgetting the final 404: an unknown route hangs until the client times out.', 'Quên 404 cuối: route không tồn tại treo tới khi client hết giờ.']],
  gt: ['This is the mechanism behind every rule of chapter 9: headers set by an early middleware are already on <code>res</code> when a later route throws, so the error response carries them; an error handler mounted last receives every failure; parsers must run before the routes that read <code>req.body</code>. Treating a throw and a rejection like <code>next(err)</code> is what Express 5 does for async handlers.', 'Đây là cơ chế đứng sau mọi luật của chương 9: header do middleware sớm đặt đã nằm trên <code>res</code> khi một route sau ném lỗi, nên phản hồi lỗi mang chúng; error handler gắn cuối nhận mọi lỗi; parser phải chạy trước route đọc <code>req.body</code>. Coi ném lỗi và reject như <code>next(err)</code> là điều Express 5 làm với handler async.'],
  kn: ['middleware', 'error handling', 'async'],
  tns: [tn('error-handling middleware', 'middleware xử lý lỗi', 'hàm 4 tham số (err, req, res, next)'), tn('chain', 'chuỗi', 'danh sách middleware chạy nối tiếp')],
  fakes: CHAIN,
  dau: `/** Walk middlewares like Express: next(), next(err), throws, async, final 404. */
function compose(middlewares, errorHandler) {
  return async function app(req, res) {
    // Write your solution here
    for (const mw of middlewares) {
      await mw(req, res, () => {});
    }
  };
}
`,
  giai: '// Reference solution\n' + nguon(compose),
  cases: [
    { goi: '[await call(compose([mark("a"), mark("b"), (req, res) => res.json({ ok: true })], onErr), { url: "/notes" }), trace]', moTa: ['Normal chain', 'Chuỗi bình thường'] },
    { goi: '[await call(compose([headers, mark("auth"), (req, res) => { throw new Error("boom"); }, mark("never")], onErr), { url: "/feed" }), trace]', moTa: ['A route throws: error handler, and the header is still there', 'Route ném lỗi: error handler, và header vẫn còn'] },
    { goi: '[await call(compose([mark("a"), mark("b")], onErr), { url: "/nope" }), trace]', moTa: ['Nobody answers: 404', 'Không ai trả lời: 404'] },
    { goi: '[await call(compose([async (req, res, next) => { await wait(50); trace.push("db"); next(); }, async (req, res) => { await wait(20); throw new Error("async boom"); }, mark("never")], onErr), { url: "/x" }), trace]', an: true },
    { goi: '[await call(compose([mark("a"), (req, res, next) => next(new Error("forbidden")), mark("never"), (req, res) => res.json({})], onErr), { url: "/x" }), trace]', an: true },
    { goi: '[await call(compose([(req, res) => { res.status(204).end(); }, mark("never")], onErr), { url: "/x" }), trace]', an: true },
    { goi: '[await call(compose([async (req, res, next) => { await wait(10); next(); }, async (req, res, next) => { await wait(10); res.json({ late: true }); }], onErr), { url: "/x" }), trace]', an: true },
  ],
});

/* ─── L3. HARD · js — vá một Notes API có đủ lỗ hổng của chương ─── */
function notesApp({ store, newId, log }) {
  /* ---- 9.1 headers + CORS ---- */
  const ORIGINS = new Set(['https://cuongthai.com', 'https://www.cuongthai.com']);
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  const json = (res, status, body) => res.status(status).json(body);

  /* ---- 9.3 validation (cap first, strip unknown keys) ---- */
  function validate(b) {
    if (typeof b !== 'object' || b === null || Array.isArray(b)) return null;
    if (typeof b.title !== 'string' || b.title.length > 200 || !b.title.trim()) return null;
    const tags = b.tags === undefined ? [] : b.tags;
    if (!Array.isArray(tags) || tags.length > 20 || !tags.every((t) => typeof t === 'string' && t.length <= 30 && /^[a-z0-9-]+$/.test(t))) return null;
    return { title: b.title.trim(), tags: tags.slice() };
  }

  /* ---- 9.3 SSRF: allow-list + manual redirects ---- */
  async function preview(raw) {
    let current = raw;
    for (let hop = 0; hop <= 3; hop++) {
      let u;
      try { u = new URL(current); } catch { return { error: 'BAD_URL' }; }
      if (u.protocol !== 'https:' || u.hostname !== 'media.cuongthai.com') return { error: 'URL_NOT_ALLOWED' };
      const r = await fetch(u.href, { redirect: 'manual' });
      if ([301, 302, 303, 307, 308].includes(r.status)) { current = new URL(r.headers.get('location') || '', u).href; continue; }
      return { status: r.status, length: (await r.text()).length };
    }
    return { error: 'TOO_MANY_REDIRECTS' };
  }

  return async function app(req, res) {
    // request id first: every response and every log line gets one
    const id = /^[A-Za-z0-9-]{1,64}$/.test(req.headers['x-request-id'] || '') ? req.headers['x-request-id'] : newId();
    res.setHeader('X-Request-ID', id);
    // security headers before anything can fail
    res.removeHeader('X-Powered-By');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('X-XSS-Protection', '0');
    // CORS: allow-list, Vary, never reflect
    res.vary('Origin');
    const origin = req.headers.origin;
    if (origin && ORIGINS.has(origin)) { res.setHeader('Access-Control-Allow-Origin', origin); res.setHeader('Access-Control-Allow-Credentials', 'true'); }
    try {
      if (req.method === 'POST' && req.path === '/notes') {
        if (!req.user) return json(res, 401, { error: 'UNAUTHENTICATED' });
        // body limit 10kb (declared AND real size), then parse
        const raw = String(req.rawBody || '');
        if (Number(req.headers['content-length'] || 0) > 10240 || raw.length > 10240) return json(res, 413, { error: 'TOO_LARGE' });
        let body;
        try { body = JSON.parse(raw || '{}'); } catch { return json(res, 400, { error: 'BAD_JSON' }); }
        const v = validate(body);
        if (!v) return json(res, 400, { error: 'VALIDATION' });
        // ownerId comes from the session, never from the body
        const note = await store.create({ ownerId: req.user.id, title: v.title, tags: v.tags });
        return json(res, 201, { id: note.id, title: note.title, tags: note.tags });
      }
      if (req.method === 'GET' && req.path === '/feed') {
        const notes = await store.list();
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        // 9.2: plain-text fields are ESCAPED on output
        return res.send('<ul>' + notes.map((n) => '<li>' + esc(n.title) + '</li>').join('') + '</ul>');
      }
      if (req.method === 'GET' && req.path === '/preview') {
        const r = await preview(String(req.query.url || ''));
        return r.error ? json(res, 400, { error: r.error }) : json(res, 200, r);
      }
      return json(res, 404, { error: 'NOT_FOUND' });
    } catch (err) {
      // 9.4: full detail to the log, opaque answer to the client
      log.push({ requestId: id, message: String(err && err.message) });
      return json(res, 500, { error: 'INTERNAL', requestId: id });
    }
  };
}

const APP = String.raw`
async function call(app, init) {
  const u = new URL(init.url || '/', 'https://api.cuongthai.com');
  const req = { method: init.method || 'GET', url: u.pathname + u.search, path: u.pathname, query: Object.fromEntries(u.searchParams), headers: init.headers || {}, rawBody: init.rawBody, user: init.user };
  const res = makeRes(); res.setHeader('X-Powered-By', 'Express'); await app(req, res);
  return { status: res.statusCode, headers: res.headers, body: res.body === undefined ? null : res.body };
}
function makeStore(seed) {
  const rows = (seed || []).map((x, i) => ({ id: i + 1, ...x })); let fail = null;
  return { rows, failWith(m) { fail = m; },
    async create(data) { if (fail) throw new Error(fail); const row = { id: rows.length + 1, ...data }; rows.push(row); return row; },
    async list() { if (fail) throw new Error(fail); return rows.map((r) => ({ ...r })); } };
}
const log = []; let n = 0; const newId = () => 'req-' + (++n);
const POST = (body, user, extra) => ({ method: 'POST', url: '/notes', headers: Object.assign({ 'content-type': 'application/json' }, extra || {}), rawBody: typeof body === 'string' ? body : JSON.stringify(body), user });
`;

const STARTER_APP = `/** The Notes API as it was before chapter 9. It works — and it has a hole from every lesson. Harden it. */
function notesApp({ store, newId, log }) {
  // Write your solution here
  return async function app(req, res) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');   // 9.1: reflects any origin
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    try {
      if (req.method === 'POST' && req.path === '/notes') {
        const body = JSON.parse(req.rawBody || '{}');                          // 9.3: no limit at all
        const note = await store.create({ ownerId: req.user && req.user.id, ...body });   // mass assignment
        return res.status(201).json(note);
      }
      if (req.method === 'GET' && req.path === '/feed') {
        const notes = await store.list();
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.send('<ul>' + notes.map((n) => '<li>' + n.title + '</li>').join('') + '</ul>');   // 9.2: raw HTML
      }
      if (req.method === 'GET' && req.path === '/preview') {
        const r = await fetch(req.query.url);                                   // 9.3: SSRF
        return res.json({ status: r.status, length: (await r.text()).length });
      }
      return res.status(404).json({ error: 'NOT_FOUND' });
    } catch (err) {
      return res.status(500).json({ error: err.message, stack: String(err.stack).split('\\n').slice(0, 2) });   // 9.4: leaks
    }
  };
}
`;

const L3 = jsBai({
  ten: 'Lab 9 · 3 — Harden the Notes API (one hole per lesson)', kho: 'HARD', phut: 50, diem: 40, dangBai: 'lab',
  en: `<p>The starter is the Notes API "before chapter 9": it works, and it has a hole from every lesson. Rewrite <code>notesApp({ store, newId, log })</code> → <code>async app(req, res)</code> so that it meets this brief:</p>
<p><b>Every response</b> (including 404, 413 and 500):</p>
<ul><li><code>X-Request-ID</code> = <code>req.headers['x-request-id']</code> if it matches <code>/^[A-Za-z0-9-]{1,64}$/</code>, otherwise <code>newId()</code>;</li>
<li>no <code>X-Powered-By</code>; the five headers of 9.1 with helmet’s values (HSTS <code>max-age=31536000; includeSubDomains</code>, <code>nosniff</code>, <code>SAMEORIGIN</code>, <code>no-referrer</code>, <code>X-XSS-Protection: 0</code>);</li>
<li>CORS: <code>Vary: Origin</code>; <code>Access-Control-Allow-Origin</code> + <code>Access-Control-Allow-Credentials: true</code> only for <code>https://cuongthai.com</code> and <code>https://www.cuongthai.com</code>.</li></ul>
<p><b>Routes</b>:</p>
<ul><li><code>POST /notes</code> — no <code>req.user</code> → 401 <code>{ error:'UNAUTHENTICATED' }</code>; declared <code>content-length</code> or real <code>rawBody</code> over 10240 → 413 <code>{ error:'TOO_LARGE' }</code>; invalid JSON → 400 <code>{ error:'BAD_JSON' }</code>; invalid note → 400 <code>{ error:'VALIDATION' }</code> (rules of 9.3: title string ≤ 200 and non-empty after trim; tags optional array ≤ 20 of <code>/^[a-z0-9-]+$/</code> ≤ 30 chars); then <code>store.create({ ownerId: req.user.id, title: trimmed, tags })</code> and 201 <code>{ id, title, tags }</code>. Nothing else from the body reaches the store.</li>
<li><code>GET /feed</code> — <code>Content-Type: text/html; charset=utf-8</code>, body <code>&lt;ul&gt;</code> + one <code>&lt;li&gt;</code> per note with the <b>escaped</b> title + <code>&lt;/ul&gt;</code> (send with <code>res.send</code>).</li>
<li><code>GET /preview?url=</code> — only <code>https://media.cuongthai.com</code> URLs, with <code>redirect:'manual'</code> and every hop re-checked (at most 3 redirects); not allowed → 400 <code>{ error:'URL_NOT_ALLOWED' }</code> (unparseable → <code>BAD_URL</code>, too many hops → <code>TOO_MANY_REDIRECTS</code>); success → 200 <code>{ status, length }</code> (length of the body text).</li>
<li>anything else → 404 <code>{ error:'NOT_FOUND' }</code>.</li></ul>
<p><b>Failures</b> (the store throws): push <code>{ requestId, message }</code> to <code>log</code> and answer 500 <code>{ error:'INTERNAL', requestId }</code>.</p>${MOI_TRUONG.en}`,
  vi: `<p>Code khởi đầu là Notes API "trước chương 9": chạy được, và có một lỗ hổng từ mỗi bài. Viết lại <code>notesApp({ store, newId, log })</code> → <code>async app(req, res)</code> cho đúng bản yêu cầu sau:</p>
<p><b>Mọi phản hồi</b> (kể cả 404, 413 và 500):</p>
<ul><li><code>X-Request-ID</code> = <code>req.headers['x-request-id']</code> nếu khớp <code>/^[A-Za-z0-9-]{1,64}$/</code>, không thì <code>newId()</code>;</li>
<li>không có <code>X-Powered-By</code>; năm header của 9.1 với giá trị của helmet (HSTS <code>max-age=31536000; includeSubDomains</code>, <code>nosniff</code>, <code>SAMEORIGIN</code>, <code>no-referrer</code>, <code>X-XSS-Protection: 0</code>);</li>
<li>CORS: <code>Vary: Origin</code>; <code>Access-Control-Allow-Origin</code> + <code>Access-Control-Allow-Credentials: true</code> chỉ cho <code>https://cuongthai.com</code> và <code>https://www.cuongthai.com</code>.</li></ul>
<p><b>Route</b>:</p>
<ul><li><code>POST /notes</code> — không có <code>req.user</code> → 401 <code>{ error:'UNAUTHENTICATED' }</code>; <code>content-length</code> khai báo hoặc <code>rawBody</code> thật quá 10240 → 413 <code>{ error:'TOO_LARGE' }</code>; JSON hỏng → 400 <code>{ error:'BAD_JSON' }</code>; ghi chú sai luật → 400 <code>{ error:'VALIDATION' }</code> (luật 9.3: title là chuỗi ≤ 200 và không rỗng sau trim; tags tuỳ chọn, mảng ≤ 20 phần tử khớp <code>/^[a-z0-9-]+$/</code> ≤ 30 ký tự); rồi <code>store.create({ ownerId: req.user.id, title: bản_đã_trim, tags })</code> và 201 <code>{ id, title, tags }</code>. Không gì khác từ body tới được store.</li>
<li><code>GET /feed</code> — <code>Content-Type: text/html; charset=utf-8</code>, thân <code>&lt;ul&gt;</code> + mỗi ghi chú một <code>&lt;li&gt;</code> chứa title <b>đã escape</b> + <code>&lt;/ul&gt;</code> (gửi bằng <code>res.send</code>).</li>
<li><code>GET /preview?url=</code> — chỉ URL <code>https://media.cuongthai.com</code>, với <code>redirect:'manual'</code> và kiểm lại mỗi bước (tối đa 3 lần chuyển hướng); không được phép → 400 <code>{ error:'URL_NOT_ALLOWED' }</code> (không phân tích được → <code>BAD_URL</code>, quá số bước → <code>TOO_MANY_REDIRECTS</code>); thành công → 200 <code>{ status, length }</code> (độ dài chữ của thân).</li>
<li>còn lại → 404 <code>{ error:'NOT_FOUND' }</code>.</li></ul>
<p><b>Sự cố</b> (store ném lỗi): đẩy <code>{ requestId, message }</code> vào <code>log</code> và trả 500 <code>{ error:'INTERNAL', requestId }</code>.</p>${MOI_TRUONG.vi}`,
  yc: [['Keep the signature notesApp({ store, newId, log }) → async (req, res).', 'Giữ chữ ký notesApp({ store, newId, log }) → async (req, res).'], ['You may reuse your code from 9.1–9.4 (escapeHtml, validateNote, safeFetch…).', 'Được dùng lại code của bạn ở 9.1–9.4 (escapeHtml, validateNote, safeFetch…).']],
  goiY: [['Set the request id, the security headers and CORS at the very top of <code>app</code>, before any route can fail — that is what puts them on the 500 too.', 'Đặt request id, header bảo mật và CORS ngay đầu <code>app</code>, trước khi route nào có thể hỏng — đó là điều đưa chúng lên cả lỗi 500.'], ['Wrap the routes in one try/catch whose catch is the opaque 9.4 handler.', 'Bọc các route trong một try/catch, phần catch là handler mờ của 9.4.'], ['For POST /notes, build the object passed to store.create from validated variables only: <code>{ ownerId: req.user.id, title, tags }</code>.', 'Với POST /notes, dựng object truyền vào store.create chỉ từ biến đã kiểm: <code>{ ownerId: req.user.id, title, tags }</code>.']],
  loi: [['Spreading the body into store.create — <code>ownerId</code> and <code>isAdmin</code> from the client win.', 'Trải body vào store.create — <code>ownerId</code> và <code>isAdmin</code> của client thắng.'], ['Setting headers only on successful responses (inside each route).', 'Chỉ đặt header cho phản hồi thành công (trong từng route).'], ['Escaping on write (in POST) instead of on output: the stored row is mangled and other readers of the API get HTML entities.', 'Escape lúc ghi (trong POST) thay vì lúc xuất: dòng lưu bị biến dạng và các bên đọc API khác nhận thực thể HTML.']],
  gt: ['Each fix sits at the layer the chapter assigned it to: headers and CORS on every response (9.1), escaping at the render boundary (9.2), size caps, schema validation and a URL allow-list with manual redirects at the input boundary (9.3), and an opaque error with a request id at the exit (9.4). Putting the cross-cutting parts before the try block is the "order matters" lesson of 9.1 in code: an error can no longer leave without the headers.', 'Mỗi bản vá nằm đúng tầng chương đã giao: header và CORS trên mọi phản hồi (9.1), escape ở ranh giới render (9.2), giới hạn cỡ, kiểm schema và danh sách trắng URL với chuyển hướng thủ công ở ranh giới đầu vào (9.3), và lỗi mờ kèm request id ở lối ra (9.4). Đặt các phần dùng chung trước khối try là bài "thứ tự quan trọng" của 9.1 viết thành mã: lỗi không còn đi ra mà thiếu header.'],
  kn: ['security headers', 'XSS', 'SSRF', 'validation', 'error handling'],
  tns: [tn('hardening', 'gia cố', 'đóng các lỗ hổng đã biết'), tn('mass assignment', 'gán hàng loạt', 'trải body của client vào bản ghi')],
  fakes: APP,
  dau: STARTER_APP,
  giai: '// Reference solution\n' + nguon(notesApp),
  cases: [
    { goi: 'await call(notesApp({ store: makeStore(), newId, log }), POST({ title: "  Buy milk ", tags: ["home"] }, { id: 7 }))', moTa: ['POST /notes: 201, headers on', 'POST /notes: 201, có header'] },
    { goi: 'await (async () => { const store = makeStore(); const r = await call(notesApp({ store, newId, log }), POST({ title: "Hi", ownerId: 1, isAdmin: true }, { id: 7 })); return [r.status, store.rows]; })()', moTa: ['Mass assignment: ownerId from the session only', 'Gán hàng loạt: ownerId chỉ từ phiên'] },
    { goi: 'await call(notesApp({ store: makeStore([{ ownerId: 2, title: "<img src=x onerror=alert(1)>" }]), newId, log }), { url: "/feed", headers: { origin: "https://evil.example" } })', moTa: ['GET /feed escapes; evil origin gets no ACAO', 'GET /feed escape; origin lạ không có ACAO'] },
    { goi: '[await call(notesApp({ store: makeStore(), newId, log }), { url: "/preview?url=http%3A%2F%2F127.0.0.1%3A4404%2Fadmin%2Fconfig" }), __fetchDaGoi.length]', moTa: ['SSRF to the internal service is refused', 'SSRF tới dịch vụ nội bộ bị chặn'] },
    { goi: 'await (async () => { const store = makeStore(); store.failWith("connect ECONNREFUSED 10.0.0.5:5432"); const r = await call(notesApp({ store, newId, log }), { url: "/feed", headers: { "x-request-id": "abc-123" } }); return [r, log]; })()', moTa: ['The store fails: opaque 500 with the request id and the headers', 'Store hỏng: 500 mờ có request id và header'] },
    { goi: '[await call(notesApp({ store: makeStore(), newId, log }), POST({ title: "x" })), await call(notesApp({ store: makeStore(), newId, log }), POST({ title: "a".repeat(201) }, { id: 1 })), await call(notesApp({ store: makeStore(), newId, log }), POST("{bad", { id: 1 })), await call(notesApp({ store: makeStore(), newId, log }), POST({ title: "x", tags: ["Bad Tag"] }, { id: 1 }))]', an: true },
    { goi: '[await call(notesApp({ store: makeStore(), newId, log }), POST({ title: "x", pad: "a".repeat(11000) }, { id: 1 })), await call(notesApp({ store: makeStore(), newId, log }), POST({ title: "x" }, { id: 1 }, { "content-length": "999999" }))]', an: true },
    { goi: '[await call(notesApp({ store: makeStore(), newId, log }), { url: "/preview?url=https%3A%2F%2Fmedia.cuongthai.com%2Fcat.png" }), __fetchDaGoi.map((c) => c.url)]', fetchGia: { 'https://media.cuongthai.com/cat.png': { status: 302, headers: { location: 'http://127.0.0.1:4404/admin/config' } } }, an: true },
    { goi: '[await call(notesApp({ store: makeStore(), newId, log }), { url: "/preview?url=https%3A%2F%2Fmedia.cuongthai.com%2Fa.png" }), await call(notesApp({ store: makeStore(), newId, log }), { url: "/preview?url=%20nope" }), await call(notesApp({ store: makeStore(), newId, log }), { method: "DELETE", url: "/notes/1", headers: { origin: "https://www.cuongthai.com", "x-request-id": "bad id!" } })]', fetchGia: { 'https://media.cuongthai.com/a.png': { status: 301, headers: { location: '/b.png' } }, 'https://media.cuongthai.com/b.png': { text: 'PNGDATA' } }, an: true },
  ],
});

export default modul('nodejs-9-lab-harden-notes-api', 'Lab 9 — Harden the Notes API', [L1, L2, L3]);
