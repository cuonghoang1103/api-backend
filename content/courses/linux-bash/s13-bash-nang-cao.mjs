/**
 * Linux & Bash — Chương 13 (MỚI, 28/09/2026): Bash nâng cao — cấu trúc dữ liệu, luồng & tốc độ.
 * 13.0 slide (deck lx-13, 31 slide) · 13.1 mảng chỉ số & mảng kết hợp · 13.2 file descriptor, process substitution,
 * heredoc, fifo, coproc · 13.3 chạy song song & tốc độ (fork, awk một lần, xargs -P, wait -n, GNU parallel, hyperfine)
 * · 13.4 script mức chuyên gia (getopts cờ dài, stack trace, log có mức, bats-core, shellcheck/shfmt, khi nào sang
 * Python) · 13.5 quiz 10 câu.
 * Nối tiếp Chương 6 (mảng cơ bản, "${a[@]}", mapfile -t, khai triển) và Chương 7 (khung script, getopts, trap, flock,
 * mktemp, bats cơ bản) — không dạy lại, chỉ trỏ ngược.
 * MỌI lệnh và output MỚI chạy thật: container ubuntu:24.04 (bash 5.2.21, arm64, 10 CPU ảo, người dùng an,
 * ~/thu-linux; shellcheck 0.9.0, shfmt 3.8.0, bats 1.10.0, GNU parallel 20231122, hyperfine 1.18.0), Mac M1 macOS 27
 * (/bin/bash 3.2.57, BSD xargs) và Fedora 44 (bash 5.3.9). Số đo tốc độ = hyperfine hoặc $EPOCHREALTIME.
 * Mốc phiên bản bash: tệp NEWS chính thức (tiswww.case.edu/php/chet/bash/NEWS).
 * File này SINH từ nguồn thô bằng generator (thoát ký tự tự động). LUẬT vẫn như mọi chương: backtick → &#96;;
 * ${ → \${; < > & trong code → &lt; &gt; &amp;; gạch chéo ngược viết đôi.
 */

import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Flinux-bash%2Flearn&reflabel=Linux%20%26%20Bash';

