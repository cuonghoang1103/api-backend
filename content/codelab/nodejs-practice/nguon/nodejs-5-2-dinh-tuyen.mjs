/** Node.js 5.2 — Định tuyến: khớp :param và *splat như Express 5, đọc query phòng thủ, Router + mergeParams, và tìm route bị che (lỗi thứ tự). */
import { doiDau, KHOA, cs, q, tn, nodeBai, nguon, goi } from './_node-c3-5.mjs';

const E1 = cs({
  ten: '5.2 · Routes are an ordered list', kho: 'EASY', phut: 7,
  en: 'Questions on the lesson’s live demonstrations. Each output was reproduced on express@5.',
  vi: 'Các câu về những minh hoạ trực tiếp của bài. Mỗi output đã được tái hiện trên express@5.',
  cau: [
    q('c1', ['<code>app.get(\'/notes/:id\', …)</code> is declared before <code>app.get(\'/notes/new\', …)</code>. <code>GET /notes/new</code> answers…', '<code>app.get(\'/notes/:id\', …)</code> được khai trước <code>app.get(\'/notes/new\', …)</code>. <code>GET /notes/new</code> trả về…'],
      ['{"handler":":id","params":{"id":"new"}} — :id matched the word "new"', '{"handler":"new"} — Express prefers literal routes', 'A 500, because Express detects the duplicate route at startup', 'A 404, because two routes match and neither wins'],
      ['First match wins. Express never looks at the second route; nothing warns you. Declare specific routes before parameterised ones.', 'Khớp đầu tiên thắng. Express không bao giờ nhìn tới route thứ hai; không có gì cảnh báo. Khai route cụ thể trước route có tham số.']),
    q('c2', ['For <code>/search?q=node&amp;tags=a&amp;tags=b&amp;page=2</code>, <code>req.query</code> is…', 'Với <code>/search?q=node&amp;tags=a&amp;tags=b&amp;page=2</code>, <code>req.query</code> là…'],
      ['{"q":"node","tags":["a","b"],"page":"2"}', '{"q":"node","tags":"b","page":2}', '{"q":"node","tags":["a","b"],"page":2}', '{"q":"node","tags":"a,b","page":"2"}'],
      ['Everything is a string, and a repeated key becomes an array — so an attacker can flip the type of any field by repeating it.', 'Mọi thứ là chuỗi, và khoá lặp thành mảng — nên kẻ tấn công có thể đổi kiểu của bất kỳ trường nào bằng cách lặp nó.']),
    q('c3', ['On Express 5, <code>app.get(\'/files/*splat\', …)</code> with <code>/files/a/b/c.png</code> gives <code>req.params</code> =', 'Trên Express 5, <code>app.get(\'/files/*splat\', …)</code> với <code>/files/a/b/c.png</code> cho <code>req.params</code> ='],
      ['{"splat":["a","b","c.png"]}', '{"0":"a/b/c.png"}', '{"splat":"a/b/c.png"}', '{"splat":["c.png"]}'],
      ['v5 requires named wildcards and gives an array of segments. The v4 form \'/files/*\' with req.params[0] now throws “Missing parameter name” at startup.', 'v5 bắt buộc wildcard có tên và cho mảng các đoạn. Dạng v4 \'/files/*\' với req.params[0] giờ ném “Missing parameter name” lúc khởi động.']),
    q('c4', ['You copy a v4 snippet <code>app.get(\'/notes/:id?\', …)</code> into an Express 5 app. What happens?', 'Bạn chép đoạn v4 <code>app.get(\'/notes/:id?\', …)</code> vào app Express 5. Chuyện gì xảy ra?'],
      ['It throws at startup (“Unexpected ?”): declare /notes and /notes/:id', 'It works as before: the :id parameter simply becomes optional', 'It starts, but only matches /notes and never matches /notes/42', 'It starts, but every request to that route answers 400 Bad Request'],
      ['Measured with express@5: TypeError Unexpected ? at index 10: /notes/:id?. Declare /notes and /notes/:id separately.', 'Đo với express@5: TypeError Unexpected ? at index 10: /notes/:id?. Khai riêng /notes và /notes/:id.']),
    q('c5', ['A router is mounted with <code>app.use(\'/api/v1/notes\', notesRouter)</code>. Inside its <code>router.get(\'/:id\')</code>, for <code>GET /api/v1/notes/42</code>…', 'Một router được gắn bằng <code>app.use(\'/api/v1/notes\', notesRouter)</code>. Bên trong <code>router.get(\'/:id\')</code> của nó, với <code>GET /api/v1/notes/42</code>…'],
      ['req.url is "/42", req.baseUrl is "/api/v1/notes", req.originalUrl is the full path', 'req.url is the full path; the router repeats its own prefix', 'req.params.id is 42 as a number', 'req.baseUrl is empty because the router does not know where it is mounted'],
      ['Paths inside a router are relative — change the mount path in one place and every route moves. Logs want req.originalUrl.', 'Đường dẫn trong router là tương đối — đổi chỗ gắn ở một nơi là mọi route đi theo. Log nên dùng req.originalUrl.']),
  ],
  goiY: [['Read “ordered list” literally.', 'Hiểu “danh sách có thứ tự” theo nghĩa đen.'], ['A URL has no types.', 'URL không có kiểu.']],
  loi: [['Expecting Express to pick the “most specific” route.', 'Mong Express chọn route “cụ thể nhất”.'], ['Using req.query.page as a number.', 'Dùng req.query.page như một con số.']],
  tns: [tn('path parameter', 'tham số đường dẫn'), tn('wildcard', 'ký tự đại diện'), tn('mount path', 'đường gắn router')],
  kn: ['Express', 'routing'],
});

