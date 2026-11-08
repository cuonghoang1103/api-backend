/** Node.js 9.3 — Đầu vào là kẻ thù: ReDoS, ô nhiễm nguyên mẫu, giới hạn thân request, SSRF (số đo thật của bài). */
import { modul, cs, q, qn, tn, jsBai, nguon, MOI_TRUONG } from './_node-c9-11.mjs';

/* ─── 1. EASY · choice ─── */
const E1 = cs({
  ten: 'Four requests that look completely normal', kho: 'EASY', phut: 10,
  en: 'ReDoS, prototype pollution, body limits and SSRF: none needs a password or a stolen token. Answer from the lesson’s measurements (the timings in question 1 were re-measured on Node 22.23).',
  vi: 'ReDoS, ô nhiễm nguyên mẫu, giới hạn thân request và SSRF: không cái nào cần mật khẩu hay token bị trộm. Trả lời theo số đo của bài (thời gian ở câu 1 đo lại trên Node 22.23).',
  cau: [
    qn('r1', ['Which of these regexes can freeze the event loop on a short crafted input? (choose all)', 'Regex nào có thể làm đứng event loop với một input ngắn được dựng sẵn? (chọn mọi câu đúng)'],
      ['<code>/^(a+)+$/</code>', '<code>/^(a|aa)+$/</code> — 32 a’s and a "!" took 282 ms', '<code>/^([\\s\\S]*?)(\\s+)+$/</code> — 24 spaces and an "x" took 1.2 s', '<code>/^[a-z0-9-]+$/</code> — 100,000 chars took 0.4 ms', '<code>/^\\d{1,5}$/</code>'],
      [0, 1, 2],
      ['A quantifier wrapping a group that already has one — (a+)+, (\\s+)+ — or alternatives that match the same text — (a|aa)+ — backtrack exponentially when the match must fail. A single character class with one quantifier is linear.', 'Một lượng từ bọc nhóm đã có lượng từ — (a+)+, (\\s+)+ — hoặc các nhánh khớp cùng chữ — (a|aa)+ — quay lui theo hàm mũ khi phải khớp thất bại. Một lớp ký tự với một lượng từ là tuyến tính.']),
    q('r2', ['A teammate proposes "a 50 ms timeout on the regex" against ReDoS. What does the lesson say?', 'Đồng đội đề xuất "đặt timeout 50 ms cho regex" để chống ReDoS. Bài nói gì?'],
      ['It cannot work: JavaScript is single-threaded and nothing can interrupt a running RegExp — cap the length first', 'It works if you wrap the test in a Promise with setTimeout and reject after 50 ms', 'It works with express.json({ timeout: 50 }), which aborts slow parsing', 'It is the recommended fix; capping the length only moves the problem'],
      ['The timer callback cannot run while the regex holds the loop. Validate max length (zod .max(200)) before any regex touches the value; the only real timeout is a worker thread.', 'Callback của hẹn giờ không chạy được khi regex đang giữ vòng lặp. Kiểm độ dài tối đa (zod .max(200)) trước khi regex đụng vào giá trị; timeout thật duy nhất là một worker thread.']),
    q('r3', ['<code>Object.keys(JSON.parse(\'{"__proto__":{"isAdmin":true}}\'))</code> — what is it?', '<code>Object.keys(JSON.parse(\'{"__proto__":{"isAdmin":true}}\'))</code> là gì?'],
      ['<code>["__proto__"]</code> — JSON.parse makes it a real own key, ready for a merge helper to walk into', '<code>[]</code> — JSON.parse treats __proto__ specially and sets the prototype instead', '<code>["isAdmin"]</code> — the nested object is flattened into the result', 'It throws a SyntaxError because __proto__ is a reserved key in JSON'],
      ['Verified on Node 22: JSON.parse creates an own property named "__proto__" (an object LITERAL would set the prototype instead). The hole is the recursive merge that then does target["__proto__"] — which is Object.prototype.', 'Kiểm trên Node 22: JSON.parse tạo thuộc tính riêng tên "__proto__" (object LITERAL thì lại đặt nguyên mẫu). Lỗ hổng là hàm merge đệ quy sau đó làm target["__proto__"] — chính là Object.prototype.']),
    q('r4', ['<code>express.json()</code> with no options receives a 200 KB body. What happens?', '<code>express.json()</code> không tuỳ chọn nhận thân 200 KB. Chuyện gì xảy ra?'],
      ['413 with type entity.too.large and limit 102400 — the default is 100kb', '200: the default limit is 1mb, so 200 KB is parsed normally', '500: the parser throws and the default error handler prints the stack', '400: express.json rejects bodies larger than the Content-Length header'],
      ['Measured: 90KB → 200, 200KB → 413 {"type":"entity.too.large","limit":102400}. Raising it to 20mb globally cost +139 MB RSS for ONE 11.3 MB request.', 'Đo được: 90KB → 200, 200KB → 413 {"type":"entity.too.large","limit":102400}. Nâng toàn cục lên 20mb tốn +139 MB RSS cho MỘT request 11,3 MB.']),
    q('r5', ['The route checks <code>https:</code> and an allow-listed host, then calls <code>fetch(url)</code>. The attacker’s allowed host answers 302 to <code>http://127.0.0.1:4404/admin/config</code>. Result?', 'Route kiểm <code>https:</code> và host trong danh sách trắng rồi gọi <code>fetch(url)</code>. Host được phép của kẻ tấn công trả 302 về <code>http://127.0.0.1:4404/admin/config</code>. Kết quả?'],
      ['200 with DATABASE_URL and R2_SECRET: fetch followed the redirect and only the first URL was checked', '400: fetch refuses redirects from https to plain http by default', '400: the allow-list check runs again automatically on every hop', 'fetch failed: undici does not allow requests to 127.0.0.1 from a server'],
      ['fetch follows redirects by default. Use redirect: \'manual\' and re-validate every hop — or better, do not take URLs at all.', 'fetch mặc định đi theo chuyển hướng. Dùng redirect: \'manual\' và kiểm lại từng bước — hay tốt hơn, đừng nhận URL.']),
  ],
  goiY: [['ReDoS: look for a quantifier on a group that already ends with a quantifier over the same characters.', 'ReDoS: tìm lượng từ trên một nhóm vốn đã kết thúc bằng lượng từ trên cùng loại ký tự.'], ['SSRF and body limits: the request that hurts you is a VALID one — ask what the server does next, not whether the input is well-formed.', 'SSRF và giới hạn thân: request làm hại bạn là request HỢP LỆ — hỏi máy chủ làm gì tiếp theo, đừng hỏi input có đúng dạng không.']],
  loi: [['Believing a timeout can stop a running regex.', 'Tin rằng timeout chặn được regex đang chạy.'], ['Thinking JSON.parse "cleans" input of __proto__.', 'Nghĩ rằng JSON.parse "làm sạch" __proto__ khỏi input.']],
  tns: [tn('catastrophic backtracking', 'quay lui thảm hoạ', 'thời gian tăng theo hàm mũ khi khớp thất bại'), tn('prototype pollution', 'ô nhiễm nguyên mẫu', 'sửa Object.prototype ⇒ mọi object kế thừa'), tn('SSRF', 'giả mạo request phía máy chủ', 'máy chủ của bạn đi lấy URL nội bộ thay kẻ tấn công')],
  kn: ['ReDoS', 'prototype pollution', 'SSRF'],
});

