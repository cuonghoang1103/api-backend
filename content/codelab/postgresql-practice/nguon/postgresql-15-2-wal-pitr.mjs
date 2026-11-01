/**
 * PostgreSQL · 15.2 — WAL, lưu trữ WAL, PITR. Lưu trữ + khôi phục tới một thời điểm cần máy chủ thật dừng/khởi động
 * ⇒ bài tay. Chấm được: thứ tự các bước PITR, phép tính LSN THẬT bằng pg_lsn/pg_wal_lsn_diff (khe sao chép bị bỏ rơi giữ
 * WAL — cái bẫy của bài, trên ảnh chụp pg_replication_slots), và trắc nghiệm.
 */
import { mod, pg, cs, q, ord, tay, kq, kqAn, ma, pre, tn } from './_chung.mjs';

const KHE = `CREATE TABLE wal_position (current_lsn pg_lsn NOT NULL);      -- SELECT pg_current_wal_lsn() on the primary
INSERT INTO wal_position VALUES ('3/2A000000');
CREATE TABLE replication_slots (                                   -- columns of pg_replication_slots
  slot_name text PRIMARY KEY, slot_type text NOT NULL, active boolean NOT NULL, restart_lsn pg_lsn NOT NULL);
INSERT INTO replication_slots VALUES
  ('ban_sao_1',      'physical', true,  '3/29FF0000'),
  ('old_replica',    'physical', false, '1/80000000'),
  ('debezium_cdc',   'logical',  true,  '2/F0000000'),
  ('analytics_test', 'logical',  false, '3/28000000');`;
const LD_KHE = { en: `<h4>Tables (snapshot of a primary)</h4>${pre(`wal_position (current_lsn pg_lsn)                               -- 3/2A000000
replication_slots (slot_name, slot_type, active, restart_lsn pg_lsn)   -- 4 slots`)}`, vi: `<h4>Bảng (ảnh chụp một primary)</h4>${pre(`wal_position (current_lsn pg_lsn)                               -- 3/2A000000
replication_slots (slot_name, slot_type, active, restart_lsn pg_lsn)   -- 4 khe`)}` };

const PITR = `# pitr.sh — archive WAL, take a base backup, "lose" a table, recover to the second before
docker volume create pgpitr-wal
docker run -d --name pgpitr -e POSTGRES_PASSWORD=postgres -p 5450:5432 \\
  -v pgpitr-wal:/mnt/wal postgres:17 \\
  -c wal_level=replica -c archive_mode=on \\
  -c "archive_command=test ! -f /mnt/wal/%f && cp %p /mnt/wal/%f"
sleep 3; docker exec pgpitr chown postgres /mnt/wal
docker exec pgpitr psql -U postgres -c "CREATE TABLE note (id int PRIMARY KEY, body text)"
docker exec pgpitr psql -U postgres -c "INSERT INTO note SELECT g, 'note ' || g FROM generate_series(1, 1000) g"
docker exec pgpitr pg_basebackup -U postgres -D /tmp/base -X stream -c fast
docker exec pgpitr psql -U postgres -Atc "INSERT INTO note VALUES (1001, 'after the base backup'); SELECT now()"   # ← write this time down
sleep 2
docker exec pgpitr psql -U postgres -c "DELETE FROM note"        # the disaster
docker exec pgpitr psql -U postgres -c "SELECT pg_switch_wal()"  # push the last segment to the archive
# recover: base backup + WAL up to the time you wrote down
docker exec pgpitr bash -c '
  pg_ctl -D /tmp/base status >/dev/null 2>&1
  echo "restore_command = '\\''cp /mnt/wal/%f %p'\\''"            >> /tmp/base/postgresql.auto.conf
  echo "recovery_target_time = '\\''<THE TIME YOU WROTE DOWN>'\\''" >> /tmp/base/postgresql.auto.conf
  echo "recovery_target_action = promote"                          >> /tmp/base/postgresql.auto.conf
  touch /tmp/base/recovery.signal
  chown -R postgres /tmp/base && chmod 700 /tmp/base
  su postgres -c "pg_ctl -D /tmp/base -o \\"-p 5433\\" -l /tmp/base.log start" && sleep 3
  psql -U postgres -p 5433 -Atc "SELECT count(*), max(id) FROM note"
'`;

