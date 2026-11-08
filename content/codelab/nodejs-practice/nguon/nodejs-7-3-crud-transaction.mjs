/** Node.js 7.3 — CRUD qua Prisma, null hay ngoại lệ (P2025), $transaction mảng cho trang + tổng, $transaction callback dùng tx, giữ transaction ngắn (P2028), upsert một lượt. */
import { modul, cs, q, tn, jsBai, sqlBai, sau } from './_node-c6-8.mjs';

/* ── 1. Trắc nghiệm ── */
const E1 = cs({
  ten: '7.3 · 1 — CRUD calls and the two kinds of transaction', kho: 'EASY', phut: 8,
  en: 'Lesson 7.3 swaps the Notes API onto PostgreSQL and reports the honest cost. Six questions on the Prisma calls it uses and on what a transaction does and does not promise.',
  vi: 'Bài 7.3 đổi ruột Notes API sang PostgreSQL và báo đúng cái giá. Sáu câu hỏi về các lời gọi Prisma bài dùng và về những gì transaction hứa và không hứa.',
  cau: [
    q('c1', ['<code>prisma.note.update({ where: { id: 999 }, data })</code> and there is no row 999. What happens?', '<code>prisma.note.update({ where: { id: 999 }, data })</code> mà không có dòng 999. Chuyện gì xảy ra?'],
      ['It throws a known request error, P2025', 'It returns null, like findUnique does', 'It resolves to an object { count: 0 }', 'It inserts a new row with id 999'],
      ['findUnique returns null; update and delete throw P2025. The service translates that one code and lets every other error reach the error handler.', 'findUnique trả null; update và delete ném P2025. Service dịch đúng mã đó và để mọi lỗi khác tới bộ xử lý lỗi.']),
    q('c2', ['Why does <code>list()</code> fetch the page and the total with <code>prisma.$transaction([findMany(…), count(…)])</code>?', 'Vì sao <code>list()</code> lấy trang và tổng bằng <code>prisma.$transaction([findMany(…), count(…)])</code>?'],
      ['Both queries run in one transaction, so the count describes the same instant as the page', 'count() cannot run outside a transaction', 'It is faster because the two queries run in parallel on two connections', 'Prisma requires it for any query with skip'],
      ['Otherwise you show total: 41 next to 40 visible items forever.', 'Không thì bạn hiện total: 41 cạnh 40 ghi chú nhìn thấy mãi mãi.']),
    q('c3', ['Inside <code>prisma.$transaction(async (tx) =&gt; { … })</code> one line uses <code>prisma.tag.create(…)</code> instead of <code>tx.tag.create(…)</code>. What happens on a later error?', 'Trong <code>prisma.$transaction(async (tx) =&gt; { … })</code> có một dòng dùng <code>prisma.tag.create(…)</code> thay vì <code>tx.tag.create(…)</code>. Khi có lỗi phía sau thì sao?'],
      ['That query committed on its own connection and is NOT rolled back — silently', 'Prisma throws “wrong client inside transaction” immediately', 'It is rolled back with the others, prisma and tx are the same object', 'The whole process crashes'],
      ['No error, no warning. Grep for prisma. inside $transaction callbacks — one of the highest-value greps you can run.', 'Không lỗi, không cảnh báo. Hãy grep prisma. bên trong callback $transaction — một trong những lệnh grep đáng giá nhất.']),
    q('c4', ['A transaction calls a slow third-party API in the middle and dies after 6.1 s with P2028. What is the right fix?', 'Một transaction gọi API bên thứ ba chậm ở giữa và chết sau 6,1 s với P2028. Cách sửa đúng là gì?'],
      ['Do the HTTP call first, then open the transaction around the writes only', 'Raise timeout to 15000 and move on', 'Use $transaction([…]) instead, which has no timeout', 'Retry the transaction until it fits in 5 s'],
      ['An open transaction holds a pool slot, a backend and its locks the whole time; ten of them drain a pool of ten and the incident looks like “the database is down” while it is idle.', 'Transaction đang mở giữ một chỗ trong pool, một backend và các khoá suốt thời gian đó; mười cái làm cạn pool mười và sự cố trông như "CSDL chết" trong khi nó rảnh.']),
    q('c5', ['Two requests read the same row under Read Committed, each computes a new value from it, each writes. Does wrapping each in a transaction prevent the lost write?', 'Hai request đọc cùng một dòng dưới Read Committed, mỗi cái tính giá trị mới từ nó, mỗi cái ghi. Bọc mỗi cái trong transaction có ngăn mất ghi không?'],
      ['No — atomicity is not serialisation; the second silently wins (lesson 7.6 uses a version check)', 'Yes — transactions always run one after the other', 'Yes, but only if both use the same tx object', 'No, because PostgreSQL does not support transactions on UPDATE'],
      ['“It does not order concurrent work.” All-or-nothing is a different promise.', '"Nó không sắp thứ tự việc chạy đồng thời." Tất-cả-hoặc-không là một lời hứa khác.']),
    q('c6', ['Seeding 1000 notes: createMany took 175 ms. Why can a loop of 1000 awaited create() calls not come close?', 'Nạp 1000 ghi chú: createMany mất 175 ms. Vì sao vòng lặp 1000 lần await create() không thể sánh?'],
      ['createMany is one INSERT with a thousand tuples; the loop is a thousand round trips', 'create() validates each row twice', 'createMany skips the unique constraints', 'The loop runs in a transaction that locks the table'],
      ['Lesson 7.4 measures exactly what round trips cost.', 'Bài 7.4 đo đúng cái giá của các lượt đi-về.']),
  ],
  goiY: [['For each call, ask: does it return null, a count, or throw?', 'Với mỗi lời gọi, hỏi: nó trả null, trả số đếm, hay ném lỗi?'], ['A transaction is all-or-nothing and holds resources while open — nothing more.', 'Transaction là tất-cả-hoặc-không và giữ tài nguyên khi đang mở — không hơn.']],
  loi: [['Catching every exception in the service and returning null — a dead database becomes a tidy 404.', 'Bắt mọi ngoại lệ trong service và trả null — CSDL chết thành một 404 gọn gàng.'], ['Raising the transaction timeout instead of moving the slow call out.', 'Tăng thời gian chờ transaction thay vì đưa lời gọi chậm ra ngoài.']],
  tns: [tn('P2025', 'P2025', 'Prisma: không có dòng để update/delete.'), tn('interactive transaction', 'transaction tương tác', '$transaction(async tx => …).'), tn('batch transaction', 'transaction theo lô', '$transaction([a, b]).')],
  kn: ['Prisma', 'transactions'],
});

