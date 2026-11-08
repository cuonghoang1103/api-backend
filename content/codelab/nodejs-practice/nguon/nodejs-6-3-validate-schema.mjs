/** Node.js 6.3 — Kiểm dữ liệu bằng lược đồ: safeParse báo mọi lỗi, ép kiểu query + chặn trần, chặn mass assignment, middleware validate ghi req.valid. */
import { modul, cs, q, tn, jsBai, RES, APP_ERROR } from './_node-c6-8.mjs';

/* ── 1. Trắc nghiệm ── */
const E1 = cs({
  ten: '6.3 · 1 — What a schema really does at the edge', kho: 'EASY', phut: 8,
  en: 'Lesson 6.3 replaces the wall of <code>if</code>s with a zod schema at the router. Six questions on what the schema does for you — and the one thing it cannot do.',
  vi: 'Bài 6.3 thay bức tường <code>if</code> bằng một lược đồ zod ở router. Sáu câu hỏi về những gì lược đồ làm giúp bạn — và một điều nó không làm được.',
  cau: [
    q('c1', ['Why does the lesson’s route use <code>safeParse</code> instead of <code>parse</code>?', 'Vì sao route của bài dùng <code>safeParse</code> thay vì <code>parse</code>?'],
      ['It returns { success, data | error } instead of throwing, so the branch stays in the route', 'parse runs asynchronously and would block the event loop while it waits', 'safeParse also escapes HTML, so its output is always safe to render', 'parse only reports the first field, while safeParse reports all of them'],
      ['Both report every issue; throwing from parse into the 5.4 handler also works. safeParse keeps the branch in the route. A form that reveals its errors one per submit is a form users abandon.', 'Cả hai đều báo mọi lỗi; ném từ parse sang bộ xử lý của 5.4 cũng được. safeParse giữ nhánh ngay trong route. Form lộ lỗi từng cái một là form người dùng bỏ đi.']),
    q('c2', ['A client sends <code>{"title":"hi","isAdmin":true,"authorId":1}</code> to a route that does <code>CreateNote.safeParse(req.body)</code>. What is in <code>parsed.data</code>?', 'Client gửi <code>{"title":"hi","isAdmin":true,"authorId":1}</code> tới route làm <code>CreateNote.safeParse(req.body)</code>. <code>parsed.data</code> chứa gì?'],
      ['Only the declared fields (title plus the defaults) — z.object() strips unknown keys by default', 'Everything the client sent, because zod only checks the declared fields', 'Nothing — unknown keys make safeParse fail', 'title, isAdmin and authorId, with isAdmin converted to a string'],
      ['That is why spreading parsed.data is safe and spreading req.body is mass assignment.', 'Vì thế rải parsed.data là an toàn còn rải req.body là mass assignment.']),
    q('c3', ['In Express 5 a middleware writes <code>req.query = parsed.data</code>. What happens?', 'Trong Express 5 một middleware viết <code>req.query = parsed.data</code>. Chuyện gì xảy ra?'],
      ['It throws or silently does nothing', 'It works exactly as in Express 4', 'Express copies the value into req.params', 'It deletes the query string from the URL'],
      ['Another v4 snippet that stops working when you upgrade.', 'Thêm một đoạn code thời v4 ngừng chạy khi nâng cấp.']),
    q('c4', ['Why is <code>.max(50)</code> on <code>limit</code> called “a load-bearing character”?', 'Vì sao <code>.max(50)</code> trên <code>limit</code> được gọi là "ký tự chịu lực"?'],
      ['Without it, ?limit=1000000 loads a million rows and stalls the event loop', 'zod rejects every number above 50 unless you configure a bigger maximum', 'PostgreSQL cannot return more than 50 rows from a single SELECT query', 'Browsers truncate any JSON array that is longer than 50 elements'],
      ['Reject when the client should learn; clamp (Math.min(50, limit)) when the client is a browser you also wrote. Just do one of the two.', 'Từ chối khi client cần học; kẹp (Math.min(50, limit)) khi client là trình duyệt do bạn viết. Chỉ cần làm một trong hai.']),
    q('c5', ['Two requests register the same email at the same instant. Both pass the schema. What stops the duplicate?', 'Hai request đăng ký cùng email ở cùng khoảnh khắc. Cả hai qua lược đồ. Cái gì chặn bản trùng?'],
      ['The unique index in the database', 'z.string().email() rejects the second one', '.strict() on the object', 'safeParse locks the email until the first request finishes'],
      ['“Not a replacement for DB constraints” — chapter 7 needs both.', '"Không thay được ràng buộc CSDL" — chương 7 cần cả hai.']),
    q('c6', ['<code>{"titel":"x"}</code> (a typo) is validated as “title missing”. Which option turns the typo itself into a loud error?', '<code>{"titel":"x"}</code> (gõ nhầm) được báo là "thiếu title". Tuỳ chọn nào biến chính lỗi gõ nhầm thành lỗi rõ ràng?'],
      ['.strict()', '.default() on title', 'z.coerce.string()', '.optional() on every field'],
      ['Right for an internal API where a typo should fail loudly instead of being dropped.', 'Hợp với API nội bộ, nơi gõ nhầm nên báo lỗi to thay vì bị bỏ lặng lẽ.']),
  ],
  goiY: [['Think about what reaches the service: parsed.data, never req.body.', 'Nghĩ xem cái gì tới được service: parsed.data, không bao giờ là req.body.'], ['Separate “is this value well-formed?” (schema) from “does it collide with the world?” (database).', 'Tách "giá trị có đúng dạng?" (lược đồ) khỏi "nó có va chạm với thế giới?" (CSDL).']],
  loi: [['Believing validation makes a unique index unnecessary.', 'Tin rằng kiểm dữ liệu làm chỉ mục unique thành thừa.'], ['Writing the parsed query back onto req.query in Express 5.', 'Ghi query đã kiểm ngược lại vào req.query trong Express 5.']],
  tns: [tn('safeParse', 'safeParse', 'Trả {success, data|error}, không ném.'), tn('mass assignment', 'gán hàng loạt', 'Client đặt những trường bạn không định mở.'), tn('strip', 'lược bỏ', 'Bỏ khoá lạ khỏi kết quả.')],
  kn: ['validation', 'zod'],
});

