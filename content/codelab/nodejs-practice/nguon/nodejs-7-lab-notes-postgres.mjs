/** Node.js · Lab Chương 7 — Notes API trên PostgreSQL: service Prisma đầy đủ (cursor, P2002/P2025, version, transaction với tx), migration + chỉ mục + truy vấn bảng tin trong một tệp, và quy trình cứu migration hỏng. */
import { modul, cs, ord, tn, jsBai, sqlBai, notesDb, luocDoNotes, sau, chan, kq, kqAn, APP_ERROR, PLAN_ALL } from './_node-c6-8.mjs';

/* ── Lab 7 · 1 — Thứ tự cứu một migration hỏng ── */
const L1 = cs({
  ten: 'Lab 7 · 1 — The P3018 drill: put the recovery steps in the only safe order', kho: 'MEDIUM', phut: 8, dangBai: 'lab', loai: 'order',
  en: 'The lab’s deploy failed: <code>migrate deploy</code> printed P3018 for <code>20260727170000_add_slug</code> (23502: column "slug" contains null values), and the retry printed P3009. Order the steps the way lesson 7.2 and this project’s own rules require.',
  vi: 'Lần deploy của lab hỏng: <code>migrate deploy</code> in P3018 cho <code>20260727170000_add_slug</code> (23502: cột "slug" có giá trị null), và lần chạy lại in P3009. Sắp các bước theo đúng thứ tự mà bài 7.2 và luật của chính dự án này yêu cầu.',
  cau: [
    ord('o1', ['Recovery order', 'Thứ tự cứu'], [
      'Stop: do not retry, do not edit the database, write down the exact error and migration name',
      'Check how much applied: the columns of "Note", and finished_at / applied_steps_count in _prisma_migrations',
      'Seeing no slug column and applied_steps_count = 0, run prisma migrate resolve --rolled-back for that migration',
      'Rewrite the migration as nullable → backfill → SET NOT NULL → unique index',
      'Run prisma migrate deploy again and confirm with migrate status and a SELECT of the slugs',
    ], ['Stop first, because every reflex (retry, resolve --applied, an IF NOT EXISTS hack) can make the history lie. Check before resolving: --rolled-back is only honest when nothing applied. Fix the migration, deploy, verify. Both attempts stay in the history — an audit trail, not a cover-up.', 'Dừng trước, vì mọi phản xạ (chạy lại, resolve --applied, mẹo IF NOT EXISTS) đều có thể làm lịch sử nói dối. Kiểm trước khi resolve: --rolled-back chỉ trung thực khi chưa có gì được áp dụng. Sửa migration, deploy, kiểm lại. Cả hai lần thử nằm lại trong lịch sử — dấu vết kiểm toán, không phải che giấu.']),
  ],
  goiY: [['Nothing changes before you know the state.', 'Không thay đổi gì trước khi biết trạng thái.'], ['resolve only records a fact; the fact must be checked first.', 'resolve chỉ ghi lại một sự thật; sự thật phải được kiểm trước.']],
  loi: [['Running resolve --applied “to make the red go away”.', 'Chạy resolve --applied "cho hết đỏ".'], ['Editing the already-recorded migration file and re-running before resolving.', 'Sửa tệp migration đã được ghi nhận rồi chạy lại trước khi resolve.']],
  tns: [tn('P3018', 'P3018', 'Migration hỏng khi áp dụng.'), tn('P3009', 'P3009', 'Có migration hỏng ⇒ chặn mọi migration.')],
  kn: ['migrations', 'incident response'],
});