/* bộ GIẢ kiểu Prisma (lỗi có code như PrismaClientKnownRequestError) */
const PRISMA_ERR = `class PrismaClientKnownRequestError extends Error { constructor(code, message) { super(message); this.name = 'PrismaClientKnownRequestError'; this.code = code; } }`;

/* ── 2. update / remove: dịch đúng một lỗi ── */
async function update(prisma, id, patch) {
  try {
    return await prisma.note.update({ where: { id }, data: patch });
  } catch (err) {
    if (err.code === 'P2025') return null;   // no row to update -> the route answers 404
    throw err;                               // anything else is a real fault: let the error handler see it
  }
}
async function remove(prisma, id) {
  try {
    await prisma.note.delete({ where: { id } });
    return true;
  } catch (err) {
    if (err.code === 'P2025') return false;
    throw err;
  }
}
const FAKE_CRUD = `${PRISMA_ERR}
const mkPrisma = (ids, down = false) => { const rows = new Map(ids.map((id) => [id, { id, title: 'Note ' + id, body: '', version: 1 }])); const log = [];
  const wait = (fn) => new Promise((ok, no) => setTimeout(() => { try { ok(fn()); } catch (e) { no(e); } }, 2));
  const guard = () => { if (down) throw Object.assign(new Error("Can't reach database server at localhost:5433"), { code: 'P1001', name: 'PrismaClientInitializationError' }); };
  const missing = () => new PrismaClientKnownRequestError('P2025', 'An operation failed because it depends on one or more records that were required but not found.');
  return { log, rows, note: {
    update: ({ where, data }) => wait(() => { log.push('update ' + where.id); guard(); if (!rows.has(where.id)) throw missing(); const r = { ...rows.get(where.id), ...data }; rows.set(where.id, r); return { ...r }; }),
    delete: ({ where }) => wait(() => { log.push('delete ' + where.id); guard(); if (!rows.has(where.id)) throw missing(); const r = rows.get(where.id); rows.delete(where.id); return r; }),
  } }; };
const caught = async (p) => { try { return await p; } catch (e) { return { thrown: e.name, code: e.code }; } };`;
const E2 = jsBai({
  ten: '7.3 · 2 — Write update() and remove(): translate P2025, and only P2025', kho: 'MEDIUM', phut: 12,
  en: `<p>The chapter-5 routes expect <code>null</code> for “not found” from <code>update</code> and a boolean from <code>remove</code>. Prisma throws instead, with a code. Write the two service functions of lesson 7.3:</p>
<ul><li><code>async update(prisma, id, patch)</code> ⇒ the updated note from <code>prisma.note.update({ where: { id }, data: patch })</code>; if that throws an error whose <code>code</code> is <code>"P2025"</code> ⇒ <code>null</code>.</li>
<li><code>async remove(prisma, id)</code> ⇒ <code>true</code> after <code>prisma.note.delete({ where: { id } })</code>; <code>"P2025"</code> ⇒ <code>false</code>.</li>
<li><b>Any other error must be re-thrown unchanged</b> — the grader’s fake database can be “down” (<code>P1001</code>, <i>Can’t reach database server</i>).</li></ul>`,
  vi: `<p>Các route của chương 5 chờ <code>null</code> cho "không tìm thấy" từ <code>update</code> và boolean từ <code>remove</code>. Prisma thì ném lỗi, kèm mã. Viết hai hàm service của bài 7.3:</p>
<ul><li><code>async update(prisma, id, patch)</code> ⇒ ghi chú đã cập nhật từ <code>prisma.note.update({ where: { id }, data: patch })</code>; nếu nó ném lỗi có <code>code</code> là <code>"P2025"</code> ⇒ <code>null</code>.</li>
<li><code>async remove(prisma, id)</code> ⇒ <code>true</code> sau <code>prisma.note.delete({ where: { id } })</code>; <code>"P2025"</code> ⇒ <code>false</code>.</li>
<li><b>Mọi lỗi khác phải được ném lại nguyên vẹn</b> — CSDL giả của máy chấm có thể "chết" (<code>P1001</code>, <i>Can’t reach database server</i>).</li></ul>`,
  yc: [['<code>return await</code> inside the try — otherwise the rejection escapes the catch.', '<code>return await</code> trong try — không thì lỗi reject thoát khỏi catch.'], ['Never swallow errors you do not understand.', 'Không bao giờ nuốt lỗi bạn không hiểu.']],
  goiY: [['<code>try { return await prisma.note.update(…) } catch (err) { if (err.code === "P2025") return null; throw err; }</code>', '<code>try { return await prisma.note.update(…) } catch (err) { if (err.code === "P2025") return null; throw err; }</code>'], ['<code>return prisma.note.update(…)</code> without <code>await</code> returns the promise before it rejects — the catch never runs.', '<code>return prisma.note.update(…)</code> không có <code>await</code> trả promise trước khi nó reject — catch không bao giờ chạy.']],
  loi: [['<code>catch { return null }</code>: a dead database turns into a 404 and you spend an afternoon looking for a note that was never missing.', '<code>catch { return null }</code>: CSDL chết thành 404 và bạn mất cả buổi chiều tìm một ghi chú chưa từng mất.'], ['<code>return prisma.note.update(...)</code> inside try without await — the P2025 escapes and becomes a 500.', '<code>return prisma.note.update(...)</code> trong try mà không await — P2025 thoát ra và thành 500.']],
  gt: ['Translate the one error you understand; let the rest reach the error handler. P2025 means exactly “no such row”, which the route already knows how to answer (404). P1001 means the database is unreachable, and the honest answer to that is a 5xx and an alert — not a 404.', 'Dịch đúng lỗi bạn hiểu; để phần còn lại tới bộ xử lý lỗi. P2025 nghĩa chính xác là "không có dòng đó", thứ route đã biết trả lời (404). P1001 nghĩa là không với tới CSDL, và câu trả lời thật thà cho nó là 5xx kèm cảnh báo — không phải 404.'],
  kn: ['error handling', 'Prisma'],
  tns: [tn('P1001', 'P1001', 'Không với tới máy chủ CSDL.'), tn('re-throw', 'ném lại')],
  dau: `async function update(prisma, id, patch) {
  // Write your solution here
  try { return prisma.note.update({ where: { id }, data: patch }); } catch (err) { return null; }
}
async function remove(prisma, id) {
  try { await prisma.note.delete({ where: { id } }); return true; } catch (err) { return false; }
}
`,
  giai: [update, remove],
  chung: FAKE_CRUD,
  cases: [
    { goi: `await (async () => { const p = mkPrisma([1, 2]); return [await update(p, 1, { body: 'đã sửa' }), await update(p, 999, { body: 'x' })]; })()`, moTa: ['update: row 1 ⇒ note, row 999 ⇒ null', 'update: dòng 1 ⇒ ghi chú, dòng 999 ⇒ null'] },
    { goi: `await (async () => { const p = mkPrisma([1, 2]); return [await remove(p, 2), await remove(p, 2), [...p.rows.keys()]]; })()`, moTa: ['remove twice ⇒ true, then false', 'remove hai lần ⇒ true rồi false'] },
    { goi: `await (async () => { const p = mkPrisma([1], true); return [await caught(update(p, 1, {})), await caught(remove(p, 1))]; })()`, an: true, moTa: ['Database down ⇒ the error is re-thrown, not turned into 404', 'CSDL chết ⇒ lỗi được ném lại, không thành 404'] },
    { goi: `await (async () => { const p = mkPrisma([]); return [await caught(update(p, 5, {})), await caught(remove(p, 5)), p.log]; })()`, an: true },
  ],
  saiMau: [
    `async function update(prisma, id, patch) { try { return await prisma.note.update({ where: { id }, data: patch }); } catch { return null; } }\nasync function remove(prisma, id) { try { await prisma.note.delete({ where: { id } }); return true; } catch { return false; } }`,
    `async function update(prisma, id, patch) { try { return prisma.note.update({ where: { id }, data: patch }); } catch (e) { if (e.code === 'P2025') return null; throw e; } }\nasync function remove(prisma, id) { try { await prisma.note.delete({ where: { id } }); return true; } catch (e) { if (e.code === 'P2025') return false; throw e; } }`,
  ],
});