/* ── 2. issues ⇒ fields[] ── */
function toFieldErrors(issues) {
  // zod gives path as an ARRAY (['tags', 2]); the client wants one string per field: 'tags.2'
  return issues.map((i) => ({ path: i.path.map(String).join('.'), message: i.message }));
}
function validationBody(issues, code = 'VALIDATION_FAILED') {
  // one envelope, every bad field listed — a form can highlight all of them from one response
  return { error: { code, message: 'The submitted data is not valid', fields: toFieldErrors(issues) } };
}
const E2 = jsBai({
  ten: '6.3 · 2 — Write toFieldErrors(issues) and validationBody(issues): the 422 the lesson prints', kho: 'EASY', phut: 8,
  en: `<p>zod reports problems as <code>error.issues</code>: <code>[{ path: ['title'], message: 'title must not be empty', code: 'too_small' }, { path: ['tags', 2], message: '…' }]</code>. The client needs one string per field. Write:</p>
<ul><li><code>toFieldErrors(issues)</code> ⇒ <code>[{ path, message }]</code>, same order, where <code>path</code> is the path parts joined with <code>"."</code> (numbers included: <code>['tags', 2]</code> ⇒ <code>"tags.2"</code>; an empty path ⇒ <code>""</code>). Drop every other key of the issue.</li>
<li><code>validationBody(issues, code = 'VALIDATION_FAILED')</code> ⇒ <code>{ error: { code, message: "The submitted data is not valid", fields: toFieldErrors(issues) } }</code> — exactly the body of lesson 6.3’s real output.</li></ul>`,
  vi: `<p>zod báo lỗi qua <code>error.issues</code>: <code>[{ path: ['title'], message: 'title must not be empty', code: 'too_small' }, { path: ['tags', 2], message: '…' }]</code>. Client cần một chuỗi cho mỗi trường. Viết:</p>
<ul><li><code>toFieldErrors(issues)</code> ⇒ <code>[{ path, message }]</code>, giữ thứ tự, với <code>path</code> là các phần của đường dẫn nối bằng <code>"."</code> (kể cả số: <code>['tags', 2]</code> ⇒ <code>"tags.2"</code>; đường dẫn rỗng ⇒ <code>""</code>). Bỏ mọi khoá khác của issue.</li>
<li><code>validationBody(issues, code = 'VALIDATION_FAILED')</code> ⇒ <code>{ error: { code, message: "The submitted data is not valid", fields: toFieldErrors(issues) } }</code> — đúng body trong output thật của bài 6.3.</li></ul>`,
  yc: [['Keep the order of the issues.', 'Giữ thứ tự các issue.'], ['Only <code>path</code> and <code>message</code> in each entry.', 'Mỗi mục chỉ có <code>path</code> và <code>message</code>.']],
  goiY: [['<code>issues.map(i => ({ path: …, message: i.message }))</code>.', '<code>issues.map(i => ({ path: …, message: i.message }))</code>.'], ['<code>[].join(".")</code> is <code>""</code>, and <code>["tags", 2].join(".")</code> is already <code>"tags.2"</code>.', '<code>[].join(".")</code> là <code>""</code>, còn <code>["tags", 2].join(".")</code> đã là <code>"tags.2"</code>.']],
  loi: [['Returning only the first issue — one error per submit.', 'Chỉ trả issue đầu tiên — mỗi lần gửi một lỗi.'], ['Sending zod’s raw issues (with <code>code</code>, <code>origin</code>, <code>maximum</code>…) as the public contract.', 'Gửi nguyên issue của zod (có <code>code</code>, <code>origin</code>, <code>maximum</code>…) làm hợp đồng công khai.'], ['Joining every message into one string, so the form cannot attach errors to inputs.', 'Nối mọi thông điệp thành một chuỗi, nên form không gắn được lỗi vào từng ô.']],
  gt: ['A path plus a message per field is the smallest shape that lets a form put each error under its own input. It is also a stable contract: zod’s internal issue format can change between versions; your fields[] does not.', 'Một đường dẫn và một thông điệp cho mỗi trường là hình dạng nhỏ nhất để form đặt mỗi lỗi dưới ô của nó. Nó cũng là hợp đồng ổn định: định dạng issue nội bộ của zod có thể đổi giữa các phiên bản; fields[] của bạn thì không.'],
  kn: ['validation errors'],
  tns: [tn('issue', 'vấn đề', 'Một lỗi do lược đồ phát hiện.'), tn('field error', 'lỗi trường', '{ path, message }')],
  dau: `function toFieldErrors(issues) {
  // Write your solution here
  return [{ path: issues[0].path[0], message: issues[0].message }];
}
function validationBody(issues, code = 'VALIDATION_FAILED') {
  return { error: { code, message: issues.map((i) => i.message).join('; ') } };
}
`,
  giai: [toFieldErrors, validationBody],
  cases: [
    { goi: `validationBody([{ path: ['title'], message: 'title must not be empty', code: 'too_small' }, { path: ['tags'], message: 'Too big: expected array to have <=5 items', code: 'too_big' }, { path: ['pinned'], message: 'Invalid input: expected boolean, received string', code: 'invalid_type' }])`, moTa: ['The three issues of the lesson’s request', 'Ba lỗi trong request của bài'] },
    { goi: `toFieldErrors([{ path: ['tags', 2], message: 'Invalid input: expected string, received number', code: 'invalid_type', expected: 'string' }])` },
    { goi: `validationBody([{ path: ['limit'], message: 'Too big: expected number to be <=50' }, { path: ['sort'], message: 'Invalid option: expected one of "createdAt"|"title"' }], 'INVALID_QUERY')`, an: true },
    { goi: `[toFieldErrors([]), toFieldErrors([{ path: [], message: 'Invalid input: expected object, received null' }])]`, an: true },
    { goi: `toFieldErrors([{ path: ['author', 'address', 'city'], message: 'Required' }, { path: ['a'], message: 'x' }])`, an: true },
  ],
});

