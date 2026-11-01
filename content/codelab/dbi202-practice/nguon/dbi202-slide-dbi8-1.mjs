/**
 * DBI202 · 8.A Slide trường Chương 7 (1–21) — giao dịch & ACID: chuyển khoản nguyên tử (BEGIN TRAN / COMMIT / ROLLBACK),
 * SET XACT_ABORT, tự động commit, mức cô lập và đọc bẩn.
 */
import { mod, cs, q, ord, bang1, tsql, ck, tn } from './_chung.mjs';

const ACC = `CREATE TABLE Account (accNo CHAR(4) NOT NULL PRIMARY KEY, owner NVARCHAR(40) NOT NULL,
                      balance DECIMAL(12,0) NOT NULL CONSTRAINT ck_account_balance CHECK (balance >= 0));
CREATE TABLE TransferLog (logID INT IDENTITY(1,1) PRIMARY KEY, fromAcc CHAR(4) NOT NULL, toAcc CHAR(4) NOT NULL,
                          amount DECIMAL(12,0) NOT NULL, at DATETIME2 NOT NULL DEFAULT SYSDATETIME());
INSERT INTO Account VALUES ('A001', N'An', 1000000), ('B002', N'Bình', 200000), ('C003', N'Chi', 0);`;
const TRANSFER = `CREATE OR ALTER PROCEDURE prTransfer
    @from   CHAR(4),
    @to     CHAR(4),
    @amount DECIMAL(12,0)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;                               -- any runtime error dooms the whole transaction
    BEGIN TRY
        BEGIN TRANSACTION;
            UPDATE Account SET balance = balance - @amount WHERE accNo = @from;
            IF @@ROWCOUNT = 0 THROW 50001, N'Source account not found', 1;
            UPDATE Account SET balance = balance + @amount WHERE accNo = @to;
            IF @@ROWCOUNT = 0 THROW 50002, N'Destination account not found', 1;
            INSERT INTO TransferLog (fromAcc, toAcc, amount) VALUES (@from, @to, @amount);
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;     -- never leave a (doomed) transaction open
        THROW;                                       -- re-raise the original error to the caller
    END CATCH
END`;
const TONG = `SELECT SUM(balance) FROM Account`;

