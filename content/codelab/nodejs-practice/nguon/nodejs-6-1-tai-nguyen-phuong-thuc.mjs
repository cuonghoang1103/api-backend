/** Node.js 6.1 — Tài nguyên, phương thức, safe/idempotent, PUT vs PATCH, HEAD/OPTIONS miễn phí và 404 thay vì 405 của Express. */
import { modul, cs, q, bang1, tn, jsBai, goi } from './_node-c6-8.mjs';

/* ── 1. Bảng: safe / idempotent ── */
const YN = ['yes', 'no'];
const E1 = cs({
  ten: '6.1 · 1 — Safe or idempotent? Classify the methods', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Lesson 6.1 gives two properties you can <b>test by hand</b>: <b>safe</b> (calling it changes nothing) and <b>idempotent</b> (calling it N times leaves the same state as calling it once). Fill both columns for every method, the way the lesson’s curl experiments showed them (POST twice ⇒ two notes, PUT twice ⇒ same state, DELETE twice ⇒ 204 then 404 but the note is gone either way).',
  vi: 'Bài 6.1 đưa ra hai tính chất bạn <b>kiểm được bằng tay</b>: <b>safe</b> (gọi không thay đổi gì) và <b>idempotent</b> (gọi N lần để lại cùng trạng thái như gọi một lần). Điền cả hai cột cho mọi phương thức, đúng như các thí nghiệm curl của bài (POST hai lần ⇒ hai ghi chú, PUT hai lần ⇒ cùng trạng thái, DELETE hai lần ⇒ 204 rồi 404 nhưng ghi chú vẫn mất).',
  bang: [bang1('b1', ['Method → safe? → idempotent?', 'Phương thức → safe? → idempotent?'], [{ ma: 'm', ten: 'Method' }, { ma: 's', ten: 'Safe?', luaChon: YN }, { ma: 'i', ten: 'Idempotent?', luaChon: YN }], [
    { o: { m: 'GET /notes/1' }, a: { s: 'yes', i: 'yes' } },
    { o: { m: 'HEAD /notes/1' }, a: { s: 'yes', i: 'yes' } },
    { o: { m: 'OPTIONS /notes' }, a: { s: 'yes', i: 'yes' } },
    { o: { m: 'POST /notes {"title":"A"}' }, a: { s: 'no', i: 'no' } },
    { o: { m: 'PUT /settings/theme {"theme":"dark"}' }, a: { s: 'no', i: 'yes' } },
    { o: { m: 'PATCH /notes/1 (as usually written)' }, a: { s: 'no', i: 'no' } },
    { o: { m: 'DELETE /notes/1' }, a: { s: 'no', i: 'yes' } },
  ], ['Safe ⊂ idempotent: GET, HEAD, OPTIONS change nothing, so repeating them is trivially harmless. PUT and DELETE change state but repeating them leaves the SAME state (DELETE: 204 then 404, note gone both times — different status codes, same state). POST creates a new row each time; PATCH is “generally not” idempotent in the lesson’s summary (an increment or append patch changes again on every call).', 'Safe ⊂ idempotent: GET, HEAD, OPTIONS không đổi gì nên lặp lại hiển nhiên vô hại. PUT và DELETE đổi trạng thái nhưng lặp lại vẫn để lại CÙNG trạng thái (DELETE: 204 rồi 404, ghi chú mất cả hai lần — mã khác, trạng thái giống). POST tạo dòng mới mỗi lần; PATCH theo tóm tắt của bài là "thường không" idempotent (patch kiểu cộng thêm/nối thêm đổi lại sau mỗi lần gọi).'])],
  goiY: [['Safe = “nothing changes on the server”. Idempotent = “the second call leaves the same state as the first”.', 'Safe = "không có gì thay đổi trên server". Idempotent = "lần gọi thứ hai để lại cùng trạng thái như lần đầu".'], ['Judge DELETE by the STATE after the call, not by the status code it returns.', 'Đánh giá DELETE theo TRẠNG THÁI sau lời gọi, không theo mã trạng thái trả về.']],
  loi: [['Marking DELETE “not idempotent” because the second call answers 404 instead of 204.', 'Đánh DELETE là "không idempotent" vì lần gọi thứ hai trả 404 thay vì 204.'], ['Marking PUT “safe”: it is idempotent, but it does change the resource.', 'Đánh PUT là "safe": nó idempotent nhưng có thay đổi tài nguyên.']],
  tns: [tn('safe method', 'phương thức an toàn', 'Không thay đổi gì trên server.'), tn('idempotent', 'bất biến khi gọi lặp', 'Gọi N lần = gọi 1 lần (về trạng thái).')],
  kn: ['HTTP methods', 'idempotency'],
});