/* ── 3. CreateNote viết tay — đúng luật + đúng thông điệp của zod 4 ── */
function kindOf(v) {
  if (v === null) return 'null';
  if (Array.isArray(v)) return 'array';
  if (typeof v === 'number' && Number.isNaN(v)) return 'NaN';
  return typeof v;
}
function parseCreateNote(input) {
  const issues = [];
  const bad = (path, message) => issues.push({ path, message });
  const expected = (path, type, v) => bad(path, 'Invalid input: expected ' + type + ', received ' + kindOf(v));
  if (kindOf(input) !== 'object') return { success: false, issues: [{ path: [], message: 'Invalid input: expected object, received ' + kindOf(input) }] };
  const data = {};
  // title: z.string().min(1, 'title must not be empty').max(200)
  if (typeof input.title !== 'string') expected(['title'], 'string', input.title);
  else if (input.title.length < 1) bad(['title'], 'title must not be empty');
  else if (input.title.length > 200) bad(['title'], 'Too big: expected string to have <=200 characters');
  else data.title = input.title;
  // body: z.string().max(10_000).default('')
  if (input.body === undefined) data.body = '';
  else if (typeof input.body !== 'string') expected(['body'], 'string', input.body);
  else if (input.body.length > 10000) bad(['body'], 'Too big: expected string to have <=10000 characters');
  else data.body = input.body;
  // tags: z.array(z.string()).max(5).optional()
  if (input.tags !== undefined) {
    if (!Array.isArray(input.tags)) expected(['tags'], 'array', input.tags);
    else {
      input.tags.forEach((t, i) => { if (typeof t !== 'string') expected(['tags', i], 'string', t); });
      if (input.tags.length > 5) bad(['tags'], 'Too big: expected array to have <=5 items');
      data.tags = input.tags;
    }
  }
  // pinned: z.boolean().default(false)
  if (input.pinned === undefined) data.pinned = false;
  else if (typeof input.pinned !== 'boolean') expected(['pinned'], 'boolean', input.pinned);
  else data.pinned = input.pinned;
  // unknown keys (isAdmin, authorId, createdAt…) are simply never copied into data: that is the strip
  return issues.length ? { success: false, issues } : { success: true, data };
}
const E3 = jsBai({
  ten: '6.3 · 3 — Write parseCreateNote(input): the CreateNote schema by hand, with zod’s exact messages', kho: 'MEDIUM', phut: 25,
  en: `<p>To see what a schema buys you, implement the lesson’s schema without a library:</p>
<pre>const CreateNote = z.object({
  title:  z.string().min(1, 'title must not be empty').max(200),
  body:   z.string().max(10_000).default(''),
  tags:   z.array(z.string()).max(5).optional(),
  pinned: z.boolean().default(false),
});</pre>
<p><code>parseCreateNote(input)</code> returns <code>{ success: true, data }</code> or <code>{ success: false, issues: [{ path: [...], message }] }</code> listing <b>every</b> problem in field order title → body → tags → pinned. Messages (zod 4.4.3), where <i>&lt;kind&gt;</i> is <code>null</code>, <code>array</code>, <code>NaN</code> or the <code>typeof</code>:</p>
<ul><li>wrong type: <code>"Invalid input: expected string, received &lt;kind&gt;"</code> (also <code>array</code>, <code>boolean</code>); a missing title is <code>received undefined</code>; a non-object input ⇒ one issue with path <code>[]</code> and <code>"Invalid input: expected object, received &lt;kind&gt;"</code>.</li>
<li><code>title</code> empty ⇒ <code>"title must not be empty"</code>; longer than 200 ⇒ <code>"Too big: expected string to have &lt;=200 characters"</code>; <code>body</code> longer than 10000 ⇒ <code>"Too big: expected string to have &lt;=10000 characters"</code>.</li>
<li><code>tags</code>: each non-string element ⇒ path <code>['tags', i]</code>; then, if more than 5 ⇒ <code>"Too big: expected array to have &lt;=5 items"</code> on path <code>['tags']</code>.</li>
<li>Defaults: missing <code>body</code> ⇒ <code>""</code>, missing <code>pinned</code> ⇒ <code>false</code>; missing <code>tags</code> stays absent. <b>Unknown keys are stripped</b> from <code>data</code>.</li></ul>`,
  vi: `<p>Để thấy lược đồ mang lại gì, hãy cài lược đồ của bài mà không dùng thư viện (xem khối code ở bản tiếng Anh). <code>parseCreateNote(input)</code> trả <code>{ success: true, data }</code> hoặc <code>{ success: false, issues: [{ path: [...], message }] }</code> liệt kê <b>mọi</b> lỗi theo thứ tự trường title → body → tags → pinned. Thông điệp (zod 4.4.3), với <i>&lt;kind&gt;</i> là <code>null</code>, <code>array</code>, <code>NaN</code> hoặc <code>typeof</code>:</p>
<ul><li>sai kiểu: <code>"Invalid input: expected string, received &lt;kind&gt;"</code> (tương tự <code>array</code>, <code>boolean</code>); thiếu title là <code>received undefined</code>; input không phải object ⇒ một issue với path <code>[]</code> và <code>"Invalid input: expected object, received &lt;kind&gt;"</code>.</li>
<li><code>title</code> rỗng ⇒ <code>"title must not be empty"</code>; dài hơn 200 ⇒ <code>"Too big: expected string to have &lt;=200 characters"</code>; <code>body</code> dài hơn 10000 ⇒ <code>"Too big: expected string to have &lt;=10000 characters"</code>.</li>
<li><code>tags</code>: mỗi phần tử không phải chuỗi ⇒ path <code>['tags', i]</code>; sau đó, nếu nhiều hơn 5 ⇒ <code>"Too big: expected array to have &lt;=5 items"</code> ở path <code>['tags']</code>.</li>
<li>Mặc định: thiếu <code>body</code> ⇒ <code>""</code>, thiếu <code>pinned</code> ⇒ <code>false</code>; thiếu <code>tags</code> thì vẫn vắng. <b>Khoá lạ bị lược bỏ</b> khỏi <code>data</code>.</li></ul>`,
  yc: [['Collect every issue — never stop at the first.', 'Gom mọi lỗi — không dừng ở lỗi đầu.'], ['<code>data</code> contains only title, body, pinned (and tags when sent).', '<code>data</code> chỉ có title, body, pinned (và tags khi được gửi).'], ['Messages must match exactly — the frontend of lesson 6.3 shows them.', 'Thông điệp phải khớp từng chữ — frontend của bài 6.3 hiển thị chúng.']],
  goiY: [['Write a tiny <code>kindOf(v)</code>: <code>null</code> → "null", arrays → "array", NaN → "NaN", else <code>typeof v</code>.', 'Viết một <code>kindOf(v)</code> nhỏ: <code>null</code> → "null", mảng → "array", NaN → "NaN", còn lại <code>typeof v</code>.'], ['Build <code>data</code> field by field from the checks that passed — never start from <code>{ ...input }</code>; that is exactly how mass assignment gets in.', 'Dựng <code>data</code> từng trường từ những phép kiểm đã qua — đừng bao giờ bắt đầu từ <code>{ ...input }</code>; đó chính là đường mass assignment lọt vào.']],
  loi: [['<code>const data = { ...input }</code> then delete the bad ones: <code>isAdmin</code> and <code>authorId</code> survive.', '<code>const data = { ...input }</code> rồi xoá cái sai: <code>isAdmin</code> và <code>authorId</code> vẫn còn.'], ['<code>if (!input.title)</code> treats a missing title and an empty title the same — two different messages.', '<code>if (!input.title)</code> coi thiếu title và title rỗng là một — hai thông điệp khác nhau.'], ['<code>typeof null === "object"</code>: a null input slips through as an object.', '<code>typeof null === "object"</code>: input null lọt qua như một object.']],
  gt: ['Writing it by hand shows the three jobs one schema does at once: it CHECKS (types, lengths, sizes), it COMPLETES (defaults, so services never write <code>?? ""</code>), and it STRIPS (only declared keys reach the service — mass assignment closed structurally, not by remembering to delete fields). In real code you write the four zod lines; now you know what they are worth.', 'Viết tay cho thấy ba việc một lược đồ làm cùng lúc: KIỂM (kiểu, độ dài, kích thước), BỔ SUNG (giá trị mặc định, nên service không phải viết <code>?? ""</code>), và LƯỢC (chỉ khoá đã khai mới tới service — chặn mass assignment bằng cấu trúc, không phải nhờ nhớ xoá trường). Code thật bạn viết bốn dòng zod; giờ bạn biết chúng đáng giá thế nào.'],
  kn: ['validation', 'mass assignment', 'zod'],
  tns: [tn('default', 'giá trị mặc định', '.default() điền trường vắng.'), tn('strip unknown keys', 'lược khoá lạ', 'Hành vi mặc định của z.object().')],
  dau: `function parseCreateNote(input) {
  // Write your solution here
  if (!input.title) return { success: false, issues: [{ path: ['title'], message: 'title must not be empty' }] };
  return { success: true, data: { ...input } };
}
`,
  giai: [kindOf, parseCreateNote],
  cases: [
    { goi: `parseCreateNote({ title: '', tags: ['a', 'b', 'c', 'd', 'e', 'f'], pinned: 'yes' })`, moTa: ['The lesson’s request with three problems', 'Request của bài với ba lỗi'] },
    { goi: `parseCreateNote({ title: 'A valid note' })`, moTa: ['Defaults fill body and pinned', 'Mặc định điền body và pinned'] },
    { goi: `parseCreateNote({ title: 'hi', isAdmin: true, authorId: 1, createdAt: '2020-01-01' })`, moTa: ['Mass assignment is stripped', 'Mass assignment bị lược'] },
    { goi: `parseCreateNote({ titel: 'x' })`, moTa: ['A typo ⇒ title missing', 'Gõ nhầm ⇒ thiếu title'] },
    { goi: `parseCreateNote({ title: 'x'.repeat(201), body: 42, tags: ['ok', 7, null], pinned: true })`, an: true },
    { goi: `[parseCreateNote(null), parseCreateNote([]), parseCreateNote('{"title":"x"}')]`, an: true },
    { goi: `parseCreateNote({ title: 'T', body: 'b'.repeat(10000), tags: 'work', pinned: false, version: 9 })`, an: true },
    { goi: `parseCreateNote({ title: 'T', body: 'b'.repeat(10001), tags: ['a', 'b', 'c', 'd', 'e'] })`, an: true },
  ],
  saiMau: [
    parseCreateNote.toString().replace('const data = {};', 'const data = { ...input };'),
    kindOf.toString() + '\n' + parseCreateNote.toString().replace("if (input.tags.length > 5) bad(['tags'], 'Too big: expected array to have <=5 items');", ''),
  ],
});

