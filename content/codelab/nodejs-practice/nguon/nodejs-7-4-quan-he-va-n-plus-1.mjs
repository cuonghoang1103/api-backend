/** Node.js 7.4 — Quan hệ, include gửi 2 câu với IN, bẫy N+1 đếm bằng số câu SQL thật, gom bằng Map, groupBy thay vì kéo dòng về để đếm, dataloader; SQL: some = EXISTS, đếm theo nhóm. */
import { modul, cs, q, tn, jsBai, sqlBai, kq, kqAn } from './_node-c6-8.mjs';

/* ── 1. Trắc nghiệm ── */
const E1 = cs({
  ten: '7.4 · 1 — include, select, some, _count — and how to spot N+1 in a review', kho: 'EASY', phut: 8,
  en: 'N+1 is invisible in code review: the loop looks innocent, each query is fast, the endpoint is simply slow. Lesson 7.4 made it visible by counting the SQL statements. Six questions on what you saw.',
  vi: 'N+1 vô hình khi review: vòng lặp trông vô hại, mỗi truy vấn đều nhanh, endpoint chỉ đơn giản là chậm. Bài 7.4 làm nó hiện ra bằng cách đếm số câu SQL. Sáu câu hỏi về những gì bạn đã thấy.',
  cau: [
    q('c1', ['What does <code>prisma.user.findMany({ include: { notes: true } })</code> actually send?', '<code>prisma.user.findMany({ include: { notes: true } })</code> thật sự gửi gì?'],
      ['Two statements: the users, then the notes WHERE "authorId" IN ($1, $2, …)', 'One JOIN that returns each user once per note', 'One query per user', 'A single query using a JSON aggregate'],
      ['That IN is the entire trick — two round trips instead of fifty-one. Two queries also avoid sending the user row 20 times for 20 notes.', 'Chính IN đó là toàn bộ bí quyết — hai lượt đi-về thay vì năm mươi mốt. Hai truy vấn cũng tránh gửi dòng user 20 lần cho 20 ghi chú.']),
    q('c2', ['Which line in a pull request is the N+1 pattern?', 'Dòng nào trong pull request là mẫu N+1?'],
      ['for (const u of users) { const notes = await prisma.note.findMany({ where: { authorId: u.id } }) }', 'const users = await prisma.user.findMany({ include: { notes: true } })', 'const [items, total] = await prisma.$transaction([…])', 'await prisma.note.groupBy({ by: ["authorId"], _count: { _all: true } })'],
      ['An await on a database call inside a loop over rows you just fetched. It also hides inside helpers: await enrich(note).', 'Một lần await gọi CSDL bên trong vòng lặp qua các dòng vừa lấy. Nó cũng ẩn trong hàm phụ: await enrich(note).']),
    q('c3', ['50 users, 1000 notes: the loop took 79 ms and 51 queries; include took 14 ms and 2. Why does the gap get WORSE in production?', '50 user, 1000 ghi chú: vòng lặp mất 79 ms và 51 truy vấn; include mất 14 ms và 2. Vì sao chênh lệch TỆ HƠN trên production?'],
      ['The database is a network hop away, so each of the 51 round trips adds latency', 'Production databases are slower at parsing SQL than a laptop', 'include results are cached on production, the loop is not', 'The loop runs its queries in parallel only on production'],
      ['That is why this bug always appears after launch: it was fine with 10 users in development.', 'Vì thế lỗi này luôn xuất hiện sau khi ra mắt: với 10 user lúc phát triển thì vẫn ổn.']),
    q('c4', ['You only need “how many notes does each user have”. Which is right?', 'Bạn chỉ cần "mỗi user có bao nhiêu ghi chú". Cách nào đúng?'],
      ['groupBy by authorId with _count (1 query, 5 ms)', 'include: { notes: true } then u.notes.length', 'A loop of prisma.note.count per user', 'findMany all notes and count them in a Map'],
      ['Do not fetch what you are only going to count: 1000 rows travelled the network so you could call .length.', 'Đừng kéo về thứ bạn chỉ định đếm: 1000 dòng đi qua mạng để bạn gọi .length.']),
    q('c5', ['<code>select</code> vs <code>omit: { body: true }</code> on a list endpoint — what is the trade?', '<code>select</code> so với <code>omit: { body: true }</code> trên endpoint danh sách — đánh đổi là gì?'],
      ['select needs you to add every new field; omit keeps new fields automatically but you must remember to exclude new heavy ones', 'omit is slower because it fetches everything and drops body in JavaScript', 'select cannot be used with relations', 'They are identical; omit is an alias'],
      ['Same data, every column 322.1 KB vs 4 columns 50.1 KB. Pick per endpoint.', 'Cùng dữ liệu, mọi cột 322,1 KB so với 4 cột 50,1 KB. Chọn theo từng endpoint.']),
    q('c6', ['How does the lesson suggest catching N+1 BEFORE production?', 'Bài gợi ý bắt N+1 TRƯỚC production thế nào?'],
      ['Count queries in a test: “this endpoint issues at most 3 statements”', 'Log every single query in production and read the logs daily', 'Use include everywhere, so that loops simply cannot exist', 'Set the pool size to 1 so that slow loops become obvious'],
      ['Never log every query in production: a flood, real CPU, and query parameters can contain personal data. Log slow queries only.', 'Đừng log mọi truy vấn trên production: lũ log, tốn CPU thật, và tham số truy vấn có thể chứa dữ liệu cá nhân. Chỉ log truy vấn chậm.']),
  ],
  goiY: [['Count round trips, not lines of code.', 'Đếm lượt đi-về, không đếm dòng code.'], ['If you will only count it, let the database count it.', 'Nếu chỉ định đếm, hãy để CSDL đếm.']],
  loi: [['Believing include is one JOIN.', 'Tin rằng include là một JOIN.'], ['Fetching a relation just to call .length.', 'Kéo cả quan hệ về chỉ để gọi .length.']],
  tns: [tn('N+1', 'N+1', '1 truy vấn cha + N truy vấn con.'), tn('round trip', 'lượt đi-về'), tn('_count', '_count', 'Đếm quan hệ mà không gửi dòng.')],
  kn: ['N+1', 'Prisma relations'],
});