/* ─── 2. matchPath ─── */
function matchPath(pattern, path) {
  const pat = pattern.split('/').slice(1);                 // "/notes/:id" → ["notes", ":id"]
  if (pat[pat.length - 1] === '') pat.pop();                // "/" → []
  const segs = path.split('/').slice(1);                    // "/notes/42/" → ["notes", "42", ""]
  const last = pat[pat.length - 1];
  const hasSplat = last !== undefined && last.startsWith('*');
  if (!hasSplat && segs[segs.length - 1] === '') segs.pop();  // one trailing slash is allowed (non-strict)
  const params = {};
  for (let i = 0; i < pat.length; i++) {
    const t = pat[i];
    if (t.startsWith('*')) {
      // a named wildcard takes ONE OR MORE remaining segments, as an array
      const rest = segs.slice(i);
      if (rest.join('/') === '') return null;
      params[t.slice(1)] = rest.map((s) => decodeURIComponent(s));
      return params;
    }
    const s = segs[i];
    if (s === undefined || s === '') return null;          // a parameter is never empty
    if (t.startsWith(':')) params[t.slice(1)] = decodeURIComponent(s);   // always a STRING
    else if (t.toLowerCase() !== s.toLowerCase()) return null;           // literals: case-insensitive
  }
  return segs.length === pat.length ? params : null;
}
const E2 = nodeBai({
  ten: '5.2 · Match a path pattern the way Express 5 does', kho: 'MEDIUM', phut: 22,
  en: `<p>Write <code>matchPath(pattern, path)</code> → the <code>req.params</code> object Express 5 would give, or <code>null</code> if the route does not match. Patterns are made of <code>/</code>-separated segments, each one a literal, a parameter <code>:name</code>, or (only as the last segment) a named wildcard <code>*name</code>. Express’s default rules:</p>
<ul><li>literals compare <b>case-insensitively</b> (<code>/NOTES/42</code> matches <code>/notes/:id</code>);</li><li>one trailing slash is allowed (<code>/notes/42/</code> matches);</li><li><code>:name</code> matches exactly one <b>non-empty</b> segment; its value is the URL-decoded <b>string</b> (<code>a%20b</code> → <code>"a b"</code>);</li><li><code>*name</code> matches one or more remaining segments and gives an array of decoded segments (<code>/files/a/b/</code> → <code>["a", "b", ""]</code> — the trailing slash belongs to the wildcard);</li><li>a value that cannot be decoded throws (Express answers 400): <code>decodeURIComponent</code> already throws <code>URIError</code>.</li></ul><p>Paths always start with <code>/</code>.</p>`,
  vi: `<p>Viết <code>matchPath(pattern, path)</code> → object <code>req.params</code> mà Express 5 sẽ cho, hoặc <code>null</code> nếu route không khớp. Mẫu gồm các đoạn ngăn bởi <code>/</code>, mỗi đoạn là chữ cố định, tham số <code>:name</code>, hoặc (chỉ ở đoạn cuối) wildcard có tên <code>*name</code>. Luật mặc định của Express:</p>
<ul><li>chữ cố định so <b>không phân biệt hoa thường</b> (<code>/NOTES/42</code> khớp <code>/notes/:id</code>);</li><li>cho phép một dấu / ở cuối (<code>/notes/42/</code> khớp);</li><li><code>:name</code> khớp đúng một đoạn <b>không rỗng</b>; giá trị là <b>chuỗi</b> đã giải mã URL (<code>a%20b</code> → <code>"a b"</code>);</li><li><code>*name</code> khớp một hay nhiều đoạn còn lại và cho mảng các đoạn đã giải mã (<code>/files/a/b/</code> → <code>["a", "b", ""]</code> — dấu / cuối thuộc về wildcard);</li><li>giá trị không giải mã được thì ném lỗi (Express trả 400): <code>decodeURIComponent</code> vốn đã ném <code>URIError</code>.</li></ul><p>path luôn bắt đầu bằng <code>/</code>.</p>`,
  dauVao: ['pattern — e.g. "/notes/:id", "/files/*splat"; path — the request path', 'pattern — vd "/notes/:id", "/files/*splat"; path — đường dẫn request'], dauRa: ['params object, or null', 'object params, hoặc null'],
  goiY: [['Split both on "/" and walk the pattern segment by segment.', 'Tách cả hai theo "/" rồi đi qua mẫu từng đoạn.'], ['Drop one empty last segment of the path — unless the pattern ends with a wildcard.', 'Bỏ một đoạn rỗng cuối của path — trừ khi mẫu kết thúc bằng wildcard.'], ['At the end the number of segments must be equal: /notes/42/x does not match /notes/:id.', 'Cuối cùng số đoạn phải bằng nhau: /notes/42/x không khớp /notes/:id.']],
  loi: [['Number(…) the parameter: Express gives strings — converting is the route’s job, with a check.', 'Number(…) tham số: Express cho chuỗi — đổi kiểu là việc của route, kèm kiểm tra.'], ['Letting :id match an empty segment, so /notes/ matches /notes/:id.', 'Cho :id khớp đoạn rỗng, nên /notes/ khớp /notes/:id.'], ['Comparing literals case-sensitively.', 'So chữ cố định phân biệt hoa thường.']],
  gt: ['Every case was compared with the Layer of Express 5’s own router (<code>router/lib/layer.js</code>, path-to-regexp 8, sensitive: false, strict: false). Knowing these rules is what lets you predict the ordering bug: <code>:id</code> matches any one non-empty segment — including the word <code>new</code>.', 'Mọi ca đã được so với Layer của chính router Express 5 (<code>router/lib/layer.js</code>, path-to-regexp 8, sensitive: false, strict: false). Nắm các luật này là thứ giúp bạn đoán trước lỗi thứ tự: <code>:id</code> khớp mọi đoạn không rỗng — kể cả chữ <code>new</code>.'],
  kn: ['routing'], tns: [tn('segment', 'đoạn đường dẫn'), tn('case-insensitive', 'không phân biệt hoa thường'), tn('URL decoding', 'giải mã URL')],
  dau: `/** req.params for pattern on path (Express 5 defaults), or null */
function matchPath(pattern, path) {
  // Write your solution here — exact, case-sensitive, no wildcard
  const pat = pattern.split('/');
  const segs = path.split('/');
  if (pat.length !== segs.length) return null;
  const params = {};
  for (let i = 0; i < pat.length; i++) {
    if (pat[i].startsWith(':')) params[pat[i].slice(1)] = segs[i];
    else if (pat[i] !== segs[i]) return null;
  }
  return params;
}
`,
  giai: '// Reference solution — segment by segment, with Express 5\'s defaults\n' + nguon(matchPath),
  cases: [
    { goi: goi('matchPath', '/notes/:id', '/notes/42'), moTa: ['A parameter is a string', 'Tham số là chuỗi'] },
    { goi: `[${[['/notes/:id', '/notes/new'], ['/notes/:id', '/notes'], ['/notes/:id', '/notes/42/x']].map(([a, b]) => goi('matchPath', a, b)).join(', ')}]`, moTa: [':id matches "new"; wrong lengths do not match', ':id khớp "new"; sai số đoạn thì không khớp'] },
    { goi: goi('matchPath', '/files/*splat', '/files/a/b/c.png'), moTa: ['Named wildcard → array', 'Wildcard có tên → mảng'] },
    { goi: `[${[['/notes/:id', '/notes/42/'], ['/notes/:id', '/NOTES/42'], ['/notes/:id', '/notes/a%20b'], ['/notes/:id', '/notes/'], ['/notes/:id', '/notes/42//']].map(([a, b]) => goi('matchPath', a, b)).join(', ')}]`, an: true },
    { goi: `[${[['/files/*splat', '/files/a/b/'], ['/files/*splat', '/files/'], ['/files/*splat', '/files/a%2Fb/c'], ['/', '/'], ['/notes', '/notes/'], ['/a/:x/b/:y', '/a/1/b/2/']].map(([a, b]) => goi('matchPath', a, b)).join(', ')}]`, an: true },
    { goi: goi('matchPath', '/notes/:id', '/notes/%E0%A4%A'), nem: 'URIError', an: true },
    { goi: `[${[['/users/:userId/notes/:noteId', '/users/7/notes/9'], ['/users/:userId/notes/:noteId', '/users/7/NOTES/9'], ['/users/:userId/notes/:noteId', '/users/7/notes'], ['/api/v1/health', '/API/V1/Health/']].map(([a, b]) => goi('matchPath', a, b)).join(', ')}]`, an: true },
  ],
});

