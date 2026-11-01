/**
 * DBI202 · ⭐ CS.4 — bài tập giao dịch & tương tranh: gọi tên hiện tượng, thủ tục chuyển tiền an toàn (khoá theo thứ tự id, UPDLOCK,
 * XACT_ABORT + TRY/CATCH + THROW — chạy trên SQL Server), chọn kỹ thuật, đoán kết quả (REPEATABLE READ, deadlock, ai chặn ai).
 */
import { mod, cs, q, bang1, tsql, ck, tn } from './_chung.mjs';

const AN = ['dirty read', 'non-repeatable read', 'phantom', 'lost update', 'write skew'];
const TK = `CREATE TABLE dbo.TaiKhoan (
    id    INT           NOT NULL CONSTRAINT pk_taikhoan PRIMARY KEY,
    chuTk NVARCHAR(50)  NOT NULL,
    soDu  DECIMAL(12,0) NOT NULL CONSTRAINT ck_taikhoan_sodu CHECK (soDu >= 0)
);
INSERT INTO dbo.TaiKhoan VALUES (1, N'An', 100), (2, N'Bình', 50), (3, N'Chi', 0);`;

const GIAI = `CREATE OR ALTER PROCEDURE dbo.chuyen_tien @tu INT, @den INT, @soTien DECIMAL(12,0)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;                                    -- any error dooms the transaction
    BEGIN TRY
        IF @soTien IS NULL OR @soTien <= 0
            THROW 50003, N'Amount must be positive', 1;
        BEGIN TRANSACTION;
            DECLARE @nho INT = IIF(@tu < @den, @tu, @den), @lon INT = IIF(@tu < @den, @den, @tu), @x DECIMAL(12,0);
            SELECT @x = soDu FROM dbo.TaiKhoan WITH (UPDLOCK) WHERE id = @nho;   -- lock the smaller id first…
            SELECT @x = soDu FROM dbo.TaiKhoan WITH (UPDLOCK) WHERE id = @lon;   -- …then the larger: no deadlock cycle
            IF @tu = @den OR (SELECT COUNT(*) FROM dbo.TaiKhoan WHERE id IN (@tu, @den)) < 2
                THROW 50001, N'Unknown account', 1;
            IF (SELECT soDu FROM dbo.TaiKhoan WHERE id = @tu) < @soTien
                THROW 50002, N'Insufficient funds', 1;
            UPDATE dbo.TaiKhoan SET soDu = soDu - @soTien WHERE id = @tu;
            UPDATE dbo.TaiKhoan SET soDu = soDu + @soTien WHERE id = @den;
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF XACT_STATE() <> 0 ROLLBACK TRANSACTION;
        THROW;                                            -- report the original error to the caller
    END CATCH
END`;

const GOI = (tu, den, tien) => `DECLARE @e INT = 0, @truoc NVARCHAR(100) = (SELECT STRING_AGG(CONCAT(id, ':', soDu), ',') WITHIN GROUP (ORDER BY id) FROM dbo.TaiKhoan);
BEGIN TRY EXEC dbo.chuyen_tien ${tu}, ${den}, ${tien}; END TRY BEGIN CATCH SET @e = ERROR_NUMBER(); END CATCH;
WHILE @@TRANCOUNT > 0 ROLLBACK;
DECLARE @sau NVARCHAR(100) = (SELECT STRING_AGG(CONCAT(id, ':', soDu), ',') WITHIN GROUP (ORDER BY id) FROM dbo.TaiKhoan);`;

