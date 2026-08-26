/**
 * PostgreSQL — Chương 15: Sao lưu, nhân bản & mở rộng (Giai đoạn 4 — Trên production).
 * pg_dump ba định dạng đo thật (plain 23.383 B vs custom 7.930 B, ~3×) · pg_restore ·
 * WAL 16MB/segment, LSN · pg_basebackup dựng BẢN SAO THẬT 188.772 kB rồi chạy ở cổng
 * 5434: pg_is_in_recovery()=t, ghi vào primary hiện ở bản sao, ghi vào bản sao báo
 * "cannot execute INSERT in a read-only transaction", pg_stat_replication byte_tre=0 ·
 * phân mảnh: pruning chỉ đọc 1 mảnh, DROP mảnh 3,5 ms so với DELETE 67,8 ms (19×)
 * và DELETE để lại 100.019 dead tuple còn DROP thì không.
 * Output CHẠY THẬT trên PostgreSQL 16.13, hai cụm thật (5433 primary, 5434 replica).
 * LUẬT: < > trong code/out → &lt; &gt;; & → &amp;; backtick → &#96;; ${ → \${.
 * Khối .out LUÔN đóng </div> (KHÔNG </code></pre>).
 */
const REF = '?ref=%2Fcourses%2Fpostgresql%2Flearn&reflabel=PostgreSQL';

