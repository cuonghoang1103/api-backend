/** Node.js 7.6 — Giữ hợp đồng chương 6 với CSDL thật: cursor + take+1 (không count), P2002 → 409 (meta của Prisma 7), cột version + updateMany chống mất cập nhật, SQL có tham số thay vì nối chuỗi, keyset (createdAt, id). */
import { modul, cs, q, tn, jsBai, sqlBai, kq, kqAn, APP_ERROR } from './_node-c6-8.mjs';

/* ── 1. Trắc nghiệm ── */
const E1 = cs({
  ten: '7.6 · 1 — Every chapter-6 promise, measured on 751,000 rows', kho: 'EASY', phut: 8,
  en: 'Lesson 7.6 implements chapter 6’s promises against a real table. Each one is a two-line change with a large number attached. Six questions.',
  vi: 'Bài 7.6 hiện thực các lời hứa của chương 6 trên một bảng thật. Mỗi lời hứa là một thay đổi hai dòng kèm một con số lớn. Sáu câu hỏi.',
  cau: [
    q('c1', ['<code>skip: 700000, take: 20</code> took 108.6 ms; <code>where id &lt; cursor, take: 20</code> took 0.6 ms. What does the cursor version read?', '<code>skip: 700000, take: 20</code> mất 108,6 ms; <code>where id &lt; cursor, take: 20</code> mất 0,6 ms. Bản cursor đọc gì?'],
      ['The index from the position you name, stopping after twenty rows', 'The whole table, but faster because of caching', 'Only the rows inserted since the last page', 'A precomputed page stored by Prisma'],
      ['181× faster, and an insert cannot shift a cursor: it is a position in the data, not in a result set.', 'Nhanh gấp 181 lần, và insert không dời được cursor: nó là vị trí trong dữ liệu, không phải trong tập kết quả.']),
    q('c2', ['How does the final list() know whether there is a next page without count(*)?', 'list() cuối cùng biết có trang sau không mà không cần count(*) bằng cách nào?'],
      ['It takes limit + 1 rows and checks whether the extra one arrived', 'It reads the planner’s row estimate from pg_class instead', 'It always returns hasMore: true and lets the client find out', 'It runs a second findMany for the next page in parallel'],
      ['No count(*), no second query, no 41.7 ms per request.', 'Không count(*), không truy vấn thứ hai, không 41,7 ms mỗi request.']),
    q('c3', ['On Prisma 7.10.1 with a driver adapter, where do you find which field violated a unique constraint?', 'Trên Prisma 7.10.1 với driver adapter, tìm trường vi phạm ràng buộc unique ở đâu?'],
      ['err.meta.driverAdapterError.cause.constraint', 'err.meta.target, as in every tutorial', 'err.message only', 'err.field'],
      ['Read both, keep a fallback, and log the whole err.meta once in development rather than trusting a blog post.', 'Đọc cả hai, có giá trị dự phòng, và log toàn bộ err.meta một lần khi phát triển thay vì tin một bài blog.']),
    q('c4', ['Why is <code>findUnique</code> then <code>create</code> (“check, then insert”) wrong for unique emails?', 'Vì sao <code>findUnique</code> rồi <code>create</code> ("kiểm rồi mới thêm") là sai với email duy nhất?'],
      ['Two concurrent requests both find nothing and both insert; only the unique index can referee', 'findUnique is too slow on large tables', 'create cannot run after findUnique in the same request', 'It is right; P2002 is only for slugs'],
      ['The unique index is the only version that is correct under concurrency.', 'Chỉ mục unique là phiên bản duy nhất đúng khi chạy đồng thời.']),
    q('c5', ['Why does the version check use <code>updateMany</code> and not <code>update</code>?', 'Vì sao phép kiểm version dùng <code>updateMany</code> chứ không phải <code>update</code>?'],
      ['Only updateMany accepts id AND version in where, and its count is the check', 'updateMany is faster because it skips the unique index entirely', 'update cannot increment a number column, updateMany can', 'updateMany locks the row for the request, update does not'],
      ['count 0 ⇒ someone else changed it ⇒ 409 STALE_VERSION. Same idea as ETag + If-Match at the HTTP layer.', 'count 0 ⇒ có người khác đã đổi ⇒ 409 STALE_VERSION. Cùng ý với ETag + If-Match ở tầng HTTP.']),
    q('c6', ['<code>$queryRawUnsafe(`SELECT count(*)::int AS n FROM "Note" WHERE slug = \'${evil}\'`)</code> with <code>evil = "bulk-1\' OR \'1\'=\'1"</code> returned 751,002. The tagged-template <code>$queryRaw</code> returned 0. Why?', '<code>$queryRawUnsafe(`SELECT count(*)::int AS n FROM "Note" WHERE slug = \'${evil}\'`)</code> với <code>evil = "bulk-1\' OR \'1\'=\'1"</code> trả 751.002. <code>$queryRaw</code> dạng tagged template trả 0. Vì sao?'],
      ['$queryRaw turns every ${…} into a bound parameter, so the quote is data, not SQL', '$queryRaw escapes the word OR', '$queryRawUnsafe ignores the WHERE clause', 'The tagged template runs on a read-only replica'],
      ['Values never go into SQL text. Raw queries also skip type mapping: count(*) comes back as BigInt — cast ::int.', 'Giá trị không bao giờ đi vào chữ SQL. Truy vấn thô cũng bỏ qua ánh xạ kiểu: count(*) về dạng BigInt — ép ::int.']),
  ],
  goiY: [['Each answer is in the lesson’s measurement next to it.', 'Câu trả lời nằm ngay ở phép đo đi kèm trong bài.'], ['Prefer the version that is correct under concurrency, not the one that reads naturally.', 'Chọn bản đúng khi chạy đồng thời, không phải bản đọc thấy tự nhiên.']],
  loi: [['Reading err.meta.target on Prisma 7: the message becomes " already exists".', 'Đọc err.meta.target trên Prisma 7: thông điệp thành " already exists".'], ['Keeping total in the list response and paying count(*) on every page.', 'Giữ total trong phản hồi danh sách và trả count(*) ở mọi trang.']],
  tns: [tn('P2002', 'P2002', 'Prisma: vi phạm ràng buộc unique.'), tn('bound parameter', 'tham số ràng buộc', 'Giá trị gửi riêng, không nằm trong chữ SQL.')],
  kn: ['pagination', 'concurrency', 'SQL injection'],
});

