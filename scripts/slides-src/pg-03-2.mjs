/**
 * pg-03-2 — PostgreSQL · Chapter 3 · Lesson 3.2 "Foreign keys & referential integrity" (slide EN, kiểu FU, 25/10/2026).
 * Nguồn: content/courses/postgresql/s03-bang-rang-buoc.mjs › postgresql-3-2-khoa-ngoai. Output psql = chạy thật PostgreSQL 17.11
 * (video-bai-giang/src/khung/pg/that/pg-03-2.out.txt + pg-03-ctshop.out.txt). Bổ sung: phiếu mượn sách đời thường, ERD Crow's Foot → CREATE,
 * so sánh ba ON DELETE bằng bảng trước/sau, chuỗi CASCADE, chỉ mục FK bị thiếu, ADD CONSTRAINT trên dữ liệu có sẵn, CT Shop thật, Prisma của cuongthai.com.
 */
import { lamDeck, sql, psql, run, tbl, two, three, box, steps, cards, kw, vsd, c } from './_pg-chung.mjs';
import { erdTable, one, many, arrow } from './pg-03-hinh.mjs';

const zm = (h, z = 1.3) => `<div style="zoom:${z}">${h}</div>`;
export const deck = { key: 'pg-03-2', code: 'PG 3.2', title: 'Foreign keys & referential integrity', sub: 'REFERENCES, ON DELETE, and the orphan problem' };

/* Phiếu mượn sách → số thẻ thành viên; một phiếu trỏ tới thẻ không có = mồ côi. */
const slips = () => `<svg viewBox="0 0 1110 300" width="1110" height="300" font-family="Arial">
  <text x="170" y="28" text-anchor="middle" font-size="22" font-weight="800" fill="#336791">MEMBERS (parent)</text>
  <text x="900" y="28" text-anchor="middle" font-size="22" font-weight="800" fill="#e08a1e">LOAN SLIPS (child)</text>
  <g data-k="m1"><rect x="40" y="50" width="260" height="62" rx="8" fill="#eef4fa" stroke="#336791" stroke-width="3"/><text x="62" y="90" font-size="22" fill="#333" font-family="Menlo,monospace">card 1 · Cuong</text></g>
  <g data-k="m2"><rect x="40" y="130" width="260" height="62" rx="8" fill="#eef4fa" stroke="#336791" stroke-width="3"/><text x="62" y="170" font-size="22" fill="#333" font-family="Menlo,monospace">card 2 · Lan</text></g>
  <g data-k="s1"><rect x="760" y="50" width="300" height="52" rx="8" fill="#fff7ef" stroke="#e08a1e" stroke-width="3"/><text x="778" y="84" font-size="21" fill="#333" font-family="Menlo,monospace">“SQL book” → card 1</text></g>
  <g data-k="s2"><rect x="760" y="112" width="300" height="52" rx="8" fill="#fff7ef" stroke="#e08a1e" stroke-width="3"/><text x="778" y="146" font-size="21" fill="#333" font-family="Menlo,monospace">“Atlas” → card 1</text></g>
  <g data-k="s3"><rect x="760" y="174" width="300" height="52" rx="8" fill="#fff7ef" stroke="#e08a1e" stroke-width="3"/><text x="778" y="208" font-size="21" fill="#333" font-family="Menlo,monospace">“Novel” → card 2</text></g>
  <g data-k="s4"><rect x="760" y="236" width="300" height="52" rx="8" fill="#fdf0ee" stroke="#c0392b" stroke-width="3" stroke-dasharray="8 5"/><text x="778" y="270" font-size="21" fill="#c0392b" font-family="Menlo,monospace" font-weight="800">“Comic” → card 999 ?</text></g>
  <path d="M760,76 C560,76 480,81 300,81" stroke="#2f7d4f" stroke-width="3.5" fill="none"/><path d="M760,138 C560,138 480,90 300,90" stroke="#2f7d4f" stroke-width="3.5" fill="none"/><path d="M760,200 C560,200 480,161 300,161" stroke="#2f7d4f" stroke-width="3.5" fill="none"/>
  <path d="M760,262 C620,262 560,250 520,250" stroke="#c0392b" stroke-width="3.5" fill="none" stroke-dasharray="9 6"/><text x="440" y="262" text-anchor="middle" font-size="40">❓</text>
  <text x="300" y="270" text-anchor="middle" font-size="19" fill="#c0392b" font-weight="800">no such member</text>
</svg>`;