/* ── 3. list(): trang + tổng trong MỘT transaction ── */
async function list(prisma, { page = 1, limit = 10, q } = {}) {
  const AUTHOR_ID = 1;   // chapter 8 replaces this with the logged-in user
  const where = {
    authorId: AUTHOR_ID,
    ...(q ? { title: { contains: q, mode: 'insensitive' } } : {}),   // only filter when there is a search term
  };
  // one batch: both queries run in ONE transaction, so total describes the same instant as items
  const [items, total] = await prisma.$transaction([
    prisma.note.findMany({ where, orderBy: { id: 'asc' }, skip: (page - 1) * limit, take: limit }),
    prisma.note.count({ where }),
  ]);
  return { items, page, limit, total };
}
const FAKE_LIST = `const mkPrisma = () => { let rows = [1, 2, 3, 4, 5, 6, 7].map((id) => ({ id, title: ['Learning Prisma', 'Gym', 'prisma tips', 'Shopping', 'Express', 'PRISMA again', 'Other'][id - 1], authorId: id === 4 ? 2 : 1 }));
  const log = []; let inTx = false;
  const match = (w) => (r) => r.authorId === w.authorId && (!w.title || (w.title.mode === 'insensitive' ? r.title.toLowerCase().includes(String(w.title.contains).toLowerCase()) : r.title.includes(w.title.contains)));
  const lazy = (name, args, run) => ({ __lazy: true, name, args, run, then(ok, no) { log.push(name + (inTx ? ' (in tx)' : '')); const v = run(); if (!inTx) rows.push({ id: rows.length + 1, title: 'written by someone else', authorId: 1 }); return Promise.resolve(v).then(ok, no); } });
  const prisma = { log,
    note: {
      findMany: (a) => lazy('findMany', a, () => rows.filter(match(a.where)).sort((x, y) => x.id - y.id).slice(a.skip || 0, (a.skip || 0) + (a.take ?? 1e9))),
      count: (a) => lazy('count', a, () => rows.filter(match(a.where)).length),
    },
    $transaction: async (arr) => { if (!Array.isArray(arr)) throw new Error('this fake only supports the array form'); log.push('$transaction[' + arr.map((x) => x.name).join(',') + ']'); inTx = true; const out = arr.map((x) => x.run()); inTx = false; rows.push({ id: rows.length + 1, title: 'written by someone else', authorId: 1 }); return out; },
  };
  return prisma; };
const args = (p) => p.__args;`;
const E3 = jsBai({
  ten: '7.3 · 3 — Write list(prisma, query): one page and its total from one $transaction', kho: 'MEDIUM', phut: 15,
  en: `<p>Write the chapter-7 <code>list</code> of the notes service. Every note still belongs to <code>AUTHOR_ID = 1</code> (chapter 8 fixes that). <code>list(prisma, { page = 1, limit = 10, q })</code> returns <code>{ items, page, limit, total }</code>:</p>
<ul><li><code>where</code> = <code>{ authorId: 1 }</code>, plus <code>title: { contains: q, mode: 'insensitive' }</code> <b>only when</b> <code>q</code> is a non-empty string.</li>
<li><code>items</code> = <code>prisma.note.findMany({ where, orderBy: { id: 'asc' }, skip: (page − 1) × limit, take: limit })</code>; <code>total</code> = <code>prisma.note.count({ where })</code>.</li>
<li>Both queries go into <b>one</b> <code>prisma.$transaction([ … ])</code>, so a write cannot slip between them.</li></ul>
<p>The grader’s fake behaves like a busy server: <b>after every query that runs outside a transaction, someone else inserts a note for author 1</b>. With two separate awaits your total will not match the rows you just read.</p>`,
  vi: `<p>Viết <code>list</code> chương 7 của notes service. Mọi ghi chú vẫn thuộc <code>AUTHOR_ID = 1</code> (chương 8 sửa điều đó). <code>list(prisma, { page = 1, limit = 10, q })</code> trả <code>{ items, page, limit, total }</code>:</p>
<ul><li><code>where</code> = <code>{ authorId: 1 }</code>, thêm <code>title: { contains: q, mode: 'insensitive' }</code> <b>chỉ khi</b> <code>q</code> là chuỗi không rỗng.</li>
<li><code>items</code> = <code>prisma.note.findMany({ where, orderBy: { id: 'asc' }, skip: (page − 1) × limit, take: limit })</code>; <code>total</code> = <code>prisma.note.count({ where })</code>.</li>
<li>Cả hai truy vấn nằm trong <b>một</b> <code>prisma.$transaction([ … ])</code>, để không lần ghi nào lọt vào giữa.</li></ul>
<p>CSDL giả của máy chấm cư xử như server đang bận: <b>sau mỗi truy vấn chạy ngoài transaction, có người khác thêm một ghi chú cho tác giả 1</b>. Với hai lần await riêng, total sẽ không khớp các dòng bạn vừa đọc.</p>`,
  yc: [['Exactly one <code>$transaction</code> call, with findMany then count.', 'Đúng một lời gọi <code>$transaction</code>, findMany rồi count.'], ['Do not await the queries before passing them in.', 'Đừng await các truy vấn trước khi đưa vào.']],
  goiY: [['Prisma queries are lazy: <code>prisma.note.findMany(…)</code> without <code>await</code> is a description you can hand to <code>$transaction</code>.', 'Truy vấn Prisma là lười: <code>prisma.note.findMany(…)</code> không có <code>await</code> là một bản mô tả để đưa cho <code>$transaction</code>.'], ['<code>const [items, total] = await prisma.$transaction([findMany, count])</code>. Build <code>where</code> with a conditional spread.', '<code>const [items, total] = await prisma.$transaction([findMany, count])</code>. Dựng <code>where</code> bằng phép rải có điều kiện.']],
  loi: [['<code>const items = await …findMany(); const total = await …count();</code> — total: 41 next to 40 visible items.', '<code>const items = await …findMany(); const total = await …count();</code> — total: 41 cạnh 40 ghi chú nhìn thấy.'], ['Always adding <code>title: { contains: undefined }</code> — a filter that means something different in every ORM version.', 'Luôn thêm <code>title: { contains: undefined }</code> — bộ lọc mang nghĩa khác nhau ở mỗi phiên bản ORM.'], ['Forgetting <code>mode: "insensitive"</code>: <code>q=prisma</code> no longer finds “Learning Prisma”.', 'Quên <code>mode: "insensitive"</code>: <code>q=prisma</code> không còn tìm thấy "Learning Prisma".']],
  gt: ['A batch transaction sends both statements together and runs them as one unit, so they see one snapshot: the count describes exactly the rows the page was cut from. Two independent awaits are two snapshots, and on a busy table something always lands between them.', 'Transaction theo lô gửi hai câu cùng lúc và chạy như một khối, nên chúng thấy cùng một ảnh chụp: số đếm mô tả đúng các dòng mà trang được cắt ra. Hai lần await độc lập là hai ảnh chụp, và trên bảng bận luôn có thứ chen vào giữa.'],
  kn: ['transactions', 'pagination', 'Prisma'],
  tns: [tn('snapshot', 'ảnh chụp', 'Trạng thái dữ liệu một truy vấn nhìn thấy.'), tn('PrismaPromise', 'PrismaPromise', 'Truy vấn chỉ chạy khi await hoặc trong $transaction.')],
  dau: `async function list(prisma, { page = 1, limit = 10, q } = {}) {
  // Write your solution here
  const where = { authorId: 1, title: { contains: q } };
  const items = await prisma.note.findMany({ where, orderBy: { id: 'asc' }, skip: (page - 1) * limit, take: limit });
  const total = await prisma.note.count({ where });
  return { items, page, limit, total };
}
`,
  giai: list,
  chung: FAKE_LIST,
  cases: [
    { goi: `await (async () => { const p = mkPrisma(); const r = await list(p, { page: 1, limit: 3 }); return [r, p.log]; })()`, moTa: ['Page 1: total matches the rows (one transaction)', 'Trang 1: total khớp các dòng (một transaction)'] },
    { goi: `await (async () => { const p = mkPrisma(); const r = await list(p, { q: 'prisma' }); return [r.items.map((n) => n.title), r.total, p.log]; })()`, moTa: ['q=prisma is case-insensitive', 'q=prisma không phân biệt hoa thường'] },
    { goi: `await (async () => { const p = mkPrisma(); const a = await list(p, { page: 2, limit: 2 }); const b = await list(p); return [a.items.map((n) => n.id), a.total, b.total, b.items.length, p.log]; })()`, an: true },
    { goi: `await (async () => { const p = mkPrisma(); let seen; const orig = p.note.findMany; p.note.findMany = (a) => { seen = a; return orig(a); }; await list(p, { q: '' }); return seen; })()`, an: true, moTa: ['Empty q ⇒ no title filter', 'q rỗng ⇒ không lọc tiêu đề'] },
  ],
  saiMau: [
    list.toString().replace("...(q ? { title: { contains: q, mode: 'insensitive' } } : {}),", '...(q ? { title: { contains: q } } : {}),'),
  ],
});

