const REF = '?ref=%2Fcourses%2Fdeploy-vps%2Flearn&reflabel=Deploy%20VPS';
/**
 * Deploy VPS — Chương 10: Sao lưu và phục hồi.
 * Mọi số đo là ĐO THẬT trên PostgreSQL 16.13 ở /tmp/pgdata cổng 5433, cơ sở
 * dữ liệu 192 MB (bảng lon 400.170 dòng / 124 MB, bf 300.000 dòng, kh 200.000
 * dòng), và hai hệ tệp ext4 loopback cố tình làm nhỏ để pg_dump chạm ENOSPC
 * giữa chừng.
 */

export default {
  title: 'Chapter 10 — Backups, and the restore nobody timed|||Chương 10 — Sao lưu, và cú phục hồi không ai bấm giờ',
  slug: 'deploy-ch10-sao-luu',
  description: 'Sao lưu mất 1,2 tới 2,4 giây. Phục hồi mất 2,1 tới 3,4. Đó là phần dễ. Phần khó: một bản sao lưu HỎNG mà psql phục hồi với mã thoát 0 rồi để lại một bảng 400.170 dòng RỖNG — và pg_restore --list vẫn nói nó ổn.',
  sortOrder: 11,
  lessons: [

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
<div class="out">  gzip -6: 128.9 MB → 21.1 MB (ti le 6.1x) trong 2433 ms</div>

<p>Identical final size to <code>-Fc</code>, and slower overall: 1,165 + 2,433 = 3,598 ms against 2,379. If you want a compressed backup, let <code>pg_dump</code> do it. The reason to keep plain SQL is that you can read it — genuinely useful when you need one table, or one row, or to see exactly what the schema was on some date.</p>

<div class="callout ok">
<p><strong>The default worth adopting.</strong> <code>pg_dump -Fc</code>, one file, compressed, with a table of contents. It restores in parallel, it restores selectively, and it is 21 MB instead of 129. Keep a plain dump too if you like reading them, but the one your restore procedure points at should be the custom one.</p>
</div>

<h3>What the dump is and is not consistent with</h3>
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

<h3>Sources</h3>
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
<div class="out">  gzip -6: 128.9 MB → 21.1 MB (ti le 6.1x) trong 2433 ms</div>

<p>Kích thước cuối y hệt <code>-Fc</code>, và chậm hơn về tổng: 1.165 + 2.433 = 3.598 ms so với 2.379. Nếu bạn muốn một bản sao lưu đã nén, hãy để <code>pg_dump</code> làm. Lý do để giữ SQL thuần là bạn ĐỌC được nó — thật sự hữu dụng khi bạn cần một bảng, hay một dòng, hay muốn xem lược đồ CHÍNH XÁC hồi ngày nào đó là gì.</p>

<div class="callout ok">
<p><strong>Mặc định đáng chọn.</strong> <code>pg_dump -Fc</code>, một tệp, đã nén, có mục lục. Nó phục hồi song song được, phục hồi chọn lọc được, và nó là 21 MB thay vì 129. Cứ giữ thêm một bản plain nếu bạn thích đọc, nhưng cái mà quy trình phục hồi của bạn TRỎ VÀO nên là bản custom.</p>
</div>

<h3>Bản dump nhất quán với cái gì và KHÔNG nhất quán với cái gì</h3>
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

<h3>Nguồn</h3>
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
<p>What an actual recovery looks like — decompress, restore, and the step everybody forgets:</p>

<div class="out">  giai nen : 868 ms
  phuc hoi : 3170 ms
  analyze  : 399 ms   ← quen buoc nay thi CSDL cham hang gio sau do
  TONG     : 4437 ms</div>

<h3>Proving the ANALYZE claim</h3>
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

<h3>Sources</h3>
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
<p>Một cú phục hồi thật trông thế nào — giải nén, phục hồi, và cái bước ai cũng quên:</p>

<div class="out">  giai nen : 868 ms
  phuc hoi : 3170 ms
  analyze  : 399 ms   ← quen buoc nay thi CSDL cham hang gio sau do
  TONG     : 4437 ms</div>

<h3>Chứng minh cái khẳng định về ANALYZE</h3>
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

<h3>Nguồn</h3>
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
<div class="kv-grid">
<div class="kv"><span class="k">after every backup</span><span class="v">the verify script. 4.7 s here — if it is minutes on your database, run it daily instead</span></div>
<div class="kv"><span class="k">weekly</span><span class="v">restore from the <em>off-site</em> copy, decrypting it, so the key and the transfer are tested too</span></div>
<div class="kv"><span class="k">quarterly</span><span class="v">a full rehearsal on a fresh machine, timed. That number is your real RTO, and it is always larger than the database restore (10.5)</span></div>
<div class="kv"><span class="k">alert on absence</span><span class="v">no successful verification in 48 hours is an alert. A backup system that stops silently looks identical to one that works (9.4)</span></div>
</div>

<p>That last row is the one people miss. Every check in this lesson fires on failure. Nothing fires when the cron job stops running altogether — the log stays quiet, the exit codes stay 0, because nothing ran. Alerting on the <em>absence</em> of a success is what covers that, and it is the same shape as the dead-man&#39;s-switch check on your alerting pipeline in 9.4.</p>

<h3>Sources</h3>
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
<div class="kv-grid">
<div class="kv"><span class="k">sau MỖI lần sao lưu</span><span class="v">script kiểm chứng. 4,7 s ở đây — nếu trên cơ sở dữ liệu của bạn nó là hàng phút thì chạy hằng ngày thay vì thế</span></div>
<div class="kv"><span class="k">hằng tuần</span><span class="v">phục hồi từ bản <em>NGOÀI MÁY</em>, có giải mã, để cả cái khoá lẫn đường truyền cũng được kiểm</span></div>
<div class="kv"><span class="k">hằng quý</span><span class="v">một buổi diễn tập ĐẦY ĐỦ trên một cái máy mới, có bấm giờ. Con số đó là RTO thật của bạn, và nó LUÔN lớn hơn thời gian phục hồi cơ sở dữ liệu (10.5)</span></div>
<div class="kv"><span class="k">báo động khi VẮNG MẶT</span><span class="v">không có lần kiểm chứng thành công nào trong 48 giờ là một cái báo động. Một hệ sao lưu ngừng chạy ÂM THẦM trông y hệt một hệ đang chạy (9.4)</span></div>
</div>

<p>Cái dòng cuối là thứ người ta bỏ sót. Mọi phép kiểm trong bài này đều nổ khi HỎNG. Chẳng có gì nổ khi cron job ngừng chạy HẲN — cuốn log im lặng, các mã thoát vẫn là 0, vì chẳng có gì chạy cả. Báo động khi VẮNG MẶT một thành công mới che được chuyện đó, và nó cùng hình dạng với phép kiểm công-tắc-người-chết trên đường ống báo động ở bài 9.4.</p>

<h3>Nguồn</h3>
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

<h3>Sources</h3>
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

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — pg_dumpall</span><span class="lc-sub">postgresql.org/docs/current/app-pg-dumpall.html — <code>--roles-only</code> và <code>--globals-only</code>, cùng ghi chú tường minh rằng <code>pg_dump</code> KHÔNG lưu vai trò hay tablespace.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Amazon S3 — versioning và lifecycle</span><span class="lc-sub">docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html — điều tương tự áp cho Cloudflare R2; bật versioning mới là thứ làm cho tệp tải lên phục hồi được (6.4).</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google SRE Book — Managing Incidents, và Postmortem Culture</span><span class="lc-sub">sre.google/sre-book/managing-incidents/ — về việc vì sao một quy trình VIẾT RA và ĐÃ DIỄN TẬP thắng chuyên môn dưới áp lực.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Let&#39;s Encrypt — rate limits</span><span class="lc-sub">letsencrypt.org/docs/rate-limits/ — đáng đọc TRƯỚC một buổi diễn tập: xin lại chứng chỉ nhiều lần lúc tập có thể làm cạn hạn mức tuần và khiến bạn không xin được lúc cần thật.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — volume, và dữ liệu của một container THẬT SỰ nằm ở đâu</span><span class="lc-sub">/courses/docker/learn${REF} — vì sao "mọi thứ đều trong Docker" không có nghĩa là mọi thứ đều được sao lưu, và một tệp compose để lại những đường dẫn nào trên máy chủ.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 10.6 ─────────────────────────── */
    {
      title: '10.6 — Quiz: backups and restore|||10.6 — Quiz: sao lưu và phục hồi',
      slug: 'deploy-10-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về một cú phục hồi chậm hơn sao lưu ba lần, một truy vấn chậm 2,5 lần vì thiếu ANALYZE, một tệp 51 MB phục hồi ra một bảng rỗng với mã thoát 0, và một bản dump có câu GRANT mà không có câu CREATE ROLE.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.6</span>
<h2>Quiz: backups and restore</h2>
<p class="lead">Eight questions from the chapter where every tool behaves as documented and the result is still a database missing 400,170 rows.</p>
<div class="callout">
<p><strong>What this chapter established.</strong> On a 192 MB database, <code>pg_dump</code> took 1,165 ms as plain SQL at 128.9 MB, 2,379 ms as custom at 21.0 MB, and gzipping the plain dump afterwards produced the same size more slowly (10.1). Restoring took two to three times longer than dumping — 3,431 ms from plain, 3,274 single-threaded from custom, and <strong>2,123 ms with <code>-j4</code></strong>, a flag plain SQL cannot use; and skipping <code>ANALYZE</code> left the planner estimating <strong>834</strong> rows instead of 124,946, choosing a nested loop over a hash join and running the same query 2.5× slower (10.2). Given a disk too small, <code>pg_dump</code> exited 1 and left a plausible 51 MB file; restoring it with <code>psql</code> exited <strong>0</strong> and left a 400,170-row table <em>empty</em>, while <code>pg_restore --list</code> also exited 0 on a truncated archive because the table of contents sits at the front — <code>ON_ERROR_STOP=1</code> turned the lie into exit 3 (10.3). A verify script that restores into a temporary database and compares per-table row counts against the source took <strong>4,688 ms</strong>, passed the good backup and rejected the broken one with exit 2; encrypting the 21 MB dump cost 58 ms (10.4). And a dump contained <code>GRANT … TO ung_dung</code> but no <code>CREATE ROLE</code>, so restoring onto a fresh machine returned all 400,170 rows, exited 1 with "errors ignored on restore", and left an application that could not log in (10.5).</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.6</span>
<h2>Quiz: sao lưu và phục hồi</h2>
<p class="lead">Tám câu ra từ cái chương mà mọi công cụ đều hành xử đúng như tài liệu và kết quả vẫn là một cơ sở dữ liệu thiếu 400.170 dòng.</p>
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> Trên một cơ sở dữ liệu 192 MB, <code>pg_dump</code> mất 1.165 ms ở dạng SQL thuần với 128,9 MB, 2.379 ms ở dạng custom với 21,0 MB, và nén gzip bản plain sau đó cho ra cùng kích thước một cách chậm hơn (10.1). Phục hồi tốn gấp hai tới ba lần dump — 3.431 ms từ plain, 3.274 một luồng từ custom, và <strong>2.123 ms với <code>-j4</code></strong>, cái cờ mà SQL thuần không dùng được; còn bỏ qua <code>ANALYZE</code> để bộ lập kế hoạch ước lượng <strong>834</strong> dòng thay vì 124.946, chọn nested loop thay vì hash join và chạy cùng truy vấn chậm hơn 2,5 lần (10.2). Với một cái đĩa quá nhỏ, <code>pg_dump</code> thoát 1 và để lại một tệp 51 MB trông hợp lý; phục hồi nó bằng <code>psql</code> thoát <strong>0</strong> và để lại một bảng 400.170 dòng <em>RỖNG</em>, còn <code>pg_restore --list</code> cũng thoát 0 trên một kho lưu bị cắt vì mục lục nằm ở đầu — <code>ON_ERROR_STOP=1</code> biến lời nói dối thành mã thoát 3 (10.3). Một script kiểm chứng phục hồi vào cơ sở dữ liệu tạm rồi đối chiếu số dòng từng bảng với nguồn mất <strong>4.688 ms</strong>, chấp nhận bản tốt và từ chối bản hỏng với mã thoát 2; mã hoá bản dump 21 MB tốn 58 ms (10.4). Và một bản dump chứa <code>GRANT … TO ung_dung</code> mà không có <code>CREATE ROLE</code>, nên phục hồi lên một máy mới trả về đủ 400.170 dòng, thoát 1 kèm "errors ignored on restore", và để lại một ứng dụng không đăng nhập được (10.5).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Why is pg_dump -Fc the better default than plain SQL, even though plain is twice as fast to produce?|||Vì sao pg_dump -Fc là mặc định tốt hơn SQL thuần, dù plain tạo ra nhanh gấp đôi?',
            options: [
              'It is not; plain is faster so plain is better|||Không phải; plain nhanh hơn nên plain tốt hơn',
              'It is a sixth the size and carries a table of contents, so it can be restored in parallel with -j and selectively with -t — plain SQL is one ordered stream and can do neither|||Nó nhỏ bằng một phần sáu và mang theo MỤC LỤC, nên phục hồi song song được bằng -j và chọn lọc được bằng -t — SQL thuần là một dòng liên tục có thứ tự và không làm được cái nào',
              'Plain SQL cannot be compressed|||SQL thuần không nén được',
              'Custom format is more reliable on a full disk|||Định dạng custom đáng tin hơn khi đĩa đầy',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'Restoring took 2-3x longer than dumping the same data. Why?|||Phục hồi tốn gấp 2-3 lần so với dump cùng bộ dữ liệu. Vì sao?',
            options: [
              'Decompression is slow|||Giải nén thì chậm',
              'A restore must parse, insert and rebuild every index, and index construction is the expensive part|||Một cú phục hồi phải phân tích, chèn và DỰNG LẠI mọi chỉ mục, mà dựng chỉ mục mới là phần đắt',
              'The disk is slower for writes than reads|||Đĩa ghi chậm hơn đọc',
              'It is not; the measurement was wrong|||Không phải; phép đo bị sai',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'After a restore, the same query ran 2.5x slower until ANALYZE was run. What was the mechanism?|||Sau một cú phục hồi, cùng một truy vấn chạy chậm hơn 2,5 lần cho tới khi chạy ANALYZE. Cơ chế là gì?',
            options: [
              'The cache was cold|||Bộ đệm còn nguội',
              'With no statistics the planner estimated 834 rows and chose a nested loop; the true count was 124,946, and after ANALYZE it switched to a hash join|||Không có thống kê, bộ lập kế hoạch ước lượng 834 dòng và chọn nested loop; con số thật là 124.946, và sau ANALYZE nó đổi sang hash join',
              'Indexes had not finished building|||Các chỉ mục chưa dựng xong',
              'pg_restore leaves tables locked|||pg_restore để các bảng bị khoá',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'pg_dump hit a full disk, exited 1, and left a 51 MB file. Restoring it with psql exited 0. What was actually in the database?|||pg_dump chạm đĩa đầy, thoát 1, và để lại một tệp 51 MB. Phục hồi nó bằng psql thoát 0. Trong cơ sở dữ liệu THẬT RA có gì?',
            options: [
              'Everything, since psql reported success|||Mọi thứ, vì psql báo thành công',
              'A 400,170-row table came back completely empty, because the truncated COPY failed and rolled back while everything around it committed|||Một bảng 400.170 dòng về với con số KHÔNG, vì câu COPY bị cắt đã hỏng và cuộn lại trong khi mọi thứ quanh nó thì chốt',
              'Half the rows of every table|||Một nửa số dòng của mọi bảng',
              'Nothing; the database was empty|||Không gì cả; cơ sở dữ liệu rỗng',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'Why does pg_restore --list exit 0 on a truncated archive?|||Vì sao pg_restore --list thoát 0 trên một kho lưu bị cắt cụt?',
            options: [
              'It repairs the archive as it reads|||Nó tự sửa kho lưu trong lúc đọc',
              'The table of contents sits at the front of the file, so reading it succeeds regardless of whether the data behind it survived|||MỤC LỤC nằm ở ĐẦU tệp, nên đọc nó thành công bất kể phần dữ liệu phía sau có sống sót hay không',
              'It only checks the file size|||Nó chỉ kiểm kích thước tệp',
              'It does not; it exits 1|||Không phải; nó thoát 1',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'The verify script enumerates tables from the SOURCE database rather than from the restored copy. Why does that ordering matter?|||Script kiểm chứng liệt kê các bảng từ cơ sở dữ liệu NGUỒN chứ không phải từ bản đã phục hồi. Vì sao thứ tự đó quan trọng?',
            options: [
              'It is faster|||Nó nhanh hơn',
              'Enumerating from the restored copy would silently skip a table missing entirely, and report success because every table it found matched|||Liệt kê từ bản đã phục hồi sẽ âm thầm BỎ QUA một bảng thiếu HẲN, rồi báo thành công vì mọi bảng nó tìm thấy đều khớp',
              'The restored database has no system catalogue|||Cơ sở dữ liệu đã phục hồi không có danh mục hệ thống',
              'It avoids locking the source|||Nó tránh khoá cơ sở dữ liệu nguồn',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'A restore onto a fresh machine returned all 400,170 rows but exited 1 with "role does not exist". What was missing, and where does it live?|||Một cú phục hồi lên máy mới trả về đủ 400.170 dòng nhưng thoát 1 kèm "role does not exist". Cái gì thiếu, và nó sống ở đâu?',
            options: [
              'The data was corrupt|||Dữ liệu bị hỏng',
              'Roles live at the cluster level, above any single database, so pg_dump captures the GRANT but not the CREATE ROLE — pg_dumpall --roles-only is the missing file|||Vai trò sống ở mức CỤM, phía trên mọi cơ sở dữ liệu đơn lẻ, nên pg_dump bắt được câu GRANT mà không bắt câu CREATE ROLE — pg_dumpall --roles-only là cái tệp còn thiếu',
              'The password was wrong|||Mật khẩu bị sai',
              'The extension was not installed|||Phần mở rộng chưa được cài',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'The measured database restore took 4.4 seconds. Why is that not your RTO?|||Cú phục hồi cơ sở dữ liệu đo được mất 4,4 giây. Vì sao đó KHÔNG phải RTO của bạn?',
            options: [
              'Because the measurement excluded decompression|||Vì phép đo đã loại trừ bước giải nén',
              'Because provisioning a machine, restoring config and secrets, reissuing certificates, syncing uploaded files and waiting out DNS are all outside the dump — the database is timed precisely because it is the part somebody automated|||Vì dựng máy, phục hồi cấu hình và bí mật, xin lại chứng chỉ, đồng bộ tệp tải lên và chờ DNS đều nằm NGOÀI bản dump — cơ sở dữ liệu được bấm giờ chính vì nó là phần có người đã tự động hoá',
              'Because restores always take longer in production|||Vì phục hồi trên production lúc nào cũng lâu hơn',
              'It is your RTO, as long as the backup verified|||Nó ĐÚNG là RTO của bạn, miễn là bản sao lưu đã được kiểm chứng',
            ],
            correctIndex: 1,
            points: 10,
          },
        ],
      },
    },
  ],
};