export default mod('postgresql-15-2-wal-pitr', '15.2 WAL, archiving and point-in-time recovery', [
  cs({
    t: 'Point-in-time recovery, in order', k: 'MEDIUM', p: 8, kn: ['base backup + WAL archive', 'recovery_target_time', 'recovery.signal'], tag: ['wal', 'pitr'],
    en: '<p>At 14:32 someone ran <code>DELETE FROM users</code> without WHERE. Put the steps of a recovery to 14:31:59 in order — including the ones that had to happen long before the incident.</p>',
    vi: '<p>Lúc 14:32 ai đó chạy <code>DELETE FROM users</code> thiếu WHERE. Sắp xếp các bước khôi phục về 14:31:59 — kể cả những bước lẽ ra phải làm từ rất lâu trước sự cố.</p>',
    cau: [ord('o1', ['Order the steps', 'Sắp thứ tự các bước'], [
      'archive_mode = on + a working archive_command (weeks before) / bật archive_mode + archive_command chạy được (từ vài tuần trước)',
      'take a base backup with pg_basebackup (before the incident) / lấy base backup bằng pg_basebackup (trước sự cố)',
      'stop writes and copy the base backup into an empty data directory / dừng ghi và chép base backup vào thư mục dữ liệu trống',
      'set restore_command and recovery_target_time = \'14:31:59\' / đặt restore_command và recovery_target_time = \'14:31:59\'',
      'create recovery.signal and start the server: it replays WAL up to the target / tạo recovery.signal rồi khởi động: máy chủ phát lại WAL tới mốc',
      'check the data, then promote and point the application at it / kiểm dữ liệu, rồi promote và trỏ ứng dụng sang',
    ], ['Archiving and the base backup must exist BEFORE the disaster — they cannot be added afterwards. Recovery = base backup + every archived WAL segment since, replayed to the target.', 'Lưu trữ WAL và base backup phải có TRƯỚC thảm hoạ — không thể bổ sung sau. Khôi phục = base backup + mọi đoạn WAL đã lưu từ đó, phát lại tới mốc.'])],
    loai: 'order',
    gy: [['Which steps are impossible to do after 14:32?', 'Bước nào không thể làm sau 14:32?'], ['recovery.signal is what makes the server enter recovery.', 'recovery.signal là thứ khiến máy chủ vào chế độ khôi phục.']],
    lhg: [['Starting from a nightly pg_dump — WAL cannot be replayed on top of a logical dump.', 'Bắt đầu từ pg_dump hằng đêm — không thể phát lại WAL lên một bản dump logic.'], ['Setting the target AFTER the delete (14:32:30) — you recover the disaster too.', 'Đặt mốc SAU lệnh xoá (14:32:30) — bạn khôi phục luôn cả thảm hoạ.']],
    tn: [tn('PITR', 'khôi phục tới một thời điểm'), tn('base backup', 'bản sao lưu nền')],
  }),

  pg({
    csdl: KHE, tenCsdl: 'slots', ld: LD_KHE,
    t: 'The abandoned replication slot that fills the disk', k: 'MEDIUM', p: 10, kn: ['pg_lsn', 'pg_wal_lsn_diff', 'replication slots retain WAL'], tag: ['wal', 'replication', 'monitoring'],
    en: '<p>A slot keeps every WAL segment its consumer has not confirmed. For each slot return <code>slot_name, slot_type, active, retained, alarm</code>: retained = <code>pg_size_pretty(pg_wal_lsn_diff(current_lsn, restart_lsn))</code>; alarm = the slot is <b>inactive</b> and retains <b>more than 1 GB</b> (1073741824 bytes). Most retained first.</p>',
    vi: '<p>Một khe giữ mọi đoạn WAL mà bên tiêu thụ chưa xác nhận. Với mỗi khe trả về <code>slot_name, slot_type, active, retained, alarm</code>: retained = <code>pg_size_pretty(pg_wal_lsn_diff(current_lsn, restart_lsn))</code>; alarm = khe <b>không hoạt động</b> và giữ <b>hơn 1 GB</b> (1073741824 byte). Giữ nhiều nhất trước.</p>',
    yc: [['An LSN like 3/2A000000 is a byte position: high part × 2³² + low part. pg_wal_lsn_diff does the subtraction.', 'LSN như 3/2A000000 là một vị trí byte: phần cao × 2³² + phần thấp. pg_wal_lsn_diff làm phép trừ.'], ['Sort by the number of bytes, not by the pretty text.', 'Sắp theo số byte, không theo chuỗi đã định dạng.']],
    giai: `SELECT s.slot_name, s.slot_type, s.active,
       pg_size_pretty(pg_wal_lsn_diff(w.current_lsn, s.restart_lsn)) AS retained,
       NOT s.active AND pg_wal_lsn_diff(w.current_lsn, s.restart_lsn) > 1073741824 AS alarm
FROM replication_slots s, wal_position w
ORDER BY pg_wal_lsn_diff(w.current_lsn, s.restart_lsn) DESC;`,
    kiem: [
      kq(['old_replica has been holding 6.7 GB', 'old_replica đang giữ 6,7 GB'], { thuTu: true }),
      kqAn(['One more GB of writes later', 'Sau thêm 1 GB dữ liệu ghi'], "UPDATE wal_position SET current_lsn = current_lsn + 1073741824", { thuTu: true }),
      ma(['Uses pg_wal_lsn_diff', 'Dùng pg_wal_lsn_diff'], 'pg_wal_lsn_diff\\s*\\('),
    ],
    sai: [
      "SELECT s.slot_name, s.slot_type, s.active, pg_size_pretty(pg_wal_lsn_diff(w.current_lsn, s.restart_lsn)) AS retained, pg_wal_lsn_diff(w.current_lsn, s.restart_lsn) > 1073741824 AS alarm FROM replication_slots s, wal_position w ORDER BY pg_wal_lsn_diff(w.current_lsn, s.restart_lsn) DESC",
      "SELECT s.slot_name, s.slot_type, s.active, pg_size_pretty(pg_wal_lsn_diff(w.current_lsn, s.restart_lsn)) AS retained, NOT s.active AND pg_wal_lsn_diff(w.current_lsn, s.restart_lsn) > 1073741824 AS alarm FROM replication_slots s, wal_position w ORDER BY retained DESC",
    ],
    gy: [['On a live primary: <code>FROM pg_replication_slots, pg_current_wal_lsn() AS current_lsn</code>.', 'Trên primary thật: <code>FROM pg_replication_slots, pg_current_wal_lsn() AS current_lsn</code>.'], ['An active slot that lags is a slow consumer; an inactive one is nobody.', 'Khe đang hoạt động mà trễ là bên tiêu thụ chậm; khe không hoạt động là chẳng có ai.']],
    lhg: [['Alarming on every big slot — the active CDC slot is just behind, not abandoned.', 'Báo động mọi khe lớn — khe CDC đang hoạt động chỉ là chậm, không bị bỏ rơi.'], ['ORDER BY the pretty text — "928 MB" sorts above "6816 MB".', 'ORDER BY chuỗi định dạng — "928 MB" xếp trên "6816 MB".']],
    gt: ['<p>A replication slot\'s guarantee is unconditional: switch the replica off and forget the slot, and the primary keeps every WAL segment until the disk is full and the server stops. Watch <code>pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)</code>, drop slots nobody uses (<code>pg_drop_replication_slot</code>), and consider <code>max_slot_wal_keep_size</code> as a ceiling.</p>', '<p>Cam kết của khe sao chép là vô điều kiện: tắt bản sao rồi quên khe, primary sẽ giữ mọi đoạn WAL cho tới khi đầy đĩa và máy chủ dừng. Theo dõi <code>pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)</code>, xoá khe không ai dùng (<code>pg_drop_replication_slot</code>), và cân nhắc <code>max_slot_wal_keep_size</code> làm trần.</p>'],
    tn: [tn('LSN', 'vị trí trong dòng WAL'), tn('replication slot', 'khe sao chép')],
  }),

  cs({
    t: 'WAL in four questions', k: 'EASY', p: 6, kn: ['write-ahead rule', 'wal_level', 'archive_command exit code', 'LSN'], tag: ['wal'],
    en: '<p>Lesson 15.2 in four questions.</p>', vi: '<p>Bài 15.2 trong bốn câu.</p>',
    cau: [
      q('q1', ['What must be on disk before COMMIT returns?', 'Cái gì phải nằm trên đĩa trước khi COMMIT trả về?'], ['the WAL records of the transaction', 'every changed data page', 'a fresh base backup', 'the updated indexes only'], ['Write-ahead: the log is flushed first; pages are written back lazily and rebuilt from WAL after a crash.', 'Ghi trước: nhật ký được đẩy xuống đĩa trước; trang dữ liệu ghi sau, và dựng lại từ WAL sau sự cố.']),
      q('q2', ['Which wal_level do streaming replication and archive-based PITR need?', 'Sao chép streaming và PITR dựa trên lưu trữ cần wal_level nào?'], ['replica (the default)', 'minimal', 'logical only', 'archive'], ['minimal is crash recovery only; logical adds detail for logical replication.', 'minimal chỉ đủ khôi phục sau sự cố; logical thêm chi tiết cho sao chép logic.']),
      q('q3', ['The archive disk is full and archive_command keeps failing. What does PostgreSQL do?', 'Đĩa lưu trữ đầy và archive_command liên tục lỗi. PostgreSQL làm gì?'], ['keeps the segments in pg_wal and retries — pg_wal grows until fixed', 'deletes the segments it could not archive', 'switches archiving off by itself', 'stops accepting connections at once'], ['Correct and dangerous: no segment is lost, but the main disk fills next.', 'Đúng mà nguy hiểm: không mất đoạn nào, nhưng đĩa chính sẽ đầy tiếp theo.']),
      q('q4', ['<code>pg_wal_lsn_diff(\'0/25FFE68\', \'0/247EE48\')</code> after inserting 10 000 rows is 1 576 992. What is it?', '<code>pg_wal_lsn_diff(\'0/25FFE68\', \'0/247EE48\')</code> sau khi chèn 10 000 dòng là 1 576 992. Đó là gì?'], ['bytes of WAL written (about 1540 kB)', 'the number of transactions', 'milliseconds of replay time', 'the number of 16 MB segments'], ['An LSN is a byte position in the WAL stream, so the difference is bytes.', 'LSN là vị trí byte trong dòng WAL, nên hiệu là số byte.']),
    ],
    gy: [['Log first, pages later.', 'Nhật ký trước, trang sau.'], ['An archive_command must report failure honestly.', 'archive_command phải báo lỗi trung thực.']],
    lhg: [['archive_command that always returns 0 ("cp … || true") — silent holes in the archive.', 'archive_command luôn trả 0 ("cp … || true") — lỗ hổng im lặng trong kho lưu trữ.'], ['Assuming wal_level = minimal is enough for backups.', 'Tưởng wal_level = minimal là đủ cho sao lưu.']],
    tn: [tn('WAL', 'nhật ký ghi trước')],
  }),

  tay({
    t: 'Archive WAL and recover to the second before a DELETE', k: 'HARD', p: 30, kn: ['archive_mode / archive_command', 'pg_basebackup', 'restore_command + recovery_target_time + recovery.signal'], tag: ['wal', 'pitr', 'docker'],
    en: `<p>The whole PITR loop of lesson 15.2 on a throw-away container. Write down the time printed after row 1001, then put it in recovery_target_time:</p>${pre(PITR)}`,
    vi: `<p>Trọn vòng PITR của bài 15.2 trên một container dùng xong bỏ. Ghi lại thời điểm in ra sau dòng 1001, rồi đặt nó vào recovery_target_time:</p>${pre(PITR)}`,
    yc: [['<code>ls /mnt/wal</code> inside the container shows archived 16 MB segments.', '<code>ls /mnt/wal</code> trong container hiện các đoạn 16 MB đã lưu trữ.'], ['The recovered server on port 5433 answers <code>1001 | 1001</code>: the row written after the base backup is back, the DELETE is not.', 'Máy chủ khôi phục ở cổng 5433 trả <code>1001 | 1001</code>: dòng ghi sau base backup đã về, lệnh DELETE thì không.'], ['Clean up: <code>docker rm -f pgpitr &amp;&amp; docker volume rm pgpitr-wal</code>.', 'Dọn dẹp: <code>docker rm -f pgpitr &amp;&amp; docker volume rm pgpitr-wal</code>.']],
    lenh: 'bash pitr.sh',
    lyDo: ['PITR needs a real server that archives WAL files, is stopped and restarted from a base backup; the browser grader is one in-page session.', 'PITR cần máy chủ thật lưu trữ tệp WAL, được dừng rồi khởi động lại từ base backup; máy chấm trình duyệt chỉ là một phiên trong trang.'],
    tep: { 'pitr.sh': PITR + '\n' },
    giaiTep: { 'pitr.sh': `${PITR}

# Expected:
#   count | max
#   1001  | 1001         ← recovered to the moment before the DELETE
# /tmp/base.log contains: "recovery stopping before commit of transaction …" and "archive recovery complete"
` },
    viDu: [{ input: ['SELECT count(*), max(id) FROM note  -- port 5433', 'SELECT count(*), max(id) FROM note  -- cổng 5433'], output: ['1001 | 1001', '1001 | 1001'], explanation: ['Base backup (1000 rows) + WAL replayed up to the target time.', 'Base backup (1000 dòng) + WAL phát lại tới mốc thời gian.'] }],
    gy: [['pg_switch_wal() closes the current segment so it reaches the archive now.', 'pg_switch_wal() đóng đoạn hiện tại để nó vào kho lưu trữ ngay.'], ['If the target is earlier than the end of the base backup, recovery refuses — pick a time after it.', 'Nếu mốc sớm hơn thời điểm kết thúc base backup, khôi phục sẽ từ chối — chọn thời điểm sau đó.']],
    lhg: [['Forgetting recovery.signal — the server just starts as a normal primary from the base backup.', 'Quên recovery.signal — máy chủ khởi động như primary bình thường từ base backup.'], ['An archive_command that never fails ("|| true") — the archive has holes and PITR stops early.', 'archive_command không bao giờ báo lỗi ("|| true") — kho lưu trữ có lỗ và PITR dừng sớm.']],
    gt: ['<p>This is the answer to human error that no dump gives: base backup + archived WAL + a recovery target. In production let pgBackRest or WAL-G run the archive and retention, and rehearse this restore regularly.</p>', '<p>Đây là lời đáp cho lỗi con người mà không bản dump nào cho được: base backup + WAL đã lưu + một mốc khôi phục. Trên production hãy để pgBackRest hoặc WAL-G lo lưu trữ và thời hạn giữ, và diễn tập việc khôi phục này đều đặn.</p>'],
    tn: [tn('archive_command', 'lệnh lưu trữ WAL'), tn('recovery target', 'mốc khôi phục')],
  }),
]);