/* ── 4. Transaction tương tác: dùng tx, và gọi API chậm TRƯỚC ── */
async function createNoteWithTag(prisma, fetchPreview, input, tagName) {
  // 1) the slow external call happens BEFORE the transaction: no pool slot, no lock held while we wait
  const preview = input.url ? await fetchPreview(input.url) : null;
  // 2) only the writes that belong together go inside — and every one of them uses tx, never prisma
  return prisma.$transaction(async (tx) => {
    const note = await tx.note.create({ data: { title: input.title, preview } });
    const tag = await tx.tag.create({ data: { name: tagName } });
    await tx.noteTag.create({ data: { noteId: note.id, tagId: tag.id } });
    return { note, tag };
  });
}
const FAKE_TX = `${PRISMA_ERR}
const mkDb = () => { const db = { note: [], tag: [], noteTag: [] }; const log = [];
  const t = () => Date.now() - 1767225600000;
  const table = (store, name, check) => ({ create: ({ data }) => new Promise((ok, no) => setTimeout(() => { try { check && check(data); const row = { id: store[name].length + 1, ...data }; store[name].push(row); log.push((store === db ? 'COMMIT ' : 'tx ') + name + '.create'); ok({ ...row }); } catch (e) { no(e); } }, 5)) });
  const tagCheck = (d) => { if (String(d.name).length > 40) throw new PrismaClientKnownRequestError('P2000', "The provided value for the column is too long for the column's type. Column: name"); };
  const client = (store) => ({ note: table(store, 'note'), tag: table(store, 'tag', tagCheck), noteTag: table(store, 'noteTag') });
  const prisma = { ...client(db), log, db,
    $transaction: async (fn) => { const started = t(); const staged = JSON.parse(JSON.stringify(db)); log.push('BEGIN');
      const r = await fn(client(staged));
      if (t() - started > 5000) { log.push('ROLLBACK (expired)'); throw new PrismaClientKnownRequestError('P2028', 'Transaction API error: A query cannot be executed on an expired transaction. The timeout for this transaction was 5000 ms, however ' + (t() - started) + ' ms passed since the start of the transaction.'); }
      for (const k of Object.keys(db)) db[k] = staged[k]; log.push('COMMIT'); return r; } };
  const realTx = prisma.$transaction;
  prisma.$transaction = async (fn) => { try { return await realTx(fn); } catch (e) { if (!log.includes('ROLLBACK (expired)')) log.push('ROLLBACK'); throw e; } };
  return prisma; };
const fetchPreview = (url) => new Promise((ok) => setTimeout(() => ok({ url, title: 'Preview of ' + url }), 6000));
const counts = (p) => ({ notes: p.db.note.length, tags: p.db.tag.length, links: p.db.noteTag.length });
const caught = async (x) => { try { return await x; } catch (e) { return { thrown: e.name, code: e.code }; } };`;
const E4 = jsBai({
  ten: '7.3 · 4 — Write createNoteWithTag(): all-or-nothing with tx, and the slow call outside', kho: 'HARD', phut: 25,
  en: `<p>Lesson 7.3’s two experiments in one function. <code>createNoteWithTag(prisma, fetchPreview, { title, url }, tagName)</code> creates a note, a tag and the link between them — all or nothing — and returns <code>{ note, tag }</code>:</p>
<ol><li>If <code>url</code> is set, <code>const preview = await fetchPreview(url)</code> (a third-party API that takes <b>6 seconds</b>); otherwise <code>preview = null</code>.</li>
<li>Then <code>prisma.$transaction(async (tx) =&gt; { … })</code>: <code>tx.note.create({ data: { title, preview } })</code>, <code>tx.tag.create({ data: { name: tagName } })</code>, <code>tx.noteTag.create({ data: { noteId, tagId } })</code>; return <code>{ note, tag }</code>.</li></ol>
<p>The fake behaves like Prisma: a tag name longer than 40 characters throws <code>P2000</code> (VarChar(40)); the transaction’s writes are rolled back on any throw; an interactive transaction that runs longer than <b>5000 ms</b> fails with <code>P2028</code> and is rolled back. Queries on <code>prisma</code> inside the callback commit on their own — and are not rolled back.</p>`,
  vi: `<p>Hai thí nghiệm của bài 7.3 trong một hàm. <code>createNoteWithTag(prisma, fetchPreview, { title, url }, tagName)</code> tạo ghi chú, tag và liên kết giữa chúng — tất cả hoặc không — và trả <code>{ note, tag }</code>:</p>
<ol><li>Nếu có <code>url</code>, <code>const preview = await fetchPreview(url)</code> (một API bên thứ ba mất <b>6 giây</b>); không thì <code>preview = null</code>.</li>
<li>Rồi <code>prisma.$transaction(async (tx) =&gt; { … })</code>: <code>tx.note.create({ data: { title, preview } })</code>, <code>tx.tag.create({ data: { name: tagName } })</code>, <code>tx.noteTag.create({ data: { noteId, tagId } })</code>; trả <code>{ note, tag }</code>.</li></ol>
<p>Hàm giả cư xử như Prisma: tên tag dài hơn 40 ký tự ném <code>P2000</code> (VarChar(40)); các lần ghi của transaction bị hoàn tác khi có lỗi ném ra; transaction tương tác chạy quá <b>5000 ms</b> hỏng với <code>P2028</code> và bị hoàn tác. Truy vấn trên <code>prisma</code> bên trong callback tự commit — và không được hoàn tác.</p>`,
  yc: [['Every write inside the callback uses <code>tx</code>.', 'Mọi lần ghi trong callback dùng <code>tx</code>.'], ['The 6-second call happens before <code>$transaction</code>, never inside.', 'Lời gọi 6 giây xảy ra trước <code>$transaction</code>, không bao giờ bên trong.'], ['Let errors propagate (the route maps them).', 'Để lỗi lan ra ngoài (route sẽ ánh xạ).']],
  goiY: [['Shape: <code>const preview = …; return prisma.$transaction(async (tx) =&gt; { const note = await tx.note.create(…); … })</code>.', 'Hình dạng: <code>const preview = …; return prisma.$transaction(async (tx) =&gt; { const note = await tx.note.create(…); … })</code>.'], ['Read your callback and search for the word <code>prisma.</code> — there must be none.', 'Đọc callback và tìm chữ <code>prisma.</code> — không được có cái nào.']],
  loi: [['Writing <code>await prisma.note.create(…)</code> inside the callback: when the tag fails, the note stays — “after: 2 notes, 0 tags”.', 'Viết <code>await prisma.note.create(…)</code> trong callback: khi tag hỏng, ghi chú vẫn ở lại — "sau: 2 ghi chú, 0 tag".'], ['Calling <code>fetchPreview</code> inside the transaction: 6 s > 5 s ⇒ P2028, and in production ten of them drain the pool.', 'Gọi <code>fetchPreview</code> trong transaction: 6 s > 5 s ⇒ P2028, và trên production mười cái như thế làm cạn pool.'], ['Fixing P2028 by passing <code>{ timeout: 15000 }</code>: it “works” and holds a connection and its locks for 6 s per request.', 'Sửa P2028 bằng <code>{ timeout: 15000 }</code>: nó "chạy" và giữ một kết nối cùng các khoá 6 s mỗi request.']],
  gt: ['The rule that decides whether you need a transaction: would a failure halfway leave data that is WRONG rather than merely incomplete? A note with no tag link it was created for is wrong. And the rule for what goes inside: only the writes, because an open transaction is a pool slot, a backend and its locks — an HTTP call inside it holds all three hostage for the length of someone else’s network.', 'Luật quyết định có cần transaction: hỏng giữa chừng có để lại dữ liệu SAI chứ không chỉ thiếu? Một ghi chú không có liên kết tag mà nó được tạo ra để có là sai. Và luật cho thứ nằm bên trong: chỉ các lần ghi, vì transaction đang mở là một chỗ trong pool, một backend và các khoá — một lời gọi HTTP trong đó giữ cả ba làm con tin suốt thời gian mạng của người khác.'],
  kn: ['transactions', 'Prisma'],
  tns: [tn('rollback', 'hoàn tác'), tn('P2028', 'P2028', 'Transaction tương tác hết hạn.'), tn('P2000', 'P2000', 'Giá trị quá dài cho cột.')],
  dau: `async function createNoteWithTag(prisma, fetchPreview, input, tagName) {
  // Write your solution here
  return prisma.$transaction(async (tx) => {
    const preview = input.url ? await fetchPreview(input.url) : null;
    const note = await prisma.note.create({ data: { title: input.title, preview } });
    const tag = await tx.tag.create({ data: { name: tagName } });
    await tx.noteTag.create({ data: { noteId: note.id, tagId: tag.id } });
    return { note, tag };
  });
}
`,
  giai: createNoteWithTag,
  chung: FAKE_TX,
  timeoutMs: 20000,
  cases: [
    { goi: `await (async () => { const p = mkDb(); const r = await createNoteWithTag(p, fetchPreview, { title: 'Learning Prisma' }, 'work'); return [r, counts(p), p.log]; })()`, moTa: ['Happy path without url', 'Đường suôn sẻ không có url'] },
    { goi: `await (async () => { const p = mkDb(); const r = await caught(createNoteWithTag(p, fetchPreview, { title: 'x' }, 'y'.repeat(60))); return [r, counts(p), p.log]; })()`, moTa: ['Tag too long ⇒ P2000, nothing left behind', 'Tag quá dài ⇒ P2000, không để lại gì'] },
    { goi: `await (async () => { const p = mkDb(); const r = await caught(createNoteWithTag(p, fetchPreview, { title: 'with link', url: 'https://nodejs.org' }, 'docs')); return [r.note ? r.note.preview : r, counts(p), p.log]; })()`, moTa: ['A 6-second preview must not be inside the 5-second transaction', 'Bản xem trước 6 giây không được nằm trong transaction 5 giây'] },
    { goi: `await (async () => { const p = mkDb(); await createNoteWithTag(p, fetchPreview, { title: 'a' }, 'one'); const bad = await caught(createNoteWithTag(p, fetchPreview, { title: 'b', url: 'https://x.test' }, 'z'.repeat(41))); await createNoteWithTag(p, fetchPreview, { title: 'c' }, 'two'); return [bad, counts(p), p.db.noteTag]; })()`, an: true },
    { goi: `await (async () => { const p = mkDb(); const r = await createNoteWithTag(p, fetchPreview, { title: 'exactly 40', url: null }, 'k'.repeat(40)); return [r.tag.name.length, r.note.preview, counts(p)]; })()`, an: true },
  ],
  saiMau: [
    createNoteWithTag.toString().replace('await tx.note.create', 'await prisma.note.create'),
  ],
});

