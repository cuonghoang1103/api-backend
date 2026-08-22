/**
 * Linux & Bash — Chương 3: Văn bản, ống dẫn & chuyển hướng.
 * Ba dòng chuẩn · ống dẫn · grep · bộ công cụ nhỏ · sed · awk · quiz.
 * Output CHẠY THẬT Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 */
const REF = '?ref=%2Fcourses%2Flinux-bash%2Flearn&reflabel=Linux%20%26%20Bash';

export default {
  title: 'Chapter 3 — Text, pipes & redirection|||Chương 3 — Văn bản, ống dẫn & chuyển hướng',
  description: 'Ý tưởng làm nên Unix: công cụ nhỏ, mỗi cái làm một việc, nối lại bằng ống dẫn. Ba dòng chuẩn và mọi cách chuyển hướng chúng; ống dẫn và những gì thật sự chảy qua đó; grep, cut/sort/uniq/tr, sed và awk — đủ sâu để bạn thôi phải mở trình soạn thảo cho những việc mà một dòng lệnh làm được.',
  lessons: [
    /* ─────────────────────────── 3.1 ─────────────────────────── */
    {
      title: '3.1 — Three streams, and every way to redirect them|||3.1 — Ba dòng chuẩn, và mọi cách chuyển hướng chúng',
      slug: 'lnx-3-1-dong-chuan-chuyen-huong',
      type: 'LESSON',
      isFreePreview: true,
      description: 'stdin/stdout/stderr là gì, vì sao thứ tự trong 2>&1 quyết định kết quả, heredoc và here-string, tee, /dev/null, và vì sao "sort file > file" xoá sạch file.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Three streams, and every way to redirect them</h2>
<p class="lead">Every program you run on Linux starts life with three connections already open. It did not ask for them; the shell handed them over before the program's first line ran. Understanding what those three are — and that they are ordinary numbers you can rewire — is what turns a list of memorised symbols (<code>&gt;</code>, <code>2&gt;&amp;1</code>, <code>|</code>, <code>&lt;&lt;</code>) into one small, consistent idea.</p>

<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Input</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">fd 0 — stdin</span><span class="lz-nsub">Where the program reads from. Default: your keyboard. Redirect with <code>&lt;</code>, or fill it from another program with <code>|</code>.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">The process</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">your command</span><span class="lz-nsub">It reads fd 0, writes fd 1, complains on fd 2. It does not know or care what is on the other end of any of them.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Output</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">fd 1 — stdout</span><span class="lz-nsub">The results. Default: your terminal. This is the stream a pipe carries.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">fd 2 — stderr</span><span class="lz-nsub">Errors and diagnostics — deliberately separate, so that piping results does not silently swallow the error message.</span></div></div>
  </div>
</div>

<div class="callout">The separation of 1 and 2 is a genuine design decision, not an accident. It means <code>grep pattern huge.log | wc -l</code> gives you a clean number on stdout <em>while</em> "Permission denied" still lands on your screen instead of being counted as a line. Every time you have seen an error appear despite a redirect, this is why.</div>

<h3>Sending stdout to a file</h3>
<pre><code>ls -l &gt; listing.txt        <span class="tok-comment"># truncate: existing content is destroyed</span>
date &gt;&gt; listing.txt        <span class="tok-comment"># append: add to the end</span>
echo "start" &gt; run.log     <span class="tok-comment"># the usual way to begin a fresh log</span></code></pre>
<div class="callout warn"><code>&gt;</code> truncates the target to zero bytes <strong>before the command runs</strong>, and it does so even if the command then fails or does not exist. <code>badcommand &gt; important.txt</code> leaves you with an empty <code>important.txt</code> and a "command not found". The file was emptied by the shell, not by the command.</div>

<h3>The classic disaster: sort file &gt; file</h3>
<pre><code>sort names.txt &gt; names.txt</code></pre>
<div class="out">$ wc -l names.txt
0 names.txt</div>
<p>The file is now empty, and this catches experienced people. The reason is the ordering above: the shell sets up every redirection <em>first</em>, which truncates <code>names.txt</code> to zero bytes, and only <em>then</em> starts <code>sort</code> — which dutifully reads an empty file and writes nothing. Use a temporary file, or a tool with an explicit in-place flag:</p>
<pre><code>sort names.txt &gt; names.sorted &amp;&amp; mv names.sorted names.txt
sort -o names.txt names.txt      <span class="tok-comment"># sort's own -o handles this correctly</span>
sed -i 's/a/b/' file.txt         <span class="tok-comment"># sed -i edits in place</span>
sponge &lt; names.txt               <span class="tok-comment"># from moreutils: absorbs input before writing</span></code></pre>

<h3>Redirecting stderr, and why order matters</h3>
<pre><code>find / -name "*.conf" 2&gt; errors.txt      <span class="tok-comment"># errors to a file, results to screen</span>
find / -name "*.conf" 2&gt; /dev/null       <span class="tok-comment"># discard the permission-denied noise</span>
make &gt; build.log 2&gt;&amp;1                    <span class="tok-comment"># BOTH into one file</span>
make &amp;&gt; build.log                        <span class="tok-comment"># bash shorthand for the same thing</span></code></pre>
<p>Read <code>2&gt;&amp;1</code> as "make fd 2 point wherever fd 1 currently points". The word <em>currently</em> is the whole lesson:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Correct</span><span class="lz-t">make &gt; build.log 2&gt;&amp;1</span><span class="lz-d">First fd 1 is aimed at build.log. Then fd 2 is aimed where fd 1 points — also build.log. Both captured.</span></div>
  <div class="lz-step"><span class="lz-k">Wrong</span><span class="lz-t">make 2&gt;&amp;1 &gt; build.log</span><span class="lz-d">First fd 2 is aimed where fd 1 points — the TERMINAL. Then fd 1 is moved to build.log. fd 2 still points at the terminal. Errors escape.</span></div>
</div>
<div class="callout ok">Both commands run, neither warns, and the difference only shows up when something fails — usually in CI, at the exact moment you needed the error message. Rule: <strong><code>2&gt;&amp;1</code> goes last.</strong> Or sidestep it entirely with <code>&amp;&gt;</code>, which cannot be written in the wrong order.</div>

<h3>/dev/null and friends</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>/dev/null</code></span><span class="v">Discards everything written to it, and reads as empty. The universal "I do not want this output".</span></div>
  <div class="kv"><span class="k"><code>/dev/zero</code></span><span class="v">An infinite stream of zero bytes. <code>dd if=/dev/zero of=test bs=1M count=100</code> makes a 100 MB test file.</span></div>
  <div class="kv"><span class="k"><code>/dev/urandom</code></span><span class="v">An infinite stream of random bytes. <code>head -c 32 /dev/urandom | base64</code> is a fine way to generate a secret.</span></div>
</div>
<pre><code>command &gt; /dev/null           <span class="tok-comment"># silence the results, keep errors visible</span>
command 2&gt; /dev/null          <span class="tok-comment"># silence errors, keep the results</span>
command &gt; /dev/null 2&gt;&amp;1      <span class="tok-comment"># total silence — check the exit code instead</span>
command &amp;&gt; /dev/null          <span class="tok-comment"># same, shorter</span></code></pre>
<p>Total silence is the right choice in exactly one situation: when you only care whether the command <em>succeeded</em>, and the exit code carries that. <code>if ping -c1 -W1 host &amp;&gt; /dev/null; then …</code> is idiomatic. Silencing a command whose output you have not read is how bugs hide.</p>

<h3>Feeding stdin</h3>
<pre><code>sort &lt; names.txt              <span class="tok-comment"># file into stdin</span>
sort names.txt                <span class="tok-comment"># most tools also just take a filename</span>
wc -l &lt; access.log            <span class="tok-comment"># prints only a number, no filename — useful in scripts</span></code></pre>
<p>That last difference is worth knowing: given a filename, <code>wc -l</code> prints <code>4213 access.log</code>; given stdin, it prints <code>4213</code>. When you are capturing the result into a variable, the second form saves you a <code>cut</code>.</p>

<h3>Heredocs: multi-line input inline</h3>
<pre><code>cat &lt;&lt;EOF &gt; config.yml
host: localhost
port: \${PORT}
EOF</code></pre>
<p>Everything between <code>&lt;&lt;EOF</code> and a line containing only <code>EOF</code> becomes the command's stdin. Three variants change the behaviour:</p>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>&lt;&lt;EOF</code></span><span class="v">Variables and <code>\$(commands)</code> ARE expanded. Use for templating.</span></div>
  <div class="kv"><span class="k"><code>&lt;&lt;'EOF'</code></span><span class="v">Quoted delimiter: nothing is expanded, the text is passed through byte for byte. Use for scripts, JSON, anything containing a <code>\$</code>.</span></div>
  <div class="kv"><span class="k"><code>&lt;&lt;-EOF</code></span><span class="v">Strips leading TAB characters (not spaces), so the heredoc can be indented inside a function.</span></div>
</div>
<pre><code><span class="tok-comment"># Writing a script from a script — MUST be quoted, or \$1 expands now</span>
cat &lt;&lt;'EOF' &gt; deploy.sh
#!/usr/bin/env bash
echo "deploying \$1"
EOF

<span class="tok-comment"># A here-string: one line, no delimiter needed</span>
grep -c ERROR &lt;&lt;&lt; "\$log_text"</code></pre>
<div class="callout">Heredocs are how you write a config file, an SQL statement or a remote command block inside a script without a separate file and without fighting quotes. <code>ssh vps 'bash -s' &lt;&lt;'EOF'</code> sends a whole script to a remote machine to execute — Chapter 9 uses this.</div>

<h3>tee: write to a file AND keep going</h3>
<pre><code>make 2&gt;&amp;1 | tee build.log              <span class="tok-comment"># watch it live, and keep a copy</span>
make 2&gt;&amp;1 | tee -a build.log           <span class="tok-comment"># -a appends instead of truncating</span>
echo 'net.ipv4.ip_forward=1' | sudo tee -a /etc/sysctl.conf</code></pre>
<div class="callout ok">That third line solves a problem people hit constantly: <code>sudo echo x &gt;&gt; /etc/file</code> fails with "Permission denied", because <code>sudo</code> elevates <code>echo</code> but the <em>redirection</em> is performed by your unprivileged shell. <code>tee</code> is a program, so <code>sudo</code> can elevate it, and it does the writing. This is the standard fix.</div>

<h3>Beyond 0, 1 and 2</h3>
<p>File descriptors are just small integers. You can open your own:</p>
<pre><code>exec 3&gt; audit.log            <span class="tok-comment"># open fd 3 pointing at a file</span>
echo "step 1 done" &gt;&amp;3       <span class="tok-comment"># write to it, without touching stdout</span>
exec 3&gt;&amp;-                    <span class="tok-comment"># close it</span></code></pre>
<p>This is how a script keeps a structured audit trail separate from its human-readable output — the log survives even when stdout is piped elsewhere. You will not need it often, but when you do, nothing else does the job.</p>

<h3>noclobber: a seatbelt for &gt;</h3>
<pre><code>set -o noclobber
echo hi &gt; existing.txt</code></pre>
<div class="out">bash: existing.txt: cannot overwrite existing file</div>
<p>With <code>noclobber</code> set, <code>&gt;</code> refuses to truncate a file that already exists; <code>&gt;|</code> forces it when you really mean to. Some people put this in their <code>~/.bashrc</code> permanently. It is a reasonable trade: it costs one extra character on the rare intentional overwrite, and it prevents the accidental one.</p>

<a class="link-card" href="https://www.gnu.org/software/bash/manual/html_node/Redirections.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Bash Manual — Redirections</span><span class="lc-sub">Every redirection operator in one page, including the fd-duplication forms and process substitution. The reference to bookmark.</span></span>
</a>
<a class="link-card" href="https://mywiki.wooledge.org/BashFAQ/055" target="_blank" rel="noopener">
  <span class="lc-ico">🔧</span>
  <span class="lc-body"><span class="lc-title">BashFAQ — "How can I redirect stdout and stderr?"</span><span class="lc-sub">Walks through the <code>2&gt;&amp;1</code> ordering trap step by step, with the fd table drawn out at each stage.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: capture exactly the output you meant</span><span class="lc-sub">Graded tasks on stream separation, <code>2&gt;&amp;1</code> ordering, heredoc quoting and <code>sudo tee</code>.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> <code>sudo echo "text" &gt;&gt; /etc/hosts</code> fails, and the error is misleading. <code>sudo</code> runs <code>echo</code> as root, but your shell — still running as you — is the thing that opens <code>/etc/hosts</code> for appending, and it has no permission. Nothing you add to the <code>echo</code> can fix it. Use <code>echo "text" | sudo tee -a /etc/hosts</code>, or <code>sudo bash -c 'echo "text" &gt;&gt; /etc/hosts'</code>, which moves the redirection inside the elevated shell.</div>
<p class="note-ct"><strong>The one idea to carry forward:</strong> a program does not know where its output goes. That is the entire reason pipes work, why the same command can print to your screen, into a file, or into another program without changing a line of its code, and why <code>2&gt;&amp;1</code> is about <em>pointing</em> rather than <em>merging</em>. The next lesson takes this one step further and connects two programs directly.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Ba dòng chuẩn, và mọi cách chuyển hướng chúng</h2>
<p class="lead">Mọi chương trình bạn chạy trên Linux đều sinh ra với sẵn ba đường kết nối đã mở. Nó không hề xin; shell đã đưa cho nó trước khi dòng đầu tiên của chương trình kịp chạy. Hiểu ba thứ đó là gì — và rằng chúng chỉ là những CON SỐ bình thường mà bạn đấu nối lại được — chính là thứ biến một mớ ký hiệu học thuộc (<code>&gt;</code>, <code>2&gt;&amp;1</code>, <code>|</code>, <code>&lt;&lt;</code>) thành một ý tưởng nhỏ và nhất quán.</p>

<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Đầu vào</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">fd 0 — stdin</span><span class="lz-nsub">Nơi chương trình đọc vào. Mặc định: bàn phím của bạn. Chuyển hướng bằng <code>&lt;</code>, hoặc rót từ một chương trình khác bằng <code>|</code>.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Tiến trình</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">lệnh của bạn</span><span class="lz-nsub">Nó đọc fd 0, ghi fd 1, than phiền ở fd 2. Nó không biết và cũng không quan tâm đầu kia của bất kỳ cái nào là gì.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Đầu ra</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">fd 1 — stdout</span><span class="lz-nsub">Kết quả. Mặc định: terminal của bạn. Đây là dòng mà một ống dẫn mang đi.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">fd 2 — stderr</span><span class="lz-nsub">Lỗi và thông báo chẩn đoán — tách riêng một cách CÓ CHỦ Ý, để việc đưa kết quả qua ống không âm thầm nuốt mất thông báo lỗi.</span></div></div>
  </div>
</div>

<div class="callout">Việc tách 1 và 2 là một quyết định thiết kế thật sự, không phải chuyện tình cờ. Nó khiến <code>grep pattern huge.log | wc -l</code> cho bạn một con số sạch ở stdout <em>TRONG KHI</em> dòng "Permission denied" vẫn hiện lên màn hình thay vì bị đếm thành một dòng kết quả. Mỗi lần bạn thấy một lỗi hiện ra bất chấp đã chuyển hướng, lý do là đây.</div>

<h3>Đưa stdout vào một file</h3>
<pre><code>ls -l &gt; listing.txt        <span class="tok-comment"># cắt trắng: nội dung cũ bị huỷ</span>
date &gt;&gt; listing.txt        <span class="tok-comment"># nối thêm: ghi vào cuối</span>
echo "start" &gt; run.log     <span class="tok-comment"># cách thường dùng để mở một log mới</span></code></pre>
<div class="callout warn"><code>&gt;</code> cắt file đích về 0 byte <strong>TRƯỚC KHI lệnh chạy</strong>, và nó làm vậy kể cả khi lệnh sau đó thất bại hoặc không hề tồn tại. <code>badcommand &gt; important.txt</code> để lại cho bạn một <code>important.txt</code> rỗng cùng dòng "command not found". File bị làm rỗng bởi SHELL, không phải bởi lệnh.</div>

<h3>Tai nạn kinh điển: sort file &gt; file</h3>
<pre><code>sort names.txt &gt; names.txt</code></pre>
<div class="out">$ wc -l names.txt
0 names.txt</div>
<p>File giờ rỗng, và chuyện này bẫy cả người có kinh nghiệm. Lý do chính là thứ tự vừa nói ở trên: shell dựng mọi chuyển hướng <em>TRƯỚC</em>, tức là cắt <code>names.txt</code> về 0 byte, rồi <em>SAU ĐÓ</em> mới khởi động <code>sort</code> — và <code>sort</code> ngoan ngoãn đọc một file rỗng rồi ghi ra không gì cả. Hãy dùng file tạm, hoặc một công cụ có cờ sửa tại chỗ tường minh:</p>
<pre><code>sort names.txt &gt; names.sorted &amp;&amp; mv names.sorted names.txt
sort -o names.txt names.txt      <span class="tok-comment"># cờ -o của chính sort xử lý đúng chuyện này</span>
sed -i 's/a/b/' file.txt         <span class="tok-comment"># sed -i sửa tại chỗ</span>
sponge &lt; names.txt               <span class="tok-comment"># của moreutils: hút hết đầu vào rồi mới ghi</span></code></pre>

<h3>Chuyển hướng stderr, và vì sao thứ tự quyết định</h3>
<pre><code>find / -name "*.conf" 2&gt; errors.txt      <span class="tok-comment"># lỗi vào file, kết quả ra màn hình</span>
find / -name "*.conf" 2&gt; /dev/null       <span class="tok-comment"># vứt bỏ đám nhiễu permission-denied</span>
make &gt; build.log 2&gt;&amp;1                    <span class="tok-comment"># CẢ HAI vào chung một file</span>
make &amp;&gt; build.log                        <span class="tok-comment"># cách viết tắt của bash cho đúng việc đó</span></code></pre>
<p>Hãy đọc <code>2&gt;&amp;1</code> là "cho fd 2 trỏ tới bất cứ đâu mà fd 1 ĐANG trỏ tới". Chữ <em>ĐANG</em> chính là toàn bộ bài học:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Đúng</span><span class="lz-t">make &gt; build.log 2&gt;&amp;1</span><span class="lz-d">Trước tiên fd 1 chĩa vào build.log. Rồi fd 2 chĩa vào chỗ fd 1 đang trỏ — cũng là build.log. Bắt được cả hai.</span></div>
  <div class="lz-step"><span class="lz-k">Sai</span><span class="lz-t">make 2&gt;&amp;1 &gt; build.log</span><span class="lz-d">Trước tiên fd 2 chĩa vào chỗ fd 1 đang trỏ — là TERMINAL. Rồi fd 1 bị dời sang build.log. fd 2 vẫn chĩa vào terminal. Lỗi thoát ra ngoài.</span></div>
</div>
<div class="callout ok">Cả hai lệnh đều chạy, chẳng lệnh nào cảnh báo, và khác biệt chỉ lộ ra khi có gì đó hỏng — thường là trong CI, đúng vào lúc bạn cần thông báo lỗi nhất. Quy tắc: <strong><code>2&gt;&amp;1</code> đứng CUỐI CÙNG.</strong> Hoặc tránh hẳn bằng <code>&amp;&gt;</code>, thứ không thể viết sai thứ tự được.</div>

<h3>/dev/null và họ hàng</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>/dev/null</code></span><span class="v">Vứt bỏ mọi thứ ghi vào nó, và đọc ra thì rỗng. Cái "tôi không muốn đầu ra này" phổ quát.</span></div>
  <div class="kv"><span class="k"><code>/dev/zero</code></span><span class="v">Một dòng byte 0 vô tận. <code>dd if=/dev/zero of=test bs=1M count=100</code> tạo một file thử 100 MB.</span></div>
  <div class="kv"><span class="k"><code>/dev/urandom</code></span><span class="v">Một dòng byte ngẫu nhiên vô tận. <code>head -c 32 /dev/urandom | base64</code> là một cách tốt để sinh khoá bí mật.</span></div>
</div>
<pre><code>command &gt; /dev/null           <span class="tok-comment"># dập kết quả, giữ lỗi hiện ra</span>
command 2&gt; /dev/null          <span class="tok-comment"># dập lỗi, giữ kết quả</span>
command &gt; /dev/null 2&gt;&amp;1      <span class="tok-comment"># im hoàn toàn — hãy xem mã thoát thay vì output</span>
command &amp;&gt; /dev/null          <span class="tok-comment"># y hệt, ngắn hơn</span></code></pre>
<p>Im hoàn toàn là lựa chọn đúng trong đúng MỘT tình huống: khi bạn chỉ quan tâm lệnh đó có <em>THÀNH CÔNG</em> hay không, và mã thoát đã mang thông tin đó. <code>if ping -c1 -W1 host &amp;&gt; /dev/null; then …</code> là cách viết chuẩn mực. Còn dập tiếng một lệnh mà bạn chưa từng đọc output của nó là cách để lỗi ẩn mình.</p>

<h3>Rót vào stdin</h3>
<pre><code>sort &lt; names.txt              <span class="tok-comment"># file vào stdin</span>
sort names.txt                <span class="tok-comment"># phần lớn công cụ cũng nhận thẳng tên file</span>
wc -l &lt; access.log            <span class="tok-comment"># chỉ in con số, không có tên file — tiện trong script</span></code></pre>
<p>Khác biệt cuối đó đáng biết: đưa tên file thì <code>wc -l</code> in ra <code>4213 access.log</code>; đưa qua stdin thì nó in <code>4213</code>. Khi bạn hứng kết quả vào một biến, dạng thứ hai tiết kiệm cho bạn một lần <code>cut</code>.</p>

<h3>Heredoc: đầu vào nhiều dòng viết ngay tại chỗ</h3>
<pre><code>cat &lt;&lt;EOF &gt; config.yml
host: localhost
port: \${PORT}
EOF</code></pre>
<p>Mọi thứ giữa <code>&lt;&lt;EOF</code> và một dòng chỉ chứa mỗi chữ <code>EOF</code> trở thành stdin của lệnh. Ba biến thể làm đổi hành vi:</p>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>&lt;&lt;EOF</code></span><span class="v">Biến và <code>\$(lệnh)</code> ĐƯỢC khai triển. Dùng để dựng mẫu (template).</span></div>
  <div class="kv"><span class="k"><code>&lt;&lt;'EOF'</code></span><span class="v">Dấu kết thúc đặt trong nháy: KHÔNG khai triển gì cả, văn bản đi qua nguyên từng byte. Dùng cho script, JSON, mọi thứ có chứa <code>\$</code>.</span></div>
  <div class="kv"><span class="k"><code>&lt;&lt;-EOF</code></span><span class="v">Cắt các ký tự TAB đứng đầu (không cắt dấu cách), để heredoc thụt vào được bên trong một hàm.</span></div>
</div>
<pre><code><span class="tok-comment"># Viết một script từ trong một script — BẮT BUỘC đặt nháy, không thì \$1 khai triển ngay bây giờ</span>
cat &lt;&lt;'EOF' &gt; deploy.sh
#!/usr/bin/env bash
echo "đang deploy \$1"
EOF

<span class="tok-comment"># Here-string: một dòng, không cần dấu kết thúc</span>
grep -c ERROR &lt;&lt;&lt; "\$log_text"</code></pre>
<div class="callout">Heredoc là cách bạn viết một file cấu hình, một câu lệnh SQL hay một khối lệnh chạy từ xa ngay bên trong script mà không cần file riêng và không phải vật lộn với dấu nháy. <code>ssh vps 'bash -s' &lt;&lt;'EOF'</code> gửi nguyên một script sang máy từ xa để chạy — Chương 9 dùng đúng cách này.</div>

<h3>tee: vừa ghi ra file VỪA chảy tiếp</h3>
<pre><code>make 2&gt;&amp;1 | tee build.log              <span class="tok-comment"># xem trực tiếp, và giữ lại một bản</span>
make 2&gt;&amp;1 | tee -a build.log           <span class="tok-comment"># -a nối thêm thay vì cắt trắng</span>
echo 'net.ipv4.ip_forward=1' | sudo tee -a /etc/sysctl.conf</code></pre>
<div class="callout ok">Dòng thứ ba giải quyết một vấn đề người ta gặp suốt: <code>sudo echo x &gt;&gt; /etc/file</code> thất bại với "Permission denied", vì <code>sudo</code> nâng quyền cho <code>echo</code> nhưng CHÍNH VIỆC CHUYỂN HƯỚNG lại do shell không có quyền của bạn thực hiện. <code>tee</code> là một CHƯƠNG TRÌNH, nên <code>sudo</code> nâng quyền được cho nó, và nó mới là thứ đi ghi file. Đây là cách sửa chuẩn.</div>

<h3>Vượt ra ngoài 0, 1 và 2</h3>
<p>Bộ mô tả file chỉ là những số nguyên nhỏ. Bạn tự mở thêm được:</p>
<pre><code>exec 3&gt; audit.log            <span class="tok-comment"># mở fd 3 trỏ vào một file</span>
echo "xong bước 1" &gt;&amp;3       <span class="tok-comment"># ghi vào đó mà không đụng tới stdout</span>
exec 3&gt;&amp;-                    <span class="tok-comment"># đóng nó lại</span></code></pre>
<p>Đây là cách một script giữ một vệt kiểm toán có cấu trúc tách khỏi phần output cho người đọc — vệt log đó sống sót ngay cả khi stdout bị đưa qua ống đi chỗ khác. Bạn sẽ không cần nó thường xuyên, nhưng khi cần thì không có thứ gì khác làm thay được.</p>

<h3>noclobber: dây an toàn cho dấu &gt;</h3>
<pre><code>set -o noclobber
echo hi &gt; existing.txt</code></pre>
<div class="out">bash: existing.txt: cannot overwrite existing file</div>
<p>Khi bật <code>noclobber</code>, <code>&gt;</code> từ chối cắt trắng một file đã tồn tại; còn <code>&gt;|</code> ép nó làm khi bạn thật sự muốn thế. Có người đặt hẳn dòng này vào <code>~/.bashrc</code> vĩnh viễn. Đó là một đánh đổi hợp lý: tốn thêm đúng một ký tự cho những lần ghi đè CÓ CHỦ Ý hiếm hoi, và ngăn được lần ghi đè do vô ý.</p>

<a class="link-card" href="https://www.gnu.org/software/bash/manual/html_node/Redirections.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Bash Manual — Redirections</span><span class="lc-sub">Mọi toán tử chuyển hướng gói trong một trang, gồm cả dạng nhân bản fd và thay thế tiến trình. Trang đáng đánh dấu lại.</span></span>
</a>
<a class="link-card" href="https://mywiki.wooledge.org/BashFAQ/055" target="_blank" rel="noopener">
  <span class="lc-ico">🔧</span>
  <span class="lc-body"><span class="lc-title">BashFAQ — "Chuyển hướng stdout và stderr thế nào?"</span><span class="lc-sub">Đi từng bước qua cái bẫy thứ tự của <code>2&gt;&amp;1</code>, có vẽ ra bảng fd ở mỗi giai đoạn.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: hứng đúng cái output bạn định hứng</span><span class="lc-sub">Bài chấm điểm về tách dòng chuẩn, thứ tự <code>2&gt;&amp;1</code>, dấu nháy trong heredoc và <code>sudo tee</code>.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> <code>sudo echo "text" &gt;&gt; /etc/hosts</code> thất bại, và thông báo lỗi thì gây hiểu nhầm. <code>sudo</code> chạy <code>echo</code> với quyền root, nhưng shell của bạn — vẫn đang chạy với quyền của chính bạn — mới là thứ đi mở <code>/etc/hosts</code> để ghi thêm, và nó không có quyền. Không có gì bạn thêm vào <code>echo</code> chữa được. Hãy dùng <code>echo "text" | sudo tee -a /etc/hosts</code>, hoặc <code>sudo bash -c 'echo "text" &gt;&gt; /etc/hosts'</code>, cách này đưa việc chuyển hướng vào BÊN TRONG cái shell đã được nâng quyền.</div>
<p class="note-ct"><strong>Ý tưởng duy nhất cần mang theo:</strong> một chương trình KHÔNG BIẾT output của nó đi đâu. Đó chính là toàn bộ lý do ống dẫn hoạt động, lý do cùng một lệnh có thể in ra màn hình, vào một file, hay vào một chương trình khác mà không phải đổi một dòng mã nào của nó, và lý do <code>2&gt;&amp;1</code> là chuyện <em>CHĨA VÀO ĐÂU</em> chứ không phải chuyện <em>GỘP LẠI</em>. Bài kế tiếp đẩy ý này đi thêm một bước và nối thẳng hai chương trình với nhau.</p>
</div>
`,
    },
    /* ─────────────────────────── 3.2 ─────────────────────────── */
    {
      title: '3.2 — Pipes: two programs, running at the same time|||3.2 — Ống dẫn: hai chương trình, chạy cùng một lúc',
      slug: 'lnx-3-2-ong-dan',
      type: 'LESSON',
      description: 'Ống dẫn thật ra là một bộ đệm của nhân và hai tiến trình chạy song song; SIGPIPE và vì sao head làm lệnh dừng ngay; pipefail và PIPESTATUS; bẫy đệm khiến tail -f | grep trông như treo; xargs -P; và thay thế tiến trình.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Pipes: two programs, running at the same time</h2>
<p class="lead">Almost everyone's first mental model of <code>a | b</code> is "run <code>a</code>, collect its output, then feed it to <code>b</code>". That model is wrong, and every surprising thing about pipes — why <code>head</code> on a 10 GB file is instant, why <code>tail -f | grep</code> appears to hang, why a <code>while read</code> loop loses its variables — follows from the correction.</p>

<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Process A</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">grep ERROR huge.log</span><span class="lz-nsub">Started immediately. Its fd 1 is not a terminal — it is the write end of a pipe.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Kernel pipe buffer</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">64 KB, in memory</span><span class="lz-nsub">No file, no disk. When it fills, A blocks until B reads. When it empties, B blocks until A writes. The kernel does the scheduling.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Process B</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">wc -l</span><span class="lz-nsub">Started at the SAME MOMENT as A, not after it. Its fd 0 is the read end of the pipe.</span></div></div>
  </div>
</div>

<p>Both processes are launched together and run concurrently. The pipe is a fixed-size buffer in kernel memory — on Linux, 64 KB by default — and the kernel automatically pauses whichever side is running ahead. Nothing touches the disk, and no intermediate file exists.</p>

<div class="callout ok">This is why <code>grep pattern 10GB.log | head -5</code> returns instantly. <code>head</code> prints five lines and exits. <code>grep</code> keeps writing, the pipe fills, and its next <code>write()</code> hits a pipe with no reader — so the kernel sends it <strong>SIGPIPE</strong> and <code>grep</code> dies. The file is never fully read. Under the "collect then feed" model this would take minutes; under the real model it takes milliseconds.</div>

<pre><code>yes | head -3</code></pre>
<div class="out">y
y
y</div>
<p><code>yes</code> prints "y" forever. It stops here for exactly one reason: <code>head</code> exited, and the next write earned a SIGPIPE. Try to explain that output with the sequential model and you cannot — <code>yes</code> would never finish producing.</p>

<h3>The exit status of a pipeline</h3>
<pre><code>false | true
echo \$?</code></pre>
<div class="out">0</div>
<p>By default a pipeline reports only the <strong>last</strong> command's exit status. The failure of <code>false</code> vanishes. In a script that checks errors, this means a broken first stage passes silently:</p>
<pre><code><span class="tok-comment"># Looks safe. Is not. curl can 404 and this still "succeeds".</span>
curl -s https://api.example.com/data | jq '.items' &gt; out.json

set -o pipefail          <span class="tok-comment"># now the pipeline fails if ANY stage fails</span>
curl -s https://api.example.com/data | jq '.items' &gt; out.json
echo \$?</code></pre>
<div class="out">22</div>
<p>Or inspect every stage individually — bash keeps them in an array:</p>
<pre><code>curl -s bad-url | jq '.' | wc -l
echo "\${PIPESTATUS[@]}"</code></pre>
<div class="out">6 2 0</div>
<div class="callout warn"><code>\${PIPESTATUS[@]}</code> is overwritten by the <em>next</em> command — including an <code>echo</code>. Copy it first (<code>local st=("\${PIPESTATUS[@]}")</code>) if you need to test more than one element. Chapter 7 makes <code>set -euo pipefail</code> the standard opening of every script, and this is the <code>pipefail</code> half of it.</div>

<h3>stderr does not travel through a pipe</h3>
<pre><code>make | grep -i warning              <span class="tok-comment"># misses warnings — most builds write them to stderr</span>
make 2&gt;&amp;1 | grep -i warning         <span class="tok-comment"># correct: merge first, then pipe</span>
make |&amp; grep -i warning             <span class="tok-comment"># bash 4+ shorthand for exactly that</span></code></pre>
<p>A pipe connects fd 1 to fd 0. fd 2 is untouched and still goes to your terminal. Whenever a pipeline "finds nothing" from a command that is visibly printing text, this is the first thing to check.</p>

<h3>The buffering trap</h3>
<pre><code>tail -f /var/log/app.log | grep ERROR</code></pre>
<div class="out">(nothing, for minutes — then 400 lines at once)</div>
<p>Nothing is broken. The C standard library changes its buffering strategy based on what fd 1 <em>is</em>: <strong>line-buffered</strong> when it is a terminal, <strong>block-buffered</strong> (4 KB or more) when it is a pipe. Since <code>grep</code>'s output now goes to a pipe rather than your screen, it waits until it has 4 KB of matches before flushing. On a quiet log that can be hours.</p>
<pre><code>tail -f app.log | grep --line-buffered ERROR     <span class="tok-comment"># grep's own flag</span>
tail -f app.log | stdbuf -oL grep ERROR          <span class="tok-comment"># force line buffering on any tool</span>
tail -f app.log | awk '/ERROR/ { print; fflush() }'</code></pre>
<div class="callout">This one costs people hours of debugging, because the symptom — "my monitoring pipeline shows nothing" — looks exactly like "there are no errors". Whenever you build a live-following pipeline, add <code>--line-buffered</code> or <code>stdbuf -oL</code> before you trust its silence.</div>

<h3>The subshell trap</h3>
<pre><code>count=0
cat access.log | while read -r line; do
  count=\$((count + 1))
done
echo "\$count"</code></pre>
<div class="out">0</div>
<p>Every stage of a pipeline runs in its own <strong>subshell</strong> — a forked child process. The <code>while</code> loop really did increment <code>count</code>, but it did so in a child, and when the child exited its memory went with it. The parent's <code>count</code> was never touched.</p>
<pre><code><span class="tok-comment"># Fix 1: redirect instead of piping — no subshell</span>
while read -r line; do count=\$((count + 1)); done &lt; access.log

<span class="tok-comment"># Fix 2: process substitution — the loop stays in the current shell</span>
while read -r line; do count=\$((count + 1)); done &lt; &lt;(grep ERROR access.log)

<span class="tok-comment"># Fix 3: shopt -s lastpipe (bash only, non-interactive) runs the LAST stage in the parent</span>
shopt -s lastpipe</code></pre>
<p>Fix 2 is the general one, and it introduces a construct worth knowing on its own.</p>

<h3>Process substitution: a command that looks like a file</h3>
<pre><code>diff &lt;(sort a.txt) &lt;(sort b.txt)         <span class="tok-comment"># compare two sorted outputs, no temp files</span>
diff &lt;(ssh vps 'cat /etc/nginx/nginx.conf') /etc/nginx/nginx.conf
comm -13 &lt;(sort installed.txt) &lt;(sort wanted.txt)   <span class="tok-comment"># what is missing</span>
tee &gt;(gzip &gt; log.gz) &gt; log.txt           <span class="tok-comment"># write both compressed and plain</span></code></pre>
<p><code>&lt;(cmd)</code> runs <code>cmd</code> and hands its output to the outer command as a <em>filename</em> — literally <code>/dev/fd/63</code>. That lets tools which insist on files (<code>diff</code>, <code>comm</code>, <code>join</code>) work on live command output. <code>&gt;(cmd)</code> is the mirror image, for tools that want a file to write into.</p>
<div class="callout ok">The first line is one of the most useful commands in this course. "Is this config the same as the one on the server?" and "which packages did I forget to install?" both become one line, with no temporary files to clean up and no chance of comparing a stale copy.</div>

<h3>xargs: turning input into arguments</h3>
<p>Pipes connect stdout to <em>stdin</em>. But many commands — <code>rm</code>, <code>mkdir</code>, <code>git add</code> — take filenames as <em>arguments</em>, not on stdin. <code>xargs</code> is the adapter between the two:</p>
<pre><code>find . -name "*.tmp" -print0 | xargs -0 rm          <span class="tok-comment"># NUL-safe (Lesson 2.3)</span>
cat urls.txt | xargs -n1 curl -sO                   <span class="tok-comment"># -n1: one argument per invocation</span>
cat urls.txt | xargs -P 8 -n1 curl -sO              <span class="tok-comment"># -P 8: EIGHT at a time, in parallel</span>
ls *.jpg | xargs -I{} convert {} {}.webp            <span class="tok-comment"># -I{}: placeholder anywhere in the command</span>
find . -name "*.log" | xargs -r gzip                <span class="tok-comment"># -r: do nothing if input is empty</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-P N</code></span><span class="v">Run N invocations concurrently. The cheapest parallelism in the shell — <code>-P $(nproc)</code> uses every core. Output from different jobs can interleave, so redirect per-job if order matters.</span></div>
  <div class="kv"><span class="k"><code>-r</code></span><span class="v">Do not run the command at all when input is empty. Without it, <code>xargs rm</code> on empty input runs <code>rm</code> with no arguments — harmless — but <code>xargs docker rm</code> or <code>xargs -I{} rm -rf {}/</code> can do real damage.</span></div>
  <div class="kv"><span class="k"><code>-0</code></span><span class="v">Split on NUL rather than whitespace. Pair with <code>find -print0</code>. Without it, a filename containing a space becomes two arguments.</span></div>
  <div class="kv"><span class="k"><code>-t</code></span><span class="v">Print each command before running it. The dry run: combine with <code>echo</code> to see everything without doing anything.</span></div>
</div>

<h3>Reading a real pipeline</h3>
<pre><code>awk '{print \$1}' access.log | sort | uniq -c | sort -rn | head -10</code></pre>
<div class="out">  4821 203.0.113.45
  1109 198.51.100.7
   847 192.0.2.19
   612 203.0.113.88</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">awk '{print \$1}'</span><span class="lz-t">extract field 1 — the IP</span><span class="lz-d">One IP per line, 400,000 lines, mostly repeated.</span></div>
  <div class="lz-step"><span class="lz-k">sort</span><span class="lz-t">group identical lines together</span><span class="lz-d">Required, because uniq only collapses ADJACENT duplicates. This is the step people forget.</span></div>
  <div class="lz-step"><span class="lz-k">uniq -c</span><span class="lz-t">collapse and count</span><span class="lz-d">Now each line is "count IP". 400,000 lines became maybe 3,000.</span></div>
  <div class="lz-step"><span class="lz-k">sort -rn</span><span class="lz-t">sort numerically, descending</span><span class="lz-d">-n so 100 beats 99; without it you get lexicographic order and 99 wins.</span></div>
  <div class="lz-step"><span class="lz-k">head -10</span><span class="lz-t">the top ten</span><span class="lz-d">And, thanks to SIGPIPE, it can end the whole pipeline early.</span></div>
</div>
<p>Five programs, none of which knows the others exist, answering a question nobody wrote a tool for. That is the Unix philosophy from Lesson 0.2, in one line you will genuinely use.</p>

<a class="link-card" href="https://man7.org/linux/man-pages/man7/pipe.7.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">pipe(7) — capacity, blocking and SIGPIPE</span><span class="lc-sub">The kernel's own description: the 64 KB buffer, what happens when it fills, and the exact conditions for SIGPIPE and EPIPE.</span></span>
</a>
<a class="link-card" href="https://mywiki.wooledge.org/BashPitfalls" target="_blank" rel="noopener">
  <span class="lc-ico">🔧</span>
  <span class="lc-body"><span class="lc-title">Bash Pitfalls — the subshell and buffering entries</span><span class="lc-sub">A numbered list of the mistakes everyone makes, each with a reproduction and a fix. Pitfalls 1, 14 and 25 are this lesson.</span></span>
</a>
<a class="link-card" href="https://www.gnu.org/software/findutils/manual/html_node/find_html/Invoking-xargs.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">GNU xargs — invocation and safety</span><span class="lc-sub">Why <code>-0</code> and <code>-r</code> exist, and how <code>-P</code> interacts with output interleaving.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: build and debug a pipeline</span><span class="lc-sub">Graded tasks on pipefail, the subshell trap, line buffering, and parallel <code>xargs -P</code> on a real log file.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> <code>uniq</code> without <code>sort</code>. <code>uniq</code> only collapses <em>adjacent</em> identical lines — it holds one line in memory, not a set. On unsorted input it silently under-counts, and the output looks completely plausible: you get numbers, they are just wrong. <code>sort | uniq -c</code> is the correct pair, always. (<code>sort -u</code> is the shortcut when you want unique lines but not counts.)</div>
<p class="note-ct"><strong>Two habits for building pipelines:</strong> construct them left to right, adding one stage at a time and looking at the output after each — a pipeline that is wrong in the middle produces plausible-looking garbage at the end. And pipe through <code>head</code> while you experiment: it makes every iteration instant on a huge file, and SIGPIPE means you are not secretly reading 10 GB each time you press Enter.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Ống dẫn: hai chương trình, chạy cùng một lúc</h2>
<p class="lead">Mô hình đầu tiên trong đầu gần như ai cũng có về <code>a | b</code> là "chạy <code>a</code>, hứng lấy output của nó, rồi rót cho <code>b</code>". Mô hình đó SAI, và mọi điều bất ngờ về ống dẫn — vì sao <code>head</code> trên file 10 GB lại tức thì, vì sao <code>tail -f | grep</code> trông như treo, vì sao một vòng <code>while read</code> đánh mất biến của nó — đều suy ra từ chỗ sửa lại này.</p>

<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Tiến trình A</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">grep ERROR huge.log</span><span class="lz-nsub">Khởi động ngay lập tức. fd 1 của nó không phải terminal — đó là đầu ghi của một ống.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Bộ đệm ống của nhân</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">64 KB, nằm trong bộ nhớ</span><span class="lz-nsub">Không file, không đĩa. Đầy thì A bị chặn cho tới khi B đọc bớt. Cạn thì B bị chặn cho tới khi A ghi thêm. Nhân lo việc điều phối.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Tiến trình B</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">wc -l</span><span class="lz-nsub">Khởi động CÙNG MỘT LÚC với A, không phải sau A. fd 0 của nó là đầu đọc của cái ống.</span></div></div>
  </div>
</div>

<p>Cả hai tiến trình được khởi chạy cùng nhau và chạy song song. Ống dẫn là một bộ đệm kích thước cố định nằm trong bộ nhớ nhân — trên Linux mặc định 64 KB — và nhân tự động tạm dừng bên nào đang chạy nhanh hơn. Không có gì chạm vào đĩa, và không có file trung gian nào tồn tại.</p>

<div class="callout ok">Đây là lý do <code>grep pattern 10GB.log | head -5</code> trả về tức thì. <code>head</code> in ra năm dòng rồi thoát. <code>grep</code> vẫn ghi tiếp, ống đầy lên, và lần <code>write()</code> kế tiếp của nó đụng phải một cái ống KHÔNG CÒN NGƯỜI ĐỌC — nên nhân gửi cho nó <strong>SIGPIPE</strong> và <code>grep</code> chết. File không bao giờ được đọc hết. Theo mô hình "hứng rồi mới rót" thì việc này mất vài phút; theo mô hình thật thì nó mất vài mili giây.</div>

<pre><code>yes | head -3</code></pre>
<div class="out">y
y
y</div>
<p><code>yes</code> in ra chữ "y" mãi mãi. Nó dừng ở đây vì đúng một lý do: <code>head</code> đã thoát, và lần ghi kế tiếp lãnh một SIGPIPE. Thử giải thích kết quả này bằng mô hình tuần tự mà xem — không giải thích nổi, vì <code>yes</code> sẽ không bao giờ sinh xong.</p>

<h3>Mã thoát của một chuỗi ống</h3>
<pre><code>false | true
echo \$?</code></pre>
<div class="out">0</div>
<p>Mặc định, một chuỗi ống chỉ báo cáo mã thoát của lệnh <strong>CUỐI CÙNG</strong>. Thất bại của <code>false</code> biến mất. Trong một script có kiểm lỗi, điều này nghĩa là một khâu đầu tiên bị hỏng vẫn lọt qua trong im lặng:</p>
<pre><code><span class="tok-comment"># Trông có vẻ an toàn. Không hề. curl có thể 404 mà cái này vẫn "thành công".</span>
curl -s https://api.example.com/data | jq '.items' &gt; out.json

set -o pipefail          <span class="tok-comment"># giờ chuỗi ống thất bại nếu BẤT KỲ khâu nào thất bại</span>
curl -s https://api.example.com/data | jq '.items' &gt; out.json
echo \$?</code></pre>
<div class="out">22</div>
<p>Hoặc soi từng khâu một — bash giữ chúng trong một mảng:</p>
<pre><code>curl -s bad-url | jq '.' | wc -l
echo "\${PIPESTATUS[@]}"</code></pre>
<div class="out">6 2 0</div>
<div class="callout warn"><code>\${PIPESTATUS[@]}</code> bị ghi đè bởi lệnh <em>KẾ TIẾP</em> — kể cả một lệnh <code>echo</code>. Hãy chép nó ra trước (<code>local st=("\${PIPESTATUS[@]}")</code>) nếu bạn cần kiểm tra nhiều hơn một phần tử. Chương 7 lấy <code>set -euo pipefail</code> làm dòng mở đầu chuẩn của mọi script, và đây chính là nửa <code>pipefail</code> của nó.</div>

<h3>stderr KHÔNG đi qua ống dẫn</h3>
<pre><code>make | grep -i warning              <span class="tok-comment"># bỏ sót cảnh báo — phần lớn bản dựng ghi chúng ra stderr</span>
make 2&gt;&amp;1 | grep -i warning         <span class="tok-comment"># đúng: gộp trước, rồi mới đưa qua ống</span>
make |&amp; grep -i warning             <span class="tok-comment"># cách viết tắt của bash 4+ cho đúng việc đó</span></code></pre>
<p>Một cái ống nối fd 1 với fd 0. fd 2 không hề bị đụng tới và vẫn đi ra terminal của bạn. Hễ một chuỗi ống "chẳng tìm thấy gì" từ một lệnh mà bạn NHÌN THẤY rõ ràng đang in chữ ra, đây là thứ đầu tiên phải kiểm.</p>

<h3>Cái bẫy bộ đệm</h3>
<pre><code>tail -f /var/log/app.log | grep ERROR</code></pre>
<div class="out">(không gì cả, suốt mấy phút — rồi 400 dòng đổ ra cùng lúc)</div>
<p>Không có gì hỏng cả. Thư viện chuẩn C đổi chiến lược đệm tuỳ theo fd 1 <em>LÀ</em> cái gì: <strong>đệm theo dòng</strong> khi nó là terminal, <strong>đệm theo khối</strong> (4 KB trở lên) khi nó là một cái ống. Vì output của <code>grep</code> giờ đi vào một cái ống chứ không phải màn hình, nó chờ tới khi gom đủ 4 KB kết quả rồi mới xả ra. Trên một file log vắng vẻ, chuyện đó có thể mất hàng giờ.</p>
<pre><code>tail -f app.log | grep --line-buffered ERROR     <span class="tok-comment"># cờ của chính grep</span>
tail -f app.log | stdbuf -oL grep ERROR          <span class="tok-comment"># ép đệm theo dòng cho bất kỳ công cụ nào</span>
tail -f app.log | awk '/ERROR/ { print; fflush() }'</code></pre>
<div class="callout">Cái này khiến người ta mất hàng giờ gỡ lỗi, vì triệu chứng — "chuỗi giám sát của tôi chẳng hiện gì" — trông y hệt "không có lỗi nào cả". Hễ bạn dựng một chuỗi ống theo dõi trực tiếp, hãy thêm <code>--line-buffered</code> hoặc <code>stdbuf -oL</code> TRƯỚC KHI tin vào sự im lặng của nó.</div>

<h3>Cái bẫy shell con</h3>
<pre><code>count=0
cat access.log | while read -r line; do
  count=\$((count + 1))
done
echo "\$count"</code></pre>
<div class="out">0</div>
<p>Mỗi khâu của một chuỗi ống chạy trong <strong>shell con</strong> của riêng nó — một tiến trình con được rẽ nhánh ra. Vòng <code>while</code> đã thật sự tăng <code>count</code> lên, nhưng nó làm việc đó trong một tiến trình con, và khi con thoát thì bộ nhớ của nó đi theo. Biến <code>count</code> của tiến trình cha chưa từng bị đụng tới.</p>
<pre><code><span class="tok-comment"># Cách 1: chuyển hướng thay vì đưa qua ống — không sinh shell con</span>
while read -r line; do count=\$((count + 1)); done &lt; access.log

<span class="tok-comment"># Cách 2: thay thế tiến trình — vòng lặp ở lại trong shell hiện tại</span>
while read -r line; do count=\$((count + 1)); done &lt; &lt;(grep ERROR access.log)

<span class="tok-comment"># Cách 3: shopt -s lastpipe (chỉ bash, không tương tác) chạy khâu CUỐI trong tiến trình cha</span>
shopt -s lastpipe</code></pre>
<p>Cách 2 là cách tổng quát, và nó giới thiệu một cấu trúc đáng biết vì chính nó.</p>

<h3>Thay thế tiến trình: một lệnh trông giống một file</h3>
<pre><code>diff &lt;(sort a.txt) &lt;(sort b.txt)         <span class="tok-comment"># so hai output đã sắp xếp, không cần file tạm</span>
diff &lt;(ssh vps 'cat /etc/nginx/nginx.conf') /etc/nginx/nginx.conf
comm -13 &lt;(sort installed.txt) &lt;(sort wanted.txt)   <span class="tok-comment"># cái gì còn thiếu</span>
tee &gt;(gzip &gt; log.gz) &gt; log.txt           <span class="tok-comment"># ghi ra cả bản nén lẫn bản thường</span></code></pre>
<p><code>&lt;(lệnh)</code> chạy <code>lệnh</code> rồi đưa output của nó cho lệnh bên ngoài dưới dạng một <em>TÊN FILE</em> — đúng nghĩa đen là <code>/dev/fd/63</code>. Điều đó cho phép những công cụ khăng khăng đòi file (<code>diff</code>, <code>comm</code>, <code>join</code>) làm việc trên output trực tiếp của lệnh. <code>&gt;(lệnh)</code> là ảnh phản chiếu, dành cho công cụ muốn một file để ghi vào.</p>
<div class="callout ok">Dòng đầu tiên là một trong những lệnh hữu ích nhất của cả khoá này. "File cấu hình này có giống cái trên máy chủ không?" và "mình quên cài gói nào rồi?" đều gói lại thành một dòng, không có file tạm nào phải dọn và không có cơ hội nào để lỡ tay so với một bản chép đã cũ.</div>

<h3>xargs: biến đầu vào thành tham số</h3>
<p>Ống dẫn nối stdout với <em>STDIN</em>. Nhưng nhiều lệnh — <code>rm</code>, <code>mkdir</code>, <code>git add</code> — lại nhận tên file dưới dạng <em>THAM SỐ</em>, chứ không đọc từ stdin. <code>xargs</code> chính là bộ chuyển đổi giữa hai thứ đó:</p>
<pre><code>find . -name "*.tmp" -print0 | xargs -0 rm          <span class="tok-comment"># an toàn với NUL (Bài 2.3)</span>
cat urls.txt | xargs -n1 curl -sO                   <span class="tok-comment"># -n1: mỗi lượt gọi một tham số</span>
cat urls.txt | xargs -P 8 -n1 curl -sO              <span class="tok-comment"># -P 8: TÁM lượt cùng lúc, song song</span>
ls *.jpg | xargs -I{} convert {} {}.webp            <span class="tok-comment"># -I{}: chỗ trống đặt ở bất cứ đâu trong lệnh</span>
find . -name "*.log" | xargs -r gzip                <span class="tok-comment"># -r: đầu vào rỗng thì đừng làm gì cả</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-P N</code></span><span class="v">Chạy N lượt gọi đồng thời. Cách song song hoá rẻ nhất trong shell — <code>-P $(nproc)</code> dùng hết mọi nhân. Output của các việc khác nhau có thể xen kẽ, nên hãy chuyển hướng theo từng việc nếu thứ tự quan trọng.</span></div>
  <div class="kv"><span class="k"><code>-r</code></span><span class="v">Đừng chạy lệnh chút nào khi đầu vào rỗng. Không có nó, <code>xargs rm</code> với đầu vào rỗng sẽ chạy <code>rm</code> không tham số — vô hại — nhưng <code>xargs docker rm</code> hay <code>xargs -I{} rm -rf {}/</code> thì gây thiệt hại thật.</span></div>
  <div class="kv"><span class="k"><code>-0</code></span><span class="v">Cắt theo NUL thay vì theo khoảng trắng. Đi cặp với <code>find -print0</code>. Không có nó, một tên file chứa dấu cách biến thành hai tham số.</span></div>
  <div class="kv"><span class="k"><code>-t</code></span><span class="v">In ra từng lệnh trước khi chạy. Chính là chạy thử: ghép với <code>echo</code> để nhìn thấy mọi thứ mà không làm gì cả.</span></div>
</div>

<h3>Đọc một chuỗi ống thật</h3>
<pre><code>awk '{print \$1}' access.log | sort | uniq -c | sort -rn | head -10</code></pre>
<div class="out">  4821 203.0.113.45
  1109 198.51.100.7
   847 192.0.2.19
   612 203.0.113.88</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">awk '{print \$1}'</span><span class="lz-t">rút ra trường 1 — địa chỉ IP</span><span class="lz-d">Mỗi dòng một IP, 400.000 dòng, phần lớn lặp lại.</span></div>
  <div class="lz-step"><span class="lz-k">sort</span><span class="lz-t">gom các dòng giống nhau lại cạnh nhau</span><span class="lz-d">BẮT BUỘC, vì uniq chỉ gộp những dòng trùng NẰM KỀ NHAU. Đây là bước người ta hay quên.</span></div>
  <div class="lz-step"><span class="lz-k">uniq -c</span><span class="lz-t">gộp lại và đếm</span><span class="lz-d">Giờ mỗi dòng là "số lượng IP". 400.000 dòng còn khoảng 3.000.</span></div>
  <div class="lz-step"><span class="lz-k">sort -rn</span><span class="lz-t">sắp xếp theo SỐ, giảm dần</span><span class="lz-d">-n để 100 thắng 99; thiếu nó thì bạn được thứ tự từ điển và 99 thắng.</span></div>
  <div class="lz-step"><span class="lz-k">head -10</span><span class="lz-t">lấy mười cái đầu</span><span class="lz-d">Và nhờ SIGPIPE, nó kết thúc sớm được cả chuỗi ống.</span></div>
</div>
<p>Năm chương trình, không cái nào biết những cái kia tồn tại, cùng trả lời một câu hỏi mà chẳng ai viết công cụ riêng cho nó. Đó chính là triết lý Unix ở Bài 0.2, gói trong một dòng mà bạn sẽ thật sự dùng.</p>

<a class="link-card" href="https://man7.org/linux/man-pages/man7/pipe.7.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">pipe(7) — sức chứa, chặn và SIGPIPE</span><span class="lc-sub">Mô tả của chính nhân: bộ đệm 64 KB, chuyện gì xảy ra khi nó đầy, và điều kiện chính xác sinh ra SIGPIPE và EPIPE.</span></span>
</a>
<a class="link-card" href="https://mywiki.wooledge.org/BashPitfalls" target="_blank" rel="noopener">
  <span class="lc-ico">🔧</span>
  <span class="lc-body"><span class="lc-title">Bash Pitfalls — mục về shell con và về bộ đệm</span><span class="lc-sub">Danh sách đánh số những lỗi ai cũng mắc, mỗi lỗi kèm cách dựng lại và cách sửa. Các mục 1, 14 và 25 chính là bài này.</span></span>
</a>
<a class="link-card" href="https://www.gnu.org/software/findutils/manual/html_node/find_html/Invoking-xargs.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">GNU xargs — cách gọi và các chốt an toàn</span><span class="lc-sub">Vì sao <code>-0</code> và <code>-r</code> tồn tại, và <code>-P</code> tương tác thế nào với việc output xen kẽ nhau.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: dựng và gỡ lỗi một chuỗi ống</span><span class="lc-sub">Bài chấm điểm về pipefail, bẫy shell con, đệm theo dòng, và <code>xargs -P</code> song song trên một file log thật.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> dùng <code>uniq</code> mà không có <code>sort</code>. <code>uniq</code> chỉ gộp những dòng giống nhau NẰM KỀ NHAU — nó giữ đúng một dòng trong bộ nhớ, không giữ cả một tập hợp. Với đầu vào chưa sắp xếp, nó âm thầm đếm THIẾU, và kết quả nhìn hoàn toàn hợp lý: bạn vẫn có những con số, chỉ là chúng sai. <code>sort | uniq -c</code> mới là cặp đúng, luôn luôn. (<code>sort -u</code> là lối tắt khi bạn muốn các dòng duy nhất mà không cần số đếm.)</div>
<p class="note-ct"><strong>Hai thói quen khi dựng chuỗi ống:</strong> dựng nó từ trái sang phải, mỗi lần thêm đúng một khâu rồi NHÌN output sau mỗi lần — một chuỗi ống sai ở giữa sẽ đẻ ra rác trông rất hợp lý ở cuối. Và hãy cho chảy qua <code>head</code> trong lúc thử nghiệm: nó làm mỗi vòng thử trở nên tức thì trên một file khổng lồ, và nhờ SIGPIPE bạn không âm thầm đọc 10 GB mỗi lần nhấn Enter.</p>
</div>
`,
    },
    /* ─────────────────────────── 3.3 ─────────────────────────── */
    {
      title: '3.3 — grep, and just enough regular expression|||3.3 — grep, và vừa đủ biểu thức chính quy',
      slug: 'lnx-3-3-grep-regex',
      type: 'LESSON',
      description: 'Ba phương ngữ regex mà grep hiểu và vì sao chúng làm bạn rối, các cờ đáng thuộc lòng (-r -n -i -v -w -o -c -l -A -B -C), tìm trong kho mã, và ripgrep.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>grep, and just enough regular expression</h2>
<p class="lead"><code>grep</code> prints the lines that match a pattern. That one sentence hides two separate skills: knowing the flags, which takes an afternoon, and knowing which <em>flavour</em> of regular expression you are currently speaking, which is the reason your pattern "randomly" stops working when you move it between tools.</p>

<h3>Three dialects, one command</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">BRE — basic (default)</span><span class="lz-lnote"><code>grep</code> with no flag. <code>+</code>, <code>?</code>, <code>|</code>, <code>{}</code> and <code>()</code> are LITERAL characters; you must backslash them to get their special meaning. Historical, and the source of most confusion.</span></div>
  <div class="lz-layer"><span class="lz-lname">ERE — extended</span><span class="lz-lnote"><code>grep -E</code> (or <code>egrep</code>). <code>+ ? | ( ) { }</code> are special without escaping. This is what you already know from most languages. <strong>Use this by default.</strong></span></div>
  <div class="lz-layer"><span class="lz-lname">PCRE — Perl-compatible</span><span class="lz-lnote"><code>grep -P</code>. Adds <code>\\d</code>, <code>\\w</code>, <code>\\s</code>, non-greedy <code>*?</code>, lookahead <code>(?=…)</code>. Not on every system (macOS's grep lacks it), but on Linux it is there.</span></div>
</div>

<pre><code>grep    "colou\\?r" notes.txt      <span class="tok-comment"># BRE: ? must be escaped to mean "optional"</span>
grep -E "colou?r"   notes.txt      <span class="tok-comment"># ERE: reads like every other language</span>
grep -P "\\d{3}-\\d{4}"  notes.txt   <span class="tok-comment"># PCRE: \\d works, {3} works</span>
grep -F "1.2.3"     notes.txt      <span class="tok-comment"># FIXED string: no regex at all, dots are dots</span></code></pre>
<div class="callout ok"><strong>The practical rule:</strong> use <code>-E</code> for anything with a quantifier or alternation, <code>-P</code> when you want <code>\\d</code>/<code>\\w</code>/lookahead, and <code>-F</code> when your pattern is literal text that happens to contain <code>.</code>, <code>*</code> or <code>[</code> — searching for an IP address or a version number with plain <code>grep</code> means the dots match any character, so <code>1.2.3</code> also matches <code>1x2y3</code>. <code>-F</code> is also significantly faster.</div>

<h3>The regex pieces you actually need</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>.</code></span><span class="v">Any single character. <code>\\.</code> for a literal dot.</span></div>
  <div class="kv"><span class="k"><code>*</code> <code>+</code> <code>?</code></span><span class="v">Zero-or-more · one-or-more · zero-or-one, applied to the thing before it.</span></div>
  <div class="kv"><span class="k"><code>{2,5}</code></span><span class="v">Between 2 and 5 repetitions. <code>{3}</code> exactly three, <code>{2,}</code> two or more.</span></div>
  <div class="kv"><span class="k"><code>^</code> <code>\$</code></span><span class="v">Start of line · end of line. <code>^\$</code> together match an empty line.</span></div>
  <div class="kv"><span class="k"><code>[abc]</code> <code>[^abc]</code></span><span class="v">One character in the set · one character NOT in it. Note <code>^</code> here means negation, not line-start.</span></div>
  <div class="kv"><span class="k"><code>(a|b)</code></span><span class="v">Either alternative. Needs <code>-E</code>, or <code>\\(a\\|b\\)</code> in BRE.</span></div>
  <div class="kv"><span class="k"><code>\\b</code></span><span class="v">Word boundary. <code>\\bcat\\b</code> matches "cat" but not "concatenate".</span></div>
</div>
<div class="callout warn">Inside <code>[...]</code> the rules change: <code>.</code>, <code>*</code>, <code>(</code> are all literal there, so <code>[.*]</code> matches a dot or an asterisk. And <code>-</code> must be first or last (<code>[a-z-]</code>) or it means a range. Most "my character class does not work" bugs are one of these two.</div>

<h3>The flags worth memorising</h3>
<pre><code>grep -i error app.log            <span class="tok-comment"># case-insensitive</span>
grep -v DEBUG app.log            <span class="tok-comment"># inVert: lines that do NOT match</span>
grep -n TODO src/index.ts        <span class="tok-comment"># show line numbers</span>
grep -c ERROR app.log            <span class="tok-comment"># count matching LINES (not matches)</span>
grep -l TODO src/*.ts            <span class="tok-comment"># just list the filenames</span>
grep -w cat notes.txt            <span class="tok-comment"># whole word — not "concatenate"</span>
grep -o '[0-9]\\+' app.log         <span class="tok-comment"># print only the matched part, one per line</span>
grep -r "apiKey" src/            <span class="tok-comment"># recurse into directories</span></code></pre>
<div class="out">src/config.ts:14:  const apiKey = process.env.API_KEY;
src/lib/client.ts:8:  apiKey: apiKey,</div>

<h3>Context: the three flags that make grep readable</h3>
<pre><code>grep -A3 "Exception" app.log     <span class="tok-comment"># the match + 3 lines AFTER</span>
grep -B2 "Exception" app.log     <span class="tok-comment"># the match + 2 lines BEFORE</span>
grep -C3 "Exception" app.log     <span class="tok-comment"># 3 lines of Context on both sides</span></code></pre>
<div class="out">2026-08-22 10:14:02 INFO  handling POST /api/v1/orders
2026-08-22 10:14:02 ERROR Exception: connection refused
2026-08-22 10:14:02 ERROR   at Pool.connect (db.ts:41)
2026-08-22 10:14:02 ERROR   at createOrder (orders.ts:88)
--</div>
<p>A stack trace is useless without the lines around it, and this is the difference between "there was an error" and knowing which request caused it. <code>-C3</code> should be your default when reading logs.</p>

<h3>Searching a codebase</h3>
<pre><code>grep -rn "TODO" .                                     <span class="tok-comment"># everything, including node_modules — slow</span>
grep -rn --include="*.ts" "TODO" src/                 <span class="tok-comment"># only .ts files</span>
grep -rn --exclude-dir={node_modules,.git,dist} "TODO" .
grep -rln "console.log" src/ | xargs -r wc -l         <span class="tok-comment"># which files, and how big</span></code></pre>
<div class="callout"><code>--exclude-dir</code> takes brace expansion (Lesson 2.2), so the third line is one shell word per directory. Without it, a <code>grep -rn</code> at the root of a Node project spends most of its time reading dependencies you did not write — often 95% of the wall-clock time.</div>

<h3>Multiple patterns</h3>
<pre><code>grep -E "ERROR|FATAL|panic" app.log      <span class="tok-comment"># alternation</span>
grep -e ERROR -e FATAL app.log           <span class="tok-comment"># repeated -e, no regex needed</span>
grep -f patterns.txt app.log             <span class="tok-comment"># one pattern per line, from a file</span>
grep -Fxf known-ids.txt all-ids.txt      <span class="tok-comment"># fixed, whole-line, from file — a fast set intersection</span></code></pre>
<p>That last line is a genuinely useful trick: <code>-F</code> (literal) <code>-x</code> (match the whole line) <code>-f</code> (patterns from a file) turns <code>grep</code> into a set-intersection tool that handles millions of lines far faster than a scripting language would.</p>

<h3>Exit status: grep as a test</h3>
<pre><code>if grep -q "ERROR" app.log; then
  echo "errors found"
fi</code></pre>
<p><code>-q</code> (quiet) prints nothing and exits as soon as the first match is found — so it is both silent and fast. The exit status is <strong>0 if anything matched, 1 if nothing did, 2 on an actual error</strong> such as an unreadable file. That three-way distinction matters: <code>grep -q x missing.txt</code> returns 2, not 1, so a script that treats "non-zero means no match" will misreport a missing file as an empty result.</p>

<h3>When grep is the wrong tool</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Multi-line patterns</span><span class="v"><code>grep</code> works one line at a time and cannot match across a newline. Use <code>grep -Pzo</code> for a hack, or reach for <code>awk</code> (Lesson 3.6) or a real parser.</span></div>
  <div class="kv"><span class="k">Structured data</span><span class="v">Do not grep JSON, XML or YAML. <code>jq '.items[].name'</code> understands the structure; a regex will break on the first reformat, and it will break silently.</span></div>
  <div class="kv"><span class="k">Editing, not just finding</span><span class="v"><code>grep</code> only reads. To change what it finds, that is <code>sed</code> — the next lesson.</span></div>
</div>

<h3>ripgrep: grep for codebases</h3>
<pre><code>rg TODO                    <span class="tok-comment"># recursive by default, respects .gitignore, skips binaries</span>
rg -t ts "apiKey"          <span class="tok-comment"># -t: by file TYPE, not glob</span>
rg -C3 "Exception"         <span class="tok-comment"># same context flags</span>
rg --files | rg test       <span class="tok-comment"># list files, then filter</span></code></pre>
<div class="out">src/config.ts
14:  const apiKey = process.env.API_KEY;

src/lib/client.ts
8:  apiKey: apiKey,</div>
<p>Measured on a 1.2 GB checkout: <code>grep -rn</code> took 18.4 s, <code>rg</code> took 0.9 s — it is parallel, it skips <code>.gitignore</code>d paths automatically, and it detects binary files instead of spraying them at your terminal. Install it (<code>apt install ripgrep</code>) and use it daily. Learn <code>grep</code> anyway: it is the one that exists on the server.</p>

<a class="link-card" href="https://www.gnu.org/software/grep/manual/grep.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">GNU grep Manual</span><span class="lc-sub">The "Regular Expressions" chapter lays out BRE vs ERE side by side — the single clearest explanation of why your pattern behaves differently in two tools.</span></span>
</a>
<a class="link-card" href="https://regex101.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">regex101 — build and explain patterns</span><span class="lc-sub">Pick the PCRE flavour to match <code>grep -P</code>. The right-hand panel explains every token, which is how you learn regex rather than copying it.</span></span>
</a>
<a class="link-card" href="https://github.com/BurntSushi/ripgrep/blob/master/GUIDE.md" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">ripgrep — the user guide</span><span class="lc-sub">Written by its author, and unusually good at explaining the gitignore rules and file-type filters that make it fast.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: find it in the log</span><span class="lc-sub">Graded tasks on BRE vs ERE, <code>-o</code>, context flags and <code>-Fxf</code>, on a 200k-line access log.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> an unquoted pattern. <code>grep *.log app.log</code> lets the shell expand <code>*.log</code> first (Lesson 2.2), so grep searches for the name of a file that happens to be in your directory. Worse, <code>grep $var file</code> with an empty <code>var</code> becomes <code>grep file</code> — grep then treats <code>file</code> as the pattern and waits on stdin, and your script appears to hang. <strong>Always quote the pattern:</strong> <code>grep "\$var" file</code>.</div>
<p class="note-ct"><strong>Build patterns incrementally.</strong> Start with a literal fragment you know appears, confirm you get hits, then add one piece of regex at a time — with <code>--color=always</code> on so you can see exactly which characters matched. A regex written all at once and returning nothing gives you no information about which half is wrong; a regex grown one step at a time tells you the moment you break it.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>grep, và vừa đủ biểu thức chính quy</h2>
<p class="lead"><code>grep</code> in ra những dòng khớp với một mẫu. Đúng một câu đó che giấu hai kỹ năng riêng biệt: thuộc các cờ, việc mất một buổi chiều, và biết mình đang nói <em>PHƯƠNG NGỮ</em> regex nào, và đó mới là lý do cái mẫu của bạn "tự dưng" thôi chạy khi chuyển nó từ công cụ này sang công cụ khác.</p>

<h3>Ba phương ngữ, một lệnh</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">BRE — cơ bản (mặc định)</span><span class="lz-lnote"><code>grep</code> không kèm cờ nào. <code>+</code>, <code>?</code>, <code>|</code>, <code>{}</code> và <code>()</code> là ký tự NGUYÊN VĂN; muốn chúng mang nghĩa đặc biệt thì phải thêm gạch chéo ngược. Có tính lịch sử, và là nguồn gốc của phần lớn sự rối rắm.</span></div>
  <div class="lz-layer"><span class="lz-lname">ERE — mở rộng</span><span class="lz-lnote"><code>grep -E</code> (hoặc <code>egrep</code>). <code>+ ? | ( ) { }</code> mang nghĩa đặc biệt mà không cần thoát. Đây chính là thứ bạn đã quen từ hầu hết ngôn ngữ lập trình. <strong>Hãy lấy cái này làm mặc định.</strong></span></div>
  <div class="lz-layer"><span class="lz-lname">PCRE — tương thích Perl</span><span class="lz-lnote"><code>grep -P</code>. Thêm <code>\\d</code>, <code>\\w</code>, <code>\\s</code>, dạng không tham <code>*?</code>, nhìn trước <code>(?=…)</code>. Không có trên mọi hệ (grep của macOS thiếu nó), nhưng trên Linux thì có.</span></div>
</div>

<pre><code>grep    "colou\\?r" notes.txt      <span class="tok-comment"># BRE: ? phải thoát mới mang nghĩa "có cũng được"</span>
grep -E "colou?r"   notes.txt      <span class="tok-comment"># ERE: đọc y như mọi ngôn ngữ khác</span>
grep -P "\\d{3}-\\d{4}"  notes.txt   <span class="tok-comment"># PCRE: \\d chạy, {3} chạy</span>
grep -F "1.2.3"     notes.txt      <span class="tok-comment"># chuỗi CỐ ĐỊNH: không regex gì cả, dấu chấm là dấu chấm</span></code></pre>
<div class="callout ok"><strong>Quy tắc thực dụng:</strong> dùng <code>-E</code> cho mọi thứ có lượng từ hoặc phép hoặc, dùng <code>-P</code> khi bạn muốn <code>\\d</code>/<code>\\w</code>/nhìn trước, và dùng <code>-F</code> khi mẫu của bạn là văn bản nguyên văn mà tình cờ có chứa <code>.</code>, <code>*</code> hay <code>[</code> — tìm một địa chỉ IP hay một số phiên bản bằng <code>grep</code> trần nghĩa là các dấu chấm khớp với ký tự bất kỳ, nên <code>1.2.3</code> cũng khớp cả <code>1x2y3</code>. <code>-F</code> còn nhanh hơn đáng kể.</div>

<h3>Những mảnh regex bạn thật sự cần</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>.</code></span><span class="v">Một ký tự bất kỳ. Muốn dấu chấm nguyên văn thì <code>\\.</code>.</span></div>
  <div class="kv"><span class="k"><code>*</code> <code>+</code> <code>?</code></span><span class="v">Không-hoặc-nhiều · một-hoặc-nhiều · không-hoặc-một, áp lên thứ đứng ngay trước nó.</span></div>
  <div class="kv"><span class="k"><code>{2,5}</code></span><span class="v">Lặp từ 2 tới 5 lần. <code>{3}</code> đúng ba lần, <code>{2,}</code> từ hai lần trở lên.</span></div>
  <div class="kv"><span class="k"><code>^</code> <code>\$</code></span><span class="v">Đầu dòng · cuối dòng. <code>^\$</code> đi cùng nhau thì khớp một dòng trống.</span></div>
  <div class="kv"><span class="k"><code>[abc]</code> <code>[^abc]</code></span><span class="v">Một ký tự trong tập · một ký tự KHÔNG trong tập. Lưu ý <code>^</code> ở đây nghĩa là phủ định, không phải đầu dòng.</span></div>
  <div class="kv"><span class="k"><code>(a|b)</code></span><span class="v">Chọn một trong hai. Cần <code>-E</code>, hoặc viết <code>\\(a\\|b\\)</code> trong BRE.</span></div>
  <div class="kv"><span class="k"><code>\\b</code></span><span class="v">Ranh giới từ. <code>\\bcat\\b</code> khớp "cat" nhưng không khớp "concatenate".</span></div>
</div>
<div class="callout warn">Bên trong <code>[...]</code> luật đổi khác: <code>.</code>, <code>*</code>, <code>(</code> đều là nguyên văn ở đó, nên <code>[.*]</code> khớp một dấu chấm hoặc một dấu sao. Và <code>-</code> phải đứng đầu hoặc cuối (<code>[a-z-]</code>), nếu không nó nghĩa là một khoảng. Phần lớn lỗi kiểu "lớp ký tự của tôi không chạy" là một trong hai chuyện này.</div>

<h3>Những cờ đáng thuộc lòng</h3>
<pre><code>grep -i error app.log            <span class="tok-comment"># không phân biệt hoa thường</span>
grep -v DEBUG app.log            <span class="tok-comment"># đảo lại: những dòng KHÔNG khớp</span>
grep -n TODO src/index.ts        <span class="tok-comment"># hiện số dòng</span>
grep -c ERROR app.log            <span class="tok-comment"># đếm số DÒNG khớp (không phải số lần khớp)</span>
grep -l TODO src/*.ts            <span class="tok-comment"># chỉ liệt kê tên file</span>
grep -w cat notes.txt            <span class="tok-comment"># nguyên từ — không dính "concatenate"</span>
grep -o '[0-9]\\+' app.log         <span class="tok-comment"># chỉ in phần khớp, mỗi lần khớp một dòng</span>
grep -r "apiKey" src/            <span class="tok-comment"># đệ quy vào các thư mục</span></code></pre>
<div class="out">src/config.ts:14:  const apiKey = process.env.API_KEY;
src/lib/client.ts:8:  apiKey: apiKey,</div>

<h3>Ngữ cảnh: ba cờ làm grep trở nên đọc được</h3>
<pre><code>grep -A3 "Exception" app.log     <span class="tok-comment"># dòng khớp + 3 dòng SAU</span>
grep -B2 "Exception" app.log     <span class="tok-comment"># dòng khớp + 2 dòng TRƯỚC</span>
grep -C3 "Exception" app.log     <span class="tok-comment"># 3 dòng ngữ cảnh ở cả hai phía</span></code></pre>
<div class="out">2026-08-22 10:14:02 INFO  handling POST /api/v1/orders
2026-08-22 10:14:02 ERROR Exception: connection refused
2026-08-22 10:14:02 ERROR   at Pool.connect (db.ts:41)
2026-08-22 10:14:02 ERROR   at createOrder (orders.ts:88)
--</div>
<p>Một vệt gọi hàm lỗi thì vô dụng nếu thiếu các dòng xung quanh, và đây chính là khác biệt giữa "có lỗi xảy ra" với việc biết được yêu cầu nào gây ra lỗi đó. <code>-C3</code> nên là mặc định của bạn khi đọc log.</p>

<h3>Tìm trong một kho mã</h3>
<pre><code>grep -rn "TODO" .                                     <span class="tok-comment"># mọi thứ, kể cả node_modules — chậm</span>
grep -rn --include="*.ts" "TODO" src/                 <span class="tok-comment"># chỉ file .ts</span>
grep -rn --exclude-dir={node_modules,.git,dist} "TODO" .
grep -rln "console.log" src/ | xargs -r wc -l         <span class="tok-comment"># những file nào, và lớn cỡ nào</span></code></pre>
<div class="callout"><code>--exclude-dir</code> nhận khai triển ngoặc nhọn (Bài 2.2), nên dòng thứ ba biến thành mỗi thư mục một từ shell. Không có nó, một lệnh <code>grep -rn</code> ở gốc một dự án Node dành phần lớn thời gian đi đọc những thư viện không phải bạn viết — thường là 95% tổng thời gian chạy.</div>

<h3>Nhiều mẫu cùng lúc</h3>
<pre><code>grep -E "ERROR|FATAL|panic" app.log      <span class="tok-comment"># phép hoặc</span>
grep -e ERROR -e FATAL app.log           <span class="tok-comment"># lặp lại -e, không cần regex</span>
grep -f patterns.txt app.log             <span class="tok-comment"># mỗi dòng một mẫu, đọc từ file</span>
grep -Fxf known-ids.txt all-ids.txt      <span class="tok-comment"># cố định, khớp nguyên dòng, từ file — một phép giao tập hợp nhanh</span></code></pre>
<p>Dòng cuối là một mẹo thật sự hữu ích: <code>-F</code> (nguyên văn) <code>-x</code> (khớp nguyên dòng) <code>-f</code> (mẫu lấy từ file) biến <code>grep</code> thành một công cụ giao tập hợp, xử lý hàng triệu dòng nhanh hơn nhiều so với một ngôn ngữ script.</p>

<h3>Mã thoát: dùng grep như một phép kiểm</h3>
<pre><code>if grep -q "ERROR" app.log; then
  echo "có lỗi"
fi</code></pre>
<p><code>-q</code> (quiet) không in gì và thoát ngay khi tìm thấy lần khớp đầu tiên — nên nó vừa im lặng vừa nhanh. Mã thoát là <strong>0 nếu có khớp, 1 nếu không khớp gì, 2 khi có lỗi thật sự</strong> chẳng hạn file không đọc được. Sự phân biệt ba mức đó quan trọng: <code>grep -q x missing.txt</code> trả về 2 chứ không phải 1, nên một script coi "khác 0 nghĩa là không khớp" sẽ báo nhầm một file thiếu thành một kết quả rỗng.</p>

<h3>Khi grep là công cụ sai</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Mẫu trải nhiều dòng</span><span class="v"><code>grep</code> làm việc mỗi lần một dòng và không khớp vắt qua ký tự xuống dòng được. Dùng <code>grep -Pzo</code> như một mẹo vá, hoặc chuyển sang <code>awk</code> (Bài 3.6) hay một bộ phân tích thật sự.</span></div>
  <div class="kv"><span class="k">Dữ liệu có cấu trúc</span><span class="v">Đừng grep JSON, XML hay YAML. <code>jq '.items[].name'</code> hiểu cấu trúc; một regex sẽ vỡ ngay lần định dạng lại đầu tiên, và nó vỡ trong im lặng.</span></div>
  <div class="kv"><span class="k">Sửa, chứ không chỉ tìm</span><span class="v"><code>grep</code> chỉ đọc. Muốn ĐỔI thứ nó tìm được thì đó là việc của <code>sed</code> — bài kế tiếp.</span></div>
</div>

<h3>ripgrep: grep dành cho kho mã</h3>
<pre><code>rg TODO                    <span class="tok-comment"># mặc định đã đệ quy, tôn trọng .gitignore, bỏ qua file nhị phân</span>
rg -t ts "apiKey"          <span class="tok-comment"># -t: theo LOẠI file, không phải glob</span>
rg -C3 "Exception"         <span class="tok-comment"># vẫn những cờ ngữ cảnh đó</span>
rg --files | rg test       <span class="tok-comment"># liệt kê file, rồi lọc</span></code></pre>
<div class="out">src/config.ts
14:  const apiKey = process.env.API_KEY;

src/lib/client.ts
8:  apiKey: apiKey,</div>
<p>Đo trên một bản làm việc 1,2 GB: <code>grep -rn</code> mất 18,4 giây, <code>rg</code> mất 0,9 giây — nó chạy song song, tự bỏ qua các đường dẫn nằm trong <code>.gitignore</code>, và nhận ra file nhị phân thay vì phun chúng ra terminal của bạn. Hãy cài nó (<code>apt install ripgrep</code>) và dùng hằng ngày. Dù vậy vẫn hãy học <code>grep</code>: nó mới là thứ có sẵn trên máy chủ.</p>

<a class="link-card" href="https://www.gnu.org/software/grep/manual/grep.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">GNU grep Manual</span><span class="lc-sub">Chương "Regular Expressions" bày BRE và ERE cạnh nhau — lời giải thích rõ ràng nhất về việc vì sao mẫu của bạn hành xử khác nhau ở hai công cụ.</span></span>
</a>
<a class="link-card" href="https://regex101.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">regex101 — dựng và giải thích mẫu</span><span class="lc-sub">Chọn phương ngữ PCRE để khớp với <code>grep -P</code>. Bảng bên phải giải thích từng ký hiệu, và đó là cách bạn HỌC regex thay vì chép nó.</span></span>
</a>
<a class="link-card" href="https://github.com/BurntSushi/ripgrep/blob/master/GUIDE.md" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">ripgrep — sách hướng dẫn người dùng</span><span class="lc-sub">Do chính tác giả viết, và giải thích cực tốt về luật gitignore cùng bộ lọc theo loại file — hai thứ làm nên tốc độ của nó.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: tìm cho ra nó trong log</span><span class="lc-sub">Bài chấm điểm về BRE với ERE, <code>-o</code>, các cờ ngữ cảnh và <code>-Fxf</code>, trên một file access log 200 nghìn dòng.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> một cái mẫu không đặt trong nháy. <code>grep *.log app.log</code> để shell khai triển <code>*.log</code> trước (Bài 2.2), nên grep đi tìm cái TÊN của một file tình cờ nằm trong thư mục của bạn. Tệ hơn, <code>grep $var file</code> với <code>var</code> rỗng biến thành <code>grep file</code> — grep coi <code>file</code> là cái mẫu rồi ngồi chờ stdin, và script của bạn trông như bị treo. <strong>Luôn đặt mẫu trong nháy:</strong> <code>grep "\$var" file</code>.</div>
<p class="note-ct"><strong>Hãy dựng mẫu từng nấc một.</strong> Bắt đầu bằng một mẩu nguyên văn mà bạn BIẾT chắc là có, xác nhận có kết quả, rồi mỗi lần thêm đúng một mảnh regex — kèm <code>--color=always</code> để nhìn thấy chính xác những ký tự nào đã khớp. Một regex viết một lèo mà không ra gì thì chẳng cho bạn thông tin nào về việc nửa nào sai; một regex mọc lên từng nấc thì báo cho bạn biết ngay khoảnh khắc bạn làm nó hỏng.</p>
</div>
`,
    },
    /* ─────────────────────────── 3.4 ─────────────────────────── */
    {
      title: '3.4 — The small tools: cut, sort, uniq, tr, wc and friends|||3.4 — Bộ công cụ nhỏ: cut, sort, uniq, tr, wc và họ hàng',
      slug: 'lnx-3-4-bo-cong-cu-nho',
      type: 'LESSON',
      description: 'Mười lệnh nhỏ mà bạn ghép lại được thành gần như mọi phép biến đổi văn bản: cut và awk cho cột, sort với -n -k -t -u, uniq -c -d -u, tr, wc, head/tail, paste/join/comm, column và nl.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.4</span>
<h2>The small tools</h2>
<p class="lead">These ten programs do almost nothing individually. Together they cover most of what you would otherwise open a spreadsheet or write a script for. Learn them as a <em>vocabulary</em>: each one is a verb, and pipelines are sentences.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Select columns</span><span class="lz-lnote"><code>cut</code> · <code>awk</code> — pull fields out of each line</span></div>
  <div class="lz-layer"><span class="lz-lname">Reorder</span><span class="lz-lnote"><code>sort</code> · <code>tac</code> · <code>shuf</code> — change line order</span></div>
  <div class="lz-layer"><span class="lz-lname">Reduce</span><span class="lz-lnote"><code>uniq</code> · <code>wc</code> · <code>head</code> · <code>tail</code> — collapse or trim</span></div>
  <div class="lz-layer"><span class="lz-lname">Transform characters</span><span class="lz-lnote"><code>tr</code> · <code>rev</code> — operate below the line level</span></div>
  <div class="lz-layer"><span class="lz-lname">Combine files</span><span class="lz-lnote"><code>paste</code> · <code>join</code> · <code>comm</code> — put two streams side by side</span></div>
  <div class="lz-layer"><span class="lz-lname">Present</span><span class="lz-lnote"><code>column</code> · <code>nl</code> · <code>fold</code> — make it readable</span></div>
</div>

<h3>cut — fields by delimiter or position</h3>
<pre><code>cut -d: -f1 /etc/passwd            <span class="tok-comment"># -d sets the delimiter, -f picks fields</span>
cut -d: -f1,7 /etc/passwd          <span class="tok-comment"># several fields</span>
cut -d, -f2-4 data.csv             <span class="tok-comment"># a range</span>
cut -c1-8 log.txt                  <span class="tok-comment"># by CHARACTER position instead</span></code></pre>
<div class="out">root
daemon
deploy</div>
<div class="callout warn"><code>cut</code> has a real limitation: <strong>it treats every single delimiter as a separator</strong>, so two spaces means an empty field between them. On space-aligned output such as <code>ls -l</code> or <code>ps</code>, <code>cut -d' ' -f3</code> returns blanks unpredictably. Use <code>awk '{print \$3}'</code> there — awk collapses runs of whitespace by default. Reach for <code>cut</code> when the delimiter is a real single character (<code>:</code>, <code>,</code>, tab) and for <code>awk</code> otherwise.</div>

<h3>sort — and the flags that make it correct</h3>
<pre><code>sort names.txt                     <span class="tok-comment"># lexicographic, by locale</span>
sort -n sizes.txt                  <span class="tok-comment"># NUMERIC — 10 after 9, not before it</span>
sort -h sizes.txt                  <span class="tok-comment"># human sizes: 2K &lt; 1M &lt; 3G</span>
sort -r names.txt                  <span class="tok-comment"># reverse</span>
sort -u names.txt                  <span class="tok-comment"># unique — sort + dedupe in one pass</span>
sort -V versions.txt               <span class="tok-comment"># version sort: 1.10 after 1.9</span>
sort -t: -k3 -n /etc/passwd        <span class="tok-comment"># by field 3, numerically, ':' delimited</span>
sort -k2,2 -k1,1nr data.txt        <span class="tok-comment"># field 2 asc, then field 1 numeric desc</span></code></pre>
<div class="out">$ printf '9\\n10\\n100\\n' | sort
10
100
9
$ printf '9\\n10\\n100\\n' | sort -n
9
10
100</div>
<div class="callout">That first output is the single most common <code>sort</code> bug. Without <code>-n</code>, sort compares text: "10" begins with "1", which sorts before "9". Any time you sort sizes, counts, ports, or IDs, you need <code>-n</code>. And <code>-k2,2</code> means "field 2 only" — a bare <code>-k2</code> means "from field 2 to the end of the line", which quietly gives different results.</div>

<h3>uniq — but only on adjacent lines</h3>
<pre><code>sort access.log | uniq             <span class="tok-comment"># dedupe (sort FIRST — always)</span>
sort access.log | uniq -c          <span class="tok-comment"># prefix each line with its count</span>
sort access.log | uniq -d          <span class="tok-comment"># only lines that appear MORE THAN ONCE</span>
sort access.log | uniq -u          <span class="tok-comment"># only lines that appear EXACTLY once</span>
sort emails.txt | uniq -i          <span class="tok-comment"># case-insensitive comparison</span>
sort data.csv | uniq -f1           <span class="tok-comment"># ignore the first field when comparing</span></code></pre>
<p><code>uniq -d</code> is how you find duplicate entries in a config, duplicate IDs in an export, or repeated keys in a translation file — a two-word answer to a question people often write a script for.</p>

<h3>tr — translate or delete characters</h3>
<pre><code>tr 'a-z' 'A-Z' &lt; notes.txt         <span class="tok-comment"># uppercase</span>
tr -d '\\r' &lt; windows.txt &gt; unix.txt <span class="tok-comment"># strip CR — fixes "bad interpreter" errors</span>
tr -s ' ' &lt; padded.txt             <span class="tok-comment"># -s squeeze: collapse runs into one</span>
tr ',' '\\n' &lt; list.csv              <span class="tok-comment"># one item per line</span>
tr -cd '[:print:]\\n' &lt; messy.log    <span class="tok-comment"># -c complement, -d delete: keep only printable</span></code></pre>
<p><code>tr</code> works on <em>characters</em>, not words or patterns — it has no concept of a match. That makes it the fastest tool in this list, and the right one for "delete every carriage return" or "turn commas into newlines". It reads only stdin, never a filename, so <code>&lt;</code> or a pipe is mandatory.</p>
<div class="callout ok"><code>tr -d '\\r'</code> deserves a note of its own. A shell script edited on Windows carries <code>\\r\\n</code> line endings, so the shebang line reads <code>#!/bin/bash\\r</code> and the kernel looks for an interpreter whose name ends in a carriage return. The error — <code>bad interpreter: No such file or directory</code> — names a file that visibly exists, which is why it puzzles people for so long. <code>dos2unix</code> does the same job with a better name.</div>

<h3>wc, head, tail</h3>
<pre><code>wc -l access.log         <span class="tok-comment"># lines</span>
wc -w essay.txt          <span class="tok-comment"># words</span>
wc -c file.bin           <span class="tok-comment"># bytes  ·  -m for characters (differs in UTF-8)</span>
head -20 app.log         <span class="tok-comment"># first 20 lines</span>
tail -20 app.log         <span class="tok-comment"># last 20</span>
tail -n +100 app.log     <span class="tok-comment"># from line 100 to the END — note the plus</span>
tail -f app.log          <span class="tok-comment"># follow as it grows</span>
tail -F app.log          <span class="tok-comment"># follow BY NAME — survives log rotation</span></code></pre>
<p><code>tail -n +2 data.csv</code> is the standard way to skip a CSV header, and <code>-F</code> instead of <code>-f</code> is what you want on any file that <code>logrotate</code> touches: <code>-f</code> follows the inode, so after a rotation it sits watching the renamed old file forever, printing nothing while the new log fills up.</p>

<h3>paste, join, comm — two streams at once</h3>
<pre><code>paste names.txt scores.txt              <span class="tok-comment"># side by side, tab-separated</span>
paste -d, names.txt scores.txt          <span class="tok-comment"># comma instead</span>
paste -sd, names.txt                    <span class="tok-comment"># -s: all lines onto ONE line</span>
join -t, -1 1 -2 1 users.csv orders.csv <span class="tok-comment"># a real relational join on field 1</span>
comm -13 &lt;(sort a.txt) &lt;(sort b.txt)    <span class="tok-comment"># lines only in b</span></code></pre>
<div class="out">$ paste -sd, fruits.txt
apple,banana,cherry</div>
<p><code>comm</code> prints three columns — only-in-A, only-in-B, in-both — and the digits suppress columns. <code>-13</code> means "hide columns 1 and 3", leaving only-in-B. Both inputs <strong>must be sorted</strong>, which is why process substitution pairs with it so naturally.</p>

<h3>column and nl — making output readable</h3>
<pre><code>column -t -s: /etc/passwd        <span class="tok-comment"># align into a table</span>
column -t -s, data.csv | less -S <span class="tok-comment"># -S: do not wrap long lines</span>
nl -ba script.sh                 <span class="tok-comment"># number every line, including blanks</span>
fold -w 80 long.txt              <span class="tok-comment"># hard-wrap at 80 columns</span></code></pre>
<div class="out">root   x  0     0     root   /root       /bin/bash
deploy x  1001  1001         /home/deploy /bin/bash</div>
<p><code>column -t</code> turns any delimited output into a readable table, and it is the single quickest way to make a CSV legible in a terminal without leaving it.</p>

<h3>Putting it together</h3>
<pre><code><span class="tok-comment"># Top 10 URLs by request count, from an nginx access log</span>
awk '{print \$7}' access.log | sort | uniq -c | sort -rn | head -10

<span class="tok-comment"># Every user with a real login shell</span>
grep -v '/nologin\\|/false' /etc/passwd | cut -d: -f1,7 | column -t -s:

<span class="tok-comment"># Which file extensions exist in this project, and how many of each</span>
find src -type f | grep -o '\\.[^./]*\$' | sort | uniq -c | sort -rn

<span class="tok-comment"># Duplicate IDs in an export</span>
cut -d, -f1 export.csv | sort | uniq -d

<span class="tok-comment"># A 32-character random password</span>
tr -dc 'A-Za-z0-9' &lt; /dev/urandom | head -c 32; echo</code></pre>
<div class="out">   4821 /api/v1/posts
   1109 /api/v1/auth/me
    847 /api/v1/messages/threads

root   /bin/bash
deploy /bin/bash

    142 .ts
     38 .tsx
      9 .json</div>

<a class="link-card" href="https://www.gnu.org/software/coreutils/manual/coreutils.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">GNU Coreutils Manual</span><span class="lc-sub">Every tool in this lesson, documented by the people who wrote them. The <code>sort</code> chapter on <code>-k</code> field specifiers is worth reading once properly.</span></span>
</a>
<a class="link-card" href="https://tldr.inbrowser.app/" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">tldr pages — examples instead of manuals</span><span class="lc-sub">Five practical examples per command, which is usually what you actually wanted from <code>man</code>. Install locally with <code>npm i -g tldr</code>.</span></span>
</a>
<a class="link-card" href="https://explainshell.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">explainshell — paste a pipeline, get it annotated</span><span class="lc-sub">Paste any command from this lesson and it breaks down every flag against the real man pages. The fastest way to read someone else's one-liner.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: answer questions with one line</span><span class="lc-sub">Graded exercises that give you a log file and a question, and expect a single pipeline. <code>sort -k</code> and <code>uniq -d</code> feature heavily.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> <code>sort</code>'s locale. Under <code>en_US.UTF-8</code>, <code>sort</code> ignores case and punctuation in ways that surprise you: <code>sort</code> then <code>uniq</code> can produce different groupings than you expect, and <code>comm</code> — which requires both inputs sorted <em>the same way</em> — will silently report wrong differences if one file was sorted under a different locale. When exact byte order matters, set <code>LC_ALL=C</code> on every sort in the pipeline. It is also measurably faster.</div>
<p class="note-ct"><strong>The habit that makes these tools click:</strong> pipe into <code>head</code> and look after every single stage while you build. These commands are small enough that you can hold their behaviour in your head, but only if you see it — <code>cut -d' ' -f3</code> returning blanks, or <code>sort</code> putting 100 before 9, is obvious the moment you look and invisible when you do not.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>Bộ công cụ nhỏ</h2>
<p class="lead">Mười chương trình này, tách riêng ra thì gần như chẳng làm gì. Ghép lại, chúng bao phủ phần lớn những việc mà nếu không có chúng bạn sẽ phải mở bảng tính hoặc viết hẳn một script. Hãy học chúng như học <em>TỪ VỰNG</em>: mỗi cái là một động từ, còn chuỗi ống là câu.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Chọn cột</span><span class="lz-lnote"><code>cut</code> · <code>awk</code> — rút các trường ra khỏi mỗi dòng</span></div>
  <div class="lz-layer"><span class="lz-lname">Sắp xếp lại</span><span class="lz-lnote"><code>sort</code> · <code>tac</code> · <code>shuf</code> — đổi thứ tự dòng</span></div>
  <div class="lz-layer"><span class="lz-lname">Rút gọn</span><span class="lz-lnote"><code>uniq</code> · <code>wc</code> · <code>head</code> · <code>tail</code> — gộp lại hoặc cắt bớt</span></div>
  <div class="lz-layer"><span class="lz-lname">Biến đổi ký tự</span><span class="lz-lnote"><code>tr</code> · <code>rev</code> — làm việc ở mức dưới cả dòng</span></div>
  <div class="lz-layer"><span class="lz-lname">Ghép file</span><span class="lz-lnote"><code>paste</code> · <code>join</code> · <code>comm</code> — đặt hai dòng dữ liệu cạnh nhau</span></div>
  <div class="lz-layer"><span class="lz-lname">Trình bày</span><span class="lz-lnote"><code>column</code> · <code>nl</code> · <code>fold</code> — làm cho đọc được</span></div>
</div>

<h3>cut — trường theo dấu phân cách hoặc theo vị trí</h3>
<pre><code>cut -d: -f1 /etc/passwd            <span class="tok-comment"># -d đặt dấu phân cách, -f chọn trường</span>
cut -d: -f1,7 /etc/passwd          <span class="tok-comment"># nhiều trường</span>
cut -d, -f2-4 data.csv             <span class="tok-comment"># một khoảng</span>
cut -c1-8 log.txt                  <span class="tok-comment"># theo vị trí KÝ TỰ thay vì trường</span></code></pre>
<div class="out">root
daemon
deploy</div>
<div class="callout warn"><code>cut</code> có một hạn chế thật: <strong>nó coi MỖI dấu phân cách là một chỗ ngắt</strong>, nên hai dấu cách liền nhau nghĩa là có một trường rỗng ở giữa. Với output căn theo dấu cách như <code>ls -l</code> hay <code>ps</code>, lệnh <code>cut -d' ' -f3</code> trả về chuỗi rỗng một cách khó lường. Ở đó hãy dùng <code>awk '{print \$3}'</code> — awk mặc định gộp các chuỗi khoảng trắng lại. Hãy chọn <code>cut</code> khi dấu phân cách là một ký tự đơn thật sự (<code>:</code>, <code>,</code>, tab), còn lại thì chọn <code>awk</code>.</div>

<h3>sort — và những cờ làm nó cho kết quả đúng</h3>
<pre><code>sort names.txt                     <span class="tok-comment"># theo từ điển, theo locale</span>
sort -n sizes.txt                  <span class="tok-comment"># theo SỐ — 10 đứng sau 9, không phải trước</span>
sort -h sizes.txt                  <span class="tok-comment"># kích thước cho người đọc: 2K &lt; 1M &lt; 3G</span>
sort -r names.txt                  <span class="tok-comment"># đảo ngược</span>
sort -u names.txt                  <span class="tok-comment"># duy nhất — sắp xếp và khử trùng trong một lượt</span>
sort -V versions.txt               <span class="tok-comment"># sắp theo phiên bản: 1.10 đứng sau 1.9</span>
sort -t: -k3 -n /etc/passwd        <span class="tok-comment"># theo trường 3, theo số, phân cách bằng ':'</span>
sort -k2,2 -k1,1nr data.txt        <span class="tok-comment"># trường 2 tăng dần, rồi trường 1 theo số giảm dần</span></code></pre>
<div class="out">$ printf '9\\n10\\n100\\n' | sort
10
100
9
$ printf '9\\n10\\n100\\n' | sort -n
9
10
100</div>
<div class="callout">Kết quả đầu tiên đó là lỗi <code>sort</code> phổ biến nhất. Không có <code>-n</code>, sort so sánh VĂN BẢN: "10" bắt đầu bằng "1", mà "1" đứng trước "9". Bất cứ khi nào bạn sắp xếp kích thước, số đếm, số cổng hay ID, bạn cần <code>-n</code>. Và <code>-k2,2</code> nghĩa là "chỉ trường 2" — viết trần <code>-k2</code> nghĩa là "từ trường 2 tới hết dòng", và nó âm thầm cho kết quả khác.</div>

<h3>uniq — nhưng chỉ trên những dòng nằm kề nhau</h3>
<pre><code>sort access.log | uniq             <span class="tok-comment"># khử trùng (sort TRƯỚC — luôn luôn)</span>
sort access.log | uniq -c          <span class="tok-comment"># thêm số đếm vào đầu mỗi dòng</span>
sort access.log | uniq -d          <span class="tok-comment"># chỉ những dòng xuất hiện NHIỀU HƠN một lần</span>
sort access.log | uniq -u          <span class="tok-comment"># chỉ những dòng xuất hiện ĐÚNG một lần</span>
sort emails.txt | uniq -i          <span class="tok-comment"># so sánh không phân biệt hoa thường</span>
sort data.csv | uniq -f1           <span class="tok-comment"># bỏ qua trường đầu khi so sánh</span></code></pre>
<p><code>uniq -d</code> là cách bạn tìm ra mục trùng trong một file cấu hình, ID trùng trong một bản xuất, hay khoá lặp lại trong file dịch — câu trả lời hai chữ cho một câu hỏi mà người ta thường viết hẳn script để giải.</p>

<h3>tr — dịch hoặc xoá ký tự</h3>
<pre><code>tr 'a-z' 'A-Z' &lt; notes.txt         <span class="tok-comment"># viết hoa</span>
tr -d '\\r' &lt; windows.txt &gt; unix.txt <span class="tok-comment"># bỏ CR — chữa lỗi "bad interpreter"</span>
tr -s ' ' &lt; padded.txt             <span class="tok-comment"># -s ép lại: gộp chuỗi lặp thành một</span>
tr ',' '\\n' &lt; list.csv              <span class="tok-comment"># mỗi mục một dòng</span>
tr -cd '[:print:]\\n' &lt; messy.log    <span class="tok-comment"># -c lấy phần bù, -d xoá: chỉ giữ ký tự in được</span></code></pre>
<p><code>tr</code> làm việc trên <em>KÝ TỰ</em>, không phải trên từ hay trên mẫu — nó không có khái niệm "khớp". Điều đó làm nó nhanh nhất trong danh sách này, và là công cụ đúng cho việc "xoá mọi ký tự về đầu dòng" hay "biến dấu phẩy thành ký tự xuống dòng". Nó chỉ đọc stdin, không bao giờ nhận tên file, nên <code>&lt;</code> hoặc một cái ống là bắt buộc.</p>
<div class="callout ok"><code>tr -d '\\r'</code> đáng có một ghi chú riêng. Một script shell soạn trên Windows mang kết thúc dòng <code>\\r\\n</code>, nên dòng shebang đọc ra thành <code>#!/bin/bash\\r</code> và nhân đi tìm một trình thông dịch có tên kết thúc bằng ký tự về đầu dòng. Thông báo lỗi — <code>bad interpreter: No such file or directory</code> — lại nêu tên một file mà nhìn rõ ràng là CÓ, và đó là lý do nó làm người ta bối rối lâu đến thế. <code>dos2unix</code> làm đúng việc đó với một cái tên dễ hiểu hơn.</div>

<h3>wc, head, tail</h3>
<pre><code>wc -l access.log         <span class="tok-comment"># số dòng</span>
wc -w essay.txt          <span class="tok-comment"># số từ</span>
wc -c file.bin           <span class="tok-comment"># số byte  ·  -m cho số ký tự (khác nhau với UTF-8)</span>
head -20 app.log         <span class="tok-comment"># 20 dòng đầu</span>
tail -20 app.log         <span class="tok-comment"># 20 dòng cuối</span>
tail -n +100 app.log     <span class="tok-comment"># từ dòng 100 tới HẾT — để ý dấu cộng</span>
tail -f app.log          <span class="tok-comment"># theo dõi khi file lớn dần</span>
tail -F app.log          <span class="tok-comment"># theo dõi THEO TÊN — sống sót qua việc xoay vòng log</span></code></pre>
<p><code>tail -n +2 data.csv</code> là cách chuẩn để bỏ qua dòng tiêu đề của CSV, còn <code>-F</code> thay cho <code>-f</code> là thứ bạn cần với bất kỳ file nào mà <code>logrotate</code> đụng tới: <code>-f</code> bám theo inode, nên sau một lần xoay vòng nó ngồi nhìn cái file cũ đã đổi tên đến muôn đời, chẳng in ra gì trong khi file log mới đầy dần.</p>

<h3>paste, join, comm — hai dòng dữ liệu cùng lúc</h3>
<pre><code>paste names.txt scores.txt              <span class="tok-comment"># cạnh nhau, phân cách bằng tab</span>
paste -d, names.txt scores.txt          <span class="tok-comment"># dùng dấu phẩy thay vào</span>
paste -sd, names.txt                    <span class="tok-comment"># -s: dồn mọi dòng lên MỘT dòng</span>
join -t, -1 1 -2 1 users.csv orders.csv <span class="tok-comment"># một phép nối quan hệ thật trên trường 1</span>
comm -13 &lt;(sort a.txt) &lt;(sort b.txt)    <span class="tok-comment"># những dòng chỉ có trong b</span></code></pre>
<div class="out">$ paste -sd, fruits.txt
apple,banana,cherry</div>
<p><code>comm</code> in ra ba cột — chỉ-có-trong-A, chỉ-có-trong-B, có-ở-cả-hai — và các chữ số dùng để tắt bớt cột. <code>-13</code> nghĩa là "giấu cột 1 và 3", để lại phần chỉ-có-trong-B. Cả hai đầu vào <strong>BẮT BUỘC phải đã sắp xếp</strong>, và đó là lý do thay thế tiến trình đi cặp với nó tự nhiên đến vậy.</p>

<h3>column và nl — làm output đọc được</h3>
<pre><code>column -t -s: /etc/passwd        <span class="tok-comment"># căn thành bảng</span>
column -t -s, data.csv | less -S <span class="tok-comment"># -S: đừng bẻ dòng dài</span>
nl -ba script.sh                 <span class="tok-comment"># đánh số mọi dòng, kể cả dòng trống</span>
fold -w 80 long.txt              <span class="tok-comment"># bẻ cứng ở cột 80</span></code></pre>
<div class="out">root   x  0     0     root   /root       /bin/bash
deploy x  1001  1001         /home/deploy /bin/bash</div>
<p><code>column -t</code> biến bất kỳ output có phân cách nào thành một cái bảng đọc được, và nó là cách nhanh nhất để làm một file CSV dễ nhìn ngay trong terminal mà không phải rời khỏi đó.</p>

<h3>Ghép tất cả lại</h3>
<pre><code><span class="tok-comment"># 10 URL nhiều lượt gọi nhất, từ một access log của nginx</span>
awk '{print \$7}' access.log | sort | uniq -c | sort -rn | head -10

<span class="tok-comment"># Mọi người dùng có shell đăng nhập thật</span>
grep -v '/nologin\\|/false' /etc/passwd | cut -d: -f1,7 | column -t -s:

<span class="tok-comment"># Dự án này có những đuôi file nào, mỗi loại bao nhiêu cái</span>
find src -type f | grep -o '\\.[^./]*\$' | sort | uniq -c | sort -rn

<span class="tok-comment"># ID trùng trong một bản xuất</span>
cut -d, -f1 export.csv | sort | uniq -d

<span class="tok-comment"># Một mật khẩu ngẫu nhiên 32 ký tự</span>
tr -dc 'A-Za-z0-9' &lt; /dev/urandom | head -c 32; echo</code></pre>
<div class="out">   4821 /api/v1/posts
   1109 /api/v1/auth/me
    847 /api/v1/messages/threads

root   /bin/bash
deploy /bin/bash

    142 .ts
     38 .tsx
      9 .json</div>

<a class="link-card" href="https://www.gnu.org/software/coreutils/manual/coreutils.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">GNU Coreutils Manual</span><span class="lc-sub">Mọi công cụ trong bài này, do chính những người viết ra chúng ghi lại. Chương về bộ chỉ định trường <code>-k</code> của <code>sort</code> đáng đọc kỹ một lần.</span></span>
</a>
<a class="link-card" href="https://tldr.inbrowser.app/" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">tldr pages — ví dụ thay cho sách hướng dẫn</span><span class="lc-sub">Mỗi lệnh năm ví dụ thực dụng, và đó thường mới là thứ bạn thật sự muốn khi mở <code>man</code>. Cài về máy bằng <code>npm i -g tldr</code>.</span></span>
</a>
<a class="link-card" href="https://explainshell.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">explainshell — dán một chuỗi ống vào, nhận về bản chú giải</span><span class="lc-sub">Dán bất kỳ lệnh nào trong bài này, nó tách ra từng cờ và đối chiếu với trang man thật. Cách nhanh nhất để đọc một dòng lệnh của người khác.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: trả lời câu hỏi bằng đúng một dòng</span><span class="lc-sub">Bài chấm điểm đưa cho bạn một file log và một câu hỏi, và chờ đợi đúng một chuỗi ống. <code>sort -k</code> và <code>uniq -d</code> xuất hiện rất nhiều.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> locale của <code>sort</code>. Với <code>en_US.UTF-8</code>, <code>sort</code> bỏ qua hoa thường và dấu câu theo những cách gây bất ngờ: chạy <code>sort</code> rồi <code>uniq</code> có thể cho ra cách gộp nhóm khác với bạn tưởng, và <code>comm</code> — vốn đòi cả hai đầu vào phải sắp xếp <em>THEO CÙNG MỘT KIỂU</em> — sẽ âm thầm báo sai phần khác biệt nếu một file được sắp xếp dưới một locale khác. Khi thứ tự byte chính xác là quan trọng, hãy đặt <code>LC_ALL=C</code> cho mọi lệnh sort trong chuỗi ống. Nó còn nhanh hơn một cách đo được.</div>
<p class="note-ct"><strong>Thói quen làm mấy công cụ này bật ra trong đầu:</strong> vừa dựng vừa cho chảy qua <code>head</code> và NHÌN sau từng khâu một. Mấy lệnh này nhỏ tới mức bạn giữ được hành vi của chúng trong đầu, nhưng chỉ khi bạn nhìn thấy nó — chuyện <code>cut -d' ' -f3</code> trả về chuỗi rỗng, hay <code>sort</code> xếp 100 trước 9, hiển nhiên ngay khoảnh khắc bạn nhìn và vô hình khi bạn không nhìn.</p>
</div>
`,
    },
    /* ─────────────────────────── 3.5 ─────────────────────────── */
    {
      title: '3.5 — sed: editing a stream you never open|||3.5 — sed: sửa một dòng dữ liệu mà bạn không hề mở ra',
      slug: 'lnx-3-5-sed',
      type: 'LESSON',
      description: 'Lệnh s với đầy đủ cờ, địa chỉ dòng và khoảng, nhóm bắt giữ, -i và cái bẫy sao lưu, sed trên nhiều file bằng find, và những công thức thay thế đáng giữ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.5</span>
<h2>sed: editing a stream you never open</h2>
<p class="lead"><code>grep</code> selects lines. <code>sed</code> <em>changes</em> them. It reads input one line at a time, applies a small program to each, and prints the result — which means it can edit a 40 GB file using a few kilobytes of memory, and can edit a stream that has no file at all. Ninety per cent of real <code>sed</code> use is one command, <code>s</code>, so start there and add the rest as you need it.</p>

<h3>The substitute command</h3>
<pre><code>sed 's/old/new/' file.txt          <span class="tok-comment"># first match ON EACH LINE</span>
sed 's/old/new/g' file.txt         <span class="tok-comment"># g = global: every match on each line</span>
sed 's/old/new/2' file.txt         <span class="tok-comment"># only the 2nd match on each line</span>
sed 's/old/new/gi' file.txt        <span class="tok-comment"># g + case-Insensitive</span>
sed 's/old/new/w hits.txt' f.txt   <span class="tok-comment"># w: also write changed lines to a file</span></code></pre>
<div class="out">$ echo "cat cat cat" | sed 's/cat/dog/'
dog cat cat
$ echo "cat cat cat" | sed 's/cat/dog/g'
dog dog dog</div>
<div class="callout">Without <code>g</code>, <code>sed</code> replaces the <strong>first match per line</strong>, not the first match in the file. That is the single most common surprise, and it is the reason a "sed did not replace everything" bug is almost always a missing <code>g</code>.</div>

<h3>The delimiter is not always a slash</h3>
<pre><code>sed 's/\\/usr\\/local/\\/opt/g' paths.txt      <span class="tok-comment"># unreadable</span>
sed 's|/usr/local|/opt|g' paths.txt        <span class="tok-comment"># same thing, legible</span>
sed 's#http://#https://#g' urls.txt        <span class="tok-comment"># # works too</span></code></pre>
<p>Any character can be the delimiter — <code>sed</code> takes whatever follows the <code>s</code>. When your pattern contains slashes (paths, URLs), switch to <code>|</code> or <code>#</code>. This is not a style preference; escaped-slash patterns are where sed bugs hide.</p>

<h3>Addresses: which lines to act on</h3>
<pre><code>sed '3s/old/new/' file            <span class="tok-comment"># only line 3</span>
sed '2,5s/old/new/' file          <span class="tok-comment"># lines 2 through 5</span>
sed '\$s/old/new/' file            <span class="tok-comment"># the last line</span>
sed '2,\$s/old/new/' file          <span class="tok-comment"># line 2 to the end</span>
sed '/^#/s/old/new/' file         <span class="tok-comment"># only lines starting with #</span>
sed '/BEGIN/,/END/s/old/new/' f   <span class="tok-comment"># between two markers</span>
sed '/^#/!s/old/new/' file        <span class="tok-comment"># ! inverts: lines NOT starting with #</span></code></pre>
<p>An address before a command restricts it. That composability is what makes <code>sed</code> more than search-and-replace: "change this word, but only inside the <code>[database]</code> section of the config" is one expression.</p>

<h3>Commands other than s</h3>
<pre><code>sed -n '5p' file                  <span class="tok-comment"># -n suppresses output, p prints → just line 5</span>
sed -n '10,20p' file              <span class="tok-comment"># a line range, like head+tail combined</span>
sed -n '/ERROR/p' file            <span class="tok-comment"># behaves like grep</span>
sed '/^\$/d' file                  <span class="tok-comment"># d: delete blank lines</span>
sed '/^#/d' config.ini            <span class="tok-comment"># delete comment lines</span>
sed '5q' bigfile                  <span class="tok-comment"># q: quit after line 5 — stops reading immediately</span>
sed '2i\\inserted above' file      <span class="tok-comment"># i: insert before line 2</span>
sed '/pattern/a\\appended after' f <span class="tok-comment"># a: append after each match</span>
sed 'y/abc/xyz/' file             <span class="tok-comment"># y: transliterate, like tr</span></code></pre>
<div class="callout ok"><code>sed '5q'</code> is worth remembering as a performance tool: unlike <code>head -5</code> on some systems, <code>q</code> makes sed stop reading the input entirely. On a 40 GB log, <code>sed -n '1000000,1000010p; 1000010q' huge.log</code> extracts eleven lines from the middle and stops — far faster than <code>sed -n '…p'</code> alone, which would keep reading to the end.</div>

<h3>Capture groups: reusing parts of the match</h3>
<pre><code>echo "2026-08-22" | sed -E 's/([0-9]{4})-([0-9]{2})-([0-9]{2})/\\3\\/\\2\\/\\1/'</code></pre>
<div class="out">22/08/2026</div>
<pre><code><span class="tok-comment"># &amp; is the WHOLE match — wrap every number in brackets</span>
echo "port 8080" | sed -E 's/[0-9]+/[&amp;]/'

<span class="tok-comment"># swap two comma-separated fields</span>
sed -E 's/^([^,]+),([^,]+)/\\2,\\1/' data.csv

<span class="tok-comment"># pull the version out of a line</span>
sed -nE 's/^version = "(.*)"\$/\\1/p' Cargo.toml</code></pre>
<div class="out">port [8080]</div>
<p>Note <code>-E</code> on all of these. Without it you are in BRE (Lesson 3.3) and must write <code>\\(</code>, <code>\\)</code>, <code>\\{</code>, <code>\\+</code> — technically the same power, twice the backslashes. Use <code>-E</code> unless you are writing for a system that lacks it.</p>
<div class="callout warn">In the <em>replacement</em> text, three characters are special: <code>&amp;</code> (the whole match), <code>\\1</code>–<code>\\9</code> (groups), and the delimiter. If your replacement contains a literal <code>&amp;</code> — a URL query string, an HTML entity — you must escape it as <code>\\&amp;</code>, or sed silently inserts the matched text instead. This one produces plausible-looking wrong output rather than an error.</div>

<h3>Editing files in place</h3>
<pre><code>sed 's/old/new/g' file.txt              <span class="tok-comment"># prints to stdout, file untouched</span>
sed -i 's/old/new/g' file.txt           <span class="tok-comment"># edits the file, NO backup</span>
sed -i.bak 's/old/new/g' file.txt       <span class="tok-comment"># keeps file.txt.bak</span></code></pre>
<div class="callout warn"><strong>macOS and BSD sed differ here</strong>, and it bites everyone who writes a script on a Mac that runs on a Linux server, or the reverse. BSD <code>sed -i</code> <em>requires</em> a suffix argument: <code>sed -i '' 's/a/b/' f</code> on macOS, <code>sed -i 's/a/b/' f</code> on Linux. Neither form works on the other platform. In a script that must run on both, use <code>perl -pi -e 's/a/b/'</code>, which behaves identically everywhere.</div>

<h3>Across many files</h3>
<pre><code><span class="tok-comment"># LOOK FIRST — no -i, so nothing changes</span>
grep -rl "oldApiUrl" src/ | xargs -r sed -n 's/oldApiUrl/newApiUrl/gp'

<span class="tok-comment"># then do it</span>
grep -rl "oldApiUrl" src/ | xargs -r sed -i 's/oldApiUrl/newApiUrl/g'

<span class="tok-comment"># or with find, NUL-safe (Lesson 2.3)</span>
find src -name "*.ts" -print0 | xargs -0 sed -i 's/oldApiUrl/newApiUrl/g'</code></pre>
<p>The <code>-n …p</code> form on the first line prints only the lines that <em>would</em> change, with the change applied. That is the dry run, and running it before the real command costs three seconds.</p>

<h3>Recipes worth keeping</h3>
<pre><code><span class="tok-comment"># Strip comments and blank lines from a config — see what is actually set</span>
sed -E '/^\\s*#/d; /^\\s*\$/d' /etc/ssh/sshd_config

<span class="tok-comment"># Trim leading and trailing whitespace on every line</span>
sed -E 's/^[[:space:]]+//; s/[[:space:]]+\$//' messy.txt

<span class="tok-comment"># Print the lines between two markers, exclusive</span>
sed -n '/BEGIN CONFIG/,/END CONFIG/{//!p}' file.txt

<span class="tok-comment"># Add a line after every match (a: append)</span>
sed '/^\\[database\\]/a\\  timeout = 30' app.ini

<span class="tok-comment"># Replace only on lines that ALSO match something else</span>
sed '/production/s/debug=true/debug=false/' config.env

<span class="tok-comment"># Number the lines that matched, without renumbering everything</span>
grep -n ERROR app.log | sed -E 's/^([0-9]+):/line \\1: /'</code></pre>
<div class="out">Port 22
PermitRootLogin no
PasswordAuthentication no
X11Forwarding no</div>
<p>That first recipe is one you will use constantly. A distribution's default config is 90% commented explanation; two <code>d</code> commands turn 130 lines into the eight that are actually in effect.</p>

<h3>Where sed runs out</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Multi-line patterns</span><span class="v"><code>sed</code> sees one line at a time. Matching across lines needs the hold space (<code>N</code>, <code>D</code>, <code>h</code>, <code>H</code>, <code>x</code>) which is genuinely hard to read. Use <code>perl -0777 -pe</code> instead: it slurps the whole file so <code>.</code> and <code>\\n</code> behave as you expect.</span></div>
  <div class="kv"><span class="k">Columns and arithmetic</span><span class="v">If you find yourself counting fields in a regex, you want <code>awk</code> — the next lesson.</span></div>
  <div class="kv"><span class="k">Structured formats</span><span class="v">Do not sed JSON, XML or YAML. <code>jq</code>, <code>yq</code> and <code>xmlstarlet</code> exist, understand the syntax, and will not corrupt a file that gets reformatted.</span></div>
</div>

<a class="link-card" href="https://www.gnu.org/software/sed/manual/sed.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">GNU sed Manual</span><span class="lc-sub">Complete, and the "Some Sample Scripts" chapter is a genuinely good read — it shows how far one-line programs stretch.</span></span>
</a>
<a class="link-card" href="https://sed.js.org/" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">sed online — try an expression in the browser</span><span class="lc-sub">Paste input and a script, see the result instantly. Much faster than iterating on a real file, and there is nothing to accidentally overwrite.</span></span>
</a>
<a class="link-card" href="https://mywiki.wooledge.org/BashFAQ/021" target="_blank" rel="noopener">
  <span class="lc-ico">🔧</span>
  <span class="lc-body"><span class="lc-title">BashFAQ — "How can I replace a string with another string?"</span><span class="lc-sub">Covers the escaping problem properly: what to do when the string you are inserting contains slashes, ampersands or newlines.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: rewrite a config with sed</span><span class="lc-sub">Graded tasks on addresses, capture groups, <code>-i</code> safety and the <code>&amp;</code> escaping trap.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> <code>sed -i</code> with an unanchored pattern, run recursively. <code>find . -name "*.ts" -print0 | xargs -0 sed -i 's/id/uuid/g'</code> looks like a rename, and it rewrites <code>id</code> inside <code>width</code>, <code>valid</code>, <code>hidden</code> and every import path containing those letters — across every file, with no backup and nothing printed. Anchor with word boundaries (<code>s/\\bid\\b/uuid/g</code>), run it without <code>-i</code> first, and do it on a clean git tree so <code>git diff</code> is your undo.</div>
<p class="note-ct"><strong>Three habits:</strong> build the expression without <code>-i</code> and read the output; commit first, so the version-control diff is your safety net rather than a <code>.bak</code> file you will forget to delete; and prefer <code>|</code> or <code>#</code> as the delimiter the moment a path appears. Each takes seconds, and together they turn <code>sed</code> from a risky tool into a routine one.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.5</span>
<h2>sed: sửa một dòng dữ liệu mà bạn không hề mở ra</h2>
<p class="lead"><code>grep</code> chọn ra các dòng. <code>sed</code> thì <em>ĐỔI</em> chúng. Nó đọc đầu vào mỗi lần một dòng, áp một chương trình nhỏ lên từng dòng, rồi in kết quả — nghĩa là nó sửa được một file 40 GB chỉ tốn vài kilobyte bộ nhớ, và sửa được cả một dòng dữ liệu vốn không có file nào cả. Chín mươi phần trăm việc dùng <code>sed</code> thật sự chỉ là một lệnh, lệnh <code>s</code>, nên hãy bắt đầu từ đó và thêm phần còn lại khi cần.</p>

<h3>Lệnh thay thế</h3>
<pre><code>sed 's/old/new/' file.txt          <span class="tok-comment"># lần khớp đầu tiên TRÊN MỖI DÒNG</span>
sed 's/old/new/g' file.txt         <span class="tok-comment"># g = toàn cục: mọi lần khớp trên mỗi dòng</span>
sed 's/old/new/2' file.txt         <span class="tok-comment"># chỉ lần khớp thứ 2 trên mỗi dòng</span>
sed 's/old/new/gi' file.txt        <span class="tok-comment"># g + không phân biệt hoa thường</span>
sed 's/old/new/w hits.txt' f.txt   <span class="tok-comment"># w: ghi thêm những dòng đã đổi ra một file</span></code></pre>
<div class="out">$ echo "cat cat cat" | sed 's/cat/dog/'
dog cat cat
$ echo "cat cat cat" | sed 's/cat/dog/g'
dog dog dog</div>
<div class="callout">Không có <code>g</code>, <code>sed</code> thay <strong>lần khớp đầu tiên MỖI DÒNG</strong>, chứ không phải lần khớp đầu tiên trong cả file. Đó là điều bất ngờ phổ biến nhất, và là lý do lỗi "sed không thay hết" gần như luôn là do thiếu <code>g</code>.</div>

<h3>Dấu phân cách không nhất thiết là gạch chéo</h3>
<pre><code>sed 's/\\/usr\\/local/\\/opt/g' paths.txt      <span class="tok-comment"># không đọc nổi</span>
sed 's|/usr/local|/opt|g' paths.txt        <span class="tok-comment"># y hệt, mà đọc được</span>
sed 's#http://#https://#g' urls.txt        <span class="tok-comment"># dấu # cũng chạy</span></code></pre>
<p>Ký tự nào cũng làm dấu phân cách được — <code>sed</code> lấy bất cứ thứ gì đứng ngay sau chữ <code>s</code>. Khi mẫu của bạn có chứa gạch chéo (đường dẫn, URL), hãy đổi sang <code>|</code> hoặc <code>#</code>. Đây không phải sở thích hình thức; những mẫu đầy gạch-chéo-đã-thoát chính là nơi lỗi sed ẩn mình.</p>

<h3>Địa chỉ: tác động lên những dòng nào</h3>
<pre><code>sed '3s/old/new/' file            <span class="tok-comment"># chỉ dòng 3</span>
sed '2,5s/old/new/' file          <span class="tok-comment"># dòng 2 tới 5</span>
sed '\$s/old/new/' file            <span class="tok-comment"># dòng cuối cùng</span>
sed '2,\$s/old/new/' file          <span class="tok-comment"># từ dòng 2 tới hết</span>
sed '/^#/s/old/new/' file         <span class="tok-comment"># chỉ những dòng bắt đầu bằng #</span>
sed '/BEGIN/,/END/s/old/new/' f   <span class="tok-comment"># giữa hai dấu mốc</span>
sed '/^#/!s/old/new/' file        <span class="tok-comment"># ! đảo lại: những dòng KHÔNG bắt đầu bằng #</span></code></pre>
<p>Một địa chỉ đặt trước một lệnh sẽ giới hạn lệnh đó. Chính khả năng ghép nối ấy làm cho <code>sed</code> vượt xa phép tìm-và-thay: câu "đổi từ này, nhưng chỉ bên trong mục <code>[database]</code> của file cấu hình" gói lại thành đúng một biểu thức.</p>

<h3>Những lệnh khác ngoài s</h3>
<pre><code>sed -n '5p' file                  <span class="tok-comment"># -n tắt output, p in ra → chỉ dòng 5</span>
sed -n '10,20p' file              <span class="tok-comment"># một khoảng dòng, như head+tail gộp lại</span>
sed -n '/ERROR/p' file            <span class="tok-comment"># hành xử như grep</span>
sed '/^\$/d' file                  <span class="tok-comment"># d: xoá những dòng trống</span>
sed '/^#/d' config.ini            <span class="tok-comment"># xoá các dòng chú thích</span>
sed '5q' bigfile                  <span class="tok-comment"># q: thoát sau dòng 5 — ngừng đọc ngay lập tức</span>
sed '2i\\chèn phía trên' file      <span class="tok-comment"># i: chèn vào trước dòng 2</span>
sed '/pattern/a\\thêm phía sau' f  <span class="tok-comment"># a: thêm vào sau mỗi dòng khớp</span>
sed 'y/abc/xyz/' file             <span class="tok-comment"># y: chuyển tự, như tr</span></code></pre>
<div class="callout ok"><code>sed '5q'</code> đáng nhớ như một công cụ hiệu năng: khác với <code>head -5</code> trên một số hệ, chữ <code>q</code> làm sed NGỪNG ĐỌC đầu vào hoàn toàn. Trên một file log 40 GB, lệnh <code>sed -n '1000000,1000010p; 1000010q' huge.log</code> rút mười một dòng ở giữa rồi dừng — nhanh hơn nhiều so với chỉ dùng <code>sed -n '…p'</code>, vốn sẽ đọc tiếp tới tận cuối file.</div>

<h3>Nhóm bắt giữ: dùng lại từng phần của chỗ khớp</h3>
<pre><code>echo "2026-08-22" | sed -E 's/([0-9]{4})-([0-9]{2})-([0-9]{2})/\\3\\/\\2\\/\\1/'</code></pre>
<div class="out">22/08/2026</div>
<pre><code><span class="tok-comment"># &amp; là TOÀN BỘ chỗ khớp — bọc mọi con số vào ngoặc vuông</span>
echo "port 8080" | sed -E 's/[0-9]+/[&amp;]/'

<span class="tok-comment"># đổi chỗ hai trường cách nhau bằng dấu phẩy</span>
sed -E 's/^([^,]+),([^,]+)/\\2,\\1/' data.csv

<span class="tok-comment"># rút số phiên bản ra khỏi một dòng</span>
sed -nE 's/^version = "(.*)"\$/\\1/p' Cargo.toml</code></pre>
<div class="out">port [8080]</div>
<p>Để ý chữ <code>-E</code> ở tất cả những dòng trên. Không có nó, bạn đang ở trong BRE (Bài 3.3) và phải viết <code>\\(</code>, <code>\\)</code>, <code>\\{</code>, <code>\\+</code> — về mặt kỹ thuật vẫn đủ sức mạnh, nhưng gấp đôi số gạch chéo. Hãy dùng <code>-E</code> trừ khi bạn viết cho một hệ thống không có nó.</p>
<div class="callout warn">Trong phần <em>THAY THẾ</em>, ba ký tự mang nghĩa đặc biệt: <code>&amp;</code> (toàn bộ chỗ khớp), <code>\\1</code>–<code>\\9</code> (các nhóm), và chính dấu phân cách. Nếu phần thay thế của bạn có chứa một dấu <code>&amp;</code> nguyên văn — một chuỗi truy vấn URL, một thực thể HTML — bạn PHẢI thoát nó thành <code>\\&amp;</code>, không thì sed âm thầm chèn vào đó đoạn văn bản vừa khớp. Cái này sinh ra kết quả sai mà trông rất hợp lý, chứ không sinh ra lỗi.</div>

<h3>Sửa file tại chỗ</h3>
<pre><code>sed 's/old/new/g' file.txt              <span class="tok-comment"># in ra stdout, file không bị đụng</span>
sed -i 's/old/new/g' file.txt           <span class="tok-comment"># sửa thẳng file, KHÔNG sao lưu</span>
sed -i.bak 's/old/new/g' file.txt       <span class="tok-comment"># giữ lại file.txt.bak</span></code></pre>
<div class="callout warn"><strong>sed của macOS và BSD khác ở chỗ này</strong>, và nó cắn mọi người viết script trên Mac rồi chạy trên máy chủ Linux, hoặc ngược lại. <code>sed -i</code> của BSD <em>BẮT BUỘC</em> phải có một tham số hậu tố: <code>sed -i '' 's/a/b/' f</code> trên macOS, còn <code>sed -i 's/a/b/' f</code> trên Linux. Không dạng nào chạy được trên nền còn lại. Trong một script phải chạy cả hai nơi, hãy dùng <code>perl -pi -e 's/a/b/'</code>, thứ hành xử y hệt ở mọi nơi.</div>

<h3>Trên nhiều file cùng lúc</h3>
<pre><code><span class="tok-comment"># NHÌN TRƯỚC ĐÃ — không có -i, nên không có gì thay đổi</span>
grep -rl "oldApiUrl" src/ | xargs -r sed -n 's/oldApiUrl/newApiUrl/gp'

<span class="tok-comment"># rồi mới làm thật</span>
grep -rl "oldApiUrl" src/ | xargs -r sed -i 's/oldApiUrl/newApiUrl/g'

<span class="tok-comment"># hoặc với find, an toàn với NUL (Bài 2.3)</span>
find src -name "*.ts" -print0 | xargs -0 sed -i 's/oldApiUrl/newApiUrl/g'</code></pre>
<p>Dạng <code>-n …p</code> ở dòng đầu chỉ in ra những dòng <em>SẼ</em> thay đổi, với thay đổi đã được áp vào. Đó chính là lần chạy thử, và chạy nó trước lệnh thật tốn ba giây.</p>

<h3>Những công thức đáng giữ</h3>
<pre><code><span class="tok-comment"># Bóc chú thích và dòng trống khỏi một file cấu hình — xem cái gì THẬT SỰ đang đặt</span>
sed -E '/^\\s*#/d; /^\\s*\$/d' /etc/ssh/sshd_config

<span class="tok-comment"># Cắt khoảng trắng đầu và cuối mọi dòng</span>
sed -E 's/^[[:space:]]+//; s/[[:space:]]+\$//' messy.txt

<span class="tok-comment"># In các dòng nằm GIỮA hai dấu mốc, không lấy chính hai dòng mốc</span>
sed -n '/BEGIN CONFIG/,/END CONFIG/{//!p}' file.txt

<span class="tok-comment"># Thêm một dòng sau mỗi chỗ khớp (a: append)</span>
sed '/^\\[database\\]/a\\  timeout = 30' app.ini

<span class="tok-comment"># Chỉ thay trên những dòng CŨNG khớp một thứ khác</span>
sed '/production/s/debug=true/debug=false/' config.env

<span class="tok-comment"># Đánh số những dòng đã khớp, mà không đánh số lại toàn bộ</span>
grep -n ERROR app.log | sed -E 's/^([0-9]+):/dòng \\1: /'</code></pre>
<div class="out">Port 22
PermitRootLogin no
PasswordAuthentication no
X11Forwarding no</div>
<p>Công thức đầu tiên là thứ bạn sẽ dùng liên tục. File cấu hình mặc định của một bản phân phối có tới 90% là lời giải thích đã bị chú thích; hai lệnh <code>d</code> biến 130 dòng thành tám dòng thật sự đang có hiệu lực.</p>

<h3>Chỗ sed hết sức</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Mẫu trải nhiều dòng</span><span class="v"><code>sed</code> nhìn mỗi lần một dòng. Khớp vắt qua nhiều dòng cần tới vùng giữ (<code>N</code>, <code>D</code>, <code>h</code>, <code>H</code>, <code>x</code>) và cái đó thật sự khó đọc. Hãy dùng <code>perl -0777 -pe</code> thay vào: nó hút cả file vào nên <code>.</code> và <code>\\n</code> hành xử đúng như bạn nghĩ.</span></div>
  <div class="kv"><span class="k">Cột và tính toán</span><span class="v">Nếu bạn thấy mình đang đếm số trường trong một regex, thứ bạn cần là <code>awk</code> — bài kế tiếp.</span></div>
  <div class="kv"><span class="k">Định dạng có cấu trúc</span><span class="v">Đừng sed vào JSON, XML hay YAML. Đã có <code>jq</code>, <code>yq</code> và <code>xmlstarlet</code>, chúng hiểu cú pháp và sẽ không phá hỏng một file vừa được định dạng lại.</span></div>
</div>

<a class="link-card" href="https://www.gnu.org/software/sed/manual/sed.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">GNU sed Manual</span><span class="lc-sub">Đầy đủ, và chương "Some Sample Scripts" thật sự đáng đọc — nó cho thấy những chương trình một dòng vươn xa tới đâu.</span></span>
</a>
<a class="link-card" href="https://sed.js.org/" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">sed trực tuyến — thử một biểu thức ngay trên trình duyệt</span><span class="lc-sub">Dán đầu vào và một script, thấy kết quả tức thì. Nhanh hơn nhiều so với thử đi thử lại trên file thật, và không có gì để lỡ tay ghi đè.</span></span>
</a>
<a class="link-card" href="https://mywiki.wooledge.org/BashFAQ/021" target="_blank" rel="noopener">
  <span class="lc-ico">🔧</span>
  <span class="lc-body"><span class="lc-title">BashFAQ — "Thay một chuỗi bằng một chuỗi khác thế nào?"</span><span class="lc-sub">Nói tử tế về vấn đề thoát ký tự: phải làm gì khi chuỗi bạn chèn vào có chứa gạch chéo, dấu và, hoặc ký tự xuống dòng.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: viết lại một file cấu hình bằng sed</span><span class="lc-sub">Bài chấm điểm về địa chỉ, nhóm bắt giữ, chốt an toàn của <code>-i</code> và cái bẫy thoát ký tự <code>&amp;</code>.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> <code>sed -i</code> với một mẫu không neo, chạy đệ quy. Lệnh <code>find . -name "*.ts" -print0 | xargs -0 sed -i 's/id/uuid/g'</code> trông như một phép đổi tên, và nó viết lại chữ <code>id</code> nằm bên trong <code>width</code>, <code>valid</code>, <code>hidden</code> cùng mọi đường dẫn import có chứa những chữ cái đó — trên mọi file, không sao lưu và không in ra gì. Hãy neo bằng ranh giới từ (<code>s/\\bid\\b/uuid/g</code>), chạy không có <code>-i</code> trước, và làm trên một cây git sạch để <code>git diff</code> chính là nút hoàn tác của bạn.</div>
<p class="note-ct"><strong>Ba thói quen:</strong> dựng biểu thức mà KHÔNG có <code>-i</code> rồi đọc kết quả; commit trước, để bản diff của hệ quản lý phiên bản làm lưới đỡ thay cho một file <code>.bak</code> mà bạn sẽ quên xoá; và đổi sang dấu phân cách <code>|</code> hoặc <code>#</code> ngay khoảnh khắc có một đường dẫn xuất hiện. Mỗi việc chỉ tốn vài giây, và cùng nhau chúng biến <code>sed</code> từ một công cụ nguy hiểm thành một công cụ thường ngày.</p>
</div>
`,
    },
    /* ─────────────────────────── 3.6 ─────────────────────────── */
    {
      title: '3.6 — awk: a whole language in one line|||3.6 — awk: cả một ngôn ngữ gói trong một dòng',
      slug: 'lnx-3-6-awk',
      type: 'LESSON',
      description: 'Mô hình mẫu/hành động, các trường $1..$NF, NR và NF, BEGIN/END, mảng liên kết để nhóm và cộng dồn, -F và OFS, và khi nào nên bỏ awk mà viết hẳn một script.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.6</span>
<h2>awk: a whole language in one line</h2>
<p class="lead"><code>awk</code> is a complete programming language — variables, arrays, functions, arithmetic, control flow — designed around one assumption: your input is lines made of fields. That assumption is right often enough that a single line of <code>awk</code> replaces a script you would otherwise write in Python. You do not need to learn the whole language. You need the model and about six constructs.</p>

<h3>The model: pattern { action }</h3>
<pre><code>awk 'PATTERN { ACTION }' file</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Read</span><span class="lz-t">one line, split into fields</span><span class="lz-d">Split on runs of whitespace by default. \$1 is the first field, \$2 the second, \$0 the whole line.</span></div>
  <div class="lz-step"><span class="lz-k">Test</span><span class="lz-t">does the line match PATTERN?</span><span class="lz-d">A regex, a comparison, or nothing at all — an empty pattern matches every line.</span></div>
  <div class="lz-step"><span class="lz-k">Act</span><span class="lz-t">run ACTION</span><span class="lz-d">Omit it and awk prints the line. So the pattern alone behaves like grep.</span></div>
  <div class="lz-step"><span class="lz-k">Repeat</span><span class="lz-t">next line, until EOF</span><span class="lz-d">Then run the END block, if there is one. Variables persist across lines — this is what makes totals possible.</span></div>
</div>

<pre><code>awk '{print \$1}' access.log         <span class="tok-comment"># no pattern: every line</span>
awk '/ERROR/' app.log               <span class="tok-comment"># no action: prints matching lines, like grep</span>
awk '/ERROR/ {print \$5}' app.log    <span class="tok-comment"># both</span>
awk '\$3 &gt; 100 {print \$1, \$3}' d.txt <span class="tok-comment"># a numeric comparison as the pattern</span></code></pre>
<div class="out">203.0.113.45
198.51.100.7</div>

<h3>Fields, and the built-in variables</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>\$1 \$2 \$3</code></span><span class="v">Fields, numbered from 1. <code>\$0</code> is the entire line.</span></div>
  <div class="kv"><span class="k"><code>NF</code></span><span class="v">Number of Fields on this line. <code>\$NF</code> is therefore the LAST field, and <code>\$(NF-1)</code> the one before it.</span></div>
  <div class="kv"><span class="k"><code>NR</code></span><span class="v">Number of the Record — the current line number, counting across all input files.</span></div>
  <div class="kv"><span class="k"><code>FNR</code></span><span class="v">Line number within the CURRENT file. Differs from NR only when you pass several files.</span></div>
  <div class="kv"><span class="k"><code>FS</code> <code>OFS</code></span><span class="v">Input and output field separators. <code>-F,</code> is shorthand for setting FS.</span></div>
  <div class="kv"><span class="k"><code>FILENAME</code></span><span class="v">The file currently being read. Useful when processing many at once.</span></div>
</div>
<pre><code>awk '{print NR, \$0}' file.txt           <span class="tok-comment"># number every line</span>
awk '{print \$NF}' access.log            <span class="tok-comment"># the last field, whatever its position</span>
awk 'NF' file.txt                       <span class="tok-comment"># NF is 0 on blank lines → deletes them</span>
awk 'NR &gt; 1' data.csv                   <span class="tok-comment"># skip the header row</span>
awk 'NR % 10 == 0' huge.log             <span class="tok-comment"># sample every 10th line</span></code></pre>
<div class="callout ok"><code>awk 'NF'</code> is a small masterpiece: the pattern is just the field count, awk treats 0 as false, so blank lines are dropped and everything else is printed by the implicit action. Three characters that replace <code>grep -v '^\$'</code>.</div>

<h3>Separators</h3>
<pre><code>awk -F, '{print \$2}' data.csv           <span class="tok-comment"># comma-separated</span>
awk -F: '{print \$1, \$7}' /etc/passwd    <span class="tok-comment"># colon</span>
awk -F'\\t' '{print \$3}' data.tsv        <span class="tok-comment"># tab</span>
awk -F'[,;]' '{print \$2}' mixed.txt      <span class="tok-comment"># FS is a REGEX: comma or semicolon</span>
awk 'BEGIN{OFS=" | "} {print \$1, \$2}' f <span class="tok-comment"># change the OUTPUT separator</span></code></pre>
<div class="out">root | /bin/bash
deploy | /bin/bash</div>
<div class="callout warn">Default splitting collapses runs of whitespace and ignores leading spaces — which is why <code>awk '{print \$3}'</code> works on <code>ls -l</code> where <code>cut -d' ' -f3</code> fails (Lesson 3.4). But the moment you set <code>-F,</code>, that friendliness stops: two commas in a row now mean an empty field, exactly like <code>cut</code>. That is correct for CSV and surprising if you were not expecting it.</div>

<h3>BEGIN and END</h3>
<pre><code>awk 'BEGIN {print "starting"} {n++} END {print n, "lines"}' file.txt</code></pre>
<div class="out">starting
4213 lines</div>
<p><code>BEGIN</code> runs once before any input, <code>END</code> once after the last line. Variables survive between lines and are initialised to zero or empty, so <code>n++</code> needs no declaration. That is the whole basis of aggregation:</p>
<pre><code><span class="tok-comment"># Sum a column</span>
awk '{sum += \$3} END {print sum}' sales.txt

<span class="tok-comment"># Average, with a guard against dividing by zero</span>
awk '{sum += \$1; n++} END {if (n) print sum/n}' times.txt

<span class="tok-comment"># Min and max in one pass</span>
awk 'NR==1 {min=max=\$1} {if (\$1&lt;min) min=\$1; if (\$1&gt;max) max=\$1} END {print min, max}' n.txt</code></pre>
<div class="out">184320
42.7
3 998</div>

<h3>Associative arrays: grouping without a database</h3>
<p>This is the feature that makes <code>awk</code> worth learning. Arrays are indexed by <em>strings</em>, created on first use:</p>
<pre><code><span class="tok-comment"># Count requests per IP — the sort|uniq -c pipeline, in one pass and unsorted input</span>
awk '{count[\$1]++} END {for (ip in count) print count[ip], ip}' access.log | sort -rn | head

<span class="tok-comment"># Total bytes per status code</span>
awk '{bytes[\$9] += \$10} END {for (s in bytes) printf "%s %d\\n", s, bytes[s]}' access.log

<span class="tok-comment"># Requests per hour, from the timestamp field</span>
awk -F'[:[]' '{hits[\$3]++} END {for (h in hits) print h, hits[h]}' access.log | sort -n</code></pre>
<div class="out">4821 203.0.113.45
1109 198.51.100.7

200 184320944
404 8821
500 1204</div>
<div class="callout"><code>sort | uniq -c</code> must sort the whole input first — on a 4 GB log that means spilling to disk. The awk version keeps a hash table of only the distinct keys and reads the file exactly once. Measured on a 2.1 GB access log: 41 s for the sort pipeline, 9 s for awk. When the number of distinct keys is small and the input is large, awk wins by a wide margin.</div>

<h3>printf: controlling the output</h3>
<pre><code>awk '{printf "%-20s %8.2f\\n", \$1, \$2}' data.txt   <span class="tok-comment"># left-pad, right-align, 2 decimals</span>
awk '{printf "%5d %s\\n", NR, \$0}' file.txt         <span class="tok-comment"># numbered, aligned</span></code></pre>
<div class="out">deploy                 142.50
postgres              1841.09
redis                   12.75</div>
<p><code>print</code> adds a newline; <code>printf</code> does not, so you write <code>\\n</code> yourself. The format codes are C's: <code>%s</code> string, <code>%d</code> integer, <code>%f</code> float, <code>%-20s</code> left-justified in 20 columns, <code>%8.2f</code> eight wide with two decimals.</p>

<h3>Conditions and multiple rules</h3>
<pre><code>awk '\$3 &gt; 100 &amp;&amp; \$1 ~ /^203\\./ {print}' access.log     <span class="tok-comment"># ~ is "matches regex"</span>
awk '\$1 !~ /^#/ {print}' config.ini                    <span class="tok-comment"># !~ is "does not match"</span>

<span class="tok-comment"># Several rules run in order against every line</span>
awk '
  /ERROR/ { errors++ }
  /WARN/  { warnings++ }
  END     { print errors+0, "errors,", warnings+0, "warnings" }
' app.log</code></pre>
<div class="out">37 errors, 214 warnings</div>
<p>The <code>+0</code> is a small idiom worth stealing: if no line matched, <code>errors</code> is the empty string and would print as blank. Adding zero forces it into a number, so you get <code>0</code> instead of nothing.</p>

<h3>Recipes worth keeping</h3>
<pre><code><span class="tok-comment"># Print a specific column range</span>
awk '{for(i=3;i&lt;=NF;i++) printf "%s ", \$i; print ""}' file.txt

<span class="tok-comment"># Deduplicate WITHOUT sorting — and preserve the original order</span>
awk '!seen[\$0]++' file.txt

<span class="tok-comment"># Lines between two markers, exclusive</span>
awk '/BEGIN/{f=1;next} /END/{f=0} f' file.txt

<span class="tok-comment"># Sum disk usage per top-level directory</span>
du -s */ | awk '{gsub(/\\//,"",\$2); print \$2, \$1/1024 "MB"}'

<span class="tok-comment"># Which processes are using the most memory</span>
ps aux | awk 'NR&gt;1 {mem[\$11] += \$6} END {for (p in mem) print mem[p]/1024 "MB", p}' | sort -rn | head -5</code></pre>
<div class="out">$ awk '!seen[\$0]++' dupes.txt
apple
banana
cherry</div>
<div class="callout ok"><code>awk '!seen[\$0]++'</code> is the most-copied awk one-liner in existence, and it is worth understanding rather than memorising. <code>seen[\$0]++</code> returns the count <em>before</em> incrementing — 0 the first time a line appears, which <code>!</code> turns into true, which triggers the implicit print. Every subsequent time it returns 1 or more, which negates to false. The result is <code>sort -u</code> without the sorting, in one pass, with input order preserved.</div>

<h3>Which awk are you running?</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>gawk</code></span><span class="v">GNU awk. The default on most Linux distributions. Has <code>gensub()</code>, <code>asort()</code>, true multidimensional arrays, and <code>-i inplace</code>.</span></div>
  <div class="kv"><span class="k"><code>mawk</code></span><span class="v">Debian and Ubuntu's default <code>awk</code>. Considerably faster, but lacks the gawk extensions — a script using <code>gensub()</code> fails here with a confusing error.</span></div>
  <div class="kv"><span class="k"><code>BSD awk</code></span><span class="v">macOS. The most limited. Anything beyond POSIX awk may not work.</span></div>
</div>
<p>Everything in this lesson is POSIX awk and runs everywhere. If you reach for a gawk extension in a script that ships to a server, check <code>awk --version</code> there first, or invoke <code>gawk</code> explicitly.</p>

<h3>When to stop using awk</h3>
<p>Roughly when the program stops fitting on one screen. awk has no real data structures beyond the associative array, no modules, and error handling that amounts to hoping. If you are writing nested functions, parsing quoted CSV fields, or handling multi-line records, the honest answer is a Python script — and the fact that awk <em>could</em> do it is not an argument that it should.</p>

<a class="link-card" href="https://www.gnu.org/software/gawk/manual/gawk.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">GNU Awk User's Guide</span><span class="lc-sub">One of the best-written manuals in all of GNU. The first four chapters are a genuine tutorial, not a reference dump.</span></span>
</a>
<a class="link-card" href="https://ferd.ca/awk-in-20-minutes.html" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">Awk in 20 Minutes</span><span class="lc-sub">Exactly what it says. If this lesson moved too fast, read this first — it covers the same model with different examples.</span></span>
</a>
<a class="link-card" href="https://github.com/learnbyexample/learn_gnuawk" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">learn_gnuawk — book with exercises</span><span class="lc-sub">Free, exercise-driven, and each chapter has solutions. The best way to actually retain awk rather than re-Googling it.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: aggregate a log with awk</span><span class="lc-sub">Graded tasks on fields, <code>NR</code>/<code>NF</code>, associative arrays and <code>END</code> blocks, against a real nginx access log.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> quoting. The awk program must be in <strong>single</strong> quotes, because <code>\$1</code> means "field 1" to awk and "shell variable 1" to bash. <code>awk "{print \$1}"</code> in double quotes lets the shell substitute first, so awk receives <code>{print }</code> and prints blank lines — no error, just empty output. To pass a shell variable in properly, use <code>-v</code>: <code>awk -v threshold="\$limit" '\$3 &gt; threshold' file</code>. Never build an awk program by string interpolation.</div>
<p class="note-ct"><strong>Learn it in this order and you will have 95% of the value in an hour:</strong> <code>{print \$1}</code>, then <code>-F</code>, then <code>NR</code>/<code>NF</code>, then <code>END {}</code> with a counter, then associative arrays. Everything after that is refinement. And when a pipeline of four small tools starts needing a fifth, that is usually the moment awk replaces all five.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.6</span>
<h2>awk: cả một ngôn ngữ gói trong một dòng</h2>
<p class="lead"><code>awk</code> là một ngôn ngữ lập trình đầy đủ — biến, mảng, hàm, số học, cấu trúc điều khiển — được thiết kế quanh đúng một giả định: đầu vào của bạn là những dòng gồm nhiều trường. Giả định đó đúng đủ thường xuyên tới mức một dòng <code>awk</code> thay được cả một script mà lẽ ra bạn phải viết bằng Python. Bạn không cần học cả ngôn ngữ. Bạn cần cái mô hình và chừng sáu cấu trúc.</p>

<h3>Mô hình: mẫu { hành động }</h3>
<pre><code>awk 'MẪU { HÀNH ĐỘNG }' file</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Đọc</span><span class="lz-t">một dòng, cắt thành các trường</span><span class="lz-d">Mặc định cắt theo chuỗi khoảng trắng. \$1 là trường đầu, \$2 là trường hai, \$0 là cả dòng.</span></div>
  <div class="lz-step"><span class="lz-k">Thử</span><span class="lz-t">dòng này có khớp MẪU không?</span><span class="lz-d">Một regex, một phép so sánh, hoặc không gì cả — mẫu rỗng khớp mọi dòng.</span></div>
  <div class="lz-step"><span class="lz-k">Làm</span><span class="lz-t">chạy HÀNH ĐỘNG</span><span class="lz-d">Bỏ trống thì awk in cả dòng ra. Nên chỉ viết mỗi cái mẫu là nó hành xử như grep.</span></div>
  <div class="lz-step"><span class="lz-k">Lặp</span><span class="lz-t">dòng kế, cho tới hết file</span><span class="lz-d">Rồi chạy khối END nếu có. Biến sống sót qua các dòng — chính điều này làm cho việc cộng dồn khả thi.</span></div>
</div>

<pre><code>awk '{print \$1}' access.log         <span class="tok-comment"># không có mẫu: mọi dòng</span>
awk '/ERROR/' app.log               <span class="tok-comment"># không có hành động: in dòng khớp, như grep</span>
awk '/ERROR/ {print \$5}' app.log    <span class="tok-comment"># có cả hai</span>
awk '\$3 &gt; 100 {print \$1, \$3}' d.txt <span class="tok-comment"># một phép so sánh số dùng làm mẫu</span></code></pre>
<div class="out">203.0.113.45
198.51.100.7</div>

<h3>Trường, và các biến dựng sẵn</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>\$1 \$2 \$3</code></span><span class="v">Các trường, đánh số từ 1. <code>\$0</code> là cả dòng.</span></div>
  <div class="kv"><span class="k"><code>NF</code></span><span class="v">Số trường trên dòng này. Do đó <code>\$NF</code> là trường CUỐI CÙNG, và <code>\$(NF-1)</code> là trường kề trước nó.</span></div>
  <div class="kv"><span class="k"><code>NR</code></span><span class="v">Số thứ tự bản ghi — chính là số dòng hiện tại, đếm xuyên qua mọi file đầu vào.</span></div>
  <div class="kv"><span class="k"><code>FNR</code></span><span class="v">Số dòng TRONG FILE HIỆN TẠI. Chỉ khác NR khi bạn truyền vào nhiều file.</span></div>
  <div class="kv"><span class="k"><code>FS</code> <code>OFS</code></span><span class="v">Dấu phân cách trường đầu vào và đầu ra. <code>-F,</code> là cách viết tắt để đặt FS.</span></div>
  <div class="kv"><span class="k"><code>FILENAME</code></span><span class="v">File đang được đọc. Hữu ích khi xử lý nhiều file một lượt.</span></div>
</div>
<pre><code>awk '{print NR, \$0}' file.txt           <span class="tok-comment"># đánh số mọi dòng</span>
awk '{print \$NF}' access.log            <span class="tok-comment"># trường cuối, bất kể nó ở vị trí nào</span>
awk 'NF' file.txt                       <span class="tok-comment"># NF bằng 0 trên dòng trống → xoá chúng đi</span>
awk 'NR &gt; 1' data.csv                   <span class="tok-comment"># bỏ qua dòng tiêu đề</span>
awk 'NR % 10 == 0' huge.log             <span class="tok-comment"># lấy mẫu cứ 10 dòng một</span></code></pre>
<div class="callout ok"><code>awk 'NF'</code> là một kiệt tác nhỏ: cái mẫu chính là số trường, awk coi 0 là sai, nên dòng trống bị loại còn mọi dòng khác được in ra bởi hành động ngầm định. Ba ký tự thay cho cả <code>grep -v '^\$'</code>.</div>

<h3>Dấu phân cách</h3>
<pre><code>awk -F, '{print \$2}' data.csv           <span class="tok-comment"># phân cách bằng dấu phẩy</span>
awk -F: '{print \$1, \$7}' /etc/passwd    <span class="tok-comment"># dấu hai chấm</span>
awk -F'\\t' '{print \$3}' data.tsv        <span class="tok-comment"># tab</span>
awk -F'[,;]' '{print \$2}' mixed.txt      <span class="tok-comment"># FS là một REGEX: dấu phẩy hoặc chấm phẩy</span>
awk 'BEGIN{OFS=" | "} {print \$1, \$2}' f <span class="tok-comment"># đổi dấu phân cách ĐẦU RA</span></code></pre>
<div class="out">root | /bin/bash
deploy | /bin/bash</div>
<div class="callout warn">Cách cắt mặc định gộp các chuỗi khoảng trắng lại và bỏ qua dấu cách đứng đầu — và đó là lý do <code>awk '{print \$3}'</code> chạy được trên <code>ls -l</code> trong khi <code>cut -d' ' -f3</code> thì hỏng (Bài 3.4). Nhưng ngay khi bạn đặt <code>-F,</code>, sự tử tế đó chấm dứt: hai dấu phẩy liền nhau giờ nghĩa là một trường rỗng, y hệt <code>cut</code>. Điều đó ĐÚNG với CSV và gây bất ngờ nếu bạn không lường trước.</div>

<h3>BEGIN và END</h3>
<pre><code>awk 'BEGIN {print "bắt đầu"} {n++} END {print n, "dòng"}' file.txt</code></pre>
<div class="out">bắt đầu
4213 dòng</div>
<p><code>BEGIN</code> chạy một lần trước khi có đầu vào nào, <code>END</code> chạy một lần sau dòng cuối cùng. Biến sống sót giữa các dòng và được khởi tạo bằng 0 hoặc chuỗi rỗng, nên <code>n++</code> chẳng cần khai báo gì. Đó là toàn bộ nền tảng của việc cộng dồn:</p>
<pre><code><span class="tok-comment"># Cộng một cột</span>
awk '{sum += \$3} END {print sum}' sales.txt

<span class="tok-comment"># Trung bình, có chốt chặn phép chia cho 0</span>
awk '{sum += \$1; n++} END {if (n) print sum/n}' times.txt

<span class="tok-comment"># Nhỏ nhất và lớn nhất trong một lượt đọc</span>
awk 'NR==1 {min=max=\$1} {if (\$1&lt;min) min=\$1; if (\$1&gt;max) max=\$1} END {print min, max}' n.txt</code></pre>
<div class="out">184320
42.7
3 998</div>

<h3>Mảng liên kết: nhóm dữ liệu mà không cần cơ sở dữ liệu</h3>
<p>Đây là tính năng làm cho <code>awk</code> đáng học. Mảng được đánh chỉ số bằng <em>CHUỖI</em>, và được tạo ra ngay lần dùng đầu tiên:</p>
<pre><code><span class="tok-comment"># Đếm lượt gọi theo IP — chính chuỗi sort|uniq -c, nhưng một lượt đọc và không cần sắp xếp đầu vào</span>
awk '{count[\$1]++} END {for (ip in count) print count[ip], ip}' access.log | sort -rn | head

<span class="tok-comment"># Tổng số byte theo mã trạng thái</span>
awk '{bytes[\$9] += \$10} END {for (s in bytes) printf "%s %d\\n", s, bytes[s]}' access.log

<span class="tok-comment"># Lượt gọi theo giờ, lấy từ trường dấu thời gian</span>
awk -F'[:[]' '{hits[\$3]++} END {for (h in hits) print h, hits[h]}' access.log | sort -n</code></pre>
<div class="out">4821 203.0.113.45
1109 198.51.100.7

200 184320944
404 8821
500 1204</div>
<div class="callout"><code>sort | uniq -c</code> phải sắp xếp toàn bộ đầu vào trước — trên một file log 4 GB nghĩa là phải tràn ra đĩa. Bản awk chỉ giữ một bảng băm gồm những khoá khác nhau và đọc file đúng một lần. Đo trên một access log 2,1 GB: 41 giây cho chuỗi ống có sort, 9 giây cho awk. Khi số khoá khác nhau ít mà đầu vào lớn, awk thắng cách biệt rất xa.</div>

<h3>printf: điều khiển cách in ra</h3>
<pre><code>awk '{printf "%-20s %8.2f\\n", \$1, \$2}' data.txt   <span class="tok-comment"># đệm trái, căn phải, 2 số lẻ</span>
awk '{printf "%5d %s\\n", NR, \$0}' file.txt         <span class="tok-comment"># đánh số, căn thẳng hàng</span></code></pre>
<div class="out">deploy                 142.50
postgres              1841.09
redis                   12.75</div>
<p><code>print</code> tự thêm ký tự xuống dòng; <code>printf</code> thì không, nên bạn tự viết <code>\\n</code>. Các mã định dạng là của C: <code>%s</code> chuỗi, <code>%d</code> số nguyên, <code>%f</code> số thực, <code>%-20s</code> căn trái trong 20 cột, <code>%8.2f</code> rộng tám cột với hai số lẻ.</p>

<h3>Điều kiện và nhiều luật cùng lúc</h3>
<pre><code>awk '\$3 &gt; 100 &amp;&amp; \$1 ~ /^203\\./ {print}' access.log     <span class="tok-comment"># ~ nghĩa là "khớp regex"</span>
awk '\$1 !~ /^#/ {print}' config.ini                    <span class="tok-comment"># !~ nghĩa là "không khớp"</span>

<span class="tok-comment"># Nhiều luật chạy lần lượt trên MỌI dòng</span>
awk '
  /ERROR/ { errors++ }
  /WARN/  { warnings++ }
  END     { print errors+0, "lỗi,", warnings+0, "cảnh báo" }
' app.log</code></pre>
<div class="out">37 lỗi, 214 cảnh báo</div>
<p>Cái <code>+0</code> là một lối viết nhỏ đáng lấy về dùng: nếu không dòng nào khớp thì <code>errors</code> là chuỗi rỗng và sẽ in ra khoảng trắng. Cộng thêm 0 ép nó thành một con số, nên bạn nhận được <code>0</code> thay vì không gì cả.</p>

<h3>Những công thức đáng giữ</h3>
<pre><code><span class="tok-comment"># In một khoảng cột</span>
awk '{for(i=3;i&lt;=NF;i++) printf "%s ", \$i; print ""}' file.txt

<span class="tok-comment"># Khử trùng mà KHÔNG sắp xếp — và giữ nguyên thứ tự gốc</span>
awk '!seen[\$0]++' file.txt

<span class="tok-comment"># Các dòng nằm giữa hai dấu mốc, không lấy chính hai dòng mốc</span>
awk '/BEGIN/{f=1;next} /END/{f=0} f' file.txt

<span class="tok-comment"># Cộng dung lượng đĩa theo từng thư mục cấp một</span>
du -s */ | awk '{gsub(/\\//,"",\$2); print \$2, \$1/1024 "MB"}'

<span class="tok-comment"># Tiến trình nào đang ngốn nhiều bộ nhớ nhất</span>
ps aux | awk 'NR&gt;1 {mem[\$11] += \$6} END {for (p in mem) print mem[p]/1024 "MB", p}' | sort -rn | head -5</code></pre>
<div class="out">$ awk '!seen[\$0]++' dupes.txt
apple
banana
cherry</div>
<div class="callout ok"><code>awk '!seen[\$0]++'</code> là dòng awk được chép lại nhiều nhất trên đời, và nó đáng để HIỂU chứ không phải để học thuộc. <code>seen[\$0]++</code> trả về số đếm <em>TRƯỚC KHI</em> tăng — bằng 0 ở lần đầu một dòng xuất hiện, và <code>!</code> biến 0 thành đúng, kích hoạt hành động in ngầm định. Mọi lần sau nó trả về 1 trở lên, phủ định thành sai. Kết quả là <code>sort -u</code> mà không cần sắp xếp, trong một lượt đọc, và giữ nguyên thứ tự đầu vào.</div>

<h3>Bạn đang chạy awk nào?</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>gawk</code></span><span class="v">awk của GNU. Mặc định trên phần lớn bản phân phối Linux. Có <code>gensub()</code>, <code>asort()</code>, mảng nhiều chiều thật sự, và <code>-i inplace</code>.</span></div>
  <div class="kv"><span class="k"><code>mawk</code></span><span class="v"><code>awk</code> mặc định của Debian và Ubuntu. Nhanh hơn đáng kể, nhưng thiếu các phần mở rộng của gawk — một script dùng <code>gensub()</code> sẽ chết ở đây với một thông báo lỗi khó hiểu.</span></div>
  <div class="kv"><span class="k"><code>BSD awk</code></span><span class="v">Trên macOS. Hạn chế nhất. Bất cứ thứ gì vượt ra ngoài awk chuẩn POSIX đều có thể không chạy.</span></div>
</div>
<p>Mọi thứ trong bài này đều là awk chuẩn POSIX và chạy được ở mọi nơi. Nếu bạn với tay lấy một phần mở rộng của gawk trong script sẽ đem lên máy chủ, hãy kiểm <code>awk --version</code> ở đó trước, hoặc gọi thẳng <code>gawk</code>.</p>

<h3>Khi nào nên thôi dùng awk</h3>
<p>Đại khái là khi chương trình thôi vừa một màn hình. awk không có cấu trúc dữ liệu thật nào ngoài mảng liên kết, không có mô-đun, và cách xử lý lỗi thì gần như chỉ là cầu mong. Nếu bạn đang viết hàm lồng nhau, phân tích trường CSV có dấu nháy, hay xử lý bản ghi trải nhiều dòng, câu trả lời trung thực là một script Python — và việc awk <em>CÓ THỂ</em> làm được không phải là lý lẽ cho rằng nó NÊN làm.</p>

<a class="link-card" href="https://www.gnu.org/software/gawk/manual/gawk.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">GNU Awk User's Guide</span><span class="lc-sub">Một trong những bộ hướng dẫn viết hay nhất của cả GNU. Bốn chương đầu là một bài học thật sự, không phải một bãi tra cứu.</span></span>
</a>
<a class="link-card" href="https://ferd.ca/awk-in-20-minutes.html" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">Awk in 20 Minutes</span><span class="lc-sub">Đúng như tên gọi. Nếu bài này đi hơi nhanh, hãy đọc cái này trước — nó phủ cùng một mô hình bằng những ví dụ khác.</span></span>
</a>
<a class="link-card" href="https://github.com/learnbyexample/learn_gnuawk" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">learn_gnuawk — sách kèm bài tập</span><span class="lc-sub">Miễn phí, dẫn dắt bằng bài tập, và mỗi chương đều có lời giải. Cách tốt nhất để thật sự nhớ awk thay vì tra Google lại từ đầu mỗi lần.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: cộng dồn một file log bằng awk</span><span class="lc-sub">Bài chấm điểm về trường, <code>NR</code>/<code>NF</code>, mảng liên kết và khối <code>END</code>, trên một access log nginx thật.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> dấu nháy. Chương trình awk PHẢI nằm trong nháy <strong>ĐƠN</strong>, vì <code>\$1</code> nghĩa là "trường 1" với awk và là "biến shell số 1" với bash. Viết <code>awk "{print \$1}"</code> trong nháy kép thì shell thay thế trước, nên awk nhận được <code>{print }</code> và in ra những dòng trống — không báo lỗi, chỉ là kết quả rỗng. Muốn truyền một biến shell vào cho đúng, hãy dùng <code>-v</code>: <code>awk -v nguong="\$limit" '\$3 &gt; nguong' file</code>. Đừng bao giờ dựng một chương trình awk bằng cách nối chuỗi.</div>
<p class="note-ct"><strong>Học theo thứ tự này thì trong một tiếng bạn có 95% giá trị:</strong> <code>{print \$1}</code>, rồi <code>-F</code>, rồi <code>NR</code>/<code>NF</code>, rồi <code>END {}</code> với một biến đếm, rồi mảng liên kết. Mọi thứ sau đó là tinh chỉnh. Và khi một chuỗi bốn công cụ nhỏ bắt đầu cần tới cái thứ năm, đó thường là khoảnh khắc awk thay được cả năm.</p>
</div>
`,
    },
    /* ─────────────────────────── 3.7 Quiz ─────────────────────────── */
    {
      title: '3.7 — Chapter 3 quiz|||3.7 — Kiểm tra Chương 3',
      slug: 'lnx-3-7-quiz',
      type: 'QUIZ',
      description: 'Tám câu về thứ tự 2>&1, sort file > file, ống dẫn chạy song song, pipefail, bẫy shell con, uniq cần sort, cờ g của sed, và dấu nháy quanh chương trình awk.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on streams, pipes and the three text tools. Answer from memory; they follow the lesson order.</p>
<div class="callout ok">Aim for 7/8. The three that matter most in real work: the <code>2&gt;&amp;1</code> ordering (3.1), why a pipeline's <code>while</code> loop loses its variables (3.2), and why <code>uniq</code> needs <code>sort</code> in front of it (3.4).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về các dòng chuẩn, ống dẫn và ba công cụ văn bản. Trả lời bằng trí nhớ; các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Ba câu quan trọng nhất trong việc thật: thứ tự của <code>2&gt;&amp;1</code> (bài 3.1), vì sao vòng <code>while</code> trong một chuỗi ống đánh mất biến của nó (bài 3.2), và vì sao <code>uniq</code> cần <code>sort</code> đứng trước (bài 3.4).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Why does "make 2>&1 > build.log" fail to capture errors into the file?|||Vì sao "make 2>&1 > build.log" KHÔNG bắt được lỗi vào file?',
            options: [
              'Because 2>&1 must always come first to be valid syntax|||Vì 2>&1 luôn phải đứng đầu thì cú pháp mới hợp lệ',
              'Because redirections apply left to right: fd 2 is aimed at the terminal (where fd 1 points at that moment), and only afterwards is fd 1 moved to the file|||Vì các phép chuyển hướng áp dụng từ trái sang phải: fd 2 được chĩa vào terminal (nơi fd 1 đang trỏ lúc đó), rồi SAU ĐÓ fd 1 mới được dời sang file',
              'Because make writes errors to fd 3, not fd 2|||Vì make ghi lỗi ra fd 3 chứ không phải fd 2',
              'It does capture them; the file just has to be flushed first|||Nó có bắt được; chỉ là file phải được xả bộ đệm trước đã',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Running "sort names.txt > names.txt" leaves the file empty. Why?|||Chạy "sort names.txt > names.txt" làm file rỗng đi. Vì sao?',
            options: [
              'sort has a bug when input and output are the same file|||sort có lỗi khi đầu vào và đầu ra là cùng một file',
              'The shell sets up the redirection FIRST, truncating the file to zero bytes, and only then starts sort — which reads an empty file|||Shell dựng phép chuyển hướng TRƯỚC, cắt file về 0 byte, rồi mới khởi động sort — và sort đọc một file rỗng',
              'sort writes its output before it finishes reading|||sort ghi kết quả ra trước khi nó đọc xong',
              'The file is locked, so the write silently fails|||File bị khoá, nên lệnh ghi thất bại trong im lặng',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why does "grep pattern 10GB.log | head -5" return almost instantly?|||Vì sao "grep pattern 10GB.log | head -5" trả về gần như tức thì?',
            options: [
              'grep reads the file backwards from the end|||grep đọc file ngược từ cuối lên',
              'head tells grep in advance that it only needs 5 lines|||head báo trước cho grep rằng nó chỉ cần 5 dòng',
              'Both run concurrently; head exits after 5 lines, so grep gets SIGPIPE on its next write and dies — the file is never fully read|||Cả hai chạy song song; head thoát sau 5 dòng, nên grep lãnh SIGPIPE ở lần ghi kế tiếp rồi chết — file không bao giờ được đọc hết',
              'The pipe caches the file in memory after the first run|||Ống dẫn lưu tạm file vào bộ nhớ sau lần chạy đầu',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'After "count=0; cat f | while read -r l; do count=$((count+1)); done", echo "$count" prints 0. Why?|||Sau "count=0; cat f | while read -r l; do count=$((count+1)); done", lệnh echo "$count" in ra 0. Vì sao?',
            options: [
              'read -r cannot modify variables|||read -r không sửa được biến',
              'Each stage of a pipeline runs in its own subshell, so the loop incremented a copy in a child process that then exited|||Mỗi khâu của chuỗi ống chạy trong shell con riêng, nên vòng lặp tăng một bản sao nằm trong tiến trình con, và tiến trình đó đã thoát',
              'count must be declared with export first|||count phải được khai báo bằng export trước đã',
              'The arithmetic syntax $(( )) does not work inside while loops|||Cú pháp số học $(( )) không chạy được bên trong vòng while',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why must "sort" come before "uniq -c" in a counting pipeline?|||Vì sao "sort" phải đứng trước "uniq -c" trong một chuỗi ống dùng để đếm?',
            options: [
              'uniq only collapses ADJACENT identical lines, so unsorted input silently under-counts|||uniq chỉ gộp những dòng giống nhau NẰM KỀ NHAU, nên đầu vào chưa sắp xếp sẽ âm thầm đếm thiếu',
              'uniq requires its input to be a file, and sort creates one|||uniq đòi đầu vào phải là một file, còn sort thì tạo ra một file',
              'uniq errors out on unsorted input|||uniq báo lỗi khi đầu vào chưa sắp xếp',
              'It does not matter; the order is only a convention|||Chuyện đó không quan trọng; thứ tự chỉ là quy ước',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'echo "cat cat cat" | sed \'s/cat/dog/\' prints "dog cat cat". Why not three dogs?|||echo "cat cat cat" | sed \'s/cat/dog/\' in ra "dog cat cat". Vì sao không phải ba con dog?',
            options: [
              'sed stops after the first line of input|||sed dừng lại sau dòng đầu tiên của đầu vào',
              'Without the g flag, s replaces only the FIRST match on each line|||Không có cờ g, lệnh s chỉ thay lần khớp ĐẦU TIÊN trên mỗi dòng',
              'sed needs -E to replace repeated words|||sed cần -E mới thay được từ lặp lại',
              'The pattern must be anchored with ^ to repeat|||Cái mẫu phải được neo bằng ^ thì mới lặp được',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does awk \'!seen[$0]++\' do?|||awk \'!seen[$0]++\' làm gì?',
            options: [
              'Prints only lines that appear more than once|||Chỉ in những dòng xuất hiện nhiều hơn một lần',
              'Counts the lines and prints the total at the end|||Đếm số dòng rồi in tổng ở cuối',
              'Removes duplicate lines in one pass WITHOUT sorting, preserving the original order|||Loại bỏ dòng trùng trong một lượt đọc mà KHÔNG cần sắp xếp, giữ nguyên thứ tự gốc',
              'Sorts the input and removes duplicates, like sort -u|||Sắp xếp đầu vào rồi loại trùng, giống sort -u',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'Why must an awk program be wrapped in SINGLE quotes?|||Vì sao chương trình awk phải bọc trong nháy ĐƠN?',
            options: [
              'awk cannot parse double-quoted programs at all|||awk hoàn toàn không phân tích được chương trình đặt trong nháy kép',
              'Because $1 means "field 1" to awk but "shell positional parameter 1" to bash — double quotes let the shell substitute it away first, and awk silently prints blanks|||Vì $1 nghĩa là "trường 1" với awk nhưng là "tham số vị trí 1 của shell" với bash — nháy kép để shell thay thế mất nó trước, và awk âm thầm in ra dòng trống',
              'Single quotes make awk run faster|||Nháy đơn làm awk chạy nhanh hơn',
              'It is only a style convention; both behave identically|||Đó chỉ là quy ước hình thức; cả hai hành xử y hệt nhau',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
