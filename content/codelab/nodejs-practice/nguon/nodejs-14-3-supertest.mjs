/** Node.js · 14.3 — Kiểm tầng HTTP: app factory, request(app) kiểu supertest, hợp đồng mã trạng thái, test hồi quy IDOR khẳng định cả tác dụng. */
import { modul, cs, q, tn, ord, jsBai, mutBai, c, TN, YC_MUT, FAKE_HTTP } from './_node-c12-14.mjs';

const E1 = cs({
  ten: '14.3 · What the HTTP layer can and cannot prove', kho: 'EASY', phut: 8,
  en: 'Status codes are a contract (chapter 6). A contract nobody re-checks is a comment. These questions are about making it executable.',
  vi: 'Mã trạng thái là một hợp đồng (chương 6). Hợp đồng không ai kiểm lại chỉ là một dòng chú thích. Các câu này nói về việc biến nó thành thứ chạy được.',
  cau: [
    q('c1', ['Why split src/app.mjs (createApp) from src/server.mjs (listen)?', 'Vì sao tách src/app.mjs (createApp) khỏi src/server.mjs (listen)?'],
      ['A file that calls listen() at import time cannot be imported by a test; the factory also takes its dependencies as arguments', 'Express refuses to start two servers in one process', 'supertest only accepts apps exported as default', 'listen() is slower when called from a module that also defines routes'],
      ['One test file can run the whole app against a fake service, another against a real database — without a single environment variable.', 'Một tệp test chạy cả app với service giả, tệp khác với CSDL thật — không cần biến môi trường nào.']),
    q('c2', ['Every HTTP test uses createApp({ service: fakeService }) because it is fast. What does the 409 test then prove?', 'Mọi test HTTP dùng createApp({ service: fakeService }) vì nhanh. Khi đó test 409 chứng minh được gì?'],
      ['Only that Express forwards a 409 — nothing about your rules', 'That duplicate slugs are rejected by the database constraint', 'That the whole stack works, because the router is real', 'Nothing, because a fake service cannot throw'],
      ['The rules you care about (duplicates, ownership, validation) live below the route. Wire the real service and a real DB for rule tests; a fake only for cases you cannot produce, like “the DB is down ⇒ 503”.', 'Các luật bạn quan tâm (trùng, chủ sở hữu, kiểm hợp lệ) nằm dưới route. Nối service thật và CSDL thật cho test luật; chỉ dùng đồ giả cho ca không tạo được, như "CSDL sập ⇒ 503".']),
    q('c3', ['The IDOR regression test asserts 404 AND reads the row back to check the title did not change. Why the second assertion?', 'Test hồi quy IDOR khẳng định 404 VÀ đọc lại dòng để kiểm tiêu đề không đổi. Vì sao cần khẳng định thứ hai?'],
      ['A future refactor could answer 404 and still perform the update — assert the effect, not only the answer', 'Because supertest may return a cached 404', 'Because a 404 alone does not prove the route exists', 'To measure that the database is faster than the HTTP layer'],
      ['The real IDOR found while writing chapter 11 (commit a8e998e): authentication once at the handshake, no authorization per event. Authentication once, authorization every time.', 'IDOR thật tìm thấy khi viết chương 11 (commit a8e998e): xác thực một lần lúc bắt tay, không phân quyền ở từng sự kiện. Xác thực một lần, phân quyền mọi lần.']),
    q('c4', ['Why not expect(res.body).toEqual({ id, title, slug, body, authorId, createdAt, … })?', 'Vì sao không viết expect(res.body).toEqual({ id, title, slug, body, authorId, createdAt, … })?'],
      ['It breaks on the next migration, not on a broken rule', 'toEqual cannot compare objects coming from JSON', 'It makes the test 10× slower', 'Because ids are random in a test database'],
      ['toMatchObject({ slug: \'ghi-chu-dau-tien\' }) states the rule; a whole-body snapshot states everything, including what nobody promised.', 'toMatchObject({ slug: \'ghi-chu-dau-tien\' }) nói lên luật; so cả body thì nói mọi thứ, kể cả thứ không ai hứa.']),
    q('c5', ['const res = request(app).post(\'/notes\').send(x); expect(res.status).toBe(201) — what is wrong?', 'const res = request(app).post(\'/notes\').send(x); expect(res.status).toBe(201) — sai ở đâu?'],
      ['res is the unawaited request, not the response', 'post() must come after send()', 'request() needs a URL, not an app', 'Nothing — supertest is synchronous'],
      ['Await every supertest call — an un-awaited one produces exactly the silent green test of 14.2.', 'Await mọi lời gọi supertest — cái thiếu await sinh ra đúng loại test xanh câm của 14.2.']),
  ],
  goiY: [['Where do the rules live — in the router, or below it?', 'Luật nằm ở đâu — trong router, hay bên dưới?'], ['Answer vs effect.', 'Câu trả lời so với tác dụng.']],
  loi: [['Mocking the service in every route test and believing the rules are covered.', 'Giả service trong mọi test route rồi tin rằng các luật đã được phủ.'], ['Checking only the status of a refused write.', 'Chỉ kiểm mã trạng thái của một lần ghi bị từ chối.']],
  tns: [tn('app factory', 'hàm dựng app', 'createApp({ service, auth }) trả app mà không listen'), tn('IDOR', 'tham chiếu đối tượng trực tiếp không an toàn', 'đoán id của người khác và đọc/sửa được tài nguyên của họ'), tn('regression test', 'test hồi quy', 'ghim một lỗi đã sửa để nó không quay lại')],
  kn: ['HTTP tests'],
});

