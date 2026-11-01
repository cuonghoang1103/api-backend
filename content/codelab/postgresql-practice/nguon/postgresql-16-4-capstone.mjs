/**
 * PostgreSQL · 16.4 — Bốn ca trực. Quy trình điều tra (thứ tự), ca → truy vấn đầu tiên (bảng), ca 1 chạy được trên ẢNH CHỤP
 * pg_stat_activity (chọn pg_terminate_backend hay pg_cancel_backend theo trạng thái — bài học đo: cancel không làm gì với phiên
 * idle in transaction), ca 2 chạy THẬT: sửa đọc-rồi-ghi thành một câu lệnh nguyên tử có chặn số dư.
 */
import { mod, pg, cs, ord, bang1, kq, kqAn, sau, ma, pre, tn } from './_chung.mjs';

const T = { thuTu: true };

const PHIEN = `SET TimeZone = 'Asia/Ho_Chi_Minh';
CREATE TABLE snap (taken_at timestamptz NOT NULL);
INSERT INTO snap VALUES ('2026-10-26 15:00:00+07');
CREATE TABLE activity (pid int PRIMARY KEY, application_name text NOT NULL, state text, xact_start timestamptz, query text);
INSERT INTO activity VALUES
  (4101, 'admin-export', 'idle in transaction',           '2026-10-26 11:42:10+07', 'SELECT * FROM notes WHERE owner_id = 77'),
  (4188, 'report',       'active',                        '2026-10-26 14:31:00+07', 'SELECT … FROM orders JOIN order_item …'),
  (4203, 'web',          'idle in transaction (aborted)', '2026-10-26 14:48:30+07', 'UPDATE cart SET qty = qty + 1 …'),
  (4250, 'web',          'active',                        '2026-10-26 14:59:58+07', 'SELECT id FROM product WHERE sku = $1'),
  (4260, 'web',          'idle',                          NULL,                     'SELECT 1'),
  (4301, 'worker',       'idle in transaction',           '2026-10-26 14:58:00+07', 'SELECT … FOR UPDATE');`;
const LD_PHIEN = { en: `<h4>Tables (snapshot at 15:00:00)</h4>${pre(`snap (taken_at)
activity (pid, application_name, state, xact_start, query)   -- 6 client sessions`)}`, vi: `<h4>Bảng (ảnh chụp lúc 15:00:00)</h4>${pre(`snap (taken_at)
activity (pid, application_name, state, xact_start, query)   -- 6 phiên client`)}` };

const TK = `CREATE TABLE account (id int PRIMARY KEY, owner text NOT NULL, balance numeric(12,2) NOT NULL CHECK (balance >= 0));
INSERT INTO account VALUES (1, 'An', 100.00), (2, 'Bình', 15.00), (3, 'Chi', 0.00);
-- the parameters of the request the app is handling
CREATE TABLE req (account_id int NOT NULL, amount numeric(12,2) NOT NULL);
INSERT INTO req VALUES (1, 30.00);`;
const LD_TK = { en: `<h4>Tables</h4>${pre(`account (id, owner, balance ≥ 0)   -- An 100.00 · Bình 15.00 · Chi 0.00
req (account_id, amount)             -- the request being served: debit 30.00 from account 1`)}`, vi: `<h4>Bảng</h4>${pre(`account (id, owner, balance ≥ 0)   -- An 100.00 · Bình 15.00 · Chi 0.00
req (account_id, amount)             -- yêu cầu đang xử lý: trừ 30.00 từ tài khoản 1`)}` };