/* ── 2. Trắc nghiệm: danh từ, không động từ ── */
const E2 = cs({
  ten: '6.1 · 2 — Nouns, not verbs: what HTTP and Express really do', kho: 'EASY', phut: 8,
  en: 'Six situations from lesson 6.1. Each one is about a promise the method makes to every layer between the client and your server — proxies, browsers, retry policies — and about two things Express does (and does not do) for free.',
  vi: 'Sáu tình huống của bài 6.1. Mỗi câu nói về một lời hứa mà phương thức đưa ra cho mọi tầng giữa client và server — proxy, trình duyệt, chính sách thử lại — và về hai thứ Express làm (và không làm) sẵn cho bạn.',
  cau: [
    q('c1', ['A team ships <code>POST /deleteNote?id=42</code>. Which machinery can no longer help them?', 'Một nhóm phát hành <code>POST /deleteNote?id=42</code>. Bộ máy nào không còn giúp được họ?'],
      ['Every HTTP-aware layer: caches, browsers and retry policies act on the METHOD, and POST says “not safe, not idempotent”', 'Only the database, because DELETE statements are never generated from POST requests', 'Nothing changes: URLs are free text and every layer reads the path to decide', 'Only the browser, which refuses to send POST requests with a query string'],
      ['The meaning is hidden in a string only your code understands. With DELETE /notes/42 a mobile SDK may safely retry; with POST it must not.', 'Ý nghĩa bị giấu trong một chuỗi chỉ code của bạn hiểu. Với DELETE /notes/42 SDK di động được phép thử lại an toàn; với POST thì không.']),
    q('c2', ['DELETE /notes/1 twice answers 204, then 404. Is DELETE still idempotent?', 'DELETE /notes/1 hai lần trả 204 rồi 404. DELETE có còn idempotent?'],
      ['Yes — the state is the same after both calls (the note is gone); idempotency is about state, not status codes', 'No — a different status code on the second call breaks idempotency by definition', 'Only if the server answers 204 both times; 404 must be avoided', 'Only if the client sends an Idempotency-Key header'],
      ['Both 404 and 204 on the second call are defensible; pick one and document it. The state is what matters.', 'Cả 404 và 204 ở lần thứ hai đều chấp nhận được; chọn một và ghi vào tài liệu. Cái quan trọng là trạng thái.']),
    q('c3', ['A and B load note 1, A sends the WHOLE object with a new title (PUT), then B sends the WHOLE object with a new body. What happens?', 'A và B cùng tải ghi chú 1, A gửi CẢ object với tiêu đề mới (PUT), rồi B gửi CẢ object với nội dung mới. Chuyện gì xảy ra?'],
      ['A’s title is silently lost — no error, no conflict, no log line (the lost update)', 'The server merges both changes because the fields are different', 'B gets 409 Conflict automatically because the note changed', 'Express rejects the second PUT with 412 Precondition Failed'],
      ['B’s copy is from before A’s edit, so B writes the old title back. PATCH reduces the damage; the real fix is ETag + If-Match ⇒ 412 (lesson 6.5).', 'Bản của B có từ trước khi A sửa, nên B ghi lại tiêu đề cũ. PATCH giảm thiệt hại; cách chữa thật là ETag + If-Match ⇒ 412 (bài 6.5).']),
    q('c4', ['A frontend developer sends DELETE to a path that only has a GET route in Express 5. What does the server answer?', 'Một bạn frontend gửi DELETE tới đường dẫn chỉ có route GET trong Express 5. Server trả gì?'],
      ['404 Not Found — Express matches method + path together and finds nothing', '405 Method Not Allowed with an Allow header', '200 OK — Express falls back to the GET handler', '501 Not Implemented'],
      ['Express does not produce 405 for free. “404 on an endpoint I can see working in the browser” is almost always the wrong method.', 'Express không tự tạo 405. "404 ở endpoint tôi thấy chạy được trên trình duyệt" gần như luôn là sai phương thức.']),
    q('c5', ['You never wrote a HEAD route, yet <code>curl -I /notes/1</code> answers 200 with a correct Content-Length. Why?', 'Bạn chưa từng viết route HEAD, vậy mà <code>curl -I /notes/1</code> trả 200 với Content-Length đúng. Vì sao?'],
      ['Express answers HEAD from your GET route: it runs the same handler and drops the body', 'curl converts HEAD into GET before sending it', 'Node’s http module caches the last GET response and replays it', 'HEAD is answered by the operating system’s TCP stack'],
      ['Clients use HEAD to check existence or freshness cheaply. OPTIONS likewise gets Allow: GET, HEAD for free.', 'Client dùng HEAD để kiểm tra tồn tại hay độ mới với giá rẻ. OPTIONS cũng được Allow: GET, HEAD miễn phí.']),
    q('c6', ['“Publish note 42” is not CRUD. Which design does the lesson recommend?', '"Xuất bản ghi chú 42" không phải CRUD. Bài khuyên thiết kế nào?'],
      ['A noun sub-resource like POST /notes/42/publication, or a rare, consistent action endpoint POST /notes/42/publish', 'POST /publishNote?id=42, because verbs belong in the URL for actions', 'PATCH /notes/42/publish/true', 'GET /notes/42?publish=1, because it is the cheapest method'],
      ['Pragmatic, not pure: a clear verb beats a tortured noun — just keep it rare and consistent (cuongthai.com: POST /threads/:id/restore).', 'Thực dụng, không cực đoan: động từ rõ ràng hơn danh từ gượng ép — chỉ cần hiếm và nhất quán (cuongthai.com: POST /threads/:id/restore).']),
  ],
  goiY: [['For each case ask: what does the METHOD promise to a cache or a retrying client?', 'Với mỗi câu hỏi: PHƯƠNG THỨC hứa gì với cache hay client đang thử lại?'], ['Express matches on method + path together — think about what “no match” means.', 'Express khớp theo cả phương thức + đường dẫn — nghĩ xem "không khớp" nghĩa là gì.']],
  loi: [['Believing Express returns 405 for a wrong method.', 'Tin rằng Express trả 405 khi sai phương thức.'], ['Thinking two PUTs with full objects merge their changes.', 'Nghĩ hai lần PUT với object đầy đủ sẽ gộp thay đổi của nhau.']],
  tns: [tn('lost update', 'mất cập nhật', 'Một lần ghi đè lặng lẽ xoá thay đổi của người khác.'), tn('HEAD', 'HEAD', 'Như GET nhưng không có body.')],
  kn: ['REST', 'Express'],
});

