/** PostgreSQL · 1.1 — Mô hình quan hệ. Bảng users + notes của bài (dữ liệu nhỏ tự soạn). */
import { mod, pg, cs, q, kq, kqAn, sau, chan, duoc, ma, pre, TN, tn } from './_chung.mjs';

const USERS = `CREATE TABLE users (
  id       bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username text NOT NULL UNIQUE,
  email    text NOT NULL
);
INSERT INTO users (username, email) VALUES ('cuong', 'cuong@notes.vn'), ('lan', 'lan@notes.vn'), ('minh', 'minh@notes.vn');`;
const NOTES = `${USERS}
CREATE TABLE notes (
  id       bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id  bigint NOT NULL REFERENCES users(id),
  title    varchar(200) NOT NULL,
  pinned   boolean NOT NULL DEFAULT false
);
INSERT INTO notes (user_id, title, pinned) VALUES
  (1, 'Learn PostgreSQL', true), (2, 'Buy coffee', false), (1, 'Read the manual', false),
  (2, 'Plan the trip', true), (1, 'Call mom', false);`;
const LD = {
  en: `<h4>Sample tables (lesson 1.1)</h4>${pre(`users (id identity PK, username UNIQUE, email)            3 rows: cuong, lan, minh
notes (id identity PK, user_id → users.id, title, pinned)  5 rows — minh has no note yet`)}`,
  vi: `<h4>Bảng mẫu (bài 1.1)</h4>${pre(`users (id identity PK, username UNIQUE, email)            3 dòng: cuong, lan, minh
notes (id identity PK, user_id → users.id, title, pinned)  5 dòng — minh chưa có ghi chú nào`)}`,
};

