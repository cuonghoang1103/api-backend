/**
 * DBI202 · ⭐ CS.2 phần 2 — buffer pool, đọc logic/vật lý, WAL và khôi phục sau sập, thống kê và ước lượng dòng, vòng đời một SELECT,
 * plan cache và tham số hoá (slide 15–24). Đề tĩnh.
 */
import { mod, cs, q, ord, bang1, tn } from './_chung.mjs';

export default mod('dbi202-slide-cs2-2', '⭐ CS.2 Inside a DBMS (2): buffer pool, WAL, statistics, plans', [
  cs({
    t: 'Logical, physical, read-ahead: read the I/O numbers', k: 'MEDIUM', p: 7,
    kn: ['buffer pool', 'logical reads', 'physical reads', 'SET STATISTICS IO'], tag: ['advanced', 'internals', 'performance'],
    en: '<p>Slides 15–18. The same query runs twice right after the server starts.</p>', vi: '<p>Slide 15–18. Cùng một truy vấn chạy hai lần ngay sau khi server khởi động.</p>',
    cau: [
      q('c1', ['First run: logical reads 147, physical reads 2, read-ahead reads 145. Second run?', 'Lần 1: logical reads 147, physical reads 2, read-ahead reads 145. Lần 2?'], ['logical reads 147, physical 0, read-ahead 0', 'logical reads 0, physical 0, read-ahead 0', 'logical reads 2, physical 0, read-ahead 145', 'logical reads 147, physical 2, read-ahead 145'], ['Logical reads count pages touched in RAM — the same every run. The disk reads disappear because the pages are cached.', 'Logical reads đếm trang chạm trong RAM — mọi lần như nhau. Đọc đĩa biến mất vì trang đã nằm trong bộ đệm.']),
      q('c2', ['Which number should you compare when tuning a query?', 'Nên so số nào khi tinh chỉnh truy vấn?'], ['logical reads: they do not depend on what happens to be cached', 'physical reads: they are the only real cost', 'elapsed time of a single run on your laptop', 'the number of rows the query returns'], ['Logical reads are stable and proportional to work done; timings and physical reads depend on the cache state.', 'Logical reads ổn định và tỉ lệ với khối lượng việc; thời gian và đọc vật lý phụ thuộc trạng thái bộ đệm.']),
      q('c3', ['In PostgreSQL EXPLAIN (ANALYZE, BUFFERS), "shared hit=173" means…', 'Trong EXPLAIN (ANALYZE, BUFFERS) của PostgreSQL, "shared hit=173" nghĩa là…'], ['173 pages were found in shared_buffers', '173 pages were read from the disk', '173 rows matched the filter', '173 ms were spent waiting for locks'], ['hit = already in RAM; read = had to come from the OS/disk.', 'hit = đã có trong RAM; read = phải lấy từ OS/đĩa.']),
      q('c4', ['A query returns ONE row but shows 147 logical reads. Most likely…', 'Truy vấn trả MỘT dòng nhưng 147 logical reads. Nhiều khả năng…'], ['no index on the filtered column: the whole table was scanned', 'the row is very wide and spans 147 pages', 'the buffer pool is too small for the table', 'statistics are being rebuilt during the query'], ['Cost is the pages read to FIND the row, not the rows returned.', 'Chi phí là số trang đọc để TÌM dòng, không phải số dòng trả về.']),
    ],
    gy: [['Logical = RAM touches; physical = disk.', 'Logical = chạm RAM; physical = đĩa.'], ['Tune on logical reads, not on a single timing.', 'Tinh chỉnh theo logical reads, không theo một lần đo thời gian.']],
    lhg: [['"Second run is faster, so the query got better" — only the cache changed.', '"Lần hai nhanh hơn nên truy vấn tốt hơn" — chỉ bộ đệm thay đổi.'], ['Judging a query by the rows it returns.', 'Đánh giá truy vấn theo số dòng trả về.']],
    tn: [tn('logical read', 'đọc logic'), tn('physical read', 'đọc vật lý'), tn('read-ahead', 'đọc trước')],
  }),
  cs({
    t: 'Write-ahead logging: from UPDATE to a safe COMMIT', k: 'MEDIUM', p: 6, loai: 'order',
    kn: ['WAL rule', 'COMMIT', 'checkpoint'], tag: ['advanced', 'internals', 'transaction'],
    en: '<p>Slides 19–21. Order what happens for one UPDATE inside a transaction until the data page finally reaches the disk.</p>',
    vi: '<p>Slide 19–21. Sắp thứ tự những gì xảy ra với một UPDATE trong giao dịch cho tới khi trang dữ liệu cuối cùng xuống đĩa.</p>',
    cau: [ord('o1', ['First → last', 'Đầu → cuối'], ['The data page is read into the buffer pool', 'The page is changed in RAM and marked dirty', 'A log record describing the change is added to the log buffer', 'COMMIT forces the log records to disk (flush)', 'The client is told the transaction committed', 'A later checkpoint writes the dirty data page to disk'],
      ['The WAL rule: the log reaches the disk before COMMIT returns; data pages can follow much later. After a crash, recovery replays (redo) committed log records and rolls back (undo) the rest.', 'Luật WAL: nhật ký xuống đĩa trước khi COMMIT trả về; trang dữ liệu có thể xuống muộn hơn nhiều. Sau sập máy, phục hồi chạy lại (redo) bản ghi đã commit và hoàn tác (undo) phần còn lại.'])],
    gy: [['COMMIT waits for the LOG, not for the data page.', 'COMMIT chờ NHẬT KÝ, không chờ trang dữ liệu.'], ['Checkpoints come later and in bulk.', 'Checkpoint đến sau và theo lô.']],
    lhg: [['Writing the data page before COMMIT returns — that is what makes COMMIT slow, and WAL avoids it.', 'Ghi trang dữ liệu trước khi COMMIT trả về — đó là điều làm COMMIT chậm, và WAL tránh nó.'], ['Telling the client "committed" before the log is flushed.', 'Báo client "đã commit" trước khi nhật ký được ghi xuống.']],
    tn: [tn('write-ahead logging (WAL)', 'ghi nhật ký trước'), tn('dirty page', 'trang bẩn'), tn('checkpoint', 'điểm kiểm tra')],
  }),
  cs({
    t: 'Symptom → cause: diagnose with what slides 15–24 taught', k: 'HARD', p: 8, loai: 'table',
    kn: ['statistics', 'plan cache', 'parameterization', 'transaction log'], tag: ['advanced', 'internals', 'performance'],
    en: '<p>Each line is a real-world symptom. Choose the internal mechanism that explains it.</p>',
    vi: '<p>Mỗi dòng là một triệu chứng thực tế. Chọn cơ chế bên trong giải thích nó.</p>',
    bang: [bang1('b1', ['Symptom → cause', 'Triệu chứng → nguyên nhân'],
      [{ ma: 'tc', ten: 'Symptom / Triệu chứng' }, { ma: 'ng', ten: 'Cause / Nguyên nhân', luaChon: ['stale statistics after a bulk load', 'literal values glued into ad hoc SQL text', 'one log record per deleted row', 'cold buffer pool after a restart', 'a covering index removed the key lookups'] }],
      [{ o: { tc: 'The plan shows "estimated 77 rows, actual 5,000" and uses Nested Loops with 5,000 lookups.' }, a: { ng: 'stale statistics after a bulk load' } },
        { o: { tc: 'The plan cache holds thousands of plans, each used exactly once, for the same query shape.' }, a: { ng: 'literal values glued into ad hoc SQL text' } },
        { o: { tc: 'DELETE FROM BigLog (no WHERE) filled the log disk; TRUNCATE TABLE would not have.' }, a: { ng: 'one log record per deleted row' } },
        { o: { tc: 'Every report is slow for ten minutes each Monday morning after maintenance, then fast again.' }, a: { ng: 'cold buffer pool after a restart' } },
        { o: { tc: 'After adding INCLUDE (total) to an index, logical reads dropped from 2,000 to 12 for the same query.' }, a: { ng: 'a covering index removed the key lookups' } }],
      ['Estimated vs actual off by 10× ⇒ suspect statistics first (UPDATE STATISTICS / ANALYZE). Parameterize (sp_executesql, prepared statements) to reuse one plan. TRUNCATE logs page deallocations, not rows.', 'Ước lượng lệch thực tế 10× ⇒ nghi thống kê trước (UPDATE STATISTICS / ANALYZE). Tham số hoá (sp_executesql, prepared statement) để dùng lại một kế hoạch. TRUNCATE ghi nhật ký giải phóng trang, không ghi từng dòng.'])],
    gy: [['Compare estimated and actual rows in the plan.', 'So số dòng ước lượng và thực tế trong kế hoạch.'], ['Many single-use plans ⇒ look at how the app builds its SQL.', 'Nhiều kế hoạch dùng một lần ⇒ xem app dựng SQL thế nào.']],
    lhg: [['Blaming the hardware for a stale-statistics plan.', 'Đổ cho phần cứng khi kế hoạch sai do thống kê cũ.'], ['Thinking DELETE and TRUNCATE log the same amount.', 'Tưởng DELETE và TRUNCATE ghi nhật ký như nhau.']],
    tn: [tn('statistics (histogram)', 'thống kê (biểu đồ phân bố)'), tn('plan cache', 'bộ nhớ đệm kế hoạch'), tn('parameterized query', 'truy vấn tham số hoá')],
  }),
]);