/* ── 2. list() cuối cùng ── */
async function list(prisma, { cursor, limit = 20, authorId }) {
  const take = Math.min(limit, 50);
  const items = await prisma.note.findMany({
    where: { authorId, ...(cursor ? { id: { lt: cursor } } : {}) },
    orderBy: { id: 'desc' },
    take: take + 1,                      // one extra row answers "is there more?"
    omit: { body: true },                // lesson 7.4: 322 KB -> 50 KB
  });
  const hasMore = items.length > take;
  if (hasMore) items.pop();
  return { items, nextCursor: hasMore ? items.at(-1).id : null };
}
const FAKE_LIST = `const mkPrisma = (n = 9, authors = 2) => { const rows = Array.from({ length: n }, (_, i) => ({ id: i + 1, authorId: (i % authors) + 1, title: 't' + (i + 1), body: 'x'.repeat(500) })); const log = [];
  const ok = (w) => (r) => (w.authorId === undefined || r.authorId === w.authorId) && (!w.id || (w.id.lt === undefined || r.id < w.id.lt));
  return { log, note: {
    findMany: (a) => { log.push({ take: a.take, where: a.where, orderBy: a.orderBy, omit: a.omit || null }); let r = rows.filter(ok(a.where || {})); if (a.orderBy && a.orderBy.id === 'desc') r.sort((x, y) => y.id - x.id); r = r.slice(0, a.take ?? 1e9).map((x) => { const c = { ...x }; if (a.omit) for (const k of Object.keys(a.omit)) if (a.omit[k]) delete c[k]; return c; }); return new Promise((res) => setTimeout(() => res(r), 1)); },
    count: () => { log.push('count(*)'); return new Promise((res) => setTimeout(() => res(rows.length), 42)); },
  } }; };`;
const E2 = jsBai({
  ten: '7.6 · 2 — Write the final list(): cursor, take + 1, omit body, no count', kho: 'MEDIUM', phut: 15,
  en: `<p>“Every decision in that function came from a measurement in this chapter.” Write <code>list(prisma, { cursor, limit = 20, authorId })</code> returning <code>{ items, nextCursor }</code>:</p>
<ul><li><code>take = Math.min(limit, 50)</code>.</li>
<li><code>prisma.note.findMany({ where: { authorId, id: { lt: cursor } }, orderBy: { id: 'desc' }, take: take + 1, omit: { body: true } })</code> — the <code>id</code> condition only when a cursor was given.</li>
<li>If more than <code>take</code> rows came back, drop the extra one and set <code>nextCursor</code> to the id of the last item kept; otherwise <code>nextCursor = null</code>.</li>
<li>Never call <code>count</code> — the fake makes it cost 42 ms and the checks look at the call log.</li></ul>`,
  vi: `<p>"Mọi quyết định trong hàm đó đến từ một phép đo trong chương này." Viết <code>list(prisma, { cursor, limit = 20, authorId })</code> trả <code>{ items, nextCursor }</code>:</p>
<ul><li><code>take = Math.min(limit, 50)</code>.</li>
<li><code>prisma.note.findMany({ where: { authorId, id: { lt: cursor } }, orderBy: { id: 'desc' }, take: take + 1, omit: { body: true } })</code> — điều kiện <code>id</code> chỉ khi có cursor.</li>
<li>Nếu nhận về nhiều hơn <code>take</code> dòng, bỏ dòng thừa và đặt <code>nextCursor</code> là id của phần tử cuối được giữ; không thì <code>nextCursor = null</code>.</li>
<li>Không bao giờ gọi <code>count</code> — hàm giả cho nó tốn 42 ms và các kiểm xem nhật ký lời gọi.</li></ul>`,
  yc: [['One findMany per call.', 'Mỗi lần gọi một findMany.'], ['A last page of exactly <code>take</code> rows has <code>nextCursor: null</code>.', 'Trang cuối có đúng <code>take</code> dòng thì <code>nextCursor: null</code>.']],
  goiY: [['Conditional spread: <code>{ authorId, ...(cursor ? { id: { lt: cursor } } : {}) }</code>.', 'Rải có điều kiện: <code>{ authorId, ...(cursor ? { id: { lt: cursor } } : {}) }</code>.'], ['<code>const hasMore = items.length > take; if (hasMore) items.pop();</code>', '<code>const hasMore = items.length > take; if (hasMore) items.pop();</code>']],
  loi: [['<code>nextCursor = items.length === take ? … : null</code> — a final page of exactly 20 rows promises a next page that is empty.', '<code>nextCursor = items.length === take ? … : null</code> — trang cuối đúng 20 dòng hứa một trang sau trống rỗng.'], ['Using the extra row’s id as the cursor: the next page then skips it.', 'Dùng id của dòng thừa làm cursor: trang sau bỏ mất nó.'], ['Leaving body in the list: 322 KB instead of 50 KB on someone’s phone.', 'Để body trong danh sách: 322 KB thay vì 50 KB trên điện thoại người dùng.']],
  gt: ['take + 1 turns “is there a next page?” into a by-product of the query you were running anyway. The cursor is the last row you actually returned, so the next page starts exactly after it. With orderBy id desc and an index on id, every page costs the same 0.6 ms regardless of depth.', 'take + 1 biến "có trang sau không?" thành phụ phẩm của chính truy vấn bạn đang chạy. Cursor là dòng cuối bạn thật sự trả về, nên trang sau bắt đầu ngay sau nó. Với orderBy id desc và chỉ mục trên id, trang nào cũng tốn cùng 0,6 ms bất kể sâu tới đâu.'],
  kn: ['cursor pagination', 'Prisma'],
  tns: [tn('take', 'take', 'Số dòng tối đa (LIMIT).'), tn('omit', 'omit', 'Bỏ cột khỏi kết quả.')],
  dau: `async function list(prisma, { cursor, limit = 20, authorId }) {
  // Write your solution here
  const [items, total] = await Promise.all([
    prisma.note.findMany({ where: { authorId, id: { lt: cursor } }, orderBy: { id: 'desc' }, take: limit }),
    prisma.note.count({ where: { authorId } }),
  ]);
  return { items, nextCursor: items.length === limit ? items.at(-1).id : null, total };
}
`,
  giai: list,
  chung: FAKE_LIST,
  cases: [
    { goi: `await (async () => { const p = mkPrisma(); const r = await list(p, { limit: 2, authorId: 1 }); return [r, p.log]; })()`, moTa: ['First page of author 1, limit 2', 'Trang đầu của tác giả 1, limit 2'] },
    { goi: `await (async () => { const p = mkPrisma(); const a = await list(p, { limit: 2, authorId: 1 }); const b = await list(p, { limit: 2, authorId: 1, cursor: a.nextCursor }); const c = await list(p, { limit: 2, authorId: 1, cursor: b.nextCursor }); return [a.items.map((n) => n.id), b.items.map((n) => n.id), c.items.map((n) => n.id), c.nextCursor]; })()`, moTa: ['Walk all pages of author 1', 'Đi hết các trang của tác giả 1'] },
    { goi: `await (async () => { const p = mkPrisma(8); const r = await list(p, { limit: 4, authorId: 2 }); return [r.items.map((n) => n.id), r.nextCursor]; })()`, an: true, moTa: ['Exactly 4 rows ⇒ nextCursor null', 'Đúng 4 dòng ⇒ nextCursor null'] },
    { goi: `await (async () => { const p = mkPrisma(200, 1); const r = await list(p, { limit: 1000, authorId: 1 }); return [r.items.length, r.nextCursor, p.log.map((l) => (typeof l === 'string' ? l : l.take))]; })()`, an: true },
    { goi: `await (async () => { const p = mkPrisma(); const r = await list(p, { authorId: 3 }); return [r, p.log]; })()`, an: true },
  ],
  saiMau: [
    list.toString().replace('return { items, nextCursor: hasMore ? items.at(-1).id : null };', 'const extra = hasMore; return { items, nextCursor: extra ? items.at(-1).id + 1 : null };').replace('if (hasMore) items.pop();', 'if (hasMore) items.pop();'),
    list.toString().replace(/\n\s*omit: \{ body: true \},[^\n]*/, ''),
  ],
});

