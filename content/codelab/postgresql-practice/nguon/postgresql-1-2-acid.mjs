/**
 * PostgreSQL · 1.2 — ACID. Bảng accounts của bài. Máy chấm bọc MỖI kiểm trong một giao dịch rồi ROLLBACK, nên người học
 * không gõ BEGIN/COMMIT — tính nguyên tử được kiểm bằng hành vi: lệnh vi phạm ràng buộc làm hỏng CẢ lượt chạy.
 */
import { mod, pg, cs, q, bang1, kq, sau, chan, duoc, ma, pre, TN, tn } from './_chung.mjs';

const ACC_DDL = `CREATE TABLE accounts (
  id      text PRIMARY KEY,
  owner   text NOT NULL,
  balance numeric(12,2) NOT NULL CHECK (balance >= 0)
);`;
const ACC = `${ACC_DDL}
INSERT INTO accounts VALUES ('A', 'Cuong', 100.00), ('B', 'Mai', 0.00), ('C', 'Lan', 250.00);`;
const LD = {
  en: `<h4>Sample table (lesson 1.2)</h4>${pre(`accounts (id text PK, owner, balance numeric(12,2) CHECK (balance >= 0))
A Cuong 100.00 · B Mai 0.00 · C Lan 250.00`)}<p>The grader wraps each check in its own transaction and rolls it back — do not write BEGIN/COMMIT.</p>`,
  vi: `<h4>Bảng mẫu (bài 1.2)</h4>${pre(`accounts (id text PK, owner, balance numeric(12,2) CHECK (balance >= 0))
A Cuong 100.00 · B Mai 0.00 · C Lan 250.00`)}<p>Máy chấm tự bọc mỗi kiểm trong một giao dịch rồi huỷ — đừng viết BEGIN/COMMIT.</p>`,
};
const O = { csdl: ACC, tenCsdl: 'accounts', ld: LD };
const XEM = 'SELECT id, balance FROM accounts ORDER BY id';
const ACID = ['A', 'C', 'I', 'D'];

