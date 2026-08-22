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
  ],
};
