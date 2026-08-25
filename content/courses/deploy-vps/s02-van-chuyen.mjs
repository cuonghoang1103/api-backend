const REF = '?ref=%2Fcourses%2Fdeploy-vps%2Flearn&reflabel=Deploy%20VPS';

export default {
  title: 'Chapter 2 — Transport: getting the artifact onto the machine|||Chương 2 — Vận chuyển: đưa tạo tác lên máy',
  description: 'Ba đường đưa mã lên máy chủ, đo bằng byte, giây và bằng thứ chúng để lại khi bị cắt ngang giữa chừng. Trong đó có một thuật toán gửi 18 KB để đồng bộ một tệp 20 MB đã bị dịch chuyển toàn bộ, và một lệnh xoá sạch ảnh người dùng tải lên mà không hỏi.',
  lessons: [

    /* ─────────────────────────── 2.1 ─────────────────────────── */
    {
      title: '2.1 — rsync: the delta algorithm, and its two dangers|||2.1 — rsync: thuật toán chênh lệch, và hai mối nguy của nó',
      slug: 'deploy-2-1-rsync-va-hai-moi-nguy',
      type: 'LESSON',
      description: 'Chèn 100 byte vào ĐẦU một tệp 20 MB làm lệch mọi byte phía sau — rsync vẫn chỉ gửi 18 KB. Rồi hai phép đo cho thấy nó xoá mất ảnh người dùng, và để lại một thư mục trộn lẫn hai bản phát hành khi bị cắt ngang.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>rsync: the delta algorithm, and its two dangers</h2>
<p class="lead">rsync is the default answer for moving files to a server, and it deserves to be — the algorithm is genuinely clever. It is also the transport with the sharpest edges, and both of them are silent.</p>

<h3>The algorithm, measured</h3>
<p>A single 20 MB file, synced three times: fresh, after changing 100 bytes in the middle, and after inserting 100 bytes at the very start — which shifts every byte in the file.</p>
<div class="out">=== lan dau: 20 MB ===
  Literal data:     20,000,000 bytes
  Matched data:              0 bytes
  Total bytes sent: 20,004,983

=== doi 100 BYTE o GIUA tep 20 MB ===
  Literal data:          4,472 bytes
  Matched data:     19,995,528 bytes
  Total bytes sent:     22,466

=== CHEN 100 byte o DAU (day lech toan bo phan con lai) ===
  Literal data:            100 bytes
  Matched data:     20,000,000 bytes
  Total bytes sent:     18,099</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Changing the middle: 0.11% sent</span><span class="v">22 KB instead of 20 MB. rsync divides the destination file into blocks, and only the blocks that actually changed are sent.</span></div>
  <div class="kv"><span class="k">Inserting at the front: <em>less</em> sent</span><span class="v">18 KB, and only <strong>100 bytes</strong> of literal data — the exact size of the insertion. Every byte moved, and rsync still recognised the whole 20 MB as already present.</span></div>
  <div class="kv"><span class="k">That is the clever part</span><span class="v">A naive block comparison fails completely here: block 1 no longer matches block 1, block 2 no longer matches block 2, nothing lines up. rsync uses a <em>rolling</em> checksum that can be advanced one byte at a time, so it finds the same blocks at their new offsets.</span></div>
  <div class="kv"><span class="k">Matched data can exceed the file</span><span class="v">20,000,000 matched in a file that is now 20,000,100 bytes — every original block was found, and only the new 100 bytes had to travel.</span></div>
</div>
<div class="note-ct">This is why rsync is worth using even for a large single artifact, and why the "rsync copies everything" belief is wrong. Two caveats keep it honest: the delta only helps when a version of the file is <em>already there</em> — the first sync always sends everything — and for a compressed artifact it helps much less, because changing one source byte changes most of the compressed bytes.</div>

<h3>Danger one: <code>--delete</code> deletes</h3>
<p><code>--delete</code> is the flag that makes the destination match the source, which is what you want for a release directory. It is also indiscriminate:</p>
<div class="out">  tren VPS truoc khi deploy:
    /srv/vps/dg/tai-len/quan-trong.jpg

=== rsync --delete tu mot thu muc KHONG co tai-len/ ===
  sau deploy:
    /srv/vps/dg/app.js
    ❌ anh nguoi dung DA BI XOA</div>
<div class="pitfall"><strong>Trap — <code>--delete</code> removes anything on the server that is not in your source, including things the server created.</strong> User uploads, generated files, a SQLite database, log files. There is no confirmation and no error; the deploy reports success. This is category 3 from Lesson 1.1 — runtime state — and it is the reason that category must live <em>outside</em> the directory a deploy writes to. Without <code>--delete</code> the problem inverts: files deleted from your repository stay on the server forever, so an old route or an old asset is still being served months after it was removed.</div>
<pre><code><span class="tok-comment"># TRUOC KHI chay that: xem no SE lam gi, ma khong lam gi ca</span>
rsync -avn --delete ./ vps:/srv/app/          <span class="tok-comment"># -n = --dry-run</span>

<span class="tok-comment"># bao ve theo tung duong dan — luat nay o phia NHAN</span>
rsync -a --delete --filter='protect tai-len/***' \\
                  --filter='protect log/***' ./ vps:/srv/app/</code></pre>
<p><code>--dry-run</code> before a first real deploy is the cheapest habit in this course. It prints every file it would send and every file it would delete, and changes nothing. The <code>protect</code> filter is the belt to that braces: it marks paths the receiving side must never delete, even when they are absent from the source.</p>

<h3>Danger two: it is atomic per file, not per deploy</h3>
<p>A directory of 400 files, all on version 1. An rsync of version 2, killed six seconds in:</p>
<div class="out">=== rsync bi giet giua chung ===
  con PHIEN BAN 1:      310 tep
  da thanh PHIEN BAN 2:  90 tep
  tep tam con sot lai:    0</div>
<div class="kv-grid">
  <div class="kv"><span class="k">No partial files</span><span class="v">Zero temporary files left behind, and no file containing half of one version and half of another. rsync writes each file to a hidden temporary name and renames it into place, so a file is either fully old or fully new.</span></div>
  <div class="kv"><span class="k">But the directory is a mixture</span><span class="v">310 files from one release and 90 from another, running together. Every individual file is valid; the combination is a version that was never tested and never existed anywhere else.</span></div>
  <div class="kv"><span class="k">This is the worst failure shape</span><span class="v">Not a crash, not a syntax error. A running application where one module expects the new database column and another module still writes the old one. The bug reports make no sense because the code they describe does not exist in any commit.</span></div>
  <div class="kv"><span class="k">And it does not need a kill</span><span class="v">A dropped connection, a laptop lid closing, a CI job timing out, a network hiccup mid-deploy. Every one of them produces this state.</span></div>
</div>
<div class="callout ok"><strong>The fix is the releases layout from Lesson 0.4, and this is the strongest argument for it.</strong> rsync into a <em>new</em> directory that nothing is serving from, then move the symlink. An interrupted transfer leaves a half-populated directory that no one is using; the live release is untouched. The swap itself is one <code>rename(2)</code>, which cannot be interrupted halfway.</div>
<pre><code><span class="tok-comment"># chuyen vao thu muc MOI, dung cham vao ban dang chay</span>
BAN="/srv/app/phat-hanh/\$(date -u +%Y-%m-%d-%H%M%S)-\$(git rev-parse --short HEAD)"
rsync -a --delete --link-dest=/srv/app/hien-tai/ ./ "vps:\$BAN/"

<span class="tok-comment"># chi khi da xong, va da kiem, moi trao — mot thao tac nguyen tu</span>
ssh vps "ln -sfn '\$BAN' /srv/app/ht.moi &amp;&amp; mv -T /srv/app/ht.moi /srv/app/hien-tai"</code></pre>

<h3>The flags worth knowing</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">-a</span><span class="lz-lnote">Archive: recursive, preserves symlinks, permissions, times, group and owner. Almost always what you want, and it is <em>not</em> the default.</span></div>
  <div class="lz-layer"><span class="lz-lname">-z</span><span class="lz-lnote">Compress in transit. Worth it over a slow link, pointless over a fast one, and actively wasteful for already-compressed files.</span></div>
  <div class="lz-layer"><span class="lz-lname">-n and -i</span><span class="lz-lnote"><code>--dry-run</code> and <code>--itemize-changes</code>. Together they answer "what would this do" exactly, and cost nothing. Use them before every first-time deploy.</span></div>
  <div class="lz-layer"><span class="lz-lname">--link-dest</span><span class="lz-lnote">Hardlink unchanged files against a reference directory — Lesson 1.5 measured 4.8× less disk for five releases.</span></div>
  <div class="lz-layer"><span class="lz-lname">--chown / --chmod</span><span class="lz-lnote">Set ownership and permissions at the destination, which fixes the root-owned-files problem measured in Lesson 0.2. Needs privilege on the receiving side.</span></div>
  <div class="lz-layer"><span class="lz-lname">--inplace</span><span class="lz-lnote">Write directly into the destination file instead of a temp-and-rename. It breaks the per-file atomicity above <em>and</em> corrupts hardlinked releases. Use only when you know why you want it.</span></div>
</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">The rsync algorithm — Tridgell &amp; Mackerras, 1996</span><span class="lc-sub">rsync.samba.org/tech_report — eight pages describing the rolling checksum that produced the 100-byte result above. Unusually readable for a technical report.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">rsync(1) — FILTER RULES and --delete variants</span><span class="lc-sub">man7.org/linux/man-pages/man1/rsync.1.html — <code>protect</code>, and the difference between <code>--delete-before</code>, <code>--delete-during</code> and <code>--delete-after</code>.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — rename, temp files and atomic writes</span><span class="lc-sub">/courses/linux-bash/learn${REF} — why write-then-rename is the standard way to update a file safely, which is what rsync does per file.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — serving from a directory that is being replaced</span><span class="lc-sub">/courses/nginx/learn${REF} — what the web server does with a file that changes underneath it, and why the symlink swap is safe from its point of view.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>rsync: thuật toán chênh lệch, và hai mối nguy của nó</h2>
<p class="lead">rsync là câu trả lời mặc định cho việc chuyển tệp lên máy chủ, và nó xứng đáng như vậy — cái thuật toán thật sự thông minh. Nó cũng là đường vận chuyển có những lưỡi dao sắc nhất, và cả hai lưỡi đều CÂM.</p>

<h3>Thuật toán, đo thật</h3>
<p>Một tệp 20 MB duy nhất, đồng bộ ba lần: lần đầu, sau khi đổi 100 byte ở GIỮA, và sau khi CHÈN 100 byte vào đúng đầu tệp — việc này làm dịch chuyển MỌI byte trong tệp.</p>
<div class="out">=== lan dau: 20 MB ===
  Literal data:     20,000,000 bytes
  Matched data:              0 bytes
  Total bytes sent: 20,004,983

=== doi 100 BYTE o GIUA tep 20 MB ===
  Literal data:          4,472 bytes
  Matched data:     19,995,528 bytes
  Total bytes sent:     22,466

=== CHEN 100 byte o DAU (day lech toan bo phan con lai) ===
  Literal data:            100 bytes
  Matched data:     20,000,000 bytes
  Total bytes sent:     18,099</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Đổi ở giữa: gửi 0,11%</span><span class="v">22 KB thay vì 20 MB. rsync chia tệp ở phía đích thành các khối, và chỉ những khối thật sự thay đổi mới được gửi đi.</span></div>
  <div class="kv"><span class="k">Chèn vào đầu: gửi còn ÍT HƠN</span><span class="v">18 KB, và chỉ <strong>100 byte</strong> dữ liệu nguyên bản — đúng bằng kích thước phần chèn vào. Mọi byte đều đã dịch chuyển, mà rsync vẫn nhận ra cả 20 MB là đã có sẵn.</span></div>
  <div class="kv"><span class="k">Đó mới là chỗ thông minh</span><span class="v">Một phép so khối ngây thơ thì THẤT BẠI HOÀN TOÀN ở đây: khối 1 không còn khớp khối 1, khối 2 không còn khớp khối 2, chẳng có gì thẳng hàng. rsync dùng một mã kiểm tra kiểu CUỘN, tiến được từng byte một, nên nó tìm ra đúng những khối cũ ở vị trí mới của chúng.</span></div>
  <div class="kv"><span class="k">Dữ liệu khớp có thể LỚN HƠN cả tệp</span><span class="v">20.000.000 byte khớp trong một tệp giờ nặng 20.000.100 byte — mọi khối gốc đều được tìm thấy, và chỉ 100 byte mới phải đi qua đường truyền.</span></div>
</div>
<div class="note-ct">Đây là lý do rsync đáng dùng ngay cả với một tạo tác đơn lẻ cỡ lớn, và là lý do niềm tin "rsync chép hết" là sai. Hai điều kiện giữ cho lời này trung thực: phần chênh lệch chỉ giúp được khi ĐÃ CÓ SẴN một phiên bản của tệp ở đó — lần đồng bộ đầu tiên luôn gửi tất cả — và với một tạo tác ĐÃ NÉN thì nó giúp ít hơn nhiều, vì đổi một byte nguồn làm đổi phần lớn số byte đã nén.</div>

<h3>Mối nguy thứ nhất: <code>--delete</code> thì XOÁ THẬT</h3>
<p><code>--delete</code> là cờ làm cho phía đích khớp với phía nguồn, và đó là thứ bạn muốn cho một thư mục bản phát hành. Nó cũng không phân biệt gì cả:</p>
<div class="out">  tren VPS truoc khi deploy:
    /srv/vps/dg/tai-len/quan-trong.jpg

=== rsync --delete tu mot thu muc KHONG co tai-len/ ===
  sau deploy:
    /srv/vps/dg/app.js
    ❌ anh nguoi dung DA BI XOA</div>
<div class="pitfall"><strong>Bẫy — <code>--delete</code> gỡ bỏ bất cứ thứ gì trên máy chủ mà không có trong nguồn của bạn, kể cả những thứ do chính máy chủ tạo ra.</strong> Tệp người dùng tải lên, tệp sinh ra lúc chạy, một cơ sở dữ liệu SQLite, các tệp log. Không có xác nhận và không có lỗi; lần deploy báo thành công. Đây là loại 3 ở Bài 1.1 — trạng thái lúc chạy — và nó là lý do loại đó phải sống ở <em>NGOÀI</em> cái thư mục mà deploy ghi vào. Không có <code>--delete</code> thì vấn đề lật ngược: những tệp đã xoá khỏi kho mã của bạn sẽ nằm lại trên máy chủ MÃI MÃI, nên một tuyến cũ hay một tài nguyên cũ vẫn được phục vụ nhiều tháng sau khi bị gỡ.</div>
<pre><code><span class="tok-comment"># TRUOC KHI chay that: xem no SE lam gi, ma khong lam gi ca</span>
rsync -avn --delete ./ vps:/srv/app/          <span class="tok-comment"># -n = --dry-run</span>

<span class="tok-comment"># bao ve theo tung duong dan — luat nay o phia NHAN</span>
rsync -a --delete --filter='protect tai-len/***' \\
                  --filter='protect log/***' ./ vps:/srv/app/</code></pre>
<p><code>--dry-run</code> trước lần deploy thật đầu tiên là thói quen rẻ nhất trong cả khoá này. Nó in ra mọi tệp nó SẼ gửi và mọi tệp nó SẼ xoá, mà không đổi gì cả. Bộ lọc <code>protect</code> là cái dây lưng đi kèm quần treo: nó đánh dấu những đường dẫn mà phía nhận KHÔNG BAO GIỜ được xoá, kể cả khi chúng vắng mặt ở nguồn.</p>

<h3>Mối nguy thứ hai: nó nguyên tử theo TỪNG TỆP, không phải theo LẦN DEPLOY</h3>
<p>Một thư mục 400 tệp, tất cả đang ở phiên bản 1. Một lệnh rsync phiên bản 2, bị giết sau sáu giây:</p>
<div class="out">=== rsync bi giet giua chung ===
  con PHIEN BAN 1:      310 tep
  da thanh PHIEN BAN 2:  90 tep
  tep tam con sot lai:    0</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Không có tệp dở dang</span><span class="v">Không sót tệp tạm nào, và không tệp nào chứa nửa phiên bản này nửa phiên bản kia. rsync ghi mỗi tệp ra một cái tên tạm ẩn rồi đổi tên vào chỗ, nên một tệp hoặc là CŨ HOÀN TOÀN hoặc MỚI HOÀN TOÀN.</span></div>
  <div class="kv"><span class="k">Nhưng cả thư mục là một MỚ TRỘN</span><span class="v">310 tệp từ một bản phát hành và 90 tệp từ bản khác, chạy chung với nhau. Từng tệp riêng lẻ đều hợp lệ; cái TỔ HỢP đó là một phiên bản chưa từng được kiểm thử và chưa từng tồn tại ở đâu khác.</span></div>
  <div class="kv"><span class="k">Đây là kiểu hỏng TỆ NHẤT</span><span class="v">Không sập, không lỗi cú pháp. Một ứng dụng đang chạy mà một module trông đợi cột cơ sở dữ liệu mới còn một module khác vẫn ghi theo kiểu cũ. Các báo cáo lỗi trở nên vô nghĩa vì cái mã mà chúng mô tả KHÔNG tồn tại trong bất kỳ commit nào.</span></div>
  <div class="kv"><span class="k">Và nó không cần tới một lệnh giết</span><span class="v">Một kết nối rớt, một cái nắp laptop gập xuống, một job CI hết giờ, một cú nghẽn mạng giữa lúc deploy. Mỗi thứ trong đó đều sinh ra đúng trạng thái này.</span></div>
</div>
<div class="callout ok"><strong>Cách sửa là bố cục releases ở Bài 0.4, và đây là lý lẽ MẠNH NHẤT cho nó.</strong> rsync vào một thư mục MỚI mà chẳng ai đang phục vụ từ đó, rồi di chuyển symlink. Một lần chuyển bị cắt ngang để lại một thư mục đầy dở dang mà không ai đang dùng; bản phát hành đang sống thì không hề bị đụng tới. Bản thân bước tráo là MỘT lời gọi <code>rename(2)</code>, thứ không thể bị cắt ngang giữa chừng.</div>
<pre><code><span class="tok-comment"># chuyen vao thu muc MOI, dung cham vao ban dang chay</span>
BAN="/srv/app/phat-hanh/\$(date -u +%Y-%m-%d-%H%M%S)-\$(git rev-parse --short HEAD)"
rsync -a --delete --link-dest=/srv/app/hien-tai/ ./ "vps:\$BAN/"

<span class="tok-comment"># chi khi da xong, va da kiem, moi trao — mot thao tac nguyen tu</span>
ssh vps "ln -sfn '\$BAN' /srv/app/ht.moi &amp;&amp; mv -T /srv/app/ht.moi /srv/app/hien-tai"</code></pre>

<h3>Những cờ đáng biết</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">-a</span><span class="lz-lnote">Archive: đệ quy, giữ liên kết mềm, quyền, thời gian, nhóm và chủ sở hữu. Gần như luôn là thứ bạn muốn, và nó KHÔNG phải mặc định.</span></div>
  <div class="lz-layer"><span class="lz-lname">-z</span><span class="lz-lnote">Nén trên đường truyền. Đáng giá qua một đường chậm, vô nghĩa qua một đường nhanh, và LÃNG PHÍ thật sự với những tệp vốn đã nén.</span></div>
  <div class="lz-layer"><span class="lz-lname">-n và -i</span><span class="lz-lnote"><code>--dry-run</code> và <code>--itemize-changes</code>. Ghép lại chúng trả lời chính xác câu "cái này sẽ làm gì", và chẳng tốn gì. Dùng chúng trước mọi lần deploy đầu tiên.</span></div>
  <div class="lz-layer"><span class="lz-lname">--link-dest</span><span class="lz-lnote">Liên kết cứng những tệp không đổi so với một thư mục tham chiếu — Bài 1.5 đo được ít hơn 4,8 lần dung lượng đĩa cho năm bản phát hành.</span></div>
  <div class="lz-layer"><span class="lz-lname">--chown / --chmod</span><span class="lz-lnote">Đặt chủ sở hữu và quyền ngay ở phía đích, sửa được lỗi tệp-thuộc-về-root đo ở Bài 0.2. Cần đặc quyền ở phía nhận.</span></div>
  <div class="lz-layer"><span class="lz-lname">--inplace</span><span class="lz-lnote">Ghi thẳng vào tệp đích thay vì ghi-tạm-rồi-đổi-tên. Nó PHÁ tính nguyên tử theo từng tệp ở trên <em>VÀ</em> làm hỏng các bản phát hành dùng liên kết cứng. Chỉ dùng khi bạn biết mình muốn nó để làm gì.</span></div>
</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Thuật toán rsync — Tridgell &amp; Mackerras, 1996</span><span class="lc-sub">rsync.samba.org/tech_report — tám trang mô tả cái mã kiểm tra kiểu cuộn đã sinh ra kết quả 100 byte ở trên. Dễ đọc một cách khác thường so với một báo cáo kỹ thuật.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">rsync(1) — mục FILTER RULES và các biến thể của --delete</span><span class="lc-sub">man7.org/linux/man-pages/man1/rsync.1.html — <code>protect</code>, và khác biệt giữa <code>--delete-before</code>, <code>--delete-during</code> và <code>--delete-after</code>.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — rename, tệp tạm và ghi nguyên tử</span><span class="lc-sub">/courses/linux-bash/learn${REF} — vì sao ghi-rồi-đổi-tên là cách chuẩn để cập nhật một tệp an toàn, và đó chính là thứ rsync làm với từng tệp.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — phục vụ từ một thư mục đang bị thay thế</span><span class="lc-sub">/courses/nginx/learn${REF} — máy chủ web làm gì với một tệp đang đổi ngay dưới chân nó, và vì sao cú tráo symlink là an toàn dưới góc nhìn của nó.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 2.2 ─────────────────────────── */
    {
      title: '2.2 — Deploying with a git push|||2.2 — Deploy bằng một lệnh git push',
      slug: 'deploy-2-2-git-push-de-deploy',
      type: 'LESSON',
      description: 'Một kho trần trên máy chủ cộng mười lăm dòng hook, và lệnh deploy trở thành git push. Đo thật từ đầu tới cuối — kèm ba chỗ mà cách này lặng lẽ khác hẳn rsync.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Deploying with a git push</h2>
<p class="lead">Lesson 0.1 measured the reason to prefer git over rsync: a push carries only committed work, so the half-written file in your editor cannot reach production. This lesson turns that into a working deploy — a bare repository on the server, and a hook that runs when you push to it.</p>

<h3>The bare repository</h3>
<pre><code><span class="tok-comment"># tren MAY CHU</span>
git init --bare /srv/app/kho.git

<span class="tok-comment"># tren MAY BAN</span>
git remote add vps ssh://trienkhai@203.0.113.10/srv/app/kho.git
git push vps master</code></pre>
<p>A bare repository has no working tree — just the object database. It is a place to push to, and nothing runs from it. Everything below happens because of one hook file.</p>

<h3>The hook</h3>
<pre><code><span class="tok-comment">#!/bin/bash — /srv/app/kho.git/hooks/post-receive</span>
set -euo pipefail
DICH=/srv/app
while read -r cu moi ref; do
  [ "\$ref" = "refs/heads/master" ] || { echo "  [hook] bo qua \$ref"; continue; }

  BAN="\$DICH/phat-hanh/\$(date -u +%Y-%m-%d-%H%M%S)-\$(echo "\$moi" | cut -c1-7)"
  mkdir -p "\$BAN"
  git --work-tree="\$BAN" --git-dir=/srv/app/kho.git checkout -f master
  echo "  [hook] da giai nen ban \$(basename "\$BAN")"

  ln -sfn "\$BAN" "\$DICH/ht.moi" &amp;&amp; mv -T "\$DICH/ht.moi" "\$DICH/hien-tai"
  echo "  [hook] hien-tai → \$(basename "\$(readlink "\$DICH/hien-tai")")"
done</code></pre>
<p>Run against a real push:</p>
<div class="out">$ git push vps master

  [hook] da giai nen ban 2026-08-23-202418-0e8117e
  [hook] hien-tai → 2026-08-23-202418-0e8117e</div>
<div class="callout ok"><strong>That is a complete deploy in fifteen lines.</strong> It produces a timestamped release directory named after the commit (Lesson 1.4), checks the commit out into it, and swaps the symlink atomically with <code>mv -T</code> (Lesson 0.4). Anything printed by the hook is streamed back to your terminal prefixed with <code>remote:</code>, so the deploy log appears where you ran the command.</div>

<h3>Four details in that hook that are not decoration</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">It reads from stdin, in a loop</span><span class="lz-d">A <code>post-receive</code> hook is given one line per updated ref — <code>&lt;old&gt; &lt;new&gt; &lt;ref&gt;</code>. A single push can update several refs, so it is a loop, not a single read. The old and new hashes are also exactly what you need to compute what changed.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">It filters by branch</span><span class="lz-d">Without the <code>refs/heads/master</code> check, pushing <em>any</em> branch or tag deploys it. That is how a feature branch reaches production: someone typed <code>git push vps</code> without naming a branch and the default pushed everything matching.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t"><code>--work-tree</code> plus <code>checkout -f</code></span><span class="lz-d">This is how a bare repository writes files somewhere. <code>-f</code> discards whatever is in the target directory, which is safe here only because the directory is brand new. Pointing this at a shared directory would silently overwrite local changes.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Swap last, and separately</span><span class="lz-d">Extract fully, then swap. If <code>checkout</code> fails halfway the symlink still points at the previous release and the site is unaffected — the same argument as Lesson 2.1, arriving by a different transport.</span></div>
</div>

<h3>Where this differs from rsync, quietly</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Only committed work ships</span><span class="v">The advantage, measured in Lesson 0.1. It is also a constraint: you cannot deploy an experiment without committing it, which people work around by committing junk to master. Consider that a feature.</span></div>
  <div class="kv"><span class="k">The history lives on the server</span><span class="v">Lesson 0.1 measured 556 KB of bare repository against 176 KB of working tree, and it grows forever. On a large repository with binary assets that gap is the deciding factor.</span></div>
  <div class="kv"><span class="k">Untracked files simply do not exist</span><span class="v">Anything in <code>.gitignore</code> is not in the artifact — which is what you want for <code>node_modules</code> and <code>.env</code>, and is a problem if your build produces files you never committed. The hook has to build them, on the server.</span></div>
  <div class="kv"><span class="k">The hook runs as the SSH user</span><span class="v">Whatever ran <code>git push</code> decides what the hook can do. It is worth pairing with the forced-command key from Lesson 0.2 — although a hook is already a kind of forced command, since a push can only trigger the hook.</span></div>
</div>
<div class="pitfall"><strong>Trap — a hook that fails does not fail the push, unless you make it.</strong> <code>post-receive</code> runs <em>after</em> the objects have been accepted; git has already stored them and the push reports success whatever the hook does. A non-zero exit produces a warning on the client and nothing else. So a deploy that broke halfway through leaves you with a push that looked fine — the <code>set -euo pipefail</code> at the top of the hook stops the damage spreading, but it cannot undo the push. If you need to <em>reject</em> a push, that is <code>pre-receive</code>, which runs before anything is stored and whose exit code does decide the outcome.</div>

<h3>Adding the build and the verification</h3>
<pre><code>  <span class="tok-comment"># ... sau khi checkout, TRUOC khi trao symlink</span>
  cd "\$BAN"
  npm ci --omit=dev --no-audit          <span class="tok-comment"># Bai 1.3: ci, khong phai install</span>
  npm run build

  ln -sfn /srv/app/chung/.env    "\$BAN/.env"        <span class="tok-comment"># Chuong 4</span>
  ln -sfn /srv/app/chung/tai-len "\$BAN/tai-len"     <span class="tok-comment"># Bai 1.1, loai 3</span>

  ln -sfn "\$BAN" "\$DICH/ht.moi" &amp;&amp; mv -T "\$DICH/ht.moi" "\$DICH/hien-tai"
  systemctl --user restart app                       <span class="tok-comment"># Chuong 3</span>

  sleep 2
  MA=\$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/health)
  [ "\$MA" = "200" ] || { echo "  [hook] KIEM HONG (\$MA) — dang lui lai" &gt;&amp;2; exit 1; }</code></pre>
<div class="note-ct">Note the order: build first, then link the shared paths in, then swap, then restart, then verify. Every step before the swap can fail without affecting the running site. Everything after it is committed — which is why the verification at the end has to be paired with an actual rollback, not just an <code>exit 1</code>. Chapter 6 writes that part.</div>

<h3>When to choose this over rsync</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Choose git push when the artifact is source</span><span class="lz-lnote">Interpreted languages, a modest repository, one or two servers. The committed-only guarantee is worth more than the disk it costs, and the whole deploy fits in one hook you can read.</span></div>
  <div class="lz-layer"><span class="lz-lname">Choose rsync when the artifact is built</span><span class="lz-lnote">Build on a machine that has the CPU for it, ship the result. Also the answer when the repository is large, or when the server should not have the history at all.</span></div>
  <div class="lz-layer"><span class="lz-lname">Choose a registry when the artifact is an image</span><span class="lz-lnote">The runtime is part of what you are shipping, or several servers pull the same thing. Lesson 2.3.</span></div>
  <div class="lz-layer"><span class="lz-lname">Do not choose "git pull on the server"</span><span class="lz-lnote">A working clone on the server can develop local changes — an edited config, a hotfix, a merge conflict — and then a deploy fails with a message about uncommitted work on a machine nobody was editing. A bare repository plus a checkout into a fresh directory has none of that surface.</span></div>
</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">githooks(5) — post-receive, pre-receive, update</span><span class="lc-sub">git-scm.com/docs/githooks — what each hook receives on stdin and whether its exit code can reject the push.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">git-checkout(1) with --work-tree</span><span class="lc-sub">git-scm.com/docs/git-checkout — writing a commit into an arbitrary directory from a bare repository, which is the mechanism the hook depends on.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">git-push(1) — the push.default setting</span><span class="lc-sub">git-scm.com/docs/git-push — why a bare <code>git push</code> can send more branches than you intended, which is what the branch filter defends against.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub — bare repositories, refs and hooks</span><span class="lc-sub">/courses/git/learn${REF} — what a bare repository actually contains, and where hooks live.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Deploy bằng một lệnh git push</h2>
<p class="lead">Bài 0.1 đã đo lý do nên chọn git thay vì rsync: một lần push chỉ chở theo phần việc ĐÃ COMMIT, nên cái tệp viết dở trong trình soạn thảo của bạn không thể lên tới production. Bài này biến điều đó thành một quy trình deploy chạy được — một kho trần trên máy chủ, và một cái hook chạy khi bạn push vào nó.</p>

<h3>Kho trần</h3>
<pre><code><span class="tok-comment"># tren MAY CHU</span>
git init --bare /srv/app/kho.git

<span class="tok-comment"># tren MAY BAN</span>
git remote add vps ssh://trienkhai@203.0.113.10/srv/app/kho.git
git push vps master</code></pre>
<p>Một kho trần không có cây làm việc — chỉ có cơ sở dữ liệu đối tượng. Nó là một chỗ để ĐẨY VÀO, và không có gì chạy từ đó. Mọi thứ bên dưới xảy ra là nhờ MỘT tệp hook.</p>

<h3>Cái hook</h3>
<pre><code><span class="tok-comment">#!/bin/bash — /srv/app/kho.git/hooks/post-receive</span>
set -euo pipefail
DICH=/srv/app
while read -r cu moi ref; do
  [ "\$ref" = "refs/heads/master" ] || { echo "  [hook] bo qua \$ref"; continue; }

  BAN="\$DICH/phat-hanh/\$(date -u +%Y-%m-%d-%H%M%S)-\$(echo "\$moi" | cut -c1-7)"
  mkdir -p "\$BAN"
  git --work-tree="\$BAN" --git-dir=/srv/app/kho.git checkout -f master
  echo "  [hook] da giai nen ban \$(basename "\$BAN")"

  ln -sfn "\$BAN" "\$DICH/ht.moi" &amp;&amp; mv -T "\$DICH/ht.moi" "\$DICH/hien-tai"
  echo "  [hook] hien-tai → \$(basename "\$(readlink "\$DICH/hien-tai")")"
done</code></pre>
<p>Chạy thật với một lệnh push:</p>
<div class="out">$ git push vps master

  [hook] da giai nen ban 2026-08-23-202418-0e8117e
  [hook] hien-tai → 2026-08-23-202418-0e8117e</div>
<div class="callout ok"><strong>Đó là một quy trình deploy hoàn chỉnh gói trong mười lăm dòng.</strong> Nó tạo ra một thư mục bản phát hành có dấu thời gian và mang tên commit (Bài 1.4), giải nén commit đó vào trong, rồi tráo symlink một cách nguyên tử bằng <code>mv -T</code> (Bài 0.4). Bất cứ thứ gì hook in ra đều được truyền ngược về terminal của bạn kèm tiền tố <code>remote:</code>, nên log deploy hiện ra ngay chỗ bạn gõ lệnh.</div>

<h3>Bốn chi tiết trong cái hook đó không phải đồ trang trí</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Nó đọc từ stdin, trong một vòng lặp</span><span class="lz-d">Một hook <code>post-receive</code> được đưa MỘT DÒNG cho mỗi ref được cập nhật — <code>&lt;cu&gt; &lt;moi&gt; &lt;ref&gt;</code>. Một lần push có thể cập nhật nhiều ref, nên nó là vòng lặp chứ không phải một lần đọc. Hai mã băm cũ và mới cũng chính là thứ bạn cần để tính ra cái gì đã thay đổi.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Nó LỌC theo nhánh</span><span class="lz-d">Thiếu phép kiểm <code>refs/heads/master</code> thì push <em>BẤT KỲ</em> nhánh hay tag nào cũng deploy nó. Đó là cách một nhánh tính năng lên tới production: có người gõ <code>git push vps</code> mà không nêu tên nhánh và cấu hình mặc định đẩy đi mọi thứ khớp.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t"><code>--work-tree</code> cộng <code>checkout -f</code></span><span class="lz-d">Đây là cách một kho TRẦN ghi tệp ra một chỗ nào đó. Cờ <code>-f</code> vứt bỏ bất cứ thứ gì đang có trong thư mục đích, và ở đây nó an toàn CHỈ VÌ thư mục đó là hoàn toàn mới. Trỏ cái này vào một thư mục dùng chung là âm thầm ghi đè lên những thay đổi tại chỗ.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Tráo SAU CÙNG, và tách riêng</span><span class="lz-d">Giải nén cho xong, rồi mới tráo. Nếu <code>checkout</code> hỏng giữa chừng thì symlink vẫn trỏ vào bản phát hành trước và website không hề bị ảnh hưởng — đúng cái lý lẽ ở Bài 2.1, chỉ là tới bằng một đường vận chuyển khác.</span></div>
</div>

<h3>Chỗ nó khác rsync, một cách lặng lẽ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Chỉ phần việc ĐÃ COMMIT đi qua</span><span class="v">Đó là ưu điểm, đã đo ở Bài 0.1. Nó cũng là một RÀNG BUỘC: bạn không deploy được một thử nghiệm mà không commit nó, và người ta lách chuyện đó bằng cách commit rác vào master. Hãy coi ràng buộc đó là một tính năng.</span></div>
  <div class="kv"><span class="k">Lịch sử sống trên máy chủ</span><span class="v">Bài 0.1 đo được 556 KB kho trần so với 176 KB cây làm việc, và nó tăng MÃI MÃI. Với một kho lớn có tài nguyên nhị phân thì khoảng cách đó là yếu tố quyết định.</span></div>
  <div class="kv"><span class="k">Tệp không được theo dõi thì đơn giản là KHÔNG tồn tại</span><span class="v">Mọi thứ trong <code>.gitignore</code> đều không nằm trong tạo tác — đó là thứ bạn muốn với <code>node_modules</code> và <code>.env</code>, và là VẤN ĐỀ nếu bước dựng của bạn sinh ra những tệp bạn chưa từng commit. Cái hook phải tự dựng chúng, trên máy chủ.</span></div>
  <div class="kv"><span class="k">Hook chạy dưới quyền người dùng SSH</span><span class="v">Ai chạy <code>git push</code> thì người đó quyết định hook làm được gì. Đáng ghép nó với cái khoá forced-command ở Bài 0.2 — dù bản thân một cái hook đã là một dạng forced command rồi, vì một lần push chỉ kích hoạt được đúng cái hook.</span></div>
</div>
<div class="pitfall"><strong>Bẫy — một hook hỏng KHÔNG làm lần push hỏng theo, trừ khi bạn tự bắt nó phải thế.</strong> <code>post-receive</code> chạy SAU KHI các đối tượng đã được chấp nhận; git đã lưu chúng rồi và lần push báo thành công bất kể hook làm gì. Một mã thoát khác 0 chỉ sinh ra một cảnh báo ở phía client và không gì khác. Nên một lần deploy vỡ nửa chừng để lại cho bạn một lần push TRÔNG NHƯ ỔN — dòng <code>set -euo pipefail</code> ở đầu hook ngăn thiệt hại lan rộng, nhưng nó không hoàn tác được lần push. Nếu bạn cần TỪ CHỐI một lần push thì đó là <code>pre-receive</code>, hook chạy trước khi có gì được lưu và mã thoát của nó thật sự quyết định kết cục.</div>

<h3>Thêm bước dựng và bước kiểm</h3>
<pre><code>  <span class="tok-comment"># ... sau khi checkout, TRUOC khi trao symlink</span>
  cd "\$BAN"
  npm ci --omit=dev --no-audit          <span class="tok-comment"># Bai 1.3: ci, khong phai install</span>
  npm run build

  ln -sfn /srv/app/chung/.env    "\$BAN/.env"        <span class="tok-comment"># Chuong 4</span>
  ln -sfn /srv/app/chung/tai-len "\$BAN/tai-len"     <span class="tok-comment"># Bai 1.1, loai 3</span>

  ln -sfn "\$BAN" "\$DICH/ht.moi" &amp;&amp; mv -T "\$DICH/ht.moi" "\$DICH/hien-tai"
  systemctl --user restart app                       <span class="tok-comment"># Chuong 3</span>

  sleep 2
  MA=\$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/health)
  [ "\$MA" = "200" ] || { echo "  [hook] KIEM HONG (\$MA) — dang lui lai" &gt;&amp;2; exit 1; }</code></pre>
<div class="note-ct">Để ý THỨ TỰ: dựng trước, rồi liên kết các đường dẫn dùng chung vào, rồi tráo, rồi khởi động lại, rồi kiểm. Mọi bước TRƯỚC bước tráo đều có thể hỏng mà không ảnh hưởng tới website đang chạy. Mọi thứ SAU nó thì đã được cam kết — và đó là lý do phép kiểm ở cuối phải đi kèm một cú LÙI BẢN thật sự, chứ không chỉ một lệnh <code>exit 1</code>. Chương 6 viết phần đó.</div>

<h3>Khi nào chọn cách này thay vì rsync</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Chọn git push khi tạo tác là MÃ NGUỒN</span><span class="lz-lnote">Ngôn ngữ thông dịch, một kho mã cỡ vừa, một hai máy chủ. Cái bảo đảm chỉ-lấy-thứ-đã-commit đáng giá hơn phần đĩa nó tốn, và cả quy trình deploy gói gọn trong một cái hook bạn đọc hết được.</span></div>
  <div class="lz-layer"><span class="lz-lname">Chọn rsync khi tạo tác là thứ ĐÃ DỰNG</span><span class="lz-lnote">Dựng trên một cái máy có đủ CPU cho việc đó, rồi gửi kết quả đi. Cũng là câu trả lời khi kho mã lớn, hoặc khi máy chủ hoàn toàn không nên có lịch sử.</span></div>
  <div class="lz-layer"><span class="lz-lname">Chọn registry khi tạo tác là một cái ẢNH</span><span class="lz-lnote">Khi runtime cũng là một phần của thứ bạn gửi đi, hoặc khi nhiều máy chủ cùng kéo về một thứ. Bài 2.3.</span></div>
  <div class="lz-layer"><span class="lz-lname">ĐỪNG chọn "git pull trên máy chủ"</span><span class="lz-lnote">Một bản clone có cây làm việc trên máy chủ có thể mọc ra thay đổi tại chỗ — một tệp cấu hình bị sửa, một cú vá nóng, một xung đột gộp nhánh — rồi một lần deploy hỏng kèm thông báo về "thay đổi chưa commit" trên một cái máy chẳng ai ngồi soạn thảo. Một kho trần cộng một lần checkout vào thư mục mới toanh thì không có bề mặt đó.</span></div>
</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">githooks(5) — post-receive, pre-receive, update</span><span class="lc-sub">git-scm.com/docs/githooks — mỗi hook nhận gì trên stdin và mã thoát của nó có từ chối được lần push hay không.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">git-checkout(1) với --work-tree</span><span class="lc-sub">git-scm.com/docs/git-checkout — ghi một commit ra một thư mục bất kỳ từ một kho trần, chính là cơ chế mà cái hook dựa vào.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">git-push(1) — thiết lập push.default</span><span class="lc-sub">git-scm.com/docs/git-push — vì sao một lệnh <code>git push</code> trơ trọi có thể gửi đi nhiều nhánh hơn bạn định, và đó là thứ mà bộ lọc nhánh phòng ngừa.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub — kho trần, ref và hook</span><span class="lc-sub">/courses/git/learn${REF} — một kho trần thật ra chứa gì, và hook nằm ở đâu.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 2.3 ─────────────────────────── */
    {
      title: '2.3 — The artifact as a container image|||2.3 — Tạo tác là một ảnh container',
      slug: 'deploy-2-3-tao-tac-la-anh-container',
      type: 'LESSON',
      description: 'Hai ảnh 29 MB, xuất ra cùng một tệp, vẫn là 29 MB. Đo mã băm từng lớp để thấy vì sao — và vì sao đẩy phiên bản thứ hai lên registry chỉ tốn 857 byte thay vì 30 triệu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>The artifact as a container image</h2>
<p class="lead">The third transport ships the runtime along with the code. It is the path this repository uses in production, and its economics are entirely explained by one property: an image is not a file, it is a list of content-addressed layers.</p>

<h3>Two images, measured</h3>
<p>A base image, a 30 MB dependency layer, and a source layer of a few hundred bytes. Built twice, changing only the source:</p>
<div class="out">=== ma bam lop ===
  app2:v1
    402f1f706d767a4c      ← nen
    a64469e94491df8f      ← phu thuoc (30 MB)
    70fa5ac32e485e24      ← ma nguon

  app2:v2
    402f1f706d767a4c      ← Y HET
    a64469e94491df8f      ← Y HET
    2524aa7f2ab843de      ← KHAC</div>
<p>The base layer and the dependency layer are byte-identical between the two builds — same digest, not merely same content. Only the source layer differs. And the consequence shows up when you package them:</p>
<div class="out">=== kich thuoc xuat ra tep ===
  w1     29M      ← chi anh v1
  w2     29M      ← chi anh v2
  w12    29M      ← CA HAI anh

=== kich thuoc tung blob trong anh v2 ===
      30.049.338 byte   ← lop phu thuoc
           1.019 byte   ← cau hinh
             857 byte   ← lop ma nguon</div>
<div class="callout ok"><strong>Two 29 MB images packaged together are 29 MB.</strong> Not 58. The dependency layer exists once and both images point at it. A registry does exactly this: it stores blobs by digest, so pushing <code>v2</code> to a registry that already holds <code>v1</code> uploads the 857-byte source layer and the 1 KB config, and skips the 30 MB it already has.</div>
<div class="note-ct"><strong>What was and was not measured here.</strong> The layer digests, the blob sizes and the shared package size are real measurements from a real Docker daemon. An actual <code>docker push</code> over a network was <em>not</em> measured — the registries were unreachable from this sandbox — so the "857 bytes on the wire" figure follows from the digests rather than from a captured transfer. The mechanism is the digest comparison, and that part is measured.</div>

<h3>Why layer order decides your deploy time</h3>
<pre><code>FROM node:22-slim
WORKDIR /app

<span class="tok-comment"># 1. thu it doi nhat, len TRUOC</span>
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

<span class="tok-comment"># 2. thu doi MOI LAN, xuong duoi cung</span>
COPY src/ ./src/
CMD ["node", "src/app.js"]</code></pre>
<div class="pitfall"><strong>Trap — one <code>COPY . .</code> before <code>npm ci</code> destroys every bit of this.</strong> A layer is invalidated when its inputs change, and every layer below it is rebuilt too. Copy the whole project first and the dependency install sits <em>after</em> a layer that changes on every commit — so <code>npm ci</code> re-runs on every build, and the 30 MB layer gets a new digest every time, and every deploy pushes and pulls 30 MB instead of 857 bytes. The Dockerfile still works. It is just thirty thousand times more expensive per deploy, and nothing warns you.</div>

<h3>Tags lie; digests do not</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">A tag is a mutable pointer</span><span class="lz-d"><code>app:v2</code> can be moved to different content tomorrow, by anyone with push access. Two servers pulling <code>app:v2</code> a week apart can legitimately be running different code. So can the same server after a restart.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t"><code>:latest</code> is the worst of them</span><span class="lz-d">It means nothing — just the tag applied when none was given. A deploy that pulls <code>:latest</code> has no defined version, cannot be rolled back to a previous one, and cannot answer "what is running?" from Lesson 1.4.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">A digest is the content</span><span class="lz-d"><code>app@sha256:2524aa7f…</code> names exactly one set of bytes, forever. Pull that and you get that, on every machine, in a year. It is the container equivalent of the reproducible artifact from Lesson 1.2.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Tag for humans, deploy by digest</span><span class="lz-d">Push both — <code>app:2026-08-23-0e8117e</code> to read, and record the digest to deploy. Then rollback is redeploying a digest you already have, which is the container form of the symlink swap.</span></div>
</div>
<pre><code><span class="tok-comment"># lay digest THAT SU sau khi day</span>
docker buildx imagetools inspect ghcr.io/ban/app:2026-08-23-0e8117e \\
  --format '{{.Manifest.Digest}}'

<span class="tok-comment"># tren may chu: keo dung nhung byte do, khong phai "cai gi dang mang the do"</span>
docker pull ghcr.io/ban/app@sha256:2524aa7f...
docker compose up -d --no-build app</code></pre>

<h3>What this transport actually buys, and what it costs</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">The runtime ships with the code</span><span class="v">Node version, system libraries, locale, timezone data. The class of bug where the server has a different Node than your laptop stops existing — which is most of what "works on my machine" means.</span></div>
  <div class="kv"><span class="k">The build happens once, not per server</span><span class="v">Ten servers pull the same image. With rsync or git, each one builds, and each build is a chance to differ.</span></div>
  <div class="kv"><span class="k">The server needs no build tools</span><span class="v">No compiler, no npm, no source. This repository moved to it partly for that: builds on the VPS filled the disk that Postgres was sitting on, which Chapter 8 measures.</span></div>
  <div class="kv"><span class="k">The cost is a registry and a build machine</span><span class="v">Another moving part, another set of credentials, another thing that is down when you need to deploy urgently. And the base image is a dependency you now maintain — an unpinned <code>node:22-slim</code> changes underneath you.</span></div>
</div>
<div class="callout warn"><strong>A green build still does not mean a runnable image.</strong> This repository shipped an image built <code>FROM node:22-alpine</code> — musl — carrying a Prisma engine compiled for glibc. Build green, push green, swap green, then a restart loop and seven minutes of 502. The fix afterwards was a check comparing the image's libc against its engine build <em>before</em> the push. Chapter 7 is about gates like that; the point here is that the container path does not remove the need for them, it just moves where they belong.</div>

<h3>The same four steps, renamed</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Artifact → <code>docker build</code></span><span class="lz-lnote">The image, identified by its digest. Same role as the tarball in Lesson 1.2, with the same requirement: it must be built from committed source only.</span></div>
  <div class="lz-layer"><span class="lz-lname">Transport → <code>docker push</code> and <code>docker pull</code></span><span class="lz-lnote">Layer deduplication is the delta algorithm of this transport — the equivalent of rsync's rolling checksum, doing the same job with different mechanics.</span></div>
  <div class="lz-layer"><span class="lz-lname">Swap → <code>docker compose up -d</code></span><span class="lz-lnote">The image tag or digest in the compose file plays the part of the symlink. Rolling back is naming the previous digest — and the old image is usually still on disk, which is why it is as fast as the symlink move.</span></div>
  <div class="lz-layer"><span class="lz-lname">Verify → identical</span><span class="lz-lnote">An HTTP request against a real route. Nothing about containers changes Lesson 0.3: a running container proves as little as a running process.</span></div>
</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">OCI Image Specification — layers and descriptors</span><span class="lc-sub">github.com/opencontainers/image-spec/blob/main/spec.md — what a digest addresses and why the same layer in two images is stored once.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">OCI Distribution Specification — the push protocol</span><span class="lc-sub">github.com/opencontainers/distribution-spec — the HEAD-by-digest request that lets a client skip uploading a layer the registry already has.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker — build cache and layer invalidation</span><span class="lc-sub">docs.docker.com/build/cache — the rule behind the COPY-ordering pitfall, stated precisely.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — the full course</span><span class="lc-sub">/courses/docker/learn${REF} — layers, Dockerfiles, multi-stage builds and Compose in depth. This lesson is only the deploy-shaped slice of it.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>Tạo tác là một ảnh container</h2>
<p class="lead">Đường vận chuyển thứ ba gửi đi cả RUNTIME kèm với mã. Đó là đường mà kho mã này đang dùng trên production, và toàn bộ bài toán kinh tế của nó được giải thích bằng đúng một tính chất: một cái ảnh KHÔNG phải một tệp, nó là một danh sách các LỚP được định địa chỉ theo nội dung.</p>

<h3>Hai cái ảnh, đo thật</h3>
<p>Một ảnh nền, một lớp phụ thuộc 30 MB, và một lớp mã nguồn vài trăm byte. Dựng hai lần, chỉ đổi phần mã nguồn:</p>
<div class="out">=== ma bam lop ===
  app2:v1
    402f1f706d767a4c      ← nen
    a64469e94491df8f      ← phu thuoc (30 MB)
    70fa5ac32e485e24      ← ma nguon

  app2:v2
    402f1f706d767a4c      ← Y HET
    a64469e94491df8f      ← Y HET
    2524aa7f2ab843de      ← KHAC</div>
<p>Lớp nền và lớp phụ thuộc giống nhau tới từng byte giữa hai lần dựng — cùng mã băm, chứ không phải chỉ cùng nội dung. Chỉ lớp mã nguồn là khác. Và hệ quả lộ ra khi bạn đóng gói chúng lại:</p>
<div class="out">=== kich thuoc xuat ra tep ===
  w1     29M      ← chi anh v1
  w2     29M      ← chi anh v2
  w12    29M      ← CA HAI anh

=== kich thuoc tung blob trong anh v2 ===
      30.049.338 byte   ← lop phu thuoc
           1.019 byte   ← cau hinh
             857 byte   ← lop ma nguon</div>
<div class="callout ok"><strong>Hai cái ảnh 29 MB đóng gói chung lại vẫn là 29 MB.</strong> Không phải 58. Cái lớp phụ thuộc tồn tại MỘT LẦN và cả hai ảnh cùng trỏ vào nó. Một registry làm đúng như vậy: nó lưu blob theo mã băm, nên đẩy <code>v2</code> lên một registry vốn đã có <code>v1</code> chỉ tải lên lớp mã nguồn 857 byte cộng phần cấu hình 1 KB, và BỎ QUA 30 MB nó đã có.</div>
<div class="note-ct"><strong>Cái gì được đo và cái gì thì không.</strong> Mã băm các lớp, kích thước từng blob và kích thước gói dùng chung đều là phép đo THẬT từ một Docker daemon thật. Một lệnh <code>docker push</code> thật qua mạng thì <em>KHÔNG</em> được đo — các registry không với tới được từ sandbox này — nên con số "857 byte trên đường truyền" là SUY RA từ mã băm chứ không phải từ một lần chuyển đã ghi lại. Cơ chế nằm ở phép so mã băm, và phần đó thì đã đo.</div>

<h3>Vì sao thứ tự các lớp quyết định thời gian deploy của bạn</h3>
<pre><code>FROM node:22-slim
WORKDIR /app

<span class="tok-comment"># 1. thu it doi nhat, len TRUOC</span>
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

<span class="tok-comment"># 2. thu doi MOI LAN, xuong duoi cung</span>
COPY src/ ./src/
CMD ["node", "src/app.js"]</code></pre>
<div class="pitfall"><strong>Bẫy — một dòng <code>COPY . .</code> đặt TRƯỚC <code>npm ci</code> phá sạch mọi thứ vừa nói.</strong> Một lớp bị vô hiệu khi đầu vào của nó thay đổi, và MỌI lớp bên dưới nó cũng bị dựng lại. Chép cả dự án vào trước thì bước cài phụ thuộc nằm <em>SAU</em> một lớp thay đổi ở mọi commit — nên <code>npm ci</code> chạy lại ở mọi lần dựng, và cái lớp 30 MB nhận một mã băm mới mỗi lần, và mỗi lần deploy đẩy đi rồi kéo về 30 MB thay vì 857 byte. Cái Dockerfile vẫn CHẠY. Nó chỉ đắt hơn ba mươi nghìn lần cho mỗi lần deploy, và chẳng có gì cảnh báo bạn.</div>

<h3>Tag thì nói dối; digest thì không</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Một cái tag là một con trỏ CÓ THỂ ĐỔI</span><span class="lz-d"><code>app:v2</code> có thể bị chuyển sang nội dung khác vào ngày mai, bởi bất cứ ai có quyền đẩy. Hai máy chủ kéo <code>app:v2</code> cách nhau một tuần có thể đang chạy hai đoạn mã khác nhau một cách hoàn toàn hợp lệ. Cùng một máy chủ sau một lần khởi động lại cũng vậy.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t"><code>:latest</code> là cái tệ nhất trong đám</span><span class="lz-d">Nó chẳng có nghĩa gì — chỉ là cái tag được gán khi không ai nêu tag nào. Một lần deploy kéo <code>:latest</code> thì không có phiên bản xác định, không lùi về bản trước được, và không trả lời nổi câu "đang chạy cái gì?" ở Bài 1.4.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Một digest CHÍNH LÀ nội dung</span><span class="lz-d"><code>app@sha256:2524aa7f…</code> gọi tên đúng một bộ byte, mãi mãi. Kéo cái đó về là bạn nhận đúng cái đó, trên mọi máy, sau một năm. Nó là phiên bản container của cái tạo tác tái lập được ở Bài 1.2.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Gắn tag cho NGƯỜI đọc, deploy theo DIGEST</span><span class="lz-d">Đẩy cả hai — <code>app:2026-08-23-0e8117e</code> để đọc, và ghi lại digest để deploy. Khi đó lùi bản là deploy lại một digest bạn vốn đã có, tức là dạng container của cú tráo symlink.</span></div>
</div>
<pre><code><span class="tok-comment"># lay digest THAT SU sau khi day</span>
docker buildx imagetools inspect ghcr.io/ban/app:2026-08-23-0e8117e \\
  --format '{{.Manifest.Digest}}'

<span class="tok-comment"># tren may chu: keo dung nhung byte do, khong phai "cai gi dang mang the do"</span>
docker pull ghcr.io/ban/app@sha256:2524aa7f...
docker compose up -d --no-build app</code></pre>

<h3>Đường này mua được gì, và tốn gì</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Runtime đi kèm với mã</span><span class="v">Phiên bản Node, thư viện hệ thống, ngôn ngữ hệ thống, dữ liệu múi giờ. Cái loại lỗi mà máy chủ có Node khác laptop của bạn THÔI TỒN TẠI — mà đó là phần lớn ý nghĩa của câu "trên máy tôi thì chạy".</span></div>
  <div class="kv"><span class="k">Bước dựng xảy ra MỘT lần, không phải mỗi máy chủ một lần</span><span class="v">Mười máy chủ kéo về cùng một cái ảnh. Với rsync hay git thì mỗi máy tự dựng, và mỗi lần dựng là một cơ hội để khác nhau.</span></div>
  <div class="kv"><span class="k">Máy chủ không cần công cụ dựng</span><span class="v">Không trình biên dịch, không npm, không mã nguồn. Kho mã này chuyển sang đường đó một phần vì lý do ấy: dựng ngay trên VPS đã làm đầy cái đĩa mà Postgres đang ngồi trên đó, chuyện Chương 8 sẽ đo.</span></div>
  <div class="kv"><span class="k">Cái giá là một registry và một máy dựng</span><span class="v">Thêm một bộ phận chuyển động, thêm một bộ thông tin đăng nhập, thêm một thứ có thể đang chết đúng lúc bạn cần deploy gấp. Và cái ảnh nền giờ là một phụ thuộc bạn phải bảo trì — một <code>node:22-slim</code> không ghim chặt sẽ đổi ngay dưới chân bạn.</span></div>
</div>
<div class="callout warn"><strong>Một bản dựng xanh VẪN không có nghĩa là một cái ảnh chạy được.</strong> Kho mã này từng gửi đi một cái ảnh dựng <code>FROM node:22-alpine</code> — musl — mang theo một engine Prisma biên dịch cho glibc. Dựng xanh, đẩy xanh, tráo xanh, rồi một vòng lặp khởi động lại và bảy phút trả 502. Cách sửa sau đó là một phép kiểm so libc của cái ảnh với bản dựng của engine <em>TRƯỚC KHI</em> đẩy. Chương 7 nói về những cái cổng như thế; điểm ở đây là đường container KHÔNG loại bỏ nhu cầu có chúng, nó chỉ đổi chỗ chúng thuộc về.</div>

<h3>Vẫn bốn bước ấy, đổi tên</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Tạo tác → <code>docker build</code></span><span class="lz-lnote">Cái ảnh, định danh bằng digest của nó. Cùng vai trò với tệp nén ở Bài 1.2, và cùng một đòi hỏi: nó phải được dựng CHỈ từ mã đã commit.</span></div>
  <div class="lz-layer"><span class="lz-lname">Vận chuyển → <code>docker push</code> và <code>docker pull</code></span><span class="lz-lnote">Khử trùng lặp theo lớp chính là thuật toán chênh lệch của đường này — tương đương với mã kiểm tra cuộn của rsync, làm cùng một việc bằng cơ chế khác.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tráo → <code>docker compose up -d</code></span><span class="lz-lnote">Cái tag hay digest trong tệp compose đóng vai của symlink. Lùi bản là gọi tên digest trước đó — và cái ảnh cũ thường vẫn còn trên đĩa, nên nó nhanh ngang cú di chuyển symlink.</span></div>
  <div class="lz-layer"><span class="lz-lname">Kiểm → y hệt</span><span class="lz-lnote">Một request HTTP vào một tuyến thật. Chuyện container không thay đổi gì ở Bài 0.3: một container đang chạy chứng minh được ít y như một tiến trình đang chạy.</span></div>
</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Đặc tả ảnh OCI — lớp và descriptor</span><span class="lc-sub">github.com/opencontainers/image-spec/blob/main/spec.md — một digest định địa chỉ cái gì và vì sao cùng một lớp nằm trong hai ảnh chỉ được lưu một lần.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Đặc tả OCI Distribution — giao thức đẩy</span><span class="lc-sub">github.com/opencontainers/distribution-spec — cái request HEAD theo digest cho phép client bỏ qua việc tải lên một lớp mà registry đã có.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker — cache dựng và việc vô hiệu lớp</span><span class="lc-sub">docs.docker.com/build/cache — cái luật nằm sau bẫy thứ-tự-COPY, phát biểu chính xác.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — khoá đầy đủ</span><span class="lc-sub">/courses/docker/learn${REF} — lớp, Dockerfile, bản dựng nhiều tầng và Compose ở mức sâu. Bài này chỉ là lát cắt hình-dạng-deploy của nó.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 2.4 ─────────────────────────── */
    {
      title: '2.4 — Choosing a transport, and where to build|||2.4 — Chọn đường vận chuyển, và dựng ở đâu',
      slug: 'deploy-2-4-chon-duong-va-dung-o-dau',
      type: 'LESSON',
      description: 'Ba đường đặt cạnh nhau trên cùng một thay đổi một dòng — và phép so sánh đầu tiên của tôi SAI, vì hai bên không hề gửi đi cùng một thứ. Bài này sửa lại phép đo rồi rút ra luật chọn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.4</span>
<h2>Choosing a transport, and where to build</h2>
<p class="lead">Three transports, measured in the previous three lessons. Putting them side by side is harder than it looks, because the obvious comparison is not a comparison at all — and getting that wrong is how people end up with strong opinions built on a bad benchmark.</p>

<h3>The comparison, done wrong first</h3>
<div class="out">  rsync        310 ms    1.497.754 byte
  git push     293 ms          586 bytes</div>
<p>rsync looked 2,500 times worse. It was not: the rsync destination directory was empty, so it did a <em>first</em> sync, while git pushed a delta against a repository that already had the history. Two different operations, one table.</p>
<div class="out">════ CONG BANG: ca hai deu la lan thu HAI, chi doi mot dong ════
  rsync (dich DA co)   295 ms       15.499 byte
  git push             305 ms          565 bytes</div>
<div class="callout warn"><strong>Even the corrected table is not apples to apples, and it is worth saying why.</strong> The working tree here is 3.8 MB, of which 3.1 MB is <code>node_modules</code>. rsync is syncing that; git is not, because it is gitignored. So the two are shipping <em>different artifacts</em> — 27× more bytes for rsync partly reflects that it has 800 more files to account for. Any benchmark of these two transports has this problem baked in, and a number that ignores it is measuring the exclude list, not the transport.</div>
<p>What the corrected table does establish is the thing worth taking away: <strong>both took about 300 milliseconds</strong>. Lesson 0.1 measured why — the SSH handshake dominates at this scale, and the payload is free. For a project of this size, transport speed is not a reason to choose anything.</p>

<h3>So choose on the properties that differ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">What can reach production</span><span class="v">rsync: whatever is in the directory, including a file you are mid-edit (Lesson 0.1). git: committed work only. Registry: whatever was built, which is committed work if the build is honest.</span></div>
  <div class="kv"><span class="k">What the server needs installed</span><span class="v">rsync: rsync. git: git, plus a build toolchain if the artifact is source. Registry: a container runtime, and nothing else — no compiler, no npm, no source.</span></div>
  <div class="kv"><span class="k">What the server accumulates</span><span class="v">rsync: only the tree. git: the full history, growing forever (556 KB against 176 KB in Lesson 0.1). Registry: image layers, which need their own pruning.</span></div>
  <div class="kv"><span class="k">What a rollback needs</span><span class="v">All three are the same if you use the releases layout: a directory or an image that is already on disk. Without it, all three need the network.</span></div>
</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">rsync</span><span class="lz-t">When you are shipping something already built</span><span class="lz-d">A compiled binary, a bundled front end, a tree assembled by CI. Also the pragmatic choice for an existing setup — it works with anything and needs nothing on the far side. Pair it with <code>--link-dest</code> and a releases directory, and honour the two dangers from Lesson 2.1.</span></div>
  <div class="lz-step"><span class="lz-k">git push</span><span class="lz-t">When the artifact is source and the repository is modest</span><span class="lz-d">Interpreted languages, one or two servers. The committed-only guarantee is the real value, and the whole deploy fits in a hook you can read in one screen. Cost: the history lives on the server, and the build has to happen there.</span></div>
  <div class="lz-step"><span class="lz-k">registry</span><span class="lz-t">When the runtime is part of what you ship, or there are several servers</span><span class="lz-d">The strongest reproducibility of the three, and the only one where the server needs no build tools at all. Cost: a registry and a build machine, both of which can be down when you need to deploy urgently.</span></div>
  <div class="lz-step"><span class="lz-k">✗</span><span class="lz-t">Not: scp, FTP, or editing files over SSH</span><span class="lz-d"><code>scp</code> re-sends everything and has no delta and no delete. Editing in place is the failure mode where the server's code exists nowhere else, and the next deploy silently reverts the fix nobody wrote down.</span></div>
</div>

<h3>Where the build happens is a separate question</h3>
<p>Transport and build location are often conflated, and they are independent. You can build anywhere and ship by any transport — the constraint is only that the build must produce something that runs on the target.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Build on the server</span><span class="lz-lnote">Simplest, and the platform matches by definition. Costs CPU, memory and disk on the machine that is also serving traffic — and Chapter 8 measures a build being killed by the OOM killer and a deploy dying with <em>no space left on device</em> on the disk holding the database.</span></div>
  <div class="lz-layer"><span class="lz-lname">Build in CI, ship the result</span><span class="lz-lnote">The server stays a server. Requires the CI environment to match the target — same OS, same architecture, same libc, same runtime — and that match is a thing that drifts silently.</span></div>
  <div class="lz-layer"><span class="lz-lname">Build on your own machine, ship the result</span><span class="lz-lnote">Fast and free, and it is the path this repository uses: <code>deploy-nha.sh</code> builds at home, pushes to a registry, and the VPS only swaps. Roughly three times faster than building on the VPS, and it keeps a build cache off the server's disk entirely.</span></div>
  <div class="lz-layer"><span class="lz-lname">Build inside an image built for the target</span><span class="lz-lnote">The version that makes "build anywhere" actually safe, because the build environment <em>is</em> the runtime environment. It is the only one of these four where a platform mismatch is structurally impossible rather than merely unlikely.</span></div>
</div>
<div class="pitfall"><strong>Trap — building somewhere else means the build must be the target, not merely resemble it.</strong> The failure in this repository was exactly this: the build ran against the wrong Dockerfile, producing a musl base carrying a glibc engine. Everything matched except the one thing that mattered, and nothing checked. If you build off the server, add one assertion that compares the built artifact against the runtime it is going to — a libc check, a Node version check, an architecture check. One line, run before the push, is what turns "it should match" into "it does".</div>

<h3>A rule that survives contact with reality</h3>
<div class="callout ok"><strong>Ship what you tested, not instructions for producing it.</strong> Every transport is fine when the thing crossing the wire is the same thing that was verified. The failures in this chapter are all cases where it was not: an uncommitted file added at the last moment, a dependency resolved differently on the far side, a base image that moved. Choose the transport that makes the artifact hardest to change between test and production, and the rest of the differences stop mattering.</div>
<pre><code><span class="tok-comment"># cau hoi quyet dinh, theo thu tu</span>
1. Tao tac cua toi la NGUON hay la thu DA DUNG?          → nguon: git · da dung: rsync/registry
2. May chu co nen co bo cong cu dung khong?              → khong: registry hoac dung o CI
3. Co bao nhieu may chu?                                  → nhieu hon mot: registry
4. Kho ma co lon khong (tai nguyen nhi phan, lich su dai)? → co: tranh git push
5. Runtime co phai thu toi can ghim khong?                → co: registry</code></pre>
<div class="note-ct">One more thing all three share: none of them is the swap. Every measurement in this chapter stops the moment the bytes are on the server, and at that point nothing has changed for a single user — the old version is still running. Getting the new one to serve traffic without dropping a request is Chapter 3, and it is where the 3,070 ms outage from Lesson 0.1 finally goes away.</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">The Twelve-Factor App — V. Build, release, run</span><span class="lc-sub">12factor.net/build-release-run — the separation this whole chapter rests on: build produces the artifact, release combines it with config, run executes it.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">rsync(1), git-push(1), docker-push(1)</span><span class="lc-sub">The three manual pages behind the three transports. Reading the FILTER RULES section of the first is the highest-value hour of the three.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — where to build, and multi-stage builds</span><span class="lc-sub">/courses/docker/learn${REF} — the build-inside-the-target-image pattern, and how to keep build tools out of what you ship.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub — what a push actually transfers</span><span class="lc-sub">/courses/git/learn${REF} — packfiles and deltas, which is why the git column of the table above is so small.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.4</span>
<h2>Chọn đường vận chuyển, và dựng ở đâu</h2>
<p class="lead">Ba đường vận chuyển, đã đo ở ba bài trước. Đặt chúng cạnh nhau khó hơn vẻ ngoài của nó, vì phép so sánh hiển nhiên thật ra KHÔNG phải một phép so sánh — và làm sai chuyện đó chính là cách người ta có những ý kiến rất chắc chắn dựng trên một phép đo hỏng.</p>

<h3>Phép so sánh, làm SAI trước đã</h3>
<div class="out">  rsync        310 ms    1.497.754 byte
  git push     293 ms          586 bytes</div>
<p>rsync trông tệ hơn 2.500 lần. Không phải vậy: thư mục đích của rsync lúc đó RỖNG, nên nó làm một lần đồng bộ ĐẦU TIÊN, còn git thì đẩy một phần chênh lệch vào một kho vốn đã có lịch sử. Hai thao tác khác nhau, nhét chung một bảng.</p>
<div class="out">════ CONG BANG: ca hai deu la lan thu HAI, chi doi mot dong ════
  rsync (dich DA co)   295 ms       15.499 byte
  git push             305 ms          565 bytes</div>
<div class="callout warn"><strong>Ngay cả cái bảng đã sửa cũng KHÔNG phải so táo với táo, và điều đó đáng nói rõ.</strong> Cây làm việc ở đây nặng 3,8 MB, trong đó 3,1 MB là <code>node_modules</code>. rsync đang đồng bộ cả đống đó; git thì không, vì nó nằm trong gitignore. Nên hai bên đang gửi đi <em>HAI TẠO TÁC KHÁC NHAU</em> — con số nhiều byte hơn 27 lần của rsync một phần phản ánh việc nó có thêm 800 tệp phải tính tới. Mọi phép đo hai đường này đều mang sẵn vấn đề đó bên trong, và một con số bỏ qua nó là đang đo CÁI DANH SÁCH LOẠI TRỪ chứ không đo đường vận chuyển.</div>
<p>Thứ mà cái bảng đã sửa THẬT SỰ xác lập lại là điều đáng mang đi: <strong>cả hai đều mất khoảng 300 mili giây</strong>. Bài 0.1 đã đo lý do — cái bắt tay SSH chiếm phần lớn ở quy mô này, còn phần tải thì miễn phí. Với một dự án cỡ này, TỐC ĐỘ vận chuyển không phải lý do để chọn bất cứ thứ gì.</p>

<h3>Vậy hãy chọn theo những tính chất thật sự KHÁC nhau</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cái gì CÓ THỂ lên tới production</span><span class="v">rsync: bất cứ thứ gì trong thư mục, kể cả tệp bạn đang sửa dở (Bài 0.1). git: chỉ phần đã commit. Registry: bất cứ thứ gì đã được dựng, mà đó là phần đã commit nếu bước dựng trung thực.</span></div>
  <div class="kv"><span class="k">Máy chủ cần cài sẵn gì</span><span class="v">rsync: rsync. git: git, cộng bộ công cụ dựng nếu tạo tác là mã nguồn. Registry: một runtime container, và không gì khác — không trình biên dịch, không npm, không mã nguồn.</span></div>
  <div class="kv"><span class="k">Máy chủ TÍCH TỤ cái gì</span><span class="v">rsync: chỉ cái cây. git: toàn bộ lịch sử, tăng mãi mãi (556 KB so với 176 KB ở Bài 0.1). Registry: các lớp ảnh, và chúng cần bộ dọn dẹp riêng.</span></div>
  <div class="kv"><span class="k">Một cú lùi bản cần gì</span><span class="v">Cả ba như nhau NẾU bạn dùng bố cục releases: một thư mục hoặc một cái ảnh đã nằm sẵn trên đĩa. Không có nó thì cả ba đều cần MẠNG.</span></div>
</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">rsync</span><span class="lz-t">Khi bạn gửi đi thứ ĐÃ DỰNG XONG</span><span class="lz-d">Một tệp nhị phân đã biên dịch, một front end đã đóng gói, một cây do CI lắp ráp. Cũng là lựa chọn thực dụng cho một hệ thống đang chạy sẵn — nó làm việc với mọi thứ và không đòi gì ở phía bên kia. Hãy ghép nó với <code>--link-dest</code> và một thư mục releases, và tôn trọng hai mối nguy ở Bài 2.1.</span></div>
  <div class="lz-step"><span class="lz-k">git push</span><span class="lz-t">Khi tạo tác là MÃ NGUỒN và kho mã cỡ vừa</span><span class="lz-d">Ngôn ngữ thông dịch, một hai máy chủ. Cái bảo đảm chỉ-lấy-thứ-đã-commit mới là giá trị thật, và cả quy trình deploy gói trong một cái hook đọc hết trong một màn hình. Cái giá: lịch sử sống trên máy chủ, và bước dựng phải xảy ra ở đó.</span></div>
  <div class="lz-step"><span class="lz-k">registry</span><span class="lz-t">Khi runtime cũng là thứ bạn gửi đi, hoặc khi có nhiều máy chủ</span><span class="lz-d">Tính tái lập mạnh nhất trong ba đường, và là đường duy nhất mà máy chủ hoàn toàn không cần công cụ dựng. Cái giá: một registry và một máy dựng, mà cả hai đều có thể đang chết đúng lúc bạn cần deploy gấp.</span></div>
  <div class="lz-step"><span class="lz-k">✗</span><span class="lz-t">KHÔNG phải: scp, FTP, hay sửa tệp thẳng qua SSH</span><span class="lz-d"><code>scp</code> gửi lại toàn bộ, không có chênh lệch và không có xoá. Sửa tại chỗ là kiểu hỏng mà mã trên máy chủ KHÔNG tồn tại ở đâu khác, và lần deploy kế tiếp lặng lẽ xoá mất cái sửa mà chẳng ai ghi lại.</span></div>
</div>

<h3>Dựng ở đâu là một câu hỏi RIÊNG</h3>
<p>Đường vận chuyển và nơi dựng hay bị gộp làm một, và chúng độc lập với nhau. Bạn dựng ở đâu cũng được rồi gửi bằng đường nào cũng được — ràng buộc duy nhất là bước dựng phải cho ra thứ CHẠY ĐƯỢC trên máy đích.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Dựng trên máy chủ</span><span class="lz-lnote">Đơn giản nhất, và nền tảng khớp theo định nghĩa. Tốn CPU, bộ nhớ và đĩa trên chính cái máy đang phục vụ lưu lượng — và Chương 8 đo một lần dựng bị kẻ giết OOM giết chết cùng một lần deploy chết với <em>no space left on device</em> trên đúng cái đĩa chứa cơ sở dữ liệu.</span></div>
  <div class="lz-layer"><span class="lz-lname">Dựng trong CI, gửi kết quả đi</span><span class="lz-lnote">Máy chủ vẫn chỉ là máy chủ. Đòi môi trường CI phải KHỚP máy đích — cùng hệ điều hành, cùng kiến trúc, cùng libc, cùng runtime — và cái sự khớp đó là thứ trôi lệch một cách lặng lẽ.</span></div>
  <div class="lz-layer"><span class="lz-lname">Dựng trên máy của chính bạn, gửi kết quả đi</span><span class="lz-lnote">Nhanh và miễn phí, và đó là đường mà kho mã này đang dùng: <code>deploy-nha.sh</code> dựng ở nhà, đẩy lên registry, còn VPS chỉ tráo. Nhanh hơn dựng trên VPS khoảng ba lần, và nó giữ cho cache dựng nằm hẳn ngoài đĩa của máy chủ.</span></div>
  <div class="lz-layer"><span class="lz-lname">Dựng BÊN TRONG một cái ảnh dựng cho máy đích</span><span class="lz-lnote">Phiên bản làm cho "dựng ở đâu cũng được" thật sự an toàn, vì môi trường dựng CHÍNH LÀ môi trường chạy. Nó là cái duy nhất trong bốn cái mà lệch nền tảng là chuyện KHÔNG THỂ về mặt cấu trúc, chứ không phải chỉ là khó xảy ra.</span></div>
</div>
<div class="pitfall"><strong>Bẫy — dựng ở chỗ khác nghĩa là chỗ dựng phải LÀ máy đích, chứ không phải chỉ GIỐNG nó.</strong> Sự cố của kho mã này đúng là chuyện đó: bước dựng chạy với nhầm Dockerfile, cho ra một nền musl mang theo một engine glibc. Mọi thứ đều khớp trừ đúng cái thứ quan trọng, và chẳng có gì kiểm. Nếu bạn dựng ngoài máy chủ, hãy thêm MỘT phép khẳng định so tạo tác vừa dựng với cái runtime nó sắp chạy vào — kiểm libc, kiểm phiên bản Node, kiểm kiến trúc. Một dòng, chạy trước khi đẩy, là thứ biến "chắc là nó khớp" thành "nó khớp".</div>

<h3>Một cái luật sống sót được khi va vào thực tế</h3>
<div class="callout ok"><strong>Hãy gửi đi THỨ BẠN ĐÃ KIỂM THỬ, đừng gửi đi CÔNG THỨC để tạo ra nó.</strong> Mọi đường vận chuyển đều ổn khi thứ băng qua đường truyền chính là thứ đã được kiểm chứng. Mọi kiểu hỏng trong chương này đều là những ca mà điều đó KHÔNG đúng: một tệp chưa commit lọt vào phút chót, một phụ thuộc được giải khác đi ở phía bên kia, một cái ảnh nền đã bị di chuyển. Hãy chọn đường vận chuyển làm cho tạo tác KHÓ THAY ĐỔI NHẤT giữa lúc kiểm thử và lúc lên production, rồi mọi khác biệt còn lại sẽ thôi quan trọng.</div>
<pre><code><span class="tok-comment"># cau hoi quyet dinh, theo thu tu</span>
1. Tao tac cua toi la NGUON hay la thu DA DUNG?          → nguon: git · da dung: rsync/registry
2. May chu co nen co bo cong cu dung khong?              → khong: registry hoac dung o CI
3. Co bao nhieu may chu?                                  → nhieu hon mot: registry
4. Kho ma co lon khong (tai nguyen nhi phan, lich su dai)? → co: tranh git push
5. Runtime co phai thu toi can ghim khong?                → co: registry</code></pre>
<div class="note-ct">Còn một điều nữa mà cả ba đường đều giống nhau: KHÔNG cái nào là bước TRÁO. Mọi phép đo trong chương này dừng lại đúng khoảnh khắc các byte đã nằm trên máy chủ, và ở thời điểm đó chưa có gì thay đổi với một người dùng nào cả — bản cũ vẫn đang chạy. Đưa bản mới vào phục vụ lưu lượng mà không rơi một request nào là Chương 3, và đó là chỗ cái gián đoạn 3.070 ms ở Bài 0.1 rốt cuộc biến mất.</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">The Twelve-Factor App — V. Build, release, run</span><span class="lc-sub">12factor.net/build-release-run — sự tách bạch mà cả chương này dựa lên: dựng sinh ra tạo tác, phát hành ghép nó với cấu hình, chạy thì thực thi nó.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">rsync(1), git-push(1), docker-push(1)</span><span class="lc-sub">Ba trang man đứng sau ba đường vận chuyển. Đọc mục FILTER RULES của cái đầu tiên là một giờ đáng giá nhất trong ba cái.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — dựng ở đâu, và bản dựng nhiều tầng</span><span class="lc-sub">/courses/docker/learn${REF} — khuôn dựng-bên-trong-ảnh-đích, và cách giữ cho công cụ dựng không lọt vào thứ bạn gửi đi.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub — một lần push thật ra chuyển đi cái gì</span><span class="lc-sub">/courses/git/learn${REF} — packfile và delta, và đó là lý do cột git trong bảng ở trên nhỏ tới vậy.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 2.5 ─────────────────────────── */
    {
      title: '2.5 — When the transport fails halfway|||2.5 — Khi đường vận chuyển hỏng nửa chừng',
      slug: 'deploy-2-5-hong-nua-chung',
      type: 'LESSON',
      description: 'Hai lần deploy chạy chồng nhau: cái bắt đầu SAU lại xong TRƯỚC, rồi cái cũ ghi đè lên nó — production chạy bản cũ hơn. Đo cả sự cố lẫn hai kiểu khoá sửa được nó.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.5</span>
<h2>When the transport fails halfway</h2>
<p class="lead">Lesson 2.1 measured what an interrupted rsync leaves behind: 310 files from one release and 90 from another. This lesson covers the rest of the ways a transport goes wrong — and the one that produces the strangest outcome, where the deploy you started second is not the one that ends up running.</p>

<h3>Two deploys at once</h3>
<p>Two deploys of different versions, started 150 ms apart. The first is slower; the second finishes first:</p>
<div class="out">════ HAI lan deploy chay chong nhau, KHONG co khoa ════
  [B] xong, hien-tai → B
  [A] xong, hien-tai → A
  KET QUA: hien-tai → A
  noi dung dang duoc phuc vu: A</div>
<div class="callout warn"><strong>B was pushed second, completed first, and then A overwrote it.</strong> Production is running A — the <em>older</em> deploy — and the person who deployed B watched their deploy succeed. Nothing failed. Both scripts exited 0, both printed a success line, and the result is that the most recent change is not live. It will stay that way until someone deploys again, which is usually the next morning when someone notices the fix is missing.</div>
<p>This is not a rare shape. It happens when two people deploy at once, when a CI job overlaps a manual deploy, or when someone re-runs a deploy they thought had failed. This repository has a measured instance: eleven version bumps in four and a half hours from several sessions, of which <em>one was never released at all</em> — the version number moved, everyone believed it had shipped, and users stayed on the previous build with nothing anywhere comparing the two.</p>

<h3>One lock fixes it, and the flag decides the semantics</h3>
<pre><code><span class="tok-comment"># mo mot mo ta tep tren tep khoa, roi giu khoa suot ca lan deploy</span>
exec 9&gt;/var/lock/deploy.lock
if ! flock -n 9; then
  echo "co lan deploy khac dang chay — DUNG" &gt;&amp;2
  exit 1
fi</code></pre>
<div class="out">════ cung tinh huong, nhung CO flock ════
  [B] co lan deploy khac dang chay — DUNG
  [A] xong, hien-tai → A
  KET QUA: hien-tai → A

════ va neu B CHO thay vi bo cuoc (flock -w 10) ════
  [A] xong, hien-tai → A
  [B] xong, hien-tai → B
  KET QUA: hien-tai → B</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>flock -n</code> — fail immediately</span><span class="v">B refuses to start and says why. Only one deploy ever runs, and the rejected one exits non-zero so CI marks it failed rather than silently doing nothing.</span></div>
  <div class="kv"><span class="k"><code>flock -w 10</code> — wait, then give up</span><span class="v">B waits for A to finish, then deploys. The result is B — the newest change wins, which is almost always what you actually want.</span></div>
  <div class="kv"><span class="k">The lock releases itself</span><span class="v">It is held on a file descriptor, so the kernel drops it when the process exits — including a crash, a kill, or a dropped SSH session. A lock file you create and delete by hand does not have that property, and a stale one blocks deploys until someone removes it.</span></div>
  <div class="kv"><span class="k">Lock on the server, not the client</span><span class="v">A lock on your laptop does not know about the deploy running from CI. The file must live on the machine being deployed to.</span></div>
</div>
<div class="pitfall"><strong>Trap — <code>flock file cmd</code> and <code>exec 9&gt;file; flock 9</code> are not the same.</strong> The first holds the lock only for the duration of <code>cmd</code>; if your deploy is several commands, each one locks and unlocks and the gaps between them are unprotected. The file-descriptor form holds it for the life of the shell, which is what a multi-step deploy needs. And put the lock file somewhere that survives — <code>/var/lock</code> or <code>/run</code> — not inside the release directory you are about to replace.</div>

<h3>Which failures are safe to retry</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">✓</span><span class="lz-t">Transport into a new release directory</span><span class="lz-d">Fully safe. The target is a fresh directory nothing is serving, and re-running overwrites a partial copy with a complete one. Run it as many times as you like. This is the single largest benefit of the releases layout, beyond rollback.</span></div>
  <div class="lz-step"><span class="lz-k">✓</span><span class="lz-t">The symlink swap</span><span class="lz-d">Idempotent by nature — pointing a symlink at the directory it already points at changes nothing, and <code>rename(2)</code> cannot half-happen.</span></div>
  <div class="lz-step"><span class="lz-k">⚠</span><span class="lz-t">Transport directly over a live directory</span><span class="lz-d">Retrying makes the mixed state from Lesson 2.1 <em>more</em> mixed while it runs. It converges if it completes; it is dangerous every second it does not. Another reason not to deploy this way.</span></div>
  <div class="lz-step"><span class="lz-k">✗</span><span class="lz-t">Database migrations</span><span class="lz-d">Not generally safe to retry, and the failure mode is worse than anything in this chapter. Chapter 5 is about exactly this — including the state where a migration is recorded as neither applied nor rolled back, and every subsequent deploy refuses to run.</span></div>
</div>
<div class="callout ok"><strong>Design the transport step so retrying is always correct.</strong> Then a network blip, a timeout, or a laptop lid becomes an inconvenience instead of an incident: run it again. The property you want is that the operation can be repeated any number of times with the same end state, and the releases layout gives it to you almost for free — every deploy writes to a name nothing else uses.</div>

<h3>Resuming rather than restarting</h3>
<pre><code><span class="tok-comment"># giu phan da chuyen duoc, lan sau di tiep tu do</span>
rsync -a --partial --partial-dir=.rsync-tam ./ vps:/srv/app/phat-hanh/&lt;ban&gt;/

<span class="tok-comment"># tu thu lai khi mang chap chon — 3 lan, cach nhau vai giay</span>
for i in 1 2 3; do
  rsync -a --partial ./ vps:"\$BAN/" &amp;&amp; break
  echo "lan \$i hong, cho \$((i * 5))s roi thu lai" &gt;&amp;2
  sleep \$((i * 5))
done</code></pre>
<div class="note-ct"><code>--partial</code> keeps a partially transferred file instead of deleting it, and <code>--partial-dir</code> keeps it somewhere that is not the destination path — so a resumed transfer picks up where it stopped without ever exposing a half-written file at the real name. Worth having on a slow or unreliable link, and unnecessary on a fast one where restarting costs a second.</div>
<div class="pitfall"><strong>Trap — a retry loop with no limit is worse than no retry loop.</strong> A deploy that retries forever against a server that is genuinely down does not fail; it hangs, holding the lock from earlier in this lesson, until someone notices. Bound the attempts, bound the total time, and make sure the final failure is loud. A deploy that fails clearly after thirty seconds is a better outcome than one that is still trying an hour later.</div>

<h3>What a transport can and cannot promise</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">It can promise per-file atomicity</span><span class="lz-lnote">rsync and git both write-then-rename, so no file is ever half-old and half-new. Measured in Lesson 2.1: zero partial files after a kill.</span></div>
  <div class="lz-layer"><span class="lz-lname">It cannot promise per-deploy atomicity</span><span class="lz-lnote">That has to come from the structure around it — a new directory plus a symlink swap. No transport flag gives it to you.</span></div>
  <div class="lz-layer"><span class="lz-lname">It cannot promise ordering</span><span class="lz-lnote">Measured above: the second deploy finished first. Ordering comes from a lock, not from the transport.</span></div>
  <div class="lz-layer"><span class="lz-lname">It cannot tell you whether the result works</span><span class="lz-lnote">A completed transfer means the bytes arrived. Lesson 0.3 measured three deploys where the bytes arrived perfectly and the site was broken.</span></div>
</div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">flock(1) and flock(2)</span><span class="lc-sub">man7.org/linux/man-pages/man1/flock.1.html — both forms, and the sentence explaining that the lock is released when the file descriptor closes.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">rsync(1) — --partial, --partial-dir, --timeout</span><span class="lc-sub">man7.org/linux/man-pages/man1/rsync.1.html — resumption, and the timeout that turns a hung transfer into a failed one.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Idempotence in operations</span><span class="lc-sub">en.wikipedia.org/wiki/Idempotence — the property that makes "just run it again" a safe instruction, and the reason it is worth designing for deliberately.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — file locks, traps and cleaning up on exit</span><span class="lc-sub">/courses/linux-bash/learn${REF} — how a shell script holds a resource safely and gives it back even when it is killed.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.5</span>
<h2>Khi đường vận chuyển hỏng nửa chừng</h2>
<p class="lead">Bài 2.1 đã đo thứ mà một lệnh rsync bị cắt ngang để lại: 310 tệp từ bản này và 90 tệp từ bản kia. Bài này nói nốt những cách khác mà một đường vận chuyển đi sai — và cái cách sinh ra kết cục kỳ lạ nhất, khi lần deploy bạn khởi động SAU lại không phải cái rốt cuộc đang chạy.</p>

<h3>Hai lần deploy cùng lúc</h3>
<p>Hai lần deploy hai phiên bản khác nhau, khởi động cách nhau 150 ms. Cái thứ nhất chậm hơn; cái thứ hai xong trước:</p>
<div class="out">════ HAI lan deploy chay chong nhau, KHONG co khoa ════
  [B] xong, hien-tai → B
  [A] xong, hien-tai → A
  KET QUA: hien-tai → A
  noi dung dang duoc phuc vu: A</div>
<div class="callout warn"><strong>B được đẩy sau, xong trước, rồi A ghi đè lên nó.</strong> Production đang chạy A — lần deploy CŨ HƠN — và cái người đã deploy B thì đã nhìn thấy lần deploy của mình thành công. Không có gì hỏng cả. Cả hai script đều thoát ra 0, cả hai đều in một dòng thành công, và kết quả là thay đổi MỚI NHẤT không hề lên sóng. Nó sẽ ở nguyên như vậy cho tới khi có người deploy lại, mà thường là sáng hôm sau khi có ai đó phát hiện cái sửa lỗi bị thiếu.</div>
<p>Đây không phải một hình dạng hiếm. Nó xảy ra khi hai người cùng deploy, khi một job CI chồng lên một lần deploy tay, hoặc khi ai đó chạy lại một lần deploy mà họ tưởng đã hỏng. Kho mã này có một ca đo được: mười một lần bump phiên bản trong bốn tiếng rưỡi từ nhiều phiên làm việc, trong đó <em>MỘT bản chưa từng được phát hành</em> — con số phiên bản đã nhích lên, mọi người đều tin là đã ship, và người dùng nằm lại ở bản trước mà chẳng có chỗ nào đối chiếu hai thứ đó.</p>

<h3>Một cái khoá sửa được nó, và cái cờ quyết định ngữ nghĩa</h3>
<pre><code><span class="tok-comment"># mo mot mo ta tep tren tep khoa, roi giu khoa suot ca lan deploy</span>
exec 9&gt;/var/lock/deploy.lock
if ! flock -n 9; then
  echo "co lan deploy khac dang chay — DUNG" &gt;&amp;2
  exit 1
fi</code></pre>
<div class="out">════ cung tinh huong, nhung CO flock ════
  [B] co lan deploy khac dang chay — DUNG
  [A] xong, hien-tai → A
  KET QUA: hien-tai → A

════ va neu B CHO thay vi bo cuoc (flock -w 10) ════
  [A] xong, hien-tai → A
  [B] xong, hien-tai → B
  KET QUA: hien-tai → B</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>flock -n</code> — hỏng ngay lập tức</span><span class="v">B từ chối khởi động và nói rõ vì sao. Chỉ đúng MỘT lần deploy từng chạy, và cái bị từ chối thoát ra khác 0 nên CI đánh dấu nó là THẤT BẠI thay vì lặng lẽ chẳng làm gì.</span></div>
  <div class="kv"><span class="k"><code>flock -w 10</code> — chờ, rồi mới bỏ cuộc</span><span class="v">B chờ A xong rồi mới deploy. Kết quả là B — thay đổi mới nhất thắng, và đó gần như luôn là thứ bạn THẬT SỰ muốn.</span></div>
  <div class="kv"><span class="k">Cái khoá tự nhả</span><span class="v">Nó được giữ trên một mô tả tệp, nên nhân hệ điều hành nhả nó khi tiến trình thoát — kể cả khi sập, bị giết, hay rớt phiên SSH. Một tệp khoá bạn tự tạo và tự xoá thì KHÔNG có tính chất đó, và một cái còn sót lại sẽ chặn mọi lần deploy cho tới khi có người gỡ nó.</span></div>
  <div class="kv"><span class="k">Khoá trên MÁY CHỦ, không phải trên máy client</span><span class="v">Một cái khoá trên laptop của bạn không biết gì về lần deploy đang chạy từ CI. Tệp khoá phải sống trên chính cái máy đang được deploy vào.</span></div>
</div>
<div class="pitfall"><strong>Bẫy — <code>flock file cmd</code> và <code>exec 9&gt;file; flock 9</code> KHÔNG giống nhau.</strong> Cái đầu chỉ giữ khoá trong đúng thời gian <code>cmd</code> chạy; nếu lần deploy của bạn gồm nhiều lệnh thì mỗi lệnh khoá rồi mở khoá, và những khoảng trống giữa chúng KHÔNG được bảo vệ. Dạng dùng mô tả tệp giữ khoá suốt vòng đời của shell, và đó mới là thứ một lần deploy nhiều bước cần. Và hãy đặt tệp khoá ở chỗ SỐNG SÓT được — <code>/var/lock</code> hoặc <code>/run</code> — chứ đừng đặt trong chính thư mục bản phát hành mà bạn sắp thay.</div>

<h3>Kiểu hỏng nào THỬ LẠI được an toàn</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">✓</span><span class="lz-t">Vận chuyển vào một thư mục bản phát hành MỚI</span><span class="lz-d">Hoàn toàn an toàn. Đích là một thư mục mới tinh chẳng ai đang phục vụ từ đó, và chạy lại sẽ ghi đè một bản chép dở bằng một bản đầy đủ. Chạy bao nhiêu lần tuỳ thích. Đây là ích lợi LỚN NHẤT của bố cục releases, ngoài chuyện lùi bản.</span></div>
  <div class="lz-step"><span class="lz-k">✓</span><span class="lz-t">Cú tráo symlink</span><span class="lz-d">Tự nó đã bất biến khi lặp lại — trỏ một symlink vào đúng thư mục nó đang trỏ thì chẳng đổi gì, và <code>rename(2)</code> không thể xảy ra một nửa.</span></div>
  <div class="lz-step"><span class="lz-k">⚠</span><span class="lz-t">Vận chuyển thẳng đè lên thư mục ĐANG SỐNG</span><span class="lz-d">Thử lại làm cái trạng thái trộn lẫn ở Bài 2.1 <em>TRỘN THÊM</em> trong lúc nó chạy. Nó hội tụ NẾU chạy xong; nó nguy hiểm mỗi giây nó chưa xong. Thêm một lý do nữa để không deploy theo kiểu này.</span></div>
  <div class="lz-step"><span class="lz-k">✗</span><span class="lz-t">Migration cơ sở dữ liệu</span><span class="lz-d">Nói chung KHÔNG an toàn để thử lại, và kiểu hỏng của nó tệ hơn mọi thứ trong chương này. Chương 5 nói đúng về chuyện đó — kể cả cái trạng thái mà một migration được ghi nhận là KHÔNG áp dụng cũng KHÔNG lùi lại, và mọi lần deploy sau đó đều từ chối chạy.</span></div>
</div>
<div class="callout ok"><strong>Hãy thiết kế bước vận chuyển sao cho THỬ LẠI luôn đúng.</strong> Khi đó một cú nghẽn mạng, một lần hết giờ, hay một cái nắp laptop trở thành phiền toái chứ không phải sự cố: chạy lại thôi. Tính chất bạn muốn là thao tác đó lặp lại bao nhiêu lần cũng cho ra cùng một trạng thái cuối, và bố cục releases đem lại điều đó gần như miễn phí — mọi lần deploy đều ghi vào một cái tên mà không ai khác dùng.</div>

<h3>Đi tiếp thay vì làm lại từ đầu</h3>
<pre><code><span class="tok-comment"># giu phan da chuyen duoc, lan sau di tiep tu do</span>
rsync -a --partial --partial-dir=.rsync-tam ./ vps:/srv/app/phat-hanh/&lt;ban&gt;/

<span class="tok-comment"># tu thu lai khi mang chap chon — 3 lan, cach nhau vai giay</span>
for i in 1 2 3; do
  rsync -a --partial ./ vps:"\$BAN/" &amp;&amp; break
  echo "lan \$i hong, cho \$((i * 5))s roi thu lai" &gt;&amp;2
  sleep \$((i * 5))
done</code></pre>
<div class="note-ct"><code>--partial</code> giữ lại một tệp chuyển dở thay vì xoá nó đi, còn <code>--partial-dir</code> giữ nó ở một chỗ KHÔNG phải đường dẫn đích — nên một lần chuyển tiếp tục sẽ nối vào chỗ nó dừng mà không bao giờ phơi ra một tệp viết dở mang đúng cái tên thật. Đáng có trên một đường truyền chậm hoặc chập chờn, và không cần thiết trên một đường nhanh mà làm lại từ đầu chỉ tốn một giây.</div>
<div class="pitfall"><strong>Bẫy — một vòng thử lại KHÔNG có giới hạn còn tệ hơn không có vòng thử lại nào.</strong> Một lần deploy cứ thử lại mãi mãi vào một máy chủ đang chết thật thì KHÔNG hỏng; nó TREO, giữ nguyên cái khoá ở phần trên bài này, cho tới khi có người phát hiện. Hãy chặn số lần, chặn tổng thời gian, và bảo đảm cú hỏng cuối cùng phải ỒN ÀO. Một lần deploy hỏng rõ ràng sau ba mươi giây là kết cục TỐT HƠN một lần vẫn còn đang thử sau một tiếng.</div>

<h3>Một đường vận chuyển hứa được gì và KHÔNG hứa được gì</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Nó hứa được tính nguyên tử theo TỪNG TỆP</span><span class="lz-lnote">rsync và git đều ghi-rồi-đổi-tên, nên không tệp nào từng ở trạng thái nửa cũ nửa mới. Đo ở Bài 2.1: không sót tệp dở dang nào sau khi bị giết.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nó KHÔNG hứa được tính nguyên tử theo LẦN DEPLOY</span><span class="lz-lnote">Cái đó phải tới từ CẤU TRÚC bao quanh nó — một thư mục mới cộng một cú tráo symlink. Không cờ vận chuyển nào đem lại cho bạn.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nó KHÔNG hứa được THỨ TỰ</span><span class="lz-lnote">Đo ở trên: lần deploy thứ hai xong trước. Thứ tự tới từ một cái KHOÁ, không tới từ đường vận chuyển.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nó KHÔNG cho bạn biết kết quả có CHẠY không</span><span class="lz-lnote">Một lần chuyển hoàn tất nghĩa là các byte đã tới nơi. Bài 0.3 đã đo ba lần deploy mà các byte tới nơi hoàn hảo còn website thì hỏng.</span></div>
</div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">flock(1) và flock(2)</span><span class="lc-sub">man7.org/linux/man-pages/man1/flock.1.html — cả hai dạng, và cái câu giải thích rằng khoá được nhả khi mô tả tệp đóng lại.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">rsync(1) — --partial, --partial-dir, --timeout</span><span class="lc-sub">man7.org/linux/man-pages/man1/rsync.1.html — chuyện đi tiếp, và cái timeout biến một lần chuyển bị treo thành một lần chuyển hỏng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tính bất biến khi lặp lại trong vận hành</span><span class="lc-sub">en.wikipedia.org/wiki/Idempotence — cái tính chất làm cho câu "cứ chạy lại đi" thành một chỉ dẫn an toàn, và lý do nó đáng được thiết kế một cách có chủ ý.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — khoá tệp, trap và dọn dẹp lúc thoát</span><span class="lc-sub">/courses/linux-bash/learn${REF} — một script shell giữ một tài nguyên an toàn thế nào và trả lại nó ra sao ngay cả khi bị giết.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 2.6 ─────────────────────────── */
    {
      title: '2.6 — Quiz: transport|||2.6 — Quiz: vận chuyển',
      slug: 'deploy-2-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về một thuật toán gửi 100 byte cho một tệp đã dịch chuyển toàn bộ, một lệnh xoá ảnh người dùng không hỏi han, hai cái ảnh 29 MB gộp lại vẫn 29 MB, và một lần deploy cũ hơn thắng lần mới hơn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.6</span>
<h2>Quiz: transport</h2>
<p class="lead">Eight questions from a chapter where one benchmark had to be thrown away and rebuilt, because the first version compared two operations that were not the same operation.</p>
<div class="callout">
<p><strong>What this chapter established.</strong> rsync's rolling checksum sent 22 KB to sync a 20 MB file after a 100-byte change in the middle, and only <strong>18 KB with 100 literal bytes</strong> after inserting 100 bytes at the front — which shifts every byte and defeats a naive block comparison (2.1). Its two dangers are silent: <code>--delete</code> removed a user's uploaded image without asking, and a killed transfer left 310 files on one release and 90 on another — atomic per file, never per deploy (2.1). A bare repository plus a fifteen-line <code>post-receive</code> hook is a complete deploy, but the hook runs <em>after</em> the objects are accepted, so a failing hook does not fail the push (2.2). Container layers are content-addressed: two 29 MB images packaged together are 29 MB, because only the 857-byte source layer differed — and one <code>COPY . .</code> before <code>npm ci</code> destroys that entirely (2.3). Both transports took about 300 ms because the SSH handshake dominates, and the first attempt at comparing them was wrong: it timed a first sync against a delta (2.4). And two overlapping deploys produced the worst outcome of the chapter — the one started second finished first, the older one overwrote it, and production ran the older code while both deploys reported success (2.5).</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.6</span>
<h2>Quiz: vận chuyển</h2>
<p class="lead">Tám câu ra từ một chương mà một phép đo phải vứt đi dựng lại, vì bản đầu tiên đem so hai thao tác vốn không phải cùng một thao tác.</p>
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> Mã kiểm tra kiểu cuộn của rsync gửi 22 KB để đồng bộ một tệp 20 MB sau khi đổi 100 byte ở giữa, và chỉ <strong>18 KB với đúng 100 byte nguyên bản</strong> sau khi CHÈN 100 byte vào đầu — việc làm dịch chuyển mọi byte và đánh bại một phép so khối ngây thơ (2.1). Hai mối nguy của nó đều CÂM: <code>--delete</code> gỡ mất một tấm ảnh người dùng đã tải lên mà không hỏi han, và một lần chuyển bị giết để lại 310 tệp của bản này và 90 tệp của bản kia — nguyên tử theo TỪNG TỆP, không bao giờ theo lần deploy (2.1). Một kho trần cộng một hook <code>post-receive</code> mười lăm dòng là một quy trình deploy hoàn chỉnh, nhưng hook chạy <em>SAU KHI</em> các đối tượng đã được nhận, nên một hook hỏng KHÔNG làm lần push hỏng theo (2.2). Các lớp container được định địa chỉ theo nội dung: hai cái ảnh 29 MB đóng gói chung vẫn là 29 MB, vì chỉ lớp mã nguồn 857 byte là khác — và một dòng <code>COPY . .</code> đặt trước <code>npm ci</code> phá sạch chuyện đó (2.3). Cả hai đường vận chuyển đều mất khoảng 300 ms vì cái bắt tay SSH chiếm phần lớn, và lần đầu đem chúng ra so là SAI: nó bấm giờ một lần đồng bộ ĐẦU TIÊN đấu với một phần CHÊNH LỆCH (2.4). Và hai lần deploy chồng nhau sinh ra kết cục tệ nhất chương — cái khởi động sau lại xong trước, cái cũ hơn ghi đè lên nó, và production chạy mã cũ trong khi CẢ HAI lần deploy đều báo thành công (2.5).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'You insert 100 bytes at the start of a 20 MB file, shifting every byte, then rsync it. How much travels?|||Bạn chèn 100 byte vào ĐẦU một tệp 20 MB, làm dịch chuyển mọi byte, rồi rsync nó. Bao nhiêu byte đi qua đường truyền?',
            options: [
              'The whole 20 MB, because every block moved|||Cả 20 MB, vì mọi khối đều dịch chuyển',
              'About 18 KB, of which only 100 bytes are literal — the rolling checksum advances one byte at a time, so it finds the original blocks at their new offsets|||Khoảng 18 KB, trong đó chỉ 100 byte là nguyên bản — mã kiểm tra kiểu cuộn tiến từng byte một, nên nó tìm ra các khối gốc ở vị trí mới của chúng',
              'Half the file|||Nửa cái tệp',
              'Nothing, because the checksum still matches|||Không gì cả, vì mã kiểm tra vẫn khớp',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'Your deploy runs rsync --delete against /srv/app, which also contains the directory users upload files into. What happens to the uploads?|||Quy trình deploy chạy rsync --delete vào /srv/app, mà thư mục đó cũng chứa nơi người dùng tải tệp lên. Chuyện gì xảy ra với đám tệp tải lên?',
            options: [
              'They are preserved, since they are not in the source|||Chúng được giữ lại, vì chúng không có ở nguồn',
              'They are deleted — --delete removes anything on the server that is absent from the source, with no confirmation and no error|||Chúng bị XOÁ — --delete gỡ bỏ mọi thứ trên máy chủ mà vắng mặt ở nguồn, không xác nhận và không lỗi',
              'rsync refuses to run|||rsync từ chối chạy',
              'They are moved to a backup directory|||Chúng được chuyển vào một thư mục sao lưu',
            ],
            correctIndex: 1,
            points: 10,
          },
          {
            question: 'An rsync deploy straight into the live directory is killed halfway. What state is the application in?|||Một lần deploy rsync thẳng vào thư mục đang sống bị giết giữa chừng. Ứng dụng đang ở trạng thái nào?',
            options: [
              'Some files are half-written and will fail to parse|||Một số tệp bị viết dở và sẽ lỗi cú pháp',
              'Every file is intact, but the directory holds a mixture of two releases — a version that never existed in any commit|||Mọi tệp đều nguyên vẹn, nhưng thư mục đang giữ một MỚ TRỘN của hai bản phát hành — một phiên bản chưa từng tồn tại trong bất kỳ commit nào',
              'The deploy rolls itself back|||Lần deploy tự lùi lại',
              'Nothing changed, because rsync is transactional|||Không gì đổi cả, vì rsync có tính giao dịch',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'Your post-receive hook exits 1 because the build failed. What does the person who pushed see?|||Hook post-receive của bạn thoát ra 1 vì bước dựng hỏng. Người vừa push thấy gì?',
            options: [
              'The push is rejected and the commit is not stored|||Lần push bị từ chối và commit không được lưu',
              'The push succeeds — post-receive runs after the objects are accepted, so a non-zero exit is only a warning; rejecting a push needs pre-receive|||Lần push THÀNH CÔNG — post-receive chạy sau khi các đối tượng đã được nhận, nên mã thoát khác 0 chỉ là một cảnh báo; muốn từ chối push thì phải dùng pre-receive',
              'Git retries the hook|||Git thử lại cái hook',
              'The repository is left corrupted|||Kho mã bị để lại ở trạng thái hỏng',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'A Dockerfile has COPY . . on the line before RUN npm ci. What does that cost per deploy?|||Một Dockerfile có dòng COPY . . đặt ngay trước RUN npm ci. Nó tốn thêm gì cho mỗi lần deploy?',
            options: [
              'Nothing — the layers are the same either way|||Không gì cả — các lớp vẫn thế dù xếp cách nào',
              'The dependency layer is invalidated on every commit, so npm ci re-runs and the 30 MB layer gets a new digest — the registry transfers 30 MB instead of about 857 bytes|||Lớp phụ thuộc bị vô hiệu ở MỌI commit, nên npm ci chạy lại và cái lớp 30 MB nhận một digest mới — registry chuyển 30 MB thay vì khoảng 857 byte',
              'The image will not build|||Cái ảnh sẽ không dựng được',
              'Only the build is slower; the transfer is unchanged|||Chỉ bước dựng chậm hơn; phần chuyển thì không đổi',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'Why is deploying by image tag rather than digest a problem?|||Vì sao deploy theo TAG ảnh thay vì theo DIGEST lại là một vấn đề?',
            options: [
              'Tags are slower to pull|||Tag kéo về chậm hơn',
              'A tag is a mutable pointer — it can be moved to different content, so two servers pulling the same tag a week apart can legitimately be running different code|||Một cái tag là con trỏ CÓ THỂ ĐỔI — nó có thể bị chuyển sang nội dung khác, nên hai máy chủ kéo cùng một tag cách nhau một tuần có thể đang chạy hai đoạn mã khác nhau một cách hợp lệ',
              'Tags cannot be used with compose|||Tag không dùng được với compose',
              'Digests are required by the registry|||Registry bắt buộc phải dùng digest',
            ],
            correctIndex: 1,
            points: 10,
          },
          {
            question: 'The first attempt to compare rsync and git push showed rsync sending 1.5 MB against git sending 586 bytes. Why was that comparison invalid?|||Lần đầu đem so rsync với git push cho thấy rsync gửi 1,5 MB còn git gửi 586 byte. Vì sao phép so đó KHÔNG hợp lệ?',
            options: [
              'git compresses better|||git nén tốt hơn',
              'The rsync destination was empty, so it did a first sync while git pushed a delta — two different operations; and the two also ship different artifacts, since node_modules is gitignored|||Thư mục đích của rsync đang RỖNG nên nó làm một lần đồng bộ đầu tiên, còn git thì đẩy phần chênh lệch — hai thao tác khác nhau; và hai bên còn gửi đi hai tạo tác khác nhau, vì node_modules nằm trong gitignore',
              'The measurements were taken on different machines|||Hai phép đo lấy trên hai máy khác nhau',
              'rsync was not given -z|||rsync không được truyền cờ -z',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'Deploy A starts, then deploy B starts 150 ms later and finishes first. Neither uses a lock. What is running afterwards?|||Deploy A khởi động, rồi deploy B khởi động sau 150 ms và xong trước. Không cái nào dùng khoá. Sau đó cái gì đang chạy?',
            options: [
              'B, the most recent one|||B, cái mới nhất',
              'A — it finished last and overwrote the symlink, so production runs the older code while both deploys reported success|||A — nó xong SAU CÙNG và ghi đè lên symlink, nên production chạy mã CŨ HƠN trong khi cả hai lần deploy đều báo thành công',
              'Neither; the deploy fails|||Không cái nào; lần deploy hỏng',
              'A mixture of both|||Một mớ trộn của cả hai',
            ],
            correctIndex: 1,
            points: 15,
          },
        ],
      },
    },
  ],
};