const E2 = cs({
  ten: '14.3 · Assemble the app in the right order', kho: 'EASY', phut: 6, loai: 'order',
  en: 'Put the pieces of createApp({ service, auth }) in the order they must be registered. An HTTP test exists precisely to catch these assembly mistakes, which no unit test can see.',
  vi: 'Sắp các mảnh của createApp({ service, auth }) theo thứ tự phải đăng ký. Test HTTP tồn tại chính là để bắt các lỗi lắp ráp này, thứ không unit test nào thấy được.',
  cau: [ord('o1', ['Registration order inside createApp', 'Thứ tự đăng ký bên trong createApp'], [
    'const app = express()',
    'app.use(express.json()) — without it req.body is undefined and every create looks like a validation error',
    'app.use((req, res, next) => { req.user = auth(req); next(); })',
    'app.post(\'/notes\', …) and app.patch(\'/notes/:id\', …)',
    'app.use((err, req, res, _next) => res.status(err.status ?? 500).json({ error: err.message })) — four arguments, LAST',
    'return app — and only server.mjs calls listen()',
  ], ['Body parsing before anything reads the body, identity before the routes that need it, routes, then the error handler last (Express recognises it by its four parameters and only reaches it after the routes). None of the twelve unit tests of 14.2 would notice a missing express.json(), an error handler registered first, or a route mounted at /note.', 'Phân tích body trước mọi thứ đọc body, danh tính trước các route cần nó, các route, rồi bộ xử lý lỗi cuối cùng (Express nhận ra nó nhờ bốn tham số và chỉ tới nó sau các route). Không unit test nào trong mười hai cái của 14.2 nhận ra được express.json() bị thiếu, bộ xử lý lỗi đăng ký trước, hay route gắn ở /note.'])],
  goiY: [['What does each step need from the steps before it?', 'Mỗi bước cần gì từ các bước trước nó?'], ['Errors flow forward: their handler must come after whatever throws.', 'Lỗi chảy về phía trước: bộ xử lý của chúng phải đứng sau thứ ném ra lỗi.']],
  loi: [['The error handler first: errors from the routes never reach it and Express answers its default HTML 500.', 'Bộ xử lý lỗi đứng đầu: lỗi của route không bao giờ tới nó và Express trả trang HTML 500 mặc định.'], ['listen() inside createApp: importing the app in a test starts a server on a real port.', 'listen() bên trong createApp: import app trong test là khởi một server trên cổng thật.']],
  tns: [tn('error-handling middleware', 'middleware xử lý lỗi', '(err, req, res, next) — bốn tham số, đăng ký sau cùng')],
  kn: ['Express'],
});