/* ─── 2. EASY · js — safeMerge ─── */
function safeMerge(target, src) {
  // These three keys are how a merge reaches Object.prototype:
  //   target['__proto__']            IS Object.prototype
  //   target['constructor'].prototype IS Object.prototype
  const DANGEROUS = new Set(['__proto__', 'constructor', 'prototype']);
  for (const k of Object.keys(src)) {
    if (DANGEROUS.has(k)) continue;                       // skip — never walk into them
    const v = src[k];
    if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
      // Only recurse into an own plain-object slot; anything else is replaced by a fresh object.
      const cur = Object.prototype.hasOwnProperty.call(target, k) ? target[k] : undefined;
      target[k] = safeMerge(typeof cur === 'object' && cur !== null && !Array.isArray(cur) ? cur : {}, v);
    } else {
      target[k] = Array.isArray(v) ? v.slice() : v;       // arrays and primitives are copied, not merged
    }
  }
  return target;
}

const E2 = jsBai({
  ten: 'Fix the deep merge before everyone becomes admin', kho: 'EASY', phut: 12,
  en: `<p>The lesson’s <code>merge(target, src)</code> made <code>({}).isAdmin === true</code> for every object in the process, from one JSON key. Write <code>safeMerge(target, src)</code>:</p>
<ul><li>for every own key of <code>src</code>: skip <code>__proto__</code>, <code>constructor</code> and <code>prototype</code>;</li>
<li>a plain-object value is merged recursively into <code>target[k]</code> (start from <code>{}</code> if <code>target</code> has no own plain object there);</li>
<li>arrays are copied (<code>slice()</code>), other values assigned;</li>
<li>return <code>target</code> (it is modified in place).</li></ul>
<p>The tests merge objects that come from <code>JSON.parse</code> — exactly like <code>req.body</code> — and then look at a brand-new <code>{}</code>.</p>${MOI_TRUONG.en}`,
  vi: `<p>Hàm <code>merge(target, src)</code> trong bài khiến <code>({}).isAdmin === true</code> với mọi object trong tiến trình, chỉ từ một khoá JSON. Viết <code>safeMerge(target, src)</code>:</p>
<ul><li>với mỗi khoá riêng của <code>src</code>: bỏ qua <code>__proto__</code>, <code>constructor</code> và <code>prototype</code>;</li>
<li>giá trị là object thường thì trộn đệ quy vào <code>target[k]</code> (bắt đầu từ <code>{}</code> nếu <code>target</code> không có object thường riêng ở đó);</li>
<li>mảng thì chép (<code>slice()</code>), giá trị khác thì gán;</li>
<li>trả về <code>target</code> (bị sửa tại chỗ).</li></ul>
<p>Bộ kiểm trộn các object đến từ <code>JSON.parse</code> — đúng như <code>req.body</code> — rồi nhìn vào một <code>{}</code> mới tinh.</p>${MOI_TRUONG.vi}`,
  goiY: [['Start from the lesson’s merge and add one line: <code>if (k === "__proto__" || …) continue;</code>.', 'Bắt đầu từ merge của bài và thêm một dòng: <code>if (k === "__proto__" || …) continue;</code>.'], ['<code>constructor</code> matters too: <code>target.constructor</code> is the <code>Object</code> function, and its <code>.prototype</code> is the same Object.prototype.', '<code>constructor</code> cũng quan trọng: <code>target.constructor</code> là hàm <code>Object</code>, và <code>.prototype</code> của nó cũng chính là Object.prototype.'], ['<code>target[k] ??= {}</code> reads INHERITED properties — use <code>hasOwnProperty</code> to decide whether to reuse the slot.', '<code>target[k] ??= {}</code> đọc cả thuộc tính KẾ THỪA — dùng <code>hasOwnProperty</code> để quyết có dùng lại ô đó không.']],
  loi: [['Blocking only <code>__proto__</code>: <code>{"constructor":{"prototype":{"isAdmin":true}}}</code> pollutes just the same.', 'Chỉ chặn <code>__proto__</code>: <code>{"constructor":{"prototype":{"isAdmin":true}}}</code> vẫn làm ô nhiễm y như vậy.'], ['Checking only the top level: the dangerous key can be nested, <code>{"settings":{"__proto__":{…}}}</code>.', 'Chỉ kiểm tầng ngoài: khoá nguy hiểm có thể nằm sâu, <code>{"settings":{"__proto__":{…}}}</code>.'], ['Thinking Express’s query parser is the hole — the lesson measured both parsers clean; the hole is the helper you wrote afterwards.', 'Nghĩ parser query của Express là lỗ hổng — bài đo cả hai parser đều sạch; lỗ hổng là helper bạn viết sau đó.']],
  gt: ['Pollution happens when a recursive copy follows a key that resolves to a SHARED object. <code>__proto__</code> and <code>constructor.prototype</code> both lead to Object.prototype, so skipping those names (at every level, because the function recurses) closes the path. Reusing only OWN plain-object slots means even an inherited property can never become the merge target. Validating with a schema first (zod drops unknown keys) and using <code>Map</code> / <code>Object.create(null)</code> for user-keyed data are the stronger layers the lesson lists.', 'Ô nhiễm xảy ra khi một phép chép đệ quy đi theo một khoá dẫn tới object DÙNG CHUNG. <code>__proto__</code> và <code>constructor.prototype</code> đều dẫn tới Object.prototype, nên bỏ qua các tên đó (ở mọi tầng, vì hàm đệ quy) là đóng đường. Chỉ dùng lại ô object thường RIÊNG nghĩa là thuộc tính kế thừa không bao giờ thành đích trộn. Kiểm bằng schema trước (zod bỏ khoá lạ) và dùng <code>Map</code> / <code>Object.create(null)</code> cho dữ liệu khoá do người dùng đặt là các lớp mạnh hơn mà bài liệt kê.'],
  kn: ['prototype pollution', 'recursion'],
  tns: [tn('own property', 'thuộc tính riêng', 'nằm trên chính object, không kế thừa'), tn('Object.prototype', 'nguyên mẫu gốc', 'mọi object thường kế thừa từ đây')],
  dau: `/** Deep-merge src into target without ever touching Object.prototype. */
function safeMerge(target, src) {
  // Write your solution here (this is the lesson's vulnerable merge)
  for (const k of Object.keys(src)) {
    if (typeof src[k] === 'object' && src[k] !== null) { target[k] ??= {}; safeMerge(target[k], src[k]); }
    else target[k] = src[k];
  }
  return target;
}
`,
  giai: '// Reference solution\n' + nguon(safeMerge),
  cases: [
    { goi: `(() => { const user = { name: 'An' }; safeMerge(user, JSON.parse('{"__proto__":{"isAdmin":true}}')); return [user, ({}).isAdmin === undefined]; })()`, moTa: ['The lesson’s payload does not reach Object.prototype', 'Payload của bài không chạm tới Object.prototype'] },
    { goi: `safeMerge({ name: 'An', prefs: { theme: 'light', size: 14 } }, JSON.parse('{"prefs":{"theme":"dark"},"tags":["a","b"]}'))`, moTa: ['A normal deep merge still works', 'Trộn sâu bình thường vẫn chạy'] },
    { goi: `(() => { safeMerge({}, JSON.parse('{"constructor":{"prototype":{"isAdmin":true}}}')); return ({}).isAdmin === undefined; })()`, moTa: ['constructor.prototype is blocked too', 'constructor.prototype cũng bị chặn'] },
    { goi: `(() => { const r = safeMerge({ a: 1 }, JSON.parse('{"settings":{"__proto__":{"role":"admin"},"lang":"vi"}}')); return [r, ({}).role === undefined, r.settings.role === undefined]; })()`, an: true },
    { goi: `(() => { const t = { list: [1] }; const src = JSON.parse('{"list":[2,3],"n":null,"deep":{"x":{"y":1}}}'); const r = safeMerge(t, src); src.list.push(9); return r; })()`, an: true },
    { goi: `(() => { const r = safeMerge({}, JSON.parse('{"toString":{"x":1}}')); return [Object.keys(r), typeof ({}).toString, r.toString]; })()`, an: true },
  ],
});