export default {
  title: "Chapter 13 — Advanced Bash: data structures, streams & speed|||Chương 13 — Bash nâng cao: cấu trúc dữ liệu, luồng & tốc độ",
  description: "Mảng và mảng kết hợp, file descriptor và process substitution, chạy song song và đo tốc độ thật, và những lớp cuối cùng biến một script thành công cụ chuyên nghiệp: cờ dài, stack trace, kiểm thử bằng bats, lint và format — kèm câu trả lời thật thà cho câu hỏi “khi nào thôi dùng bash”.",
  lessons: [
    /* ─────────────────────────── 13.0 ─────────────────────────── */
    {
      title: "13.0 — Chapter 13 slides: advanced Bash in pictures|||13.0 — Slide Chương 13: Bash nâng cao bằng hình",
      slug: "lnx-13-0-slides",
      type: "DOCUMENT",
      isFreePreview: true,
      description: "Bộ 31 slide của Chương 13: mảng thưa và mảng kết hợp, cái bẫy quên declare -A, đếm IP đo bằng hyperfine, bảng fd và phép đổi chỗ stdout/stderr, process substitution, heredoc, fifo và coproc, giá của một lần fork đo trên 10.000 vòng, xargs -P và hàng đợi wait -n, stack trace, bats-core, shellcheck/shfmt, và những gì vỡ trên bash 3.2 của Mac.",
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Slides</span>
<h2>The whole chapter in 31 slides</h2>
<p class="lead">This chapter is where bash stops being "a list of commands" and starts behaving like a small programming language: dictionaries, extra channels between processes, work spread over every CPU core, and scripts that test themselves. Skim the slides first to see where it goes, then return after the quiz as a revision sheet. Every script is syntax-coloured like VS Code with a note on each line, every terminal is real output, and every speed claim is a measurement — with the machine it was measured on.</p>
<p>Slides 3–8 belong to Lesson 13.1 (sparse arrays, <code>declare -A</code> and the silent trap of forgetting it, counting IPs three ways, <code>mapfile</code>, namerefs and variable attributes), 9–14 to 13.2 (the file-descriptor table, swapping stdout and stderr, process substitution, here-docs, FIFOs and <code>coproc</code>, reading arbitrary filenames), 15–20 to 13.3 (what one fork costs, one <code>awk</code> instead of twenty thousand, <code>xargs -P</code>, a <code>wait -n</code> job queue, GNU <code>parallel</code>, <code>time</code> and <code>hyperfine</code>) and 21–26 to 13.4 (the expert layers on top of Chapter 7, long options with <code>getopts</code>, stack traces, <code>bats-core</code>, ShellCheck and <code>shfmt</code>, and when to switch to Python). The last five are what breaks on the Mac's bash 3.2, common mistakes, a two-page cheat sheet and a 45-minute practice session. Recorded on 28/09/2026 in an Ubuntu 24.04 container, on a Mac M1 and on a Fedora 44 machine; the slides are in Vietnamese, the code reads the same in any language.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Slide</span>
<h2>Cả chương trong 31 slide</h2>
<p class="lead">Chương này là chỗ bash thôi là "một danh sách lệnh" và bắt đầu cư xử như một ngôn ngữ lập trình nhỏ: có từ điển (dictionary), có thêm kênh nói chuyện giữa các tiến trình, chia việc ra mọi nhân CPU, và script tự kiểm thử được. Lướt bộ slide trước để thấy chương đi về đâu, rồi quay lại sau bài kiểm tra như một tờ ôn tập. Mọi script đều tô màu kiểu VS Code kèm ghi chú từng dòng, mọi terminal là output THẬT, và mọi con số về tốc độ đều là số ĐO — kèm tên cái máy đã đo.</p>
<p>Slide 3–8 thuộc Bài 13.1 (mảng thưa, <code>declare -A</code> và cái bẫy im lặng khi quên nó, đếm IP bằng ba cách, <code>mapfile</code>, nameref và thuộc tính biến), 9–14 thuộc 13.2 (bảng file descriptor, đổi chỗ stdout và stderr, process substitution, heredoc, fifo và <code>coproc</code>, đọc tên file bất kỳ), 15–20 thuộc 13.3 (một lần fork tốn bao nhiêu, một <code>awk</code> thay hai vạn lần gọi, <code>xargs -P</code>, hàng đợi <code>wait -n</code>, GNU <code>parallel</code>, <code>time</code> và <code>hyperfine</code>), 21–26 thuộc 13.4 (những lớp chuyên gia đặt lên khung của Chương 7, cờ dài với <code>getopts</code>, stack trace, <code>bats-core</code>, ShellCheck và <code>shfmt</code>, khi nào chuyển sang Python). Năm slide cuối là những gì vỡ trên bash 3.2 của Mac, sai lầm hay gặp, bảng tra nhanh hai trang và một buổi thực hành 45 phút. Ghi ngày 28/09/2026 trong container Ubuntu 24.04, trên Mac M1 và trên một máy Fedora 44 — PID, số fd và thời gian đo trên máy bạn sẽ khác, TỈ LỆ giữa các cách viết thì không.</p>
</div>
${gallery('lx-13', [[1, 'Bìa'], [2, 'Bản đồ chương'], [3, 'Mảng thưa sau unset'], [4, 'Mảng kết hợp declare -A'], [5, 'Quên declare -A: dồn vào ô 0'], [6, 'Đếm IP: bash, sort|uniq, awk'], [7, 'mapfile đủ cờ'], [8, 'Nameref và thuộc tính biến'], [9, 'Bảng file descriptor'], [10, 'Đổi chỗ stdout và stderr'], [11, 'Process substitution'], [12, 'Heredoc và here-string'], [13, 'mkfifo và coproc'], [14, 'Đọc tên file an toàn'], [15, 'Giá của một lần fork'], [16, 'Một lần awk thay 20.000 lần'], [17, 'xargs -P và -n1'], [18, 'Hàng đợi wait -n'], [19, 'GNU parallel'], [20, 'time, hyperfine, EPOCHREALTIME'], [21, 'Script chuyên gia: các lớp'], [22, 'getopts cờ dài'], [23, 'Stack trace'], [24, 'bats-core'], [25, 'shellcheck và shfmt'], [26, 'Khi nào sang Python'], [27, 'Mac bash 3.2 thiếu gì'], [28, 'Sai lầm hay gặp'], [29, 'Bảng tra nhanh (1/2)'], [30, 'Bảng tra nhanh (2/2)'], [31, 'Thực hành chương 13']])}
`,
    },
    /* ─────────────────────────── 13.1 ─────────────────────────── */
    {
      title: "13.1 — Indexed and associative arrays, mapfile and namerefs|||13.1 — Mảng chỉ số, mảng kết hợp, mapfile và nameref",
      slug: "lnx-13-1-mang-mang-ket-hop",
      type: "LESSON",
      isFreePreview: true,
      description: "Mảng thưa sau unset, mảng kết hợp declare -A và cái bẫy im lặng khi quên nó, mapfile đủ cờ, truyền mảng vào hàm bằng declare -n, thuộc tính -i/-l/-u/-r/-g — và bài toán đếm IP đo thật: khi nào mảng kết hợp đúng chỗ, khi nào awk nhanh hơn 30 lần.",
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.1</span>
<h2>Indexed arrays, associative arrays, mapfile and namerefs</h2>
<p class="lead">Lesson 6.2 taught the one rule that matters most about arrays — expand them as <code>"\${a[@]}"</code>, quoted, with <code>@</code> — and Lesson 6.5 introduced <code>mapfile -t</code>. This lesson goes the rest of the way: indices that can have holes, arrays keyed by <em>names</em> instead of numbers, passing an array into a function, variable attributes, and — just as important — the point where an array is the wrong tool and a single <code>awk</code> is thirty times faster.</p>

<h3>Why you need this: a real script that outgrew plain variables</h3>
<p>A deploy script usually needs a small table: service → port for the smoke test, service → container name, host → role. Without a dictionary you end up with <code>PORT_WEB=3000</code>, <code>PORT_API=4000</code>, <code>PORT_DB=5432</code> and indirect expansion <code>\${!name}</code> (Lesson 6.3) to look them up — it works, but it cannot list the services, cannot count them and breaks the moment a name contains a dash. An associative array (a dictionary, "mảng kết hợp") is one variable that holds the whole table. Knowing arrays properly is also what lets you <em>read</em> other people's scripts: every serious bash tool — installers, CI helpers, <code>bats</code> itself — is built on them.</p>

<h3>Indexed arrays can be sparse</h3>
${slide('lx-13', 3, 'Mảng có thể THƯA: unset để lại một lỗ')}
<p>An indexed array in bash is not a contiguous list like in C. It is a map from integers to strings, and nothing forces the integers to be consecutive:</p>
<pre><code class="language-bash">a=(web db "cache redis" worker)
echo "số phần tử: \${#a[@]}"
unset 'a[1]'                      <span class="tok-comment"># remove element 1 — the others do NOT move up</span>
echo "sau unset: \${#a[@]} phần tử, chỉ số: \${!a[@]}"
a+=(mail)                         <span class="tok-comment"># appended after the HIGHEST index</span>
echo "chỉ số sau +=: \${!a[@]}"
declare -p a
b=("\${a[@]}")                     <span class="tok-comment"># copying re-numbers from 0</span>
declare -p b
echo "a[-1]=\${a[-1]}  lát a[@]:1:2 = \${a[@]:1:2}"</code></pre>
<div class="out">số phần tử: 4
sau unset: 3 phần tử, chỉ số: 0 2 3
chỉ số sau +=: 0 2 3 4
declare -a a=([0]="web" [2]="cache redis" [3]="worker" [4]="mail")
declare -a b=([0]="web" [1]="cache redis" [2]="worker" [3]="mail")
a[-1]=mail  lát a[@]:1:2 = cache redis worker</div>
<p>Three consequences follow. First, <code>\${#a[@]}</code> is the number of elements, <strong>not</strong> the highest index plus one. Second, a C-style loop <code>for ((i=0; i&lt;\${#a[@]}; i++))</code> on a sparse array prints an empty element for the hole and never reaches the last one. Third, the slice <code>\${a[@]:1:2}</code> counts <em>positions among existing elements</em>, not indices — here it started at index 2 because index 1 no longer exists.</p>
<pre><code class="language-bash">for ((i=0; i&lt;\${#a[@]}; i++)); do echo "i=$i [\${a[i]}]"; done</code></pre>
<div class="out">i=0 [web]
i=1 []
i=2 [cache redis]
i=3 [worker]</div>
<p>"mail" at index 4 is silently skipped. The fix is to loop over what actually exists: <code>for x in "\${a[@]}"</code> for the values, or <code>for i in "\${!a[@]}"</code> when you need the index.</p>
<table>
<tr><th>Syntax</th><th>Meaning</th><th>Measured on the array above</th></tr>
<tr><td><code>\${#a[@]}</code></td><td>number of elements</td><td><code>3</code> after the unset</td></tr>
<tr><td><code>"\${!a[@]}"</code></td><td>the list of indices (or keys)</td><td><code>0 2 3 4</code></td></tr>
<tr><td><code>\${a[-1]}</code></td><td>last element (bash 4.3+)</td><td><code>mail</code></td></tr>
<tr><td><code>"\${a[@]:1:2}"</code></td><td>2 elements starting at position 1</td><td><code>cache redis worker</code></td></tr>
<tr><td><code>a+=(x y)</code></td><td>append after the highest index</td><td>new index 4</td></tr>
<tr><td><code>unset 'a[1]'</code></td><td>delete one element, leave a hole</td><td>indices <code>0 2 3</code></td></tr>
<tr><td><code>a=("\${a[@]}")</code></td><td>re-number from 0 (close the holes)</td><td><code>[0]..[3]</code></td></tr>
<tr><td><code>unset a</code> · <code>a=()</code></td><td>delete the whole array · empty it</td><td><code>\${#a[@]}</code> → 0</td></tr>
</table>
<div class="pitfall co-tieu-de"><strong>Why <code>unset 'a[1]'</code> needs quotes.</strong> Unquoted, <code>a[1]</code> is a glob pattern: "a followed by the character 1". If a file called <code>a1</code> happens to exist in the current directory, bash replaces the word with the filename and runs <code>unset a1</code> — deleting a different variable and leaving the array untouched. Measured: with a file <code>a1</code> present and a variable <code>a1=GIỮ</code>, <code>unset a[1]</code> printed <code>a1=[] a=x y z</code>. ShellCheck warns about this (SC2184).</div>

<h3>Associative arrays: look things up by name</h3>
${slide('lx-13', 4, 'Mảng kết hợp: tra theo TÊN, không theo số')}
<pre><code class="language-bash">declare -A port=([web]=3000 [api]=4000)   <span class="tok-comment"># declare -A is MANDATORY</span>
port[db]=5432
port["redis cache"]=6379                  <span class="tok-comment"># a key with a space: quote it</span>
echo "api -&gt; \${port[api]}"
echo "số khoá: \${#port[@]}"
echo "các khoá: \${!port[@]}"
for k in "\${!port[@]}"; do printf '%-12s %s\\n' "$k" "\${port[$k]}"; done
[[ -v port[db] ]]   &amp;&amp; echo "có khoá db"
[[ -v port[mail] ]] || echo "không có khoá mail"
echo "mail -&gt; [\${port[mail]}]"
unset 'port[web]'
declare -p port</code></pre>
<div class="out">api -&gt; 4000
số khoá: 4
các khoá: db api web redis cache
db           5432
api          4000
web          3000
redis cache  6379
có khoá db
không có khoá mail
mail -&gt; []
declare -A port=([db]="5432" [api]="4000" ["redis cache"]="6379" )</div>
<p>Read the output carefully, because it holds four lessons:</p>
<ul>
<li><strong>Order is not yours.</strong> The keys came out as <code>db api web redis cache</code>, not in the order they were added. It is the order of an internal hash table and can change between bash versions. When order matters, sort the keys: <code>while IFS= read -r k; do …; done &lt; &lt;(printf '%s\\n' "\${!port[@]}" | sort)</code>. Do not write <code>for k in $(printf … | sort)</code> — the unquoted substitution splits "redis cache" into two keys.</li>
<li><strong>Missing and empty look the same</strong> when you just expand: <code>\${port[mail]}</code> is empty either way. <code>[[ -v port[mail] ]]</code> (bash 4.3+) asks the real question: does the key exist?</li>
<li><strong><code>"\${!port[@]}"</code></strong> — the same <code>!</code> that lists indices of an indexed array lists keys here, and it must be quoted for the same reason as in Lesson 6.2.</li>
<li><strong><code>declare -p</code></strong> prints the array in a form bash can read back. <code>declare -p port &gt; port.state</code> and later <code>source port.state</code> restores it — a cheap way to keep state between runs of a cron job.</li>
</ul>
<div class="pitfall">Testing a key with <code>[[ -n \${m[k]} ]]</code> answers a different question — "is the value non-empty?". A key that exists with an empty value looks missing. Measured with <code>declare -A m=([x]="")</code>: <code>[[ -n \${m[x]} ]]</code> said no, <code>[[ -v m[x] ]]</code> said yes. When "present but empty" means something (an optional setting explicitly cleared), only <code>-v</code> tells them apart.</div>
<p>Since bash 5.1 an associative array can also be filled from a flat key/value list: <code>declare -A m; m=(a 1 b 2)</code> gives <code>[a]=1 [b]=2</code>. It is convenient, but it fails on every bash older than 5.1, so prefer the explicit <code>[key]=value</code> form in scripts that travel.</p>

<h3>The silent trap: forgetting declare -A</h3>
${slide('lx-13', 5, 'Quên declare -A: bash im lặng dồn vào ô 0')}
<p>This is the most expensive mistake in the lesson, because nothing tells you about it:</p>
<pre><code class="language-bash">p[web]=3000; p[api]=4000                 <span class="tok-comment"># no declare -A</span>
echo "web=\${p[web]} api=\${p[api]}"
declare -p p</code></pre>
<div class="out">web=4000 api=4000
declare -a p=([0]="4000")</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · You write</span><span class="lz-t">p[web]=3000</span><span class="lz-d">No declare -A anywhere, so p becomes an ordinary indexed array.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Subscript = arithmetic</span><span class="lz-t">web → variable → 0</span><span class="lz-d">An indexed subscript is evaluated as maths; an unset name is worth 0.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Stored</span><span class="lz-t">p[0]=3000</span><span class="lz-d">No error, no warning.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Next key</span><span class="lz-t">p[api]=4000 → p[0]=4000</span><span class="lz-d">Overwrites the same slot; every read also lands on index 0.</span></div>
</div>
<p>Without <code>declare -A</code>, <code>p</code> is an <em>indexed</em> array, and the subscript of an indexed array is an <strong>arithmetic</strong> expression. In arithmetic, <code>web</code> is a variable name; an unset variable evaluates to 0. So <code>p[web]=3000</code> is <code>p[0]=3000</code>, <code>p[api]=4000</code> is <code>p[0]=4000</code>, and every read goes to index 0 as well. No error, no warning, wrong data — the classic "every service has the same port" bug.</p>
<p>A related trap lives in functions. <code>declare</code> inside a function creates a <strong>local</strong> variable, exactly like <code>local</code>. A "load config" function that does <code>declare -A cfg=(…)</code> fills a table that disappears when the function returns. Measured: <code>nap() { declare -A cfg=([port]=80); }; nap; echo "\${cfg[port]}"</code> prints nothing; with <code>declare -gA cfg2=…</code> (<code>-g</code> = global) it prints <code>80</code>.</p>
<div class="callout warn">Put <code>declare -A name</code> at the top of the script for every dictionary, even when you fill it later. If a function must create one, use <code>declare -gA</code>. And if a table suddenly has "one element" or "every value the same", check <code>declare -p name</code> first — <code>declare -a</code> in the output is the whole diagnosis.</div>

<h3>A real problem: counting IPs in an access log</h3>
${slide('lx-13', 6, 'Đếm IP: mảng kết hợp đúng nhưng chậm 30×')}
<p>Which addresses hit the server most? Here is the associative-array answer, run on a generated nginx-style log of 200,000 lines (16 MB, 400 distinct IPs):</p>
<pre><code class="language-bash">#!/usr/bin/env bash
<span class="tok-comment"># demip.sh — đếm IP bằng mảng kết hợp</span>
declare -A dem
while read -r ip _; do          <span class="tok-comment"># only the first field; _ swallows the rest</span>
  (( dem[$ip]++ ))              <span class="tok-comment"># a missing key counts as 0</span>
done &lt; "\${1:-access.log}"
for ip in "\${!dem[@]}"; do printf '%7d %s\\n' "\${dem[$ip]}" "$ip"; done | sort -rn | head -5</code></pre>
<div class="out">  30270 10.0.2.75
  15456 10.0.1.167
  10471 10.0.1.171
   7639 10.0.1.223
   6595 10.0.1.165</div>
<p>Correct. Now the same answer two other ways, and a measurement with <code>hyperfine</code> (Lesson 13.3 explains the tool; 5 runs each, mean):</p>
<pre><code class="language-bash">cut -d' ' -f1 access.log | sort | uniq -c | sort -rn | head -5
awk '{d[$1]++} END {for (k in d) print d[k], k}' access.log | sort -rn | head -5</code></pre>
<table>
<tr><th>Approach</th><th>Mean time</th><th>Relative</th></tr>
<tr><td><code>while read</code> + <code>declare -A</code> (bash)</td><td>1.732 s ± 0.194</td><td>29.9× slower</td></tr>
<tr><td><code>cut | sort | uniq -c</code></td><td>0.109 s ± 0.036</td><td>1.9× slower</td></tr>
<tr><td><code>awk '{d[$1]++}'</code></td><td>0.058 s ± 0.011</td><td>fastest</td></tr>
</table>
<p>All three print the same five lines. The interesting row is the last: <code>awk</code> <em>also</em> uses an associative array — <code>d[$1]++</code> is the same idea — but its loop runs in compiled C, while bash interprets <code>read</code> and <code>(( ))</code> once per line. The lesson is not "associative arrays are slow"; it is that <strong>bash is the wrong place to loop over a big file</strong>. Use a bash dictionary for the script's own state — a service table, "have I seen this host", PID → job name in a job queue (Lesson 13.3) — and hand bulk data to a tool built for it.</p>

<h3>mapfile, all the flags</h3>
${slide('lx-13', 7, 'mapfile: mỗi dòng của file thành một phần tử')}
<p>Lesson 6.5 used <code>mapfile -t lines &lt; file</code>. The builtin (also spelled <code>readarray</code>) has more to offer. With <code>dv.txt</code> containing <code>web</code>, <code>db</code>, <code>cache</code> on three lines:</p>
<pre><code class="language-bash">mapfile -t dv &lt; dv.txt;              declare -p dv
mapfile dv2 &lt; dv.txt;                declare -p dv2      <span class="tok-comment"># no -t</span>
mapfile -t -O "\${#dv[@]}" dv &lt; &lt;(printf 'mail\\n'); declare -p dv
readarray -t -n 2 hai &lt; dv.txt;      declare -p hai
mapfile -t -s 1 bo &lt; dv.txt;         declare -p bo
mapfile -t -C 'printf "đã đọc %s dòng, dòng kế: %s\\n"' -c 2 x &lt; &lt;(seq 5)</code></pre>
<div class="out">declare -a dv=([0]="web" [1]="db" [2]="cache")
declare -a dv2=([0]=$'web\\n' [1]=$'db\\n' [2]=$'cache\\n')
declare -a dv=([0]="web" [1]="db" [2]="cache" [3]="mail")
declare -a hai=([0]="web" [1]="db")
declare -a bo=([0]="db" [1]="cache")
đã đọc 1 dòng, dòng kế: 2
đã đọc 3 dòng, dòng kế: 4</div>
<table>
<tr><th>Flag</th><th>Meaning</th><th>Typical use</th></tr>
<tr><td><code>-t</code></td><td>strip the trailing newline from each element</td><td>almost always — without it every element ends in <code>\\n</code></td></tr>
<tr><td><code>-n N</code></td><td>read at most N lines</td><td>the first N results</td></tr>
<tr><td><code>-s N</code></td><td>skip the first N lines</td><td>the header row of a CSV</td></tr>
<tr><td><code>-O N</code></td><td>start storing at index N (does not clear the array)</td><td>append a second file</td></tr>
<tr><td><code>-d ''</code></td><td>split on NUL instead of newline (bash 4.4+)</td><td>with <code>find -print0</code>: any filename (Lesson 13.2)</td></tr>
<tr><td><code>-C cmd -c N</code></td><td>call <code>cmd index line</code> every N lines</td><td>progress display on a large file</td></tr>
<tr><td><code>-u FD</code></td><td>read from file descriptor FD instead of stdin</td><td>when stdin is busy (Lesson 13.2)</td></tr>
</table>
<p>The callback output shows how <code>-C</code> works: after every Nth line is read, but before it is stored, bash calls the command with two extra arguments — the index that line is about to get and the line itself. With <code>-c 2</code> on <code>seq 5</code> it fired for the 2nd line (index 1, text <code>2</code>) and the 4th (index 3, text <code>4</code>); the <code>printf</code> labels read "1 line stored, next line: 2". Rarely needed, but now you can read it when you meet it.</p>
<div class="callout warn"><code>printf '%s\\n' a b | mapfile -t arr</code> leaves <code>arr</code> <strong>empty</strong> in the script: like every stage of a pipeline, <code>mapfile</code> runs in a subshell and its array dies with it (the same mechanism as the <code>while read</code> counter in Lesson 3.2). Always feed it with a redirection: <code>mapfile -t arr &lt; &lt;(cmd)</code>.</div>

<h3>declare -n: passing an array to a function by name</h3>
${slide('lx-13', 8, 'Nameref và thuộc tính: -n -i -l -r -p')}
<p>Bash functions receive strings, not arrays. <code>f "\${arr[@]}"</code> passes the <em>elements</em> as separate arguments, which works for reading an indexed array but loses the keys of an associative array and cannot modify the caller's array at all. A <strong>nameref</strong> (bash 4.3+) solves both: pass the array's <em>name</em>, and inside the function declare a variable that is another name for it.</p>
<pre><code class="language-bash">them_cong() {            <span class="tok-comment"># $1 = the NAME of the caller's associative array</span>
  local -n bang=$1       <span class="tok-comment"># bang is now an alias for that array</span>
  bang[$2]=$3            <span class="tok-comment"># writes go straight into the caller's array</span>
}
declare -A cong=([web]=3000)
them_cong cong api 4000
them_cong cong db 5432
declare -p cong

tong() { local -n _mang=$1; local s=0 x; for x in "\${_mang[@]}"; do (( s += x )); done; echo "$s"; }
so=(3 5 7)
echo "tổng = $(tong so)"</code></pre>
<div class="out">declare -A cong=([db]="5432" [api]="4000" [web]="3000" )
tổng = 15</div>
<p>The same trick "returns" an array from a function: the caller passes the name of an empty array and the function fills it through the nameref — no global variables, no parsing of printed output.</p>
<p>One sharp edge. If the nameref inside the function has the <em>same name</em> as the caller's variable, bash detects a loop:</p>
<pre><code class="language-bash">f() { local -n mang=$1; echo "\${mang[@]}"; }
mang=(a b)
f mang</code></pre>
<div class="out">a b
a4.sh: line 14: local: warning: mang: circular name reference
a4.sh: line 14: warning: mang: circular name reference</div>
<p>It happened to print the right thing here, surrounded by warnings — in other shapes it silently reads the wrong variable. Give namerefs names no caller would use (<code>_mang</code>, <code>__ref</code>), as <code>tong</code> above does.</p>

<h3>Variable attributes: -i, -l, -u, -r, -g and declare -p</h3>
<p><code>declare</code> can attach an attribute to a variable that changes how every later assignment behaves. Measured:</p>
<pre><code class="language-bash">declare -i n=5
n+=3;     echo "n=$n"        <span class="tok-comment"># -i: += is ADDITION</span>
n="2*10"; echo "n=$n"        <span class="tok-comment"># the right side is evaluated as arithmetic</span>
n="abc";  echo "n=$n"        <span class="tok-comment"># a word becomes a variable name → 0</span>
s=5; s+=3; echo "s=$s"       <span class="tok-comment"># no -i: += is string CONCATENATION</span>
declare -l thuong="HELLO World"; declare -u hoa="xin chao"; echo "$thuong / $hoa"
readonly PI=3
PI=4
echo "vẫn chạy tiếp sau readonly"
cfg() { local -r env=staging; env=prod; echo "không in"; }
cfg; echo "mã=$?"
declare -p n thuong</code></pre>
<div class="out">n=8
n=20
n=0
s=53
hello world / XIN CHAO
a5.sh: line 8: PI: readonly variable
vẫn chạy tiếp sau readonly
a5.sh: line 10: env: readonly variable
declare -i n="0"
declare -l thuong="hello world"</div>
<table>
<tr><th>Attribute</th><th>Effect</th><th>Worth knowing</th></tr>
<tr><td><code>-i</code></td><td>assignments are arithmetic</td><td>a typo like <code>n=abc</code> silently becomes 0 — validate input first (Lesson 7.2)</td></tr>
<tr><td><code>-l</code> / <code>-u</code></td><td>value converted to lower / upper case on every assignment</td><td>for case-insensitive keys; <code>\${x,,}</code> / <code>\${x^^}</code> (Lesson 6.3) do it once</td></tr>
<tr><td><code>-r</code> / <code>readonly</code> / <code>local -r</code></td><td>constant</td><td>assigning to it is an error that <strong>abandons the rest of that command line</strong></td></tr>
<tr><td><code>-g</code></td><td>global even when declared in a function</td><td>needed for <code>declare -A</code> in a loader function</td></tr>
<tr><td><code>-a</code> / <code>-A</code></td><td>indexed / associative array</td><td><code>-A</code> is never optional</td></tr>
<tr><td><code>-n</code></td><td>nameref — another name for a variable</td><td>bash 4.3+</td></tr>
<tr><td><code>-x</code></td><td>export to child processes</td><td>same as <code>export</code> (Lesson 8.1)</td></tr>
<tr><td><code>-p name…</code></td><td>print variables with their attributes</td><td>the fastest debugging tool for arrays</td></tr>
</table>
<p>Look again at the <code>cfg; echo "mã=$?"</code> line: neither "không in" nor "mã=…" was printed. Assigning to a read-only variable is treated as a serious error: bash abandons the <em>whole command line</em> it was executing — the function call and the <code>echo</code> after the <code>;</code> — and carries on with the next line of the script. That is why the next line, <code>declare -p</code>, still ran. It is one more reason to put important steps on lines of their own.</p>

<h3>Run it step by step</h3>
<p>In an <code>ubuntu:24.04</code> container (or WSL), paste these in order and compare with the outputs above:</p>
<ol>
<li><code>a=(web db "cache redis" worker); unset 'a[1]'; declare -p a</code> — see the hole at index 1.</li>
<li><code>for i in "\${!a[@]}"; do echo "$i=\${a[$i]}"; done</code> — the loop that respects holes.</li>
<li><code>q[web]=1; q[api]=2; declare -p q</code> — the forgotten <code>-A</code>: one element at index 0.</li>
<li><code>declare -A m=([web]=3000 [api]=4000); [[ -v m[db] ]] || echo "không có db"; declare -p m</code>.</li>
<li><code>mapfile -t hosts &lt; &lt;(printf '%s\\n' vps linux-nha); echo "\${#hosts[@]}"</code> → <code>2</code>. Then try <code>printf 'x\\n' | mapfile -t h2; echo "\${#h2[@]}"</code> → <code>0</code>.</li>
<li><code>f() { local -n _r=$1; _r+=(moi); }; arr=(cu); f arr; declare -p arr</code> → <code>([0]="cu" [1]="moi")</code>.</li>
</ol>

<h3>On macOS and WSL</h3>
<table>
<tr><th>Thing in this lesson</th><th>Ubuntu / WSL2 (bash 5.2)</th><th>Mac <code>/bin/bash</code> 3.2 (measured)</th></tr>
<tr><td>indexed arrays, <code>unset</code>, <code>\${!a[@]}</code>, <code>+=</code></td><td>work</td><td>work</td></tr>
<tr><td><code>\${a[-1]}</code></td><td><code>mail</code></td><td><code>a: bad array subscript</code></td></tr>
<tr><td><code>declare -A</code></td><td>works</td><td><code>declare: -A: invalid option</code></td></tr>
<tr><td><code>port["redis cache"]=6379</code> after the failed <code>-A</code></td><td>—</td><td><code>redis cache: syntax error in expression</code>, and <code>\${port[api]}</code> prints <code>5432</code> — the wrong value</td></tr>
<tr><td><code>mapfile</code> / <code>readarray</code></td><td>work</td><td><code>command not found</code></td></tr>
<tr><td><code>declare -n</code></td><td>works</td><td><code>declare: -n: invalid option</code></td></tr>
<tr><td><code>declare -i</code>, <code>declare -p</code></td><td>work</td><td>work (output quoted differently: <code>a='([0]="web" …)'</code>)</td></tr>
</table>
<p>The Mac row for <code>port[api]</code> is the dangerous one: after <code>declare -A</code> fails, the script keeps running with an indexed array and returns wrong answers, exactly like the forgotten-<code>-A</code> trap. zsh, the Mac's default interactive shell, does have associative arrays, but with different syntax (<code>typeset -A m; m=(web 3000 api 4000); echo $m[api]</code> → <code>4000</code>) and its indexed arrays start at <strong>1</strong> (<code>a=(x y z); echo $a[1]</code> → <code>x</code>). WSL2 runs a real Ubuntu, so everything behaves as on the VPS. On a Mac, install bash 5 with Homebrew and start scripts with <code>#!/usr/bin/env bash</code>.</p>

<h3>When to use arrays — and when not to</h3>
<ul>
<li><strong>Use</strong> an indexed array for any list that may contain spaces: filenames, command arguments you build up (<code>args+=(--flag "$v")</code>), hosts to visit.</li>
<li><strong>Use</strong> an associative array for the script's own lookup tables and state: service → port, "seen this already", PID → job.</li>
<li><strong>Do not</strong> loop over a large file in bash to fill an array just to count or sum — one <code>awk</code> is 30× faster (measured above).</li>
<li><strong>Do not</strong> try to nest: a value is always a string. If you need an array of arrays or real JSON, use <code>jq</code> or switch to Python (Lesson 13.4).</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> your SWP391 group keeps a <code>services.conf</code> with lines like <code>web=3000</code>. Twice this term two services were given the same port and the second container failed to start. Write a checker in <code>~/thu-linux/ch13</code> (or an <code>ubuntu:24.04</code> container).</p><ol>
<li>Create <code>services.conf</code> with a comment line <code># dịch vụ=cổng</code> and <code>web=3000</code>, <code>api=4000</code>, <code>db=5432</code>, <code>admin=3000</code>, <code>redis=6379</code> — the last line without a trailing newline (<code>printf</code> without <code>\\n</code>).</li>
<li>Write <code>kiem-cong.sh</code>: <code>declare -A cong ai_dung</code>, read the file with <code>while IFS='=' read -r ten so || [[ -n $ten ]]</code>, skip empty and <code>#</code> lines, store <code>cong[$ten]=$so</code>.</li>
<li>Use <code>[[ -v ai_dung[$so] ]]</code> to detect a port already taken; print <code>TRÙNG cổng 3000: web và admin</code> to stderr and remember to exit 1.</li>
<li>Print the table sorted by service name with <code>printf '%-10s %s\\n'</code>, reading the keys through <code>&lt; &lt;(printf '%s\\n' "\${!cong[@]}" | sort)</code>.</li>
<li>Remove <code>declare -A</code> and run again: explain what you see with <code>declare -p cong</code>.</li></ol>
<p><strong>Done when:</strong> the script prints the conflict line, then 5 rows from <code>admin</code> to <code>web</code> in alphabetical order including <code>redis 6379</code> (the line without a newline), and <code>echo $?</code> shows <code>1</code>; after fixing <code>admin=3001</code> it exits <code>0</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Indexed array</span><span class="v">A variable holding many strings, each at an integer index; indices may have holes.</span></div>
  <div class="kv"><span class="k">Associative array</span><span class="v">A dictionary: string keys → string values; must be created with <code>declare -A</code>.</span></div>
  <div class="kv"><span class="k">Sparse array</span><span class="v">An array whose indices are not consecutive, e.g. after <code>unset 'a[1]'</code>.</span></div>
  <div class="kv"><span class="k">Arithmetic context</span><span class="v">Places where bash evaluates maths — <code>(( ))</code>, <code>$(( ))</code>, indexed subscripts; names there are variables, unset = 0.</span></div>
  <div class="kv"><span class="k"><code>mapfile</code> / <code>readarray</code></span><span class="v">Builtin that reads lines (or NUL-separated items) into an array.</span></div>
  <div class="kv"><span class="k">Nameref</span><span class="v">A variable declared with <code>-n</code> that is another name for a different variable.</span></div>
  <div class="kv"><span class="k">Attribute</span><span class="v">A flag set by <code>declare</code> (<code>-i -l -u -r -g -x</code>) that changes how assignments behave.</span></div>
  <div class="kv"><span class="k"><code>declare -p</code></span><span class="v">Prints a variable with its attributes in a form that can be sourced back.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Indexed arrays can be sparse: loop with <code>"\${a[@]}"</code> or <code>"\${!a[@]}"</code>, never <code>0..\${#a[@]}-1</code>; quote <code>unset 'a[i]'</code>.</li>
<li>Associative arrays need <code>declare -A</code> (in a function: <code>-gA</code>); forgetting it silently stores every key at index 0.</li>
<li>Key order is not insertion order — sort <code>"\${!m[@]}"</code> when output order matters; <code>[[ -v m[k] ]]</code> tests existence.</li>
<li><code>mapfile -t</code> (plus <code>-n -s -O -d ''</code>) reads lines into an array; never feed it through a pipe.</li>
<li><code>local -n ref=$1</code> passes arrays into and out of functions by name; give namerefs unique names.</li>
<li>Bash dictionaries are for script state, not bulk data: <code>awk</code> counted 200,000 log lines 30× faster; none of this exists in the Mac's bash 3.2.</li>
</ul>

<a class="link-card" href="https://mywiki.wooledge.org/BashGuide/Arrays" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">BashGuide — Arrays</span><span class="lc-sub">The Greg's Wiki chapter on indexed and associative arrays: creation, expansion, sparse indices and the common mistakes, with runnable examples.</span></span>
</a>
<a class="link-card" href="https://mywiki.wooledge.org/BashFAQ/006" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">BashFAQ 006 — associative arrays and indirection</span><span class="lc-sub">How to use variable variables, associative arrays and namerefs, and why <code>eval</code> is the wrong answer.</span></span>
</a>
<a class="link-card" href="https://www.gnu.org/software/bash/manual/html_node/Arrays.html" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Bash Reference Manual — Arrays</span><span class="lc-sub">The official definition: subscripts as arithmetic, negative indices, <code>declare -A</code>, and what <code>unset</code> does to an element.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Code Lab — Linux &amp; Bash</span><span class="lc-sub">Graded exercises for the course; do the array and loop tasks after this lesson.</span></span>
</a>
<p class="note-ct"><strong>The habit to take away:</strong> whenever a script needs a table, write <code>declare -A</code> first and check it with <code>declare -p</code> — and whenever a script needs to chew through a big file, reach for <code>awk</code> instead of a bash loop.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.1</span>
<h2>Mảng chỉ số, mảng kết hợp, mapfile và nameref</h2>
<p class="lead">Bài 6.2 đã dạy luật quan trọng nhất về mảng — khai triển bằng <code>"\${a[@]}"</code>, có nháy, dùng <code>@</code> — và Bài 6.5 đã giới thiệu <code>mapfile -t</code>. Bài này đi nốt phần còn lại: chỉ số có thể có lỗ, mảng tra theo <em>tên</em> thay vì theo số, đưa một mảng vào hàm, thuộc tính của biến, và — quan trọng không kém — cái điểm mà ở đó mảng là công cụ SAI, còn một lệnh <code>awk</code> nhanh hơn ba mươi lần.</p>

<h3>Vì sao cần: một script thật đã lớn quá biến thường</h3>
<p>Script deploy nào cũng sớm cần một bảng nhỏ: dịch vụ → cổng để smoke-test (kiểm tra khói — gọi thử sau khi deploy), dịch vụ → tên container, máy → vai trò. Không có từ điển thì bạn sẽ viết <code>PORT_WEB=3000</code>, <code>PORT_API=4000</code>, <code>PORT_DB=5432</code> rồi dùng khai triển gián tiếp <code>\${!name}</code> (Bài 6.3) để tra — chạy được, nhưng không liệt kê được các dịch vụ, không đếm được, và vỡ ngay khi tên có dấu gạch ngang. Một mảng kết hợp (associative array — từ điển) là MỘT biến chứa cả bảng. Biết mảng cho tử tế cũng là thứ giúp bạn <em>đọc</em> được script của người khác: mọi công cụ bash nghiêm túc — trình cài đặt, script CI, chính <code>bats</code> — đều dựng trên mảng.</p>

<h3>Mảng chỉ số có thể THƯA</h3>
${slide('lx-13', 3, 'Mảng có thể THƯA: unset để lại một lỗ')}
<p>Mảng chỉ số (indexed array) của bash không phải một dãy liền như trong C. Nó là một bảng từ số nguyên sang chuỗi, và không có gì bắt các số nguyên phải liên tiếp:</p>
<pre><code class="language-bash">a=(web db "cache redis" worker)
echo "số phần tử: \${#a[@]}"
unset 'a[1]'                      <span class="tok-comment"># xoá phần tử 1 — các phần tử khác KHÔNG dồn lên</span>
echo "sau unset: \${#a[@]} phần tử, chỉ số: \${!a[@]}"
a+=(mail)                         <span class="tok-comment"># nối vào SAU chỉ số lớn nhất</span>
echo "chỉ số sau +=: \${!a[@]}"
declare -p a
b=("\${a[@]}")                     <span class="tok-comment"># chép lại thì đánh số lại từ 0</span>
declare -p b
echo "a[-1]=\${a[-1]}  lát a[@]:1:2 = \${a[@]:1:2}"</code></pre>
<div class="out">số phần tử: 4
sau unset: 3 phần tử, chỉ số: 0 2 3
chỉ số sau +=: 0 2 3 4
declare -a a=([0]="web" [2]="cache redis" [3]="worker" [4]="mail")
declare -a b=([0]="web" [1]="cache redis" [2]="worker" [3]="mail")
a[-1]=mail  lát a[@]:1:2 = cache redis worker</div>
<p>Từ đó có ba hệ quả. Một: <code>\${#a[@]}</code> là SỐ phần tử, <strong>không phải</strong> chỉ số lớn nhất cộng một. Hai: vòng lặp kiểu C <code>for ((i=0; i&lt;\${#a[@]}; i++))</code> trên mảng thưa sẽ in một phần tử rỗng ở chỗ có lỗ và không bao giờ tới được phần tử cuối. Ba: lát cắt <code>\${a[@]:1:2}</code> đếm theo <em>vị trí giữa những phần tử đang có</em>, không theo chỉ số — ở đây nó bắt đầu từ chỉ số 2 vì chỉ số 1 không còn.</p>
<pre><code class="language-bash">for ((i=0; i&lt;\${#a[@]}; i++)); do echo "i=$i [\${a[i]}]"; done</code></pre>
<div class="out">i=0 [web]
i=1 []
i=2 [cache redis]
i=3 [worker]</div>
<p>"mail" ở chỉ số 4 bị bỏ sót, không một lời báo. Cách sửa là lặp trên những gì ĐANG CÓ: <code>for x in "\${a[@]}"</code> để lấy giá trị, hoặc <code>for i in "\${!a[@]}"</code> khi cần cả chỉ số.</p>
<table>
<tr><th>Cú pháp</th><th>Nghĩa</th><th>Đo trên mảng ở trên</th></tr>
<tr><td><code>\${#a[@]}</code></td><td>số phần tử</td><td><code>3</code> sau khi unset</td></tr>
<tr><td><code>"\${!a[@]}"</code></td><td>danh sách chỉ số (hoặc khoá)</td><td><code>0 2 3 4</code></td></tr>
<tr><td><code>\${a[-1]}</code></td><td>phần tử cuối (bash 4.3+)</td><td><code>mail</code></td></tr>
<tr><td><code>"\${a[@]:1:2}"</code></td><td>2 phần tử bắt đầu từ VỊ TRÍ 1</td><td><code>cache redis worker</code></td></tr>
<tr><td><code>a+=(x y)</code></td><td>nối vào sau chỉ số lớn nhất</td><td>chỉ số mới là 4</td></tr>
<tr><td><code>unset 'a[1]'</code></td><td>xoá một phần tử, để lại lỗ</td><td>chỉ số <code>0 2 3</code></td></tr>
<tr><td><code>a=("\${a[@]}")</code></td><td>đánh số lại từ 0 (lấp lỗ)</td><td><code>[0]..[3]</code></td></tr>
<tr><td><code>unset a</code> · <code>a=()</code></td><td>xoá hẳn mảng · làm rỗng</td><td><code>\${#a[@]}</code> → 0</td></tr>
</table>
<div class="pitfall co-tieu-de"><strong>Vì sao <code>unset 'a[1]'</code> phải có nháy.</strong> Không có nháy, <code>a[1]</code> là một mẫu glob (glob — mẫu tên file): "chữ a rồi tới ký tự 1". Nếu thư mục hiện tại tình cờ có file tên <code>a1</code>, bash thay chữ đó bằng tên file và chạy <code>unset a1</code> — xoá một biến KHÁC, còn mảng thì nguyên. Đo thật: có file <code>a1</code> và biến <code>a1=GIỮ</code>, lệnh <code>unset a[1]</code> in ra <code>a1=[] a=x y z</code>. ShellCheck có cảnh báo cho đúng lỗi này (SC2184).</div>

<h3>Mảng kết hợp: tra theo tên</h3>
${slide('lx-13', 4, 'Mảng kết hợp: tra theo TÊN, không theo số')}
<pre><code class="language-bash">declare -A port=([web]=3000 [api]=4000)   <span class="tok-comment"># declare -A là BẮT BUỘC</span>
port[db]=5432
port["redis cache"]=6379                  <span class="tok-comment"># khoá có dấu cách: bọc nháy</span>
echo "api -&gt; \${port[api]}"
echo "số khoá: \${#port[@]}"
echo "các khoá: \${!port[@]}"
for k in "\${!port[@]}"; do printf '%-12s %s\\n' "$k" "\${port[$k]}"; done
[[ -v port[db] ]]   &amp;&amp; echo "có khoá db"
[[ -v port[mail] ]] || echo "không có khoá mail"
echo "mail -&gt; [\${port[mail]}]"
unset 'port[web]'
declare -p port</code></pre>
<div class="out">api -&gt; 4000
số khoá: 4
các khoá: db api web redis cache
db           5432
api          4000
web          3000
redis cache  6379
có khoá db
không có khoá mail
mail -&gt; []
declare -A port=([db]="5432" [api]="4000" ["redis cache"]="6379" )</div>
<p>Đọc kỹ output, vì nó chứa bốn bài học:</p>
<ul>
<li><strong>Thứ tự không phải của bạn.</strong> Các khoá ra theo thứ tự <code>db api web redis cache</code>, không theo thứ tự đã thêm. Đó là thứ tự của một bảng băm (hash table) bên trong và có thể đổi giữa các phiên bản bash. Khi thứ tự quan trọng, hãy sắp xếp khoá: <code>while IFS= read -r k; do …; done &lt; &lt;(printf '%s\\n' "\${!port[@]}" | sort)</code>. Đừng viết <code>for k in $(printf … | sort)</code> — phép thay thế không nháy sẽ chẻ "redis cache" thành hai khoá.</li>
<li><strong>Không có khoá và giá trị rỗng trông giống hệt nhau</strong> khi chỉ khai triển: <code>\${port[mail]}</code> đằng nào cũng rỗng. <code>[[ -v port[mail] ]]</code> (bash 4.3+) hỏi đúng câu cần hỏi: khoá này CÓ tồn tại không?</li>
<li><strong><code>"\${!port[@]}"</code></strong> — cùng dấu <code>!</code> dùng để liệt kê chỉ số của mảng chỉ số, ở đây liệt kê KHOÁ, và phải có nháy vì cùng lý do như Bài 6.2.</li>
<li><strong><code>declare -p</code></strong> in mảng ra ở dạng mà bash đọc ngược lại được. <code>declare -p port &gt; port.state</code> rồi sau này <code>source port.state</code> là khôi phục lại — một cách rẻ để giữ trạng thái giữa các lần chạy của một việc cron.</li>
</ul>
<div class="pitfall">Kiểm khoá bằng <code>[[ -n \${m[k]} ]]</code> là trả lời một câu hỏi KHÁC — "giá trị có khác rỗng không?". Một khoá có thật mà giá trị rỗng sẽ trông như không tồn tại. Đo với <code>declare -A m=([x]="")</code>: <code>[[ -n \${m[x]} ]]</code> nói không, <code>[[ -v m[x] ]]</code> nói có. Khi "có mà rỗng" mang nghĩa (một thiết lập tuỳ chọn được cố ý xoá trắng), chỉ <code>-v</code> phân biệt được.</div>
<p>Từ bash 5.1 còn nạp được mảng kết hợp từ một danh sách khoá/giá trị phẳng: <code>declare -A m; m=(a 1 b 2)</code> cho <code>[a]=1 [b]=2</code>. Tiện, nhưng hỏng trên mọi bash cũ hơn 5.1, nên với script phải chạy nhiều nơi thì dùng dạng tường minh <code>[khoá]=giá_trị</code>.</p>

<h3>Cái bẫy im lặng: quên declare -A</h3>
${slide('lx-13', 5, 'Quên declare -A: bash im lặng dồn vào ô 0')}
<p>Đây là lỗi đắt nhất của bài, vì không có gì báo cho bạn biết:</p>
<pre><code class="language-bash">p[web]=3000; p[api]=4000                 <span class="tok-comment"># không có declare -A</span>
echo "web=\${p[web]} api=\${p[api]}"
declare -p p</code></pre>
<div class="out">web=4000 api=4000
declare -a p=([0]="4000")</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Bạn viết</span><span class="lz-t">p[web]=3000</span><span class="lz-d">Không có declare -A ở đâu cả, nên p thành một mảng chỉ số bình thường.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Chỉ số = phép tính</span><span class="lz-t">web → tên biến → 0</span><span class="lz-d">Chỉ số của mảng chỉ số được TÍNH như số học; tên chưa đặt bằng 0.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Được cất</span><span class="lz-t">p[0]=3000</span><span class="lz-d">Không lỗi, không cảnh báo.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Khoá kế tiếp</span><span class="lz-t">p[api]=4000 → p[0]=4000</span><span class="lz-d">Ghi đè đúng ô đó; lần đọc nào cũng rơi vào chỉ số 0.</span></div>
</div>
<p>Không có <code>declare -A</code>, <code>p</code> là một mảng CHỈ SỐ, và chỉ số của mảng chỉ số là một biểu thức <strong>số học</strong> (arithmetic context — ngữ cảnh tính toán). Trong phép tính, <code>web</code> là tên một biến; biến chưa đặt thì bằng 0. Vậy <code>p[web]=3000</code> chính là <code>p[0]=3000</code>, <code>p[api]=4000</code> là <code>p[0]=4000</code>, và mọi lần đọc cũng vào ô 0. Không lỗi, không cảnh báo, dữ liệu sai — đúng con bọ kinh điển "dịch vụ nào cũng cùng một cổng".</p>
<p>Một cái bẫy họ hàng nằm trong hàm. <code>declare</code> bên trong hàm tạo biến <strong>cục bộ</strong> (local), y như <code>local</code>. Một hàm "nạp cấu hình" viết <code>declare -A cfg=(…)</code> sẽ điền một cái bảng biến mất ngay khi hàm trả về. Đo thật: <code>nap() { declare -A cfg=([port]=80); }; nap; echo "\${cfg[port]}"</code> không in gì; với <code>declare -gA cfg2=…</code> (<code>-g</code> = global, toàn cục) thì in <code>80</code>.</p>
<div class="callout warn">Viết <code>declare -A tên</code> ở đầu script cho MỌI từ điển, kể cả khi sau này mới điền. Hàm nào phải tạo từ điển thì dùng <code>declare -gA</code>. Và khi một bảng bỗng "chỉ có một phần tử" hay "giá trị nào cũng như nhau", hãy chạy <code>declare -p tên</code> trước tiên — thấy <code>declare -a</code> trong output là chẩn đoán xong.</div>

<h3>Bài toán thật: đếm IP trong access log</h3>
${slide('lx-13', 6, 'Đếm IP: mảng kết hợp đúng nhưng chậm 30×')}
<p>Địa chỉ nào gọi vào máy chủ nhiều nhất? Đây là lời giải bằng mảng kết hợp, chạy trên một log kiểu nginx sinh ra để thử, 200.000 dòng (16 MB, 400 IP khác nhau):</p>
<pre><code class="language-bash">#!/usr/bin/env bash
<span class="tok-comment"># demip.sh — đếm IP bằng mảng kết hợp</span>
declare -A dem
while read -r ip _; do          <span class="tok-comment"># chỉ lấy cột 1; _ nuốt phần còn lại</span>
  (( dem[$ip]++ ))              <span class="tok-comment"># khoá chưa có thì tính là 0</span>
done &lt; "\${1:-access.log}"
for ip in "\${!dem[@]}"; do printf '%7d %s\\n' "\${dem[$ip]}" "$ip"; done | sort -rn | head -5</code></pre>
<div class="out">  30270 10.0.2.75
  15456 10.0.1.167
  10471 10.0.1.171
   7639 10.0.1.223
   6595 10.0.1.165</div>
<p>Đúng. Giờ ra cùng đáp án bằng hai cách khác, rồi đo bằng <code>hyperfine</code> (Bài 13.3 giải thích công cụ này; mỗi cách 5 lượt, lấy trung bình):</p>
<pre><code class="language-bash">cut -d' ' -f1 access.log | sort | uniq -c | sort -rn | head -5
awk '{d[$1]++} END {for (k in d) print d[k], k}' access.log | sort -rn | head -5</code></pre>
<table>
<tr><th>Cách làm</th><th>Thời gian trung bình</th><th>So sánh</th></tr>
<tr><td><code>while read</code> + <code>declare -A</code> (bash)</td><td>1,732 s ± 0,194</td><td>chậm hơn 29,9 lần</td></tr>
<tr><td><code>cut | sort | uniq -c</code></td><td>0,109 s ± 0,036</td><td>chậm hơn 1,9 lần</td></tr>
<tr><td><code>awk '{d[$1]++}'</code></td><td>0,058 s ± 0,011</td><td>nhanh nhất</td></tr>
</table>
<p>Cả ba in cùng năm dòng. Hàng đáng chú ý là hàng cuối: <code>awk</code> <em>cũng</em> dùng mảng kết hợp — <code>d[$1]++</code> là cùng một ý tưởng — nhưng vòng lặp của nó chạy trong mã C đã biên dịch, còn bash phải thông dịch <code>read</code> và <code>(( ))</code> cho từng dòng. Bài học không phải "mảng kết hợp chậm"; mà là <strong>bash là chỗ SAI để lặp qua một file lớn</strong>. Dùng từ điển của bash cho trạng thái của chính script — bảng dịch vụ, "đã gặp máy này chưa", PID → tên việc trong hàng đợi (Bài 13.3) — và giao dữ liệu khối lớn cho công cụ sinh ra để làm việc đó.</p>

<h3>mapfile, đủ các cờ</h3>
${slide('lx-13', 7, 'mapfile: mỗi dòng của file thành một phần tử')}
<p>Bài 6.5 đã dùng <code>mapfile -t lines &lt; file</code>. Lệnh dựng sẵn này (builtin — lệnh nằm trong chính bash; tên khác là <code>readarray</code>) còn nhiều thứ hơn. Với <code>dv.txt</code> chứa <code>web</code>, <code>db</code>, <code>cache</code> trên ba dòng:</p>
<pre><code class="language-bash">mapfile -t dv &lt; dv.txt;              declare -p dv
mapfile dv2 &lt; dv.txt;                declare -p dv2      <span class="tok-comment"># không -t</span>
mapfile -t -O "\${#dv[@]}" dv &lt; &lt;(printf 'mail\\n'); declare -p dv
readarray -t -n 2 hai &lt; dv.txt;      declare -p hai
mapfile -t -s 1 bo &lt; dv.txt;         declare -p bo
mapfile -t -C 'printf "đã đọc %s dòng, dòng kế: %s\\n"' -c 2 x &lt; &lt;(seq 5)</code></pre>
<div class="out">declare -a dv=([0]="web" [1]="db" [2]="cache")
declare -a dv2=([0]=$'web\\n' [1]=$'db\\n' [2]=$'cache\\n')
declare -a dv=([0]="web" [1]="db" [2]="cache" [3]="mail")
declare -a hai=([0]="web" [1]="db")
declare -a bo=([0]="db" [1]="cache")
đã đọc 1 dòng, dòng kế: 2
đã đọc 3 dòng, dòng kế: 4</div>
<table>
<tr><th>Cờ</th><th>Nghĩa</th><th>Dùng khi</th></tr>
<tr><td><code>-t</code></td><td>bỏ ký tự xuống dòng ở cuối mỗi phần tử</td><td>gần như luôn luôn — thiếu nó thì phần tử nào cũng đuôi <code>\\n</code></td></tr>
<tr><td><code>-n N</code></td><td>đọc tối đa N dòng</td><td>lấy N kết quả đầu</td></tr>
<tr><td><code>-s N</code></td><td>bỏ qua N dòng đầu</td><td>dòng tiêu đề của file CSV</td></tr>
<tr><td><code>-O N</code></td><td>bắt đầu ghi từ chỉ số N (không xoá mảng cũ)</td><td>nối thêm file thứ hai</td></tr>
<tr><td><code>-d ''</code></td><td>tách theo ký tự NUL thay vì xuống dòng (bash 4.4+)</td><td>đi với <code>find -print0</code>: tên file bất kỳ (Bài 13.2)</td></tr>
<tr><td><code>-C lệnh -c N</code></td><td>gọi <code>lệnh chỉ_số dòng</code> sau mỗi N dòng</td><td>hiện tiến độ khi đọc file lớn</td></tr>
<tr><td><code>-u FD</code></td><td>đọc từ file descriptor FD thay vì stdin</td><td>khi stdin đang bận việc khác (Bài 13.2)</td></tr>
</table>
<p>Output của hàm gọi lại (callback) cho thấy <code>-C</code> chạy thế nào: cứ mỗi khi đọc xong dòng thứ N, TRƯỚC khi cất nó vào mảng, bash gọi lệnh kèm hai tham số — chỉ số mà dòng đó sắp nhận và chính dòng đó. Với <code>-c 2</code> trên <code>seq 5</code>, nó chạy ở dòng thứ 2 (chỉ số 1, chữ <code>2</code>) và dòng thứ 4 (chỉ số 3, chữ <code>4</code>); nhãn của <code>printf</code> đọc thành "đã cất 1 dòng, dòng kế: 2". Hiếm khi cần, nhưng giờ gặp thì bạn đọc hiểu được.</p>
<div class="callout warn"><code>printf '%s\\n' a b | mapfile -t arr</code> để <code>arr</code> <strong>RỖNG</strong> trong script: như mọi khâu của một ống dẫn, <code>mapfile</code> chạy trong một shell con (subshell) và mảng chết theo nó (đúng cơ chế làm biến đếm của <code>while read</code> mất ở Bài 3.2). Luôn nạp bằng chuyển hướng: <code>mapfile -t arr &lt; &lt;(lệnh)</code>.</div>

<h3>declare -n: đưa một mảng vào hàm bằng TÊN</h3>
${slide('lx-13', 8, 'Nameref và thuộc tính: -n -i -l -r -p')}
<p>Hàm bash nhận CHUỖI, không nhận mảng. <code>f "\${arr[@]}"</code> truyền các <em>phần tử</em> thành từng tham số rời — đủ để đọc một mảng chỉ số, nhưng làm mất khoá của mảng kết hợp và hoàn toàn không sửa được mảng của người gọi. Một <strong>nameref</strong> (name reference — tham chiếu theo tên, bash 4.3+) giải quyết cả hai: truyền <em>tên</em> của mảng, và trong hàm khai báo một biến là tên khác của chính mảng đó.</p>
<pre><code class="language-bash">them_cong() {            <span class="tok-comment"># $1 = TÊN mảng kết hợp của người gọi</span>
  local -n bang=$1       <span class="tok-comment"># từ giờ bang là tên khác của mảng đó</span>
  bang[$2]=$3            <span class="tok-comment"># ghi thẳng vào mảng của người gọi</span>
}
declare -A cong=([web]=3000)
them_cong cong api 4000
them_cong cong db 5432
declare -p cong

tong() { local -n _mang=$1; local s=0 x; for x in "\${_mang[@]}"; do (( s += x )); done; echo "$s"; }
so=(3 5 7)
echo "tổng = $(tong so)"</code></pre>
<div class="out">declare -A cong=([db]="5432" [api]="4000" [web]="3000" )
tổng = 15</div>
<p>Cùng mẹo đó "trả về" được một mảng từ hàm: người gọi truyền tên một mảng rỗng, hàm điền vào qua nameref — không cần biến toàn cục, không phải phân tích output in ra.</p>
<p>Có một cạnh sắc. Nếu nameref trong hàm TRÙNG TÊN với biến của người gọi, bash phát hiện một vòng lặp:</p>
<pre><code class="language-bash">f() { local -n mang=$1; echo "\${mang[@]}"; }
mang=(a b)
f mang</code></pre>
<div class="out">a b
a4.sh: line 14: local: warning: mang: circular name reference
a4.sh: line 14: warning: mang: circular name reference</div>
<p>Lần này tình cờ in đúng, kèm một tràng cảnh báo — ở những dạng khác nó lặng lẽ đọc nhầm biến. Đặt cho nameref những cái tên không người gọi nào dùng (<code>_mang</code>, <code>__ref</code>), như hàm <code>tong</code> ở trên.</p>

<h3>Thuộc tính của biến: -i, -l, -u, -r, -g và declare -p</h3>
<p><code>declare</code> gắn được một thuộc tính (attribute) vào biến, làm đổi cách MỌI lần gán sau đó hoạt động. Đo thật:</p>
<pre><code class="language-bash">declare -i n=5
n+=3;     echo "n=$n"        <span class="tok-comment"># -i: += là phép CỘNG</span>
n="2*10"; echo "n=$n"        <span class="tok-comment"># vế phải được TÍNH như biểu thức số học</span>
n="abc";  echo "n=$n"        <span class="tok-comment"># một chữ thành tên biến → 0</span>
s=5; s+=3; echo "s=$s"       <span class="tok-comment"># không -i: += là NỐI chuỗi</span>
declare -l thuong="HELLO World"; declare -u hoa="xin chao"; echo "$thuong / $hoa"
readonly PI=3
PI=4
echo "vẫn chạy tiếp sau readonly"
cfg() { local -r env=staging; env=prod; echo "không in"; }
cfg; echo "mã=$?"
declare -p n thuong</code></pre>
<div class="out">n=8
n=20
n=0
s=53
hello world / XIN CHAO
a5.sh: line 8: PI: readonly variable
vẫn chạy tiếp sau readonly
a5.sh: line 10: env: readonly variable
declare -i n="0"
declare -l thuong="hello world"</div>
<table>
<tr><th>Thuộc tính</th><th>Tác dụng</th><th>Đáng biết</th></tr>
<tr><td><code>-i</code></td><td>mọi lần gán đều là phép tính</td><td>gõ nhầm kiểu <code>n=abc</code> lặng lẽ thành 0 — kiểm dữ liệu vào trước (Bài 7.2)</td></tr>
<tr><td><code>-l</code> / <code>-u</code></td><td>tự đổi sang chữ thường / HOA mỗi lần gán</td><td>cho khoá không phân biệt hoa thường; <code>\${x,,}</code> / <code>\${x^^}</code> (Bài 6.3) đổi một lần</td></tr>
<tr><td><code>-r</code> / <code>readonly</code> / <code>local -r</code></td><td>hằng số</td><td>gán lại là lỗi, và nó <strong>bỏ ngang cả dòng lệnh đang chạy</strong></td></tr>
<tr><td><code>-g</code></td><td>toàn cục dù khai báo trong hàm</td><td>cần cho <code>declare -A</code> trong hàm nạp cấu hình</td></tr>
<tr><td><code>-a</code> / <code>-A</code></td><td>mảng chỉ số / mảng kết hợp</td><td><code>-A</code> không bao giờ được bỏ</td></tr>
<tr><td><code>-n</code></td><td>nameref — tên khác của một biến</td><td>bash 4.3+</td></tr>
<tr><td><code>-x</code></td><td>xuất cho tiến trình con</td><td>như <code>export</code> (Bài 8.1)</td></tr>
<tr><td><code>-p tên…</code></td><td>in biến kèm thuộc tính</td><td>công cụ gỡ lỗi mảng nhanh nhất</td></tr>
</table>
<p>Nhìn lại dòng <code>cfg; echo "mã=$?"</code>: cả "không in" lẫn "mã=…" đều không xuất hiện. Gán vào biến chỉ-đọc bị coi là lỗi nặng: bash bỏ ngang <em>cả dòng lệnh</em> đang chạy — lời gọi hàm lẫn lệnh <code>echo</code> sau dấu <code>;</code> — rồi đi tiếp sang dòng kế của script. Vì thế dòng sau, <code>declare -p</code>, vẫn chạy. Thêm một lý do để đặt mỗi bước quan trọng trên một dòng riêng.</p>

<h3>Chạy thử từng bước</h3>
<p>Trong một container <code>ubuntu:24.04</code> (hoặc WSL), dán lần lượt các dòng sau rồi so với output ở trên:</p>
<ol>
<li><code>a=(web db "cache redis" worker); unset 'a[1]'; declare -p a</code> — thấy lỗ ở chỉ số 1.</li>
<li><code>for i in "\${!a[@]}"; do echo "$i=\${a[$i]}"; done</code> — vòng lặp tôn trọng lỗ.</li>
<li><code>q[web]=1; q[api]=2; declare -p q</code> — quên <code>-A</code>: một phần tử duy nhất ở chỉ số 0.</li>
<li><code>declare -A m=([web]=3000 [api]=4000); [[ -v m[db] ]] || echo "không có db"; declare -p m</code>.</li>
<li><code>mapfile -t hosts &lt; &lt;(printf '%s\\n' vps linux-nha); echo "\${#hosts[@]}"</code> → <code>2</code>. Rồi thử <code>printf 'x\\n' | mapfile -t h2; echo "\${#h2[@]}"</code> → <code>0</code>.</li>
<li><code>f() { local -n _r=$1; _r+=(moi); }; arr=(cu); f arr; declare -p arr</code> → <code>([0]="cu" [1]="moi")</code>.</li>
</ol>

<h3>Trên macOS và WSL khác gì</h3>
<table>
<tr><th>Thứ trong bài</th><th>Ubuntu / WSL2 (bash 5.2)</th><th>Mac <code>/bin/bash</code> 3.2 (đo thật)</th></tr>
<tr><td>mảng chỉ số, <code>unset</code>, <code>\${!a[@]}</code>, <code>+=</code></td><td>chạy được</td><td>chạy được</td></tr>
<tr><td><code>\${a[-1]}</code></td><td><code>mail</code></td><td><code>a: bad array subscript</code></td></tr>
<tr><td><code>declare -A</code></td><td>chạy được</td><td><code>declare: -A: invalid option</code></td></tr>
<tr><td><code>port["redis cache"]=6379</code> sau khi <code>-A</code> hỏng</td><td>—</td><td><code>redis cache: syntax error in expression</code>, và <code>\${port[api]}</code> in <code>5432</code> — SAI giá trị</td></tr>
<tr><td><code>mapfile</code> / <code>readarray</code></td><td>chạy được</td><td><code>command not found</code></td></tr>
<tr><td><code>declare -n</code></td><td>chạy được</td><td><code>declare: -n: invalid option</code></td></tr>
<tr><td><code>declare -i</code>, <code>declare -p</code></td><td>chạy được</td><td>chạy được (in nháy kiểu khác: <code>a='([0]="web" …)'</code>)</td></tr>
</table>
<p>Hàng <code>port[api]</code> trên Mac là hàng nguy hiểm: sau khi <code>declare -A</code> hỏng, script vẫn chạy tiếp với một mảng chỉ số và trả lời SAI, y hệt cái bẫy quên <code>-A</code>. zsh — shell tương tác mặc định của Mac — có mảng kết hợp, nhưng cú pháp khác (<code>typeset -A m; m=(web 3000 api 4000); echo $m[api]</code> → <code>4000</code>) và mảng chỉ số của nó đánh số từ <strong>1</strong> (<code>a=(x y z); echo $a[1]</code> → <code>x</code>). WSL2 chạy Ubuntu thật nên mọi thứ giống hệt VPS. Trên Mac, cài bash 5 bằng Homebrew và mở đầu script bằng <code>#!/usr/bin/env bash</code>.</p>

<h3>Khi nào dùng mảng — và khi nào KHÔNG</h3>
<ul>
<li><strong>Dùng</strong> mảng chỉ số cho mọi danh sách có thể chứa dấu cách: tên file, tham số lệnh bạn dựng dần (<code>args+=(--co "$v")</code>), danh sách máy cần ghé.</li>
<li><strong>Dùng</strong> mảng kết hợp cho bảng tra và trạng thái của chính script: dịch vụ → cổng, "đã gặp chưa", PID → việc.</li>
<li><strong>Đừng</strong> lặp qua một file lớn bằng bash để đổ vào mảng chỉ để đếm hay cộng — một lệnh <code>awk</code> nhanh hơn 30 lần (đo ở trên).</li>
<li><strong>Đừng</strong> cố lồng nhau: giá trị luôn là chuỗi. Cần mảng của mảng hay JSON thật thì dùng <code>jq</code> hoặc chuyển sang Python (Bài 13.4).</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> nhóm SWP391 của bạn giữ một file <code>services.conf</code> với các dòng kiểu <code>web=3000</code>. Học kỳ này đã hai lần có hai dịch vụ được gán trùng một cổng và container thứ hai không khởi động được. Viết một bộ kiểm trong <code>~/thu-linux/ch13</code> (hoặc container <code>ubuntu:24.04</code>).</p><ol>
<li>Tạo <code>services.conf</code> có một dòng chú thích <code># dịch vụ=cổng</code> và <code>web=3000</code>, <code>api=4000</code>, <code>db=5432</code>, <code>admin=3000</code>, <code>redis=6379</code> — dòng cuối KHÔNG có ký tự xuống dòng (dùng <code>printf</code> không có <code>\\n</code>).</li>
<li>Viết <code>kiem-cong.sh</code>: <code>declare -A cong ai_dung</code>, đọc file bằng <code>while IFS='=' read -r ten so || [[ -n $ten ]]</code>, bỏ qua dòng rỗng và dòng <code>#</code>, lưu <code>cong[$ten]=$so</code>.</li>
<li>Dùng <code>[[ -v ai_dung[$so] ]]</code> để phát hiện cổng đã có người giữ; in <code>TRÙNG cổng 3000: web và admin</code> ra stderr và nhớ lại để thoát mã 1.</li>
<li>In bảng sắp theo tên dịch vụ bằng <code>printf '%-10s %s\\n'</code>, đọc khoá qua <code>&lt; &lt;(printf '%s\\n' "\${!cong[@]}" | sort)</code>.</li>
<li>Xoá dòng <code>declare -A</code> rồi chạy lại: giải thích điều bạn thấy bằng <code>declare -p cong</code>.</li></ol>
<p><strong>Đạt khi:</strong> script in dòng báo trùng, rồi 5 hàng từ <code>admin</code> tới <code>web</code> theo thứ tự chữ cái, có cả <code>redis 6379</code> (dòng không có xuống dòng), và <code>echo $?</code> cho <code>1</code>; sửa thành <code>admin=3001</code> thì thoát <code>0</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Indexed array (mảng chỉ số)</span><span class="v">Một biến chứa nhiều chuỗi, mỗi chuỗi ở một chỉ số nguyên; chỉ số có thể có lỗ.</span></div>
  <div class="kv"><span class="k">Associative array (mảng kết hợp)</span><span class="v">Một từ điển: khoá chuỗi → giá trị chuỗi; phải tạo bằng <code>declare -A</code>.</span></div>
  <div class="kv"><span class="k">Sparse array (mảng thưa)</span><span class="v">Mảng có chỉ số không liên tiếp, ví dụ sau <code>unset 'a[1]'</code>.</span></div>
  <div class="kv"><span class="k">Arithmetic context (ngữ cảnh số học)</span><span class="v">Những chỗ bash tính toán — <code>(( ))</code>, <code>$(( ))</code>, chỉ số mảng thường; chữ ở đó là tên biến, chưa đặt thì bằng 0.</span></div>
  <div class="kv"><span class="k"><code>mapfile</code> / <code>readarray</code></span><span class="v">Lệnh dựng sẵn đọc từng dòng (hoặc từng mục ngăn bằng NUL) vào một mảng.</span></div>
  <div class="kv"><span class="k">Nameref (tham chiếu theo tên)</span><span class="v">Biến khai báo bằng <code>-n</code>, là tên khác của một biến khác.</span></div>
  <div class="kv"><span class="k">Attribute (thuộc tính)</span><span class="v">Cờ gắn bằng <code>declare</code> (<code>-i -l -u -r -g -x</code>) làm đổi cách phép gán hoạt động.</span></div>
  <div class="kv"><span class="k"><code>declare -p</code></span><span class="v">In biến kèm thuộc tính, ở dạng <code>source</code> ngược lại được.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mảng chỉ số có thể thưa: lặp bằng <code>"\${a[@]}"</code> hoặc <code>"\${!a[@]}"</code>, đừng lặp <code>0..\${#a[@]}-1</code>; viết <code>unset 'a[i]'</code> có nháy.</li>
<li>Mảng kết hợp bắt buộc <code>declare -A</code> (trong hàm: <code>-gA</code>); quên nó thì mọi khoá lặng lẽ dồn vào ô 0.</li>
<li>Thứ tự khoá không phải thứ tự thêm — cần thứ tự thì sắp <code>"\${!m[@]}"</code>; <code>[[ -v m[k] ]]</code> kiểm khoá có tồn tại.</li>
<li><code>mapfile -t</code> (cùng <code>-n -s -O -d ''</code>) đọc dòng vào mảng; không bao giờ nạp nó qua ống dẫn.</li>
<li><code>local -n ref=$1</code> đưa mảng vào và ra khỏi hàm bằng tên; đặt tên nameref thật riêng.</li>
<li>Từ điển bash dành cho trạng thái của script, không cho dữ liệu khối lớn: <code>awk</code> đếm 200.000 dòng log nhanh hơn 30 lần; và bash 3.2 của Mac không có thứ nào trong số này.</li>
</ul>

<a class="link-card" href="https://mywiki.wooledge.org/BashGuide/Arrays" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">BashGuide — Arrays</span><span class="lc-sub">Chương về mảng chỉ số và mảng kết hợp của Greg's Wiki: tạo, khai triển, chỉ số thưa và các lỗi hay gặp, ví dụ chạy được ngay.</span></span>
</a>
<a class="link-card" href="https://mywiki.wooledge.org/BashFAQ/006" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">BashFAQ 006 — mảng kết hợp và gián tiếp</span><span class="lc-sub">Cách dùng "biến của biến", mảng kết hợp và nameref, và vì sao <code>eval</code> là câu trả lời sai.</span></span>
</a>
<a class="link-card" href="https://www.gnu.org/software/bash/manual/html_node/Arrays.html" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Bash Reference Manual — Arrays</span><span class="lc-sub">Định nghĩa chính thức: chỉ số là biểu thức số học, chỉ số âm, <code>declare -A</code>, và <code>unset</code> làm gì với một phần tử.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Code Lab — Linux &amp; Bash</span><span class="lc-sub">Bài luyện có chấm điểm của khoá; làm các bài về mảng và vòng lặp sau bài này.</span></span>
</a>
<p class="note-ct"><strong>Thói quen mang về:</strong> hễ script cần một cái bảng, viết <code>declare -A</code> trước rồi kiểm bằng <code>declare -p</code> — và hễ script cần nghiền một file lớn, hãy với tới <code>awk</code> thay vì một vòng lặp bash.</p>
</div>
`,
    },
    /* ─────────────────────────── 13.2 ─────────────────────────── */
    {
      title: "13.2 — Streams in depth: file descriptors, process substitution, here-docs, FIFOs and coproc|||13.2 — Luồng nâng cao: file descriptor, process substitution, heredoc, fifo và coproc",
      slug: "lnx-13-2-luong-nang-cao",
      type: "LESSON",
      isFreePreview: true,
      description: "Bảng file descriptor của một tiến trình, exec {fd}> tự cấp số, đổi chỗ stdout và stderr, <(…) và >(…) thật ra là gì, heredoc ba kiểu và here-string, ống có tên mkfifo, coproc, và cách đọc tên file bất kỳ an toàn với read -r -d .",
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.2</span>
<h2>Streams in depth: file descriptors, process substitution, here-docs, FIFOs and coproc</h2>
<p class="lead">Lesson 3.1 taught stdin, stdout and stderr and opened an extra descriptor with <code>exec 3&gt; file</code>; Lesson 3.2 showed <code>&lt;(sort a)</code> and why a <code>while read</code> at the end of a pipe loses its variables. This lesson opens the box underneath: what a file descriptor actually is, how to juggle several of them, what <code>&lt;(…)</code> really hands to a command, the three kinds of here-document, and two ways for processes to talk that are not an ordinary pipe — a named pipe and a coprocess.</p>

<h3>Why you need this</h3>
<p>Three real situations from a student project. The deploy script should write everything to a log file <em>and</em> the screen, without adding <code>| tee</code> to forty lines. A backup job needs a <code>flock</code> on a descriptor whose number does not collide with anything else. And the nginx config generated by a heredoc came out as <code>proxy_set_header Host ;</code> — the <code>$host</code> vanished because the heredoc delimiter was not quoted. All three are one idea: redirections are operations on a small table the kernel keeps for each process.</p>

<h3>The file-descriptor table, and exec {fd}</h3>
${slide('lx-13', 9, 'Mỗi tiến trình có một bảng fd; exec mở thêm')}
<p>Every process has a table of open files. A file descriptor (fd) is simply the row number in that table: 0 is stdin, 1 stdout, 2 stderr, and anything else is whatever the process opened. Linux shows the table under <code>/proc/PID/fd</code>:</p>
<pre><code class="language-bash">exec {log}&gt;&gt;nhat-ky.txt            <span class="tok-comment"># open a NEW fd; bash picks a free number ≥ 10 and stores it in $log</span>
echo "fd được cấp: $log"
echo "bước 1 xong" &gt;&amp;$log          <span class="tok-comment"># write through it</span>
ls -l /proc/$$/fd | awk 'NR&gt;1{print $9, $10, $11}'
exec {log}&gt;&amp;-                      <span class="tok-comment"># close it</span>
cat nhat-ky.txt
printf 'a\\nb\\nc\\n' &gt; trai.txt; printf '1\\n2\\n3\\n' &gt; phai.txt
exec 3&lt;trai.txt 4&lt;phai.txt         <span class="tok-comment"># two files open for reading at once</span>
while read -r x &lt;&amp;3 &amp;&amp; read -r y &lt;&amp;4; do echo "$x-$y"; done
exec 3&lt;&amp;- 4&lt;&amp;-</code></pre>
<div class="out">fd được cấp: 10
0 -&gt; /dev/null
1 -&gt; pipe:[3169279]
10 -&gt; /home/an/thu-linux/nhat-ky.txt
2 -&gt; pipe:[3169279]
255 -&gt; /home/an/thu-linux/b1.sh
bước 1 xong
a-1
b-2
c-3</div>
<p>Read the table: fd 0 is <code>/dev/null</code> because the script was run non-interactively, fds 1 and 2 are the same pipe (the terminal capture), fd 10 is the log we opened, and fd 255 is bash keeping the script file itself open so it can read the next line. The <code>{log}</code> form (bash 4.1+) is the important new piece: instead of choosing "3" and hoping nothing else in the script — or a library you sourced — is using 3, you let bash pick a free number and keep it in a variable. The two-file loop shows why several descriptors are useful: <code>read</code> pulls one line from each file per iteration, which a single stdin cannot do.</p>
<table>
<tr><th>Form</th><th>Meaning</th><th>Example</th></tr>
<tr><td><code>exec 3&gt;f</code></td><td>open for writing (truncate)</td><td>a fresh report file</td></tr>
<tr><td><code>exec 3&gt;&gt;f</code></td><td>open for appending</td><td>a log</td></tr>
<tr><td><code>exec 3&lt;f</code></td><td>open for reading</td><td>read a second file in a loop</td></tr>
<tr><td><code>exec 3&lt;&gt;f</code></td><td>open for reading and writing</td><td>a socket: <code>/dev/tcp/host/port</code></td></tr>
<tr><td><code>exec {v}&gt;f</code></td><td>like the above, bash chooses the number</td><td><code>flock -n "$v"</code> (Lesson 13.4)</td></tr>
<tr><td><code>exec 3&gt;&amp;1</code></td><td>make 3 a copy of what 1 points to now</td><td>save stdout before redirecting it</td></tr>
<tr><td><code>exec 3&gt;&amp;-</code> · <code>exec {v}&gt;&amp;-</code></td><td>close</td><td>release a lock, end a socket</td></tr>
<tr><td><code>exec &gt;f 2&gt;&amp;1</code></td><td>redirect the rest of the script</td><td>everything to a log file</td></tr>
</table>
<p>The last row has a popular variant that logs to a file <em>and</em> keeps the screen:</p>
<pre><code class="language-bash">#!/usr/bin/env bash
<span class="tok-comment"># ghi MỌI output của script vào nhat-ky.log VÀ màn hình</span>
exec &gt; &gt;(tee -a nhat-ky.log) 2&gt;&amp;1
echo "bắt đầu $(date +%T)"
ls /khong-co
echo "xong"</code></pre>
<div class="out">bắt đầu 16:32:11
ls: cannot access '/khong-co': No such file or directory
xong</div>
<p>The file got the same three lines, error included. One line at the top replaced forty <code>| tee</code>s. (The <code>&gt;(…)</code> in it is process substitution, explained below.)</p>
<p>Bash also understands two special paths that do not exist on disk: <code>/dev/tcp/HOST/PORT</code> and <code>/dev/udp/HOST/PORT</code>. Opening one opens a network connection. Against a small test server on port 19130 inside the container:</p>
<pre><code class="language-bash">exec 3&lt;&gt;/dev/tcp/127.0.0.1/19130
printf 'HEAD / HTTP/1.0\\r\\nHost: localhost\\r\\n\\r\\n' &gt;&amp;3
head -3 &lt;&amp;3
exec 3&gt;&amp;-</code></pre>
<div class="out">HTTP/1.0 200 OK
Server: SimpleHTTP/0.6 Python/3.12.3
Date: Mon, 28 Sep 2026 16:32:12 GMT</div>
<p>It is a handy "is the port open?" check on a minimal container without <code>curl</code> or <code>nc</code> (a health check can be <code>bash -c '&gt;/dev/tcp/127.0.0.1/5432'</code>). It is a bash feature, not a file: zsh answers <code>no such file or directory: /dev/tcp/…</code>.</p>

<h3>Swapping stdout and stderr</h3>
${slide('lx-13', 10, 'Đổi chỗ stdout và stderr: fd 3 làm chỗ trung chuyển')}
<p>A pipe only carries stdout. Sometimes you want the opposite: send the <em>errors</em> through a pipe (to count them, to <code>grep</code> them) while the normal output still reaches the screen. That needs a swap, and a swap needs a temporary slot — exactly like swapping two variables with a third one:</p>
<pre><code class="language-bash">f() { echo "dữ liệu (stdout)"; echo "lỗi (stderr)" &gt;&amp;2; }
f 3&gt;&amp;1 1&gt;&amp;2 2&gt;&amp;3 3&gt;&amp;- | sed 's/^/ỐNG NHẬN: /'</code></pre>
<div class="out">dữ liệu (stdout)
ỐNG NHẬN: lỗi (stderr)</div>
<p>Redirections are processed <strong>left to right</strong>, and each one copies "where does this fd point <em>right now</em>". Start: 1 = the pipe to <code>sed</code>, 2 = the screen. <code>3&gt;&amp;1</code>: 3 = the pipe. <code>1&gt;&amp;2</code>: 1 = the screen. <code>2&gt;&amp;3</code>: 2 = the pipe. <code>3&gt;&amp;-</code>: close the temporary. Now errors go into the pipe and data to the screen. Slide 10 draws each step.</p>
<div class="pitfall">The left-to-right rule is also why <code>ls /khong-co 2&gt;&amp;1 &gt;out.txt</code> still prints the error on the screen: at the moment <code>2&gt;&amp;1</code> runs, fd 1 is still the terminal, so fd 2 copies the terminal; only afterwards is fd 1 moved to the file. Measured: the error appeared on screen and <code>out.txt</code> was empty. <code>ls /khong-co &gt;out2.txt 2&gt;&amp;1</code> put the error in the file. Order is meaning.</div>
<p>The same technique captures <em>only</em> stderr into a variable, letting stdout through:</p>
<pre><code class="language-bash">{ loi=$(f 2&gt;&amp;1 1&gt;&amp;3 3&gt;&amp;-); } 3&gt;&amp;1
echo "loi=[$loi]"</code></pre>
<div class="out">dữ liệu (stdout)
loi=[lỗi (stderr)]</div>
<p>Outside, <code>3&gt;&amp;1</code> saves the real stdout in fd 3. Inside <code>$( )</code>, stdout is the capture pipe; <code>2&gt;&amp;1</code> sends errors into the capture, then <code>1&gt;&amp;3</code> sends normal output back to the saved real stdout. This is BashFAQ 002 in one line — useful when a tool writes its version or its warnings on stderr.</p>

<h3>Process substitution: what &lt;(…) really is</h3>
${slide('lx-13', 11, '<(lệnh) là một TÊN FILE trỏ vào một ống')}
<pre><code class="language-bash">echo &lt;(true)
ls -l &lt;(true) | awk '{print $1, $9, $10, $11}'
printf 'nginx\\ncurl\\ngit\\n' &gt; can.txt; printf 'git\\ncurl\\n' &gt; co.txt
diff &lt;(sort can.txt) &lt;(sort co.txt); echo "mã diff=$?"
seq 1 5 | tee &gt;(wc -l &gt; dem.txt) &gt;(gzip &gt; so.gz) &gt; /dev/null
sleep 0.2; echo "đếm=$(cat dem.txt)  gz=$(zcat so.gz | tr '\\n' ' ')"
cat &lt;(false; echo "trong"); echo "mã cat=$?"
exec 5&lt; &lt;(sleep 0.1; exit 3); wait $!; echo "mã &lt;( ) lấy bằng wait \\$!: $?"</code></pre>
<div class="out">/dev/fd/63
lr-x------ /dev/fd/63 -&gt; pipe:[3171670]
3d2
&lt; nginx
mã diff=1
đếm=5  gz=1 2 3 4 5
trong
mã cat=0
mã &lt;( ) lấy bằng wait $!: 3</div>
<p>The first two lines answer the question completely: bash starts the command with its output connected to a pipe, keeps the pipe's read end open as a file descriptor (63), and replaces <code>&lt;(…)</code> with the <strong>name</strong> <code>/dev/fd/63</code>. The outer command just sees a filename. That is why it works with tools that only accept files — <code>diff</code>, <code>comm</code>, <code>join</code>, <code>paste</code> — and with several at once. <code>&gt;(…)</code> is the mirror image: a filename that, when written to, feeds a command's stdin — here one <code>seq</code> fed both a line counter and <code>gzip</code> (the <code>sleep 0.2</code> is there because <code>&gt;(…)</code> commands run in the background and may still be writing when the next line starts).</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Pipe</span><span class="lz-t">pipe()</span><span class="lz-d">Bash asks the kernel for a pipe: a write end and a read end.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Background command</span><span class="lz-t">sort can.txt</span><span class="lz-d">Started with its stdout on the write end.</span></div>
  <div class="lz-step"><span class="lz-k">3 · A name</span><span class="lz-t">/dev/fd/63</span><span class="lz-d">The read end stays open as fd 63; the word is replaced by this path.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Outer command</span><span class="lz-t">diff /dev/fd/63 /dev/fd/62</span><span class="lz-d">Opens the "files" and reads the live output, once, front to back.</span></div>
</div>
<p>Two limits come from "it is a pipe". It can be read <strong>once, front to back</strong>: a program that wants to seek in its input or read it twice will misbehave. And the substituted command's <strong>exit status is lost</strong>: <code>cat &lt;(false; …)</code> returned 0. Since bash 4.4 the PID is in <code>$!</code>, so <code>wait $!</code> can recover the status — measured: 3. For the loop-variable problem of Lesson 3.2, <code>done &lt; &lt;(cmd)</code> remains the standard fix, because the loop then runs in the current shell.</p>

<h3>Here-documents three ways, and here-strings</h3>
${slide('lx-13', 12, 'Heredoc ba kiểu và here-string <<<')}
<pre><code class="language-bash">ten=Cường
cat &lt;&lt;EOF2
Xin chào $ten, hôm nay $(date +%F)
EOF2
cat &lt;&lt;'EOF2'
Xin chào $ten, hôm nay $(date +%F)
EOF2
if true; then
	cat &lt;&lt;-EOF2
	thụt bằng TAB — &lt;&lt;- xoá tab đầu dòng
	EOF2
fi
read -r a b c &lt;&lt;&lt; "một hai ba bốn"
echo "a=$a b=$b c=$c"
od -c &lt;&lt;&lt; "hi"</code></pre>
<div class="out">Xin chào Cường, hôm nay 2026-09-28
Xin chào $ten, hôm nay $(date +%F)
thụt bằng TAB — &lt;&lt;- xoá tab đầu dòng
a=một b=hai c=ba bốn
0000000   h   i  \\n
0000003</div>
<table>
<tr><th>Form</th><th>Expansions inside?</th><th>Use it for</th></tr>
<tr><td><code>&lt;&lt;EOF</code></td><td>yes: <code>$var</code>, <code>$(cmd)</code>, <code>\\</code></td><td>templates filled with your variables</td></tr>
<tr><td><code>&lt;&lt;'EOF'</code> (any quoting of the word)</td><td>no — every character literal</td><td>SQL, nginx configs, scripts that contain <code>$</code></td></tr>
<tr><td><code>&lt;&lt;-EOF</code></td><td>as <code>&lt;&lt;EOF</code>, and strips leading <strong>TAB</strong>s</td><td>indented heredocs inside <code>if</code>/functions</td></tr>
<tr><td><code>&lt;&lt;&lt; "word"</code></td><td>yes; adds one newline at the end</td><td>feeding one string to <code>read</code>, <code>bc</code>, <code>grep</code></td></tr>
</table>
<p>The quoted form is the one that prevents real bugs. A group writing its nginx config from a script:</p>
<pre><code class="language-bash">cat &lt;&lt;'EOF' &gt; site.conf
proxy_set_header Host $host;
EOF
cat site.conf
cat &lt;&lt;EOF
proxy_set_header Host $host;
EOF</code></pre>
<div class="out">proxy_set_header Host $host;
proxy_set_header Host ;</div>
<p>Unquoted, bash expanded <code>$host</code> — an unset shell variable — to nothing, and nginx would receive <code>Host ;</code>. And <code>&lt;&lt;-</code> only strips <strong>tabs</strong>. If your editor turns tabs into spaces, the closing word is no longer at the start of a line and bash never finds it:</p>
<div class="out">b5.sh: line 6: warning: here-document at line 2 delimited by end-of-file (wanted &#96;EOF')
b5.sh: line 7: syntax error: unexpected end of file</div>
<p><code>&lt;&lt;&lt;</code> adds exactly one newline (<code>od -c</code> shows <code>h i \\n</code>), which is why <code>grep -c . &lt;&lt;&lt; ""</code> sees one empty line and prints 0.</p>

<h3>Named pipes and coprocesses</h3>
${slide('lx-13', 13, 'mkfifo và coproc: hai tiến trình nói chuyện qua ống')}
<p>An ordinary pipe <code>|</code> only connects processes started together on one command line. A <strong>named pipe</strong> (FIFO) is a pipe with a name in the file system, so two unrelated programs can meet at it:</p>
<pre><code class="language-bash">mkfifo ong; ls -l ong | cut -c1-10
( sleep 1; echo "tin từ tiến trình ghi" &gt; ong ) &amp;
echo "đọc đang CHỜ…"
read -r tin &lt; ong
echo "nhận: $tin"
rm ong</code></pre>
<div class="out">prw-r--r--
đọc đang CHỜ…
nhận: tin từ tiến trình ghi</div>
<p>The type letter is <code>p</code>. Opening a FIFO <strong>blocks</strong> until the other side opens it too — the reader waited one second for the writer. No data is ever stored on disk; the name is only a meeting point. Typical uses: feeding a long-running program from several scripts, or giving a tool that insists on a filename a live stream (what <code>&lt;(…)</code> does for you automatically).</p>
<p>A <strong>coprocess</strong> (bash 4.0+) is a background command with <em>two</em> pipes: you write to its stdin and read its stdout, as a conversation. Good for keeping one expensive program alive instead of starting it once per question:</p>
<pre><code class="language-bash">coproc BC { bc -l; }
echo "PID coproc=$BC_PID, fd: \${BC[@]}"
echo "scale=4; 22/7" &gt;&amp;"\${BC[1]}"; read -r kq &lt;&amp;"\${BC[0]}"; echo "22/7 = $kq"
echo "2^64" &gt;&amp;"\${BC[1]}";          read -r kq &lt;&amp;"\${BC[0]}"; echo "2^64 = $kq"
exec {BC[1]}&gt;&amp;-; wait "$BC_PID"; echo "bc đã thoát, mã $?"</code></pre>
<div class="out">PID coproc=3801, fd: 63 60
22/7 = 3.1428
2^64 = 18446744073709551616
bc đã thoát, mã 0</div>
<p><code>\${BC[0]}</code> is the read end (bc's output), <code>\${BC[1]}</code> the write end (bc's input). Closing the write end tells <code>bc</code> "no more input", so it exits and <code>wait</code> collects its status. The classic way to hang a script is to <code>read</code> one more line than the coprocess will ever print — nothing arrives and <code>read</code> waits forever. Use <code>read -t 5</code> when you are not sure.</p>

<h3>Reading arbitrary filenames safely</h3>
${slide('lx-13', 14, 'Đọc tên file an toàn: 5 cách, 4 kết quả')}
<p>Filenames may contain spaces, leading spaces, backslashes and even newlines. The only byte they cannot contain is NUL. A test directory with four hostile names — <code>bao cao.txt</code>, <code>␣␣hai-dau-cach.txt</code>, <code>-rf.txt</code> and a name with a newline in it — and five ways to count them:</p>
<pre><code class="language-bash">n=0; find . -type f | while read -r f; do ((n++)); done; echo "1) find | while read     : n=$n"
n=0; while read -r f; do ((n++)); done &lt; &lt;(find . -type f); echo "2) &lt; &lt;(find)             : n=$n"
n=0; while IFS= read -r -d '' f; do ((n++)); done &lt; &lt;(find . -type f -print0); echo "3) -print0 + read -d ''  : n=$n"
shopt -s lastpipe; n=0; find . -type f -print0 | while IFS= read -r -d '' f; do ((n++)); done; echo "4) lastpipe              : n=$n"
mapfile -d '' -t ds &lt; &lt;(find . -type f -print0); echo "5) mapfile -d ''         : \${#ds[@]} phần tử"</code></pre>
<div class="out">1) find | while read     : n=0
2) &lt; &lt;(find)             : n=5
3) -print0 + read -d ''  : n=4
4) lastpipe              : n=4
5) mapfile -d ''         : 4 phần tử</div>
<p>(1) is the subshell problem from Lesson 3.2. (2) fixes the subshell but reads <em>lines</em>, so the name containing a newline counts twice. (3), (4) and (5) agree on the truth. The pieces of (3), one by one:</p>
<table>
<tr><th>Piece</th><th>Why</th><th>Without it (measured)</th></tr>
<tr><td><code>find … -print0</code></td><td>end each name with NUL, the one byte a name cannot contain</td><td>newline names split in two</td></tr>
<tr><td><code>read -d ''</code></td><td>read up to NUL instead of newline</td><td>—</td></tr>
<tr><td><code>IFS=</code></td><td>do not trim leading/trailing spaces</td><td><code>"␣␣thụt lề"</code> → <code>[thụt lề]</code></td></tr>
<tr><td><code>-r</code></td><td>keep backslashes</td><td><code>a\\tb</code> → <code>[atb]</code></td></tr>
<tr><td><code>&lt; &lt;(…)</code> (or <code>lastpipe</code>)</td><td>the loop runs in the current shell</td><td>counter stays 0</td></tr>
</table>
<p>One more real trap: a text file whose last line has no newline (common with files saved by Windows editors or produced by <code>printf</code>). <code>while read -r x</code> silently drops that line, because <code>read</code> returns non-zero at end-of-file even though it filled <code>x</code>. The fix is <code>while read -r x || [[ -n $x ]]</code> — measured: the version without it printed nothing for <code>printf 'dòng không có xuống dòng'</code>, the fixed one printed the line.</p>
<p>And <code>IFS</code> itself, used correctly — only for one command, never globally:</p>
<pre><code class="language-bash">IFS=, read -r -a b &lt;&lt;&lt; "x,y z,,w"; declare -p b
IFS=: read -r u _ uid _ &lt;&lt;&lt; "an:x:1001:1001"; echo "$u $uid"
a=(web db "cache redis"); (IFS=,; echo "\${a[*]}")    <span class="tok-comment"># join with commas in a subshell</span></code></pre>
<div class="out">declare -a b=([0]="x" [1]="y z" [2]="" [3]="w")
an 1001
web,db,cache redis</div>
<p>A comma separator keeps the space inside <code>y z</code> and the empty field between <code>,,</code>. <code>"\${a[*]}"</code> joins with the first character of <code>IFS</code> — the same rule that broke the <code>--dry-run</code> output in Lesson 7.5 — so setting it inside <code>( )</code> keeps the change from leaking into the rest of the script.</p>

