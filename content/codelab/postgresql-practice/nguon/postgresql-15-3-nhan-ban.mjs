/**
 * PostgreSQL · 15.3 — Nhân bản streaming. Hai máy chủ + pg_basebackup ⇒ dựng bản sao là bài tay. Chấm được: đo độ trễ bằng
 * BYTE (pg_wal_lsn_diff) trên ảnh chụp pg_stat_replication — bài học chỉ ra replay_lag báo 0,66 s khi đã chậm 68 MB —
 * và bảng "bản sao giải quyết / không giải quyết gì".
 */
import { mod, pg, cs, q, bang1, tay, kq, kqAn, ma, pre, tn } from './_chung.mjs';

const TRE = `CREATE TABLE stat_replication (                     -- columns of pg_stat_replication on the primary
  application_name text PRIMARY KEY, client_addr text, state text NOT NULL,
  sent_lsn pg_lsn, write_lsn pg_lsn, flush_lsn pg_lsn, replay_lsn pg_lsn,
  replay_lag interval, sync_state text NOT NULL);
INSERT INTO stat_replication VALUES
  ('replica-a',  '10.0.0.11', 'streaming', '0/9A005660', '0/9A005660', '0/9A005660', '0/9A005660', '00:00:00.003628', 'async'),
  ('replica-bc', '10.0.0.12', 'streaming', '0/9A005660', '0/9A005660', '0/9A005660', '0/95C05660', '00:00:00.66',     'async'),
  ('report-db',  '10.0.0.13', 'catchup',   '0/9A005660', '0/98000000', '0/98000000', '0/97F00000', '00:00:41',        'async');`;
const LD_TRE = { en: `<h4>Table (snapshot of a primary)</h4>${pre(`stat_replication (application_name, client_addr, state, sent_lsn, write_lsn, flush_lsn, replay_lsn, replay_lag, sync_state)
-- 3 standbys`)}`, vi: `<h4>Bảng (ảnh chụp một primary)</h4>${pre(`stat_replication (application_name, client_addr, state, sent_lsn, write_lsn, flush_lsn, replay_lsn, replay_lag, sync_state)
-- 3 bản sao`)}` };

const DUNG = `# replica.sh — a primary and a streaming replica on one machine
docker network create pgc15net
docker run -d --name pgc15-pri --network pgc15net -e POSTGRES_PASSWORD=postgres -p 5461:5432 postgres:17
sleep 4
docker exec pgc15-pri psql -U postgres -c "CREATE ROLE replicator WITH REPLICATION LOGIN PASSWORD 'rep'"
docker exec pgc15-pri bash -c "echo 'host replication replicator all scram-sha-256' >> \\$PGDATA/pg_hba.conf"
docker exec pgc15-pri psql -U postgres -c "SELECT pg_reload_conf()"
docker exec pgc15-pri psql -U postgres -c "SELECT * FROM pg_create_physical_replication_slot('ban_sao_1')"
docker exec pgc15-pri psql -U postgres -c "CREATE TABLE note (id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY, title text)"
# copy the primary into an empty volume, as the replica's data directory
docker volume create pgc15-stdv
docker run --rm --network pgc15net -e PGPASSWORD=rep -v pgc15-stdv:/var/lib/postgresql/data postgres:17 \\
  pg_basebackup -h pgc15-pri -U replicator -D /var/lib/postgresql/data -S ban_sao_1 -R -X stream -P
docker run -d --name pgc15-std --network pgc15net -p 5462:5432 -v pgc15-stdv:/var/lib/postgresql/data postgres:17
sleep 4
docker exec pgc15-std psql -U postgres -c "SELECT pg_is_in_recovery()"
docker exec pgc15-pri psql -U postgres -c "INSERT INTO note (title) VALUES ('Từ primary')"
sleep 1
docker exec pgc15-std psql -U postgres -c "SELECT * FROM note"
docker exec pgc15-std psql -U postgres -c "INSERT INTO note (title) VALUES ('thử ghi')"
docker exec pgc15-pri psql -U postgres -xc "SELECT application_name, state, sent_lsn, replay_lsn, replay_lag, sync_state FROM pg_stat_replication"`;

