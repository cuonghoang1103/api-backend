// Node.js 1.3 — Objects, arrays and references. Hành vi đã chạy bằng Node 22.23.3 (n02/kiem-node/c1.cjs).
import { modul, cs, jsBai, q, tn, pre } from './_node.mjs';

const TN = [
  tn('value vs reference', 'giá trị vs tham chiếu', 'Primitives are copied; a variable holding an object holds a reference to it.'),
  tn('shallow copy', 'bản sao nông', '{ ...obj } copies one level; nested objects are still shared.'),
  tn('deep copy', 'bản sao sâu', 'A fully independent copy — structuredClone(obj).'),
  tn('destructuring', 'phân rã', 'const { title, body = "" } = req.body — pull fields into variables, with defaults.'),
  tn('rest pattern', 'phần còn lại', 'const { passwordHash, ...safe } = user — everything except the named fields.'),
  tn('nullish coalescing (??)', 'toán tử ??', 'Falls back only on null/undefined; || also replaces 0, "" and false.'),
];

export default modul('nodejs-1-3-object-tham-chieu', '1.3 Objects, arrays and references', [
  cs({
    ten: 'Predict it: copies, defaults and fallbacks',
    kho: 'EASY', phut: 7,
    en: 'Lines in the style of lesson 1.3. Decide the output first, then run it in Node to check.',
    vi: 'Các dòng theo kiểu bài 1.3. Tự quyết output trước, rồi chạy bằng Node để kiểm.',
    cau: [
      q('r1', [`${pre("const a = { name: 'An', tags: ['x'] };\nconst b = { ...a };\nb.name = 'Binh';\nb.tags.push('y');\nconsole.log(a.name, JSON.stringify(a.tags));")}`, 'Sửa bản sao bằng spread.'],
        ['An ["x","y"]', 'Binh ["x","y"]', 'An ["x"]', 'Binh ["x"]'],
        ['Spread copies ONE level: <code>name</code> is a new string slot in <code>b</code>, so <code>a.name</code> stays "An". <code>tags</code> is copied as a reference — both objects point at the same array, so the push shows through <code>a</code>.', 'Spread chép MỘT tầng: name là ô mới trong b nên a.name vẫn "An". tags được chép dạng tham chiếu — hai object trỏ cùng một mảng, nên push hiện cả qua a.']),
      q('r2', [`${pre("const { title, body = '', tags = [] } = { title: 'T', body: null };\nconsole.log(JSON.stringify({ title, body, tags }));")}`, 'Client gửi body: null.'],
        ['{"title":"T","body":null,"tags":[]}', '{"title":"T","body":"","tags":[]}', '{"title":"T","tags":[]}', 'TypeError: Cannot destructure null'],
        ['A destructuring default fires only on <code>undefined</code>. <code>body</code> was sent as <code>null</code>, so you get <code>null</code>, not <code>\'\'</code>. <code>tags</code> was missing (undefined) ⇒ the default <code>[]</code>.', 'Giá trị mặc định khi phân rã chỉ áp khi undefined. body được gửi là null nên nhận null, không phải \'\'. tags thiếu (undefined) ⇒ mặc định [].']),
      q('r3', ['What does <code>Number(req.query.limit) || 20</code> give when the client sends <code>?limit=0</code>?', 'Number(req.query.limit) || 20 khi client gửi ?limit=0?'],
        ['20 — 0 is falsy, so || replaces a legitimate value', '0 — || only replaces null and undefined', 'NaN', '"0"'],
        ['<code>Number(\'0\')</code> is 0, which is falsy, so <code>||</code> picks 20. With <code>??</code> you would keep 0. (The raw string <code>\'0\'</code> is truthy — the bug appears only after converting to a number, which is exactly what pagination code does.)', 'Number(\'0\') là 0, giá trị falsy, nên || chọn 20. Với ?? bạn giữ 0. (Chuỗi \'0\' thô là truthy — bug chỉ xuất hiện sau khi đổi sang số, đúng việc code phân trang làm.)']),
      q('r4', [`${pre("const n = { createdAt: new Date('2026-01-01T00:00:00Z') };\nconst j = JSON.parse(JSON.stringify(n));\nconsole.log(typeof j.createdAt);")}`, 'Sao chép bằng JSON.'],
        ['string', 'object', 'undefined', 'number'],
        ['JSON has no Date type: <code>stringify</code> writes the ISO string and <code>parse</code> leaves it a string. <code>structuredClone</code> keeps it a real Date (and keeps Map/Set too).', 'JSON không có kiểu Date: stringify ghi chuỗi ISO và parse để nguyên chuỗi. structuredClone giữ đúng Date (và Map/Set).']),
      q('r5', [`${pre("const user = { id: 1, passwordHash: 'h' };\nconst { passwordHash, ...safe } = user;\nconsole.log(JSON.stringify(safe), 'passwordHash' in user);")}`, 'Bỏ trường bí mật bằng rest.'],
        ['{"id":1} true', '{"id":1} false', '{"id":1,"passwordHash":"h"} true', '{} true'],
        ['The rest pattern builds a NEW object with every field except the named ones; the original <code>user</code> is untouched (still has its hash). That is why it is safe to use on a row you might still need.', 'Rest tạo object MỚI gồm mọi trường trừ những trường được gọi tên; user gốc không bị đụng (vẫn còn hash). Vì thế dùng được trên một bản ghi bạn còn cần.']),
    ],
    goiY: [
      ['For every copy ask: was the nested value copied, or only the reference to it?', 'Với mỗi lần sao chép hỏi: giá trị lồng được chép, hay chỉ tham chiếu?'],
      ['Defaults and <code>??</code> look at null/undefined; <code>||</code> looks at "falsy" (0, "", false, NaN too).', 'Mặc định và ?? nhìn null/undefined; || nhìn "falsy" (cả 0, "", false, NaN).'],
    ],
    loi: [
      ['Believing <code>{ ...obj }</code> is a full copy.', 'Tin { ...obj } là bản sao đầy đủ.'],
      ['Expecting a destructuring default to replace <code>null</code>.', 'Tưởng mặc định khi phân rã thay được null.'],
      ['Copying with <code>JSON.parse(JSON.stringify())</code> and losing Dates.', 'Sao chép bằng JSON.parse(JSON.stringify()) rồi mất Date.'],
    ],
    tns: TN,
  }),

  jsBai({
    ten: 'toPublicUser: strip secrets without touching the original',
    kho: 'EASY', phut: 8,
    en: `<p>Before a user row goes into a response, the secret fields must go: <code>passwordHash</code> and <code>resetToken</code>. Write <code>toPublicUser(user)</code> that returns a <b>new</b> object with every other field. The original row must keep its fields — the service may still need the hash to check a password.</p>${pre("const row = { id: 7, email: 'an@example.com', passwordHash: '$2b$...', resetToken: 'abc', role: 'student' };\ntoPublicUser(row);   // { id: 7, email: 'an@example.com', role: 'student' }\nrow.passwordHash;    // still '$2b$...'")}<p>The starter uses <code>delete</code> on the row itself — the response is right, but it destroys the caller's data.</p>`,
    vi: `<p>Trước khi bản ghi user vào response, các trường bí mật phải bỏ: passwordHash và resetToken. Viết toPublicUser(user) trả object MỚI gồm các trường còn lại. Bản ghi gốc phải giữ nguyên — service có thể còn cần hash để kiểm mật khẩu. Code khởi đầu dùng delete trên chính bản ghi — response đúng nhưng phá dữ liệu của bên gọi.</p>`,
    yc: [
      ['Return a new object without <code>passwordHash</code> and <code>resetToken</code>.', 'Trả object mới không có passwordHash và resetToken.'],
      ['Keep every other field, whatever it is called.', 'Giữ mọi trường khác, tên gì cũng được.'],
      ['Do not modify the argument.', 'Không sửa đối số.'],
    ],
    goiY: [
      ['The lesson line: <code>const { passwordHash, ...safeUser } = user;</code>', 'Dòng trong bài: const { passwordHash, ...safeUser } = user;'],
      ['You can name more than one field before the rest: <code>{ a, b, ...rest }</code>.', 'Có thể gọi tên nhiều trường trước phần rest: { a, b, ...rest }.'],
    ],
    loi: [
      ['<code>delete user.passwordHash</code> — mutates the caller\'s object; the next line that verifies a password gets <code>undefined</code>.', 'delete user.passwordHash — sửa object của bên gọi; dòng kiểm mật khẩu kế tiếp nhận undefined.'],
      ['Building the result by listing "safe" fields by hand from memory and forgetting one later — the lesson\'s point is to strip secrets explicitly.', 'Tự liệt kê các trường "an toàn" theo trí nhớ rồi sau quên một trường — ý bài học là bỏ bí mật một cách tường minh.'],
    ],
    gt: ['The rest pattern creates a fresh object containing every own field except the ones you named, so the secrets never reach the response object and the original row is untouched. Because it is a new object, later code that adds properties to the response cannot leak back into the database row either.',
      'Rest tạo object mới chứa mọi trường trừ các trường đã gọi tên, nên bí mật không bao giờ vào object response và bản ghi gốc nguyên vẹn. Vì là object mới, code sau này thêm thuộc tính vào response cũng không rò ngược lại bản ghi.'],
    kn: ['rest destructuring', 'immutability', 'secrets in responses'],
    tns: TN,
    viDu: [{ input: "toPublicUser({ id: 7, email: 'an@example.com', passwordHash: 'h', resetToken: 't', role: 'student' })", output: '{"id":7,"email":"an@example.com","role":"student"}', explanation: 'Secrets removed, other fields kept.|||Bỏ bí mật, giữ trường khác.' }],
    dau: `function toPublicUser(user) {
  delete user.passwordHash;
  delete user.resetToken;
  return user;
}
`,
    giai: `// Destructure the secrets OUT; "rest" collects every other field into a
// NEW object. The caller's row keeps passwordHash (it may still need it).
function toPublicUser(user) {
  const { passwordHash, resetToken, ...publicUser } = user;
  return publicUser;
}
`,
    cases: [
      { moTa: ['secrets removed, other fields kept', 'bỏ bí mật, giữ trường khác'], goi: "toPublicUser({ id: 7, email: 'an@example.com', passwordHash: 'h', resetToken: 't', role: 'student' })" },
      { moTa: ['the original row keeps passwordHash', 'bản ghi gốc giữ passwordHash'], goi: "(() => { const row = { id: 1, passwordHash: 'h', resetToken: 't' }; const out = toPublicUser(row); return [row.passwordHash, row.resetToken, out === row]; })()" },
      { an: true, goi: "toPublicUser({ id: 2, name: 'Binh', avatarUrl: null, createdAt: '2026-01-01', passwordHash: 'x' })" },
      { an: true, goi: "(() => { const row = { id: 3, email: 'c@d.e' }; const out = toPublicUser(row); out.extra = 1; return [row, out]; })()" },
    ],
  }),

  jsBai({
    ten: 'readPagination: ?? not || (and a 0 that must survive)',
    kho: 'MEDIUM', phut: 14,
    en: `<p>The lesson's "really annoying pagination bug": <code>Number(req.query.limit) || 20</code> turns a legitimate <code>limit=0</code> into 20. Write <code>readPagination(query)</code> for <code>GET /notes</code>. <code>query</code> values are <b>strings</b> (or missing), like Express's <code>req.query</code>.</p>
<ul><li><b>limit</b>: missing or <code>''</code> ⇒ 20. A whole number ≥ 0 ⇒ that number (<code>'0'</code> ⇒ 0: the client only wants the total). Above 100 ⇒ 100. Anything else (<code>'abc'</code>, <code>'-5'</code>, <code>'2.5'</code>) ⇒ 20.</li>
<li><b>page</b>: missing or <code>''</code> ⇒ 1. A whole number ≥ 1 ⇒ that number. Anything else ⇒ 1.</li></ul>${pre("readPagination({})                          // { page: 1, limit: 20 }\nreadPagination({ page: '3', limit: '0' })   // { page: 3, limit: 0 }\nreadPagination({ limit: '500' })            // { page: 1, limit: 100 }")}`,
    vi: `<p>"Bug phân trang rất khó chịu" của bài: Number(req.query.limit) || 20 biến limit=0 hợp lệ thành 20. Viết readPagination(query) cho GET /notes; giá trị là CHUỖI (hoặc thiếu). limit: thiếu/'' ⇒ 20; số nguyên ≥ 0 ⇒ giữ ('0' ⇒ 0); > 100 ⇒ 100; còn lại ⇒ 20. page: thiếu/'' ⇒ 1; số nguyên ≥ 1 ⇒ giữ; còn lại ⇒ 1.</p>`,
    yc: [
      ['Return <code>{ page, limit }</code> as numbers.', 'Trả { page, limit } dạng số.'],
      ['<code>limit=0</code> stays 0; cap at 100; invalid ⇒ default.', 'limit=0 giữ 0; trần 100; không hợp lệ ⇒ mặc định.'],
      ['Do not modify <code>query</code>.', 'Không sửa query.'],
    ],
    goiY: [
      ['First decide "missing" (<code>undefined</code>, <code>null</code> or <code>\'\'</code>) on the raw string, THEN convert with <code>Number()</code>.', 'Quyết "thiếu" (undefined, null hoặc \'\') trên chuỗi thô TRƯỚC, RỒI mới đổi bằng Number().'],
      ['<code>Number.isInteger(n)</code> is false for NaN and 2.5 — one check covers "abc" and decimals.', 'Number.isInteger(n) false với NaN và 2.5 — một phép kiểm phủ cả "abc" lẫn số lẻ.'],
      ['A small helper <code>toInt(raw, fallback, min)</code> used for both fields keeps it short.', 'Một hàm nhỏ toInt(raw, fallback, min) dùng cho cả hai trường cho gọn.'],
    ],
    loi: [
      ['<code>Number(q.limit) || 20</code> — the 0 becomes 20 (the lesson\'s bug).', 'Number(q.limit) || 20 — 0 thành 20 (bug của bài).'],
      ['<code>Number(q.limit) ?? 20</code> — looks fixed, but <code>Number(undefined)</code> is <code>NaN</code>, not undefined, so ?? never fires and you return NaN (measured in Node 22).', 'Number(q.limit) ?? 20 — trông đã sửa, nhưng Number(undefined) là NaN chứ không phải undefined, nên ?? không bao giờ chạy và bạn trả NaN (đo trên Node 22).'],
      ['Forgetting that <code>Number(\'\')</code> is 0 — an empty <code>?limit=</code> would mean "zero rows" instead of the default.', 'Quên Number(\'\') là 0 — ?limit= rỗng sẽ thành "không dòng nào" thay vì mặc định.'],
    ],
    gt: ['The fix is about ORDER: check for "missing" on the raw value, where <code>undefined</code>/<code>\'\'</code> are still visible, and only then convert. After <code>Number()</code> the information is gone: missing became NaN, empty became 0. <code>Number.isInteger</code> then rejects NaN, decimals and Infinity in one test, and the explicit <code>&gt;= min</code> keeps a deliberate 0 for limit while refusing page 0. Nothing relies on falsiness, so no legitimate value is replaced.',
      'Bản sửa nằm ở THỨ TỰ: kiểm "thiếu" trên giá trị thô, nơi undefined/\'\' còn nhìn thấy, rồi mới đổi kiểu. Sau Number() thông tin đã mất: thiếu thành NaN, rỗng thành 0. Number.isInteger loại NaN, số lẻ và Infinity trong một phép, còn >= min tường minh giữ số 0 cố ý của limit nhưng từ chối page 0. Không dựa vào falsy nên không giá trị hợp lệ nào bị thay.'],
    kn: ['nullish coalescing', 'type conversion', 'pagination'],
    tns: TN,
    viDu: [{ input: "readPagination({ page: '3', limit: '0' })", output: '{"page":3,"limit":0}', explanation: 'The starter returns limit 20.|||Code khởi đầu trả limit 20.' }],
    dau: `function readPagination(query) {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  return { page, limit };
}
`,
    giai: `// Decide "missing" on the RAW string first: after Number() it is too late
// (Number(undefined) is NaN, Number('') is 0).
function toInt(raw, fallback, min) {
  if (raw === undefined || raw === null || raw === '') return fallback;
  const n = Number(raw);
  // isInteger rejects NaN ('abc'), decimals ('2.5') and Infinity in one check
  if (!Number.isInteger(n) || n < min) return fallback;
  return n;
}

function readPagination(query) {
  const page = toInt(query.page, 1, 1);           // page 0 or below -> 1
  const limit = Math.min(toInt(query.limit, 20, 0), 100); // 0 is legitimate; cap 100
  return { page, limit };
}
`,
    cases: [
      { moTa: ['nothing sent ⇒ { page: 1, limit: 20 }', 'không gửi gì ⇒ { page: 1, limit: 20 }'], goi: 'readPagination({})' },
      { moTa: ["limit '0' stays 0", "limit '0' giữ 0"], goi: "readPagination({ page: '3', limit: '0' })" },
      { moTa: ['limit is capped at 100', 'limit bị chặn ở 100'], goi: "readPagination({ limit: '500' })" },
      { moTa: ["'abc' ⇒ defaults (not NaN)", "'abc' ⇒ mặc định (không NaN)"], goi: "readPagination({ page: 'abc', limit: 'abc' })" },
      { an: true, goi: "[readPagination({ page: '0', limit: '-5' }), readPagination({ page: '2.5', limit: '2.5' }), readPagination({ page: '', limit: '' })]" },
      { an: true, goi: "[readPagination({ page: '7', limit: '100' }), readPagination({ page: '12', limit: '101' }), readPagination({ limit: '1' })]" },
      { an: true, goi: "(() => { const qy = { page: '2' }; readPagination(qy); return Object.keys(qy); })()" },
    ],
  }),

  jsBai({
    ten: 'updateNote: merge changes without mutating the stored note',
    kho: 'MEDIUM', phut: 14,
    en: `<p>"Spread: update without mutating" — the lesson's <code>{ ...note, title: 'New title', updatedAt: … }</code>. Write <code>updateNote(note, changes)</code> that returns a <b>new</b> note:</p>
<ul><li>Top-level fields from <code>changes</code> replace the old ones (<code>title</code>, <code>body</code>, …).</li>
<li><code>changes.meta</code>, if present, is <b>merged</b> into <code>note.meta</code> (keep the meta fields not mentioned) — and the result's <code>meta</code> must be a new object, not shared with the original.</li>
<li><code>id</code> and <code>ownerId</code> can never be changed by <code>changes</code>.</li>
<li><code>updatedAt</code> is set to <code>Date.now()</code>.</li></ul>${pre("const note = { id: 1, ownerId: 9, title: 'Old', meta: { pinned: false, color: 'blue' }, updatedAt: 0 };\nupdateNote(note, { title: 'New', meta: { pinned: true }, id: 99 });\n// { id: 1, ownerId: 9, title: 'New', meta: { pinned: true, color: 'blue' }, updatedAt: <now> }\nnote.title;        // still 'Old'\nnote.meta.pinned;  // still false")}`,
    vi: `<p>"Spread: cập nhật mà không sửa gốc". Viết updateNote(note, changes) trả note MỚI: trường cấp ngoài trong changes thay trường cũ; changes.meta (nếu có) được TRỘN vào note.meta (giữ trường meta không nhắc tới) và meta kết quả phải là object mới; id và ownerId không bao giờ bị đổi; updatedAt = Date.now().</p>`,
    yc: [
      ['Return a new object; never modify <code>note</code>, <code>note.meta</code> or <code>changes</code>.', 'Trả object mới; không sửa note, note.meta hay changes.'],
      ['Merge <code>meta</code> one level deep; result <code>meta</code> is a new object.', 'Trộn meta một tầng; meta kết quả là object mới.'],
      ['Keep <code>id</code> and <code>ownerId</code>; set <code>updatedAt</code> to <code>Date.now()</code>.', 'Giữ id và ownerId; đặt updatedAt = Date.now().'],
    ],
    goiY: [
      ['Order matters in a spread: later keys win. Put the protected fields LAST: <code>{ ...note, ...changes, id: note.id, ownerId: note.ownerId }</code>.', 'Thứ tự trong spread quan trọng: khoá sau thắng. Đặt trường cần bảo vệ CUỐI.'],
      ['<code>meta: { ...note.meta, ...changes.meta }</code> — spreading <code>undefined</code> is allowed and adds nothing.', 'meta: { ...note.meta, ...changes.meta } — spread undefined là hợp lệ và không thêm gì.'],
    ],
    loi: [
      ['<code>Object.assign(note, changes)</code> — mutates the stored note (the starter\'s bug); every other reference to it changes too.', 'Object.assign(note, changes) — sửa note đang lưu (bug của code khởi đầu); mọi tham chiếu khác cũng đổi theo.'],
      ['<code>{ ...note, ...changes }</code> alone — <code>changes.meta</code> replaces the whole meta (color lost), and <code>changes.id</code> overwrites the id.', 'Chỉ { ...note, ...changes } — changes.meta thay cả meta (mất color), và changes.id ghi đè id.'],
      ['<code>const copy = { ...note }; copy.meta.pinned = true</code> — a shallow copy shares <code>meta</code>, so the original changes.', 'copy = { ...note }; copy.meta.pinned = true — bản sao nông dùng chung meta nên bản gốc đổi.'],
    ],
    gt: ['A spread builds a new top-level object, and later keys overwrite earlier ones — so writing the protected fields after <code>...changes</code> guarantees <code>id</code>/<code>ownerId</code> survive. The nested <code>meta</code> needs its own spread: that creates a second new object and merges the two levels, which is exactly the "one level per spread" rule from the lesson. Nothing assigns into an existing object, so the stored note is untouched.',
      'Spread tạo object mới ở tầng ngoài, khoá sau ghi đè khoá trước — viết trường cần bảo vệ sau ...changes bảo đảm id/ownerId còn nguyên. meta lồng bên trong cần spread riêng: tạo object mới thứ hai và trộn hai tầng, đúng luật "mỗi spread một tầng" của bài. Không có phép gán vào object có sẵn nào, nên note đang lưu không bị đụng.'],
    kn: ['spread', 'immutability', 'shallow copy'],
    tns: TN,
    viDu: [{ input: "updateNote({ id: 1, ownerId: 9, title: 'Old', meta: { pinned: false, color: 'blue' } }, { title: 'New', meta: { pinned: true } })", output: '{"id":1,"ownerId":9,"title":"New","meta":{"pinned":true,"color":"blue"},"updatedAt":1767225600000}', explanation: 'Date.now() in the grader starts at 2026-01-01T00:00:00Z.|||Date.now() của máy chấm bắt đầu ở 2026-01-01T00:00:00Z.' }],
    dau: `function updateNote(note, changes) {
  Object.assign(note, changes);
  note.updatedAt = Date.now();
  return note;
}
`,
    giai: `// Build NEW objects at both levels; assign into nothing that already exists.
function updateNote(note, changes) {
  return {
    ...note,                                  // start from the stored note
    ...changes,                               // later keys win: apply the changes
    meta: { ...note.meta, ...changes.meta },  // nested: its own spread = merged + new object
    id: note.id,                              // protected fields LAST so changes cannot win
    ownerId: note.ownerId,
    updatedAt: Date.now(),
  };
}
`,
    cases: [
      { moTa: ['title replaced, meta merged, id protected', 'thay title, trộn meta, giữ id'], goi: "updateNote({ id: 1, ownerId: 9, title: 'Old', meta: { pinned: false, color: 'blue' }, updatedAt: 0 }, { title: 'New', meta: { pinned: true }, id: 99 })" },
      { moTa: ['the original note and its meta are unchanged', 'note gốc và meta không đổi'], goi: "(() => { const note = { id: 1, ownerId: 9, title: 'Old', meta: { pinned: false } }; const out = updateNote(note, { title: 'New', meta: { pinned: true } }); return [note.title, note.meta.pinned, out.meta === note.meta, out === note]; })()" },
      { an: true, chuanBi: 'await new Promise((r) => setTimeout(r, 1500));', goi: "updateNote({ id: 5, ownerId: 2, body: 'x', meta: { color: 'red' } }, { ownerId: 3, body: 'y' })" },
      { an: true, goi: "(() => { const ch = { meta: { tags: 2 } }; const note = { id: 1, ownerId: 1, meta: { a: 1 } }; const out = updateNote(note, ch); out.meta.a = 100; return [note.meta.a, ch, out.meta]; })()" },
    ],
  }),

  jsBai({
    ten: 'cloneForCache: a deep copy that keeps Dates and Maps',
    kho: 'HARD', phut: 16,
    en: `<p>The Notes service keeps an in-memory cache. Whatever it hands out must be a <b>deep copy</b>, so a caller who edits the result cannot corrupt the cache. The starter uses the old-tutorial trick <code>JSON.parse(JSON.stringify(obj))</code>, which the lesson says "destroys Date (becomes a string), undefined, Map, Set".</p>
<p>Write <code>cloneForCache(note)</code> and <code>getCached(cache, id)</code>:</p>
<ul><li><code>cloneForCache(note)</code> returns a fully independent copy: nested objects/arrays are new, <code>createdAt</code> stays a real <code>Date</code>, a <code>Map</code> (e.g. <code>reactions</code>) stays a Map.</li>
<li><code>getCached(cache, id)</code>: <code>cache</code> is a <code>Map</code> id → note. Return a clone of the stored note, or <code>null</code> when missing.</li></ul>${pre("const note = { id: 1, createdAt: new Date('2026-03-01T08:00:00Z'), tags: ['a'], reactions: new Map([['👍', 2]]) };\nconst c = cloneForCache(note);\nc.createdAt instanceof Date;   // true\nc.reactions.get('👍');          // 2\nc.tags.push('b'); note.tags;   // ['a'] — independent")}`,
    vi: `<p>Service Notes có bộ nhớ đệm trong RAM. Thứ nó đưa ra phải là bản sao SÂU để bên gọi sửa kết quả không làm hỏng cache. Code khởi đầu dùng mẹo JSON.parse(JSON.stringify()) mà bài nói "phá Date (thành chuỗi), undefined, Map, Set". Viết cloneForCache(note) (bản sao độc lập, giữ Date và Map) và getCached(cache, id) (trả bản sao hoặc null).</p>`,
    yc: [
      ['A deep, independent copy: changing the copy never changes the original.', 'Bản sao sâu, độc lập: sửa bản sao không bao giờ đổi bản gốc.'],
      ['<code>Date</code> stays a Date; <code>Map</code> stays a Map.', 'Date vẫn là Date; Map vẫn là Map.'],
      ['<code>getCached</code> returns a clone or <code>null</code>; it never returns the cached object itself.', 'getCached trả bản sao hoặc null; không bao giờ trả chính object trong cache.'],
    ],
    goiY: [
      ['The lesson\'s tool: <code>structuredClone(value)</code> — built into Node 17+ and into this grader.', 'Công cụ của bài: structuredClone(value) — có sẵn trong Node 17+ và trong máy chấm này.'],
      ['<code>getCached</code>: <code>cache.has(id) ? cloneForCache(cache.get(id)) : null</code>.', 'getCached: cache.has(id) ? cloneForCache(cache.get(id)) : null.'],
    ],
    loi: [
      ['JSON round-trip: <code>createdAt</code> comes back as a string and the Map as <code>{}</code> — the starter\'s bug (measured in Node 22: <code>typeof</code> is "string", Map ⇒ <code>{}</code>).', 'JSON khứ hồi: createdAt thành chuỗi, Map thành {} — bug của code khởi đầu (đo Node 22).'],
      ['Returning <code>cache.get(id)</code> directly — the first caller who edits it changes what every later caller sees.', 'Trả thẳng cache.get(id) — người gọi đầu tiên sửa nó là đổi thứ mọi người gọi sau thấy.'],
      ['<code>{ ...note }</code> — one level only; <code>tags</code> and the Map are still shared.', '{ ...note } — chỉ một tầng; tags và Map vẫn dùng chung.'],
    ],
    gt: ['<code>structuredClone</code> walks the whole value and rebuilds it, recognising Date, Map, Set and nested arrays/objects (and even cycles). A cache that hands out clones has a clear ownership rule: the cache owns its copy, callers own theirs. It costs more than a shallow copy, which is why the lesson says to reach for it when you need depth — a shared cache is exactly that case.',
      'structuredClone duyệt toàn bộ giá trị và dựng lại, nhận ra Date, Map, Set, mảng/object lồng (cả vòng tham chiếu). Cache đưa ra bản sao có luật sở hữu rõ ràng: cache giữ bản của nó, bên gọi giữ bản của mình. Tốn hơn bản sao nông — vì vậy bài nói chỉ dùng khi thật cần độ sâu, và cache dùng chung đúng là trường hợp đó.'],
    kn: ['structuredClone', 'deep copy', 'cache ownership'],
    tns: TN,
    viDu: [{ input: "cloneForCache({ createdAt: new Date('2026-03-01T08:00:00Z') }).createdAt instanceof Date", output: 'true', explanation: 'The JSON starter gives false (a string).|||Code khởi đầu JSON cho false (một chuỗi).' }],
    chung: "const mkNote = () => ({ id: 1, title: 'Cache me', createdAt: new Date('2026-03-01T08:00:00Z'), tags: ['a'], meta: { pinned: true }, reactions: new Map([['like', 2]]) });",
    dau: `function cloneForCache(note) {
  return JSON.parse(JSON.stringify(note));
}

function getCached(cache, id) {
  return cache.get(id) || null;
}
`,
    giai: `// A deep copy that understands Date, Map, Set and nested objects/arrays.
// JSON would turn the Date into a string and the Map into {}.
function cloneForCache(note) {
  return structuredClone(note);
}

// The cache owns its objects; callers always get their own copy.
function getCached(cache, id) {
  if (!cache.has(id)) return null;
  return cloneForCache(cache.get(id));
}
`,
    cases: [
      { moTa: ['createdAt stays a Date, reactions stays a Map', 'createdAt vẫn là Date, reactions vẫn là Map'], chuanBi: 'const c = cloneForCache(mkNote());', goi: "[c.createdAt instanceof Date, c.createdAt.toISOString(), c.reactions instanceof Map, c.reactions.get('like')]" },
      { moTa: ['editing the copy does not touch the original', 'sửa bản sao không đụng bản gốc'], chuanBi: "const n = mkNote(); const c = cloneForCache(n); c.tags.push('b'); c.meta.pinned = false; c.reactions.set('like', 99);", goi: "[n.tags, n.meta.pinned, n.reactions.get('like')]" },
      { moTa: ['getCached returns a copy, or null', 'getCached trả bản sao, hoặc null'], chuanBi: 'const cache = new Map([[1, mkNote()]]); const a = getCached(cache, 1); a.title = "hacked";', goi: '[cache.get(1).title, getCached(cache, 2), getCached(cache, 1) === cache.get(1)]' },
      { an: true, chuanBi: "const cache = new Map([[5, { id: 5, history: [{ at: new Date('2026-05-05T00:00:00Z'), by: { id: 1 } }] }]]); const x = getCached(cache, 5); x.history[0].by.id = 666;", goi: '[cache.get(5).history[0].by.id, x.history[0].at instanceof Date, x.history[0].at.getTime()]' },
      { an: true, goi: "(() => { const s = { id: 2, seenBy: new Set([1, 2]), deletedAt: undefined }; const c = cloneForCache(s); c.seenBy.add(3); return [s.seenBy.size, c.seenBy instanceof Set, 'deletedAt' in c]; })()" },
    ],
  }),
]);
