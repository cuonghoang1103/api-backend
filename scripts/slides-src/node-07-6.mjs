/**
 * node-07-6 — Node.js · Chapter 7 · Lesson 7.6 "Keeping the chapter 6 API contract on real data" (slide EN, kiểu FU, đợt 6 — 01/11/2026). MỘT deck, HAI tập:
 *   7.6a (node-7-6)   = phân trang qua Prisma trên 1.000.000 dòng (thật: skip 0 / 100000 / 900000 = 1,1 / 20,6 / 210,3 ms, con trỏ 0,7 ms, count 51,1 ms) · mã con trỏ ·
 *                       tie-breaker, offset vẫn ổn khi nào, bỏ total · P2002 ⇒ 409 (thật: meta ở Prisma 7.10 là constraint.index, KHÔNG có fields; message nêu tên chỉ mục) ·
 *                       dịch đúng một lần (thật) · "kiểm rồi chèn" đua (thật: P2002 ⇒ 500 nếu không bắt) · bài tập · tự kiểm · tóm tắt
 *   7.6b (node-7-6-2) = mất bản cập nhật (thật) + cột version (thật: 1 / 0 dòng ⇒ 409) · lạc quan vs bi quan · cùng hình dạng ETag 6.5 · SQL thô: nối chuỗi lộ 1.000.003 dòng (thật) ·
 *                       BigInt + pg_sleep void (thật) · hình dạng cuối của endpoint danh sách (thật: take+1, omit body, 3 trang) · website · bài tập · tự kiểm · tóm tắt
 * Nguồn: s07-prisma.mjs › nodejs-7-6-hop-dong-api-voi-du-lieu-that. Output THẬT: that/c7/{page-cost,p2002,p2002-409,race-insert,version,raw-sql,list-final}.
 * Khác web CÓ THẬT (đã sửa bài web): Prisma 7.10 + adapter-pg báo constraint.index (tên chỉ mục) chứ không phải constraint.fields; message "on the constraint: `Note_slug_key`".
 * Số khác web (máy khác): 1,1 / 20,6 / 210,3 / 0,7 / 51,1 ms (web 1,0 / 11,7 / 108,6 (skip 700000) / 0,6 / 41,7) · 1.000.003 dòng (web 751.002).
 */
import { lamDeck, two, three, box, kw, bang, cards, flow, cot, tep, gay, P, Q, J, JW, T, so } from './_c7-chung.mjs';
import { ra, ma } from './_node-chung.mjs';

export const deck = { key: 'node-07-6', code: 'NODE 7.6', title: 'Keeping the API contract on real data', sub: 'Node.js — from zero to production' };
const CAM = '#e08a1e', NODE = '#15803d', LAM = '#336791', DO = '#b0281a', TIM = '#7c3aed';
const G = (ten, a, b, n = 112) => gay(ra(ten, a, b), n).replace(/\n+$/, '');
const TT = (ten, a, b, title, o = {}) => T(G(ten, a, b, o.n), title, o);
const pc = (re) => Number(ra('c7/page-cost').split('\n').find((l) => re.test(l)).match(/([\d.]+)ms/)[1]);

/** Thanh: thời gian một trang qua Prisma (THẬT). */
function thanhTrang() {
  const rows = [['skip 0', pc(/^skip: 0,/), LAM], ['skip 100,000', pc(/^skip: 100000/), CAM], ['skip 900,000', pc(/^skip: 900000/), DO], ['cursor id > 900,000', pc(/^where id > cursor/), NODE], ['count() of the table', pc(/^count\(\)/), TIM]];
  const w = 1110, h = 300, x0 = 290, wMax = 640, max = rows[2][1];
  let s = `<svg data-k="trang" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial">`;
  rows.forEach(([n, v, m], i) => {
    const y = 6 + i * 54, bw = Math.max(8, (v / max) * wMax);
    s += `<text x="${x0 - 14}" y="${y + 30}" text-anchor="end" font-size="21" font-weight="700" fill="#333" font-family="monospace">${n}</text>`;
    s += `<rect x="${x0}" y="${y + 8}" width="${bw}" height="32" rx="6" fill="${m}"/>`;
    s += `<text x="${x0 + bw + 12}" y="${y + 32}" font-size="22" font-weight="800" fill="#333">${v} ms</text>`;
  });
  return s + `<text x="${x0}" y="${h - 4}" font-size="15" fill="#777">20 rows per page · 1,000,000 notes · through Prisma · median of 7 · real</text></svg>`;
}