/* ── 4. Query: ép kiểu + mặc định + trần ── */
function parseListQuery(query) {
  const fields = [];
  const data = {};
  // z.coerce.number().int().min(lo).max(hi).default(d): everything in req.query is a STRING
  const num = (key, lo, hi, d) => {
    if (query[key] === undefined) { data[key] = d; return; }
    const n = Number(query[key]);
    if (Number.isNaN(n)) fields.push({ path: key, message: 'Invalid input: expected number, received NaN' });
    else if (!Number.isInteger(n)) fields.push({ path: key, message: 'Invalid input: expected int, received number' });
    else if (n < lo) fields.push({ path: key, message: 'Too small: expected number to be >=' + lo });
    else if (hi !== undefined && n > hi) fields.push({ path: key, message: 'Too big: expected number to be <=' + hi });
    else data[key] = n;
  };
  // z.enum([...]).default(d): an ALLOW-LIST — anything else never reaches the query
  const oneOf = (key, allowed, d) => {
    if (query[key] === undefined) { data[key] = d; return; }
    if (allowed.includes(query[key])) data[key] = query[key];
    else fields.push({ path: key, message: 'Invalid option: expected one of ' + allowed.map((a) => '"' + a + '"').join('|') });
  };
  num('page', 1, undefined, 1);
  num('limit', 1, 50, 10);
  oneOf('sort', ['createdAt', 'title'], 'createdAt');
  oneOf('order', ['asc', 'desc'], 'desc');
  return fields.length ? { success: false, error: { code: 'INVALID_QUERY', fields } } : { success: true, data };
}
const E4 = jsBai({
  ten: '6.3 · 4 — Write parseListQuery(query): strings in, numbers out, limit capped', kho: 'MEDIUM', phut: 18,
  en: `<p>Lesson 5.2: everything in <code>req.query</code> is a string. Lesson 6.3’s schema coerces and clamps in one breath:</p>
<pre>const ListQuery = z.object({
  page:  z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  sort:  z.enum(['createdAt', 'title']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});</pre>
<p>Write <code>parseListQuery(query)</code> (values are strings or absent) returning <code>{ success: true, data: { page, limit, sort, order } }</code> or <code>{ success: false, error: { code: "INVALID_QUERY", fields: [{ path, message }] } }</code> with every bad key in the order page, limit, sort, order. For numbers, check in this order (<code>Number(value)</code> is the coercion):</p>
<ul><li>NaN ⇒ <code>"Invalid input: expected number, received NaN"</code>; not an integer ⇒ <code>"Invalid input: expected int, received number"</code>; below the minimum ⇒ <code>"Too small: expected number to be &gt;=1"</code>; above 50 (limit only) ⇒ <code>"Too big: expected number to be &lt;=50"</code>.</li>
<li>Enums: a value not on the list ⇒ <code>"Invalid option: expected one of "createdAt"|"title""</code> (each option in double quotes, joined by <code>|</code>).</li></ul>
<p>Real output of the lesson: <code>?page=3&amp;limit=25&amp;order=asc</code> ⇒ <code>{ page: 3, limit: 25, sort: "createdAt", order: "asc" }</code> (numbers, not strings).</p>`,
  vi: `<p>Bài 5.2: mọi thứ trong <code>req.query</code> là chuỗi. Lược đồ của bài 6.3 vừa ép kiểu vừa chặn trần (xem khối code bản tiếng Anh). Viết <code>parseListQuery(query)</code> (giá trị là chuỗi hoặc vắng) trả <code>{ success: true, data: { page, limit, sort, order } }</code> hoặc <code>{ success: false, error: { code: "INVALID_QUERY", fields: [{ path, message }] } }</code> với mọi khoá sai theo thứ tự page, limit, sort, order. Với số, kiểm theo thứ tự (<code>Number(value)</code> là phép ép kiểu):</p>
<ul><li>NaN ⇒ <code>"Invalid input: expected number, received NaN"</code>; không phải số nguyên ⇒ <code>"Invalid input: expected int, received number"</code>; nhỏ hơn tối thiểu ⇒ <code>"Too small: expected number to be &gt;=1"</code>; lớn hơn 50 (chỉ limit) ⇒ <code>"Too big: expected number to be &lt;=50"</code>.</li>
<li>Enum: giá trị không nằm trong danh sách ⇒ <code>"Invalid option: expected one of "createdAt"|"title""</code> (mỗi lựa chọn trong ngoặc kép, nối bằng <code>|</code>).</li></ul>
<p>Output thật của bài: <code>?page=3&amp;limit=25&amp;order=asc</code> ⇒ <code>{ page: 3, limit: 25, sort: "createdAt", order: "asc" }</code> (số, không phải chuỗi).</p>`,
  yc: [['Return real numbers for page and limit.', 'Trả số thật cho page và limit.'], ['Reject (do not clamp) a limit above 50.', 'Từ chối (không kẹp) limit lớn hơn 50.'], ['sort/order are allow-lists: no other value may pass.', 'sort/order là danh sách cho phép: không giá trị nào khác được qua.']],
  goiY: [['Write one helper for numeric keys <code>num(key, min, max, default)</code> and one for enums <code>oneOf(key, allowed, default)</code>.', 'Viết một hàm cho khoá số <code>num(key, min, max, default)</code> và một cho enum <code>oneOf(key, allowed, default)</code>.'], ['<code>Number("2.5")</code> is 2.5 ⇒ “expected int”; <code>Number("abc")</code> is NaN; <code>Number("")</code> is 0 ⇒ “Too small”.', '<code>Number("2.5")</code> là 2.5 ⇒ "expected int"; <code>Number("abc")</code> là NaN; <code>Number("")</code> là 0 ⇒ "Too small".']],
  loi: [['<code>parseInt(limit)</code>: "25abc" becomes 25 and "2.5" becomes 2 — garbage accepted silently.', '<code>parseInt(limit)</code>: "25abc" thành 25 và "2.5" thành 2 — rác được nhận lặng lẽ.'], ['No maximum on limit: ?limit=1000000 turns the endpoint into a denial-of-service tool.', 'Không có trần cho limit: ?limit=1000000 biến endpoint thành công cụ tấn công từ chối dịch vụ.'], ['Passing <code>sort</code> straight into ORDER BY — the injection that lesson 6.4 shows.', 'Đưa thẳng <code>sort</code> vào ORDER BY — lỗ chèn mã mà bài 6.4 chỉ ra.']],
  gt: ['Coercion, defaults and limits in one declaration mean the handler receives a value that is complete, typed and bounded. The allow-list on sort is not decoration either: it is the only safe way to let a client choose a column name, because identifiers cannot be bound as SQL parameters.', 'Ép kiểu, mặc định và giới hạn trong một khai báo nghĩa là handler nhận giá trị đầy đủ, đúng kiểu và có biên. Danh sách cho phép trên sort cũng không phải trang trí: đó là cách an toàn duy nhất để client chọn tên cột, vì định danh không truyền được dưới dạng tham số SQL.'],
  kn: ['coercion', 'pagination'],
  tns: [tn('coercion', 'ép kiểu', 'Chuỗi "25" thành số 25.'), tn('allow-list', 'danh sách cho phép', 'Chỉ giá trị đã liệt kê mới được qua.')],
  dau: `function parseListQuery(query) {
  // Write your solution here
  return { success: true, data: { page: query.page || 1, limit: parseInt(query.limit) || 10, sort: query.sort || 'createdAt', order: query.order || 'desc' } };
}
`,
  giai: parseListQuery,
  cases: [
    { goi: `parseListQuery({ page: '3', limit: '25', order: 'asc' })`, moTa: ['?page=3&limit=25&order=asc', '?page=3&limit=25&order=asc'] },
    { goi: `parseListQuery({ limit: '500', sort: 'colour' })`, moTa: ['?limit=500&sort=colour ⇒ two errors', '?limit=500&sort=colour ⇒ hai lỗi'] },
    { goi: `parseListQuery({})`, moTa: ['No query ⇒ all defaults', 'Không có query ⇒ mọi giá trị mặc định'] },
    { goi: `parseListQuery({ page: '2.5', limit: '25abc', sort: 'title', order: 'DESC' })`, an: true },
    { goi: `parseListQuery({ page: '0', limit: '' })`, an: true },
    { goi: `parseListQuery({ page: '100', limit: '50', sort: 'title' })`, an: true },
    { goi: `parseListQuery({ sort: 'createdAt; DROP TABLE "Note"', limit: '-1' })`, an: true },
  ],
  saiMau: [
    parseListQuery.toString().replace("num('limit', 1, 50, 10);", "num('limit', 1, undefined, 10);"),
    parseListQuery.toString().replace('const n = Number(query[key]);', 'const n = parseInt(query[key], 10);'),
  ],
});