/* ─── 3. MEDIUM · js — kiểm đầu vào: chặn độ dài TRƯỚC regex, bỏ khoá lạ ─── */
function validateNote(body) {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) return { ok: false, errors: [{ path: 'body', code: 'INVALID' }] };
  const errors = [];
  // title: cap the LENGTH before anything else touches it; trim with a linear built-in, not a "clever" regex.
  let title;
  if (typeof body.title !== 'string') errors.push({ path: 'title', code: 'REQUIRED' });
  else if (body.title.length > 200) errors.push({ path: 'title', code: 'TOO_LONG' });
  else {
    title = body.title.trim();
    if (!title.length) errors.push({ path: 'title', code: 'TOO_SHORT' });
  }
  // tags: optional, but bound the array (count) as well as each item (length) — a small body can still hold 5,000 items.
  let tags = [];
  if (body.tags !== undefined) {
    if (!Array.isArray(body.tags)) errors.push({ path: 'tags', code: 'INVALID' });
    else if (body.tags.length > 20) errors.push({ path: 'tags', code: 'TOO_MANY' });
    else {
      body.tags.forEach((t, i) => {
        if (typeof t !== 'string' || t.length < 1 || t.length > 30) errors.push({ path: 'tags.' + i, code: 'INVALID' });
        else if (!/^[a-z0-9-]+$/.test(t)) errors.push({ path: 'tags.' + i, code: 'INVALID' });   // runs only on ≤ 30 chars
      });
      tags = body.tags.slice();
    }
  }
  if (errors.length) return { ok: false, errors };
  // Build a NEW object with only the known keys: isAdmin, __proto__, ownerId… never reach the service.
  return { ok: true, value: { title, tags } };
}