export default mod('postgresql-1-1-mo-hinh-quan-he', '1.1 The relational model & why it won', [
  cs({
    t: 'Tables, rows, keys — the vocabulary', k: 'EASY', p: 5, kn: ['relation', 'primary key', 'foreign key'], tag: ['concepts'],
    en: '<p>Five questions on the words lesson 1.1 builds everything on.</p>', vi: '<p>Năm câu về những từ mà bài 1.1 dựng mọi thứ lên trên.</p>',
    cau: [
      q('q1', ['In table <code>notes</code>, what is one <b>row</b>?', 'Trong bảng <code>notes</code>, một <b>dòng</b> là gì?'], ['one note, with a value for every column', 'one column, e.g. all titles', 'one user and all of their notes', 'the definition of the table'], ['A row (tuple) is one fact: one note with its id, owner, title and pinned flag. A column is one attribute across all rows.', 'Một dòng (bộ) là một sự kiện: một ghi chú với id, chủ, tiêu đề và cờ ghim. Một cột là một thuộc tính trên mọi dòng.']),
      q('q2', ['What does <code>notes.user_id REFERENCES users(id)</code> guarantee?', '<code>notes.user_id REFERENCES users(id)</code> bảo đảm điều gì?'], ['every note points to a user that really exists', 'every user has at least one note', 'user ids are never reused', 'notes are deleted when their user is deleted'], ['A foreign key only checks the link: the referenced id must exist. It does not force users to have notes, and deleting a user with notes is REFUSED by default (cascade is opt-in, lesson 3.2).', 'Khoá ngoại chỉ kiểm mối nối: id được trỏ tới phải tồn tại. Nó không bắt user phải có ghi chú, và xoá user còn ghi chú bị TỪ CHỐI theo mặc định (cascade phải tự bật, bài 3.2).']),
      q('q3', ['Why store the username once in <code>users</code> instead of in every note?', 'Vì sao lưu username một lần ở <code>users</code> thay vì trong mọi ghi chú?'], ['renaming a user is then one UPDATE of one row, with no copy left behind', 'it makes SELECT faster in every case', 'PostgreSQL forbids repeated text', 'usernames are too long for the notes table'], ['One fact in one place: a rename touches one row. Copies drift apart the day one update misses a row (the update anomaly of lesson 3.4).', 'Một sự kiện ở một chỗ: đổi tên chỉ sửa một dòng. Bản sao sẽ lệch nhau ngay khi một lần cập nhật sót dòng (dị thường cập nhật, bài 3.4).']),
      q('q4', ['What is the primary key for?', 'Khoá chính dùng để làm gì?'], ['to name each row uniquely so others can point at it', 'to keep the table sorted on disk by that column', 'to make every query on the table faster', 'to remember the order in which rows were created'], ['A primary key is UNIQUE + NOT NULL: a stable name for a row. It does come with an index, but its job is identity, not ordering.', 'Khoá chính là UNIQUE + NOT NULL: tên ổn định cho một dòng. Nó có kèm chỉ mục, nhưng việc của nó là định danh, không phải sắp xếp.']),
      q('q5', ['The relational model "won" mainly because…', 'Mô hình quan hệ "thắng" chủ yếu vì…'], ['declarative questions + rules enforced for every app', 'tables are the fastest structure for any kind of data', 'it was the very first database model ever invented', 'it needs no schema, so apps can store anything'], ['SQL describes WHAT you want and constraints live in the database, so every client gets the same guarantees. Speed depends on indexes and plans, not on the model.', 'SQL mô tả CÁI bạn muốn và ràng buộc nằm trong CSDL nên mọi client có cùng bảo đảm. Tốc độ phụ thuộc chỉ mục và kế hoạch, không phụ thuộc mô hình.']),
    ],
    gy: [['Think "one row = one fact".', 'Nghĩ "một dòng = một sự kiện".'], ['A key identifies; a foreign key links.', 'Khoá để định danh; khoá ngoại để nối.']],
    lhg: [['Believing a foreign key cascades deletes by default.', 'Tin rằng khoá ngoại mặc định xoá dây chuyền.'], ['Mixing up a row and a column.', 'Nhầm dòng với cột.']],
    tn: [TN.pk, TN.fk],
  }),

  pg({
    t: 'Put the rows back together: who wrote which note', k: 'EASY', p: 7, kn: ['JOIN … ON', 'aliases'], tag: ['join', 'notes'],
    en: '<p>A note only stores <code>user_id</code>. Return <code>username, title, pinned</code> for every note, ordered by <code>username</code> then by note <code>id</code>.</p>',
    vi: '<p>Ghi chú chỉ lưu <code>user_id</code>. Trả về <code>username, title, pinned</code> cho mọi ghi chú, sắp theo <code>username</code> rồi theo <code>id</code> của ghi chú.</p>',
    yc: [['Join <code>notes</code> to <code>users</code> on <code>users.id = notes.user_id</code>.', 'Nối <code>notes</code> với <code>users</code> theo <code>users.id = notes.user_id</code>.'], ['Order: username, then note id.', 'Thứ tự: username, rồi id ghi chú.']],
    csdl: NOTES, tenCsdl: 'notes', ld: LD,
    giai: `SELECT u.username, n.title, n.pinned
FROM notes n
JOIN users u ON u.id = n.user_id     -- the foreign key is the join path
ORDER BY u.username, n.id;`,
    kiem: [
      kq(['Five notes with their author', 'Năm ghi chú kèm tác giả'], { thuTu: true }),
      kqAn(['minh writes a note — it appears after the notes of lan', 'minh viết một ghi chú — nó hiện sau lan'], "INSERT INTO notes (user_id, title) VALUES (3, 'First note')", { thuTu: true }),
      ma(['Uses JOIN', 'Dùng JOIN'], '\\bJOIN\\b'),
    ],
    sai: ['SELECT u.username, n.title, n.pinned FROM notes n JOIN users u ON u.id = n.id ORDER BY u.username, n.id', 'SELECT u.username, n.title, n.pinned FROM notes n JOIN users u ON u.id = n.user_id ORDER BY n.id'],
    gy: [['FROM notes n JOIN users u ON …', 'FROM notes n JOIN users u ON …'], ['The link is <code>u.id = n.user_id</code> — not <code>n.id</code>.', 'Mối nối là <code>u.id = n.user_id</code> — không phải <code>n.id</code>.']],
    lhg: [['Joining on <code>u.id = n.id</code>: a note\'s own id has nothing to do with its author — rows pair up by accident.', 'Nối theo <code>u.id = n.id</code>: id của ghi chú chẳng liên quan tới tác giả — các dòng ghép bừa.'], ['Ordering by note id only — the brief asks username first.', 'Chỉ sắp theo id ghi chú — đề yêu cầu username trước.']],
    gt: ['<p>The foreign key column <code>user_id</code> is the path between the two tables; JOIN … ON follows it and returns one row per matching pair.</p>', '<p>Cột khoá ngoại <code>user_id</code> là đường nối hai bảng; JOIN … ON đi theo nó và trả một dòng cho mỗi cặp khớp.</p>'],
    tn: [TN.join],
  }),

  pg({
    t: 'Let the database refuse orphan notes', k: 'MEDIUM', p: 10, kn: ['REFERENCES', 'NOT NULL', 'referential integrity'], tag: ['ddl', 'fk', 'notes'],
    en: '<p>Table <code>users</code> already exists (3 users). Create table <code>notes</code> so that the <b>database itself</b> refuses a note of a user that does not exist, and a note without owner:</p>' + pre('notes: id bigint identity PK, user_id bigint (required, must be a real users.id), title varchar(200) required, pinned boolean required default false'),
    vi: '<p>Bảng <code>users</code> đã có (3 user). Tạo bảng <code>notes</code> sao cho <b>chính CSDL</b> từ chối ghi chú của user không tồn tại, và ghi chú không có chủ:</p>' + pre('notes: id bigint identity PK, user_id bigint (bắt buộc, phải là users.id có thật), title varchar(200) bắt buộc, pinned boolean bắt buộc mặc định false'),
    yc: [['One <code>CREATE TABLE notes</code>.', 'Một lệnh <code>CREATE TABLE notes</code>.'], ['<code>user_id … NOT NULL REFERENCES users(id)</code>.', '<code>user_id … NOT NULL REFERENCES users(id)</code>.']],
    csdl: USERS, tenCsdl: 'users', ld: null,
    giai: `CREATE TABLE notes (
  id       bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id  bigint NOT NULL REFERENCES users(id),   -- no owner, or a fake owner ⇒ rejected
  title    varchar(200) NOT NULL,
  pinned   boolean NOT NULL DEFAULT false
);`,
    kiem: [
      duoc(['A note of user 1 is accepted', 'Ghi chú của user 1 được nhận'], "INSERT INTO notes (user_id, title) VALUES (1, 'ok')"),
      chan(['A note of user 999 is rejected (foreign key)', 'Ghi chú của user 999 bị chặn (khoá ngoại)'], "INSERT INTO notes (user_id, title) VALUES (999, 'orphan note')", '23503'),
      chan(['A note without owner is rejected', 'Ghi chú không có chủ bị chặn'], "INSERT INTO notes (title) VALUES ('nobody')", '23502'),
      chan(['Deleting a user who still has notes is refused', 'Xoá user còn ghi chú bị từ chối'], "INSERT INTO notes (user_id, title) VALUES (2, 'x'); DELETE FROM users WHERE id = 2", '23503', { an: true }),
      sau(['Columns', 'Các cột'], "SELECT column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_name = 'notes' AND column_name <> 'id' ORDER BY ordinal_position", { thuTu: true, an: true }),
    ],
    sai: ['CREATE TABLE notes (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, user_id bigint NOT NULL, title varchar(200) NOT NULL, pinned boolean NOT NULL DEFAULT false)', 'CREATE TABLE notes (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, user_id bigint REFERENCES users(id), title varchar(200) NOT NULL, pinned boolean NOT NULL DEFAULT false)'],
    gy: [['Write the column first, then its rules: <code>user_id bigint NOT NULL REFERENCES users(id)</code>.', 'Viết cột trước rồi tới luật: <code>user_id bigint NOT NULL REFERENCES users(id)</code>.'], ['REFERENCES alone still allows NULL — add NOT NULL.', 'Chỉ REFERENCES thì vẫn cho NULL — thêm NOT NULL.']],
    lhg: [['A plain <code>user_id bigint</code> column: the app "always" checks the user exists… until one code path forgets.', 'Cột <code>user_id bigint</code> trơn: app "luôn" kiểm user tồn tại… cho tới khi một nhánh mã quên.'], ['REFERENCES without NOT NULL: a note with user_id NULL is a valid row to a foreign key.', 'REFERENCES mà thiếu NOT NULL: với khoá ngoại, ghi chú có user_id NULL vẫn hợp lệ.']],
    gt: ['<p>The foreign key is checked on every INSERT/UPDATE of notes and on every DELETE/UPDATE of users — from every client. NOT NULL closes the remaining gap, because a foreign key ignores NULLs.</p>', '<p>Khoá ngoại được kiểm ở mọi INSERT/UPDATE của notes và mọi DELETE/UPDATE của users — từ mọi client. NOT NULL bịt khe còn lại, vì khoá ngoại bỏ qua NULL.</p>'],
    tn: [TN.fk, tn('orphan row', 'dòng mồ côi', 'dòng trỏ tới thứ không tồn tại')],
  }),
]);