const MINI_HTTP = `/**
 * mini-http.js — a tiny Express look-alike plus a supertest look-alike, so the HTTP layer can be tested
 * inside the browser grader (no sockets). Same shapes as the real thing:
 *   const app = express(); app.use(json()); app.post('/notes', mw, handler); app.use((err, req, res, next) => …)
 *   const res = await request(app).post('/notes').set('x-user-id', '7').send({ title: 'Hi' });  // res.status, res.body
 */
export function json() {
  return (req, res, next) => {
    if (req.rawBody != null && /application\\/json/.test(req.headers['content-type'] || '')) {
      try { req.body = JSON.parse(req.rawBody); } catch (e) { return next(Object.assign(new Error('BAD_JSON'), { status: 400 })); }
    }
    next();
  };
}

function match(pattern, path) {
  const a = pattern.split('/'), b = path.split('/');
  if (a.length !== b.length) return null;
  const params = {};
  for (let i = 0; i < a.length; i++) {
    if (a[i].startsWith(':')) params[a[i].slice(1)] = decodeURIComponent(b[i]);
    else if (a[i] !== b[i]) return null;
  }
  return params;
}

function makeRes(done) {
  const res = { statusCode: 200, headers: {}, body: undefined };
  res.status = (s) => { res.statusCode = s; return res; };
  res.set = (k, v) => { res.headers[String(k).toLowerCase()] = String(v); return res; };
  res.json = (b) => { res.body = JSON.parse(JSON.stringify(b)); res.headers['content-type'] = 'application/json'; done(); return res; };
  res.send = (b) => { res.body = b; done(); return res; };
  return res;
}

export function express() {
  const stack = [];
  const route = (method) => (path, ...fns) => { for (const fn of fns) stack.push({ method, path, fn }); return app; };
  const app = {
    use(fn) { stack.push({ fn }); return app; },
    get: route('GET'), post: route('POST'), patch: route('PATCH'), delete: route('DELETE'),
    handle(req) {
      return new Promise((resolve) => {
        const res = makeRes(() => resolve(res));
        let i = 0;
        const next = (err) => {
          while (i < stack.length) {
            const layer = stack[i++];
            if (layer.method) {
              if (layer.method !== req.method) continue;
              const params = match(layer.path, req.path);
              if (!params) continue;
              req.params = params;
            }
            const isErrorHandler = layer.fn.length === 4;
            if (err ? !isErrorHandler : isErrorHandler) continue;
            try {
              const r = err ? layer.fn(err, req, res, next) : layer.fn(req, res, next);
              if (r && typeof r.then === 'function') r.then(undefined, next);   // async handlers: a rejection is next(err)
            } catch (e) { next(e); }
            return;
          }
          if (err) res.status(500).send('Internal Server Error');
          else res.status(404).send('Cannot ' + req.method + ' ' + req.path);
        };
        next();
      });
    },
  };
  return app;
}

export function request(app) {
  const make = (method) => (path) => {
    const req = { method, path, headers: {}, rawBody: null, body: undefined, params: {} };
    const chain = {
      set(k, v) { req.headers[String(k).toLowerCase()] = String(v); return chain; },
      send(body) { req.rawBody = JSON.stringify(body); req.headers['content-type'] = 'application/json'; return chain; },
      then(ok, no) { return app.handle(req).then((res) => ({ status: res.statusCode, body: res.body, headers: res.headers })).then(ok, no); },
    };
    return chain;
  };
  return { get: make('GET'), post: make('POST'), patch: make('PATCH'), delete: make('DELETE') };
}
`;

const APP = `import { express, json } from './mini-http.js';

/** Tests and the dev server identify the user with a header; production uses the JWT middleware of chapter 8. */
export const headerAuth = (req) => (req.headers['x-user-id'] ? { id: Number(req.headers['x-user-id']) } : null);

/** Assembles the app — never listens. server.js is the only file that calls listen(). */
export function createApp({ service, auth }) {
  const app = express();
  app.use(json());
  app.use((req, res, next) => { req.user = auth(req); next(); });

  const requireUser = (req, res, next) => (req.user ? next() : res.status(401).json({ error: 'UNAUTHENTICATED' }));
  const validate = (req, res, next) => {
    const t = req.body && req.body.title;
    if (typeof t !== 'string' || t.trim() === '' || t.length > 200) {
      return res.status(422).json({ error: 'VALIDATION', fields: [{ path: 'title', message: 'title must be 1–200 characters' }] });
    }
    next();
  };

  app.post('/notes', requireUser, validate, async (req, res) => { res.status(201).json(await service.create(req.user, req.body)); });
  app.get('/notes/:id', requireUser, async (req, res) => { res.json(await service.get(req.user, Number(req.params.id))); });
  app.patch('/notes/:id', requireUser, validate, async (req, res) => { res.json(await service.update(req.user, Number(req.params.id), req.body)); });

  app.use((err, req, res, _next) => res.status(err.status ?? 500).json({ error: err.message }));
  return app;
}
`;

const SERVICE3 = `import { slugify } from './slug.js';

const fail = (message, status) => Object.assign(new Error(message), { status });

export function createNotesService(repo) {
  const own = async (actor, id) => {
    const note = await repo.findById(id);
    if (!note || note.authorId !== actor.id) throw fail('NOT_FOUND', 404);   // 404, never 403
    return note;
  };
  return {
    async create(actor, input) {
      const slug = slugify(input.title);
      if (!slug) throw fail('EMPTY_SLUG', 400);
      return repo.insert({ title: input.title, slug, body: input.body ?? '', authorId: actor.id });
    },
    get: (actor, id) => own(actor, id),
    async update(actor, id, patch) {
      const note = await own(actor, id);
      return repo.update(id, { title: patch.title ?? note.title, body: patch.body ?? note.body });
    },
  };
}
`;

