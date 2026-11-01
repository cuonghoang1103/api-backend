/**
 * PostgreSQL · 11.4 — Khoá dòng, lost update và deadlock. Phần chấm được trong một phiên: cập nhật nguyên tử chống lost update,
 * hàng đợi việc FOR UPDATE SKIP LOCKED, khoá theo thứ tự cố định. Phần cần hai phiên (chờ khoá, deadlock 40P01) ⇒ sắp thứ tự + bài
 * chạy trên máy.
 */
import { mod, pg, cs, ord, tay, kq, kqAn, sau, ma, pre, tn } from './_chung.mjs';

const JOB = `CREATE TABLE job (
  id      int PRIMARY KEY,
  payload text NOT NULL,
  state   text NOT NULL DEFAULT 'queued' CHECK (state IN ('queued', 'running', 'done')),
  worker  text
);
INSERT INTO job (id, payload, state) VALUES
  (1, 'email #1', 'done'), (2, 'email #2', 'queued'), (3, 'resize img', 'queued'), (4, 'invoice pdf', 'queued'), (5, 'sms', 'running');`;
const DEADLOCK = `-- WINDOW 1                                        -- WINDOW 2
BEGIN;
UPDATE accounts SET balance = balance - 10 WHERE id = 'A';
                                                   BEGIN;
                                                   UPDATE accounts SET balance = balance - 10 WHERE id = 'B';
UPDATE accounts SET balance = balance + 10 WHERE id = 'B';   -- waits for window 2
                                                   UPDATE accounts SET balance = balance + 10 WHERE id = 'A';   -- deadlock!`;

