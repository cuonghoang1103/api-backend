/** Node.js 18.1 — Các tầng: route biết HTTP, service biết luật, data biết lưu trữ; đếm 50/150 route bỏ tầng; AppError thay res.status; thứ tự middleware là kiến trúc. */
import { modul, cs, q, qn, bang1, tn, jsBai, nguon, goi, RES_GIA } from './_node-c15-18.mjs';

const E1 = cs({
  ten: 'What each layer is NOT allowed to know', kho: 'EASY', phut: 6,
  en: 'Questions on lesson 18.1 (the website’s source at a fixed commit, code files only).',
  vi: 'Câu hỏi về bài 18.1 (mã nguồn website ở một commit cố định, chỉ tệp mã).',
  cau: [
    q('c1', ['The service throws new AppError("SLUG_TAKEN", 409) instead of calling res.status(409). What does that buy?', 'Service ném new AppError("SLUG_TAKEN", 409) thay vì gọi res.status(409). Điều đó mua được gì?'],
      ['A queue worker, a cron job, a CLI script or a test can call the service — none of them has a res', 'A faster response, because throwing skips the JSON serialisation', 'Automatic retries, because Express retries a thrown AppError', 'Nothing: it is only a style preference of the codebase'],
      ['The service names a business condition and lets the HTTP layer decide how to say it. Each “does not know” makes a class of bug impossible, not merely unlikely.', 'Service gọi tên một điều kiện nghiệp vụ và để tầng HTTP quyết định nói nó ra sao. Mỗi chữ “không biết” làm một loại lỗi trở nên bất khả, không chỉ ít xảy ra.']),
    q('c2', ['50 of 150 route files import Prisma directly. When does that cost something?', '50 trên 150 tệp route import Prisma trực tiếp. Khi nào điều đó tốn kém?'],
      ['The day a rule must apply everywhere (soft-delete, audit, tenant filter): up to fifty edits instead of one', 'Every request: a direct Prisma call is slower than calling it through a service', 'Never: Prisma already validates every query, so the layer adds nothing', 'Only on deploy: more imports make the build image bigger'],
      ['Missing one of the fifty looks like chapter 8: Bình could read An’s note. The honest test: “if a rule had to apply to every note, would this endpoint get it automatically?”', 'Sót một trong năm mươi chỗ trông như chương 8: Bình đọc được ghi chú của An. Phép thử trung thực: “nếu một luật phải áp cho mọi ghi chú, endpoint này có tự động nhận nó không?”']),
    q('c3', ['src/index.ts mounts the request-id middleware at line 261, before helmet, CORS, body parsers and the rate limiter (555). Why does that order matter?', 'src/index.ts gắn middleware request id ở dòng 261, trước helmet, CORS, body parser và bộ giới hạn tốc độ (555). Vì sao thứ tự đó quan trọng?'],
      ['A middleware only helps requests that reach it: even a request rejected with 429 must carry an id', 'Express sorts middleware alphabetically, so line numbers do not matter', 'The rate limiter needs the request id as its counting key', 'helmet removes unknown headers, so X-Request-ID must be set first'],
      ['Move it three lines below the limiter and every rate-limited request becomes untraceable — no test catches it, no error appears. Middleware order is architecture, not configuration.', 'Dời nó xuống ba dòng dưới bộ giới hạn và mọi request bị giới hạn trở nên không lần ra được — không test nào bắt, không lỗi nào hiện. Thứ tự middleware là kiến trúc, không phải cấu hình.']),
    qn('c4', ['Which statements match the lesson? (choose all that apply)', 'Những câu nào khớp với bài? (chọn mọi câu đúng)'],
      ['services : routes is 4.8 : 1 — rules should outweigh plumbing', 'A read-only, rule-free dropdown list may reasonably skip the service', 'requireAuth belongs in middleware mounted once, not copied into each handler', 'The error handler should be mounted first so that it sees every error'],
      [0, 1, 2],
      ['The error handler must be LAST: mounted before a router, it never sees that router’s errors. A route that skips the service writes an awkward query; a route that skips requireAuth is an incident.', 'Error handler phải đứng CUỐI: gắn trước một router thì nó không bao giờ thấy lỗi của router đó. Route bỏ qua service viết ra một truy vấn hơi vụng; route bỏ qua requireAuth là một sự cố.']),
  ],
  goiY: [['Who else besides HTTP will call this code?', 'Ngoài HTTP còn ai gọi đoạn mã này?'], ['Every request walks the middleware list from top to bottom.', 'Mọi request đi qua danh sách middleware từ trên xuống.']],
  loi: [['res.status(…) inside a service.', 'res.status(…) bên trong service.'], ['Copying requireAuth into every handler.', 'Chép requireAuth vào từng handler.']],
  tns: [tn('layer', 'tầng'), tn('cross-cutting concern', 'mối quan tâm cắt ngang', 'something every request needs: auth, rate limit, request id'), tn('AppError', 'AppError', 'a business error with a code and an HTTP status hint')],
  kn: ['architecture', 'layers'],
});

