/**
 * Linux & Bash — Chương 6: Biến, dấu nháy & khai triển.
 * Biến và khai triển · dấu nháy · khai triển tham số · mã thoát và rẽ nhánh · vòng lặp · quiz.
 * Output CHẠY THẬT Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Flinux-bash%2Flearn&reflabel=Linux%20%26%20Bash';

export default {
  title: 'Chapter 6 — Variables, quoting & expansion|||Chương 6 — Biến, dấu nháy & khai triển',
  description: 'Chương làm cho lệnh của bạn thôi vỡ vì một dấu cách trong tên file. Biến và thay thế lệnh, ba loại dấu nháy và luật duy nhất cần nhớ, khai triển tham số, mã thoát và rẽ nhánh, vòng lặp — đủ để đọc một script lạ thay vì tin nó.',
  lessons: [
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
<pre><code>echo \$name
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
<pre><code>today=\$(date +%F)
files=\$(ls | wc -l)
branch=\$(git rev-parse --abbrev-ref HEAD)
echo "On \${branch}, \${files} files, \${today}"</code></pre>
<div class="out">On main, 42 files, 2026-08-22</div>
<p><code>\$(command)</code> runs the command in a subshell, captures its stdout, strips trailing newlines, and puts the result in place. The older backtick syntax does the same thing and should be avoided:</p>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>\$( )</code></span><span class="v">Nests cleanly: <code>\$(dirname \$(readlink -f "\$0"))</code>. Quoting inside works normally. The form to use.</span></div>
  <div class="kv"><span class="k">Backticks</span><span class="v">Cannot nest without escaping backslashes, and the escaping rules inside them differ from everywhere else. Legacy only.</span></div>
</div>
<pre><code><span class="tok-comment"># Trailing newlines are stripped — usually helpful</span>
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
<pre><code>myvar="local value"        <span class="tok-comment"># shell variable: this shell only</span>
export MYVAR="exported"    <span class="tok-comment"># environment variable: inherited by children</span>

bash -c 'echo "[\$myvar] [\$MYVAR]"'</code></pre>
<div class="out">[] [exported]</div>
<p>A child process receives a copy of the <em>environment</em>, not of the shell's own variables. This is the same inheritance you met with file descriptors and umask in Lesson 5.1 — it happens at <code>fork</code>, it is a copy, and changes on either side afterwards do not propagate back. Chapter 8 covers <code>PATH</code> and startup files in full; for now the distinction is enough.</p>
<pre><code>MYVAR=once ./script.sh     <span class="tok-comment"># set for ONE command only</span>
env | sort | head          <span class="tok-comment"># everything exported</span>
set | head                 <span class="tok-comment"># everything, including shell-only</span>
declare -p myvar           <span class="tok-comment"># show one variable with its attributes</span></code></pre>

<h3>The built-in variables worth knowing</h3>
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
<pre><code><span class="tok-comment"># The idiom for "where is this script, really" — works via symlinks</span>
SCRIPT_DIR=\$(cd "\$(dirname "\${BASH_SOURCE[0]}")" &amp;&amp; pwd)
echo "\$SCRIPT_DIR"</code></pre>
<div class="out">/srv/app/scripts</div>
<p>That line appears at the top of a great many production scripts, and it is worth reading carefully: <code>dirname</code> of the script's own path, <code>cd</code> into it, then <code>pwd</code> to get the absolute resolved form. It means the script can find its own sibling files regardless of where it was invoked from — the alternative, a relative path, breaks the moment someone runs it from another directory or via <code>cron</code>.</p>

<h3>Reading input</h3>
<pre><code>read -r -p "Branch to deploy: " branch
read -r -s -p "Password: " pass; echo      <span class="tok-comment"># -s: do not echo the typing</span>
read -r -t 10 -p "Continue? [y/N] " answer <span class="tok-comment"># -t: timeout in seconds</span></code></pre>
<div class="callout ok"><strong>Always <code>read -r</code>.</strong> Without <code>-r</code>, <code>read</code> treats backslashes as escape characters and silently mangles any input containing one — Windows paths, regexes, escaped quotes. There is no case where you want that behaviour, so make <code>-r</code> automatic. ShellCheck (Chapter 7) flags every <code>read</code> that lacks it.</div>

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
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
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
<pre><code>echo \$name
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
<pre><code>today=\$(date +%F)
files=\$(ls | wc -l)
branch=\$(git rev-parse --abbrev-ref HEAD)
echo "Trên \${branch}, \${files} file, \${today}"</code></pre>
<div class="out">Trên main, 42 file, 2026-08-22</div>
<p><code>\$(lệnh)</code> chạy lệnh đó trong một shell con, bắt lấy stdout của nó, cắt bỏ các ký tự xuống dòng ở cuối, rồi đặt kết quả vào đúng chỗ. Cú pháp dấu huyền đời cũ làm y hệt và nên tránh:</p>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>\$( )</code></span><span class="v">Lồng nhau sạch sẽ: <code>\$(dirname \$(readlink -f "\$0"))</code>. Dấu nháy bên trong hoạt động bình thường. Đây là dạng nên dùng.</span></div>
  <div class="kv"><span class="k">Dấu huyền</span><span class="v">Không lồng được nếu không thêm gạch chéo ngược, và luật thoát ký tự bên trong nó lại khác mọi chỗ khác. Chỉ còn tính di sản.</span></div>
</div>
<pre><code><span class="tok-comment"># Ký tự xuống dòng ở cuối bị cắt bỏ — thường là có ích</span>
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
<pre><code>myvar="giá trị cục bộ"     <span class="tok-comment"># biến shell: chỉ trong shell này</span>
export MYVAR="đã xuất"     <span class="tok-comment"># biến môi trường: tiến trình con thừa kế</span>

bash -c 'echo "[\$myvar] [\$MYVAR]"'</code></pre>
<div class="out">[] [đã xuất]</div>
<p>Một tiến trình con nhận được một BẢN SAO của <em>MÔI TRƯỜNG</em>, không nhận biến riêng của shell. Đây chính là phép thừa kế bạn đã gặp với bộ mô tả file và umask ở Bài 5.1 — nó xảy ra lúc <code>fork</code>, nó là một bản sao, và những thay đổi sau đó ở bên nào cũng không truyền ngược lại. Chương 8 nói đầy đủ về <code>PATH</code> và các file khởi động; còn lúc này thì phân biệt được như thế là đủ.</p>
<pre><code>MYVAR=once ./script.sh     <span class="tok-comment"># đặt cho ĐÚNG MỘT lệnh</span>
env | sort | head          <span class="tok-comment"># mọi thứ đã export</span>
set | head                 <span class="tok-comment"># mọi thứ, kể cả biến chỉ có trong shell</span>
declare -p myvar           <span class="tok-comment"># hiện một biến kèm các thuộc tính của nó</span></code></pre>

<h3>Những biến dựng sẵn đáng biết</h3>
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
<pre><code><span class="tok-comment"># Lối viết cho câu "script này thật ra nằm ở đâu" — chạy được cả qua liên kết tượng trưng</span>
SCRIPT_DIR=\$(cd "\$(dirname "\${BASH_SOURCE[0]}")" &amp;&amp; pwd)
echo "\$SCRIPT_DIR"</code></pre>
<div class="out">/srv/app/scripts</div>
<p>Dòng đó xuất hiện ở đầu rất nhiều script production, và nó đáng đọc kỹ: lấy <code>dirname</code> của đường dẫn chính script, <code>cd</code> vào đó, rồi <code>pwd</code> để có dạng tuyệt đối đã giải hết liên kết. Nó nghĩa là script tìm được những file nằm cạnh nó bất kể được gọi từ đâu — còn phương án kia, một đường dẫn tương đối, vỡ ngay khoảnh khắc có người chạy nó từ thư mục khác hoặc chạy qua <code>cron</code>.</p>

<h3>Đọc dữ liệu vào</h3>
<pre><code>read -r -p "Nhánh cần deploy: " branch
read -r -s -p "Mật khẩu: " pass; echo      <span class="tok-comment"># -s: không hiện lại thứ đang gõ</span>
read -r -t 10 -p "Tiếp tục? [y/N] " answer <span class="tok-comment"># -t: hết giờ sau bao nhiêu giây</span></code></pre>
<div class="callout ok"><strong>Luôn <code>read -r</code>.</strong> Không có <code>-r</code>, <code>read</code> coi gạch chéo ngược là ký tự thoát và âm thầm làm méo mọi đầu vào có chứa nó — đường dẫn Windows, regex, dấu nháy đã thoát. Không có trường hợp nào bạn MUỐN hành vi đó cả, nên hãy để <code>-r</code> thành phản xạ. ShellCheck (Chương 7) đánh dấu mọi lệnh <code>read</code> thiếu nó.</div>

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
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
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
<pre><code>file="my report.txt"
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

<h3>The three kinds of quoting</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>"double"</code></span><span class="v">Expands <code>\$var</code>, <code>\$(cmd)</code> and <code>\$((math))</code>; suppresses word splitting and globbing. <strong>Your default.</strong></span></div>
  <div class="kv"><span class="k"><code>'single'</code></span><span class="v">Expands <strong>nothing</strong> — every character is literal, including <code>\$</code> and <code>\\</code>. The only thing it cannot contain is another single quote. Use for awk/sed programs, regexes, and anything with a literal <code>\$</code>.</span></div>
  <div class="kv"><span class="k">unquoted</span><span class="v">Everything expands, then splits, then globs. Correct only when you <em>deliberately</em> want splitting — which is rare and should carry a comment.</span></div>
</div>
<pre><code>name="Binh"
echo "Hello \$name, today is \$(date +%A)"
echo 'Hello \$name, today is \$(date +%A)'
echo "Cost: \\\$5"                <span class="tok-comment"># backslash escapes the \$ inside double quotes</span></code></pre>
<div class="out">Hello Binh, today is Friday
Hello \$name, today is \$(date +%A)
Cost: \$5</div>
<pre><code><span class="tok-comment"># Mixing them in one argument — they simply concatenate, no space between</span>
echo 'literal \$HOME is '"\$HOME"
awk -v n="\$name" '{print n, \$1}' file.txt    <span class="tok-comment"># single for awk, double for the shell value</span></code></pre>
<div class="out">literal \$HOME is /home/deploy</div>
<div class="callout ok">Adjacent quoted strings join with no separator, which is how you build a string that is partly literal and partly expanded. This is also the answer to "how do I put a single quote inside single quotes": you cannot, so you close, add <code>"'"</code>, and reopen — <code>'it'"'"'s'</code>. Ugly, and the reason to reach for a double-quoted string with an escaped <code>\$</code> instead when you can.</div>

<h3>"\$@" versus "\$*" versus \$@</h3>
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
<pre><code>files=("report one.txt" "report two.txt" "notes.md")
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
<pre><code>echo "\$IFS" | cat -A          <span class="tok-comment"># default: space, tab, newline</span>

line="alice:x:1001:1001::/home/alice:/bin/bash"
IFS=':' read -r user _ uid gid _ home shell &lt;&lt;&lt; "\$line"
echo "\$user \$uid \$home \$shell"</code></pre>
<div class="out"> ^I\$
\$
alice 1001 /home/alice /bin/bash</div>
<p><code>IFS</code> (Internal Field Separator) is the variable that controls step 3 of the expansion diagram. Setting it on the same line as a command changes it for that command only, which is the clean way to parse a delimited line without <code>cut</code> or <code>awk</code>. The <code>_</code> is a conventional throwaway name for fields you do not want.</p>
<div class="callout">Setting <code>IFS</code> globally is a known way to break a script in confusing ways, because everything downstream splits differently. Prefer the one-command form (<code>IFS=':' read …</code>), or save and restore it. The one global setting that <em>is</em> idiomatic is <code>IFS=\$'\\n\\t'</code> at the top of a strict script — it removes space from the separator list, so accidental unquoted expansions break on far fewer inputs.</div>

<h3>Ten before-and-afters</h3>
<pre><code><span class="tok-comment"># 1  test on a possibly-empty variable</span>
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
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
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
<pre><code>file="my report.txt"
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

<h3>Ba loại dấu nháy</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>"nháy kép"</code></span><span class="v">Khai triển <code>\$var</code>, <code>\$(lệnh)</code> và <code>\$((số học))</code>; dập việc cắt từ và khai triển glob. <strong>Mặc định của bạn.</strong></span></div>
  <div class="kv"><span class="k"><code>'nháy đơn'</code></span><span class="v">KHÔNG khai triển <strong>gì cả</strong> — mọi ký tự đều nguyên văn, kể cả <code>\$</code> và <code>\\</code>. Thứ duy nhất nó không chứa được là một dấu nháy đơn khác. Dùng cho chương trình awk/sed, cho regex, và cho mọi thứ có dấu <code>\$</code> nguyên văn.</span></div>
  <div class="kv"><span class="k">không nháy</span><span class="v">Mọi thứ khai triển, rồi cắt, rồi glob. Chỉ đúng khi bạn <em>CỐ Ý</em> muốn cắt — chuyện hiếm, và nên kèm một dòng chú thích.</span></div>
</div>
<pre><code>name="Binh"
echo "Chào \$name, hôm nay là \$(date +%A)"
echo 'Chào \$name, hôm nay là \$(date +%A)'
echo "Giá: \\\$5"                 <span class="tok-comment"># gạch chéo ngược thoát dấu \$ bên trong nháy kép</span></code></pre>
<div class="out">Chào Binh, hôm nay là Friday
Chào \$name, hôm nay là \$(date +%A)
Giá: \$5</div>
<pre><code><span class="tok-comment"># Trộn chúng trong một tham số — chúng chỉ đơn giản là nối lại, không có dấu cách ở giữa</span>
echo 'nguyên văn \$HOME là '"\$HOME"
awk -v n="\$name" '{print n, \$1}' file.txt    <span class="tok-comment"># nháy đơn cho awk, nháy kép cho giá trị của shell</span></code></pre>
<div class="out">nguyên văn \$HOME là /home/deploy</div>
<div class="callout ok">Hai chuỗi có nháy đứng cạnh nhau sẽ nối lại không có dấu ngăn, và đó là cách bạn dựng một chuỗi vừa có phần nguyên văn vừa có phần được khai triển. Đây cũng là câu trả lời cho "làm sao đặt một dấu nháy đơn bên trong nháy đơn": không được, nên bạn đóng lại, thêm <code>"'"</code>, rồi mở ra tiếp — <code>'it'"'"'s'</code>. Xấu, và là lý do nên với tay lấy một chuỗi nháy kép với dấu <code>\$</code> đã thoát khi có thể.</div>

<h3>"\$@" so với "\$*" so với \$@</h3>
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
<pre><code>files=("report one.txt" "report two.txt" "notes.md")
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
<pre><code>echo "\$IFS" | cat -A          <span class="tok-comment"># mặc định: dấu cách, tab, xuống dòng</span>

line="alice:x:1001:1001::/home/alice:/bin/bash"
IFS=':' read -r user _ uid gid _ home shell &lt;&lt;&lt; "\$line"
echo "\$user \$uid \$home \$shell"</code></pre>
<div class="out"> ^I\$
\$
alice 1001 /home/alice /bin/bash</div>
<p><code>IFS</code> (Internal Field Separator) là biến điều khiển bước 3 trong sơ đồ khai triển. Đặt nó ngay trên cùng dòng với một lệnh sẽ đổi nó CHỈ cho lệnh đó, và đó là cách sạch sẽ để tách một dòng có dấu phân cách mà không cần <code>cut</code> hay <code>awk</code>. Dấu <code>_</code> là cái tên vứt đi theo quy ước, dành cho những trường bạn không cần.</p>
<div class="callout">Đặt <code>IFS</code> ở phạm vi toàn cục là một cách đã được biết đến để làm hỏng script theo những kiểu khó hiểu, vì mọi thứ phía sau đó sẽ cắt khác đi. Hãy ưu tiên dạng chỉ-một-lệnh (<code>IFS=':' read …</code>), hoặc lưu lại rồi khôi phục. Cái đặt toàn cục DUY NHẤT được coi là chuẩn mực là <code>IFS=\$'\\n\\t'</code> ở đầu một script nghiêm ngặt — nó bỏ dấu cách khỏi danh sách dấu phân cách, nên những phép khai triển lỡ quên nháy sẽ vỡ với ít đầu vào hơn nhiều.</div>

<h3>Mười cặp trước–sau</h3>
<pre><code><span class="tok-comment"># 1  kiểm một biến có thể rỗng</span>
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
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
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
<pre><code>name=""
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
<pre><code><span class="tok-comment"># Conditional flag, without an if</span>
verbose=1
rsync \${verbose:+--verbose} -a src/ dst/

<span class="tok-comment"># Config with a fallback chain</span>
port="\${PORT:-\${DEFAULT_PORT:-3000}}"</code></pre>

<h3>Trimming: # from the left, % from the right</h3>
<p>Two operators remove a matching pattern from one end. The mnemonic is the keyboard: <code>#</code> is left of <code>%</code> on a US layout, and it trims from the left.</p>
<pre><code>path="/srv/app/config/db.yml"

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
<pre><code>file="archive.tar.gz"
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
<pre><code>s="hello world world"

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
<pre><code><span class="tok-comment"># Practical: normalise a branch name into a docker tag</span>
branch="feature/user-login"
tag="\${branch//\\//-}"        <span class="tok-comment"># slashes → dashes (the / is escaped)</span>
echo "myapp:\${tag}"</code></pre>
<div class="out">myapp:feature-user-login</div>

<h3>Length, slicing, and case</h3>
<pre><code>s="deployment"
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
<pre><code>path="/srv/app/config/db.yml"

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
<pre><code>DB_HOST=localhost
DB_PORT=5432
DB_NAME=app

<span class="tok-comment"># Every variable name starting with DB_</span>
echo "\${!DB_@}"

<span class="tok-comment"># Read a variable whose NAME is in another variable</span>
key="DB_HOST"
echo "\${!key}"</code></pre>
<div class="out">DB_HOST DB_NAME DB_PORT
localhost</div>
<pre><code><span class="tok-comment"># A config validator built from the two together</span>
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
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
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
<pre><code>name=""
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
<pre><code><span class="tok-comment"># Cờ có điều kiện, không cần if</span>
verbose=1
rsync \${verbose:+--verbose} -a src/ dst/

<span class="tok-comment"># Cấu hình với một chuỗi phương án lùi</span>
port="\${PORT:-\${DEFAULT_PORT:-3000}}"</code></pre>

<h3>Xén: # từ bên trái, % từ bên phải</h3>
<p>Hai toán tử gỡ bỏ một mẫu khớp ở một đầu. Cách nhớ nằm trên bàn phím: <code>#</code> nằm bên trái <code>%</code> trong bố cục Mỹ, và nó xén từ bên trái.</p>
<pre><code>path="/srv/app/config/db.yml"

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
<pre><code>file="archive.tar.gz"
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
<pre><code>s="hello world world"

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
<pre><code><span class="tok-comment"># Thực tế: chuẩn hoá tên nhánh thành một tag docker</span>
branch="feature/user-login"
tag="\${branch//\\//-}"        <span class="tok-comment"># gạch chéo → gạch ngang (dấu / được thoát)</span>
echo "myapp:\${tag}"</code></pre>
<div class="out">myapp:feature-user-login</div>

<h3>Độ dài, cắt lát, và hoa thường</h3>
<pre><code>s="deployment"
echo "\${#s}"              <span class="tok-comment"># độ dài: 10</span>
echo "\${s:0:6}"           <span class="tok-comment"># từ vị trí 0, lấy 6 ký tự</span>
echo "\${s:6}"             <span class="tok-comment"># từ vị trí 6 tới hết</span>
echo "\${s: -4}"           <span class="tok-comment"># 4 ký tự CUỐI — để ý dấu cách trước -4</span>

echo "\${s^^}"             <span class="tok-comment"># CHỮ HOA (bash 4 trở lên)</span>
echo "\${s,,}"             <span class="tok-comment"># chữ thường</span>
echo "\${s^}"              <span class="tok-comment"># viết hoa mỗi chữ cái đầu</span></code></pre>
<div class="out">10
deploy
ment
ment
DEPLOYMENT
deployment
Deployment</div>
<div class="callout warn">Dấu cách trong <code>\${s: -4}</code> là BẮT BUỘC. Thiếu nó, <code>\${s:-4}</code> chính là toán tử <em>GIÁ TRỊ MẶC ĐỊNH</em> ở đầu bài này và nghĩa là "dùng 4 nếu <code>s</code> rỗng" — một kết quả hoàn toàn khác mà lại không báo lỗi. Hai cú pháp, cách nhau một ký tự, và chỉ một dấu cách phân biệt chúng.</div>

<h3>Thay thế các lệnh bên ngoài</h3>
<pre><code>path="/srv/app/config/db.yml"

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
<pre><code>DB_HOST=localhost
DB_PORT=5432
DB_NAME=app

<span class="tok-comment"># Mọi tên biến bắt đầu bằng DB_</span>
echo "\${!DB_@}"

<span class="tok-comment"># Đọc một biến mà TÊN của nó nằm trong một biến khác</span>
key="DB_HOST"
echo "\${!key}"</code></pre>
<div class="out">DB_HOST DB_NAME DB_PORT
localhost</div>
<pre><code><span class="tok-comment"># Một bộ kiểm cấu hình dựng từ hai thứ trên ghép lại</span>
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
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: xử lý chuỗi mà không cần sed</span><span class="lc-sub">Bài chấm điểm: rút phần đuôi file, cắt tiền tố, dựng một slug, và kiểm các biến môi trường bắt buộc bằng <code>:?</code>.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> quên rằng đây là <strong>GLOB, không phải regex</strong>. <code>\${file%%[0-9]*}</code> chạy được vì khoảng trong ngoặc vuông là cú pháp glob, nhưng <code>\${file%%\\d*}</code> thì âm thầm chẳng làm gì — <code>\\d</code> không phải glob, nên không khớp gì cả, nên giá trị trả về nguyên xi mà không có lỗi nào. Điều tương tự đúng với <code>+</code>, <code>|</code> và <code>()</code>. Khi một phép khai triển tham số "không chạy", hãy kiểm xem có phải bạn vừa viết một regex theo phản xạ không; nếu bạn thật sự cần regex thì đó là việc của <code>sed</code> hoặc <code>[[ =~ ]]</code>.</div>
<p class="note-ct"><strong>Học bốn cái này trước là bạn đã có phần lớn giá trị:</strong> <code>\${var:-mặc định}</code> cho phương án lùi, <code>\${var:?msg}</code> cho cấu hình bắt buộc, <code>\${path##*/}</code> cho basename, và <code>\${file%.*}</code> để bỏ phần đuôi. Chúng bao phủ đại đa số các nhu cầu thực tế, và mỗi cái gỡ đi một lần khởi chạy tiến trình khỏi vòng lặp của bạn.</p>
</div>
`,
    },
  ],
};
