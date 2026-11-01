/**
 * PostgreSQL · 0.4 — Mô hình tư duy: một máy chủ bạn nói chuyện bằng SQL. Bảng `notes` của bài 0.3 (created_at cố định
 * để kết quả không phụ thuộc giờ chạy).
 */
import { mod, pg, cs, q, kq, kqAn, ma, pre, TN, tn } from './_chung.mjs';

export const NOTES = `SET TimeZone = 'Asia/Ho_Chi_Minh';
CREATE TABLE notes (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title      varchar(200) NOT NULL,
  body       text,
  pinned     boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  meta       jsonb NOT NULL DEFAULT '{}'
);
INSERT INTO notes (title, body, pinned, created_at, meta) VALUES
  ('Learn PostgreSQL', 'Day one',             true,  '2026-10-01 08:00+07', '{"lang": "en", "tags": ["db", "sql"]}'),
  ('Buy coffee',       NULL,                  false, '2026-10-01 09:30+07', '{"lang": "en", "tags": []}'),
  ('Read the manual',  'The EXPLAIN chapter', true,  '2026-10-03 21:15+07', '{"lang": "en", "tags": ["sql"]}'),
  ('Học psql',         'Lệnh \\d và \\x',     false, '2026-10-04 07:45+07', '{"lang": "vi", "tags": ["psql"]}'),
  ('Ôn ACID',          NULL,                  true,  '2026-10-05 22:00+07', '{"lang": "vi", "tags": ["db"]}');`;

const LD = {
  en: `<h4>Sample table</h4>${pre(`notes (id identity PK, title varchar(200), body text NULL, pinned boolean, created_at timestamptz, meta jsonb)
5 rows — 3 pinned; meta = {"lang": "en"|"vi", "tags": [...]}`)}<p>Full script: the <code>notes.sql</code> tab.</p>`,
  vi: `<h4>Bảng mẫu</h4>${pre(`notes (id identity PK, title varchar(200), body text NULL, pinned boolean, created_at timestamptz, meta jsonb)
5 dòng — 3 dòng ghim; meta = {"lang": "en"|"vi", "tags": [...]}`)}<p>Script đầy đủ: tab <code>notes.sql</code>.</p>`,
};