/* ERD: u_r ‖──○{ n_r */
const erd = () => {
  const A = erdTable({ id: 'e-u', x: 60, y: 30, w: 330, title: 'u_r', cols: [{ n: 'id', t: 'int', k: 'PK' }, { n: 'name', t: 'text' }], fs: 21 });
  const B = erdTable({ id: 'e-n', x: 720, y: 30, w: 330, title: 'n_r', cols: [{ n: 'id', t: 'int', k: 'PK' }, { n: 'user_id', t: 'int', k: 'FK' }, { n: 'title', t: 'text' }], fs: 21 });
  const y1 = A.ys('id'), y2 = B.ys('user_id');
  return `<svg viewBox="0 0 1110 260" width="1110" height="260" font-family="Arial">${A.svg}${B.svg}
  <path d="M390,${y1} L555,${y1} L555,${y2} L720,${y2}" fill="none" stroke="#404040" stroke-width="3"/>${one(390, y1, 1)}${many(720, y2, -1)}
  <text x="555" y="${y1 - 42}" text-anchor="middle" font-size="21" font-weight="800" fill="#b85a2b" data-k="e-read">one user</text><text x="555" y="${y1 - 18}" text-anchor="middle" font-size="21" font-weight="800" fill="#b85a2b">has 0 … many notes</text>
  <text x="555" y="236" text-anchor="middle" font-size="19" fill="#666">n_r.user_id <tspan font-weight="800" fill="#336791">REFERENCES</tspan> u_r(id)</text></svg>`;
};

/* Ba hành vi ON DELETE: sơ đồ đồ hoạ. */
const threeWays = () => `<svg viewBox="0 0 1110 250" width="1110" height="250" font-family="Arial">
  <g data-k="w-r"><rect x="10" y="10" width="345" height="230" rx="14" fill="#eef4fa" stroke="#336791" stroke-width="3"/><text x="182" y="48" text-anchor="middle" font-size="26" font-weight="800" fill="#336791">RESTRICT / NO ACTION</text>
   <text x="182" y="92" text-anchor="middle" font-size="46">🛑</text><text x="182" y="138" text-anchor="middle" font-size="22" fill="#333" font-weight="700">“user has notes</text><text x="182" y="166" text-anchor="middle" font-size="22" fill="#333" font-weight="700">— delete REFUSED”</text><text x="182" y="212" text-anchor="middle" font-size="20" fill="#2f7d4f" font-weight="800">default · safest</text></g>
  <g data-k="w-c"><rect x="382" y="10" width="345" height="230" rx="14" fill="#fdf0ee" stroke="#c0392b" stroke-width="3"/><text x="555" y="48" text-anchor="middle" font-size="26" font-weight="800" fill="#c0392b">CASCADE</text>
   <text x="555" y="92" text-anchor="middle" font-size="46">🌊</text><text x="555" y="138" text-anchor="middle" font-size="22" fill="#333" font-weight="700">parent goes →</text><text x="555" y="166" text-anchor="middle" font-size="22" fill="#333" font-weight="700">its children go too</text><text x="555" y="212" text-anchor="middle" font-size="20" fill="#c0392b" font-weight="800">powerful · dangerous</text></g>
  <g data-k="w-n"><rect x="755" y="10" width="345" height="230" rx="14" fill="#fff7ef" stroke="#e08a1e" stroke-width="3"/><text x="927" y="48" text-anchor="middle" font-size="26" font-weight="800" fill="#b85a2b">SET NULL</text>
   <text x="927" y="92" text-anchor="middle" font-size="46">🔗✂</text><text x="927" y="138" text-anchor="middle" font-size="22" fill="#333" font-weight="700">children stay,</text><text x="927" y="166" text-anchor="middle" font-size="22" fill="#333" font-weight="700">the link becomes NULL</text><text x="927" y="212" text-anchor="middle" font-size="20" fill="#b85a2b" font-weight="800">optional relations</text></g>
</svg>`;