export default mod('dbi202-cs4-on', '⭐ CS.4 Exercises: transactions & concurrency', [
  cs({
    t: 'Exercise 1 — name the anomaly from the timeline', k: 'EASY', p: 6, loai: 'table',
    kn: ['dirty read', 'non-repeatable read', 'phantom', 'lost update', 'write skew'], tag: ['advanced', 'transaction'],
    en: '<p>Each line is a short timeline of two sessions A and B. Name the anomaly.</p>', vi: '<p>Mỗi dòng là dòng thời gian ngắn của hai phiên A và B. Gọi tên hiện tượng.</p>',
    bang: [bang1('b1', ['Timeline → anomaly', 'Dòng thời gian → hiện tượng'],
      [{ ma: 'tl', ten: 'Timeline' }, { ma: 'ht', ten: 'Anomaly', luaChon: AN }],
      [{ o: { tl: "A counts orders with status 'new' → 12. B inserts a new order and commits. A counts again → 13." }, a: { ht: 'phantom' } },
        { o: { tl: 'A reads stock 5. B reads stock 5. B sells 2, writes 3, commits. A sells 1, writes 4, commits.' }, a: { ht: 'lost update' } },
        { o: { tl: "A sets a price to 0 by mistake, does not commit. B's report shows 0. A rolls back." }, a: { ht: 'dirty read' } },
        { o: { tl: 'Rule: one booking per room per slot. A checks 9:00 is free, B checks too; A inserts booking A, B inserts booking B; both commit.' }, a: { ht: 'write skew' } },
        { o: { tl: "A reads a customer's address. B changes it and commits. A reads it again in the same transaction: new value." }, a: { ht: 'non-repeatable read' } }],
      ['Phantom = a new ROW in a range; non-repeatable = the same row CHANGED; lost update = read-modify-write overwritten; write skew = both checks pass on a snapshot, each writes something different, and together they break a rule.', 'Phantom = DÒNG mới trong một khoảng; non-repeatable = cùng dòng BỊ ĐỔI; lost update = đọc-sửa-ghi bị ghi đè; write skew = hai phép kiểm cùng qua trên snapshot, mỗi bên ghi một thứ khác, gộp lại phá luật.'])],
    gy: [['New row vs changed row.', 'Dòng mới hay dòng bị đổi.'], ['Did one write overwrite the other (lost update) or did two writes together break a rule (write skew)?', 'Một lần ghi đè lần kia (lost update) hay hai lần ghi cùng phá luật (write skew)?']],
    lhg: [['Calling the double booking a phantom — it is write skew: each saw a free slot and wrote a different row.', 'Gọi đặt trùng là phantom — đó là write skew: mỗi bên thấy chỗ trống và ghi một dòng khác.'], ['Calling the stock example a dirty read — B committed before A wrote.', 'Gọi ví dụ tồn kho là dirty read — B đã commit trước khi A ghi.']],
    tn: [tn('lost update', 'mất cập nhật'), tn('dirty read', 'đọc bẩn')],
  }),
  tsql({
    t: 'Exercise 2 — a safe money-transfer procedure', k: 'HARD', p: 25,
    kn: ['XACT_ABORT', 'TRY/CATCH + THROW', 'UPDLOCK', 'lock ordering'], tag: ['advanced', 'transaction', 'procedure'],
    en: `<p>Table <code>TaiKhoan(id, chuTk, soDu ≥ 0)</code>: (1, An, 100), (2, Bình, 50), (3, Chi, 0). Write <code>dbo.chuyen_tien @tu INT, @den INT, @soTien DECIMAL(12,0)</code> that:</p>
<ul><li>rolls back everything on any error and re-throws it to the caller;</li>
<li>locks the two rows <b>in id order</b> (smaller id first) with <code>UPDLOCK</code>, so two opposite transfers cannot deadlock;</li>
<li>refuses a non-positive amount with error <b>50003</b>, an unknown (or identical) account with <b>50001</b>, and an overdraft with <b>50002</b> — leaving every balance unchanged.</li></ul>`,
    vi: `<p>Bảng <code>TaiKhoan(id, chuTk, soDu ≥ 0)</code>: (1, An, 100), (2, Bình, 50), (3, Chi, 0). Viết <code>dbo.chuyen_tien @tu INT, @den INT, @soTien DECIMAL(12,0)</code> sao cho:</p>
<ul><li>hoàn tác mọi thứ khi có lỗi bất kỳ và ném lại lỗi cho nơi gọi;</li>
<li>khoá hai dòng <b>theo thứ tự id</b> (id nhỏ trước) bằng <code>UPDLOCK</code>, để hai lệnh chuyển ngược chiều không deadlock;</li>
<li>từ chối số tiền không dương bằng lỗi <b>50003</b>, tài khoản không tồn tại (hoặc trùng nhau) bằng <b>50001</b>, và rút quá số dư bằng <b>50002</b> — mọi số dư giữ nguyên.</li></ul>`,
    yc: [['THROW 5000x, N\'message\', 1 for the business errors; THROW; (no arguments) in CATCH.', 'THROW 5000x, N\'thông báo\', 1 cho lỗi nghiệp vụ; THROW; (không đối số) trong CATCH.'], ['Check the unknown account BEFORE updating — an UPDATE that matches 0 rows is not an error and money would vanish.', 'Kiểm tài khoản không tồn tại TRƯỚC khi cập nhật — UPDATE khớp 0 dòng không phải lỗi và tiền sẽ biến mất.']],
    setup: TK,
    khoi: `CREATE OR ALTER PROCEDURE dbo.chuyen_tien @tu INT, @den INT, @soTien DECIMAL(12,0)
AS
BEGIN
    -- your code
    RETURN;
END`,
    giai: GIAI,
    kiem: [
      ck(['A good transfer 1 → 2 of 30: balances 70 and 80', 'Chuyển hợp lệ 1 → 2 số 30: số dư 70 và 80'], `${GOI(1, 2, 30)}
SET @ok = IIF(@e = 0 AND @sau = N'1:70,2:80,3:0', 1, 0);
SET @info = CONCAT(N'error=', @e, N' · balances ', @sau);
UPDATE dbo.TaiKhoan SET soDu = CASE id WHEN 1 THEN 100 WHEN 2 THEN 50 ELSE 0 END;`),
      ck(['An overdraft 3 → 1 of 10: error 50002, nothing changes', 'Rút quá 3 → 1 số 10: lỗi 50002, không gì đổi'], `${GOI(3, 1, 10)}
SET @ok = IIF(@e = 50002 AND @sau = @truoc, 1, 0);
SET @info = CONCAT(N'error=', @e, N' · balances ', @sau);
UPDATE dbo.TaiKhoan SET soDu = CASE id WHEN 1 THEN 100 WHEN 2 THEN 50 ELSE 0 END;`),
      ck(['An unknown account 1 → 99: error 50001, the 30 does not vanish', 'Tài khoản lạ 1 → 99: lỗi 50001, 30 không biến mất'], `${GOI(1, 99, 30)}
SET @ok = IIF(@e = 50001 AND @sau = @truoc, 1, 0);
SET @info = CONCAT(N'error=', @e, N' · balances ', @sau);
UPDATE dbo.TaiKhoan SET soDu = CASE id WHEN 1 THEN 100 WHEN 2 THEN 50 ELSE 0 END;`),
      ck(['A zero or negative amount: error 50003', 'Số tiền 0 hoặc âm: lỗi 50003'], `${GOI(2, 1, -20)}
SET @ok = IIF(@e = 50003 AND @sau = @truoc, 1, 0);
SET @info = CONCAT(N'error=', @e, N' · balances ', @sau);
UPDATE dbo.TaiKhoan SET soDu = CASE id WHEN 1 THEN 100 WHEN 2 THEN 50 ELSE 0 END;`),
      ck(['A transfer to the same account: error 50001', 'Chuyển cho chính mình: lỗi 50001'], `${GOI(2, 2, 10)}
SET @ok = IIF(@e = 50001 AND @sau = @truoc, 1, 0);
SET @info = CONCAT(N'error=', @e);`),
      ck(['The rows are locked with UPDLOCK, and no transaction is left open', 'Dòng được khoá bằng UPDLOCK, không để giao dịch treo'], `DECLARE @d NVARCHAR(MAX) = OBJECT_DEFINITION(OBJECT_ID(N'dbo.chuyen_tien'));
BEGIN TRY EXEC dbo.chuyen_tien 3, 1, 10; END TRY BEGIN CATCH END CATCH;
DECLARE @mo INT = @@TRANCOUNT; WHILE @@TRANCOUNT > 0 ROLLBACK;
SET @ok = IIF(@d LIKE N'%UPDLOCK%' AND @mo = 0, 1, 0);
SET @info = CONCAT(N'UPDLOCK: ', IIF(@d LIKE N'%UPDLOCK%', N'yes', N'no'), N' · open transactions after an error: ', @mo);`),
    ],
    saiTay: [
      GIAI.replace(`            IF @tu = @den OR (SELECT COUNT(*) FROM dbo.TaiKhoan WHERE id IN (@tu, @den)) < 2
                THROW 50001, N'Unknown account', 1;
`, ''),
      GIAI.replace(`            SELECT @x = soDu FROM dbo.TaiKhoan WITH (UPDLOCK) WHERE id = @nho;   -- lock the smaller id first…
            SELECT @x = soDu FROM dbo.TaiKhoan WITH (UPDLOCK) WHERE id = @lon;   -- …then the larger: no deadlock cycle
`, ''),
      GIAI.replace("THROW 50002, N'Insufficient funds', 1;", "RETURN;"),
      GIAI.replace(`        IF XACT_STATE() <> 0 ROLLBACK TRANSACTION;
        THROW;`, `        IF XACT_STATE() <> 0 ROLLBACK TRANSACTION;`),
    ],
    gy: [['Lock in a fixed global order (smaller id first): a cycle — and so a deadlock — becomes impossible.', 'Khoá theo một thứ tự toàn cục cố định (id nhỏ trước): không thể có chu trình — nên không có deadlock.'], ['UPDLOCK on the reads: two transfers from the same account queue up instead of both reading the old balance.', 'UPDLOCK khi đọc: hai lệnh chuyển từ cùng tài khoản xếp hàng thay vì cùng đọc số dư cũ.']],
    lhg: [['Not checking the target account: UPDATE … WHERE id = 99 affects 0 rows, the debit commits, money vanishes.', 'Không kiểm tài khoản đích: UPDATE … WHERE id = 99 ảnh hưởng 0 dòng, khoản trừ được commit, tiền biến mất.'], ['Swallowing the error in CATCH (no THROW): the caller believes the transfer worked.', 'Nuốt lỗi trong CATCH (không THROW): nơi gọi tưởng đã chuyển xong.']],
    gt: ['<p>The CHECK (soDu ≥ 0) would also stop an overdraft, but with error 547 and a message meant for DBAs. Raising 50002 yourself gives the application a clear, stable code. The deadlock-free lock order cannot be proven by a one-session check, so check.sql verifies the UPDLOCK reads; try it yourself with two SSMS windows (1 → 2 and 2 → 1 at the same time).</p>', '<p>CHECK (soDu ≥ 0) cũng chặn được rút quá, nhưng bằng lỗi 547 và thông báo dành cho DBA. Tự ném 50002 cho ứng dụng một mã rõ và ổn định. Thứ tự khoá chống deadlock không chứng minh được bằng kiểm một phiên, nên check.sql kiểm các lần đọc UPDLOCK; hãy tự thử với hai cửa sổ SSMS (1 → 2 và 2 → 1 cùng lúc).</p>'],
    tn: [tn('lock ordering', 'thứ tự khoá'), tn('re-throw', 'ném lại lỗi')],
  }),
  cs({
    t: 'Exercise 3 — pick the technique', k: 'MEDIUM', p: 7, loai: 'table',
    kn: ['atomic UPDATE', 'UPDLOCK / FOR UPDATE', 'version column', 'SERIALIZABLE + retry', 'SKIP LOCKED', 'RCSI'], tag: ['advanced', 'transaction'],
    en: '<p>For each situation, choose the one technique that fits best.</p>', vi: '<p>Với mỗi tình huống, chọn kỹ thuật hợp nhất.</p>',
    bang: [bang1('b1', ['Situation → technique', 'Tình huống → kỹ thuật'],
      [{ ma: 'th', ten: 'Situation / Tình huống' }, { ma: 'kt', ten: 'Technique', luaChon: ['atomic UPDATE … WHERE stock >= @n', 'SELECT … FOR UPDATE / WITH (UPDLOCK)', 'version column checked on save', 'SERIALIZABLE + retry on 40001', 'FOR UPDATE SKIP LOCKED / READPAST', 'READ COMMITTED SNAPSHOT (RCSI)'] }],
      [{ o: { th: 'Decrease stock by the quantity ordered, never below 0' }, a: { kt: 'atomic UPDATE … WHERE stock >= @n' } },
        { o: { th: 'Read a seat map, let the code decide which seat, then book it, all in one short transaction' }, a: { kt: 'SELECT … FOR UPDATE / WITH (UPDLOCK)' } },
        { o: { th: 'An admin edits a product form for 5 minutes before saving' }, a: { kt: 'version column checked on save' } },
        { o: { th: 'The on-call rule spans many rows ("at least one doctor on call")' }, a: { kt: 'SERIALIZABLE + retry on 40001' } },
        { o: { th: '10 workers take jobs from one queue table without waiting on each other' }, a: { kt: 'FOR UPDATE SKIP LOCKED / READPAST' } },
        { o: { th: 'Reports are blocked by writers on SQL Server all day' }, a: { kt: 'READ COMMITTED SNAPSHOT (RCSI)' } }],
      ['Prefer the simplest tool that closes the gap: one atomic statement beats a read-then-write; long think time ⇒ optimistic; rules over many rows ⇒ SERIALIZABLE with retry.', 'Ưu tiên công cụ đơn giản nhất bịt được lỗ hổng: một câu lệnh nguyên tử hơn đọc-rồi-ghi; thời gian suy nghĩ dài ⇒ lạc quan; luật trên nhiều dòng ⇒ SERIALIZABLE kèm thử lại.'])],
    gy: [['Minutes of user think time ⇒ never hold a lock: optimistic.', 'Người dùng nghĩ hàng phút ⇒ đừng giữ khoá: lạc quan.'], ['A queue with many workers ⇒ skip what others locked.', 'Hàng đợi nhiều worker ⇒ bỏ qua thứ người khác đã khoá.']],
    lhg: [['Holding FOR UPDATE while a user edits a form.', 'Giữ FOR UPDATE trong lúc người dùng sửa form.'], ['Using NOLOCK to "fix" blocked reports — that reads dirty data; RCSI is the safe switch.', 'Dùng NOLOCK để "chữa" báo cáo bị chặn — đó là đọc bẩn; RCSI mới là công tắc an toàn.']],
    tn: [tn('job queue', 'hàng đợi công việc'), tn('SKIP LOCKED', 'bỏ qua dòng đang bị khoá')],
  }),
  cs({
    t: 'Exercise 4 — predict: REPEATABLE READ doctors, lock order, who blocks whom', k: 'HARD', p: 8,
    kn: ['REPEATABLE READ', 'deadlock', 'blocking diagnosis'], tag: ['advanced', 'transaction', 'locking'],
    en: '<p>Three predictions from the lesson, each checked on a real server.</p>', vi: '<p>Ba dự đoán của bài, đều kiểm trên server thật.</p>',
    cau: [
      q('c1', ['SQL Server, REPEATABLE READ: An and Bình each COUNT the doctors on call (S locks kept), then each UPDATE their own row to off call. Result?', 'SQL Server, REPEATABLE READ: An và Bình đều COUNT bác sĩ trực (giữ khoá S), rồi mỗi người UPDATE dòng của mình thành nghỉ. Kết quả?'], ['deadlock: one is the victim (1205), the other succeeds', 'both succeed and nobody is on call', 'the second waits forever without an error', 'both fail with an update conflict (3960)'], ['Each holds S on the other\'s row and needs X on its own row that the other has S on: a cycle. The victim retries and now sees only one doctor on call.', 'Mỗi bên giữ S trên dòng của bên kia và cần X trên dòng mình mà bên kia giữ S: chu trình. Nạn nhân thử lại và lúc đó chỉ thấy một bác sĩ trực.']),
      q('c2', ['A transfers 1 → 2 (locks 1, then 2); B transfers 2 → 1. B is rewritten to lock the smaller id first. Now…', 'A chuyển 1 → 2 (khoá 1 rồi 2); B chuyển 2 → 1. Viết lại B để khoá id nhỏ trước. Giờ…'], ['B waits for A to finish, then runs: no deadlock', 'both still deadlock, only less often', 'B fails immediately with a lock timeout', 'A and B run fully in parallel'], ['Both want row 1 first; whoever gets it finishes, the other queues behind. A cycle needs two different orders.', 'Cả hai cùng xin dòng 1 trước; ai được thì làm xong, người kia xếp hàng. Chu trình cần hai thứ tự khác nhau.']),
      q('c3', ['Diagnostics: session B waits on LCK_M_S for a KEY, blocked by A; A holds KEY X, open_transaction_count = 1, and runs nothing. What do you do?', 'Chẩn đoán: phiên B chờ LCK_M_S trên một KEY, bị A chặn; A giữ KEY X, open_transaction_count = 1, không chạy gì. Bạn làm gì?'], ['find why A never committed, then end that open transaction', 'restart SQL Server so that every lock is cleared at once', 'add WITH (NOLOCK) to the SELECT that session B runs', 'rebuild the index so that B can read through it again'], ['A sleeping session with an open transaction is a code bug (missing COMMIT/ROLLBACK on some path). KILL it as first aid, then fix the code.', 'Phiên ngủ mà còn giao dịch mở là lỗi mã (thiếu COMMIT/ROLLBACK ở một nhánh). KILL để sơ cứu rồi sửa mã.']),
    ],
    gy: [['Deadlock = a cycle of waits; one fixed lock order breaks every cycle.', 'Deadlock = chu trình chờ; một thứ tự khoá cố định phá mọi chu trình.'], ['Blocking ≠ deadlock: a blocker that never finishes is usually an open transaction.', 'Chặn ≠ deadlock: kẻ chặn không bao giờ xong thường là một giao dịch còn mở.']],
    lhg: [['Expecting REPEATABLE READ to behave like SNAPSHOT (both succeed) on SQL Server.', 'Tưởng REPEATABLE READ chạy như SNAPSHOT (cả hai thành công) trên SQL Server.'], ['"Fixing" blocking with NOLOCK.', '"Chữa" chặn bằng NOLOCK.']],
    tn: [tn('blocking', 'chặn chờ khoá'), tn('deadlock', 'khoá chết')],
  }),
]);