/* ── Lab 7 · 2 — Service Notes trên Prisma ── */
function createNotesService(prisma) {
  const AUTHOR_ID = 1;                                             // chapter 8 replaces this with the logged-in user
  const slugify = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const conflict = (err) => {
    const c = err.meta?.driverAdapterError?.cause?.constraint;
    return new AppError(409, 'DUPLICATE', (c?.fields?.join(', ') ?? c?.index ?? 'value') + ' already exists');
  };
  return {
    async list({ cursor, limit = 20 } = {}) {
      const take = Math.min(limit, 50);
      const items = await prisma.note.findMany({
        where: { authorId: AUTHOR_ID, ...(cursor ? { id: { lt: cursor } } : {}) },
        orderBy: { id: 'desc' }, take: take + 1, omit: { body: true },
      });
      const hasMore = items.length > take;
      if (hasMore) items.pop();
      return { items, nextCursor: hasMore ? items.at(-1).id : null };
    },
    async create({ title, body = '', tags = [] }) {
      try {
        // a note and its tag links belong together: all of it, or none of it — and every query uses tx
        return await prisma.$transaction(async (tx) => {
          const note = await tx.note.create({ data: { title, body, slug: slugify(title), authorId: AUTHOR_ID } });
          for (const name of tags) {
            const tag = await tx.tag.upsert({ where: { name }, create: { name }, update: {} });
            await tx.noteTag.create({ data: { noteId: note.id, tagId: tag.id } });
          }
          return note;
        });
      } catch (err) {
        if (err.code === 'P2002') throw conflict(err);
        throw err;
      }
    },
    async update(id, version, patch) {
      const { id: _i, version: _v, authorId: _a, slug: _s, ...safe } = patch;
      const r = await prisma.note.updateMany({ where: { id, version }, data: { ...safe, version: { increment: 1 } } });
      if (r.count === 0) {
        if (!await prisma.note.findUnique({ where: { id } })) throw new AppError(404, 'NOTE_NOT_FOUND', 'Note ' + id + ' does not exist');
        throw new AppError(409, 'STALE_VERSION', 'Someone else edited this note. Reload and try again.');
      }
      return prisma.note.findUnique({ where: { id } });
    },
    async remove(id) {
      try { await prisma.note.delete({ where: { id } }); return true; }
      catch (err) { if (err.code === 'P2025') return false; throw err; }
    },
  };
}
const FAKE_DB = `class PrismaClientKnownRequestError extends Error { constructor(code, message, meta) { super(message); this.name = 'PrismaClientKnownRequestError'; this.code = code; this.meta = meta; } }
const mkPrisma = (seed = 0) => {
  let db = { note: [], tag: [], noteTag: [], seq: { note: 0, tag: 0 } }; const log = [];
  for (let i = 1; i <= seed; i++) db.note.push({ id: ++db.seq.note, title: 'Seed ' + i, slug: 'seed-' + i, body: 'b'.repeat(200), authorId: i % 3 === 0 ? 2 : 1, version: 1 });
  const wait = (fn) => new Promise((ok, no) => setTimeout(() => { try { ok(fn()); } catch (e) { no(e); } }, 1));
  const strip = (r, omit) => { const c = { ...r }; for (const k of Object.keys(omit || {})) if (omit[k]) delete c[k]; return c; };
  const P2002 = (index) => new PrismaClientKnownRequestError('P2002', 'Unique constraint failed on the constraint: ' + index, { modelName: 'Note', driverAdapterError: { cause: { originalCode: '23505', constraint: { index } } } });
  const api = (d, where) => ({
    note: {
      findMany: (a) => wait(() => { log.push(where + 'note.findMany take=' + a.take + (a.omit ? ' omit' : '')); let r = d().note.filter((n) => (a.where.authorId === undefined || n.authorId === a.where.authorId) && (!a.where.id || n.id < a.where.id.lt)); r.sort((x, y) => (a.orderBy && a.orderBy.id === 'desc' ? y.id - x.id : x.id - y.id)); return r.slice(0, a.take).map((n) => strip(n, a.omit)); }),
      findUnique: (a) => wait(() => { const n = d().note.find((x) => x.id === a.where.id); return n ? { ...n } : null; }),
      count: () => wait(() => { log.push(where + 'count'); return d().note.length; }),
      create: (a) => wait(() => { log.push(where + 'note.create'); if (d().note.some((n) => n.slug === a.data.slug)) throw P2002('Note_slug_key'); const n = { id: ++d().seq.note, version: 1, ...a.data }; d().note.push(n); return { ...n }; }),
      updateMany: (a) => wait(() => { let count = 0; for (const n of d().note) if (n.id === a.where.id && n.version === a.where.version) { for (const [k, v] of Object.entries(a.data)) n[k] = v && typeof v === 'object' && 'increment' in v ? n[k] + v.increment : v; count++; } return { count }; }),
      update: () => { throw new Error('use updateMany for the version check'); },
      delete: (a) => wait(() => { const i = d().note.findIndex((n) => n.id === a.where.id); if (i < 0) throw new PrismaClientKnownRequestError('P2025', 'Record to delete does not exist.'); d().noteTag = d().noteTag.filter((x) => x.noteId !== a.where.id); return d().note.splice(i, 1)[0]; }),
    },
    tag: { upsert: (a) => wait(() => { if (a.where.name.length > 40) throw new PrismaClientKnownRequestError('P2000', 'The provided value for the column is too long'); let t = d().tag.find((x) => x.name === a.where.name); if (!t) { t = { id: ++d().seq.tag, name: a.where.name }; d().tag.push(t); } return { ...t }; }) },
    noteTag: { create: (a) => wait(() => { d().noteTag.push({ ...a.data }); return { ...a.data }; }) },
  });
  const prisma = { log, get db() { return db; }, ...api(() => db, ''),
    $transaction: async (fn) => { if (typeof fn !== 'function') throw new Error('use the callback form here'); const staged = JSON.parse(JSON.stringify(db)); log.push('BEGIN');
      try { const r = await fn(api(() => staged, 'tx.')); db = staged; log.push('COMMIT'); return r; } catch (e) { log.push('ROLLBACK'); throw e; } } };
  return prisma; };
const caught = async (p) => { try { return await p; } catch (e) { return { thrown: e.name, status: e.status, code: e.code, ...(e.code === 'DUPLICATE' ? { message: e.message } : {}) }; } };
const counts = (p) => ({ notes: p.db.note.length, tags: p.db.tag.length, links: p.db.noteTag.length });`;
const L2 = jsBai({
  ten: 'Lab 7 · 2 — Build createNotesService(prisma): the whole chapter on one service', kho: 'HARD', phut: 45, diem: 40, dangBai: 'lab',
  en: `<p>The lab’s service layer, behind the same routes as chapter 6. Every note belongs to <code>AUTHOR_ID = 1</code>. <code>AppError</code> is in <code>helpers.js</code>; the grader’s fake Prisma behaves like Prisma 7 (codes, lazy errors, rollback, unique slug). Write <code>createNotesService(prisma)</code> returning:</p>
<ul>
<li><b>list({ cursor, limit = 20 })</b> ⇒ <code>{ items, nextCursor }</code> — lesson 7.6’s final shape: author 1 only, <code>id &lt; cursor</code> when given, <code>orderBy: { id: 'desc' }</code>, <code>take: min(limit, 50) + 1</code>, <code>omit: { body: true }</code>, no count.</li>
<li><b>create({ title, body = '', tags = [] })</b> ⇒ the note. Inside <b>one</b> <code>prisma.$transaction(async (tx) =&gt; …)</code>: <code>tx.note.create({ data: { title, body, slug, authorId: 1 } })</code> with <code>slug</code> = title lower-cased, every run of characters other than <code>a-z0-9</code> replaced by <code>-</code>, leading/trailing <code>-</code> removed; then for each tag name <code>tx.tag.upsert({ where: { name }, create: { name }, update: {} })</code> and <code>tx.noteTag.create({ data: { noteId, tagId } })</code>. <code>P2002</code> ⇒ <code>AppError(409, 'DUPLICATE', '&lt;fields or index or value&gt; already exists')</code> (read <code>meta.driverAdapterError.cause.constraint</code> as in 7.6); any other error propagates — and nothing of that note may remain.</li>
<li><b>update(id, version, patch)</b> ⇒ the fresh note; ignore <code>id</code>, <code>version</code>, <code>authorId</code>, <code>slug</code> in the patch; <code>updateMany</code> with the version check and <code>{ increment: 1 }</code>; 0 rows ⇒ 404 <code>NOTE_NOT_FOUND</code> if the note is gone, else 409 <code>STALE_VERSION</code>.</li>
<li><b>remove(id)</b> ⇒ <code>true</code>, or <code>false</code> on <code>P2025</code>; other errors propagate.</li>
</ul>`,
  vi: `<p>Tầng service của lab, đằng sau đúng các route của chương 6. Mọi ghi chú thuộc <code>AUTHOR_ID = 1</code>. <code>AppError</code> có trong <code>helpers.js</code>; Prisma GIẢ của máy chấm cư xử như Prisma 7 (mã lỗi, lỗi lười, hoàn tác, slug duy nhất). Viết <code>createNotesService(prisma)</code> trả về:</p>
<ul>
<li><b>list({ cursor, limit = 20 })</b> ⇒ <code>{ items, nextCursor }</code> — hình dạng cuối của bài 7.6: chỉ tác giả 1, <code>id &lt; cursor</code> khi có, <code>orderBy: { id: 'desc' }</code>, <code>take: min(limit, 50) + 1</code>, <code>omit: { body: true }</code>, không đếm.</li>
<li><b>create({ title, body = '', tags = [] })</b> ⇒ ghi chú. Trong <b>một</b> <code>prisma.$transaction(async (tx) =&gt; …)</code>: <code>tx.note.create({ data: { title, body, slug, authorId: 1 } })</code> với <code>slug</code> = title chữ thường, mỗi cụm ký tự ngoài <code>a-z0-9</code> thay bằng <code>-</code>, bỏ <code>-</code> ở đầu/cuối; rồi với mỗi tên tag <code>tx.tag.upsert({ where: { name }, create: { name }, update: {} })</code> và <code>tx.noteTag.create({ data: { noteId, tagId } })</code>. <code>P2002</code> ⇒ <code>AppError(409, 'DUPLICATE', '&lt;fields hoặc index hoặc value&gt; already exists')</code> (đọc <code>meta.driverAdapterError.cause.constraint</code> như bài 7.6); lỗi khác lan ra — và không được còn sót gì của ghi chú đó.</li>
<li><b>update(id, version, patch)</b> ⇒ ghi chú mới; bỏ qua <code>id</code>, <code>version</code>, <code>authorId</code>, <code>slug</code> trong patch; <code>updateMany</code> có kiểm version và <code>{ increment: 1 }</code>; 0 dòng ⇒ 404 <code>NOTE_NOT_FOUND</code> nếu ghi chú đã mất, không thì 409 <code>STALE_VERSION</code>.</li>
<li><b>remove(id)</b> ⇒ <code>true</code>, hoặc <code>false</code> khi <code>P2025</code>; lỗi khác lan ra.</li>
</ul>`,
  yc: [['Lessons 7.3 (P2025, tx), 7.4 (omit body), 7.6 (cursor, P2002, version) — all in one service.', 'Bài 7.3 (P2025, tx), 7.4 (omit body), 7.6 (cursor, P2002, version) — tất cả trong một service.'], ['Inside the transaction callback, only <code>tx</code>.', 'Trong callback transaction, chỉ dùng <code>tx</code>.']],
  goiY: [['Reuse your solutions of 7.3 · 2, 7.6 · 2, 7.6 · 3, 7.6 · 4 — the lab is their composition.', 'Dùng lại lời giải của 7.3 · 2, 7.6 · 2, 7.6 · 3, 7.6 · 4 — lab là sự ghép chúng lại.'], ['Wrap the WHOLE <code>$transaction</code> in try/catch for P2002: the error surfaces from the transaction after its rollback.', 'Bọc CẢ <code>$transaction</code> trong try/catch để bắt P2002: lỗi nổi lên từ transaction sau khi đã hoàn tác.'], ['slugify: <code>t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")</code>.', 'slugify: <code>t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")</code>.']],
  loi: [['<code>prisma.tag.upsert</code> inside the callback: when the third tag is too long, the first two tags stay committed.', '<code>prisma.tag.upsert</code> trong callback: khi tag thứ ba quá dài, hai tag đầu vẫn được commit.'], ['Catching every error in create and answering 409: a too-long tag (P2000) becomes “already exists”.', 'Bắt mọi lỗi trong create và trả 409: tag quá dài (P2000) thành "already exists".'], ['Letting <code>slug</code> through the patch of update — two notes can then share a slug the unique index would have refused at create time.', 'Để <code>slug</code> lọt qua patch của update — hai ghi chú có thể chung slug mà chỉ mục unique đã từ chối lúc tạo.']],
  gt: ['Every rule here was paid for by a measurement or an incident in chapter 7: the cursor and take + 1 by the 108 ms deep offset and the 41.7 ms count, omit by the 322 KB list, P2002 → 409 by the race that check-then-insert loses, the version by the lost update, tx by the orphan row. Routes did not change at all — that was the promise of lesson 5.5.', 'Mọi luật ở đây đã được trả giá bằng một phép đo hay một sự cố của chương 7: cursor và take + 1 bởi offset sâu 108 ms và count 41,7 ms, omit bởi danh sách 322 KB, P2002 → 409 bởi cuộc đua mà kiểm-rồi-thêm thua, version bởi mất cập nhật, tx bởi dòng mồ côi. Route không đổi gì cả — đó là lời hứa của bài 5.5.'],
  kn: ['Prisma', 'transactions', 'pagination', 'concurrency'],
  tns: [tn('service layer', 'tầng service'), tn('orphan row', 'dòng mồ côi', 'Dòng còn lại khi phần đi kèm đã hỏng.')],
  tro: `// provided — the AppError of lesson 5.4\n${APP_ERROR}\n`,
  dau: `function createNotesService(prisma) {
  // Write your solution here
  return {
    async list({ cursor, limit = 20 } = {}) {
      return { items: await prisma.note.findMany({ where: { authorId: 1 }, orderBy: { id: 'desc' }, take: limit }), nextCursor: null };
    },
    async create({ title, body = '', tags = [] }) {
      const note = await prisma.note.create({ data: { title, body, slug: title, authorId: 1 } });
      for (const name of tags) { const tag = await prisma.tag.upsert({ where: { name }, create: { name }, update: {} }); await prisma.noteTag.create({ data: { noteId: note.id, tagId: tag.id } }); }
      return note;
    },
    async update(id, version, patch) { await prisma.note.updateMany({ where: { id }, data: patch }); return prisma.note.findUnique({ where: { id } }); },
    async remove(id) { await prisma.note.delete({ where: { id } }); return true; },
  };
}
`,
  giai: createNotesService,
  chung: FAKE_DB,
  cases: [
    { goi: `await (async () => { const p = mkPrisma(); const s = createNotesService(p); const n = await s.create({ title: 'Learning Prisma!', tags: ['work', 'db'] }); return [n, counts(p), p.log]; })()`, moTa: ['create: one transaction, tags upserted and linked', 'create: một transaction, tag được upsert và liên kết'] },
    { goi: `await (async () => { const p = mkPrisma(); const s = createNotesService(p); await s.create({ title: 'Learning Prisma' }); return [await caught(s.create({ title: 'learning   prisma' })), counts(p)]; })()`, moTa: ['Same slug ⇒ 409 DUPLICATE, nothing left behind', 'Trùng slug ⇒ 409 DUPLICATE, không sót gì'] },
    { goi: `await (async () => { const p = mkPrisma(7); const s = createNotesService(p); const a = await s.list({ limit: 2 }); const b = await s.list({ limit: 2, cursor: a.nextCursor }); return [a, b.items.map((n) => n.id), p.log.filter((l) => /count/.test(l))]; })()`, moTa: ['list: author 1 only, cursor, no body, no count', 'list: chỉ tác giả 1, cursor, không body, không đếm'] },
    { goi: `await (async () => { const p = mkPrisma(2); const s = createNotesService(p); const a = await caught(s.update(1, 1, { body: 'A sửa' })); const b = await caught(s.update(1, 1, { body: 'B sửa' })); const c = await caught(s.update(99, 1, {})); return [a.version, b, c]; })()`, moTa: ['update: version check ⇒ 409, missing ⇒ 404', 'update: kiểm version ⇒ 409, không có ⇒ 404'] },
    { goi: `await (async () => { const p = mkPrisma(); const s = createNotesService(p); const r = await caught(s.create({ title: 'Tagged', tags: ['ok', 'fine', 'x'.repeat(60)] })); return [r, counts(p), p.log.slice(-2)]; })()`, an: true, moTa: ['A too-long tag rolls back the note AND the first tags', 'Tag quá dài hoàn tác cả ghi chú LẪN các tag đầu'] },
    { goi: `await (async () => { const p = mkPrisma(3); const s = createNotesService(p); await s.create({ title: 'One', tags: ['work'] }); await s.create({ title: 'Two', tags: ['work'] }); return [await s.remove(4), await s.remove(4), counts(p)]; })()`, an: true },
    { goi: `await (async () => { const p = mkPrisma(60); const s = createNotesService(p); const r = await s.list({ limit: 500 }); const n = await s.update(1, 1, { title: 'T', slug: 'hijack', version: 50, authorId: 2 }); return [r.items.length, r.nextCursor, p.log.filter((l) => /findMany/.test(l)), n]; })()`, an: true },
    { goi: `await (async () => { const p = mkPrisma(); const s = createNotesService(p); return [(await s.create({ title: '  --Hello, World!-- ' })).slug, (await s.create({ title: 'Chương 7: Prisma' })).slug]; })()`, an: true },
  ],
  saiMau: [
    createNotesService.toString().replace('const tag = await tx.tag.upsert', 'const tag = await prisma.tag.upsert'),
    createNotesService.toString().replace("if (err.code === 'P2002') throw conflict(err);", 'throw conflict(err);'),
    createNotesService.toString().replace("const { id: _i, version: _v, authorId: _a, slug: _s, ...safe } = patch;", 'const { id: _i, version: _v, ...safe } = patch;'),
  ],
});

