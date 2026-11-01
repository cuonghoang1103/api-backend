/**
 * DBI202 · ⭐ CS.4 phần 1 — xen kẽ và khả tuần tự, năm hiện tượng, ma trận mức cô lập (SQL Server khoá vs PostgreSQL MVCC),
 * khoá S/U/X, 2PL, leo thang khoá (slide 1–12). Đề tĩnh.
 */
import { mod, cs, q, bang1, tn } from './_chung.mjs';

const MUC = ['prevented', 'possible'];

export default mod('dbi202-slide-cs4-1', '⭐ CS.4 Concurrency (1): anomalies, isolation, locks', [
  cs({
    t: 'The isolation matrix on SQL Server', k: 'MEDIUM', p: 8, loai: 'table',
    kn: ['isolation levels', 'dirty read', 'non-repeatable read', 'phantom'], tag: ['advanced', 'transaction', 'isolation'],
    en: '<p>Slides 9–10. For each isolation level on SQL Server, is the anomaly <b>prevented</b> or still <b>possible</b>?</p>',
    vi: '<p>Slide 9–10. Với mỗi mức cô lập trên SQL Server, hiện tượng bị <b>ngăn</b> (prevented) hay vẫn <b>có thể</b> (possible)?</p>',
    bang: [bang1('b1', ['Level × anomaly', 'Mức × hiện tượng'],
      [{ ma: 'muc', ten: 'Level / Mức' }, { ma: 'dr', ten: 'dirty read', luaChon: MUC }, { ma: 'nr', ten: 'non-repeatable read', luaChon: MUC }, { ma: 'ph', ten: 'phantom', luaChon: MUC }],
      [{ o: { muc: 'READ UNCOMMITTED' }, a: { dr: 'possible', nr: 'possible', ph: 'possible' } },
        { o: { muc: 'READ COMMITTED (default)' }, a: { dr: 'prevented', nr: 'possible', ph: 'possible' } },
        { o: { muc: 'REPEATABLE READ' }, a: { dr: 'prevented', nr: 'prevented', ph: 'possible' } },
        { o: { muc: 'SERIALIZABLE' }, a: { dr: 'prevented', nr: 'prevented', ph: 'prevented' } },
        { o: { muc: 'SNAPSHOT' }, a: { dr: 'prevented', nr: 'prevented', ph: 'prevented' } }],
      ['Each level adds one guarantee. SNAPSHOT reads a frozen version so none of the three read anomalies appear — but write skew still can (slide 8). On PostgreSQL READ UNCOMMITTED behaves as READ COMMITTED and REPEATABLE READ is a snapshot, so phantoms are prevented there too.', 'Mỗi mức thêm một đảm bảo. SNAPSHOT đọc một phiên bản đóng băng nên không có hiện tượng đọc nào — nhưng write skew vẫn có thể (slide 8). Trên PostgreSQL READ UNCOMMITTED chạy như READ COMMITTED và REPEATABLE READ là snapshot nên cũng ngăn được phantom.'])],
    gy: [['Read the level names literally: "repeatable" = re-reading a row gives the same value.', 'Đọc tên mức theo nghĩa đen: "repeatable" = đọc lại một dòng ra cùng giá trị.'], ['Only SERIALIZABLE (key-range locks) or a snapshot stops phantoms on SQL Server.', 'Trên SQL Server chỉ SERIALIZABLE (khoá dải khoá) hoặc snapshot chặn được phantom.']],
    lhg: [['Thinking REPEATABLE READ stops phantoms on SQL Server — new rows can still appear.', 'Tưởng REPEATABLE READ chặn phantom trên SQL Server — dòng mới vẫn xuất hiện được.'], ['Thinking SNAPSHOT is as strong as SERIALIZABLE — write skew slips through.', 'Tưởng SNAPSHOT mạnh ngang SERIALIZABLE — write skew lọt qua.']],
    tn: [tn('isolation level', 'mức cô lập'), tn('phantom read', 'đọc bóng ma'), tn('write skew', 'lệch ghi')],
  }),
  cs({
    t: 'Lock compatibility: granted or waits?', k: 'MEDIUM', p: 6, loai: 'table',
    kn: ['S lock', 'U lock', 'X lock', 'lock compatibility'], tag: ['advanced', 'transaction', 'locking'],
    en: '<p>Slide 11. Session A holds a lock on a row; session B requests another. Is B\'s request granted at once or does it wait?</p>',
    vi: '<p>Slide 11. Phiên A giữ một khoá trên dòng; phiên B xin một khoá khác. Yêu cầu của B được cấp ngay hay phải chờ?</p>',
    bang: [bang1('b1', ['Held by A → requested by B', 'A giữ → B xin'],
      [{ ma: 'ab', ten: 'A holds → B requests' }, { ma: 'kq', ten: 'Result', luaChon: ['granted', 'waits'] }],
      [{ o: { ab: 'S → S' }, a: { kq: 'granted' } },
        { o: { ab: 'S → U' }, a: { kq: 'granted' } },
        { o: { ab: 'S → X' }, a: { kq: 'waits' } },
        { o: { ab: 'U → S' }, a: { kq: 'granted' } },
        { o: { ab: 'U → U' }, a: { kq: 'waits' } },
        { o: { ab: 'X → S' }, a: { kq: 'waits' } }],
      ['Readers share S. U ("I will update this") is compatible with readers but not with another U — that is exactly what prevents the classic conversion deadlock of two S locks both trying to become X.', 'Người đọc chia sẻ S. U ("tôi sẽ sửa dòng này") hợp với người đọc nhưng không hợp với U khác — chính điều đó ngăn deadlock chuyển đổi kinh điển khi hai khoá S cùng muốn lên X.'])],
    gy: [['X is compatible with nothing.', 'X không hợp với khoá nào.'], ['Only one U at a time per resource.', 'Mỗi tài nguyên chỉ một U tại một thời điểm.']],
    lhg: [['Thinking U blocks readers.', 'Tưởng U chặn người đọc.'], ['Forgetting that, under READ COMMITTED SNAPSHOT, readers take no S lock at all.', 'Quên rằng dưới READ COMMITTED SNAPSHOT, người đọc không lấy khoá S nào.']],
    tn: [tn('shared lock (S)', 'khoá chia sẻ'), tn('update lock (U)', 'khoá cập nhật'), tn('exclusive lock (X)', 'khoá độc quyền')],
  }),
  cs({
    t: 'Schedules, 2PL, escalation, locking vs MVCC', k: 'HARD', p: 8,
    kn: ['serializability', 'two-phase locking', 'lock escalation', 'MVCC'], tag: ['advanced', 'transaction'],
    en: '<p>Five questions on slides 1–3 and 9–12.</p>', vi: '<p>Năm câu về slide 1–3 và 9–12.</p>',
    cau: [
      q('c1', ['An interleaved schedule is correct when…', 'Một lịch xen kẽ là đúng khi…'], ['its result equals some serial order of the same transactions', 'no transaction waits for a lock at any time', 'every statement finishes in under one second', 'transactions commit in the order they started'], ['That is the definition of serializable: equivalent to running them one after another in SOME order.', 'Đó là định nghĩa khả tuần tự: tương đương chạy lần lượt theo MỘT thứ tự nào đó.']),
      q('c2', ['Strict two-phase locking means a transaction…', 'Khoá hai pha nghiêm ngặt nghĩa là một giao dịch…'], ['acquires locks as it goes and releases its write locks only at COMMIT/ROLLBACK', 'locks every table it might touch before starting', 'releases each lock right after the statement that used it', 'takes only shared locks until the very last statement'], ['Growing phase, then all releases at the end — this guarantees serializable schedules.', 'Pha tăng, rồi nhả tất cả ở cuối — điều này bảo đảm lịch khả tuần tự.']),
      q('c3', ['One UPDATE touches 8,000 rows and suddenly other sessions cannot read ANY row of the table. Why?', 'Một UPDATE chạm 8.000 dòng và bỗng các phiên khác không đọc được BẤT KỲ dòng nào của bảng. Vì sao?'], ['lock escalation: about 5,000 row locks became one table X lock', 'the transaction log filled up and froze the table', 'statistics were rebuilt in the middle of the UPDATE', 'the buffer pool evicted every page of the table'], ['SQL Server escalates past ~5,000 locks on one object to save memory. Batch big updates to stay under it.', 'SQL Server leo thang khi vượt ~5.000 khoá trên một đối tượng để tiết kiệm bộ nhớ. Chia lô cập nhật lớn để ở dưới ngưỡng.']),
      q('c4', ['On PostgreSQL (MVCC), a long report SELECT and an UPDATE of the same rows…', 'Trên PostgreSQL (MVCC), một SELECT báo cáo dài và một UPDATE cùng các dòng…'], ['do not block each other: the reader sees an older version', 'block each other until the report finishes', 'deadlock, and the report is chosen as the victim', 'force the UPDATE to wait for the next VACUUM'], ['Readers never block writers and writers never block readers under MVCC; writers still block writers.', 'Dưới MVCC người đọc không chặn người ghi và ngược lại; người ghi vẫn chặn người ghi.']),
      q('c5', ['SQL Server\'s default READ COMMITTED (without RCSI) implements "no dirty reads" by…', 'READ COMMITTED mặc định của SQL Server (không RCSI) thực hiện "không dirty read" bằng…'], ['taking a short S lock on each row as it is read', 'reading the last committed version from tempdb', 'copying the table at the start of the transaction', 'refusing to read rows that were updated today'], ['That is why a reader waits behind an uncommitted UPDATE until RCSI is turned on.', 'Vì thế người đọc phải chờ sau một UPDATE chưa commit cho tới khi bật RCSI.']),
    ],
    gy: [['Serializable ≠ serial: interleaving is fine if the result matches a serial order.', 'Khả tuần tự ≠ tuần tự: xen kẽ không sao nếu kết quả khớp một thứ tự tuần tự.'], ['~5,000 locks ⇒ escalation.', '~5.000 khoá ⇒ leo thang.']],
    lhg: [['Thinking a fast, interleaved schedule is automatically correct.', 'Tưởng lịch xen kẽ chạy nhanh là tự động đúng.'], ['Expecting readers to block writers on PostgreSQL.', 'Tưởng người đọc chặn người ghi trên PostgreSQL.']],
    tn: [tn('serializable schedule', 'lịch khả tuần tự'), tn('two-phase locking (2PL)', 'khoá hai pha'), tn('lock escalation', 'leo thang khoá')],
  }),
]);
