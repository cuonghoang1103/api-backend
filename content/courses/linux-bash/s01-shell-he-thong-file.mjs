/**
 * Linux & Bash — Chương 1: Shell & hệ thống file.
 * Dấu nhắc và ba lệnh đầu tiên · đường dẫn (tuyệt đối/tương đối, . .. ~ -) ·
 * cây thư mục và mỗi thư mục gốc để làm gì · nhìn kỹ một file (ls -l, stat, file) · quiz.
 * Output CHẠY THẬT Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 */
const REF = '?ref=%2Fcourses%2Flinux-bash%2Flearn&reflabel=Linux%20%26%20Bash';

export default {
  title: 'Chapter 1 — The shell & the filesystem|||Chương 1 — Shell & hệ thống file',
  description: 'Ba lệnh đầu tiên và cách đọc dấu nhắc, hệ thống đường dẫn mà mọi lệnh về sau đều dựa vào, cây thư mục Linux và ý nghĩa của từng thư mục gốc, và cách nhìn kỹ một file để biết nó thật sự là gì.',
  lessons: [
    /* ─────────────────────────── 1.1 ─────────────────────────── */
    {
      title: '1.1 — The prompt, and your first three commands|||1.1 — Dấu nhắc, và ba lệnh đầu tiên của bạn',
      slug: 'lnx-1-1-dau-nhac-ba-lenh',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Đọc dấu nhắc như đọc một bảng thông tin, pwd/ls/cd, cấu trúc chung của mọi lệnh Linux, và vì sao một dấu cách đặt sai làm hỏng cả câu lệnh.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>The prompt is a status bar</h2>
<p class="lead">Before typing anything, read what is already on the line. A default prompt carries four pieces of information, and two of them decide whether the next command is safe.</p>

<pre><code>an@lab:~/projects/api$ </code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">an</span><span class="lz-v">The user you are. Determines what you are allowed to touch (Chapter 4).</span></div>
  <div class="lz-layer"><span class="lz-k">lab</span><span class="lz-v">The machine's hostname. On a laptop this is decoration; over SSH it is the difference between your machine and production.</span></div>
  <div class="lz-layer"><span class="lz-k">~/projects/api</span><span class="lz-v">The current directory. Almost every command acts relative to this.</span></div>
  <div class="lz-layer"><span class="lz-k">\$ vs #</span><span class="lz-v"><strong>\$</strong> = an ordinary user. <strong>#</strong> = root, where nothing will stop you. Check this before anything destructive.</span></div>
</div>
<div class="callout danger">The <code>#</code> is not decoration. As root there are no permission errors — a mistyped path in <code>rm -rf</code> does not fail, it succeeds. Any time the prompt ends in <code>#</code>, slow down and re-read the command before pressing Enter.</div>

<h3>pwd — where am I?</h3>
<pre><code>pwd</code></pre>
<div class="out">/home/an/projects/api</div>
<p>"Print working directory". Every shell has a current directory, every relative path is resolved from it, and a surprising number of "the command did nothing" problems are really "I was somewhere else". It is the cheapest command in Linux and the one to run whenever something is confusing.</p>

<h3>ls — what is here?</h3>
<pre><code>ls</code></pre>
<div class="out">README.md  node_modules  package.json  src  tests</div>
<pre><code>ls -l</code></pre>
<div class="out">total 48
-rw-r--r--  1 an an  1204 Aug 21 14:20 README.md
drwxr-xr-x 84 an an  4096 Aug 20 09:11 node_modules
-rw-r--r--  1 an an  2891 Aug 21 11:02 package.json
drwxr-xr-x  6 an an  4096 Aug 21 14:18 src
drwxr-xr-x  3 an an  4096 Aug 19 16:40 tests</div>
<div class="kv-grid">
  <div class="kv"><span class="k">-l</span><span class="v">Long format: type, permissions, owner, size, modification time. Lesson 1.4 reads every column.</span></div>
  <div class="kv"><span class="k">-a</span><span class="v">Include hidden entries — anything whose name starts with a dot, such as <code>.env</code> and <code>.git</code>.</span></div>
  <div class="kv"><span class="k">-h</span><span class="v">Human-readable sizes (4.0K, 2.1M) instead of raw bytes. Only meaningful with <code>-l</code>.</span></div>
  <div class="kv"><span class="k">-t</span><span class="v">Sort by modification time, newest first. <code>ls -lat</code> is "what changed here recently?".</span></div>
</div>
<pre><code>ls -lah</code></pre>
<div class="out">total 48K
drwxr-xr-x  7 an an 4.0K Aug 21 14:20 .
drwxr-xr-x 12 an an 4.0K Aug 19 10:03 ..
-rw-r--r--  1 an an  312 Aug 19 10:05 .env
drwxr-xr-x  8 an an 4.0K Aug 21 14:20 .git
-rw-r--r--  1 an an 1.2K Aug 21 14:20 README.md</div>
<div class="callout ok">"Hidden" files are not protected or special — the rule is simply that <code>ls</code> skips names starting with <code>.</code> unless you ask. That convention is why configuration lives in <code>~/.bashrc</code> and <code>.env</code>: it keeps a home directory readable, and nothing more.</div>

<h3>cd — move</h3>
<pre><code>cd src              <span class="tok-comment"># into a subdirectory</span>
cd ..               <span class="tok-comment"># up one level</span>
cd ~                <span class="tok-comment"># home. Plain 'cd' does the same.</span>
cd -                <span class="tok-comment"># back to the PREVIOUS directory — like Alt-Tab</span>
cd /var/log         <span class="tok-comment"># an absolute path, from anywhere</span></code></pre>
<div class="out">/home/an/projects/api/src
/home/an/projects/api
/home/an
/home/an/projects/api</div>
<p><code>cd -</code> is the one people do not discover on their own, and it is worth adopting today: bouncing between a source directory and a log directory becomes two keystrokes.</p>

<h3>The shape of every command</h3>
<pre><code>ls   -l   --sort=size   /var/log
│     │        │            │
│     │        │            └─ arguments: what to act on
│     │        └─ long option, two dashes, often takes =value
│     └─ short option, one dash. Combinable: -lah = -l -a -h
└─ the command</code></pre>
<div class="callout warn"><strong>Spaces separate arguments — always.</strong> The shell splits your line on whitespace before the program sees anything, so <code>ls-l</code> is one unknown command, and <code>ls My Documents</code> is a request for two directories called <code>My</code> and <code>Documents</code>. A filename containing a space must be quoted: <code>ls "My Documents"</code>. Chapter 6 makes this systematic; for now, quote anything with a space in it.</div>
<pre><code><span class="tok-comment"># Same result, three ways of grouping short options:</span>
ls -l -a -h
ls -lah
ls -la -h</code></pre>

<h3>Tab completion, and why it is a safety feature</h3>
<pre><code>cd pro&lt;Tab&gt;                  <span class="tok-comment"># completes to projects/</span>
cd projects/ap&lt;Tab&gt;           <span class="tok-comment"># completes to api/</span>
ls /var/lo&lt;Tab&gt;&lt;Tab&gt;          <span class="tok-comment"># two Tabs: list every match</span></code></pre>
<div class="callout ok">Tab completion is not only convenience. A path that completes <em>exists</em>; a path that does not complete is a typo you just caught before running anything. Type the first three letters and press Tab rather than typing paths in full — it is faster and it verifies as you go.</div>

<h3>Three commands worth adding now</h3>
<pre><code>clear                 <span class="tok-comment"># empty the screen (or Ctrl-L)</span>
history | tail -5     <span class="tok-comment"># what did I just run?</span>
!!                     <span class="tok-comment"># repeat the last command</span>
sudo !!                <span class="tok-comment"># repeat it with sudo — the classic use</span>
!543                   <span class="tok-comment"># run command number 543 from history</span></code></pre>
<div class="out">  541  pwd
  542  ls -lah
  543  cd /var/log
  544  ls
  545  history | tail -5</div>

<a class="link-card" href="https://man7.org/linux/man-pages/man1/ls.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">ls(1) — every flag, from the manual</span><span class="lc-sub">Skim the sorting and format sections; the rest is rarely needed.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: navigate a directory tree blindfolded</span><span class="lc-sub">Graded exercises on pwd, ls, cd and reading the prompt.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> assuming <code>ls</code> shows everything. It hides dotfiles by default, so a directory that looks empty may hold <code>.env</code>, <code>.git</code> and <code>.ssh</code>. People delete a folder believing it is empty, or copy a project without its configuration, for exactly this reason. When it matters, use <code>ls -A</code> — like <code>-a</code>, but without the <code>.</code> and <code>..</code> entries cluttering the output.</div>
<p class="note-ct"><strong>The habit to build from lesson one:</strong> <code>pwd</code> before anything destructive, and Tab instead of typing paths. Both take under a second, and between them they prevent the single most common category of terminal accident — running the right command in the wrong place.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Dấu nhắc là một thanh trạng thái</h2>
<p class="lead">Trước khi gõ gì, hãy đọc thứ vốn đã có sẵn trên dòng. Một dấu nhắc mặc định mang bốn mẩu thông tin, và hai trong số đó quyết định lệnh kế tiếp có an toàn hay không.</p>

<pre><code>an@lab:~/projects/api$ </code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">an</span><span class="lz-v">Bạn đang là người dùng nào. Quyết định bạn được phép đụng vào cái gì (Chương 4).</span></div>
  <div class="lz-layer"><span class="lz-k">lab</span><span class="lz-v">Tên máy. Trên laptop thì là trang trí; qua SSH thì đó là khác biệt giữa máy bạn và production.</span></div>
  <div class="lz-layer"><span class="lz-k">~/projects/api</span><span class="lz-v">Thư mục hiện tại. Gần như mọi lệnh đều tác động tương đối với chỗ này.</span></div>
  <div class="lz-layer"><span class="lz-k">\$ vs #</span><span class="lz-v"><strong>\$</strong> = người dùng thường. <strong>#</strong> = root, nơi không gì chặn bạn lại. Hãy kiểm cái này trước mọi việc phá huỷ.</span></div>
</div>
<div class="callout danger">Dấu <code>#</code> không phải trang trí. Là root thì không có lỗi phân quyền nào cả — một đường dẫn gõ sai trong <code>rm -rf</code> không thất bại, nó THÀNH CÔNG. Bất cứ khi nào dấu nhắc kết thúc bằng <code>#</code>, hãy chậm lại và đọc lại lệnh trước khi bấm Enter.</div>

<h3>pwd — tôi đang ở đâu?</h3>
<pre><code>pwd</code></pre>
<div class="out">/home/an/projects/api</div>
<p>"Print working directory" — in ra thư mục làm việc. Mọi shell đều có một thư mục hiện tại, mọi đường dẫn tương đối đều được phân giải từ đó, và một số lượng đáng ngạc nhiên các vấn đề "lệnh chẳng làm gì cả" thật ra là "tôi đang đứng ở chỗ khác". Đây là lệnh rẻ nhất trong Linux và là lệnh nên chạy mỗi khi có gì đó khó hiểu.</p>

<h3>ls — ở đây có gì?</h3>
<pre><code>ls</code></pre>
<div class="out">README.md  node_modules  package.json  src  tests</div>
<pre><code>ls -l</code></pre>
<div class="out">total 48
-rw-r--r--  1 an an  1204 Aug 21 14:20 README.md
drwxr-xr-x 84 an an  4096 Aug 20 09:11 node_modules
-rw-r--r--  1 an an  2891 Aug 21 11:02 package.json
drwxr-xr-x  6 an an  4096 Aug 21 14:18 src
drwxr-xr-x  3 an an  4096 Aug 19 16:40 tests</div>
<div class="kv-grid">
  <div class="kv"><span class="k">-l</span><span class="v">Dạng dài: loại, quyền, chủ sở hữu, kích thước, thời gian sửa. Bài 1.4 đọc từng cột.</span></div>
  <div class="kv"><span class="k">-a</span><span class="v">Gồm cả mục ẩn — mọi thứ có tên bắt đầu bằng dấu chấm, như <code>.env</code> và <code>.git</code>.</span></div>
  <div class="kv"><span class="k">-h</span><span class="v">Kích thước dạng người đọc được (4.0K, 2.1M) thay vì byte thô. Chỉ có nghĩa khi đi cùng <code>-l</code>.</span></div>
  <div class="kv"><span class="k">-t</span><span class="v">Sắp theo thời gian sửa, mới nhất trước. <code>ls -lat</code> là câu "gần đây ở đây có gì đổi?".</span></div>
</div>
<pre><code>ls -lah</code></pre>
<div class="out">total 48K
drwxr-xr-x  7 an an 4.0K Aug 21 14:20 .
drwxr-xr-x 12 an an 4.0K Aug 19 10:03 ..
-rw-r--r--  1 an an  312 Aug 19 10:05 .env
drwxr-xr-x  8 an an 4.0K Aug 21 14:20 .git
-rw-r--r--  1 an an 1.2K Aug 21 14:20 README.md</div>
<div class="callout ok">File "ẩn" không được bảo vệ và cũng không đặc biệt gì — luật đơn giản là <code>ls</code> bỏ qua những cái tên bắt đầu bằng <code>.</code> trừ khi bạn hỏi tới. Quy ước đó là lý do cấu hình sống ở <code>~/.bashrc</code> và <code>.env</code>: nó giữ cho thư mục nhà đọc được, chỉ vậy thôi.</div>

<h3>cd — di chuyển</h3>
<pre><code>cd src              <span class="tok-comment"># vào một thư mục con</span>
cd ..               <span class="tok-comment"># lên một cấp</span>
cd ~                <span class="tok-comment"># về nhà. Gõ 'cd' trơn cũng vậy.</span>
cd -                <span class="tok-comment"># về thư mục TRƯỚC ĐÓ — như Alt-Tab</span>
cd /var/log         <span class="tok-comment"># một đường dẫn tuyệt đối, đứng đâu cũng chạy</span></code></pre>
<div class="out">/home/an/projects/api/src
/home/an/projects/api
/home/an
/home/an/projects/api</div>
<p><code>cd -</code> là thứ người ta không tự khám phá ra, và đáng nhận ngay hôm nay: nhảy qua nhảy lại giữa một thư mục mã nguồn và một thư mục log chỉ còn tốn hai phím.</p>

<h3>Hình dạng của mọi câu lệnh</h3>
<pre><code>ls   -l   --sort=size   /var/log
│     │        │            │
│     │        │            └─ tham số: tác động lên cái gì
│     │        └─ tuỳ chọn dài, hai gạch, thường nhận =giá trị
│     └─ tuỳ chọn ngắn, một gạch. Ghép được: -lah = -l -a -h
└─ tên lệnh</code></pre>
<div class="callout warn"><strong>Dấu cách ngăn cách các tham số — luôn luôn.</strong> Shell chẻ dòng của bạn theo khoảng trắng TRƯỚC khi chương trình nhìn thấy gì, nên <code>ls-l</code> là một lệnh không tồn tại, và <code>ls My Documents</code> là một yêu cầu về hai thư mục tên <code>My</code> và <code>Documents</code>. Một tên file có dấu cách buộc phải bọc nháy: <code>ls "My Documents"</code>. Chương 6 làm cho chuyện này thành hệ thống; còn giờ, hãy bọc nháy mọi thứ có dấu cách.</div>
<pre><code><span class="tok-comment"># Cùng kết quả, ba cách gom các tuỳ chọn ngắn:</span>
ls -l -a -h
ls -lah
ls -la -h</code></pre>

<h3>Hoàn thành bằng Tab, và vì sao nó là một tính năng an toàn</h3>
<pre><code>cd pro&lt;Tab&gt;                  <span class="tok-comment"># tự hoàn thành thành projects/</span>
cd projects/ap&lt;Tab&gt;           <span class="tok-comment"># tự hoàn thành thành api/</span>
ls /var/lo&lt;Tab&gt;&lt;Tab&gt;          <span class="tok-comment"># hai lần Tab: liệt kê mọi khả năng</span></code></pre>
<div class="callout ok">Hoàn thành bằng Tab không chỉ là tiện. Một đường dẫn tự hoàn thành được nghĩa là nó <em>TỒN TẠI</em>; một đường dẫn không tự hoàn thành là một lỗi gõ mà bạn vừa bắt được trước khi chạy bất cứ thứ gì. Hãy gõ ba chữ đầu rồi bấm Tab thay vì gõ đủ cả đường dẫn — vừa nhanh hơn vừa kiểm chứng dọc đường.</div>

<h3>Ba lệnh đáng thêm vào ngay bây giờ</h3>
<pre><code>clear                 <span class="tok-comment"># xoá màn hình (hoặc Ctrl-L)</span>
history | tail -5     <span class="tok-comment"># tôi vừa chạy những gì?</span>
!!                     <span class="tok-comment"># lặp lại lệnh cuối</span>
sudo !!                <span class="tok-comment"># lặp lại nó kèm sudo — cách dùng kinh điển</span>
!543                   <span class="tok-comment"># chạy lệnh số 543 trong lịch sử</span></code></pre>
<div class="out">  541  pwd
  542  ls -lah
  543  cd /var/log
  544  ls
  545  history | tail -5</div>

<a class="link-card" href="https://man7.org/linux/man-pages/man1/ls.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">ls(1) — mọi cái cờ, từ sách hướng dẫn</span><span class="lc-sub">Lướt qua phần sắp xếp và định dạng; phần còn lại hiếm khi cần.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: đi lại trong một cây thư mục khi bịt mắt</span><span class="lc-sub">Bài tập chấm điểm về pwd, ls, cd và đọc dấu nhắc.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> tưởng <code>ls</code> hiện ra mọi thứ. Nó giấu các file dấu chấm theo mặc định, nên một thư mục trông như trống rỗng có thể đang chứa <code>.env</code>, <code>.git</code> và <code>.ssh</code>. Người ta xoá một thư mục vì tin rằng nó trống, hoặc chép một dự án mà thiếu mất cấu hình, đúng vì lý do này. Khi chuyện đó quan trọng, hãy dùng <code>ls -A</code> — như <code>-a</code> nhưng không có hai mục <code>.</code> và <code>..</code> làm rối output.</div>
<p class="note-ct"><strong>Thói quen cần tạo ngay từ bài một:</strong> <code>pwd</code> trước mọi việc phá huỷ, và bấm Tab thay vì gõ đường dẫn. Cả hai đều tốn chưa tới một giây, và cùng nhau chúng ngăn được nhóm tai nạn terminal phổ biến nhất — chạy đúng lệnh ở sai chỗ.</p>
</div>
`,
    },

    /* ─────────────────────────── 1.2 ─────────────────────────── */
    {
      title: '1.2 — Paths: absolute, relative, and the shortcuts|||1.2 — Đường dẫn: tuyệt đối, tương đối, và các lối tắt',
      slug: 'lnx-1-2-duong-dan',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Hệ thống đường dẫn mà mọi lệnh còn lại của khoá dựa vào: gốc /, tuyệt đối vs tương đối, . .. ~ -, vì sao ./script.sh cần dấu chấm, và cách đọc một đường dẫn dài mà không bị lạc.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>One tree, one root, no drive letters</h2>
<p class="lead">Windows has <code>C:\\</code>, <code>D:\\</code> and a separate tree per drive. Linux has exactly one tree, starting at <code>/</code>. A second disk, a USB stick, a network share — all of them appear as a directory <em>inside</em> that single tree. Once you accept that, every path in this course reads the same way.</p>

<pre><code>/                          <span class="tok-comment"># the root of everything</span>
/home                      <span class="tok-comment"># a directory inside root</span>
/home/an                   <span class="tok-comment"># your home directory</span>
/home/an/projects/api      <span class="tok-comment"># deeper still</span>
/mnt/usb                   <span class="tok-comment"># a USB stick — a directory, not a drive letter</span></code></pre>
<div class="callout ok">The leading <code>/</code> means "start from the root". Every other <code>/</code> is just a separator between names. That single character at the front is the entire difference between an absolute and a relative path — and it is the most consequential character in this lesson.</div>

<h3>Absolute vs relative</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Absolute — starts with /</span><span class="lz-v"><code>/var/log/nginx/error.log</code>. Means the same thing from anywhere on the machine. Use it in scripts, in cron jobs, in systemd units.</span></div>
  <div class="lz-layer"><span class="lz-k">Relative — does not start with /</span><span class="lz-v"><code>src/app.ts</code>. Resolved from your current directory. Shorter to type, and meaningless without knowing where you are.</span></div>
</div>
<pre><code>pwd</code></pre>
<div class="out">/home/an/projects/api</div>
<pre><code><span class="tok-comment"># These two are the same file, right now:</span>
cat src/app.ts
cat /home/an/projects/api/src/app.ts

<span class="tok-comment"># After moving, only one of them still works:</span>
cd /tmp
cat src/app.ts                              <span class="tok-comment"># cat: src/app.ts: No such file or directory</span>
cat /home/an/projects/api/src/app.ts        <span class="tok-comment"># still fine</span></code></pre>
<div class="callout warn">This is why a script that works when you run it by hand fails from <code>cron</code> or <code>systemd</code>: those start it in a different directory, so every relative path breaks. Chapter 7 gives the fix — but the rule is simple enough to adopt now: <strong>relative paths for typing, absolute paths for anything automated</strong>.</div>

<h3>The four shortcuts</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">.</span><span class="v">The current directory. <code>cp file.txt .</code> means "copy it here".</span></div>
  <div class="kv"><span class="k">..</span><span class="v">The parent. Stackable: <code>../../etc</code> goes up twice, then into <code>etc</code>.</span></div>
  <div class="kv"><span class="k">~</span><span class="v">Your home directory, expanded by the shell to <code>/home/an</code>. <code>~/notes</code>, <code>~an</code> (another user's home).</span></div>
  <div class="kv"><span class="k">-</span><span class="v">Only for <code>cd</code>: the previous directory. Not a real path.</span></div>
</div>
<pre><code>cd ~/projects/api/src
cd ../tests            <span class="tok-comment"># up to api/, then into tests/</span>
pwd</code></pre>
<div class="out">/home/an/projects/api/tests</div>
<pre><code><span class="tok-comment"># The shell expands ~ before the command sees it — proof:</span>
<span class="tok-keyword">echo</span> ~
<span class="tok-keyword">echo</span> <span class="tok-string">"~"</span></code></pre>
<div class="out">/home/an
~</div>
<div class="callout ok">The quoted version stays literal, which tells you <code>~</code> is a <em>shell</em> feature, not something <code>echo</code> understands. Same for <code>*</code> (Chapter 2) and <code>\$VAR</code> (Chapter 6): the shell rewrites your line first, and the program only ever sees the result.</div>

<h3>Why ./script.sh needs the dot</h3>
<pre><code>ls
./deploy.sh            <span class="tok-comment"># works</span>
deploy.sh              <span class="tok-comment"># bash: deploy.sh: command not found</span></code></pre>
<p>A bare word is looked up in <code>PATH</code> — a list of system directories (Chapter 8). The current directory is deliberately <strong>not</strong> in that list, so <code>./</code> is how you say "the one right here, not one from PATH".</p>
<div class="callout danger">That exclusion is a security decision, not an oversight. If <code>.</code> were in <code>PATH</code>, an attacker could drop a file named <code>ls</code> into a shared directory and wait for someone to <code>cd</code> in and type <code>ls</code>. The extra two characters exist so that running a program from the current directory is always a deliberate act.</div>

<h3>Reading a long path without getting lost</h3>
<pre><code>/var/log/nginx/error.log
│   │   │     └─ the file
│   │   └─ per-service subdirectory
│   └─ where logs live (1.3)
└─ variable data — changes while the system runs</code></pre>
<p>Read right to left when you want the file, left to right when you want to understand where it sits. Long paths are rarely as complex as they look; they are a category, then a narrowing, then a name.</p>

<h3>Paths with spaces and awkward characters</h3>
<pre><code><span class="tok-comment"># Wrong — the shell sees two arguments:</span>
cd My Documents
<span class="tok-comment"># bash: cd: too many arguments</span>

<span class="tok-comment"># Right, three equivalent ways:</span>
cd <span class="tok-string">"My Documents"</span>
cd <span class="tok-string">'My Documents'</span>
cd My\\ Documents</code></pre>
<pre><code><span class="tok-comment"># A file whose name begins with a dash looks like an option. Use ./ or --:</span>
rm ./-weird-file
rm -- -weird-file</code></pre>
<div class="callout warn">Prefer double quotes as your habit. Chapter 6 shows that they also protect variables containing spaces — the single most common cause of scripts that work until someone creates a folder called "My Project". Quoting is cheap, and the bug it prevents is subtle.</div>

<h3>Two commands that make paths easier</h3>
<pre><code>realpath src/app.ts          <span class="tok-comment"># turn a relative path into an absolute one</span>
readlink -f /bin/sh          <span class="tok-comment"># follow symlinks to the real file (Chapter 2)</span>
basename /var/log/nginx/error.log
dirname  /var/log/nginx/error.log</code></pre>
<div class="out">/home/an/projects/api/src/app.ts
/usr/bin/dash
error.log
/var/log/nginx</div>
<p><code>basename</code> and <code>dirname</code> look trivial and become essential in Chapter 7, where a script needs to know its own location regardless of where it was started from.</p>

<a class="link-card" href="https://man7.org/linux/man-pages/man7/path_resolution.7.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">path_resolution(7) — how the kernel resolves a path</span><span class="lc-sub">The precise rules, including symlinks and permission checks along the way.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: reach a target directory in one cd, from anywhere</span><span class="lc-sub">Graded exercises on relative paths, .., ~ and quoting.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> a trailing slash changing what a command does. For <code>cd</code> and <code>ls</code> it is harmless. For <code>cp</code>, <code>mv</code> and especially <code>rsync</code> it is significant: <code>rsync src/ dest/</code> copies the <em>contents</em> of <code>src</code>, while <code>rsync src dest/</code> copies the <em>directory itself</em> into <code>dest</code>. One character, two very different outcomes — Chapter 9 covers it, and it is worth knowing the trap exists now.</div>
<p class="note-ct"><strong>The mental model to keep:</strong> there is one tree. Every path is either "start at the root" (leading <code>/</code>) or "start where I am" (no leading <code>/</code>). Every confusing "file not found" in this course reduces to that distinction plus <code>pwd</code>.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Một cái cây, một cái gốc, không có ký tự ổ đĩa</h2>
<p class="lead">Windows có <code>C:\\</code>, <code>D:\\</code> và mỗi ổ một cây riêng. Linux có đúng MỘT cây, bắt đầu từ <code>/</code>. Một cái đĩa thứ hai, một cái USB, một thư mục chia sẻ qua mạng — tất cả đều hiện ra như một thư mục <em>BÊN TRONG</em> cái cây duy nhất đó. Khi bạn chấp nhận điều đó, mọi đường dẫn trong khoá này đều đọc theo một kiểu.</p>

<pre><code>/                          <span class="tok-comment"># gốc của mọi thứ</span>
/home                      <span class="tok-comment"># một thư mục bên trong gốc</span>
/home/an                   <span class="tok-comment"># thư mục nhà của bạn</span>
/home/an/projects/api      <span class="tok-comment"># sâu hơn nữa</span>
/mnt/usb                   <span class="tok-comment"># một cái USB — một thư mục, không phải ký tự ổ đĩa</span></code></pre>
<div class="callout ok">Dấu <code>/</code> đứng đầu nghĩa là "bắt đầu từ gốc". Mọi dấu <code>/</code> khác chỉ là vạch ngăn giữa các tên. Đúng một ký tự ở đầu đó là toàn bộ khác biệt giữa đường dẫn tuyệt đối và tương đối — và nó là ký tự có hệ quả lớn nhất trong bài này.</div>

<h3>Tuyệt đối vs tương đối</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Tuyệt đối — bắt đầu bằng /</span><span class="lz-v"><code>/var/log/nginx/error.log</code>. Đứng ở đâu trên máy nó cũng có cùng ý nghĩa. Hãy dùng trong script, trong cron, trong unit của systemd.</span></div>
  <div class="lz-layer"><span class="lz-k">Tương đối — không bắt đầu bằng /</span><span class="lz-v"><code>src/app.ts</code>. Được phân giải từ thư mục hiện tại của bạn. Gõ ngắn hơn, và vô nghĩa nếu không biết bạn đang đứng đâu.</span></div>
</div>
<pre><code>pwd</code></pre>
<div class="out">/home/an/projects/api</div>
<pre><code><span class="tok-comment"># Ngay lúc này, hai cái này là cùng một file:</span>
cat src/app.ts
cat /home/an/projects/api/src/app.ts

<span class="tok-comment"># Sau khi chuyển chỗ, chỉ còn một cái chạy được:</span>
cd /tmp
cat src/app.ts                              <span class="tok-comment"># cat: src/app.ts: No such file or directory</span>
cat /home/an/projects/api/src/app.ts        <span class="tok-comment"># vẫn ổn</span></code></pre>
<div class="callout warn">Đây là lý do một script chạy tốt khi bạn gõ tay lại hỏng khi chạy từ <code>cron</code> hay <code>systemd</code>: chúng khởi động script ở một thư mục khác, nên mọi đường dẫn tương đối đều vỡ. Chương 7 đưa ra cách sửa — nhưng cái luật đủ đơn giản để nhận ngay bây giờ: <strong>đường dẫn tương đối để gõ tay, đường dẫn tuyệt đối cho mọi thứ tự động</strong>.</div>

<h3>Bốn lối tắt</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">.</span><span class="v">Thư mục hiện tại. <code>cp file.txt .</code> nghĩa là "chép nó về đây".</span></div>
  <div class="kv"><span class="k">..</span><span class="v">Thư mục cha. Xếp chồng được: <code>../../etc</code> lên hai cấp rồi vào <code>etc</code>.</span></div>
  <div class="kv"><span class="k">~</span><span class="v">Thư mục nhà của bạn, được shell khai triển thành <code>/home/an</code>. <code>~/notes</code>, <code>~an</code> (nhà của người dùng khác).</span></div>
  <div class="kv"><span class="k">-</span><span class="v">Chỉ dùng với <code>cd</code>: thư mục trước đó. Không phải một đường dẫn thật.</span></div>
</div>
<pre><code>cd ~/projects/api/src
cd ../tests            <span class="tok-comment"># lên api/, rồi vào tests/</span>
pwd</code></pre>
<div class="out">/home/an/projects/api/tests</div>
<pre><code><span class="tok-comment"># Shell khai triển ~ TRƯỚC khi lệnh nhìn thấy — bằng chứng:</span>
<span class="tok-keyword">echo</span> ~
<span class="tok-keyword">echo</span> <span class="tok-string">"~"</span></code></pre>
<div class="out">/home/an
~</div>
<div class="callout ok">Bản bọc nháy giữ nguyên chữ, và điều đó cho bạn biết <code>~</code> là một tính năng của <em>SHELL</em>, không phải thứ <code>echo</code> hiểu. Tương tự với <code>*</code> (Chương 2) và <code>\$VAR</code> (Chương 6): shell viết lại dòng của bạn trước, và chương trình chỉ bao giờ nhìn thấy kết quả.</div>

<h3>Vì sao ./script.sh cần dấu chấm</h3>
<pre><code>ls
./deploy.sh            <span class="tok-comment"># chạy được</span>
deploy.sh              <span class="tok-comment"># bash: deploy.sh: command not found</span></code></pre>
<p>Một từ trần được tra trong <code>PATH</code> — một danh sách các thư mục hệ thống (Chương 8). Thư mục hiện tại CỐ Ý <strong>không</strong> nằm trong danh sách đó, nên <code>./</code> là cách bạn nói "cái ngay ở đây, không phải cái lấy từ PATH".</p>
<div class="callout danger">Việc loại trừ đó là một quyết định bảo mật, không phải sơ suất. Nếu <code>.</code> nằm trong <code>PATH</code>, kẻ tấn công có thể thả một file tên <code>ls</code> vào một thư mục dùng chung rồi chờ ai đó <code>cd</code> vào và gõ <code>ls</code>. Hai ký tự thêm vào tồn tại để việc chạy một chương trình từ thư mục hiện tại luôn là một hành động có chủ ý.</div>

<h3>Đọc một đường dẫn dài mà không bị lạc</h3>
<pre><code>/var/log/nginx/error.log
│   │   │     └─ tên file
│   │   └─ thư mục con theo từng dịch vụ
│   └─ nơi log sinh sống (bài 1.3)
└─ dữ liệu biến động — thay đổi trong lúc hệ thống chạy</code></pre>
<p>Đọc từ phải sang trái khi bạn cần cái file, đọc từ trái sang phải khi bạn muốn hiểu nó nằm ở đâu. Đường dẫn dài hiếm khi phức tạp như vẻ ngoài; chúng là một phạm trù, rồi một lần thu hẹp, rồi một cái tên.</p>

<h3>Đường dẫn có dấu cách và ký tự khó chịu</h3>
<pre><code><span class="tok-comment"># Sai — shell nhìn thấy hai tham số:</span>
cd My Documents
<span class="tok-comment"># bash: cd: too many arguments</span>

<span class="tok-comment"># Đúng, ba cách tương đương:</span>
cd <span class="tok-string">"My Documents"</span>
cd <span class="tok-string">'My Documents'</span>
cd My\\ Documents</code></pre>
<pre><code><span class="tok-comment"># Một file có tên bắt đầu bằng dấu gạch trông như một tuỳ chọn. Dùng ./ hoặc --:</span>
rm ./-weird-file
rm -- -weird-file</code></pre>
<div class="callout warn">Hãy để nháy kép thành thói quen. Chương 6 sẽ cho thấy nó còn bảo vệ những biến chứa dấu cách — nguyên nhân phổ biến nhất của những script chạy tốt cho tới khi có người tạo một thư mục tên "Dự án của tôi". Bọc nháy thì rẻ, còn con lỗi nó ngăn được thì tinh vi.</div>

<h3>Hai lệnh làm cho đường dẫn dễ thở hơn</h3>
<pre><code>realpath src/app.ts          <span class="tok-comment"># biến đường dẫn tương đối thành tuyệt đối</span>
readlink -f /bin/sh          <span class="tok-comment"># đi theo liên kết tới file thật (Chương 2)</span>
basename /var/log/nginx/error.log
dirname  /var/log/nginx/error.log</code></pre>
<div class="out">/home/an/projects/api/src/app.ts
/usr/bin/dash
error.log
/var/log/nginx</div>
<p><code>basename</code> và <code>dirname</code> trông tầm thường và trở nên thiết yếu ở Chương 7, nơi một script cần biết vị trí của chính nó bất kể nó được khởi động từ đâu.</p>

<a class="link-card" href="https://man7.org/linux/man-pages/man7/path_resolution.7.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">path_resolution(7) — kernel phân giải một đường dẫn thế nào</span><span class="lc-sub">Luật chính xác, gồm cả symlink và các phép kiểm quyền dọc đường.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: tới đúng một thư mục đích bằng một lệnh cd, từ bất cứ đâu</span><span class="lc-sub">Bài tập chấm điểm về đường dẫn tương đối, .., ~ và bọc nháy.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> một dấu gạch chéo ở cuối làm đổi hành vi của lệnh. Với <code>cd</code> và <code>ls</code> thì vô hại. Với <code>cp</code>, <code>mv</code> và nhất là <code>rsync</code> thì rất quan trọng: <code>rsync src/ dest/</code> chép <em>NỘI DUNG</em> của <code>src</code>, còn <code>rsync src dest/</code> chép <em>CẢ THƯ MỤC</em> vào trong <code>dest</code>. Một ký tự, hai kết cục rất khác nhau — Chương 9 nói kỹ, và đáng biết là cái bẫy đó tồn tại ngay từ bây giờ.</div>
<p class="note-ct"><strong>Mô hình cần giữ:</strong> chỉ có MỘT cái cây. Mọi đường dẫn hoặc là "bắt đầu ở gốc" (có <code>/</code> đứng đầu) hoặc là "bắt đầu ở chỗ tôi đang đứng" (không có). Mọi lỗi "file not found" khó hiểu trong khoá này đều quy về phân biệt đó cộng với <code>pwd</code>.</p>
</div>
`,
    },

    /* ─────────────────────────── 1.3 ─────────────────────────── */
    {
      title: '1.3 — The filesystem hierarchy: what every top folder is for|||1.3 — Cây thư mục: mỗi thư mục gốc để làm gì',
      slug: 'lnx-1-3-cay-thu-muc',
      type: 'LESSON',
      description: 'Tham quan / và ý nghĩa của từng thư mục gốc, ba chỗ bạn thật sự đụng tới hằng ngày (/etc, /var, /home), nơi phần mềm bạn cài đi vào, và luật quyết định đặt file mới ở đâu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>Every directory has a job</h2>
<p class="lead">The top of a Linux filesystem looks arbitrary until you learn the question it answers: <em>who writes this, and does it survive a reinstall?</em> Once you can place a file by that rule, "where does this belong?" and "why is this here?" both become easy.</p>

<pre><code>ls /</code></pre>
<div class="out">bin  boot  dev  etc  home  lib  media  mnt  opt  proc  root  run
sbin  srv  sys  tmp  usr  var</div>

<h3>The three you will actually use</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">/etc</span><span class="lz-v"><strong>Configuration.</strong> Plain text, edited by administrators, machine-specific. <code>/etc/nginx/</code>, <code>/etc/ssh/sshd_config</code>, <code>/etc/hosts</code>. Never binaries, never data.</span></div>
  <div class="lz-layer"><span class="lz-k">/var</span><span class="lz-v"><strong>Variable data.</strong> Things that grow while the system runs: <code>/var/log</code> (logs), <code>/var/lib</code> (databases), <code>/var/www</code> (websites). This is the directory that fills your disk.</span></div>
  <div class="lz-layer"><span class="lz-k">/home</span><span class="lz-v"><strong>Users.</strong> One directory per person: <code>/home/an</code>. Your files, your dotfiles, your projects. Root's home is <code>/root</code>, deliberately elsewhere.</span></div>
</div>
<pre><code>ls /etc | head -6
ls /var/log | head -6</code></pre>
<div class="out">apt
crontab
fstab
hostname
hosts
nginx

auth.log
dpkg.log
journal
nginx
syslog
unattended-upgrades</div>

<h3>Where programs live</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">/usr/bin</span><span class="v">Almost every command you type. <code>ls</code>, <code>grep</code>, <code>python3</code>. Managed by the package manager.</span></div>
  <div class="kv"><span class="k">/usr/sbin</span><span class="v">System binaries, normally for root: <code>sshd</code>, <code>useradd</code>, <code>iptables</code>.</span></div>
  <div class="kv"><span class="k">/usr/local/bin</span><span class="v">Programs <em>you</em> installed outside the package manager. The right place for your own scripts — it is in <code>PATH</code> and the package manager never touches it.</span></div>
  <div class="kv"><span class="k">/opt</span><span class="v">Large self-contained third-party software that ships its own tree: <code>/opt/google/chrome</code>.</span></div>
  <div class="kv"><span class="k">/bin, /sbin, /lib</span><span class="v">On modern systems these are symlinks into <code>/usr</code>. Historical; treat them as the same place.</span></div>
</div>
<pre><code>ls -ld /bin
<span class="tok-keyword">type</span> -a ls python3</code></pre>
<div class="out">lrwxrwxrwx 1 root root 7 Apr 22 10:03 /bin -> usr/bin
ls is /usr/bin/ls
python3 is /usr/bin/python3</div>
<div class="callout ok"><strong>Put your own scripts in <code>/usr/local/bin</code>.</strong> It is in <code>PATH</code> on every distribution, and no package upgrade will overwrite them — which is exactly the risk of dropping a script into <code>/usr/bin</code>. Chapter 7 finishes the story with the shebang line and the executable bit.</div>

<h3>The virtual ones — not files at all</h3>
<pre><code>cat /proc/uptime
cat /sys/class/net/eth0/address
ls -l /dev/null /dev/urandom | head -2</code></pre>
<div class="out">184223.41 892011.09
02:42:ac:11:00:02
crw-rw-rw- 1 root root 1, 3 Aug 21 09:00 /dev/null
crw-rw-rw- 1 root root 1, 9 Aug 21 09:00 /dev/urandom</div>
<div class="kv-grid">
  <div class="kv"><span class="k">/proc</span><span class="v">Processes and kernel state, generated on read. <code>/proc/1234/</code> is process 1234 (Chapter 5).</span></div>
  <div class="kv"><span class="k">/sys</span><span class="v">Devices and drivers. Where you read a MAC address or set screen brightness.</span></div>
  <div class="kv"><span class="k">/dev</span><span class="v">Device files. <code>/dev/sda</code> (a disk), <code>/dev/null</code> (the wastebasket), <code>/dev/urandom</code>.</span></div>
  <div class="kv"><span class="k">/run</span><span class="v">Runtime state since boot — PID files, sockets. Lives in memory and is emptied on reboot.</span></div>
</div>
<p>None of these exist on disk. They are the kernel presenting itself through the file interface from 0.2, which is why <code>cat</code> and <code>grep</code> work on them.</p>

<h3>The temporary ones</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">/tmp</span><span class="v">Anyone can write. <strong>Cleared on reboot</strong>, and often sooner. Perfect for scratch work; never for anything you want tomorrow.</span></div>
  <div class="kv"><span class="k">/var/tmp</span><span class="v">Also temporary, but survives a reboot. For work in progress that spans a restart.</span></div>
  <div class="kv"><span class="k">/mnt, /media</span><span class="v">Mount points. <code>/media</code> is where desktops auto-mount USB sticks; <code>/mnt</code> is for manual mounts (Chapter 10).</span></div>
</div>
<div class="callout warn"><code>/tmp</code> is world-writable, which makes it a classic attack surface: a script that writes to a predictable name like <code>/tmp/backup.sql</code> can be tricked into overwriting a file someone else created there first. Use <code>mktemp</code> instead — Chapter 7 shows the safe pattern.</div>

<h3>The rule for deciding where a new file goes</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Is it configuration a human edits?</div><div class="lz-d">→ <code>/etc</code> for the system, or <code>~/.config</code> for one user.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Does it grow while the service runs?</div><div class="lz-d">→ <code>/var</code>. Logs in <code>/var/log</code>, data in <code>/var/lib/&lt;app&gt;</code>.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Is it a program you installed by hand?</div><div class="lz-d">→ <code>/usr/local/bin</code>, or <code>/opt</code> if it brings its own tree.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Is it yours and personal?</div><div class="lz-d">→ <code>/home/you</code>. Nothing personal belongs anywhere else.</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Is it throwaway?</div><div class="lz-d">→ <code>/tmp</code>, via <code>mktemp</code>, and accept that it may vanish.</div></div>
</div>

<h3>Seeing the shape of a tree</h3>
<pre><code>tree -L 1 /var
du -sh /var/* 2&gt;/dev/null | sort -rh | head -5</code></pre>
<div class="out">/var
├── backups
├── cache
├── lib
├── log
├── spool
└── tmp

2.1G	/var/lib
890M	/var/log
412M	/var/cache
18M	/var/backups</div>
<p>That second command is the first tool you will reach for when a server reports a full disk — Chapter 10 develops it into a full procedure, but the shape of the answer is already visible here.</p>

<a class="link-card" href="https://man7.org/linux/man-pages/man7/hier.7.html" target="_blank" rel="noopener">
  <span class="lc-ico">🗂️</span>
  <span class="lc-body"><span class="lc-title">hier(7) — the filesystem hierarchy, from the manual</span><span class="lc-sub">One page describing every top-level directory. Available offline as <code>man hier</code>.</span></span>
</a>
<a class="link-card" href="https://refspecs.linuxfoundation.org/FHS_3.0/fhs/index.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Filesystem Hierarchy Standard 3.0</span><span class="lc-sub">The specification distributions follow. Worth skimming once to settle any "where should this go?" argument.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> installing your own software into <code>/usr/bin</code> because that is where the other commands are. The package manager owns that directory and will happily overwrite or remove your file during an upgrade, with no warning — and you will spend an hour wondering why a script that worked for months has vanished. <code>/usr/local/bin</code> exists precisely for this, and is already in <code>PATH</code>.</div>
<p class="note-ct"><strong>Why this pays off in Chapter 12:</strong> diagnosing an unfamiliar server starts with knowing where to look. Configuration is in <code>/etc</code>, logs are in <code>/var/log</code>, the service's data is in <code>/var/lib</code>, and what is running is visible in <code>/proc</code>. That map turns "I have no idea where anything is" into four directories to check.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>Mỗi thư mục có một nhiệm vụ</h2>
<p class="lead">Phần trên cùng của một hệ thống file Linux trông tuỳ tiện cho tới khi bạn học được câu hỏi mà nó trả lời: <em>AI ghi vào đây, và nó có sống sót qua một lần cài lại không?</em> Khi bạn xếp được một file theo luật đó thì cả "cái này thuộc về đâu?" lẫn "vì sao cái này ở đây?" đều thành dễ.</p>

<pre><code>ls /</code></pre>
<div class="out">bin  boot  dev  etc  home  lib  media  mnt  opt  proc  root  run
sbin  srv  sys  tmp  usr  var</div>

<h3>Ba thư mục bạn thật sự dùng</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">/etc</span><span class="lz-v"><strong>Cấu hình.</strong> Văn bản thuần, do quản trị viên sửa, riêng theo từng máy. <code>/etc/nginx/</code>, <code>/etc/ssh/sshd_config</code>, <code>/etc/hosts</code>. Không bao giờ chứa file nhị phân, không bao giờ chứa dữ liệu.</span></div>
  <div class="lz-layer"><span class="lz-k">/var</span><span class="lz-v"><strong>Dữ liệu biến động.</strong> Những thứ phình ra trong lúc hệ thống chạy: <code>/var/log</code> (log), <code>/var/lib</code> (cơ sở dữ liệu), <code>/var/www</code> (website). Đây là cái thư mục làm đầy đĩa của bạn.</span></div>
  <div class="lz-layer"><span class="lz-k">/home</span><span class="lz-v"><strong>Người dùng.</strong> Mỗi người một thư mục: <code>/home/an</code>. File của bạn, các file dấu chấm của bạn, dự án của bạn. Nhà của root là <code>/root</code>, cố ý nằm chỗ khác.</span></div>
</div>
<pre><code>ls /etc | head -6
ls /var/log | head -6</code></pre>
<div class="out">apt
crontab
fstab
hostname
hosts
nginx

auth.log
dpkg.log
journal
nginx
syslog
unattended-upgrades</div>

<h3>Chương trình sống ở đâu</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">/usr/bin</span><span class="v">Gần như mọi lệnh bạn gõ. <code>ls</code>, <code>grep</code>, <code>python3</code>. Do trình quản lý gói quản lý.</span></div>
  <div class="kv"><span class="k">/usr/sbin</span><span class="v">File nhị phân hệ thống, thường dành cho root: <code>sshd</code>, <code>useradd</code>, <code>iptables</code>.</span></div>
  <div class="kv"><span class="k">/usr/local/bin</span><span class="v">Chương trình do <em>BẠN</em> cài ngoài trình quản lý gói. Chỗ đúng cho script của chính bạn — nó nằm trong <code>PATH</code> và trình quản lý gói không bao giờ đụng tới.</span></div>
  <div class="kv"><span class="k">/opt</span><span class="v">Phần mềm bên thứ ba cỡ lớn, tự đóng gói và mang theo cây thư mục riêng: <code>/opt/google/chrome</code>.</span></div>
  <div class="kv"><span class="k">/bin, /sbin, /lib</span><span class="v">Trên hệ thống đời mới, đây là symlink trỏ vào <code>/usr</code>. Mang tính lịch sử; cứ coi chúng là cùng một chỗ.</span></div>
</div>
<pre><code>ls -ld /bin
<span class="tok-keyword">type</span> -a ls python3</code></pre>
<div class="out">lrwxrwxrwx 1 root root 7 Apr 22 10:03 /bin -> usr/bin
ls is /usr/bin/ls
python3 is /usr/bin/python3</div>
<div class="callout ok"><strong>Hãy đặt script của chính bạn vào <code>/usr/local/bin</code>.</strong> Nó nằm trong <code>PATH</code> ở mọi bản phân phối, và không lần nâng cấp gói nào ghi đè lên chúng — đó chính xác là rủi ro của việc thả một script vào <code>/usr/bin</code>. Chương 7 kể nốt câu chuyện với dòng shebang và bit thực thi.</div>

<h3>Những thư mục ảo — hoàn toàn không phải file</h3>
<pre><code>cat /proc/uptime
cat /sys/class/net/eth0/address
ls -l /dev/null /dev/urandom | head -2</code></pre>
<div class="out">184223.41 892011.09
02:42:ac:11:00:02
crw-rw-rw- 1 root root 1, 3 Aug 21 09:00 /dev/null
crw-rw-rw- 1 root root 1, 9 Aug 21 09:00 /dev/urandom</div>
<div class="kv-grid">
  <div class="kv"><span class="k">/proc</span><span class="v">Tiến trình và trạng thái kernel, sinh ra vào lúc đọc. <code>/proc/1234/</code> chính là tiến trình 1234 (Chương 5).</span></div>
  <div class="kv"><span class="k">/sys</span><span class="v">Thiết bị và trình điều khiển. Nơi bạn đọc địa chỉ MAC hay chỉnh độ sáng màn hình.</span></div>
  <div class="kv"><span class="k">/dev</span><span class="v">File thiết bị. <code>/dev/sda</code> (một cái đĩa), <code>/dev/null</code> (sọt rác), <code>/dev/urandom</code>.</span></div>
  <div class="kv"><span class="k">/run</span><span class="v">Trạng thái từ lúc khởi động — file PID, socket. Nằm trong bộ nhớ và bị xoá sạch khi khởi động lại.</span></div>
</div>
<p>Không cái nào trong số này tồn tại trên đĩa. Chúng là kernel tự phơi mình ra qua giao diện file ở bài 0.2, và vì thế <code>cat</code> và <code>grep</code> chạy được trên chúng.</p>

<h3>Những thư mục tạm</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">/tmp</span><span class="v">Ai cũng ghi được. <strong>Bị xoá khi khởi động lại</strong>, và thường là sớm hơn. Hoàn hảo cho việc nháp; không bao giờ dành cho thứ bạn còn cần ngày mai.</span></div>
  <div class="kv"><span class="k">/var/tmp</span><span class="v">Cũng là tạm, nhưng sống sót qua một lần khởi động lại. Dành cho việc đang dở kéo dài qua một lần restart.</span></div>
  <div class="kv"><span class="k">/mnt, /media</span><span class="v">Điểm gắn kết. <code>/media</code> là nơi máy để bàn tự gắn USB; <code>/mnt</code> dành cho việc gắn thủ công (Chương 10).</span></div>
</div>
<div class="callout warn"><code>/tmp</code> cho cả thế giới ghi vào, và điều đó biến nó thành một bề mặt tấn công kinh điển: một script ghi vào một cái tên đoán được như <code>/tmp/backup.sql</code> có thể bị lừa để ghi đè lên một file mà người khác đã tạo sẵn ở đó. Hãy dùng <code>mktemp</code> thay vì thế — Chương 7 chỉ mẫu an toàn.</div>

<h3>Luật quyết định một file mới đi đâu</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Có phải cấu hình do con người sửa không?</div><div class="lz-d">→ <code>/etc</code> cho cả hệ thống, hoặc <code>~/.config</code> cho một người dùng.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Nó có phình ra khi dịch vụ chạy không?</div><div class="lz-d">→ <code>/var</code>. Log ở <code>/var/log</code>, dữ liệu ở <code>/var/lib/&lt;ứng dụng&gt;</code>.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Có phải chương trình bạn cài tay không?</div><div class="lz-d">→ <code>/usr/local/bin</code>, hoặc <code>/opt</code> nếu nó mang theo cây riêng.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Có phải của riêng bạn không?</div><div class="lz-d">→ <code>/home/bạn</code>. Không thứ gì mang tính cá nhân thuộc về nơi khác.</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Có phải thứ vứt đi không?</div><div class="lz-d">→ <code>/tmp</code>, qua <code>mktemp</code>, và chấp nhận rằng nó có thể biến mất.</div></div>
</div>

<h3>Nhìn thấy hình dạng của một cây</h3>
<pre><code>tree -L 1 /var
du -sh /var/* 2&gt;/dev/null | sort -rh | head -5</code></pre>
<div class="out">/var
├── backups
├── cache
├── lib
├── log
├── spool
└── tmp

2.1G	/var/lib
890M	/var/log
412M	/var/cache
18M	/var/backups</div>
<p>Lệnh thứ hai đó là công cụ đầu tiên bạn sẽ vớ lấy khi một máy chủ báo đầy đĩa — Chương 10 phát triển nó thành một quy trình đầy đủ, nhưng hình dạng của câu trả lời đã nhìn thấy được ngay ở đây.</p>

<a class="link-card" href="https://man7.org/linux/man-pages/man7/hier.7.html" target="_blank" rel="noopener">
  <span class="lc-ico">🗂️</span>
  <span class="lc-body"><span class="lc-title">hier(7) — cây thư mục, từ sách hướng dẫn</span><span class="lc-sub">Một trang mô tả mọi thư mục gốc. Có sẵn ngoại tuyến qua <code>man hier</code>.</span></span>
</a>
<a class="link-card" href="https://refspecs.linuxfoundation.org/FHS_3.0/fhs/index.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Filesystem Hierarchy Standard 3.0</span><span class="lc-sub">Bản đặc tả mà các bản phân phối tuân theo. Đáng lướt một lần để dàn xếp mọi tranh cãi "cái này nên để đâu?".</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> cài phần mềm của chính bạn vào <code>/usr/bin</code> vì các lệnh khác đều ở đó. Trình quản lý gói sở hữu thư mục đó và sẽ vui vẻ ghi đè hoặc gỡ bỏ file của bạn trong một lần nâng cấp, không hề cảnh báo — và bạn sẽ mất một giờ thắc mắc vì sao một script chạy tốt suốt nhiều tháng bỗng biến mất. <code>/usr/local/bin</code> tồn tại chính xác cho việc này, và nó đã nằm sẵn trong <code>PATH</code>.</div>
<p class="note-ct"><strong>Vì sao điều này sinh lời ở Chương 12:</strong> chẩn đoán một máy chủ lạ bắt đầu bằng việc biết phải nhìn vào đâu. Cấu hình ở <code>/etc</code>, log ở <code>/var/log</code>, dữ liệu của dịch vụ ở <code>/var/lib</code>, và thứ đang chạy thì nhìn thấy được trong <code>/proc</code>. Tấm bản đồ đó biến "tôi chẳng biết cái gì nằm ở đâu" thành bốn thư mục cần kiểm.</p>
</div>
`,
    },

    /* ─────────────────────────── 1.4 ─────────────────────────── */
    {
      title: '1.4 — Looking closely: ls -l, file, stat|||1.4 — Nhìn cho kỹ: ls -l, file, stat',
      slug: 'lnx-1-4-nhin-ky-mot-file',
      type: 'LESSON',
      description: 'Đọc từng cột của ls -l, ba dấu thời gian mà mọi file đều có, dùng file để biết một thứ THẬT SỰ là gì thay vì tin phần đuôi tên, và inode giải thích vì sao xoá được file mà đĩa vẫn đầy.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.4</span>
<h2>Reading a directory listing properly</h2>
<p class="lead"><code>ls -l</code> prints seven columns and most people read two of them. The other five answer questions you will keep asking: who owns this, when did it change, why can I not write to it, and is it even a real file?</p>

<pre><code>ls -l /var/log</code></pre>
<div class="out">total 2884
-rw-r-----  1 syslog adm    184320 Aug 21 14:20 auth.log
drwxr-xr-x  2 root   root     4096 Aug 19 10:03 nginx
lrwxrwxrwx  1 root   root       19 Aug 19 10:03 syslog -> /var/log/syslog.1
-rw-r--r--  1 root   root  2621440 Aug 21 09:14 syslog.1</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">1st character</span><span class="lz-v">Type. <code>-</code> regular file · <code>d</code> directory · <code>l</code> symbolic link · <code>c</code>/<code>b</code> device · <code>s</code> socket · <code>p</code> pipe.</span></div>
  <div class="lz-layer"><span class="lz-k">rw-r-----</span><span class="lz-v">Permissions in three groups of three: owner, group, everyone else. Chapter 4 is entirely this.</span></div>
  <div class="lz-layer"><span class="lz-k">1 / 2</span><span class="lz-v">Link count. For a directory it is 2 + the number of subdirectories, which is why an empty directory shows 2.</span></div>
  <div class="lz-layer"><span class="lz-k">syslog adm</span><span class="lz-v">Owning user, then owning group. Two separate things, and the source of most permission confusion.</span></div>
  <div class="lz-layer"><span class="lz-k">184320</span><span class="lz-v">Size in bytes. For a directory this is the size of the listing, not of its contents — a 4096-byte directory can hold gigabytes.</span></div>
  <div class="lz-layer"><span class="lz-k">Aug 21 14:20</span><span class="lz-v">Modification time. Within the last six months you get a clock; older than that, a year instead.</span></div>
  <div class="lz-layer"><span class="lz-k">-&gt; /var/log/syslog.1</span><span class="lz-v">Only on links: what it points at. Chapter 2 covers links properly.</span></div>
</div>
<div class="callout warn">The size column for a <em>directory</em> misleads everybody once. <code>drwxr-xr-x 2 root root 4096</code> does not mean the directory holds 4 KB — it means the listing itself occupies one 4 KB block. To find out how much is inside, you need <code>du</code> (Chapter 10), which walks the tree and adds it up.</div>

<h3>Sorting a listing to answer a question</h3>
<pre><code>ls -lhS /var/log | head -4          <span class="tok-comment"># biggest first — what is filling this?</span>
ls -lt /var/log | head -4            <span class="tok-comment"># newest first — what changed just now?</span>
ls -ltr /var/log | tail -4           <span class="tok-comment"># newest LAST — the most useful form</span></code></pre>
<div class="out">total 2.9M
-rw-r-----  1 root   adm   2.5M Aug 21 09:14 syslog.1
-rw-r-----  1 syslog adm   180K Aug 21 14:20 auth.log
-rw-r--r--  1 root   root   68K Aug 20 03:11 dpkg.log</div>
<div class="callout ok"><code>ls -ltr</code> is worth making a habit. Reversing the sort puts the newest entries at the <em>bottom</em>, right above your prompt — so on a directory with two hundred files you see what you came for without scrolling. The same reasoning applies to any long output: end it where your eyes already are.</div>

<h3>Three timestamps, not one</h3>
<pre><code>stat /var/log/auth.log</code></pre>
<div class="out">  File: /var/log/auth.log
  Size: 184320    	Blocks: 360        IO Block: 4096   regular file
Device: 8,1	Inode: 1049601     Links: 1
Access: (0640/-rw-r-----)  Uid: (  104/ syslog)   Gid: (   4/     adm)
Access: 2026-08-21 14:22:03.114 +0700
Modify: 2026-08-21 14:20:51.882 +0700
Change: 2026-08-21 14:20:51.882 +0700</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Access (atime)</span><span class="v">Last read. Often disabled for performance, so do not rely on it.</span></div>
  <div class="kv"><span class="k">Modify (mtime)</span><span class="v">Contents last changed. This is what <code>ls -l</code> shows and what <code>find -mtime</code> tests.</span></div>
  <div class="kv"><span class="k">Change (ctime)</span><span class="v">The <em>inode</em> last changed — permissions, owner, name. Not "creation time". Changing a permission updates ctime but not mtime.</span></div>
</div>
<div class="callout warn">There is no portable "creation time" on Linux. <code>ctime</code> is <strong>change</strong> time, and the mistake is common enough to matter: a file <code>chmod</code>-ed yesterday has yesterday's ctime and an unchanged mtime from last year. Modern filesystems can record a birth time (<code>stat</code> shows <code>Birth:</code> on ext4 with newer tools), but nothing in this course should depend on it.</div>

<h3>What is this file, really?</h3>
<pre><code>file /usr/bin/ls /etc/hostname /var/log/nginx /dev/null report.pdf</code></pre>
<div class="out">/usr/bin/ls:     ELF 64-bit LSB pie executable, x86-64, dynamically linked
/etc/hostname:   ASCII text
/var/log/nginx:  directory
/dev/null:       character special (1/3)
report.pdf:      PDF document, version 1.7</div>
<p><code>file</code> reads the beginning of the file and identifies it by content, not by extension. On Linux the extension is a convention for humans — nothing enforces it — so a <code>.txt</code> that is really a JPEG is entirely possible, and <code>file</code> is how you find out before <code>cat</code> fills your terminal with binary noise.</p>
<pre><code><span class="tok-comment"># Before cat-ing something unknown, ask what it is:</span>
file downloaded-thing
<span class="tok-comment"># If it is text, look at it safely — head stops after 20 lines:</span>
head -20 downloaded-thing</code></pre>

<h3>Inodes, and why deleting a file can free nothing</h3>
<p>The number in <code>stat</code> labelled <code>Inode</code> is the file's real identity. The name in a directory is just a pointer to it. Two consequences that come up constantly:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">A name is a link, not the file</div><div class="lz-d">Several names can point at one inode (hard links, Chapter 2). Removing one name removes a pointer, not the data.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Space is freed at zero references</div><div class="lz-d">Both the name count AND the open-file count must reach zero.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">So a deleted file can still occupy the disk</div><div class="lz-d">If a process still has it open, the space stays used until that process exits.</div></div>
</div>
<pre><code><span class="tok-comment"># The classic: someone deleted a 40 GB log while the service held it open.</span>
<span class="tok-comment"># df says the disk is full; du finds nothing.</span>
lsof +L1 | head -3</code></pre>
<div class="out">COMMAND   PID   USER  FD   TYPE  DEVICE  SIZE/OFF NLINK  NODE NAME
nginx    1284   root  12w   REG     8,1 42949672960     0 1049612 /var/log/nginx/access.log (deleted)</div>
<p><code>NLINK 0</code> plus <code>(deleted)</code> is the fingerprint. The fix is to restart the process holding it, not to delete more files — Chapter 12 turns this into a full recipe.</p>

<h3>Two more small tools</h3>
<pre><code>wc -l /etc/passwd            <span class="tok-comment"># count lines</span>
wc -c /etc/hostname          <span class="tok-comment"># count bytes</span>
du -h /var/log/syslog.1      <span class="tok-comment"># how much disk does this really use?</span>
tree -L 2 -d /etc/nginx      <span class="tok-comment"># directories only, two levels deep</span></code></pre>
<div class="out">42 /etc/passwd
4 /etc/hostname
2.5M	/var/log/syslog.1</div>

<a class="link-card" href="https://man7.org/linux/man-pages/man1/stat.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">stat(1) — every field, and the --format placeholders</span><span class="lc-sub">Useful in scripts: <code>stat -c '%s %n' file</code> prints just size and name.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: answer five questions from one ls -l listing</span><span class="lc-sub">Graded exercises on type, owner, size, times and links.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> trusting a file extension. Linux does not use it to decide anything — <code>chmod +x</code> and the shebang line make a file executable (Chapter 7), not <code>.sh</code>. A downloaded <code>invoice.pdf.exe</code>, a <code>.jpg</code> that is really a script, a <code>.txt</code> that is a 2 GB core dump: <code>file</code> tells you in one command, and it is worth running on anything you did not create yourself.</div>
<p class="note-ct"><strong>The three commands to keep from this lesson:</strong> <code>ls -ltrh</code> for "what is here and what changed recently", <code>file</code> for "what is this actually", and <code>stat</code> for "everything the filesystem knows". Between them they answer almost every question about a file that is not about its contents — and Chapter 3 handles the contents.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.4</span>
<h2>Đọc một danh sách thư mục cho đúng</h2>
<p class="lead"><code>ls -l</code> in ra bảy cột và đa số người ta chỉ đọc hai. Năm cột còn lại trả lời những câu hỏi bạn sẽ hỏi đi hỏi lại: ai sở hữu cái này, nó đổi lúc nào, vì sao tôi không ghi được vào đó, và nó có phải một file thật không?</p>

<pre><code>ls -l /var/log</code></pre>
<div class="out">total 2884
-rw-r-----  1 syslog adm    184320 Aug 21 14:20 auth.log
drwxr-xr-x  2 root   root     4096 Aug 19 10:03 nginx
lrwxrwxrwx  1 root   root       19 Aug 19 10:03 syslog -> /var/log/syslog.1
-rw-r--r--  1 root   root  2621440 Aug 21 09:14 syslog.1</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Ký tự đầu tiên</span><span class="lz-v">Loại. <code>-</code> file thường · <code>d</code> thư mục · <code>l</code> liên kết tượng trưng · <code>c</code>/<code>b</code> thiết bị · <code>s</code> socket · <code>p</code> ống.</span></div>
  <div class="lz-layer"><span class="lz-k">rw-r-----</span><span class="lz-v">Quyền, chia ba nhóm ba ký tự: chủ sở hữu, nhóm, mọi người khác. Chương 4 nói trọn vẹn về cái này.</span></div>
  <div class="lz-layer"><span class="lz-k">1 / 2</span><span class="lz-v">Số liên kết. Với một thư mục thì bằng 2 + số thư mục con, và vì thế một thư mục rỗng hiện số 2.</span></div>
  <div class="lz-layer"><span class="lz-k">syslog adm</span><span class="lz-v">Người dùng sở hữu, rồi nhóm sở hữu. Hai thứ tách biệt, và là nguồn gốc của phần lớn sự rối rắm về quyền.</span></div>
  <div class="lz-layer"><span class="lz-k">184320</span><span class="lz-v">Kích thước theo byte. Với thư mục thì đây là kích thước của cái DANH SÁCH, không phải của nội dung — một thư mục 4096 byte chứa được vài gigabyte.</span></div>
  <div class="lz-layer"><span class="lz-k">Aug 21 14:20</span><span class="lz-v">Thời gian sửa. Trong vòng sáu tháng gần đây thì hiện giờ giấc; cũ hơn thì hiện năm.</span></div>
  <div class="lz-layer"><span class="lz-k">-&gt; /var/log/syslog.1</span><span class="lz-v">Chỉ có ở liên kết: nó trỏ vào đâu. Chương 2 nói kỹ về liên kết.</span></div>
</div>
<div class="callout warn">Cột kích thước của một <em>THƯ MỤC</em> làm ai cũng hiểu nhầm một lần. <code>drwxr-xr-x 2 root root 4096</code> không có nghĩa thư mục đó chứa 4 KB — nó nghĩa là bản thân cái danh sách chiếm một khối 4 KB. Muốn biết bên trong có bao nhiêu, bạn cần <code>du</code> (Chương 10), lệnh đi khắp cây và cộng lại.</div>

<h3>Sắp xếp một danh sách để trả lời một câu hỏi</h3>
<pre><code>ls -lhS /var/log | head -4          <span class="tok-comment"># to nhất trước — cái gì đang làm đầy chỗ này?</span>
ls -lt /var/log | head -4            <span class="tok-comment"># mới nhất trước — vừa nãy có gì đổi?</span>
ls -ltr /var/log | tail -4           <span class="tok-comment"># mới nhất SAU CÙNG — dạng hữu ích nhất</span></code></pre>
<div class="out">total 2.9M
-rw-r-----  1 root   adm   2.5M Aug 21 09:14 syslog.1
-rw-r-----  1 syslog adm   180K Aug 21 14:20 auth.log
-rw-r--r--  1 root   root   68K Aug 20 03:11 dpkg.log</div>
<div class="callout ok"><code>ls -ltr</code> đáng biến thành thói quen. Đảo chiều sắp xếp đưa những mục mới nhất xuống <em>ĐÁY</em>, ngay phía trên dấu nhắc của bạn — nên trong một thư mục hai trăm file, bạn thấy đúng thứ mình cần mà không phải cuộn. Cùng một lý lẽ áp cho mọi output dài: hãy kết thúc nó ở nơi mắt bạn vốn đã ở đó.</div>

<h3>Ba dấu thời gian, không phải một</h3>
<pre><code>stat /var/log/auth.log</code></pre>
<div class="out">  File: /var/log/auth.log
  Size: 184320    	Blocks: 360        IO Block: 4096   regular file
Device: 8,1	Inode: 1049601     Links: 1
Access: (0640/-rw-r-----)  Uid: (  104/ syslog)   Gid: (   4/     adm)
Access: 2026-08-21 14:22:03.114 +0700
Modify: 2026-08-21 14:20:51.882 +0700
Change: 2026-08-21 14:20:51.882 +0700</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Access (atime)</span><span class="v">Lần đọc gần nhất. Thường bị tắt để tăng hiệu năng, nên đừng dựa vào nó.</span></div>
  <div class="kv"><span class="k">Modify (mtime)</span><span class="v">Nội dung đổi lần gần nhất. Đây là thứ <code>ls -l</code> hiện ra và thứ <code>find -mtime</code> kiểm.</span></div>
  <div class="kv"><span class="k">Change (ctime)</span><span class="v"><em>INODE</em> đổi lần gần nhất — quyền, chủ sở hữu, tên. KHÔNG phải "thời gian tạo". Đổi một cái quyền thì cập nhật ctime chứ không cập nhật mtime.</span></div>
</div>
<div class="callout warn">Trên Linux không có "thời gian tạo" theo cách khả chuyển. <code>ctime</code> là thời gian <strong>THAY ĐỔI</strong>, và nhầm lẫn này phổ biến tới mức đáng nói: một file được <code>chmod</code> hôm qua thì có ctime là hôm qua và mtime không đổi từ năm ngoái. Hệ thống file đời mới ghi được thời gian sinh (<code>stat</code> hiện <code>Birth:</code> trên ext4 với công cụ mới), nhưng không gì trong khoá này nên phụ thuộc vào nó.</div>

<h3>Cái file này THẬT SỰ là gì?</h3>
<pre><code>file /usr/bin/ls /etc/hostname /var/log/nginx /dev/null report.pdf</code></pre>
<div class="out">/usr/bin/ls:     ELF 64-bit LSB pie executable, x86-64, dynamically linked
/etc/hostname:   ASCII text
/var/log/nginx:  directory
/dev/null:       character special (1/3)
report.pdf:      PDF document, version 1.7</div>
<p><code>file</code> đọc phần đầu của file và nhận dạng theo NỘI DUNG, không theo phần đuôi tên. Trên Linux, phần đuôi là một quy ước dành cho con người — chẳng có gì cưỡng chế nó — nên một file <code>.txt</code> thật ra là ảnh JPEG là chuyện hoàn toàn có thể, và <code>file</code> là cách bạn biết trước khi <code>cat</code> làm ngập terminal bằng nhiễu nhị phân.</p>
<pre><code><span class="tok-comment"># Trước khi cat một thứ chưa rõ, hãy hỏi nó là gì:</span>
file downloaded-thing
<span class="tok-comment"># Nếu là văn bản, hãy xem một cách an toàn — head dừng sau 20 dòng:</span>
head -20 downloaded-thing</code></pre>

<h3>Inode, và vì sao xoá một file có thể không giải phóng gì</h3>
<p>Con số trong <code>stat</code> mang nhãn <code>Inode</code> mới là danh tính thật của file. Cái tên trong thư mục chỉ là một con trỏ tới nó. Hai hệ quả xuất hiện liên tục:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Một cái tên là một liên kết, không phải cái file</div><div class="lz-d">Nhiều tên trỏ được vào một inode (liên kết cứng, Chương 2). Gỡ một cái tên là gỡ một con trỏ, không phải gỡ dữ liệu.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Chỗ trống được giải phóng khi số tham chiếu về 0</div><div class="lz-d">Cả số tên LẪN số tiến trình đang mở file đều phải về 0.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Nên một file đã xoá vẫn có thể đang chiếm đĩa</div><div class="lz-d">Nếu một tiến trình vẫn giữ nó ở trạng thái mở, chỗ đó vẫn bị chiếm cho tới khi tiến trình ấy thoát.</div></div>
</div>
<pre><code><span class="tok-comment"># Ca kinh điển: có người xoá một file log 40 GB trong khi dịch vụ vẫn đang mở nó.</span>
<span class="tok-comment"># df báo đĩa đầy; du thì không tìm ra gì.</span>
lsof +L1 | head -3</code></pre>
<div class="out">COMMAND   PID   USER  FD   TYPE  DEVICE  SIZE/OFF NLINK  NODE NAME
nginx    1284   root  12w   REG     8,1 42949672960     0 1049612 /var/log/nginx/access.log (deleted)</div>
<p><code>NLINK 0</code> cộng chữ <code>(deleted)</code> là dấu vân tay. Cách sửa là khởi động lại tiến trình đang giữ nó, chứ không phải xoá thêm file — Chương 12 biến việc này thành một công thức đầy đủ.</p>

<h3>Hai công cụ nhỏ nữa</h3>
<pre><code>wc -l /etc/passwd            <span class="tok-comment"># đếm dòng</span>
wc -c /etc/hostname          <span class="tok-comment"># đếm byte</span>
du -h /var/log/syslog.1      <span class="tok-comment"># cái này thật sự chiếm bao nhiêu đĩa?</span>
tree -L 2 -d /etc/nginx      <span class="tok-comment"># chỉ thư mục, sâu hai cấp</span></code></pre>
<div class="out">42 /etc/passwd
4 /etc/hostname
2.5M	/var/log/syslog.1</div>

<a class="link-card" href="https://man7.org/linux/man-pages/man1/stat.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">stat(1) — mọi trường, và các ký hiệu của --format</span><span class="lc-sub">Hữu ích trong script: <code>stat -c '%s %n' file</code> chỉ in kích thước và tên.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: trả lời năm câu hỏi chỉ từ một danh sách ls -l</span><span class="lc-sub">Bài tập chấm điểm về loại, chủ sở hữu, kích thước, thời gian và liên kết.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> tin vào phần đuôi tên file. Linux không dùng nó để quyết định bất cứ điều gì — <code>chmod +x</code> và dòng shebang mới làm cho một file chạy được (Chương 7), chứ không phải cái đuôi <code>.sh</code>. Một file tải về tên <code>invoice.pdf.exe</code>, một <code>.jpg</code> thật ra là script, một <code>.txt</code> thật ra là một bản đổ lõi 2 GB: <code>file</code> nói cho bạn biết trong một lệnh, và đáng chạy nó với mọi thứ không do chính bạn tạo ra.</div>
<p class="note-ct"><strong>Ba lệnh cần giữ lại từ bài này:</strong> <code>ls -ltrh</code> cho câu "ở đây có gì và gần đây cái gì đổi", <code>file</code> cho câu "cái này thật ra là gì", và <code>stat</code> cho câu "hệ thống file biết những gì về nó". Cùng nhau chúng trả lời gần như mọi câu hỏi về một file mà không liên quan tới nội dung — còn nội dung thì Chương 3 lo.</p>
</div>
`,
    },

    /* ─────────────────────────── 1.5 Quiz ─────────────────────────── */
    {
      title: '1.5 — Chapter 1 quiz|||1.5 — Kiểm tra Chương 1',
      slug: 'lnx-1-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Tám câu về dấu nhắc $ vs #, khai triển của shell, đường dẫn tuyệt đối vs tương đối, ./script.sh, /etc vs /var vs /usr/local/bin, cột của ls -l, ctime, và file đã xoá vẫn chiếm đĩa.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on the shell and the filesystem. Answer from memory; they follow the lesson order.</p>
<div class="callout ok">Aim for 7/8. The two that matter most in real work: why <code>./script.sh</code> needs the dot (1.2), and why a deleted file can still occupy the disk (1.4).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về shell và hệ thống file. Trả lời bằng trí nhớ; các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Hai câu quan trọng nhất trong việc thật: vì sao <code>./script.sh</code> cần dấu chấm (bài 1.2), và vì sao một file đã xoá vẫn có thể chiếm đĩa (bài 1.4).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Your prompt ends in # instead of $. What does that tell you?|||Dấu nhắc của bạn kết thúc bằng # thay vì $. Điều đó cho bạn biết gì?',
            options: [
              'You are in a subdirectory|||Bạn đang ở trong một thư mục con',
              'You are root — no permission check will stop a mistyped command|||Bạn đang là root — không phép kiểm quyền nào chặn được một lệnh gõ sai',
              'The shell is in error state|||Shell đang ở trạng thái lỗi',
              'You are connected over SSH|||Bạn đang kết nối qua SSH',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why does "echo ~" print /home/an but "echo \'~\'" print ~?|||Vì sao "echo ~" in ra /home/an còn "echo \'~\'" lại in ra ~?',
            options: [
              'echo has a special case for quotes|||echo có xử lý đặc biệt cho dấu nháy',
              'Because ~ is expanded by the SHELL before echo runs — quoting stops the expansion|||Vì ~ được SHELL khai triển trước khi echo chạy — bọc nháy chặn việc khai triển',
              'Single quotes are invalid in bash|||Nháy đơn không hợp lệ trong bash',
              'The home directory is only set in some shells|||Thư mục nhà chỉ được đặt ở vài shell',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A script works when you run it by hand but fails from cron. What is the usual cause?|||Một script chạy tốt khi bạn gõ tay nhưng hỏng khi chạy từ cron. Nguyên nhân thường gặp là gì?',
            options: [
              'cron cannot run bash|||cron không chạy được bash',
              'cron starts it in a different directory, so every relative path breaks — use absolute paths in anything automated|||cron khởi động nó ở một thư mục khác, nên mọi đường dẫn tương đối đều vỡ — hãy dùng đường dẫn tuyệt đối cho mọi thứ tự động',
              'cron strips all arguments|||cron cắt bỏ mọi tham số',
              'The script needs to be in /etc|||Script phải nằm trong /etc',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why do you need "./" to run a script in the current directory?|||Vì sao bạn cần "./" để chạy một script trong thư mục hiện tại?',
            options: [
              'It marks the file as executable|||Nó đánh dấu file là chạy được',
              'The current directory is deliberately NOT in PATH — a security decision, so running a local program is always deliberate|||Thư mục hiện tại CỐ Ý không nằm trong PATH — một quyết định bảo mật, để việc chạy một chương trình cục bộ luôn là hành động có chủ ý',
              'It tells bash the file is a script|||Nó báo cho bash biết file đó là một script',
              'Only for files with a space in the name|||Chỉ cần với file có dấu cách trong tên',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Where should you install your own scripts so a package upgrade cannot remove them?|||Bạn nên cài script của chính mình vào đâu để một lần nâng cấp gói không gỡ mất chúng?',
            options: [
              '/usr/bin',
              '/usr/local/bin — it is in PATH and the package manager never touches it|||/usr/local/bin — nó nằm trong PATH và trình quản lý gói không bao giờ đụng tới',
              '/etc',
              '/tmp',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'ls -l shows a directory with size 4096. What does that mean?|||ls -l hiện một thư mục có kích thước 4096. Điều đó nghĩa là gì?',
            options: [
              'The directory contains 4 KB of files|||Thư mục đó chứa 4 KB file',
              'The directory LISTING occupies one 4 KB block — the contents could be gigabytes; use du to measure them|||Bản thân DANH SÁCH của thư mục chiếm một khối 4 KB — nội dung có thể tới vài gigabyte; dùng du để đo',
              'The directory has 4096 entries|||Thư mục có 4096 mục',
              'It is an empty directory|||Đó là một thư mục rỗng',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In stat output, what is "Change" (ctime)?|||Trong output của stat, "Change" (ctime) là gì?',
            options: [
              'The file creation time|||Thời gian tạo file',
              'When the INODE last changed — permissions, owner, name. Not creation time, and not the same as mtime|||Lần gần nhất INODE thay đổi — quyền, chủ sở hữu, tên. Không phải thời gian tạo, và không giống mtime',
              'When the contents last changed|||Lần gần nhất nội dung thay đổi',
              'When the file was last read|||Lần gần nhất file được đọc',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'df says the disk is full but du finds nothing large. What is the classic cause?|||df báo đĩa đầy nhưng du không tìm ra gì lớn. Nguyên nhân kinh điển là gì?',
            options: [
              'df is wrong and should be ignored|||df sai và nên bỏ qua',
              'A large file was deleted while a process still had it open — the space is freed only when that process exits (lsof +L1 finds it)|||Một file lớn bị xoá trong khi một tiến trình vẫn đang mở nó — chỗ đó chỉ được giải phóng khi tiến trình ấy thoát (lsof +L1 tìm ra nó)',
              'The filesystem needs a reboot|||Hệ thống file cần khởi động lại',
              'du cannot read hidden files|||du không đọc được file ẩn',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