/* CT Shop ERD rút gọn: customer → orders → order_item ← product (một hàng ngang). */
const shopErd = () => {
  const W = 222, X = [0, 296, 592, 888];
  const C = erdTable({ id: 'sh-c', x: X[0], y: 30, w: W, title: 'customer', cols: [{ n: 'id', t: 'bigint', k: 'PK' }, { n: 'email', t: 'text', k: 'UQ' }, { n: 'full_name', t: 'text' }], fs: 16 });
  const O = erdTable({ id: 'sh-o', x: X[1], y: 30, w: W, title: 'orders', cols: [{ n: 'id', t: 'bigint', k: 'PK' }, { n: 'customer_id', t: 'bigint', k: 'FK' }, { n: 'status', t: 'text' }], fs: 16 });
  const I = erdTable({ id: 'sh-i', x: X[2], y: 30, w: W, title: 'order_item', cols: [{ n: 'order_id', t: 'bigint', k: 'FK' }, { n: 'product_id', t: 'bigint', k: 'FK' }, { n: 'qty', t: 'int' }], fs: 16 });
  const P = erdTable({ id: 'sh-p', x: X[3], y: 30, w: W, title: 'product', cols: [{ n: 'id', t: 'bigint', k: 'PK' }, { n: 'sku', t: 'text', k: 'UQ' }, { n: 'price', t: 'numeric' }], fs: 16 });
  const yc = C.ys('id'), yo = O.ys('customer_id'), yi = I.ys('order_id'), yoi = O.ys('id'), yp = I.ys('product_id'), ypp = P.ys('id');
  return `<svg viewBox="0 0 1110 330" width="1110" height="330" font-family="Arial">${C.svg}${O.svg}${I.svg}${P.svg}
  <path d="M${W},${yc} L${X[1]},${yo}" stroke="#404040" stroke-width="3" fill="none"/>${one(W, yc, 1)}${many(X[1], yo, -1)}
  <path d="M${X[1] + W},${yoi} L${X[2]},${yi}" stroke="#c0392b" stroke-width="4" fill="none"/>${one(X[1] + W, yoi, 1)}${many(X[2], yi, -1)}
  <path d="M${X[2] + W},${yp} L${X[3]},${ypp}" stroke="#404040" stroke-width="3" fill="none"/>${many(X[2] + W, yp, 1)}${one(X[3], ypp, -1)}
  <g font-size="19" font-weight="800"><rect x="20" y="195" width="300" height="42" rx="8" fill="#f1f9f4" stroke="#9fd0b2" stroke-width="2"/><text x="170" y="223" text-anchor="middle" fill="#1f6b40">customer → orders: NO ACTION</text>
  <rect x="405" y="195" width="300" height="42" rx="8" fill="#fdf0ee" stroke="#e3a59c" stroke-width="2" data-k="sh-cas"/><text x="555" y="223" text-anchor="middle" fill="#c0392b">orders → order_item: CASCADE</text>
  <rect x="790" y="195" width="300" height="42" rx="8" fill="#f1f9f4" stroke="#9fd0b2" stroke-width="2"/><text x="940" y="223" text-anchor="middle" fill="#1f6b40">order_item → product: NO ACTION</text></g>
  <text x="555" y="285" text-anchor="middle" font-size="21" fill="#555">Delete an order → its lines go with it.  Delete a product that was ever sold → refused.</text></svg>`;
};

const T = (cap, cols, rows, o = {}) => tbl(cols, rows, { cap, ...o });

