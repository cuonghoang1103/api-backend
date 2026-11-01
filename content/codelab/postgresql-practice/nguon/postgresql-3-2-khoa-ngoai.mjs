/** PostgreSQL · 3.2 — Khoá ngoại & toàn vẹn tham chiếu: RESTRICT (mặc định), CASCADE, SET NULL. */
import { mod, pg, cs, bang1, sau, chan, duoc, ma, pre, TN, tn } from './_chung.mjs';

const U_R = `CREATE TABLE u_r (id int PRIMARY KEY, name text NOT NULL);
INSERT INTO u_r VALUES (1, 'Cuong'), (2, 'Lan'), (3, 'Minh');
CREATE TABLE n_r (
  id      int PRIMARY KEY,
  user_id int NOT NULL REFERENCES u_r(id),   -- default action: NO ACTION (refuse)
  title   text
);
INSERT INTO n_r VALUES (1, 1, 'a'), (2, 1, 'b'), (3, 2, 'c');`;
const POST = `CREATE TABLE post (id int PRIMARY KEY, title text NOT NULL);
INSERT INTO post VALUES (1, 'Hello'), (2, 'Indexes'), (3, 'Backups');
CREATE TABLE author (id int PRIMARY KEY, name text NOT NULL);
INSERT INTO author VALUES (1, 'Cuong'), (2, 'Lan');`;
const ACT = ['CASCADE', 'RESTRICT', 'SET NULL'];