const E3 = jsBai({
  ten: 'Validate a note: cap first, then check, then strip', kho: 'MEDIUM', phut: 18,
  en: `<p>The lesson’s rules for input: <b>cap the length before any regex</b>, prefer linear built-ins (<code>trim</code>, not <code>/^([\\s\\S]*?)(\\s+)+$/</code>), <b>bound arrays</b>, and let the schema <b>drop unknown keys</b> (zod’s <code>.object()</code>). Write <code>validateNote(body)</code> for <code>POST /notes</code>:</p>
<ul><li><code>body</code> must be a plain object, else <code>{ ok:false, errors:[{ path:'body', code:'INVALID' }] }</code>;</li>
<li><code>title</code>: not a string → <code>REQUIRED</code>; longer than 200 (raw length) → <code>TOO_LONG</code>; empty after <code>trim()</code> → <code>TOO_SHORT</code>; the value kept is the trimmed one;</li>
<li><code>tags</code>: optional (default <code>[]</code>); not an array → <code>path:'tags', INVALID</code>; more than 20 → <code>TOO_MANY</code>; each item must be a string of 1–30 chars matching <code>/^[a-z0-9-]+$/</code>, else <code>path:'tags.&lt;i&gt;', INVALID</code>;</li>
<li>collect errors in that order (title, then tags); with errors return <code>{ ok:false, errors }</code>, otherwise <code>{ ok:true, value:{ title, tags } }</code> — a NEW object with only those two keys.</li></ul>${MOI_TRUONG.en}`,
  vi: `<p>Luật của bài với đầu vào: <b>chặn độ dài trước mọi regex</b>, ưu tiên hàm có sẵn tuyến tính (<code>trim</code>, không phải <code>/^([\\s\\S]*?)(\\s+)+$/</code>), <b>giới hạn mảng</b>, và để schema <b>bỏ khoá lạ</b> (<code>.object()</code> của zod). Viết <code>validateNote(body)</code> cho <code>POST /notes</code>:</p>
<ul><li><code>body</code> phải là object thường, không thì <code>{ ok:false, errors:[{ path:'body', code:'INVALID' }] }</code>;</li>
<li><code>title</code>: không phải chuỗi → <code>REQUIRED</code>; dài hơn 200 (độ dài gốc) → <code>TOO_LONG</code>; rỗng sau <code>trim()</code> → <code>TOO_SHORT</code>; giá trị giữ lại là bản đã trim;</li>
<li><code>tags</code>: tuỳ chọn (mặc định <code>[]</code>); không phải mảng → <code>path:'tags', INVALID</code>; hơn 20 phần tử → <code>TOO_MANY</code>; mỗi phần tử phải là chuỗi 1–30 ký tự khớp <code>/^[a-z0-9-]+$/</code>, không thì <code>path:'tags.&lt;i&gt;', INVALID</code>;</li>
<li>gom lỗi theo thứ tự đó (title rồi tags); có lỗi trả <code>{ ok:false, errors }</code>, không thì <code>{ ok:true, value:{ title, tags } }</code> — object MỚI chỉ có hai khoá đó.</li></ul>${MOI_TRUONG.vi}`,
  goiY: [['Check <code>body.title.length &gt; 200</code> before calling anything on the string.', 'Kiểm <code>body.title.length &gt; 200</code> trước khi gọi bất cứ thứ gì trên chuỗi.'], ['Return <code>{ title, tags }</code> built from your own variables — never <code>{ ...body }</code>.', 'Trả <code>{ title, tags }</code> dựng từ biến của bạn — không bao giờ <code>{ ...body }</code>.'], ['One test has a title with 30 spaces in the middle: the starter’s regex trim freezes the grader on it, <code>trim()</code> does not.', 'Một ca có title với 30 dấu cách ở giữa: regex trim của code khởi đầu làm máy chấm đứng hình, <code>trim()</code> thì không.']],
  loi: [['Running the regex first and the length check second: the length check never runs if the regex never ends.', 'Chạy regex trước rồi mới kiểm độ dài: phép kiểm độ dài không bao giờ chạy nếu regex không bao giờ dừng.'], ['Returning <code>{ ...body, title }</code>: <code>isAdmin</code> and <code>ownerId</code> from the client reach the database.', 'Trả <code>{ ...body, title }</code>: <code>isAdmin</code> và <code>ownerId</code> của client đi thẳng vào CSDL.'], ['Capping bytes but not array length — 90 KB under the limit can still be 5,000 tags.', 'Chặn byte mà không chặn độ dài mảng — 90 KB dưới giới hạn vẫn có thể là 5.000 tag.']],
  gt: ['Exponential growth on a bounded input is a bounded cost, so the length cap must come first. <code>trim()</code> is linear and replaces the "trim trailing whitespace" regex that the lesson timed at 4.3 s for 28 spaces. Building the output from validated variables is what zod’s strip mode does: unknown keys — <code>__proto__</code>, <code>isAdmin</code> — simply do not exist in <code>value</code>, so no later merge or <code>create()</code> can see them.', 'Tăng theo hàm mũ trên input bị chặn là chi phí bị chặn, nên giới hạn độ dài phải đi trước. <code>trim()</code> tuyến tính và thay được regex "cắt khoảng trắng cuối" mà bài đo mất 4,3 s với 28 dấu cách. Dựng output từ các biến đã kiểm là điều chế độ strip của zod làm: khoá lạ — <code>__proto__</code>, <code>isAdmin</code> — đơn giản không tồn tại trong <code>value</code>, nên không merge hay <code>create()</code> nào sau đó thấy chúng.'],
  kn: ['validation', 'ReDoS', 'mass assignment'],
  tns: [tn('strip unknown keys', 'bỏ khoá lạ', 'chỉ giữ trường có trong schema'), tn('bounded input', 'đầu vào bị chặn', 'có độ dài tối đa ⇒ chi phí tối đa')],
  dau: `/** Validate the body of POST /notes. */
function validateNote(body) {
  // Write your solution here
  const errors = [];
  const title = String(body.title || '').replace(/^([\\s\\S]*?)(\\s+)+$/, '$1'); // "trim trailing spaces"
  if (!title) errors.push({ path: 'title', code: 'REQUIRED' });
  if (errors.length) return { ok: false, errors };
  return { ok: true, value: { ...body, title } };
}
`,
  giai: '// Reference solution\n' + nguon(validateNote),
  cases: [
    { goi: `validateNote({ title: '  Buy milk  ', tags: ['home', 'todo-1'] })`, moTa: ['A valid note: title trimmed', 'Ghi chú hợp lệ: title được trim'] },
    { goi: `validateNote(JSON.parse('{"title":"Hi","isAdmin":true,"ownerId":1,"__proto__":{"x":1}}'))`, moTa: ['Unknown keys are dropped', 'Khoá lạ bị bỏ'] },
    { goi: `validateNote({ title: 'x'.repeat(201), tags: 'home' })`, moTa: ['Too long + tags not an array', 'Quá dài + tags không phải mảng'] },
    { goi: `validateNote({ title: 'Meeting' + ' '.repeat(30) + 'notes' })`, moTa: ['30 spaces in the middle (the ReDoS trap)', '30 dấu cách ở giữa (bẫy ReDoS)'] },
    { goi: `[validateNote(null), validateNote([]), validateNote({ title: '   ' }), validateNote({ tags: [] })]`, an: true },
    { goi: `[validateNote({ title: 'a', tags: Array.from({ length: 21 }, (_, i) => 't' + i) }), validateNote({ title: 'a', tags: ['ok', 'Bad Tag', '', 'x'.repeat(31), 7] })]`, an: true },
    { goi: `(() => { const r = validateNote(JSON.parse('{"title":"' + ' '.repeat(150) + 'x","tags":["a"],"role":"admin"}')); return [r.ok, Object.keys(r.value), r.value.title]; })()`, an: true },
  ],
});