/* bộ GIẢ: Prisma đếm câu SQL (như prisma.$on('query')) và số dòng gửi về Node */
const FAKE_REL = `const mkPrisma = (nUsers = 5, notesPer = [3, 0, 2, 1, 0]) => { let queries = 0, noteRowsShipped = 0, id = 0;
  const users = Array.from({ length: nUsers }, (_, i) => ({ id: i + 1, name: 'User ' + (i + 1) }));
  const notes = []; users.forEach((u, i) => { for (let k = 0; k < (notesPer[i] ?? 2); k++) notes.push({ id: ++id, authorId: u.id, title: 'n' + id, body: 'x'.repeat(100) }); });
  const wait = (v) => new Promise((ok) => setTimeout(() => ok(v), 1));     // ~1 ms round trip, like a database next door
  const sel = (r, s) => (s ? Object.fromEntries(Object.keys(s).filter((k) => s[k]).map((k) => [k, r[k]])) : { ...r });
  const authorOk = (w, n) => !w || w.authorId === undefined || (typeof w.authorId === 'object' ? w.authorId.in.includes(n.authorId) : w.authorId === n.authorId);
  return { stats: () => ({ queries, noteRowsShipped }),
    user: { findMany: (a = {}) => { queries++; if (a.include) throw new Error('this fake does not implement include — collect the ids and use note.findMany'); return wait(users.map((u) => sel(u, a.select))); } },
    note: {
      findMany: (a = {}) => { queries++; const r = notes.filter((n) => authorOk(a.where, n)).sort((x, y) => x.id - y.id); noteRowsShipped += r.length; return wait(r.map((n) => sel(n, a.select))); },
      groupBy: (a) => { queries++; if (String(a.by) !== 'authorId') throw new Error('group by authorId'); const m = new Map(); for (const n of notes) m.set(n.authorId, (m.get(n.authorId) || 0) + 1); return wait([...m].map(([authorId, c]) => ({ authorId, _count: { _all: c } }))); },
      count: (a = {}) => { queries++; return wait(notes.filter((n) => authorOk(a.where, n)).length); },
    } }; };`;

