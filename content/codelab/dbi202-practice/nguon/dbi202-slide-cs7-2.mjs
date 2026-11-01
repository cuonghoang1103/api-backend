/**
 * DBI202 · ⭐ CS.7 phần 2 — Row-Level Security, mã hoá (TDE, Always Encrypted, TLS), băm mật khẩu, Dynamic Data Masking, kiểu sao lưu,
 * PITR, quy tắc 3-2-1, nhân bản, phân vùng/sharding/pooling, giám sát (slide 14–25). Đề tĩnh.
 */
import { mod, cs, q, bang1, tn } from './_chung.mjs';

export default mod('dbi202-slide-cs7-2', '⭐ CS.7 Security (2) & operations: RLS, encryption, backup, scaling', [
  cs({
    t: 'RLS, encryption, hashing, masking: which protects what?', k: 'MEDIUM', p: 7, loai: 'table',
    kn: ['RLS', 'TDE', 'Always Encrypted', 'TLS', 'hashing', 'Dynamic Data Masking'], tag: ['advanced', 'security'],
    en: '<p>Slides 14–18. Match each threat with the feature that actually stops it.</p>', vi: '<p>Slide 14–18. Ghép mỗi mối đe doạ với tính năng thật sự chặn nó.</p>',
    bang: [bang1('b1', ['Threat → feature', 'Mối đe doạ → tính năng'],
      [{ ma: 'md', ten: 'Threat / Mối đe doạ' }, { ma: 'tn', ten: 'Feature', luaChon: ['Row-Level Security', 'TDE (encryption at rest)', 'TLS (encryption in transit)', 'salted slow hash (bcrypt/Argon2)', 'Always Encrypted (client-side keys)', 'Dynamic Data Masking'] }],
      [{ o: { md: 'Company A\'s user must never see company B\'s rows, whatever query they run' }, a: { tn: 'Row-Level Security' } },
        { o: { md: 'A stolen backup file or disk must be unreadable' }, a: { tn: 'TDE (encryption at rest)' } },
        { o: { md: 'Someone sniffing the Wi-Fi between app and database' }, a: { tn: 'TLS (encryption in transit)' } },
        { o: { md: 'A leaked Users table must not reveal passwords' }, a: { tn: 'salted slow hash (bcrypt/Argon2)' } },
        { o: { md: 'Even the DBA must not read the national ID column' }, a: { tn: 'Always Encrypted (client-side keys)' } },
        { o: { md: 'Support staff should see 0912***678, not the full phone' }, a: { tn: 'Dynamic Data Masking' } }],
      ['Masking is a convenience, not security: anyone who can query with a WHERE can infer the hidden value. TDE protects files, not a logged-in user. Only client-side encryption keeps the DBA out.', 'Masking là tiện ích, không phải bảo mật: ai truy vấn được với WHERE đều suy ra giá trị bị che. TDE bảo vệ tệp, không bảo vệ trước người đã đăng nhập. Chỉ mã hoá phía client mới giữ DBA ở ngoài.'])],
    gy: [['Ask: who is the attacker, and where is the data when they reach it?', 'Hỏi: kẻ tấn công là ai, và dữ liệu đang ở đâu khi họ chạm tới?'], ['Passwords are hashed, never encrypted.', 'Mật khẩu được băm, không bao giờ được mã hoá.']],
    lhg: [['Counting Dynamic Data Masking as protection against a determined user.', 'Coi Dynamic Data Masking là bảo vệ trước người dùng quyết tâm.'], ['Thinking TDE hides data from people who can log in.', 'Tưởng TDE giấu dữ liệu khỏi người đăng nhập được.']],
    tn: [tn('encryption at rest', 'mã hoá khi lưu'), tn('encryption in transit', 'mã hoá khi truyền'), tn('data masking', 'che dữ liệu')],
  }),
  cs({
    t: 'Backups and recovery: full, differential, log, point-in-time', k: 'HARD', p: 8,
    kn: ['full backup', 'differential backup', 'log backup', 'PITR', 'recovery model'], tag: ['advanced', 'operations', 'backup'],
    en: '<p>Slides 19–21. Full backup every Sunday 00:00, differential every night 00:00, log backup every 15 minutes, FULL recovery model.</p>',
    vi: '<p>Slide 19–21. Sao lưu full mỗi Chủ nhật 00:00, differential mỗi đêm 00:00, sao lưu log mỗi 15 phút, recovery model FULL.</p>',
    cau: [
      q('c1', ['A wrong DELETE runs on Wednesday at 10:07. To restore to 10:06 you need…', 'Một lệnh DELETE sai chạy thứ Tư lúc 10:07. Để khôi phục về 10:06 cần…'], ['Sunday\'s full + Wednesday\'s differential + every log backup since, with STOPAT 10:06', 'Sunday\'s full backup only', 'Wednesday\'s differential only', 'the last log backup only, restored over the live database'], ['Full → latest differential → the log chain up to the moment, stopping just before the mistake.', 'Full → differential gần nhất → chuỗi log tới thời điểm, dừng ngay trước sai lầm.']),
      q('c2', ['A differential backup contains…', 'Bản sao lưu differential chứa…'], ['every page changed since the last FULL backup', 'every page changed since the last differential', 'only the transaction log since the last backup', 'a copy of the tables that were queried today'], ['So each differential grows during the week, and you only need the latest one.', 'Nên mỗi differential lớn dần trong tuần, và chỉ cần bản mới nhất.']),
      q('c3', ['Under the SIMPLE recovery model, point-in-time restore is…', 'Với recovery model SIMPLE, khôi phục theo thời điểm…'], ['impossible: the log is truncated and there are no log backups', 'possible from the latest differential backup', 'possible if the server was not restarted', 'automatic after every checkpoint'], ['SIMPLE fits dev/test databases; production data that matters needs FULL + log backups (PostgreSQL: WAL archiving).', 'SIMPLE hợp CSDL dev/test; dữ liệu production quan trọng cần FULL + sao lưu log (PostgreSQL: lưu trữ WAL).']),
      q('c4', ['"We have backups but we have never restored one" means…', '"Chúng tôi có bản sao lưu nhưng chưa từng khôi phục" nghĩa là…'], ['you do not know whether you have a backup at all', 'the backups are fine as long as the job is green', 'you only need to test once a year', 'the backups are encrypted and therefore safe'], ['A backup counts when a restore has been tested — GitLab 2017 (CS.1).', 'Bản sao lưu chỉ tính khi đã thử khôi phục — GitLab 2017 (CS.1).']),
    ],
    gy: [['RPO (how much data you may lose) decides the log-backup interval.', 'RPO (được phép mất bao nhiêu dữ liệu) quyết định chu kỳ sao lưu log.'], ['Restore chain: full → latest diff → logs.', 'Chuỗi khôi phục: full → diff mới nhất → log.']],
    lhg: [['Restoring every differential of the week in sequence.', 'Khôi phục lần lượt mọi differential trong tuần.'], ['Expecting point-in-time restore under SIMPLE recovery.', 'Mong khôi phục theo thời điểm với SIMPLE.']],
    tn: [tn('point-in-time recovery (PITR)', 'khôi phục về thời điểm'), tn('recovery point objective (RPO)', 'mục tiêu điểm khôi phục')],
  }),
  cs({
    t: 'Scaling and running a database: replication, partitioning, sharding, pooling', k: 'MEDIUM', p: 7,
    kn: ['replication', 'read replica', 'partitioning', 'sharding', 'connection pooling', 'monitoring'], tag: ['advanced', 'operations'],
    en: '<p>Five questions on slides 22–25.</p>', vi: '<p>Năm câu về slide 22–25.</p>',
    cau: [
      q('c1', ['A read replica with asynchronous replication may…', 'Bản sao chỉ đọc với nhân bản bất đồng bộ có thể…'], ['return data a few seconds old (replication lag)', 'accept writes and merge them back later', 'lose committed data on the primary', 'block every write on the primary'], ['Read-your-own-writes screens should read from the primary.', 'Màn hình cần thấy ngay dữ liệu vừa ghi nên đọc từ bản chính.']),
      q('c2', ['Partitioning differs from sharding because partitions…', 'Phân vùng khác sharding vì các phân vùng…'], ['stay on ONE server; shards spread over several servers', 'can only split a table by a date column, never by id', 'need the application to know where each row lives', 'are always faster than one table for every query'], ['Sharding scales writes but makes cross-shard joins and transactions hard.', 'Sharding mở rộng việc ghi nhưng làm khó phép nối và giao dịch giữa các shard.']),
      q('c3', ['A connection pool (PgBouncer, the pool in a Node driver) exists because…', 'Pool kết nối (PgBouncer, pool trong driver Node) tồn tại vì…'], ['connections are costly to open and the server allows only so many', 'SQL statements are compiled faster when they run inside a pool', 'a pool encrypts the traffic between the app and the server', 'each query needs its own brand-new connection to the server'], ['Thousands of web requests share tens of connections; PostgreSQL forks one process per connection.', 'Hàng nghìn request web dùng chung vài chục kết nối; PostgreSQL tạo một tiến trình cho mỗi kết nối.']),
      q('c4', ['Which signal most likely means "a session left a transaction open"?', 'Tín hiệu nào nhiều khả năng nghĩa là "một phiên để giao dịch mở"?'], ['many sessions waiting on locks held by one idle session', 'CPU at 100 % with no waits at all', 'a growing number of rows in a log table', 'a high buffer cache hit ratio'], ['Look for "idle in transaction" (PostgreSQL) or a sleeping session with open_transaction_count > 0 (SQL Server).', 'Tìm "idle in transaction" (PostgreSQL) hoặc phiên ngủ với open_transaction_count > 0 (SQL Server).']),
      q('c5', ['What should alert you BEFORE users complain?', 'Điều gì nên cảnh báo bạn TRƯỚC khi người dùng phàn nàn?'], ['disk free space, failed backup jobs and long-running queries', 'the number of tables in the database', 'how many developers have db_owner', 'the version string from SELECT @@VERSION'], ['A full disk once killed this course\'s own production PostgreSQL — free space is the first alert to set.', 'Đĩa đầy từng làm chết PostgreSQL production của chính khoá học này — dung lượng trống là cảnh báo đầu tiên nên đặt.']),
    ],
    gy: [['Replicas scale reads, shards scale writes, pools save connections.', 'Bản sao mở rộng đọc, shard mở rộng ghi, pool tiết kiệm kết nối.'], ['Monitor capacity and failures, not vanity numbers.', 'Giám sát dung lượng và lỗi, không phải con số cho đẹp.']],
    lhg: [['Sending every read to a lagging replica, including "show my new order".', 'Gửi mọi lượt đọc tới bản sao bị trễ, kể cả "xem đơn tôi vừa đặt".'], ['Sharding before trying indexes, partitioning and a bigger server.', 'Sharding trước khi thử chỉ mục, phân vùng và máy chủ lớn hơn.']],
    tn: [tn('replication lag', 'độ trễ nhân bản'), tn('sharding', 'phân mảnh ngang trên nhiều máy'), tn('connection pool', 'vùng chứa kết nối')],
  }),
]);