export const slides = lamDeck({ chuong: 'Chapter 3 — Tables, constraints & schema design', bai: '3.2' }, [
  { cover: true, t: 'Foreign keys &<br>referential integrity', sub: 'How tables point at each other —<br>and what happens when the parent is deleted.' },

  { t: 'What you will get from this lesson', to: true, body: `
<ul>
<li>What a <b>foreign key</b> is, and the <b>orphan row</b> it prevents</li>
<li>Draw it (ERD) and write it: <code class="i">REFERENCES</code> in <code class="i">CREATE TABLE</code></li>
<li>The three answers to <i>“what if the parent is deleted?”</i>: <b>RESTRICT · CASCADE · SET NULL</b></li>
<li>Traps: cascade chains, the <b>missing index</b> on the child column, adding an FK to existing data</li>
<li>How this looks in <b>CT Shop</b> and in the cuongthai.com schema</li>
</ul>
${box('Where we are', 'Lesson 3.1 gave every row a <b>name</b> (the primary key). A foreign key is a column that <b>uses that name</b> to point at a row in another table.', 'lam')}` },

  { t: 'Everyday example first: library loan slips', body: `
${slips()}
<p style="font-size:23px;margin:0">Every loan slip carries a <b>member card number</b>. A slip for “card 999” is an <b>orphan</b>: nobody can tell who borrowed the comic. A foreign key is the librarian who <b>refuses to write</b> that slip — and also refuses to throw away a member who still holds books.</p>` },

  { t: 'Draw it: one parent, many children (ERD)', body: `
${erd()}
<ul style="font-size:23px;margin:2px 0 0">
<li><b>Parent</b> table <code class="i">u_r</code> holds the key (<b>PK</b>) · <b>child</b> table <code class="i">n_r</code> holds a copy of that key (<b>FK</b>)</li>
<li>Crow’s Foot: <b>‖</b> = exactly one · <b>○&lt;</b> = zero or many ⇒ <i>one user has zero or many notes; each note belongs to exactly one user</i></li>
<li>Theory of ERD and keys: DBI202 → <b>cuongthai.com/courses/introduction-to-databases</b></li>
</ul>` },

  { t: 'Write it: REFERENCES in CREATE TABLE', giua: true, body: `
${zm(sql(`CREATE TABLE u_r (id int PRIMARY KEY, name text NOT NULL);
INSERT INTO u_r VALUES (1,'Cuong'),(2,'Lan');

CREATE TABLE n_r (
  id      int PRIMARY KEY,
  user_id int NOT NULL REFERENCES u_r(id),   -- the foreign key
  title   text
);
INSERT INTO n_r VALUES (1,1,'a'),(2,1,'b'),(3,2,'c');`, { sm: true, hl: [6] }), 1.3)}
${two(box('Order matters', 'Create the <b>parent first</b> (<code class="i">u_r</code>), then the child. <code class="i">REFERENCES u_r(id)</code> must point at a <b>PRIMARY KEY or UNIQUE</b> column.', 'info'),
box('Same type, same meaning', '<code class="i">user_id</code> must have the <b>same type</b> as <code class="i">u_r.id</code> (<code class="i">int</code> ↔ <code class="i">int</code>). Make it <code class="i">NOT NULL</code> when every note must have an owner.', 'lam'))}` },

  { t: 'Direction 1: the database refuses an orphan', giua: true, body: `
${zm(run(`INSERT INTO n_r VALUES (4, 999, 'orphan');   -- there is no user 999`, `ERROR:  insert or update on table "n_r" violates foreign key constraint "n_r_user_id_fkey"
DETAIL:  Key (user_id)=(999) is not present in table "u_r".`, { hlOut: [1, 2] }), 1.35)}
<ul style="font-size:25px">
<li>The note is rejected <b>before</b> it exists — no “ghost owner” can ever enter the table</li>
<li>Read the message: <b>which constraint</b> (<code class="i">n_r_user_id_fkey</code> = <code class="i">table_column_fkey</code>, auto-named) and <b>which value</b> (<code class="i">999</code>)</li>
<li>Without this rule, JOINs silently <b>drop</b> orphan rows (Chapter 5) — a bug nobody notices for months</li>
</ul>` },

  { t: 'Direction 2: the parent cannot vanish', giua: true, body: `
${zm(run(`DELETE FROM u_r WHERE id = 1;   -- user 1 still owns notes 1 and 2`, `ERROR:  update or delete on table "u_r" violates foreign key constraint "n_r_user_id_fkey" on table "n_r"
DETAIL:  Key (id)=(1) is still referenced from table "n_r".`, { hlOut: [1, 2] }), 1.15)}
${zm(two(T('u_r', ['id', 'name'], [['1', 'Cuong'], ['2', 'Lan']], { hl: [0] }), T('n_r', ['id', 'user_id', 'title'], [['1', '1', 'a'], ['2', '1', 'b'], ['3', '2', 'c']], { hl: [0, 1] })), 1.35)}
<p style="font-size:24px;margin:0">Without a rule the delete would leave notes 1 and 2 pointing at nobody. By default PostgreSQL <b>refuses</b> — loud and safe. But you can choose another behaviour…</p>` },

  { t: 'Your decision: what should DELETE do to the children?', giua: true, body: `
${threeWays()}
<p style="font-size:24px;margin:2px 0 0">The answer is declared <b>once</b>, on the child’s foreign key: <code class="i">ON DELETE RESTRICT | CASCADE | SET NULL</code>. Pick by asking: <i>“can a child row still make sense without its parent?”</i></p>` },

  { t: '1) RESTRICT / NO ACTION — the safe default', giua: true, body: `
${zm(sql(`-- no ON DELETE clause  ⇒  NO ACTION (refuse)
user_id int NOT NULL REFERENCES u_r(id)

-- or say it out loud
user_id int NOT NULL REFERENCES u_r(id) ON DELETE RESTRICT`, { sm: true }), 1.2)}
${zm(run(`SELECT conname, confdeltype FROM pg_constraint
WHERE conrelid = 'ch3.n_r'::regclass AND contype = 'f';`, `     conname      | confdeltype
------------------+-------------
 n_r_user_id_fkey | a
(1 row)`, { hlOut: [3] }), 1.1)}
<ul style="font-size:22px;margin:0">
<li><code class="i">a</code> = <b>NO ACTION</b> (the default). You must deal with the children first — a clear <b>error</b>, never silent damage</li>
<li>RESTRICT vs NO ACTION: both refuse; NO ACTION checks at the end of the statement and can be <b>deferred</b> — for everyday work they behave the same</li>
</ul>` },

  { t: '2) CASCADE — delete the children too', body: `
${zm(sql(`CREATE TABLE n_c (
  id      int PRIMARY KEY,
  user_id int NOT NULL REFERENCES u_c(id) ON DELETE CASCADE,
  title   text
);
-- notes: (1, user 1), (2, user 1), (3, user 2)
DELETE FROM u_c WHERE id = 1;`, { sm: true, hl: [3] }), 1.2)}
${zm(two(T('n_c BEFORE', ['id', 'user_id', 'title'], [['1', '1', 'a'], ['2', '1', 'b'], ['3', '2', 'c']], { bo: [0, 1] }),
  T('n_c AFTER  (SELECT * FROM n_c)', ['id', 'user_id', 'title'], [['3', '2', 'c']], { hl: [0] })), 1.25)}
${box('Use when …', 'the child has <b>no meaning without the parent</b>: a comment on a post, a line in an order, a message in a chat.', 'xanh')}` },

  { t: '3) SET NULL — keep the child, forget the link', body: `
${zm(sql(`CREATE TABLE n_s (
  id        int PRIMARY KEY,
  author_id int REFERENCES u_s(id) ON DELETE SET NULL,   -- column must allow NULL
  title     text
);
DELETE FROM u_s WHERE id = 1;`, { sm: true, hl: [3] }), 1.2)}
${zm(two(T('n_s BEFORE', ['id', 'author_id', 'title'], [['1', '1', 'a'], ['2', '1', 'b'], ['3', '2', 'c']], { hl: [0, 1] }),
  T('n_s AFTER', ['id', 'author_id', 'title'], [['1', null, 'a'], ['2', null, 'b'], ['3', '2', 'c']], { o: [[0, 1], [1, 1]] })), 1.25)}
${box('Use when …', 'the relation is <b>optional</b> and the child should outlive the parent: posts of a deleted author, an order whose coupon was removed. <code class="i">NULL</code> = “unknown / none”.', 'lam')}` },

  { t: 'Side by side: the same DELETE, three outcomes', body: `
${zm(three(
  `<div class="card" style="border-color:#336791"><div class="h" style="color:#336791">RESTRICT</div><p><code class="i">DELETE user 1</code></p><p>❌ <b>error</b><br>nothing changes<br><span class="nho">user 1 + notes 1, 2, 3 stay</span></p></div>`,
  `<div class="card" style="border-color:#c0392b"><div class="h" style="color:#c0392b">CASCADE</div><p><code class="i">DELETE user 1</code></p><p>✅ user 1 gone<br>🗑 notes <b>1, 2 gone</b><br><span class="nho">note 3 stays</span></p></div>`,
  `<div class="card" style="border-color:#e08a1e"><div class="h" style="color:#b85a2b">SET NULL</div><p><code class="i">DELETE user 1</code></p><p>✅ user 1 gone<br>🔗 notes 1, 2 stay,<br><b>author = NULL</b></p></div>`), 1.25)}
${zm(`<table class="t"><tr><th>Question</th><th>RESTRICT</th><th>CASCADE</th><th>SET NULL</th></tr>
<tr><td>Parent deleted?</td><td>no (error)</td><td>yes</td><td>yes</td></tr>
<tr><td>Children?</td><td>untouched</td><td>deleted</td><td>kept, FK = NULL</td></tr>
<tr><td>FK column NOT NULL?</td><td>allowed</td><td>allowed</td><td><b>must allow NULL</b></td></tr></table>`, 1.2)}` },

  { t: 'Choosing — and the CASCADE trap', body: `
${two(`<ul style="font-size:22px"><li><b>RESTRICT</b> — child has value of its own (invoices, order history). You want an <b>error</b>, not a silent disappearance. <b>When in doubt: keep the default.</b></li>
<li><b>CASCADE</b> — child is a <b>part of</b> the parent (order lines, comments).</li>
<li><b>SET NULL</b> — optional relation; child outlives the link.</li></ul>`,
box('Trap: CASCADE “for convenience”', 'One DELETE removes <b>chains</b>: customer → orders → items → shipments. Someone deletes a test account and 40 000 rows on 9 tables vanish in <b>one</b> transaction, with no confirmation.', 'do2'))}
${zm(run(`DELETE FROM cust WHERE id = 1;     -- cust → ord → itm, all ON DELETE CASCADE
SELECT (SELECT count(*) FROM cust) AS cust, (SELECT count(*) FROM ord) AS ord, (SELECT count(*) FROM itm) AS itm;`, ` cust | ord | itm
------+-----+-----
    1 |   1 |   1
(1 row)`, { hlOut: [3] }), 1.0)}
<p class="nho">Before: 2 customers · 3 orders · 4 items. One <code class="i">DELETE 1</code> removed 1 + 2 + 3 = <b>6 rows</b>. Prefer <b>soft delete</b> (<code class="i">deleted_at</code>) for anything a human can click.</p>` },

  { t: 'A real schema: CT Shop (the Lab 1 database)', giua: true, body: `
${shopErd()}
${zm(psql(`Foreign-key constraints:
    "orders_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES shop.customer(id)
Referenced by:
    TABLE "shop.order_item" CONSTRAINT "order_item_order_id_fkey" FOREIGN KEY (order_id)
         REFERENCES shop.orders(id) ON DELETE CASCADE`, { sm: true, title: '\\d shop.orders (excerpt) — real, PostgreSQL 17' }), 1.12)}
<p style="font-size:21px;margin:0">After this chapter, <b>Lab 1</b> has you build this schema from the ERD. Design rule used: <b>lines belong to the order (CASCADE)</b>, but a <b>product that was ever sold must not disappear (RESTRICT)</b>.</p>` },

  { t: 'The missing index on the child column', body: `
${zm(run(`SELECT tablename, indexname FROM pg_indexes
WHERE schemaname = 'ch3' AND tablename IN ('u_r','n_r') ORDER BY 1, 2;`, ` tablename | indexname
-----------+-----------
 n_r       | n_r_pkey
 u_r       | u_r_pkey
(2 rows)`, { hlOut: [3, 4] }), 1.15)}
${two(box('What PostgreSQL does', 'The parent’s PK has an index automatically (lesson 3.1). The child’s <code class="i">user_id</code> gets <b>none</b> — PostgreSQL never creates an index for an FK column.', 'info'),
box('Why it hurts', 'Deleting a parent must <b>find its children</b>. With no index on <code class="i">user_id</code> that is a <b>full scan of n_r</b> on every delete — the classic cause of a slow DELETE.', 'do2'))}
${zm(sql(`CREATE INDEX n_r_user_id_idx ON n_r (user_id);   -- now both lookups are fast`, { sm: true }), 1.25)}
<p class="nho">Indexes are the subject of Chapters 9–10. Remember now: <b>FK column ⇒ add an index.</b> (JOINs through the FK also use it.)</p>` },

  { t: 'Adding a foreign key to a table that already has data', giua: true, body: `
${zm(run(`CREATE TABLE d_child (id int PRIMARY KEY, parent_id int);
INSERT INTO d_child VALUES (1, 7);          -- parent 7 does not exist

ALTER TABLE d_child ADD CONSTRAINT d_child_parent_fk
  FOREIGN KEY (parent_id) REFERENCES u_r(id);`, `ERROR:  insert or update on table "d_child" violates foreign key constraint "d_child_parent_fk"
DETAIL:  Key (parent_id)=(7) is not present in table "u_r".`, { hlOut: [1, 2] }), 1.1)}
<ul style="font-size:22px;margin:0">
<li>PostgreSQL <b>checks every existing row</b> when you add an FK — one orphan makes the whole <code class="i">ALTER</code> fail</li>
<li>Fix the data first (delete or repair the orphans), then add the constraint. On a huge table: add it <code class="i">NOT VALID</code>, then <code class="i">VALIDATE CONSTRAINT</code> (lesson 3.4)</li>
<li><b>Name your constraints</b> (<code class="i">ADD CONSTRAINT d_child_parent_fk</code>) when you add them later — clearer errors</li>
</ul>` },

  { t: 'Coming from SQL Server? Same and different', body: `
${zm(`<table class="t">
<tr><th style="width:330px">Topic</th><th>SQL Server → PostgreSQL</th></tr>
<tr><td>Syntax</td><td><code class="i">REFERENCES</code> / <code class="i">FOREIGN KEY … REFERENCES</code> and <code class="i">ON DELETE CASCADE | SET NULL | NO ACTION</code> — <b>the same</b></td></tr>
<tr><td>Default when ON DELETE is omitted</td><td><b>NO ACTION</b> in both</td></tr>
<tr><td>Auto constraint name</td><td><code class="i">FK__child__col__3B75D760</code> (hash) → <code class="i">child_col_fkey</code> (readable)</td></tr>
<tr><td>Index on the FK column</td><td>Not created in <b>either</b> — add it yourself</td></tr>
<tr><td>“Multiple cascade paths” error</td><td>SQL Server refuses some cascade graphs; PostgreSQL allows them (so be careful)</td></tr>
<tr><td>Extra in PostgreSQL</td><td><code class="i">DEFERRABLE</code> constraints, <code class="i">ON DELETE SET DEFAULT</code>, <code class="i">NOT VALID</code></td></tr>
</table>`, 1.12)}` },

  { t: 'In production: foreign keys on cuongthai.com', giua: true, body: `
${zm(sql(`model PostTag {
  postId Int
  tagId  Int
  post Post @relation(fields: [postId], references: [id], onDelete: Cascade)
  tag  Tag  @relation(fields: [tagId],  references: [id], onDelete: Cascade)
  @@id([postId, tagId], map: "pk_post_tags")
}`, { sm: true, lang: 'typescript' }), 1.2)}
${zm(`<table class="t"><tr><th>onDelete in prisma/schema.prisma</th><th>times</th><th>meaning</th></tr>
<tr><td><code class="i">Cascade</code></td><td>≈ 700</td><td>child is part of the parent (tags of a post, messages of a thread)</td></tr>
<tr><td><code class="i">SetNull</code></td><td>≈ 156</td><td>optional link (author removed, post stays)</td></tr>
<tr><td><code class="i">Restrict</code> / <code class="i">NoAction</code></td><td>≈ 9</td><td>must not disappear while referenced</td></tr></table>`, 1.1)}
<p style="font-size:21px;margin:0">Counted in the real schema (≈ 600 models). Most links are <b>CASCADE</b> because most children are <i>parts</i>; the few Restrict links protect data people care about.</p>` },

  { t: 'Exercise: order lines for CT Shop', giua: true, body: `
<p style="font-size:23px;margin:0">Create <b>product</b>, <b>orders</b> and <b>order_item</b> (composite PK, qty). <b>Deleting an order must delete its lines; a product that appears on a line must NOT be deletable.</b> Then prove both with real deletes.</p>
${zm(sql(`CREATE TABLE product (id int PRIMARY KEY, name text NOT NULL);
CREATE TABLE orders  (id int PRIMARY KEY, placed text);
CREATE TABLE order_item (
  order_id   int NOT NULL REFERENCES orders(id)  ON DELETE CASCADE,
  product_id int NOT NULL REFERENCES product(id) ON DELETE RESTRICT,
  qty        int NOT NULL,
  PRIMARY KEY (order_id, product_id)
);`, { sm: true }), 1.3)}
<p class="nho">Pause and write it first. Data: products 1 Keyboard, 2 Mouse · orders 10, 11 · lines (10,1,2) (10,2,1) (11,1,5).</p>` },

  { t: 'Exercise: the proof', giua: true, body: `
${zm(run(`DELETE FROM product WHERE id = 1;   -- sold on lines (10,1) and (11,1)
DELETE FROM orders  WHERE id = 10;   -- cascades to lines (10,1), (10,2)
SELECT * FROM order_item;
DELETE FROM product WHERE id = 2;    -- no longer referenced`, `ERROR:  update or delete on table "product" violates foreign key constraint "order_item_product_id_fkey" on table "order_item"
DETAIL:  Key (id)=(1) is still referenced from table "order_item".
DELETE 1
 order_id | product_id | qty
----------+------------+-----
       11 |          1 |   5
(1 row)

DELETE 1`, { hlOut: [1, 2, 3, 5, 9] }), 1.0)}
${two(box('RESTRICT worked', 'Product 1 is on two lines ⇒ refused. The error names <code class="i">order_item_product_id_fkey</code>.', 'info'),
box('CASCADE worked', 'Order 10 deleted ⇒ its two lines vanished; only line (11,1) is left. Then product 2, now unused, can go.', 'xanh'))}` },

  { t: 'Self-check', giua: true, body: `
<ol style="font-size:28px">
<li>What two things does a foreign key <b>prevent</b>? (one on INSERT, one on DELETE)</li>
<li>You delete a customer. Orders must be <b>kept</b> for accounting, <b>but</b> the customer’s optional <i>referrer</i> link should just be forgotten. Which <code class="i">ON DELETE</code> for each?</li>
<li>A parent delete is <b>slow</b>. What is the first thing to check about the child table?</li>
</ol>
${box('Answers', '<b>1.</b> Inserting a child whose parent does not exist (orphan); deleting a parent that still has children (with the default). <b>2.</b> Orders → <code class="i">RESTRICT</code> (default); referrer link → <code class="i">SET NULL</code>. <b>3.</b> Whether the FK column has an <b>index</b>.', 'xanh')}` },

  { t: 'Summary & what is next', to: true, body: `
<ul>
<li>FK = a column that <b>must match</b> a PK/UNIQUE value in the parent (<code class="i">REFERENCES</code>)</li>
<li>It blocks <b>orphans</b> on INSERT, and (by default) <b>parent deletion</b> while children exist</li>
<li><b>ON DELETE</b>: RESTRICT (default, safest) · CASCADE (child is part of parent) · SET NULL (optional link)</li>
<li>Beware cascade <b>chains</b> and the <b>missing index</b> on the child column</li>
<li>Adding an FK later validates all rows — fix orphans first</li>
</ul>
${box('Next: 3.3 — Column constraints', 'Keys cover identity and relations. Next: <code class="i">NOT NULL</code>, <code class="i">DEFAULT</code>, <code class="i">UNIQUE</code>, <code class="i">CHECK</code> and generated columns — the rest of what makes a row valid.', 'lam')}` },
]);