/* ── 2. Sửa N+1: hai truy vấn, gom bằng Map ── */
async function usersWithNotes(prisma) {
  const users = await prisma.user.findMany({ select: { id: true, name: true } });
  const ids = users.map((u) => u.id);
  // ONE query for every user's notes: WHERE "authorId" IN (…)
  const notes = await prisma.note.findMany({ where: { authorId: { in: ids } }, select: { id: true, title: true, authorId: true } });
  // index by key, then stitch — the dataloader pattern in its simplest form
  const byUser = new Map(users.map((u) => [u.id, []]));
  for (const n of notes) byUser.get(n.authorId)?.push({ id: n.id, title: n.title });
  return users.map((u) => ({ ...u, notes: byUser.get(u.id) }));
}
const E2 = jsBai({
  ten: '7.4 · 2 — Fix the N+1: write usersWithNotes(prisma) with two queries and a Map', kho: 'MEDIUM', phut: 15,
  en: `<p>The starter is row A of the lesson: one query for the users, then one per user — 1 + N statements. The grader’s fake Prisma counts statements exactly like <code>prisma.$on('query')</code> did. Rewrite it as row C (“findMany + group with a Map”, 2 queries):</p>
<ul><li><code>prisma.user.findMany({ select: { id: true, name: true } })</code>.</li>
<li>One <code>prisma.note.findMany({ where: { authorId: { in: ids } }, select: { id: true, title: true, authorId: true } })</code>.</li>
<li>Return the users in the order received, each as <code>{ id, name, notes: [{ id, title }, …] }</code> (notes by id ascending; a user with no notes gets <code>[]</code>).</li></ul>
<p>The fake does not implement <code>include</code> — the point is to write the stitching yourself.</p>`,
  vi: `<p>Code khởi đầu là dòng A của bài: một truy vấn cho user, rồi mỗi user một truy vấn — 1 + N câu. Prisma GIẢ của máy chấm đếm số câu đúng như <code>prisma.$on('query')</code>. Viết lại thành dòng C ("findMany + gom bằng Map", 2 truy vấn):</p>
<ul><li><code>prisma.user.findMany({ select: { id: true, name: true } })</code>.</li>
<li>Một <code>prisma.note.findMany({ where: { authorId: { in: ids } }, select: { id: true, title: true, authorId: true } })</code>.</li>
<li>Trả các user theo thứ tự nhận được, mỗi user dạng <code>{ id, name, notes: [{ id, title }, …] }</code> (ghi chú theo id tăng dần; user không có ghi chú nhận <code>[]</code>).</li></ul>
<p>Hàm giả không cài <code>include</code> — mục đích là tự viết phần ghép.</p>`,
  yc: [['At most 2 statements, whatever the number of users.', 'Tối đa 2 câu, dù có bao nhiêu user.'], ['No <code>await</code> on the database inside a loop.', 'Không <code>await</code> gọi CSDL bên trong vòng lặp.']],
  goiY: [['<code>const byUser = new Map(users.map((u) => [u.id, []]))</code> — every user starts with an empty list.', '<code>const byUser = new Map(users.map((u) => [u.id, []]))</code> — user nào cũng bắt đầu với danh sách rỗng.'], ['Loop over the notes once: <code>byUser.get(n.authorId).push({ id: n.id, title: n.title })</code>.', 'Lặp qua ghi chú một lần: <code>byUser.get(n.authorId).push({ id: n.id, title: n.title })</code>.']],
  loi: [['<code>users.map(async (u) => …findMany …)</code> with Promise.all: faster on a laptop, still N+1 statements and N pool checkouts.', '<code>users.map(async (u) => …findMany …)</code> với Promise.all: nhanh hơn trên laptop, vẫn là N+1 câu và N lần mượn pool.'], ['<code>notes.filter((n) => n.authorId === u.id)</code> inside <code>users.map</code>: correct, but O(users × notes) in JavaScript.', '<code>notes.filter((n) => n.authorId === u.id)</code> trong <code>users.map</code>: đúng, nhưng O(user × ghi chú) trong JavaScript.']],
  gt: ['Collect the ids, fetch once with IN, index by key, stitch: two statements no matter how many users, and a single pass over the notes. Statement count is the number that grows with production latency — 51 round trips at 1 ms is +51 ms, 2 is +2 ms.', 'Gom id, lấy một lần bằng IN, đánh chỉ mục theo khoá, ghép: hai câu bất kể bao nhiêu user, và một lượt duyệt qua ghi chú. Số câu chính là con số tăng theo độ trễ production — 51 lượt đi-về ở 1 ms là +51 ms, 2 lượt là +2 ms.'],
  kn: ['N+1', 'dataloader'],
  tns: [tn('stitch', 'ghép', 'Nối dòng cha với dòng con trong JavaScript.'), tn('IN (…)', 'IN (…)', 'Lọc theo một danh sách khoá.')],
  dau: `async function usersWithNotes(prisma) {
  // Write your solution here — this is the N+1 loop of the lesson
  const users = await prisma.user.findMany({ select: { id: true, name: true } });
  const out = [];
  for (const u of users) {
    const notes = await prisma.note.findMany({ where: { authorId: u.id }, select: { id: true, title: true } });
    out.push({ ...u, notes });
  }
  return out;
}
`,
  giai: usersWithNotes,
  chung: FAKE_REL,
  cases: [
    { goi: `await (async () => { const p = mkPrisma(); const r = await usersWithNotes(p); return [r, p.stats()]; })()`, moTa: ['5 users ⇒ result + 2 statements', '5 user ⇒ kết quả + 2 câu'] },
    { goi: `await (async () => { const p = mkPrisma(50, Array(50).fill(20)); const r = await usersWithNotes(p); return [r.length, r.reduce((s, u) => s + u.notes.length, 0), p.stats().queries]; })()`, moTa: ['The lesson’s 50 users × 20 notes', '50 user × 20 ghi chú của bài'] },
    { goi: `await (async () => { const p = mkPrisma(3, [0, 0, 0]); return [await usersWithNotes(p), p.stats().queries]; })()`, an: true },
    { goi: `await (async () => { const p = mkPrisma(200, Array(200).fill(1)); const t0 = Date.now(); await usersWithNotes(p); return [p.stats().queries, Date.now() - t0]; })()`, an: true, moTa: ['200 users: still 2 statements, 2 ms', '200 user: vẫn 2 câu, 2 ms'] },
  ],
});

