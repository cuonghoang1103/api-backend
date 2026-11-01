/**
 * PostgreSQL · 11.3 — Các mức cô lập và dị thường chúng chặn. Máy chấm trình duyệt chỉ có MỘT phiên (không có đồng thời thật)
 * ⇒ bảng/trắc nghiệm + một bài chạy trên máy người học với hai cửa sổ psql (write skew → lỗi 40001 ở SERIALIZABLE).
 */
import { mod, cs, q, bang1, tay, pre, tn } from './_chung.mjs';

const CO = ['possible', 'prevented'];
const HAI_PHIEN = `-- setup (once)
CREATE TABLE oncall (name text PRIMARY KEY, on_call boolean NOT NULL);
INSERT INTO oncall VALUES ('An', true), ('Binh', true);

-- WINDOW 1                                         -- WINDOW 2
BEGIN ISOLATION LEVEL REPEATABLE READ;
SELECT count(*) FROM oncall WHERE on_call;  -- 2
                                                    BEGIN ISOLATION LEVEL REPEATABLE READ;
                                                    SELECT count(*) FROM oncall WHERE on_call;  -- 2
UPDATE oncall SET on_call = false WHERE name = 'An';
                                                    UPDATE oncall SET on_call = false WHERE name = 'Binh';
COMMIT;
                                                    COMMIT;
SELECT * FROM oncall;    -- nobody on call: write skew

-- now repeat with BEGIN ISOLATION LEVEL SERIALIZABLE in both windows`;