export default {
  title: 'Chapter 15 — Backup, replication & scaling|||Chương 15 — Sao lưu, nhân bản & mở rộng',
  description: 'Ba câu hỏi mà mọi cơ sở dữ liệu production đều phải trả lời được: khôi phục được không, chịu nổi mất một máy không, và lớn hơn một máy thì làm sao. pg_dump và giới hạn của nó, WAL và khôi phục theo thời điểm, một bản sao streaming dựng thật, và phân mảnh.',
  lessons: [
    /* ─────────────────────────── 15.1 ─────────────────────────── */
    {
      title: '15.1 — Logical backups with pg_dump|||15.1 — Sao lưu logic bằng pg_dump',
      slug: 'postgresql-15-1-pg-dump',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Ba định dạng dump và vì sao "custom" gần như luôn đúng (đo thật: nhỏ hơn 3 lần và khôi phục được từng phần), pg_restore, và sự thật khó chịu — một bản dump chỉ là ảnh chụp một THỜI ĐIỂM, nên nó KHÔNG đủ làm chiến lược sao lưu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.1 · Phase 4 — In production</span>
<h2>The backup you can read</h2>
<p class="lead">There are two families of PostgreSQL backup and they solve different problems. A <strong>logical</strong> backup describes the data as SQL — portable, selective, version-flexible. A <strong>physical</strong> backup copies the files — fast, exact, and the only route to point-in-time recovery (lesson 15.2). This lesson is the logical one, and its most important content is where it stops being enough.</p>

<h3>Three formats, measured</h3>
<pre><code>pg_dump -d ch15 -f plain.sql            <span class="tok-comment"># SQL thuần</span>
pg_dump -d ch15 -Fc -f custom.dump      <span class="tok-comment"># custom, nén</span>
pg_dump -d ch15 -Fd -j 2 -f dir/        <span class="tok-comment"># thư mục, dump song song</span></code></pre>
<div class="out">-rw-r--r-- 1  23383  plain.sql
-rw-r--r-- 1   7930  custom.dump
drwx------ 2   4096  dir/</div>
<p>Same data, and the custom format is roughly <strong>3× smaller</strong> because it compresses. Size is the least of its advantages:</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>plain</code> (mặc định)</span><span class="lz-lnote">A text file of <code>CREATE</code> and <code>COPY</code> statements. Readable, diffable, and restored with <code>psql</code>. All or nothing — you cannot restore one table without editing the file.</span></div>
<div class="lz-layer"><span class="lz-lname"><code>custom</code> (<code>-Fc</code>)</span><span class="lz-lnote">Compressed, and it carries a <strong>table of contents</strong>. <code>pg_restore</code> can list what is inside, restore a single table, restore data without indexes, or reorder. <strong>The default you should use.</strong></span></div>
<div class="lz-layer"><span class="lz-lname"><code>directory</code> (<code>-Fd</code>)</span><span class="lz-lnote">One file per table in a directory. The only format that supports <code>-j</code> parallel dump, so it is what you want for a large database. Restores in parallel too.</span></div>
</div>

<h3>Restoring</h3>
<pre><code>createdb ch15_restore
pg_restore -d ch15_restore custom.dump</code></pre>
<div class="out"> so_dong_khoi_phuc
-------------------
              1000
(1 row)</div>
<p>1,000 rows — exactly what the table held <em>when the dump was taken</em>. A row inserted after that moment is not there, and that is not a bug; it is the defining property of this kind of backup, and the reason lesson 15.2 exists.</p>
<p>Useful <code>pg_restore</code> flags, all of which need the <code>custom</code> or <code>directory</code> format:</p>
<pre><code>pg_restore -l custom.dump                    <span class="tok-comment"># liệt kê mục lục</span>
pg_restore -d db -t note custom.dump         <span class="tok-comment"># chỉ MỘT bảng</span>
pg_restore -d db -j 4 custom.dump            <span class="tok-comment"># khôi phục song song</span>
pg_restore -d db --data-only custom.dump     <span class="tok-comment"># chỉ dữ liệu</span></code></pre>

<h3>What pg_dump is genuinely good at</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Moving between versions</span><span class="lz-d">A dump from PostgreSQL 15 restores into 16. Physical backups cannot cross major versions — this is how upgrades are done.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Copying production to a laptop</span><span class="lz-d">One table, one schema, or the whole database, into a completely different environment.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">A pre-migration safety net</span><span class="lz-d">Dump the tables a migration touches, immediately before running it. Small, fast, and precisely targeted at what you are about to change.</span></div>
</div>

<h3>And where it stops</h3>
<p>Run <code>pg_dump</code> nightly at 02:00 and you have accepted, in advance, that a failure at 01:59 loses <strong>23 hours and 59 minutes</strong> of data. That may be fine for a hobby project. It is not fine for anything with users, and no amount of dumping more often fixes it — dumping is a full read of the database, so "more often" costs load, and it still leaves a window.</p>
<div class="callout warn"><code>pg_dump</code> takes a consistent snapshot using the MVCC machinery from Chapter 11, so it does not block writers. But that means it holds an <strong>open transaction</strong> for its whole run — which, per 11.1 and 14.3, pins a snapshot and blocks <code>VACUUM</code> across the database. A multi-hour dump of a large database on a busy server is a real cause of bloat. Take it from a replica (15.3) instead.</div>
<div class="pitfall"><p><strong>Trap — a backup you have never restored is not a backup, it is a file.</strong> The failure modes are mundane and all of them are silent: the cron job has been writing zero-byte files since a password changed; the dump excludes a schema someone added; the disk it writes to is the same disk as the database, so both are lost together; the restore fails because an extension is missing on the target. Every one of these is discovered at the worst possible moment unless you rehearse. <strong>Schedule a restore, not just a dump</strong> — restore into a scratch database on a timer, run a row count against the real one, and alarm when they diverge. Also check the exit status: <code>pg_dump</code> returns non-zero on failure, and <code>pg_dump … &gt; file.sql</code> in a shell script happily creates a truncated file while reporting nothing to anyone.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: dump in all three formats, then restore a single table</span><span class="lc-sub">The Code Lab track reproduces the size comparison and the restore.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.1 · Giai đoạn 4 — Trên production</span>
<h2>Bản sao lưu mà bạn ĐỌC ĐƯỢC</h2>
<p class="lead">PostgreSQL có hai HỌ sao lưu và chúng giải hai bài toán khác nhau. Sao lưu <strong>LOGIC</strong> mô tả dữ liệu dưới dạng SQL — khả chuyển, chọn lọc được, linh hoạt giữa các phiên bản. Sao lưu <strong>VẬT LÝ</strong> chép chính các file — nhanh, chính xác, và là con đường DUY NHẤT tới khôi phục theo thời điểm (bài 15.2). Bài này nói về loại logic, và phần quan trọng nhất của nó là chỗ nó THÔI đủ.</p>

<h3>Ba định dạng, đo thật</h3>
<pre><code>pg_dump -d ch15 -f plain.sql            <span class="tok-comment"># SQL thuần</span>
pg_dump -d ch15 -Fc -f custom.dump      <span class="tok-comment"># custom, nén</span>
pg_dump -d ch15 -Fd -j 2 -f dir/        <span class="tok-comment"># thư mục, dump song song</span></code></pre>
<div class="out">-rw-r--r-- 1  23383  plain.sql
-rw-r--r-- 1   7930  custom.dump
drwx------ 2   4096  dir/</div>
<p>Cùng dữ liệu, và định dạng custom nhỏ hơn khoảng <strong>3 lần</strong> vì nó nén. Kích thước lại là ưu điểm KÉM quan trọng nhất của nó:</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>plain</code> (mặc định)</span><span class="lz-lnote">Một file văn bản gồm các câu <code>CREATE</code> và <code>COPY</code>. Đọc được, so diff được, và khôi phục bằng <code>psql</code>. Được ăn cả ngã về không — bạn không khôi phục nổi MỘT bảng mà không sửa file.</span></div>
<div class="lz-layer"><span class="lz-lname"><code>custom</code> (<code>-Fc</code>)</span><span class="lz-lnote">Nén, và nó mang theo một <strong>MỤC LỤC</strong>. <code>pg_restore</code> có thể liệt kê bên trong có gì, khôi phục một bảng đơn lẻ, khôi phục dữ liệu mà không kèm chỉ mục, hoặc đổi thứ tự. <strong>Đây là mặc định bạn nên dùng.</strong></span></div>
<div class="lz-layer"><span class="lz-lname"><code>directory</code> (<code>-Fd</code>)</span><span class="lz-lnote">Mỗi bảng một file trong một thư mục. Là định dạng DUY NHẤT hỗ trợ dump song song <code>-j</code>, nên đó là thứ bạn muốn cho cơ sở dữ liệu lớn. Khôi phục cũng song song được.</span></div>
</div>

<h3>Khôi phục</h3>
<pre><code>createdb ch15_restore
pg_restore -d ch15_restore custom.dump</code></pre>
<div class="out"> so_dong_khoi_phuc
-------------------
              1000
(1 row)</div>
<p>1.000 dòng — đúng bằng số bảng đang giữ <em>VÀO LÚC bản dump được lấy</em>. Một dòng chèn sau khoảnh khắc đó thì KHÔNG có ở đây, và đó không phải bug; đó là tính chất định nghĩa của loại sao lưu này, và là lý do bài 15.2 tồn tại.</p>
<p>Các cờ <code>pg_restore</code> hữu ích, tất cả đều cần định dạng <code>custom</code> hoặc <code>directory</code>:</p>
<pre><code>pg_restore -l custom.dump                    <span class="tok-comment"># liệt kê mục lục</span>
pg_restore -d db -t note custom.dump         <span class="tok-comment"># chỉ MỘT bảng</span>
pg_restore -d db -j 4 custom.dump            <span class="tok-comment"># khôi phục song song</span>
pg_restore -d db --data-only custom.dump     <span class="tok-comment"># chỉ dữ liệu</span></code></pre>

<h3>pg_dump THẬT SỰ giỏi ở đâu</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Di chuyển giữa các phiên bản</span><span class="lz-d">Một bản dump từ PostgreSQL 15 khôi phục được vào 16. Sao lưu vật lý KHÔNG vượt được ranh giới phiên bản lớn — đây chính là cách người ta nâng cấp.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Chép production về laptop</span><span class="lz-d">Một bảng, một schema, hay cả cơ sở dữ liệu, sang một môi trường hoàn toàn khác.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Lưới an toàn trước migration</span><span class="lz-d">Dump những bảng mà migration sẽ chạm vào, NGAY TRƯỚC khi chạy nó. Nhỏ, nhanh, và nhắm chính xác vào thứ bạn sắp thay đổi.</span></div>
</div>

<h3>Và chỗ nó DỪNG LẠI</h3>
<p>Chạy <code>pg_dump</code> mỗi đêm lúc 02:00 nghĩa là bạn đã CHẤP NHẬN TRƯỚC rằng một sự cố lúc 01:59 làm mất <strong>23 giờ 59 phút</strong> dữ liệu. Với một dự án nghiệp dư thì có thể ổn. Với bất cứ thứ gì có người dùng thì không, và dump dày hơn cũng không sửa được — dump là một lượt ĐỌC TOÀN BỘ cơ sở dữ liệu, nên "dày hơn" tốn tải, mà vẫn còn cửa sổ mất mát.</p>
<div class="callout warn"><code>pg_dump</code> lấy một ảnh chụp nhất quán bằng chính bộ máy MVCC ở Chương 11, nên nó KHÔNG chặn người ghi. Nhưng điều đó nghĩa là nó giữ một <strong>GIAO DỊCH MỞ</strong> suốt cả lượt chạy — mà theo 11.1 và 14.3, cái đó ghim một ảnh chụp và chặn <code>VACUUM</code> trên TOÀN BỘ cơ sở dữ liệu. Một lượt dump kéo dài nhiều giờ trên một máy chủ bận là một nguyên nhân gây bloat có thật. Hãy lấy dump từ một BẢN SAO (15.3) thay vì từ primary.</div>
<div class="pitfall"><p><strong>Bẫy — một bản sao lưu bạn CHƯA BAO GIỜ khôi phục thì không phải bản sao lưu, nó là một cái file.</strong> Các kiểu hỏng đều tầm thường và đều ÂM THẦM: cái job cron vẫn ghi ra file 0 byte kể từ lần đổi mật khẩu; bản dump bỏ sót một schema ai đó mới thêm; cái đĩa nó ghi vào chính là cái đĩa chứa cơ sở dữ liệu, nên mất là mất cả hai; lượt khôi phục hỏng vì máy đích thiếu một extension. Mỗi cái trong số đó chỉ bị phát hiện vào đúng thời điểm tệ nhất, trừ khi bạn có DIỄN TẬP. <strong>Hãy lên lịch cho một lượt KHÔI PHỤC, chứ không chỉ một lượt dump</strong> — khôi phục vào một cơ sở dữ liệu nháp theo định kỳ, đếm số dòng rồi đối chiếu với bản thật, và báo động khi chúng lệch nhau. Cũng hãy kiểm mã thoát: <code>pg_dump</code> trả về khác 0 khi hỏng, còn <code>pg_dump … &gt; file.sql</code> trong một script shell thì vui vẻ tạo ra một file CỤT mà không báo cho ai cả.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: dump cả ba định dạng, rồi khôi phục đúng MỘT bảng</span><span class="lc-sub">Nhánh Code Lab tái hiện phép so kích thước và lượt khôi phục.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 15.2 ─────────────────────────── */
    {
      title: '15.2 — WAL and point-in-time recovery|||15.2 — WAL và khôi phục theo thời điểm',
      slug: 'postgresql-15-2-wal-pitr',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Write-Ahead Log là thứ làm cho chữ D trong ACID thành sự thật, và cũng là thứ cho phép khôi phục về ĐÚNG một giây trước lệnh DROP TABLE. LSN, segment 16MB, archive_mode, và vì sao một replication slot bị bỏ quên có thể làm đầy đĩa rồi giết cả máy chủ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.2 · Phase 4 — In production</span>
<h2>The log that everything else is built on</h2>
<p class="lead">Before PostgreSQL changes a data page, it writes a record describing the change to the <strong>Write-Ahead Log</strong> and flushes that to disk. Only then may the page itself be modified, and the page can be written back lazily. That ordering — log first, data later — is what makes <code>COMMIT</code> mean something after a power cut, and it is also the raw material for replication and point-in-time recovery.</p>

<h3>Look at it</h3>
<pre><code><span class="tok-keyword">SHOW</span> wal_level;
<span class="tok-keyword">SHOW</span> wal_segment_size;
<span class="tok-keyword">SELECT</span> pg_current_wal_lsn();</code></pre>
<div class="out"> wal_level | wal_segment_size | pg_current_wal_lsn
-----------+------------------+--------------------
 replica   | 16MB             | 0/13663740</div>
<p>WAL lives in <code>pg_wal/</code> as fixed 16 MB files with 24-hex-character names:</p>
<div class="out">00000001000000000000000F
000000010000000000000010
000000010000000000000011
… tổng 6 file × 16MB</div>
<p>The <strong>LSN</strong> (Log Sequence Number) <code>0/13663740</code> is a byte position in that stream. Every change has one, every replica reports how far it has replayed as one (15.3), and every recovery target is expressed as one. It is the clock the whole system runs on.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>wal_level = minimal</code></span><span class="lz-lnote">Only enough to survive a crash. No replication, no PITR. Rarely worth it.</span></div>
<div class="lz-layer"><span class="lz-lname"><code>wal_level = replica</code></span><span class="lz-lnote">The default. Enough for streaming replication and archive-based PITR. What you want.</span></div>
<div class="lz-layer"><span class="lz-lname"><code>wal_level = logical</code></span><span class="lz-lnote">Adds enough detail for logical replication and change-data-capture. Slightly more WAL volume.</span></div>
</div>

<h3>Archiving: keeping WAL past its own lifetime</h3>
<p>By default PostgreSQL recycles WAL files once they are no longer needed for crash recovery. To recover to an arbitrary past moment, you must keep them:</p>
<pre><code><span class="tok-comment"># postgresql.conf</span>
archive_mode = on
archive_command = <span class="tok-string">'test ! -f /mnt/wal/%f &amp;&amp; cp %p /mnt/wal/%f'</span></code></pre>
<p><code>%p</code> is the file's path, <code>%f</code> its name. The command must return non-zero if it fails — PostgreSQL keeps the segment and retries, which is exactly right, and also exactly how a broken archive command fills your disk.</p>

<h3>What PITR actually is</h3>
<p>Point-in-time recovery is two ingredients combined:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">A base backup</span><span class="lz-d">A physical copy of the data directory, taken with <code>pg_basebackup</code> (15.3). This is the starting state.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Every WAL segment since</span><span class="lz-d">Replaying them moves the cluster forward, change by change, from the base backup to any moment you choose.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">A recovery target</span><span class="lz-d"><code>recovery_target_time = '2026-08-26 10:44:59'</code> in <code>postgresql.conf</code>, plus a <code>recovery.signal</code> file. PostgreSQL replays up to that instant and stops. Targets can also be an LSN, a transaction ID, or a named restore point.</span></div>
</div>
<div class="callout ok">This is the answer to the disaster that a nightly dump cannot address. Someone runs <code>DELETE FROM users</code> without a <code>WHERE</code> at 14:32. With PITR you restore the base backup and replay WAL to 14:31:59 — losing 60 seconds instead of a day. Note what you must know: <em>when</em>. Check the logs before choosing a target, and if you are unsure, target slightly early and inspect.</div>

<h3>In practice, use a tool</h3>
<p>Hand-rolling <code>archive_command</code>, retention, and base-backup rotation is possible and is how people learn it. Running it for years is a different matter — <strong>pgBackRest</strong> and <strong>WAL-G</strong> handle compression, parallelism, encryption, retention policies, S3/R2 targets and, crucially, <em>verification</em>. On a small VPS like the one this site runs on, WAL-G to object storage is a reasonable Sunday afternoon and turns a 24-hour worst case into a 5-minute one.</p>
<div class="pitfall"><p><strong>Trap — an abandoned replication slot filling the disk until the server dies.</strong> A slot (15.3) guarantees the primary keeps every WAL segment its consumer has not yet confirmed. That guarantee is unconditional: if the replica is switched off, or a logical-decoding consumer is decommissioned and its slot left behind, WAL accumulates <em>forever</em>. The disk fills, and when a database cannot write WAL it cannot commit anything — a total outage from a component nobody was using. It also blocks <code>VACUUM</code>, so wraparound (14.3) becomes a second countdown running in parallel. Two defences: set <code>max_slot_wal_keep_size</code> so PostgreSQL will sacrifice a lagging slot rather than itself, and put <code>SELECT slot_name, active, pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)) FROM pg_replication_slots;</code> on a dashboard. A slot with <code>active = f</code> and a growing size is an incident that has not started yet.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: read your own LSN advance as you write rows</span><span class="lc-sub">The Code Lab track walks an archive_command setup end to end.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.2 · Giai đoạn 4 — Trên production</span>
<h2>Cuốn nhật ký mà mọi thứ khác dựng trên đó</h2>
<p class="lead">Trước khi PostgreSQL đổi một trang dữ liệu, nó ghi một bản ghi mô tả thay đổi đó vào <strong>Write-Ahead Log</strong> rồi ĐẨY XUỐNG ĐĨA. Chỉ sau đó trang dữ liệu mới được phép sửa, và trang đó có thể được ghi lại một cách thong thả. Chính cái THỨ TỰ ấy — log trước, dữ liệu sau — làm cho <code>COMMIT</code> có ý nghĩa sau một cú mất điện, và nó cũng là nguyên liệu thô cho nhân bản và khôi phục theo thời điểm.</p>

<h3>Nhìn nó</h3>
<pre><code><span class="tok-keyword">SHOW</span> wal_level;
<span class="tok-keyword">SHOW</span> wal_segment_size;
<span class="tok-keyword">SELECT</span> pg_current_wal_lsn();</code></pre>
<div class="out"> wal_level | wal_segment_size | pg_current_wal_lsn
-----------+------------------+--------------------
 replica   | 16MB             | 0/13663740</div>
<p>WAL nằm ở <code>pg_wal/</code> dưới dạng các file cố định 16 MB với tên gồm 24 ký tự hex:</p>
<div class="out">00000001000000000000000F
000000010000000000000010
000000010000000000000011
… tổng 6 file × 16MB</div>
<p><strong>LSN</strong> (Log Sequence Number) <code>0/13663740</code> là một VỊ TRÍ BYTE trong dòng đó. Mọi thay đổi đều có một cái, mọi bản sao đều báo cáo nó đã phát lại tới đâu bằng một cái (15.3), và mọi mục tiêu khôi phục đều diễn đạt bằng một cái. Nó là chiếc đồng hồ mà cả hệ thống chạy theo.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>wal_level = minimal</code></span><span class="lz-lnote">Chỉ đủ để sống sót qua một cú sập. Không nhân bản, không PITR. Hiếm khi đáng.</span></div>
<div class="lz-layer"><span class="lz-lname"><code>wal_level = replica</code></span><span class="lz-lnote">Mặc định. Đủ cho nhân bản streaming và PITR dựa trên lưu trữ. Là thứ bạn muốn.</span></div>
<div class="lz-layer"><span class="lz-lname"><code>wal_level = logical</code></span><span class="lz-lnote">Thêm đủ chi tiết cho nhân bản logic và bắt-thay-đổi-dữ-liệu. Lượng WAL nhiều hơn một chút.</span></div>
</div>

<h3>Lưu trữ: giữ WAL sống lâu hơn vòng đời của chính nó</h3>
<p>Mặc định PostgreSQL TÁI CHẾ các file WAL khi chúng không còn cần cho việc phục hồi sau sập. Để khôi phục về một khoảnh khắc bất kỳ trong quá khứ, bạn phải GIỮ chúng lại:</p>
<pre><code><span class="tok-comment"># postgresql.conf</span>
archive_mode = on
archive_command = <span class="tok-string">'test ! -f /mnt/wal/%f &amp;&amp; cp %p /mnt/wal/%f'</span></code></pre>
<p><code>%p</code> là đường dẫn của file, <code>%f</code> là tên nó. Lệnh này PHẢI trả về khác 0 khi hỏng — PostgreSQL sẽ giữ segment lại và thử lại, đó đúng là điều nên làm, và cũng đúng là cách một archive_command hỏng làm đầy đĩa của bạn.</p>

<h3>PITR thực chất là gì</h3>
<p>Khôi phục theo thời điểm là hai nguyên liệu ghép lại:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Một bản sao lưu nền</span><span class="lz-d">Một bản chép VẬT LÝ của thư mục dữ liệu, lấy bằng <code>pg_basebackup</code> (15.3). Đây là trạng thái xuất phát.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Mọi segment WAL kể từ đó</span><span class="lz-d">Phát lại chúng sẽ đẩy cụm tiến lên, từng thay đổi một, từ bản sao lưu nền tới bất kỳ khoảnh khắc nào bạn chọn.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Một mục tiêu khôi phục</span><span class="lz-d"><code>recovery_target_time = '2026-08-26 10:44:59'</code> trong <code>postgresql.conf</code>, kèm một file <code>recovery.signal</code>. PostgreSQL phát lại tới đúng khoảnh khắc đó rồi dừng. Mục tiêu cũng có thể là một LSN, một ID giao dịch, hoặc một điểm khôi phục đã đặt tên.</span></div>
</div>
<div class="callout ok">Đây là câu trả lời cho thảm hoạ mà một bản dump hằng đêm KHÔNG xử lý nổi. Có người chạy <code>DELETE FROM users</code> mà quên <code>WHERE</code> lúc 14:32. Với PITR bạn khôi phục bản sao lưu nền rồi phát lại WAL tới 14:31:59 — mất 60 GIÂY thay vì một NGÀY. Để ý thứ bạn buộc phải biết: <em>LÚC NÀO</em>. Hãy kiểm log trước khi chọn mục tiêu, và nếu chưa chắc thì nhắm sớm hơn một chút rồi kiểm tra.</div>

<h3>Trong thực tế, hãy dùng công cụ</h3>
<p>Tự tay dựng <code>archive_command</code>, chính sách lưu giữ và vòng xoay sao lưu nền là việc LÀM ĐƯỢC, và đó là cách người ta học nó. Vận hành nó suốt nhiều năm lại là chuyện khác — <strong>pgBackRest</strong> và <strong>WAL-G</strong> lo giùm nén, song song, mã hoá, chính sách lưu giữ, đích S3/R2 và, quan trọng nhất, việc <em>KIỂM CHỨNG</em>. Trên một VPS nhỏ như cái trang này đang chạy, WAL-G đẩy lên object storage là một buổi chiều Chủ nhật hợp lý và nó biến trường hợp xấu nhất từ 24 giờ thành 5 phút.</p>
<div class="pitfall"><p><strong>Bẫy — một replication slot bị bỏ rơi làm đầy đĩa cho tới khi máy chủ chết.</strong> Một slot (15.3) BẢO ĐẢM rằng primary giữ lại mọi segment WAL mà bên tiêu thụ của nó chưa xác nhận. Bảo đảm đó là VÔ ĐIỀU KIỆN: nếu bản sao bị tắt, hoặc một bên tiêu thụ giải-mã-logic bị khai tử mà bỏ lại cái slot, thì WAL tích tụ <em>MÃI MÃI</em>. Đĩa đầy, và khi một cơ sở dữ liệu không ghi nổi WAL thì nó không commit nổi bất cứ thứ gì — một sự cố toàn phần gây ra bởi một thành phần chẳng ai còn dùng. Nó CŨNG chặn <code>VACUUM</code>, nên wraparound (14.3) trở thành một chiếc đồng hồ đếm ngược thứ hai chạy song song. Hai lớp phòng thủ: đặt <code>max_slot_wal_keep_size</code> để PostgreSQL hy sinh một cái slot tụt hậu thay vì hy sinh chính nó, và đưa <code>SELECT slot_name, active, pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)) FROM pg_replication_slots;</code> lên một bảng điều khiển. Một slot có <code>active = f</code> mà kích thước đang tăng là một sự cố CHƯA BẮT ĐẦU.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: tự đọc LSN của mình nhích lên khi bạn ghi thêm dòng</span><span class="lc-sub">Nhánh Code Lab dẫn qua một lượt dựng archive_command từ đầu tới cuối.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 15.3 ─────────────────────────── */
    {
      title: '15.3 — Streaming replication, built for real|||15.3 — Nhân bản streaming, dựng thật',
      slug: 'postgresql-15-3-nhan-ban',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Dựng một bản sao THẬT bằng pg_basebackup rồi chạy nó ở cổng 5434: ghi vào primary hiện ngay ở bản sao, ghi vào bản sao thì bị từ chối, pg_stat_replication báo độ trễ 0 byte. Kèm điều mà read replica KHÔNG giải quyết được.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.3 · Phase 4 — In production</span>
<h2>A second copy, kept current</h2>
<p class="lead">A replica is a second PostgreSQL server that continuously replays the primary's WAL. It gives you two different things people often confuse: a machine to fail over to, and a machine to run read queries on. Everything below was built and measured — a real primary on port 5433 and a real replica on 5434.</p>

<h3>Build it</h3>
<p>First a replication slot on the primary, so it retains WAL the replica has not consumed yet:</p>
<pre><code><span class="tok-keyword">SELECT</span> * <span class="tok-keyword">FROM</span> pg_create_physical_replication_slot(<span class="tok-string">'ban_sao_1'</span>);</code></pre>
<p>Then copy the whole data directory:</p>
<pre><code>pg_basebackup -h /tmp -p 5433 -U postgres \\
  -D ./replica -S ban_sao_1 -R -P -X stream</code></pre>
<div class="out">167851/188761 kB (88%), 0/1 tablespace
188772/188772 kB (100%), 1/1 tablespace</div>
<p>Two flags carry all the magic. <code>-R</code> writes the connection settings and creates <code>standby.signal</code> — the empty file whose <em>presence</em> is what makes a data directory a replica. <code>-X stream</code> streams WAL during the copy so the backup is consistent even though the primary kept working throughout.</p>
<div class="out">✓ standby.signal có
primary_conninfo  = 'user=postgres host=''/tmp'' port=5433 …'
primary_slot_name = 'ban_sao_1'</div>

<h3>Start it and confirm what it is</h3>
<pre><code>pg_ctl -D ./replica -o <span class="tok-string">"-p 5434"</span> start
psql -p 5434 -c <span class="tok-string">"SELECT pg_is_in_recovery();"</span></code></pre>
<div class="out"> la_ban_sao
------------
 t
(1 row)</div>
<p><code>pg_is_in_recovery() = t</code> is the definitive test. A replica is permanently "in recovery": replaying WAL is not a startup phase for it, it is the job.</p>

<h3>Write on one, read on the other</h3>
<pre><code><span class="tok-comment">-- primary (5433)</span>
<span class="tok-keyword">INSERT INTO</span> note (title, body) <span class="tok-keyword">VALUES</span> (<span class="tok-string">'Từ primary'</span>, …);</code></pre>
<div class="out">primary:  1001 dòng · mới nhất: Từ primary
bản sao:  1001 dòng · mới nhất: Từ primary</div>
<p>The row appeared on the replica within a second, with no application involvement. Now try to write to the replica:</p>
<pre><code><span class="tok-comment">-- bản sao (5434)</span>
<span class="tok-keyword">INSERT INTO</span> note (title, body) <span class="tok-keyword">VALUES</span> (<span class="tok-string">'thử ghi'</span>, <span class="tok-string">'x'</span>);</code></pre>
<div class="out">ERROR:  cannot execute INSERT in a read-only transaction</div>
<p>A physical replica is byte-identical to its primary, so it cannot accept independent writes — the restriction is structural, not a policy you can relax.</p>

<h3>Measuring lag — the number that matters</h3>
<pre><code><span class="tok-comment">-- trên primary</span>
<span class="tok-keyword">SELECT</span> application_name, state, sync_state, sent_lsn, replay_lsn,
       pg_wal_lsn_diff(sent_lsn, replay_lsn) <span class="tok-keyword">AS</span> byte_tre
<span class="tok-keyword">FROM</span> pg_stat_replication;</code></pre>
<div class="out">application_name | walreceiver
state            | streaming
sync_state       | async
sent_lsn         | 0/10002308
replay_lsn       | 0/10002308
byte_tre         | 0</div>
<p><code>state = streaming</code> and zero bytes behind: healthy. <code>sync_state = async</code> is the default and the important detail — the primary commits <strong>without waiting</strong> for the replica. Fast, and it means a primary that dies right now can lose the last few transactions. Synchronous replication (<code>synchronous_commit = on</code> plus <code>synchronous_standby_names</code>) closes that window at the cost of putting a network round trip inside every commit.</p>

<h3>What a read replica does and does not solve</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">✓</span><span class="lz-t">Read capacity</span><span class="lz-d">Reports, analytics, dashboards and <code>pg_dump</code> (15.1) can all run on the replica, leaving the primary for the writes only it can serve.</span></div>
<div class="lz-step"><span class="lz-k">✓</span><span class="lz-t">Failover</span><span class="lz-d"><code>pg_ctl promote</code> turns a replica into a primary in seconds. Tools like Patronus/Patroni or repmgr automate the election and the reconfiguration.</span></div>
<div class="lz-step"><span class="lz-k">✗</span><span class="lz-t">Write capacity</span><span class="lz-d">Every write still goes through one primary. Replicas do not help, and each one adds a little work to the primary. Scaling writes means partitioning (15.4) or sharding.</span></div>
<div class="lz-step"><span class="lz-k">✗</span><span class="lz-t">Protection from mistakes</span><span class="lz-d">A replica reproduces the primary <em>faithfully</em>, including <code>DROP TABLE</code>. It is not a backup. PITR (15.2) is the answer to human error; replication is the answer to hardware failure.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — sending reads to a replica without deciding what stale data does to the user.</strong> Async replication means the replica is behind by some amount, usually milliseconds and occasionally much more under load or during a long-running query. The bug this produces is a classic and it looks like the application is broken: a user submits a form, the write goes to the primary, the redirect reads from the replica, and their change is not there. They submit again. Route reads that follow a write in the same user action to the primary — "read your own writes" — and reserve the replica for genuinely independent reads. There is a second edge in the other direction: a long <code>SELECT</code> on the replica conflicts with WAL replay of a <code>VACUUM</code> on the primary, and PostgreSQL resolves it by <em>cancelling your query</em> with <em>canceling statement due to conflict with recovery</em>. <code>hot_standby_feedback = on</code> prevents that — by making the replica hold back the primary's vacuum, which is bloat (14.3) traded for query stability. Pick deliberately; there is no setting that gives you both.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: build your own replica on a second port and watch a row cross</span><span class="lc-sub">The Code Lab track runs the exact pg_basebackup command above.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.3 · Giai đoạn 4 — Trên production</span>
<h2>Một bản sao thứ hai, luôn được giữ mới</h2>
<p class="lead">Bản sao là một máy chủ PostgreSQL thứ hai liên tục PHÁT LẠI WAL của primary. Nó cho bạn hai thứ khác nhau mà người ta hay lẫn: một cỗ máy để chuyển sang khi hỏng, và một cỗ máy để chạy truy vấn đọc. Mọi thứ dưới đây đều được DỰNG và ĐO thật — một primary thật ở cổng 5433 và một bản sao thật ở cổng 5434.</p>

<h3>Dựng nó</h3>
<p>Trước hết là một replication slot trên primary, để nó GIỮ LẠI phần WAL mà bản sao chưa tiêu thụ:</p>
<pre><code><span class="tok-keyword">SELECT</span> * <span class="tok-keyword">FROM</span> pg_create_physical_replication_slot(<span class="tok-string">'ban_sao_1'</span>);</code></pre>
<p>Rồi chép toàn bộ thư mục dữ liệu:</p>
<pre><code>pg_basebackup -h /tmp -p 5433 -U postgres \\
  -D ./replica -S ban_sao_1 -R -P -X stream</code></pre>
<div class="out">167851/188761 kB (88%), 0/1 tablespace
188772/188772 kB (100%), 1/1 tablespace</div>
<p>Hai cái cờ mang toàn bộ phép màu. <code>-R</code> ghi ra cấu hình kết nối và tạo <code>standby.signal</code> — cái file RỖNG mà chỉ riêng SỰ TỒN TẠI của nó biến một thư mục dữ liệu thành một bản sao. <code>-X stream</code> truyền WAL NGAY TRONG lúc chép, nên bản sao lưu vẫn nhất quán dù primary vẫn làm việc suốt thời gian đó.</p>
<div class="out">✓ standby.signal có
primary_conninfo  = 'user=postgres host=''/tmp'' port=5433 …'
primary_slot_name = 'ban_sao_1'</div>

<h3>Khởi động nó và xác nhận nó là cái gì</h3>
<pre><code>pg_ctl -D ./replica -o <span class="tok-string">"-p 5434"</span> start
psql -p 5434 -c <span class="tok-string">"SELECT pg_is_in_recovery();"</span></code></pre>
<div class="out"> la_ban_sao
------------
 t
(1 row)</div>
<p><code>pg_is_in_recovery() = t</code> là phép thử dứt khoát. Một bản sao thì VĨNH VIỄN "đang phục hồi": phát lại WAL không phải một giai đoạn khởi động của nó, đó là CÔNG VIỆC của nó.</p>

<h3>Ghi ở một bên, đọc ở bên kia</h3>
<pre><code><span class="tok-comment">-- primary (5433)</span>
<span class="tok-keyword">INSERT INTO</span> note (title, body) <span class="tok-keyword">VALUES</span> (<span class="tok-string">'Từ primary'</span>, …);</code></pre>
<div class="out">primary:  1001 dòng · mới nhất: Từ primary
bản sao:  1001 dòng · mới nhất: Từ primary</div>
<p>Dòng đó xuất hiện ở bản sao trong vòng một giây, không cần ứng dụng làm gì cả. Giờ thử GHI vào bản sao:</p>
<pre><code><span class="tok-comment">-- bản sao (5434)</span>
<span class="tok-keyword">INSERT INTO</span> note (title, body) <span class="tok-keyword">VALUES</span> (<span class="tok-string">'thử ghi'</span>, <span class="tok-string">'x'</span>);</code></pre>
<div class="out">ERROR:  cannot execute INSERT in a read-only transaction</div>
<p>Một bản sao vật lý giống primary tới từng byte, nên nó KHÔNG THỂ nhận lệnh ghi độc lập — hạn chế này thuộc về CẤU TRÚC, không phải một chính sách bạn nới ra được.</p>

<h3>Đo độ trễ — con số quan trọng</h3>
<pre><code><span class="tok-comment">-- trên primary</span>
<span class="tok-keyword">SELECT</span> application_name, state, sync_state, sent_lsn, replay_lsn,
       pg_wal_lsn_diff(sent_lsn, replay_lsn) <span class="tok-keyword">AS</span> byte_tre
<span class="tok-keyword">FROM</span> pg_stat_replication;</code></pre>
<div class="out">application_name | walreceiver
state            | streaming
sync_state       | async
sent_lsn         | 0/10002308
replay_lsn       | 0/10002308
byte_tre         | 0</div>
<p><code>state = streaming</code> và tụt lại 0 byte: khoẻ. <code>sync_state = async</code> là mặc định và là chi tiết quan trọng — primary commit mà <strong>KHÔNG CHỜ</strong> bản sao. Nhanh, và nó nghĩa là một primary chết ngay lúc này có thể làm mất vài giao dịch cuối. Nhân bản đồng bộ (<code>synchronous_commit = on</code> cộng <code>synchronous_standby_names</code>) đóng cửa sổ đó lại, với cái giá là đặt một vòng đi-về qua mạng vào bên trong MỌI lệnh commit.</p>

<h3>Read replica giải quyết được gì và KHÔNG giải quyết được gì</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">✓</span><span class="lz-t">Năng lực ĐỌC</span><span class="lz-d">Báo cáo, phân tích, bảng điều khiển và cả <code>pg_dump</code> (15.1) đều chạy được trên bản sao, để dành primary cho những lệnh ghi mà chỉ nó phục vụ được.</span></div>
<div class="lz-step"><span class="lz-k">✓</span><span class="lz-t">Chuyển đổi khi hỏng</span><span class="lz-d"><code>pg_ctl promote</code> biến một bản sao thành primary trong vài giây. Các công cụ như Patroni hay repmgr tự động hoá việc bầu chọn và cấu hình lại.</span></div>
<div class="lz-step"><span class="lz-k">✗</span><span class="lz-t">Năng lực GHI</span><span class="lz-d">Mọi lệnh ghi vẫn đi qua MỘT primary. Bản sao không giúp gì, và mỗi cái còn thêm chút việc cho primary. Mở rộng khả năng ghi nghĩa là phân mảnh (15.4) hoặc sharding.</span></div>
<div class="lz-step"><span class="lz-k">✗</span><span class="lz-t">Bảo vệ khỏi SAI SÓT</span><span class="lz-d">Bản sao tái hiện primary một cách <em>TRUNG THÀNH</em>, kể cả lệnh <code>DROP TABLE</code>. Nó KHÔNG phải bản sao lưu. PITR (15.2) là câu trả lời cho lỗi con người; nhân bản là câu trả lời cho hỏng phần cứng.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — đẩy lệnh đọc sang bản sao mà chưa quyết định dữ liệu CŨ sẽ gây gì cho người dùng.</strong> Nhân bản bất đồng bộ nghĩa là bản sao tụt lại một quãng nào đó, thường là vài mili giây và thi thoảng là nhiều hơn hẳn khi tải cao hoặc trong lúc có truy vấn chạy dài. Con bug sinh ra từ đó là một ca kinh điển và nó TRÔNG như ứng dụng bị hỏng: người dùng gửi một biểu mẫu, lệnh ghi đi vào primary, cú chuyển trang lại đọc từ bản sao, và thay đổi của họ KHÔNG có ở đó. Họ gửi lại lần nữa. Hãy định tuyến những lệnh đọc ĐI SAU một lệnh ghi trong cùng một hành động của người dùng về primary — "đọc được cái mình vừa ghi" — và để dành bản sao cho những lệnh đọc thật sự độc lập. Còn một cạnh sắc nữa theo chiều ngược lại: một câu <code>SELECT</code> dài trên bản sao xung đột với việc phát lại WAL của một lượt <code>VACUUM</code> trên primary, và PostgreSQL giải quyết bằng cách <em>HUỶ TRUY VẤN CỦA BẠN</em> với dòng <em>canceling statement due to conflict with recovery</em>. <code>hot_standby_feedback = on</code> ngăn được điều đó — bằng cách bắt bản sao KÌM lại lượt vacuum của primary, tức là đổi bloat (14.3) lấy sự ổn định của truy vấn. Hãy chọn một cách có chủ đích; không có thiết lập nào cho bạn cả hai.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: tự dựng một bản sao ở cổng thứ hai và nhìn một dòng chạy sang</span><span class="lc-sub">Nhánh Code Lab chạy đúng lệnh pg_basebackup ở trên.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 15.4 ─────────────────────────── */
    {
      title: '15.4 — Partitioning: one table, many pieces|||15.4 — Phân mảnh: một bảng, nhiều mảnh',
      slug: 'postgresql-15-4-phan-manh',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Phân mảnh theo RANGE với partition pruning đo thật (chỉ 1 trong 3 mảnh bị đọc), và lý lẽ THẬT SỰ của phân mảnh: DROP một mảnh mất 3,5 ms so với DELETE mất 67,8 ms và để lại 100.019 dead tuple.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.4 · Phase 4 — In production</span>
<h2>Splitting a table without splitting the queries</h2>
<p class="lead">Partitioning divides one logical table into several physical ones, transparently. Queries still address a single table name; PostgreSQL routes rows on insert and skips irrelevant partitions on read. It is presented as a performance feature, and it is — but as you will measure, its biggest win is somewhere else entirely.</p>

<h3>Declaring it</h3>
<pre><code><span class="tok-keyword">CREATE TABLE</span> event_p (
  id      bigint <span class="tok-keyword">GENERATED ALWAYS AS IDENTITY</span>,
  luc     timestamptz <span class="tok-keyword">NOT NULL</span>,
  payload text <span class="tok-keyword">NOT NULL</span>
) <span class="tok-keyword">PARTITION BY RANGE</span> (luc);

<span class="tok-keyword">CREATE TABLE</span> event_p_2026_06 <span class="tok-keyword">PARTITION OF</span> event_p
  <span class="tok-keyword">FOR VALUES FROM</span> (<span class="tok-string">'2026-06-01'</span>) <span class="tok-keyword">TO</span> (<span class="tok-string">'2026-07-01'</span>);
<span class="tok-keyword">CREATE TABLE</span> event_p_2026_07 <span class="tok-keyword">PARTITION OF</span> event_p
  <span class="tok-keyword">FOR VALUES FROM</span> (<span class="tok-string">'2026-07-01'</span>) <span class="tok-keyword">TO</span> (<span class="tok-string">'2026-08-01'</span>);
<span class="tok-keyword">CREATE TABLE</span> event_p_2026_08 <span class="tok-keyword">PARTITION OF</span> event_p
  <span class="tok-keyword">FOR VALUES FROM</span> (<span class="tok-string">'2026-08-01'</span>) <span class="tok-keyword">TO</span> (<span class="tok-string">'2026-09-01'</span>);</code></pre>
<p>Insert 300,000 rows spread over three months into <code>event_p</code>, then ask where each row actually landed. <code>tableoid</code> is the hidden column naming the physical table a row came from:</p>
<pre><code><span class="tok-keyword">SELECT</span> tableoid::regclass <span class="tok-keyword">AS</span> phan_manh, count(*),
       min(luc)::date <span class="tok-keyword">AS</span> tu, max(luc)::date <span class="tok-keyword">AS</span> den
<span class="tok-keyword">FROM</span> event_p <span class="tok-keyword">GROUP BY</span> 1 <span class="tok-keyword">ORDER BY</span> 1;</code></pre>
<div class="out">    phan_manh    | count  |     tu     |    den
-----------------+--------+------------+------------
 event_p_2026_06 | 100019 | 2026-06-01 | 2026-06-30
 event_p_2026_07 | 103324 | 2026-07-01 | 2026-07-31
 event_p_2026_08 |  96657 | 2026-08-01 | 2026-08-29
(3 rows)</div>
<p>The <code>INSERT</code> named only <code>event_p</code>; PostgreSQL routed every row by its <code>luc</code> value.</p>

<h3>Partition pruning</h3>
<pre><code><span class="tok-keyword">EXPLAIN</span> (<span class="tok-keyword">ANALYZE</span>, <span class="tok-keyword">COSTS OFF</span>)
<span class="tok-keyword">SELECT</span> count(*) <span class="tok-keyword">FROM</span> event_p
<span class="tok-keyword">WHERE</span> luc &gt;= <span class="tok-string">'2026-08-01'</span> <span class="tok-keyword">AND</span> luc &lt; <span class="tok-string">'2026-09-01'</span>;</code></pre>
<div class="out"> Aggregate (actual time=15.861..15.862 rows=1 loops=1)
   -&gt;  Seq Scan on event_p_2026_08 event_p (actual time=0.009..10.961 rows=96657 loops=1)
         Filter: ((luc &gt;= '2026-08-01…') AND (luc &lt; '2026-09-01…'))
 Planning Time: 0.578 ms
 Execution Time: 15.895 ms</div>
<p>Read the plan carefully: there is <strong>no <code>Append</code> node</strong> and the other two partitions are not mentioned at all. The planner proved from the <code>WHERE</code> clause that they cannot contain matching rows and excluded them before execution. Two thirds of the data was never touched.</p>
<div class="callout warn">Pruning only works when the query filters on the <strong>partition key</strong>. <code>WHERE payload = 'p42'</code> must scan every partition, and will be <em>slower</em> than the same query on an unpartitioned table because it now scans several relations instead of one. Choosing the partition key is choosing which queries get faster.</div>

<h3>The real reason to partition</h3>
<p>Now the measurement that decides it. Delete June's data two ways — from a flat table and by dropping a partition:</p>
<pre><code><span class="tok-keyword">DELETE FROM</span> event_flat <span class="tok-keyword">WHERE</span> luc &lt; <span class="tok-string">'2026-07-01'</span>;   <span class="tok-comment">-- bảng phẳng</span>
<span class="tok-keyword">DROP TABLE</span> event_p_2026_06;                          <span class="tok-comment">-- một mảnh</span></code></pre>
<div class="out">DELETE 100019
Time: 67.751 ms

DROP TABLE
Time: 3.500 ms</div>
<p><strong>19× faster</strong> — and speed is the smaller half. Look at what each left behind:</p>
<div class="out">     relname     | n_live_tup | n_dead_tup | kich_thuoc
-----------------+------------+------------+------------
 event_flat      |     499981 |     100019 | 15 MB
 event_p_2026_07 |     103324 |          0 | 5272 kB
 event_p_2026_08 |      96657 |          0 | 4928 kB</div>
<p>The <code>DELETE</code> left <strong>100,019 dead tuples</strong> and the file did not shrink — autovacuum now has to work through all of it (14.3), and the space stays allocated. The dropped partition is simply <em>gone</em>: space returned to the operating system immediately, no vacuum, no bloat, no lock held on anything else.</p>
<p>That is the case for partitioning, and it is an operational one rather than a query-speed one. <strong>If your data has a retention policy — logs, events, metrics, sessions, anything you delete after N days — partition by time and make deletion a <code>DROP</code>.</strong></p>

<h3>Practical notes</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Indexes and constraints</span><span class="lz-d">An index created on the parent is created on every partition, including ones added later. A <code>PRIMARY KEY</code> must include the partition key — which is why <code>event_p</code> above declares <code>id</code> without one.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Create partitions ahead of time</span><span class="lz-d">A row with no matching partition raises <em>no partition of relation … found for row</em>. Either schedule creation a few months ahead or attach a <code>DEFAULT</code> partition as a safety net.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Detaching instead of dropping</span><span class="lz-d"><code>ALTER TABLE … DETACH PARTITION</code> turns a partition into a standalone table, still holding its rows. Archive it, dump it, then drop it — a soft version of the same operation.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Three kinds</span><span class="lz-d"><code>RANGE</code> (time, the common case), <code>LIST</code> (a fixed set of values such as region or tenant), <code>HASH</code> (spread evenly when there is no natural grouping).</span></div>
</div>
<div class="pitfall"><p><strong>Trap — partitioning a table that is not big enough to need it.</strong> Partitioning adds real cost: planning time grows with the partition count, every query that does not filter on the key touches more relations, and a plan that used one index now uses many. Below a few tens of millions of rows an ordinary table with a good index (Chapter 9) is usually faster and always simpler. The honest triggers for partitioning are a retention policy you want to enforce with <code>DROP</code>, a table too large for <code>VACUUM</code> to keep up with, or a maintenance window that has become impossible. "It is getting big" is not one of them. And the retrofit is not free — converting an existing large table means creating the partitioned parent and moving the data, so if you can see a retention policy coming, partition on day one rather than at the point where the migration itself needs a maintenance window.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: build three partitions, prove pruning, then race DROP against DELETE</span><span class="lc-sub">The Code Lab track reproduces the 3.5 ms vs 67.8 ms result.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.4 · Giai đoạn 4 — Trên production</span>
<h2>Chẻ một cái bảng mà không phải chẻ các truy vấn</h2>
<p class="lead">Phân mảnh chia MỘT bảng logic thành nhiều bảng vật lý, một cách trong suốt. Truy vấn vẫn gọi một cái tên bảng duy nhất; PostgreSQL định tuyến dòng khi chèn và bỏ qua các mảnh không liên quan khi đọc. Nó được giới thiệu như một tính năng hiệu năng, và đúng là vậy — nhưng như bạn sắp ĐO được, chiến thắng lớn nhất của nó nằm ở một chỗ hoàn toàn khác.</p>

<h3>Khai báo nó</h3>
<pre><code><span class="tok-keyword">CREATE TABLE</span> event_p (
  id      bigint <span class="tok-keyword">GENERATED ALWAYS AS IDENTITY</span>,
  luc     timestamptz <span class="tok-keyword">NOT NULL</span>,
  payload text <span class="tok-keyword">NOT NULL</span>
) <span class="tok-keyword">PARTITION BY RANGE</span> (luc);

<span class="tok-keyword">CREATE TABLE</span> event_p_2026_06 <span class="tok-keyword">PARTITION OF</span> event_p
  <span class="tok-keyword">FOR VALUES FROM</span> (<span class="tok-string">'2026-06-01'</span>) <span class="tok-keyword">TO</span> (<span class="tok-string">'2026-07-01'</span>);
<span class="tok-keyword">CREATE TABLE</span> event_p_2026_07 <span class="tok-keyword">PARTITION OF</span> event_p
  <span class="tok-keyword">FOR VALUES FROM</span> (<span class="tok-string">'2026-07-01'</span>) <span class="tok-keyword">TO</span> (<span class="tok-string">'2026-08-01'</span>);
<span class="tok-keyword">CREATE TABLE</span> event_p_2026_08 <span class="tok-keyword">PARTITION OF</span> event_p
  <span class="tok-keyword">FOR VALUES FROM</span> (<span class="tok-string">'2026-08-01'</span>) <span class="tok-keyword">TO</span> (<span class="tok-string">'2026-09-01'</span>);</code></pre>
<p>Chèn 300.000 dòng trải trên ba tháng vào <code>event_p</code>, rồi hỏi xem từng dòng THẬT SỰ rơi vào đâu. <code>tableoid</code> là cột ẩn nêu tên bảng vật lý mà một dòng đến từ đó:</p>
<pre><code><span class="tok-keyword">SELECT</span> tableoid::regclass <span class="tok-keyword">AS</span> phan_manh, count(*),
       min(luc)::date <span class="tok-keyword">AS</span> tu, max(luc)::date <span class="tok-keyword">AS</span> den
<span class="tok-keyword">FROM</span> event_p <span class="tok-keyword">GROUP BY</span> 1 <span class="tok-keyword">ORDER BY</span> 1;</code></pre>
<div class="out">    phan_manh    | count  |     tu     |    den
-----------------+--------+------------+------------
 event_p_2026_06 | 100019 | 2026-06-01 | 2026-06-30
 event_p_2026_07 | 103324 | 2026-07-01 | 2026-07-31
 event_p_2026_08 |  96657 | 2026-08-01 | 2026-08-29
(3 rows)</div>
<p>Lệnh <code>INSERT</code> chỉ nêu tên <code>event_p</code>; PostgreSQL định tuyến từng dòng theo giá trị <code>luc</code> của nó.</p>

<h3>Partition pruning (cắt tỉa mảnh)</h3>
<pre><code><span class="tok-keyword">EXPLAIN</span> (<span class="tok-keyword">ANALYZE</span>, <span class="tok-keyword">COSTS OFF</span>)
<span class="tok-keyword">SELECT</span> count(*) <span class="tok-keyword">FROM</span> event_p
<span class="tok-keyword">WHERE</span> luc &gt;= <span class="tok-string">'2026-08-01'</span> <span class="tok-keyword">AND</span> luc &lt; <span class="tok-string">'2026-09-01'</span>;</code></pre>
<div class="out"> Aggregate (actual time=15.861..15.862 rows=1 loops=1)
   -&gt;  Seq Scan on event_p_2026_08 event_p (actual time=0.009..10.961 rows=96657 loops=1)
         Filter: ((luc &gt;= '2026-08-01…') AND (luc &lt; '2026-09-01…'))
 Planning Time: 0.578 ms
 Execution Time: 15.895 ms</div>
<p>Hãy đọc kỹ cái plan: KHÔNG có <strong>nút <code>Append</code></strong> nào và hai mảnh còn lại thậm chí không được NHẮC TỚI. Bộ lập kế hoạch đã chứng minh từ mệnh đề <code>WHERE</code> rằng chúng không thể chứa dòng khớp và loại chúng ra TRƯỚC khi thực thi. Hai phần ba dữ liệu chưa từng bị chạm vào.</p>
<div class="callout warn">Pruning CHỈ chạy khi truy vấn lọc theo <strong>KHOÁ PHÂN MẢNH</strong>. Câu <code>WHERE payload = 'p42'</code> buộc phải quét MỌI mảnh, và sẽ <em>CHẬM HƠN</em> cùng truy vấn đó trên bảng không phân mảnh, vì giờ nó quét nhiều quan hệ thay vì một. Chọn khoá phân mảnh chính là chọn xem truy vấn NÀO sẽ nhanh lên.</div>

<h3>Lý do THẬT SỰ để phân mảnh</h3>
<p>Giờ tới phép đo quyết định tất cả. Xoá dữ liệu tháng 6 theo hai cách — từ một bảng phẳng, và bằng cách drop một mảnh:</p>
<pre><code><span class="tok-keyword">DELETE FROM</span> event_flat <span class="tok-keyword">WHERE</span> luc &lt; <span class="tok-string">'2026-07-01'</span>;   <span class="tok-comment">-- bảng phẳng</span>
<span class="tok-keyword">DROP TABLE</span> event_p_2026_06;                          <span class="tok-comment">-- một mảnh</span></code></pre>
<div class="out">DELETE 100019
Time: 67,751 ms

DROP TABLE
Time: 3,500 ms</div>
<p><strong>Nhanh gấp 19 lần</strong> — và tốc độ mới là nửa NHỎ hơn của câu chuyện. Hãy nhìn thứ mỗi cách để lại phía sau:</p>
<div class="out">     relname     | n_live_tup | n_dead_tup | kich_thuoc
-----------------+------------+------------+------------
 event_flat      |     499981 |     100019 | 15 MB
 event_p_2026_07 |     103324 |          0 | 5272 kB
 event_p_2026_08 |      96657 |          0 | 4928 kB</div>
<p>Lệnh <code>DELETE</code> để lại <strong>100.019 dead tuple</strong> và file KHÔNG co lại — giờ autovacuum phải cày qua toàn bộ chỗ đó (14.3), còn chỗ đĩa thì vẫn bị chiếm. Cái mảnh bị drop thì đơn giản là <em>BIẾN MẤT</em>: chỗ đĩa trả về cho hệ điều hành ngay lập tức, không vacuum, không bloat, không giữ khoá lên bất cứ thứ gì khác.</p>
<p>Đó mới là lý lẽ cho phân mảnh, và nó là lý lẽ VẬN HÀNH chứ không phải lý lẽ tốc-độ-truy-vấn. <strong>Nếu dữ liệu của bạn có chính sách lưu giữ — log, sự kiện, số đo, phiên, bất cứ thứ gì bạn xoá sau N ngày — hãy phân mảnh theo thời gian và biến việc xoá thành một lệnh <code>DROP</code>.</strong></p>

<h3>Ghi chú thực dụng</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Chỉ mục và ràng buộc</span><span class="lz-d">Một chỉ mục tạo trên bảng cha sẽ được tạo trên MỌI mảnh, kể cả những mảnh thêm về sau. Một <code>PRIMARY KEY</code> BẮT BUỘC phải chứa khoá phân mảnh — và đó là lý do <code>event_p</code> ở trên khai <code>id</code> mà không có khoá chính.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Tạo mảnh TRƯỚC</span><span class="lz-d">Một dòng không có mảnh nào khớp sẽ ném <em>no partition of relation … found for row</em>. Hoặc lên lịch tạo trước vài tháng, hoặc gắn một mảnh <code>DEFAULT</code> làm lưới an toàn.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Tháo ra thay vì drop</span><span class="lz-d"><code>ALTER TABLE … DETACH PARTITION</code> biến một mảnh thành bảng độc lập, vẫn giữ nguyên các dòng của nó. Lưu trữ nó, dump nó, rồi mới drop — một phiên bản MỀM của cùng thao tác.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Ba kiểu</span><span class="lz-d"><code>RANGE</code> (thời gian, ca phổ biến), <code>LIST</code> (một tập giá trị cố định như vùng miền hay tenant), <code>HASH</code> (rải đều khi không có cách gom nhóm tự nhiên).</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — phân mảnh một cái bảng CHƯA đủ lớn để cần tới nó.</strong> Phân mảnh có chi phí thật: thời gian lập kế hoạch tăng theo số mảnh, mọi truy vấn KHÔNG lọc theo khoá đều chạm nhiều quan hệ hơn, và một plan trước đây dùng một chỉ mục thì nay dùng nhiều cái. Dưới vài chục triệu dòng, một cái bảng thường với chỉ mục tốt (Chương 9) thường NHANH HƠN và LUÔN đơn giản hơn. Những cái cớ trung thực để phân mảnh là: một chính sách lưu giữ mà bạn muốn thực thi bằng <code>DROP</code>, một cái bảng quá lớn để <code>VACUUM</code> theo kịp, hoặc một cửa sổ bảo trì đã trở nên bất khả thi. "Nó đang to dần" KHÔNG nằm trong số đó. Và việc cải tạo về sau cũng không miễn phí — chuyển một bảng lớn đang có nghĩa là tạo bảng cha phân mảnh rồi CHUYỂN dữ liệu, nên nếu bạn đã nhìn thấy một chính sách lưu giữ đang tới, hãy phân mảnh từ NGÀY ĐẦU thay vì tới lúc chính cuộc di chuyển đó lại cần một cửa sổ bảo trì.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: dựng ba mảnh, chứng minh pruning, rồi cho DROP đua với DELETE</span><span class="lc-sub">Nhánh Code Lab tái hiện kết quả 3,5 ms so với 67,8 ms.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 15.5 ─────────────────────────── */
    {
      title: '15.5 — Chapter 15 quiz|||15.5 — Kiểm tra Chương 15',
      slug: 'postgresql-15-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Tám câu về định dạng pg_dump, giới hạn của sao lưu logic, WAL và PITR, replication slot bị bỏ rơi, bản sao chỉ đọc, độ trễ bất đồng bộ, và phân mảnh.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on backup, replication and scaling. Answer from memory; the questions follow the lesson order.</p>
<div class="callout ok">Aim for 7/8. The two that matter most in real work: that a replica is not a backup because it faithfully replicates your <code>DROP TABLE</code> (15.3), and that an abandoned replication slot can fill the disk and take the server down (15.2).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về sao lưu, nhân bản và mở rộng. Trả lời bằng trí nhớ; các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Hai câu quan trọng nhất trong việc thật: bản sao KHÔNG phải bản sao lưu vì nó nhân bản trung thành cả lệnh <code>DROP TABLE</code> của bạn (15.3), và một replication slot bị bỏ rơi có thể làm đầy đĩa rồi hạ gục máy chủ (15.2).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Why prefer pg_dump -Fc (custom) over the default plain format?|||Vì sao nên chọn pg_dump -Fc (custom) hơn định dạng plain mặc định?',
            options: [
              'It is the only one that works|||Nó là cái duy nhất chạy được',
              'It is compressed (~3× smaller measured) AND carries a table of contents, so pg_restore can list contents, restore a single table, or restore in parallel|||Nó được nén (đo được nhỏ hơn ~3 lần) VÀ mang theo mục lục, nên pg_restore liệt kê được nội dung, khôi phục một bảng đơn lẻ, hay khôi phục song song',
              'It is human-readable|||Nó đọc được bằng mắt',
              'It includes the WAL|||Nó bao gồm cả WAL',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You run pg_dump nightly at 02:00. A disk fails at 01:59. What have you lost, and what fixes it?|||Bạn chạy pg_dump mỗi đêm lúc 02:00. Đĩa hỏng lúc 01:59. Bạn mất gì, và cái gì sửa được?',
            options: [
              'Nothing; dumps are continuous|||Không mất gì; dump là liên tục',
              'Almost 24 hours of data — a dump is a point-in-time snapshot. PITR (base backup + archived WAL) reduces the window to minutes|||Gần 24 giờ dữ liệu — một bản dump là ảnh chụp MỘT thời điểm. PITR (sao lưu nền + WAL đã lưu trữ) rút cửa sổ đó xuống còn vài phút',
              'Only the last transaction|||Chỉ giao dịch cuối cùng',
              'Nothing, if you have a replica|||Không mất gì, nếu bạn có bản sao',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does "write-ahead" in Write-Ahead Log actually mean?|||"Write-ahead" trong Write-Ahead Log thực chất nghĩa là gì?',
            options: [
              'Writes are batched for speed|||Các lệnh ghi được gom lô cho nhanh',
              'The change is written to the log and flushed to disk BEFORE the data page is modified — that ordering is what makes COMMIT survive a power cut|||Thay đổi được ghi vào nhật ký và đẩy xuống đĩa TRƯỚC KHI trang dữ liệu bị sửa — chính thứ tự đó làm COMMIT sống sót qua mất điện',
              'Writes go to the replica first|||Lệnh ghi đi tới bản sao trước',
              'It predicts future writes|||Nó dự đoán các lệnh ghi trong tương lai',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A replication slot is left behind after a replica is decommissioned. What happens?|||Một replication slot bị bỏ lại sau khi một bản sao bị khai tử. Chuyện gì xảy ra?',
            options: [
              'Nothing; it is cleaned up automatically|||Không sao; nó được dọn tự động',
              'The primary retains WAL for it FOREVER — the disk fills, the database cannot write WAL so it cannot commit, and vacuum is blocked too. Guard with max_slot_wal_keep_size and monitoring|||Primary GIỮ WAL cho nó MÃI MÃI — đĩa đầy, cơ sở dữ liệu không ghi nổi WAL nên không commit nổi, và vacuum cũng bị chặn. Chặn bằng max_slot_wal_keep_size và giám sát',
              'The replica reconnects on its own|||Bản sao tự kết nối lại',
              'Only replication stops|||Chỉ việc nhân bản dừng lại',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What single thing makes a data directory behave as a replica, and what does pg_is_in_recovery() return on one?|||Đúng MỘT thứ gì làm cho một thư mục dữ liệu hành xử như một bản sao, và pg_is_in_recovery() trả về gì trên nó?',
            options: [
              'A setting in postgresql.conf; it returns false|||Một thiết lập trong postgresql.conf; nó trả về false',
              'The presence of the standby.signal file; pg_is_in_recovery() returns t — a replica is permanently "in recovery" because replaying WAL is its job|||Sự tồn tại của file standby.signal; pg_is_in_recovery() trả về t — một bản sao thì VĨNH VIỄN "đang phục hồi" vì phát lại WAL chính là công việc của nó',
              'A special build of PostgreSQL|||Một bản dựng PostgreSQL đặc biệt',
              'Read-only file permissions|||Quyền file chỉ-đọc',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which problem does a read replica NOT solve?|||Read replica KHÔNG giải quyết được vấn đề nào?',
            options: [
              'Read capacity|||Năng lực đọc',
              'Write capacity and human error — all writes still go through one primary, and the replica faithfully replicates your DROP TABLE. Replication answers hardware failure; PITR answers mistakes|||Năng lực GHI và LỖI CON NGƯỜI — mọi lệnh ghi vẫn qua một primary, và bản sao nhân bản trung thành cả lệnh DROP TABLE của bạn. Nhân bản trả lời cho hỏng phần cứng; PITR trả lời cho sai sót',
              'Failover|||Chuyển đổi khi hỏng',
              'Running reports away from the primary|||Chạy báo cáo tách khỏi primary',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A user submits a form, then the redirect shows their change missing. What is happening and what is the fix?|||Một người dùng gửi biểu mẫu, rồi trang chuyển tới lại không thấy thay đổi của họ. Chuyện gì đang xảy ra và sửa thế nào?',
            options: [
              'The write failed silently|||Lệnh ghi hỏng âm thầm',
              'Async replication lag — the write went to the primary, the read came from a slightly-behind replica. Route reads that follow a write in the same user action to the PRIMARY|||Độ trễ nhân bản bất đồng bộ — lệnh ghi vào primary, lệnh đọc lại lấy từ bản sao đang tụt lại chút. Hãy định tuyến lệnh đọc ĐI SAU một lệnh ghi trong cùng hành động về PRIMARY',
              'The database is corrupted|||Cơ sở dữ liệu hỏng',
              'Increase max_connections|||Tăng max_connections',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Measured: DELETE of 100,019 old rows took 67.8 ms and left 100,019 dead tuples; DROP of the equivalent partition took 3.5 ms and left none. What does this tell you about when to partition?|||Đo được: DELETE 100.019 dòng cũ mất 67,8 ms và để lại 100.019 dead tuple; DROP mảnh tương đương mất 3,5 ms và không để lại gì. Điều đó cho bạn biết gì về việc khi nào nên phân mảnh?',
            options: [
              'Always partition every table|||Luôn phân mảnh mọi bảng',
              'Partition when data has a RETENTION POLICY — deletion becomes DROP: 19× faster, space returned immediately, no bloat for autovacuum to clean|||Hãy phân mảnh khi dữ liệu có CHÍNH SÁCH LƯU GIỮ — việc xoá trở thành DROP: nhanh gấp 19 lần, chỗ đĩa trả lại ngay, không để bloat cho autovacuum phải dọn',
              'Partition only tables under a million rows|||Chỉ phân mảnh bảng dưới một triệu dòng',
              'Partitioning always makes every query faster|||Phân mảnh luôn làm mọi truy vấn nhanh hơn',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