/* ── 3. Đếm mà không kéo dòng về ── */
async function noteCounts(prisma) {
  // the database counts and sends one number per author — no note rows travel the network
  const [users, groups] = await Promise.all([
    prisma.user.findMany({ select: { id: true, name: true } }),
    prisma.note.groupBy({ by: ['authorId'], _count: { _all: true } }),
  ]);
  const count = new Map(groups.map((g) => [g.authorId, g._count._all]));
  return users.map((u) => ({ id: u.id, name: u.name, notes: count.get(u.id) ?? 0 }));   // no group = zero notes
}
const E3 = jsBai({
  ten: '7.4 · 3 — Write noteCounts(prisma): counts per user without shipping a single note row', kho: 'MEDIUM', phut: 12,
  en: `<p>“Do not fetch what you are only going to count.” Row D of the lesson: <code>groupBy</code>, 1 query, 5 ms, versus include carrying 1000 rows. Write <code>noteCounts(prisma)</code> returning <code>[{ id, name, notes }]</code> for every user, in the order of <code>prisma.user.findMany({ select: { id: true, name: true } })</code>:</p>
<ul><li>Get the counts with <code>prisma.note.groupBy({ by: ['authorId'], _count: { _all: true } })</code> ⇒ <code>[{ authorId, _count: { _all: n } }]</code>.</li>
<li>A user with no notes has no group — report <code>notes: 0</code>.</li>
<li>The fake counts statements <b>and the note rows shipped to Node</b>: you must ship 0 note rows and use at most 2 statements. (You may run the two queries with <code>Promise.all</code>.)</li></ul>`,
  vi: `<p>"Đừng kéo về thứ bạn chỉ định đếm." Dòng D của bài: <code>groupBy</code>, 1 truy vấn, 5 ms, so với include mang 1000 dòng. Viết <code>noteCounts(prisma)</code> trả <code>[{ id, name, notes }]</code> cho mọi user, theo thứ tự của <code>prisma.user.findMany({ select: { id: true, name: true } })</code>:</p>
<ul><li>Lấy số đếm bằng <code>prisma.note.groupBy({ by: ['authorId'], _count: { _all: true } })</code> ⇒ <code>[{ authorId, _count: { _all: n } }]</code>.</li>
<li>User không có ghi chú thì không có nhóm — báo <code>notes: 0</code>.</li>
<li>Hàm giả đếm số câu <b>và số dòng ghi chú gửi về Node</b>: bạn phải gửi 0 dòng ghi chú và dùng tối đa 2 câu. (Có thể chạy hai truy vấn bằng <code>Promise.all</code>.)</li></ul>`,
  yc: [['Zero note rows shipped.', 'Không gửi dòng ghi chú nào.'], ['Users without notes appear with 0.', 'User không có ghi chú vẫn xuất hiện với 0.']],
  goiY: [['Turn the groups into a Map: <code>new Map(groups.map((g) => [g.authorId, g._count._all]))</code>.', 'Biến các nhóm thành Map: <code>new Map(groups.map((g) => [g.authorId, g._count._all]))</code>.'], ['<code>count.get(u.id) ?? 0</code> handles the missing groups.', '<code>count.get(u.id) ?? 0</code> xử lý các nhóm vắng.']],
  loi: [['Fetching every note and calling <code>.length</code> — the 322 KB version.', 'Kéo mọi ghi chú về rồi gọi <code>.length</code> — bản 322 KB.'], ['Returning only the users that have groups: Dung, with 0 notes, disappears from the report.', 'Chỉ trả user có nhóm: Dung, 0 ghi chú, biến mất khỏi báo cáo.']],
  gt: ['GROUP BY runs where the data is and sends one small row per author. The JavaScript side only joins two tiny lists by key. The zero case is the classic trap of aggregates: a group exists only for keys that have rows, so “no notes” has to be filled in from the users list.', 'GROUP BY chạy ở nơi có dữ liệu và gửi về mỗi tác giả một dòng nhỏ. Phía JavaScript chỉ ghép hai danh sách nhỏ theo khoá. Trường hợp số 0 là bẫy kinh điển của hàm gộp: chỉ khoá nào có dòng mới có nhóm, nên "không có ghi chú" phải điền từ danh sách user.'],
  kn: ['aggregation', 'groupBy'],
  tns: [tn('groupBy', 'gom nhóm'), tn('aggregate', 'hàm gộp', 'count, sum, avg…')],
  dau: `async function noteCounts(prisma) {
  // Write your solution here
  const users = await prisma.user.findMany({ select: { id: true, name: true } });
  const notes = await prisma.note.findMany({});
  return users.map((u) => ({ id: u.id, name: u.name, notes: notes.filter((n) => n.authorId === u.id).length }));
}
`,
  giai: noteCounts,
  chung: FAKE_REL,
  cases: [
    { goi: `await (async () => { const p = mkPrisma(); const r = await noteCounts(p); return [r, p.stats()]; })()`, moTa: ['Counts, zeros included, 0 note rows shipped', 'Số đếm, kể cả số 0, không gửi dòng ghi chú'] },
    { goi: `await (async () => { const p = mkPrisma(50, Array(50).fill(20)); const r = await noteCounts(p); return [r[0], r.length, p.stats()]; })()`, an: true },
    { goi: `await (async () => { const p = mkPrisma(4, [0, 5, 0, 1]); return await noteCounts(p); })()`, an: true },
  ],
});