/* ── Lab 7 · 3 — Một tệp deploy: migration + chỉ mục + truy vấn bảng tin ── */
const DB_LAB = notesDb({ slug: false, tag: false, them: `INSERT INTO "Note" (title, body, pinned, "authorId", "createdAt", "updatedAt")
SELECT 'Bulk ' || g, '', false, (g % 3) + 1, timestamp '2026-06-01' + g * interval '1 hour', timestamp '2026-06-01' + g * interval '1 hour' FROM generate_series(1, 1500) g;
ANALYZE;
${PLAN_ALL}` });
const LAB_SQL = `-- ── deploy of lab 7 ──────────────────────────────────────────────────────────
-- 1. add_slug, in the three steps that survive a table with rows
ALTER TABLE "Note" ADD COLUMN "slug" TEXT;
UPDATE "Note" SET "slug" = 'note-' || "id" WHERE "slug" IS NULL;
ALTER TABLE "Note" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX "Note_slug_key" ON "Note"("slug");

-- 2. the index for "newest notes of one author" (equality column first, then the sort column)
CREATE INDEX "Note_authorId_createdAt_idx" ON "Note"("authorId", "createdAt" DESC);

-- 3. the feed query the API runs: author 1, after the cursor ('2026-07-28 08:30', 4), newest first, 5 rows
SELECT id, slug, "createdAt"
FROM "Note"
WHERE "authorId" = 1 AND ("createdAt", id) < (timestamp '2026-07-28 08:30', 4)
ORDER BY "createdAt" DESC, id DESC
LIMIT 5;
`;
const D = '$q$';
const FEED_Q = `SELECT id FROM "Note" WHERE "authorId" = 1 ORDER BY "createdAt" DESC LIMIT 20`;
const L3 = sqlBai({
  ten: 'Lab 7 · 3 — One deploy file: the slug migration, the feed index, and the feed query', kho: 'HARD', phut: 30, diem: 40, dangBai: 'lab',
  en: `<p>The production database of the lab: <code>"Note"</code> has <b>1,510 rows</b> (10 sample notes + 1,500 bulk notes of authors 1–3), no <code>slug</code> column and no index besides the primary key. Write one file that the deploy runs, in this order:</p>
<ol><li><b>add_slug</b> — <code>"slug" TEXT</code>, backfilled as <code>'note-' || "id"</code>, then <code>NOT NULL</code>, then the unique index <code>"Note_slug_key"</code>.</li>
<li><b>The feed index</b> — <code>"Note_authorId_createdAt_idx"</code> on <code>("authorId", "createdAt" DESC)</code>.</li>
<li><b>The feed query</b> (last statement of the file) — for author <b>1</b>, the 5 notes right after the cursor <code>("createdAt" = '2026-07-28 08:30', id = 4)</code>, newest first, columns <code>id, slug, "createdAt"</code>, using a row-value comparison and <code>ORDER BY "createdAt" DESC, id DESC</code>.</li></ol>
<p>The grader checks the data and constraints after your file, the plan of the feed query (index, no Sort) with <code>enable_seqscan = off</code>, and the result of your final SELECT — also on different data (hidden).</p>`,
  vi: `<p>CSDL production của lab: <code>"Note"</code> có <b>1.510 dòng</b> (10 ghi chú mẫu + 1.500 ghi chú hàng loạt của tác giả 1–3), chưa có cột <code>slug</code> và không có chỉ mục nào ngoài khoá chính. Viết một tệp mà lần deploy chạy, theo thứ tự:</p>
<ol><li><b>add_slug</b> — <code>"slug" TEXT</code>, điền bằng <code>'note-' || "id"</code>, rồi <code>NOT NULL</code>, rồi chỉ mục unique <code>"Note_slug_key"</code>.</li>
<li><b>Chỉ mục bảng tin</b> — <code>"Note_authorId_createdAt_idx"</code> trên <code>("authorId", "createdAt" DESC)</code>.</li>
<li><b>Truy vấn bảng tin</b> (câu cuối của tệp) — với tác giả <b>1</b>, 5 ghi chú ngay sau cursor <code>("createdAt" = '2026-07-28 08:30', id = 4)</code>, mới nhất trước, các cột <code>id, slug, "createdAt"</code>, dùng so sánh bộ giá trị và <code>ORDER BY "createdAt" DESC, id DESC</code>.</li></ol>
<p>Máy chấm kiểm dữ liệu và ràng buộc sau tệp của bạn, kế hoạch của truy vấn bảng tin (chỉ mục, không Sort) với <code>enable_seqscan = off</code>, và kết quả câu SELECT cuối — cả trên dữ liệu khác (ẩn).</p>`,
  yc: [['No BEGIN/COMMIT — the grader runs your file in a transaction, like migrate deploy.', 'Không BEGIN/COMMIT — máy chấm chạy tệp trong transaction, như migrate deploy.'], ['The feed query is the LAST statement.', 'Truy vấn bảng tin là câu CUỐI.']],
  giai: LAB_SQL,
  khoi: `-- deploy of lab 7 — write the three parts here\nALTER TABLE "Note" ADD COLUMN "slug" TEXT NOT NULL;\nCREATE UNIQUE INDEX "Note_slug_key" ON "Note"("slug");\nSELECT id, slug, "createdAt" FROM "Note" WHERE "authorId" = 1 AND "createdAt" < '2026-07-28 08:30' ORDER BY "createdAt" DESC LIMIT 5;\n`,
  csdl: DB_LAB, ld: { en: luocDoNotes({ slug: false, tag: false }).en + '<p>Plus 1,500 bulk notes (“Bulk 1” … “Bulk 1500”, authors 1–3, one per hour from 2026-06-01). <code>ANALYZE</code> already run.</p>', vi: luocDoNotes({ slug: false, tag: false }).vi + '<p>Thêm 1.500 ghi chú hàng loạt ("Bulk 1" … "Bulk 1500", tác giả 1–3, mỗi giờ một cái từ 2026-06-01). Đã chạy <code>ANALYZE</code>.</p>' },
  tuy: { timeoutMs: 12000 },
  kiem: [
    sau(['Every row has slug = note-ID, and it is NOT NULL', 'Mọi dòng có slug = note-ID, và NOT NULL'], `SELECT count(*) FILTER (WHERE slug = 'note-' || id) AS ok, count(*) AS total, (SELECT is_nullable FROM information_schema.columns WHERE table_name = 'Note' AND column_name = 'slug') AS nullable FROM "Note"`),
    chan(['A duplicate slug is refused', 'slug trùng bị từ chối'], `INSERT INTO "Note" (title, slug, "authorId", "createdAt", "updatedAt") VALUES ('dup', 'note-1', 1, now(), now())`, '23505'),
    sau(['The feed index exists with the right column order', 'Chỉ mục bảng tin có đúng thứ tự cột'], `SELECT indexname FROM pg_indexes WHERE tablename = 'Note' AND indexdef ~ '\\("authorId", "createdAt"( DESC)?\\)'`),
    sau(['The feed query uses the index and needs no Sort', 'Truy vấn bảng tin dùng chỉ mục và không cần Sort'], `SET LOCAL enable_seqscan = off; SELECT position('Sort' in plan_nodes(${D}${FEED_Q}${D})) = 0 AS no_sort, position('Index Cond' in plan_text(${D}${FEED_Q}${D})) > 0 AS index_cond`),
    kq(['The 5 notes after the cursor', '5 ghi chú sau cursor'], { thuTu: true }),
    kqAn(['Hidden: a note of author 1 at the cursor’s exact time with a lower id', 'Ẩn: một ghi chú của tác giả 1 đúng thời điểm cursor với id nhỏ hơn'], `UPDATE "Note" SET "createdAt" = '2026-07-28 08:30' WHERE id = 2;`, { thuTu: true }),
    kqAn(['Hidden: notes of other authors never appear', 'Ẩn: ghi chú của tác giả khác không bao giờ xuất hiện'], `INSERT INTO "Note" (title, body, "authorId", "createdAt", "updatedAt") VALUES ('Other author', '', 2, '2026-07-28 07:00', now()), ('Mine', '', 1, '2026-07-28 07:30', now()), ('Mine too', '', 1, '2026-07-28 08:31', now());`, { thuTu: true }),
  ],
  sai: [
    LAB_SQL.replace(`AND ("createdAt", id) < (timestamp '2026-07-28 08:30', 4)`, `AND "createdAt" < timestamp '2026-07-28 08:30'`),
    LAB_SQL.replace(`CREATE INDEX "Note_authorId_createdAt_idx" ON "Note"("authorId", "createdAt" DESC);`, `CREATE INDEX "Note_authorId_createdAt_idx" ON "Note"("authorId");`),
    LAB_SQL.replace(`WHERE "authorId" = 1 AND `, 'WHERE '),
  ],
  goiY: [['Part 1 is exercise 7.2 · 2, part 2 is 7.5 · 3, part 3 is 7.6 · 6 plus <code>"authorId" = 1</code>.', 'Phần 1 là bài 7.2 · 2, phần 2 là 7.5 · 3, phần 3 là 7.6 · 6 thêm <code>"authorId" = 1</code>.'], ['The feed query must be the last statement — the result check reads the last SELECT.', 'Truy vấn bảng tin phải là câu cuối — kiểm kết quả đọc câu SELECT cuối cùng.']],
  loi: [['The generated one-line add_slug: 23502 on 1,510 rows, and the whole deploy file stops there.', 'add_slug một dòng do máy sinh: 23502 trên 1.510 dòng, và cả tệp deploy dừng tại đó.'], ['An index on "authorId" only: the feed is found but sorted every time (Bitmap scan + Sort).', 'Chỉ mục chỉ trên "authorId": bảng tin tìm được nhưng lần nào cũng phải sắp (Bitmap scan + Sort).'], ['Forgetting the author filter in the feed query — every user sees every note (chapter 8 makes that an IDOR).', 'Quên lọc tác giả trong truy vấn bảng tin — mọi người thấy mọi ghi chú (chương 8 gọi đó là IDOR).']],
  gt: ['A deploy is migrations plus the queries that will run on the new schema — and each part has a failure mode the chapter measured: the NOT NULL that dies on existing rows, the index whose column order decides whether a Sort survives, and the cursor that skips rows on a tie. Testing all three against a copy of production-sized data is the rehearsal the lesson asks for.', 'Một lần deploy là migration cộng các truy vấn sẽ chạy trên lược đồ mới — và mỗi phần có một kiểu hỏng mà chương đã đo: NOT NULL chết trên dòng có sẵn, chỉ mục mà thứ tự cột quyết định Sort có còn không, và cursor bỏ sót dòng khi có hoà. Kiểm cả ba trên bản sao dữ liệu cỡ production chính là buổi diễn tập mà bài yêu cầu.'],
  tns: [tn('deploy', 'triển khai'), tn('rehearsal', 'diễn tập')],
  kn: ['migrations', 'indexes', 'cursor pagination'],
});

export default modul('nodejs-7-lab-notes-postgres', 'Lab 7 — The Notes API on PostgreSQL, deployed safely', [L1, L2, L3], 'nodejs-7-6-hop-dong-api-voi-du-lieu-that');