<h3>Run it step by step</h3>
<ol>
<li><code>exec {x}&gt;/tmp/thu.txt; echo "$x"; ls -l /proc/$$/fd/$x; exec {x}&gt;&amp;-</code> — see the number bash picked and where it points.</li>
<li><code>ls /khong-co 3&gt;&amp;1 1&gt;&amp;2 2&gt;&amp;3 | wc -l</code> — the error line is counted (1).</li>
<li><code>echo &lt;(true); diff &lt;(printf 'a\\nb\\n') &lt;(printf 'a\\nc\\n')</code>.</li>
<li><code>h=example; cat &lt;&lt;EOF</code> … <code>$h</code> … <code>EOF</code>, then the same with <code>&lt;&lt;'EOF'</code>.</li>
<li><code>mkfifo /tmp/p; (sleep 2; date &gt; /tmp/p) &amp; cat /tmp/p; rm /tmp/p</code> — watch <code>cat</code> wait.</li>
<li><code>mkdir t; touch t/"a b" t/$'x\\ny'; find t -type f -print0 | tr -cd '\\0' | wc -c</code> → 2, while <code>find t -type f | wc -l</code> → 3.</li>
</ol>

<h3>On macOS and WSL</h3>
<table>
<tr><th>Thing in this lesson</th><th>Ubuntu / WSL2</th><th>Mac <code>/bin/bash</code> 3.2 (measured)</th></tr>
<tr><td><code>exec {log}&gt;&gt;f</code></td><td>fd 10</td><td><code>exec: {log}: not found</code></td></tr>
<tr><td><code>exec 3&gt;f</code>, swaps, <code>&lt;(…)</code>, heredocs, <code>&lt;&lt;&lt;</code></td><td>work</td><td>work</td></tr>
<tr><td><code>/dev/tcp/127.0.0.1/PORT</code></td><td>works</td><td>works in bash; zsh: <code>no such file or directory</code></td></tr>
<tr><td><code>coproc</code></td><td>works</td><td><code>coproc: command not found</code></td></tr>
<tr><td><code>shopt -s lastpipe</code></td><td>works</td><td><code>invalid shell option name</code></td></tr>
<tr><td><code>read -r -d ''</code></td><td>works</td><td>works — the portable choice</td></tr>
<tr><td><code>mapfile -d ''</code></td><td>works</td><td>no <code>mapfile</code> at all</td></tr>
<tr><td><code>ls -l /proc/$$/fd</code></td><td>works</td><td>no <code>/proc</code> on macOS; use <code>lsof -p $$</code></td></tr>
</table>
<p>For a script that must run on a Mac's stock bash, the <code>while IFS= read -r -d '' f; do …; done &lt; &lt;(find … -print0)</code> loop is the one that works everywhere. WSL2 behaves like Ubuntu, with one caveat from Lesson 7.1: files edited on the Windows side may carry CRLF line endings, and then <code>read</code> keeps a <code>\\r</code> at the end of every line.</p>

<h3>When to use what</h3>
<ul>
<li><strong><code>exec {fd}</code></strong> for any extra descriptor that lives for a while (locks, audit logs, sockets); literal <code>3</code> only in tiny one-liners.</li>
<li><strong><code>&lt;(…)</code></strong> when a tool needs filenames and you have commands; <strong>not</strong> when the tool must seek or re-read the input, or when you need the exit status without <code>wait $!</code>.</li>
<li><strong><code>&lt;&lt;'EOF'</code></strong> by default for any generated file containing <code>$</code>; unquoted only when you really want expansion.</li>
<li><strong>FIFO</strong> for two independent programs; <strong><code>coproc</code></strong> for a conversation with one long-lived helper; for anything bigger, a real language or a message queue.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> your group's <code>deploy.sh</code> prints to the screen and nobody can reconstruct what happened after a failed night run; the nginx config it generates has lost its variables. Fix both in <code>~/thu-linux/ch13</code> (or an <code>ubuntu:24.04</code> container).</p><ol>
<li>At the top of a new <code>deploy.sh</code> add <code>exec &gt; &gt;(tee -a deploy.log) 2&gt;&amp;1</code>; make it echo a start line, run <code>ls /khong-co</code> (a failing command, without <code>set -e</code> for now) and echo an end line.</li>
<li>Open an audit descriptor with <code>exec {audit}&gt;&gt;audit.log</code> and write one line per step to <code>&gt;&amp;$audit</code>; close it at the end.</li>
<li>Generate <code>site.conf</code> with a heredoc containing <code>proxy_set_header Host $host;</code> — first unquoted, look at the result, then with <code>&lt;&lt;'EOF'</code>.</li>
<li>Create a <code>logs/</code> directory with three files, one of them named with a newline (<code>touch logs/$'a\\nb.log'</code>), and count them with a <code>while IFS= read -r -d ''</code> loop fed by <code>&lt; &lt;(find logs -type f -print0)</code>.</li></ol>
<p><strong>Done when:</strong> <code>deploy.log</code> contains the start line, the <code>ls</code> error and the end line; <code>audit.log</code> has one line per step; <code>grep -c '\\$host' site.conf</code> prints 1; and your loop prints 3 while <code>find logs -type f | wc -l</code> prints 4.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">File descriptor (fd)</span><span class="v">A small integer naming one open file, pipe or socket in a process's table; 0/1/2 are stdin/stdout/stderr.</span></div>
  <div class="kv"><span class="k"><code>exec</code> redirection</span><span class="v"><code>exec</code> with only redirections changes the current shell's fd table for the rest of the script.</span></div>
  <div class="kv"><span class="k">Duplicating (<code>n&gt;&amp;m</code>)</span><span class="v">Make fd n point wherever fd m points at that moment.</span></div>
  <div class="kv"><span class="k">Process substitution</span><span class="v"><code>&lt;(cmd)</code> / <code>&gt;(cmd)</code>: a <code>/dev/fd/N</code> filename connected to a command through a pipe.</span></div>
  <div class="kv"><span class="k">Here-document</span><span class="v">Lines up to a delimiter fed as stdin; quoting the delimiter turns expansion off.</span></div>
  <div class="kv"><span class="k">Here-string</span><span class="v"><code>&lt;&lt;&lt; word</code>: one string plus a newline as stdin.</span></div>
  <div class="kv"><span class="k">FIFO / named pipe</span><span class="v">A pipe with a name in the file system (<code>mkfifo</code>, type <code>p</code>); opening blocks until both sides are there.</span></div>
  <div class="kv"><span class="k">Coprocess</span><span class="v">A background command connected by two pipes, created with <code>coproc</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>An fd is a row in the process's open-file table; <code>exec {v}&gt;f</code> opens one on a free number and <code>exec {v}&gt;&amp;-</code> closes it.</li>
<li>Redirections run left to right and copy the current target: <code>3&gt;&amp;1 1&gt;&amp;2 2&gt;&amp;3 3&gt;&amp;-</code> swaps stdout and stderr.</li>
<li><code>&lt;(cmd)</code> is a <code>/dev/fd/63</code> filename backed by a pipe: read once, exit status only via <code>wait $!</code>.</li>
<li>Quote the heredoc word (<code>&lt;&lt;'EOF'</code>) whenever the text contains <code>$</code>; <code>&lt;&lt;-</code> strips tabs, not spaces.</li>
<li>FIFOs let unrelated processes meet; <code>coproc</code> keeps a helper alive for a two-way conversation.</li>
<li>For arbitrary filenames: <code>find -print0</code> + <code>while IFS= read -r -d ''</code> + <code>&lt; &lt;(…)</code> — the one form that also works on the Mac.</li>
</ul>

<a class="link-card" href="https://mywiki.wooledge.org/BashFAQ/002" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">BashFAQ 002 — capture stdout and stderr separately</span><span class="lc-sub">The fd juggling behind "only stderr into a variable", with each redirection explained.</span></span>
</a>
<a class="link-card" href="https://mywiki.wooledge.org/ProcessSubstitution" target="_blank" rel="noopener">
  <span class="lc-ico">🔁</span>
  <span class="lc-body"><span class="lc-title">Greg's Wiki — Process Substitution</span><span class="lc-sub">How <code>&lt;(…)</code> and <code>&gt;(…)</code> are implemented, their limits, and the portable alternatives.</span></span>
</a>
<a class="link-card" href="https://mywiki.wooledge.org/BashFAQ/020" target="_blank" rel="noopener">
  <span class="lc-ico">📂</span>
  <span class="lc-body"><span class="lc-title">BashFAQ 020 — filenames with spaces and newlines</span><span class="lc-sub">Why <code>-print0</code> + <code>read -d ''</code> is the answer, and every tempting wrong one.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man7/fifo.7.html" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">fifo(7) — man7.org</span><span class="lc-sub">What a named pipe is to the kernel, and why opening one blocks.</span></span>
</a>
<p class="note-ct"><strong>The habit to take away:</strong> picture the fd table before you write a redirection. Every <code>&gt;</code>, <code>2&gt;&amp;1</code>, <code>&lt;(…)</code> or <code>exec</code> is just "make row N point there" — read them left to right and they stop being magic.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.2</span>
<h2>Luồng nâng cao: file descriptor, process substitution, heredoc, fifo và coproc</h2>
<p class="lead">Bài 3.1 đã dạy stdin, stdout, stderr và mở thêm một bộ mô tả bằng <code>exec 3&gt; file</code>; Bài 3.2 cho thấy <code>&lt;(sort a)</code> và vì sao một vòng <code>while read</code> ở cuối ống dẫn làm mất biến. Bài này mở cái hộp bên dưới: file descriptor thật ra là gì, cách tung hứng nhiều cái cùng lúc, <code>&lt;(…)</code> thật ra đưa cho lệnh cái gì, ba kiểu here-document, và hai cách để tiến trình nói chuyện với nhau không phải bằng ống dẫn thường — ống có tên và tiến trình đồng hành (coprocess).</p>

<h3>Vì sao cần</h3>
<p>Ba tình huống thật từ một dự án sinh viên. Script deploy phải ghi mọi thứ vào file log <em>và</em> màn hình, mà không phải thêm <code>| tee</code> vào bốn mươi dòng. Việc sao lưu cần <code>flock</code> trên một bộ mô tả có số không đụng với thứ gì khác. Và file cấu hình nginx sinh bằng heredoc ra thành <code>proxy_set_header Host ;</code> — <code>$host</code> biến mất vì chữ kết thúc heredoc không bọc nháy. Cả ba là MỘT ý: mọi phép chuyển hướng (redirection) là thao tác trên một bảng nhỏ mà nhân (kernel) giữ cho mỗi tiến trình.</p>

<h3>Bảng file descriptor, và exec {fd}</h3>
${slide('lx-13', 9, 'Mỗi tiến trình có một bảng fd; exec mở thêm')}
<p>Mỗi tiến trình có một bảng các file đang mở. File descriptor (fd — bộ mô tả file) đơn giản là số thứ tự của một hàng trong bảng đó: 0 là stdin, 1 là stdout, 2 là stderr, còn lại là thứ tiến trình tự mở. Linux cho xem bảng này ở <code>/proc/PID/fd</code>:</p>
<pre><code class="language-bash">exec {log}&gt;&gt;nhat-ky.txt            <span class="tok-comment"># mở một fd MỚI; bash tự chọn số trống ≥ 10 và cất vào $log</span>
echo "fd được cấp: $log"
echo "bước 1 xong" &gt;&amp;$log          <span class="tok-comment"># ghi qua fd đó</span>
ls -l /proc/$$/fd | awk 'NR&gt;1{print $9, $10, $11}'
exec {log}&gt;&amp;-                      <span class="tok-comment"># đóng lại</span>
cat nhat-ky.txt
printf 'a\\nb\\nc\\n' &gt; trai.txt; printf '1\\n2\\n3\\n' &gt; phai.txt
exec 3&lt;trai.txt 4&lt;phai.txt         <span class="tok-comment"># mở hai file để đọc cùng lúc</span>
while read -r x &lt;&amp;3 &amp;&amp; read -r y &lt;&amp;4; do echo "$x-$y"; done
exec 3&lt;&amp;- 4&lt;&amp;-</code></pre>
<div class="out">fd được cấp: 10
0 -&gt; /dev/null
1 -&gt; pipe:[3169279]
10 -&gt; /home/an/thu-linux/nhat-ky.txt
2 -&gt; pipe:[3169279]
255 -&gt; /home/an/thu-linux/b1.sh
bước 1 xong
a-1
b-2
c-3</div>
<p>Đọc bảng: fd 0 là <code>/dev/null</code> vì script chạy không tương tác, fd 1 và 2 cùng một ống (chỗ hứng output của terminal), fd 10 là file log vừa mở, còn fd 255 là bash tự giữ chính file script để đọc dòng kế tiếp. Dạng <code>{log}</code> (bash 4.1+) là mảnh mới quan trọng: thay vì tự chọn "3" rồi cầu cho không có chỗ nào khác trong script — hay một thư viện bạn <code>source</code> vào — đang dùng 3, bạn để bash chọn một số trống và cất nó vào biến. Vòng lặp hai file cho thấy vì sao cần nhiều bộ mô tả: <code>read</code> kéo mỗi file một dòng trong mỗi vòng, điều mà một stdin duy nhất không làm được.</p>
<table>
<tr><th>Dạng</th><th>Nghĩa</th><th>Ví dụ dùng</th></tr>
<tr><td><code>exec 3&gt;f</code></td><td>mở để ghi (xoá nội dung cũ)</td><td>một file báo cáo mới</td></tr>
<tr><td><code>exec 3&gt;&gt;f</code></td><td>mở để ghi nối</td><td>file log</td></tr>
<tr><td><code>exec 3&lt;f</code></td><td>mở để đọc</td><td>đọc file thứ hai trong vòng lặp</td></tr>
<tr><td><code>exec 3&lt;&gt;f</code></td><td>mở để đọc và ghi</td><td>một socket: <code>/dev/tcp/máy/cổng</code></td></tr>
<tr><td><code>exec {v}&gt;f</code></td><td>như trên, bash tự chọn số</td><td><code>flock -n "$v"</code> (Bài 13.4)</td></tr>
<tr><td><code>exec 3&gt;&amp;1</code></td><td>cho 3 trỏ vào đúng chỗ 1 đang trỏ LÚC NÀY</td><td>cất stdout trước khi chuyển hướng nó</td></tr>
<tr><td><code>exec 3&gt;&amp;-</code> · <code>exec {v}&gt;&amp;-</code></td><td>đóng</td><td>nhả khoá, kết thúc socket</td></tr>
<tr><td><code>exec &gt;f 2&gt;&amp;1</code></td><td>chuyển hướng phần còn lại của script</td><td>mọi thứ vào file log</td></tr>
</table>
<p>Hàng cuối có một biến thể rất hay dùng: ghi vào file <em>mà vẫn</em> hiện trên màn hình:</p>
<pre><code class="language-bash">#!/usr/bin/env bash
<span class="tok-comment"># ghi MỌI output của script vào nhat-ky.log VÀ màn hình</span>
exec &gt; &gt;(tee -a nhat-ky.log) 2&gt;&amp;1
echo "bắt đầu $(date +%T)"
ls /khong-co
echo "xong"</code></pre>
<div class="out">bắt đầu 16:32:11
ls: cannot access '/khong-co': No such file or directory
xong</div>
<p>File log nhận đúng ba dòng đó, kể cả dòng lỗi. Một dòng ở đầu script thay cho bốn mươi cái <code>| tee</code>. (Cái <code>&gt;(…)</code> trong đó là process substitution, giải thích ngay bên dưới.)</p>
<p>Bash còn hiểu hai đường dẫn đặc biệt KHÔNG có trên đĩa: <code>/dev/tcp/MÁY/CỔNG</code> và <code>/dev/udp/MÁY/CỔNG</code>. Mở chúng là mở một kết nối mạng. Thử với một máy chủ nhỏ ở cổng 19130 trong container:</p>
<pre><code class="language-bash">exec 3&lt;&gt;/dev/tcp/127.0.0.1/19130
printf 'HEAD / HTTP/1.0\\r\\nHost: localhost\\r\\n\\r\\n' &gt;&amp;3
head -3 &lt;&amp;3
exec 3&gt;&amp;-</code></pre>
<div class="out">HTTP/1.0 200 OK
Server: SimpleHTTP/0.6 Python/3.12.3
Date: Mon, 28 Sep 2026 16:32:12 GMT</div>
<p>Đây là cách kiểm "cổng có mở không?" rất tiện trong một container tối giản không có <code>curl</code> hay <code>nc</code> (health check — kiểm tra sống — có thể chỉ là <code>bash -c '&gt;/dev/tcp/127.0.0.1/5432'</code>). Nó là tính năng của BASH, không phải một file: zsh trả lời <code>no such file or directory: /dev/tcp/…</code>.</p>