const E2 = cs({
  ten: 'Which layer owns this line?', kho: 'EASY', phut: 5, loai: 'table',
  en: 'Route knows HTTP, service knows the rules, data knows storage, middleware is what every request needs.',
  vi: 'Route biết HTTP, service biết luật, data biết lưu trữ, middleware là thứ mọi request đều cần.',
  bang: [bang1('b1', ['Place each piece of code', 'Đặt từng đoạn mã'], [{ ma: 'x', ten: 'Code' }, { ma: 'l', ten: 'Layer', luaChon: ['route', 'service', 'data', 'middleware'] }], [
    { o: { x: 'createNoteSchema.parse(req.body) and res.status(201).json(note)' }, a: { l: 'route' } },
    { o: { x: 'if (await repo.slugExists(slug)) throw new AppError("SLUG_TAKEN", 409)' }, a: { l: 'service' } },
    { o: { x: 'prisma.note.findMany({ where: { authorId, deletedAt: null } })' }, a: { l: 'data' } },
    { o: { x: 'Only the author or an EDITOR may change a published note' }, a: { l: 'service' } },
    { o: { x: 'Reject the request with 401 when there is no valid token' }, a: { l: 'middleware' } },
    { o: { x: 'Stamp X-Request-ID on every response' }, a: { l: 'middleware' } },
  ], ['The value is in what each layer may not know: a service that does not know HTTP is reusable by workers, cron and tests; a route that does not know SQL cannot ship a million-row scan by accident; a cross-cutting rule in middleware cannot be forgotten in one place.', 'Giá trị nằm ở thứ mỗi tầng không được biết: service không biết HTTP thì worker, cron và test dùng lại được; route không biết SQL thì không thể vô tình đưa lên một phép quét triệu dòng; luật cắt ngang trong middleware thì không thể bị quên ở một chỗ.'])],
  goiY: [['req, res, status codes ⇒ route.', 'req, res, mã trạng thái ⇒ route.'], ['“Who may do what” ⇒ service.', '“Ai được làm gì” ⇒ service.']],
  loi: [['Putting the permission rule in the route.', 'Đặt luật phân quyền ở route.'], ['Putting SQL in the route.', 'Đặt SQL ở route.']],
  tns: [tn('repository', 'kho dữ liệu', 'the data layer: how to read and write, not why')],
  kn: ['architecture'],
});