export default mod('postgresql-11-3-muc-co-lap', '11.3 Isolation levels and the anomalies they stop', [
  cs({
    t: 'Anomaly × isolation level in PostgreSQL', k: 'MEDIUM', p: 8, loai: 'table', kn: ['Read Committed', 'Repeatable Read', 'Serializable'], tag: ['isolation'],
    en: '<p>Fill in, <b>for PostgreSQL</b> (not the SQL standard minimum), whether each anomaly is possible or prevented at each level.</p>',
    vi: '<p>Điền, <b>cho PostgreSQL</b> (không phải mức tối thiểu của chuẩn SQL), mỗi dị thường có thể xảy ra hay bị chặn ở từng mức.</p>',
    bang: [bang1('b1', ['Anomalies by level', 'Dị thường theo mức'], [{ ma: 'dt', ten: 'Anomaly / Dị thường' }, { ma: 'rc', ten: 'Read Committed', luaChon: CO }, { ma: 'rr', ten: 'Repeatable Read', luaChon: CO }, { ma: 'sr', ten: 'Serializable', luaChon: CO }], [
      { o: { dt: 'dirty read (see uncommitted data) / đọc bẩn' }, a: { rc: 'prevented', rr: 'prevented', sr: 'prevented' } },
      { o: { dt: 'non-repeatable read (same row, two values in one transaction) / đọc không lặp lại' }, a: { rc: 'possible', rr: 'prevented', sr: 'prevented' } },
      { o: { dt: 'phantom read (same query, new rows appear) / đọc bóng ma' }, a: { rc: 'possible', rr: 'prevented', sr: 'prevented' } },
      { o: { dt: 'write skew (two transactions each read, then write disjoint rows) / lệch ghi' }, a: { rc: 'possible', rr: 'possible', sr: 'prevented' } },
    ], ['PostgreSQL never shows uncommitted data (READ UNCOMMITTED behaves like READ COMMITTED). Its Repeatable Read is snapshot isolation: one snapshot for the whole transaction, so no phantoms either — stronger than the standard requires. Only Serializable (SSI) detects write skew and aborts one transaction with 40001.', 'PostgreSQL không bao giờ cho thấy dữ liệu chưa commit (READ UNCOMMITTED hành xử như READ COMMITTED). Repeatable Read của nó là snapshot isolation: một ảnh chụp cho cả giao dịch nên cũng không có bóng ma — mạnh hơn chuẩn yêu cầu. Chỉ Serializable (SSI) phát hiện lệch ghi và huỷ một giao dịch với 40001.'])],
    gy: [['Read Committed takes a new snapshot per STATEMENT; Repeatable Read one per TRANSACTION.', 'Read Committed lấy ảnh chụp mới mỗi CÂU LỆNH; Repeatable Read một ảnh mỗi GIAO DỊCH.'], ['Write skew involves rows that no transaction writes in common.', 'Lệch ghi liên quan các dòng mà không giao dịch nào cùng ghi.']],
    lhg: [['Answering from the SQL-standard table (phantoms possible at Repeatable Read) — PostgreSQL prevents them.', 'Trả lời theo bảng của chuẩn SQL (Repeatable Read vẫn có bóng ma) — PostgreSQL thì chặn.'], ['Believing Repeatable Read is enough for the on-call rule.', 'Tin rằng Repeatable Read đủ cho luật trực ca.']],
    tn: [tn('isolation level', 'mức cô lập'), tn('write skew', 'lệch ghi'), tn('SSI', 'Serializable Snapshot Isolation')],
  }),

  cs({
    t: 'Pick the level for the job', k: 'MEDIUM', p: 6, kn: ['choosing an isolation level', 'retry on 40001'], tag: ['isolation'],
    en: '<p>Choose what lesson 11.3 recommends.</p>', vi: '<p>Chọn điều bài 11.3 khuyên.</p>',
    cau: [
      q('q1', ['A monthly report runs 5 queries and their totals must agree with each other while orders keep arriving.', 'Báo cáo tháng chạy 5 truy vấn và các tổng phải khớp nhau trong khi đơn vẫn đổ về.'], ['REPEATABLE READ (one snapshot for all 5 queries)', 'READ COMMITTED with longer timeouts', 'READ UNCOMMITTED for speed', 'lock all the tables first'], ['One snapshot makes the 5 queries consistent with each other without blocking writers.', 'Một ảnh chụp làm 5 truy vấn khớp nhau mà không chặn người ghi.']),
      q('q2', ['"At least one doctor must stay on call": each transaction checks the count, then takes itself off call.', '"Phải luôn có ít nhất một bác sĩ trực": mỗi giao dịch kiểm số người trực, rồi tự rời ca.'], ['SERIALIZABLE, and retry the transaction on SQLSTATE 40001', 'REPEATABLE READ is enough', 'READ COMMITTED with a CHECK constraint', 'nothing — the app checks it'], ['Write skew: each transaction is correct alone, together they break the rule. SSI detects the dangerous pattern and aborts one; the app retries.', 'Lệch ghi: mỗi giao dịch đúng khi đứng riêng, cùng nhau thì phá luật. SSI phát hiện mẫu nguy hiểm và huỷ một cái; app thử lại.']),
      q('q3', ['Under SERIALIZABLE your transaction fails with <code>could not serialize access due to read/write dependencies</code>. What should the application do?', 'Ở SERIALIZABLE giao dịch của bạn hỏng với <code>could not serialize access due to read/write dependencies</code>. Ứng dụng nên làm gì?'], ['roll back and rerun the WHOLE transaction from the beginning', 'retry only the last statement', 'switch the server to READ COMMITTED', 'ignore it, the data is saved'], ['40001 is a "please try again" signal; nothing was committed. Rerun every statement, because the reads may now return different values.', '40001 là tín hiệu "thử lại đi"; chưa có gì được commit. Chạy lại mọi câu lệnh, vì các lần đọc giờ có thể trả giá trị khác.']),
      q('q4', ['The default level of PostgreSQL (and the one most apps run) is…', 'Mức mặc định của PostgreSQL (và mức phần lớn app dùng) là…'], ['READ COMMITTED', 'SERIALIZABLE', 'REPEATABLE READ', 'READ UNCOMMITTED'], ['Read Committed + atomic single statements (UPDATE … SET x = x − 1) + row locks where needed covers most application logic.', 'Read Committed + câu lệnh đơn nguyên tử (UPDATE … SET x = x − 1) + khoá dòng khi cần là đủ cho phần lớn logic ứng dụng.']),
    ],
    gy: [['Consistency across several reads ⇒ Repeatable Read.', 'Nhất quán qua nhiều lần đọc ⇒ Repeatable Read.'], ['Rules spanning several rows written by different transactions ⇒ Serializable + retry.', 'Luật trải trên nhiều dòng do các giao dịch khác nhau ghi ⇒ Serializable + thử lại.']],
    lhg: [['Using SERIALIZABLE without a retry loop — users see random errors.', 'Dùng SERIALIZABLE mà không có vòng thử lại — người dùng gặp lỗi ngẫu nhiên.'], ['Retrying just the failed statement.', 'Chỉ thử lại câu lệnh hỏng.']],
    tn: [tn('40001 serialization_failure', 'lỗi tuần tự hoá')],
  }),

  tay({
    t: 'Reproduce write skew, then let SERIALIZABLE stop it', k: 'HARD', p: 20, kn: ['two sessions', 'REPEATABLE READ write skew', 'SERIALIZABLE 40001'], tag: ['isolation', 'concurrency'],
    en: `<p>Concurrency needs two real sessions — open two psql windows on your PostgreSQL 17 (lesson 0.3 container) and follow the script exactly, line by line, alternating windows.</p>${pre(HAI_PHIEN)}`,
    vi: `<p>Đồng thời cần hai phiên thật — mở hai cửa sổ psql vào PostgreSQL 17 của bạn (container bài 0.3) và làm đúng theo script, từng dòng, xen kẽ hai cửa sổ.</p>${pre(HAI_PHIEN)}`,
    yc: [
      ['Run 1 (REPEATABLE READ): both COMMITs succeed and nobody is left on call.', 'Lượt 1 (REPEATABLE READ): cả hai COMMIT thành công và không còn ai trực.'],
      ['Run 2 (reset the data, SERIALIZABLE in both windows): the second COMMIT (or UPDATE) fails with <code>ERROR: could not serialize access due to read/write dependencies among transactions</code> (SQLSTATE 40001).', 'Lượt 2 (đặt lại dữ liệu, SERIALIZABLE ở cả hai cửa sổ): COMMIT (hoặc UPDATE) thứ hai hỏng với <code>ERROR: could not serialize access due to read/write dependencies among transactions</code> (SQLSTATE 40001).'],
      ['Write down which window failed and what you would do in the application.', 'Ghi lại cửa sổ nào hỏng và bạn sẽ làm gì trong ứng dụng.'],
    ],
    lenh: 'psql -h localhost -p 5444 -U postgres -d pgcourse   # in two terminals',
    lyDo: ['The browser grader is a single PostgreSQL session inside one transaction — two transactions cannot run concurrently there, so it cannot show (or grade) an isolation anomaly.', 'Máy chấm trình duyệt là MỘT phiên PostgreSQL bên trong một giao dịch — không thể có hai giao dịch chạy đồng thời, nên không thể cho thấy (hay chấm) dị thường cô lập.'],
    tep: { 'write-skew.sql': HAI_PHIEN + '\n' },
    giaiTep: { 'write-skew.sql': `${HAI_PHIEN}

-- Expected, run 1 (REPEATABLE READ):
--   both UPDATEs succeed (they touch different rows), both COMMITs succeed
--   SELECT * FROM oncall;  →  An f · Binh f      ← the rule "someone is on call" is broken
-- Reset: UPDATE oncall SET on_call = true;
-- Expected, run 2 (SERIALIZABLE in both windows):
--   the second transaction to COMMIT gets
--   ERROR:  could not serialize access due to read/write dependencies among transactions
--   DETAIL: Reason code: Canceled on identification as a pivot, during commit attempt.
--   SELECT * FROM oncall;  →  exactly one person went off call
-- In the app: catch SQLSTATE 40001 → ROLLBACK → rerun the whole transaction (it will now see count = 1 and refuse)
` },
    viDu: [{ input: ['Run 2, window 2: COMMIT;', 'Lượt 2, cửa sổ 2: COMMIT;'], output: ['ERROR:  could not serialize access due to read/write dependencies among transactions', 'ERROR:  could not serialize access due to read/write dependencies among transactions'], explanation: ['Serializable detected the write skew and aborted one transaction; the other one committed.', 'Serializable phát hiện lệch ghi và huỷ một giao dịch; giao dịch kia đã commit.'] }],
    gy: [['Type each line in the right window before moving on — the interleaving is the whole point.', 'Gõ từng dòng đúng cửa sổ rồi mới làm tiếp — thứ tự xen kẽ chính là điểm mấu chốt.'], ['Reset the data between the two runs.', 'Đặt lại dữ liệu giữa hai lượt.']],
    lhg: [['Running window 1 to COMMIT before starting window 2 — that is serial execution, no anomaly appears.', 'Chạy cửa sổ 1 tới COMMIT rồi mới bắt đầu cửa sổ 2 — đó là chạy tuần tự, không có dị thường.'], ['Using SERIALIZABLE in only one of the two windows — SSI needs both transactions to be serializable.', 'Chỉ dùng SERIALIZABLE ở một trong hai cửa sổ — SSI cần cả hai giao dịch đều serializable.']],
    gt: ['<p>Each transaction alone keeps the rule (it sees 2 people on call, removes 1). Together they remove both. Repeatable Read cannot see the conflict because they write different rows; Serializable tracks read/write dependencies and aborts one of them.</p>', '<p>Mỗi giao dịch đứng riêng đều giữ luật (thấy 2 người trực, bỏ 1). Cùng nhau chúng bỏ cả hai. Repeatable Read không thấy xung đột vì chúng ghi các dòng khác nhau; Serializable theo dõi phụ thuộc đọc/ghi và huỷ một trong hai.</p>'],
    tn: [tn('write skew', 'lệch ghi'), tn('SERIALIZABLE', 'mức cô lập cao nhất')],
  }),
]);