const REPO3 = `/** An in-memory repository WITH the unique constraint of the real table (notes_slug_key ⇒ 409). */
export function createMemoryRepo() {
  const rows = new Map();
  let last = 0;
  const copy = (n) => (n ? { ...n } : null);
  return {
    async findById(id) { return copy(rows.get(id)); },
    async insert(n) {
      if ([...rows.values()].some((r) => r.slug === n.slug)) throw Object.assign(new Error('SLUG_TAKEN'), { status: 409 });
      const row = { id: ++last, ...n };
      rows.set(row.id, row);
      return copy(row);
    },
    async update(id, patch) { const r = rows.get(id); if (!r) return null; Object.assign(r, patch); return copy(r); },
  };
}
`;
const SLUG3 = `export function slugify(title) {
  return String(title).toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
}
`;

const E3 = mutBai({
  ten: '14.3 · Make the HTTP contract executable', kho: 'HARD', phut: 30,
  en: `<p>The Notes API’s HTTP layer is ${c('createApp({ service, auth })')} in ${c('src/app.js')}, wired here to the REAL service and an in-memory repository that has the real table’s unique constraint. ${c('src/mini-http.js')} gives you ${c('request(app)')} with the supertest API (${c('await request(app).post(\'/notes\').set(\'x-user-id\', \'7\').send({ title })')} → ${c('{ status, body }')}). The contract:</p><ul><li>no ${c('x-user-id')} ⇒ ${c('401')};</li><li>an empty or over-long title ⇒ ${c('422')} with ${c("body.fields[0].path === 'title'")};</li><li>${c('POST /notes')} ⇒ ${c('201')} with the slug; a duplicate title ⇒ ${c('409')};</li><li>${c('GET')} / ${c('PATCH /notes/:id')} of somebody else’s note ⇒ ${c('404')} — and the note is NOT changed (read it back as its owner).</li></ul><p>Write ${c('src/app.test.js')} that kills all 7 mutants.</p>`,
  vi: `<p>Tầng HTTP của Notes API là ${c('createApp({ service, auth })')} trong ${c('src/app.js')}, ở đây nối với service THẬT và một repository trong bộ nhớ có ràng buộc duy nhất như bảng thật. ${c('src/mini-http.js')} cho bạn ${c('request(app)')} với API của supertest (${c('await request(app).post(\'/notes\').set(\'x-user-id\', \'7\').send({ title })')} → ${c('{ status, body }')}). Hợp đồng:</p><ul><li>không có ${c('x-user-id')} ⇒ ${c('401')};</li><li>tiêu đề rỗng hoặc quá dài ⇒ ${c('422')} với ${c("body.fields[0].path === 'title'")};</li><li>${c('POST /notes')} ⇒ ${c('201')} kèm slug; tiêu đề trùng ⇒ ${c('409')};</li><li>${c('GET')} / ${c('PATCH /notes/:id')} ghi chú của người khác ⇒ ${c('404')} — và ghi chú KHÔNG bị đổi (đọc lại dưới tên chủ của nó).</li></ul><p>Viết ${c('src/app.test.js')} diệt cả 7 đột biến.</p>`,
  yc: [...YC_MUT(5, 7), ['Build a fresh app in beforeEach so tests do not see each other’s notes.', 'Dựng app mới trong beforeEach để các test không thấy ghi chú của nhau.']],
  dauVao: ['src/app.test.js — import { request } from \'./mini-http.js\' and createApp, headerAuth from \'./app.js\'.', 'src/app.test.js — import { request } từ \'./mini-http.js\' và createApp, headerAuth từ \'./app.js\'.'],
  dauRa: ['Green on the correct app; red on each mutant.', 'Xanh với app đúng; đỏ với từng đột biến.'],
  viDu: [{ input: 'Mutant: the service updates the note, THEN answers 404|||Đột biến: service cập nhật ghi chú, RỒI mới trả 404', output: "Killed by: after the 404 for user 8, GET /notes/:id as user 7 → expect(res.body.title).toBe('Cua an')|||Bị diệt bởi: sau 404 cho user 8, GET /notes/:id dưới user 7 → expect(res.body.title).toBe('Cua an')", explanation: 'A status-only test passes on this mutant: the answer is right and the data is wrong.|||Test chỉ kiểm mã trạng thái qua được đột biến này: câu trả lời đúng mà dữ liệu sai.' }],
  goiY: [['Setup: let app; beforeEach(() => { app = createApp({ service: createNotesService(createMemoryRepo()), auth: headerAuth }); });', 'Chuẩn bị: let app; beforeEach(() => { app = createApp({ service: createNotesService(createMemoryRepo()), auth: headerAuth }); });'], ['For the 422 contract assert the SHAPE too: expect(res.body.fields[0].path).toBe(\'title\').', 'Với hợp đồng 422 hãy khẳng định cả HÌNH DẠNG: expect(res.body.fields[0].path).toBe(\'title\').'], ['The IDOR test: user 7 creates; user 8 PATCHes → 404; user 7 GETs → the title is still the original.', 'Test IDOR: user 7 tạo; user 8 PATCH → 404; user 7 GET → tiêu đề vẫn là bản gốc.']],
  loi: [['const res = request(app).post(…) without await: res.status is undefined and the expect compares nothing useful.', 'const res = request(app).post(…) thiếu await: res.status là undefined và expect chẳng so được gì hữu ích.'], ['expect(res.status).not.toBe(201) for the anonymous case: a 403, a 404 and a 500 all pass. Assert the exact contract: 401.', 'expect(res.status).not.toBe(201) cho ca vô danh: 403, 404 hay 500 đều qua. Khẳng định đúng hợp đồng: 401.'], ['One shared app for all tests: the duplicate-title test passes or fails depending on test order.', 'Một app dùng chung cho mọi test: test tiêu đề trùng xanh hay đỏ tuỳ thứ tự chạy.']],
  gt: ['Each mutant is a real assembly or contract bug: 403 for anonymous, a 422 without the field name, a route mounted at /note, an error handler that flattens everything to 500, a missing body parser, and the IDOR that answers 404 but writes anyway. Only tests through the HTTP layer see them, and only exact assertions (the status, the field path, the row read back) kill them. This is the level that would have caught commit a8e998e: authentication once, authorization every time.', 'Mỗi đột biến là một lỗi lắp ráp hoặc hợp đồng có thật: 403 cho người vô danh, 422 không có tên trường, route gắn ở /note, bộ xử lý lỗi dẹp mọi thứ thành 500, thiếu bộ phân tích body, và IDOR trả 404 mà vẫn ghi. Chỉ test qua tầng HTTP mới thấy chúng, và chỉ khẳng định chính xác (mã, đường dẫn trường, dòng đọc lại) mới diệt được. Đây là tầng lẽ ra đã bắt được commit a8e998e: xác thực một lần, phân quyền mọi lần.'],
  kn: ['HTTP tests', 'contract', 'IDOR'], tns: [TN.mutant, tn('contract assertion', 'khẳng định hợp đồng', 'mã + các trường mà endpoint hứa'), tn('IDOR', 'IDOR', 'đọc/sửa tài nguyên của người khác bằng cách đoán id')],
  impl: { 'src/app.js': APP, 'src/mini-http.js': MINI_HTTP, 'src/notes.service.js': SERVICE3, 'src/notes.repo.js': REPO3, 'src/slug.js': SLUG3 },
  tepTest: 'src/app.test.js',
  toiThieuTest: 5,
  dau: `import { describe, it, expect, beforeEach } from 'vitest';
import { request } from './mini-http.js';
import { createApp, headerAuth } from './app.js';
import { createNotesService } from './notes.service.js';
import { createMemoryRepo } from './notes.repo.js';

let app;
beforeEach(() => { app = createApp({ service: createNotesService(createMemoryRepo()), auth: headerAuth }); });

// Five tests, all green — and most mutants survive them.
describe('POST /notes', () => {
  it('creates a note', async () => {
    const res = await request(app).post('/notes').set('x-user-id', '7').send({ title: 'Ghi chu dau tien' });
    expect(res.status).toBe(201);
  });

  it('refuses an anonymous request', async () => {
    const res = await request(app).post('/notes').send({ title: 'Hi' });
    expect(res.status).not.toBe(201);
  });

  it('refuses an empty title', async () => {
    const res = await request(app).post('/notes').set('x-user-id', '7').send({ title: '' });
    expect(res.status).not.toBe(201);
  });

  it('refuses a duplicate', async () => {
    await request(app).post('/notes').set('x-user-id', '7').send({ title: 'Trung slug' });
    const res = await request(app).post('/notes').set('x-user-id', '7').send({ title: 'Trung slug' });
    expect(res.status).not.toBe(201);
  });
});

describe('PATCH /notes/:id', () => {
  it('refuses somebody else', async () => {
    const created = await request(app).post('/notes').set('x-user-id', '7').send({ title: 'Cua an' });
    const res = await request(app).patch('/notes/' + created.body.id).set('x-user-id', '8').send({ title: 'hack' });
    expect(res.status).not.toBe(200);
  });
});
`,
  giai: `import { describe, it, expect, beforeEach } from 'vitest';
import { request } from './mini-http.js';
import { createApp, headerAuth } from './app.js';
import { createNotesService } from './notes.service.js';
import { createMemoryRepo } from './notes.repo.js';

let app;
// a fresh app (and a fresh table) for every test — no test sees another one's notes
beforeEach(() => { app = createApp({ service: createNotesService(createMemoryRepo()), auth: headerAuth }); });
const as = (id) => ({ post: (p, b) => request(app).post(p).set('x-user-id', String(id)).send(b), patch: (p, b) => request(app).patch(p).set('x-user-id', String(id)).send(b), get: (p) => request(app).get(p).set('x-user-id', String(id)) });

describe('POST /notes', () => {
  // kills "mounted at /note" and "body parser missing" — and asserts the field the contract promises
  it('201 with the slug derived from the title', async () => {
    const res = await as(7).post('/notes', { title: 'Ghi chu dau tien' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ slug: 'ghi-chu-dau-tien', authorId: 7 });
  });

  // the exact status — kills "403 for anonymous"
  it('401 without a user', async () => {
    const res = await request(app).post('/notes').send({ title: 'Hi' });
    expect(res.status).toBe(401);
  });

  // the shape of the error is contract too — kills "fields: []" and "empty title accepted"
  it('422 with the failing field named', async () => {
    const res = await as(7).post('/notes', { title: '' });
    expect(res.status).toBe(422);
    expect(res.body.fields[0].path).toBe('title');
  });

  it('422 for a title longer than 200 characters', async () => {
    const res = await as(7).post('/notes', { title: 'x'.repeat(201) });
    expect(res.status).toBe(422);
  });

  // kills "every error becomes 500"
  it('409 on a duplicate slug', async () => {
    expect((await as(7).post('/notes', { title: 'Trung slug' })).status).toBe(201);
    expect((await as(7).post('/notes', { title: 'Trung slug' })).status).toBe(409);
  });
});

describe('another user’s note', () => {
  it('GET answers 404, not 403', async () => {
    const created = await as(7).post('/notes', { title: 'Rieng tu' });
    expect((await as(8).get('/notes/' + created.body.id)).status).toBe(404);
  });

  // the test that pays for the whole file: the ANSWER and the EFFECT
  it('PATCH answers 404 and the note is not changed', async () => {
    const created = await as(7).post('/notes', { title: 'Cua an' });
    const res = await as(8).patch('/notes/' + created.body.id, { title: 'hack' });
    expect(res.status).toBe(404);
    const back = await as(7).get('/notes/' + created.body.id);
    expect(back.body.title).toBe('Cua an');
  });
});
`,
  dotBien: [
    { file: 'src/app.js', from: "res.status(401).json({ error: 'UNAUTHENTICATED' })", to: "res.status(403).json({ error: 'UNAUTHENTICATED' })", label: 'anonymous gets 403', goiY: 'no x-user-id must be exactly 401 · thiếu x-user-id phải đúng 401' },
    { file: 'src/app.js', from: "fields: [{ path: 'title', message: 'title must be 1–200 characters' }]", to: 'fields: []', label: '422 without the field name', goiY: "assert the shape: res.body.fields[0].path === 'title' · khẳng định hình dạng lỗi" },
    { file: 'src/app.js', from: "app.post('/notes', requireUser", to: "app.post('/note', requireUser", label: 'route mounted at /note', goiY: 'a valid POST /notes must be 201 · POST /notes hợp lệ phải 201' },
    { file: 'src/app.js', from: 'res.status(err.status ?? 500)', to: 'res.status(500)', label: 'every error becomes 500', goiY: 'a duplicate title must be 409 · tiêu đề trùng phải là 409' },
    { file: 'src/app.js', from: '  app.use(json());\n', to: '', label: 'body parser missing', goiY: 'a valid create must be 201 — without the parser req.body is undefined · tạo hợp lệ phải 201' },
    { file: 'src/notes.service.js', from: 'const note = await own(actor, id);', to: 'const raw = await repo.findById(id); if (raw) await repo.update(id, { title: patch.title ?? raw.title }); const note = await own(actor, id);', label: 'PATCH writes first, answers 404 after', goiY: 'after the 404, read the note back as its owner: the title must be unchanged · sau 404, đọc lại dưới tên chủ: tiêu đề không đổi' },
    { file: 'src/app.js', from: "t.trim() === '' || ", to: '', label: 'empty title reaches the service (400 instead of 422)', goiY: 'an empty title must be 422 at the edge, not 400 from the service · tiêu đề rỗng phải 422 ngay ở cửa', an: true },
  ],
});

