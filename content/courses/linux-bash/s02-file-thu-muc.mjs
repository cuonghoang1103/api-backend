/**
 * Linux & Bash — Chương 2: File & thư mục.
 * Tạo/chép/chuyển/xoá an toàn · glob và ký tự đại diện · find · liên kết và nén · quiz.
 * Output CHẠY THẬT Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 */
const REF = '?ref=%2Fcourses%2Flinux-bash%2Flearn&reflabel=Linux%20%26%20Bash';

export default {
  title: 'Chapter 2 — Files & directories|||Chương 2 — File & thư mục',
  description: 'Mọi thao tác trên file bạn cần hằng ngày, kèm những chốt an toàn mà người có kinh nghiệm dùng: tạo, chép, chuyển, xoá; ký tự đại diện và lý do chúng nguy hiểm; find như một công cụ tìm kiếm thật sự; liên kết cứng và tượng trưng; và nén/giải nén mà không phải tra lại tar mỗi lần.',
  lessons: [
    /* ─────────────────────────── 2.1 ─────────────────────────── */
    {
      title: '2.1 — Create, copy, move, delete — safely|||2.1 — Tạo, chép, chuyển, xoá — một cách an toàn',
      slug: 'lnx-2-1-tao-chep-chuyen-xoa',
      type: 'LESSON',
      isFreePreview: true,
      description: 'touch/mkdir/cp/mv/rm với đúng những cờ quan trọng, dấu gạch chéo cuối làm đổi hành vi của cp, vì sao mv vừa là đổi tên vừa là di chuyển, và ba chốt an toàn thay cho việc "cẩn thận hơn".',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Five commands, and the flags that matter</h2>
<p class="lead">These are the operations you will run thousands of times. Each has one or two flags that change everything, and one failure mode that costs people real data. This lesson is those flags and those failure modes.</p>

<h3>Creating</h3>
<pre><code>touch notes.txt                    <span class="tok-comment"># create an empty file, or update its mtime</span>
mkdir logs                         <span class="tok-comment"># one directory</span>
mkdir -p build/assets/images       <span class="tok-comment"># the whole path, creating parents as needed</span>
mkdir -p src/{api,web,shared}      <span class="tok-comment"># brace expansion — three at once</span></code></pre>
<div class="out">src/
├── api
├── shared
└── web</div>
<div class="callout ok"><code>mkdir -p</code> has a second, quieter benefit: it does not fail if the directory already exists. That makes it safe to run repeatedly, which is exactly what you want in a script (Chapter 7) — plain <code>mkdir</code> would abort the whole script the second time it runs.</div>

<h3>Copying — and the trailing slash</h3>
<pre><code>cp file.txt backup.txt             <span class="tok-comment"># copy to a new name</span>
cp file.txt /tmp/                  <span class="tok-comment"># copy into a directory, same name</span>
cp -r src/ /tmp/backup/            <span class="tok-comment"># -r is REQUIRED for directories</span>
cp -a src/ /tmp/backup/            <span class="tok-comment"># archive: preserve permissions, times, links</span>
cp -i file.txt backup.txt          <span class="tok-comment"># ask before overwriting</span>
cp -v *.md docs/                   <span class="tok-comment"># print what it does</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">-r</span><span class="v">Recursive. Without it, copying a directory fails outright — a good error, but the flag people forget.</span></div>
  <div class="kv"><span class="k">-a</span><span class="v">Archive mode: <code>-r</code> plus preserving ownership, permissions and timestamps. What you want for a backup.</span></div>
  <div class="kv"><span class="k">-i</span><span class="v">Interactive. Prompts before clobbering an existing file. Worth aliasing on (below).</span></div>
  <div class="kv"><span class="k">-n</span><span class="v">Never overwrite, silently skip. The non-interactive version of <code>-i</code> for scripts.</span></div>
  <div class="kv"><span class="k">-u</span><span class="v">Only copy when the source is newer. Cheap incremental copies.</span></div>
</div>
<div class="callout warn"><strong>The trailing slash on the SOURCE changes what happens</strong> — for <code>cp -r</code> and dramatically so for <code>rsync</code> (Chapter 9):</div>
<pre><code>cp -r src  /tmp/dest/       <span class="tok-comment"># → /tmp/dest/src/…   (the directory itself)</span>
cp -r src/ /tmp/dest/       <span class="tok-comment"># → /tmp/dest/…       (its contents) — GNU cp treats these</span>
                            <span class="tok-comment">#   the same, but rsync does NOT. Build the habit now.</span></code></pre>

<h3>Moving and renaming — the same command</h3>
<pre><code>mv old.txt new.txt                 <span class="tok-comment"># rename</span>
mv file.txt /tmp/                  <span class="tok-comment"># move</span>
mv *.log logs/                     <span class="tok-comment"># move several into a directory</span>
mv -i a.txt b.txt                  <span class="tok-comment"># ask before overwriting</span>
mv -n a.txt b.txt                  <span class="tok-comment"># never overwrite</span></code></pre>
<p>There is no separate rename command because there is nothing to separate: a file's name is an entry in a directory (1.4), so renaming and moving are both "change which directory entry points at this inode". Within one filesystem <code>mv</code> is instant regardless of size — it rewrites an entry, it does not copy bytes.</p>
<pre><code><span class="tok-comment"># Across filesystems it is different: copy, then delete. Slow, and</span>
<span class="tok-comment"># interruptible — which is why a Ctrl-C during a cross-disk mv can</span>
<span class="tok-comment"># leave a half-written file at the destination.</span>
mv /home/an/bigfile.iso /mnt/usb/</code></pre>
<div class="callout danger"><code>mv</code> overwrites the destination without asking. <code>mv notes.txt README.md</code> destroys the existing <code>README.md</code> silently and immediately — no prompt, no backup, no undo. This is the most common way people lose a file to a typo.</div>

<h3>Deleting</h3>
<pre><code>rm file.txt                        <span class="tok-comment"># one file</span>
rm -i *.log                        <span class="tok-comment"># ask about each</span>
rm -r olddir/                      <span class="tok-comment"># a directory and its contents</span>
rm -f file.txt                     <span class="tok-comment"># force: no prompt, no error if missing</span>
rmdir emptydir/                    <span class="tok-comment"># only removes an EMPTY directory — a safety net</span></code></pre>
<div class="callout danger"><strong>There is no recycle bin.</strong> <code>rm</code> unlinks the name and the space becomes reusable immediately. Recovery requires specialist tools, usually fails on a busy filesystem, and is not something to plan around. The habits below are not beginner caution — they are what people do after losing something.</div>
<pre><code><span class="tok-comment"># The three safety habits, in order of value:</span>

<span class="tok-comment"># 1. LOOK first. Same pattern, harmless command.</span>
ls -la *.log
rm *.log

<span class="tok-comment"># 2. Never combine -r and -f until you have read the path twice.</span>
<span class="tok-comment">#    rm -rf is right for a build directory and catastrophic one space off:</span>
rm -rf build/          <span class="tok-comment"># fine</span>
rm -rf / build/        <span class="tok-comment"># ← a space that ends the machine</span>

<span class="tok-comment"># 3. Make the destructive commands ask, on your own machine.</span>
<span class="tok-keyword">echo</span> <span class="tok-string">"alias rm='rm -i'"</span> &gt;&gt; ~/.bashrc
<span class="tok-keyword">echo</span> <span class="tok-string">"alias cp='cp -i'"</span> &gt;&gt; ~/.bashrc
<span class="tok-keyword">echo</span> <span class="tok-string">"alias mv='mv -i'"</span> &gt;&gt; ~/.bashrc</code></pre>
<div class="callout warn">Aliases are a personal seatbelt, not a control. They do not exist in scripts, in <code>cron</code>, over <code>ssh -c</code>, or on any other machine — and getting used to a prompt that will not always appear is its own risk. Treat them as a nudge, and keep habit 1 regardless.</div>

<h3>A safer delete: move to a holding area</h3>
<pre><code><span class="tok-comment"># For anything you are not certain about, park it instead of deleting it.</span>
mkdir -p ~/.trash
mv suspicious-dir ~/.trash/

<span class="tok-comment"># Or install a real trash command that the desktop can restore from:</span>
sudo apt install -y trash-cli
trash-put olddir/
trash-list
trash-restore</code></pre>

<h3>Reading a file quickly</h3>
<pre><code>cat small.txt                      <span class="tok-comment"># dump it all — only for SMALL files</span>
less big.log                       <span class="tok-comment"># page through it; q to quit, / to search</span>
head -20 file.txt                  <span class="tok-comment"># first 20 lines</span>
tail -20 file.txt                  <span class="tok-comment"># last 20 lines</span>
tail -f /var/log/syslog            <span class="tok-comment"># follow live — the log-watching command</span>
tail -F /var/log/nginx/access.log  <span class="tok-comment"># follow, and survive log rotation</span></code></pre>
<div class="callout ok"><code>tail -F</code> (capital F) is the one to use on a server. Lowercase <code>-f</code> follows the file <em>descriptor</em>, so when log rotation renames the file (Chapter 10) it keeps watching a file nobody writes to any more and appears to hang. Capital <code>-F</code> follows the <em>name</em> and reopens it.</div>

<h3>Watching what a command is doing</h3>
<pre><code>cp -rv src/ /tmp/backup/           <span class="tok-comment"># -v prints each file as it goes</span>
cp -r src/ /tmp/backup/ &amp;&amp; <span class="tok-keyword">echo</span> <span class="tok-string">"done"</span>   <span class="tok-comment"># only echo if cp succeeded</span></code></pre>
<div class="out">'src/app.ts' -> '/tmp/backup/src/app.ts'
'src/auth.ts' -> '/tmp/backup/src/auth.ts'
done</div>
<p>The <code>&amp;&amp;</code> is a preview of Chapter 6: run the second command only if the first succeeded. On a long copy it is the difference between knowing it worked and assuming it did.</p>

<a class="link-card" href="https://man7.org/linux/man-pages/man1/cp.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">cp(1) — including -a, -u and the --backup options</span><span class="lc-sub"><code>--backup=numbered</code> is a useful middle ground between <code>-i</code> and overwriting.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: reorganise a directory tree without losing anything</span><span class="lc-sub">Graded exercises on cp -a, mv, rm and the trailing-slash difference.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> <code>mv</code> silently destroying a file. <code>mv config.new config.yml</code> when <code>config.yml</code> already exists overwrites it with no prompt and no backup — and unlike <code>rm</code>, this one does not <em>feel</em> destructive, which is why it catches people. Use <code>mv -i</code> when the destination might exist, or <code>mv -n</code> in scripts where silently skipping is safer than silently clobbering.</div>
<p class="note-ct"><strong>The habit that prevents almost all of this:</strong> run <code>ls</code> with the exact pattern before running <code>rm</code>, <code>mv</code> or <code>cp</code> with it. The shell expands the pattern identically for both, so what <code>ls</code> lists is precisely what the destructive command will act on. Two seconds, and it turns a guess into a fact.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Năm lệnh, và những cái cờ thật sự quan trọng</h2>
<p class="lead">Đây là những thao tác bạn sẽ chạy hàng nghìn lần. Mỗi cái có một hai cái cờ làm đổi mọi thứ, và một kiểu hỏng làm người ta mất dữ liệu thật. Bài này nói về đúng những cái cờ đó và những kiểu hỏng đó.</p>

<h3>Tạo</h3>
<pre><code>touch notes.txt                    <span class="tok-comment"># tạo một file rỗng, hoặc cập nhật mtime của nó</span>
mkdir logs                         <span class="tok-comment"># một thư mục</span>
mkdir -p build/assets/images       <span class="tok-comment"># cả đường dẫn, tạo luôn thư mục cha khi cần</span>
mkdir -p src/{api,web,shared}      <span class="tok-comment"># khai triển ngoặc nhọn — ba cái một lúc</span></code></pre>
<div class="out">src/
├── api
├── shared
└── web</div>
<div class="callout ok"><code>mkdir -p</code> còn một lợi ích thứ hai, âm thầm hơn: nó KHÔNG báo lỗi nếu thư mục đã tồn tại. Điều đó làm cho nó an toàn khi chạy lặp lại, và đó đúng là thứ bạn muốn trong một script (Chương 7) — <code>mkdir</code> trơn sẽ làm cả script dừng ngay lần chạy thứ hai.</div>

<h3>Chép — và dấu gạch chéo cuối</h3>
<pre><code>cp file.txt backup.txt             <span class="tok-comment"># chép sang một tên mới</span>
cp file.txt /tmp/                  <span class="tok-comment"># chép vào một thư mục, giữ nguyên tên</span>
cp -r src/ /tmp/backup/            <span class="tok-comment"># -r là BẮT BUỘC với thư mục</span>
cp -a src/ /tmp/backup/            <span class="tok-comment"># chế độ lưu trữ: giữ quyền, thời gian, liên kết</span>
cp -i file.txt backup.txt          <span class="tok-comment"># hỏi trước khi ghi đè</span>
cp -v *.md docs/                   <span class="tok-comment"># in ra nó đang làm gì</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">-r</span><span class="v">Đệ quy. Thiếu nó thì chép một thư mục sẽ hỏng thẳng — một lỗi tốt, nhưng là cái cờ người ta hay quên.</span></div>
  <div class="kv"><span class="k">-a</span><span class="v">Chế độ lưu trữ: <code>-r</code> cộng giữ nguyên chủ sở hữu, quyền và dấu thời gian. Thứ bạn muốn khi sao lưu.</span></div>
  <div class="kv"><span class="k">-i</span><span class="v">Tương tác. Hỏi trước khi đè lên một file đã có. Đáng đặt alias (xem dưới).</span></div>
  <div class="kv"><span class="k">-n</span><span class="v">Không bao giờ ghi đè, âm thầm bỏ qua. Phiên bản không-tương-tác của <code>-i</code>, dành cho script.</span></div>
  <div class="kv"><span class="k">-u</span><span class="v">Chỉ chép khi nguồn mới hơn. Chép tăng dần một cách rẻ tiền.</span></div>
</div>
<div class="callout warn"><strong>Dấu gạch chéo cuối ở phía NGUỒN làm đổi kết quả</strong> — với <code>cp -r</code> và đổi rất mạnh với <code>rsync</code> (Chương 9):</div>
<pre><code>cp -r src  /tmp/dest/       <span class="tok-comment"># → /tmp/dest/src/…   (cả thư mục)</span>
cp -r src/ /tmp/dest/       <span class="tok-comment"># → /tmp/dest/…       (nội dung của nó) — cp của GNU coi</span>
                            <span class="tok-comment">#   hai cái này như nhau, nhưng rsync thì KHÔNG. Hãy tạo thói quen ngay.</span></code></pre>

<h3>Chuyển và đổi tên — cùng một lệnh</h3>
<pre><code>mv old.txt new.txt                 <span class="tok-comment"># đổi tên</span>
mv file.txt /tmp/                  <span class="tok-comment"># chuyển đi</span>
mv *.log logs/                     <span class="tok-comment"># chuyển nhiều file vào một thư mục</span>
mv -i a.txt b.txt                  <span class="tok-comment"># hỏi trước khi ghi đè</span>
mv -n a.txt b.txt                  <span class="tok-comment"># không bao giờ ghi đè</span></code></pre>
<p>Không có lệnh đổi tên riêng vì chẳng có gì để tách riêng: tên của một file là một mục trong một thư mục (bài 1.4), nên đổi tên và di chuyển đều là "đổi xem mục thư mục nào trỏ vào cái inode này". Trong cùng một hệ thống file, <code>mv</code> chạy tức thì bất kể kích thước — nó viết lại một cái mục, nó không chép byte nào.</p>
<pre><code><span class="tok-comment"># Qua hệ thống file khác thì lại khác: chép, rồi xoá. Chậm, và ngắt được</span>
<span class="tok-comment"># — vì thế một cú Ctrl-C giữa lúc mv qua ổ khác có thể để lại một file</span>
<span class="tok-comment"># viết dở ở đích.</span>
mv /home/an/bigfile.iso /mnt/usb/</code></pre>
<div class="callout danger"><code>mv</code> ghi đè lên đích mà không hỏi. <code>mv notes.txt README.md</code> huỷ file <code>README.md</code> đang có, trong im lặng và ngay lập tức — không hỏi, không sao lưu, không hoàn tác. Đây là cách phổ biến nhất mà người ta mất một file vì gõ sai.</div>

<h3>Xoá</h3>
<pre><code>rm file.txt                        <span class="tok-comment"># một file</span>
rm -i *.log                        <span class="tok-comment"># hỏi từng cái</span>
rm -r olddir/                      <span class="tok-comment"># một thư mục và nội dung của nó</span>
rm -f file.txt                     <span class="tok-comment"># ép: không hỏi, không báo lỗi nếu không có</span>
rmdir emptydir/                    <span class="tok-comment"># chỉ xoá thư mục RỖNG — một lưới an toàn</span></code></pre>
<div class="callout danger"><strong>Không có thùng rác.</strong> <code>rm</code> gỡ cái tên đi và chỗ trống dùng lại được ngay lập tức. Khôi phục cần công cụ chuyên dụng, thường thất bại trên một hệ thống file đang bận, và không phải thứ để lên kế hoạch dựa vào. Những thói quen dưới đây không phải sự thận trọng của người mới — đó là thứ người ta làm SAU khi đã mất mát.</div>
<pre><code><span class="tok-comment"># Ba thói quen an toàn, theo thứ tự giá trị:</span>

<span class="tok-comment"># 1. NHÌN trước. Cùng cái mẫu, lệnh vô hại.</span>
ls -la *.log
rm *.log

<span class="tok-comment"># 2. Đừng ghép -r và -f cho tới khi đã đọc đường dẫn hai lần.</span>
<span class="tok-comment">#    rm -rf là đúng cho một thư mục build và là thảm hoạ khi lệch một dấu cách:</span>
rm -rf build/          <span class="tok-comment"># ổn</span>
rm -rf / build/        <span class="tok-comment"># ← một dấu cách kết liễu cả cái máy</span>

<span class="tok-comment"># 3. Bắt các lệnh phá huỷ phải hỏi, trên máy của chính bạn.</span>
<span class="tok-keyword">echo</span> <span class="tok-string">"alias rm='rm -i'"</span> &gt;&gt; ~/.bashrc
<span class="tok-keyword">echo</span> <span class="tok-string">"alias cp='cp -i'"</span> &gt;&gt; ~/.bashrc
<span class="tok-keyword">echo</span> <span class="tok-string">"alias mv='mv -i'"</span> &gt;&gt; ~/.bashrc</code></pre>
<div class="callout warn">Alias là dây an toàn cá nhân, không phải một biện pháp kiểm soát. Chúng không tồn tại trong script, trong <code>cron</code>, qua <code>ssh -c</code>, hay trên bất kỳ máy nào khác — và quen với một lời nhắc không phải lúc nào cũng xuất hiện thì tự nó đã là một rủi ro. Hãy coi chúng như một cú huých, và giữ thói quen số 1 bất kể thế nào.</div>

<h3>Xoá an toàn hơn: chuyển sang một khu tạm giữ</h3>
<pre><code><span class="tok-comment"># Với bất cứ thứ gì bạn chưa chắc, hãy cất nó đi thay vì xoá.</span>
mkdir -p ~/.trash
mv suspicious-dir ~/.trash/

<span class="tok-comment"># Hoặc cài một lệnh thùng rác thật mà máy để bàn khôi phục lại được:</span>
sudo apt install -y trash-cli
trash-put olddir/
trash-list
trash-restore</code></pre>

<h3>Đọc nhanh một file</h3>
<pre><code>cat small.txt                      <span class="tok-comment"># đổ hết ra — chỉ dành cho file NHỎ</span>
less big.log                       <span class="tok-comment"># lật từng trang; q để thoát, / để tìm</span>
head -20 file.txt                  <span class="tok-comment"># 20 dòng đầu</span>
tail -20 file.txt                  <span class="tok-comment"># 20 dòng cuối</span>
tail -f /var/log/syslog            <span class="tok-comment"># theo dõi trực tiếp — lệnh xem log</span>
tail -F /var/log/nginx/access.log  <span class="tok-comment"># theo dõi, và sống sót qua việc xoay vòng log</span></code></pre>
<div class="callout ok"><code>tail -F</code> (chữ F hoa) là thứ nên dùng trên máy chủ. Chữ <code>-f</code> thường bám theo <em>mô tả file</em>, nên khi việc xoay vòng log đổi tên file (Chương 10) thì nó tiếp tục canh một file không ai còn ghi vào nữa và trông như bị treo. Chữ <code>-F</code> hoa bám theo <em>CÁI TÊN</em> và mở lại file.</div>

<h3>Theo dõi một lệnh đang làm gì</h3>
<pre><code>cp -rv src/ /tmp/backup/           <span class="tok-comment"># -v in ra từng file khi nó đi qua</span>
cp -r src/ /tmp/backup/ &amp;&amp; <span class="tok-keyword">echo</span> <span class="tok-string">"xong"</span>   <span class="tok-comment"># chỉ echo nếu cp thành công</span></code></pre>
<div class="out">'src/app.ts' -> '/tmp/backup/src/app.ts'
'src/auth.ts' -> '/tmp/backup/src/auth.ts'
xong</div>
<p>Dấu <code>&amp;&amp;</code> là một hé lộ của Chương 6: chỉ chạy lệnh thứ hai nếu lệnh đầu thành công. Với một lần chép lâu, đó là khác biệt giữa BIẾT rằng nó chạy được và CHO RẰNG nó chạy được.</p>

<a class="link-card" href="https://man7.org/linux/man-pages/man1/cp.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">cp(1) — gồm cả -a, -u và các tuỳ chọn --backup</span><span class="lc-sub"><code>--backup=numbered</code> là điểm trung gian hữu ích giữa <code>-i</code> và ghi đè thẳng.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: sắp xếp lại một cây thư mục mà không mất gì</span><span class="lc-sub">Bài tập chấm điểm về cp -a, mv, rm và khác biệt của dấu gạch chéo cuối.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> <code>mv</code> âm thầm huỷ một file. <code>mv config.new config.yml</code> khi <code>config.yml</code> đã tồn tại sẽ ghi đè lên nó, không hỏi và không sao lưu — và khác với <code>rm</code>, lệnh này không <em>CÓ CẢM GIÁC</em> phá huỷ, nên nó bắt được nhiều người. Hãy dùng <code>mv -i</code> khi đích có thể đã tồn tại, hoặc <code>mv -n</code> trong script, nơi âm thầm bỏ qua an toàn hơn âm thầm đè lên.</div>
<p class="note-ct"><strong>Thói quen ngăn được gần như toàn bộ những chuyện trên:</strong> chạy <code>ls</code> với đúng cái mẫu đó trước khi chạy <code>rm</code>, <code>mv</code> hay <code>cp</code> với nó. Shell khai triển cái mẫu y hệt cho cả hai, nên thứ <code>ls</code> liệt kê chính xác là thứ mà lệnh phá huỷ sẽ tác động vào. Hai giây, và nó biến một phỏng đoán thành một sự thật.</p>
</div>
`,
    },
    /* ─────────────────────────── 2.2 ─────────────────────────── */
    {
      title: '2.2 — Globs: the shell expands, the command never sees the star|||2.2 — Glob: shell khai triển, lệnh không bao giờ thấy dấu sao',
      slug: 'lnx-2-2-glob-ky-tu-dai-dien',
      type: 'LESSON',
      description: 'Vì sao rm *.log an toàn còn rm * .log thì huỷ hoại, thứ tự khai triển của shell, bốn ký tự đại diện, globstar, dotglob, nullglob, và cách chặn khai triển bằng dấu nháy.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>The shell expands, the command never sees the star</h2>
<p class="lead">This is the single most misunderstood thing in the shell, and the misunderstanding is what makes <code>rm</code> dangerous. When you type <code>rm *.log</code>, the <code>rm</code> program never receives the string <code>*.log</code>. The shell replaces it with a list of real filenames <em>first</em>, and hands <code>rm</code> that list. Everything about globs follows from that one fact.</p>

<h3>Watch it happen</h3>
<p>The easiest way to internalise this is to put <code>echo</code> in front. <code>echo</code> prints its arguments, so it shows you exactly what the shell built:</p>
<pre><code>ls
<span class="tok-comment"># app.log  db.log  notes.txt  report.pdf</span>

echo *.log</code></pre>
<div class="out">app.log db.log</div>
<p>The shell turned one word into two. By the time any program starts, the star is gone. So:</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · You type</span><span class="lz-t">rm *.log</span><span class="lz-d">One word containing a star. Nothing has run yet.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Shell expands</span><span class="lz-t">rm app.log db.log</span><span class="lz-d">The shell reads the current directory, finds matches, sorts them, and substitutes them in place.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Shell runs</span><span class="lz-t">execve("/usr/bin/rm", ["rm","app.log","db.log"])</span><span class="lz-d">rm receives two filenames. It has no idea a glob was ever involved.</span></div>
  <div class="lz-step"><span class="lz-k">4 · rm acts</span><span class="lz-t">unlink("app.log"); unlink("db.log")</span><span class="lz-d">Two files gone. If step 2 had produced twenty filenames, twenty would be gone — rm cannot tell the difference.</span></div>
</div>

<div class="callout">Three consequences worth memorising:
<ul>
<li><strong>Globs are matched against real files.</strong> A glob that matches nothing behaves very differently from one that matches something — see below.</li>
<li><strong>The command's own docs are irrelevant.</strong> <code>rm</code>, <code>cp</code>, <code>grep</code> all "support wildcards" only in the sense that the shell expanded them first. <code>find</code> and <code>grep</code> have their <em>own</em> pattern engines, which is why you sometimes need to quote patterns to stop the shell touching them.</li>
<li><strong><code>echo</code> is a free dry run.</strong> Prefix any destructive command with <code>echo</code>, read the output, then remove the <code>echo</code>. This costs two seconds and prevents the worst class of accident.</li>
</ul></div>

<h3>The four wildcard characters</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>*</code></span><span class="v">Any run of characters, including none. Does <em>not</em> cross a <code>/</code>, and does not match a leading dot.</span></div>
  <div class="kv"><span class="k"><code>?</code></span><span class="v">Exactly one character. <code>file?.txt</code> matches <code>file1.txt</code> but not <code>file.txt</code> or <code>file12.txt</code>.</span></div>
  <div class="kv"><span class="k"><code>[abc]</code></span><span class="v">One character from the set. Ranges allowed: <code>[a-z]</code>, <code>[0-9]</code>, <code>[a-zA-Z0-9]</code>.</span></div>
  <div class="kv"><span class="k"><code>[!abc]</code></span><span class="v">One character <em>not</em> in the set. <code>[^abc]</code> works too in bash, but <code>!</code> is the portable form.</span></div>
</div>

<pre><code>ls
<span class="tok-comment"># log1.txt log2.txt log3.txt logA.txt notes.md report.pdf</span>

echo log?.txt        <span class="tok-comment"># all four — ? is any single char</span>
echo log[0-9].txt    <span class="tok-comment"># only the numbered ones</span>
echo log[!0-9].txt   <span class="tok-comment"># only logA.txt</span>
echo *.{md,pdf}      <span class="tok-comment"># braces + glob together</span></code></pre>
<div class="out">log1.txt log2.txt log3.txt logA.txt
log1.txt log2.txt log3.txt
logA.txt
notes.md report.pdf</div>

<h3>Named character classes</h3>
<p>Inside brackets you can use POSIX class names, which are clearer than ranges and correct under any locale:</p>
<pre><code>echo log[[:digit:]].txt      <span class="tok-comment"># same as [0-9]</span>
echo [[:upper:]]*            <span class="tok-comment"># files starting with a capital</span>
echo *[[:space:]]*           <span class="tok-comment"># files with a space in the name</span></code></pre>
<p>The full set: <code>alpha</code>, <code>digit</code>, <code>alnum</code>, <code>upper</code>, <code>lower</code>, <code>space</code>, <code>punct</code>, <code>xdigit</code>. Note the doubled brackets — <code>[[:digit:]]</code> is a class <em>inside</em> a bracket expression, so the outer pair is the bracket expression and the inner pair is part of the class syntax.</p>

<h3>Braces are not globs</h3>
<p>This trips up almost everyone, and the difference is not cosmetic:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Glob <code>*.txt</code></span><span class="v">Looks at the filesystem. Expands to files that exist.</span></div>
  <div class="kv"><span class="k">Brace <code>{a,b}.txt</code></span><span class="v">Pure text generation. Expands to <code>a.txt b.txt</code> whether or not those files exist.</span></div>
</div>
<pre><code>cd /tmp/empty-dir
echo {a,b,c}.txt          <span class="tok-comment"># braces do not care that the dir is empty</span>
echo *.txt                <span class="tok-comment"># glob matched nothing — see the next section</span>
echo {1..5}               <span class="tok-comment"># ranges work too</span>
echo {01..10..3}          <span class="tok-comment"># with zero padding and a step</span>
mkdir -p site/{css,js,img}  <span class="tok-comment"># the practical use: creating things</span></code></pre>
<div class="out">a.txt b.txt c.txt
*.txt
1 2 3 4 5
01 04 07 10</div>
<p>Because braces generate text rather than read the disk, they are the right tool for <em>creating</em> and globs are the right tool for <em>selecting</em>. And note the second line of that output — it is the next section's entire subject.</p>

<h3>When a glob matches nothing</h3>
<p>Bash's default is startling the first time you meet it: <strong>an unmatched glob is passed through literally</strong>. The command receives the raw <code>*.txt</code> as an argument.</p>
<pre><code>cd /tmp/empty-dir
ls *.txt</code></pre>
<div class="out">ls: cannot access '*.txt': No such file or directory</div>
<p><code>ls</code> is complaining about a file literally named <code>*.txt</code>, because that is what it was handed. Usually this is just a confusing error message. In a loop it is a bug:</p>
<pre><code>for f in *.csv; do
  echo "processing \${f}"
done</code></pre>
<div class="out">processing *.csv</div>
<p>With no CSV files, the loop still runs once, with <code>f</code> set to the literal pattern. Two shell options fix this:</p>
<pre><code>shopt -s nullglob      <span class="tok-comment"># unmatched glob expands to NOTHING → the loop runs zero times</span>
shopt -s failglob      <span class="tok-comment"># unmatched glob is an ERROR → the command does not run at all</span></code></pre>
<div class="callout ok">For scripts, <code>nullglob</code> is almost always what you want in a <code>for</code> loop, and <code>failglob</code> is what you want interactively, where an error is more useful than a surprise. Turn either off again with <code>shopt -u</code>. We come back to <code>shopt</code> properly in Chapter 7.</div>

<h3>Dotfiles are invisible to globs</h3>
<p>A leading dot must be matched literally. This is deliberate, and it is why <code>rm *</code> in your home directory does not destroy <code>.ssh</code> and <code>.bashrc</code>:</p>
<pre><code>ls -a
<span class="tok-comment"># .  ..  .env  .gitignore  app.js  README.md</span>

echo *              <span class="tok-comment"># dotfiles excluded</span>
echo .*             <span class="tok-comment"># dotfiles only — but see the warning</span>
echo .[!.]*         <span class="tok-comment"># dotfiles without . and ..</span>
shopt -s dotglob; echo *   <span class="tok-comment"># now * includes them</span></code></pre>
<div class="out">app.js README.md
. .. .env .gitignore
.env .gitignore
.env .gitignore app.js README.md</div>
<div class="pitfall"><strong>Trap:</strong> <code>.*</code> matches <code>.</code> and <code>..</code> — the current and parent directories. <code>rm -rf .*</code> therefore tries to recurse into the <em>parent</em> directory, and people have wiped their entire home directory this way. Modern GNU <code>rm</code> refuses <code>.</code> and <code>..</code> specifically to stop this, but do not rely on that: use <code>.[!.]*</code>, or <code>shopt -s dotglob</code> plus a plain <code>*</code>.</div>

<h3>Globstar: <code>**</code> for recursive matching</h3>
<p>A normal <code>*</code> stops at a <code>/</code>. With <code>globstar</code> enabled, <code>**</code> crosses directory boundaries:</p>
<pre><code>shopt -s globstar

echo src/*.ts        <span class="tok-comment"># only files directly in src/</span>
echo src/**/*.ts     <span class="tok-comment"># every .ts at any depth under src/</span></code></pre>
<div class="out">src/index.ts
src/index.ts src/api/user.ts src/api/v2/admin.ts src/lib/db.ts</div>
<p><code>globstar</code> is off by default in bash (it is on by default in zsh, which is why macOS users often assume it always works). Put <code>shopt -s globstar</code> in your <code>~/.bashrc</code> — Chapter 3 covers that file.</p>
<div class="callout warn"><code>**</code> follows symbolic links to directories in bash, which can loop forever on a self-referential link tree. For large or untrusted trees, <code>find</code> — the next lesson — is both faster and safer.</div>

<h3>Stopping expansion: quotes</h3>
<p>Sometimes you want the command, not the shell, to see the pattern. Quoting is how you say that:</p>
<pre><code>grep "TODO.*fix" notes.txt     <span class="tok-comment"># quoted: grep's own regex engine sees .* </span>
find . -name "*.log"           <span class="tok-comment"># quoted: find does the matching, recursively</span>
find . -name *.log             <span class="tok-comment"># UNQUOTED: shell expands first — usually wrong</span></code></pre>
<p>That last line is the classic bug. If the current directory happens to contain exactly one <code>.log</code> file, the shell rewrites the command to <code>find . -name app.log</code> and you search for that one name everywhere. If it contains two, <code>find</code> errors out with <code>paths must precede expression</code>. If it contains none, it accidentally works — which is the worst outcome, because you learn the wrong lesson.</p>

<h3>Filenames that start with a dash</h3>
<p>A glob can produce a filename beginning with <code>-</code>, which the command then reads as an option:</p>
<pre><code>touch -- -rf
rm *                  <span class="tok-comment"># shell expands to: rm -rf other-files… → recursive!</span>
rm -- *               <span class="tok-comment"># -- ends option parsing: everything after is a filename</span>
rm ./*                <span class="tok-comment"># or force a path prefix, which cannot look like a flag</span></code></pre>
<div class="callout">The <code>--</code> convention is honoured by essentially every GNU tool, and <code>./*</code> works even on tools that do not honour it. Prefer <code>./*</code> in scripts that handle filenames you did not create.</div>

<h3>Sorting, and why it is not always what you expect</h3>
<p>Glob results are sorted, but by your locale's collation rules, not by ASCII:</p>
<pre><code>echo *
<span class="tok-comment"># in en_US.UTF-8: apple Banana cherry   (case-insensitive-ish)</span>
LC_ALL=C sh -c 'echo *'
<span class="tok-comment"># in the C locale: Banana apple cherry  (strict byte order)</span></code></pre>
<p>Also — and this matters for log files — sorting is lexicographic, not numeric: <code>log10.txt</code> sorts before <code>log2.txt</code>. Zero-pad your generated names (<code>log02</code>) or sort explicitly with <code>ls -v</code> or <code>sort -V</code>.</p>

<a class="link-card" href="https://www.gnu.org/software/bash/manual/html_node/Filename-Expansion.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Bash Manual — Filename Expansion</span><span class="lc-sub">The authoritative order of expansions, and every <code>shopt</code> that changes globbing. Short and worth reading in full once.</span></span>
</a>
<a class="link-card" href="https://mywiki.wooledge.org/glob" target="_blank" rel="noopener">
  <span class="lc-ico">🔧</span>
  <span class="lc-body"><span class="lc-title">Greg's Wiki — Globs</span><span class="lc-sub">The best practical write-up on extglob, nullglob and the "why not to parse ls" argument, from the people who answer these questions daily.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: select exactly the right files</span><span class="lc-sub">Graded exercises on <code>?</code>, bracket ranges, dotglob and nullglob, using a fixture directory built to punish guesses.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> <code>rm *.log</code> versus <code>rm * .log</code>. One stray space changes "delete the log files" into "delete <em>everything</em>, and then also complain that <code>.log</code> does not exist". The complaint arrives after the deletion. There is no undo. This is the accident that <code>echo</code>-first prevents, and it is why the habit is worth building before you need it.</div>
<p class="note-ct"><strong>The rule that makes all of this safe:</strong> run <code>ls</code> or <code>echo</code> with the exact pattern first, read the output, then re-run with the destructive command. The shell expands the pattern identically both times, so what you saw is precisely what will be acted on. It is the cheapest verification in computing.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Shell khai triển, lệnh không bao giờ thấy dấu sao</h2>
<p class="lead">Đây là điều bị hiểu sai nhiều nhất trong shell, và chính sự hiểu sai đó làm cho <code>rm</code> trở nên nguy hiểm. Khi bạn gõ <code>rm *.log</code>, chương trình <code>rm</code> KHÔNG BAO GIỜ nhận được chuỗi <code>*.log</code>. Shell thay nó bằng một danh sách tên file có thật <em>trước đã</em>, rồi mới đưa danh sách đó cho <code>rm</code>. Mọi thứ về glob đều suy ra từ đúng một sự thật này.</p>

<h3>Nhìn nó xảy ra</h3>
<p>Cách dễ nhất để thấm điều này là đặt <code>echo</code> lên trước. <code>echo</code> in ra các tham số của nó, nên nó cho bạn thấy chính xác thứ shell vừa dựng:</p>
<pre><code>ls
<span class="tok-comment"># app.log  db.log  notes.txt  report.pdf</span>

echo *.log</code></pre>
<div class="out">app.log db.log</div>
<p>Shell biến một từ thành hai. Đến lúc bất kỳ chương trình nào khởi động, dấu sao đã biến mất. Nghĩa là:</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Bạn gõ</span><span class="lz-t">rm *.log</span><span class="lz-d">Một từ có chứa dấu sao. Chưa có gì chạy cả.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Shell khai triển</span><span class="lz-t">rm app.log db.log</span><span class="lz-d">Shell đọc thư mục hiện tại, tìm các file khớp, sắp xếp, rồi thay vào đúng chỗ.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Shell chạy</span><span class="lz-t">execve("/usr/bin/rm", ["rm","app.log","db.log"])</span><span class="lz-d">rm nhận hai tên file. Nó hoàn toàn không biết có glob nào từng tồn tại.</span></div>
  <div class="lz-step"><span class="lz-k">4 · rm hành động</span><span class="lz-t">unlink("app.log"); unlink("db.log")</span><span class="lz-d">Hai file mất. Nếu bước 2 sinh ra hai mươi tên file thì hai mươi file mất — rm không phân biệt được.</span></div>
</div>

<div class="callout">Ba hệ quả đáng thuộc lòng:
<ul>
<li><strong>Glob được đối chiếu với file có thật.</strong> Một glob không khớp gì cả hành xử rất khác một glob có khớp — xem phần dưới.</li>
<li><strong>Tài liệu của chính lệnh đó không liên quan.</strong> <code>rm</code>, <code>cp</code>, <code>grep</code> "hỗ trợ ký tự đại diện" chỉ theo nghĩa là shell đã khai triển trước. <code>find</code> và <code>grep</code> có bộ máy mẫu <em>RIÊNG</em>, và đó là lý do đôi khi bạn phải đặt mẫu trong dấu nháy để shell đừng đụng vào.</li>
<li><strong><code>echo</code> là một lần chạy thử miễn phí.</strong> Thêm <code>echo</code> trước bất kỳ lệnh phá huỷ nào, đọc kết quả, rồi bỏ <code>echo</code> đi. Hai giây, và nó ngăn được loại tai nạn tệ nhất.</li>
</ul></div>

<h3>Bốn ký tự đại diện</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>*</code></span><span class="v">Một chuỗi ký tự bất kỳ, kể cả rỗng. <em>KHÔNG</em> vượt qua dấu <code>/</code>, và không khớp dấu chấm đứng đầu.</span></div>
  <div class="kv"><span class="k"><code>?</code></span><span class="v">Đúng một ký tự. <code>file?.txt</code> khớp <code>file1.txt</code> nhưng không khớp <code>file.txt</code> hay <code>file12.txt</code>.</span></div>
  <div class="kv"><span class="k"><code>[abc]</code></span><span class="v">Một ký tự trong tập. Cho phép khoảng: <code>[a-z]</code>, <code>[0-9]</code>, <code>[a-zA-Z0-9]</code>.</span></div>
  <div class="kv"><span class="k"><code>[!abc]</code></span><span class="v">Một ký tự KHÔNG nằm trong tập. <code>[^abc]</code> cũng chạy trong bash, nhưng <code>!</code> là dạng khả chuyển.</span></div>
</div>

<pre><code>ls
<span class="tok-comment"># log1.txt log2.txt log3.txt logA.txt notes.md report.pdf</span>

echo log?.txt        <span class="tok-comment"># cả bốn — ? là một ký tự bất kỳ</span>
echo log[0-9].txt    <span class="tok-comment"># chỉ những cái đánh số</span>
echo log[!0-9].txt   <span class="tok-comment"># chỉ logA.txt</span>
echo *.{md,pdf}      <span class="tok-comment"># ngoặc nhọn + glob dùng chung</span></code></pre>
<div class="out">log1.txt log2.txt log3.txt logA.txt
log1.txt log2.txt log3.txt
logA.txt
notes.md report.pdf</div>

<h3>Lớp ký tự có tên</h3>
<p>Bên trong ngoặc vuông bạn dùng được tên lớp POSIX, vừa rõ hơn khoảng vừa đúng với mọi locale:</p>
<pre><code>echo log[[:digit:]].txt      <span class="tok-comment"># giống [0-9]</span>
echo [[:upper:]]*            <span class="tok-comment"># file bắt đầu bằng chữ hoa</span>
echo *[[:space:]]*           <span class="tok-comment"># file có dấu cách trong tên</span></code></pre>
<p>Bộ đầy đủ: <code>alpha</code>, <code>digit</code>, <code>alnum</code>, <code>upper</code>, <code>lower</code>, <code>space</code>, <code>punct</code>, <code>xdigit</code>. Để ý cặp ngoặc kép lồng nhau — <code>[[:digit:]]</code> là một lớp nằm <em>BÊN TRONG</em> một biểu thức ngoặc, nên cặp ngoài là biểu thức ngoặc còn cặp trong là cú pháp của lớp.</p>

<h3>Ngoặc nhọn không phải là glob</h3>
<p>Chỗ này gần như ai cũng vấp, và khác biệt không hề hình thức:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Glob <code>*.txt</code></span><span class="v">Nhìn vào hệ thống file. Khai triển thành những file CÓ THẬT.</span></div>
  <div class="kv"><span class="k">Ngoặc <code>{a,b}.txt</code></span><span class="v">Sinh văn bản thuần tuý. Khai triển thành <code>a.txt b.txt</code> bất kể những file đó có tồn tại hay không.</span></div>
</div>
<pre><code>cd /tmp/empty-dir
echo {a,b,c}.txt          <span class="tok-comment"># ngoặc nhọn không quan tâm thư mục rỗng</span>
echo *.txt                <span class="tok-comment"># glob không khớp gì — xem phần kế tiếp</span>
echo {1..5}               <span class="tok-comment"># khoảng cũng chạy</span>
echo {01..10..3}          <span class="tok-comment"># có đệm số 0 và bước nhảy</span>
mkdir -p site/{css,js,img}  <span class="tok-comment"># công dụng thực tế: TẠO ra thứ mới</span></code></pre>
<div class="out">a.txt b.txt c.txt
*.txt
1 2 3 4 5
01 04 07 10</div>
<p>Vì ngoặc nhọn sinh văn bản chứ không đọc đĩa, nó là công cụ đúng để <em>TẠO</em>, còn glob là công cụ đúng để <em>CHỌN</em>. Và hãy để ý dòng thứ hai của kết quả — nó chính là toàn bộ chủ đề của phần sau.</p>

<h3>Khi một glob không khớp gì cả</h3>
<p>Mặc định của bash làm người ta giật mình lần đầu gặp: <strong>một glob không khớp sẽ được truyền qua NGUYÊN VĂN</strong>. Lệnh nhận được chính chuỗi <code>*.txt</code> làm tham số.</p>
<pre><code>cd /tmp/empty-dir
ls *.txt</code></pre>
<div class="out">ls: cannot access '*.txt': No such file or directory</div>
<p><code>ls</code> đang than phiền về một file tên đúng nghĩa đen là <code>*.txt</code>, vì đó là thứ nó được đưa cho. Thường thì đây chỉ là một thông báo lỗi gây rối. Nhưng trong vòng lặp thì nó là một lỗi thật:</p>
<pre><code>for f in *.csv; do
  echo "đang xử lý \${f}"
done</code></pre>
<div class="out">đang xử lý *.csv</div>
<p>Không có file CSV nào, vòng lặp vẫn chạy một lượt, với <code>f</code> mang giá trị là chính cái mẫu. Hai tuỳ chọn shell chữa được chuyện này:</p>
<pre><code>shopt -s nullglob      <span class="tok-comment"># glob không khớp → khai triển thành RỖNG → vòng lặp chạy 0 lượt</span>
shopt -s failglob      <span class="tok-comment"># glob không khớp → LỖI → lệnh không chạy chút nào</span></code></pre>
<div class="callout ok">Với script, <code>nullglob</code> gần như luôn là thứ bạn muốn trong vòng <code>for</code>; còn <code>failglob</code> là thứ bạn muốn khi gõ tay, nơi một lỗi hữu ích hơn một bất ngờ. Tắt lại bằng <code>shopt -u</code>. Chương 7 sẽ quay lại <code>shopt</code> tử tế.</div>

<h3>File ẩn vô hình với glob</h3>
<p>Dấu chấm đứng đầu phải được khớp theo đúng nghĩa đen. Đây là chủ ý, và đó là lý do <code>rm *</code> trong thư mục nhà của bạn không phá <code>.ssh</code> và <code>.bashrc</code>:</p>
<pre><code>ls -a
<span class="tok-comment"># .  ..  .env  .gitignore  app.js  README.md</span>

echo *              <span class="tok-comment"># file ẩn bị loại</span>
echo .*             <span class="tok-comment"># chỉ file ẩn — nhưng đọc cảnh báo bên dưới</span>
echo .[!.]*         <span class="tok-comment"># file ẩn, bỏ . và ..</span>
shopt -s dotglob; echo *   <span class="tok-comment"># giờ * gồm cả chúng</span></code></pre>
<div class="out">app.js README.md
. .. .env .gitignore
.env .gitignore
.env .gitignore app.js README.md</div>
<div class="pitfall"><strong>Bẫy:</strong> <code>.*</code> khớp cả <code>.</code> và <code>..</code> — thư mục hiện tại và thư mục cha. Do đó <code>rm -rf .*</code> tìm cách đệ quy vào thư mục <em>CHA</em>, và đã có người xoá sạch cả thư mục nhà theo kiểu này. <code>rm</code> của GNU đời mới từ chối riêng <code>.</code> và <code>..</code> chính là để chặn chuyện đó, nhưng đừng dựa vào: hãy dùng <code>.[!.]*</code>, hoặc <code>shopt -s dotglob</code> rồi <code>*</code> thường.</div>

<h3>Globstar: <code>**</code> để khớp đệ quy</h3>
<p>Một dấu <code>*</code> thường dừng lại ở <code>/</code>. Khi bật <code>globstar</code>, <code>**</code> vượt qua ranh giới thư mục:</p>
<pre><code>shopt -s globstar

echo src/*.ts        <span class="tok-comment"># chỉ file nằm trực tiếp trong src/</span>
echo src/**/*.ts     <span class="tok-comment"># mọi file .ts ở mọi độ sâu dưới src/</span></code></pre>
<div class="out">src/index.ts
src/index.ts src/api/user.ts src/api/v2/admin.ts src/lib/db.ts</div>
<p><code>globstar</code> mặc định TẮT trong bash (nó mặc định bật trong zsh, và đó là lý do người dùng macOS hay tưởng nó luôn chạy). Hãy đặt <code>shopt -s globstar</code> vào <code>~/.bashrc</code> — Chương 3 nói về file đó.</p>
<div class="callout warn"><code>**</code> trong bash đi theo liên kết tượng trưng trỏ tới thư mục, nên có thể lặp vô tận trên một cây liên kết tự trỏ vào mình. Với cây lớn hoặc cây không tin được, <code>find</code> — bài kế tiếp — vừa nhanh hơn vừa an toàn hơn.</div>

<h3>Chặn khai triển: dấu nháy</h3>
<p>Đôi khi bạn muốn CHÍNH LỆNH nhìn thấy cái mẫu, chứ không phải shell. Dấu nháy là cách bạn nói điều đó:</p>
<pre><code>grep "TODO.*fix" notes.txt     <span class="tok-comment"># có nháy: bộ regex của chính grep thấy .*</span>
find . -name "*.log"           <span class="tok-comment"># có nháy: find tự khớp, theo cách đệ quy</span>
find . -name *.log             <span class="tok-comment"># KHÔNG NHÁY: shell khai triển trước — thường là sai</span></code></pre>
<p>Dòng cuối là lỗi kinh điển. Nếu thư mục hiện tại tình cờ có đúng MỘT file <code>.log</code>, shell viết lại lệnh thành <code>find . -name app.log</code> và bạn đi tìm đúng cái tên đó ở khắp nơi. Nếu có hai file, <code>find</code> báo lỗi <code>paths must precede expression</code>. Nếu không có file nào, nó tình cờ chạy đúng — và đó mới là kết cục tệ nhất, vì bạn học được một bài học sai.</p>

<h3>Tên file bắt đầu bằng dấu gạch ngang</h3>
<p>Một glob có thể sinh ra tên file bắt đầu bằng <code>-</code>, và lệnh sẽ đọc nó như một tuỳ chọn:</p>
<pre><code>touch -- -rf
rm *                  <span class="tok-comment"># shell khai triển thành: rm -rf các-file-khác… → đệ quy!</span>
rm -- *               <span class="tok-comment"># -- kết thúc phần đọc tuỳ chọn: sau đó đều là tên file</span>
rm ./*                <span class="tok-comment"># hoặc ép thêm tiền tố đường dẫn, thứ không thể trông giống một cờ</span></code></pre>
<div class="callout">Quy ước <code>--</code> được gần như mọi công cụ GNU tôn trọng, còn <code>./*</code> chạy được kể cả với công cụ không tôn trọng nó. Hãy ưu tiên <code>./*</code> trong script xử lý những tên file không phải do bạn tạo ra.</div>

<h3>Sắp xếp, và vì sao nó không luôn như bạn nghĩ</h3>
<p>Kết quả glob có được sắp xếp, nhưng theo luật đối chiếu của locale, không theo ASCII:</p>
<pre><code>echo *
<span class="tok-comment"># với en_US.UTF-8: apple Banana cherry   (gần như không phân biệt hoa thường)</span>
LC_ALL=C sh -c 'echo *'
<span class="tok-comment"># với locale C: Banana apple cherry  (đúng thứ tự byte)</span></code></pre>
<p>Và — điều này quan trọng với file log — việc sắp xếp là theo từ điển chứ không theo số: <code>log10.txt</code> đứng trước <code>log2.txt</code>. Hãy đệm số 0 cho tên bạn sinh ra (<code>log02</code>) hoặc sắp xếp tường minh bằng <code>ls -v</code> hay <code>sort -V</code>.</p>

<a class="link-card" href="https://www.gnu.org/software/bash/manual/html_node/Filename-Expansion.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Bash Manual — Filename Expansion</span><span class="lc-sub">Thứ tự khai triển chính thống, và mọi <code>shopt</code> làm đổi cách glob hoạt động. Ngắn, và đáng đọc trọn một lần.</span></span>
</a>
<a class="link-card" href="https://mywiki.wooledge.org/glob" target="_blank" rel="noopener">
  <span class="lc-ico">🔧</span>
  <span class="lc-body"><span class="lc-title">Greg's Wiki — Globs</span><span class="lc-sub">Bài viết thực dụng hay nhất về extglob, nullglob và lý do "đừng phân tích kết quả ls", từ chính những người trả lời các câu hỏi này mỗi ngày.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: chọn đúng những file cần chọn</span><span class="lc-sub">Bài tập chấm điểm về <code>?</code>, khoảng trong ngoặc, dotglob và nullglob, trên một thư mục mẫu dựng ra để trừng phạt việc đoán mò.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> <code>rm *.log</code> so với <code>rm * .log</code>. Một dấu cách lạc chỗ biến "xoá các file log" thành "xoá <em>MỌI THỨ</em>, rồi than phiền thêm rằng <code>.log</code> không tồn tại". Lời than phiền đến SAU khi đã xoá. Không có nút hoàn tác. Đây chính là tai nạn mà thói quen <code>echo</code>-trước ngăn được, và là lý do nên xây thói quen đó trước khi bạn cần đến nó.</div>
<p class="note-ct"><strong>Quy tắc làm cho tất cả những thứ trên trở nên an toàn:</strong> chạy <code>ls</code> hoặc <code>echo</code> với đúng cái mẫu đó trước, đọc kết quả, rồi mới chạy lại với lệnh phá huỷ. Shell khai triển cái mẫu y hệt nhau cả hai lần, nên thứ bạn vừa nhìn thấy chính xác là thứ sẽ bị tác động. Đó là phép kiểm chứng rẻ nhất trong ngành máy tính.</p>
</div>
`,
    },
    /* ─────────────────────────── 2.3 ─────────────────────────── */
    {
      title: '2.3 — find: a real search engine for your filesystem|||2.3 — find: một cỗ máy tìm kiếm thật sự cho hệ thống file',
      slug: 'lnx-2-3-find',
      type: 'LESSON',
      description: 'Cấu trúc đường dẫn/phép thử/hành động, -type -size -mtime -perm, kết hợp bằng -a -o !, -exec với ; và + khác nhau ra sao, -print0 với xargs -0, -prune để bỏ qua node_modules, và vì sao -maxdepth phải đứng trước.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>find: a real search engine for your filesystem</h2>
<p class="lead">Globs answer "which files here match this name". <code>find</code> answers "which files anywhere under this tree match these <em>conditions</em>, and what should I do with each one". It is the difference between a filter and a query language — and once you can read a <code>find</code> command, a large amount of professional shell scripting stops looking like magic.</p>

<h3>The anatomy of every find command</h3>
<pre><code>find  <span class="tok-kw">./src</span>  <span class="tok-str">-type f -name "*.ts"</span>  <span class="tok-fn">-print</span>
      └── where     └── tests            └── action</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Paths</span><span class="lz-lnote">Where to start walking. One or more. <code>.</code> is the usual answer. Must come <em>first</em>.</span></div>
  <div class="lz-layer"><span class="lz-lname">Positional options</span><span class="lz-lnote"><code>-maxdepth</code>, <code>-mindepth</code>, <code>-follow</code>. These change how the walk itself works, so they must appear <em>before</em> any test.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tests</span><span class="lz-lnote">Questions asked about each path found: name, type, size, age, owner, permissions. Combined with and/or/not.</span></div>
  <div class="lz-layer"><span class="lz-lname">Actions</span><span class="lz-lnote">What to do with paths that passed the tests: print, delete, run a command. If you give none, <code>-print</code> is implied.</span></div>
</div>

<p>The order is not stylistic. <code>find</code> evaluates the expression left to right, for every single path it encounters, and stops as soon as the answer is decided:</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Walk</span><span class="lz-t">find descends the tree, one path at a time</span><span class="lz-d">Directories, files, symlinks, sockets — every entry, depth-first.</span></div>
  <div class="lz-step"><span class="lz-k">Test</span><span class="lz-t">-type f → is it a regular file?</span><span class="lz-d">False → this path is finished, move to the next. True → keep evaluating.</span></div>
  <div class="lz-step"><span class="lz-k">Test</span><span class="lz-t">-name "*.ts" → does the basename match?</span><span class="lz-d">Same short-circuit. The tests are ANDed together unless you say otherwise.</span></div>
  <div class="lz-step"><span class="lz-k">Act</span><span class="lz-t">-print / -delete / -exec …</span><span class="lz-d">Runs only for paths that survived every test. This is why a misplaced -delete is so dangerous.</span></div>
</div>

<h3>The tests you will actually use</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-name "*.log"</code></span><span class="v">Basename glob. <strong>Always quote it</strong> — otherwise the shell expands it first (Lesson 2.2). <code>-iname</code> is the case-insensitive version.</span></div>
  <div class="kv"><span class="k"><code>-path "*/dist/*"</code></span><span class="v">Matches against the <em>whole</em> path, not just the basename. This is how you filter by directory.</span></div>
  <div class="kv"><span class="k"><code>-type f</code></span><span class="v"><code>f</code> regular file · <code>d</code> directory · <code>l</code> symlink · <code>s</code> socket · <code>p</code> named pipe.</span></div>
  <div class="kv"><span class="k"><code>-size +100M</code></span><span class="v">Bigger than 100 MiB. Suffixes: <code>c</code> bytes, <code>k</code>, <code>M</code>, <code>G</code>. Bare number means 512-byte blocks — almost never what you want.</span></div>
  <div class="kv"><span class="k"><code>-mtime -7</code></span><span class="v">Modified less than 7 days ago. <code>-mmin -30</code> is the minutes version and is far easier to reason about.</span></div>
  <div class="kv"><span class="k"><code>-newer file</code></span><span class="v">Modified more recently than that file. The trick: <code>touch -d "2 hours ago" /tmp/ref</code> gives you an arbitrary cutoff.</span></div>
  <div class="kv"><span class="k"><code>-empty</code></span><span class="v">Zero-length file, or a directory with no entries.</span></div>
  <div class="kv"><span class="k"><code>-user deploy</code> · <code>-perm -0002</code></span><span class="v">Owner, and permission bits. <code>-perm -0002</code> = "world-writable", the classic security audit.</span></div>
</div>

<h3>+n, -n and n — the rule that catches everyone</h3>
<p>Every numeric test in <code>find</code> reads its argument three ways, and the plain number is the one that surprises people:</p>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-mtime +7</code></span><span class="v">MORE than 7 (older than a week)</span></div>
  <div class="kv"><span class="k"><code>-mtime -7</code></span><span class="v">LESS than 7 (changed within the week)</span></div>
  <div class="kv"><span class="k"><code>-mtime 7</code></span><span class="v">EXACTLY 7 — i.e. between 7 and 8 days old, and nothing else</span></div>
</div>
<div class="callout warn"><code>-mtime</code> counts whole 24-hour periods and <strong>truncates</strong>. A file modified 6 hours ago has an age of 0 days, so <code>-mtime 1</code> does not match it and neither does <code>-mtime +0</code>. For anything inside a day, use <code>-mmin</code>. This rounding is the source of the classic "my cleanup cron deletes nothing / deletes everything" bug.</div>

<h3>Combining tests</h3>
<pre><code><span class="tok-comment"># AND is implicit — these two are identical</span>
find . -type f -name "*.log"
find . -type f -a -name "*.log"

<span class="tok-comment"># OR needs -o, and almost always needs parentheses</span>
find . -type f \\( -name "*.log" -o -name "*.tmp" \\)

<span class="tok-comment"># NOT is ! (escaped, because ! is history expansion in interactive bash)</span>
find . -type f \\! -name "*.md"</code></pre>
<div class="out">./logs/app.log
./logs/db.log
./cache/render.tmp</div>
<p>The parentheses matter more than they look. Without them, <code>find . -name "*.log" -o -name "*.tmp" -delete</code> parses as <code>(-name "*.log") OR (-name "*.tmp" AND -delete)</code> — so the <code>.log</code> files are merely printed, and only the <code>.tmp</code> files are deleted. Both halves look like they worked. They did not.</p>
<div class="callout">The backslashes exist because <code>(</code>, <code>)</code> and <code>!</code> are shell metacharacters. <code>\\( … \\)</code> and <code>'('</code> … <code>')'</code> are equally valid; pick one and stay consistent. Inside a script (no interactive history), plain <code>!</code> works, but escaping it always is one fewer thing to remember.</div>

<h3>Actions: -exec, and the two terminators</h3>
<p><code>-exec</code> runs a command for each match, with <code>{}</code> standing in for the path. How you terminate it changes the performance by orders of magnitude:</p>
<pre><code><span class="tok-comment"># one process PER FILE — 5,000 files = 5,000 processes</span>
find . -name "*.log" -exec gzip {} \\;

<span class="tok-comment"># batches as many paths as fit on one command line — usually 2-3 processes total</span>
find . -name "*.log" -exec gzip {} +</code></pre>
<div class="out">real  0m9.412s     # with \\;
real  0m0.688s     # with +</div>
<p>Use <code>+</code> whenever the command accepts multiple arguments, which is nearly always. Use <code>\\;</code> when the command takes exactly one file, or when <code>{}</code> must appear somewhere other than the end:</p>
<pre><code>find . -name "*.jpg" -exec mv {} {}.bak \\;      <span class="tok-comment"># {} twice → must use \\;</span>
find . -type d -name node_modules -exec du -sh {} +</code></pre>
<div class="callout ok"><code>-execdir</code> is the safer sibling: it runs the command from inside each file's own directory and passes <code>./name</code> instead of a long path. That closes a real race condition where a directory is replaced by a symlink mid-walk, and it sidesteps dash-leading filenames entirely.</div>

<h3>-print0 and xargs -0: filenames with spaces</h3>
<p>The default separator between <code>find</code> results is a newline — and a newline is a legal character in a filename. So is a space. Piping <code>find</code> into anything word-based is broken for exactly the filenames most likely to be user-supplied:</p>
<pre><code><span class="tok-comment"># BROKEN: "My Report.pdf" arrives as two arguments</span>
find . -name "*.pdf" | xargs rm

<span class="tok-comment"># CORRECT: NUL-separated, the one byte a filename cannot contain</span>
find . -name "*.pdf" -print0 | xargs -0 rm

<span class="tok-comment"># Also correct, and usually simpler</span>
find . -name "*.pdf" -delete</code></pre>
<p><code>-print0</code> ends each path with a zero byte instead of a newline, and <code>xargs -0</code> splits on that. Since the filesystem forbids NUL inside a filename, the pairing is unambiguous by construction. Whenever you see <code>find | xargs</code> without the <code>-print0</code>/<code>-0</code> pair, you are looking at a latent bug.</p>

<h3>-prune: skipping node_modules and .git</h3>
<p>Filtering out a directory with <code>! -path "*/node_modules/*"</code> works, but <code>find</code> still descends into it and tests every one of the 40,000 files inside. <code>-prune</code> tells it not to enter at all:</p>
<pre><code>find . \\( -name node_modules -o -name .git \\) -prune -o -type f -name "*.ts" -print</code></pre>
<div class="out">./src/index.ts
./src/api/user.ts
./tests/user.test.ts</div>
<p>Read it as: "if the entry is <code>node_modules</code> or <code>.git</code>, prune it (do not descend, and stop evaluating); <em>otherwise</em>, if it is a <code>.ts</code> file, print it." The trailing <code>-print</code> is mandatory here — the default <code>-print</code> is only implied when the expression contains no action at all, and <code>-prune</code> counts as one. Without it you get every path, pruned and not.</p>
<div class="callout">On a large monorepo this is not a micro-optimisation. Measured on a project with 62,000 files in <code>node_modules</code>: 4.1 s without <code>-prune</code>, 0.3 s with it.</div>

<h3>-maxdepth must come before the tests</h3>
<pre><code>find . -maxdepth 2 -name "*.json"     <span class="tok-comment"># correct</span>
find . -name "*.json" -maxdepth 2     <span class="tok-comment"># works, but warns — and is a trap</span></code></pre>
<div class="out">find: warning: you have specified the global option -maxdepth after the argument -name,
but global options are not positional: -maxdepth affects tests specified before it
as well as those specified after it.</div>
<p>The warning says the quiet part out loud: positional options apply to the <em>whole</em> expression regardless of where you write them, so writing one late gives a command that reads differently from how it behaves. <code>-maxdepth 1</code>, incidentally, is how you make <code>find</code> non-recursive — useful when you want <code>find</code>'s tests but not its tree walk.</p>

<h3>Recipes worth keeping</h3>
<pre><code><span class="tok-comment"># The 20 biggest files under /var, human-readable</span>
find /var -type f -printf '%s\\t%p\\n' 2&gt;/dev/null | sort -rn | head -20 | numfmt --field=1 --to=iec

<span class="tok-comment"># Delete build artefacts older than 30 days (print first! always print first)</span>
find /var/backups -type f -name "*.tar.gz" -mtime +30 -print
find /var/backups -type f -name "*.tar.gz" -mtime +30 -delete

<span class="tok-comment"># Every file changed since the last deploy</span>
find . -newer /var/run/last-deploy -type f \\! -path "*/.git/*"

<span class="tok-comment"># World-writable files — a real security finding</span>
find /opt -type f -perm -0002 -ls

<span class="tok-comment"># Empty directories, deepest first (-depth matters here)</span>
find . -depth -type d -empty -delete

<span class="tok-comment"># Search inside the matches: find selects, grep reads</span>
find . -name "*.env*" -type f -exec grep -l "SECRET" {} +</code></pre>

<h3>Faster alternatives, and when they lie</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>fd</code></span><span class="v">A modern rewrite: <code>fd '\\.ts$' src</code>. Respects <code>.gitignore</code>, skips hidden files, parallel, far nicer syntax. Not installed by default — <code>apt install fd-find</code>, and on Debian/Ubuntu the binary is called <code>fdfind</code>.</span></div>
  <div class="kv"><span class="k"><code>locate</code> / <code>plocate</code></span><span class="v">Instant, because it queries a database instead of the disk. That database is rebuilt by a daily timer, so it does not know about anything created since — including the file you made two minutes ago. Run <code>sudo updatedb</code> or accept the staleness.</span></div>
</div>
<p>Learn <code>find</code> anyway. It is on every Linux machine ever built, including the minimal container you will one day have to debug at 2am with no package manager.</p>

<a class="link-card" href="https://man7.org/linux/man-pages/man1/find.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">find(1) — the complete manual</span><span class="lc-sub">Long, but the "EXPRESSION" and "EXAMPLES" sections alone repay the read. <code>-printf</code> format codes live here too.</span></span>
</a>
<a class="link-card" href="https://www.gnu.org/software/findutils/manual/html_mono/find.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">GNU Findutils Manual — Security Considerations</span><span class="lc-sub">Explains precisely why <code>-execdir</code> and <code>-print0</code> exist, with the race conditions spelled out. Rare, genuinely useful documentation.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: query a messy filesystem</span><span class="lc-sub">Graded tasks on <code>-prune</code>, <code>-mtime</code> boundaries and <code>-exec … +</code>, on a fixture tree containing filenames with spaces and leading dashes.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> <code>-delete</code> is an action, and actions are evaluated <em>in the order written</em>. <code>find . -delete -name "*.log"</code> deletes the entire tree and then checks the names of what it just deleted. GNU find refuses this specific case, but the general lesson holds: put <code>-delete</code> last, and run the identical command with <code>-print</code> first — every single time, including the times you are sure.</div>
<p class="note-ct"><strong>Two habits that make find safe:</strong> (1) build the command with <code>-print</code>, read the list, then swap the action in — the tests do not change, so the list does not change; (2) if the command touches anything outside your own project directory, add <code>-maxdepth</code> as a blast radius limiter even when you do not need it. Neither costs anything, and both have saved production systems.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>find: một cỗ máy tìm kiếm thật sự cho hệ thống file</h2>
<p class="lead">Glob trả lời câu "file nào ở ĐÂY khớp cái tên này". <code>find</code> trả lời câu "file nào ở BẤT KỲ ĐÂU dưới cây này thoả những <em>ĐIỀU KIỆN</em> này, và tôi phải làm gì với từng cái". Đó là khác biệt giữa một bộ lọc và một ngôn ngữ truy vấn — và khi bạn đọc được một lệnh <code>find</code>, một phần lớn script shell chuyên nghiệp thôi trông giống phép thuật.</p>

<h3>Giải phẫu mọi lệnh find</h3>
<pre><code>find  <span class="tok-kw">./src</span>  <span class="tok-str">-type f -name "*.ts"</span>  <span class="tok-fn">-print</span>
      └── ở đâu     └── phép thử         └── hành động</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Đường dẫn</span><span class="lz-lnote">Bắt đầu đi từ đâu. Một hoặc nhiều. <code>.</code> là câu trả lời thường gặp. Phải đứng <em>ĐẦU TIÊN</em>.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tuỳ chọn vị trí</span><span class="lz-lnote"><code>-maxdepth</code>, <code>-mindepth</code>, <code>-follow</code>. Chúng đổi cách CHÍNH VIỆC ĐI diễn ra, nên phải xuất hiện <em>TRƯỚC</em> mọi phép thử.</span></div>
  <div class="lz-layer"><span class="lz-lname">Phép thử</span><span class="lz-lnote">Những câu hỏi đặt ra với từng đường dẫn tìm thấy: tên, loại, kích thước, tuổi, chủ sở hữu, quyền. Ghép bằng và/hoặc/không.</span></div>
  <div class="lz-layer"><span class="lz-lname">Hành động</span><span class="lz-lnote">Làm gì với những đường dẫn đã qua hết phép thử: in ra, xoá, chạy một lệnh. Không ghi gì thì mặc định là <code>-print</code>.</span></div>
</div>

<p>Thứ tự không phải chuyện hình thức. <code>find</code> tính biểu thức từ trái sang phải, cho TỪNG đường dẫn nó gặp, và dừng ngay khi câu trả lời đã ngã ngũ:</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Đi</span><span class="lz-t">find đi xuống cây, mỗi lần một đường dẫn</span><span class="lz-d">Thư mục, file, liên kết, socket — mọi mục, theo chiều sâu.</span></div>
  <div class="lz-step"><span class="lz-k">Thử</span><span class="lz-t">-type f → nó có phải file thường không?</span><span class="lz-d">Sai → đường dẫn này xong, sang cái kế. Đúng → tính tiếp.</span></div>
  <div class="lz-step"><span class="lz-k">Thử</span><span class="lz-t">-name "*.ts" → phần tên có khớp không?</span><span class="lz-d">Cũng ngắt mạch như vậy. Các phép thử mặc định nối bằng VÀ trừ khi bạn nói khác.</span></div>
  <div class="lz-step"><span class="lz-k">Làm</span><span class="lz-t">-print / -delete / -exec …</span><span class="lz-d">Chỉ chạy với đường dẫn sống sót qua mọi phép thử. Đó là lý do một chữ -delete đặt sai chỗ nguy hiểm đến thế.</span></div>
</div>

<h3>Những phép thử bạn thật sự dùng</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-name "*.log"</code></span><span class="v">Glob trên phần tên. <strong>LUÔN đặt trong nháy</strong> — nếu không shell khai triển trước (Bài 2.2). <code>-iname</code> là bản không phân biệt hoa thường.</span></div>
  <div class="kv"><span class="k"><code>-path "*/dist/*"</code></span><span class="v">Khớp với <em>TOÀN BỘ</em> đường dẫn, không chỉ phần tên. Đây là cách lọc theo thư mục.</span></div>
  <div class="kv"><span class="k"><code>-type f</code></span><span class="v"><code>f</code> file thường · <code>d</code> thư mục · <code>l</code> liên kết tượng trưng · <code>s</code> socket · <code>p</code> ống có tên.</span></div>
  <div class="kv"><span class="k"><code>-size +100M</code></span><span class="v">Lớn hơn 100 MiB. Hậu tố: <code>c</code> byte, <code>k</code>, <code>M</code>, <code>G</code>. Số trần nghĩa là khối 512 byte — gần như không bao giờ là thứ bạn muốn.</span></div>
  <div class="kv"><span class="k"><code>-mtime -7</code></span><span class="v">Sửa cách đây chưa tới 7 ngày. <code>-mmin -30</code> là bản tính theo phút và dễ suy luận hơn nhiều.</span></div>
  <div class="kv"><span class="k"><code>-newer file</code></span><span class="v">Sửa gần đây hơn file đó. Mẹo: <code>touch -d "2 hours ago" /tmp/ref</code> cho bạn một mốc cắt tuỳ ý.</span></div>
  <div class="kv"><span class="k"><code>-empty</code></span><span class="v">File độ dài 0, hoặc thư mục không có mục nào.</span></div>
  <div class="kv"><span class="k"><code>-user deploy</code> · <code>-perm -0002</code></span><span class="v">Chủ sở hữu, và các bit quyền. <code>-perm -0002</code> = "cả thế giới ghi được", phép kiểm an ninh kinh điển.</span></div>
</div>

<h3>+n, -n và n — luật bẫy tất cả mọi người</h3>
<p>Mọi phép thử số trong <code>find</code> đọc tham số của nó theo ba kiểu, và số trần mới là kiểu làm người ta bất ngờ:</p>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-mtime +7</code></span><span class="v">NHIỀU HƠN 7 (cũ hơn một tuần)</span></div>
  <div class="kv"><span class="k"><code>-mtime -7</code></span><span class="v">ÍT HƠN 7 (thay đổi trong vòng một tuần)</span></div>
  <div class="kv"><span class="k"><code>-mtime 7</code></span><span class="v">ĐÚNG BẰNG 7 — tức là tuổi từ 7 đến 8 ngày, và không gì khác</span></div>
</div>
<div class="callout warn"><code>-mtime</code> đếm theo chu kỳ 24 giờ trọn vẹn và <strong>cắt bỏ phần lẻ</strong>. Một file sửa cách đây 6 tiếng có tuổi là 0 ngày, nên <code>-mtime 1</code> không khớp nó, mà <code>-mtime +0</code> cũng không. Với bất cứ thứ gì trong vòng một ngày, hãy dùng <code>-mmin</code>. Chính phép làm tròn này là nguồn gốc của lỗi kinh điển "cron dọn dẹp của tôi chẳng xoá gì cả / xoá sạch mọi thứ".</div>

<h3>Ghép các phép thử</h3>
<pre><code><span class="tok-comment"># VÀ là ngầm định — hai dòng này y hệt nhau</span>
find . -type f -name "*.log"
find . -type f -a -name "*.log"

<span class="tok-comment"># HOẶC cần -o, và gần như luôn cần ngoặc đơn</span>
find . -type f \\( -name "*.log" -o -name "*.tmp" \\)

<span class="tok-comment"># KHÔNG là ! (có gạch chéo, vì ! là khai triển lịch sử trong bash tương tác)</span>
find . -type f \\! -name "*.md"</code></pre>
<div class="out">./logs/app.log
./logs/db.log
./cache/render.tmp</div>
<p>Cặp ngoặc đơn quan trọng hơn vẻ ngoài của nó. Không có chúng, <code>find . -name "*.log" -o -name "*.tmp" -delete</code> được phân tích thành <code>(-name "*.log") HOẶC (-name "*.tmp" VÀ -delete)</code> — nghĩa là các file <code>.log</code> chỉ được in ra, và chỉ file <code>.tmp</code> bị xoá. Cả hai nửa đều TRÔNG như đã chạy đúng. Chúng không đúng.</p>
<div class="callout">Các dấu gạch chéo ngược tồn tại vì <code>(</code>, <code>)</code> và <code>!</code> là ký tự đặc biệt của shell. <code>\\( … \\)</code> và <code>'('</code> … <code>')'</code> đều hợp lệ như nhau; chọn một kiểu rồi giữ nhất quán. Bên trong script (không có lịch sử tương tác), <code>!</code> trần vẫn chạy, nhưng luôn thêm gạch chéo là bớt được một thứ phải nhớ.</div>

<h3>Hành động: -exec, và hai kiểu kết thúc</h3>
<p><code>-exec</code> chạy một lệnh cho mỗi kết quả khớp, với <code>{}</code> thay chỗ cho đường dẫn. Cách bạn kết thúc nó làm hiệu năng chênh nhau cả bậc độ lớn:</p>
<pre><code><span class="tok-comment"># một tiến trình MỖI FILE — 5.000 file = 5.000 tiến trình</span>
find . -name "*.log" -exec gzip {} \\;

<span class="tok-comment"># gom nhiều đường dẫn nhất có thể vào một dòng lệnh — thường tổng cộng 2-3 tiến trình</span>
find . -name "*.log" -exec gzip {} +</code></pre>
<div class="out">real  0m9.412s     # với \\;
real  0m0.688s     # với +</div>
<p>Hãy dùng <code>+</code> mỗi khi lệnh nhận được nhiều tham số, tức là gần như luôn luôn. Dùng <code>\\;</code> khi lệnh chỉ nhận đúng một file, hoặc khi <code>{}</code> phải xuất hiện ở chỗ nào đó không phải cuối:</p>
<pre><code>find . -name "*.jpg" -exec mv {} {}.bak \\;      <span class="tok-comment"># {} hai lần → buộc phải dùng \\;</span>
find . -type d -name node_modules -exec du -sh {} +</code></pre>
<div class="callout ok"><code>-execdir</code> là người anh em an toàn hơn: nó chạy lệnh từ BÊN TRONG thư mục của chính file đó và truyền <code>./tên</code> thay vì một đường dẫn dài. Điều đó bịt một tình huống tranh chấp có thật, khi một thư mục bị thay bằng liên kết tượng trưng ngay giữa lúc đang đi, và nó tránh hẳn chuyện tên file bắt đầu bằng dấu gạch ngang.</div>

<h3>-print0 và xargs -0: tên file có dấu cách</h3>
<p>Dấu phân cách mặc định giữa các kết quả <code>find</code> là ký tự xuống dòng — mà xuống dòng lại là một ký tự HỢP LỆ trong tên file. Dấu cách cũng vậy. Nên việc đưa <code>find</code> qua ống vào bất cứ thứ gì cắt theo từ đều hỏng đúng với những tên file dễ do người dùng đặt nhất:</p>
<pre><code><span class="tok-comment"># HỎNG: "Báo cáo của tôi.pdf" đến nơi thành nhiều tham số</span>
find . -name "*.pdf" | xargs rm

<span class="tok-comment"># ĐÚNG: phân cách bằng NUL, byte duy nhất mà tên file không thể chứa</span>
find . -name "*.pdf" -print0 | xargs -0 rm

<span class="tok-comment"># Cũng đúng, và thường đơn giản hơn</span>
find . -name "*.pdf" -delete</code></pre>
<p><code>-print0</code> kết thúc mỗi đường dẫn bằng một byte 0 thay vì xuống dòng, và <code>xargs -0</code> cắt theo byte đó. Vì hệ thống file cấm NUL nằm trong tên file, cặp này không thể nhập nhằng — theo đúng thiết kế. Hễ bạn thấy <code>find | xargs</code> mà thiếu cặp <code>-print0</code>/<code>-0</code>, bạn đang nhìn một lỗi tiềm ẩn.</p>

<h3>-prune: bỏ qua node_modules và .git</h3>
<p>Lọc bỏ một thư mục bằng <code>! -path "*/node_modules/*"</code> thì chạy được, nhưng <code>find</code> vẫn đi xuống trong đó và thử từng file trong số 40.000 file bên trong. <code>-prune</code> bảo nó đừng bước vào chút nào:</p>
<pre><code>find . \\( -name node_modules -o -name .git \\) -prune -o -type f -name "*.ts" -print</code></pre>
<div class="out">./src/index.ts
./src/api/user.ts
./tests/user.test.ts</div>
<p>Hãy đọc nó là: "nếu mục này là <code>node_modules</code> hoặc <code>.git</code> thì tỉa đi (đừng đi xuống, và ngừng tính tiếp); <em>NGƯỢC LẠI</em>, nếu nó là file <code>.ts</code> thì in ra". Chữ <code>-print</code> ở cuối là BẮT BUỘC ở đây — <code>-print</code> mặc định chỉ được ngầm hiểu khi biểu thức không chứa hành động nào cả, mà <code>-prune</code> tính là một hành động. Thiếu nó, bạn nhận về mọi đường dẫn, cả bị tỉa lẫn không.</p>
<div class="callout">Trên một kho mã lớn, đây không phải tối ưu vụn vặt. Đo thật trên một dự án có 62.000 file trong <code>node_modules</code>: 4,1 giây khi không có <code>-prune</code>, 0,3 giây khi có.</div>

<h3>-maxdepth phải đứng trước các phép thử</h3>
<pre><code>find . -maxdepth 2 -name "*.json"     <span class="tok-comment"># đúng</span>
find . -name "*.json" -maxdepth 2     <span class="tok-comment"># vẫn chạy, nhưng cảnh báo — và là một cái bẫy</span></code></pre>
<div class="out">find: warning: you have specified the global option -maxdepth after the argument -name,
but global options are not positional: -maxdepth affects tests specified before it
as well as those specified after it.</div>
<p>Lời cảnh báo nói toạc phần vẫn được giấu: tuỳ chọn vị trí áp dụng cho <em>TOÀN BỘ</em> biểu thức bất kể bạn viết nó ở đâu, nên viết muộn tạo ra một lệnh ĐỌC khác với cách nó CHẠY. Nhân tiện, <code>-maxdepth 1</code> chính là cách làm cho <code>find</code> không đệ quy — hữu ích khi bạn muốn các phép thử của <code>find</code> mà không muốn nó đi khắp cây.</p>

<h3>Những công thức đáng giữ lại</h3>
<pre><code><span class="tok-comment"># 20 file lớn nhất dưới /var, đọc được bằng mắt người</span>
find /var -type f -printf '%s\\t%p\\n' 2&gt;/dev/null | sort -rn | head -20 | numfmt --field=1 --to=iec

<span class="tok-comment"># Xoá tệp dựng cũ hơn 30 ngày (in ra trước! luôn in ra trước)</span>
find /var/backups -type f -name "*.tar.gz" -mtime +30 -print
find /var/backups -type f -name "*.tar.gz" -mtime +30 -delete

<span class="tok-comment"># Mọi file đã đổi kể từ lần deploy gần nhất</span>
find . -newer /var/run/last-deploy -type f \\! -path "*/.git/*"

<span class="tok-comment"># File cả thế giới ghi được — một phát hiện an ninh có thật</span>
find /opt -type f -perm -0002 -ls

<span class="tok-comment"># Thư mục rỗng, sâu nhất trước (-depth quan trọng ở đây)</span>
find . -depth -type d -empty -delete

<span class="tok-comment"># Tìm bên trong kết quả: find chọn, grep đọc</span>
find . -name "*.env*" -type f -exec grep -l "SECRET" {} +</code></pre>

<h3>Những lựa chọn nhanh hơn, và khi nào chúng nói dối</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>fd</code></span><span class="v">Bản viết lại đời mới: <code>fd '\\.ts$' src</code>. Tôn trọng <code>.gitignore</code>, bỏ qua file ẩn, chạy song song, cú pháp dễ chịu hơn hẳn. Không có sẵn — <code>apt install fd-find</code>, và trên Debian/Ubuntu tên chương trình là <code>fdfind</code>.</span></div>
  <div class="kv"><span class="k"><code>locate</code> / <code>plocate</code></span><span class="v">Tức thì, vì nó truy vấn một cơ sở dữ liệu thay vì đọc đĩa. Cơ sở dữ liệu đó được dựng lại bởi một hẹn giờ hằng ngày, nên nó KHÔNG biết gì về những thứ tạo ra sau đó — kể cả file bạn vừa tạo hai phút trước. Chạy <code>sudo updatedb</code>, hoặc chấp nhận sự cũ kỹ đó.</span></div>
</div>
<p>Dù sao vẫn hãy học <code>find</code>. Nó có trên mọi máy Linux từng được dựng ra, kể cả cái container tối giản mà một ngày nào đó bạn phải gỡ lỗi lúc 2 giờ sáng, không có trình quản lý gói nào.</p>

<a class="link-card" href="https://man7.org/linux/man-pages/man1/find.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">find(1) — bộ hướng dẫn đầy đủ</span><span class="lc-sub">Dài, nhưng riêng hai mục "EXPRESSION" và "EXAMPLES" đã đáng công đọc. Các mã định dạng của <code>-printf</code> cũng nằm ở đây.</span></span>
</a>
<a class="link-card" href="https://www.gnu.org/software/findutils/manual/html_mono/find.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">GNU Findutils Manual — Security Considerations</span><span class="lc-sub">Giải thích chính xác vì sao <code>-execdir</code> và <code>-print0</code> tồn tại, với các tình huống tranh chấp được viết ra rõ ràng. Một tài liệu hiếm và thật sự hữu ích.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: truy vấn một hệ thống file bừa bộn</span><span class="lc-sub">Bài chấm điểm về <code>-prune</code>, các mốc <code>-mtime</code> và <code>-exec … +</code>, trên một cây mẫu có cả tên file chứa dấu cách lẫn tên bắt đầu bằng gạch ngang.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> <code>-delete</code> là một HÀNH ĐỘNG, và hành động được tính <em>THEO ĐÚNG THỨ TỰ VIẾT RA</em>. <code>find . -delete -name "*.log"</code> xoá sạch cả cây rồi mới đi kiểm tra tên của những thứ nó vừa xoá. find của GNU từ chối riêng trường hợp này, nhưng bài học chung vẫn đúng: đặt <code>-delete</code> ở cuối, và chạy lệnh y hệt với <code>-print</code> trước — MỖI LẦN, kể cả những lần bạn chắc chắn.</div>
<p class="note-ct"><strong>Hai thói quen làm find trở nên an toàn:</strong> (1) dựng lệnh bằng <code>-print</code>, đọc danh sách, rồi mới tráo hành động vào — các phép thử không đổi nên danh sách cũng không đổi; (2) nếu lệnh đụng tới bất cứ thứ gì ngoài thư mục dự án của bạn, hãy thêm <code>-maxdepth</code> như một cái hạn chế bán kính nổ, kể cả khi bạn không cần tới nó. Cả hai đều không tốn gì, và cả hai đều từng cứu những hệ thống production.</p>
</div>
`,
    },
    /* ─────────────────────────── 2.4 ─────────────────────────── */
    {
      title: '2.4 — Links and archives: inodes, symlinks, and tar without looking it up|||2.4 — Liên kết và kho nén: inode, symlink, và tar mà không phải tra lại',
      slug: 'lnx-2-4-lien-ket-va-nen',
      type: 'LESSON',
      description: 'Liên kết cứng và liên kết tượng trưng khác nhau ở đâu trong mô hình inode, cách tráo symlink một cách nguyên tử khi deploy, và tar/gzip/xz/zstd với đủ cờ để không bao giờ phải tra lại — kèm số đo thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.4</span>
<h2>Links and archives</h2>
<p class="lead">Two topics that look unrelated but share a root: both are about the difference between a <em>name</em> and the <em>thing</em> it names. Once you see that a filename is just a pointer, hard links stop being mysterious, <code>rm</code> stops being scary in the way you thought, and the reason a deploy can swap a whole application in one atomic step becomes obvious.</p>

<h3>A filename is not a file</h3>
<p>Lesson 1.4 introduced inodes. Here is the part that matters now: the directory entry and the file are two different objects.</p>

<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Directory entry</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">report.txt → inode 4021</span><span class="lz-nsub">A name in a directory, and a number. That is all a directory contains.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">backup.txt → inode 4021</span><span class="lz-nsub">A HARD LINK: a second name pointing at the very same inode. Neither name is "the original".</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">shortcut.txt → inode 4099</span><span class="lz-nsub">A SYMLINK: its own inode, whose content is the text "report.txt". Resolved at open time.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Inode 4021</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">metadata + link count = 2</span><span class="lz-nsub">Size, owner, permissions, timestamps, and pointers to the data blocks. No name lives here.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Data blocks</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">the actual bytes</span><span class="lz-nsub">Freed only when the link count reaches 0 AND no process still has the file open.</span></div></div>
  </div>
</div>

<pre><code>echo "hello" &gt; report.txt
ln    report.txt backup.txt      <span class="tok-comment"># hard link — a second NAME</span>
ln -s report.txt shortcut.txt    <span class="tok-comment"># symbolic link — a small file holding a PATH</span>
ls -li</code></pre>
<div class="out">4021 -rw-r--r-- 2 you you  6 Aug 22 10:14 backup.txt
4021 -rw-r--r-- 2 you you  6 Aug 22 10:14 report.txt
4099 lrwxrwxrwx 1 you you 10 Aug 22 10:14 shortcut.txt -> report.txt</div>
<p>Read the columns: <code>report.txt</code> and <code>backup.txt</code> share inode <strong>4021</strong> and both show a link count of <strong>2</strong>. <code>shortcut.txt</code> has its own inode, a size of 10 bytes (the length of the string <code>report.txt</code>), and type <code>l</code>.</p>

<h3>The consequences, one by one</h3>
<pre><code>rm report.txt
cat backup.txt        <span class="tok-comment"># still works — link count went 2 → 1</span>
cat shortcut.txt      <span class="tok-comment"># BROKEN — its target name no longer exists</span></code></pre>
<div class="out">hello
cat: shortcut.txt: No such file or directory</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Hard link</span><span class="v">Indistinguishable from "the original" — there is no original. Deleting any one name leaves the data intact until the last name goes. Cannot cross filesystems (inode numbers are per-filesystem). Cannot point at a directory.</span></div>
  <div class="kv"><span class="k">Symlink</span><span class="v">A tiny file containing a path string. Can point anywhere — another disk, a directory, or nothing at all. Can dangle. Costs one inode.</span></div>
</div>
<div class="callout">This is also the honest explanation of what <code>rm</code> does. The system call is <code>unlink()</code>: it removes a <em>name</em> and decrements the count. The data disappears as a side effect of the last name disappearing — which is exactly why a deleted-but-still-open log file keeps consuming disk (Lesson 1.4), and why <code>mv</code> within one filesystem is instant (Lesson 2.1). One model, three behaviours you already met.</div>

<h3>Relative versus absolute symlinks</h3>
<p>A symlink stores whatever path you gave it, verbatim. That choice decides whether it survives being moved:</p>
<pre><code>ln -s config.yml current.yml           <span class="tok-comment"># relative — resolved from the LINK's directory</span>
ln -s /etc/app/config.yml current.yml  <span class="tok-comment"># absolute — same target from anywhere</span>

ln -sr /etc/app/config.yml current.yml <span class="tok-comment"># -r: give an absolute path, store a relative one</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Relative</span><span class="v">Survives moving or copying the whole tree — a container image, a tarball, a chroot. Breaks if you move the link alone.</span></div>
  <div class="kv"><span class="k">Absolute</span><span class="v">Survives moving the link. Breaks the moment the tree is mounted somewhere else, which is every container and every backup restore.</span></div>
</div>
<p>Inside a project, prefer relative. For pointing at a fixed system path such as <code>/usr/share</code>, absolute is right.</p>

<h3>Reading and following links</h3>
<pre><code>readlink shortcut.txt        <span class="tok-comment"># the stored string, one level</span>
readlink -f shortcut.txt     <span class="tok-comment"># follow every level to the real path</span>
realpath shortcut.txt        <span class="tok-comment"># same idea, clearer name</span>
ls -l /usr/bin/python3       <span class="tok-comment"># see a real-world chain</span>
readlink -f /usr/bin/python3</code></pre>
<div class="out">python3 -> python3.12
/usr/bin/python3.12</div>
<p>Most commands follow symlinks by default. The exceptions matter: <code>rm shortcut.txt</code> removes the <em>link</em>, never the target — but <code>rm shortcut/</code>, with the trailing slash, follows into the directory. <code>cp</code> copies the target unless you pass <code>-P</code> (or <code>-a</code>, which implies it) to copy the link itself.</p>

<h3>Where you meet symlinks in real work</h3>
<pre><code><span class="tok-comment"># Atomic deploy: build the new release beside the old one, then swap one pointer</span>
/srv/app/releases/2026-08-22-a1b2c3/
/srv/app/releases/2026-08-21-9f8e7d/
/srv/app/current -&gt; releases/2026-08-22-a1b2c3

ln -sfn releases/2026-08-22-a1b2c3 /srv/app/current-new
mv -T /srv/app/current-new /srv/app/current</code></pre>
<div class="callout ok">The two flags carry the whole trick. <code>-n</code> stops <code>ln</code> from following an existing symlink-to-directory and creating the new link <em>inside</em> it — the classic bug that produces <code>current/releases/...</code>. And <code>mv -T</code> performs a <code>rename()</code>, which the kernel guarantees is atomic: any process opening <code>current</code> sees either the old release or the new one, never a half-swapped state and never a missing path. Rollback is the same command with yesterday's directory. This is how Capistrano, Deployer and most hand-rolled deploy scripts work.</div>
<p>You will also meet symlinks in <code>/etc/alternatives</code> (how Debian switches between java or python versions), in <code>node_modules/.bin</code> (each entry links to the real script inside its package), and in <code>/etc/nginx/sites-enabled</code> (each file links back to one in <code>sites-available</code>, so enabling a site is creating a link and disabling it is removing one).</p>

<h3>tar: two ideas, not one</h3>
<p><code>tar</code> is short for <em>tape archive</em>, and its job is narrower than people assume: it concatenates many files into one stream, preserving names, permissions, ownership and timestamps. It does <strong>not</strong> compress. Compression is a separate program that <code>tar</code> pipes through for you:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Archive</span><span class="lz-t">many files → one .tar stream</span><span class="lz-d">tar's actual job. Metadata preserved: mode, owner, mtime, symlinks, directory structure.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Compress</span><span class="lz-t">.tar → .tar.gz / .tar.xz / .tar.zst</span><span class="lz-d">gzip, xz or zstd run on the whole stream. That is why tar compresses better than zip: it sees cross-file redundancy.</span></div>
</div>

<h3>The flags, and how to stop re-reading the man page</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-c</code> <code>-x</code> <code>-t</code></span><span class="v">Create · eXtract · lisT. Exactly one of these, always.</span></div>
  <div class="kv"><span class="k"><code>-f FILE</code></span><span class="v">The archive file. Must be immediately followed by the filename. Omit it and tar talks to stdin/stdout instead — which is a feature, see below.</span></div>
  <div class="kv"><span class="k"><code>-z</code> <code>-j</code> <code>-J</code> <code>--zstd</code></span><span class="v">gzip · bzip2 · xz · zstd. On GNU tar you can drop these entirely when extracting: it detects the format.</span></div>
  <div class="kv"><span class="k"><code>-v</code></span><span class="v">Verbose. Useful when creating, noisy when extracting a large archive.</span></div>
  <div class="kv"><span class="k"><code>-C DIR</code></span><span class="v">Change to DIR first. On extract it means "put it here"; on create it means "treat paths as relative to here".</span></div>
</div>
<pre><code>tar -czf backup.tar.gz ./project      <span class="tok-comment"># Create Zipped File</span>
tar -tzf backup.tar.gz | head         <span class="tok-comment"># lisT — ALWAYS do this first</span>
tar -xzf backup.tar.gz                <span class="tok-comment"># eXtract</span>
tar -xzf backup.tar.gz -C /srv/app    <span class="tok-comment"># extract somewhere specific</span>
tar -xzf backup.tar.gz --strip-components=1   <span class="tok-comment"># drop the top-level directory</span></code></pre>
<div class="out">./project/
./project/src/
./project/src/index.ts
./project/package.json</div>
<div class="callout"><strong>The mnemonic that sticks:</strong> <code>-czf</code> is "Create Zipped File", <code>-xzf</code> is "eXtract Zipped File", <code>-tzf</code> is "lisT Zipped File". The <code>f</code> is last because the filename follows it.</div>

<h3>--strip-components, and why every release tarball needs it</h3>
<p>Almost every project tarball unpacks into a versioned top directory: <code>node-v22.6.0-linux-x64/bin/node</code>. If you want the contents in <code>/usr/local</code> without that wrapper, strip one level:</p>
<pre><code>tar -xzf node-v22.6.0-linux-x64.tar.gz -C /usr/local --strip-components=1</code></pre>
<p>This single flag is why installation instructions in READMEs so often work in one line. It is also the flag people most often do not know exists, and instead extract-then-<code>mv</code>, which is two more chances to get a path wrong.</p>

<h3>tar without -f: streaming</h3>
<p>Leave off <code>-f</code> and tar writes to stdout or reads from stdin. That turns it into a plumbing component:</p>
<pre><code><span class="tok-comment"># Copy a tree to another machine without a temporary file anywhere</span>
tar -cz ./project | ssh deploy@vps "tar -xz -C /srv"

<span class="tok-comment"># Copy preserving permissions and hard links, faster than cp -a on many small files</span>
tar -c -C /src . | tar -x -C /dst

<span class="tok-comment"># Look inside a Docker image's filesystem</span>
docker export my-container | tar -t | head -20</code></pre>
<p>The first line is worth internalising: no intermediate file means no disk space needed for the archive, and compression happens before the network rather than after.</p>

<h3>Which compressor, measured</h3>
<p>Same input every time — a 512 MB <code>node_modules</code> directory, on 8 cores:</p>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>gzip</code> (-z)</span><span class="v">142 MB · 21 s to compress · 3.1 s to decompress. Universally available. The safe default when someone else must open it.</span></div>
  <div class="kv"><span class="k"><code>bzip2</code> (-j)</span><span class="v">128 MB · 96 s · 14 s. Superseded — slower than xz for worse ratios. Only for reading old archives.</span></div>
  <div class="kv"><span class="k"><code>xz</code> (-J)</span><span class="v">98 MB · 188 s · 6.4 s. Smallest. Use when you compress once and download many times, e.g. a release artefact.</span></div>
  <div class="kv"><span class="k"><code>zstd</code> (--zstd)</span><span class="v">134 MB · <strong>4.2 s</strong> · 1.1 s. With <code>-19</code>: 101 MB in 71 s. The best default in 2026 when you control both ends.</span></div>
</div>
<div class="callout ok">Rule of thumb: <strong>zstd</strong> for backups and anything internal, <strong>gzip</strong> for anything a stranger will open, <strong>xz</strong> for public downloads where bandwidth is the cost. Set <code>GZIP=-9</code> or use <code>-I 'zstd -19 -T0'</code> to tune levels; <code>-T0</code> tells zstd and xz to use every core, which is usually a 4-6× speedup they do not take by default.</div>

<h3>zip, for when the other end is Windows</h3>
<pre><code>zip -r archive.zip ./project      <span class="tok-comment"># -r is required for directories</span>
unzip -l archive.zip              <span class="tok-comment"># list — the -t equivalent</span>
unzip archive.zip -d /srv/app     <span class="tok-comment"># -d, not -C</span></code></pre>
<p><code>zip</code> compresses each file separately, so it loses the cross-file redundancy that makes <code>.tar.gz</code> smaller. It also stores no Unix permissions reliably and no ownership at all. Use it for interop, not for backups.</p>

<h3>Single-file compression</h3>
<pre><code>gzip big.log            <span class="tok-comment"># REPLACES it with big.log.gz — the original is gone</span>
gzip -k big.log         <span class="tok-comment"># -k keeps the original</span>
gunzip big.log.gz
zcat big.log.gz | grep ERROR    <span class="tok-comment"># read without decompressing to disk</span>
zless big.log.gz                <span class="tok-comment"># page through a compressed file</span>
zgrep -c ERROR big.log.gz       <span class="tok-comment"># grep straight into the archive</span></code></pre>
<p>The <code>z*</code> family (<code>zcat</code>, <code>zless</code>, <code>zgrep</code>, <code>zdiff</code>) exists precisely so that rotated logs stay searchable. There is no reason to decompress a 4 GB <code>.gz</code> just to grep it.</p>

<a class="link-card" href="https://www.gnu.org/software/tar/manual/tar.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">GNU tar Manual</span><span class="lc-sub">The "Choosing Files" and "Changing Directories" chapters cover <code>--strip-components</code>, <code>--exclude</code> and <code>-C</code> properly — the three things worth knowing beyond czf/xzf.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man7/symlink.7.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">symlink(7) — how the kernel resolves links</span><span class="lc-sub">Which system calls follow links and which do not, laid out in a table. This is the page that settles arguments.</span></span>
</a>
<a class="link-card" href="https://github.com/facebook/zstd" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">zstd — benchmarks and level guide</span><span class="lc-sub">The README's comparison table shows why zstd replaced gzip as the sensible default, with numbers you can reproduce.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: links, atomic swaps, and archives</span><span class="lc-sub">Build a releases/current deploy layout, swap it atomically, then pack and restore it while preserving permissions.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> <code>tar -czf backup.tar.gz *</code> silently omits every dotfile — <code>.env</code>, <code>.gitignore</code>, <code>.github/</code> — because the shell expands the <code>*</code> before tar ever runs, and globs skip leading dots (Lesson 2.2). The archive looks fine, lists fine, and restores an application that will not start. Archive the <em>directory</em> instead: <code>tar -czf backup.tar.gz ./project</code>, or from inside it, <code>tar -czf ../backup.tar.gz .</code> — the single dot is a path, not a glob, so nothing is skipped.</div>
<p class="note-ct"><strong>Always list before you extract.</strong> <code>tar -tzf archive.tar.gz | head</code> costs one second and tells you whether the archive contains <code>project/…</code> or four hundred loose files that are about to spray across your current directory — the "tar bomb". While you are there, check for a leading <code>/</code>: GNU tar strips it and warns, but the warning scrolls past, and an archive built with <code>-P</code> genuinely can write to absolute paths.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.4</span>
<h2>Liên kết và kho nén</h2>
<p class="lead">Hai chủ đề trông chẳng liên quan nhưng chung một gốc: cả hai đều nói về khác biệt giữa một <em>CÁI TÊN</em> và <em>THỨ</em> mà nó gọi tên. Khi bạn thấy được rằng tên file chỉ là một con trỏ, liên kết cứng thôi bí ẩn, <code>rm</code> thôi đáng sợ theo cái kiểu bạn từng nghĩ, và lý do một lần deploy có thể tráo cả ứng dụng trong đúng một bước nguyên tử trở nên hiển nhiên.</p>

<h3>Tên file không phải là file</h3>
<p>Bài 1.4 đã giới thiệu inode. Đây là phần quan trọng lúc này: mục thư mục và file là hai đối tượng KHÁC NHAU.</p>

<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Mục thư mục</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">report.txt → inode 4021</span><span class="lz-nsub">Một cái tên trong một thư mục, và một con số. Thư mục chỉ chứa có thế.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">backup.txt → inode 4021</span><span class="lz-nsub">LIÊN KẾT CỨNG: một cái tên thứ hai trỏ vào đúng cùng một inode. Không cái tên nào là "bản gốc".</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">shortcut.txt → inode 4099</span><span class="lz-nsub">LIÊN KẾT TƯỢNG TRƯNG: có inode riêng, nội dung là dòng chữ "report.txt". Được giải khi mở file.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Inode 4021</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">siêu dữ liệu + số liên kết = 2</span><span class="lz-nsub">Kích thước, chủ sở hữu, quyền, dấu thời gian, và con trỏ tới các khối dữ liệu. KHÔNG có cái tên nào ở đây.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Khối dữ liệu</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">các byte thật sự</span><span class="lz-nsub">Chỉ được giải phóng khi số liên kết về 0 VÀ không tiến trình nào còn mở file.</span></div></div>
  </div>
</div>

<pre><code>echo "hello" &gt; report.txt
ln    report.txt backup.txt      <span class="tok-comment"># liên kết cứng — một cái TÊN thứ hai</span>
ln -s report.txt shortcut.txt    <span class="tok-comment"># liên kết tượng trưng — một file nhỏ chứa một ĐƯỜNG DẪN</span>
ls -li</code></pre>
<div class="out">4021 -rw-r--r-- 2 you you  6 Aug 22 10:14 backup.txt
4021 -rw-r--r-- 2 you you  6 Aug 22 10:14 report.txt
4099 lrwxrwxrwx 1 you you 10 Aug 22 10:14 shortcut.txt -> report.txt</div>
<p>Hãy đọc các cột: <code>report.txt</code> và <code>backup.txt</code> dùng chung inode <strong>4021</strong> và cả hai đều hiện số liên kết là <strong>2</strong>. <code>shortcut.txt</code> có inode riêng, kích thước 10 byte (đúng bằng độ dài chuỗi <code>report.txt</code>), và loại <code>l</code>.</p>

<h3>Các hệ quả, từng cái một</h3>
<pre><code>rm report.txt
cat backup.txt        <span class="tok-comment"># vẫn chạy — số liên kết đi từ 2 xuống 1</span>
cat shortcut.txt      <span class="tok-comment"># HỎNG — cái tên nó trỏ tới không còn nữa</span></code></pre>
<div class="out">hello
cat: shortcut.txt: No such file or directory</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Liên kết cứng</span><span class="v">Không phân biệt được với "bản gốc" — vì không có bản gốc. Xoá bất kỳ cái tên nào thì dữ liệu vẫn nguyên cho tới khi cái tên cuối cùng biến mất. Không vượt được sang hệ thống file khác (số inode chỉ có nghĩa trong một hệ thống file). Không trỏ vào thư mục được.</span></div>
  <div class="kv"><span class="k">Liên kết tượng trưng</span><span class="v">Một file tí hon chứa một chuỗi đường dẫn. Trỏ đi đâu cũng được — sang đĩa khác, vào thư mục, hoặc vào hư không. Có thể trỏ hụt. Tốn một inode.</span></div>
</div>
<div class="callout">Đây cũng là lời giải thích trung thực về việc <code>rm</code> làm gì. Lời gọi hệ thống là <code>unlink()</code>: nó gỡ một <em>CÁI TÊN</em> và giảm số đếm đi một. Dữ liệu biến mất chỉ như một hệ quả phụ của việc cái tên cuối cùng biến mất — và đó chính xác là lý do một file log đã xoá nhưng còn được mở vẫn ăn đĩa (Bài 1.4), và lý do <code>mv</code> trong cùng một hệ thống file là tức thì (Bài 2.1). Một mô hình, ba hành vi bạn đã gặp.</div>

<h3>Liên kết tương đối so với tuyệt đối</h3>
<p>Một symlink lưu đúng nguyên văn đường dẫn bạn đưa cho nó. Lựa chọn đó quyết định nó có sống sót khi bị di chuyển hay không:</p>
<pre><code>ln -s config.yml current.yml           <span class="tok-comment"># tương đối — giải từ thư mục của CHÍNH LIÊN KẾT</span>
ln -s /etc/app/config.yml current.yml  <span class="tok-comment"># tuyệt đối — cùng một đích từ bất cứ đâu</span>

ln -sr /etc/app/config.yml current.yml <span class="tok-comment"># -r: đưa đường dẫn tuyệt đối, lưu ra đường dẫn tương đối</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Tương đối</span><span class="v">Sống sót khi cả cây bị di chuyển hoặc sao chép — một ảnh container, một file tar, một chroot. Hỏng nếu bạn chỉ di chuyển riêng cái liên kết.</span></div>
  <div class="kv"><span class="k">Tuyệt đối</span><span class="v">Sống sót khi di chuyển cái liên kết. Hỏng ngay khi cả cây được gắn ở chỗ khác — tức là mọi container và mọi lần khôi phục sao lưu.</span></div>
</div>
<p>Bên trong một dự án, hãy ưu tiên tương đối. Để trỏ tới một đường dẫn hệ thống cố định như <code>/usr/share</code> thì tuyệt đối mới đúng.</p>

<h3>Đọc và đi theo liên kết</h3>
<pre><code>readlink shortcut.txt        <span class="tok-comment"># chuỗi đã lưu, đúng một tầng</span>
readlink -f shortcut.txt     <span class="tok-comment"># đi theo mọi tầng tới đường dẫn thật</span>
realpath shortcut.txt        <span class="tok-comment"># cùng ý tưởng, tên rõ hơn</span>
ls -l /usr/bin/python3       <span class="tok-comment"># xem một chuỗi liên kết ngoài đời</span>
readlink -f /usr/bin/python3</code></pre>
<div class="out">python3 -> python3.12
/usr/bin/python3.12</div>
<p>Hầu hết lệnh đi theo symlink theo mặc định. Những ngoại lệ mới đáng nhớ: <code>rm shortcut.txt</code> gỡ <em>CÁI LIÊN KẾT</em>, không bao giờ gỡ đích — nhưng <code>rm shortcut/</code>, có dấu gạch chéo cuối, lại đi vào trong thư mục. <code>cp</code> chép ĐÍCH trừ khi bạn thêm <code>-P</code> (hoặc <code>-a</code>, vốn đã bao hàm nó) để chép chính cái liên kết.</p>

<h3>Bạn gặp symlink ở đâu trong công việc thật</h3>
<pre><code><span class="tok-comment"># Deploy nguyên tử: dựng bản mới cạnh bản cũ, rồi tráo đúng một con trỏ</span>
/srv/app/releases/2026-08-22-a1b2c3/
/srv/app/releases/2026-08-21-9f8e7d/
/srv/app/current -&gt; releases/2026-08-22-a1b2c3

ln -sfn releases/2026-08-22-a1b2c3 /srv/app/current-new
mv -T /srv/app/current-new /srv/app/current</code></pre>
<div class="callout ok">Hai cái cờ đó gánh toàn bộ mẹo này. <code>-n</code> ngăn <code>ln</code> đi theo một symlink-trỏ-vào-thư-mục đang tồn tại rồi tạo liên kết mới <em>BÊN TRONG</em> nó — lỗi kinh điển sinh ra <code>current/releases/...</code>. Còn <code>mv -T</code> thực hiện một <code>rename()</code>, thứ mà nhân bảo đảm là nguyên tử: bất kỳ tiến trình nào mở <code>current</code> đều thấy hoặc bản cũ hoặc bản mới, không bao giờ thấy trạng thái tráo dở, và không bao giờ thấy đường dẫn biến mất. Quay lui chính là lệnh đó với thư mục của hôm qua. Capistrano, Deployer và phần lớn script deploy tự viết đều chạy theo cách này.</div>
<p>Bạn cũng sẽ gặp symlink trong <code>/etc/alternatives</code> (cách Debian chuyển giữa các phiên bản java hay python), trong <code>node_modules/.bin</code> (mỗi mục liên kết tới script thật bên trong gói của nó), và trong <code>/etc/nginx/sites-enabled</code> (mỗi file liên kết ngược về một file trong <code>sites-available</code>, nên bật một site là tạo một liên kết còn tắt nó là gỡ liên kết đi).</p>

<h3>tar: hai ý tưởng, không phải một</h3>
<p><code>tar</code> viết tắt của <em>tape archive</em>, và việc của nó hẹp hơn người ta tưởng: nó nối nhiều file thành một dòng duy nhất, giữ nguyên tên, quyền, chủ sở hữu và dấu thời gian. Nó <strong>KHÔNG</strong> nén. Nén là một chương trình riêng mà <code>tar</code> đưa dòng đó chảy qua giúp bạn:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Gói</span><span class="lz-t">nhiều file → một dòng .tar</span><span class="lz-d">Đây mới là việc thật của tar. Siêu dữ liệu được giữ: quyền, chủ, mtime, symlink, cấu trúc thư mục.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Nén</span><span class="lz-t">.tar → .tar.gz / .tar.xz / .tar.zst</span><span class="lz-d">gzip, xz hoặc zstd chạy trên TOÀN BỘ dòng. Đó là lý do tar nén tốt hơn zip: nó nhìn thấy phần trùng lặp GIỮA các file.</span></div>
</div>

<h3>Các cờ, và cách thôi phải đọc lại trang man</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-c</code> <code>-x</code> <code>-t</code></span><span class="v">Create (tạo) · eXtract (bung) · lisT (liệt kê). Luôn có đúng một trong ba.</span></div>
  <div class="kv"><span class="k"><code>-f FILE</code></span><span class="v">File kho nén. Phải đứng ngay trước tên file. Bỏ nó đi thì tar nói chuyện với stdin/stdout — mà đó lại là một tính năng, xem bên dưới.</span></div>
  <div class="kv"><span class="k"><code>-z</code> <code>-j</code> <code>-J</code> <code>--zstd</code></span><span class="v">gzip · bzip2 · xz · zstd. Với tar của GNU, lúc bung bạn bỏ hẳn các cờ này cũng được: nó tự nhận ra định dạng.</span></div>
  <div class="kv"><span class="k"><code>-v</code></span><span class="v">Chi tiết. Hữu ích lúc tạo, ồn ào lúc bung một kho lớn.</span></div>
  <div class="kv"><span class="k"><code>-C DIR</code></span><span class="v">Chuyển sang DIR trước đã. Lúc bung nó nghĩa là "để vào đây"; lúc tạo nó nghĩa là "coi các đường dẫn là tương đối với chỗ này".</span></div>
</div>
<pre><code>tar -czf backup.tar.gz ./project      <span class="tok-comment"># Create Zipped File</span>
tar -tzf backup.tar.gz | head         <span class="tok-comment"># lisT — LUÔN làm việc này trước</span>
tar -xzf backup.tar.gz                <span class="tok-comment"># eXtract</span>
tar -xzf backup.tar.gz -C /srv/app    <span class="tok-comment"># bung vào một chỗ cụ thể</span>
tar -xzf backup.tar.gz --strip-components=1   <span class="tok-comment"># bỏ đi thư mục bọc ngoài cùng</span></code></pre>
<div class="out">./project/
./project/src/
./project/src/index.ts
./project/package.json</div>
<div class="callout"><strong>Cách nhớ dính chặt:</strong> <code>-czf</code> là "Create Zipped File", <code>-xzf</code> là "eXtract Zipped File", <code>-tzf</code> là "lisT Zipped File". Chữ <code>f</code> đứng cuối vì tên file đi ngay sau nó.</div>

<h3>--strip-components, và vì sao mọi bản phát hành dạng tar đều cần nó</h3>
<p>Gần như mọi file tar của dự án đều bung ra thành một thư mục có số phiên bản ở ngoài cùng: <code>node-v22.6.0-linux-x64/bin/node</code>. Nếu bạn muốn nội dung nằm thẳng trong <code>/usr/local</code> mà không có lớp bọc đó, hãy lột đi một tầng:</p>
<pre><code>tar -xzf node-v22.6.0-linux-x64.tar.gz -C /usr/local --strip-components=1</code></pre>
<p>Đúng một cái cờ này là lý do hướng dẫn cài đặt trong các file README thường chạy được chỉ trong một dòng. Nó cũng là cái cờ mà người ta hay không biết là có tồn tại nhất, và thay vào đó họ bung-rồi-<code>mv</code>, tức là thêm hai cơ hội nữa để gõ sai đường dẫn.</p>

<h3>tar không có -f: chảy thành dòng</h3>
<p>Bỏ <code>-f</code> đi thì tar ghi ra stdout hoặc đọc từ stdin. Điều đó biến nó thành một mắt xích đường ống:</p>
<pre><code><span class="tok-comment"># Chép cả cây sang máy khác mà không cần file tạm ở bất cứ đâu</span>
tar -cz ./project | ssh deploy@vps "tar -xz -C /srv"

<span class="tok-comment"># Chép mà vẫn giữ quyền và liên kết cứng, nhanh hơn cp -a với nhiều file nhỏ</span>
tar -c -C /src . | tar -x -C /dst

<span class="tok-comment"># Nhìn vào bên trong hệ thống file của một ảnh Docker</span>
docker export my-container | tar -t | head -20</code></pre>
<p>Dòng đầu tiên đáng thấm: không có file trung gian nghĩa là không cần chỗ trống trên đĩa cho kho nén, và việc nén xảy ra TRƯỚC khi qua mạng chứ không phải sau.</p>

<h3>Chọn bộ nén nào, đo thật</h3>
<p>Cùng một đầu vào mỗi lần — một thư mục <code>node_modules</code> 512 MB, trên 8 nhân:</p>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>gzip</code> (-z)</span><span class="v">142 MB · nén 21 giây · bung 3,1 giây. Có ở khắp mọi nơi. Mặc định an toàn khi người khác phải mở nó.</span></div>
  <div class="kv"><span class="k"><code>bzip2</code> (-j)</span><span class="v">128 MB · 96 giây · 14 giây. Đã bị vượt qua — chậm hơn xz mà tỉ lệ lại tệ hơn. Chỉ dùng để đọc kho cũ.</span></div>
  <div class="kv"><span class="k"><code>xz</code> (-J)</span><span class="v">98 MB · 188 giây · 6,4 giây. Nhỏ nhất. Dùng khi nén một lần và tải về nhiều lần, ví dụ một bản phát hành.</span></div>
  <div class="kv"><span class="k"><code>zstd</code> (--zstd)</span><span class="v">134 MB · <strong>4,2 giây</strong> · 1,1 giây. Với <code>-19</code>: 101 MB trong 71 giây. Mặc định tốt nhất năm 2026 khi bạn nắm cả hai đầu.</span></div>
</div>
<div class="callout ok">Quy tắc bỏ túi: <strong>zstd</strong> cho sao lưu và mọi thứ nội bộ, <strong>gzip</strong> cho thứ người lạ sẽ mở, <strong>xz</strong> cho bản tải công khai nơi băng thông mới là chi phí. Đặt <code>GZIP=-9</code> hoặc dùng <code>-I 'zstd -19 -T0'</code> để chỉnh mức nén; <code>-T0</code> bảo zstd và xz dùng mọi nhân, thường nhanh gấp 4-6 lần, thứ mà mặc định chúng không tự làm.</div>

<h3>zip, cho khi đầu bên kia là Windows</h3>
<pre><code>zip -r archive.zip ./project      <span class="tok-comment"># -r là bắt buộc với thư mục</span>
unzip -l archive.zip              <span class="tok-comment"># liệt kê — tương đương -t</span>
unzip archive.zip -d /srv/app     <span class="tok-comment"># là -d, không phải -C</span></code></pre>
<p><code>zip</code> nén từng file riêng lẻ, nên nó đánh mất phần trùng lặp giữa các file — thứ làm cho <code>.tar.gz</code> nhỏ hơn. Nó cũng không lưu quyền Unix một cách đáng tin và hoàn toàn không lưu chủ sở hữu. Hãy dùng nó để trao đổi qua lại, đừng dùng để sao lưu.</p>

<h3>Nén từng file lẻ</h3>
<pre><code>gzip big.log            <span class="tok-comment"># THAY THẾ nó bằng big.log.gz — bản gốc mất</span>
gzip -k big.log         <span class="tok-comment"># -k giữ lại bản gốc</span>
gunzip big.log.gz
zcat big.log.gz | grep ERROR    <span class="tok-comment"># đọc mà không cần bung ra đĩa</span>
zless big.log.gz                <span class="tok-comment"># lật từng trang một file đã nén</span>
zgrep -c ERROR big.log.gz       <span class="tok-comment"># grep thẳng vào trong kho nén</span></code></pre>
<p>Cả họ <code>z*</code> (<code>zcat</code>, <code>zless</code>, <code>zgrep</code>, <code>zdiff</code>) tồn tại đúng để log đã xoay vòng vẫn tìm kiếm được. Không có lý do gì phải bung một file <code>.gz</code> 4 GB chỉ để grep nó.</p>

<a class="link-card" href="https://www.gnu.org/software/tar/manual/tar.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">GNU tar Manual</span><span class="lc-sub">Hai chương "Choosing Files" và "Changing Directories" nói tử tế về <code>--strip-components</code>, <code>--exclude</code> và <code>-C</code> — ba thứ đáng biết ngoài czf/xzf.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man7/symlink.7.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">symlink(7) — nhân giải liên kết ra sao</span><span class="lc-sub">Lời gọi hệ thống nào đi theo liên kết và lời gọi nào không, bày ra thành bảng. Đây là trang dùng để kết thúc tranh cãi.</span></span>
</a>
<a class="link-card" href="https://github.com/facebook/zstd" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">zstd — số đo và hướng dẫn chọn mức nén</span><span class="lc-sub">Bảng so sánh trong README cho thấy vì sao zstd thay chỗ gzip làm mặc định hợp lý, với những con số bạn tự dựng lại được.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: liên kết, tráo nguyên tử, và kho nén</span><span class="lc-sub">Dựng bố cục deploy kiểu releases/current, tráo nó một cách nguyên tử, rồi đóng gói và khôi phục mà vẫn giữ nguyên quyền.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> <code>tar -czf backup.tar.gz *</code> âm thầm bỏ sót MỌI file ẩn — <code>.env</code>, <code>.gitignore</code>, <code>.github/</code> — vì shell khai triển dấu <code>*</code> TRƯỚC khi tar kịp chạy, và glob thì bỏ qua dấu chấm đứng đầu (Bài 2.2). Kho nén trông vẫn ổn, liệt kê vẫn ổn, và khôi phục ra một ứng dụng không khởi động được. Hãy đóng gói cả <em>THƯ MỤC</em>: <code>tar -czf backup.tar.gz ./project</code>, hoặc từ bên trong nó, <code>tar -czf ../backup.tar.gz .</code> — dấu chấm đơn là một đường dẫn chứ không phải glob, nên không sót gì cả.</div>
<p class="note-ct"><strong>Luôn liệt kê trước khi bung.</strong> <code>tar -tzf archive.tar.gz | head</code> tốn một giây và cho bạn biết kho nén chứa <code>project/…</code> hay bốn trăm file rời sắp phun tung toé khắp thư mục hiện tại — cái gọi là "bom tar". Nhân tiện, hãy kiểm luôn xem có dấu <code>/</code> đứng đầu không: tar của GNU cắt nó đi và cảnh báo, nhưng lời cảnh báo trôi qua rất nhanh, còn một kho nén dựng bằng <code>-P</code> thì thật sự ghi được vào đường dẫn tuyệt đối.</p>
</div>
`,
    },
    /* ─────────────────────────── 2.5 Quiz ─────────────────────────── */
    {
      title: '2.5 — Chapter 2 quiz|||2.5 — Kiểm tra Chương 2',
      slug: 'lnx-2-5-quiz',
      type: 'QUIZ',
      description: 'Tám câu về khai triển glob, glob không khớp, find có nháy và không nháy, -exec ; so với +, liên kết cứng so với tượng trưng, -mtime, tar và file ẩn, và tráo symlink nguyên tử.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on files, globs, find, links and archives. Answer from memory; they follow the lesson order.</p>
<div class="callout ok">Aim for 7/8. The three that matter most in real work: what <code>rm</code> actually receives (2.2), why an unquoted <code>-name</code> pattern is a bug (2.3), and what <code>tar -czf x.tar.gz *</code> silently leaves out (2.4).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về file, glob, find, liên kết và kho nén. Trả lời bằng trí nhớ; các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Ba câu quan trọng nhất trong việc thật: <code>rm</code> thật ra nhận được cái gì (bài 2.2), vì sao một mẫu <code>-name</code> không đặt trong nháy là một lỗi (bài 2.3), và <code>tar -czf x.tar.gz *</code> âm thầm bỏ sót thứ gì (bài 2.4).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'You run "rm *.log" in a directory holding app.log and db.log. What arguments does the rm program actually receive?|||Bạn chạy "rm *.log" trong thư mục có app.log và db.log. Chương trình rm thật sự nhận được những tham số nào?',
            options: [
              'The single string *.log — rm expands it itself|||Đúng một chuỗi *.log — rm tự khai triển nó',
              'Two filenames: app.log and db.log — the shell expanded the pattern before rm started|||Hai tên file: app.log và db.log — shell đã khai triển cái mẫu trước khi rm khởi động',
              'Nothing — rm reads the directory on its own|||Không gì cả — rm tự đọc thư mục',
              'The pattern plus the directory path, so rm can match them|||Cái mẫu cộng đường dẫn thư mục, để rm tự đối chiếu',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In a directory with no .csv files, what does the loop "for f in *.csv; do echo $f; done" print in default bash?|||Trong một thư mục không có file .csv nào, vòng lặp "for f in *.csv; do echo $f; done" in ra gì với bash mặc định?',
            options: [
              'Nothing — the loop body never runs|||Không gì cả — thân vòng lặp không chạy lần nào',
              'An error, and the script stops|||Một lỗi, và script dừng lại',
              'The literal text *.csv — an unmatched glob is passed through unchanged|||Đúng chữ *.csv — một glob không khớp được truyền qua nguyên văn',
              'An empty line, once per file in the directory|||Một dòng trống, mỗi file trong thư mục một dòng',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'Why is "find . -name *.log" (no quotes) a bug even when it appears to work?|||Vì sao "find . -name *.log" (không có nháy) là một lỗi kể cả khi nó có vẻ chạy đúng?',
            options: [
              'find cannot read patterns containing a dot|||find không đọc được mẫu có chứa dấu chấm',
              'The shell expands *.log against the CURRENT directory first, so find searches for those exact names — or errors if there are two|||Shell khai triển *.log theo thư mục HIỆN TẠI trước, nên find đi tìm đúng những cái tên đó — hoặc báo lỗi nếu có hai file',
              '-name only accepts regular expressions, not globs|||-name chỉ nhận biểu thức chính quy, không nhận glob',
              'Unquoted arguments are always passed as a single word|||Tham số không nháy luôn được truyền như một từ duy nhất',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is the practical difference between "-exec gzip {} \\\;" and "-exec gzip {} +"?|||Khác biệt thực tế giữa "-exec gzip {} \\\;" và "-exec gzip {} +" là gì?',
            options: [
              'The + version starts one process per file; the \\\; version starts one total|||Bản + khởi động một tiến trình mỗi file; bản \\\; khởi động tổng cộng một tiến trình',
              'They are identical; + is just newer syntax|||Chúng y hệt nhau; + chỉ là cú pháp mới hơn',
              'The \\\; version starts one process PER FILE; + batches many paths into one command line, usually far faster|||Bản \\\; khởi động một tiến trình MỖI FILE; còn + gom nhiều đường dẫn vào một dòng lệnh, thường nhanh hơn rất nhiều',
              '+ only works with -delete|||+ chỉ chạy được với -delete',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'report.txt and backup.txt are hard links to the same inode. You run "rm report.txt". What happens to the data?|||report.txt và backup.txt là hai liên kết cứng tới cùng một inode. Bạn chạy "rm report.txt". Dữ liệu ra sao?',
            options: [
              'It is deleted; backup.txt becomes a dangling link|||Nó bị xoá; backup.txt trở thành một liên kết trỏ hụt',
              'It stays intact — the link count drops from 2 to 1 and backup.txt still reads it fine|||Nó vẫn còn nguyên — số liên kết giảm từ 2 xuống 1 và backup.txt vẫn đọc được bình thường',
              'Both names are removed at once|||Cả hai cái tên cùng bị gỡ một lượt',
              'The data is moved into backup.txt, which doubles in size|||Dữ liệu được chuyển vào backup.txt, làm nó tăng gấp đôi kích thước',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A file was modified 6 hours ago. Which of these matches it?|||Một file được sửa cách đây 6 tiếng. Phép thử nào dưới đây khớp với nó?',
            options: [
              '-mtime 1, because 6 hours rounds up to one day|||-mtime 1, vì 6 tiếng làm tròn lên thành một ngày',
              '-mtime +0, because it is older than zero days|||-mtime +0, vì nó cũ hơn không ngày',
              '-mmin -420 — inside a day you must use -mmin, because -mtime truncates the age to 0 days|||-mmin -420 — trong vòng một ngày thì phải dùng -mmin, vì -mtime cắt tuổi xuống thành 0 ngày',
              '-mtime -0, which means "less than zero days"|||-mtime -0, nghĩa là "ít hơn không ngày"',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'You back up a project with "tar -czf backup.tar.gz *" and the restore will not start the app. What is missing?|||Bạn sao lưu một dự án bằng "tar -czf backup.tar.gz *" và bản khôi phục không khởi động được ứng dụng. Thiếu cái gì?',
            options: [
              'Every dotfile — .env, .gitignore, .github/ — because the shell expanded * and globs skip a leading dot|||Mọi file ẩn — .env, .gitignore, .github/ — vì shell đã khai triển dấu * mà glob thì bỏ qua dấu chấm đứng đầu',
              'File permissions, which tar never stores|||Quyền của file, thứ mà tar không bao giờ lưu',
              'Nothing — * includes everything in the directory|||Không thiếu gì — * bao gồm mọi thứ trong thư mục',
              'The compression failed silently because -z came before -f|||Việc nén âm thầm thất bại vì -z đứng trước -f',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A deploy swaps /srv/app/current with "ln -sfn <new> current-new" then "mv -T current-new current". Why not just "ln -sfn <new> current"?|||Một lần deploy tráo /srv/app/current bằng "ln -sfn <new> current-new" rồi "mv -T current-new current". Vì sao không dùng thẳng "ln -sfn <new> current"?',
            options: [
              'ln cannot overwrite an existing link at all|||ln hoàn toàn không ghi đè được một liên kết đang tồn tại',
              'Because mv -T is a single atomic rename() — no process can ever observe current missing or half-swapped|||Vì mv -T là một lời gọi rename() nguyên tử duy nhất — không tiến trình nào có thể bắt gặp lúc current biến mất hay đang tráo dở',
              'Because ln -sfn creates a hard link, which cannot point at a directory|||Vì ln -sfn tạo liên kết cứng, mà liên kết cứng thì không trỏ vào thư mục được',
              'It is only a style convention; both are equally safe|||Đó chỉ là quy ước hình thức; cả hai đều an toàn như nhau',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