/* ── 4. Dataloader: gom mọi load() cùng nhịp thành một truy vấn ── */
function createLoader(batchFn) {
  const cache = new Map();          // key -> Promise of the value (per request: the same key is fetched once)
  let queue = [];                   // keys requested in the current tick, with their resolvers
  function flush() {
    const batch = queue;
    queue = [];
    const keys = [...new Set(batch.map((b) => b.key))];
    batchFn(keys).then((rows) => {
      const byKey = new Map(rows.map((r) => [r.id, r]));
      for (const b of batch) b.resolve(byKey.get(b.key) ?? null);    // a missing row is null, not an error
    }, (err) => { for (const b of batch) { cache.delete(b.key); b.reject(err); } });
  }
  return {
    load(key) {
      if (cache.has(key)) return cache.get(key);
      const p = new Promise((resolve, reject) => {
        queue.push({ key, resolve, reject });
        if (queue.length === 1) queueMicrotask(flush);                // first load of this tick schedules ONE flush
      });
      cache.set(key, p);
      return p;
    },
  };
}
const FAKE_LOADER = `const mkUsersDb = () => { const calls = []; const users = [1, 2, 3, 4, 5, 7].map((id) => ({ id, name: 'User ' + id }));
  const byIds = (ids) => { calls.push([...ids]); return new Promise((ok) => setTimeout(() => ok(users.filter((u) => ids.includes(u.id)).reverse()), 1)); };
  byIds.calls = calls; return byIds; };
const notes = Array.from({ length: 50 }, (_, i) => ({ id: i + 1, authorId: (i % 5) + 1 }));`;
const E4 = jsBai({
  ten: '7.4 · 4 — Write createLoader(batchFn): turn many await enrich(note) calls into one IN query', kho: 'HARD', phut: 25,
  en: `<p>N+1 hides inside helpers: <code>await enrich(note)</code> looks harmless until you find a query in it. The fix that keeps the helper is a <b>dataloader</b>: every <code>load(key)</code> made in the same tick is collected and sent as one <code>WHERE id IN (…)</code>. Write <code>createLoader(batchFn)</code> returning <code>{ load(key) }</code>:</p>
<ul><li><code>batchFn(keys)</code> is async and returns the rows for those keys <b>in any order</b> (each row has <code>id</code>), possibly fewer rows than keys.</li>
<li>All <code>load</code> calls made before the next microtask go into <b>one</b> <code>batchFn</code> call, with each key <b>once</b> (first-request order). Schedule the flush with <code>queueMicrotask</code>.</li>
<li><code>load(key)</code> resolves to the row whose <code>id === key</code>, or <code>null</code> when there is none.</li>
<li>Cache per loader: loading a key that was already requested returns the same promise and never queries again.</li>
<li>If <code>batchFn</code> rejects, every load of that batch rejects with that error (and those keys are not cached).</li></ul>`,
  vi: `<p>N+1 ẩn trong hàm phụ: <code>await enrich(note)</code> trông vô hại cho tới khi bạn thấy truy vấn bên trong. Cách sửa giữ được hàm phụ là <b>dataloader</b>: mọi <code>load(key)</code> gọi trong cùng một nhịp được gom và gửi thành một câu <code>WHERE id IN (…)</code>. Viết <code>createLoader(batchFn)</code> trả <code>{ load(key) }</code>:</p>
<ul><li><code>batchFn(keys)</code> là async và trả các dòng của những khoá đó <b>theo thứ tự bất kỳ</b> (mỗi dòng có <code>id</code>), có thể ít dòng hơn số khoá.</li>
<li>Mọi lời gọi <code>load</code> trước microtask kế tiếp vào <b>một</b> lần <code>batchFn</code>, mỗi khoá <b>một lần</b> (theo thứ tự yêu cầu đầu tiên). Lên lịch flush bằng <code>queueMicrotask</code>.</li>
<li><code>load(key)</code> resolve thành dòng có <code>id === key</code>, hoặc <code>null</code> nếu không có.</li>
<li>Cache theo loader: load một khoá đã được yêu cầu trả cùng promise và không bao giờ truy vấn lại.</li>
<li>Nếu <code>batchFn</code> reject, mọi load của lô đó reject với lỗi đó (và các khoá đó không bị cache).</li></ul>`,
  yc: [['One batchFn call per tick, unique keys.', 'Mỗi nhịp một lần batchFn, khoá không trùng.'], ['Map rows back by id — never by position.', 'Ghép dòng lại theo id — không bao giờ theo vị trí.']],
  goiY: [['Keep <code>queue = [{ key, resolve, reject }]</code>; when the first item is pushed, <code>queueMicrotask(flush)</code>.', 'Giữ <code>queue = [{ key, resolve, reject }]</code>; khi đẩy phần tử đầu tiên, <code>queueMicrotask(flush)</code>.'], ['In <code>flush</code>: swap the queue for a new array, dedupe keys with a Set, call batchFn once, then resolve every waiter from a <code>Map(id → row)</code>.', 'Trong <code>flush</code>: đổi queue sang mảng mới, khử trùng khoá bằng Set, gọi batchFn một lần, rồi resolve mọi người chờ từ <code>Map(id → dòng)</code>.']],
  loi: [['Resolving by position (<code>rows[i]</code>): the database returns rows in any order and skips missing ones, so users get each other’s names.', 'Resolve theo vị trí (<code>rows[i]</code>): CSDL trả dòng theo thứ tự bất kỳ và bỏ dòng không có, nên người này nhận tên người kia.'], ['Calling batchFn inside load: that is the N+1 again, one IN per key.', 'Gọi batchFn trong load: lại là N+1, mỗi khoá một câu IN.'], ['Not clearing the queue before calling batchFn: loads made while it runs are lost or sent twice.', 'Không làm rỗng queue trước khi gọi batchFn: load gọi trong lúc nó chạy bị mất hoặc gửi hai lần.']],
  gt: ['A microtask runs after the current synchronous code and the promise callbacks already queued — so every load triggered by one Promise.all over the notes lands in the same queue before the flush runs. That turns fifty helper calls into one IN query without changing the helper’s code. This is exactly what libraries like dataloader do, and what cuongthai.com’s feed does by hand for authors, media and reaction counts.', 'Microtask chạy sau code đồng bộ hiện tại và các callback promise đã xếp hàng — nên mọi load gây ra bởi một Promise.all qua các ghi chú rơi vào cùng một hàng đợi trước khi flush chạy. Năm mươi lời gọi hàm phụ thành một câu IN mà không đổi code hàm phụ. Đây đúng là việc các thư viện như dataloader làm, và việc bảng tin cuongthai.com tự làm tay cho tác giả, media và số lượt cảm xúc.'],
  kn: ['dataloader', 'N+1', 'microtasks'],
  tns: [tn('batching', 'gom lô'), tn('microtask', 'microtask', 'Việc chạy ngay sau đoạn code đồng bộ hiện tại.'), tn('memoize', 'nhớ kết quả')],
  dau: `function createLoader(batchFn) {
  return {
    // Write your solution here
    async load(key) {
      const rows = await batchFn([key]);
      return rows[0] ?? null;
    },
  };
}
`,
  giai: createLoader,
  chung: FAKE_LOADER,
  cases: [
    { goi: `await (async () => { const db = mkUsersDb(); const L = createLoader(db); const enrich = async (n) => ({ ...n, author: (await L.load(n.authorId)).name }); const r = await Promise.all(notes.slice(0, 6).map(enrich)); return [r, db.calls]; })()`, moTa: ['6 notes, 5 distinct authors ⇒ one batch', '6 ghi chú, 5 tác giả khác nhau ⇒ một lô'] },
    { goi: `await (async () => { const db = mkUsersDb(); const L = createLoader(db); const r = await Promise.all([L.load(7), L.load(6), L.load(1)]); return [r, db.calls]; })()`, moTa: ['Rows come back reversed and 6 is missing ⇒ matched by id, null', 'Dòng về đảo ngược và thiếu 6 ⇒ ghép theo id, null'] },
    { goi: `await (async () => { const db = mkUsersDb(); const L = createLoader(db); await Promise.all(notes.map((n) => L.load(n.authorId))); const again = await L.load(3); await Promise.all([L.load(4), L.load(7)]); return [again, db.calls]; })()`, an: true, moTa: ['50 loads ⇒ 1 batch; cached key ⇒ no query; next tick ⇒ new batch with only the new key', '50 lần load ⇒ 1 lô; khoá đã cache ⇒ không truy vấn; nhịp sau ⇒ lô mới chỉ có khoá mới'] },
    { goi: `await (async () => { let n = 0; const L = createLoader((ids) => (++n === 1 ? Promise.reject(new Error('db down')) : Promise.resolve(ids.map((id) => ({ id }))))); const r = await Promise.allSettled([L.load(1), L.load(2)]); const retry = await L.load(1); return [r.map((x) => x.status + ':' + (x.reason ? x.reason.message : '')), retry, n]; })()`, an: true },
  ],
  saiMau: [
    createLoader.toString().replace('for (const b of batch) b.resolve(byKey.get(b.key) ?? null);', 'batch.forEach((b, i) => b.resolve(rows[keys.indexOf(b.key)] ?? null));'),
    createLoader.toString().replace('const keys = [...new Set(batch.map((b) => b.key))];', 'const keys = batch.map((b) => b.key);').replace('if (cache.has(key)) return cache.get(key);', ''),
  ],
});