export default mod('postgresql-3-2-khoa-ngoai', '3.2 Foreign keys & referential integrity', [
  pg({
    t: 'Delete a user the foreign key allows', k: 'EASY', p: 6, kn: ['NO ACTION / RESTRICT', 'delete order'], tag: ['fk', 'dml'],
    csdl: U_R, tenCsdl: 'users_notes', ld: { en: pre('u_r (id PK, name) — 1 Cuong, 2 Lan, 3 Minh\nn_r (id PK, user_id → u_r.id (default: refuse), title) — notes 1, 2 of Cuong; note 3 of Lan'), vi: pre('u_r (id PK, name) — 1 Cuong, 2 Lan, 3 Minh\nn_r (id PK, user_id → u_r.id (mặc định: từ chối), title) — ghi chú 1, 2 của Cuong; ghi chú 3 của Lan') },
    en: '<p><code>DELETE FROM u_r WHERE id = 1</code> fails: Cuong still has notes and the foreign key refuses. The user asked to close the account <b>and</b> erase their notes. Write the statements that delete Cuong and his notes — without changing the constraint.</p>',
    vi: '<p><code>DELETE FROM u_r WHERE id = 1</code> lỗi: Cuong còn ghi chú và khoá ngoại từ chối. Người dùng yêu cầu đóng tài khoản <b>và</b> xoá ghi chú của họ. Viết các lệnh xoá Cuong và ghi chú của anh — không sửa ràng buộc.</p>',
    yc: [['Children first (n_r), then the parent (u_r).', 'Xoá con trước (n_r), rồi tới cha (u_r).'], ['Only Cuong\'s rows disappear.', 'Chỉ các dòng của Cuong biến mất.']],
    giai: `DELETE FROM n_r WHERE user_id = 1;   -- the rows that point at Cuong …
DELETE FROM u_r WHERE id = 1;        -- … then nothing references him any more`,
    kiem: [
      sau(['Users left', 'User còn lại'], 'SELECT id, name FROM u_r ORDER BY id', { thuTu: true }),
      sau(['Notes left', 'Ghi chú còn lại'], 'SELECT id, user_id FROM n_r ORDER BY id', { thuTu: true }),
      sau(['Other users keep their notes', 'User khác giữ nguyên ghi chú'], 'SELECT count(*) AS notes_of_lan FROM n_r WHERE user_id = 2', { an: true, themCsdl: "INSERT INTO n_r VALUES (4, 2, 'd'), (5, 1, 'e')" }),
    ],
    sai: ['DELETE FROM u_r WHERE id = 1', 'DELETE FROM n_r; DELETE FROM u_r WHERE id = 1;'],
    gy: [['The foreign key is checked at the end of each statement: remove what points at the user first.', 'Khoá ngoại được kiểm cuối mỗi lệnh: xoá những gì trỏ tới user trước.'], ['<code>DELETE FROM n_r WHERE user_id = 1</code>.', '<code>DELETE FROM n_r WHERE user_id = 1</code>.']],
    lhg: [['Deleting the parent first: <code>violates foreign key constraint "n_r_user_id_fkey"</code> (23503).', 'Xoá cha trước: <code>violates foreign key constraint "n_r_user_id_fkey"</code> (23503).'], ['<code>DELETE FROM n_r</code> without WHERE — Lan loses her notes too.', '<code>DELETE FROM n_r</code> không WHERE — Lan mất luôn ghi chú.']],
    gt: ['<p>The default action (NO ACTION) protects you from deleting something still referenced. It forces you to decide, explicitly, what happens to the children — here: delete them first.</p>', '<p>Hành động mặc định (NO ACTION) chặn bạn xoá thứ vẫn đang được trỏ tới. Nó buộc bạn quyết định tường minh số phận dòng con — ở đây: xoá chúng trước.</p>'],
    tn: [TN.fk, tn('ON DELETE NO ACTION', 'mặc định: từ chối xoá cha còn con')],
  }),

  pg({
    t: 'Comments die with their post: ON DELETE CASCADE', k: 'MEDIUM', p: 8, kn: ['ON DELETE CASCADE'], tag: ['fk', 'ddl'],
    csdl: POST, tenCsdl: 'post', ld: { en: pre('post (id PK, title) — 3 posts · author (id PK, name) — 2 authors'), vi: pre('post (id PK, title) — 3 bài · author (id PK, name) — 2 tác giả') },
    en: '<p>Create <code>comment (id int PRIMARY KEY, post_id int NOT NULL, body text NOT NULL)</code>. A comment has no meaning without its post: deleting a post must delete its comments automatically.</p>',
    vi: '<p>Tạo <code>comment (id int PRIMARY KEY, post_id int NOT NULL, body text NOT NULL)</code>. Bình luận không còn ý nghĩa khi mất bài viết: xoá bài phải tự xoá các bình luận của nó.</p>',
    yc: [['<code>post_id … REFERENCES post(id) ON DELETE CASCADE</code>.', '<code>post_id … REFERENCES post(id) ON DELETE CASCADE</code>.'], ['Just the CREATE TABLE.', 'Chỉ lệnh CREATE TABLE.']],
    giai: `CREATE TABLE comment (
  id      int PRIMARY KEY,
  post_id int NOT NULL REFERENCES post(id) ON DELETE CASCADE,   -- parent gone ⇒ children gone
  body    text NOT NULL
);`,
    kiem: [
      sau(['Deleting post 1 removes its two comments', 'Xoá bài 1 xoá luôn hai bình luận của nó'], "INSERT INTO comment VALUES (1, 1, 'nice'), (2, 1, 'thanks'), (3, 2, 'great'); DELETE FROM post WHERE id = 1; SELECT id, post_id FROM comment ORDER BY id", { thuTu: true }),
      chan(['A comment on a missing post is rejected', 'Bình luận cho bài không tồn tại bị chặn'], "INSERT INTO comment VALUES (9, 99, 'ghost')", '23503'),
      chan(['A comment without post is rejected', 'Bình luận không có bài bị chặn'], "INSERT INTO comment (id, body) VALUES (9, 'orphan')", '23502', { an: true }),
    ],
    sai: ['CREATE TABLE comment (id int PRIMARY KEY, post_id int NOT NULL REFERENCES post(id), body text NOT NULL)', 'CREATE TABLE comment (id int PRIMARY KEY, post_id int REFERENCES post(id) ON DELETE SET NULL, body text NOT NULL)'],
    gy: [['The action is part of the REFERENCES clause.', 'Hành động là một phần của mệnh đề REFERENCES.'], ['CASCADE = delete the children too.', 'CASCADE = xoá luôn dòng con.']],
    lhg: [['Plain REFERENCES: deleting the post fails while comments exist.', 'REFERENCES trơn: xoá bài lỗi khi còn bình luận.'], ['SET NULL: comments survive as orphans pointing nowhere.', 'SET NULL: bình luận sống sót thành mồ côi trỏ vào hư không.']],
    gt: ['<p>CASCADE is right when the child is a PART of the parent (comments of a post, lines of an order). It is wrong when the child is valuable on its own — then RESTRICT or SET NULL.</p>', '<p>CASCADE đúng khi dòng con là MỘT PHẦN của dòng cha (bình luận của bài, dòng của đơn). Sai khi dòng con có giá trị riêng — khi đó dùng RESTRICT hoặc SET NULL.</p>'],
    tn: [tn('ON DELETE CASCADE', 'xoá dây chuyền')],
  }),

  cs({
    t: 'Choose ON DELETE for every CT Shop link', k: 'MEDIUM', p: 6, loai: 'table', kn: ['CASCADE', 'RESTRICT', 'SET NULL'], tag: ['fk', 'design', 'ctshop'],
    en: '<p>For each foreign key, decide what deleting the parent should do. The answers follow the lab schema of CT Shop (Lab 1).</p>',
    vi: '<p>Với mỗi khoá ngoại, quyết định xoá dòng cha thì sao. Đáp án theo lược đồ lab CT Shop (Lab 1).</p>',
    bang: [bang1('b1', ['Foreign key → ON DELETE', 'Khoá ngoại → ON DELETE'], [{ ma: 'fk', ten: 'Foreign key / Khoá ngoại' }, { ma: 'act', ten: 'ON DELETE', luaChon: ACT }], [
      { o: { fk: 'order_item.order_id → orders (lines of an order) / dòng của đơn' }, a: { act: 'CASCADE' } },
      { o: { fk: 'order_item.product_id → product (a product that was sold) / sản phẩm đã bán' }, a: { act: 'RESTRICT' } },
      { o: { fk: 'orders.customer_id → customer (orders are accounting records) / đơn là chứng từ kế toán' }, a: { act: 'RESTRICT' } },
      { o: { fk: 'category.parent_id → category (a category that still has children) / danh mục còn con' }, a: { act: 'RESTRICT' } },
      { o: { fk: 'note.author_id → author, where notes stay public after the author leaves / ghi chú vẫn công khai khi tác giả rời đi' }, a: { act: 'SET NULL' } },
    ], ['Lines are part of an order ⇒ CASCADE. Sales history and accounting must never vanish because someone deletes a product or a customer ⇒ RESTRICT (deactivate them instead). A note that outlives its author keeps the row and forgets the link ⇒ SET NULL (the column must be nullable).', 'Dòng là một phần của đơn ⇒ CASCADE. Lịch sử bán và chứng từ không được biến mất chỉ vì ai đó xoá sản phẩm hay khách ⇒ RESTRICT (thay vào đó cho ngừng hoạt động). Ghi chú sống lâu hơn tác giả thì giữ dòng, bỏ mối nối ⇒ SET NULL (cột phải cho phép NULL).'])],
    gy: [['Is the child a part of the parent, or a record with its own value?', 'Dòng con là một phần của cha, hay là bản ghi có giá trị riêng?'], ['Money and history ⇒ never cascade.', 'Tiền và lịch sử ⇒ đừng bao giờ cascade.']],
    lhg: [['CASCADE everywhere "to make deletes easy" — one DELETE on customer erases years of orders.', 'CASCADE khắp nơi "cho dễ xoá" — một lệnh DELETE khách xoá sạch nhiều năm đơn hàng.'], ['SET NULL on a NOT NULL column — the delete fails anyway.', 'SET NULL trên cột NOT NULL — lệnh xoá vẫn lỗi.']],
    tn: [tn('RESTRICT', 'cấm xoá cha còn con'), tn('SET NULL', 'đặt khoá ngoại về NULL')],
  }),

  pg({
    t: 'Notes that outlive their author: ON DELETE SET NULL', k: 'HARD', p: 10, kn: ['ON DELETE SET NULL', 'nullable foreign key', 'several FKs in one table'], tag: ['fk', 'ddl'],
    csdl: POST, tenCsdl: 'post', ld: { en: pre('post (id PK, title) — 3 posts · author (id PK, name) — 1 Cuong, 2 Lan'), vi: pre('post (id PK, title) — 3 bài · author (id PK, name) — 1 Cuong, 2 Lan') },
    en: '<p>Create <code>note (id int PRIMARY KEY, post_id int NOT NULL, author_id int, body text NOT NULL)</code>: a note belongs to a post (deleting the post deletes its notes) and was written by an author — but when an author account is deleted, their notes must <b>stay</b>, just without author.</p>',
    vi: '<p>Tạo <code>note (id int PRIMARY KEY, post_id int NOT NULL, author_id int, body text NOT NULL)</code>: ghi chú thuộc một bài (xoá bài thì xoá ghi chú) và do một tác giả viết — nhưng khi tài khoản tác giả bị xoá, ghi chú phải <b>ở lại</b>, chỉ không còn tác giả.</p>',
    yc: [['Two foreign keys with two different ON DELETE actions.', 'Hai khoá ngoại với hai hành động ON DELETE khác nhau.'], ['<code>author_id</code> must allow NULL.', '<code>author_id</code> phải cho phép NULL.']],
    giai: `CREATE TABLE note (
  id         int  PRIMARY KEY,
  post_id    int  NOT NULL REFERENCES post(id)   ON DELETE CASCADE,    -- part of the post
  author_id  int           REFERENCES author(id) ON DELETE SET NULL,   -- survives its author
  body       text NOT NULL
);`,
    kiem: [
      sau(['Deleting author 1 keeps the notes, author NULL', 'Xoá tác giả 1 giữ ghi chú, tác giả NULL'], "INSERT INTO note VALUES (1, 1, 1, 'a'), (2, 2, 1, 'b'), (3, 2, 2, 'c'); DELETE FROM author WHERE id = 1; SELECT id, post_id, author_id FROM note ORDER BY id", { thuTu: true }),
      sau(['Deleting post 2 deletes its notes', 'Xoá bài 2 xoá ghi chú của nó'], "INSERT INTO note VALUES (1, 1, 1, 'a'), (2, 2, 1, 'b'), (3, 2, 2, 'c'); DELETE FROM post WHERE id = 2; SELECT id FROM note ORDER BY id", { thuTu: true }),
      chan(['An unknown author is rejected', 'Tác giả không tồn tại bị chặn'], "INSERT INTO note VALUES (9, 1, 99, 'x')", '23503'),
      duoc(['An anonymous note is allowed', 'Ghi chú ẩn danh được phép'], "INSERT INTO note VALUES (9, 1, NULL, 'anonymous')", { an: true }),
    ],
    sai: ['CREATE TABLE note (id int PRIMARY KEY, post_id int NOT NULL REFERENCES post(id) ON DELETE CASCADE, author_id int REFERENCES author(id) ON DELETE CASCADE, body text NOT NULL)', 'CREATE TABLE note (id int PRIMARY KEY, post_id int NOT NULL REFERENCES post(id) ON DELETE SET NULL, author_id int REFERENCES author(id) ON DELETE SET NULL, body text NOT NULL)'],
    gy: [['Each REFERENCES clause gets its own ON DELETE.', 'Mỗi mệnh đề REFERENCES có ON DELETE riêng.'], ['SET NULL needs a nullable column; CASCADE fits the post link.', 'SET NULL cần cột cho phép NULL; CASCADE hợp với mối nối tới bài.']],
    lhg: [['CASCADE on author: deleting an account silently deletes everything they ever wrote.', 'CASCADE trên tác giả: xoá tài khoản là lặng lẽ xoá mọi thứ họ từng viết.'], ['SET NULL on post_id (NOT NULL): deleting a post fails with a NOT NULL violation.', 'SET NULL trên post_id (NOT NULL): xoá bài lỗi vi phạm NOT NULL.']],
    gt: ['<p>The ON DELETE action describes the meaning of the relationship. "Part of" ⇒ CASCADE; "written by, but independent" ⇒ SET NULL; "must not lose history" ⇒ RESTRICT. One table can mix them.</p>', '<p>Hành động ON DELETE mô tả ý nghĩa của mối quan hệ. "Là một phần của" ⇒ CASCADE; "do ai viết, nhưng độc lập" ⇒ SET NULL; "không được mất lịch sử" ⇒ RESTRICT. Một bảng có thể dùng lẫn.</p>'],
    tn: [tn('ON DELETE SET NULL', 'đặt NULL khi cha bị xoá'), tn('ON DELETE CASCADE', 'xoá dây chuyền')],
  }),
]);