/* ── 3. Dựng URL REST từ một thao tác ── */
function restRoute(op) {
  // 1) the method carries the verb — the URL never does
  const METHOD = { list: 'GET', create: 'POST', read: 'GET', update: 'PATCH', replace: 'PUT', remove: 'DELETE' };
  const method = METHOD[op.action];
  if (!method) throw new RangeError('unknown action ' + op.action);
  // 2) a resource name becomes a lower-case, hyphenated, PLURAL path segment: noteTemplate -> note-templates
  const seg = (name) => {
    const kebab = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    if (/[^aeiou]y$/.test(kebab)) return kebab.slice(0, -1) + 'ies';
    if (/(s|x|ch|sh)$/.test(kebab)) return kebab + 'es';
    return kebab + 's';
  };
  const isItem = ['read', 'update', 'replace', 'remove'].includes(op.action);
  let path;
  if (isItem) {
    // 3) an ITEM is always addressed flat: /comments/9, never /notes/42/comments/9
    path = '/' + seg(op.resource) + '/' + op.id;
  } else if (op.parent) {
    // 4) a sub-collection nests exactly ONE level under its parent item
    path = '/' + seg(op.parent.resource) + '/' + op.parent.id + '/' + seg(op.resource);
  } else {
    path = '/' + seg(op.resource);
  }
  // 5) filters are optional and combinable -> they go in the QUERY STRING (only on a list)
  if (op.action === 'list' && op.filters) {
    const qs = Object.entries(op.filters).map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(String(v))).join('&');
    if (qs) path += '?' + qs;
  }
  return method + ' /api/v1' + path;
}
const E3 = jsBai({
  ten: '6.1 · 3 — Write restRoute(op): turn an operation into a REST endpoint', kho: 'MEDIUM', phut: 15,
  en: `<p>Your team keeps arguing about URLs, so you write the four rules of lesson 6.1 down as code. <code>restRoute(op)</code> receives an operation and returns the endpoint as <code>"METHOD /api/v1/path"</code>.</p>
<p><code>op = { action, resource, id?, parent?: { resource, id }, filters? }</code>, where <code>action</code> is one of <code>list</code> (GET), <code>create</code> (POST), <code>read</code> (GET), <code>update</code> (PATCH — partial), <code>replace</code> (PUT — full), <code>remove</code> (DELETE). <code>resource</code> is a singular camelCase name such as <code>note</code>, <code>noteTemplate</code>, <code>category</code>.</p>
<ul><li><b>Plural, lower case, hyphens</b>: <code>note</code> → <code>notes</code>, <code>noteTemplate</code> → <code>note-templates</code>, <code>category</code> → <code>categories</code> (consonant + y → ies), <code>box</code>/<code>class</code>/<code>match</code>/<code>wish</code> → add <code>es</code>, otherwise add <code>s</code>.</li>
<li><b>Items are flat</b>: read/update/replace/remove → <code>/&lt;plural&gt;/&lt;id&gt;</code>, even when a parent is given (<code>/comments/9</code>, not <code>/notes/42/comments/9</code>).</li>
<li><b>Nest at most one level</b>: list/create with a <code>parent</code> → <code>/&lt;parent plural&gt;/&lt;parent id&gt;/&lt;plural&gt;</code>.</li>
<li><b>Filters go in the query</b>: only for <code>list</code>, keys in the given order, <code>key=value</code> joined by <code>&amp;</code>, each part passed through <code>encodeURIComponent</code>; no <code>?</code> when there are no filters.</li></ul>`,
  vi: `<p>Nhóm bạn cãi nhau mãi về URL, nên bạn viết bốn luật của bài 6.1 thành code. <code>restRoute(op)</code> nhận một thao tác và trả về endpoint dạng <code>"METHOD /api/v1/path"</code>.</p>
<p><code>op = { action, resource, id?, parent?: { resource, id }, filters? }</code>, trong đó <code>action</code> là <code>list</code> (GET), <code>create</code> (POST), <code>read</code> (GET), <code>update</code> (PATCH — một phần), <code>replace</code> (PUT — toàn bộ), <code>remove</code> (DELETE). <code>resource</code> là tên số ít camelCase như <code>note</code>, <code>noteTemplate</code>, <code>category</code>.</p>
<ul><li><b>Số nhiều, chữ thường, gạch nối</b>: <code>note</code> → <code>notes</code>, <code>noteTemplate</code> → <code>note-templates</code>, <code>category</code> → <code>categories</code> (phụ âm + y → ies), <code>box</code>/<code>class</code>/<code>match</code>/<code>wish</code> → thêm <code>es</code>, còn lại thêm <code>s</code>.</li>
<li><b>Phần tử để phẳng</b>: read/update/replace/remove → <code>/&lt;số nhiều&gt;/&lt;id&gt;</code>, kể cả khi có parent (<code>/comments/9</code>, không phải <code>/notes/42/comments/9</code>).</li>
<li><b>Lồng tối đa một cấp</b>: list/create có <code>parent</code> → <code>/&lt;số nhiều của cha&gt;/&lt;id cha&gt;/&lt;số nhiều&gt;</code>.</li>
<li><b>Bộ lọc nằm ở query</b>: chỉ với <code>list</code>, khoá theo đúng thứ tự cho, <code>key=value</code> nối bằng <code>&amp;</code>, mỗi phần qua <code>encodeURIComponent</code>; không có bộ lọc thì không có <code>?</code>.</li></ul>`,
  yc: [['Return a string <code>"METHOD /api/v1/…"</code> — the verb lives only in the method.', 'Trả về chuỗi <code>"METHOD /api/v1/…"</code> — động từ chỉ nằm ở phương thức.'], ['Apply the plural / kebab-case rules exactly as listed.', 'Áp dụng đúng luật số nhiều / kebab-case như danh sách trên.'], ['Never nest an item URL; nest a sub-collection one level only.', 'Không bao giờ lồng URL phần tử; chỉ lồng bộ sưu tập con một cấp.']],
  goiY: [['Start with a map from action to method, then a helper <code>seg(name)</code> that does camelCase → kebab → plural.', 'Bắt đầu bằng bảng action → method, rồi một hàm phụ <code>seg(name)</code> làm camelCase → kebab → số nhiều.'], ['<code>name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()</code> gives the kebab form. Decide “item or collection” before looking at <code>parent</code>.', '<code>name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()</code> cho dạng kebab. Quyết định "phần tử hay bộ sưu tập" trước khi xét <code>parent</code>.']],
  loi: [['Putting the verb in the path (<code>/notes/42/updateTitle</code>) instead of choosing PATCH.', 'Đặt động từ vào đường dẫn (<code>/notes/42/updateTitle</code>) thay vì chọn PATCH.'], ['Building <code>/notes/42/comments/9</code> for a comment item — the deep URL the lesson tells you to flatten.', 'Dựng <code>/notes/42/comments/9</code> cho một bình luận — đúng kiểu URL sâu mà bài bảo phải làm phẳng.'], ['Turning filters into path segments (<code>/notes/tag/work</code>), which are neither optional nor combinable.', 'Biến bộ lọc thành đoạn đường dẫn (<code>/notes/tag/work</code>) — không tuỳ chọn được, không kết hợp được.']],
  gt: ['The method carries the verb, the URL names the noun. Items are addressed flat by id because an id is already unique — nesting it under its parent only creates a path that breaks when the hierarchy changes. Filters stay in the query because they are optional and can be combined in any order; path segments are neither.', 'Phương thức mang động từ, URL gọi tên danh từ. Phần tử được gọi phẳng theo id vì id đã là duy nhất — lồng nó dưới cha chỉ tạo ra đường dẫn gãy khi cấu trúc thay đổi. Bộ lọc ở query vì chúng tuỳ chọn và kết hợp theo thứ tự nào cũng được; đoạn đường dẫn thì không.'],
  kn: ['REST', 'URL design'],
  tns: [tn('collection', 'bộ sưu tập', '/notes'), tn('item', 'phần tử', '/notes/:id'), tn('kebab-case', 'chữ thường nối gạch', 'note-templates')],
  dau: `/** op => "METHOD /api/v1/path" */
function restRoute(op) {
  // Write your solution here
  const METHOD = { list: 'GET', create: 'POST', read: 'GET', update: 'PATCH', replace: 'PUT', remove: 'DELETE' };
  let path = '/' + op.resource + 's';
  if (op.id) path += '/' + op.id;
  return METHOD[op.action] + ' /api/v1' + path;
}
`,
  giai: restRoute,
  cases: [
    { goi: goi('restRoute', { action: 'list', resource: 'note', filters: { tag: 'work', pinned: true } }) },
    { goi: goi('restRoute', { action: 'update', resource: 'note', id: 42 }) },
    { goi: goi('restRoute', { action: 'create', resource: 'comment', parent: { resource: 'note', id: 42 } }) },
    { goi: goi('restRoute', { action: 'list', resource: 'noteTemplate' }) },
    { goi: goi('restRoute', { action: 'remove', resource: 'comment', id: 9, parent: { resource: 'note', id: 42 } }), an: true },
    { goi: goi('restRoute', { action: 'replace', resource: 'category', id: 3 }), an: true },
    { goi: goi('restRoute', { action: 'list', resource: 'userClass', parent: { resource: 'study', id: 7 }, filters: { q: 'node js', page: 2 } }), an: true },
    { goi: goi('restRoute', { action: 'read', resource: 'box', id: 1, filters: { tag: 'ignored' } }), an: true },
    { goi: goi('restRoute', { action: 'list', resource: 'key', filters: {} }), an: true },
  ],
  saiMau: [
    // nests the item under its parent
    restRoute.toString().replace("path = '/' + seg(op.resource) + '/' + op.id;", "path = (op.parent ? '/' + seg(op.parent.resource) + '/' + op.parent.id : '') + '/' + seg(op.resource) + '/' + op.id;"),
    // forgets the -ies/-es rules
    restRoute.toString().replace("if (/[^aeiou]y$/.test(kebab)) return kebab.slice(0, -1) + 'ies';", ''),
  ],
});

