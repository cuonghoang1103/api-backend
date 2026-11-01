/**
 * DBI202 · ⭐ CS.4 phần 2 — MVCC (xmin/xmax, VACUUM, RCSI vs SNAPSHOT), deadlock, khoá bi quan vs lạc quan (FOR UPDATE / UPDLOCK,
 * SKIP LOCKED, cột phiên bản), lỗi và thử lại (slide 13–25). Đề cột phiên bản chấm trong trình duyệt.
 */
import { mod, de, cs, q, bang1, sau, ma, tn } from './_chung.mjs';

const SP = `CREATE TABLE Product (
  id      INT           NOT NULL PRIMARY KEY,
  name    NVARCHAR(50)  NOT NULL,
  price   DECIMAL(12,0) NOT NULL,
  version INT           NOT NULL
);
INSERT INTO Product (id, name, price, version) VALUES (7, N'Laptop', 15000000, 3), (8, N'Mouse', 200000, 1);`;

export default mod('dbi202-slide-cs4-2', '⭐ CS.4 Concurrency (2): MVCC, deadlocks, optimistic locking', [
  cs({
    t: 'MVCC on both engines: versions, VACUUM, RCSI and SNAPSHOT', k: 'MEDIUM', p: 8,
    kn: ['MVCC', 'xmin/xmax', 'VACUUM', 'RCSI', 'SNAPSHOT'], tag: ['advanced', 'transaction', 'mvcc'],
    en: '<p>Five questions on slides 13–16.</p>', vi: '<p>Năm câu về slide 13–16.</p>',
    cau: [
      q('c1', ['On PostgreSQL, UPDATE of one row…', 'Trên PostgreSQL, UPDATE một dòng…'], ['writes a new row version and stamps xmax on the old one', 'overwrites the row in place and logs the old value', 'moves the old version to tempdb for readers', 'locks the whole page until COMMIT'], ['The old tuple stays in the heap until VACUUM removes it — that is where table bloat comes from.', 'Tuple cũ nằm lại trong heap tới khi VACUUM dọn — đó là nguồn gốc phình bảng.']),
      q('c2', ['A transaction left open for 6 hours on PostgreSQL causes…', 'Một giao dịch mở 6 giờ trên PostgreSQL gây ra…'], ['VACUUM cannot remove any version newer than its snapshot, so tables bloat', 'all other sessions to wait for its locks', 'the WAL to be deleted when it commits', 'nothing, because MVCC readers never matter'], ['Dead versions might still be visible to that old snapshot, so they must be kept.', 'Phiên bản chết có thể vẫn nhìn thấy với snapshot cũ đó nên phải giữ lại.']),
      q('c3', ['SQL Server READ_COMMITTED_SNAPSHOT ON (RCSI) gives each…', 'SQL Server READ_COMMITTED_SNAPSHOT ON (RCSI) cho mỗi…'], ['statement a consistent view, with versions kept in tempdb', 'transaction one frozen view for its whole duration', 'reader a dirty view of uncommitted changes', 'writer the right to skip locked rows'], ['RCSI = statement-level snapshot (like PostgreSQL READ COMMITTED); SNAPSHOT isolation = transaction-level.', 'RCSI = snapshot theo câu lệnh (như READ COMMITTED của PostgreSQL); SNAPSHOT = theo giao dịch.']),
      q('c4', ['Two SNAPSHOT transactions update the SAME row; the second one to write gets…', 'Hai giao dịch SNAPSHOT cập nhật CÙNG một dòng; giao dịch ghi sau nhận…'], ['error 3960 (update conflict) and must retry', 'the row silently overwritten by its value', 'a wait until the first one commits, then success', 'a deadlock victim message (1205)'], ['SNAPSHOT prevents lost updates by failing the loser — the application must retry.', 'SNAPSHOT ngăn mất cập nhật bằng cách làm kẻ thua thất bại — ứng dụng phải thử lại.']),
      q('c5', ['Two doctors each check "someone else is on call", then both go off call (different rows). Under SNAPSHOT…', 'Hai bác sĩ đều kiểm "còn người trực", rồi cả hai cùng nghỉ (hai dòng khác nhau). Dưới SNAPSHOT…'], ['both succeed and nobody is on call: write skew', 'the second fails with an update conflict', 'the second waits, then sees the first change', 'one is chosen as a deadlock victim'], ['They wrote different rows, so no conflict is detected. Only SERIALIZABLE (or a lock on the shared fact) stops it.', 'Họ ghi hai dòng khác nhau nên không phát hiện xung đột. Chỉ SERIALIZABLE (hoặc khoá trên sự kiện chung) chặn được.']),
    ],
    gy: [['Old versions live in the table (PostgreSQL) or in tempdb (SQL Server).', 'Phiên bản cũ nằm trong bảng (PostgreSQL) hoặc tempdb (SQL Server).'], ['Same row ⇒ conflict detected; different rows ⇒ write skew possible.', 'Cùng dòng ⇒ phát hiện xung đột; khác dòng ⇒ có thể write skew.']],
    lhg: [['Confusing RCSI (per statement) with SNAPSHOT (per transaction).', 'Nhầm RCSI (theo câu lệnh) với SNAPSHOT (theo giao dịch).'], ['Leaving transactions open in an app "because reads do not lock".', 'Để giao dịch mở trong app "vì đọc không khoá".']],
    tn: [tn('MVCC', 'điều khiển tương tranh đa phiên bản'), tn('table bloat', 'phình bảng'), tn('update conflict', 'xung đột cập nhật')],
  }),
  de({
    csdl: SP, tenCsdl: 'Product', ld: { en: '<p><code>Product(id, name, price, version)</code> — 2 rows; laptop 7 is at version 3.</p>', vi: '<p><code>Product(id, name, price, version)</code> — 2 dòng; laptop 7 đang ở phiên bản 3.</p>' },
    t: 'Optimistic locking with a version column: save only if nobody changed it', k: 'MEDIUM', p: 10,
    kn: ['optimistic concurrency', 'version column', 'lost update'], tag: ['advanced', 'transaction', 'optimistic'],
    en: '<p>Slides 20–21. An admin opened laptop 7 when it was at <b>version 3</b>, edited the price to <b>14,500,000</b> and pressed Save several minutes later. Holding a lock for those minutes is not an option. Write ONE statement that saves the new price <b>only if the row is still at version 3</b>, and moves the version to 4 so that any other stale editor fails in turn.</p>',
    vi: '<p>Slide 20–21. Một admin mở laptop 7 lúc nó ở <b>phiên bản 3</b>, sửa giá thành <b>14.500.000</b> và bấm Lưu vài phút sau. Giữ khoá suốt mấy phút đó là không được. Viết MỘT câu lệnh lưu giá mới <b>chỉ khi dòng vẫn ở phiên bản 3</b>, và đưa phiên bản lên 4 để người sửa bằng dữ liệu cũ khác lần lượt thất bại.</p>',
    yc: [['One UPDATE whose WHERE checks both the id and the version you read.', 'Một UPDATE với WHERE kiểm cả id lẫn phiên bản bạn đã đọc.'], ['The application then looks at the affected-row count: 0 means "someone else saved first — reload".', 'Sau đó ứng dụng xem số dòng bị ảnh hưởng: 0 nghĩa là "người khác đã lưu trước — tải lại".']],
    giai: `UPDATE Product
SET price   = 14500000,
    version = version + 1            -- the next stale editor will not match any more
WHERE id = 7
  AND version = 3;                   -- the version this editor read`,
    kiem: [
      sau(['Laptop 7 now costs 14,500,000 at version 4; the mouse is untouched', 'Laptop 7 giờ giá 14.500.000 ở phiên bản 4; chuột không đổi'], 'SELECT id, price, version FROM Product ORDER BY id'),
      sau(['Hidden: someone else saved first (version 4) — your save changes nothing', 'Ẩn: người khác đã lưu trước (phiên bản 4) — lần lưu của bạn không đổi gì'], 'SELECT id, price, version FROM Product ORDER BY id', { an: true, themCsdl: 'UPDATE Product SET price = 15500000, version = 4 WHERE id = 7' }),
      sau(['Hidden: the mouse also happens to be at version 3 — it must not change', 'Ẩn: chuột cũng tình cờ ở phiên bản 3 — không được đổi'], 'SELECT id, price, version FROM Product ORDER BY id', { an: true, themCsdl: 'UPDATE Product SET version = 3 WHERE id = 8' }),
      sau(['Hidden: pressing Save twice applies once', 'Ẩn: bấm Lưu hai lần chỉ áp dụng một lần'], 'UPDATE Product SET price = 14500000, version = version + 1 WHERE id = 7 AND version = 3; SELECT id, price, version FROM Product ORDER BY id', { an: true }),
      ma(['The WHERE checks the version', 'WHERE có kiểm phiên bản'], '\\bWHERE\\b[\\s\\S]*\\bversion\\s*=\\s*3\\b'),
    ],
    sai: [
      'UPDATE Product SET price = 14500000, version = version + 1 WHERE id = 7;',
      'UPDATE Product SET price = 14500000 WHERE id = 7 AND version = 3;',
      'UPDATE Product SET price = 14500000, version = 4 WHERE version = 3;',
    ],
    gy: [['Put the version you read into the WHERE.', 'Đặt phiên bản đã đọc vào WHERE.'], ['Bump the version in the same statement.', 'Tăng phiên bản trong cùng câu lệnh.']],
    lhg: [['WHERE id = 7 only — the last writer silently wins: a lost update.', 'Chỉ WHERE id = 7 — người ghi sau thắng âm thầm: mất cập nhật.'], ['Forgetting to bump the version — two stale editors can both "succeed".', 'Quên tăng phiên bản — hai người sửa dữ liệu cũ đều "thành công".']],
    gt: ['<p>Optimistic locking fits long "think time" (forms, mobile apps). SQL Server can maintain the version for you with a <code>rowversion</code> column; ORMs (Prisma, EF, Hibernate @Version) generate exactly this WHERE.</p>', '<p>Khoá lạc quan hợp với "thời gian suy nghĩ" dài (form, app di động). SQL Server có thể tự duy trì phiên bản bằng cột <code>rowversion</code>; ORM (Prisma, EF, Hibernate @Version) sinh đúng câu WHERE này.</p>'],
    tn: [tn('optimistic locking', 'khoá lạc quan'), tn('pessimistic locking', 'khoá bi quan'), tn('rowversion', 'cột phiên bản dòng')],
  }),
  cs({
    t: 'Error codes: retry or not?', k: 'MEDIUM', p: 6, loai: 'table',
    kn: ['deadlock', 'serialization failure', 'retry logic'], tag: ['advanced', 'transaction', 'errors'],
    en: '<p>Slides 17–18 and 22–25. For each error, say what happened and whether the application should retry the whole transaction.</p>',
    vi: '<p>Slide 17–18 và 22–25. Với mỗi lỗi, nói chuyện gì đã xảy ra và ứng dụng có nên thử lại cả giao dịch không.</p>',
    bang: [bang1('b1', ['Error → meaning → retry?', 'Lỗi → nghĩa → thử lại?'],
      [{ ma: 'loi', ten: 'Error / Lỗi' },
        { ma: 'nghia', ten: 'Meaning / Nghĩa', luaChon: ['chosen as deadlock victim', 'serialization failure', 'snapshot update conflict', 'duplicate key', 'CHECK constraint violated'] },
        { ma: 'thu', ten: 'Retry?', luaChon: ['yes, the whole transaction', 'no, fix the data or the request'] }],
      [{ o: { loi: 'SQL Server Msg 1205' }, a: { nghia: 'chosen as deadlock victim', thu: 'yes, the whole transaction' } },
        { o: { loi: 'PostgreSQL SQLSTATE 40P01' }, a: { nghia: 'chosen as deadlock victim', thu: 'yes, the whole transaction' } },
        { o: { loi: 'PostgreSQL SQLSTATE 40001' }, a: { nghia: 'serialization failure', thu: 'yes, the whole transaction' } },
        { o: { loi: 'SQL Server Msg 3960' }, a: { nghia: 'snapshot update conflict', thu: 'yes, the whole transaction' } },
        { o: { loi: 'SQL Server Msg 2627' }, a: { nghia: 'duplicate key', thu: 'no, fix the data or the request' } },
        { o: { loi: 'SQL Server Msg 547' }, a: { nghia: 'CHECK constraint violated', thu: 'no, fix the data or the request' } }],
      ['Concurrency errors are transient: the same transaction may succeed a moment later, so retry it from BEGIN (with a small random back-off). Data errors will fail the same way every time. Msg 547 also covers FOREIGN KEY violations.', 'Lỗi tương tranh là tạm thời: cùng giao dịch có thể thành công ngay sau đó nên thử lại từ BEGIN (chờ ngẫu nhiên một chút). Lỗi dữ liệu sẽ hỏng y như cũ mỗi lần. Msg 547 cũng là lỗi vi phạm FOREIGN KEY.'])],
    gy: [['Concurrency failure ⇒ retry; data failure ⇒ do not.', 'Lỗi tương tranh ⇒ thử lại; lỗi dữ liệu ⇒ không.'], ['Retry the WHOLE transaction, not the last statement.', 'Thử lại CẢ giao dịch, không chỉ câu cuối.']],
    lhg: [['Retrying only the failed statement after a deadlock — the victim\'s whole transaction was rolled back.', 'Chỉ chạy lại câu lỗi sau deadlock — cả giao dịch của nạn nhân đã bị hoàn tác.'], ['Retrying a duplicate-key error forever.', 'Thử lại lỗi trùng khoá mãi mãi.']],
    tn: [tn('deadlock victim', 'nạn nhân deadlock'), tn('serialization failure', 'lỗi tuần tự hoá'), tn('back-off', 'chờ lùi trước khi thử lại')],
  }),
]);
