/**
 * node-07-3 — Node.js · Chapter 7 · Lesson 7.3 "CRUD, transactions, and swapping the Notes API onto PostgreSQL" (slide EN, kiểu FU, đợt 6 — 01/11/2026). HAI tập:
 *   7.3a (node-7-3)   = slide 1–17: lời hứa của 5.5 · năm thao tác (thật: null / P2025 / OrThrow / count 0) · bảng phương thức · null hay ngoại lệ (service dịch P2025) ·
 *                       throw err không trang trí · service viết lại ($transaction([findMany, count])) · bản diff trung thực (thật: 10 dòng, 5 async + 5 await) ·
 *                       Express 5 vs 4 · chạy thử API thật (201 + Location, list, q, 404, PATCH, DELETE 204 rồi 404, 422) · bài tập remove · tự kiểm · tóm tắt
 *   7.3b (node-7-3-2) = slide 18–32: giao dịch chứng minh bằng chạy thật (không tx ⇒ nửa vời; tx ⇒ cuộn ngược, P2000) · khi nào cần · hai dạng ·
 *                       bug prisma thay vì tx (thật: dòng via prisma còn lại) · hết giờ 5 s (P2028 thật) · tx giữ kết nối: người khác chờ 2813 ms vs 3 ms (thật) ·
 *                       createMany 140 ms vs 1289 ms (thật) · nguyên tử ≠ tuần tự (thật: 2 người mua, chỉ trừ 1; decrement ⇒ đúng) · bài tập · tự kiểm · tóm tắt
 * Nguồn: s07-prisma.mjs › nodejs-7-3-crud-transaction. Output THẬT: that/c7/{crud,router-diff,tx-half,tx-wrong,tx-timeout,tx-hold,create-many,atomic} + that/c7notes/*.
 * Số khác web (máy khác): createMany 140 ms (web 175 ms) · bản diff 10 dòng (web 11: web đổi cả tên tệp service, ở đây giữ tên).
 */
import { lamDeck, two, three, box, kw, bang, cards, flow, cot, tep, gay, P, Q, J, JW, T } from './_c7-chung.mjs';
import { ra, ma } from './_node-chung.mjs';

export const deck = { key: 'node-07-3', code: 'NODE 7.3', title: 'CRUD, transactions, and the Notes API on PostgreSQL', sub: 'Node.js — from zero to production' };
const CAM = '#e08a1e', NODE = '#15803d', LAM = '#336791', DO = '#b0281a', TIM = '#7c3aed';
const G = (ten, a, b, n = 104) => gay(ra(ten, a, b), n).replace(/\n+$/, '');
const TT = (ten, a, b, title, o = {}) => T(G(ten, a, b, o.n), title, o);
/** curl thật, bỏ cờ -s/-w cho gọn (kết quả giữ nguyên). */
const C = (a, b, n = 104) => gay(ra('c7notes/index', a, b).replace(/curl -s -w '[^']*' /g, 'curl ').replace(/curl -s /g, 'curl ').replace(/curl -si /g, 'curl -i ').replace(/ localhost:4370/g, ' :4370').replace(/'localhost:4370/g, "':4370").replace(/ \| grep -v [^\n]*/g, ''), n);

