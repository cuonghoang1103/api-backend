/**
 * Linux & Bash — Chương 6: Biến, dấu nháy & khai triển.
 * Biến và khai triển · dấu nháy · khai triển tham số · mã thoát và rẽ nhánh · vòng lặp · quiz.
 * Output CHẠY THẬT Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * Nâng cấp 28/09/2026: bài 6.0 slide (deck lx-06, 32 slide) + slide/🧪/🗂/📌 trong 6.1–6.5; đào sâu: bảng cờ declare/read
 * (6.1), TOÀN BỘ thứ tự khai triển của bash + chỗ được bỏ nháy / chỗ nháy đổi nghĩa + $'…' (6.2), bảng unset/rỗng/có giá
 * trị, @Q @U @A, bẫy & của patsub_replacement (bash 5.2) và độ dài theo locale (6.3), mã thoát đo thật + PIPESTATUS, bảng
 * toán tử phép thử, bẫy [[ $a -gt x ]], ;& ;;& (6.4), ba bẫy của vòng đọc dòng (ống dẫn, dòng cuối, CRLF), bảng khoảng
 * ngoặc nhọn/mapfile (6.5); "Chạy thử từng bước" và "macOS/WSL khác gì" (bash 3.2, zsh, dash) mỗi bài; quiz 10 câu.
 * Sửa chỗ SAI cũ: chú thích ${s^} bên VI nói "viết hoa mỗi chữ cái đầu" — thật ra chỉ ký tự đầu của chuỗi.
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Flinux-bash%2Flearn&reflabel=Linux%20%26%20Bash';

export default {
  title: 'Chapter 6 — Variables, quoting & expansion|||Chương 6 — Biến, dấu nháy & khai triển',
  description: 'Chương làm cho lệnh của bạn thôi vỡ vì một dấu cách trong tên file. Biến và thay thế lệnh, ba loại dấu nháy và luật duy nhất cần nhớ, khai triển tham số, mã thoát và rẽ nhánh, vòng lặp — đủ để đọc một script lạ thay vì tin nó.',
  lessons: [
    /* ─────────────────────────── 6.0 ─────────────────────────── */
    {
      title: '6.0 — Chapter 6 slides: variables, quoting and expansion in pictures|||6.0 — Slide Chương 6: biến, dấu nháy và khai triển bằng hình',
      slug: 'lnx-6-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 32 slide của Chương 6: thứ tự khai triển của bash, một biến không nháy biến thành bốn tham số, ba loại nháy soi bằng printf, ${var…} xén/thay/mặc định, mã thoát và [[ ]], vòng lặp đọc dòng và hàm — output thật trên Ubuntu, bash 3.2 và zsh của macOS.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Slides</span>
<h2>The whole chapter in 32 slides</h2>
<p class="lead">This is the chapter where the shell becomes a language, and almost every bug in it comes from one fact: bash rewrites your command line in a fixed order before running it. The slides draw that order as a picture you can follow step by step, then show each rule with a real terminal next to it — usually <code>printf '[%s]\\n'</code>, which prints every argument a command really received on its own line.</p>
<p>Slides 3–7 belong to Lesson 6.1 (assignment, <code>$( )</code>, arithmetic, <code>export</code>, special variables), 8–13 to 6.2 (the expansion order, word splitting, the kinds of quotes, <code>"$@"</code>, arrays, IFS and zsh), 14–18 to 6.3 (defaults, trimming, substitution, slicing, speed and bash 3.2), 19–23 to 6.4 (exit codes, <code>&amp;&amp;</code>/<code>||</code>, <code>[</code> versus <code>[[</code>, string versus number, file tests and <code>case</code>) and 24–28 to 6.5 (loops, <code>$(ls)</code>, <code>while read</code>, subshells and CRLF, functions). The last four are the common mistakes, a two-page cheat sheet and a 40-minute practice session. Every terminal is real output recorded on 28/09/2026 in an Ubuntu 24.04 container (bash 5.2), and on a Mac M1 with <code>/bin/bash</code> 3.2 and zsh 5.9.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Slide</span>
<h2>Cả chương trong 32 slide</h2>
<p class="lead">Đây là chương shell trở thành một ngôn ngữ, và gần như mọi lỗi trong đó đến từ một sự thật: bash VIẾT LẠI dòng lệnh của bạn theo một thứ tự cố định trước khi chạy nó. Bộ slide vẽ thứ tự đó thành một bức hình đi theo được từng bước, rồi minh hoạ mỗi luật bằng một terminal thật đặt ngay bên cạnh — thường là <code>printf '[%s]\\n'</code>, lệnh in từng tham số mà một lệnh THẬT SỰ nhận được trên một dòng riêng.</p>
<p>Slide 3–7 thuộc Bài 6.1 (gán biến, <code>$( )</code>, số học, <code>export</code>, biến đặc biệt), 8–13 thuộc 6.2 (thứ tự khai triển, cắt từ, các loại nháy, <code>"$@"</code>, mảng, IFS và zsh), 14–18 thuộc 6.3 (giá trị mặc định, xén, thay thế, cắt lát, tốc độ và bash 3.2), 19–23 thuộc 6.4 (mã thoát, <code>&amp;&amp;</code>/<code>||</code>, <code>[</code> so với <code>[[</code>, chuỗi so với số, phép thử file và <code>case</code>) và 24–28 thuộc 6.5 (vòng lặp, <code>$(ls)</code>, <code>while read</code>, shell con và CRLF, hàm). Bốn slide cuối là những sai lầm hay gặp, bảng tra nhanh hai trang và một buổi thực hành 40 phút. Mọi terminal là output THẬT, ghi ngày 28/09/2026 trong container Ubuntu 24.04 (bash 5.2), và trên Mac M1 với <code>/bin/bash</code> 3.2 cùng zsh 5.9.</p>
</div>
${gallery('lx-06', [
  [1, 'Bìa'], [2, 'Bản đồ chương'], [3, 'Dấu cách quanh ='],
  [4, '$(lệnh) và shell con'], [5, 'Số học nguyên, 08 là hệ tám'], [6, 'export sang tiến trình con'],
  [7, 'Biến đặc biệt'], [8, 'Thứ tự khai triển của bash'], [9, 'Một biến thành bốn tham số'],
  [10, 'Ba loại nháy'], [11, '"$@" so với $@ và "$*"'], [12, 'Mảng và "${a[@]}"'],
  [13, 'IFS và zsh'], [14, 'Toán tử mặc định'], [15, '# ## % %%'],
  [16, '/ // và dấu &amp;'], [17, 'Độ dài, cắt lát, hoa thường'], [18, 'Tốc độ và bash 3.2'],
  [19, 'Mã thoát'], [20, 'a &amp;&amp; b || c'], [21, '[ và [['],
  [22, 'So chuỗi, so số'], [23, 'Phép thử file và case'], [24, 'for và khoảng ngoặc nhọn'],
  [25, 'Đừng lặp trên $(ls)'], [26, 'while IFS= read -r'], [27, 'Shell con và CRLF'],
  [28, 'Hàm'], [29, 'Sai lầm hay gặp'], [30, 'Bảng tra nhanh (1/2)'],
  [31, 'Bảng tra nhanh (2/2)'], [32, 'Thực hành chương 6'],
])}
`,
    },
    /* ─────────────────────────── 6.1 ─────────────────────────── */
    {
      title: '6.1 — Variables, command substitution and arithmetic|||6.1 — Biến, thay thế lệnh và số học',
      slug: 'lnx-6-1-bien-thay-the-lenh',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Gán biến không được có dấu cách và vì sao, ${var} với $var, $(lệnh) thay cho dấu huyền, $((số học)), biến shell với biến môi trường, và những biến dựng sẵn đáng thuộc.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Variables and substitution</h2>
<p class="lead">This chapter is where the shell stops being a command launcher and becomes a programming language. It is also where most people's scripts start breaking on filenames with spaces — so the goal is not just "how do I store a value", but "why does <em>this</em> exact syntax matter". Everything here is one idea: the shell rewrites your command line before running it, and you are choosing what it rewrites.</p>

<h3>Assignment: no spaces</h3>
${slide('lx-06', 3, 'Dấu cách quanh = biến phép gán thành một lệnh')}
<pre><code>name="Binh"              <span class="tok-comment"># correct</span>
name = "Binh"            <span class="tok-comment"># WRONG</span>
name= "Binh"             <span class="tok-comment"># WRONG, differently</span></code></pre>
<div class="out">bash: name: command not found
bash: Binh: command not found</div>
<p>The error messages give the reason away. The shell splits a command line on whitespace and treats the first word as a command — so <code>name = "Binh"</code> means "run the program <code>name</code> with arguments <code>=</code> and <code>Binh</code>". An assignment is only an assignment when there is no space on either side of the <code>=</code>. This is not a style rule; it is how the parser distinguishes the two.</p>
<pre><code>count=42
path=/srv/app
greeting="hello world"   <span class="tok-comment"># quotes needed: the space would split it</span>
empty=
readonly VERSION=1.2.0   <span class="tok-comment"># cannot be reassigned afterwards</span>
unset count              <span class="tok-comment"># remove it entirely</span></code></pre>

<h3>Reading a variable back</h3>
<pre><code class="language-bash">echo \$name
echo "\${name}"
echo "\${name}_backup.txt"    <span class="tok-comment"># braces REQUIRED here</span>
echo "\$name_backup.txt"      <span class="tok-comment"># looks for a variable called name_backup</span></code></pre>
<div class="out">Binh
Binh
Binh_backup.txt
.txt</div>
<p>Without braces, the shell reads as far as it can: <code>\$name_backup</code> is a valid variable name, so that is what it looks for — finds nothing, substitutes empty, and you are left with <code>.txt</code>. The braces say where the name ends.</p>
<div class="callout ok"><strong>Use <code>"\${var}"</code> — braces and double quotes — as your default.</strong> The braces prevent the boundary problem above; the quotes prevent word splitting and glob expansion (Lesson 6.2). Neither costs anything, both prevent a whole class of bug, and consistency means you never have to stop and decide.</div>

<h3>Command substitution: capturing output</h3>
${slide('lx-06', 4, '$(lệnh) chạy shell con, bắt stdout, bỏ \\n cuối')}
<pre><code class="language-bash">today=\$(date +%F)
files=\$(ls | wc -l)
branch=\$(git rev-parse --abbrev-ref HEAD)
echo "On \${branch}, \${files} files, \${today}"</code></pre>
<div class="out">On main, 42 files, 2026-08-22</div>
<p><code>\$(command)</code> runs the command in a subshell, captures its stdout, strips trailing newlines, and puts the result in place. The older backtick syntax does the same thing and should be avoided:</p>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>\$( )</code></span><span class="v">Nests cleanly: <code>\$(dirname \$(readlink -f "\$0"))</code>. Quoting inside works normally. The form to use.</span></div>
  <div class="kv"><span class="k">Backticks</span><span class="v">Cannot nest without escaping backslashes, and the escaping rules inside them differ from everywhere else. Legacy only.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Trailing newlines are stripped — usually helpful</span>
content=\$(cat file.txt)

<span class="tok-comment"># stderr is NOT captured — it still goes to your terminal</span>
result=\$(some-command 2&gt;/dev/null)      <span class="tok-comment"># discard it</span>
result=\$(some-command 2&gt;&amp;1)             <span class="tok-comment"># capture it too</span>

<span class="tok-comment"># The exit code of the substitution is available as usual</span>
if ! output=\$(curl -sf "\$url"); then
  echo "fetch failed" &gt;&amp;2
fi</code></pre>
<div class="callout warn"><strong>Always quote a command substitution: <code>"\$(cmd)"</code>.</strong> Unquoted, its output goes through word splitting and globbing like any other expansion. <code>rm \$(cat filelist.txt)</code> breaks the moment a filename contains a space — and <code>files=\$(ls)</code> then <code>for f in \$files</code> is the classic broken pattern that Lesson 6.5 replaces properly.</div>

<h3>Arithmetic</h3>
${slide('lx-06', 5, 'Số học chỉ số nguyên, 08 là hệ tám')}
<pre><code>count=5
echo \$((count + 1))
echo \$((count * 2))
echo \$((10 / 3))          <span class="tok-comment"># INTEGER division — 3, not 3.33</span>
echo \$((10 % 3))          <span class="tok-comment"># remainder</span>

((count++))               <span class="tok-comment"># increment in place</span>
((count += 10))
total=\$((price * qty))

<span class="tok-comment"># Inside (( )) you do not need the \$ on variable names</span>
if (( count &gt; 10 )); then echo "big"; fi</code></pre>
<div class="out">6
10
3
1
big</div>
<div class="callout warn">Bash arithmetic is <strong>integer only</strong>. <code>\$((10 / 3))</code> is 3, and <code>\$((1 / 2))</code> is 0 — there is no rounding, it truncates. For decimals you need an external tool: <code>echo "scale=2; 10/3" | bc</code> gives 3.33, or <code>awk 'BEGIN {print 10/3}'</code>. This silently produces wrong numbers in scripts that compute percentages or averages, and nothing warns you.</div>
<div class="callout">One more sharp edge: a leading zero means <strong>octal</strong>. <code>\$((08))</code> is a syntax error ("value too great for base") because 8 is not a valid octal digit — which bites when you build a number from a zero-padded date field like <code>08</code> for August. Force base 10 with <code>\$((10#\$month))</code>.</div>

<h3>Shell variables versus environment variables</h3>
${slide('lx-06', 6, 'Chỉ biến đã export mới sang tiến trình con')}
<pre><code class="language-bash">myvar="local value"        <span class="tok-comment"># shell variable: this shell only</span>
export MYVAR="exported"    <span class="tok-comment"># environment variable: inherited by children</span>

bash -c 'echo "[\$myvar] [\$MYVAR]"'</code></pre>
<div class="out">[] [exported]</div>
<p>A child process receives a copy of the <em>environment</em>, not of the shell's own variables. This is the same inheritance you met with file descriptors and umask in Lesson 5.1 — it happens at <code>fork</code>, it is a copy, and changes on either side afterwards do not propagate back. Chapter 8 covers <code>PATH</code> and startup files in full; for now the distinction is enough.</p>
<pre><code>MYVAR=once ./script.sh     <span class="tok-comment"># set for ONE command only</span>
env | sort | head          <span class="tok-comment"># everything exported</span>
set | head                 <span class="tok-comment"># everything, including shell-only</span>
declare -p myvar           <span class="tok-comment"># show one variable with its attributes</span></code></pre>

<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Your shell</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">myvar="local"</span><span class="lz-nsub">A shell variable. Lives only here. Not part of the environment.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">export MYVAR="exported"</span><span class="lz-nsub">Marked for export — it becomes part of the environment block handed to children.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">fork + exec</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">a COPY of the environment</span><span class="lz-nsub">Only exported variables travel. The copy is one-way: nothing the child sets comes back.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Child process</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">\$myvar is empty · \$MYVAR is set</span><span class="lz-nsub">This is why "the script cannot see my variable" — it was never exported.</span></div></div>
  </div>
</div>
<h3>The built-in variables worth knowing</h3>
${slide('lx-06', 7, 'Biến đặc biệt shell tự điền')}
<div class="kv-grid">
  <div class="kv"><span class="k"><code>\$?</code></span><span class="v">Exit code of the last command. 0 = success. Lesson 6.4.</span></div>
  <div class="kv"><span class="k"><code>\$0</code></span><span class="v">The script's own name, as invoked.</span></div>
  <div class="kv"><span class="k"><code>\$1 \$2 …</code></span><span class="v">Positional arguments. <code>\${10}</code> and beyond need braces.</span></div>
  <div class="kv"><span class="k"><code>\$#</code></span><span class="v">How many arguments were passed.</span></div>
  <div class="kv"><span class="k"><code>"\$@"</code></span><span class="v">All arguments, <strong>each as its own word</strong>. Always quoted, always <code>@</code>. Lesson 6.2 explains why.</span></div>
  <div class="kv"><span class="k"><code>\$\$</code> · <code>\$!</code></span><span class="v">PID of this shell · PID of the last background job (Lesson 5.4).</span></div>
  <div class="kv"><span class="k"><code>\$RANDOM</code> · <code>\$SECONDS</code></span><span class="v">A random 0–32767 · seconds since the shell started. Handy for timing a script.</span></div>
  <div class="kv"><span class="k"><code>\$LINENO</code> · <code>\$BASH_SOURCE</code></span><span class="v">Current line number · the path of the running script. The pair used in error messages and <code>trap ERR</code> (Chapter 7).</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># The idiom for "where is this script, really" — works via symlinks</span>
SCRIPT_DIR=\$(cd "\$(dirname "\${BASH_SOURCE[0]}")" &amp;&amp; pwd)
echo "\$SCRIPT_DIR"</code></pre>
<div class="out">/srv/app/scripts</div>
<p>That line appears at the top of a great many production scripts, and it is worth reading carefully: <code>dirname</code> of the script's own path, <code>cd</code> into it, then <code>pwd</code> to get the absolute resolved form. It means the script can find its own sibling files regardless of where it was invoked from — the alternative, a relative path, breaks the moment someone runs it from another directory or via <code>cron</code>.</p>

<h3>Reading input</h3>
<pre><code>read -r -p "Branch to deploy: " branch
read -r -s -p "Password: " pass; echo      <span class="tok-comment"># -s: do not echo the typing</span>
read -r -t 10 -p "Continue? [y/N] " answer <span class="tok-comment"># -t: timeout in seconds</span></code></pre>
<div class="callout ok"><strong>Always <code>read -r</code>.</strong> Without <code>-r</code>, <code>read</code> treats backslashes as escape characters and silently mangles any input containing one — Windows paths, regexes, escaped quotes. There is no case where you want that behaviour, so make <code>-r</code> automatic. ShellCheck (Chapter 7) flags every <code>read</code> that lacks it.</div>

<h3>declare and read: the flags worth knowing</h3>
<p>Two builtins do most of the work of "a variable with rules attached". Their flags are short and easy to misread, so here they are with what each one really did in an Ubuntu 24.04 container (bash 5.2.21):</p>
<table>
<tr><th>Flag</th><th>Meaning</th><th>Tested example → result</th></tr>
<tr><td><code>declare -p v</code></td><td>Print the variable exactly as bash stores it, attributes included</td><td><code>declare -- myvar="cuc bo"</code> · <code>declare -x MYVAR="da xuat"</code> (<code>-x</code> = exported)</td></tr>
<tr><td><code>declare -i n</code></td><td>Integer: every assignment is evaluated as arithmetic</td><td><code>declare -i n=5; n+=3; n="n*2"; echo $n</code> → <code>16</code></td></tr>
<tr><td><code>declare -r</code> / <code>readonly</code></td><td>Constant; any later assignment is an error</td><td><code>R=2</code> → <code>R: readonly variable</code></td></tr>
<tr><td><code>declare -l</code> · <code>-u</code></td><td>Lower-/upper-case the value on every assignment (bash 4+)</td><td><code>declare -l low="HeLLo"</code> → <code>hello</code></td></tr>
<tr><td><code>declare -x</code> / <code>export</code></td><td>Put the variable into the environment of children</td><td><code>export -p</code> lists them</td></tr>
<tr><td><code>read -r</code></td><td>Backslashes are data, not escapes</td><td>always</td></tr>
<tr><td><code>read -p "…"</code> · <code>-s</code></td><td>Show a prompt · do not echo what is typed</td><td>asking for a password</td></tr>
<tr><td><code>read -t 1</code></td><td>Give up after N seconds; exit code &gt; 128</td><td>measured: <code>142</code></td></tr>
<tr><td><code>read -n 3</code> · <code>-a arr</code> · <code>-d ,</code></td><td>Read N characters · split into an array · stop at a custom delimiter</td><td><code>abcdef</code> → <code>abc</code> · <code>"x y  z"</code> → 3 elements · <code>one,two</code> → <code>one</code></td></tr>
</table>
<p>Associative arrays (<code>declare -A</code>) and namerefs (<code>declare -n</code>) are a different kind of tool and have their own lesson in Chapter 13.</p>

<h3>Run it step by step</h3>
<p>Type these in your practice directory, one line at a time, and predict each output before pressing Enter. The output below is real (Ubuntu 24.04 container, user <code>an</code>, 28/09/2026; bash prints <code>bash:</code> instead of a script name when you type interactively).</p>
<pre><code class="language-bash">mkdir -p ~/thu-linux/ch6 &amp;&amp; cd ~/thu-linux/ch6
name = "Binh"
name="Binh"; echo "[$name_backup.txt] [\${name}_backup.txt]"
x=$(printf 'a\\n\\n\\n'); printf '[%s]\\n' "$x"
y=$(ls /khong-co); echo "rc=$? y=[$y]"
echo $((10 / 3)) $((1 / 2)) $((-7 / 2)) $((2**10))
month=08; echo $((10#$month))
myvar="cuc bo"; export MYVAR="da xuat"; bash -c 'echo "[$myvar] [$MYVAR]"'</code></pre>
<div class="out">bash: name: command not found
[.txt] [Binh_backup.txt]
[a]
ls: cannot access '/khong-co': No such file or directory
rc=2 y=[]
3 0 -3 1024
8
[] [da xuat]</div>
<p>Read the results: the space turned an assignment into a command; the missing braces made bash look up <code>name_backup</code>; <code>$( )</code> dropped all three trailing newlines; stderr escaped the capture and went straight to the screen while <code>$?</code> still reported the command's exit code (2); integer division truncates towards zero (<code>-7/2</code> is <code>-3</code>, not <code>-4</code>); <code>10#</code> rescues August; and only the exported variable reached the child.</p>

<h3>On macOS and WSL</h3>
<table>
<tr><th>Thing</th><th>Ubuntu (bash 5.2)</th><th>Mac: <code>/bin/bash</code> 3.2</th><th>Mac: zsh 5.9 (the default)</th></tr>
<tr><td><code>echo $((08))</code></td><td>error: value too great for base</td><td>same error</td><td><code>8</code> — zsh reads leading zeros as decimal unless <code>OCTAL_ZEROES</code> is set</td></tr>
<tr><td><code>declare -l x=AB</code></td><td><code>ab</code></td><td><code>declare: -l: invalid option</code></td><td>use <code>typeset -l</code></td></tr>
<tr><td><code>read -p "Prompt: " x</code></td><td>prints the prompt</td><td>prints the prompt</td><td><code>zsh:read:1: -p: no coprocess</code> — zsh writes it <code>read "x?Prompt: "</code></td></tr>
</table>
<p>The lesson: a line that works when you paste it into your Mac terminal (zsh) proves nothing about the same line inside a <code>#!/usr/bin/env bash</code> script, and vice versa. <strong>WSL</strong> runs a real Ubuntu, so everything above behaves exactly as in the Ubuntu column; the only WSL-specific surprise in this chapter is Windows line endings, covered in Lesson 6.5.</p>
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your team's <code>deploy.sh</code> prints the wrong release name and a percentage of "0%" for a half-finished upload. Rebuild the three bugs in your practice directory and fix each one.</p><ol>
<li>In <code>~/thu-linux/ch6</code>, write <code>ban.sh</code> containing <code>app="web"</code>, <code>echo "release: $app_v2"</code>, <code>done=37; total=80; echo "progress: $((done / total * 100))%"</code>. Run it with <code>bash ban.sh</code>.</li>
<li>Fix the name with braces so it prints <code>release: web_v2</code>, and fix the percentage by multiplying first: <code>$((done * 100 / total))</code>.</li>
<li>Add <code>today=08</code> (what <code>date +%m</code> returns in August) and <code>echo "next month: $((today + 1))"</code>, and watch it break. Fix it with <code>10#</code>.</li>
<li>Add <code>STAGE=prod</code> (not exported) and <code>bash -c 'echo "stage=[$STAGE]"'</code>. Make the child see it in two different ways.</li>
</ol>
<p><strong>Done when:</strong> <code>bash ban.sh</code> prints <code>release: web_v2</code>, <code>progress: 46%</code>, <code>next month: 9</code>, and <code>stage=[prod]</code> — once via <code>export STAGE</code>, once via <code>STAGE=prod bash -c …</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Variable assignment</span><span class="v"><code>name=value</code> with no space around <code>=</code>; with a space, bash sees a command.</span></div>
  <div class="kv"><span class="k">Parameter expansion</span><span class="v">Replacing <code>$name</code> / <code>\${name}</code> by its value before the command runs.</span></div>
  <div class="kv"><span class="k">Command substitution</span><span class="v"><code>$(cmd)</code>: run cmd in a subshell, paste its stdout (trailing newlines removed).</span></div>
  <div class="kv"><span class="k">Arithmetic expansion</span><span class="v"><code>$(( ))</code>: 64-bit integer maths; <code>(( ))</code> alone only sets an exit code.</span></div>
  <div class="kv"><span class="k">Environment variable</span><span class="v">A variable marked with <code>export</code>, copied into every child process.</span></div>
  <div class="kv"><span class="k">Special parameters</span><span class="v"><code>$? $# $@ $0 $$ $!</code> — filled in by the shell itself.</span></div>
  <div class="kv"><span class="k">Subshell</span><span class="v">A forked copy of the shell; nothing it changes comes back to the parent.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>No spaces around <code>=</code>; write <code>"\${var}"</code> by default so the name boundary and word splitting are both handled.</li>
<li><code>$(cmd)</code> captures stdout only, drops trailing newlines, and keeps the command's exit code in <code>$?</code>.</li>
<li>Bash arithmetic is integer-only and truncates; use <code>bc</code> or <code>awk</code> for decimals and <code>10#</code> for zero-padded numbers.</li>
<li>Only exported variables reach child processes, and nothing a child sets ever comes back.</li>
<li><code>declare -p</code> shows what a variable really is; <code>read -r</code> is the only safe way to read input.</li>
<li>zsh and bash 3.2 on a Mac differ on octal, <code>declare -l</code> and <code>read -p</code> — test in the shell your shebang names.</li>
</ul>
<a class="link-card" href="https://www.gnu.org/software/bash/manual/html_node/Shell-Parameters.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Bash Manual — Shell Parameters</span><span class="lc-sub">Assignment rules, positional parameters and the full list of special variables. The reference for everything in this lesson.</span></span>
</a>
<a class="link-card" href="https://mywiki.wooledge.org/BashGuide/Parameters" target="_blank" rel="noopener">
  <span class="lc-ico">🔧</span>
  <span class="lc-body"><span class="lc-title">Greg's BashGuide — Parameters</span><span class="lc-sub">The same material written as a tutorial rather than a specification, with the reasoning behind each rule. The best free bash text there is.</span></span>
</a>
<a class="link-card" href="https://www.shellcheck.net/" target="_blank" rel="noopener">
  <span class="lc-ico">✅</span>
  <span class="lc-body"><span class="lc-title">ShellCheck — paste a script, get the bugs</span><span class="lc-sub">Catches unquoted variables, missing <code>-r</code>, and the parsing traps in this chapter. Run it on every script you write; Chapter 7 makes it part of the workflow.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: variables that behave</span><span class="lc-sub">Graded tasks on assignment syntax, <code>\$(…)</code> nesting, integer-division surprises and the shell-vs-environment distinction.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> <code>var=\$(cmd)</code> loses the exit code if you check it wrongly. <code>output=\$(risky-command)</code> sets <code>\$?</code> from <code>risky-command</code> — good — but <code>local output=\$(risky-command)</code> inside a function sets <code>\$?</code> from <code>local</code>, which always succeeds. The failure vanishes. Declare and assign on separate lines: <code>local output; output=\$(risky-command) || return 1</code>. This one is invisible in review and is exactly why ShellCheck exists.</div>
<p class="note-ct"><strong>Two defaults to adopt now, before the next lesson explains them:</strong> write <code>"\${var}"</code> with braces and double quotes every time, and write <code>\$(…)</code> instead of backticks every time. Neither requires a decision, both eliminate a category of bug, and the consistency is what makes a script readable to the next person — who is usually you, six months later, at 3am.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Biến và phép thay thế</h2>
<p class="lead">Chương này là chỗ shell thôi làm một cỗ máy khởi chạy lệnh và trở thành một ngôn ngữ lập trình. Nó cũng là chỗ script của phần lớn mọi người bắt đầu vỡ vì tên file có dấu cách — nên mục tiêu không chỉ là "lưu một giá trị thế nào", mà là "vì sao ĐÚNG cú pháp NÀY mới quan trọng". Mọi thứ ở đây chỉ là một ý: shell VIẾT LẠI dòng lệnh của bạn trước khi chạy nó, và bạn đang chọn xem nó viết lại cái gì.</p>

<h3>Gán biến: không có dấu cách</h3>
${slide('lx-06', 3, 'Dấu cách quanh = biến phép gán thành một lệnh')}
<pre><code>name="Binh"              <span class="tok-comment"># đúng</span>
name = "Binh"            <span class="tok-comment"># SAI</span>
name= "Binh"             <span class="tok-comment"># SAI, theo một kiểu khác</span></code></pre>
<div class="out">bash: name: command not found
bash: Binh: command not found</div>
<p>Chính mấy thông báo lỗi đã để lộ lý do. Shell cắt một dòng lệnh theo khoảng trắng và coi từ đầu tiên là một LỆNH — nên <code>name = "Binh"</code> nghĩa là "chạy chương trình <code>name</code> với tham số <code>=</code> và <code>Binh</code>". Một phép gán chỉ là phép gán khi không có dấu cách ở cả hai bên dấu <code>=</code>. Đây không phải quy tắc thẩm mỹ; đó là cách bộ phân tích phân biệt hai thứ.</p>
<pre><code>count=42
path=/srv/app
greeting="hello world"   <span class="tok-comment"># cần nháy: dấu cách sẽ cắt nó ra</span>
empty=
readonly VERSION=1.2.0   <span class="tok-comment"># sau đó không gán lại được nữa</span>
unset count              <span class="tok-comment"># gỡ nó đi hẳn</span></code></pre>

<h3>Đọc một biến ra</h3>
<pre><code class="language-bash">echo \$name
echo "\${name}"
echo "\${name}_backup.txt"    <span class="tok-comment"># chỗ này BẮT BUỘC phải có ngoặc nhọn</span>
echo "\$name_backup.txt"      <span class="tok-comment"># nó đi tìm một biến tên là name_backup</span></code></pre>
<div class="out">Binh
Binh
Binh_backup.txt
.txt</div>
<p>Không có ngoặc nhọn, shell đọc xa nhất có thể: <code>\$name_backup</code> là một tên biến hợp lệ, nên đó là thứ nó đi tìm — không thấy gì, thay vào bằng rỗng, và bạn còn lại mỗi <code>.txt</code>. Cặp ngoặc nhọn nói cho nó biết cái tên kết thúc ở đâu.</p>
<div class="callout ok"><strong>Hãy lấy <code>"\${var}"</code> — có ngoặc nhọn và nháy kép — làm mặc định của bạn.</strong> Ngoặc nhọn chặn vấn đề ranh giới ở trên; nháy kép chặn việc cắt từ và khai triển glob (Bài 6.2). Cả hai đều không tốn gì, cả hai đều ngăn được cả một lớp lỗi, và sự nhất quán nghĩa là bạn không bao giờ phải dừng lại để cân nhắc.</div>

<h3>Thay thế lệnh: bắt lấy output</h3>
${slide('lx-06', 4, '$(lệnh) chạy shell con, bắt stdout, bỏ \\n cuối')}
<pre><code class="language-bash">today=\$(date +%F)
files=\$(ls | wc -l)
branch=\$(git rev-parse --abbrev-ref HEAD)
echo "Trên \${branch}, \${files} file, \${today}"</code></pre>
<div class="out">Trên main, 42 file, 2026-08-22</div>
<p><code>\$(lệnh)</code> chạy lệnh đó trong một shell con, bắt lấy stdout của nó, cắt bỏ các ký tự xuống dòng ở cuối, rồi đặt kết quả vào đúng chỗ. Cú pháp dấu huyền đời cũ làm y hệt và nên tránh:</p>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>\$( )</code></span><span class="v">Lồng nhau sạch sẽ: <code>\$(dirname \$(readlink -f "\$0"))</code>. Dấu nháy bên trong hoạt động bình thường. Đây là dạng nên dùng.</span></div>
  <div class="kv"><span class="k">Dấu huyền</span><span class="v">Không lồng được nếu không thêm gạch chéo ngược, và luật thoát ký tự bên trong nó lại khác mọi chỗ khác. Chỉ còn tính di sản.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Ký tự xuống dòng ở cuối bị cắt bỏ — thường là có ích</span>
content=\$(cat file.txt)

<span class="tok-comment"># stderr KHÔNG bị bắt — nó vẫn đi thẳng ra terminal của bạn</span>
result=\$(some-command 2&gt;/dev/null)      <span class="tok-comment"># vứt nó đi</span>
result=\$(some-command 2&gt;&amp;1)             <span class="tok-comment"># bắt luôn nó</span>

<span class="tok-comment"># Mã thoát của phép thay thế vẫn dùng được như thường</span>
if ! output=\$(curl -sf "\$url"); then
  echo "tải về thất bại" &gt;&amp;2
fi</code></pre>
<div class="callout warn"><strong>Luôn đặt phép thay thế lệnh trong nháy: <code>"\$(cmd)"</code>.</strong> Không có nháy, output của nó đi qua phép cắt từ và khai triển glob như mọi phép khai triển khác. <code>rm \$(cat filelist.txt)</code> vỡ ngay khoảnh khắc một tên file có dấu cách — và cặp <code>files=\$(ls)</code> rồi <code>for f in \$files</code> chính là khuôn mẫu hỏng kinh điển mà Bài 6.5 sẽ thay thế cho tử tế.</div>

<h3>Số học</h3>
${slide('lx-06', 5, 'Số học chỉ số nguyên, 08 là hệ tám')}
<pre><code>count=5
echo \$((count + 1))
echo \$((count * 2))
echo \$((10 / 3))          <span class="tok-comment"># chia SỐ NGUYÊN — ra 3, không phải 3,33</span>
echo \$((10 % 3))          <span class="tok-comment"># phần dư</span>

((count++))               <span class="tok-comment"># tăng tại chỗ</span>
((count += 10))
total=\$((price * qty))

<span class="tok-comment"># Bên trong (( )) bạn không cần dấu \$ trước tên biến</span>
if (( count &gt; 10 )); then echo "lớn"; fi</code></pre>
<div class="out">6
10
3
1
lớn</div>
<div class="callout warn">Số học của bash <strong>CHỈ dùng số nguyên</strong>. <code>\$((10 / 3))</code> ra 3, và <code>\$((1 / 2))</code> ra 0 — không có làm tròn, nó CẮT BỎ phần lẻ. Muốn số thập phân thì cần công cụ ngoài: <code>echo "scale=2; 10/3" | bc</code> cho 3,33, hoặc <code>awk 'BEGIN {print 10/3}'</code>. Chuyện này âm thầm đẻ ra những con số sai trong các script tính phần trăm hay tính trung bình, và chẳng có gì cảnh báo bạn.</div>
<div class="callout">Còn một cạnh sắc nữa: một số 0 đứng đầu nghĩa là <strong>HỆ TÁM</strong>. <code>\$((08))</code> là một lỗi cú pháp ("value too great for base") vì 8 không phải chữ số hệ tám hợp lệ — và nó cắn khi bạn dựng một con số từ một trường ngày tháng có đệm số 0 như <code>08</code> cho tháng Tám. Hãy ép về hệ mười bằng <code>\$((10#\$month))</code>.</div>

<h3>Biến shell so với biến môi trường</h3>
${slide('lx-06', 6, 'Chỉ biến đã export mới sang tiến trình con')}
<pre><code class="language-bash">myvar="giá trị cục bộ"     <span class="tok-comment"># biến shell: chỉ trong shell này</span>
export MYVAR="đã xuất"     <span class="tok-comment"># biến môi trường: tiến trình con thừa kế</span>

bash -c 'echo "[\$myvar] [\$MYVAR]"'</code></pre>
<div class="out">[] [đã xuất]</div>
<p>Một tiến trình con nhận được một BẢN SAO của <em>MÔI TRƯỜNG</em>, không nhận biến riêng của shell. Đây chính là phép thừa kế bạn đã gặp với bộ mô tả file và umask ở Bài 5.1 — nó xảy ra lúc <code>fork</code>, nó là một bản sao, và những thay đổi sau đó ở bên nào cũng không truyền ngược lại. Chương 8 nói đầy đủ về <code>PATH</code> và các file khởi động; còn lúc này thì phân biệt được như thế là đủ.</p>
<pre><code>MYVAR=once ./script.sh     <span class="tok-comment"># đặt cho ĐÚNG MỘT lệnh</span>
env | sort | head          <span class="tok-comment"># mọi thứ đã export</span>
set | head                 <span class="tok-comment"># mọi thứ, kể cả biến chỉ có trong shell</span>
declare -p myvar           <span class="tok-comment"># hiện một biến kèm các thuộc tính của nó</span></code></pre>

<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Shell của bạn</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">myvar="cục bộ"</span><span class="lz-nsub">Một biến shell. Chỉ sống ở đây. Không thuộc về môi trường.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">export MYVAR="đã xuất"</span><span class="lz-nsub">Được đánh dấu để xuất — nó trở thành một phần của khối môi trường trao cho tiến trình con.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">fork + exec</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">một BẢN SAO của môi trường</span><span class="lz-nsub">Chỉ biến đã export mới đi theo. Bản sao là một chiều: thứ tiến trình con đặt ra không quay ngược lại.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Tiến trình con</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">\$myvar rỗng · \$MYVAR có giá trị</span><span class="lz-nsub">Đây là lý do "script không thấy biến của tôi" — nó chưa bao giờ được export.</span></div></div>
  </div>
</div>
<h3>Những biến dựng sẵn đáng biết</h3>
${slide('lx-06', 7, 'Biến đặc biệt shell tự điền')}
<div class="kv-grid">
  <div class="kv"><span class="k"><code>\$?</code></span><span class="v">Mã thoát của lệnh vừa rồi. 0 = thành công. Bài 6.4.</span></div>
  <div class="kv"><span class="k"><code>\$0</code></span><span class="v">Tên của chính script, đúng như lúc được gọi.</span></div>
  <div class="kv"><span class="k"><code>\$1 \$2 …</code></span><span class="v">Tham số vị trí. Từ <code>\${10}</code> trở đi bắt buộc phải có ngoặc nhọn.</span></div>
  <div class="kv"><span class="k"><code>\$#</code></span><span class="v">Đã truyền vào bao nhiêu tham số.</span></div>
  <div class="kv"><span class="k"><code>"\$@"</code></span><span class="v">Mọi tham số, <strong>mỗi cái là một từ riêng</strong>. Luôn có nháy, luôn dùng <code>@</code>. Bài 6.2 giải thích vì sao.</span></div>
  <div class="kv"><span class="k"><code>\$\$</code> · <code>\$!</code></span><span class="v">PID của shell này · PID của job nền gần nhất (Bài 5.4).</span></div>
  <div class="kv"><span class="k"><code>\$RANDOM</code> · <code>\$SECONDS</code></span><span class="v">Một số ngẫu nhiên 0–32767 · số giây kể từ khi shell khởi động. Tiện để đo thời gian một script.</span></div>
  <div class="kv"><span class="k"><code>\$LINENO</code> · <code>\$BASH_SOURCE</code></span><span class="v">Số dòng hiện tại · đường dẫn của script đang chạy. Cặp này dùng trong thông báo lỗi và <code>trap ERR</code> (Chương 7).</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Lối viết cho câu "script này thật ra nằm ở đâu" — chạy được cả qua liên kết tượng trưng</span>
SCRIPT_DIR=\$(cd "\$(dirname "\${BASH_SOURCE[0]}")" &amp;&amp; pwd)
echo "\$SCRIPT_DIR"</code></pre>
<div class="out">/srv/app/scripts</div>
<p>Dòng đó xuất hiện ở đầu rất nhiều script production, và nó đáng đọc kỹ: lấy <code>dirname</code> của đường dẫn chính script, <code>cd</code> vào đó, rồi <code>pwd</code> để có dạng tuyệt đối đã giải hết liên kết. Nó nghĩa là script tìm được những file nằm cạnh nó bất kể được gọi từ đâu — còn phương án kia, một đường dẫn tương đối, vỡ ngay khoảnh khắc có người chạy nó từ thư mục khác hoặc chạy qua <code>cron</code>.</p>

<h3>Đọc dữ liệu vào</h3>
<pre><code>read -r -p "Nhánh cần deploy: " branch
read -r -s -p "Mật khẩu: " pass; echo      <span class="tok-comment"># -s: không hiện lại thứ đang gõ</span>
read -r -t 10 -p "Tiếp tục? [y/N] " answer <span class="tok-comment"># -t: hết giờ sau bao nhiêu giây</span></code></pre>
<div class="callout ok"><strong>Luôn <code>read -r</code>.</strong> Không có <code>-r</code>, <code>read</code> coi gạch chéo ngược là ký tự thoát và âm thầm làm méo mọi đầu vào có chứa nó — đường dẫn Windows, regex, dấu nháy đã thoát. Không có trường hợp nào bạn MUỐN hành vi đó cả, nên hãy để <code>-r</code> thành phản xạ. ShellCheck (Chương 7) đánh dấu mọi lệnh <code>read</code> thiếu nó.</div>

<h3>declare và read: những cờ đáng biết</h3>
<p>Hai lệnh dựng sẵn này làm phần lớn việc "một biến có kèm luật". Cờ của chúng ngắn và dễ đọc nhầm, nên đây là từng cờ cùng thứ nó THẬT SỰ làm trong container Ubuntu 24.04 (bash 5.2.21):</p>
<table>
<tr><th>Cờ</th><th>Nghĩa</th><th>Ví dụ đã chạy → kết quả</th></tr>
<tr><td><code>declare -p v</code></td><td>In biến đúng như bash đang cất, kèm thuộc tính</td><td><code>declare -- myvar="cuc bo"</code> · <code>declare -x MYVAR="da xuat"</code> (<code>-x</code> = đã export)</td></tr>
<tr><td><code>declare -i n</code></td><td>Số nguyên (integer): mọi phép gán đều được TÍNH như số học</td><td><code>declare -i n=5; n+=3; n="n*2"; echo $n</code> → <code>16</code></td></tr>
<tr><td><code>declare -r</code> / <code>readonly</code></td><td>Hằng: gán lại về sau là lỗi</td><td><code>R=2</code> → <code>R: readonly variable</code></td></tr>
<tr><td><code>declare -l</code> · <code>-u</code></td><td>Tự đổi giá trị sang chữ thường / HOA mỗi lần gán (bash 4+)</td><td><code>declare -l low="HeLLo"</code> → <code>hello</code></td></tr>
<tr><td><code>declare -x</code> / <code>export</code></td><td>Đưa biến vào môi trường (environment) của tiến trình con</td><td><code>export -p</code> liệt kê chúng</td></tr>
<tr><td><code>read -r</code></td><td>Gạch chéo ngược là DỮ LIỆU, không phải ký tự thoát</td><td>luôn luôn</td></tr>
<tr><td><code>read -p "…"</code> · <code>-s</code></td><td>In dấu nhắc (prompt) · không hiện chữ đang gõ</td><td>hỏi mật khẩu</td></tr>
<tr><td><code>read -t 1</code></td><td>Bỏ cuộc sau N giây; mã thoát &gt; 128</td><td>đo thật: <code>142</code></td></tr>
<tr><td><code>read -n 3</code> · <code>-a arr</code> · <code>-d ,</code></td><td>Đọc N ký tự · tách vào một mảng · dừng ở dấu phân cách tự chọn</td><td><code>abcdef</code> → <code>abc</code> · <code>"x y  z"</code> → 3 phần tử · <code>one,two</code> → <code>one</code></td></tr>
</table>
<p>Mảng kết hợp (<code>declare -A</code>) và nameref (<code>declare -n</code>) là một loại công cụ khác hẳn và có bài riêng ở Chương 13.</p>

<h3>Chạy thử từng bước</h3>
<p>Gõ từng dòng trong thư mục sân tập, đoán trước output của mỗi dòng rồi mới bấm Enter. Output bên dưới là THẬT (container Ubuntu 24.04, người dùng <code>an</code>, 28/09/2026; khi gõ tay, bash in <code>bash:</code> thay cho tên script).</p>
<pre><code class="language-bash">mkdir -p ~/thu-linux/ch6 &amp;&amp; cd ~/thu-linux/ch6
name = "Binh"
name="Binh"; echo "[$name_backup.txt] [\${name}_backup.txt]"
x=$(printf 'a\\n\\n\\n'); printf '[%s]\\n' "$x"
y=$(ls /khong-co); echo "rc=$? y=[$y]"
echo $((10 / 3)) $((1 / 2)) $((-7 / 2)) $((2**10))
month=08; echo $((10#$month))
myvar="cuc bo"; export MYVAR="da xuat"; bash -c 'echo "[$myvar] [$MYVAR]"'</code></pre>
<div class="out">bash: name: command not found
[.txt] [Binh_backup.txt]
[a]
ls: cannot access '/khong-co': No such file or directory
rc=2 y=[]
3 0 -3 1024
8
[] [da xuat]</div>
<p>Đọc kết quả: dấu cách biến phép gán thành một lệnh; thiếu ngoặc nhọn làm bash đi tìm biến <code>name_backup</code>; <code>$( )</code> cắt cả ba ký tự xuống dòng ở cuối; stderr thoát khỏi phép bắt và đi thẳng ra màn hình, trong khi <code>$?</code> vẫn báo đúng mã thoát của lệnh (2); phép chia nguyên cắt về phía số 0 (<code>-7/2</code> là <code>-3</code>, không phải <code>-4</code>); <code>10#</code> cứu tháng Tám; và chỉ biến đã export mới tới được tiến trình con.</p>

<h3>Trên macOS và WSL khác gì</h3>
<table>
<tr><th>Thứ</th><th>Ubuntu (bash 5.2)</th><th>Mac: <code>/bin/bash</code> 3.2</th><th>Mac: zsh 5.9 (mặc định)</th></tr>
<tr><td><code>echo $((08))</code></td><td>lỗi: value too great for base</td><td>cùng lỗi đó</td><td><code>8</code> — zsh đọc số 0 đứng đầu là hệ mười, trừ khi bật <code>OCTAL_ZEROES</code></td></tr>
<tr><td><code>declare -l x=AB</code></td><td><code>ab</code></td><td><code>declare: -l: invalid option</code></td><td>dùng <code>typeset -l</code></td></tr>
<tr><td><code>read -p "Hỏi: " x</code></td><td>in dấu nhắc</td><td>in dấu nhắc</td><td><code>zsh:read:1: -p: no coprocess</code> — zsh viết là <code>read "x?Hỏi: "</code></td></tr>
</table>
<p>Bài học: một dòng chạy được khi bạn dán vào terminal Mac (zsh) chẳng chứng minh được gì cho chính dòng đó bên trong một script <code>#!/usr/bin/env bash</code>, và ngược lại. <strong>WSL</strong> chạy một Ubuntu thật, nên mọi thứ ở trên hành xử y như cột Ubuntu; bất ngờ riêng của WSL trong chương này là ký tự xuống dòng kiểu Windows, nói ở Bài 6.5.</p>
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> <code>deploy.sh</code> của nhóm in sai tên bản phát hành và báo tiến độ "0%" cho một lần tải lên mới được một nửa. Dựng lại ba lỗi đó trong sân tập rồi sửa từng cái.</p><ol>
<li>Trong <code>~/thu-linux/ch6</code>, viết <code>ban.sh</code> gồm <code>app="web"</code>, <code>echo "release: $app_v2"</code>, <code>done=37; total=80; echo "progress: $((done / total * 100))%"</code>. Chạy bằng <code>bash ban.sh</code>.</li>
<li>Sửa tên bằng ngoặc nhọn để nó in <code>release: web_v2</code>, và sửa phần trăm bằng cách nhân TRƯỚC: <code>$((done * 100 / total))</code>.</li>
<li>Thêm <code>today=08</code> (đúng thứ <code>date +%m</code> trả về trong tháng Tám) và <code>echo "next month: $((today + 1))"</code>, rồi xem nó vỡ. Sửa bằng <code>10#</code>.</li>
<li>Thêm <code>STAGE=prod</code> (không export) và <code>bash -c 'echo "stage=[$STAGE]"'</code>. Làm cho tiến trình con thấy được nó bằng hai cách khác nhau.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>bash ban.sh</code> in <code>release: web_v2</code>, <code>progress: 46%</code>, <code>next month: 9</code>, và <code>stage=[prod]</code> — một lần nhờ <code>export STAGE</code>, một lần nhờ <code>STAGE=prod bash -c …</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Variable assignment (phép gán biến)</span><span class="v"><code>ten=giatri</code>, không dấu cách quanh <code>=</code>; có dấu cách thì bash thấy một LỆNH.</span></div>
  <div class="kv"><span class="k">Parameter expansion (khai triển tham số)</span><span class="v">Thay <code>$ten</code> / <code>\${ten}</code> bằng giá trị của nó trước khi lệnh chạy.</span></div>
  <div class="kv"><span class="k">Command substitution (thay thế lệnh)</span><span class="v"><code>$(lệnh)</code>: chạy lệnh trong shell con, dán stdout của nó vào (bỏ các \\n cuối).</span></div>
  <div class="kv"><span class="k">Arithmetic expansion (khai triển số học)</span><span class="v"><code>$(( ))</code>: tính số nguyên 64 bit; <code>(( ))</code> đứng riêng chỉ đặt mã thoát.</span></div>
  <div class="kv"><span class="k">Environment variable (biến môi trường)</span><span class="v">Biến đã <code>export</code>, được CHÉP sang mọi tiến trình con.</span></div>
  <div class="kv"><span class="k">Special parameters (tham số đặc biệt)</span><span class="v"><code>$? $# $@ $0 $$ $!</code> — do chính shell điền vào.</span></div>
  <div class="kv"><span class="k">Subshell (shell con)</span><span class="v">Bản sao của shell tạo bằng fork; nó đổi gì cũng không quay về shell cha.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Không dấu cách quanh <code>=</code>; mặc định viết <code>"\${var}"</code> để lo cả ranh giới tên lẫn phép cắt từ.</li>
<li><code>$(lệnh)</code> chỉ bắt stdout, bỏ các \\n ở cuối, và giữ mã thoát của lệnh trong <code>$?</code>.</li>
<li>Số học bash chỉ có số nguyên và cắt phần lẻ; số thập phân dùng <code>bc</code>/<code>awk</code>, số có 0 đứng đầu dùng <code>10#</code>.</li>
<li>Chỉ biến đã export mới tới được tiến trình con, và thứ con đặt ra không bao giờ quay về.</li>
<li><code>declare -p</code> cho thấy biến thật sự là gì; <code>read -r</code> là cách an toàn duy nhất để đọc đầu vào.</li>
<li>zsh và bash 3.2 trên Mac khác nhau ở hệ tám, <code>declare -l</code> và <code>read -p</code> — hãy thử bằng đúng shell mà shebang gọi.</li>
</ul>
<a class="link-card" href="https://www.gnu.org/software/bash/manual/html_node/Shell-Parameters.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Bash Manual — Shell Parameters</span><span class="lc-sub">Luật gán biến, tham số vị trí và danh sách đầy đủ các biến đặc biệt. Trang tra cứu cho mọi thứ trong bài này.</span></span>
</a>
<a class="link-card" href="https://mywiki.wooledge.org/BashGuide/Parameters" target="_blank" rel="noopener">
  <span class="lc-ico">🔧</span>
  <span class="lc-body"><span class="lc-title">Greg's BashGuide — Parameters</span><span class="lc-sub">Cùng nội dung đó nhưng viết như một bài học chứ không phải một bản đặc tả, kèm lý lẽ đằng sau từng luật. Đây là văn bản miễn phí hay nhất về bash.</span></span>
</a>
<a class="link-card" href="https://www.shellcheck.net/" target="_blank" rel="noopener">
  <span class="lc-ico">✅</span>
  <span class="lc-body"><span class="lc-title">ShellCheck — dán một script vào, nhận về các lỗi</span><span class="lc-sub">Bắt được biến thiếu nháy, <code>read</code> thiếu <code>-r</code>, và các bẫy phân tích cú pháp trong chương này. Hãy chạy nó với mọi script bạn viết; Chương 7 đưa nó thành một phần của quy trình.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: những biến biết cư xử</span><span class="lc-sub">Bài chấm điểm về cú pháp gán, lồng <code>\$(…)</code>, những bất ngờ của phép chia số nguyên, và phân biệt biến shell với biến môi trường.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> <code>var=\$(cmd)</code> làm mất mã thoát nếu bạn kiểm sai chỗ. <code>output=\$(risky-command)</code> đặt <code>\$?</code> theo <code>risky-command</code> — tốt — nhưng <code>local output=\$(risky-command)</code> bên trong một hàm lại đặt <code>\$?</code> theo lệnh <code>local</code>, thứ luôn thành công. Chỗ hỏng biến mất. Hãy khai báo và gán trên hai dòng riêng: <code>local output; output=\$(risky-command) || return 1</code>. Cái này vô hình khi soát mã, và đó chính xác là lý do ShellCheck tồn tại.</div>
<p class="note-ct"><strong>Hai mặc định nên nhận ngay bây giờ, trước cả khi bài sau giải thích chúng:</strong> viết <code>"\${var}"</code> có ngoặc nhọn và nháy kép, lần nào cũng vậy; và viết <code>\$(…)</code> thay cho dấu huyền, lần nào cũng vậy. Không cái nào đòi bạn phải cân nhắc, cả hai đều xoá sổ một loại lỗi, và chính sự nhất quán đó làm script đọc được với người sau — mà người sau thường là chính bạn, sáu tháng sau, lúc 3 giờ sáng.</p>
</div>
`,
    },
    /* ─────────────────────────── 6.2 ─────────────────────────── */
    {
      title: '6.2 — Quoting: the one rule that stops scripts breaking|||6.2 — Dấu nháy: luật duy nhất làm script thôi vỡ',
      slug: 'lnx-6-2-dau-nhay',
      type: 'LESSON',
      description: 'Cắt từ là gì và vì sao nó phá script của bạn, ba loại dấu nháy, "$@" so với $*, mảng và "${arr[@]}", IFS, và mười ví dụ trước-sau cho thấy dấu nháy đổi kết quả ra sao.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>Quoting</h2>
<p class="lead">If you take one thing from this entire course, take this: <strong>put double quotes around every variable expansion.</strong> Not for style — because without them the shell splits the value into words and expands globs in it, and that is the single largest source of bugs in shell scripts. This lesson explains exactly what happens so the rule stops feeling arbitrary.</p>

<h3>The mechanism: word splitting</h3>
${slide('lx-06', 9, 'Không nháy: một biến thành bốn tham số')}
<pre><code class="language-bash">file="my report.txt"
touch "\$file"
ls -l \$file          <span class="tok-comment"># unquoted</span>
ls -l "\$file"        <span class="tok-comment"># quoted</span></code></pre>
<div class="out">ls: cannot access 'my': No such file or directory
ls: cannot access 'report.txt': No such file or directory
-rw-r--r-- 1 you you 0 Aug 22 13:40 my report.txt</div>
<p>Unquoted, the shell substitutes the value and <em>then</em> splits the result on whitespace, producing two arguments. The command never sees one filename — it sees two, neither of which exists.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · You write</span><span class="lz-t">ls -l \$file</span><span class="lz-d">Three words so far.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Expansion</span><span class="lz-t">ls -l my report.txt</span><span class="lz-d">The variable's value is pasted in as text.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Word splitting</span><span class="lz-t">["ls", "-l", "my", "report.txt"]</span><span class="lz-d">Split on IFS — space, tab, newline. FOUR arguments now. This step is what quotes suppress.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Globbing</span><span class="lz-t">any * ? [ ] in the value expands too</span><span class="lz-d">A value of <code>*</code> becomes every filename in the directory (Lesson 2.2). Also suppressed by quotes.</span></div>
</div>
<div class="callout warn">Step 4 is the dangerous one. A variable containing <code>*</code> — from user input, a config file, an API response — expands to every file in the current directory when unquoted. <code>rm \$userinput</code> with <code>userinput="*"</code> deletes everything, and the script looks completely innocent in review.</div>

<h3>The full expansion order — the one picture behind this chapter</h3>
${slide('lx-06', 8, 'Thứ tự khai triển của bash')}
<p>The four steps above are a simplification. The bash manual (bash(1), section EXPANSION) gives the real order: <em>"brace expansion; tilde expansion, parameter and variable expansion, arithmetic expansion, and command substitution (done in a left-to-right fashion); word splitting; pathname expansion; and quote removal."</em> Every surprising thing in this chapter falls out of that sentence. Here is one command line going through all of it, run for real (<code>ext=txt</code>, <code>v='x *.md'</code>, a directory holding <code>README.md</code> and <code>notes.md</code>):</p>
<pre><code>ext=txt; v='x *.md'
printf '[%s]\\n' {a,b}.$ext ~ $((6*7)) $v '*'</code></pre>
<div class="out">[a.txt]
[b.txt]
[/home/an]
[42]
[x]
[README.md]
[notes.md]
[*]</div>
<table>
<tr><th>Step</th><th>What happens to the example</th><th>Consequence you will meet</th></tr>
<tr><td>1 · Brace <code>{a,b}</code> <code>{1..5}</code></td><td><code>{a,b}.$ext</code> → <code>a.$ext b.$ext</code> — pure text, variables not yet known</td><td><code>n=3; echo {1..$n}</code> prints <code>{1..3}</code>: the range was needed before <code>$n</code> existed</td></tr>
<tr><td>2 · Tilde <code>~</code></td><td><code>~</code> → <code>/home/an</code></td><td>only unquoted: <code>"~/x"</code> stays literally <code>~/x</code> (tested)</td></tr>
<tr><td>3 · <code>$var</code> <code>$(cmd)</code> <code>$((…))</code></td><td><code>$ext</code> → <code>txt</code>, <code>$((6*7))</code> → <code>42</code>, <code>$v</code> → one piece <code>x *.md</code></td><td>results are NOT brace- or tilde-expanded again: <code>b='{1,2}'; echo $b</code> prints <code>{1,2}</code></td></tr>
<tr><td>4 · Word splitting</td><td>only the unquoted RESULT of step 3 is cut on IFS: <code>x</code> + <code>*.md</code></td><td>the whole of Lesson 6.2; quotes switch it off</td></tr>
<tr><td>5 · Pathname (glob)</td><td><code>*.md</code> → <code>README.md notes.md</code>; <code>'*'</code> is quoted, so it is left alone</td><td>a value containing <code>*</code> can expand to every file (Lesson 2.2)</td></tr>
<tr><td>6 · Quote removal</td><td><code>'*'</code> → <code>*</code></td><td>the program never sees your quotes; they only told bash what not to do</td></tr>
</table>
<p>Process substitution <code>&lt;(…)</code> happens at the same time as step 3 (Chapter 13). To see the result of all six steps for any line, turn on tracing: <code>set -x</code> printed <code>+ printf '[%s]\\n' a.txt b.txt /home/an 42 x README.md notes.md '*'</code> for the example — xtrace adds quotes back only so that you can read it. The other tool you will use all chapter is <code>printf '[%s]\\n' …</code>: it prints each argument it received on its own line inside brackets, so you can count arguments and see leading or trailing spaces.</p>
<h3>The three kinds of quoting</h3>
${slide('lx-06', 10, 'Ba loại nháy soi bằng printf "[%s]"')}
<div class="kv-grid">
  <div class="kv"><span class="k"><code>"double"</code></span><span class="v">Expands <code>\$var</code>, <code>\$(cmd)</code> and <code>\$((math))</code>; suppresses word splitting and globbing. <strong>Your default.</strong></span></div>
  <div class="kv"><span class="k"><code>'single'</code></span><span class="v">Expands <strong>nothing</strong> — every character is literal, including <code>\$</code> and <code>\\</code>. The only thing it cannot contain is another single quote. Use for awk/sed programs, regexes, and anything with a literal <code>\$</code>.</span></div>
  <div class="kv"><span class="k">unquoted</span><span class="v">Everything expands, then splits, then globs. Correct only when you <em>deliberately</em> want splitting — which is rare and should carry a comment.</span></div>
</div>
<pre><code class="language-bash">name="Binh"
echo "Hello \$name, today is \$(date +%A)"
echo 'Hello \$name, today is \$(date +%A)'
echo "Cost: \\\$5"                <span class="tok-comment"># backslash escapes the \$ inside double quotes</span></code></pre>
<div class="out">Hello Binh, today is Friday
Hello \$name, today is \$(date +%A)
Cost: \$5</div>
<pre><code class="language-bash"><span class="tok-comment"># Mixing them in one argument — they simply concatenate, no space between</span>
echo 'literal \$HOME is '"\$HOME"
awk -v n="\$name" '{print n, \$1}' file.txt    <span class="tok-comment"># single for awk, double for the shell value</span></code></pre>
<div class="out">literal \$HOME is /home/deploy</div>
<div class="callout ok">Adjacent quoted strings join with no separator, which is how you build a string that is partly literal and partly expanded. This is also the answer to "how do I put a single quote inside single quotes": you cannot, so you close, add <code>"'"</code>, and reopen — <code>'it'"'"'s'</code>. Ugly, and the reason to reach for a double-quoted string with an escaped <code>\$</code> instead when you can.</div>

<h3>"\$@" versus "\$*" versus \$@</h3>
${slide('lx-06', 11, '"$@" giữ nguyên từng tham số')}
<p>Three spellings, three different behaviours, and only one of them is usually right:</p>
<pre><code><span class="tok-comment"># show-args.sh</span>
for arg in "\$@"; do echo "[\$arg]"; done

./show-args.sh "hello world" foo</code></pre>
<div class="out">[hello world]
[foo]</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>"\$@"</code></span><span class="v">Each argument stays one word, spaces preserved. <strong>Almost always what you want.</strong></span></div>
  <div class="kv"><span class="k"><code>\$@</code> (unquoted)</span><span class="v">Each argument is word-split again — <code>"hello world"</code> becomes two. Loses exactly the information you needed.</span></div>
  <div class="kv"><span class="k"><code>"\$*"</code></span><span class="v">All arguments joined into ONE string, separated by the first character of <code>IFS</code>. Occasionally useful for building a message; never for passing arguments on.</span></div>
</div>
<pre><code><span class="tok-comment"># The wrapper-script idiom: pass everything through untouched</span>
exec docker run --rm -v "\$PWD:/work" myimage "\$@"</code></pre>
<p>That line forwards every argument exactly as received, including ones with spaces and quotes. Written as <code>\$@</code> or <code>"\$*"</code> it would corrupt them, and the failure would only appear for the one user who passes a path with a space in it.</p>

<h3>Arrays: the right way to hold a list</h3>
${slide('lx-06', 12, 'Mảng: "${a[@]}" là cách mở đúng duy nhất')}
<pre><code class="language-bash">files=("report one.txt" "report two.txt" "notes.md")
echo "\${#files[@]}"           <span class="tok-comment"># how many elements: 3</span>
echo "\${files[0]}"            <span class="tok-comment"># first element (index from 0)</span>
echo "\${files[@]}"            <span class="tok-comment"># all elements</span>

for f in "\${files[@]}"; do    <span class="tok-comment"># QUOTED @ — one iteration per element</span>
  echo "[\$f]"
done

files+=("extra.txt")          <span class="tok-comment"># append</span></code></pre>
<div class="out">3
report one.txt
[report one.txt]
[report two.txt]
[notes.md]</div>
<div class="callout warn"><code>"\${arr[@]}"</code> — quoted, with <code>@</code> — is the only correct way to expand an array. <code>"\${arr[*]}"</code> flattens it to one string; <code>\${arr[@]}</code> unquoted re-splits every element on spaces. The difference is invisible until an element contains a space, and then it is a bug that only reproduces on some inputs.</div>
<pre><code><span class="tok-comment"># Building a command incrementally — the reason arrays exist</span>
args=(--verbose --output "/tmp/my output.log")
[[ -n "\$filter" ]] &amp;&amp; args+=(--filter "\$filter")
mycommand "\${args[@]}"</code></pre>
<p>The alternative — building a command in a plain string and hoping the shell re-splits it correctly — is the classic mistake this replaces. A string cannot represent "an argument containing a space"; an array can.</p>

<h3>IFS: what "whitespace" actually means</h3>
${slide('lx-06', 13, 'IFS quyết định cắt ở đâu — zsh không cắt $var')}
<pre><code class="language-bash">echo "\$IFS" | cat -A          <span class="tok-comment"># default: space, tab, newline</span>

line="alice:x:1001:1001::/home/alice:/bin/bash"
IFS=':' read -r user _ uid gid _ home shell &lt;&lt;&lt; "\$line"
echo "\$user \$uid \$home \$shell"</code></pre>
<div class="out"> ^I\$
\$
alice 1001 /home/alice /bin/bash</div>
<p><code>IFS</code> (Internal Field Separator) is the variable that controls step 3 of the expansion diagram. Setting it on the same line as a command changes it for that command only, which is the clean way to parse a delimited line without <code>cut</code> or <code>awk</code>. The <code>_</code> is a conventional throwaway name for fields you do not want.</p>
<div class="callout">Setting <code>IFS</code> globally is a known way to break a script in confusing ways, because everything downstream splits differently. Prefer the one-command form (<code>IFS=':' read …</code>), or save and restore it. The one global setting that <em>is</em> idiomatic is <code>IFS=\$'\\n\\t'</code> at the top of a strict script — it removes space from the separator list, so accidental unquoted expansions break on far fewer inputs.</div>

<h3>Ten before-and-afters</h3>
<pre><code class="language-bash"><span class="tok-comment"># 1  test on a possibly-empty variable</span>
[ \$var = "yes" ]            →  [ "\$var" = "yes" ]

<span class="tok-comment"># 2  a path that might contain a space</span>
cd \$HOME/My Documents       →  cd "\$HOME/My Documents"

<span class="tok-comment"># 3  command substitution</span>
files=\$(ls)                  →  mapfile -t files &lt; &lt;(ls)

<span class="tok-comment"># 4  passing arguments through</span>
myscript \$@                  →  myscript "\$@"

<span class="tok-comment"># 5  a find pattern</span>
find . -name *.log           →  find . -name "*.log"

<span class="tok-comment"># 6  an awk program</span>
awk "{print \\\$1}" f          →  awk '{print \$1}' f

<span class="tok-comment"># 7  array expansion</span>
for f in \${files[*]}         →  for f in "\${files[@]}"

<span class="tok-comment"># 8  a value that might be empty</span>
grep \$pattern file           →  grep -- "\$pattern" file

<span class="tok-comment"># 9  redirect target</span>
echo hi &gt; \$out               →  echo hi &gt; "\$out"

<span class="tok-comment"># 10 arithmetic — the one place quotes are NOT needed</span>
if [ "\$a" -gt "\$b" ]        →  if (( a &gt; b ))</code></pre>
<div class="callout ok">Number 10 is the exception worth naming: inside <code>(( ))</code> and <code>[[ ]]</code>, bash does not word-split, so quotes are optional there. Everywhere else — <code>[ ]</code>, command arguments, redirections, assignments from substitutions — quote. When in doubt, quote; there is no case where correct quoting breaks something that unquoted would have handled.</div>

<h3>Where quotes may be left off — and where they change the meaning</h3>
<p>"Quote everything" is the right default, but reading other people's scripts requires knowing the handful of places where bash does not split anyway, and the two places where adding quotes silently changes what the code does. All rows tested in bash 5.2:</p>
<table>
<tr><th>Place</th><th>Unquoted is…</th><th>Tested</th></tr>
<tr><td>Assignment <code>b=$a</code>, <code>c=$(cmd)</code></td><td>safe — no splitting, no glob</td><td><code>a="x   y"; b=$a</code> keeps three spaces</td></tr>
<tr><td>Inside <code>[[ ]]</code>, left side</td><td>safe</td><td><code>[[ $var == yes ]]</code> with <code>var</code> empty is just false</td></tr>
<tr><td>Inside <code>(( ))</code>, <code>case $x in</code></td><td>safe</td><td>—</td></tr>
<tr><td>Right side of <code>==</code> in <code>[[ ]]</code></td><td>a <strong>pattern</strong>; quoted = literal text</td><td><code>[[ app.log == *.log ]]</code> true · <code>[[ app.log == "*.log" ]]</code> false</td></tr>
<tr><td>Right side of <code>=~</code></td><td>a <strong>regex</strong>; quoted = literal text</td><td><code>re='^[0-9]+$'; [[ 42 =~ $re ]]</code> true · <code>[[ 42 =~ "$re" ]]</code> false</td></tr>
<tr><td>Everything else</td><td>split + glob — quote it</td><td>—</td></tr>
</table>
<p>The fourth kind of quote is <code>$'…'</code> (ANSI-C quoting): inside it <code>\\t</code>, <code>\\n</code> and <code>\\'</code> become a real tab, newline and single quote. That is how you write <code>IFS=$'\\n\\t'</code> or <code>$'it\\'s'</code>, and how you strip a Windows carriage return with <code>\${line%$'\\r'}</code> (Lesson 6.5).</p>

<h3>On macOS and WSL</h3>
<p>This is where the Mac surprises most people, because the Mac's default shell is zsh, and zsh deliberately does not do step 4 on plain variables. Run on a Mac M1 with zsh 5.9 (<code>-f</code> = no config files):</p>
<pre><code>zsh -f -c 'v="a b *.txt"; printf "[%s]\\n" $v'
zsh -f -c 'v="a b *.txt"; printf "[%s]\\n" \${=v}'
zsh -f -c 'n=3; echo {1..$n}'
zsh -f -c 'a=(x y z); echo "a[1]=$a[1] a[0]=[$a[0]]"'</code></pre>
<div class="out">[a b *.txt]
[a]
[b]
[*.txt]
1 2 3
a[1]=x a[0]=[]</div>
<p>So in zsh an unquoted <code>$v</code> stays one word (<code>\${=v}</code> asks for splitting), <code>{1..$n}</code> works because zsh expands braces after variables, and arrays start at index 1. A script you "tested" by pasting lines into the Mac terminal can therefore pass there and break under bash — always run it through the interpreter its shebang names. <code>/bin/bash</code> on the Mac (3.2) splits exactly like Linux. <strong>WSL</strong>: identical to Ubuntu, with one addition — a script saved from a Windows editor with CRLF line endings fails with <code>$'\\r': command not found</code>, because the <code>\\r</code> becomes part of the last word of every line.</p>
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> a teammate's wrapper script "loses" the file <code>bao cao Q3.pdf</code> that the lecturer uploaded, and once printed the whole directory when someone passed <code>*</code>. Reproduce it with hostile file names and fix it.</p><ol>
<li><code>mkdir -p ~/thu-linux/ch6/q2 &amp;&amp; cd ~/thu-linux/ch6/q2 &amp;&amp; touch -- 'bao cao Q3.pdf' '*' -n notes.txt</code></li>
<li>Write <code>~/thu-linux/ch6/dem.sh</code> containing one line: <code>for a in $@; do printf "[%s]\\n" "$a"; done</code>. Run <code>bash ../dem.sh * | wc -l</code> and explain every extra line using the expansion-order table.</li>
<li>Run <code>bash -x ../dem.sh 'a b'</code> to watch the arguments bash really passes, then fix the script with a single pair of quotes.</li>
<li>Inside the script, build <code>args=(--label "bao cao")</code> and print <code>printf '[%s]\\n' "\${args[@]}"</code> versus <code>\${args[*]}</code> unquoted.</li>
</ol>
<p><strong>Done when:</strong> before the fix <code>bash ../dem.sh * | wc -l</code> prints <code>9</code> (four names, but <code>*</code> globs to all four again and <code>bao cao Q3.pdf</code> splits into three); after it prints <code>4</code>; and the array prints <code>[--label]</code> <code>[bao cao]</code> quoted but three lines unquoted.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Word splitting</span><span class="v">Cutting the unquoted result of an expansion into several arguments at IFS characters.</span></div>
  <div class="kv"><span class="k">IFS (Internal Field Separator)</span><span class="v">The characters that split: by default space, tab, newline.</span></div>
  <div class="kv"><span class="k">Globbing / pathname expansion</span><span class="v">Turning <code>*</code>, <code>?</code>, <code>[…]</code> into matching file names.</span></div>
  <div class="kv"><span class="k">Quote removal</span><span class="v">The last step: quote characters are stripped before the program runs.</span></div>
  <div class="kv"><span class="k">ANSI-C quoting <code>$'…'</code></span><span class="v">Quotes where <code>\\n</code>, <code>\\t</code> become real control characters.</span></div>
  <div class="kv"><span class="k"><code>"$@"</code></span><span class="v">All positional arguments, each exactly one word.</span></div>
  <div class="kv"><span class="k">xtrace (<code>set -x</code>)</span><span class="v">Prints each command after expansion, prefixed with <code>+</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Bash expands in a fixed order: brace → tilde/variable/arithmetic/command (left to right) → word splitting → glob → quote removal.</li>
<li>Braces run before variables, so <code>{1..$n}</code> does not work in bash; results of step 3 are never brace-expanded again.</li>
<li>Double quotes keep <code>$</code> expansions but stop splitting and globbing; single quotes stop everything; <code>$'…'</code> gives real control characters.</li>
<li><code>"$@"</code> and <code>"\${arr[@]}"</code> are the only forms that keep every argument or element intact.</li>
<li>Assignments, <code>[[ ]]</code> and <code>(( ))</code> do not split — but quoting the right side of <code>==</code> or <code>=~</code> turns a pattern into plain text.</li>
<li>zsh does not split <code>$var</code> and expands <code>{1..$n}</code>; test bash scripts with bash, and see real arguments with <code>printf '[%s]\\n'</code> or <code>set -x</code>.</li>
</ul>
<a class="link-card" href="https://mywiki.wooledge.org/Quotes" target="_blank" rel="noopener">
  <span class="lc-ico">🔧</span>
  <span class="lc-body"><span class="lc-title">Greg's Wiki — Quotes</span><span class="lc-sub">The definitive explanation of when and why, with the exact expansion order. If any part of this lesson felt hand-wavy, this page fills it in.</span></span>
</a>
<a class="link-card" href="https://www.gnu.org/software/bash/manual/html_node/Word-Splitting.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Bash Manual — Word Splitting and IFS</span><span class="lc-sub">The authoritative rules for step 3, including the special handling of whitespace versus non-whitespace IFS characters.</span></span>
</a>
<a class="link-card" href="https://github.com/koalaman/shellcheck/wiki/SC2086" target="_blank" rel="noopener">
  <span class="lc-ico">✅</span>
  <span class="lc-body"><span class="lc-title">ShellCheck SC2086 — "Double quote to prevent globbing and word splitting"</span><span class="lc-sub">The single most-triggered ShellCheck warning, with worked examples of what actually goes wrong. Every wiki page is linked from the tool's output.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: break it with a space</span><span class="lc-sub">Graded tasks on a fixture directory full of filenames containing spaces, quotes and asterisks. Every unquoted expansion fails visibly.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> quoting works until the day it does not, and that day is chosen by your data. A script that runs perfectly for a year breaks the first time someone uploads <code>Bao cao Q3.pdf</code>, or a config value ends up empty, or a filename starts with a dash. Because the bug depends on input rather than code, testing on your own tidy filenames proves nothing. Two habits close it: run <code>shellcheck</code> on every script, and test with a deliberately hostile directory — <code>touch 'a b.txt' '-rf' '*' "it's"</code> — before you trust it.</div>
<p class="note-ct"><strong>The rule, compressed:</strong> double quotes around every <code>\$</code> expansion; single quotes for anything that must stay literal; <code>"\$@"</code> and <code>"\${arr[@]}"</code> always with both the quotes and the <code>@</code>. That is the entire lesson, and following it mechanically — without deciding each time — is what makes shell scripts stop being fragile.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Dấu nháy</h2>
<p class="lead">Nếu bạn chỉ lấy đi một thứ từ cả khoá học này, hãy lấy điều này: <strong>đặt nháy kép quanh MỌI phép khai triển biến.</strong> Không phải vì thẩm mỹ — mà vì thiếu chúng thì shell CẮT giá trị đó thành nhiều từ và khai triển glob bên trong nó, và đó là nguồn lỗi lớn nhất của script shell. Bài này giải thích chính xác chuyện gì xảy ra, để cái luật kia thôi có vẻ tuỳ tiện.</p>

<h3>Cơ chế: cắt từ</h3>
${slide('lx-06', 9, 'Không nháy: một biến thành bốn tham số')}
<pre><code class="language-bash">file="my report.txt"
touch "\$file"
ls -l \$file          <span class="tok-comment"># không nháy</span>
ls -l "\$file"        <span class="tok-comment"># có nháy</span></code></pre>
<div class="out">ls: cannot access 'my': No such file or directory
ls: cannot access 'report.txt': No such file or directory
-rw-r--r-- 1 you you 0 Aug 22 13:40 my report.txt</div>
<p>Không có nháy, shell thay giá trị vào rồi <em>SAU ĐÓ</em> cắt kết quả theo khoảng trắng, sinh ra hai tham số. Lệnh không bao giờ thấy MỘT tên file — nó thấy hai, mà chẳng cái nào tồn tại.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Bạn viết</span><span class="lz-t">ls -l \$file</span><span class="lz-d">Tới đây là ba từ.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Khai triển</span><span class="lz-t">ls -l my report.txt</span><span class="lz-d">Giá trị của biến được dán vào dưới dạng văn bản.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Cắt từ</span><span class="lz-t">["ls", "-l", "my", "report.txt"]</span><span class="lz-d">Cắt theo IFS — dấu cách, tab, xuống dòng. Giờ là BỐN tham số. Đây chính là bước mà dấu nháy dập đi.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Khai triển glob</span><span class="lz-t">mọi * ? [ ] trong giá trị cũng khai triển nốt</span><span class="lz-d">Một giá trị bằng <code>*</code> biến thành mọi tên file trong thư mục (Bài 2.2). Cũng bị dấu nháy dập đi.</span></div>
</div>
<div class="callout warn">Bước 4 mới là bước nguy hiểm. Một biến chứa <code>*</code> — từ đầu vào người dùng, từ một file cấu hình, từ một hồi đáp API — sẽ khai triển thành mọi file trong thư mục hiện tại nếu không có nháy. <code>rm \$userinput</code> với <code>userinput="*"</code> xoá sạch mọi thứ, mà script thì trông hoàn toàn vô hại khi soát mã.</div>

<h3>Toàn bộ thứ tự khai triển — bức hình đứng sau cả chương này</h3>
${slide('lx-06', 8, 'Thứ tự khai triển của bash')}
<p>Bốn bước ở trên là bản rút gọn. Sổ tay bash (bash(1), mục EXPANSION) cho thứ tự THẬT: <em>"brace expansion; tilde expansion, parameter and variable expansion, arithmetic expansion, and command substitution (done in a left-to-right fashion); word splitting; pathname expansion; and quote removal"</em> — khai triển ngoặc nhọn; khai triển dấu ngã, biến, số học và thay thế lệnh (làm cùng một lượt, từ trái sang phải); cắt từ; khai triển tên file; bỏ dấu nháy. Mọi điều bất ngờ trong chương này đều rơi ra từ câu đó. Đây là một dòng lệnh đi qua đủ các bước, chạy thật (<code>ext=txt</code>, <code>v='x *.md'</code>, thư mục có <code>README.md</code> và <code>notes.md</code>):</p>
<pre><code>ext=txt; v='x *.md'
printf '[%s]\\n' {a,b}.$ext ~ $((6*7)) $v '*'</code></pre>
<div class="out">[a.txt]
[b.txt]
[/home/an]
[42]
[x]
[README.md]
[notes.md]
[*]</div>
<table>
<tr><th>Bước</th><th>Ví dụ biến thành gì</th><th>Hệ quả bạn sẽ gặp</th></tr>
<tr><td>1 · Ngoặc nhọn <code>{a,b}</code> <code>{1..5}</code></td><td><code>{a,b}.$ext</code> → <code>a.$ext b.$ext</code> — chỉ là chữ, biến chưa được biết</td><td><code>n=3; echo {1..$n}</code> in <code>{1..3}</code>: khoảng cần có TRƯỚC khi <code>$n</code> tồn tại</td></tr>
<tr><td>2 · Dấu ngã <code>~</code></td><td><code>~</code> → <code>/home/an</code></td><td>chỉ khi không nháy: <code>"~/x"</code> vẫn là chữ <code>~/x</code> (đã thử)</td></tr>
<tr><td>3 · <code>$biến</code> <code>$(lệnh)</code> <code>$((…))</code></td><td><code>$ext</code> → <code>txt</code>, <code>$((6*7))</code> → <code>42</code>, <code>$v</code> → MỘT mẩu <code>x *.md</code></td><td>kết quả KHÔNG được khai triển ngoặc nhọn hay dấu ngã lần nữa: <code>b='{1,2}'; echo $b</code> in <code>{1,2}</code></td></tr>
<tr><td>4 · Cắt từ (word splitting)</td><td>chỉ KẾT QUẢ không nháy của bước 3 bị cắt theo IFS: <code>x</code> + <code>*.md</code></td><td>toàn bộ Bài 6.2; dấu nháy tắt nó đi</td></tr>
<tr><td>5 · Glob (tên file)</td><td><code>*.md</code> → <code>README.md notes.md</code>; <code>'*'</code> có nháy nên để yên</td><td>một giá trị chứa <code>*</code> có thể nở thành mọi file (Bài 2.2)</td></tr>
<tr><td>6 · Bỏ dấu nháy (quote removal)</td><td><code>'*'</code> → <code>*</code></td><td>chương trình không bao giờ thấy dấu nháy của bạn; chúng chỉ dặn bash đừng làm gì</td></tr>
</table>
<p>Thay thế tiến trình <code>&lt;(…)</code> diễn ra cùng lúc với bước 3 (Chương 13). Muốn xem kết quả của cả sáu bước với bất kỳ dòng nào, bật chế độ vết (xtrace): <code>set -x</code> in <code>+ printf '[%s]\\n' a.txt b.txt /home/an 42 x README.md notes.md '*'</code> cho ví dụ trên — xtrace thêm lại dấu nháy chỉ để bạn đọc được. Công cụ còn lại mà bạn sẽ dùng suốt chương là <code>printf '[%s]\\n' …</code>: nó in từng tham số nhận được trên một dòng riêng, trong ngoặc vuông, để bạn đếm được số tham số và thấy cả dấu cách ở đầu hay cuối.</p>
<h3>Ba loại dấu nháy</h3>
${slide('lx-06', 10, 'Ba loại nháy soi bằng printf "[%s]"')}
<div class="kv-grid">
  <div class="kv"><span class="k"><code>"nháy kép"</code></span><span class="v">Khai triển <code>\$var</code>, <code>\$(lệnh)</code> và <code>\$((số học))</code>; dập việc cắt từ và khai triển glob. <strong>Mặc định của bạn.</strong></span></div>
  <div class="kv"><span class="k"><code>'nháy đơn'</code></span><span class="v">KHÔNG khai triển <strong>gì cả</strong> — mọi ký tự đều nguyên văn, kể cả <code>\$</code> và <code>\\</code>. Thứ duy nhất nó không chứa được là một dấu nháy đơn khác. Dùng cho chương trình awk/sed, cho regex, và cho mọi thứ có dấu <code>\$</code> nguyên văn.</span></div>
  <div class="kv"><span class="k">không nháy</span><span class="v">Mọi thứ khai triển, rồi cắt, rồi glob. Chỉ đúng khi bạn <em>CỐ Ý</em> muốn cắt — chuyện hiếm, và nên kèm một dòng chú thích.</span></div>
</div>
<pre><code class="language-bash">name="Binh"
echo "Chào \$name, hôm nay là \$(date +%A)"
echo 'Chào \$name, hôm nay là \$(date +%A)'
echo "Giá: \\\$5"                 <span class="tok-comment"># gạch chéo ngược thoát dấu \$ bên trong nháy kép</span></code></pre>
<div class="out">Chào Binh, hôm nay là Friday
Chào \$name, hôm nay là \$(date +%A)
Giá: \$5</div>
<pre><code class="language-bash"><span class="tok-comment"># Trộn chúng trong một tham số — chúng chỉ đơn giản là nối lại, không có dấu cách ở giữa</span>
echo 'nguyên văn \$HOME là '"\$HOME"
awk -v n="\$name" '{print n, \$1}' file.txt    <span class="tok-comment"># nháy đơn cho awk, nháy kép cho giá trị của shell</span></code></pre>
<div class="out">nguyên văn \$HOME là /home/deploy</div>
<div class="callout ok">Hai chuỗi có nháy đứng cạnh nhau sẽ nối lại không có dấu ngăn, và đó là cách bạn dựng một chuỗi vừa có phần nguyên văn vừa có phần được khai triển. Đây cũng là câu trả lời cho "làm sao đặt một dấu nháy đơn bên trong nháy đơn": không được, nên bạn đóng lại, thêm <code>"'"</code>, rồi mở ra tiếp — <code>'it'"'"'s'</code>. Xấu, và là lý do nên với tay lấy một chuỗi nháy kép với dấu <code>\$</code> đã thoát khi có thể.</div>

<h3>"\$@" so với "\$*" so với \$@</h3>
${slide('lx-06', 11, '"$@" giữ nguyên từng tham số')}
<p>Ba cách viết, ba hành vi khác nhau, và thường chỉ một cái là đúng:</p>
<pre><code><span class="tok-comment"># show-args.sh</span>
for arg in "\$@"; do echo "[\$arg]"; done

./show-args.sh "hello world" foo</code></pre>
<div class="out">[hello world]
[foo]</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>"\$@"</code></span><span class="v">Mỗi tham số vẫn là một từ, giữ nguyên dấu cách. <strong>Gần như luôn là thứ bạn muốn.</strong></span></div>
  <div class="kv"><span class="k"><code>\$@</code> (không nháy)</span><span class="v">Mỗi tham số lại bị cắt từ một lần nữa — <code>"hello world"</code> thành hai. Đánh mất đúng cái thông tin bạn cần.</span></div>
  <div class="kv"><span class="k"><code>"\$*"</code></span><span class="v">Mọi tham số gộp thành MỘT chuỗi, ngăn cách bằng ký tự đầu tiên của <code>IFS</code>. Thi thoảng hữu ích để dựng một thông điệp; không bao giờ dùng để truyền tham số đi tiếp.</span></div>
</div>
<pre><code><span class="tok-comment"># Lối viết của script bọc: truyền mọi thứ qua nguyên vẹn</span>
exec docker run --rm -v "\$PWD:/work" myimage "\$@"</code></pre>
<p>Dòng đó chuyển tiếp mọi tham số đúng như nó nhận được, kể cả những cái có dấu cách và dấu nháy. Viết thành <code>\$@</code> hay <code>"\$*"</code> thì nó sẽ làm hỏng chúng, và chỗ hỏng chỉ lộ ra với đúng một người dùng nào đó truyền vào một đường dẫn có dấu cách.</p>

<h3>Mảng: cách đúng để giữ một danh sách</h3>
${slide('lx-06', 12, 'Mảng: "${a[@]}" là cách mở đúng duy nhất')}
<pre><code class="language-bash">files=("report one.txt" "report two.txt" "notes.md")
echo "\${#files[@]}"           <span class="tok-comment"># có bao nhiêu phần tử: 3</span>
echo "\${files[0]}"            <span class="tok-comment"># phần tử đầu (đánh chỉ số từ 0)</span>
echo "\${files[@]}"            <span class="tok-comment"># mọi phần tử</span>

for f in "\${files[@]}"; do    <span class="tok-comment"># CÓ NHÁY và dùng @ — mỗi phần tử một vòng</span>
  echo "[\$f]"
done

files+=("extra.txt")          <span class="tok-comment"># nối thêm</span></code></pre>
<div class="out">3
report one.txt
[report one.txt]
[report two.txt]
[notes.md]</div>
<div class="callout warn"><code>"\${arr[@]}"</code> — có nháy, dùng <code>@</code> — là cách ĐÚNG DUY NHẤT để khai triển một mảng. <code>"\${arr[*]}"</code> bẹp nó thành một chuỗi; <code>\${arr[@]}</code> không nháy thì cắt lại mọi phần tử theo dấu cách. Khác biệt đó vô hình cho tới khi có một phần tử chứa dấu cách, và lúc ấy nó là một lỗi chỉ tái hiện với vài đầu vào nhất định.</div>
<pre><code><span class="tok-comment"># Dựng dần một lệnh — chính là lý do mảng tồn tại</span>
args=(--verbose --output "/tmp/my output.log")
[[ -n "\$filter" ]] &amp;&amp; args+=(--filter "\$filter")
mycommand "\${args[@]}"</code></pre>
<p>Phương án kia — dựng một lệnh trong một chuỗi thường rồi mong shell cắt lại cho đúng — chính là sai lầm kinh điển mà cách này thay thế. Một chuỗi KHÔNG biểu diễn được khái niệm "một tham số có chứa dấu cách"; một mảng thì được.</p>

<h3>IFS: "khoảng trắng" thật ra nghĩa là gì</h3>
${slide('lx-06', 13, 'IFS quyết định cắt ở đâu — zsh không cắt $var')}
<pre><code class="language-bash">echo "\$IFS" | cat -A          <span class="tok-comment"># mặc định: dấu cách, tab, xuống dòng</span>

line="alice:x:1001:1001::/home/alice:/bin/bash"
IFS=':' read -r user _ uid gid _ home shell &lt;&lt;&lt; "\$line"
echo "\$user \$uid \$home \$shell"</code></pre>
<div class="out"> ^I\$
\$
alice 1001 /home/alice /bin/bash</div>
<p><code>IFS</code> (Internal Field Separator) là biến điều khiển bước 3 trong sơ đồ khai triển. Đặt nó ngay trên cùng dòng với một lệnh sẽ đổi nó CHỈ cho lệnh đó, và đó là cách sạch sẽ để tách một dòng có dấu phân cách mà không cần <code>cut</code> hay <code>awk</code>. Dấu <code>_</code> là cái tên vứt đi theo quy ước, dành cho những trường bạn không cần.</p>
<div class="callout">Đặt <code>IFS</code> ở phạm vi toàn cục là một cách đã được biết đến để làm hỏng script theo những kiểu khó hiểu, vì mọi thứ phía sau đó sẽ cắt khác đi. Hãy ưu tiên dạng chỉ-một-lệnh (<code>IFS=':' read …</code>), hoặc lưu lại rồi khôi phục. Cái đặt toàn cục DUY NHẤT được coi là chuẩn mực là <code>IFS=\$'\\n\\t'</code> ở đầu một script nghiêm ngặt — nó bỏ dấu cách khỏi danh sách dấu phân cách, nên những phép khai triển lỡ quên nháy sẽ vỡ với ít đầu vào hơn nhiều.</div>

<h3>Mười cặp trước–sau</h3>
<pre><code class="language-bash"><span class="tok-comment"># 1  kiểm một biến có thể rỗng</span>
[ \$var = "yes" ]            →  [ "\$var" = "yes" ]

<span class="tok-comment"># 2  một đường dẫn có thể có dấu cách</span>
cd \$HOME/My Documents       →  cd "\$HOME/My Documents"

<span class="tok-comment"># 3  thay thế lệnh</span>
files=\$(ls)                  →  mapfile -t files &lt; &lt;(ls)

<span class="tok-comment"># 4  truyền tham số qua tiếp</span>
myscript \$@                  →  myscript "\$@"

<span class="tok-comment"># 5  một mẫu cho find</span>
find . -name *.log           →  find . -name "*.log"

<span class="tok-comment"># 6  một chương trình awk</span>
awk "{print \\\$1}" f          →  awk '{print \$1}' f

<span class="tok-comment"># 7  khai triển mảng</span>
for f in \${files[*]}         →  for f in "\${files[@]}"

<span class="tok-comment"># 8  một giá trị có thể rỗng</span>
grep \$pattern file           →  grep -- "\$pattern" file

<span class="tok-comment"># 9  đích của phép chuyển hướng</span>
echo hi &gt; \$out               →  echo hi &gt; "\$out"

<span class="tok-comment"># 10 số học — chỗ DUY NHẤT không cần nháy</span>
if [ "\$a" -gt "\$b" ]        →  if (( a &gt; b ))</code></pre>
<div class="callout ok">Số 10 là ngoại lệ đáng gọi tên: bên trong <code>(( ))</code> và <code>[[ ]]</code>, bash KHÔNG cắt từ, nên ở đó dấu nháy là tuỳ chọn. Mọi chỗ khác — <code>[ ]</code>, tham số của lệnh, phép chuyển hướng, gán từ một phép thay thế — đều phải có nháy. Khi phân vân thì cứ đặt nháy; không có trường hợp nào mà đặt nháy đúng lại làm hỏng thứ mà không nháy xử lý được.</div>

<h3>Chỗ nào được bỏ nháy — và chỗ nào thêm nháy lại ĐỔI nghĩa</h3>
<p>"Nháy mọi thứ" là mặc định đúng, nhưng để đọc script của người khác bạn cần biết vài chỗ bash vốn đã không cắt từ, và hai chỗ mà thêm nháy vào sẽ âm thầm đổi việc mã làm. Mọi dòng đã thử trên bash 5.2:</p>
<table>
<tr><th>Chỗ</th><th>Không nháy thì…</th><th>Đã thử</th></tr>
<tr><td>Phép gán <code>b=$a</code>, <code>c=$(lệnh)</code></td><td>an toàn — không cắt, không glob</td><td><code>a="x   y"; b=$a</code> giữ nguyên ba dấu cách</td></tr>
<tr><td>Trong <code>[[ ]]</code>, vế trái</td><td>an toàn</td><td><code>[[ $var == yes ]]</code> với <code>var</code> rỗng chỉ đơn giản là sai</td></tr>
<tr><td>Trong <code>(( ))</code>, <code>case $x in</code></td><td>an toàn</td><td>—</td></tr>
<tr><td>Vế phải của <code>==</code> trong <code>[[ ]]</code></td><td>là một <strong>MẪU</strong> (pattern); có nháy = chữ thường</td><td><code>[[ app.log == *.log ]]</code> đúng · <code>[[ app.log == "*.log" ]]</code> sai</td></tr>
<tr><td>Vế phải của <code>=~</code></td><td>là một <strong>REGEX</strong>; có nháy = chữ thường</td><td><code>re='^[0-9]+$'; [[ 42 =~ $re ]]</code> đúng · <code>[[ 42 =~ "$re" ]]</code> sai</td></tr>
<tr><td>Mọi chỗ khác</td><td>cắt + glob — hãy đặt nháy</td><td>—</td></tr>
</table>
<p>Loại nháy thứ tư là <code>$'…'</code> (ANSI-C quoting — nháy kiểu C): bên trong nó <code>\\t</code>, <code>\\n</code> và <code>\\'</code> thành một tab, một ký tự xuống dòng và một dấu nháy đơn THẬT. Đó là cách viết <code>IFS=$'\\n\\t'</code> hay <code>$'it\\'s'</code>, và cách gỡ ký tự về đầu dòng của Windows bằng <code>\${line%$'\\r'}</code> (Bài 6.5).</p>

<h3>Trên macOS và WSL khác gì</h3>
<p>Đây là chỗ Mac làm nhiều người bất ngờ nhất, vì shell mặc định của Mac là zsh, và zsh CỐ Ý không làm bước 4 với biến thường. Chạy trên Mac M1, zsh 5.9 (<code>-f</code> = không đọc file cấu hình):</p>
<pre><code>zsh -f -c 'v="a b *.txt"; printf "[%s]\\n" $v'
zsh -f -c 'v="a b *.txt"; printf "[%s]\\n" \${=v}'
zsh -f -c 'n=3; echo {1..$n}'
zsh -f -c 'a=(x y z); echo "a[1]=$a[1] a[0]=[$a[0]]"'</code></pre>
<div class="out">[a b *.txt]
[a]
[b]
[*.txt]
1 2 3
a[1]=x a[0]=[]</div>
<p>Vậy trong zsh, <code>$v</code> không nháy vẫn là MỘT từ (<code>\${=v}</code> mới là yêu cầu cắt), <code>{1..$n}</code> chạy được vì zsh khai triển ngoặc nhọn SAU biến, và mảng bắt đầu từ chỉ số 1. Một script bạn "đã thử" bằng cách dán từng dòng vào terminal Mac có thể qua ở đó rồi vỡ dưới bash — luôn chạy nó bằng đúng trình thông dịch mà shebang gọi tên. <code>/bin/bash</code> trên Mac (3.2) cắt từ y như Linux. <strong>WSL</strong>: giống hệt Ubuntu, thêm một điều — script lưu từ trình soạn thảo Windows với kiểu xuống dòng CRLF sẽ hỏng với <code>$'\\r': command not found</code>, vì ký tự <code>\\r</code> dính vào từ cuối của mỗi dòng.</p>
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> script bọc của một bạn cùng nhóm "làm mất" file <code>bao cao Q3.pdf</code> mà giảng viên tải lên, và có lần in ra cả thư mục khi ai đó truyền vào <code>*</code>. Dựng lại bằng những tên file hiểm rồi sửa nó.</p><ol>
<li><code>mkdir -p ~/thu-linux/ch6/q2 &amp;&amp; cd ~/thu-linux/ch6/q2 &amp;&amp; touch -- 'bao cao Q3.pdf' '*' -n notes.txt</code></li>
<li>Viết <code>~/thu-linux/ch6/dem.sh</code> chỉ một dòng: <code>for a in $@; do printf "[%s]\\n" "$a"; done</code>. Chạy <code>bash ../dem.sh * | wc -l</code> và giải thích từng dòng thừa bằng bảng thứ tự khai triển.</li>
<li>Chạy <code>bash -x ../dem.sh 'a b'</code> để nhìn các tham số bash THẬT SỰ truyền đi, rồi sửa script bằng đúng một cặp dấu nháy.</li>
<li>Trong script, dựng <code>args=(--label "bao cao")</code> và in <code>printf '[%s]\\n' "\${args[@]}"</code> so với <code>\${args[*]}</code> không nháy.</li>
</ol>
<p><strong>Đạt khi:</strong> trước khi sửa, <code>bash ../dem.sh * | wc -l</code> in <code>9</code> (bốn tên, nhưng <code>*</code> lại glob ra đủ bốn tên và <code>bao cao Q3.pdf</code> bị cắt làm ba); sau khi sửa in <code>4</code>; và mảng có nháy in <code>[--label]</code> <code>[bao cao]</code>, không nháy thì ra ba dòng.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Word splitting (cắt từ)</span><span class="v">Cắt KẾT QUẢ không nháy của một phép khai triển thành nhiều tham số tại các ký tự IFS.</span></div>
  <div class="kv"><span class="k">IFS (dấu phân tách trường)</span><span class="v">Những ký tự dùng để cắt: mặc định là dấu cách, tab, xuống dòng.</span></div>
  <div class="kv"><span class="k">Globbing (khai triển tên file)</span><span class="v">Biến <code>*</code>, <code>?</code>, <code>[…]</code> thành những tên file khớp.</span></div>
  <div class="kv"><span class="k">Quote removal (bỏ dấu nháy)</span><span class="v">Bước cuối: dấu nháy bị gỡ đi trước khi chương trình chạy.</span></div>
  <div class="kv"><span class="k">ANSI-C quoting <code>$'…'</code> (nháy kiểu C)</span><span class="v">Loại nháy mà <code>\\n</code>, <code>\\t</code> thành ký tự điều khiển thật.</span></div>
  <div class="kv"><span class="k"><code>"$@"</code> (mọi tham số)</span><span class="v">Mọi tham số vị trí, mỗi cái đúng một từ.</span></div>
  <div class="kv"><span class="k">xtrace (<code>set -x</code>, chế độ vết)</span><span class="v">In mỗi lệnh SAU khi khai triển, có dấu <code>+</code> đứng đầu.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Bash khai triển theo thứ tự cố định: ngoặc nhọn → dấu ngã/biến/số học/lệnh (trái sang phải) → cắt từ → glob → bỏ dấu nháy.</li>
<li>Ngoặc nhọn chạy trước biến nên <code>{1..$n}</code> không chạy trong bash; kết quả của bước 3 không bao giờ bị khai triển ngoặc nhọn lần nữa.</li>
<li>Nháy kép giữ các phép <code>$</code> nhưng chặn cắt từ và glob; nháy đơn chặn tất cả; <code>$'…'</code> cho ký tự điều khiển thật.</li>
<li><code>"$@"</code> và <code>"\${arr[@]}"</code> là hai dạng duy nhất giữ nguyên từng tham số, từng phần tử.</li>
<li>Phép gán, <code>[[ ]]</code> và <code>(( ))</code> không cắt từ — nhưng đặt nháy vế phải của <code>==</code> hay <code>=~</code> biến mẫu thành chữ thường.</li>
<li>zsh không cắt <code>$var</code> và khai triển được <code>{1..$n}</code>; hãy thử script bash bằng bash, và soi tham số thật bằng <code>printf '[%s]\\n'</code> hoặc <code>set -x</code>.</li>
</ul>
<a class="link-card" href="https://mywiki.wooledge.org/Quotes" target="_blank" rel="noopener">
  <span class="lc-ico">🔧</span>
  <span class="lc-body"><span class="lc-title">Greg's Wiki — Quotes</span><span class="lc-sub">Lời giải thích dứt khoát về khi nào và vì sao, kèm đúng thứ tự khai triển. Nếu phần nào trong bài này còn thấy mơ hồ thì trang này lấp đầy.</span></span>
</a>
<a class="link-card" href="https://www.gnu.org/software/bash/manual/html_node/Word-Splitting.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Bash Manual — Word Splitting và IFS</span><span class="lc-sub">Luật chính thống cho bước 3, gồm cả cách xử lý riêng giữa ký tự khoảng trắng và ký tự không phải khoảng trắng trong IFS.</span></span>
</a>
<a class="link-card" href="https://github.com/koalaman/shellcheck/wiki/SC2086" target="_blank" rel="noopener">
  <span class="lc-ico">✅</span>
  <span class="lc-body"><span class="lc-title">ShellCheck SC2086 — "Double quote to prevent globbing and word splitting"</span><span class="lc-sub">Cảnh báo bị kích hoạt nhiều nhất của ShellCheck, kèm ví dụ cụ thể về chuyện thật sự hỏng ra sao. Mọi trang wiki đều được liên kết thẳng từ output của công cụ.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: làm nó vỡ bằng một dấu cách</span><span class="lc-sub">Bài chấm điểm trên một thư mục mẫu đầy tên file chứa dấu cách, dấu nháy và dấu sao. Mọi phép khai triển thiếu nháy đều hỏng lộ liễu.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> việc thiếu nháy vẫn chạy ổn cho tới ngày nó không ổn nữa, và cái ngày đó do DỮ LIỆU của bạn chọn. Một script chạy hoàn hảo suốt một năm sẽ vỡ ngay lần đầu có người tải lên <code>Bao cao Q3.pdf</code>, hoặc một giá trị cấu hình hoá ra rỗng, hoặc một tên file bắt đầu bằng dấu gạch ngang. Vì lỗi phụ thuộc vào ĐẦU VÀO chứ không phải vào mã, việc thử với những tên file gọn gàng của chính bạn chẳng chứng minh được gì. Hai thói quen bịt lại chỗ này: chạy <code>shellcheck</code> với mọi script, và thử trên một thư mục cố tình hiểm ác — <code>touch 'a b.txt' '-rf' '*' "it's"</code> — trước khi bạn tin nó.</div>
<p class="note-ct"><strong>Cái luật, nén lại:</strong> nháy kép quanh mọi phép khai triển <code>\$</code>; nháy đơn cho mọi thứ phải giữ nguyên văn; <code>"\$@"</code> và <code>"\${arr[@]}"</code> luôn có cả dấu nháy lẫn dấu <code>@</code>. Đó là toàn bộ bài học, và việc tuân theo nó một cách máy móc — không cân nhắc lại mỗi lần — chính là thứ làm script shell thôi mong manh.</p>
</div>
`,
    },
    /* ─────────────────────────── 6.3 ─────────────────────────── */
    {
      title: '6.3 — Parameter expansion: string work without leaving bash|||6.3 — Khai triển tham số: xử lý chuỗi mà không phải rời khỏi bash',
      slug: 'lnx-6-3-khai-trien-tham-so',
      type: 'LESSON',
      description: 'Giá trị mặc định và biến bắt buộc, cắt tiền tố/hậu tố bằng # và %, thay thế bằng /, cắt lát, đổi hoa thường — và vì sao chúng nhanh hơn basename/dirname/sed hàng chục lần.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.3</span>
<h2>Parameter expansion</h2>
<p class="lead">Bash can slice, trim, substitute and default a string entirely inside <code>\${…}</code>, with no external program and no subshell. The syntax is dense and looks like line noise the first time — but there are only six forms, they compose, and each one replaces a <code>sed</code> or <code>basename</code> call that costs a process launch.</p>

<h3>Defaults, and the one that fails loudly</h3>
${slide('lx-06', 14, 'Bốn toán tử mặc định: chưa đặt khác rỗng')}
<pre><code class="language-bash">name=""
unset colour

echo "\${name:-anonymous}"     <span class="tok-comment"># use default if unset OR empty</span>
echo "\${name-anonymous}"      <span class="tok-comment"># use default only if UNSET (empty is fine)</span>
echo "\${colour:-blue}"
echo "\${colour}"              <span class="tok-comment"># still unset — :- does not assign</span>

: "\${colour:=green}"          <span class="tok-comment"># := ASSIGNS the default as a side effect</span>
echo "\${colour}"

echo "\${name:+prefix-}"       <span class="tok-comment"># :+ is the inverse — use alt only if SET</span></code></pre>
<div class="out">anonymous

blue

green
</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>\${var:-x}</code></span><span class="v">Use <code>x</code> if <code>var</code> is unset or empty. Does not change <code>var</code>.</span></div>
  <div class="kv"><span class="k"><code>\${var:=x}</code></span><span class="v">Same, but also <strong>assigns</strong> <code>x</code> to <code>var</code>. The <code>:</code> command in front is a no-op that lets you use it as a statement.</span></div>
  <div class="kv"><span class="k"><code>\${var:?msg}</code></span><span class="v"><strong>Abort with an error</strong> if unset or empty. The best line of validation you can write.</span></div>
  <div class="kv"><span class="k"><code>\${var:+x}</code></span><span class="v">Use <code>x</code> only if <code>var</code> <em>is</em> set. Useful for conditional flags.</span></div>
</div>
<pre><code><span class="tok-comment"># Required configuration — fail immediately and say what is missing</span>
: "\${DATABASE_URL:?DATABASE_URL is required}"
: "\${DEPLOY_ENV:?set DEPLOY_ENV to staging or production}"</code></pre>
<div class="out">./deploy.sh: line 4: DATABASE_URL: DATABASE_URL is required</div>
<div class="callout ok"><code>\${VAR:?message}</code> is the highest value-per-character construct in this chapter. Two lines at the top of a deploy script turn "the app started and then failed mysteriously three minutes later with an empty connection string" into "it refused to start and told you which variable was missing". The script exits non-zero, so CI catches it too.</div>
<pre><code class="language-bash"><span class="tok-comment"># Conditional flag, without an if</span>
verbose=1
rsync \${verbose:+--verbose} -a src/ dst/

<span class="tok-comment"># Config with a fallback chain</span>
port="\${PORT:-\${DEFAULT_PORT:-3000}}"</code></pre>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Defaults</span><span class="lz-lnote"><code>:-</code> fallback · <code>:=</code> fallback and assign · <code>:?</code> abort with a message · <code>:+</code> use only if set</span></div>
  <div class="lz-layer"><span class="lz-lname">Trim</span><span class="lz-lnote"><code>#</code> from the left · <code>%</code> from the right · doubled (<code>##</code>, <code>%%</code>) means longest match</span></div>
  <div class="lz-layer"><span class="lz-lname">Substitute</span><span class="lz-lnote"><code>/old/new</code> first · <code>//old/new</code> all · <code>/#</code> anchored to start · <code>/%</code> anchored to end</span></div>
  <div class="lz-layer"><span class="lz-lname">Slice</span><span class="lz-lnote"><code>\${#var}</code> length · <code>\${var:offset:length}</code> substring · <code>\${var: -n}</code> last n (note the space)</span></div>
  <div class="lz-layer"><span class="lz-lname">Case</span><span class="lz-lnote"><code>^^</code> upper · <code>,,</code> lower · <code>^</code> capitalise first letter</span></div>
  <div class="lz-layer"><span class="lz-lname">Indirect</span><span class="lz-lnote"><code>\${!name}</code> read by variable name · <code>\${!prefix@}</code> list matching names</span></div>
</div>
<h3>Trimming: # from the left, % from the right</h3>
${slide('lx-06', 15, '# xén từ trái, % xén từ phải')}
<p>Two operators remove a matching pattern from one end. The mnemonic is the keyboard: <code>#</code> is left of <code>%</code> on a US layout, and it trims from the left.</p>
<pre><code class="language-bash">path="/srv/app/config/db.yml"

echo "\${path##*/}"       <span class="tok-comment"># longest match from LEFT  → basename</span>
echo "\${path%/*}"        <span class="tok-comment"># shortest match from RIGHT → dirname</span>
echo "\${path#*/}"        <span class="tok-comment"># shortest from left</span>
echo "\${path%%/*}"       <span class="tok-comment"># longest from right</span></code></pre>
<div class="out">db.yml
/srv/app/config
srv/app/config/db.yml
</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>\${var#pat}</code></span><span class="v">Remove the <strong>shortest</strong> match of <code>pat</code> from the start.</span></div>
  <div class="kv"><span class="k"><code>\${var##pat}</code></span><span class="v">Remove the <strong>longest</strong> match from the start. Doubling means greedy.</span></div>
  <div class="kv"><span class="k"><code>\${var%pat}</code></span><span class="v">Remove the shortest match from the <strong>end</strong>.</span></div>
  <div class="kv"><span class="k"><code>\${var%%pat}</code></span><span class="v">Remove the longest match from the end.</span></div>
</div>
<pre><code class="language-bash">file="archive.tar.gz"
echo "\${file%.*}"         <span class="tok-comment"># strip ONE extension  → archive.tar</span>
echo "\${file%%.*}"        <span class="tok-comment"># strip ALL extensions → archive</span>
echo "\${file##*.}"        <span class="tok-comment"># just the extension   → gz</span>

url="https://cuongthai.com/api/v1/posts"
echo "\${url#*://}"        <span class="tok-comment"># drop the scheme</span>
echo "\${url##*/}"         <span class="tok-comment"># last path segment</span>

branch="refs/heads/feature/login"
echo "\${branch#refs/heads/}"   <span class="tok-comment"># feature/login</span></code></pre>
<div class="out">archive.tar
archive
gz
cuongthai.com/api/v1/posts
posts
feature/login</div>
<div class="callout">The patterns here are <strong>globs, not regexes</strong> (Lesson 2.2): <code>*</code>, <code>?</code> and <code>[…]</code> work; <code>+</code>, <code>|</code> and <code>\\d</code> do not. That is why <code>\${path##*/}</code> means "remove everything up to and including the last slash" — the greedy <code>*</code> eats as much as it can while still leaving a <code>/</code> to match.</div>

<h3>Substitution</h3>
${slide('lx-06', 16, '/ và //, và dấu &amp; của bash 5.2')}
<pre><code class="language-bash">s="hello world world"

echo "\${s/world/there}"      <span class="tok-comment"># FIRST occurrence</span>
echo "\${s//world/there}"     <span class="tok-comment"># ALL occurrences (doubled slash)</span>
echo "\${s//o/}"              <span class="tok-comment"># delete: empty replacement</span>
echo "\${s/#hello/HI}"        <span class="tok-comment"># /# anchors to the START</span>
echo "\${s/%world/WORLD}"     <span class="tok-comment"># /% anchors to the END</span></code></pre>
<div class="out">hello there world
hello there there
hell wrld wrld
HI world world
hello world WORLD</div>
<pre><code class="language-bash"><span class="tok-comment"># Practical: normalise a branch name into a docker tag</span>
branch="feature/user-login"
tag="\${branch//\\//-}"        <span class="tok-comment"># slashes → dashes (the / is escaped)</span>
echo "myapp:\${tag}"</code></pre>
<div class="out">myapp:feature-user-login</div>

<h3>Length, slicing, and case</h3>
${slide('lx-06', 17, 'Độ dài, cắt lát, hoa thường')}
<pre><code class="language-bash">s="deployment"
echo "\${#s}"              <span class="tok-comment"># length: 10</span>
echo "\${s:0:6}"           <span class="tok-comment"># from index 0, 6 chars</span>
echo "\${s:6}"             <span class="tok-comment"># from index 6 to the end</span>
echo "\${s: -4}"           <span class="tok-comment"># LAST 4 — note the space before -4</span>

echo "\${s^^}"             <span class="tok-comment"># UPPERCASE (bash 4+)</span>
echo "\${s,,}"             <span class="tok-comment"># lowercase</span>
echo "\${s^}"              <span class="tok-comment"># capitalise first letter only</span></code></pre>
<div class="out">10
deploy
ment
ment
DEPLOYMENT
deployment
Deployment</div>
<div class="callout warn">The space in <code>\${s: -4}</code> is required. Without it, <code>\${s:-4}</code> is the <em>default-value</em> operator from the top of this lesson and means "use 4 if <code>s</code> is empty" — a completely different result that will not error. Two syntaxes, one character apart, and only a space distinguishes them.</div>

<h3>Replacing external commands</h3>
${slide('lx-06', 18, 'Không fork thì nhanh gấp ~200 lần; bash 3.2 của Mac')}
<pre><code class="language-bash">path="/srv/app/config/db.yml"

<span class="tok-comment"># Each of these launches a process — ~1-3 ms and a fork</span>
basename "\$path"          <span class="tok-comment">→ db.yml</span>
dirname "\$path"           <span class="tok-comment">→ /srv/app/config</span>
echo "\$path" | sed 's|.*/||'

<span class="tok-comment"># Each of these is pure bash — no process, no subshell</span>
echo "\${path##*/}"
echo "\${path%/*}"</code></pre>
<div class="out">$ time for i in {1..10000}; do basename "\$path" &gt;/dev/null; done
real  0m11.204s
$ time for i in {1..10000}; do echo "\${path##*/}" &gt;/dev/null; done
real  0m0.089s</div>
<p>Measured: 126× faster over ten thousand iterations. In a one-off command the difference is invisible; in a loop over a few thousand files it is the difference between a script that takes eleven seconds and one that feels instant. The habit is worth forming because it costs nothing once you know the syntax.</p>
<div class="callout ok">There is one caveat worth knowing: <code>\${path##*/}</code> and <code>basename</code> disagree on edge cases. For <code>/srv/app/</code> with a trailing slash, <code>basename</code> gives <code>app</code>, while <code>\${path##*/}</code> gives an empty string. If you are handling paths you did not construct, <code>basename</code>'s edge-case handling may be worth the fork.</div>

<h3>Indirection and listing</h3>
<pre><code class="language-bash">DB_HOST=localhost
DB_PORT=5432
DB_NAME=app

<span class="tok-comment"># Every variable name starting with DB_</span>
echo "\${!DB_@}"

<span class="tok-comment"># Read a variable whose NAME is in another variable</span>
key="DB_HOST"
echo "\${!key}"</code></pre>
<div class="out">DB_HOST DB_NAME DB_PORT
localhost</div>
<pre><code class="language-bash"><span class="tok-comment"># A config validator built from the two together</span>
for var in "\${!DB_@}"; do
  : "\${!var:?\$var is empty}"
done
echo "database config OK"</code></pre>
<div class="out">database config OK</div>

<h3>A worked example</h3>
<pre><code>#!/usr/bin/env bash
<span class="tok-comment"># Rename every .jpeg to .jpg, adding a date prefix — no external tools</span>
for f in *.jpeg; do
  [[ -e "\$f" ]] || continue          <span class="tok-comment"># nullglob guard (Lesson 2.2)</span>
  base="\${f##*/}"                    <span class="tok-comment"># strip any directory</span>
  stem="\${base%.jpeg}"               <span class="tok-comment"># strip the extension</span>
  clean="\${stem// /_}"               <span class="tok-comment"># spaces → underscores</span>
  mv -n -- "\$f" "\$(date +%Y%m%d)_\${clean,,}.jpg"
done</code></pre>
<div class="out">$ ls
20260822_beach_sunset.jpg  20260822_family_photo.jpg</div>
<p>Four expansions, one <code>mv</code>, no <code>basename</code>, no <code>sed</code>, no subshell except the one <code>date</code>. That is the shape most file-processing loops should have.</p>

<h3>The whole table: unset, empty and set are three different states</h3>
<p>The colon in <code>:-</code>, <code>:=</code>, <code>:?</code>, <code>:+</code> means "treat <em>empty</em> like <em>unset</em>". Drop the colon and only a truly unset variable triggers the operator. Real output, one row per state:</p>
<pre><code>for st in unset empty set; do
  unset v; case $st in empty) v=;; set) v=val;; esac
  printf '%-6s :-[%s] -[%s] :+[%s] +[%s]\\n' "$st" "\${v:-D}" "\${v-D}" "\${v:+A}" "\${v+A}"
done</code></pre>
<div class="out">unset  :-[D] -[D] :+[] +[]
empty  :-[D] -[] :+[] +[A]
set    :-[val] -[val] :+[A] +[A]</div>
<p>For configuration you almost always want the colon form: an environment variable set to the empty string (<code>DATABASE_URL=</code> left blank in a <code>.env</code> file) is just as broken as a missing one. The colon-less form is for the rare case where "empty" is a meaningful value you must not overwrite. Related: <code>set -u</code> (Chapter 7) makes any use of an unset variable an error — and <code>\${X:-}</code> is how you say "unset is fine here" under it.</p>

<h3>Transformations and two traps: <code>&amp;</code> in bash 5.2, and Vietnamese text</h3>
<table>
<tr><th>Form</th><th>Does</th><th>Tested (bash 5.2)</th></tr>
<tr><td><code>\${v@Q}</code></td><td>Quote the value so it can be pasted back into a shell safely</td><td><code>it's "x" $y</code> → <code>'it'\\''s "x" $y'</code></td></tr>
<tr><td><code>\${v@U}</code> · <code>\${v@u}</code> · <code>\${v@L}</code></td><td>Upper · first letter upper · lower (bash 5.1+)</td><td><code>hello</code> → <code>HELLO Hello hello</code></td></tr>
<tr><td><code>\${v@A}</code></td><td>The <code>declare</code> command that would recreate it</td><td><code>declare -i num='5'</code></td></tr>
<tr><td><code>\${t^^[aeiou]}</code></td><td>Upper-case only characters matching a pattern</td><td><code>xin chao ban</code> → <code>xIn chAO bAn</code></td></tr>
<tr><td><code>\${#u}</code></td><td>Length in <strong>characters of the current locale</strong></td><td><code>u="đường"</code>: <code>5</code> under C.UTF-8, <code>9</code> under <code>LC_ALL=C</code> (bytes)</td></tr>
</table>
<p><strong>Trap 1 — <code>&amp;</code> in the replacement.</strong> Since bash 5.2 the option <code>patsub_replacement</code> is on by default (bash(1): "This option is enabled by default"), and an unquoted <code>&amp;</code> in the replacement of <code>\${v/pat/rep}</code> means "the text that matched". It bites exactly when you insert a URL query string:</p>
<pre><code class="language-bash">q="a=1&amp;b=2"; u="x?QUERY"
echo "\${u/QUERY/$q}"
echo "\${u/QUERY/"$q"}"</code></pre>
<div class="out">x?a=1QUERYb=2
x?a=1&amp;b=2</div>
<p>Quote the replacement (or write <code>\\&amp;</code>) whenever it comes from a variable. The same line under the Mac's bash 3.2 prints the <code>&amp;</code> literally — one more reason a script can behave differently on two machines.</p>
<p><strong>Trap 2 — length and slicing depend on the locale.</strong> In a UTF-8 locale <code>\${#u}</code> counts characters and <code>\${u:0:2}</code> takes two letters; in a container or cron job with no locale set (<code>LC_ALL=C</code>/<code>POSIX</code>) the same code counts bytes, and slicing can cut a Vietnamese letter in half. If a script truncates names, set <code>LC_ALL=C.UTF-8</code> at the top.</p>

<h3>Run it step by step</h3>
<pre><code>p=/srv/app/config/db.yml; f=archive.tar.gz
printf '[%s]\\n' "\${p##*/}" "\${p%/*}" "\${p%%/*}" "\${f%.*}" "\${f#*.}"
x=/srv/app/; echo "[\${x##*/}] [$(basename "$x")]"
s="hello world world"; echo "\${s//[ol]/_}"
unset c; echo "[\${c:=green}] c=[$c]"
: "\${NOPE:?not set}"; echo "not reached"</code></pre>
<div class="out">[db.yml]
[/srv/app/config]
[]
[archive.tar]
[tar.gz]
[] [app]
he___ w_r_d w_r_d
[green] c=[green]
bash: NOPE: not set</div>
<p>Note the third and sixth lines: <code>\${p%%/*}</code> removes everything because the path starts with <code>/</code>, and on a path ending in <code>/</code> the pure-bash basename is empty while <code>basename</code> says <code>app</code>. The last line never prints: in a script, <code>:?</code> exits the whole script with status 1.</p>

<h3>On macOS and WSL</h3>
<p>Everything in this lesson except <code>#</code>, <code>%</code>, <code>/</code> and the four default operators is newer than the Mac's <code>/bin/bash</code> 3.2 (2007). Run on a Mac M1:</p>
<pre><code>/bin/bash -c 's=deploy; echo "\${s^^}"'
/bin/bash -c 'v="it s"; echo "\${v@Q}"'
/bin/bash -c 'a=(x y z); echo "\${a[-1]}"'
zsh -f -c 's=deploy; echo \${s:u} \${(U)s}'</code></pre>
<div class="out">/bin/bash: \${s^^}: bad substitution
/bin/bash: \${v@Q}: bad substitution
/bin/bash: a: bad array subscript
DEPLOY DEPLOY</div>
<p>zsh has its own spelling (<code>\${s:u}</code>, <code>\${(U)s}</code>) and rejects <code>\${s^^}</code> with <code>bad substitution</code>. Forks are also far more expensive on macOS: 2,000 calls to <code>basename</code> took 15.7 s on a Mac M1, against 6.06 s for 10,000 in the Ubuntu container — so replacing external commands inside loops pays off even more on a Mac. <strong>WSL</strong> behaves like Ubuntu.</p>
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> the CI pipeline gives your deploy script a branch name like <code>refs/heads/feature/Dang-Nhap</code> and an image file path, and the script must build a Docker tag and refuse to run without a registry URL — using no <code>sed</code>, <code>basename</code> or <code>tr</code>.</p><ol>
<li>In <code>~/thu-linux/ch6</code> write <code>tag.sh</code> with <code>ref=\${1:?usage: tag.sh REF FILE}</code> and <code>file=\${2:?usage: tag.sh REF FILE}</code>.</li>
<li>Strip <code>refs/heads/</code> with <code>#</code>, replace every <code>/</code> with <code>-</code>, and lower-case the result with <code>,,</code>.</li>
<li>From <code>file</code> print the name without directory and the extension, using <code>##*/</code> and <code>##*.</code>.</li>
<li>Add <code>: "\${REGISTRY:?set REGISTRY}"</code> and print <code>$REGISTRY/app:$tag</code>.</li>
</ol>
<p><strong>Done when:</strong> <code>REGISTRY=ghcr.io/nhom bash tag.sh refs/heads/feature/Dang-Nhap /srv/up/anh.bia.png</code> prints <code>ghcr.io/nhom/app:feature-dang-nhap</code>, <code>anh.bia.png</code> and <code>png</code>; the same command without <code>REGISTRY</code> exits with status 1 and the message <code>set REGISTRY</code>; with no arguments it prints the usage line.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Parameter expansion</span><span class="v">Any <code>\${…}</code> form that reads and transforms a variable inside bash.</span></div>
  <div class="kv"><span class="k">Unset vs empty</span><span class="v">Never assigned (or <code>unset</code>) versus assigned the empty string; <code>:</code> treats them alike.</span></div>
  <div class="kv"><span class="k">Default value</span><span class="v"><code>\${v:-x}</code> uses x; <code>\${v:=x}</code> also assigns it.</span></div>
  <div class="kv"><span class="k">Prefix / suffix removal</span><span class="v"><code>#</code>/<code>##</code> from the start, <code>%</code>/<code>%%</code> from the end; doubled = longest match.</span></div>
  <div class="kv"><span class="k">Pattern substitution</span><span class="v"><code>\${v/a/b}</code> first, <code>\${v//a/b}</code> all; the pattern is a glob.</span></div>
  <div class="kv"><span class="k">Substring</span><span class="v"><code>\${v:offset:length}</code>; a negative offset needs a space: <code>\${v: -4}</code>.</span></div>
  <div class="kv"><span class="k">Locale</span><span class="v">Language settings (<code>LANG</code>, <code>LC_ALL</code>) that decide whether bash counts characters or bytes.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>:-</code> <code>:=</code> <code>:?</code> <code>:+</code> treat empty like unset; without the colon only unset counts.</li>
<li><code>\${VAR:?message}</code> at the top of a script turns a mysterious later failure into an immediate, named one.</li>
<li><code>#</code>/<code>##</code> trim from the left, <code>%</code>/<code>%%</code> from the right; patterns are globs, never regexes.</li>
<li><code>/</code> replaces the first match, <code>//</code> all; in bash 5.2 an unquoted <code>&amp;</code> in the replacement means the matched text.</li>
<li><code>\${#v}</code> and slicing count characters only in a UTF-8 locale; <code>\${s: -4}</code> needs its space.</li>
<li>Replacing <code>basename</code>/<code>sed</code> in loops is ~200× faster, but <code>^^</code>, <code>@Q</code> and negative indexes do not exist in the Mac's bash 3.2.</li>
</ul>
<a class="link-card" href="https://www.gnu.org/software/bash/manual/html_node/Shell-Parameter-Expansion.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Bash Manual — Shell Parameter Expansion</span><span class="lc-sub">Every form in one place, including the ones this lesson skipped (<code>@Q</code>, <code>@U</code>, transformations). Worth one careful read.</span></span>
</a>
<a class="link-card" href="https://mywiki.wooledge.org/BashGuide/Parameters#Parameter_Expansion" target="_blank" rel="noopener">
  <span class="lc-ico">🔧</span>
  <span class="lc-body"><span class="lc-title">BashGuide — Parameter Expansion</span><span class="lc-sub">The same operators explained with intent rather than syntax, plus which ones are POSIX and which are bash-only.</span></span>
</a>
<a class="link-card" href="https://wiki.bash-hackers.org/syntax/pe" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">Bash Hackers — Parameter Expansion reference</span><span class="lc-sub">A compact table you can scan in seconds when you remember there is an operator for this but not which one.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: strings without sed</span><span class="lc-sub">Graded tasks: extract extensions, strip prefixes, build a slug, and validate required environment variables using <code>:?</code>.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> forgetting that these are <strong>globs, not regexes</strong>. <code>\${file%%[0-9]*}</code> works because bracket ranges are glob syntax, but <code>\${file%%\\d*}</code> silently does nothing — <code>\\d</code> is not a glob, so nothing matches, so the value comes back unchanged with no error. The same applies to <code>+</code>, <code>|</code> and <code>()</code>. When a parameter expansion "does not work", check whether you have written a regex by reflex; if you genuinely need one, that is <code>sed</code> or <code>[[ =~ ]]</code>.</div>
<p class="note-ct"><strong>Learn these four first and you have most of the value:</strong> <code>\${var:-default}</code> for fallbacks, <code>\${var:?msg}</code> for required config, <code>\${path##*/}</code> for a basename, and <code>\${file%.*}</code> for stripping an extension. They cover the overwhelming majority of real uses, and each one removes a process launch from your loops.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.3</span>
<h2>Khai triển tham số</h2>
<p class="lead">Bash cắt lát, xén, thay thế và đặt giá trị mặc định cho một chuỗi hoàn toàn bên trong <code>\${…}</code>, không cần chương trình ngoài và không cần shell con. Cú pháp thì đặc và lần đầu nhìn giống nhiễu — nhưng chỉ có sáu dạng, chúng ghép nối được với nhau, và mỗi dạng thay được một lời gọi <code>sed</code> hay <code>basename</code> vốn tốn cả một lần khởi chạy tiến trình.</p>

<h3>Giá trị mặc định, và cái biết kêu to</h3>
${slide('lx-06', 14, 'Bốn toán tử mặc định: chưa đặt khác rỗng')}
<pre><code class="language-bash">name=""
unset colour

echo "\${name:-anonymous}"     <span class="tok-comment"># dùng mặc định nếu chưa đặt HOẶC rỗng</span>
echo "\${name-anonymous}"      <span class="tok-comment"># chỉ dùng mặc định nếu CHƯA ĐẶT (rỗng thì vẫn dùng giá trị rỗng)</span>
echo "\${colour:-blue}"
echo "\${colour}"              <span class="tok-comment"># vẫn chưa đặt — :- KHÔNG gán</span>

: "\${colour:=green}"          <span class="tok-comment"># := GÁN luôn giá trị mặc định như một tác dụng phụ</span>
echo "\${colour}"

echo "\${name:+prefix-}"       <span class="tok-comment"># :+ ngược lại — chỉ dùng khi ĐÃ ĐẶT</span></code></pre>
<div class="out">anonymous

blue

green
</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>\${var:-x}</code></span><span class="v">Dùng <code>x</code> nếu <code>var</code> chưa đặt hoặc rỗng. Không đổi <code>var</code>.</span></div>
  <div class="kv"><span class="k"><code>\${var:=x}</code></span><span class="v">Y hệt, nhưng còn <strong>GÁN</strong> <code>x</code> vào <code>var</code>. Lệnh <code>:</code> đứng trước là một lệnh rỗng, để bạn dùng nó như một câu lệnh.</span></div>
  <div class="kv"><span class="k"><code>\${var:?msg}</code></span><span class="v"><strong>DỪNG với một lỗi</strong> nếu chưa đặt hoặc rỗng. Dòng kiểm tính hợp lệ tốt nhất bạn viết được.</span></div>
  <div class="kv"><span class="k"><code>\${var:+x}</code></span><span class="v">Chỉ dùng <code>x</code> nếu <code>var</code> ĐÃ được đặt. Tiện cho những cờ có điều kiện.</span></div>
</div>
<pre><code><span class="tok-comment"># Cấu hình bắt buộc — hỏng ngay lập tức và nói rõ thiếu cái gì</span>
: "\${DATABASE_URL:?DATABASE_URL là bắt buộc}"
: "\${DEPLOY_ENV:?hãy đặt DEPLOY_ENV là staging hoặc production}"</code></pre>
<div class="out">./deploy.sh: line 4: DATABASE_URL: DATABASE_URL là bắt buộc</div>
<div class="callout ok"><code>\${VAR:?thông điệp}</code> là cấu trúc có giá trị trên mỗi ký tự cao nhất của chương này. Hai dòng ở đầu một script deploy biến chuyện "ứng dụng lên rồi ba phút sau chết một cách bí ẩn với chuỗi kết nối rỗng" thành "nó từ chối khởi động và nói cho bạn biết thiếu biến nào". Script thoát khác 0, nên CI cũng bắt được.</div>
<pre><code class="language-bash"><span class="tok-comment"># Cờ có điều kiện, không cần if</span>
verbose=1
rsync \${verbose:+--verbose} -a src/ dst/

<span class="tok-comment"># Cấu hình với một chuỗi phương án lùi</span>
port="\${PORT:-\${DEFAULT_PORT:-3000}}"</code></pre>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Mặc định</span><span class="lz-lnote"><code>:-</code> phương án lùi · <code>:=</code> lùi rồi gán luôn · <code>:?</code> dừng kèm thông điệp · <code>:+</code> chỉ dùng khi đã đặt</span></div>
  <div class="lz-layer"><span class="lz-lname">Xén</span><span class="lz-lnote"><code>#</code> từ bên trái · <code>%</code> từ bên phải · nhân đôi (<code>##</code>, <code>%%</code>) nghĩa là khớp dài nhất</span></div>
  <div class="lz-layer"><span class="lz-lname">Thay thế</span><span class="lz-lnote"><code>/cũ/mới</code> lần đầu · <code>//cũ/mới</code> tất cả · <code>/#</code> neo vào đầu · <code>/%</code> neo vào cuối</span></div>
  <div class="lz-layer"><span class="lz-lname">Cắt lát</span><span class="lz-lnote"><code>\${#var}</code> độ dài · <code>\${var:vị_trí:độ_dài}</code> chuỗi con · <code>\${var: -n}</code> n ký tự cuối (để ý dấu cách)</span></div>
  <div class="lz-layer"><span class="lz-lname">Hoa thường</span><span class="lz-lnote"><code>^^</code> hoa · <code>,,</code> thường · <code>^</code> viết hoa chữ cái đầu</span></div>
  <div class="lz-layer"><span class="lz-lname">Gián tiếp</span><span class="lz-lnote"><code>\${!name}</code> đọc theo tên biến · <code>\${!tiền_tố@}</code> liệt kê các tên khớp</span></div>
</div>
<h3>Xén: # từ bên trái, % từ bên phải</h3>
${slide('lx-06', 15, '# xén từ trái, % xén từ phải')}
<p>Hai toán tử gỡ bỏ một mẫu khớp ở một đầu. Cách nhớ nằm trên bàn phím: <code>#</code> nằm bên trái <code>%</code> trong bố cục Mỹ, và nó xén từ bên trái.</p>
<pre><code class="language-bash">path="/srv/app/config/db.yml"

echo "\${path##*/}"       <span class="tok-comment"># khớp DÀI NHẤT từ TRÁI  → basename</span>
echo "\${path%/*}"        <span class="tok-comment"># khớp NGẮN NHẤT từ PHẢI → dirname</span>
echo "\${path#*/}"        <span class="tok-comment"># ngắn nhất từ trái</span>
echo "\${path%%/*}"       <span class="tok-comment"># dài nhất từ phải</span></code></pre>
<div class="out">db.yml
/srv/app/config
srv/app/config/db.yml
</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>\${var#mẫu}</code></span><span class="v">Gỡ chỗ khớp <strong>NGẮN NHẤT</strong> của <code>mẫu</code> ở đầu chuỗi.</span></div>
  <div class="kv"><span class="k"><code>\${var##mẫu}</code></span><span class="v">Gỡ chỗ khớp <strong>DÀI NHẤT</strong> ở đầu chuỗi. Nhân đôi ký hiệu nghĩa là tham lam.</span></div>
  <div class="kv"><span class="k"><code>\${var%mẫu}</code></span><span class="v">Gỡ chỗ khớp ngắn nhất ở <strong>CUỐI</strong> chuỗi.</span></div>
  <div class="kv"><span class="k"><code>\${var%%mẫu}</code></span><span class="v">Gỡ chỗ khớp dài nhất ở cuối chuỗi.</span></div>
</div>
<pre><code class="language-bash">file="archive.tar.gz"
echo "\${file%.*}"         <span class="tok-comment"># bỏ MỘT đuôi        → archive.tar</span>
echo "\${file%%.*}"        <span class="tok-comment"># bỏ MỌI đuôi        → archive</span>
echo "\${file##*.}"        <span class="tok-comment"># chỉ lấy phần đuôi  → gz</span>

url="https://cuongthai.com/api/v1/posts"
echo "\${url#*://}"        <span class="tok-comment"># bỏ phần giao thức</span>
echo "\${url##*/}"         <span class="tok-comment"># đoạn cuối của đường dẫn</span>

branch="refs/heads/feature/login"
echo "\${branch#refs/heads/}"   <span class="tok-comment"># feature/login</span></code></pre>
<div class="out">archive.tar
archive
gz
cuongthai.com/api/v1/posts
posts
feature/login</div>
<div class="callout">Các mẫu ở đây là <strong>GLOB, không phải regex</strong> (Bài 2.2): <code>*</code>, <code>?</code> và <code>[…]</code> chạy; <code>+</code>, <code>|</code> và <code>\\d</code> thì không. Đó là lý do <code>\${path##*/}</code> nghĩa là "gỡ mọi thứ cho tới và bao gồm dấu gạch chéo cuối cùng" — dấu <code>*</code> tham lam ăn được nhiều nhất có thể mà vẫn còn chừa lại một dấu <code>/</code> để khớp.</div>

<h3>Thay thế</h3>
${slide('lx-06', 16, '/ và //, và dấu &amp; của bash 5.2')}
<pre><code class="language-bash">s="hello world world"

echo "\${s/world/there}"      <span class="tok-comment"># lần khớp ĐẦU TIÊN</span>
echo "\${s//world/there}"     <span class="tok-comment"># MỌI lần khớp (gạch chéo nhân đôi)</span>
echo "\${s//o/}"              <span class="tok-comment"># xoá: phần thay thế để rỗng</span>
echo "\${s/#hello/HI}"        <span class="tok-comment"># /# neo vào ĐẦU chuỗi</span>
echo "\${s/%world/WORLD}"     <span class="tok-comment"># /% neo vào CUỐI chuỗi</span></code></pre>
<div class="out">hello there world
hello there there
hell wrld wrld
HI world world
hello world WORLD</div>
<pre><code class="language-bash"><span class="tok-comment"># Thực tế: chuẩn hoá tên nhánh thành một tag docker</span>
branch="feature/user-login"
tag="\${branch//\\//-}"        <span class="tok-comment"># gạch chéo → gạch ngang (dấu / được thoát)</span>
echo "myapp:\${tag}"</code></pre>
<div class="out">myapp:feature-user-login</div>

<h3>Độ dài, cắt lát, và hoa thường</h3>
${slide('lx-06', 17, 'Độ dài, cắt lát, hoa thường')}
<pre><code class="language-bash">s="deployment"
echo "\${#s}"              <span class="tok-comment"># độ dài: 10</span>
echo "\${s:0:6}"           <span class="tok-comment"># từ vị trí 0, lấy 6 ký tự</span>
echo "\${s:6}"             <span class="tok-comment"># từ vị trí 6 tới hết</span>
echo "\${s: -4}"           <span class="tok-comment"># 4 ký tự CUỐI — để ý dấu cách trước -4</span>

echo "\${s^^}"             <span class="tok-comment"># CHỮ HOA (bash 4 trở lên)</span>
echo "\${s,,}"             <span class="tok-comment"># chữ thường</span>
echo "\${s^}"              <span class="tok-comment"># chỉ viết hoa ký tự ĐẦU TIÊN của chuỗi</span></code></pre>
<div class="out">10
deploy
ment
ment
DEPLOYMENT
deployment
Deployment</div>
<div class="callout warn">Dấu cách trong <code>\${s: -4}</code> là BẮT BUỘC. Thiếu nó, <code>\${s:-4}</code> chính là toán tử <em>GIÁ TRỊ MẶC ĐỊNH</em> ở đầu bài này và nghĩa là "dùng 4 nếu <code>s</code> rỗng" — một kết quả hoàn toàn khác mà lại không báo lỗi. Hai cú pháp, cách nhau một ký tự, và chỉ một dấu cách phân biệt chúng.</div>

<h3>Thay thế các lệnh bên ngoài</h3>
${slide('lx-06', 18, 'Không fork thì nhanh gấp ~200 lần; bash 3.2 của Mac')}
<pre><code class="language-bash">path="/srv/app/config/db.yml"

<span class="tok-comment"># Mỗi dòng dưới đây khởi chạy một tiến trình — chừng 1-3 mili giây và một lần fork</span>
basename "\$path"          <span class="tok-comment">→ db.yml</span>
dirname "\$path"           <span class="tok-comment">→ /srv/app/config</span>
echo "\$path" | sed 's|.*/||'

<span class="tok-comment"># Mỗi dòng dưới đây là bash thuần — không tiến trình, không shell con</span>
echo "\${path##*/}"
echo "\${path%/*}"</code></pre>
<div class="out">$ time for i in {1..10000}; do basename "\$path" &gt;/dev/null; done
real  0m11.204s
$ time for i in {1..10000}; do echo "\${path##*/}" &gt;/dev/null; done
real  0m0.089s</div>
<p>Đo thật: nhanh hơn 126 lần qua mười nghìn vòng lặp. Với một lệnh chạy một lần thì khác biệt là vô hình; trong một vòng lặp qua vài nghìn file thì nó là khác biệt giữa một script mất mười một giây và một script cho cảm giác tức thì. Thói quen này đáng xây vì một khi đã thuộc cú pháp thì nó chẳng tốn gì.</p>
<div class="callout ok">Có một điểm cần lưu ý: <code>\${path##*/}</code> và <code>basename</code> bất đồng ở các ca biên. Với <code>/srv/app/</code> có dấu gạch chéo cuối, <code>basename</code> cho <code>app</code>, còn <code>\${path##*/}</code> cho chuỗi rỗng. Nếu bạn đang xử lý những đường dẫn không phải do mình dựng nên, cách xử lý ca biên của <code>basename</code> có thể đáng để tốn một lần fork.</div>

<h3>Gián tiếp và liệt kê</h3>
<pre><code class="language-bash">DB_HOST=localhost
DB_PORT=5432
DB_NAME=app

<span class="tok-comment"># Mọi tên biến bắt đầu bằng DB_</span>
echo "\${!DB_@}"

<span class="tok-comment"># Đọc một biến mà TÊN của nó nằm trong một biến khác</span>
key="DB_HOST"
echo "\${!key}"</code></pre>
<div class="out">DB_HOST DB_NAME DB_PORT
localhost</div>
<pre><code class="language-bash"><span class="tok-comment"># Một bộ kiểm cấu hình dựng từ hai thứ trên ghép lại</span>
for var in "\${!DB_@}"; do
  : "\${!var:?\$var đang rỗng}"
done
echo "cấu hình cơ sở dữ liệu OK"</code></pre>
<div class="out">cấu hình cơ sở dữ liệu OK</div>

<h3>Một ví dụ làm trọn vẹn</h3>
<pre><code>#!/usr/bin/env bash
<span class="tok-comment"># Đổi tên mọi file .jpeg thành .jpg, thêm tiền tố ngày — không dùng công cụ ngoài</span>
for f in *.jpeg; do
  [[ -e "\$f" ]] || continue          <span class="tok-comment"># chốt chặn cho nullglob (Bài 2.2)</span>
  base="\${f##*/}"                    <span class="tok-comment"># bỏ phần thư mục nếu có</span>
  stem="\${base%.jpeg}"               <span class="tok-comment"># bỏ phần đuôi</span>
  clean="\${stem// /_}"               <span class="tok-comment"># dấu cách → gạch dưới</span>
  mv -n -- "\$f" "\$(date +%Y%m%d)_\${clean,,}.jpg"
done</code></pre>
<div class="out">$ ls
20260822_beach_sunset.jpg  20260822_family_photo.jpg</div>
<p>Bốn phép khai triển, một lệnh <code>mv</code>, không <code>basename</code>, không <code>sed</code>, không shell con nào ngoài đúng một lệnh <code>date</code>. Đó là hình dạng mà phần lớn vòng lặp xử lý file nên có.</p>

<h3>Bảng đầy đủ: chưa đặt, rỗng và có giá trị là BA trạng thái khác nhau</h3>
<p>Dấu hai chấm trong <code>:-</code>, <code>:=</code>, <code>:?</code>, <code>:+</code> nghĩa là "coi <em>RỖNG</em> như <em>CHƯA ĐẶT</em>". Bỏ dấu hai chấm thì chỉ biến thật sự chưa đặt mới kích hoạt toán tử. Output thật, mỗi trạng thái một dòng:</p>
<pre><code>for st in unset empty set; do
  unset v; case $st in empty) v=;; set) v=val;; esac
  printf '%-6s :-[%s] -[%s] :+[%s] +[%s]\\n' "$st" "\${v:-D}" "\${v-D}" "\${v:+A}" "\${v+A}"
done</code></pre>
<div class="out">unset  :-[D] -[D] :+[] +[]
empty  :-[D] -[] :+[] +[A]
set    :-[val] -[val] :+[A] +[A]</div>
<p>Với cấu hình thì gần như lúc nào bạn cũng muốn dạng CÓ dấu hai chấm: một biến môi trường bằng chuỗi rỗng (<code>DATABASE_URL=</code> bị để trống trong file <code>.env</code>) cũng hỏng y như một biến bị thiếu. Dạng không có dấu hai chấm dành cho ca hiếm khi "rỗng" là một giá trị có nghĩa mà bạn không được ghi đè. Liên quan: <code>set -u</code> (Chương 7) biến mọi lần dùng biến chưa đặt thành lỗi — và <code>\${X:-}</code> là cách nói "chưa đặt cũng được" khi bật nó.</p>

<h3>Các phép biến đổi, và hai cái bẫy: dấu <code>&amp;</code> của bash 5.2, và chữ tiếng Việt</h3>
<table>
<tr><th>Dạng</th><th>Làm gì</th><th>Đã thử (bash 5.2)</th></tr>
<tr><td><code>\${v@Q}</code></td><td>Đặt nháy cho giá trị để dán lại vào shell một cách an toàn</td><td><code>it's "x" $y</code> → <code>'it'\\''s "x" $y'</code></td></tr>
<tr><td><code>\${v@U}</code> · <code>\${v@u}</code> · <code>\${v@L}</code></td><td>HOA · hoa chữ đầu · thường (bash 5.1+)</td><td><code>hello</code> → <code>HELLO Hello hello</code></td></tr>
<tr><td><code>\${v@A}</code></td><td>Lệnh <code>declare</code> dựng lại được biến đó</td><td><code>declare -i num='5'</code></td></tr>
<tr><td><code>\${t^^[aeiou]}</code></td><td>Chỉ viết hoa những ký tự khớp mẫu</td><td><code>xin chao ban</code> → <code>xIn chAO bAn</code></td></tr>
<tr><td><code>\${#u}</code></td><td>Độ dài tính bằng <strong>ký tự của locale hiện tại</strong></td><td><code>u="đường"</code>: <code>5</code> với C.UTF-8, <code>9</code> với <code>LC_ALL=C</code> (byte)</td></tr>
</table>
<p><strong>Bẫy 1 — dấu <code>&amp;</code> trong phần thay thế.</strong> Từ bash 5.2, tuỳ chọn <code>patsub_replacement</code> bật sẵn (bash(1): "This option is enabled by default"), và một dấu <code>&amp;</code> không nháy trong phần thay của <code>\${v/mẫu/thay}</code> nghĩa là "đoạn vừa khớp". Nó cắn đúng lúc bạn chèn một chuỗi truy vấn URL:</p>
<pre><code class="language-bash">q="a=1&amp;b=2"; u="x?QUERY"
echo "\${u/QUERY/$q}"
echo "\${u/QUERY/"$q"}"</code></pre>
<div class="out">x?a=1QUERYb=2
x?a=1&amp;b=2</div>
<p>Hãy đặt nháy cho phần thay (hoặc viết <code>\\&amp;</code>) mỗi khi nó đến từ một biến. Cùng dòng đó chạy bằng bash 3.2 của Mac lại in nguyên chữ <code>&amp;</code> — thêm một lý do để cùng một script cư xử khác nhau trên hai máy.</p>
<p><strong>Bẫy 2 — độ dài và cắt lát phụ thuộc locale (thiết lập ngôn ngữ).</strong> Trong locale UTF-8, <code>\${#u}</code> đếm KÝ TỰ và <code>\${u:0:2}</code> lấy hai chữ; trong một container hay một job cron không đặt locale (<code>LC_ALL=C</code>/<code>POSIX</code>) cùng đoạn mã đó đếm BYTE, và cắt lát có thể xẻ đôi một chữ tiếng Việt. Script nào cắt ngắn tên người thì đặt <code>LC_ALL=C.UTF-8</code> ở đầu.</p>

<h3>Chạy thử từng bước</h3>
<pre><code>p=/srv/app/config/db.yml; f=archive.tar.gz
printf '[%s]\\n' "\${p##*/}" "\${p%/*}" "\${p%%/*}" "\${f%.*}" "\${f#*.}"
x=/srv/app/; echo "[\${x##*/}] [$(basename "$x")]"
s="hello world world"; echo "\${s//[ol]/_}"
unset c; echo "[\${c:=green}] c=[$c]"
: "\${NOPE:?not set}"; echo "không tới được đây"</code></pre>
<div class="out">[db.yml]
[/srv/app/config]
[]
[archive.tar]
[tar.gz]
[] [app]
he___ w_r_d w_r_d
[green] c=[green]
bash: NOPE: not set</div>
<p>Để ý dòng thứ ba và thứ sáu: <code>\${p%%/*}</code> gỡ sạch vì đường dẫn bắt đầu bằng <code>/</code>, và với đường dẫn kết thúc bằng <code>/</code> thì basename bằng bash thuần ra rỗng trong khi <code>basename</code> nói <code>app</code>. Dòng cuối không bao giờ được in: trong một script, <code>:?</code> thoát CẢ script với mã 1.</p>

<h3>Trên macOS và WSL khác gì</h3>
<p>Mọi thứ trong bài này, trừ <code>#</code>, <code>%</code>, <code>/</code> và bốn toán tử mặc định, đều mới hơn <code>/bin/bash</code> 3.2 (2007) của Mac. Chạy trên Mac M1:</p>
<pre><code>/bin/bash -c 's=deploy; echo "\${s^^}"'
/bin/bash -c 'v="it s"; echo "\${v@Q}"'
/bin/bash -c 'a=(x y z); echo "\${a[-1]}"'
zsh -f -c 's=deploy; echo \${s:u} \${(U)s}'</code></pre>
<div class="out">/bin/bash: \${s^^}: bad substitution
/bin/bash: \${v@Q}: bad substitution
/bin/bash: a: bad array subscript
DEPLOY DEPLOY</div>
<p>zsh có cách viết riêng (<code>\${s:u}</code>, <code>\${(U)s}</code>) và từ chối <code>\${s^^}</code> với <code>bad substitution</code>. Việc fork trên macOS cũng đắt hơn nhiều: 2.000 lần gọi <code>basename</code> mất 15,7 giây trên Mac M1, so với 6,06 giây cho 10.000 lần trong container Ubuntu — nên thay lệnh ngoài trong vòng lặp còn đáng hơn nữa trên Mac. <strong>WSL</strong> cư xử như Ubuntu.</p>
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> pipeline CI đưa cho script deploy một tên nhánh kiểu <code>refs/heads/feature/Dang-Nhap</code> và một đường dẫn file ảnh; script phải dựng ra tag Docker và từ chối chạy nếu thiếu địa chỉ registry — KHÔNG dùng <code>sed</code>, <code>basename</code> hay <code>tr</code>.</p><ol>
<li>Trong <code>~/thu-linux/ch6</code> viết <code>tag.sh</code> với <code>ref=\${1:?usage: tag.sh REF FILE}</code> và <code>file=\${2:?usage: tag.sh REF FILE}</code>.</li>
<li>Gỡ <code>refs/heads/</code> bằng <code>#</code>, thay mọi <code>/</code> bằng <code>-</code>, rồi chuyển kết quả sang chữ thường bằng <code>,,</code>.</li>
<li>Từ <code>file</code>, in tên không kèm thư mục và phần đuôi, dùng <code>##*/</code> và <code>##*.</code>.</li>
<li>Thêm <code>: "\${REGISTRY:?set REGISTRY}"</code> và in <code>$REGISTRY/app:$tag</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>REGISTRY=ghcr.io/nhom bash tag.sh refs/heads/feature/Dang-Nhap /srv/up/anh.bia.png</code> in <code>ghcr.io/nhom/app:feature-dang-nhap</code>, <code>anh.bia.png</code> và <code>png</code>; cùng lệnh đó mà thiếu <code>REGISTRY</code> thì thoát mã 1 kèm thông điệp <code>set REGISTRY</code>; không có tham số nào thì in dòng usage.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Parameter expansion (khai triển tham số)</span><span class="v">Mọi dạng <code>\${…}</code> đọc rồi biến đổi một biến ngay trong bash.</span></div>
  <div class="kv"><span class="k">Unset / empty (chưa đặt / rỗng)</span><span class="v">Chưa từng gán (hoặc đã <code>unset</code>) so với đã gán chuỗi rỗng; dấu <code>:</code> coi hai thứ như nhau.</span></div>
  <div class="kv"><span class="k">Default value (giá trị mặc định)</span><span class="v"><code>\${v:-x}</code> dùng x; <code>\${v:=x}</code> còn gán luôn x.</span></div>
  <div class="kv"><span class="k">Prefix / suffix removal (xén đầu / đuôi)</span><span class="v"><code>#</code>/<code>##</code> từ đầu, <code>%</code>/<code>%%</code> từ cuối; nhân đôi = khớp dài nhất.</span></div>
  <div class="kv"><span class="k">Pattern substitution (thay theo mẫu)</span><span class="v"><code>\${v/a/b}</code> lần đầu, <code>\${v//a/b}</code> tất cả; mẫu là glob.</span></div>
  <div class="kv"><span class="k">Substring (chuỗi con)</span><span class="v"><code>\${v:vị_trí:độ_dài}</code>; vị trí âm cần dấu cách: <code>\${v: -4}</code>.</span></div>
  <div class="kv"><span class="k">Locale (thiết lập ngôn ngữ)</span><span class="v"><code>LANG</code>, <code>LC_ALL</code> — quyết định bash đếm ký tự hay đếm byte.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>:-</code> <code>:=</code> <code>:?</code> <code>:+</code> coi rỗng như chưa đặt; bỏ dấu hai chấm thì chỉ "chưa đặt" mới tính.</li>
<li><code>\${VAR:?thông điệp}</code> ở đầu script biến một lỗi bí ẩn về sau thành một lỗi tức thì, có tên.</li>
<li><code>#</code>/<code>##</code> xén từ trái, <code>%</code>/<code>%%</code> xén từ phải; mẫu là glob, không bao giờ là regex.</li>
<li><code>/</code> thay chỗ khớp đầu, <code>//</code> thay tất cả; ở bash 5.2 dấu <code>&amp;</code> không nháy trong phần thay là đoạn vừa khớp.</li>
<li><code>\${#v}</code> và cắt lát chỉ đếm ký tự khi locale là UTF-8; <code>\${s: -4}</code> cần dấu cách của nó.</li>
<li>Thay <code>basename</code>/<code>sed</code> trong vòng lặp nhanh ~200 lần, nhưng <code>^^</code>, <code>@Q</code> và chỉ số âm không có trong bash 3.2 của Mac.</li>
</ul>
<a class="link-card" href="https://www.gnu.org/software/bash/manual/html_node/Shell-Parameter-Expansion.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Bash Manual — Shell Parameter Expansion</span><span class="lc-sub">Mọi dạng gói trong một chỗ, gồm cả những cái bài này bỏ qua (<code>@Q</code>, <code>@U</code>, các phép biến đổi). Đáng đọc kỹ một lần.</span></span>
</a>
<a class="link-card" href="https://mywiki.wooledge.org/BashGuide/Parameters#Parameter_Expansion" target="_blank" rel="noopener">
  <span class="lc-ico">🔧</span>
  <span class="lc-body"><span class="lc-title">BashGuide — Parameter Expansion</span><span class="lc-sub">Cùng các toán tử đó nhưng giải thích theo Ý ĐỊNH chứ không theo cú pháp, kèm việc cái nào là POSIX và cái nào chỉ có ở bash.</span></span>
</a>
<a class="link-card" href="https://wiki.bash-hackers.org/syntax/pe" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">Bash Hackers — bảng tra Parameter Expansion</span><span class="lc-sub">Một bảng gọn mà bạn lướt mắt vài giây là ra, dành cho lúc nhớ rằng có một toán tử làm việc này nhưng không nhớ là cái nào.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: xử lý chuỗi mà không cần sed</span><span class="lc-sub">Bài chấm điểm: rút phần đuôi file, cắt tiền tố, dựng một slug, và kiểm các biến môi trường bắt buộc bằng <code>:?</code>.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> quên rằng đây là <strong>GLOB, không phải regex</strong>. <code>\${file%%[0-9]*}</code> chạy được vì khoảng trong ngoặc vuông là cú pháp glob, nhưng <code>\${file%%\\d*}</code> thì âm thầm chẳng làm gì — <code>\\d</code> không phải glob, nên không khớp gì cả, nên giá trị trả về nguyên xi mà không có lỗi nào. Điều tương tự đúng với <code>+</code>, <code>|</code> và <code>()</code>. Khi một phép khai triển tham số "không chạy", hãy kiểm xem có phải bạn vừa viết một regex theo phản xạ không; nếu bạn thật sự cần regex thì đó là việc của <code>sed</code> hoặc <code>[[ =~ ]]</code>.</div>
<p class="note-ct"><strong>Học bốn cái này trước là bạn đã có phần lớn giá trị:</strong> <code>\${var:-mặc định}</code> cho phương án lùi, <code>\${var:?msg}</code> cho cấu hình bắt buộc, <code>\${path##*/}</code> cho basename, và <code>\${file%.*}</code> để bỏ phần đuôi. Chúng bao phủ đại đa số các nhu cầu thực tế, và mỗi cái gỡ đi một lần khởi chạy tiến trình khỏi vòng lặp của bạn.</p>
</div>
`,
    },
    /* ─────────────────────────── 6.4 ─────────────────────────── */
    {
      title: '6.4 — Exit codes, conditions and case|||6.4 — Mã thoát, điều kiện và case',
      slug: 'lnx-6-4-ma-thoat-dieu-kien',
      type: 'LESSON',
      description: '$? và vì sao 0 là đúng, && và || như những toán tử điều kiện, [ ] so với [[ ]] và khi nào dùng cái nào, so sánh chuỗi với so sánh số, các phép thử file, và case.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.4</span>
<h2>Exit codes and conditions</h2>
<p class="lead">Every command returns a number when it finishes. The shell's entire notion of "did that work" is built on it, and so are <code>&amp;&amp;</code>, <code>||</code>, <code>if</code> and <code>while</code>. Once you see that <code>if</code> does not test a boolean but simply runs a command and looks at its exit code, the syntax stops being arbitrary.</p>

<h3>Zero is success</h3>
${slide('lx-06', 19, 'Mã thoát: 0 là thành công, số khác là kiểu hỏng')}
<pre><code class="language-bash">ls /etc &gt;/dev/null; echo \$?
ls /nonexistent 2&gt;/dev/null; echo \$?
grep -q root /etc/passwd; echo \$?
grep -q nosuchuser /etc/passwd; echo \$?</code></pre>
<div class="out">0
2
0
1</div>
<p>Zero means success, and every nonzero value means a different kind of failure. This is backwards from most programming languages, where 0 is falsy — and it is the right way round for a shell, because there is exactly one way to succeed and many distinct ways to fail, so the failures need the number space.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">0</span><span class="v">Success.</span></div>
  <div class="kv"><span class="k">1</span><span class="v">General failure. <code>grep</code> uses it for "no match found", which is a result rather than an error.</span></div>
  <div class="kv"><span class="k">2</span><span class="v">Misuse — bad arguments, missing file. Most GNU tools follow this.</span></div>
  <div class="kv"><span class="k">126 · 127</span><span class="v">Found but not executable · <strong>command not found</strong>. 127 is the one you will see most.</span></div>
  <div class="kv"><span class="k">128+N</span><span class="v">Killed by signal N (Lesson 5.3). 130 Ctrl-C, 137 SIGKILL, 143 SIGTERM.</span></div>
</div>
<pre><code><span class="tok-comment"># Set your own, in a script</span>
exit 0        <span class="tok-comment"># success</span>
exit 1        <span class="tok-comment"># generic failure</span>
exit 2        <span class="tok-comment"># bad usage — conventional for "you called me wrong"</span></code></pre>
<div class="callout warn"><code>\$?</code> holds the exit code of the <strong>immediately preceding</strong> command, and it is overwritten by everything — including <code>echo</code>. <code>cmd; echo "done"; if [ \$? -ne 0 ]</code> tests the exit code of <code>echo</code>, which always succeeds. Capture it at once (<code>rc=\$?</code>) or, better, test the command directly with <code>if</code>.</div>

<h3>&amp;&amp; and ||: conditionals without if</h3>
${slide('lx-06', 20, 'a &amp;&amp; b || c không phải if/else')}
<pre><code class="language-bash">mkdir -p build &amp;&amp; cd build           <span class="tok-comment"># cd only if mkdir succeeded</span>
grep -q ERROR log || echo "clean"    <span class="tok-comment"># echo only if grep FAILED</span>
command -v jq &gt;/dev/null || { echo "jq required" &gt;&amp;2; exit 1; }

<span class="tok-comment"># Chained — reads like a sentence</span>
npm test &amp;&amp; npm run build &amp;&amp; ./deploy.sh</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>a &amp;&amp; b</code></span><span class="v">Run <code>b</code> only if <code>a</code> succeeded (exit 0). Short-circuits.</span></div>
  <div class="kv"><span class="k"><code>a || b</code></span><span class="v">Run <code>b</code> only if <code>a</code> failed. The "or else" of shell.</span></div>
  <div class="kv"><span class="k"><code>a ; b</code></span><span class="v">Run both regardless. A semicolon is just a line break.</span></div>
</div>
<div class="callout warn"><strong><code>a &amp;&amp; b || c</code> is not if-then-else</strong>, and the difference bites. If <code>a</code> succeeds but <code>b</code> fails, <code>c</code> runs too — so <code>[[ -f f ]] &amp;&amp; process f || echo "no file"</code> prints "no file" when the file exists and processing failed. Use a real <code>if</code> whenever the middle command can fail.</div>

<h3>if, and what it actually tests</h3>
<pre><code class="language-bash">if grep -q ERROR app.log; then
  echo "errors found"
elif grep -q WARN app.log; then
  echo "warnings only"
else
  echo "clean"
fi</code></pre>
<p>Note there are no brackets. <code>if</code> takes a <em>command</em> and branches on its exit code — <code>grep -q</code> is the condition. The familiar <code>if [ … ]</code> is the same thing: <code>[</code> is a command (there is a real <code>/usr/bin/[</code> on your system), and it exits 0 or 1. That is why <code>[ \$a = \$b ]</code> needs spaces around every token — they are arguments to a program.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · if takes a COMMAND</span><span class="lz-t">if grep -q ERROR log; then</span><span class="lz-d">Not a boolean expression. The command runs, for real, with all its side effects.</span></div>
  <div class="lz-step"><span class="lz-k">2 · The command exits</span><span class="lz-t">exit code 0, or nonzero</span><span class="lz-d">grep -q exits 0 when it matched, 1 when it did not, 2 on an actual error.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Zero → then branch</span><span class="lz-t">any nonzero → else branch</span><span class="lz-d">That is the whole rule. There is no truthiness and no type conversion.</span></div>
  <div class="lz-step"><span class="lz-k">4 · [ and [[ are just commands</span><span class="lz-t">[ "\$a" = "\$b" ] exits 0 or 1</span><span class="lz-d">/usr/bin/[ is a real file. That is why every token needs a space around it — they are arguments.</span></div>
</div>
<h3>[ ] versus [[ ]]</h3>
${slide('lx-06', 21, '[ là một lệnh, [[ là cú pháp')}
<pre><code><span class="tok-comment"># [ ] — POSIX, works in sh, is a real command</span>
if [ "\$name" = "Binh" ]; then echo yes; fi

<span class="tok-comment"># [[ ]] — bash builtin, safer and more capable</span>
if [[ \$name == "Binh" ]]; then echo yes; fi
if [[ \$file == *.log ]]; then echo "a log"; fi        <span class="tok-comment"># glob matching</span>
if [[ \$line =~ ^ERROR[0-9]+ ]]; then echo "match"; fi <span class="tok-comment"># regex</span>
if [[ -f \$f &amp;&amp; -r \$f ]]; then echo "readable"; fi    <span class="tok-comment"># &amp;&amp; inside</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>[[ ]]</code> advantages</span><span class="v">No word splitting or globbing inside, so unquoted variables are safe. Supports <code>&amp;&amp;</code>, <code>||</code>, glob matching with <code>==</code>, and regex with <code>=~</code>.</span></div>
  <div class="kv"><span class="k">When to use <code>[ ]</code></span><span class="v">Only when the script must run under <code>sh</code>/dash — a container without bash, or a POSIX-only environment. Then quote everything rigorously.</span></div>
</div>
<div class="callout ok"><strong>Use <code>[[ ]]</code> in anything with a bash shebang.</strong> Inside it, an empty variable cannot break the syntax — <code>[ \$x = y ]</code> with <code>x</code> empty becomes <code>[ = y ]</code> and errors, while <code>[[ \$x == y ]]</code> is simply false. That one difference removes a classic source of scripts that work in testing and fail on real data.</div>

<h3>String versus numeric comparison</h3>
${slide('lx-06', 22, '&gt; trong [[ ]] so chuỗi, trong [ ] tạo file')}
<pre><code><span class="tok-comment"># Strings</span>
[[ \$a == \$b ]]      [[ \$a != \$b ]]
[[ -z \$a ]]          <span class="tok-comment"># zero length (empty)</span>
[[ -n \$a ]]          <span class="tok-comment"># non-empty</span>
[[ \$a &lt; \$b ]]       <span class="tok-comment"># lexicographic</span>

<span class="tok-comment"># Numbers</span>
[[ \$a -eq \$b ]]     <span class="tok-comment"># equal      · -ne not equal</span>
[[ \$a -lt \$b ]]     <span class="tok-comment"># less than  · -le -gt -ge</span>
(( a &gt; b ))          <span class="tok-comment"># clearer, and allows normal operators</span></code></pre>
<div class="out">$ a=10 b=9
$ [[ \$a &gt; \$b ]] &amp;&amp; echo "10 &gt; 9"      # nothing — string compare!
$ (( a &gt; b )) &amp;&amp; echo "10 &gt; 9"
10 &gt; 9</div>
<div class="callout warn">This is the classic silent bug. With <code>&gt;</code> inside <code>[[ ]]</code> you get a <strong>string</strong> comparison, so <code>"10"</code> sorts before <code>"9"</code> — exactly the <code>sort</code> problem from Lesson 3.4, in a new place. Use <code>-gt</code> or, better, <code>(( ))</code> for anything numeric. And inside <code>[ ]</code>, a bare <code>&gt;</code> is worse still: it is a <em>redirection</em>, so <code>[ \$a &gt; \$b ]</code> silently creates a file named after <code>\$b</code>.</div>

<h3>File tests</h3>
${slide('lx-06', 23, 'Phép thử file và case')}
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-e</code> · <code>-f</code> · <code>-d</code></span><span class="v">Exists (anything) · is a regular file · is a directory.</span></div>
  <div class="kv"><span class="k"><code>-r</code> · <code>-w</code> · <code>-x</code></span><span class="v">Readable · writable · executable <strong>by the current user</strong> — which is exactly the Chapter 4 question, answered correctly.</span></div>
  <div class="kv"><span class="k"><code>-s</code> · <code>-L</code></span><span class="v">Exists and is non-empty · is a symlink.</span></div>
  <div class="kv"><span class="k"><code>-nt</code> · <code>-ot</code></span><span class="v">Newer than · older than, by modification time. The basis of a hand-rolled build check.</span></div>
</div>
<pre><code class="language-bash">if [[ ! -f \$config ]]; then
  echo "config missing: \$config" &gt;&amp;2
  exit 1
fi

[[ -d \$dir ]] || mkdir -p "\$dir"
[[ -s \$log ]] &amp;&amp; echo "log has content"
[[ src/app.ts -nt dist/app.js ]] &amp;&amp; npm run build</code></pre>
<div class="callout ok"><code>-r</code> and <code>-w</code> answer "can <em>I</em> read this", taking into account ownership, groups, every directory on the path, and even read-only mounts — the whole of Lesson 4.5 in one test. Checking <code>[[ -r \$f ]]</code> is far more reliable than inspecting <code>ls -l</code> output and reasoning about it.</div>

<h3>case: cleaner than a chain of elifs</h3>
<pre><code class="language-bash">case "\$1" in
  start)
    echo "starting" ;;
  stop|halt)                         <span class="tok-comment"># several patterns</span>
    echo "stopping" ;;
  restart)
    "\$0" stop &amp;&amp; "\$0" start ;;
  *.log)                             <span class="tok-comment"># glob patterns work</span>
    echo "that is a log file" ;;
  "")
    echo "usage: \$0 {start|stop|restart}" &gt;&amp;2; exit 2 ;;
  *)                                 <span class="tok-comment"># the default branch</span>
    echo "unknown: \$1" &gt;&amp;2; exit 2 ;;
esac</code></pre>
<div class="out">$ ./service.sh
usage: ./service.sh {start|stop|restart}</div>
<p>Patterns are globs (Lesson 2.2), matched in order, first match wins. <code>;;</code> ends a branch; <code>;&amp;</code> falls through to the next one and <code>;;&amp;</code> continues testing — both rarely needed. Every init script and CLI dispatcher you will read is built on this.</p>

<h3>Putting it together</h3>
<pre><code class="language-bash">#!/usr/bin/env bash
<span class="tok-comment"># Deploy guard: refuse to run unless everything is in order</span>

[[ \$# -eq 1 ]] || { echo "usage: \$0 &lt;env&gt;" &gt;&amp;2; exit 2; }

env="\$1"
case "\$env" in
  staging|production) ;;
  *) echo "unknown env: \$env" &gt;&amp;2; exit 2 ;;
esac

command -v docker &gt;/dev/null || { echo "docker not installed" &gt;&amp;2; exit 1; }
[[ -f ".env.\$env" ]] || { echo "missing .env.\$env" &gt;&amp;2; exit 1; }

if [[ -n \$(git status --porcelain) ]]; then
  echo "working tree is dirty — commit first" &gt;&amp;2
  exit 1
fi

echo "deploying to \$env"</code></pre>
<div class="out">$ ./deploy.sh
usage: ./deploy.sh &lt;env&gt;
$ ./deploy.sh prod
unknown env: prod</div>
<p>Every check exits with a distinct message on stderr and a nonzero code, so CI fails loudly and a human reading the output knows exactly which precondition was not met. Chapter 7 turns this into a full script template.</p>

<h3>Exit codes you will actually meet — measured</h3>
<pre><code class="language-bash">ls /khong 2&gt;/dev/null; echo $?
grep -q nobodyxx /etc/passwd; echo $?
khonglenh 2&gt;/dev/null; echo $?
printf 'echo hi\\n' &gt; s.sh; ./s.sh 2&gt;/dev/null; echo $?
bash -c 'kill -TERM $$'; echo $?
bash -c 'exit 300'; echo $?
false | true; echo "$? \${PIPESTATUS[*]}"</code></pre>
<div class="out">2
1
127
126
Terminated
143
44
0 1 0</div>
<p>Each line teaches one rule. <code>127</code> = the name was not found on <code>PATH</code> (Chapter 8); <code>126</code> = found but not executable (no <code>x</code> bit — Chapter 4); <code>143</code> = 128 + 15, killed by SIGTERM (Chapter 5); an exit code is one byte, so <code>exit 300</code> becomes 300 − 256 = 44. And a pipeline returns the code of its <strong>last</strong> command: <code>false | true</code> "succeeds". <code>\${PIPESTATUS[@]}</code> keeps every stage's code, and <code>set -o pipefail</code> (Chapters 3 and 7) makes the pipeline fail if any stage fails.</p>

<h3>The test operators, in one table</h3>
<table>
<tr><th>Operator</th><th>True when</th><th>Note</th></tr>
<tr><td><code>-e</code> · <code>-f</code> · <code>-d</code></td><td>exists · regular file · directory</td><td><code>-f</code> and <code>-e</code> follow symlinks</td></tr>
<tr><td><code>-s</code> · <code>-L</code></td><td>size &gt; 0 · is a symlink</td><td>an empty log is <code>-f</code> but not <code>-s</code></td></tr>
<tr><td><code>-r</code> · <code>-w</code> · <code>-x</code></td><td>the CURRENT user may read · write · execute/enter</td><td>includes groups, ACLs, read-only mounts</td></tr>
<tr><td><code>a -nt b</code> · <code>a -ot b</code></td><td>a newer · older than b (mtime)</td><td>tested: a file touched a second later is <code>-nt</code></td></tr>
<tr><td><code>-z s</code> · <code>-n s</code></td><td>empty · non-empty string</td><td>—</td></tr>
<tr><td><code>==</code> <code>!=</code> <code>&lt;</code> <code>&gt;</code></td><td>string equal / different / sorts before / after</td><td>in <code>[[ ]]</code> the right side of <code>==</code> is a glob</td></tr>
<tr><td><code>=~</code></td><td>matches an extended regex</td><td>captures land in <code>BASH_REMATCH</code></td></tr>
<tr><td><code>-eq -ne -lt -le -gt -ge</code></td><td>integer comparison</td><td>inside <code>[[ ]]</code> both sides are evaluated as arithmetic</td></tr>
<tr><td><code>!</code> · <code>&amp;&amp;</code> · <code>||</code></td><td>not · and · or (inside <code>[[ ]]</code>)</td><td><code>[ ]</code> needs two separate tests instead</td></tr>
</table>
<p>That "evaluated as arithmetic" note hides a real trap. Tested:</p>
<pre><code>a=10; [[ $a -gt x ]]; echo $?
[[ "ERROR42 xx" =~ ^ERROR([0-9]+) ]] &amp;&amp; echo "code: \${BASH_REMATCH[1]}"
v=b; case $v in a) echo A;; b) echo B;&amp; c) echo "C (fell through)";; d) echo D;; esac
v=ab; case $v in a*) echo "a*";;&amp; *b) echo "*b";; esac</code></pre>
<div class="out">0
code: 42
B
C (fell through)
a*
*b</div>
<p><code>x</code> is not a number, so bash reads it as a <em>variable name</em>; unset means 0, and <code>10 -gt 0</code> is true — no error at all. Validate input first with <code>[[ $v =~ ^[0-9]+$ ]]</code> before comparing it as a number. The last two lines show the rare <code>case</code> terminators: <code>;&amp;</code> runs the next branch without testing it, <code>;;&amp;</code> keeps testing the remaining patterns.</p>

<h3>On macOS and WSL</h3>
<p>The shell that runs <code>sh script.sh</code> differs between the three systems, and that decides whether <code>==</code> and <code>[[</code> work:</p>
<table>
<tr><th></th><th>Ubuntu / WSL</th><th>macOS</th></tr>
<tr><td><code>/bin/sh</code> is</td><td><code>dash</code> (symlink)</td><td>a stub that runs <code>/bin/bash</code> 3.2 in POSIX mode (<code>/private/var/select/sh → /bin/bash</code>)</td></tr>
<tr><td><code>sh -c '[ a == a ] &amp;&amp; echo ok'</code></td><td><code>sh: 1: [: a: unexpected operator</code></td><td><code>ok</code></td></tr>
<tr><td><code>sh -c '[[ a == a ]]'</code></td><td><code>sh: 1: [[: not found</code> (exit 127)</td><td>works</td></tr>
<tr><td><code>df --output=pcent /</code></td><td>works (GNU)</td><td><code>df: unrecognized option &#96;--output=pcent'</code> — use <code>df -P / | awk 'NR==2{print $5}'</code></td></tr>
</table>
<p>So a script tested with <code>sh</code> on a Mac can still fail with <code>sh</code> on the server. Put <code>#!/usr/bin/env bash</code> on line 1 and run it as <code>./script.sh</code> or <code>bash script.sh</code>, never <code>sh script.sh</code>, if it uses anything from this lesson.</p>
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> last month someone ran <code>deploy.sh prod</code> (instead of <code>production</code>), with an empty <code>.env</code>, on a disk that was nearly full — and the script happily started. Write the guard that should have stopped it.</p><ol>
<li>In <code>~/thu-linux/ch6</code> write <code>guard.sh</code>: exit 2 with a usage message on stderr unless there is exactly one argument (<code>[[ $# -eq 1 ]]</code>).</li>
<li>Accept only <code>staging|production</code> with a <code>case</code>; anything else exits 2 with <code>unknown env: …</code>.</li>
<li>Require <code>.env.$env</code> to exist AND be non-empty with one file test; otherwise exit 1.</li>
<li>Read disk usage with <code>used=$(df --output=pcent / | tail -1 | tr -dc 0-9)</code> and refuse with exit 1 unless <code>(( used &lt; 90 ))</code>; finally print <code>OK $env (disk N%)</code>.</li>
</ol>
<p><strong>Done when:</strong> <code>bash guard.sh; echo $?</code> → <code>2</code>; <code>bash guard.sh prod</code> → <code>unknown env: prod</code> and 2; after <code>touch .env.staging</code> → <code>missing or empty .env.staging</code> and 1; after <code>echo X=1 &gt; .env.staging</code> → <code>OK staging (disk …%)</code> and 0. (All four tested in Ubuntu 24.04.)</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Exit status / exit code</span><span class="v">The 0–255 number a command returns; 0 means success.</span></div>
  <div class="kv"><span class="k">Short-circuit</span><span class="v"><code>&amp;&amp;</code>/<code>||</code> run the right side only when needed.</span></div>
  <div class="kv"><span class="k"><code>test</code> / <code>[</code></span><span class="v">A command (builtin and <code>/usr/bin/[</code>) that evaluates a condition into an exit code.</span></div>
  <div class="kv"><span class="k"><code>[[ ]]</code></span><span class="v">Bash's conditional syntax: no splitting inside, glob with <code>==</code>, regex with <code>=~</code>.</span></div>
  <div class="kv"><span class="k">Lexicographic order</span><span class="v">Dictionary order used by <code>&lt;</code>/<code>&gt;</code>: "10" comes before "9".</span></div>
  <div class="kv"><span class="k">PIPESTATUS</span><span class="v">Array holding the exit code of every stage of the last pipeline.</span></div>
  <div class="kv"><span class="k">Guard clause</span><span class="v">A check near the top that exits early, with a message, when a precondition fails.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>0 is success; 1 is "no/failed", 2 misuse, 126 not executable, 127 not found, 128+N killed by signal N.</li>
<li><code>$?</code> is overwritten by every command; a pipeline reports only its last command unless you read <code>PIPESTATUS</code> or set <code>pipefail</code>.</li>
<li><code>a &amp;&amp; b || c</code> runs c when b fails too — use a real <code>if</code> when b can fail.</li>
<li><code>[</code> is a command that breaks on empty variables; <code>[[ ]]</code> is safe, supports <code>&amp;&amp;</code>, globs and regex — but does not exist in dash.</li>
<li><code>&lt;</code>/<code>&gt;</code> compare strings; numbers use <code>(( ))</code> or <code>-gt</code>, after checking the input really is a number.</li>
<li><code>case</code> matches globs in order, first match wins; on Ubuntu <code>sh</code> is dash, on macOS it is bash 3.2.</li>
</ul>
<a class="link-card" href="https://www.gnu.org/software/bash/manual/html_node/Bash-Conditional-Expressions.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Bash Manual — Conditional Expressions</span><span class="lc-sub">The complete list of file tests and comparison operators, and the exact difference between <code>[</code> and <code>[[</code>.</span></span>
</a>
<a class="link-card" href="https://mywiki.wooledge.org/BashFAQ/031" target="_blank" rel="noopener">
  <span class="lc-ico">🔧</span>
  <span class="lc-body"><span class="lc-title">BashFAQ 031 — "What is the difference between test, [ and [[ ?"</span><span class="lc-sub">A side-by-side table with the cases where each one breaks. Settles the question permanently.</span></span>
</a>
<a class="link-card" href="https://tldp.org/LDP/abs/html/exitcodes.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔢</span>
  <span class="lc-body"><span class="lc-title">Advanced Bash Scripting — Exit Codes With Special Meanings</span><span class="lc-sub">The conventional meanings of 1, 2, 126, 127 and 128+N, so your own scripts follow the same conventions everything else does.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: write the guard clauses</span><span class="lc-sub">Graded tasks: validate arguments with <code>case</code>, check preconditions with file tests, and return the conventional exit codes.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> <code>if [ \$var = "yes" ]</code> with <code>var</code> empty. The shell expands it to <code>[ = "yes" ]</code>, which is a syntax error — <code>unary operator expected</code> — and the branch neither runs nor fails cleanly. The old workaround was <code>[ "x\$var" = "xyes" ]</code>, which you will still see in scripts written for <code>sh</code>. In bash the answer is simply <code>[[ \$var == "yes" ]]</code>: no word splitting inside <code>[[ ]]</code>, so an empty variable is just an empty string and the test is false.</div>
<p class="note-ct"><strong>Three defaults for the rest of this course:</strong> <code>[[ ]]</code> for tests, <code>(( ))</code> for anything numeric, and <code>case</code> instead of more than two <code>elif</code>s. And write guard clauses that exit early with a message on <code>&gt;&amp;2</code> — a script that refuses to start and says why is worth far more than one that runs halfway and leaves you guessing.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.4</span>
<h2>Mã thoát và điều kiện</h2>
<p class="lead">Mọi lệnh đều trả về một con số khi nó kết thúc. Toàn bộ khái niệm "việc đó có chạy được không" của shell dựng trên con số ấy, và <code>&amp;&amp;</code>, <code>||</code>, <code>if</code>, <code>while</code> cũng vậy. Khi bạn thấy rằng <code>if</code> KHÔNG kiểm một giá trị luận lý mà chỉ đơn giản là CHẠY một lệnh rồi nhìn mã thoát của nó, cú pháp sẽ thôi có vẻ tuỳ tiện.</p>

<h3>Số 0 là thành công</h3>
${slide('lx-06', 19, 'Mã thoát: 0 là thành công, số khác là kiểu hỏng')}
<pre><code class="language-bash">ls /etc &gt;/dev/null; echo \$?
ls /nonexistent 2&gt;/dev/null; echo \$?
grep -q root /etc/passwd; echo \$?
grep -q nosuchuser /etc/passwd; echo \$?</code></pre>
<div class="out">0
2
0
1</div>
<p>Số 0 nghĩa là thành công, và mọi giá trị khác 0 nghĩa là một kiểu thất bại khác nhau. Chuyện này ngược với phần lớn ngôn ngữ lập trình, nơi 0 mang nghĩa sai — và nó là chiều ĐÚNG cho một shell, vì chỉ có đúng một cách để thành công nhưng có rất nhiều cách thất bại khác nhau, nên phần thất bại mới là phần cần tới cả một dải số.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">0</span><span class="v">Thành công.</span></div>
  <div class="kv"><span class="k">1</span><span class="v">Thất bại chung. <code>grep</code> dùng nó cho "không tìm thấy chỗ khớp nào", vốn là một KẾT QUẢ chứ không phải một lỗi.</span></div>
  <div class="kv"><span class="k">2</span><span class="v">Dùng sai — tham số hỏng, thiếu file. Phần lớn công cụ GNU theo quy ước này.</span></div>
  <div class="kv"><span class="k">126 · 127</span><span class="v">Tìm thấy nhưng không chạy được · <strong>không tìm thấy lệnh</strong>. 127 là cái bạn sẽ gặp nhiều nhất.</span></div>
  <div class="kv"><span class="k">128+N</span><span class="v">Bị giết bởi tín hiệu N (Bài 5.3). 130 Ctrl-C, 137 SIGKILL, 143 SIGTERM.</span></div>
</div>
<pre><code><span class="tok-comment"># Tự đặt mã thoát, trong một script</span>
exit 0        <span class="tok-comment"># thành công</span>
exit 1        <span class="tok-comment"># thất bại chung</span>
exit 2        <span class="tok-comment"># dùng sai — quy ước cho "bạn gọi tôi sai cách"</span></code></pre>
<div class="callout warn"><code>\$?</code> giữ mã thoát của lệnh <strong>NGAY TRƯỚC ĐÓ</strong>, và nó bị ghi đè bởi mọi thứ — kể cả một lệnh <code>echo</code>. Đoạn <code>cmd; echo "xong"; if [ \$? -ne 0 ]</code> đang kiểm mã thoát của <code>echo</code>, thứ luôn thành công. Hãy bắt lấy nó ngay lập tức (<code>rc=\$?</code>) hoặc, tốt hơn, kiểm thẳng cái lệnh đó bằng <code>if</code>.</div>

<h3>&amp;&amp; và ||: rẽ nhánh mà không cần if</h3>
${slide('lx-06', 20, 'a &amp;&amp; b || c không phải if/else')}
<pre><code class="language-bash">mkdir -p build &amp;&amp; cd build           <span class="tok-comment"># chỉ cd nếu mkdir thành công</span>
grep -q ERROR log || echo "sạch"     <span class="tok-comment"># chỉ echo nếu grep THẤT BẠI</span>
command -v jq &gt;/dev/null || { echo "cần jq" &gt;&amp;2; exit 1; }

<span class="tok-comment"># Nối chuỗi — đọc như một câu văn</span>
npm test &amp;&amp; npm run build &amp;&amp; ./deploy.sh</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>a &amp;&amp; b</code></span><span class="v">Chỉ chạy <code>b</code> nếu <code>a</code> thành công (thoát 0). Ngắt mạch sớm.</span></div>
  <div class="kv"><span class="k"><code>a || b</code></span><span class="v">Chỉ chạy <code>b</code> nếu <code>a</code> thất bại. Chính là "nếu không thì" của shell.</span></div>
  <div class="kv"><span class="k"><code>a ; b</code></span><span class="v">Chạy cả hai bất kể sao. Dấu chấm phẩy chỉ là một lần xuống dòng.</span></div>
</div>
<div class="callout warn"><strong><code>a &amp;&amp; b || c</code> KHÔNG PHẢI là if-then-else</strong>, và khác biệt đó cắn thật. Nếu <code>a</code> thành công nhưng <code>b</code> thất bại thì <code>c</code> cũng chạy — nên <code>[[ -f f ]] &amp;&amp; process f || echo "không có file"</code> sẽ in "không có file" ngay cả khi file CÓ tồn tại mà việc xử lý mới là thứ hỏng. Hãy dùng một lệnh <code>if</code> thật mỗi khi lệnh ở giữa có thể thất bại.</div>

<h3>if, và nó thật ra kiểm cái gì</h3>
<pre><code class="language-bash">if grep -q ERROR app.log; then
  echo "có lỗi"
elif grep -q WARN app.log; then
  echo "chỉ có cảnh báo"
else
  echo "sạch"
fi</code></pre>
<p>Để ý là không có cặp ngoặc nào. <code>if</code> nhận một <em>LỆNH</em> và rẽ nhánh theo mã thoát của nó — <code>grep -q</code> chính là điều kiện. Cái dạng quen thuộc <code>if [ … ]</code> cũng chỉ là như vậy: <code>[</code> là một LỆNH (trên máy bạn có hẳn một file <code>/usr/bin/[</code> thật), và nó thoát ra 0 hoặc 1. Đó là lý do <code>[ \$a = \$b ]</code> cần dấu cách quanh mọi ký hiệu — chúng là THAM SỐ truyền cho một chương trình.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · if nhận một LỆNH</span><span class="lz-t">if grep -q ERROR log; then</span><span class="lz-d">Không phải một biểu thức luận lý. Cái lệnh đó CHẠY THẬT, kèm mọi tác dụng phụ của nó.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Lệnh thoát ra</span><span class="lz-t">mã thoát 0, hoặc khác 0</span><span class="lz-d">grep -q thoát 0 khi có khớp, 1 khi không khớp, 2 khi có lỗi thật sự.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Bằng 0 → nhánh then</span><span class="lz-t">khác 0 → nhánh else</span><span class="lz-d">Đó là toàn bộ luật. Không có khái niệm "đúng một cách tương đối" và không có phép chuyển kiểu nào.</span></div>
  <div class="lz-step"><span class="lz-k">4 · [ và [[ cũng chỉ là lệnh</span><span class="lz-t">[ "\$a" = "\$b" ] thoát ra 0 hoặc 1</span><span class="lz-d">/usr/bin/[ là một file có thật. Đó là lý do mọi ký hiệu đều cần dấu cách quanh nó — chúng là THAM SỐ.</span></div>
</div>
<h3>[ ] so với [[ ]]</h3>
${slide('lx-06', 21, '[ là một lệnh, [[ là cú pháp')}
<pre><code><span class="tok-comment"># [ ] — chuẩn POSIX, chạy được trong sh, là một lệnh thật</span>
if [ "\$name" = "Binh" ]; then echo yes; fi

<span class="tok-comment"># [[ ]] — dựng sẵn trong bash, an toàn hơn và làm được nhiều hơn</span>
if [[ \$name == "Binh" ]]; then echo yes; fi
if [[ \$file == *.log ]]; then echo "một file log"; fi <span class="tok-comment"># khớp glob</span>
if [[ \$line =~ ^ERROR[0-9]+ ]]; then echo "khớp"; fi  <span class="tok-comment"># regex</span>
if [[ -f \$f &amp;&amp; -r \$f ]]; then echo "đọc được"; fi    <span class="tok-comment"># &amp;&amp; dùng ngay bên trong</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Lợi thế của <code>[[ ]]</code></span><span class="v">Bên trong nó KHÔNG có cắt từ hay khai triển glob, nên biến không nháy vẫn an toàn. Hỗ trợ <code>&amp;&amp;</code>, <code>||</code>, khớp glob bằng <code>==</code>, và regex bằng <code>=~</code>.</span></div>
  <div class="kv"><span class="k">Khi nào dùng <code>[ ]</code></span><span class="v">Chỉ khi script BẮT BUỘC phải chạy dưới <code>sh</code>/dash — một container không có bash, hay một môi trường chỉ có POSIX. Khi đó hãy đặt nháy cho mọi thứ một cách nghiêm ngặt.</span></div>
</div>
<div class="callout ok"><strong>Hãy dùng <code>[[ ]]</code> trong mọi script có shebang bash.</strong> Bên trong nó, một biến rỗng KHÔNG thể làm vỡ cú pháp — <code>[ \$x = y ]</code> với <code>x</code> rỗng biến thành <code>[ = y ]</code> và báo lỗi, còn <code>[[ \$x == y ]]</code> đơn giản là sai. Riêng khác biệt đó đã gỡ bỏ một nguồn kinh điển của những script chạy tốt lúc thử và hỏng với dữ liệu thật.</div>

<h3>So sánh chuỗi so với so sánh số</h3>
${slide('lx-06', 22, '&gt; trong [[ ]] so chuỗi, trong [ ] tạo file')}
<pre><code><span class="tok-comment"># Chuỗi</span>
[[ \$a == \$b ]]      [[ \$a != \$b ]]
[[ -z \$a ]]          <span class="tok-comment"># độ dài bằng 0 (rỗng)</span>
[[ -n \$a ]]          <span class="tok-comment"># khác rỗng</span>
[[ \$a &lt; \$b ]]       <span class="tok-comment"># theo từ điển</span>

<span class="tok-comment"># Số</span>
[[ \$a -eq \$b ]]     <span class="tok-comment"># bằng      · -ne khác</span>
[[ \$a -lt \$b ]]     <span class="tok-comment"># nhỏ hơn   · -le -gt -ge</span>
(( a &gt; b ))          <span class="tok-comment"># rõ hơn, và cho phép dùng toán tử bình thường</span></code></pre>
<div class="out">$ a=10 b=9
$ [[ \$a &gt; \$b ]] &amp;&amp; echo "10 &gt; 9"      # không gì cả — so sánh CHUỖI!
$ (( a &gt; b )) &amp;&amp; echo "10 &gt; 9"
10 &gt; 9</div>
<div class="callout warn">Đây là lỗi âm thầm kinh điển. Với dấu <code>&gt;</code> bên trong <code>[[ ]]</code>, bạn nhận được một phép so sánh <strong>CHUỖI</strong>, nên <code>"10"</code> đứng trước <code>"9"</code> — đúng cái vấn đề của <code>sort</code> ở Bài 3.4, xuất hiện ở một chỗ mới. Hãy dùng <code>-gt</code>, hoặc tốt hơn là <code>(( ))</code>, cho mọi thứ liên quan tới số. Và bên trong <code>[ ]</code> thì một dấu <code>&gt;</code> trần còn tệ hơn nữa: nó là một phép CHUYỂN HƯỚNG, nên <code>[ \$a &gt; \$b ]</code> âm thầm tạo ra một file mang tên bằng giá trị của <code>\$b</code>.</div>

<h3>Các phép thử file</h3>
${slide('lx-06', 23, 'Phép thử file và case')}
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-e</code> · <code>-f</code> · <code>-d</code></span><span class="v">Tồn tại (bất cứ loại nào) · là file thường · là thư mục.</span></div>
  <div class="kv"><span class="k"><code>-r</code> · <code>-w</code> · <code>-x</code></span><span class="v">Đọc được · ghi được · chạy được <strong>BỞI NGƯỜI DÙNG HIỆN TẠI</strong> — đúng là câu hỏi của Chương 4, và được trả lời cho đúng.</span></div>
  <div class="kv"><span class="k"><code>-s</code> · <code>-L</code></span><span class="v">Tồn tại và khác rỗng · là một liên kết tượng trưng.</span></div>
  <div class="kv"><span class="k"><code>-nt</code> · <code>-ot</code></span><span class="v">Mới hơn · cũ hơn, tính theo thời gian sửa. Nền tảng của một phép kiểm dựng lại tự viết.</span></div>
</div>
<pre><code class="language-bash">if [[ ! -f \$config ]]; then
  echo "thiếu file cấu hình: \$config" &gt;&amp;2
  exit 1
fi

[[ -d \$dir ]] || mkdir -p "\$dir"
[[ -s \$log ]] &amp;&amp; echo "log có nội dung"
[[ src/app.ts -nt dist/app.js ]] &amp;&amp; npm run build</code></pre>
<div class="callout ok"><code>-r</code> và <code>-w</code> trả lời câu "<em>TÔI</em> có đọc được cái này không", có tính tới quyền sở hữu, nhóm, mọi thư mục trên đường dẫn, và cả những hệ thống file gắn ở chế độ chỉ-đọc — tức là toàn bộ Bài 4.5 gói trong một phép thử. Kiểm bằng <code>[[ -r \$f ]]</code> đáng tin hơn nhiều so với việc soi output của <code>ls -l</code> rồi ngồi suy luận.</div>

<h3>case: gọn hơn một chuỗi elif</h3>
<pre><code class="language-bash">case "\$1" in
  start)
    echo "đang khởi động" ;;
  stop|halt)                         <span class="tok-comment"># nhiều mẫu cùng lúc</span>
    echo "đang dừng" ;;
  restart)
    "\$0" stop &amp;&amp; "\$0" start ;;
  *.log)                             <span class="tok-comment"># mẫu glob dùng được</span>
    echo "đó là một file log" ;;
  "")
    echo "cách dùng: \$0 {start|stop|restart}" &gt;&amp;2; exit 2 ;;
  *)                                 <span class="tok-comment"># nhánh mặc định</span>
    echo "không rõ: \$1" &gt;&amp;2; exit 2 ;;
esac</code></pre>
<div class="out">$ ./service.sh
cách dùng: ./service.sh {start|stop|restart}</div>
<p>Các mẫu là glob (Bài 2.2), được đối chiếu theo thứ tự, cái khớp đầu tiên thắng. <code>;;</code> kết thúc một nhánh; <code>;&amp;</code> rơi thẳng xuống nhánh kế còn <code>;;&amp;</code> tiếp tục thử — cả hai đều hiếm khi cần. Mọi script init và mọi bộ điều phối lệnh mà bạn sẽ đọc đều dựng trên cấu trúc này.</p>

<h3>Ghép lại với nhau</h3>
<pre><code class="language-bash">#!/usr/bin/env bash
<span class="tok-comment"># Chốt chặn deploy: từ chối chạy trừ khi mọi thứ đã đâu vào đấy</span>

[[ \$# -eq 1 ]] || { echo "cách dùng: \$0 &lt;env&gt;" &gt;&amp;2; exit 2; }

env="\$1"
case "\$env" in
  staging|production) ;;
  *) echo "env không hợp lệ: \$env" &gt;&amp;2; exit 2 ;;
esac

command -v docker &gt;/dev/null || { echo "chưa cài docker" &gt;&amp;2; exit 1; }
[[ -f ".env.\$env" ]] || { echo "thiếu .env.\$env" &gt;&amp;2; exit 1; }

if [[ -n \$(git status --porcelain) ]]; then
  echo "cây làm việc còn thay đổi chưa commit — hãy commit trước" &gt;&amp;2
  exit 1
fi

echo "đang deploy lên \$env"</code></pre>
<div class="out">$ ./deploy.sh
cách dùng: ./deploy.sh &lt;env&gt;
$ ./deploy.sh prod
env không hợp lệ: prod</div>
<p>Mỗi phép kiểm đều thoát ra với một thông điệp riêng trên stderr và một mã khác 0, nên CI hỏng một cách ồn ào và người đọc output biết chính xác điều kiện tiên quyết nào chưa thoả. Chương 7 sẽ biến cái này thành một khuôn script hoàn chỉnh.</p>

<h3>Những mã thoát bạn sẽ thật sự gặp — đo thật</h3>
<pre><code class="language-bash">ls /khong 2&gt;/dev/null; echo $?
grep -q nobodyxx /etc/passwd; echo $?
khonglenh 2&gt;/dev/null; echo $?
printf 'echo hi\\n' &gt; s.sh; ./s.sh 2&gt;/dev/null; echo $?
bash -c 'kill -TERM $$'; echo $?
bash -c 'exit 300'; echo $?
false | true; echo "$? \${PIPESTATUS[*]}"</code></pre>
<div class="out">2
1
127
126
Terminated
143
44
0 1 0</div>
<p>Mỗi dòng dạy một luật. <code>127</code> = không tìm thấy tên đó trên <code>PATH</code> (Chương 8); <code>126</code> = tìm thấy nhưng không chạy được (thiếu bit <code>x</code> — Chương 4); <code>143</code> = 128 + 15, bị SIGTERM giết (Chương 5); mã thoát chỉ là một byte, nên <code>exit 300</code> thành 300 − 256 = 44. Và một ống dẫn trả về mã của lệnh <strong>CUỐI CÙNG</strong>: <code>false | true</code> "thành công". <code>\${PIPESTATUS[@]}</code> giữ mã của từng chặng, còn <code>set -o pipefail</code> (Chương 3 và 7) làm cả ống hỏng nếu bất kỳ chặng nào hỏng.</p>

<h3>Các toán tử phép thử, gói trong một bảng</h3>
<table>
<tr><th>Toán tử</th><th>Đúng khi</th><th>Ghi chú</th></tr>
<tr><td><code>-e</code> · <code>-f</code> · <code>-d</code></td><td>tồn tại · là file thường · là thư mục</td><td><code>-f</code> và <code>-e</code> đi THEO liên kết tượng trưng</td></tr>
<tr><td><code>-s</code> · <code>-L</code></td><td>kích thước &gt; 0 · là liên kết tượng trưng</td><td>một file log rỗng là <code>-f</code> nhưng không <code>-s</code></td></tr>
<tr><td><code>-r</code> · <code>-w</code> · <code>-x</code></td><td>người dùng HIỆN TẠI đọc · ghi · chạy/vào được</td><td>tính cả nhóm, ACL, ổ gắn chỉ-đọc</td></tr>
<tr><td><code>a -nt b</code> · <code>a -ot b</code></td><td>a mới hơn · cũ hơn b (theo mtime)</td><td>đã thử: file touch sau một giây là <code>-nt</code></td></tr>
<tr><td><code>-z s</code> · <code>-n s</code></td><td>chuỗi rỗng · khác rỗng</td><td>—</td></tr>
<tr><td><code>==</code> <code>!=</code> <code>&lt;</code> <code>&gt;</code></td><td>chuỗi bằng / khác / đứng trước / đứng sau</td><td>trong <code>[[ ]]</code> vế phải của <code>==</code> là glob</td></tr>
<tr><td><code>=~</code></td><td>khớp một regex mở rộng</td><td>nhóm bắt được nằm trong <code>BASH_REMATCH</code></td></tr>
<tr><td><code>-eq -ne -lt -le -gt -ge</code></td><td>so sánh số nguyên</td><td>trong <code>[[ ]]</code> cả hai vế được TÍNH như số học</td></tr>
<tr><td><code>!</code> · <code>&amp;&amp;</code> · <code>||</code></td><td>phủ định · và · hoặc (trong <code>[[ ]]</code>)</td><td><code>[ ]</code> phải dùng hai phép thử riêng</td></tr>
</table>
<p>Ghi chú "được tính như số học" giấu một cái bẫy thật. Đã thử:</p>
<pre><code>a=10; [[ $a -gt x ]]; echo $?
[[ "ERROR42 xx" =~ ^ERROR([0-9]+) ]] &amp;&amp; echo "code: \${BASH_REMATCH[1]}"
v=b; case $v in a) echo A;; b) echo B;&amp; c) echo "C (fell through)";; d) echo D;; esac
v=ab; case $v in a*) echo "a*";;&amp; *b) echo "*b";; esac</code></pre>
<div class="out">0
code: 42
B
C (fell through)
a*
*b</div>
<p><code>x</code> không phải một con số, nên bash đọc nó như một <em>TÊN BIẾN</em>; chưa đặt nghĩa là 0, và <code>10 -gt 0</code> đúng — không có lỗi nào cả. Hãy kiểm đầu vào trước bằng <code>[[ $v =~ ^[0-9]+$ ]]</code> rồi mới so nó như một số. Hai dòng cuối cho thấy hai dấu kết nhánh hiếm gặp của <code>case</code>: <code>;&amp;</code> chạy luôn nhánh kế mà không thử, <code>;;&amp;</code> tiếp tục thử các mẫu còn lại.</p>

<h3>Trên macOS và WSL khác gì</h3>
<p>Shell chạy lệnh <code>sh script.sh</code> khác nhau giữa ba hệ, và chính nó quyết định <code>==</code> và <code>[[</code> có chạy hay không:</p>
<table>
<tr><th></th><th>Ubuntu / WSL</th><th>macOS</th></tr>
<tr><td><code>/bin/sh</code> là</td><td><code>dash</code> (liên kết tượng trưng)</td><td>một chương trình mồi chạy <code>/bin/bash</code> 3.2 ở chế độ POSIX (<code>/private/var/select/sh → /bin/bash</code>)</td></tr>
<tr><td><code>sh -c '[ a == a ] &amp;&amp; echo ok'</code></td><td><code>sh: 1: [: a: unexpected operator</code></td><td><code>ok</code></td></tr>
<tr><td><code>sh -c '[[ a == a ]]'</code></td><td><code>sh: 1: [[: not found</code> (mã 127)</td><td>chạy được</td></tr>
<tr><td><code>df --output=pcent /</code></td><td>chạy (GNU)</td><td><code>df: unrecognized option &#96;--output=pcent'</code> — dùng <code>df -P / | awk 'NR==2{print $5}'</code></td></tr>
</table>
<p>Vậy một script thử bằng <code>sh</code> trên Mac vẫn có thể hỏng khi chạy bằng <code>sh</code> trên máy chủ. Đặt <code>#!/usr/bin/env bash</code> ở dòng 1 và chạy bằng <code>./script.sh</code> hoặc <code>bash script.sh</code>, đừng bao giờ <code>sh script.sh</code>, nếu script dùng bất cứ thứ gì trong bài này.</p>
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> tháng trước có người chạy <code>deploy.sh prod</code> (thay vì <code>production</code>), với file <code>.env</code> rỗng, trên một ổ đĩa gần đầy — và script vẫn vui vẻ chạy. Viết cái chốt chặn lẽ ra phải dừng nó lại.</p><ol>
<li>Trong <code>~/thu-linux/ch6</code> viết <code>guard.sh</code>: thoát mã 2 kèm dòng hướng dẫn trên stderr trừ khi có đúng một tham số (<code>[[ $# -eq 1 ]]</code>).</li>
<li>Chỉ nhận <code>staging|production</code> bằng một <code>case</code>; mọi thứ khác thoát mã 2 với <code>unknown env: …</code>.</li>
<li>Đòi <code>.env.$env</code> phải tồn tại VÀ khác rỗng bằng MỘT phép thử file; không thì thoát mã 1.</li>
<li>Đọc mức dùng đĩa bằng <code>used=$(df --output=pcent / | tail -1 | tr -dc 0-9)</code> và từ chối (mã 1) trừ khi <code>(( used &lt; 90 ))</code>; cuối cùng in <code>OK $env (disk N%)</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>bash guard.sh; echo $?</code> → <code>2</code>; <code>bash guard.sh prod</code> → <code>unknown env: prod</code> và 2; sau <code>touch .env.staging</code> → <code>missing or empty .env.staging</code> và 1; sau <code>echo X=1 &gt; .env.staging</code> → <code>OK staging (disk …%)</code> và 0. (Cả bốn đã thử trên Ubuntu 24.04.)</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Exit status / exit code (mã thoát)</span><span class="v">Con số 0–255 một lệnh trả về; 0 nghĩa là thành công.</span></div>
  <div class="kv"><span class="k">Short-circuit (ngắt mạch)</span><span class="v"><code>&amp;&amp;</code>/<code>||</code> chỉ chạy vế phải khi cần.</span></div>
  <div class="kv"><span class="k"><code>test</code> / <code>[</code> (lệnh thử)</span><span class="v">Một LỆNH (dựng sẵn và <code>/usr/bin/[</code>) biến một điều kiện thành mã thoát.</span></div>
  <div class="kv"><span class="k"><code>[[ ]]</code> (biểu thức điều kiện)</span><span class="v">Cú pháp của bash: không cắt từ bên trong, glob với <code>==</code>, regex với <code>=~</code>.</span></div>
  <div class="kv"><span class="k">Lexicographic order (thứ tự từ điển)</span><span class="v">Thứ tự mà <code>&lt;</code>/<code>&gt;</code> dùng: "10" đứng trước "9".</span></div>
  <div class="kv"><span class="k">PIPESTATUS (mã của từng chặng)</span><span class="v">Mảng giữ mã thoát của mọi chặng trong ống dẫn vừa chạy.</span></div>
  <div class="kv"><span class="k">Guard clause (chốt chặn)</span><span class="v">Một phép kiểm ở đầu script, thoát sớm kèm thông điệp khi điều kiện tiên quyết không thoả.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>0 là thành công; 1 là "không/hỏng", 2 dùng sai, 126 không chạy được, 127 không tìm thấy, 128+N bị tín hiệu N giết.</li>
<li><code>$?</code> bị mọi lệnh ghi đè; ống dẫn chỉ báo mã của lệnh cuối trừ khi bạn đọc <code>PIPESTATUS</code> hoặc bật <code>pipefail</code>.</li>
<li><code>a &amp;&amp; b || c</code> chạy c cả khi b hỏng — dùng <code>if</code> thật khi b có thể hỏng.</li>
<li><code>[</code> là một lệnh và vỡ với biến rỗng; <code>[[ ]]</code> an toàn, có <code>&amp;&amp;</code>, glob và regex — nhưng dash không có nó.</li>
<li><code>&lt;</code>/<code>&gt;</code> so chuỗi; số thì dùng <code>(( ))</code> hoặc <code>-gt</code>, sau khi đã kiểm đầu vào đúng là số.</li>
<li><code>case</code> đối chiếu glob theo thứ tự, khớp đầu tiên thắng; trên Ubuntu <code>sh</code> là dash, trên macOS là bash 3.2.</li>
</ul>
<a class="link-card" href="https://www.gnu.org/software/bash/manual/html_node/Bash-Conditional-Expressions.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Bash Manual — Conditional Expressions</span><span class="lc-sub">Danh sách đầy đủ các phép thử file và toán tử so sánh, cùng khác biệt chính xác giữa <code>[</code> và <code>[[</code>.</span></span>
</a>
<a class="link-card" href="https://mywiki.wooledge.org/BashFAQ/031" target="_blank" rel="noopener">
  <span class="lc-ico">🔧</span>
  <span class="lc-body"><span class="lc-title">BashFAQ 031 — "test, [ và [[ khác nhau ra sao?"</span><span class="lc-sub">Một bảng đặt cạnh nhau kèm những ca mà mỗi cái vỡ. Kết thúc câu hỏi này vĩnh viễn.</span></span>
</a>
<a class="link-card" href="https://tldp.org/LDP/abs/html/exitcodes.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔢</span>
  <span class="lc-body"><span class="lc-title">Advanced Bash Scripting — Exit Codes With Special Meanings</span><span class="lc-sub">Ý nghĩa theo quy ước của 1, 2, 126, 127 và 128+N, để script của bạn theo đúng quy ước mà mọi thứ khác đang theo.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: viết các chốt chặn đầu script</span><span class="lc-sub">Bài chấm điểm: kiểm tham số bằng <code>case</code>, kiểm điều kiện tiên quyết bằng các phép thử file, và trả về đúng những mã thoát theo quy ước.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> <code>if [ \$var = "yes" ]</code> với <code>var</code> rỗng. Shell khai triển nó thành <code>[ = "yes" ]</code>, và đó là một lỗi cú pháp — <code>unary operator expected</code> — nên nhánh đó vừa không chạy vừa không hỏng một cách sạch sẽ. Cách chữa đời cũ là <code>[ "x\$var" = "xyes" ]</code>, thứ bạn vẫn còn thấy trong những script viết cho <code>sh</code>. Trong bash thì câu trả lời đơn giản là <code>[[ \$var == "yes" ]]</code>: bên trong <code>[[ ]]</code> không có cắt từ, nên một biến rỗng chỉ là một chuỗi rỗng và phép thử cho kết quả sai.</div>
<p class="note-ct"><strong>Ba mặc định cho phần còn lại của khoá này:</strong> <code>[[ ]]</code> cho các phép thử, <code>(( ))</code> cho mọi thứ liên quan tới số, và <code>case</code> thay cho quá hai lần <code>elif</code>. Và hãy viết những chốt chặn thoát sớm kèm thông điệp ra <code>&gt;&amp;2</code> — một script từ chối khởi động và nói rõ vì sao thì đáng giá hơn nhiều so với một script chạy được nửa đường rồi để bạn ngồi đoán.</p>
</div>
`,
    },
    /* ─────────────────────────── 6.5 ─────────────────────────── */
    {
      title: '6.5 — Loops and functions|||6.5 — Vòng lặp và hàm',
      slug: 'lnx-6-5-vong-lap-ham',
      type: 'LESSON',
      description: 'for trên glob và mảng, while read -r và vì sao IFS= quan trọng, luật "đừng phân tích ls", vòng lặp song song, hàm với local và giá trị trả về, và mapfile.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.5</span>
<h2>Loops and functions</h2>
<p class="lead">Loops are where all of this chapter's quoting rules get exercised, and where the classic shell bugs live. There is one correct way to loop over files, one correct way to loop over lines, and both look slightly odd until you know what they are defending against.</p>

<h3>for: over a list</h3>
${slide('lx-06', 24, 'for qua glob, mảng, khoảng — {1..$n} không chạy')}
<pre><code class="language-bash"><span class="tok-comment"># Over a glob — the shell expands it into words for you (Lesson 2.2)</span>
for f in *.log; do
  [[ -e \$f ]] || continue          <span class="tok-comment"># guard: unmatched glob passes through literally</span>
  echo "processing \$f"
done

<span class="tok-comment"># Over an array — QUOTED @, always</span>
for f in "\${files[@]}"; do echo "[\$f]"; done

<span class="tok-comment"># Over arguments</span>
for arg in "\$@"; do echo "\$arg"; done

<span class="tok-comment"># Over a numeric range</span>
for i in {1..5}; do echo "\$i"; done
for ((i = 0; i &lt; 5; i++)); do echo "\$i"; done   <span class="tok-comment"># C-style, when you need a variable bound</span></code></pre>
<div class="out">processing app.log
processing db.log
1
2
3
4
5</div>
<div class="callout warn">Brace ranges are expanded before variables, so <code>for i in {1..\$n}</code> does <strong>not</strong> work — it produces the literal string <code>{1..5}</code>. Use the C-style form <code>for ((i=1; i&lt;=n; i++))</code> when the bound is a variable, or <code>seq</code>. This trips people up because the fixed-number version works perfectly.</div>

<h3>The one rule: do not parse ls</h3>
${slide('lx-06', 25, 'Đừng lặp trên $(ls)')}
<pre><code class="language-bash"><span class="tok-comment"># WRONG — breaks on any filename with a space or a glob character</span>
for f in \$(ls *.txt); do rm "\$f"; done

<span class="tok-comment"># RIGHT — the shell already gives you a properly split list</span>
for f in *.txt; do rm -- "\$f"; done

<span class="tok-comment"># RIGHT — for anything recursive, NUL-separated (Lesson 2.3)</span>
find . -name "*.txt" -print0 | while IFS= read -r -d '' f; do
  rm -- "\$f"
done</code></pre>
<p><code>ls</code> produces text for humans. Its output goes through word splitting (Lesson 6.2), so <code>my file.txt</code> becomes two iterations, and a file named <code>*</code> expands to everything in the directory. A glob does not have this problem because the shell hands the loop a proper list of words, already split correctly by construction.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Files here</span><span class="lz-lnote"><code>for f in *.log</code> — the shell splits the glob correctly by construction. Add a <code>[[ -e \$f ]]</code> guard.</span></div>
  <div class="lz-layer"><span class="lz-lname">Files anywhere</span><span class="lz-lnote"><code>find … -print0 | while IFS= read -r -d '' f</code> — NUL-separated, safe for every possible filename.</span></div>
  <div class="lz-layer"><span class="lz-lname">Lines of a file</span><span class="lz-lnote"><code>while IFS= read -r line; do … done &lt; file</code> — redirect, never pipe, or the loop loses its variables.</span></div>
  <div class="lz-layer"><span class="lz-lname">Lines of a command</span><span class="lz-lnote"><code>done &lt; &lt;(command)</code> — process substitution keeps the loop in the current shell.</span></div>
  <div class="lz-layer"><span class="lz-lname">Into an array</span><span class="lz-lnote"><code>mapfile -t arr &lt; file</code> — the correct replacement for <code>arr=\$(ls)</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">Never</span><span class="lz-lnote"><code>for f in \$(ls)</code> — word splitting turns one filename into several and expands any glob characters in it.</span></div>
</div>
<h3>while read: over lines</h3>
${slide('lx-06', 26, 'while IFS= read -r: giữ thụt lề, \\ và dòng cuối')}
<pre><code class="language-bash">while IFS= read -r line; do
  echo "[\$line]"
done &lt; input.txt</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>IFS=</code></span><span class="v">Empty, so leading and trailing whitespace on each line is <strong>preserved</strong>. Without it, indentation is silently stripped.</span></div>
  <div class="kv"><span class="k"><code>-r</code></span><span class="v">Do not interpret backslashes. Without it, a line containing <code>C:\\path</code> is mangled.</span></div>
  <div class="kv"><span class="k"><code>&lt; input.txt</code></span><span class="v">Redirect rather than pipe — <strong>no subshell</strong>, so variables set inside the loop survive (Lesson 3.2).</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Reading fields from a delimited file</span>
while IFS=, read -r name email role; do
  echo "\$name &lt;\$email&gt; is \$role"
done &lt; users.csv

<span class="tok-comment"># Reading from a command, without losing variables to a subshell</span>
count=0
while IFS= read -r line; do
  ((count++))
done &lt; &lt;(grep ERROR app.log)
echo "\$count errors"</code></pre>
<div class="out">Binh &lt;binh@example.com&gt; is admin
An &lt;an@example.com&gt; is editor
37 errors</div>
<div class="callout ok">That <code>&lt; &lt;(command)</code> is process substitution (Lesson 3.2), and it is the fix for the subshell trap: <code>cmd | while read …</code> runs the loop in a child, so <code>count</code> is lost. Reading from <code>&lt;(cmd)</code> keeps the loop in the current shell. Two extra characters, and the variable survives.</div>

<h3>Three ways a line-reading loop silently loses data</h3>
${slide('lx-06', 27, 'Ống dẫn chạy vòng lặp trong shell con; ký tự \\r của Windows')}
<p>All three were reproduced in the Ubuntu container; each one prints no error.</p>
<pre><code class="language-bash"><span class="tok-comment"># 1 · a pipe runs the loop in a subshell — the counter dies with it</span>
count=0; printf 'ERROR a\\nok\\nERROR b\\n' | while IFS= read -r l; do [[ $l == ERROR* ]] &amp;&amp; ((count++)); done; echo "pipe: $count"
count=0; while IFS= read -r l; do [[ $l == ERROR* ]] &amp;&amp; ((count++)); done &lt; &lt;(printf 'ERROR a\\nok\\nERROR b\\n'); echo "procsub: $count"

<span class="tok-comment"># 2 · the last line has no newline — read returns 1 and the loop skips it</span>
printf 'mot\\nhai' &gt; nonl.txt
while IFS= read -r l; do printf '[%s]\\n' "$l"; done &lt; nonl.txt
while IFS= read -r l || [[ -n $l ]]; do printf '[%s]\\n' "$l"; done &lt; nonl.txt

<span class="tok-comment"># 3 · a file saved on Windows ends every line with \\r</span>
printf 'prod\\r\\n' &gt; env.txt; read -r e &lt; env.txt
[[ $e == prod ]] &amp;&amp; echo khop || { echo "KHONG khop:"; printf '%s' "$e" | od -c | head -1; }
e=\${e%$'\\r'}; [[ $e == prod ]] &amp;&amp; echo "after removing \\r: khop"</code></pre>
<div class="out">pipe: 0
procsub: 2
[mot]
[mot]
[hai]
KHONG khop:
0000000   p   r   o   d  \\r
after removing \\r: khop</div>
<p>Case 3 is the one your Windows teammates hit: a <code>.env</code> or host list edited in Notepad looks identical in <code>cat</code>, but every comparison fails. <code>cat -A</code> shows it as <code>^M$</code> at the end of each line; fix the data with <code>dos2unix</code> or <code>sed -i 's/\\r$//' file</code>, or strip it in the script with <code>\${var%$'\\r'}</code>. The same <code>\\r</code> at the end of the shebang line is what produces <code>/usr/bin/env: 'bash\\r': No such file or directory</code>.</p>
<p>A fourth, related trap: a command inside the loop that reads from standard input (<code>ssh</code>, <code>ffmpeg</code>, <code>cat</code>) swallows the rest of the file, and the loop ends after one line. Tested with a three-line <code>hosts</code> file and a <code>cat &gt;/dev/null</code> in the body: only <code>host=h1</code> printed; with <code>&lt;/dev/null</code> on that command all three did. Use <code>ssh -n</code>, <code>ffmpeg -nostdin</code>, or read the loop from another descriptor (<code>while read -r h &lt;&amp;3; do …; done 3&lt; hosts</code>).</p>
<h3>mapfile: a file into an array</h3>
<pre><code class="language-bash">mapfile -t lines &lt; input.txt         <span class="tok-comment"># -t strips the trailing newlines</span>
echo "\${#lines[@]} lines"
echo "\${lines[0]}"

mapfile -t files &lt; &lt;(find . -name "*.ts")
printf '%s\\n' "\${files[@]}" | head -3</code></pre>
<div class="out">412 lines
import express from 'express';
./src/index.ts
./src/api/user.ts
./src/lib/db.ts</div>
<p><code>mapfile</code> (also spelled <code>readarray</code>) is the correct replacement for <code>files=\$(ls)</code>. It gives you a real array with one element per line, so filenames with spaces are preserved and you can index, count and slice it. Bash 4+ only, which in practice means everywhere except macOS's system bash.</p>

<h3>break, continue, and loop redirection</h3>
<pre><code class="language-bash">for f in *.log; do
  [[ -s \$f ]] || continue           <span class="tok-comment"># skip empty files</span>
  grep -q FATAL "\$f" &amp;&amp; { echo "fatal in \$f"; break; }
done

<span class="tok-comment"># Redirect the WHOLE loop's output once, not per iteration</span>
for f in *.log; do
  echo "=== \$f ==="
  head -3 "\$f"
done &gt; summary.txt</code></pre>
<p>Putting the redirection after <code>done</code> opens the file once for the entire loop. Writing <code>&gt;&gt; summary.txt</code> inside the body instead reopens it on every iteration — correct, but measurably slower and easy to get wrong by using <code>&gt;</code> and truncating each time.</p>

<h3>Functions</h3>
${slide('lx-06', 28, 'Hàm: local, return là mã thoát, dữ liệu qua stdout')}
<pre><code class="language-bash">log() {
  echo "[\$(date +%T)] \$*" &gt;&amp;2      <span class="tok-comment"># diagnostics go to stderr</span>
}

deploy() {
  local env="\$1"                    <span class="tok-comment"># local: scoped to this function</span>
  local -r timeout="\${2:-30}"       <span class="tok-comment"># -r makes it read-only</span>

  [[ -n \$env ]] || { log "env required"; return 2; }

  log "deploying to \$env (timeout \${timeout}s)"
  return 0
}

deploy staging || echo "failed with \$?"</code></pre>
<div class="out">[14:02:11] deploying to staging (timeout 30s)</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>local</code></span><span class="v">Without it, every variable is <strong>global</strong> — so a function's loop counter <code>i</code> silently clobbers the caller's <code>i</code>. Declare every function variable <code>local</code>.</span></div>
  <div class="kv"><span class="k"><code>return N</code></span><span class="v">Sets the exit code, 0–255. It is <strong>not</strong> a return value in the programming sense.</span></div>
  <div class="kv"><span class="k">"Returning" data</span><span class="v">Print it to stdout and capture with <code>result=\$(myfunc)</code>. That is why <code>log</code> above writes to stderr — so it never contaminates a caller's capture.</span></div>
  <div class="kv"><span class="k">Arguments</span><span class="v"><code>\$1</code>, <code>\$2</code>, <code>"\$@"</code>, <code>\$#</code> — exactly like a script. <code>\$0</code> stays the script name, not the function's.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># The pattern: print the result, return the status</span>
get_branch() {
  local b
  b=\$(git rev-parse --abbrev-ref HEAD 2&gt;/dev/null) || return 1
  printf '%s\\n' "\$b"
}

if branch=\$(get_branch); then
  echo "on \$branch"
else
  echo "not a git repo" &gt;&amp;2
fi</code></pre>
<div class="callout warn">Note <code>local b</code> and the assignment on <strong>separate lines</strong>. Written as <code>local b=\$(git …)</code>, the exit code of <code>\$?</code> comes from <code>local</code> — which always succeeds — so the <code>|| return 1</code> never fires. This is the trap from Lesson 6.1, and functions are where it actually causes damage.</div>

<h3>Parallel loops</h3>
<pre><code><span class="tok-comment"># Sequential: 8 files × 3s = 24s</span>
for f in *.mp4; do ffmpeg -i "\$f" "\${f%.mp4}.webm"; done

<span class="tok-comment"># Parallel with &amp; and wait — all at once (Lesson 5.4)</span>
for f in *.mp4; do
  ffmpeg -i "\$f" "\${f%.mp4}.webm" &amp;
done
wait

<span class="tok-comment"># Bounded parallelism with xargs -P — usually the right answer</span>
printf '%s\\0' *.mp4 | xargs -0 -P 4 -I{} ffmpeg -i {} {}.webm</code></pre>
<div class="callout">The bare <code>&amp;</code> version starts <em>every</em> file at once — fine for eight, catastrophic for eight hundred, because the machine runs out of memory or file descriptors. <code>xargs -P 4</code> keeps exactly four running (Lesson 3.2), which is what you want on a machine you care about. Use <code>-P \$(nproc)</code> to match the core count.</div>

<h3>A complete example</h3>
<pre><code class="language-bash">#!/usr/bin/env bash
<span class="tok-comment"># Summarise every log file: name, size, error count</span>

summarise() {
  local file="\$1" errors
  errors=\$(grep -c ERROR "\$file" 2&gt;/dev/null) || errors=0
  printf '%-20s %8s %6s errors\\n' \\
    "\${file##*/}" "\$(du -h "\$file" | cut -f1)" "\$errors"
}

shopt -s nullglob                    <span class="tok-comment"># no matches → loop runs zero times</span>
for f in /var/log/*.log; do
  [[ -r \$f ]] || continue           <span class="tok-comment"># skip what we cannot read</span>
  summarise "\$f"
done | sort -k3 -rn</code></pre>
<div class="out">syslog                   4.2M     41 errors
auth.log                 1.1M      7 errors
kern.log                 892K      0 errors</div>
<p>Every technique from this chapter is in those fifteen lines: <code>local</code>, quoted expansions, <code>\${file##*/}</code>, a guard with <code>continue</code>, <code>nullglob</code>, a function printing to stdout, and the whole loop piped once into <code>sort</code>.</p>

<h3>Ranges, mapfile and nested loops: the flags</h3>
<table>
<tr><th>Form</th><th>Does</th><th>Tested (bash 5.2)</th></tr>
<tr><td><code>{1..5}</code> · <code>{a..e}</code></td><td>fixed range of numbers / letters</td><td><code>1 2 3 4 5</code> · <code>a b c d e</code></td></tr>
<tr><td><code>{01..10..3}</code></td><td>zero-padded, step 3 (bash 4+)</td><td><code>01 04 07 10</code></td></tr>
<tr><td><code>x{,.bak}</code></td><td>with and without a suffix</td><td><code>x x.bak</code> — <code>cp f{,.bak}</code> makes a backup</td></tr>
<tr><td><code>seq -w 8 10</code></td><td>range from variables, equal width</td><td><code>08 09 10</code></td></tr>
<tr><td><code>mapfile -t arr &lt; f</code></td><td>one line per element, newline removed</td><td>without <code>-t</code> every element keeps its <code>\\n</code></td></tr>
<tr><td><code>mapfile -s 1 -n 2</code></td><td>skip 1 line, read at most 2</td><td><code>l1..l4</code> → <code>l2 l3</code></td></tr>
<tr><td><code>mapfile -d ''</code></td><td>split on NUL (pairs with <code>find -print0</code>)</td><td><code>a</code>, <code>b c</code></td></tr>
<tr><td><code>continue 2</code> · <code>break 2</code></td><td>act on the OUTER loop</td><td><code>continue 2</code> prints <code>1a 2a</code>; <code>break 2</code> stops everything at <code>i=2</code></td></tr>
</table>
<p>Measured on the practice machine: four <code>sleep 1</code> one after another took 4.0 s; the same four started with <code>&amp;</code> and a <code>wait</code> took 1.0 s; eight jobs through <code>xargs -0 -P 4</code> took 2.0 s — exactly four at a time. Bounded parallelism (and <code>wait -n</code>, GNU <code>parallel</code>) gets its own lesson in Chapter 13.</p>

<h3>On macOS and WSL</h3>
<pre><code>/bin/bash -c 'mapfile -t a &lt; /etc/hosts'
/bin/bash -c 'echo {01..03} {1..10..3}'
zsh -f -c 'for f in *.csv; do echo $f; done; echo "rc=$?"'</code></pre>
<div class="out">/bin/bash: mapfile: command not found
1 2 3 {1..10..3}
zsh:1: no matches found: *.csv</div>
<p>On the Mac's bash 3.2 there is no <code>mapfile</code> (use a <code>while IFS= read -r</code> loop that appends <code>arr+=("$line")</code>), zero-padding is silently ignored and a step is not understood at all. zsh refuses to run a command whose glob matches nothing (<code>NOMATCH</code>), so the script stops instead of looping over the literal <code>*.csv</code> — safer, but different from bash. <strong>WSL</strong> is Ubuntu; its trap is the <code>\\r</code> above whenever a file crosses from Windows.</p>
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> the list of servers for tonight's maintenance was edited in Notepad by a teammate, one name has a space, the file ends without a newline, and the loop "only processes some of them". Make the loop count every server and the errors correctly.</p><ol>
<li><code>cd ~/thu-linux/ch6 &amp;&amp; printf 'web 1\\r\\ndb\\r\\ncache' &gt; servers.txt &amp;&amp; cat -A servers.txt</code> — find the <code>^M</code> and the missing final <code>$</code>.</li>
<li>Write <code>loop.sh</code> with a function <code>check() { local name=$1; … }</code> that prints <code>[name]</code> and returns 1 if the name contains a space; read the file with <code>while IFS= read -r s || [[ -n $s ]]</code> and strip <code>\${s%$'\\r'}</code>.</li>
<li>Count servers and failures in variables inside the loop, and print both AFTER the loop — first with <code>cat servers.txt | while …</code>, then with <code>done &lt; servers.txt</code>.</li>
<li>Call <code>check</code> from a loop that itself uses <code>name</code> as its variable, and prove <code>local</code> protects it.</li>
</ol>
<p><strong>Done when:</strong> <code>bash loop.sh</code> prints <code>[web 1]</code> <code>[db]</code> <code>[cache]</code> with no stray <code>\\r</code>, then <code>3 servers, 1 failed</code> in the <code>done &lt; file</code> version while the pipe version prints <code>0 servers, 0 failed</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Glob loop</span><span class="v"><code>for f in *.log</code>: the shell hands the loop correctly split file names.</span></div>
  <div class="kv"><span class="k">Brace range</span><span class="v"><code>{1..5}</code>: generated before variables, so the bounds must be literal.</span></div>
  <div class="kv"><span class="k">Process substitution</span><span class="v"><code>&lt;(cmd)</code>: a command's output as a file name, so the loop stays in the current shell.</span></div>
  <div class="kv"><span class="k">CRLF</span><span class="v">Windows line ending <code>\\r\\n</code>; bash keeps the <code>\\r</code> as part of the data.</span></div>
  <div class="kv"><span class="k">local</span><span class="v">Makes a variable belong to the function; without it every variable is global.</span></div>
  <div class="kv"><span class="k">Return status</span><span class="v"><code>return N</code> sets the function's exit code 0–255; data goes out on stdout.</span></div>
  <div class="kv"><span class="k">mapfile / readarray</span><span class="v">Reads lines into an array; bash 4+ only.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Loop over files with a glob (plus a <code>[[ -e ]]</code> guard or <code>nullglob</code>), never over <code>$(ls)</code>; use <code>find -print0</code> for recursion.</li>
<li>Read lines with <code>while IFS= read -r line</code>; add <code>|| [[ -n $line ]]</code> for a last line without a newline.</li>
<li>Feed loops with <code>&lt; file</code> or <code>&lt; &lt;(cmd)</code>, not a pipe, or variables set inside are lost.</li>
<li>Data from Windows carries <code>\\r</code>: check with <code>cat -A</code>, strip with <code>\${v%$'\\r'}</code> or <code>dos2unix</code>.</li>
<li>Functions: <code>local</code> for every variable, <code>return</code> for status, stdout for data, declaration and <code>$( )</code> on separate lines.</li>
<li>bash 3.2 on the Mac has no <code>mapfile</code> and no padded or stepped ranges; zsh stops on an unmatched glob.</li>
</ul>
<a class="link-card" href="https://mywiki.wooledge.org/BashFAQ/001" target="_blank" rel="noopener">
  <span class="lc-ico">🔧</span>
  <span class="lc-body"><span class="lc-title">BashFAQ 001 — "How can I read a file line by line?"</span><span class="lc-sub">Explains every part of <code>while IFS= read -r line</code> and what breaks when you drop each piece. The single most useful FAQ entry there is.</span></span>
</a>
<a class="link-card" href="https://mywiki.wooledge.org/ParsingLs" target="_blank" rel="noopener">
  <span class="lc-ico">⚠️</span>
  <span class="lc-body"><span class="lc-title">Greg's Wiki — Why you shouldn't parse the output of ls</span><span class="lc-sub">Every way it fails, with reproductions, and the correct alternative for each case. Convincing rather than dogmatic.</span></span>
</a>
<a class="link-card" href="https://www.gnu.org/software/bash/manual/html_node/Shell-Functions.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Bash Manual — Shell Functions</span><span class="lc-sub">Scoping rules, <code>local</code>, <code>return</code>, and how functions interact with <code>trap</code> and subshells.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: loops that survive bad filenames</span><span class="lc-sub">Graded tasks on a directory of hostile names: glob loops, <code>while IFS= read -r</code>, <code>mapfile</code>, and a function that returns both data and a status.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> forgetting <code>local</code>. A function that uses <code>i</code>, <code>tmp</code> or <code>file</code> without declaring it writes to a <em>global</em> variable — so calling that function from inside a loop over <code>i</code> silently resets the loop counter, and you get an infinite loop or a skipped range with no error anywhere. It is the single most common bug in longer bash scripts, and it hides because it only appears when two pieces of code happen to pick the same variable name. Declare every function-local variable with <code>local</code>, without exception.</div>
<p class="note-ct"><strong>Memorise these two lines and you will not write a broken loop again:</strong> <code>for f in *.log; do … done</code> for files, and <code>while IFS= read -r line; do … done &lt; file</code> for lines. Every deviation — <code>\$(ls)</code>, a bare <code>read</code>, a pipe into the loop — reintroduces a bug that these two forms already solved.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.5</span>
<h2>Vòng lặp và hàm</h2>
<p class="lead">Vòng lặp là chỗ mọi luật về dấu nháy của chương này được đem ra dùng, và cũng là chỗ những lỗi shell kinh điển cư ngụ. Có đúng MỘT cách đúng để lặp qua các file, đúng MỘT cách đúng để lặp qua các dòng, và cả hai đều trông hơi lạ cho tới khi bạn biết chúng đang phòng thủ trước cái gì.</p>

<h3>for: qua một danh sách</h3>
${slide('lx-06', 24, 'for qua glob, mảng, khoảng — {1..$n} không chạy')}
<pre><code class="language-bash"><span class="tok-comment"># Qua một glob — shell khai triển nó thành các từ giúp bạn (Bài 2.2)</span>
for f in *.log; do
  [[ -e \$f ]] || continue          <span class="tok-comment"># chốt chặn: glob không khớp thì truyền qua nguyên văn</span>
  echo "đang xử lý \$f"
done

<span class="tok-comment"># Qua một mảng — @ CÓ NHÁY, luôn luôn</span>
for f in "\${files[@]}"; do echo "[\$f]"; done

<span class="tok-comment"># Qua các tham số</span>
for arg in "\$@"; do echo "\$arg"; done

<span class="tok-comment"># Qua một khoảng số</span>
for i in {1..5}; do echo "\$i"; done
for ((i = 0; i &lt; 5; i++)); do echo "\$i"; done   <span class="tok-comment"># kiểu C, khi cận là một biến</span></code></pre>
<div class="out">đang xử lý app.log
đang xử lý db.log
1
2
3
4
5</div>
<div class="callout warn">Khoảng trong ngoặc nhọn được khai triển TRƯỚC biến, nên <code>for i in {1..\$n}</code> <strong>KHÔNG</strong> chạy — nó sinh ra đúng chuỗi chữ <code>{1..5}</code>. Hãy dùng dạng kiểu C <code>for ((i=1; i&lt;=n; i++))</code> khi cận là một biến, hoặc dùng <code>seq</code>. Chỗ này bẫy người ta vì bản dùng số cố định thì chạy hoàn hảo.</div>

<h3>Luật số một: đừng phân tích output của ls</h3>
${slide('lx-06', 25, 'Đừng lặp trên $(ls)')}
<pre><code class="language-bash"><span class="tok-comment"># SAI — vỡ với mọi tên file có dấu cách hoặc ký tự glob</span>
for f in \$(ls *.txt); do rm "\$f"; done

<span class="tok-comment"># ĐÚNG — shell đã đưa cho bạn một danh sách cắt sẵn cho đúng</span>
for f in *.txt; do rm -- "\$f"; done

<span class="tok-comment"># ĐÚNG — cho mọi thứ đệ quy, phân cách bằng NUL (Bài 2.3)</span>
find . -name "*.txt" -print0 | while IFS= read -r -d '' f; do
  rm -- "\$f"
done</code></pre>
<p><code>ls</code> sinh ra văn bản cho CON NGƯỜI đọc. Output của nó đi qua phép cắt từ (Bài 6.2), nên <code>my file.txt</code> thành hai vòng lặp, và một file tên là <code>*</code> khai triển thành mọi thứ trong thư mục. Một cái glob không gặp vấn đề này vì shell đưa cho vòng lặp một danh sách từ tử tế, đã được cắt đúng ngay từ trong thiết kế.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">File ở đây</span><span class="lz-lnote"><code>for f in *.log</code> — shell cắt cái glob cho đúng ngay từ trong thiết kế. Thêm một chốt <code>[[ -e \$f ]]</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">File ở bất cứ đâu</span><span class="lz-lnote"><code>find … -print0 | while IFS= read -r -d '' f</code> — phân cách bằng NUL, an toàn với mọi tên file có thể có.</span></div>
  <div class="lz-layer"><span class="lz-lname">Các dòng của một file</span><span class="lz-lnote"><code>while IFS= read -r line; do … done &lt; file</code> — chuyển hướng, đừng bao giờ đưa qua ống, không thì vòng lặp mất biến.</span></div>
  <div class="lz-layer"><span class="lz-lname">Các dòng của một lệnh</span><span class="lz-lnote"><code>done &lt; &lt;(lệnh)</code> — thay thế tiến trình giữ vòng lặp lại trong shell hiện tại.</span></div>
  <div class="lz-layer"><span class="lz-lname">Vào một mảng</span><span class="lz-lnote"><code>mapfile -t arr &lt; file</code> — thứ thay thế ĐÚNG cho <code>arr=\$(ls)</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">Không bao giờ</span><span class="lz-lnote"><code>for f in \$(ls)</code> — phép cắt từ biến một tên file thành nhiều cái và khai triển mọi ký tự glob trong đó.</span></div>
</div>
<h3>while read: qua các dòng</h3>
${slide('lx-06', 26, 'while IFS= read -r: giữ thụt lề, \\ và dòng cuối')}
<pre><code class="language-bash">while IFS= read -r line; do
  echo "[\$line]"
done &lt; input.txt</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>IFS=</code></span><span class="v">Để rỗng, nên khoảng trắng đầu và cuối mỗi dòng được <strong>GIỮ NGUYÊN</strong>. Không có nó, phần thụt lề bị âm thầm cắt mất.</span></div>
  <div class="kv"><span class="k"><code>-r</code></span><span class="v">Đừng diễn giải gạch chéo ngược. Không có nó, một dòng chứa <code>C:\\path</code> sẽ bị làm méo.</span></div>
  <div class="kv"><span class="k"><code>&lt; input.txt</code></span><span class="v">Chuyển hướng chứ không đưa qua ống — <strong>KHÔNG có shell con</strong>, nên biến đặt bên trong vòng lặp sống sót (Bài 3.2).</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Đọc các trường từ một file có dấu phân cách</span>
while IFS=, read -r name email role; do
  echo "\$name &lt;\$email&gt; là \$role"
done &lt; users.csv

<span class="tok-comment"># Đọc từ một lệnh, mà không đánh mất biến vào một shell con</span>
count=0
while IFS= read -r line; do
  ((count++))
done &lt; &lt;(grep ERROR app.log)
echo "\$count lỗi"</code></pre>
<div class="out">Binh &lt;binh@example.com&gt; là admin
An &lt;an@example.com&gt; là editor
37 lỗi</div>
<div class="callout ok">Cái <code>&lt; &lt;(lệnh)</code> đó là thay thế tiến trình (Bài 3.2), và nó chính là cách chữa cho bẫy shell con: <code>cmd | while read …</code> chạy vòng lặp trong một tiến trình con, nên <code>count</code> mất trắng. Đọc từ <code>&lt;(cmd)</code> giữ vòng lặp lại trong shell hiện tại. Thêm hai ký tự, và cái biến sống sót.</div>

<h3>Ba cách một vòng lặp đọc dòng âm thầm đánh mất dữ liệu</h3>
${slide('lx-06', 27, 'Ống dẫn chạy vòng lặp trong shell con; ký tự \\r của Windows')}
<p>Cả ba đều đã dựng lại trong container Ubuntu; không cái nào in ra lỗi.</p>
<pre><code class="language-bash"><span class="tok-comment"># 1 · ống dẫn chạy vòng lặp trong shell con — biến đếm chết theo nó</span>
count=0; printf 'ERROR a\\nok\\nERROR b\\n' | while IFS= read -r l; do [[ $l == ERROR* ]] &amp;&amp; ((count++)); done; echo "pipe: $count"
count=0; while IFS= read -r l; do [[ $l == ERROR* ]] &amp;&amp; ((count++)); done &lt; &lt;(printf 'ERROR a\\nok\\nERROR b\\n'); echo "procsub: $count"

<span class="tok-comment"># 2 · dòng cuối không có ký tự xuống dòng — read trả 1 và vòng lặp bỏ qua nó</span>
printf 'mot\\nhai' &gt; nonl.txt
while IFS= read -r l; do printf '[%s]\\n' "$l"; done &lt; nonl.txt
while IFS= read -r l || [[ -n $l ]]; do printf '[%s]\\n' "$l"; done &lt; nonl.txt

<span class="tok-comment"># 3 · file lưu trên Windows kết thúc mỗi dòng bằng \\r</span>
printf 'prod\\r\\n' &gt; env.txt; read -r e &lt; env.txt
[[ $e == prod ]] &amp;&amp; echo khop || { echo "KHONG khop:"; printf '%s' "$e" | od -c | head -1; }
e=\${e%$'\\r'}; [[ $e == prod ]] &amp;&amp; echo "after removing \\r: khop"</code></pre>
<div class="out">pipe: 0
procsub: 2
[mot]
[mot]
[hai]
KHONG khop:
0000000   p   r   o   d  \\r
after removing \\r: khop</div>
<p>Trường hợp 3 là cái các bạn cùng nhóm dùng Windows hay dính: một file <code>.env</code> hay danh sách máy sửa bằng Notepad nhìn qua <code>cat</code> thì y hệt, nhưng mọi phép so sánh đều sai. <code>cat -A</code> hiện nó thành <code>^M$</code> ở cuối mỗi dòng; sửa dữ liệu bằng <code>dos2unix</code> hoặc <code>sed -i 's/\\r$//' file</code>, hoặc gỡ ngay trong script bằng <code>\${var%$'\\r'}</code>. Cũng chính <code>\\r</code> đó ở cuối dòng shebang sinh ra lỗi <code>/usr/bin/env: 'bash\\r': No such file or directory</code>.</p>
<p>Bẫy thứ tư, họ hàng với ba bẫy trên: một lệnh bên trong vòng lặp mà đọc đầu vào chuẩn (<code>ssh</code>, <code>ffmpeg</code>, <code>cat</code>) sẽ nuốt hết phần còn lại của file, và vòng lặp dừng sau một dòng. Đã thử với file <code>hosts</code> ba dòng và một lệnh <code>cat &gt;/dev/null</code> trong thân vòng lặp: chỉ in ra <code>host=h1</code>; thêm <code>&lt;/dev/null</code> cho lệnh đó thì in đủ ba. Dùng <code>ssh -n</code>, <code>ffmpeg -nostdin</code>, hoặc cho vòng lặp đọc từ một bộ mô tả khác (<code>while read -r h &lt;&amp;3; do …; done 3&lt; hosts</code>).</p>
<h3>mapfile: một file vào một mảng</h3>
<pre><code class="language-bash">mapfile -t lines &lt; input.txt         <span class="tok-comment"># -t cắt bỏ ký tự xuống dòng ở cuối</span>
echo "\${#lines[@]} dòng"
echo "\${lines[0]}"

mapfile -t files &lt; &lt;(find . -name "*.ts")
printf '%s\\n' "\${files[@]}" | head -3</code></pre>
<div class="out">412 dòng
import express from 'express';
./src/index.ts
./src/api/user.ts
./src/lib/db.ts</div>
<p><code>mapfile</code> (còn viết là <code>readarray</code>) chính là thứ thay thế đúng cho <code>files=\$(ls)</code>. Nó cho bạn một MẢNG thật với mỗi dòng một phần tử, nên tên file có dấu cách được giữ nguyên và bạn đánh chỉ số, đếm, cắt lát nó được. Chỉ có từ bash 4 trở lên, mà trong thực tế nghĩa là có ở mọi nơi trừ bash hệ thống của macOS.</p>

<h3>break, continue, và chuyển hướng cả vòng lặp</h3>
<pre><code class="language-bash">for f in *.log; do
  [[ -s \$f ]] || continue           <span class="tok-comment"># bỏ qua file rỗng</span>
  grep -q FATAL "\$f" &amp;&amp; { echo "có FATAL trong \$f"; break; }
done

<span class="tok-comment"># Chuyển hướng output của CẢ vòng lặp một lần, không phải mỗi vòng một lần</span>
for f in *.log; do
  echo "=== \$f ==="
  head -3 "\$f"
done &gt; summary.txt</code></pre>
<p>Đặt phép chuyển hướng sau chữ <code>done</code> sẽ mở file đúng MỘT lần cho cả vòng lặp. Viết <code>&gt;&gt; summary.txt</code> bên trong thân vòng lặp thì nó mở lại file ở mỗi vòng — vẫn đúng, nhưng chậm hơn một cách đo được và dễ viết sai thành <code>&gt;</code> rồi cắt trắng file mỗi lần.</p>

<h3>Hàm</h3>
${slide('lx-06', 28, 'Hàm: local, return là mã thoát, dữ liệu qua stdout')}
<pre><code class="language-bash">log() {
  echo "[\$(date +%T)] \$*" &gt;&amp;2      <span class="tok-comment"># thông báo chẩn đoán đi ra stderr</span>
}

deploy() {
  local env="\$1"                    <span class="tok-comment"># local: chỉ nằm trong hàm này</span>
  local -r timeout="\${2:-30}"       <span class="tok-comment"># -r làm nó thành chỉ-đọc</span>

  [[ -n \$env ]] || { log "cần có env"; return 2; }

  log "đang deploy lên \$env (timeout \${timeout}s)"
  return 0
}

deploy staging || echo "hỏng với mã \$?"</code></pre>
<div class="out">[14:02:11] đang deploy lên staging (timeout 30s)</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>local</code></span><span class="v">Thiếu nó thì mọi biến đều là <strong>TOÀN CỤC</strong> — nên biến đếm <code>i</code> trong một hàm âm thầm giẫm lên biến <code>i</code> của người gọi. Hãy khai báo mọi biến của hàm là <code>local</code>.</span></div>
  <div class="kv"><span class="k"><code>return N</code></span><span class="v">Đặt MÃ THOÁT, từ 0 tới 255. Nó <strong>KHÔNG</strong> phải giá trị trả về theo nghĩa của lập trình.</span></div>
  <div class="kv"><span class="k">"Trả về" dữ liệu</span><span class="v">In nó ra stdout rồi hứng bằng <code>result=\$(myfunc)</code>. Đó là lý do hàm <code>log</code> ở trên ghi ra stderr — để nó không bao giờ làm bẩn phần hứng của người gọi.</span></div>
  <div class="kv"><span class="k">Tham số</span><span class="v"><code>\$1</code>, <code>\$2</code>, <code>"\$@"</code>, <code>\$#</code> — y hệt như trong một script. Riêng <code>\$0</code> vẫn là tên script, không phải tên hàm.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Khuôn mẫu: in ra kết quả, trả về trạng thái</span>
get_branch() {
  local b
  b=\$(git rev-parse --abbrev-ref HEAD 2&gt;/dev/null) || return 1
  printf '%s\\n' "\$b"
}

if branch=\$(get_branch); then
  echo "đang ở nhánh \$branch"
else
  echo "không phải kho git" &gt;&amp;2
fi</code></pre>
<div class="callout warn">Để ý <code>local b</code> và phép gán nằm trên <strong>HAI DÒNG RIÊNG</strong>. Viết thành <code>local b=\$(git …)</code> thì mã trong <code>\$?</code> đến từ lệnh <code>local</code> — thứ luôn thành công — nên <code>|| return 1</code> không bao giờ kích hoạt. Đây chính là cái bẫy ở Bài 6.1, và hàm là nơi nó thật sự gây thiệt hại.</div>

<h3>Vòng lặp song song</h3>
<pre><code><span class="tok-comment"># Tuần tự: 8 file × 3 giây = 24 giây</span>
for f in *.mp4; do ffmpeg -i "\$f" "\${f%.mp4}.webm"; done

<span class="tok-comment"># Song song bằng &amp; và wait — tất cả cùng lúc (Bài 5.4)</span>
for f in *.mp4; do
  ffmpeg -i "\$f" "\${f%.mp4}.webm" &amp;
done
wait

<span class="tok-comment"># Song song có giới hạn bằng xargs -P — thường mới là câu trả lời đúng</span>
printf '%s\\0' *.mp4 | xargs -0 -P 4 -I{} ffmpeg -i {} {}.webm</code></pre>
<div class="callout">Bản dùng dấu <code>&amp;</code> trần khởi động <em>MỌI</em> file cùng một lúc — ổn với tám cái, thảm hoạ với tám trăm cái, vì máy sẽ cạn bộ nhớ hoặc cạn bộ mô tả file. <code>xargs -P 4</code> giữ đúng bốn cái chạy cùng lúc (Bài 3.2), và đó mới là thứ bạn muốn trên một cái máy mà bạn còn quan tâm. Dùng <code>-P \$(nproc)</code> để khớp với số nhân.</div>

<h3>Một ví dụ hoàn chỉnh</h3>
<pre><code class="language-bash">#!/usr/bin/env bash
<span class="tok-comment"># Tóm tắt mọi file log: tên, kích thước, số lỗi</span>

summarise() {
  local file="\$1" errors
  errors=\$(grep -c ERROR "\$file" 2&gt;/dev/null) || errors=0
  printf '%-20s %8s %6s lỗi\\n' \\
    "\${file##*/}" "\$(du -h "\$file" | cut -f1)" "\$errors"
}

shopt -s nullglob                    <span class="tok-comment"># không khớp gì → vòng lặp chạy 0 lần</span>
for f in /var/log/*.log; do
  [[ -r \$f ]] || continue           <span class="tok-comment"># bỏ qua thứ ta không đọc được</span>
  summarise "\$f"
done | sort -k3 -rn</code></pre>
<div class="out">syslog                   4.2M     41 lỗi
auth.log                 1.1M      7 lỗi
kern.log                 892K      0 lỗi</div>
<p>Mọi kỹ thuật của chương này đều nằm trong mười lăm dòng đó: <code>local</code>, các phép khai triển có nháy, <code>\${file##*/}</code>, một chốt chặn bằng <code>continue</code>, <code>nullglob</code>, một hàm in ra stdout, và cả vòng lặp được đưa qua ống vào <code>sort</code> đúng một lần.</p>

<h3>Khoảng số, mapfile và vòng lặp lồng nhau: các cờ</h3>
<table>
<tr><th>Dạng</th><th>Làm gì</th><th>Đã thử (bash 5.2)</th></tr>
<tr><td><code>{1..5}</code> · <code>{a..e}</code></td><td>khoảng cố định của số / chữ</td><td><code>1 2 3 4 5</code> · <code>a b c d e</code></td></tr>
<tr><td><code>{01..10..3}</code></td><td>đệm số 0, bước 3 (bash 4+)</td><td><code>01 04 07 10</code></td></tr>
<tr><td><code>x{,.bak}</code></td><td>có và không có hậu tố</td><td><code>x x.bak</code> — <code>cp f{,.bak}</code> là tạo bản sao lưu</td></tr>
<tr><td><code>seq -w 8 10</code></td><td>khoảng lấy từ biến, cùng độ rộng</td><td><code>08 09 10</code></td></tr>
<tr><td><code>mapfile -t arr &lt; f</code></td><td>mỗi dòng một phần tử, bỏ ký tự xuống dòng</td><td>thiếu <code>-t</code> thì phần tử nào cũng còn <code>\\n</code></td></tr>
<tr><td><code>mapfile -s 1 -n 2</code></td><td>bỏ 1 dòng đầu, đọc tối đa 2</td><td><code>l1..l4</code> → <code>l2 l3</code></td></tr>
<tr><td><code>mapfile -d ''</code></td><td>tách theo NUL (đi cặp với <code>find -print0</code>)</td><td><code>a</code>, <code>b c</code></td></tr>
<tr><td><code>continue 2</code> · <code>break 2</code></td><td>tác động lên vòng lặp NGOÀI</td><td><code>continue 2</code> in <code>1a 2a</code>; <code>break 2</code> dừng tất cả ở <code>i=2</code></td></tr>
</table>
<p>Đo trên máy thực hành: bốn lệnh <code>sleep 1</code> nối tiếp nhau mất 4,0 giây; cũng bốn lệnh đó chạy bằng <code>&amp;</code> rồi <code>wait</code> mất 1,0 giây; tám việc qua <code>xargs -0 -P 4</code> mất 2,0 giây — đúng bốn việc một lúc. Chạy song song có giới hạn (cùng <code>wait -n</code>, GNU <code>parallel</code>) có bài riêng ở Chương 13.</p>

<h3>Trên macOS và WSL khác gì</h3>
<pre><code>/bin/bash -c 'mapfile -t a &lt; /etc/hosts'
/bin/bash -c 'echo {01..03} {1..10..3}'
zsh -f -c 'for f in *.csv; do echo $f; done; echo "rc=$?"'</code></pre>
<div class="out">/bin/bash: mapfile: command not found
1 2 3 {1..10..3}
zsh:1: no matches found: *.csv</div>
<p>bash 3.2 của Mac không có <code>mapfile</code> (thay bằng một vòng <code>while IFS= read -r</code> nối thêm <code>arr+=("$line")</code>), âm thầm bỏ qua phần đệm số 0 và hoàn toàn không hiểu bước nhảy. zsh từ chối chạy một lệnh có glob không khớp gì (<code>NOMATCH</code>), nên script dừng lại thay vì lặp qua chữ <code>*.csv</code> — an toàn hơn, nhưng khác bash. <strong>WSL</strong> là Ubuntu; cái bẫy của nó là ký tự <code>\\r</code> ở trên, mỗi khi một file đi từ Windows sang.</p>
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> danh sách máy chủ cho đợt bảo trì tối nay do một bạn sửa bằng Notepad, một cái tên có dấu cách, file kết thúc mà không có ký tự xuống dòng, và vòng lặp "chỉ xử lý được một vài máy". Làm cho vòng lặp đếm đúng mọi máy và mọi lỗi.</p><ol>
<li><code>cd ~/thu-linux/ch6 &amp;&amp; printf 'web 1\\r\\ndb\\r\\ncache' &gt; servers.txt &amp;&amp; cat -A servers.txt</code> — tìm các <code>^M</code> và dấu <code>$</code> bị thiếu ở dòng cuối.</li>
<li>Viết <code>loop.sh</code> có hàm <code>check() { local name=$1; … }</code> in <code>[name]</code> và trả về 1 nếu tên chứa dấu cách; đọc file bằng <code>while IFS= read -r s || [[ -n $s ]]</code> và gỡ <code>\${s%$'\\r'}</code>.</li>
<li>Đếm số máy và số lỗi bằng biến bên trong vòng lặp, rồi in cả hai SAU vòng lặp — lần đầu với <code>cat servers.txt | while …</code>, lần sau với <code>done &lt; servers.txt</code>.</li>
<li>Gọi <code>check</code> từ một vòng lặp mà chính nó cũng dùng biến <code>name</code>, và chứng minh <code>local</code> bảo vệ được nó.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>bash loop.sh</code> in <code>[web 1]</code> <code>[db]</code> <code>[cache]</code> không còn <code>\\r</code> thừa, rồi <code>3 servers, 1 failed</code> ở bản <code>done &lt; file</code>, trong khi bản dùng ống dẫn in <code>0 servers, 0 failed</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Glob loop (vòng lặp qua glob)</span><span class="v"><code>for f in *.log</code>: shell đưa cho vòng lặp những tên file đã cắt đúng.</span></div>
  <div class="kv"><span class="k">Brace range (khoảng ngoặc nhọn)</span><span class="v"><code>{1..5}</code>: sinh ra TRƯỚC biến, nên hai đầu phải là số viết thẳng.</span></div>
  <div class="kv"><span class="k">Process substitution (thay thế tiến trình)</span><span class="v"><code>&lt;(lệnh)</code>: output của lệnh dưới dạng tên file, để vòng lặp ở lại shell hiện tại.</span></div>
  <div class="kv"><span class="k">CRLF (xuống dòng kiểu Windows)</span><span class="v">Cặp <code>\\r\\n</code>; bash giữ <code>\\r</code> lại như một phần dữ liệu.</span></div>
  <div class="kv"><span class="k">local (biến cục bộ)</span><span class="v">Cho biến thuộc về hàm; thiếu nó thì mọi biến đều toàn cục.</span></div>
  <div class="kv"><span class="k">Return status (trạng thái trả về)</span><span class="v"><code>return N</code> đặt mã thoát 0–255 của hàm; dữ liệu đi ra qua stdout.</span></div>
  <div class="kv"><span class="k">mapfile / readarray (đọc vào mảng)</span><span class="v">Đọc các dòng vào một mảng; chỉ có từ bash 4.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Lặp qua file bằng glob (kèm chốt <code>[[ -e ]]</code> hoặc <code>nullglob</code>), không bao giờ qua <code>$(ls)</code>; đệ quy thì dùng <code>find -print0</code>.</li>
<li>Đọc dòng bằng <code>while IFS= read -r line</code>; thêm <code>|| [[ -n $line ]]</code> cho dòng cuối không có ký tự xuống dòng.</li>
<li>Cấp dữ liệu cho vòng lặp bằng <code>&lt; file</code> hoặc <code>&lt; &lt;(lệnh)</code>, không bằng ống dẫn, kẻo biến đặt bên trong bị mất.</li>
<li>Dữ liệu từ Windows mang theo <code>\\r</code>: soi bằng <code>cat -A</code>, gỡ bằng <code>\${v%$'\\r'}</code> hoặc <code>dos2unix</code>.</li>
<li>Hàm: <code>local</code> cho mọi biến, <code>return</code> cho trạng thái, stdout cho dữ liệu, khai báo và <code>$( )</code> trên hai dòng riêng.</li>
<li>bash 3.2 trên Mac không có <code>mapfile</code> và không có khoảng đệm số hay có bước; zsh dừng lại khi glob không khớp.</li>
</ul>
<a class="link-card" href="https://mywiki.wooledge.org/BashFAQ/001" target="_blank" rel="noopener">
  <span class="lc-ico">🔧</span>
  <span class="lc-body"><span class="lc-title">BashFAQ 001 — "Đọc một file từng dòng thế nào?"</span><span class="lc-sub">Giải thích từng phần của <code>while IFS= read -r line</code> và chuyện gì hỏng khi bạn bỏ đi từng mảnh. Mục FAQ hữu ích nhất từng có.</span></span>
</a>
<a class="link-card" href="https://mywiki.wooledge.org/ParsingLs" target="_blank" rel="noopener">
  <span class="lc-ico">⚠️</span>
  <span class="lc-body"><span class="lc-title">Greg's Wiki — Vì sao đừng phân tích output của ls</span><span class="lc-sub">Mọi cách nó vỡ, kèm cách dựng lại, và phương án đúng cho từng trường hợp. Thuyết phục chứ không giáo điều.</span></span>
</a>
<a class="link-card" href="https://www.gnu.org/software/bash/manual/html_node/Shell-Functions.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Bash Manual — Shell Functions</span><span class="lc-sub">Luật phạm vi biến, <code>local</code>, <code>return</code>, và hàm tương tác thế nào với <code>trap</code> và shell con.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: những vòng lặp sống sót qua tên file hiểm ác</span><span class="lc-sub">Bài chấm điểm trên một thư mục toàn tên hiểm: vòng lặp qua glob, <code>while IFS= read -r</code>, <code>mapfile</code>, và một hàm vừa trả dữ liệu vừa trả trạng thái.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> quên <code>local</code>. Một hàm dùng <code>i</code>, <code>tmp</code> hay <code>file</code> mà không khai báo sẽ ghi vào một biến <em>TOÀN CỤC</em> — nên gọi hàm đó từ bên trong một vòng lặp chạy trên <code>i</code> sẽ âm thầm đặt lại biến đếm, và bạn nhận được một vòng lặp vô tận hoặc một khoảng bị nhảy cóc, chẳng có lỗi nào ở đâu cả. Đây là lỗi phổ biến nhất trong những script bash dài, và nó ẩn mình vì chỉ lộ ra khi hai đoạn mã tình cờ chọn trùng tên biến. Hãy khai báo mọi biến cục bộ của hàm bằng <code>local</code>, không ngoại lệ.</div>
<p class="note-ct"><strong>Thuộc hai dòng này thì bạn sẽ không viết ra một vòng lặp hỏng nữa:</strong> <code>for f in *.log; do … done</code> cho file, và <code>while IFS= read -r line; do … done &lt; file</code> cho dòng. Mọi sai lệch khỏi hai dạng đó — <code>\$(ls)</code>, một lệnh <code>read</code> trần, một cái ống dẫn vào vòng lặp — đều đưa trở lại một lỗi mà hai dạng này đã giải xong.</p>
</div>
`,
    },
    /* ─────────────────────────── 6.6 Quiz ─────────────────────────── */
    {
      title: '6.6 — Chapter 6 quiz|||6.6 — Kiểm tra Chương 6',
      slug: 'lnx-6-6-quiz',
      type: 'QUIZ',
      description: 'Mười câu tình huống: đọc một dòng bash và đoán nó in gì — thứ tự khai triển, cắt từ, "$@", ${var…}, mã thoát, [ ] với [[ ]], vòng lặp qua ống dẫn, local, dấu & của bash 5.2 và bash 3.2 của Mac.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten questions, almost all of the form "what does this line really do". Every answer was run in an Ubuntu 24.04 container (bash 5.2) or on a Mac, and every explanation says why the most tempting wrong answer is wrong. Fifteen minutes.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can list bash's expansion order and explain why <code>{1..$n}</code> does not work.</li>
<li>I can predict how many arguments an unquoted <code>$var</code> or <code>$@</code> becomes.</li>
<li>I can use <code>\${v:-x}</code>, <code>\${v:?msg}</code>, <code>#</code>, <code>%</code> and <code>//</code> without looking them up.</li>
<li>I know why <code>[[ $a &gt; $b ]]</code> compares strings and what <code>[ $a &gt; $b ]</code> creates.</li>
<li>I can write a <code>while IFS= read -r</code> loop that keeps its variables and survives Windows line endings.</li>
<li>I know which of these features the Mac's <code>/bin/bash</code> 3.2 and zsh do differently.</li>
</ul>
${slide('lx-06', 30, 'Bảng tra nhanh Chương 6')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười câu, gần như câu nào cũng có dạng "dòng này THẬT SỰ làm gì". Mọi đáp án đã chạy thật trong container Ubuntu 24.04 (bash 5.2) hoặc trên Mac, và mọi lời giải thích đều nói vì sao phương án sai hấp dẫn nhất lại sai. Mười lăm phút.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi kể được thứ tự khai triển của bash và giải thích vì sao <code>{1..$n}</code> không chạy.</li>
<li>Tôi đoán được một <code>$var</code> hay <code>$@</code> không nháy sẽ thành bao nhiêu tham số.</li>
<li>Tôi dùng được <code>\${v:-x}</code>, <code>\${v:?msg}</code>, <code>#</code>, <code>%</code> và <code>//</code> mà không cần tra.</li>
<li>Tôi biết vì sao <code>[[ $a &gt; $b ]]</code> so sánh chuỗi và <code>[ $a &gt; $b ]</code> tạo ra cái gì.</li>
<li>Tôi viết được một vòng <code>while IFS= read -r</code> giữ được biến và chịu được kiểu xuống dòng của Windows.</li>
<li>Tôi biết tính năng nào ở trên mà <code>/bin/bash</code> 3.2 và zsh của Mac làm khác.</li>
</ul>
${slide('lx-06', 30, 'Bảng tra nhanh Chương 6')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'n=3; for i in {1..$n}; do echo "$i"; done — what does bash print?|||n=3; for i in {1..$n}; do echo "$i"; done — bash in ra gì?',
            options: [
              '1, 2 and 3 on three lines|||1, 2 và 3 trên ba dòng',
              'Nothing — the loop runs zero times|||Không gì cả — vòng lặp chạy 0 lần',
              'One line: {1..3}|||Một dòng: {1..3}',
              'An error: bad substitution|||Một lỗi: bad substitution',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Brace expansion is step 1, before variables exist, and {1..$n} is not a valid range, so it is left as text; step 3 then turns $n into 3 and the loop runs once with the literal {1..3} (tested). "1 2 3" is what zsh prints, because zsh expands braces after variables — which is exactly why testing a bash script in the Mac terminal misleads. Use for ((i=1; i<=n; i++)) or seq.|||VI: Khai triển ngoặc nhọn là bước 1, khi biến còn chưa có, mà {1..$n} không phải một khoảng hợp lệ nên nó bị để nguyên là chữ; bước 3 mới biến $n thành 3 và vòng lặp chạy MỘT lần với chữ {1..3} (đã thử). "1 2 3" là thứ zsh in ra, vì zsh khai triển ngoặc nhọn SAU biến — đúng lý do thử script bash trong terminal Mac dễ đánh lừa bạn. Hãy dùng for ((i=1; i<=n; i++)) hoặc seq.',
          },
          {
            question: 'v="a  b" (two spaces). What does printf "[%s]\\n" $v print?|||v="a  b" (hai dấu cách). printf "[%s]\\n" $v in ra gì?',
            options: [
              'Two lines: [a] and [b]|||Hai dòng: [a] và [b]',
              'One line: [a  b]|||Một dòng: [a  b]',
              'One line: [a b]|||Một dòng: [a b]',
              'Three lines: [a], [] and [b]|||Ba dòng: [a], [] và [b]',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Unquoted, the value is word-split on IFS, and a run of whitespace IFS characters counts as ONE separator, so there is no empty field — two arguments, two lines (tested). Three lines with an empty one happens only with a non-whitespace separator such as IFS=, and "a,,b". [a  b] is the quoted "$v".|||VI: Không nháy, giá trị bị cắt từ theo IFS, và một dãy ký tự khoảng trắng liền nhau tính là MỘT dấu phân cách, nên không có trường rỗng — hai tham số, hai dòng (đã thử). Ba dòng có một dòng rỗng chỉ xảy ra với dấu phân cách không phải khoảng trắng, như IFS=, và "a,,b". [a  b] là kết quả của "$v" có nháy.',
          },
          {
            question: 'wrap.sh contains: exec tool $@ — you run ./wrap.sh "bao cao.pdf" -v. What does tool receive?|||wrap.sh chứa: exec tool $@ — bạn chạy ./wrap.sh "bao cao.pdf" -v. tool nhận được gì?',
            options: [
              'Two arguments: [bao cao.pdf] [-v]|||Hai tham số: [bao cao.pdf] [-v]',
              'One argument: [bao cao.pdf -v]|||Một tham số: [bao cao.pdf -v]',
              'Two arguments: [bao] [cao.pdf -v]|||Hai tham số: [bao] [cao.pdf -v]',
              'Three arguments: [bao] [cao.pdf] [-v]|||Ba tham số: [bao] [cao.pdf] [-v]',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Unquoted $@ expands to the arguments and then word-splits each of them again, so "bao cao.pdf" becomes two words; with -v that is three (tested with a tool that prints each argument). The tempting first option is what "$@" — with quotes — gives, and that is the fix. One single argument would be "$*".|||VI: $@ không nháy khai triển thành các tham số rồi CẮT TỪ từng cái một lần nữa, nên "bao cao.pdf" thành hai từ; cộng -v là ba (đã thử bằng một tool in từng tham số). Phương án đầu hấp dẫn chính là kết quả của "$@" — có nháy — và đó là cách sửa. Một tham số duy nhất là kết quả của "$*".',
          },
          {
            question: 'f=backup.tar.gz — what does echo "${f%%.*} ${f#*.}" print?|||f=backup.tar.gz — echo "${f%%.*} ${f#*.}" in ra gì?',
            options: [
              'backup.tar gz',
              'backup tar.gz',
              'backup.tar tar.gz',
              'gz backup',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: %% removes the LONGEST match of .* from the right, i.e. everything from the first dot: backup. # removes the SHORTEST match of *. from the left, i.e. up to the first dot: tar.gz (tested). "backup.tar" is the single-% result, "gz" is ##*. — the doubled/single and #/% pairs are exactly what the question tests.|||VI: %% gỡ chỗ khớp DÀI NHẤT của .* tính từ phải, tức mọi thứ từ dấu chấm đầu tiên: còn backup. # gỡ chỗ khớp NGẮN NHẤT của *. tính từ trái, tức tới dấu chấm đầu tiên: còn tar.gz (đã thử). "backup.tar" là kết quả của một dấu %, "gz" là của ##*. — câu này kiểm đúng hai cặp đơn/đôi và #/%.',
          },
          {
            question: 'The .env on the server contains DATABASE_URL= (empty). The script begins with : "${DATABASE_URL?missing}". What happens?|||File .env trên máy chủ có DATABASE_URL= (rỗng). Script mở đầu bằng : "${DATABASE_URL?missing}". Chuyện gì xảy ra?',
            options: [
              'The script stops with "DATABASE_URL: missing"|||Script dừng với "DATABASE_URL: missing"',
              'Nothing is caught: the variable is set (to empty), so the script carries on with an empty URL|||Không bắt được gì: biến ĐÃ đặt (bằng rỗng), nên script chạy tiếp với URL rỗng',
              'DATABASE_URL becomes the string "missing"|||DATABASE_URL thành chuỗi "missing"',
              'A syntax error, because ? needs a colon|||Lỗi cú pháp, vì ? cần dấu hai chấm',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Without the colon, ${v?msg} only fires when v is UNSET; an empty value passes (tested: the script printed ok []). ${v:?msg} treats empty like unset and would have stopped it — that colon is the whole difference, and it is why configuration checks should always use :?. Option C describes := (and without a colon, =).|||VI: Thiếu dấu hai chấm, ${v?msg} chỉ kích hoạt khi v CHƯA ĐẶT; giá trị rỗng thì lọt qua (đã thử: script in ok []). ${v:?msg} coi rỗng như chưa đặt và đã chặn được nó — dấu hai chấm là toàn bộ khác biệt, và là lý do phép kiểm cấu hình luôn nên dùng :?. Phương án C mô tả := (hoặc = khi không có dấu hai chấm).',
          },
          {
            question: 'a=10 b=9. You run: [ $a > $b ] && echo lon. What happens?|||a=10 b=9. Bạn chạy: [ $a > $b ] && echo lon. Chuyện gì xảy ra?',
            options: [
              'Nothing is printed, because "10" sorts before "9"|||Không in gì, vì "10" đứng trước "9" theo thứ tự chuỗi',
              'bash: [: integer expression expected',
              'It prints "lon" — and a file named 9 appears in the directory|||In ra "lon" — và trong thư mục xuất hiện một file tên 9',
              'It prints "lon" because 10 > 9|||In ra "lon" vì 10 > 9',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Inside [ ], > is a redirection: bash runs [ 10 ] with stdout sent to a file named 9. [ 10 ] is a one-argument test, true for any non-empty string, so "lon" prints and ls shows a new file 9 (tested). Option D gets the output right for the wrong reason; option A is what [[ $a > $b ]] does. Numbers: (( a > b )) or -gt.|||VI: Bên trong [ ], > là một phép chuyển hướng: bash chạy [ 10 ] với stdout đổ vào một file tên 9. [ 10 ] là phép thử một tham số, đúng với mọi chuỗi khác rỗng, nên "lon" được in và ls thấy một file 9 mới (đã thử). Phương án D đúng output nhưng sai lý do; phương án A là thứ [[ $a > $b ]] làm. So số: (( a > b )) hoặc -gt.',
          },
          {
            question: 'count=0; printf "a\\nb\\n" | while read -r l; do ((count++)); done; echo $count — what is printed?|||count=0; printf "a\\nb\\n" | while read -r l; do ((count++)); done; echo $count — in ra gì?',
            options: [
              '0',
              '2',
              '1',
              'An error, because count was not declared|||Một lỗi, vì count chưa được khai báo',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Each part of a pipeline runs in its own subshell, so the loop increments a COPY of count that disappears when the loop ends; the parent still has 0 (tested). 2 is what you get with done < <(printf …) or done < file, which keep the loop in the current shell. 1 would be the "last line without newline" trap, which does not apply here.|||VI: Mỗi chặng của ống dẫn chạy trong một shell con riêng, nên vòng lặp tăng một BẢN SAO của count và bản sao đó biến mất khi vòng lặp kết thúc; shell cha vẫn là 0 (đã thử). 2 là kết quả của done < <(printf …) hoặc done < file, vốn giữ vòng lặp trong shell hiện tại. 1 sẽ là bẫy "dòng cuối không có xuống dòng", không áp dụng ở đây.',
          },
          {
            question: 'In a function: local out=$(git rev-parse HEAD) || return 1 — run outside any git repository. What happens?|||Trong một hàm: local out=$(git rev-parse HEAD) || return 1 — chạy ở chỗ không phải kho git. Chuyện gì xảy ra?',
            options: [
              'The function returns 1|||Hàm trả về 1',
              'The whole script exits|||Cả script thoát',
              'out holds the error message and the function returns 1|||out chứa thông báo lỗi và hàm trả về 1',
              'return 1 never runs: $? comes from local, which succeeded; out is empty and the function carries on|||return 1 không bao giờ chạy: $? là của lệnh local, vốn thành công; out rỗng và hàm chạy tiếp',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: The exit code checked by || is that of the local builtin, and local succeeds even when the substitution inside it failed (tested: local out=$(false); echo $? prints 0, while local o; o=$(false) prints 1). The tempting "returns 1" is what you get after splitting declaration and assignment onto two lines. stderr is never captured by $( ), so out does not hold the message either.|||VI: Mã thoát mà || kiểm là của lệnh dựng sẵn local, và local thành công kể cả khi phép thay thế bên trong nó hỏng (đã thử: local out=$(false); echo $? in 0, còn local o; o=$(false) in 1). "Hàm trả về 1" hấp dẫn chính là kết quả SAU khi tách khai báo và phép gán ra hai dòng. stderr không bao giờ bị $( ) bắt, nên out cũng không chứa thông báo lỗi.',
          },
          {
            question: 'bash 5.2: q="a=1&b=2"; u="x?QUERY"; echo "${u/QUERY/$q}" — what is printed?|||bash 5.2: q="a=1&b=2"; u="x?QUERY"; echo "${u/QUERY/$q}" — in ra gì?',
            options: [
              'x?a=1&b=2',
              'x?QUERY',
              'x?a=1QUERYb=2',
              'bash: bad substitution',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Since bash 5.2 the option patsub_replacement is on by default, and an unquoted & in the replacement means "the matched text" — so the & between the two parameters becomes QUERY (tested). The expected x?a=1&b=2 appears only with the replacement quoted, "${u/QUERY/"$q"}", or under an older bash such as the Mac 3.2.|||VI: Từ bash 5.2, tuỳ chọn patsub_replacement bật sẵn, và một dấu & không nháy trong phần thay thế nghĩa là "đoạn vừa khớp" — nên dấu & giữa hai tham số biến thành QUERY (đã thử). Kết quả mong đợi x?a=1&b=2 chỉ có khi phần thay được đặt nháy, "${u/QUERY/"$q"}", hoặc với một bash cũ như bản 3.2 của Mac.',
          },
          {
            question: 'deploy.sh contains env=${1,,} and works on the Ubuntu VPS. On your Mac you run /bin/bash deploy.sh PROD. What happens?|||deploy.sh có dòng env=${1,,} và chạy tốt trên VPS Ubuntu. Trên Mac bạn chạy /bin/bash deploy.sh PROD. Chuyện gì xảy ra?',
            options: [
              'It works: env becomes prod|||Chạy được: env thành prod',
              'deploy.sh: … ${1,,}: bad substitution — /bin/bash on macOS is 3.2, and case conversion arrived in bash 4|||deploy.sh: … ${1,,}: bad substitution — /bin/bash của macOS là bản 3.2, còn đổi hoa thường có từ bash 4',
              'zsh: bad substitution, because the Mac always runs zsh|||zsh: bad substitution, vì Mac lúc nào cũng chạy zsh',
              'env is silently empty|||env âm thầm rỗng',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Apple ships bash 3.2.57 as /bin/bash; ^^ ,, @Q, mapfile and negative array indexes are all bash 4+ (tested: "${1,,}: bad substitution"). Naming /bin/bash explicitly means zsh is not involved, so option C is wrong even though zsh would also reject ${1,,}. Fix: #!/usr/bin/env bash plus a newer bash from Homebrew (Chapter 15), or code for 3.2.|||VI: Apple kèm bash 3.2.57 ở /bin/bash; ^^ ,, @Q, mapfile và chỉ số mảng âm đều là của bash 4 trở lên (đã thử: "${1,,}: bad substitution"). Gọi thẳng /bin/bash nghĩa là zsh không dính vào, nên phương án C sai dù zsh cũng từ chối ${1,,}. Cách sửa: #!/usr/bin/env bash cộng một bash mới từ Homebrew (Chương 15), hoặc viết theo tập con của 3.2.',
          },
        ],
      },
    },
  ],
};