/* ── 3. P2002 → 409 ── */
async function createNote(prisma, data) {
  try {
    return await prisma.note.create({ data });
  } catch (err) {
    if (err.code === 'P2002') {
      const c = err.meta?.driverAdapterError?.cause?.constraint;
      const what = c?.fields?.join(', ') ?? c?.index ?? 'value';   // PostgreSQL may give only the index name
      throw new AppError(409, 'DUPLICATE', `${what} already exists`);
    }
    throw err;                                                     // not ours to translate
  }
}
const FAKE_DUP = `class PrismaClientKnownRequestError extends Error { constructor(code, message, meta) { super(message); this.name = 'PrismaClientKnownRequestError'; this.code = code; this.meta = meta; } }
const failWith = (err) => ({ note: { create: () => new Promise((_, no) => setTimeout(() => no(err), 2)) } });
const okPrisma = { note: { create: ({ data }) => Promise.resolve({ id: 1251006, ...data }) } };
const P2002 = (cause) => new PrismaClientKnownRequestError('P2002', 'Unique constraint failed', cause === undefined ? undefined : { modelName: 'Note', driverAdapterError: { cause } });
const caught = async (p) => { try { return await p; } catch (e) { return { thrown: e.name, status: e.status, code: e.code, message: e.message }; } };`;
const E3 = jsBai({
  ten: '7.6 · 3 — Write createNote(): unique violations become 409, read from Prisma 7’s real meta', kho: 'MEDIUM', phut: 15,
  en: `<p>Two requests race to create the same slug; the unique index referees and Prisma throws <code>P2002</code>. Translate it once, in the service. <code>AppError</code> is in <code>helpers.js</code>. Write <code>async createNote(prisma, data)</code>:</p>
<ul><li>Return <code>await prisma.note.create({ data })</code>.</li>
<li>On an error with <code>code === 'P2002'</code> throw <code>new AppError(409, 'DUPLICATE', what + ' already exists')</code>, where <code>c = err.meta?.driverAdapterError?.cause?.constraint</code> and <code>what</code> = <code>c.fields</code> joined with <code>", "</code>, else <code>c.index</code>, else <code>"value"</code>.</li>
<li>Re-throw every other error unchanged.</li></ul>
<p>The real shapes (re-run on Prisma 7.10.1): <code>constraint: { fields: ["slug"] }</code> on one run, <code>constraint: { index: "Note_slug_key" }</code> on another — and the old <code>err.meta.target</code> is <code>undefined</code>.</p>`,
  vi: `<p>Hai request đua nhau tạo cùng slug; chỉ mục unique làm trọng tài và Prisma ném <code>P2002</code>. Dịch nó một lần, ở service. <code>AppError</code> có trong <code>helpers.js</code>. Viết <code>async createNote(prisma, data)</code>:</p>
<ul><li>Trả <code>await prisma.note.create({ data })</code>.</li>
<li>Lỗi có <code>code === 'P2002'</code> ⇒ ném <code>new AppError(409, 'DUPLICATE', what + ' already exists')</code>, với <code>c = err.meta?.driverAdapterError?.cause?.constraint</code> và <code>what</code> = <code>c.fields</code> nối bằng <code>", "</code>, không có thì <code>c.index</code>, không nữa thì <code>"value"</code>.</li>
<li>Ném lại mọi lỗi khác nguyên vẹn.</li></ul>
<p>Hình dạng thật (chạy lại trên Prisma 7.10.1): lần thì <code>constraint: { fields: ["slug"] }</code>, lần thì <code>constraint: { index: "Note_slug_key" }</code> — còn <code>err.meta.target</code> cũ là <code>undefined</code>.</p>`,
  yc: [['Optional chaining all the way down — meta may be missing.', 'Dùng optional chaining suốt đường — meta có thể không có.'], ['409, never 500, for a duplicate.', '409, không bao giờ 500, cho bản trùng.']],
  goiY: [['<code>const c = err.meta?.driverAdapterError?.cause?.constraint;</code>', '<code>const c = err.meta?.driverAdapterError?.cause?.constraint;</code>'], ['<code>c?.fields?.join(", ") ?? c?.index ?? "value"</code> — each <code>??</code> is one fallback.', '<code>c?.fields?.join(", ") ?? c?.index ?? "value"</code> — mỗi <code>??</code> là một lớp dự phòng.']],
  loi: [['<code>err.meta.target.join(", ")</code> from an older tutorial — a TypeError inside the catch, so the client gets a 500.', '<code>err.meta.target.join(", ")</code> từ hướng dẫn cũ — TypeError ngay trong catch, client nhận 500.'], ['Reading only <code>fields</code>: on the run that gave only the index name, the message was " already exists".', 'Chỉ đọc <code>fields</code>: ở lần chỉ có tên chỉ mục, thông điệp là " already exists".'], ['A findUnique before the create to “avoid” the error — the race the unique index exists to referee.', 'findUnique trước create để "tránh" lỗi — đúng cuộc đua mà chỉ mục unique sinh ra để phân xử.']],
  gt: ['The database is the only place that can decide uniqueness correctly under concurrency, and P2002 is how it tells you. Status code from chapter 6 (409: the data is fine, the world disagrees), source of truth from chapter 7 — and defensive reading of meta, because its shape changed between Prisma versions and may change again.', 'CSDL là nơi duy nhất quyết định tính duy nhất đúng khi chạy đồng thời, và P2002 là cách nó báo bạn. Mã trạng thái từ chương 6 (409: dữ liệu ổn, thế giới không đồng ý), nguồn sự thật từ chương 7 — và đọc meta một cách phòng thủ, vì hình dạng của nó đã đổi giữa các phiên bản Prisma và có thể đổi nữa.'],
  kn: ['error handling', 'unique constraint'],
  tns: [tn('optional chaining', 'chuỗi tuỳ chọn', 'a?.b?.c'), tn('nullish coalescing', '??', 'Giá trị dự phòng khi null/undefined.')],
  tro: `// provided — the AppError of lesson 5.4\n${APP_ERROR}\n`,
  dau: `async function createNote(prisma, data) {
  // Write your solution here
  try {
    return await prisma.note.create({ data });
  } catch (err) {
    if (err.code === 'P2002') throw new AppError(409, 'DUPLICATE', err.meta.target.join(', ') + ' already exists');
    throw err;
  }
}
`,
  giai: createNote,
  chung: FAKE_DUP,
  cases: [
    { goi: `await caught(createNote(failWith(P2002({ originalCode: '23505', constraint: { fields: ['slug'] } })), { slug: 'bulk-1' }))`, moTa: ['constraint.fields form', 'Dạng constraint.fields'] },
    { goi: `await caught(createNote(failWith(P2002({ originalCode: '23505', constraint: { index: 'Note_slug_key' } })), { slug: 'bulk-1' }))`, moTa: ['Prisma 7.10.1: index name only', 'Prisma 7.10.1: chỉ có tên chỉ mục'] },
    { goi: `await createNote(okPrisma, { slug: 'fresh', title: 'x' })`, moTa: ['No conflict ⇒ the note', 'Không xung đột ⇒ ghi chú'] },
    { goi: `[await caught(createNote(failWith(P2002(undefined)), {})), await caught(createNote(failWith(P2002({ constraint: { fields: ['email', 'tenantId'] } })), {}))]`, an: true },
    { goi: `await caught(createNote(failWith(new PrismaClientKnownRequestError('P2000', 'value too long', { column_name: 'title' })), {}))`, an: true },
    { goi: `await caught(createNote(failWith(Object.assign(new PrismaClientKnownRequestError('P2002', 'old'), { meta: { target: ['slug'] } })), {}))`, an: true, moTa: ['Only the old meta.target ⇒ fallback "value"', 'Chỉ có meta.target cũ ⇒ dự phòng "value"'] },
  ],
  saiMau: [
    createNote.toString().replace("c?.fields?.join(', ') ?? c?.index ?? 'value'", "c?.fields?.join(', ') ?? 'value'"),
  ],
});