export default mod('postgresql-11-4-khoa-deadlock', '11.4 Row locks, lost updates and deadlocks', [
  pg({
    t: 'No lost update: sell one unit atomically', k: 'MEDIUM', p: 8, kn: ['UPDATE … SET x = x − 1 WHERE x >= 1', 'RETURNING', 'no read-modify-write'], tag: ['locks', 'lost-update', 'ctshop'],
    tuy: {},
    en: '<p>Two customers buy the last Moleskine notebooks (CT0906) at the same moment. Reading the stock in the app and writing <code>stock - 1</code> back loses one sale. Write ONE statement that takes one unit only if one is available and returns <code>sku, stock</code> (no row = sold out).</p>',
    vi: '<p>Hai khách mua những cuốn sổ Moleskine cuối cùng (CT0906) cùng lúc. Đọc tồn kho ở app rồi ghi lại <code>stock - 1</code> sẽ mất một lượt bán. Viết MỘT câu lệnh chỉ lấy một đơn vị khi còn hàng và trả về <code>sku, stock</code> (không có dòng = hết hàng).</p>',
    yc: [['<code>UPDATE product SET stock = stock - 1 WHERE sku = \'CT0906\' AND stock &gt;= 1 RETURNING sku, stock</code>.', '<code>UPDATE product SET stock = stock - 1 WHERE sku = \'CT0906\' AND stock &gt;= 1 RETURNING sku, stock</code>.'], ['No SELECT before the UPDATE.', 'Không SELECT trước UPDATE.']],
    giai: `UPDATE product
SET stock = stock - 1               -- computed from the CURRENT row under its row lock
WHERE sku = 'CT0906' AND stock >= 1  -- sold out ⇒ 0 rows, no error, no negative stock
RETURNING sku, stock;`,
    kiem: [
      kq(['6 → 5', '6 → 5']),
      kqAn(['Sold out: no row comes back', 'Hết hàng: không dòng nào trả về'], "UPDATE product SET stock = 0 WHERE sku = 'CT0906'", { choPhepRong: true }),
      ma(['No SELECT-then-UPDATE', 'Không SELECT rồi mới UPDATE'], '^(?![\\s\\S]*\\bSELECT\\b)[\\s\\S]*\\bUPDATE\\b'),
    ],
    sai: ["UPDATE product SET stock = 5 WHERE sku = 'CT0906' RETURNING sku, stock", "UPDATE product SET stock = stock - 1 WHERE sku = 'CT0906' RETURNING sku, stock"],
    gy: [['Let the database do the arithmetic on the row it has locked.', 'Để CSDL làm phép tính trên chính dòng nó đang khoá.'], ['The condition stock &gt;= 1 makes "sold out" a normal outcome (0 rows), not an error.', 'Điều kiện stock &gt;= 1 biến "hết hàng" thành kết quả bình thường (0 dòng), không phải lỗi.']],
    lhg: [['Read stock in the app (6), write 5: two buyers both write 5 — one sale vanishes.', 'Đọc tồn kho ở app (6), ghi 5: hai người mua đều ghi 5 — mất một lượt bán.'], ['No <code>stock &gt;= 1</code>: on a sold-out item the CHECK (stock ≥ 0) raises an error in the middle of checkout.', 'Không có <code>stock &gt;= 1</code>: với hàng đã hết, CHECK (stock ≥ 0) báo lỗi giữa lúc thanh toán.']],
    gt: ['<p>An UPDATE locks the row and re-reads it at its latest committed version before applying <code>stock - 1</code>; a concurrent UPDATE waits, then works on the new value. "Fix 1" of lesson 11.4: never read a value just to write it back.</p>', '<p>UPDATE khoá dòng và đọc lại phiên bản commit mới nhất trước khi áp <code>stock - 1</code>; UPDATE đồng thời phải chờ, rồi làm trên giá trị mới. "Cách sửa 1" của bài 11.4: đừng bao giờ đọc một giá trị chỉ để ghi nó lại.</p>'],
    tn: [tn('lost update', 'mất cập nhật')],
  }),

  pg({
    csdl: JOB, tenCsdl: 'job', ld: { en: pre("job (id PK, payload, state queued|running|done, worker) — 1 done, 2–4 queued, 5 running"), vi: pre("job (id PK, payload, state queued|running|done, worker) — 1 done, 2–4 queued, 5 running") },
    t: 'A job queue in one statement: FOR UPDATE SKIP LOCKED', k: 'MEDIUM', p: 10, kn: ['FOR UPDATE SKIP LOCKED', 'claim the oldest job', 'UPDATE … WHERE id = (subquery)'], tag: ['locks', 'queue'],
    en: '<p>Worker <code>w1</code> claims the <b>oldest queued</b> job (smallest id): set its state to <code>running</code> and worker to <code>w1</code>, and return <code>id, payload</code>. Many workers run this at once — a job locked by another worker must be skipped, not waited for.</p>',
    vi: '<p>Worker <code>w1</code> nhận việc <b>đang chờ cũ nhất</b> (id nhỏ nhất): đặt state thành <code>running</code> và worker là <code>w1</code>, trả về <code>id, payload</code>. Nhiều worker chạy câu này cùng lúc — việc đang bị worker khác khoá phải được bỏ qua, không chờ.</p>',
    yc: [['The subquery picks the job: <code>… WHERE state = \'queued\' ORDER BY id LIMIT 1 FOR UPDATE SKIP LOCKED</code>.', 'Truy vấn con chọn việc: <code>… WHERE state = \'queued\' ORDER BY id LIMIT 1 FOR UPDATE SKIP LOCKED</code>.'], ['One UPDATE … RETURNING.', 'Một lệnh UPDATE … RETURNING.']],
    giai: `UPDATE job
SET state = 'running', worker = 'w1'
WHERE id = (SELECT id FROM job
            WHERE state = 'queued'
            ORDER BY id
            LIMIT 1
            FOR UPDATE SKIP LOCKED)        -- rows locked by other workers are invisible to this pick
RETURNING id, payload;`,
    kiem: [
      kq(['Job 2 is claimed', 'Việc 2 được nhận']),
      sau(['Exactly one job changed', 'Đúng một việc bị đổi'], "SELECT id, state, worker FROM job ORDER BY id", { thuTu: true }),
      kqAn(['When job 2 is already running, job 3 is next', 'Khi việc 2 đang chạy, việc 3 là kế tiếp'], "UPDATE job SET state = 'running' WHERE id = 2"),
      ma(['FOR UPDATE SKIP LOCKED', 'FOR UPDATE SKIP LOCKED'], 'FOR\\s+UPDATE\\s+SKIP\\s+LOCKED'),
    ],
    sai: ["UPDATE job SET state = 'running', worker = 'w1' WHERE state = 'queued' RETURNING id, payload", "UPDATE job SET state = 'running', worker = 'w1' WHERE id = (SELECT id FROM job WHERE state = 'queued' ORDER BY id DESC LIMIT 1 FOR UPDATE SKIP LOCKED) RETURNING id, payload"],
    gy: [['The subquery chooses and locks ONE row; the UPDATE changes exactly that row.', 'Truy vấn con chọn và khoá MỘT dòng; UPDATE đổi đúng dòng đó.'], ['SKIP LOCKED makes concurrent workers pick different jobs instead of queueing behind each other.', 'SKIP LOCKED khiến các worker đồng thời chọn các việc khác nhau thay vì xếp hàng sau nhau.']],
    lhg: [['UPDATE … WHERE state = \'queued\' without LIMIT: one worker grabs every job.', 'UPDATE … WHERE state = \'queued\' không LIMIT: một worker ôm hết mọi việc.'], ['FOR UPDATE without SKIP LOCKED: all workers wait on the same first row — the queue becomes single-threaded.', 'FOR UPDATE thiếu SKIP LOCKED: mọi worker chờ cùng dòng đầu — hàng đợi thành đơn luồng.']],
    gt: ['<p>The grader is a single session, so it can only check the result (job 2 claimed, others untouched) and the clause. On a real server, start two psql windows, BEGIN in both, run the claim in each: they get jobs 2 and 3 without waiting — that is SKIP LOCKED.</p>', '<p>Máy chấm chỉ có một phiên, nên chỉ kiểm được kết quả (việc 2 được nhận, việc khác giữ nguyên) và mệnh đề. Trên máy chủ thật, mở hai cửa sổ psql, BEGIN ở cả hai, chạy lệnh nhận việc ở mỗi bên: chúng nhận việc 2 và 3 mà không chờ — đó là SKIP LOCKED.</p>'],
    tn: [tn('SKIP LOCKED', 'bỏ qua dòng đang bị khoá'), tn('FOR UPDATE', 'khoá dòng để ghi')],
  }),

  cs({
    t: 'Anatomy of a deadlock', k: 'MEDIUM', p: 5, loai: 'order', kn: ['deadlock', '40P01', 'lock ordering'], tag: ['locks', 'deadlock'],
    en: `<p>Two transfers run at the same time:</p>${pre(DEADLOCK)}<p>Order what happens.</p>`,
    vi: `<p>Hai phi vụ chuyển tiền chạy cùng lúc:</p>${pre(DEADLOCK)}<p>Sắp thứ tự những gì xảy ra.</p>`,
    cau: [ord('o1', ['From two locks to one victim', 'Từ hai khoá tới một nạn nhân'], [
      'Window 1 locks row A / cửa sổ 1 khoá dòng A',
      'Window 2 locks row B / cửa sổ 2 khoá dòng B',
      'Window 1 asks for B and waits for window 2 / cửa sổ 1 xin B và chờ cửa sổ 2',
      'Window 2 asks for A: each waits for the other / cửa sổ 2 xin A: mỗi bên chờ bên kia',
      'After deadlock_timeout (1 s) PostgreSQL detects the cycle and aborts one with 40P01 / sau deadlock_timeout PostgreSQL phát hiện vòng và huỷ một bên với 40P01',
      'The other transaction gets its lock and can commit / giao dịch còn lại nhận khoá và commit được',
    ], ['The cure is to take locks in a consistent order (e.g. always the smaller account id first) so a cycle cannot form, and to retry on 40P01.', 'Cách chữa là lấy khoá theo thứ tự nhất quán (vd luôn id tài khoản nhỏ trước) để vòng không hình thành, và thử lại khi gặp 40P01.'])],
    gy: [['A deadlock needs a cycle: A waits for B while B waits for A.', 'Deadlock cần một vòng: A chờ B trong khi B chờ A.'], ['PostgreSQL breaks it by killing one participant.', 'PostgreSQL phá vòng bằng cách huỷ một bên.']],
    lhg: [['Thinking both transactions wait forever.', 'Nghĩ rằng cả hai chờ mãi mãi.'], ['Fixing deadlocks with longer timeouts instead of consistent lock order.', 'Sửa deadlock bằng timeout dài hơn thay vì khoá theo thứ tự nhất quán.']],
    tn: [tn('deadlock', 'khoá chết'), tn('40P01 deadlock_detected', 'mã lỗi deadlock')],
  }),

  tay({
    t: 'Two windows: lost update, FOR UPDATE and NOWAIT', k: 'HARD', p: 20, kn: ['lost update in practice', 'SELECT … FOR UPDATE', 'NOWAIT / lock_timeout'], tag: ['locks', 'concurrency'],
    en: `<p>Reproduce lesson 11.4 on your own PostgreSQL with two psql windows on the accounts table (A = 100, B = 0).</p>${pre(`-- 1) lost update: both windows
BEGIN; SELECT balance FROM accounts WHERE id = 'A';          -- both read 100
UPDATE accounts SET balance = 90 WHERE id = 'A'; COMMIT;     -- window 1 (app computed 100 - 10)
UPDATE accounts SET balance = 80 WHERE id = 'A'; COMMIT;     -- window 2 (app computed 100 - 20) ⇒ 80, the -10 is lost
-- 2) the fix: SELECT … FOR UPDATE — window 2 now WAITS at its SELECT until window 1 commits, then reads 90
-- 3) don't wait: SELECT … FOR UPDATE NOWAIT  ⇒  ERROR: could not obtain lock on row (55P03)
--    or SET LOCAL lock_timeout = '2s'       ⇒  ERROR: canceling statement due to lock timeout`)}`,
    vi: `<p>Tái hiện bài 11.4 trên PostgreSQL của bạn với hai cửa sổ psql trên bảng accounts (A = 100, B = 0).</p>${pre(`-- 1) mất cập nhật: cả hai cửa sổ
