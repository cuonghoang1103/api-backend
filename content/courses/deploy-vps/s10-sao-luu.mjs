const REF = '?ref=%2Fcourses%2Fdeploy-vps%2Flearn&reflabel=Deploy%20VPS';
/**
 * Deploy VPS — Chương 10: Sao lưu và phục hồi.
 * Mọi số đo là ĐO THẬT trên PostgreSQL 16.13 ở /tmp/pgdata cổng 5433, cơ sở
 * dữ liệu 192 MB (bảng lon 400.170 dòng / 124 MB, bf 300.000 dòng, kh 200.000
 * dòng), và hai hệ tệp ext4 loopback cố tình làm nhỏ để pg_dump chạm ENOSPC
 * giữa chừng.
 *
 * Nâng cấp 29/09/2026: bài 10.0 slide (deck dv-10, 32 slide) + slide/🧪/🗂/📌 trong 10.1–10.5 + bài mới 10.7
 * (3-2-1, máy kho KÉO bằng khoá chỉ-đọc, age, rsync/rclone, xoay vòng) + quiz 10 câu viết lại. Đào sâu đo lại trên
 * Docker Desktop (Mac M1): "production" dv10-pg = pgvector/pgvector:pg16 (PostgreSQL 16.15, CSDL 191 MB có bảng vector
 * + chỉ mục HNSW, cặp bảng ON DELETE CASCADE, vai trò ung_dung); VPS thí nghiệm dv10-vps (Ubuntu 24.04, pg_dump 16.15,
 * age 1.1.1, rclone 1.60.1); máy kho dv10-kho; máy MỚI dv10-may2/may3/moi để bấm giờ phục hồi; dv10-sai = postgres:16
 * thường; dv10-nho có đĩa tmpfs 48 MB. Đo: ba định dạng + zstd; ảnh chụp lúc bắt đầu; docker exec -t làm hỏng dump
 * (pg_restore segfault 139); lệch phiên bản; phục hồi sang máy thứ hai + trọn cú phục hồi 9,6 s; ANALYZE + autovacuum
 * (bảng 6 dòng không bao giờ được analyze); cứu một bảng sau seed CASCADE; tệp cụt đúng ranh giới dòng; kiểm ở máy khác
 * với bản kê; ảnh sai thiếu pgvector; volume vô danh bị bỏ lại; báo động theo tuổi; vai trò; volume Docker; kéo bằng
 * command=…,restrict; age/gpg; GFS và bẫy xoay vòng.
 * ĐÃ SỬA (thêm ghi chú, không xoá câu cũ): 10.3 "ON_ERROR_STOP=1 biến lời nói dối thành lỗi" chỉ đúng khi chỗ cắt gây
 * lỗi cú pháp — đo lại: tệp cụt ĐÚNG ranh giới dòng COPY thì psql thoát 0 CẢ VỚI ON_ERROR_STOP=1 và nạp 141.090 dòng
 * (dòng cuối bị cụt); 10.2 "thiếu ANALYZE chậm 2,5×" — đo lại: kế hoạch đổi y hệt nhưng chậm/nhanh tuỳ máy; đoạn
 * "insert … from cuu_don_da_chep" thêm ghi chú rằng PostgreSQL không truy vấn chéo cơ sở dữ liệu.
 */
import { gallery, slide } from './_slides.mjs';

export default {
  title: 'Chapter 10 — Backups, and the restore nobody timed|||Chương 10 — Sao lưu, và cú phục hồi không ai bấm giờ',
  slug: 'deploy-ch10-sao-luu',
  description: 'Sao lưu mất 1,2 tới 2,4 giây. Phục hồi mất 2,1 tới 3,4. Đó là phần dễ. Phần khó: một bản sao lưu HỎNG mà psql phục hồi với mã thoát 0 rồi để lại một bảng 400.170 dòng RỖNG — và pg_restore --list vẫn nói nó ổn.',
  sortOrder: 11,
  lessons: [

    /* ─────────────────────────── 10.0 ─────────────────────────── */
    {
      title: '10.0 — Chapter 10 slides: backups, restores and the checks that tell the truth|||10.0 — Slide Chương 10: sao lưu, phục hồi và những phép kiểm nói thật',
      slug: 'deploy-10-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 32 slide của Chương 10: ba định dạng pg_dump và zstd, ảnh chụp lúc bắt đầu, docker exec -t làm hỏng bản dump, bấm giờ phục hồi sang máy mới, ANALYZE, cứu một bảng sau seed CASCADE, tệp cụt thoát 0, kiểm ở máy khác với bản kê, đúng ảnh pgvector, báo động theo tuổi, vai trò và volume, 3-2-1, máy kho kéo bằng khoá chỉ-đọc, age và xoay vòng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Slides</span>
<h2>The whole chapter in 32 slides</h2>
<p class="lead">Skim these before the lessons to see the shape of the chapter, then come back after the quiz as a revision sheet. Every picture reappears inside the lesson that explains it: a dump that is a snapshot of the moment it started, a one-letter flag that corrupts a backup while every command exits 0, a restore timed from an empty machine to a verified database, a truncated file that restores with exit 0, a checker that fails for the right reason, and a backup that lives on a machine the server cannot reach.</p>
<p>Slides 3–7 belong to Lesson 10.1 (three formats and zstd, the snapshot, the backup script, <code>docker exec -t</code>), 8–12 to 10.2 (restoring onto a second machine, the whole recovery timed, <code>ANALYZE</code>, RPO and RTO, rescuing one table after a cascading seed), 13–15 to 10.3 (truncated files and what exit codes do and do not say), 16–20 to 10.4 (checking on another machine with a manifest, the right image and the wrong one, the real checker that printed ✅, checking the checker, alerting on absence), 21–23 to 10.5 (roles, Docker volumes, state versus configuration) and 24–28 to the new Lesson 10.7 (3-2-1, pulling instead of pushing, rsync and rclone, <code>age</code>, rotation and its trap). The last four are the chapter's common mistakes, a two-page cheat sheet and a 45-minute practice session. Every terminal is real output recorded on 29/09/2026 on Docker Desktop on a Mac M1: a PostgreSQL 16.15 container from <code>pgvector/pgvector:pg16</code> holding a 191 MB database, an Ubuntu 24.04 lab VPS reached over SSH, a separate storage machine, and fresh containers for every timed restore. A real VPS has slower disks, so its seconds are usually longer; the shape of every result is the same. The slides are in Vietnamese; the diagrams, commands and output read the same in any language.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Slide</span>
<h2>Cả chương trong 32 slide</h2>
<p class="lead">Lướt bộ này trước khi vào bài để thấy hình dạng của chương, rồi quay lại sau bài kiểm tra như một tờ ôn tập. Mỗi hình ở đây đều xuất hiện lại trong bài giảng giải thích nó: một bản dump là ảnh chụp của khoảnh khắc nó bắt đầu, một cái cờ một chữ cái làm hỏng bản sao lưu trong khi mọi lệnh thoát 0, một cú phục hồi bấm giờ từ máy trống tới cơ sở dữ liệu đã kiểm, một tệp cụt phục hồi với mã 0, một bộ kiểm hỏng đúng lý do, và một bản sao lưu sống trên một cái máy mà máy chủ không với tới được.</p>
<p>Slide 3–7 thuộc Bài 10.1 (ba định dạng và zstd, ảnh chụp, script sao lưu, <code>docker exec -t</code>), 8–12 thuộc 10.2 (phục hồi sang máy thứ hai, bấm giờ trọn cú phục hồi, <code>ANALYZE</code>, RPO và RTO, cứu một bảng sau một lần seed xoá dây chuyền), 13–15 thuộc 10.3 (tệp cụt, và mã thoát nói gì, không nói gì), 16–20 thuộc 10.4 (kiểm ở máy khác với bản kê, ảnh đúng và ảnh sai, bộ kiểm thật đã in ✅, kiểm cái bộ kiểm, báo động khi vắng mặt), 21–23 thuộc 10.5 (vai trò, volume Docker, trạng thái và cấu hình) và 24–28 thuộc bài mới 10.7 (3-2-1, kéo thay vì đẩy, rsync và rclone, <code>age</code>, xoay vòng và cái bẫy của nó). Bốn slide cuối là những sai lầm hay gặp, bảng tra nhanh hai trang và một buổi thực hành 45 phút. Mọi terminal là output THẬT ghi ngày 29/09/2026 trên Docker Desktop của một Mac M1: một container PostgreSQL 16.15 từ ảnh <code>pgvector/pgvector:pg16</code> chứa cơ sở dữ liệu 191 MB, một VPS thí nghiệm Ubuntu 24.04 vào bằng SSH, một máy kho riêng, và các container mới tinh cho mỗi lần bấm giờ phục hồi. VPS thật có đĩa chậm hơn nên số giây thường dài hơn; hình dạng của mọi kết quả thì y như vậy.</p>
</div>
${gallery('dv-10', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Ba định dạng: nhanh, nhỏ, hay song song'], [4, 'zstd: nhỏ hơn và nhanh hơn gzip'], [5, 'Bản dump là ảnh chụp lúc bắt đầu'], [6, 'Script sao lưu: mỗi dòng một việc'], [7, 'docker exec -t làm hỏng bản dump'],
  [8, 'Phục hồi chậm hơn dump; -j4 gỡ lại'], [9, 'Bấm giờ trọn cú phục hồi sang máy mới'], [10, 'Thiếu ANALYZE: kế hoạch dựng trên đoán mò'], [11, 'RPO và RTO trên một trục thời gian'], [12, 'Seed lại xoá tiến độ — cứu một bảng'],
  [13, 'Tệp cụt: psql thoát 0, dữ liệu sai'], [14, '-Fc phát hiện được; --list thì không'], [15, 'Mã thoát nói gì — và không nói gì'],
  [16, 'Kiểm ở máy khác: mang theo bản kê'], [17, 'Đúng ảnh prod thì ✓; ảnh thường thì ✗'], [18, 'Chuyện thật: bộ kiểm sai ảnh vẫn in ✅'], [19, 'Bộ kiểm cũng phải được kiểm'], [20, 'Báo động khi vắng mặt: tuổi bản mới nhất'],
  [21, 'pg_dump có GRANT, không có CREATE ROLE'], [22, 'Volume Docker: sao lưu bằng container vứt đi'], [23, 'Trạng thái thì sao lưu, cấu hình thì vào git'],
  [24, '3-2-1: ba bản, hai nơi, một ngoài máy'], [25, 'Kéo, đừng đẩy: khoá chỉ-đọc cho máy kho'], [26, 'rsync, rclone sang máy thứ ba — rồi kiểm'], [27, 'age: máy chủ mã hoá, không giải mã được'], [28, 'Xoay vòng: ngày, tuần, tháng — và cái bẫy'],
  [29, 'Sai lầm hay gặp'], [30, 'Bảng tra nhanh (1/2): làm và phục hồi'], [31, 'Bảng tra nhanh (2/2): kiểm và đưa đi'], [32, 'Thực hành chương 10'],
])}
`,
    },


    /* ─────────────────────────── 10.1 ─────────────────────────── */
    {
      title: '10.1 — What a backup costs to make|||10.1 — Làm một bản sao lưu tốn bao nhiêu',
      slug: 'deploy-10-1-tao-sao-luu',
      type: 'VIDEO',
      description: 'Ba định dạng pg_dump trên một cơ sở dữ liệu 192 MB, đo cả thời gian lẫn kích thước. Định dạng NHANH NHẤT to hơn sáu lần, và định dạng nhỏ nhất là cái duy nhất phục hồi song song được.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>What a backup costs to make</h2>
<p class="lead">Backups are the one piece of infrastructure that is easy to set up, easy to feel good about, and almost never tested. This chapter measures both halves. The making is the cheap half.</p>

<h3>The database</h3>
<p>All measurements in this chapter run against the same PostgreSQL 16.13 instance used throughout the course — 192 MB, dominated by one table of 400,170 rows:</p>

<div class="out">  csdl: 192 MB
  lon         | 400170 dong | 124 MB
  bf          | 300000 dong |  40 MB
  kh          | 200000 dong |  19 MB
  don         |    240 dong |  64 kB</div>

<h3>Three formats, measured</h3>
${slide('dv-10', 3, 'Ba định dạng: nhanh, nhỏ, hay song song — đo lại trên pgvector:pg16')}
<div class="out">  plain        1165 ms     128.9 MB
  custom       2379 ms      21.0 MB
  directory    1954 ms      21.0 MB</div>

<p><code>-Fp</code> (plain SQL) is twice as fast and six times bigger. <code>-Fc</code> (custom) compresses as it goes, which costs the extra second. <code>-Fd</code> (directory) produced the same 21 MB slightly faster because <code>-j2</code> let it dump two tables at once.</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">-Fp plain</span><span class="lz-lnote">a text file of SQL. Readable, greppable, editable — and restorable only by feeding the whole thing to <code>psql</code>, in order, single-threaded</span></div>
<div class="lz-layer"><span class="lz-lname">-Fc custom</span><span class="lz-lnote">compressed, with a table of contents. Restore selectively (<code>-t</code>), reorder, or run in parallel (<code>-j</code>). The default choice</span></div>
<div class="lz-layer"><span class="lz-lname">-Fd directory</span><span class="lz-lnote">one file per table, so <code>pg_dump -j</code> can write in parallel too — the only format that parallelises the <em>dump</em></span></div>
<div class="lz-layer"><span class="lz-lname">-Ft tar</span><span class="lz-lnote">rarely worth it: no compression, and no parallel restore</span></div>
</div>

<h3>Compressing plain afterwards</h3>
${slide('dv-10', 4, 'zstd: nhỏ hơn VÀ nhanh hơn gzip')}
<div class="out">  gzip -6: 128.9 MB → 21.1 MB (ti le 6.1x) trong 2433 ms</div>

<p>Identical final size to <code>-Fc</code>, and slower overall: 1,165 + 2,433 = 3,598 ms against 2,379. If you want a compressed backup, let <code>pg_dump</code> do it. The reason to keep plain SQL is that you can read it — genuinely useful when you need one table, or one row, or to see exactly what the schema was on some date.</p>

<div class="callout ok">
<p><strong>The default worth adopting.</strong> <code>pg_dump -Fc</code>, one file, compressed, with a table of contents. It restores in parallel, it restores selectively, and it is 21 MB instead of 129. Keep a plain dump too if you like reading them, but the one your restore procedure points at should be the custom one.</p>
</div>

<h3>What the dump is and is not consistent with</h3>
${slide('dv-10', 5, 'Bản dump là ảnh chụp lúc BẮT ĐẦU — đo bằng một dòng ghi giữa chừng')}
<p><code>pg_dump</code> runs inside a single repeatable-read transaction, so the output is a consistent snapshot of the moment it started — not of the moment it finished. Writes during those 2.4 seconds are simply not in it, which is correct and is exactly what you want.</p>

<div class="pitfall">
<p><strong>Trap — a dump is consistent with <em>itself</em>, and with nothing else on the machine.</strong> If your app writes an uploaded file to disk and a row to the database, a dump taken between those two writes captures the row and not the file, or neither. Every backup that covers more than one system has this problem, and there is no flag that fixes it — the only real answers are to make the pairing recoverable (the row records the file path, so a missing file is detectable) or to accept the gap and know how you would repair it. 10.5 is about everything a database dump does not contain.</p>
</div>

<div class="lz-map">
<div class="lz-stage">
<span class="lz-badge">make</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">pg_dump -Fc</div><div class="lz-nsub">2,379 ms · 21 MB · measured in this lesson</div></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">prove</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">restore + count rows</div><div class="lz-nsub">4,688 ms · the only step that cannot be fooled (10.4)</div></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">move</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">encrypt, then off the machine</div><div class="lz-nsub">58 ms to encrypt · a copy on the same disk is not a copy</div></div></div>
</div>
</div>

<h3>The load a backup puts on a live server</h3>
<p>A dump reads every row of every table. On a small VPS that means it evicts your working set from the page cache: after a backup, the first requests are slow because the data they need is no longer in memory. It also holds a transaction open for its whole duration, which delays <code>VACUUM</code> from reclaiming rows deleted during that window.</p>

<div class="kv-grid">
<div class="kv"><span class="k">when to run it</span><span class="v">your quietest hour. On a Vietnamese site that is roughly 03:00–05:00, not the 00:00 everybody defaults to</span></div>
<div class="kv"><span class="k">how long it holds a transaction</span><span class="v">the whole dump. 2.4 s here; on a 20 GB database it is minutes, and <code>VACUUM</code> is blocked for all of it</span></div>
<div class="kv"><span class="k">where to write it</span><span class="v">NOT the disk the database is on — Chapter 8 measured what a large file does to a shared disk</span></div>
<div class="kv"><span class="k">nice it</span><span class="v"><code>nice -n 19 ionice -c3 pg_dump …</code> so it yields to real traffic</span></div>
</div>

<h3>The cron entry, with the parts people leave out</h3>
${slide('dv-10', 6, 'Script sao lưu của chương: mỗi dòng một việc')}
<pre><code>15 3 * * * /usr/local/bin/sao-luu.sh >> /var/log/sao-luu.log 2>&amp;1</code></pre>

<pre><code>#!/bin/bash
set -euo pipefail
NGAY=\$(date +%Y%m%d-%H%M%S)
DICH=/srv/sao-luu
TEP="\$DICH/thu-\$NGAY.dump"

<span class="tok-comment"># viet ra .tam roi doi ten — de mot ban DANG viet khong bao gio bi coi la xong</span>
nice -n 19 ionice -c3 pg_dump -Fc -d thu -f "\$TEP.tam"
mv -f "\$TEP.tam" "\$TEP"

<span class="tok-comment"># giu 14 ban, xoa cai cu nhat</span>
ls -1t "\$DICH"/thu-*.dump 2>/dev/null | tail -n +15 | xargs -r rm -f

<span class="tok-comment"># mot dong so sach: kich thuoc va thoi gian, de 10.4 doi chieu</span>
echo "\$NGAY \$(stat -c%s "\$TEP") \$SECONDS" >> "\$DICH/so-sach.txt"</code></pre>

<p>The <code>.tam</code> rename is the same idea as the atomic symlink swap in Chapter 6: a file only gets its real name once it is complete, so a backup interrupted halfway never looks like a finished one. Chapter 7 argued the same thing about deploy steps — do the work at the side, make it visible in one atomic operation.</p>

<div class="callout warn">
<p><strong>The line that is missing from that script, deliberately.</strong> There is no step that proves the backup can be restored. Everything above measures <em>making</em> a file, and a file is not a backup — 10.3 shows a 51 MB file that looks perfectly reasonable, restores with exit code 0, and loses an entire table. The verification step is Lesson 10.4, and it is the only part of this chapter that actually protects you.</p>
</div>

<h3>Measured again: PostgreSQL 16 with pgvector, the way production runs it</h3>
<p>The numbers above come from a bare PostgreSQL on one machine. The site this course follows runs PostgreSQL <em>in a container</em>, from an image that carries the <code>pgvector</code> extension, and dumps it from outside. So on 29/09/2026 the whole chapter was re-measured in that shape: a container <code>dv10-pg</code> from <code>pgvector/pgvector:pg16</code> (PostgreSQL 16.15) holding a 191 MB database — the same <code>lon</code> table of 400,170 rows, plus <code>bf</code>, <code>kh</code>, a table <code>tai_lieu_nhung</code> with 20,000 rows of <code>vector(8)</code> and an HNSW index, a <code>bai_hoc</code>/<code>tien_do</code> pair joined by <code>ON DELETE CASCADE</code>, and an application role <code>ung_dung</code>. The dumps run from the lab VPS (<code>dv10-vps</code>, Ubuntu 24.04, <code>pg_dump</code> 16.15) over the network. Everything runs on Docker Desktop on a Mac M1, so single timings wander by a factor of two between runs; seven runs of each format:</p>
<table><thead><tr><th>Command</th><th>Time, 7 runs (median)</th><th>Size</th></tr></thead><tbody>
<tr><td><code>pg_dump -Fp</code></td><td>524–933 ms (695)</td><td>114 MB</td></tr>
<tr><td><code>pg_dump -Fc</code> (gzip level 6, the default)</td><td>1,365–3,420 ms (1,928)</td><td>13 MB</td></tr>
<tr><td><code>pg_dump -Fd -j4</code></td><td>1,070–3,055 ms (2,612)</td><td>13 MB</td></tr>
<tr><td><code>pg_dump -Fc -Z1</code> (gzip level 1)</td><td>613–1,095 ms (735)</td><td>14 MB</td></tr>
<tr><td><code>gzip -6</code> of the plain file, afterwards</td><td>1,369–1,941 ms on top</td><td>13 MB</td></tr>
</tbody></table>
<p>The order held: plain is the fastest to write and eight times the size; custom is small and pays for it in compression time. Two things changed. <code>-Fd -j4</code> was <em>not</em> faster here — four workers on one small database, all talking through the same virtual network, gained nothing; parallel dumping pays off on a large database with many big tables, not on a 191 MB one. And the compression level matters more than the format: <code>-Z1</code> was nearly as fast as plain and only one megabyte bigger than level 6.</p>

<h3>zstd: the compression you should probably be using</h3>
<p><code>pg_dump</code> 16 accepts <code>--compress=zstd</code> and <code>--compress=lz4</code> as well as gzip. Three runs of each on the same database:</p>
<pre><code class="language-bash">for c in gzip:6 lz4 zstd; do for i in 1 2 3; do
  t0=\$(date +%s%N); pg_dump -d thu -Fc --compress=\$c -f thu.\$i.c; t1=\$(date +%s%N)
  echo "\$c \$(( (t1-t0)/1000000 )) ms \$(stat -c%s thu.\$i.c)"
done; done</code></pre>
<div class="out">gzip:6 2709 ms 13254204
gzip:6 1386 ms 13254204
gzip:6 1359 ms 13254204
lz4 583 ms 22270996
lz4 522 ms 22270996
lz4 509 ms 22270996
zstd 508 ms 10384319
zstd 499 ms 10384319
zstd 487 ms 10384319</div>
<p>zstd produced the <strong>smallest</strong> file (10.4 MB against 13.3) in about <strong>a third of the time</strong> of gzip. lz4 was as fast but 70% bigger. The price is compatibility: the <code>pg_restore</code> that reads this file must be version 16 or later and built with zstd. That is true of the official images and of Ubuntu 24.04's packages, but it is exactly the kind of thing that breaks on the one machine you did not think about — the old laptop you restore on in an emergency. Whatever you choose, write it in the runbook.</p>

<table><thead><tr><th>Flag</th><th>What it does</th><th>When you need it</th></tr></thead><tbody>
<tr><td><code>-d thu</code></td><td>which database</td><td>always — relying on <code>PGDATABASE</code> is how you dump the wrong one (10.3)</td></tr>
<tr><td><code>-Fc</code> / <code>-Fd</code> / <code>-Fp</code></td><td>custom archive / directory / plain SQL</td><td><code>-Fc</code> by default; <code>-Fd</code> for a big database you want to dump in parallel</td></tr>
<tr><td><code>--compress=zstd</code> (or <code>-Z1</code>…<code>-Z9</code>)</td><td>method and level</td><td>pick once, measure once, write down</td></tr>
<tr><td><code>-j 4</code></td><td>parallel workers</td><td>only with <code>-Fd</code> when dumping</td></tr>
<tr><td><code>-f file</code></td><td>output file</td><td>better than <code>&gt;</code> — the file is not created by a shell that cannot see <code>pg_dump</code>&#39;s exit code</td></tr>
<tr><td><code>--no-owner</code>, <code>--no-privileges</code></td><td>leave out <code>ALTER … OWNER</code> and <code>GRANT</code></td><td>when you restore onto a machine with different role names — usually better decided at restore time</td></tr>
</tbody></table>

<h3>Run it yourself: prove that the dump is a snapshot</h3>
<p>"Consistent with the moment it started" is a claim you can test in thirty seconds. Start a dump in the background, write and <em>commit</em> one row while it runs, then look inside the dump:</p>
<pre><code class="language-bash">#!/bin/bash
<span class="tok-comment"># anh-chup.sh — ghi MOT dong vao giua luc pg_dump dang chay</span>
set -euo pipefail
cd ~/sl
T0=\$(date +%s%N); ms() { echo \$(( (\$(date +%s%N)-T0)/1000000 )); }
echo "[\$(ms) ms] luc bat dau: nguoi_dung = \$(psql -d thu -Atc 'select count(*) from nguoi_dung')"
pg_dump -d thu -Fc -f anh.dump &amp; P=\$!
sleep 0.2
psql -d thu -qc "insert into nguoi_dung values (7, 'ghi giua chung');"
echo "[\$(ms) ms] da ghi va CHOT dong id=7 (pg_dump van dang chay)"
wait \$P; echo "[\$(ms) ms] pg_dump xong, ma thoat \$?"
echo "trong CSDL that : nguoi_dung = \$(psql -d thu -Atc 'select count(*) from nguoi_dung')"
echo "trong ban dump  : nguoi_dung = \$(pg_restore -a -t nguoi_dung -f - anh.dump | grep -cE '^[0-9]+	')"</code></pre>
<div class="out">[1 ms] luc bat dau: nguoi_dung = 6
[399 ms] da ghi va CHOT dong id=7 (pg_dump van dang chay)
[1757 ms] pg_dump xong, ma thoat 0
trong CSDL that : nguoi_dung = 7
trong ban dump  : nguoi_dung = 6</div>
<p>The row was committed at 399 ms, 1.4 seconds before <code>pg_dump</code> finished, and it is not in the dump. <code>pg_restore -a -t nguoi_dung -f -</code> prints only the data of one table as text instead of loading it anywhere — a cheap way to look inside a custom archive. That is the guarantee working: every table in the file agrees with every other table, as of 0 ms. If an upload wrote a file to disk at 399 ms and its row in the same transaction, the file is on disk and the row is not in your backup.</p>

<h3>The backup script this chapter builds</h3>
<p>The cron script above makes a file. The one below — used for the rest of the chapter — makes a <em>backup</em>: data, roles, a list of what the dump should contain, fingerprints, encryption, and a copy off the machine. Each line is there because a later lesson measured what goes wrong without it:</p>
<pre><code class="language-bash">#!/bin/bash
<span class="tok-comment"># sao-luu.sh — dump + vai tro + ban ke, ma hoa bang age, dua sang may kho</span>
set -Eeuo pipefail
umask 077
DB=thu; DICH=~/sao-luu; TEN="\$DB-\$(date +%Y%m%d-%H%M)"
TAM=\$(mktemp -d); trap 'rm -rf "\$TAM"' EXIT

pg_dump -d "\$DB" -Fc --compress=zstd -f "\$TAM/csdl.dump"
pg_dumpall --roles-only -f "\$TAM/vai-tro.sql"
<span class="tok-comment"># ban ke: dem so dong NGAY TRONG ban dump (doc het tep = bat duoc tep cut cut)</span>
pg_restore -f - "\$TAM/csdl.dump" | awk '/^COPY /{t=\$2;n=0;next}
  /^\\\\\\.\$/{print t, n; t="";next} t!=""{n++}' &gt; "\$TAM/ban-ke.txt"
(cd "\$TAM" &amp;&amp; sha256sum csdl.dump vai-tro.sql ban-ke.txt &gt; sha256.txt)

tar -C "\$TAM" -cf - . | age -R ~/nguoi-nhan.txt -o "\$DICH/\$TEN.tar.age.tam"
mv "\$DICH/\$TEN.tar.age.tam" "\$DICH/\$TEN.tar.age"
rclone copy "\$DICH/\$TEN.tar.age" kho:kho/
echo "\$(date -Is) OK \$TEN.tar.age \$(stat -c%s "\$DICH/\$TEN.tar.age")" &gt;&gt; "\$DICH/so-sach.log"</code></pre>
<div class="kv-grid">
<div class="kv"><span class="k"><code>set -Eeuo pipefail</code></span><span class="v">any failing command — including <code>pg_dump</code> in the middle of a pipe — stops the script (Chapter 7). Without <code>pipefail</code>, <code>pg_dump … | age …</code> reports age&#39;s exit code and a failed dump looks fine.</span></div>
<div class="kv"><span class="k"><code>umask 077</code></span><span class="v">every file the script creates is readable by its owner only; the roles file contains password hashes (10.5).</span></div>
<div class="kv"><span class="k"><code>mktemp -d</code> + <code>trap … EXIT</code></span><span class="v">the unencrypted dump only ever lives in a private temporary directory, which is removed on every exit path, success or failure.</span></div>
<div class="kv"><span class="k"><code>pg_restore -f - … | awk</code></span><span class="v">turns the dump back into text and counts the rows of each <code>COPY</code> block. It reads the whole file, so a truncated dump fails <em>here</em>, at backup time; and the counts become the manifest another machine checks against (10.4). On this database it adds about a second.</span></div>
<div class="kv"><span class="k"><code>sha256sum</code></span><span class="v">fingerprints, so the machine that restores can prove it received the same bytes.</span></div>
<div class="kv"><span class="k"><code>age -R</code></span><span class="v">encrypts to a <em>public</em> key: this server can encrypt but cannot decrypt (10.7).</span></div>
<div class="kv"><span class="k"><code>.tam</code> then <code>mv</code></span><span class="v">a half-written backup never carries a finished name.</span></div>
<div class="kv"><span class="k"><code>rclone copy</code></span><span class="v">a copy that survives the loss of this machine (10.7).</span></div>
</div>
<p>Measured on the lab VPS: <code>real 0m2.743s</code> for the whole script, and a 10,396,328-byte <code>.tar.age</code> file both in <code>~/sao-luu</code> and on the storage machine.</p>

<h3>The flag that silently corrupts a dump: <code>docker exec -t</code></h3>
${slide('dv-10', 7, 'docker exec -t làm hỏng bản dump: to thêm 47.828 byte, pg_restore segfault 139')}
<p>When PostgreSQL runs in a container, the backup is usually <code>docker exec &lt;container&gt; pg_dump … &gt; file</code> on the host. People copy that line from an interactive session where they typed <code>docker exec -it</code>, and that one letter matters. Measured on the Docker host with the same database:</p>
<pre><code class="language-bash">docker exec    dv10-pg pg_dump -U postgres -Fc thu &gt; khong-t.dump; echo "khong -t: exit=\$?"
docker exec -t dv10-pg pg_dump -U postgres -Fc thu &gt; co-t.dump;    echo "co -t: exit=\$?"
ls -l khong-t.dump co-t.dump | awk '{print \$5, \$9}'
pg_restore --list co-t.dump &gt; /tmp/l.txt 2&gt;&amp;1; echo "pg_restore --list exit=\$?"</code></pre>
<div class="out">khong -t: exit=0
co -t: exit=0
13302026 co-t.dump
13254198 khong-t.dump
pg_restore --list exit=139
Segmentation fault</div>
<p><code>-t</code> gives the process a pseudo-terminal, and a terminal translates every newline byte into carriage-return plus newline. For a text file that adds a <code>\\r</code> to each line; for a compressed binary archive it inserts 47,828 bytes in random places. Both <code>docker exec</code> commands exited 0, the file has a plausible size, and the only sign is that <code>pg_restore</code> crashes with a segmentation fault (exit 139) — on the day you need it. Dump without <code>-t</code>, or write the file inside the container (<code>pg_dump -f /tmp/x.dump</code>) and copy it out with <code>docker cp</code>.</p>

<h3>The client must be at least as new as the server</h3>
<p><code>pg_dump</code> refuses to dump a server newer than itself. Measured with a PostgreSQL 15 client against the 16 server:</p>
<div class="out">pg_dump (PostgreSQL) 15.4 (Debian 15.4-2.pgdg120+1)
pg_dump: error: aborting because of server version mismatch
pg_dump: detail: server version: 16.15 (Debian 16.15-1.pgdg12+2); pg_dump version: 15.4 (Debian 15.4-2.pgdg120+1)
ma thoat 1</div>
<p>And the other direction, a 16 archive read by a 15 <code>pg_restore</code>: <code>pg_restore: error: unsupported version (1.15) in file header</code>. This is not a hypothetical: in GitLab&#39;s outage of 31/01/2017 their <code>pg_dump</code> backups had been failing silently because the backup job used PostgreSQL 9.2 tools against a 9.6 server, and the failure emails were being rejected. Upgrading PostgreSQL means upgrading the machine that runs the backup too — and checking the exit code every night, which is what <code>set -e</code> is for.</p>

<h3>On macOS and Windows</h3>
<ul>
<li><strong>The <code>pg_dump</code> on your Mac is probably older than your server.</strong> The Mac used for this chapter has Homebrew&#39;s <code>pg_restore (PostgreSQL) 14.19</code>; pointed at a 16 server it would stop with the version-mismatch error above. Either install the matching version (<code>brew install postgresql@16</code>) or run the tools from the server&#39;s own image: <code>docker run --rm postgres:16 pg_dump …</code>.</li>
<li><strong>Windows teammates:</strong> a <code>sao-luu.sh</code> saved with CRLF line endings fails on the server before it does anything (Chapter 7). Run backup scripts on the server, not from a Windows shell, and keep them in git with <code>* text=auto eol=lf</code>.</li>
<li><strong>Dumping over SSH from your laptop</strong> (<code>ssh vps pg_dump … &gt; file</code>) sends the whole database over your home connection, which is fine for a copy you want locally and a poor substitute for a backup that runs whether or not your laptop is open.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> a teammate's backup cron line is <code>docker exec -it pg pg_dump -Fc app &gt; /srv/app.dump</code>, and "the backups have been fine for a month". Prove on the lab machine whether they are, and replace the line with one you can defend.</p>
<ol>
<li>Start a PostgreSQL container (<code>pgvector/pgvector:pg16</code>, name it <code>dv10-pg</code>, label <code>dvhoc=10</code>) and create a table with a few hundred thousand rows (<code>insert … select generate_series(1,400000)</code>).</li>
<li>Dump it twice from the host, once with <code>docker exec -t</code> and once without. Compare the sizes and run <code>pg_restore --list</code> on both; write down both exit codes.</li>
<li>Time <code>-Fp</code>, <code>-Fc</code> and <code>-Fc --compress=zstd</code> three times each on <em>your</em> machine and record the median and the size.</li>
<li>Run <code>anh-chup.sh</code> (above) against your table and confirm the row written mid-dump is not in the file.</li>
</ol>
<p><strong>Done when:</strong> you have a table of three formats with times and sizes from your own machine, two dump files whose <code>pg_restore --list</code> exit codes differ (0 and 139), and a one-line replacement cron entry that uses <code>-Fc</code>, no <code>-t</code>, writes to a <code>.tam</code> name and renames it only on success.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">pg_dump</span><span class="v">The tool that writes one database out as a file, from a single consistent snapshot.</span></div>
  <div class="kv"><span class="k">custom format (-Fc)</span><span class="v">A compressed archive with a table of contents, restorable in parallel and table by table.</span></div>
  <div class="kv"><span class="k">snapshot</span><span class="v">The view of the data at the instant the dump's transaction began; later commits are not in it.</span></div>
  <div class="kv"><span class="k">zstd</span><span class="v">A modern compression method; with pg_dump 16 it produced the smallest file fastest.</span></div>
  <div class="kv"><span class="k">pseudo-terminal (-t)</span><span class="v">A fake terminal that rewrites newlines — harmless for typing, fatal for binary output.</span></div>
  <div class="kv"><span class="k">version mismatch</span><span class="v">pg_dump refuses a newer server; pg_restore refuses a newer archive.</span></div>
  <div class="kv"><span class="k">manifest</span><span class="v">A list of what the backup should contain — here, rows per table counted from the dump itself.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Plain SQL is the fastest to write and several times bigger; the custom format is the one to restore from.</li>
<li>With pg_dump 16, <code>--compress=zstd</code> gave the smallest file in a third of gzip's time — if every restore machine can read it.</li>
<li>A dump is a snapshot of the moment it started: a row committed 1.4 s before it finished was not in it.</li>
<li><code>docker exec -t</code> corrupts a binary dump while every command exits 0; <code>pg_restore</code> then crashes with 139.</li>
<li>The backup tools must be at least as new as the server — GitLab lost its dumps to a 9.2 client against 9.6.</li>
<li>A backup script is more than <code>pg_dump</code>: roles, a manifest, fingerprints, encryption and an off-machine copy, each with a reason.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitLab — Postmortem of database outage of January 31</span><span class="lc-sub">about.gitlab.com/blog/postmortem-of-database-outage-of-january-31/ — pg_dump backups failing silently because a 9.2 client ran against a 9.6 server, and failure emails rejected by DMARC.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker — docker container exec</span><span class="lc-sub">docs.docker.com/reference/cli/docker/container/exec/ — what <code>-t</code> (allocate a pseudo-TTY) actually does.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — pg_dump</span><span class="lc-sub">postgresql.org/docs/current/app-pgdump.html — the format flags, <code>-j</code> for directory format, and the note that the dump is a snapshot of the transaction&#39;s start.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — Backup and Restore</span><span class="lc-sub">postgresql.org/docs/current/backup.html — the three strategies (SQL dump, file-system snapshot, continuous archiving) and when each stops being enough.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nice(1) and ionice(1)</span><span class="lc-sub">man 1 ionice — class 3 (idle) is what makes a backup yield disk to real traffic instead of competing with it.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — MVCC, snapshots and long transactions</span><span class="lc-sub">/courses/postgresql/learn${REF} — why a long-running dump blocks VACUUM, and what bloat that causes on a busy table.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1</span>
<h2>Làm một bản sao lưu tốn bao nhiêu</h2>
<p class="lead">Sao lưu là thứ hạ tầng dễ dựng, dễ thấy yên tâm, và gần như không bao giờ được đem đi thử. Chương này đo cả hai nửa. Nửa LÀM RA là nửa rẻ.</p>

<h3>Cơ sở dữ liệu</h3>
<p>Mọi phép đo trong chương này chạy trên đúng cái PostgreSQL 16.13 dùng suốt khoá — 192 MB, bị chi phối bởi một bảng 400.170 dòng:</p>

<div class="out">  csdl: 192 MB
  lon         | 400170 dong | 124 MB
  bf          | 300000 dong |  40 MB
  kh          | 200000 dong |  19 MB
  don         |    240 dong |  64 kB</div>

<h3>Ba định dạng, đo thật</h3>
${slide('dv-10', 3, 'Ba định dạng: nhanh, nhỏ, hay song song — đo lại trên pgvector:pg16')}
<div class="out">  plain        1165 ms     128.9 MB
  custom       2379 ms      21.0 MB
  directory    1954 ms      21.0 MB</div>

<p><code>-Fp</code> (SQL thuần) nhanh gấp đôi và to gấp sáu. <code>-Fc</code> (custom) nén ngay trong lúc chạy, và đó là cái giây phụ trội. <code>-Fd</code> (thư mục) cho ra cùng 21 MB nhanh hơn một chút vì <code>-j2</code> cho phép nó dump hai bảng cùng lúc.</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">-Fp plain</span><span class="lz-lnote">một tệp văn bản chứa SQL. Đọc được, grep được, sửa được — và phục hồi chỉ bằng cách nhét cả cục vào <code>psql</code>, theo thứ tự, một luồng</span></div>
<div class="lz-layer"><span class="lz-lname">-Fc custom</span><span class="lz-lnote">đã nén, có mục lục. Phục hồi chọn lọc (<code>-t</code>), sắp lại thứ tự, hoặc chạy song song (<code>-j</code>). Lựa chọn mặc định</span></div>
<div class="lz-layer"><span class="lz-lname">-Fd directory</span><span class="lz-lnote">một tệp cho mỗi bảng, nên <code>pg_dump -j</code> ghi song song được luôn — định dạng DUY NHẤT chạy song song được lúc DUMP</span></div>
<div class="lz-layer"><span class="lz-lname">-Ft tar</span><span class="lz-lnote">hiếm khi đáng: không nén, và không phục hồi song song được</span></div>
</div>

<h3>Nén bản plain lại sau đó</h3>
${slide('dv-10', 4, 'zstd: nhỏ hơn VÀ nhanh hơn gzip')}
<div class="out">  gzip -6: 128.9 MB → 21.1 MB (ti le 6.1x) trong 2433 ms</div>

<p>Kích thước cuối y hệt <code>-Fc</code>, và chậm hơn về tổng: 1.165 + 2.433 = 3.598 ms so với 2.379. Nếu bạn muốn một bản sao lưu đã nén, hãy để <code>pg_dump</code> làm. Lý do để giữ SQL thuần là bạn ĐỌC được nó — thật sự hữu dụng khi bạn cần một bảng, hay một dòng, hay muốn xem lược đồ CHÍNH XÁC hồi ngày nào đó là gì.</p>

<div class="callout ok">
<p><strong>Mặc định đáng chọn.</strong> <code>pg_dump -Fc</code>, một tệp, đã nén, có mục lục. Nó phục hồi song song được, phục hồi chọn lọc được, và nó là 21 MB thay vì 129. Cứ giữ thêm một bản plain nếu bạn thích đọc, nhưng cái mà quy trình phục hồi của bạn TRỎ VÀO nên là bản custom.</p>
</div>

<h3>Bản dump nhất quán với cái gì và KHÔNG nhất quán với cái gì</h3>
${slide('dv-10', 5, 'Bản dump là ảnh chụp lúc BẮT ĐẦU — đo bằng một dòng ghi giữa chừng')}
<p><code>pg_dump</code> chạy bên trong một giao dịch repeatable-read duy nhất, nên đầu ra là một ảnh chụp nhất quán của KHOẢNH KHẮC NÓ BẮT ĐẦU — không phải khoảnh khắc nó kết thúc. Các lệnh ghi trong 2,4 giây đó đơn giản là không có trong nó, và như thế là ĐÚNG, đó chính xác là thứ bạn muốn.</p>

<div class="pitfall">
<p><strong>Bẫy — một bản dump nhất quán với <em>CHÍNH NÓ</em>, và với không gì khác trên cái máy.</strong> Nếu ứng dụng của bạn ghi một tệp tải lên xuống đĩa VÀ một dòng vào cơ sở dữ liệu, thì một bản dump chụp giữa hai lệnh ghi đó sẽ bắt được cái dòng mà không bắt được cái tệp, hoặc không bắt được cái nào. Mọi bản sao lưu bao trùm hơn một hệ thống đều có vấn đề này, và không có cờ nào chữa được — hai câu trả lời thật duy nhất là làm cho cặp đôi ấy PHỤC HỒI ĐƯỢC (dòng dữ liệu ghi lại đường dẫn tệp, nên một tệp thiếu là phát hiện được) hoặc chấp nhận khe hở đó và biết mình sẽ vá nó thế nào. Bài 10.5 nói về mọi thứ mà một bản dump cơ sở dữ liệu KHÔNG chứa.</p>
</div>

<div class="lz-map">
<div class="lz-stage">
<span class="lz-badge">làm ra</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">pg_dump -Fc</div><div class="lz-nsub">2.379 ms · 21 MB · đo trong bài này</div></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">chứng minh</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">phục hồi + đếm số dòng</div><div class="lz-nsub">4.688 ms · bước DUY NHẤT không lừa được (10.4)</div></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">chuyển đi</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">mã hoá, rồi ra khỏi máy</div><div class="lz-nsub">58 ms để mã hoá · một bản sao trên cùng đĩa không phải bản sao</div></div></div>
</div>
</div>

<h3>Cái tải mà một bản sao lưu đặt lên một máy chủ đang sống</h3>
<p>Một bản dump ĐỌC mọi dòng của mọi bảng. Trên một VPS nhỏ điều đó nghĩa là nó đẩy tập làm việc của bạn ra khỏi bộ đệm trang: sau một lần sao lưu, những request đầu tiên sẽ chậm vì dữ liệu chúng cần không còn trong bộ nhớ nữa. Nó cũng GIỮ một giao dịch mở suốt thời gian chạy, làm <code>VACUUM</code> chậm lại trong việc thu hồi các dòng bị xoá trong cửa sổ ấy.</p>

<div class="kv-grid">
<div class="kv"><span class="k">chạy lúc nào</span><span class="v">giờ yên tĩnh nhất của bạn. Với một website Việt Nam thì đó là khoảng 03:00–05:00, không phải 00:00 mà ai cũng mặc định</span></div>
<div class="kv"><span class="k">nó giữ giao dịch bao lâu</span><span class="v">suốt cả bản dump. Ở đây là 2,4 s; trên một cơ sở dữ liệu 20 GB thì đó là hàng phút, và <code>VACUUM</code> bị chặn suốt ngần ấy</span></div>
<div class="kv"><span class="k">ghi vào đâu</span><span class="v">KHÔNG phải cái đĩa mà cơ sở dữ liệu đang nằm — Chương 8 đã đo một tệp lớn làm gì với một cái đĩa dùng chung</span></div>
<div class="kv"><span class="k">hạ ưu tiên nó</span><span class="v"><code>nice -n 19 ionice -c3 pg_dump …</code> để nó nhường đường cho lưu lượng thật</span></div>
</div>

<h3>Mục cron, kèm những phần người ta hay bỏ sót</h3>
${slide('dv-10', 6, 'Script sao lưu của chương: mỗi dòng một việc')}
<pre><code>15 3 * * * /usr/local/bin/sao-luu.sh >> /var/log/sao-luu.log 2>&amp;1</code></pre>

<pre><code>#!/bin/bash
set -euo pipefail
NGAY=\$(date +%Y%m%d-%H%M%S)
DICH=/srv/sao-luu
TEP="\$DICH/thu-\$NGAY.dump"

<span class="tok-comment"># viet ra .tam roi doi ten — de mot ban DANG viet khong bao gio bi coi la xong</span>
nice -n 19 ionice -c3 pg_dump -Fc -d thu -f "\$TEP.tam"
mv -f "\$TEP.tam" "\$TEP"

<span class="tok-comment"># giu 14 ban, xoa cai cu nhat</span>
ls -1t "\$DICH"/thu-*.dump 2>/dev/null | tail -n +15 | xargs -r rm -f

<span class="tok-comment"># mot dong so sach: kich thuoc va thoi gian, de 10.4 doi chieu</span>
echo "\$NGAY \$(stat -c%s "\$TEP") \$SECONDS" >> "\$DICH/so-sach.txt"</code></pre>

<p>Cú đổi tên từ <code>.tam</code> là đúng ý tưởng của cú tráo symlink nguyên tử ở Chương 6: một tệp chỉ nhận cái tên thật của nó KHI nó đã hoàn chỉnh, nên một bản sao lưu bị đứt giữa chừng không bao giờ trông giống một bản đã xong. Chương 7 lập luận y hệt về các bước deploy — làm việc ở bên lề, rồi cho nó hiện ra bằng MỘT thao tác nguyên tử.</p>

<div class="callout warn">
<p><strong>Cái dòng THIẾU trong script đó, một cách có chủ đích.</strong> Không có bước nào chứng minh bản sao lưu PHỤC HỒI ĐƯỢC. Mọi thứ ở trên đo việc <em>LÀM RA</em> một tệp, và một tệp KHÔNG phải một bản sao lưu — bài 10.3 cho xem một tệp 51 MB trông hoàn toàn hợp lý, phục hồi với mã thoát 0, và mất trắng một bảng. Bước kiểm chứng là Bài 10.4, và nó là phần DUY NHẤT của chương này thật sự bảo vệ được bạn.</p>
</div>

<h3>Đo lại: PostgreSQL 16 có pgvector, đúng kiểu production đang chạy</h3>
<p>Các con số ở trên lấy từ một PostgreSQL trần trên một máy. Website mà khoá này theo dõi chạy PostgreSQL <em>trong container</em>, từ một ảnh có phần mở rộng <code>pgvector</code>, và dump nó từ bên ngoài. Nên ngày 29/09/2026 cả chương được đo lại đúng hình dạng đó: container <code>dv10-pg</code> từ ảnh <code>pgvector/pgvector:pg16</code> (PostgreSQL 16.15) chứa một cơ sở dữ liệu 191 MB — vẫn bảng <code>lon</code> 400.170 dòng, thêm <code>bf</code>, <code>kh</code>, bảng <code>tai_lieu_nhung</code> 20.000 dòng có cột <code>vector(8)</code> và chỉ mục HNSW, cặp bảng <code>bai_hoc</code>/<code>tien_do</code> nối bằng <code>ON DELETE CASCADE</code>, và vai trò ứng dụng <code>ung_dung</code>. Lệnh dump chạy từ VPS thí nghiệm (<code>dv10-vps</code>, Ubuntu 24.04, <code>pg_dump</code> 16.15) qua mạng. Tất cả chạy trên Docker Desktop của một Mac M1, nên từng lần đo lệch nhau tới gấp đôi; bảy lần cho mỗi định dạng:</p>
<table><thead><tr><th>Lệnh</th><th>Thời gian, 7 lần (trung vị)</th><th>Kích thước</th></tr></thead><tbody>
<tr><td><code>pg_dump -Fp</code></td><td>524–933 ms (695)</td><td>114 MB</td></tr>
<tr><td><code>pg_dump -Fc</code> (gzip mức 6, mặc định)</td><td>1.365–3.420 ms (1.928)</td><td>13 MB</td></tr>
<tr><td><code>pg_dump -Fd -j4</code></td><td>1.070–3.055 ms (2.612)</td><td>13 MB</td></tr>
<tr><td><code>pg_dump -Fc -Z1</code> (gzip mức 1)</td><td>613–1.095 ms (735)</td><td>14 MB</td></tr>
<tr><td><code>gzip -6</code> tệp plain, làm sau</td><td>cộng thêm 1.369–1.941 ms</td><td>13 MB</td></tr>
</tbody></table>
<p>Thứ tự vẫn giữ: plain ghi nhanh nhất và to gấp tám; custom nhỏ và trả giá bằng thời gian nén. Có hai điều khác đi. <code>-Fd -j4</code> ở đây <em>không</em> nhanh hơn — bốn luồng trên một cơ sở dữ liệu nhỏ, cùng nói chuyện qua một mạng ảo, chẳng được gì; dump song song chỉ đáng khi cơ sở dữ liệu lớn có nhiều bảng lớn, không phải một cái 191 MB. Và MỨC NÉN quan trọng hơn định dạng: <code>-Z1</code> nhanh gần bằng plain mà chỉ to hơn mức 6 đúng một megabyte.</p>

<h3>zstd: kiểu nén mà có lẽ bạn nên dùng</h3>
<p><code>pg_dump</code> 16 nhận <code>--compress=zstd</code> và <code>--compress=lz4</code> ngoài gzip. Ba lần cho mỗi kiểu, trên cùng cơ sở dữ liệu:</p>
<pre><code class="language-bash">for c in gzip:6 lz4 zstd; do for i in 1 2 3; do
  t0=\$(date +%s%N); pg_dump -d thu -Fc --compress=\$c -f thu.\$i.c; t1=\$(date +%s%N)
  echo "\$c \$(( (t1-t0)/1000000 )) ms \$(stat -c%s thu.\$i.c)"
done; done</code></pre>
<div class="out">gzip:6 2709 ms 13254204
gzip:6 1386 ms 13254204
gzip:6 1359 ms 13254204
lz4 583 ms 22270996
lz4 522 ms 22270996
lz4 509 ms 22270996
zstd 508 ms 10384319
zstd 499 ms 10384319
zstd 487 ms 10384319</div>
<p>zstd cho ra tệp <strong>NHỎ NHẤT</strong> (10,4 MB so với 13,3) trong khoảng <strong>một phần ba thời gian</strong> của gzip. lz4 nhanh ngang nhưng to hơn 70%. Cái giá là tính tương thích: <code>pg_restore</code> đọc tệp này phải từ bản 16 trở lên và được dựng có zstd. Ảnh chính thức và gói của Ubuntu 24.04 đều đáp ứng, nhưng đó đúng là loại thứ hỏng trên cái máy duy nhất bạn không nghĩ tới — cái laptop cũ bạn lôi ra phục hồi lúc khẩn cấp. Chọn gì thì chọn, ghi nó vào sổ tay phục hồi.</p>

<table><thead><tr><th>Cờ</th><th>Làm gì</th><th>Khi nào cần</th></tr></thead><tbody>
<tr><td><code>-d thu</code></td><td>cơ sở dữ liệu nào</td><td>luôn luôn — dựa vào <code>PGDATABASE</code> là cách dump nhầm cơ sở dữ liệu (10.3)</td></tr>
<tr><td><code>-Fc</code> / <code>-Fd</code> / <code>-Fp</code></td><td>kho lưu custom / thư mục / SQL thuần</td><td><code>-Fc</code> làm mặc định; <code>-Fd</code> cho cơ sở dữ liệu lớn muốn dump song song</td></tr>
<tr><td><code>--compress=zstd</code> (hoặc <code>-Z1</code>…<code>-Z9</code>)</td><td>kiểu nén và mức nén</td><td>chọn một lần, đo một lần, ghi lại</td></tr>
<tr><td><code>-j 4</code></td><td>số luồng song song</td><td>khi DUMP thì chỉ đi với <code>-Fd</code></td></tr>
<tr><td><code>-f tệp</code></td><td>tệp đầu ra</td><td>tốt hơn <code>&gt;</code> — tệp không bị tạo bởi một shell không nhìn thấy mã thoát của <code>pg_dump</code></td></tr>
<tr><td><code>--no-owner</code>, <code>--no-privileges</code></td><td>bỏ <code>ALTER … OWNER</code> và <code>GRANT</code></td><td>khi phục hồi lên máy có tên vai trò khác — thường nên quyết lúc PHỤC HỒI thì hơn</td></tr>
</tbody></table>

<h3>Tự chạy: chứng minh bản dump là một ảnh chụp</h3>
<p>"Nhất quán với khoảnh khắc nó bắt đầu" là một khẳng định bạn kiểm được trong ba mươi giây. Cho một bản dump chạy nền, ghi và <em>CHỐT</em> một dòng trong lúc nó chạy, rồi nhìn vào trong bản dump:</p>
<pre><code class="language-bash">#!/bin/bash
<span class="tok-comment"># anh-chup.sh — ghi MOT dong vao giua luc pg_dump dang chay</span>
set -euo pipefail
cd ~/sl
T0=\$(date +%s%N); ms() { echo \$(( (\$(date +%s%N)-T0)/1000000 )); }
echo "[\$(ms) ms] luc bat dau: nguoi_dung = \$(psql -d thu -Atc 'select count(*) from nguoi_dung')"
pg_dump -d thu -Fc -f anh.dump &amp; P=\$!
sleep 0.2
psql -d thu -qc "insert into nguoi_dung values (7, 'ghi giua chung');"
echo "[\$(ms) ms] da ghi va CHOT dong id=7 (pg_dump van dang chay)"
wait \$P; echo "[\$(ms) ms] pg_dump xong, ma thoat \$?"
echo "trong CSDL that : nguoi_dung = \$(psql -d thu -Atc 'select count(*) from nguoi_dung')"
echo "trong ban dump  : nguoi_dung = \$(pg_restore -a -t nguoi_dung -f - anh.dump | grep -cE '^[0-9]+	')"</code></pre>
<div class="out">[1 ms] luc bat dau: nguoi_dung = 6
[399 ms] da ghi va CHOT dong id=7 (pg_dump van dang chay)
[1757 ms] pg_dump xong, ma thoat 0
trong CSDL that : nguoi_dung = 7
trong ban dump  : nguoi_dung = 6</div>
<p>Dòng đó được chốt ở mốc 399 ms, 1,4 giây TRƯỚC khi <code>pg_dump</code> xong, và nó không có trong bản dump. <code>pg_restore -a -t nguoi_dung -f -</code> in đúng phần dữ liệu của một bảng ra dạng chữ thay vì nạp vào đâu cả — cách rẻ để nhìn vào trong một kho lưu custom. Đó là lời bảo đảm đang làm việc: mọi bảng trong tệp khớp với mọi bảng khác, tại mốc 0 ms. Nếu một lượt tải lên ghi tệp xuống đĩa ở mốc 399 ms kèm dòng của nó, thì tệp nằm trên đĩa còn dòng thì KHÔNG có trong bản sao lưu.</p>

<h3>Script sao lưu mà chương này dựng</h3>
<p>Script cron ở trên làm ra một TỆP. Script dưới đây — dùng suốt phần còn lại của chương — làm ra một BẢN SAO LƯU: dữ liệu, vai trò, một bản kê những gì bản dump phải chứa, dấu vân tay, mã hoá, và một bản ra khỏi máy. Dòng nào có mặt cũng vì một bài sau đã đo cái gì hỏng khi thiếu nó:</p>
<pre><code class="language-bash">#!/bin/bash
<span class="tok-comment"># sao-luu.sh — dump + vai tro + ban ke, ma hoa bang age, dua sang may kho</span>
set -Eeuo pipefail
umask 077
DB=thu; DICH=~/sao-luu; TEN="\$DB-\$(date +%Y%m%d-%H%M)"
TAM=\$(mktemp -d); trap 'rm -rf "\$TAM"' EXIT

pg_dump -d "\$DB" -Fc --compress=zstd -f "\$TAM/csdl.dump"
pg_dumpall --roles-only -f "\$TAM/vai-tro.sql"
<span class="tok-comment"># ban ke: dem so dong NGAY TRONG ban dump (doc het tep = bat duoc tep cut cut)</span>
pg_restore -f - "\$TAM/csdl.dump" | awk '/^COPY /{t=\$2;n=0;next}
  /^\\\\\\.\$/{print t, n; t="";next} t!=""{n++}' &gt; "\$TAM/ban-ke.txt"
(cd "\$TAM" &amp;&amp; sha256sum csdl.dump vai-tro.sql ban-ke.txt &gt; sha256.txt)

tar -C "\$TAM" -cf - . | age -R ~/nguoi-nhan.txt -o "\$DICH/\$TEN.tar.age.tam"
mv "\$DICH/\$TEN.tar.age.tam" "\$DICH/\$TEN.tar.age"
rclone copy "\$DICH/\$TEN.tar.age" kho:kho/
echo "\$(date -Is) OK \$TEN.tar.age \$(stat -c%s "\$DICH/\$TEN.tar.age")" &gt;&gt; "\$DICH/so-sach.log"</code></pre>
<div class="kv-grid">
<div class="kv"><span class="k"><code>set -Eeuo pipefail</code></span><span class="v">bất kỳ lệnh nào hỏng — kể cả <code>pg_dump</code> nằm giữa một ống dẫn — đều dừng script (Chương 7). Thiếu <code>pipefail</code> thì <code>pg_dump … | age …</code> báo mã thoát của age, và một bản dump hỏng trông vẫn ổn.</span></div>
<div class="kv"><span class="k"><code>umask 077</code></span><span class="v">mọi tệp script tạo ra chỉ chủ của nó đọc được; tệp vai trò chứa mã băm mật khẩu (10.5).</span></div>
<div class="kv"><span class="k"><code>mktemp -d</code> + <code>trap … EXIT</code></span><span class="v">bản dump CHƯA mã hoá chỉ sống trong một thư mục tạm riêng, bị xoá trên mọi đường ra, thành công hay thất bại.</span></div>
<div class="kv"><span class="k"><code>pg_restore -f - … | awk</code></span><span class="v">biến bản dump lại thành chữ và đếm số dòng của từng khối <code>COPY</code>. Nó đọc HẾT tệp, nên một bản dump cụt hỏng NGAY Ở ĐÂY, lúc sao lưu; và các con số trở thành bản kê mà một máy khác dùng để đối chiếu (10.4). Trên cơ sở dữ liệu này nó tốn thêm khoảng một giây.</span></div>
<div class="kv"><span class="k"><code>sha256sum</code></span><span class="v">dấu vân tay, để máy phục hồi chứng minh được nó nhận ĐÚNG những byte ấy.</span></div>
<div class="kv"><span class="k"><code>age -R</code></span><span class="v">mã hoá bằng khoá <em>CÔNG KHAI</em>: máy chủ này mã hoá được nhưng KHÔNG giải mã được (10.7).</span></div>
<div class="kv"><span class="k"><code>.tam</code> rồi <code>mv</code></span><span class="v">một bản sao lưu viết dở không bao giờ mang cái tên của bản đã xong.</span></div>
<div class="kv"><span class="k"><code>rclone copy</code></span><span class="v">một bản sống sót qua việc mất trắng cái máy này (10.7).</span></div>
</div>
<p>Đo trên VPS thí nghiệm: <code>real 0m2.743s</code> cho cả script, và một tệp <code>.tar.age</code> 10.396.328 byte nằm cả trong <code>~/sao-luu</code> lẫn trên máy kho.</p>

<h3>Cái cờ âm thầm làm hỏng bản dump: <code>docker exec -t</code></h3>
${slide('dv-10', 7, 'docker exec -t làm hỏng bản dump: to thêm 47.828 byte, pg_restore segfault 139')}
<p>Khi PostgreSQL chạy trong container, bản sao lưu thường là <code>docker exec &lt;container&gt; pg_dump … &gt; tệp</code> trên máy chủ. Người ta chép dòng đó từ một phiên gõ tay có <code>docker exec -it</code>, và đúng một chữ cái ấy là chuyện lớn. Đo trên máy chạy Docker với cùng cơ sở dữ liệu:</p>
<pre><code class="language-bash">docker exec    dv10-pg pg_dump -U postgres -Fc thu &gt; khong-t.dump; echo "khong -t: exit=\$?"
docker exec -t dv10-pg pg_dump -U postgres -Fc thu &gt; co-t.dump;    echo "co -t: exit=\$?"
ls -l khong-t.dump co-t.dump | awk '{print \$5, \$9}'
pg_restore --list co-t.dump &gt; /tmp/l.txt 2&gt;&amp;1; echo "pg_restore --list exit=\$?"</code></pre>
<div class="out">khong -t: exit=0
co -t: exit=0
13302026 co-t.dump
13254198 khong-t.dump
pg_restore --list exit=139
Segmentation fault</div>
<p><code>-t</code> cấp cho tiến trình một terminal ảo, và một terminal dịch mọi byte xuống dòng thành "về đầu dòng + xuống dòng". Với tệp chữ thì mỗi dòng mang thêm một <code>\\r</code>; với một kho lưu nhị phân đã nén thì nó chèn 47.828 byte vào những chỗ ngẫu nhiên. Cả hai lệnh <code>docker exec</code> đều thoát 0, tệp có kích thước hợp lý, và dấu hiệu DUY NHẤT là <code>pg_restore</code> sập vì lỗi phân đoạn (mã 139) — đúng vào ngày bạn cần nó. Dump thì bỏ <code>-t</code>, hoặc ghi tệp BÊN TRONG container (<code>pg_dump -f /tmp/x.dump</code>) rồi chép ra bằng <code>docker cp</code>.</p>

<h3>Công cụ phải mới ít nhất bằng máy chủ</h3>
<p><code>pg_dump</code> từ chối dump một máy chủ mới hơn chính nó. Đo bằng công cụ PostgreSQL 15 chĩa vào máy chủ 16:</p>
<div class="out">pg_dump (PostgreSQL) 15.4 (Debian 15.4-2.pgdg120+1)
pg_dump: error: aborting because of server version mismatch
pg_dump: detail: server version: 16.15 (Debian 16.15-1.pgdg12+2); pg_dump version: 15.4 (Debian 15.4-2.pgdg120+1)
ma thoat 1</div>
<p>Và chiều ngược lại, một kho lưu bản 16 đọc bằng <code>pg_restore</code> 15: <code>pg_restore: error: unsupported version (1.15) in file header</code>. Đây không phải giả định: trong sự cố của GitLab ngày 31/01/2017, các bản sao lưu <code>pg_dump</code> của họ đã hỏng câm từ trước vì job sao lưu dùng công cụ PostgreSQL 9.2 chĩa vào máy chủ 9.6, và thư báo lỗi thì bị máy nhận từ chối. Nâng cấp PostgreSQL nghĩa là nâng cấp CẢ cái máy chạy sao lưu — và kiểm mã thoát mỗi đêm, đó là việc của <code>set -e</code>.</p>

<h3>Trên macOS và Windows</h3>
<ul>
<li><strong><code>pg_dump</code> trên Mac của bạn có lẽ CŨ hơn máy chủ.</strong> Máy Mac dùng cho chương này có <code>pg_restore (PostgreSQL) 14.19</code> của Homebrew; chĩa vào máy chủ 16 nó sẽ dừng với đúng lỗi lệch phiên bản ở trên. Hoặc cài đúng bản (<code>brew install postgresql@16</code>), hoặc chạy công cụ từ chính ảnh của máy chủ: <code>docker run --rm postgres:16 pg_dump …</code>.</li>
<li><strong>Bạn cùng nhóm dùng Windows:</strong> một <code>sao-luu.sh</code> lưu với kết thúc dòng CRLF sẽ hỏng trên máy chủ trước khi kịp làm gì (Chương 7). Chạy script sao lưu TRÊN máy chủ, đừng chạy từ shell Windows, và giữ nó trong git với <code>* text=auto eol=lf</code>.</li>
<li><strong>Dump qua SSH từ laptop</strong> (<code>ssh vps pg_dump … &gt; tệp</code>) kéo cả cơ sở dữ liệu qua mạng nhà bạn — ổn cho một bản bạn muốn có ở máy mình, và là một thứ thay thế tồi cho một bản sao lưu phải chạy dù laptop có mở hay không.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> dòng cron sao lưu của một bạn trong nhóm là <code>docker exec -it pg pg_dump -Fc app &gt; /srv/app.dump</code>, và "bản sao lưu vẫn ổn cả tháng nay". Chứng minh trên máy thí nghiệm xem có đúng không, và thay dòng đó bằng một dòng bạn bảo vệ được.</p>
<ol>
<li>Dựng một container PostgreSQL (<code>pgvector/pgvector:pg16</code>, tên <code>dv10-pg</code>, nhãn <code>dvhoc=10</code>) và tạo một bảng vài trăm nghìn dòng (<code>insert … select generate_series(1,400000)</code>).</li>
<li>Dump hai lần từ máy chủ, một lần có <code>docker exec -t</code>, một lần không. So kích thước và chạy <code>pg_restore --list</code> trên cả hai; ghi lại hai mã thoát.</li>
<li>Bấm giờ <code>-Fp</code>, <code>-Fc</code> và <code>-Fc --compress=zstd</code>, mỗi cái ba lần, trên máy CỦA BẠN; ghi trung vị và kích thước.</li>
<li>Chạy <code>anh-chup.sh</code> (ở trên) với bảng của bạn và xác nhận dòng ghi giữa lúc dump không có trong tệp.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có bảng ba định dạng kèm thời gian và kích thước đo trên máy mình, hai tệp dump mà mã thoát <code>pg_restore --list</code> khác nhau (0 và 139), và một dòng cron thay thế dùng <code>-Fc</code>, không <code>-t</code>, ghi ra tên <code>.tam</code> và chỉ đổi tên khi thành công.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">pg_dump (công cụ dump)</span><span class="v">Ghi MỘT cơ sở dữ liệu ra tệp, từ một ảnh chụp nhất quán duy nhất.</span></div>
  <div class="kv"><span class="k">custom format -Fc (định dạng kho lưu)</span><span class="v">Kho lưu đã nén có mục lục, phục hồi được song song và từng bảng một.</span></div>
  <div class="kv"><span class="k">snapshot (ảnh chụp)</span><span class="v">Cái nhìn về dữ liệu tại khoảnh khắc giao dịch của bản dump bắt đầu; thứ chốt sau đó không có trong nó.</span></div>
  <div class="kv"><span class="k">zstd (kiểu nén zstd)</span><span class="v">Kiểu nén hiện đại; với pg_dump 16 nó cho tệp nhỏ nhất, nhanh nhất.</span></div>
  <div class="kv"><span class="k">pseudo-terminal -t (terminal ảo)</span><span class="v">Terminal giả, đổi byte xuống dòng — vô hại khi gõ phím, chết người với đầu ra nhị phân.</span></div>
  <div class="kv"><span class="k">version mismatch (lệch phiên bản)</span><span class="v">pg_dump từ chối máy chủ mới hơn nó; pg_restore từ chối kho lưu mới hơn nó.</span></div>
  <div class="kv"><span class="k">manifest (bản kê)</span><span class="v">Danh sách những gì bản sao lưu phải chứa — ở đây là số dòng từng bảng đếm từ chính bản dump.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>SQL thuần ghi nhanh nhất và to gấp nhiều lần; định dạng custom mới là thứ để phục hồi.</li>
<li>Với pg_dump 16, <code>--compress=zstd</code> cho tệp nhỏ nhất trong một phần ba thời gian của gzip — nếu mọi máy phục hồi đọc được nó.</li>
<li>Bản dump là ảnh chụp lúc nó BẮT ĐẦU: một dòng chốt 1,4 giây trước khi nó xong không có trong nó.</li>
<li><code>docker exec -t</code> làm hỏng bản dump nhị phân trong khi mọi lệnh thoát 0; <code>pg_restore</code> sau đó sập với mã 139.</li>
<li>Công cụ sao lưu phải mới ít nhất bằng máy chủ — GitLab mất bản dump vì dùng công cụ 9.2 cho máy chủ 9.6.</li>
<li>Một script sao lưu không chỉ là <code>pg_dump</code>: vai trò, bản kê, vân tay, mã hoá và một bản ngoài máy, cái nào cũng có lý do.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitLab — Postmortem of database outage of January 31</span><span class="lc-sub">about.gitlab.com/blog/postmortem-of-database-outage-of-january-31/ — bản dump pg_dump hỏng câm vì công cụ 9.2 chạy với máy chủ 9.6, và thư báo lỗi bị DMARC từ chối.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker — docker container exec</span><span class="lc-sub">docs.docker.com/reference/cli/docker/container/exec/ — <code>-t</code> (cấp một pseudo-TTY) thật ra làm gì.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — pg_dump</span><span class="lc-sub">postgresql.org/docs/current/app-pgdump.html — các cờ định dạng, <code>-j</code> cho định dạng thư mục, và ghi chú rằng bản dump là ảnh chụp của LÚC giao dịch BẮT ĐẦU.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — Backup and Restore</span><span class="lc-sub">postgresql.org/docs/current/backup.html — ba chiến lược (dump SQL, ảnh chụp hệ tệp, lưu trữ liên tục) và lúc nào thì từng cái thôi còn đủ.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nice(1) và ionice(1)</span><span class="lc-sub">man 1 ionice — lớp 3 (idle) là thứ làm cho một bản sao lưu NHƯỜNG đĩa cho lưu lượng thật thay vì tranh giành với nó.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — MVCC, ảnh chụp và giao dịch dài</span><span class="lc-sub">/courses/postgresql/learn${REF} — vì sao một bản dump chạy lâu chặn VACUUM, và nó gây phình bảng thế nào trên một bảng bận rộn.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 10.2 ─────────────────────────── */
    {
      title: '10.2 — The restore is the number that matters|||10.2 — PHỤC HỒI mới là con số quan trọng',
      slug: 'deploy-10-2-phuc-hoi',
      type: 'VIDEO',
      description: 'Phục hồi chậm hơn sao lưu 2-3 lần, và bốn luồng song song cắt xuống còn 2.123 ms. Rồi cái bước ai cũng quên: thiếu ANALYZE thì cùng một truy vấn chạy chậm hơn 2,5 lần, vì bộ lập kế hoạch ước lượng 834 dòng thay vì 124.946.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2</span>
<h2>The restore is the number that matters</h2>
<p class="lead">Nobody is ever waiting on a backup. Everybody is waiting on a restore, usually while the site is down, usually without having any idea how long it takes — because nobody has ever run one.</p>

<h3>Restoring the same data three ways</h3>
${slide('dv-10', 8, 'Phục hồi chậm hơn dump; -j4 gỡ lại — đo sang máy thứ hai')}
<div class="out">=== PHUC HOI tu plain SQL ===
  psql -f sl.sql : 3431 ms      lon=400170  bf=300000

=== PHUC HOI tu custom, MOT luong ===
  pg_restore     : 3274 ms

=== PHUC HOI tu custom, 4 luong song song ===
  pg_restore -j4 : 2123 ms      lon=400170  bf=300000</div>

<p>Two things fall out. First, <strong>a restore takes two to three times longer than the dump it came from</strong> — 2,123–3,431 ms against 1,165–2,379. Restoring means parsing, inserting, and rebuilding every index, and index construction is the expensive part.</p>

<p>Second, <code>-j4</code> cut the restore by 35%. That flag only works on custom and directory formats — plain SQL is a single stream of statements that has to be executed in order, so there is nothing to parallelise. This is the practical reason 10.1 recommended <code>-Fc</code>.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">plain + psql</span><span class="lz-t">3,431 ms</span><span class="lz-d">one ordered stream; nothing to parallelise</span></div>
<div class="lz-step"><span class="lz-k">custom + pg_restore</span><span class="lz-t">3,274 ms</span><span class="lz-d">same work, reading a compressed archive</span></div>
<div class="lz-step"><span class="lz-k">custom + pg_restore -j4</span><span class="lz-t">2,123 ms</span><span class="lz-d">35% faster — tables and indexes built concurrently</span></div>
</div>

<h3>The whole pipeline, timed</h3>
${slide('dv-10', 9, 'Bấm giờ trọn cú phục hồi sang một máy MỚI: 9,6 giây')}
<p>What an actual recovery looks like — decompress, restore, and the step everybody forgets:</p>

<div class="out">  giai nen : 868 ms
  phuc hoi : 3170 ms
  analyze  : 399 ms   ← quen buoc nay thi CSDL cham hang gio sau do
  TONG     : 4437 ms</div>

<h3>Proving the ANALYZE claim</h3>
${slide('dv-10', 10, 'Thiếu ANALYZE: kế hoạch dựng trên đoán mò')}
<p>That comment is a strong assertion, so here it is measured rather than asserted. A join query, run immediately after restore and then again after <code>ANALYZE</code>:</p>

<div class="out">=== CHUA analyze — ke hoach truy van ===
   ->  Nested Loop  (cost=0.42..20382.92 rows=625 width=0)
         ->  Parallel Seq Scan on lon l  (cost=0.00..16428.22 rows=834 width=4)
  thoi gian 3 lan: 230.9 ms | 223.7 ms | 255.2 ms

=== sau ANALYZE ===
   ->  Parallel Hash Join  (cost=5938.59..22804.31 rows=124946 width=0)
         Hash Cond: (l.id = b.id)
  thoi gian 3 lan: 83.7 ms | 90.1 ms | 101.1 ms</div>

<div class="callout warn">
<p><strong>2.5× slower, and the mechanism is visible in the plan.</strong> With no statistics the planner estimated <strong>834</strong> rows and chose a nested loop, which is the right plan for 834 rows. The true number is <strong>124,946</strong>. After <code>ANALYZE</code> it saw the real figure and switched to a hash join. Nothing was broken — the planner made a reasonable decision from the only information it had, which was none.</p>
</div>

<p>The reason this bites specifically after a restore is that <code>pg_restore</code> does not run <code>ANALYZE</code> and autovacuum has not had time to. Your database comes back up, serves traffic, and is quietly several times slower than it was — until autovacuum eventually gets round to it, which on a large table under load can be a long time.</p>

<h3>RTO and RPO, as numbers you can actually state</h3>
${slide('dv-10', 11, 'RPO và RTO trên một trục thời gian')}
<div class="kv-grid">
<div class="kv"><span class="k">RTO — recovery time objective</span><span class="v">how long from "it is gone" to "it is serving". Measured above: 4.4 s of database work, plus everything in 10.5</span></div>
<div class="kv"><span class="k">RPO — recovery point objective</span><span class="v">how much data you accept losing. With a nightly dump it is <strong>up to 24 hours</strong>, and the number is decided by your cron schedule, not by your intentions</span></div>
<div class="kv"><span class="k">the honest version of RPO</span><span class="v">"we lose everything since 03:15 this morning". Say it out loud before an incident, because you will have to say it during one</span></div>
<div class="kv"><span class="k">how to shrink RPO</span><span class="v">more frequent dumps (linear, cheap, still hours), or continuous WAL archiving (minutes, and much more machinery)</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — my 4.4 seconds is a 192 MB database, and restore time does not scale gently.</strong> Doubling the data more than doubles the restore, because index construction grows faster than linearly and because a large restore stops fitting in memory. Do not extrapolate my number to your database — <em>measure yours</em>, once, with a stopwatch, and write the figure down where the person doing the recovery will find it. That single measured number is the most useful sentence in any runbook: "a full restore of production takes about 40 minutes."</p>
</div>

<h3>Restoring one table instead of everything</h3>
${slide('dv-10', 12, 'Seed lại xoá tiến độ qua CASCADE — cứu MỘT bảng')}
<p>The most common real recovery is not "the server burned down" — it is "somebody ran a DELETE without a WHERE at 14:20". You do not want last night&#39;s whole database back; you want one table as of 03:15, next to the current one:</p>

<pre><code><span class="tok-comment"># chi mot bang, vao mot CSDL TAM — KHONG de len production</span>
psql -c "create database cuu;"
pg_restore -d cuu -t don sao-luu.dump

<span class="tok-comment"># roi doi chieu, va chep lai dung phan can</span>
psql -d cuu -c "select count(*) from don;"
psql -d thu -c "insert into don select * from cuu_don_da_chep where id not in (select id from don);"</code></pre>

<p>This is only possible because the format has a table of contents. With a plain SQL dump the equivalent is grepping a 129 MB text file for the right <code>COPY</code> block, which is possible and unpleasant.</p>

<div class="callout ok">
<p><strong>Never restore over the live database.</strong> Restore into a new database on the same server, look at it, and copy across only what you need. A restore that runs directly over production turns a recoverable mistake into an unrecoverable one — you have replaced the rows written since the backup with nothing, and Chapter 6 already measured that those rows do not come back.</p>
</div>

<h3>Measured again, onto a second machine</h3>
<p>A restore that matters happens on a machine other than the one that died. So the re-measurement on 29/09/2026 restored from the lab VPS into a <em>second</em> PostgreSQL container, <code>dv10-may2</code> (same <code>pgvector/pgvector:pg16</code> image, 1 GB of memory), creating a fresh database for every attempt:</p>
<pre><code class="language-bash">#!/bin/bash
<span class="tok-comment"># do-phuc-hoi.sh — bam gio phuc hoi sang MAY THU HAI (may2), moi lan mot CSDL moi</span>
set -euo pipefail
cd ~/sl; export PGHOST=may2
psql -qd postgres -c "create role ung_dung" 2&gt;/dev/null || true
lan() { local ten=\$1; shift; dropdb --if-exists ph; createdb ph
  local t0=\$(date +%s%N); "\$@" &gt;/dev/null 2&gt;&amp;1; local t1=\$(date +%s%N)
  printf '  %-26s %6d ms   lon=%s\\n' "\$ten" \$(( (t1-t0)/1000000 )) "\$(psql -d ph -Atc 'select count(*) from lon')"; }
lan "psql -f thu.sql"        psql -q -d ph -v ON_ERROR_STOP=1 -f thu.sql
lan "pg_restore (1 luong)"   pg_restore -d ph thu.dump
lan "pg_restore -j4"         pg_restore -j4 -d ph thu.dump</code></pre>
<div class="out">  psql -f thu.sql              4688 ms   lon=400170
  pg_restore (1 luong)         5228 ms   lon=400170
  pg_restore -j4               2370 ms   lon=400170
…
  psql -f thu.sql              4473 ms   lon=400170
  pg_restore (1 luong)         4961 ms   lon=400170
  pg_restore -j4               2390 ms   lon=400170
…
  psql -f thu.sql              6731 ms   lon=400170
  pg_restore (1 luong)         4811 ms   lon=400170
  pg_restore -j4               4197 ms   lon=400170</div>
<p>Across three runs: plain SQL 4.5–6.7 s, custom single-threaded 4.8–5.2 s, <code>-j4</code> 2.4–4.2 s. Against a median dump time of 1.9 s for the same custom file, the restore again took two to three times longer, and <code>-j4</code> again recovered most of that. The absolute numbers are bigger than the old ones because this database has more indexes (an HNSW index on the vectors is expensive to build) and because the restore crosses a network — both true of a real recovery.</p>
<table><thead><tr><th><code>pg_restore</code> flag</th><th>What it does</th><th>Use it when</th></tr></thead><tbody>
<tr><td><code>-d db</code></td><td>restore into this database (which must exist)</td><td>always; without <code>-d</code> it prints SQL instead of restoring</td></tr>
<tr><td><code>-j N</code></td><td>N parallel workers for data and index builds</td><td>custom or directory format; N ≈ CPU cores of the target</td></tr>
<tr><td><code>-t table</code>, <code>-n schema</code></td><td>restore only these</td><td>rescuing one table (below)</td></tr>
<tr><td><code>-a</code> / <code>-s</code></td><td>data only / schema only</td><td>loading rows into a table that already exists</td></tr>
<tr><td><code>--no-owner</code></td><td>skip <code>ALTER … OWNER TO</code></td><td>the target has different role names</td></tr>
<tr><td><code>--exit-on-error</code>, <code>--single-transaction</code></td><td>stop at the first error / all or nothing</td><td>whenever a partial database is worse than none (10.3)</td></tr>
<tr><td><code>-l</code> / <code>-L list</code></td><td>print the table of contents / restore only the entries in a list file</td><td>fine-grained selection, reordering</td></tr>
</tbody></table>

<h3>The whole recovery on a new machine, stopwatch in hand</h3>
<p>The 4.4 s above timed decompress, restore and analyze. A recovery begins earlier — with no database server at all. The rehearsal below starts a brand-new PostgreSQL container and then runs the verification script from Lesson 10.4 against it from the storage machine, which holds the encrypted backup and the key:</p>
<pre><code class="language-bash">docker run -d --name dv10-may3 --network dv10-net --memory 1g \\
  -e POSTGRES_PASSWORD=12345 pgvector/pgvector:pg16
until docker logs dv10-may3 2&gt;&amp;1 | grep -q "init process complete" &amp;&amp; \\
      docker exec dv10-may3 pg_isready -q -U postgres; do sleep 0.2; done
docker exec -u deploy dv10-kho bash -c 'cd ~/kho; kiem-may-khac.sh \$(ls *.age | tail -1) may3'</code></pre>
<div class="out">[3809 ms] may moi: Postgres san sang (da qua 'init process complete')
  [75 ms] giai ma + sha256 khop
  [145 ms] tao vai tro
  [4315 ms] pg_restore -j4 xong, ma thoat 0, 0 dong loi
  [5155 ms] analyze
    ✓ public.bai_hoc         120
    …
    ✓ public.tien_do         320
    truy van mau (hnsw): id=150
  [5588 ms] doi chieu xong
  ✓ PHUC HOI DUOC — khop ban ke
[9571 ms] TONG</div>
<p>From "no server" to "every table verified": <strong>9.6 seconds</strong>, of which 3.8 s was PostgreSQL initialising itself and 4.2 s was <code>pg_restore</code>. Decryption and roles were noise. The same measurement on the real site, the first time anyone ran it (18/08/2026), was 281 tables and 223,382 rows in 16 seconds. Both numbers are the <em>database</em> part of an RTO; 10.5 lists what surrounds it.</p>
<div class="callout warn"><p><strong>Why the loop waits for <code>init process complete</code> and not just <code>pg_isready</code>.</strong> The official image initialises a new database with a temporary server listening only on its Unix socket, runs the init scripts, then shuts that server down and starts the real one. <code>docker exec … pg_isready</code> can answer "accepting connections" from the temporary server; a restore started in that window is cut off when it shuts down. Three attempts in the lab did not hit the window — it is narrow and machine-dependent — but on the real storage machine it happened, and it looked exactly like an empty dump: zero tables in one second. Wait for the log line, then check readiness.</p></div>

<h3>ANALYZE, re-measured: the estimate is always wrong, the slowdown is not guaranteed</h3>
<p>The measurement above (834 estimated rows, nested loop, 2.5× slower) was repeated on the second machine with autovacuum turned off, so that nothing could quietly run <code>ANALYZE</code> first:</p>
<pre><code class="language-bash">Q="select count(*) from lon l join bf b on b.id = l.id where l.du_lieu like 'a%'"
psql -d ph -Atc "explain \$Q" | grep -E 'Join|Nested Loop' | head -1     <span class="tok-comment"># ke hoach</span>
psql -d ph -Atc "explain (analyze, format json) \$Q" | jq -r '.[0]["Execution Time"]'   <span class="tok-comment"># x3</span></code></pre>
<div class="out">=== NGAY sau pg_restore — chua ai chay ANALYZE ===
              ->  Nested Loop  (cost=0.42..20896.25 rows=625 width=0)
61.157 ms | 42.949 ms | 38.507 ms |
=== sau ANALYZE ===
              ->  Parallel Hash Join  (cost=17074.53..21254.47 rows=10695 width=0)
81.161 ms | 84.751 ms | 71.832 ms |
so dong that: 18681</div>
<p>The mechanism reproduced exactly: with no statistics the planner guessed <strong>625</strong> rows where there were <strong>18,681</strong> — thirty times too few — and chose a nested loop; after <code>ANALYZE</code> it switched to a hash join. The <em>speed</em> did not reproduce: here, with everything in memory on a fast SSD, the "wrong" plan was actually a little faster (38–61 ms against 72–85). A second run gave the same shape. So the honest statement is not "a missing ANALYZE makes queries 2.5× slower" — it is "a missing ANALYZE makes the planner decide from guesses, and whether a guess costs you 2.5× or nothing depends on your data and your hardware". You do not want to find out which on the morning after an incident.</p>
<p>And how long does the window last if you forget? Restoring again with autovacuum <strong>on</strong> (the default, <code>autovacuum_naptime = 1min</code>) and polling every five seconds:</p>
<div class="out">0 s: da tu analyze 0|8 bang
…
15 s: da tu analyze 0|8 bang
20 s: da tu analyze 7|8 bang
…
149 s: da tu analyze 7|8 bang</div>
<div class="out">    relname     | n_live_tup | n_mod_since_analyze | da_tu_analyze
----------------+------------+---------------------+---------------
 nguoi_dung     |          6 |                   6 | f
 bai_hoc        |        120 |                   0 | t
 …
 lon            |     400170 |                   0 | t</div>
<p>Seven of eight tables were analysed about 20 seconds after the restore — much sooner than the old text feared, on a database this small. The eighth, <code>nguoi_dung</code> with six rows, was <strong>never</strong> analysed: autovacuum only analyses a table after <code>autovacuum_analyze_threshold</code> (50) plus 10% of its rows have changed, and six rows never reach 50. Small lookup tables — roles, settings, plans — are exactly the ones that sit in every join. Run <code>ANALYZE</code> yourself as the last step of every restore; it cost 0.8 s here.</p>

<h3>Rescuing one table for real: the seed that wiped everyone's progress</h3>
<p>The snippet above ends with <code>insert into don select * from cuu_don_da_chep …</code>, which skips the hard part: PostgreSQL cannot query across databases, so rows in <code>cuu</code> have to be carried into the live database first. Here is the whole procedure on a failure that really happened on the site this course follows. A seeding script "deleted everything and recreated it" for a table of lesson steps. The table of per-user progress referenced those steps with <code>ON DELETE CASCADE</code>, so every re-seed silently deleted every user's "done" marks — no error, no log, the step count still correct.</p>
<pre><code class="language-bash">#!/bin/bash
<span class="tok-comment"># cuu-tien-do.sh — seed lai xoa tien do qua ON DELETE CASCADE, roi cuu MOT bang tu ban sao luu</span>
set -euo pipefail
cd ~/sl
pg_dump -d thu -Fc -f dem-qua.dump                        <span class="tok-comment"># ban sao luu "03:15"</span>
echo "truoc seed : tien_do = \$(psql -d thu -Atc 'select count(*) from tien_do')"
psql -d thu -q -v ON_ERROR_STOP=1 &lt;&lt;'SQL'
begin;                                  -- "seed lai": xoa het bai hoc roi tao lai
delete from bai_hoc;
insert into bai_hoc(slug, tieu_de) select 'bai-'||g, 'Bai '||g from generate_series(1,120) g;
commit;
SQL
echo "seed bao OK, ma thoat \$? — bai_hoc = \$(psql -d thu -Atc 'select count(*) from bai_hoc'), tien_do = \$(psql -d thu -Atc 'select count(*) from tien_do')"

<span class="tok-comment"># 1) phuc hoi HAI bang vao mot CSDL tam, khong dung vao production</span>
dropdb --if-exists cuu; createdb cuu
pg_restore -d cuu -t bai_hoc -t tien_do dem-qua.dump
<span class="tok-comment"># 2) id da doi sau seed =&gt; doi chieu bang slug, khong bang id</span>
psql -d cuu -c "\\copy (select t.nguoi_dung_id, b.slug, t.xong_luc from tien_do t join bai_hoc b on b.id = t.bai_hoc_id) to 'tien-do.csv' csv"
psql -d thu -v ON_ERROR_STOP=1 &lt;&lt;'SQL'
begin;
create temp table cu(nguoi_dung_id int, slug text, xong_luc timestamptz);
\\copy cu from 'tien-do.csv' csv
insert into tien_do(nguoi_dung_id, bai_hoc_id, xong_luc)
  select cu.nguoi_dung_id, b.id, cu.xong_luc from cu join bai_hoc b using (slug)
  on conflict do nothing;
commit;
SQL
echo "sau khi cuu: tien_do = \$(psql -d thu -Atc 'select count(*) from tien_do')"</code></pre>
<div class="out">truoc seed : tien_do = 320
seed bao OK, ma thoat 0 — bai_hoc = 120, tien_do = 0
NOTICE:  database "cuu" does not exist, skipping
COPY 320
BEGIN
CREATE TABLE
COPY 320
INSERT 0 320
COMMIT
sau khi cuu: tien_do = 320</div>
<div class="kv-grid">
<div class="kv"><span class="k">why a temporary database</span><span class="v"><code>pg_restore -t</code> into production would collide with the live <code>bai_hoc</code>; in <code>cuu</code> the old rows can be read without touching anything.</span></div>
<div class="kv"><span class="k">why restore <code>bai_hoc</code> too</span><span class="v">the old progress rows point at <em>old</em> ids. The seed created new ids for the same steps, so the only stable link is the natural key, <code>slug</code>.</span></div>
<div class="kv"><span class="k">why <code>\\copy</code></span><span class="v">it runs on the client, so it works without file access on the database server — including a server in a container.</span></div>
<div class="kv"><span class="k">why one transaction and <code>on conflict do nothing</code></span><span class="v">either all 320 rows come back or none do, and marks a user re-earned since the incident are not duplicated.</span></div>
<div class="kv"><span class="k">what it cannot bring back</span><span class="v">progress made between 03:15 and the seed. That is your RPO, visible in one table.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>The fix is upstream.</strong> A seed that deletes a parent table is a data-loss bug whenever a child table holding user data says <code>ON DELETE CASCADE</code>. Before writing or running any "delete and recreate", read the <code>onDelete</code> of every relation that points at the table; update rows in place and delete only what truly disappeared. A backup turned this incident from permanent into a 10-minute repair — it should not have been needed.</p></div>

<h3>On macOS and Windows</h3>
<ul>
<li><strong>Rehearsing a restore on your laptop</strong> works well in Docker Desktop, with two cautions: the VM has a fixed share of your RAM and CPUs (Settings → Resources), so <code>-j</code> above the VM's CPU count gains nothing; and the VM's disk is a single image file on your SSD, so restore times look better than on a cheap VPS disk.</li>
<li><strong>Restore into a container of the same image as production</strong>, never into a PostgreSQL installed natively on macOS or Windows "because it is also 16" — 10.4 measures what a missing extension does.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> at 14:20 a teammate runs the seed script against production "just to fix one lesson title", and the dashboard shows every student at 0% progress. The only backup is last night's custom dump. Get the progress back without restoring over production.</p>
<ol>
<li>On the lab database, create <code>bai_hoc</code> and <code>tien_do</code> with <code>ON DELETE CASCADE</code> as in <code>cuu-tien-do.sh</code>, fill them, and take a <code>-Fc</code> dump.</li>
<li>Run the "seed" (delete and recreate <code>bai_hoc</code>) and confirm <code>tien_do</code> is 0.</li>
<li>Restore both tables into a temporary database <code>cuu</code>, export progress joined to <code>slug</code> with <code>\\copy</code>, and load it back in one transaction.</li>
<li>Time a full restore of the same dump into a <em>second</em> container with <code>-j1</code> and <code>-j4</code>, then run <code>ANALYZE</code> and time it.</li>
</ol>
<p><strong>Done when:</strong> <code>select count(*) from tien_do</code> is back to its value before the seed, production was never restored over, and you can state "a full restore of this database takes X seconds on a new machine" with a number you measured.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">pg_restore</span><span class="v">Reads a custom or directory archive and loads it — in parallel, selectively, or as text.</span></div>
  <div class="kv"><span class="k">RTO</span><span class="v">How long from "it is gone" to "it is serving again"; known only by timing a real restore.</span></div>
  <div class="kv"><span class="k">RPO</span><span class="v">How much recent data you lose; set by how often you back up.</span></div>
  <div class="kv"><span class="k">ANALYZE / statistics</span><span class="v">Row counts and value distributions the planner uses; a restore does not create them.</span></div>
  <div class="kv"><span class="k">autovacuum threshold</span><span class="v">50 rows + 10% must change before a table is analysed automatically — tiny tables never are.</span></div>
  <div class="kv"><span class="k">ON DELETE CASCADE</span><span class="v">Deleting a parent row deletes every child row that points at it, silently.</span></div>
  <div class="kv"><span class="k">natural key</span><span class="v">A column that identifies a row across rebuilds (a slug), unlike a generated id.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Restoring took two to three times longer than dumping; <code>-j4</code> recovered much of it, and only works with custom or directory format.</li>
<li>From an empty machine to a verified database took 9.6 s here and 16 s on the real site — the database part of RTO only.</li>
<li>Without statistics the planner guessed 625 rows for 18,681; the plan changed, the slowdown depended on the machine.</li>
<li>autovacuum analysed the big tables about 20 s after the restore and never analysed a six-row table — run <code>ANALYZE</code> yourself.</li>
<li>Rescue one table by restoring into a temporary database and carrying rows across by natural key, in one transaction.</li>
<li>A seed that deletes a parent table wipes child data through <code>ON DELETE CASCADE</code>; fix the seed, keep the backup.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — Automatic Vacuuming settings</span><span class="lc-sub">postgresql.org/docs/current/runtime-config-autovacuum.html — <code>autovacuum_analyze_threshold</code> (50) and <code>autovacuum_analyze_scale_factor</code> (0.1), the reason a six-row table is never analysed.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — pg_restore</span><span class="lc-sub">postgresql.org/docs/current/app-pgrestore.html — <code>-j</code>, <code>-t</code>, <code>-n</code> and <code>--data-only</code>; the flags that make a selective recovery possible.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — ANALYZE and the planner</span><span class="lc-sub">postgresql.org/docs/current/sql-analyze.html — and <code>planner-stats.html</code> for how row estimates drive the join strategy, which is the mechanism measured above.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — Continuous Archiving and PITR</span><span class="lc-sub">postgresql.org/docs/current/continuous-archiving.html — what it takes to move RPO from hours to minutes, and an honest look at the operational cost of doing so.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google SRE Workbook — Data Processing Pipelines</span><span class="lc-sub">sre.google/workbook/data-processing/ — on why recovery objectives have to be stated as measured numbers rather than aspirations.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — EXPLAIN, and reading a query plan</span><span class="lc-sub">/courses/postgresql/learn${REF} — nested loop versus hash join, and how to tell from the plan that the estimate is wrong.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.2</span>
<h2>PHỤC HỒI mới là con số quan trọng</h2>
<p class="lead">Chẳng ai từng phải ĐỢI một bản sao lưu. Ai cũng phải đợi một cú PHỤC HỒI, thường là trong lúc website đang sập, thường là chẳng có ý niệm gì về việc nó mất bao lâu — vì chưa ai từng chạy thử một lần.</p>

<h3>Phục hồi cùng một bộ dữ liệu theo ba cách</h3>
${slide('dv-10', 8, 'Phục hồi chậm hơn dump; -j4 gỡ lại — đo sang máy thứ hai')}
<div class="out">=== PHUC HOI tu plain SQL ===
  psql -f sl.sql : 3431 ms      lon=400170  bf=300000

=== PHUC HOI tu custom, MOT luong ===
  pg_restore     : 3274 ms

=== PHUC HOI tu custom, 4 luong song song ===
  pg_restore -j4 : 2123 ms      lon=400170  bf=300000</div>

<p>Hai điều rơi ra. Thứ nhất, <strong>một cú phục hồi tốn thời gian gấp hai tới ba lần bản dump sinh ra nó</strong> — 2.123–3.431 ms so với 1.165–2.379. Phục hồi nghĩa là phân tích, chèn, và DỰNG LẠI mọi chỉ mục, mà dựng chỉ mục mới là phần đắt.</p>

<p>Thứ hai, <code>-j4</code> cắt cú phục hồi đi 35%. Cái cờ đó chỉ chạy được với định dạng custom và directory — SQL thuần là một dòng lệnh liên tục phải chạy THEO THỨ TỰ, nên chẳng có gì để song song hoá. Đây là lý do thực dụng mà bài 10.1 khuyên dùng <code>-Fc</code>.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">plain + psql</span><span class="lz-t">3.431 ms</span><span class="lz-d">một dòng lệnh có thứ tự; chẳng có gì để song song hoá</span></div>
<div class="lz-step"><span class="lz-k">custom + pg_restore</span><span class="lz-t">3.274 ms</span><span class="lz-d">cùng khối việc, đọc từ một kho lưu đã nén</span></div>
<div class="lz-step"><span class="lz-k">custom + pg_restore -j4</span><span class="lz-t">2.123 ms</span><span class="lz-d">nhanh hơn 35% — bảng và chỉ mục dựng đồng thời</span></div>
</div>

<h3>Cả đường ống, bấm giờ</h3>
${slide('dv-10', 9, 'Bấm giờ trọn cú phục hồi sang một máy MỚI: 9,6 giây')}
<p>Một cú phục hồi thật trông thế nào — giải nén, phục hồi, và cái bước ai cũng quên:</p>

<div class="out">  giai nen : 868 ms
  phuc hoi : 3170 ms
  analyze  : 399 ms   ← quen buoc nay thi CSDL cham hang gio sau do
  TONG     : 4437 ms</div>

<h3>Chứng minh cái khẳng định về ANALYZE</h3>
${slide('dv-10', 10, 'Thiếu ANALYZE: kế hoạch dựng trên đoán mò')}
<p>Cái dòng chú thích đó là một khẳng định MẠNH, nên đây là nó được ĐO chứ không phải được nói. Một truy vấn join, chạy ngay sau khi phục hồi rồi chạy lại sau <code>ANALYZE</code>:</p>

<div class="out">=== CHUA analyze — ke hoach truy van ===
   ->  Nested Loop  (cost=0.42..20382.92 rows=625 width=0)
         ->  Parallel Seq Scan on lon l  (cost=0.00..16428.22 rows=834 width=4)
  thoi gian 3 lan: 230.9 ms | 223.7 ms | 255.2 ms

=== sau ANALYZE ===
   ->  Parallel Hash Join  (cost=5938.59..22804.31 rows=124946 width=0)
         Hash Cond: (l.id = b.id)
  thoi gian 3 lan: 83.7 ms | 90.1 ms | 101.1 ms</div>

<div class="callout warn">
<p><strong>Chậm hơn 2,5 lần, và cơ chế thì nhìn thấy được ngay trong kế hoạch.</strong> Không có thống kê, bộ lập kế hoạch ước lượng <strong>834</strong> dòng và chọn một nested loop, mà đó là kế hoạch ĐÚNG cho 834 dòng. Con số thật là <strong>124.946</strong>. Sau <code>ANALYZE</code> nó thấy con số thật và đổi sang hash join. Chẳng có gì HỎNG cả — bộ lập kế hoạch ra một quyết định hợp lý từ thông tin DUY NHẤT nó có, mà thông tin đó là không có gì.</p>
</div>

<p>Lý do chuyện này cắn đúng ngay SAU một cú phục hồi là <code>pg_restore</code> KHÔNG chạy <code>ANALYZE</code> và autovacuum thì chưa kịp. Cơ sở dữ liệu của bạn sống lại, phục vụ lưu lượng, và âm thầm chậm hơn vài lần so với trước — cho tới khi autovacuum rốt cuộc cũng ghé qua, mà trên một bảng lớn dưới tải thì đó có thể là rất lâu.</p>

<h3>RTO và RPO, dưới dạng những con số bạn PHÁT BIỂU ĐƯỢC</h3>
${slide('dv-10', 11, 'RPO và RTO trên một trục thời gian')}
<div class="kv-grid">
<div class="kv"><span class="k">RTO — mục tiêu thời gian phục hồi</span><span class="v">từ lúc "nó đi rồi" tới lúc "nó đang phục vụ" là bao lâu. Đo ở trên: 4,4 s phần cơ sở dữ liệu, cộng mọi thứ trong 10.5</span></div>
<div class="kv"><span class="k">RPO — mục tiêu điểm phục hồi</span><span class="v">bạn chấp nhận MẤT bao nhiêu dữ liệu. Với một bản dump hằng đêm thì đó là <strong>tới 24 giờ</strong>, và con số ấy do lịch cron của bạn quyết định, không phải do ý định của bạn</span></div>
<div class="kv"><span class="k">bản thành thật của RPO</span><span class="v">"chúng ta mất mọi thứ kể từ 3 giờ 15 sáng nay". Hãy nói nó THÀNH TIẾNG trước khi có sự cố, vì bạn sẽ phải nói nó TRONG một sự cố</span></div>
<div class="kv"><span class="k">thu nhỏ RPO thế nào</span><span class="v">dump dày hơn (tuyến tính, rẻ, vẫn tính bằng giờ), hoặc lưu trữ WAL liên tục (tính bằng phút, và nhiều máy móc hơn hẳn)</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — 4,4 giây của tôi là một cơ sở dữ liệu 192 MB, và thời gian phục hồi KHÔNG tăng một cách hiền lành.</strong> Gấp đôi dữ liệu thì phục hồi tăng HƠN gấp đôi, vì việc dựng chỉ mục tăng nhanh hơn tuyến tính và vì một cú phục hồi lớn thôi vừa bộ nhớ. ĐỪNG ngoại suy con số của tôi sang cơ sở dữ liệu của bạn — hãy <em>ĐO CÁI CỦA BẠN</em>, một lần, bằng đồng hồ bấm giờ, rồi viết con số đó ra chỗ mà người đi phục hồi sẽ tìm thấy. Đúng một con số đã đo ấy là câu hữu dụng nhất trong bất kỳ cuốn sổ tay nào: "phục hồi toàn bộ production mất khoảng 40 phút."</p>
</div>

<h3>Phục hồi MỘT bảng thay vì tất cả</h3>
${slide('dv-10', 12, 'Seed lại xoá tiến độ qua CASCADE — cứu MỘT bảng')}
<p>Cú phục hồi thật phổ biến nhất không phải "máy chủ cháy rụi" — mà là "có người chạy một câu DELETE không kèm WHERE lúc 14:20". Bạn KHÔNG muốn cả cơ sở dữ liệu đêm qua về; bạn muốn MỘT bảng ở thời điểm 03:15, đặt cạnh cái hiện tại:</p>

<pre><code><span class="tok-comment"># chi mot bang, vao mot CSDL TAM — KHONG de len production</span>
psql -c "create database cuu;"
pg_restore -d cuu -t don sao-luu.dump

<span class="tok-comment"># roi doi chieu, va chep lai dung phan can</span>
psql -d cuu -c "select count(*) from don;"
psql -d thu -c "insert into don select * from cuu_don_da_chep where id not in (select id from don);"</code></pre>

<p>Chuyện này chỉ khả thi vì định dạng đó CÓ mục lục. Với một bản dump SQL thuần thì thứ tương đương là đi grep một tệp văn bản 129 MB để tìm đúng khối <code>COPY</code>, chuyện làm được và khó chịu.</p>

<div class="callout ok">
<p><strong>ĐỪNG BAO GIỜ phục hồi ĐÈ lên cơ sở dữ liệu đang sống.</strong> Hãy phục hồi vào một cơ sở dữ liệu MỚI trên cùng máy chủ, nhìn nó, rồi chép sang chỉ đúng thứ bạn cần. Một cú phục hồi chạy thẳng đè lên production biến một sai lầm cứu được thành một sai lầm không cứu được — bạn vừa thay các dòng ghi kể từ lúc sao lưu bằng con số không, và Chương 6 đã đo rằng những dòng đó KHÔNG quay lại.</p>
</div>

<h3>Đo lại, sang một máy THỨ HAI</h3>
<p>Một cú phục hồi có ý nghĩa diễn ra trên một cái máy KHÁC cái máy vừa chết. Nên lần đo lại ngày 29/09/2026 phục hồi từ VPS thí nghiệm sang một container PostgreSQL <em>thứ hai</em>, <code>dv10-may2</code> (cùng ảnh <code>pgvector/pgvector:pg16</code>, 1 GB bộ nhớ), mỗi lần thử tạo một cơ sở dữ liệu mới:</p>
<pre><code class="language-bash">#!/bin/bash
<span class="tok-comment"># do-phuc-hoi.sh — bam gio phuc hoi sang MAY THU HAI (may2), moi lan mot CSDL moi</span>
set -euo pipefail
cd ~/sl; export PGHOST=may2
psql -qd postgres -c "create role ung_dung" 2&gt;/dev/null || true
lan() { local ten=\$1; shift; dropdb --if-exists ph; createdb ph
  local t0=\$(date +%s%N); "\$@" &gt;/dev/null 2&gt;&amp;1; local t1=\$(date +%s%N)
  printf '  %-26s %6d ms   lon=%s\\n' "\$ten" \$(( (t1-t0)/1000000 )) "\$(psql -d ph -Atc 'select count(*) from lon')"; }
lan "psql -f thu.sql"        psql -q -d ph -v ON_ERROR_STOP=1 -f thu.sql
lan "pg_restore (1 luong)"   pg_restore -d ph thu.dump
lan "pg_restore -j4"         pg_restore -j4 -d ph thu.dump</code></pre>
<div class="out">  psql -f thu.sql              4688 ms   lon=400170
  pg_restore (1 luong)         5228 ms   lon=400170
  pg_restore -j4               2370 ms   lon=400170
…
  psql -f thu.sql              4473 ms   lon=400170
  pg_restore (1 luong)         4961 ms   lon=400170
  pg_restore -j4               2390 ms   lon=400170
…
  psql -f thu.sql              6731 ms   lon=400170
  pg_restore (1 luong)         4811 ms   lon=400170
  pg_restore -j4               4197 ms   lon=400170</div>
<p>Qua ba lần: SQL thuần 4,5–6,7 s, custom một luồng 4,8–5,2 s, <code>-j4</code> 2,4–4,2 s. So với thời gian dump trung vị 1,9 s của cùng tệp custom, cú phục hồi lại tốn gấp hai tới ba lần, và <code>-j4</code> lại gỡ lại được phần lớn. Con số tuyệt đối lớn hơn số cũ vì cơ sở dữ liệu này có nhiều chỉ mục hơn (chỉ mục HNSW trên cột vector dựng rất tốn) và vì cú phục hồi đi qua mạng — cả hai đều đúng với một lần phục hồi thật.</p>
<table><thead><tr><th>Cờ của <code>pg_restore</code></th><th>Làm gì</th><th>Dùng khi</th></tr></thead><tbody>
<tr><td><code>-d db</code></td><td>phục hồi vào cơ sở dữ liệu này (phải có sẵn)</td><td>luôn luôn; thiếu <code>-d</code> nó IN RA SQL thay vì phục hồi</td></tr>
<tr><td><code>-j N</code></td><td>N luồng song song cho dữ liệu và dựng chỉ mục</td><td>định dạng custom hoặc thư mục; N ≈ số nhân của máy đích</td></tr>
<tr><td><code>-t bảng</code>, <code>-n schema</code></td><td>chỉ phục hồi những thứ này</td><td>cứu một bảng (bên dưới)</td></tr>
<tr><td><code>-a</code> / <code>-s</code></td><td>chỉ dữ liệu / chỉ lược đồ</td><td>nạp dòng vào một bảng đã có sẵn</td></tr>
<tr><td><code>--no-owner</code></td><td>bỏ <code>ALTER … OWNER TO</code></td><td>máy đích có tên vai trò khác</td></tr>
<tr><td><code>--exit-on-error</code>, <code>--single-transaction</code></td><td>dừng ở lỗi đầu / tất cả hoặc không gì</td><td>mỗi khi một cơ sở dữ liệu nửa vời còn tệ hơn không có (10.3)</td></tr>
<tr><td><code>-l</code> / <code>-L tệp</code></td><td>in mục lục / chỉ phục hồi các mục trong một tệp danh sách</td><td>chọn lọc chi tiết, sắp lại thứ tự</td></tr>
</tbody></table>

<h3>Trọn cú phục hồi trên một máy MỚI, đồng hồ trong tay</h3>
<p>Con số 4,4 s ở trên bấm giờ giải nén, phục hồi và analyze. Một cú phục hồi thật bắt đầu SỚM hơn — lúc chưa có máy chủ cơ sở dữ liệu nào cả. Buổi diễn tập dưới đây khởi động một container PostgreSQL mới tinh rồi chạy script kiểm chứng của Bài 10.4 vào nó từ máy kho, nơi giữ bản sao lưu đã mã hoá và cái khoá:</p>
<pre><code class="language-bash">docker run -d --name dv10-may3 --network dv10-net --memory 1g \\
  -e POSTGRES_PASSWORD=12345 pgvector/pgvector:pg16
until docker logs dv10-may3 2&gt;&amp;1 | grep -q "init process complete" &amp;&amp; \\
      docker exec dv10-may3 pg_isready -q -U postgres; do sleep 0.2; done
docker exec -u deploy dv10-kho bash -c 'cd ~/kho; kiem-may-khac.sh \$(ls *.age | tail -1) may3'</code></pre>
<div class="out">[3809 ms] may moi: Postgres san sang (da qua 'init process complete')
  [75 ms] giai ma + sha256 khop
  [145 ms] tao vai tro
  [4315 ms] pg_restore -j4 xong, ma thoat 0, 0 dong loi
  [5155 ms] analyze
    ✓ public.bai_hoc         120
    …
    ✓ public.tien_do         320
    truy van mau (hnsw): id=150
  [5588 ms] doi chieu xong
  ✓ PHUC HOI DUOC — khop ban ke
[9571 ms] TONG</div>
<p>Từ "chưa có máy chủ" tới "mọi bảng đã kiểm": <strong>9,6 giây</strong>, trong đó 3,8 s là PostgreSQL tự khởi tạo và 4,2 s là <code>pg_restore</code>. Giải mã và vai trò chỉ là số lẻ. Cùng phép đo trên website thật, lần ĐẦU TIÊN có người chạy nó (18/08/2026), là 281 bảng và 223.382 dòng trong 16 giây. Cả hai con số đều là phần <em>CƠ SỞ DỮ LIỆU</em> của RTO; bài 10.5 liệt kê những thứ bao quanh nó.</p>
<div class="callout warn"><p><strong>Vì sao vòng lặp đợi <code>init process complete</code> chứ không chỉ <code>pg_isready</code>.</strong> Ảnh chính thức khởi tạo một cơ sở dữ liệu mới bằng một máy chủ TẠM chỉ nghe trên socket Unix, chạy các script khởi tạo, rồi TẮT máy chủ đó và khởi động máy chủ thật. <code>docker exec … pg_isready</code> có thể trả lời "accepting connections" từ máy chủ tạm; một cú phục hồi bắt đầu trong cửa sổ ấy bị cắt ngang khi nó tắt. Ba lần thử trong phòng thí nghiệm không rơi vào cửa sổ đó — nó hẹp và tuỳ máy — nhưng trên máy kho thật thì nó đã xảy ra, và trông y hệt một bản dump rỗng: 0 bảng trong 1 giây. Đợi dòng log, rồi mới kiểm sẵn sàng.</p></div>

<h3>ANALYZE, đo lại: ước lượng luôn sai, còn chậm đi thì không chắc</h3>
<p>Phép đo ở trên (ước lượng 834 dòng, nested loop, chậm 2,5 lần) được làm lại trên máy thứ hai với autovacuum TẮT, để không có gì âm thầm chạy <code>ANALYZE</code> trước:</p>
<pre><code class="language-bash">Q="select count(*) from lon l join bf b on b.id = l.id where l.du_lieu like 'a%'"
psql -d ph -Atc "explain \$Q" | grep -E 'Join|Nested Loop' | head -1     <span class="tok-comment"># ke hoach</span>
psql -d ph -Atc "explain (analyze, format json) \$Q" | jq -r '.[0]["Execution Time"]'   <span class="tok-comment"># x3</span></code></pre>
<div class="out">=== NGAY sau pg_restore — chua ai chay ANALYZE ===
              ->  Nested Loop  (cost=0.42..20896.25 rows=625 width=0)
61.157 ms | 42.949 ms | 38.507 ms |
=== sau ANALYZE ===
              ->  Parallel Hash Join  (cost=17074.53..21254.47 rows=10695 width=0)
81.161 ms | 84.751 ms | 71.832 ms |
so dong that: 18681</div>
<p>Cơ chế tái hiện Y HỆT: không có thống kê, bộ lập kế hoạch đoán <strong>625</strong> dòng trong khi có <strong>18.681</strong> — ít đi ba mươi lần — và chọn nested loop; sau <code>ANALYZE</code> nó đổi sang hash join. Còn TỐC ĐỘ thì không tái hiện: ở đây, mọi thứ nằm trong bộ nhớ trên một SSD nhanh, kế hoạch "sai" lại nhanh hơn một chút (38–61 ms so với 72–85). Lần chạy thứ hai cho cùng hình dạng. Nên câu nói thành thật không phải "thiếu ANALYZE làm truy vấn chậm 2,5 lần" — mà là "thiếu ANALYZE khiến bộ lập kế hoạch quyết định dựa trên đoán mò, và cái đoán ấy tốn của bạn 2,5 lần hay chẳng tốn gì là tuỳ dữ liệu và phần cứng". Bạn không muốn biết câu trả lời vào sáng hôm sau một sự cố.</p>
<p>Và nếu quên thì cửa sổ ấy kéo dài bao lâu? Phục hồi lại với autovacuum <strong>BẬT</strong> (mặc định, <code>autovacuum_naptime = 1min</code>) và dò mỗi năm giây:</p>
<div class="out">0 s: da tu analyze 0|8 bang
…
15 s: da tu analyze 0|8 bang
20 s: da tu analyze 7|8 bang
…
149 s: da tu analyze 7|8 bang</div>
<div class="out">    relname     | n_live_tup | n_mod_since_analyze | da_tu_analyze
----------------+------------+---------------------+---------------
 nguoi_dung     |          6 |                   6 | f
 bai_hoc        |        120 |                   0 | t
 …
 lon            |     400170 |                   0 | t</div>
<p>Bảy trên tám bảng được analyze khoảng 20 giây sau cú phục hồi — sớm hơn nhiều so với nỗi lo của đoạn văn cũ, trên một cơ sở dữ liệu nhỏ cỡ này. Bảng thứ tám, <code>nguoi_dung</code> với sáu dòng, <strong>KHÔNG BAO GIỜ</strong> được analyze: autovacuum chỉ analyze một bảng sau khi <code>autovacuum_analyze_threshold</code> (50) cộng 10% số dòng của nó đã đổi, và sáu dòng thì không bao giờ tới 50. Những bảng tra cứu nhỏ — vai trò, cài đặt, gói cước — lại chính là những bảng có mặt trong mọi phép join. Hãy tự chạy <code>ANALYZE</code> làm bước CUỐI của mọi cú phục hồi; ở đây nó tốn 0,8 s.</p>

<h3>Cứu một bảng thật sự: cái seed thổi bay tiến độ của mọi người</h3>
<p>Đoạn mã ở trên kết thúc bằng <code>insert into don select * from cuu_don_da_chep …</code>, bỏ qua đúng phần khó: PostgreSQL KHÔNG truy vấn chéo giữa các cơ sở dữ liệu được, nên các dòng trong <code>cuu</code> phải được mang sang cơ sở dữ liệu đang sống trước. Đây là trọn quy trình, trên một sự cố đã thật sự xảy ra ở website mà khoá này theo dõi. Một script seed "xoá hết rồi tạo lại" một bảng các bước học. Bảng tiến độ của từng người dùng trỏ vào các bước đó với <code>ON DELETE CASCADE</code>, nên mỗi lần seed lại là âm thầm xoá mọi dấu "đã xong" của mọi người — không lỗi, không log, số bước vẫn đúng.</p>
<pre><code class="language-bash">#!/bin/bash
<span class="tok-comment"># cuu-tien-do.sh — seed lai xoa tien do qua ON DELETE CASCADE, roi cuu MOT bang tu ban sao luu</span>
set -euo pipefail
cd ~/sl
pg_dump -d thu -Fc -f dem-qua.dump                        <span class="tok-comment"># ban sao luu "03:15"</span>
echo "truoc seed : tien_do = \$(psql -d thu -Atc 'select count(*) from tien_do')"
psql -d thu -q -v ON_ERROR_STOP=1 &lt;&lt;'SQL'
begin;                                  -- "seed lai": xoa het bai hoc roi tao lai
delete from bai_hoc;
insert into bai_hoc(slug, tieu_de) select 'bai-'||g, 'Bai '||g from generate_series(1,120) g;
commit;
SQL
echo "seed bao OK, ma thoat \$? — bai_hoc = \$(psql -d thu -Atc 'select count(*) from bai_hoc'), tien_do = \$(psql -d thu -Atc 'select count(*) from tien_do')"

<span class="tok-comment"># 1) phuc hoi HAI bang vao mot CSDL tam, khong dung vao production</span>
dropdb --if-exists cuu; createdb cuu
pg_restore -d cuu -t bai_hoc -t tien_do dem-qua.dump
<span class="tok-comment"># 2) id da doi sau seed =&gt; doi chieu bang slug, khong bang id</span>
psql -d cuu -c "\\copy (select t.nguoi_dung_id, b.slug, t.xong_luc from tien_do t join bai_hoc b on b.id = t.bai_hoc_id) to 'tien-do.csv' csv"
psql -d thu -v ON_ERROR_STOP=1 &lt;&lt;'SQL'
begin;
create temp table cu(nguoi_dung_id int, slug text, xong_luc timestamptz);
\\copy cu from 'tien-do.csv' csv
insert into tien_do(nguoi_dung_id, bai_hoc_id, xong_luc)
  select cu.nguoi_dung_id, b.id, cu.xong_luc from cu join bai_hoc b using (slug)
  on conflict do nothing;
commit;
SQL
echo "sau khi cuu: tien_do = \$(psql -d thu -Atc 'select count(*) from tien_do')"</code></pre>
<div class="out">truoc seed : tien_do = 320
seed bao OK, ma thoat 0 — bai_hoc = 120, tien_do = 0
NOTICE:  database "cuu" does not exist, skipping
COPY 320
BEGIN
CREATE TABLE
COPY 320
INSERT 0 320
COMMIT
sau khi cuu: tien_do = 320</div>
<div class="kv-grid">
<div class="kv"><span class="k">vì sao một CSDL tạm</span><span class="v"><code>pg_restore -t</code> vào production sẽ đụng với <code>bai_hoc</code> đang sống; trong <code>cuu</code> các dòng cũ đọc được mà không chạm vào gì.</span></div>
<div class="kv"><span class="k">vì sao phục hồi cả <code>bai_hoc</code></span><span class="v">các dòng tiến độ cũ trỏ vào id <em>CŨ</em>. Seed đã tạo id MỚI cho cùng các bước, nên sợi dây ổn định duy nhất là khoá tự nhiên <code>slug</code>.</span></div>
<div class="kv"><span class="k">vì sao <code>\\copy</code></span><span class="v">nó chạy ở phía máy khách, nên dùng được mà không cần quyền đọc tệp trên máy chủ cơ sở dữ liệu — kể cả máy chủ nằm trong container.</span></div>
<div class="kv"><span class="k">vì sao một giao dịch và <code>on conflict do nothing</code></span><span class="v">hoặc cả 320 dòng về, hoặc không dòng nào; và những dấu "đã xong" người dùng làm lại từ sau sự cố không bị nhân đôi.</span></div>
<div class="kv"><span class="k">thứ nó KHÔNG mang về được</span><span class="v">tiến độ làm được giữa 03:15 và lúc seed. Đó là RPO của bạn, nhìn thấy được trong một bảng.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Chỗ sửa thật nằm ở thượng nguồn.</strong> Một seed xoá bảng cha là một lỗi mất dữ liệu bất cứ khi nào một bảng con chứa dữ liệu NGƯỜI DÙNG khai <code>ON DELETE CASCADE</code>. Trước khi viết hay chạy bất kỳ "xoá rồi tạo lại" nào, đọc <code>onDelete</code> của mọi quan hệ trỏ vào bảng đó; cập nhật dòng tại chỗ và chỉ xoá thứ thật sự biến mất. Bản sao lưu biến sự cố này từ vĩnh viễn thành một lần sửa 10 phút — lẽ ra đã chẳng cần tới nó.</p></div>

<h3>Trên macOS và Windows</h3>
<ul>
<li><strong>Diễn tập phục hồi trên laptop</strong> chạy tốt trong Docker Desktop, kèm hai lưu ý: máy ảo có một phần RAM và CPU cố định (Settings → Resources), nên <code>-j</code> lớn hơn số CPU của máy ảo chẳng được gì; và đĩa của máy ảo là một tệp ảnh trên SSD của bạn, nên thời gian phục hồi trông đẹp hơn trên đĩa của một VPS rẻ.</li>
<li><strong>Phục hồi vào container CÙNG ẢNH với production</strong>, đừng bao giờ vào một PostgreSQL cài thẳng trên macOS hay Windows "vì nó cũng là bản 16" — bài 10.4 đo chuyện gì xảy ra khi thiếu một phần mở rộng.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> 14:20, một bạn trong nhóm chạy script seed lên production "chỉ để sửa tiêu đề một bài", và bảng điều khiển báo mọi sinh viên về 0% tiến độ. Bản sao lưu duy nhất là bản dump custom đêm qua. Lấy lại tiến độ mà không phục hồi đè lên production.</p>
<ol>
<li>Trên cơ sở dữ liệu thí nghiệm, tạo <code>bai_hoc</code> và <code>tien_do</code> có <code>ON DELETE CASCADE</code> như trong <code>cuu-tien-do.sh</code>, đổ dữ liệu, và lấy một bản dump <code>-Fc</code>.</li>
<li>Chạy "seed" (xoá rồi tạo lại <code>bai_hoc</code>) và xác nhận <code>tien_do</code> về 0.</li>
<li>Phục hồi hai bảng vào CSDL tạm <code>cuu</code>, xuất tiến độ nối theo <code>slug</code> bằng <code>\\copy</code>, và nạp lại trong MỘT giao dịch.</li>
<li>Bấm giờ phục hồi toàn bộ cùng bản dump sang một container <em>THỨ HAI</em> với <code>-j1</code> và <code>-j4</code>, rồi chạy <code>ANALYZE</code> và bấm giờ nó.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>select count(*) from tien_do</code> trở lại đúng con số trước khi seed, production chưa từng bị phục hồi đè, và bạn nói được câu "phục hồi toàn bộ cơ sở dữ liệu này mất X giây trên một máy mới" với một con số bạn đã đo.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">pg_restore (công cụ phục hồi)</span><span class="v">Đọc kho lưu custom hoặc thư mục và nạp nó — song song, chọn lọc, hoặc in ra dạng chữ.</span></div>
  <div class="kv"><span class="k">RTO (mục tiêu thời gian phục hồi)</span><span class="v">Từ "mất rồi" tới "phục vụ lại" là bao lâu; chỉ biết được bằng cách bấm giờ một lần phục hồi thật.</span></div>
  <div class="kv"><span class="k">RPO (mục tiêu điểm phục hồi)</span><span class="v">Bạn mất bao nhiêu dữ liệu gần nhất; do tần suất sao lưu quyết định.</span></div>
  <div class="kv"><span class="k">ANALYZE / statistics (thống kê)</span><span class="v">Số dòng và phân bố giá trị mà bộ lập kế hoạch dùng; phục hồi KHÔNG tạo ra chúng.</span></div>
  <div class="kv"><span class="k">autovacuum threshold (ngưỡng tự analyze)</span><span class="v">Phải đổi 50 dòng + 10% thì bảng mới được tự analyze — bảng tí hon thì không bao giờ.</span></div>
  <div class="kv"><span class="k">ON DELETE CASCADE (xoá dây chuyền)</span><span class="v">Xoá một dòng cha là xoá mọi dòng con trỏ vào nó, một cách âm thầm.</span></div>
  <div class="kv"><span class="k">natural key (khoá tự nhiên)</span><span class="v">Cột nhận diện một dòng qua các lần dựng lại (slug), khác với id tự sinh.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Phục hồi tốn gấp hai tới ba lần dump; <code>-j4</code> gỡ lại phần lớn, và chỉ chạy với định dạng custom hoặc thư mục.</li>
<li>Từ máy trống tới cơ sở dữ liệu đã kiểm mất 9,6 s ở đây và 16 s trên website thật — mới chỉ là phần CSDL của RTO.</li>
<li>Không có thống kê, bộ lập kế hoạch đoán 625 dòng cho 18.681; kế hoạch đổi, còn chậm đi hay không là tuỳ máy.</li>
<li>autovacuum analyze các bảng lớn khoảng 20 s sau cú phục hồi và không bao giờ analyze một bảng sáu dòng — hãy tự chạy <code>ANALYZE</code>.</li>
<li>Cứu một bảng bằng cách phục hồi vào CSDL tạm rồi mang dòng sang theo khoá tự nhiên, trong một giao dịch.</li>
<li>Một seed xoá bảng cha sẽ xoá dữ liệu con qua <code>ON DELETE CASCADE</code>; sửa seed, giữ bản sao lưu.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — Automatic Vacuuming settings</span><span class="lc-sub">postgresql.org/docs/current/runtime-config-autovacuum.html — <code>autovacuum_analyze_threshold</code> (50) và <code>autovacuum_analyze_scale_factor</code> (0,1), lý do một bảng sáu dòng không bao giờ được analyze.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — pg_restore</span><span class="lc-sub">postgresql.org/docs/current/app-pgrestore.html — <code>-j</code>, <code>-t</code>, <code>-n</code> và <code>--data-only</code>; những cờ làm cho một cú phục hồi chọn lọc khả thi.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — ANALYZE và bộ lập kế hoạch</span><span class="lc-sub">postgresql.org/docs/current/sql-analyze.html — và <code>planner-stats.html</code> về việc ước lượng số dòng dẫn dắt chiến lược join ra sao, đúng cái cơ chế đo ở trên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — Continuous Archiving và PITR</span><span class="lc-sub">postgresql.org/docs/current/continuous-archiving.html — cần những gì để đưa RPO từ hàng giờ xuống hàng phút, và một cái nhìn thành thật về giá vận hành của việc đó.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google SRE Workbook — Data Processing Pipelines</span><span class="lc-sub">sre.google/workbook/data-processing/ — về việc vì sao các mục tiêu phục hồi phải được phát biểu bằng con số ĐÃ ĐO chứ không phải bằng nguyện vọng.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — EXPLAIN, và đọc một kế hoạch truy vấn</span><span class="lc-sub">/courses/postgresql/learn${REF} — nested loop so với hash join, và làm sao nhìn kế hoạch mà biết ước lượng đang sai.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 10.3 ─────────────────────────── */
    {
      title: '10.3 — The backup that failed and the restore that lied|||10.3 — Bản sao lưu HỎNG và cú phục hồi NÓI DỐI',
      slug: 'deploy-10-3-noi-doi',
      type: 'VIDEO',
      description: 'pg_dump chạm đĩa đầy, thoát 1, và để lại một tệp 51 MB. Phục hồi tệp đó: psql thoát 0 — THÀNH CÔNG — và một bảng 400.170 dòng trở về RỖNG. Rồi cái bẫy tệ hơn: pg_restore --list nói bản dump ấy ổn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.3</span>
<h2>The backup that failed and the restore that lied</h2>
<p class="lead">This is the lesson the whole chapter exists for. Every step below behaves exactly as documented, every exit code is defensible, and the result is a database missing 400,170 rows with nothing reporting a problem.</p>

<h3>Making a backup fail realistically</h3>
<p>Not by corrupting a file — by giving <code>pg_dump</code> a disk too small, which is precisely how backups fail on real servers (Chapter 8 measured the same disk filling under a build cache):</p>

<div class="out">/dev/loop0       53M   24K   48M   1% /mnt/nho
=== pg_dump vao mot dia KHONG DU CHO ===
pg_dump: error: could not write to file: No space left on device
  ma thoat: 1 | mat 395 ms
  tep con lai: 51.0 MB
  → tep TON TAI, khong rong, va KHONG DAY DU.</div>

<p><code>pg_dump</code> did everything right: it reported the error clearly and exited non-zero. If your backup script has <code>set -euo pipefail</code> and checks its exit code, you find out here — which is exactly why Chapter 7 spent a lesson on that. But suppose the cron line was <code>pg_dump … 2>/dev/null || true</code>, or the log nobody reads scrolled past it. What is left on disk is a 51 MB file with a plausible name and a recent timestamp.</p>

<h3>Restoring it</h3>
${slide('dv-10', 13, 'Đo lại: tệp cụt đúng ranh giới dòng — psql thoát 0 kể cả với ON_ERROR_STOP')}
<div class="out">=== ban sao luu do co phuc hoi duoc khong? ===
  psql ma thoat: 0
  loi cuoi: CONTEXT:  COPY lon, line 122140: "122140	xxxxxxxxxx…"
lon=0
bf=300000</div>

<div class="callout warn">
<p><strong>Exit code 0.</strong> The restore reported success. The <code>bf</code> table came back with all 300,000 rows. The <code>lon</code> table — 400,170 rows, 124 MB, the largest thing in the database — came back with <strong>zero</strong>. Not partially. Zero, because the truncated <code>COPY</code> block failed and its transaction rolled back, while everything around it committed.</p>
</div>

<p>The reason <code>psql</code> exits 0 is documented and reasonable: by default it treats a script as a sequence of independent statements, reports errors as it goes, and keeps going. That is the right behaviour for an interactive session and a catastrophic one for a restore.</p>

<h3>Two flags that turn the lie into an error</h3>
<pre><code>psql -v ON_ERROR_STOP=1 -d ph3 -f sl.sql</code></pre>

<div class="out">  ma thoat: 3</div>

<p>Exit 3, stopping at the first failed statement. This is one flag, it costs nothing, and without it a plain-SQL restore cannot tell you whether it worked.</p>
<div class="callout warn"><p><strong>Re-measured 29/09/2026: this flag is not enough on its own.</strong> <code>ON_ERROR_STOP</code> can only stop at an <em>error</em>. The cut above happened to fall in the middle of a row, which produced one. When the cut falls exactly between two lines of a <code>COPY</code> block there is no error at all — the re-measurement below shows <code>psql -v ON_ERROR_STOP=1</code> exiting <strong>0</strong> on a truncated file and loading 141,090 of 400,170 rows. Use the flag, and do not treat it as a check.</p></div>


<p>The custom format behaves better on its own. Given a dump truncated to 10.6 MB of the 21 MB it needed:</p>

<div class="out">pg_dump: error: could not write to output file: No space left on device
  pg_dump ma thoat: 1
  tep: 10.6 MB (that ra can 21 MB)

=== pg_restore CO phat hien ra ban dump bi cut khong? ===
pg_restore: error: could not read from input file: end of file
  pg_restore ma thoat: 1
lon=0  bf=300000</div>

<p><code>pg_restore</code> detects the truncation and exits 1 — better than <code>psql</code>&#39;s default. Note it still left a partial database behind: <code>bf</code> full, <code>lon</code> empty. Detecting the problem is not the same as leaving nothing behind.</p>

<h3>The trap that is worse than both</h3>
${slide('dv-10', 14, '-Fc phát hiện được; --list thì không')}
<p>The natural way to check a backup without a full restore is to list its contents. On the same truncated file:</p>

<div class="out">=== pg_restore --list: doc muc luc thi sao? ===
3335; 2606 16413 CONSTRAINT public lon lon_pkey postgres
3332; 2606 16402 CONSTRAINT public nguoi_dung nguoi_dung_pkey postgres
3333; 1259 16431 INDEX public idx_t postgres
  ma thoat: 0</div>

<div class="callout warn">
<p><strong><code>pg_restore --list</code> exits 0 on a file that is half missing.</strong> The table of contents sits at the front of the archive, so reading it succeeds regardless of whether the data behind it survived. Anyone who runs <code>--list</code> as a backup check — and it is a natural thing to do, it looks like a validity check — gets a clean listing of tables that are not there.</p>
</div>

<h3>The general shape</h3>
${slide('dv-10', 15, 'Mã thoát nói gì — và không nói gì')}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">pg_dump</span><span class="lz-t">exit 1, error printed</span><span class="lz-d">honest. Caught only if somebody checks</span></div>
<div class="lz-step"><span class="lz-k">the file on disk</span><span class="lz-t">51 MB, recent, plausible</span><span class="lz-d">indistinguishable from a good one by name, size or date</span></div>
<div class="lz-step"><span class="lz-k">pg_restore --list</span><span class="lz-t">exit 0</span><span class="lz-d">actively misleading</span></div>
<div class="lz-step"><span class="lz-k">psql -f (default)</span><span class="lz-t">exit 0</span><span class="lz-d">actively misleading, and now you have a database</span></div>
<div class="lz-step"><span class="lz-k">counting rows</span><span class="lz-t">lon=0</span><span class="lz-d">the only step that told the truth</span></div>
</div>

<p>Each individual behaviour is defensible. Together they produce a system in which the only reliable signal is at the very end, and it is the one nobody automates.</p>

<div class="pitfall">
<p><strong>Trap — the other ways this happens, none of which involve a full disk.</strong> A network copy interrupted at 97% leaves a file that is 97% right. A cloud sync that uploads while the file is still being written stores a partial object with a normal-looking size. A backup of a database whose disk was already failing contains whatever the failing disk returned. A dump taken with the wrong <code>PGDATABASE</code> is complete, valid, restorable, and of the wrong database. Every one of these produces a file that passes every check short of restoring it and counting rows.</p>
</div>

<div class="callout ok">
<p><strong>The rule.</strong> A backup file is a claim, not a fact. The claim is only verified by restoring it and comparing what came back against what should have. Everything else — the file exists, it is the right size, it listed cleanly, the cron job exited 0 — is evidence that <em>something</em> was written. Lesson 10.4 automates the only check that counts.</p>
</div>

<h3>Measured again: a cut on a row boundary, and nothing notices</h3>
<p>The experiment was repeated on 29/09/2026 on the pgvector database, with a lab machine whose output disk is a 48 MB <code>tmpfs</code> (<code>docker run --tmpfs /mnt/nho:size=48m</code>) and the restore going to a fresh second machine:</p>
<pre><code class="language-bash">cd /mnt/nho
df -h /mnt/nho | tail -1
pg_dump -d thu -Fp -f sl.sql; echo "  ma thoat: \$?"
export PGHOST=may2; createdb ph3
psql -q -d ph3 -f sl.sql &gt; /dev/null 2&gt; loi.txt; echo "  psql ma thoat: \$?"
echo "  so dong loi: \$(grep -c ERROR loi.txt)"
dropdb ph3; createdb ph3
psql -q -d ph3 -v ON_ERROR_STOP=1 -f sl.sql &gt; /dev/null 2&gt;&amp;1; echo "  psql ma thoat: \$?"</code></pre>
<div class="out">tmpfs            48M     0   48M   0% /mnt/nho
=== pg_dump plain vao dia 48 MB ===
pg_dump: error: could not write to file: No space left on device
  ma thoat: 1
  tep con lai: 48M
=== psql -f (mac dinh) ===
  psql ma thoat: 0
  so dong loi: 0
  lon=141090  bf=300000  kh=200000  tai_lieu_nhung=0
=== psql -v ON_ERROR_STOP=1 ===
  psql ma thoat: 0</div>
<p>This time there was not even an error to ignore. The last bytes of the file were the start of one row:</p>
<div class="out">$ tail -c 300 sl.sql | od -c | tail -3
0000420   x   x   x   x  \\n   1   4   1   0   9   0  \\t   8   a   6   2
0000440   f   f   c   2   c   8   d   6   c   3   7   6
0000454
$ psql -d ph3 -Atc "select id, length(du_lieu), du_lieu from lon where id=141090"
141090|16|8a62ffc2c8d6c376
$ psql -d ph3 -Atc "select count(*) from pg_indexes where schemaname='public'"
0</div>
<p>When <code>psql</code> reaches the end of the file inside a <code>COPY … FROM stdin</code> block, it treats end-of-file as end-of-data. The half-written last line had both columns — an id and a 16-character fragment of a 252-character value — so it was a valid row. The <code>COPY</code> succeeded with 141,090 rows, one of them corrupted, and everything that comes after the data in a plain dump was simply never executed: the rest of <code>lon</code>, the whole <code>tai_lieu_nhung</code> table, and <strong>all twelve indexes, primary keys and foreign keys</strong>, which <code>pg_dump</code> writes at the end so they can be built once after the data is loaded. Exit code 0, zero errors, with <code>ON_ERROR_STOP</code> or without.</p>
<p>Compare the old measurement in this lesson: the cut fell mid-row, <code>COPY</code> failed, and the table came back with <em>zero</em> rows. Same failure, different byte, opposite symptom. That is why the only reliable check compares counts against a list of what should be there.</p>

<h3>The custom format, measured again</h3>
<p>The same disk, 42 MB filled first so that only 6 MB of the 13 MB custom dump fits:</p>
<div class="out">tmpfs            48M   42M  6.0M  88% /mnt/nho
=== pg_dump -Fc vao dia con 6 MB ===
pg_dump: error: could not write to output file: No space left on device
  pg_dump ma thoat: 1
  tep: 6.0M (ban du: 13M)
=== pg_restore --list (doc muc luc) ===
  ma thoat: 0, 8 muc TABLE DATA
3646; 0 16725 TABLE DATA public lon postgres
=== pg_restore -d ph3 ===
pg_restore: error: could not read from input file: end of file
  pg_restore ma thoat: 1
  bf=300000  kh=200000  lon=0  tai_lieu_nhung=0</div>
<p>Every old finding held: <code>pg_restore</code> noticed the end of file and exited 1; it still left <code>bf</code> and <code>kh</code> behind with <code>lon</code> empty; and <code>--list</code> exited 0 and listed all eight tables' data, including <code>lon</code>. The custom format is safer than plain SQL precisely because its reader knows how long each block should be.</p>
<p>And the same truncated file with <code>--single-transaction</code>, into a new database:</p>
<div class="out">$ pg_restore --single-transaction -d ph4 sl.dump; echo "ma thoat \$?"
pg_restore: error: could not read from input file: end of file
ma thoat 1
$ psql -d ph4 -Atc "select count(*) from pg_tables where schemaname='public'"
0</div>
<p>Same exit code, but nothing left behind: zero tables instead of a database that looks half right.</p>

<h3>Making a failed restore fail loudly — and leave nothing behind</h3>
<table><thead><tr><th>Tool</th><th>Flag</th><th>Effect</th><th>What it still misses</th></tr></thead><tbody>
<tr><td><code>psql</code></td><td><code>-v ON_ERROR_STOP=1</code></td><td>stop at the first failing statement, exit 3</td><td>a truncation that causes no error (above)</td></tr>
<tr><td><code>psql</code></td><td><code>-1</code> / <code>--single-transaction</code></td><td>wrap the whole file in one transaction; an error rolls back everything</td><td>same — no error, nothing to roll back</td></tr>
<tr><td><code>pg_restore</code></td><td><code>--exit-on-error</code></td><td>stop at the first error instead of counting "errors ignored"</td><td>a wrong-but-valid archive (wrong database, old date)</td></tr>
<tr><td><code>pg_restore</code></td><td><code>--single-transaction</code></td><td>all or nothing; implies <code>--exit-on-error</code>; cannot be combined with <code>-j</code></td><td>same</td></tr>
<tr><td>any</td><td>count rows against a manifest</td><td>catches missing rows, missing tables, a wrong environment</td><td>subtly wrong values — add a checksum (10.4)</td></tr>
</tbody></table>
<p>The flags turn most failures into errors and stop a failed restore leaving a half-built database behind. None of them can tell a complete file from a file that happens to end cleanly. Only a comparison against something recorded at backup time can.</p>

<h3>Every silent failure in this chapter, in one place</h3>
<div class="kv-grid">
<div class="kv"><span class="k">disk full during the dump</span><span class="v">this lesson: a file that restores to 0 rows or to 141,090, with exit 0.</span></div>
<div class="kv"><span class="k"><code>docker exec -t</code></span><span class="v">10.1: 47,828 extra bytes, both commands exit 0, <code>pg_restore</code> segfaults (139).</span></div>
<div class="kv"><span class="k">client older than server</span><span class="v">10.1: the dump never starts; only a checked exit code notices (GitLab, 2017).</span></div>
<div class="kv"><span class="k"><code>pg_isready</code> during init</span><span class="v">10.2: a restore into the temporary server is cut off and looks like an empty dump.</span></div>
<div class="kv"><span class="k">restore environment without an extension</span><span class="v">10.4: two tables and 26,778 rows missing on the real site, and the checker printed ✅.</span></div>
<div class="kv"><span class="k">roles outside the dump</span><span class="v">10.5: every row back, the application cannot log in.</span></div>
<div class="kv"><span class="k">rotation deleting the good copies</span><span class="v">10.7: seven zero-byte files kept, ten good ones deleted.</span></div>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> after a night when the VPS disk hit 100%, the team finds last night's backup file is "a bit smaller than usual" but restores "fine". Show, on the lab machine, how both "fine" results can be lies — and which check tells the truth.</p>
<ol>
<li>Start a lab container with a small output disk: <code>docker run -d --name dv10-nho --label dvhoc=10 --tmpfs /mnt/nho:size=48m …</code>, and point <code>pg_dump -Fp</code> at a database bigger than 48 MB.</li>
<li>Restore the truncated file into a fresh database twice: with plain <code>psql -f</code> and with <code>-v ON_ERROR_STOP=1</code>. Write down both exit codes, the row count of the biggest table and the number of indexes.</li>
<li>Fill the disk to leave ~6 MB and repeat with <code>-Fc</code>: run <code>pg_restore --list</code> and <code>pg_restore -d</code>, and note both exit codes.</li>
<li>Repeat the <code>-Fc</code> restore with <code>--single-transaction</code> into a new database and check that nothing is left behind.</li>
</ol>
<p><strong>Done when:</strong> you have four exit codes that disagree with reality, one restore that left nothing behind, and a sentence that explains why comparing row counts per table is the only check that caught every case.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ENOSPC</span><span class="v">"No space left on device" — the error a write gets when the disk is full.</span></div>
  <div class="kv"><span class="k">truncated file</span><span class="v">A file that stops early; it can end in the middle of a row or cleanly between two.</span></div>
  <div class="kv"><span class="k">COPY … FROM stdin</span><span class="v">How a plain dump carries data; psql treats end of file as end of data.</span></div>
  <div class="kv"><span class="k">ON_ERROR_STOP</span><span class="v">A psql variable that stops at the first error — useless when there is no error.</span></div>
  <div class="kv"><span class="k">--single-transaction</span><span class="v">All or nothing: a failure rolls back everything instead of leaving half a database.</span></div>
  <div class="kv"><span class="k">table of contents (--list)</span><span class="v">The index at the front of a custom archive; readable even when the data behind it is gone.</span></div>
  <div class="kv"><span class="k">exit code</span><span class="v">A process's own verdict on itself — evidence that something ran, not that the result is right.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A dump that hits a full disk leaves a plausible file; pg_dump's exit 1 is the only honest signal.</li>
<li>A plain dump cut between two rows restored with exit 0 and zero errors — 141,090 of 400,170 rows, a corrupted last row, no indexes — even with <code>ON_ERROR_STOP=1</code>.</li>
<li>A dump cut mid-row gave the opposite symptom: an empty table. Same failure, different byte.</li>
<li><code>pg_restore</code> detects a truncated custom archive and exits 1, but still leaves a partial database unless you use <code>--single-transaction</code>.</li>
<li><code>pg_restore --list</code> reads only the table of contents and exits 0 on half a file — it is not a check.</li>
<li>Exit codes and error counts cannot distinguish a complete file from one that ends cleanly; counting rows against a manifest can.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — psql, ON_ERROR_STOP</span><span class="lc-sub">postgresql.org/docs/current/app-psql.html — the variable, its default of <code>off</code>, and the exit-code table showing 3 for a script error.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — pg_restore, --list and --exit-on-error</span><span class="lc-sub">postgresql.org/docs/current/app-pgrestore.html — <code>--list</code> reads only the table of contents, and <code>--exit-on-error</code> changes the default of continuing past failures.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">errno(3) — ENOSPC</span><span class="lc-sub">man 3 errno — the error <code>pg_dump</code> surfaced, measured from the filesystem side in Lesson 8.4.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — transactions, and what a failed COPY rolls back</span><span class="lc-sub">/courses/postgresql/learn${REF} — why a truncated COPY leaves an empty table rather than a partial one.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.3</span>
<h2>Bản sao lưu HỎNG và cú phục hồi NÓI DỐI</h2>
<p class="lead">Đây là bài học mà cả chương này tồn tại vì nó. Mọi bước dưới đây đều hành xử ĐÚNG như tài liệu ghi, mọi mã thoát đều bảo vệ được, và kết quả là một cơ sở dữ liệu thiếu 400.170 dòng mà chẳng có gì báo là có vấn đề.</p>

<h3>Làm cho một bản sao lưu hỏng theo cách THỰC TẾ</h3>
<p>Không phải bằng cách làm hỏng một tệp — mà bằng cách đưa cho <code>pg_dump</code> một cái đĩa quá nhỏ, và đó chính xác là cách sao lưu hỏng trên máy chủ thật (Chương 8 đã đo đúng cái đĩa ấy đầy lên vì một bộ đệm dựng):</p>

<div class="out">/dev/loop0       53M   24K   48M   1% /mnt/nho
=== pg_dump vao mot dia KHONG DU CHO ===
pg_dump: error: could not write to file: No space left on device
  ma thoat: 1 | mat 395 ms
  tep con lai: 51.0 MB
  → tep TON TAI, khong rong, va KHONG DAY DU.</div>

<p><code>pg_dump</code> làm mọi thứ ĐÚNG: nó báo lỗi rõ ràng và thoát khác không. Nếu script sao lưu của bạn có <code>set -euo pipefail</code> và kiểm mã thoát, bạn phát hiện ra ngay ở đây — mà đó chính xác là lý do Chương 7 dành hẳn một bài cho chuyện đó. Nhưng giả sử dòng cron là <code>pg_dump … 2>/dev/null || true</code>, hoặc cái log không ai đọc đã cuộn qua nó. Thứ còn lại trên đĩa là một tệp 51 MB với một cái tên hợp lý và một dấu thời gian mới tinh.</p>

<h3>Phục hồi nó</h3>
${slide('dv-10', 13, 'Đo lại: tệp cụt đúng ranh giới dòng — psql thoát 0 kể cả với ON_ERROR_STOP')}
<div class="out">=== ban sao luu do co phuc hoi duoc khong? ===
  psql ma thoat: 0
  loi cuoi: CONTEXT:  COPY lon, line 122140: "122140	xxxxxxxxxx…"
lon=0
bf=300000</div>

<div class="callout warn">
<p><strong>Mã thoát 0.</strong> Cú phục hồi báo THÀNH CÔNG. Bảng <code>bf</code> về đủ 300.000 dòng. Bảng <code>lon</code> — 400.170 dòng, 124 MB, thứ lớn nhất trong cả cơ sở dữ liệu — về với <strong>KHÔNG</strong> dòng nào. Không phải một phần. LÀ KHÔNG, vì khối <code>COPY</code> bị cắt cụt đã hỏng và giao dịch của nó cuộn lại, trong khi mọi thứ xung quanh nó thì chốt.</p>
</div>

<p>Lý do <code>psql</code> thoát 0 thì có ghi tài liệu và hợp lý: mặc định nó coi một script là một chuỗi câu lệnh ĐỘC LẬP, báo lỗi khi gặp, rồi đi tiếp. Đó là hành vi ĐÚNG cho một phiên tương tác và là thảm hoạ cho một cú phục hồi.</p>

<h3>Hai cái cờ biến lời nói dối thành một lỗi</h3>
<pre><code>psql -v ON_ERROR_STOP=1 -d ph3 -f sl.sql</code></pre>

<div class="out">  ma thoat: 3</div>

<p>Thoát 3, dừng ở câu lệnh hỏng ĐẦU TIÊN. Đây là MỘT cái cờ, nó chẳng tốn gì, và thiếu nó thì một cú phục hồi từ SQL thuần không nói cho bạn biết được là nó có chạy hay không.</p>
<div class="callout warn"><p><strong>Đo lại 29/09/2026: riêng cái cờ này là KHÔNG đủ.</strong> <code>ON_ERROR_STOP</code> chỉ dừng được ở một <em>LỖI</em>. Chỗ cắt ở trên tình cờ rơi vào giữa một dòng, nên nó sinh ra lỗi. Khi chỗ cắt rơi ĐÚNG vào ranh giới giữa hai dòng của một khối <code>COPY</code> thì chẳng có lỗi nào — lần đo lại bên dưới cho thấy <code>psql -v ON_ERROR_STOP=1</code> thoát <strong>0</strong> trên một tệp bị cụt và nạp 141.090 trên 400.170 dòng. Cứ dùng cờ này, nhưng đừng coi nó là một phép kiểm.</p></div>


<p>Định dạng custom tự nó hành xử tốt hơn. Với một bản dump bị cắt còn 10,6 MB trên 21 MB nó cần:</p>

<div class="out">pg_dump: error: could not write to output file: No space left on device
  pg_dump ma thoat: 1
  tep: 10.6 MB (that ra can 21 MB)

=== pg_restore CO phat hien ra ban dump bi cut khong? ===
pg_restore: error: could not read from input file: end of file
  pg_restore ma thoat: 1
lon=0  bf=300000</div>

<p><code>pg_restore</code> PHÁT HIỆN ra chỗ bị cắt và thoát 1 — tốt hơn mặc định của <code>psql</code>. Để ý là nó vẫn để lại một cơ sở dữ liệu NỬA VỜI: <code>bf</code> đầy đủ, <code>lon</code> rỗng. Phát hiện ra vấn đề KHÔNG giống với việc không để lại gì.</p>

<h3>Cái bẫy còn tệ hơn cả hai</h3>
${slide('dv-10', 14, '-Fc phát hiện được; --list thì không')}
<p>Cách tự nhiên để kiểm một bản sao lưu mà không cần phục hồi trọn vẹn là LIỆT KÊ nội dung của nó. Trên cùng cái tệp bị cắt:</p>

<div class="out">=== pg_restore --list: doc muc luc thi sao? ===
3335; 2606 16413 CONSTRAINT public lon lon_pkey postgres
3332; 2606 16402 CONSTRAINT public nguoi_dung nguoi_dung_pkey postgres
3333; 1259 16431 INDEX public idx_t postgres
  ma thoat: 0</div>

<div class="callout warn">
<p><strong><code>pg_restore --list</code> thoát 0 trên một tệp thiếu mất một nửa.</strong> Mục lục nằm ở ĐẦU kho lưu, nên đọc nó thành công bất kể phần dữ liệu phía sau có sống sót hay không. Ai chạy <code>--list</code> như một phép kiểm sao lưu — mà đó là chuyện tự nhiên để làm, nó TRÔNG như một phép kiểm tính hợp lệ — sẽ nhận về một danh sách sạch sẽ các bảng KHÔNG có ở đó.</p>
</div>

<h3>Hình dạng tổng quát</h3>
${slide('dv-10', 15, 'Mã thoát nói gì — và không nói gì')}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">pg_dump</span><span class="lz-t">thoát 1, có in lỗi</span><span class="lz-d">thành thật. Chỉ bắt được nếu có ai đó đi kiểm</span></div>
<div class="lz-step"><span class="lz-k">cái tệp trên đĩa</span><span class="lz-t">51 MB, mới, hợp lý</span><span class="lz-d">không phân biệt được với một bản tốt qua tên, kích thước hay ngày</span></div>
<div class="lz-step"><span class="lz-k">pg_restore --list</span><span class="lz-t">thoát 0</span><span class="lz-d">gây hiểu lầm một cách CHỦ ĐỘNG</span></div>
<div class="lz-step"><span class="lz-k">psql -f (mặc định)</span><span class="lz-t">thoát 0</span><span class="lz-d">gây hiểu lầm chủ động, và giờ bạn CÓ một cơ sở dữ liệu</span></div>
<div class="lz-step"><span class="lz-k">đếm số dòng</span><span class="lz-t">lon=0</span><span class="lz-d">bước DUY NHẤT nói thật</span></div>
</div>

<p>Từng hành vi riêng lẻ đều bảo vệ được. Gộp lại, chúng đẻ ra một hệ thống mà tín hiệu đáng tin duy nhất nằm ở TẬN CUỐI, và nó là cái không ai đem đi tự động hoá.</p>

<div class="pitfall">
<p><strong>Bẫy — những cách khác chuyện này xảy ra, và chẳng cách nào dính tới đĩa đầy.</strong> Một lần chép qua mạng bị đứt ở 97% để lại một tệp đúng 97%. Một cú đồng bộ lên đám mây tải lên TRONG LÚC tệp vẫn đang được ghi sẽ lưu một đối tượng nửa vời với kích thước nhìn bình thường. Một bản sao lưu của một cơ sở dữ liệu mà đĩa của nó vốn đã hỏng thì chứa đúng cái mà cái đĩa hỏng ấy trả về. Một bản dump chạy với sai <code>PGDATABASE</code> thì đầy đủ, hợp lệ, phục hồi được, và là của SAI cơ sở dữ liệu. Mỗi cái trong số đó đều đẻ ra một tệp vượt qua MỌI phép kiểm ngoại trừ việc phục hồi nó ra rồi đếm số dòng.</p>
</div>

<div class="callout ok">
<p><strong>Quy tắc.</strong> Một tệp sao lưu là một LỜI KHẲNG ĐỊNH, không phải một SỰ THẬT. Lời khẳng định đó chỉ được kiểm chứng bằng cách phục hồi nó ra và đối chiếu thứ quay về với thứ lẽ ra phải có. Mọi thứ khác — tệp tồn tại, đúng kích thước, liệt kê sạch sẽ, cron job thoát 0 — là bằng chứng rằng <em>MỘT THỨ GÌ ĐÓ</em> đã được ghi. Bài 10.4 tự động hoá đúng cái phép kiểm duy nhất có giá trị.</p>
</div>

<h3>Đo lại: cắt đúng ranh giới dòng, và không có gì nhận ra</h3>
<p>Thí nghiệm được làm lại ngày 29/09/2026 trên cơ sở dữ liệu pgvector, với một máy thí nghiệm có đĩa đầu ra là một <code>tmpfs</code> 48 MB (<code>docker run --tmpfs /mnt/nho:size=48m</code>) và cú phục hồi đi sang một máy thứ hai mới tinh:</p>
<pre><code class="language-bash">cd /mnt/nho
df -h /mnt/nho | tail -1
pg_dump -d thu -Fp -f sl.sql; echo "  ma thoat: \$?"
export PGHOST=may2; createdb ph3
psql -q -d ph3 -f sl.sql &gt; /dev/null 2&gt; loi.txt; echo "  psql ma thoat: \$?"
echo "  so dong loi: \$(grep -c ERROR loi.txt)"
dropdb ph3; createdb ph3
psql -q -d ph3 -v ON_ERROR_STOP=1 -f sl.sql &gt; /dev/null 2&gt;&amp;1; echo "  psql ma thoat: \$?"</code></pre>
<div class="out">tmpfs            48M     0   48M   0% /mnt/nho
=== pg_dump plain vao dia 48 MB ===
pg_dump: error: could not write to file: No space left on device
  ma thoat: 1
  tep con lai: 48M
=== psql -f (mac dinh) ===
  psql ma thoat: 0
  so dong loi: 0
  lon=141090  bf=300000  kh=200000  tai_lieu_nhung=0
=== psql -v ON_ERROR_STOP=1 ===
  psql ma thoat: 0</div>
<p>Lần này thậm chí không có một lỗi nào để mà bỏ qua. Mấy byte cuối của tệp là phần đầu của một dòng:</p>
<div class="out">$ tail -c 300 sl.sql | od -c | tail -3
0000420   x   x   x   x  \\n   1   4   1   0   9   0  \\t   8   a   6   2
0000440   f   f   c   2   c   8   d   6   c   3   7   6
0000454
$ psql -d ph3 -Atc "select id, length(du_lieu), du_lieu from lon where id=141090"
141090|16|8a62ffc2c8d6c376
$ psql -d ph3 -Atc "select count(*) from pg_indexes where schemaname='public'"
0</div>
<p>Khi <code>psql</code> gặp hết tệp giữa một khối <code>COPY … FROM stdin</code>, nó coi hết tệp là hết dữ liệu. Dòng cuối viết dở vẫn có đủ hai cột — một id và một mẩu 16 ký tự của một giá trị 252 ký tự — nên nó là một dòng HỢP LỆ. Câu <code>COPY</code> thành công với 141.090 dòng, một dòng trong đó đã hỏng, và mọi thứ nằm SAU phần dữ liệu trong một bản dump thuần thì đơn giản là không bao giờ được chạy: phần còn lại của <code>lon</code>, trọn bảng <code>tai_lieu_nhung</code>, và <strong>cả mười hai chỉ mục, khoá chính, khoá ngoại</strong> — thứ mà <code>pg_dump</code> ghi ở CUỐI để dựng một lần sau khi dữ liệu đã nạp xong. Mã thoát 0, không lỗi nào, có hay không có <code>ON_ERROR_STOP</code>.</p>
<p>So với phép đo cũ trong bài này: chỗ cắt rơi vào giữa một dòng, <code>COPY</code> hỏng, và bảng về với <em>KHÔNG</em> dòng nào. Cùng một kiểu hỏng, khác một byte, triệu chứng NGƯỢC nhau. Đó là lý do phép kiểm đáng tin duy nhất là đối chiếu số dòng với một danh sách những gì LẼ RA phải có.</p>

<h3>Định dạng custom, đo lại</h3>
<p>Cùng cái đĩa ấy, lấp trước 42 MB để chỉ còn 6 MB cho bản dump custom 13 MB:</p>
<div class="out">tmpfs            48M   42M  6.0M  88% /mnt/nho
=== pg_dump -Fc vao dia con 6 MB ===
pg_dump: error: could not write to output file: No space left on device
  pg_dump ma thoat: 1
  tep: 6.0M (ban du: 13M)
=== pg_restore --list (doc muc luc) ===
  ma thoat: 0, 8 muc TABLE DATA
3646; 0 16725 TABLE DATA public lon postgres
=== pg_restore -d ph3 ===
pg_restore: error: could not read from input file: end of file
  pg_restore ma thoat: 1
  bf=300000  kh=200000  lon=0  tai_lieu_nhung=0</div>
<p>Mọi phát hiện cũ đều đứng vững: <code>pg_restore</code> nhận ra hết tệp và thoát 1; nó vẫn để lại <code>bf</code> và <code>kh</code> với <code>lon</code> rỗng; còn <code>--list</code> thoát 0 và liệt kê dữ liệu của cả tám bảng, kể cả <code>lon</code>. Định dạng custom an toàn hơn SQL thuần chính vì bên đọc nó BIẾT mỗi khối phải dài bao nhiêu.</p>
<p>Và cùng tệp bị cụt ấy với <code>--single-transaction</code>, vào một cơ sở dữ liệu mới:</p>
<div class="out">$ pg_restore --single-transaction -d ph4 sl.dump; echo "ma thoat \$?"
pg_restore: error: could not read from input file: end of file
ma thoat 1
$ psql -d ph4 -Atc "select count(*) from pg_tables where schemaname='public'"
0</div>
<p>Cùng mã thoát, nhưng không để lại gì: không bảng nào, thay vì một cơ sở dữ liệu trông đúng một nửa.</p>

<h3>Làm cho một cú phục hồi hỏng thì hỏng Ồ ẠT — và không để lại gì</h3>
<table><thead><tr><th>Công cụ</th><th>Cờ</th><th>Tác dụng</th><th>Vẫn bỏ sót</th></tr></thead><tbody>
<tr><td><code>psql</code></td><td><code>-v ON_ERROR_STOP=1</code></td><td>dừng ở câu lệnh hỏng đầu tiên, thoát 3</td><td>một chỗ cắt không gây lỗi (ở trên)</td></tr>
<tr><td><code>psql</code></td><td><code>-1</code> / <code>--single-transaction</code></td><td>bọc cả tệp trong một giao dịch; có lỗi thì cuộn lại hết</td><td>như trên — không lỗi thì chẳng có gì để cuộn</td></tr>
<tr><td><code>pg_restore</code></td><td><code>--exit-on-error</code></td><td>dừng ở lỗi đầu tiên thay vì đếm "errors ignored"</td><td>một kho lưu sai-nhưng-hợp-lệ (nhầm CSDL, bản cũ)</td></tr>
<tr><td><code>pg_restore</code></td><td><code>--single-transaction</code></td><td>tất cả hoặc không gì; kéo theo <code>--exit-on-error</code>; không dùng chung được với <code>-j</code></td><td>như trên</td></tr>
<tr><td>bất kỳ</td><td>đếm dòng so với bản kê</td><td>bắt được thiếu dòng, thiếu bảng, sai môi trường</td><td>giá trị sai tinh vi — thêm mã băm (10.4)</td></tr>
</tbody></table>
<p>Các cờ biến phần lớn kiểu hỏng thành lỗi và ngăn một cú phục hồi hỏng để lại một cơ sở dữ liệu dựng dở. Không cờ nào phân biệt được một tệp ĐẦY ĐỦ với một tệp tình cờ kết thúc gọn gàng. Chỉ việc đối chiếu với một thứ được ghi lại LÚC SAO LƯU mới làm được.</p>

<h3>Mọi kiểu hỏng câm của chương này, ở một chỗ</h3>
<div class="kv-grid">
<div class="kv"><span class="k">đĩa đầy giữa lúc dump</span><span class="v">bài này: một tệp phục hồi ra 0 dòng hoặc 141.090 dòng, với mã thoát 0.</span></div>
<div class="kv"><span class="k"><code>docker exec -t</code></span><span class="v">10.1: thừa 47.828 byte, cả hai lệnh thoát 0, <code>pg_restore</code> sập (139).</span></div>
<div class="kv"><span class="k">công cụ cũ hơn máy chủ</span><span class="v">10.1: bản dump không bao giờ bắt đầu; chỉ một mã thoát được kiểm mới nhận ra (GitLab, 2017).</span></div>
<div class="kv"><span class="k"><code>pg_isready</code> lúc khởi tạo</span><span class="v">10.2: cú phục hồi vào máy chủ tạm bị cắt ngang và trông như một bản dump rỗng.</span></div>
<div class="kv"><span class="k">môi trường phục hồi thiếu phần mở rộng</span><span class="v">10.4: thiếu hai bảng và 26.778 dòng trên website thật, và bộ kiểm in ✅.</span></div>
<div class="kv"><span class="k">vai trò nằm ngoài bản dump</span><span class="v">10.5: đủ mọi dòng, ứng dụng không đăng nhập được.</span></div>
<div class="kv"><span class="k">xoay vòng xoá mất bản tốt</span><span class="v">10.7: giữ bảy tệp 0 byte, xoá mười bản tốt.</span></div>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> sau một đêm đĩa VPS chạm 100%, cả nhóm thấy tệp sao lưu đêm qua "hơi nhỏ hơn mọi khi" nhưng phục hồi "vẫn ổn". Chứng minh trên máy thí nghiệm rằng cả hai chữ "ổn" đều có thể là nói dối — và phép kiểm nào nói thật.</p>
<ol>
<li>Dựng một container thí nghiệm có đĩa đầu ra nhỏ: <code>docker run -d --name dv10-nho --label dvhoc=10 --tmpfs /mnt/nho:size=48m …</code>, và chĩa <code>pg_dump -Fp</code> vào một cơ sở dữ liệu lớn hơn 48 MB.</li>
<li>Phục hồi tệp bị cụt vào một cơ sở dữ liệu mới, hai lần: bằng <code>psql -f</code> trơn và với <code>-v ON_ERROR_STOP=1</code>. Ghi hai mã thoát, số dòng của bảng lớn nhất và số chỉ mục.</li>
<li>Lấp đĩa để còn ~6 MB rồi lặp lại với <code>-Fc</code>: chạy <code>pg_restore --list</code> và <code>pg_restore -d</code>, ghi cả hai mã thoát.</li>
<li>Lặp lại cú phục hồi <code>-Fc</code> với <code>--single-transaction</code> vào một cơ sở dữ liệu mới và kiểm rằng không còn gì sót lại.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có bốn mã thoát nói ngược với thực tế, một cú phục hồi không để lại gì, và một câu giải thích vì sao đếm dòng từng bảng là phép kiểm DUY NHẤT bắt được mọi trường hợp.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ENOSPC (hết chỗ trên đĩa)</span><span class="v">"No space left on device" — lỗi một lệnh ghi nhận được khi đĩa đầy.</span></div>
  <div class="kv"><span class="k">truncated file (tệp bị cụt)</span><span class="v">Tệp dừng sớm; nó có thể dừng giữa một dòng hoặc gọn gàng giữa hai dòng.</span></div>
  <div class="kv"><span class="k">COPY … FROM stdin (khối dữ liệu)</span><span class="v">Cách bản dump thuần chở dữ liệu; psql coi hết tệp là hết dữ liệu.</span></div>
  <div class="kv"><span class="k">ON_ERROR_STOP (dừng khi lỗi)</span><span class="v">Biến của psql dừng ở lỗi đầu tiên — vô dụng khi không có lỗi nào.</span></div>
  <div class="kv"><span class="k">--single-transaction (một giao dịch)</span><span class="v">Tất cả hoặc không gì: hỏng thì cuộn lại hết thay vì để lại nửa cơ sở dữ liệu.</span></div>
  <div class="kv"><span class="k">table of contents --list (mục lục)</span><span class="v">Phần chỉ mục ở đầu kho lưu custom; đọc được kể cả khi dữ liệu phía sau đã mất.</span></div>
  <div class="kv"><span class="k">exit code (mã thoát)</span><span class="v">Lời tự nhận xét của một tiến trình về chính nó — bằng chứng rằng có gì đó đã chạy, không phải rằng kết quả đúng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một bản dump chạm đĩa đầy để lại một tệp trông hợp lý; mã thoát 1 của pg_dump là tín hiệu thành thật duy nhất.</li>
<li>Một bản dump thuần bị cắt giữa hai dòng phục hồi với mã 0, không lỗi — 141.090/400.170 dòng, dòng cuối hỏng, không chỉ mục — kể cả với <code>ON_ERROR_STOP=1</code>.</li>
<li>Một bản dump bị cắt giữa dòng cho triệu chứng ngược lại: một bảng rỗng. Cùng kiểu hỏng, khác một byte.</li>
<li><code>pg_restore</code> phát hiện kho lưu custom bị cụt và thoát 1, nhưng vẫn để lại một cơ sở dữ liệu nửa vời trừ khi dùng <code>--single-transaction</code>.</li>
<li><code>pg_restore --list</code> chỉ đọc mục lục và thoát 0 trên nửa cái tệp — nó không phải phép kiểm.</li>
<li>Mã thoát và số lỗi không phân biệt được tệp đầy đủ với tệp kết thúc gọn; đếm dòng so với bản kê thì phân biệt được.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — psql, ON_ERROR_STOP</span><span class="lc-sub">postgresql.org/docs/current/app-psql.html — cái biến đó, mặc định <code>off</code> của nó, và bảng mã thoát cho thấy số 3 cho một lỗi trong script.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — pg_restore, --list và --exit-on-error</span><span class="lc-sub">postgresql.org/docs/current/app-pgrestore.html — <code>--list</code> CHỈ đọc mục lục, và <code>--exit-on-error</code> đổi cái mặc định đi-tiếp-qua-lỗi.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">errno(3) — ENOSPC</span><span class="lc-sub">man 3 errno — cái lỗi mà <code>pg_dump</code> phơi ra, đo từ phía hệ tệp ở Bài 8.4.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — giao dịch, và một câu COPY hỏng cuộn lại cái gì</span><span class="lc-sub">/courses/postgresql/learn${REF} — vì sao một câu COPY bị cắt cụt để lại một bảng RỖNG chứ không phải một bảng nửa vời.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 10.4 ─────────────────────────── */
    {
      title: '10.4 — The only proof is a restore|||10.4 — Bằng chứng DUY NHẤT là một cú phục hồi',
      slug: 'deploy-10-4-kiem-chung',
      type: 'VIDEO',
      description: 'Một script phục hồi bản sao lưu vào cơ sở dữ liệu tạm rồi đối chiếu số dòng từng bảng — 4.688 mili giây cho toàn bộ phép kiểm. Nó chấp nhận bản tốt và từ chối bản cắt cụt ở 10.3 với mã thoát 2.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.4</span>
<h2>The only proof is a restore</h2>
<p class="lead">10.3 established that every cheap check can be passed by a broken backup. This lesson is the expensive check, and the point is that it turns out not to be expensive at all.</p>

<h3>The script</h3>
<pre><code>#!/bin/bash
<span class="tok-comment"># kiem-sao-luu.sh — phuc hoi vao CSDL tam roi DOI CHIEU so dong</span>
set -euo pipefail
TEP="\${1:?can duong dan ban sao luu}"
GOC="\${2:-thu}"
TAM="kiem_\$(date +%s)"

don_dep() { psql -q -c "drop database if exists \$TAM;" >/dev/null 2>&amp;1 || true; }
trap don_dep EXIT                          <span class="tok-comment"># Chuong 7: don sach tren MOI duong ra</span>

T0=\$(date +%s%N)
psql -q -c "create database \$TAM;"
pg_restore -j2 -d "\$TAM" "\$TEP" >/dev/null 2>&amp;1 || { echo "  ✗ pg_restore HONG"; exit 2; }
T1=\$(date +%s%N)
echo "  phuc hoi trong \$(( (T1-T0)/1000000 )) ms"

LECH=0
while read -r bang; do
  A=\$(psql -t -A -d "\$GOC" -c "select count(*) from \\"\$bang\\";")
  B=\$(psql -t -A -d "\$TAM" -c "select count(*) from \\"\$bang\\";" 2>/dev/null || echo "THIEU")
  if [ "\$A" != "\$B" ]; then echo "  ✗ \$bang: goc=\$A phuc-hoi=\$B"; LECH=1
  else printf "  ✓ %-12s %s dong\\n" "\$bang" "\$A"; fi
done &lt; &lt;(psql -t -A -d "\$GOC" -c "select tablename from pg_tables where schemaname='public' order by 1;")
[ "\$LECH" = 0 ] || { echo "  ✗ BAN SAO LUU KHONG KHOP"; exit 3; }
echo "  ✓ moi bang khop"</code></pre>

<h3>Against a good backup</h3>
<div class="out">  phuc hoi trong 3587 ms
  ✓ _migrations  0 dong
  ✓ bf           300000 dong
  ✓ ct           0 dong
  ✓ dh           90 dong
  ✓ don          240 dong
  ✓ hop_gui      90 dong
  ✓ kh           200000 dong
  ✓ lon          400170 dong
  ✓ nguoi_dung   6 dong
  ✓ moi bang khop
  ma thoat: 0 | TONG 4688 ms</div>

<h3>Against the broken one from 10.3</h3>
<div class="out">  ✗ pg_restore HONG
  ma thoat: 2</div>

<div class="callout ok">
<p><strong>4,688 milliseconds.</strong> That is the entire cost of knowing your backup works, on this database, run after every backup. Compare it against the alternative: discovering it during an incident, with the site down, and finding out that the file you have been keeping for three months restores an empty table. There is no other check in this course with a better ratio.</p>
</div>

<h3>Why it is not just a restore</h3>
<p>The restore is half. Notice the loop: it enumerates tables <em>from the source database</em> and compares counts. That ordering matters — enumerating from the restored copy would silently skip a table that is missing entirely, reporting success because every table it found matched. Asking the source what should exist is what makes a missing table an error rather than an absence.</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">1. it restores</span><span class="lz-lnote">catches truncation, corruption, and a dump of the wrong thing</span></div>
<div class="lz-layer"><span class="lz-lname">2. into a temporary database</span><span class="lz-lnote">never over production — 10.2&#39;s rule, enforced by the script rather than by discipline</span></div>
<div class="lz-layer"><span class="lz-lname">3. enumerating from the SOURCE</span><span class="lz-lnote">so a table absent from the backup is a mismatch, not an omission</span></div>
<div class="lz-layer"><span class="lz-lname">4. comparing counts per table</span><span class="lz-lnote">the check 10.3 proved is the only one that cannot be fooled</span></div>
<div class="lz-layer"><span class="lz-lname">5. cleaning up on every exit path</span><span class="lz-lnote"><code>trap … EXIT</code>, so a failed check does not leave a 192 MB database behind (Chapter 7)</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — row counts catch a missing table, not a corrupted row.</strong> A backup with all the right counts and subtly wrong data passes this check. That is a real limit and it is worth knowing, though it is a much rarer failure than truncation. If you want more, add a checksum over a few stable columns — <code>select md5(string_agg(id::text||du_lieu, '' order by id)) from lon</code> — which costs a full scan and catches content changes. For most people, counts plus a successful restore is where the value stops rising steeply.</p>
</div>

<h3>Getting it off the machine, measured</h3>
<p>A backup on the same disk as the database is not a backup — Chapter 8 measured that disk filling and Chapter 6 measured what happens to data nobody kept. Encryption before it leaves is not optional either, since the file contains everything:</p>

<div class="out">  sl.dump          21.0 MB
  sl.dump.enc      21.0 MB
  ma hoa: 58 ms
  giai ma: 40 ms
  ✓ giai ma ra ĐÚNG byte goc
=== va no co phuc hoi duoc that khong? ===
  ✓ lon          400170 dong
  ✓ moi bang khop</div>

<pre><code>openssl enc -aes-256-cbc -pbkdf2 -salt -pass file:/etc/sao-luu.key \\
  -in "\$TEP" -out "\$TEP.enc"</code></pre>

<p>58 milliseconds to encrypt 21 MB, 40 to decrypt, byte-identical output, and the decrypted file passes the same verification. Encryption costs 1.2% of the restore time. There is no argument for skipping it.</p>

<div class="callout warn">
<p><strong>And the passphrase is now a thing that can be lost.</strong> An encrypted backup whose key is only on the server it backs up is a backup you cannot restore in exactly the scenario you made it for. The key belongs somewhere the server is not — a password manager, a second machine, a piece of paper in a drawer. Chapter 4&#39;s rules about where secrets live apply here with the additional twist that this secret must survive the machine&#39;s total loss.</p>
</div>

<h3>The schedule that makes this real</h3>
${slide('dv-10', 20, 'Báo động khi VẮNG MẶT: tuổi bản sao lưu mới nhất')}
<div class="kv-grid">
<div class="kv"><span class="k">after every backup</span><span class="v">the verify script. 4.7 s here — if it is minutes on your database, run it daily instead</span></div>
<div class="kv"><span class="k">weekly</span><span class="v">restore from the <em>off-site</em> copy, decrypting it, so the key and the transfer are tested too</span></div>
<div class="kv"><span class="k">quarterly</span><span class="v">a full rehearsal on a fresh machine, timed. That number is your real RTO, and it is always larger than the database restore (10.5)</span></div>
<div class="kv"><span class="k">alert on absence</span><span class="v">no successful verification in 48 hours is an alert. A backup system that stops silently looks identical to one that works (9.4)</span></div>
</div>

<p>That last row is the one people miss. Every check in this lesson fires on failure. Nothing fires when the cron job stops running altogether — the log stays quiet, the exit codes stay 0, because nothing ran. Alerting on the <em>absence</em> of a success is what covers that, and it is the same shape as the dead-man&#39;s-switch check on your alerting pipeline in 9.4.</p>

<h3>Checking on another machine: carry a manifest</h3>
${slide('dv-10', 16, 'Kiểm ở máy khác: mang theo bản kê')}
<p>The script above compares the restored copy with the <em>source</em> database, which only works on a machine that can reach production. The most valuable place to run the check is the opposite: a separate machine — the one you would actually restore on — that holds the encrypted backups and the decryption key, and has no access to production at all. There is no source to ask. So the backup script from 10.1 writes the answer down at backup time: <code>ban-ke.txt</code>, one line per table with the number of rows <em>inside the dump</em>. The check on the other machine restores and compares against that:</p>
<pre><code class="language-bash">#!/bin/bash
<span class="tok-comment"># kiem-may-khac.sh &lt;ban.tar.age&gt; &lt;may-dich&gt; — phuc hoi thu tren MAY KHAC, doi chieu ban ke</span>
set -Eeuo pipefail
TEP=\$1; export PGHOST=\$2 PGUSER=postgres
TAM=\$(mktemp -d); DB=kiem; LOI=0; LECH=0
trap 'rm -rf "\$TAM"' EXIT
T0=\$(date +%s%N); moc() { echo "  [\$(( (\$(date +%s%N)-T0)/1000000 )) ms] \$*"; }

age -d -i ~/.config/age/khoa.txt "\$TEP" | tar -C "\$TAM" -xf -
(cd "\$TAM" &amp;&amp; sha256sum --quiet -c sha256.txt);            moc "giai ma + sha256 khop"
grep -vE '^(CREATE|ALTER) ROLE postgres' "\$TAM/vai-tro.sql" |
  psql -q -v ON_ERROR_STOP=1 -f - &gt;/dev/null;               moc "tao vai tro"
createdb "\$DB"
pg_restore -j4 -d "\$DB" "\$TAM/csdl.dump" 2&gt;"\$TAM/loi.txt" || LOI=\$?
moc "pg_restore -j4 xong, ma thoat \$LOI, \$(grep -c 'error:' "\$TAM/loi.txt") dong loi"
grep -m2 'ERROR:' "\$TAM/loi.txt" | sed 's/^pg_restore: error: could not execute query: /    /' || true
psql -d "\$DB" -qc 'analyze';                                moc "analyze"
while read -r bang can; do
  co=\$(psql -d "\$DB" -Atc "select count(*) from \$bang" 2&gt;/dev/null) || co=THIEU
  [ "\$co" = "\$can" ] &amp;&amp; printf '    ✓ %-22s %s\\n' "\$bang" "\$co" ||
    { printf '    ✗ %-22s can %s, co %s\\n' "\$bang" "\$can" "\$co"; LECH=1; }
done &lt; "\$TAM/ban-ke.txt"
PGOPTIONS='-c enable_seqscan=off' psql -d "\$DB" -Atc "select 'truy van mau (hnsw): id='||id
  from tai_lieu_nhung order by nhung &lt;-&gt; '[0,0,0,0,0,0,0,0]' limit 1" 2&gt;&amp;1 | sed 's/^/    /' || LECH=1
moc "doi chieu xong"
[ "\$LOI\$LECH" = 00 ] &amp;&amp; echo "  ✓ PHUC HOI DUOC — khop ban ke" || { echo "  ✗ KHONG DAT"; exit 3; }</code></pre>
<table><thead><tr><th>Step</th><th>What it proves</th><th>What goes wrong without it</th></tr></thead><tbody>
<tr><td><code>age -d -i</code></td><td>the key stored away from the server still opens the file</td><td>you learn the key is lost during the incident</td></tr>
<tr><td><code>sha256sum -c</code></td><td>the bytes are the ones the server wrote</td><td>a copy cut at 97% restores 97% (10.7)</td></tr>
<tr><td>roles first</td><td>the dump's <code>GRANT</code>s have someone to grant to</td><td>"role does not exist", "errors ignored" (10.5)</td></tr>
<tr><td><code>2&gt;loi.txt || LOI=\$?</code></td><td>errors are kept and counted, not hidden</td><td>a restore that "ignored" errors looks like a success</td></tr>
<tr><td>counts from <code>ban-ke.txt</code></td><td>every table the dump contained came back, with every row</td><td>a missing table is invisible when you only look at what exists</td></tr>
<tr><td>a sample query</td><td>types, extensions, indexes and operators work, not just rows</td><td>rows restored into a database that cannot answer the application's queries</td></tr>
<tr><td>verdict computed from <code>LOI</code> and <code>LECH</code></td><td>the green line is a consequence of the comparisons</td><td>a script that always ends with "OK" (below)</td></tr>
</tbody></table>
<p>Two design choices matter. The target is a <strong>fresh</strong> PostgreSQL every time, started from the production image, so the check also proves you can build the environment. And the verdict line is printed only if both flags are still 0 — it cannot be reached by falling off the end of the script.</p>

<h3>The wrong image: a check that fails for the right reason</h3>
${slide('dv-10', 17, 'Cùng một tệp: đúng ảnh pgvector thì ✓, ảnh postgres:16 thường thì ✗')}
<p>The same encrypted backup, checked on two fresh machines: <code>may2</code> from the production image <code>pgvector/pgvector:pg16</code>, and <code>sai</code> from plain <code>postgres:16</code> — "also PostgreSQL 16", which is exactly the reasoning that leads people to it.</p>
<div class="out">$ kiem-may-khac.sh thu-20260929-1359.tar.age may2
  [85 ms] giai ma + sha256 khop
  [172 ms] tao vai tro
  [5559 ms] pg_restore -j4 xong, ma thoat 0, 0 dong loi
  [6474 ms] analyze
    ✓ public.bai_hoc         120
    ✓ public.bf              300000
    ✓ public.don             240
    ✓ public.kh              200000
    ✓ public.lon             400170
    ✓ public.nguoi_dung      6
    ✓ public.tai_lieu_nhung  20000
    ✓ public.tien_do         320
    truy van mau (hnsw): id=1205
  [7109 ms] doi chieu xong
  ✓ PHUC HOI DUOC — khop ban ke
ma thoat 0
$ kiem-may-khac.sh thu-20260929-1359.tar.age sai
  [116 ms] giai ma + sha256 khop
  [186 ms] tao vai tro
  [2453 ms] pg_restore -j4 xong, ma thoat 1, 7 dong loi
    ERROR:  extension "vector" is not available
    ERROR:  extension "vector" does not exist
  [3027 ms] analyze
    ✓ public.bai_hoc         120
    …
    ✓ public.nguoi_dung      6
    ✗ public.tai_lieu_nhung  can 20000, co THIEU
    ✓ public.tien_do         320
    ERROR:  relation "tai_lieu_nhung" does not exist
    LINE 2:   from tai_lieu_nhung order by nhung &lt;-&gt; '[0,0,0,0,0,0,0,0]'...
                   ^
  [3611 ms] doi chieu xong
  ✗ KHONG DAT
ma thoat 3</div>
<p>On the plain image, <code>CREATE EXTENSION vector</code> failed, so the table with a <code>vector</code> column could not be created, and everything else restored normally. Seven of eight tables match. A checker that only asked "did <code>pg_restore</code> finish?" or "are there tables?" would pass this. The manifest caught the missing table and the sample query caught it a second time.</p>

<h3>The real story: the checker printed ✅ over two missing tables</h3>
${slide('dv-10', 18, 'Chuyện thật: bộ kiểm dùng sai ảnh vẫn in ✅')}
<p>On the site this course follows, a home machine pulls the production backup every night at 03:00 and test-restores it into a temporary PostgreSQL container. For weeks the container came from a PostGIS image that did not contain <code>pgvector</code>, while production ran a custom image with both. Measured on 20/09/2026, the same backup file:</p>
<table><thead><tr><th></th><th>image without pgvector</th><th>production&#39;s image</th></tr></thead><tbody>
<tr><td>psql errors</td><td>44</td><td>0</td></tr>
<tr><td>tables</td><td>316</td><td>318</td></tr>
<tr><td>rows</td><td>340,265</td><td>367,043</td></tr>
<tr><td>the checker printed</td><td>✅ RESTORE ĐƯỢC</td><td>✅ RESTORE ĐƯỢC</td></tr>
</tbody></table>
<p>Two tables of document embeddings — 26,778 rows — silently did not come back, every night, and the checker's last line was a fixed "✅ restorable". The backup itself was fine; the <em>test environment</em> was broken, and the check could not tell the two apart. The fix has two halves: restore into the image production actually runs (read it from the <code>image:</code> line of the compose file, do not type it from memory), and compute the verdict from comparisons so that a checker which prints 44 errors cannot also print ✅.</p>

<h3>Checking the checker</h3>
${slide('dv-10', 19, 'Bộ kiểm cũng phải được kiểm: script không tồn tại, volume vô danh, sai phiên bản')}
<p>Every backup disaster in this chapter so far was a checker that looked fine. Three more, all real:</p>
<div class="kv-grid">
<div class="kv"><span class="k">the script that was never there</span><span class="v">the VPS had a cron line at 02:05 calling <code>verify-backup.sh</code>. The file did not exist; the real script had a different name and had never been called. The log held 62 lines of "not found", one per night, and until 18/08/2026 no backup had ever been test-restored. Cron does not report a missing command anywhere you look.</span></div>
<div class="kv"><span class="k">the checker that filled the disk</span><span class="v">each nightly test started a PostgreSQL container and removed it with <code>docker rm -f</code> — without <code>-v</code>. The image declares a volume for its data directory, so every run left an anonymous volume behind: 650–915 MB per night on the real machine, roughly 27 GB a month.</span></div>
<div class="kv"><span class="k">the readiness check that lied</span><span class="v"><code>pg_isready</code> answering from the temporary init server (10.2).</span></div>
</div>
<p>The volume leak is easy to reproduce:</p>
<pre><code class="language-bash">docker run -d --name dv10-thu -e POSTGRES_PASSWORD=12345 pgvector/pgvector:pg16
docker inspect -f "{{range .Mounts}}{{.Type}} {{.Name}} -&gt; {{.Destination}}{{end}}" dv10-thu
docker rm -f dv10-thu
docker volume inspect -f "{{.Name}}" c6599c64bff0…        <span class="tok-comment"># van con</span>
docker run --rm -v c6599c64bff0…:/v alpine du -sh /v</code></pre>
<div class="out">volume c6599c64bff0… -&gt; /var/lib/postgresql/data
dv10-thu
c6599c64bff0
38.2M	/v</div>
<p>38 MB for an empty cluster; after one test restore of this chapter's database the leftover volumes measured 361 and 385 MB. <code>docker rm -fv</code> removes the anonymous volume with the container — measured: <code>docker volume inspect</code> then answers <code>no such volume</code>. The general rule is the one Chapter 9 applied to monitoring: before you trust what a checker says about the backup, prove the checker can fail, and that it cleans up after itself.</p>

<h3>Alerting on absence, built</h3>
<p>The schedule above ends with "no successful verification in 48 hours is an alert". Here is the smallest version that works, run on the storage machine — not the VPS, which is the thing that might have stopped:</p>
<pre><code class="language-bash">#!/bin/bash
<span class="tok-comment"># canh-tuoi.sh &lt;thu-muc&gt; [nguong-gio] — bao dong khi ban sao luu MOI NHAT qua gia (hoac khong co)</span>
DIR=\$1; NGUONG=\${2:-26}
M=\$(ls -t "\$DIR"/*.tar.age 2&gt;/dev/null | head -1)
[ -n "\$M" ] || { echo "BAO DONG: khong co ban sao luu nao trong \$DIR"; exit 2; }
TUOI=\$(( (\$(date +%s) - \$(stat -c %Y "\$M")) / 3600 ))
CO=\$(stat -c %s "\$M")
if (( TUOI &gt; NGUONG )); then echo "BAO DONG: moi nhat \$(basename "\$M") da \$TUOI gio tuoi (&gt; \$NGUONG)"; exit 1
elif (( CO &lt; 1000000 )); then echo "BAO DONG: \$(basename "\$M") chi \$CO byte"; exit 1
else echo "OK: moi nhat \$(basename "\$M"), \$TUOI gio tuoi, \$CO byte"; fi</code></pre>
<div class="out">$ canh-tuoi.sh ~/kho
OK: moi nhat thu-20260929-1412.tar.age, 0 gio tuoi, 10396328 byte
ma thoat 0
$ canh-tuoi.sh ~/cu      # cron sao luu da chet tu hom qua
BAO DONG: moi nhat thu-20260929-1359.tar.age da 31 gio tuoi (&gt; 26)
ma thoat 1
$ canh-tuoi.sh ~/rong
BAO DONG: khong co ban sao luu nao trong /home/deploy/rong
ma thoat 2</div>
<p>26 hours is one nightly run plus two hours of slack. The size check catches the zero-byte file that a broken dump leaves behind. Run it hourly from a timer and send its non-zero exits to the alert channel of Chapter 9. On the real site this is the "backup age" line of the home machine's status report — the one check that fires when nothing runs at all.</p>

<h3>On macOS and Windows</h3>
<ul>
<li><strong>These scripts use GNU tools.</strong> Measured on the Mac used for this chapter: <code>stat -c%s</code> fails with <code>stat: illegal option -- c</code> (the BSD form is <code>stat -f %z</code> for size and <code>stat -f %m</code> for modification time); <code>sha256sum --quiet -c</code> and <code>date +%s%N</code> do work on current macOS. Run the checker on Linux — the storage machine, or a container — rather than porting it.</li>
<li><strong>A Windows teammate</strong> can run the whole check inside WSL 2 or in a Linux container; <code>age</code> and <code>rclone</code> both have Windows builds, but a check that behaves differently on each machine is not a check.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> your team's nightly "test restore" has printed ✅ for a month. Production uses pgvector; the test job's <code>docker run</code> line says <code>postgres:16</code>. Prove whether the ✅ means anything, then fix the job so it cannot lie.</p>
<ol>
<li>Create a database in <code>pgvector/pgvector:pg16</code> with one table that has a <code>vector</code> column, and back it up with <code>sao-luu.sh</code> from 10.1 (the manifest <code>ban-ke.txt</code> must be in the archive).</li>
<li>Start two fresh containers, one from the production image and one from <code>postgres:16</code>, and run <code>kiem-may-khac.sh</code> against each. Record both exit codes and the line that names the missing table.</li>
<li>Break the checker on purpose: make the last line an unconditional <code>echo "OK"</code> and run it against the wrong image. Then restore the verdict logic.</li>
<li>Run <code>canh-tuoi.sh</code> on a directory whose newest file you <code>touch -d "-31 hours"</code>, and on an empty directory.</li>
</ol>
<p><strong>Done when:</strong> the correct image gives exit 0 with every table ✓, the plain image gives exit 3 naming the vector table, you have seen the broken checker print "OK" over the same failure, <code>canh-tuoi.sh</code> exits 1 and 2 in the two stale cases — and <code>docker volume ls</code> shows no volume left by your test containers (use <code>docker rm -fv</code>).</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">test restore</span><span class="v">Restoring a backup somewhere harmless to prove it works — the only real backup check.</span></div>
  <div class="kv"><span class="k">manifest (ban-ke.txt)</span><span class="v">Rows per table recorded at backup time, so a machine without access to production can compare.</span></div>
  <div class="kv"><span class="k">sample query</span><span class="v">A query that exercises types, extensions and indexes, not just row counts.</span></div>
  <div class="kv"><span class="k">production image</span><span class="v">The exact container image production runs; the test restore must use it, not a lookalike.</span></div>
  <div class="kv"><span class="k">anonymous volume</span><span class="v">A volume Docker creates for an image's declared data path; <code>rm -f</code> without <code>-v</code> leaves it behind.</span></div>
  <div class="kv"><span class="k">alerting on absence</span><span class="v">Alarming when a success has not happened — the only way to notice a job that stopped running.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>The check that counts is a restore into a fresh database followed by per-table counts and a sample query.</li>
<li>On a separate machine there is no source to ask, so the backup carries a manifest counted from the dump itself.</li>
<li>Restoring into plain <code>postgres:16</code> lost the vector table with 7 of 8 tables matching; only the manifest and the sample query noticed.</li>
<li>On the real site a checker using the wrong image printed ✅ over 2 missing tables and 26,778 missing rows every night.</li>
<li>Checkers fail too: a cron line calling a script that did not exist for 62 days, a leaked 38–915 MB volume per run.</li>
<li>Alert on the age of the newest backup from a machine other than the one that makes it.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker — docker container rm</span><span class="lc-sub">docs.docker.com/reference/cli/docker/container/rm/ — <code>-v</code> removes the anonymous volumes associated with the container.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — pg_restore -j and CREATE DATABASE</span><span class="lc-sub">postgresql.org/docs/current/app-pgrestore.html — parallel restore needs a database that already exists, which is why the script creates one first.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">openssl-enc(1)</span><span class="lc-sub">docs.openssl.org/master/man1/openssl-enc/ — <code>-pbkdf2</code> is not optional: without it the key derivation is a single MD5 pass and the encryption is much weaker than it looks.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">age — a simple, modern encryption tool</span><span class="lc-sub">github.com/FiloSottile/age — public-key encryption for backups, so the server can encrypt without holding the key that decrypts. Better than a shared passphrase for exactly this use.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">restic — backups with deduplication and verification</span><span class="lc-sub">restic.readthedocs.io — its <code>check --read-data</code> subcommand is this lesson&#39;s idea built in, and worth reading about even if you stay with pg_dump.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — trap, temporary resources and cleanup</span><span class="lc-sub">/courses/linux-bash/learn${REF} — the <code>trap … EXIT</code> pattern that stops a failed check leaving a database behind.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.4</span>
<h2>Bằng chứng DUY NHẤT là một cú phục hồi</h2>
<p class="lead">Bài 10.3 xác lập rằng mọi phép kiểm rẻ tiền đều bị một bản sao lưu hỏng vượt qua được. Bài này là phép kiểm ĐẮT, và điểm mấu chốt là hoá ra nó chẳng đắt chút nào.</p>

<h3>Cái script</h3>
<pre><code>#!/bin/bash
<span class="tok-comment"># kiem-sao-luu.sh — phuc hoi vao CSDL tam roi DOI CHIEU so dong</span>
set -euo pipefail
TEP="\${1:?can duong dan ban sao luu}"
GOC="\${2:-thu}"
TAM="kiem_\$(date +%s)"

don_dep() { psql -q -c "drop database if exists \$TAM;" >/dev/null 2>&amp;1 || true; }
trap don_dep EXIT                          <span class="tok-comment"># Chuong 7: don sach tren MOI duong ra</span>

T0=\$(date +%s%N)
psql -q -c "create database \$TAM;"
pg_restore -j2 -d "\$TAM" "\$TEP" >/dev/null 2>&amp;1 || { echo "  ✗ pg_restore HONG"; exit 2; }
T1=\$(date +%s%N)
echo "  phuc hoi trong \$(( (T1-T0)/1000000 )) ms"

LECH=0
while read -r bang; do
  A=\$(psql -t -A -d "\$GOC" -c "select count(*) from \\"\$bang\\";")
  B=\$(psql -t -A -d "\$TAM" -c "select count(*) from \\"\$bang\\";" 2>/dev/null || echo "THIEU")
  if [ "\$A" != "\$B" ]; then echo "  ✗ \$bang: goc=\$A phuc-hoi=\$B"; LECH=1
  else printf "  ✓ %-12s %s dong\\n" "\$bang" "\$A"; fi
done &lt; &lt;(psql -t -A -d "\$GOC" -c "select tablename from pg_tables where schemaname='public' order by 1;")
[ "\$LECH" = 0 ] || { echo "  ✗ BAN SAO LUU KHONG KHOP"; exit 3; }
echo "  ✓ moi bang khop"</code></pre>

<h3>Trên một bản sao lưu TỐT</h3>
<div class="out">  phuc hoi trong 3587 ms
  ✓ _migrations  0 dong
  ✓ bf           300000 dong
  ✓ ct           0 dong
  ✓ dh           90 dong
  ✓ don          240 dong
  ✓ hop_gui      90 dong
  ✓ kh           200000 dong
  ✓ lon          400170 dong
  ✓ nguoi_dung   6 dong
  ✓ moi bang khop
  ma thoat: 0 | TONG 4688 ms</div>

<h3>Trên bản HỎNG của bài 10.3</h3>
<div class="out">  ✗ pg_restore HONG
  ma thoat: 2</div>

<div class="callout ok">
<p><strong>4.688 mili giây.</strong> Đó là TOÀN BỘ cái giá của việc BIẾT rằng bản sao lưu của bạn chạy được, trên cơ sở dữ liệu này, chạy sau mỗi lần sao lưu. So nó với cách còn lại: phát hiện ra giữa một sự cố, với website đang sập, và biết rằng cái tệp bạn giữ suốt ba tháng phục hồi ra một bảng rỗng. Không có phép kiểm nào khác trong khoá này có tỷ số tốt hơn.</p>
</div>

<h3>Vì sao nó không CHỈ là một cú phục hồi</h3>
<p>Cú phục hồi là một nửa. Để ý cái vòng lặp: nó liệt kê các bảng <em>TỪ CƠ SỞ DỮ LIỆU GỐC</em> rồi đối chiếu số dòng. Thứ tự đó QUAN TRỌNG — liệt kê từ bản đã phục hồi sẽ âm thầm bỏ qua một bảng thiếu HẲN, và báo thành công vì mọi bảng nó tìm thấy đều khớp. Hỏi cái GỐC xem cái gì LẼ RA phải có mới là thứ biến một bảng thiếu thành một LỖI thay vì một sự vắng mặt.</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">1. nó PHỤC HỒI</span><span class="lz-lnote">bắt được cắt cụt, hỏng dữ liệu, và một bản dump của nhầm thứ</span></div>
<div class="lz-layer"><span class="lz-lname">2. vào một CSDL TẠM</span><span class="lz-lnote">không bao giờ đè lên production — quy tắc của 10.2, được SCRIPT thực thi chứ không phải kỷ luật</span></div>
<div class="lz-layer"><span class="lz-lname">3. liệt kê từ NGUỒN</span><span class="lz-lnote">để một bảng vắng mặt trong bản sao lưu là một chỗ LỆCH, không phải một chỗ bỏ sót</span></div>
<div class="lz-layer"><span class="lz-lname">4. đối chiếu số dòng TỪNG bảng</span><span class="lz-lnote">phép kiểm mà 10.3 đã chứng minh là cái DUY NHẤT không lừa được</span></div>
<div class="lz-layer"><span class="lz-lname">5. dọn sạch trên MỌI đường ra</span><span class="lz-lnote"><code>trap … EXIT</code>, để một lần kiểm hỏng không bỏ lại một cơ sở dữ liệu 192 MB (Chương 7)</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — đếm số dòng bắt được một BẢNG thiếu, không bắt được một DÒNG hỏng.</strong> Một bản sao lưu có đủ mọi con số đếm đúng mà dữ liệu sai một cách tinh vi thì vẫn qua được phép kiểm này. Đó là một giới hạn thật và đáng biết, dù nó là kiểu hỏng HIẾM hơn nhiều so với cắt cụt. Nếu bạn muốn thêm, hãy thêm một mã băm trên vài cột ổn định — <code>select md5(string_agg(id::text||du_lieu, '' order by id)) from lon</code> — thứ tốn một lần quét toàn bảng và bắt được thay đổi nội dung. Với phần lớn người dùng, đếm số dòng cộng một cú phục hồi thành công là chỗ mà giá trị thôi tăng dốc.</p>
</div>

<h3>Đưa nó RA KHỎI cái máy, đo thật</h3>
<p>Một bản sao lưu nằm trên CÙNG cái đĩa với cơ sở dữ liệu thì không phải một bản sao lưu — Chương 8 đã đo cái đĩa ấy đầy lên và Chương 6 đã đo chuyện gì xảy ra với dữ liệu không ai giữ. Mã hoá trước khi nó rời đi cũng không phải tuỳ chọn, vì cái tệp đó chứa MỌI THỨ:</p>

<div class="out">  sl.dump          21.0 MB
  sl.dump.enc      21.0 MB
  ma hoa: 58 ms
  giai ma: 40 ms
  ✓ giai ma ra ĐÚNG byte goc
=== va no co phuc hoi duoc that khong? ===
  ✓ lon          400170 dong
  ✓ moi bang khop</div>

<pre><code>openssl enc -aes-256-cbc -pbkdf2 -salt -pass file:/etc/sao-luu.key \\
  -in "\$TEP" -out "\$TEP.enc"</code></pre>

<p>58 mili giây để mã hoá 21 MB, 40 để giải mã, đầu ra giống hệt từng byte, và tệp đã giải mã vượt qua đúng phép kiểm ấy. Mã hoá tốn 1,2% thời gian phục hồi. Không có lập luận nào cho việc bỏ qua nó.</p>

<div class="callout warn">
<p><strong>Và cái mật khẩu giờ là một thứ CÓ THỂ MẤT.</strong> Một bản sao lưu đã mã hoá mà khoá của nó chỉ nằm trên chính cái máy chủ nó sao lưu là một bản sao lưu bạn KHÔNG phục hồi được trong đúng cái kịch bản bạn tạo ra nó để đối phó. Cái khoá thuộc về một nơi mà máy chủ KHÔNG ở đó — một trình quản lý mật khẩu, một cái máy thứ hai, một mảnh giấy trong ngăn kéo. Các quy tắc của Chương 4 về chỗ bí mật sống áp vào đây kèm một điểm xoáy nữa: bí mật này phải SỐNG SÓT qua việc mất trắng cái máy.</p>
</div>

<h3>Cái lịch làm cho chuyện này thành thật</h3>
${slide('dv-10', 20, 'Báo động khi VẮNG MẶT: tuổi bản sao lưu mới nhất')}
<div class="kv-grid">
<div class="kv"><span class="k">sau MỖI lần sao lưu</span><span class="v">script kiểm chứng. 4,7 s ở đây — nếu trên cơ sở dữ liệu của bạn nó là hàng phút thì chạy hằng ngày thay vì thế</span></div>
<div class="kv"><span class="k">hằng tuần</span><span class="v">phục hồi từ bản <em>NGOÀI MÁY</em>, có giải mã, để cả cái khoá lẫn đường truyền cũng được kiểm</span></div>
<div class="kv"><span class="k">hằng quý</span><span class="v">một buổi diễn tập ĐẦY ĐỦ trên một cái máy mới, có bấm giờ. Con số đó là RTO thật của bạn, và nó LUÔN lớn hơn thời gian phục hồi cơ sở dữ liệu (10.5)</span></div>
<div class="kv"><span class="k">báo động khi VẮNG MẶT</span><span class="v">không có lần kiểm chứng thành công nào trong 48 giờ là một cái báo động. Một hệ sao lưu ngừng chạy ÂM THẦM trông y hệt một hệ đang chạy (9.4)</span></div>
</div>

<p>Cái dòng cuối là thứ người ta bỏ sót. Mọi phép kiểm trong bài này đều nổ khi HỎNG. Chẳng có gì nổ khi cron job ngừng chạy HẲN — cuốn log im lặng, các mã thoát vẫn là 0, vì chẳng có gì chạy cả. Báo động khi VẮNG MẶT một thành công mới che được chuyện đó, và nó cùng hình dạng với phép kiểm công-tắc-người-chết trên đường ống báo động ở bài 9.4.</p>

<h3>Kiểm ở máy KHÁC: mang theo bản kê</h3>
${slide('dv-10', 16, 'Kiểm ở máy khác: mang theo bản kê')}
<p>Script ở trên so bản đã phục hồi với cơ sở dữ liệu <em>NGUỒN</em>, nên chỉ chạy được trên một máy với tới production. Chỗ ĐÁNG chạy phép kiểm nhất lại ngược hẳn: một máy riêng — chính cái máy bạn sẽ phục hồi lên — giữ các bản sao lưu đã mã hoá cùng khoá giải mã, và KHÔNG có đường nào vào production. Chẳng có nguồn nào để hỏi. Nên script sao lưu ở 10.1 ghi sẵn câu trả lời lúc sao lưu: <code>ban-ke.txt</code>, mỗi bảng một dòng kèm số dòng <em>NẰM TRONG bản dump</em>. Phép kiểm ở máy kia phục hồi rồi đối chiếu với nó:</p>
<pre><code class="language-bash">#!/bin/bash
<span class="tok-comment"># kiem-may-khac.sh &lt;ban.tar.age&gt; &lt;may-dich&gt; — phuc hoi thu tren MAY KHAC, doi chieu ban ke</span>
set -Eeuo pipefail
TEP=\$1; export PGHOST=\$2 PGUSER=postgres
TAM=\$(mktemp -d); DB=kiem; LOI=0; LECH=0
trap 'rm -rf "\$TAM"' EXIT
T0=\$(date +%s%N); moc() { echo "  [\$(( (\$(date +%s%N)-T0)/1000000 )) ms] \$*"; }

age -d -i ~/.config/age/khoa.txt "\$TEP" | tar -C "\$TAM" -xf -
(cd "\$TAM" &amp;&amp; sha256sum --quiet -c sha256.txt);            moc "giai ma + sha256 khop"
grep -vE '^(CREATE|ALTER) ROLE postgres' "\$TAM/vai-tro.sql" |
  psql -q -v ON_ERROR_STOP=1 -f - &gt;/dev/null;               moc "tao vai tro"
createdb "\$DB"
pg_restore -j4 -d "\$DB" "\$TAM/csdl.dump" 2&gt;"\$TAM/loi.txt" || LOI=\$?
moc "pg_restore -j4 xong, ma thoat \$LOI, \$(grep -c 'error:' "\$TAM/loi.txt") dong loi"
grep -m2 'ERROR:' "\$TAM/loi.txt" | sed 's/^pg_restore: error: could not execute query: /    /' || true
psql -d "\$DB" -qc 'analyze';                                moc "analyze"
while read -r bang can; do
  co=\$(psql -d "\$DB" -Atc "select count(*) from \$bang" 2&gt;/dev/null) || co=THIEU
  [ "\$co" = "\$can" ] &amp;&amp; printf '    ✓ %-22s %s\\n' "\$bang" "\$co" ||
    { printf '    ✗ %-22s can %s, co %s\\n' "\$bang" "\$can" "\$co"; LECH=1; }
done &lt; "\$TAM/ban-ke.txt"
PGOPTIONS='-c enable_seqscan=off' psql -d "\$DB" -Atc "select 'truy van mau (hnsw): id='||id
  from tai_lieu_nhung order by nhung &lt;-&gt; '[0,0,0,0,0,0,0,0]' limit 1" 2&gt;&amp;1 | sed 's/^/    /' || LECH=1
moc "doi chieu xong"
[ "\$LOI\$LECH" = 00 ] &amp;&amp; echo "  ✓ PHUC HOI DUOC — khop ban ke" || { echo "  ✗ KHONG DAT"; exit 3; }</code></pre>
<table><thead><tr><th>Bước</th><th>Chứng minh điều gì</th><th>Thiếu nó thì hỏng thế nào</th></tr></thead><tbody>
<tr><td><code>age -d -i</code></td><td>cái khoá cất xa máy chủ vẫn mở được tệp</td><td>bạn biết khoá đã mất đúng giữa sự cố</td></tr>
<tr><td><code>sha256sum -c</code></td><td>đúng những byte máy chủ đã ghi</td><td>một bản chép đứt ở 97% phục hồi ra 97% (10.7)</td></tr>
<tr><td>vai trò TRƯỚC</td><td>các câu <code>GRANT</code> của bản dump có người để cấp</td><td>"role does not exist", "errors ignored" (10.5)</td></tr>
<tr><td><code>2&gt;loi.txt || LOI=\$?</code></td><td>lỗi được giữ lại và đếm, không bị giấu</td><td>một cú phục hồi đã "bỏ qua" lỗi trông như thành công</td></tr>
<tr><td>đếm theo <code>ban-ke.txt</code></td><td>mọi bảng bản dump chứa đều về, đủ từng dòng</td><td>một bảng THIẾU là vô hình khi bạn chỉ nhìn những gì đang có</td></tr>
<tr><td>một truy vấn mẫu</td><td>kiểu dữ liệu, phần mở rộng, chỉ mục, toán tử đều chạy — không chỉ có dòng</td><td>dòng đã về trong một cơ sở dữ liệu không trả lời nổi truy vấn của ứng dụng</td></tr>
<tr><td>kết luận tính từ <code>LOI</code> và <code>LECH</code></td><td>dòng xanh là HỆ QUẢ của các phép so</td><td>một script lúc nào cũng kết thúc bằng "OK" (bên dưới)</td></tr>
</tbody></table>
<p>Có hai lựa chọn thiết kế quan trọng. Máy đích là một PostgreSQL <strong>MỚI TINH</strong> mỗi lần, dựng từ ảnh của production, nên phép kiểm chứng minh luôn rằng bạn DỰNG ĐƯỢC môi trường. Và dòng kết luận chỉ được in nếu cả hai cờ vẫn là 0 — không có cách nào tới được nó bằng cách trượt xuống cuối script.</p>

<h3>Sai ảnh: một phép kiểm hỏng ĐÚNG lý do</h3>
${slide('dv-10', 17, 'Cùng một tệp: đúng ảnh pgvector thì ✓, ảnh postgres:16 thường thì ✗')}
<p>Cùng một bản sao lưu đã mã hoá, kiểm trên hai máy mới: <code>may2</code> từ ảnh của production <code>pgvector/pgvector:pg16</code>, và <code>sai</code> từ <code>postgres:16</code> trơn — "cũng là PostgreSQL 16", đúng cái lập luận dẫn người ta tới nó.</p>
<div class="out">$ kiem-may-khac.sh thu-20260929-1359.tar.age may2
  [85 ms] giai ma + sha256 khop
  [172 ms] tao vai tro
  [5559 ms] pg_restore -j4 xong, ma thoat 0, 0 dong loi
  [6474 ms] analyze
    ✓ public.bai_hoc         120
    ✓ public.bf              300000
    ✓ public.don             240
    ✓ public.kh              200000
    ✓ public.lon             400170
    ✓ public.nguoi_dung      6
    ✓ public.tai_lieu_nhung  20000
    ✓ public.tien_do         320
    truy van mau (hnsw): id=1205
  [7109 ms] doi chieu xong
  ✓ PHUC HOI DUOC — khop ban ke
ma thoat 0
$ kiem-may-khac.sh thu-20260929-1359.tar.age sai
  [116 ms] giai ma + sha256 khop
  [186 ms] tao vai tro
  [2453 ms] pg_restore -j4 xong, ma thoat 1, 7 dong loi
    ERROR:  extension "vector" is not available
    ERROR:  extension "vector" does not exist
  [3027 ms] analyze
    ✓ public.bai_hoc         120
    …
    ✓ public.nguoi_dung      6
    ✗ public.tai_lieu_nhung  can 20000, co THIEU
    ✓ public.tien_do         320
    ERROR:  relation "tai_lieu_nhung" does not exist
    LINE 2:   from tai_lieu_nhung order by nhung &lt;-&gt; '[0,0,0,0,0,0,0,0]'...
                   ^
  [3611 ms] doi chieu xong
  ✗ KHONG DAT
ma thoat 3</div>
<p>Trên ảnh trơn, <code>CREATE EXTENSION vector</code> hỏng, nên bảng có cột <code>vector</code> không tạo được, còn mọi thứ khác phục hồi bình thường. Bảy trên tám bảng khớp. Một bộ kiểm chỉ hỏi "<code>pg_restore</code> có chạy xong không?" hay "có bảng không?" sẽ cho qua. Bản kê bắt được bảng thiếu, và truy vấn mẫu bắt thêm lần nữa.</p>

<h3>Chuyện thật: bộ kiểm in ✅ đè lên hai bảng bị thiếu</h3>
${slide('dv-10', 18, 'Chuyện thật: bộ kiểm dùng sai ảnh vẫn in ✅')}
<p>Ở website mà khoá này theo dõi, một máy ở nhà kéo bản sao lưu production về mỗi đêm lúc 03:00 và phục hồi thử vào một container PostgreSQL tạm. Suốt nhiều tuần, container đó dựng từ một ảnh PostGIS KHÔNG có <code>pgvector</code>, trong khi production chạy một ảnh tự dựng có cả hai. Đo ngày 20/09/2026, cùng một tệp sao lưu:</p>
<table><thead><tr><th></th><th>ảnh thiếu pgvector</th><th>ảnh của production</th></tr></thead><tbody>
<tr><td>lỗi psql</td><td>44</td><td>0</td></tr>
<tr><td>số bảng</td><td>316</td><td>318</td></tr>
<tr><td>số dòng</td><td>340.265</td><td>367.043</td></tr>
<tr><td>bộ kiểm in ra</td><td>✅ RESTORE ĐƯỢC</td><td>✅ RESTORE ĐƯỢC</td></tr>
</tbody></table>
<p>Hai bảng vector của tài liệu — 26.778 dòng — âm thầm không về, mỗi đêm, và dòng cuối của bộ kiểm là một câu cố định "✅ restore được". Bản sao lưu thì KHÔNG hỏng; <em>MÔI TRƯỜNG THỬ</em> mới hỏng, và phép kiểm không phân biệt được hai điều đó. Cách chữa có hai nửa: phục hồi vào đúng ảnh production đang chạy (đọc từ dòng <code>image:</code> của tệp compose, đừng gõ theo trí nhớ), và tính kết luận từ các phép so, để một bộ kiểm đã in 44 lỗi thì không thể in thêm ✅.</p>

<h3>Kiểm cái bộ kiểm</h3>
${slide('dv-10', 19, 'Bộ kiểm cũng phải được kiểm: script không tồn tại, volume vô danh, sai phiên bản')}
<p>Mọi thảm hoạ sao lưu trong chương tới giờ đều là một bộ kiểm TRÔNG ổn. Thêm ba cái nữa, đều có thật:</p>
<div class="kv-grid">
<div class="kv"><span class="k">cái script chưa từng tồn tại</span><span class="v">VPS có một dòng cron lúc 02:05 gọi <code>verify-backup.sh</code>. Tệp đó KHÔNG có; script thật mang tên khác và chưa bao giờ được gọi. Log giữ 62 dòng "not found", mỗi đêm một dòng, và cho tới 18/08/2026 chưa từng có bản sao lưu nào được phục hồi thử. Cron không báo một lệnh bị thiếu ở chỗ nào bạn hay nhìn.</span></div>
<div class="kv"><span class="k">bộ kiểm làm đầy đĩa</span><span class="v">mỗi lần kiểm hằng đêm khởi động một container PostgreSQL rồi gỡ nó bằng <code>docker rm -f</code> — KHÔNG có <code>-v</code>. Ảnh khai một volume cho thư mục dữ liệu, nên mỗi lần chạy để lại một volume vô danh: 650–915 MB mỗi đêm trên máy thật, cỡ 27 GB mỗi tháng.</span></div>
<div class="kv"><span class="k">phép kiểm sẵn sàng nói dối</span><span class="v"><code>pg_isready</code> trả lời từ máy chủ khởi tạo tạm (10.2).</span></div>
</div>
<p>Vụ rò volume tái hiện dễ dàng:</p>
<pre><code class="language-bash">docker run -d --name dv10-thu -e POSTGRES_PASSWORD=12345 pgvector/pgvector:pg16
docker inspect -f "{{range .Mounts}}{{.Type}} {{.Name}} -&gt; {{.Destination}}{{end}}" dv10-thu
docker rm -f dv10-thu
docker volume inspect -f "{{.Name}}" c6599c64bff0…        <span class="tok-comment"># van con</span>
docker run --rm -v c6599c64bff0…:/v alpine du -sh /v</code></pre>
<div class="out">volume c6599c64bff0… -&gt; /var/lib/postgresql/data
dv10-thu
c6599c64bff0
38.2M	/v</div>
<p>38 MB cho một cụm rỗng; sau một lần phục hồi thử cơ sở dữ liệu của chương này, các volume bị bỏ lại đo được 361 và 385 MB. <code>docker rm -fv</code> xoá volume vô danh cùng container — đo thật: <code>docker volume inspect</code> sau đó trả lời <code>no such volume</code>. Luật chung chính là luật Chương 9 áp cho giám sát: trước khi tin điều một bộ kiểm nói về bản sao lưu, hãy chứng minh bộ kiểm CÓ THỂ báo hỏng, và nó tự dọn dẹp sau khi chạy.</p>

<h3>Báo động khi VẮNG MẶT, dựng thật</h3>
<p>Cái lịch ở trên kết thúc bằng "không có lần kiểm chứng thành công nào trong 48 giờ là một cái báo động". Đây là phiên bản nhỏ nhất chạy được, đặt ở máy kho — KHÔNG phải trên VPS, vì VPS chính là thứ có thể đã ngừng chạy:</p>
<pre><code class="language-bash">#!/bin/bash
<span class="tok-comment"># canh-tuoi.sh &lt;thu-muc&gt; [nguong-gio] — bao dong khi ban sao luu MOI NHAT qua gia (hoac khong co)</span>
DIR=\$1; NGUONG=\${2:-26}
M=\$(ls -t "\$DIR"/*.tar.age 2&gt;/dev/null | head -1)
[ -n "\$M" ] || { echo "BAO DONG: khong co ban sao luu nao trong \$DIR"; exit 2; }
TUOI=\$(( (\$(date +%s) - \$(stat -c %Y "\$M")) / 3600 ))
CO=\$(stat -c %s "\$M")
if (( TUOI &gt; NGUONG )); then echo "BAO DONG: moi nhat \$(basename "\$M") da \$TUOI gio tuoi (&gt; \$NGUONG)"; exit 1
elif (( CO &lt; 1000000 )); then echo "BAO DONG: \$(basename "\$M") chi \$CO byte"; exit 1
else echo "OK: moi nhat \$(basename "\$M"), \$TUOI gio tuoi, \$CO byte"; fi</code></pre>
<div class="out">$ canh-tuoi.sh ~/kho
OK: moi nhat thu-20260929-1412.tar.age, 0 gio tuoi, 10396328 byte
ma thoat 0
$ canh-tuoi.sh ~/cu      # cron sao luu da chet tu hom qua
BAO DONG: moi nhat thu-20260929-1359.tar.age da 31 gio tuoi (&gt; 26)
ma thoat 1
$ canh-tuoi.sh ~/rong
BAO DONG: khong co ban sao luu nao trong /home/deploy/rong
ma thoat 2</div>
<p>26 giờ là một lần chạy hằng đêm cộng hai giờ dư. Phép kiểm kích thước bắt tệp 0 byte mà một bản dump hỏng để lại. Chạy nó mỗi giờ bằng một timer và đẩy mọi mã thoát khác 0 vào kênh báo động của Chương 9. Trên website thật, đây là dòng "tuổi backup" trong báo cáo tình trạng của máy nhà — phép kiểm DUY NHẤT nổ khi chẳng có gì chạy cả.</p>

<h3>Trên macOS và Windows</h3>
<ul>
<li><strong>Các script này dùng công cụ GNU.</strong> Đo trên chính máy Mac của chương: <code>stat -c%s</code> hỏng với <code>stat: illegal option -- c</code> (dạng BSD là <code>stat -f %z</code> cho kích thước và <code>stat -f %m</code> cho giờ sửa); còn <code>sha256sum --quiet -c</code> và <code>date +%s%N</code> thì chạy được trên macOS hiện tại. Hãy chạy bộ kiểm trên Linux — máy kho, hoặc một container — thay vì chuyển nó sang Mac.</li>
<li><strong>Bạn cùng nhóm dùng Windows</strong> chạy được cả phép kiểm trong WSL 2 hoặc trong container Linux; <code>age</code> và <code>rclone</code> đều có bản Windows, nhưng một phép kiểm chạy khác nhau trên mỗi máy thì không còn là phép kiểm.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> job "phục hồi thử" hằng đêm của nhóm đã in ✅ suốt một tháng. Production dùng pgvector; dòng <code>docker run</code> của job ghi <code>postgres:16</code>. Chứng minh xem dấu ✅ có nghĩa lý gì không, rồi sửa job để nó không thể nói dối.</p>
<ol>
<li>Tạo một cơ sở dữ liệu trong <code>pgvector/pgvector:pg16</code> có một bảng mang cột <code>vector</code>, và sao lưu nó bằng <code>sao-luu.sh</code> của 10.1 (bản kê <code>ban-ke.txt</code> phải nằm trong kho lưu).</li>
<li>Dựng hai container mới, một từ ảnh production và một từ <code>postgres:16</code>, và chạy <code>kiem-may-khac.sh</code> vào từng cái. Ghi hai mã thoát và dòng gọi tên bảng thiếu.</li>
<li>Cố tình làm hỏng bộ kiểm: đổi dòng cuối thành một <code>echo "OK"</code> vô điều kiện và chạy vào ảnh sai. Rồi trả lại logic kết luận.</li>
<li>Chạy <code>canh-tuoi.sh</code> trên một thư mục mà tệp mới nhất bị <code>touch -d "-31 hours"</code>, và trên một thư mục rỗng.</li>
</ol>
<p><strong>Đạt khi:</strong> ảnh đúng cho mã 0 với mọi bảng ✓, ảnh trơn cho mã 3 gọi tên bảng vector, bạn đã thấy bộ kiểm hỏng in "OK" đè lên cùng cái lỗi ấy, <code>canh-tuoi.sh</code> thoát 1 và 2 ở hai ca cũ — và <code>docker volume ls</code> không còn volume nào do container thử của bạn để lại (dùng <code>docker rm -fv</code>).</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">test restore (phục hồi thử)</span><span class="v">Phục hồi một bản sao lưu vào chỗ vô hại để chứng minh nó chạy — phép kiểm sao lưu thật sự duy nhất.</span></div>
  <div class="kv"><span class="k">manifest ban-ke.txt (bản kê)</span><span class="v">Số dòng từng bảng ghi lại lúc sao lưu, để một máy không vào được production vẫn đối chiếu được.</span></div>
  <div class="kv"><span class="k">sample query (truy vấn mẫu)</span><span class="v">Một truy vấn chạm vào kiểu dữ liệu, phần mở rộng và chỉ mục, không chỉ đếm dòng.</span></div>
  <div class="kv"><span class="k">production image (ảnh của production)</span><span class="v">Đúng ảnh container production đang chạy; phục hồi thử phải dùng nó, không phải ảnh na ná.</span></div>
  <div class="kv"><span class="k">anonymous volume (volume vô danh)</span><span class="v">Volume Docker tự tạo cho đường dẫn dữ liệu mà ảnh khai báo; <code>rm -f</code> thiếu <code>-v</code> bỏ nó lại.</span></div>
  <div class="kv"><span class="k">alerting on absence (báo động khi vắng mặt)</span><span class="v">Báo động khi một thành công KHÔNG xảy ra — cách duy nhất nhận ra một job đã ngừng chạy.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Phép kiểm có giá trị là phục hồi vào một cơ sở dữ liệu mới, rồi đếm từng bảng và chạy một truy vấn mẫu.</li>
<li>Ở một máy riêng không có nguồn để hỏi, nên bản sao lưu mang theo bản kê đếm từ chính bản dump.</li>
<li>Phục hồi vào <code>postgres:16</code> trơn mất bảng vector trong khi 7/8 bảng khớp; chỉ bản kê và truy vấn mẫu nhận ra.</li>
<li>Trên website thật, một bộ kiểm dùng sai ảnh in ✅ đè lên 2 bảng và 26.778 dòng bị thiếu, mỗi đêm.</li>
<li>Bộ kiểm cũng hỏng: một dòng cron gọi script không tồn tại suốt 62 ngày, một volume 38–915 MB bị bỏ lại mỗi lần chạy.</li>
<li>Báo động theo tuổi bản sao lưu mới nhất, từ một máy KHÁC máy làm ra nó.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker — docker container rm</span><span class="lc-sub">docs.docker.com/reference/cli/docker/container/rm/ — <code>-v</code> xoá các volume vô danh gắn với container.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — pg_restore -j và CREATE DATABASE</span><span class="lc-sub">postgresql.org/docs/current/app-pgrestore.html — phục hồi song song CẦN một cơ sở dữ liệu đã tồn tại sẵn, và đó là lý do script tạo một cái trước.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">openssl-enc(1)</span><span class="lc-sub">docs.openssl.org/master/man1/openssl-enc/ — <code>-pbkdf2</code> KHÔNG phải tuỳ chọn: thiếu nó thì việc dẫn xuất khoá là một lượt MD5 duy nhất và phép mã hoá yếu hơn vẻ ngoài của nó rất nhiều.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">age — một công cụ mã hoá đơn giản, hiện đại</span><span class="lc-sub">github.com/FiloSottile/age — mã hoá khoá công khai cho sao lưu, để máy chủ mã hoá được mà KHÔNG giữ cái khoá giải mã. Tốt hơn một mật khẩu dùng chung cho đúng nhu cầu này.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">restic — sao lưu có khử trùng lặp và kiểm chứng</span><span class="lc-sub">restic.readthedocs.io — lệnh con <code>check --read-data</code> của nó chính là ý tưởng của bài này được dựng sẵn, và đáng đọc kể cả khi bạn ở lại với pg_dump.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — trap, tài nguyên tạm và dọn dẹp</span><span class="lc-sub">/courses/linux-bash/learn${REF} — khuôn mẫu <code>trap … EXIT</code> ngăn một lần kiểm hỏng bỏ lại một cơ sở dữ liệu.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 10.5 ─────────────────────────── */
    {
      title: '10.5 — What a database dump does not contain|||10.5 — Thứ một bản dump cơ sở dữ liệu KHÔNG chứa',
      slug: 'deploy-10-5-thieu-gi',
      type: 'VIDEO',
      description: 'Bản dump có câu GRANT cho vai trò ung_dung nhưng KHÔNG có câu tạo ra nó. Phục hồi lên một máy mới: dữ liệu về đủ 400.170 dòng, mã thoát 1, và ứng dụng không đăng nhập được. Rồi danh sách mọi thứ khác nằm ngoài cái tệp đó.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.5</span>
<h2>What a database dump does not contain</h2>
<p class="lead">Lesson 10.4 verified that a backup restores every row of every table. That is a complete answer to a narrower question than the one you actually have, which is: can I rebuild the service?</p>

<h3>The one inside PostgreSQL itself</h3>
${slide('dv-10', 21, 'pg_dump có GRANT, không có CREATE ROLE — đo lại trên máy mới')}
<p>A role the application logs in as, with a password and a grant. What does <code>pg_dump</code> capture?</p>

<div class="out">  so dong nhac toi vai tro trong pg_dump: 1
    GRANT SELECT ON TABLE public.lon TO ung_dung;</div>

<p>The grant, and not the role. <code>pg_dump</code> dumps one database; roles live at the <em>cluster</em> level, above any single database, so they are out of scope by design. Restoring onto a machine where that role does not exist yet:</p>

<div class="out">  pg_restore ma thoat THAT: 1
  so dong loi: 2
    pg_restore: error: could not execute query: ERROR:  role "ung_dung" does not exist
    pg_restore: warning: errors ignored on restore: 1
  lon=400170</div>

<div class="callout warn">
<p><strong>All 400,170 rows are back and the application cannot log in.</strong> The data restored perfectly; the permission did not. And notice the wording of the second line — <em>errors ignored on restore</em>. <code>pg_restore</code> continued past the failure, which means a verification script that only counts rows (10.4) passes this backup with a clean bill of health.</p>
</div>

<p>The fix is one more file in your backup:</p>

<pre><code>pg_dumpall --roles-only > vai-tro.sql       <span class="tok-comment"># chay TRUOC pg_restore</span></code></pre>

<div class="out">    CREATE ROLE ung_dung;
    ALTER ROLE ung_dung WITH … LOGIN … PASSWORD 'SCRAM-SHA-256$4096:dMqcbf6a…';</div>

<p>Restore the roles first, then the database, and the same restore exits <strong>0</strong> with zero errors — measured.</p>

<div class="pitfall">
<p><strong>Trap — that file contains password hashes, so it is a secret.</strong> <code>pg_dumpall --roles-only</code> writes every role&#39;s SCRAM verifier in plain text. It is not the password, but it is the material an offline attack works against, and it belongs under the same rules as anything in Chapter 4: encrypted before it leaves the machine (10.4), never in the repository, never in a log. A great many people back up roles into a git repo because it is "just schema".</p>
</div>

<h3>Everything else outside the dump</h3>
${slide('dv-10', 23, 'Trạng thái thì sao lưu, cấu hình thì vào git')}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">uploaded files</span><span class="lz-lnote">the database holds a path or a key; the bytes live on disk or in object storage. Restoring the database gives you 40,000 rows pointing at nothing</span></div>
<div class="lz-layer"><span class="lz-lname">the .env file</span><span class="lz-lnote">Chapter 4 put it deliberately outside the artifact and outside every deploy. It is therefore outside the backup too, unless you did something about it</span></div>
<div class="lz-layer"><span class="lz-lname">TLS certificates and keys</span><span class="lz-lnote">re-issuable, but only once DNS points at the new machine — a chicken-and-egg that costs real minutes during a rebuild</span></div>
<div class="lz-layer"><span class="lz-lname">DNS records</span><span class="lz-lnote">at the registrar, and propagation is a delay you cannot compress. Lower the TTL <em>before</em> you need to move, not during</span></div>
<div class="lz-layer"><span class="lz-lname">cron jobs, systemd units, nginx config</span><span class="lz-lnote">on the machine, hand-edited over months, and reconstructible only from memory unless they are in a repository</span></div>
<div class="lz-layer"><span class="lz-lname">firewall rules and SSH keys</span><span class="lz-lnote">the ones that let you in. Chapter 2 set these up; nothing has backed them up since</span></div>
<div class="lz-layer"><span class="lz-lname">the third-party side</span><span class="lz-lnote">webhook URLs registered with a payment provider, OAuth redirect URIs, API keys scoped to an IP. All of it points at a machine that no longer exists</span></div>
</div>

<div class="callout warn">
<p><strong>The measured RTO from 10.2 was 4.4 seconds. The real one is nothing like that.</strong> The database is the part with a stopwatch on it precisely because it is the part somebody automated. Provisioning a machine, installing packages, restoring config, reissuing certificates and waiting out DNS is where the hours go — and none of it is in the number you have been quoting.</p>
</div>

<h3>The two categories, and the different fix each needs</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">state</span><span class="lz-t">back it up</span><span class="lz-d">the database, uploaded files, secrets. Irreplaceable, so it needs copies</span></div>
<div class="lz-step"><span class="lz-k">configuration</span><span class="lz-t">put it in git</span><span class="lz-d">nginx, systemd, cron, firewall. Reproducible, so it needs a source of truth, not a copy</span></div>
</div>

<p>The distinction is worth being strict about. A backup of <code>/etc/nginx</code> is a snapshot of a machine at a moment; the same files in a repository are a description you can apply to a new machine, review, and diff. Configuration that only exists as a backup is configuration nobody has read in a year.</p>

<h3>A runbook, and why it is a file rather than a memory</h3>
<pre><code><span class="tok-comment"># PHUC-HOI.md — kiem lai lan cuoi: 2026-08-23, mat 41 phut</span>

0. Khoa nam o: [1Password → "sao luu cuongthai"]. KHONG nam tren VPS.
1. Dung may moi (Ubuntu 24.04, 2 vCPU / 4 GB / 80 GB) — 6 phut
2. Ha TTL cua DNS xuong 300s   <span class="tok-comment"># LAM TRUOC, khong phai luc dang chay</span>
3. Cai goi + docker:            bash chuan-bi-may.sh          — 8 phut
4. Keo cau hinh tu git:         git clone …/ha-tang && bash cai-dat.sh   — 3 phut
5. Dat /opt/cuonghoangdev/.env tu trinh quan ly mat khau      — 2 phut
6. Tao vai tro:  psql -f vai-tro.sql                          — &lt;1 phut
7. Phuc hoi CSDL: pg_restore -j4 -d thu sao-luu.dump          — 4 phut
8. ANALYZE:      psql -d thu -c "analyze;"                    — &lt;1 phut  (10.2)
9. Keo tep tai len tu R2:       rclone sync r2:tai-len /srv/tai-len — 9 phut
10. Xin lai chung chi:          certbot --nginx               — 2 phut
11. Doi DNS sang IP moi, cho TTL                              — 5 phut
12. KIEM QUA CUA TRUOC: curl https://cuongthai.com/ | grep 'id="trang-chu"'  (9.5)</code></pre>

<div class="callout ok">
<p><strong>The line at the top is the important one.</strong> Not the steps — the date it was last rehearsed and how long it took. A runbook nobody has walked through is a list of things that were true once. Walking it through end to end on a throwaway machine is what turns each of those lines from a plan into a measurement, and it is the only way the total at the top means anything.</p>
</div>

<h3>What a rehearsal finds that reading cannot</h3>
<div class="kv-grid">
<div class="kv"><span class="k">the step that needs a secret</span><span class="v">and the secret is on the machine you are replacing</span></div>
<div class="kv"><span class="k">the package that no longer exists</span><span class="v">a version pinned two years ago, removed from the repository since</span></div>
<div class="kv"><span class="k">the manual step nobody wrote down</span><span class="v">always exists. It is the one somebody did once at 2 a.m. and remembered instead of recording</span></div>
<div class="kv"><span class="k">the real total</span><span class="v">every estimate in an unrehearsed runbook is low, and the sum of several low estimates is very low</span></div>
</div>

<h3>Measured again on a brand-new machine</h3>
<p>Re-measured on 29/09/2026: the custom dump of the lab database, restored onto a fresh <code>pgvector/pgvector:pg16</code> container that has never seen the role <code>ung_dung</code>:</p>
<div class="out">$ pg_restore -f - thu.dump | grep -c ung_dung
1
GRANT SELECT ON TABLE public.lon TO ung_dung;
$ pg_restore -d thu thu.dump   # may MOI, chua co vai tro
pg_restore: error: could not execute query: ERROR:  role "ung_dung" does not exist
Command was: GRANT SELECT ON TABLE public.lon TO ung_dung;
pg_restore: warning: errors ignored on restore: 1
ma thoat 1
lon=400170
$ psql -h moi -U ung_dung -d thu
psql: error: connection to server at "moi" (172.21.0.9), port 5432 failed: FATAL:  password authentication failed for user "ung_dung"</div>
<p>Identical to the original measurement, plus the last line: the application's own login fails. On the new machine the role does not exist, so there is nothing to authenticate against, and the message says "password authentication failed" — which sends people off to check the password in <code>.env</code> instead of the roles.</p>
<p>What <code>pg_dumpall --roles-only</code> writes, with the password verifiers cut short:</p>
<div class="out">CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:4FFmkh…
CREATE ROLE ung_dung;
ALTER ROLE ung_dung WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:Ecu5zO…</div>
<p>Note the first line. A fresh official container already has a <code>postgres</code> role, so replaying this file with <code>ON_ERROR_STOP=1</code> stops at <code>role "postgres" already exists</code> before it creates anything useful. That is why the checker in 10.4 filters it out: <code>grep -vE '^(CREATE|ALTER) ROLE postgres' vai-tro.sql | psql -v ON_ERROR_STOP=1 -f -</code>. The alternative, <code>pg_dumpall --globals-only</code>, also includes tablespaces; on a single-disk VPS the roles are what matters.</p>

<h3>Uploaded files in a Docker volume: backed up and restored, measured</h3>
${slide('dv-10', 22, 'Volume Docker: sao lưu bằng container dùng một lần, phục hồi vào volume mới, so băm')}
<p>When uploads live in a named Docker volume rather than in object storage, the volume is state and needs its own backup. You cannot reliably copy it from the host by path on every setup, and you do not need to: start a throwaway container that mounts the volume read-only and a host directory, and let <code>tar</code> do the work. Measured with a volume of 400 image-like files (15.8 MB of random bytes):</p>
<pre><code class="language-bash">docker run --rm \\
  -v dv10-tai-len:/du-lieu:ro \\
  -v "\$PWD":/ra \\
  alpine tar -C /du-lieu -cf /ra/tai-len.tar .

docker volume create dv10-tai-len-moi          <span class="tok-comment"># phuc hoi vao volume MOI</span>
docker run --rm -v dv10-tai-len-moi:/du-lieu -v "\$PWD":/vao:ro \\
  alpine tar -C /du-lieu -xf /vao/tai-len.tar

for v in dv10-tai-len dv10-tai-len-moi; do printf '%-18s ' \$v
  docker run --rm -v \$v:/d:ro alpine sh -c 'cd /d &amp;&amp; echo "\$(find . -type f | wc -l) tep, tong bam \$(find . -type f -exec sha256sum {} + | sort -k2 | sha256sum | cut -c1-16)"'
done</code></pre>
<div class="out">dv10-tai-len       400 tep, tong bam bda5e1e41d8feafe
dv10-tai-len-moi   400 tep, tong bam bda5e1e41d8feafe</div>
<table><thead><tr><th>Measured</th><th>time</th><th>output</th></tr></thead><tbody>
<tr><td><code>tar -czf</code> (gzip)</td><td>2.25 s</td><td>15,793,512 bytes</td></tr>
<tr><td><code>tar -cf</code> (no compression)</td><td>1.98 s</td><td>16,051,200 bytes</td></tr>
</tbody></table>
<div class="kv-grid">
<div class="kv"><span class="k"><code>:ro</code> on the source</span><span class="v">the backup container cannot change what it is backing up.</span></div>
<div class="kv"><span class="k">no <code>z</code></span><span class="v">images and videos are already compressed; gzip saved 1.6% here and cost CPU on the server.</span></div>
<div class="kv"><span class="k">restore into a <em>new</em> volume</span><span class="v">the same rule as 10.2: never restore over the live copy until you have compared.</span></div>
<div class="kv"><span class="k">hash of every file, sorted by name</span><span class="v">one short fingerprint that is identical only if every file and every name matches.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>This is for files, not for PostgreSQL&#39;s data directory.</strong> Tarring <code>/var/lib/postgresql/data</code> while the server runs copies files that are changing underneath you; PostgreSQL&#39;s documentation on file-system backups requires the server to be shut down (or a proper snapshot with WAL). For the database, <code>pg_dump</code>. For uploads, the volume backup. And if uploads live in R2/S3 (as on the site this course follows), turn on versioning or keep a copy in a second bucket — a bucket is also "one place".</p></div>

<h3>A Compose VPS, item by item</h3>
<table><thead><tr><th>Thing</th><th>Where it lives on a typical Compose VPS</th><th>How it survives the machine</th></tr></thead><tbody>
<tr><td>database</td><td>a named volume of the PostgreSQL container</td><td><code>pg_dump -Fc</code> + roles, encrypted, off the machine, test-restored</td></tr>
<tr><td>uploads</td><td>a named volume, or object storage</td><td>volume tar (above), or bucket versioning + a second copy</td></tr>
<tr><td><code>.env</code> / secrets</td><td>a file outside the repository, e.g. <code>/opt/&lt;app&gt;/.env</code> (Chapter 4)</td><td>a password manager; never in the backup archive unencrypted</td></tr>
<tr><td>compose file, nginx config, unit files</td><td>the repository, bind-mounted or copied onto the server</td><td>git — and the deploy script that puts them in place</td></tr>
<tr><td>images</td><td>the registry (GHCR)</td><td>rebuildable from git, but pin and keep the tag production runs — a rollback needs the old image</td></tr>
<tr><td>TLS certificates</td><td><code>/etc/letsencrypt</code> or a volume</td><td>re-issue after DNS points to the new machine (Chapter 12)</td></tr>
<tr><td>the backup key</td><td>not on the VPS</td><td>two places: password manager + offline copy (10.7)</td></tr>
</tbody></table>

<h3>On macOS and Windows</h3>
<ul>
<li><strong>On Docker Desktop, volumes are inside the Linux VM.</strong> Measured on the Mac: <code>docker volume inspect -f '{{.Mountpoint}}' dv10-tai-len</code> prints <code>/var/lib/docker/volumes/dv10-tai-len/_data</code> — a path in the VM, not on your Mac. Finder, Time Machine and <code>cp</code> cannot see it. The throwaway-container method above is the one that works on every platform.</li>
<li><strong>Bind mounts behave differently:</strong> a <code>./uploads:/app/uploads</code> bind mount is a normal folder on the host and gets backed up with it — which on a laptop is convenient and on a server is one more path you must remember to include.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> the VPS is gone. You have last night's database dump and nothing else, and the app on the new machine answers "password authentication failed" while every product image is a broken link. Rebuild the missing pieces in the lab and write down what your backup should have contained.</p>
<ol>
<li>Restore a dump that grants to an application role onto a fresh container without roles; record the exit code, "errors ignored" and the login error.</li>
<li>Replay <code>pg_dumpall --roles-only</code> (filtering the <code>postgres</code> lines) and restore again; confirm exit 0 and that the application role can log in.</li>
<li>Create a named volume with a few hundred files, back it up with a throwaway <code>alpine</code> container, restore into a new volume and compare the combined sha256.</li>
<li>List every item from the table above for your team's project and mark each "backup", "git" or "re-create".</li>
</ol>
<p><strong>Done when:</strong> the second restore exits 0 and <code>psql -U ung_dung</code> connects, the two volumes print the same file count and fingerprint, and your list has no item marked "not sure".</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">role</span><span class="v">A PostgreSQL login or group; it belongs to the whole cluster, so <code>pg_dump</code> of one database leaves it out.</span></div>
  <div class="kv"><span class="k">pg_dumpall --roles-only</span><span class="v">Writes every role with its password verifier — a secret file.</span></div>
  <div class="kv"><span class="k">named volume</span><span class="v">Storage Docker manages for a container; it outlives the container and must be backed up separately.</span></div>
  <div class="kv"><span class="k">throwaway container</span><span class="v">A <code>--rm</code> container that exists only to run one command against a volume.</span></div>
  <div class="kv"><span class="k">state vs configuration</span><span class="v">State is irreplaceable and needs copies; configuration is reproducible and needs a repository.</span></div>
  <div class="kv"><span class="k">runbook</span><span class="v">The written, timed, rehearsed list of steps to rebuild the service.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A database dump contains <code>GRANT … TO ung_dung</code> but not the role; on a new machine the data returns and the application cannot log in.</li>
<li>Back up roles with <code>pg_dumpall --roles-only</code>, restore them first, and treat the file as a secret.</li>
<li>Uploaded files in a Docker volume are backed up with a throwaway container running <code>tar</code>; skip compression for media.</li>
<li>Restore a volume into a new volume and compare a fingerprint of every file before trusting it.</li>
<li>Never tar a running PostgreSQL data directory; use <code>pg_dump</code> for the database.</li>
<li>State gets backed up, configuration gets committed, secrets go to a password manager — and the runbook records how long it all took.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker — Volumes: back up, restore, or migrate data volumes</span><span class="lc-sub">docs.docker.com/engine/storage/volumes/ — the throwaway-container <code>tar</code> pattern used above.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — File System Level Backup</span><span class="lc-sub">postgresql.org/docs/current/backup-file.html — why the data directory cannot simply be copied while the server runs.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — pg_dumpall</span><span class="lc-sub">postgresql.org/docs/current/app-pg-dumpall.html — <code>--roles-only</code> and <code>--globals-only</code>, and the explicit note that <code>pg_dump</code> does not save roles or tablespaces.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Amazon S3 — versioning and lifecycle</span><span class="lc-sub">docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html — the same applies to Cloudflare R2; turning versioning on is what makes uploaded files recoverable at all (6.4).</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google SRE Book — Managing Incidents, and Postmortem Culture</span><span class="lc-sub">sre.google/sre-book/managing-incidents/ — on why a written, rehearsed procedure outperforms expertise under pressure.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Let&#39;s Encrypt — rate limits</span><span class="lc-sub">letsencrypt.org/docs/rate-limits/ — worth reading before a rehearsal: reissuing certificates repeatedly during practice can exhaust a weekly limit and leave you unable to do it for real.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — volumes, and where a container&#39;s data actually lives</span><span class="lc-sub">/courses/docker/learn${REF} — why "it is all in Docker" does not mean it is all backed up, and which paths a compose file leaves on the host.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.5</span>
<h2>Thứ một bản dump cơ sở dữ liệu KHÔNG chứa</h2>
<p class="lead">Bài 10.4 kiểm chứng rằng một bản sao lưu phục hồi lại được mọi dòng của mọi bảng. Đó là câu trả lời TRỌN VẸN cho một câu hỏi HẸP HƠN câu bạn thật sự có, mà câu đó là: tôi dựng lại được cái DỊCH VỤ không?</p>

<h3>Cái nằm ngay bên trong PostgreSQL</h3>
${slide('dv-10', 21, 'pg_dump có GRANT, không có CREATE ROLE — đo lại trên máy mới')}
<p>Một vai trò mà ứng dụng dùng để đăng nhập, có mật khẩu và có một câu cấp quyền. <code>pg_dump</code> bắt được gì?</p>

<div class="out">  so dong nhac toi vai tro trong pg_dump: 1
    GRANT SELECT ON TABLE public.lon TO ung_dung;</div>

<p>Câu CẤP QUYỀN, và không có câu TẠO vai trò. <code>pg_dump</code> dump MỘT cơ sở dữ liệu; các vai trò sống ở mức <em>CỤM</em>, phía trên mọi cơ sở dữ liệu đơn lẻ, nên chúng nằm ngoài phạm vi THEO THIẾT KẾ. Phục hồi lên một cái máy chưa có vai trò đó:</p>

<div class="out">  pg_restore ma thoat THAT: 1
  so dong loi: 2
    pg_restore: error: could not execute query: ERROR:  role "ung_dung" does not exist
    pg_restore: warning: errors ignored on restore: 1
  lon=400170</div>

<div class="callout warn">
<p><strong>Cả 400.170 dòng đã về và ứng dụng KHÔNG đăng nhập được.</strong> Dữ liệu phục hồi hoàn hảo; cái QUYỀN thì không. Và để ý cách hành văn của dòng thứ hai — <em>errors ignored on restore</em>. <code>pg_restore</code> đi tiếp qua cú hỏng, nghĩa là một script kiểm chứng chỉ ĐẾM SỐ DÒNG (10.4) sẽ cấp cho bản sao lưu này một giấy chứng nhận sức khoẻ sạch sẽ.</p>
</div>

<p>Cách chữa là thêm một tệp nữa vào bản sao lưu của bạn:</p>

<pre><code>pg_dumpall --roles-only > vai-tro.sql       <span class="tok-comment"># chay TRUOC pg_restore</span></code></pre>

<div class="out">    CREATE ROLE ung_dung;
    ALTER ROLE ung_dung WITH … LOGIN … PASSWORD 'SCRAM-SHA-256$4096:dMqcbf6a…';</div>

<p>Phục hồi vai trò TRƯỚC, rồi tới cơ sở dữ liệu, và cùng cú phục hồi ấy thoát <strong>0</strong> với KHÔNG lỗi nào — đo thật.</p>

<div class="pitfall">
<p><strong>Bẫy — cái tệp đó chứa MÃ BĂM MẬT KHẨU, nên nó là một BÍ MẬT.</strong> <code>pg_dumpall --roles-only</code> ghi ra bộ kiểm chứng SCRAM của MỌI vai trò dưới dạng văn bản thuần. Nó không phải mật khẩu, nhưng nó là vật liệu mà một cuộc tấn công ngoại tuyến nhắm vào, và nó thuộc về cùng bộ quy tắc với mọi thứ ở Chương 4: mã hoá trước khi rời khỏi máy (10.4), không bao giờ nằm trong kho mã, không bao giờ nằm trong log. Rất nhiều người sao lưu vai trò vào một kho git vì nghĩ nó "chỉ là lược đồ".</p>
</div>

<h3>Mọi thứ khác nằm ngoài bản dump</h3>
${slide('dv-10', 23, 'Trạng thái thì sao lưu, cấu hình thì vào git')}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">tệp người dùng tải lên</span><span class="lz-lnote">cơ sở dữ liệu giữ một đường dẫn hay một khoá; các BYTE thì nằm trên đĩa hoặc trong kho đối tượng. Phục hồi cơ sở dữ liệu cho bạn 40.000 dòng trỏ vào hư không</span></div>
<div class="lz-layer"><span class="lz-lname">tệp .env</span><span class="lz-lnote">Chương 4 CỐ Ý đặt nó ngoài tạo tác và ngoài mọi lần deploy. Nên nó cũng nằm ngoài bản sao lưu, trừ khi bạn đã làm gì đó về chuyện ấy</span></div>
<div class="lz-layer"><span class="lz-lname">chứng chỉ và khoá TLS</span><span class="lz-lnote">xin lại được, nhưng chỉ SAU KHI DNS trỏ vào máy mới — một vòng luẩn quẩn tốn hàng phút thật trong lúc dựng lại</span></div>
<div class="lz-layer"><span class="lz-lname">bản ghi DNS</span><span class="lz-lnote">nằm ở nhà đăng ký, và thời gian lan truyền là một độ trễ bạn KHÔNG nén được. Hãy hạ TTL <em>TRƯỚC</em> khi cần chuyển, không phải trong lúc chuyển</span></div>
<div class="lz-layer"><span class="lz-lname">cron job, unit systemd, cấu hình nginx</span><span class="lz-lnote">nằm trên máy, sửa tay suốt nhiều tháng, và chỉ dựng lại được từ trí nhớ trừ khi chúng nằm trong một kho mã</span></div>
<div class="lz-layer"><span class="lz-lname">luật tường lửa và khoá SSH</span><span class="lz-lnote">những thứ cho bạn VÀO được. Chương 2 đã dựng chúng lên; từ đó tới giờ chẳng có gì sao lưu chúng</span></div>
<div class="lz-layer"><span class="lz-lname">phía bên thứ ba</span><span class="lz-lnote">URL webhook đã đăng ký với nhà cung cấp thanh toán, URI chuyển hướng OAuth, khoá API giới hạn theo IP. Tất cả đều trỏ vào một cái máy không còn tồn tại</span></div>
</div>

<div class="callout warn">
<p><strong>RTO đo được ở 10.2 là 4,4 giây. Cái thật thì chẳng giống thế chút nào.</strong> Cơ sở dữ liệu là phần CÓ đồng hồ bấm giờ đúng vì nó là phần có người đã tự động hoá. Dựng một cái máy, cài gói, phục hồi cấu hình, xin lại chứng chỉ và chờ DNS mới là chỗ hàng GIỜ trôi đi — và chẳng có gì trong số đó nằm trong con số bạn vẫn hay trích dẫn.</p>
</div>

<h3>Hai loại, và mỗi loại cần một cách chữa KHÁC NHAU</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">TRẠNG THÁI</span><span class="lz-t">sao lưu nó</span><span class="lz-d">cơ sở dữ liệu, tệp tải lên, bí mật. Không thay thế được, nên nó cần BẢN SAO</span></div>
<div class="lz-step"><span class="lz-k">CẤU HÌNH</span><span class="lz-t">đưa vào git</span><span class="lz-d">nginx, systemd, cron, tường lửa. Tái tạo được, nên nó cần một NGUỒN SỰ THẬT, không phải một bản sao</span></div>
</div>

<p>Cái phân biệt ấy đáng nghiêm khắc. Một bản sao lưu của <code>/etc/nginx</code> là ảnh chụp một cái máy ở một khoảnh khắc; đúng những tệp đó trong một kho mã là một BẢN MÔ TẢ mà bạn áp được lên một máy mới, soi được, so khác biệt được. Cấu hình chỉ tồn tại dưới dạng bản sao lưu là cấu hình mà cả năm nay không ai đọc.</p>

<h3>Một cuốn sổ tay, và vì sao nó là một TỆP chứ không phải một trí nhớ</h3>
<pre><code><span class="tok-comment"># PHUC-HOI.md — kiem lai lan cuoi: 2026-08-23, mat 41 phut</span>

0. Khoa nam o: [1Password → "sao luu cuongthai"]. KHONG nam tren VPS.
1. Dung may moi (Ubuntu 24.04, 2 vCPU / 4 GB / 80 GB) — 6 phut
2. Ha TTL cua DNS xuong 300s   <span class="tok-comment"># LAM TRUOC, khong phai luc dang chay</span>
3. Cai goi + docker:            bash chuan-bi-may.sh          — 8 phut
4. Keo cau hinh tu git:         git clone …/ha-tang && bash cai-dat.sh   — 3 phut
5. Dat /opt/cuonghoangdev/.env tu trinh quan ly mat khau      — 2 phut
6. Tao vai tro:  psql -f vai-tro.sql                          — &lt;1 phut
7. Phuc hoi CSDL: pg_restore -j4 -d thu sao-luu.dump          — 4 phut
8. ANALYZE:      psql -d thu -c "analyze;"                    — &lt;1 phut  (10.2)
9. Keo tep tai len tu R2:       rclone sync r2:tai-len /srv/tai-len — 9 phut
10. Xin lai chung chi:          certbot --nginx               — 2 phut
11. Doi DNS sang IP moi, cho TTL                              — 5 phut
12. KIEM QUA CUA TRUOC: curl https://cuongthai.com/ | grep 'id="trang-chu"'  (9.5)</code></pre>

<div class="callout ok">
<p><strong>Cái dòng TRÊN CÙNG mới là dòng quan trọng.</strong> Không phải các bước — mà là NGÀY nó được diễn tập lần cuối và nó MẤT BAO LÂU. Một cuốn sổ tay chưa ai đi hết là một danh sách những thứ TỪNG đúng. Đi hết nó từ đầu tới cuối trên một cái máy vứt-đi được mới là thứ biến từng dòng ấy từ một KẾ HOẠCH thành một PHÉP ĐO, và đó là cách duy nhất để con số tổng ở trên cùng có nghĩa gì đó.</p>
</div>

<h3>Một buổi diễn tập tìm ra thứ mà việc ĐỌC thì không</h3>
<div class="kv-grid">
<div class="kv"><span class="k">cái bước cần một bí mật</span><span class="v">và cái bí mật đó nằm trên chính cái máy bạn đang thay thế</span></div>
<div class="kv"><span class="k">cái gói không còn tồn tại</span><span class="v">một phiên bản ghim từ hai năm trước, từ đó tới nay đã bị gỡ khỏi kho</span></div>
<div class="kv"><span class="k">cái bước làm tay không ai ghi lại</span><span class="v">LÚC NÀO CŨNG CÓ. Nó là cái mà ai đó làm một lần lúc 2 giờ sáng rồi NHỚ thay vì GHI</span></div>
<div class="kv"><span class="k">con số tổng thật</span><span class="v">mọi ước lượng trong một cuốn sổ tay chưa diễn tập đều THẤP, và tổng của vài ước lượng thấp thì rất thấp</span></div>
</div>

<h3>Đo lại trên một máy mới tinh</h3>
<p>Đo lại ngày 29/09/2026: bản dump custom của cơ sở dữ liệu thí nghiệm, phục hồi lên một container <code>pgvector/pgvector:pg16</code> mới tinh chưa từng thấy vai trò <code>ung_dung</code>:</p>
<div class="out">$ pg_restore -f - thu.dump | grep -c ung_dung
1
GRANT SELECT ON TABLE public.lon TO ung_dung;
$ pg_restore -d thu thu.dump   # may MOI, chua co vai tro
pg_restore: error: could not execute query: ERROR:  role "ung_dung" does not exist
Command was: GRANT SELECT ON TABLE public.lon TO ung_dung;
pg_restore: warning: errors ignored on restore: 1
ma thoat 1
lon=400170
$ psql -h moi -U ung_dung -d thu
psql: error: connection to server at "moi" (172.21.0.9), port 5432 failed: FATAL:  password authentication failed for user "ung_dung"</div>
<p>Y hệt phép đo gốc, thêm dòng cuối: chính ứng dụng không đăng nhập được. Trên máy mới vai trò không tồn tại, nên chẳng có gì để xác thực, và thông báo lại ghi "password authentication failed" — thứ khiến người ta đi kiểm mật khẩu trong <code>.env</code> thay vì kiểm vai trò.</p>
<p>Thứ mà <code>pg_dumpall --roles-only</code> ghi ra, với bộ kiểm chứng mật khẩu đã cắt ngắn:</p>
<div class="out">CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:4FFmkh…
CREATE ROLE ung_dung;
ALTER ROLE ung_dung WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:Ecu5zO…</div>
<p>Để ý dòng đầu tiên. Một container chính thức mới tinh ĐÃ có sẵn vai trò <code>postgres</code>, nên chạy lại tệp này với <code>ON_ERROR_STOP=1</code> sẽ dừng ở <code>role "postgres" already exists</code> trước khi kịp tạo gì có ích. Đó là lý do bộ kiểm ở 10.4 lọc nó đi: <code>grep -vE '^(CREATE|ALTER) ROLE postgres' vai-tro.sql | psql -v ON_ERROR_STOP=1 -f -</code>. Lựa chọn khác, <code>pg_dumpall --globals-only</code>, kèm thêm cả tablespace; trên một VPS một đĩa thì vai trò mới là thứ quan trọng.</p>

<h3>Tệp tải lên trong một volume Docker: sao lưu và phục hồi, đo thật</h3>
${slide('dv-10', 22, 'Volume Docker: sao lưu bằng container dùng một lần, phục hồi vào volume mới, so băm')}
<p>Khi tệp tải lên nằm trong một volume Docker có tên thay vì trong kho đối tượng, volume đó là TRẠNG THÁI và cần bản sao lưu riêng. Bạn không chép được nó một cách đáng tin theo đường dẫn trên máy chủ ở mọi kiểu cài đặt, và cũng không cần: khởi động một container vứt đi gắn volume ở chế độ chỉ đọc cùng một thư mục của máy chủ, rồi để <code>tar</code> làm việc. Đo với một volume 400 tệp giống ảnh (15,8 MB byte ngẫu nhiên):</p>
<pre><code class="language-bash">docker run --rm \\
  -v dv10-tai-len:/du-lieu:ro \\
  -v "\$PWD":/ra \\
  alpine tar -C /du-lieu -cf /ra/tai-len.tar .

docker volume create dv10-tai-len-moi          <span class="tok-comment"># phuc hoi vao volume MOI</span>
docker run --rm -v dv10-tai-len-moi:/du-lieu -v "\$PWD":/vao:ro \\
  alpine tar -C /du-lieu -xf /vao/tai-len.tar

for v in dv10-tai-len dv10-tai-len-moi; do printf '%-18s ' \$v
  docker run --rm -v \$v:/d:ro alpine sh -c 'cd /d &amp;&amp; echo "\$(find . -type f | wc -l) tep, tong bam \$(find . -type f -exec sha256sum {} + | sort -k2 | sha256sum | cut -c1-16)"'
done</code></pre>
<div class="out">dv10-tai-len       400 tep, tong bam bda5e1e41d8feafe
dv10-tai-len-moi   400 tep, tong bam bda5e1e41d8feafe</div>
<table><thead><tr><th>Đo được</th><th>thời gian</th><th>tệp ra</th></tr></thead><tbody>
<tr><td><code>tar -czf</code> (gzip)</td><td>2,25 s</td><td>15.793.512 byte</td></tr>
<tr><td><code>tar -cf</code> (không nén)</td><td>1,98 s</td><td>16.051.200 byte</td></tr>
</tbody></table>
<div class="kv-grid">
<div class="kv"><span class="k"><code>:ro</code> ở phía nguồn</span><span class="v">container sao lưu không thể thay đổi thứ nó đang sao lưu.</span></div>
<div class="kv"><span class="k">không có <code>z</code></span><span class="v">ảnh và video vốn đã nén; gzip ở đây bớt được 1,6% mà tốn CPU của máy chủ.</span></div>
<div class="kv"><span class="k">phục hồi vào một volume <em>MỚI</em></span><span class="v">cùng luật với 10.2: đừng bao giờ phục hồi đè lên bản đang sống khi chưa đối chiếu.</span></div>
<div class="kv"><span class="k">băm mọi tệp, sắp theo tên</span><span class="v">một dấu vân tay ngắn, chỉ giống nhau khi mọi tệp và mọi tên đều khớp.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Cách này là cho TỆP, không phải cho thư mục dữ liệu của PostgreSQL.</strong> Tar <code>/var/lib/postgresql/data</code> trong lúc máy chủ đang chạy là chép những tệp đang thay đổi ngay dưới tay bạn; tài liệu của PostgreSQL về sao lưu mức hệ tệp đòi máy chủ phải TẮT (hoặc một ảnh chụp đúng cách kèm WAL). Cơ sở dữ liệu thì dùng <code>pg_dump</code>. Tệp tải lên thì dùng sao lưu volume. Và nếu tệp tải lên nằm ở R2/S3 (như website mà khoá này theo dõi), hãy bật versioning hoặc giữ một bản ở bucket thứ hai — một bucket cũng chỉ là "một chỗ".</p></div>

<h3>Một VPS chạy Compose, từng món một</h3>
<table><thead><tr><th>Thứ</th><th>Nằm ở đâu trên một VPS Compose điển hình</th><th>Sống sót qua việc mất máy bằng cách nào</th></tr></thead><tbody>
<tr><td>cơ sở dữ liệu</td><td>một volume có tên của container PostgreSQL</td><td><code>pg_dump -Fc</code> + vai trò, mã hoá, ra khỏi máy, đã phục hồi thử</td></tr>
<tr><td>tệp tải lên</td><td>một volume có tên, hoặc kho đối tượng</td><td>tar volume (ở trên), hoặc versioning của bucket + một bản thứ hai</td></tr>
<tr><td><code>.env</code> / bí mật</td><td>một tệp ngoài kho mã, vd <code>/opt/&lt;app&gt;/.env</code> (Chương 4)</td><td>trình quản lý mật khẩu; không bao giờ nằm trong kho lưu sao lưu ở dạng chưa mã hoá</td></tr>
<tr><td>tệp compose, cấu hình nginx, tệp unit</td><td>kho mã, bind-mount hoặc chép lên máy chủ</td><td>git — và script deploy đặt chúng vào chỗ</td></tr>
<tr><td>ảnh container</td><td>registry (GHCR)</td><td>dựng lại được từ git, nhưng hãy ghim và GIỮ tag production đang chạy — lùi bản cần ảnh cũ</td></tr>
<tr><td>chứng chỉ TLS</td><td><code>/etc/letsencrypt</code> hoặc một volume</td><td>xin lại sau khi DNS trỏ vào máy mới (Chương 12)</td></tr>
<tr><td>khoá giải mã sao lưu</td><td>KHÔNG ở trên VPS</td><td>hai nơi: trình quản lý mật khẩu + một bản ngoại tuyến (10.7)</td></tr>
</tbody></table>

<h3>Trên macOS và Windows</h3>
<ul>
<li><strong>Trên Docker Desktop, volume nằm BÊN TRONG máy ảo Linux.</strong> Đo trên Mac: <code>docker volume inspect -f '{{.Mountpoint}}' dv10-tai-len</code> in <code>/var/lib/docker/volumes/dv10-tai-len/_data</code> — một đường dẫn trong máy ảo, không phải trên Mac của bạn. Finder, Time Machine và <code>cp</code> đều không nhìn thấy nó. Cách container vứt đi ở trên là cách chạy được trên mọi nền tảng.</li>
<li><strong>Bind mount thì khác:</strong> một bind mount <code>./uploads:/app/uploads</code> là một thư mục bình thường trên máy chủ và được sao lưu cùng nó — trên laptop thì tiện, còn trên máy chủ thì đó là thêm một đường dẫn bạn phải nhớ đưa vào.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> VPS mất rồi. Bạn có bản dump cơ sở dữ liệu đêm qua và không gì khác, còn ứng dụng trên máy mới báo "password authentication failed" trong khi mọi ảnh sản phẩm là liên kết hỏng. Dựng lại các mảnh còn thiếu trong phòng thí nghiệm và ghi ra lẽ ra bản sao lưu phải chứa những gì.</p>
<ol>
<li>Phục hồi một bản dump có cấp quyền cho vai trò ứng dụng lên một container mới chưa có vai trò; ghi mã thoát, dòng "errors ignored" và lỗi đăng nhập.</li>
<li>Chạy lại <code>pg_dumpall --roles-only</code> (lọc các dòng <code>postgres</code>) rồi phục hồi lần nữa; xác nhận mã 0 và vai trò ứng dụng đăng nhập được.</li>
<li>Tạo một volume có tên với vài trăm tệp, sao lưu bằng một container <code>alpine</code> vứt đi, phục hồi vào một volume mới và so dấu sha256 gộp.</li>
<li>Liệt kê mọi món trong bảng ở trên cho dự án nhóm của bạn và đánh dấu từng món "sao lưu", "git" hay "tạo lại".</li>
</ol>
<p><strong>Đạt khi:</strong> lần phục hồi thứ hai thoát 0 và <code>psql -U ung_dung</code> kết nối được, hai volume in cùng số tệp và cùng dấu vân tay, và danh sách của bạn không có món nào ghi "không chắc".</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">role (vai trò)</span><span class="v">Một tài khoản đăng nhập hay một nhóm của PostgreSQL; nó thuộc cả CỤM, nên <code>pg_dump</code> một cơ sở dữ liệu bỏ nó ra ngoài.</span></div>
  <div class="kv"><span class="k">pg_dumpall --roles-only (dump vai trò)</span><span class="v">Ghi mọi vai trò kèm bộ kiểm chứng mật khẩu — một tệp BÍ MẬT.</span></div>
  <div class="kv"><span class="k">named volume (volume có tên)</span><span class="v">Chỗ lưu trữ Docker quản lý cho một container; nó sống lâu hơn container và phải được sao lưu riêng.</span></div>
  <div class="kv"><span class="k">throwaway container (container vứt đi)</span><span class="v">Một container <code>--rm</code> chỉ tồn tại để chạy đúng một lệnh vào một volume.</span></div>
  <div class="kv"><span class="k">state vs configuration (trạng thái và cấu hình)</span><span class="v">Trạng thái không thay thế được nên cần bản sao; cấu hình tái tạo được nên cần một kho mã.</span></div>
  <div class="kv"><span class="k">runbook (sổ tay phục hồi)</span><span class="v">Danh sách các bước dựng lại dịch vụ, viết ra, có bấm giờ, đã diễn tập.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một bản dump chứa <code>GRANT … TO ung_dung</code> mà không chứa vai trò; trên máy mới dữ liệu về còn ứng dụng không đăng nhập được.</li>
<li>Sao lưu vai trò bằng <code>pg_dumpall --roles-only</code>, phục hồi chúng TRƯỚC, và coi tệp đó là bí mật.</li>
<li>Tệp tải lên trong volume Docker được sao lưu bằng một container vứt đi chạy <code>tar</code>; với ảnh/video thì bỏ nén.</li>
<li>Phục hồi một volume vào volume MỚI và so dấu vân tay của mọi tệp trước khi tin nó.</li>
<li>Đừng bao giờ tar thư mục dữ liệu của một PostgreSQL đang chạy; cơ sở dữ liệu thì dùng <code>pg_dump</code>.</li>
<li>Trạng thái thì sao lưu, cấu hình thì commit, bí mật thì vào trình quản lý mật khẩu — và sổ tay ghi lại tất cả mất bao lâu.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker — Volumes: back up, restore, or migrate data volumes</span><span class="lc-sub">docs.docker.com/engine/storage/volumes/ — đúng khuôn mẫu container vứt đi chạy <code>tar</code> dùng ở trên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — File System Level Backup</span><span class="lc-sub">postgresql.org/docs/current/backup-file.html — vì sao không thể cứ thế chép thư mục dữ liệu khi máy chủ đang chạy.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — pg_dumpall</span><span class="lc-sub">postgresql.org/docs/current/app-pg-dumpall.html — <code>--roles-only</code> và <code>--globals-only</code>, cùng ghi chú tường minh rằng <code>pg_dump</code> KHÔNG lưu vai trò hay tablespace.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Amazon S3 — versioning và lifecycle</span><span class="lc-sub">docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html — điều tương tự áp cho Cloudflare R2; bật versioning mới là thứ làm cho tệp tải lên phục hồi được (6.4).</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google SRE Book — Managing Incidents, và Postmortem Culture</span><span class="lc-sub">sre.google/sre-book/managing-incidents/ — về việc vì sao một quy trình VIẾT RA và ĐÃ DIỄN TẬP thắng chuyên môn dưới áp lực.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Let&#39;s Encrypt — rate limits</span><span class="lc-sub">letsencrypt.org/docs/rate-limits/ — đáng đọc TRƯỚC một buổi diễn tập: xin lại chứng chỉ nhiều lần lúc tập có thể làm cạn hạn mức tuần và khiến bạn không xin được lúc cần thật.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — volume, và dữ liệu của một container THẬT SỰ nằm ở đâu</span><span class="lc-sub">/courses/docker/learn${REF} — vì sao "mọi thứ đều trong Docker" không có nghĩa là mọi thứ đều được sao lưu, và một tệp compose để lại những đường dẫn nào trên máy chủ.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 10.7 ─────────────────────────── */
    {
      title: '10.7 — Off the machine: 3-2-1, pulling instead of pushing, age, and rotation|||10.7 — Ra khỏi máy: 3-2-1, kéo chứ đừng đẩy, age, và xoay vòng',
      slug: 'deploy-10-7-ra-khoi-may',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Hai bản trên một VPS vẫn là một chỗ để mất. Đo thật: máy kho KÉO bản sao lưu bằng một khoá chỉ-đọc mà VPS không thể lạm dụng, age mã hoá bằng khoá công khai trong 0,05 s, rclone check so băm sau khi chép, và "giữ 7 bản mới nhất" xoá sạch bản tốt khi 8 đêm liền dump hỏng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.7</span>
<h2>Off the machine: 3-2-1, pulling instead of pushing, age, and rotation</h2>
<p class="lead">Lessons 10.1–10.5 made a backup that is complete and proven to restore. It still sits on the server it protects. This lesson moves it somewhere the server's disk, the server's attacker and the server's provider cannot reach — and keeps the right number of copies there.</p>

<h3>Why two copies on one VPS are one place to lose</h3>
${slide('dv-10', 24, '3-2-1: ba bản, hai loại nơi, một bản ngoài máy')}
<p>The rule most people quote is <strong>3-2-1</strong>: "keep three copies of your data on two different media with one copy off-site" (Backblaze&#39;s wording; US-CERT recommended it in a 2012 paper). Written for tapes and office servers, it translates directly to a VPS:</p>
<div class="kv-grid">
<div class="kv"><span class="k">3 copies</span><span class="v">the live database plus two backups. The live database is not a backup: a <code>DELETE</code> without <code>WHERE</code> reaches it instantly.</span></div>
<div class="kv"><span class="k">2 kinds of place</span><span class="v">on a VPS "media" means failure domains: a different disk, a different machine, a different provider, a different account. <code>~/sao-luu</code> on the same disk shares every one of the database&#39;s failures.</span></div>
<div class="kv"><span class="k">1 off the machine</span><span class="v">a copy that survives the machine being gone: disk failure, an attacker with root, a provider suspending the account, a mistaken <code>rm -rf</code> in a deploy script.</span></div>
</div>
<p>The site this course follows does this with two off-machine copies: the VPS uploads each night's dump to an object-storage bucket (a full copy each time — a 353 MB database becomes a 68.5 MB gzip dump; forty nights made 1.8 GB, so the bucket has a lifecycle rule deleting objects after 90 days), and a machine at home <em>pulls</em> the same backups every night and test-restores them. The rest of this lesson builds the second half in the lab: a storage machine <code>dv10-kho</code> on the same Docker network as the lab VPS, reachable only over SSH.</p>

<h3>Push or pull: who holds the keys</h3>
${slide('dv-10', 25, 'Kéo, đừng đẩy: khoá chỉ-đọc cho máy kho')}
<p>If the VPS <em>pushes</em> backups to storage, the VPS holds credentials that can write to that storage — and usually delete from it. Whoever takes over the VPS inherits them and can erase your off-site copies before erasing the database. If the storage machine <em>pulls</em>, the VPS holds nothing that reaches the storage machine at all. The pulling side needs a key that can log in to the VPS, so that key must be unable to do anything except hand over backups. OpenSSH does this in <code>authorized_keys</code>:</p>
<pre><code class="language-bash">command="/usr/local/bin/chi-doc-backup",restrict ssh-ed25519 AAAA… kho-keo</code></pre>
<table><thead><tr><th>Option</th><th>Effect</th></tr></thead><tbody>
<tr><td><code>command="…"</code></td><td>whatever the client asks to run, sshd runs this program instead, and puts the client&#39;s request in <code>SSH_ORIGINAL_COMMAND</code></td></tr>
<tr><td><code>restrict</code></td><td>turns off port forwarding, agent forwarding, X11 forwarding and pseudo-terminal allocation — every way to turn a key into more than one command</td></tr>
</tbody></table>
<p>The program decides what the request is allowed to mean:</p>
<pre><code class="language-bash">#!/bin/bash
<span class="tok-comment"># chi-doc-backup — lenh DUY NHAT ma khoa keo_backup duoc chay tren VPS</span>
set -euo pipefail
DIR=/home/deploy/sao-luu
set -- \${SSH_ORIGINAL_COMMAND:-}
case "\${1:-}" in
  liet-ke)    ls -1 "\$DIR" | grep '\\.tar\\.age\$' ;;
  lay)        f=\$(basename -- "\${2:?}")                 <span class="tok-comment"># cat bo moi ../</span>
              [[ \$f == *.tar.age ]] || { echo "tu choi: \$f" &gt;&amp;2; exit 2; }
              cat -- "\$DIR/\$f" ;;
  tinh-trang) m=\$(ls -t "\$DIR"/*.tar.age | head -1)
              echo "moi nhat: \$(basename "\$m"), \$(( (\$(date +%s) - \$(stat -c %Y "\$m")) / 3600 )) gio tuoi" ;;
  *)          echo "tu choi: \${SSH_ORIGINAL_COMMAND:-(shell)}" &gt;&amp;2; exit 2 ;;
esac</code></pre>
<p>Measured from the storage machine with that key:</p>
<div class="out">$ ssh vps liet-ke
thu-20260929-1359.tar.age
thu-20260929-1412.tar.age
$ ssh vps tinh-trang
moi nhat: thu-20260929-1412.tar.age, 0 gio tuoi
$ ssh vps lay thu-20260929-1412.tar.age &gt; keo/thu-20260929-1412.tar.age
$ ls -l keo/thu-20260929-1412.tar.age | awk '{print \\$5, \\$9}'
10396328 keo/thu-20260929-1412.tar.age
$ ssh vps "lay ../../../etc/shadow"
tu choi: shadow
ma thoat 2
$ ssh vps "rm -rf ~/sao-luu"
tu choi: rm -rf ~/sao-luu
ma thoat 2
$ ssh vps   (xin shell)
Pseudo-terminal will not be allocated because stdin is not a terminal.
tu choi: (shell)
ma thoat 2
$ ssh -N -L 9999:db:5432 vps
channel 2: open failed: administratively prohibited: open failed</div>
<p>The path trick was reduced to <code>shadow</code> by <code>basename</code> and refused; the destructive command and the shell went to the <code>*)</code> branch; and the attempt to tunnel to the database port was refused by <code>restrict</code> before the script was involved. The first version of this script had a bug worth seeing: it used <code>set -- \$SSH_ORIGINAL_COMMAND</code> with <code>set -u</code>, and a plain <code>ssh vps</code> with no command made it die with <code>SSH_ORIGINAL_COMMAND: unbound variable</code>. It still refused — by crashing. <code>\${SSH_ORIGINAL_COMMAND:-}</code> makes the refusal deliberate.</p>
<div class="callout ok"><p><strong>The same idea with object storage.</strong> When the VPS must push (to R2 or S3), give it a key that can only <em>write objects</em> — no delete, no bucket configuration — and set the lifecycle rule in the provider&#39;s dashboard. On the real site the backup key cannot even read the bucket&#39;s lifecycle configuration (<code>AccessDenied</code>), which is exactly right: a stolen key can add backups, not remove them.</p></div>

<h3>Copying: rsync and rclone, and checking after the copy</h3>
${slide('dv-10', 26, 'rsync, rclone sang máy thứ ba — rồi so băm')}
<p>For pushing to a machine you own, <code>rsync</code> over SSH is enough; for object storage and cloud drives, <code>rclone</code> speaks some seventy back-ends through one interface. In the lab, rclone was configured with an SFTP remote pointing at the storage machine (<code>~/.config/rclone/rclone.conf</code>, mode 600):</p>
<pre><code class="language-ini">[kho]
type = sftp
host = kho
user = deploy
key_file = ~/.ssh/day_kho</code></pre>
<div class="out">$ rsync -a --info=stats1 ~/sao-luu/ kho:rsync-kho/
sent 20,798,140 bytes  received 76 bytes  13,865,477.33 bytes/sec
$ rclone copy ~/sao-luu/thu-….tar.age kho:kho/
$ rclone check ~/sao-luu kho:kho --one-way --exclude so-sach.log
NOTICE: sftp://deploy@kho:22/kho: 0 differences found
NOTICE: sftp://deploy@kho:22/kho: 2 matching files</div>
<table><thead><tr><th>Flag</th><th>Meaning</th><th>Careful with</th></tr></thead><tbody>
<tr><td><code>rsync -a</code></td><td>archive: recursive, keep times and permissions</td><td>—</td></tr>
<tr><td><code>rsync --partial</code></td><td>keep a half-transferred file so the next run resumes</td><td>a partial file must never be treated as a backup — keep the <code>.tam</code> naming</td></tr>
<tr><td><code>rsync --checksum</code></td><td>compare content, not size and time</td><td>reads every file on both sides</td></tr>
<tr><td><code>rsync --delete</code></td><td>delete on the destination what is gone from the source</td><td><strong>dangerous for backups</strong>: an attacker or a bug that empties the source empties the copy on the next run</td></tr>
<tr><td><code>rclone copy</code></td><td>add and update, never delete</td><td>the safe default for backups</td></tr>
<tr><td><code>rclone sync</code></td><td>make the destination identical, including deletions</td><td>the same trap as <code>--delete</code></td></tr>
<tr><td><code>rclone check</code></td><td>compare sizes and hashes on both sides</td><td><code>--one-way</code>: only check that the source&#39;s files exist and match</td></tr>
</tbody></table>
<p>The check is not decoration. A network copy cut off at 97% leaves a 97% file; an upload still running when the next job reads the directory looks complete. <code>rclone check</code> compares hashes, and the verification script of 10.4 checks <code>sha256.txt</code> after decrypting — two independent confirmations that the bytes that left are the bytes that arrived.</p>

<h3>Encrypting with a public key: age</h3>
${slide('dv-10', 27, 'age: máy chủ mã hoá bằng khoá công khai, không giải mã được')}
<p>Lesson 10.4 encrypted with <code>openssl enc</code> and a passphrase. That works, but the passphrase must be on the server for the nightly job to use it — so whoever reads the server&#39;s disk can also decrypt every backup. <strong>age</strong> encrypts to a <em>recipient</em>, a public key; only the matching identity (private key) can decrypt. The identity is generated on the storage machine and never leaves it; the VPS gets only the public half:</p>
<pre><code class="language-bash"><span class="tok-comment"># tren MAY KHO — khoa bi mat o day, khong in ra</span>
age-keygen -o ~/.config/age/khoa.txt; chmod 600 ~/.config/age/khoa.txt
age-keygen -y ~/.config/age/khoa.txt &gt; nguoi-nhan.txt     <span class="tok-comment"># chi khoa cong khai "age1…"</span>
<span class="tok-comment"># tren VPS — chi co nguoi-nhan.txt</span>
age -R ~/nguoi-nhan.txt -o thu.dump.age thu.dump</code></pre>
<div class="out">$ for i in 1 2 3; do /usr/bin/time -f "age -R ma hoa: %e s" age -R ~/nguoi-nhan.txt -o t.age thu.dump; done   # VPS
age -R ma hoa: 0.05 s
age -R ma hoa: 0.04 s
age -R ma hoa: 0.03 s
$ head -c 21 t.age
age-encryption.org/v1
$ age -d ~/sao-luu/thu-20260929-1412.tar.age       # VPS thu giai ma
age: error: no identity matched any of the recipients
ma thoat 1
$ /usr/bin/time -f "age -d giai ma: %e s" age -d -i ~/.config/age/khoa.txt -o /tmp/t.dump /tmp/t.age   # may kho
age -d giai ma: 0.04 s
$ sha256sum /tmp/t.dump | cut -c1-16                # = sha256 cua thu.dump tren VPS
ef152030525ed945</div>
<table><thead><tr><th>13.25 MB dump</th><th>encrypt</th><th>what the server holds</th></tr></thead><tbody>
<tr><td><code>age -R</code> (public key)</td><td>0.03–0.05 s</td><td>only a public key — cannot decrypt</td></tr>
<tr><td><code>gpg --symmetric --cipher-algo AES256</code></td><td>0.48–1.23 s (compresses first)</td><td>a passphrase that decrypts everything</td></tr>
<tr><td><code>openssl enc -aes-256-cbc -pbkdf2</code> (10.4)</td><td>58 ms for 21 MB</td><td>a passphrase that decrypts everything</td></tr>
</tbody></table>
<div class="pitfall co-tieu-de"><p><strong>The identity is now the single most important file you own.</strong> Lose it and every backup is random bytes. Keep it in at least two places that are not the VPS — a password manager and an offline copy — and prove it works every week by decrypting the <em>off-site</em> copy with it (10.4&#39;s schedule). Never paste it into a chat, a ticket or a slide; the lab above printed only the first characters of the public key.</p></div>

<h3>Rotation: keep by day, week and month — and the trap in "keep the newest N"</h3>
${slide('dv-10', 28, 'Xoay vòng GFS và cái bẫy "giữ N bản mới nhất"')}
<p>Keeping every nightly backup forever fills the disk; keeping only the last seven means a mistake noticed after a week is unrecoverable. The usual compromise keeps recent copies densely and old ones sparsely — daily, weekly and monthly ("grandfather-father-son"):</p>
<pre><code class="language-bash">#!/bin/bash
<span class="tok-comment"># xoay-vong.sh &lt;thu-muc&gt; — giu 7 ban ngay + 4 ban Chu nhat + 6 ban mung 1; xoa phan con lai</span>
set -euo pipefail
cd "\$1"
declare -A GIU; nd=0; nt=0; nm=0
for f in \$(ls -1 *.tar.age | sort -r); do                 <span class="tok-comment"># moi nhat truoc</span>
  d=\$(echo "\$f" | grep -oE '[0-9]{8}' | head -1)
  (( nd &lt; 7 )) &amp;&amp; { GIU[\$f]=ngay; nd=\$((nd+1)); continue; }
  [ "\$(date -d "\$d" +%u)" = 7 ] &amp;&amp; (( nt &lt; 4 )) &amp;&amp; { GIU[\$f]=tuan; nt=\$((nt+1)); continue; }
  [ "\${d:6:2}" = 01 ] &amp;&amp; (( nm &lt; 6 )) &amp;&amp; { GIU[\$f]=thang; nm=\$((nm+1)); continue; }
done
for f in *.tar.age; do [ -n "\${GIU[\$f]:-}" ] || rm -f -- "\$f"; done
for f in \$(ls -1 *.tar.age | sort -r); do echo "  giu  \$f  (\${GIU[\$f]})"; done</code></pre>
<p>Run on 151 nightly files from 02/05 to 29/09:</p>
<div class="out">truoc: 151 ban, tu thu-20260502-0315.tar.age toi thu-20260929-0315.tar.age
  giu  thu-20260929-0315.tar.age  (ngay)
  …
  giu  thu-20260923-0315.tar.age  (ngay)
  giu  thu-20260920-0315.tar.age  (tuan)
  giu  thu-20260913-0315.tar.age  (tuan)
  giu  thu-20260906-0315.tar.age  (tuan)
  giu  thu-20260901-0315.tar.age  (thang)
  giu  thu-20260830-0315.tar.age  (tuan)
  giu  thu-20260801-0315.tar.age  (thang)
  giu  thu-20260701-0315.tar.age  (thang)
  giu  thu-20260601-0315.tar.age  (thang)
sau: 15 ban
chay lan 2: 15 ban</div>
<p>Fifteen files cover four months, and a second run changes nothing — rotation must be safe to run twice. Now the trap. The simplest rotation, and the one in 10.1&#39;s cron script, keeps the newest N files. Ten good backups, then eight nights on which <code>pg_dump</code> failed and left empty files that nobody checked:</p>
<div class="out">truoc: 18 ban, 8 ban 0 byte (8 dem gan nhat pg_dump hong, khong ai kiem)
$ ls -1t thu-*.dump | tail -n +8 | xargs -r rm -f      # giu 7 ban moi nhat
$ ls -l --time-style=+%d/%m | awk "NR&gt;1{print \\$5, \\$6, \\$7}"
0 23/09 thu-20260923.dump
0 24/09 thu-20260924.dump
0 25/09 thu-20260925.dump
0 26/09 thu-20260926.dump
0 27/09 thu-20260927.dump
0 28/09 thu-20260928.dump
0 29/09 thu-20260929.dump</div>
<p>Seven empty files kept, every good backup deleted — by the rotation, working exactly as written. Rotation must only count backups that <em>passed verification</em>, and it must be watched by the age alarm of 10.4, which would have fired on the first empty night. For object storage the same job is a lifecycle rule on the bucket (the real site deletes after 90 days); it has the same trap in a milder form, so the age alarm matters there too.</p>

<h3>When to reach for a real backup tool</h3>
<p>Everything in this chapter is a few dozen lines of bash around <code>pg_dump</code>, <code>age</code> and <code>rclone</code>, which is right for one VPS and a database of hundreds of megabytes. Tools such as <strong>restic</strong> and <strong>BorgBackup</strong> add deduplication (unchanged data is stored once, so thirty daily copies of a 20 GB volume do not cost 600 GB), encryption, retention policies and a built-in <code>check</code> that reads back the stored data. Reach for one when the files you back up — uploads, a large volume — grow beyond what full copies can afford. For PostgreSQL itself, the step after nightly dumps is continuous WAL archiving (10.2&#39;s RPO section), usually through a dedicated tool; that is a different chapter of your career, not of this course.</p>

<h3>On macOS and Windows</h3>
<ul>
<li><strong>Your laptop is a poor storage machine</strong> — it sleeps, travels and gets reinstalled. A small always-on Linux box, a second cheap VPS at a different provider, or an object-storage bucket is better. If you must pull to a laptop, do it with the same restricted key and check the age alarm from somewhere that is always on.</li>
<li><strong>The age identity and SSH keys on Windows</strong> must not be readable by other users; in WSL keep them inside the Linux file system (<code>~</code>), not under <code>/mnt/c</code>, where permissions are emulated.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> after reading about a VPS whose attacker deleted both the database and the backup bucket, your team wants the backups somewhere the VPS cannot touch. Build it on the lab network and try to break it.</p>
<ol>
<li>Start a storage container <code>dv10-kho</code> (Ubuntu + sshd, label <code>dvhoc=10</code>) on the lab network. Generate an age identity <em>on it</em>, and copy only the public recipient to the lab VPS.</li>
<li>Run <code>sao-luu.sh</code> on the VPS; confirm that <code>age -d</code> on the VPS fails and that the storage machine decrypts the file with a matching sha256.</li>
<li>Install <code>chi-doc-backup</code> on the VPS and add the storage machine&#39;s key with <code>command="…",restrict</code>. Pull the newest backup, then try <code>lay ../../../etc/shadow</code>, <code>rm -rf ~/sao-luu</code>, a shell, and <code>-L 9999:db:5432</code>.</li>
<li>Create 18 dated files where the newest 8 are empty and run "keep the newest 7"; then run <code>xoay-vong.sh</code> on 151 dated files.</li>
</ol>
<p><strong>Done when:</strong> the VPS cannot decrypt its own backups, the pull key can list and fetch but every other attempt is refused with exit 2 or "administratively prohibited", and you can show the directory in which rotation deleted every good copy.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">3-2-1</span><span class="v">Three copies, two kinds of place, one off the machine.</span></div>
  <div class="kv"><span class="k">off-site copy</span><span class="v">A backup that survives the loss of the whole server and its account.</span></div>
  <div class="kv"><span class="k">pull backup</span><span class="v">The storage side fetches backups; the server holds no credentials to the storage.</span></div>
  <div class="kv"><span class="k">forced command</span><span class="v"><code>command="…"</code> in <code>authorized_keys</code>: the only program a key may run.</span></div>
  <div class="kv"><span class="k">recipient / identity</span><span class="v">age&#39;s public key (encrypts) and private key (decrypts).</span></div>
  <div class="kv"><span class="k">retention (GFS)</span><span class="v">How many daily, weekly and monthly copies to keep.</span></div>
  <div class="kv"><span class="k">lifecycle rule</span><span class="v">A storage-side policy that deletes objects after a set age.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Two copies on the same VPS share every failure of that VPS; at least one copy must be off the machine.</li>
<li>Pulling from a separate machine with a forced-command, <code>restrict</code>ed key leaves nothing on the VPS that can reach the backups.</li>
<li>Use <code>rclone copy</code> or <code>rsync</code> without <code>--delete</code> for backups, and check hashes after every copy.</li>
<li>age encrypts to a public key in 0.05 s; the server can encrypt and cannot decrypt — keep the private key in two places off the VPS.</li>
<li>GFS rotation kept 15 files covering four months; "keep the newest N" deleted every good backup after eight failed nights.</li>
<li>Rotate only verified backups, and let the age alarm watch the rotation.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Backblaze — The 3-2-1 Backup Strategy</span><span class="lc-sub">backblaze.com/blog/the-3-2-1-backup-strategy/ — the rule as usually quoted, and US-CERT&#39;s 2012 recommendation of it.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">sshd(8) — AUTHORIZED_KEYS FILE FORMAT</span><span class="lc-sub">man.openbsd.org/sshd.8 — <code>command=</code>, <code>restrict</code> and <code>SSH_ORIGINAL_COMMAND</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">age — specification and tool</span><span class="lc-sub">age-encryption.org/v1 and github.com/FiloSottile/age — recipients, identities and the file format whose header you saw.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">rclone — SFTP backend and rclone check</span><span class="lc-sub">rclone.org/sftp/ and rclone.org/commands/rclone_check/ — the remote used above and how the comparison works.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">rsync — documentation</span><span class="lc-sub">rsync.samba.org/documentation.html — <code>--partial</code>, <code>--checksum</code> and what <code>--delete</code> will do to a backup copy.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — Chapter 11 (11.2 timers) and Chapter 16 (16.3 backups)</span><span class="lc-sub">/courses/linux-bash/learn${REF} — running these scripts from systemd timers on Vietnam time on a UTC server, keeping seven copies.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.7</span>
<h2>Ra khỏi máy: 3-2-1, kéo chứ đừng đẩy, age, và xoay vòng</h2>
<p class="lead">Bài 10.1–10.5 đã làm ra một bản sao lưu đầy đủ và đã chứng minh là phục hồi được. Nó vẫn nằm trên chính cái máy chủ nó bảo vệ. Bài này đưa nó tới một chỗ mà đĩa của máy chủ, kẻ chiếm máy chủ và nhà cung cấp máy chủ đều không với tới — và giữ đúng số bản ở đó.</p>

<h3>Vì sao hai bản trên một VPS vẫn là MỘT chỗ để mất</h3>
${slide('dv-10', 24, '3-2-1: ba bản, hai loại nơi, một bản ngoài máy')}
<p>Quy tắc người ta hay trích nhất là <strong>3-2-1</strong>: "giữ ba bản dữ liệu, trên hai loại phương tiện khác nhau, với một bản ở ngoài" (cách diễn đạt của Backblaze; US-CERT khuyến nghị nó trong một tài liệu năm 2012). Viết cho thời băng từ và máy chủ văn phòng, nó dịch thẳng sang một VPS:</p>
<div class="kv-grid">
<div class="kv"><span class="k">3 bản</span><span class="v">cơ sở dữ liệu đang chạy cộng hai bản sao lưu. Cơ sở dữ liệu đang chạy KHÔNG phải bản sao lưu: một câu <code>DELETE</code> thiếu <code>WHERE</code> chạm tới nó ngay lập tức.</span></div>
<div class="kv"><span class="k">2 loại nơi</span><span class="v">trên VPS, "phương tiện" nghĩa là vùng hỏng: đĩa khác, máy khác, nhà cung cấp khác, tài khoản khác. <code>~/sao-luu</code> trên cùng đĩa chia chung MỌI kiểu hỏng với cơ sở dữ liệu.</span></div>
<div class="kv"><span class="k">1 ngoài máy</span><span class="v">một bản sống sót khi cái máy biến mất: đĩa hỏng, kẻ tấn công có quyền root, nhà cung cấp khoá tài khoản, một lệnh <code>rm -rf</code> nhầm trong script deploy.</span></div>
</div>
<p>Website mà khoá này theo dõi làm việc đó với HAI bản ngoài máy: VPS đẩy bản dump mỗi đêm lên một bucket lưu trữ đối tượng (mỗi lần là một bản sao ĐẦY ĐỦ — cơ sở dữ liệu 353 MB thành bản dump gzip 68,5 MB; bốn mươi đêm thành 1,8 GB, nên bucket có luật vòng đời xoá đối tượng sau 90 ngày), và một máy ở nhà <em>KÉO</em> cùng các bản sao lưu ấy về mỗi đêm rồi phục hồi thử. Phần còn lại của bài dựng nửa thứ hai trong phòng thí nghiệm: một máy kho <code>dv10-kho</code> cùng mạng Docker với VPS thí nghiệm, chỉ vào được bằng SSH.</p>

<h3>Đẩy hay kéo: ai giữ chìa khoá</h3>
${slide('dv-10', 25, 'Kéo, đừng đẩy: khoá chỉ-đọc cho máy kho')}
<p>Nếu VPS <em>ĐẨY</em> bản sao lưu lên kho, VPS phải giữ thông tin đăng nhập ghi được vào kho — và thường là xoá được luôn. Kẻ nào chiếm được VPS thừa hưởng chúng và có thể xoá các bản ngoài máy của bạn TRƯỚC khi xoá cơ sở dữ liệu. Nếu máy kho <em>KÉO</em>, VPS không giữ thứ gì với tới máy kho cả. Phía kéo cần một khoá đăng nhập được vào VPS, nên cái khoá đó phải KHÔNG làm được gì ngoài việc trao bản sao lưu. OpenSSH làm việc này trong <code>authorized_keys</code>:</p>
<pre><code class="language-bash">command="/usr/local/bin/chi-doc-backup",restrict ssh-ed25519 AAAA… kho-keo</code></pre>
<table><thead><tr><th>Tuỳ chọn</th><th>Tác dụng</th></tr></thead><tbody>
<tr><td><code>command="…"</code></td><td>máy khách xin chạy gì thì sshd cũng chạy chương trình NÀY thay vào, và đặt yêu cầu của máy khách vào <code>SSH_ORIGINAL_COMMAND</code></td></tr>
<tr><td><code>restrict</code></td><td>tắt chuyển tiếp cổng, chuyển tiếp agent, chuyển tiếp X11 và cấp terminal ảo — mọi cách biến một cái khoá thành nhiều hơn một lệnh</td></tr>
</tbody></table>
<p>Chương trình đó quyết định yêu cầu được phép mang nghĩa gì:</p>
<pre><code class="language-bash">#!/bin/bash
<span class="tok-comment"># chi-doc-backup — lenh DUY NHAT ma khoa keo_backup duoc chay tren VPS</span>
set -euo pipefail
DIR=/home/deploy/sao-luu
set -- \${SSH_ORIGINAL_COMMAND:-}
case "\${1:-}" in
  liet-ke)    ls -1 "\$DIR" | grep '\\.tar\\.age\$' ;;
  lay)        f=\$(basename -- "\${2:?}")                 <span class="tok-comment"># cat bo moi ../</span>
              [[ \$f == *.tar.age ]] || { echo "tu choi: \$f" &gt;&amp;2; exit 2; }
              cat -- "\$DIR/\$f" ;;
  tinh-trang) m=\$(ls -t "\$DIR"/*.tar.age | head -1)
              echo "moi nhat: \$(basename "\$m"), \$(( (\$(date +%s) - \$(stat -c %Y "\$m")) / 3600 )) gio tuoi" ;;
  *)          echo "tu choi: \${SSH_ORIGINAL_COMMAND:-(shell)}" &gt;&amp;2; exit 2 ;;
esac</code></pre>
<p>Đo từ máy kho với cái khoá đó:</p>
<div class="out">$ ssh vps liet-ke
thu-20260929-1359.tar.age
thu-20260929-1412.tar.age
$ ssh vps tinh-trang
moi nhat: thu-20260929-1412.tar.age, 0 gio tuoi
$ ssh vps lay thu-20260929-1412.tar.age &gt; keo/thu-20260929-1412.tar.age
$ ls -l keo/thu-20260929-1412.tar.age | awk '{print \\$5, \\$9}'
10396328 keo/thu-20260929-1412.tar.age
$ ssh vps "lay ../../../etc/shadow"
tu choi: shadow
ma thoat 2
$ ssh vps "rm -rf ~/sao-luu"
tu choi: rm -rf ~/sao-luu
ma thoat 2
$ ssh vps   (xin shell)
Pseudo-terminal will not be allocated because stdin is not a terminal.
tu choi: (shell)
ma thoat 2
$ ssh -N -L 9999:db:5432 vps
channel 2: open failed: administratively prohibited: open failed</div>
<p>Mẹo đường dẫn bị <code>basename</code> rút gọn thành <code>shadow</code> rồi bị từ chối; lệnh phá hoại và yêu cầu shell rơi vào nhánh <code>*)</code>; còn cú đào đường hầm tới cổng cơ sở dữ liệu bị <code>restrict</code> chặn trước khi script kịp dính vào. Phiên bản ĐẦU TIÊN của script này có một lỗi đáng xem: nó dùng <code>set -- \$SSH_ORIGINAL_COMMAND</code> cùng với <code>set -u</code>, và một lệnh <code>ssh vps</code> trơn không kèm lệnh làm nó chết với <code>SSH_ORIGINAL_COMMAND: unbound variable</code>. Nó vẫn từ chối — nhưng bằng cách SẬP. <code>\${SSH_ORIGINAL_COMMAND:-}</code> biến việc từ chối thành CÓ CHỦ ĐÍCH.</p>
<div class="callout ok"><p><strong>Cùng ý đó với kho đối tượng.</strong> Khi VPS buộc phải đẩy (lên R2 hay S3), hãy cho nó một khoá chỉ <em>GHI đối tượng</em> được — không xoá, không sửa cấu hình bucket — và đặt luật vòng đời trên bảng điều khiển của nhà cung cấp. Trên website thật, khoá sao lưu thậm chí không ĐỌC được cấu hình vòng đời của bucket (<code>AccessDenied</code>), và thế là đúng: một cái khoá bị lấy cắp chỉ THÊM được bản sao lưu, không XOÁ được.</p></div>

<h3>Chép sang: rsync và rclone, và kiểm SAU khi chép</h3>
${slide('dv-10', 26, 'rsync, rclone sang máy thứ ba — rồi so băm')}
<p>Để đẩy sang một máy của chính bạn, <code>rsync</code> qua SSH là đủ; với kho đối tượng và ổ đám mây, <code>rclone</code> nói chuyện với khoảng bảy mươi loại kho qua cùng một giao diện. Trong phòng thí nghiệm, rclone được cấu hình với một remote SFTP trỏ tới máy kho (<code>~/.config/rclone/rclone.conf</code>, quyền 600):</p>
<pre><code class="language-ini">[kho]
type = sftp
host = kho
user = deploy
key_file = ~/.ssh/day_kho</code></pre>
<div class="out">$ rsync -a --info=stats1 ~/sao-luu/ kho:rsync-kho/
sent 20,798,140 bytes  received 76 bytes  13,865,477.33 bytes/sec
$ rclone copy ~/sao-luu/thu-….tar.age kho:kho/
$ rclone check ~/sao-luu kho:kho --one-way --exclude so-sach.log
NOTICE: sftp://deploy@kho:22/kho: 0 differences found
NOTICE: sftp://deploy@kho:22/kho: 2 matching files</div>
<table><thead><tr><th>Cờ</th><th>Nghĩa</th><th>Cẩn thận với</th></tr></thead><tbody>
<tr><td><code>rsync -a</code></td><td>chế độ lưu trữ: đệ quy, giữ giờ và quyền</td><td>—</td></tr>
<tr><td><code>rsync --partial</code></td><td>giữ tệp chép dở để lần sau chép tiếp</td><td>một tệp dở không bao giờ được coi là bản sao lưu — giữ cách đặt tên <code>.tam</code></td></tr>
<tr><td><code>rsync --checksum</code></td><td>so NỘI DUNG, không so kích thước và giờ</td><td>đọc mọi tệp ở cả hai phía</td></tr>
<tr><td><code>rsync --delete</code></td><td>xoá ở đích những gì nguồn không còn</td><td><strong>nguy hiểm cho sao lưu</strong>: kẻ tấn công hay một lỗi làm rỗng nguồn thì lần chạy sau làm rỗng luôn bản sao</td></tr>
<tr><td><code>rclone copy</code></td><td>thêm và cập nhật, không bao giờ xoá</td><td>mặc định an toàn cho sao lưu</td></tr>
<tr><td><code>rclone sync</code></td><td>làm đích giống hệt nguồn, KỂ CẢ việc xoá</td><td>cùng cái bẫy với <code>--delete</code></td></tr>
<tr><td><code>rclone check</code></td><td>so kích thước và mã băm hai phía</td><td><code>--one-way</code>: chỉ kiểm rằng tệp của nguồn có mặt và khớp</td></tr>
</tbody></table>
<p>Phép kiểm không phải đồ trang trí. Một lần chép qua mạng đứt ở 97% để lại một tệp 97%; một lượt tải lên còn đang chạy khi job sau đọc thư mục trông như đã xong. <code>rclone check</code> so mã băm, và script kiểm chứng của 10.4 kiểm <code>sha256.txt</code> sau khi giải mã — hai lần xác nhận độc lập rằng những byte đi ra chính là những byte đến nơi.</p>

<h3>Mã hoá bằng khoá công khai: age</h3>
${slide('dv-10', 27, 'age: máy chủ mã hoá bằng khoá công khai, không giải mã được')}
<p>Bài 10.4 mã hoá bằng <code>openssl enc</code> và một mật khẩu. Cách đó chạy được, nhưng mật khẩu phải nằm trên máy chủ để job hằng đêm dùng — nên ai đọc được đĩa máy chủ cũng giải mã được mọi bản sao lưu. <strong>age</strong> mã hoá cho một <em>người nhận</em>, tức một khoá công khai; chỉ danh tính (khoá bí mật) tương ứng mới giải mã được. Danh tính được tạo trên máy kho và không bao giờ rời khỏi đó; VPS chỉ nhận nửa công khai:</p>
<pre><code class="language-bash"><span class="tok-comment"># tren MAY KHO — khoa bi mat o day, khong in ra</span>
age-keygen -o ~/.config/age/khoa.txt; chmod 600 ~/.config/age/khoa.txt
age-keygen -y ~/.config/age/khoa.txt &gt; nguoi-nhan.txt     <span class="tok-comment"># chi khoa cong khai "age1…"</span>
<span class="tok-comment"># tren VPS — chi co nguoi-nhan.txt</span>
age -R ~/nguoi-nhan.txt -o thu.dump.age thu.dump</code></pre>
<div class="out">$ for i in 1 2 3; do /usr/bin/time -f "age -R ma hoa: %e s" age -R ~/nguoi-nhan.txt -o t.age thu.dump; done   # VPS
age -R ma hoa: 0.05 s
age -R ma hoa: 0.04 s
age -R ma hoa: 0.03 s
$ head -c 21 t.age
age-encryption.org/v1
$ age -d ~/sao-luu/thu-20260929-1412.tar.age       # VPS thu giai ma
age: error: no identity matched any of the recipients
ma thoat 1
$ /usr/bin/time -f "age -d giai ma: %e s" age -d -i ~/.config/age/khoa.txt -o /tmp/t.dump /tmp/t.age   # may kho
age -d giai ma: 0.04 s
$ sha256sum /tmp/t.dump | cut -c1-16                # = sha256 cua thu.dump tren VPS
ef152030525ed945</div>
<table><thead><tr><th>Bản dump 13,25 MB</th><th>mã hoá</th><th>máy chủ giữ gì</th></tr></thead><tbody>
<tr><td><code>age -R</code> (khoá công khai)</td><td>0,03–0,05 s</td><td>chỉ khoá công khai — KHÔNG giải mã được</td></tr>
<tr><td><code>gpg --symmetric --cipher-algo AES256</code></td><td>0,48–1,23 s (nén trước)</td><td>một mật khẩu giải mã được tất cả</td></tr>
<tr><td><code>openssl enc -aes-256-cbc -pbkdf2</code> (10.4)</td><td>58 ms cho 21 MB</td><td>một mật khẩu giải mã được tất cả</td></tr>
</tbody></table>
<div class="pitfall co-tieu-de"><p><strong>Danh tính giờ là tệp QUAN TRỌNG NHẤT bạn có.</strong> Mất nó thì mọi bản sao lưu là byte ngẫu nhiên. Cất ít nhất hai nơi KHÔNG phải VPS — một trình quản lý mật khẩu và một bản ngoại tuyến — và chứng minh nó dùng được mỗi tuần bằng cách giải mã bản <em>NGOÀI MÁY</em> bằng nó (lịch của 10.4). Đừng bao giờ dán nó vào một đoạn chat, một ticket hay một slide; phòng thí nghiệm ở trên chỉ in vài ký tự đầu của khoá công khai.</p></div>

<h3>Xoay vòng: giữ theo ngày, tuần, tháng — và cái bẫy của "giữ N bản mới nhất"</h3>
${slide('dv-10', 28, 'Xoay vòng GFS và cái bẫy "giữ N bản mới nhất"')}
<p>Giữ mọi bản sao lưu hằng đêm mãi mãi thì đầy đĩa; chỉ giữ bảy bản cuối thì một sai lầm phát hiện sau một tuần là không cứu được. Cách thoả hiệp thường gặp giữ các bản gần DÀY và các bản cũ THƯA — theo ngày, tuần và tháng ("ông-cha-con", GFS):</p>
<pre><code class="language-bash">#!/bin/bash
<span class="tok-comment"># xoay-vong.sh &lt;thu-muc&gt; — giu 7 ban ngay + 4 ban Chu nhat + 6 ban mung 1; xoa phan con lai</span>
set -euo pipefail
cd "\$1"
declare -A GIU; nd=0; nt=0; nm=0
for f in \$(ls -1 *.tar.age | sort -r); do                 <span class="tok-comment"># moi nhat truoc</span>
  d=\$(echo "\$f" | grep -oE '[0-9]{8}' | head -1)
  (( nd &lt; 7 )) &amp;&amp; { GIU[\$f]=ngay; nd=\$((nd+1)); continue; }
  [ "\$(date -d "\$d" +%u)" = 7 ] &amp;&amp; (( nt &lt; 4 )) &amp;&amp; { GIU[\$f]=tuan; nt=\$((nt+1)); continue; }
  [ "\${d:6:2}" = 01 ] &amp;&amp; (( nm &lt; 6 )) &amp;&amp; { GIU[\$f]=thang; nm=\$((nm+1)); continue; }
done
for f in *.tar.age; do [ -n "\${GIU[\$f]:-}" ] || rm -f -- "\$f"; done
for f in \$(ls -1 *.tar.age | sort -r); do echo "  giu  \$f  (\${GIU[\$f]})"; done</code></pre>
<p>Chạy trên 151 tệp hằng đêm từ 02/05 tới 29/09:</p>
<div class="out">truoc: 151 ban, tu thu-20260502-0315.tar.age toi thu-20260929-0315.tar.age
  giu  thu-20260929-0315.tar.age  (ngay)
  …
  giu  thu-20260923-0315.tar.age  (ngay)
  giu  thu-20260920-0315.tar.age  (tuan)
  giu  thu-20260913-0315.tar.age  (tuan)
  giu  thu-20260906-0315.tar.age  (tuan)
  giu  thu-20260901-0315.tar.age  (thang)
  giu  thu-20260830-0315.tar.age  (tuan)
  giu  thu-20260801-0315.tar.age  (thang)
  giu  thu-20260701-0315.tar.age  (thang)
  giu  thu-20260601-0315.tar.age  (thang)
sau: 15 ban
chay lan 2: 15 ban</div>
<p>Mười lăm tệp phủ bốn tháng, và chạy lần hai không đổi gì — xoay vòng phải chạy hai lần vẫn an toàn. Giờ tới cái bẫy. Kiểu xoay vòng đơn giản nhất, và cũng là kiểu trong script cron của 10.1, giữ N tệp mới nhất. Mười bản sao lưu tốt, rồi tám đêm <code>pg_dump</code> hỏng để lại những tệp rỗng mà không ai kiểm:</p>
<div class="out">truoc: 18 ban, 8 ban 0 byte (8 dem gan nhat pg_dump hong, khong ai kiem)
$ ls -1t thu-*.dump | tail -n +8 | xargs -r rm -f      # giu 7 ban moi nhat
$ ls -l --time-style=+%d/%m | awk "NR&gt;1{print \\$5, \\$6, \\$7}"
0 23/09 thu-20260923.dump
0 24/09 thu-20260924.dump
0 25/09 thu-20260925.dump
0 26/09 thu-20260926.dump
0 27/09 thu-20260927.dump
0 28/09 thu-20260928.dump
0 29/09 thu-20260929.dump</div>
<p>Giữ lại bảy tệp rỗng, xoá SẠCH mọi bản tốt — do chính cái xoay vòng, chạy đúng như nó được viết. Xoay vòng chỉ được đếm những bản <em>ĐÃ KIỂM ĐẠT</em>, và phải có cái báo động theo tuổi của 10.4 canh chừng, thứ lẽ ra đã nổ ngay đêm rỗng đầu tiên. Với kho đối tượng, việc này là một luật vòng đời trên bucket (website thật xoá sau 90 ngày); nó có cùng cái bẫy ở dạng nhẹ hơn, nên báo động theo tuổi ở đó cũng quan trọng.</p>

<h3>Khi nào nên dùng một công cụ sao lưu thật sự</h3>
<p>Mọi thứ trong chương này là vài chục dòng bash quanh <code>pg_dump</code>, <code>age</code> và <code>rclone</code>, và thế là đúng cho một VPS với một cơ sở dữ liệu vài trăm megabyte. Các công cụ như <strong>restic</strong> và <strong>BorgBackup</strong> thêm khử trùng lặp (dữ liệu không đổi chỉ lưu một lần, nên ba mươi bản hằng ngày của một volume 20 GB không tốn 600 GB), mã hoá, chính sách giữ bản và một lệnh <code>check</code> dựng sẵn đọc lại dữ liệu đã lưu. Hãy dùng tới chúng khi các TỆP bạn sao lưu — tệp tải lên, một volume lớn — lớn tới mức sao chép đầy đủ mỗi đêm không còn kham nổi. Với chính PostgreSQL, bước kế tiếp sau dump hằng đêm là lưu trữ WAL liên tục (phần RPO của 10.2), thường qua một công cụ chuyên dụng; đó là một chương khác trong nghề của bạn, không phải của khoá này.</p>

<h3>Trên macOS và Windows</h3>
<ul>
<li><strong>Laptop của bạn là một máy kho tồi</strong> — nó ngủ, đi theo bạn, và bị cài lại. Một máy Linux nhỏ luôn bật, một VPS rẻ thứ hai ở nhà cung cấp KHÁC, hay một bucket lưu trữ đối tượng đều tốt hơn. Nếu buộc phải kéo về laptop, hãy làm với đúng cái khoá bị giới hạn ấy và để báo động theo tuổi chạy ở một chỗ luôn bật.</li>
<li><strong>Danh tính age và khoá SSH trên Windows</strong> không được để người dùng khác đọc; trong WSL hãy giữ chúng trong hệ tệp Linux (<code>~</code>), đừng để dưới <code>/mnt/c</code>, nơi quyền truy cập chỉ được giả lập.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> sau khi đọc về một VPS mà kẻ tấn công xoá cả cơ sở dữ liệu lẫn bucket sao lưu, nhóm bạn muốn bản sao lưu nằm ở chỗ VPS không đụng tới được. Dựng nó trên mạng thí nghiệm và thử phá nó.</p>
<ol>
<li>Dựng một container kho <code>dv10-kho</code> (Ubuntu + sshd, nhãn <code>dvhoc=10</code>) trên mạng thí nghiệm. Tạo danh tính age <em>TRÊN nó</em>, và chỉ chép người nhận công khai sang VPS thí nghiệm.</li>
<li>Chạy <code>sao-luu.sh</code> trên VPS; xác nhận <code>age -d</code> trên VPS thất bại còn máy kho giải mã được tệp với sha256 khớp.</li>
<li>Cài <code>chi-doc-backup</code> lên VPS và thêm khoá của máy kho với <code>command="…",restrict</code>. Kéo bản mới nhất, rồi thử <code>lay ../../../etc/shadow</code>, <code>rm -rf ~/sao-luu</code>, xin shell, và <code>-L 9999:db:5432</code>.</li>
<li>Tạo 18 tệp có ngày trong đó 8 tệp mới nhất rỗng và chạy "giữ 7 bản mới nhất"; rồi chạy <code>xoay-vong.sh</code> trên 151 tệp có ngày.</li>
</ol>
<p><strong>Đạt khi:</strong> VPS không giải mã được chính bản sao lưu của nó, khoá kéo liệt kê và lấy được nhưng mọi thử khác đều bị từ chối với mã 2 hoặc "administratively prohibited", và bạn chỉ ra được thư mục trong đó xoay vòng đã xoá mọi bản tốt.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">3-2-1 (quy tắc ba-hai-một)</span><span class="v">Ba bản, hai loại nơi, một bản ngoài máy.</span></div>
  <div class="kv"><span class="k">off-site copy (bản ngoài máy)</span><span class="v">Bản sao lưu sống sót khi mất cả máy chủ lẫn tài khoản của nó.</span></div>
  <div class="kv"><span class="k">pull backup (sao lưu kiểu kéo)</span><span class="v">Phía kho tự lấy bản sao lưu; máy chủ không giữ thông tin đăng nhập nào vào kho.</span></div>
  <div class="kv"><span class="k">forced command (lệnh ép buộc)</span><span class="v"><code>command="…"</code> trong <code>authorized_keys</code>: chương trình DUY NHẤT một cái khoá được chạy.</span></div>
  <div class="kv"><span class="k">recipient / identity (người nhận / danh tính)</span><span class="v">Khoá công khai (mã hoá) và khoá bí mật (giải mã) của age.</span></div>
  <div class="kv"><span class="k">retention GFS (chính sách giữ bản)</span><span class="v">Giữ bao nhiêu bản theo ngày, tuần và tháng.</span></div>
  <div class="kv"><span class="k">lifecycle rule (luật vòng đời)</span><span class="v">Chính sách phía kho tự xoá đối tượng sau một độ tuổi đặt trước.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Hai bản trên cùng một VPS chia chung mọi kiểu hỏng của VPS đó; ít nhất một bản phải ở ngoài máy.</li>
<li>Kéo từ một máy riêng bằng một khoá có lệnh ép buộc và <code>restrict</code> thì VPS không giữ gì với tới được các bản sao lưu.</li>
<li>Dùng <code>rclone copy</code> hoặc <code>rsync</code> KHÔNG có <code>--delete</code> cho sao lưu, và so mã băm sau mỗi lần chép.</li>
<li>age mã hoá bằng khoá công khai trong 0,05 s; máy chủ mã hoá được mà không giải mã được — cất khoá bí mật ở hai nơi ngoài VPS.</li>
<li>Xoay vòng GFS giữ 15 tệp phủ bốn tháng; "giữ N bản mới nhất" xoá mọi bản tốt sau tám đêm hỏng.</li>
<li>Chỉ xoay vòng những bản đã kiểm đạt, và để báo động theo tuổi canh chừng việc xoay vòng.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Backblaze — The 3-2-1 Backup Strategy</span><span class="lc-sub">backblaze.com/blog/the-3-2-1-backup-strategy/ — quy tắc như người ta vẫn trích, và khuyến nghị của US-CERT năm 2012.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">sshd(8) — AUTHORIZED_KEYS FILE FORMAT</span><span class="lc-sub">man.openbsd.org/sshd.8 — <code>command=</code>, <code>restrict</code> và <code>SSH_ORIGINAL_COMMAND</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">age — đặc tả và công cụ</span><span class="lc-sub">age-encryption.org/v1 và github.com/FiloSottile/age — người nhận, danh tính và định dạng tệp có dòng đầu bạn vừa thấy.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">rclone — SFTP backend và rclone check</span><span class="lc-sub">rclone.org/sftp/ và rclone.org/commands/rclone_check/ — remote dùng ở trên và cách phép so hoạt động.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">rsync — tài liệu</span><span class="lc-sub">rsync.samba.org/documentation.html — <code>--partial</code>, <code>--checksum</code> và <code>--delete</code> sẽ làm gì với một bản sao lưu.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — Chương 11 (11.2 timer) và Chương 16 (16.3 sao lưu)</span><span class="lc-sub">/courses/linux-bash/learn${REF} — chạy các script này bằng timer systemd theo giờ Việt Nam trên máy chạy UTC, giữ bảy bản.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 10.6 ─────────────────────────── */
    {
      title: '10.6 — Quiz: backups and restore|||10.6 — Quiz: sao lưu và phục hồi',
      slug: 'deploy-10-6-quiz',
      type: 'QUIZ',
      description: 'Mười tình huống: một bản dump hỏng vì docker exec -t, bộ kiểm dùng sai ảnh vẫn báo xanh, tệp cụt phục hồi với mã 0, --list nói dối, vai trò thiếu trên máy mới, bảng nhỏ không bao giờ được analyze, seed xoá tiến độ qua CASCADE, VPS bị chiếm xoá bản sao lưu, xoay vòng xoá bản tốt, và một job sao lưu chết câm 62 ngày.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.6</span>
<h2>Quiz: backups and restore</h2>
<p class="lead">Ten situations from a chapter where every tool behaves as documented and the result can still be a database missing rows, tables or logins. Each explanation says why the right answer is right and why the most tempting wrong one is wrong.</p>
<div class="callout">
<p><strong>What this chapter established.</strong> On a 192 MB database, <code>pg_dump</code> took 1,165 ms as plain SQL at 128.9 MB, 2,379 ms as custom at 21.0 MB, and gzipping the plain dump afterwards produced the same size more slowly (10.1). Restoring took two to three times longer than dumping — 3,431 ms from plain, 3,274 single-threaded from custom, and <strong>2,123 ms with <code>-j4</code></strong>, a flag plain SQL cannot use; and skipping <code>ANALYZE</code> left the planner estimating <strong>834</strong> rows instead of 124,946, choosing a nested loop over a hash join and running the same query 2.5× slower (10.2). Given a disk too small, <code>pg_dump</code> exited 1 and left a plausible 51 MB file; restoring it with <code>psql</code> exited <strong>0</strong> and left a 400,170-row table <em>empty</em>, while <code>pg_restore --list</code> also exited 0 on a truncated archive because the table of contents sits at the front — <code>ON_ERROR_STOP=1</code> turned the lie into exit 3 (10.3). A verify script that restores into a temporary database and compares per-table row counts against the source took <strong>4,688 ms</strong>, passed the good backup and rejected the broken one with exit 2; encrypting the 21 MB dump cost 58 ms (10.4). And a dump contained <code>GRANT … TO ung_dung</code> but no <code>CREATE ROLE</code>, so restoring onto a fresh machine returned all 400,170 rows, exited 1 with "errors ignored on restore", and left an application that could not log in (10.5).</p>
</div>
<h3>Self-check before you start</h3>
<ul>
<li>I can choose a <code>pg_dump</code> format and compression and say what the restore machine needs to read it.</li>
<li>I can time a full restore onto a new machine and state RTO and RPO as numbers.</li>
<li>I can explain why exit codes, file sizes and <code>pg_restore --list</code> do not prove a backup works.</li>
<li>I can run a test restore on another machine, in production&#39;s image, against a manifest.</li>
<li>I can list what a database dump does not contain and back up roles and Docker volumes.</li>
<li>I can keep an encrypted copy off the machine that the server cannot delete, and rotate it safely.</li>
</ul>
${slide('dv-10', 30, 'Bảng tra nhanh Chương 10')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.6</span>
<h2>Quiz: sao lưu và phục hồi</h2>
<p class="lead">Mười tình huống từ một chương mà mọi công cụ đều hành xử đúng như tài liệu, và kết quả vẫn có thể là một cơ sở dữ liệu thiếu dòng, thiếu bảng hoặc không đăng nhập được. Mỗi lời giải thích nói vì sao đáp án đúng là đúng và vì sao phương án sai hấp dẫn nhất lại sai.</p>
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> Trên một cơ sở dữ liệu 192 MB, <code>pg_dump</code> mất 1.165 ms ở dạng SQL thuần với 128,9 MB, 2.379 ms ở dạng custom với 21,0 MB, và nén gzip bản plain sau đó cho ra cùng kích thước một cách chậm hơn (10.1). Phục hồi tốn gấp hai tới ba lần dump — 3.431 ms từ plain, 3.274 một luồng từ custom, và <strong>2.123 ms với <code>-j4</code></strong>, cái cờ mà SQL thuần không dùng được; còn bỏ qua <code>ANALYZE</code> để bộ lập kế hoạch ước lượng <strong>834</strong> dòng thay vì 124.946, chọn nested loop thay vì hash join và chạy cùng truy vấn chậm hơn 2,5 lần (10.2). Với một cái đĩa quá nhỏ, <code>pg_dump</code> thoát 1 và để lại một tệp 51 MB trông hợp lý; phục hồi nó bằng <code>psql</code> thoát <strong>0</strong> và để lại một bảng 400.170 dòng <em>RỖNG</em>, còn <code>pg_restore --list</code> cũng thoát 0 trên một kho lưu bị cắt vì mục lục nằm ở đầu — <code>ON_ERROR_STOP=1</code> biến lời nói dối thành mã thoát 3 (10.3). Một script kiểm chứng phục hồi vào cơ sở dữ liệu tạm rồi đối chiếu số dòng từng bảng với nguồn mất <strong>4.688 ms</strong>, chấp nhận bản tốt và từ chối bản hỏng với mã thoát 2; mã hoá bản dump 21 MB tốn 58 ms (10.4). Và một bản dump chứa <code>GRANT … TO ung_dung</code> mà không có <code>CREATE ROLE</code>, nên phục hồi lên một máy mới trả về đủ 400.170 dòng, thoát 1 kèm "errors ignored on restore", và để lại một ứng dụng không đăng nhập được (10.5).</p>
</div>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi chọn được định dạng và kiểu nén của <code>pg_dump</code> và nói được máy phục hồi cần gì để đọc nó.</li>
<li>Tôi bấm giờ được một cú phục hồi trọn vẹn sang máy mới và phát biểu RTO, RPO bằng con số.</li>
<li>Tôi giải thích được vì sao mã thoát, kích thước tệp và <code>pg_restore --list</code> không chứng minh được bản sao lưu dùng được.</li>
<li>Tôi chạy được một lần phục hồi thử ở máy khác, bằng đúng ảnh của production, đối chiếu với bản kê.</li>
<li>Tôi liệt kê được những gì một bản dump không chứa, và sao lưu được vai trò cùng volume Docker.</li>
<li>Tôi giữ được một bản đã mã hoá ở ngoài máy mà máy chủ không xoá được, và xoay vòng nó an toàn.</li>
</ul>
${slide('dv-10', 30, 'Bảng tra nhanh Chương 10')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'The backup cron line is "docker exec -it pg pg_dump -U postgres -Fc app > /srv/app.dump". Every night it exits 0 and the file is about the right size. On the day you need it, pg_restore crashes with "Segmentation fault" (exit 139). What happened?|||Dòng cron sao lưu là "docker exec -it pg pg_dump -U postgres -Fc app > /srv/app.dump". Đêm nào nó cũng thoát 0 và tệp có kích thước gần đúng. Đúng ngày cần, pg_restore sập với "Segmentation fault" (mã 139). Chuyện gì đã xảy ra?',
            options: [
              '-t gave pg_dump a pseudo-terminal, which rewrote every newline byte of the binary archive as CR+LF; the file was corrupted as it was written|||-t cấp cho pg_dump một terminal ảo, thứ đổi mọi byte xuống dòng trong kho lưu nhị phân thành CR+LF; tệp đã hỏng ngay lúc được ghi',
              'pg_restore on the host is older than the server that made the dump|||pg_restore trên máy chủ cũ hơn máy chủ đã tạo bản dump',
              'The custom format cannot be written through a shell redirect; it needs -f|||Định dạng custom không ghi qua chuyển hướng của shell được; nó bắt buộc phải có -f',
              'The disk was full, so the dump was truncated at the end|||Đĩa đầy nên bản dump bị cụt ở đoạn cuối',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Measured in 10.1: the same dump with -t was 47,828 bytes larger, both docker exec commands exited 0, and pg_restore --list crashed with exit 139. A pseudo-terminal translates newlines — harmless when typing, fatal for binary output. An old pg_restore gives a clear "unsupported version" error instead, and a full disk makes pg_dump exit 1; a redirect is fine as long as no TTY is involved.|||VI: Đo ở 10.1: cùng bản dump có -t to hơn 47.828 byte, cả hai lệnh docker exec thoát 0, và pg_restore --list sập với mã 139. Terminal ảo dịch byte xuống dòng — vô hại khi gõ phím, chết người với đầu ra nhị phân. pg_restore cũ sẽ báo lỗi rõ ràng "unsupported version", còn đĩa đầy làm pg_dump thoát 1; chuyển hướng bằng shell vẫn ổn miễn không có TTY.',
          },
          {
            question: 'Production runs pgvector. The nightly test restore starts a postgres:16 container, restores the backup, and prints "✅ restorable". pg_restore’s log ends with "errors ignored on restore: 7". What is the most accurate conclusion?|||Production chạy pgvector. Job phục hồi thử hằng đêm dựng một container postgres:16, phục hồi bản sao lưu và in "✅ phục hồi được". Log của pg_restore kết thúc bằng "errors ignored on restore: 7". Kết luận chính xác nhất là gì?',
            options: [
              'The backup is corrupt and must be taken again|||Bản sao lưu bị hỏng và phải làm lại',
              'The ✅ is meaningless: the extension could not be created, so every table with a vector column is missing; test in production’s exact image and derive the verdict from a manifest|||Dấu ✅ vô nghĩa: phần mở rộng không tạo được, nên mọi bảng có cột vector đều thiếu; hãy thử bằng đúng ảnh của production và rút kết luận từ bản kê',
              'Seven ignored errors are normal on a different machine; the data is complete|||Bảy lỗi bị bỏ qua là bình thường trên máy khác; dữ liệu vẫn đầy đủ',
              'The roles are missing; replaying pg_dumpall --roles-only will fix it|||Thiếu vai trò; chạy lại pg_dumpall --roles-only là xong',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Measured in 10.4: on plain postgres:16, CREATE EXTENSION vector failed, the vector table was THIEU, 7 of 8 tables matched, and pg_restore exited 1 with 7 error lines. On the real site the same mistake hid 2 tables and 26,778 rows behind a fixed ✅. The backup itself was fine — "the backup is corrupt" is the tempting wrong answer; roles cause a different, single GRANT error.|||VI: Đo ở 10.4: trên postgres:16 trơn, CREATE EXTENSION vector hỏng, bảng vector THIEU, 7/8 bảng khớp, và pg_restore thoát 1 kèm 7 dòng lỗi. Trên website thật cùng sai lầm ấy giấu 2 bảng và 26.778 dòng sau một dấu ✅ cố định. Bản sao lưu KHÔNG hỏng — "bản sao lưu hỏng" là đáp án sai hấp dẫn; thiếu vai trò gây một kiểu lỗi khác, chỉ ở câu GRANT.',
          },
          {
            question: 'A plain SQL dump was written to a disk that filled up. You restore it with psql -v ON_ERROR_STOP=1: exit 0, no errors. The largest table has 141,090 of its 400,170 rows and the database has no indexes. How is that possible?|||Một bản dump SQL thuần được ghi vào một đĩa bị đầy. Bạn phục hồi nó bằng psql -v ON_ERROR_STOP=1: mã 0, không lỗi. Bảng lớn nhất có 141.090 trên 400.170 dòng và cơ sở dữ liệu không có chỉ mục nào. Sao lại thế được?',
            options: [
              'ON_ERROR_STOP only works with the custom format|||ON_ERROR_STOP chỉ chạy với định dạng custom',
              'psql skipped the rows that failed and committed the rest|||psql bỏ qua các dòng hỏng và chốt phần còn lại',
              'The file ended cleanly between two rows of a COPY block; psql treats end of file as end of data, so there was no error to stop at, and the indexes written at the end of the dump never ran|||Tệp kết thúc gọn giữa hai dòng của một khối COPY; psql coi hết tệp là hết dữ liệu, nên chẳng có lỗi nào để dừng, và phần chỉ mục ghi ở cuối bản dump không bao giờ được chạy',
              'The table was being written to while pg_dump ran, so later rows were excluded|||Bảng đang được ghi trong lúc pg_dump chạy, nên các dòng sau bị loại ra',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Re-measured in 10.3: the last bytes were "141090\\t8a62ffc2c8d6c376", a valid two-column row cut short, so COPY succeeded and 0 of 12 indexes existed. ON_ERROR_STOP stops only at an error; the older measurement, cut mid-row, did produce one. psql does not skip failed rows — a failed COPY rolls back the whole table — and the snapshot excludes rows committed during the dump, not 259,000 old ones.|||VI: Đo lại ở 10.3: mấy byte cuối là "141090\\t8a62ffc2c8d6c376", một dòng hai cột hợp lệ bị cắt ngắn, nên COPY thành công và có 0/12 chỉ mục. ON_ERROR_STOP chỉ dừng ở một LỖI; lần đo cũ cắt giữa dòng thì có lỗi. psql không bỏ qua từng dòng hỏng — COPY hỏng thì cuộn lại cả bảng — còn ảnh chụp chỉ loại những dòng chốt TRONG lúc dump, không phải 259.000 dòng cũ.',
          },
          {
            question: 'To check backups cheaply, a teammate runs "pg_restore --list latest.dump > /dev/null && echo OK" every night. On a custom dump that was cut in half by a full disk, what does it print, and why?|||Để kiểm bản sao lưu cho rẻ, một bạn chạy "pg_restore --list latest.dump > /dev/null && echo OK" mỗi đêm. Trên một bản dump custom bị đĩa đầy cắt mất một nửa, nó in gì, và vì sao?',
            options: [
              'Nothing: pg_restore detects the truncation and exits 1|||Không in gì: pg_restore phát hiện chỗ cắt và thoát 1',
              'Nothing: --list verifies the checksum of every data block|||Không in gì: --list kiểm mã băm của từng khối dữ liệu',
              'OK only if the missing half contained no table data|||OK chỉ khi nửa bị mất không chứa dữ liệu bảng nào',
              'OK: the table of contents sits at the front of the archive, so listing it succeeds whatever happened to the data behind it|||OK: mục lục nằm ở đầu kho lưu, nên liệt kê nó thành công bất kể dữ liệu phía sau ra sao',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Measured twice in this chapter: on a 6 MB piece of a 13 MB dump, --list exited 0 and listed all 8 TABLE DATA entries including lon, while pg_restore -d on the same file exited 1 with "end of file". The tempting answer confuses the two commands: a real restore reads the data and notices; --list never reads it. There is no per-block checksum check in --list.|||VI: Đo hai lần trong chương: trên 6 MB của một bản dump 13 MB, --list thoát 0 và liệt kê đủ 8 mục TABLE DATA kể cả lon, trong khi pg_restore -d trên cùng tệp thoát 1 với "end of file". Đáp án hấp dẫn lẫn hai lệnh với nhau: phục hồi thật thì ĐỌC dữ liệu nên nhận ra; --list không bao giờ đọc nó. --list không hề kiểm mã băm từng khối.',
          },
          {
            question: 'After restoring onto a brand-new VPS, every row is back, but the backend logs "password authentication failed for user app_user". The .env password is unchanged. What is missing?|||Sau khi phục hồi lên một VPS mới tinh, mọi dòng đã về, nhưng backend ghi log "password authentication failed for user app_user". Mật khẩu trong .env không đổi. Thiếu cái gì?',
            options: [
              'The role itself: roles live at the cluster level, so pg_dump saved only the GRANTs; restore pg_dumpall --roles-only before the database|||Chính vai trò: vai trò sống ở mức cụm, nên pg_dump chỉ lưu các câu GRANT; hãy phục hồi pg_dumpall --roles-only TRƯỚC cơ sở dữ liệu',
              'The pg_hba.conf file, which pg_dump does not include|||Tệp pg_hba.conf, thứ pg_dump không kèm theo',
              'ANALYZE, because authentication uses statistics|||ANALYZE, vì việc xác thực dùng thống kê',
              'The password hash changed format between machines; reset the password|||Mã băm mật khẩu đổi định dạng giữa hai máy; hãy đặt lại mật khẩu',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Measured in 10.5 on a fresh machine: the restore printed role "ung_dung" does not exist, "errors ignored on restore: 1", lon=400170 — and logging in as ung_dung failed with exactly "password authentication failed", because PostgreSQL does not reveal whether a role exists. That message sends people to the .env; resetting the password would mean creating the role by hand without its original grants. pg_hba.conf matters too, but it would give a different "no pg_hba.conf entry" error.|||VI: Đo ở 10.5 trên một máy mới: cú phục hồi in role "ung_dung" does not exist, "errors ignored on restore: 1", lon=400170 — và đăng nhập bằng ung_dung hỏng với đúng "password authentication failed", vì PostgreSQL không tiết lộ vai trò có tồn tại hay không. Thông báo đó đẩy người ta đi soi .env; đặt lại mật khẩu nghĩa là tự tạo vai trò bằng tay mà thiếu các quyền gốc. pg_hba.conf cũng quan trọng, nhưng nó cho một lỗi khác: "no pg_hba.conf entry".',
          },
          {
            question: 'You restored at 09:00 with autovacuum on and did not run ANALYZE. At 11:00 the plans for queries joining the 6-row "plans" table are still based on default guesses. Why?|||Bạn phục hồi lúc 09:00 với autovacuum bật và không chạy ANALYZE. Tới 11:00, kế hoạch của các truy vấn có join bảng "plans" 6 dòng vẫn dựa trên ước lượng mặc định. Vì sao?',
            options: [
              'autovacuum is disabled for the first hours after a restore|||autovacuum bị tắt trong vài giờ đầu sau khi phục hồi',
              'pg_restore marked the table as already analysed|||pg_restore đánh dấu bảng là đã được analyze',
              'Small tables are served from cache and never need statistics|||Bảng nhỏ được phục vụ từ bộ đệm nên không bao giờ cần thống kê',
              'autovacuum analyses a table only after 50 rows plus 10% have changed; 6 rows never reach the threshold, so it is never analysed — run ANALYZE yourself after every restore|||autovacuum chỉ analyze một bảng sau khi 50 dòng cộng 10% đã đổi; 6 dòng không bao giờ tới ngưỡng, nên nó không bao giờ được analyze — hãy tự chạy ANALYZE sau mỗi cú phục hồi',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Measured in 10.2: with autovacuum on, 7 of 8 tables were analysed about 20 s after the restore; nguoi_dung with 6 rows stayed un-analysed after 149 s with n_mod_since_analyze = 6, below autovacuum_analyze_threshold (50). autovacuum is not paused after a restore, and pg_restore never runs or fakes ANALYZE. Small lookup tables appear in many joins, so their estimates matter.|||VI: Đo ở 10.2: với autovacuum bật, 7/8 bảng được analyze khoảng 20 s sau cú phục hồi; nguoi_dung 6 dòng vẫn chưa được analyze sau 149 s với n_mod_since_analyze = 6, dưới autovacuum_analyze_threshold (50). autovacuum không bị tạm dừng sau phục hồi, và pg_restore không bao giờ chạy hay giả ANALYZE. Bảng tra cứu nhỏ có mặt trong rất nhiều phép join nên ước lượng của nó quan trọng.',
          },
          {
            question: 'At 14:20 a seed script deleted and recreated the "lessons" table; "progress" references it with ON DELETE CASCADE, so every student is at 0%. You have last night’s custom dump. What is the safest recovery?|||Lúc 14:20 một script seed xoá rồi tạo lại bảng "lessons"; bảng "progress" trỏ vào nó với ON DELETE CASCADE, nên mọi sinh viên về 0%. Bạn có bản dump custom đêm qua. Cách phục hồi an toàn nhất là gì?',
            options: [
              'pg_restore --clean the whole dump over production so everything matches again|||pg_restore --clean cả bản dump đè lên production để mọi thứ khớp lại',
              'pg_restore -t progress straight into production; the ids will line up|||pg_restore -t progress thẳng vào production; các id sẽ tự khớp',
              'Restore lessons and progress into a temporary database, export progress joined to the lesson slug, and insert it into production by slug in one transaction|||Phục hồi lessons và progress vào một CSDL tạm, xuất progress nối theo slug của bài, rồi chèn vào production theo slug trong một giao dịch',
              'Re-run the seed with --force so the cascade is reversed|||Chạy lại seed với --force để cú xoá dây chuyền được đảo ngược',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Measured in 10.2: tien_do went 320 → 0 after the seed and back to 320 with exactly this procedure (COPY 320, INSERT 0 320). The seed created new ids, so progress must be matched by the natural key; restoring -t into production collides with the live table and the ids no longer match. Restoring the whole dump over production would also wipe every change since 03:15 — turning one lost table into a lost day.|||VI: Đo ở 10.2: tien_do đi từ 320 về 0 sau seed và trở lại 320 bằng đúng quy trình này (COPY 320, INSERT 0 320). Seed đã tạo id mới, nên tiến độ phải khớp theo khoá tự nhiên; phục hồi -t thẳng vào production đụng bảng đang sống và id không còn khớp. Phục hồi cả bản dump đè production còn xoá luôn mọi thay đổi từ 03:15 — biến một bảng bị mất thành một ngày bị mất.',
          },
          {
            question: 'An attacker got root on the VPS, deleted ~/backups, then used the S3 credentials in the backup script to delete the backup bucket. Which design would have kept a usable copy?|||Một kẻ tấn công lấy được quyền root trên VPS, xoá ~/backups, rồi dùng thông tin đăng nhập S3 trong script sao lưu để xoá luôn bucket sao lưu. Thiết kế nào lẽ ra đã giữ được một bản dùng được?',
            options: [
              'Encrypting the backups with a passphrase stored on the VPS|||Mã hoá bản sao lưu bằng một mật khẩu cất trên VPS',
              'Keeping 30 daily copies instead of 7 in ~/backups|||Giữ 30 bản hằng ngày thay vì 7 trong ~/backups',
              'Using rclone sync instead of rclone copy|||Dùng rclone sync thay vì rclone copy',
              'A separate machine that PULLS backups with a forced-command, restricted key (and, if pushing, a write-only key with lifecycle set by the provider), so nothing on the VPS can delete the off-site copies|||Một máy riêng KÉO bản sao lưu bằng khoá có lệnh ép buộc và restrict (và nếu phải đẩy thì dùng khoá chỉ-ghi, vòng đời do nhà cung cấp đặt), để không gì trên VPS xoá được các bản ngoài máy',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: 10.7 measured the pull key: it could list and fetch, while "rm -rf ~/sao-luu", a path escape, a shell and a port forward were all refused. More copies on the same VPS die with it; a passphrase on the VPS protects nothing from its root user; and rclone sync is worse, because it propagates deletions to the destination.|||VI: 10.7 đã đo khoá kéo: nó liệt kê và lấy được, còn "rm -rf ~/sao-luu", thoát đường dẫn, xin shell và chuyển tiếp cổng đều bị từ chối. Nhiều bản hơn trên cùng VPS thì chết cùng VPS; mật khẩu nằm trên VPS chẳng bảo vệ gì trước root của nó; còn rclone sync tệ hơn, vì nó lan cả việc XOÁ sang đích.',
          },
          {
            question: 'Rotation is "ls -1t *.dump | tail -n +8 | xargs rm". For eight nights pg_dump failed and left 0-byte files; nobody noticed. What is in the directory now?|||Xoay vòng là "ls -1t *.dump | tail -n +8 | xargs rm". Tám đêm liền pg_dump hỏng và để lại tệp 0 byte; không ai để ý. Giờ trong thư mục có gì?',
            options: [
              'Seven good backups, because rm skips empty files|||Bảy bản tốt, vì rm bỏ qua tệp rỗng',
              'Seven empty files: the rotation kept the newest seven and deleted every good backup; rotate only verified backups and alarm on the age of the newest good one|||Bảy tệp rỗng: xoay vòng giữ bảy bản mới nhất và xoá mọi bản tốt; chỉ xoay vòng những bản đã kiểm đạt và báo động theo tuổi của bản tốt mới nhất',
              'Eight empty files and the last good backup|||Tám tệp rỗng và bản tốt cuối cùng',
              'Nothing: the rotation fails when files are empty|||Không gì cả: xoay vòng hỏng khi gặp tệp rỗng',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Measured in 10.7: 18 files, the newest 8 empty; after the command, ls showed seven 0-byte files from 23/09 to 29/09. The rotation did exactly what it was written to do. rm does not look at sizes, and "keep the newest N" keeps the newest N — seven, not eight. The age alarm of 10.4 with its size check would have fired on the first empty night.|||VI: Đo ở 10.7: 18 tệp, 8 tệp mới nhất rỗng; sau lệnh, ls cho thấy bảy tệp 0 byte từ 23/09 tới 29/09. Xoay vòng làm đúng như nó được viết. rm không nhìn kích thước, và "giữ N bản mới nhất" giữ đúng N — bảy, không phải tám. Báo động theo tuổi của 10.4 cùng phép kiểm kích thước lẽ ra đã nổ ngay đêm rỗng đầu tiên.',
          },
          {
            question: 'A cron line on the VPS called verify-backup.sh every night at 02:05. The file did not exist, and for 62 days nobody knew. Which check would have caught it on the first night?|||Một dòng cron trên VPS gọi verify-backup.sh mỗi đêm lúc 02:05. Tệp đó không tồn tại, và suốt 62 ngày không ai biết. Phép kiểm nào lẽ ra đã bắt được nó ngay đêm đầu?',
            options: [
              'An alarm on ANOTHER machine that fires when the newest successfully verified backup is older than ~26 hours — alerting on the absence of success|||Một cái báo động ở máy KHÁC nổ khi bản sao lưu đã kiểm đạt mới nhất cũ hơn ~26 giờ — báo động khi VẮNG MẶT thành công',
              'Adding set -euo pipefail to verify-backup.sh|||Thêm set -euo pipefail vào verify-backup.sh',
              'Running pg_restore --list on every backup|||Chạy pg_restore --list trên mọi bản sao lưu',
              'Writing a sha256 file next to every backup|||Ghi một tệp sha256 cạnh mọi bản sao lưu',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Every check inside the script fires only if the script runs; this one never ran, so set -e, --list and checksums inside it could not help. Cron wrote "not found" to a log nobody read. Only a check that expects a success and alarms when it is missing — run from a different machine, like canh-tuoi.sh measured in 10.4 (exit 1 at 31 hours, exit 2 with no backups) — notices that nothing happened.|||VI: Mọi phép kiểm BÊN TRONG script chỉ nổ nếu script chạy; cái này chưa từng chạy, nên set -e, --list hay mã băm trong nó đều vô dụng. Cron ghi "not found" vào một cuốn log không ai đọc. Chỉ một phép kiểm CHỜ một thành công và báo động khi nó vắng mặt — chạy từ một máy khác, như canh-tuoi.sh đo ở 10.4 (thoát 1 ở 31 giờ, thoát 2 khi không có bản nào) — mới nhận ra là chẳng có gì xảy ra.',
          },
        ],
      },
    },
  ],
};