export const slides = lamDeck({ chuong: 'Chapter 7 — PostgreSQL & Prisma', bai: '7.3' }, [
  /* ───── 7.3a (node-7-3): slide 1–17 ───── */
  { cover: true, t: 'CRUD, transactions,<br>and the Notes API on PostgreSQL', sub: 'Lesson 5.5 made a promise: swap the storage, and the HTTP layer never notices. Time to collect.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: two(
    box('Part 1 (this video)', '<ul><li>The five operations, and what "not found" looks like</li><li>null or an exception: choose on purpose</li><li>The service, rewritten</li><li>The honest diff, then the real API</li></ul>', 'xanh'),
    box('Part 2 (next video)', '<ul><li>Transactions, proven not defined</li><li>The silent tx bug</li><li>A transaction holds a connection</li><li>createMany, and what a transaction does not promise</li></ul>', 'lam')) +
    box('Starting point', 'The Notes API of chapter 5 (router, service, error handler) and the database of lesson 7.2: User, Note, Tag, NoteTag.', 'cam') },

  { t: 'The promise from lesson 5.5', to: true, giua: true, body: flow([
    { t: 'route', s: 'HTTP in, HTTP out', mau: LAM }, { t: 'service', s: 'business rules', mau: NODE }, { t: 'storage', s: 'Map ⇒ PostgreSQL', mau: TIM },
  ], { h: 150, fs: 24 }) + two(
    box('What should change', 'Only the service file: same function names, same return shapes, PostgreSQL inside.', 'xanh'),
    box('What we will measure', 'How many lines of the router really change. Not "one file": we count, with diff.', 'cam')) +
    box('The chapter 5 files', '<code class="i">src/routes/notes.routes.mjs</code> · <code class="i">src/services/notes.service.mjs</code> · <code class="i">src/middleware/errors.mjs</code> · <code class="i">src/app.mjs</code> — plus the new <code class="i">src/db.mjs</code> from lesson 7.1.', 'lam') },

  { t: 'The five operations', to: true, giua: true, body: JW(ma('c7/crud', 6, 20), 100, [1, 3, 4, 9, 10, 11]) },

  { t: 'What "not found" looks like for each', to: true, giua: true, body: TT('c7/crud', 1, 9, 'node crud.mjs · real', { hl: [4, 7, 8, 9, 10], n: 118 }) +
    two(box('null', '<code class="i">findUnique</code> returns <b>null</b> when no row matches.', 'lam'),
      box('P2025', '<code class="i">update</code>, <code class="i">delete</code>, <code class="i">findUniqueOrThrow</code> throw <b>P2025</b>; <code class="i">updateMany</code> just returns <b>{ count: 0 }</b>.', 'cam')) },

  { t: 'Pick the method for the job', to: true, giua: true, body: bang(['method', 'when'], [
    ['<code class="i">findUnique</code> / <code class="i">findFirst</code>', 'findUnique only takes unique fields, so it uses the index directly; findFirst takes any filter and adds LIMIT 1'],
    ['<code class="i">update</code> / <code class="i">updateMany</code>', 'update targets one row by a unique key and throws if missing; updateMany takes any filter and returns { count } — the trick of lesson 7.6'],
    ['<code class="i">upsert</code>', 'insert, or update if the unique key exists: one round trip, the database decides'],
    ['<code class="i">createMany</code>', 'one INSERT with many rows (part 2 measures it)'],
    ['<code class="i">…OrThrow</code>', 'turns "not found" into an exception, which fits a central error handler (lesson 5.4)'],
  ], { co: 23 }) + box('Default choice', 'findUnique for "by id", findMany with take for lists, update/delete for one row, updateMany when you need the count.', 'xanh') },

  { t: 'null or an exception: choose on purpose', to: true, giua: true, body: J(tep('c7notes/notes.service.mjs', 29, 36), { hl: [5], sm: false }) + box('remove(id) has the same shape', 'catch P2025 ⇒ return false (the route turns that into a 404).', 'xanh') +
    box('Translate once, in the service', 'The chapter 5 routes expect <b>null</b> for "not found" and a <b>boolean</b> from remove. Prisma throws P2025, so the service translates — and the routes keep their shape.', 'lam') },

  { t: 'That throw err is not decoration', to: true, giua: true, body: two(
    J("} catch (err) {\n  return null;            // swallow everything\n}", { sm: false }),
    J("} catch (err) {\n  if (err.code === 'P2025') return null;\n  throw err;              // a real failure goes on\n}", { sm: false })) +
    two(box('Swallow everything', 'A dead database becomes a tidy 404. You spend an afternoon hunting notes that "disappeared" but never did.', 'do2'),
      box('Translate only what you understand', 'Everything else reaches the error handler of lesson 5.4 and becomes a 500 with a log line.', 'xanh')) +
    box('Same rule for every external call', 'Catch the error you expect, by its code. Let the rest travel.', 'cam') },

  { t: 'The service, rewritten', to: true, giua: true, body: J(tep('c7notes/notes.service.mjs', 1, 17), { hl: [11, 12, 13, 14, 15] }) + box('AUTHOR_ID = 1 for now', 'Chapter 8 swaps it for the logged-in user. get, create, update, remove follow in the same file.', 'lam') },

  { t: 'Why list and count go in one $transaction', to: true, giua: true, body: J(tep('c7notes/notes.service.mjs', 11, 15), { sm: false }) + two(
    box('Batch form: $transaction([a, b])', 'Both queries are sent together and run inside one transaction, so <b>total</b> describes the same moment as the page.', 'xanh'),
    box('Two separate awaits', 'A write can land in between: total says 41 while you see 40 items. Forever.', 'do2')) +
    box('Lesson 6.4 said', 'total is not free. Lesson 7.6 measures it on a million rows, and drops it.', 'lam') },

  { t: 'The honest diff', to: true, giua: true, body: TT('c7/router-diff', 5, 27, 'diff chapter 5 router vs chapter 7 router (44 lines each) · real', { n: 118 }) },

  { t: 'What changed, counted', to: true, giua: true, body: bang(['changed', 'lines'], [
    ['handlers that got <code class="i">async</code>', '5'], ['service calls that got <code class="i">await</code>', '5'],
    ['status codes, paths, Location, validation, 404 branches, error handler', '<b>0</b>'],
  ], { co: 24, hl: [2] }) + two(
    box('The promise, restated honestly', 'One file rewritten (the service), and two keywords per handler — because a database call is asynchronous and a Map is not.', 'cam'),
    box('Express 5 matters here', 'A rejected promise in an async handler reaches your error handler. Express 4 does not do that: lesson 5.4 showed the request hanging, or the server dying.', 'lam')) },

  { t: 'Run it: every response copied from the real server', to: true, giua: true, body: T(C(1, 13, 118), 'curl against the chapter 7 server · real (curl flags -s/-w trimmed)', { hl: [2, 3] }) },

  { t: 'The error paths are unchanged', to: true, giua: true, body: T(C(14, 23, 118), 'same server, the unhappy paths · real', { hl: [2, 6, 8, 10] }) +
    two(box('Compare with lesson 5.5', 'Same status codes, same error shape. From the client\'s side nothing happened — except the data is still there tomorrow.', 'xanh'),
      box('updatedAt moved by itself on PATCH', 'That is @updatedAt doing its job.', 'lam')) },

  { t: 'Exercise: write get with findUniqueOrThrow', to: true, giua: true, body: box('Your task', 'Rewrite <code class="i">get(id)</code> using <code class="i">findUniqueOrThrow</code>. The route still expects <b>null</b> for "not found". What must the service do, and what must it never do?', '') +
    box('Hint', 'Same shape as update: catch, translate one code, rethrow the rest.', 'lam') + J(tep('c7notes/notes.service.mjs', 19, 21)) +
    `<div data-k="dapan">${box('Answer', 'try { return await prisma.note.findUniqueOrThrow({ where: { id } }); } catch (err) { if (err.code === \'P2025\') return null; throw err; } — never a bare catch that returns null for every error.', 'xanh')}</div>` },

  { t: 'Self-check (part 1)', to: true, giua: true, body: `<ol>
<li>findUnique on a missing id returns what? And update?</li>
<li>Why does the service rethrow everything except P2025?</li>
<li>Why put findMany and count in one <code class="i">$transaction([…])</code>?</li>
<li>How many router lines changed, and why at all?</li>
</ol>
${box('Try first', 'Pause and answer before you look.', 'lam')}
<div data-k="dapan">${box('Answers', '1. null; update throws P2025. &nbsp;2. So a real failure becomes a 500, not a fake 404. &nbsp;3. So total and the page describe the same moment. &nbsp;4. Ten: async + await, because a database call is asynchronous.', 'xanh')}</div>` },

  { t: 'Summary (part 1)', to: true, giua: true, body: `<ul>
<li>create · findUnique · findMany · update · delete; missing rows: null, P2025, or { count: 0 }</li>
<li>The service translates P2025 to the shape routes expect, and rethrows everything else</li>
<li>List + count in one <code class="i">$transaction([…])</code>: consistent total</li>
<li>Router diff: 10 lines (5 async, 5 await); status codes, paths, errors untouched</li>
<li>The real API answers exactly like chapter 5 — and keeps the data</li>
</ul>` + box('Next', 'Part 2: transactions, proven with real failures; and what they do not promise.', 'lam') },

  /* ───── 7.3b (node-7-3-2): slide 18–32 ───── */
  { t: 'Transactions: prove it, do not define it', to: true, giua: true, body: cards([
    ['🏦 Everyday example', 'A bank transfer: take 100 from A, add 100 to B. If the second step fails, the first must not stay.'],
    ['🧪 Our experiment', 'Create a note, then a tag for it. The tag name is 60 characters; the column is VarChar(40), so the second write fails.'],
    ['❓ The question', 'After the failure, does the note exist?'],
  ], 3) + box('Transaction (giao dịch)', 'a group of writes that happen all together or not at all.', 'lam') +
    box('If you took PostgreSQL lesson 11.1 or DBI202 lesson 8.3', 'You ran BEGIN / COMMIT / ROLLBACK by hand. Here Prisma writes those for you.', 'xanh') },

  { t: 'Without a transaction: half-written data', to: true, giua: true, body: J(ma('c7/tx-half', 9, 13), { hl: [2, 3], sm: false }) + TT('c7/tx-half', 2, 5, 'node tx-half.mjs · real', { hl: [4], n: 118, sm: false }) +
    box('The note was written, the tag was not', 'P2000: the value is too long for the column. Your data is now half-done.', 'do2') },

  { t: 'Inside $transaction: rolled back', to: true, giua: true, body: J(ma('c7/tx-half', 17, 22), { hl: [2, 3, 4], sm: false }) + TT('c7/tx-half', 6, 9, 'same experiment, inside $transaction · real', { hl: [4], sm: false }) +
    box('Note count stays 1', 'The note B was created inside the transaction, then removed with it when the tag failed. No junk row.', 'xanh') + box('Same error, different outcome', 'The only change is where the writes run: on tx, inside $transaction.', 'lam') },

  { t: 'When do you need one?', to: true, giua: true, body: box('The rule', 'If failing halfway leaves <b>wrong</b> data — not just missing data — you need a transaction.', 'cam') + cards([
    ['💸 Money', 'Taken from one account, not yet added to the other.'],
    ['🧾 Orders', 'An order created with no order lines.'],
    ['👤 Sign-up', 'A user created without their default settings row.'],
  ], 3) + box('Ask before you write the code', 'Imagine the process dies between the two writes. Is the data now wrong, or only incomplete?', 'cam') + box('Not needed', 'A single write is already atomic on its own. One INSERT, one UPDATE: no $transaction needed. Missing data you can retry; wrong data you have to find and repair.', 'lam') },

  { t: 'Two forms', to: true, giua: true, body: bang(['form', 'what it is', 'limit'], [
    ['<code class="i">$transaction([a, b, c])</code>', 'batch: independent queries, sent together, one transaction', 'b cannot use the result of a'],
    ['<code class="i">$transaction(async (tx) => …)</code>', 'interactive: your logic between queries', 'every query must use <b>tx</b>'],
  ], { co: 26 }) + two(box('Batch', 'Used in list(): findMany + count.', 'xanh'), box('Interactive', 'Used when step 2 depends on step 1: read stock, then decide.', 'lam')) +
    box('Nested writes are transactions too', '<code class="i">user.create({ data: { …, notes: { create: [...] } } })</code> runs as one implicit transaction (lesson 7.4).', 'cam') },

  { t: 'The silent bug: prisma instead of tx', to: true, giua: true, body: JW(ma('c7/tx-wrong', 6, 12), 100, [4], { sm: false }) + TT('c7/tx-wrong', 2, 3, 'node tx-wrong.mjs · real', { hl: [2], sm: false }) +
    box('No error, no warning', 'The line using <code class="i">prisma</code> committed on its own connection and did not roll back. Grep your code for <b>prisma.</b> inside a $transaction callback: one of the most valuable greps you can run.', 'do2') },

  { t: 'A transaction has a time limit', to: true, giua: true, body: JW(ma('c7/tx-timeout', 10, 14), 92, [3]) + TT('c7/tx-timeout', 2, 5, 'node tx-timeout.mjs · real', { hl: [2, 3], n: 112 }) +
    box('Raising the timeout works — and is usually the wrong fix', 'The real question is why an HTTP call sits inside a transaction at all. Next slide.', 'cam') },

  { t: 'A transaction holds a connection the whole time', to: true, giua: true, body: J(ma('c7/tx-hold', 15, 30), { hl: [4, 12] }) + TT('c7/tx-hold', 2, 3, 'node tx-hold.mjs · pool of 10 · real', { hl: [1, 2], sm: false }) },

  { t: 'Why the other user waited 2.8 seconds', to: true, giua: true, body: flow([
    { t: '10 checkouts', s: 'each opens a tx', mau: LAM }, { t: '10 pool seats', s: 'all taken', mau: CAM }, { t: 'slow API, 3 s', s: 'inside the tx', mau: DO }, { t: 'a 1 ms GET', s: 'waits in line', mau: TIM },
  ], { h: 150, fs: 21 }) + two(
    box('Looks like "the database is dead"', 'PostgreSQL is idle. The pool is the bottleneck: every seat is held hostage by a transaction waiting on the network.', 'do2'),
    box('The fix: call HTTP first', 'Then open the transaction around the writes only. Same work, the other user waited 3 ms.', 'xanh')) +
    box('This website', 'Never wraps calls to R2 or AI providers in a transaction: a 5-second upload inside one is a pool seat held hostage.', 'lam') },

  { t: 'createMany: where the money is', to: true, giua: true, body: J(ma('c7/create-many', 14, 23), { hl: [2, 3, 8, 9] }) + TT('c7/create-many', 2, 4, 'node create-many.mjs · real', { hl: [1, 2], sm: false }) +
    box('About 9 times faster', 'One INSERT with a thousand rows of values, instead of a thousand round trips. Lesson 7.4 measures what one round trip costs.', 'xanh') },

  { t: 'What a transaction does NOT promise', to: true, giua: true, body: JW(ma('c7/atomic', 8, 21), 112, [3, 5, 13]) + TT('c7/atomic', 2, 6, 'node atomic.mjs · two buyers at once · real', { hl: [4, 5] }) },

  { t: 'Atomic is not serial', to: true, giua: true, body: three(
    box('1 · All or nothing', 'Two writes in a transaction both land or neither does.', 'xanh'),
    box('2 · It does NOT queue concurrent work', 'Under Read Committed both buyers read 10 and both wrote 9: the second wins silently.', 'do2'),
    box('3 · It holds locks while open', 'So keep it short; move I/O out.', 'cam')) +
    two(box('The fixes', 'Do the math in the database (<code class="i">{ decrement: 1 }</code> ⇒ 8, correct), a version column (lesson 7.6), or SELECT … FOR UPDATE for real queues.', 'lam'),
      box('If you took PostgreSQL lesson 11.4', 'You met this exact "lost update" with two psql sessions, and fixed it with FOR UPDATE.', 'xanh')) },

  { t: 'Exercise: an order and its lines', to: true, giua: true, body: box('Your task', 'POST /orders must (1) call a payment API (2 s), (2) create the order, (3) create its 3 lines. Which steps go in a transaction, which form, and where does the payment call go?', '') +
    box('Hint', 'Ask: what would be wrong data if we stopped halfway? And what holds a pool seat?', 'lam') + box('Measured in this lesson', 'tx-half: half-written data without a transaction · tx-hold: another user waited 2,813 ms.', 'cam') +
    `<div data-k="dapan">${box('Answer', 'Payment first, outside. Then one transaction around the order + its lines (interactive form if the lines need the order id; or nested create in one call). Never the payment call inside the transaction.', 'xanh')}</div>` },

  { t: 'Self-check (part 2)', to: true, giua: true, body: `<ol>
<li>Without a transaction, what was left after the tag failed?</li>
<li>What happens to a query that uses <code class="i">prisma</code> inside a $transaction callback?</li>
<li>Why did another user wait 2.8 s in tx-hold?</li>
<li>Does a transaction stop two buyers from both reading 10?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. A note with no tag: half-written data. &nbsp;2. It commits on its own connection and is not rolled back. &nbsp;3. Ten transactions held all ten pool seats while waiting on HTTP. &nbsp;4. No: atomic is not serial; use decrement, a version column or FOR UPDATE.', 'xanh')}</div>` },

  { t: 'Summary (part 2)', to: true, giua: true, body: `<ul>
<li>Without a transaction: half-written data; with $transaction: rolled back, measured</li>
<li>Two forms: batch [a, b] and interactive (tx) ⇒ use <b>tx</b>, never prisma, inside</li>
<li>Default timeout 5 s (P2028); a transaction holds a pool seat — HTTP first, then a short transaction</li>
<li>createMany: 1,000 notes in 140 ms vs 1,289 ms one by one</li>
<li>Atomic is not serial: do the math in SQL, or use a version column (7.6)</li>
</ul>` + box('Next: lesson 7.4', 'Relations, and the N+1 problem, counted query by query.', 'lam') },
]);