<h3>Đổi chỗ stdout và stderr</h3>
${slide('lx-13', 10, 'Đổi chỗ stdout và stderr: fd 3 làm chỗ trung chuyển')}
<p>Ống dẫn chỉ chở stdout. Có lúc bạn cần điều ngược lại: đẩy <em>lỗi</em> qua ống (để đếm, để <code>grep</code>) trong khi output bình thường vẫn ra màn hình. Việc đó cần một phép đổi chỗ, mà đổi chỗ thì cần một ô tạm — y như đổi giá trị hai biến bằng biến thứ ba:</p>
<pre><code class="language-bash">f() { echo "dữ liệu (stdout)"; echo "lỗi (stderr)" &gt;&amp;2; }
f 3&gt;&amp;1 1&gt;&amp;2 2&gt;&amp;3 3&gt;&amp;- | sed 's/^/ỐNG NHẬN: /'</code></pre>
<div class="out">dữ liệu (stdout)
ỐNG NHẬN: lỗi (stderr)</div>
<p>Các phép chuyển hướng chạy <strong>từ TRÁI sang PHẢI</strong>, và mỗi phép chép "fd này đang trỏ đi đâu <em>ngay lúc này</em>". Ban đầu: 1 = ống tới <code>sed</code>, 2 = màn hình. <code>3&gt;&amp;1</code>: 3 = ống. <code>1&gt;&amp;2</code>: 1 = màn hình. <code>2&gt;&amp;3</code>: 2 = ống. <code>3&gt;&amp;-</code>: đóng ô tạm. Giờ lỗi đi vào ống, dữ liệu ra màn hình. Slide 10 vẽ từng bước.</p>
<div class="pitfall">Luật trái-sang-phải cũng là lý do <code>ls /khong-co 2&gt;&amp;1 &gt;out.txt</code> vẫn in lỗi ra màn hình: lúc <code>2&gt;&amp;1</code> chạy, fd 1 vẫn còn là terminal, nên fd 2 chép terminal; chỉ sau đó fd 1 mới chuyển sang file. Đo thật: lỗi hiện trên màn hình và <code>out.txt</code> rỗng. <code>ls /khong-co &gt;out2.txt 2&gt;&amp;1</code> thì đưa lỗi vào file. Thứ tự chính là ý nghĩa.</div>
<p>Cùng kỹ thuật đó hứng <em>riêng</em> stderr vào một biến, còn stdout vẫn đi qua:</p>
<pre><code class="language-bash">{ loi=$(f 2&gt;&amp;1 1&gt;&amp;3 3&gt;&amp;-); } 3&gt;&amp;1
echo "loi=[$loi]"</code></pre>
<div class="out">dữ liệu (stdout)
loi=[lỗi (stderr)]</div>
<p>Bên ngoài, <code>3&gt;&amp;1</code> cất stdout thật vào fd 3. Bên trong <code>$( )</code>, stdout là ống hứng; <code>2&gt;&amp;1</code> đưa lỗi vào ống hứng, rồi <code>1&gt;&amp;3</code> trả output thường về stdout thật đã cất. Đó là BashFAQ 002 gói trong một dòng — hữu ích khi một công cụ in phiên bản hay cảnh báo của nó ra stderr.</p>

<h3>Process substitution: &lt;(…) thật ra là gì</h3>
${slide('lx-13', 11, '<(lệnh) là một TÊN FILE trỏ vào một ống')}
<pre><code class="language-bash">echo &lt;(true)
ls -l &lt;(true) | awk '{print $1, $9, $10, $11}'
printf 'nginx\\ncurl\\ngit\\n' &gt; can.txt; printf 'git\\ncurl\\n' &gt; co.txt
diff &lt;(sort can.txt) &lt;(sort co.txt); echo "mã diff=$?"
seq 1 5 | tee &gt;(wc -l &gt; dem.txt) &gt;(gzip &gt; so.gz) &gt; /dev/null
sleep 0.2; echo "đếm=$(cat dem.txt)  gz=$(zcat so.gz | tr '\\n' ' ')"
cat &lt;(false; echo "trong"); echo "mã cat=$?"
exec 5&lt; &lt;(sleep 0.1; exit 3); wait $!; echo "mã &lt;( ) lấy bằng wait \\$!: $?"</code></pre>
<div class="out">/dev/fd/63
lr-x------ /dev/fd/63 -&gt; pipe:[3171670]
3d2
&lt; nginx
mã diff=1
đếm=5  gz=1 2 3 4 5
trong
mã cat=0
mã &lt;( ) lấy bằng wait $!: 3</div>
<p>Hai dòng đầu trả lời trọn câu hỏi: bash chạy lệnh với output nối vào một ống, giữ đầu đọc của ống thành một file descriptor (63), rồi thay <code>&lt;(…)</code> bằng cái <strong>tên</strong> <code>/dev/fd/63</code>. Lệnh bên ngoài chỉ thấy một tên file. Vì thế nó chạy được với những công cụ chỉ chịu nhận file — <code>diff</code>, <code>comm</code>, <code>join</code>, <code>paste</code> — và dùng được nhiều cái cùng lúc. <code>&gt;(…)</code> là ảnh gương: một tên file mà ghi vào thì thành stdin của một lệnh — ở đây một <code>seq</code> nuôi cùng lúc bộ đếm dòng và <code>gzip</code> (có <code>sleep 0.2</code> vì các lệnh trong <code>&gt;(…)</code> chạy nền và có thể vẫn đang ghi khi dòng kế tiếp bắt đầu).</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Ống</span><span class="lz-t">pipe()</span><span class="lz-d">Bash xin nhân một cái ống: một đầu ghi và một đầu đọc.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Lệnh chạy nền</span><span class="lz-t">sort can.txt</span><span class="lz-d">Khởi động với stdout nối vào đầu ghi.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Một cái tên</span><span class="lz-t">/dev/fd/63</span><span class="lz-d">Đầu đọc được giữ mở thành fd 63; chữ trong lệnh được thay bằng đường dẫn này.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Lệnh bên ngoài</span><span class="lz-t">diff /dev/fd/63 /dev/fd/62</span><span class="lz-d">Mở các "file" đó và đọc output đang chảy, một lần, từ đầu tới cuối.</span></div>
</div>
<p>Hai giới hạn đến từ chuyện "nó là một ống". Nó chỉ đọc được <strong>một lần, từ đầu tới cuối</strong>: chương trình nào muốn nhảy qua lại (seek) trong input hay đọc hai lần sẽ hỏng. Và <strong>mã thoát</strong> của lệnh bên trong <strong>bị mất</strong>: <code>cat &lt;(false; …)</code> trả 0. Từ bash 4.4, PID của nó nằm trong <code>$!</code>, nên <code>wait $!</code> lấy lại được mã — đo thật: 3. Còn với bài toán mất biến trong vòng lặp ở Bài 3.2, <code>done &lt; &lt;(lệnh)</code> vẫn là cách sửa chuẩn, vì khi đó vòng lặp chạy ngay trong shell hiện tại.</p>

<h3>Here-document ba kiểu, và here-string</h3>
${slide('lx-13', 12, 'Heredoc ba kiểu và here-string <<<')}
<pre><code class="language-bash">ten=Cường
cat &lt;&lt;EOF2
Xin chào $ten, hôm nay $(date +%F)
EOF2
cat &lt;&lt;'EOF2'
Xin chào $ten, hôm nay $(date +%F)
EOF2
if true; then
	cat &lt;&lt;-EOF2
	thụt bằng TAB — &lt;&lt;- xoá tab đầu dòng
	EOF2
fi
read -r a b c &lt;&lt;&lt; "một hai ba bốn"
echo "a=$a b=$b c=$c"
od -c &lt;&lt;&lt; "hi"</code></pre>
<div class="out">Xin chào Cường, hôm nay 2026-09-28
Xin chào $ten, hôm nay $(date +%F)
thụt bằng TAB — &lt;&lt;- xoá tab đầu dòng
a=một b=hai c=ba bốn
0000000   h   i  \\n
0000003</div>
<table>
<tr><th>Dạng</th><th>Có khai triển bên trong?</th><th>Dùng cho</th></tr>
<tr><td><code>&lt;&lt;EOF</code></td><td>có: <code>$biến</code>, <code>$(lệnh)</code>, <code>\\</code></td><td>mẫu văn bản điền bằng biến của bạn</td></tr>
<tr><td><code>&lt;&lt;'EOF'</code> (bọc nháy chữ kết thúc kiểu nào cũng được)</td><td>không — giữ nguyên từng ký tự</td><td>SQL, cấu hình nginx, script có chứa <code>$</code></td></tr>
<tr><td><code>&lt;&lt;-EOF</code></td><td>như <code>&lt;&lt;EOF</code>, và xoá <strong>TAB</strong> đầu dòng</td><td>heredoc thụt lề bên trong <code>if</code>/hàm</td></tr>
<tr><td><code>&lt;&lt;&lt; "chữ"</code></td><td>có; tự thêm một ký tự xuống dòng ở cuối</td><td>đưa một chuỗi cho <code>read</code>, <code>bc</code>, <code>grep</code></td></tr>
</table>
<p>Dạng có nháy là dạng chặn được lỗi thật. Một nhóm sinh cấu hình nginx bằng script:</p>
<pre><code class="language-bash">cat &lt;&lt;'EOF' &gt; site.conf
proxy_set_header Host $host;
EOF
cat site.conf
cat &lt;&lt;EOF
proxy_set_header Host $host;
EOF</code></pre>
<div class="out">proxy_set_header Host $host;
proxy_set_header Host ;</div>
<p>Không nháy, bash khai triển <code>$host</code> — một biến shell chưa đặt — thành rỗng, và nginx sẽ nhận <code>Host ;</code>. Còn <code>&lt;&lt;-</code> chỉ xoá <strong>TAB</strong>. Trình soạn thảo đổi TAB thành dấu cách là chữ kết thúc không còn ở đầu dòng nữa, và bash không bao giờ tìm thấy nó:</p>
<div class="out">b5.sh: line 6: warning: here-document at line 2 delimited by end-of-file (wanted &#96;EOF')
b5.sh: line 7: syntax error: unexpected end of file</div>
<p><code>&lt;&lt;&lt;</code> thêm đúng một ký tự xuống dòng (<code>od -c</code> cho thấy <code>h i \\n</code>), nên <code>grep -c . &lt;&lt;&lt; ""</code> thấy một dòng rỗng và in 0.</p>

<h3>Ống có tên và tiến trình đồng hành</h3>
${slide('lx-13', 13, 'mkfifo và coproc: hai tiến trình nói chuyện qua ống')}
<p>Ống dẫn thường <code>|</code> chỉ nối được những tiến trình khởi động cùng nhau trên một dòng lệnh. Một <strong>ống có tên</strong> (named pipe, FIFO) là ống có tên trong hệ thống file, nên hai chương trình không liên quan gì tới nhau vẫn gặp nhau ở đó được:</p>
<pre><code class="language-bash">mkfifo ong; ls -l ong | cut -c1-10
( sleep 1; echo "tin từ tiến trình ghi" &gt; ong ) &amp;
echo "đọc đang CHỜ…"
read -r tin &lt; ong
echo "nhận: $tin"
rm ong</code></pre>
<div class="out">prw-r--r--
đọc đang CHỜ…
nhận: tin từ tiến trình ghi</div>
<p>Chữ cái loại file là <code>p</code>. Mở một FIFO sẽ <strong>chặn</strong> (block) tới khi bên kia cũng mở — bên đọc đã chờ một giây để bên ghi tới. Không có byte dữ liệu nào nằm trên đĩa; cái tên chỉ là điểm hẹn. Dùng điển hình: nuôi một chương trình chạy lâu từ nhiều script, hoặc đưa cho một công cụ khăng khăng đòi tên file một luồng dữ liệu sống (chính là việc <code>&lt;(…)</code> tự làm giúp bạn).</p>
<p>Một <strong>coprocess</strong> (tiến trình đồng hành, bash 4.0+) là một lệnh chạy nền có <em>hai</em> ống: bạn ghi vào stdin của nó và đọc stdout của nó, như một cuộc hội thoại. Hợp khi muốn giữ MỘT chương trình tốn công khởi động sống suốt, thay vì mỗi câu hỏi lại khởi động một lần:</p>
<pre><code class="language-bash">coproc BC { bc -l; }
echo "PID coproc=$BC_PID, fd: \${BC[@]}"
echo "scale=4; 22/7" &gt;&amp;"\${BC[1]}"; read -r kq &lt;&amp;"\${BC[0]}"; echo "22/7 = $kq"
echo "2^64" &gt;&amp;"\${BC[1]}";          read -r kq &lt;&amp;"\${BC[0]}"; echo "2^64 = $kq"
exec {BC[1]}&gt;&amp;-; wait "$BC_PID"; echo "bc đã thoát, mã $?"</code></pre>
<div class="out">PID coproc=3801, fd: 63 60
22/7 = 3.1428
2^64 = 18446744073709551616
bc đã thoát, mã 0</div>
<p><code>\${BC[0]}</code> là đầu đọc (output của bc), <code>\${BC[1]}</code> là đầu ghi (input của bc). Đóng đầu ghi là báo cho <code>bc</code> "hết input", nó thoát và <code>wait</code> thu mã thoát. Cách kinh điển để làm treo script là <code>read</code> nhiều hơn một dòng so với số dòng coprocess sẽ in — không có gì tới và <code>read</code> chờ mãi mãi. Không chắc thì dùng <code>read -t 5</code>.</p>

<h3>Đọc tên file bất kỳ cho an toàn</h3>
${slide('lx-13', 14, 'Đọc tên file an toàn: 5 cách, 4 kết quả')}
<p>Tên file có thể chứa dấu cách, dấu cách ở đầu, gạch chéo ngược và thậm chí ký tự xuống dòng. Byte duy nhất nó KHÔNG thể chứa là NUL. Một thư mục thử có bốn cái tên hiểm — <code>bao cao.txt</code>, <code>␣␣hai-dau-cach.txt</code>, <code>-rf.txt</code> và một tên có ký tự xuống dòng ở giữa — và năm cách đếm chúng:</p>
<pre><code class="language-bash">n=0; find . -type f | while read -r f; do ((n++)); done; echo "1) find | while read     : n=$n"
n=0; while read -r f; do ((n++)); done &lt; &lt;(find . -type f); echo "2) &lt; &lt;(find)             : n=$n"
n=0; while IFS= read -r -d '' f; do ((n++)); done &lt; &lt;(find . -type f -print0); echo "3) -print0 + read -d ''  : n=$n"
shopt -s lastpipe; n=0; find . -type f -print0 | while IFS= read -r -d '' f; do ((n++)); done; echo "4) lastpipe              : n=$n"
mapfile -d '' -t ds &lt; &lt;(find . -type f -print0); echo "5) mapfile -d ''         : \${#ds[@]} phần tử"</code></pre>
<div class="out">1) find | while read     : n=0
2) &lt; &lt;(find)             : n=5
3) -print0 + read -d ''  : n=4
4) lastpipe              : n=4
5) mapfile -d ''         : 4 phần tử</div>
<p>(1) là vấn đề shell con của Bài 3.2. (2) chữa được shell con nhưng đọc theo <em>dòng</em>, nên cái tên có ký tự xuống dòng bị đếm hai lần. (3), (4) và (5) cùng ra đúng sự thật. Từng mảnh của (3):</p>
<table>
<tr><th>Mảnh</th><th>Vì sao</th><th>Thiếu nó thì (đo thật)</th></tr>
<tr><td><code>find … -print0</code></td><td>kết thúc mỗi tên bằng NUL — byte duy nhất tên file không chứa được</td><td>tên có xuống dòng bị chẻ đôi</td></tr>
<tr><td><code>read -d ''</code></td><td>đọc tới NUL thay vì tới xuống dòng</td><td>—</td></tr>
<tr><td><code>IFS=</code></td><td>không cắt dấu cách đầu/cuối</td><td><code>"␣␣thụt lề"</code> → <code>[thụt lề]</code></td></tr>
<tr><td><code>-r</code></td><td>giữ nguyên gạch chéo ngược</td><td><code>a\\tb</code> → <code>[atb]</code></td></tr>
<tr><td><code>&lt; &lt;(…)</code> (hoặc <code>lastpipe</code>)</td><td>vòng lặp chạy trong shell hiện tại</td><td>biến đếm vẫn là 0</td></tr>
</table>
<p>Thêm một cái bẫy thật: file văn bản mà dòng cuối không có ký tự xuống dòng (hay gặp với file lưu từ trình soạn thảo trên Windows hoặc sinh bằng <code>printf</code>). <code>while read -r x</code> lặng lẽ bỏ dòng đó, vì <code>read</code> trả mã khác 0 khi gặp hết file dù đã điền vào <code>x</code>. Cách sửa là <code>while read -r x || [[ -n $x ]]</code> — đo thật: bản thiếu nó không in gì với <code>printf 'dòng không có xuống dòng'</code>, bản đã sửa in ra dòng đó.</p>
<p>Và chính <code>IFS</code> (Internal Field Separator — ký tự tách trường), dùng cho đúng — chỉ cho MỘT lệnh, không bao giờ toàn cục:</p>
<pre><code class="language-bash">IFS=, read -r -a b &lt;&lt;&lt; "x,y z,,w"; declare -p b
IFS=: read -r u _ uid _ &lt;&lt;&lt; "an:x:1001:1001"; echo "$u $uid"
a=(web db "cache redis"); (IFS=,; echo "\${a[*]}")    <span class="tok-comment"># nối bằng dấu phẩy trong một shell con</span></code></pre>
<div class="out">declare -a b=([0]="x" [1]="y z" [2]="" [3]="w")
an 1001
web,db,cache redis</div>
<p>Tách bằng dấu phẩy thì giữ được dấu cách trong <code>y z</code> và trường rỗng giữa <code>,,</code>. <code>"\${a[*]}"</code> nối bằng ký tự ĐẦU của <code>IFS</code> — đúng luật đã làm vỡ output <code>--dry-run</code> ở Bài 7.5 — nên đặt nó trong <code>( )</code> để thay đổi không lan ra phần còn lại của script.</p>

<h3>Chạy thử từng bước</h3>
<ol>
<li><code>exec {x}&gt;/tmp/thu.txt; echo "$x"; ls -l /proc/$$/fd/$x; exec {x}&gt;&amp;-</code> — xem số bash chọn và nó trỏ đi đâu.</li>
<li><code>ls /khong-co 3&gt;&amp;1 1&gt;&amp;2 2&gt;&amp;3 | wc -l</code> — dòng lỗi được đếm (1).</li>
<li><code>echo &lt;(true); diff &lt;(printf 'a\\nb\\n') &lt;(printf 'a\\nc\\n')</code>.</li>
<li><code>h=example; cat &lt;&lt;EOF</code> … <code>$h</code> … <code>EOF</code>, rồi làm lại với <code>&lt;&lt;'EOF'</code>.</li>
<li><code>mkfifo /tmp/p; (sleep 2; date &gt; /tmp/p) &amp; cat /tmp/p; rm /tmp/p</code> — nhìn <code>cat</code> chờ.</li>
<li><code>mkdir t; touch t/"a b" t/$'x\\ny'; find t -type f -print0 | tr -cd '\\0' | wc -c</code> → 2, trong khi <code>find t -type f | wc -l</code> → 3.</li>
</ol>

<h3>Trên macOS và WSL khác gì</h3>
<table>
<tr><th>Thứ trong bài</th><th>Ubuntu / WSL2</th><th>Mac <code>/bin/bash</code> 3.2 (đo thật)</th></tr>
<tr><td><code>exec {log}&gt;&gt;f</code></td><td>fd 10</td><td><code>exec: {log}: not found</code></td></tr>
<tr><td><code>exec 3&gt;f</code>, đổi chỗ fd, <code>&lt;(…)</code>, heredoc, <code>&lt;&lt;&lt;</code></td><td>chạy được</td><td>chạy được</td></tr>
<tr><td><code>/dev/tcp/127.0.0.1/CỔNG</code></td><td>chạy được</td><td>chạy được trong bash; zsh: <code>no such file or directory</code></td></tr>
<tr><td><code>coproc</code></td><td>chạy được</td><td><code>coproc: command not found</code></td></tr>
<tr><td><code>shopt -s lastpipe</code></td><td>chạy được</td><td><code>invalid shell option name</code></td></tr>
<tr><td><code>read -r -d ''</code></td><td>chạy được</td><td>chạy được — lựa chọn chạy khắp nơi</td></tr>
<tr><td><code>mapfile -d ''</code></td><td>chạy được</td><td>không có <code>mapfile</code></td></tr>
<tr><td><code>ls -l /proc/$$/fd</code></td><td>chạy được</td><td>macOS không có <code>/proc</code>; dùng <code>lsof -p $$</code></td></tr>
</table>
<p>Với script phải chạy trên bash gốc của Mac, vòng <code>while IFS= read -r -d '' f; do …; done &lt; &lt;(find … -print0)</code> là dạng chạy được ở mọi nơi. WSL2 cư xử như Ubuntu, với một lưu ý từ Bài 7.1: file sửa ở phía Windows có thể mang ký tự xuống dòng CRLF, và khi đó <code>read</code> giữ một <code>\\r</code> ở cuối mỗi dòng.</p>

<h3>Khi nào dùng cái nào</h3>
<ul>
<li><strong><code>exec {fd}</code></strong> cho mọi bộ mô tả sống lâu (khoá, log kiểm toán, socket); số <code>3</code> viết tay chỉ cho những dòng lệnh ngắn.</li>
<li><strong><code>&lt;(…)</code></strong> khi công cụ cần tên file mà bạn chỉ có lệnh; <strong>không</strong> dùng khi công cụ phải nhảy qua lại hay đọc lại input, hoặc khi bạn cần mã thoát mà không muốn <code>wait $!</code>.</li>
<li><strong><code>&lt;&lt;'EOF'</code></strong> là mặc định cho mọi file sinh ra có chứa <code>$</code>; không nháy chỉ khi thật sự muốn khai triển.</li>
<li><strong>FIFO</strong> cho hai chương trình độc lập; <strong><code>coproc</code></strong> cho một cuộc hội thoại với một trợ thủ sống lâu; lớn hơn nữa thì dùng ngôn ngữ thật hoặc hàng đợi tin nhắn.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> <code>deploy.sh</code> của nhóm chỉ in ra màn hình, và sau một đêm chạy hỏng không ai dựng lại được chuyện gì đã xảy ra; file cấu hình nginx nó sinh ra thì mất biến. Sửa cả hai trong <code>~/thu-linux/ch13</code> (hoặc container <code>ubuntu:24.04</code>).</p><ol>
<li>Ở đầu một <code>deploy.sh</code> mới, thêm <code>exec &gt; &gt;(tee -a deploy.log) 2&gt;&amp;1</code>; cho nó in một dòng bắt đầu, chạy <code>ls /khong-co</code> (một lệnh hỏng, tạm chưa bật <code>set -e</code>) và in một dòng kết thúc.</li>
<li>Mở một bộ mô tả kiểm toán bằng <code>exec {audit}&gt;&gt;audit.log</code> và ghi mỗi bước một dòng vào <code>&gt;&amp;$audit</code>; đóng nó ở cuối.</li>
<li>Sinh <code>site.conf</code> bằng heredoc chứa <code>proxy_set_header Host $host;</code> — lần đầu không nháy, xem kết quả, rồi làm lại với <code>&lt;&lt;'EOF'</code>.</li>
<li>Tạo thư mục <code>logs/</code> có ba file, một file có ký tự xuống dòng trong tên (<code>touch logs/$'a\\nb.log'</code>), và đếm chúng bằng vòng <code>while IFS= read -r -d ''</code> nạp từ <code>&lt; &lt;(find logs -type f -print0)</code>.</li></ol>
<p><strong>Đạt khi:</strong> <code>deploy.log</code> có dòng bắt đầu, dòng lỗi của <code>ls</code> và dòng kết thúc; <code>audit.log</code> có mỗi bước một dòng; <code>grep -c '\\$host' site.conf</code> in 1; và vòng lặp của bạn in 3 trong khi <code>find logs -type f | wc -l</code> in 4.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">File descriptor (bộ mô tả file, fd)</span><span class="v">Một số nguyên nhỏ gọi tên một file, ống hay socket đang mở trong bảng của tiến trình; 0/1/2 là stdin/stdout/stderr.</span></div>
  <div class="kv"><span class="k">Chuyển hướng bằng <code>exec</code></span><span class="v"><code>exec</code> chỉ kèm chuyển hướng thì đổi bảng fd của chính shell hiện tại cho phần còn lại của script.</span></div>
  <div class="kv"><span class="k">Duplicating (nhân bản fd, <code>n&gt;&amp;m</code>)</span><span class="v">Cho fd n trỏ vào đúng chỗ fd m đang trỏ tại thời điểm đó.</span></div>
  <div class="kv"><span class="k">Process substitution (thay thế tiến trình)</span><span class="v"><code>&lt;(lệnh)</code> / <code>&gt;(lệnh)</code>: một tên file <code>/dev/fd/N</code> nối với một lệnh qua ống.</span></div>
  <div class="kv"><span class="k">Here-document (tài liệu tại chỗ)</span><span class="v">Các dòng tới chữ kết thúc được đưa vào làm stdin; bọc nháy chữ kết thúc là tắt khai triển.</span></div>
  <div class="kv"><span class="k">Here-string (chuỗi tại chỗ)</span><span class="v"><code>&lt;&lt;&lt; chữ</code>: một chuỗi kèm một xuống dòng làm stdin.</span></div>
  <div class="kv"><span class="k">FIFO / named pipe (ống có tên)</span><span class="v">Ống có tên trong hệ thống file (<code>mkfifo</code>, loại <code>p</code>); mở ra thì chặn tới khi đủ hai phía.</span></div>
  <div class="kv"><span class="k">Coprocess (tiến trình đồng hành)</span><span class="v">Lệnh chạy nền nối với shell bằng hai ống, tạo bằng <code>coproc</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>fd là một hàng trong bảng file đang mở của tiến trình; <code>exec {v}&gt;f</code> mở một cái ở số trống, <code>exec {v}&gt;&amp;-</code> đóng nó.</li>
<li>Chuyển hướng chạy từ trái sang phải và chép đích hiện tại: <code>3&gt;&amp;1 1&gt;&amp;2 2&gt;&amp;3 3&gt;&amp;-</code> đổi chỗ stdout và stderr.</li>
<li><code>&lt;(lệnh)</code> là tên file <code>/dev/fd/63</code> đứng sau là một ống: đọc một lần, mã thoát chỉ lấy được bằng <code>wait $!</code>.</li>
<li>Bọc nháy chữ heredoc (<code>&lt;&lt;'EOF'</code>) mỗi khi văn bản chứa <code>$</code>; <code>&lt;&lt;-</code> xoá TAB, không xoá dấu cách.</li>
<li>FIFO cho các tiến trình không liên quan gặp nhau; <code>coproc</code> giữ một trợ thủ sống để hỏi–đáp hai chiều.</li>
<li>Tên file bất kỳ: <code>find -print0</code> + <code>while IFS= read -r -d ''</code> + <code>&lt; &lt;(…)</code> — dạng duy nhất chạy được cả trên Mac.</li>
</ul>

<a class="link-card" href="https://mywiki.wooledge.org/BashFAQ/002" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">BashFAQ 002 — hứng riêng stdout và stderr</span><span class="lc-sub">Phép tung hứng fd đứng sau "chỉ stderr vào biến", giải thích từng phép chuyển hướng.</span></span>
</a>
<a class="link-card" href="https://mywiki.wooledge.org/ProcessSubstitution" target="_blank" rel="noopener">
  <span class="lc-ico">🔁</span>
  <span class="lc-body"><span class="lc-title">Greg's Wiki — Process Substitution</span><span class="lc-sub"><code>&lt;(…)</code> và <code>&gt;(…)</code> được làm ra thế nào, giới hạn của chúng, và các cách thay thế chạy được mọi nơi.</span></span>
</a>
<a class="link-card" href="https://mywiki.wooledge.org/BashFAQ/020" target="_blank" rel="noopener">
  <span class="lc-ico">📂</span>
  <span class="lc-body"><span class="lc-title">BashFAQ 020 — tên file có dấu cách và xuống dòng</span><span class="lc-sub">Vì sao <code>-print0</code> + <code>read -d ''</code> là câu trả lời, và mọi câu trả lời sai hấp dẫn.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man7/fifo.7.html" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">fifo(7) — man7.org</span><span class="lc-sub">Ống có tên dưới con mắt của nhân, và vì sao mở nó lại bị chặn.</span></span>
