/**
 * Linux & Bash — Chương 3: Văn bản, ống dẫn & chuyển hướng.
 * Ba dòng chuẩn · ống dẫn · grep · bộ công cụ nhỏ · sed · awk · quiz.
 * Output CHẠY THẬT Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Nâng cấp 28/09/2026: bài 3.0 slide (deck lx-03, 32 slide) + slide/🧪/🗂/📌 trong 3.1–3.6; đào sâu: /proc/self/fd,
 * bảng toán tử chuyển hướng, bảng cờ xargs/grep/sort/sed/awk, "Chạy thử từng bước" + "macOS/WSL khác gì" mỗi bài;
 * bổ sung diff/cmp/patch và comm/paste/join/column đào sâu (3.4), hàm chuỗi awk; quiz 10 câu.
 * Sửa chỗ SAI: `sponge < f` (3.1), PIPESTATUS/pipefail của curl (3.2), awk trong nháy kép in CẢ dòng chứ không in dòng trống (3.6).
 * Output MỚI chạy thật trong container ubuntu:24.04 (arm64, mawk là awk), trên Fedora 44 và Mac M1 (macOS 27).
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Flinux-bash%2Flearn&reflabel=Linux%20%26%20Bash';

export default {
  title: 'Chapter 3 — Text, pipes & redirection|||Chương 3 — Văn bản, ống dẫn & chuyển hướng',
  description: 'Ý tưởng làm nên Unix: công cụ nhỏ, mỗi cái làm một việc, nối lại bằng ống dẫn. Ba dòng chuẩn và mọi cách chuyển hướng chúng; ống dẫn và những gì thật sự chảy qua đó; grep, cut/sort/uniq/tr, sed và awk — đủ sâu để bạn thôi phải mở trình soạn thảo cho những việc mà một dòng lệnh làm được.',
  lessons: [
    /* ─────────────────────────── 3.0 ─────────────────────────── */
    {
      title: '3.0 — Chapter 3 slides: streams, pipes and text tools in pictures|||3.0 — Slide Chương 3: dòng chuẩn, ống dẫn và công cụ văn bản bằng hình',
      slug: 'lnx-3-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 32 slide của Chương 3: ba "dây" fd 0/1/2 và thứ tự của 2>&1 vẽ từng bước, ống dẫn chạy song song và SIGPIPE, pipefail, shell con, xargs, ba phương ngữ regex và grep trên macOS, cut/sort/uniq/comm/paste/join/diff, sed và awk, cùng bảng tra nhanh hai trang.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Slides</span>
<h2>The whole chapter in 32 slides</h2>
<p class="lead">This is the longest chapter of the course, so skim the pictures first. Every slide reappears inside the lesson that explains it: the three wires every process is born with, the file-descriptor table redrawn step by step for <code>&gt; f 2&gt;&amp;1</code> and for the wrong order, two processes sharing a kernel pipe buffer, a regex read piece by piece, <code>comm</code>'s three columns, a <code>sed</code> command and an nginx log line taken apart field by field.</p>
<p>Slides 3–6 belong to Lesson 3.1, 7–11 to 3.2, 12–15 to 3.3, 16–20 to 3.4 (including the new part on <code>comm</code>, <code>paste</code>, <code>join</code>, <code>column</code> and <code>diff</code>), 21–24 to 3.5 and 25–28 to 3.6. The last four are the chapter's common mistakes, a two-page cheat sheet and a 45-minute practice session. Every terminal is real output recorded on 28/09/2026 in an Ubuntu 24.04 container, on a Fedora 44 machine and on a Mac M1 — the macOS columns show exactly where the same command behaves differently. The slides are in Vietnamese; the code and diagrams read the same in any language.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Slide</span>
<h2>Cả chương trong 32 slide</h2>
<p class="lead">Đây là chương dài nhất của khoá, nên hãy lướt phần hình trước. Mỗi slide đều xuất hiện lại bên trong bài giảng giải thích nó: ba "dây" mà mọi tiến trình mang theo từ lúc sinh ra, bảng bộ mô tả file (file descriptor) vẽ lại từng bước cho <code>&gt; f 2&gt;&amp;1</code> và cho thứ tự sai, hai tiến trình dùng chung một bộ đệm ống của nhân, một regex đọc từng mảnh, ba cột của <code>comm</code>, một lệnh <code>sed</code> và một dòng log nginx được tháo ra từng trường.</p>
<p>Slide 3–6 thuộc Bài 3.1, 7–11 thuộc 3.2, 12–15 thuộc 3.3, 16–20 thuộc 3.4 (gồm cả phần mới về <code>comm</code>, <code>paste</code>, <code>join</code>, <code>column</code> và <code>diff</code>), 21–24 thuộc 3.5 và 25–28 thuộc 3.6. Bốn slide cuối là những sai lầm hay gặp của chương, bảng tra nhanh hai trang và một buổi thực hành 45 phút. Mọi terminal là output THẬT, ghi ngày 28/09/2026 trong container Ubuntu 24.04, trên máy Fedora 44 và trên Mac M1 — cột macOS chỉ đúng chỗ cùng một lệnh hành xử khác đi. Con số trên máy bạn có thể khác (PID, giờ, inode), quy luật thì không.</p>
</div>
${gallery('lx-03', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Ba dây fd 0, 1, 2'], [4, '> làm rỗng file trước khi lệnh chạy'], [5, 'Thứ tự của 2>&1 vẽ từng bước'], [6, 'Heredoc và sudo tee'],
  [7, 'Ống dẫn: hai tiến trình chạy cùng lúc'], [8, 'Mã thoát của chuỗi ống và pipefail'], [9, 'stderr và bẫy bộ đệm'], [10, 'Shell con và thay thế tiến trình'], [11, 'xargs'],
  [12, 'Ba phương ngữ regex'], [13, 'Đọc một regex từng mảnh'], [14, 'Cờ grep và mã thoát 0/1/2'], [15, 'grep trên macOS'],
  [16, 'cut, tr, wc, head/tail'], [17, 'sort và các cờ'], [18, 'sort | uniq -c | sort -rn'], [19, 'comm, paste, join, column'], [20, 'diff -u và cmp'],
  [21, 'Giải phẫu một lệnh sed'], [22, 's///, nhóm và &'], [23, 'Địa chỉ và các lệnh p d i a c q'], [24, 'sed -i trên GNU và macOS'],
  [25, 'awk: các trường của một dòng log'], [26, 'BEGIN và END'], [27, 'Mảng liên kết và !seen[$0]++'], [28, 'Nháy đơn, -v và awk nào'],
  [29, 'Sai lầm hay gặp'], [30, 'Bảng tra nhanh (1/2)'], [31, 'Bảng tra nhanh (2/2)'], [32, 'Thực hành chương 3'],
])}
`,
    },
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

${slide('lx-03', 3, 'Mỗi tiến trình sinh ra với sẵn 3 “dây”: fd 0, 1, 2')}

<div class="callout">The separation of 1 and 2 is a genuine design decision, not an accident. It means <code>grep pattern huge.log | wc -l</code> gives you a clean number on stdout <em>while</em> "Permission denied" still lands on your screen instead of being counted as a line. Every time you have seen an error appear despite a redirect, this is why.</div>

<h3>Seeing the wires for yourself: /proc/self/fd</h3>
<p>This is not a metaphor. On Linux every process has a directory <code>/proc/&lt;PID&gt;/fd</code> with one entry per open file descriptor (fd, a small number standing for one open file), and <code>/proc/self</code> is a shortcut meaning "the process that is reading this path". So <code>ls</code> can show you its own wiring — and how the shell rewired it before it started:</p>
<pre><code class="language-bash">ls -l /proc/self/fd
ls -l /proc/self/fd &gt;out.txt 2&gt;/dev/null; cat out.txt
ls -l /proc/self/fd | cat</code></pre>
<div class="out">lrwx------ 1 an an 64 Sep 28 09:22 0 -&gt; /dev/pts/0
lrwx------ 1 an an 64 Sep 28 09:22 1 -&gt; /dev/pts/0
lrwx------ 1 an an 64 Sep 28 09:22 2 -&gt; /dev/pts/0
…
lrwx------ 1 an an 64 Sep 28 09:22 0 -&gt; /dev/pts/0
l-wx------ 1 an an 64 Sep 28 09:22 1 -&gt; /home/an/thu-linux/ch3/out.txt
l-wx------ 1 an an 64 Sep 28 09:22 2 -&gt; /dev/null
…
l-wx------ 1 an an 64 Sep 28 09:22 1 -&gt; pipe:[2972559]</div>
<p>Three runs of the same program, three different wirings, and <code>ls</code> did nothing differently. <code>/dev/pts/0</code> is your terminal window; <code>l-wx</code> means the descriptor is open for writing only; <code>pipe:[2972559]</code> is a kernel pipe identified by that number. The extra <code>3 -&gt; /proc/…/fd</code> line in each listing (cut here as <code>…</code>) is <code>ls</code> reading the directory itself. Recorded in Ubuntu 24.04; macOS has no <code>/proc</code>, but <code>ls -l /dev/fd/</code> shows the same idea.</p>

<h3>Sending stdout to a file</h3>
<pre><code class="language-bash">ls -l &gt; listing.txt        <span class="tok-comment"># truncate: existing content is destroyed</span>
date &gt;&gt; listing.txt        <span class="tok-comment"># append: add to the end</span>
echo "start" &gt; run.log     <span class="tok-comment"># the usual way to begin a fresh log</span></code></pre>
<div class="callout warn"><code>&gt;</code> truncates the target to zero bytes <strong>before the command runs</strong>, and it does so even if the command then fails or does not exist. <code>badcommand &gt; important.txt</code> leaves you with an empty <code>important.txt</code> and a "command not found". The file was emptied by the shell, not by the command.</div>

<h3>The classic disaster: sort file &gt; file</h3>
${slide('lx-03', 4, '> làm rỗng file TRƯỚC khi lệnh chạy — sort f > f mất sạch')}
<pre><code>sort names.txt &gt; names.txt</code></pre>
<div class="out">$ wc -l names.txt
0 names.txt</div>
<p>The file is now empty, and this catches experienced people. The reason is the ordering above: the shell sets up every redirection <em>first</em>, which truncates <code>names.txt</code> to zero bytes, and only <em>then</em> starts <code>sort</code> — which dutifully reads an empty file and writes nothing. Use a temporary file, or a tool with an explicit in-place flag:</p>
<pre><code class="language-bash">sort names.txt &gt; names.sorted &amp;&amp; mv names.sorted names.txt
sort -o names.txt names.txt      <span class="tok-comment"># sort's own -o handles this correctly</span>
sed -i 's/a/b/' file.txt         <span class="tok-comment"># sed -i edits in place</span>
sort names.txt | sponge names.txt <span class="tok-comment"># from moreutils: absorbs ALL input, then writes the file</span></code></pre>
<p><code>sponge</code> takes the file name as its <em>argument</em> and must sit at the end of the pipeline. A bare <code>sponge &lt; names.txt</code> only copies the file to your screen and changes nothing — checked on Ubuntu 24.04 with the <code>moreutils</code> package.</p>

<h3>Redirecting stderr, and why order matters</h3>
${slide('lx-03', 5, '2>&1 chép địa chỉ fd 1 ngay lúc đó — thứ tự quyết định')}
<pre><code class="language-bash">find / -name "*.conf" 2&gt; errors.txt      <span class="tok-comment"># errors to a file, results to screen</span>
find / -name "*.conf" 2&gt; /dev/null       <span class="tok-comment"># discard the permission-denied noise</span>
make &gt; build.log 2&gt;&amp;1                    <span class="tok-comment"># BOTH into one file</span>
make &amp;&gt; build.log                        <span class="tok-comment"># bash shorthand for the same thing</span></code></pre>
<p>Read <code>2&gt;&amp;1</code> as "make fd 2 point wherever fd 1 currently points". The word <em>currently</em> is the whole lesson:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Correct</span><span class="lz-t">make &gt; build.log 2&gt;&amp;1</span><span class="lz-d">First fd 1 is aimed at build.log. Then fd 2 is aimed where fd 1 points — also build.log. Both captured.</span></div>
  <div class="lz-step"><span class="lz-k">Wrong</span><span class="lz-t">make 2&gt;&amp;1 &gt; build.log</span><span class="lz-d">First fd 2 is aimed where fd 1 points — the TERMINAL. Then fd 1 is moved to build.log. fd 2 still points at the terminal. Errors escape.</span></div>
</div>
<div class="callout ok">Both commands run, neither warns, and the difference only shows up when something fails — usually in CI, at the exact moment you needed the error message. Rule: <strong><code>2&gt;&amp;1</code> goes last.</strong> Or sidestep it entirely with <code>&amp;&gt;</code>, which cannot be written in the wrong order.</div>
<p>Here is the difference on a real command that writes to both streams — <code>ls</code> of one file that exists and one that does not:</p>
<pre><code class="language-bash">ls /etc/hostname /nope &gt; a.log 2&gt;&amp;1
cat a.log
ls /etc/hostname /nope 2&gt;&amp;1 &gt; b.log
cat b.log</code></pre>
<div class="out">$ ls /etc/hostname /nope &gt; a.log 2&gt;&amp;1
$ cat a.log
ls: cannot access '/nope': No such file or directory
/etc/hostname
$ ls /etc/hostname /nope 2&gt;&amp;1 &gt; b.log
ls: cannot access '/nope': No such file or directory
$ cat b.log
/etc/hostname</div>
<p>In the second run the error lands on your terminal the instant you press Enter, and <code>b.log</code> holds only the result. That is exactly the log a CI job would keep — minus the one line you needed.</p>

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
${slide('lx-03', 6, 'Heredoc: nháy quanh EOF quyết định có khai triển — và sudo không nâng quyền cho >')}
<pre><code class="language-bash">cat &lt;&lt;EOF &gt; config.yml
host: localhost
port: \${PORT}
EOF</code></pre>
<p>Everything between <code>&lt;&lt;EOF</code> and a line containing only <code>EOF</code> becomes the command's stdin. Three variants change the behaviour:</p>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>&lt;&lt;EOF</code></span><span class="v">Variables and <code>\$(commands)</code> ARE expanded. Use for templating.</span></div>
  <div class="kv"><span class="k"><code>&lt;&lt;'EOF'</code></span><span class="v">Quoted delimiter: nothing is expanded, the text is passed through byte for byte. Use for scripts, JSON, anything containing a <code>\$</code>.</span></div>
  <div class="kv"><span class="k"><code>&lt;&lt;-EOF</code></span><span class="v">Strips leading TAB characters (not spaces), so the heredoc can be indented inside a function.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Writing a script from a script — MUST be quoted, or \$1 expands now</span>
cat &lt;&lt;'EOF' &gt; deploy.sh
#!/usr/bin/env bash
echo "deploying \$1"
EOF

<span class="tok-comment"># A here-string: one line, no delimiter needed</span>
grep -c ERROR &lt;&lt;&lt; "\$log_text"</code></pre>
<div class="callout">Heredocs are how you write a config file, an SQL statement or a remote command block inside a script without a separate file and without fighting quotes. <code>ssh vps 'bash -s' &lt;&lt;'EOF'</code> sends a whole script to a remote machine to execute — Chapter 9 uses this.</div>

<h3>tee: write to a file AND keep going</h3>
<pre><code class="language-bash">make 2&gt;&amp;1 | tee build.log              <span class="tok-comment"># watch it live, and keep a copy</span>
make 2&gt;&amp;1 | tee -a build.log           <span class="tok-comment"># -a appends instead of truncating</span>
echo 'net.ipv4.ip_forward=1' | sudo tee -a /etc/sysctl.conf</code></pre>
<div class="callout ok">That third line solves a problem people hit constantly: <code>sudo echo x &gt;&gt; /etc/file</code> fails with "Permission denied", because <code>sudo</code> elevates <code>echo</code> but the <em>redirection</em> is performed by your unprivileged shell. <code>tee</code> is a program, so <code>sudo</code> can elevate it, and it does the writing. This is the standard fix.</div>

<h3>Beyond 0, 1 and 2</h3>
<p>File descriptors are just small integers. You can open your own:</p>
<pre><code class="language-bash">exec 3&gt; audit.log            <span class="tok-comment"># open fd 3 pointing at a file</span>
echo "step 1 done" &gt;&amp;3       <span class="tok-comment"># write to it, without touching stdout</span>
exec 3&gt;&amp;-                    <span class="tok-comment"># close it</span></code></pre>
<p>This is how a script keeps a structured audit trail separate from its human-readable output — the log survives even when stdout is piped elsewhere. You will not need it often, but when you do, nothing else does the job.</p>

<h3>noclobber: a seatbelt for &gt;</h3>
<pre><code class="language-bash">set -o noclobber
echo hi &gt; existing.txt</code></pre>
<div class="out">bash: existing.txt: cannot overwrite existing file</div>
<p>With <code>noclobber</code> set, <code>&gt;</code> refuses to truncate a file that already exists; <code>&gt;|</code> forces it when you really mean to. Some people put this in their <code>~/.bashrc</code> permanently. It is a reasonable trade: it costs one extra character on the rare intentional overwrite, and it prevents the accidental one.</p>

<h3>Every redirection operator on one page</h3>
<table>
<tr><th>Operator</th><th>Meaning</th><th>Example</th></tr>
<tr><td><code>&gt;</code></td><td>stdout to a file, truncating it first</td><td><code>ls &gt; list.txt</code></td></tr>
<tr><td><code>&gt;&gt;</code></td><td>stdout, appended to the end</td><td><code>date &gt;&gt; run.log</code></td></tr>
<tr><td><code>2&gt;</code> · <code>2&gt;&gt;</code></td><td>stderr to a file (truncate / append)</td><td><code>find / -name x 2&gt;/dev/null</code></td></tr>
<tr><td><code>2&gt;&amp;1</code></td><td>fd 2 points wherever fd 1 points <em>right now</em></td><td><code>make &gt; build.log 2&gt;&amp;1</code></td></tr>
<tr><td><code>&gt;&amp;2</code></td><td>this command's stdout goes to stderr — how scripts print error messages</td><td><code>echo "missing file" &gt;&amp;2</code></td></tr>
<tr><td><code>&amp;&gt;</code> · <code>&amp;&gt;&gt;</code></td><td>both streams to one file (bash only; <code>&amp;&gt;&gt;</code> needs bash 4+)</td><td><code>make &amp;&gt; build.log</code></td></tr>
<tr><td><code>&gt;|</code></td><td>overwrite even when <code>noclobber</code> is on</td><td><code>echo hi &gt;| a.log</code></td></tr>
<tr><td><code>&lt;</code></td><td>a file into stdin</td><td><code>wc -l &lt; access.log</code></td></tr>
<tr><td><code>&lt;&lt;EOF</code> · <code>&lt;&lt;'EOF'</code> · <code>&lt;&lt;-EOF</code></td><td>heredoc: expanded / literal / leading tabs stripped</td><td><code>cat &lt;&lt;'EOF' &gt; x.sh</code></td></tr>
<tr><td><code>&lt;&lt;&lt;</code></td><td>here-string: one string into stdin</td><td><code>wc -w &lt;&lt;&lt; "a b c"</code> → <code>3</code></td></tr>
<tr><td><code>|</code> · <code>|&amp;</code></td><td>stdout (or both streams, bash 4+) into the next command</td><td><code>make |&amp; grep -i warn</code></td></tr>
<tr><td><code>exec 3&gt; f</code> · <code>exec 3&gt;&amp;-</code></td><td>open / close an extra descriptor for the rest of the script</td><td><code>echo step &gt;&amp;3</code></td></tr>
</table>
<p>Read every row the same way: the number on the left is a descriptor (1 when omitted before <code>&gt;</code>, 0 before <code>&lt;</code>), the thing on the right is where it now points, and the shell works through them <strong>left to right, before the command starts</strong>. Those two facts explain every surprise in this lesson.</p>

<h3>Try it step by step</h3>
<p>Nine commands, in order, in the course sandbox. Type them rather than pasting, and say the output out loud before you press Enter.</p>
<pre><code class="language-bash">mkdir -p ~/thu-linux/ch3 &amp;&amp; cd ~/thu-linux/ch3
printf 'chuoi\\nan\\nbinh\\n' &gt; names.txt
sort names.txt &gt; names.txt; wc -l names.txt
printf 'chuoi\\nan\\nbinh\\n' &gt; names.txt
sort -o names.txt names.txt; cat names.txt
ls /etc/hostname /nope &gt; a.log 2&gt;&amp;1; wc -l a.log
ls /etc/hostname /nope 2&gt;&amp;1 &gt; b.log; wc -l b.log
set -o noclobber; echo hi &gt; a.log; set +o noclobber
wc -l &lt;&lt;&lt; "mot dong"</code></pre>
<div class="out">0 names.txt
an
binh
chuoi
2 a.log
ls: cannot access '/nope': No such file or directory
1 b.log
bash: a.log: cannot overwrite existing file
1</div>
<p>Read the result line by line: the first <code>sort</code> destroyed its own input; <code>sort -o</code> did the same job safely; <code>a.log</code> caught both lines while <code>b.log</code> caught one and the error escaped to the screen; <code>noclobber</code> refused to truncate an existing file; and a here-string is one line of stdin. (Recorded in an interactive bash 5.2 on Ubuntu 24.04, user <code>an</code>.)</p>

<h3>On macOS and WSL: what is different</h3>
<table>
<tr><th>Thing</th><th>Ubuntu / WSL (bash 5)</th><th>Mac: <code>/bin/bash</code> 3.2</th><th>Mac: zsh (default shell)</th></tr>
<tr><td><code>cmd &amp;&gt;&gt; f</code></td><td>works</td><td><code>syntax error near unexpected token &#96;&gt;'</code></td><td>works</td></tr>
<tr><td><code>cmd |&amp; wc -l</code></td><td>works</td><td><code>syntax error near unexpected token &#96;&amp;'</code></td><td>works</td></tr>
<tr><td><code>echo hi &gt; m1 &gt; m2</code></td><td>only <code>m2</code> gets "hi"; <code>m1</code> is left empty</td><td>same as bash 5</td><td><strong>both</strong> files get "hi" (zsh's MULTIOS)</td></tr>
<tr><td><code>/proc/self/fd</code></td><td>exists</td><td>no <code>/proc</code> — use <code>ls -l /dev/fd/</code></td><td>same</td></tr>
</table>
<p>The Mac rows were run for real on macOS 27 (<code>/bin/bash</code> 3.2.57, zsh 5.9). Two practical consequences: a script with a <code>#!/bin/bash</code> shebang that uses <code>|&amp;</code> or <code>&amp;&gt;&gt;</code> will not even parse on a stock Mac, so write <code>2&gt;&amp;1 |</code> and <code>&gt;&gt; f 2&gt;&amp;1</code>, which work everywhere; and a habit learned in zsh (redirecting to two files at once) silently does something different in bash. WSL2 runs a real Ubuntu, so everything behaves exactly as on the VPS.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your SWP391 team's CI log shows "build done" but nobody can find the warning that the compiler definitely printed. Reproduce the problem with a fake build script, then capture the output properly.</p><ol>
<li>Make the fake build (the quoted <code>'EOF'</code> keeps the script exactly as written):
<pre><code class="language-bash">mkdir -p ~/thu-linux/ch3/bt31 &amp;&amp; cd ~/thu-linux/ch3/bt31
cat &lt;&lt;'EOF' &gt; build.sh
#!/usr/bin/env bash
echo "compile ok"
echo "warning: unused variable 'x'" &gt;&amp;2
echo "build done"
EOF
chmod +x build.sh</code></pre></li>
<li>Before running anything, predict the line counts, then check: <code>./build.sh &gt; a.log 2&gt;&amp;1</code>, <code>./build.sh 2&gt;&amp;1 &gt; b.log</code>, <code>wc -l a.log b.log</code>.</li>
<li>Count the lines that reach a pipe: <code>./build.sh 2&gt;/dev/null | wc -l</code> and <code>./build.sh |&amp; wc -l</code>.</li>
<li>Turn on the seatbelt: <code>set -o noclobber</code>, try <code>./build.sh &gt; a.log</code>, then force it with <code>&gt;|</code>, then <code>set +o noclobber</code>.</li>
<li>Keep a log while still filtering live: <code>./build.sh 2&gt;&amp;1 | tee -a run.log | grep -c warning</code>, then <code>wc -l run.log</code>.</li></ol>
<p><strong>Done when:</strong> <code>a.log</code> has 3 lines and <code>b.log</code> 2 (the warning leaked to the screen); the two pipes count 2 and 3; <code>noclobber</code> prints <code>cannot overwrite existing file</code>; <code>grep -c</code> prints <code>1</code> and <code>run.log</code> has 3 lines.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">File descriptor (fd)</span><span class="v">A small number a process uses for an open file, pipe or terminal; 0, 1 and 2 are open from birth.</span></div>
  <div class="kv"><span class="k">stdin / stdout / stderr</span><span class="v">fd 0 (input), fd 1 (results) and fd 2 (errors and diagnostics).</span></div>
  <div class="kv"><span class="k">Redirection</span><span class="v">Re-pointing a descriptor at a file or another descriptor, done by the shell before the command starts.</span></div>
  <div class="kv"><span class="k">Truncate</span><span class="v">Cut a file to zero bytes — what <code>&gt;</code> does the moment the shell opens it.</span></div>
  <div class="kv"><span class="k">Heredoc / here-string</span><span class="v">Multi-line text (<code>&lt;&lt;EOF</code>) or one string (<code>&lt;&lt;&lt;</code>) fed to a command's stdin.</span></div>
  <div class="kv"><span class="k">noclobber</span><span class="v">A shell option that makes <code>&gt;</code> refuse to overwrite an existing file.</span></div>
  <div class="kv"><span class="k">/dev/null</span><span class="v">A device that discards everything written to it and reads as empty.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Every process starts with fd 0, 1 and 2; <code>&gt;</code>, <code>&lt;</code>, <code>2&gt;</code> and <code>|</code> only re-point them, and the program never knows.</li>
<li>The shell performs redirections first, so <code>&gt;</code> empties the file even when the command then fails — <code>sort f &gt; f</code> loses everything.</li>
<li><code>2&gt;&amp;1</code> copies where fd 1 points at that moment: put it last, or use <code>&amp;&gt;</code>.</li>
<li>Quote the heredoc delimiter (<code>&lt;&lt;'EOF'</code>) whenever the text contains <code>\$</code> that must survive.</li>
<li><code>sudo</code> does not elevate your shell's <code>&gt;&gt;</code>; <code>| sudo tee -a file</code> does the writing as root.</li>
<li>Mac's <code>/bin/bash</code> 3.2 has no <code>&amp;&gt;&gt;</code> or <code>|&amp;</code>; the long forms work everywhere.</li>
</ul>


<a class="link-card" href="https://www.gnu.org/software/bash/manual/html_node/Redirections.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Bash Manual — Redirections</span><span class="lc-sub">Every redirection operator in one page, including the fd-duplication forms and process substitution. The reference to bookmark.</span></span>
</a>
<a class="link-card" href="https://mywiki.wooledge.org/BashFAQ/055" target="_blank" rel="noopener">
  <span class="lc-ico">🔧</span>
  <span class="lc-body"><span class="lc-title">BashFAQ — "How can I redirect stdout and stderr?"</span><span class="lc-sub">Walks through the <code>2&gt;&amp;1</code> ordering trap step by step, with the fd table drawn out at each stage.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
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

${slide('lx-03', 3, 'Mỗi tiến trình sinh ra với sẵn 3 “dây”: fd 0, 1, 2')}

<div class="callout">Việc tách 1 và 2 là một quyết định thiết kế thật sự, không phải chuyện tình cờ. Nó khiến <code>grep pattern huge.log | wc -l</code> cho bạn một con số sạch ở stdout <em>TRONG KHI</em> dòng "Permission denied" vẫn hiện lên màn hình thay vì bị đếm thành một dòng kết quả. Mỗi lần bạn thấy một lỗi hiện ra bất chấp đã chuyển hướng, lý do là đây.</div>

<h3>Tận mắt nhìn các dây: /proc/self/fd</h3>
<p>Đây không phải phép ẩn dụ. Trên Linux, mỗi tiến trình có một thư mục <code>/proc/&lt;PID&gt;/fd</code> với mỗi mục là một bộ mô tả file (file descriptor — fd, một con số nhỏ đại diện cho một file đang mở), và <code>/proc/self</code> là lối tắt nghĩa là "chính tiến trình đang đọc đường dẫn này". Vậy nên <code>ls</code> tự cho bạn xem được dây nối của chính nó — và cách shell đã đấu lại dây trước khi nó chạy:</p>
<pre><code class="language-bash">ls -l /proc/self/fd
ls -l /proc/self/fd &gt;out.txt 2&gt;/dev/null; cat out.txt
ls -l /proc/self/fd | cat</code></pre>
<div class="out">lrwx------ 1 an an 64 Sep 28 09:22 0 -&gt; /dev/pts/0
lrwx------ 1 an an 64 Sep 28 09:22 1 -&gt; /dev/pts/0
lrwx------ 1 an an 64 Sep 28 09:22 2 -&gt; /dev/pts/0
…
lrwx------ 1 an an 64 Sep 28 09:22 0 -&gt; /dev/pts/0
l-wx------ 1 an an 64 Sep 28 09:22 1 -&gt; /home/an/thu-linux/ch3/out.txt
l-wx------ 1 an an 64 Sep 28 09:22 2 -&gt; /dev/null
…
l-wx------ 1 an an 64 Sep 28 09:22 1 -&gt; pipe:[2972559]</div>
<p>Ba lần chạy cùng một chương trình, ba kiểu đấu dây khác nhau, và <code>ls</code> không hề làm gì khác đi. <code>/dev/pts/0</code> là cửa sổ terminal của bạn; <code>l-wx</code> nghĩa là bộ mô tả chỉ mở để GHI; <code>pipe:[2972559]</code> là một ống dẫn của nhân mang con số định danh đó. Dòng <code>3 -&gt; /proc/…/fd</code> thừa ra ở mỗi lần (đã cắt thành <code>…</code>) là chính <code>ls</code> đang đọc thư mục. Ghi trên Ubuntu 24.04; macOS không có <code>/proc</code>, nhưng <code>ls -l /dev/fd/</code> cho thấy cùng ý tưởng.</p>

<h3>Đưa stdout vào một file</h3>
<pre><code class="language-bash">ls -l &gt; listing.txt        <span class="tok-comment"># cắt trắng: nội dung cũ bị huỷ</span>
date &gt;&gt; listing.txt        <span class="tok-comment"># nối thêm: ghi vào cuối</span>
echo "start" &gt; run.log     <span class="tok-comment"># cách thường dùng để mở một log mới</span></code></pre>
<div class="callout warn"><code>&gt;</code> cắt file đích về 0 byte <strong>TRƯỚC KHI lệnh chạy</strong>, và nó làm vậy kể cả khi lệnh sau đó thất bại hoặc không hề tồn tại. <code>badcommand &gt; important.txt</code> để lại cho bạn một <code>important.txt</code> rỗng cùng dòng "command not found". File bị làm rỗng bởi SHELL, không phải bởi lệnh.</div>

<h3>Tai nạn kinh điển: sort file &gt; file</h3>
${slide('lx-03', 4, '> làm rỗng file TRƯỚC khi lệnh chạy — sort f > f mất sạch')}
<pre><code>sort names.txt &gt; names.txt</code></pre>
<div class="out">$ wc -l names.txt
0 names.txt</div>
<p>File giờ rỗng, và chuyện này bẫy cả người có kinh nghiệm. Lý do chính là thứ tự vừa nói ở trên: shell dựng mọi chuyển hướng <em>TRƯỚC</em>, tức là cắt <code>names.txt</code> về 0 byte, rồi <em>SAU ĐÓ</em> mới khởi động <code>sort</code> — và <code>sort</code> ngoan ngoãn đọc một file rỗng rồi ghi ra không gì cả. Hãy dùng file tạm, hoặc một công cụ có cờ sửa tại chỗ tường minh:</p>
<pre><code class="language-bash">sort names.txt &gt; names.sorted &amp;&amp; mv names.sorted names.txt
sort -o names.txt names.txt      <span class="tok-comment"># cờ -o của chính sort xử lý đúng chuyện này</span>
sed -i 's/a/b/' file.txt         <span class="tok-comment"># sed -i sửa tại chỗ</span>
sort names.txt | sponge names.txt <span class="tok-comment"># của moreutils: hút HẾT đầu vào rồi mới ghi file</span></code></pre>
<p><code>sponge</code> nhận tên file làm <em>THAM SỐ</em> và phải đứng ở cuối chuỗi ống. Viết trơn <code>sponge &lt; names.txt</code> chỉ chép file ra màn hình và không đổi gì cả — đã kiểm trên Ubuntu 24.04 với gói <code>moreutils</code>.</p>

<h3>Chuyển hướng stderr, và vì sao thứ tự quyết định</h3>
${slide('lx-03', 5, '2>&1 chép địa chỉ fd 1 ngay lúc đó — thứ tự quyết định')}
<pre><code class="language-bash">find / -name "*.conf" 2&gt; errors.txt      <span class="tok-comment"># lỗi vào file, kết quả ra màn hình</span>
find / -name "*.conf" 2&gt; /dev/null       <span class="tok-comment"># vứt bỏ đám nhiễu permission-denied</span>
make &gt; build.log 2&gt;&amp;1                    <span class="tok-comment"># CẢ HAI vào chung một file</span>
make &amp;&gt; build.log                        <span class="tok-comment"># cách viết tắt của bash cho đúng việc đó</span></code></pre>
<p>Hãy đọc <code>2&gt;&amp;1</code> là "cho fd 2 trỏ tới bất cứ đâu mà fd 1 ĐANG trỏ tới". Chữ <em>ĐANG</em> chính là toàn bộ bài học:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Đúng</span><span class="lz-t">make &gt; build.log 2&gt;&amp;1</span><span class="lz-d">Trước tiên fd 1 chĩa vào build.log. Rồi fd 2 chĩa vào chỗ fd 1 đang trỏ — cũng là build.log. Bắt được cả hai.</span></div>
  <div class="lz-step"><span class="lz-k">Sai</span><span class="lz-t">make 2&gt;&amp;1 &gt; build.log</span><span class="lz-d">Trước tiên fd 2 chĩa vào chỗ fd 1 đang trỏ — là TERMINAL. Rồi fd 1 bị dời sang build.log. fd 2 vẫn chĩa vào terminal. Lỗi thoát ra ngoài.</span></div>
</div>
<div class="callout ok">Cả hai lệnh đều chạy, chẳng lệnh nào cảnh báo, và khác biệt chỉ lộ ra khi có gì đó hỏng — thường là trong CI, đúng vào lúc bạn cần thông báo lỗi nhất. Quy tắc: <strong><code>2&gt;&amp;1</code> đứng CUỐI CÙNG.</strong> Hoặc tránh hẳn bằng <code>&amp;&gt;</code>, thứ không thể viết sai thứ tự được.</div>
<p>Đây là khác biệt đó trên một lệnh thật ghi ra cả hai dòng — <code>ls</code> một file có thật và một file không tồn tại:</p>
<pre><code class="language-bash">ls /etc/hostname /nope &gt; a.log 2&gt;&amp;1
cat a.log
ls /etc/hostname /nope 2&gt;&amp;1 &gt; b.log
cat b.log</code></pre>
<div class="out">$ ls /etc/hostname /nope &gt; a.log 2&gt;&amp;1
$ cat a.log
ls: cannot access '/nope': No such file or directory
/etc/hostname
$ ls /etc/hostname /nope 2&gt;&amp;1 &gt; b.log
ls: cannot access '/nope': No such file or directory
$ cat b.log
/etc/hostname</div>
<p>Ở lần chạy thứ hai, dòng lỗi hiện lên terminal ngay khi bạn nhấn Enter, còn <code>b.log</code> chỉ giữ kết quả. Đó đúng là cái log mà một job CI sẽ giữ lại — thiếu đúng cái dòng bạn cần.</p>

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
${slide('lx-03', 6, 'Heredoc: nháy quanh EOF quyết định có khai triển — và sudo không nâng quyền cho >')}
<pre><code class="language-bash">cat &lt;&lt;EOF &gt; config.yml
host: localhost
port: \${PORT}
EOF</code></pre>
<p>Mọi thứ giữa <code>&lt;&lt;EOF</code> và một dòng chỉ chứa mỗi chữ <code>EOF</code> trở thành stdin của lệnh. Ba biến thể làm đổi hành vi:</p>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>&lt;&lt;EOF</code></span><span class="v">Biến và <code>\$(lệnh)</code> ĐƯỢC khai triển. Dùng để dựng mẫu (template).</span></div>
  <div class="kv"><span class="k"><code>&lt;&lt;'EOF'</code></span><span class="v">Dấu kết thúc đặt trong nháy: KHÔNG khai triển gì cả, văn bản đi qua nguyên từng byte. Dùng cho script, JSON, mọi thứ có chứa <code>\$</code>.</span></div>
  <div class="kv"><span class="k"><code>&lt;&lt;-EOF</code></span><span class="v">Cắt các ký tự TAB đứng đầu (không cắt dấu cách), để heredoc thụt vào được bên trong một hàm.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Viết một script từ trong một script — BẮT BUỘC đặt nháy, không thì \$1 khai triển ngay bây giờ</span>
cat &lt;&lt;'EOF' &gt; deploy.sh
#!/usr/bin/env bash
echo "đang deploy \$1"
EOF

<span class="tok-comment"># Here-string: một dòng, không cần dấu kết thúc</span>
grep -c ERROR &lt;&lt;&lt; "\$log_text"</code></pre>
<div class="callout">Heredoc là cách bạn viết một file cấu hình, một câu lệnh SQL hay một khối lệnh chạy từ xa ngay bên trong script mà không cần file riêng và không phải vật lộn với dấu nháy. <code>ssh vps 'bash -s' &lt;&lt;'EOF'</code> gửi nguyên một script sang máy từ xa để chạy — Chương 9 dùng đúng cách này.</div>

<h3>tee: vừa ghi ra file VỪA chảy tiếp</h3>
<pre><code class="language-bash">make 2&gt;&amp;1 | tee build.log              <span class="tok-comment"># xem trực tiếp, và giữ lại một bản</span>
make 2&gt;&amp;1 | tee -a build.log           <span class="tok-comment"># -a nối thêm thay vì cắt trắng</span>
echo 'net.ipv4.ip_forward=1' | sudo tee -a /etc/sysctl.conf</code></pre>
<div class="callout ok">Dòng thứ ba giải quyết một vấn đề người ta gặp suốt: <code>sudo echo x &gt;&gt; /etc/file</code> thất bại với "Permission denied", vì <code>sudo</code> nâng quyền cho <code>echo</code> nhưng CHÍNH VIỆC CHUYỂN HƯỚNG lại do shell không có quyền của bạn thực hiện. <code>tee</code> là một CHƯƠNG TRÌNH, nên <code>sudo</code> nâng quyền được cho nó, và nó mới là thứ đi ghi file. Đây là cách sửa chuẩn.</div>

<h3>Vượt ra ngoài 0, 1 và 2</h3>
<p>Bộ mô tả file chỉ là những số nguyên nhỏ. Bạn tự mở thêm được:</p>
<pre><code class="language-bash">exec 3&gt; audit.log            <span class="tok-comment"># mở fd 3 trỏ vào một file</span>
echo "xong bước 1" &gt;&amp;3       <span class="tok-comment"># ghi vào đó mà không đụng tới stdout</span>
exec 3&gt;&amp;-                    <span class="tok-comment"># đóng nó lại</span></code></pre>
<p>Đây là cách một script giữ một vệt kiểm toán có cấu trúc tách khỏi phần output cho người đọc — vệt log đó sống sót ngay cả khi stdout bị đưa qua ống đi chỗ khác. Bạn sẽ không cần nó thường xuyên, nhưng khi cần thì không có thứ gì khác làm thay được.</p>

<h3>noclobber: dây an toàn cho dấu &gt;</h3>
<pre><code class="language-bash">set -o noclobber
echo hi &gt; existing.txt</code></pre>
<div class="out">bash: existing.txt: cannot overwrite existing file</div>
<p>Khi bật <code>noclobber</code>, <code>&gt;</code> từ chối cắt trắng một file đã tồn tại; còn <code>&gt;|</code> ép nó làm khi bạn thật sự muốn thế. Có người đặt hẳn dòng này vào <code>~/.bashrc</code> vĩnh viễn. Đó là một đánh đổi hợp lý: tốn thêm đúng một ký tự cho những lần ghi đè CÓ CHỦ Ý hiếm hoi, và ngăn được lần ghi đè do vô ý.</p>

<h3>Mọi toán tử chuyển hướng trên một trang</h3>
<table>
<tr><th>Toán tử</th><th>Nghĩa</th><th>Ví dụ</th></tr>
<tr><td><code>&gt;</code></td><td>stdout vào file, CẮT TRẮNG file trước</td><td><code>ls &gt; list.txt</code></td></tr>
<tr><td><code>&gt;&gt;</code></td><td>stdout, nối vào cuối</td><td><code>date &gt;&gt; run.log</code></td></tr>
<tr><td><code>2&gt;</code> · <code>2&gt;&gt;</code></td><td>stderr vào file (cắt trắng / nối thêm)</td><td><code>find / -name x 2&gt;/dev/null</code></td></tr>
<tr><td><code>2&gt;&amp;1</code></td><td>fd 2 trỏ tới chỗ fd 1 đang trỏ <em>NGAY LÚC NÀY</em></td><td><code>make &gt; build.log 2&gt;&amp;1</code></td></tr>
<tr><td><code>&gt;&amp;2</code></td><td>stdout của lệnh này đi ra stderr — cách script in thông báo lỗi</td><td><code>echo "missing file" &gt;&amp;2</code></td></tr>
<tr><td><code>&amp;&gt;</code> · <code>&amp;&gt;&gt;</code></td><td>cả hai dòng vào một file (chỉ bash; <code>&amp;&gt;&gt;</code> cần bash 4+)</td><td><code>make &amp;&gt; build.log</code></td></tr>
<tr><td><code>&gt;|</code></td><td>ghi đè kể cả khi đang bật <code>noclobber</code></td><td><code>echo hi &gt;| a.log</code></td></tr>
<tr><td><code>&lt;</code></td><td>một file vào stdin</td><td><code>wc -l &lt; access.log</code></td></tr>
<tr><td><code>&lt;&lt;EOF</code> · <code>&lt;&lt;'EOF'</code> · <code>&lt;&lt;-EOF</code></td><td>heredoc: có khai triển / nguyên văn / cắt tab đầu dòng</td><td><code>cat &lt;&lt;'EOF' &gt; x.sh</code></td></tr>
<tr><td><code>&lt;&lt;&lt;</code></td><td>here-string: một chuỗi vào stdin</td><td><code>wc -w &lt;&lt;&lt; "a b c"</code> → <code>3</code></td></tr>
<tr><td><code>|</code> · <code>|&amp;</code></td><td>stdout (hoặc cả hai dòng, bash 4+) sang lệnh kế tiếp</td><td><code>make |&amp; grep -i warn</code></td></tr>
<tr><td><code>exec 3&gt; f</code> · <code>exec 3&gt;&amp;-</code></td><td>mở / đóng thêm một bộ mô tả cho phần còn lại của script</td><td><code>echo step &gt;&amp;3</code></td></tr>
</table>
<p>Hãy đọc mọi dòng theo cùng một cách: con số bên trái là một bộ mô tả (bỏ trống thì là 1 trước <code>&gt;</code>, là 0 trước <code>&lt;</code>), thứ bên phải là nơi giờ nó trỏ tới, và shell xử lý chúng <strong>từ trái sang phải, TRƯỚC khi lệnh khởi động</strong>. Hai sự thật đó giải thích mọi bất ngờ trong bài này.</p>

<h3>Chạy thử từng bước</h3>
<p>Chín lệnh, theo đúng thứ tự, trong sân tập của khoá. Hãy gõ chứ đừng dán, và nói to output ra trước khi nhấn Enter.</p>
<pre><code class="language-bash">mkdir -p ~/thu-linux/ch3 &amp;&amp; cd ~/thu-linux/ch3
printf 'chuoi\\nan\\nbinh\\n' &gt; names.txt
sort names.txt &gt; names.txt; wc -l names.txt
printf 'chuoi\\nan\\nbinh\\n' &gt; names.txt
sort -o names.txt names.txt; cat names.txt
ls /etc/hostname /nope &gt; a.log 2&gt;&amp;1; wc -l a.log
ls /etc/hostname /nope 2&gt;&amp;1 &gt; b.log; wc -l b.log
set -o noclobber; echo hi &gt; a.log; set +o noclobber
wc -l &lt;&lt;&lt; "mot dong"</code></pre>
<div class="out">0 names.txt
an
binh
chuoi
2 a.log
ls: cannot access '/nope': No such file or directory
1 b.log
bash: a.log: cannot overwrite existing file
1</div>
<p>Đọc kết quả từng dòng: lệnh <code>sort</code> đầu tiên đã phá huỷ chính đầu vào của nó; <code>sort -o</code> làm cùng việc đó một cách an toàn; <code>a.log</code> hứng được cả hai dòng còn <code>b.log</code> hứng một dòng và dòng lỗi trốn ra màn hình; <code>noclobber</code> từ chối cắt trắng một file đã có; và here-string là đúng một dòng stdin. (Ghi trong bash 5.2 tương tác trên Ubuntu 24.04, người dùng <code>an</code>.)</p>

<h3>Trên macOS và WSL khác gì</h3>
<table>
<tr><th>Thứ</th><th>Ubuntu / WSL (bash 5)</th><th>Mac: <code>/bin/bash</code> 3.2</th><th>Mac: zsh (shell mặc định)</th></tr>
<tr><td><code>cmd &amp;&gt;&gt; f</code></td><td>chạy</td><td><code>syntax error near unexpected token &#96;&gt;'</code></td><td>chạy</td></tr>
<tr><td><code>cmd |&amp; wc -l</code></td><td>chạy</td><td><code>syntax error near unexpected token &#96;&amp;'</code></td><td>chạy</td></tr>
<tr><td><code>echo hi &gt; m1 &gt; m2</code></td><td>chỉ <code>m2</code> có "hi"; <code>m1</code> bị để rỗng</td><td>như bash 5</td><td><strong>CẢ HAI</strong> file đều có "hi" (MULTIOS của zsh)</td></tr>
<tr><td><code>/proc/self/fd</code></td><td>có</td><td>không có <code>/proc</code> — dùng <code>ls -l /dev/fd/</code></td><td>như bên trái</td></tr>
</table>
<p>Các dòng Mac được chạy thật trên macOS 27 (<code>/bin/bash</code> 3.2.57, zsh 5.9). Hai hệ quả thực tế: một script có shebang <code>#!/bin/bash</code> mà dùng <code>|&amp;</code> hay <code>&amp;&gt;&gt;</code> sẽ không phân tích nổi trên một máy Mac nguyên bản, nên hãy viết <code>2&gt;&amp;1 |</code> và <code>&gt;&gt; f 2&gt;&amp;1</code>, hai dạng chạy được ở mọi nơi; và một thói quen học từ zsh (chuyển hướng vào hai file một lúc) sẽ âm thầm làm việc khác hẳn trong bash. WSL2 chạy một Ubuntu thật, nên mọi thứ hành xử y như trên VPS.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> log CI của nhóm SWP391 ghi "build done" nhưng không ai tìm thấy dòng cảnh báo mà trình biên dịch chắc chắn đã in ra. Hãy dựng lại vấn đề bằng một script build giả, rồi hứng output cho đúng.</p><ol>
<li>Tạo bản build giả (dấu nháy quanh <code>'EOF'</code> giữ script nguyên như lúc viết):
<pre><code class="language-bash">mkdir -p ~/thu-linux/ch3/bt31 &amp;&amp; cd ~/thu-linux/ch3/bt31
cat &lt;&lt;'EOF' &gt; build.sh
#!/usr/bin/env bash
echo "compile ok"
echo "warning: unused variable 'x'" &gt;&amp;2
echo "build done"
EOF
chmod +x build.sh</code></pre></li>
<li>Trước khi chạy gì, hãy đoán số dòng, rồi kiểm: <code>./build.sh &gt; a.log 2&gt;&amp;1</code>, <code>./build.sh 2&gt;&amp;1 &gt; b.log</code>, <code>wc -l a.log b.log</code>.</li>
<li>Đếm số dòng đi tới được một cái ống: <code>./build.sh 2&gt;/dev/null | wc -l</code> và <code>./build.sh |&amp; wc -l</code>.</li>
<li>Thắt dây an toàn: <code>set -o noclobber</code>, thử <code>./build.sh &gt; a.log</code>, rồi ép bằng <code>&gt;|</code>, rồi <code>set +o noclobber</code>.</li>
<li>Vừa giữ log vừa lọc trực tiếp: <code>./build.sh 2&gt;&amp;1 | tee -a run.log | grep -c warning</code>, rồi <code>wc -l run.log</code>.</li></ol>
<p><strong>Đạt khi:</strong> <code>a.log</code> có 3 dòng còn <code>b.log</code> có 2 (dòng cảnh báo lọt ra màn hình); hai cái ống đếm được 2 và 3; <code>noclobber</code> in <code>cannot overwrite existing file</code>; <code>grep -c</code> in <code>1</code> và <code>run.log</code> có 3 dòng.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">File descriptor — fd (bộ mô tả file)</span><span class="v">Con số nhỏ mà tiến trình dùng cho một file, ống hay terminal đang mở; 0, 1, 2 mở sẵn từ lúc sinh ra.</span></div>
  <div class="kv"><span class="k">stdin / stdout / stderr (đầu vào / đầu ra / lỗi chuẩn)</span><span class="v">fd 0 (đọc vào), fd 1 (kết quả) và fd 2 (lỗi và thông báo chẩn đoán).</span></div>
  <div class="kv"><span class="k">Redirection (chuyển hướng)</span><span class="v">Chĩa lại một bộ mô tả vào file hoặc vào bộ mô tả khác, do shell làm trước khi lệnh chạy.</span></div>
  <div class="kv"><span class="k">Truncate (cắt trắng)</span><span class="v">Cắt file về 0 byte — việc <code>&gt;</code> làm ngay khi shell mở file.</span></div>
  <div class="kv"><span class="k">Heredoc / here-string (văn bản tại chỗ / chuỗi tại chỗ)</span><span class="v">Nhiều dòng (<code>&lt;&lt;EOF</code>) hoặc một chuỗi (<code>&lt;&lt;&lt;</code>) rót thẳng vào stdin của lệnh.</span></div>
  <div class="kv"><span class="k">noclobber (chống ghi đè)</span><span class="v">Tuỳ chọn của shell khiến <code>&gt;</code> từ chối ghi đè một file đã tồn tại.</span></div>
  <div class="kv"><span class="k">/dev/null (sọt rác)</span><span class="v">Thiết bị vứt bỏ mọi thứ ghi vào nó và đọc ra thì rỗng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mọi tiến trình khởi đầu với fd 0, 1, 2; <code>&gt;</code>, <code>&lt;</code>, <code>2&gt;</code> và <code>|</code> chỉ chĩa lại chúng, còn chương trình không hề biết.</li>
<li>Shell làm chuyển hướng trước, nên <code>&gt;</code> làm rỗng file kể cả khi lệnh sau đó thất bại — <code>sort f &gt; f</code> mất sạch.</li>
<li><code>2&gt;&amp;1</code> chép chỗ fd 1 đang trỏ tại khoảnh khắc đó: đặt nó CUỐI, hoặc dùng <code>&amp;&gt;</code>.</li>
<li>Đặt dấu kết thúc heredoc trong nháy (<code>&lt;&lt;'EOF'</code>) mỗi khi văn bản có <code>\$</code> phải giữ nguyên.</li>
<li><code>sudo</code> không nâng quyền cho <code>&gt;&gt;</code> của shell bạn; <code>| sudo tee -a file</code> mới là thứ ghi với quyền root.</li>
<li><code>/bin/bash</code> 3.2 của Mac không có <code>&amp;&gt;&gt;</code> hay <code>|&amp;</code>; dạng viết dài chạy được ở mọi nơi.</li>
</ul>


<a class="link-card" href="https://www.gnu.org/software/bash/manual/html_node/Redirections.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Bash Manual — Redirections</span><span class="lc-sub">Mọi toán tử chuyển hướng gói trong một trang, gồm cả dạng nhân bản fd và thay thế tiến trình. Trang đáng đánh dấu lại.</span></span>
</a>
<a class="link-card" href="https://mywiki.wooledge.org/BashFAQ/055" target="_blank" rel="noopener">
  <span class="lc-ico">🔧</span>
  <span class="lc-body"><span class="lc-title">BashFAQ — "Chuyển hướng stdout và stderr thế nào?"</span><span class="lc-sub">Đi từng bước qua cái bẫy thứ tự của <code>2&gt;&amp;1</code>, có vẽ ra bảng fd ở mỗi giai đoạn.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
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

${slide('lx-03', 7, 'a | b: hai tiến trình chạy CÙNG LÚC, nối bằng bộ đệm của nhân')}

<p>Both processes are launched together and run concurrently. The pipe is a fixed-size buffer in kernel memory — on Linux, 64 KB by default — and the kernel automatically pauses whichever side is running ahead. Nothing touches the disk, and no intermediate file exists.</p>

<div class="callout ok">This is why <code>grep pattern 10GB.log | head -5</code> returns instantly. <code>head</code> prints five lines and exits. <code>grep</code> keeps writing, the pipe fills, and its next <code>write()</code> hits a pipe with no reader — so the kernel sends it <strong>SIGPIPE</strong> and <code>grep</code> dies. The file is never fully read. Under the "collect then feed" model this would take minutes; under the real model it takes milliseconds.</div>

<pre><code>yes | head -3</code></pre>
<div class="out">y
y
y</div>
<p><code>yes</code> prints "y" forever. It stops here for exactly one reason: <code>head</code> exited, and the next write earned a SIGPIPE. Try to explain that output with the sequential model and you cannot — <code>yes</code> would never finish producing.</p>
<p>You can watch the SIGPIPE happen. Bash records every stage's exit status in the array <code>PIPESTATUS</code>, and a process killed by signal <em>N</em> exits with 128 + <em>N</em>; SIGPIPE is signal 13:</p>
<pre><code>yes | head -3; echo "\${PIPESTATUS[@]}"
time (seq 1 100000000 | head -1)</code></pre>
<div class="out">y
y
y
141 0
1

real	0m0.002s</div>
<p><code>141</code> is <code>yes</code> being killed by SIGPIPE; <code>0</code> is <code>head</code> finishing normally. And <code>seq</code> was asked for a hundred million numbers but stopped after the first, two milliseconds in. (Ubuntu 24.04. The kernel's pipe buffer is 65,536 bytes by default — see <code>pipe(7)</code>; <code>/proc/sys/fs/pipe-max-size</code> reads <code>1048576</code> there and on Fedora 44, the most one pipe may be enlarged to.)</p>

<h3>The exit status of a pipeline</h3>
${slide('lx-03', 8, 'Chuỗi ống chỉ báo mã của khâu CUỐI — pipefail bắt khâu hỏng')}
<pre><code>false | true
echo \$?</code></pre>
<div class="out">0</div>
<p>By default a pipeline reports only the <strong>last</strong> command's exit status. The failure of <code>false</code> vanishes. In a script that checks errors, this means a broken first stage passes silently:</p>
<pre><code class="language-bash"><span class="tok-comment"># Looks safe. Is not. curl can 404 and this still "succeeds".</span>
curl -s https://api.example.com/data | jq '.items' &gt; out.json

set -o pipefail          <span class="tok-comment"># now the pipeline fails if ANY stage fails</span>
curl -sf https://httpbin.org/status/404 | jq '.items' &gt; out.json
echo \$?</code></pre>
<div class="out">22</div>
<p>Two details make this work, and both were checked on Ubuntu 24.04. First, the <code>-f</code>: plain <code>curl -s</code> exits <strong>0</strong> on an HTTP 404 — it successfully fetched a page, the page just said "not found" — so even <code>pipefail</code> has nothing to catch. <code>curl -f</code> turns any HTTP status of 400 or more into exit code 22. Second, <code>jq</code> given empty input also exits 0, so without <code>pipefail</code> the whole line reports success. (A host name that does not resolve at all makes curl exit 6 instead.)</p>
<p>Or inspect every stage individually — bash keeps them in an array:</p>
<pre><code class="language-bash">curl -s bad-url | jq '.' | wc -l
echo "\${PIPESTATUS[@]}"</code></pre>
<div class="out">6 0 0</div>
<p>Read it left to right: <code>curl</code> exited 6 (could not resolve the host <code>bad-url</code>), <code>jq</code> exited 0 because an empty input is not an error to it, and <code>wc -l</code> exited 0 after printing <code>0</code>. Only the first number tells the truth.</p>
<div class="callout warn"><code>\${PIPESTATUS[@]}</code> is overwritten by the <em>next</em> command — including an <code>echo</code>. Copy it first (<code>local st=("\${PIPESTATUS[@]}")</code>) if you need to test more than one element. Chapter 7 makes <code>set -euo pipefail</code> the standard opening of every script, and this is the <code>pipefail</code> half of it.</div>

<h3>stderr does not travel through a pipe</h3>
${slide('lx-03', 9, 'stderr không chảy qua ống — và grep trong ống xả theo khối')}
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
<p>You can measure the trap in six seconds without any log file. The subshell prints one ERROR, waits three seconds, prints another; the loop at the end stamps each line with the second at which it <em>arrived</em>:</p>
<pre><code>t0=\$SECONDS
(echo "ERROR 1"; sleep 3; echo "ERROR 2") | grep ERROR \\
  | while read -r l; do echo "second \$((SECONDS-t0)): \$l"; done
t0=\$SECONDS
(echo "ERROR 1"; sleep 3; echo "ERROR 2") | grep --line-buffered ERROR \\
  | while read -r l; do echo "second \$((SECONDS-t0)): \$l"; done</code></pre>
<div class="out">second 3: ERROR 1
second 3: ERROR 2
second 0: ERROR 1
second 3: ERROR 2</div>
<p>Without the flag, the first error sat inside <code>grep</code>'s buffer for three seconds and came out together with the second. With it, each line leaves immediately. On a real log, "three seconds" becomes "until 4 KB of matches pile up". (Ubuntu 24.04; <code>stdbuf -oL grep ERROR</code> gave the same 0/3 result.)</p>

<h3>The subshell trap</h3>
${slide('lx-03', 10, 'Khâu ống chạy trong shell con — biến của while biến mất')}
<pre><code class="language-bash">count=0
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
${slide('lx-03', 11, 'xargs biến từng dòng thành THAM SỐ cho lệnh không đọc stdin')}
<p>Pipes connect stdout to <em>stdin</em>. But many commands — <code>rm</code>, <code>mkdir</code>, <code>git add</code> — take filenames as <em>arguments</em>, not on stdin. <code>xargs</code> is the adapter between the two:</p>
<pre><code class="language-bash">find . -name "*.tmp" -print0 | xargs -0 rm          <span class="tok-comment"># NUL-safe (Lesson 2.3)</span>
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
<pre><code class="language-bash">awk '{print \$1}' access.log | sort | uniq -c | sort -rn | head -10</code></pre>
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

<h3>xargs flags, with what they actually do</h3>
<table>
<tr><th>Flag</th><th>Meaning</th><th>Real example (Ubuntu 24.04)</th></tr>
<tr><td>(none)</td><td>split input on spaces AND newlines, pass as many words as fit</td><td><code>printf 'a.txt\\nb c.txt\\n' | xargs -t touch</code> → runs <code>touch a.txt b c.txt</code>: three files, not two</td></tr>
<tr><td><code>-d '\\n'</code></td><td>split only on newlines (GNU only)</td><td>same input → <code>touch a.txt 'b c.txt'</code></td></tr>
<tr><td><code>-0</code></td><td>split on NUL bytes; pair with <code>find -print0</code> or <code>tr '\\n' '\\0'</code></td><td>works on GNU and macOS alike</td></tr>
<tr><td><code>-n N</code></td><td>at most N arguments per run</td><td><code>printf '1\\n2\\n3\\n4\\n5\\n' | xargs -n2 echo</code> → <code>1 2</code> / <code>3 4</code> / <code>5</code></td></tr>
<tr><td><code>-I{}</code></td><td>one run per line, <code>{}</code> replaced anywhere</td><td><code>printf 'x\\ny\\n' | xargs -I{} echo file-{}.bak</code> → <code>file-x.bak</code> / <code>file-y.bak</code></td></tr>
<tr><td><code>-P N</code></td><td>up to N runs at the same time</td><td>four <code>sleep 1</code>: <code>-n1</code> took 4.0 s, <code>-P4 -n1</code> took 1.0 s</td></tr>
<tr><td><code>-r</code></td><td>do nothing when input is empty (GNU; macOS's xargs already behaves this way)</td><td><code>printf '' | xargs echo hi</code> prints <code>hi</code>; with <code>-r</code> it prints nothing</td></tr>
<tr><td><code>-t</code></td><td>print each command to stderr before running it</td><td>the dry-run habit: <code>… | xargs -t echo rm</code></td></tr>
</table>
<p><strong>When to use xargs, and when not:</strong> use it to feed a list into a command that only takes arguments (<code>rm</code>, <code>touch</code>, <code>git add</code>, <code>docker rm</code>), and whenever <code>-P</code> buys you parallelism. Prefer <code>find … -exec cmd {} +</code> when the list comes from <code>find</code> anyway, and a <code>while read -r</code> loop when each item needs several commands or careful quoting.</p>

<h3>Try it step by step</h3>
<p>Ten commands in <code>~/thu-linux/ch3</code>. Each one demonstrates one idea from this lesson; predict before you run.</p>
<pre><code class="language-bash">cd ~/thu-linux/ch3
yes | head -3; echo "\${PIPESTATUS[@]}"
false | true; echo \$?
set -o pipefail; false | true; echo \$?; set +o pipefail
ls /etc/hostname /nope | wc -l
ls /etc/hostname /nope 2&gt;&amp;1 | wc -l
printf 'a\\nb\\nc\\n' &gt; f.txt
count=0; cat f.txt | while read -r l; do count=\$((count+1)); done; echo "\$count"
count=0; while read -r l; do count=\$((count+1)); done &lt; f.txt; echo "\$count"
echo &lt;(true)</code></pre>
<div class="out">y
y
y
141 0
0
1
ls: cannot access '/nope': No such file or directory
1
2
0
3
/dev/fd/63</div>
<p>In order: SIGPIPE killed <code>yes</code> (141); the pipeline hid <code>false</code>'s failure (0) until <code>pipefail</code> exposed it (1); the error bypassed the pipe (1 line counted) until <code>2&gt;&amp;1</code> merged it (2); the piped loop lost its count (0) while the redirected loop kept it (3); and process substitution is really a file name under <code>/dev/fd</code>. (Recorded in an interactive bash 5.2, Ubuntu 24.04.)</p>

<h3>On macOS and WSL: what is different</h3>
<table>
<tr><th>Thing</th><th>Ubuntu / WSL</th><th>macOS 27 (real run)</th></tr>
<tr><td><code>ls /nope |&amp; wc -l</code></td><td>works (bash 5)</td><td><code>/bin/bash</code> 3.2: <code>syntax error near unexpected token &#96;&amp;'</code>; zsh: works</td></tr>
<tr><td><code>shopt -s lastpipe</code></td><td>works in scripts</td><td>bash 3.2: <code>shopt: lastpipe: invalid shell option name</code></td></tr>
<tr><td><code>c=0; printf "a\\nb\\n" | while read l; do c=\$((c+1)); done; echo \$c</code></td><td><code>0</code> (loop ran in a subshell)</td><td>bash 3.2: <code>0</code> · <strong>zsh: <code>2</code></strong> — zsh runs the last stage in the current shell</td></tr>
<tr><td><code>xargs -d '\\n'</code></td><td>works (GNU)</td><td><code>xargs: invalid option -- d</code> — use <code>tr '\\n' '\\0' | xargs -0</code></td></tr>
<tr><td>empty input to <code>xargs cmd</code></td><td>runs <code>cmd</code> once with no arguments</td><td>does not run <code>cmd</code> at all; <code>-r</code> is accepted</td></tr>
<tr><td><code>\${PIPESTATUS[@]}</code>, <code>set -o pipefail</code></td><td>work</td><td>work in bash 3.2 too (<code>yes | head -1</code> → <code>141 0</code>)</td></tr>
</table>
<p>The zsh row is the dangerous one: a loop that "works" in your Mac terminal loses its variable the moment the same lines run inside a bash script on the server. Test scripts with the shell named in their shebang, not with whatever your terminal runs.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> a teammate's cleanup script builds a list of files, one per line, and feeds it to <code>xargs</code>. It works until someone uploads "b c.txt". Then the deploy script reports success even though a download failed. Reproduce both, then fix them.</p><ol>
<li><code>mkdir -p ~/thu-linux/ch3/bt32 &amp;&amp; cd ~/thu-linux/ch3/bt32</code>, then <code>printf '%s\\n' a.txt 'b c.txt' &gt; ds.txt</code>.</li>
<li>Run <code>xargs touch &lt; ds.txt; ls</code> and count the files that appeared. Remove them (<code>rm -f a.txt b c.txt</code>) and do it NUL-safely: <code>tr '\\n' '\\0' &lt; ds.txt | xargs -0 touch; ls</code>.</li>
<li>Simulate a failed first stage: <code>cat khong-co.txt | sort | wc -l; echo "\${PIPESTATUS[@]}"</code>. Then repeat after <code>set -o pipefail</code> and print <code>\$?</code>; finish with <code>set +o pipefail</code>.</li>
<li>Count the lines of <code>ds.txt</code> twice with a <code>while read -r</code> loop — once fed by <code>cat ds.txt |</code>, once by <code>&lt; ds.txt</code> — and print the counter after each.</li>
<li>Prove SIGPIPE: <code>yes | head -1; echo "\${PIPESTATUS[@]}"</code>.</li></ol>
<p><strong>Done when:</strong> the first <code>ls</code> shows <code>a.txt</code>, <code>b</code>, <code>c.txt</code> (plus <code>ds.txt</code>) and the second shows <code>a.txt</code> and <code>b c.txt</code>; <code>PIPESTATUS</code> prints <code>1 0 0</code> and the <code>pipefail</code> run gives <code>\$?</code> = 1; the two loops print 0 and 2; the last line is <code>141 0</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Pipe</span><span class="v">A kernel buffer (64 KB by default) that connects one process's stdout to the next one's stdin; both run at once.</span></div>
  <div class="kv"><span class="k">SIGPIPE</span><span class="v">Signal 13, sent to a process that writes to a pipe nobody reads any more; exit status 141.</span></div>
  <div class="kv"><span class="k">Exit status / exit code</span><span class="v">The number a command returns: 0 means success, anything else a kind of failure.</span></div>
  <div class="kv"><span class="k">pipefail · PIPESTATUS</span><span class="v">Make a pipeline fail when any stage fails · the array of every stage's exit status.</span></div>
  <div class="kv"><span class="k">Subshell</span><span class="v">A child copy of the shell; variables changed inside it vanish when it exits.</span></div>
  <div class="kv"><span class="k">Buffering</span><span class="v">Collecting output before writing it: per line to a terminal, per 4 KB+ block to a pipe.</span></div>
  <div class="kv"><span class="k">Process substitution</span><span class="v"><code>&lt;(cmd)</code>: a command's output presented as a file name such as <code>/dev/fd/63</code>.</span></div>
  <div class="kv"><span class="k">Argument</span><span class="v">A word given to a command on its command line — what <code>xargs</code> turns input lines into.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>All stages of a pipeline start together and are joined by a 64 KB kernel buffer; nothing is written to disk.</li>
<li>When the reader exits, the writer gets SIGPIPE (exit 141) — which is why <code>| head</code> is instant on huge files.</li>
<li>A pipeline reports only the last stage's status: use <code>set -o pipefail</code>, <code>PIPESTATUS</code>, and <code>curl -f</code>.</li>
<li>Only fd 1 enters a pipe; merge stderr first (<code>2&gt;&amp;1 |</code>) and use <code>--line-buffered</code> for live-following pipelines.</li>
<li>Each stage runs in a subshell, so feed loops with <code>&lt; file</code> or <code>&lt; &lt;(cmd)</code> when variables must survive.</li>
<li><code>xargs</code> turns lines into arguments: split safely with <code>-0</code>, preview with <code>-t</code>, parallelise with <code>-P</code>.</li>
</ul>


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
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
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

${slide('lx-03', 7, 'a | b: hai tiến trình chạy CÙNG LÚC, nối bằng bộ đệm của nhân')}

<p>Cả hai tiến trình được khởi chạy cùng nhau và chạy song song. Ống dẫn là một bộ đệm kích thước cố định nằm trong bộ nhớ nhân — trên Linux mặc định 64 KB — và nhân tự động tạm dừng bên nào đang chạy nhanh hơn. Không có gì chạm vào đĩa, và không có file trung gian nào tồn tại.</p>

<div class="callout ok">Đây là lý do <code>grep pattern 10GB.log | head -5</code> trả về tức thì. <code>head</code> in ra năm dòng rồi thoát. <code>grep</code> vẫn ghi tiếp, ống đầy lên, và lần <code>write()</code> kế tiếp của nó đụng phải một cái ống KHÔNG CÒN NGƯỜI ĐỌC — nên nhân gửi cho nó <strong>SIGPIPE</strong> và <code>grep</code> chết. File không bao giờ được đọc hết. Theo mô hình "hứng rồi mới rót" thì việc này mất vài phút; theo mô hình thật thì nó mất vài mili giây.</div>

<pre><code>yes | head -3</code></pre>
<div class="out">y
y
y</div>
<p><code>yes</code> in ra chữ "y" mãi mãi. Nó dừng ở đây vì đúng một lý do: <code>head</code> đã thoát, và lần ghi kế tiếp lãnh một SIGPIPE. Thử giải thích kết quả này bằng mô hình tuần tự mà xem — không giải thích nổi, vì <code>yes</code> sẽ không bao giờ sinh xong.</p>
<p>Bạn có thể nhìn tận mắt cái SIGPIPE đó. Bash ghi mã thoát của từng khâu vào mảng <code>PIPESTATUS</code>, và một tiến trình bị tín hiệu số <em>N</em> giết thì thoát với mã 128 + <em>N</em>; SIGPIPE là tín hiệu số 13:</p>
<pre><code>yes | head -3; echo "\${PIPESTATUS[@]}"
time (seq 1 100000000 | head -1)</code></pre>
<div class="out">y
y
y
141 0
1

real	0m0.002s</div>
<p><code>141</code> là <code>yes</code> bị SIGPIPE giết; <code>0</code> là <code>head</code> kết thúc bình thường. Còn <code>seq</code> được yêu cầu đếm một trăm triệu số nhưng dừng ngay sau số đầu tiên, sau hai mili giây. (Ubuntu 24.04. Bộ đệm ống của nhân mặc định là 65.536 byte — xem <code>pipe(7)</code>; <code>/proc/sys/fs/pipe-max-size</code> đọc ra <code>1048576</code> ở đó và trên Fedora 44, tức mức tối đa một cái ống được phép nới ra.)</p>

<h3>Mã thoát của một chuỗi ống</h3>
${slide('lx-03', 8, 'Chuỗi ống chỉ báo mã của khâu CUỐI — pipefail bắt khâu hỏng')}
<pre><code>false | true
echo \$?</code></pre>
<div class="out">0</div>
<p>Mặc định, một chuỗi ống chỉ báo cáo mã thoát của lệnh <strong>CUỐI CÙNG</strong>. Thất bại của <code>false</code> biến mất. Trong một script có kiểm lỗi, điều này nghĩa là một khâu đầu tiên bị hỏng vẫn lọt qua trong im lặng:</p>
<pre><code class="language-bash"><span class="tok-comment"># Trông có vẻ an toàn. Không hề. curl có thể 404 mà cái này vẫn "thành công".</span>
curl -s https://api.example.com/data | jq '.items' &gt; out.json

set -o pipefail          <span class="tok-comment"># giờ chuỗi ống thất bại nếu BẤT KỲ khâu nào thất bại</span>
curl -sf https://httpbin.org/status/404 | jq '.items' &gt; out.json
echo \$?</code></pre>
<div class="out">22</div>
<p>Có hai chi tiết làm việc này chạy được, và cả hai đều đã kiểm trên Ubuntu 24.04. Thứ nhất là chữ <code>-f</code>: <code>curl -s</code> trơn thoát với mã <strong>0</strong> khi gặp HTTP 404 — nó đã lấy về một trang thành công, chỉ là trang đó nói "không tìm thấy" — nên kể cả <code>pipefail</code> cũng chẳng có gì để bắt. <code>curl -f</code> biến mọi mã HTTP từ 400 trở lên thành mã thoát 22. Thứ hai, <code>jq</code> nhận đầu vào rỗng cũng thoát 0, nên thiếu <code>pipefail</code> thì cả dòng báo thành công. (Một tên máy không phân giải được thì curl thoát mã 6.)</p>
<p>Hoặc soi từng khâu một — bash giữ chúng trong một mảng:</p>
<pre><code class="language-bash">curl -s bad-url | jq '.' | wc -l
echo "\${PIPESTATUS[@]}"</code></pre>
<div class="out">6 0 0</div>
<p>Đọc từ trái sang phải: <code>curl</code> thoát 6 (không phân giải được tên máy <code>bad-url</code>), <code>jq</code> thoát 0 vì với nó đầu vào rỗng không phải lỗi, và <code>wc -l</code> thoát 0 sau khi in <code>0</code>. Chỉ con số đầu tiên nói thật.</p>
<div class="callout warn"><code>\${PIPESTATUS[@]}</code> bị ghi đè bởi lệnh <em>KẾ TIẾP</em> — kể cả một lệnh <code>echo</code>. Hãy chép nó ra trước (<code>local st=("\${PIPESTATUS[@]}")</code>) nếu bạn cần kiểm tra nhiều hơn một phần tử. Chương 7 lấy <code>set -euo pipefail</code> làm dòng mở đầu chuẩn của mọi script, và đây chính là nửa <code>pipefail</code> của nó.</div>

<h3>stderr KHÔNG đi qua ống dẫn</h3>
${slide('lx-03', 9, 'stderr không chảy qua ống — và grep trong ống xả theo khối')}
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
<p>Bạn đo được cái bẫy này trong sáu giây mà không cần file log nào. Shell con in một dòng ERROR, chờ ba giây, in dòng nữa; vòng lặp ở cuối đóng dấu mỗi dòng bằng giây mà nó <em>ĐẾN NƠI</em>:</p>
<pre><code>t0=\$SECONDS
(echo "ERROR 1"; sleep 3; echo "ERROR 2") | grep ERROR \\
  | while read -r l; do echo "giây \$((SECONDS-t0)): \$l"; done
t0=\$SECONDS
(echo "ERROR 1"; sleep 3; echo "ERROR 2") | grep --line-buffered ERROR \\
  | while read -r l; do echo "giây \$((SECONDS-t0)): \$l"; done</code></pre>
<div class="out">giây 3: ERROR 1
giây 3: ERROR 2
giây 0: ERROR 1
giây 3: ERROR 2</div>
<p>Không có cờ, dòng lỗi đầu tiên nằm trong bộ đệm của <code>grep</code> suốt ba giây rồi mới ra cùng dòng thứ hai. Có cờ, mỗi dòng đi ra ngay. Trên log thật, "ba giây" biến thành "cho tới khi dồn đủ 4 KB kết quả". (Ubuntu 24.04; <code>stdbuf -oL grep ERROR</code> cho cùng kết quả 0/3.)</p>

<h3>Cái bẫy shell con</h3>
${slide('lx-03', 10, 'Khâu ống chạy trong shell con — biến của while biến mất')}
<pre><code class="language-bash">count=0
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
${slide('lx-03', 11, 'xargs biến từng dòng thành THAM SỐ cho lệnh không đọc stdin')}
<p>Ống dẫn nối stdout với <em>STDIN</em>. Nhưng nhiều lệnh — <code>rm</code>, <code>mkdir</code>, <code>git add</code> — lại nhận tên file dưới dạng <em>THAM SỐ</em>, chứ không đọc từ stdin. <code>xargs</code> chính là bộ chuyển đổi giữa hai thứ đó:</p>
<pre><code class="language-bash">find . -name "*.tmp" -print0 | xargs -0 rm          <span class="tok-comment"># an toàn với NUL (Bài 2.3)</span>
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
<pre><code class="language-bash">awk '{print \$1}' access.log | sort | uniq -c | sort -rn | head -10</code></pre>
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

<h3>Bảng cờ xargs, kèm việc chúng thật sự làm</h3>
<table>
<tr><th>Cờ</th><th>Nghĩa</th><th>Ví dụ thật (Ubuntu 24.04)</th></tr>
<tr><td>(không cờ)</td><td>cắt đầu vào theo dấu cách VÀ xuống dòng, nhồi được bao nhiêu từ thì nhồi</td><td><code>printf 'a.txt\\nb c.txt\\n' | xargs -t touch</code> → chạy <code>touch a.txt b c.txt</code>: ba file, không phải hai</td></tr>
<tr><td><code>-d '\\n'</code></td><td>chỉ cắt theo xuống dòng (chỉ GNU)</td><td>cùng đầu vào → <code>touch a.txt 'b c.txt'</code></td></tr>
<tr><td><code>-0</code></td><td>cắt theo byte NUL; đi cặp với <code>find -print0</code> hoặc <code>tr '\\n' '\\0'</code></td><td>chạy như nhau trên GNU lẫn macOS</td></tr>
<tr><td><code>-n N</code></td><td>mỗi lượt chạy tối đa N tham số</td><td><code>printf '1\\n2\\n3\\n4\\n5\\n' | xargs -n2 echo</code> → <code>1 2</code> / <code>3 4</code> / <code>5</code></td></tr>
<tr><td><code>-I{}</code></td><td>mỗi dòng một lượt, <code>{}</code> được thay ở bất cứ đâu</td><td><code>printf 'x\\ny\\n' | xargs -I{} echo file-{}.bak</code> → <code>file-x.bak</code> / <code>file-y.bak</code></td></tr>
<tr><td><code>-P N</code></td><td>tối đa N lượt chạy cùng lúc</td><td>bốn lệnh <code>sleep 1</code>: <code>-n1</code> mất 4,0 giây, <code>-P4 -n1</code> mất 1,0 giây</td></tr>
<tr><td><code>-r</code></td><td>đầu vào rỗng thì không làm gì (GNU; xargs của macOS vốn đã như vậy)</td><td><code>printf '' | xargs echo hi</code> in ra <code>hi</code>; có <code>-r</code> thì không in gì</td></tr>
<tr><td><code>-t</code></td><td>in từng lệnh ra stderr trước khi chạy</td><td>thói quen chạy thử: <code>… | xargs -t echo rm</code></td></tr>
</table>
<p><strong>Khi nào dùng xargs, khi nào KHÔNG:</strong> dùng nó để rót một danh sách vào lệnh chỉ nhận tham số (<code>rm</code>, <code>touch</code>, <code>git add</code>, <code>docker rm</code>), và mỗi khi <code>-P</code> mang lại lợi ích song song. Ưu tiên <code>find … -exec lệnh {} +</code> khi danh sách vốn đã từ <code>find</code> mà ra, và dùng vòng <code>while read -r</code> khi mỗi mục cần vài lệnh hoặc cần đặt nháy cẩn thận.</p>

<h3>Chạy thử từng bước</h3>
<p>Mười lệnh trong <code>~/thu-linux/ch3</code>. Mỗi lệnh minh hoạ đúng một ý của bài; đoán trước rồi mới chạy.</p>
<pre><code class="language-bash">cd ~/thu-linux/ch3
yes | head -3; echo "\${PIPESTATUS[@]}"
false | true; echo \$?
set -o pipefail; false | true; echo \$?; set +o pipefail
ls /etc/hostname /nope | wc -l
ls /etc/hostname /nope 2&gt;&amp;1 | wc -l
printf 'a\\nb\\nc\\n' &gt; f.txt
count=0; cat f.txt | while read -r l; do count=\$((count+1)); done; echo "\$count"
count=0; while read -r l; do count=\$((count+1)); done &lt; f.txt; echo "\$count"
echo &lt;(true)</code></pre>
<div class="out">y
y
y
141 0
0
1
ls: cannot access '/nope': No such file or directory
1
2
0
3
/dev/fd/63</div>
<p>Theo thứ tự: SIGPIPE đã giết <code>yes</code> (141); chuỗi ống giấu thất bại của <code>false</code> (0) cho tới khi <code>pipefail</code> lột trần nó (1); dòng lỗi đi vòng qua cái ống (đếm được 1 dòng) cho tới khi <code>2&gt;&amp;1</code> gộp nó vào (2); vòng lặp qua ống đánh mất biến đếm (0) còn vòng lặp dùng chuyển hướng giữ được (3); và thay thế tiến trình thật ra là một tên file trong <code>/dev/fd</code>. (Ghi trong bash 5.2 tương tác, Ubuntu 24.04.)</p>

<h3>Trên macOS và WSL khác gì</h3>
<table>
<tr><th>Thứ</th><th>Ubuntu / WSL</th><th>macOS 27 (chạy thật)</th></tr>
<tr><td><code>ls /nope |&amp; wc -l</code></td><td>chạy (bash 5)</td><td><code>/bin/bash</code> 3.2: <code>syntax error near unexpected token &#96;&amp;'</code>; zsh: chạy</td></tr>
<tr><td><code>shopt -s lastpipe</code></td><td>chạy trong script</td><td>bash 3.2: <code>shopt: lastpipe: invalid shell option name</code></td></tr>
<tr><td><code>c=0; printf "a\\nb\\n" | while read l; do c=\$((c+1)); done; echo \$c</code></td><td><code>0</code> (vòng lặp chạy trong shell con)</td><td>bash 3.2: <code>0</code> · <strong>zsh: <code>2</code></strong> — zsh chạy khâu cuối ngay trong shell hiện tại</td></tr>
<tr><td><code>xargs -d '\\n'</code></td><td>chạy (GNU)</td><td><code>xargs: invalid option -- d</code> — dùng <code>tr '\\n' '\\0' | xargs -0</code></td></tr>
<tr><td>đầu vào rỗng cho <code>xargs lệnh</code></td><td>chạy <code>lệnh</code> một lần, không tham số</td><td>không chạy <code>lệnh</code> chút nào; vẫn nhận cờ <code>-r</code></td></tr>
<tr><td><code>\${PIPESTATUS[@]}</code>, <code>set -o pipefail</code></td><td>chạy</td><td>bash 3.2 cũng chạy (<code>yes | head -1</code> → <code>141 0</code>)</td></tr>
</table>
<p>Dòng zsh là dòng nguy hiểm: một vòng lặp "chạy ngon" trong terminal Mac của bạn sẽ đánh mất biến ngay khi đúng những dòng đó chạy trong một script bash trên máy chủ. Hãy thử script bằng đúng shell ghi trong shebang của nó, chứ đừng bằng cái shell mà terminal của bạn đang chạy.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> script dọn dẹp của bạn cùng nhóm dựng một danh sách file, mỗi dòng một tên, rồi rót vào <code>xargs</code>. Nó chạy ổn cho tới khi có người tải lên file "b c.txt". Rồi script deploy báo thành công dù một lần tải về đã hỏng. Hãy dựng lại cả hai chuyện, rồi sửa.</p><ol>
<li><code>mkdir -p ~/thu-linux/ch3/bt32 &amp;&amp; cd ~/thu-linux/ch3/bt32</code>, rồi <code>printf '%s\\n' a.txt 'b c.txt' &gt; ds.txt</code>.</li>
<li>Chạy <code>xargs touch &lt; ds.txt; ls</code> và đếm số file vừa xuất hiện. Xoá chúng (<code>rm -f a.txt b c.txt</code>) rồi làm lại cho an toàn với NUL: <code>tr '\\n' '\\0' &lt; ds.txt | xargs -0 touch; ls</code>.</li>
<li>Giả một khâu đầu thất bại: <code>cat khong-co.txt | sort | wc -l; echo "\${PIPESTATUS[@]}"</code>. Rồi làm lại sau <code>set -o pipefail</code> và in <code>\$?</code>; xong thì <code>set +o pipefail</code>.</li>
<li>Đếm số dòng của <code>ds.txt</code> hai lần bằng một vòng <code>while read -r</code> — một lần rót bằng <code>cat ds.txt |</code>, một lần bằng <code>&lt; ds.txt</code> — và in biến đếm sau mỗi lần.</li>
<li>Chứng minh SIGPIPE: <code>yes | head -1; echo "\${PIPESTATUS[@]}"</code>.</li></ol>
<p><strong>Đạt khi:</strong> lần <code>ls</code> đầu hiện <code>a.txt</code>, <code>b</code>, <code>c.txt</code> (cùng <code>ds.txt</code>) còn lần sau hiện <code>a.txt</code> và <code>b c.txt</code>; <code>PIPESTATUS</code> in <code>1 0 0</code> và lần chạy có <code>pipefail</code> cho <code>\$?</code> = 1; hai vòng lặp in 0 và 2; dòng cuối là <code>141 0</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Pipe (ống dẫn)</span><span class="v">Bộ đệm của nhân (mặc định 64 KB) nối stdout của tiến trình này với stdin của tiến trình kế; cả hai chạy cùng lúc.</span></div>
  <div class="kv"><span class="k">SIGPIPE (tín hiệu ống vỡ)</span><span class="v">Tín hiệu số 13, gửi cho tiến trình ghi vào một ống không còn ai đọc; mã thoát 141.</span></div>
  <div class="kv"><span class="k">Exit status / exit code (mã thoát)</span><span class="v">Con số một lệnh trả về: 0 là thành công, số khác là một kiểu thất bại.</span></div>
  <div class="kv"><span class="k">pipefail · PIPESTATUS</span><span class="v">Cho chuỗi ống thất bại khi bất kỳ khâu nào thất bại · mảng mã thoát của từng khâu.</span></div>
  <div class="kv"><span class="k">Subshell (shell con)</span><span class="v">Một bản sao con của shell; biến đổi bên trong nó biến mất khi nó thoát.</span></div>
  <div class="kv"><span class="k">Buffering (đệm)</span><span class="v">Gom output lại rồi mới ghi: theo dòng khi ra terminal, theo khối 4 KB+ khi vào ống.</span></div>
  <div class="kv"><span class="k">Process substitution (thay thế tiến trình)</span><span class="v"><code>&lt;(lệnh)</code>: output của lệnh hiện ra như một tên file, ví dụ <code>/dev/fd/63</code>.</span></div>
  <div class="kv"><span class="k">Argument (tham số)</span><span class="v">Một từ đưa cho lệnh trên dòng lệnh — thứ mà <code>xargs</code> biến các dòng đầu vào thành.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mọi khâu của chuỗi ống khởi động cùng lúc và nối nhau bằng bộ đệm 64 KB của nhân; không gì được ghi xuống đĩa.</li>
<li>Khi bên đọc thoát, bên ghi lãnh SIGPIPE (mã 141) — lý do <code>| head</code> tức thì trên file khổng lồ.</li>
<li>Chuỗi ống chỉ báo mã của khâu cuối: dùng <code>set -o pipefail</code>, <code>PIPESTATUS</code>, và <code>curl -f</code>.</li>
<li>Chỉ fd 1 vào ống; gộp stderr trước (<code>2&gt;&amp;1 |</code>) và dùng <code>--line-buffered</code> cho chuỗi ống theo dõi trực tiếp.</li>
<li>Mỗi khâu chạy trong shell con, nên rót vòng lặp bằng <code>&lt; file</code> hoặc <code>&lt; &lt;(lệnh)</code> khi cần giữ biến.</li>
<li><code>xargs</code> biến dòng thành tham số: cắt an toàn bằng <code>-0</code>, xem trước bằng <code>-t</code>, chạy song song bằng <code>-P</code>.</li>
</ul>


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
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
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
${slide('lx-03', 12, 'Ba phương ngữ regex: cùng một ý, khác số dấu gạch chéo')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">BRE — basic (default)</span><span class="lz-lnote"><code>grep</code> with no flag. <code>+</code>, <code>?</code>, <code>|</code>, <code>{}</code> and <code>()</code> are LITERAL characters; you must backslash them to get their special meaning. Historical, and the source of most confusion.</span></div>
  <div class="lz-layer"><span class="lz-lname">ERE — extended</span><span class="lz-lnote"><code>grep -E</code> (or <code>egrep</code>). <code>+ ? | ( ) { }</code> are special without escaping. This is what you already know from most languages. <strong>Use this by default.</strong></span></div>
  <div class="lz-layer"><span class="lz-lname">PCRE — Perl-compatible</span><span class="lz-lnote"><code>grep -P</code>. Adds <code>\\d</code>, <code>\\w</code>, <code>\\s</code>, non-greedy <code>*?</code>, lookahead <code>(?=…)</code>. Not on every system (macOS's grep lacks it), but on Linux it is there.</span></div>
</div>

<pre><code class="language-bash">grep    "colou\\?r" notes.txt      <span class="tok-comment"># BRE: ? must be escaped to mean "optional"</span>
grep -E "colou?r"   notes.txt      <span class="tok-comment"># ERE: reads like every other language</span>
grep -P "\\d{3}-\\d{4}"  notes.txt   <span class="tok-comment"># PCRE: \\d works, {3} works</span>
grep -F "1.2.3"     notes.txt      <span class="tok-comment"># FIXED string: no regex at all, dots are dots</span></code></pre>
<div class="callout ok"><strong>The practical rule:</strong> use <code>-E</code> for anything with a quantifier or alternation, <code>-P</code> when you want <code>\\d</code>/<code>\\w</code>/lookahead, and <code>-F</code> when your pattern is literal text that happens to contain <code>.</code>, <code>*</code> or <code>[</code> — searching for an IP address or a version number with plain <code>grep</code> means the dots match any character, so <code>1.2.3</code> also matches <code>1x2y3</code>. <code>-F</code> is also significantly faster.</div>

<h3>The regex pieces you actually need</h3>
${slide('lx-03', 13, 'Đọc một regex từ trái sang phải: mỗi mảnh một nghĩa')}
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
${slide('lx-03', 14, 'grep trả mã 0 · 1 · 2 — và các cờ dùng hằng ngày')}
<pre><code class="language-bash">grep -i error app.log            <span class="tok-comment"># case-insensitive</span>
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
<pre><code class="language-bash">grep -A3 "Exception" app.log     <span class="tok-comment"># the match + 3 lines AFTER</span>
grep -B2 "Exception" app.log     <span class="tok-comment"># the match + 2 lines BEFORE</span>
grep -C3 "Exception" app.log     <span class="tok-comment"># 3 lines of Context on both sides</span></code></pre>
<div class="out">2026-08-22 10:14:02 INFO  handling POST /api/v1/orders
2026-08-22 10:14:02 ERROR Exception: connection refused
2026-08-22 10:14:02 ERROR   at Pool.connect (db.ts:41)
2026-08-22 10:14:02 ERROR   at createOrder (orders.ts:88)
--</div>
<p>A stack trace is useless without the lines around it, and this is the difference between "there was an error" and knowing which request caused it. <code>-C3</code> should be your default when reading logs.</p>

<h3>Searching a codebase</h3>
<pre><code class="language-bash">grep -rn "TODO" .                                     <span class="tok-comment"># everything, including node_modules — slow</span>
grep -rn --include="*.ts" "TODO" src/                 <span class="tok-comment"># only .ts files</span>
grep -rn --exclude-dir={node_modules,.git,dist} "TODO" .
grep -rln "console.log" src/ | xargs -r wc -l         <span class="tok-comment"># which files, and how big</span></code></pre>
<div class="callout"><code>--exclude-dir</code> takes brace expansion (Lesson 2.2), so the third line is one shell word per directory. Without it, a <code>grep -rn</code> at the root of a Node project spends most of its time reading dependencies you did not write — often 95% of the wall-clock time.</div>

<h3>Multiple patterns</h3>
<pre><code class="language-bash">grep -E "ERROR|FATAL|panic" app.log      <span class="tok-comment"># alternation</span>
grep -e ERROR -e FATAL app.log           <span class="tok-comment"># repeated -e, no regex needed</span>
grep -f patterns.txt app.log             <span class="tok-comment"># one pattern per line, from a file</span>
grep -Fxf known-ids.txt all-ids.txt      <span class="tok-comment"># fixed, whole-line, from file — a fast set intersection</span></code></pre>
<p>That last line is a genuinely useful trick: <code>-F</code> (literal) <code>-x</code> (match the whole line) <code>-f</code> (patterns from a file) turns <code>grep</code> into a set-intersection tool that handles millions of lines far faster than a scripting language would.</p>

<h3>Exit status: grep as a test</h3>
<pre><code class="language-bash">if grep -q "ERROR" app.log; then
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

<h3>Try it step by step on a real log</h3>
<p>The rest of this chapter uses two small files: ten lines of an application log and ten lines of an nginx access log. Create them once with quoted heredocs (Lesson 3.1), exactly as written:</p>
<pre><code class="language-bash">mkdir -p ~/thu-linux/ch3/log &amp;&amp; cd ~/thu-linux/ch3/log
cat &lt;&lt;'EOF' &gt; app.log
2026-09-28 10:14:01 INFO  server listening on :3000
2026-09-28 10:14:02 INFO  handling POST /api/v1/orders
2026-09-28 10:14:02 ERROR Exception: connection refused
2026-09-28 10:14:02 ERROR   at Pool.connect (db.ts:41)
2026-09-28 10:14:02 ERROR   at createOrder (orders.ts:88)
2026-09-28 10:14:05 WARN  slow query 1840ms
2026-09-28 10:14:07 INFO  GET /api/v1/posts 200
2026-09-28 10:14:09 error retry 1/3 for job 7731
2026-09-28 10:14:11 FATAL out of memory
2026-09-28 10:14:12 INFO  GET /health 200
EOF
cat &lt;&lt;'EOF' &gt; access.log
203.0.113.45 - - [28/Sep/2026:10:14:01 +0000] "GET /api/v1/posts HTTP/1.1" 200 5120
198.51.100.7 - - [28/Sep/2026:10:14:02 +0000] "POST /api/v1/orders HTTP/1.1" 500 312
203.0.113.45 - - [28/Sep/2026:10:14:03 +0000] "GET /api/v1/posts HTTP/1.1" 200 5120
192.0.2.19 - - [28/Sep/2026:10:15:04 +0000] "GET /api/v1/auth/me HTTP/1.1" 401 64
203.0.113.45 - - [28/Sep/2026:10:15:05 +0000] "GET /api/v1/auth/me HTTP/1.1" 200 812
198.51.100.7 - - [28/Sep/2026:11:02:06 +0000] "GET /api/v1/posts HTTP/1.1" 200 5120
203.0.113.45 - - [28/Sep/2026:11:02:07 +0000] "GET /favicon.ico HTTP/1.1" 404 153
192.0.2.19 - - [28/Sep/2026:11:03:08 +0000] "GET /api/v1/posts HTTP/1.1" 200 5120
203.0.113.45 - - [28/Sep/2026:11:04:09 +0000] "POST /api/v1/orders HTTP/1.1" 201 96
198.51.100.7 - - [28/Sep/2026:11:05:10 +0000] "GET /api/v1/posts HTTP/1.1" 304 0
EOF
wc -l app.log access.log</code></pre>
<div class="out">  10 app.log
  10 access.log
  20 total</div>
<p>Now run these ten searches in order and compare each result with your prediction:</p>
<pre><code class="language-bash">grep -c ERROR app.log
grep -ci error app.log
grep -nE "ERROR|FATAL" app.log
grep -oE "[0-9]+ms" app.log
grep -w error app.log
grep -B1 -A2 Exception app.log
grep -oE '" [0-9]{3} ' access.log | sort | uniq -c
grep -q FATAL app.log; echo \$?
grep -q PANIC app.log; echo \$?
grep -q x missing.txt; echo \$?</code></pre>
<div class="out">3
4
3:2026-09-28 10:14:02 ERROR Exception: connection refused
4:2026-09-28 10:14:02 ERROR   at Pool.connect (db.ts:41)
5:2026-09-28 10:14:02 ERROR   at createOrder (orders.ts:88)
9:2026-09-28 10:14:11 FATAL out of memory
1840ms
2026-09-28 10:14:09 error retry 1/3 for job 7731
2026-09-28 10:14:02 INFO  handling POST /api/v1/orders
2026-09-28 10:14:02 ERROR Exception: connection refused
2026-09-28 10:14:02 ERROR   at Pool.connect (db.ts:41)
2026-09-28 10:14:02 ERROR   at createOrder (orders.ts:88)
      5 " 200
      1 " 201
      1 " 304
      1 " 401
      1 " 404
      1 " 500
0
1
grep: missing.txt: No such file or directory
2</div>
<p>Things to notice: <code>-c</code> counts lines, so the lowercase "error" only appears once <code>-i</code> is added; <code>-w error</code> finds just that lowercase line; the context flags show the request that caused the exception; <code>-o</code> plus <code>sort | uniq -c</code> turns grep into a counter of HTTP status codes; and the three exit codes are 0, 1 and 2 — "found", "not found" and "could not even look". (Ubuntu 24.04, GNU grep 3.11.)</p>

<h3>The grep flags, all in one table</h3>
<table>
<tr><th>Flag</th><th>Meaning</th><th>Example → real result on this lesson's files</th></tr>
<tr><td><code>-E</code> · <code>-F</code> · <code>-P</code></td><td>extended regex · fixed string · Perl regex (GNU only)</td><td><code>grep -cE "ERROR|FATAL" app.log</code> → <code>4</code></td></tr>
<tr><td><code>-i</code></td><td>ignore case</td><td><code>grep -ci error app.log</code> → <code>4</code> (3 ERROR + 1 error)</td></tr>
<tr><td><code>-v</code></td><td>invert: lines that do NOT match</td><td><code>grep -v INFO app.log | grep -vc ERROR</code> → <code>3</code></td></tr>
<tr><td><code>-w</code> · <code>-x</code></td><td>match a whole word · the whole line</td><td><code>grep -x "2026" app.log</code> → nothing, exit 1</td></tr>
<tr><td><code>-c</code></td><td>count matching LINES</td><td><code>grep -o ERROR app.log | wc -l</code> counts matches instead</td></tr>
<tr><td><code>-n</code> · <code>-H</code> · <code>-h</code></td><td>line numbers · always / never prefix the file name</td><td><code>grep -H FATAL app.log</code> → <code>app.log:2026-09-28 10:14:11 FATAL …</code></td></tr>
<tr><td><code>-l</code> · <code>-L</code></td><td>names of files that match · that do NOT match</td><td><code>grep -L FATAL app.log access.log</code> → <code>access.log</code></td></tr>
<tr><td><code>-o</code></td><td>print only the matched part, one per line</td><td><code>grep -oE "[0-9]+ms" app.log</code> → <code>1840ms</code></td></tr>
<tr><td><code>-m N</code></td><td>stop after N matching lines</td><td><code>grep -m1 ERROR app.log</code> → the first ERROR line only</td></tr>
<tr><td><code>-A</code> · <code>-B</code> · <code>-C N</code></td><td>N lines after · before · both sides</td><td><code>grep -B1 -A2 Exception app.log</code> → 4 lines</td></tr>
<tr><td><code>-r</code> · <code>--include</code> · <code>--exclude-dir</code></td><td>recurse · only these file names · skip these directories</td><td><code>grep -rn --include="*.log" FATAL .</code></td></tr>
<tr><td><code>-e P</code> · <code>-f file</code></td><td>add one pattern · read patterns from a file</td><td><code>grep -Fxf blocked.txt ips.txt</code></td></tr>
<tr><td><code>-q</code> · <code>-s</code></td><td>quiet, exit status only · hide "No such file" messages</td><td><code>grep -s x missing.txt; echo \$?</code> → <code>2</code>, silently</td></tr>
<tr><td><code>--color=always</code> · <code>--line-buffered</code></td><td>highlight even into a pipe · flush every line (Lesson 3.2)</td><td><code>tail -f app.log | grep --line-buffered ERROR</code></td></tr>
</table>
<p><strong>When to use which dialect:</strong> <code>-F</code> for literal text (IP addresses, version numbers, lists of IDs), <code>-E</code> for any pattern with <code>|</code>, <code>+</code>, <code>?</code>, <code>{}</code> or groups, and <code>-P</code> only on Linux when you really need <code>\\d</code>, lookahead or non-greedy matching. Plain BRE is for reading other people's old scripts.</p>

<h3>On macOS and WSL: what is different</h3>
${slide('lx-03', 15, 'grep trên Mac là BSD: cùng một mẫu, kết quả khác')}
<p>WSL2 runs GNU grep, identical to the server. The Mac is the problem: <code>/usr/bin/grep</code> is BSD grep (it reports <code>grep (BSD grep, GNU compatible) 2.6.0-FreeBSD</code> on macOS 27). "GNU compatible" is true for the flags, not for every regex corner. Run on a Mac M1 against the same <code>app.log</code>:</p>
<table>
<tr><th>Command</th><th>Ubuntu (GNU grep 3.11)</th><th>macOS 27 (<code>/usr/bin/grep</code>)</th></tr>
<tr><td><code>grep -oP "\\d+(?=ms)" app.log</code></td><td><code>1840</code></td><td><code>grep: invalid option -- P</code> (exit 2)</td></tr>
<tr><td><code>grep -oE "\\d+ms" app.log</code></td><td>nothing, exit 1 — in ERE <code>\\d</code> is just the letter <code>d</code></td><td><code>1840ms</code> — the reverse trap</td></tr>
<tr><td><code>grep -n "ERROR\\|FATAL" app.log</code></td><td>4 lines</td><td>4 lines (on this macOS version)</td></tr>
<tr><td><code>grep -v "/CEA201.pdf\$\\|/CSI106.pdf\$\\|/MAE101.pdf\$" list.txt</code></td><td>removes all three</td><td><strong>removes only the last one</strong> — see below</td></tr>
<tr><td>the same with <code>-vE</code> and plain <code>|</code></td><td>removes all three</td><td>removes all three</td></tr>
</table>
<p>That fourth row is a real incident from this course's own tooling: a filter meant to protect five files from a delete list kept only one, and four went into the list. In a POSIX basic regex, <code>\$</code> is an anchor only at the very end of the pattern; GNU grep also treats it as an anchor before <code>\\|</code>, BSD grep treats it as a literal dollar sign. So on the Mac only the last alternative — the one whose <code>\$</code> really is at the end — could ever match:</p>
<pre><code>printf 'a/CEA201.pdf\\na/CSI106.pdf\\na/MAE101.pdf\\na/keep.txt\\n' &gt; list.txt
/usr/bin/grep -v "/CEA201.pdf\$\\|/CSI106.pdf\$\\|/MAE101.pdf\$" list.txt
/usr/bin/grep -vE "/CEA201.pdf\$|/CSI106.pdf\$|/MAE101.pdf\$" list.txt</code></pre>
<div class="out">a/CEA201.pdf
a/CSI106.pdf
a/keep.txt
a/keep.txt</div>
<p>No error, no warning, a plausible-looking result. The portable habits: <strong><code>-E</code> for every alternation</strong>, <code>[0-9]</code> or <code>[[:digit:]]</code> instead of <code>\\d</code>, <code>grep -Fxf file</code> for fixed lists, and <strong>count the expected lines before trusting a filter</strong>. One more Mac trap: your interactive shell may wrap <code>grep</code> in an alias or function (Ubuntu's default <code>~/.bashrc</code> itself has <code>alias grep='grep --color=auto'</code>), so <code>type -a grep</code> first, and call <code>/usr/bin/grep</code> by full path when you are measuring behaviour.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> Monday morning, the API returned 500s for a few minutes. You have the two log files from "Try it step by step" (<code>~/thu-linux/ch3/log</code>) and ten minutes before the team stand-up. Answer each question with one grep command.</p><ol>
<li>How many lines mention an error or a fatal failure in ANY letter case? (<code>-c</code>, <code>-i</code>, <code>-E</code> with <code>|</code>.)</li>
<li>Show the exception together with the one request line before it and the two stack-trace lines after it, then count those lines with <code>| wc -l</code>.</li>
<li>Pull out only the HTTP status codes of 400 or more from <code>access.log</code> with <code>-oE</code> and a character class like <code>[45][0-9]{2}</code>.</li>
<li>Write a one-line check that prints <code>CO FATAL</code> only if the log contains FATAL (<code>if grep -q …; then …; fi</code>).</li>
<li>Prove to yourself that "not found" and "file missing" are different: run <code>grep -q x missing.txt; echo \$?</code>.</li></ol>
<p><strong>Done when:</strong> question 1 prints <code>5</code>; question 2 prints 4 lines; question 3 prints exactly three matches (<code>" 500 </code>, <code>" 401 </code>, <code>" 404 </code>); the check prints <code>CO FATAL</code>; and the last command prints <code>2</code>, not 1.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Regular expression (regex)</span><span class="v">A pattern language describing the shape of text: <code>^[0-9]+ms\$</code>.</span></div>
  <div class="kv"><span class="k">BRE / ERE / PCRE</span><span class="v">Basic, extended and Perl-compatible regex — the same ideas with different escaping rules.</span></div>
  <div class="kv"><span class="k">Anchor</span><span class="v"><code>^</code> and <code>\$</code>: match a position (start / end of line), not a character.</span></div>
  <div class="kv"><span class="k">Character class</span><span class="v"><code>[abc]</code>, <code>[^0-9]</code>, <code>[[:digit:]]</code>: exactly one character out of a set.</span></div>
  <div class="kv"><span class="k">Quantifier</span><span class="v"><code>*</code> <code>+</code> <code>?</code> <code>{m,n}</code>: how many times the previous piece repeats.</span></div>
  <div class="kv"><span class="k">Alternation</span><span class="v"><code>a|b</code>: either this or that (needs <code>-E</code>, or <code>\\|</code> in GNU BRE).</span></div>
  <div class="kv"><span class="k">Context lines</span><span class="v">Lines printed around a match with <code>-A</code>, <code>-B</code>, <code>-C</code>.</span></div>
  <div class="kv"><span class="k">Exit status 0 / 1 / 2</span><span class="v">grep's answer: found / not found / error such as a missing file.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>grep prints matching lines; the hard part is knowing which regex dialect you are writing.</li>
<li>Default to <code>-E</code>; use <code>-F</code> for literal text with dots or brackets, and <code>-P</code> only on Linux.</li>
<li><code>-i -v -w -n -c -l -o</code> and <code>-A/-B/-C</code> cover almost every daily search.</li>
<li>Exit status 0/1/2 makes <code>grep -q</code> a test — and 2 means "error", never "no match".</li>
<li>On a Mac, <code>-P</code> is missing, <code>\\d</code> means the opposite, and <code>\$</code> before <code>\\|</code> is a literal: write <code>-E</code> and count the result.</li>
<li>Always quote the pattern, and build it one piece at a time with <code>--color=always</code>.</li>
</ul>


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
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
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
${slide('lx-03', 12, 'Ba phương ngữ regex: cùng một ý, khác số dấu gạch chéo')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">BRE — cơ bản (mặc định)</span><span class="lz-lnote"><code>grep</code> không kèm cờ nào. <code>+</code>, <code>?</code>, <code>|</code>, <code>{}</code> và <code>()</code> là ký tự NGUYÊN VĂN; muốn chúng mang nghĩa đặc biệt thì phải thêm gạch chéo ngược. Có tính lịch sử, và là nguồn gốc của phần lớn sự rối rắm.</span></div>
  <div class="lz-layer"><span class="lz-lname">ERE — mở rộng</span><span class="lz-lnote"><code>grep -E</code> (hoặc <code>egrep</code>). <code>+ ? | ( ) { }</code> mang nghĩa đặc biệt mà không cần thoát. Đây chính là thứ bạn đã quen từ hầu hết ngôn ngữ lập trình. <strong>Hãy lấy cái này làm mặc định.</strong></span></div>
  <div class="lz-layer"><span class="lz-lname">PCRE — tương thích Perl</span><span class="lz-lnote"><code>grep -P</code>. Thêm <code>\\d</code>, <code>\\w</code>, <code>\\s</code>, dạng không tham <code>*?</code>, nhìn trước <code>(?=…)</code>. Không có trên mọi hệ (grep của macOS thiếu nó), nhưng trên Linux thì có.</span></div>
</div>

<pre><code class="language-bash">grep    "colou\\?r" notes.txt      <span class="tok-comment"># BRE: ? phải thoát mới mang nghĩa "có cũng được"</span>
grep -E "colou?r"   notes.txt      <span class="tok-comment"># ERE: đọc y như mọi ngôn ngữ khác</span>
grep -P "\\d{3}-\\d{4}"  notes.txt   <span class="tok-comment"># PCRE: \\d chạy, {3} chạy</span>
grep -F "1.2.3"     notes.txt      <span class="tok-comment"># chuỗi CỐ ĐỊNH: không regex gì cả, dấu chấm là dấu chấm</span></code></pre>
<div class="callout ok"><strong>Quy tắc thực dụng:</strong> dùng <code>-E</code> cho mọi thứ có lượng từ hoặc phép hoặc, dùng <code>-P</code> khi bạn muốn <code>\\d</code>/<code>\\w</code>/nhìn trước, và dùng <code>-F</code> khi mẫu của bạn là văn bản nguyên văn mà tình cờ có chứa <code>.</code>, <code>*</code> hay <code>[</code> — tìm một địa chỉ IP hay một số phiên bản bằng <code>grep</code> trần nghĩa là các dấu chấm khớp với ký tự bất kỳ, nên <code>1.2.3</code> cũng khớp cả <code>1x2y3</code>. <code>-F</code> còn nhanh hơn đáng kể.</div>

<h3>Những mảnh regex bạn thật sự cần</h3>
${slide('lx-03', 13, 'Đọc một regex từ trái sang phải: mỗi mảnh một nghĩa')}
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
${slide('lx-03', 14, 'grep trả mã 0 · 1 · 2 — và các cờ dùng hằng ngày')}
<pre><code class="language-bash">grep -i error app.log            <span class="tok-comment"># không phân biệt hoa thường</span>
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
<pre><code class="language-bash">grep -A3 "Exception" app.log     <span class="tok-comment"># dòng khớp + 3 dòng SAU</span>
grep -B2 "Exception" app.log     <span class="tok-comment"># dòng khớp + 2 dòng TRƯỚC</span>
grep -C3 "Exception" app.log     <span class="tok-comment"># 3 dòng ngữ cảnh ở cả hai phía</span></code></pre>
<div class="out">2026-08-22 10:14:02 INFO  handling POST /api/v1/orders
2026-08-22 10:14:02 ERROR Exception: connection refused
2026-08-22 10:14:02 ERROR   at Pool.connect (db.ts:41)
2026-08-22 10:14:02 ERROR   at createOrder (orders.ts:88)
--</div>
<p>Một vệt gọi hàm lỗi thì vô dụng nếu thiếu các dòng xung quanh, và đây chính là khác biệt giữa "có lỗi xảy ra" với việc biết được yêu cầu nào gây ra lỗi đó. <code>-C3</code> nên là mặc định của bạn khi đọc log.</p>

<h3>Tìm trong một kho mã</h3>
<pre><code class="language-bash">grep -rn "TODO" .                                     <span class="tok-comment"># mọi thứ, kể cả node_modules — chậm</span>
grep -rn --include="*.ts" "TODO" src/                 <span class="tok-comment"># chỉ file .ts</span>
grep -rn --exclude-dir={node_modules,.git,dist} "TODO" .
grep -rln "console.log" src/ | xargs -r wc -l         <span class="tok-comment"># những file nào, và lớn cỡ nào</span></code></pre>
<div class="callout"><code>--exclude-dir</code> nhận khai triển ngoặc nhọn (Bài 2.2), nên dòng thứ ba biến thành mỗi thư mục một từ shell. Không có nó, một lệnh <code>grep -rn</code> ở gốc một dự án Node dành phần lớn thời gian đi đọc những thư viện không phải bạn viết — thường là 95% tổng thời gian chạy.</div>

<h3>Nhiều mẫu cùng lúc</h3>
<pre><code class="language-bash">grep -E "ERROR|FATAL|panic" app.log      <span class="tok-comment"># phép hoặc</span>
grep -e ERROR -e FATAL app.log           <span class="tok-comment"># lặp lại -e, không cần regex</span>
grep -f patterns.txt app.log             <span class="tok-comment"># mỗi dòng một mẫu, đọc từ file</span>
grep -Fxf known-ids.txt all-ids.txt      <span class="tok-comment"># cố định, khớp nguyên dòng, từ file — một phép giao tập hợp nhanh</span></code></pre>
<p>Dòng cuối là một mẹo thật sự hữu ích: <code>-F</code> (nguyên văn) <code>-x</code> (khớp nguyên dòng) <code>-f</code> (mẫu lấy từ file) biến <code>grep</code> thành một công cụ giao tập hợp, xử lý hàng triệu dòng nhanh hơn nhiều so với một ngôn ngữ script.</p>

<h3>Mã thoát: dùng grep như một phép kiểm</h3>
<pre><code class="language-bash">if grep -q "ERROR" app.log; then
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

<h3>Chạy thử từng bước trên một file log thật</h3>
<p>Phần còn lại của chương dùng hai file nhỏ: mười dòng log ứng dụng và mười dòng access log của nginx. Tạo chúng một lần bằng heredoc có nháy (Bài 3.1), đúng y như viết dưới đây:</p>
<pre><code class="language-bash">mkdir -p ~/thu-linux/ch3/log &amp;&amp; cd ~/thu-linux/ch3/log
cat &lt;&lt;'EOF' &gt; app.log
2026-09-28 10:14:01 INFO  server listening on :3000
2026-09-28 10:14:02 INFO  handling POST /api/v1/orders
2026-09-28 10:14:02 ERROR Exception: connection refused
2026-09-28 10:14:02 ERROR   at Pool.connect (db.ts:41)
2026-09-28 10:14:02 ERROR   at createOrder (orders.ts:88)
2026-09-28 10:14:05 WARN  slow query 1840ms
2026-09-28 10:14:07 INFO  GET /api/v1/posts 200
2026-09-28 10:14:09 error retry 1/3 for job 7731
2026-09-28 10:14:11 FATAL out of memory
2026-09-28 10:14:12 INFO  GET /health 200
EOF
cat &lt;&lt;'EOF' &gt; access.log
203.0.113.45 - - [28/Sep/2026:10:14:01 +0000] "GET /api/v1/posts HTTP/1.1" 200 5120
198.51.100.7 - - [28/Sep/2026:10:14:02 +0000] "POST /api/v1/orders HTTP/1.1" 500 312
203.0.113.45 - - [28/Sep/2026:10:14:03 +0000] "GET /api/v1/posts HTTP/1.1" 200 5120
192.0.2.19 - - [28/Sep/2026:10:15:04 +0000] "GET /api/v1/auth/me HTTP/1.1" 401 64
203.0.113.45 - - [28/Sep/2026:10:15:05 +0000] "GET /api/v1/auth/me HTTP/1.1" 200 812
198.51.100.7 - - [28/Sep/2026:11:02:06 +0000] "GET /api/v1/posts HTTP/1.1" 200 5120
203.0.113.45 - - [28/Sep/2026:11:02:07 +0000] "GET /favicon.ico HTTP/1.1" 404 153
192.0.2.19 - - [28/Sep/2026:11:03:08 +0000] "GET /api/v1/posts HTTP/1.1" 200 5120
203.0.113.45 - - [28/Sep/2026:11:04:09 +0000] "POST /api/v1/orders HTTP/1.1" 201 96
198.51.100.7 - - [28/Sep/2026:11:05:10 +0000] "GET /api/v1/posts HTTP/1.1" 304 0
EOF
wc -l app.log access.log</code></pre>
<div class="out">  10 app.log
  10 access.log
  20 total</div>
<p>Giờ chạy mười phép tìm này theo thứ tự và so từng kết quả với dự đoán của bạn:</p>
<pre><code class="language-bash">grep -c ERROR app.log
grep -ci error app.log
grep -nE "ERROR|FATAL" app.log
grep -oE "[0-9]+ms" app.log
grep -w error app.log
grep -B1 -A2 Exception app.log
grep -oE '" [0-9]{3} ' access.log | sort | uniq -c
grep -q FATAL app.log; echo \$?
grep -q PANIC app.log; echo \$?
grep -q x missing.txt; echo \$?</code></pre>
<div class="out">3
4
3:2026-09-28 10:14:02 ERROR Exception: connection refused
4:2026-09-28 10:14:02 ERROR   at Pool.connect (db.ts:41)
5:2026-09-28 10:14:02 ERROR   at createOrder (orders.ts:88)
9:2026-09-28 10:14:11 FATAL out of memory
1840ms
2026-09-28 10:14:09 error retry 1/3 for job 7731
2026-09-28 10:14:02 INFO  handling POST /api/v1/orders
2026-09-28 10:14:02 ERROR Exception: connection refused
2026-09-28 10:14:02 ERROR   at Pool.connect (db.ts:41)
2026-09-28 10:14:02 ERROR   at createOrder (orders.ts:88)
      5 " 200
      1 " 201
      1 " 304
      1 " 401
      1 " 404
      1 " 500
0
1
grep: missing.txt: No such file or directory
2</div>
<p>Những điều cần để ý: <code>-c</code> đếm DÒNG, nên chữ "error" viết thường chỉ được tính khi thêm <code>-i</code>; <code>-w error</code> tìm đúng dòng viết thường đó; các cờ ngữ cảnh cho thấy yêu cầu nào gây ra ngoại lệ; <code>-o</code> cộng <code>sort | uniq -c</code> biến grep thành máy đếm mã trạng thái HTTP; và ba mã thoát là 0, 1, 2 — "tìm thấy", "không thấy" và "không tìm nổi". (Ubuntu 24.04, GNU grep 3.11.)</p>

<h3>Mọi cờ của grep trong một bảng</h3>
<table>
<tr><th>Cờ</th><th>Nghĩa</th><th>Ví dụ → kết quả thật trên file của bài</th></tr>
<tr><td><code>-E</code> · <code>-F</code> · <code>-P</code></td><td>regex mở rộng · chuỗi cố định · regex kiểu Perl (chỉ GNU)</td><td><code>grep -cE "ERROR|FATAL" app.log</code> → <code>4</code></td></tr>
<tr><td><code>-i</code></td><td>bỏ qua hoa/thường</td><td><code>grep -ci error app.log</code> → <code>4</code> (3 ERROR + 1 error)</td></tr>
<tr><td><code>-v</code></td><td>đảo: những dòng KHÔNG khớp</td><td><code>grep -v INFO app.log | grep -vc ERROR</code> → <code>3</code></td></tr>
<tr><td><code>-w</code> · <code>-x</code></td><td>khớp nguyên TỪ · khớp nguyên DÒNG</td><td><code>grep -x "2026" app.log</code> → không gì, mã 1</td></tr>
<tr><td><code>-c</code></td><td>đếm số DÒNG khớp</td><td><code>grep -o ERROR app.log | wc -l</code> mới đếm số LẦN khớp</td></tr>
<tr><td><code>-n</code> · <code>-H</code> · <code>-h</code></td><td>số dòng · luôn / không bao giờ in tên file phía trước</td><td><code>grep -H FATAL app.log</code> → <code>app.log:2026-09-28 10:14:11 FATAL …</code></td></tr>
<tr><td><code>-l</code> · <code>-L</code></td><td>tên file CÓ khớp · tên file KHÔNG khớp</td><td><code>grep -L FATAL app.log access.log</code> → <code>access.log</code></td></tr>
<tr><td><code>-o</code></td><td>chỉ in phần khớp, mỗi lần một dòng</td><td><code>grep -oE "[0-9]+ms" app.log</code> → <code>1840ms</code></td></tr>
<tr><td><code>-m N</code></td><td>dừng sau N dòng khớp</td><td><code>grep -m1 ERROR app.log</code> → chỉ dòng ERROR đầu tiên</td></tr>
<tr><td><code>-A</code> · <code>-B</code> · <code>-C N</code></td><td>N dòng sau · trước · hai phía</td><td><code>grep -B1 -A2 Exception app.log</code> → 4 dòng</td></tr>
<tr><td><code>-r</code> · <code>--include</code> · <code>--exclude-dir</code></td><td>đệ quy · chỉ những tên file này · bỏ qua những thư mục này</td><td><code>grep -rn --include="*.log" FATAL .</code></td></tr>
<tr><td><code>-e P</code> · <code>-f file</code></td><td>thêm một mẫu · đọc các mẫu từ file</td><td><code>grep -Fxf blocked.txt ips.txt</code></td></tr>
<tr><td><code>-q</code> · <code>-s</code></td><td>im lặng, chỉ trả mã thoát · giấu thông báo "No such file"</td><td><code>grep -s x missing.txt; echo \$?</code> → <code>2</code>, không in gì</td></tr>
<tr><td><code>--color=always</code> · <code>--line-buffered</code></td><td>tô màu cả khi vào ống · xả từng dòng (Bài 3.2)</td><td><code>tail -f app.log | grep --line-buffered ERROR</code></td></tr>
</table>
<p><strong>Khi nào dùng phương ngữ nào:</strong> <code>-F</code> cho văn bản nguyên văn (địa chỉ IP, số phiên bản, danh sách ID), <code>-E</code> cho mọi mẫu có <code>|</code>, <code>+</code>, <code>?</code>, <code>{}</code> hay nhóm, và <code>-P</code> chỉ trên Linux khi bạn thật sự cần <code>\\d</code>, nhìn trước hay khớp không tham. BRE trơn là để đọc script cũ của người khác.</p>

<h3>Trên macOS và WSL khác gì</h3>
${slide('lx-03', 15, 'grep trên Mac là BSD: cùng một mẫu, kết quả khác')}
<p>WSL2 chạy GNU grep, y hệt máy chủ. Máy Mac mới là vấn đề: <code>/usr/bin/grep</code> là BSD grep (trên macOS 27 nó tự báo <code>grep (BSD grep, GNU compatible) 2.6.0-FreeBSD</code>). "Tương thích GNU" đúng với các cờ, không đúng với mọi ngóc ngách của regex. Chạy trên Mac M1 với đúng file <code>app.log</code> ở trên:</p>
<table>
<tr><th>Lệnh</th><th>Ubuntu (GNU grep 3.11)</th><th>macOS 27 (<code>/usr/bin/grep</code>)</th></tr>
<tr><td><code>grep -oP "\\d+(?=ms)" app.log</code></td><td><code>1840</code></td><td><code>grep: invalid option -- P</code> (mã 2)</td></tr>
<tr><td><code>grep -oE "\\d+ms" app.log</code></td><td>không ra gì, mã 1 — trong ERE, <code>\\d</code> chỉ là chữ <code>d</code></td><td><code>1840ms</code> — cái bẫy theo chiều ngược lại</td></tr>
<tr><td><code>grep -n "ERROR\\|FATAL" app.log</code></td><td>4 dòng</td><td>4 dòng (trên phiên bản macOS này)</td></tr>
<tr><td><code>grep -v "/CEA201.pdf\$\\|/CSI106.pdf\$\\|/MAE101.pdf\$" list.txt</code></td><td>loại cả ba</td><td><strong>chỉ loại cái cuối</strong> — xem dưới</td></tr>
<tr><td>như trên nhưng <code>-vE</code> và <code>|</code> trơn</td><td>loại cả ba</td><td>loại cả ba</td></tr>
</table>
<p>Dòng thứ tư là một sự cố có thật từ chính công cụ của khoá này: một bộ lọc dùng để giữ lại năm file khỏi danh sách xoá chỉ giữ được một, bốn file kia đi thẳng vào danh sách. Trong regex cơ bản POSIX, <code>\$</code> chỉ là neo khi đứng ở TẬN CÙNG mẫu; GNU grep coi nó là neo cả khi đứng trước <code>\\|</code>, còn BSD grep coi nó là một dấu đô-la bình thường. Nên trên Mac chỉ nhánh cuối cùng — nhánh có <code>\$</code> thật sự nằm ở cuối — mới có thể khớp:</p>
<pre><code>printf 'a/CEA201.pdf\\na/CSI106.pdf\\na/MAE101.pdf\\na/keep.txt\\n' &gt; list.txt
/usr/bin/grep -v "/CEA201.pdf\$\\|/CSI106.pdf\$\\|/MAE101.pdf\$" list.txt
/usr/bin/grep -vE "/CEA201.pdf\$|/CSI106.pdf\$|/MAE101.pdf\$" list.txt</code></pre>
<div class="out">a/CEA201.pdf
a/CSI106.pdf
a/keep.txt
a/keep.txt</div>
<p>Không lỗi, không cảnh báo, một kết quả trông rất hợp lý. Thói quen viết một lần chạy mọi nơi: <strong><code>-E</code> cho mọi phép hoặc</strong>, <code>[0-9]</code> hoặc <code>[[:digit:]]</code> thay cho <code>\\d</code>, <code>grep -Fxf file</code> cho danh sách cố định, và <strong>đếm trước số dòng phải ra rồi mới tin một bộ lọc</strong>. Thêm một bẫy trên Mac: shell tương tác của bạn có thể bọc <code>grep</code> bằng alias hay hàm (chính <code>~/.bashrc</code> mặc định của Ubuntu cũng có <code>alias grep='grep --color=auto'</code>), nên hãy <code>type -a grep</code> trước, và gọi <code>/usr/bin/grep</code> bằng đường dẫn đầy đủ khi đang đo hành vi.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> sáng thứ Hai, API trả lỗi 500 trong vài phút. Bạn có hai file log ở phần "Chạy thử từng bước" (<code>~/thu-linux/ch3/log</code>) và mười phút trước buổi họp đứng của nhóm. Trả lời mỗi câu bằng đúng một lệnh grep.</p><ol>
<li>Có bao nhiêu dòng nhắc tới lỗi (error) hoặc lỗi chết (fatal), viết HOA hay thường đều tính? (<code>-c</code>, <code>-i</code>, <code>-E</code> với <code>|</code>.)</li>
<li>Hiện ngoại lệ cùng một dòng yêu cầu ngay trước nó và hai dòng vệt gọi hàm ngay sau nó, rồi đếm số dòng đó bằng <code>| wc -l</code>.</li>
<li>Rút ra CHỈ những mã trạng thái HTTP từ 400 trở lên trong <code>access.log</code> bằng <code>-oE</code> và một lớp ký tự như <code>[45][0-9]{2}</code>.</li>
<li>Viết một dòng kiểm chỉ in <code>CO FATAL</code> khi log có chữ FATAL (<code>if grep -q …; then …; fi</code>).</li>
<li>Tự chứng minh "không thấy" khác "thiếu file": chạy <code>grep -q x missing.txt; echo \$?</code>.</li></ol>
<p><strong>Đạt khi:</strong> câu 1 in <code>5</code>; câu 2 in 4 dòng; câu 3 in đúng ba kết quả (<code>" 500 </code>, <code>" 401 </code>, <code>" 404 </code>); câu 4 in <code>CO FATAL</code>; và lệnh cuối in <code>2</code>, không phải 1.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Regular expression — regex (biểu thức chính quy)</span><span class="v">Ngôn ngữ mẫu mô tả HÌNH DẠNG của chữ: <code>^[0-9]+ms\$</code>.</span></div>
  <div class="kv"><span class="k">BRE / ERE / PCRE (cơ bản / mở rộng / kiểu Perl)</span><span class="v">Ba phương ngữ regex — cùng ý tưởng, khác luật đặt gạch chéo ngược.</span></div>
  <div class="kv"><span class="k">Anchor (neo)</span><span class="v"><code>^</code> và <code>\$</code>: khớp một VỊ TRÍ (đầu / cuối dòng), không khớp ký tự nào.</span></div>
  <div class="kv"><span class="k">Character class (lớp ký tự)</span><span class="v"><code>[abc]</code>, <code>[^0-9]</code>, <code>[[:digit:]]</code>: đúng một ký tự lấy từ một tập.</span></div>
  <div class="kv"><span class="k">Quantifier (lượng từ)</span><span class="v"><code>*</code> <code>+</code> <code>?</code> <code>{m,n}</code>: mảnh đứng trước lặp bao nhiêu lần.</span></div>
  <div class="kv"><span class="k">Alternation (phép hoặc)</span><span class="v"><code>a|b</code>: cái này hoặc cái kia (cần <code>-E</code>, hoặc <code>\\|</code> trong BRE của GNU).</span></div>
  <div class="kv"><span class="k">Context lines (dòng ngữ cảnh)</span><span class="v">Các dòng in ra quanh chỗ khớp bằng <code>-A</code>, <code>-B</code>, <code>-C</code>.</span></div>
  <div class="kv"><span class="k">Exit status 0 / 1 / 2 (mã thoát)</span><span class="v">Câu trả lời của grep: thấy / không thấy / lỗi, ví dụ thiếu file.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>grep in những dòng khớp mẫu; phần khó là biết mình đang viết phương ngữ regex nào.</li>
<li>Mặc định dùng <code>-E</code>; dùng <code>-F</code> cho văn bản nguyên văn có dấu chấm hay ngoặc, và <code>-P</code> chỉ trên Linux.</li>
<li><code>-i -v -w -n -c -l -o</code> cùng <code>-A/-B/-C</code> phủ gần như mọi phép tìm hằng ngày.</li>
<li>Mã thoát 0/1/2 biến <code>grep -q</code> thành một phép kiểm — và 2 nghĩa là "lỗi", không bao giờ là "không khớp".</li>
<li>Trên Mac, không có <code>-P</code>, <code>\\d</code> mang nghĩa ngược lại, và <code>\$</code> đứng trước <code>\\|</code> là ký tự thường: viết <code>-E</code> và đếm kết quả.</li>
<li>Luôn đặt mẫu trong nháy, và dựng nó từng mảnh một với <code>--color=always</code>.</li>
</ul>


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
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
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
${slide('lx-03', 16, 'cut coi MỖI dấu cách là một ngăn — output căn lề thì dùng awk')}
<pre><code>cut -d: -f1 /etc/passwd            <span class="tok-comment"># -d sets the delimiter, -f picks fields</span>
cut -d: -f1,7 /etc/passwd          <span class="tok-comment"># several fields</span>
cut -d, -f2-4 data.csv             <span class="tok-comment"># a range</span>
cut -c1-8 log.txt                  <span class="tok-comment"># by CHARACTER position instead</span></code></pre>
<div class="out">root
daemon
deploy</div>
<div class="callout warn"><code>cut</code> has a real limitation: <strong>it treats every single delimiter as a separator</strong>, so two spaces means an empty field between them. On space-aligned output such as <code>ls -l</code> or <code>ps</code>, <code>cut -d' ' -f3</code> returns blanks unpredictably. Use <code>awk '{print \$3}'</code> there — awk collapses runs of whitespace by default. Reach for <code>cut</code> when the delimiter is a real single character (<code>:</code>, <code>,</code>, tab) and for <code>awk</code> otherwise.</div>

<h3>sort — and the flags that make it correct</h3>
${slide('lx-03', 17, 'sort so sánh CHỮ, trừ khi bạn bảo khác: -n -h -V -k2,2')}
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
${slide('lx-03', 18, 'Đếm theo nhóm trong 5 chặng: awk | sort | uniq -c | sort -rn | head')}
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
${slide('lx-03', 19, 'comm chia 3 cột, paste ghép ngang, join nối theo khoá')}
<pre><code>paste names.txt scores.txt              <span class="tok-comment"># side by side, tab-separated</span>
paste -d, names.txt scores.txt          <span class="tok-comment"># comma instead</span>
paste -sd, names.txt                    <span class="tok-comment"># -s: all lines onto ONE line</span>
join -t, -1 1 -2 1 users.csv orders.csv <span class="tok-comment"># a real relational join on field 1</span>
comm -13 &lt;(sort a.txt) &lt;(sort b.txt)    <span class="tok-comment"># lines only in b</span></code></pre>
<div class="out">$ paste -sd, fruits.txt
apple,banana,cherry</div>
<p><code>comm</code> prints three columns — only-in-A, only-in-B, in-both — and the digits suppress columns. <code>-13</code> means "hide columns 1 and 3", leaving only-in-B. Both inputs <strong>must be sorted</strong>, which is why process substitution pairs with it so naturally.</p>

<h3>comm, paste, join and column in depth</h3>
<p>These four answer the questions you otherwise solve with a spreadsheet: "what is in list A but not list B?", "put these two columns side by side", "match orders to users by ID", "make this readable". Start with two lists — the packages your project needs, and what is actually installed on the VPS:</p>
<pre><code class="language-bash">mkdir -p ~/thu-linux/ch3/so &amp;&amp; cd ~/thu-linux/ch3/so
printf 'curl\\ngit\\njq\\nnginx\\npostgresql\\n' &gt; can.txt
printf 'git\\nnginx\\ncurl\\nhtop\\n' &gt; da-cai.txt
comm &lt;(sort can.txt) &lt;(sort da-cai.txt)</code></pre>
<div class="out">		curl
		git
	htop
jq
		nginx
postgresql</div>
<p>No indent = <strong>column 1</strong>, only in the first file (still missing). One tab = <strong>column 2</strong>, only in the second (installed but not needed). Two tabs = <strong>column 3</strong>, in both. The digit flags <em>hide</em> columns, so you name the ones you do not want — <code>-23</code> leaves column 1:</p>
<pre><code>comm -23 &lt;(sort can.txt) &lt;(sort da-cai.txt)
comm -13 &lt;(sort can.txt) &lt;(sort da-cai.txt)
comm -12 &lt;(sort can.txt) &lt;(sort da-cai.txt)</code></pre>
<div class="out">jq
postgresql
htop
curl
git
nginx</div>
<pre><code>comm can.txt da-cai.txt; echo "exit=\$?"</code></pre>
<div class="out">curl
		git
jq
		nginx
comm: file 2 is not in sorted order
	curl
	htop
postgresql
comm: input is not in sorted order
exit=1</div>
<p>Forgetting to sort is not a style problem: GNU <code>comm</code> printed a wrong answer (it claims <code>curl</code> is missing) and only warned about it, exit 1. The Mac's <code>comm</code> printed the same wrong answer with <strong>no warning and exit 0</strong>. Always feed it <code>&lt;(sort …)</code>, with the same locale on both sides.</p>
<p><code>paste</code> glues files line by line with a TAB (or <code>-d</code>); <code>-s</code> joins one file's lines into a single line, and <code>paste - -</code> turns every two lines of stdin into one row:</p>
<pre><code>printf 'an\\nbinh\\nchi\\n' &gt; ten.txt
printf '8.5\\n6.0\\n9.25\\n' &gt; diem.txt
paste ten.txt diem.txt
paste -d, ten.txt diem.txt
paste -sd, ten.txt
printf 'k1\\nv1\\nk2\\nv2\\n' | paste - -</code></pre>
<div class="out">an	8.5
binh	6.0
chi	9.25
an,8.5
binh,6.0
chi,9.25
an,binh,chi
k1	v1
k2	v2</div>
<p><code>join</code> is a real relational join on a key field (both inputs sorted on that key, like <code>comm</code>); <code>-a1</code> also keeps lines from file 1 that have no partner — a LEFT JOIN. <code>column -t</code> aligns anything delimited into a table, and GNU <code>column -o</code> sets the output separator:</p>
<pre><code>printf 'u1,an\\nu2,binh\\nu3,chi\\n' &gt; users.csv
printf 'u1,ORD-9\\nu3,ORD-7\\nu3,ORD-8\\n' &gt; orders.csv
join -t, users.csv orders.csv
join -t, -a1 users.csv orders.csv
printf 'ten,vai tro,diem\\nan,backend,8.5\\nbinh,frontend,6\\n' &gt; diem.csv
column -t -s, diem.csv
column -t -s, -o ' | ' diem.csv</code></pre>
<div class="out">u1,an,ORD-9
u3,chi,ORD-7
u3,chi,ORD-8
u1,an,ORD-9
u2,binh
u3,chi,ORD-7
u3,chi,ORD-8
ten   vai tro   diem
an    backend   8.5
binh  frontend  6
ten  | vai tro  | diem
an   | backend  | 8.5
binh | frontend | 6</div>

<h3>column and nl — making output readable</h3>
<pre><code>column -t -s: /etc/passwd        <span class="tok-comment"># align into a table</span>
column -t -s, data.csv | less -S <span class="tok-comment"># -S: do not wrap long lines</span>
nl -ba script.sh                 <span class="tok-comment"># number every line, including blanks</span>
fold -w 80 long.txt              <span class="tok-comment"># hard-wrap at 80 columns</span></code></pre>
<div class="out">root   x  0     0     root   /root       /bin/bash
deploy x  1001  1001         /home/deploy /bin/bash</div>
<p><code>column -t</code> turns any delimited output into a readable table, and it is the single quickest way to make a CSV legible in a terminal without leaving it.</p>

<h3>diff and cmp: what exactly changed between two files</h3>
${slide('lx-03', 20, 'diff -u đọc như git diff: @@ vị trí, “-” dòng cũ, “+” dòng mới')}
<p>Every time you change a config on a server, the honest question afterwards is "what did I actually change?". <code>diff</code> answers it line by line. Two versions of an SSH configuration:</p>
<pre><code class="language-bash">mkdir -p ~/thu-linux/ch3/cfg &amp;&amp; cd ~/thu-linux/ch3/cfg
printf 'Port 22\\nPermitRootLogin yes\\nPasswordAuthentication yes\\nX11Forwarding yes\\nUsePAM yes\\n' &gt; sshd.cu
printf 'Port 22\\nPermitRootLogin no\\nPasswordAuthentication no\\nX11Forwarding yes\\nUsePAM yes\\nMaxAuthTries 3\\n' &gt; sshd.moi
diff sshd.cu sshd.moi; echo "exit=\$?"</code></pre>
<div class="out">2,3c2,3
&lt; PermitRootLogin yes
&lt; PasswordAuthentication yes
---
&gt; PermitRootLogin no
&gt; PasswordAuthentication no
5a6
&gt; MaxAuthTries 3
exit=1</div>
<p>That is the classic format, read as editing instructions: <code>2,3c2,3</code> = lines 2–3 of the old file <strong>c</strong>hange into lines 2–3 of the new one; <code>&lt;</code> marks old lines, <code>&gt;</code> new ones; <code>5a6</code> = after old line 5, <strong>a</strong>dd new line 6 (a <code>d</code> would mean delete). The format everyone reads today, the one <code>git diff</code> and code reviews use, is the <strong>unified</strong> format:</p>
<pre><code>diff -u sshd.cu sshd.moi</code></pre>
<div class="out">--- sshd.cu	2026-09-28 09:26:19.186619260 +0000
+++ sshd.moi	2026-09-28 09:26:19.186619260 +0000
@@ -1,5 +1,6 @@
 Port 22
-PermitRootLogin yes
-PasswordAuthentication yes
+PermitRootLogin no
+PasswordAuthentication no
 X11Forwarding yes
 UsePAM yes
+MaxAuthTries 3</div>
<p><code>---</code> and <code>+++</code> name the old and new file. <code>@@ -1,5 +1,6 @@</code> says: this block covers 5 lines starting at line 1 of the old file, which became 6 lines starting at line 1 of the new file. Inside the block, a leading <code>-</code> is a removed line, <code>+</code> an added one, and a leading space an unchanged line shown for context. Once you can read this, you can read any pull request.</p>
<p>The rest of the family, with real output:</p>
<pre><code>diff -q sshd.cu sshd.moi; echo "exit=\$?"
cp sshd.cu sshd.ban; diff -q sshd.cu sshd.ban; echo "exit=\$?"
diff sshd.cu khong-co; echo "exit=\$?"
cmp sshd.cu sshd.moi
cmp -s sshd.cu sshd.ban &amp;&amp; echo "giong het"
diff -y -W 60 sshd.cu sshd.moi</code></pre>
<div class="out">Files sshd.cu and sshd.moi differ
exit=1
exit=0
diff: khong-co: No such file or directory
exit=2
sshd.cu sshd.moi differ: char 25, line 2
giong het
Port 22				Port 22
PermitRootLogin yes	     |	PermitRootLogin no
PasswordAuthentication yes   |	PasswordAuthentication no
X11Forwarding yes		X11Forwarding yes
UsePAM yes			UsePAM yes
			     &gt;	MaxAuthTries 3</div>
<pre><code class="language-bash">mkdir -p d1 d2; echo x &gt; d1/a; echo x &gt; d2/a; echo y &gt; d1/b; echo z &gt; d2/b; echo only &gt; d2/c
diff -rq d1 d2
diff -u sshd.cu sshd.moi &gt; sua.patch
cp sshd.cu thu.conf; patch thu.conf &lt; sua.patch
diff -q thu.conf sshd.moi &amp;&amp; echo "da giong ban moi"</code></pre>
<div class="out">Files d1/b and d2/b differ
Only in d2: c
patching file thu.conf
da giong ban moi</div>
<table>
<tr><th>Tool / flag</th><th>Use it when</th></tr>
<tr><td><code>diff -u a b</code></td><td>you want to read or send the change (email, chat, ticket)</td></tr>
<tr><td><code>diff -q a b</code></td><td>you only need yes/no: "are these the same?"</td></tr>
<tr><td><code>diff -rq dir1 dir2</code></td><td>comparing two directories: which files differ, which exist on only one side</td></tr>
<tr><td><code>diff -w</code> · <code>diff -y</code></td><td>ignore whitespace changes · show both files side by side</td></tr>
<tr><td><code>diff &lt;(sort a) &lt;(sort b)</code></td><td>the order does not matter, only the content</td></tr>
<tr><td><code>cmp -s a b</code></td><td>binary files, or a silent byte-for-byte test in a script</td></tr>
<tr><td><code>diff -u a b &gt; x.patch</code> + <code>patch a &lt; x.patch</code></td><td>record a change once and apply it again elsewhere</td></tr>
</table>
<div class="callout warn"><strong>Exit status is the trap here.</strong> For <code>diff</code> and <code>cmp</code>, <strong>1 means "the files differ"</strong>, not "something went wrong"; only 2 is an error. A script running under <code>set -e</code> will stop dead at a <code>diff</code> that merely found differences. Write <code>if diff -q a b &gt;/dev/null; then …</code> or <code>diff … || true</code> when a difference is an expected outcome.</div>

<h3>Putting it together</h3>
<pre><code class="language-bash"><span class="tok-comment"># Top 10 URLs by request count, from an nginx access log</span>
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

<h3>sort flags in one table</h3>
<table>
<tr><th>Flag</th><th>Meaning</th><th>Real example</th></tr>
<tr><td><code>-n</code></td><td>compare as numbers</td><td><code>9 10 100</code> instead of <code>10 100 9</code></td></tr>
<tr><td><code>-h</code></td><td>human sizes: K &lt; M &lt; G</td><td><code>3K 512K 1M 2G</code> (plain <code>-n</code> gives <code>1M 2G 3K 512K</code>)</td></tr>
<tr><td><code>-V</code></td><td>version numbers</td><td><code>v1.2 v1.9 v1.10</code></td></tr>
<tr><td><code>-r</code> · <code>-u</code></td><td>reverse · drop duplicate lines</td><td><code>sort -rn</code>: biggest first</td></tr>
<tr><td><code>-t X</code></td><td>field separator X instead of blanks</td><td><code>sort -t: -k3,3n /etc/passwd</code>: by UID</td></tr>
<tr><td><code>-k2,2</code> · <code>-k2</code></td><td>field 2 only · field 2 to the END of the line</td><td><code>sort -k2,2n</code> → <code>binh 9 · an 30 · chi 120</code></td></tr>
<tr><td><code>-o file</code></td><td>write the result to file — safe even when it is the input</td><td><code>sort -o names.txt names.txt</code></td></tr>
<tr><td><code>LC_ALL=C</code></td><td>byte order: fast, identical on every machine</td><td>Fedora: <code>en_US.UTF-8</code> gives <code>a A b B _x</code>, <code>C</code> gives <code>A B _x a b</code></td></tr>
</table>

<h3>Try it step by step</h3>
<p>In the log directory from Lesson 3.3. The first line adds a small third file, <code>blocked.txt</code> (exactly 20 bytes) — its short size is what exposes <code>cut</code>'s weakness. Predict each block of output first:</p>
<pre><code class="language-bash">cd ~/thu-linux/ch3/log
printf '192.0.2.19\\n10.9.9.9\\n' &gt; blocked.txt
ls -l | tail -n +2 | cut -d' ' -f5
ls -l | tail -n +2 | awk '{print \$5}'
ls -l | tail -n +2 | tr -s ' ' | cut -d' ' -f5
printf '9\\n10\\n100\\n' | sort | paste -sd' '
printf '9\\n10\\n100\\n' | sort -n | paste -sd' '
printf 'v1.10\\nv1.9\\nv1.2\\n' | sort -V | paste -sd' '
printf 'a\\nb\\na\\na\\nb\\n' | uniq -c
awk '{print \$1}' access.log | sort | uniq -c | sort -rn | head -3
echo -n "Việt" | wc -c; echo -n "Việt" | LC_ALL=C.UTF-8 wc -m</code></pre>
<div class="out">833
499

833
499
20
833
499
20
10 100 9
9 10 100
v1.2 v1.9 v1.10
      1 a
      1 b
      2 a
      1 b
      5 203.0.113.45
      3 198.51.100.7
      2 192.0.2.19
6
4</div>
<p>What you just saw: <code>cut -d' '</code> returned a blank line for the file whose size is padded with two spaces, while <code>awk</code> and <code>tr -s</code> both got <code>20</code>; plain <code>sort</code> put 100 before 9; <code>-V</code> understood versions; <code>uniq</code> without <code>sort</code> counted <code>a</code> twice as two different groups; the five-stage pipeline found the busiest IP; and "Việt" is 6 bytes but 4 characters once the locale is UTF-8 (the container's default C locale counts bytes even with <code>-m</code>). (Ubuntu 24.04.)</p>

<h3>On macOS and WSL: what is different</h3>
<table>
<tr><th>Thing</th><th>Ubuntu / WSL (GNU)</th><th>macOS 27 (real run)</th></tr>
<tr><td><code>tac</code> · <code>shuf</code></td><td>exist</td><td><code>command not found</code> — use <code>tail -r</code> to reverse</td></tr>
<tr><td><code>printf 'a\\nb\\n' | paste -sd,</code></td><td><code>a,b</code></td><td><code>usage: paste [-s] [-d delimiters] file ...</code> — write <code>paste -sd, -</code></td></tr>
<tr><td><code>column -t -s, -o ' | '</code></td><td>works</td><td><code>column: illegal option -- o</code>; <code>-t -s,</code> alone works</td></tr>
<tr><td><code>comm</code> on unsorted input</td><td>wrong answer + warning, exit 1</td><td>wrong answer, <strong>no warning, exit 0</strong></td></tr>
<tr><td><code>wc -l app.log</code></td><td><code>10 app.log</code></td><td><code>      10 app.log</code> — padded; use <code>wc -l &lt; f | tr -d ' '</code> in scripts</td></tr>
<tr><td><code>sort -h</code> · <code>sort -V</code></td><td>work</td><td>work (<code>sort --version</code>: <code>2.3-Apple</code>)</td></tr>
<tr><td><code>diff -u</code></td><td>GNU diffutils</td><td>"Apple diff (based on FreeBSD diff)" — same unified format</td></tr>
</table>
<p>WSL2 is Ubuntu, so the left column applies there. On a Mac the missing tools come back with <code>brew install coreutils</code> (they are installed with a <code>g</code> prefix: <code>gtac</code>, <code>gshuf</code>) — Chapter 15 covers Homebrew properly.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> before the SWP391 demo you must prove three things to your team lead: which packages are still missing on the VPS, exactly what you changed in the SSH config, and which client hammered the API. Answer each with small tools only.</p><ol>
<li>In <code>~/thu-linux/ch3/so</code> create <code>can.txt</code> and <code>da-cai.txt</code> as shown above, then list what must still be installed (<code>comm -23</code>) and what is installed but not needed (<code>comm -13</code>).</li>
<li>Create <code>diem.csv</code> as above and print it as an aligned table with <code>column -t -s,</code>.</li>
<li>In <code>~/thu-linux/ch3/cfg</code> create <code>sshd.cu</code> and <code>sshd.moi</code> as above. Count the added lines with <code>diff -u sshd.cu sshd.moi | grep -c '^+[^+]'</code> and the removed ones with <code>'^-[^-]'</code>; then run <code>diff -q sshd.cu sshd.moi &gt;/dev/null; echo \$?</code>.</li>
<li>From <code>~/thu-linux/ch3/log/access.log</code>: the busiest IP with its count (<code>awk '{print \$1}' … | sort | uniq -c | sort -rn | head -1</code>), and how many distinct HTTP status codes appear (<code>awk '{print \$9}' … | sort -u | wc -l</code>).</li>
<li>Sort the sizes <code>1M 512K 2G 3K</code> (one per line with <code>printf</code>) correctly, and join the result onto one line with <code>paste -sd' ' -</code>.</li></ol>
<p><strong>Done when:</strong> step 1 prints <code>jq</code>, <code>postgresql</code> and then <code>htop</code>; step 2 shows three aligned columns; step 3 prints <code>3</code>, <code>2</code> and exit <code>1</code>; step 4 prints <code>5 203.0.113.45</code> (with leading spaces) and <code>6</code>; step 5 prints <code>3K 512K 1M 2G</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Field</span><span class="v">One column of a line, separated by a delimiter such as <code>:</code>, <code>,</code>, TAB or runs of spaces.</span></div>
  <div class="kv"><span class="k">Delimiter</span><span class="v">The character that separates fields: <code>cut -d</code>, <code>sort -t</code>, <code>paste -d</code>, <code>column -s</code>.</span></div>
  <div class="kv"><span class="k">Sort key</span><span class="v">The part of each line <code>sort</code> compares: <code>-k2,2</code> means field 2 only.</span></div>
  <div class="kv"><span class="k">Locale</span><span class="v">Language settings that change sort order and what counts as a character; <code>LC_ALL=C</code> means plain bytes.</span></div>
  <div class="kv"><span class="k">Adjacent duplicates</span><span class="v">Identical lines next to each other — the only kind <code>uniq</code> can see.</span></div>
  <div class="kv"><span class="k">Join</span><span class="v">Matching lines of two sorted files by a shared key field, like SQL's JOIN.</span></div>
  <div class="kv"><span class="k">Unified diff / hunk</span><span class="v">The <code>---</code>/<code>+++</code>/<code>@@</code> format of <code>diff -u</code>; each <code>@@</code> block is one hunk.</span></div>
  <div class="kv"><span class="k">Patch</span><span class="v">A saved diff that the <code>patch</code> command can apply to another copy of the file.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>cut</code> splits on every single delimiter; for space-aligned output use <code>awk '{print \$N}'</code> or <code>tr -s ' '</code> first.</li>
<li><code>sort</code> compares text unless told otherwise: <code>-n</code>, <code>-h</code>, <code>-V</code>, and <code>-k2,2</code> rather than <code>-k2</code>.</li>
<li><code>sort | uniq -c | sort -rn | head</code> is the universal "count by group"; <code>uniq</code> alone only sees adjacent lines.</li>
<li><code>comm</code>, <code>join</code> and <code>paste</code> combine two lists — and <code>comm</code>/<code>join</code> need both inputs sorted the same way.</li>
<li><code>diff -u</code> shows exactly what changed; exit 1 means "different", so guard it under <code>set -e</code>.</li>
<li>On a Mac, <code>tac</code>, <code>shuf</code>, <code>column -o</code> and stdin-without-<code>-</code> for <code>paste</code> are missing.</li>
</ul>

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
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
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
${slide('lx-03', 16, 'cut coi MỖI dấu cách là một ngăn — output căn lề thì dùng awk')}
<pre><code>cut -d: -f1 /etc/passwd            <span class="tok-comment"># -d đặt dấu phân cách, -f chọn trường</span>
cut -d: -f1,7 /etc/passwd          <span class="tok-comment"># nhiều trường</span>
cut -d, -f2-4 data.csv             <span class="tok-comment"># một khoảng</span>
cut -c1-8 log.txt                  <span class="tok-comment"># theo vị trí KÝ TỰ thay vì trường</span></code></pre>
<div class="out">root
daemon
deploy</div>
<div class="callout warn"><code>cut</code> có một hạn chế thật: <strong>nó coi MỖI dấu phân cách là một chỗ ngắt</strong>, nên hai dấu cách liền nhau nghĩa là có một trường rỗng ở giữa. Với output căn theo dấu cách như <code>ls -l</code> hay <code>ps</code>, lệnh <code>cut -d' ' -f3</code> trả về chuỗi rỗng một cách khó lường. Ở đó hãy dùng <code>awk '{print \$3}'</code> — awk mặc định gộp các chuỗi khoảng trắng lại. Hãy chọn <code>cut</code> khi dấu phân cách là một ký tự đơn thật sự (<code>:</code>, <code>,</code>, tab), còn lại thì chọn <code>awk</code>.</div>

<h3>sort — và những cờ làm nó cho kết quả đúng</h3>
${slide('lx-03', 17, 'sort so sánh CHỮ, trừ khi bạn bảo khác: -n -h -V -k2,2')}
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
${slide('lx-03', 18, 'Đếm theo nhóm trong 5 chặng: awk | sort | uniq -c | sort -rn | head')}
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
${slide('lx-03', 19, 'comm chia 3 cột, paste ghép ngang, join nối theo khoá')}
<pre><code>paste names.txt scores.txt              <span class="tok-comment"># cạnh nhau, phân cách bằng tab</span>
paste -d, names.txt scores.txt          <span class="tok-comment"># dùng dấu phẩy thay vào</span>
paste -sd, names.txt                    <span class="tok-comment"># -s: dồn mọi dòng lên MỘT dòng</span>
join -t, -1 1 -2 1 users.csv orders.csv <span class="tok-comment"># một phép nối quan hệ thật trên trường 1</span>
comm -13 &lt;(sort a.txt) &lt;(sort b.txt)    <span class="tok-comment"># những dòng chỉ có trong b</span></code></pre>
<div class="out">$ paste -sd, fruits.txt
apple,banana,cherry</div>
<p><code>comm</code> in ra ba cột — chỉ-có-trong-A, chỉ-có-trong-B, có-ở-cả-hai — và các chữ số dùng để tắt bớt cột. <code>-13</code> nghĩa là "giấu cột 1 và 3", để lại phần chỉ-có-trong-B. Cả hai đầu vào <strong>BẮT BUỘC phải đã sắp xếp</strong>, và đó là lý do thay thế tiến trình đi cặp với nó tự nhiên đến vậy.</p>

<h3>Đào sâu comm, paste, join và column</h3>
<p>Bốn lệnh này trả lời những câu hỏi mà bình thường bạn phải mở bảng tính: "cái gì có trong danh sách A mà không có trong B?", "đặt hai cột này cạnh nhau", "ghép đơn hàng với người dùng theo ID", "làm cho cái này dễ đọc". Bắt đầu bằng hai danh sách — những gói mà dự án cần, và những gói thật sự đã cài trên VPS:</p>
<pre><code class="language-bash">mkdir -p ~/thu-linux/ch3/so &amp;&amp; cd ~/thu-linux/ch3/so
printf 'curl\\ngit\\njq\\nnginx\\npostgresql\\n' &gt; can.txt
printf 'git\\nnginx\\ncurl\\nhtop\\n' &gt; da-cai.txt
comm &lt;(sort can.txt) &lt;(sort da-cai.txt)</code></pre>
<div class="out">		curl
		git
	htop
jq
		nginx
postgresql</div>
<p>Không thụt lề = <strong>cột 1</strong>, chỉ có trong file thứ nhất (vẫn còn THIẾU). Một tab = <strong>cột 2</strong>, chỉ có trong file thứ hai (đã cài mà không cần). Hai tab = <strong>cột 3</strong>, có ở cả hai. Các cờ chữ số dùng để <em>GIẤU</em> cột, nên bạn gọi tên những cột KHÔNG muốn xem — <code>-23</code> để lại cột 1:</p>
<pre><code>comm -23 &lt;(sort can.txt) &lt;(sort da-cai.txt)
comm -13 &lt;(sort can.txt) &lt;(sort da-cai.txt)
comm -12 &lt;(sort can.txt) &lt;(sort da-cai.txt)</code></pre>
<div class="out">jq
postgresql
htop
curl
git
nginx</div>
<pre><code>comm can.txt da-cai.txt; echo "exit=\$?"</code></pre>
<div class="out">curl
		git
jq
		nginx
comm: file 2 is not in sorted order
	curl
	htop
postgresql
comm: input is not in sorted order
exit=1</div>
<p>Quên sắp xếp không phải chuyện hình thức: <code>comm</code> của GNU in ra một câu trả lời SAI (nó bảo <code>curl</code> còn thiếu) và chỉ cảnh báo, mã thoát 1. <code>comm</code> trên Mac in đúng câu trả lời sai đó mà <strong>không cảnh báo gì, mã thoát 0</strong>. Luôn rót cho nó <code>&lt;(sort …)</code>, và cùng một locale ở cả hai phía.</p>
<p><code>paste</code> dán các file theo từng dòng bằng dấu TAB (hoặc <code>-d</code>); <code>-s</code> dồn các dòng của một file thành một dòng, còn <code>paste - -</code> biến mỗi hai dòng của stdin thành một hàng:</p>
<pre><code>printf 'an\\nbinh\\nchi\\n' &gt; ten.txt
printf '8.5\\n6.0\\n9.25\\n' &gt; diem.txt
paste ten.txt diem.txt
paste -d, ten.txt diem.txt
paste -sd, ten.txt
printf 'k1\\nv1\\nk2\\nv2\\n' | paste - -</code></pre>
<div class="out">an	8.5
binh	6.0
chi	9.25
an,8.5
binh,6.0
chi,9.25
an,binh,chi
k1	v1
k2	v2</div>
<p><code>join</code> là một phép nối quan hệ thật sự trên một trường khoá (hai đầu vào phải sắp xếp theo khoá đó, giống <code>comm</code>); <code>-a1</code> giữ luôn những dòng của file 1 không có cặp — tức LEFT JOIN. <code>column -t</code> căn mọi thứ có phân cách thành bảng, và <code>column -o</code> của GNU đặt dấu phân cách đầu ra:</p>
<pre><code>printf 'u1,an\\nu2,binh\\nu3,chi\\n' &gt; users.csv
printf 'u1,ORD-9\\nu3,ORD-7\\nu3,ORD-8\\n' &gt; orders.csv
join -t, users.csv orders.csv
join -t, -a1 users.csv orders.csv
printf 'ten,vai tro,diem\\nan,backend,8.5\\nbinh,frontend,6\\n' &gt; diem.csv
column -t -s, diem.csv
column -t -s, -o ' | ' diem.csv</code></pre>
<div class="out">u1,an,ORD-9
u3,chi,ORD-7
u3,chi,ORD-8
u1,an,ORD-9
u2,binh
u3,chi,ORD-7
u3,chi,ORD-8
ten   vai tro   diem
an    backend   8.5
binh  frontend  6
ten  | vai tro  | diem
an   | backend  | 8.5
binh | frontend | 6</div>

<h3>column và nl — làm output đọc được</h3>
<pre><code>column -t -s: /etc/passwd        <span class="tok-comment"># căn thành bảng</span>
column -t -s, data.csv | less -S <span class="tok-comment"># -S: đừng bẻ dòng dài</span>
nl -ba script.sh                 <span class="tok-comment"># đánh số mọi dòng, kể cả dòng trống</span>
fold -w 80 long.txt              <span class="tok-comment"># bẻ cứng ở cột 80</span></code></pre>
<div class="out">root   x  0     0     root   /root       /bin/bash
deploy x  1001  1001         /home/deploy /bin/bash</div>
<p><code>column -t</code> biến bất kỳ output có phân cách nào thành một cái bảng đọc được, và nó là cách nhanh nhất để làm một file CSV dễ nhìn ngay trong terminal mà không phải rời khỏi đó.</p>

<h3>diff và cmp: chính xác cái gì đã đổi giữa hai file</h3>
${slide('lx-03', 20, 'diff -u đọc như git diff: @@ vị trí, “-” dòng cũ, “+” dòng mới')}
<p>Mỗi lần bạn sửa cấu hình trên máy chủ, câu hỏi trung thực sau đó là "mình thật sự đã đổi gì?". <code>diff</code> trả lời từng dòng một. Hai phiên bản cấu hình SSH:</p>
<pre><code class="language-bash">mkdir -p ~/thu-linux/ch3/cfg &amp;&amp; cd ~/thu-linux/ch3/cfg
printf 'Port 22\\nPermitRootLogin yes\\nPasswordAuthentication yes\\nX11Forwarding yes\\nUsePAM yes\\n' &gt; sshd.cu
printf 'Port 22\\nPermitRootLogin no\\nPasswordAuthentication no\\nX11Forwarding yes\\nUsePAM yes\\nMaxAuthTries 3\\n' &gt; sshd.moi
diff sshd.cu sshd.moi; echo "exit=\$?"</code></pre>
<div class="out">2,3c2,3
&lt; PermitRootLogin yes
&lt; PasswordAuthentication yes
---
&gt; PermitRootLogin no
&gt; PasswordAuthentication no
5a6
&gt; MaxAuthTries 3
exit=1</div>
<p>Đó là định dạng cổ điển, đọc như những chỉ dẫn sửa: <code>2,3c2,3</code> = dòng 2–3 của file cũ <strong>đổi</strong> (change) thành dòng 2–3 của file mới; <code>&lt;</code> đánh dấu dòng cũ, <code>&gt;</code> dòng mới; <code>5a6</code> = sau dòng cũ số 5, <strong>thêm</strong> (add) dòng mới số 6 (còn <code>d</code> là xoá). Định dạng ai cũng đọc ngày nay, cái mà <code>git diff</code> và các buổi review mã dùng, là định dạng <strong>hợp nhất</strong> (unified):</p>
<pre><code>diff -u sshd.cu sshd.moi</code></pre>
<div class="out">--- sshd.cu	2026-09-28 09:26:19.186619260 +0000
+++ sshd.moi	2026-09-28 09:26:19.186619260 +0000
@@ -1,5 +1,6 @@
 Port 22
-PermitRootLogin yes
-PasswordAuthentication yes
+PermitRootLogin no
+PasswordAuthentication no
 X11Forwarding yes
 UsePAM yes
+MaxAuthTries 3</div>
<p><code>---</code> và <code>+++</code> nêu tên file cũ và file mới. <code>@@ -1,5 +1,6 @@</code> nói: khối này phủ 5 dòng bắt đầu từ dòng 1 của file cũ, đã thành 6 dòng bắt đầu từ dòng 1 của file mới. Trong khối, dòng mở đầu bằng <code>-</code> là dòng bị bỏ, <code>+</code> là dòng thêm vào, còn dấu cách là dòng không đổi được in ra làm ngữ cảnh. Đọc được cái này là bạn đọc được mọi pull request.</p>
<p>Phần còn lại của họ nhà diff, với output thật:</p>
<pre><code>diff -q sshd.cu sshd.moi; echo "exit=\$?"
cp sshd.cu sshd.ban; diff -q sshd.cu sshd.ban; echo "exit=\$?"
diff sshd.cu khong-co; echo "exit=\$?"
cmp sshd.cu sshd.moi
cmp -s sshd.cu sshd.ban &amp;&amp; echo "giong het"
diff -y -W 60 sshd.cu sshd.moi</code></pre>
<div class="out">Files sshd.cu and sshd.moi differ
exit=1
exit=0
diff: khong-co: No such file or directory
exit=2
sshd.cu sshd.moi differ: char 25, line 2
giong het
Port 22				Port 22
PermitRootLogin yes	     |	PermitRootLogin no
PasswordAuthentication yes   |	PasswordAuthentication no
X11Forwarding yes		X11Forwarding yes
UsePAM yes			UsePAM yes
			     &gt;	MaxAuthTries 3</div>
<pre><code class="language-bash">mkdir -p d1 d2; echo x &gt; d1/a; echo x &gt; d2/a; echo y &gt; d1/b; echo z &gt; d2/b; echo only &gt; d2/c
diff -rq d1 d2
diff -u sshd.cu sshd.moi &gt; sua.patch
cp sshd.cu thu.conf; patch thu.conf &lt; sua.patch
diff -q thu.conf sshd.moi &amp;&amp; echo "da giong ban moi"</code></pre>
<div class="out">Files d1/b and d2/b differ
Only in d2: c
patching file thu.conf
da giong ban moi</div>
<table>
<tr><th>Công cụ / cờ</th><th>Dùng khi</th></tr>
<tr><td><code>diff -u a b</code></td><td>muốn đọc hoặc gửi thay đổi cho người khác (email, chat, ticket)</td></tr>
<tr><td><code>diff -q a b</code></td><td>chỉ cần có/không: "hai cái này có giống nhau không?"</td></tr>
<tr><td><code>diff -rq tm1 tm2</code></td><td>so hai THƯ MỤC: file nào khác, file nào chỉ có ở một bên</td></tr>
<tr><td><code>diff -w</code> · <code>diff -y</code></td><td>bỏ qua thay đổi khoảng trắng · hiện hai file cạnh nhau</td></tr>
<tr><td><code>diff &lt;(sort a) &lt;(sort b)</code></td><td>thứ tự không quan trọng, chỉ nội dung</td></tr>
<tr><td><code>cmp -s a b</code></td><td>file nhị phân, hoặc phép kiểm từng byte im lặng trong script</td></tr>
<tr><td><code>diff -u a b &gt; x.patch</code> + <code>patch a &lt; x.patch</code></td><td>ghi lại một thay đổi một lần rồi áp lại ở nơi khác</td></tr>
</table>
<div class="callout warn"><strong>Mã thoát là cái bẫy ở đây.</strong> Với <code>diff</code> và <code>cmp</code>, <strong>1 nghĩa là "hai file khác nhau"</strong>, không phải "có gì đó hỏng"; chỉ 2 mới là lỗi. Một script chạy dưới <code>set -e</code> sẽ dừng phắt ở một lệnh <code>diff</code> chỉ vì nó tìm thấy khác biệt. Hãy viết <code>if diff -q a b &gt;/dev/null; then …</code> hoặc <code>diff … || true</code> khi khác biệt là một kết quả được trông đợi.</div>

<h3>Ghép tất cả lại</h3>
<pre><code class="language-bash"><span class="tok-comment"># 10 URL nhiều lượt gọi nhất, từ một access log của nginx</span>
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

<h3>Bảng cờ của sort</h3>
<table>
<tr><th>Cờ</th><th>Nghĩa</th><th>Ví dụ thật</th></tr>
<tr><td><code>-n</code></td><td>so sánh như SỐ</td><td><code>9 10 100</code> thay vì <code>10 100 9</code></td></tr>
<tr><td><code>-h</code></td><td>cỡ cho người đọc: K &lt; M &lt; G</td><td><code>3K 512K 1M 2G</code> (<code>-n</code> trơn cho <code>1M 2G 3K 512K</code>)</td></tr>
<tr><td><code>-V</code></td><td>số phiên bản</td><td><code>v1.2 v1.9 v1.10</code></td></tr>
<tr><td><code>-r</code> · <code>-u</code></td><td>đảo ngược · bỏ dòng trùng</td><td><code>sort -rn</code>: lớn nhất trước</td></tr>
<tr><td><code>-t X</code></td><td>dấu phân cách trường là X thay vì khoảng trắng</td><td><code>sort -t: -k3,3n /etc/passwd</code>: theo UID</td></tr>
<tr><td><code>-k2,2</code> · <code>-k2</code></td><td>chỉ trường 2 · từ trường 2 tới HẾT dòng</td><td><code>sort -k2,2n</code> → <code>binh 9 · an 30 · chi 120</code></td></tr>
<tr><td><code>-o file</code></td><td>ghi kết quả vào file — an toàn cả khi đó chính là đầu vào</td><td><code>sort -o names.txt names.txt</code></td></tr>
<tr><td><code>LC_ALL=C</code></td><td>thứ tự byte: nhanh, giống hệt trên mọi máy</td><td>Fedora: <code>en_US.UTF-8</code> cho <code>a A b B _x</code>, <code>C</code> cho <code>A B _x a b</code></td></tr>
</table>

<h3>Chạy thử từng bước</h3>
<p>Trong thư mục log của Bài 3.3. Dòng đầu thêm một file thứ ba nhỏ, <code>blocked.txt</code> (đúng 20 byte) — chính cái cỡ ngắn của nó lột trần điểm yếu của <code>cut</code>. Đoán trước từng khối output:</p>
<pre><code class="language-bash">cd ~/thu-linux/ch3/log
printf '192.0.2.19\\n10.9.9.9\\n' &gt; blocked.txt
ls -l | tail -n +2 | cut -d' ' -f5
ls -l | tail -n +2 | awk '{print \$5}'
ls -l | tail -n +2 | tr -s ' ' | cut -d' ' -f5
printf '9\\n10\\n100\\n' | sort | paste -sd' '
printf '9\\n10\\n100\\n' | sort -n | paste -sd' '
printf 'v1.10\\nv1.9\\nv1.2\\n' | sort -V | paste -sd' '
printf 'a\\nb\\na\\na\\nb\\n' | uniq -c
awk '{print \$1}' access.log | sort | uniq -c | sort -rn | head -3
echo -n "Việt" | wc -c; echo -n "Việt" | LC_ALL=C.UTF-8 wc -m</code></pre>
<div class="out">833
499

833
499
20
833
499
20
10 100 9
9 10 100
v1.2 v1.9 v1.10
      1 a
      1 b
      2 a
      1 b
      5 203.0.113.45
      3 198.51.100.7
      2 192.0.2.19
6
4</div>
<p>Điều bạn vừa thấy: <code>cut -d' '</code> trả về một dòng trống cho file có cỡ bị đệm bằng hai dấu cách, trong khi <code>awk</code> và <code>tr -s</code> đều lấy được <code>20</code>; <code>sort</code> trơn xếp 100 trước 9; <code>-V</code> hiểu số phiên bản; <code>uniq</code> không có <code>sort</code> đếm <code>a</code> thành hai nhóm khác nhau; chuỗi năm chặng tìm ra IP bận rộn nhất; và "Việt" là 6 byte nhưng 4 ký tự khi locale là UTF-8 (locale C mặc định của container đếm byte kể cả với <code>-m</code>). (Ubuntu 24.04.)</p>

<h3>Trên macOS và WSL khác gì</h3>
<table>
<tr><th>Thứ</th><th>Ubuntu / WSL (GNU)</th><th>macOS 27 (chạy thật)</th></tr>
<tr><td><code>tac</code> · <code>shuf</code></td><td>có</td><td><code>command not found</code> — đảo ngược thì dùng <code>tail -r</code></td></tr>
<tr><td><code>printf 'a\\nb\\n' | paste -sd,</code></td><td><code>a,b</code></td><td><code>usage: paste [-s] [-d delimiters] file ...</code> — phải viết <code>paste -sd, -</code></td></tr>
<tr><td><code>column -t -s, -o ' | '</code></td><td>chạy</td><td><code>column: illegal option -- o</code>; riêng <code>-t -s,</code> thì chạy</td></tr>
<tr><td><code>comm</code> trên đầu vào chưa sắp xếp</td><td>kết quả sai + cảnh báo, mã 1</td><td>kết quả sai, <strong>không cảnh báo, mã 0</strong></td></tr>
<tr><td><code>wc -l app.log</code></td><td><code>10 app.log</code></td><td><code>      10 app.log</code> — có đệm dấu cách; trong script dùng <code>wc -l &lt; f | tr -d ' '</code></td></tr>
<tr><td><code>sort -h</code> · <code>sort -V</code></td><td>chạy</td><td>chạy (<code>sort --version</code>: <code>2.3-Apple</code>)</td></tr>
<tr><td><code>diff -u</code></td><td>GNU diffutils</td><td>"Apple diff (based on FreeBSD diff)" — cùng định dạng hợp nhất</td></tr>
</table>
<p>WSL2 là Ubuntu, nên cột bên trái áp dụng ở đó. Trên Mac, các công cụ thiếu quay lại được bằng <code>brew install coreutils</code> (chúng được cài với tiền tố <code>g</code>: <code>gtac</code>, <code>gshuf</code>) — Chương 15 dạy Homebrew đầy đủ.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> trước buổi demo SWP391, bạn phải chứng minh ba điều cho trưởng nhóm: gói nào trên VPS còn thiếu, chính xác bạn đã đổi gì trong cấu hình SSH, và máy khách nào dội API nhiều nhất. Trả lời từng câu chỉ bằng các công cụ nhỏ.</p><ol>
<li>Trong <code>~/thu-linux/ch3/so</code> tạo <code>can.txt</code> và <code>da-cai.txt</code> như ở trên, rồi liệt kê thứ còn phải cài (<code>comm -23</code>) và thứ đã cài mà không cần (<code>comm -13</code>).</li>
<li>Tạo <code>diem.csv</code> như ở trên và in nó thành bảng căn thẳng bằng <code>column -t -s,</code>.</li>
<li>Trong <code>~/thu-linux/ch3/cfg</code> tạo <code>sshd.cu</code> và <code>sshd.moi</code> như ở trên. Đếm số dòng thêm bằng <code>diff -u sshd.cu sshd.moi | grep -c '^+[^+]'</code> và số dòng bỏ bằng <code>'^-[^-]'</code>; rồi chạy <code>diff -q sshd.cu sshd.moi &gt;/dev/null; echo \$?</code>.</li>
<li>Từ <code>~/thu-linux/ch3/log/access.log</code>: IP bận nhất cùng số lượt (<code>awk '{print \$1}' … | sort | uniq -c | sort -rn | head -1</code>), và có bao nhiêu mã trạng thái HTTP khác nhau (<code>awk '{print \$9}' … | sort -u | wc -l</code>).</li>
<li>Sắp xếp đúng các cỡ <code>1M 512K 2G 3K</code> (mỗi dòng một cái bằng <code>printf</code>), rồi dồn kết quả lên một dòng bằng <code>paste -sd' ' -</code>.</li></ol>
<p><strong>Đạt khi:</strong> bước 1 in <code>jq</code>, <code>postgresql</code> rồi <code>htop</code>; bước 2 hiện ba cột thẳng hàng; bước 3 in <code>3</code>, <code>2</code> và mã <code>1</code>; bước 4 in <code>5 203.0.113.45</code> (có dấu cách phía trước) và <code>6</code>; bước 5 in <code>3K 512K 1M 2G</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Field (trường)</span><span class="v">Một cột của dòng, ngăn bởi dấu phân cách như <code>:</code>, <code>,</code>, TAB hoặc chuỗi dấu cách.</span></div>
  <div class="kv"><span class="k">Delimiter (dấu phân cách)</span><span class="v">Ký tự ngăn các trường: <code>cut -d</code>, <code>sort -t</code>, <code>paste -d</code>, <code>column -s</code>.</span></div>
  <div class="kv"><span class="k">Sort key (khoá sắp xếp)</span><span class="v">Phần của mỗi dòng mà <code>sort</code> đem ra so: <code>-k2,2</code> là chỉ trường 2.</span></div>
  <div class="kv"><span class="k">Locale (thiết lập vùng)</span><span class="v">Thiết lập ngôn ngữ làm đổi thứ tự sắp xếp và cách đếm ký tự; <code>LC_ALL=C</code> là byte thuần.</span></div>
  <div class="kv"><span class="k">Adjacent duplicates (dòng trùng kề nhau)</span><span class="v">Các dòng giống hệt nằm sát nhau — loại duy nhất <code>uniq</code> nhìn thấy.</span></div>
  <div class="kv"><span class="k">Join (phép nối)</span><span class="v">Ghép dòng của hai file đã sắp xếp theo một trường khoá chung, giống JOIN của SQL.</span></div>
  <div class="kv"><span class="k">Unified diff / hunk (diff hợp nhất / khối thay đổi)</span><span class="v">Định dạng <code>---</code>/<code>+++</code>/<code>@@</code> của <code>diff -u</code>; mỗi khối <code>@@</code> là một hunk.</span></div>
  <div class="kv"><span class="k">Patch (bản vá)</span><span class="v">Một diff đã lưu mà lệnh <code>patch</code> áp lại được lên một bản sao khác của file.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>cut</code> cắt ở MỌI dấu phân cách; với output căn bằng dấu cách, dùng <code>awk '{print \$N}'</code> hoặc <code>tr -s ' '</code> trước.</li>
<li><code>sort</code> so sánh chữ trừ khi được bảo khác: <code>-n</code>, <code>-h</code>, <code>-V</code>, và <code>-k2,2</code> chứ không phải <code>-k2</code>.</li>
<li><code>sort | uniq -c | sort -rn | head</code> là công thức "đếm theo nhóm" vạn năng; <code>uniq</code> một mình chỉ thấy dòng kề nhau.</li>
<li><code>comm</code>, <code>join</code> và <code>paste</code> ghép hai danh sách — và <code>comm</code>/<code>join</code> cần hai đầu vào sắp xếp giống nhau.</li>
<li><code>diff -u</code> cho thấy chính xác cái gì đã đổi; mã 1 nghĩa là "khác nhau", nên phải rào nó lại dưới <code>set -e</code>.</li>
<li>Trên Mac thiếu <code>tac</code>, <code>shuf</code>, <code>column -o</code>, và <code>paste</code> đọc stdin phải có <code>-</code>.</li>
</ul>

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
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
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

${slide('lx-03', 21, 'Một lệnh sed = địa chỉ + chữ cái lệnh + đối số')}

<h3>The substitute command</h3>
<pre><code class="language-bash">sed 's/old/new/' file.txt          <span class="tok-comment"># first match ON EACH LINE</span>
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
<pre><code class="language-bash">sed 's/\\/usr\\/local/\\/opt/g' paths.txt      <span class="tok-comment"># unreadable</span>
sed 's|/usr/local|/opt|g' paths.txt        <span class="tok-comment"># same thing, legible</span>
sed 's#http://#https://#g' urls.txt        <span class="tok-comment"># # works too</span></code></pre>
<p>Any character can be the delimiter — <code>sed</code> takes whatever follows the <code>s</code>. When your pattern contains slashes (paths, URLs), switch to <code>|</code> or <code>#</code>. This is not a style preference; escaped-slash patterns are where sed bugs hide.</p>

<h3>Addresses: which lines to act on</h3>
${slide('lx-03', 23, 'Địa chỉ chọn dòng, chữ cái chọn việc: p d i a c q')}
<pre><code class="language-bash">sed '3s/old/new/' file            <span class="tok-comment"># only line 3</span>
sed '2,5s/old/new/' file          <span class="tok-comment"># lines 2 through 5</span>
sed '\$s/old/new/' file            <span class="tok-comment"># the last line</span>
sed '2,\$s/old/new/' file          <span class="tok-comment"># line 2 to the end</span>
sed '/^#/s/old/new/' file         <span class="tok-comment"># only lines starting with #</span>
sed '/BEGIN/,/END/s/old/new/' f   <span class="tok-comment"># between two markers</span>
sed '/^#/!s/old/new/' file        <span class="tok-comment"># ! inverts: lines NOT starting with #</span></code></pre>
<p>An address before a command restricts it. That composability is what makes <code>sed</code> more than search-and-replace: "change this word, but only inside the <code>[database]</code> section of the config" is one expression.</p>

<h3>Commands other than s</h3>
<pre><code class="language-bash">sed -n '5p' file                  <span class="tok-comment"># -n suppresses output, p prints → just line 5</span>
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
${slide('lx-03', 22, 's/// thay chỗ khớp ĐẦU mỗi dòng; \\1 và & dùng lại phần đã khớp')}
<pre><code class="language-bash">echo "2026-08-22" | sed -E 's/([0-9]{4})-([0-9]{2})-([0-9]{2})/\\3\\/\\2\\/\\1/'</code></pre>
<div class="out">22/08/2026</div>
<pre><code class="language-bash"><span class="tok-comment"># &amp; is the WHOLE match — wrap every number in brackets</span>
echo "port 8080" | sed -E 's/[0-9]+/[&amp;]/'

<span class="tok-comment"># swap two comma-separated fields</span>
sed -E 's/^([^,]+),([^,]+)/\\2,\\1/' data.csv

<span class="tok-comment"># pull the version out of a line</span>
sed -nE 's/^version = "(.*)"\$/\\1/p' Cargo.toml</code></pre>
<div class="out">port [8080]</div>
<p>Note <code>-E</code> on all of these. Without it you are in BRE (Lesson 3.3) and must write <code>\\(</code>, <code>\\)</code>, <code>\\{</code>, <code>\\+</code> — technically the same power, twice the backslashes. Use <code>-E</code> unless you are writing for a system that lacks it.</p>
<div class="callout warn">In the <em>replacement</em> text, three characters are special: <code>&amp;</code> (the whole match), <code>\\1</code>–<code>\\9</code> (groups), and the delimiter. If your replacement contains a literal <code>&amp;</code> — a URL query string, an HTML entity — you must escape it as <code>\\&amp;</code>, or sed silently inserts the matched text instead. This one produces plausible-looking wrong output rather than an error.</div>

<h3>Editing files in place</h3>
${slide('lx-03', 24, 'sed -i khác nhau giữa GNU và macOS — và nó đổi inode')}
<pre><code class="language-bash">sed 's/old/new/g' file.txt              <span class="tok-comment"># prints to stdout, file untouched</span>
sed -i 's/old/new/g' file.txt           <span class="tok-comment"># edits the file, NO backup</span>
sed -i.bak 's/old/new/g' file.txt       <span class="tok-comment"># keeps file.txt.bak</span></code></pre>
<div class="callout warn"><strong>macOS and BSD sed differ here</strong>, and it bites everyone who writes a script on a Mac that runs on a Linux server, or the reverse. BSD <code>sed -i</code> <em>requires</em> a suffix argument: <code>sed -i '' 's/a/b/' f</code> on macOS, <code>sed -i 's/a/b/' f</code> on Linux. Neither form works on the other platform. In a script that must run on both, use <code>perl -pi -e 's/a/b/'</code>, which behaves identically everywhere.</div>
<p>There is one spelling that both accept: <strong><code>sed -i.bak 's/a/b/' f</code></strong> — the suffix glued to <code>-i</code> — which works on GNU and on macOS alike (checked on both) and leaves you a backup. Delete the <code>.bak</code> once you have checked the result.</p>
<div class="callout warn"><strong><code>-i</code> does not edit the file you think it edits.</strong> It writes the result to a new temporary file and then renames that over the original, so the path now points to a brand-new inode:
<pre><code class="language-bash">cp sshd.cu t3.conf; ls -i t3.conf | cut -d' ' -f1
sed -i 's/yes/no/' t3.conf
ls -i t3.conf | cut -d' ' -f1</code></pre>
<div class="out">31365
31367</div>
Usually harmless. But a Docker container that bind-mounts <em>one single file</em> is attached to the old inode and keeps reading the old content — exactly how an nginx config "deployed successfully" on a student project and changed nothing. Hard links to the file are broken the same way. When a single-file bind mount is involved, rewrite the content in place instead: <code>sed 's/a/b/' f &gt; /tmp/f.new &amp;&amp; cat /tmp/f.new &gt; f</code>.</div>

<h3>Across many files</h3>
<pre><code class="language-bash"><span class="tok-comment"># LOOK FIRST — no -i, so nothing changes</span>
grep -rl "oldApiUrl" src/ | xargs -r sed -n 's/oldApiUrl/newApiUrl/gp'

<span class="tok-comment"># then do it</span>
grep -rl "oldApiUrl" src/ | xargs -r sed -i 's/oldApiUrl/newApiUrl/g'

<span class="tok-comment"># or with find, NUL-safe (Lesson 2.3)</span>
find src -name "*.ts" -print0 | xargs -0 sed -i 's/oldApiUrl/newApiUrl/g'</code></pre>
<p>The <code>-n …p</code> form on the first line prints only the lines that <em>would</em> change, with the change applied. That is the dry run, and running it before the real command costs three seconds.</p>

<h3>Recipes worth keeping</h3>
<pre><code class="language-bash"><span class="tok-comment"># Strip comments and blank lines from a config — see what is actually set</span>
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

<h3>Reading a sed command from the outside in</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">The command letter comes first</span><span class="lz-d"><code>s</code> substitute, <code>d</code> delete, <code>p</code> print, <code>a</code> append. Everything else is arguments to that one letter.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">An address selects lines</span><span class="lz-d"><code>/error/d</code> deletes matching lines; <code>2,5s/…/…/</code> substitutes only in lines 2–5. No address means every line.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">The delimiter is whatever follows s</span><span class="lz-d"><code>s|a|b|</code> is the same as <code>s/a/b/</code> — useful when the pattern contains slashes, which is every path you will ever edit.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Flags go at the end</span><span class="lz-d"><code>g</code> for every match on the line, not just the first. Leaving it off is the commonest reason a substitution &quot;only half worked&quot;.</span></div>
</div>

<h3>sed flags in one table</h3>
<table>
<tr><th>Flag</th><th>Meaning</th><th>Real example (GNU sed 4.9)</th></tr>
<tr><td><code>-n</code></td><td>do not print every line automatically; only <code>p</code> prints</td><td><code>sed -n '/Password/p' sshd.moi</code> → <code>PasswordAuthentication no</code></td></tr>
<tr><td><code>-E</code> (also <code>-r</code>)</td><td>extended regex: <code>+ ? | ( ) {}</code> without backslashes</td><td><code>echo aaa | sed -E 's/a+/X/'</code> → <code>X</code>; without <code>-E</code>, <code>'s/a+/X/'</code> leaves <code>aaa</code></td></tr>
<tr><td><code>-e</code></td><td>add one more expression (several allowed)</td><td><code>echo "a b" | sed -e 's/a/1/' -e 's/b/2/'</code> → <code>1 2</code></td></tr>
<tr><td><code>-i</code> · <code>-i.bak</code></td><td>edit the file itself · and keep the original as <code>file.bak</code></td><td><code>sed -i.bak 's/yes/no/' t2.conf</code> → <code>t2.conf</code> + <code>t2.conf.bak</code></td></tr>
<tr><td><code>-s</code></td><td>treat several files separately (addresses like <code>\$</code> restart per file)</td><td><code>sed -n '\$=' sshd.cu sshd.moi</code> → <code>11</code>; with <code>-sn</code> → <code>5</code> and <code>6</code></td></tr>
</table>

<h3>Try it step by step</h3>
<p>In <code>~/thu-linux/ch3/cfg</code>, where Lesson 3.4 left <code>sshd.cu</code> (five lines: Port, PermitRootLogin, PasswordAuthentication, X11Forwarding, UsePAM). Predict every output first:</p>
<pre><code class="language-bash">cd ~/thu-linux/ch3/cfg
echo "cat cat cat" | sed 's/cat/dog/'
echo "cat cat cat" | sed 's/cat/dog/g'
echo "cat cat cat" | sed 's/cat/dog/2'
sed -n 's/yes/no/p' sshd.cu
sed '2,3s/yes/NO/' sshd.cu
printf 'a\\n\\n# c\\nb\\n' | sed '/^\$/d; /^#/d'
seq 1 1000000 | sed -n '5,7p;7q'
echo "id width valid id_x hidden" | sed 's/id/uuid/g'
echo "id width valid id_x hidden" | sed 's/\\bid\\b/uuid/g'</code></pre>
<div class="out">dog cat cat
dog dog dog
cat dog cat
PermitRootLogin no
PasswordAuthentication no
X11Forwarding no
UsePAM no
Port 22
PermitRootLogin NO
PasswordAuthentication NO
X11Forwarding yes
UsePAM yes
a
b
5
6
7
uuid wuuidth valuuid uuid_x huuidden
uuid width valid id_x hidden</div>
<p>The first three lines are the whole story of the <code>g</code> flag. <code>-n … p</code> printed only the lines a substitution touched — the dry run to use before any <code>-i</code>. The address <code>2,3</code> limited the change to two lines. <code>'5,7p;7q'</code> read seven lines of a million and stopped. The last pair is the unanchored-rename trap from the pitfall below: without <code>\\b</code>, "id" is replaced inside <code>width</code>, <code>valid</code> and <code>hidden</code>. (Ubuntu 24.04.)</p>

<h3>On macOS and WSL: what is different</h3>
<p>WSL2 runs GNU sed, as on the server. macOS ships BSD sed, and it differs in more places than <code>-i</code>. Each row was run on macOS 27 with <code>/usr/bin/sed</code>:</p>
<table>
<tr><th>What you type</th><th>GNU sed (Ubuntu)</th><th>BSD sed (macOS)</th></tr>
<tr><td><code>sed -i 's/yes/no/' m.conf</code></td><td>edits the file</td><td><code>sed: 1: "m.conf …": invalid command code m</code> — it took your expression as the backup suffix</td></tr>
<tr><td><code>sed -i '' 's/yes/no/' m.conf</code></td><td><code>sed: can't read s/yes/no/: No such file or directory</code> — <code>''</code> became the (empty) script</td><td>edits the file, no backup</td></tr>
<tr><td><code>sed -i.bak 's/yes/no/' m.conf</code></td><td>works</td><td>works — the portable form</td></tr>
<tr><td><code>s/\\bid\\b/uuid/g</code></td><td>word boundary</td><td>no effect: <code>id width valid</code> unchanged; BSD writes <code>[[:&lt;:]]id[[:&gt;:]]</code></td></tr>
<tr><td><code>-E '/^\\s*#/d'</code></td><td>deletes indented comments</td><td>does nothing — <code>\\s</code> is unknown; <code>[[:space:]]</code> works on both</td></tr>
<tr><td><code>'/^\\[database\\]/a\\timeout = 30'</code></td><td>appends a line</td><td><code>extra characters after \\ at the end of a command</code> — put the text on the next line after <code>a\\</code></td></tr>
<tr><td><code>'/BEGIN/,/END/{//!p}'</code></td><td>works</td><td><code>extra characters at the end of p command</code> — write <code>{//!p;}</code>, which both accept</td></tr>
<tr><td><code>'s/a\\+/X/'</code> (BRE <code>\\+</code>)</td><td><code>X</code></td><td><code>aaa</code> — use <code>-E 's/a+/X/'</code></td></tr>
<tr><td><code>sed --version</code></td><td>prints the version</td><td><code>illegal option -- -</code></td></tr>
</table>
<p>The rule that keeps one script working in both places: <code>-E</code> always, POSIX classes like <code>[[:space:]]</code> instead of <code>\\s</code>, <code>-i.bak</code> for in-place edits, <code>a\\</code> followed by a real newline, and a <code>;</code> before every <code>}</code>. Or reach for <code>perl -pi -e</code>, which behaves the same everywhere.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> the team's VPS must stop accepting root and password logins, and allow at most 3 authentication attempts. Before touching the real <code>/etc/ssh/sshd_config</code>, rehearse the exact edit on a copy in your sandbox — with a dry run, a backup and a diff you can show the team.</p><ol>
<li>Create the copy:
<pre><code class="language-bash">mkdir -p ~/thu-linux/ch3/bt35 &amp;&amp; cd ~/thu-linux/ch3/bt35
printf '%s\\n' '# SSH cua nhom' 'Port 22' '' 'PermitRootLogin yes' '#PasswordAuthentication no' 'PasswordAuthentication yes' 'UsePAM yes' &gt; sshd.test</code></pre></li>
<li>Dry run — print only what WOULD change: <code>sed -n -E 's/^(PermitRootLogin|PasswordAuthentication) yes/\\1 no/p' sshd.test</code>. Note that the commented <code>#PasswordAuthentication</code> line is left alone because of <code>^</code>.</li>
<li>Apply it with a backup: the same expression with <code>sed -i.bak -E '…'</code> instead of <code>-n … p</code>.</li>
<li>Add <code>MaxAuthTries 3</code> after the <code>Port</code> line, in the form that works on Linux and Mac alike:
<pre><code class="language-bash">sed -i.bak2 '/^Port /a\\
MaxAuthTries 3' sshd.test</code></pre></li>
<li>Show only the settings in effect: <code>sed -E '/^[[:space:]]*#/d; /^[[:space:]]*\$/d' sshd.test</code>, then count the changed lines against the original: <code>diff -u sshd.test.bak sshd.test | grep -c '^[-+][^-+]'</code>.</li></ol>
<p><strong>Done when:</strong> the dry run prints exactly 2 lines; the effective config is 5 lines (<code>Port 22</code>, <code>MaxAuthTries 3</code>, <code>PermitRootLogin no</code>, <code>PasswordAuthentication no</code>, <code>UsePAM yes</code>); the diff count is <code>5</code>; and <code>sshd.test.bak</code> still contains <code>PermitRootLogin yes</code>. (Checked on Ubuntu 24.04 and on macOS 27.)</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Stream editor</span><span class="v">A program that edits text as it flows past, one line at a time, without opening an editor — what "sed" stands for.</span></div>
  <div class="kv"><span class="k">Pattern space</span><span class="v">sed's working buffer: the current line, which the commands change before it is printed.</span></div>
  <div class="kv"><span class="k">Address</span><span class="v">Which lines a command applies to: a number, a range <code>2,5</code>, <code>\$</code>, or a regex <code>/^#/</code>.</span></div>
  <div class="kv"><span class="k">Substitute (s)</span><span class="v"><code>s/pattern/replacement/flags</code> — replace the first match per line, or all with <code>g</code>.</span></div>
  <div class="kv"><span class="k">Capture group / back-reference</span><span class="v"><code>( )</code> remembers part of a match; <code>\\1</code> reuses it; <code>&amp;</code> is the whole match.</span></div>
  <div class="kv"><span class="k">Delimiter</span><span class="v">The character right after <code>s</code>; <code>|</code> or <code>#</code> keep paths readable.</span></div>
  <div class="kv"><span class="k">In-place edit (-i)</span><span class="v">Replacing the file with sed's output — really a new file renamed over the old one.</span></div>
  <div class="kv"><span class="k">Dry run</span><span class="v">Running the change without writing anything (<code>sed -n '…p'</code>) to see what it would do.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>sed reads a line, checks the address, runs the command, prints — one line in memory at a time.</li>
<li><code>s</code> replaces the first match on each line; add <code>g</code> for all, and escape <code>&amp;</code> in the replacement.</li>
<li>Addresses (<code>3</code>, <code>2,5</code>, <code>/re/</code>, <code>/a/,/b/</code>, <code>!</code>) plus <code>p d i a c q</code> make sed far more than find-and-replace.</li>
<li>Dry-run with <code>sed -n '…p'</code>, then edit with <code>-i.bak</code> on a clean git tree.</li>
<li><code>-i</code> writes a new inode: single-file bind mounts and hard links keep the old content.</li>
<li>macOS BSD sed lacks <code>\\b</code>, <code>\\s</code>, one-line <code>a\\text</code> and bare <code>-i</code>; <code>-E</code>, <code>[[:space:]]</code> and <code>-i.bak</code> work on both.</li>
</ul>

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
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
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

${slide('lx-03', 21, 'Một lệnh sed = địa chỉ + chữ cái lệnh + đối số')}

<h3>Lệnh thay thế</h3>
<pre><code class="language-bash">sed 's/old/new/' file.txt          <span class="tok-comment"># lần khớp đầu tiên TRÊN MỖI DÒNG</span>
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
<pre><code class="language-bash">sed 's/\\/usr\\/local/\\/opt/g' paths.txt      <span class="tok-comment"># không đọc nổi</span>
sed 's|/usr/local|/opt|g' paths.txt        <span class="tok-comment"># y hệt, mà đọc được</span>
sed 's#http://#https://#g' urls.txt        <span class="tok-comment"># dấu # cũng chạy</span></code></pre>
<p>Ký tự nào cũng làm dấu phân cách được — <code>sed</code> lấy bất cứ thứ gì đứng ngay sau chữ <code>s</code>. Khi mẫu của bạn có chứa gạch chéo (đường dẫn, URL), hãy đổi sang <code>|</code> hoặc <code>#</code>. Đây không phải sở thích hình thức; những mẫu đầy gạch-chéo-đã-thoát chính là nơi lỗi sed ẩn mình.</p>

<h3>Địa chỉ: tác động lên những dòng nào</h3>
${slide('lx-03', 23, 'Địa chỉ chọn dòng, chữ cái chọn việc: p d i a c q')}
<pre><code class="language-bash">sed '3s/old/new/' file            <span class="tok-comment"># chỉ dòng 3</span>
sed '2,5s/old/new/' file          <span class="tok-comment"># dòng 2 tới 5</span>
sed '\$s/old/new/' file            <span class="tok-comment"># dòng cuối cùng</span>
sed '2,\$s/old/new/' file          <span class="tok-comment"># từ dòng 2 tới hết</span>
sed '/^#/s/old/new/' file         <span class="tok-comment"># chỉ những dòng bắt đầu bằng #</span>
sed '/BEGIN/,/END/s/old/new/' f   <span class="tok-comment"># giữa hai dấu mốc</span>
sed '/^#/!s/old/new/' file        <span class="tok-comment"># ! đảo lại: những dòng KHÔNG bắt đầu bằng #</span></code></pre>
<p>Một địa chỉ đặt trước một lệnh sẽ giới hạn lệnh đó. Chính khả năng ghép nối ấy làm cho <code>sed</code> vượt xa phép tìm-và-thay: câu "đổi từ này, nhưng chỉ bên trong mục <code>[database]</code> của file cấu hình" gói lại thành đúng một biểu thức.</p>

<h3>Những lệnh khác ngoài s</h3>
<pre><code class="language-bash">sed -n '5p' file                  <span class="tok-comment"># -n tắt output, p in ra → chỉ dòng 5</span>
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
${slide('lx-03', 22, 's/// thay chỗ khớp ĐẦU mỗi dòng; \\1 và & dùng lại phần đã khớp')}
<pre><code class="language-bash">echo "2026-08-22" | sed -E 's/([0-9]{4})-([0-9]{2})-([0-9]{2})/\\3\\/\\2\\/\\1/'</code></pre>
<div class="out">22/08/2026</div>
<pre><code class="language-bash"><span class="tok-comment"># &amp; là TOÀN BỘ chỗ khớp — bọc mọi con số vào ngoặc vuông</span>
echo "port 8080" | sed -E 's/[0-9]+/[&amp;]/'

<span class="tok-comment"># đổi chỗ hai trường cách nhau bằng dấu phẩy</span>
sed -E 's/^([^,]+),([^,]+)/\\2,\\1/' data.csv

<span class="tok-comment"># rút số phiên bản ra khỏi một dòng</span>
sed -nE 's/^version = "(.*)"\$/\\1/p' Cargo.toml</code></pre>
<div class="out">port [8080]</div>
<p>Để ý chữ <code>-E</code> ở tất cả những dòng trên. Không có nó, bạn đang ở trong BRE (Bài 3.3) và phải viết <code>\\(</code>, <code>\\)</code>, <code>\\{</code>, <code>\\+</code> — về mặt kỹ thuật vẫn đủ sức mạnh, nhưng gấp đôi số gạch chéo. Hãy dùng <code>-E</code> trừ khi bạn viết cho một hệ thống không có nó.</p>
<div class="callout warn">Trong phần <em>THAY THẾ</em>, ba ký tự mang nghĩa đặc biệt: <code>&amp;</code> (toàn bộ chỗ khớp), <code>\\1</code>–<code>\\9</code> (các nhóm), và chính dấu phân cách. Nếu phần thay thế của bạn có chứa một dấu <code>&amp;</code> nguyên văn — một chuỗi truy vấn URL, một thực thể HTML — bạn PHẢI thoát nó thành <code>\\&amp;</code>, không thì sed âm thầm chèn vào đó đoạn văn bản vừa khớp. Cái này sinh ra kết quả sai mà trông rất hợp lý, chứ không sinh ra lỗi.</div>

<h3>Sửa file tại chỗ</h3>
${slide('lx-03', 24, 'sed -i khác nhau giữa GNU và macOS — và nó đổi inode')}
<pre><code class="language-bash">sed 's/old/new/g' file.txt              <span class="tok-comment"># in ra stdout, file không bị đụng</span>
sed -i 's/old/new/g' file.txt           <span class="tok-comment"># sửa thẳng file, KHÔNG sao lưu</span>
sed -i.bak 's/old/new/g' file.txt       <span class="tok-comment"># giữ lại file.txt.bak</span></code></pre>
<div class="callout warn"><strong>sed của macOS và BSD khác ở chỗ này</strong>, và nó cắn mọi người viết script trên Mac rồi chạy trên máy chủ Linux, hoặc ngược lại. <code>sed -i</code> của BSD <em>BẮT BUỘC</em> phải có một tham số hậu tố: <code>sed -i '' 's/a/b/' f</code> trên macOS, còn <code>sed -i 's/a/b/' f</code> trên Linux. Không dạng nào chạy được trên nền còn lại. Trong một script phải chạy cả hai nơi, hãy dùng <code>perl -pi -e 's/a/b/'</code>, thứ hành xử y hệt ở mọi nơi.</div>
<p>Có đúng một cách viết mà cả hai đều nhận: <strong><code>sed -i.bak 's/a/b/' f</code></strong> — hậu tố viết dính liền vào <code>-i</code> — chạy được trên GNU lẫn macOS (đã kiểm cả hai) và để lại cho bạn một bản sao lưu. Xoá file <code>.bak</code> sau khi đã kiểm kết quả.</p>
<div class="callout warn"><strong><code>-i</code> không sửa cái file mà bạn nghĩ nó sửa.</strong> Nó ghi kết quả ra một file tạm MỚI rồi đổi tên file đó đè lên bản gốc, nên đường dẫn giờ trỏ vào một inode hoàn toàn mới:
<pre><code class="language-bash">cp sshd.cu t3.conf; ls -i t3.conf | cut -d' ' -f1
sed -i 's/yes/no/' t3.conf
ls -i t3.conf | cut -d' ' -f1</code></pre>
<div class="out">31365
31367</div>
Thường thì vô hại. Nhưng một container Docker bind-mount <em>ĐÚNG MỘT file</em> thì gắn vào inode cũ và cứ đọc nội dung cũ — đúng cách một file cấu hình nginx của một dự án sinh viên "deploy thành công" mà không đổi được gì. Liên kết cứng (hard link) tới file cũng đứt theo cùng kiểu. Khi có bind-mount một file đơn, hãy ghi đè nội dung TẠI CHỖ: <code>sed 's/a/b/' f &gt; /tmp/f.new &amp;&amp; cat /tmp/f.new &gt; f</code>.</div>

<h3>Trên nhiều file cùng lúc</h3>
<pre><code class="language-bash"><span class="tok-comment"># NHÌN TRƯỚC ĐÃ — không có -i, nên không có gì thay đổi</span>
grep -rl "oldApiUrl" src/ | xargs -r sed -n 's/oldApiUrl/newApiUrl/gp'

<span class="tok-comment"># rồi mới làm thật</span>
grep -rl "oldApiUrl" src/ | xargs -r sed -i 's/oldApiUrl/newApiUrl/g'

<span class="tok-comment"># hoặc với find, an toàn với NUL (Bài 2.3)</span>
find src -name "*.ts" -print0 | xargs -0 sed -i 's/oldApiUrl/newApiUrl/g'</code></pre>
<p>Dạng <code>-n …p</code> ở dòng đầu chỉ in ra những dòng <em>SẼ</em> thay đổi, với thay đổi đã được áp vào. Đó chính là lần chạy thử, và chạy nó trước lệnh thật tốn ba giây.</p>

<h3>Những công thức đáng giữ</h3>
<pre><code class="language-bash"><span class="tok-comment"># Bóc chú thích và dòng trống khỏi một file cấu hình — xem cái gì THẬT SỰ đang đặt</span>
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

<h3>Đọc một lệnh sed từ ngoài vào trong</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Chữ cái lệnh đứng trước</span><span class="lz-d"><code>s</code> thay thế, <code>d</code> xoá, <code>p</code> in, <code>a</code> chèn thêm. Mọi thứ còn lại đều là đối số cho đúng chữ cái đó.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Một địa chỉ chọn các dòng</span><span class="lz-d"><code>/error/d</code> xoá những dòng khớp; <code>2,5s/…/…/</code> chỉ thay trong dòng 2–5. Không có địa chỉ nghĩa là mọi dòng.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Dấu phân cách là ký tự đứng ngay sau s</span><span class="lz-d"><code>s|a|b|</code> giống hệt <code>s/a/b/</code> — tiện khi mẫu có chứa dấu gạch chéo, tức là mọi đường dẫn bạn từng sửa.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Cờ đặt ở cuối</span><span class="lz-d"><code>g</code> để thay MỌI chỗ khớp trên dòng, không chỉ chỗ đầu tiên. Bỏ quên nó là lý do phổ biến nhất khiến một phép thay thế &quot;chỉ chạy được một nửa&quot;.</span></div>
</div>

<h3>Bảng cờ của sed</h3>
<table>
<tr><th>Cờ</th><th>Nghĩa</th><th>Ví dụ thật (GNU sed 4.9)</th></tr>
<tr><td><code>-n</code></td><td>không tự in mọi dòng; chỉ lệnh <code>p</code> mới in</td><td><code>sed -n '/Password/p' sshd.moi</code> → <code>PasswordAuthentication no</code></td></tr>
<tr><td><code>-E</code> (hay <code>-r</code>)</td><td>regex mở rộng: <code>+ ? | ( ) {}</code> không cần gạch chéo ngược</td><td><code>echo aaa | sed -E 's/a+/X/'</code> → <code>X</code>; thiếu <code>-E</code>, <code>'s/a+/X/'</code> để nguyên <code>aaa</code></td></tr>
<tr><td><code>-e</code></td><td>thêm một biểu thức nữa (được nhiều cái)</td><td><code>echo "a b" | sed -e 's/a/1/' -e 's/b/2/'</code> → <code>1 2</code></td></tr>
<tr><td><code>-i</code> · <code>-i.bak</code></td><td>sửa thẳng vào file · và giữ bản gốc thành <code>file.bak</code></td><td><code>sed -i.bak 's/yes/no/' t2.conf</code> → <code>t2.conf</code> + <code>t2.conf.bak</code></td></tr>
<tr><td><code>-s</code></td><td>coi nhiều file là riêng rẽ (địa chỉ như <code>\$</code> tính lại cho từng file)</td><td><code>sed -n '\$=' sshd.cu sshd.moi</code> → <code>11</code>; với <code>-sn</code> → <code>5</code> và <code>6</code></td></tr>
</table>

<h3>Chạy thử từng bước</h3>
<p>Trong <code>~/thu-linux/ch3/cfg</code>, nơi Bài 3.4 để lại <code>sshd.cu</code> (năm dòng: Port, PermitRootLogin, PasswordAuthentication, X11Forwarding, UsePAM). Đoán trước mọi output:</p>
<pre><code class="language-bash">cd ~/thu-linux/ch3/cfg
echo "cat cat cat" | sed 's/cat/dog/'
echo "cat cat cat" | sed 's/cat/dog/g'
echo "cat cat cat" | sed 's/cat/dog/2'
sed -n 's/yes/no/p' sshd.cu
sed '2,3s/yes/NO/' sshd.cu
printf 'a\\n\\n# c\\nb\\n' | sed '/^\$/d; /^#/d'
seq 1 1000000 | sed -n '5,7p;7q'
echo "id width valid id_x hidden" | sed 's/id/uuid/g'
echo "id width valid id_x hidden" | sed 's/\\bid\\b/uuid/g'</code></pre>
<div class="out">dog cat cat
dog dog dog
cat dog cat
PermitRootLogin no
PasswordAuthentication no
X11Forwarding no
UsePAM no
Port 22
PermitRootLogin NO
PasswordAuthentication NO
X11Forwarding yes
UsePAM yes
a
b
5
6
7
uuid wuuidth valuuid uuid_x huuidden
uuid width valid id_x hidden</div>
<p>Ba dòng đầu là toàn bộ câu chuyện của cờ <code>g</code>. <code>-n … p</code> chỉ in những dòng mà phép thay đã chạm tới — chính là lần chạy thử cần làm trước mọi <code>-i</code>. Địa chỉ <code>2,3</code> giới hạn thay đổi trong hai dòng. <code>'5,7p;7q'</code> đọc bảy dòng trong một triệu rồi dừng. Cặp cuối là cái bẫy đổi tên không neo trong mục Bẫy bên dưới: thiếu <code>\\b</code>, "id" bị thay bên trong <code>width</code>, <code>valid</code> và <code>hidden</code>. (Ubuntu 24.04.)</p>

<h3>Trên macOS và WSL khác gì</h3>
<p>WSL2 chạy GNU sed, như trên máy chủ. macOS đi kèm BSD sed, và nó khác ở nhiều chỗ hơn chỉ mỗi <code>-i</code>. Mỗi dòng dưới đây được chạy trên macOS 27 bằng <code>/usr/bin/sed</code>:</p>
<table>
<tr><th>Bạn gõ</th><th>GNU sed (Ubuntu)</th><th>BSD sed (macOS)</th></tr>
<tr><td><code>sed -i 's/yes/no/' m.conf</code></td><td>sửa file</td><td><code>sed: 1: "m.conf …": invalid command code m</code> — nó lấy biểu thức của bạn làm hậu tố sao lưu</td></tr>
<tr><td><code>sed -i '' 's/yes/no/' m.conf</code></td><td><code>sed: can't read s/yes/no/: No such file or directory</code> — <code>''</code> thành script (rỗng)</td><td>sửa file, không sao lưu</td></tr>
<tr><td><code>sed -i.bak 's/yes/no/' m.conf</code></td><td>chạy</td><td>chạy — dạng viết chung được</td></tr>
<tr><td><code>s/\\bid\\b/uuid/g</code></td><td>ranh giới từ</td><td>không tác dụng: <code>id width valid</code> giữ nguyên; BSD viết <code>[[:&lt;:]]id[[:&gt;:]]</code></td></tr>
<tr><td><code>-E '/^\\s*#/d'</code></td><td>xoá chú thích có thụt lề</td><td>không làm gì — không hiểu <code>\\s</code>; <code>[[:space:]]</code> chạy cả hai nơi</td></tr>
<tr><td><code>'/^\\[database\\]/a\\timeout = 30'</code></td><td>thêm một dòng</td><td><code>extra characters after \\ at the end of a command</code> — đặt chữ ở dòng kế tiếp sau <code>a\\</code></td></tr>
<tr><td><code>'/BEGIN/,/END/{//!p}'</code></td><td>chạy</td><td><code>extra characters at the end of p command</code> — viết <code>{//!p;}</code>, cả hai đều nhận</td></tr>
<tr><td><code>'s/a\\+/X/'</code> (<code>\\+</code> của BRE)</td><td><code>X</code></td><td><code>aaa</code> — dùng <code>-E 's/a+/X/'</code></td></tr>
<tr><td><code>sed --version</code></td><td>in phiên bản</td><td><code>illegal option -- -</code></td></tr>
</table>
<p>Luật giữ cho một script chạy được ở cả hai nơi: luôn <code>-E</code>, lớp POSIX như <code>[[:space:]]</code> thay cho <code>\\s</code>, <code>-i.bak</code> cho sửa tại chỗ, <code>a\\</code> rồi xuống dòng thật, và một dấu <code>;</code> trước mỗi <code>}</code>. Hoặc dùng <code>perl -pi -e</code>, thứ hành xử như nhau ở mọi nơi.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> VPS của nhóm phải thôi nhận đăng nhập bằng root và bằng mật khẩu, và chỉ cho tối đa 3 lần thử xác thực. Trước khi đụng vào <code>/etc/ssh/sshd_config</code> thật, hãy tập đúng phép sửa đó trên một bản chép trong sân tập — có chạy thử, có sao lưu và có một bản diff để đưa cả nhóm xem.</p><ol>
<li>Tạo bản chép:
<pre><code class="language-bash">mkdir -p ~/thu-linux/ch3/bt35 &amp;&amp; cd ~/thu-linux/ch3/bt35
printf '%s\\n' '# SSH cua nhom' 'Port 22' '' 'PermitRootLogin yes' '#PasswordAuthentication no' 'PasswordAuthentication yes' 'UsePAM yes' &gt; sshd.test</code></pre></li>
<li>Chạy thử — chỉ in thứ SẼ đổi: <code>sed -n -E 's/^(PermitRootLogin|PasswordAuthentication) yes/\\1 no/p' sshd.test</code>. Để ý dòng <code>#PasswordAuthentication</code> đang bị chú thích được để yên nhờ dấu <code>^</code>.</li>
<li>Áp dụng có sao lưu: cùng biểu thức đó với <code>sed -i.bak -E '…'</code> thay cho <code>-n … p</code>.</li>
<li>Thêm <code>MaxAuthTries 3</code> sau dòng <code>Port</code>, bằng dạng viết chạy được cả trên Linux lẫn Mac:
<pre><code class="language-bash">sed -i.bak2 '/^Port /a\\
MaxAuthTries 3' sshd.test</code></pre></li>
<li>Chỉ hiện những thiết lập đang có hiệu lực: <code>sed -E '/^[[:space:]]*#/d; /^[[:space:]]*\$/d' sshd.test</code>, rồi đếm số dòng đã đổi so với bản gốc: <code>diff -u sshd.test.bak sshd.test | grep -c '^[-+][^-+]'</code>.</li></ol>
<p><strong>Đạt khi:</strong> lần chạy thử in đúng 2 dòng; cấu hình hiệu lực có 5 dòng (<code>Port 22</code>, <code>MaxAuthTries 3</code>, <code>PermitRootLogin no</code>, <code>PasswordAuthentication no</code>, <code>UsePAM yes</code>); con số diff là <code>5</code>; và <code>sshd.test.bak</code> vẫn còn <code>PermitRootLogin yes</code>. (Đã kiểm trên Ubuntu 24.04 và macOS 27.)</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Stream editor (trình sửa dòng chảy)</span><span class="v">Chương trình sửa chữ khi nó chảy qua, mỗi lần một dòng, không cần mở trình soạn thảo — nghĩa của chữ "sed".</span></div>
  <div class="kv"><span class="k">Pattern space (vùng mẫu)</span><span class="v">Bộ đệm làm việc của sed: dòng hiện tại, bị các lệnh sửa trước khi được in ra.</span></div>
  <div class="kv"><span class="k">Address (địa chỉ)</span><span class="v">Lệnh áp lên những dòng nào: một số, một khoảng <code>2,5</code>, <code>\$</code>, hoặc một regex <code>/^#/</code>.</span></div>
  <div class="kv"><span class="k">Substitute — s (lệnh thay thế)</span><span class="v"><code>s/mẫu/thay-bằng/cờ</code> — thay chỗ khớp đầu tiên mỗi dòng, hoặc mọi chỗ với <code>g</code>.</span></div>
  <div class="kv"><span class="k">Capture group / back-reference (nhóm bắt giữ / tham chiếu ngược)</span><span class="v"><code>( )</code> nhớ một phần chỗ khớp; <code>\\1</code> dùng lại nó; <code>&amp;</code> là toàn bộ chỗ khớp.</span></div>
  <div class="kv"><span class="k">Delimiter (dấu phân cách)</span><span class="v">Ký tự đứng ngay sau <code>s</code>; <code>|</code> hoặc <code>#</code> giúp đường dẫn dễ đọc.</span></div>
  <div class="kv"><span class="k">In-place edit — -i (sửa tại chỗ)</span><span class="v">Thay file bằng output của sed — thật ra là một file mới được đổi tên đè lên file cũ.</span></div>
  <div class="kv"><span class="k">Dry run (chạy thử)</span><span class="v">Chạy thay đổi mà không ghi gì (<code>sed -n '…p'</code>) để xem nó sẽ làm gì.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>sed đọc một dòng, kiểm địa chỉ, chạy lệnh, in ra — trong bộ nhớ lúc nào cũng chỉ có một dòng.</li>
<li><code>s</code> thay chỗ khớp đầu tiên trên mỗi dòng; thêm <code>g</code> để thay hết, và thoát <code>&amp;</code> trong phần thay.</li>
<li>Địa chỉ (<code>3</code>, <code>2,5</code>, <code>/re/</code>, <code>/a/,/b/</code>, <code>!</code>) cùng <code>p d i a c q</code> làm sed vượt xa phép tìm-và-thay.</li>
<li>Chạy thử bằng <code>sed -n '…p'</code>, rồi sửa bằng <code>-i.bak</code> trên một cây git sạch.</li>
<li><code>-i</code> tạo một inode mới: bind-mount một file đơn và liên kết cứng vẫn giữ nội dung cũ.</li>
<li>BSD sed của macOS thiếu <code>\\b</code>, <code>\\s</code>, <code>a\\chữ</code> một dòng và <code>-i</code> trơn; <code>-E</code>, <code>[[:space:]]</code> và <code>-i.bak</code> chạy cả hai nơi.</li>
</ul>

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
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
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
${slide('lx-03', 25, 'awk cắt sẵn mỗi dòng thành $1…$NF — đọc một dòng log nginx')}
<pre><code class="language-bash">awk 'PATTERN { ACTION }' file</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Read</span><span class="lz-t">one line, split into fields</span><span class="lz-d">Split on runs of whitespace by default. \$1 is the first field, \$2 the second, \$0 the whole line.</span></div>
  <div class="lz-step"><span class="lz-k">Test</span><span class="lz-t">does the line match PATTERN?</span><span class="lz-d">A regex, a comparison, or nothing at all — an empty pattern matches every line.</span></div>
  <div class="lz-step"><span class="lz-k">Act</span><span class="lz-t">run ACTION</span><span class="lz-d">Omit it and awk prints the line. So the pattern alone behaves like grep.</span></div>
  <div class="lz-step"><span class="lz-k">Repeat</span><span class="lz-t">next line, until EOF</span><span class="lz-d">Then run the END block, if there is one. Variables persist across lines — this is what makes totals possible.</span></div>
</div>

<pre><code class="language-bash">awk '{print \$1}' access.log         <span class="tok-comment"># no pattern: every line</span>
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
<pre><code class="language-bash">awk '{print NR, \$0}' file.txt           <span class="tok-comment"># number every line</span>
awk '{print \$NF}' access.log            <span class="tok-comment"># the last field, whatever its position</span>
awk 'NF' file.txt                       <span class="tok-comment"># NF is 0 on blank lines → deletes them</span>
awk 'NR &gt; 1' data.csv                   <span class="tok-comment"># skip the header row</span>
awk 'NR % 10 == 0' huge.log             <span class="tok-comment"># sample every 10th line</span></code></pre>
<div class="callout ok"><code>awk 'NF'</code> is a small masterpiece: the pattern is just the field count, awk treats 0 as false, so blank lines are dropped and everything else is printed by the implicit action. Three characters that replace <code>grep -v '^\$'</code>.</div>

<h3>Separators</h3>
<pre><code class="language-bash">awk -F, '{print \$2}' data.csv           <span class="tok-comment"># comma-separated</span>
awk -F: '{print \$1, \$7}' /etc/passwd    <span class="tok-comment"># colon</span>
awk -F'\\t' '{print \$3}' data.tsv        <span class="tok-comment"># tab</span>
awk -F'[,;]' '{print \$2}' mixed.txt      <span class="tok-comment"># FS is a REGEX: comma or semicolon</span>
awk 'BEGIN{OFS=" | "} {print \$1, \$2}' f <span class="tok-comment"># change the OUTPUT separator</span></code></pre>
<div class="out">root | /bin/bash
deploy | /bin/bash</div>
<div class="callout warn">Default splitting collapses runs of whitespace and ignores leading spaces — which is why <code>awk '{print \$3}'</code> works on <code>ls -l</code> where <code>cut -d' ' -f3</code> fails (Lesson 3.4). But the moment you set <code>-F,</code>, that friendliness stops: two commas in a row now mean an empty field, exactly like <code>cut</code>. That is correct for CSV and surprising if you were not expecting it.</div>

<h3>BEGIN and END</h3>
${slide('lx-03', 26, 'BEGIN chạy trước, END chạy sau — biến tự nhớ qua mọi dòng')}
<pre><code class="language-bash">awk 'BEGIN {print "starting"} {n++} END {print n, "lines"}' file.txt</code></pre>
<div class="out">starting
4213 lines</div>
<p><code>BEGIN</code> runs once before any input, <code>END</code> once after the last line. Variables survive between lines and are initialised to zero or empty, so <code>n++</code> needs no declaration. That is the whole basis of aggregation:</p>
<pre><code class="language-bash"><span class="tok-comment"># Sum a column</span>
awk '{sum += \$3} END {print sum}' sales.txt

<span class="tok-comment"># Average, with a guard against dividing by zero</span>
awk '{sum += \$1; n++} END {if (n) print sum/n}' times.txt

<span class="tok-comment"># Min and max in one pass</span>
awk 'NR==1 {min=max=\$1} {if (\$1&lt;min) min=\$1; if (\$1&gt;max) max=\$1} END {print min, max}' n.txt</code></pre>
<div class="out">184320
42.7
3 998</div>

<h3>Associative arrays: grouping without a database</h3>
${slide('lx-03', 27, 'Mảng liên kết: nhóm và cộng dồn trong MỘT lượt đọc')}
<p>This is the feature that makes <code>awk</code> worth learning. Arrays are indexed by <em>strings</em>, created on first use:</p>
<pre><code class="language-bash"><span class="tok-comment"># Count requests per IP — the sort|uniq -c pipeline, in one pass and unsorted input</span>
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
<pre><code class="language-bash">awk '{printf "%-20s %8.2f\\n", \$1, \$2}' data.txt   <span class="tok-comment"># left-pad, right-align, 2 decimals</span>
awk '{printf "%5d %s\\n", NR, \$0}' file.txt         <span class="tok-comment"># numbered, aligned</span></code></pre>
<div class="out">deploy                 142.50
postgres              1841.09
redis                   12.75</div>
<p><code>print</code> adds a newline; <code>printf</code> does not, so you write <code>\\n</code> yourself. The format codes are C's: <code>%s</code> string, <code>%d</code> integer, <code>%f</code> float, <code>%-20s</code> left-justified in 20 columns, <code>%8.2f</code> eight wide with two decimals.</p>

<h3>Conditions and multiple rules</h3>
<pre><code class="language-bash">awk '\$3 &gt; 100 &amp;&amp; \$1 ~ /^203\\./ {print}' access.log     <span class="tok-comment"># ~ is "matches regex"</span>
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
<pre><code class="language-bash"><span class="tok-comment"># Print a specific column range</span>
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
${slide('lx-03', 28, 'Chương trình awk nằm trong nháy ĐƠN — biến shell đi qua -v')}
<div class="kv-grid">
  <div class="kv"><span class="k"><code>gawk</code></span><span class="v">GNU awk. The default on most Linux distributions. Has <code>gensub()</code>, <code>asort()</code>, true multidimensional arrays, and <code>-i inplace</code>.</span></div>
  <div class="kv"><span class="k"><code>mawk</code></span><span class="v">Debian and Ubuntu's default <code>awk</code>. Considerably faster, but lacks the gawk extensions — a script using <code>gensub()</code> fails here with a confusing error.</span></div>
  <div class="kv"><span class="k"><code>BSD awk</code></span><span class="v">macOS. The most limited. Anything beyond POSIX awk may not work.</span></div>
</div>
<p>Everything in this lesson is POSIX awk and runs everywhere. If you reach for a gawk extension in a script that ships to a server, check <code>awk --version</code> there first, or invoke <code>gawk</code> explicitly.</p>

<h3>When to stop using awk</h3>
<p>Roughly when the program stops fitting on one screen. awk has no real data structures beyond the associative array, no modules, and error handling that amounts to hoping. If you are writing nested functions, parsing quoted CSV fields, or handling multi-line records, the honest answer is a Python script — and the fact that awk <em>could</em> do it is not an argument that it should.</p>


<h3>awk's string functions and flags</h3>
<p>Beyond fields and arrays, a handful of built-in functions cover most text surgery. All of these are POSIX and work in mawk, gawk and the Mac's awk:</p>
<table>
<tr><th>Function</th><th>What it does</th><th>Real result (mawk, Ubuntu 24.04)</th></tr>
<tr><td><code>length(s)</code></td><td>length of a string (of <code>\$0</code> when empty)</td><td><code>length("Nginx/1.24 GET /api/v1/posts")</code> → <code>28</code></td></tr>
<tr><td><code>substr(s, i, n)</code></td><td>n characters starting at position i (counting from 1)</td><td><code>substr("/api/v1/posts", 1, 7)</code> → <code>/api/v1</code></td></tr>
<tr><td><code>split(s, a, sep)</code></td><td>cut s into array a, return how many pieces</td><td><code>n = split("/api/v1/posts", p, "/")</code> → <code>n</code> = 4, <code>p[2]</code> = <code>api</code></td></tr>
<tr><td><code>index(s, t)</code></td><td>position of t inside s, 0 if absent</td><td><code>index("/api/v1/posts", "v1")</code> → <code>6</code></td></tr>
<tr><td><code>sub(re, r)</code> · <code>gsub(re, r)</code></td><td>replace the first · every match in <code>\$0</code>, return the count</td><td><code>echo a-b-c | awk '{n=gsub(/-/,"+"); print n, \$0}'</code> → <code>2 a+b+c</code></td></tr>
<tr><td><code>toupper(s)</code> · <code>tolower(s)</code></td><td>change case</td><td><code>toupper("get")</code> → <code>GET</code></td></tr>
<tr><td><code>printf fmt, …</code> · <code>sprintf</code></td><td>formatted output · formatted string</td><td><code>printf "%-14s %6d\\n"</code> — the per-IP table above</td></tr>
</table>
<table>
<tr><th>Flag / idiom</th><th>Meaning</th></tr>
<tr><td><code>-F:</code> · <code>-F'[:[]'</code></td><td>field separator: one character, or a regex (here: colon or <code>[</code>)</td></tr>
<tr><td><code>-v name=value</code></td><td>pass a shell value in as an awk variable — the only safe way</td></tr>
<tr><td><code>-f prog.awk</code></td><td>read the program from a file once it outgrows one line</td></tr>
<tr><td><code>NR==FNR { …; next }</code></td><td>"while reading the FIRST file": the classic two-file lookup</td></tr>
</table>
<pre><code class="language-bash">awk 'NR==FNR {ten[\$1]=\$2; next} {print \$1, ten[\$1], \$2}' \\
    &lt;(printf 'u1 an\\nu3 chi\\n') &lt;(printf 'u1 ORD-9\\nu3 ORD-7\\n')</code></pre>
<div class="out">u1 an ORD-9
u3 chi ORD-7</div>

<h3>Try it step by step</h3>
<p>Six one-liners on the <code>access.log</code> from Lesson 3.3 — each one answers a question someone on your team would actually ask:</p>
<pre><code class="language-bash">cd ~/thu-linux/ch3/log
head -1 access.log | awk '{print NF, \$1, \$7, \$9, \$NF}'
awk '\$9 &gt;= 400 {print \$9, \$7}' access.log
awk '{s += \$10} END {print s, NR}' access.log
awk '{b[\$1] += \$10} END {for (ip in b) printf "%-14s %6d\\n", ip, b[ip]}' access.log | sort -k2,2nr
awk -F'[:[]' '{h[\$3]++} END {for (x in h) print x, h[x]}' access.log | sort
awk '!seen[\$7]++ {print \$7}' access.log</code></pre>
<div class="out">10 203.0.113.45 /api/v1/posts 200 5120
500 /api/v1/orders
401 /api/v1/auth/me
404 /favicon.ico
21917 10
203.0.113.45    11301
198.51.100.7     5432
192.0.2.19       5184
10 5
11 5
/api/v1/posts
/api/v1/orders
/api/v1/auth/me
/favicon.ico</div>
<p>In order: the first line has 10 fields and <code>\$NF</code> is the byte count; three requests failed with 4xx/5xx; 21,917 bytes over 10 requests; the byte total per client, biggest first; requests per hour, using a regex field separator so the hour lands in <code>\$3</code>; and the distinct paths in the order they first appeared. (Ubuntu 24.04, where <code>awk</code> is mawk 1.3.4.)</p>

<h3>On macOS, WSL and Fedora: which awk you get</h3>
<table>
<tr><th>Machine</th><th><code>awk</code> is</th><th><code>awk --version</code> (real)</th><th>Watch out for</th></tr>
<tr><td>Ubuntu 24.04 / WSL</td><td>mawk</td><td><code>mawk 1.3.4 20240123</code></td><td>no <code>gensub()</code>: <code>awk: line 2: function gensub never defined</code></td></tr>
<tr><td>Fedora 44</td><td>gawk</td><td><code>GNU Awk 5.3.2, API 4.0 …</code></td><td>gawk extensions work here — and nowhere else</td></tr>
<tr><td>macOS 27</td><td>BSD awk ("one true awk")</td><td><code>awk version 20200816</code></td><td>no <code>gensub()</code>: <code>calling undefined function gensub</code>; <code>length("Việt")</code> is <code>6</code> (bytes)</td></tr>
</table>
<p>The <code>length</code> row matters for Vietnamese text: mawk and the Mac's awk count <strong>bytes</strong> (<code>length("Việt")</code> = 6), while gawk in a UTF-8 locale counts <strong>characters</strong> (<code>LC_ALL=C.UTF-8 gawk</code> gives 4). A script that pads columns with <code>printf "%-20s"</code> will misalign accented names on the first two. Stick to POSIX awk for anything that ships to a server, or install and call <code>gawk</code> by name.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your lead wants a morning report from the nginx access log: total traffic, which client used the most bandwidth, which paths failed, how many big responses there were — and the list of endpoints that were hit. One awk line per answer, run in <code>~/thu-linux/ch3/log</code>.</p><ol>
<li>Number of requests and total bytes: <code>awk '{n++; b+=\$10} END {print n, b}' access.log</code>.</li>
<li>Bytes per client IP, biggest first (an array keyed by <code>\$1</code>, then <code>sort -k2,2nr</code>).</li>
<li>Failed requests (status 400 or more) counted per path: <code>awk '\$9 &gt;= 400 {c[\$7]++} END {for (p in c) print c[p], p}' access.log | sort -k2</code>.</li>
<li>Pass the threshold in from the shell instead of hard-coding it: <code>min=5000; awk -v min="\$min" '\$10 &gt;= min' access.log | wc -l</code>.</li>
<li>The endpoints in the order they were first hit, without duplicates: <code>awk '!seen[\$7]++ {print \$7}' access.log</code>.</li></ol>
<p><strong>Done when:</strong> step 1 prints <code>10 21917</code>; step 2 puts <code>203.0.113.45</code> first with <code>11301</code>; step 3 prints three lines, one each for <code>/api/v1/auth/me</code>, <code>/api/v1/orders</code> and <code>/favicon.ico</code>; step 4 prints <code>4</code>; step 5 prints four paths starting with <code>/api/v1/posts</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Record · field</span><span class="v">A line of input · one column of it: <code>\$1</code>, <code>\$2</code> … <code>\$NF</code>; <code>\$0</code> is the whole record.</span></div>
  <div class="kv"><span class="k">Pattern { action }</span><span class="v">awk's rule: for every line where the pattern is true, run the action (print by default).</span></div>
  <div class="kv"><span class="k">NR · NF · FNR</span><span class="v">Line number overall · number of fields on this line · line number within the current file.</span></div>
  <div class="kv"><span class="k">FS · OFS</span><span class="v">Input field separator (<code>-F</code>) · output separator used when awk rebuilds a line.</span></div>
  <div class="kv"><span class="k">BEGIN · END</span><span class="v">Blocks that run once before the first line · once after the last.</span></div>
  <div class="kv"><span class="k">Associative array</span><span class="v">An array indexed by strings (<code>count[\$1]++</code>): grouping without sorting.</span></div>
  <div class="kv"><span class="k">mawk · gawk · BSD awk</span><span class="v">Three implementations: Ubuntu's default · GNU's, with extensions · the Mac's.</span></div>
  <div class="kv"><span class="k">-v</span><span class="v">The flag that passes a shell value into awk as a variable, safely.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>awk splits every line into <code>\$1…\$NF</code> and runs <code>pattern { action }</code> rules on it.</li>
<li><code>NR</code>, <code>NF</code> and <code>-F</code> plus <code>END</code> with a counter cover most one-liners: counts, sums, averages.</li>
<li>Associative arrays group and total in one pass; <code>!seen[\$0]++</code> removes duplicates and keeps order.</li>
<li><code>length</code>, <code>substr</code>, <code>split</code>, <code>index</code>, <code>sub</code>/<code>gsub</code> and <code>printf</code> handle most text surgery.</li>
<li>Single-quote the program and pass shell values with <code>-v</code>; double quotes silently change what awk prints.</li>
<li>Ubuntu's awk is mawk, Fedora's gawk, the Mac's BSD awk: write POSIX awk unless you call <code>gawk</code> by name.</li>
</ul>

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
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: aggregate a log with awk</span><span class="lc-sub">Graded tasks on fields, <code>NR</code>/<code>NF</code>, associative arrays and <code>END</code> blocks, against a real nginx access log.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> quoting. The awk program must be in <strong>single</strong> quotes, because <code>\$1</code> means "field 1" to awk and "shell variable 1" to bash. <code>awk "{print \$1}"</code> in double quotes lets the shell substitute first, so awk never sees <code>\$1</code>. At an interactive prompt <code>\$1</code> is empty, awk receives <code>{print }</code>, and a bare <code>print</code> prints the <strong>whole line</strong> — the command quietly behaves like <code>cat</code>. Inside a script started as <code>./report.sh deploy</code>, awk receives <code>{print deploy}</code> — an unset awk variable — and prints blank lines. Both were checked on Ubuntu 24.04; neither prints an error. To pass a shell variable in properly, use <code>-v</code>: <code>awk -v threshold="\$limit" '\$3 &gt; threshold' file</code>. Never build an awk program by string interpolation.</div>
<p class="note-ct"><strong>Learn it in this order and you will have 95% of the value in an hour:</strong> <code>{print \$1}</code>, then <code>-F</code>, then <code>NR</code>/<code>NF</code>, then <code>END {}</code> with a counter, then associative arrays. Everything after that is refinement. And when a pipeline of four small tools starts needing a fifth, that is usually the moment awk replaces all five.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.6</span>
<h2>awk: cả một ngôn ngữ gói trong một dòng</h2>
<p class="lead"><code>awk</code> là một ngôn ngữ lập trình đầy đủ — biến, mảng, hàm, số học, cấu trúc điều khiển — được thiết kế quanh đúng một giả định: đầu vào của bạn là những dòng gồm nhiều trường. Giả định đó đúng đủ thường xuyên tới mức một dòng <code>awk</code> thay được cả một script mà lẽ ra bạn phải viết bằng Python. Bạn không cần học cả ngôn ngữ. Bạn cần cái mô hình và chừng sáu cấu trúc.</p>

<h3>Mô hình: mẫu { hành động }</h3>
${slide('lx-03', 25, 'awk cắt sẵn mỗi dòng thành $1…$NF — đọc một dòng log nginx')}
<pre><code class="language-bash">awk 'MẪU { HÀNH ĐỘNG }' file</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Đọc</span><span class="lz-t">một dòng, cắt thành các trường</span><span class="lz-d">Mặc định cắt theo chuỗi khoảng trắng. \$1 là trường đầu, \$2 là trường hai, \$0 là cả dòng.</span></div>
  <div class="lz-step"><span class="lz-k">Thử</span><span class="lz-t">dòng này có khớp MẪU không?</span><span class="lz-d">Một regex, một phép so sánh, hoặc không gì cả — mẫu rỗng khớp mọi dòng.</span></div>
  <div class="lz-step"><span class="lz-k">Làm</span><span class="lz-t">chạy HÀNH ĐỘNG</span><span class="lz-d">Bỏ trống thì awk in cả dòng ra. Nên chỉ viết mỗi cái mẫu là nó hành xử như grep.</span></div>
  <div class="lz-step"><span class="lz-k">Lặp</span><span class="lz-t">dòng kế, cho tới hết file</span><span class="lz-d">Rồi chạy khối END nếu có. Biến sống sót qua các dòng — chính điều này làm cho việc cộng dồn khả thi.</span></div>
</div>

<pre><code class="language-bash">awk '{print \$1}' access.log         <span class="tok-comment"># không có mẫu: mọi dòng</span>
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
<pre><code class="language-bash">awk '{print NR, \$0}' file.txt           <span class="tok-comment"># đánh số mọi dòng</span>
awk '{print \$NF}' access.log            <span class="tok-comment"># trường cuối, bất kể nó ở vị trí nào</span>
awk 'NF' file.txt                       <span class="tok-comment"># NF bằng 0 trên dòng trống → xoá chúng đi</span>
awk 'NR &gt; 1' data.csv                   <span class="tok-comment"># bỏ qua dòng tiêu đề</span>
awk 'NR % 10 == 0' huge.log             <span class="tok-comment"># lấy mẫu cứ 10 dòng một</span></code></pre>
<div class="callout ok"><code>awk 'NF'</code> là một kiệt tác nhỏ: cái mẫu chính là số trường, awk coi 0 là sai, nên dòng trống bị loại còn mọi dòng khác được in ra bởi hành động ngầm định. Ba ký tự thay cho cả <code>grep -v '^\$'</code>.</div>

<h3>Dấu phân cách</h3>
<pre><code class="language-bash">awk -F, '{print \$2}' data.csv           <span class="tok-comment"># phân cách bằng dấu phẩy</span>
awk -F: '{print \$1, \$7}' /etc/passwd    <span class="tok-comment"># dấu hai chấm</span>
awk -F'\\t' '{print \$3}' data.tsv        <span class="tok-comment"># tab</span>
awk -F'[,;]' '{print \$2}' mixed.txt      <span class="tok-comment"># FS là một REGEX: dấu phẩy hoặc chấm phẩy</span>
awk 'BEGIN{OFS=" | "} {print \$1, \$2}' f <span class="tok-comment"># đổi dấu phân cách ĐẦU RA</span></code></pre>
<div class="out">root | /bin/bash
deploy | /bin/bash</div>
<div class="callout warn">Cách cắt mặc định gộp các chuỗi khoảng trắng lại và bỏ qua dấu cách đứng đầu — và đó là lý do <code>awk '{print \$3}'</code> chạy được trên <code>ls -l</code> trong khi <code>cut -d' ' -f3</code> thì hỏng (Bài 3.4). Nhưng ngay khi bạn đặt <code>-F,</code>, sự tử tế đó chấm dứt: hai dấu phẩy liền nhau giờ nghĩa là một trường rỗng, y hệt <code>cut</code>. Điều đó ĐÚNG với CSV và gây bất ngờ nếu bạn không lường trước.</div>

<h3>BEGIN và END</h3>
${slide('lx-03', 26, 'BEGIN chạy trước, END chạy sau — biến tự nhớ qua mọi dòng')}
<pre><code class="language-bash">awk 'BEGIN {print "bắt đầu"} {n++} END {print n, "dòng"}' file.txt</code></pre>
<div class="out">bắt đầu
4213 dòng</div>
<p><code>BEGIN</code> chạy một lần trước khi có đầu vào nào, <code>END</code> chạy một lần sau dòng cuối cùng. Biến sống sót giữa các dòng và được khởi tạo bằng 0 hoặc chuỗi rỗng, nên <code>n++</code> chẳng cần khai báo gì. Đó là toàn bộ nền tảng của việc cộng dồn:</p>
<pre><code class="language-bash"><span class="tok-comment"># Cộng một cột</span>
awk '{sum += \$3} END {print sum}' sales.txt

<span class="tok-comment"># Trung bình, có chốt chặn phép chia cho 0</span>
awk '{sum += \$1; n++} END {if (n) print sum/n}' times.txt

<span class="tok-comment"># Nhỏ nhất và lớn nhất trong một lượt đọc</span>
awk 'NR==1 {min=max=\$1} {if (\$1&lt;min) min=\$1; if (\$1&gt;max) max=\$1} END {print min, max}' n.txt</code></pre>
<div class="out">184320
42.7
3 998</div>

<h3>Mảng liên kết: nhóm dữ liệu mà không cần cơ sở dữ liệu</h3>
${slide('lx-03', 27, 'Mảng liên kết: nhóm và cộng dồn trong MỘT lượt đọc')}
<p>Đây là tính năng làm cho <code>awk</code> đáng học. Mảng được đánh chỉ số bằng <em>CHUỖI</em>, và được tạo ra ngay lần dùng đầu tiên:</p>
<pre><code class="language-bash"><span class="tok-comment"># Đếm lượt gọi theo IP — chính chuỗi sort|uniq -c, nhưng một lượt đọc và không cần sắp xếp đầu vào</span>
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
<pre><code class="language-bash">awk '{printf "%-20s %8.2f\\n", \$1, \$2}' data.txt   <span class="tok-comment"># đệm trái, căn phải, 2 số lẻ</span>
awk '{printf "%5d %s\\n", NR, \$0}' file.txt         <span class="tok-comment"># đánh số, căn thẳng hàng</span></code></pre>
<div class="out">deploy                 142.50
postgres              1841.09
redis                   12.75</div>
<p><code>print</code> tự thêm ký tự xuống dòng; <code>printf</code> thì không, nên bạn tự viết <code>\\n</code>. Các mã định dạng là của C: <code>%s</code> chuỗi, <code>%d</code> số nguyên, <code>%f</code> số thực, <code>%-20s</code> căn trái trong 20 cột, <code>%8.2f</code> rộng tám cột với hai số lẻ.</p>

<h3>Điều kiện và nhiều luật cùng lúc</h3>
<pre><code class="language-bash">awk '\$3 &gt; 100 &amp;&amp; \$1 ~ /^203\\./ {print}' access.log     <span class="tok-comment"># ~ nghĩa là "khớp regex"</span>
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
<pre><code class="language-bash"><span class="tok-comment"># In một khoảng cột</span>
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
${slide('lx-03', 28, 'Chương trình awk nằm trong nháy ĐƠN — biến shell đi qua -v')}
<div class="kv-grid">
  <div class="kv"><span class="k"><code>gawk</code></span><span class="v">awk của GNU. Mặc định trên phần lớn bản phân phối Linux. Có <code>gensub()</code>, <code>asort()</code>, mảng nhiều chiều thật sự, và <code>-i inplace</code>.</span></div>
  <div class="kv"><span class="k"><code>mawk</code></span><span class="v"><code>awk</code> mặc định của Debian và Ubuntu. Nhanh hơn đáng kể, nhưng thiếu các phần mở rộng của gawk — một script dùng <code>gensub()</code> sẽ chết ở đây với một thông báo lỗi khó hiểu.</span></div>
  <div class="kv"><span class="k"><code>BSD awk</code></span><span class="v">Trên macOS. Hạn chế nhất. Bất cứ thứ gì vượt ra ngoài awk chuẩn POSIX đều có thể không chạy.</span></div>
</div>
<p>Mọi thứ trong bài này đều là awk chuẩn POSIX và chạy được ở mọi nơi. Nếu bạn với tay lấy một phần mở rộng của gawk trong script sẽ đem lên máy chủ, hãy kiểm <code>awk --version</code> ở đó trước, hoặc gọi thẳng <code>gawk</code>.</p>

<h3>Khi nào nên thôi dùng awk</h3>
<p>Đại khái là khi chương trình thôi vừa một màn hình. awk không có cấu trúc dữ liệu thật nào ngoài mảng liên kết, không có mô-đun, và cách xử lý lỗi thì gần như chỉ là cầu mong. Nếu bạn đang viết hàm lồng nhau, phân tích trường CSV có dấu nháy, hay xử lý bản ghi trải nhiều dòng, câu trả lời trung thực là một script Python — và việc awk <em>CÓ THỂ</em> làm được không phải là lý lẽ cho rằng nó NÊN làm.</p>


<h3>Hàm chuỗi và các cờ của awk</h3>
<p>Ngoài trường và mảng, một nhúm hàm dựng sẵn phủ phần lớn việc "phẫu thuật" văn bản. Tất cả đều là POSIX và chạy trong mawk, gawk lẫn awk của Mac:</p>
<table>
<tr><th>Hàm</th><th>Làm gì</th><th>Kết quả thật (mawk, Ubuntu 24.04)</th></tr>
<tr><td><code>length(s)</code></td><td>độ dài chuỗi (của <code>\$0</code> nếu bỏ trống)</td><td><code>length("Nginx/1.24 GET /api/v1/posts")</code> → <code>28</code></td></tr>
<tr><td><code>substr(s, i, n)</code></td><td>n ký tự bắt đầu từ vị trí i (đếm từ 1)</td><td><code>substr("/api/v1/posts", 1, 7)</code> → <code>/api/v1</code></td></tr>
<tr><td><code>split(s, a, sep)</code></td><td>cắt s vào mảng a, trả về số mảnh</td><td><code>n = split("/api/v1/posts", p, "/")</code> → <code>n</code> = 4, <code>p[2]</code> = <code>api</code></td></tr>
<tr><td><code>index(s, t)</code></td><td>vị trí của t trong s, 0 nếu không có</td><td><code>index("/api/v1/posts", "v1")</code> → <code>6</code></td></tr>
<tr><td><code>sub(re, r)</code> · <code>gsub(re, r)</code></td><td>thay chỗ khớp đầu · mọi chỗ khớp trong <code>\$0</code>, trả về số lần</td><td><code>echo a-b-c | awk '{n=gsub(/-/,"+"); print n, \$0}'</code> → <code>2 a+b+c</code></td></tr>
<tr><td><code>toupper(s)</code> · <code>tolower(s)</code></td><td>đổi hoa thường</td><td><code>toupper("get")</code> → <code>GET</code></td></tr>
<tr><td><code>printf fmt, …</code> · <code>sprintf</code></td><td>in có định dạng · tạo chuỗi có định dạng</td><td><code>printf "%-14s %6d\\n"</code> — chính bảng theo IP ở trên</td></tr>
</table>
<table>
<tr><th>Cờ / lối viết</th><th>Nghĩa</th></tr>
<tr><td><code>-F:</code> · <code>-F'[:[]'</code></td><td>dấu phân cách trường: một ký tự, hoặc một regex (ở đây: dấu hai chấm hoặc <code>[</code>)</td></tr>
<tr><td><code>-v tên=giá-trị</code></td><td>đưa một giá trị của shell vào làm biến awk — cách an toàn duy nhất</td></tr>
<tr><td><code>-f prog.awk</code></td><td>đọc chương trình từ file khi nó đã dài quá một dòng</td></tr>
<tr><td><code>NR==FNR { …; next }</code></td><td>"trong lúc đọc file THỨ NHẤT": lối tra cứu hai file kinh điển</td></tr>
</table>
<pre><code class="language-bash">awk 'NR==FNR {ten[\$1]=\$2; next} {print \$1, ten[\$1], \$2}' \\
    &lt;(printf 'u1 an\\nu3 chi\\n') &lt;(printf 'u1 ORD-9\\nu3 ORD-7\\n')</code></pre>
<div class="out">u1 an ORD-9
u3 chi ORD-7</div>

<h3>Chạy thử từng bước</h3>
<p>Sáu dòng lệnh trên file <code>access.log</code> của Bài 3.3 — mỗi dòng trả lời một câu mà người trong nhóm bạn thật sự sẽ hỏi:</p>
<pre><code class="language-bash">cd ~/thu-linux/ch3/log
head -1 access.log | awk '{print NF, \$1, \$7, \$9, \$NF}'
awk '\$9 &gt;= 400 {print \$9, \$7}' access.log
awk '{s += \$10} END {print s, NR}' access.log
awk '{b[\$1] += \$10} END {for (ip in b) printf "%-14s %6d\\n", ip, b[ip]}' access.log | sort -k2,2nr
awk -F'[:[]' '{h[\$3]++} END {for (x in h) print x, h[x]}' access.log | sort
awk '!seen[\$7]++ {print \$7}' access.log</code></pre>
<div class="out">10 203.0.113.45 /api/v1/posts 200 5120
500 /api/v1/orders
401 /api/v1/auth/me
404 /favicon.ico
21917 10
203.0.113.45    11301
198.51.100.7     5432
192.0.2.19       5184
10 5
11 5
/api/v1/posts
/api/v1/orders
/api/v1/auth/me
/favicon.ico</div>
<p>Theo thứ tự: dòng đầu có 10 trường và <code>\$NF</code> là số byte; ba yêu cầu hỏng với mã 4xx/5xx; 21.917 byte qua 10 yêu cầu; tổng byte theo từng máy khách, lớn nhất trước; số yêu cầu theo giờ, dùng một dấu phân cách dạng regex để giờ rơi vào <code>\$3</code>; và các đường dẫn khác nhau theo thứ tự chúng xuất hiện lần đầu. (Ubuntu 24.04, nơi <code>awk</code> là mawk 1.3.4.)</p>

<h3>Trên macOS, WSL và Fedora: bạn đang có awk nào</h3>
<table>
<tr><th>Máy</th><th><code>awk</code> là</th><th><code>awk --version</code> (thật)</th><th>Cần để ý</th></tr>
<tr><td>Ubuntu 24.04 / WSL</td><td>mawk</td><td><code>mawk 1.3.4 20240123</code></td><td>không có <code>gensub()</code>: <code>awk: line 2: function gensub never defined</code></td></tr>
<tr><td>Fedora 44</td><td>gawk</td><td><code>GNU Awk 5.3.2, API 4.0 …</code></td><td>phần mở rộng của gawk chạy ở đây — và chỉ ở đây</td></tr>
<tr><td>macOS 27</td><td>BSD awk ("one true awk")</td><td><code>awk version 20200816</code></td><td>không có <code>gensub()</code>: <code>calling undefined function gensub</code>; <code>length("Việt")</code> là <code>6</code> (byte)</td></tr>
</table>
<p>Dòng <code>length</code> quan trọng với chữ tiếng Việt: mawk và awk của Mac đếm <strong>BYTE</strong> (<code>length("Việt")</code> = 6), còn gawk trong locale UTF-8 đếm <strong>KÝ TỰ</strong> (<code>LC_ALL=C.UTF-8 gawk</code> cho 4). Một script đệm cột bằng <code>printf "%-20s"</code> sẽ làm lệch hàng những cái tên có dấu trên hai máy đầu. Hãy dùng awk POSIX cho mọi thứ đem lên máy chủ, hoặc cài và gọi thẳng <code>gawk</code> bằng tên.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> trưởng nhóm muốn một bản báo cáo buổi sáng từ access log của nginx: tổng lưu lượng, máy khách nào tốn băng thông nhất, đường dẫn nào hỏng, có bao nhiêu phản hồi lớn — và danh sách các endpoint đã bị gọi. Mỗi câu trả lời một dòng awk, chạy trong <code>~/thu-linux/ch3/log</code>.</p><ol>
<li>Số yêu cầu và tổng số byte: <code>awk '{n++; b+=\$10} END {print n, b}' access.log</code>.</li>
<li>Số byte theo từng IP máy khách, lớn nhất trước (một mảng có khoá là <code>\$1</code>, rồi <code>sort -k2,2nr</code>).</li>
<li>Yêu cầu hỏng (mã từ 400 trở lên) đếm theo đường dẫn: <code>awk '\$9 &gt;= 400 {c[\$7]++} END {for (p in c) print c[p], p}' access.log | sort -k2</code>.</li>
<li>Đưa ngưỡng vào từ shell thay vì viết cứng: <code>min=5000; awk -v min="\$min" '\$10 &gt;= min' access.log | wc -l</code>.</li>
<li>Các endpoint theo thứ tự lần đầu bị gọi, không trùng: <code>awk '!seen[\$7]++ {print \$7}' access.log</code>.</li></ol>
<p><strong>Đạt khi:</strong> bước 1 in <code>10 21917</code>; bước 2 đặt <code>203.0.113.45</code> lên đầu với <code>11301</code>; bước 3 in ba dòng, mỗi dòng cho <code>/api/v1/auth/me</code>, <code>/api/v1/orders</code> và <code>/favicon.ico</code>; bước 4 in <code>4</code>; bước 5 in bốn đường dẫn, bắt đầu bằng <code>/api/v1/posts</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Record · field (bản ghi · trường)</span><span class="v">Một dòng đầu vào · một cột của nó: <code>\$1</code>, <code>\$2</code> … <code>\$NF</code>; <code>\$0</code> là cả bản ghi.</span></div>
  <div class="kv"><span class="k">Pattern { action } (mẫu { hành động })</span><span class="v">Luật của awk: với mỗi dòng mà mẫu đúng, chạy hành động (mặc định là in).</span></div>
  <div class="kv"><span class="k">NR · NF · FNR</span><span class="v">Số dòng tổng · số trường trên dòng này · số dòng trong file hiện tại.</span></div>
  <div class="kv"><span class="k">FS · OFS (dấu phân cách vào · ra)</span><span class="v">Dấu phân cách trường đầu vào (<code>-F</code>) · dấu dùng khi awk dựng lại dòng.</span></div>
  <div class="kv"><span class="k">BEGIN · END</span><span class="v">Khối chạy một lần trước dòng đầu · một lần sau dòng cuối.</span></div>
  <div class="kv"><span class="k">Associative array (mảng liên kết)</span><span class="v">Mảng đánh chỉ số bằng chuỗi (<code>count[\$1]++</code>): nhóm dữ liệu mà không cần sắp xếp.</span></div>
  <div class="kv"><span class="k">mawk · gawk · BSD awk</span><span class="v">Ba bản cài đặt: mặc định của Ubuntu · của GNU, có phần mở rộng · của Mac.</span></div>
  <div class="kv"><span class="k">-v (đưa biến vào)</span><span class="v">Cờ đưa một giá trị của shell vào awk thành biến, một cách an toàn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>awk cắt mọi dòng thành <code>\$1…\$NF</code> và chạy các luật <code>mẫu { hành động }</code> trên nó.</li>
<li><code>NR</code>, <code>NF</code> và <code>-F</code> cộng với <code>END</code> có biến đếm phủ phần lớn các dòng lệnh: đếm, cộng, trung bình.</li>
<li>Mảng liên kết nhóm và cộng dồn trong một lượt đọc; <code>!seen[\$0]++</code> bỏ trùng mà giữ thứ tự.</li>
<li><code>length</code>, <code>substr</code>, <code>split</code>, <code>index</code>, <code>sub</code>/<code>gsub</code> và <code>printf</code> lo phần lớn việc sửa chữ.</li>
<li>Bọc chương trình trong nháy đơn và đưa giá trị shell vào bằng <code>-v</code>; nháy kép âm thầm đổi thứ awk in ra.</li>
<li>awk của Ubuntu là mawk, của Fedora là gawk, của Mac là BSD awk: viết awk POSIX trừ khi bạn gọi thẳng <code>gawk</code>.</li>
</ul>

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
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: cộng dồn một file log bằng awk</span><span class="lc-sub">Bài chấm điểm về trường, <code>NR</code>/<code>NF</code>, mảng liên kết và khối <code>END</code>, trên một access log nginx thật.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> dấu nháy. Chương trình awk PHẢI nằm trong nháy <strong>ĐƠN</strong>, vì <code>\$1</code> nghĩa là "trường 1" với awk và là "biến shell số 1" với bash. Viết <code>awk "{print \$1}"</code> trong nháy kép thì shell thay thế trước, nên awk không bao giờ thấy <code>\$1</code>. Ở dấu nhắc tương tác, <code>\$1</code> rỗng, awk nhận được <code>{print }</code>, mà một lệnh <code>print</code> trơn thì in <strong>CẢ DÒNG</strong> — lệnh âm thầm hành xử như <code>cat</code>. Bên trong một script chạy bằng <code>./report.sh deploy</code>, awk nhận được <code>{print deploy}</code> — một biến awk chưa gán — và in ra những dòng trống. Cả hai đều đã kiểm trên Ubuntu 24.04; không trường hợp nào báo lỗi. Muốn truyền một biến shell vào cho đúng, hãy dùng <code>-v</code>: <code>awk -v nguong="\$limit" '\$3 &gt; nguong' file</code>. Đừng bao giờ dựng một chương trình awk bằng cách nối chuỗi.</div>
<p class="note-ct"><strong>Học theo thứ tự này thì trong một tiếng bạn có 95% giá trị:</strong> <code>{print \$1}</code>, rồi <code>-F</code>, rồi <code>NR</code>/<code>NF</code>, rồi <code>END {}</code> với một biến đếm, rồi mảng liên kết. Mọi thứ sau đó là tinh chỉnh. Và khi một chuỗi bốn công cụ nhỏ bắt đầu cần tới cái thứ năm, đó thường là khoảnh khắc awk thay được cả năm.</p>
</div>
`,
    },
    /* ─────────────────────────── 3.7 Quiz ─────────────────────────── */
    {
      title: '3.7 — Chapter 3 quiz|||3.7 — Kiểm tra Chương 3',
      slug: 'lnx-3-7-quiz',
      type: 'QUIZ',
      description: 'Mười câu tình huống: thứ tự 2>&1, sudo và >>, PIPESTATUS của curl | jq | wc, vòng while trong zsh và bash, grep BSD trên Mac, mã thoát 2 của grep, sort -k2, comm -23, sed -i chạy cả Linux lẫn Mac, và awk trong nháy kép.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten questions, almost all of them "what does this print?" or "which line fixes it?" — reading a pipeline and predicting its output is the skill this chapter builds. Every expected output was run for real on Ubuntu 24.04, and on a Mac (macOS 27) where the question says so.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can say where fd 0, 1 and 2 point after <code>cmd &gt; f 2&gt;&amp;1</code> and after <code>cmd 2&gt;&amp;1 &gt; f</code>, and why they differ.</li>
<li>I can explain why a pipeline "succeeds" when its first stage failed, and use <code>pipefail</code> and <code>PIPESTATUS</code> to catch it.</li>
<li>I can write a grep pattern with <code>-E</code> that behaves the same on the VPS and on a Mac, and read grep's exit code.</li>
<li>I can count by group with <code>sort | uniq -c | sort -rn</code>, compare two lists with <code>comm</code>, and read a <code>diff -u</code>.</li>
<li>I can dry-run a sed substitution with <code>-n …p</code> and apply it with a backup that works on both GNU and BSD sed.</li>
<li>I can pull fields, totals and per-key counts out of a log with awk, passing shell values in with <code>-v</code>.</li>
</ul>
${slide('lx-03', 30, 'Bảng tra nhanh Chương 3 (1/2): chuyển hướng, ống dẫn, grep')}
${slide('lx-03', 31, 'Bảng tra nhanh Chương 3 (2/2): công cụ nhỏ, sed, awk')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười câu, gần như câu nào cũng là "lệnh này in ra gì?" hoặc "dòng nào sửa được lỗi?" — đọc một chuỗi ống và đoán trước output của nó chính là kỹ năng mà chương này rèn. Mọi output trong đáp án đã được chạy thật trên Ubuntu 24.04, và trên Mac (macOS 27) khi câu hỏi nói vậy.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi nói được fd 0, 1, 2 trỏ đi đâu sau <code>cmd &gt; f 2&gt;&amp;1</code> và sau <code>cmd 2&gt;&amp;1 &gt; f</code>, và vì sao hai cái khác nhau.</li>
<li>Tôi giải thích được vì sao một chuỗi ống "thành công" dù khâu đầu đã hỏng, và dùng <code>pipefail</code>, <code>PIPESTATUS</code> để bắt nó.</li>
<li>Tôi viết được một mẫu grep với <code>-E</code> hành xử như nhau trên VPS lẫn trên Mac, và đọc được mã thoát của grep.</li>
<li>Tôi đếm theo nhóm được bằng <code>sort | uniq -c | sort -rn</code>, so hai danh sách bằng <code>comm</code>, và đọc được một <code>diff -u</code>.</li>
<li>Tôi chạy thử được một phép thay của sed bằng <code>-n …p</code> và áp dụng nó kèm bản sao lưu chạy được cả trên GNU lẫn BSD sed.</li>
<li>Tôi rút được trường, tổng và số đếm theo khoá từ một file log bằng awk, và đưa giá trị shell vào bằng <code>-v</code>.</li>
</ul>
${slide('lx-03', 30, 'Bảng tra nhanh Chương 3 (1/2): chuyển hướng, ống dẫn, grep')}
${slide('lx-03', 31, 'Bảng tra nhanh Chương 3 (2/2): công cụ nhỏ, sed, awk')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'build.sh prints "compile ok" and "build done" on stdout and one warning on stderr. CI runs: ./build.sh 2>&1 > build.log. What ends up in build.log?|||build.sh in "compile ok" và "build done" ra stdout và một dòng cảnh báo ra stderr. CI chạy: ./build.sh 2>&1 > build.log. Trong build.log có gì?',
            options: [
              'All three lines: 2>&1 merged the streams|||Cả ba dòng: 2>&1 đã gộp hai dòng lại',
              'Only "compile ok" and "build done"; the warning was printed on the terminal|||Chỉ "compile ok" và "build done"; dòng cảnh báo in ra terminal',
              'Only the warning, because 2>&1 comes first|||Chỉ dòng cảnh báo, vì 2>&1 đứng trước',
              'Nothing: > truncated the file after the command wrote to it|||Không gì cả: > đã cắt trắng file sau khi lệnh ghi vào',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Redirections are applied left to right before the command starts. 2>&1 first copies where fd 1 points AT THAT MOMENT — the terminal — and only then > moves fd 1 to build.log. So stdout goes to the file and stderr stays on the terminal (checked: build.log had 2 lines). "All three lines" is what > build.log 2>&1 or &> build.log would give; the order is the whole difference.|||VI: Các phép chuyển hướng được áp từ trái sang phải trước khi lệnh chạy. 2>&1 chép chỗ fd 1 đang trỏ NGAY LÚC ĐÓ — là terminal — rồi mới tới > dời fd 1 sang build.log. Nên stdout vào file còn stderr ở lại terminal (đã kiểm: build.log có 2 dòng). "Cả ba dòng" là kết quả của > build.log 2>&1 hoặc &> build.log; thứ tự chính là toàn bộ khác biệt.',
          },
          {
            question: 'As user an (who has sudo), you run: sudo echo "10.0.0.5 db" >> /etc/hosts. What happens?|||Với người dùng an (có sudo), bạn chạy: sudo echo "10.0.0.5 db" >> /etc/hosts. Chuyện gì xảy ra?',
            options: [
              'bash: /etc/hosts: Permission denied — nothing is appended|||bash: /etc/hosts: Permission denied — không có gì được thêm vào',
              'The line is appended, because sudo runs the whole command line as root|||Dòng được thêm vào, vì sudo chạy cả dòng lệnh với quyền root',
              'sudo asks for the root password, then appends the line|||sudo hỏi mật khẩu root rồi thêm dòng',
              'The line is printed on the screen and /etc/hosts is left empty|||Dòng được in ra màn hình còn /etc/hosts bị làm rỗng',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: The >> is performed by YOUR shell, running as an, before sudo even starts — and an cannot write /etc/hosts. sudo only elevates echo, which does not need it. Real output on Ubuntu 24.04: "bash: /etc/hosts: Permission denied". The fix is echo "10.0.0.5 db" | sudo tee -a /etc/hosts, where tee — a program sudo can elevate — does the writing. "sudo runs the whole line" is the tempting but wrong mental model.|||VI: Dấu >> do shell CỦA BẠN thực hiện, chạy với quyền an, trước cả khi sudo khởi động — và an không ghi được /etc/hosts. sudo chỉ nâng quyền cho echo, thứ vốn chẳng cần. Output thật trên Ubuntu 24.04: "bash: /etc/hosts: Permission denied". Cách sửa là echo "10.0.0.5 db" | sudo tee -a /etc/hosts, nơi tee — một chương trình mà sudo nâng quyền được — tự đi ghi file. "sudo chạy cả dòng" là mô hình hấp dẫn nhưng sai.',
          },
          {
            question: 'You run: curl -s bad-url | jq . | wc -l, and then echo "${PIPESTATUS[@]}". What does the echo print?|||Bạn chạy: curl -s bad-url | jq . | wc -l, rồi echo "${PIPESTATUS[@]}". Lệnh echo in ra gì?',
            options: [
              '0 0 0',
              '6 2 0',
              '6 0 0',
              '6',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: PIPESTATUS holds one exit code per stage. curl exits 6 (could not resolve host "bad-url"); jq, given empty input, exits 0 — an empty stream is not an error to it; wc -l prints 0 and exits 0. Real output: 6 0 0. "6 2 0" looks plausible (it is what an older version of this lesson claimed) but jq never sees bad JSON, only nothing. Plain $? would have said 0.|||VI: PIPESTATUS giữ mỗi khâu một mã thoát. curl thoát 6 (không phân giải được tên máy "bad-url"); jq nhận đầu vào rỗng thì thoát 0 — với nó dòng rỗng không phải lỗi; wc -l in 0 và thoát 0. Output thật: 6 0 0. "6 2 0" trông hợp lý (bản cũ của bài này từng ghi vậy) nhưng jq chưa hề thấy JSON hỏng, chỉ thấy không có gì. Còn $? trơn thì sẽ báo 0.',
          },
          {
            question: 'n=0; printf "a\\nb\\n" | while read l; do n=$((n+1)); done; echo $n — prints 2 in your Mac terminal but 0 inside a bash script on the VPS. Why?|||n=0; printf "a\\nb\\n" | while read l; do n=$((n+1)); done; echo $n — in 2 trong terminal Mac của bạn nhưng in 0 trong một script bash trên VPS. Vì sao?',
            options: [
              'Your Mac terminal runs zsh, which runs the last pipeline stage in the current shell; bash runs it in a subshell whose n is thrown away|||Terminal Mac chạy zsh, vốn chạy khâu cuối của ống trong shell hiện tại; bash chạy nó trong shell con và biến n của shell con bị vứt đi',
              'bash on the VPS does not support $(( )) arithmetic inside loops|||bash trên VPS không hỗ trợ phép tính $(( )) bên trong vòng lặp',
              'printf on Linux does not interpret \\n, so read gets no lines|||printf trên Linux không hiểu \\n, nên read không nhận được dòng nào',
              'read without -r fails on Linux|||read thiếu -r thì hỏng trên Linux',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Measured on macOS 27: zsh printed 2, /bin/bash 3.2 printed 0, and bash 5 on Ubuntu printed 0. In bash every stage of a pipeline — including the while loop — runs in a forked subshell, so the incremented n dies with it. zsh keeps the last stage in the current shell. The other options describe features that work fine. Fix for bash: done < file or done < <(cmd).|||VI: Đo trên macOS 27: zsh in 2, /bin/bash 3.2 in 0, và bash 5 trên Ubuntu in 0. Trong bash, mọi khâu của chuỗi ống — kể cả vòng while — chạy trong một shell con được rẽ nhánh ra, nên biến n vừa tăng chết theo nó. zsh giữ khâu cuối trong shell hiện tại. Các phương án kia mô tả những tính năng vẫn chạy bình thường. Cách sửa cho bash: done < file hoặc done < <(lệnh).',
          },
          {
            question: 'On a Mac, list.txt contains x/a.pdf, x/b.pdf and x/keep.txt. You run /usr/bin/grep -v "/a.pdf$\\|/b.pdf$" list.txt. What is printed?|||Trên Mac, list.txt chứa x/a.pdf, x/b.pdf và x/keep.txt. Bạn chạy /usr/bin/grep -v "/a.pdf$\\|/b.pdf$" list.txt. Cái gì được in ra?',
            options: [
              'x/keep.txt',
              'grep: invalid option -- v',
              'x/a.pdf, x/b.pdf and x/keep.txt — BSD grep does not know \\|',
              'x/a.pdf and x/keep.txt',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Run on macOS 27: it prints x/a.pdf and x/keep.txt. BSD grep (2.6.0-FreeBSD) does understand \\| here, but in a basic regex $ is an anchor only at the very end of the pattern — the $ before \\| is a literal dollar sign, so only the last alternative can match and only x/b.pdf is removed. GNU grep on Ubuntu treats both $ as anchors and prints just x/keep.txt, which is why "x/keep.txt" is the tempting answer. Portable fix: grep -vE "/a.pdf$|/b.pdf$".|||VI: Chạy trên macOS 27: nó in x/a.pdf và x/keep.txt. BSD grep (2.6.0-FreeBSD) có hiểu \\| ở đây, nhưng trong regex cơ bản, $ chỉ là neo khi đứng ở TẬN CÙNG mẫu — dấu $ đứng trước \\| là một ký tự đô-la thường, nên chỉ nhánh cuối có thể khớp và chỉ x/b.pdf bị loại. GNU grep trên Ubuntu coi cả hai $ là neo và chỉ in x/keep.txt, nên "x/keep.txt" là đáp án hấp dẫn. Cách viết chạy mọi nơi: grep -vE "/a.pdf$|/b.pdf$".',
          },
          {
            question: 'A health-check script does: grep -q FATAL /var/log/app.log; echo $? — but the log file was rotated away and does not exist. What is echoed?|||Một script kiểm tra sức khoẻ chạy: grep -q FATAL /var/log/app.log; echo $? — nhưng file log đã bị xoay vòng đi và không còn tồn tại. Lệnh echo in gì?',
            options: [
              '0',
              '1',
              '2',
              '127',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: grep has three exit codes: 0 = a line matched, 1 = no line matched, 2 = an error such as an unreadable or missing file (real: "grep: missing.txt: No such file or directory" then 2). Treating "not 0" as "no FATAL found" would report a missing log as healthy — that is why 1 is the dangerous wrong answer. 127 would mean grep itself was not found.|||VI: grep có ba mã thoát: 0 = có dòng khớp, 1 = không dòng nào khớp, 2 = lỗi như file không đọc được hay không tồn tại (thật: "grep: missing.txt: No such file or directory" rồi 2). Coi "khác 0" là "không có FATAL" sẽ báo một file log bị mất thành khoẻ mạnh — nên 1 là đáp án sai nguy hiểm. 127 nghĩa là không tìm thấy chính lệnh grep.',
          },
          {
            question: 'What does printf "an 30\\nbinh 9\\nchi 120\\n" | sort -k2 | head -1 print?|||printf "an 30\\nbinh 9\\nchi 120\\n" | sort -k2 | head -1 in ra gì?',
            options: [
              'binh 9',
              'an 30',
              'sort: invalid key specification',
              'chi 120',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: -k2 selects field 2 (to the end of the line) but still compares it as TEXT: "120" < "30" < "9" because "1" sorts before "3" and "9". Real output: chi 120. "binh 9" is what you get with -k2,2n — the numeric flag is the missing piece. -k2 is a valid key, so there is no error.|||VI: -k2 chọn trường 2 (tới hết dòng) nhưng vẫn so sánh như CHỮ: "120" < "30" < "9" vì "1" đứng trước "3" và "9". Output thật: chi 120. "binh 9" là kết quả của -k2,2n — cờ so theo số là mảnh còn thiếu. -k2 là khoá hợp lệ nên không có lỗi.',
          },
          {
            question: 'can.txt lists curl, git, jq, nginx, postgresql; da-cai.txt lists git, nginx, curl, htop. What does comm -23 <(sort can.txt) <(sort da-cai.txt) print?|||can.txt liệt kê curl, git, jq, nginx, postgresql; da-cai.txt liệt kê git, nginx, curl, htop. comm -23 <(sort can.txt) <(sort da-cai.txt) in ra gì?',
            options: [
              'htop',
              'jq and postgresql|||jq và postgresql',
              'curl, git and nginx|||curl, git và nginx',
              'jq, htop and postgresql|||jq, htop và postgresql',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: comm prints three columns — only in file 1, only in file 2, in both — and the digits HIDE columns. -23 hides "only in file 2" and "in both", leaving what can.txt has and da-cai.txt lacks: jq and postgresql (real output). "htop" is -13, "curl, git, nginx" is -12. Both inputs must be sorted, hence <(sort …).|||VI: comm in ba cột — chỉ có ở file 1, chỉ có ở file 2, có ở cả hai — và các chữ số dùng để GIẤU cột. -23 giấu "chỉ ở file 2" và "ở cả hai", để lại thứ can.txt có mà da-cai.txt thiếu: jq và postgresql (output thật). "htop" là -13, "curl, git, nginx" là -12. Hai đầu vào phải được sắp xếp, nên mới có <(sort …).',
          },
          {
            question: 'Your team’s deploy script must change yes to no in m.conf, keep a backup, and run unchanged on the Ubuntu VPS AND on teammates’ Macs. Which line?|||Script deploy của nhóm phải đổi yes thành no trong m.conf, giữ bản sao lưu, và chạy nguyên xi trên VPS Ubuntu LẪN trên máy Mac của các bạn. Dòng nào?',
            options: [
              'sed -i.bak "s/yes/no/" m.conf',
              'sed -i "s/yes/no/" m.conf',
              'sed -i "" "s/yes/no/" m.conf',
              'sed --in-place=.bak "s/yes/no/" m.conf',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: With the suffix glued to -i, both GNU sed and BSD sed accept it and leave m.conf.bak (checked on both). Bare -i works on Linux but on the Mac swallows the expression as the suffix ("invalid command code"); -i "" is the Mac form, and GNU then reads "" as the script and fails with "can’t read s/yes/no/"; long options like --in-place do not exist in BSD sed ("illegal option -- -").|||VI: Hậu tố viết dính vào -i thì cả GNU sed lẫn BSD sed đều nhận và để lại m.conf.bak (đã kiểm cả hai). -i trơn chạy trên Linux nhưng trên Mac nuốt mất biểu thức làm hậu tố ("invalid command code"); -i "" là dạng của Mac, còn GNU lại coi "" là script và báo "can’t read s/yes/no/"; cờ dài như --in-place không tồn tại trong BSD sed ("illegal option -- -").',
          },
          {
            question: 'At an interactive bash prompt you type: awk "{print $1}" access.log | head -1 (the first line is an nginx log line starting with 203.0.113.45). What is printed?|||Ở dấu nhắc bash tương tác, bạn gõ: awk "{print $1}" access.log | head -1 (dòng đầu là một dòng log nginx bắt đầu bằng 203.0.113.45). Cái gì được in ra?',
            options: [
              '203.0.113.45',
              'The whole first log line|||Nguyên cả dòng log đầu tiên',
              'An empty line|||Một dòng trống',
              'awk: syntax error',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Inside double quotes bash expands $1 first. At a prompt $1 is empty, so awk receives {print } — and a bare print prints the whole record (checked on Ubuntu 24.04). "203.0.113.45" is what single quotes give. An empty line happens in a script started with an argument (e.g. ./report.sh deploy): awk then receives {print deploy}, an unset variable. Single-quote awk programs; pass shell values with -v.|||VI: Trong nháy kép, bash khai triển $1 trước. Ở dấu nhắc, $1 rỗng, nên awk nhận {print } — mà print trơn thì in cả bản ghi (đã kiểm trên Ubuntu 24.04). "203.0.113.45" là kết quả của nháy đơn. Dòng trống xảy ra trong một script chạy kèm tham số (ví dụ ./report.sh deploy): khi đó awk nhận {print deploy}, một biến chưa gán. Hãy bọc chương trình awk trong nháy đơn; đưa giá trị shell vào bằng -v.',
          },
        ],
      },
    },
  ],
};