export default mod('postgresql-1-2-acid', '1.2 ACID: the four guarantees, proven', [
  pg({
    ...O, t: 'A transfer is two updates', k: 'EASY', p: 6, kn: ['UPDATE … SET balance = balance ± x'], tag: ['transaction', 'acid'],
    en: '<p>Cuong (account A) sends <b>30.00</b> to Mai (account B). Write the two UPDATE statements of the transfer.</p>',
    vi: '<p>Cuong (tài khoản A) chuyển <b>30.00</b> cho Mai (tài khoản B). Viết hai lệnh UPDATE của phi vụ chuyển tiền.</p>',
    yc: [['Subtract from A, add to B — relative to the current balance (<code>balance - 30</code>), never a hard-coded result.', 'Trừ A, cộng B — tính từ số dư hiện tại (<code>balance - 30</code>), không ghi cứng kết quả.'], ['No BEGIN/COMMIT: the grader runs your statements inside one transaction for you.', 'Không BEGIN/COMMIT: máy chấm tự chạy các lệnh của bạn trong một giao dịch.']],
    giai: `UPDATE accounts SET balance = balance - 30 WHERE id = 'A';
UPDATE accounts SET balance = balance + 30 WHERE id = 'B';`,
    kiem: [
      sau(['A 70.00, B 30.00, C unchanged', 'A 70.00, B 30.00, C giữ nguyên'], XEM, { thuTu: true }),
      sau(['Relative to the balance at that moment', 'Tính theo số dư lúc chạy'], XEM, { thuTu: true, an: true, themCsdl: "UPDATE accounts SET balance = 500 WHERE id = 'A'; UPDATE accounts SET balance = 12.5 WHERE id = 'B'" }),
      ma(['Two UPDATE statements', 'Hai lệnh UPDATE'], '\\bUPDATE\\b[\\s\\S]*\\bUPDATE\\b'),
    ],
    sai: ["UPDATE accounts SET balance = 70 WHERE id = 'A'; UPDATE accounts SET balance = 30 WHERE id = 'B';", "UPDATE accounts SET balance = balance - 30 WHERE id = 'A';"],
    gy: [['<code>UPDATE accounts SET balance = balance - 30 WHERE id = \'A\';</code>', '<code>UPDATE accounts SET balance = balance - 30 WHERE id = \'A\';</code>'], ['Then the same for B with +.', 'Rồi tương tự cho B với dấu +.']],
    lhg: [['Writing the final numbers (<code>SET balance = 70</code>) — wrong the moment the balance was not exactly 100.', 'Ghi số cuối (<code>SET balance = 70</code>) — sai ngay khi số dư không đúng 100.'], ['Only debiting A: money disappears from the system.', 'Chỉ trừ A: tiền biến mất khỏi hệ thống.']],
    gt: ['<p>Both updates belong to ONE transaction, so either both are visible after COMMIT or neither is. Writing <code>balance - 30</code> lets the database compute from the value it has right now.</p>', '<p>Hai lệnh cập nhật thuộc MỘT giao dịch, nên sau COMMIT hoặc cả hai cùng hiện, hoặc không cái nào. Viết <code>balance - 30</code> để CSDL tính từ giá trị nó đang có.</p>'],
    tn: [TN.txn],
  }),

  pg({
    t: 'C is a constraint: make overdraft impossible', k: 'MEDIUM', p: 8, kn: ['CHECK', 'numeric(12,2)', 'PRIMARY KEY'], tag: ['ddl', 'acid', 'check'],
    en: '<p>Create the <code>accounts</code> table of lesson 1.2 so that <b>no statement, from any app</b>, can leave a negative balance or two accounts with the same id. Then open accounts <code>A</code> (Cuong, 100.00) and <code>B</code> (Mai, 0.00).</p>',
    vi: '<p>Tạo bảng <code>accounts</code> của bài 1.2 sao cho <b>không lệnh nào, từ app nào</b>, để lại số dư âm hay hai tài khoản trùng id. Rồi mở tài khoản <code>A</code> (Cuong, 100.00) và <code>B</code> (Mai, 0.00).</p>',
    yc: [['Columns <code>id text</code> (primary key), <code>owner text NOT NULL</code>, <code>balance numeric(12,2) NOT NULL</code> with a CHECK.', 'Cột <code>id text</code> (khoá chính), <code>owner text NOT NULL</code>, <code>balance numeric(12,2) NOT NULL</code> kèm CHECK.'], ['Then INSERT the two accounts.', 'Rồi INSERT hai tài khoản.']],
    csdl: '', ld: null,
    giai: `${ACC_DDL}
INSERT INTO accounts VALUES ('A', 'Cuong', 100.00), ('B', 'Mai', 0.00);`,
    kiem: [
      sau(['Two accounts opened', 'Đã mở hai tài khoản'], 'SELECT id, owner, balance FROM accounts ORDER BY id', { thuTu: true }),
      chan(['Taking 150 from A is rejected (A would be −50)', 'Rút 150 từ A bị chặn (A sẽ là −50)'], "UPDATE accounts SET balance = balance - 150 WHERE id = 'A'", '23514'),
      chan(['A second account with id A is rejected', 'Tài khoản thứ hai cùng id A bị chặn'], "INSERT INTO accounts VALUES ('A', 'Ghost', 1)", '23505'),
      duoc(['Taking exactly 100 from A is fine (balance 0)', 'Rút đúng 100 từ A thì được (số dư 0)'], "UPDATE accounts SET balance = balance - 100 WHERE id = 'A'", { an: true }),
      chan(['An account without balance is rejected', 'Tài khoản không có số dư bị chặn'], "INSERT INTO accounts (id, owner) VALUES ('Z', 'Nobody')", '23502', { an: true }),
    ],
    sai: [`CREATE TABLE accounts (id text PRIMARY KEY, owner text NOT NULL, balance numeric(12,2) NOT NULL); INSERT INTO accounts VALUES ('A', 'Cuong', 100.00), ('B', 'Mai', 0.00);`, `CREATE TABLE accounts (id text PRIMARY KEY, owner text NOT NULL, balance numeric(12,2) NOT NULL CHECK (balance > 0)); INSERT INTO accounts VALUES ('A', 'Cuong', 100.00), ('B', 'Mai', 0.01);`],
    gy: [['<code>CHECK (balance &gt;= 0)</code> on the column.', '<code>CHECK (balance &gt;= 0)</code> trên cột.'], ['A zero balance is legal — the CHECK must accept 0.', 'Số dư 0 là hợp lệ — CHECK phải nhận 0.']],
    lhg: [['Checking the balance only in the app — another app (or a hand-typed UPDATE) still writes −50.', 'Chỉ kiểm số dư trong app — app khác (hay lệnh UPDATE gõ tay) vẫn ghi −50.'], ['<code>CHECK (balance &gt; 0)</code>: Mai\'s new account with 0.00 cannot even be opened.', '<code>CHECK (balance &gt; 0)</code>: tài khoản mới 0.00 của Mai không mở được.']],
    gt: ['<p>Consistency means the rules you declared hold after every transaction. The CHECK makes the database reject the overdraft — and because the statement fails, the whole transaction fails, so the matching credit to B never survives either.</p>', '<p>Nhất quán nghĩa là luật bạn khai luôn đúng sau mỗi giao dịch. CHECK làm CSDL từ chối lệnh rút quá — và vì lệnh lỗi nên cả giao dịch hỏng, khoản cộng cho B cũng không còn.</p>'],
    tn: [TN.check, TN.pk],
  }),

  pg({
    ...O, t: 'One statement, one atomic transfer', k: 'HARD', p: 12, kn: ['UPDATE with CASE', 'WHERE id IN (…)', 'statement atomicity'], tag: ['transaction', 'acid'],
    en: '<p>Some drivers run every statement in autocommit. Make the transfer of <b>40.00</b> from Lan (C) to Cuong (A) a <b>single UPDATE</b>, so it is atomic even without an explicit transaction. Return <code>id, balance</code> of the two changed accounts.</p>',
    vi: '<p>Vài driver chạy mỗi lệnh ở chế độ autocommit. Hãy làm phi vụ chuyển <b>40.00</b> từ Lan (C) sang Cuong (A) thành <b>một lệnh UPDATE duy nhất</b>, để nó nguyên tử ngay cả khi không mở giao dịch. Trả về <code>id, balance</code> của hai tài khoản bị đổi.</p>',
    yc: [['Exactly ONE UPDATE statement touching both rows (<code>WHERE id IN (\'A\', \'C\')</code>).', 'Đúng MỘT lệnh UPDATE đụng cả hai dòng (<code>WHERE id IN (\'A\', \'C\')</code>).'], ['<code>SET balance = CASE id WHEN … THEN … END</code>; finish with <code>RETURNING id, balance</code>.', '<code>SET balance = CASE id WHEN … THEN … END</code>; kết thúc bằng <code>RETURNING id, balance</code>.']],
    giai: `UPDATE accounts
SET balance = CASE id
                WHEN 'C' THEN balance - 40     -- debit
                WHEN 'A' THEN balance + 40     -- credit
              END
WHERE id IN ('A', 'C')                         -- without this, B would get NULL (and fail NOT NULL)
RETURNING id, balance;`,
    kiem: [
      kq(['A 140.00 and C 210.00', 'A 140.00 và C 210.00']),
      sau(['B is untouched', 'B không bị đụng'], XEM, { thuTu: true }),
      sau(['Works from any starting balance', 'Đúng với mọi số dư ban đầu'], XEM, { thuTu: true, an: true, themCsdl: "UPDATE accounts SET balance = 41 WHERE id = 'C'; UPDATE accounts SET balance = 0 WHERE id = 'A'" }),
      ma(['A single UPDATE statement', 'Một lệnh UPDATE duy nhất'], '^(?![\\s\\S]*\\bUPDATE\\b[\\s\\S]*\\bUPDATE\\b)[\\s\\S]*\\bUPDATE\\b'),
    ],
    sai: ["UPDATE accounts SET balance = CASE id WHEN 'C' THEN balance - 40 WHEN 'A' THEN balance + 40 ELSE balance END RETURNING id, balance", "UPDATE accounts SET balance = balance - 40 WHERE id = 'C'; UPDATE accounts SET balance = balance + 40 WHERE id = 'A' RETURNING id, balance;"],
    gy: [['A CASE expression can compute a different new value for each row.', 'Biểu thức CASE tính được giá trị mới khác nhau cho từng dòng.'], ['Restrict the rows with <code>WHERE id IN (\'A\', \'C\')</code> so RETURNING shows only the two accounts.', 'Giới hạn dòng bằng <code>WHERE id IN (\'A\', \'C\')</code> để RETURNING chỉ hiện hai tài khoản.']],
    lhg: [['No WHERE (with <code>ELSE balance</code>): every account is rewritten, B appears in RETURNING and its row is locked for nothing.', 'Không WHERE (có <code>ELSE balance</code>): mọi tài khoản bị ghi lại, B hiện trong RETURNING và dòng của nó bị khoá vô ích.'], ['Two UPDATEs in autocommit: a crash between them loses 40.00.', 'Hai lệnh UPDATE ở autocommit: sập giữa chừng là mất 40.00.']],
    gt: ['<p>Every single SQL statement is atomic: if the CHECK fails for C, the credit to A is undone with it. One UPDATE with CASE moves the money in one step — handy when you cannot control the transaction boundaries.</p>', '<p>Mỗi câu SQL đơn lẻ đều nguyên tử: nếu CHECK của C hỏng thì khoản cộng cho A cũng bị huỷ theo. Một UPDATE với CASE chuyển tiền trong một bước — tiện khi bạn không điều khiển được ranh giới giao dịch.</p>'],
    tn: [TN.txn, tn('CASE', 'biểu thức rẽ nhánh')],
  }),

  cs({
    t: 'Which letter of ACID saved you?', k: 'MEDIUM', p: 6, loai: 'table', kn: ['atomicity', 'consistency', 'isolation', 'durability'], tag: ['acid', 'concepts'],
    en: '<p>For each incident, pick the ACID property that is doing the work.</p>', vi: '<p>Với mỗi sự cố, chọn tính chất ACID đang làm việc.</p>',
    bang: [bang1('b1', ['Incident → property', 'Sự cố → tính chất'], [{ ma: 'su', ten: 'Incident / Sự cố' }, { ma: 'tc', ten: 'Property', luaChon: ACID }], [
      { o: { su: 'The server loses power one second after COMMIT returned; after restart the transfer is there. / Mất điện 1 giây sau khi COMMIT trả về; khởi động lại, phi vụ vẫn còn.' }, a: { tc: 'D' } },
      { o: { su: 'The second UPDATE of a transfer fails, and the first one is undone too. / UPDATE thứ hai của phi vụ lỗi, UPDATE thứ nhất cũng bị huỷ.' }, a: { tc: 'A' } },
      { o: { su: 'A report running during a transfer never sees A debited but B not yet credited. / Báo cáo chạy giữa phi vụ không bao giờ thấy A đã trừ mà B chưa cộng.' }, a: { tc: 'I' } },
      { o: { su: 'An UPDATE that would make a balance −50 is rejected by CHECK. / Lệnh UPDATE làm số dư −50 bị CHECK chặn.' }, a: { tc: 'C' } },
      { o: { su: 'A typo inserts two rows with the same account id; the primary key refuses the second one. / Gõ nhầm chèn hai dòng cùng id; khoá chính từ chối dòng thứ hai.' }, a: { tc: 'C' } },
    ], ['Atomicity = all or nothing; Consistency = declared rules hold; Isolation = in-flight work of others is invisible; Durability = committed survives crashes (WAL flushed to disk before COMMIT returns).', 'Nguyên tử = tất cả hoặc không; Nhất quán = luật đã khai luôn đúng; Cô lập = việc dở dang của người khác không nhìn thấy; Bền vững = đã commit thì sống qua sự cố (WAL ghi đĩa trước khi COMMIT trả về).'])],
    gy: [['Ask: is it about a crash after COMMIT (D), a partial failure (A), a rule (C) or other sessions (I)?', 'Tự hỏi: sự cố sau COMMIT (D), lỗi giữa chừng (A), luật (C) hay phiên khác (I)?'], ['Constraints are the tool of C.', 'Ràng buộc là công cụ của C.']],
    lhg: [['Calling the CHECK case "atomicity" — the statement failing is A, but the RULE that made it fail is C.', 'Gọi trường hợp CHECK là "nguyên tử" — lệnh hỏng là A, nhưng LUẬT khiến nó hỏng là C.'], ['Mixing up isolation (others) and atomicity (my own partial work).', 'Nhầm cô lập (người khác) với nguyên tử (việc dở của chính mình).']],
    tn: [TN.txn],
  }),
]);