/* ─── 4. MEDIUM · js — giới hạn thân JSON theo route ─── */
function parseLimit(limit) {
  if (typeof limit === 'number' && Number.isFinite(limit) && limit >= 0) return Math.floor(limit);
  const m = /^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)$/i.exec(String(limit).trim());
  if (!m) throw new TypeError('invalid limit: ' + limit);
  const unit = { b: 1, kb: 1024, mb: 1024 ** 2, gb: 1024 ** 3 }[m[2].toLowerCase()];  // like the "bytes" package: 1kb = 1024
  return Math.floor(Number(m[1]) * unit);
}

function jsonLimit(limit) {
  const max = parseLimit(limit);                       // parse ONCE, when the route is mounted — a bad limit fails at boot
  const tooLarge = (res) => res.status(413).json({ type: 'entity.too.large', message: 'request entity too large', limit: max });
  return function json(req, res, next) {
    // Only JSON is ours: multipart uploads must reach multer untouched (chapter 10).
    if (!String(req.headers['content-type'] || '').toLowerCase().startsWith('application/json')) return next();
    const declared = req.headers['content-length'];
    // 1) Cheap rejection from the declared size, before reading anything.
    if (declared !== undefined && Number(declared) > max) return tooLarge(res);
    // 2) The declared size is a hint the client controls (and chunked bodies have none): check what really arrived.
    const raw = req.rawBody === undefined ? '' : String(req.rawBody);
    if (raw.length > max) return tooLarge(res);
    try {
      req.body = raw.length ? JSON.parse(raw) : {};
    } catch {
      return res.status(400).json({ type: 'entity.parse.failed', message: 'invalid JSON' });
    }
    next();
  };
}

