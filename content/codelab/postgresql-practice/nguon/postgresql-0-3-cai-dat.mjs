/**
 * PostgreSQL · 0.3 — Cài đặt PostgreSQL & làm quen psql. Bài 1 chạy trên MÁY người học (Docker + psql — trình duyệt
 * không cài được máy chủ cho bạn); bài 2 trắc nghiệm lệnh tắt psql; bài 3 dựng bảng `notes` đầu tiên (chấm thật).
 */
import { mod, pg, cs, tay, q, kq, sau, chan, duoc, ma, c, pre, TN, tn } from './_chung.mjs';

const NOTES_DDL = `CREATE TABLE notes (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title      varchar(200) NOT NULL,
  body       text,
  pinned     boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);`;

export default mod('postgresql-0-3-cai-dat', '0.3 Installing PostgreSQL & meeting psql', [
  tay({
    t: 'Run PostgreSQL 17 in Docker and say hello from psql', k: 'EASY', p: 15,
    kn: ['docker run', 'psql', 'connection parameters'], tag: ['setup', 'psql'],
    en: `<p>Every lab of this course runs on a real PostgreSQL 17 server on your machine. Start one in Docker exactly as lesson 0.3 does (container <code>pg17</code>, password <code>123456</code>, host port <code>5444</code>), connect with psql and prove it answers.</p>${pre(`docker run -d --name pg17 -e POSTGRES_PASSWORD=123456 -p 5444:5432 postgres:17
psql -h localhost -p 5444 -U postgres -c "SELECT version();" -c "SHOW server_version;"`)}`,
    vi: `<p>Mọi lab của khoá chạy trên một máy chủ PostgreSQL 17 thật trên máy bạn. Dựng một máy trong Docker đúng như bài 0.3 (container <code>pg17</code>, mật khẩu <code>123456</code>, cổng máy <code>5444</code>), kết nối bằng psql và chứng minh nó trả lời.</p>${pre(`docker run -d --name pg17 -e POSTGRES_PASSWORD=123456 -p 5444:5432 postgres:17
psql -h localhost -p 5444 -U postgres -c "SELECT version();" -c "SHOW server_version;"`)}`,
    yc: [
      ['<code>docker ps</code> lists <code>pg17</code> with <code>0.0.0.0:5444-&gt;5432/tcp</code>.', '<code>docker ps</code> liệt kê <code>pg17</code> với <code>0.0.0.0:5444-&gt;5432/tcp</code>.'],
      ['psql connects (password <code>123456</code>) and <code>SHOW server_version</code> prints a 17.x version.', 'psql kết nối được (mật khẩu <code>123456</code>) và <code>SHOW server_version</code> in ra bản 17.x.'],
      ['Inside psql run <code>CREATE DATABASE pgcourse;</code>, then <code>\\c pgcourse</code> — the prompt becomes <code>pgcourse=#</code>.', 'Trong psql chạy <code>CREATE DATABASE pgcourse;</code>, rồi <code>\\c pgcourse</code> — dấu nhắc đổi thành <code>pgcourse=#</code>.'],
    ],
    lenh: 'docker run -d --name pg17 -e POSTGRES_PASSWORD=123456 -p 5444:5432 postgres:17 && psql -h localhost -p 5444 -U postgres',
    lyDo: ['A browser cannot install or start a database server on your computer — this is the one step you must do yourself.', 'Trình duyệt không thể cài hay khởi động máy chủ CSDL trên máy bạn — đây là bước duy nhất bạn phải tự làm.'],
    tep: { 'setup.sh': `# 1. start the server (once)\ndocker run -d --name pg17 -e POSTGRES_PASSWORD=123456 -p 5444:5432 postgres:17\n\n# 2. check it is running\ndocker ps\n\n# 3. connect (password 123456)\npsql -h localhost -p 5444 -U postgres\n` },
    giaiTep: { 'setup.sh': `# 1. start the server (once) — -d: background, -e: superuser password, -p host:container port\ndocker run -d --name pg17 -e POSTGRES_PASSWORD=123456 -p 5444:5432 postgres:17\n\n# 2. check it is running: STATUS "Up …", PORTS 0.0.0.0:5444->5432/tcp\ndocker ps --filter name=pg17\n\n# 3. connect and ask the server who it is\npsql -h localhost -p 5444 -U postgres -c "SHOW server_version;"\n#  server_version\n# ----------------\n#  17.x (Debian 17.x-1.pgdg…)\n\n# 4. the course database\npsql -h localhost -p 5444 -U postgres -c "CREATE DATABASE pgcourse;"\npsql -h localhost -p 5444 -U postgres -d pgcourse     # prompt: pgcourse=#\n\n# no Docker? Use the native installer (postgresql.org/download) and connect to port 5432 instead of 5444.\n` },
    viDu: [{ input: ['psql -h localhost -p 5444 -U postgres -c "SHOW server_version;"', 'psql -h localhost -p 5444 -U postgres -c "SHOW server_version;"'], output: [' server_version\n----------------\n 17.6 (Debian 17.6-1.pgdg13+1)\n(1 row)', ' server_version\n----------------\n 17.6 (Debian 17.6-1.pgdg13+1)\n(1 dòng)'], explanation: ['Any 17.x is fine — the minor number depends on the day you pull the image.', 'Bản 17.x nào cũng được — số phụ tuỳ ngày bạn tải ảnh.'] }],
    gy: [['If <code>docker run</code> says the port is already allocated, another server uses 5444: pick <code>-p 5445:5432</code> and connect with <code>-p 5445</code>.', 'Nếu <code>docker run</code> báo cổng đã bị chiếm, một máy chủ khác đang dùng 5444: chọn <code>-p 5445:5432</code> rồi kết nối bằng <code>-p 5445</code>.'], ['psql not installed on the host? Run it inside the container: <code>docker exec -it pg17 psql -U postgres</code>.', 'Máy chưa có psql? Chạy ngay trong container: <code>docker exec -it pg17 psql -U postgres</code>.']],
    lhg: [['Connecting to port 5432 while the container publishes 5444 — "connection refused" (or you reach a different, older server).', 'Kết nối cổng 5432 trong khi container mở 5444 — "connection refused" (hoặc vào nhầm một máy chủ cũ khác).'], ['Typing <code>\\c pgcourse</code> before <code>CREATE DATABASE</code> — psql answers "database pgcourse does not exist".', 'Gõ <code>\\c pgcourse</code> trước <code>CREATE DATABASE</code> — psql báo "database pgcourse does not exist".']],
    gt: ['<p><code>docker run -d</code> starts the official image in the background; <code>-p 5444:5432</code> maps port 5444 on your machine to 5432 inside the container. psql is just a client: it opens a TCP connection, authenticates, sends SQL text and prints what the server answers.</p>', '<p><code>docker run -d</code> chạy ảnh chính thức ở chế độ nền; <code>-p 5444:5432</code> nối cổng 5444 trên máy bạn tới 5432 trong container. psql chỉ là một client: mở kết nối TCP, xác thực, gửi chữ SQL và in câu trả lời của máy chủ.</p>'],
    tn: [tn('container', 'vùng chứa', 'một tiến trình chạy cô lập từ một ảnh Docker'), tn('client / server', 'máy khách / máy chủ', 'psql là client; PostgreSQL là server giữ dữ liệu')],
  }),

  cs({
    t: 'psql meta-commands you will type every day', k: 'EASY', p: 6,
    kn: ['psql meta-commands', 'backslash commands'], tag: ['psql'],
    en: '<p>Commands that start with a backslash are handled by <b>psql itself</b>, not sent to the server as SQL. Pick the right one for each job.</p>',
    vi: '<p>Lệnh bắt đầu bằng dấu gạch ngược do <b>chính psql</b> xử lý, không gửi tới máy chủ như SQL. Chọn đúng lệnh cho từng việc.</p>',
    cau: [
      q('q1', ['Show the columns, types, defaults and indexes of table <code>notes</code>.', 'Xem cột, kiểu, giá trị mặc định và chỉ mục của bảng <code>notes</code>.'], ['<code>\\d notes</code>', '<code>\\dt notes</code>', '<code>\\l notes</code>', '<code>DESCRIBE notes;</code>'], ['<code>\\d name</code> describes one relation in full. <code>\\dt</code> only lists tables; <code>\\l</code> lists databases; <code>DESCRIBE</code> is MySQL syntax and is not SQL that PostgreSQL knows.', '<code>\\d tên</code> mô tả đầy đủ một bảng. <code>\\dt</code> chỉ liệt kê bảng; <code>\\l</code> liệt kê database; <code>DESCRIBE</code> là cú pháp MySQL, PostgreSQL không hiểu.']),
      q('q2', ['Switch the current connection to database <code>pgcourse</code>.', 'Chuyển kết nối hiện tại sang database <code>pgcourse</code>.'], ['<code>\\c pgcourse</code>', '<code>USE pgcourse;</code>', '<code>\\d pgcourse</code>', '<code>SET search_path = pgcourse;</code>'], ['A PostgreSQL connection belongs to ONE database; <code>\\c</code> makes psql reconnect. <code>USE</code> is SQL Server/MySQL; search_path chooses schemas, not databases.', 'Một kết nối PostgreSQL thuộc về MỘT database; <code>\\c</code> làm psql kết nối lại. <code>USE</code> là của SQL Server/MySQL; search_path chọn schema, không chọn database.']),
      q('q3', ['List all databases on the server.', 'Liệt kê mọi database trên máy chủ.'], ['<code>\\l</code>', '<code>\\dt</code>', '<code>\\dn</code>', '<code>\\du</code>'], ['<code>\\l</code> lists databases; <code>\\dt</code> tables of the current database; <code>\\dn</code> schemas; <code>\\du</code> roles.', '<code>\\l</code> liệt kê database; <code>\\dt</code> bảng của database hiện tại; <code>\\dn</code> schema; <code>\\du</code> role.']),
      q('q4', ['A wide row wraps across the screen. Show each column on its own line instead.', 'Một dòng rộng bị gãy trên màn hình. Muốn mỗi cột một dòng riêng.'], ['<code>\\x</code> (expanded display)', '<code>\\timing</code>', '<code>\\pset pager off</code>', '<code>\\a</code> (unaligned)'], ['<code>\\x</code> toggles expanded display: one "column | value" line per column. <code>\\timing</code> prints query time; the pager setting only controls scrolling; unaligned output removes padding but keeps one line per row.', '<code>\\x</code> bật/tắt hiển thị mở rộng: mỗi cột một dòng "cột | giá trị". <code>\\timing</code> in thời gian chạy; pager chỉ điều khiển cuộn; chế độ unaligned bỏ căn lề nhưng vẫn mỗi dòng một hàng.']),
      q('q5', ['You typed <code>SELECT * FROM notes</code> and pressed Enter, but nothing happens — the prompt changed to <code>pgcourse-#</code>. Why?', 'Bạn gõ <code>SELECT * FROM notes</code> rồi Enter nhưng không có gì xảy ra — dấu nhắc đổi thành <code>pgcourse-#</code>. Vì sao?'], ['psql waits for the semicolon that ends the statement', 'the server is still running the query', 'the table is locked by another session', 'psql lost the connection'], ['SQL statements end with <code>;</code>. Until it sees one, psql keeps collecting lines (the <code>-#</code> prompt means "continuation"). Type <code>;</code> and Enter.', 'Câu SQL kết thúc bằng <code>;</code>. Chưa thấy dấu đó thì psql còn gom dòng (dấu nhắc <code>-#</code> nghĩa là "đang viết tiếp"). Gõ <code>;</code> rồi Enter.']),
    ],
    gy: [['Backslash commands are psql features; SQL keywords go to the server.', 'Lệnh gạch ngược là tính năng của psql; từ khoá SQL được gửi tới máy chủ.'], ['<code>\\?</code> inside psql lists every meta-command.', '<code>\\?</code> trong psql liệt kê mọi lệnh tắt.']],
    lhg: [['Typing MySQL/SQL Server habits (<code>USE db</code>, <code>DESCRIBE t</code>, <code>SHOW TABLES</code>) — PostgreSQL answers with a syntax error.', 'Gõ theo thói quen MySQL/SQL Server (<code>USE db</code>, <code>DESCRIBE t</code>, <code>SHOW TABLES</code>) — PostgreSQL báo lỗi cú pháp.'], ['Forgetting the semicolon and thinking the server hangs.', 'Quên dấu chấm phẩy và tưởng máy chủ treo.']],
    tn: [tn('meta-command', 'lệnh tắt của psql', 'lệnh bắt đầu bằng \\ do psql xử lý')],
  }),

  pg({
    t: 'Your first table: notes', k: 'EASY', p: 10,
    kn: ['CREATE TABLE', 'GENERATED ALWAYS AS IDENTITY', 'DEFAULT', 'NOT NULL', 'INSERT'], tag: ['ddl', 'notes'],
    en: `<p>Build the table of lesson 0.3 in an empty database and put the three first notes in it:</p>${pre(`notes: id (identity, primary key), title (varchar 200, required), body (text, optional),
       pinned (boolean, required, default false), created_at (timestamptz, required, default now())

rows:  Learn PostgreSQL | Day one
       Buy coffee       | (no body)
       Read the manual  | The EXPLAIN chapter`)}`,
    vi: `<p>Dựng bảng của bài 0.3 trong một database rỗng rồi đưa ba ghi chú đầu tiên vào:</p>${pre(`notes: id (identity, khoá chính), title (varchar 200, bắt buộc), body (text, không bắt buộc),
       pinned (boolean, bắt buộc, mặc định false), created_at (timestamptz, bắt buộc, mặc định now())

dòng:  Learn PostgreSQL | Day one
       Buy coffee       | (không có nội dung)
       Read the manual  | The EXPLAIN chapter`)}`,
    yc: [
      ['<code>CREATE TABLE notes (…)</code> with exactly these five columns, in this order.', '<code>CREATE TABLE notes (…)</code> đúng năm cột này, đúng thứ tự.'],
      ['One INSERT for the three notes that writes only <code>title</code> and <code>body</code> — id, pinned and created_at come from the table.', 'Một lệnh INSERT cho ba ghi chú, chỉ ghi <code>title</code> và <code>body</code> — id, pinned, created_at do bảng tự điền.'],
    ],
    csdl: '', ld: null,
    giai: `${NOTES_DDL}

INSERT INTO notes (title, body) VALUES
  ('Learn PostgreSQL', 'Day one'),
  ('Buy coffee', NULL),               -- body is optional
  ('Read the manual', 'The EXPLAIN chapter');`,
    kiem: [
      sau(['The three notes are stored with ids 1–3 and pinned = false', 'Ba ghi chú được lưu với id 1–3 và pinned = false'], 'SELECT id, title, body, pinned, created_at IS NOT NULL AS has_time FROM notes ORDER BY id', { thuTu: true }),
      sau(['Columns and types', 'Cột và kiểu'], "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'notes' ORDER BY ordinal_position", { thuTu: true }),
      chan(['A note without a title is rejected', 'Ghi chú thiếu title bị chặn'], "INSERT INTO notes (body) VALUES ('no title')", '23502'),
      chan(['The id cannot be forced (GENERATED ALWAYS)', 'Không ép được id (GENERATED ALWAYS)'], "INSERT INTO notes (id, title) VALUES (99, 'forced')", '428C9', { an: true }),
      duoc(['A note with only a title gets the defaults', 'Ghi chú chỉ có title nhận giá trị mặc định'], "INSERT INTO notes (title) VALUES ('Only a title'); SELECT id, pinned FROM notes WHERE title = 'Only a title'", { an: true }),
    ],
    sai: [
      `CREATE TABLE notes (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, title varchar(200), body text, pinned boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now());
INSERT INTO notes (title, body) VALUES ('Learn PostgreSQL', 'Day one'), ('Buy coffee', NULL), ('Read the manual', 'The EXPLAIN chapter');`,
      `CREATE TABLE notes (id serial PRIMARY KEY, title varchar(200) NOT NULL, body text, pinned boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now());
INSERT INTO notes (title, body) VALUES ('Learn PostgreSQL', 'Day one'), ('Buy coffee', NULL), ('Read the manual', 'The EXPLAIN chapter');`,
    ],
    gy: [['Copy the column list from the brief: name, type, then NOT NULL / DEFAULT.', 'Chép danh sách cột trong đề: tên, kiểu, rồi NOT NULL / DEFAULT.'], ['<code>id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY</code>; the INSERT lists only <code>(title, body)</code>.', '<code>id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY</code>; INSERT chỉ liệt kê <code>(title, body)</code>.']],
    lhg: [['Forgetting NOT NULL on <code>title</code> — a note with no title slips in.', 'Quên NOT NULL ở <code>title</code> — ghi chú không có tiêu đề lọt vào.'], ['Using <code>serial</code>: it works, but the course (and modern PostgreSQL) use identity columns; <code>serial</code> also lets anyone write their own id.', 'Dùng <code>serial</code>: chạy được, nhưng khoá học (và PostgreSQL hiện đại) dùng cột identity; <code>serial</code> còn cho phép ai cũng tự ghi id.']],
    gt: ['<p>The table itself guarantees the rules: identity gives ids 1, 2, 3; NOT NULL rejects a missing title; DEFAULT fills <code>pinned</code> and <code>created_at</code>. <code>GENERATED ALWAYS</code> even refuses an id you try to force (error 428C9) unless you write <code>OVERRIDING SYSTEM VALUE</code>.</p>', '<p>Chính bảng giữ luật: identity cấp id 1, 2, 3; NOT NULL chặn ghi chú thiếu tiêu đề; DEFAULT điền <code>pinned</code> và <code>created_at</code>. <code>GENERATED ALWAYS</code> còn từ chối id bạn cố ép (lỗi 428C9) trừ khi viết <code>OVERRIDING SYSTEM VALUE</code>.</p>'],
    tn: [TN.identity, tn('DEFAULT', 'giá trị mặc định'), TN.pk],
  }),
]);