/* ── 5. Middleware validate(schemas) — ghi req.valid, không đụng req.query ── */
const validate = (schemas) => (req, res, next) => {
  for (const key of ['body', 'query', 'params']) {
    if (!schemas[key]) continue;                    // only validate the parts this route declared
    const r = schemas[key].safeParse(req[key]);
    if (!r.success) {
      // hand the problem to the error handler of 6.2 — one shape, one place
      const err = new AppError(422, 'VALIDATION_FAILED', 'The submitted data is not valid');
      err.fields = r.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message }));
      return next(err);                             // return: next must run exactly once
    }
    req.valid ??= {};
    req.valid[key] = r.data;                        // NOT req.query = … (a getter in Express 5)
  }
  next();
};
const E5 = jsBai({
  ten: '6.3 · 5 — Write validate(schemas): the middleware that makes every route start clean', kho: 'HARD', phut: 20,
  en: `<p>The same six lines in every route is duplication. Write the lesson’s middleware factory <code>validate(schemas)</code> that returns <code>(req, res, next)</code>. <code>schemas</code> may have <code>body</code>, <code>query</code> and/or <code>params</code>; each has <code>safeParse(value)</code> returning <code>{ success: true, data }</code> or <code>{ success: false, error: { issues: [{ path: [...], message }] } }</code>.</p>
<ul><li>Check the parts in the order <code>body</code>, <code>query</code>, <code>params</code>, skipping the ones without a schema.</li>
<li>On the first failure call <code>next(err)</code> <b>once</b> with <code>err = new AppError(422, 'VALIDATION_FAILED', 'The submitted data is not valid')</code> and <code>err.fields = [{ path: 'a.b', message }]</code>, and stop.</li>
<li>On success store the parsed value in <code>req.valid[key]</code> (create <code>req.valid</code> if needed) and finally call <code>next()</code> with no argument.</li>
<li><b>Never assign <code>req.query</code></b>: in the grader, as in Express 5, it is a getter and assigning it throws.</li></ul>`,
  vi: `<p>Sáu dòng giống nhau trong mọi route là trùng lặp. Viết hàm tạo middleware của bài <code>validate(schemas)</code> trả về <code>(req, res, next)</code>. <code>schemas</code> có thể có <code>body</code>, <code>query</code> và/hoặc <code>params</code>; mỗi cái có <code>safeParse(value)</code> trả <code>{ success: true, data }</code> hoặc <code>{ success: false, error: { issues: [{ path: [...], message }] } }</code>.</p>
<ul><li>Kiểm các phần theo thứ tự <code>body</code>, <code>query</code>, <code>params</code>, bỏ qua phần không có lược đồ.</li>
<li>Lỗi đầu tiên: gọi <code>next(err)</code> <b>một lần</b> với <code>err = new AppError(422, 'VALIDATION_FAILED', 'The submitted data is not valid')</code> và <code>err.fields = [{ path: 'a.b', message }]</code>, rồi dừng.</li>
<li>Thành công: lưu giá trị đã kiểm vào <code>req.valid[key]</code> (tạo <code>req.valid</code> nếu chưa có) và cuối cùng gọi <code>next()</code> không đối số.</li>
<li><b>Không bao giờ gán <code>req.query</code></b>: trong máy chấm, cũng như Express 5, nó là getter và gán sẽ ném lỗi.</li></ul>`,
  yc: [['<code>next</code> is called exactly once per request.', '<code>next</code> được gọi đúng một lần mỗi request.'], ['Write parsed values to <code>req.valid</code> only.', 'Chỉ ghi giá trị đã kiểm vào <code>req.valid</code>.'], ['The error carries <code>status 422</code>, <code>code VALIDATION_FAILED</code> and <code>fields</code>.', 'Lỗi mang <code>status 422</code>, <code>code VALIDATION_FAILED</code> và <code>fields</code>.']],
  goiY: [['Loop over <code>["body", "query", "params"]</code>; <code>if (!schemas[key]) continue;</code>.', 'Lặp qua <code>["body", "query", "params"]</code>; <code>if (!schemas[key]) continue;</code>.'], ['<code>return next(err)</code> inside the loop — the <code>return</code> is what prevents the second <code>next()</code> at the end.', '<code>return next(err)</code> trong vòng lặp — chính <code>return</code> ngăn lần <code>next()</code> thứ hai ở cuối.']],
  loi: [['<code>req.query = r.data</code> — the v4 snippet that throws in Express 5.', '<code>req.query = r.data</code> — đoạn code thời v4 ném lỗi trong Express 5.'], ['<code>next(err)</code> without <code>return</code>: the loop continues and <code>next()</code> runs again — the handler executes after the error was sent.', '<code>next(err)</code> mà không <code>return</code>: vòng lặp chạy tiếp và <code>next()</code> chạy lần nữa — handler vẫn chạy sau khi lỗi đã gửi.'], ['Answering <code>res.status(422)</code> directly in the middleware, bypassing the one error handler that owns the shape.', 'Trả thẳng <code>res.status(422)</code> trong middleware, bỏ qua bộ xử lý lỗi duy nhất quản hình dạng.']],
  gt: ['A middleware turns “every route must remember to validate” into “a route declares its schema”. Routing the failure through <code>next(err)</code> keeps one owner for the error shape (6.2), and <code>req.valid</code> gives handlers a value that is guaranteed clean — while <code>req.query</code> stays the raw, untrusted input it always was.', 'Middleware biến "route nào cũng phải nhớ kiểm" thành "route khai lược đồ của nó". Chuyển lỗi qua <code>next(err)</code> giữ một chủ duy nhất cho hình dạng lỗi (6.2), và <code>req.valid</code> cho handler một giá trị chắc chắn sạch — còn <code>req.query</code> vẫn là dữ liệu thô, không tin được như vốn dĩ.'],
  kn: ['middleware', 'validation', 'Express 5'],
  tns: [tn('middleware factory', 'hàm tạo middleware', 'Hàm nhận cấu hình, trả (req, res, next).'), tn('getter', 'getter', 'Thuộc tính tính lúc đọc; không gán được.')],
  tro: `// provided — the AppError of lesson 5.4\n${APP_ERROR}\n`,
  dau: `const validate = (schemas) => (req, res, next) => {
  // Write your solution here
  for (const key of ['body', 'query', 'params']) {
    if (!schemas[key]) continue;
    const r = schemas[key].safeParse(req[key]);
    if (!r.success) next(new AppError(422, 'VALIDATION_FAILED', 'The submitted data is not valid'));
    req[key] = r.data;
  }
  next();
};
`,
  giai: '// Reference solution\nconst validate = ' + validate.toString() + ';\n',
  chung: RES + `
const S = { // tiny fake schemas with zod's safeParse contract
  note: { safeParse: (v) => (v && typeof v.title === 'string' && v.title ? { success: true, data: { title: v.title, body: v.body ?? '', pinned: false } } : { success: false, error: { issues: [{ path: ['title'], message: 'title must not be empty' }] } }) },
  list: { safeParse: (v) => (v.limit === undefined || Number(v.limit) <= 50 ? { success: true, data: { page: Number(v.page ?? 1), limit: Number(v.limit ?? 10) } } : { success: false, error: { issues: [{ path: ['limit'], message: 'Too big: expected number to be <=50' }] } }) },
  id: { safeParse: (v) => (/^\\d+$/.test(v.id) ? { success: true, data: { id: Number(v.id) } } : { success: false, error: { issues: [{ path: ['id'], message: 'Invalid input: expected int, received NaN' }, { path: ['extra', 0], message: 'x' }] } }) },
};
const reqWith = (o) => { const q = o.query || {}; const r = mkReq({ ...o, query: undefined });
  Object.defineProperty(r, 'query', { get: () => q, set: () => { throw new TypeError('Cannot set property query of #<IncomingMessage> which has only a getter'); } });
  return r; };
const run = (schemas, o) => { const req = reqWith(o); const next = mkNext(); validate(schemas)(req, mkRes(), next);
  return { calls: next.calls.map((e) => (e === undefined ? 'next()' : { status: e.status, code: e.code, fields: e.fields, isAppError: e instanceof AppError })), valid: req.valid ?? null, rawQuery: req.query }; };`,
  cases: [
    { goi: `run({ body: S.note }, { body: { title: 'A valid note', isAdmin: true } })`, moTa: ['Valid body ⇒ req.valid.body, one next()', 'Body hợp lệ ⇒ req.valid.body, một next()'] },
    { goi: `run({ body: S.note }, { body: { title: '' } })`, moTa: ['Invalid body ⇒ next(err) once', 'Body sai ⇒ next(err) một lần'] },
    { goi: `run({ query: S.list }, { query: { page: '3', limit: '25' } })`, moTa: ['Query parsed without touching req.query', 'Query được kiểm mà không đụng req.query'] },
    { goi: `run({ body: S.note, query: S.list, params: S.id }, { body: { title: 'x' }, query: { limit: '500' }, params: { id: '42' } })`, an: true },
    { goi: `run({ params: S.id }, { params: { id: 'abc' } })`, an: true },
    { goi: `run({}, { body: { anything: 1 } })`, an: true },
    { goi: `run({ body: S.note, params: S.id }, { body: { title: 'ok' }, params: { id: '7' }, query: { ignored: '1' } })`, an: true },
  ],
  saiMau: [
    validate.toString().replace('return next(err);', 'next(err);').replace(/^/, 'const validate = '),
    validate.toString().replace('req.valid[key] = r.data;', 'req[key] = r.data;').replace(/^/, 'const validate = '),
  ],
});

export default modul('nodejs-6-3-validate-schema', '6.3 Validation with a schema', [E1, E2, E3, E4, E5]);