BEGIN; SELECT balance FROM accounts WHERE id = 'A';          -- cả hai đọc 100
UPDATE accounts SET balance = 90 WHERE id = 'A'; COMMIT;     -- cửa sổ 1 (app tính 100 - 10)
UPDATE accounts SET balance = 80 WHERE id = 'A'; COMMIT;     -- cửa sổ 2 (app tính 100 - 20) ⇒ 80, mất khoản -10
-- 2) cách sửa: SELECT … FOR UPDATE — cửa sổ 2 giờ CHỜ ở câu SELECT tới khi cửa sổ 1 commit, rồi đọc 90
-- 3) không chờ: SELECT … FOR UPDATE NOWAIT  ⇒  ERROR: could not obtain lock on row (55P03)
--    hoặc SET LOCAL lock_timeout = '2s'       ⇒  ERROR: canceling statement due to lock timeout`)}`,
    yc: [['Part 1 ends with balance 80 (one withdrawal lost).', 'Phần 1 kết thúc với số dư 80 (mất một lần rút).'], ['Part 2 ends with 70 (both withdrawals applied), window 2 visibly waited.', 'Phần 2 kết thúc với 70 (áp đủ hai lần rút), cửa sổ 2 rõ ràng đã chờ.'], ['Part 3 shows the 55P03 or lock-timeout error instead of waiting.', 'Phần 3 cho thấy lỗi 55P03 hoặc lock timeout thay vì chờ.']],
    lenh: 'psql -h localhost -p 5444 -U postgres -d pgcourse   # in two terminals',
    lyDo: ['Row locks only show their effect when a second session tries to take them; the browser grader has exactly one session.', 'Khoá dòng chỉ thể hiện tác dụng khi phiên thứ hai cố lấy chúng; máy chấm trình duyệt chỉ có đúng một phiên.'],
    tep: { 'locks.sql': `-- setup\nCREATE TABLE IF NOT EXISTS accounts (id text PRIMARY KEY, owner text NOT NULL, balance numeric(12,2) NOT NULL CHECK (balance >= 0));\nTRUNCATE accounts; INSERT INTO accounts VALUES ('A', 'Cuong', 100), ('B', 'Mai', 0);\n-- follow the three parts of the brief in two windows\n` },
    giaiTep: { 'locks.sql': `-- Part 2 (both windows):\n-- W1: BEGIN; SELECT balance FROM accounts WHERE id = 'A' FOR UPDATE;   -- 100, row locked\n-- W2: BEGIN; SELECT balance FROM accounts WHERE id = 'A' FOR UPDATE;   -- … waits …\n-- W1: UPDATE accounts SET balance = 90 WHERE id = 'A'; COMMIT;\n-- W2: (unblocks, reads 90) UPDATE accounts SET balance = 70 WHERE id = 'A'; COMMIT;   -- 70: nothing lost\n-- Even better (Fix 1): UPDATE accounts SET balance = balance - 10 WHERE id = 'A' — no read at all.\n-- Part 3:\n-- W2: SELECT balance FROM accounts WHERE id = 'A' FOR UPDATE NOWAIT;\n--     ERROR:  could not obtain lock on row in relation "accounts"   (SQLSTATE 55P03)\n` },
    viDu: [{ input: ['Window 2 (part 3): SELECT … FOR UPDATE NOWAIT;', 'Cửa sổ 2 (phần 3): SELECT … FOR UPDATE NOWAIT;'], output: ['ERROR:  could not obtain lock on row in relation "accounts"', 'ERROR:  could not obtain lock on row in relation "accounts"'], explanation: ['NOWAIT turns "wait for the lock" into an immediate error the app can handle.', 'NOWAIT biến "chờ khoá" thành lỗi ngay lập tức để app xử lý.'] }],
    gy: [['Keep each window\'s transaction open while you type in the other.', 'Giữ giao dịch của mỗi cửa sổ mở trong lúc gõ ở cửa sổ kia.'], ['If a window seems frozen, it is waiting for a lock — that is the lesson.', 'Nếu một cửa sổ có vẻ đứng, nó đang chờ khoá — đó chính là bài học.']],
    lhg: [['Committing window 1 before window 2 reads — no race, no lost update to observe.', 'Commit cửa sổ 1 trước khi cửa sổ 2 đọc — không có tranh chấp, không thấy mất cập nhật.'], ['Using FOR UPDATE in only one window.', 'Chỉ dùng FOR UPDATE ở một cửa sổ.']],
    gt: ['<p>A plain SELECT never locks, so two read-modify-write transactions overwrite each other. FOR UPDATE makes the second reader wait for the first writer; NOWAIT / lock_timeout bound that wait. The simplest fix remains the atomic UPDATE of the first exercise.</p>', '<p>SELECT thường không khoá, nên hai giao dịch đọc-sửa-ghi đè lên nhau. FOR UPDATE khiến người đọc thứ hai chờ người ghi thứ nhất; NOWAIT / lock_timeout giới hạn thời gian chờ. Cách sửa đơn giản nhất vẫn là UPDATE nguyên tử của bài đầu.</p>'],
    tn: [tn('row lock', 'khoá dòng'), tn('NOWAIT', 'không chờ khoá')],
  }),
]);