/* ── 4. PUT thay toàn bộ, PATCH đổi một phần ── */
function applyUpdate(method, stored, body) {
  const WRITABLE = ['title', 'body', 'pinned'];   // id, createdAt, version are the server's, never the client's
  const next = { ...stored };                      // never mutate what is stored
  if (method === 'PUT') {
    // "make the resource be EXACTLY this": a writable field you omit is erased
    for (const f of WRITABLE) next[f] = Object.prototype.hasOwnProperty.call(body, f) ? body[f] : null;
  } else if (method === 'PATCH') {
    // "change these fields, leave the rest": only fields the client actually sent
    for (const f of WRITABLE) if (Object.prototype.hasOwnProperty.call(body, f)) next[f] = body[f];
  } else {
    throw new RangeError('applyUpdate only handles PUT and PATCH');
  }
  next.version = stored.version + 1;               // every successful write bumps the version (lesson 6.5 builds on it)
  return next;
}
const NOTE = { id: 1, title: 'Original', body: 'original content', pinned: false, createdAt: '2026-07-27T15:00:00.000Z', version: 1 };
const E4 = jsBai({
  ten: '6.1 · 4 — Write applyUpdate(method, stored, body): PUT replaces, PATCH merges', kho: 'MEDIUM', phut: 15,
  en: `<p>Lesson 6.1: <b>PUT</b> means “make the resource be exactly this” — fields you omit are <b>erased</b>; <b>PATCH</b> means “change these fields, leave the rest”. Write <code>applyUpdate(method, stored, body)</code> that returns the NEW note (do not mutate <code>stored</code>):</p>
<ul><li>Writable fields are <code>title</code>, <code>body</code>, <code>pinned</code>. <code>id</code>, <code>createdAt</code> and <code>version</code> belong to the server: a client value for them is ignored.</li>
<li><code>PUT</code>: every writable field takes the value from <code>body</code>; a writable field missing from <code>body</code> becomes <code>null</code>.</li>
<li><code>PATCH</code>: only writable fields that are <b>present</b> in <code>body</code> change (a present <code>false</code> or <code>""</code> is still a change).</li>
<li>Both: <code>version</code> becomes <code>stored.version + 1</code>. Any other method ⇒ throw <code>RangeError</code>.</li></ul>
<p>The hidden cases replay the lesson’s two-editor story so you can watch the lost update happen with PUT and shrink with PATCH.</p>`,
  vi: `<p>Bài 6.1: <b>PUT</b> nghĩa là "hãy làm tài nguyên thành đúng thế này" — trường bạn bỏ sót bị <b>xoá</b>; <b>PATCH</b> nghĩa là "đổi những trường này, giữ phần còn lại". Viết <code>applyUpdate(method, stored, body)</code> trả về ghi chú MỚI (không sửa <code>stored</code>):</p>
<ul><li>Trường ghi được là <code>title</code>, <code>body</code>, <code>pinned</code>. <code>id</code>, <code>createdAt</code> và <code>version</code> thuộc về server: giá trị client gửi bị bỏ qua.</li>
<li><code>PUT</code>: mọi trường ghi được lấy giá trị từ <code>body</code>; trường thiếu trong <code>body</code> thành <code>null</code>.</li>
<li><code>PATCH</code>: chỉ trường ghi được <b>có mặt</b> trong <code>body</code> mới đổi (<code>false</code> hay <code>""</code> có mặt vẫn là thay đổi).</li>
<li>Cả hai: <code>version</code> thành <code>stored.version + 1</code>. Phương thức khác ⇒ ném <code>RangeError</code>.</li></ul>
<p>Các ca ẩn diễn lại câu chuyện hai người sửa của bài để bạn thấy mất cập nhật xảy ra với PUT và thu nhỏ lại với PATCH.</p>`,
  yc: [['Return a new object; <code>stored</code> must be unchanged.', 'Trả về object mới; <code>stored</code> không được đổi.'], ['Use “is the key present?” (<code>hasOwnProperty</code> / <code>in</code>), not “is the value truthy?”.', 'Dùng "khoá có mặt không?" (<code>hasOwnProperty</code> / <code>in</code>), không dùng "giá trị có truthy không?".'], ['Ignore <code>id</code>, <code>createdAt</code>, <code>version</code> sent by the client.', 'Bỏ qua <code>id</code>, <code>createdAt</code>, <code>version</code> do client gửi.']],
  goiY: [['Copy first: <code>const next = { ...stored }</code>. Then loop over the three writable fields.', 'Sao chép trước: <code>const next = { ...stored }</code>. Rồi lặp qua ba trường ghi được.'], ['PUT: <code>next[f] = f in body ? body[f] : null</code>. PATCH: only <code>if (f in body) next[f] = body[f]</code>.', 'PUT: <code>next[f] = f in body ? body[f] : null</code>. PATCH: chỉ <code>if (f in body) next[f] = body[f]</code>.']],
  loi: [['<code>Object.assign(stored, body)</code>: mutates the stored note AND lets the client overwrite <code>id</code> or <code>version</code>.', '<code>Object.assign(stored, body)</code>: sửa luôn ghi chú đã lưu VÀ cho client ghi đè <code>id</code> hay <code>version</code>.'], ['<code>if (body.pinned)</code> instead of “is it present?” — a PATCH that sets <code>pinned: false</code> is silently ignored.', '<code>if (body.pinned)</code> thay vì "có mặt không?" — PATCH đặt <code>pinned: false</code> bị bỏ qua lặng lẽ.'], ['Treating PUT like PATCH, so a partial PUT keeps old fields and the client never learns PUT erases.', 'Coi PUT như PATCH, nên PUT thiếu trường vẫn giữ trường cũ và client không bao giờ biết PUT xoá.']],
  gt: ['PUT and PATCH differ only in what an ABSENT field means: erased vs untouched. That is why a form that sends only what changed wants PATCH, and why a PUT built from a stale copy writes old values back over someone else’s edit. Neither method detects that the copy was stale — only an ETag/If-Match or a version check does (lesson 6.5, 7.6).', 'PUT và PATCH chỉ khác ở ý nghĩa của trường VẮNG MẶT: bị xoá hay giữ nguyên. Vì thế form chỉ gửi phần đã đổi cần PATCH, và PUT dựng từ bản cũ ghi lại giá trị cũ lên chỉnh sửa của người khác. Không phương thức nào phát hiện bản đã cũ — chỉ ETag/If-Match hay kiểm version mới làm được (bài 6.5, 7.6).'],
  kn: ['PUT vs PATCH', 'lost update'],
  tns: [tn('full replace', 'thay toàn bộ', 'PUT'), tn('partial update', 'cập nhật một phần', 'PATCH'), tn('server-owned field', 'trường do server quản', 'id, createdAt, version')],
  dau: `/** returns the new note after PUT or PATCH */
function applyUpdate(method, stored, body) {
  // Write your solution here
  return Object.assign(stored, body);
}
`,
  giai: applyUpdate,
  cases: [
    { goi: goi('applyUpdate', 'PATCH', NOTE, { title: 'A changed the title' }), moTa: ['PATCH only the title', 'PATCH chỉ tiêu đề'] },
    { goi: goi('applyUpdate', 'PUT', NOTE, { title: 'A changed the title' }), moTa: ['PUT with only the title erases body and pinned', 'PUT chỉ có tiêu đề xoá body và pinned'] },
    { goi: goi('applyUpdate', 'PATCH', NOTE, { pinned: false, body: '' }), moTa: ['PATCH with false and "" still changes', 'PATCH với false và "" vẫn là thay đổi'] },
    { goi: `(() => { const s = ${JSON.stringify(NOTE)}; applyUpdate('PATCH', s, { title: 'x', id: 99, version: 50 }); return s; })()`, moTa: ['stored is not mutated', 'stored không bị sửa'] },
    { goi: goi('applyUpdate', 'PATCH', NOTE, { id: 99, version: 50, createdAt: '2020-01-01', isAdmin: true }), an: true },
    { goi: `(() => { const s = ${JSON.stringify(NOTE)}; const a = applyUpdate('PUT', s, { title: 'A changed the title', body: s.body, pinned: s.pinned }); return applyUpdate('PUT', a, { title: s.title, body: 'B changed the content', pinned: s.pinned }); })()`, an: true, moTa: ['Two PUTs from stale copies: A’s title is lost', 'Hai PUT từ bản cũ: tiêu đề của A mất'] },
    { goi: `(() => { const s = ${JSON.stringify(NOTE)}; const a = applyUpdate('PATCH', s, { title: 'A changed the title' }); return applyUpdate('PATCH', a, { body: 'B changed the content' }); })()`, an: true, moTa: ['Two PATCHes on different fields: both survive', 'Hai PATCH trên hai trường khác nhau: cả hai còn'] },
    { goi: goi('applyUpdate', 'POST', NOTE, {}), an: true, nem: 'RangeError' },
  ],
  saiMau: [
    applyUpdate.toString().replace('if (Object.prototype.hasOwnProperty.call(body, f)) next[f] = body[f];', 'if (body[f]) next[f] = body[f];'),
    applyUpdate.toString().replace("for (const f of WRITABLE) next[f] = Object.prototype.hasOwnProperty.call(body, f) ? body[f] : null;", 'Object.assign(next, body);'),
  ],
});