/* ── 5. SQL: where: { notes: { some: { pinned: true } } } = EXISTS ── */
const E5 = sqlBai({
  ten: '7.4 · 5 — Translate notes: { some: { pinned: true } } into SQL', kho: 'EASY', phut: 10,
  en: `<p>Prisma’s relation filters <code>some</code> / <code>every</code> / <code>none</code> become an SQL <code>EXISTS</code> subquery. Write the SQL for</p>
<pre>prisma.user.findMany({ where: { notes: { some: { pinned: true } } }, select: { id: true, name: true }, orderBy: { id: 'asc' } })</pre>
<p>Return <code>id, name</code> of every user who has <b>at least one pinned note</b>, ordered by <code>id</code>. Each user appears once, however many pinned notes they have.</p>`,
  vi: `<p>Bộ lọc quan hệ <code>some</code> / <code>every</code> / <code>none</code> của Prisma thành truy vấn con <code>EXISTS</code> trong SQL. Viết SQL cho câu Prisma ở bản tiếng Anh: trả <code>id, name</code> của mọi user có <b>ít nhất một ghi chú được ghim</b>, sắp theo <code>id</code>. Mỗi user xuất hiện một lần, dù có bao nhiêu ghi chú ghim.</p>`,
  yc: [['Use <code>EXISTS (SELECT 1 FROM "Note" n WHERE n."authorId" = u.id AND …)</code>.', 'Dùng <code>EXISTS (SELECT 1 FROM "Note" n WHERE n."authorId" = u.id AND …)</code>.'], ['No duplicates.', 'Không trùng dòng.']],
  giai: `-- some = "there EXISTS a related row matching the condition"
SELECT u.id, u.name
FROM "User" u
WHERE EXISTS (SELECT 1 FROM "Note" n WHERE n."authorId" = u.id AND n.pinned)
ORDER BY u.id;
`,
  kiem: [
    kq(['Users with a pinned note', 'User có ghi chú được ghim'], { thuTu: true }),
    kqAn(['Hidden: one user with two pinned notes appears once', 'Ẩn: user có hai ghi chú ghim chỉ xuất hiện một lần'], `UPDATE "Note" SET pinned = true WHERE "authorId" = 1; UPDATE "Note" SET pinned = false WHERE "authorId" = 3;`, { thuTu: true }),
    kqAn(['Hidden: nobody pinned anything', 'Ẩn: không ai ghim gì'], `UPDATE "Note" SET pinned = false;`, { thuTu: true, choPhepRong: true }),
  ],
  sai: [`SELECT u.id, u.name FROM "User" u JOIN "Note" n ON n."authorId" = u.id WHERE n.pinned ORDER BY u.id;`, `SELECT id, name FROM "User" WHERE id IN (2, 3) ORDER BY id;`],
  goiY: [['Start from <code>SELECT u.id, u.name FROM "User" u WHERE EXISTS ( … ) ORDER BY u.id</code>.', 'Bắt đầu từ <code>SELECT u.id, u.name FROM "User" u WHERE EXISTS ( … ) ORDER BY u.id</code>.'], ['Inside: <code>SELECT 1 FROM "Note" n WHERE n."authorId" = u.id AND n.pinned</code>.', 'Bên trong: <code>SELECT 1 FROM "Note" n WHERE n."authorId" = u.id AND n.pinned</code>.']],
  loi: [['A plain JOIN: a user with two pinned notes comes back twice.', 'JOIN thường: user có hai ghi chú ghim trả về hai lần.'], ['Writing <code>authorId</code> without quotes — PostgreSQL folds it to <code>authorid</code> and says the column does not exist.', 'Viết <code>authorId</code> không có ngoặc kép — PostgreSQL hạ thành <code>authorid</code> và báo cột không tồn tại.']],
  gt: ['EXISTS asks a yes/no question per parent row and stops at the first match, so it never multiplies rows. That is why Prisma compiles some / none to EXISTS / NOT EXISTS, and every to NOT EXISTS of the negated condition.', 'EXISTS hỏi một câu có/không cho mỗi dòng cha và dừng ở dòng khớp đầu tiên, nên không bao giờ nhân dòng. Vì vậy Prisma dịch some / none thành EXISTS / NOT EXISTS, còn every thành NOT EXISTS của điều kiện phủ định.'],
  tns: [tn('EXISTS', 'EXISTS', 'Có ít nhất một dòng thoả mãn không.'), tn('semi-join', 'nửa phép nối')],
  kn: ['SQL', 'relation filters'],
});