/* ── 4. Cột version + updateMany ── */
async function updateNote(prisma, id, clientVersion, patch) {
  const { id: _i, version: _v, authorId: _a, ...safe } = patch;   // the client never sets these
  const updated = await prisma.note.updateMany({
    where: { id, version: clientVersion },                     // only if nothing changed since the client loaded it
    data: { ...safe, version: { increment: 1 } },
  });
  if (updated.count === 0) {
    // zero rows: either the note is gone, or someone else won the race
    const exists = await prisma.note.findUnique({ where: { id } });
    if (!exists) throw new AppError(404, 'NOTE_NOT_FOUND', 'Note ' + id + ' does not exist');
    throw new AppError(409, 'STALE_VERSION', 'Someone else edited this note. Reload and try again.');
  }
  return prisma.note.findUnique({ where: { id } });
}
const FAKE_VER = `const mkPrisma = () => { const rows = new Map([[1251006, { id: 1251006, title: 'Ghi chú', body: 'gốc', authorId: 1, version: 1 }]]); const log = [];
  const wait = (v) => new Promise((ok) => setTimeout(() => ok(v), 1));
  return { log, rows, note: {
    updateMany: ({ where, data }) => { log.push('updateMany ' + JSON.stringify(where)); let count = 0;
      for (const r of rows.values()) { if (Object.keys(where).every((k) => r[k] === where[k])) { for (const [k, v] of Object.entries(data)) r[k] = v && typeof v === 'object' && 'increment' in v ? r[k] + v.increment : v; count++; } }
      return wait({ count }); },
    findUnique: ({ where }) => { log.push('findUnique ' + where.id); return wait(rows.has(where.id) ? { ...rows.get(where.id) } : null); },
    update: () => { throw new Error('use updateMany: update only accepts a unique key in where'); },
  } }; };
const caught = async (p) => { try { return await p; } catch (e) { return { thrown: e.name, status: e.status, code: e.code }; } };`;
const E4 = jsBai({
  ten: '7.6 · 4 — Write updateNote(): the version column that stops the lost update', kho: 'MEDIUM', phut: 15,
  en: `<p>Chapter 6’s lost update, fixed in the database with one integer column and one where clause. Write <code>async updateNote(prisma, id, clientVersion, patch)</code>:</p>
<ul><li>Drop <code>id</code>, <code>version</code> and <code>authorId</code> from <code>patch</code>.</li>
<li><code>prisma.note.updateMany({ where: { id, version: clientVersion }, data: { ...patch, version: { increment: 1 } } })</code>.</li>
<li><code>count === 0</code> ⇒ look the note up with <code>findUnique({ where: { id } })</code>: missing ⇒ throw <code>AppError(404, 'NOTE_NOT_FOUND', …)</code>; present ⇒ throw <code>AppError(409, 'STALE_VERSION', 'Someone else edited this note. Reload and try again.')</code>.</li>
<li>Otherwise return the fresh note from <code>findUnique</code>.</li></ul>
<p>The lesson’s run: both A and B loaded version 1; A ⇒ 1 row updated; B ⇒ 0 rows ⇒ 409; final body “A sửa”, version 2. The fake’s <code>update</code> throws, like the real one would refuse a non-unique where.</p>`,
  vi: `<p>Mất cập nhật của chương 6, sửa trong CSDL bằng một cột số nguyên và một điều kiện where. Viết <code>async updateNote(prisma, id, clientVersion, patch)</code>:</p>
<ul><li>Bỏ <code>id</code>, <code>version</code> và <code>authorId</code> khỏi <code>patch</code>.</li>
<li><code>prisma.note.updateMany({ where: { id, version: clientVersion }, data: { ...patch, version: { increment: 1 } } })</code>.</li>
<li><code>count === 0</code> ⇒ tra ghi chú bằng <code>findUnique({ where: { id } })</code>: không có ⇒ ném <code>AppError(404, 'NOTE_NOT_FOUND', …)</code>; có ⇒ ném <code>AppError(409, 'STALE_VERSION', 'Someone else edited this note. Reload and try again.')</code>.</li>
<li>Còn lại trả ghi chú mới từ <code>findUnique</code>.</li></ul>
<p>Lần chạy của bài: A và B cùng tải version 1; A ⇒ 1 dòng được cập nhật; B ⇒ 0 dòng ⇒ 409; body cuối là "A sửa", version 2. <code>update</code> của hàm giả ném lỗi, như bản thật sẽ từ chối where không duy nhất.</p>`,
  yc: [['The version check happens inside the UPDATE — never read-then-write.', 'Phép kiểm version nằm trong chính câu UPDATE — không đọc rồi mới ghi.'], ['Distinguish 404 from 409 only after count is 0.', 'Chỉ phân biệt 404 và 409 sau khi count là 0.']],
  goiY: [['<code>const { id: _i, version: _v, authorId: _a, ...safe } = patch;</code>', '<code>const { id: _i, version: _v, authorId: _a, ...safe } = patch;</code>'], ['<code>data: { ...safe, version: { increment: 1 } }</code> — Prisma’s atomic increment.', '<code>data: { ...safe, version: { increment: 1 } }</code> — phép tăng nguyên tử của Prisma.']],
  loi: [['findUnique, compare versions in JavaScript, then update: two requests both see version 1 between the read and the write.', 'findUnique, so version trong JavaScript, rồi update: hai request đều thấy version 1 giữa lần đọc và lần ghi.'], ['Spreading the raw patch: a client sends <code>version: 99</code> and wins every race.', 'Rải nguyên patch: client gửi <code>version: 99</code> và thắng mọi cuộc đua.'], ['Answering 409 for a deleted note — the client reloads and gets a 404 anyway; tell it now.', 'Trả 409 cho ghi chú đã bị xoá — client tải lại rồi cũng nhận 404; hãy nói ngay.']],
  gt: ['UPDATE … WHERE id = $1 AND version = $2 makes the check and the write one atomic statement, so there is no window between them. Zero rows affected means someone beat you to it; the loser is told and nobody is blocked — optimistic concurrency, the server-side twin of ETag + If-Match.', 'UPDATE … WHERE id = $1 AND version = $2 biến phép kiểm và lần ghi thành một câu nguyên tử, nên không có khe hở giữa chúng. 0 dòng bị ảnh hưởng nghĩa là có người nhanh hơn bạn; người thua được báo và không ai bị chặn — đồng thời lạc quan, bản song sinh phía server của ETag + If-Match.'],
  kn: ['optimistic concurrency', 'Prisma'],
  tns: [tn('version column', 'cột phiên bản'), tn('atomic', 'nguyên tử', 'Không thể bị xen giữa.')],
  tro: `// provided — the AppError of lesson 5.4\n${APP_ERROR}\n`,
  dau: `async function updateNote(prisma, id, clientVersion, patch) {
  // Write your solution here
  const note = await prisma.note.findUnique({ where: { id } });
  if (!note) throw new AppError(404, 'NOTE_NOT_FOUND', 'Note ' + id + ' does not exist');
  await prisma.note.updateMany({ where: { id }, data: { ...patch, version: note.version + 1 } });
  return prisma.note.findUnique({ where: { id } });
}
`,
  giai: updateNote,
  chung: FAKE_VER,
  cases: [
    { goi: `await (async () => { const p = mkPrisma(); const a = await caught(updateNote(p, 1251006, 1, { body: 'A sửa' })); const b = await caught(updateNote(p, 1251006, 1, { body: 'B sửa' })); return { a, b, final: p.rows.get(1251006) }; })()`, moTa: ['A then B with version 1 ⇒ 200, 409, A survives', 'A rồi B với version 1 ⇒ 200, 409, bản của A còn'] },
    { goi: `await (async () => { const p = mkPrisma(); return caught(updateNote(p, 42, 1, { body: 'x' })); })()`, moTa: ['Unknown id ⇒ 404', 'Id lạ ⇒ 404'] },
    { goi: `await (async () => { const p = mkPrisma(); const a = await updateNote(p, 1251006, 1, { title: 'v2' }); const b = await updateNote(p, 1251006, a.version, { title: 'v3' }); return [a.version, b.version, b.title]; })()`, an: true },
    { goi: `await (async () => { const p = mkPrisma(); const r = await caught(updateNote(p, 1251006, 1, { body: 'x', version: 99, authorId: 2, id: 7 })); return [r, p.rows.get(1251006)]; })()`, an: true },
    { goi: `await (async () => { const p = mkPrisma(); await Promise.all([caught(updateNote(p, 1251006, 1, { body: 'A' })), caught(updateNote(p, 1251006, 1, { body: 'B' }))]); return p.rows.get(1251006); })()`, an: true, moTa: ['Two at the same instant: exactly one wins', 'Hai cái cùng lúc: đúng một cái thắng'] },
  ],
});

