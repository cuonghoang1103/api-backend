// Node.js 1.2 — Functions, closures and this. Hành vi this đã chạy bằng Node 22.23.3 (n02/kiem-node/b1.cjs + b1.mjs).
import { modul, cs, jsBai, q, tn, pre, RES_GIA } from './_node.mjs';

const TN = [
  tn('closure', 'closure (bao đóng)', 'A function that keeps the variables of the place where it was created, even after that code finished.'),
  tn('factory function', 'hàm nhà máy', 'A function that builds and returns another function or object, e.g. requireRole(role).'),
  tn('private state', 'trạng thái riêng', 'Data only reachable through the returned function — nothing outside can touch it.'),
  tn('this', 'this', 'The receiver decided by HOW a regular function is called (obj.method() ⇒ obj).'),
  tn('arrow function', 'hàm mũi tên', 'Has no own this; uses the this of the place where it was written.'),
  tn('bind', 'bind', 'Returns a NEW function whose this is fixed.'),
];

export default modul('nodejs-1-2-ham-closure-this', '1.2 Functions, closures and this', [
  jsBai({
    ten: 'createCounter: two counters that never share a number',
    kho: 'EASY', phut: 8,
    en: `<p>Write <code>createCounter()</code> from the lesson: it returns a function; each call of that function adds 1 and returns the new count. Every call to <code>createCounter()</code> must make a <b>fresh, private</b> counter.</p>${pre("const a = createCounter();\nconst b = createCounter();\na(); a(); a();   // 1, 2, 3\nb();             // 1   ← b has its own count\ntypeof count;    // 'undefined' — nothing outside can touch it")}<p>The starter keeps <code>count</code> at the top of the file, so all counters share it — the bug you get when state lives outside the closure.</p>`,
    vi: `<p>Viết <code>createCounter()</code> như bài học: trả về một hàm; mỗi lần gọi hàm đó cộng 1 và trả số mới. Mỗi lần gọi createCounter() phải tạo một bộ đếm MỚI, RIÊNG. Code khởi đầu để count ở đầu tệp nên mọi bộ đếm dùng chung — bug khi trạng thái nằm ngoài closure.</p>`,
    yc: [
      ['<code>createCounter()</code> returns a function; calling it returns 1, 2, 3, …', 'createCounter() trả về một hàm; gọi nó trả 1, 2, 3, …'],
      ['Two counters are independent.', 'Hai bộ đếm độc lập.'],
      ['No variable named <code>count</code> is visible from outside (no global state).', 'Không có biến count nào nhìn thấy được từ ngoài (không trạng thái toàn cục).'],
    ],
    goiY: [
      ['Move <code>let count = 0</code> INSIDE <code>createCounter</code>, before the <code>return</code>.', 'Đưa let count = 0 VÀO TRONG createCounter, trước return.'],
      ['Each call of <code>createCounter</code> runs that line again, creating a new scope — that is what makes the counters separate.', 'Mỗi lần gọi createCounter dòng đó chạy lại, tạo một phạm vi mới — đó là thứ làm các bộ đếm tách biệt.'],
    ],
    loi: [
      ['Keeping the counter in a top-level variable: every "instance" is the same counter (and any code in the file can reset it).', 'Để bộ đếm ở biến cấp cao nhất: mọi "bản" là cùng một bộ đếm (và code nào trong tệp cũng đặt lại được).'],
      ['Returning <code>count++</code> — that returns the OLD value, so the first call gives 0.', 'Trả count++ — trả giá trị CŨ, nên lần đầu cho 0.'],
    ],
    gt: ['A closure keeps the variables of the call that created it. Because <code>let count = 0</code> runs inside <code>createCounter</code>, every call creates a new <code>count</code> and the returned function holds a reference to that one only. Nothing else in the program has a name for it, so the state is truly private — the same mechanism a rate limiter or a cache uses.',
      'Closure giữ biến của lần gọi đã tạo ra nó. Vì let count = 0 chạy bên trong createCounter, mỗi lần gọi tạo một count mới và hàm trả về chỉ giữ tham chiếu tới cái đó. Không chỗ nào khác có tên cho nó ⇒ trạng thái thật sự riêng — đúng cơ chế mà rate limiter hay cache dùng.'],
    kn: ['closures', 'private state'],
    tns: TN,
    viDu: [{ input: 'const a = createCounter(); const b = createCounter(); [a(), a(), a(), b()]', output: '[1,2,3,1]', explanation: 'b starts from its own 0.|||b bắt đầu từ số 0 của riêng nó.' }],
    dau: `let count = 0;

function createCounter() {
  return function () {
    count++;
    return count;
  };
}
`,
    giai: `// Each call of createCounter() runs "let count = 0" again, so every
// returned function closes over its OWN count. Nothing outside can reach it.
function createCounter() {
  let count = 0;              // private: lives in this call's scope only
  return function () {
    count += 1;               // the closure still sees count after createCounter returned
    return count;             // the NEW value: 1, 2, 3...
  };
}
`,
    cases: [
      { moTa: ['a(), a(), a(), b() ⇒ 1, 2, 3, 1', 'a(), a(), a(), b() ⇒ 1, 2, 3, 1'], goi: '(() => { const a = createCounter(); const b = createCounter(); return [a(), a(), a(), b()]; })()' },
      { moTa: ['count is not visible outside', 'count không thấy được từ ngoài'], goi: '(() => { const a = createCounter(); a(); return typeof count; })()' },
      { an: true, goi: '(() => { const xs = [createCounter(), createCounter(), createCounter()]; xs[1](); xs[1](); xs[2](); return xs.map((f) => f()); })()' },
      { an: true, goi: '(() => { const a = createCounter(); for (let i = 0; i < 99; i++) a(); return a(); })()' },
    ],
  }),

  jsBai({
    ten: 'requireRole(role): the middleware factory every Express app has',
    kho: 'MEDIUM', phut: 12,
    en: `<p>The lesson says every middleware factory looks like <code>function requireRole(role) { return (req, res, next) =&gt; { … } }</code> — the inner arrow closes over <code>role</code>. Write it for the Notes API:</p>
<ul><li>No <code>req.user</code> (not logged in) ⇒ <code>res.status(401).json({ error: 'unauthenticated' })</code>.</li>
<li><code>req.user.role</code> is not <code>role</code> ⇒ <code>res.status(403).json({ error: 'forbidden', need: role })</code>.</li>
<li>Otherwise call <code>next()</code> and send nothing.</li></ul>${pre("const onlyAdmin = requireRole('admin');\nonlyAdmin({ user: { id: 1, role: 'admin' } }, res, next);   // next() called\nonlyAdmin({ user: { id: 2, role: 'student' } }, res, next); // 403 { error: 'forbidden', need: 'admin' }")}<p>Tests call your middleware with a fake <code>req</code> and a fake <code>res</code> that records <code>status()</code> and <code>json()</code>, exactly as chapter 14 tests middleware.</p>`,
    vi: `<p>Bài học nói mọi middleware factory có dạng function requireRole(role) { return (req, res, next) => { … } } — arrow bên trong giữ role. Viết nó cho Notes API: không có req.user ⇒ 401 { error: 'unauthenticated' }; role khác ⇒ 403 { error: 'forbidden', need: role }; còn lại gọi next() và không gửi gì. Kiểm gọi middleware với req/res GIẢ ghi lại status() và json().</p>`,
    yc: [
      ['<code>requireRole(role)</code> returns a function <code>(req, res, next)</code>.', 'requireRole(role) trả về hàm (req, res, next).'],
      ['401 when there is no user; 403 with <code>need</code> when the role differs; <code>next()</code> otherwise.', '401 khi không có user; 403 kèm need khi sai vai trò; ngược lại next().'],
      ['Never call <code>next()</code> after sending a response, and never send twice.', 'Không gọi next() sau khi đã gửi phản hồi, không gửi hai lần.'],
    ],
    goiY: [
      ['Shape: <code>function requireRole(role) { return (req, res, next) =&gt; { … }; }</code>.', 'Dạng: function requireRole(role) { return (req, res, next) => { … }; }.'],
      ['Use <code>return res.status(…).json(…)</code> so the function stops right after answering.', 'Dùng return res.status(…).json(…) để hàm dừng ngay sau khi trả lời.'],
      ['<code>req.user?.role</code> is safe when user is missing, but you need the 401 branch first anyway.', 'req.user?.role an toàn khi thiếu user, nhưng vẫn cần nhánh 401 trước.'],
    ],
    loi: [
      ['Forgetting <code>return</code> after <code>res.status(403).json(…)</code>, so <code>next()</code> runs too — the forbidden request reaches the handler.', 'Quên return sau res.status(403).json(…) nên next() vẫn chạy — request bị cấm vẫn tới handler.'],
      ['Reading <code>req.user.role</code> without checking <code>req.user</code> — TypeError on every anonymous request.', 'Đọc req.user.role mà không kiểm req.user — TypeError với mọi request ẩn danh.'],
      ['Writing a middleware (req, res, next) directly instead of a factory, so the role cannot be configured per route.', 'Viết thẳng middleware (req, res, next) thay vì factory nên không cấu hình được role theo từng route.'],
    ],
    gt: ['<code>requireRole(\'admin\')</code> runs once when the route is defined; the arrow it returns runs on every request and still sees <code>role</code> through the closure. Each early <code>return</code> guarantees one outcome per request: an answer (401/403) or <code>next()</code>, never both. Fake <code>req</code>/<code>res</code> objects make this testable without a server.',
      'requireRole(\'admin\') chạy một lần khi khai báo route; arrow nó trả về chạy với mỗi request và vẫn thấy role nhờ closure. Mỗi return sớm bảo đảm đúng một kết cục cho mỗi request: trả lời (401/403) hoặc next(), không bao giờ cả hai. req/res giả giúp kiểm được mà không cần server.'],
    kn: ['middleware factory', 'closures', 'early return'],
    tns: [...TN, tn('middleware', 'middleware', 'A function (req, res, next) that answers or passes the request on with next().')],
    viDu: [{ input: "requireRole('admin')({ user: { role: 'student' } }, res, next)", output: 'status 403 · body {"error":"forbidden","need":"admin"} · next not called', explanation: 'A logged-in user with the wrong role.|||Người dùng đã đăng nhập nhưng sai vai trò.' }],
    chung: RES_GIA,
    dau: `function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      res.status(403).json({ error: 'forbidden' });
    }
    next();
  };
}
`,
    giai: `// Factory: runs once per route definition. The arrow it returns runs on
// every request and still sees "role" through the closure.
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      // not logged in at all -> 401, and STOP (return)
      return res.status(401).json({ error: 'unauthenticated' });
    }
    if (req.user.role !== role) {
      // logged in, wrong role -> 403, tell the client which role is needed
      return res.status(403).json({ error: 'forbidden', need: role });
    }
    next(); // allowed: hand the request to the next middleware/handler
  };
}
`,
    cases: [
      { moTa: ['admin passes: next() called, nothing sent', 'admin qua: gọi next(), không gửi gì'], chuanBi: "const res = mkRes(); const next = mkNext(); requireRole('admin')({ user: { id: 1, role: 'admin' } }, res, next);", goi: '[next.calls, res.sent]' },
      { moTa: ['student on an admin route: 403 + need, next not called', 'student vào route admin: 403 + need, không next'], chuanBi: "const res = mkRes(); const next = mkNext(); requireRole('admin')({ user: { id: 2, role: 'student' } }, res, next);", goi: '[res.statusCode, res.body, next.calls]' },
      { moTa: ['no user: 401 (no TypeError)', 'không có user: 401 (không TypeError)'], chuanBi: "const res = mkRes(); const next = mkNext(); requireRole('admin')({}, res, next);", goi: '[res.statusCode, res.body, next.calls]' },
      { an: true, chuanBi: "const teacherOnly = requireRole('teacher'); const r1 = mkRes(), n1 = mkNext(), r2 = mkRes(), n2 = mkNext(); teacherOnly({ user: { role: 'teacher' } }, r1, n1); teacherOnly({ user: { role: 'admin' } }, r2, n2);", goi: '[n1.calls, r1.sent, r2.statusCode, r2.body, n2.calls, r2.sent]' },
      { an: true, chuanBi: "const a = requireRole('admin'), s = requireRole('student'); const r = mkRes(), n = mkNext(); s({ user: { role: 'student' } }, r, n); const r2 = mkRes(), n2 = mkNext(); a({ user: { role: 'student' } }, r2, n2);", goi: '[n.calls, r2.body.need]' },
    ],
  }),

  cs({
    ten: 'Predict this: method, arrow, detached, bind',
    kho: 'MEDIUM', phut: 8,
    en: `All questions use this object, saved as <code>service.cjs</code> (CommonJS) unless the question says <code>.mjs</code>:${pre("const service = {\n  name: 'NotesAPI',\n  greetNormal: function () { return 'Hello from ' + this.name; },\n  greetArrow: () => 'Hello from ' + this.name,\n};")}`,
    vi: 'Mọi câu dùng object này, lưu thành service.cjs (CommonJS) trừ khi câu hỏi nói .mjs.',
    cau: [
      q('t1', ['<code>console.log(service.greetArrow())</code> prints…', 'service.greetArrow() in gì?'],
        ['Hello from undefined', 'Hello from NotesAPI', 'TypeError: Cannot read properties of undefined', 'Hello from service'],
        ['An arrow has no own <code>this</code>: it uses the <code>this</code> of the place it was written — the top of the file, not the object. Calling it as a method changes nothing.', 'Arrow không có this riêng: nó dùng this của chỗ nó được viết — đầu tệp, không phải object. Gọi như phương thức cũng không đổi gì.']),
      q('t2', ['<code>const detached = service.greetNormal; console.log(detached());</code> in the <b>.cjs</b> file prints…', 'Tách phương thức khỏi object rồi gọi, trong tệp .cjs.'],
        ['Hello from undefined', 'Hello from NotesAPI', 'TypeError: Cannot read properties of undefined (reading \'name\')', 'ReferenceError: this is not defined'],
        ['The function is called with no receiver. In a non-strict CommonJS file <code>this</code> falls back to the global object, which has no <code>name</code> — a silent wrong value, no crash.', 'Hàm được gọi không có đối tượng nhận. Ở tệp CommonJS không strict, this rơi về object toàn cục, không có name — giá trị sai âm thầm, không sập.']),
      q('t3', ['The same two lines in a <b>.mjs</b> file (ES module) print…', 'Cũng hai dòng đó trong tệp .mjs (ES module).'],
        ['TypeError: Cannot read properties of undefined (reading \'name\')', 'Hello from undefined', 'Hello from NotesAPI', 'SyntaxError: this is reserved in modules'],
        ['ES modules are always strict: a call with no receiver has <code>this === undefined</code>, so reading <code>this.name</code> throws. Same bug as t2, but loud.', 'ES module luôn strict: gọi không có đối tượng nhận thì this === undefined, nên đọc this.name ném lỗi. Cùng bug với t2 nhưng ồn ào.']),
      q('t4', ['<code>console.log(detached.bind(service)())</code> prints…', 'detached.bind(service)() in gì?'],
        ['Hello from NotesAPI', 'Hello from undefined', 'TypeError: bind is not a function', 'Hello from [object Object]'],
        ['<code>bind</code> returns a new function whose <code>this</code> is fixed to <code>service</code>, however it is called later.', 'bind trả một hàm mới có this cố định là service, dù sau này gọi thế nào.']),
      q('t5', ['<code>const other = { name: \'Other\', greet: service.greetNormal }; other.greet()</code> prints…', 'Gắn cùng hàm vào object khác rồi gọi.'],
        ['Hello from Other', 'Hello from NotesAPI', 'Hello from undefined', 'TypeError'],
        ['<code>this</code> is decided by the call, not by where the function was written: <code>other.greet()</code> ⇒ <code>this = other</code>.', 'this do lời gọi quyết định, không do chỗ viết hàm: other.greet() ⇒ this = other.']),
      q('t6', ['Which is the lesson\'s <b>first</b> choice for passing a controller method to <code>app.get(\'/notes\', …)</code>?', 'Cách ưu tiên SỐ MỘT của bài khi truyền phương thức controller vào app.get.'],
        ['Do not use this at all: export plain functions', 'controller.list.bind(controller)', '(req, res) => controller.list(req, res)', 'Turn list into an arrow function inside the object literal'],
        ['The lesson ranks the fixes: (1) avoid <code>this</code> — plain exported functions plus closures cannot be unbound; (2) <code>bind</code>; (3) a wrapper arrow. An arrow written in the object literal would not see the object at all (see t1).', 'Bài xếp hạng: (1) tránh this — hàm export thường + closure không thể mất ràng buộc; (2) bind; (3) arrow bọc. Arrow viết ngay trong object literal không thấy object (xem t1).']),
    ],
    goiY: [
      ['Regular function: look at what is to the LEFT of the dot at the moment of the call. No dot ⇒ no receiver.', 'Hàm thường: nhìn cái đứng BÊN TRÁI dấu chấm lúc gọi. Không có dấu chấm ⇒ không có đối tượng nhận.'],
      ['Arrow: ignore the call completely; look at where it was written.', 'Arrow: bỏ qua lời gọi; nhìn chỗ nó được viết.'],
    ],
    loi: [
      ['Assuming an arrow inside an object literal sees the object — it sees the surrounding file scope.', 'Tưởng arrow trong object literal thấy object — nó thấy phạm vi tệp xung quanh.'],
      ['Thinking a detached method "remembers" its object: <code>app.get(\'/notes\', controller.list)</code> loses <code>this</code>.', 'Nghĩ phương thức bị tách "nhớ" object: app.get(\'/notes\', controller.list) mất this.'],
    ],
    tns: TN,
  }),

  jsBai({
    ten: 'Lost this: register controller methods without breaking them',
    kho: 'MEDIUM', phut: 12,
    en: `<p>The Notes controller below uses <code>this.repo</code>. The starter registers it the way the lesson warns against — <code>app.get('/notes', controller.list)</code> — so when the router later calls the handler, <code>this</code> is lost and every request crashes with <code>TypeError: Cannot read properties of undefined (reading 'all')</code>.</p>${pre("const controller = {\n  repo: { all: () => [{ id: 1, title: 'Buy milk' }], one: (id) => …, },\n  list(req, res) { res.json(this.repo.all()); },\n  get(req, res)  { res.json(this.repo.one(Number(req.params.id))); },\n};")}<p>Fix <code>registerRoutes(app, controller)</code> so both routes work. <code>app.get(path, handler)</code> just stores the handler; the router calls it later as <code>handler(req, res)</code> — with no receiver. Do not change the controller.</p>`,
    vi: `<p>Controller dùng this.repo. Code khởi đầu đăng ký kiểu bài học cảnh báo — app.get('/notes', controller.list) — nên khi router gọi handler sau đó, this bị mất và mọi request sập TypeError. Sửa registerRoutes(app, controller) để cả hai route chạy. app.get chỉ lưu handler; router gọi handler(req, res) — không có đối tượng nhận. Không sửa controller.</p>`,
    yc: [
      ['Register <code>GET /notes</code> ⇒ <code>controller.list</code> and <code>GET /notes/:id</code> ⇒ <code>controller.get</code>.', 'Đăng ký GET /notes ⇒ controller.list và GET /notes/:id ⇒ controller.get.'],
      ['When the stored handler is called as <code>handler(req, res)</code>, <code>this</code> inside the method must be the controller.', 'Khi handler đã lưu được gọi handler(req, res), this trong phương thức phải là controller.'],
      ['Pass <code>req</code> and <code>res</code> through unchanged.', 'Chuyển nguyên req và res.'],
    ],
    goiY: [
      ['Option 2 of the lesson: <code>controller.list.bind(controller)</code>.', 'Cách 2 của bài: controller.list.bind(controller).'],
      ['Option 3: wrap it — <code>(req, res) =&gt; controller.list(req, res)</code>. Now the call has a dot again.', 'Cách 3: bọc lại — (req, res) => controller.list(req, res). Lời gọi lại có dấu chấm.'],
    ],
    loi: [
      ['Writing <code>app.get(\'/notes\', controller.list())</code> — that CALLS the method immediately (with no req/res) and registers its return value.', 'Viết app.get(\'/notes\', controller.list()) — GỌI phương thức ngay (không req/res) và đăng ký giá trị trả về.'],
      ['A wrapper that forgets to pass <code>req</code>/<code>res</code>: <code>() =&gt; controller.get()</code> ⇒ <code>req</code> is undefined inside.', 'Bọc mà quên truyền req/res: () => controller.get() ⇒ bên trong req là undefined.'],
    ],
    gt: ['<code>controller.list</code> is just a function value; the object is not attached to it. Whoever calls it decides <code>this</code>, and the router calls it bare. <code>bind</code> creates a new function with <code>this</code> fixed, and the wrapper arrow restores the dot (<code>controller.list(req, res)</code>) at call time. Both work; the lesson\'s preferred long-term fix is not to rely on <code>this</code> in handlers at all.',
      'controller.list chỉ là một giá trị hàm; object không dính theo. Ai gọi thì người đó quyết định this, và router gọi trần. bind tạo hàm mới có this cố định, còn arrow bọc khôi phục dấu chấm (controller.list(req, res)) lúc gọi. Cả hai đều đúng; cách bài học khuyên lâu dài là đừng dựa vào this trong handler.'],
    kn: ['this binding', 'bind', 'callbacks'],
    tns: TN,
    viDu: [{ input: "registerRoutes(app, controller); app.routes['GET /notes'](req, res)", output: 'res.json([{ id: 1, title: "Buy milk" }])', explanation: 'The starter throws TypeError instead.|||Code khởi đầu ném TypeError.' }],
    chung: `${RES_GIA}
const mkApp = () => { const routes = {}; return { routes, get: (p, h) => { routes['GET ' + p] = h; } }; };
const mkController = (rows) => ({
  repo: { all: () => rows, one: (id) => rows.find((r) => r.id === id) || null },
  list(req, res) { res.json(this.repo.all()); },
  get(req, res) { res.json(this.repo.one(Number(req.params.id))); },
});`,
    dau: `// app.get(path, handler) stores the handler; the router calls handler(req, res) later.
function registerRoutes(app, controller) {
  app.get('/notes', controller.list);
  app.get('/notes/:id', controller.get);
}
`,
    giai: `// app.get(path, handler) stores the handler; the router calls handler(req, res)
// later WITHOUT a receiver, so a bare method would lose "this".
function registerRoutes(app, controller) {
  // bind returns a new function whose "this" is always the controller
  app.get('/notes', controller.list.bind(controller));
  // a wrapper arrow works too: it puts the dot back at call time
  app.get('/notes/:id', (req, res) => controller.get(req, res));
}
`,
    cases: [
      { moTa: ['GET /notes answers with every note', 'GET /notes trả mọi ghi chú'], chuanBi: "const app = mkApp(); registerRoutes(app, mkController([{ id: 1, title: 'Buy milk' }])); const res = mkRes(); app.routes['GET /notes']({}, res);", goi: 'res.body' },
      { moTa: ['GET /notes/:id reads req.params.id', 'GET /notes/:id đọc req.params.id'], chuanBi: "const app = mkApp(); registerRoutes(app, mkController([{ id: 1, title: 'A' }, { id: 2, title: 'B' }])); const res = mkRes(); app.routes['GET /notes/:id']({ params: { id: '2' } }, res);", goi: 'res.body' },
      { moTa: ['both routes are registered', 'cả hai route được đăng ký'], chuanBi: 'const app = mkApp(); registerRoutes(app, mkController([]));', goi: 'Object.keys(app.routes).sort()' },
      { an: true, chuanBi: "const c = mkController([{ id: 7, title: 'x' }]); const app = mkApp(); registerRoutes(app, c); c.repo = { all: () => ['swapped'], one: () => 'one' }; const r1 = mkRes(), r2 = mkRes(); app.routes['GET /notes']({}, r1); app.routes['GET /notes/:id']({ params: { id: '7' } }, r2);", goi: '[r1.body, r2.body]' },
    ],
  }),

  jsBai({
    ten: 'createRateLimiter: private counters with a time window',
    kho: 'HARD', phut: 20,
    en: `<p>The lesson opens with "closures explain … rate limiters". Build one. <code>createRateLimiter(limit, windowMs)</code> returns <code>allow(userId)</code>:</p>
<ul><li>A user may make <code>limit</code> calls per window. <code>allow</code> returns <code>true</code> for each allowed call and <code>false</code> once the user is over the limit.</li>
<li>A user's window starts at their first call (<code>Date.now()</code>) and lasts <code>windowMs</code>. When <code>Date.now() - windowStart &gt;= windowMs</code>, the user starts a new window with a fresh count.</li>
<li>Users are counted separately, and two limiters never share counts — the state lives in the closure, not in the file.</li></ul>${pre("const allow = createRateLimiter(2, 1000);\nallow('u1'); allow('u1'); allow('u1');   // true, true, false\nallow('u2');                               // true  (own count)\n// ...1000 ms later...\nallow('u1');                               // true  (new window)")}<p>In the grader <code>Date.now()</code> reads a virtual clock that moves forward when tests wait with <code>setTimeout</code>.</p>`,
    vi: `<p>Bài học mở đầu bằng "closure giải thích … rate limiter". Hãy làm một cái. createRateLimiter(limit, windowMs) trả allow(userId): mỗi user được limit lần mỗi cửa sổ; cửa sổ của user bắt đầu từ lần gọi đầu (Date.now()) và kéo dài windowMs; hết cửa sổ thì đếm lại. User đếm riêng, hai limiter không dùng chung số đếm — trạng thái nằm trong closure, không ở tệp. Trong máy chấm Date.now() đọc đồng hồ ảo, chạy tới khi kiểm chờ bằng setTimeout.</p>`,
    yc: [
      ['<code>true</code> for the first <code>limit</code> calls of a window, then <code>false</code>.', 'true cho limit lần đầu của một cửa sổ, sau đó false.'],
      ['A new window begins when <code>Date.now() - start &gt;= windowMs</code>.', 'Cửa sổ mới bắt đầu khi Date.now() - start >= windowMs.'],
      ['Per-user counts; independent limiters; no global state.', 'Đếm theo user; limiter độc lập; không trạng thái toàn cục.'],
    ],
    goiY: [
      ['Inside the factory: <code>const hits = new Map();</code> mapping userId → <code>{ start, count }</code>.', 'Trong factory: const hits = new Map(); userId → { start, count }.'],
      ['In <code>allow</code>: read the entry; if missing or expired, replace it with <code>{ start: now, count: 0 }</code>; then compare count with limit.', 'Trong allow: đọc mục; thiếu hoặc hết hạn thì thay bằng { start: now, count: 0 }; rồi so count với limit.'],
      ['Only increase the count when you return <code>true</code> — refused calls should not extend the punishment.', 'Chỉ tăng count khi trả true — lần bị từ chối không nên kéo dài hình phạt.'],
    ],
    loi: [
      ['A top-level <code>Map</code>: two limiters (say login and upload) then share counters — the starter\'s bug.', 'Map ở cấp tệp: hai limiter (đăng nhập và upload) dùng chung bộ đếm — bug của code khởi đầu.'],
      ['Never resetting: a user who was limited once stays blocked forever.', 'Không bao giờ đặt lại: user bị chặn một lần thì bị chặn mãi.'],
      ['Using <code>&gt;</code> instead of <code>&gt;=</code> for the window end — exactly at <code>windowMs</code> the user should already be in a new window.', 'Dùng > thay vì >= ở biên cửa sổ — đúng windowMs user phải đã sang cửa sổ mới.'],
    ],
    gt: ['The factory call creates one <code>Map</code> that only the returned <code>allow</code> can reach — private state per limiter, exactly like <code>createCounter</code>. Each entry remembers when the user\'s window started; comparing with <code>Date.now()</code> on every call decides whether to start over. This is a fixed-window limiter. Lesson 2.5 adds the catch: in a cluster each process has its own Map, which is why production keeps these counters in Redis.',
      'Lần gọi factory tạo một Map mà chỉ allow trả về với tới — trạng thái riêng cho mỗi limiter, y như createCounter. Mỗi mục nhớ cửa sổ của user bắt đầu lúc nào; so với Date.now() mỗi lần gọi để quyết định có đếm lại không. Đây là limiter cửa sổ cố định. Bài 2.5 thêm điểm vướng: trong cluster mỗi process có Map riêng, nên production để bộ đếm ở Redis.'],
    kn: ['closures', 'Map', 'rate limiting', 'Date.now()'],
    tns: [...TN, tn('fixed window', 'cửa sổ cố định', 'Count requests in a time slot that starts at the first request and resets after windowMs.')],
    viDu: [{ input: "const allow = createRateLimiter(2, 1000); [allow('u1'), allow('u1'), allow('u1'), allow('u2')]", output: '[true,true,false,true]', explanation: 'u2 has its own count.|||u2 có số đếm riêng.' }],
    chung: 'const sleep = (ms) => new Promise((r) => setTimeout(r, ms));',
    dau: `const hits = new Map(); // userId -> number of calls

function createRateLimiter(limit, windowMs) {
  return function allow(userId) {
    const n = hits.get(userId) || 0;
    if (n >= limit) return false;
    hits.set(userId, n + 1);
    return true;
  };
}
`,
    giai: `// Fixed-window rate limiter. All state lives in the closure of ONE factory
// call, so two limiters (login, upload...) never share counters.
function createRateLimiter(limit, windowMs) {
  const hits = new Map(); // userId -> { start, count }  (private)

  return function allow(userId) {
    const now = Date.now();
    let entry = hits.get(userId);
    // first call, or the old window is over -> start a fresh window
    if (!entry || now - entry.start >= windowMs) {
      entry = { start: now, count: 0 };
      hits.set(userId, entry);
    }
    if (entry.count >= limit) return false; // over the limit: refuse, do not count
    entry.count += 1;
    return true;
  };
}
`,
    cases: [
      { moTa: ['limit 2: true, true, false; another user has its own count', 'limit 2: true, true, false; user khác đếm riêng'], goi: "(() => { const allow = createRateLimiter(2, 1000); return [allow('u1'), allow('u1'), allow('u1'), allow('u2')]; })()" },
      { moTa: ['a new window after windowMs', 'cửa sổ mới sau windowMs'], chuanBi: "const allow = createRateLimiter(1, 1000); const a = [allow('u1'), allow('u1')]; await sleep(1000); a.push(allow('u1'), allow('u1'));", goi: 'a' },
      { moTa: ['two limiters do not share counts', 'hai limiter không dùng chung'], goi: "(() => { const login = createRateLimiter(1, 60000); const upload = createRateLimiter(1, 60000); return [login('u1'), upload('u1'), login('u1')]; })()" },
      { an: true, chuanBi: "const allow = createRateLimiter(3, 500); const out = []; for (let i = 0; i < 5; i++) out.push(allow('a')); await sleep(499); out.push(allow('a')); await sleep(1); out.push(allow('a'), allow('a'), allow('a'), allow('a'));", goi: 'out' },
      { an: true, chuanBi: "const allow = createRateLimiter(2, 1000); allow('x'); await sleep(600); const b = [allow('x'), allow('x')]; await sleep(400); b.push(allow('x'));", goi: 'b' },
    ],
  }),
]);
