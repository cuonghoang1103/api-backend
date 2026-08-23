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
<div class="pitfall"><strong>Bẫy — <code>--delete</code> removes anything on the server that is not in your source, including things the server created.</strong> User uploads, generated files, a SQLite database, log files. There is no confirmation and no error; the deploy reports success. This is category 3 from Lesson 1.1 — runtime state — and it is the reason that category must live <em>outside</em> the directory a deploy writes to. Without <code>--delete</code> the problem inverts: files deleted from your repository stay on the server forever, so an old route or an old asset is still being served months after it was removed.</div>
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
<div class="pitfall"><strong>Bẫy — a hook that fails does not fail the push, unless you make it.</strong> <code>post-receive</code> runs <em>after</em> the objects have been accepted; git has already stored them and the push reports success whatever the hook does. A non-zero exit produces a warning on the client and nothing else. So a deploy that broke halfway through leaves you with a push that looked fine — the <code>set -euo pipefail</code> at the top of the hook stops the damage spreading, but it cannot undo the push. If you need to <em>reject</em> a push, that is <code>pre-receive</code>, which runs before anything is stored and whose exit code does decide the outcome.</div>

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
<div class="pitfall"><strong>Bẫy — one <code>COPY . .</code> before <code>npm ci</code> destroys every bit of this.</strong> A layer is invalidated when its inputs change, and every layer below it is rebuilt too. Copy the whole project first and the dependency install sits <em>after</em> a layer that changes on every commit — so <code>npm ci</code> re-runs on every build, and the 30 MB layer gets a new digest every time, and every deploy pushes and pulls 30 MB instead of 857 bytes. The Dockerfile still works. It is just thirty thousand times more expensive per deploy, and nothing warns you.</div>

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
  ],
};