/* ─── 3. query phòng thủ ─── */
function listParams(query) {
  const one = (v) => (Array.isArray(v) ? v[0] : v);              // ?page=2&page=3 → take the first
  const int = (v, dflt) => Math.floor(Number(one(v) ?? dflt) || dflt);
  const page = Math.max(1, int(query.page, 1));
  const limit = Math.min(50, Math.max(1, int(query.limit, 10)));  // clamp: nobody asks for a million rows
  const qText = one(query.q);
  const q = typeof qText === 'string' ? qText.trim() : '';
  const raw = query.tags === undefined ? [] : Array.isArray(query.tags) ? query.tags : [query.tags];   // one shape, always
  const tags = raw.filter((t) => typeof t === 'string' && t !== '');
  return { page, limit, q, tags };
}
const E3 = nodeBai({
  ten: '5.2 · Read the query string defensively', kho: 'MEDIUM', phut: 15,
  en: `<p>Three facts from the lesson: everything in <code>req.query</code> is a string, a repeated key becomes an array, and the client controls the whole object. Write <code>listParams(query)</code> for <code>GET /api/v1/notes</code> → <code>{ page, limit, q, tags }</code>:</p>
<ul><li>when a key arrives as an array, use its <b>first</b> value — except <code>tags</code>;</li><li><code>page</code>: integer (<code>Math.floor</code>), default 1, at least 1; anything that is not a number → 1;</li><li><code>limit</code>: integer, default 10, clamped to 1…50; not a number → 10;</li><li><code>q</code>: the trimmed string, or <code>""</code>;</li><li><code>tags</code>: <b>always an array</b> — a single <code>tags=a</code> gives <code>["a"]</code>, repeated keys give all values, missing gives <code>[]</code>; empty strings are dropped.</li></ul><p>The lesson’s two lines are your starting point: <code>Math.max(1, Number(req.query.page ?? 1) || 1)</code> and <code>Math.min(50, Math.max(1, Number(req.query.limit ?? 10) || 10))</code>.</p>`,
  vi: `<p>Ba sự thật của bài: mọi thứ trong <code>req.query</code> là chuỗi, khoá lặp thành mảng, và client kiểm soát cả object. Viết <code>listParams(query)</code> cho <code>GET /api/v1/notes</code> → <code>{ page, limit, q, tags }</code>:</p>
<ul><li>khi một khoá tới dạng mảng, dùng giá trị <b>đầu</b> — trừ <code>tags</code>;</li><li><code>page</code>: số nguyên (<code>Math.floor</code>), mặc định 1, ít nhất 1; thứ không phải số → 1;</li><li><code>limit</code>: số nguyên, mặc định 10, kẹp trong 1…50; không phải số → 10;</li><li><code>q</code>: chuỗi đã trim, hoặc <code>""</code>;</li><li><code>tags</code>: <b>luôn là mảng</b> — một <code>tags=a</code> cho <code>["a"]</code>, khoá lặp cho mọi giá trị, thiếu thì <code>[]</code>; bỏ chuỗi rỗng.</li></ul><p>Hai dòng của bài là điểm xuất phát: <code>Math.max(1, Number(req.query.page ?? 1) || 1)</code> và <code>Math.min(50, Math.max(1, Number(req.query.limit ?? 10) || 10))</code>.</p>`,
  dauVao: ['query — req.query (values are strings or arrays of strings)', 'query — req.query (giá trị là chuỗi hoặc mảng chuỗi)'], dauRa: ['{ page, limit, q, tags }', '{ page, limit, q, tags }'],
  goiY: [['A tiny helper one(v) = Array.isArray(v) ? v[0] : v removes most of the type flipping.', 'Một hàm nhỏ one(v) = Array.isArray(v) ? v[0] : v gỡ phần lớn trò đổi kiểu.'], ['Number("abc") is NaN, and NaN || 10 is 10 — that is why the lesson writes || default.', 'Number("abc") là NaN, và NaN || 10 là 10 — đó là lý do bài viết || mặc định.'], ['For tags, normalise to an array first, then filter.', 'Với tags, chuẩn hoá thành mảng trước, rồi lọc.']],
  loi: [['"2" + 1 is "21": using page without converting it.', '"2" + 1 là "21": dùng page mà không đổi kiểu.'], ['Number(["2", "3"]) is NaN — but Number(["2"]) is 2: arrays sneak through unless you pick one value.', 'Number(["2", "3"]) là NaN — nhưng Number(["2"]) là 2: mảng lọt qua nếu bạn không chọn một giá trị.'], ['tags.map(…) crashing when tags is the string "a".', 'tags.map(…) sập khi tags là chuỗi "a".']],
  gt: ['The values in the tests are what Express 5’s query parser really produces (<code>node:querystring</code>: repeated keys → arrays). Normalising at the edge means the rest of the code sees one shape; the clamp means nobody can request a million rows. Never spread <code>req.query</code> straight into a database <code>where</code> — read the fields you expect, by name, as here.', 'Các giá trị trong kiểm đúng là thứ bộ phân tích query của Express 5 tạo ra (<code>node:querystring</code>: khoá lặp → mảng). Chuẩn hoá ở biên nghĩa là phần còn lại của code chỉ thấy một dạng; phép kẹp nghĩa là không ai xin được một triệu dòng. Đừng bao giờ rải thẳng <code>req.query</code> vào <code>where</code> của CSDL — đọc các trường bạn mong đợi, theo tên, như ở đây.'],
  kn: ['routing', 'validation'], tns: [tn('clamp', 'kẹp giá trị trong khoảng'), tn('normalise', 'chuẩn hoá dạng dữ liệu')],
  dau: `/** { page, limit, q, tags } from req.query, whatever the client sent */
function listParams(query) {
  // Write your solution here — this trusts the client
  return { page: query.page || 1, limit: query.limit || 10, q: query.q || '', tags: query.tags || [] };
}
`,
  giai: '// Reference solution — pick one value, convert, default, clamp; tags always an array\n' + nguon(listParams),
  cases: [
    { goi: goi('listParams', { q: 'node', tags: ['a', 'b'], page: '2' }), moTa: ['The lesson’s /search?q=node&tags=a&tags=b&page=2', '/search?q=node&tags=a&tags=b&page=2 của bài'] },
    { goi: goi('listParams', {}), moTa: ['Nothing sent: defaults', 'Không gửi gì: mặc định'] },
    { goi: goi('listParams', { limit: '1000000', tags: 'a' }), moTa: ['A million rows → 50; one tag → array', 'Một triệu dòng → 50; một tag → mảng'] },
    { goi: goi('listParams', { page: 'abc', limit: '-3', q: '  express  ' }), an: true },
    { goi: goi('listParams', { page: ['3', '9'], limit: ['5'], q: ['first', 'second'], tags: ['x', '', 'y'] }), an: true },
    { goi: goi('listParams', { page: '2.7', limit: '0', tags: '' }), an: true },
  ],
});

