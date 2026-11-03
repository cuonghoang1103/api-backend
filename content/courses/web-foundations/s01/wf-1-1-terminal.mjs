/**
 * Bài 1.1 — Terminal (nâng cấp 02/11/2026). Output thật: _demo/_t1/terminal/chay.sh (bash trong môi trường sạch env -i, một
 * "thư mục nhà" tạm in thành /Users/lan): pwd/ls/cd, đường dẫn tương đối/tuyệt đối, tạo/chép/đổi tên/xoá, dấu cách trong tên,
 * tệp ẩn, ký tự đại diện, ống | và >, mã thoát $?. Deck: scripts/slides-src/wf-1-1.mjs (9 slide, WF/v1/wf-1-1).
 * Code Lab: wf-1-1-terminal.
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-1-1', 'The terminal', 'Terminal', [
  [1, 'The terminal',
    '<p>Every tool in this course, from Git to npm to a server, is started from the terminal. It is simply a way to give your computer commands as text instead of clicks. This lesson runs real commands in a fresh folder and shows exactly what each one prints, so nothing is a mystery when you meet it later.</p>',
    '<p>Mọi công cụ trong khoá này, từ Git, npm tới máy chủ, đều được khởi động từ terminal. Nó đơn giản là cách ra lệnh cho máy tính bằng chữ thay vì bằng cú bấm. Bài này chạy lệnh thật trong một thư mục mới và cho thấy đúng thứ mỗi lệnh in ra, để sau này gặp lại không có gì bí ẩn.</p>'],
  [2, 'After this lesson you can…',
    '<p>You will be able to find where you are and move between folders, read absolute and relative paths, create, copy, move and delete files, handle names with spaces, see hidden files, use wildcards, connect commands with pipes, save output to a file, and read an exit code.</p>',
    '<p>Bạn sẽ biết mình đang ở đâu và di chuyển giữa các thư mục, đọc đường dẫn tuyệt đối và tương đối, tạo, chép, chuyển và xoá tệp, xử lý tên có dấu cách, xem tệp ẩn, dùng ký tự đại diện, nối các lệnh bằng ống, lưu output vào tệp, và đọc mã thoát.</p>'],
  [3, 'Where am I?',
    '<p>pwd prints the folder you are in. ls lists what is inside. cd moves you: into a folder by name, up with two dots, and two levels up with dot dot slash dot dot. Every command runs relative to the folder pwd shows.</p>',
    '<p>pwd in ra thư mục bạn đang đứng. ls liệt kê thứ bên trong. cd đưa bạn đi: vào một thư mục theo tên, lên trên bằng hai dấu chấm, và lên hai cấp bằng chấm chấm gạch chấm chấm. Mọi lệnh đều chạy tương đối với thư mục mà pwd cho thấy.</p>'],
  [4, 'Absolute and relative paths',
    '<p>An absolute path starts at the root slash and works from anywhere. A relative path starts from where you are now. From inside src, dot dot slash index dot html found the file, but plain notes dot txt did not exist there. cd tilde goes home, cd dash goes back.</p>',
    '<p>Đường dẫn tuyệt đối bắt đầu từ gốc gạch chéo và dùng được ở bất kỳ đâu. Đường dẫn tương đối bắt đầu từ chỗ bạn đang đứng. Từ trong src, chấm chấm gạch index chấm html tìm thấy tệp, còn notes chấm txt trơn thì không có ở đó. cd ngã về nhà, cd gạch quay lại.</p>'],
  [5, 'Files: create, copy, move, delete',
    '<p>The greater-than sign writes output into a file, two of them append. cp copies, mv moves or renames, rm deletes. rmdir refused because the folder was not empty, and rm with dash r removed it with everything inside, with no recycle bin.</p>',
    '<p>Dấu lớn hơn ghi output vào tệp, hai dấu thì ghi nối thêm. cp chép, mv chuyển hoặc đổi tên, rm xoá. rmdir từ chối vì thư mục không rỗng, còn rm gạch r xoá nó cùng mọi thứ bên trong, không có thùng rác.</p>'],
  [6, 'Spaces and hidden files',
    '<p>mkdir my project created two folders, my and project, because a space separates arguments. Quotes keep the name together. Files that start with a dot, like dot env and dot gitignore, are hidden from plain ls; ls dash a shows them.</p>',
    '<p>mkdir my project tạo ra hai thư mục, my và project, vì dấu cách ngăn các đối số. Dấu nháy giữ tên liền một khối. Tệp bắt đầu bằng dấu chấm, như chấm env và chấm gitignore, bị ẩn khỏi ls trơn; ls gạch a mới hiện chúng.</p>'],
  [7, 'Wildcards and pipes',
    '<p>Star dot js expands to every JavaScript file before the command runs. A pipe sends the output of one command into the next: sort, then count duplicates, then keep the top line. Small tools, combined, answer real questions.</p>',
    '<p>Sao chấm js được mở rộng thành mọi tệp JavaScript trước khi lệnh chạy. Ống gửi output của lệnh này vào lệnh sau: sắp xếp, rồi đếm trùng lặp, rồi giữ dòng đầu. Những công cụ nhỏ, ghép lại, trả lời được câu hỏi thật.</p>'],
  [8, 'Errors and exit codes',
    '<p>A typo gives command not found with exit code one hundred twenty seven. A missing file gives exit code one. Success is zero. Scripts, Git hooks and CI all decide what to do next by reading this number.</p>',
    '<p>Gõ sai cho ra command not found với mã thoát một trăm hai mươi bảy. Tệp không tồn tại cho mã thoát một. Thành công là không. Script, hook của Git và CI đều quyết định bước tiếp theo bằng cách đọc con số này.</p>'],
  [9, 'Summary & practice',
    '<p>The practice asks you to build a project folder structure using only the terminal, move and rename files in it, find files with wildcards, and count lines with a pipe. Done when ls dash A of your project matches the expected list.</p>',
    '<p>Bài luyện yêu cầu bạn dựng cấu trúc thư mục dự án chỉ bằng terminal, chuyển và đổi tên tệp trong đó, tìm tệp bằng ký tự đại diện, và đếm dòng bằng ống. Xong khi ls gạch A của dự án khớp với danh sách mong đợi.</p>'],
]);

export default {
  title: '1.1 — The terminal: talking to your computer with words|||1.1 — Terminal: nói chuyện với máy tính bằng chữ',
  slug: 'wf-1-1-terminal',
  type: 'VIDEO',
  isFreePreview: true,
  video: { url: 'https://youtu.be/uwAqEzhyjtw', durationSeconds: 0 },
  description: 'Lệnh thật trong bash: pwd/ls/cd, đường dẫn tuyệt đối và tương đối (../index.html thấy, notes.txt không), tạo/chép/đổi tên/xoá (rmdir từ chối, rm -r không có thùng rác), "mkdir my project" tạo HAI thư mục, tệp ẩn .env, ký tự đại diện *.js, ống sort | uniq -c, > và >>, mã thoát 127/1/0.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>The terminal is just a text way to give commands</h2>
<p class="lead">After this lesson you can move around your computer and manage files with the terminal: know where you are, read absolute and relative paths, create, copy, move and delete, handle names with spaces, see hidden files, use wildcards, combine commands with pipes and <code>&gt;</code>, and read an exit code. Git (1.3), npm (1.5), servers and deploy scripts are all driven from here — and the "path" idea comes back in every <code>import './x.js'</code> and <code>src="…"</code> you will write.</p>

<h3>Opening one</h3>
<table>
<thead><tr><th>System</th><th>Open</th><th>Shell</th></tr></thead>
<tbody>
<tr><td>macOS</td><td>Terminal (Spotlight → "Terminal"), or the terminal panel in VS Code (<code>Ctrl+&#96;</code>)</td><td>zsh</td></tr>
<tr><td>Windows</td><td>Windows Terminal → <strong>Git Bash</strong> (installed with Git), or WSL</td><td>bash</td></tr>
<tr><td>Linux</td><td>Terminal (<code>Ctrl+Alt+T</code>)</td><td>bash</td></tr>
</tbody>
</table>
<p>All output below was recorded in <strong>bash</strong> in a fresh, empty home folder that contains <code>projects/shop/index.html</code>, <code>projects/shop/src/app.js</code>, <code>projects/notes.txt</code> and an empty <code>projects/blog</code>. Every line starting with <code>$ </code> is what was typed; the rest is what the computer answered. zsh and Git Bash print the same results, with occasionally different error wording.</p>

<h3>Step 1 — where am I? <code>pwd</code>, <code>ls</code>, <code>cd</code></h3>
${ra(OUT['_t1/terminal/out/navigate'])}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">pwd</span><span class="lz-t">print working directory</span><span class="lz-d">The folder every command runs in. When something "cannot be found", check this first.</span></div>
<div class="lz-layer"><span class="lz-k">ls</span><span class="lz-t">list</span><span class="lz-d"><code>ls -F</code> marks folders with <code>/</code>; <code>ls folder</code> lists another folder without moving.</span></div>
<div class="lz-layer"><span class="lz-k">cd name</span><span class="lz-t">change directory, down</span><span class="lz-d">Into a folder inside the current one. Several levels at once: <code>cd projects/shop</code>.</span></div>
<div class="lz-layer"><span class="lz-k">cd ..</span><span class="lz-t">up one level</span><span class="lz-d"><code>..</code> means "the parent folder"; <code>../..</code> is two levels up.</span></div>
</div>

<h3>Step 2 — absolute and relative paths</h3>
${ra(OUT['_t1/terminal/out/paths'])}
<p>A path is directions to a file. An <strong>absolute</strong> path starts with <code>/</code> (on Windows <code>C:\\</code>) and gives the full route from the top — it works from any folder. A <strong>relative</strong> path starts from <em>where you are</em>: from <code>projects/shop/src</code>, <code>../index.html</code> means "up one, then index.html" and works, while plain <code>notes.txt</code> means "notes.txt in <em>this</em> folder" — and there is none here, it is two levels up (<code>../../notes.txt</code>).</p>
<div class="kv-grid">
  <div class="kv"><span class="k">.</span><span class="v">this folder — <code>./app.js</code></span></div>
  <div class="kv"><span class="k">..</span><span class="v">the parent folder</span></div>
  <div class="kv"><span class="k">~</span><span class="v">your home folder — <code>cd ~</code></span></div>
  <div class="kv"><span class="k">-</span><span class="v">with <code>cd</code>: the previous folder (it prints where you went)</span></div>
  <div class="kv"><span class="k">/</span><span class="v">at the start: the root of the disk; inside a path: the separator</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Trap — "No such file or directory" when the file clearly exists.</strong> Nine times out of ten the file is there, but you are in a different folder from the one you think. Relative paths are read from <code>pwd</code>, not from where the file "should" be. Run <code>pwd</code> and <code>ls</code>, then fix the path or <code>cd</code> to the right place. The same mistake appears later as a broken <code>&lt;img src&gt;</code> or a failing <code>import</code>.</p></div>

<h3>Step 3 — create, copy, move, delete</h3>
${ra(OUT['_t1/terminal/out/files'])}
<table>
<thead><tr><th>Command</th><th>Does</th></tr></thead>
<tbody>
<tr><td><code>mkdir site</code> · <code>mkdir -p a/b/c</code></td><td>create a folder · create all missing levels</td></tr>
<tr><td><code>touch file</code></td><td>create an empty file (or update its time)</td></tr>
<tr><td><code>echo text &gt; file</code> · <code>&gt;&gt; file</code></td><td>write (replacing the file!) · append</td></tr>
<tr><td><code>cat file</code></td><td>print a file</td></tr>
<tr><td><code>cp a b</code></td><td>copy (<code>cp -r</code> for folders)</td></tr>
<tr><td><code>mv a b</code> · <code>mv a folder/</code></td><td>rename · move into a folder</td></tr>
<tr><td><code>rmdir dir</code> · <code>rm file</code> · <code>rm -r dir</code></td><td>remove an empty folder · a file · a folder and everything in it</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>rm</code> has no recycle bin, and <code>&gt;</code> silently replaces.</strong> <code>rm -r old</code> deleted the folder and its contents immediately; nothing asks "are you sure?", and nothing can be restored. <code>echo x &gt; index.html</code> on an existing file wipes it. Before <code>rm -r</code>, run <code>ls</code> on the same path to see exactly what will go; never run <code>rm -rf</code> on a path you built from a variable you have not printed. Git (1.3) is your real safety net for code.</p></div>

<h3>Step 4 — spaces in names, hidden files</h3>
${ra(OUT['_t1/terminal/out/spaces'])}
<p>The shell splits a command on spaces: <code>mkdir my project</code> is "make <code>my</code>, make <code>project</code>" — two folders. Quotes (<code>"my project"</code>) or a backslash (<code>my\\ project</code>) keep the name in one piece. <code>cd my project</code> silently went into <code>my</code> in this bash; zsh refuses with an error. Developers avoid spaces in file names altogether: <code>my-project</code>.</p>
${ra(OUT['_t1/terminal/out/hidden'])}
<p>Names starting with a dot are hidden from <code>ls</code>: <code>.env</code> (secrets, Chapter 7), <code>.gitignore</code> and the <code>.git</code> folder (1.3). <code>ls -a</code> shows them plus <code>.</code> and <code>..</code>; <code>ls -A</code> shows them without those two.</p>

<h3>Step 5 — wildcards, pipes and redirection</h3>
${ra(OUT['_t1/terminal/out/globs'])}
<p>The shell replaces <code>*.js</code> with the matching names <em>before</em> the command runs — <code>echo</code> never saw a star. <code>|</code> (pipe) sends one command's output into the next command's input.</p>
${ra(OUT['_t1/terminal/out/pipes'])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">sort fruits.txt</span><span class="lz-t">equal lines next to each other</span><span class="lz-d">apple apple apple banana cherry</span></div>
<div class="lz-step"><span class="lz-k">| uniq -c</span><span class="lz-t">count runs of equal lines</span><span class="lz-d">3 apple · 1 banana · 1 cherry</span></div>
<div class="lz-step"><span class="lz-k">| sort -r</span><span class="lz-t">biggest count first</span><span class="lz-d">3 apple on top</span></div>
<div class="lz-step"><span class="lz-k">| head -1</span><span class="lz-t">keep one line</span><span class="lz-d">"the most common line" — answered with four tiny tools</span></div>
</div>

<h3>Step 5b — finding files and text</h3>
${ra(OUT['_t1/terminal/out/search'])}
<p><code>find</code> searches by <em>name</em> (<code>-name "*.js"</code> — quoted, so the shell does not expand the star itself) or type (<code>-type f</code> = files). <code>grep -rn</code> searches <em>inside</em> files, recursively, with line numbers — exactly the <code>file:line</code> format you will meet again in error messages (Lesson 10.2). Notice <code>grep "shop"</code> did not find <code>&lt;h1&gt;Shop&lt;/h1&gt;</code>: grep is case-sensitive unless you add <code>-i</code>. VS Code's "Search in files" (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>F</kbd>, Lesson 1.2) is the same idea with a window around it.</p>

<h3>Step 6 — errors and exit codes</h3>
${ra(OUT['_t1/terminal/out/errors'])}
<p>Every command ends with an <strong>exit code</strong>, stored in <code>$?</code>: <code>0</code> means success, anything else is failure (<code>127</code> = command not found, <code>1</code> = general error). You rarely type <code>echo $?</code>, but everything around you reads it: <code>&amp;&amp;</code> runs the next command only on 0 (<code>mkdir demo &amp;&amp; cd demo</code>), CI fails a build on non-zero, and <code>npm test</code> (1.5) reports pass/fail this way. <code>which node</code> shows which program a name runs — the first fix to try for "command not found" is checking the spelling, then that the program is installed and on your <code>PATH</code>.</p>
<table>
<thead><tr><th>Time-saver</th><th>Does</th></tr></thead>
<tbody>
<tr><td><kbd>Tab</kbd></td><td>completes file and folder names — also prevents typos</td></tr>
<tr><td><kbd>↑</kbd> / <kbd>↓</kbd></td><td>previous / next command</td></tr>
<tr><td><kbd>Ctrl</kbd>+<kbd>C</kbd></td><td>stop the running command (a server, a stuck script)</td></tr>
<tr><td><kbd>Ctrl</kbd>+<kbd>R</kbd></td><td>search your command history</td></tr>
<tr><td><code>clear</code> or <kbd>Ctrl</kbd>+<kbd>L</kbd></td><td>clear the screen</td></tr>
<tr><td><code>man ls</code> / <code>ls --help</code></td><td>the manual for a command (<kbd>q</kbd> to quit)</td></tr>
</tbody>
</table>

<div class="callout ok">
<p><strong>🧪 Practice (30 minutes) — a project folder, terminal only</strong></p>
<ol>
<li>In your home folder: <code>mkdir -p practice/portfolio/css practice/portfolio/js practice/portfolio/img</code>, then <code>cd practice/portfolio</code> and check with <code>pwd</code>.</li>
<li>Create <code>index.html</code>, <code>css/style.css</code>, <code>js/app.js</code> with <code>touch</code>, and write <code>&lt;h1&gt;Portfolio&lt;/h1&gt;</code> into <code>index.html</code> with <code>echo … &gt;</code>.</li>
<li>Create <code>about me.html</code> (with the space, using quotes), then rename it to <code>about.html</code> with <code>mv</code>.</li>
<li>From inside <code>js/</code>, without <code>cd</code>-ing out, print <code>../index.html</code> with <code>cat</code>. Then <code>cd -</code>.</li>
<li>Create a hidden <code>.gitignore</code>; list everything with <code>ls -A</code>; count all files under the project with <code>find . -type f | wc -l</code>.</li>
</ol>
<p>Hint: press <kbd>Tab</kbd> after the first letters of every name — if it does not complete, the path is wrong.</p>
<p><strong>Done when:</strong> <code>ls -A</code> in <code>portfolio</code> prints <code>.gitignore about.html css img index.html js</code> (one per line), <code>find . -type f | wc -l</code> prints <code>5</code>, and <code>cat index.html</code> shows your heading. Then do Code Lab module 1.1.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">terminal / shell</span><span class="v">cửa sổ dòng lệnh / chương trình đọc lệnh (bash, zsh).</span></div>
  <div class="kv"><span class="k">working directory</span><span class="v">thư mục làm việc hiện tại — <code>pwd</code>.</span></div>
  <div class="kv"><span class="k">absolute path</span><span class="v">đường dẫn tuyệt đối — bắt đầu từ <code>/</code>.</span></div>
  <div class="kv"><span class="k">relative path</span><span class="v">đường dẫn tương đối — tính từ chỗ đang đứng.</span></div>
  <div class="kv"><span class="k">parent folder (..)</span><span class="v">thư mục cha.</span></div>
  <div class="kv"><span class="k">argument / flag</span><span class="v">đối số / cờ — <code>ls -a projects</code>.</span></div>
  <div class="kv"><span class="k">hidden file</span><span class="v">tệp ẩn — tên bắt đầu bằng dấu chấm.</span></div>
  <div class="kv"><span class="k">wildcard (glob)</span><span class="v">ký tự đại diện — <code>*.js</code>.</span></div>
  <div class="kv"><span class="k">pipe / redirect</span><span class="v">ống <code>|</code> / chuyển hướng <code>&gt;</code> <code>&gt;&gt;</code>.</span></div>
  <div class="kv"><span class="k">exit code</span><span class="v">mã thoát — 0 là thành công.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li><code>pwd</code> where you are, <code>ls</code> what is here, <code>cd</code> move (<code>..</code> up, <code>~</code> home, <code>-</code> back).</li>
  <li>Absolute paths start at <code>/</code>; relative paths start at <code>pwd</code> — the cause of most "not found" errors.</li>
  <li><code>mkdir -p</code>, <code>touch</code>, <code>cp</code>, <code>mv</code>, <code>rm -r</code> — and <code>rm</code> and <code>&gt;</code> cannot be undone.</li>
  <li>Spaces split arguments: quote names or avoid spaces; dot-files are hidden (<code>ls -A</code>).</li>
  <li><code>*.js</code> expands before the command runs; <code>|</code> chains small tools.</li>
  <li>Exit code 0 = success; 127 = command not found; tools and CI read it.</li>
</ul>
${nguon('📗', 'MDN — Command line crash course', 'The terminal for web developers: navigation, files, pipes', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Environment_setup/Command_line')}
${nguon('📘', 'GNU Bash manual — Shell expansions', 'How the shell turns *.js, ~ and quotes into arguments', 'https://www.gnu.org/software/bash/manual/html_node/Shell-Expansions.html')}
${lienKet({ khoa: 'linux-bash', bai: 'lnx-1-2-duong-dan', title: 'Linux & Bash 1.2 — Paths', sub: 'The file system tree, paths and navigation in depth', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Terminal chỉ là cách ra lệnh bằng chữ</h2>
<p class="lead">Học xong bài này bạn đi lại trong máy và quản lý tệp bằng terminal: biết mình đang ở đâu, đọc đường dẫn tuyệt đối và tương đối, tạo, chép, chuyển và xoá, xử lý tên có dấu cách, xem tệp ẩn, dùng ký tự đại diện, ghép lệnh bằng ống và <code>&gt;</code>, và đọc mã thoát. Git (1.3), npm (1.5), máy chủ và script deploy đều được điều khiển từ đây — và ý tưởng "đường dẫn" quay lại trong mọi <code>import './x.js'</code> và <code>src="…"</code> bạn sẽ viết.</p>

<h3>Mở terminal</h3>
<table>
<thead><tr><th>Hệ điều hành</th><th>Mở</th><th>Shell</th></tr></thead>
<tbody>
<tr><td>macOS</td><td>Terminal (Spotlight → "Terminal"), hoặc khung terminal trong VS Code (<code>Ctrl+&#96;</code>)</td><td>zsh</td></tr>
<tr><td>Windows</td><td>Windows Terminal → <strong>Git Bash</strong> (cài cùng Git), hoặc WSL</td><td>bash</td></tr>
<tr><td>Linux</td><td>Terminal (<code>Ctrl+Alt+T</code>)</td><td>bash</td></tr>
</tbody>
</table>
<p>Mọi output dưới đây được ghi trong <strong>bash</strong>, ở một thư mục nhà mới tinh có sẵn <code>projects/shop/index.html</code>, <code>projects/shop/src/app.js</code>, <code>projects/notes.txt</code> và một <code>projects/blog</code> rỗng. Mỗi dòng bắt đầu bằng <code>$ </code> là thứ được gõ; phần còn lại là máy trả lời. zsh và Git Bash in cùng kết quả, đôi khi khác chữ trong thông báo lỗi.</p>

<h3>Bước 1 — tôi đang ở đâu? <code>pwd</code>, <code>ls</code>, <code>cd</code></h3>
${ra(OUT['_t1/terminal/out/navigate'])}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">pwd</span><span class="lz-t">in thư mục làm việc</span><span class="lz-d">Thư mục mà mọi lệnh chạy trong đó. Khi có gì "không tìm thấy", kiểm cái này trước.</span></div>
<div class="lz-layer"><span class="lz-k">ls</span><span class="lz-t">liệt kê</span><span class="lz-d"><code>ls -F</code> đánh dấu thư mục bằng <code>/</code>; <code>ls thư-mục</code> liệt kê thư mục khác mà không di chuyển.</span></div>
<div class="lz-layer"><span class="lz-k">cd tên</span><span class="lz-t">đổi thư mục, đi xuống</span><span class="lz-d">Vào một thư mục bên trong thư mục hiện tại. Nhiều cấp một lúc: <code>cd projects/shop</code>.</span></div>
<div class="lz-layer"><span class="lz-k">cd ..</span><span class="lz-t">lên một cấp</span><span class="lz-d"><code>..</code> nghĩa là "thư mục cha"; <code>../..</code> là lên hai cấp.</span></div>
</div>

<h3>Bước 2 — đường dẫn tuyệt đối và tương đối</h3>
${ra(OUT['_t1/terminal/out/paths'])}
<p>Đường dẫn là lời chỉ đường tới một tệp. Đường dẫn <strong>tuyệt đối</strong> bắt đầu bằng <code>/</code> (trên Windows là <code>C:\\</code>) và cho cả lộ trình từ trên cùng — dùng được từ bất kỳ thư mục nào. Đường dẫn <strong>tương đối</strong> bắt đầu từ <em>chỗ bạn đang đứng</em>: từ <code>projects/shop/src</code>, <code>../index.html</code> nghĩa là "lên một cấp, rồi index.html" và chạy được, còn <code>notes.txt</code> trơn nghĩa là "notes.txt trong thư mục <em>này</em>" — mà ở đây không có, nó ở hai cấp phía trên (<code>../../notes.txt</code>).</p>
<div class="kv-grid">
  <div class="kv"><span class="k">.</span><span class="v">thư mục này — <code>./app.js</code></span></div>
  <div class="kv"><span class="k">..</span><span class="v">thư mục cha</span></div>
  <div class="kv"><span class="k">~</span><span class="v">thư mục nhà của bạn — <code>cd ~</code></span></div>
  <div class="kv"><span class="k">-</span><span class="v">với <code>cd</code>: thư mục trước đó (nó in ra nơi bạn vừa tới)</span></div>
  <div class="kv"><span class="k">/</span><span class="v">ở đầu: gốc của ổ đĩa; giữa đường dẫn: dấu ngăn</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — "No such file or directory" trong khi tệp rõ ràng có.</strong> Chín trên mười lần tệp vẫn ở đó, nhưng bạn đang đứng ở một thư mục khác với bạn nghĩ. Đường dẫn tương đối được đọc từ <code>pwd</code>, không phải từ chỗ tệp "lẽ ra" nằm. Chạy <code>pwd</code> và <code>ls</code>, rồi sửa đường dẫn hoặc <code>cd</code> tới đúng chỗ. Cùng lỗi đó sau này xuất hiện dưới dạng <code>&lt;img src&gt;</code> hỏng hay <code>import</code> thất bại.</p></div>

<h3>Bước 3 — tạo, chép, chuyển, xoá</h3>
${ra(OUT['_t1/terminal/out/files'])}
<table>
<thead><tr><th>Lệnh</th><th>Làm gì</th></tr></thead>
<tbody>
<tr><td><code>mkdir site</code> · <code>mkdir -p a/b/c</code></td><td>tạo thư mục · tạo mọi cấp còn thiếu</td></tr>
<tr><td><code>touch tệp</code></td><td>tạo tệp rỗng (hoặc cập nhật thời gian của nó)</td></tr>
<tr><td><code>echo chữ &gt; tệp</code> · <code>&gt;&gt; tệp</code></td><td>ghi (thay cả tệp!) · ghi nối thêm</td></tr>
<tr><td><code>cat tệp</code></td><td>in một tệp</td></tr>
<tr><td><code>cp a b</code></td><td>chép (<code>cp -r</code> cho thư mục)</td></tr>
<tr><td><code>mv a b</code> · <code>mv a thư-mục/</code></td><td>đổi tên · chuyển vào thư mục</td></tr>
<tr><td><code>rmdir dir</code> · <code>rm tệp</code> · <code>rm -r dir</code></td><td>xoá thư mục rỗng · một tệp · một thư mục cùng mọi thứ bên trong</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>rm</code> không có thùng rác, và <code>&gt;</code> lặng lẽ ghi đè.</strong> <code>rm -r old</code> xoá thư mục và nội dung ngay lập tức; không có gì hỏi "bạn chắc chứ?", và không khôi phục được. <code>echo x &gt; index.html</code> trên tệp có sẵn sẽ xoá sạch nó. Trước khi <code>rm -r</code>, chạy <code>ls</code> trên đúng đường dẫn đó để thấy chính xác cái gì sẽ mất; không bao giờ chạy <code>rm -rf</code> với một đường dẫn ghép từ biến mà bạn chưa in ra. Git (1.3) mới là lưới an toàn thật cho mã.</p></div>

<h3>Bước 4 — dấu cách trong tên, tệp ẩn</h3>
${ra(OUT['_t1/terminal/out/spaces'])}
<p>Shell tách lệnh theo dấu cách: <code>mkdir my project</code> là "tạo <code>my</code>, tạo <code>project</code>" — hai thư mục. Dấu nháy (<code>"my project"</code>) hoặc gạch chéo ngược (<code>my\\ project</code>) giữ tên thành một khối. <code>cd my project</code> lặng lẽ đi vào <code>my</code> trong bash này; zsh thì báo lỗi. Lập trình viên tránh hẳn dấu cách trong tên tệp: <code>my-project</code>.</p>
${ra(OUT['_t1/terminal/out/hidden'])}
<p>Tên bắt đầu bằng dấu chấm bị ẩn khỏi <code>ls</code>: <code>.env</code> (bí mật, Chương 7), <code>.gitignore</code> và thư mục <code>.git</code> (1.3). <code>ls -a</code> hiện chúng kèm <code>.</code> và <code>..</code>; <code>ls -A</code> hiện chúng mà không có hai cái đó.</p>

<h3>Bước 5 — ký tự đại diện, ống và chuyển hướng</h3>
${ra(OUT['_t1/terminal/out/globs'])}
<p>Shell thay <code>*.js</code> bằng các tên khớp <em>trước khi</em> lệnh chạy — <code>echo</code> chưa từng thấy dấu sao. <code>|</code> (ống) gửi output của lệnh này vào input của lệnh sau.</p>
${ra(OUT['_t1/terminal/out/pipes'])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">sort fruits.txt</span><span class="lz-t">dòng giống nhau nằm cạnh nhau</span><span class="lz-d">apple apple apple banana cherry</span></div>
<div class="lz-step"><span class="lz-k">| uniq -c</span><span class="lz-t">đếm các dòng giống nhau liền nhau</span><span class="lz-d">3 apple · 1 banana · 1 cherry</span></div>
<div class="lz-step"><span class="lz-k">| sort -r</span><span class="lz-t">số lớn nhất lên đầu</span><span class="lz-d">3 apple ở trên cùng</span></div>
<div class="lz-step"><span class="lz-k">| head -1</span><span class="lz-t">giữ một dòng</span><span class="lz-d">"dòng hay gặp nhất" — trả lời bằng bốn công cụ bé xíu</span></div>
</div>

<h3>Bước 5b — tìm tệp và tìm chữ</h3>
${ra(OUT['_t1/terminal/out/search'])}
<p><code>find</code> tìm theo <em>tên</em> (<code>-name "*.js"</code> — đặt trong nháy để shell không tự mở rộng dấu sao) hoặc loại (<code>-type f</code> = tệp). <code>grep -rn</code> tìm <em>bên trong</em> tệp, đệ quy, kèm số dòng — đúng định dạng <code>tệp:dòng</code> bạn sẽ gặp lại trong thông báo lỗi (Bài 10.2). Để ý <code>grep "shop"</code> không tìm thấy <code>&lt;h1&gt;Shop&lt;/h1&gt;</code>: grep phân biệt hoa thường trừ khi thêm <code>-i</code>. "Search in files" của VS Code (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>F</kbd>, Bài 1.2) là cùng ý tưởng, có thêm cửa sổ bao quanh.</p>

<h3>Bước 6 — lỗi và mã thoát</h3>
${ra(OUT['_t1/terminal/out/errors'])}
<p>Mọi lệnh kết thúc bằng một <strong>mã thoát</strong>, lưu trong <code>$?</code>: <code>0</code> là thành công, mọi số khác là thất bại (<code>127</code> = không tìm thấy lệnh, <code>1</code> = lỗi chung). Bạn hiếm khi gõ <code>echo $?</code>, nhưng mọi thứ xung quanh đều đọc nó: <code>&amp;&amp;</code> chỉ chạy lệnh sau khi được 0 (<code>mkdir demo &amp;&amp; cd demo</code>), CI đánh hỏng bản build khi khác 0, và <code>npm test</code> (1.5) báo đạt/hỏng theo cách này. <code>which node</code> cho biết một cái tên chạy chương trình nào — cách sửa đầu tiên cho "command not found" là kiểm chính tả, rồi kiểm chương trình đã cài và nằm trong <code>PATH</code>.</p>
<table>
<thead><tr><th>Mẹo tiết kiệm thời gian</th><th>Làm gì</th></tr></thead>
<tbody>
<tr><td><kbd>Tab</kbd></td><td>tự hoàn thành tên tệp và thư mục — đồng thời tránh gõ sai</td></tr>
<tr><td><kbd>↑</kbd> / <kbd>↓</kbd></td><td>lệnh trước / sau</td></tr>
<tr><td><kbd>Ctrl</kbd>+<kbd>C</kbd></td><td>dừng lệnh đang chạy (máy chủ, script bị treo)</td></tr>
<tr><td><kbd>Ctrl</kbd>+<kbd>R</kbd></td><td>tìm trong lịch sử lệnh</td></tr>
<tr><td><code>clear</code> hoặc <kbd>Ctrl</kbd>+<kbd>L</kbd></td><td>xoá màn hình</td></tr>
<tr><td><code>man ls</code> / <code>ls --help</code></td><td>hướng dẫn của một lệnh (<kbd>q</kbd> để thoát)</td></tr>
</tbody>
</table>

<div class="callout ok">
<p><strong>🧪 Luyện tập (30 phút) — thư mục dự án, chỉ dùng terminal</strong></p>
<ol>
<li>Trong thư mục nhà: <code>mkdir -p practice/portfolio/css practice/portfolio/js practice/portfolio/img</code>, rồi <code>cd practice/portfolio</code> và kiểm bằng <code>pwd</code>.</li>
<li>Tạo <code>index.html</code>, <code>css/style.css</code>, <code>js/app.js</code> bằng <code>touch</code>, và ghi <code>&lt;h1&gt;Portfolio&lt;/h1&gt;</code> vào <code>index.html</code> bằng <code>echo … &gt;</code>.</li>
<li>Tạo <code>about me.html</code> (có dấu cách, dùng nháy), rồi đổi tên thành <code>about.html</code> bằng <code>mv</code>.</li>
<li>Từ trong <code>js/</code>, không <code>cd</code> ra ngoài, in <code>../index.html</code> bằng <code>cat</code>. Rồi <code>cd -</code>.</li>
<li>Tạo tệp ẩn <code>.gitignore</code>; liệt kê tất cả bằng <code>ls -A</code>; đếm mọi tệp trong dự án bằng <code>find . -type f | wc -l</code>.</li>
</ol>
<p>Gợi ý: nhấn <kbd>Tab</kbd> sau vài chữ đầu của mỗi tên — không tự hoàn thành tức là đường dẫn sai.</p>
<p><strong>Xong khi:</strong> <code>ls -A</code> trong <code>portfolio</code> in <code>.gitignore about.html css img index.html js</code> (mỗi tên một dòng), <code>find . -type f | wc -l</code> in <code>5</code>, và <code>cat index.html</code> hiện tiêu đề của bạn. Sau đó làm module Code Lab 1.1.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">terminal / shell</span><span class="v">cửa sổ dòng lệnh / chương trình đọc lệnh (bash, zsh).</span></div>
  <div class="kv"><span class="k">working directory</span><span class="v">thư mục làm việc hiện tại — <code>pwd</code>.</span></div>
  <div class="kv"><span class="k">absolute path</span><span class="v">đường dẫn tuyệt đối — bắt đầu từ <code>/</code>.</span></div>
  <div class="kv"><span class="k">relative path</span><span class="v">đường dẫn tương đối — tính từ chỗ đang đứng.</span></div>
  <div class="kv"><span class="k">parent folder (..)</span><span class="v">thư mục cha.</span></div>
  <div class="kv"><span class="k">argument / flag</span><span class="v">đối số / cờ — <code>ls -a projects</code>.</span></div>
  <div class="kv"><span class="k">hidden file</span><span class="v">tệp ẩn — tên bắt đầu bằng dấu chấm.</span></div>
  <div class="kv"><span class="k">wildcard (glob)</span><span class="v">ký tự đại diện — <code>*.js</code>.</span></div>
  <div class="kv"><span class="k">pipe / redirect</span><span class="v">ống <code>|</code> / chuyển hướng <code>&gt;</code> <code>&gt;&gt;</code>.</span></div>
  <div class="kv"><span class="k">exit code</span><span class="v">mã thoát — 0 là thành công.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li><code>pwd</code> đang ở đâu, <code>ls</code> có gì ở đây, <code>cd</code> di chuyển (<code>..</code> lên, <code>~</code> về nhà, <code>-</code> quay lại).</li>
  <li>Đường dẫn tuyệt đối bắt đầu từ <code>/</code>; tương đối bắt đầu từ <code>pwd</code> — nguyên nhân của hầu hết lỗi "not found".</li>
  <li><code>mkdir -p</code>, <code>touch</code>, <code>cp</code>, <code>mv</code>, <code>rm -r</code> — và <code>rm</code> với <code>&gt;</code> không hoàn tác được.</li>
  <li>Dấu cách tách đối số: đặt tên trong nháy hoặc tránh dấu cách; tệp chấm bị ẩn (<code>ls -A</code>).</li>
  <li><code>*.js</code> được mở rộng trước khi lệnh chạy; <code>|</code> nối các công cụ nhỏ.</li>
  <li>Mã thoát 0 = thành công; 127 = không tìm thấy lệnh; công cụ và CI đọc nó.</li>
</ul>
${nguon('📗', 'MDN — Command line crash course', 'Terminal cho lập trình viên web: di chuyển, tệp, ống', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Environment_setup/Command_line')}
${nguon('📘', 'GNU Bash manual — Shell expansions', 'Cách shell biến *.js, ~ và dấu nháy thành đối số', 'https://www.gnu.org/software/bash/manual/html_node/Shell-Expansions.html')}
${lienKet({ khoa: 'linux-bash', bai: 'lnx-1-2-duong-dan', title: 'Linux & Bash 1.2 — Đường dẫn', sub: 'Cây hệ thống tệp, đường dẫn và di chuyển, chuyên sâu', cta: 'Mở bài' })}
</div>
`,
};