</a>
<p class="note-ct"><strong>Thói quen mang về:</strong> hình dung bảng fd trước khi viết một phép chuyển hướng. Mọi <code>&gt;</code>, <code>2&gt;&amp;1</code>, <code>&lt;(…)</code> hay <code>exec</code> chỉ là "cho hàng N trỏ tới chỗ kia" — đọc chúng từ trái sang phải là hết thấy phép màu.</p>
</div>
`,
    },
    /* ─────────────────────────── 13.3 ─────────────────────────── */
    {
      title: "13.3 — Parallel and fast: forks, xargs -P, wait -n, GNU parallel and measuring|||13.3 — Chạy song song và nhanh: fork, xargs -P, wait -n, GNU parallel và cách đo",
      slug: "lnx-13-3-song-song-toc-do",
      type: "LESSON",
      isFreePreview: true,
      description: "Vì sao một vòng lặp 10.000 lần gọi $(…) mất 7 giây còn bản builtin mất 0,04 giây, một lần awk thay 20.000 lần gọi, xargs -P và cái bẫy thiếu -n1, hàng đợi N việc tự viết bằng wait -n, GNU parallel, và đo cho đúng bằng time, hyperfine, $EPOCHREALTIME.",
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.3</span>
<h2>Parallel and fast: forks, xargs -P, wait -n, GNU parallel and measuring</h2>
<p class="lead">A script that takes 30 seconds instead of 0.03 is usually not doing "too much work" — it is starting a new process thousands of times. This lesson measures exactly what that costs, shows the two rewrites that fix almost every slow script (builtins instead of <code>$(…)</code>, and one <code>awk</code> instead of a loop), and then spreads real work over every CPU core with <code>xargs -P</code>, a hand-written <code>wait -n</code> queue and GNU <code>parallel</code>. Every number here was measured, and the lesson ends with how to measure your own.</p>

<h3>Why you need this</h3>
<p>Lesson 6.5 measured four <code>sleep 1</code> jobs: 4 s one after another, 1 s with <code>&amp;</code> + <code>wait</code>, 2 s through <code>xargs -P 4</code> for eight. That was about <em>waiting</em>. Real scripts are slow for a different reason: a nightly job that processes the day's logs line by line, calling <code>date</code>, <code>basename</code> or <code>sed</code> for each line, and grows from two minutes to forty as the site grows. The fix is rarely a faster machine; it is knowing where the time goes.</p>

<h3>What one fork costs</h3>
${slide('lx-13', 15, 'Mỗi $(…) là một fork: 10.000 vòng, đo thật')}
<p>Every <code>$(…)</code> makes bash <strong>fork</strong> — duplicate the whole shell process — and, if the command is not a builtin, <strong>exec</strong> a new program in the copy. Each loop below runs 10,000 times; the time is taken with <code>$EPOCHREALTIME</code> before and after (explained at the end of the lesson):</p>
<pre><code class="language-bash">#!/usr/bin/env bash
N=\${1:-10000}
f=/srv/app/releases/2026-09-28/app.tar.gz
l1() { for ((i=0;i&lt;N;i++)); do b=$(basename "$f"); done; }
l2() { for ((i=0;i&lt;N;i++)); do b=\${f##*/}; done; }
l3() { for ((i=0;i&lt;N;i++)); do d=$(date +%H:%M:%S); done; }
l4() { for ((i=0;i&lt;N;i++)); do printf -v d '%(%H:%M:%S)T' -1; done; }
l5() { for ((i=0;i&lt;N;i++)); do s=$(echo "$f" | sed 's/tar/zip/'); done; }
l6() { for ((i=0;i&lt;N;i++)); do s=\${f/tar/zip}; done; }
l7() { for ((i=0;i&lt;N;i++)); do k=$(expr $i + 1); done; }
l8() { for ((i=0;i&lt;N;i++)); do (( k = i + 1 )); done; }
<span class="tok-comment"># … each function timed with $EPOCHREALTIME and printed</span></code></pre>
<div class="out">$(basename "$f")                      6.430 s
\${f##*/}                              0.045 s
$(date +%H:%M:%S)                     7.324 s
printf -v d '%(%T)T' -1               0.121 s
$(echo "$f" | sed …)               14.861 s
\${f/tar/zip}                          0.039 s
$(expr $i + 1)                        7.852 s
(( k = i + 1 ))                       0.027 s</div>
<p>Each pair does the same job. The external version is 60 to 380 times slower, and the sed version — a pipe inside a substitution, so two extra processes — is the slowest of all. Is it because <code>basename</code> is slow? A second measurement isolates the cost:</p>
<table>
<tr><th>10,000 × …</th><th>What it costs</th><th>Ubuntu (container)</th></tr>
<tr><td><code>true</code></td><td>a builtin, no process</td><td>0.026 s</td></tr>
<tr><td><code>printf -v v x</code></td><td>builtin, result into a variable</td><td>0.040 s</td></tr>
<tr><td><code>v=$(printf x)</code></td><td>builtin, but inside <code>$( )</code> ⇒ fork</td><td>3.403 s</td></tr>
<tr><td><code>/bin/true</code></td><td>fork + exec of a tiny program</td><td>4.022 s</td></tr>
</table>
<p>So roughly 0.34 ms per fork and 0.4 ms per fork+exec on this machine — the program itself hardly matters. <code>$(printf x)</code> is a builtin and still costs 85 times more than <code>printf -v</code>, purely because of the subshell. On the Fedora 44 machine (bash 5.3) the fork cost is even higher: <code>$(basename "$f")</code> took 11.9 s for the same 10,000 iterations.</p>
<p>The replacements, all from Chapter 6 or bash builtins:</p>
<table>
<tr><th>Instead of (forks)</th><th>Write (no fork)</th><th>Lesson</th></tr>
<tr><td><code>$(basename "$f")</code> · <code>$(dirname "$f")</code></td><td><code>\${f##*/}</code> · <code>\${f%/*}</code></td><td>6.3</td></tr>
<tr><td><code>$(echo "$s" | sed 's/a/b/')</code></td><td><code>\${s/a/b}</code>, <code>\${s//a/b}</code></td><td>6.3</td></tr>
<tr><td><code>$(echo "$s" | tr a-z A-Z)</code></td><td><code>\${s^^}</code></td><td>6.3</td></tr>
<tr><td><code>$(expr $i + 1)</code> · <code>$(echo "$a+$b" | bc)</code> for integers</td><td><code>(( i + 1 ))</code> · <code>$(( a + b ))</code></td><td>6.1</td></tr>
<tr><td><code>$(date +%F)</code> inside a loop</td><td><code>printf -v today '%(%F)T' -1</code> (bash 4.2+)</td><td>here</td></tr>
<tr><td><code>x=$(printf '%05d' "$n")</code></td><td><code>printf -v x '%05d' "$n"</code></td><td>here</td></tr>
<tr><td><code>$(cat file)</code></td><td><code>$(&lt; file)</code> — still a subshell, but no <code>cat</code> process</td><td>—</td></tr>
<tr><td><code>[[ $(echo "$s" | grep -c x) -gt 0 ]]</code></td><td><code>[[ $s == *x* ]]</code> or <code>[[ $s =~ x ]]</code></td><td>6.4</td></tr>
</table>
<p>Bash 5.3 (on Fedora 44, not yet on Ubuntu 24.04's 5.2) adds a command substitution that does not fork at all: <code>\${ cmd; }</code>. Measured on Fedora: 10,000 × <code>$(printf x)</code> 6.107 s, <code>\${ printf x; }</code> 0.112 s, <code>printf -v</code> 0.022 s. On bash 5.2 it is <code>bad substitution</code>, so do not rely on it in scripts meant for Ubuntu 24.04 yet.</p>

<h3>One awk instead of twenty thousand</h3>
${slide('lx-13', 16, 'Một lần awk thay 20.000 lần gọi awk')}
<p>The same principle at the scale of a whole file. Summing the byte-count column (field 10) of a 20,000-line access log three ways:</p>
<pre><code class="language-bash"><span class="tok-comment"># tong2.sh — one pipe and one awk PER LINE</span>
tong=0
while read -r line; do b=$(echo "$line" | awk '{print $10}'); (( tong += b )); done &lt; a20k.log
echo "$tong"

<span class="tok-comment"># tong1.sh — pure bash: read -a splits the fields, no process at all</span>
tong=0
while read -r -a c; do (( tong += c[9] )); done &lt; a20k.log
echo "$tong"

<span class="tok-comment"># one program reads the whole file</span>
awk '{s += $10} END {print s}' a20k.log</code></pre>
<div class="out">90919365
90919365</div>
<table>
<tr><th>Version</th><th>Mean (hyperfine, 3 runs)</th><th>Relative</th></tr>
<tr><td>awk inside the loop (≥ 40,000 forks)</td><td>33.292 s ± 3.152</td><td>≈ 2,800× slower</td></tr>
<tr><td><code>while read -r -a</code> (pure bash)</td><td>154.5 ms ± 6.4</td><td>13× slower</td></tr>
<tr><td><code>awk</code> once</td><td>11.8 ms ± 1.0</td><td>fastest</td></tr>
</table>
<p>Same answer, 33 seconds versus 12 milliseconds. The pure-bash loop is respectable for a few thousand lines — no forks — but the interpreter is still doing per-line work that awk does in C. The rule that follows: <strong>never call an external program inside a loop over data</strong>. Hand the whole stream to one <code>awk</code>, <code>sed</code>, <code>sort</code> or <code>jq</code>, and keep bash for deciding what runs in which order.</p>

<h3>xargs -P, and the trap of forgetting -n</h3>
${slide('lx-13', 17, 'xargs -P: thiếu -n1 thì -P không có gì để chia')}
<p>When the work per item really is heavy — compressing a file, resizing an image, calling an API — the answer is to run several items at once. Sixteen log files of about 6 MB each, compressed with <code>gzip -9</code> on a 10-CPU container:</p>
<pre><code class="language-bash"><span class="tok-comment"># tuantu.sh — one after another</span>
for f in *.txt; do gzip -9 -k -- "$f"; done
<span class="tok-comment"># song.sh — P at a time, ONE file per gzip</span>
printf '%s\\0' *.txt | xargs -0 -n1 -P"\${P:-4}" gzip -9 -k --
<span class="tok-comment"># mot.sh — -P10 but no -n</span>
printf '%s\\0' *.txt | xargs -0 -P10 gzip -9 -k --</code></pre>
<table>
<tr><th>Command</th><th>Mean (hyperfine, 2 runs)</th><th>Speed-up</th></tr>
<tr><td><code>for</code> loop</td><td>4.280 s</td><td>1×</td></tr>
<tr><td><code>xargs -0 -n1 -P2</code></td><td>2.226 s</td><td>1.9×</td></tr>
<tr><td><code>xargs -0 -n1 -P4</code></td><td>1.156 s</td><td>3.7×</td></tr>
<tr><td><code>xargs -0 -n1 -P10</code></td><td>0.742 s</td><td>5.8×</td></tr>
<tr><td><code>xargs -0 -P10</code> (no <code>-n</code>)</td><td>4.397 s</td><td>≈ 1× — no gain</td></tr>
</table>
<p>The last row is the trap. Without <code>-n</code>, xargs packs as many names as fit into <strong>one</strong> command line — all sixteen went to a single <code>gzip</code> — so <code>-P10</code> had exactly one job to run. <code>-n1</code> (or <code>-n 4</code>, <code>-L 1</code>, <code>-I{}</code>) splits the input into many invocations for the slots to share. Measured on the Mac as well: eight <code>sleep 1</code> through <code>xargs -0 -n1 -P4</code> took 2.04 s, while four through <code>xargs -0 -P4</code> without <code>-n</code> took 4.02 s — one <code>sleep 1 1 1 1</code>.</p>
<p>Also notice why P10 is not 10× faster: 16 jobs on 10 slots means two waves (10, then 6), and compression is limited by the CPUs Docker gives the container. <code>time</code> shows the parallelism directly: the sequential run had <code>real 6.262s, user 6.133s</code>; the parallel run <code>real 0.801s, user 6.078s</code> — the same CPU work, spread over many cores at once.</p>
<table>
<tr><th>xargs flag</th><th>Meaning</th><th>Note</th></tr>
<tr><td><code>-0</code></td><td>input items end with NUL</td><td>pair with <code>find -print0</code> / <code>printf '%s\\0'</code></td></tr>
<tr><td><code>-n N</code></td><td>at most N arguments per command</td><td><strong>required</strong> for <code>-P</code> to help</td></tr>
<tr><td><code>-P N</code></td><td>run up to N commands at once</td><td><code>-P 0</code> = as many as possible (GNU)</td></tr>
<tr><td><code>-I{}</code></td><td>replace <code>{}</code> with each item; one item per command</td><td>when the name is not the last argument</td></tr>
<tr><td><code>-r</code></td><td>do nothing on empty input</td><td>GNU runs the command once on empty input; BSD does not</td></tr>
<tr><td><code>-t</code></td><td>print each command before running it</td><td>a dry run with <code>echo</code></td></tr>
</table>
<div class="pitfall">Parallel jobs share one terminal and interleave their output line by line. Three jobs printing three lines each through <code>xargs -n1 -P3</code> came out as <code>việc 1 dòng 1</code>, <code>việc 2 dòng 1</code>, <code>việc 3 dòng 1</code>, <code>việc 2 dòng 2</code>, <code>việc 1 dòng 2</code>… — readable for three lines, useless for a real log. Give every job its own output file (<code>sh -c 'cmd "$1" &gt; "$1.log"' _ {}</code>), or use GNU <code>parallel</code>, which buffers each job's output by default and prints it in one piece. Never let parallel jobs append to the same file.</div>
<p>How many at once? <code>nproc</code> prints the usable CPUs on Linux (10 here); <code>getconf _NPROCESSORS_ONLN</code> works on both Linux and macOS (the Mac has no <code>nproc</code>). For CPU-bound work use about that many; for network-bound work (downloads, API calls) more is fine, but respect the other side's rate limit.</p>

<h3>wait -n: your own job queue that knows which job failed</h3>
${slide('lx-13', 18, 'wait -n: tự viết hàng đợi 3 làn, biết việc nào hỏng')}
<p>xargs is ideal when every job is "one command on one item". When each job is a bash function, or you must know <em>which</em> job failed, write the queue yourself. <code>wait -n</code> (bash 4.3+) waits for <em>any one</em> background job to finish and returns its exit status; <code>-p var</code> (bash 5.1+) also stores which PID it was.</p>
<pre><code class="language-bash">#!/usr/bin/env bash
<span class="tok-comment"># 7 việc, tối đa 3 việc cùng lúc; biết việc nào hỏng</span>
max=3 dang=0 loi=0 t0=$EPOCHREALTIME
declare -A ten                          <span class="tok-comment"># PID -&gt; job number (Lesson 13.1)</span>
viec() { sleep "$2"; [[ $1 != 5 ]]; }   <span class="tok-comment"># job 5 fails on purpose</span>
cho_mot() {                             <span class="tok-comment"># wait for ANY one job</span>
  wait -n -p pid; local rc=$?
  (( dang-- ))
  (( rc )) &amp;&amp; { echo "  việc \${ten[$pid]} HỎNG (mã $rc)"; loi=1; }
}
for i in 1 2 3 4 5 6 7; do
  (( dang &gt;= max )) &amp;&amp; cho_mot
  viec "$i" "0.$(( i % 3 + 4 ))" &amp; ten[$!]=$i; (( dang++ ))
  printf '%.1fs  bắt đầu việc %s\\n' "$(bc &lt;&lt;&lt; "$EPOCHREALTIME - $t0")" "$i"
done
while (( dang &gt; 0 )); do cho_mot; done
printf '%.1fs  xong hết, loi=%s\\n' "$(bc &lt;&lt;&lt; "$EPOCHREALTIME - $t0")" "$loi"
exit "$loi"</code></pre>
<div class="out">0.0s  bắt đầu việc 1
0.0s  bắt đầu việc 2
0.0s  bắt đầu việc 3
0.4s  bắt đầu việc 4
0.5s  bắt đầu việc 5
0.6s  bắt đầu việc 6
0.9s  bắt đầu việc 7
  việc 5 HỎNG (mã 1)
1.4s  xong hết, loi=1</div>
<p>Read the timestamps with slide 18's picture: jobs 1–3 start at once; job 3 (0.4 s) finishes first, freeing a slot for job 4 at 0.4 s; job 1 frees one for job 5 at 0.5 s; and so on. Job 5 fails, the queue reports it by name, and the script exits 1 so cron or CI sees the failure. ShellCheck is silent on this script.</p>
<div class="callout warn">Two traps hide here. A bare <code>wait</code> (no arguments) returns <strong>0</strong> even when jobs failed — measured: <code>(exit 3) &amp; false &amp; wait; echo $?</code> prints 0 — so a queue built on it reports success. And the counters use <code>(( dang++ ))</code> <em>without</em> <code>set -e</code> on purpose: when <code>dang</code> is 0, <code>(( dang++ ))</code> evaluates to 0, returns status 1, and under <code>set -e</code> the script dies on the spot (measured in the quiz). With <code>set -e</code> write <code>dang=$((dang + 1))</code>.</div>

<h3>GNU parallel</h3>
${slide('lx-13', 19, 'GNU parallel: giữ thứ tự, gắn nhãn, ghi nhật ký')}
<p><code>parallel</code> is xargs -P with the features you end up wanting: output kept in input order, each line tagged with its input, a job log, retries, several input sources. Install with <code>sudo apt install parallel</code> (Homebrew: <code>brew install parallel</code>). The first run asks you to acknowledge its academic citation; <code>parallel --citation</code> or creating <code>~/.parallel/will-cite</code> silences it for good. (Ubuntu's <code>moreutils</code> package ships a different, simpler program also called <code>parallel</code>; check <code>parallel --version</code> says "GNU parallel".)</p>
<pre><code class="language-bash">parallel -j3 "sleep 0.\\$((4 - {} % 3)); echo việc {}" ::: 1 2 3 4 5 6       <span class="tok-comment"># finished-first order</span>
parallel -k -j3 "sleep 0.\\$((4 - {} % 3)); echo việc {}" ::: 1 2 3 4 5 6    <span class="tok-comment"># -k: input order</span>
parallel --tag -j2 "echo {.}.gz; echo {/}" ::: "/tmp/a b.txt" /var/log/x.log
parallel -j2 --joblog nk.tsv "exit {}" ::: 0 1 0 2; echo "mã parallel=$?"
cut -f1,4,7,9 nk.tsv
parallel echo {1}-{2} ::: a b ::: 1 2</code></pre>
<div class="out">việc 2
việc 1
việc 3
việc 5
việc 4
việc 6
việc 1
việc 2
việc 3
việc 4
việc 5
việc 6
/tmp/a b.txt	/tmp/a b.gz
/tmp/a b.txt	a b.txt
/var/log/x.log	/var/log/x.gz
/var/log/x.log	x.log
mã parallel=2
Seq	JobRuntime	Exitval	Command
1	     0.003	0	exit 0
2	     0.003	1	exit 1
3	     0.001	0	exit 0
4	     0.001	2	exit 2
a-1
a-2
b-1
b-2</div>
<table>
<tr><th>Piece</th><th>Meaning</th></tr>
<tr><td><code>::: a b c</code></td><td>the inputs; two <code>:::</code> groups give every combination</td></tr>
<tr><td><code>-j N</code></td><td>N jobs at once (default: one per CPU)</td></tr>
<tr><td><code>-k</code></td><td>print outputs in input order, not finishing order</td></tr>
<tr><td><code>{}</code> · <code>{.}</code> · <code>{/}</code> · <code>{//}</code></td><td>the input · without extension · basename · dirname — spaces are quoted for you</td></tr>
<tr><td><code>--tag</code></td><td>prefix each output line with its input</td></tr>
<tr><td><code>--joblog f</code></td><td>one line per job: runtime, exit value, command</td></tr>
<tr><td>exit status</td><td>the number of failed jobs (here 2), 0 if all succeeded</td></tr>
</table>

<h3>Measure, do not guess: time, hyperfine, $EPOCHREALTIME</h3>
${slide('lx-13', 20, 'Đo cho đúng: real, user và hyperfine')}
<pre><code class="language-bash">time bash tuantu.sh
time P=10 bash song.sh
TIMEFORMAT="%Rs thực, %Us user, %Ss sys"; time sleep 0.3</code></pre>
<div class="out">real	0m6.262s
user	0m6.133s
sys	0m0.128s

real	0m0.801s
user	0m6.078s
sys	0m0.072s
0.305s thực, 0.001s user, 0.000s sys</div>
<table>
<tr><th>Column</th><th>Meaning</th><th>How to read it</th></tr>
<tr><td><code>real</code></td><td>wall-clock time</td><td>what the user waits</td></tr>
<tr><td><code>user</code></td><td>CPU time in the program's own code, summed over all cores</td><td><code>user &gt; real</code> ⇒ it really ran in parallel</td></tr>
<tr><td><code>sys</code></td><td>CPU time in the kernel on its behalf</td><td>high ⇒ many forks, much I/O</td></tr>
<tr><td><code>real ≫ user + sys</code></td><td>—</td><td>the program was <em>waiting</em>: network, disk, <code>sleep</code></td></tr>
</table>
<p><code>time</code> here is a bash <strong>keyword</strong>, not the <code>/usr/bin/time</code> program: it times a whole pipeline and obeys <code>TIMEFORMAT</code>. One run is not a measurement, though. The same <code>tuantu.sh</code> averaged 4.28 s under hyperfine but took 6.26 s in the single <code>time</code> run above. <code>hyperfine</code> runs each command many times and reports the mean and spread:</p>
<pre><code class="language-bash">hyperfine -w 1 -r 5 -N ./demip.sh "awk '{d[\\$1]++} END {for (k in d) print d[k], k}' access.log"</code></pre>
<div class="out">Benchmark 1: ./demip.sh
  Time (mean ± σ):      1.732 s ±  0.194 s    [User: 1.465 s, System: 0.269 s]
  Range (min … max):    1.595 s …  2.067 s    5 runs
Benchmark 2: awk …
  Time (mean ± σ):      57.9 ms ±  10.7 ms    [User: 49.3 ms, System: 11.3 ms]
…
Summary
  awk … ran 29.91 ± 6.48 times faster than ./demip.sh</div>
<table>
<tr><th>hyperfine flag</th><th>Meaning</th></tr>
<tr><td><code>-w N</code></td><td>N warm-up runs, not counted (fills disk caches)</td></tr>
<tr><td><code>-r N</code></td><td>exactly N measured runs</td></tr>
<tr><td><code>-N</code></td><td>run without an intermediate shell (fair for fast commands)</td></tr>
<tr><td><code>-p 'cmd'</code></td><td>run <code>cmd</code> before every run, e.g. delete the output files</td></tr>
<tr><td><code>--export-markdown f.md</code></td><td>write the result table for a report</td></tr>
</table>
<p>Inside a script, bash 5 keeps two clocks: <code>$EPOCHSECONDS</code> (whole seconds) and <code>$EPOCHREALTIME</code> (seconds with microseconds, e.g. <code>1790611943.980453</code>). Bash arithmetic is integer-only, so subtract with <code>awk</code> or <code>bc</code>: <code>t0=$EPOCHREALTIME; …; awk -v a=$t0 -v b=$EPOCHREALTIME 'BEGIN{print b-a}'</code>. On the Mac's bash 3.2 <code>$EPOCHREALTIME</code> is simply <strong>empty</strong> — no error — so a timing script there prints nonsense.</p>

<h3>Run it step by step</h3>
<ol>
<li><code>time (for i in {1..2000}; do x=$(date +%s); done)</code> then <code>time (for i in {1..2000}; do printf -v x '%(%s)T' -1; done)</code>.</li>
<li><code>seq 200000 &gt; so.txt; time (s=0; while read -r n; do (( s += n )); done &lt; so.txt; echo $s)</code> versus <code>time awk '{s+=$1} END{print s}' so.txt</code> — both print 20000100000.</li>
<li><code>time (printf '%s\\0' 1 1 1 1 1 1 1 1 | xargs -0 -n1 -P4 sleep)</code> ≈ 2 s; drop <code>-n1</code> and use four items ≈ 4 s.</li>
<li>Save the queue script above as <code>hang-doi.sh</code>, run it, <code>echo $?</code> → 1; change <code>!= 5</code> to <code>!= 99</code> → 0.</li>
<li>If <code>hyperfine</code> is installed: <code>hyperfine -N 'basename /a/b/c' 'bash -c "f=/a/b/c; echo \${f##*/}"'</code>.</li>
</ol>

<h3>On macOS and WSL</h3>
<table>
<tr><th>Thing in this lesson</th><th>Ubuntu / WSL2</th><th>Mac (measured)</th></tr>
<tr><td><code>printf -v</code></td><td>works</td><td>works in bash 3.2</td></tr>
<tr><td><code>printf '%(%T)T' -1</code></td><td>works (4.2+)</td><td><code>printf: &#96;(': invalid format character</code></td></tr>
<tr><td><code>$EPOCHREALTIME</code></td><td>works (5.0+)</td><td>empty, no error</td></tr>
<tr><td><code>wait -n</code> / <code>wait -p</code></td><td>work</td><td><code>wait: -n: invalid option</code> / <code>-p: invalid option</code></td></tr>
<tr><td><code>declare -A</code> in the queue</td><td>works</td><td><code>declare: -A: invalid option</code></td></tr>
<tr><td><code>xargs -0 -n1 -P4</code></td><td>GNU</td><td>BSD xargs has the same flags: 8 × <code>sleep 1</code> = 2.04 s</td></tr>
<tr><td><code>xargs</code> on empty input</td><td>runs the command once (use <code>-r</code>)</td><td>does not run it</td></tr>
<tr><td><code>nproc</code></td><td>10</td><td>not present — <code>getconf _NPROCESSORS_ONLN</code> → 10</td></tr>
<tr><td><code>parallel</code>, <code>hyperfine</code></td><td><code>apt install</code></td><td><code>brew install</code> (not preinstalled)</td></tr>
</table>
<p>WSL2 is a real Linux VM, so fork costs and <code>nproc</code> behave as on Ubuntu; files under <code>/mnt/c</code> are much slower to read and write than files in the Linux home directory, which matters as soon as you parallelise I/O-heavy work.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Measure</span><span class="lz-t">hyperfine / time</span><span class="lz-d">Get a baseline number and note real vs user.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Remove forks</span><span class="lz-t">\${f##*/} · (( )) · printf -v</span><span class="lz-d">The biggest win, often 100× or more.</span></div>
  <div class="lz-step"><span class="lz-k">3 · One pass</span><span class="lz-t">awk / sort / jq once</span><span class="lz-d">Move per-line work out of bash.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Parallelise</span><span class="lz-t">xargs -n1 -P · wait -n · parallel</span><span class="lz-d">Only for heavy, independent jobs.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Measure again</span><span class="lz-t">hyperfine</span><span class="lz-d">Keep the change only if the number says so.</span></div>
</div>
<h3>When to use what</h3>
<ul>
<li><strong>Script slow on many small items</strong> → remove forks first (builtins, parameter expansion, one <code>awk</code>). Parallelism is the second step, not the first.</li>
<li><strong>Heavy independent jobs, one command each</strong> → <code>xargs -0 -n1 -P"$(nproc)"</code>.</li>
<li><strong>Jobs are bash functions / you need per-job status</strong> → a <code>wait -n -p</code> queue.</li>
<li><strong>Need ordered output, tags, logs, retries, combinations</strong> → GNU <code>parallel</code>.</li>
<li><strong>Do not</strong> parallelise work that writes the same file, or hammer an API past its rate limit — faster wrong is still wrong.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> the group's nightly job compresses the day's logs and builds a list of their names; it now takes several minutes. Make it fast and prove it with numbers, in an <code>ubuntu:24.04</code> container.</p><ol>
<li>Create 16 files of about 6 MB: <code>for i in $(seq -w 1 16); do head -c 6000000 /dev/urandom | base64 &gt; "log $i.txt"; done</code> (names with a space on purpose).</li>
<li>Time the naive loop <code>for f in *.txt; do gzip -9 -k -- "$f"; done</code>; delete the <code>.gz</code> files; time <code>printf '%s\\0' *.txt | xargs -0 -n1 -P"$(nproc)" gzip -9 -k --</code>. Note <code>real</code> and <code>user</code> for both.</li>
<li>Run the xargs version once more <em>without</em> <code>-n1</code> and explain the result.</li>
<li>Build the list of base names two ways over <code>printf '%s\\n' /var/log/app/{1..5000}.log</code>: with <code>$(basename "$f")</code> in a loop and with <code>\${f##*/}</code>; time both.</li>
<li>Write a <code>wait -n -p</code> queue (max 4) that runs <code>gzip -t</code> on every <code>.gz</code> and exits 1 if any archive is corrupt; corrupt one with <code>printf x | dd of="log 03.txt.gz" bs=1 seek=100 conv=notrunc</code>.</li></ol>
<p><strong>Done when:</strong> the parallel version's <code>real</code> is at least 3× smaller than the loop's while <code>user</code> stays about the same; the no-<code>-n1</code> run is as slow as the loop; the <code>\${f##*/}</code> loop is at least 50× faster; and your queue names <code>log 03.txt.gz</code> and exits 1.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Fork</span><span class="v">The kernel copies a running process; every <code>$( )</code>, pipe stage and external command costs one.</span></div>
  <div class="kv"><span class="k">exec</span><span class="v">Replacing the copied process with a new program (e.g. <code>/usr/bin/basename</code>).</span></div>
  <div class="kv"><span class="k">Builtin</span><span class="v">A command implemented inside bash (<code>printf</code>, <code>read</code>, <code>[[</code>) — no process needed.</span></div>
  <div class="kv"><span class="k">CPU-bound / I/O-bound</span><span class="v">Limited by computation / by waiting for disk or network; decides how many parallel jobs help.</span></div>
  <div class="kv"><span class="k">Job slot</span><span class="v">One of the N places for running jobs in <code>xargs -P N</code>, <code>parallel -j N</code> or your queue.</span></div>
  <div class="kv"><span class="k"><code>wait -n</code></span><span class="v">Wait for the next background job to finish and return its status; <code>-p var</code> stores its PID.</span></div>
  <div class="kv"><span class="k">real / user / sys</span><span class="v">Wall-clock time / CPU time in the program / CPU time in the kernel, as printed by <code>time</code>.</span></div>
  <div class="kv"><span class="k">Benchmark</span><span class="v">A repeated, controlled timing (<code>hyperfine</code>) instead of a single run.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Each <code>$(…)</code> forks (~0.3 ms here), even for a builtin; in a 10,000-iteration loop that is seconds — use <code>\${…}</code> expansions, <code>(( ))</code> and <code>printf -v</code>.</li>
<li>Never call an external program per line of data: one <code>awk</code> summed 20,000 lines 2,800× faster than calling awk in the loop.</li>
<li><code>xargs -0 -n1 -P N</code> spreads jobs over N slots; without <code>-n</code> everything goes to one command and <code>-P</code> does nothing.</li>
<li><code>wait -n -p pid</code> builds a queue that knows which job failed; a bare <code>wait</code> returns 0 regardless.</li>
<li>GNU <code>parallel</code> adds ordered output (<code>-k</code>), tags, job logs and an exit status equal to the number of failures.</li>
<li>Measure with <code>time</code> (read <code>real</code> vs <code>user</code>) and <code>hyperfine</code> (many runs); on the Mac, <code>$EPOCHREALTIME</code>, <code>wait -n</code> and <code>%(…)T</code> do not exist.</li>
</ul>

<a class="link-card" href="https://www.gnu.org/software/parallel/parallel_tutorial.html" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">GNU Parallel tutorial</span><span class="lc-sub">The official walk-through: input sources, replacement strings, ordering, job logs and remote execution.</span></span>
</a>
<a class="link-card" href="https://github.com/sharkdp/hyperfine" target="_blank" rel="noopener">
  <span class="lc-ico">⏱️</span>
  <span class="lc-body"><span class="lc-title">hyperfine</span><span class="lc-sub">The command-line benchmarking tool used in this lesson: warm-ups, parameter scans, exports.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man1/xargs.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">xargs(1) — man7.org</span><span class="lc-sub">Every flag, including <code>-P</code>, <code>-n</code>, <code>-I</code> and the exact behaviour on empty input.</span></span>
</a>
<a class="link-card" href="https://www.gnu.org/software/bash/manual/html_node/Bash-Variables.html" target="_blank" rel="noopener">
  <span class="lc-ico">🕰️</span>
  <span class="lc-body"><span class="lc-title">Bash Variables — EPOCHREALTIME, BASH_VERSINFO…</span><span class="lc-sub">The official list of variables bash sets for you, with the version each appeared in.</span></span>
</a>
<p class="note-ct"><strong>The habit to take away:</strong> before making a script parallel, count its forks. Most slow bash is a loop calling a program per line; fix that first, then add <code>-P</code> — and prove each step with <code>hyperfine</code>, not with a feeling.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.3</span>
<h2>Chạy song song và nhanh: fork, xargs -P, wait -n, GNU parallel và cách đo</h2>
<p class="lead">Một script mất 30 giây thay vì 0,03 giây thường không phải vì "làm quá nhiều việc" — mà vì nó khởi động một tiến trình mới hàng nghìn lần. Bài này đo chính xác cái giá đó, chỉ ra hai cách viết lại chữa được gần như mọi script chậm (lệnh dựng sẵn thay cho <code>$(…)</code>, và một <code>awk</code> thay cho một vòng lặp), rồi chia việc thật ra mọi nhân CPU bằng <code>xargs -P</code>, một hàng đợi <code>wait -n</code> tự viết và GNU <code>parallel</code>. Mọi con số trong bài đều ĐO thật, và bài kết thúc bằng cách tự đo cho script của bạn.</p>

<h3>Vì sao cần</h3>
<p>Bài 6.5 đã đo bốn việc <code>sleep 1</code>: 4 giây khi nối đuôi, 1 giây với <code>&amp;</code> + <code>wait</code>, 2 giây cho tám việc qua <code>xargs -P 4</code>. Đó là chuyện <em>chờ</em>. Script thật chậm vì một lý do khác: một việc chạy đêm xử lý log trong ngày từng dòng một, mỗi dòng gọi <code>date</code>, <code>basename</code> hay <code>sed</code>, và phình từ hai phút lên bốn mươi phút khi web đông người dùng. Cách chữa hiếm khi là máy nhanh hơn; mà là biết thời gian đi đâu.</p>

<h3>Một lần fork tốn bao nhiêu</h3>
${slide('lx-13', 15, 'Mỗi $(…) là một fork: 10.000 vòng, đo thật')}
<p>Mỗi <code>$(…)</code> bắt bash phải <strong>fork</strong> — nhân bản cả tiến trình shell — và nếu lệnh không phải lệnh dựng sẵn thì còn <strong>exec</strong> — nạp một chương trình mới vào bản sao đó. Mỗi vòng lặp dưới đây chạy 10.000 lần; thời gian lấy bằng <code>$EPOCHREALTIME</code> trước và sau (giải thích ở cuối bài):</p>
<pre><code class="language-bash">#!/usr/bin/env bash
N=\${1:-10000}
f=/srv/app/releases/2026-09-28/app.tar.gz
l1() { for ((i=0;i&lt;N;i++)); do b=$(basename "$f"); done; }
l2() { for ((i=0;i&lt;N;i++)); do b=\${f##*/}; done; }
l3() { for ((i=0;i&lt;N;i++)); do d=$(date +%H:%M:%S); done; }
l4() { for ((i=0;i&lt;N;i++)); do printf -v d '%(%H:%M:%S)T' -1; done; }
l5() { for ((i=0;i&lt;N;i++)); do s=$(echo "$f" | sed 's/tar/zip/'); done; }
l6() { for ((i=0;i&lt;N;i++)); do s=\${f/tar/zip}; done; }
l7() { for ((i=0;i&lt;N;i++)); do k=$(expr $i + 1); done; }
l8() { for ((i=0;i&lt;N;i++)); do (( k = i + 1 )); done; }
<span class="tok-comment"># … mỗi hàm được bấm giờ bằng $EPOCHREALTIME rồi in ra</span></code></pre>
<div class="out">$(basename "$f")                      6.430 s
\${f##*/}                              0.045 s
$(date +%H:%M:%S)                     7.324 s
printf -v d '%(%T)T' -1               0.121 s
$(echo "$f" | sed …)               14.861 s
\${f/tar/zip}                          0.039 s
$(expr $i + 1)                        7.852 s
(( k = i + 1 ))                       0.027 s</div>
<p>Mỗi cặp làm cùng một việc. Bản gọi chương trình ngoài chậm hơn từ 60 tới 380 lần, và bản <code>sed</code> — một ống dẫn nằm trong phép thay thế, tức thêm hai tiến trình — chậm nhất. Có phải vì <code>basename</code> chậm? Một phép đo thứ hai tách riêng cái giá:</p>
<table>
<tr><th>10.000 × …</th><th>Tốn gì</th><th>Ubuntu (container)</th></tr>
<tr><td><code>true</code></td><td>lệnh dựng sẵn, không tạo tiến trình</td><td>0,026 s</td></tr>
<tr><td><code>printf -v v x</code></td><td>dựng sẵn, kết quả vào thẳng biến</td><td>0,040 s</td></tr>
<tr><td><code>v=$(printf x)</code></td><td>dựng sẵn, nhưng trong <code>$( )</code> ⇒ fork</td><td>3,403 s</td></tr>
<tr><td><code>/bin/true</code></td><td>fork + exec một chương trình tí hon</td><td>4,022 s</td></tr>
</table>
<p>Vậy khoảng 0,34 ms cho một lần fork và 0,4 ms cho fork+exec trên máy này — bản thân chương trình gần như không đáng kể. <code>$(printf x)</code> là lệnh dựng sẵn mà vẫn đắt gấp 85 lần <code>printf -v</code>, hoàn toàn chỉ vì cái shell con. Trên máy Fedora 44 (bash 5.3) fork còn đắt hơn: <code>$(basename "$f")</code> mất 11,9 giây cho cùng 10.000 vòng.</p>
<p>Các cách thay, đều từ Chương 6 hoặc lệnh dựng sẵn của bash:</p>
<table>
<tr><th>Thay vì (có fork)</th><th>Viết (không fork)</th><th>Bài</th></tr>
<tr><td><code>$(basename "$f")</code> · <code>$(dirname "$f")</code></td><td><code>\${f##*/}</code> · <code>\${f%/*}</code></td><td>6.3</td></tr>
<tr><td><code>$(echo "$s" | sed 's/a/b/')</code></td><td><code>\${s/a/b}</code>, <code>\${s//a/b}</code></td><td>6.3</td></tr>
<tr><td><code>$(echo "$s" | tr a-z A-Z)</code></td><td><code>\${s^^}</code></td><td>6.3</td></tr>
<tr><td><code>$(expr $i + 1)</code> · <code>$(echo "$a+$b" | bc)</code> với số nguyên</td><td><code>(( i + 1 ))</code> · <code>$(( a + b ))</code></td><td>6.1</td></tr>
<tr><td><code>$(date +%F)</code> trong vòng lặp</td><td><code>printf -v hom_nay '%(%F)T' -1</code> (bash 4.2+)</td><td>bài này</td></tr>
<tr><td><code>x=$(printf '%05d' "$n")</code></td><td><code>printf -v x '%05d' "$n"</code></td><td>bài này</td></tr>
<tr><td><code>$(cat file)</code></td><td><code>$(&lt; file)</code> — vẫn shell con, nhưng khỏi tiến trình <code>cat</code></td><td>—</td></tr>
<tr><td><code>[[ $(echo "$s" | grep -c x) -gt 0 ]]</code></td><td><code>[[ $s == *x* ]]</code> hoặc <code>[[ $s =~ x ]]</code></td><td>6.4</td></tr>
</table>
<p>Bash 5.3 (có trên Fedora 44, chưa có trên bash 5.2 của Ubuntu 24.04) thêm một kiểu thay thế lệnh không fork chút nào: <code>\${ lệnh; }</code>. Đo trên Fedora: 10.000 × <code>$(printf x)</code> 6,107 s, <code>\${ printf x; }</code> 0,112 s, <code>printf -v</code> 0,022 s. Trên bash 5.2 nó báo <code>bad substitution</code>, nên đừng dựa vào nó trong script cho Ubuntu 24.04 lúc này.</p>

<h3>Một lần awk thay hai vạn lần gọi</h3>
${slide('lx-13', 16, 'Một lần awk thay 20.000 lần gọi awk')}
<p>Cùng nguyên lý đó ở quy mô cả một file. Cộng cột số byte (trường 10) của một access log 20.000 dòng bằng ba cách:</p>
<pre><code class="language-bash"><span class="tok-comment"># tong2.sh — MỖI DÒNG một ống và một awk</span>
tong=0
while read -r line; do b=$(echo "$line" | awk '{print $10}'); (( tong += b )); done &lt; a20k.log
echo "$tong"

<span class="tok-comment"># tong1.sh — bash thuần: read -a tự tách cột, không tạo tiến trình nào</span>
tong=0
while read -r -a c; do (( tong += c[9] )); done &lt; a20k.log
echo "$tong"

<span class="tok-comment"># một chương trình đọc cả file</span>
awk '{s += $10} END {print s}' a20k.log</code></pre>
<div class="out">90919365
90919365</div>
<table>
<tr><th>Bản</th><th>Trung bình (hyperfine, 3 lượt)</th><th>So sánh</th></tr>
<tr><td>awk trong vòng lặp (≥ 40.000 lần fork)</td><td>33,292 s ± 3,152</td><td>chậm hơn ≈ 2.800 lần</td></tr>
<tr><td><code>while read -r -a</code> (bash thuần)</td><td>154,5 ms ± 6,4</td><td>chậm hơn 13 lần</td></tr>
<tr><td><code>awk</code> một lần</td><td>11,8 ms ± 1,0</td><td>nhanh nhất</td></tr>
</table>
<p>Cùng một đáp số, 33 giây so với 12 mili giây. Vòng bash thuần đủ dùng với vài nghìn dòng — không fork — nhưng trình thông dịch vẫn làm việc từng dòng mà awk làm trong C. Luật rút ra: <strong>đừng bao giờ gọi chương trình ngoài bên trong vòng lặp chạy trên dữ liệu</strong>. Giao cả dòng dữ liệu cho MỘT <code>awk</code>, <code>sed</code>, <code>sort</code> hay <code>jq</code>, và giữ bash cho việc quyết định cái gì chạy theo thứ tự nào.</p>

<h3>xargs -P, và cái bẫy quên -n</h3>
${slide('lx-13', 17, 'xargs -P: thiếu -n1 thì -P không có gì để chia')}
<p>Khi việc trên mỗi mục thật sự nặng — nén một file, thu nhỏ một ảnh, gọi một API — thì câu trả lời là chạy nhiều mục cùng lúc. Mười sáu file log khoảng 6 MB mỗi file, nén bằng <code>gzip -9</code> trong container 10 CPU:</p>
<pre><code class="language-bash"><span class="tok-comment"># tuantu.sh — nối đuôi nhau</span>
for f in *.txt; do gzip -9 -k -- "$f"; done
<span class="tok-comment"># song.sh — P việc cùng lúc, MỖI gzip một file</span>
printf '%s\\0' *.txt | xargs -0 -n1 -P"\${P:-4}" gzip -9 -k --
<span class="tok-comment"># mot.sh — -P10 nhưng không có -n</span>
printf '%s\\0' *.txt | xargs -0 -P10 gzip -9 -k --</code></pre>
<table>
<tr><th>Lệnh</th><th>Trung bình (hyperfine, 2 lượt)</th><th>Nhanh gấp</th></tr>
<tr><td>vòng <code>for</code></td><td>4,280 s</td><td>1×</td></tr>
<tr><td><code>xargs -0 -n1 -P2</code></td><td>2,226 s</td><td>1,9×</td></tr>
<tr><td><code>xargs -0 -n1 -P4</code></td><td>1,156 s</td><td>3,7×</td></tr>
<tr><td><code>xargs -0 -n1 -P10</code></td><td>0,742 s</td><td>5,8×</td></tr>
<tr><td><code>xargs -0 -P10</code> (không <code>-n</code>)</td><td>4,397 s</td><td>≈ 1× — chẳng lợi gì</td></tr>
</table>
<p>Hàng cuối là cái bẫy. Không có <code>-n</code>, xargs nhồi được bao nhiêu tên thì nhồi vào <strong>một</strong> dòng lệnh — cả mười sáu đi vào một <code>gzip</code> duy nhất — nên <code>-P10</code> chỉ có đúng một việc để chạy. <code>-n1</code> (hoặc <code>-n 4</code>, <code>-L 1</code>, <code>-I{}</code>) chia đầu vào thành nhiều lần gọi để các làn chia nhau. Đo cả trên Mac: tám <code>sleep 1</code> qua <code>xargs -0 -n1 -P4</code> mất 2,04 s, còn bốn cái qua <code>xargs -0 -P4</code> không <code>-n</code> mất 4,02 s — thành một lệnh <code>sleep 1 1 1 1</code>.</p>
<p>Để ý thêm vì sao P10 không nhanh gấp 10: 16 việc trên 10 làn là hai đợt (10 rồi 6), và việc nén bị giới hạn bởi số CPU Docker cấp cho container. <code>time</code> cho thấy tính song song ngay trước mắt: bản nối đuôi có <code>real 6.262s, user 6.133s</code>; bản song song <code>real 0.801s, user 6.078s</code> — cùng một lượng việc CPU, trải ra nhiều nhân cùng lúc.</p>
<table>
<tr><th>Cờ của xargs</th><th>Nghĩa</th><th>Ghi chú</th></tr>
<tr><td><code>-0</code></td><td>các mục đầu vào kết thúc bằng NUL</td><td>đi với <code>find -print0</code> / <code>printf '%s\\0'</code></td></tr>
<tr><td><code>-n N</code></td><td>mỗi lần gọi tối đa N tham số</td><td><strong>bắt buộc</strong> để <code>-P</code> có tác dụng</td></tr>
<tr><td><code>-P N</code></td><td>chạy tối đa N lệnh cùng lúc</td><td><code>-P 0</code> = nhiều nhất có thể (GNU)</td></tr>
<tr><td><code>-I{}</code></td><td>thay <code>{}</code> bằng từng mục; mỗi lần gọi một mục</td><td>khi tên file không đứng cuối lệnh</td></tr>
<tr><td><code>-r</code></td><td>đầu vào rỗng thì không làm gì</td><td>GNU chạy lệnh một lần khi đầu vào rỗng; BSD thì không</td></tr>
<tr><td><code>-t</code></td><td>in từng lệnh trước khi chạy</td><td>chạy thử cùng <code>echo</code></td></tr>
</table>
<div class="pitfall">Các việc song song dùng chung một terminal và output của chúng xen kẽ theo từng dòng. Ba việc mỗi việc in ba dòng qua <code>xargs -n1 -P3</code> ra thành <code>việc 1 dòng 1</code>, <code>việc 2 dòng 1</code>, <code>việc 3 dòng 1</code>, <code>việc 2 dòng 2</code>, <code>việc 1 dòng 2</code>… — ba dòng thì còn đọc được, với log thật thì vô dụng. Cho mỗi việc một file output riêng (<code>sh -c 'cmd "$1" &gt; "$1.log"' _ {}</code>), hoặc dùng GNU <code>parallel</code>, thứ mặc định gom output của từng việc rồi in một lần. Đừng bao giờ để các việc song song cùng ghi nối vào một file.</div>
<p>Bao nhiêu việc cùng lúc? <code>nproc</code> in số CPU dùng được trên Linux (ở đây 10); <code>getconf _NPROCESSORS_ONLN</code> chạy được cả trên Linux lẫn macOS (Mac không có <code>nproc</code>). Việc nặng CPU thì dùng khoảng chừng ấy; việc chờ mạng (tải file, gọi API) thì nhiều hơn cũng được, nhưng phải tôn trọng giới hạn tần suất (rate limit) của phía bên kia.</p>

<h3>wait -n: hàng đợi tự viết, biết việc nào hỏng</h3>
${slide('lx-13', 18, 'wait -n: tự viết hàng đợi 3 làn, biết việc nào hỏng')}
<p>xargs lý tưởng khi mỗi việc là "một lệnh trên một mục". Khi mỗi việc là một hàm bash, hoặc bạn phải biết <em>việc nào</em> hỏng, hãy tự viết hàng đợi. <code>wait -n</code> (bash 4.3+) chờ <em>một</em> việc nền bất kỳ xong và trả mã thoát của nó; <code>-p biến</code> (bash 5.1+) cất thêm PID của việc đó.</p>
<pre><code class="language-bash">#!/usr/bin/env bash
<span class="tok-comment"># 7 việc, tối đa 3 việc cùng lúc; biết việc nào hỏng</span>
max=3 dang=0 loi=0 t0=$EPOCHREALTIME
declare -A ten                          <span class="tok-comment"># PID -&gt; số thứ tự việc (Bài 13.1)</span>
viec() { sleep "$2"; [[ $1 != 5 ]]; }   <span class="tok-comment"># việc 5 cố tình hỏng</span>
cho_mot() {                             <span class="tok-comment"># chờ MỘT việc bất kỳ xong</span>
  wait -n -p pid; local rc=$?
  (( dang-- ))
  (( rc )) &amp;&amp; { echo "  việc \${ten[$pid]} HỎNG (mã $rc)"; loi=1; }
}
for i in 1 2 3 4 5 6 7; do
  (( dang &gt;= max )) &amp;&amp; cho_mot
  viec "$i" "0.$(( i % 3 + 4 ))" &amp; ten[$!]=$i; (( dang++ ))
  printf '%.1fs  bắt đầu việc %s\\n' "$(bc &lt;&lt;&lt; "$EPOCHREALTIME - $t0")" "$i"
done
while (( dang &gt; 0 )); do cho_mot; done
printf '%.1fs  xong hết, loi=%s\\n' "$(bc &lt;&lt;&lt; "$EPOCHREALTIME - $t0")" "$loi"
exit "$loi"</code></pre>
<div class="out">0.0s  bắt đầu việc 1
0.0s  bắt đầu việc 2
0.0s  bắt đầu việc 3
0.4s  bắt đầu việc 4
0.5s  bắt đầu việc 5
0.6s  bắt đầu việc 6
0.9s  bắt đầu việc 7
  việc 5 HỎNG (mã 1)
1.4s  xong hết, loi=1</div>
<p>Đọc các mốc thời gian cùng hình ở slide 18: việc 1–3 bắt đầu cùng lúc; việc 3 (0,4 s) xong trước, nhường làn cho việc 4 lúc 0,4 s; việc 1 nhường làn cho việc 5 lúc 0,5 s; cứ thế. Việc 5 hỏng, hàng đợi gọi đúng tên nó, và script thoát mã 1 để cron hay CI thấy được. ShellCheck không cảnh báo gì trên script này.</p>
<div class="callout warn">Có hai cái bẫy nấp ở đây. <code>wait</code> trần (không tham số) trả <strong>0</strong> kể cả khi có việc hỏng — đo thật: <code>(exit 3) &amp; false &amp; wait; echo $?</code> in 0 — nên hàng đợi dựng trên nó sẽ báo thành công. Và các bộ đếm dùng <code>(( dang++ ))</code> mà CỐ Ý không bật <code>set -e</code>: khi <code>dang</code> bằng 0, <code>(( dang++ ))</code> có giá trị 0, trả mã 1, và dưới <code>set -e</code> script chết ngay tại chỗ (đo trong quiz). Có <code>set -e</code> thì viết <code>dang=$((dang + 1))</code>.</div>

<h3>GNU parallel</h3>
${slide('lx-13', 19, 'GNU parallel: giữ thứ tự, gắn nhãn, ghi nhật ký')}
<p><code>parallel</code> là xargs -P cộng thêm những tính năng rồi bạn sẽ cần: output giữ đúng thứ tự đầu vào, mỗi dòng gắn nhãn đầu vào của nó, nhật ký từng việc, chạy lại việc hỏng, nhiều nguồn đầu vào. Cài bằng <code>sudo apt install parallel</code> (Homebrew: <code>brew install parallel</code>). Lần chạy đầu nó xin bạn ghi nhận trích dẫn học thuật; <code>parallel --citation</code> hoặc tạo file <code>~/.parallel/will-cite</code> là tắt vĩnh viễn. (Gói <code>moreutils</code> của Ubuntu có một chương trình khác, đơn giản hơn, cũng tên <code>parallel</code>; kiểm <code>parallel --version</code> phải in "GNU parallel".)</p>
<pre><code class="language-bash">parallel -j3 "sleep 0.\\$((4 - {} % 3)); echo việc {}" ::: 1 2 3 4 5 6       <span class="tok-comment"># xong trước in trước</span>
parallel -k -j3 "sleep 0.\\$((4 - {} % 3)); echo việc {}" ::: 1 2 3 4 5 6    <span class="tok-comment"># -k: theo thứ tự đầu vào</span>
parallel --tag -j2 "echo {.}.gz; echo {/}" ::: "/tmp/a b.txt" /var/log/x.log
parallel -j2 --joblog nk.tsv "exit {}" ::: 0 1 0 2; echo "mã parallel=$?"
cut -f1,4,7,9 nk.tsv
parallel echo {1}-{2} ::: a b ::: 1 2</code></pre>
<div class="out">việc 2
việc 1
việc 3
việc 5
việc 4
việc 6
việc 1
việc 2
việc 3
việc 4
việc 5
việc 6
/tmp/a b.txt	/tmp/a b.gz
/tmp/a b.txt	a b.txt
/var/log/x.log	/var/log/x.gz
/var/log/x.log	x.log
mã parallel=2
Seq	JobRuntime	Exitval	Command
1	     0.003	0	exit 0
2	     0.003	1	exit 1
3	     0.001	0	exit 0
4	     0.001	2	exit 2
a-1
a-2
b-1
b-2</div>
<table>
<tr><th>Mảnh</th><th>Nghĩa</th></tr>
<tr><td><code>::: a b c</code></td><td>các đầu vào; hai nhóm <code>:::</code> cho mọi tổ hợp</td></tr>
<tr><td><code>-j N</code></td><td>N việc cùng lúc (mặc định: mỗi CPU một việc)</td></tr>
<tr><td><code>-k</code></td><td>in output theo thứ tự đầu vào, không theo thứ tự xong</td></tr>
<tr><td><code>{}</code> · <code>{.}</code> · <code>{/}</code> · <code>{//}</code></td><td>đầu vào · bỏ đuôi · tên file · thư mục — dấu cách được bọc nháy giúp bạn</td></tr>
<tr><td><code>--tag</code></td><td>gắn đầu vào vào đầu mỗi dòng output</td></tr>
<tr><td><code>--joblog f</code></td><td>mỗi việc một dòng: thời gian chạy, mã thoát, lệnh</td></tr>
<tr><td>mã thoát</td><td>bằng SỐ việc hỏng (ở đây 2), 0 nếu tất cả thành công</td></tr>
</table>

<h3>Đo, đừng đoán: time, hyperfine, $EPOCHREALTIME</h3>
${slide('lx-13', 20, 'Đo cho đúng: real, user và hyperfine')}
<pre><code class="language-bash">time bash tuantu.sh
time P=10 bash song.sh
TIMEFORMAT="%Rs thực, %Us user, %Ss sys"; time sleep 0.3</code></pre>
<div class="out">real	0m6.262s
user	0m6.133s
sys	0m0.128s

real	0m0.801s
user	0m6.078s
sys	0m0.072s
0.305s thực, 0.001s user, 0.000s sys</div>
<table>
<tr><th>Cột</th><th>Nghĩa</th><th>Đọc thế nào</th></tr>
<tr><td><code>real</code></td><td>thời gian đồng hồ treo tường</td><td>người dùng phải chờ bấy lâu</td></tr>
<tr><td><code>user</code></td><td>thời gian CPU chạy mã của chính chương trình, cộng mọi nhân</td><td><code>user &gt; real</code> ⇒ đã chạy song song thật</td></tr>
<tr><td><code>sys</code></td><td>thời gian CPU nhân (kernel) làm hộ nó</td><td>cao ⇒ nhiều fork, nhiều I/O</td></tr>
<tr><td><code>real ≫ user + sys</code></td><td>—</td><td>chương trình đang <em>chờ</em>: mạng, đĩa, <code>sleep</code></td></tr>
</table>
<p><code>time</code> ở đây là một <strong>từ khoá</strong> của bash, không phải chương trình <code>/usr/bin/time</code>: nó bấm giờ cả một chuỗi ống và theo định dạng <code>TIMEFORMAT</code>. Nhưng một lần chạy chưa phải là một phép đo. Cùng <code>tuantu.sh</code>, hyperfine đo trung bình 4,28 s mà lần <code>time</code> lẻ ở trên lại ra 6,26 s. <code>hyperfine</code> chạy mỗi lệnh nhiều lần rồi báo trung bình và độ dao động:</p>
<pre><code class="language-bash">hyperfine -w 1 -r 5 -N ./demip.sh "awk '{d[\\$1]++} END {for (k in d) print d[k], k}' access.log"</code></pre>
<div class="out">Benchmark 1: ./demip.sh
  Time (mean ± σ):      1.732 s ±  0.194 s    [User: 1.465 s, System: 0.269 s]
  Range (min … max):    1.595 s …  2.067 s    5 runs
Benchmark 2: awk …
  Time (mean ± σ):      57.9 ms ±  10.7 ms    [User: 49.3 ms, System: 11.3 ms]
…
Summary
  awk … ran 29.91 ± 6.48 times faster than ./demip.sh</div>
<table>
<tr><th>Cờ của hyperfine</th><th>Nghĩa</th></tr>
<tr><td><code>-w N</code></td><td>N lượt khởi động, không tính (làm nóng bộ đệm đĩa)</td></tr>
<tr><td><code>-r N</code></td><td>đúng N lượt đo</td></tr>
<tr><td><code>-N</code></td><td>chạy không qua shell trung gian (công bằng cho lệnh rất nhanh)</td></tr>
<tr><td><code>-p 'lệnh'</code></td><td>chạy <code>lệnh</code> trước mỗi lượt, ví dụ xoá file output</td></tr>
<tr><td><code>--export-markdown f.md</code></td><td>ghi bảng kết quả để đưa vào báo cáo</td></tr>
</table>
<p>Bên trong script, bash 5 có hai đồng hồ: <code>$EPOCHSECONDS</code> (giây nguyên) và <code>$EPOCHREALTIME</code> (giây kèm micro giây, ví dụ <code>1790611943.980453</code>). Số học của bash chỉ có số nguyên, nên trừ bằng <code>awk</code> hoặc <code>bc</code>: <code>t0=$EPOCHREALTIME; …; awk -v a=$t0 -v b=$EPOCHREALTIME 'BEGIN{print b-a}'</code>. Trên bash 3.2 của Mac <code>$EPOCHREALTIME</code> đơn giản là <strong>RỖNG</strong> — không báo lỗi — nên script bấm giờ ở đó in ra số vô nghĩa.</p>

<h3>Chạy thử từng bước</h3>
<ol>
<li><code>time (for i in {1..2000}; do x=$(date +%s); done)</code> rồi <code>time (for i in {1..2000}; do printf -v x '%(%s)T' -1; done)</code>.</li>
<li><code>seq 200000 &gt; so.txt; time (s=0; while read -r n; do (( s += n )); done &lt; so.txt; echo $s)</code> so với <code>time awk '{s+=$1} END{print s}' so.txt</code> — cả hai in 20000100000.</li>
<li><code>time (printf '%s\\0' 1 1 1 1 1 1 1 1 | xargs -0 -n1 -P4 sleep)</code> ≈ 2 s; bỏ <code>-n1</code> và dùng bốn mục ≈ 4 s.</li>
<li>Lưu script hàng đợi ở trên thành <code>hang-doi.sh</code>, chạy, <code>echo $?</code> → 1; đổi <code>!= 5</code> thành <code>!= 99</code> → 0.</li>
<li>Nếu đã cài <code>hyperfine</code>: <code>hyperfine -N 'basename /a/b/c' 'bash -c "f=/a/b/c; echo \${f##*/}"'</code>.</li>
</ol>

<h3>Trên macOS và WSL khác gì</h3>
<table>
<tr><th>Thứ trong bài</th><th>Ubuntu / WSL2</th><th>Mac (đo thật)</th></tr>
<tr><td><code>printf -v</code></td><td>chạy được</td><td>chạy được trong bash 3.2</td></tr>
<tr><td><code>printf '%(%T)T' -1</code></td><td>chạy được (4.2+)</td><td><code>printf: &#96;(': invalid format character</code></td></tr>
<tr><td><code>$EPOCHREALTIME</code></td><td>chạy được (5.0+)</td><td>rỗng, không báo lỗi</td></tr>
<tr><td><code>wait -n</code> / <code>wait -p</code></td><td>chạy được</td><td><code>wait: -n: invalid option</code> / <code>-p: invalid option</code></td></tr>
<tr><td><code>declare -A</code> trong hàng đợi</td><td>chạy được</td><td><code>declare: -A: invalid option</code></td></tr>
<tr><td><code>xargs -0 -n1 -P4</code></td><td>GNU</td><td>xargs BSD có đủ cờ này: 8 × <code>sleep 1</code> = 2,04 s</td></tr>
<tr><td><code>xargs</code> với đầu vào rỗng</td><td>vẫn chạy lệnh một lần (dùng <code>-r</code>)</td><td>không chạy</td></tr>
<tr><td><code>nproc</code></td><td>10</td><td>không có — <code>getconf _NPROCESSORS_ONLN</code> → 10</td></tr>
<tr><td><code>parallel</code>, <code>hyperfine</code></td><td><code>apt install</code></td><td><code>brew install</code> (không cài sẵn)</td></tr>
</table>
<p>WSL2 là một máy ảo Linux thật, nên giá của fork và <code>nproc</code> y như Ubuntu; file nằm dưới <code>/mnt/c</code> đọc ghi chậm hơn nhiều so với file trong thư mục home của Linux, và điều đó lộ ra ngay khi bạn chạy song song những việc nặng I/O.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Đo</span><span class="lz-t">hyperfine / time</span><span class="lz-d">Lấy một con số gốc, ghi lại real và user.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Bỏ fork</span><span class="lz-t">\${f##*/} · (( )) · printf -v</span><span class="lz-d">Lợi lớn nhất, thường gấp 100 lần hoặc hơn.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Một lượt</span><span class="lz-t">awk / sort / jq một lần</span><span class="lz-d">Đưa việc từng dòng ra khỏi bash.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Song song</span><span class="lz-t">xargs -n1 -P · wait -n · parallel</span><span class="lz-d">Chỉ cho việc nặng, độc lập với nhau.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Đo lại</span><span class="lz-t">hyperfine</span><span class="lz-d">Chỉ giữ thay đổi khi con số nói vậy.</span></div>
</div>
<h3>Khi nào dùng cái nào</h3>
<ul>
<li><strong>Script chậm trên nhiều mục nhỏ</strong> → bỏ fork trước (lệnh dựng sẵn, khai triển tham số, một <code>awk</code>). Song song hoá là bước thứ hai, không phải bước đầu.</li>
<li><strong>Việc nặng, độc lập, mỗi việc một lệnh</strong> → <code>xargs -0 -n1 -P"$(nproc)"</code>.</li>
<li><strong>Mỗi việc là một hàm bash / cần mã thoát từng việc</strong> → hàng đợi <code>wait -n -p</code>.</li>
<li><strong>Cần output có thứ tự, nhãn, nhật ký, chạy lại, tổ hợp</strong> → GNU <code>parallel</code>.</li>
<li><strong>Đừng</strong> song song hoá những việc cùng ghi một file, hay dội vào một API quá giới hạn của nó — sai mà nhanh thì vẫn là sai.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> việc chạy đêm của nhóm nén log trong ngày và dựng danh sách tên của chúng; giờ nó mất mấy phút. Làm nó nhanh lên và chứng minh bằng số, trong container <code>ubuntu:24.04</code>.</p><ol>
<li>Tạo 16 file khoảng 6 MB: <code>for i in $(seq -w 1 16); do head -c 6000000 /dev/urandom | base64 &gt; "log $i.txt"; done</code> (tên có dấu cách, cố ý).</li>
<li>Bấm giờ vòng ngây thơ <code>for f in *.txt; do gzip -9 -k -- "$f"; done</code>; xoá các file <code>.gz</code>; bấm giờ <code>printf '%s\\0' *.txt | xargs -0 -n1 -P"$(nproc)" gzip -9 -k --</code>. Ghi lại <code>real</code> và <code>user</code> của cả hai.</li>
<li>Chạy lại bản xargs <em>không có</em> <code>-n1</code> và giải thích kết quả.</li>
<li>Dựng danh sách tên file theo hai cách trên <code>printf '%s\\n' /var/log/app/{1..5000}.log</code>: dùng <code>$(basename "$f")</code> trong vòng lặp và dùng <code>\${f##*/}</code>; bấm giờ cả hai.</li>
<li>Viết một hàng đợi <code>wait -n -p</code> (tối đa 4) chạy <code>gzip -t</code> trên mọi file <code>.gz</code> và thoát mã 1 nếu có file hỏng; làm hỏng một file bằng <code>printf x | dd of="log 03.txt.gz" bs=1 seek=100 conv=notrunc</code>.</li></ol>
<p><strong>Đạt khi:</strong> <code>real</code> của bản song song nhỏ hơn bản vòng lặp ít nhất 3 lần trong khi <code>user</code> xấp xỉ nhau; bản không <code>-n1</code> chậm ngang vòng lặp; vòng <code>\${f##*/}</code> nhanh hơn ít nhất 50 lần; và hàng đợi của bạn gọi đúng tên <code>log 03.txt.gz</code> rồi thoát mã 1.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Fork (nhân bản tiến trình)</span><span class="v">Nhân chép một tiến trình đang chạy; mỗi <code>$( )</code>, mỗi khâu ống dẫn, mỗi lệnh ngoài tốn một lần.</span></div>
  <div class="kv"><span class="k">exec (nạp chương trình)</span><span class="v">Thay bản sao vừa fork bằng một chương trình mới (ví dụ <code>/usr/bin/basename</code>).</span></div>
  <div class="kv"><span class="k">Builtin (lệnh dựng sẵn)</span><span class="v">Lệnh nằm ngay trong bash (<code>printf</code>, <code>read</code>, <code>[[</code>) — không cần tiến trình mới.</span></div>
  <div class="kv"><span class="k">CPU-bound / I/O-bound (nặng CPU / nặng vào-ra)</span><span class="v">Bị giới hạn bởi tính toán / bởi chờ đĩa, mạng; quyết định chạy song song bao nhiêu thì có lợi.</span></div>
  <div class="kv"><span class="k">Job slot (làn chạy)</span><span class="v">Một trong N chỗ chạy việc của <code>xargs -P N</code>, <code>parallel -j N</code> hay hàng đợi của bạn.</span></div>
  <div class="kv"><span class="k"><code>wait -n</code></span><span class="v">Chờ việc nền kế tiếp xong và trả mã thoát của nó; <code>-p biến</code> cất PID của việc đó.</span></div>
  <div class="kv"><span class="k">real / user / sys</span><span class="v">Thời gian đồng hồ / thời gian CPU trong chương trình / thời gian CPU trong nhân, như <code>time</code> in ra.</span></div>
  <div class="kv"><span class="k">Benchmark (phép đo chuẩn)</span><span class="v">Đo lặp lại có kiểm soát (<code>hyperfine</code>) thay vì một lần chạy lẻ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mỗi <code>$(…)</code> là một lần fork (~0,3 ms ở đây), kể cả với lệnh dựng sẵn; trong vòng 10.000 lần là vài giây — dùng khai triển <code>\${…}</code>, <code>(( ))</code> và <code>printf -v</code>.</li>
<li>Đừng gọi chương trình ngoài cho từng dòng dữ liệu: một <code>awk</code> cộng 20.000 dòng nhanh hơn gọi awk trong vòng lặp 2.800 lần.</li>
<li><code>xargs -0 -n1 -P N</code> chia việc ra N làn; thiếu <code>-n</code> thì mọi thứ dồn vào một lệnh và <code>-P</code> vô tác dụng.</li>
<li><code>wait -n -p pid</code> dựng được hàng đợi biết việc nào hỏng; <code>wait</code> trần thì luôn trả 0.</li>
<li>GNU <code>parallel</code> thêm output có thứ tự (<code>-k</code>), nhãn, nhật ký việc và mã thoát bằng số việc hỏng.</li>
<li>Đo bằng <code>time</code> (so <code>real</code> với <code>user</code>) và <code>hyperfine</code> (nhiều lượt); trên Mac không có <code>$EPOCHREALTIME</code>, <code>wait -n</code> hay <code>%(…)T</code>.</li>
</ul>

<a class="link-card" href="https://www.gnu.org/software/parallel/parallel_tutorial.html" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">GNU Parallel tutorial</span><span class="lc-sub">Bài hướng dẫn chính thức: nguồn đầu vào, chuỗi thay thế, thứ tự output, nhật ký việc và chạy trên máy khác.</span></span>
</a>
<a class="link-card" href="https://github.com/sharkdp/hyperfine" target="_blank" rel="noopener">
  <span class="lc-ico">⏱️</span>
  <span class="lc-body"><span class="lc-title">hyperfine</span><span class="lc-sub">Công cụ đo hiệu năng dòng lệnh dùng trong bài: lượt khởi động, quét tham số, xuất kết quả.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man1/xargs.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">xargs(1) — man7.org</span><span class="lc-sub">Mọi cờ, gồm <code>-P</code>, <code>-n</code>, <code>-I</code> và hành vi chính xác khi đầu vào rỗng.</span></span>
</a>
<a class="link-card" href="https://www.gnu.org/software/bash/manual/html_node/Bash-Variables.html" target="_blank" rel="noopener">
  <span class="lc-ico">🕰️</span>
  <span class="lc-body"><span class="lc-title">Bash Variables — EPOCHREALTIME, BASH_VERSINFO…</span><span class="lc-sub">Danh sách chính thức các biến bash đặt sẵn cho bạn.</span></span>
</a>
<p class="note-ct"><strong>Thói quen mang về:</strong> trước khi song song hoá một script, hãy đếm số lần fork của nó. Phần lớn bash chậm là một vòng lặp gọi chương trình cho từng dòng; chữa cái đó trước, rồi mới thêm <code>-P</code> — và chứng minh từng bước bằng <code>hyperfine</code>, không bằng cảm giác.</p>
</div>
`,
    },
    /* ─────────────────────────── 13.4 ─────────────────────────── */
    {
      title: "13.4 — Expert-level scripts: long options, stack traces, logging, tests and linting|||13.4 — Script mức chuyên gia: cờ dài, stack trace, log có mức, kiểm thử và lint",
      slug: "lnx-13-4-script-chuyen-nghiep",
      type: "LESSON",
      isFreePreview: true,
      description: "Nối tiếp Chương 7: getopts hiểu cả --days=9, stack trace từ FUNCNAME/BASH_LINENO, log có mức và màu chỉ khi là terminal, khoá bằng fd tự cấp, kiểm thử bằng bats-core với lệnh giả, shellcheck và shfmt trong CI — và khi nào nên chuyển sang Python.",
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.4</span>
<h2>Expert-level scripts: long options, stack traces, logging, tests and linting</h2>
<p class="lead">Chapter 7 built the production skeleton — strict mode, <code>getopts</code> and a <code>while/case</code> loop for long options, <code>trap</code> for clean-up, <code>mktemp</code>, <code>flock</code>, <code>--dry-run</code>, ShellCheck and a first <code>bats</code> test. This lesson adds the layers that separate a script you wrote from a tool other people can rely on: one parser for <code>-d 9</code> and <code>--days=9</code>, errors that print a stack trace, levelled logging, a lock on a self-allocated descriptor, a real test suite with fake commands, formatting and linting in one command — and an honest answer to "when should this not be bash any more?".</p>

<h3>Why you need this</h3>
<p>A script that only you run can fail with a one-line message and you will know what it means. The same script run by cron at 3 am, by a teammate, or by CI needs to answer three questions on its own: <em>where</em> did it fail (file, function, line), <em>what</em> was it doing (a log with levels), and <em>does it still work</em> after the last change (tests). Everything below serves one of those three questions. The running example is <code>don-log.sh</code>: compress logs older than N days and delete archives older than M days.</p>

<h3>The whole script: Chapter 7 plus five layers</h3>
${slide('lx-13', 21, 'Script chuyên gia = khung Ch7 + 5 lớp nữa')}
<pre><code class="language-bash">#!/usr/bin/env bash
<span class="tok-comment"># don-log.sh — nén log cũ hơn N ngày, xoá bản nén cũ hơn M ngày.</span>
<span class="tok-comment"># Cách dùng: don-log.sh [-n|--dry-run] [-v|--verbose] [-d N|--days=N] [--keep=M] THƯ_MỤC</span>
set -Eeuo pipefail
shopt -s inherit_errexit

readonly TEN=\${0##*/}
DRY_RUN=0 VERBOSE=0 DAYS=7 KEEP=30

<span class="tok-comment"># ── log có mức: mọi lời nhắn ra stderr, màu chỉ khi stderr là terminal ──</span>
if [[ -t 2 ]]; then C_ERR=$'\\e[31m' C_WARN=$'\\e[33m' C_OFF=$'\\e[0m'; else C_ERR='' C_WARN='' C_OFF=''; fi
log()   { printf '%(%F %T)T %-5s %s\\n' -1 "$1" "\${*:2}" &gt;&amp;2; }
debug() { (( VERBOSE )) &amp;&amp; log DEBUG "$@"; return 0; }
info()  { log INFO "$@"; }
warn()  { log "\${C_WARN}WARN\${C_OFF}" "$@"; }
die()   { log "\${C_ERR}ERROR\${C_OFF}" "$1"; exit "\${2:-1}"; }

<span class="tok-comment"># ── stack trace khi có lệnh hỏng ──</span>
on_err() {
  local rc=$? i n=\${#FUNCNAME[@]}
  log ERROR "lệnh hỏng (mã $rc): $BASH_COMMAND"
  for (( i = 1; i &lt; n; i++ )); do       <span class="tok-comment"># FUNCNAME[0] là chính on_err</span>
    local ham="\${FUNCNAME[i]}()"; (( i == n - 1 )) &amp;&amp; ham='(thân script)'
    log ERROR "  tại $ham \${BASH_SOURCE[i]##*/}:\${BASH_LINENO[i-1]}"
  done
}
trap on_err ERR

usage() { sed -n '2,3s/^# \\{0,1\\}//p' "$0"; }

parse_args() {
  local opt
  while getopts ':nvd:h-:' opt; do
    if [[ $opt == - ]]; then              <span class="tok-comment"># cờ dài: getopts coi "-" là một cờ có giá trị</span>
      opt=\${OPTARG%%=*}                   <span class="tok-comment">#   --days=9  ⇒  opt=days</span>
      [[ $OPTARG == *=* ]] &amp;&amp; OPTARG=\${OPTARG#*=} || OPTARG=''
    fi
    case $opt in
      n|dry-run) DRY_RUN=1 ;;
      v|verbose) VERBOSE=1 ;;
      d|days)    [[ -n $OPTARG ]] || die "cần -d N hoặc --days=N" 2; DAYS=$OPTARG ;;
      keep)      [[ -n $OPTARG ]] || die "cần --keep=M" 2; KEEP=$OPTARG ;;
      h|help)    usage; exit 0 ;;
      :)         die "cờ -$OPTARG cần giá trị" 2 ;;
      *)         die "cờ lạ: \${OPTARG:-$opt} (xem --help)" 2 ;;
    esac
  done
  shift $((OPTIND - 1))
  (( $# == 1 )) || die "cần đúng một THƯ_MỤC (xem --help)" 2
  DIR=$1
  [[ $DAYS =~ ^[0-9]+$ &amp;&amp; $KEEP =~ ^[0-9]+$ ]] || die "--days/--keep phải là số" 2
  [[ -d $DIR ]] || die "không có thư mục: $DIR" 2
}

run() { if (( DRY_RUN )); then info "[dry-run] $*"; else debug "chạy: $*"; "$@"; fi; }

main() {
  parse_args "$@"
  exec {lock}&gt;"\${TMPDIR:-/tmp}/$TEN.lock"
  flock -n "$lock" || die "đang có một bản $TEN khác chạy" 3
  local f n=0
  while IFS= read -r -d '' f; do
    run gzip -- "$f"; n=$((n + 1))
  done &lt; &lt;(find "$DIR" -type f -name '*.log' -mtime +"$DAYS" -print0)
  info "đã nén $n file cũ hơn $DAYS ngày"
  run find "$DIR" -type f -name '*.log.gz' -mtime +"$KEEP" -delete
}

main "$@"</code></pre>
<p>69 lines, and every line is either from Chapter 7 or explained in this chapter. ShellCheck reports nothing. The five layers new since Chapter 7:</p>
<ol>
<li><strong><code>shopt -s inherit_errexit</code></strong> (bash 4.4+). Without it, <code>set -e</code> is switched <em>off</em> inside <code>$( )</code>. Measured: <code>set -e; x=$(false; echo "vẫn chạy trong \\$( )"); echo "x=[$x]"</code> prints <code>x=[vẫn chạy trong $( )]</code> and exits 0; with the option, the substitution stops at <code>false</code> and the script exits 1.</li>
<li><strong>Levelled logging to stderr</strong> with timestamps from <code>printf '%(%F %T)T'</code> (no <code>date</code> fork, Lesson 13.3), colour only when <code>[[ -t 2 ]]</code> says stderr is a terminal — so log files and CI output never fill up with <code>\\e[31m</code>.</li>
<li><strong>A stack trace</strong> from an ERR trap (below).</li>
<li><strong>Long options in <code>getopts</code></strong> through the <code>-:</code> trick (below).</li>
<li><strong>A lock on a self-allocated fd</strong> (<code>exec {lock}&gt;…</code>, Lesson 13.2) and a documented exit-code contract: 0 success or help, 1 an inner command failed, 2 called wrongly, 3 another copy holds the lock.</li>
</ol>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">parse_args</span><span class="lz-t">exit 2</span><span class="lz-d">Called wrongly: unknown flag, missing value, not a number, no such directory. Nothing touched yet.</span></div>
  <div class="lz-step"><span class="lz-k">flock -n</span><span class="lz-t">exit 3</span><span class="lz-d">Another copy is running. Safe to ignore in cron.</span></div>
  <div class="lz-step"><span class="lz-k">work</span><span class="lz-t">exit 1 + stack trace</span><span class="lz-d">A real command failed; the log says where.</span></div>
  <div class="lz-step"><span class="lz-k">done</span><span class="lz-t">exit 0</span><span class="lz-d">Everything compressed and pruned, or --help printed.</span></div>
</div>
<p>Its inner loop reads filenames with <code>-print0</code> and <code>read -d ''</code> (Lesson 13.2), and <code>run</code> implements <code>--dry-run</code> exactly as in Lesson 7.2.</p>

<h3>getopts with long options: the '-:' trick</h3>
${slide('lx-13', 22, 'getopts hiểu cả --days=9 nhờ -:')}
<p>Lesson 7.2 handled long options with a hand-written <code>while/case</code> loop, which gives up <code>getopts</code>' free handling of grouped flags (<code>-nv</code>) and of <code>-d9</code>. There is a way to keep both. Put <code>-:</code> in the option string: to <code>getopts</code>, <code>-</code> is then just another option letter that takes an argument. For <code>--days=9</code> it reports <code>opt=-</code> and <code>OPTARG=days=9</code>, and three lines turn that into <code>opt=days</code>, <code>OPTARG=9</code> so a single <code>case</code> handles <code>-d 9</code>, <code>-d9</code> and <code>--days=9</code> alike.</p>
<pre><code class="language-bash">./don-log.sh --help; echo "mã=$?"
./don-log.sh -n --days=7 logs; echo "mã=$?"
./don-log.sh -v -d 15 logs; echo "mã=$?"
./don-log.sh --days logs; echo "mã=$?"
./don-log.sh --xyz logs; echo "mã=$?"
./don-log.sh -d; echo "mã=$?"</code></pre>
<div class="out">don-log.sh — nén log cũ hơn N ngày, xoá bản nén cũ hơn M ngày.
Cách dùng: don-log.sh [-n|--dry-run] [-v|--verbose] [-d N|--days=N] [--keep=M] THƯ_MỤC
mã=0
2026-09-28 16:46:09 INFO  [dry-run] gzip -- logs/app-10.log
2026-09-28 16:46:09 INFO  [dry-run] gzip -- logs/app-20.log
2026-09-28 16:46:09 INFO  [dry-run] gzip -- logs/app-40.log
2026-09-28 16:46:09 INFO  đã nén 3 file cũ hơn 7 ngày
2026-09-28 16:46:09 INFO  [dry-run] find logs -type f -name *.log.gz -mtime +30 -delete
mã=0
2026-09-28 16:46:09 DEBUG chạy: gzip -- logs/app-20.log
2026-09-28 16:46:09 DEBUG chạy: gzip -- logs/app-40.log
2026-09-28 16:46:09 INFO  đã nén 2 file cũ hơn 15 ngày
2026-09-28 16:46:09 DEBUG chạy: find logs -type f -name *.log.gz -mtime +30 -delete
mã=0
2026-09-28 16:46:09 ERROR cần -d N hoặc --days=N
mã=2
2026-09-28 16:46:09 ERROR cờ lạ: xyz (xem --help)
mã=2
2026-09-28 16:46:09 ERROR cờ -d cần giá trị
mã=2</div>
<p>(The log directory held files touched 1, 5, 10, 20 and 40 days ago.) Two details worth noticing in the real output. The second run's <code>find … -delete</code> also removed <code>app-40.log.gz</code>: <code>gzip</code> keeps the original file's modification time, so a freshly compressed 40-day-old log is already "older than 30 days" — correct, but a surprise if you did not know. And <code>--days logs</code> does not steal <code>logs</code> as the value: with the <code>-:</code> trick a long option only takes a value written as <code>--days=N</code>; the script says so instead of guessing. Supporting <code>--days N</code> with a space is possible but needs <code>OPTIND</code> arithmetic that is easy to get wrong — the <code>while/case</code> loop of Lesson 7.2 is the better choice when you need that.</p>
<table>
<tr><th>Piece of <code>':nvd:h-:'</code></th><th>Meaning</th></tr>
<tr><td>leading <code>:</code></td><td>silent mode: getopts prints nothing, you report errors (<code>opt=?</code> for unknown, <code>opt=:</code> for a missing value)</td></tr>
<tr><td><code>n v h</code></td><td>flags without a value</td></tr>
<tr><td><code>d:</code></td><td><code>-d</code> takes a value → <code>$OPTARG</code></td></tr>
<tr><td><code>-:</code></td><td><code>--anything</code> arrives as <code>opt=-</code>, <code>OPTARG=anything</code></td></tr>
</table>

<h3>A stack trace from FUNCNAME, BASH_LINENO and BASH_SOURCE</h3>
${slide('lx-13', 23, 'Stack trace: FUNCNAME + BASH_LINENO + BASH_SOURCE')}
<p>Lesson 7.3 printed <code>$LINENO</code> and <code>$BASH_COMMAND</code> from an ERR trap. That tells you the line, but in a script built from functions the line alone is not enough — <code>run</code> is called from many places. Bash keeps three parallel arrays describing the call stack:</p>
<ul>
<li><code>FUNCNAME[i]</code> — the function at depth <em>i</em> (0 = the current one; the script body appears as <code>main</code>);</li>
<li><code>BASH_LINENO[i]</code> — the line from which <code>FUNCNAME[i]</code> was called, so the line <em>inside</em> <code>FUNCNAME[i]</code> is <code>BASH_LINENO[i-1]</code>;</li>
<li><code>BASH_SOURCE[i]</code> — the file that function is defined in (matters when you <code>source</code> libraries).</li>
</ul>
<p>To see it fail, make the log directory read-only so <code>gzip</code> cannot create its output:</p>
<pre><code class="language-bash">chmod 555 logs
./don-log.sh -d 7 logs; echo "mã=$?"</code></pre>
<div class="out">gzip: logs/app-10.log.gz: Permission denied
2026-09-28 16:46:09 ERROR lệnh hỏng (mã 1): "$@"
2026-09-28 16:46:09 ERROR   tại run() don-log.sh:55
2026-09-28 16:46:09 ERROR   tại main() don-log.sh:63
2026-09-28 16:46:09 ERROR   tại (thân script) don-log.sh:69
mã=1</div>
<p>Read bottom-up: the script body called <code>main</code> at line 69, <code>main</code> called <code>run</code> at line 63 (the <code>gzip</code> in the loop), and inside <code>run</code> the failing command was line 55. <code>$BASH_COMMAND</code> shows <code>"$@"</code> — the command as written in the source, before expansion — which is why the line numbers matter. The trap fired once, not once per stack level, because <code>set -e</code> ended the script right after it. Without <code>-E</code> in <code>set -Eeuo</code>, the trap would not fire inside functions at all (Lesson 7.3). Bash also has a builtin for this, <code>caller</code>: in a small test, <code>trace() { local i=0; while caller "$i"; do ((i++)); done; }</code> called from <code>b</code> ← <code>a</code> ← the body printed <code>3 b d1.sh</code>, <code>4 a d1.sh</code>, <code>5 main d1.sh</code> — line, function, file for each frame.</p>

<h3>Levelled logging, colour, and locks</h3>
<p>The four logging functions share one <code>log</code>: a timestamp, a fixed-width level (<code>%-5s</code> keeps the columns aligned), the message, all on <strong>stderr</strong> so stdout stays clean for real output (Lesson 7.5). <code>debug</code> prints only with <code>-v</code>, and ends with <code>return 0</code> — without it, <code>(( VERBOSE )) &amp;&amp; …</code> would return 1 when verbose is off, and under <code>set -e</code> the first <code>debug</code> call would kill the script. Colour codes are added only when <code>[[ -t 2 ]]</code>: when stderr is redirected to a file or captured by CI, the codes would be garbage.</p>
<div class="pitfall">The <code>return 0</code> at the end of <code>debug</code> is not decoration. Measured without it: <code>set -e; VERBOSE=0; debug() { (( VERBOSE )) &amp;&amp; echo "DEBUG $*"; }; echo trước; debug x; echo "sau"</code> printed <code>trước</code> and then exited with code 1 — the function's last command was an <code>&amp;&amp;</code> list that returned 1, so the <em>call</em> failed and <code>set -e</code> stopped the script with no message at all. Any helper that may legitimately "do nothing" must end with an explicit <code>return 0</code>.</div>
<p>The lock uses <code>flock</code> from Lesson 7.3 on a descriptor bash allocates. Measured by starting two copies at once:</p>
<pre><code class="language-bash">./don-log.sh -n logs &amp; ./don-log.sh -n logs; wait</code></pre>
<div class="out">2026-09-28 16:46:09 ERROR đang có một bản don-log.sh khác chạy
2026-09-28 16:46:09 INFO  [dry-run] gzip -- logs/app-10.log
2026-09-28 16:46:09 INFO  đã nén 1 file cũ hơn 7 ngày
2026-09-28 16:46:09 INFO  [dry-run] find logs -type f -name *.log.gz -mtime +30 -delete</div>
<p>One copy did the work; the other refused with exit code 3. Cron can run the job every five minutes without ever stacking copies.</p>

<h3>Testing with bats-core: fixtures and fake commands</h3>
${slide('lx-13', 24, 'bats-core: kiểm script như kiểm code')}
<p>Lesson 7.4 wrote two <code>bats</code> tests. A real suite needs two more ideas: a clean <strong>fixture</strong> (fresh test data) for every test, and <strong>fake commands</strong> to reach failure paths you cannot easily cause for real. On Ubuntu, <code>sudo apt install bats</code> installs bats-core 1.10.0.</p>
<pre><code class="language-bash">#!/usr/bin/env bats
<span class="tok-comment"># test/don-log.bats — chạy: bats test/</span>

setup() {                                   <span class="tok-comment"># runs BEFORE every test</span>
  SCRIPT="$BATS_TEST_DIRNAME/../don-log.sh"
  LOGS="$BATS_TEST_TMPDIR/logs"             <span class="tok-comment"># a private dir, deleted by bats</span>
  mkdir -p "$LOGS"
  touch -d '-2 days'  "$LOGS/moi.log"
  touch -d '-10 days' "$LOGS/cu.log"
  export TMPDIR=$BATS_TEST_TMPDIR           <span class="tok-comment"># a separate lock per test</span>
}

@test "--help in cách dùng, mã 0" {
  run "$SCRIPT" --help
  [ "$status" -eq 0 ]
  [[ $output == *"Cách dùng"* ]]
}

@test "cờ lạ ⇒ mã 2 và nói rõ cờ nào" {
  run "$SCRIPT" --xoa-het "$LOGS"
  [ "$status" -eq 2 ]
  [[ $output == *"cờ lạ: xoa-het"* ]]
}

@test "--dry-run không đụng vào file nào" {
  run "$SCRIPT" --dry-run "$LOGS"
  [ "$status" -eq 0 ]
  [ -f "$LOGS/cu.log" ]
  [ ! -e "$LOGS/cu.log.gz" ]
}

@test "chỉ nén file cũ hơn --days" {
  run "$SCRIPT" --days=7 "$LOGS"
  [ "$status" -eq 0 ]
  [ -f "$LOGS/cu.log.gz" ]
  [ -f "$LOGS/moi.log" ]
}

@test "gzip hỏng ⇒ mã ≠ 0 và có stack trace" {
  mkdir -p "$BATS_TEST_TMPDIR/bin"
  printf '#!/bin/sh\\nexit 1\\n' &gt; "$BATS_TEST_TMPDIR/bin/gzip"   <span class="tok-comment"># a FAKE gzip</span>
  chmod +x "$BATS_TEST_TMPDIR/bin/gzip"
  PATH="$BATS_TEST_TMPDIR/bin:$PATH" run "$SCRIPT" "$LOGS"       <span class="tok-comment"># found first in PATH</span>
  [ "$status" -eq 1 ]
  [[ $output == *"tại run()"* ]]
}</code></pre>
<div class="out">$ bats -p test/
don-log.bats
 ✓ --help in cách dùng, mã 0
 ✓ cờ lạ ⇒ mã 2 và nói rõ cờ nào
 ✓ --dry-run không đụng vào file nào
 ✓ chỉ nén file cũ hơn --days
 ✓ gzip hỏng ⇒ mã ≠ 0 và có stack trace

5 tests, 0 failures</div>
<p>And what a failure looks like — one assertion deliberately changed from 2 to 0:</p>
<div class="out"> ✗ cờ lạ ⇒ mã 2 và nói rõ cờ nào
   (in test file /tmp/sai.bats, line 21)
     &#96;[ "$status" -eq 0 ]' failed
1 test, 1 failure</div>
<table>
<tr><th>bats piece</th><th>Meaning</th></tr>
<tr><td><code>@test "name" { … }</code></td><td>one test; it fails if any line returns non-zero</td></tr>
<tr><td><code>run cmd args</code></td><td>runs the command without failing the test, stores <code>$status</code> and <code>$output</code> (stdout + stderr)</td></tr>
<tr><td><code>setup</code> / <code>teardown</code></td><td>run before / after every test</td></tr>
<tr><td><code>$BATS_TEST_TMPDIR</code></td><td>a fresh temporary directory per test, removed afterwards</td></tr>
<tr><td><code>$BATS_TEST_DIRNAME</code></td><td>the directory of the <code>.bats</code> file — find the script relative to it</td></tr>
<tr><td><code>PATH="$fake:$PATH" run …</code></td><td>replace a real command with a fake one for this test only</td></tr>
<tr><td><code>bats -p</code> · <code>--tap</code> · <code>-f regex</code></td><td>pretty output · TAP output for CI · run only matching tests</td></tr>
</table>
<p>The fake-<code>gzip</code> test is the important pattern: it proves the failure path — exit code and stack trace — without breaking a real disk. The same trick fakes <code>docker</code>, <code>curl</code> or <code>ssh</code> for testing a deploy script. Adding a sixth test that holds the lock first (<code>exec {k}&gt;"$TMPDIR/don-log.sh.lock"; flock -n "$k"</code>) and expects status 3 also passed: <code>6 tests, 0 failures</code>.</p>

<h3>ShellCheck and shfmt: one lint command</h3>
${slide('lx-13', 25, 'shellcheck bắt lỗi mảng; shfmt giữ một kiểu viết')}
<p>ShellCheck (Lesson 7.4) knows the array mistakes of Lesson 13.1. On a four-line file of classic errors:</p>
<pre><code class="language-bash">files=( $(find . -name '*.log') )
echo "có $files file"
for f in \${files[@]}; do gzip "$f"; done
ds="a b c"; arr=($ds)</code></pre>
<div class="out">$ shellcheck -f gcc mang-sai.sh
mang-sai.sh:2:9: warning: Prefer mapfile or read -a to split command output (or quote to avoid splitting). [SC2207]
mang-sai.sh:3:10: warning: Expanding an array without an index only gives the first element. [SC2128]
mang-sai.sh:4:10: error: Double quote array expansions to avoid re-splitting elements. [SC2068]
mang-sai.sh:5:18: warning: Quote to prevent word splitting/globbing, or split robustly with mapfile or read -a. [SC2206]</div>
<p><code>-f gcc</code> prints one line per problem (<code>file:line:col</code>), the format editors and CI annotate. A trap met while recording this lesson: in the container, whose locale was plain POSIX, ShellCheck's default output format <strong>crashed</strong> on the Vietnamese text of the script — <code>mang-sai.sh: &lt;stdout&gt;: commitBuffer: invalid argument (invalid character)</code>. Running it as <code>LC_ALL=C.UTF-8 shellcheck …</code> fixed it. Minimal Docker images and CI runners often have exactly that locale.</p>
<p><strong>shfmt</strong> is to bash what Prettier is to JavaScript: it rewrites indentation and layout into one consistent style, so diffs in code review show logic changes, not whitespace wars. <code>sudo apt install shfmt</code> gives version 3.8.0.</p>
<pre><code class="language-bash">shfmt -d -i 2 -ci lon-xon.sh     <span class="tok-comment"># -d: show the diff, change nothing</span></code></pre>
<div class="out">--- lon-xon.sh.orig
+++ lon-xon.sh
@@ -1,11 +1,10 @@
 #!/usr/bin/env bash
-if [ -f a ]
-then
-echo co
+if [ -f a ]; then
+  echo co
 fi
-for f in *.log ;do
-    gzip "$f"
-  done
+for f in *.log; do
+  gzip "$f"
+done
 case $1 in
-a) echo A;;
+  a) echo A ;;
 esac</div>