export default mod('postgresql-0-4-mo-hinh', '0.4 The mental model: a server you talk to in SQL', [
  cs({
    t: 'Client, server and who does the work', k: 'EASY', p: 5,
    kn: ['client–server', 'declarative SQL'], tag: ['concepts'],
    en: '<p>Lesson 0.4 in five questions: PostgreSQL is a <b>server</b> you send SQL to, not a library inside your app.</p>',
    vi: '<p>Bài 0.4 trong năm câu: PostgreSQL là một <b>máy chủ</b> bạn gửi SQL tới, không phải thư viện nằm trong app.</p>',
    cau: [
      q('q1', ['Your Node.js API crashes in the middle of the day. What happens to the rows it already committed?', 'API Node.js của bạn sập giữa ngày. Các dòng nó đã commit thì sao?'], ['They stay: they live in the PostgreSQL server process and its files, not in the API', 'They are lost, because the connection closed', 'They are rolled back automatically when the client disappears', 'They stay only if the API called <code>pg.save()</code> before crashing'], ['The server owns the data; a client only sends requests. A committed transaction is durable no matter what the client does afterwards (only an OPEN transaction is rolled back when its connection dies).', 'Dữ liệu thuộc về máy chủ; client chỉ gửi yêu cầu. Giao dịch đã commit là bền dù client làm gì sau đó (chỉ giao dịch đang MỞ mới bị huỷ khi kết nối chết).']),
      q('q2', ['Which of these is a PostgreSQL <b>client</b>?', 'Cái nào là <b>client</b> của PostgreSQL?'], ['psql, pgAdmin, DBeaver and your Prisma app — all of them', 'only psql', 'only the Prisma app', 'none — PostgreSQL has no clients, it is embedded'], ['Every program that opens a connection and sends SQL is a client. They all talk the same wire protocol to the same server.', 'Mọi chương trình mở kết nối và gửi SQL đều là client. Chúng cùng nói một giao thức với cùng một máy chủ.']),
      q('q3', ['<code>SELECT title FROM notes WHERE pinned ORDER BY created_at DESC;</code> — who decides whether to read the whole table or use an index?', '<code>SELECT title FROM notes WHERE pinned ORDER BY created_at DESC;</code> — ai quyết định đọc cả bảng hay dùng chỉ mục?'], ['the server\'s planner — SQL says WHAT you want, not HOW', 'the order of words in your query', 'the client library', 'you, by writing the clauses in the right order'], ['SQL is declarative. The planner looks at statistics and available indexes and picks a plan; EXPLAIN shows its choice (chapter 10).', 'SQL là khai báo. Bộ lập kế hoạch xem thống kê và chỉ mục có sẵn rồi chọn cách chạy; EXPLAIN cho thấy lựa chọn đó (chương 10).']),
      q('q4', ['Two users load the same page at the same instant and both read <code>notes</code>. How many copies of the table exist?', 'Hai người mở cùng trang cùng lúc và cùng đọc <code>notes</code>. Có bao nhiêu bản của bảng?'], ['One — both connections read the same server-side table', 'Two — each connection gets its own copy', 'One per browser tab', 'It depends on the ORM'], ['There is one table on the server. Each connection has its own backend process and its own snapshot of what it may see (MVCC, chapter 11), but the data is stored once.', 'Chỉ có một bảng trên máy chủ. Mỗi kết nối có một tiến trình phục vụ và một ảnh chụp riêng về những gì nó được thấy (MVCC, chương 11), nhưng dữ liệu chỉ lưu một lần.']),
      q('q5', ['Where does the result of a SELECT get computed?', 'Kết quả của một câu SELECT được tính ở đâu?'], ['On the server; only the result rows travel back to the client', 'In the client, after downloading the whole table', 'Half in the client, half on the server', 'In the operating system cache'], ['Filtering, joining and sorting happen on the server next to the data; that is why a well-written query sends 10 rows over the network instead of 10 million.', 'Lọc, nối, sắp xếp diễn ra trên máy chủ, cạnh dữ liệu; vì vậy câu viết tốt chỉ gửi 10 dòng qua mạng thay vì 10 triệu.']),
    ],
    gy: [['Ask: which process holds the data files?', 'Tự hỏi: tiến trình nào giữ tệp dữ liệu?'], ['A client is anything that connects and sends SQL.', 'Client là bất cứ thứ gì kết nối và gửi SQL.']],
    lhg: [['Thinking of PostgreSQL like SQLite (a file inside your app) — then crashes, connections and pools make no sense.', 'Nghĩ PostgreSQL như SQLite (một tệp trong app) — khi đó sập, kết nối, pool đều khó hiểu.'], ['Believing the order you write WHERE conditions decides how the query runs.', 'Tin rằng thứ tự viết điều kiện WHERE quyết định cách truy vấn chạy.']],
    tn: [tn('client / server', 'máy khách / máy chủ'), tn('declarative', 'khai báo', 'nói muốn gì, không nói làm thế nào')],
  }),

  pg({
    t: 'Say what, not how: the pinned notes', k: 'EASY', p: 6,
    kn: ['SELECT', 'WHERE boolean', 'ORDER BY … DESC'], tag: ['select', 'notes'],
    en: '<p>The home screen of the Notes app shows the <b>pinned</b> notes, newest first. Return <code>title</code> and <code>created_at</code> of every pinned note, ordered by <code>created_at</code> from newest to oldest.</p>',
    vi: '<p>Màn hình chính của app Notes hiện các ghi chú <b>đã ghim</b>, mới nhất trước. Trả về <code>title</code> và <code>created_at</code> của mọi ghi chú đã ghim, sắp theo <code>created_at</code> từ mới tới cũ.</p>',
    yc: [['One SELECT on <code>notes</code>.', 'Một câu SELECT trên <code>notes</code>.'], ['Columns: <code>title, created_at</code>; newest first.', 'Cột: <code>title, created_at</code>; mới nhất trước.']],
    csdl: NOTES, tenCsdl: 'notes', ld: LD,
    giai: `SELECT title, created_at
FROM notes
WHERE pinned                 -- a boolean column is already a condition (= true is optional)
ORDER BY created_at DESC;`,
    kiem: [
      kq(['Three pinned notes, newest first', 'Ba ghi chú đã ghim, mới nhất trước'], { thuTu: true }),
      kqAn(['A newly pinned note appears in the right place', 'Ghi chú vừa ghim hiện đúng chỗ'], "UPDATE notes SET pinned = true WHERE title = 'Buy coffee'", { thuTu: true }),
      ma(['Filters on pinned', 'Lọc theo pinned'], '\\bWHERE\\b[\\s\\S]*\\bpinned\\b'),
    ],
    sai: ['SELECT title, created_at FROM notes WHERE pinned ORDER BY created_at', 'SELECT title, created_at FROM notes ORDER BY created_at DESC'],
    gy: [['<code>WHERE pinned</code> keeps the rows where the boolean is true.', '<code>WHERE pinned</code> giữ các dòng có giá trị boolean là true.'], ['<code>ORDER BY created_at DESC</code> puts the latest first.', '<code>ORDER BY created_at DESC</code> đưa dòng mới nhất lên đầu.']],
    lhg: [['Forgetting DESC — ORDER BY is ascending (oldest first) by default.', 'Quên DESC — ORDER BY mặc định tăng dần (cũ nhất trước).'], ['Relying on the order rows were inserted: without ORDER BY the order is not guaranteed.', 'Dựa vào thứ tự chèn: không có ORDER BY thì thứ tự không được bảo đảm.']],
    gt: ['<p>You describe the rows you want (pinned) and the order (newest first); the server decides how to find them. The hidden check pins one more note and expects it to appear at its correct place.</p>', '<p>Bạn mô tả dòng muốn lấy (đã ghim) và thứ tự (mới nhất trước); máy chủ tự quyết cách tìm. Kiểm ẩn ghim thêm một ghi chú và mong nó hiện đúng vị trí.</p>'],
    tn: [tn('ORDER BY … DESC', 'sắp giảm dần')],
  }),

  pg({
    t: 'A glimpse of the power types: read JSON from a column', k: 'MEDIUM', p: 8,
    kn: ['jsonb ->>', 'jsonb_array_length', '::cast'], tag: ['jsonb', 'notes'],
    en: '<p>Each note carries a small JSON document in <code>meta</code>, e.g. <code>{"lang": "vi", "tags": ["psql"]}</code>. For every note return <code>id</code>, <code>title</code>, <code>lang</code> (the text value of key <code>lang</code>) and <code>tag_count</code> (how many tags the array holds), ordered by id.</p>',
    vi: '<p>Mỗi ghi chú mang một tài liệu JSON nhỏ trong <code>meta</code>, vd <code>{"lang": "vi", "tags": ["psql"]}</code>. Với mọi ghi chú trả về <code>id</code>, <code>title</code>, <code>lang</code> (giá trị chữ của khoá <code>lang</code>) và <code>tag_count</code> (số phần tử của mảng tags), sắp theo id.</p>',
    yc: [['<code>meta -&gt;&gt; \'lang\'</code> gives text; <code>meta -&gt; \'tags\'</code> gives a jsonb array.', '<code>meta -&gt;&gt; \'lang\'</code> trả chữ; <code>meta -&gt; \'tags\'</code> trả mảng jsonb.'], ['Columns exactly <code>id, title, lang, tag_count</code>.', 'Cột đúng <code>id, title, lang, tag_count</code>.']],
    csdl: NOTES, tenCsdl: 'notes', ld: LD,
    giai: `SELECT id,
       title,
       meta ->> 'lang'                      AS lang,       -- ->> : value as text
       jsonb_array_length(meta -> 'tags')   AS tag_count   -- ->  : value as jsonb (here an array)
FROM notes
ORDER BY id;`,
    kiem: [
      kq(['Language and tag count of every note', 'Ngôn ngữ và số thẻ của mọi ghi chú'], { thuTu: true }),
      kqAn(['A note with three tags', 'Một ghi chú có ba thẻ'], "INSERT INTO notes (title, meta) VALUES ('Index tips', '{\"lang\": \"en\", \"tags\": [\"db\", \"index\", \"perf\"]}')", { thuTu: true }),
      ma(['lang is read as TEXT with ->>', 'lang được đọc thành CHỮ bằng ->>'], "->>\\s*'lang'"),
    ],
    sai: ["SELECT id, title, meta -> 'lang' AS lang, jsonb_array_length(meta -> 'tags') AS tag_count FROM notes ORDER BY id", "SELECT id, title, meta ->> 'lang' AS lang, length(meta ->> 'tags') AS tag_count FROM notes ORDER BY id"],
    gy: [['<code>-&gt;</code> keeps JSON, <code>-&gt;&gt;</code> turns the value into text.', '<code>-&gt;</code> giữ JSON, <code>-&gt;&gt;</code> biến giá trị thành chữ.'], ['<code>jsonb_array_length(jsonb)</code> counts the elements of a JSON array.', '<code>jsonb_array_length(jsonb)</code> đếm phần tử của mảng JSON.']],
    lhg: [['Using <code>-&gt;</code> for lang — you get the JSON string <code>"vi"</code> with quotes, not the text vi.', 'Dùng <code>-&gt;</code> cho lang — nhận chuỗi JSON <code>"vi"</code> có ngoặc kép, không phải chữ vi.'], ['<code>length(meta -&gt;&gt; \'tags\')</code> counts characters of the text <code>["db", "sql"]</code>, not elements.', '<code>length(meta -&gt;&gt; \'tags\')</code> đếm ký tự của chuỗi <code>["db", "sql"]</code>, không đếm phần tử.']],
    gt: ['<p>PostgreSQL stores <code>jsonb</code> parsed, so it can reach inside documents with operators. Chapter 13 adds containment (<code>@&gt;</code>) and GIN indexes on top of this.</p>', '<p>PostgreSQL lưu <code>jsonb</code> ở dạng đã phân tích nên với được vào trong tài liệu bằng toán tử. Chương 13 thêm phép chứa (<code>@&gt;</code>) và chỉ mục GIN.</p>'],
    tn: [TN.jsonb],
  }),
]);