function layerReport(files) {
  // files: [{ path, lines, imports: [...] }]. Đếm đúng như bài: route import cấu hình DB trực tiếp, có/không kèm service.
  const isRoute = (f) => f.path.startsWith('src/routes/');
  const isService = (f) => f.path.startsWith('src/services/');
  const usesDb = (f) => f.imports.some((i) => /(^|\/)config\/database$|@prisma\/client$/.test(i));
  const usesService = (f) => f.imports.some((i) => /(^|\/)services\//.test(i));
  const routes = files.filter(isRoute);
  const services = files.filter(isService);
  const direct = routes.filter(usesDb);
  const sum = (xs) => xs.reduce((s, f) => s + f.lines, 0);
  return {
    routeFiles: routes.length,
    direct: direct.length,
    directOnly: direct.filter((f) => !usesService(f)).map((f) => f.path),
    both: direct.filter(usesService).length,
    pct: routes.length ? Math.round((100 * direct.length) / routes.length) : 0,
    servicesWithDb: services.filter(usesDb).length,
    ratio: sum(routes) ? Number((sum(services) / sum(routes)).toFixed(1)) : null,
  };
}
const F = (path, lines, ...imports) => ({ path, lines, imports });
const REPO = [
  F('src/routes/notes.routes.ts', 180, '../services/notes.service', '../middleware/auth'),
  F('src/routes/categories.routes.ts', 40, '../config/database'),
  F('src/routes/feed.routes.ts', 420, '../config/database', '../services/feed.service'),
  F('src/routes/admin.routes.ts', 900, '../config/database'),
  F('src/services/notes.service.ts', 650, '../config/database'),
  F('src/services/feed.service.ts', 1200, '../config/database', './notes.service'),
  F('src/services/pro.service.ts', 300),
  F('src/middleware/auth.ts', 120, 'jsonwebtoken'),
];
const E3 = await jsBai({
  ten: 'layerReport(files): count whether the boundary holds', kho: 'MEDIUM', phut: 14,
  en: '<p>Layers are easy to draw and easy to leak; the only way to know is to count. <code>files</code> are <code>{ path, lines, imports }</code>. Route files live under <code>src/routes/</code>, services under <code>src/services/</code>. A file “uses the database directly” if one of its imports ends with <code>config/database</code> or is <code>@prisma/client</code>; it “uses a service” if an import contains <code>services/</code>. Return <code>{ routeFiles, direct, directOnly, both, pct, servicesWithDb, ratio }</code>: route files; routes using the DB directly; the paths of those that use <b>no</b> service; how many use both; <code>direct / routeFiles × 100</code> rounded to an integer (0 if no routes); services using the DB; and service lines ÷ route lines, 1 decimal (<code>null</code> if no route lines).</p>',
  vi: '<p>Tầng thì dễ vẽ và dễ rò; cách duy nhất để biết là đếm. <code>files</code> là <code>{ path, lines, imports }</code>. Tệp route nằm dưới <code>src/routes/</code>, service dưới <code>src/services/</code>. Một tệp “dùng CSDL trực tiếp” nếu có import kết thúc bằng <code>config/database</code> hoặc là <code>@prisma/client</code>; nó “dùng service” nếu có import chứa <code>services/</code>. Trả về <code>{ routeFiles, direct, directOnly, both, pct, servicesWithDb, ratio }</code>: số tệp route; số route dùng CSDL trực tiếp; đường dẫn những cái <b>không</b> dùng service nào; số cái dùng cả hai; <code>direct / routeFiles × 100</code> làm tròn thành số nguyên (0 nếu không có route); số service dùng CSDL; và số dòng service ÷ số dòng route, 1 chữ số (<code>null</code> nếu không có dòng route).</p>',
  goiY: [['Write three small predicates (isRoute, usesDb, usesService) and filter with them.', 'Viết ba hàm điều kiện nhỏ (isRoute, usesDb, usesService) rồi lọc bằng chúng.'], ['“../services/x” and “./notes.service” differ: only the first contains services/.', '“../services/x” và “./notes.service” khác nhau: chỉ cái đầu chứa services/.']],
  loi: [['Counting services that import Prisma as leaks: here the data layer mostly lives inside services, which is normal.', 'Đếm service import Prisma là rò: ở đây tầng data chủ yếu nằm trong service, điều đó bình thường.'], ['Reporting only the percentage: the 11 route files with NO service are the ones a future “everywhere” rule will miss.', 'Chỉ báo phần trăm: 11 tệp route KHÔNG có service nào mới là chỗ một luật “áp ở mọi nơi” tương lai sẽ bỏ sót.']],
  gt: ['On the website: 50 of 150 route files (33%) import Prisma — 11 with no service, 39 alongside services — and 382 of 705 services do. Nobody decided this; it happened one endpoint at a time. Counting turns “we have layers” into a list of the places a rule must be remembered.', 'Trên website: 50/150 tệp route (33%) import Prisma — 11 không có service nào, 39 kèm service — và 382/705 service cũng vậy. Không ai quyết định điều này; nó xảy ra từng endpoint một. Đếm biến câu “chúng ta có tầng” thành danh sách các chỗ một luật phải được nhớ.'],
  kn: ['architecture', 'measurement'],
  tns: [tn('import graph', 'đồ thị import'), tn('layer leak', 'rò tầng', 'a route that skips the service')],
  dau: `/** does the route → service → data boundary hold? */
function layerReport(files) {
  // Write your solution here
  const routes = files.filter((f) => f.path.includes('routes'));
  const direct = routes.filter((f) => f.imports.some((i) => i.includes('prisma')));
  return { routeFiles: routes.length, direct: direct.length, directOnly: [], both: 0, pct: 0, servicesWithDb: 0, ratio: null };
}
`,
  giai: '// Reference solution\n' + nguon(layerReport),
  cases: [
    { goi: goi('layerReport', REPO), moTa: ['A small slice of the backend', 'Một lát nhỏ của backend'] },
    { goi: goi('layerReport', [F('src/routes/a.routes.ts', 10, '@prisma/client'), F('src/services/a.service.ts', 48)]), moTa: ['@prisma/client counts too', '@prisma/client cũng tính'] },
    { goi: goi('layerReport', [...REPO, F('src/routes/x.routes.ts', 60, '../services/x.service'), F('src/routes/y.routes.ts', 30, '@prisma/client', '../../services/work/permissions')]), an: true },
    { goi: goi('layerReport', [F('src/services/only.service.ts', 10, '../config/database')]), an: true },
  ],
});

class AppError extends Error {
  constructor(code, status) { super(code); this.name = 'AppError'; this.code = code; this.status = status; }
}
function createNotesService(repo) {
  // Tầng service: chỉ nói ngôn ngữ nghiệp vụ — không req, không res, không mã HTTP trong logic (status chỉ là gợi ý).
  return {
    async create(user, input) {
      if (!user) throw new AppError('UNAUTHENTICATED', 401);
      const slug = input.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      if (await repo.slugExists(slug)) throw new AppError('SLUG_TAKEN', 409);
      return repo.insert({ authorId: user.id, title: input.title, body: input.body ?? '', slug });
    },
  };
}
function postNote(service) {
  // Tầng route: chỉ nói HTTP — kiểm hình dạng đầu vào, giao việc, dịch kết quả sang 201, lỗi chuyển cho next.
  return async (req, res, next) => {
    try {
      if (typeof req.body?.title !== 'string' || !req.body.title.trim()) return res.status(400).json({ error: 'VALIDATION', field: 'title' });
      const note = await service.create(req.user, { title: req.body.title, body: req.body.body });
      res.status(201).json(note);
    } catch (e) {
      next(e);
    }
  };
}
const REPO_GIA = `const rows = []; const repo = { slugExists: async (s) => rows.some((r) => r.slug === s), insert: async (n) => { const row = { id: rows.length + 1, ...n }; rows.push(row); return row; } };`;
const E4 = await jsBai({
  ten: 'createNotesService(repo) + postNote(service): split a route that talks to the database', kho: 'MEDIUM', phut: 22,
  en: '<p>Split <code>POST /notes</code> into a route that speaks only HTTP and a service that speaks only business. Write three things in <code>answer.js</code>:</p><ul><li><code>class AppError extends Error</code> — <code>new AppError(code, status)</code> has <code>name "AppError"</code>, <code>message = code</code>, <code>code</code>, <code>status</code>;</li><li><code>createNotesService(repo)</code> → <code>{ async create(user, input) }</code>: no user ⇒ throw <code>AppError("UNAUTHENTICATED", 401)</code>; slug = title lower-cased, trimmed, every run of characters other than <code>a-z0-9</code> replaced by <code>-</code>, leading/trailing <code>-</code> removed; <code>await repo.slugExists(slug)</code> ⇒ throw <code>AppError("SLUG_TAKEN", 409)</code>; otherwise return <code>repo.insert({ authorId: user.id, title, body: body ?? "", slug })</code>;</li><li><code>postNote(service)</code> → <code>async (req, res, next)</code>: if <code>req.body.title</code> is not a non-blank string respond <code>400 { error: "VALIDATION", field: "title" }</code>; else call <code>service.create(req.user, { title, body })</code> and respond <code>201</code> with the note; any error goes to <code>next(e)</code>, never to <code>res</code>.</li></ul>',
  vi: '<p>Tách <code>POST /notes</code> thành một route chỉ nói HTTP và một service chỉ nói nghiệp vụ. Viết ba thứ trong <code>answer.js</code>:</p><ul><li><code>class AppError extends Error</code> — <code>new AppError(code, status)</code> có <code>name "AppError"</code>, <code>message = code</code>, <code>code</code>, <code>status</code>;</li><li><code>createNotesService(repo)</code> → <code>{ async create(user, input) }</code>: không có user ⇒ ném <code>AppError("UNAUTHENTICATED", 401)</code>; slug = title viết thường, cắt khoảng trắng, mọi dãy ký tự khác <code>a-z0-9</code> thay bằng <code>-</code>, bỏ <code>-</code> ở đầu/cuối; <code>await repo.slugExists(slug)</code> ⇒ ném <code>AppError("SLUG_TAKEN", 409)</code>; không thì trả <code>repo.insert({ authorId: user.id, title, body: body ?? "", slug })</code>;</li><li><code>postNote(service)</code> → <code>async (req, res, next)</code>: nếu <code>req.body.title</code> không phải chuỗi khác rỗng thì trả <code>400 { error: "VALIDATION", field: "title" }</code>; không thì gọi <code>service.create(req.user, { title, body })</code> và trả <code>201</code> kèm ghi chú; mọi lỗi đi vào <code>next(e)</code>, không bao giờ vào <code>res</code>.</li></ul>',
  yc: [['The service never touches req or res.', 'Service không bao giờ đụng tới req hay res.'], ['The route never decides business rules.', 'Route không bao giờ quyết định luật nghiệp vụ.']],
  goiY: [['The repo is injected, so the service can be tested with a Map-backed fake (chapter 14).', 'repo được tiêm vào, nên service kiểm thử được bằng một bản giả dùng Map (chương 14).'], ['Wrap the route body in try/catch and call next(e): the error handler (mounted last) translates AppError.status to the response.', 'Bọc thân route trong try/catch và gọi next(e): error handler (gắn cuối) dịch AppError.status thành response.']],
  loi: [['res.status(409) inside the service: a queue worker that imports notes has no res, so the rule cannot be reused.', 'res.status(409) bên trong service: một worker hàng đợi import notes không có res, nên luật không dùng lại được.'], ['Calling prisma directly in the handler “because it is one line”: the next everywhere-rule (soft-delete) misses this route.', 'Gọi prisma ngay trong handler “vì chỉ một dòng”: luật áp-mọi-nơi kế tiếp (soft-delete) bỏ sót route này.']],
  gt: ['This is the lesson’s split: the route validates (zod in the course), hands the work to notesService.create, translates the result into 201 and passes errors on with next(e); the service names business conditions. CT Work does the same at scale: REST routes, MCP commands and bulk edits all go through one applyIssueChange.', 'Đây là cách tách của bài: route kiểm đầu vào (zod trong khoá), giao việc cho notesService.create, dịch kết quả thành 201 và chuyển lỗi bằng next(e); service gọi tên các điều kiện nghiệp vụ. CT Work làm y vậy ở quy mô lớn: route REST, lệnh MCP và sửa hàng loạt đều đi qua một applyIssueChange.'],
  kn: ['architecture', 'Express', 'dependency injection'],
  tns: [tn('service layer', 'tầng service'), tn('next(err)', 'next(err)', 'hand the error to the error-handling middleware')],
  dau: `/** route + service, not yet split */
class AppError extends Error {
  constructor(code, status) { super(code); this.code = code; this.status = status; }
}
function createNotesService(repo) {
  return { async create(user, input) { return repo.insert({ authorId: user.id, title: input.title, body: input.body, slug: input.title }); } };
}
function postNote(service) {
  return async (req, res, next) => {
    // Write your solution here — the rules below belong in the service
    if (!req.user) return res.status(401).json({ error: 'UNAUTHENTICATED' });
    const note = await service.create(req.user, req.body);
    res.status(201).json(note);
  };
}
`,
  giai: '// Reference solution\n' + nguon(AppError, createNotesService, postNote),
  cases: [
    { chuanBi: `${RES_GIA} ${REPO_GIA} const svc = createNotesService(repo); const res = mkRes(); await postNote(svc)({ user: { id: 7 }, body: { title: '  Hello, Node 22!  ' } }, res, (e) => { throw e; });`, goi: '({ status: res.statusCode, body: res.body })', moTa: ['A valid note', 'Một ghi chú hợp lệ'] },
    { chuanBi: `${REPO_GIA} const svc = createNotesService(repo); await svc.create({ id: 1 }, { title: 'Streams' }); let err = null; try { await svc.create({ id: 2 }, { title: 'streams' }); } catch (e) { err = e; }`, goi: '({ name: err && err.name, code: err && err.code, status: err && err.status, isError: err instanceof Error })', moTa: ['The service alone (no req, no res)', 'Service đứng riêng (không req, không res)'] },
    { chuanBi: `${RES_GIA} ${REPO_GIA} const svc = createNotesService(repo); const res = mkRes(); let passed = null; await postNote(svc)({ body: { title: 'x' } }, res, (e) => { passed = e; });`, goi: '({ code: passed && passed.code, status: passed && passed.status, responded: res.ended })', an: true },
    { chuanBi: `${RES_GIA} ${REPO_GIA} const svc = createNotesService(repo); const res = mkRes(); await postNote(svc)({ user: { id: 1 }, body: { title: '   ' } }, res, () => {});`, goi: '({ status: res.statusCode, body: res.body, rows: rows.length })', an: true },
    { chuanBi: `${REPO_GIA} const svc = createNotesService(repo); const n = await svc.create({ id: 3 }, { title: '--Árvíztűrő & tükör--' });`, goi: 'n', an: true },
  ],
});

function middlewareOrder(stack) {
  // stack: tên theo thứ tự gắn. Mỗi luật là một quan hệ "phải đứng trước".
  const at = (n) => stack.indexOf(n);
  const routers = stack.map((n, i) => (n.startsWith('router:') ? i : -1)).filter((i) => i >= 0);
  const firstRouter = routers.length ? routers[0] : Infinity;
  const lastRouter = routers.length ? routers[routers.length - 1] : -1;
  const v = [];
  if (at('requestId') < 0) v.push('NO_REQUEST_ID');
  else if (at('requestId') > Math.min(...['helmet', 'cors', 'rateLimit'].map(at).filter((i) => i >= 0), firstRouter)) v.push('REQUEST_ID_TOO_LATE');
  if (at('rateLimit') >= 0 && at('rateLimit') > firstRouter) v.push('RATE_LIMIT_AFTER_ROUTERS');
  if (at('json') >= 0 && at('json') > firstRouter) v.push('BODY_PARSER_AFTER_ROUTERS');
  if (at('notFound') >= 0 && at('notFound') < lastRouter) v.push('NOT_FOUND_BEFORE_ROUTERS');
  if (at('errorHandler') < 0) v.push('NO_ERROR_HANDLER');
  else if (at('errorHandler') !== stack.length - 1) v.push('ERROR_HANDLER_NOT_LAST');
  return v;
}
const SITE = ['trustProxy', 'requestId', 'helmet', 'cors', 'json', 'urlencoded', 'rateLimit', 'router:auth', 'router:notes', 'router:feed', 'notFound', 'errorHandler'];
const E5 = await jsBai({
  ten: 'middlewareOrder(stack): order is architecture, not configuration', kho: 'HARD', phut: 15,
  en: '<p><code>stack</code> lists middleware names in mount order; routers are named <code>"router:&lt;name&gt;"</code>. Return the violations, in this order:</p><ol><li><code>NO_REQUEST_ID</code> if there is no <code>requestId</code>; otherwise <code>REQUEST_ID_TOO_LATE</code> if it comes after any of <code>helmet</code>, <code>cors</code>, <code>rateLimit</code> or the first router;</li><li><code>RATE_LIMIT_AFTER_ROUTERS</code> — <code>rateLimit</code> after the first router;</li><li><code>BODY_PARSER_AFTER_ROUTERS</code> — <code>json</code> after the first router;</li><li><code>NOT_FOUND_BEFORE_ROUTERS</code> — <code>notFound</code> before the last router;</li><li><code>NO_ERROR_HANDLER</code> if there is no <code>errorHandler</code>; otherwise <code>ERROR_HANDLER_NOT_LAST</code> if it is not the very last entry.</li></ol><p>Middleware missing from the stack (other than the two named) raises nothing.</p>',
  vi: '<p><code>stack</code> liệt kê tên middleware theo thứ tự gắn; router có tên <code>"router:&lt;tên&gt;"</code>. Trả về các vi phạm, theo thứ tự:</p><ol><li><code>NO_REQUEST_ID</code> nếu không có <code>requestId</code>; không thì <code>REQUEST_ID_TOO_LATE</code> nếu nó đứng sau bất kỳ cái nào trong <code>helmet</code>, <code>cors</code>, <code>rateLimit</code> hay router đầu tiên;</li><li><code>RATE_LIMIT_AFTER_ROUTERS</code> — <code>rateLimit</code> sau router đầu tiên;</li><li><code>BODY_PARSER_AFTER_ROUTERS</code> — <code>json</code> sau router đầu tiên;</li><li><code>NOT_FOUND_BEFORE_ROUTERS</code> — <code>notFound</code> trước router cuối cùng;</li><li><code>NO_ERROR_HANDLER</code> nếu không có <code>errorHandler</code>; không thì <code>ERROR_HANDLER_NOT_LAST</code> nếu nó không phải mục cuối cùng.</li></ol><p>Middleware vắng mặt (trừ hai cái đã nêu) không sinh vi phạm nào.</p>',
  goiY: [['indexOf gives −1 for missing names; ignore those when comparing positions.', 'indexOf cho −1 với tên vắng mặt; bỏ chúng khi so vị trí.'], ['Compute the first and last router index once.', 'Tính chỉ số router đầu và cuối một lần.']],
  loi: [['Rate limiter after the routers: it limits nothing those routers already answered.', 'Bộ giới hạn sau các router: nó không giới hạn được gì mà các router đó đã trả lời.'], ['Error handler before a router: it never sees that router’s errors (chapter 5).', 'Error handler trước một router: nó không bao giờ thấy lỗi của router đó (chương 5).']],
  gt: ['Every request walks this list from top to bottom, and a middleware can only help requests that reach it. On the website: request id at line 261 (section “1b”), helmet 270, CORS 334, body parsers 375, rate limiter 555, 114 routers from 562, 404 at 790, error handler at 798 — so even a 429 carries an id.', 'Mọi request đi qua danh sách này từ trên xuống, và một middleware chỉ giúp được request đi tới nó. Trên website: request id ở dòng 261 (mục “1b”), helmet 270, CORS 334, body parser 375, bộ giới hạn 555, 114 router từ 562, 404 ở 790, error handler ở 798 — nên kể cả 429 cũng mang id.'],
  kn: ['middleware', 'Express', 'architecture'],
  tns: [tn('mount order', 'thứ tự gắn'), tn('error-handling middleware', 'middleware xử lý lỗi', '(err, req, res, next), mounted last')],
  dau: `/** check the middleware order */
function middlewareOrder(stack) {
  // Write your solution here
  const v = [];
  if (!stack.includes('requestId')) v.push('NO_REQUEST_ID');
  if (!stack.includes('errorHandler')) v.push('NO_ERROR_HANDLER');
  return v;
}
`,
  giai: '// Reference solution\n' + nguon(middlewareOrder),
  cases: [
    { goi: goi('middlewareOrder', SITE), moTa: ['The website’s src/index.ts', 'src/index.ts của website'] },
    { goi: goi('middlewareOrder', ['trustProxy', 'helmet', 'cors', 'json', 'rateLimit', 'requestId', 'router:notes', 'notFound', 'errorHandler']), moTa: ['Request id moved below the limiter', 'Request id bị dời xuống dưới bộ giới hạn'] },
    { goi: goi('middlewareOrder', ['requestId', 'router:auth', 'errorHandler', 'json', 'router:notes', 'notFound', 'rateLimit']), an: true },
    { goi: goi('middlewareOrder', ['router:notes', 'notFound']), an: true },
    { goi: goi('middlewareOrder', ['requestId', 'json', 'router:a', 'notFound', 'router:b', 'errorHandler']), an: true },
  ],
});

export default modul('nodejs-18-1-tang-va-trach-nhiem', '18.1 Layers, and the files that skip one', [E1, E2, E3, E4, E5]);