/* ── 5. Tagged template sql`…`: giá trị thành tham số ── */
function sql(strings, ...values) {
  // the template's TEXT parts are trusted SQL written by you; every ${value} becomes a bound parameter
  const parts = [];
  const params = [];
  strings.forEach((s, i) => {
    parts.push(s);
    if (i >= values.length) return;
    const v = values[i];
    if (v && v.__sql) {
      // a nested fragment: inline its text, renumbering its placeholders after ours
      parts.push(v.text.replace(/\$(\d+)/g, (_, n) => '$' + (params.length + Number(n))));
      params.push(...v.values);
    } else if (Array.isArray(v)) {
      // a list for IN (…): one placeholder per element
      parts.push('(' + v.map((x) => { params.push(x); return '$' + params.length; }).join(', ') + ')');
    } else {
      params.push(v);
      parts.push('$' + params.length);
    }
  });
  return { __sql: true, text: parts.join(''), values: params };
}
const E5 = jsBai({
  ten: '7.6 · 5 — Write the sql`…` tag: values travel as parameters, never as SQL text', kho: 'HARD', phut: 25,
  en: `<p><code>$queryRaw</code> as a tagged template is safe “because Prisma turns every <code>\${…}</code> into a bound parameter”. Build that tag. <code>sql(strings, ...values)</code> is called as <code>sql\`SELECT … WHERE slug = \${evil}\`</code> and returns <code>{ __sql: true, text, values }</code>:</p>
<ul><li>The literal parts are copied as they are; each interpolated value is replaced by <code>$1</code>, <code>$2</code>, … in order and pushed to <code>values</code>.</li>
<li>An <b>array</b> value becomes <code>($n, $n+1, …)</code> — one placeholder per element — for <code>IN \${ids}</code>.</li>
<li>A <b>nested fragment</b> (a value that is itself a result of <code>sql\`…\`</code>, recognisable by <code>__sql: true</code>) is inlined as SQL text, with its own placeholders renumbered to follow the ones already used, and its values appended.</li></ul>
<p>The lesson’s attacker string <code>bulk-1' OR '1'='1</code> must end up in <code>values</code>, and the <code>text</code> must contain no quote you did not write.</p>`,
  vi: `<p><code>$queryRaw</code> dạng tagged template an toàn "vì Prisma biến mọi <code>\${…}</code> thành tham số ràng buộc". Hãy dựng thẻ đó. <code>sql(strings, ...values)</code> được gọi kiểu <code>sql\`SELECT … WHERE slug = \${evil}\`</code> và trả <code>{ __sql: true, text, values }</code>:</p>
<ul><li>Phần chữ cố định chép nguyên; mỗi giá trị chèn vào được thay bằng <code>$1</code>, <code>$2</code>, … theo thứ tự và đẩy vào <code>values</code>.</li>
<li>Giá trị là <b>mảng</b> thành <code>($n, $n+1, …)</code> — mỗi phần tử một placeholder — cho <code>IN \${ids}</code>.</li>
<li><b>Mảnh lồng</b> (giá trị chính là kết quả của <code>sql\`…\`</code>, nhận ra nhờ <code>__sql: true</code>) được chèn như chữ SQL, các placeholder của nó đánh số lại nối tiếp những cái đã dùng, và values của nó nối vào sau.</li></ul>
<p>Chuỗi tấn công của bài <code>bulk-1' OR '1'='1</code> phải nằm trong <code>values</code>, và <code>text</code> không được chứa dấu nháy nào bạn không tự viết.</p>`,
  yc: [['Never put a value into <code>text</code>.', 'Không bao giờ đưa giá trị vào <code>text</code>.'], ['Placeholders are numbered from 1 across the whole query, nested parts included.', 'Placeholder đánh số từ 1 trên cả câu, kể cả phần lồng.']],
  goiY: [['A tag function gets <code>strings</code> (one more than values) and the values: interleave <code>strings[i]</code>, then the placeholder for <code>values[i]</code>.', 'Hàm thẻ nhận <code>strings</code> (nhiều hơn values một phần tử) và các giá trị: xen kẽ <code>strings[i]</code>, rồi placeholder cho <code>values[i]</code>.'], ['Renumber a nested fragment with <code>text.replace(/\\$(\\d+)/g, (_, n) => "$" + (params.length + Number(n)))</code> BEFORE pushing its values.', 'Đánh số lại mảnh lồng bằng <code>text.replace(/\\$(\\d+)/g, (_, n) => "$" + (params.length + Number(n)))</code> TRƯỚC khi đẩy values của nó.']],
  loi: [['Escaping quotes (<code>replace(/\'/g, "\'\'")</code>) and concatenating: it works until an encoding, a backslash or a number column proves otherwise. Parameters are not escaping; the value never enters the SQL parser.', 'Thoát dấu nháy (<code>replace(/\'/g, "\'\'")</code>) rồi nối chuỗi: chạy được cho tới khi một kiểu mã hoá, một dấu gạch chéo hay một cột số chứng minh điều ngược lại. Tham số không phải thoát ký tự; giá trị không bao giờ vào bộ phân tích SQL.'], ['Joining an array into one value (<code>"1,2,3"</code>) for IN — PostgreSQL compares the id with the string "1,2,3".', 'Nối mảng thành một giá trị (<code>"1,2,3"</code>) cho IN — PostgreSQL so id với chuỗi "1,2,3".'], ['Renumbering after pushing the nested values, so every placeholder is off by the nested count.', 'Đánh số lại sau khi đã đẩy values lồng, nên mọi placeholder lệch đúng số lượng lồng.']],
  gt: ['A tagged template receives the literal pieces and the values SEPARATELY — that separation is the whole security property. Text you typed in the source becomes SQL; anything that came from a variable becomes a $n placeholder whose value is sent to PostgreSQL on its own, so a quote inside it is just a character. That is why $queryRaw returned 0 rows and $queryRawUnsafe returned the whole table.', 'Tagged template nhận phần chữ cố định và các giá trị RIÊNG BIỆT — sự tách biệt đó chính là toàn bộ tính chất an ninh. Chữ bạn gõ trong mã nguồn thành SQL; thứ gì đến từ biến thành placeholder $n mà giá trị được gửi riêng tới PostgreSQL, nên dấu nháy bên trong chỉ là một ký tự. Vì thế $queryRaw trả 0 dòng còn $queryRawUnsafe trả cả bảng.'],
  kn: ['SQL injection', 'tagged templates'],
  tns: [tn('tagged template', 'template có thẻ', 'tag`…` — hàm nhận chữ và giá trị riêng.'), tn('placeholder', 'chỗ giữ', '$1, $2…')],
  dau: `function sql(strings, ...values) {
  // Write your solution here
  let text = '';
  strings.forEach((s, i) => { text += s + (i < values.length ? "'" + values[i] + "'" : ''); });
  return { __sql: true, text, values: [] };
}
`,
  giai: sql,
  cases: [
    { goi: `(() => { const evil = "bulk-1' OR '1'='1"; return sql\`SELECT count(*)::int AS n FROM "Note" WHERE slug = \${evil}\`; })()`, moTa: ['The lesson’s attacker string stays a value', 'Chuỗi tấn công của bài vẫn là giá trị'] },
    { goi: `sql\`SELECT id FROM "Note" WHERE "authorId" = \${7} AND id IN \${[3, 5, 8]} AND pinned = \${true}\``, moTa: ['A list for IN', 'Danh sách cho IN'] },
    { goi: `(() => { const byAuthor = sql\`"authorId" = \${2} AND title ILIKE \${'%prisma%'}\`; return sql\`SELECT id FROM "Note" WHERE id > \${10} AND \${byAuthor} ORDER BY id LIMIT \${20}\`; })()`, an: true, moTa: ['A nested fragment is renumbered', 'Mảnh lồng được đánh số lại'] },
    { goi: `[sql\`SELECT 1\`, sql\`SELECT \${null}::text, \${''}\`]`, an: true },
    { goi: `(() => { const inner = sql\`id IN \${[1, 2]}\`; const mid = sql\`(\${inner} OR slug = \${"x'y"})\`; return sql\`SELECT \${'a'} WHERE \${mid} AND \${mid}\`; })()`, an: true },
  ],
  saiMau: [
    sql.toString().replace("parts.push(v.text.replace(/\\$(\\d+)/g, (_, n) => '$' + (params.length + Number(n))));\n      params.push(...v.values);", "params.push(...v.values);\n      parts.push(v.text.replace(/\\$(\\d+)/g, (_, n) => '$' + (params.length + Number(n))));"),
  ],
});