const E4 = jsBai({
  ten: 'A body limit per route, not one global weapon', kho: 'MEDIUM', phut: 18,
  en: `<p>One 11.3 MB request cost +139 MB RSS once the global limit was raised to 20mb. The lesson’s rule: <b>set the limit per route</b>. Write two functions:</p>
<ul><li><code>parseLimit(limit)</code>: a non-negative number is returned as bytes (floored); a string like <code>'100kb'</code>, <code>'1.5mb'</code>, <code>'10 MB'</code>, <code>'512b'</code> uses 1kb = 1024 (so <code>'100kb'</code> → <code>102400</code>); anything else throws <code>TypeError</code>.</li>
<li><code>jsonLimit(limit)</code> → middleware <code>(req, res, next)</code>:
<ul><li>if <code>content-type</code> does not start with <code>application/json</code> → <code>next()</code> untouched;</li>
<li>if <code>content-length</code> is present and larger than the limit, <b>or</b> <code>req.rawBody</code> (the body text that arrived; ASCII in the tests, so length = bytes) is longer than the limit → <code>413</code> <code>{ type:'entity.too.large', message:'request entity too large', limit }</code>, no <code>next()</code>;</li>
<li>otherwise <code>req.body = JSON.parse(rawBody)</code> (empty body → <code>{}</code>) and <code>next()</code>; invalid JSON → <code>400 { type:'entity.parse.failed', message:'invalid JSON' }</code>.</li></ul></li></ul>${MOI_TRUONG.en}`,
  vi: `<p>Một request 11,3 MB tốn +139 MB RSS sau khi giới hạn toàn cục được nâng lên 20mb. Luật của bài: <b>đặt giới hạn theo route</b>. Viết hai hàm:</p>
<ul><li><code>parseLimit(limit)</code>: số không âm thì trả về số byte (làm tròn xuống); chuỗi như <code>'100kb'</code>, <code>'1.5mb'</code>, <code>'10 MB'</code>, <code>'512b'</code> dùng 1kb = 1024 (nên <code>'100kb'</code> → <code>102400</code>); còn lại ném <code>TypeError</code>.</li>
<li><code>jsonLimit(limit)</code> → middleware <code>(req, res, next)</code>:
<ul><li>nếu <code>content-type</code> không bắt đầu bằng <code>application/json</code> → <code>next()</code>, không đụng gì;</li>
<li>nếu có <code>content-length</code> lớn hơn giới hạn, <b>hoặc</b> <code>req.rawBody</code> (chữ của thân request đã tới; ASCII trong bộ kiểm nên độ dài = byte) dài hơn giới hạn → <code>413</code> <code>{ type:'entity.too.large', message:'request entity too large', limit }</code>, không <code>next()</code>;</li>
<li>còn lại <code>req.body = JSON.parse(rawBody)</code> (thân rỗng → <code>{}</code>) rồi <code>next()</code>; JSON hỏng → <code>400 { type:'entity.parse.failed', message:'invalid JSON' }</code>.</li></ul></li></ul>${MOI_TRUONG.vi}`,
  goiY: [['A regex like <code>/^(\\d+(?:\\.\\d+)?)\\s*(b|kb|mb|gb)$/i</code> plus a unit table does parseLimit.', 'Một regex như <code>/^(\\d+(?:\\.\\d+)?)\\s*(b|kb|mb|gb)$/i</code> cộng bảng đơn vị là đủ cho parseLimit.'], ['Call parseLimit OUTSIDE the returned function, so a typo in the limit throws when the route is mounted.', 'Gọi parseLimit BÊN NGOÀI hàm trả về, để gõ sai giới hạn thì ném lỗi ngay lúc gắn route.'], ['Two size checks: the declared Content-Length (cheap, before reading) and the real body (the header can lie or be missing).', 'Hai phép kiểm cỡ: Content-Length khai báo (rẻ, trước khi đọc) và thân thật (header có thể nói dối hoặc không có).']],
  loi: [['Trusting Content-Length alone: a chunked request has none and a client can send a small number with a big body.', 'Chỉ tin Content-Length: request chunked không có, và client có thể khai số nhỏ với thân lớn.'], ['1kb = 1000: express.json’s 100kb limit is 102,400 bytes (measured: limit 102400).', '1kb = 1000: giới hạn 100kb của express.json là 102.400 byte (đo được: limit 102400).'], ['Parsing multipart as JSON — this middleware must step aside for uploads.', 'Phân tích multipart như JSON — middleware này phải tránh đường cho upload.']],
  gt: ['A limit is a memory budget per request: parse the configuration once, reject on the declared size before reading, and still check the real size because the header is client-controlled. Mounting <code>jsonLimit(\'100kb\')</code> globally and a larger one only on the route that needs it is the lesson’s "limit per route" — the one big endpoint no longer hands every other endpoint the same weapon.', 'Giới hạn là ngân sách bộ nhớ cho mỗi request: phân tích cấu hình một lần, từ chối theo cỡ khai báo trước khi đọc, và vẫn kiểm cỡ thật vì header do client kiểm soát. Gắn <code>jsonLimit(\'100kb\')</code> toàn cục và một giới hạn lớn hơn chỉ ở route cần là "giới hạn theo route" của bài — một endpoint lớn không còn trao cho mọi endpoint khác cùng một vũ khí.'],
  kn: ['body limits', 'middleware'],
  tns: [tn('413 Payload Too Large', 'thân quá lớn', 'mã trả khi vượt giới hạn'), tn('RSS', 'bộ nhớ thường trú', 'RAM tiến trình đang giữ')],
  dau: `/** '100kb' -> 102400 */
function parseLimit(limit) {
  // Write your solution here
  return parseInt(limit) * 1000;
}

/** JSON body parser with a size limit. */
function jsonLimit(limit) {
  const max = parseLimit(limit);
  return function json(req, res, next) {
    if (Number(req.headers['content-length']) > max) return res.status(413).json({ type: 'entity.too.large' });
    req.body = JSON.parse(req.rawBody || '{}');
    next();
  };
}
`,
  giai: '// Reference solution\n' + nguon(parseLimit, jsonLimit),
  cases: [
    { goi: `[parseLimit('100kb'), parseLimit('1.5mb'), parseLimit('10 MB'), parseLimit(2048)]`, moTa: ['parseLimit units', 'Đơn vị của parseLimit'] },
    { goi: `await runMw(jsonLimit('100kb'), { headers: { 'content-type': 'application/json', 'content-length': String(200 * 1024) }, rawBody: '' })`, moTa: ['200 KB declared → 413 (as measured)', 'Khai 200 KB → 413 (như đã đo)'] },
    { goi: `await (async () => { const req = { headers: { 'content-type': 'application/json; charset=utf-8', 'content-length': '13' }, rawBody: '{"title":"a"}' }; const r = await runMw(jsonLimit('100kb'), req); return [r.next, req.body]; })()`, moTa: ['A small body is parsed', 'Thân nhỏ được phân tích'] },
    { goi: `await runMw(jsonLimit('1kb'), { headers: { 'content-type': 'application/json' }, rawBody: '{"x":"' + 'a'.repeat(2000) + '"}' })`, an: true, moTa: ['Chunked body (no Content-Length) larger than the limit', 'Thân chunked (không Content-Length) lớn hơn giới hạn'] },
    { goi: `await runMw(jsonLimit('1kb'), { headers: { 'content-type': 'application/json', 'content-length': '10' }, rawBody: '{"x":"' + 'a'.repeat(2000) + '"}' })`, an: true, moTa: ['Content-Length lies', 'Content-Length nói dối'] },
    { goi: `[(await runMw(jsonLimit('10b'), { headers: { 'content-type': 'multipart/form-data; boundary=x', 'content-length': '7183298' } })).next, await runMw(jsonLimit('1kb'), { headers: { 'content-type': 'application/json' }, rawBody: '{bad' })]`, an: true },
    { goi: `[(() => { try { parseLimit('lots'); return 'no throw'; } catch (e) { return e.name; } })(), (() => { try { jsonLimit('20 megs'); return 'no throw'; } catch (e) { return e.name; } })(), parseLimit('512b'), parseLimit(' 2KB ')]`, an: true },
  ],
});