export default mod('postgresql-15-3-nhan-ban', '15.3 Streaming replication: a second copy, kept current', [
  tay({
    t: 'Build a replica on a second port and watch a row cross', k: 'HARD', p: 25, kn: ['pg_create_physical_replication_slot', 'pg_basebackup -R -X stream -S', 'standby.signal', 'pg_is_in_recovery()'], tag: ['replication', 'docker'],
    en: `<p>Two containers: a primary and a streaming replica built with the exact pg_basebackup command of lesson 15.3.</p>${pre(DUNG)}`,
    vi: `<p>Hai container: một primary và một bản sao streaming dựng bằng đúng lệnh pg_basebackup của bài 15.3.</p>${pre(DUNG)}`,
    yc: [['<code>pg_is_in_recovery()</code> on the replica = <code>t</code>.', '<code>pg_is_in_recovery()</code> trên bản sao = <code>t</code>.'], ['The row inserted on the primary is on the replica within a second; INSERT on the replica fails with <code>cannot execute INSERT in a read-only transaction</code>.', 'Dòng chèn ở primary có mặt trên bản sao trong vòng một giây; INSERT trên bản sao lỗi <code>cannot execute INSERT in a read-only transaction</code>.'], ['pg_stat_replication: state = streaming, sent_lsn = replay_lsn. Clean up with <code>docker rm -f pgc15-pri pgc15-std; docker volume rm pgc15-stdv; docker network rm pgc15net</code>.', 'pg_stat_replication: state = streaming, sent_lsn = replay_lsn. Dọn bằng <code>docker rm -f pgc15-pri pgc15-std; docker volume rm pgc15-stdv; docker network rm pgc15net</code>.']],
    lenh: 'bash replica.sh',
    lyDo: ['Replication needs two running servers talking over the network; the browser grader is a single in-page PostgreSQL.', 'Nhân bản cần hai máy chủ đang chạy nói chuyện qua mạng; máy chấm trình duyệt chỉ là một PostgreSQL trong trang.'],
    tep: { 'replica.sh': DUNG + '\n' },
    giaiTep: { 'replica.sh': `${DUNG}

# Expected (PostgreSQL 17.11):
#  pg_is_in_recovery → t
#  note on the replica → 1 | Từ primary
#  INSERT on the replica → ERROR:  cannot execute INSERT in a read-only transaction
#  application_name | walreceiver · state | streaming · sent_lsn = replay_lsn · sync_state | async
# The data directory of the replica contains standby.signal and postgresql.auto.conf with primary_conninfo + primary_slot_name.
` },
    viDu: [{ input: ['SELECT pg_is_in_recovery();  -- on pgc15-std', 'SELECT pg_is_in_recovery();  -- trên pgc15-std'], output: ['t', 't'], explanation: ['A replica is permanently "in recovery": replaying WAL is its job.', 'Bản sao luôn "đang khôi phục": phát lại WAL là công việc của nó.'] }],
    gy: [['-R writes primary_conninfo and creates standby.signal; -X stream keeps the copy consistent.', '-R ghi primary_conninfo và tạo standby.signal; -X stream giữ bản chép nhất quán.'], ['The replication role needs a pg_hba.conf line with the database name "replication".', 'Role replication cần một dòng pg_hba.conf với tên CSDL là "replication".']],
    lhg: [['Forgetting the slot (-S) — a replica that falls behind may find its WAL already recycled.', 'Quên khe (-S) — bản sao tụt lại có thể thấy WAL của nó đã bị tái chế.'], ['Leaving the slot behind after deleting the replica — the primary keeps WAL forever (15.2).', 'Để lại khe sau khi xoá bản sao — primary giữ WAL mãi mãi (15.2).']],
    gt: ['<p>A physical replica is a byte-identical copy that replays the primary\'s WAL continuously. It gives read capacity and a machine to fail over to — never write capacity, and never protection from DROP TABLE.</p>', '<p>Bản sao vật lý là bản chép giống từng byte, liên tục phát lại WAL của primary. Nó cho thêm sức đọc và một máy để chuyển sang khi hỏng — không bao giờ thêm sức ghi, và không bao giờ bảo vệ khỏi DROP TABLE.</p>'],
    tn: [tn('streaming replication', 'nhân bản luồng'), tn('standby', 'máy dự phòng')],
  }),

  pg({
    csdl: TRE, tenCsdl: 'replication', ld: LD_TRE,
    t: 'Measure replication lag in bytes, not seconds', k: 'MEDIUM', p: 10, kn: ['pg_wal_lsn_diff(sent_lsn, replay_lsn)', 'replay_lag can mislead', 'state <> streaming'], tag: ['replication', 'monitoring'],
    en: '<p>For each standby return <code>application_name, state, behind, replay_lag, alert</code>: behind = <code>pg_size_pretty(pg_wal_lsn_diff(sent_lsn, replay_lsn))</code>; alert = the state is not <code>streaming</code> <b>or</b> the standby is more than <b>16 MB</b> (16777216 bytes) behind. Most behind first.</p>',
    vi: '<p>Với mỗi bản sao trả về <code>application_name, state, behind, replay_lag, alert</code>: behind = <code>pg_size_pretty(pg_wal_lsn_diff(sent_lsn, replay_lsn))</code>; alert = trạng thái không phải <code>streaming</code> <b>hoặc</b> bản sao chậm hơn <b>16 MB</b> (16777216 byte). Chậm nhất trước.</p>',
    yc: [['Compute the bytes once (a CTE or a LATERAL) and reuse them for behind, alert and ORDER BY.', 'Tính số byte một lần (CTE hoặc LATERAL) rồi dùng lại cho behind, alert và ORDER BY.'], ['Do not trust replay_lag alone.', 'Đừng tin mỗi replay_lag.']],
    giai: `SELECT r.application_name, r.state,
       pg_size_pretty(b.bytes) AS behind,
       r.replay_lag,
       r.state <> 'streaming' OR b.bytes > 16777216 AS alert
FROM stat_replication r,
     LATERAL (SELECT pg_wal_lsn_diff(r.sent_lsn, r.replay_lsn) AS bytes) b
ORDER BY b.bytes DESC;`,
    kiem: [
      kq(['replica-bc is 68 MB behind while replay_lag says 0.66 s', 'replica-bc chậm 68 MB trong khi replay_lag nói 0,66 s'], { thuTu: true }),
      kqAn(['report-db is only 1 MB behind but still in catchup', 'report-db chỉ còn chậm 1 MB nhưng vẫn đang catchup'], "UPDATE stat_replication SET replay_lsn = '0/99F00000', replay_lag = '00:00:02' WHERE application_name = 'report-db'", { thuTu: true }),
      kqAn(['…and then streams again', '…rồi stream trở lại'], "UPDATE stat_replication SET state = 'streaming', write_lsn = sent_lsn, flush_lsn = sent_lsn, replay_lsn = '0/99F00000', replay_lag = '00:00:00.2' WHERE application_name = 'report-db'", { thuTu: true }),
      ma(['Uses pg_wal_lsn_diff', 'Dùng pg_wal_lsn_diff'], 'pg_wal_lsn_diff\\s*\\('),
    ],
    sai: [
      "SELECT application_name, state, pg_size_pretty(pg_wal_lsn_diff(sent_lsn, replay_lsn)) AS behind, replay_lag, state <> 'streaming' OR replay_lag > interval '5 seconds' AS alert FROM stat_replication ORDER BY pg_wal_lsn_diff(sent_lsn, replay_lsn) DESC",
      "SELECT application_name, state, pg_size_pretty(pg_wal_lsn_diff(sent_lsn, replay_lsn)) AS behind, replay_lag, pg_wal_lsn_diff(sent_lsn, replay_lsn) > 16777216 AS alert FROM stat_replication ORDER BY pg_wal_lsn_diff(sent_lsn, replay_lsn) DESC",
    ],
    gy: [['sent → write → flush → replay: the gap between the first and the last is what the replica has not applied yet.', 'sent → write → flush → replay: khoảng cách giữa đầu và cuối là phần bản sao chưa áp dụng.'], ['On a live primary: <code>FROM pg_stat_replication</code>.', 'Trên primary thật: <code>FROM pg_stat_replication</code>.']],
    lhg: [['Alerting on replay_lag only — it is measured from the last replayed commit and can look tiny while megabytes wait.', 'Chỉ cảnh báo theo replay_lag — nó đo từ commit cuối đã phát lại và có thể trông rất nhỏ khi hàng chục MB đang chờ.'], ['Ignoring state — a standby in catchup is not serving fresh reads.', 'Lờ trạng thái — bản sao đang catchup không phục vụ dữ liệu đọc mới.']],
    gt: ['<p>The lesson paused replay on a standby and inserted 200 000 rows: 68 MB between sent_lsn and replay_lsn while replay_lag still said 0.66 s. Bytes behind is the honest measure; alert on it and on any state other than streaming.</p>', '<p>Bài học dừng phát lại trên một bản sao rồi chèn 200 000 dòng: 68 MB giữa sent_lsn và replay_lsn trong khi replay_lag vẫn nói 0,66 s. Số byte chậm là thước đo trung thực; cảnh báo theo nó và theo mọi trạng thái khác streaming.</p>'],
    tn: [tn('replication lag', 'độ trễ nhân bản'), tn('replay_lsn', 'vị trí đã phát lại')],
  }),

  cs({
    t: 'What a replica does and does not solve', k: 'MEDIUM', p: 6, kn: ['read scaling', 'failover', 'replica is not a backup'], tag: ['replication'], loai: 'table',
    en: '<p>For each problem, does adding a streaming replica solve it?</p>', vi: '<p>Với mỗi vấn đề, thêm một bản sao streaming có giải quyết được không?</p>',
    bang: [bang1('b1', ['Problem → replica helps?', 'Vấn đề → bản sao giúp được?'], [{ ma: 'p', ten: 'Problem / Vấn đề' }, { ma: 'r', ten: 'Replica? / Bản sao?', luaChon: ['yes', 'no'] }], [
      { o: { p: 'Nightly reports slow down the checkout / Báo cáo đêm làm chậm thanh toán' }, a: { r: 'yes' } },
      { o: { p: 'The primary\'s disk dies / Đĩa của primary hỏng' }, a: { r: 'yes' } },
      { o: { p: 'Too many INSERTs per second for one server / Quá nhiều INSERT mỗi giây cho một máy' }, a: { r: 'no' } },
      { o: { p: 'Someone ran DROP TABLE orders / Ai đó chạy DROP TABLE orders' }, a: { r: 'no' } },
      { o: { p: 'A 3-hour pg_dump blocks vacuum on the primary / pg_dump 3 giờ chặn vacuum trên primary' }, a: { r: 'yes' } },
      { o: { p: 'Let the analytics team write their own tables on it / Cho đội phân tích tự tạo bảng trên đó' }, a: { r: 'no' } },
    ], ['A replica adds read capacity and a failover target (pg_promote). It replays every write including DROP TABLE, cannot accept writes of its own, and does nothing for write throughput — that needs partitioning or sharding; human error needs PITR.', 'Bản sao thêm sức đọc và một đích chuyển sang khi hỏng (pg_promote). Nó phát lại mọi lệnh ghi kể cả DROP TABLE, không nhận lệnh ghi riêng, và không giúp gì thông lượng ghi — việc đó cần phân mảnh hoặc sharding; lỗi con người cần PITR.'])],
    gy: [['Ask: is it about reading, writing, hardware or mistakes?', 'Tự hỏi: chuyện đọc, ghi, phần cứng hay sai sót?'], ['A physical replica is byte-identical, so it cannot diverge.', 'Bản sao vật lý giống từng byte, nên không thể khác đi.']],
    lhg: [['Calling the replica "our backup".', 'Gọi bản sao là "bản sao lưu của chúng ta".'], ['Expecting replicas to scale writes.', 'Mong bản sao tăng sức ghi.']],
    tn: [tn('failover', 'chuyển sang máy dự phòng')],
  }),

  cs({
    t: 'Replica details and the stale-read trap', k: 'EASY', p: 6, kn: ['standby.signal', 'pg_promote()', 'read-your-writes'], tag: ['replication'],
    en: '<p>Lesson 15.3 in three questions.</p>', vi: '<p>Bài 15.3 trong ba câu.</p>',
    cau: [
      q('q1', ['What makes a data directory start as a replica instead of a primary?', 'Điều gì khiến một thư mục dữ liệu khởi động thành bản sao thay vì primary?'], ['the empty file standby.signal (written by pg_basebackup -R)', 'the name given to the container or host', 'setting wal_level = logical in postgresql.conf', 'a special replica role stored in pg_authid'], ['standby.signal + primary_conninfo; -R writes both.', 'standby.signal + primary_conninfo; -R ghi cả hai.']),
      q('q2', ['A user saves their profile, the page reloads from a replica and shows the old name. What is this?', 'Người dùng lưu hồ sơ, trang tải lại từ bản sao và hiện tên cũ. Đây là gì?'], ['async replication lag — reads after your own write must go to the primary', 'a bug in the UPDATE statement that saved the profile', 'a failover that went wrong a few seconds earlier', 'a corrupted replica that has to be rebuilt from scratch'], ['Route the reads that must see the user\'s own write to the primary (or wait for the LSN).', 'Định tuyến các lần đọc cần thấy chính thứ người dùng vừa ghi về primary (hoặc đợi tới LSN đó).']),
      q('q3', ['The primary is gone for good. Which call turns the replica into the new primary?', 'Primary hỏng hẳn. Lệnh nào biến bản sao thành primary mới?'], ['SELECT pg_promote();', 'SELECT pg_is_in_recovery();', 'DELETE standby.signal while it runs', 'ALTER SYSTEM SET hot_standby = off;'], ['Measured: writable 3 s after the primary stopped, on timeline 2. Patroni/repmgr automate the election.', 'Đo được: ghi được 3 s sau khi primary dừng, trên timeline 2. Patroni/repmgr tự động hoá việc bầu chọn.']),
    ],
    gy: [['Recovery mode is the replica\'s permanent state.', 'Chế độ khôi phục là trạng thái thường trực của bản sao.'], ['Decide per read whether stale data is acceptable.', 'Quyết định theo từng lần đọc xem dữ liệu cũ có chấp nhận được không.']],
    lhg: [['Sending every read to replicas without thinking about the user\'s own writes.', 'Đẩy mọi lần đọc sang bản sao mà không nghĩ tới thứ người dùng vừa ghi.'], ['Promoting while the old primary may still accept writes (split brain).', 'Promote trong khi primary cũ có thể vẫn nhận ghi (split brain).']],
    tn: [tn('read-your-writes', 'đọc thấy chính thứ mình vừa ghi'), tn('promote', 'nâng làm primary')],
  }),
]);