<table>
<tr><th>Flag</th><th>Meaning</th></tr>
<tr><td><code>-i 2</code></td><td>indent with 2 spaces (0 = tabs)</td></tr>
<tr><td><code>-ci</code></td><td>indent the patterns inside <code>case</code></td></tr>
<tr><td><code>-d</code></td><td>print a diff and exit 1 if the file is not formatted — for CI</td></tr>
<tr><td><code>-l</code></td><td>list the files that are not formatted</td></tr>
<tr><td><code>-w</code></td><td>rewrite the files in place</td></tr>
</table>
<p>Put the three checks behind one command that you run before every commit and CI runs on every push:</p>
<pre><code class="language-bash">#!/usr/bin/env bash
<span class="tok-comment"># lint.sh — chạy trước mỗi commit và trong CI</span>
set -euo pipefail
export LC_ALL=C.UTF-8
shellcheck -S warning ./*.sh
shfmt -d -i 2 -ci don-log.sh &gt;/dev/null || { echo "shfmt: don-log.sh chưa đúng kiểu (shfmt -w để sửa)" &gt;&amp;2; exit 1; }
bats test/</code></pre>
<div class="out">$ bash lint.sh; echo "mã=$?"
shfmt: don-log.sh chưa đúng kiểu (shfmt -w để sửa)
mã=1</div>
<p>It failed — on the script of this lesson. The compact one-line functions (<code>debug() { …; return 0; }</code>) and the aligned <code>case</code> branches are not shfmt's style. After <code>shfmt -w -i 2 -ci don-log.sh</code> the file grew from 69 to 89 lines, and <code>lint.sh</code> passed: ShellCheck silent, formatting clean, <code>1..5</code> and <code>ok</code> for all five tests, <code>mã=0</code>. Whether a team accepts shfmt's layout is a team decision; what matters is that a machine enforces the agreement, not reviewers.</p>

<h3>When to stop writing bash</h3>
${slide('lx-13', 26, 'Khi nào thôi viết bash, chuyển sang Python')}
<p>The Google Shell Style Guide puts it bluntly: "If you are writing a script that is more than 100 lines long, or that uses non-straightforward control flow logic, you should rewrite it in a more structured language now." The line count is a heuristic, not a law — <code>don-log.sh</code> is 69 lines of straightforward control flow and is a good bash script. The signs that bash has become the wrong tool are more specific:</p>
<table>
<tr><th>Sign</th><th>Why bash is weak there</th></tr>
<tr><td>You need nested data: a list of records, JSON with depth</td><td>arrays are one level, every value is a string (Lesson 13.1)</td></tr>
<tr><td>Decimal numbers, dates, money</td><td><code>$(( ))</code> is integer-only; every calculation forks <code>bc</code> or <code>awk</code></td></tr>
<tr><td>Per-line processing of big data</td><td>30–2,800× slower than one <code>awk</code> (Lesson 13.3)</td></tr>
<tr><td>Retries with backoff, timeouts, many error types</td><td>only exit codes 0–255, no exceptions</td></tr>
<tr><td>Must run on stock macOS and Linux</td><td>half of this chapter does not exist in bash 3.2</td></tr>
<tr><td>You want unit tests of the logic itself</td><td>bats tests behaviour from outside; functions are awkward to test in isolation</td></tr>
</table>
<p>For comparison, the IP count of Lesson 13.1 in Python:</p>
<pre><code class="language-python">import sys, collections
dem = collections.Counter(dong.split(maxsplit=1)[0] for dong in sys.stdin)
for ip, n in dem.most_common(3):
    print(f"{n:7d} {ip}")</code></pre>
<div class="out">  30270 10.0.2.75
  15456 10.0.1.167
  10471 10.0.1.171</div>
<p><code>hyperfine</code>: 64.1 ms ± 8.5 for <code>python3 dem.py &lt; access.log</code> — the same league as <code>awk</code> (58 ms), 27× faster than the bash loop, and far easier to extend into "top IPs per hour, excluding our own health checks". The healthy split is usually both: <strong>bash orchestrates</strong> (runs <code>docker</code>, <code>git</code>, <code>rsync</code>, checks exit codes, holds the lock), <strong>Python computes</strong> (<code>bao_cao=$(python3 tinh.py &lt; access.log)</code>).</p>

<h3>Run it step by step</h3>
<ol>
<li>Save <code>don-log.sh</code>, <code>chmod +x</code>, <code>shellcheck don-log.sh</code> → silent.</li>
<li><code>mkdir logs; for d in 1 5 10 20 40; do touch -d "-$d days" logs/app-$d.log; done</code>, then <code>./don-log.sh -n --days=7 logs</code> → three dry-run lines.</li>
<li><code>./don-log.sh --xyz logs; echo $?</code> → <code>cờ lạ: xyz</code>, 2.</li>
<li><code>chmod 555 logs; ./don-log.sh -d 7 logs</code> → the stack trace; <code>chmod 755 logs</code>.</li>
<li><code>mkdir test</code>, save the <code>.bats</code> file, <code>bats -p test/</code> → 5 ✓.</li>
<li>Save <code>lint.sh</code>, run it, read why it fails, <code>shfmt -w -i 2 -ci don-log.sh</code>, run it again → <code>mã=0</code>.</li>
</ol>

<h3>On macOS and WSL</h3>
<table>
<tr><th>Thing in this lesson</th><th>Ubuntu / WSL2</th><th>Mac (measured)</th></tr>
<tr><td><code>/bin/bash don-log.sh -n logs</code></td><td>works</td><td>stops at line 5: <code>shopt: inherit_errexit: invalid shell option name</code>, exit 1</td></tr>
<tr><td>after removing that line</td><td>—</td><td><code>line 58: exec: {lock}: not found</code>, exit 127; and every log line fails with <code>printf: &#96;(': invalid format character</code> (<code>--xyz</code> shows it twice); there is no <code>flock</code> command either</td></tr>
<tr><td><code>getopts</code> with <code>-:</code>, <code>FUNCNAME</code>, <code>BASH_LINENO</code>, <code>caller</code></td><td>work</td><td>work in bash 3.2</td></tr>
<tr><td><code>shellcheck</code>, <code>shfmt</code>, <code>bats</code></td><td><code>apt install</code></td><td><code>brew install shellcheck shfmt bats-core</code></td></tr>
<tr><td><code>touch -d '-10 days'</code> in the tests</td><td>GNU syntax</td><td>BSD <code>touch</code> has no relative dates: <code>touch -t YYYYMMDDhhmm</code></td></tr>
</table>
<p>The honest summary: an expert-level bash script targets <strong>bash 5 on Linux</strong>. If it must run on a colleague's Mac, either declare the dependency (<code>brew install bash util-linux</code>, <code>#!/usr/bin/env bash</code>, and <code>(( BASH_VERSINFO[0] &gt;= 5 )) || die "cần bash 5"</code> at the top) or run it in a container. WSL2 is Ubuntu, so it works unchanged.</p>

<h3>When to use what</h3>
<ul>
<li><strong>getopts with <code>-:</code></strong> when you want grouped short flags and <code>--name=value</code>; the <code>while/case</code> loop of Lesson 7.2 when you also need <code>--name value</code>.</li>
<li><strong>Stack traces</strong> in any script with more than a few functions; <strong>levelled logs</strong> in anything cron or CI runs.</li>
<li><strong>bats</strong> as soon as a script deploys, deletes or bills something; fake commands for every failure path.</li>
<li><strong>lint.sh</strong> (ShellCheck + shfmt + bats) in CI from day one — it costs a minute to add and catches the SC2068 kind of bug forever.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> your group will run <code>don-log.sh</code> from cron on the project VPS. Before it goes there, make it trustworthy — in an <code>ubuntu:24.04</code> container with <code>shellcheck shfmt bats</code> installed.</p><ol>
<li>Copy <code>don-log.sh</code> and the five tests; run <code>bats -p test/</code> and get 5 ✓.</li>
<li>Add a sixth test: hold the lock yourself with <code>exec {k}&gt;"$TMPDIR/don-log.sh.lock"; flock -n "$k"</code>, run the script, assert status 3 and the message <code>đang có một bản</code>.</li>
<li>Add a seventh test for bad input: <code>--keep=abc</code> must give status 2 and mention <code>phải là số</code>.</li>
<li>Write <code>lint.sh</code> as above; make it pass (let shfmt reformat, then re-run the tests).</li>
<li>Run <code>/bin/bash don-log.sh -n logs</code> on a Mac (or read the table above) and write down the first line that breaks and why.</li></ol>
<p><strong>Done when:</strong> <code>bats test/</code> reports <code>7 tests, 0 failures</code>, <code>bash lint.sh; echo $?</code> prints <code>0</code>, and you can explain in one sentence why the Mac fails at line 5.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Long option</span><span class="v">An option written <code>--name</code> or <code>--name=value</code>; <code>getopts</code> handles it with the <code>-:</code> trick.</span></div>
  <div class="kv"><span class="k">Stack trace</span><span class="v">The chain of function calls, with file and line, that led to an error.</span></div>
  <div class="kv"><span class="k"><code>FUNCNAME</code> / <code>BASH_LINENO</code> / <code>BASH_SOURCE</code></span><span class="v">Bash's parallel arrays describing the call stack: function, calling line, file.</span></div>
  <div class="kv"><span class="k"><code>inherit_errexit</code></span><span class="v">Shell option (4.4+) that keeps <code>set -e</code> active inside <code>$( )</code>.</span></div>
  <div class="kv"><span class="k">Log level</span><span class="v">A severity tag (DEBUG/INFO/WARN/ERROR) so readers and tools can filter messages.</span></div>
  <div class="kv"><span class="k">Fixture</span><span class="v">Fresh test data created before each test (<code>setup</code>) so tests do not depend on each other.</span></div>
  <div class="kv"><span class="k">Fake / stub command</span><span class="v">A tiny script placed first in <code>PATH</code> that imitates a real command to force a code path.</span></div>
  <div class="kv"><span class="k">Linter / formatter</span><span class="v">A tool that finds likely bugs (ShellCheck) / one that rewrites layout into a fixed style (shfmt).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Add to the Chapter 7 skeleton: <code>inherit_errexit</code>, levelled logs on stderr (colour only with <code>[[ -t 2 ]]</code>), a stack trace, <code>exec {lock}</code> + <code>flock</code>, documented exit codes.</li>
<li><code>getopts ':…-:'</code> turns <code>--days=9</code> into <code>opt=-</code>, <code>OPTARG=days=9</code>; split on <code>=</code> and one <code>case</code> handles short and long forms.</li>
<li><code>FUNCNAME[i]</code> with <code>BASH_LINENO[i-1]</code> and <code>BASH_SOURCE[i]</code> give function, line and file for each frame; the body is called <code>main</code>.</li>
<li>bats: <code>setup</code> + <code>$BATS_TEST_TMPDIR</code> for fixtures, <code>run</code> for <code>$status</code>/<code>$output</code>, a fake command first in <code>PATH</code> for failure paths.</li>
<li>One <code>lint.sh</code> = ShellCheck (with <code>LC_ALL=C.UTF-8</code>) + <code>shfmt -d</code> + <code>bats</code>, run locally and in CI.</li>
<li>Move to Python when data nests, numbers are decimal, data is big or it must run on stock macOS; bash orchestrates, Python computes.</li>
</ul>

<a class="link-card" href="https://bats-core.readthedocs.io/" target="_blank" rel="noopener">
  <span class="lc-ico">🦇</span>
  <span class="lc-body"><span class="lc-title">bats-core documentation</span><span class="lc-sub">Writing tests, <code>run</code>, <code>setup</code>/<code>teardown</code>, special variables and the helper libraries bats-assert and bats-file.</span></span>
</a>
<a class="link-card" href="https://mywiki.wooledge.org/BashFAQ/035" target="_blank" rel="noopener">
  <span class="lc-ico">🚩</span>
  <span class="lc-body"><span class="lc-title">BashFAQ 035 — command-line options</span><span class="lc-sub">getopts, manual loops and long options compared, with the pitfalls of each.</span></span>
</a>
<a class="link-card" href="https://github.com/mvdan/sh" target="_blank" rel="noopener">
  <span class="lc-ico">🧹</span>
  <span class="lc-body"><span class="lc-title">mvdan/sh — shfmt</span><span class="lc-sub">The shell parser and formatter: flags, editor integration and CI usage.</span></span>
</a>
<a class="link-card" href="https://google.github.io/styleguide/shellguide.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Google Shell Style Guide</span><span class="lc-sub">Where the "100 lines" rule comes from, plus naming, <code>main</code>, and error-output conventions.</span></span>
</a>
<p class="note-ct"><strong>The habit to take away:</strong> a script is finished when it can tell a stranger where it failed, keeps a readable log, and has a <code>lint.sh</code> that goes green — and when you have asked, honestly, whether the next feature belongs in Python instead.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.4</span>
<h2>Script mức chuyên gia: cờ dài, stack trace, log có mức, kiểm thử và lint</h2>
<p class="lead">Chương 7 đã dựng bộ khung production — strict mode, <code>getopts</code> và vòng <code>while/case</code> cho cờ dài, <code>trap</code> để dọn dẹp, <code>mktemp</code>, <code>flock</code>, <code>--dry-run</code>, ShellCheck và một bài test <code>bats</code> đầu tiên. Bài này thêm những lớp phân biệt "một script bạn viết" với "một công cụ người khác dựa vào được": một bộ phân tích cho cả <code>-d 9</code> lẫn <code>--days=9</code>, lỗi in ra stack trace, log có mức, khoá trên một fd tự cấp, một bộ test thật có lệnh giả, định dạng và lint trong một lệnh — và câu trả lời thật thà cho câu hỏi "khi nào thứ này không nên là bash nữa?".</p>

<h3>Vì sao cần</h3>
<p>Script chỉ mình bạn chạy thì hỏng với một dòng thông báo, bạn vẫn hiểu. Cũng script đó do cron chạy lúc 3 giờ sáng, do bạn cùng nhóm chạy, hay do CI chạy thì phải tự trả lời được ba câu: hỏng ở <em>đâu</em> (file, hàm, dòng), lúc đó đang làm <em>gì</em> (log có mức), và sau lần sửa cuối nó <em>còn chạy đúng không</em> (test). Mọi thứ dưới đây phục vụ một trong ba câu đó. Ví dụ xuyên suốt là <code>don-log.sh</code>: nén log cũ hơn N ngày và xoá bản nén cũ hơn M ngày.</p>

<h3>Toàn bộ script: Chương 7 cộng năm lớp</h3>
${slide('lx-13', 21, 'Script chuyên gia = khung Ch7 + 5 lớp nữa')}
<pre><code class="language-bash">#!/usr/bin/env bash
<span class="tok-comment"># don-log.sh — nén log cũ hơn N ngày, xoá bản nén cũ hơn M ngày.</span>
<span class="tok-comment"># Cách dùng: don-log.sh [-n|--dry-run] [-v|--verbose] [-d N|--days=N] [--keep=M] THƯ_MỤC</span>
set -Eeuo pipefail
shopt -s inherit_errexit

readonly TEN=\${0##*/}
DRY_RUN=0 VERBOSE=0 DAYS=7 KEEP=30