export default mod('dbi202-slide-dbi8-1', '8.A Transactions & ACID (slides 1–21)', [
  tsql({
    t: 'Atomic transfer with SET XACT_ABORT ON', k: 'MEDIUM', p: 15,
    kn: ['BEGIN TRANSACTION / COMMIT', 'SET XACT_ABORT ON', 'THROW', '@@ROWCOUNT'], tag: ['tsql', 'transaction', 'acid', 'slide'],
    lyDo: ['BEGIN TRANSACTION / COMMIT / ROLLBACK and XACT_ABORT are exactly what the browser grader cannot run (it wraps every check in its own transaction).', 'BEGIN TRANSACTION / COMMIT / ROLLBACK và XACT_ABORT chính là thứ máy chấm trình duyệt không chạy được (nó tự bọc mỗi kiểm trong giao dịch riêng).'],
    en: '<p>Slide 9: a transfer is two UPDATEs that must succeed or fail together. Write <code>prTransfer @from CHAR(4), @to CHAR(4), @amount DECIMAL(12,0)</code>: take the money from @from, add it to @to, write one row to <code>TransferLog</code>, all in one transaction. With <code>SET XACT_ABORT ON</code> and TRY … CATCH, a CHECK violation (balance below 0) or a THROW for an unknown account undoes everything; the CATCH rolls back and re-raises the error (<code>THROW;</code>) so the caller knows.</p>',
    vi: '<p>Slide 9: chuyển khoản là hai câu UPDATE phải cùng thành công hoặc cùng thất bại. Viết <code>prTransfer @from CHAR(4), @to CHAR(4), @amount DECIMAL(12,0)</code>: trừ tiền ở @from, cộng vào @to, ghi một dòng vào <code>TransferLog</code>, tất cả trong một giao dịch. Với <code>SET XACT_ABORT ON</code> và TRY … CATCH, vi phạm CHECK (số dư âm) hoặc THROW vì tài khoản lạ sẽ huỷ toàn bộ; CATCH huỷ giao dịch rồi ném lại lỗi (<code>THROW;</code>) cho bên gọi biết.</p>',
    yc: [['SET XACT_ABORT ON; BEGIN TRY BEGIN TRANSACTION; … COMMIT TRANSACTION; END TRY BEGIN CATCH IF @@TRANCOUNT &gt; 0 ROLLBACK; THROW; END CATCH', 'SET XACT_ABORT ON; BEGIN TRY BEGIN TRANSACTION; … COMMIT TRANSACTION; END TRY BEGIN CATCH IF @@TRANCOUNT &gt; 0 ROLLBACK; THROW; END CATCH'], ['@@ROWCOUNT = 0 after an UPDATE ⇒ THROW (unknown account).', '@@ROWCOUNT = 0 sau UPDATE ⇒ THROW (tài khoản lạ).']],
    setup: ACC,
    khoi: `-- CREATE OR ALTER PROCEDURE prTransfer @from CHAR(4), @to CHAR(4), @amount DECIMAL(12,0) AS
-- BEGIN ... END
`,
    giai: TRANSFER,
    kiem: [
      ck(['A valid transfer moves the money and logs it', 'Chuyển hợp lệ dời tiền và ghi nhật ký'], `EXEC dbo.prTransfer 'A001', 'B002', 300000;
SET @ok = IIF((SELECT balance FROM Account WHERE accNo = 'A001') = 700000 AND (SELECT balance FROM Account WHERE accNo = 'B002') = 500000 AND (SELECT COUNT(*) FROM TransferLog) = 1, 1, 0);
SET @info = CONCAT(N'A001=', (SELECT balance FROM Account WHERE accNo = 'A001'), N' B002=', (SELECT balance FROM Account WHERE accNo = 'B002'));
UPDATE Account SET balance = 1000000 WHERE accNo = 'A001'; UPDATE Account SET balance = 200000 WHERE accNo = 'B002'; DELETE FROM TransferLog;`),
      ck(['Too much money: error, nothing changes (total still 1,200,000)', 'Quá số dư: lỗi, không đổi gì (tổng vẫn 1.200.000)'], `DECLARE @loi BIT = 0;
BEGIN TRY EXEC dbo.prTransfer 'B002', 'C003', 500000; END TRY BEGIN CATCH SET @loi = 1; END CATCH;
WHILE @@TRANCOUNT > 0 ROLLBACK;
SET @ok = IIF(OBJECT_ID(N'dbo.prTransfer') IS NOT NULL AND @loi = 1 AND (${TONG}) = 1200000 AND (SELECT balance FROM Account WHERE accNo = 'C003') = 0 AND (SELECT COUNT(*) FROM TransferLog) = 0, 1, 0);
SET @info = CONCAT(N'error raised: ', @loi, N' · C003 = ', (SELECT balance FROM Account WHERE accNo = 'C003'));`),
      ck(['Unknown destination: the money taken from A001 comes back', 'Tài khoản đích lạ: tiền đã trừ ở A001 được hoàn lại'], `DECLARE @loi BIT = 0;
BEGIN TRY EXEC dbo.prTransfer 'A001', 'Z999', 300000; END TRY BEGIN CATCH SET @loi = 1; END CATCH;
WHILE @@TRANCOUNT > 0 ROLLBACK;
SET @ok = IIF(OBJECT_ID(N'dbo.prTransfer') IS NOT NULL AND @loi = 1 AND (SELECT balance FROM Account WHERE accNo = 'A001') = 1000000 AND (SELECT COUNT(*) FROM TransferLog) = 0, 1, 0);
SET @info = CONCAT(N'error raised: ', @loi, N' · A001 = ', (SELECT balance FROM Account WHERE accNo = 'A001'));
UPDATE Account SET balance = 1000000 WHERE accNo = 'A001';`),
      ck(['No transaction is left open after an error', 'Không để giao dịch mở sau lỗi'], `BEGIN TRY EXEC dbo.prTransfer 'A001', 'Z999', 1; END TRY BEGIN CATCH END CATCH;
SET @ok = IIF(OBJECT_ID(N'dbo.prTransfer') IS NOT NULL AND @@TRANCOUNT = 0, 1, 0); SET @info = CONCAT(N'@@TRANCOUNT = ', @@TRANCOUNT); WHILE @@TRANCOUNT > 0 ROLLBACK; UPDATE Account SET balance = 1000000 WHERE accNo = 'A001';`),
    ],
    saiTay: [
      TRANSFER.replace('    SET XACT_ABORT ON;                               -- any runtime error dooms the whole transaction\n', '').replace('        BEGIN TRANSACTION;\n', '').replace('        COMMIT TRANSACTION;\n', ''),
      TRANSFER.replace("            IF @@ROWCOUNT = 0 THROW 50002, N'Destination account not found', 1;\n", ''),
      TRANSFER.replace('        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;     -- never leave a (doomed) transaction open\n', ''),
    ],
    gy: [['Without a transaction each UPDATE commits on its own (autocommit) — the first one stays even if the second fails.', 'Không có giao dịch thì mỗi UPDATE tự commit (autocommit) — câu đầu vẫn còn dù câu sau lỗi.'], ['XACT_ABORT ON turns any runtime error into "roll back the whole transaction and stop".', 'XACT_ABORT ON biến mọi lỗi lúc chạy thành "huỷ cả giao dịch và dừng".']],
    lhg: [['No transaction: an unknown destination leaves A001 300,000 poorer — money disappears.', 'Không có giao dịch: tài khoản đích lạ làm A001 mất 300.000 — tiền bốc hơi.'], ['No @@ROWCOUNT check — an UPDATE of 0 rows is not an error, the transfer "succeeds" into nowhere.', 'Không kiểm @@ROWCOUNT — UPDATE 0 dòng không phải lỗi, tiền "chuyển thành công" vào hư không.']],
    gt: ['<p>Atomicity: all or nothing. Consistency: the CHECK keeps balances ≥ 0 and the total constant. Durability: after COMMIT the log guarantees it survives a crash.</p>', '<p>Nguyên tử: tất cả hoặc không gì. Nhất quán: CHECK giữ số dư ≥ 0 và tổng không đổi. Bền vững: sau COMMIT, nhật ký bảo đảm nó sống sót qua sự cố.</p>'],
    tn: [tn('XACT_ABORT', 'tự huỷ giao dịch khi lỗi'), tn('autocommit', 'tự động commit')],
  }),
  cs({
    t: 'ACID: which property is at stake?', k: 'EASY', p: 6, loai: 'table',
    kn: ['atomicity', 'consistency', 'isolation', 'durability'], tag: ['acid', 'slide'],
    en: '<p>For each incident, name the ACID property that a correct transaction would have protected (slides 4–8).</p>',
    vi: '<p>Với mỗi sự cố, gọi tên tính chất ACID mà một giao dịch đúng sẽ bảo vệ (slide 4–8).</p>',
    bang: [bang1('b1', ['Incident → property', 'Sự cố → tính chất'],
      [{ ma: 'sc', ten: 'Incident / Sự cố' }, { ma: 'tc', ten: 'Property', luaChon: ['Atomicity', 'Consistency', 'Isolation', 'Durability'] }],
      [{ o: { sc: 'Power fails between the debit and the credit; the debit stays, the credit is lost.' }, a: { tc: 'Atomicity' } },
        { o: { sc: 'A transfer leaves a balance at −50,000 although the rule says balances are never negative.' }, a: { tc: 'Consistency' } },
        { o: { sc: 'A report reads a half-finished transfer of another session and shows money that never existed.' }, a: { tc: 'Isolation' } },
        { o: { sc: 'The server crashes one second after "COMMIT completed"; after restart the transfer is gone.' }, a: { tc: 'Durability' } }],
      ['All-or-nothing = A; rules hold before and after = C; concurrent transactions do not see each other\'s intermediate state = I; committed means permanent = D.', 'Tất cả hoặc không = A; luật đúng trước và sau = C; giao dịch đồng thời không thấy trạng thái dở của nhau = I; đã commit là vĩnh viễn = D.'])],
    gy: [['Half-done work ⇒ A. Seeing someone else\'s half-done work ⇒ I.', 'Việc làm dở ⇒ A. Thấy việc làm dở của người khác ⇒ I.'], ['"After COMMIT" ⇒ D.', '"Sau COMMIT" ⇒ D.']],
    lhg: [['Calling the dirty report an atomicity problem — the transfer itself is fine; the reader is not isolated.', 'Gọi báo cáo đọc bẩn là vấn đề nguyên tử — bản thân lần chuyển ổn; người đọc không được cách ly.'], ['Calling the negative balance durability.', 'Gọi số dư âm là vấn đề bền vững.']],
    tn: [tn('ACID', 'Nguyên tử · Nhất quán · Cách ly · Bền vững')],
  }),
  cs({
    t: 'Transaction lifecycle and autocommit', k: 'MEDIUM', p: 7,
    kn: ['autocommit', 'explicit transaction', 'ROLLBACK', 'NOLOCK'], tag: ['transaction', 'slide'],
    en: '<p>Slides 10–21 on SQL Server.</p>', vi: '<p>Slide 10–21 trên SQL Server.</p>',
    cau: [
      q('c1', ['In SSMS you run UPDATE Account SET balance = 0 (no BEGIN TRANSACTION). Can you undo it with ROLLBACK?', 'Trong SSMS bạn chạy UPDATE Account SET balance = 0 (không BEGIN TRANSACTION). ROLLBACK được không?'], ['No — in autocommit mode each statement commits by itself', 'Yes — SSMS keeps every statement open', 'Yes, within 60 seconds', 'Only if the table has a primary key'], ['ROLLBACK then fails with "no corresponding BEGIN TRANSACTION". Start risky work with BEGIN TRAN.', 'ROLLBACK khi đó báo "no corresponding BEGIN TRANSACTION". Việc rủi ro hãy bắt đầu bằng BEGIN TRAN.']),
      q('c2', ['SELECT … FROM Account WITH (NOLOCK) may return…', 'SELECT … FROM Account WITH (NOLOCK) có thể trả về…'], ['uncommitted changes of other transactions (dirty reads)', 'only rows committed before the query started', 'an error whenever another session writes', 'the same result as SERIALIZABLE'], ['NOLOCK = READ UNCOMMITTED for that table: fast but may read data that is later rolled back.', 'NOLOCK = READ UNCOMMITTED cho bảng đó: nhanh nhưng có thể đọc dữ liệu sau đó bị huỷ.']),
      q('c3', ['A transaction is open in one SSMS window and you forget to COMMIT. Other users…', 'Một giao dịch mở trong cửa sổ SSMS và bạn quên COMMIT. Người khác…'], ['wait on the rows it locked until you commit or roll back', 'see your changes immediately', 'are unaffected', 'get the old values and can overwrite them'], ['Exclusive locks stay until the transaction ends — the classic "query spins forever" of lesson 0.2.', 'Khoá độc quyền còn tới khi giao dịch kết thúc — lỗi "truy vấn quay mãi" của bài 0.2.']),
    ],
    gy: [['Autocommit = every statement is its own transaction.', 'Autocommit = mỗi câu lệnh là một giao dịch riêng.'], ['Locks live as long as the transaction.', 'Khoá sống bằng tuổi giao dịch.']],
    lhg: [['Expecting ROLLBACK to undo an autocommitted statement.', 'Tưởng ROLLBACK huỷ được câu đã tự commit.'], ['Using NOLOCK "to make it faster" in a money report.', 'Dùng NOLOCK "cho nhanh" trong báo cáo tiền.']],
    tn: [tn('dirty read', 'đọc bẩn'), tn('write-ahead log', 'ghi nhật ký trước')],
  }),
  cs({
    t: 'The life of a transaction, in order', k: 'EASY', p: 5, loai: 'order',
    kn: ['transaction lifecycle', 'write-ahead logging'], tag: ['transaction', 'slide'],
    en: '<p>What happens, in order, when an explicit transaction succeeds (slides 10–14)?</p>',
    vi: '<p>Chuyện gì xảy ra, theo thứ tự, khi một giao dịch tường minh thành công (slide 10–14)?</p>',
    cau: [
      ord('o1', ['Order the life of an explicit transaction that succeeds', 'Sắp vòng đời một giao dịch tường minh thành công'], ['BEGIN TRANSACTION', 'The statements run and take their locks', 'The changes are written to the transaction log', 'COMMIT TRANSACTION', 'Locks are released and other sessions see the new data'], ['The log record must be safe before COMMIT returns (write-ahead logging); locks are held until the end of the transaction.', 'Bản ghi nhật ký phải an toàn trước khi COMMIT trả về (ghi nhật ký trước); khoá được giữ tới cuối giao dịch.']),
    ],
    gy: [['The log is written before COMMIT returns.', 'Nhật ký được ghi trước khi COMMIT trả về.'], ['Locks are released only at the end.', 'Khoá chỉ được nhả ở cuối.']],
    lhg: [['Releasing locks before COMMIT.', 'Nhả khoá trước COMMIT.'], ['Thinking data pages must reach the disk before COMMIT (only the log must).', 'Tưởng trang dữ liệu phải xuống đĩa trước COMMIT (chỉ nhật ký phải).']],
  }),
]);