/* ── 5. upsert trong SQL: gắn tag một lượt, chạy lại vô hại ── */
const UPSERT = `-- 1. make sure the three tags exist; the UNIQUE index on name decides, not a SELECT first
INSERT INTO "Tag" (name) VALUES ('work'), ('db'), ('reading')
ON CONFLICT (name) DO NOTHING;

-- 2. link them to note 3, skipping links that already exist (the compound primary key decides)
INSERT INTO "NoteTag" ("noteId", "tagId")
SELECT 3, id FROM "Tag" WHERE name IN ('work', 'db', 'reading')
ON CONFLICT ("noteId", "tagId") DO NOTHING;
`;
const E5 = sqlBai({
  ten: '7.3 · 5 — Tag note 3 with work, db, reading in two statements that are safe to run twice', kho: 'MEDIUM', phut: 15,
  en: `<p>Prisma’s <code>upsert</code> and <code>createMany({ skipDuplicates: true })</code> are one round trip because “the database decides” — they become <code>INSERT … ON CONFLICT</code>. Write the SQL yourself. Attach the tags <code>work</code>, <code>db</code> and <code>reading</code> to note <b>3</b>:</p>
<ul><li>Create the tags that do not exist yet — <code>work</code> and <code>db</code> already exist, <code>reading</code> does not. Use the unique index on <code>"Tag".name</code>, not a SELECT-then-INSERT.</li>
<li>Insert the missing <code>"NoteTag"</code> links for note 3 with one <code>INSERT … SELECT</code>, skipping links that already exist.</li>
<li>Exactly <b>two statements</b>, no hard-coded tag ids, and running them a second time must not fail or duplicate anything.</li></ul>`,
  vi: `<p><code>upsert</code> và <code>createMany({ skipDuplicates: true })</code> của Prisma chỉ một lượt đi-về vì "CSDL quyết định" — chúng thành <code>INSERT … ON CONFLICT</code>. Hãy tự viết SQL. Gắn các tag <code>work</code>, <code>db</code> và <code>reading</code> cho ghi chú <b>3</b>:</p>
<ul><li>Tạo các tag chưa có — <code>work</code> và <code>db</code> đã có, <code>reading</code> thì chưa. Dùng chỉ mục unique trên <code>"Tag".name</code>, không SELECT rồi mới INSERT.</li>
<li>Thêm các liên kết <code>"NoteTag"</code> còn thiếu cho ghi chú 3 bằng một câu <code>INSERT … SELECT</code>, bỏ qua liên kết đã có.</li>
<li>Đúng <b>hai câu lệnh</b>, không ghi cứng id của tag, và chạy lần thứ hai không được hỏng hay nhân đôi gì.</li></ul>`,
  yc: [['Two statements: INSERT … ON CONFLICT on "Tag", INSERT … SELECT … ON CONFLICT on "NoteTag".', 'Hai câu: INSERT … ON CONFLICT trên "Tag", INSERT … SELECT … ON CONFLICT trên "NoteTag".'], ['Look tag ids up by name inside the SQL.', 'Tra id tag theo tên ngay trong SQL.']],
  giai: UPSERT,
  khoi: `-- Write your two statements here\nINSERT INTO "Tag" (name) VALUES ('work'), ('db'), ('reading');\nINSERT INTO "NoteTag" ("noteId", "tagId") VALUES (3, 1), (3, 4), (3, 5);\n`,
  kiem: [
    sau(['Note 3 has exactly work, db, reading', 'Ghi chú 3 có đúng work, db, reading'], `SELECT t.name FROM "NoteTag" nt JOIN "Tag" t ON t.id = nt."tagId" WHERE nt."noteId" = 3 ORDER BY t.name`, { thuTu: true }),
    sau(['No duplicate tags were created', 'Không tạo tag trùng'], `SELECT name, count(*) AS n FROM "Tag" GROUP BY name ORDER BY name`, { thuTu: true }),
    sau(['Other notes’ links are untouched', 'Liên kết của ghi chú khác không bị đụng'], `SELECT "noteId", "tagId" FROM "NoteTag" WHERE "noteId" <> 3 ORDER BY 1, 2`, { thuTu: true }),
    sau(['Hidden: note 3 already had "work" and tag ids are different', 'Ẩn: ghi chú 3 đã có "work" và id tag khác'], `SELECT t.name, (SELECT count(*) FROM "Tag") AS tags FROM "NoteTag" nt JOIN "Tag" t ON t.id = nt."tagId" WHERE nt."noteId" = 3 ORDER BY t.name`, { thuTu: true, an: true, themCsdl: `DELETE FROM "NoteTag"; DELETE FROM "Tag"; INSERT INTO "Tag" (id, name) VALUES (40, 'db'), (41, 'misc'), (42, 'work'); INSERT INTO "NoteTag" VALUES (3, 42), (1, 41);` }),
    sau(['Hidden: running your statements twice is harmless', 'Ẩn: chạy câu lệnh của bạn hai lần là vô hại'], `SELECT count(*) AS links FROM "NoteTag" WHERE "noteId" = 3`, { an: true, themCsdl: `INSERT INTO "Tag" (name) VALUES ('reading'); INSERT INTO "NoteTag" SELECT 3, id FROM "Tag" WHERE name IN ('work', 'db', 'reading');` }),
  ],
  sai: [
    `INSERT INTO "Tag" (name) VALUES ('reading');\nINSERT INTO "NoteTag" ("noteId", "tagId") SELECT 3, id FROM "Tag" WHERE name IN ('work', 'db', 'reading');`,
    `INSERT INTO "Tag" (name) VALUES ('work'), ('db'), ('reading') ON CONFLICT (name) DO NOTHING;\nINSERT INTO "NoteTag" ("noteId", "tagId") VALUES (3, 1), (3, 4), (3, 5) ON CONFLICT DO NOTHING;`,
  ],
  goiY: [['<code>INSERT INTO "Tag" (name) VALUES (…), (…) ON CONFLICT (name) DO NOTHING;</code>', '<code>INSERT INTO "Tag" (name) VALUES (…), (…) ON CONFLICT (name) DO NOTHING;</code>'], ['The links: <code>INSERT INTO "NoteTag" ("noteId", "tagId") SELECT 3, id FROM "Tag" WHERE name IN (…) ON CONFLICT ("noteId", "tagId") DO NOTHING;</code>', 'Liên kết: <code>INSERT INTO "NoteTag" ("noteId", "tagId") SELECT 3, id FROM "Tag" WHERE name IN (…) ON CONFLICT ("noteId", "tagId") DO NOTHING;</code>']],
  loi: [['A plain INSERT of all three names: <code>work</code> already exists ⇒ 23505 and the whole thing fails.', 'INSERT thường cả ba tên: <code>work</code> đã có ⇒ 23505 và cả khối hỏng.'], ['Hard-coding tag ids (1, 4, 5): correct on your laptop, wrong on every other database.', 'Ghi cứng id tag (1, 4, 5): đúng trên máy bạn, sai trên mọi CSDL khác.'], ['“Check then insert” from Node: two round trips and a race between them; the unique index is the only correct referee.', '"Kiểm rồi mới thêm" từ Node: hai lượt đi-về và một cuộc đua ở giữa; chỉ mục unique là trọng tài đúng duy nhất.']],
  gt: ['ON CONFLICT hands the decision to the constraint that already guarantees uniqueness, so the statement is correct under concurrency and idempotent: the second run finds every tag and every link already there and does nothing. INSERT … SELECT looks the ids up where they live, in the same round trip.', 'ON CONFLICT trao quyết định cho chính ràng buộc vốn đảm bảo tính duy nhất, nên câu lệnh đúng khi chạy đồng thời và idempotent: lần chạy thứ hai thấy mọi tag và mọi liên kết đã có và không làm gì. INSERT … SELECT tra id ngay tại nơi chúng nằm, trong cùng một lượt đi-về.'],
  tns: [tn('ON CONFLICT DO NOTHING', 'bỏ qua khi trùng'), tn('upsert', 'thêm hoặc cập nhật')],
  kn: ['SQL', 'upsert', 'idempotency'],
});

export default modul('nodejs-7-3-crud-transaction', '7.3 CRUD, transactions, and swapping the Notes API onto PostgreSQL', [E1, E2, E3, E4, E5]);