/* ─── 5. HARD · js — SSRF: danh sách trắng + tự đi theo chuyển hướng ─── */
async function safeFetch(rawUrl, allowHosts, maxRedirects = 3) {
  const allow = new Set(allowHosts);
  let current = rawUrl;
  for (let hop = 0; ; hop++) {
    let u;
    try { u = new URL(current); } catch { return { ok: false, error: 'BAD_URL' }; }  // parse, never regex: 127.1, 2130706433…
    if (u.protocol !== 'https:') return { ok: false, error: 'HTTPS_ONLY' };
    if (!allow.has(u.hostname)) return { ok: false, error: 'HOST_NOT_ALLOWED' };
    // redirect: 'manual' — we see the 3xx ourselves instead of fetch silently following it past our checks.
    const r = await fetch(u.href, { redirect: 'manual' });
    if ([301, 302, 303, 307, 308].includes(r.status)) {
      if (hop >= maxRedirects) return { ok: false, error: 'TOO_MANY_REDIRECTS' };
      const loc = r.headers.get('location');
      if (!loc) return { ok: false, error: 'BAD_URL' };
      current = new URL(loc, u).href;   // a relative Location resolves against the hop that sent it — then RE-VALIDATED
      continue;
    }
    return { ok: true, status: r.status, url: u.href, body: await r.text() };
  }
}