<span class="tok-comment"># ── log có mức: mọi lời nhắn ra stderr, màu chỉ khi stderr là terminal ──</span>
if [[ -t 2 ]]; then C_ERR=$'\\e[31m' C_WARN=$'\\e[33m' C_OFF=$'\\e[0m'; else C_ERR='' C_WARN='' C_OFF=''; fi
log()   { printf '%(%F %T)T %-5s %s\\n' -1 "$1" "\${*:2}" &gt;&amp;2; }
debug() { (( VERBOSE )) &amp;&amp; log DEBUG "$@"; return 0; }
info()  { log INFO "$@"; }
warn()  { log "\${C_WARN}WARN\${C_OFF}" "$@"; }
die()   { log "\${C_ERR}ERROR\${C_OFF}" "$1"; exit "\${2:-1}"; }

<span class="tok-comment"># ── stack trace khi có lệnh hỏng ──</span>
on_err() {
  local rc=$? i n=\${#FUNCNAME[@]}
  log ERROR "lệnh hỏng (mã $rc): $BASH_COMMAND"
  for (( i = 1; i &lt; n; i++ )); do       <span class="tok-comment"># FUNCNAME[0] là chính on_err</span>
    local ham="\${FUNCNAME[i]}()"; (( i == n - 1 )) &amp;&amp; ham='(thân script)'
    log ERROR "  tại $ham \${BASH_SOURCE[i]##*/}:\${BASH_LINENO[i-1]}"
  done
}
trap on_err ERR

usage() { sed -n '2,3s/^# \\{0,1\\}//p' "$0"; }

parse_args() {
  local opt
  while getopts ':nvd:h-:' opt; do
    if [[ $opt == - ]]; then              <span class="tok-comment"># cờ dài: getopts coi "-" là một cờ có giá trị</span>
      opt=\${OPTARG%%=*}                   <span class="tok-comment">#   --days=9  ⇒  opt=days</span>
      [[ $OPTARG == *=* ]] &amp;&amp; OPTARG=\${OPTARG#*=} || OPTARG=''
    fi
    case $opt in
      n|dry-run) DRY_RUN=1 ;;
      v|verbose) VERBOSE=1 ;;
      d|days)    [[ -n $OPTARG ]] || die "cần -d N hoặc --days=N" 2; DAYS=$OPTARG ;;
      keep)      [[ -n $OPTARG ]] || die "cần --keep=M" 2; KEEP=$OPTARG ;;
      h|help)    usage; exit 0 ;;
      :)         die "cờ -$OPTARG cần giá trị" 2 ;;
      *)         die "cờ lạ: \${OPTARG:-$opt} (xem --help)" 2 ;;
    esac
  done
  shift $((OPTIND - 1))
  (( $# == 1 )) || die "cần đúng một THƯ_MỤC (xem --help)" 2
  DIR=$1
  [[ $DAYS =~ ^[0-9]+$ &amp;&amp; $KEEP =~ ^[0-9]+$ ]] || die "--days/--keep phải là số" 2
  [[ -d $DIR ]] || die "không có thư mục: $DIR" 2
}

run() { if (( DRY_RUN )); then info "[dry-run] $*"; else debug "chạy: $*"; "$@"; fi; }

main() {
  parse_args "$@"
  exec {lock}&gt;"\${TMPDIR:-/tmp}/$TEN.lock"
  flock -n "$lock" || die "đang có một bản $TEN khác chạy" 3
  local f n=0
  while IFS= read -r -d '' f; do
    run gzip -- "$f"; n=$((n + 1))
  done &lt; &lt;(find "$DIR" -type f -name '*.log' -mtime +"$DAYS" -print0)
  info "đã nén $n file cũ hơn $DAYS ngày"
  run find "$DIR" -type f -name '*.log.gz' -mtime +"$KEEP" -delete
}

main "$@"</code></pre>
<p>69 dòng, và dòng nào cũng hoặc đến từ Chương 7, hoặc được giải thích trong chương này. ShellCheck không báo gì. Năm lớp mới so với Chương 7:</p>
<ol>
<li><strong><code>shopt -s inherit_errexit</code></strong> (bash 4.4+). Thiếu nó, <code>set -e</code> bị TẮT bên trong <code>$( )</code>. Đo thật: <code>set -e; x=$(false; echo "vẫn chạy trong \\$( )"); echo "x=[$x]"</code> in <code>x=[vẫn chạy trong $( )]</code> và thoát 0; bật tuỳ chọn này thì phép thay thế dừng ở <code>false</code> và script thoát mã 1.</li>
<li><strong>Log có mức ra stderr</strong>, giờ lấy từ <code>printf '%(%F %T)T'</code> (khỏi fork <code>date</code>, Bài 13.3), màu chỉ khi <code>[[ -t 2 ]]</code> xác nhận stderr là một terminal — nên file log và output của CI không bao giờ đầy <code>\\e[31m</code>.</li>
<li><strong>Stack trace</strong> từ bẫy ERR (dưới đây).</li>
<li><strong>Cờ dài trong <code>getopts</code></strong> bằng mẹo <code>-:</code> (dưới đây).</li>
<li><strong>Khoá trên một fd tự cấp</strong> (<code>exec {lock}&gt;…</code>, Bài 13.2) và một "hợp đồng" mã thoát có ghi rõ: 0 xong hoặc in trợ giúp, 1 một lệnh bên trong hỏng, 2 gọi sai, 3 có bản khác đang giữ khoá.</li>
</ol>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">parse_args</span><span class="lz-t">exit 2</span><span class="lz-d">Gọi sai: cờ lạ, thiếu giá trị, không phải số, không có thư mục. Chưa đụng vào thứ gì.</span></div>
  <div class="lz-step"><span class="lz-k">flock -n</span><span class="lz-t">exit 3</span><span class="lz-d">Một bản khác đang chạy. Với cron thì bỏ qua được.</span></div>
  <div class="lz-step"><span class="lz-k">làm việc</span><span class="lz-t">exit 1 + stack trace</span><span class="lz-d">Một lệnh thật hỏng; log nói rõ ở đâu.</span></div>
  <div class="lz-step"><span class="lz-k">xong</span><span class="lz-t">exit 0</span><span class="lz-d">Đã nén và dọn xong, hoặc đã in --help.</span></div>
</div>
<p>Vòng lặp bên trong đọc tên file bằng <code>-print0</code> và <code>read -d ''</code> (Bài 13.2), và <code>run</code> làm <code>--dry-run</code> y như Bài 7.2.</p>

<h3>getopts với cờ dài: mẹo '-:'</h3>
${slide('lx-13', 22, 'getopts hiểu cả --days=9 nhờ -:')}
<p>Bài 7.2 xử lý cờ dài bằng một vòng <code>while/case</code> tự viết, và phải bỏ mất thứ <code>getopts</code> cho không: gộp cờ (<code>-nv</code>) và <code>-d9</code>. Có cách giữ được cả hai. Đặt <code>-:</code> vào chuỗi đặc tả: với <code>getopts</code>, <code>-</code> khi đó chỉ là thêm một chữ cờ có nhận giá trị. Gặp <code>--days=9</code> nó báo <code>opt=-</code> và <code>OPTARG=days=9</code>, và ba dòng biến cái đó thành <code>opt=days</code>, <code>OPTARG=9</code> — thế là MỘT <code>case</code> xử lý như nhau <code>-d 9</code>, <code>-d9</code> và <code>--days=9</code>.</p>
<pre><code class="language-bash">./don-log.sh --help; echo "mã=$?"
./don-log.sh -n --days=7 logs; echo "mã=$?"
./don-log.sh -v -d 15 logs; echo "mã=$?"
./don-log.sh --days logs; echo "mã=$?"
./don-log.sh --xyz logs; echo "mã=$?"
./don-log.sh -d; echo "mã=$?"</code></pre>
<div class="out">don-log.sh — nén log cũ hơn N ngày, xoá bản nén cũ hơn M ngày.
Cách dùng: don-log.sh [-n|--dry-run] [-v|--verbose] [-d N|--days=N] [--keep=M] THƯ_MỤC
mã=0
2026-09-28 16:46:09 INFO  [dry-run] gzip -- logs/app-10.log
2026-09-28 16:46:09 INFO  [dry-run] gzip -- logs/app-20.log
2026-09-28 16:46:09 INFO  [dry-run] gzip -- logs/app-40.log
2026-09-28 16:46:09 INFO  đã nén 3 file cũ hơn 7 ngày
2026-09-28 16:46:09 INFO  [dry-run] find logs -type f -name *.log.gz -mtime +30 -delete
mã=0
2026-09-28 16:46:09 DEBUG chạy: gzip -- logs/app-20.log
2026-09-28 16:46:09 DEBUG chạy: gzip -- logs/app-40.log
2026-09-28 16:46:09 INFO  đã nén 2 file cũ hơn 15 ngày
2026-09-28 16:46:09 DEBUG chạy: find logs -type f -name *.log.gz -mtime +30 -delete
mã=0
2026-09-28 16:46:09 ERROR cần -d N hoặc --days=N
mã=2
2026-09-28 16:46:09 ERROR cờ lạ: xyz (xem --help)
mã=2
2026-09-28 16:46:09 ERROR cờ -d cần giá trị
mã=2</div>
<p>(Thư mục log có các file được <code>touch</code> lùi 1, 5, 10, 20 và 40 ngày.) Hai chi tiết đáng để ý trong output thật. Lần chạy thứ hai, <code>find … -delete</code> xoá luôn <code>app-40.log.gz</code>: <code>gzip</code> giữ nguyên thời điểm sửa (mtime) của file gốc, nên một log 40 ngày tuổi vừa nén xong đã "cũ hơn 30 ngày" — đúng, nhưng bất ngờ nếu bạn không biết. Và <code>--days logs</code> không cướp <code>logs</code> làm giá trị: với mẹo <code>-:</code>, cờ dài chỉ nhận giá trị viết dạng <code>--days=N</code>; script nói rõ điều đó thay vì đoán. Hỗ trợ <code>--days N</code> có dấu cách thì làm được, nhưng cần tính toán <code>OPTIND</code> rất dễ sai — cần dạng đó thì vòng <code>while/case</code> của Bài 7.2 là lựa chọn tốt hơn.</p>
<table>
<tr><th>Mảnh của <code>':nvd:h-:'</code></th><th>Nghĩa</th></tr>
<tr><td><code>:</code> ở đầu</td><td>chế độ im lặng: getopts không in gì, bạn tự báo lỗi (<code>opt=?</code> khi cờ lạ, <code>opt=:</code> khi thiếu giá trị)</td></tr>
<tr><td><code>n v h</code></td><td>cờ không có giá trị</td></tr>
<tr><td><code>d:</code></td><td><code>-d</code> cần giá trị → <code>$OPTARG</code></td></tr>
<tr><td><code>-:</code></td><td><code>--gì-đó</code> tới dưới dạng <code>opt=-</code>, <code>OPTARG=gì-đó</code></td></tr>
</table>

<h3>Stack trace từ FUNCNAME, BASH_LINENO và BASH_SOURCE</h3>
${slide('lx-13', 23, 'Stack trace: FUNCNAME + BASH_LINENO + BASH_SOURCE')}
<p>Bài 7.3 đã in <code>$LINENO</code> và <code>$BASH_COMMAND</code> từ bẫy ERR. Như vậy biết được dòng, nhưng trong một script dựng từ các hàm thì chỉ có dòng là chưa đủ — <code>run</code> được gọi từ nhiều chỗ. Bash giữ ba mảng song song mô tả ngăn xếp lời gọi (call stack):</p>
<ul>
<li><code>FUNCNAME[i]</code> — hàm ở độ sâu <em>i</em> (0 = hàm hiện tại; phần thân script hiện ra dưới tên <code>main</code>);</li>
<li><code>BASH_LINENO[i]</code> — dòng mà từ đó <code>FUNCNAME[i]</code> được gọi, nên dòng <em>bên trong</em> <code>FUNCNAME[i]</code> là <code>BASH_LINENO[i-1]</code>;</li>
<li><code>BASH_SOURCE[i]</code> — file định nghĩa hàm đó (quan trọng khi bạn <code>source</code> thư viện).</li>
</ul>
<p>Để thấy nó hỏng, làm thư mục log thành chỉ-đọc cho <code>gzip</code> không tạo được file output:</p>
<pre><code class="language-bash">chmod 555 logs
./don-log.sh -d 7 logs; echo "mã=$?"</code></pre>
<div class="out">gzip: logs/app-10.log.gz: Permission denied
2026-09-28 16:46:09 ERROR lệnh hỏng (mã 1): "$@"
2026-09-28 16:46:09 ERROR   tại run() don-log.sh:55
2026-09-28 16:46:09 ERROR   tại main() don-log.sh:63
2026-09-28 16:46:09 ERROR   tại (thân script) don-log.sh:69
mã=1</div>
<p>Đọc từ dưới lên: thân script gọi <code>main</code> ở dòng 69, <code>main</code> gọi <code>run</code> ở dòng 63 (lệnh <code>gzip</code> trong vòng lặp), và bên trong <code>run</code> lệnh hỏng nằm ở dòng 55. <code>$BASH_COMMAND</code> in <code>"$@"</code> — lệnh đúng như viết trong mã nguồn, trước khai triển — nên số dòng mới quan trọng. Bẫy chỉ nổ một lần, không phải mỗi tầng một lần, vì <code>set -e</code> kết thúc script ngay sau đó. Thiếu <code>-E</code> trong <code>set -Eeuo</code> thì bẫy không hề nổ bên trong hàm (Bài 7.3). Bash còn có sẵn một lệnh cho việc này, <code>caller</code>: trong một bài thử nhỏ, <code>trace() { local i=0; while caller "$i"; do ((i++)); done; }</code> gọi từ <code>b</code> ← <code>a</code> ← thân script đã in <code>3 b d1.sh</code>, <code>4 a d1.sh</code>, <code>5 main d1.sh</code> — dòng, hàm, file cho từng tầng.</p>

<h3>Log có mức, màu, và khoá</h3>
<p>Bốn hàm log dùng chung một <code>log</code>: mốc giờ, mức cố định độ rộng (<code>%-5s</code> giữ các cột thẳng hàng), lời nhắn, tất cả ra <strong>stderr</strong> để stdout sạch cho output thật (Bài 7.5). <code>debug</code> chỉ in khi có <code>-v</code>, và kết thúc bằng <code>return 0</code> — thiếu nó, <code>(( VERBOSE )) &amp;&amp; …</code> sẽ trả mã 1 khi không bật verbose, và dưới <code>set -e</code> lần gọi <code>debug</code> đầu tiên sẽ giết script. Mã màu chỉ thêm khi <code>[[ -t 2 ]]</code>: khi stderr bị chuyển vào file hay bị CI hứng, các mã đó chỉ là rác.</p>
<div class="pitfall">Dòng <code>return 0</code> ở cuối <code>debug</code> không phải để trang trí. Đo khi thiếu nó: <code>set -e; VERBOSE=0; debug() { (( VERBOSE )) &amp;&amp; echo "DEBUG $*"; }; echo trước; debug x; echo "sau"</code> in <code>trước</code> rồi thoát mã 1 — lệnh cuối của hàm là một chuỗi <code>&amp;&amp;</code> trả 1, nên CẢ lời gọi hàm hỏng và <code>set -e</code> dừng script mà không một lời nhắn. Hàm trợ giúp nào có lúc hợp lệ "không làm gì" đều phải kết thúc bằng <code>return 0</code> tường minh.</div>
<p>Khoá dùng <code>flock</code> của Bài 7.3 trên một fd bash tự cấp. Đo bằng cách khởi động hai bản cùng lúc:</p>
<pre><code class="language-bash">./don-log.sh -n logs &amp; ./don-log.sh -n logs; wait</code></pre>
<div class="out">2026-09-28 16:46:09 ERROR đang có một bản don-log.sh khác chạy
2026-09-28 16:46:09 INFO  [dry-run] gzip -- logs/app-10.log
2026-09-28 16:46:09 INFO  đã nén 1 file cũ hơn 7 ngày
2026-09-28 16:46:09 INFO  [dry-run] find logs -type f -name *.log.gz -mtime +30 -delete</div>
<p>Một bản làm việc; bản kia từ chối với mã thoát 3. Cron chạy việc này năm phút một lần cũng không bao giờ chồng bản.</p>

<h3>Kiểm thử bằng bats-core: dữ liệu mẫu và lệnh giả</h3>
${slide('lx-13', 24, 'bats-core: kiểm script như kiểm code')}
<p>Bài 7.4 đã viết hai bài test <code>bats</code>. Một bộ test thật cần thêm hai ý: <strong>dữ liệu mẫu</strong> (fixture) sạch cho mỗi test, và <strong>lệnh giả</strong> (fake/stub) để đi được vào những nhánh hỏng mà bạn khó gây ra thật. Trên Ubuntu, <code>sudo apt install bats</code> cài bats-core 1.10.0.</p>
<pre><code class="language-bash">#!/usr/bin/env bats
<span class="tok-comment"># test/don-log.bats — chạy: bats test/</span>

setup() {                                   <span class="tok-comment"># chạy TRƯỚC mỗi test</span>
  SCRIPT="$BATS_TEST_DIRNAME/../don-log.sh"
  LOGS="$BATS_TEST_TMPDIR/logs"             <span class="tok-comment"># thư mục riêng, bats tự xoá</span>
  mkdir -p "$LOGS"
  touch -d '-2 days'  "$LOGS/moi.log"
  touch -d '-10 days' "$LOGS/cu.log"
  export TMPDIR=$BATS_TEST_TMPDIR           <span class="tok-comment"># mỗi test một khoá riêng</span>
}

@test "--help in cách dùng, mã 0" {
  run "$SCRIPT" --help
  [ "$status" -eq 0 ]
  [[ $output == *"Cách dùng"* ]]
}

@test "cờ lạ ⇒ mã 2 và nói rõ cờ nào" {
  run "$SCRIPT" --xoa-het "$LOGS"
  [ "$status" -eq 2 ]
  [[ $output == *"cờ lạ: xoa-het"* ]]
}

@test "--dry-run không đụng vào file nào" {
  run "$SCRIPT" --dry-run "$LOGS"
  [ "$status" -eq 0 ]
  [ -f "$LOGS/cu.log" ]
  [ ! -e "$LOGS/cu.log.gz" ]
}

@test "chỉ nén file cũ hơn --days" {
  run "$SCRIPT" --days=7 "$LOGS"
  [ "$status" -eq 0 ]
  [ -f "$LOGS/cu.log.gz" ]
  [ -f "$LOGS/moi.log" ]
}

@test "gzip hỏng ⇒ mã ≠ 0 và có stack trace" {
  mkdir -p "$BATS_TEST_TMPDIR/bin"
  printf '#!/bin/sh\\nexit 1\\n' &gt; "$BATS_TEST_TMPDIR/bin/gzip"   <span class="tok-comment"># gzip GIẢ</span>
  chmod +x "$BATS_TEST_TMPDIR/bin/gzip"
  PATH="$BATS_TEST_TMPDIR/bin:$PATH" run "$SCRIPT" "$LOGS"       <span class="tok-comment"># được tìm thấy TRƯỚC trong PATH</span>
  [ "$status" -eq 1 ]
  [[ $output == *"tại run()"* ]]
}</code></pre>
<div class="out">$ bats -p test/
don-log.bats
 ✓ --help in cách dùng, mã 0
 ✓ cờ lạ ⇒ mã 2 và nói rõ cờ nào
 ✓ --dry-run không đụng vào file nào
 ✓ chỉ nén file cũ hơn --days
 ✓ gzip hỏng ⇒ mã ≠ 0 và có stack trace

5 tests, 0 failures</div>
<p>Và một bài test hỏng trông thế nào — cố ý đổi một dòng kiểm từ 2 thành 0:</p>
<div class="out"> ✗ cờ lạ ⇒ mã 2 và nói rõ cờ nào
   (in test file /tmp/sai.bats, line 21)
     &#96;[ "$status" -eq 0 ]' failed
1 test, 1 failure</div>
<table>
<tr><th>Mảnh của bats</th><th>Nghĩa</th></tr>
<tr><td><code>@test "tên" { … }</code></td><td>một bài test; hỏng nếu bất kỳ dòng nào trả mã khác 0</td></tr>
<tr><td><code>run lệnh tham_số</code></td><td>chạy lệnh mà không làm test hỏng, cất <code>$status</code> và <code>$output</code> (stdout + stderr)</td></tr>
<tr><td><code>setup</code> / <code>teardown</code></td><td>chạy trước / sau mỗi test</td></tr>
<tr><td><code>$BATS_TEST_TMPDIR</code></td><td>thư mục tạm mới cho mỗi test, tự xoá sau đó</td></tr>
<tr><td><code>$BATS_TEST_DIRNAME</code></td><td>thư mục chứa file <code>.bats</code> — tìm script theo đường dẫn tương đối từ đó</td></tr>
<tr><td><code>PATH="$gia:$PATH" run …</code></td><td>thay một lệnh thật bằng lệnh giả, chỉ trong test này</td></tr>
<tr><td><code>bats -p</code> · <code>--tap</code> · <code>-f regex</code></td><td>output đẹp · output TAP cho CI · chỉ chạy test khớp tên</td></tr>
</table>
<p>Bài test <code>gzip</code> giả là mẫu quan trọng nhất: nó chứng minh nhánh hỏng — mã thoát và stack trace — mà không phải làm hỏng một cái đĩa thật. Cùng mẹo đó giả được <code>docker</code>, <code>curl</code> hay <code>ssh</code> để kiểm thử một script deploy. Thêm bài test thứ sáu tự giữ khoá trước (<code>exec {k}&gt;"$TMPDIR/don-log.sh.lock"; flock -n "$k"</code>) rồi đòi mã 3 cũng qua: <code>6 tests, 0 failures</code>.</p>

<h3>ShellCheck và shfmt: một lệnh lint</h3>
${slide('lx-13', 25, 'shellcheck bắt lỗi mảng; shfmt giữ một kiểu viết')}
<p>ShellCheck (Bài 7.4) biết các lỗi mảng của Bài 13.1. Trên một file bốn dòng toàn lỗi kinh điển:</p>
<pre><code class="language-bash">files=( $(find . -name '*.log') )
echo "có $files file"
for f in \${files[@]}; do gzip "$f"; done
ds="a b c"; arr=($ds)</code></pre>
<div class="out">$ shellcheck -f gcc mang-sai.sh
mang-sai.sh:2:9: warning: Prefer mapfile or read -a to split command output (or quote to avoid splitting). [SC2207]
mang-sai.sh:3:10: warning: Expanding an array without an index only gives the first element. [SC2128]
mang-sai.sh:4:10: error: Double quote array expansions to avoid re-splitting elements. [SC2068]
mang-sai.sh:5:18: warning: Quote to prevent word splitting/globbing, or split robustly with mapfile or read -a. [SC2206]</div>
<p><code>-f gcc</code> in mỗi lỗi một dòng (<code>file:dòng:cột</code>), đúng định dạng trình soạn thảo và CI đánh dấu được. Một cái bẫy gặp ngay lúc ghi bài này: trong container có locale POSIX trơn, định dạng output mặc định của ShellCheck <strong>đổ vỡ</strong> vì chữ tiếng Việt trong script — <code>mang-sai.sh: &lt;stdout&gt;: commitBuffer: invalid argument (invalid character)</code>. Chạy <code>LC_ALL=C.UTF-8 shellcheck …</code> là hết. Ảnh Docker tối giản và máy chạy CI thường mang đúng cái locale đó.</p>
<p><strong>shfmt</strong> với bash giống Prettier với JavaScript: nó viết lại thụt lề và bố cục theo một kiểu thống nhất, để diff khi review code cho thấy thay đổi logic chứ không phải cuộc chiến dấu cách. <code>sudo apt install shfmt</code> cho bản 3.8.0.</p>
<pre><code class="language-bash">shfmt -d -i 2 -ci lon-xon.sh     <span class="tok-comment"># -d: chỉ in diff, không sửa gì</span></code></pre>
<div class="out">--- lon-xon.sh.orig
+++ lon-xon.sh
@@ -1,11 +1,10 @@
 #!/usr/bin/env bash
-if [ -f a ]
-then
-echo co
+if [ -f a ]; then
+  echo co
 fi
-for f in *.log ;do
-    gzip "$f"
-  done
+for f in *.log; do
+  gzip "$f"
+done
 case $1 in
-a) echo A;;
+  a) echo A ;;
 esac</div>