/* ─── 4. Router + mergeParams ─── */
function createApp() {
  const app = express();
  const notes = [{ id: 1, title: 'First note' }, { id: 2, title: 'Second note' }];
  const comments = [{ noteId: 1, text: 'nice' }, { noteId: 1, text: 'thanks' }, { noteId: 2, text: 'ok' }];

  const notesRouter = express.Router();
  notesRouter.get('/', (req, res) => res.json(notes));
  notesRouter.get('/new', (req, res) => res.json({ form: 'new note' }));   // specific BEFORE /:id
  notesRouter.get('/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'id must be a number' });
    const note = notes.find((n) => n.id === id);
    if (!note) return res.status(404).json({ error: 'Not Found' });
    res.json(note);
  });

  // mergeParams: the child router can read :noteId from the mount path
  const commentsRouter = express.Router({ mergeParams: true });
  commentsRouter.get('/', (req, res) => {
    const noteId = Number(req.params.noteId);
    res.json({ noteId, comments: comments.filter((c) => c.noteId === noteId).map((c) => c.text) });
  });

  app.use('/api/v1/notes/:noteId/comments', commentsRouter);
  app.use('/api/v1/notes', notesRouter);
  return app;
}
const E4 = nodeBai({
  ten: '5.2 · One router per resource, and mergeParams for nesting', kho: 'MEDIUM', phut: 20, kit: true, tep: 'app.js',
  en: `<p>Split the Notes routes into routers, as the lesson does. In <code>createApp()</code>:</p>
<ul><li>a <code>notesRouter</code> mounted at <code>/api/v1/notes</code> with <code>GET /</code> (all notes), <code>GET /new</code> → <code>{ form: "new note" }</code>, and <code>GET /:id</code> → the note, 404 <code>{ error: "Not Found" }</code>, or 400 <code>{ error: "id must be a number" }</code> when the id is not an integer;</li><li>a <code>commentsRouter</code> mounted at <code>/api/v1/notes/:noteId/comments</code> whose <code>GET /</code> returns <code>{ noteId: &lt;number&gt;, comments: [texts] }</code> — it needs to read <code>:noteId</code> from its <b>parent</b> path.</li></ul><p>The starter has the ordering bug and a child router that cannot see the parent’s parameter.</p>`,
  vi: `<p>Tách các route của Notes thành router, như bài làm. Trong <code>createApp()</code>:</p>
<ul><li>một <code>notesRouter</code> gắn ở <code>/api/v1/notes</code> có <code>GET /</code> (mọi ghi chú), <code>GET /new</code> → <code>{ form: "new note" }</code>, và <code>GET /:id</code> → ghi chú, 404 <code>{ error: "Not Found" }</code>, hoặc 400 <code>{ error: "id must be a number" }</code> khi id không phải số nguyên;</li><li>một <code>commentsRouter</code> gắn ở <code>/api/v1/notes/:noteId/comments</code> có <code>GET /</code> trả <code>{ noteId: &lt;số&gt;, comments: [các chữ] }</code> — nó cần đọc <code>:noteId</code> từ đường dẫn <b>cha</b>.</li></ul><p>Code khởi đầu có lỗi thứ tự và một router con không thấy tham số của cha.</p>`,
  yc: [['Paths inside a router are relative to its mount path.', 'Đường dẫn trong router là tương đối với chỗ gắn của nó.'], ['Keep the data arrays as given.', 'Giữ nguyên các mảng dữ liệu đã cho.']],
  goiY: [['Inside one router, declare from most specific to least specific: /new before /:id.', 'Trong một router, khai từ cụ thể nhất tới chung nhất: /new trước /:id.'], ['express.Router({ mergeParams: true }) lets the child see req.params.noteId.', 'express.Router({ mergeParams: true }) cho router con thấy req.params.noteId.'], ['Number.isInteger(Number("abc")) is false → 400.', 'Number.isInteger(Number("abc")) là false → 400.']],
  loi: [['Declaring /:id first: /api/v1/notes/new returns 400 (or a lookup of NaN).', 'Khai /:id trước: /api/v1/notes/new trả 400 (hoặc tra NaN).'], ['Forgetting mergeParams: req.params.noteId is undefined, Number(undefined) is NaN, and every list is empty.', 'Quên mergeParams: req.params.noteId là undefined, Number(undefined) là NaN, và mọi danh sách đều rỗng.'], ['Repeating the prefix inside the router: router.get("/api/v1/notes/:id") never matches.', 'Lặp tiền tố trong router: router.get("/api/v1/notes/:id") không bao giờ khớp.']],
  gt: ['A router is a mini-app with its own ordered list, so the ordering question becomes local to one resource. mergeParams is off by default because a router should not depend on where it is mounted — turn it on only for genuinely nested resources like comments of a note.', 'Router là một mini-app có danh sách thứ tự riêng, nên câu hỏi thứ tự chỉ còn trong phạm vi một tài nguyên. mergeParams mặc định tắt vì một router không nên phụ thuộc vào chỗ nó được gắn — chỉ bật cho tài nguyên lồng thật sự như bình luận của một ghi chú.'],
  kn: ['Express', 'Router'], tns: [tn('express.Router()', 'bộ định tuyến con'), tn('mergeParams', 'gộp tham số của router cha')],
  chung: 'const s = (r) => ({ status: r.status, body: r.body ?? null });',
  dau: `/** notes router + nested comments router */
function createApp() {
  const app = express();
  const notes = [{ id: 1, title: 'First note' }, { id: 2, title: 'Second note' }];
  const comments = [{ noteId: 1, text: 'nice' }, { noteId: 1, text: 'thanks' }, { noteId: 2, text: 'ok' }];

  // Write your solution here — the ordering bug, and a child router that cannot see :noteId
  const notesRouter = express.Router();
  notesRouter.get('/', (req, res) => res.json(notes));
  notesRouter.get('/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'id must be a number' });
    const note = notes.find((n) => n.id === id);
    if (!note) return res.status(404).json({ error: 'Not Found' });
    res.json(note);
  });
  notesRouter.get('/new', (req, res) => res.json({ form: 'new note' }));

  const commentsRouter = express.Router();
  commentsRouter.get('/', (req, res) => {
    const noteId = Number(req.params.noteId);
    res.json({ noteId, comments: comments.filter((c) => c.noteId === noteId).map((c) => c.text) });
  });

  app.use('/api/v1/notes/:noteId/comments', commentsRouter);
  app.use('/api/v1/notes', notesRouter);
  return app;
}
`,
  giai: '// Reference solution — specific before parameterised, mergeParams for the nested router\n' + nguon(createApp),
  cases: [
    { goi: 's(await request(createApp(), "GET", "/api/v1/notes/new"))', moTa: ['/new is not shadowed by /:id', '/new không bị /:id che'] },
    { goi: '[s(await request(createApp(), "GET", "/api/v1/notes/2")), s(await request(createApp(), "GET", "/api/v1/notes/9"))]', moTa: ['GET /:id found / not found', 'GET /:id có / không có'] },
    { goi: 's(await request(createApp(), "GET", "/api/v1/notes/1/comments"))', moTa: ['Nested router reads :noteId', 'Router lồng đọc được :noteId'] },
    { goi: '[s(await request(createApp(), "GET", "/api/v1/notes/abc")), s(await request(createApp(), "GET", "/api/v1/notes/")), s(await request(createApp(), "GET", "/api/v1/notes/2/comments/"))]', an: true },
    { goi: '[s(await request(createApp(), "GET", "/API/V1/NOTES/NEW")), (await request(createApp(), "GET", "/api/v1/notes/1/2")).status]', an: true },
  ],
});