const IMG = 'https://media.cuongthai.com/cat.png';
const E5 = jsBai({
  ten: 'A link-preview fetch that one 302 cannot walk around', kho: 'HARD', phut: 30,
  en: `<p>The lesson’s <code>/preview-checked</code> checked <code>https:</code> and an allow-list, and still returned <code>DATABASE_URL</code>: the allowed host answered <b>302</b> to <code>http://127.0.0.1:4404/admin/config</code> and <code>fetch</code> followed it. Write <code>async safeFetch(rawUrl, allowHosts, maxRedirects = 3)</code>:</p>
<ul><li>parse with <code>new URL</code> (failure → <code>{ ok:false, error:'BAD_URL' }</code>); protocol must be <code>https:</code> (else <code>HTTPS_ONLY</code>); <code>hostname</code> must be in <code>allowHosts</code> (else <code>HOST_NOT_ALLOWED</code>);</li>
<li>call <code>fetch(url, { redirect: 'manual' })</code>; on 301/302/303/307/308 resolve <code>Location</code> against the current URL and <b>validate it again</b> before fetching; after <code>maxRedirects</code> redirects return <code>TOO_MANY_REDIRECTS</code>;</li>
<li>any other status → <code>{ ok:true, status, url, body }</code> with the final URL (<code>url.href</code>) and <code>await res.text()</code>.</li></ul>
<p>The grader’s <code>fetch</code> is fake (it never follows redirects by itself and it records every call in <code>__fetchDaGoi</code>), so the tests can check that the internal address was <b>never requested</b>.</p>${MOI_TRUONG.en}`,
  vi: `<p><code>/preview-checked</code> trong bài đã kiểm <code>https:</code> và danh sách trắng mà vẫn trả <code>DATABASE_URL</code>: host được phép trả <b>302</b> về <code>http://127.0.0.1:4404/admin/config</code> và <code>fetch</code> đi theo. Viết <code>async safeFetch(rawUrl, allowHosts, maxRedirects = 3)</code>:</p>
<ul><li>phân tích bằng <code>new URL</code> (lỗi → <code>{ ok:false, error:'BAD_URL' }</code>); giao thức phải là <code>https:</code> (không thì <code>HTTPS_ONLY</code>); <code>hostname</code> phải có trong <code>allowHosts</code> (không thì <code>HOST_NOT_ALLOWED</code>);</li>
<li>gọi <code>fetch(url, { redirect: 'manual' })</code>; gặp 301/302/303/307/308 thì giải <code>Location</code> theo URL hiện tại và <b>kiểm lại</b> trước khi fetch; quá <code>maxRedirects</code> lần chuyển hướng trả <code>TOO_MANY_REDIRECTS</code>;</li>
<li>mã khác → <code>{ ok:true, status, url, body }</code> với URL cuối (<code>url.href</code>) và <code>await res.text()</code>.</li></ul>
<p><code>fetch</code> của máy chấm là giả (không tự đi theo chuyển hướng và ghi mọi lời gọi vào <code>__fetchDaGoi</code>), nên bộ kiểm xem được địa chỉ nội bộ <b>chưa từng bị gọi</b>.</p>${MOI_TRUONG.vi}`,
  yc: [['Return the result objects exactly as specified; never throw for a bad URL.', 'Trả đúng các object kết quả như đề; không ném lỗi với URL hỏng.'], ['Pass <code>{ redirect: \'manual\' }</code> to every fetch call.', 'Truyền <code>{ redirect: \'manual\' }</code> vào mọi lời gọi fetch.']],
  goiY: [['Put the three checks in a loop: validate → fetch → if 3xx, set the next URL and loop again.', 'Đặt ba phép kiểm trong một vòng lặp: kiểm → fetch → nếu 3xx thì đặt URL kế tiếp và lặp lại.'], ['<code>new URL(location, currentUrl)</code> handles both absolute and relative <code>Location</code> headers.', '<code>new URL(location, currentUrl)</code> xử lý được cả <code>Location</code> tuyệt đối lẫn tương đối.'], ['Count hops: the request after the 3rd redirect must not be made.', 'Đếm số bước: request sau lần chuyển hướng thứ 3 không được gửi.']],
  loi: [['Validating only the first URL: the 302 goes wherever the attacker wants (this is the measured bypass).', 'Chỉ kiểm URL đầu: 302 dẫn đi bất cứ đâu kẻ tấn công muốn (đây là đường vòng đã đo).'], ['A string check like <code>url.includes("cuongthai.com")</code>: <code>https://cuongthai.com.evil.example/</code> passes.', 'Kiểm chuỗi kiểu <code>url.includes("cuongthai.com")</code>: <code>https://cuongthai.com.evil.example/</code> lọt qua.'], ['Blocking "127.0.0.1" by text: <code>127.1</code>, <code>2130706433</code> and <code>0x7f.0.0.1</code> all parse to it — an allow-list does not care.', 'Chặn chữ "127.0.0.1": <code>127.1</code>, <code>2130706433</code> và <code>0x7f.0.0.1</code> đều ra địa chỉ đó — danh sách trắng thì không cần quan tâm.']],
  gt: ['Every URL the server is about to contact must pass the same check, and with automatic redirects the server contacts URLs your code never saw. <code>redirect: \'manual\'</code> turns each hop back into a URL you validate, so the internal address is refused before any request is made. Parsing with <code>new URL</code> and comparing <code>hostname</code> to an allow-list defeats every spelling trick at once. (On a real server you would also resolve DNS and refuse private IPs; better still, take an id and build the URL yourself, as the GIPHY proxy does.)', 'Mọi URL máy chủ sắp liên lạc đều phải qua cùng một phép kiểm, mà với chuyển hướng tự động thì máy chủ liên lạc những URL mã của bạn chưa từng thấy. <code>redirect: \'manual\'</code> biến mỗi bước thành một URL bạn kiểm, nên địa chỉ nội bộ bị từ chối trước khi có request nào. Phân tích bằng <code>new URL</code> và so <code>hostname</code> với danh sách trắng đánh bại mọi mẹo viết địa chỉ một lúc. (Trên máy chủ thật còn phải phân giải DNS và từ chối IP nội bộ; tốt hơn nữa, nhận id rồi tự dựng URL như proxy GIPHY.)'],
  kn: ['SSRF', 'redirects', 'allow-list'],
  tns: [tn('redirect: manual', 'tự xử lý chuyển hướng', 'fetch trả 3xx thay vì tự đi theo'), tn('Location', 'header đích chuyển hướng', 'URL tiếp theo trong phản hồi 3xx')],
  dau: `/** Fetch a user-supplied URL for a link preview, safely. */
async function safeFetch(rawUrl, allowHosts, maxRedirects = 3) {
  // Write your solution here
  const u = new URL(rawUrl);
  if (u.protocol !== 'https:') return { ok: false, error: 'HTTPS_ONLY' };
  if (!allowHosts.includes(u.hostname)) return { ok: false, error: 'HOST_NOT_ALLOWED' };
  const r = await fetch(u.href);
  return { ok: true, status: r.status, url: u.href, body: await r.text() };
}
`,
  giai: '// Reference solution\n' + nguon(safeFetch),
  cases: [
    { goi: `await safeFetch('${IMG}', ['media.cuongthai.com', 'i.giphy.com'])`, fetchGia: { [IMG]: { text: 'PNG…' } }, moTa: ['An allowed image', 'Một ảnh được phép'] },
    { goi: `await safeFetch('http://127.0.0.1:4404/admin/config', ['media.cuongthai.com'])`, moTa: ['The internal URL itself', 'Chính URL nội bộ'] },
    { goi: `[await safeFetch('${IMG}', ['media.cuongthai.com']), __fetchDaGoi.map((c) => c.url)]`, fetchGia: { [IMG]: { status: 302, headers: { location: 'http://127.0.0.1:4404/admin/config' } }, 'http://127.0.0.1:4404/admin/config': { json: { DATABASE_URL: 'postgres://prod:sieu-mat@db:5432/app' } } }, moTa: ['The 302 bypass: internal URL never requested', 'Đường vòng 302: URL nội bộ không bao giờ bị gọi'] },
    { goi: `[await safeFetch('${IMG}', ['media.cuongthai.com']), __fetchDaGoi.length]`, fetchGia: { [IMG]: { status: 301, headers: { location: '/v2/cat.png' } }, 'https://media.cuongthai.com/v2/cat.png': { text: 'moved ok' } }, an: true },
    { goi: `[await safeFetch('https://i.giphy.com/a', ['i.giphy.com']), __fetchDaGoi.length]`, fetchGia: { 'https://i.giphy.com/a': { status: 302, headers: { location: 'https://i.giphy.com/b' } }, 'https://i.giphy.com/b': { status: 307, headers: { location: 'https://i.giphy.com/c' } }, 'https://i.giphy.com/c': { status: 302, headers: { location: 'https://i.giphy.com/d' } }, 'https://i.giphy.com/d': { status: 302, headers: { location: 'https://i.giphy.com/e' } }, 'https://i.giphy.com/e': { text: 'too far' } }, an: true },
    { goi: `[await safeFetch('not a url', ['x']), await safeFetch('https://127.1/x', ['media.cuongthai.com']), await safeFetch('https://media.cuongthai.com.evil.example/x', ['media.cuongthai.com']), await safeFetch('file:///etc/hostname', ['media.cuongthai.com']), __fetchDaGoi.length]`, an: true },
    { goi: `[await safeFetch('${IMG}', ['media.cuongthai.com']), __fetchDaGoi.map((c) => c.url)]`, fetchGia: { [IMG]: { status: 302, headers: { location: 'https://metadata.evil.example/latest' } } }, an: true },
  ],
  kiemThem: [{ kiem: 'ma-nguon', khop: "redirect\\s*:\\s*['\"]manual['\"]", moTa: { en: 'fetch is called with redirect: \'manual\'', vi: 'fetch được gọi với redirect: \'manual\'' } }],
});

export default modul('nodejs-9-3-dau-vao-doc-hai', '9.3 Hostile input: ReDoS, pollution, body limits, SSRF', [E1, E2, E3, E4, E5]);
