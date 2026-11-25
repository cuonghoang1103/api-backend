/**
 * 10.1 — Sao lưu và khôi phục: mongodump, --oplog và khôi phục tới thời điểm (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s10-1-sao-luu'] (kịch bản demo/s10/s10-1-sao-luu.txt; MongoDB 8.0.38, database-tools 100.x trong ảnh mongo:8.0). Kịch bản tự nạp lại CT Shop.
 * Khối: 0 mongodump --db · 1 thư mục dump + metadata (index) · 2 bsondump = dữ liệu rõ · 3–4 mongorestore sang ctshop_kp (đủ 2000 đơn + index) · 5 chạy lại không --drop ⇒ 2260 failed
 * · 6 --drop · 7 --oplog + --db ⇒ "only supported on full dumps" · 8 cỡ thư mục vs archive gzip · 9 _demo/sao-luu.sh · 10 sao lưu + đếm · 11 _demo/kiem-khoi-phuc.sh DÙNG ĐƯỢC
 * · 12 tệp cắt cụt ⇒ HỎNG · 13 tệp rỗng ⇒ HỎNG · 14 database mới ctshop_anh · 15 cron cũ (--db ctshop, không --oplog) ⇒ HỎNG · 16 archive không nén grep ra email · 17 gzip ⇒ 0 (KHÔNG phải mã hoá)
 * · 18–21 openssl enc: khoá đúng đọc lại, khoá sai mã 1 · 22–24 fsyncLock + chép thư mục = snapshot: ghi bị chặn ~4 s, bản chụp khởi động đủ 2000 đơn
 * · 25 dump --oplog cả máy (bản "02:00") · 26 50 đơn sau sao lưu · 27 deleteMany PAID xoá 953 · 28 20 đơn sau xoá nhầm · 29 khách gọi · 30–32 oplog: 96 mục applyOps × 10 thao tác 'd', ts mốc
 * · 33–34 cắt oplog từ lúc sao lưu · 35–36 máy nháp: chỉ bản 02:00 = 2000/903 · 37–38 --oplogLimit = ts lệnh xoá ⇒ 2050/953 · 39–40 chép 953 đơn PAID về máy thật ⇒ 2070 đơn, 973 PAID.
 * Liên kết chéo: postgresql-15-1-pg-dump, postgresql-15-2-wal-pitr (đã có trên prod). Nguồn GET kiểm 24/11/2026: Docs mongodump, mongorestore, core/backups; GitLab postmortem 31/01/2017.
 */
import { lenh, ma, nguon, kv, lienKet, loiGiai } from '../_chung.mjs';

const K = 's10-1-sao-luu';

const CRON = `# /etc/cron.d/ctshop-sao-luu — 02:00 mỗi đêm: sao lưu, THỬ KHÔI PHỤC, mã hoá, đẩy ra kho khác; hỏng ở bước nào cũng báo
0 2 * * * ops  set -o pipefail; T=/sl/dem-$(date +\\%F).archive.gz; \\
  ./sao-luu.sh "$T" && ./kiem-khoi-phuc.sh "$T" && \\
  openssl enc -aes-256-cbc -pbkdf2 -salt -pass file:/etc/ctshop/khoa-sl < "$T" | rclone rcat r2:ctshop-sl/$(basename "$T").enc \\
  || curl -fsS -X POST "$WEBHOOK_TRUC" -d "SAO LƯU HỎNG $(date)"      # cảnh báo qua kênh KHÁC email (bài học GitLab)`;