/* ─── 5. tìm route bị che ─── */
function segCovers(a, b) {
  // does pattern segment a match everything segment b can match?
  if (a.startsWith(':')) return !b.startsWith('*');
  if (b.startsWith(':') || b.startsWith('*')) return false;
  return a.toLowerCase() === b.toLowerCase();
}
function covers(early, late) {
  const A = early.split('/').filter(Boolean);
  const B = late.split('/').filter(Boolean);
  const aSplat = A.length > 0 && A[A.length - 1].startsWith('*');
  const bSplat = B.length > 0 && B[B.length - 1].startsWith('*');
  if (aSplat) {
    const k = A.length - 1;                              // the wildcard swallows segment k and everything after it
    if (bSplat ? B.length - 1 < k : B.length < k + 1) return false;
    for (let i = 0; i < k; i++) if (!segCovers(A[i], B[i])) return false;
    return true;
  }
  if (bSplat || A.length !== B.length) return false;      // a wildcard path can be longer than any fixed pattern
  return A.every((seg, i) => segCovers(seg, B[i]));
}
function findShadowed(routes) {
  const out = [];
  routes.forEach((late, j) => {
    // the first EARLIER route of the same method (or "all") that matches everything this one matches
    const early = routes.slice(0, j).find((e) => (e.method === late.method || e.method === 'all') && covers(e.path, late.path));
    if (early) out.push({ route: late.name, shadowedBy: early.name });
  });
  return out;
}
const E5 = nodeBai({
  ten: '5.2 · Find routes that can never be reached', kho: 'HARD', phut: 30,
  en: `<p>“This class of bug scales badly … nothing warns you — there is no compile step and no duplicate-route error.” Write the warning Express does not have. <code>routes</code> is the ordered list of one app: <code>[{ name, method, path }]</code> (<code>method</code> is <code>"get"</code>, <code>"post"</code>, … or <code>"all"</code>). A route is <b>shadowed</b> when an <b>earlier</b> route with the same method (or <code>"all"</code>) matches <i>every</i> path the later one could match. Return <code>[{ route, shadowedBy }]</code> in list order, naming the first such earlier route.</p>
<p>Segments are literals (case-insensitive), <code>:param</code> (any one segment) and a final <code>*splat</code> (one or more segments). So:</p>
<ul><li>a literal covers only the same literal; <code>:param</code> covers a literal or another <code>:param</code>, never a wildcard;</li><li>without wildcards both patterns need the same number of segments;</li><li>an earlier <code>…/*splat</code> at position k covers a later pattern that has at least k+1 segments (its own wildcard, if any, starting at k or later) and whose first k segments are covered.</li></ul>`,
  vi: `<p>“Loại lỗi này càng lớn càng tệ … không có gì cảnh báo — không có bước biên dịch, không có lỗi route trùng.” Hãy viết lời cảnh báo mà Express không có. <code>routes</code> là danh sách có thứ tự của một app: <code>[{ name, method, path }]</code> (<code>method</code> là <code>"get"</code>, <code>"post"</code>, … hoặc <code>"all"</code>). Một route bị <b>che</b> khi một route <b>trước</b> nó cùng method (hoặc <code>"all"</code>) khớp <i>mọi</i> đường dẫn mà route sau có thể khớp. Trả về <code>[{ route, shadowedBy }]</code> theo thứ tự danh sách, nêu route trước đầu tiên như vậy.</p>
<p>Các đoạn là chữ cố định (không phân biệt hoa thường), <code>:param</code> (một đoạn bất kỳ) và <code>*splat</code> ở cuối (một hay nhiều đoạn). Do đó:</p>
<ul><li>chữ cố định chỉ phủ chính chữ đó; <code>:param</code> phủ một chữ cố định hoặc một <code>:param</code> khác, không bao giờ phủ wildcard;</li><li>không có wildcard thì hai mẫu cần cùng số đoạn;</li><li>một <code>…/*splat</code> phía trước ở vị trí k phủ một mẫu sau có ít nhất k+1 đoạn (wildcard của nó, nếu có, bắt đầu ở k hoặc sau) và k đoạn đầu được phủ.</li></ul>`,
  dauVao: ['routes — [{ name, method, path }] in declaration order', 'routes — [{ name, method, path }] theo thứ tự khai báo'], dauRa: ['[{ route, shadowedBy }]', '[{ route, shadowedBy }]'],
  goiY: [['Write covers(early, late) for two paths first; findShadowed is then a double loop.', 'Viết covers(early, late) cho hai đường dẫn trước; findShadowed khi đó chỉ là hai vòng lặp.'], ['Write segCovers(a, b) for one segment pair and reuse it.', 'Viết segCovers(a, b) cho một cặp đoạn và dùng lại.'], ['Test your idea on the lesson’s bug: /notes/:id before /notes/new.', 'Thử ý tưởng trên lỗi của bài: /notes/:id trước /notes/new.']],
  loi: [['Saying /notes/:id shadows /notes/:id/comments — different lengths, no wildcard: both reachable.', 'Nói /notes/:id che /notes/:id/comments — khác số đoạn, không có wildcard: cả hai đều tới được.'], ['Ignoring the method: get /notes/:id does not shadow post /notes/new.', 'Bỏ qua method: get /notes/:id không che post /notes/new.'], ['Letting a literal cover a :param: /notes/new does not shadow a later /notes/:id.', 'Cho chữ cố định phủ :param: /notes/new không che /notes/:id phía sau.']],
  gt: ['This is a static check over the ordered list — the kind of test you can run in CI over the central routes file the lesson mentions (about 150 router files on this site). It does not need to run a single request: it reasons about patterns, which is why it catches the bug before any user does.', 'Đây là một phép kiểm tĩnh trên danh sách có thứ tự — loại test chạy được trong CI trên tệp route trung tâm mà bài nhắc tới (khoảng 150 tệp router trên trang này). Nó không cần chạy một request nào: nó lập luận trên các mẫu, vì thế bắt được lỗi trước khi người dùng nào gặp.'],
  kn: ['routing', 'static analysis'], tns: [tn('shadowed route', 'route bị che'), tn('static check', 'kiểm tĩnh (không chạy chương trình)')],
  dau: `/** routes that an earlier route makes unreachable */
function findShadowed(routes) {
  // Write your solution here — this only catches exact duplicates
  const out = [];
  routes.forEach((late, j) => {
    const early = routes.slice(0, j).find((e) => e.method === late.method && e.path === late.path);
    if (early) out.push({ route: late.name, shadowedBy: early.name });
  });
  return out;
}
`,
  giai: '// Reference solution — segment coverage, then the first earlier route that covers\n' + nguon(segCovers, covers, findShadowed),
  cases: [
    { goi: goi('findShadowed', [{ name: 'byId', method: 'get', path: '/notes/:id' }, { name: 'newForm', method: 'get', path: '/notes/new' }]), moTa: ['The lesson’s bug', 'Lỗi của bài'] },
    { goi: goi('findShadowed', [{ name: 'newForm', method: 'get', path: '/notes/new' }, { name: 'byId', method: 'get', path: '/notes/:id' }]), moTa: ['Fixed order: nothing shadowed', 'Thứ tự đúng: không có gì bị che'] },
    { goi: goi('findShadowed', [{ name: 'byId', method: 'get', path: '/notes/:id' }, { name: 'create', method: 'post', path: '/notes/new' }, { name: 'comments', method: 'get', path: '/notes/:id/comments' }]), moTa: ['Different method or length: reachable', 'Khác method hoặc số đoạn: tới được'] },
    { goi: goi('findShadowed', [{ name: 'files', method: 'get', path: '/files/*splat' }, { name: 'one', method: 'get', path: '/files/:name' }, { name: 'deep', method: 'get', path: '/files/a/b/c' }, { name: 'other', method: 'get', path: '/filez/x' }, { name: 'root', method: 'get', path: '/files' }]), an: true },
    { goi: goi('findShadowed', [{ name: 'any', method: 'all', path: '/admin/:page' }, { name: 'stats', method: 'get', path: '/ADMIN/stats' }, { name: 'p2', method: 'get', path: '/admin/:x' }, { name: 'more', method: 'get', path: '/admin/*rest' }]), an: true },
    { goi: goi('findShadowed', [{ name: 'a', method: 'get', path: '/x/:id' }, { name: 'b', method: 'get', path: '/x/*rest' }, { name: 'c', method: 'get', path: '/x/*rest' }, { name: 'd', method: 'get', path: '/x/y/*rest' }, { name: 'e', method: 'get', path: '/x/:p/z' }]), an: true },
  ],
});

export default doiDau({ slug: 'nodejs-5-2-dinh-tuyen', ten: '5.2 Routing: params, query and Router', khoa: KHOA, baiHoc: 'nodejs-5-2-dinh-tuyen', de: [E1, E2, E3, E4, E5] });