<table>
<tr><th>Cờ</th><th>Nghĩa</th></tr>
<tr><td><code>-i 2</code></td><td>thụt lề 2 dấu cách (0 = dùng tab)</td></tr>
<tr><td><code>-ci</code></td><td>thụt các nhánh bên trong <code>case</code></td></tr>
<tr><td><code>-d</code></td><td>in diff và thoát mã 1 nếu file chưa đúng kiểu — dành cho CI</td></tr>
<tr><td><code>-l</code></td><td>liệt kê các file chưa đúng kiểu</td></tr>
<tr><td><code>-w</code></td><td>ghi đè file tại chỗ</td></tr>
</table>
<p>Gom ba phép kiểm sau một lệnh, bạn chạy trước mỗi commit và CI chạy mỗi lần push:</p>
<pre><code class="language-bash">#!/usr/bin/env bash
<span class="tok-comment"># lint.sh — chạy trước mỗi commit và trong CI</span>
set -euo pipefail
export LC_ALL=C.UTF-8
shellcheck -S warning ./*.sh
shfmt -d -i 2 -ci don-log.sh &gt;/dev/null || { echo "shfmt: don-log.sh chưa đúng kiểu (shfmt -w để sửa)" &gt;&amp;2; exit 1; }
bats test/</code></pre>
<div class="out">$ bash lint.sh; echo "mã=$?"
shfmt: don-log.sh chưa đúng kiểu (shfmt -w để sửa)
mã=1</div>
<p>Nó hỏng — trên chính script của bài này. Các hàm gọn một dòng (<code>debug() { …; return 0; }</code>) và các nhánh <code>case</code> căn thẳng cột không phải kiểu của shfmt. Sau <code>shfmt -w -i 2 -ci don-log.sh</code>, file dài từ 69 lên 89 dòng, và <code>lint.sh</code> qua: ShellCheck im lặng, định dạng sạch, <code>1..5</code> và <code>ok</code> cho cả năm test, <code>mã=0</code>. Nhóm có chấp nhận bố cục của shfmt hay không là quyết định của nhóm; điều quan trọng là MÁY giữ lời thoả thuận, chứ không phải người review.</p>

<h3>Khi nào thôi viết bash</h3>
${slide('lx-13', 26, 'Khi nào thôi viết bash, chuyển sang Python')}
<p>Google Shell Style Guide nói thẳng: "If you are writing a script that is more than 100 lines long, or that uses non-straightforward control flow logic, you should rewrite it in a more structured language now." (Nếu bạn đang viết một script dài hơn 100 dòng, hoặc có luồng điều khiển rối rắm, hãy viết lại nó bằng một ngôn ngữ có cấu trúc hơn ngay bây giờ.) Số dòng là một mẹo ước lượng, không phải luật — <code>don-log.sh</code> dài 69 dòng với luồng điều khiển thẳng, và là một script bash tốt. Dấu hiệu bash đã thành công cụ SAI thì cụ thể hơn:</p>
<table>
<tr><th>Dấu hiệu</th><th>Vì sao bash yếu ở đó</th></tr>
<tr><td>Cần dữ liệu lồng nhau: danh sách bản ghi, JSON nhiều tầng</td><td>mảng chỉ một tầng, mọi giá trị là chuỗi (Bài 13.1)</td></tr>
<tr><td>Số thập phân, ngày tháng, tiền</td><td><code>$(( ))</code> chỉ có số nguyên; phép tính nào cũng phải fork <code>bc</code> hay <code>awk</code></td></tr>
<tr><td>Xử lý từng dòng của dữ liệu lớn</td><td>chậm hơn một <code>awk</code> 30–2.800 lần (Bài 13.3)</td></tr>
<tr><td>Thử lại có giãn cách, timeout, nhiều loại lỗi</td><td>chỉ có mã thoát 0–255, không có exception</td></tr>
<tr><td>Phải chạy trên macOS gốc lẫn Linux</td><td>nửa chương này không có trong bash 3.2</td></tr>
<tr><td>Muốn kiểm thử đơn vị chính phần logic</td><td>bats kiểm hành vi từ bên ngoài; tách từng hàm ra kiểm rất vụng</td></tr>
</table>
<p>Để so sánh, bài đếm IP của Bài 13.1 viết bằng Python:</p>
<pre><code class="language-python">import sys, collections
dem = collections.Counter(dong.split(maxsplit=1)[0] for dong in sys.stdin)
for ip, n in dem.most_common(3):
    print(f"{n:7d} {ip}")</code></pre>
<div class="out">  30270 10.0.2.75
  15456 10.0.1.167
  10471 10.0.1.171</div>
<p><code>hyperfine</code>: 64,1 ms ± 8,5 cho <code>python3 dem.py &lt; access.log</code> — cùng hạng với <code>awk</code> (58 ms), nhanh hơn vòng bash 27 lần, và dễ mở rộng thành "top IP theo từng giờ, bỏ qua health check của chính mình" hơn nhiều. Cách chia khoẻ mạnh thường là dùng cả hai: <strong>bash điều phối</strong> (chạy <code>docker</code>, <code>git</code>, <code>rsync</code>, kiểm mã thoát, giữ khoá), <strong>Python tính toán</strong> (<code>bao_cao=$(python3 tinh.py &lt; access.log)</code>).</p>

<h3>Chạy thử từng bước</h3>
<ol>
<li>Lưu <code>don-log.sh</code>, <code>chmod +x</code>, <code>shellcheck don-log.sh</code> → im lặng.</li>
<li><code>mkdir logs; for d in 1 5 10 20 40; do touch -d "-$d days" logs/app-$d.log; done</code>, rồi <code>./don-log.sh -n --days=7 logs</code> → ba dòng dry-run.</li>
<li><code>./don-log.sh --xyz logs; echo $?</code> → <code>cờ lạ: xyz</code>, 2.</li>
<li><code>chmod 555 logs; ./don-log.sh -d 7 logs</code> → stack trace; rồi <code>chmod 755 logs</code>.</li>
<li><code>mkdir test</code>, lưu file <code>.bats</code>, <code>bats -p test/</code> → 5 dấu ✓.</li>
<li>Lưu <code>lint.sh</code>, chạy, đọc vì sao nó hỏng, <code>shfmt -w -i 2 -ci don-log.sh</code>, chạy lại → <code>mã=0</code>.</li>
</ol>

<h3>Trên macOS và WSL khác gì</h3>
<table>
<tr><th>Thứ trong bài</th><th>Ubuntu / WSL2</th><th>Mac (đo thật)</th></tr>
<tr><td><code>/bin/bash don-log.sh -n logs</code></td><td>chạy được</td><td>dừng ở dòng 5: <code>shopt: inherit_errexit: invalid shell option name</code>, mã 1</td></tr>
<tr><td>sau khi bỏ dòng đó</td><td>—</td><td><code>line 58: exec: {lock}: not found</code>, mã 127; và mọi dòng log hỏng với <code>printf: &#96;(': invalid format character</code> (<code>--xyz</code> in hai lần); cũng không có lệnh <code>flock</code></td></tr>
<tr><td><code>getopts</code> có <code>-:</code>, <code>FUNCNAME</code>, <code>BASH_LINENO</code>, <code>caller</code></td><td>chạy được</td><td>chạy được trong bash 3.2</td></tr>
<tr><td><code>shellcheck</code>, <code>shfmt</code>, <code>bats</code></td><td><code>apt install</code></td><td><code>brew install shellcheck shfmt bats-core</code></td></tr>
<tr><td><code>touch -d '-10 days'</code> trong test</td><td>cú pháp GNU</td><td><code>touch</code> của BSD không hiểu ngày tương đối: <code>touch -t YYYYMMDDhhmm</code></td></tr>
</table>
<p>Tóm lại cho thật thà: một script bash mức chuyên gia nhắm tới <strong>bash 5 trên Linux</strong>. Nếu nó phải chạy trên Mac của bạn cùng nhóm, hoặc khai rõ phụ thuộc (<code>brew install bash util-linux</code>, <code>#!/usr/bin/env bash</code>, và <code>(( BASH_VERSINFO[0] &gt;= 5 )) || die "cần bash 5"</code> ở đầu script), hoặc chạy nó trong container. WSL2 là Ubuntu nên chạy nguyên như thế.</p>

<h3>Khi nào dùng cái nào</h3>
<ul>
<li><strong>getopts có <code>-:</code></strong> khi muốn gộp cờ ngắn và có <code>--tên=giá_trị</code>; vòng <code>while/case</code> của Bài 7.2 khi cần cả <code>--tên giá_trị</code>.</li>
<li><strong>Stack trace</strong> cho mọi script có hơn vài hàm; <strong>log có mức</strong> cho mọi thứ cron hay CI chạy.</li>
<li><strong>bats</strong> ngay khi script deploy, xoá hay tính tiền thứ gì đó; lệnh giả cho mọi nhánh hỏng.</li>
<li><strong>lint.sh</strong> (ShellCheck + shfmt + bats) trong CI từ ngày đầu — thêm mất một phút mà bắt loại lỗi SC2068 mãi mãi.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> nhóm bạn sắp chạy <code>don-log.sh</code> bằng cron trên VPS của đồ án. Trước khi nó lên đó, làm cho nó đáng tin — trong container <code>ubuntu:24.04</code> đã cài <code>shellcheck shfmt bats</code>.</p><ol>
<li>Chép <code>don-log.sh</code> và năm bài test; chạy <code>bats -p test/</code> và được 5 dấu ✓.</li>
<li>Thêm bài test thứ sáu: tự giữ khoá bằng <code>exec {k}&gt;"$TMPDIR/don-log.sh.lock"; flock -n "$k"</code>, chạy script, đòi mã 3 và lời nhắn <code>đang có một bản</code>.</li>
<li>Thêm bài test thứ bảy cho dữ liệu sai: <code>--keep=abc</code> phải cho mã 2 và nhắc <code>phải là số</code>.</li>
<li>Viết <code>lint.sh</code> như trên; làm cho nó qua (để shfmt định dạng lại, rồi chạy lại test).</li>
<li>Chạy <code>/bin/bash don-log.sh -n logs</code> trên Mac (hoặc đọc bảng ở trên) và ghi lại dòng đầu tiên vỡ và vì sao.</li></ol>
<p><strong>Đạt khi:</strong> <code>bats test/</code> báo <code>7 tests, 0 failures</code>, <code>bash lint.sh; echo $?</code> in <code>0</code>, và bạn giải thích được trong một câu vì sao Mac hỏng ở dòng 5.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Long option (cờ dài)</span><span class="v">Cờ viết <code>--tên</code> hoặc <code>--tên=giá_trị</code>; <code>getopts</code> xử lý bằng mẹo <code>-:</code>.</span></div>
  <div class="kv"><span class="k">Stack trace (vết ngăn xếp)</span><span class="v">Chuỗi lời gọi hàm, kèm file và dòng, dẫn tới một lỗi.</span></div>
  <div class="kv"><span class="k"><code>FUNCNAME</code> / <code>BASH_LINENO</code> / <code>BASH_SOURCE</code></span><span class="v">Ba mảng song song của bash mô tả ngăn xếp lời gọi: hàm, dòng gọi, file.</span></div>
  <div class="kv"><span class="k"><code>inherit_errexit</code></span><span class="v">Tuỳ chọn shell (4.4+) giữ <code>set -e</code> còn hiệu lực bên trong <code>$( )</code>.</span></div>
  <div class="kv"><span class="k">Log level (mức log)</span><span class="v">Nhãn mức độ (DEBUG/INFO/WARN/ERROR) để người đọc và công cụ lọc lời nhắn.</span></div>
  <div class="kv"><span class="k">Fixture (dữ liệu mẫu)</span><span class="v">Dữ liệu thử dựng mới trước mỗi test (<code>setup</code>) để các test không phụ thuộc nhau.</span></div>
  <div class="kv"><span class="k">Fake / stub (lệnh giả)</span><span class="v">Một script tí hon đặt đầu <code>PATH</code>, đóng vai lệnh thật để ép chạy một nhánh mã.</span></div>
  <div class="kv"><span class="k">Linter / formatter (bộ soi lỗi / bộ định dạng)</span><span class="v">Công cụ tìm lỗi tiềm ẩn (ShellCheck) / công cụ viết lại bố cục theo một kiểu cố định (shfmt).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Thêm vào khung Chương 7: <code>inherit_errexit</code>, log có mức ra stderr (màu chỉ khi <code>[[ -t 2 ]]</code>), stack trace, <code>exec {lock}</code> + <code>flock</code>, và mã thoát có ghi rõ nghĩa.</li>
<li><code>getopts ':…-:'</code> biến <code>--days=9</code> thành <code>opt=-</code>, <code>OPTARG=days=9</code>; tách ở dấu <code>=</code> rồi một <code>case</code> xử lý cả dạng ngắn lẫn dài.</li>
<li><code>FUNCNAME[i]</code> cùng <code>BASH_LINENO[i-1]</code> và <code>BASH_SOURCE[i]</code> cho hàm, dòng và file của từng tầng; thân script mang tên <code>main</code>.</li>
<li>bats: <code>setup</code> + <code>$BATS_TEST_TMPDIR</code> cho dữ liệu mẫu, <code>run</code> để có <code>$status</code>/<code>$output</code>, lệnh giả đứng đầu <code>PATH</code> cho các nhánh hỏng.</li>
<li>Một <code>lint.sh</code> = ShellCheck (kèm <code>LC_ALL=C.UTF-8</code>) + <code>shfmt -d</code> + <code>bats</code>, chạy ở máy mình và trong CI.</li>
<li>Chuyển sang Python khi dữ liệu lồng nhau, số là số thực, dữ liệu lớn hoặc phải chạy trên macOS gốc; bash điều phối, Python tính toán.</li>
</ul>

<a class="link-card" href="https://bats-core.readthedocs.io/" target="_blank" rel="noopener">
  <span class="lc-ico">🦇</span>
  <span class="lc-body"><span class="lc-title">Tài liệu bats-core</span><span class="lc-sub">Viết test, <code>run</code>, <code>setup</code>/<code>teardown</code>, các biến đặc biệt và thư viện hỗ trợ bats-assert, bats-file.</span></span>
</a>
<a class="link-card" href="https://mywiki.wooledge.org/BashFAQ/035" target="_blank" rel="noopener">
  <span class="lc-ico">🚩</span>
  <span class="lc-body"><span class="lc-title">BashFAQ 035 — tuỳ chọn dòng lệnh</span><span class="lc-sub">So sánh getopts, vòng lặp tự viết và cờ dài, kèm cạm bẫy của từng cách.</span></span>
</a>
<a class="link-card" href="https://github.com/mvdan/sh" target="_blank" rel="noopener">
  <span class="lc-ico">🧹</span>
  <span class="lc-body"><span class="lc-title">mvdan/sh — shfmt</span><span class="lc-sub">Bộ phân tích và định dạng shell: các cờ, tích hợp trình soạn thảo và dùng trong CI.</span></span>
</a>
<a class="link-card" href="https://google.github.io/styleguide/shellguide.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Google Shell Style Guide</span><span class="lc-sub">Nguồn gốc luật "100 dòng", cùng quy ước đặt tên, <code>main</code>, và cách in lỗi.</span></span>
</a>
<p class="note-ct"><strong>Thói quen mang về:</strong> một script chỉ xong khi nó chỉ được cho người lạ biết nó hỏng ở đâu, giữ một log đọc được, có một <code>lint.sh</code> lên màu xanh — và khi bạn đã tự hỏi, thật lòng, liệu tính năng kế tiếp có nên nằm trong Python hay không.</p>
</div>
`,
    },
    /* ─────────────────────────── 13.5 ─────────────────────────── */
    {
      title: "13.5 — Chapter 13 check|||13.5 — Kiểm tra Chương 13",
      slug: "lnx-13-5-quiz",
      type: "QUIZ",
      isFreePreview: true,
      description: "Mười câu tình huống, đáp án đã chạy thật: quên declare -A, mảng thưa, mapfile sau ống dẫn, nameref, đổi chỗ stdout/stderr, heredoc có nháy, fork trong vòng lặp, xargs thiếu -n1, (( n++ )) với set -e, và bash 3.2 của Mac.",
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten questions, mostly "what does this print?" and "which line fixes it?". Every expected output was run on 28/09/2026 in an Ubuntu 24.04 container (bash 5.2.21), or on a Mac (bash 3.2.57) where the question says so.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can create, loop over and debug indexed and associative arrays, including sparse ones, and I know what happens when <code>declare -A</code> is missing.</li>
<li>I can read a file into an array with <code>mapfile</code> and pass an array into a function with <code>local -n</code>.</li>
<li>I can open descriptors with <code>exec {fd}</code>, swap stdout and stderr, and explain what <code>&lt;(…)</code> hands to a command.</li>
<li>I choose the right heredoc form, and I can read arbitrary filenames with <code>find -print0</code> and <code>read -r -d ''</code>.</li>
<li>I can remove forks from a slow loop, run jobs in parallel with <code>xargs -n1 -P</code> or a <code>wait -n</code> queue, and prove the gain with <code>hyperfine</code>.</li>
<li>I can add long options, a stack trace, bats tests and a <code>lint.sh</code> to a script — and say when it should become Python instead.</li>
</ul>
${slide('lx-13', 29, 'Bảng tra nhanh Chương 13 (1/2): mảng và luồng')}
${slide('lx-13', 30, 'Bảng tra nhanh Chương 13 (2/2): tốc độ và chuyên nghiệp')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười câu, phần lớn là "lệnh này in ra gì?" và "dòng nào sửa được lỗi?". Mọi output trong đáp án đã chạy thật ngày 28/09/2026 trong container Ubuntu 24.04 (bash 5.2.21), hoặc trên Mac (bash 3.2.57) khi câu hỏi nói vậy.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi tạo, lặp và gỡ lỗi được mảng chỉ số và mảng kết hợp, kể cả mảng thưa, và biết chuyện gì xảy ra khi thiếu <code>declare -A</code>.</li>
<li>Tôi đọc được một file vào mảng bằng <code>mapfile</code> và đưa mảng vào hàm bằng <code>local -n</code>.</li>
<li>Tôi mở được bộ mô tả bằng <code>exec {fd}</code>, đổi chỗ stdout và stderr, và giải thích được <code>&lt;(…)</code> đưa cho lệnh cái gì.</li>
<li>Tôi chọn đúng kiểu heredoc, và đọc được tên file bất kỳ bằng <code>find -print0</code> với <code>read -r -d ''</code>.</li>
<li>Tôi bỏ được fork khỏi một vòng lặp chậm, chạy việc song song bằng <code>xargs -n1 -P</code> hoặc hàng đợi <code>wait -n</code>, và chứng minh được bằng <code>hyperfine</code>.</li>
<li>Tôi thêm được cờ dài, stack trace, test bats và một <code>lint.sh</code> vào script — và nói được khi nào nó nên thành Python.</li>
</ul>
${slide('lx-13', 29, 'Bảng tra nhanh Chương 13 (1/2): mảng và luồng')}
${slide('lx-13', 30, 'Bảng tra nhanh Chương 13 (2/2): tốc độ và chuyên nghiệp')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: "A deploy script keeps a service → port table. It has no \"declare -A\": p[web]=3000; p[api]=4000; echo \"${p[web]}\". What is printed on Ubuntu (bash 5.2)?|||Script deploy giữ một bảng dịch vụ → cổng. Nó KHÔNG có \"declare -A\": p[web]=3000; p[api]=4000; echo \"${p[web]}\". Trên Ubuntu (bash 5.2) in ra gì?",
            options: [
              "3000",
              "4000",
              "An empty line|||Một dòng rỗng",
              "p: bad array subscript",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: Without declare -A, p is an INDEXED array and its subscript is arithmetic: \"web\" and \"api\" are unset variable names, both worth 0, so both assignments write p[0] and the read also reads p[0] — the last value, 4000. Measured: web=4000 api=4000, declare -p p shows ([0]=\"4000\"). 3000 is what you expect if you think bash guessed \"dictionary\"; it never guesses, and it prints no error or warning either.|||VI: Không có declare -A, p là mảng CHỈ SỐ và chỉ số của nó là biểu thức số học: \"web\" và \"api\" là tên biến chưa đặt, đều bằng 0, nên cả hai phép gán ghi vào p[0] và lần đọc cũng đọc p[0] — giá trị cuối, 4000. Đo thật: web=4000 api=4000, declare -p p cho ([0]=\"4000\"). 3000 là thứ bạn mong nếu nghĩ bash tự hiểu \"từ điển\"; nó không bao giờ đoán, và cũng không in lỗi hay cảnh báo nào.",
          },
          {
            question: "a=(x y z); unset 'a[1]'; a+=(w); echo \"${!a[@]}\" — what does it print?|||a=(x y z); unset 'a[1]'; a+=(w); echo \"${!a[@]}\" — in ra gì?",
            options: [
              "0 1 2",
              "0 2",
              "0 2 3",
              "0 1 2 3",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: unset removes element 1 and leaves a hole — the others do not move up — so the indices are 0 2; += appends after the HIGHEST index, giving 3. Measured: 0 2 3. \"0 1 2\" is the tempting answer from languages whose lists re-number after a delete; in bash only a copy like a=(\"${a[@]}\") re-numbers.|||VI: unset xoá phần tử 1 và để lại một lỗ — các phần tử khác không dồn lên — nên chỉ số là 0 2; += nối vào SAU chỉ số lớn nhất, thành 3. Đo thật: 0 2 3. \"0 1 2\" là đáp án hấp dẫn nếu quen những ngôn ngữ tự đánh số lại sau khi xoá; trong bash chỉ có phép chép như a=(\"${a[@]}\") mới đánh số lại.",
          },
          {
            question: "A script contains: printf '%s\\n' a b c | mapfile -t arr; echo \"${#arr[@]}\". Run with bash 5.2 (no lastpipe). What is printed?|||Một script có dòng: printf '%s\\n' a b c | mapfile -t arr; echo \"${#arr[@]}\". Chạy bằng bash 5.2 (không bật lastpipe). In ra gì?",
            options: [
              "0",
              "3",
              "1",
              "mapfile: command not found",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: Every stage of a pipeline runs in a subshell, so mapfile fills an array in a child process that exits immediately; the parent's arr is empty — measured: 0. 3 is what you get with mapfile -t arr < <(printf …). \"command not found\" is the Mac's bash 3.2, not bash 5.2.|||VI: Mọi khâu của ống dẫn chạy trong một shell con, nên mapfile điền mảng trong một tiến trình con thoát ngay sau đó; arr của shell cha rỗng — đo thật: 0. 3 là kết quả khi viết mapfile -t arr < <(printf …). \"command not found\" là bash 3.2 của Mac, không phải bash 5.2.",
          },
          {
            question: "f() { echo out; echo err >&2; }. You run: f 3>&1 1>&2 2>&3 3>&- | wc -l. What appears in the terminal?|||f() { echo out; echo err >&2; }. Bạn chạy: f 3>&1 1>&2 2>&3 3>&- | wc -l. Terminal hiện gì?",
            options: [
              "2",
              "err, then 1|||err, rồi 1",
              "out, then 0|||out, rồi 0",
              "out, then 1|||out, rồi 1",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: Redirections are applied left to right: 3 copies the pipe, 1 becomes the terminal (a copy of 2), 2 becomes the pipe (a copy of 3), 3 is closed. So stdout (\"out\") reaches the terminal directly and only stderr (\"err\") goes through the pipe, where wc counts 1 line — measured: out, 1. \"err, then 1\" gets the swap right but forgets that what reaches the screen is the other stream.|||VI: Các phép chuyển hướng chạy từ trái sang phải: 3 chép cái ống, 1 thành terminal (chép của 2), 2 thành cái ống (chép của 3), 3 bị đóng. Nên stdout (\"out\") ra thẳng terminal và chỉ stderr (\"err\") đi qua ống, nơi wc đếm được 1 dòng — đo thật: out, 1. \"err, rồi 1\" hiểu đúng phép đổi chỗ nhưng quên rằng thứ hiện ra màn hình là luồng còn lại.",
          },
          {
            question: "A script generates nginx config with a heredoc whose body is: proxy_set_header Host $host; The generated file must contain $host literally. Which opening line is right?|||Một script sinh cấu hình nginx bằng heredoc có thân: proxy_set_header Host $host; File sinh ra phải chứa nguyên chữ $host. Dòng mở nào đúng?",
            options: [
              "cat <<EOF > site.conf",
              "cat <<'EOF' > site.conf",
              "cat <<-EOF > site.conf",
              "cat <<< EOF > site.conf",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: Quoting the delimiter word turns off every expansion in the body. Measured: with <<'EOF' the file contains proxy_set_header Host $host; — with plain <<EOF bash expanded the unset shell variable and the line became \"proxy_set_header Host ;\". <<-EOF only strips leading tabs; it still expands. <<< EOF feeds the single word \"EOF\" as a here-string.|||VI: Bọc nháy chữ kết thúc là tắt mọi khai triển trong thân. Đo thật: với <<'EOF' file chứa proxy_set_header Host $host; — với <<EOF trơn, bash khai triển biến shell chưa đặt và dòng thành \"proxy_set_header Host ;\". <<-EOF chỉ xoá tab đầu dòng, vẫn khai triển. <<< EOF đưa đúng một chữ \"EOF\" vào như here-string.",
          },
          {
            question: "A loop runs 10,000 times and does b=$(basename \"$f\") (measured 6.43 s). Which rewrite removes the fork from each iteration?|||Một vòng lặp chạy 10.000 lần và làm b=$(basename \"$f\") (đo: 6,43 s). Cách viết lại nào bỏ được lần fork trong mỗi vòng?",
            options: [
              "b=$(basename -- \"$f\")",
              "b=$(echo \"${f##*/}\")",
              "b=${f##*/}",
              "b=$(printf '%s' \"$(basename \"$f\")\")",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: ${f##*/} is parameter expansion — done inside bash, no process at all: 0.045 s for 10,000 iterations versus 6.43 s. The tempting b=$(echo \"${f##*/}\") uses the right expansion but wraps it in $( ), and every $( ) forks a subshell even for a builtin — measured: 10,000 × $(printf x) took 3.4 s. The -- version is safer for names starting with \"-\" but just as slow.|||VI: ${f##*/} là khai triển tham số — làm ngay trong bash, không tạo tiến trình nào: 0,045 s cho 10.000 vòng so với 6,43 s. Phương án hấp dẫn b=$(echo \"${f##*/}\") dùng đúng phép khai triển nhưng lại bọc trong $( ), mà mỗi $( ) đều fork một shell con kể cả với lệnh dựng sẵn — đo thật: 10.000 × $(printf x) mất 3,4 s. Bản có -- an toàn hơn với tên bắt đầu bằng \"-\" nhưng chậm y như cũ.",
          },
          {
            question: "printf '%s\\0' 1 1 1 1 | xargs -0 -P4 sleep — roughly how long does it take?|||printf '%s\\0' 1 1 1 1 | xargs -0 -P4 sleep — mất khoảng bao lâu?",
            options: [
              "About 1 second — four sleeps in parallel|||Khoảng 1 giây — bốn lệnh sleep song song",
              "About 0.25 seconds|||Khoảng 0,25 giây",
              "About 2 seconds|||Khoảng 2 giây",
              "About 4 seconds|||Khoảng 4 giây",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: Without -n, xargs puts all four items on ONE command line: a single \"sleep 1 1 1 1\", which GNU and BSD sleep add up to 4 seconds — measured 4.015 s on Ubuntu and 4.02 s on the Mac. -P4 has only one job to run. With -n1 the same input takes about 1 second, and eight items with -n1 -P4 take about 2 (measured 2.04 s).|||VI: Không có -n, xargs nhồi cả bốn mục vào MỘT dòng lệnh: một lệnh \"sleep 1 1 1 1\" duy nhất, mà sleep của GNU lẫn BSD cộng dồn thành 4 giây — đo thật 4,015 s trên Ubuntu và 4,02 s trên Mac. -P4 chỉ có một việc để chạy. Thêm -n1 thì cùng đầu vào đó mất khoảng 1 giây, còn tám mục với -n1 -P4 mất khoảng 2 giây (đo 2,04 s).",
          },
          {
            question: "bash -c 'set -e; n=0; (( n++ )); echo \"n=$n\"'; echo \"mã=$?\" — what is printed?|||bash -c 'set -e; n=0; (( n++ )); echo \"n=$n\"'; echo \"mã=$?\" — in ra gì?",
            options: [
              "Only: mã=1|||Chỉ có: mã=1",
              "n=1 then mã=0|||n=1 rồi mã=0",
              "n=0 then mã=0|||n=0 rồi mã=0",
              "n=1 then mã=1|||n=1 rồi mã=1",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: (( n++ )) evaluates to the OLD value, 0, and an arithmetic command whose value is 0 returns status 1. Under set -e that kills the shell before echo runs — measured: only \"mã=1\". n really was incremented, which makes \"n=1 then mã=0\" tempting, but nothing after the failing line runs. Write n=$((n + 1)) or (( ++n )) in scripts with set -e.|||VI: (( n++ )) có giá trị là giá trị CŨ, 0, và một lệnh số học có giá trị 0 thì trả mã 1. Dưới set -e điều đó giết shell trước khi echo kịp chạy — đo thật: chỉ có \"mã=1\". n thật ra đã được tăng, nên \"n=1 rồi mã=0\" rất hấp dẫn, nhưng không dòng nào sau lệnh hỏng được chạy. Trong script có set -e hãy viết n=$((n + 1)) hoặc (( ++n )).",
          },
          {
            question: "don-log.sh: the body calls main at line 69, main calls run at line 63, and inside run the command at line 55 fails. Inside the ERR trap on_err, what is ${BASH_LINENO[0]}?|||don-log.sh: thân script gọi main ở dòng 69, main gọi run ở dòng 63, và bên trong run lệnh ở dòng 55 hỏng. Bên trong bẫy ERR on_err, ${BASH_LINENO[0]} là bao nhiêu?",
            options: [
              "55",
              "63",
              "69",
              "The line of \"trap on_err ERR\"|||Dòng chứa \"trap on_err ERR\"",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: BASH_LINENO[i] is the line from which FUNCNAME[i] was called. FUNCNAME[0] is on_err itself, \"called\" by the trap at the failing line — 55, inside run. That is why the chapter prints FUNCNAME[i] with BASH_LINENO[i-1]: the real output was \"tại run() don-log.sh:55\", \"tại main() :63\", \"tại (thân script) :69\". 63 is BASH_LINENO[1], the line in main that called run.|||VI: BASH_LINENO[i] là dòng mà từ đó FUNCNAME[i] được gọi. FUNCNAME[0] là chính on_err, được bẫy \"gọi\" tại dòng hỏng — 55, bên trong run. Vì thế chương này in FUNCNAME[i] kèm BASH_LINENO[i-1]: output thật là \"tại run() don-log.sh:55\", \"tại main() :63\", \"tại (thân script) :69\". 63 là BASH_LINENO[1], dòng trong main đã gọi run.",
          },
          {
            question: "A script starting with #!/bin/bash works on the Ubuntu VPS. On a teammate's Mac it prints \"declare: -A: invalid option\" and then gives wrong ports. What is the right fix?|||Một script mở đầu bằng #!/bin/bash chạy tốt trên VPS Ubuntu. Trên Mac của bạn cùng nhóm nó in \"declare: -A: invalid option\" rồi cho ra cổng sai. Cách sửa đúng là gì?",
            options: [
              "Add set -e so it stops at the error|||Thêm set -e để nó dừng ở chỗ lỗi",
              "brew install bash and change the first line to #!/usr/bin/env bash|||brew install bash và đổi dòng đầu thành #!/usr/bin/env bash",
              "Replace declare -A with declare -a|||Thay declare -A bằng declare -a",
              "Run it with zsh, which has associative arrays|||Chạy bằng zsh, vì zsh có mảng kết hợp",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: /bin/bash on macOS is 3.2, which has no associative arrays (measured: invalid option, then ${port[api]} printed 5432 — the wrong value). Homebrew's bash 5 plus #!/usr/bin/env bash, which finds it through PATH, runs the script as written. set -e is tempting and does stop the wrong answers, but the script still cannot run on the Mac. declare -a is exactly the silent index-0 bug; zsh has associative arrays with different syntax and 1-based indexed arrays.|||VI: /bin/bash trên macOS là bản 3.2, không có mảng kết hợp (đo thật: invalid option, rồi ${port[api]} in 5432 — sai giá trị). bash 5 của Homebrew cộng với #!/usr/bin/env bash, thứ tìm bash qua PATH, chạy được script nguyên như đã viết. set -e hấp dẫn và đúng là chặn được câu trả lời sai, nhưng script vẫn không chạy được trên Mac. declare -a chính là con bọ dồn vào ô 0; zsh có mảng kết hợp nhưng cú pháp khác và mảng chỉ số đánh từ 1.",
          },
        ],
      },
    },
  ],
};
