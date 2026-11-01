/**
 * DBI202 · 8.3 Giao dịch, ACID & mức cô lập — ma trận dị thường × mức cô lập, đặt chỗ cuối cùng bằng MỘT câu UPDATE nguyên tử
 * (chấm trong trình duyệt), deadlock, và một đề chạy trên máy: procedure đặt chỗ có kiểm @@ROWCOUNT.
 */
import { mod, de, cs, q, ord, bang1, sau, ma, tsql, ck, tn } from './_chung.mjs';

const COURSE = `CREATE TABLE Course (cid CHAR(6) NOT NULL PRIMARY KEY, title NVARCHAR(60) NOT NULL, seats INT NOT NULL);
INSERT INTO Course VALUES ('DBI202', N'Database Systems', 1), ('CSD201', N'Data Structures', 0), ('PRF192', N'Programming', 30);`;
const BOOK_SP = `CREATE OR ALTER PROCEDURE prBookSeat
    @cid    CHAR(6),
    @booked BIT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Course SET seats = seats - 1
    WHERE cid = @cid AND seats > 0;          -- check and change in ONE atomic statement
    SET @booked = IIF(@@ROWCOUNT = 1, 1, 0); -- read @@ROWCOUNT immediately
END`;

export default mod('dbi202-transaction-acid', '8.3 Transactions, ACID & isolation levels', [
  cs({
    t: 'Which anomalies does each isolation level allow?', k: 'MEDIUM', p: 8, loai: 'table',
    kn: ['dirty read', 'non-repeatable read', 'phantom', 'isolation levels'], tag: ['transaction', 'isolation'],
    en: '<p>Fill the table of lesson 8.3: for each level, is the anomaly <b>possible</b> or <b>prevented</b>?</p>',
    vi: '<p>Điền bảng của bài 8.3: với mỗi mức, dị thường là <b>possible</b> (có thể xảy ra) hay <b>prevented</b> (được ngăn)?</p>',
    bang: [bang1('b1', ['Isolation level × anomaly', 'Mức cô lập × dị thường'],
      [{ ma: 'lv', ten: 'Level / Mức' }, { ma: 'dr', ten: 'Dirty read', luaChon: ['possible', 'prevented'] }, { ma: 'nr', ten: 'Non-repeatable read', luaChon: ['possible', 'prevented'] }, { ma: 'ph', ten: 'Phantom', luaChon: ['possible', 'prevented'] }],
      [{ o: { lv: 'READ UNCOMMITTED' }, a: { dr: 'possible', nr: 'possible', ph: 'possible' } },
        { o: { lv: 'READ COMMITTED (SQL Server default)' }, a: { dr: 'prevented', nr: 'possible', ph: 'possible' } },
        { o: { lv: 'REPEATABLE READ' }, a: { dr: 'prevented', nr: 'prevented', ph: 'possible' } },
        { o: { lv: 'SERIALIZABLE' }, a: { dr: 'prevented', nr: 'prevented', ph: 'prevented' } }],
      ['Each level forbids one more anomaly than the previous one, at the price of more locking (less concurrency).', 'Mỗi mức cấm thêm một dị thường so với mức trước, đổi lại khoá nhiều hơn (ít đồng thời hơn).'])],
    gy: [['Dirty → non-repeatable → phantom: each level closes one more door.', 'Đọc bẩn → không lặp lại → bóng ma: mỗi mức đóng thêm một cửa.'], ['Phantoms are NEW rows matching a WHERE; only SERIALIZABLE (range locks) stops them.', 'Bóng ma là dòng MỚI khớp WHERE; chỉ SERIALIZABLE (khoá khoảng) chặn được.']],
    lhg: [['Thinking READ COMMITTED prevents non-repeatable reads.', 'Tưởng READ COMMITTED ngăn được đọc không lặp lại.'], ['Thinking REPEATABLE READ prevents phantoms.', 'Tưởng REPEATABLE READ ngăn được bóng ma.']],
    tn: [tn('phantom read', 'đọc bóng ma'), tn('non-repeatable read', 'đọc không lặp lại')],
  }),
  de({
    csdl: COURSE, tenCsdl: 'Course', ld: { en: '<p><b>Table</b> (tab <code>Course.sql</code>): <code>Course(cid, title, seats)</code> — DBI202 has 1 free seat, CSD201 is full (0), PRF192 has 30.</p>', vi: '<p><b>Bảng</b> (tab <code>Course.sql</code>): <code>Course(cid, title, seats)</code> — DBI202 còn 1 chỗ, CSD201 đã đầy (0), PRF192 còn 30.</p>' },
    t: 'Book the last seat safely with one atomic UPDATE', k: 'MEDIUM', p: 8,
    kn: ['lost update', 'check-and-change in one statement'], tag: ['transaction', 'concurrency', 'update'],
    en: "<p>Two students book the last DBI202 seat at the same moment. \"SELECT seats … then UPDATE\" lets both read 1 and both decrement (seats = −1). Write the booking for course <b>DBI202</b> as ONE UPDATE that takes a seat <b>only if one is left</b> — on a full course it must change nothing.</p>",
    vi: "<p>Hai sinh viên cùng đặt chỗ cuối của DBI202. \"SELECT seats … rồi UPDATE\" cho cả hai đọc 1 và cùng trừ (seats = −1). Viết lệnh đặt chỗ cho môn <b>DBI202</b> thành MỘT câu UPDATE chỉ lấy chỗ <b>khi còn chỗ</b> — môn đã đầy thì không đổi gì.</p>",
    yc: [['One UPDATE with the condition in its WHERE.', 'Một câu UPDATE có điều kiện nằm trong WHERE.'], ['(In T-SQL, check @@ROWCOUNT = 1 afterwards to know whether you got the seat.)', '(Trong T-SQL, kiểm @@ROWCOUNT = 1 sau đó để biết có giành được chỗ không.)']],
    giai: `UPDATE Course
SET seats = seats - 1
WHERE cid = 'DBI202' AND seats > 0;     -- the test and the change are one atomic statement`,
    kiem: [
      sau(['DBI202 goes from 1 to 0', 'DBI202 từ 1 xuống 0'], "SELECT cid, seats FROM Course"),
      sau(['Hidden: running the booking twice never goes below 0', 'Ẩn: đặt hai lần không bao giờ xuống dưới 0'], "UPDATE Course SET seats = seats - 1 WHERE cid = 'DBI202' AND seats > 0; SELECT cid, seats FROM Course", { an: true }),
      sau(['Hidden: on a full DBI202 nothing changes', 'Ẩn: DBI202 đã đầy thì không đổi gì'], "SELECT cid, seats FROM Course", { an: true, themCsdl: "UPDATE Course SET seats = 0 WHERE cid = 'DBI202'" }),
      sau(['Hidden: with 5 seats left, one booking leaves 4', 'Ẩn: còn 5 chỗ thì đặt một lần còn 4'], "SELECT cid, seats FROM Course", { an: true, themCsdl: "UPDATE Course SET seats = 5 WHERE cid = 'DBI202'" }),
      ma(['Uses UPDATE', 'Dùng UPDATE'], '\\bUPDATE\\b'),
    ],
    sai: ["UPDATE Course SET seats = seats - 1 WHERE cid = 'DBI202'", "UPDATE Course SET seats = 0 WHERE cid = 'DBI202'"],
    gy: [['Put "seats &gt; 0" in the WHERE of the UPDATE itself.', 'Đặt "seats &gt; 0" ngay trong WHERE của câu UPDATE.'], ['The UPDATE locks the row while it tests and changes it, so two sessions cannot both pass the test.', 'UPDATE khoá dòng trong lúc vừa kiểm vừa đổi nên hai phiên không thể cùng qua phép kiểm.']],
    lhg: [['No seats &gt; 0 test — a full course goes to −1.', 'Không kiểm seats &gt; 0 — môn đầy xuống −1.'], ['SET seats = 0 — correct only for the very last seat.', 'SET seats = 0 — chỉ đúng với chỗ cuối cùng.']],
    gt: ['<p>Of the three fixes of lesson 8.3 (one atomic statement, UPDLOCK, SERIALIZABLE) this is the cheapest and the one to remember.</p>', '<p>Trong ba cách sửa của bài 8.3 (một câu nguyên tử, UPDLOCK, SERIALIZABLE) đây là cách rẻ nhất và nên nhớ nhất.</p>'],
    tn: [tn('lost update', 'mất cập nhật')],
  }),
  tsql({
    t: 'prBookSeat: the atomic UPDATE + @@ROWCOUNT as a procedure', k: 'EASY', p: 10,
    kn: ['@@ROWCOUNT', 'atomic check-and-change'], tag: ['tsql', 'procedure', 'concurrency'],
    lyDo: ['@@ROWCOUNT and OUTPUT parameters are T-SQL; the procedure is what an application would call.', '@@ROWCOUNT và tham số OUTPUT là T-SQL; procedure là thứ ứng dụng sẽ gọi.'],
    en: '<p>Wrap the booking in <code>prBookSeat @cid CHAR(6), @booked BIT OUTPUT</code>: one UPDATE that takes a seat only if one is left, then <code>@booked = 1</code> when a row was changed, 0 otherwise.</p>',
    vi: '<p>Bọc việc đặt chỗ thành <code>prBookSeat @cid CHAR(6), @booked BIT OUTPUT</code>: một câu UPDATE chỉ lấy chỗ khi còn, rồi <code>@booked = 1</code> nếu có dòng bị đổi, ngược lại 0.</p>',
    yc: [['Read @@ROWCOUNT immediately after the UPDATE.', 'Đọc @@ROWCOUNT ngay sau câu UPDATE.']],
    setup: COURSE,
    khoi: `-- CREATE OR ALTER PROCEDURE prBookSeat @cid CHAR(6), @booked BIT OUTPUT AS
-- BEGIN ... END
`,
    giai: BOOK_SP,
    kiem: [
      ck(['The first booking of DBI202 succeeds, the second fails', 'Lần đặt đầu của DBI202 thành công, lần hai thất bại'], `DECLARE @a BIT, @b BIT; BEGIN TRAN; EXEC dbo.prBookSeat 'DBI202', @a OUTPUT; EXEC dbo.prBookSeat 'DBI202', @b OUTPUT;
SET @ok = IIF(@a = 1 AND @b = 0 AND (SELECT seats FROM Course WHERE cid = 'DBI202') = 0, 1, 0); SET @info = CONCAT(N'first=', @a, N' second=', @b, N' seats=', (SELECT seats FROM Course WHERE cid = 'DBI202')); ROLLBACK;`),
      ck(['A full course: @booked = 0, seats stay 0', 'Môn đầy: @booked = 0, chỗ vẫn 0'], `DECLARE @a BIT; BEGIN TRAN; EXEC dbo.prBookSeat 'CSD201', @a OUTPUT;
SET @ok = IIF(@a = 0 AND (SELECT seats FROM Course WHERE cid = 'CSD201') = 0, 1, 0); SET @info = CONCAT(N'booked=', @a); ROLLBACK;`),
      ck(['An unknown course: @booked = 0', 'Môn không tồn tại: @booked = 0'], `DECLARE @a BIT; EXEC dbo.prBookSeat 'XXX999', @a OUTPUT; SET @ok = IIF(@a = 0, 1, 0); SET @info = CONCAT(N'booked=', @a);`),
    ],
    saiTay: [`CREATE OR ALTER PROCEDURE prBookSeat @cid CHAR(6), @booked BIT OUTPUT AS
BEGIN
    DECLARE @s INT = (SELECT seats FROM Course WHERE cid = @cid);     -- read …
    UPDATE Course SET seats = seats - 1 WHERE cid = @cid;              -- … then write: not atomic, no guard
    SET @booked = IIF(@s > 0, 1, 0);
END`, BOOK_SP.replace("    SET @booked = IIF(@@ROWCOUNT = 1, 1, 0); -- read @@ROWCOUNT immediately", "    SET @booked = 1;")],
    gy: [['UPDATE … WHERE cid = @cid AND seats &gt; 0', 'UPDATE … WHERE cid = @cid AND seats &gt; 0'], ['SET @booked = IIF(@@ROWCOUNT = 1, 1, 0) right after it.', 'SET @booked = IIF(@@ROWCOUNT = 1, 1, 0) ngay sau đó.']],
    lhg: [['Read-then-write in two statements — under concurrency both readers see 1.', 'Đọc rồi ghi bằng hai câu — khi đồng thời cả hai đều thấy 1.'], ['Always answering @booked = 1.', 'Luôn trả @booked = 1.']],
    gt: ['<p>No explicit transaction and no isolation level change needed: a single statement is already atomic and holds its locks while it runs.</p>', '<p>Không cần giao dịch tường minh hay đổi mức cô lập: một câu lệnh vốn đã nguyên tử và giữ khoá trong lúc chạy.</p>'],
    tn: [tn('@@ROWCOUNT', 'số dòng câu trước đã đụng')],
  }),
  cs({
    t: 'Deadlock: how it happens, how to live with it', k: 'MEDIUM', p: 6, loai: 'order',
    kn: ['deadlock', 'deadlock victim', 'retry'], tag: ['transaction', 'deadlock'],
    en: '<p>Two transfers run at the same time: T1 moves money A → B, T2 moves money B → A.</p>',
    vi: '<p>Hai lần chuyển tiền chạy cùng lúc: T1 chuyển A → B, T2 chuyển B → A.</p>',
    cau: [
      ord('o1', ['Order the events of the deadlock', 'Sắp các sự kiện của deadlock'], ['Each transaction locks the first row it updates (T1 holds A, T2 holds B)', 'Each asks for the row the other one holds', 'Both wait for each other: a cycle', 'The lock monitor detects the cycle', 'One transaction is chosen as victim and rolled back (error 1205)', 'The application catches 1205 and retries the victim\'s transaction'], ['A cycle of waits can only be broken by killing one transaction; the fix is to access rows in the same order (always the smaller account first) and to retry on 1205.', 'Vòng chờ chỉ phá được bằng cách giết một giao dịch; cách sửa là truy cập dòng theo cùng thứ tự (luôn tài khoản nhỏ hơn trước) và thử lại khi gặp 1205.']),
    ],
    gy: [['Each transaction holds one lock and waits for the other\'s.', 'Mỗi giao dịch giữ một khoá và chờ khoá của bên kia.'], ['Detection comes after both are waiting.', 'Phát hiện xảy ra sau khi cả hai đều chờ.']],
    lhg: [['Thinking a deadlock is a bug that can be "fixed forever" — it is a normal condition to handle with retries.', 'Tưởng deadlock là lỗi "sửa một lần là hết" — nó là tình huống bình thường cần xử lý bằng thử lại.'], ['Keeping transactions open while waiting for user input.', 'Giữ giao dịch mở trong lúc chờ người dùng nhập.']],
    tn: [tn('deadlock', 'khoá chết'), tn('deadlock victim', 'nạn nhân deadlock')],
  }),
]);