/* ── 6. Keyset (createdAt, id) bằng SQL ── */
const E6 = sqlBai({
  ten: '7.6 · 6 — The next page after (createdAt, id) in SQL, ties included', kho: 'MEDIUM', phut: 12,
  en: `<p>“Ordering by createdAt alone breaks with ties. Order by [createdAt desc, id desc] and make the cursor carry both values.” The client is on a newest-first feed and sent back the cursor of the last note it saw: <code>createdAt = '2026-07-28 09:00'</code>, <code>id = 6</code>. Note 5 has the <b>same</b> <code>createdAt</code>.</p>
<p>Write the next page: <code>id, title, "createdAt"</code> of the <b>3</b> notes that come right after that cursor, newest first (<code>"createdAt" DESC, id DESC</code>), using a <b>row-value comparison</b> <code>("createdAt", id) &lt; (…, …)</code>.</p>`,
  vi: `<p>"Sắp chỉ theo createdAt hỏng khi có hoà. Sắp theo [createdAt desc, id desc] và cho cursor mang cả hai giá trị." Client đang ở bảng tin mới nhất trước và gửi lại cursor của ghi chú cuối nó đã thấy: <code>createdAt = '2026-07-28 09:00'</code>, <code>id = 6</code>. Ghi chú 5 có <b>cùng</b> <code>createdAt</code>.</p>
<p>Viết trang sau: <code>id, title, "createdAt"</code> của <b>3</b> ghi chú đứng ngay sau cursor đó, mới nhất trước (<code>"createdAt" DESC, id DESC</code>), dùng <b>so sánh bộ giá trị</b> <code>("createdAt", id) &lt; (…, …)</code>.</p>`,
  yc: [['One SELECT with ORDER BY "createdAt" DESC, id DESC LIMIT 3.', 'Một câu SELECT với ORDER BY "createdAt" DESC, id DESC LIMIT 3.'], ['The cursor condition compares both columns together.', 'Điều kiện cursor so cả hai cột cùng lúc.']],
  giai: `-- WHERE (created_at, id) < ($1, $2) — both columns compared as one value, exactly the order of the ORDER BY
SELECT id, title, "createdAt"
FROM "Note"
WHERE ("createdAt", id) < (timestamp '2026-07-28 09:00', 6)
ORDER BY "createdAt" DESC, id DESC
LIMIT 3;
`,
  kiem: [
    kq(['The 3 notes after the cursor', '3 ghi chú sau cursor'], { thuTu: true }),
    kqAn(['Hidden: another note at 08:00 with a high id must appear', 'Ẩn: một ghi chú lúc 08:00 với id lớn phải xuất hiện'], `INSERT INTO "Note" (title, slug, "authorId", "createdAt", "updatedAt") VALUES ('Late insert', 'late-1', 2, '2026-07-28 08:00', now());`, { thuTu: true }),
    kqAn(['Hidden: more notes share 09:00 — only lower ids come after the cursor', 'Ẩn: thêm ghi chú cùng 09:00 — chỉ id nhỏ hơn mới đứng sau cursor'], `INSERT INTO "Note" (title, slug, "authorId", "createdAt", "updatedAt") VALUES ('Same time', 'same-1', 3, '2026-07-28 09:00', now()); UPDATE "Note" SET "createdAt" = '2026-07-28 09:00' WHERE id = 4;`, { thuTu: true }),
  ],
  sai: [
    `SELECT id, title, "createdAt" FROM "Note" WHERE "createdAt" < '2026-07-28 09:00' ORDER BY "createdAt" DESC, id DESC LIMIT 3;`,
    `SELECT id, title, "createdAt" FROM "Note" WHERE "createdAt" <= '2026-07-28 09:00' AND id < 6 ORDER BY "createdAt" DESC, id DESC LIMIT 3;`,
    `SELECT id, title, "createdAt" FROM "Note" WHERE ("createdAt", id) < ('2026-07-28 09:00', 6) ORDER BY "createdAt" DESC LIMIT 3;`,
  ],
  goiY: [['PostgreSQL compares row values left to right: <code>(a, b) &lt; (x, y)</code> means <code>a &lt; x OR (a = x AND b &lt; y)</code>.', 'PostgreSQL so bộ giá trị từ trái sang phải: <code>(a, b) &lt; (x, y)</code> nghĩa là <code>a &lt; x OR (a = x AND b &lt; y)</code>.'], ['Write the timestamp as <code>timestamp \'2026-07-28 09:00\'</code> (or just the string).', 'Viết thời điểm là <code>timestamp \'2026-07-28 09:00\'</code> (hoặc chỉ chuỗi).']],
  loi: [['<code>WHERE "createdAt" &lt; cursor</code>: note 5 shares the timestamp and is skipped forever.', '<code>WHERE "createdAt" &lt; cursor</code>: ghi chú 5 cùng thời điểm và bị bỏ qua mãi.'], ['<code>"createdAt" &lt;= x AND id &lt; y</code>: looks right, but drops any older note whose id is larger — an import or a back-dated note.', '<code>"createdAt" &lt;= x AND id &lt; y</code>: trông đúng, nhưng bỏ mọi ghi chú cũ hơn có id lớn hơn — một lần nhập dữ liệu hay ghi chú lùi ngày.'], ['ORDER BY without the id tie-breaker: the order of tied rows is undefined, so the cursor is meaningless.', 'ORDER BY thiếu cột phá hoà id: thứ tự các dòng hoà không xác định, nên cursor vô nghĩa.']],
  gt: ['The row-value comparison is exactly the ordering of ORDER BY "createdAt" DESC, id DESC, turned into a condition: “strictly after this pair”. It also matches a composite index on ("createdAt", id), so PostgreSQL can start the scan at the cursor instead of filtering — the property that makes keyset pages cost the same at any depth.', 'So sánh bộ giá trị chính là thứ tự của ORDER BY "createdAt" DESC, id DESC, đổi thành điều kiện: "ngay sau cặp này". Nó còn khớp chỉ mục ghép trên ("createdAt", id), nên PostgreSQL bắt đầu quét ngay tại cursor thay vì lọc — tính chất làm trang keyset tốn như nhau ở mọi độ sâu.'],
  tns: [tn('row value', 'bộ giá trị', '(a, b) so như một khối.'), tn('keyset pagination', 'phân trang theo khoá')],
  kn: ['SQL', 'cursor pagination'],
});

export default modul('nodejs-7-6-hop-dong-api-voi-du-lieu-that', '7.6 Keeping the chapter-6 contract with a real database', [E1, E2, E3, E4, E5, E6]);