/* ── 5. Một API Notes nhỏ: idempotent thật, HEAD/OPTIONS miễn phí, 404 khi sai phương thức ── */
function createNotesApi() {
  const notes = new Map();
  let nextId = 1;
  const json = (status, body, headers = {}) => ({ status, headers: { 'content-type': 'application/json', ...headers }, body });
  const notFound = (id) => json(404, { error: { code: 'NOTE_NOT_FOUND', message: 'Note ' + id + ' does not exist' } });
  // the route table, in declaration order — like app.get / app.post in Express
  const routes = [
    { method: 'GET', re: /^\/notes$/, run: () => json(200, { items: [...notes.values()] }) },
    { method: 'POST', re: /^\/notes$/, run: (req) => {
      const note = { id: nextId++, title: req.body.title, body: req.body.body ?? '' };
      notes.set(note.id, note);                                    // POST is NOT idempotent: a new row every call
      return json(201, note, { location: '/notes/' + note.id });
    } },
    { method: 'GET', re: /^\/notes\/(\d+)$/, run: (req, id) => (notes.has(id) ? json(200, notes.get(id)) : notFound(id)) },
    { method: 'PUT', re: /^\/notes\/(\d+)$/, run: (req, id) => {
      if (!notes.has(id)) return notFound(id);
      const note = { id, title: req.body.title ?? null, body: req.body.body ?? null };  // omitted = erased
      notes.set(id, note);
      return json(200, note);
    } },
    { method: 'PATCH', re: /^\/notes\/(\d+)$/, run: (req, id) => {
      if (!notes.has(id)) return notFound(id);
      const note = { ...notes.get(id) };
      for (const f of ['title', 'body']) if (f in req.body) note[f] = req.body[f];                              // omitted = untouched
      notes.set(id, note);
      return json(200, note);
    } },
    { method: 'DELETE', re: /^\/notes\/(\d+)$/, run: (req, id) => {
      if (!notes.delete(id)) return notFound(id);                 // second DELETE: 404, state unchanged
      return { status: 204, headers: {}, body: null };            // 204 means EMPTY
    } },
  ];
  function handle(req) {
    const matching = routes.filter((r) => r.re.test(req.path));
    if (req.method === 'OPTIONS' && matching.length) {
      // Express answers OPTIONS from the routes that match the path; GET implies HEAD
      const allow = [];
      for (const r of matching) { allow.push(r.method); if (r.method === 'GET') allow.push('HEAD'); }
      return { status: 200, headers: { allow: allow.join(', ') }, body: null };
    }
    const lookFor = req.method === 'HEAD' ? 'GET' : req.method;   // HEAD runs the GET handler
    const route = matching.find((r) => r.method === lookFor);
    if (!route) return json(404, { error: { code: 'NOT_FOUND', message: 'Cannot ' + req.method + ' ' + req.path } });  // no 405 for free
    const m = route.re.exec(req.path);
    const res = route.run(req, m[1] ? Number(m[1]) : undefined);
    return req.method === 'HEAD' ? { ...res, body: null } : res;  // ...and drops the body
  }
  return { handle };
}
const E5 = jsBai({
  ten: '6.1 · 5 — Write createNotesApi(): idempotency you can test, HEAD and OPTIONS for free, 404 not 405', kho: 'HARD', phut: 30,
  en: `<p>Rebuild the tiny Notes server of lesson 6.1 as a pure function so the grader can call it like curl. <code>createNotesApi()</code> returns <code>{ handle(req) }</code>; <code>req = { method, path, body? }</code>; <code>handle</code> returns <code>{ status, headers, body }</code> (header names lower case). Notes live in memory; ids start at 1.</p>
<ul><li><code>GET /notes</code> → 200 <code>{ items: [...] }</code> (insertion order). <code>POST /notes</code> <code>{ title, body? }</code> → 201, body = the new note <code>{ id, title, body: body ?? "" }</code>, header <code>location: /notes/&lt;id&gt;</code>.</li>
<li><code>GET /notes/:id</code> → 200 note. <code>PUT</code> → replaces <code>title</code> and <code>body</code> (omitted ⇒ <code>null</code>). <code>PATCH</code> → changes only the fields present. <code>DELETE</code> → 204 with body <code>null</code> and headers <code>{}</code>.</li>
<li>Unknown id on GET/PUT/PATCH/DELETE → 404 <code>{ error: { code: "NOTE_NOT_FOUND", message: "Note 42 does not exist" } }</code>.</li>
<li>Every JSON response has header <code>content-type: application/json</code>.</li>
<li><b>HEAD</b> on any GET path → exactly what GET returns, but <code>body: null</code>.</li>
<li><b>OPTIONS</b> on a known path → 200, body <code>null</code>, header <code>allow</code>: the methods of that path in declaration order, with <code>HEAD</code> right after <code>GET</code> — <code>"GET, HEAD, POST"</code> for <code>/notes</code>, <code>"GET, HEAD, PUT, PATCH, DELETE"</code> for <code>/notes/1</code>.</li>
<li>A method the path does not have (e.g. <code>DELETE /notes</code>), or an unknown path → 404 <code>{ error: { code: "NOT_FOUND", message: "Cannot DELETE /notes" } }</code> — like Express, no 405.</li></ul>`,
  vi: `<p>Dựng lại server Notes nhỏ của bài 6.1 thành hàm thuần để máy chấm gọi như curl. <code>createNotesApi()</code> trả <code>{ handle(req) }</code>; <code>req = { method, path, body? }</code>; <code>handle</code> trả <code>{ status, headers, body }</code> (tên header chữ thường). Ghi chú nằm trong bộ nhớ; id bắt đầu từ 1.</p>
<ul><li><code>GET /notes</code> → 200 <code>{ items: [...] }</code> (theo thứ tự thêm). <code>POST /notes</code> <code>{ title, body? }</code> → 201, body = ghi chú mới <code>{ id, title, body: body ?? "" }</code>, header <code>location: /notes/&lt;id&gt;</code>.</li>
<li><code>GET /notes/:id</code> → 200 ghi chú. <code>PUT</code> → thay <code>title</code> và <code>body</code> (thiếu ⇒ <code>null</code>). <code>PATCH</code> → chỉ đổi trường có mặt. <code>DELETE</code> → 204 với body <code>null</code> và headers <code>{}</code>.</li>
<li>Id không có ở GET/PUT/PATCH/DELETE → 404 <code>{ error: { code: "NOTE_NOT_FOUND", message: "Note 42 does not exist" } }</code>.</li>
<li>Mọi phản hồi JSON có header <code>content-type: application/json</code>.</li>
<li><b>HEAD</b> trên đường dẫn có GET → đúng như GET trả, nhưng <code>body: null</code>.</li>
<li><b>OPTIONS</b> trên đường dẫn đã biết → 200, body <code>null</code>, header <code>allow</code>: các phương thức của đường dẫn theo thứ tự khai báo, <code>HEAD</code> đứng ngay sau <code>GET</code> — <code>"GET, HEAD, POST"</code> cho <code>/notes</code>, <code>"GET, HEAD, PUT, PATCH, DELETE"</code> cho <code>/notes/1</code>.</li>
<li>Phương thức mà đường dẫn không có (vd <code>DELETE /notes</code>) hoặc đường dẫn lạ → 404 <code>{ error: { code: "NOT_FOUND", message: "Cannot DELETE /notes" } }</code> — như Express, không có 405.</li></ul>`,
  yc: [['Two identical POSTs create two notes; two identical PUTs leave one state; two DELETEs answer 204 then 404.', 'Hai POST giống nhau tạo hai ghi chú; hai PUT giống nhau để lại một trạng thái; hai DELETE trả 204 rồi 404.'], ['HEAD and OPTIONS come from the route table — do not hand-write them per path.', 'HEAD và OPTIONS suy ra từ bảng route — đừng viết tay cho từng đường dẫn.'], ['Wrong method on a real path is 404, exactly like Express.', 'Sai phương thức trên đường dẫn thật là 404, đúng như Express.']],
  goiY: [['Keep a route table <code>[{ method, re, run }]</code> in declaration order, like Express’s stack. <code>handle</code> first collects the routes whose regex matches the path.', 'Giữ một bảng route <code>[{ method, re, run }]</code> theo thứ tự khai báo, như stack của Express. <code>handle</code> trước hết gom các route có regex khớp đường dẫn.'], ['OPTIONS = the matching routes’ methods (push HEAD after GET). HEAD = find the GET route, run it, then return <code>{ ...res, body: null }</code>. Nothing matched by method ⇒ 404.', 'OPTIONS = phương thức của các route khớp (đẩy HEAD sau GET). HEAD = tìm route GET, chạy nó, rồi trả <code>{ ...res, body: null }</code>. Không route nào khớp phương thức ⇒ 404.']],
  loi: [['Answering 405 for <code>DELETE /notes</code> — a good idea in general, but not what Express does by itself, and the lesson’s point is to recognise that 404.', 'Trả 405 cho <code>DELETE /notes</code> — ý hay nói chung, nhưng Express tự nó không làm thế, và ý của bài là nhận ra cái 404 đó.'], ['<code>res.status(204).json({ ok: true })</code>: a body with “no content”. 204 must be empty.', '<code>res.status(204).json({ ok: true })</code>: một body "không có nội dung". 204 phải rỗng.'], ['Making POST idempotent by de-duplicating on title — the lesson shows the second POST really creates note 2; idempotency for POST needs a key (6.5).', 'Làm POST idempotent bằng cách lọc trùng theo tiêu đề — bài cho thấy POST thứ hai thật sự tạo ghi chú 2; POST muốn idempotent cần khoá (6.5).']],
  gt: ['Express keeps a stack of (method, path) layers and walks it in order; a request is answered by the first layer whose method AND path match. That single rule explains all three “free” behaviours: HEAD finds the GET layer and drops the body; OPTIONS lists the methods of every layer whose path matches; and a wrong method simply matches nothing, so the final handler says 404. The idempotency checks are the lesson’s curl experiments, replayed.', 'Express giữ một stack các lớp (method, path) và duyệt theo thứ tự; request được trả lời bởi lớp đầu tiên khớp CẢ phương thức lẫn đường dẫn. Một luật đó giải thích cả ba hành vi "miễn phí": HEAD tìm lớp GET rồi bỏ body; OPTIONS liệt kê phương thức của mọi lớp có đường dẫn khớp; còn sai phương thức thì không khớp gì, nên handler cuối nói 404. Các kiểm idempotent chính là các thí nghiệm curl của bài, chạy lại.'],
  kn: ['REST', 'Express routing', 'idempotency'],
  tns: [tn('route table', 'bảng route', 'Danh sách (method, path) theo thứ tự khai báo.'), tn('Allow header', 'header Allow', 'Các phương thức đường dẫn này hỗ trợ.'), tn('405 Method Not Allowed', '405', 'Express không tự gửi mã này.')],
  dau: `/** a tiny in-memory Notes API: createNotesApi().handle({ method, path, body }) */
function createNotesApi() {
  const notes = new Map();
  let nextId = 1;
  function handle(req) {
    // Write your solution here
    if (req.method === 'POST' && req.path === '/notes') {
      const note = { id: nextId++, title: req.body.title, body: req.body.body ?? '' };
      notes.set(note.id, note);
      return { status: 201, headers: { 'content-type': 'application/json' }, body: note };
    }
    return { status: 405, headers: {}, body: null };
  }
  return { handle };
}
`,
  giai: createNotesApi,
  chung: `const api = createNotesApi(); const H = (method, path, body) => api.handle({ method, path, body });`,
  cases: [
    { goi: `[H('POST', '/notes', { title: 'A' }), H('POST', '/notes', { title: 'A' })]`, moTa: ['POST twice ⇒ two notes (201 + Location)', 'POST hai lần ⇒ hai ghi chú (201 + Location)'] },
    { goi: `(H('POST', '/notes', { title: 'A' }), [H('DELETE', '/notes/1'), H('DELETE', '/notes/1')])`, moTa: ['DELETE twice ⇒ 204 then 404', 'DELETE hai lần ⇒ 204 rồi 404'] },
    { goi: `(H('POST', '/notes', { title: 'A', body: 'x' }), [H('HEAD', '/notes/1'), H('GET', '/notes/1')])`, moTa: ['HEAD = GET without the body', 'HEAD = GET không có body'] },
    { goi: `[H('OPTIONS', '/notes'), H('OPTIONS', '/notes/7')]`, moTa: ['OPTIONS lists the methods (Allow)', 'OPTIONS liệt kê phương thức (Allow)'] },
    { goi: `[H('DELETE', '/notes'), H('GET', '/getNotes')]`, moTa: ['Wrong method / unknown path ⇒ 404, not 405', 'Sai phương thức / đường dẫn lạ ⇒ 404, không phải 405'] },
    { goi: `(H('POST', '/notes', { title: 'T', body: 'B' }), [H('PUT', '/notes/1', { title: 'dark' }), H('PUT', '/notes/1', { title: 'dark' }), H('GET', '/notes')])`, an: true, moTa: ['PUT twice: same state, omitted body erased', 'PUT hai lần: cùng trạng thái, body thiếu bị xoá'] },
    { goi: `(H('POST', '/notes', { title: 'T', body: 'B' }), [H('PATCH', '/notes/1', { body: '' }), H('PATCH', '/notes/9', { body: 'x' }), H('HEAD', '/notes/9')])`, an: true },
    { goi: `[H('GET', '/notes'), H('HEAD', '/notes'), H('PUT', '/notes'), H('OPTIONS', '/nothing')]`, an: true },
  ],
  saiMau: [
    createNotesApi.toString().replace("if (r.method === 'GET') allow.push('HEAD');", ''),
    createNotesApi.toString().replace("return req.method === 'HEAD' ? { ...res, body: null } : res;", 'return res;'),
  ],
});

export default modul('nodejs-6-1-tai-nguyen-phuong-thuc', '6.1 Resources, methods and what REST actually means', [E1, E2, E3, E4, E5]);