export const slides = lamDeck({ chuong: 'Chapter 7 — PostgreSQL & Prisma', bai: '7.6' }, [
  /* ───── 7.6a (node-7-6) ───── */
  { cover: true, t: 'Keeping the chapter 6 contract<br>on real data', sub: 'Pagination, 409 instead of 500, refusing stale updates — each a two-line change, and a big number.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: two(
    box('Part 1 (this video)', '<ul><li>Pagination: the numbers that decide the design</li><li>Cursor code, tie-breakers, when offset is fine</li><li>A unique violation becomes 409, not 500</li><li>Why "check, then insert" is wrong</li></ul>', 'xanh'),
    box('Part 2 (next video)', '<ul><li>Lost updates, stopped by a version column</li><li>Raw SQL, and one line that leaks the table</li><li>The final shape of the list endpoint</li></ul>', 'lam')) +
    box('Chapter 6 made promises on a Map', 'Lesson 6.4 (pagination), 6.2 (409), 6.5 (stale updates, ETag). Here each one runs on 1,000,000 real rows.', 'cam') },

  { t: 'Pagination: the numbers that decide the design', to: true, giua: true, body: thanhTrang() + TT('c7/page-cost', 2, 6, 'node page-cost.mjs · real', { hl: [3, 4] }) },

  { t: 'OFFSET is not a jump', to: true, giua: true, body: two(
    box('skip: 900000', 'The database still produces every skipped row, then throws it away. Page 45,000 costs about 210 ms to return 20 rows; page 1 costs about 1 ms.', 'do2'),
    box('where id > cursor', 'Reads from the index right at the position you give, and stops after 20 rows. Same cost on page 2 or page 45,000.', 'xanh')) +
    box(`deep offset ${pc(/^skip: 900000/)} ms · cursor ${pc(/^where id > cursor/)} ms`, `about ${Math.round(pc(/^skip: 900000/) / pc(/^where id > cursor/))} times faster. "The deeper I scroll, the slower the app" is a real, reproducible complaint.`, 'cam') +
    box('Lesson 6.4 already proved the other half', 'With offset, a row inserted between two page loads shifts the window: the client sees a record twice. A cursor is a position in the data, so inserts cannot move it.', 'lam') },

  { t: 'The cursor, in Prisma', to: true, giua: true, body: J("// page 1\nconst page = await prisma.note.findMany({\n  where: { authorId }, orderBy: { id: 'desc' }, take: 20,\n});\nconst nextCursor = page.length === 20 ? page[19].id : null;\n\n// next page — the client sends the cursor back\nawait prisma.note.findMany({\n  where: { authorId, id: { lt: cursor } },\n  orderBy: { id: 'desc' }, take: 20,\n});", { sm: false, hl: [9] }) +
    three(box('cursor: { id }, skip: 1', 'Prisma\'s own cursor option: same idea, shorter syntax. The explicit where is easier to reason about and to index.', 'lam'),
      box('Sorting by a non-unique column', 'createdAt alone breaks on ties: sort by [createdAt desc, id desc] and put both in the cursor.', 'cam'),
      box('Offset is still fine', 'Admin tables with page numbers, small result sets, anything under a few thousand rows.', 'xanh')) },

  { t: 'Drop the total', to: true, giua: true, body: two(
    box(`count() of the table: ${pc(/^count\(\)/)} ms`, 'If the API keeps <code class="i">total</code>, every page pays this — usually more than the page itself.', 'do2'),
    box('hasMore costs nothing', 'Ask for one row more than you need. If it comes back, there is a next page (part 2 builds it).', 'xanh')) +
    box('If you took PostgreSQL lesson 4.3', 'You ran LIMIT/OFFSET by hand there; lesson 7.5 here showed why count(*) reads the whole table.', 'lam') +
    box('Pick by the data, not by fashion', 'Feeds, chats, infinite scroll: cursor. Small admin lists with "page 7 of 12": offset is honest and simple.', 'cam') +
    box('Numbers from this table', `count() ${pc(/^count\(\)/)} ms vs a cursor page ${pc(/^where id > cursor/)} ms: the total costs about ${Math.round(pc(/^count\(\)/) / pc(/^where id > cursor/))} pages.`, '') },

  { t: 'A unique violation, as Prisma 7.10 reports it', to: true, giua: true, body: J("await prisma.note.create({ data: { slug: 'bulk-1', … } });   // slug already exists", { sm: false }) +
    TT('c7/p2002', 2, 6, 'node p2002.mjs · real', { hl: [2, 3, 4, 5], n: 104 }) +
    box('Read the meta, do not trust a blog post', 'With the driver adapter there is no <code class="i">meta.target</code>; the details sit in <code class="i">meta.driverAdapterError.cause.constraint</code> — and on PostgreSQL that is <code class="i">{ index: "Note_slug_key" }</code>, not a list of fields.', 'cam') },

  { t: 'Translate it once, in the service', to: true, giua: true, body: J(ma('c7/p2002-409', 5, 16), { hl: [5, 6, 7, 8] }) + TT('c7/p2002-409', 2, 3, 'node p2002-409.mjs · real', { n: 118, hl: [1] }) +
    box('Older code reads constraint.fields', 'On Prisma 7.10 + PostgreSQL that is undefined: the message would be " already exists". Fall back to the index name — and the error message always names it.', 'do2') },

  { t: 'Do not "check, then insert"', to: true, giua: true, body: JW(ma('c7/race-insert', 5, 13), 100, [2, 4, 6]) + TT('c7/race-insert', 2, 3, 'two sign-ups with the same slug, at the same moment · real', { hl: [2] }) +
    box('The gap between two queries', 'Both requests see "free", both insert. The database stops the second one — with P2002, which becomes a <b>500</b> if you did not expect it.', 'do2') },

  { t: 'Let the unique index be the referee', to: true, giua: true, body: J(ma('c7/race-insert', 16, 24), { hl: [6] }) + TT('c7/race-insert', 4, 5, 'same race, insert and catch · real', { hl: [2], sm: false }) +
    box('The only version that is correct under concurrency', 'The database is the one place that can decide. Lesson 6.2 told you which status code to return; now you know where the error comes from.', 'xanh') },

  { t: 'Exercise: sign-up with a unique email', to: true, giua: true, body: box('Your task', 'POST /users { email, name }. Two people submit the same email in the same second. Write the service so one gets 201 and the other gets 409 with code EMAIL_TAKEN — without a findUnique first.', '') +
    box('Hint', 'User.email is @unique. Which error code, and where do you read the constraint?', 'lam') +
    `<div data-k="dapan">${box('Answer', 'try { return await prisma.user.create({ data }); } catch (err) { if (err.code === \'P2002\') throw new AppError(409, \'EMAIL_TAKEN\', \'email already exists\'); throw err; } — the index User_email_key is the referee.', 'xanh')}</div>` },

  { t: 'Self-check (part 1)', to: true, giua: true, body: `<ol>
<li>Why is skip: 900000 slow if it returns only 20 rows?</li>
<li>Why should a cursor carry both createdAt and id?</li>
<li>Where does Prisma 7.10 put the constraint of a P2002, on PostgreSQL?</li>
<li>Why is "findUnique, then create" wrong?</li>
</ol>
${box('Try first', 'Pause and answer before you look.', 'lam')}
<div data-k="dapan">${box('Answers', '1. It produces and discards 900,000 rows first. &nbsp;2. createdAt alone has ties. &nbsp;3. meta.driverAdapterError.cause.constraint.index. &nbsp;4. Two requests both see "free"; catch P2002 instead.', 'xanh')}</div>` },

  { t: 'Summary (part 1)', to: true, giua: true, body: `<ul>
<li>Through Prisma on 1,000,000 rows: skip 0 ≈ 1.1 ms, skip 900,000 ≈ 210 ms, cursor ≈ 0.7 ms, count ≈ 51 ms</li>
<li>Cursor = where id &lt; cursor + orderBy + take; tie-breaker for non-unique sorts; offset for small admin lists</li>
<li>Drop total, use hasMore</li>
<li>P2002 ⇒ 409 in the service; on 7.10 read constraint.index (fields is undefined)</li>
<li>Never check-then-insert: let the unique index decide, catch P2002</li>
</ul>` + box('Next', 'Part 2: lost updates, raw SQL, and the final list endpoint.', 'lam') },

  /* ───── 7.6b (node-7-6-2) ───── */
  { t: 'The lost update, on real data', to: true, giua: true, body: JW(ma('c7/version', 6, 9), 100, [2, 3]) + TT('c7/version', 3, 4, 'node version.mjs · part 1 · real', { hl: [2], sm: false }) +
    box('No error anywhere', 'A saved the title. B saved the whole form it had loaded — with the old title. A\'s change vanished (lesson 6.5 did this on a Map).', 'do2') +
    box('Lost update (mất bản cập nhật)', 'two people edit from the same starting version; the second save silently erases the first.', 'lam') },

  { t: 'A version column stops it', to: true, giua: true, body: J(ma('c7/version', 13, 20), { hl: [2, 3], sm: false }) + TT('c7/version', 5, 8, 'node version.mjs · part 2 · real', { hl: [2, 3, 4], sm: false }) +
    box('Two lines changed', 'version: clientVersion in where, version: { increment: 1 } in data. B now gets 0 rows: A\'s title survives.', 'xanh') },

  { t: 'Why it works', to: true, giua: true, body: flow([
    { t: '1 · both read', s: 'version 1', mau: LAM }, { t: '2 · A writes', s: 'version ⇒ 2', mau: NODE }, { t: '3 · B\'s WHERE', s: 'matches nothing', mau: DO }, { t: '4 · count 0', s: '409, B reloads', mau: CAM },
  ], { h: 150, fs: 22 }) + three(
    box('Why updateMany', 'update only accepts a unique key in where. updateMany accepts any filter and returns a count — the count is the concurrency check.', 'lam'),
    box('Optimistic (lạc quan)', 'Nobody waits, nothing is locked; the loser is told. Fits HTTP, where "hold a lock while a human types" is impossible.', 'xanh'),
    box('Same shape as ETag', 'If-Match + 412 in lesson 6.5 is this mechanism on the wire: version column = server side, ETag = wire format.', 'cam')) +
    box('When you must queue (stock, seats): pessimistic', 'SELECT … FOR UPDATE inside a transaction, short and narrow. PostgreSQL lesson 11.4 runs both fixes with two psql sessions.', 'do2') },

  { t: 'Raw SQL, and one line that leaks the table', to: true, giua: true, body: J(ma('c7/raw-sql', 3, 7), { hl: [3], sm: false }) + TT('c7/raw-sql', 2, 4, 'node raw-sql.mjs · the attacker types: bulk-1\' OR \'1\'=\'1 · real', { hl: [1], sm: false }) +
    box('A returned the whole table', 'The quote closes the string, OR \'1\'=\'1\' makes the condition always true, and the database did exactly what it was told. Nothing in A looks alarming in a diff.', 'do2') },

  { t: 'Values never go into the SQL text', to: true, giua: true, body: three(
    box('$queryRaw`…${x}`', 'A tagged template: Prisma turns every ${…} into a bound parameter. Safe.', 'xanh'),
    box('$queryRawUnsafe(string)', 'Named that way for a reason. Only for SQL with no user input at all.', 'do2'),
    box('The normal API', 'prisma.note.count({ where }) — parameters by design.', 'lam')) +
    box('If you took DBI202 CS.7 (SQL injection)', 'You injected into SQL Server by hand. Chapter 9 of this course goes deeper; the habit starts today.', 'cam') +
    box('This website\'s rule', 'Parameters only, never string interpolation — after a review found concatenated SQL in an internal admin script.', '') },

  { t: 'Two raw-SQL surprises that cost real minutes', to: true, giua: true, body: JW(ma('c7/raw-sql', 12, 15), 96) + TT('c7/raw-sql', 5, 7, 'same program · real', { hl: [1, 2, 3], n: 112 }) +
    two(box('count(*) is a BigInt', 'JSON.stringify throws. Cast in SQL: count(*)::int — or convert in JS.', 'cam'),
      box('pg_sleep returns void', 'Prisma cannot deserialize it. Write SELECT 1 FROM pg_sleep(0.1).', 'lam')) },

  { t: 'The final shape of the list endpoint', to: true, giua: true, body: J(ma('c7/list-final', 4, 15), { hl: [6, 7, 9, 11] }) + TT('c7/list-final', 2, 5, 'node list-final.mjs · 1,000,000 notes · real', { n: 118 }) },

  { t: 'Every decision came from a measurement', to: true, giua: true, body: bang(['line', 'measured in'], [
    ['<code class="i">id: { lt: cursor }</code> + orderBy id', 'part 1: cursor 0.7 ms vs deep offset 210 ms'],
    ['<code class="i">take: take + 1</code>, no count()', 'part 1: count() 51 ms on every page'],
    ['<code class="i">omit: { body: true }</code>', 'lesson 7.4: 457.6 KB ⇒ 174.4 KB'],
    ['<code class="i">Math.min(limit, 50)</code>', 'lesson 6.3: limit has a ceiling in the schema'],
  ], { co: 24 }) + box('This website', 'The feed and the messenger paginate with cursors for exactly these reasons; sign-up and Pro activation codes turn P2002 into a clear 409 that names the field.', 'lam') },

  { t: 'Exercise: edit with a version', to: true, giua: true, body: box('Your task', 'PATCH /notes/:id receives { body, version }. Return 409 STALE_VERSION if someone else saved first, 404 if the note does not exist. How do you tell the two apart, since updateMany returns count 0 for both?', '') +
    box('Hint', 'Only look again when count is 0.', 'lam') +
    `<div data-k="dapan">${box('Answer', 'updateMany({ where: { id, version }, data: { body, version: { increment: 1 } } }). If count is 0, findUnique({ where: { id } }): null ⇒ 404, otherwise ⇒ 409 STALE_VERSION. The extra query runs only on the rare failure path.', 'xanh')}</div>` },

  { t: 'Self-check (part 2)', to: true, giua: true, body: `<ol>
<li>How does the version column turn a lost update into a 409?</li>
<li>Why updateMany and not update?</li>
<li>Which raw-SQL call is safe, and why?</li>
<li>How does the list endpoint know there is a next page without count()?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. WHERE version = clientVersion matches nothing after A wrote: count 0 ⇒ 409. &nbsp;2. update only accepts a unique key; updateMany returns the count. &nbsp;3. $queryRaw tagged template: values become bound parameters. &nbsp;4. It asks for take + 1 rows.', 'xanh')}</div>` },

  { t: 'Summary (part 2)', to: true, giua: true, body: `<ul>
<li>Lost update: without a check, B silently overwrites A; <code class="i">updateMany</code> + version ⇒ 1 row / 0 rows ⇒ 409</li>
<li>Optimistic for HTTP edits; SELECT … FOR UPDATE when you must queue</li>
<li>Raw SQL: concatenation leaked 1,000,003 rows; the tagged template returned 0</li>
<li>Cast count(*)::int; SELECT 1 FROM pg_sleep(…)</li>
<li>Final list endpoint: cursor, take + 1, omit body, no count — each line measured</li>
</ul>` + box('Chapter 7 done', 'Next chapter: authentication and authorization — AUTHOR_ID = 1 becomes the logged-in user.', 'lam') },
]);
