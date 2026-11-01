/**
 * PostgreSQL · 11.1 — Giao dịch: được tất cả hoặc không gì. Máy chấm tự bọc mỗi kiểm trong một giao dịch nên người học không
 * gõ BEGIN/COMMIT trong bài SQL; trạng thái "aborted" và SAVEPOINT được luyện bằng câu hỏi sắp thứ tự / trắc nghiệm trên đúng
 * kịch bản của bài, phần SQL chấm thật là hàm chuyển tiền nguyên tử (DO … EXCEPTION chứng minh không còn nửa vời).
 */
import { mod, pg, cs, q, ord, sau, chan, duoc, ma, pre, TN, tn } from './_chung.mjs';

const ACC = `CREATE TABLE accounts (
  id      text PRIMARY KEY,
  owner   text NOT NULL,
  balance numeric(12,2) NOT NULL CHECK (balance >= 0)
);
INSERT INTO accounts VALUES ('A', 'Cuong', 100.00), ('B', 'Mai', 0.00);`;
const XEM = 'SELECT id, balance FROM accounts ORDER BY id';

export default mod('postgresql-11-1-giao-dich', '11.1 Transactions: all of it, or none of it', [
  cs({
    t: 'The aborted transaction, step by step', k: 'EASY', p: 5, loai: 'order', kn: ['aborted state', 'ROLLBACK'], tag: ['transaction'],
    en: `<p>In psql (accounts A = 100, B = 0) you type:</p>${pre(`BEGIN;
UPDATE accounts SET balance = balance - 500 WHERE id = 'A';   -- violates the CHECK
SELECT 'does this run?' AS probe;
COMMIT;`)}<p>Order what PostgreSQL answers.</p>`,
    vi: `<p>Trong psql (tài khoản A = 100, B = 0) bạn gõ:</p>${pre(`BEGIN;
UPDATE accounts SET balance = balance - 500 WHERE id = 'A';   -- vi phạm CHECK
SELECT 'câu này có chạy không?' AS thu;
COMMIT;`)}<p>Sắp thứ tự những gì PostgreSQL trả lời.</p>`,
    cau: [ord('o1', ['What happens, in order', 'Điều gì xảy ra, theo thứ tự'], [
      'BEGIN — a transaction is open / mở giao dịch',
      'ERROR: new row … violates check constraint "accounts_balance_check" / lỗi vi phạm CHECK',
      'ERROR: current transaction is aborted, commands ignored until end of transaction block / mọi lệnh sau bị bỏ qua',
      'COMMIT answers ROLLBACK — nothing is saved / COMMIT trả về ROLLBACK, không gì được lưu',
    ], ['After any error the transaction is aborted: every further statement fails until the block ends, and COMMIT turns into ROLLBACK. This is why drivers must roll back (or use savepoints) before retrying.', 'Sau bất kỳ lỗi nào giao dịch bị hỏng: mọi câu sau đều lỗi cho tới khi kết thúc khối, và COMMIT biến thành ROLLBACK. Vì vậy driver phải rollback (hoặc dùng savepoint) trước khi thử lại.'])],
    gy: [['One error poisons the whole transaction in PostgreSQL.', 'Trong PostgreSQL một lỗi làm hỏng cả giao dịch.'], ['COMMIT of an aborted transaction reports ROLLBACK.', 'COMMIT một giao dịch đã hỏng sẽ báo ROLLBACK.']],
    lhg: [['Expecting the SELECT to run (SQL Server continues after many errors; PostgreSQL does not).', 'Mong câu SELECT vẫn chạy (SQL Server chạy tiếp sau nhiều lỗi; PostgreSQL thì không).'], ['Thinking COMMIT saves the statements that succeeded before the error.', 'Nghĩ rằng COMMIT lưu được các câu đã thành công trước lỗi.']],
    tn: [TN.txn, tn('aborted transaction', 'giao dịch đã hỏng')],
  }),

  cs({
    t: 'SAVEPOINT: what is left after each rollback?', k: 'MEDIUM', p: 6, kn: ['SAVEPOINT', 'ROLLBACK TO SAVEPOINT'], tag: ['transaction', 'savepoint'],
    en: '<p>Start: A = 100.00, B = 0.00. Work out the balances.</p>', vi: '<p>Ban đầu: A = 100.00, B = 0.00. Tính số dư.</p>',
    cau: [
      q('q1', [`After ${'<code>BEGIN; UPDATE … A − 40; SAVEPOINT sp1; UPDATE … A − 500 (fails); ROLLBACK TO SAVEPOINT sp1; UPDATE … B + 40; COMMIT;</code>'}`, `Sau ${'<code>BEGIN; UPDATE … A − 40; SAVEPOINT sp1; UPDATE … A − 500 (lỗi); ROLLBACK TO SAVEPOINT sp1; UPDATE … B + 40; COMMIT;</code>'}`], ['A 60.00, B 40.00', 'A 100.00, B 0.00', 'A 60.00, B 0.00', 'A 100.00, B 40.00'], ['ROLLBACK TO SAVEPOINT undoes only the work after sp1 (the failed update) and clears the aborted state; the −40 and +40 commit.', 'ROLLBACK TO SAVEPOINT chỉ huỷ phần sau sp1 (lệnh hỏng) và gỡ trạng thái hỏng; −40 và +40 được commit.']),
      q('q2', ['Same as above but without <code>ROLLBACK TO SAVEPOINT sp1</code> (the next UPDATE is typed right after the error, then COMMIT).', 'Như trên nhưng không có <code>ROLLBACK TO SAVEPOINT sp1</code> (gõ UPDATE kế tiếp ngay sau lỗi, rồi COMMIT).'], ['A 100.00, B 0.00 (all rolled back)', 'A 60.00, B 40.00 (both kept)', 'A 60.00, B 0.00 (debit only)', 'A 100.00, B 40.00 (credit only)'], ['Without the savepoint rollback the transaction stays aborted: the B update fails and COMMIT becomes ROLLBACK.', 'Không rollback về savepoint thì giao dịch vẫn hỏng: lệnh cập nhật B lỗi và COMMIT thành ROLLBACK.']),
      q('q3', ['<code>BEGIN; CREATE TABLE thu_ddl (id int); INSERT INTO thu_ddl VALUES (1); ROLLBACK;</code> — does thu_ddl exist afterwards?', '<code>BEGIN; CREATE TABLE thu_ddl (id int); INSERT INTO thu_ddl VALUES (1); ROLLBACK;</code> — sau đó thu_ddl còn không?'], ['no — DDL is transactional in PostgreSQL', 'yes, empty', 'yes, with one row', 'only until the session ends'], ['PostgreSQL rolls back CREATE/ALTER/DROP like data changes — a migration that fails halfway leaves nothing behind (MySQL commits DDL implicitly).', 'PostgreSQL rollback được CREATE/ALTER/DROP như thay đổi dữ liệu — migration hỏng giữa chừng không để lại gì (MySQL tự commit DDL).']),
      q('q4', ['Why do ORMs wrap a retry loop around a transaction instead of continuing after an error?', 'Vì sao ORM bọc vòng thử lại quanh cả giao dịch thay vì chạy tiếp sau lỗi?'], ['an error aborts the whole transaction: roll back, rerun', 'most errors come from the network, so resending helps', 'PostgreSQL closes the connection after every error', 'a retry loop is faster than using a savepoint'], ['Serialization failures (40001) and deadlocks (40P01) in particular require rerunning the whole transaction from the start.', 'Đặc biệt lỗi tuần tự hoá (40001) và deadlock (40P01) bắt buộc chạy lại cả giao dịch từ đầu.']),
    ],
    gy: [['A savepoint is a bookmark inside one transaction.', 'Savepoint là dấu trang bên trong một giao dịch.'], ['Only ROLLBACK (TO SAVEPOINT) clears the aborted state.', 'Chỉ ROLLBACK (TO SAVEPOINT) mới gỡ trạng thái hỏng.']],
    lhg: [['Thinking a failed statement is simply skipped.', 'Nghĩ rằng câu lỗi chỉ bị bỏ qua.'], ['Thinking DDL cannot be rolled back.', 'Nghĩ rằng DDL không rollback được.']],
    tn: [tn('SAVEPOINT', 'điểm lưu trong giao dịch')],
  }),

  pg({
    csdl: ACC, tenCsdl: 'accounts', ld: { en: pre("accounts (id text PK, owner, balance numeric(12,2) CHECK (balance >= 0)) — A Cuong 100.00, B Mai 0.00"), vi: pre("accounts (id text PK, owner, balance numeric(12,2) CHECK (balance >= 0)) — A Cuong 100.00, B Mai 0.00") },
    t: 'An atomic transfer you can call: transfer(from, to, amount)', k: 'HARD', p: 12, kn: ['function body = one statement context', 'atomicity on error', 'RETURNS void'], tag: ['transaction', 'function'],
    en: '<p>Create <code>transfer(src text, dst text, amount numeric) RETURNS void</code> (LANGUAGE sql or plpgsql) that debits <code>src</code> and credits <code>dst</code>. Because a function call is one statement, a failure anywhere (e.g. the CHECK on the debit) must leave <b>both</b> balances untouched.</p>',
    vi: '<p>Tạo <code>transfer(src text, dst text, amount numeric) RETURNS void</code> (LANGUAGE sql hoặc plpgsql) trừ tiền <code>src</code> và cộng tiền <code>dst</code>. Vì lời gọi hàm là một câu lệnh, lỗi ở bất kỳ đâu (vd CHECK của lệnh trừ) phải để <b>cả hai</b> số dư nguyên vẹn.</p>',
    yc: [['Two UPDATE statements inside the function.', 'Hai lệnh UPDATE bên trong hàm.'], ['Credit first or debit first — either way the failure must undo both.', 'Cộng trước hay trừ trước — kiểu gì lỗi cũng phải huỷ cả hai.']],
    giai: `CREATE FUNCTION transfer(src text, dst text, amount numeric) RETURNS void
LANGUAGE sql AS $$
  UPDATE accounts SET balance = balance + amount WHERE id = dst;   -- credit first, on purpose …
  UPDATE accounts SET balance = balance - amount WHERE id = src;   -- … if this violates the CHECK, the credit is undone too
$$;`,
    kiem: [
      sau(['transfer(A, B, 30) moves 30', 'transfer(A, B, 30) chuyển 30'], `SELECT transfer('A', 'B', 30); ${XEM}`, { thuTu: true }),
      chan(['An overdraft is rejected', 'Rút quá số dư bị chặn'], "SELECT transfer('A', 'B', 500)", '23514'),
      sau(['After a failed transfer nothing changed — not even the credit', 'Sau một lần chuyển hỏng không gì thay đổi — kể cả khoản cộng'], `DO $$ BEGIN PERFORM transfer('A', 'B', 500); EXCEPTION WHEN check_violation THEN NULL; END $$; ${XEM}`, { thuTu: true }),
      sau(['Two transfers in a row', 'Hai lần chuyển liên tiếp'], `SELECT transfer('A', 'B', 70); SELECT transfer('B', 'A', 20); ${XEM}`, { thuTu: true, an: true }),
    ],
    sai: ["CREATE FUNCTION transfer(src text, dst text, amount numeric) RETURNS void LANGUAGE sql AS $$ UPDATE accounts SET balance = balance + amount WHERE id = dst; $$;", "CREATE FUNCTION transfer(src text, dst text, amount numeric) RETURNS void LANGUAGE plpgsql AS $$ BEGIN UPDATE accounts SET balance = balance + amount WHERE id = dst; BEGIN UPDATE accounts SET balance = balance - amount WHERE id = src; EXCEPTION WHEN check_violation THEN NULL; END; END $$;"],
    gy: [['A function body runs inside the caller\'s statement: its errors abort the caller.', 'Thân hàm chạy bên trong câu lệnh của người gọi: lỗi của nó làm hỏng người gọi.'], ['Do NOT catch and ignore the error inside the function — that is how half a transfer survives.', 'ĐỪNG bắt rồi lờ lỗi bên trong hàm — đó là cách nửa phi vụ chuyển tiền sống sót.']],
    lhg: [['Forgetting the debit: money is created out of nothing.', 'Quên lệnh trừ: tiền tự sinh ra từ hư không.'], ['Wrapping the debit in BEGIN … EXCEPTION … END and swallowing the error: the credit stays, the debit is skipped — exactly the half-transfer ACID forbids.', 'Bọc lệnh trừ trong BEGIN … EXCEPTION … END rồi nuốt lỗi: khoản cộng ở lại, khoản trừ bị bỏ — đúng kiểu nửa vời mà ACID cấm.']],
    gt: ['<p>Every statement is atomic, and a function call is a statement. If the debit fails, the credit made a moment earlier in the same call is rolled back with it. The third check proves it: it catches the error outside, then looks at the balances — both unchanged.</p>', '<p>Mỗi câu lệnh đều nguyên tử, và lời gọi hàm là một câu lệnh. Nếu lệnh trừ hỏng, khoản cộng vừa làm trong cùng lời gọi bị huỷ theo. Kiểm thứ ba chứng minh điều đó: nó bắt lỗi ở ngoài, rồi xem số dư — cả hai nguyên vẹn.</p>'],
    tn: [TN.txn, tn('atomicity', 'tính nguyên tử')],
  }),
]);