export default {
  title: '10.1 — Backup and restore: mongodump, --oplog and point-in-time recovery|||10.1 — Sao lưu và khôi phục: mongodump, --oplog và khôi phục tới thời điểm',
  slug: 'mgo-10-1-sao-luu',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Sao lưu chạy thật trên MongoDB 8.0: mongodump/mongorestore và các bẫy (chạy lại không --drop thì 2260 tài liệu "failed", --oplog không đi với --db), một script kiểm khôi phục tự động bắt được tệp cắt cụt, tệp rỗng và cron cũ quên database mới; gzip không phải mã hoá (grep ra email), mã hoá bằng openssl; snapshot với fsyncLock. Rồi sự cố "xoá nhầm": deleteMany quên điều kiện xoá 953 đơn PAID — đọc oplog tìm đúng lệnh xoá, khôi phục bản 02:00 lên máy nháp, phát lại oplog tới ngay trước lệnh xoá bằng --oplogLimit, chỉ chép lại 953 đơn bị mất: 2070 đơn, không mất đơn nào ghi sau sự cố. Kèm sự cố thật GitLab 31/01/2017.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>Backup and restore: mongodump, --oplog and point-in-time recovery</h2>
<p class="lead">Replication (Chapter 7) protects you from a dead server. It does not protect you from a person: a <code>deleteMany</code> with a missing condition is replicated to every member within milliseconds. Only a backup brings data back — and only if you can actually restore it, to the right moment. This lesson builds a backup you have <em>proved</em> restorable, and then recovers from an accidental delete without losing the orders that arrived after it.</p>

<h3>An everyday picture</h3>
<p>A backup is a photo of your room taken at 2 a.m. The oplog is the CCTV recording since then. If someone throws your laptop out of the window at 14:03, the photo alone gives you the room as it was at 2 a.m. — you lose everything you did this morning. Photo <em>plus</em> recording, played up to 14:02:59, gives you the room exactly as it was a second before the mistake.</p>

<h3>1. mongodump and mongorestore</h3>
${lenh(K, 0)}
${lenh(K, 1)}
${lenh(K, 2)}
<p><code>mongodump</code> reads documents through the normal query path and writes one <code>.bson</code> file per collection plus a <code>.metadata.json</code> holding the index definitions (here our <code>customerId_1_createdAt_-1</code> from Chapter 4) — indexes are not copied, they are <em>rebuilt</em> on restore. <code>bsondump</code> shows that the files are plain BSON: names, emails and phone numbers readable by anyone who gets the file (§4).</p>
${lenh(K, 3)}
${lenh(K, 4)}
${lenh(K, 5)}
${lenh(K, 6)}
<p>Restoring into another database (<code>--nsFrom/--nsTo</code>) is the safe way to inspect a backup without touching production. Running the same restore twice without <code>--drop</code> gives "0 restored, 2260 failed": mongorestore only <em>inserts</em>, every <code>_id</code> already exists, and the command still looks like it finished. With <code>--drop</code> each collection is dropped first — powerful and dangerous: on the wrong target it deletes everything written since the backup.</p>

<h3>2. Consistency: --oplog and the archive format</h3>
${lenh(K, 7)}
${lenh(K, 8)}
<p>A dump of a busy database takes time, and writes keep arriving while it runs: orders dumped at the start and payments dumped at the end may not match. <code>--oplog</code> also captures the oplog entries written <em>during</em> the dump, and <code>mongorestore --oplogReplay</code> replays them so the result is a consistent snapshot of one moment. It only works on a full-instance dump (on a replica set) — hence the error with <code>--db</code>. <code>--archive --gzip</code> streams everything into one compressed file (816 KB of folders → about 90 KB), easy to pipe to cloud storage.</p>
${lienKet({ cta: 'Open lesson', khoa: 'postgresql', bai: 'postgresql-15-1-pg-dump', title: 'PostgreSQL course · 15.1 — Logical backups with pg_dump', sub: 'the same idea in PostgreSQL: one consistent snapshot per dump' })}

<h3>3. A backup you have never restored does not exist</h3>
${lenh(K, 9)}
${lenh(K, 10)}
<p>The backup script records how many documents each collection had <em>at backup time</em> next to the archive. The check script then does what nobody does by hand: starts a throwaway mongod (<code>--network none</code>), restores the archive into it with <code>--oplogReplay</code>, and compares counts.</p>
${lenh(K, 11)}
${lenh(K, 12)}
${lenh(K, 13)}
<p>A truncated file (disk full, network dropped during upload) and an empty file are both caught — the exit code is 1, so cron or CI can raise an alert. One detail measured on the lab: from the truncated file mongorestore had already loaded several hundred orders <em>before</em> reporting the error. A check that only counts "some data is there" would have passed it. Look at the exit code <strong>and</strong> the counts.</p>
${lenh(K, 14)}
${lenh(K, 15)}
<p>The most common real failure is not a broken file but a script that was right two years ago. The old cron dumped only <code>--db ctshop</code>; since then a developer added a database <code>ctshop_anh</code>. The archive is valid, the size looks normal — but it has no oplog and does not contain the new database. Only an automatic restore check catches this, the first night after the change.</p>
${ma('bash', CRON)}

<h3>4. gzip is not encryption</h3>
${lenh(K, 16)}
${lenh(K, 17)}
${lenh(K, 18)}
${lenh(K, 19)}
${lenh(K, 20)}
${lenh(K, 21)}
<p>A non-compressed archive leaks customer emails to a simple <code>grep</code>. The gzip version shows 0 matches — which proves nothing: <code>gunzip</code> needs no key. Encrypt the archive (here <code>openssl enc -aes-256-cbc -pbkdf2</code>; tools like <code>age</code> or a cloud KMS work too). With the right key it reads back; with a wrong key it fails with exit code 1. Store the key in a secrets manager, <strong>never next to the backup</strong> — and include "restore needs the key" in the restore test, or you will discover on the worst day that nobody has it.</p>

<h3>5. Snapshots: fast for big data</h3>
${lenh(K, 22)}
${lenh(K, 23)}
${lenh(K, 24)}
<p>For hundreds of GB, mongodump is slow to take and slower to restore (every index is rebuilt). The alternative is a filesystem/volume snapshot (LVM, EBS, ZFS). <code>db.fsyncLock()</code> flushes everything and blocks writes so the files on disk are consistent; here an insert waited about 4 seconds until <code>fsyncUnlock()</code>. A copy of the data directory started as a new mongod with all 2,000 orders — and without order 9999, which was blocked during the copy. On a replica set you take the snapshot on a secondary (or use a hidden member, Lesson 7.3) so the primary never stops; with journaling on the same volume, a cloud snapshot is consistent even without the lock.</p>
${nguon('📘', 'MongoDB Docs — Backup Methods', 'mongodump, filesystem snapshots, fsyncLock, Atlas cloud backups', 'https://www.mongodb.com/docs/manual/core/backups/')}

<h3>6. The 14:03 delete: point-in-time recovery</h3>
${lenh(K, 25)}
${lenh(K, 26)}
${lenh(K, 27)}
${lenh(K, 28)}
${lenh(K, 29)}
<p>The scenario of every operations course: a full backup with <code>--oplog</code> at "02:00"; 50 orders arrive; someone meant to delete one test order and ran <code>deleteMany({ status: 'PAID' })</code> — 953 paid orders gone; the shop keeps selling (20 new orders); customers call. Restoring the 02:00 backup over production would bring back the 953 orders and <em>delete the 70 orders written since</em>. We need the state one moment before the delete.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">02:00 backup</span><span class="lz-t">mongodump --oplog (full instance)</span><span class="lz-d">consistent snapshot: 2,000 orders</span></div>
  <div class="lz-step"><span class="lz-k">Oplog</span><span class="lz-t">every write since 02:00, in order</span><span class="lz-d">50 inserts · 96 delete batches · 20 inserts</span></div>
  <div class="lz-step"><span class="lz-k">Stop point</span><span class="lz-t">ts of the first delete entry</span><span class="lz-d">found by querying local.oplog.rs</span></div>
  <div class="lz-step"><span class="lz-k">Scratch server</span><span class="lz-t">restore 02:00 + replay with --oplogLimit</span><span class="lz-d">2,050 orders = one moment before 14:03</span></div>
  <div class="lz-step"><span class="lz-k">Copy back</span><span class="lz-t">only documents missing in production</span><span class="lz-d">953 inserted; the 20 later orders untouched</span></div>
</div>
${lenh(K, 30)}
${lenh(K, 31)}
${lenh(K, 32)}
<p>Step 1 — find the mistake in the oplog. In MongoDB 8.0 a large <code>deleteMany</code> is written as <em>batched</em> <code>applyOps</code> entries, 10 deletes each: 96 entries for 953 documents. The timestamp (<code>ts</code>) of the first entry is our stopping point.</p>
${lenh(K, 33)}
${lenh(K, 34)}
<p>Step 2 — cut the oplog from the moment the backup started until now (167 entries) into a separate file. Step 3 — on a <strong>scratch</strong> mongod, never production:</p>
${lenh(K, 35)}
${lenh(K, 36)}
${lenh(K, 37)}
${lenh(K, 38)}
<p>The 02:00 backup alone gives 2,000 orders. Replaying the oplog with <code>--oplogLimit</code> set to the delete's timestamp applies everything <em>strictly before</em> it ("applied 50 oplog entries" — the 50 orders after the backup) and stops: 2,050 orders, 953 PAID, none of the 20 written after the mistake. Step 4 — copy back to production <em>only what was lost</em>:</p>
${lenh(K, 39)}
${lenh(K, 40)}
<p>Production now has 2,070 orders and 973 PAID: the 953 recovered, the 20 written after the incident untouched. Total time on the lab: under a minute. On a real system the same four steps take longer, so practise them before you need them — the lab in Lesson 10.7 makes it harder, with orders <em>updated</em> after the delete.</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — the oplog window.</strong> Point-in-time recovery only works back to the oldest entry still in the oplog (Lesson 10.2 read about 5 hours on our lab, after the heavy loads of earlier chapters). Backups every 24 hours with a 5-hour oplog leave a 19-hour gap you cannot recover into. Either keep the oplog large enough, or archive the oplog continuously (what Atlas continuous backup and Percona Backup for MongoDB do).</p>
</div>
${lienKet({ cta: 'Open lesson', khoa: 'postgresql', bai: 'postgresql-15-2-wal-pitr', title: 'PostgreSQL course · 15.2 — WAL and point-in-time recovery', sub: 'the same recovery with WAL archiving and recovery_target_time' })}
${nguon('📘', 'MongoDB Docs — mongorestore', '--oplogReplay, --oplogLimit (applies entries older than the given timestamp), --nsFrom/--nsTo, --drop', 'https://www.mongodb.com/docs/database-tools/mongorestore/')}
${nguon('📘', 'MongoDB Docs — mongodump', '--oplog (full dumps of replica sets only), --archive, --gzip, --query', 'https://www.mongodb.com/docs/database-tools/mongodump/')}

<h3>🔥 A real incident: GitLab, 31 January 2017</h3>
<p>An engineer trying to fix replication ran <code>rm -rf</code> on the data directory of the <em>primary</em> PostgreSQL server instead of the secondary; about 300 GB were deleted before he stopped it. Then the team found out what their backups really were: the nightly <code>pg_dump</code> had been failing silently because it used version 9.2 binaries against a 9.6 database, and the failure emails were rejected by DMARC, so nobody saw them. They recovered from an LVM snapshot taken about 6 hours earlier for staging, by luck. Lost: roughly 6 hours of data — around 5,000 projects, 5,000 comments and 700 new user accounts. Every item in this lesson maps to that postmortem: test restores automatically, alert through a channel that works, know your recovery point.</p>
${nguon('📰', 'GitLab — Postmortem of database outage of January 31', 'the full timeline, why five backup methods failed, and the fixes', 'https://about.gitlab.com/blog/2017/02/10/postmortem-of-database-outage-of-january-31/')}

<h3>💼 On the job</h3>
<p>Two numbers every client will ask for: <strong>RPO</strong> (how much data may be lost — "at most 5 minutes") and <strong>RTO</strong> (how long until we're back — "within 1 hour"). Nightly mongodump gives an RPO of 24 hours; dump + oplog archiving gives minutes. When you join a project during OJT, a valuable first contribution is simply asking: "when was the last time someone restored a backup, and how long did it take?" — then automating the answer.</p>

<h3>🎤 What an interviewer will ask</h3>
<ol>
<li><strong>"We have a replica set — do we still need backups?"</strong> — Yes: replication copies mistakes too. Backups protect against people, bugs and ransomware; replicas against hardware.</li>
<li><strong>"How do you know your backup works?"</strong> — Restore it automatically into a scratch instance every night and compare counts and the exit code; alert on failure via a channel other than email.</li>
<li><strong>"What does --oplog do?"</strong> — Captures writes during the dump; --oplogReplay replays them so the backup is consistent at one point in time. Full dumps only.</li>
<li><strong>"Someone deleted orders at 14:03. Walk me through recovery."</strong> — Find the delete's ts in the oplog; restore the last backup to a scratch server; replay the oplog with --oplogLimit = that ts; copy only the missing documents back; postmortem.</li>
<li><strong>"Is a gzipped dump safe to keep in S3?"</strong> — gzip is not encryption; encrypt it, keep the key elsewhere, and restrict and log access to the bucket.</li>
</ol>

<h3>🧪 Practice (45 minutes)</h3>
<div class="callout ok"><ol>
<li>Run <code>sao-luu.sh</code>, then corrupt one byte in the middle of the archive (<code>printf '\\x00' | dd of=… bs=1 seek=50000 conv=notrunc</code>) and run <code>kiem-khoi-phuc.sh</code>. Caught?</li>
<li>Change <code>kiem-khoi-phuc.sh</code> so it also checks the list of databases: a database present at backup time but missing after restore is an error.</li>
<li>Repeat §6, but this time the mistake is <code>db.orders.updateMany({}, { $set: { status: 'CANCELLED' } })</code>. What do you copy back, and what must you be careful about?</li>
</ol>
${loiGiai('Suggested answers', `<p>1. Caught — measured: mongorestore stops with "cannot marshal type bson.Raw to a BSON Document: document end byte found before end of document" while reading <code>ctshop.orders</code> (it fails on the damaged BSON before gzip even reaches its end-of-stream checksum), and the script exits 1. If the damage happened to land where the data still parsed, the count check is the second line of defence.</p>
<p>2. The count file already lists <code>db.collection</code> keys; loop over them and fail if <code>db.getSiblingDB(d).getCollectionNames()</code> lacks the collection — plus compare <code>listDatabases</code> names with the ones in the count file.</p>
<p>3. Find the first <code>applyOps</code> with <code>op: 'u'</code> on orders; PITR to just before it on the scratch server; copy back the <code>status</code> of every order — but orders whose status was legitimately changed <em>after</em> the mistake (by the app) must keep the newer value: compare with the oplog after the mistake, or with <code>updatedAt</code>. This is exactly the difficulty of the Lesson 10.7 lab.</p>`)}
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['mongodump / mongorestore', 'Logical backup and restore through queries; indexes rebuilt from metadata.'],
  ['--oplog / --oplogReplay', 'Capture writes during a full dump / replay them for a consistent point-in-time copy.'],
  ['--oplogLimit <ts>', 'Replay only oplog entries before this timestamp — the stopping point of PITR.'],
  ['PITR', 'Point-in-time recovery: last backup + oplog replayed up to a chosen moment.'],
  ['fsyncLock', 'Flush and block writes so a filesystem snapshot is consistent.'],
  ['RPO / RTO', 'Maximum acceptable data loss / maximum time to recover.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>Replication is not backup. A backup counts only after an automatic restore test passed.</li>
<li>Use --oplog with full dumps; --drop only on scratch targets; check exit code and counts.</li>
<li>Compression is not encryption: encrypt archives and keep keys elsewhere.</li>
<li>PITR = backup + oplog up to the mistake on a scratch server, then copy back only what was lost.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1</span>
<h2>Sao lưu và khôi phục: mongodump, --oplog và khôi phục tới thời điểm</h2>
<p class="lead">Nhân bản (Chương 7) bảo vệ bạn khi một máy chủ chết. Nó không bảo vệ bạn khỏi con người: một lệnh <code>deleteMany</code> thiếu điều kiện được nhân bản sang mọi thành viên trong vài mili giây. Chỉ bản sao lưu mới đưa dữ liệu trở lại, và chỉ khi bạn thật sự khôi phục được nó, về đúng thời điểm. Bài này dựng một bản sao lưu mà bạn đã <em>chứng minh</em> là khôi phục được, rồi cứu một lần xoá nhầm mà không mất các đơn tới sau đó.</p>

<h3>Hình ảnh đời thường</h3>
<p>Bản sao lưu là tấm ảnh chụp căn phòng lúc 2 giờ sáng. Oplog là đoạn băng camera từ lúc đó tới giờ. Nếu ai đó ném laptop của bạn qua cửa sổ lúc 14:03, chỉ có tấm ảnh thì bạn lấy lại căn phòng như lúc 2 giờ sáng, mất hết mọi thứ đã làm sáng nay. Ảnh <em>cộng</em> băng, tua tới 14:02:59, cho bạn căn phòng đúng như một giây trước khi sai lầm xảy ra.</p>

<h3>1. mongodump và mongorestore</h3>
${lenh(K, 0)}
${lenh(K, 1)}
${lenh(K, 2)}
<p><code>mongodump</code> đọc tài liệu qua đường truy vấn bình thường, ghi mỗi collection thành một tệp <code>.bson</code>, kèm một tệp <code>.metadata.json</code> giữ định nghĩa index (ở đây là <code>customerId_1_createdAt_-1</code> từ Chương 4). Index không được chép, mà được <em>dựng lại</em> khi khôi phục. <code>bsondump</code> cho thấy các tệp là BSON dạng rõ: tên, email, số điện thoại, ai có tệp cũng đọc được (mục 4).</p>
${lenh(K, 3)}
${lenh(K, 4)}
${lenh(K, 5)}
${lenh(K, 6)}
<p>Khôi phục sang một database khác (<code>--nsFrom/--nsTo</code>) là cách an toàn để soi bản sao lưu mà không đụng production. Chạy lại cùng lệnh khôi phục lần hai mà không có <code>--drop</code> thì được "0 restored, 2260 failed". mongorestore chỉ <em>insert</em>, mọi <code>_id</code> đã tồn tại, vậy mà lệnh vẫn trông như đã chạy xong. Có <code>--drop</code> thì từng collection bị xoá trước. Mạnh và nguy hiểm: chạy nhầm đích là xoá sạch mọi thứ ghi sau lúc sao lưu.</p>

<h3>2. Tính nhất quán: --oplog và định dạng archive</h3>
${lenh(K, 7)}
${lenh(K, 8)}
<p>Dump một database đang bận cần thời gian, và các lần ghi vẫn tiếp tục tới trong lúc đó. Đơn hàng dump ở đầu và thanh toán dump ở cuối có thể không khớp nhau. <code>--oplog</code> chụp thêm các mục oplog ghi <em>trong lúc</em> dump, và <code>mongorestore --oplogReplay</code> phát lại chúng, nên kết quả là một bản chụp nhất quán tại một thời điểm. Nó chỉ chạy với bản dump cả máy (trên replica set), vì thế mới có lỗi khi đi chung <code>--db</code>. <code>--archive --gzip</code> dồn mọi thứ vào một tệp nén (thư mục 816 KB thành khoảng 90 KB), dễ đẩy thẳng lên kho đám mây.</p>
${lienKet({ khoa: 'postgresql', bai: 'postgresql-15-1-pg-dump', title: 'Khoá PostgreSQL · 15.1 — Sao lưu logic bằng pg_dump', sub: 'cùng ý tưởng trong PostgreSQL: mỗi lần dump là một bản chụp nhất quán' })}

<h3>3. Bản sao lưu chưa từng khôi phục thì coi như không có</h3>
${lenh(K, 9)}
${lenh(K, 10)}
<p>Script sao lưu ghi lại số tài liệu của từng collection <em>lúc sao lưu</em>, đặt cạnh tệp archive. Script kiểm làm đúng việc mà không ai làm bằng tay: dựng một mongod dùng một lần (<code>--network none</code>), khôi phục archive vào đó với <code>--oplogReplay</code>, rồi so số lượng.</p>
${lenh(K, 11)}
${lenh(K, 12)}
${lenh(K, 13)}
<p>Tệp bị cắt cụt (đầy đĩa, đứt mạng giữa lúc tải lên) và tệp rỗng đều bị bắt: mã thoát 1, nên cron hay CI phát được cảnh báo. Một chi tiết đo trên lab: từ tệp cắt cụt, mongorestore đã nạp vài trăm đơn <em>trước khi</em> báo lỗi. Một bước kiểm chỉ đếm "có dữ liệu là được" sẽ cho qua. Hãy nhìn mã thoát <strong>và</strong> số lượng.</p>
${lenh(K, 14)}
${lenh(K, 15)}
<p>Hỏng hay gặp nhất ngoài đời không phải tệp vỡ, mà là một script đúng từ hai năm trước. Cron cũ chỉ dump <code>--db ctshop</code>; từ đó tới giờ, một lập trình viên đã thêm database <code>ctshop_anh</code>. Tệp archive hợp lệ, dung lượng trông bình thường, nhưng không có oplog và không chứa database mới. Chỉ bước kiểm khôi phục tự động mới bắt được chuyện này, ngay đêm đầu tiên sau thay đổi.</p>
${ma('bash', CRON)}

<h3>4. gzip không phải mã hoá</h3>
${lenh(K, 16)}
${lenh(K, 17)}
${lenh(K, 18)}
${lenh(K, 19)}
${lenh(K, 20)}
${lenh(K, 21)}
<p>Archive không nén để lộ email khách chỉ với một lệnh <code>grep</code>. Bản gzip ra 0 kết quả, nhưng điều đó chẳng chứng minh gì: <code>gunzip</code> đâu cần khoá. Hãy mã hoá archive (ở đây dùng <code>openssl enc -aes-256-cbc -pbkdf2</code>; công cụ như <code>age</code> hay KMS đám mây cũng được). Đúng khoá thì đọc lại được; sai khoá thì hỏng với mã thoát 1. Cất khoá trong kho bí mật, <strong>không bao giờ để cạnh bản sao lưu</strong>. Và đưa bước "khôi phục cần khoá" vào bài kiểm khôi phục, nếu không bạn sẽ phát hiện vào đúng ngày tệ nhất rằng chẳng ai giữ khoá.</p>

<h3>5. Snapshot: nhanh cho dữ liệu lớn</h3>
${lenh(K, 22)}
${lenh(K, 23)}
${lenh(K, 24)}
<p>Với hàng trăm GB, mongodump chụp chậm và khôi phục còn chậm hơn (mọi index phải dựng lại). Cách khác là snapshot hệ thống tệp hoặc ổ đĩa (LVM, EBS, ZFS). <code>db.fsyncLock()</code> đẩy hết dữ liệu xuống đĩa và chặn ghi, để các tệp trên đĩa nhất quán; ở đây một lệnh insert phải chờ khoảng 4 giây cho tới khi <code>fsyncUnlock()</code>. Bản chép thư mục dữ liệu khởi động thành một mongod mới với đủ 2.000 đơn, và không có đơn 9999, đơn bị chặn trong lúc chép. Trên replica set, bạn chụp snapshot ở một secondary (hoặc một thành viên hidden, Bài 7.3) để primary không bao giờ phải dừng. Nếu journal nằm cùng ổ đĩa, snapshot đám mây vẫn nhất quán kể cả không khoá.</p>
${nguon('📘', 'MongoDB Docs — Backup Methods', 'mongodump, snapshot hệ thống tệp, fsyncLock, sao lưu đám mây của Atlas', 'https://www.mongodb.com/docs/manual/core/backups/')}

<h3>6. Lần xoá nhầm lúc 14:03: khôi phục tới thời điểm</h3>
${lenh(K, 25)}
${lenh(K, 26)}
${lenh(K, 27)}
${lenh(K, 28)}
${lenh(K, 29)}
<p>Kịch bản của mọi khoá vận hành: một bản sao lưu cả máy có <code>--oplog</code> lúc "02:00"; 50 đơn tới; một người định xoá một đơn thử nghiệm nhưng lại chạy <code>deleteMany({ status: 'PAID' })</code>, mất 953 đơn đã thanh toán; cửa hàng vẫn tiếp tục bán (20 đơn mới); khách gọi tổng đài. Đè bản 02:00 lên production sẽ trả lại 953 đơn nhưng <em>xoá 70 đơn ghi sau đó</em>. Ta cần trạng thái ngay một khoảnh khắc trước lệnh xoá.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Bản 02:00</span><span class="lz-t">mongodump --oplog (cả máy)</span><span class="lz-d">bản chụp nhất quán: 2.000 đơn</span></div>
  <div class="lz-step"><span class="lz-k">Oplog</span><span class="lz-t">mọi lần ghi từ 02:00, đúng thứ tự</span><span class="lz-d">50 insert · 96 lô xoá · 20 insert</span></div>
  <div class="lz-step"><span class="lz-k">Điểm dừng</span><span class="lz-t">ts của mục xoá đầu tiên</span><span class="lz-d">tìm bằng truy vấn local.oplog.rs</span></div>
  <div class="lz-step"><span class="lz-k">Máy nháp</span><span class="lz-t">khôi phục bản 02:00 + phát lại với --oplogLimit</span><span class="lz-d">2.050 đơn = một khoảnh khắc trước 14:03</span></div>
  <div class="lz-step"><span class="lz-k">Chép về</span><span class="lz-t">chỉ những tài liệu production đang thiếu</span><span class="lz-d">insert 953 đơn; 20 đơn sau đó còn nguyên</span></div>
</div>
${lenh(K, 30)}
${lenh(K, 31)}
${lenh(K, 32)}
<p>Bước 1: tìm sai lầm trong oplog. Ở MongoDB 8.0, một lệnh <code>deleteMany</code> lớn được ghi thành các mục <code>applyOps</code> <em>gom lô</em>, mỗi mục 10 thao tác xoá: 96 mục cho 953 tài liệu. Dấu thời gian (<code>ts</code>) của mục đầu tiên là điểm dừng của ta.</p>
${lenh(K, 33)}
${lenh(K, 34)}
<p>Bước 2: cắt oplog từ lúc bắt đầu sao lưu tới giờ (167 mục) ra một tệp riêng. Bước 3: làm trên một mongod <strong>nháp</strong>, không bao giờ trên production:</p>
${lenh(K, 35)}
${lenh(K, 36)}
${lenh(K, 37)}
${lenh(K, 38)}
<p>Chỉ bản 02:00 thì có 2.000 đơn. Phát lại oplog với <code>--oplogLimit</code> đặt bằng ts của lệnh xoá sẽ áp dụng mọi thứ <em>trước</em> nó ("applied 50 oplog entries", chính là 50 đơn sau lúc sao lưu) rồi dừng: 2.050 đơn, 953 PAID, không có đơn nào trong 20 đơn ghi sau sai lầm. Bước 4: chép về production <em>chỉ những gì đã mất</em>:</p>
${lenh(K, 39)}
${lenh(K, 40)}
<p>Production giờ có 2.070 đơn và 973 PAID: 953 đơn được cứu, 20 đơn ghi sau sự cố còn nguyên. Tổng thời gian trên lab chưa tới một phút. Trên hệ thật, cùng bốn bước đó lâu hơn, nên hãy tập trước khi cần tới. Lab ở Bài 10.7 làm khó hơn: có những đơn được <em>sửa</em> sau lệnh xoá.</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — cửa sổ oplog.</strong> Khôi phục tới thời điểm chỉ lùi được tới mục cũ nhất còn trong oplog (Bài 10.2 đọc được khoảng 5 giờ trên lab của ta, sau các đợt tải nặng ở những chương trước). Sao lưu 24 giờ một lần mà oplog chỉ giữ 5 giờ thì để lại khoảng trống 19 giờ không thể khôi phục vào. Hoặc giữ oplog đủ lớn, hoặc lưu trữ oplog liên tục (việc mà sao lưu liên tục của Atlas và Percona Backup for MongoDB làm).</p>
</div>
${lienKet({ khoa: 'postgresql', bai: 'postgresql-15-2-wal-pitr', title: 'Khoá PostgreSQL · 15.2 — WAL và khôi phục theo thời điểm', sub: 'cùng cách cứu đó với lưu trữ WAL và recovery_target_time' })}
${nguon('📘', 'MongoDB Docs — mongorestore', '--oplogReplay, --oplogLimit (áp dụng các mục cũ hơn mốc thời gian), --nsFrom/--nsTo, --drop', 'https://www.mongodb.com/docs/database-tools/mongorestore/')}
${nguon('📘', 'MongoDB Docs — mongodump', '--oplog (chỉ bản dump cả máy của replica set), --archive, --gzip, --query', 'https://www.mongodb.com/docs/database-tools/mongodump/')}

<h3>🔥 Sự cố thật: GitLab, 31/01/2017</h3>
<p>Một kỹ sư đang sửa lỗi nhân bản đã chạy <code>rm -rf</code> lên thư mục dữ liệu của máy PostgreSQL <em>primary</em> thay vì máy secondary; khoảng 300 GB bị xoá trước khi anh dừng lại. Rồi cả nhóm mới biết bản sao lưu của mình thực ra là gì. Lệnh <code>pg_dump</code> hằng đêm đã hỏng lặng lẽ, vì dùng binary bản 9.2 với database 9.6. Email báo lỗi thì bị DMARC từ chối, nên không ai thấy. Họ khôi phục được nhờ một snapshot LVM chụp khoảng 6 giờ trước cho môi trường staging, hoàn toàn do may. Mất khoảng 6 giờ dữ liệu: chừng 5.000 project, 5.000 bình luận và 700 tài khoản mới. Mọi mục trong bài này đều khớp với bản postmortem đó: thử khôi phục tự động, cảnh báo qua kênh thật sự hoạt động, biết rõ điểm khôi phục của mình.</p>
${nguon('📰', 'GitLab — Postmortem of database outage of January 31', 'toàn bộ diễn biến, vì sao năm cách sao lưu đều hỏng, và cách họ sửa', 'https://about.gitlab.com/blog/2017/02/10/postmortem-of-database-outage-of-january-31/')}

<h3>💼 Đi làm</h3>
<p>Hai con số khách hàng nào cũng hỏi: <strong>RPO</strong> (được phép mất bao nhiêu dữ liệu, ví dụ "tối đa 5 phút") và <strong>RTO</strong> (bao lâu thì chạy lại, ví dụ "trong vòng 1 giờ"). mongodump hằng đêm cho RPO 24 giờ; dump cộng lưu trữ oplog cho RPO vài phút. Khi vào một dự án lúc OJT, một đóng góp đầu tiên rất giá trị là chỉ cần hỏi: "lần cuối có người khôi phục bản sao lưu là khi nào, và mất bao lâu?", rồi tự động hoá câu trả lời đó.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Chúng tôi có replica set rồi, còn cần sao lưu không?"</strong> — Có: nhân bản chép luôn cả sai lầm. Sao lưu chống con người, lỗi phần mềm và ransomware; bản sao chống hỏng phần cứng.</li>
<li><strong>"Làm sao biết bản sao lưu dùng được?"</strong> — Tự động khôi phục vào máy nháp mỗi đêm, so số lượng và mã thoát; cảnh báo khi hỏng qua một kênh khác email.</li>
<li><strong>"--oplog để làm gì?"</strong> — Chụp các lần ghi trong lúc dump; --oplogReplay phát lại để bản sao lưu nhất quán tại một thời điểm. Chỉ cho bản dump cả máy.</li>
<li><strong>"Ai đó xoá đơn lúc 14:03. Bạn khôi phục thế nào?"</strong> — Tìm ts của lệnh xoá trong oplog; khôi phục bản sao lưu gần nhất lên máy nháp; phát lại oplog với --oplogLimit = ts đó; chỉ chép phần thiếu về; viết postmortem.</li>
<li><strong>"Dump đã gzip để trên S3 có an toàn không?"</strong> — gzip không phải mã hoá; hãy mã hoá, để khoá ở nơi khác, giới hạn và ghi log truy cập bucket.</li>
</ol>

<h3>🧪 Thực hành (45 phút)</h3>
<div class="callout ok"><ol>
<li>Chạy <code>sao-luu.sh</code>, rồi làm hỏng một byte ở giữa archive (<code>printf '\\x00' | dd of=… bs=1 seek=50000 conv=notrunc</code>) và chạy <code>kiem-khoi-phuc.sh</code>. Có bắt được không?</li>
<li>Sửa <code>kiem-khoi-phuc.sh</code> để kiểm cả danh sách database: database có lúc sao lưu mà mất sau khi khôi phục là lỗi.</li>
<li>Làm lại mục 6, nhưng lần này sai lầm là <code>db.orders.updateMany({}, { $set: { status: 'CANCELLED' } })</code>. Bạn chép lại cái gì, và phải cẩn thận điều gì?</li>
</ol>
${loiGiai('Gợi ý đáp án', `<p>1. Bắt được, đo thật: mongorestore dừng với "cannot marshal type bson.Raw to a BSON Document: document end byte found before end of document" khi đọc <code>ctshop.orders</code> (nó hỏng ngay ở BSON bị phá, trước khi gzip kịp tới mã kiểm cuối luồng), và script thoát mã 1. Nếu chỗ hỏng tình cờ rơi vào nơi dữ liệu vẫn đọc được, bước đếm số lượng là lớp phòng thủ thứ hai.</p>
<p>2. Tệp đếm đã liệt kê khoá <code>db.collection</code>; lặp qua chúng và báo lỗi nếu <code>db.getSiblingDB(d).getCollectionNames()</code> thiếu collection đó, cộng thêm so tên trong <code>listDatabases</code> với tên trong tệp đếm.</p>
<p>3. Tìm <code>applyOps</code> đầu tiên có <code>op: 'u'</code> trên orders; PITR tới ngay trước nó trên máy nháp; chép lại <code>status</code> của từng đơn. Nhưng các đơn đã được ứng dụng đổi trạng thái hợp lệ <em>sau</em> sai lầm phải giữ giá trị mới hơn: so với oplog sau sai lầm, hoặc với <code>updatedAt</code>. Đây đúng là chỗ khó của lab Bài 10.7.</p>`)}
</div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['mongodump / mongorestore', 'Sao lưu và khôi phục logic qua truy vấn; index dựng lại từ metadata.'],
  ['--oplog / --oplogReplay', 'Chụp các lần ghi trong lúc dump cả máy / phát lại chúng để có bản chép nhất quán tại một thời điểm.'],
  ['--oplogLimit <ts>', 'Chỉ phát lại các mục oplog trước mốc này — điểm dừng của PITR.'],
  ['PITR', 'Khôi phục tới thời điểm: bản sao lưu gần nhất + oplog phát lại tới một khoảnh khắc chọn trước.'],
  ['fsyncLock', 'Đẩy dữ liệu xuống đĩa và chặn ghi để snapshot hệ thống tệp nhất quán.'],
  ['RPO / RTO', 'Lượng dữ liệu tối đa được phép mất / thời gian tối đa để khôi phục.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Nhân bản không phải sao lưu. Bản sao lưu chỉ được tính khi đã qua bài kiểm khôi phục tự động.</li>
<li>Dùng --oplog với bản dump cả máy; --drop chỉ trên đích nháp; kiểm mã thoát và số lượng.</li>
<li>Nén không phải mã hoá: mã hoá archive, để khoá ở nơi khác.</li>
<li>PITR = bản sao lưu + oplog tới ngay trước sai lầm trên máy nháp, rồi chỉ chép về phần đã mất.</li>
</ul>
</div>
`,
};