/* ── 6. SQL: đếm theo nhóm, có cả số 0 ── */
const E6 = sqlBai({
  ten: '7.4 · 6 — One query: notes and pinned notes per user, zeros included', kho: 'MEDIUM', phut: 12,
  en: `<p>The SQL behind <code>include: { _count: { select: { notes: true } } }</code>, plus one more number. In <b>one</b> query, for <b>every</b> user (including Dung, who has no notes) return <code>id, name, notes, pinned</code>: the number of notes and the number of pinned notes, ordered by <code>id</code>. Both counts are <code>0</code>, not NULL, for a user with no notes.</p>`,
  vi: `<p>SQL đằng sau <code>include: { _count: { select: { notes: true } } }</code>, thêm một con số. Trong <b>một</b> truy vấn, cho <b>mọi</b> user (kể cả Dung, chưa có ghi chú) trả <code>id, name, notes, pinned</code>: số ghi chú và số ghi chú được ghim, sắp theo <code>id</code>. Cả hai số là <code>0</code>, không phải NULL, với user không có ghi chú.</p>`,
  yc: [['LEFT JOIN so users without notes stay.', 'LEFT JOIN để user không có ghi chú vẫn còn.'], ['Count note ids, not rows.', 'Đếm id ghi chú, không đếm dòng.']],
  giai: `-- every user stays (LEFT JOIN); count(n.id) ignores the NULLs of users without notes
SELECT u.id, u.name,
       count(n.id)                          AS notes,
       count(n.id) FILTER (WHERE n.pinned)  AS pinned
FROM "User" u
LEFT JOIN "Note" n ON n."authorId" = u.id
GROUP BY u.id, u.name
ORDER BY u.id;
`,
  kiem: [
    kq(['Every user with both counts', 'Mọi user với cả hai số đếm'], { thuTu: true }),
    kqAn(['Hidden: nothing pinned, one user with only unpinned notes', 'Ẩn: không gì được ghim, một user chỉ có ghi chú không ghim'], `UPDATE "Note" SET pinned = false; DELETE FROM "Note" WHERE "authorId" = 3;`, { thuTu: true }),
    kqAn(['Hidden: different notes', 'Ẩn: ghi chú khác'], `DELETE FROM "Note" WHERE "authorId" = 2; INSERT INTO "Note" (title, slug, pinned, "authorId", "createdAt", "updatedAt") VALUES ('d1', 'd-1', true, 4, now(), now()), ('d2', 'd-2', true, 4, now(), now());`, { thuTu: true }),
  ],
  sai: [
    `SELECT u.id, u.name, count(*) AS notes, count(*) FILTER (WHERE n.pinned) AS pinned FROM "User" u LEFT JOIN "Note" n ON n."authorId" = u.id GROUP BY u.id, u.name ORDER BY u.id;`,
    `SELECT u.id, u.name, count(n.id) AS notes, count(n.id) FILTER (WHERE n.pinned) AS pinned FROM "User" u JOIN "Note" n ON n."authorId" = u.id GROUP BY u.id, u.name ORDER BY u.id;`,
  ],
  goiY: [['<code>FROM "User" u LEFT JOIN "Note" n ON n."authorId" = u.id GROUP BY u.id, u.name</code>.', '<code>FROM "User" u LEFT JOIN "Note" n ON n."authorId" = u.id GROUP BY u.id, u.name</code>.'], ['<code>count(n.id)</code> skips NULLs; <code>count(n.id) FILTER (WHERE n.pinned)</code> counts only pinned ones.', '<code>count(n.id)</code> bỏ qua NULL; <code>count(n.id) FILTER (WHERE n.pinned)</code> chỉ đếm cái được ghim.']],
  loi: [['<code>count(*)</code> after a LEFT JOIN: Dung’s single all-NULL row counts as 1 note.', '<code>count(*)</code> sau LEFT JOIN: dòng toàn NULL duy nhất của Dung bị đếm là 1 ghi chú.'], ['An inner JOIN: users without notes vanish — the same zero trap as exercise 3, in SQL.', 'JOIN thường: user không có ghi chú biến mất — đúng bẫy số 0 của bài 3, trong SQL.']],
  gt: ['LEFT JOIN keeps every user, producing one all-NULL note row for users without notes; count(column) ignores NULLs, so that row counts as 0. FILTER narrows an aggregate without a second query or a CASE. One statement, one number per user, nothing heavy on the wire.', 'LEFT JOIN giữ mọi user, tạo một dòng ghi chú toàn NULL cho user không có ghi chú; count(cột) bỏ qua NULL, nên dòng đó tính là 0. FILTER thu hẹp hàm gộp mà không cần truy vấn thứ hai hay CASE. Một câu, mỗi user một con số, không có gì nặng trên đường truyền.'],
  tns: [tn('LEFT JOIN', 'nối trái', 'Giữ mọi dòng bên trái.'), tn('FILTER (WHERE …)', 'lọc cho hàm gộp')],
  kn: ['SQL', 'aggregation'],
});

export default modul('nodejs-7-4-quan-he-va-n-plus-1', '7.4 Relations, and the N+1 problem measured', [E1, E2, E3, E4, E5, E6]);