const E4 = jsBai({
  ten: '14.3 · One error handler, one contract', kho: 'MEDIUM', phut: 15,
  en: `<p>The 409 test of 14.4 answered 500 four times out of five because a PostgreSQL error carried a code but no status. Write the error side of the contract in one place:</p><ul><li>${c('toHttpError(err)')} → ${c('{ status, body }')}:<ul><li>an error with a numeric ${c('status')} (4xx/5xx) ⇒ that status, ${c('{ error: err.message }')};</li><li>a validation error (${c("err.name === 'ZodError'")}, with ${c('err.issues = [{ path: [\'title\'], message }]')}) ⇒ ${c('422')}, ${c("{ error: 'VALIDATION', fields: [{ path: 'title', message }] }")} (path joined with ${c("'.'")});</li><li>a PostgreSQL unique violation (${c("err.code === '23505'")}) ⇒ ${c("409 { error: 'CONFLICT' }")};</li><li>anything else ⇒ ${c("500 { error: 'INTERNAL' }")} — never leak the message of an unexpected error.</li></ul></li><li>${c('errorHandler(err, req, res, next)')} — Express error middleware (four parameters): ${c('res.status(status).json(body)')}, and ${c("console.error('unhandled', err.message)")} for a 500 only.</li></ul>`,
  vi: `<p>Test 409 của 14.4 trả 500 bốn lần trên năm vì lỗi PostgreSQL mang mã nhưng không có status. Viết phía lỗi của hợp đồng ở một chỗ:</p><ul><li>${c('toHttpError(err)')} → ${c('{ status, body }')}:<ul><li>lỗi có ${c('status')} dạng số (4xx/5xx) ⇒ đúng status đó, ${c('{ error: err.message }')};</li><li>lỗi kiểm hợp lệ (${c("err.name === 'ZodError'")}, với ${c('err.issues = [{ path: [\'title\'], message }]')}) ⇒ ${c('422')}, ${c("{ error: 'VALIDATION', fields: [{ path: 'title', message }] }")} (path nối bằng ${c("'.'")});</li><li>vi phạm khoá duy nhất của PostgreSQL (${c("err.code === '23505'")}) ⇒ ${c("409 { error: 'CONFLICT' }")};</li><li>mọi thứ khác ⇒ ${c("500 { error: 'INTERNAL' }")} — không bao giờ để lộ thông điệp của lỗi ngoài dự kiến.</li></ul></li><li>${c('errorHandler(err, req, res, next)')} — middleware lỗi của Express (bốn tham số): ${c('res.status(status).json(body)')}, và ${c("console.error('unhandled', err.message)")} chỉ với 500.</li></ul>`,
  yc: [['errorHandler has exactly four parameters (Express recognises error middleware by its arity).', 'errorHandler có đúng bốn tham số (Express nhận ra middleware lỗi nhờ số tham số).'], ['Only 500s are logged; their message never reaches the client.', 'Chỉ lỗi 500 được ghi log; thông điệp của chúng không bao giờ tới client.'], ['A status outside 400–599 is not trusted (treated as unexpected).', 'Status ngoài 400–599 không được tin (coi như ngoài dự kiến).']],
  dauVao: ['err — any thrown value · (err, req, res, next) from fake-http.js', 'err — giá trị bị ném bất kỳ · (err, req, res, next) trong fake-http.js'],
  dauRa: ['toHttpError → { status, body } · errorHandler → void', 'toHttpError → { status, body } · errorHandler → void'],
  goiY: [['Check in order: Number.isInteger(err.status) && 400 <= status <= 599 → ZodError → code 23505 → 500.', 'Kiểm theo thứ tự: Number.isInteger(err.status) && 400 <= status <= 599 → ZodError → code 23505 → 500.'], ['fields: err.issues.map((i) => ({ path: i.path.join(\'.\'), message: i.message })).', 'fields: err.issues.map((i) => ({ path: i.path.join(\'.\'), message: i.message })).']],
  loi: [['res.status(err.status ?? 500).json({ error: err.message }) for everything: a 23505 becomes a 500 that says “duplicate key value violates unique constraint notes_slug_key” — wrong code AND a schema leak.', 'res.status(err.status ?? 500).json({ error: err.message }) cho mọi thứ: một lỗi 23505 thành 500 nói "duplicate key value violates unique constraint notes_slug_key" — sai mã VÀ lộ lược đồ.'], ['An error handler with three parameters: Express treats it as a normal middleware and never sends errors to it.', 'Bộ xử lý lỗi có ba tham số: Express coi nó là middleware thường và không bao giờ gửi lỗi tới nó.'], ['throw null / throw "x": err.message on a non-object throws inside the error handler itself.', 'throw null / throw "x": err.message trên thứ không phải object làm ném lỗi ngay trong bộ xử lý lỗi.']],
  gt: ['One translation table from internal errors to the HTTP contract makes every route consistent: the shape of a 422 is part of the contract (the HTTP test asserts fields[0].path), a driver code becomes the status the client understands, and unexpected errors are logged for you and opaque to the client.', 'Một bảng dịch duy nhất từ lỗi nội bộ sang hợp đồng HTTP làm mọi route nhất quán: hình dạng của 422 là một phần hợp đồng (test HTTP khẳng định fields[0].path), mã của driver thành mã trạng thái client hiểu, và lỗi ngoài dự kiến được ghi log cho bạn mà đóng kín với client.'],
  kn: ['error handling', 'contract'], tns: [tn('error middleware', 'middleware lỗi', 'bốn tham số (err, req, res, next)'), tn('23505', 'unique_violation', 'mã PostgreSQL khi vi phạm khoá duy nhất')],
  gia: { 'fake-http.js': FAKE_HTTP },
  dau: `function toHttpError(err) {
  // Write your solution here
  return { status: err.status ?? 500, body: { error: err.message } };
}

function errorHandler(err, req, res, next) {
  const { status, body } = toHttpError(err);
  res.status(status).json(body);
}
`,
  giai: `/** The ONE place where internal errors become the HTTP contract. */
function toHttpError(err) {
  const e = err && typeof err === 'object' ? err : {};
  if (Number.isInteger(e.status) && e.status >= 400 && e.status <= 599) {
    return { status: e.status, body: { error: e.message } };            // our own errors carry a status
  }
  if (e.name === 'ZodError' && Array.isArray(e.issues)) {               // validation: name the failing fields
    return { status: 422, body: { error: 'VALIDATION', fields: e.issues.map((i) => ({ path: i.path.join('.'), message: i.message })) } };
  }
  if (e.code === '23505') return { status: 409, body: { error: 'CONFLICT' } };   // the constraint is the rule
  return { status: 500, body: { error: 'INTERNAL' } };                  // never leak an unexpected message
}

/** Express error middleware — FOUR parameters, registered last. */
function errorHandler(err, req, res, next) {
  const { status, body } = toHttpError(err);
  if (status === 500) console.error('unhandled', err && err.message);  // for you, not for the client
  res.status(status).json(body);
}
`,
  chung: `const run = (err) => { const res = mkRes(); errorHandler(err, mkReq(), res, mkNext()); return [res.statusCode, res.body]; };
const zod = (issues) => Object.assign(new Error('validation'), { name: 'ZodError', issues });
const pg = (code, message) => Object.assign(new Error(message), { code });`,
  cases: [
    { goi: `[toHttpError(Object.assign(new Error('NOT_FOUND'), { status: 404 })), toHttpError(zod([{ path: ['title'], message: 'Required' }]))]`, moTa: ['Own error with a status; a validation error names the field', 'Lỗi của mình có status; lỗi kiểm hợp lệ nêu tên trường'] },
    { goi: `[run(pg('23505', 'duplicate key value violates unique constraint "notes_slug_key"')), __log]`, moTa: ['23505 → 409 CONFLICT, nothing leaked, nothing logged', '23505 → 409 CONFLICT, không lộ gì, không ghi log'] },
    { goi: `[run(new TypeError("Cannot read properties of undefined (reading 'id')")), __log, errorHandler.length]`, moTa: ['Unexpected → 500 INTERNAL, logged; four parameters', 'Ngoài dự kiến → 500 INTERNAL, có ghi log; bốn tham số'] },
    { goi: `[toHttpError(zod([{ path: ['tags', 0], message: 'Too long' }, { path: ['title'], message: 'Required' }])), toHttpError(Object.assign(new Error('weird'), { status: 200 })), toHttpError(Object.assign(new Error('teapot'), { status: '418' }))]`, an: true },
    { goi: `[run(null), run('boom'), run(pg('22001', 'value too long for type character varying(200)'))]`, an: true },
  ],
});

export default modul('nodejs-14-3-supertest', '14.3 Testing the HTTP layer: app factory, contract, IDOR', [E1, E2, E3, E4]);