export default mod('postgresql-16-4-capstone', '16.4 Four pagers, four investigations', [
  cs({
    t: 'The order of an investigation', k: 'EASY', p: 5, kn: ['capture state first', 'right now before over time', 'restart last'], tag: ['incident'], loai: 'order',
    en: '<p>The pager goes off: "the site is slow". Put the steps in the order the lesson recommends.</p>', vi: '<p>Máy nhắn kêu: "web chậm". Sắp các bước theo thứ tự bài học khuyên.</p>',
    cau: [ord('o1', ['Order the steps', 'Sắp thứ tự các bước'], [
      'capture state: pg_stat_activity, top of pg_stat_statements, connections per app / chụp lại trạng thái: pg_stat_activity, đầu pg_stat_statements, kết nối theo app',
      'ask "right now": stuck transactions, lock waits, connection floods / hỏi "ngay lúc này": giao dịch kẹt, chờ khoá, ngập kết nối',
      'ask "over time": pg_stat_statements ORDER BY total_exec_time / hỏi "theo thời gian": pg_stat_statements ORDER BY total_exec_time',
      'only now EXPLAIN (ANALYZE, BUFFERS) the query you found / giờ mới EXPLAIN (ANALYZE, BUFFERS) truy vấn đã tìm ra',
      'restart — last, if at all / khởi động lại — sau cùng, nếu thật cần',
    ], ['Capturing takes a minute and is the only chance you get; a restart restores service and destroys the evidence, so the cause comes back with nothing left to diagnose.', 'Chụp trạng thái mất một phút và là cơ hội duy nhất; khởi động lại khôi phục dịch vụ nhưng xoá bằng chứng, nên nguyên nhân quay lại mà không còn gì để chẩn đoán.'])],
    gy: [['Evidence first, theories later.', 'Bằng chứng trước, giả thuyết sau.'], ['Most incidents end at "right now".', 'Phần lớn sự cố kết thúc ở bước "ngay lúc này".']],
    lhg: [['Opening EXPLAIN first and optimising a query that was never the problem.', 'Mở EXPLAIN trước và tối ưu một truy vấn chưa bao giờ là vấn đề.'], ['Restarting first.', 'Khởi động lại trước tiên.']],
    tn: [tn('incident', 'sự cố')],
  }),

  cs({
    t: 'Symptom → the first thing to run', k: 'MEDIUM', p: 8, kn: ['symptom vs cause', 'pg_stat_activity', 'pg_stat_replication', 'code review for lost updates'], tag: ['incident'], loai: 'table',
    en: '<p>For each of the lesson\'s four cases, what do you look at first?</p>', vi: '<p>Với mỗi ca trong bốn ca của bài, bạn nhìn gì trước?</p>',
    bang: [bang1('b1', ['Case → first move', 'Ca → bước đầu'], [{ ma: 'c', ten: 'Symptom / Triệu chứng' }, { ma: 'm', ten: 'First move / Bước đầu', luaChon: ['pg_stat_activity ordered by xact_start', 'read the code path that writes it', 'pg_stat_activity grouped by user and application', 'pg_stat_replication: bytes between sent_lsn and replay_lsn'] }], [
      { o: { c: 'Slow for an hour, nothing deployed, one table much worse / Chậm cả tiếng, không deploy gì, một bảng tệ hơn hẳn' }, a: { m: 'pg_stat_activity ordered by xact_start' } },
      { o: { c: 'Balances occasionally too low, no errors anywhere / Số dư thỉnh thoảng thấp hơn, không lỗi nào' }, a: { m: 'read the code path that writes it' } },
      { o: { c: 'Deploys fail with "too many clients already" / Deploy hỏng với "too many clients already"' }, a: { m: 'pg_stat_activity grouped by user and application' } },
      { o: { c: 'A saved change is missing, then appears on refresh / Thay đổi vừa lưu biến mất, tải lại thì hiện ra' }, a: { m: 'pg_stat_replication: bytes between sent_lsn and replay_lsn' } },
    ], ['Each symptom points away from its cause: an idle session slows a table (vacuum blocked), wrong data without errors is a read-modify-write, a new container breaks deploys, a "bug" is async replication working as configured.', 'Mỗi triệu chứng chỉ sai hướng nguyên nhân: một phiên ngồi yên làm chậm một bảng (vacuum bị chặn), dữ liệu sai không lỗi là đọc-rồi-ghi, một container mới làm hỏng deploy, một "lỗi" là nhân bản bất đồng bộ đang chạy đúng cấu hình.'])],
    gy: [['Ask where the cause could be global while the symptom is local.', 'Tự hỏi nguyên nhân có thể là toàn cục trong khi triệu chứng là cục bộ không.'], ['Case 2 is not answered by any statistics view.', 'Ca 2 không khung nhìn thống kê nào trả lời được.']],
    lhg: [['EXPLAINing the slow table\'s queries in case 1.', 'EXPLAIN các truy vấn của bảng chậm ở ca 1.'], ['Raising max_connections in case 3.', 'Tăng max_connections ở ca 3.']],
    tn: [tn('root cause', 'nguyên nhân gốc')],
  }),

  pg({
    csdl: PHIEN, tenCsdl: 'activity', ld: LD_PHIEN,
    t: 'Case 1: which session, and cancel or terminate?', k: 'MEDIUM', p: 12, kn: ['transaction age', 'pg_terminate_backend vs pg_cancel_backend', 'format()'], tag: ['incident', 'pg_stat_activity'],
    en: '<p>List the sessions whose transaction has been open for more than <b>10 minutes</b> at <code>snap.taken_at</code>: <code>pid, app, state, minutes, command</code> — minutes = whole minutes, command = <code>SELECT pg_terminate_backend(&lt;pid&gt;);</code> for sessions that are idle in a transaction (aborted or not), <code>SELECT pg_cancel_backend(&lt;pid&gt;);</code> for active ones. Oldest first.</p>',
    vi: '<p>Liệt kê các phiên có giao dịch mở quá <b>10 phút</b> tính tới <code>snap.taken_at</code>: <code>pid, app, state, minutes, command</code> — minutes = số phút nguyên, command = <code>SELECT pg_terminate_backend(&lt;pid&gt;);</code> cho phiên ngồi yên trong giao dịch (aborted hay không), <code>SELECT pg_cancel_backend(&lt;pid&gt;);</code> cho phiên đang active. Cũ nhất trước.</p>',
    yc: [["<code>format('SELECT pg_terminate_backend(%s);', pid)</code>.", "<code>format('SELECT pg_terminate_backend(%s);', pid)</code>."], ['<code>(extract(epoch FROM taken_at - xact_start) / 60)::int</code> rounds; use <code>floor()</code> for whole minutes.', '<code>(extract(epoch FROM taken_at - xact_start) / 60)::int</code> làm tròn; dùng <code>floor()</code> để ra số phút nguyên.']],
    giai: `SELECT a.pid, a.application_name AS app, a.state,
       floor(extract(epoch FROM s.taken_at - a.xact_start) / 60)::int AS minutes,
       CASE WHEN a.state LIKE 'idle in transaction%'
            THEN format('SELECT pg_terminate_backend(%s);', a.pid)   -- cancel does nothing to an idle session
            ELSE format('SELECT pg_cancel_backend(%s);', a.pid)      -- a running query: cancel first
       END AS command
FROM activity a, snap s
WHERE a.xact_start IS NOT NULL
  AND s.taken_at - a.xact_start > interval '10 minutes'
ORDER BY a.xact_start;`,
    kiem: [
      kq(['The 3-hour idle transaction, the report and the failed web transaction', 'Giao dịch ngồi yên 3 giờ, báo cáo và giao dịch web đã hỏng'], T),
      kqAn(['Ten minutes later the worker joins the list', 'Mười phút sau worker vào danh sách'], "UPDATE snap SET taken_at = taken_at + interval '10 minutes'", T),
      ma(['Generates pg_terminate_backend', 'Sinh lệnh pg_terminate_backend'], 'pg_terminate_backend'),
    ],
    sai: [
      "SELECT a.pid, a.application_name AS app, a.state, floor(extract(epoch FROM s.taken_at - a.xact_start) / 60)::int AS minutes, format('SELECT pg_cancel_backend(%s);', a.pid) AS command FROM activity a, snap s WHERE a.xact_start IS NOT NULL AND s.taken_at - a.xact_start > interval '10 minutes' ORDER BY a.xact_start",
      "SELECT a.pid, a.application_name AS app, a.state, floor(extract(epoch FROM s.taken_at - a.xact_start) / 60)::int AS minutes, CASE WHEN a.state = 'idle in transaction' THEN format('SELECT pg_terminate_backend(%s);', a.pid) ELSE format('SELECT pg_cancel_backend(%s);', a.pid) END AS command FROM activity a, snap s WHERE a.xact_start IS NOT NULL AND s.taken_at - a.xact_start > interval '10 minutes' ORDER BY a.xact_start",
    ],
    gy: [['Generate the commands, read them, then run them by hand — never pipe them blindly.', 'Sinh lệnh, đọc lại, rồi chạy bằng tay — đừng bao giờ đẩy thẳng mù quáng.'], ['After terminating, VACUUM the affected table and fix the code path that left the transaction open.', 'Sau khi kết thúc phiên, VACUUM bảng bị ảnh hưởng và sửa đường mã đã để giao dịch mở.']],
    lhg: [['pg_cancel_backend on an idle-in-transaction session — measured: it returns t and the session stays idle in transaction.', 'pg_cancel_backend trên phiên idle in transaction — đo được: nó trả t và phiên vẫn idle in transaction.'], ['Missing the "(aborted)" variant.', 'Sót dạng "(aborted)".']],
    gt: ['<p>pid 4101 has held a snapshot for over 3 hours, so vacuum could not remove any newer row version anywhere — the slow table is a victim, not the cause. Cancel stops a running query; only terminate ends a session that is not running anything.</p>', '<p>pid 4101 giữ một snapshot hơn 3 giờ, nên vacuum không gỡ được phiên bản dòng mới hơn nào ở bất cứ đâu — bảng chậm là nạn nhân, không phải nguyên nhân. Cancel dừng một truy vấn đang chạy; chỉ terminate mới kết thúc được phiên không chạy gì.</p>'],
    tn: [tn('pg_terminate_backend', 'kết thúc phiên'), tn('snapshot', 'ảnh chụp dữ liệu của giao dịch')],
  }),

  pg({
    csdl: TK, tenCsdl: 'bank', ld: LD_TK,
    t: 'Case 2: replace read-modify-write with one statement', k: 'MEDIUM', p: 10, kn: ['atomic UPDATE', 'guard in WHERE', 'RETURNING'], tag: ['incident', 'concurrency'],
    en: `<p>The app does this, and two concurrent requests sometimes lose one debit:</p>${pre(`const row = await db.query('SELECT balance FROM account WHERE id = $1', [id]);
const next = row.balance - amount;                                   // computed in the app
await db.query('UPDATE account SET balance = $1 WHERE id = $2', [next, id]);`)}<p>Write the replacement as <b>one</b> UPDATE using <code>req</code> (account_id, amount): subtract the amount only if the balance is enough, and return <code>id, balance</code> of the changed row — no row back means "insufficient funds".</p>`,
    vi: `<p>App làm như sau, và hai yêu cầu đồng thời đôi khi làm mất một lần trừ:</p>${pre(`const row = await db.query('SELECT balance FROM account WHERE id = $1', [id]);
const next = row.balance - amount;                                   // tính ở app
await db.query('UPDATE account SET balance = $1 WHERE id = $2', [next, id]);`)}<p>Viết bản thay thế bằng <b>một</b> lệnh UPDATE dùng <code>req</code> (account_id, amount): chỉ trừ khi số dư đủ, và trả <code>id, balance</code> của dòng đã đổi — không có dòng nào trả về nghĩa là "không đủ tiền".</p>`,
    yc: [['<code>SET balance = balance - r.amount</code> — the database computes from the current row, under its row lock.', '<code>SET balance = balance - r.amount</code> — CSDL tính từ dòng hiện tại, dưới khoá dòng của nó.'], ['<code>AND a.balance &gt;= r.amount</code> in WHERE — no error, just no row.', '<code>AND a.balance &gt;= r.amount</code> trong WHERE — không lỗi, chỉ là không có dòng.']],
    giai: `UPDATE account a
SET balance = a.balance - r.amount          -- arithmetic on the CURRENT value, inside the row lock
FROM req r
WHERE a.id = r.account_id
  AND a.balance >= r.amount                 -- not enough money ⇒ 0 rows, nothing changed
RETURNING a.id, a.balance;`,
    kiem: [
      kq(['An: 100.00 − 30.00', 'An: 100.00 − 30.00']),
      sau(['Only account 1 changed', 'Chỉ tài khoản 1 thay đổi'], 'SELECT id, balance FROM account ORDER BY id', { thuTu: true }),
      kqAn(['Another amount: 25.50', 'Số tiền khác: 25.50'], 'UPDATE req SET amount = 25.50'),
      kqAn(['Bình asks for 30.00 with 15.00 — no row comes back', 'Bình xin 30.00 khi có 15.00 — không dòng nào trả về'], 'UPDATE req SET account_id = 2', { choPhepRong: true }),
      { ...sau(['…and nothing changed', '…và không gì thay đổi'], 'SELECT id, balance FROM account ORDER BY id', { thuTu: true, an: true }), themCsdl: 'UPDATE req SET account_id = 2' },
      ma(['No SELECT of the balance before the UPDATE', 'Không SELECT số dư trước UPDATE'], '\\bSELECT\\s+balance\\b', true),
    ],
    sai: [
      'UPDATE account a SET balance = a.balance - r.amount FROM req r WHERE a.id = r.account_id RETURNING a.id, a.balance',
      "UPDATE account a SET balance = 70.00 FROM req r WHERE a.id = r.account_id AND a.balance >= r.amount RETURNING a.id, a.balance",
    ],
    gy: [['Two concurrent UPDATEs on the same row serialise on its lock, and the second recomputes from the first one\'s result.', 'Hai UPDATE đồng thời trên cùng dòng xếp hàng theo khoá dòng, và lệnh thứ hai tính lại từ kết quả của lệnh thứ nhất.'], ['The app checks rowCount: 0 ⇒ tell the user the balance is too low.', 'App kiểm rowCount: 0 ⇒ báo người dùng số dư không đủ.']],
    lhg: [['Keeping the SELECT and wrapping both in a transaction — at READ COMMITTED the lost update still happens.', 'Giữ SELECT rồi bọc cả hai trong giao dịch — ở READ COMMITTED vẫn mất cập nhật.'], ['No guard — the CHECK fails with an error instead of a clean "insufficient funds".', 'Không chặn — CHECK hỏng thành lỗi thay vì một "không đủ tiền" gọn gàng.']],
    gt: ['<p>Measured in 11.4: the read-modify-write version ended at 80.00 instead of 70.00 with both requests reporting success; the single statement ended at 70.00 with no locking code at all. Where the new value cannot be arithmetic on the old one, SELECT … FOR UPDATE first.</p>', '<p>Đo ở 11.4: bản đọc-rồi-ghi kết thúc ở 80.00 thay vì 70.00 trong khi cả hai yêu cầu đều báo thành công; một câu lệnh duy nhất kết thúc ở 70.00 mà không cần dòng mã khoá nào. Khi giá trị mới không phải phép tính trên giá trị cũ, hãy SELECT … FOR UPDATE trước.</p>'],
    tn: [tn('lost update', 'mất cập nhật'), tn('atomic statement', 'câu lệnh nguyên tử')],
  }),
]);
