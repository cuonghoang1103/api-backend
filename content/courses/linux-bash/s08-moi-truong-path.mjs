/**
 * Linux & Bash — Chương 8: Môi trường, PATH & file khởi động.
 * PATH và "command not found" · file khởi động · biến môi trường và bí mật · tuỳ biến shell · quiz.
 * Output CHẠY THẬT Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * Nâng cấp 28/09/2026: bài 8.0 slide (deck lx-08, 29 slide) + slide/🧪/🗂/📌 trong 8.1–8.4; đào sâu: sudo và
 * secure_path đo thật (sudo -E KHÔNG cứu PATH), bảng cờ type/command/hash/which, path_helper của macOS xếp lại
 * PATH, ma trận file khởi động đo bằng dấu mốc (HOME=… bash -l/-i/-c, BASH_ENV, sh -l, .bash_profile thắng),
 * ssh host 'lệnh' đọc ~/.bashrc tới cái chốt (bash -lc không cứu nvm), zsh .zshenv→.zprofile→.zshrc→.zlogin đo
 * bằng ZDOTDIR, cron chạy thật (6 biến), export/declare -x/export -n, môi trường đóng băng (/proc/PID/environ),
 * .env có dấu cách làm vỡ cả xargs lẫn source, 7 chỗ lộ bí mật, HISTCONTROL Ubuntu/Fedora/macOS; "Chạy thử từng
 * bước" + "macOS/WSL khác gì" mỗi bài; quiz 10 câu. Sửa 4 chỗ cũ SAI: ví dụ bảng băm (gán PATH tự xoá bảng),
 * bẫy sudo -E, output "Gỡ xem file nào đã chạy" (2 dòng chứ không phải 3), chú thích "ssh host lệnh không đọc gì".
 * Output MỚI chạy thật trong container ubuntu:24.04 (arm64), trên Mac M1 (macOS 27) và đọc trên Fedora 44.
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Flinux-bash%2Flearn&reflabel=Linux%20%26%20Bash';

export default {
  title: 'Chapter 8 — Environment, PATH & startup files|||Chương 8 — Môi trường, PATH & file khởi động',
  description: 'Vì sao có "command not found", sửa file nào, và shell đăng nhập khác shell tương tác ra sao. Chương này giải thích dứt điểm câu hỏi "chạy tay thì được, cron thì hỏng" và chỉ chỗ đặt biến môi trường cho từng loại tiến trình.',
  lessons: [
    /* ─────────────────────────── 8.0 ─────────────────────────── */
    {
      title: '8.0 — Chapter 8 slides: PATH, startup files and the environment in pictures|||8.0 — Slide Chương 8: PATH, file khởi động và môi trường bằng hình',
      slug: 'lnx-8-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 29 slide của Chương 8: shell tìm lệnh qua bảng băm và PATH, sudo và secure_path, path_helper của macOS, sơ đồ file khởi động bash/zsh đo thật, cron chỉ có 6 biến, export và môi trường đóng băng, .env, bí mật, bí danh/PS1/lịch sử.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Slides</span>
<h2>The whole chapter in 29 slides</h2>
<p class="lead">Skim these before the lessons to see the shape of the chapter, then come back after the quiz as a revision sheet. Every picture reappears inside the lesson that explains it: the shell searching the hash table and then PATH from left to right, the map of which startup file bash reads for which kind of shell, the same map for zsh, and a parent process handing a copy of its environment — and nothing else — to its child.</p>
<p>Slides 3–9 belong to Lesson 8.1 (including <code>sudo</code>'s own PATH and macOS's <code>path_helper</code>), 10–15 to 8.2 (including <code>ssh host 'command'</code>, zsh and a real cron run), 16–20 to 8.3 and 21–24 to 8.4. The last five are the chapter's common mistakes, an Ubuntu/Fedora/macOS comparison, a two-page cheat sheet and a 40-minute practice session. Every terminal is real output recorded on 28/09/2026 in an Ubuntu 24.04 container (with real <code>sshd</code> and real <code>cron</code>), on a Mac M1 and on a Fedora 44 machine; startup files were measured with marker lines in throw-away copies, never in a real home directory. The slides are in Vietnamese; the diagrams and code read the same in any language.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Slide</span>
<h2>Cả chương trong 29 slide</h2>
<p class="lead">Lướt bộ này trước khi vào bài để thấy hình dạng của chương, rồi quay lại sau bài kiểm tra như một tờ ôn tập. Mỗi hình ở đây đều xuất hiện lại trong bài giảng giải thích nó: shell lục bảng băm rồi lục PATH từ trái sang phải, tấm bản đồ "loại shell nào thì bash đọc file khởi động nào", tấm bản đồ tương tự cho zsh, và một tiến trình cha trao cho con một BẢN SAO môi trường của nó — và không gì khác.</p>
<p>Slide 3–9 thuộc Bài 8.1 (gồm PATH riêng của <code>sudo</code> và <code>path_helper</code> của macOS), 10–15 thuộc 8.2 (gồm <code>ssh host 'lệnh'</code>, zsh và một lần cron chạy thật), 16–20 thuộc 8.3 và 21–24 thuộc 8.4. Năm slide cuối là những sai lầm hay gặp, bảng so sánh Ubuntu/Fedora/macOS, bảng tra nhanh hai trang và một buổi thực hành 40 phút. Mọi terminal trên slide là output THẬT, ghi ngày 28/09/2026 trong container Ubuntu 24.04 (có <code>sshd</code> thật và <code>cron</code> thật), trên Mac M1 và trên máy Fedora 44; file khởi động được đo bằng các dòng dấu mốc trong bản sao vứt đi, không bao giờ trong thư mục nhà thật — con số trên máy bạn có thể khác, quy luật thì không.</p>
</div>
${gallery('lx-08', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Shell tìm lệnh: bảng băm rồi PATH'], [4, 'Bí danh → hàm → dựng sẵn → PATH'], [5, 'Bảng băm và hash -r'],
  [6, 'Thứ tự PATH chọn phiên bản'], [7, 'Dấu . trong PATH'], [8, 'PATH đến từ đâu, path_helper'], [9, 'sudo và secure_path'],
  [10, 'Ba loại shell'], [11, 'bash đọc file nào'], [12, 'Đo bằng dấu mốc'], [13, "ssh host 'lệnh' và cái chốt"],
  [14, 'zsh: bốn file khởi động'], [15, 'cron chỉ có 6 biến'],
  [16, 'export: biến shell và biến môi trường'], [17, 'Con không sửa được cha'], [18, 'Biến cho một lệnh: env'],
  [19, 'Nạp .env cho đúng'], [20, 'Bảy chỗ lộ bí mật'],
  [21, 'Bí danh và hàm'], [22, 'Đọc PS1'], [23, 'Lịch sử và bí mật'], [24, 'Dotfile gọn gàng'],
  [25, 'Sai lầm hay gặp'], [26, 'Ubuntu · Fedora · macOS'], [27, 'Bảng tra nhanh (1/2)'], [28, 'Bảng tra nhanh (2/2)'], [29, 'Thực hành chương 8'],
])}
`,
    },
    /* ─────────────────────────── 8.1 ─────────────────────────── */
    {
      title: '8.1 — PATH, and why "command not found"|||8.1 — PATH, và vì sao có "command not found"',
      slug: 'lnx-8-1-path',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Shell tìm một lệnh theo đúng thứ tự nào, type/command -v/which khác nhau ra sao, bảng băm và vì sao lệnh vừa cài lại "không tìm thấy", thứ tự PATH quyết định phiên bản nào chạy, và vì sao dấu chấm trong PATH là lỗ hổng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>PATH, and why "command not found"</h2>
<p class="lead">You type <code>node</code> and something runs. Which something, and how did the shell decide? The answer is a colon-separated list of directories searched left to right — plus three shortcuts that get consulted first. Almost every "command not found", "wrong version is running" and "works for me but not in cron" traces back to this one lookup.</p>

<h3>What PATH actually is</h3>
${slide('lx-08', 3, 'Shell tìm lệnh: bảng băm trước, rồi PATH trái → phải')}
<pre><code>echo "\$PATH"
echo "\$PATH" | tr ':' '\\n'</code></pre>
<div class="out">/home/deploy/.local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
/home/deploy/.local/bin
/usr/local/sbin
/usr/local/bin
/usr/sbin
/usr/bin
/sbin
/bin</div>
<p>A plain string, colons between directories, searched <strong>left to right, first match wins</strong>. It is not a search of the whole filesystem, and it is not recursive: a program in <code>/opt/tools/bin/foo</code> is invisible unless <code>/opt/tools/bin</code> is itself listed.</p>

<h3>The full lookup order</h3>
${slide('lx-08', 4, 'Bí danh → hàm → dựng sẵn → bảng băm → PATH; type, command -v, which')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Alias</span><span class="lz-t">alias ll='ls -alF'</span><span class="lz-d">Checked first, and only in an interactive shell. This is why an alias works when you type it but not inside a script.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Function</span><span class="lz-t">a shell function you defined</span><span class="lz-d">Overrides any program of the same name. Defining <code>ls() { … }</code> shadows /bin/ls everywhere in that shell.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Builtin</span><span class="lz-t">cd, echo, export, read, [</span><span class="lz-d">Part of bash itself, no process launched. <code>echo</code> is BOTH a builtin and /bin/echo — the builtin wins, and they differ in flags.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Hash table</span><span class="lz-t">a remembered full path from earlier</span><span class="lz-d">Bash caches where it found each command. Fast, and the cause of a stale lookup — see below.</span></div>
  <div class="lz-step"><span class="lz-k">5 · PATH search</span><span class="lz-t">each directory, left to right</span><span class="lz-d">First executable file with that name wins. If none: "command not found", exit code 127.</span></div>
</div>
<pre><code>type ls                 <span class="tok-comment"># what would run, and WHY</span>
type -a echo            <span class="tok-comment"># -a: every match, in order</span>
type -t cd              <span class="tok-comment"># just the kind: alias/function/builtin/file</span>
command -v node         <span class="tok-comment"># the path, script-friendly, POSIX</span>
which node              <span class="tok-comment"># external program — avoid, see below</span></code></pre>
<div class="out">ls is aliased to &#96;ls --color=auto'
echo is a shell builtin
echo is /usr/bin/echo
builtin
/home/deploy/.nvm/versions/node/v22.6.0/bin/node</div>
<div class="callout ok"><strong><code>type</code> for humans, <code>command -v</code> for scripts, never <code>which</code>.</strong> <code>type</code> tells you the whole truth including aliases and functions; <code>command -v</code> is a builtin that works everywhere and returns a clean path; <code>which</code> is an external program that does not exist on every system, cannot see aliases or functions, and has inconsistent exit codes between distributions. When a script says a command is missing but you can run it by hand, <code>type</code> is the command that explains why.</div>

<h3>The hash table: a command that "disappeared"</h3>
${slide('lx-08', 5, 'Bảng băm nhớ đường cũ — hash -r bắt tìm lại')}
<pre><code>node --version                   <span class="tok-comment"># runs /usr/local/bin/node — and bash hashes that path</span>
sudo mv /usr/local/bin/node /usr/bin/node    <span class="tok-comment"># still on PATH; PATH itself unchanged</span>
node --version
hash -r; node --version</code></pre>
<div class="out">v20.11.1
bash: /usr/local/bin/node: No such file or directory
v20.11.1</div>
<p>The error names the <em>old</em> path, even though a <code>node</code> is still sitting in <code>/usr/bin</code>, which is on <code>PATH</code> — because bash remembered where it found <code>node</code> last time and did not look again. Three ways out:</p>
<div class="callout warn"><strong>Measured on bash 5.2 (Ubuntu 24.04, 28/09/2026):</strong> <em>assigning</em> <code>PATH</code> — even the no-op <code>PATH=\$PATH</code> — makes bash empty its hash table on the spot. So "I changed PATH and bash still runs the old path" is not a hash problem; the stale entry bites precisely when a file moves or disappears <em>while <code>PATH</code> stays the same</em>: uninstalling the copy in <code>/usr/local/bin</code> while another lives in <code>/usr/bin</code>, or a version manager replacing a file behind your back.</div>
<pre><code>hash -r                 <span class="tok-comment"># forget every remembered path</span>
hash -d node            <span class="tok-comment"># forget just this one</span>
hash                    <span class="tok-comment"># show the current table</span></code></pre>
<div class="out">hits    command
   4    /usr/bin/git
   2    /usr/bin/docker</div>
<div class="callout">This is also the answer to "I just installed it and bash says command not found". If bash previously <em>failed</em> to find the command it does not cache the failure — but if a shell was open before you added a new directory to <code>PATH</code>, that shell's <code>PATH</code> is still the old one entirely. <code>hash -r</code> fixes a stale <em>hit</em>; a new shell (or re-sourcing your rc file) fixes a stale <code>PATH</code>. Knowing which of the two you have saves a reboot.</div>

<h3>Order decides which version runs</h3>
${slide('lx-08', 6, 'Thứ tự trong PATH chọn phiên bản; PATH=/x xoá sạch danh sách')}
<pre><code>type -a python3</code></pre>
<div class="out">python3 is /home/deploy/.local/bin/python3
python3 is /usr/bin/python3</div>
<pre><code><span class="tok-comment"># Prepend — your version wins</span>
export PATH="\$HOME/.local/bin:\$PATH"

<span class="tok-comment"># Append — only used if nothing earlier provides it</span>
export PATH="\$PATH:/opt/tools/bin"</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Prepend</span><span class="v">For version managers (nvm, pyenv, rbenv) and your own scripts. You are deliberately shadowing the system version.</span></div>
  <div class="kv"><span class="k">Append</span><span class="v">For extra tools that should never override a system command. Safer default when adding a third-party directory.</span></div>
</div>
<div class="callout warn"><strong>Never write <code>PATH="/opt/bin"</code> without <code>:\$PATH</code>.</strong> That replaces the whole list, so <code>ls</code>, <code>grep</code> and <code>sudo</code> all stop being found and the shell becomes almost unusable — every command returns "command not found", including the ones you would use to fix it. Recovery is <code>export PATH=/usr/bin:/bin</code> typed from memory, or opening a new shell. Always include <code>\$PATH</code> on one side.</div>

<h3>Why the current directory must not be in PATH</h3>
${slide('lx-08', 7, 'Dấu . hay mục rỗng trong PATH = chạy file của người lạ')}
<pre><code>echo "\$PATH"
<span class="tok-comment"># .:/usr/local/bin:/usr/bin:/bin      ← the leading dot is the problem</span>
cd /tmp/downloaded-project
ls</code></pre>
<div class="out">README.md  ls  setup.sh</div>
<p>There is a file called <code>ls</code> in that directory. With <code>.</code> first in <code>PATH</code>, typing <code>ls</code> runs <em>that</em> file — whatever it contains — with your privileges. The attacker does not need to break anything; they just need you to <code>cd</code> into a directory they control and type a normal command.</p>
<div class="callout warn">This is why <code>.</code> is not in the default <code>PATH</code> on any modern system, and why running a script in the current directory requires the explicit <code>./script.sh</code> from Lesson 1.2. The dot is not a typo you keep having to add — it is the security boundary. If you ever see <code>.</code> or an empty entry (a leading, trailing or doubled colon, which means the same thing) in a <code>PATH</code>, treat it as a finding.</div>
<pre><code><span class="tok-comment"># Empty entries are equivalent to "." — check for all three forms</span>
echo "\$PATH" | grep -E '(^|:)(\\.)?(:|\$)' &amp;&amp; echo "PATH contains . or an empty entry"</code></pre>

<h3>Where PATH entries come from</h3>
${slide('lx-08', 8, 'PATH đến từ đâu — và macOS xếp lại nó bằng path_helper')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">/etc/environment</span><span class="lz-lnote">System-wide default, read by PAM at login. Plain <code>KEY=value</code> lines only — <strong>not</strong> a shell script, so <code>\$PATH</code> and <code>export</code> do not work there.</span></div>
  <div class="lz-layer"><span class="lz-lname">/etc/profile and /etc/profile.d/*.sh</span><span class="lz-lnote">System-wide, for login shells. This is where packages drop their PATH additions.</span></div>
  <div class="lz-layer"><span class="lz-lname">~/.profile · ~/.bash_profile</span><span class="lz-lnote">Your login shell. The right place for <code>PATH</code>, because it is inherited by everything you start afterwards.</span></div>
  <div class="lz-layer"><span class="lz-lname">~/.bashrc</span><span class="lz-lnote">Interactive shells. Adding <code>PATH</code> here is common and mostly works, but it runs on every new shell — hence the duplicate-entry problem below.</span></div>
  <div class="lz-layer"><span class="lz-lname">systemd units · cron</span><span class="lz-lnote">Neither reads any of the above. cron's PATH is typically just <code>/usr/bin:/bin</code>. Lesson 8.2 and Chapter 11 cover this properly.</span></div>
</div>
<pre><code><span class="tok-comment"># PATH grows on every shell — the classic symptom of a bad rc file</span>
echo "\$PATH" | tr ':' '\\n' | sort | uniq -d</code></pre>
<div class="out">/home/deploy/.local/bin
/home/deploy/.local/bin</div>
<p>A line like <code>export PATH="\$HOME/.local/bin:\$PATH"</code> in <code>~/.bashrc</code> prepends again every time a shell starts — and shells nest, so <code>tmux</code> inside <code>ssh</code> inside a terminal gives you three copies. Harmless in effect but a sign the line is in the wrong file, and it makes <code>PATH</code> genuinely hard to read when debugging. The idempotent form (Lesson 7.3):</p>
<pre><code>case ":\$PATH:" in
  *":\$HOME/.local/bin:"*) ;;                        <span class="tok-comment"># already there, do nothing</span>
  *) export PATH="\$HOME/.local/bin:\$PATH" ;;
esac</code></pre>

<h3>sudo has its own PATH — measured</h3>
${slide('lx-08', 9, 'sudo dùng secure_path — sudo -E cũng không cứu PATH')}
<p>The trap at the bottom of this lesson is common enough to deserve an experiment. A fake <code>node</code> lives in <code>~/.nvm-gia/bin</code>, which is on <em>your</em> <code>PATH</code>:</p>
<pre><code>node --version
sudo node --version
sudo -E node --version
sudo env | grep ^PATH
sudo "\$(command -v node)" --version
sudo env PATH="\$PATH" node --version</code></pre>
<div class="out">v22.6.0
sudo: node: command not found
sudo: node: command not found
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin
v22.6.0
v22.6.0</div>
<p>Three things to read off that output. <code>sudo</code> uses the value of <code>secure_path</code> in <code>/etc/sudoers</code> (on Ubuntu 24.04: <code>/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin</code>), not yours. <code>-E</code> ("preserve environment") does not change that, because <code>secure_path</code> is applied on top of whatever is preserved. And the error comes from <code>sudo</code> itself, with exit code <strong>1</strong> — not bash's 127 — so a script that checks for 127 will misread it. The two lines that work both avoid a <code>PATH</code> lookup inside <code>sudo</code>: one hands it an absolute path, the other runs <code>env</code> (which <em>is</em> on <code>secure_path</code>) with an explicit <code>PATH</code> for just that one command.</p>

<h3>Debugging a PATH problem</h3>
<pre><code>type -a mycommand                <span class="tok-comment"># 1. what does the shell think it is?</span>
echo "\$PATH" | tr ':' '\\n'       <span class="tok-comment"># 2. is the directory even listed?</span>
ls -l /opt/tools/bin/mycommand   <span class="tok-comment"># 3. does the file exist, and is it +x?</span>
hash -r                          <span class="tok-comment"># 4. clear a stale cached path</span>
bash -lc 'echo \$PATH'            <span class="tok-comment"># 5. what does a LOGIN shell see?</span>
env -i bash -c 'echo \$PATH'      <span class="tok-comment"># 6. what does a bare environment see?</span></code></pre>
<div class="out">bash: type: mycommand: not found
/usr/local/bin
/usr/bin
/bin
-rwxr-xr-x 1 root root 2048 Aug 22 15:02 /opt/tools/bin/mycommand</div>
<p>Steps 1–3 identify almost every case: the command exists and is executable, but its directory is not in <code>PATH</code>. Step 6 is the cron simulation from Lesson 7.4 — if the command is found normally but not under <code>env -i</code>, the fix is either to add the directory to the cron environment or, better, to use an absolute path in the crontab.</p>
<div class="callout ok">In a script that must find a tool, do not assume <code>PATH</code>. Either check explicitly (<code>command -v docker &gt;/dev/null || die "docker not installed"</code> from Lesson 7.2) or set <code>PATH</code> at the top of the script yourself. A cron job that says "docker: command not found" is not a broken installation — it is a script that assumed an interactive environment.</div>


<h3>Flag table: type, command, hash, which</h3>
<table>
<tr><th>Command</th><th>What it does</th><th>Example (Ubuntu 24.04)</th></tr>
<tr><td><code>type NAME</code></td><td>What would run, and why — alias, keyword, function, builtin or file</td><td><code>type ls</code> → <code>ls is aliased to &#96;ls --color=auto'</code></td></tr>
<tr><td><code>type -a NAME</code></td><td>Every match, in lookup order</td><td><code>type -a echo</code> → builtin, <code>/usr/bin/echo</code>, <code>/bin/echo</code></td></tr>
<tr><td><code>type -t NAME</code></td><td>Only the kind: <code>alias</code> · <code>keyword</code> · <code>function</code> · <code>builtin</code> · <code>file</code></td><td><code>type -t cd</code> → <code>builtin</code></td></tr>
<tr><td><code>type -P NAME</code></td><td>Force a PATH search, ignoring aliases, functions and builtins</td><td><code>type -P ls</code> → <code>/usr/bin/ls</code></td></tr>
<tr><td><code>command -v NAME</code></td><td>One line saying what would run; exit 1 if nothing. The one to use in scripts</td><td><code>command -v khongco; echo \$?</code> → <code>1</code></td></tr>
<tr><td><code>command NAME args</code></td><td>Run NAME skipping aliases and functions</td><td><code>command ls</code></td></tr>
<tr><td><code>hash</code> · <code>hash -t NAME</code></td><td>Show the table · the remembered path of one name</td><td><code>hash -t xin</code> → <code>/home/an/b1/xin</code></td></tr>
<tr><td><code>hash -d NAME</code> · <code>hash -r</code></td><td>Forget one entry · forget everything</td><td>after moving a binary</td></tr>
<tr><td><code>hash -l</code></td><td>Print the table as re-usable <code>hash -p</code> commands</td><td><code>builtin hash -p /usr/bin/ls ls</code></td></tr>
<tr><td><code>which NAME</code></td><td>External program; sees only files on PATH, not aliases/functions/builtins</td><td><code>which cd; echo \$?</code> → <code>1</code></td></tr>
</table>
<div class="kv-grid">
  <div class="kv"><span class="k">When to use type</span><span class="v">Whenever <em>you</em> are asking "what is this name, really?" at a prompt. It is the only one that tells the whole truth.</span></div>
  <div class="kv"><span class="k">When to use command -v</span><span class="v">Inside a script, to test whether a tool exists: <code>command -v docker &gt;/dev/null || die "docker missing"</code>.</span></div>
  <div class="kv"><span class="k">When NOT to use which</span><span class="v">In scripts (it may be absent, and it says nothing about builtins), and whenever an alias or function could be involved.</span></div>
</div>

<h3>Try it step by step</h3>
<p>In a throw-away container (<code>docker run --rm -it ubuntu:24.04 bash</code>, then <code>useradd -m an &amp;&amp; su - an</code>), type these one at a time and predict each line before pressing Enter. <code>xin</code> is a tiny script that prints where it lives.</p>
<pre><code>mkdir -p ~/b1 ~/b2
printf '#!/bin/sh\\necho "toi o \$0"\\n' &gt; ~/b1/xin &amp;&amp; chmod +x ~/b1/xin
PATH=~/b1:~/b2:\$PATH
xin
hash
mv ~/b1/xin ~/b2/
xin
echo \$?
hash -t xin
hash -r
xin</code></pre>
<div class="out">toi o /home/an/b1/xin
hits    command
   1    /home/an/b1/xin
bash: /home/an/b1/xin: No such file or directory
127
/home/an/b1/xin
toi o /home/an/b2/xin</div>
<p>What to notice: the first run is recorded with one hit; after the move, bash does not search <code>~/b2</code> even though it is on <code>PATH</code> — it goes straight to the remembered file and fails with 127; <code>hash -t</code> shows the stale entry; after <code>hash -r</code> the normal left-to-right search finds the file in <code>~/b2</code>. Then try <code>PATH=".:\$PATH"</code> inside a directory holding a script called <code>ls</code>, and watch <code>ls</code> run the stranger's file — the whole security argument above, in two lines.</p>

<h3>On macOS and WSL</h3>
<table>
<tr><th>Thing</th><th>Ubuntu / WSL2</th><th>macOS (zsh 5.9)</th></tr>
<tr><td>Where the system PATH comes from</td><td><code>/etc/environment</code> (PAM) + <code>/etc/profile.d/*.sh</code></td><td><code>/etc/paths</code> + every file in <code>/etc/paths.d/</code>, stitched together by <code>/usr/libexec/path_helper</code>, which <code>/etc/zprofile</code> and <code>/etc/profile</code> run</td></tr>
<tr><td>Where Homebrew lives</td><td>(no Homebrew by default)</td><td><code>/opt/homebrew/bin</code> on Apple Silicon (Intel Macs: <code>/usr/local/bin</code>); the installer also drops <code>/etc/paths.d/homebrew</code></td></tr>
<tr><td><code>which</code></td><td>external program</td><td>a zsh <strong>builtin</strong> (<code>which which</code> → <code>shell built-in command</code>) that does show aliases; <code>whence -p ls</code> is the "PATH only" form</td></tr>
<tr><td>Clearing the hash table</td><td><code>hash -r</code></td><td><code>hash -r</code> or <code>rehash</code> (both work in zsh)</td></tr>
<tr><td>Extra entries you did not add</td><td>WSL appends the Windows <code>PATH</code> (<code>/mnt/c/…</code>) unless <code>appendWindowsPath=false</code> in <code>/etc/wsl.conf</code></td><td><code>/System/Cryptexes/…</code> and <code>/Library/Apple/usr/bin</code> from <code>/etc/paths.d</code></td></tr>
</table>
<p><code>path_helper</code> has one behaviour that surprises everybody, measured on a Mac M1 with macOS 27:</p>
<pre><code>env -i PATH="/Users/an/.nvm/bin:/usr/bin:/bin" /usr/libexec/path_helper -s</code></pre>
<div class="out">PATH="/usr/local/bin:/System/Cryptexes/App/usr/bin:/usr/bin:/bin:/usr/sbin:/sbin:…:/Library/Apple/usr/bin:/opt/homebrew/bin:/Users/an/.nvm/bin"; export PATH;</div>
<p>It puts <code>/etc/paths</code> first, then <code>/etc/paths.d</code>, and only then whatever was already in <code>PATH</code> — so a directory you prepended (<code>~/.nvm/bin</code>) gets pushed to the <em>end</em>, behind <code>/usr/bin</code>. Every login shell runs it again, so a <code>zsh -l</code> started inside an already-configured session quietly reorders your PATH. The fix is to add your own directories <em>after</em> it runs: in <code>~/.zprofile</code> or <code>~/.zshrc</code>, both read after <code>/etc/zprofile</code>. Chapter 15 covers Homebrew and the rest of macOS in depth.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> a teammate on your SWP391 project installed Node 22 "into their home directory", but <code>node --version</code> still says 20, and <code>sudo npm …</code> says <code>command not found</code>. Reproduce and fix it in a throw-away container — the <code>node</code> binaries are two one-line scripts, so nothing real is installed.</p><ol>
<li><code>docker run --rm -it ubuntu:24.04 bash</code>, then <code>apt-get update &amp;&amp; apt-get install -y sudo</code>, <code>useradd -m an</code>, <code>echo 'an ALL=(ALL) NOPASSWD:ALL' &gt; /etc/sudoers.d/an</code>. Create <code>/usr/local/bin/node</code> printing <code>v20.11.1</code>, then <code>su - an</code> and create <code>~/.local/bin/node</code> printing <code>v22.6.0</code> (both <code>chmod +x</code>).</li>
<li>Run <code>type -a node</code> and <code>node --version</code>. Is <code>~/.local/bin</code> on PATH, and in which position? Make v22 win using the idempotent <code>case ":\$PATH:"</code> form, run it twice, and prove with <code>echo "\$PATH" | tr ':' '\\n' | sort | uniq -d</code> that nothing was duplicated.</li>
<li>Run <code>sudo node --version</code> and <code>sudo -E node --version</code>; explain both errors with <code>sudo env | grep ^PATH</code>, then make it work in two different ways.</li>
<li>Delete <code>~/.local/bin/node</code> and run <code>node --version</code> again. Read the error, name its cause, and fix it without opening a new shell.</li></ol>
<p><strong>Done when:</strong> <code>node --version</code> prints <code>v22.6.0</code> as <code>an</code>, <code>sudo</code> reaches it by two routes, the duplicate check prints nothing, and you can say in one sentence why step 4 printed the <em>old</em> path.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">PATH</span><span class="v">A colon-separated list of directories the shell searches, left to right, for a command name.</span></div>
  <div class="kv"><span class="k">Builtin</span><span class="v">A command that is part of bash itself (<code>cd</code>, <code>export</code>); no program file is run.</span></div>
  <div class="kv"><span class="k">Alias</span><span class="v">Text substitution at the start of a command, active only in interactive shells.</span></div>
  <div class="kv"><span class="k">Hash table</span><span class="v">Bash's memory of where it last found each command; <code>hash -r</code> clears it.</span></div>
  <div class="kv"><span class="k">Prepend / append</span><span class="v">Put a directory at the front (wins) or back (fallback) of PATH.</span></div>
  <div class="kv"><span class="k">Exit code 127</span><span class="v">"Command not found" — or a remembered file that no longer exists.</span></div>
  <div class="kv"><span class="k">secure_path</span><span class="v">The fixed PATH that <code>sudo</code> uses, set in <code>/etc/sudoers</code>.</span></div>
  <div class="kv"><span class="k">path_helper</span><span class="v">The macOS tool that builds PATH from <code>/etc/paths</code> and <code>/etc/paths.d</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Lookup order: alias → function → builtin → hash table → PATH left to right; first match wins, nothing found is 127.</li>
<li><code>type -a</code> explains what runs; <code>command -v</code> is the script-safe test; <code>which</code> misses aliases, functions and builtins.</li>
<li>A stale hash entry appears when a file moves while PATH stays the same; assigning PATH already flushes the table, <code>hash -r</code> does it by hand.</li>
<li>Prepend to shadow on purpose, append for extras, never assign PATH without <code>\$PATH</code>, never allow <code>.</code> or an empty entry.</li>
<li><code>sudo</code> uses <code>secure_path</code>, and <code>-E</code> does not change that — use an absolute path or <code>sudo env PATH=…</code>.</li>
<li>On macOS, <code>path_helper</code> rebuilds PATH in every login shell and pushes your additions to the end — add them in <code>~/.zprofile</code>/<code>~/.zshrc</code>.</li>
</ul>

<a class="link-card" href="https://www.gnu.org/software/bash/manual/html_node/Command-Search-and-Execution.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Bash Manual — Command Search and Execution</span><span class="lc-sub">The five-step lookup order, stated formally, including exactly when the hash table is consulted and invalidated.</span></span>
</a>
<a class="link-card" href="https://mywiki.wooledge.org/BashFAQ/081" target="_blank" rel="noopener">
  <span class="lc-ico">🔧</span>
  <span class="lc-body"><span class="lc-title">BashFAQ 081 — "What is the difference between type, which and command -v?"</span><span class="lc-sub">Why <code>which</code> is the wrong answer, with the specific ways it misleads. Two minutes, and it settles the habit.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man8/pam_env.8.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">pam_env(8) — how /etc/environment is read</span><span class="lc-sub">Explains why that file is not a shell script and why <code>PATH=\$PATH:/opt/bin</code> in it silently produces a literal dollar sign.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man5/sudoers.5.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">sudoers(5) — secure_path and env_reset</span><span class="lc-sub">The exact rule behind "sudo: command not found": which variables sudo keeps, and why PATH is replaced even with <code>-E</code>.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: find the command</span><span class="lc-sub">Graded scenarios: a shadowed binary, a stale hash entry, a directory missing from PATH, and a script that works interactively but not under <code>env -i</code>.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> <code>sudo</code> uses a <em>different</em> <code>PATH</code> from yours. For security, <code>sudo</code> resets it to <code>secure_path</code> from <code>/etc/sudoers</code> — typically <code>/usr/sbin:/usr/bin:/sbin:/bin</code>, with none of your additions. So <code>node --version</code> works and <code>sudo node --version</code> says "command not found", which looks like a permission problem and is not. Use the absolute path (<code>sudo "\$(command -v node)" …</code>) or <code>sudo env "PATH=\$PATH" node …</code>. <code>sudo -E</code> is <em>not</em> a fix: it keeps your other variables, but <code>secure_path</code> still replaces <code>PATH</code> — on Ubuntu 24.04, <code>sudo -E node --version</code> still prints <code>sudo: node: command not found</code>. Do not edit <code>secure_path</code> to add your home directory — that hands root a directory you can write to, which is exactly what the setting exists to prevent.</div>
<p class="note-ct"><strong>Three commands worth keeping:</strong> <code>type -a &lt;cmd&gt;</code> to see everything that could run under that name and in what order; <code>echo "\$PATH" | tr ':' '\\n'</code> to read the list as a list; and <code>hash -r</code> when a command you just moved is still being looked up in its old home. Between them they answer nearly every "why is it running the wrong thing" question in under ten seconds.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>PATH, và vì sao có "command not found"</h2>
<p class="lead">Bạn gõ <code>node</code> và một thứ gì đó chạy. Thứ nào, và shell đã quyết định ra sao? Câu trả lời là một danh sách thư mục ngăn nhau bằng dấu hai chấm, được tìm từ trái sang phải — cộng thêm ba lối tắt được tra trước. Gần như mọi lỗi "command not found", "nó chạy nhầm phiên bản" và "máy tôi thì được mà cron thì hỏng" đều truy về đúng phép tra cứu này.</p>

<h3>PATH thật ra là gì</h3>
${slide('lx-08', 3, 'Shell tìm lệnh: bảng băm trước, rồi PATH trái → phải')}
<pre><code>echo "\$PATH"
echo "\$PATH" | tr ':' '\\n'</code></pre>
<div class="out">/home/deploy/.local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
/home/deploy/.local/bin
/usr/local/sbin
/usr/local/bin
/usr/sbin
/usr/bin
/sbin
/bin</div>
<p>Một chuỗi ký tự thường, các thư mục ngăn nhau bằng dấu hai chấm, được tìm <strong>từ trái sang phải, khớp đầu tiên thắng</strong>. Nó KHÔNG phải một cuộc tìm kiếm khắp hệ thống file, và nó KHÔNG đệ quy: một chương trình nằm ở <code>/opt/tools/bin/foo</code> là vô hình trừ khi chính <code>/opt/tools/bin</code> được liệt kê.</p>

<h3>Thứ tự tra cứu đầy đủ</h3>
${slide('lx-08', 4, 'Bí danh → hàm → dựng sẵn → bảng băm → PATH; type, command -v, which')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Bí danh</span><span class="lz-t">alias ll='ls -alF'</span><span class="lz-d">Được tra đầu tiên, và chỉ trong shell tương tác. Đây là lý do một bí danh chạy khi bạn gõ tay mà không chạy bên trong script.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Hàm</span><span class="lz-t">một hàm shell bạn đã định nghĩa</span><span class="lz-d">Ghi đè lên mọi chương trình cùng tên. Định nghĩa <code>ls() { … }</code> là che khuất /bin/ls ở khắp shell đó.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Lệnh dựng sẵn</span><span class="lz-t">cd, echo, export, read, [</span><span class="lz-d">Là một phần của chính bash, không khởi chạy tiến trình nào. <code>echo</code> vừa là lệnh dựng sẵn VỪA là /bin/echo — bản dựng sẵn thắng, và hai bản khác nhau ở các cờ.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Bảng băm</span><span class="lz-t">một đường dẫn đầy đủ đã nhớ từ trước</span><span class="lz-d">Bash lưu lại chỗ nó từng tìm thấy mỗi lệnh. Nhanh, và là nguyên nhân của một lần tra cứu cũ mèm — xem bên dưới.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Tìm trong PATH</span><span class="lz-t">từng thư mục, từ trái sang phải</span><span class="lz-d">File chạy được đầu tiên mang cái tên đó sẽ thắng. Không có cái nào: "command not found", mã thoát 127.</span></div>
</div>
<pre><code>type ls                 <span class="tok-comment"># cái gì sẽ chạy, và VÌ SAO</span>
type -a echo            <span class="tok-comment"># -a: mọi kết quả khớp, theo thứ tự</span>
type -t cd              <span class="tok-comment"># chỉ lấy loại: alias/function/builtin/file</span>
command -v node         <span class="tok-comment"># đường dẫn, hợp cho script, chuẩn POSIX</span>
which node              <span class="tok-comment"># chương trình ngoài — nên tránh, xem bên dưới</span></code></pre>
<div class="out">ls is aliased to &#96;ls --color=auto'
echo is a shell builtin
echo is /usr/bin/echo
builtin
/home/deploy/.nvm/versions/node/v22.6.0/bin/node</div>
<div class="callout ok"><strong><code>type</code> cho người, <code>command -v</code> cho script, đừng bao giờ <code>which</code>.</strong> <code>type</code> nói cho bạn toàn bộ sự thật kể cả bí danh và hàm; <code>command -v</code> là lệnh dựng sẵn, chạy ở mọi nơi và trả về một đường dẫn sạch; còn <code>which</code> là một chương trình ngoài không có trên mọi hệ thống, không nhìn thấy bí danh hay hàm, và có mã thoát không nhất quán giữa các bản phân phối. Khi một script nói thiếu lệnh mà bạn gõ tay lại chạy được, <code>type</code> chính là lệnh giải thích vì sao.</div>

<h3>Bảng băm: một lệnh "biến mất"</h3>
${slide('lx-08', 5, 'Bảng băm nhớ đường cũ — hash -r bắt tìm lại')}
<pre><code>node --version                   <span class="tok-comment"># chạy /usr/local/bin/node — và bash băm đường đó lại</span>
sudo mv /usr/local/bin/node /usr/bin/node    <span class="tok-comment"># vẫn nằm trong PATH; bản thân PATH không đổi</span>
node --version
hash -r; node --version</code></pre>
<div class="out">v20.11.1
bash: /usr/local/bin/node: No such file or directory
v20.11.1</div>
<p>Thông báo lỗi gọi tên đường dẫn <em>CŨ</em>, dù vẫn còn một <code>node</code> nằm ở <code>/usr/bin</code>, thư mục có trong <code>PATH</code> — vì bash nhớ chỗ nó tìm thấy <code>node</code> lần trước và không đi tìm lại. Ba lối ra:</p>
<div class="callout warn"><strong>Đo thật trên bash 5.2 (Ubuntu 24.04, 28/09/2026):</strong> <em>GÁN</em> <code>PATH</code> — kể cả phép gán vô nghĩa <code>PATH=\$PATH</code> — làm bash xoá sạch bảng băm ngay lập tức. Nên câu "tôi đã đổi PATH mà bash vẫn chạy đường cũ" KHÔNG phải chuyện bảng băm; mục băm cũ chỉ cắn đúng khi một file bị dời hoặc biến mất <em>trong lúc <code>PATH</code> giữ nguyên</em>: gỡ bản ở <code>/usr/local/bin</code> trong khi còn một bản ở <code>/usr/bin</code>, hay một trình quản lý phiên bản thay file sau lưng bạn.</div>
<pre><code>hash -r                 <span class="tok-comment"># quên mọi đường dẫn đã nhớ</span>
hash -d node            <span class="tok-comment"># chỉ quên đúng cái này</span>
hash                    <span class="tok-comment"># xem bảng hiện tại</span></code></pre>
<div class="out">hits    command
   4    /usr/bin/git
   2    /usr/bin/docker</div>
<div class="callout">Đây cũng là câu trả lời cho "tôi vừa cài xong mà bash bảo command not found". Nếu bash trước đó <em>KHÔNG</em> tìm thấy lệnh thì nó không lưu lại thất bại — nhưng nếu một shell đã mở TRƯỚC khi bạn thêm thư mục mới vào <code>PATH</code>, thì <code>PATH</code> của shell đó vẫn hoàn toàn là bản cũ. <code>hash -r</code> chữa một kết quả TRÚNG đã cũ; còn một shell mới (hoặc source lại file rc) mới chữa được một <code>PATH</code> cũ. Biết mình đang gặp cái nào trong hai cái đó thì đỡ phải khởi động lại máy.</div>

<h3>Thứ tự quyết định phiên bản nào chạy</h3>
${slide('lx-08', 6, 'Thứ tự trong PATH chọn phiên bản; PATH=/x xoá sạch danh sách')}
<pre><code>type -a python3</code></pre>
<div class="out">python3 is /home/deploy/.local/bin/python3
python3 is /usr/bin/python3</div>
<pre><code><span class="tok-comment"># Thêm vào ĐẦU — bản của bạn thắng</span>
export PATH="\$HOME/.local/bin:\$PATH"

<span class="tok-comment"># Thêm vào CUỐI — chỉ dùng khi không có gì phía trước cung cấp nó</span>
export PATH="\$PATH:/opt/tools/bin"</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Thêm vào đầu</span><span class="v">Cho các trình quản lý phiên bản (nvm, pyenv, rbenv) và cho script của chính bạn. Bạn đang CỐ Ý che khuất bản của hệ thống.</span></div>
  <div class="kv"><span class="k">Thêm vào cuối</span><span class="v">Cho những công cụ phụ mà không bao giờ nên đè lên một lệnh hệ thống. Mặc định an toàn hơn khi thêm một thư mục của bên thứ ba.</span></div>
</div>
<div class="callout warn"><strong>Đừng bao giờ viết <code>PATH="/opt/bin"</code> mà thiếu <code>:\$PATH</code>.</strong> Cái đó THAY THẾ cả danh sách, nên <code>ls</code>, <code>grep</code> và <code>sudo</code> đều không còn tìm thấy nữa và shell gần như không dùng được — mọi lệnh đều trả về "command not found", kể cả những lệnh bạn định dùng để đi sửa. Cách khôi phục là gõ <code>export PATH=/usr/bin:/bin</code> từ trí nhớ, hoặc mở một shell mới. Hãy luôn kèm <code>\$PATH</code> ở một trong hai phía.</div>

<h3>Vì sao thư mục hiện tại KHÔNG được nằm trong PATH</h3>
${slide('lx-08', 7, 'Dấu . hay mục rỗng trong PATH = chạy file của người lạ')}
<pre><code>echo "\$PATH"
<span class="tok-comment"># .:/usr/local/bin:/usr/bin:/bin      ← dấu chấm đứng đầu là vấn đề</span>
cd /tmp/downloaded-project
ls</code></pre>
<div class="out">README.md  ls  setup.sh</div>
<p>Trong thư mục đó có một file tên là <code>ls</code>. Với dấu <code>.</code> đứng đầu <code>PATH</code>, gõ <code>ls</code> sẽ chạy <em>CÁI FILE ĐÓ</em> — bên trong nó có gì cũng mặc — với đặc quyền của bạn. Kẻ tấn công chẳng cần phá vỡ gì cả; họ chỉ cần bạn <code>cd</code> vào một thư mục do họ kiểm soát rồi gõ một lệnh bình thường.</p>
<div class="callout warn">Đây là lý do <code>.</code> không nằm trong <code>PATH</code> mặc định trên bất kỳ hệ thống đời mới nào, và là lý do chạy một script trong thư mục hiện tại đòi phải gõ tường minh <code>./script.sh</code> như ở Bài 1.2. Dấu chấm không phải một thứ bạn cứ phải thêm vào cho đủ — nó chính là ranh giới an ninh. Nếu có lúc nào bạn thấy <code>.</code> hoặc một mục rỗng (dấu hai chấm đứng đầu, đứng cuối, hoặc lặp đôi — đều mang cùng ý nghĩa) trong một <code>PATH</code>, hãy coi đó là một phát hiện đáng điều tra.</div>
<pre><code><span class="tok-comment"># Mục rỗng tương đương với "." — hãy kiểm cả ba dạng</span>
echo "\$PATH" | grep -E '(^|:)(\\.)?(:|\$)' &amp;&amp; echo "PATH có chứa . hoặc một mục rỗng"</code></pre>

<h3>Các mục của PATH đến từ đâu</h3>
${slide('lx-08', 8, 'PATH đến từ đâu — và macOS xếp lại nó bằng path_helper')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">/etc/environment</span><span class="lz-lnote">Mặc định cho toàn hệ thống, do PAM đọc lúc đăng nhập. CHỈ nhận những dòng <code>KHOÁ=giá trị</code> thuần — nó <strong>KHÔNG</strong> phải một script shell, nên <code>\$PATH</code> và <code>export</code> không hoạt động ở đó.</span></div>
  <div class="lz-layer"><span class="lz-lname">/etc/profile và /etc/profile.d/*.sh</span><span class="lz-lnote">Toàn hệ thống, dành cho shell đăng nhập. Đây là chỗ các gói phần mềm thả phần bổ sung PATH của chúng vào.</span></div>
  <div class="lz-layer"><span class="lz-lname">~/.profile · ~/.bash_profile</span><span class="lz-lnote">Shell đăng nhập của bạn. Đây là chỗ ĐÚNG cho <code>PATH</code>, vì nó được mọi thứ bạn khởi động sau đó thừa kế.</span></div>
  <div class="lz-layer"><span class="lz-lname">~/.bashrc</span><span class="lz-lnote">Shell tương tác. Đặt <code>PATH</code> ở đây là chuyện thường gặp và phần lớn vẫn chạy, nhưng nó chạy lại ở MỖI shell mới — nên sinh ra vấn đề trùng lặp bên dưới.</span></div>
  <div class="lz-layer"><span class="lz-lname">unit của systemd · cron</span><span class="lz-lnote">Không cái nào đọc bất kỳ thứ nào ở trên. PATH của cron điển hình chỉ là <code>/usr/bin:/bin</code>. Bài 8.2 và Chương 11 nói kỹ chuyện này.</span></div>
</div>
<pre><code><span class="tok-comment"># PATH phình ra ở mỗi shell — triệu chứng kinh điển của một file rc đặt sai chỗ</span>
echo "\$PATH" | tr ':' '\\n' | sort | uniq -d</code></pre>
<div class="out">/home/deploy/.local/bin
/home/deploy/.local/bin</div>
<p>Một dòng như <code>export PATH="\$HOME/.local/bin:\$PATH"</code> trong <code>~/.bashrc</code> sẽ thêm vào đầu MỖI LẦN một shell khởi động — mà shell thì lồng nhau, nên <code>tmux</code> bên trong <code>ssh</code> bên trong một terminal cho bạn ba bản sao. Về tác dụng thì vô hại, nhưng đó là dấu hiệu dòng đó nằm nhầm file, và nó làm <code>PATH</code> thật sự khó đọc lúc gỡ lỗi. Dạng bền vững khi chạy lại (Bài 7.3):</p>
<pre><code>case ":\$PATH:" in
  *":\$HOME/.local/bin:"*) ;;                        <span class="tok-comment"># đã có rồi, không làm gì</span>
  *) export PATH="\$HOME/.local/bin:\$PATH" ;;
esac</code></pre>

<h3>sudo có PATH riêng — đo thật</h3>
${slide('lx-08', 9, 'sudo dùng secure_path — sudo -E cũng không cứu PATH')}
<p>Cái bẫy ở cuối bài này phổ biến tới mức đáng làm hẳn một thí nghiệm. Một <code>node</code> giả nằm ở <code>~/.nvm-gia/bin</code>, thư mục có trong <code>PATH</code> <em>CỦA BẠN</em>:</p>
<pre><code>node --version
sudo node --version
sudo -E node --version
sudo env | grep ^PATH
sudo "\$(command -v node)" --version
sudo env PATH="\$PATH" node --version</code></pre>
<div class="out">v22.6.0
sudo: node: command not found
sudo: node: command not found
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin
v22.6.0
v22.6.0</div>
<p>Đọc ra ba điều từ output đó. <code>sudo</code> dùng giá trị <code>secure_path</code> trong <code>/etc/sudoers</code> (trên Ubuntu 24.04: <code>/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin</code>), không phải của bạn. Cờ <code>-E</code> ("preserve environment" — giữ nguyên môi trường) không đổi được điều đó, vì <code>secure_path</code> được áp ĐÈ lên bất cứ thứ gì đã được giữ lại. Và thông báo lỗi đến từ chính <code>sudo</code>, với mã thoát <strong>1</strong> — không phải 127 của bash — nên một script kiểm mã 127 sẽ đọc nhầm. Hai dòng chạy được đều tránh việc tra <code>PATH</code> bên trong <code>sudo</code>: một dòng đưa thẳng đường dẫn tuyệt đối, dòng kia chạy <code>env</code> (thứ CÓ nằm trong <code>secure_path</code>) kèm một <code>PATH</code> tường minh cho đúng một lệnh đó.</p>

<h3>Gỡ một vấn đề về PATH</h3>
<pre><code>type -a mycommand                <span class="tok-comment"># 1. shell nghĩ nó là cái gì?</span>
echo "\$PATH" | tr ':' '\\n'       <span class="tok-comment"># 2. thư mục đó có được liệt kê không?</span>
ls -l /opt/tools/bin/mycommand   <span class="tok-comment"># 3. file có tồn tại không, và có +x không?</span>
hash -r                          <span class="tok-comment"># 4. xoá một đường dẫn đã lưu bị cũ</span>
bash -lc 'echo \$PATH'            <span class="tok-comment"># 5. một shell ĐĂNG NHẬP thấy gì?</span>
env -i bash -c 'echo \$PATH'      <span class="tok-comment"># 6. một môi trường trần thấy gì?</span></code></pre>
<div class="out">bash: type: mycommand: not found
/usr/local/bin
/usr/bin
/bin
-rwxr-xr-x 1 root root 2048 Aug 22 15:02 /opt/tools/bin/mycommand</div>
<p>Ba bước 1–3 nhận diện được gần như mọi trường hợp: lệnh có tồn tại và chạy được, nhưng thư mục của nó không nằm trong <code>PATH</code>. Bước 6 chính là phép mô phỏng cron ở Bài 7.4 — nếu lệnh tìm thấy bình thường mà không tìm thấy dưới <code>env -i</code>, thì cách chữa hoặc là thêm thư mục vào môi trường của cron, hoặc tốt hơn là dùng đường dẫn tuyệt đối trong crontab.</p>
<div class="callout ok">Trong một script bắt buộc phải tìm ra một công cụ, đừng giả định về <code>PATH</code>. Hoặc kiểm tường minh (<code>command -v docker &gt;/dev/null || die "chưa cài docker"</code> ở Bài 7.2), hoặc tự đặt <code>PATH</code> ngay đầu script. Một công việc cron báo "docker: command not found" KHÔNG phải một bản cài hỏng — đó là một script đã giả định một môi trường tương tác.</div>


<h3>Bảng cờ: type, command, hash, which</h3>
<table>
<tr><th>Lệnh</th><th>Làm gì</th><th>Ví dụ (Ubuntu 24.04)</th></tr>
<tr><td><code>type TÊN</code></td><td>Cái gì sẽ chạy, và vì sao — bí danh, từ khoá, hàm, lệnh dựng sẵn hay file</td><td><code>type ls</code> → <code>ls is aliased to &#96;ls --color=auto'</code></td></tr>
<tr><td><code>type -a TÊN</code></td><td>MỌI kết quả khớp, theo đúng thứ tự tra cứu</td><td><code>type -a echo</code> → builtin, <code>/usr/bin/echo</code>, <code>/bin/echo</code></td></tr>
<tr><td><code>type -t TÊN</code></td><td>Chỉ in loại: <code>alias</code> · <code>keyword</code> · <code>function</code> · <code>builtin</code> · <code>file</code></td><td><code>type -t cd</code> → <code>builtin</code></td></tr>
<tr><td><code>type -P TÊN</code></td><td>Ép tìm trong PATH, bỏ qua bí danh, hàm và lệnh dựng sẵn</td><td><code>type -P ls</code> → <code>/usr/bin/ls</code></td></tr>
<tr><td><code>command -v TÊN</code></td><td>Một dòng nói cái gì sẽ chạy; không có gì thì mã thoát 1. Cái nên dùng trong script</td><td><code>command -v khongco; echo \$?</code> → <code>1</code></td></tr>
<tr><td><code>command TÊN tham-số</code></td><td>Chạy TÊN mà bỏ qua bí danh và hàm</td><td><code>command ls</code></td></tr>
<tr><td><code>hash</code> · <code>hash -t TÊN</code></td><td>Xem bảng · đường đang nhớ của một tên</td><td><code>hash -t xin</code> → <code>/home/an/b1/xin</code></td></tr>
<tr><td><code>hash -d TÊN</code> · <code>hash -r</code></td><td>Quên một mục · quên tất cả</td><td>sau khi dời một chương trình</td></tr>
<tr><td><code>hash -l</code></td><td>In bảng thành các lệnh <code>hash -p</code> dán lại được</td><td><code>builtin hash -p /usr/bin/ls ls</code></td></tr>
<tr><td><code>which TÊN</code></td><td>Chương trình ngoài; chỉ thấy file trong PATH, không thấy bí danh/hàm/lệnh dựng sẵn</td><td><code>which cd; echo \$?</code> → <code>1</code></td></tr>
</table>
<div class="kv-grid">
  <div class="kv"><span class="k">Khi nào dùng type</span><span class="v">Mỗi khi chính <em>BẠN</em> hỏi "cái tên này thật ra là gì?" ở dấu nhắc. Nó là lệnh duy nhất nói trọn sự thật.</span></div>
  <div class="kv"><span class="k">Khi nào dùng command -v</span><span class="v">Bên trong script, để kiểm một công cụ có tồn tại hay không: <code>command -v docker &gt;/dev/null || die "thiếu docker"</code>.</span></div>
  <div class="kv"><span class="k">Khi nào KHÔNG dùng which</span><span class="v">Trong script (có máy không có nó, và nó chẳng nói gì về lệnh dựng sẵn), và mỗi khi có thể dính tới một bí danh hay một hàm.</span></div>
</div>

<h3>Chạy thử từng bước</h3>
<p>Trong một container vứt đi (<code>docker run --rm -it ubuntu:24.04 bash</code>, rồi <code>useradd -m an &amp;&amp; su - an</code>), gõ từng dòng một và đoán output của mỗi dòng TRƯỚC khi bấm Enter. <code>xin</code> là một script tí hon in ra chỗ nó đang nằm.</p>
<pre><code>mkdir -p ~/b1 ~/b2
printf '#!/bin/sh\\necho "toi o \$0"\\n' &gt; ~/b1/xin &amp;&amp; chmod +x ~/b1/xin
PATH=~/b1:~/b2:\$PATH
xin
hash
mv ~/b1/xin ~/b2/
xin
echo \$?
hash -t xin
hash -r
xin</code></pre>
<div class="out">toi o /home/an/b1/xin
hits    command
   1    /home/an/b1/xin
bash: /home/an/b1/xin: No such file or directory
127
/home/an/b1/xin
toi o /home/an/b2/xin</div>
<p>Cần để ý: lần chạy đầu được ghi vào bảng với một lần trúng; sau khi dời file, bash KHÔNG tìm trong <code>~/b2</code> dù thư mục đó có trong <code>PATH</code> — nó đi thẳng tới file đã nhớ và hỏng với mã 127; <code>hash -t</code> cho thấy mục cũ; sau <code>hash -r</code> phép tìm trái → phải bình thường mới thấy file ở <code>~/b2</code>. Rồi thử <code>PATH=".:\$PATH"</code> bên trong một thư mục có sẵn một script tên <code>ls</code>, và nhìn <code>ls</code> chạy file của người lạ — toàn bộ lý lẽ an ninh ở trên, gói trong hai dòng.</p>

<h3>Trên macOS và WSL khác gì</h3>
<table>
<tr><th>Thứ</th><th>Ubuntu / WSL2</th><th>macOS (zsh 5.9)</th></tr>
<tr><td>PATH hệ thống đến từ đâu</td><td><code>/etc/environment</code> (PAM) + <code>/etc/profile.d/*.sh</code></td><td><code>/etc/paths</code> + mọi file trong <code>/etc/paths.d/</code>, được <code>/usr/libexec/path_helper</code> ghép lại — <code>/etc/zprofile</code> và <code>/etc/profile</code> gọi nó</td></tr>
<tr><td>Homebrew nằm đâu</td><td>(mặc định không có Homebrew)</td><td><code>/opt/homebrew/bin</code> trên Apple Silicon (Mac chip Intel: <code>/usr/local/bin</code>); trình cài còn thả thêm <code>/etc/paths.d/homebrew</code></td></tr>
<tr><td><code>which</code></td><td>chương trình ngoài</td><td>là lệnh <strong>dựng sẵn</strong> của zsh (<code>which which</code> → <code>shell built-in command</code>), CÓ thấy bí danh; dạng "chỉ PATH" là <code>whence -p ls</code></td></tr>
<tr><td>Xoá bảng băm</td><td><code>hash -r</code></td><td><code>hash -r</code> hoặc <code>rehash</code> (zsh nhận cả hai)</td></tr>
<tr><td>Mục bạn không hề thêm</td><td>WSL nối thêm PATH của Windows (<code>/mnt/c/…</code>) trừ khi đặt <code>appendWindowsPath=false</code> trong <code>/etc/wsl.conf</code></td><td><code>/System/Cryptexes/…</code> và <code>/Library/Apple/usr/bin</code> đến từ <code>/etc/paths.d</code></td></tr>
</table>
<p><code>path_helper</code> có một hành vi làm ai cũng bất ngờ, đo trên Mac M1 chạy macOS 27:</p>
<pre><code>env -i PATH="/Users/an/.nvm/bin:/usr/bin:/bin" /usr/libexec/path_helper -s</code></pre>
<div class="out">PATH="/usr/local/bin:/System/Cryptexes/App/usr/bin:/usr/bin:/bin:/usr/sbin:/sbin:…:/Library/Apple/usr/bin:/opt/homebrew/bin:/Users/an/.nvm/bin"; export PATH;</div>
<p>Nó đặt <code>/etc/paths</code> lên đầu, rồi tới <code>/etc/paths.d</code>, rồi MỚI tới những gì vốn đã có trong <code>PATH</code> — nên một thư mục bạn đã thêm vào đầu (<code>~/.nvm/bin</code>) bị đẩy xuống <em>CUỐI</em>, đứng sau <code>/usr/bin</code>. Mỗi shell login đều chạy lại nó, nên một <code>zsh -l</code> mở bên trong một phiên đã cấu hình xong sẽ âm thầm xếp lại PATH của bạn. Cách chữa là thêm thư mục của mình <em>SAU</em> khi nó chạy: trong <code>~/.zprofile</code> hoặc <code>~/.zshrc</code>, cả hai đều được đọc sau <code>/etc/zprofile</code>. Chương 15 nói kỹ về Homebrew và phần còn lại của macOS.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> một bạn cùng nhóm SWP391 đã cài Node 22 "vào thư mục nhà", vậy mà <code>node --version</code> vẫn in 20, còn <code>sudo npm …</code> thì báo <code>command not found</code>. Hãy tái hiện và chữa trong một container vứt đi — hai "bản node" chỉ là hai script một dòng, nên không có gì thật sự được cài.</p><ol>
<li><code>docker run --rm -it ubuntu:24.04 bash</code>, rồi <code>apt-get update &amp;&amp; apt-get install -y sudo</code>, <code>useradd -m an</code>, <code>echo 'an ALL=(ALL) NOPASSWD:ALL' &gt; /etc/sudoers.d/an</code>. Tạo <code>/usr/local/bin/node</code> in ra <code>v20.11.1</code>, rồi <code>su - an</code> và tạo <code>~/.local/bin/node</code> in ra <code>v22.6.0</code> (cả hai <code>chmod +x</code>).</li>
<li>Chạy <code>type -a node</code> và <code>node --version</code>. <code>~/.local/bin</code> có trong PATH không, và đứng ở vị trí nào? Làm cho v22 thắng bằng dạng bền vững <code>case ":\$PATH:"</code>, chạy nó hai lần, và chứng minh bằng <code>echo "\$PATH" | tr ':' '\\n' | sort | uniq -d</code> rằng không có gì bị trùng.</li>
<li>Chạy <code>sudo node --version</code> và <code>sudo -E node --version</code>; giải thích cả hai lỗi bằng <code>sudo env | grep ^PATH</code>, rồi làm cho nó chạy theo hai cách khác nhau.</li>
<li>Xoá <code>~/.local/bin/node</code> rồi chạy lại <code>node --version</code>. Đọc thông báo lỗi, gọi tên nguyên nhân, và chữa mà không mở shell mới.</li></ol>
<p><strong>Đạt khi:</strong> <code>node --version</code> in <code>v22.6.0</code> dưới người dùng <code>an</code>, <code>sudo</code> tới được nó bằng hai đường, phép kiểm trùng không in gì, và bạn nói được trong một câu vì sao bước 4 in ra đường dẫn <em>CŨ</em>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">PATH (đường tìm lệnh)</span><span class="v">Danh sách thư mục ngăn bằng dấu hai chấm mà shell lục từ trái sang phải để tìm một tên lệnh.</span></div>
  <div class="kv"><span class="k">Builtin (lệnh dựng sẵn)</span><span class="v">Lệnh là một phần của chính bash (<code>cd</code>, <code>export</code>); không có file chương trình nào được chạy.</span></div>
  <div class="kv"><span class="k">Alias (bí danh)</span><span class="v">Phép thay chữ ở đầu một lệnh, chỉ có hiệu lực trong shell tương tác.</span></div>
  <div class="kv"><span class="k">Hash table (bảng băm)</span><span class="v">Trí nhớ của bash về chỗ nó tìm thấy mỗi lệnh lần trước; <code>hash -r</code> xoá nó.</span></div>
  <div class="kv"><span class="k">Prepend / append (thêm đầu / thêm cuối)</span><span class="v">Đặt một thư mục ở đầu PATH (thắng) hay ở cuối (dự phòng).</span></div>
  <div class="kv"><span class="k">Exit code 127 (mã thoát 127)</span><span class="v">"Không tìm thấy lệnh" — hoặc một file đã nhớ mà giờ không còn.</span></div>
  <div class="kv"><span class="k">secure_path (PATH an toàn của sudo)</span><span class="v">PATH cố định mà <code>sudo</code> dùng, đặt trong <code>/etc/sudoers</code>.</span></div>
  <div class="kv"><span class="k">path_helper (trình dựng PATH của macOS)</span><span class="v">Công cụ của Mac dựng PATH từ <code>/etc/paths</code> và <code>/etc/paths.d</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Thứ tự tra: bí danh → hàm → lệnh dựng sẵn → bảng băm → PATH trái sang phải; khớp đầu tiên thắng, không thấy gì là 127.</li>
<li><code>type -a</code> giải thích cái gì chạy; <code>command -v</code> là phép thử an toàn cho script; <code>which</code> bỏ sót bí danh, hàm và lệnh dựng sẵn.</li>
<li>Mục băm cũ xuất hiện khi file bị dời mà PATH giữ nguyên; gán PATH là bash tự xoá bảng, còn <code>hash -r</code> xoá bằng tay.</li>
<li>Thêm đầu để cố ý che, thêm cuối cho đồ phụ, không bao giờ gán PATH mà thiếu <code>\$PATH</code>, không bao giờ để <code>.</code> hay mục rỗng.</li>
<li><code>sudo</code> dùng <code>secure_path</code>, và <code>-E</code> không đổi được điều đó — dùng đường tuyệt đối hoặc <code>sudo env PATH=…</code>.</li>
<li>Trên macOS, <code>path_helper</code> dựng lại PATH ở mỗi shell login và đẩy phần bạn thêm xuống cuối — hãy thêm trong <code>~/.zprofile</code>/<code>~/.zshrc</code>.</li>
</ul>

<a class="link-card" href="https://www.gnu.org/software/bash/manual/html_node/Command-Search-and-Execution.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Bash Manual — Command Search and Execution</span><span class="lc-sub">Thứ tự tra cứu năm bước, phát biểu một cách chính quy, gồm cả chính xác khi nào bảng băm được tra và khi nào nó bị làm mất hiệu lực.</span></span>
</a>
<a class="link-card" href="https://mywiki.wooledge.org/BashFAQ/081" target="_blank" rel="noopener">
  <span class="lc-ico">🔧</span>
  <span class="lc-body"><span class="lc-title">BashFAQ 081 — "type, which và command -v khác nhau ra sao?"</span><span class="lc-sub">Vì sao <code>which</code> là câu trả lời sai, kèm những cách cụ thể mà nó gây hiểu nhầm. Hai phút, và nó chốt xong cái thói quen.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man8/pam_env.8.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">pam_env(8) — /etc/environment được đọc ra sao</span><span class="lc-sub">Giải thích vì sao file đó không phải một script shell và vì sao <code>PATH=\$PATH:/opt/bin</code> viết trong đó lại âm thầm sinh ra một dấu đô la nguyên văn.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man5/sudoers.5.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">sudoers(5) — secure_path và env_reset</span><span class="lc-sub">Luật chính xác đằng sau "sudo: command not found": sudo giữ lại những biến nào, và vì sao PATH vẫn bị thay kể cả khi có <code>-E</code>.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: tìm cho ra cái lệnh</span><span class="lc-sub">Các tình huống chấm điểm: một chương trình bị che khuất, một mục băm đã cũ, một thư mục thiếu khỏi PATH, và một script chạy tay thì được mà chạy dưới <code>env -i</code> thì hỏng.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> <code>sudo</code> dùng một <code>PATH</code> <em>KHÁC</em> với của bạn. Vì lý do an ninh, <code>sudo</code> đặt lại nó về <code>secure_path</code> lấy từ <code>/etc/sudoers</code> — thường là <code>/usr/sbin:/usr/bin:/sbin:/bin</code>, không có bất kỳ phần bổ sung nào của bạn. Nên <code>node --version</code> chạy được còn <code>sudo node --version</code> lại nói "command not found", thứ TRÔNG như một vấn đề quyền mà không phải. Hãy dùng đường dẫn tuyệt đối (<code>sudo "\$(command -v node)" …</code>) hoặc <code>sudo env "PATH=\$PATH" node …</code>. <code>sudo -E</code> KHÔNG phải cách chữa: nó giữ các biến khác của bạn, nhưng <code>secure_path</code> vẫn thay mất <code>PATH</code> — trên Ubuntu 24.04, <code>sudo -E node --version</code> vẫn in <code>sudo: node: command not found</code>. Đừng sửa <code>secure_path</code> để thêm thư mục nhà của bạn vào — làm thế là trao cho root một thư mục mà bạn ghi được, và đó chính xác là thứ mà thiết lập đó sinh ra để ngăn chặn.</div>
<p class="note-ct"><strong>Ba lệnh đáng giữ:</strong> <code>type -a &lt;lệnh&gt;</code> để thấy mọi thứ có thể chạy dưới cái tên đó và theo thứ tự nào; <code>echo "\$PATH" | tr ':' '\\n'</code> để đọc một danh sách dưới dạng danh sách; và <code>hash -r</code> khi một lệnh bạn vừa di chuyển vẫn bị tra cứu ở chỗ cũ. Ba cái đó cùng nhau trả lời gần như mọi câu hỏi "vì sao nó chạy nhầm thứ" trong chưa tới mười giây.</p>
</div>
`,
    },
    /* ─────────────────────────── 8.2 ─────────────────────────── */
    {
      title: '8.2 — Startup files: which one is actually read|||8.2 — File khởi động: rốt cuộc file nào được đọc',
      slug: 'lnx-8-2-file-khoi-dong',
      type: 'LESSON',
      description: 'Ba loại shell (đăng nhập, tương tác, không tương tác) và bảng quyết định file nào được đọc cho loại nào; vì sao ~/.bashrc thoát sớm khi không tương tác; cách sắp xếp đúng; và vì sao cron không đọc file nào cả.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>Which startup file is actually read</h2>
<p class="lead"><code>~/.bashrc</code>, <code>~/.bash_profile</code>, <code>~/.profile</code>, <code>/etc/profile</code> — four files that all look like "where I put my shell settings", and each is read in different circumstances. Guessing costs you an afternoon; the rule fits in one table.</p>

<h3>Three kinds of shell</h3>
${slide('lx-08', 10, 'Ba loại shell — hỏi thẳng bằng login_shell và $-')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Login shell</span><span class="lz-lnote">Started by authenticating: an SSH session, a console login, <code>su -</code>, <code>bash -l</code>. Reads the <strong>profile</strong> files, once, at the start of the session.</span></div>
  <div class="lz-layer"><span class="lz-lname">Interactive non-login</span><span class="lz-lnote">A new terminal tab, a <code>tmux</code> pane, typing <code>bash</code>. Reads <strong>~/.bashrc</strong>. Has a prompt and a TTY, but you did not authenticate again.</span></div>
  <div class="lz-layer"><span class="lz-lname">Non-interactive</span><span class="lz-lnote">A script, a cron job, <code>ssh host 'command'</code>, a systemd unit. Reads <strong>nothing</strong> by default. No prompt, no TTY.</span></div>
</div>
<pre><code><span class="tok-comment"># Which am I in?</span>
shopt -q login_shell &amp;&amp; echo "login" || echo "not login"
[[ \$- == *i* ]] &amp;&amp; echo "interactive" || echo "non-interactive"
echo "\$0"                  <span class="tok-comment"># a leading dash (-bash) also means login</span></code></pre>
<div class="out">not login
interactive
bash</div>
<p><code>\$-</code> holds the current shell's option flags; an <code>i</code> in there means interactive. Those two lines are the definitive test, and they are worth remembering because every startup-file question reduces to "which of the three is this".</p>
<div class="callout">One detail measured on Ubuntu 24.04: the leading dash in <code>\$0</code> is set by whatever <em>launched</em> the shell — <code>login</code>, <code>sshd</code>, <code>su -</code> — so <code>su - an -c 'echo \$0'</code> prints <code>-bash</code>, but <code>bash -l -c 'echo \$0'</code> prints plain <code>bash</code> even though that shell <em>is</em> a login shell. A dash proves login; no dash proves nothing. <code>shopt -q login_shell</code> is the test that never lies.</div>

<h3>The decision table</h3>
${slide('lx-08', 11, 'bash đọc file nào: tuỳ loại shell (đo thật)')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Login shell</span><span class="lz-t">/etc/profile → then the FIRST of: ~/.bash_profile, ~/.bash_login, ~/.profile</span><span class="lz-d">Only the first one that exists is read; the others are ignored entirely. This is why creating ~/.bash_profile can silently disable your ~/.profile.</span></div>
  <div class="lz-step"><span class="lz-k">Interactive non-login</span><span class="lz-t">/etc/bash.bashrc → ~/.bashrc</span><span class="lz-d">The profile files are NOT read. Every new terminal tab takes this path.</span></div>
  <div class="lz-step"><span class="lz-k">Non-interactive</span><span class="lz-t">nothing — unless BASH_ENV is set</span><span class="lz-d">A script gets no rc file at all. This is the entire explanation of "works in my terminal, fails in cron".</span></div>
  <div class="lz-step"><span class="lz-k">Logout</span><span class="lz-t">~/.bash_logout</span><span class="lz-d">Only for login shells, on exit. Rarely used; occasionally handy for clearing a screen or a ssh-agent.</span></div>
</div>
<div class="callout warn"><strong>On a login shell, bash reads only the FIRST profile file it finds.</strong> The order is <code>~/.bash_profile</code>, then <code>~/.bash_login</code>, then <code>~/.profile</code>. Debian and Ubuntu ship a <code>~/.profile</code>; the moment some installer creates a <code>~/.bash_profile</code>, your <code>~/.profile</code> stops being read and everything in it — often the <code>PATH</code> additions — silently disappears from SSH sessions while still working in your desktop terminal. If you have both files, the <code>~/.bash_profile</code> must source the other one explicitly.</div>

<h3>Why an SSH session behaves differently from a terminal tab</h3>
${slide('lx-08', 13, "ssh host 'lệnh' đọc .bashrc — rồi dừng ở cái chốt")}
<pre><code><span class="tok-comment"># Interactive login shell — reads .profile, and .profile usually sources .bashrc</span>
ssh vps

<span class="tok-comment"># NON-interactive, non-login — Debian/Ubuntu bash reads ~/.bashrc, but only up to the guard</span>
ssh vps 'echo \$PATH'
ssh vps 'node --version'</code></pre>
<div class="out">/usr/local/bin:/usr/bin:/bin
bash: node: command not found</div>
<p>Same machine, same user, two different answers. Logging in interactively runs the profile chain; passing a command to <code>ssh</code> does not, so a <code>PATH</code> set up by nvm or a version manager is simply absent. This catches people deploying over SSH constantly.</p>
<pre><code><span class="tok-comment"># Force a login shell for a remote command</span>
ssh vps 'bash -lc "node --version"'

<span class="tok-comment"># Or, better in a script: use the absolute path</span>
ssh vps '/home/deploy/.nvm/versions/node/v22.6.0/bin/node --version'</code></pre>

<div class="callout warn"><strong>Measured with a real <code>sshd</code> (Ubuntu 24.04 container, 28/09/2026), and it corrects a common belief.</strong> A remote command does not read "nothing": Debian and Ubuntu build bash so that, when <code>sshd</code> starts it non-interactively, it reads <code>/etc/bash.bashrc</code> and <code>~/.bashrc</code> — and the guard at the top of <code>~/.bashrc</code> (next section) stops it a few lines in. With <code>nvm</code>'s lines at the <em>end</em> of <code>~/.bashrc</code>, as its installer puts them, markers in the files show exactly that:
<pre><code>ssh lab 'node --version'
ssh lab 'bash -lc "node --version"'</code></pre>
<div class="out">  -&gt; /etc/bash.bashrc
  -&gt; ~/.bashrc (line 1, BEFORE the guard)
bash: line 1: node: command not found
  -&gt; /etc/profile
  -&gt; ~/.profile
  -&gt; ~/.bashrc (line 1, BEFORE the guard)
bash: line 1: node: command not found</div>
So <code>bash -lc</code> is only a fix when the <code>PATH</code> line lives in <code>~/.profile</code>; a login shell that is not interactive still stops at the same guard. For deploy scripts the absolute path is the answer that cannot break. (The <code>PATH</code> the remote command did get — <code>…:/usr/games:/usr/local/games:/snap/bin</code> on Ubuntu — came from <code>/etc/environment</code> via PAM, not from any shell file.)</div>

<h3>The guard at the top of ~/.bashrc</h3>
<pre><code><span class="tok-comment"># Ubuntu's default ~/.bashrc starts with this</span>
case \$- in
    *i*) ;;
      *) return;;
esac</code></pre>
<p>It means: if this shell is not interactive, stop reading the file right here. The reason is that <code>~/.bashrc</code> is full of things that make no sense — or actively break — outside a terminal: aliases, a coloured prompt, history settings, completion. A non-interactive shell that ran all of that would be slower and, worse, would produce output. Anything that prints to stdout from an rc file corrupts <code>scp</code>, <code>rsync</code> and <code>git push</code> over SSH, because those protocols expect the stream to contain only their own data.</p>
<div class="callout warn">This is the cause of the classic <code>scp</code> failure: someone adds <code>echo "Welcome back!"</code> or <code>neofetch</code> near the top of <code>~/.bashrc</code>, above the guard, and file transfers start failing with a protocol error while an interactive login looks perfectly normal. <strong>Anything that prints must go below the interactive guard</strong>, and preferably in the profile rather than the rc file.</div>

<h3>How to organise the files</h3>
<pre><code><span class="tok-comment"># ~/.profile — environment, once per session, inherited by everything</span>
export EDITOR=vim
export LANG=en_US.UTF-8
case ":\$PATH:" in
  *":\$HOME/.local/bin:"*) ;;
  *) export PATH="\$HOME/.local/bin:\$PATH" ;;
esac

<span class="tok-comment"># Make an interactive login shell also get the interactive settings</span>
if [ -n "\$BASH_VERSION" ] &amp;&amp; [ -f "\$HOME/.bashrc" ]; then
  . "\$HOME/.bashrc"
fi</code></pre>
<pre><code><span class="tok-comment"># ~/.bashrc — interactive comfort only</span>
case \$- in *i*) ;; *) return;; esac      <span class="tok-comment"># the guard, FIRST line of real code</span>

alias ll='ls -alF'
alias gs='git status'
shopt -s globstar histappend checkwinsize
HISTSIZE=100000
PS1='\\u@\\h:\\w\\\$ '</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Goes in <code>~/.profile</code></span><span class="v"><code>export</code>ed variables: <code>PATH</code>, <code>EDITOR</code>, <code>LANG</code>, <code>JAVA_HOME</code>. Anything a <em>child process</em> needs to see.</span></div>
  <div class="kv"><span class="k">Goes in <code>~/.bashrc</code></span><span class="v">Aliases, functions, prompt, history options, completion, <code>shopt</code>. Anything only a <em>human at a keyboard</em> needs.</span></div>
  <div class="kv"><span class="k">Goes in neither</span><span class="v">Secrets. An <code>export API_KEY=…</code> in a shell file is visible to every process you start and to anyone who reads the file. Lesson 8.3.</span></div>
</div>
<div class="callout ok">The rule of thumb: <strong>if a script needs it, it belongs in the profile; if only you need it, it belongs in the rc.</strong> An alias in <code>~/.profile</code> is useless (aliases are off in non-interactive shells anyway); a <code>PATH</code> in <code>~/.bashrc</code> works but re-prepends on every nested shell. Putting each in the right place makes both problems go away.</div>

<h3>Applying changes without logging out</h3>
<pre><code>source ~/.bashrc                 <span class="tok-comment"># re-read it into the CURRENT shell</span>
. ~/.bashrc                      <span class="tok-comment"># identical, POSIX spelling</span>
exec bash                        <span class="tok-comment"># replace this shell with a fresh one</span>
exec bash -l                     <span class="tok-comment"># fresh LOGIN shell — re-reads the profile too</span></code></pre>
<div class="callout warn">Note that <code>source</code> re-runs the file <em>in addition</em> to what already ran. For an idempotent rc file that is fine; for one that prepends to <code>PATH</code> unconditionally, sourcing it three times gives you three copies (Lesson 8.1). And <code>source</code> cannot <em>remove</em> anything: if you delete an alias from the file and source it, the alias is still defined in the running shell. When in doubt, <code>exec bash -l</code> — it starts clean.</div>

<h3>Where cron and systemd fit</h3>
${slide('lx-08', 15, 'cron chỉ cho 6 biến: PATH=/usr/bin:/bin, SHELL=/bin/sh')}
<pre><code><span class="tok-comment"># What a cron job actually gets</span>
* * * * * env &gt; /tmp/cron-env.txt
cat /tmp/cron-env.txt</code></pre>
<div class="out">HOME=/home/deploy
LOGNAME=deploy
PATH=/usr/bin:/bin
SHELL=/bin/sh
PWD=/home/deploy</div>
<p>Five variables, a <code>PATH</code> with two entries, and <code>SHELL=/bin/sh</code> — not bash. No <code>~/.profile</code>, no <code>~/.bashrc</code>, none of your version managers, none of your exports. Everything you rely on interactively is absent.</p>
<div class="callout">Run for real on an Ubuntu 24.04 container on 28/09/2026 (<code>* * * * * env &gt; /tmp/cron-env.txt; mytool …</code>, with <code>mytool</code> in <code>/usr/local/bin</code>), cron handed the job <strong>six</strong> variables — the five above plus <code>LANG=C.UTF-8</code>, which cron's PAM setup reads from <code>/etc/default/locale</code> — and the job failed with <code>/bin/sh: 1: mytool: not found</code>, exit 127, while typing <code>mytool</code> by hand printed <code>mytool chay ok</code>. Note the prefix: the error comes from <code>/bin/sh</code> (dash on Ubuntu), because cron runs every line with <code>SHELL=/bin/sh</code> — bash-only syntax in a crontab line fails for the same reason.</div>
<pre><code><span class="tok-comment"># Three ways to fix it, best first</span>

<span class="tok-comment"># 1. Absolute paths in the script, and set PATH at the top of the script itself</span>
PATH=/usr/local/bin:/usr/bin:/bin
export PATH

<span class="tok-comment"># 2. Set it in the crontab — applies to every job in that crontab</span>
PATH=/usr/local/bin:/usr/bin:/bin
0 3 * * * /srv/app/backup.sh

<span class="tok-comment"># 3. Force a login shell — inherits your profile, but is slower and brittle</span>
0 3 * * * bash -lc '/srv/app/backup.sh'</code></pre>
<p>systemd units are the same story with different syntax: they read no shell files at all, and you declare what they need with <code>Environment=</code>, <code>EnvironmentFile=</code>, <code>WorkingDirectory=</code> and <code>User=</code>. Chapter 11 covers that properly; the point here is that <strong>neither cron nor systemd is a shell session</strong>, so nothing in this lesson's files applies to them.</p>

<h3>Debugging which file ran</h3>
${slide('lx-08', 12, 'Đo bằng dấu mốc: mỗi cách gọi, một kết quả')}
<pre><code><span class="tok-comment"># Put a marker in each file, temporarily</span>
echo 'echo "read: ~/.profile" &gt;&amp;2' &gt;&gt; ~/.profile
echo 'echo "read: ~/.bashrc"  &gt;&amp;2' &gt;&gt; ~/.bashrc

bash -lc true      <span class="tok-comment"># login</span>
bash -ic true      <span class="tok-comment"># interactive non-login</span>
bash -c true       <span class="tok-comment"># non-interactive</span></code></pre>
<div class="out">read: ~/.profile
read: ~/.bashrc
</div>
<div class="callout warn"><strong>Two lines, not three</strong> (measured on Ubuntu 24.04 with its stock <code>~/.profile</code> and <code>~/.bashrc</code>). <code>bash -lc true</code> does run <code>~/.profile</code>, and <code>~/.profile</code> does <code>. "\$HOME/.bashrc"</code> — but the marker was <em>appended</em> to <code>~/.bashrc</code>, below the interactive guard, and a <code>-c</code> shell is not interactive, so it returns before reaching it. Put a second marker on the <em>first</em> line of <code>~/.bashrc</code> and the login case prints it too: that pair of markers is the clearest picture of the guard you will ever get.</div>
<p>Three invocations, three different answers, and the third prints nothing at all — which is the whole lesson in one experiment. Send the markers to stderr (<code>&gt;&amp;2</code>) so they cannot corrupt an <code>scp</code> while you are testing, and remove them afterwards.</p>
<pre><code>bash -lx -c true 2&gt;&amp;1 | grep -E '^\\+.*(profile|bashrc)'   <span class="tok-comment"># trace the whole chain</span></code></pre>


<h3>zsh and macOS: the same idea, four files</h3>
${slide('lx-08', 14, 'zsh: .zshenv → .zprofile → .zshrc → .zlogin, đo thật')}
<p>macOS has used zsh as the default shell since 2019, and zsh splits the job into four files instead of bash's "first profile wins". Measured on a Mac M1 with a scratch directory instead of the real home (<code>ZDOTDIR</code> tells zsh where to look), each file containing one <code>echo</code> to stderr:</p>
<pre><code>ZDOTDIR=~/thu/zdot zsh -c true
ZDOTDIR=~/thu/zdot zsh -i -c true
ZDOTDIR=~/thu/zdot zsh -l -c true
ZDOTDIR=~/thu/zdot zsh -l -i -c exit</code></pre>
<div class="out">  -&gt; ZDOTDIR/.zshenv
  -&gt; ZDOTDIR/.zshenv
  -&gt; ZDOTDIR/.zshrc
  -&gt; ZDOTDIR/.zshenv
  -&gt; ZDOTDIR/.zprofile
  -&gt; ZDOTDIR/.zlogin
  -&gt; ZDOTDIR/.zshenv
  -&gt; ZDOTDIR/.zprofile
  -&gt; ZDOTDIR/.zshrc
  -&gt; ZDOTDIR/.zlogin
  -&gt; ZDOTDIR/.zlogout</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>.zshenv</code></span><span class="v">Read by <em>every</em> zsh, scripts included. Keep it tiny — anything slow or noisy here slows or breaks every script.</span></div>
  <div class="kv"><span class="k"><code>.zprofile</code></span><span class="v">Login shells, after <code>/etc/zprofile</code> (which runs <code>path_helper</code>). The right place for <code>PATH</code> and <code>brew shellenv</code>.</span></div>
  <div class="kv"><span class="k"><code>.zshrc</code></span><span class="v">Interactive shells: aliases, prompt, <code>setopt</code>, completion. zsh needs no guard — it simply is not read otherwise.</span></div>
  <div class="kv"><span class="k"><code>.zlogin</code> · <code>.zlogout</code></span><span class="v">Login shells, after <code>.zshrc</code> · on exit. Rarely needed.</span></div>
</div>
<div class="callout ok"><strong>Terminal.app and iTerm open a login shell in every new tab</strong> — <code>ps</code> on this Mac lists them as <code>-zsh</code>, with the leading dash. That is the opposite of a Linux desktop, and it explains two classic Mac surprises: something you put in <code>~/.zprofile</code> runs on every tab, and with <code>/bin/bash</code> (3.2) as the shell, a new tab reads <code>~/.bash_profile</code> but <em>not</em> <code>~/.bashrc</code> — measured with <code>HOME=~/thu/home /bin/bash -l -c true</code>, only <code>~/.bash_profile</code> printed its marker.</div>

<h3>Flag table: starting bash the way you mean to</h3>
<table>
<tr><th>Flag / command</th><th>Meaning</th><th>What it reads (Ubuntu)</th></tr>
<tr><td><code>bash -l</code> · <code>--login</code></td><td>act as a login shell</td><td><code>/etc/profile</code> + the first of <code>~/.bash_profile</code>, <code>~/.bash_login</code>, <code>~/.profile</code></td></tr>
<tr><td><code>bash -i</code></td><td>force interactive</td><td><code>/etc/bash.bashrc</code> + <code>~/.bashrc</code></td></tr>
<tr><td><code>bash -c 'cmd'</code></td><td>run one string, not interactive</td><td>nothing (or <code>\$BASH_ENV</code>)</td></tr>
<tr><td><code>bash --norc</code></td><td>interactive, skip <code>~/.bashrc</code></td><td>nothing — a clean shell for testing</td></tr>
<tr><td><code>bash --noprofile</code></td><td>login, skip the profile files</td><td>nothing from the login chain</td></tr>
<tr><td><code>bash --rcfile F</code></td><td>interactive, read F instead of <code>~/.bashrc</code></td><td>F only</td></tr>
<tr><td><code>BASH_ENV=F bash -c …</code></td><td>give a script a startup file</td><td>F</td></tr>
<tr><td><code>bash -lx -c true</code></td><td>trace every line of the startup chain</td><td>shows each <code>. file</code> as it happens</td></tr>
<tr><td><code>su an</code> vs <code>su - an</code></td><td>keep caller's environment vs a fresh login</td><td>measured: <code>su</code> kept <code>PWD=/tmp</code> and root's <code>MARK</code>; <code>su -</code> gave <code>PWD=/home/an</code>, empty <code>MARK</code>, <code>\$0=-bash</code></td></tr>
<tr><td><code>exec bash -l</code></td><td>replace this shell with a fresh login shell</td><td>everything, from scratch</td></tr>
</table>

<h3>Try it step by step</h3>
<p>This experiment is safe on any Linux machine, even a real server, because it never touches your real dotfiles: it points <code>HOME</code> at a scratch directory holding copies of Ubuntu's defaults (<code>/etc/skel</code>), each with a marker line.</p>
<pre><code>H=~/thu-home; mkdir -p \$H; cp /etc/skel/.bashrc /etc/skel/.profile \$H/
sed -i '1i echo "  -&gt; ~/.profile" &gt;&amp;2' \$H/.profile
sed -i '1i echo "  -&gt; ~/.bashrc (line 1, BEFORE the guard)" &gt;&amp;2' \$H/.bashrc
echo 'echo "  -&gt; ~/.bashrc (end of file, AFTER the guard)" &gt;&amp;2' &gt;&gt; \$H/.bashrc
HOME=\$H bash -l -c true
HOME=\$H bash -i -c true
HOME=\$H bash -c true
echo 'echo "  -&gt; ~/.bash_profile" &gt;&amp;2' &gt; \$H/.bash_profile
HOME=\$H bash -l -c true</code></pre>
<div class="out">  -&gt; ~/.profile
  -&gt; ~/.bashrc (line 1, BEFORE the guard)
  -&gt; ~/.bashrc (line 1, BEFORE the guard)
  -&gt; ~/.bashrc (end of file, AFTER the guard)
  -&gt; ~/.bash_profile</div>
<p>Read it line by line: the login shell ran <code>~/.profile</code>, which sourced <code>~/.bashrc</code>, which stopped at the guard; the interactive shell read all of <code>~/.bashrc</code>; the <code>-c</code> shell printed nothing; and once <code>~/.bash_profile</code> existed, <code>~/.profile</code> was never read again. (On a Mac there is no <code>/etc/skel</code> and <code>sed -i</code> needs <code>''</code> — create the two files by hand, and use <code>/bin/bash</code> with <code>ZDOTDIR</code> for zsh as shown above.)</p>

<h3>On macOS, Fedora and WSL</h3>
<table>
<tr><th>System</th><th>What a new terminal tab is</th><th>What that means</th></tr>
<tr><td>Ubuntu desktop · WSL2 Ubuntu</td><td>non-login, interactive</td><td><code>~/.bashrc</code> only; your <code>~/.profile</code> PATH was inherited from the graphical login. On WSL, ask the shell rather than guessing: <code>shopt -q login_shell &amp;&amp; echo login</code>.</td></tr>
<tr><td>Fedora 44</td><td>non-login, interactive</td><td>Fedora's <code>~/.bash_profile</code> just sources <code>~/.bashrc</code>, and its <code>~/.bashrc</code> has <em>no</em> interactive guard and adds <code>~/.local/bin:~/bin</code> to PATH there; it also loads every file in <code>~/.bashrc.d/</code>.</td></tr>
<tr><td>macOS, zsh</td><td><strong>login</strong>, interactive</td><td><code>.zshenv</code> → <code>/etc/zprofile</code> (<code>path_helper</code>) → <code>.zprofile</code> → <code>.zshrc</code> → <code>.zlogin</code>.</td></tr>
<tr><td>macOS, <code>/bin/bash</code> 3.2</td><td><strong>login</strong>, interactive</td><td><code>/etc/profile</code> (<code>path_helper</code>, then <code>/etc/bashrc</code>) → <code>~/.bash_profile</code>; <code>~/.bashrc</code> only if <code>~/.bash_profile</code> sources it.</td></tr>
</table>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> on your group's Ubuntu VPS, <code>~/.local/bin</code> tools worked over SSH for weeks — until someone ran an installer, and now every SSH login says <code>command not found</code> for them, while a <code>tmux</code> pane that was already open still works. Reproduce the cause and the fix in a container, without touching any real home directory.</p><ol>
<li><code>docker run --rm -it ubuntu:24.04 bash</code>, <code>useradd -m an &amp;&amp; su - an</code>. Create <code>~/.local/bin/hello</code> (a script printing <code>hello</code>), then check that <code>bash -l -c hello</code> works — Ubuntu's <code>~/.profile</code> adds <code>~/.local/bin</code> when it exists.</li>
<li>Play the installer: <code>echo 'export FOO=1' &gt; ~/.bash_profile</code>. Run <code>bash -l -c hello</code> again, and <code>bash -lx -c true 2&gt;&amp;1 | grep -E '^\\+ \\.'</code> to see which files the login chain now sources.</li>
<li>Fix it the right way: make <code>~/.bash_profile</code> source <code>~/.profile</code> (guarded with <code>[ -f ~/.profile ] &amp;&amp;</code>), keeping <code>FOO</code>.</li>
<li>Prove all three shell kinds with markers on stderr, as in "Try it step by step", then remove the markers.</li></ol>
<p><strong>Done when:</strong> <code>bash -l -c 'hello; echo \$FOO'</code> prints <code>hello</code> and <code>1</code>, and you can explain why the already-open <code>tmux</code> pane never noticed the problem.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Login shell</span><span class="v">A shell started by authenticating (SSH, console, <code>su -</code>, <code>bash -l</code>); reads the profile files once.</span></div>
  <div class="kv"><span class="k">Interactive shell</span><span class="v">A shell with a prompt reading your keystrokes; <code>\$-</code> contains <code>i</code>.</span></div>
  <div class="kv"><span class="k">Startup file / dotfile</span><span class="v">A hidden file like <code>~/.bashrc</code> that a shell runs when it starts.</span></div>
  <div class="kv"><span class="k">Interactive guard</span><span class="v">The <code>case \$- in *i*)</code> block that makes <code>~/.bashrc</code> return early when not interactive.</span></div>
  <div class="kv"><span class="k">source / <code>.</code></span><span class="v">Run a file inside the <em>current</em> shell, so its variables and aliases stay.</span></div>
  <div class="kv"><span class="k">BASH_ENV</span><span class="v">A file a non-interactive bash reads first — the only startup hook scripts get.</span></div>
  <div class="kv"><span class="k">ZDOTDIR</span><span class="v">Where zsh looks for its dotfiles; default is <code>\$HOME</code>.</span></div>
  <div class="kv"><span class="k">crontab</span><span class="v">A user's table of scheduled jobs; each line runs under <code>/bin/sh</code> with a minimal environment.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Ask the shell what it is: <code>shopt -q login_shell</code> and <code>[[ \$- == *i* ]]</code>; a dash in <code>\$0</code> proves login, no dash proves nothing.</li>
<li>Login bash reads <code>/etc/profile</code> and only the first of <code>~/.bash_profile</code>, <code>~/.bash_login</code>, <code>~/.profile</code>.</li>
<li>Interactive non-login bash reads <code>~/.bashrc</code>; <code>bash -c</code> and cron read nothing; <code>ssh host 'cmd'</code> reads <code>~/.bashrc</code> only up to the guard.</li>
<li>Environment (<code>PATH</code>, <code>EDITOR</code>) belongs in the profile, human comforts in the rc, secrets in neither.</li>
<li>zsh: <code>.zshenv</code> always, <code>.zprofile</code> + <code>.zlogin</code> for login, <code>.zshrc</code> for interactive — and every Mac terminal tab is a login shell.</li>
<li>Test startup files with a scratch <code>HOME</code>/<code>ZDOTDIR</code> and markers on stderr; test cron with a real cron line or <code>env -i</code>.</li>
</ul>

<a class="link-card" href="https://www.gnu.org/software/bash/manual/html_node/Bash-Startup-Files.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Bash Manual — Bash Startup Files</span><span class="lc-sub">The authoritative order for every invocation mode, including <code>BASH_ENV</code>, <code>--norc</code> and what happens when bash is invoked as <code>sh</code>.</span></span>
</a>
<a class="link-card" href="https://mywiki.wooledge.org/DotFiles" target="_blank" rel="noopener">
  <span class="lc-ico">🔧</span>
  <span class="lc-body"><span class="lc-title">Greg's Wiki — DotFiles</span><span class="lc-sub">Practical advice on what goes where and why, including the "first profile file wins" trap and the scp-corruption problem.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man5/crontab.5.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">crontab(5) — the environment cron provides</span><span class="lc-sub">Exactly which variables cron sets and how to override them from the crontab itself. Short, and it prevents the most common cron failure.</span></span>
</a>
<a class="link-card" href="https://zsh.sourceforge.io/Doc/Release/Files.html" target="_blank" rel="noopener">
  <span class="lc-ico">🐚</span>
  <span class="lc-body"><span class="lc-title">zsh Manual — Startup/Shutdown Files</span><span class="lc-sub">The official order of <code>.zshenv</code>, <code>.zprofile</code>, <code>.zshrc</code>, <code>.zlogin</code> and <code>.zlogout</code>, and how <code>ZDOTDIR</code> changes where they are read from.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: put it in the right file</span><span class="lc-sub">Graded scenarios: a PATH that vanishes over SSH, an alias that does not work in a script, an rc file that breaks scp, and a cron job that cannot find node.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> putting <code>export PATH=…</code> in <code>~/.bashrc</code> and concluding it works, because your terminal reads that file. Then a cron job, a systemd unit or <code>ssh host 'cmd'</code> fails with "command not found" — all three skip <code>~/.bashrc</code> entirely. Meanwhile a desktop terminal reads it, an SSH login reads <code>~/.profile</code> which usually sources it, and a script reads nothing: three environments, three results, from one setting. Put environment in the profile, and for anything automated do not rely on shell files at all — declare it in the crontab, the unit file, or the script itself.</div>
<p class="note-ct"><strong>Two lines that answer every version of this question:</strong> <code>shopt -q login_shell &amp;&amp; echo login</code> and <code>[[ \$- == *i* ]] &amp;&amp; echo interactive</code>. Run them in whatever context is misbehaving — a terminal, an <code>ssh host 'cmd'</code>, a cron job writing to a file — and the decision table above tells you immediately which file that context read, and therefore where your setting needs to live.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>Rốt cuộc file khởi động nào được đọc</h2>
<p class="lead"><code>~/.bashrc</code>, <code>~/.bash_profile</code>, <code>~/.profile</code>, <code>/etc/profile</code> — bốn file trông đều như "chỗ tôi đặt thiết lập shell", và mỗi cái được đọc trong những tình huống khác nhau. Đoán mò thì tốn của bạn cả một buổi chiều; còn cái luật thì gói vừa trong một cái bảng.</p>

<h3>Ba loại shell</h3>
${slide('lx-08', 10, 'Ba loại shell — hỏi thẳng bằng login_shell và $-')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Shell đăng nhập</span><span class="lz-lnote">Khởi động bằng việc xác thực: một phiên SSH, đăng nhập ở console, <code>su -</code>, <code>bash -l</code>. Đọc các file <strong>profile</strong>, một lần, ở đầu phiên.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tương tác, không đăng nhập</span><span class="lz-lnote">Một tab terminal mới, một ô <code>tmux</code>, gõ <code>bash</code>. Đọc <strong>~/.bashrc</strong>. Có dấu nhắc và có TTY, nhưng bạn không xác thực lại.</span></div>
  <div class="lz-layer"><span class="lz-lname">Không tương tác</span><span class="lz-lnote">Một script, một công việc cron, <code>ssh host 'lệnh'</code>, một unit systemd. Mặc định KHÔNG đọc <strong>gì cả</strong>. Không dấu nhắc, không TTY.</span></div>
</div>
<pre><code><span class="tok-comment"># Tôi đang ở loại nào?</span>
shopt -q login_shell &amp;&amp; echo "đăng nhập" || echo "không đăng nhập"
[[ \$- == *i* ]] &amp;&amp; echo "tương tác" || echo "không tương tác"
echo "\$0"                  <span class="tok-comment"># dấu gạch ngang đứng đầu (-bash) cũng nghĩa là đăng nhập</span></code></pre>
<div class="out">không đăng nhập
tương tác
bash</div>
<p><code>\$-</code> giữ các cờ tuỳ chọn của shell hiện tại; có chữ <code>i</code> trong đó nghĩa là tương tác. Hai dòng đó là phép thử dứt khoát, và đáng nhớ vì mọi câu hỏi về file khởi động đều rút gọn về câu "cái này thuộc loại nào trong ba loại".</p>
<div class="callout">Một chi tiết đo trên Ubuntu 24.04: dấu gạch đầu trong <code>\$0</code> do thứ <em>KHỞI ĐỘNG</em> shell đặt vào — <code>login</code>, <code>sshd</code>, <code>su -</code> — nên <code>su - an -c 'echo \$0'</code> in <code>-bash</code>, còn <code>bash -l -c 'echo \$0'</code> in <code>bash</code> trơn dù shell đó ĐÚNG LÀ shell đăng nhập. Có gạch là chắc chắn login; không có gạch thì chưa chứng minh được gì. <code>shopt -q login_shell</code> mới là phép thử không bao giờ nói dối.</div>

<h3>Bảng quyết định</h3>
${slide('lx-08', 11, 'bash đọc file nào: tuỳ loại shell (đo thật)')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Shell đăng nhập</span><span class="lz-t">/etc/profile → rồi CÁI ĐẦU TIÊN trong: ~/.bash_profile, ~/.bash_login, ~/.profile</span><span class="lz-d">Chỉ cái đầu tiên TỒN TẠI được đọc; những cái còn lại bị bỏ qua hoàn toàn. Đây là lý do tạo ra ~/.bash_profile có thể âm thầm vô hiệu hoá ~/.profile của bạn.</span></div>
  <div class="lz-step"><span class="lz-k">Tương tác, không đăng nhập</span><span class="lz-t">/etc/bash.bashrc → ~/.bashrc</span><span class="lz-d">Các file profile KHÔNG được đọc. Mỗi tab terminal mới đều đi theo đường này.</span></div>
  <div class="lz-step"><span class="lz-k">Không tương tác</span><span class="lz-t">không gì cả — trừ khi có đặt BASH_ENV</span><span class="lz-d">Một script hoàn toàn không nhận file rc nào. Đây là toàn bộ lời giải thích cho câu "chạy ở terminal thì được, cron thì hỏng".</span></div>
  <div class="lz-step"><span class="lz-k">Đăng xuất</span><span class="lz-t">~/.bash_logout</span><span class="lz-d">Chỉ với shell đăng nhập, lúc thoát. Ít dùng; thi thoảng tiện để xoá màn hình hay dọn một ssh-agent.</span></div>
</div>
<div class="callout warn"><strong>Với shell đăng nhập, bash chỉ đọc file profile ĐẦU TIÊN nó tìm thấy.</strong> Thứ tự là <code>~/.bash_profile</code>, rồi <code>~/.bash_login</code>, rồi <code>~/.profile</code>. Debian và Ubuntu kèm sẵn một <code>~/.profile</code>; khoảnh khắc một trình cài đặt nào đó tạo ra <code>~/.bash_profile</code>, file <code>~/.profile</code> của bạn thôi được đọc và mọi thứ trong đó — thường là các phần bổ sung <code>PATH</code> — âm thầm biến mất khỏi các phiên SSH trong khi vẫn chạy tốt ở terminal trên máy để bàn. Nếu bạn có cả hai file, cái <code>~/.bash_profile</code> BẮT BUỘC phải source cái kia một cách tường minh.</div>

<h3>Vì sao một phiên SSH hành xử khác một tab terminal</h3>
${slide('lx-08', 13, "ssh host 'lệnh' đọc .bashrc — rồi dừng ở cái chốt")}
<pre><code><span class="tok-comment"># Shell đăng nhập tương tác — đọc .profile, và .profile thường source .bashrc</span>
ssh vps

<span class="tok-comment"># KHÔNG tương tác, không đăng nhập — bash của Debian/Ubuntu có đọc ~/.bashrc, nhưng chỉ tới cái chốt</span>
ssh vps 'echo \$PATH'
ssh vps 'node --version'</code></pre>
<div class="out">/usr/local/bin:/usr/bin:/bin
bash: node: command not found</div>
<p>Cùng một máy, cùng một người dùng, hai câu trả lời khác nhau. Đăng nhập tương tác thì chạy chuỗi profile; còn truyền một lệnh vào cho <code>ssh</code> thì không, nên một <code>PATH</code> do nvm hay một trình quản lý phiên bản dựng lên đơn giản là vắng mặt. Chuyện này bẫy những người deploy qua SSH suốt ngày.</p>
<pre><code><span class="tok-comment"># Ép một shell đăng nhập cho lệnh chạy từ xa</span>
ssh vps 'bash -lc "node --version"'

<span class="tok-comment"># Hoặc, tốt hơn trong một script: dùng đường dẫn tuyệt đối</span>
ssh vps '/home/deploy/.nvm/versions/node/v22.6.0/bin/node --version'</code></pre>

<div class="callout warn"><strong>Đo bằng một <code>sshd</code> thật (container Ubuntu 24.04, 28/09/2026), và nó sửa một niềm tin phổ biến.</strong> Một lệnh chạy từ xa KHÔNG phải là "không đọc gì": Debian và Ubuntu dựng bash sao cho khi <code>sshd</code> khởi động nó ở chế độ không tương tác, nó đọc <code>/etc/bash.bashrc</code> và <code>~/.bashrc</code> — rồi cái chốt ở đầu <code>~/.bashrc</code> (mục kế tiếp) chặn nó lại sau vài dòng. Với các dòng của <code>nvm</code> nằm ở <em>CUỐI</em> <code>~/.bashrc</code>, đúng chỗ trình cài của nó đặt vào, các dấu mốc trong file cho thấy rõ điều đó:
<pre><code>ssh lab 'node --version'
ssh lab 'bash -lc "node --version"'</code></pre>
<div class="out">  -&gt; /etc/bash.bashrc
  -&gt; ~/.bashrc (dòng 1, TRƯỚC cái chốt)
bash: line 1: node: command not found
  -&gt; /etc/profile
  -&gt; ~/.profile
  -&gt; ~/.bashrc (dòng 1, TRƯỚC cái chốt)
bash: line 1: node: command not found</div>
Vậy <code>bash -lc</code> chỉ là cách chữa khi dòng <code>PATH</code> nằm trong <code>~/.profile</code>; một shell login mà không tương tác vẫn dừng ở đúng cái chốt đó. Với script deploy, đường dẫn tuyệt đối là câu trả lời không thể hỏng. (Cái <code>PATH</code> mà lệnh từ xa nhận được — <code>…:/usr/games:/usr/local/games:/snap/bin</code> trên Ubuntu — đến từ <code>/etc/environment</code> qua PAM, không từ file shell nào.)</div>

<h3>Cái chốt ở đầu ~/.bashrc</h3>
<pre><code><span class="tok-comment"># File ~/.bashrc mặc định của Ubuntu mở đầu bằng đoạn này</span>
case \$- in
    *i*) ;;
      *) return;;
esac</code></pre>
<p>Nó nghĩa là: nếu shell này không tương tác thì NGỪNG đọc file ngay tại đây. Lý do là <code>~/.bashrc</code> đầy những thứ vô nghĩa — hoặc phá hoại thật sự — bên ngoài một terminal: bí danh, một dấu nhắc có màu, thiết lập lịch sử, gợi ý hoàn tất lệnh. Một shell không tương tác mà chạy hết đám đó thì vừa chậm hơn vừa, tệ hơn, còn IN RA thứ gì đó. Bất cứ thứ gì in ra stdout từ một file rc đều làm hỏng <code>scp</code>, <code>rsync</code> và <code>git push</code> qua SSH, vì các giao thức đó chờ đợi dòng dữ liệu chỉ chứa đúng dữ liệu của chúng.</p>
<div class="callout warn">Đây là nguyên nhân của kiểu hỏng <code>scp</code> kinh điển: ai đó thêm <code>echo "Chào mừng trở lại!"</code> hay <code>neofetch</code> vào gần đầu <code>~/.bashrc</code>, PHÍA TRÊN cái chốt, và việc truyền file bắt đầu hỏng với một lỗi giao thức trong khi đăng nhập tương tác thì trông hoàn toàn bình thường. <strong>Mọi thứ có in ra đều phải nằm DƯỚI cái chốt tương tác</strong>, và tốt nhất là nằm trong file profile chứ không phải file rc.</div>

<h3>Sắp xếp các file thế nào</h3>
<pre><code><span class="tok-comment"># ~/.profile — môi trường, một lần mỗi phiên, được mọi thứ thừa kế</span>
export EDITOR=vim
export LANG=en_US.UTF-8
case ":\$PATH:" in
  *":\$HOME/.local/bin:"*) ;;
  *) export PATH="\$HOME/.local/bin:\$PATH" ;;
esac

<span class="tok-comment"># Cho shell đăng nhập tương tác nhận luôn cả phần thiết lập tương tác</span>
if [ -n "\$BASH_VERSION" ] &amp;&amp; [ -f "\$HOME/.bashrc" ]; then
  . "\$HOME/.bashrc"
fi</code></pre>
<pre><code><span class="tok-comment"># ~/.bashrc — chỉ những tiện nghi cho việc gõ tay</span>
case \$- in *i*) ;; *) return;; esac      <span class="tok-comment"># cái chốt, dòng mã thật ĐẦU TIÊN</span>

alias ll='ls -alF'
alias gs='git status'
shopt -s globstar histappend checkwinsize
HISTSIZE=100000
PS1='\\u@\\h:\\w\\\$ '</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Đặt vào <code>~/.profile</code></span><span class="v">Các biến đã <code>export</code>: <code>PATH</code>, <code>EDITOR</code>, <code>LANG</code>, <code>JAVA_HOME</code>. Mọi thứ mà một <em>TIẾN TRÌNH CON</em> cần nhìn thấy.</span></div>
  <div class="kv"><span class="k">Đặt vào <code>~/.bashrc</code></span><span class="v">Bí danh, hàm, dấu nhắc, tuỳ chọn lịch sử, gợi ý hoàn tất, <code>shopt</code>. Mọi thứ mà chỉ <em>MỘT CON NGƯỜI NGỒI TRƯỚC BÀN PHÍM</em> cần.</span></div>
  <div class="kv"><span class="k">Không đặt vào cả hai</span><span class="v">Bí mật. Một dòng <code>export API_KEY=…</code> trong file shell thì mọi tiến trình bạn khởi động đều nhìn thấy, và ai đọc được file cũng thấy. Bài 8.3.</span></div>
</div>
<div class="callout ok">Quy tắc bỏ túi: <strong>nếu một SCRIPT cần nó thì nó thuộc về profile; nếu chỉ BẠN cần nó thì nó thuộc về rc.</strong> Một bí danh đặt trong <code>~/.profile</code> là vô dụng (dù sao bí danh cũng tắt trong shell không tương tác); một <code>PATH</code> đặt trong <code>~/.bashrc</code> thì vẫn chạy nhưng lại thêm vào đầu ở mỗi shell lồng nhau. Đặt mỗi thứ vào đúng chỗ là cả hai vấn đề cùng biến mất.</div>

<h3>Áp dụng thay đổi mà không cần đăng xuất</h3>
<pre><code>source ~/.bashrc                 <span class="tok-comment"># đọc lại nó vào shell HIỆN TẠI</span>
. ~/.bashrc                      <span class="tok-comment"># y hệt, cách viết chuẩn POSIX</span>
exec bash                        <span class="tok-comment"># thay shell này bằng một shell mới tinh</span>
exec bash -l                     <span class="tok-comment"># shell ĐĂNG NHẬP mới — đọc lại cả profile</span></code></pre>
<div class="callout warn">Lưu ý rằng <code>source</code> chạy lại file <em>CHỒNG THÊM</em> lên những gì đã chạy. Với một file rc bền vững thì không sao; với một file cứ vô điều kiện thêm vào đầu <code>PATH</code> thì source ba lần cho bạn ba bản sao (Bài 8.1). Và <code>source</code> KHÔNG <em>GỠ BỎ</em> được thứ gì: nếu bạn xoá một bí danh khỏi file rồi source lại, cái bí danh đó vẫn còn định nghĩa trong shell đang chạy. Khi phân vân thì <code>exec bash -l</code> — nó bắt đầu lại từ sạch sẽ.</div>

<h3>cron và systemd nằm ở đâu trong bức tranh này</h3>
${slide('lx-08', 15, 'cron chỉ cho 6 biến: PATH=/usr/bin:/bin, SHELL=/bin/sh')}
<pre><code><span class="tok-comment"># Một công việc cron THẬT SỰ nhận được gì</span>
* * * * * env &gt; /tmp/cron-env.txt
cat /tmp/cron-env.txt</code></pre>
<div class="out">HOME=/home/deploy
LOGNAME=deploy
PATH=/usr/bin:/bin
SHELL=/bin/sh
PWD=/home/deploy</div>
<p>Năm biến, một <code>PATH</code> có hai mục, và <code>SHELL=/bin/sh</code> — không phải bash. Không <code>~/.profile</code>, không <code>~/.bashrc</code>, không trình quản lý phiên bản nào của bạn, không biến export nào của bạn. Mọi thứ bạn dựa vào khi gõ tay đều vắng mặt.</p>
<div class="callout">Chạy thật trên container Ubuntu 24.04 ngày 28/09/2026 (<code>* * * * * env &gt; /tmp/cron-env.txt; mytool …</code>, với <code>mytool</code> nằm ở <code>/usr/local/bin</code>), cron trao cho công việc <strong>SÁU</strong> biến — năm biến ở trên cộng <code>LANG=C.UTF-8</code>, thứ mà cấu hình PAM của cron đọc từ <code>/etc/default/locale</code> — và công việc hỏng với <code>/bin/sh: 1: mytool: not found</code>, mã 127, trong khi gõ tay <code>mytool</code> thì in <code>mytool chay ok</code>. Để ý tiền tố: lỗi đến từ <code>/bin/sh</code> (trên Ubuntu là dash), vì cron chạy mọi dòng bằng <code>SHELL=/bin/sh</code> — cú pháp chỉ bash mới hiểu mà viết thẳng vào dòng crontab cũng hỏng vì cùng lý do.</div>
<pre><code><span class="tok-comment"># Ba cách chữa, tốt nhất xếp trước</span>

<span class="tok-comment"># 1. Đường dẫn tuyệt đối trong script, và tự đặt PATH ở đầu chính script đó</span>
PATH=/usr/local/bin:/usr/bin:/bin
export PATH

<span class="tok-comment"># 2. Đặt ngay trong crontab — áp cho mọi công việc trong crontab đó</span>
PATH=/usr/local/bin:/usr/bin:/bin
0 3 * * * /srv/app/backup.sh

<span class="tok-comment"># 3. Ép một shell đăng nhập — thừa kế profile của bạn, nhưng chậm hơn và mong manh</span>
0 3 * * * bash -lc '/srv/app/backup.sh'</code></pre>
<p>Các unit của systemd cũng cùng câu chuyện với cú pháp khác: chúng hoàn toàn không đọc file shell nào, và bạn khai báo thứ chúng cần bằng <code>Environment=</code>, <code>EnvironmentFile=</code>, <code>WorkingDirectory=</code> và <code>User=</code>. Chương 11 nói kỹ chuyện đó; điểm mấu chốt ở đây là <strong>cả cron lẫn systemd đều KHÔNG phải một phiên shell</strong>, nên không thứ gì trong đám file của bài này áp dụng cho chúng.</p>

<h3>Gỡ xem file nào đã chạy</h3>
${slide('lx-08', 12, 'Đo bằng dấu mốc: mỗi cách gọi, một kết quả')}
<pre><code><span class="tok-comment"># Đặt một dấu mốc vào mỗi file, tạm thời thôi</span>
echo 'echo "đã đọc: ~/.profile" &gt;&amp;2' &gt;&gt; ~/.profile
echo 'echo "đã đọc: ~/.bashrc"  &gt;&amp;2' &gt;&gt; ~/.bashrc

bash -lc true      <span class="tok-comment"># đăng nhập</span>
bash -ic true      <span class="tok-comment"># tương tác, không đăng nhập</span>
bash -c true       <span class="tok-comment"># không tương tác</span></code></pre>
<div class="out">đã đọc: ~/.profile
đã đọc: ~/.bashrc
</div>
<div class="callout warn"><strong>Hai dòng, không phải ba</strong> (đo trên Ubuntu 24.04 với <code>~/.profile</code> và <code>~/.bashrc</code> mặc định). <code>bash -lc true</code> có chạy <code>~/.profile</code>, và <code>~/.profile</code> có gọi <code>. "\$HOME/.bashrc"</code> — nhưng dấu mốc được <em>NỐI VÀO CUỐI</em> <code>~/.bashrc</code>, nằm dưới cái chốt tương tác, mà shell <code>-c</code> thì không tương tác, nên nó quay về trước khi tới dấu mốc. Đặt thêm một dấu mốc ở dòng <em>ĐẦU TIÊN</em> của <code>~/.bashrc</code> thì trường hợp login cũng in ra nó: cặp dấu mốc đó là bức ảnh rõ nhất về cái chốt mà bạn từng có.</div>
<p>Ba cách gọi, ba câu trả lời khác nhau, và cái thứ ba chẳng in ra gì cả — đó là toàn bộ bài học gói trong một thí nghiệm. Hãy đưa các dấu mốc ra stderr (<code>&gt;&amp;2</code>) để chúng không thể làm hỏng một lệnh <code>scp</code> trong lúc bạn đang thử, và nhớ xoá chúng đi sau đó.</p>
<pre><code>bash -lx -c true 2&gt;&amp;1 | grep -E '^\\+.*(profile|bashrc)'   <span class="tok-comment"># lần theo cả chuỗi</span></code></pre>


<h3>zsh và macOS: cùng một ý, bốn file</h3>
${slide('lx-08', 14, 'zsh: .zshenv → .zprofile → .zshrc → .zlogin, đo thật')}
<p>macOS dùng zsh làm shell mặc định từ 2019, và zsh chia việc cho bốn file thay vì luật "file profile đầu tiên thắng" của bash. Đo trên Mac M1 bằng một thư mục nháp thay cho thư mục nhà thật (<code>ZDOTDIR</code> nói cho zsh biết tìm file ở đâu), mỗi file chứa đúng một dòng <code>echo</code> ra stderr:</p>
<pre><code>ZDOTDIR=~/thu/zdot zsh -c true
ZDOTDIR=~/thu/zdot zsh -i -c true
ZDOTDIR=~/thu/zdot zsh -l -c true
ZDOTDIR=~/thu/zdot zsh -l -i -c exit</code></pre>
<div class="out">  -&gt; ZDOTDIR/.zshenv
  -&gt; ZDOTDIR/.zshenv
  -&gt; ZDOTDIR/.zshrc
  -&gt; ZDOTDIR/.zshenv
  -&gt; ZDOTDIR/.zprofile
  -&gt; ZDOTDIR/.zlogin
  -&gt; ZDOTDIR/.zshenv
  -&gt; ZDOTDIR/.zprofile
  -&gt; ZDOTDIR/.zshrc
  -&gt; ZDOTDIR/.zlogin
  -&gt; ZDOTDIR/.zlogout</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>.zshenv</code></span><span class="v">MỌI zsh đều đọc, kể cả script. Giữ nó thật nhỏ — thứ gì chậm hay in ra ở đây sẽ làm chậm hoặc làm hỏng mọi script.</span></div>
  <div class="kv"><span class="k"><code>.zprofile</code></span><span class="v">Shell login, đọc SAU <code>/etc/zprofile</code> (file chạy <code>path_helper</code>). Chỗ đúng cho <code>PATH</code> và <code>brew shellenv</code>.</span></div>
  <div class="kv"><span class="k"><code>.zshrc</code></span><span class="v">Shell tương tác: bí danh, dấu nhắc, <code>setopt</code>, gợi ý hoàn tất. zsh không cần cái chốt — trường hợp khác nó đơn giản là không được đọc.</span></div>
  <div class="kv"><span class="k"><code>.zlogin</code> · <code>.zlogout</code></span><span class="v">Shell login, SAU <code>.zshrc</code> · lúc thoát. Hiếm khi cần.</span></div>
</div>
<div class="callout ok"><strong>Terminal.app và iTerm mở shell LOGIN ở mọi tab mới</strong> — <code>ps</code> trên chiếc Mac này liệt kê chúng là <code>-zsh</code>, có dấu gạch đầu. Điều đó NGƯỢC với máy Linux để bàn, và giải thích hai cú bất ngờ kinh điển trên Mac: thứ bạn đặt trong <code>~/.zprofile</code> chạy ở MỌI tab, và khi shell là <code>/bin/bash</code> (3.2) thì tab mới đọc <code>~/.bash_profile</code> nhưng KHÔNG đọc <code>~/.bashrc</code> — đo bằng <code>HOME=~/thu/home /bin/bash -l -c true</code>, chỉ <code>~/.bash_profile</code> in dấu mốc của nó.</div>

<h3>Bảng cờ: khởi động bash đúng kiểu mình muốn</h3>
<table>
<tr><th>Cờ / lệnh</th><th>Nghĩa</th><th>Đọc những gì (Ubuntu)</th></tr>
<tr><td><code>bash -l</code> · <code>--login</code></td><td>hành xử như shell đăng nhập</td><td><code>/etc/profile</code> + cái đầu tiên có mặt trong <code>~/.bash_profile</code>, <code>~/.bash_login</code>, <code>~/.profile</code></td></tr>
<tr><td><code>bash -i</code></td><td>ép tương tác</td><td><code>/etc/bash.bashrc</code> + <code>~/.bashrc</code></td></tr>
<tr><td><code>bash -c 'lệnh'</code></td><td>chạy một chuỗi, không tương tác</td><td>không gì cả (hoặc <code>\$BASH_ENV</code>)</td></tr>
<tr><td><code>bash --norc</code></td><td>tương tác, bỏ qua <code>~/.bashrc</code></td><td>không gì — một shell sạch để thử</td></tr>
<tr><td><code>bash --noprofile</code></td><td>login, bỏ qua các file profile</td><td>không gì từ chuỗi login</td></tr>
<tr><td><code>bash --rcfile F</code></td><td>tương tác, đọc F thay cho <code>~/.bashrc</code></td><td>chỉ F</td></tr>
<tr><td><code>BASH_ENV=F bash -c …</code></td><td>cho một script một file khởi động</td><td>F</td></tr>
<tr><td><code>bash -lx -c true</code></td><td>lần theo từng dòng của chuỗi khởi động</td><td>thấy từng <code>. file</code> đúng lúc nó xảy ra</td></tr>
<tr><td><code>su an</code> so với <code>su - an</code></td><td>giữ môi trường của người gọi · một lần đăng nhập mới tinh</td><td>đo thật: <code>su</code> giữ <code>PWD=/tmp</code> và biến <code>MARK</code> của root; <code>su -</code> cho <code>PWD=/home/an</code>, <code>MARK</code> rỗng, <code>\$0=-bash</code></td></tr>
<tr><td><code>exec bash -l</code></td><td>thay shell này bằng một shell login mới</td><td>tất cả, từ đầu</td></tr>
</table>

<h3>Chạy thử từng bước</h3>
<p>Thí nghiệm này an toàn trên mọi máy Linux, kể cả một máy chủ thật, vì nó không bao giờ đụng dotfile thật: nó trỏ <code>HOME</code> sang một thư mục nháp chứa bản sao các file mặc định của Ubuntu (<code>/etc/skel</code>), mỗi file thêm một dòng dấu mốc.</p>
<pre><code>H=~/thu-home; mkdir -p \$H; cp /etc/skel/.bashrc /etc/skel/.profile \$H/
sed -i '1i echo "  -&gt; ~/.profile" &gt;&amp;2' \$H/.profile
sed -i '1i echo "  -&gt; ~/.bashrc (dòng 1, TRƯỚC cái chốt)" &gt;&amp;2' \$H/.bashrc
echo 'echo "  -&gt; ~/.bashrc (cuối file, SAU cái chốt)" &gt;&amp;2' &gt;&gt; \$H/.bashrc
HOME=\$H bash -l -c true
HOME=\$H bash -i -c true
HOME=\$H bash -c true
echo 'echo "  -&gt; ~/.bash_profile" &gt;&amp;2' &gt; \$H/.bash_profile
HOME=\$H bash -l -c true</code></pre>
<div class="out">  -&gt; ~/.profile
  -&gt; ~/.bashrc (dòng 1, TRƯỚC cái chốt)
  -&gt; ~/.bashrc (dòng 1, TRƯỚC cái chốt)
  -&gt; ~/.bashrc (cuối file, SAU cái chốt)
  -&gt; ~/.bash_profile</div>
<p>Đọc từng dòng: shell login chạy <code>~/.profile</code>, file này source <code>~/.bashrc</code>, và <code>~/.bashrc</code> dừng ở cái chốt; shell tương tác đọc trọn <code>~/.bashrc</code>; shell <code>-c</code> không in gì; và khi <code>~/.bash_profile</code> đã tồn tại thì <code>~/.profile</code> không bao giờ được đọc nữa. (Trên Mac không có <code>/etc/skel</code> và <code>sed -i</code> cần <code>''</code> — hãy tự tạo hai file bằng tay, rồi dùng <code>/bin/bash</code>, còn zsh thì dùng <code>ZDOTDIR</code> như ở trên.)</p>

<h3>Trên macOS, Fedora và WSL khác gì</h3>
<table>
<tr><th>Hệ</th><th>Một tab terminal mới là</th><th>Nghĩa là</th></tr>
<tr><td>Ubuntu để bàn · Ubuntu trên WSL2</td><td>không login, tương tác</td><td>chỉ <code>~/.bashrc</code>; PATH trong <code>~/.profile</code> đã được thừa kế từ lần đăng nhập đồ hoạ. Trên WSL, hỏi thẳng shell thay vì đoán: <code>shopt -q login_shell &amp;&amp; echo login</code>.</td></tr>
<tr><td>Fedora 44</td><td>không login, tương tác</td><td><code>~/.bash_profile</code> của Fedora chỉ source <code>~/.bashrc</code>, và <code>~/.bashrc</code> của nó KHÔNG có cái chốt tương tác, còn thêm <code>~/.local/bin:~/bin</code> vào PATH ngay ở đó; nó cũng nạp mọi file trong <code>~/.bashrc.d/</code>.</td></tr>
<tr><td>macOS, zsh</td><td><strong>login</strong>, tương tác</td><td><code>.zshenv</code> → <code>/etc/zprofile</code> (<code>path_helper</code>) → <code>.zprofile</code> → <code>.zshrc</code> → <code>.zlogin</code>.</td></tr>
<tr><td>macOS, <code>/bin/bash</code> 3.2</td><td><strong>login</strong>, tương tác</td><td><code>/etc/profile</code> (<code>path_helper</code>, rồi <code>/etc/bashrc</code>) → <code>~/.bash_profile</code>; <code>~/.bashrc</code> chỉ khi <code>~/.bash_profile</code> source nó.</td></tr>
</table>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> trên VPS Ubuntu của nhóm, các công cụ trong <code>~/.local/bin</code> chạy tốt qua SSH suốt mấy tuần — cho tới khi có người chạy một trình cài đặt, và giờ mọi lần đăng nhập SSH đều báo <code>command not found</code> với chúng, trong khi một ô <code>tmux</code> đã mở từ trước thì vẫn chạy. Hãy tái hiện nguyên nhân và cách chữa trong một container, không đụng thư mục nhà thật nào.</p><ol>
<li><code>docker run --rm -it ubuntu:24.04 bash</code>, <code>useradd -m an &amp;&amp; su - an</code>. Tạo <code>~/.local/bin/hello</code> (một script in <code>hello</code>), rồi kiểm rằng <code>bash -l -c hello</code> chạy được — <code>~/.profile</code> của Ubuntu tự thêm <code>~/.local/bin</code> khi thư mục đó tồn tại.</li>
<li>Đóng vai trình cài đặt: <code>echo 'export FOO=1' &gt; ~/.bash_profile</code>. Chạy lại <code>bash -l -c hello</code>, và <code>bash -lx -c true 2&gt;&amp;1 | grep -E '^\\+ \\.'</code> để xem chuỗi login giờ source những file nào.</li>
<li>Chữa cho đúng: cho <code>~/.bash_profile</code> source <code>~/.profile</code> (có chặn bằng <code>[ -f ~/.profile ] &amp;&amp;</code>), vẫn giữ <code>FOO</code>.</li>
<li>Chứng minh cả ba loại shell bằng dấu mốc ra stderr, như ở mục "Chạy thử từng bước", rồi gỡ dấu mốc đi.</li></ol>
<p><strong>Đạt khi:</strong> <code>bash -l -c 'hello; echo \$FOO'</code> in ra <code>hello</code> và <code>1</code>, và bạn giải thích được vì sao ô <code>tmux</code> đã mở sẵn chẳng hề nhận ra vấn đề.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Login shell (shell đăng nhập)</span><span class="v">Shell khởi động bằng việc xác thực (SSH, console, <code>su -</code>, <code>bash -l</code>); đọc các file profile một lần.</span></div>
  <div class="kv"><span class="k">Interactive shell (shell tương tác)</span><span class="v">Shell có dấu nhắc, đọc phím bạn gõ; <code>\$-</code> có chữ <code>i</code>.</span></div>
  <div class="kv"><span class="k">Startup file / dotfile (file khởi động / file chấm)</span><span class="v">File ẩn như <code>~/.bashrc</code> mà shell chạy khi khởi động.</span></div>
  <div class="kv"><span class="k">Interactive guard (cái chốt tương tác)</span><span class="v">Khối <code>case \$- in *i*)</code> làm <code>~/.bashrc</code> quay về sớm khi không tương tác.</span></div>
  <div class="kv"><span class="k">source / <code>.</code> (nạp vào shell hiện tại)</span><span class="v">Chạy một file BÊN TRONG shell đang dùng, nên biến và bí danh của nó ở lại.</span></div>
  <div class="kv"><span class="k">BASH_ENV (file khởi động cho script)</span><span class="v">File mà bash không tương tác đọc đầu tiên — móc khởi động duy nhất mà script có.</span></div>
  <div class="kv"><span class="k">ZDOTDIR (thư mục dotfile của zsh)</span><span class="v">Chỗ zsh tìm các file khởi động; mặc định là <code>\$HOME</code>.</span></div>
  <div class="kv"><span class="k">crontab (bảng lịch cron)</span><span class="v">Bảng việc hẹn giờ của một người dùng; mỗi dòng chạy bằng <code>/bin/sh</code> với môi trường tối giản.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Hỏi thẳng shell nó là gì: <code>shopt -q login_shell</code> và <code>[[ \$- == *i* ]]</code>; có gạch trong <code>\$0</code> là login, không có gạch chưa nói lên gì.</li>
<li>Bash login đọc <code>/etc/profile</code> và CHỈ cái đầu tiên có mặt trong <code>~/.bash_profile</code>, <code>~/.bash_login</code>, <code>~/.profile</code>.</li>
<li>Bash tương tác không login đọc <code>~/.bashrc</code>; <code>bash -c</code> và cron không đọc gì; <code>ssh host 'lệnh'</code> đọc <code>~/.bashrc</code> chỉ tới cái chốt.</li>
<li>Môi trường (<code>PATH</code>, <code>EDITOR</code>) thuộc về profile, tiện nghi gõ tay thuộc về rc, bí mật không thuộc về cả hai.</li>
<li>zsh: <code>.zshenv</code> luôn đọc, <code>.zprofile</code> + <code>.zlogin</code> cho login, <code>.zshrc</code> cho tương tác — và mọi tab terminal trên Mac là shell login.</li>
<li>Thử file khởi động bằng <code>HOME</code>/<code>ZDOTDIR</code> nháp và dấu mốc ra stderr; thử cron bằng một dòng cron thật hoặc <code>env -i</code>.</li>
</ul>

<a class="link-card" href="https://www.gnu.org/software/bash/manual/html_node/Bash-Startup-Files.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Bash Manual — Bash Startup Files</span><span class="lc-sub">Thứ tự chính thống cho mọi chế độ gọi, gồm cả <code>BASH_ENV</code>, <code>--norc</code> và chuyện gì xảy ra khi bash được gọi dưới tên <code>sh</code>.</span></span>
</a>
<a class="link-card" href="https://mywiki.wooledge.org/DotFiles" target="_blank" rel="noopener">
  <span class="lc-ico">🔧</span>
  <span class="lc-body"><span class="lc-title">Greg's Wiki — DotFiles</span><span class="lc-sub">Lời khuyên thực dụng về cái gì đặt ở đâu và vì sao, gồm cả cái bẫy "file profile đầu tiên thắng" và vấn đề làm hỏng scp.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man5/crontab.5.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">crontab(5) — môi trường mà cron cung cấp</span><span class="lc-sub">Chính xác những biến nào cron đặt và cách ghi đè chúng ngay từ crontab. Ngắn, và nó ngăn được kiểu hỏng phổ biến nhất của cron.</span></span>
</a>
<a class="link-card" href="https://zsh.sourceforge.io/Doc/Release/Files.html" target="_blank" rel="noopener">
  <span class="lc-ico">🐚</span>
  <span class="lc-body"><span class="lc-title">zsh Manual — Startup/Shutdown Files</span><span class="lc-sub">Thứ tự chính thức của <code>.zshenv</code>, <code>.zprofile</code>, <code>.zshrc</code>, <code>.zlogin</code> và <code>.zlogout</code>, và cách <code>ZDOTDIR</code> đổi chỗ chúng được đọc.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: đặt nó vào đúng file</span><span class="lc-sub">Các tình huống chấm điểm: một PATH biến mất khi qua SSH, một bí danh không chạy trong script, một file rc làm hỏng scp, và một công việc cron không tìm thấy node.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> đặt <code>export PATH=…</code> vào <code>~/.bashrc</code> rồi kết luận là nó chạy được, vì terminal của bạn có đọc file đó. Rồi một công việc cron, một unit systemd hay lệnh <code>ssh host 'cmd'</code> hỏng với "command not found" — cả ba đều bỏ qua <code>~/.bashrc</code> hoàn toàn. Trong khi đó, một terminal trên máy để bàn thì đọc nó, một lần đăng nhập SSH thì đọc <code>~/.profile</code> mà file này thường source nó, còn một script thì chẳng đọc gì: ba môi trường, ba kết quả, từ một thiết lập duy nhất. Hãy đặt môi trường vào profile, và với mọi thứ chạy tự động thì đừng dựa vào file shell chút nào — hãy khai báo nó ngay trong crontab, trong file unit, hoặc trong chính script.</div>
<p class="note-ct"><strong>Hai dòng trả lời được mọi biến thể của câu hỏi này:</strong> <code>shopt -q login_shell &amp;&amp; echo đăng nhập</code> và <code>[[ \$- == *i* ]] &amp;&amp; echo tương tác</code>. Hãy chạy chúng trong đúng cái ngữ cảnh đang cư xử lạ — một terminal, một lệnh <code>ssh host 'cmd'</code>, một công việc cron ghi ra file — và cái bảng quyết định ở trên lập tức nói cho bạn biết ngữ cảnh đó đã đọc file nào, và do đó thiết lập của bạn cần nằm ở đâu.</p>
</div>
`,
    },
    /* ─────────────────────────── 8.3 ─────────────────────────── */
    {
      title: '8.3 — Environment variables in practice, and where secrets go|||8.3 — Biến môi trường trong thực tế, và bí mật thì đặt ở đâu',
      slug: 'lnx-8-3-bien-moi-truong-bi-mat',
      type: 'LESSON',
      description: 'Đặt biến cho một lệnh, cho một script, cho một dịch vụ và cho một container; file .env và cách nạp nó cho đúng; vì sao /proc/PID/environ làm bí mật lộ ra; và những chỗ NÊN đặt bí mật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.3</span>
<h2>Environment variables in practice</h2>
<p class="lead">"Put it in an environment variable" is the standard answer for configuration, and it is usually right. But <em>which</em> environment, set <em>where</em>, and inherited by <em>what</em> — those are four different questions, and getting them confused is why a value that works in your terminal is missing inside the container.</p>

<h3>Shell variable or environment variable: what export really does</h3>
${slide('lx-08', 16, 'Chỉ biến đã export mới đi theo sang tiến trình con')}
<p>Every bash has two kinds of variables. A <strong>shell variable</strong> lives only inside that shell. An <strong>environment variable</strong> is one that has been <code>export</code>ed: when the shell starts a program (fork, then exec — Lesson 5.1), it hands the program a <em>copy</em> of its exported variables, and nothing else. <code>declare -p</code> shows which kind you have: <code>--</code> means shell-only, <code>-x</code> means exported.</p>
<pre><code>MAU=do; bash -c 'echo "con thay [\$MAU]"'
export MAU; bash -c 'echo "con thay [\$MAU]"'
declare -p MAU
export -n MAU; declare -p MAU</code></pre>
<div class="out">con thay []
con thay [do]
declare -x MAU="do"
declare -- MAU="do"</div>
<p><code>export -n</code> takes the export flag away again without deleting the value; <code>unset</code> deletes the variable entirely. Note the single quotes around the child's command: they stop <em>your</em> shell from expanding <code>\$MAU</code> first, so what you see really is what the child received.</p>
${slide('lx-08', 17, 'Con không sửa được cha — môi trường đóng băng lúc exec')}
<pre><code>export SO=1
bash -c 'SO=2; export SO; echo "trong con: \$SO"'
echo "cha van: \$SO"
( SO=3 ); echo "sau subshell: \$SO"
sleep 300 &amp; P=\$!
export TOKEN_MOI=abc
tr '\\0' '\\n' &lt; /proc/\$P/environ | grep -c TOKEN_MOI</code></pre>
<div class="out">trong con: 2
cha van: 1
sau subshell: 1
0</div>
<p>Two rules fall out of that output, and between them they explain most "the variable is set but the program does not see it" reports. <strong>The environment flows down only</strong>: a child (or a <code>( subshell )</code>) can change its own copy, but there is no channel back up to the parent — which is why a script cannot change your shell's <code>PATH</code> or current directory, and why you <code>source</code> a file (run it <em>in</em> your shell) instead of <code>bash</code>-ing it when you want its variables. <strong>The copy is frozen at exec</strong>: the <code>sleep</code> started before <code>TOKEN_MOI</code> existed and never learns about it. A running service is the same — change its <code>.env</code> and nothing happens until you restart it.</p>

<h3>Setting a variable for exactly one command</h3>
${slide('lx-08', 18, 'Đặt biến cho đúng một lệnh: tiền tố và env')}
<pre><code>NODE_ENV=production node server.js       <span class="tok-comment"># only this invocation</span>
LOG_LEVEL=debug ./deploy.sh staging
LC_ALL=C sort data.txt                   <span class="tok-comment"># Lesson 3.4's locale fix</span>

echo "\$NODE_ENV"                         <span class="tok-comment"># still unset afterwards</span></code></pre>
<div class="out">
</div>
<p>A <code>KEY=value</code> prefix on a command line puts the variable into <em>that command's</em> environment only. Nothing leaks into your shell, which makes it the safest way to try something — and the right way to pass a one-off setting in a script.</p>
<pre><code>env NODE_ENV=production node server.js   <span class="tok-comment"># explicit, same effect</span>
env -u DEBUG node server.js              <span class="tok-comment"># -u: REMOVE a variable for this command</span>
env -i PATH=/usr/bin node server.js      <span class="tok-comment"># -i: start from an empty environment</span></code></pre>

<p>What does a truly empty environment look like? Measured on Ubuntu 24.04:</p>
<pre><code>env -i bash -c 'echo "HOME=[\$HOME] USER=[\$USER] PATH=[\$PATH]"'
env -i bash -c env</code></pre>
<div class="out">HOME=[] USER=[] PATH=[/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin]
PWD=/home/an
SHLVL=0
_=/usr/bin/env</div>
<p>A subtle one: with no <code>PATH</code> at all, bash falls back to a built-in default so that it can still find programs — but it keeps that value as a <em>shell</em> variable. The second command proves it: <code>env</code>, a child, sees only the three variables bash always exports. <code>HOME</code> and <code>USER</code> are simply gone, which is exactly the situation a tool meets under <code>env -i</code>, in some containers, and partly under cron.</p>

<h3>Four places a variable can come from</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Command prefix</span><span class="lz-lnote"><code>KEY=value cmd</code> — one process, nothing inherited by your shell. Use for experiments and per-invocation overrides.</span></div>
  <div class="lz-layer"><span class="lz-lname">Shell session</span><span class="lz-lnote"><code>export KEY=value</code> in <code>~/.profile</code> — this shell and everything it starts, for the whole session (Lesson 8.2).</span></div>
  <div class="lz-layer"><span class="lz-lname">Service unit</span><span class="lz-lnote"><code>Environment=</code> or <code>EnvironmentFile=</code> in a systemd unit — the only thing a daemon reads. No shell files apply.</span></div>
  <div class="lz-layer"><span class="lz-lname">Container</span><span class="lz-lnote"><code>ENV</code> in a Dockerfile (baked into the image), <code>-e</code> / <code>env_file</code> at run time (not baked). Two very different lifetimes.</span></div>
</div>
<div class="callout warn">The container distinction matters and is regularly got wrong. <code>ENV API_KEY=…</code> in a Dockerfile is stored <em>in the image layer</em> — anyone who can pull the image can read it with <code>docker history</code>, forever, including after you rotate the key. Same for <code>ARG</code> passed with <code>--build-arg</code>: it appears in the build history. Secrets belong at <em>run</em> time, via <code>-e</code>, <code>--env-file</code> or a secrets mount — never in the image.</div>

<h3>.env files: what they are and are not</h3>
${slide('lx-08', 19, '.env không tự vào tiến trình nào — nạp nó cho đúng')}
<pre><code><span class="tok-comment"># .env — plain KEY=value, no export, no spaces around =</span>
DATABASE_URL=postgres://user:pass@localhost:5432/app
PORT=3000
LOG_LEVEL=info</code></pre>
<p>A <code>.env</code> file is a <em>convention</em>, not a feature of the shell. Nothing reads it automatically. Three common ways to load one, each with a catch:</p>
<pre><code><span class="tok-comment"># 1. Application-level (dotenv, Prisma, docker compose) — safest</span>
<span class="tok-comment">#    The library parses the file itself; quoting and '#' are handled properly.</span>

<span class="tok-comment"># 2. In a script: source it, with automatic export</span>
set -a                <span class="tok-comment"># allexport: every assignment becomes exported</span>
source .env
set +a

<span class="tok-comment"># 3. For one command, without touching the shell</span>
env \$(grep -v '^#' .env | xargs) node server.js     <span class="tok-comment"># FRAGILE — see below</span></code></pre>
<div class="callout warn">Form 3 is widely copied and quietly broken. It goes through word splitting (Lesson 6.2), so any value containing a space — a password, a connection string with parameters — is torn into several arguments. It also cannot handle quotes or <code>#</code> inside a value. Use form 2, or better, let the application load the file. If you must do it in the shell, <code>set -a; source .env; set +a</code> is the correct incantation, because <code>source</code> uses the shell's own parser.</div>
<p>Both failure modes, measured with a value that contains a space and no quotes — a password like <code>mat khau</code> is all it takes:</p>
<pre><code>printf 'DB_URL=postgres://app:mat khau@localhost/app\\nPORT=3000\\n' &gt; .env
env \$(grep -v '^#' .env | xargs) sh -c 'echo "[\$DB_URL]"'
. ./.env; echo "exit=\$? DB_URL=[\$DB_URL]"</code></pre>
<div class="out">env: 'khau@localhost/app': No such file or directory
./.env: line 1: khau@localhost/app: No such file or directory
exit=127 DB_URL=[]</div>
<p>The <code>xargs</code> form split the value at the space and handed <code>env</code> a "command" called <code>khau@localhost/app</code>. <code>source</code> read the line as bash would: <code>DB_URL=postgres://app:mat</code> as a one-command prefix, then <code>khau@localhost/app</code> as the command — so the assignment never even reached your shell. Quote the value (<code>DB_URL="postgres://app:mat khau@localhost/app"</code>) and <code>set -a; . ./.env; set +a</code> gives a child the full string; without <code>set -a</code>, your shell has the variables but a child sees nothing, because they were never exported.</p>
<pre><code><span class="tok-comment"># And source only trusted files: .env is EXECUTED as shell code</span>
echo 'rm -rf /tmp/important' &gt;&gt; .env
source .env          <span class="tok-comment"># that line runs</span></code></pre>
<p><code>source</code> does not parse key–value pairs; it runs the file as a bash script. A <code>.env</code> that came from a colleague, a CI artefact or an unfamiliar repository is code you are about to execute as yourself. That is fine for a file you wrote; it is not a safe way to consume a file you did not.</p>

<h3>Why secrets in the environment are not actually secret</h3>
${slide('lx-08', 20, 'Bí mật trong môi trường lộ ở 7 chỗ')}
<pre><code><span class="tok-comment"># A process's full environment, readable by its owner (and root)</span>
tr '\\0' '\\n' &lt; /proc/\$(pgrep -f 'node server.js')/environ | grep -i key</code></pre>
<div class="out">API_KEY=sk-live-4f9a2b7c1e8d
DATABASE_URL=postgres://user:hunter2@localhost/app</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Visible in <code>/proc</code></span><span class="v">Any process you own — and every process root owns — can read the environment of your processes. On a shared machine that is a real exposure.</span></div>
  <div class="kv"><span class="k">Inherited by children</span><span class="v">Every subprocess gets a copy, including things you did not think about: a crash reporter, a build tool, a package's postinstall script.</span></div>
  <div class="kv"><span class="k">Appears in crash dumps and logs</span><span class="v">Many error reporters attach the environment. A stack trace uploaded to a monitoring service can carry the whole thing.</span></div>
  <div class="kv"><span class="k">Leaks via <code>set -x</code></span><span class="v">Lesson 7.4: tracing prints expanded values, so a token ends up in the journal or in a cron email.</span></div>
</div>
<div class="callout">This is not an argument against environment variables — they remain far better than hard-coding a secret in source control, and they are what twelve-factor deployment assumes. It is an argument for knowing the exposure: <strong>environment variables are protected from other <em>users</em>, not from other <em>code running as you</em></strong>. Choose accordingly.</div>

<div class="callout warn"><strong>The dotfiles version of this mistake.</strong> <code>export OPENAI_API_KEY=sk-…</code> in <code>~/.bashrc</code> "works", so it stays there — and then the dotfiles go into a public GitHub repository so they can be shared across machines. The key is now in git history for good: deleting the line in the next commit does not remove it, and anyone who cloned or forked in between still has it. The order of repair is fixed: <strong>rotate the key first</strong>, then clean history. Prevention is cheap: keep secrets in a separate file that git never sees and that only you can read, and load it from the rc file:
<pre><code>install -m 600 /dev/null ~/.secrets             <span class="tok-comment"># created 600 from the start</span>
echo 'export OPENAI_API_KEY=…' &gt;&gt; ~/.secrets
echo '[ -r ~/.secrets ] &amp;&amp; . ~/.secrets' &gt;&gt; ~/.bashrc
echo '.secrets' &gt;&gt; ~/dotfiles/.gitignore
git -C ~/dotfiles log -p | grep -n 'sk-'          <span class="tok-comment"># already leaked?</span></code></pre>
The variable is still exported to every process you start, with all the exposure listed above — this only fixes the <em>file</em>. For anything that runs on a server, the answer remains a 600 file read by the service, not your shell.</div>

<h3>Where secrets should go, roughly best first</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · A secrets manager</span><span class="lz-t">Vault, AWS/GCP Secrets Manager, SOPS + age</span><span class="lz-d">Fetched at start-up, rotatable without a redeploy, access is audited. The right answer once more than one person is involved.</span></div>
  <div class="lz-step"><span class="lz-k">2 · A file with tight permissions</span><span class="lz-t">/opt/app/.env, chmod 600, owned by the service user</span><span class="lz-d">Read once at start-up. Not visible in /proc, not inherited by children, survives deploys. Good for a single VPS.</span></div>
  <div class="lz-step"><span class="lz-k">3 · systemd EnvironmentFile</span><span class="lz-t">EnvironmentFile=/opt/app/.env in the unit</span><span class="lz-d">systemd reads the file as root and hands only that service its values. The file itself stays 600.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Environment variables</span><span class="lz-t">-e / Environment= / export</span><span class="lz-d">Acceptable, and the twelve-factor default — with the /proc exposure above understood.</span></div>
  <div class="lz-step"><span class="lz-k">Never</span><span class="lz-t">committed to git · in a Dockerfile ENV · on a command line</span><span class="lz-d">A command line is world-readable via ps. git history is forever. An image layer keeps the value after rotation.</span></div>
</div>
<pre><code><span class="tok-comment"># A command line is visible to EVERY user on the machine</span>
mysql -u root -phunter2 mydb &amp;
ps aux | grep mysql</code></pre>
<div class="out">deploy  8123  mysql -u root -phunter2 mydb</div>
<p>That is why database clients read a config file (<code>~/.my.cnf</code>, <code>~/.pgpass</code>) or prompt, and why <code>curl</code> has <code>--netrc</code> and <code>-H @file</code>. Whenever a tool offers a way to pass a credential that is <em>not</em> an argument, that alternative exists for this reason.</p>

<h3>Practical setup for one server</h3>
<pre><code><span class="tok-comment"># The file: owned by the service user, readable by nobody else</span>
sudo install -o appuser -g appuser -m 600 /dev/null /opt/app/.env
sudo -u appuser tee -a /opt/app/.env &gt;/dev/null &lt;&lt;'EOF'
DATABASE_URL=postgres://app:REDACTED@localhost:5432/app
API_KEY=REDACTED
EOF

<span class="tok-comment"># The unit reads it; the app never sees the path</span>
sudo tee /etc/systemd/system/myapp.service &gt;/dev/null &lt;&lt;'EOF'
[Service]
User=appuser
EnvironmentFile=/opt/app/.env
ExecStart=/usr/bin/node /opt/app/dist/index.js
EOF

sudo systemctl daemon-reload &amp;&amp; sudo systemctl restart myapp</code></pre>
<div class="callout ok">Two properties worth noticing. The <code>.env</code> lives <em>outside</em> the deployment directory, so a deploy that rsyncs or replaces the app tree cannot overwrite or delete it — the same reasoning behind keeping production env in <code>/opt/&lt;app&gt;/.env</code> rather than in the repo checkout. And <code>install -m 600</code> creates the file with the right mode from the start, rather than creating it world-readable and fixing it afterwards, which leaves a window where it was exposed.</div>

<h3>Checking what a running process actually has</h3>
<pre><code>systemctl show myapp -p Environment
sudo tr '\\0' '\\n' &lt; /proc/\$(pgrep -f 'dist/index.js')/environ | sort
docker exec myapp env | sort
docker inspect myapp --format '{{range .Config.Env}}{{println .}}{{end}}'</code></pre>
<div class="out">NODE_ENV=production
PORT=3000
DATABASE_URL=postgres://app:...@localhost:5432/app</div>
<p>When an application says a variable is missing, do not reason about which file should have set it — look at what the process actually received. These four commands cover a systemd service, any Linux process, a running container and a container's configuration, and one of them answers the question directly in a couple of seconds.</p>

<h3>Variables worth knowing</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>HOME</code> · <code>USER</code> · <code>SHELL</code></span><span class="v">Set at login. In cron <code>HOME</code> exists but <code>USER</code> may not; in a container they are often absent entirely, which breaks tools that assume a home directory.</span></div>
  <div class="kv"><span class="k"><code>LANG</code> · <code>LC_ALL</code></span><span class="v">Locale. Changes sorting (Lesson 3.4), date formats and how tools interpret bytes. <code>LC_ALL=C</code> forces predictable byte-order behaviour in scripts.</span></div>
  <div class="kv"><span class="k"><code>TZ</code></span><span class="v">Timezone for this process. <code>TZ=UTC date</code> without changing the system. Containers default to UTC, which is why log timestamps differ from the host.</span></div>
  <div class="kv"><span class="k"><code>TERM</code></span><span class="v">Terminal type. Absent in cron and in many containers — which is why <code>clear</code>, <code>less</code> and coloured output misbehave there.</span></div>
  <div class="kv"><span class="k"><code>http_proxy</code> · <code>NO_PROXY</code></span><span class="v">Honoured by curl, wget, apt and most language runtimes. The first thing to check when downloads work for you and not for a service.</span></div>
  <div class="kv"><span class="k"><code>TMPDIR</code></span><span class="v">Where <code>mktemp</code> and most tools put temporary files. Redirecting it is how you keep a big build off a small <code>/tmp</code>.</span></div>
</div>


<h3>Flag table: the commands that read and write the environment</h3>
<table>
<tr><th>Command</th><th>Meaning</th><th>Example</th></tr>
<tr><td><code>export NAME=v</code> · <code>export NAME</code></td><td>set and export · export an existing variable</td><td><code>export EDITOR=vim</code></td></tr>
<tr><td><code>export -n NAME</code></td><td>un-export, keep the value</td><td><code>declare -p</code> goes from <code>-x</code> to <code>--</code></td></tr>
<tr><td><code>export -p</code></td><td>list exported variables as <code>declare -x</code> lines</td><td><code>export -p | head</code></td></tr>
<tr><td><code>declare -p NAME</code></td><td>show one variable with its flags</td><td><code>declare -x MAU="do"</code></td></tr>
<tr><td><code>unset NAME</code></td><td>delete the variable</td><td><code>unset TOKEN</code></td></tr>
<tr><td><code>NAME=v cmd</code></td><td>set for one command only</td><td><code>LC_ALL=C sort f</code></td></tr>
<tr><td><code>env</code> · <code>printenv</code></td><td>print the environment (exported only)</td><td><code>env | sort</code></td></tr>
<tr><td><code>printenv NAME</code></td><td>print one; exit 1 if missing</td><td><code>printenv HOME</code></td></tr>
<tr><td><code>env -u NAME cmd</code></td><td>run cmd without NAME</td><td><code>env -u DEBUG node app.js</code></td></tr>
<tr><td><code>env -i cmd</code></td><td>run cmd with an empty environment</td><td><code>env -i PATH=/usr/bin:/bin sh -c …</code></td></tr>
<tr><td><code>set</code></td><td>every variable <em>and</em> function in this shell</td><td><code>set | less</code></td></tr>
<tr><td><code>set -a</code> · <code>set +a</code></td><td>auto-export every assignment · stop</td><td>around <code>. ./.env</code></td></tr>
<tr><td><code>readonly NAME</code></td><td>forbid further changes in this shell</td><td><code>readonly APP_ENV=production</code></td></tr>
</table>
<div class="kv-grid">
  <div class="kv"><span class="k">env vs set</span><span class="v">In the Ubuntu container above, <code>env | wc -l</code> printed 8 and <code>set | wc -l</code> printed 36 — the difference is everything the shell knows that no child will ever see.</span></div>
  <div class="kv"><span class="k">When to use a prefix</span><span class="v">One-off overrides and experiments: nothing leaks into your shell afterwards.</span></div>
  <div class="kv"><span class="k">When NOT to export</span><span class="v">Loop counters, temporaries, and above all secrets you do not want every child to inherit.</span></div>
</div>

<h3>Try it step by step</h3>
<p>Any Linux shell will do (a container is fine). Predict each line first.</p>
<pre><code>X=1; bash -c 'echo "[\$X]"'
export X; bash -c 'echo "[\$X]"'
bash -c 'X=99'; echo "\$X"
env -u X bash -c 'echo "[\${X-unset}]"'
printenv X; printenv NOPE; echo \$?
sleep 60 &amp; P=\$!; export Y=late
tr '\\0' '\\n' &lt; /proc/\$P/environ | grep -E '^(X|Y)='
kill \$P</code></pre>
<div class="out">[]
[1]
1
[unset]
1
1
X=1</div>
<p>The last output line is the whole lesson in one: <code>X</code> was exported <em>before</em> the <code>sleep</code> started, so its copy has it; <code>Y</code> was exported after, so it does not. <code>\${X-unset}</code> prints the word <code>unset</code> only when the variable does not exist at all — handy for telling "empty" from "missing".</p>

<h3>On macOS and WSL</h3>
<table>
<tr><th>Thing</th><th>Ubuntu / WSL2</th><th>macOS (zsh 5.9)</th></tr>
<tr><td>Show a variable's flags</td><td><code>declare -p X</code></td><td><code>typeset -p X</code> → <code>typeset X=do</code> / <code>export X=do</code></td></tr>
<tr><td>Un-export</td><td><code>export -n X</code></td><td><code>typeset +x X</code></td></tr>
<tr><td>Read another process's environment</td><td><code>/proc/PID/environ</code></td><td>there is no <code>/proc</code> on macOS</td></tr>
<tr><td><code>env -i</code>, <code>env -u</code>, <code>printenv</code>, <code>set -a</code></td><td>as above</td><td>the same</td></tr>
<tr><td>Windows variables</td><td>WSL adds the Windows <code>PATH</code> (see 8.1); other Windows variables are not copied in</td><td>—</td></tr>
</table>
<p>The rules — flows down only, frozen at start, <code>export</code> decides what is inherited — are the same on every Unix, because they come from how <code>fork</code> and <code>exec</code> work, not from bash.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your group's backend reads <code>DB_URL</code> from a <code>.env</code>. It works under <code>npm run dev</code>, but the deploy script — which does <code>source .env</code> and then starts the app — connects with a truncated password, and after you fixed <code>.env</code> the running app still used the old value. Reproduce all three effects in <code>~/thu-linux/env</code> (any Linux shell or a container).</p><ol>
<li>Write a <code>.env</code> with <code>DB_URL=postgres://app:mat khau@localhost/app</code> (unquoted) and <code>PORT=3000</code>. Load it with <code>. ./.env</code> and with the <code>xargs</code> form; record each error and what <code>\$DB_URL</code> contains afterwards.</li>
<li>Quote the value, load it with <code>. ./.env</code> only, then run <code>bash -c 'echo "[\$DB_URL] [\$PORT]"'</code>. Explain the empty brackets using <code>declare -p DB_URL</code>. Fix it with <code>set -a</code>.</li>
<li>Start <code>sleep 300 &amp;</code> as "the app", then change <code>PORT=4000</code> in the file and reload it. Compare <code>/proc/\$!/environ</code> with <code>printenv PORT</code>.</li>
<li>Make the file private the right way (<code>install -m 600</code>), and write the one-line <code>ls -l</code> check that proves it.</li></ol>
<p><strong>Done when:</strong> a child shell prints the full URL with the space, the "app" still shows <code>PORT=3000</code> while your shell shows <code>4000</code>, and <code>ls -l .env</code> starts with <code>-rw-------</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Environment variable</span><span class="v">A name=value pair copied from a process to every program it starts.</span></div>
  <div class="kv"><span class="k">Shell variable</span><span class="v">A variable that lives only inside the current shell; children never see it.</span></div>
  <div class="kv"><span class="k">export</span><span class="v">The flag that turns a shell variable into an environment variable (<code>declare -x</code>).</span></div>
  <div class="kv"><span class="k">Inherit</span><span class="v">What a child does with its parent's environment at start-up: take a copy, frozen from then on.</span></div>
  <div class="kv"><span class="k">.env file</span><span class="v">A convention: plain <code>KEY=value</code> lines that some tool must load — nothing reads it on its own.</span></div>
  <div class="kv"><span class="k">allexport (<code>set -a</code>)</span><span class="v">Shell option that exports every assignment made while it is on.</span></div>
  <div class="kv"><span class="k">Secret rotation</span><span class="v">Replacing a leaked credential with a new one so the old value stops working.</span></div>
  <div class="kv"><span class="k">/proc/PID/environ</span><span class="v">The environment a running Linux process was started with, NUL-separated.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Only exported variables reach child processes; <code>declare -p</code> shows <code>-x</code> for exported, <code>--</code> for shell-only.</li>
<li>The environment flows down only and is frozen when a process starts — restart a service after changing its variables.</li>
<li><code>KEY=value cmd</code>, <code>env -u</code> and <code>env -i</code> change the environment for one command without touching your shell.</li>
<li>A <code>.env</code> is loaded by the application or by <code>set -a; . ./.env; set +a</code> — never by the xargs trick; quote values with spaces.</li>
<li><code>source</code> executes the file as bash code: only source files you trust.</li>
<li>Secrets leak through <code>ps</code>, <code>/proc</code>, children, history, dotfiles in git, image layers and <code>set -x</code> — rotate first when one escapes.</li>
</ul>

<a class="link-card" href="https://12factor.net/config" target="_blank" rel="noopener">
  <span class="lc-ico">📐</span>
  <span class="lc-body"><span class="lc-title">The Twelve-Factor App — Config</span><span class="lc-sub">The argument for keeping configuration in the environment rather than in code, and the distinction between config and code that makes it work.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man7/environ.7.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">environ(7) — the environment, and /proc/PID/environ</span><span class="lc-sub">How the environment is stored and who can read it. The page that makes the exposure concrete rather than theoretical.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/building/secrets/" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">Docker — build secrets</span><span class="lc-sub">Why <code>ARG</code> and <code>ENV</code> leak into image history, and the <code>--mount=type=secret</code> alternative that does not.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man1/env.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">env(1) — run a program in a modified environment</span><span class="lc-sub">Every flag of <code>env</code>: <code>-i</code>, <code>-u</code>, <code>-C</code>, <code>-S</code>, and why it is the tool for testing "what does this program see".</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: get the value into the process</span><span class="lc-sub">Graded scenarios: a variable set in the wrong file, a <code>.env</code> with a space in a value that breaks the xargs form, and a secret readable via <code>ps</code>.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> appending a variable to the production <code>.env</code> while a deploy is already running. The deploy loaded the environment when it started, so the new value is not in the running container — but the file <em>does</em> contain it, so every check you make afterwards says the configuration is correct while the application behaves as though it is missing. The fix is to recreate the container (<code>docker compose up -d --no-build &lt;service&gt;</code> with the env loaded) or redeploy. Whenever a setting "is definitely there but has no effect", check whether the process was started before the value existed.</div>
<p class="note-ct"><strong>The question to ask is always "which process, and what did it inherit".</strong> A variable is not set on a machine or on a user — it is set on a process, copied to its children at <code>fork</code>, and frozen from that moment (Lesson 5.1). <code>tr '\\0' '\\n' &lt; /proc/&lt;pid&gt;/environ</code> shows the truth for any process, and it beats reasoning about which file should have been read every single time.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.3</span>
<h2>Biến môi trường trong thực tế</h2>
<p class="lead">"Cứ đặt nó vào biến môi trường" là câu trả lời chuẩn cho việc cấu hình, và thường thì nó đúng. Nhưng <em>MÔI TRƯỜNG NÀO</em>, đặt <em>Ở ĐÂU</em>, và được <em>CÁI GÌ</em> thừa kế — đó là bốn câu hỏi khác nhau, và lẫn lộn chúng chính là lý do một giá trị chạy tốt trong terminal của bạn lại vắng mặt bên trong container.</p>

<h3>Biến shell hay biến môi trường: export thật ra làm gì</h3>
${slide('lx-08', 16, 'Chỉ biến đã export mới đi theo sang tiến trình con')}
<p>Mỗi bash có hai loại biến. <strong>Biến shell</strong> (shell variable) chỉ sống bên trong shell đó. <strong>Biến môi trường</strong> (environment variable) là biến đã được <code>export</code>: khi shell khởi động một chương trình (fork rồi exec — Bài 5.1), nó trao cho chương trình một <em>BẢN SAO</em> các biến đã export, và không gì khác. <code>declare -p</code> cho biết bạn đang có loại nào: <code>--</code> là chỉ-trong-shell, <code>-x</code> là đã export.</p>
<pre><code>MAU=do; bash -c 'echo "con thay [\$MAU]"'
export MAU; bash -c 'echo "con thay [\$MAU]"'
declare -p MAU
export -n MAU; declare -p MAU</code></pre>
<div class="out">con thay []
con thay [do]
declare -x MAU="do"
declare -- MAU="do"</div>
<p><code>export -n</code> gỡ lại cờ export mà không xoá giá trị; <code>unset</code> thì xoá hẳn biến. Để ý cặp nháy đơn quanh lệnh của tiến trình con: chúng chặn shell <em>CỦA BẠN</em> khai triển <code>\$MAU</code> trước, nên thứ bạn thấy đúng là thứ tiến trình con nhận được.</p>
${slide('lx-08', 17, 'Con không sửa được cha — môi trường đóng băng lúc exec')}
<pre><code>export SO=1
bash -c 'SO=2; export SO; echo "trong con: \$SO"'
echo "cha van: \$SO"
( SO=3 ); echo "sau subshell: \$SO"
sleep 300 &amp; P=\$!
export TOKEN_MOI=abc
tr '\\0' '\\n' &lt; /proc/\$P/environ | grep -c TOKEN_MOI</code></pre>
<div class="out">trong con: 2
cha van: 1
sau subshell: 1
0</div>
<p>Hai luật rút ra từ output đó, và gộp lại chúng giải thích phần lớn các ca "biến đã đặt rồi mà chương trình không thấy". <strong>Môi trường chỉ chảy XUỐNG</strong>: tiến trình con (hay một <code>( subshell )</code>) sửa được bản sao của chính nó, nhưng không có đường nào ngược lên cha — đó là lý do một script không đổi được <code>PATH</code> hay thư mục hiện tại của shell bạn, và là lý do bạn <code>source</code> một file (chạy nó BÊN TRONG shell của bạn) thay vì <code>bash</code> nó khi muốn lấy biến của nó. <strong>Bản sao đóng băng lúc exec</strong>: <code>sleep</code> khởi động trước khi <code>TOKEN_MOI</code> tồn tại nên không bao giờ biết tới nó. Một dịch vụ đang chạy cũng y hệt — sửa <code>.env</code> của nó thì chẳng có gì xảy ra cho tới khi bạn khởi động lại nó.</p>

<h3>Đặt biến cho đúng một lệnh</h3>
${slide('lx-08', 18, 'Đặt biến cho đúng một lệnh: tiền tố và env')}
<pre><code>NODE_ENV=production node server.js       <span class="tok-comment"># chỉ lần gọi này</span>
LOG_LEVEL=debug ./deploy.sh staging
LC_ALL=C sort data.txt                   <span class="tok-comment"># cách chữa locale ở Bài 3.4</span>

echo "\$NODE_ENV"                         <span class="tok-comment"># sau đó vẫn chưa được đặt</span></code></pre>
<div class="out">
</div>
<p>Một tiền tố <code>KHOÁ=giá trị</code> trên dòng lệnh đưa biến vào môi trường của <em>ĐÚNG LỆNH ĐÓ</em> thôi. Không gì rò rỉ sang shell của bạn, và điều đó làm nó thành cách an toàn nhất để thử một thứ gì — cũng là cách đúng để truyền một thiết lập dùng một lần trong script.</p>
<pre><code>env NODE_ENV=production node server.js   <span class="tok-comment"># tường minh, cùng tác dụng</span>
env -u DEBUG node server.js              <span class="tok-comment"># -u: GỠ BỎ một biến cho lệnh này</span>
env -i PATH=/usr/bin node server.js      <span class="tok-comment"># -i: bắt đầu từ một môi trường rỗng</span></code></pre>

<p>Một môi trường rỗng thật sự trông ra sao? Đo trên Ubuntu 24.04:</p>
<pre><code>env -i bash -c 'echo "HOME=[\$HOME] USER=[\$USER] PATH=[\$PATH]"'
env -i bash -c env</code></pre>
<div class="out">HOME=[] USER=[] PATH=[/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin]
PWD=/home/an
SHLVL=0
_=/usr/bin/env</div>
<p>Một chỗ tinh tế: khi hoàn toàn không có <code>PATH</code>, bash lùi về một giá trị mặc định dựng sẵn để vẫn tìm được chương trình — nhưng nó giữ giá trị đó như một biến <em>SHELL</em>. Lệnh thứ hai chứng minh điều đó: <code>env</code>, một tiến trình con, chỉ thấy ba biến mà bash luôn export. <code>HOME</code> và <code>USER</code> thì biến mất hẳn, và đó đúng là hoàn cảnh một công cụ gặp phải dưới <code>env -i</code>, trong một số container, và một phần dưới cron.</p>

<h3>Bốn nơi một biến có thể đến từ đó</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Tiền tố dòng lệnh</span><span class="lz-lnote"><code>KHOÁ=giá trị lệnh</code> — một tiến trình, shell của bạn không thừa kế gì. Dùng cho thử nghiệm và cho việc ghi đè theo từng lần gọi.</span></div>
  <div class="lz-layer"><span class="lz-lname">Phiên shell</span><span class="lz-lnote"><code>export KHOÁ=giá trị</code> trong <code>~/.profile</code> — shell này và mọi thứ nó khởi động, suốt cả phiên (Bài 8.2).</span></div>
  <div class="lz-layer"><span class="lz-lname">Unit của dịch vụ</span><span class="lz-lnote"><code>Environment=</code> hoặc <code>EnvironmentFile=</code> trong một unit systemd — thứ DUY NHẤT mà một daemon đọc. Không file shell nào áp dụng.</span></div>
  <div class="lz-layer"><span class="lz-lname">Container</span><span class="lz-lnote"><code>ENV</code> trong Dockerfile (nung vào ảnh), <code>-e</code> / <code>env_file</code> lúc chạy (không nung vào). Hai vòng đời rất khác nhau.</span></div>
</div>
<div class="callout warn">Chỗ phân biệt của container là quan trọng và thường xuyên bị làm sai. <code>ENV API_KEY=…</code> trong một Dockerfile được lưu <em>NGAY TRONG LỚP CỦA ẢNH</em> — ai kéo được ảnh về đều đọc ra bằng <code>docker history</code>, vĩnh viễn, kể cả sau khi bạn xoay khoá. Tương tự với <code>ARG</code> truyền qua <code>--build-arg</code>: nó hiện trong lịch sử dựng. Bí mật thuộc về lúc <em>CHẠY</em>, qua <code>-e</code>, <code>--env-file</code> hay một mount bí mật — không bao giờ nằm trong ảnh.</div>

<h3>File .env: nó là gì và không là gì</h3>
${slide('lx-08', 19, '.env không tự vào tiến trình nào — nạp nó cho đúng')}
<pre><code><span class="tok-comment"># .env — KHOÁ=giá trị thuần, không export, không dấu cách quanh dấu =</span>
DATABASE_URL=postgres://user:pass@localhost:5432/app
PORT=3000
LOG_LEVEL=info</code></pre>
<p>Một file <code>.env</code> là một <em>QUY ƯỚC</em>, không phải một tính năng của shell. Không gì đọc nó một cách tự động. Ba cách nạp thường gặp, mỗi cách một điểm cần lưu ý:</p>
<pre><code><span class="tok-comment"># 1. Ở tầng ứng dụng (dotenv, Prisma, docker compose) — an toàn nhất</span>
<span class="tok-comment">#    Thư viện tự phân tích file; dấu nháy và dấu '#' được xử lý tử tế.</span>

<span class="tok-comment"># 2. Trong một script: source nó, có tự động export</span>
set -a                <span class="tok-comment"># allexport: mọi phép gán đều được export</span>
source .env
set +a

<span class="tok-comment"># 3. Cho đúng một lệnh, không đụng tới shell</span>
env \$(grep -v '^#' .env | xargs) node server.js     <span class="tok-comment"># MONG MANH — xem bên dưới</span></code></pre>
<div class="callout warn">Cách 3 được chép đi chép lại khắp nơi và hỏng một cách âm thầm. Nó đi qua phép cắt từ (Bài 6.2), nên mọi giá trị có chứa dấu cách — một mật khẩu, một chuỗi kết nối có tham số — đều bị xé thành nhiều tham số. Nó cũng không xử lý nổi dấu nháy hay dấu <code>#</code> nằm bên trong một giá trị. Hãy dùng cách 2, hoặc tốt hơn là để ứng dụng tự nạp file. Nếu buộc phải làm trong shell thì <code>set -a; source .env; set +a</code> mới là câu thần chú đúng, vì <code>source</code> dùng chính bộ phân tích của shell.</div>
<p>Cả hai kiểu hỏng, đo bằng một giá trị có dấu cách mà không có nháy — chỉ cần một mật khẩu như <code>mat khau</code> là đủ:</p>
<pre><code>printf 'DB_URL=postgres://app:mat khau@localhost/app\\nPORT=3000\\n' &gt; .env
env \$(grep -v '^#' .env | xargs) sh -c 'echo "[\$DB_URL]"'
. ./.env; echo "exit=\$? DB_URL=[\$DB_URL]"</code></pre>
<div class="out">env: 'khau@localhost/app': No such file or directory
./.env: line 1: khau@localhost/app: No such file or directory
exit=127 DB_URL=[]</div>
<p>Cách <code>xargs</code> cắt giá trị ở dấu cách và đưa cho <code>env</code> một "lệnh" tên <code>khau@localhost/app</code>. <code>source</code> đọc dòng đó y như bash đọc: <code>DB_URL=postgres://app:mat</code> là một tiền tố cho-một-lệnh, rồi <code>khau@localhost/app</code> là cái lệnh — nên phép gán còn chẳng tới được shell của bạn. Bọc giá trị trong nháy (<code>DB_URL="postgres://app:mat khau@localhost/app"</code>) rồi <code>set -a; . ./.env; set +a</code> thì tiến trình con nhận trọn chuỗi; thiếu <code>set -a</code> thì shell của bạn có biến nhưng tiến trình con chẳng thấy gì, vì chúng chưa bao giờ được export.</p>
<pre><code><span class="tok-comment"># Và chỉ source những file tin được: .env được THỰC THI như mã shell</span>
echo 'rm -rf /tmp/important' &gt;&gt; .env
source .env          <span class="tok-comment"># dòng đó chạy thật</span></code></pre>
<p><code>source</code> KHÔNG phân tích các cặp khoá–giá trị; nó CHẠY cái file như một script bash. Một file <code>.env</code> đến từ một đồng nghiệp, từ một tệp phẩm CI hay từ một kho mã lạ chính là MÃ mà bạn sắp thực thi với danh nghĩa của mình. Với một file do chính bạn viết thì không sao; nhưng đó không phải cách an toàn để tiêu thụ một file không phải của bạn.</p>

<h3>Vì sao bí mật đặt trong môi trường thật ra không bí mật</h3>
${slide('lx-08', 20, 'Bí mật trong môi trường lộ ở 7 chỗ')}
<pre><code><span class="tok-comment"># Toàn bộ môi trường của một tiến trình, chủ của nó (và root) đọc được</span>
tr '\\0' '\\n' &lt; /proc/\$(pgrep -f 'node server.js')/environ | grep -i key</code></pre>
<div class="out">API_KEY=sk-live-4f9a2b7c1e8d
DATABASE_URL=postgres://user:hunter2@localhost/app</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Hiện ra trong <code>/proc</code></span><span class="v">Mọi tiến trình bạn sở hữu — và mọi tiến trình root sở hữu — đều đọc được môi trường của các tiến trình của bạn. Trên một máy dùng chung, đó là một mức phơi bày có thật.</span></div>
  <div class="kv"><span class="k">Tiến trình con thừa kế</span><span class="v">Mọi tiến trình con đều nhận một bản sao, kể cả những thứ bạn không nghĩ tới: một bộ báo cáo sự cố, một công cụ dựng, một script postinstall của gói nào đó.</span></div>
  <div class="kv"><span class="k">Hiện trong bản kết xuất sự cố và trong log</span><span class="v">Nhiều bộ báo lỗi đính kèm cả môi trường. Một vệt gọi hàm lỗi tải lên dịch vụ giám sát có thể mang theo trọn bộ.</span></div>
  <div class="kv"><span class="k">Rò qua <code>set -x</code></span><span class="v">Bài 7.4: việc lần theo in ra các giá trị ĐÃ khai triển, nên một token rơi thẳng vào journal hoặc vào một email của cron.</span></div>
</div>
<div class="callout">Đây không phải lý lẽ chống lại biến môi trường — chúng vẫn tốt hơn nhiều so với việc nhúng cứng một bí mật vào hệ quản lý mã nguồn, và chúng là thứ mà lối triển khai mười hai yếu tố giả định. Đây là lý lẽ cho việc BIẾT rõ mức phơi bày: <strong>biến môi trường được bảo vệ khỏi những NGƯỜI DÙNG khác, không được bảo vệ khỏi MÃ KHÁC ĐANG CHẠY VỚI DANH NGHĨA CỦA BẠN</strong>. Hãy chọn cho phù hợp.</div>

<div class="callout warn"><strong>Phiên bản dotfile của sai lầm này.</strong> <code>export OPENAI_API_KEY=sk-…</code> nằm trong <code>~/.bashrc</code> "vẫn chạy", nên nó nằm lì ở đó — rồi bộ dotfile được đưa lên một kho GitHub công khai cho tiện dùng chung giữa các máy. Cái khoá giờ nằm trong lịch sử git vĩnh viễn: xoá dòng đó ở commit sau KHÔNG gỡ được nó, và ai đã clone hay fork trong khoảng giữa vẫn giữ nó. Thứ tự sửa là cố định: <strong>XOAY KHOÁ TRƯỚC</strong>, rồi mới dọn lịch sử. Phòng thì rẻ: giữ bí mật trong một file riêng mà git không bao giờ thấy và chỉ bạn đọc được, rồi nạp nó từ file rc:
<pre><code>install -m 600 /dev/null ~/.secrets             <span class="tok-comment"># tạo ra đã là 600 ngay từ đầu</span>
echo 'export OPENAI_API_KEY=…' &gt;&gt; ~/.secrets
echo '[ -r ~/.secrets ] &amp;&amp; . ~/.secrets' &gt;&gt; ~/.bashrc
echo '.secrets' &gt;&gt; ~/dotfiles/.gitignore
git -C ~/dotfiles log -p | grep -n 'sk-'          <span class="tok-comment"># đã lỡ lộ chưa?</span></code></pre>
Biến đó vẫn được export cho mọi tiến trình bạn khởi động, kèm mọi mức phơi bày kể ở trên — cách này chỉ chữa phần <em>FILE</em>. Với mọi thứ chạy trên máy chủ, câu trả lời vẫn là một file 600 do dịch vụ đọc, không phải do shell của bạn.</div>

<h3>Bí mật nên đặt ở đâu, đại khái tốt nhất xếp trước</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Một trình quản lý bí mật</span><span class="lz-t">Vault, AWS/GCP Secrets Manager, SOPS + age</span><span class="lz-d">Lấy về lúc khởi động, xoay khoá được mà không cần deploy lại, việc truy cập được ghi lại. Câu trả lời đúng khi đã có nhiều hơn một người tham gia.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Một file có quyền siết chặt</span><span class="lz-t">/opt/app/.env, chmod 600, thuộc về người dùng của dịch vụ</span><span class="lz-d">Đọc một lần lúc khởi động. Không hiện trong /proc, tiến trình con không thừa kế, sống sót qua các lần deploy. Tốt cho một VPS đơn lẻ.</span></div>
  <div class="lz-step"><span class="lz-k">3 · EnvironmentFile của systemd</span><span class="lz-t">EnvironmentFile=/opt/app/.env trong unit</span><span class="lz-d">systemd đọc file với quyền root rồi chỉ trao giá trị cho đúng dịch vụ đó. Bản thân file vẫn giữ chế độ 600.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Biến môi trường</span><span class="lz-t">-e / Environment= / export</span><span class="lz-d">Chấp nhận được, và là mặc định của mười hai yếu tố — với điều kiện đã hiểu rõ mức phơi bày qua /proc ở trên.</span></div>
  <div class="lz-step"><span class="lz-k">Không bao giờ</span><span class="lz-t">commit vào git · trong ENV của Dockerfile · trên một dòng lệnh</span><span class="lz-d">Một dòng lệnh thì cả thế giới đọc được qua ps. Lịch sử git là vĩnh viễn. Một lớp ảnh giữ nguyên giá trị đó kể cả sau khi xoay khoá.</span></div>
</div>
<pre><code><span class="tok-comment"># Một dòng lệnh thì MỌI người dùng trên máy đều nhìn thấy</span>
mysql -u root -phunter2 mydb &amp;
ps aux | grep mysql</code></pre>
<div class="out">deploy  8123  mysql -u root -phunter2 mydb</div>
<p>Đó là lý do các trình khách cơ sở dữ liệu đọc một file cấu hình (<code>~/.my.cnf</code>, <code>~/.pgpass</code>) hoặc hỏi trực tiếp, và là lý do <code>curl</code> có <code>--netrc</code> cùng <code>-H @file</code>. Hễ một công cụ đưa ra một cách truyền thông tin xác thực mà <em>KHÔNG</em> phải qua tham số, cách đó tồn tại chính vì lý do này.</p>

<h3>Thiết lập thực tế cho một máy chủ</h3>
<pre><code><span class="tok-comment"># Cái file: thuộc về người dùng của dịch vụ, không ai khác đọc được</span>
sudo install -o appuser -g appuser -m 600 /dev/null /opt/app/.env
sudo -u appuser tee -a /opt/app/.env &gt;/dev/null &lt;&lt;'EOF'
DATABASE_URL=postgres://app:REDACTED@localhost:5432/app
API_KEY=REDACTED
EOF

<span class="tok-comment"># Unit đọc nó; ứng dụng không bao giờ thấy cái đường dẫn</span>
sudo tee /etc/systemd/system/myapp.service &gt;/dev/null &lt;&lt;'EOF'
[Service]
User=appuser
EnvironmentFile=/opt/app/.env
ExecStart=/usr/bin/node /opt/app/dist/index.js
EOF

sudo systemctl daemon-reload &amp;&amp; sudo systemctl restart myapp</code></pre>
<div class="callout ok">Có hai tính chất đáng để ý. File <code>.env</code> nằm <em>NGOÀI</em> thư mục triển khai, nên một lần deploy có rsync hoặc thay cả cây ứng dụng cũng không thể ghi đè hay xoá mất nó — cũng chính là lý lẽ đằng sau việc giữ env của production ở <code>/opt/&lt;app&gt;/.env</code> thay vì trong bản checkout của kho mã. Và <code>install -m 600</code> tạo file với đúng chế độ ngay từ đầu, thay vì tạo ra một file cả thế giới đọc được rồi mới đi sửa, thứ để lại một khoảng thời gian mà nó đã bị phơi ra.</div>

<h3>Kiểm xem một tiến trình đang chạy THẬT SỰ có gì</h3>
<pre><code>systemctl show myapp -p Environment
sudo tr '\\0' '\\n' &lt; /proc/\$(pgrep -f 'dist/index.js')/environ | sort
docker exec myapp env | sort
docker inspect myapp --format '{{range .Config.Env}}{{println .}}{{end}}'</code></pre>
<div class="out">NODE_ENV=production
PORT=3000
DATABASE_URL=postgres://app:...@localhost:5432/app</div>
<p>Khi một ứng dụng nói thiếu một biến, đừng ngồi suy luận xem file nào lẽ ra phải đặt nó — hãy NHÌN xem tiến trình thật sự nhận được gì. Bốn lệnh trên phủ một dịch vụ systemd, một tiến trình Linux bất kỳ, một container đang chạy và cấu hình của một container, và một trong số đó trả lời thẳng câu hỏi chỉ trong vài giây.</p>

<h3>Những biến đáng biết</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>HOME</code> · <code>USER</code> · <code>SHELL</code></span><span class="v">Được đặt lúc đăng nhập. Trong cron thì <code>HOME</code> có nhưng <code>USER</code> có thể không; trong container thì chúng thường vắng mặt hoàn toàn, và điều đó làm hỏng những công cụ giả định là có thư mục nhà.</span></div>
  <div class="kv"><span class="k"><code>LANG</code> · <code>LC_ALL</code></span><span class="v">Locale. Làm đổi cách sắp xếp (Bài 3.4), định dạng ngày tháng và cách công cụ diễn giải byte. <code>LC_ALL=C</code> ép hành vi theo đúng thứ tự byte, đoán trước được, trong script.</span></div>
  <div class="kv"><span class="k"><code>TZ</code></span><span class="v">Múi giờ cho tiến trình này. <code>TZ=UTC date</code> mà không đổi cả hệ thống. Container mặc định UTC, và đó là lý do dấu thời gian trong log khác với máy chủ.</span></div>
  <div class="kv"><span class="k"><code>TERM</code></span><span class="v">Loại terminal. Vắng mặt trong cron và trong nhiều container — và đó là lý do <code>clear</code>, <code>less</code> cùng output có màu cư xử kỳ quặc ở đó.</span></div>
  <div class="kv"><span class="k"><code>http_proxy</code> · <code>NO_PROXY</code></span><span class="v">Được curl, wget, apt và phần lớn môi trường chạy của các ngôn ngữ tôn trọng. Thứ đầu tiên cần kiểm khi việc tải về chạy được với bạn mà không chạy với một dịch vụ.</span></div>
  <div class="kv"><span class="k"><code>TMPDIR</code></span><span class="v">Chỗ <code>mktemp</code> và phần lớn công cụ đặt file tạm. Chuyển hướng nó là cách bạn giữ một bản dựng lớn ra khỏi một <code>/tmp</code> nhỏ.</span></div>
</div>


<h3>Bảng cờ: các lệnh đọc và ghi môi trường</h3>
<table>
<tr><th>Lệnh</th><th>Nghĩa</th><th>Ví dụ</th></tr>
<tr><td><code>export TÊN=v</code> · <code>export TÊN</code></td><td>đặt và export · export một biến đã có</td><td><code>export EDITOR=vim</code></td></tr>
<tr><td><code>export -n TÊN</code></td><td>thu hồi export, giữ giá trị</td><td><code>declare -p</code> đổi từ <code>-x</code> sang <code>--</code></td></tr>
<tr><td><code>export -p</code></td><td>liệt kê biến đã export dưới dạng dòng <code>declare -x</code></td><td><code>export -p | head</code></td></tr>
<tr><td><code>declare -p TÊN</code></td><td>xem một biến kèm cờ của nó</td><td><code>declare -x MAU="do"</code></td></tr>
<tr><td><code>unset TÊN</code></td><td>xoá hẳn biến</td><td><code>unset TOKEN</code></td></tr>
<tr><td><code>TÊN=v lệnh</code></td><td>đặt cho đúng một lệnh</td><td><code>LC_ALL=C sort f</code></td></tr>
<tr><td><code>env</code> · <code>printenv</code></td><td>in môi trường (chỉ biến đã export)</td><td><code>env | sort</code></td></tr>
<tr><td><code>printenv TÊN</code></td><td>in một biến; thiếu thì mã thoát 1</td><td><code>printenv HOME</code></td></tr>
<tr><td><code>env -u TÊN lệnh</code></td><td>chạy lệnh mà KHÔNG có TÊN</td><td><code>env -u DEBUG node app.js</code></td></tr>
<tr><td><code>env -i lệnh</code></td><td>chạy lệnh với môi trường rỗng</td><td><code>env -i PATH=/usr/bin:/bin sh -c …</code></td></tr>
<tr><td><code>set</code></td><td>mọi biến <em>VÀ</em> mọi hàm trong shell này</td><td><code>set | less</code></td></tr>
<tr><td><code>set -a</code> · <code>set +a</code></td><td>tự export mọi phép gán · tắt</td><td>bọc quanh <code>. ./.env</code></td></tr>
<tr><td><code>readonly TÊN</code></td><td>cấm sửa tiếp trong shell này</td><td><code>readonly APP_ENV=production</code></td></tr>
</table>
<div class="kv-grid">
  <div class="kv"><span class="k">env so với set</span><span class="v">Trong container Ubuntu ở trên, <code>env | wc -l</code> in 8 còn <code>set | wc -l</code> in 36 — phần chênh là mọi thứ shell biết mà không tiến trình con nào được thấy.</span></div>
  <div class="kv"><span class="k">Khi nào dùng tiền tố</span><span class="v">Ghi đè một lần và thử nghiệm: xong rồi không gì rò sang shell của bạn.</span></div>
  <div class="kv"><span class="k">Khi nào KHÔNG export</span><span class="v">Biến đếm vòng lặp, biến tạm, và trên hết là bí mật mà bạn không muốn mọi tiến trình con thừa kế.</span></div>
</div>

<h3>Chạy thử từng bước</h3>
<p>Shell Linux nào cũng được (container là ổn). Đoán từng dòng trước.</p>
<pre><code>X=1; bash -c 'echo "[\$X]"'
export X; bash -c 'echo "[\$X]"'
bash -c 'X=99'; echo "\$X"
env -u X bash -c 'echo "[\${X-unset}]"'
printenv X; printenv NOPE; echo \$?
sleep 60 &amp; P=\$!; export Y=late
tr '\\0' '\\n' &lt; /proc/\$P/environ | grep -E '^(X|Y)='
kill \$P</code></pre>
<div class="out">[]
[1]
1
[unset]
1
1
X=1</div>
<p>Dòng output cuối là cả bài gói trong một: <code>X</code> được export <em>TRƯỚC</em> khi <code>sleep</code> khởi động, nên bản sao của nó có <code>X</code>; <code>Y</code> được export sau, nên không có. <code>\${X-unset}</code> chỉ in chữ <code>unset</code> khi biến hoàn toàn không tồn tại — tiện để phân biệt "rỗng" với "không có".</p>

<h3>Trên macOS và WSL khác gì</h3>
<table>
<tr><th>Thứ</th><th>Ubuntu / WSL2</th><th>macOS (zsh 5.9)</th></tr>
<tr><td>Xem cờ của một biến</td><td><code>declare -p X</code></td><td><code>typeset -p X</code> → <code>typeset X=do</code> / <code>export X=do</code></td></tr>
<tr><td>Thu hồi export</td><td><code>export -n X</code></td><td><code>typeset +x X</code></td></tr>
<tr><td>Đọc môi trường của tiến trình khác</td><td><code>/proc/PID/environ</code></td><td>macOS không có <code>/proc</code></td></tr>
<tr><td><code>env -i</code>, <code>env -u</code>, <code>printenv</code>, <code>set -a</code></td><td>như trên</td><td>y hệt</td></tr>
<tr><td>Biến của Windows</td><td>WSL thêm <code>PATH</code> của Windows (xem 8.1); các biến Windows khác không được chép sang</td><td>—</td></tr>
</table>
<p>Các luật — chỉ chảy xuống, đóng băng lúc khởi động, <code>export</code> quyết định cái gì được thừa kế — giống nhau trên mọi hệ Unix, vì chúng đến từ cách <code>fork</code> và <code>exec</code> hoạt động, không đến từ bash.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> backend của nhóm đọc <code>DB_URL</code> từ một file <code>.env</code>. Chạy <code>npm run dev</code> thì được, nhưng script deploy — thứ làm <code>source .env</code> rồi khởi động app — lại kết nối với một mật khẩu bị cụt, và sau khi bạn sửa <code>.env</code> thì app đang chạy vẫn dùng giá trị cũ. Hãy tái hiện cả ba hiệu ứng trong <code>~/thu-linux/env</code> (shell Linux nào cũng được, hoặc một container).</p><ol>
<li>Viết một <code>.env</code> với <code>DB_URL=postgres://app:mat khau@localhost/app</code> (không nháy) và <code>PORT=3000</code>. Nạp nó bằng <code>. ./.env</code> và bằng cách <code>xargs</code>; ghi lại từng lỗi và <code>\$DB_URL</code> chứa gì sau đó.</li>
<li>Bọc giá trị trong nháy, chỉ nạp bằng <code>. ./.env</code>, rồi chạy <code>bash -c 'echo "[\$DB_URL] [\$PORT]"'</code>. Giải thích cặp ngoặc rỗng bằng <code>declare -p DB_URL</code>. Chữa bằng <code>set -a</code>.</li>
<li>Khởi động <code>sleep 300 &amp;</code> đóng vai "app", rồi đổi <code>PORT=4000</code> trong file và nạp lại. So <code>/proc/\$!/environ</code> với <code>printenv PORT</code>.</li>
<li>Làm cho file thành riêng tư theo cách đúng (<code>install -m 600</code>), và viết phép kiểm <code>ls -l</code> một dòng chứng minh điều đó.</li></ol>
<p><strong>Đạt khi:</strong> một shell con in trọn URL có dấu cách, "app" vẫn thấy <code>PORT=3000</code> trong khi shell của bạn thấy <code>4000</code>, và <code>ls -l .env</code> mở đầu bằng <code>-rw-------</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Environment variable (biến môi trường)</span><span class="v">Một cặp tên=giá trị được chép từ một tiến trình sang mọi chương trình nó khởi động.</span></div>
  <div class="kv"><span class="k">Shell variable (biến shell)</span><span class="v">Biến chỉ sống bên trong shell hiện tại; tiến trình con không bao giờ thấy.</span></div>
  <div class="kv"><span class="k">export (xuất ra môi trường)</span><span class="v">Cờ biến một biến shell thành biến môi trường (<code>declare -x</code>).</span></div>
  <div class="kv"><span class="k">Inherit (thừa kế)</span><span class="v">Việc tiến trình con làm với môi trường của cha lúc khởi động: lấy một bản sao, đóng băng từ đó.</span></div>
  <div class="kv"><span class="k">.env file (file .env)</span><span class="v">Một quy ước: các dòng <code>KHOÁ=giá trị</code> thuần mà một công cụ nào đó phải nạp — tự nó không vào đâu cả.</span></div>
  <div class="kv"><span class="k">allexport — <code>set -a</code> (tự export)</span><span class="v">Tuỳ chọn shell export mọi phép gán diễn ra trong lúc nó bật.</span></div>
  <div class="kv"><span class="k">Secret rotation (xoay khoá)</span><span class="v">Thay một thông tin xác thực đã lộ bằng cái mới để giá trị cũ hết tác dụng.</span></div>
  <div class="kv"><span class="k">/proc/PID/environ (môi trường lúc khởi động)</span><span class="v">Môi trường mà một tiến trình Linux đang chạy đã nhận lúc khởi động, ngăn bằng ký tự NUL.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Chỉ biến đã export mới tới được tiến trình con; <code>declare -p</code> in <code>-x</code> cho biến đã export, <code>--</code> cho biến chỉ-trong-shell.</li>
<li>Môi trường chỉ chảy xuống và đóng băng khi tiến trình khởi động — đổi biến của dịch vụ xong thì phải khởi động lại nó.</li>
<li><code>KHOÁ=giá trị lệnh</code>, <code>env -u</code> và <code>env -i</code> đổi môi trường cho một lệnh mà không đụng shell của bạn.</li>
<li><code>.env</code> do ứng dụng nạp, hoặc bằng <code>set -a; . ./.env; set +a</code> — đừng bao giờ bằng mẹo xargs; giá trị có dấu cách thì bọc nháy.</li>
<li><code>source</code> THỰC THI file như mã bash: chỉ source file bạn tin.</li>
<li>Bí mật rò qua <code>ps</code>, <code>/proc</code>, tiến trình con, lịch sử, dotfile trên git, lớp ảnh và <code>set -x</code> — lộ rồi thì xoay khoá trước tiên.</li>
</ul>

<a class="link-card" href="https://12factor.net/config" target="_blank" rel="noopener">
  <span class="lc-ico">📐</span>
  <span class="lc-body"><span class="lc-title">The Twelve-Factor App — Config</span><span class="lc-sub">Lý lẽ cho việc giữ cấu hình trong môi trường thay vì trong mã, và chỗ phân biệt cấu hình với mã đã làm cho cách đó hoạt động.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man7/environ.7.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">environ(7) — môi trường, và /proc/PID/environ</span><span class="lc-sub">Môi trường được lưu ra sao và ai đọc được nó. Trang làm cho mức phơi bày trở nên cụ thể thay vì chỉ là lý thuyết.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/building/secrets/" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">Docker — bí mật lúc dựng ảnh</span><span class="lc-sub">Vì sao <code>ARG</code> và <code>ENV</code> rò rỉ vào lịch sử ảnh, và phương án <code>--mount=type=secret</code> thì không.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man1/env.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">env(1) — chạy một chương trình trong môi trường đã sửa</span><span class="lc-sub">Mọi cờ của <code>env</code>: <code>-i</code>, <code>-u</code>, <code>-C</code>, <code>-S</code>, và vì sao nó là công cụ để thử "chương trình này nhìn thấy gì".</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: đưa cho được giá trị vào tiến trình</span><span class="lc-sub">Các tình huống chấm điểm: một biến đặt nhầm file, một <code>.env</code> có dấu cách trong giá trị làm vỡ cách dùng xargs, và một bí mật đọc được qua <code>ps</code>.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> nối thêm một biến vào file <code>.env</code> của production trong khi một lần deploy ĐANG chạy. Lần deploy đó đã nạp môi trường lúc nó khởi động, nên giá trị mới không nằm trong container đang chạy — nhưng cái file thì <em>CÓ</em> chứa nó, nên mọi phép kiểm bạn làm sau đó đều nói cấu hình là đúng trong khi ứng dụng cư xử như thể nó đang thiếu. Cách chữa là dựng lại container (<code>docker compose up -d --no-build &lt;dịch vụ&gt;</code> với env đã nạp) hoặc deploy lại. Hễ một thiết lập "rõ ràng là có mà chẳng có tác dụng gì", hãy kiểm xem tiến trình có được khởi động TRƯỚC khi giá trị đó tồn tại hay không.</div>
<p class="note-ct"><strong>Câu hỏi cần đặt ra luôn là "TIẾN TRÌNH NÀO, và nó đã thừa kế được gì".</strong> Một biến không được đặt lên một cái máy hay lên một người dùng — nó được đặt lên một TIẾN TRÌNH, được chép sang các tiến trình con lúc <code>fork</code>, và đóng băng từ khoảnh khắc đó (Bài 5.1). Lệnh <code>tr '\\0' '\\n' &lt; /proc/&lt;pid&gt;/environ</code> cho thấy sự thật với mọi tiến trình, và nó luôn thắng việc ngồi suy luận xem file nào lẽ ra đã được đọc.</p>
</div>
`,
    },
    /* ─────────────────────────── 8.4 ─────────────────────────── */
    {
      title: '8.4 — Customising the shell: aliases, functions, prompt, history|||8.4 — Tuỳ biến shell: bí danh, hàm, dấu nhắc, lịch sử',
      slug: 'lnx-8-4-tuy-bien-shell',
      type: 'LESSON',
      description: 'Bí danh với hàm khác nhau ở đâu và khi nào dùng cái nào, PS1 đọc thế nào, thiết lập lịch sử làm terminal đáng tin hơn, các shopt đáng bật, và gợi ý hoàn tất lệnh.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.4</span>
<h2>Customising the shell</h2>
<p class="lead">Everything in this lesson goes in <code>~/.bashrc</code>, below the interactive guard from Lesson 8.2. None of it affects scripts, none of it should contain a secret, and all of it is optional — but a few of these settings genuinely change how much you trust your own terminal, particularly the history ones.</p>

<h3>Aliases: a shorthand, not a function</h3>
${slide('lx-08', 21, 'Bí danh là phép thay chữ — cần tham số thì viết hàm')}
<pre><code>alias ll='ls -alF'
alias ..='cd ..'
alias gs='git status -sb'
alias grep='grep --color=auto'
alias df='df -h'
alias please='sudo'

alias                     <span class="tok-comment"># list every alias</span>
alias ll                  <span class="tok-comment"># show just this one</span>
unalias ll                <span class="tok-comment"># remove it</span>
\\ls                       <span class="tok-comment"># backslash bypasses the alias for one call</span>
command ls                <span class="tok-comment"># same idea, clearer</span></code></pre>
<div class="callout">An alias is pure text substitution at the <em>start</em> of a command, performed before anything else (Lesson 8.1). That is its entire mechanism, and it explains both limits: it cannot take arguments in the middle, and it does not exist in scripts, because aliases are disabled in non-interactive shells. If you find yourself wanting <code>\$1</code>, you want a function.</div>
<pre><code><span class="tok-comment"># Arguments only ever land at the END</span>
alias gc='git commit -m'
gc "fix the thing"              <span class="tok-comment"># works: git commit -m "fix the thing"</span>

alias mkcd='mkdir -p \$1 &amp;&amp; cd \$1'
mkcd newdir                     <span class="tok-comment"># BROKEN: \$1 is empty, newdir lands at the end</span></code></pre>
<div class="out">mkdir: missing operand</div>

<h3>Functions: when you need arguments or logic</h3>
<pre><code>mkcd() { mkdir -p -- "\$1" &amp;&amp; cd -- "\$1"; }

extract() {
  [[ -f \$1 ]] || { echo "no such file: \$1" &gt;&amp;2; return 1; }
  case \$1 in
    *.tar.gz|*.tgz) tar -xzf "\$1" ;;
    *.tar.xz)       tar -xJf "\$1" ;;
    *.tar.zst)      tar --zstd -xf "\$1" ;;
    *.zip)          unzip "\$1" ;;
    *.gz)           gunzip "\$1" ;;
    *) echo "unknown archive type: \$1" &gt;&amp;2; return 1 ;;
  esac
}

<span class="tok-comment"># Wrap a command, keeping every argument (Lesson 6.2)</span>
d() { docker "\$@"; }

<span class="tok-comment"># A git log worth having</span>
gl() { git log --oneline --graph --decorate -"\${1:-20}"; }</code></pre>
<div class="out">$ gl 5
* a1b2c3d (HEAD -> main) feat: add smoke test
* 9f8e7d6 fix: quote the path
* 4c5b6a7 docs: update README</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Use an alias</span><span class="v">Pure shorthand where arguments naturally go at the end. Two words, no logic.</span></div>
  <div class="kv"><span class="k">Use a function</span><span class="v">Anything with <code>\$1</code>, a conditional, a loop, or more than one command. Also anything you might want to reuse from a script — a function can be <code>source</code>d, an alias effectively cannot.</span></div>
</div>
<div class="callout warn">Be careful shadowing a real command. <code>alias rm='rm -i'</code> is a common safety habit, and it builds a dangerous reflex: you become used to being asked, so on a machine without the alias — a server, a container, a colleague's laptop — you delete without the prompt you expected. Prefer a <em>differently named</em> safety command (<code>alias rmi='rm -i'</code>), and keep the real name behaving the way it does everywhere else.</div>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Alias</span><span class="lz-t">text substitution at the start of a command</span><span class="lz-d">Two words, no arguments in the middle, invisible to scripts. <code>alias gs='git status'</code>.</span></div>
  <div class="lz-step"><span class="lz-k">Function</span><span class="lz-t">a real shell function with \$1 and logic</span><span class="lz-d">Anything with arguments, a conditional, or more than one command. Can be sourced by a script.</span></div>
  <div class="lz-step"><span class="lz-k">Script on PATH</span><span class="lz-t">a file in ~/.local/bin</span><span class="lz-d">Once it is longer than a few lines, or you want it available to cron and other users. Chapter 7's skeleton.</span></div>
  <div class="lz-step"><span class="lz-k">A real program</span><span class="lz-t">Python, Go, whatever fits</span><span class="lz-d">When it computes rather than coordinates (Lesson 7.5). The progression is one-way — things move down this list, rarely back up.</span></div>
</div>
<h3>The prompt</h3>
${slide('lx-08', 22, 'PS1: đọc từng ký hiệu — mã màu phải bọc \\[ \\]')}
<pre><code>PS1='\\u@\\h:\\w\\\$ '                     <span class="tok-comment"># user@host:path\$</span>
PS1='\\[\\e[32m\\]\\u@\\h\\[\\e[0m\\]:\\[\\e[34m\\]\\w\\[\\e[0m\\]\\\$ '   <span class="tok-comment"># with colour</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>\\u</code> <code>\\h</code> <code>\\H</code></span><span class="v">Username · short hostname · full hostname.</span></div>
  <div class="kv"><span class="k"><code>\\w</code> <code>\\W</code></span><span class="v">Full working directory (with <code>~</code>) · just the last component.</span></div>
  <div class="kv"><span class="k"><code>\\\$</code></span><span class="v"><code>#</code> when root, <code>\$</code> otherwise — the distinction from Lesson 1.1, built in.</span></div>
  <div class="kv"><span class="k"><code>\\t</code> <code>\\d</code></span><span class="v">Time · date. Surprisingly useful: your scrollback becomes a timeline of when each command ran.</span></div>
  <div class="kv"><span class="k"><code>\\[</code> … <code>\\]</code></span><span class="v">Wraps non-printing characters. <strong>Required</strong> around colour codes — see the trap below.</span></div>
</div>
<pre><code><span class="tok-comment"># Show the exit code of the last command, only when it failed</span>
PS1='\${?#0}\\u@\\h:\\w\\\$ '

<span class="tok-comment"># Make production hosts unmistakable</span>
case \$(hostname) in
  *prod*) PS1='\\[\\e[41;97m\\] PRODUCTION \\[\\e[0m\\] \\u@\\h:\\w\\\$ ' ;;
  *)      PS1='\\u@\\h:\\w\\\$ ' ;;
esac</code></pre>
<div class="callout ok">A red banner on production prompts is one of the cheapest operational safeguards there is. It does not prevent anything technically, but "am I on the right server" is a question people answer wrongly under time pressure, and a prompt that answers it without being asked costs three lines in a shared <code>/etc/profile.d/</code> file.</div>
<div class="callout warn"><strong>Colour codes must be wrapped in <code>\\[</code> and <code>\\]</code>.</strong> Those markers tell readline "these bytes take no screen width". Without them bash miscounts the prompt length, so long command lines wrap in the wrong place, the cursor lands on the wrong character, and Ctrl-R history search redraws over your text. It looks like a terminal bug and is a missing bracket.</div>

<h3>History: the settings that matter</h3>
${slide('lx-08', 23, 'Lịch sử: ghi ngay mỗi lệnh, và giữ bí mật ra ngoài')}
<pre><code><span class="tok-comment"># In ~/.bashrc</span>
HISTSIZE=100000                  <span class="tok-comment"># lines kept in memory</span>
HISTFILESIZE=200000              <span class="tok-comment"># lines kept in the file</span>
HISTCONTROL=ignoreboth:erasedups <span class="tok-comment"># skip dups and lines starting with a space</span>
HISTIGNORE='ls:ll:cd:pwd:exit:clear:history'
HISTTIMEFORMAT='%F %T '          <span class="tok-comment"># timestamp each entry</span>
shopt -s histappend              <span class="tok-comment"># APPEND on exit, do not overwrite</span>
PROMPT_COMMAND='history -a'      <span class="tok-comment"># write after every command</span></code></pre>
<div class="out">$ history 3
 4821  2026-08-22 15:41:02 docker compose up -d
 4822  2026-08-22 15:41:19 curl -s localhost:3000/health
 4823  2026-08-22 15:42:03 history 3</div>
<div class="callout ok">The last two lines are the important ones. By default bash writes history <em>only on clean exit</em> and <strong>overwrites</strong> the file — so several terminals open at once means the last one to close wins and the others' history is lost, and any terminal that crashes or is killed loses everything. <code>histappend</code> plus <code>history -a</code> makes each command durable the moment you run it. If you have ever thought "I definitely ran that command yesterday and it is not in my history", this is why.</div>
<pre><code>Ctrl-R                     <span class="tok-comment"># search backwards; Ctrl-R again for the next match</span>
Ctrl-G                     <span class="tok-comment"># cancel the search</span>
!!                         <span class="tok-comment"># the previous command — sudo !! is the classic</span>
!\$                         <span class="tok-comment"># last argument of the previous command</span>
Alt-.                      <span class="tok-comment"># same, but inserted so you can edit it</span>
!docker                    <span class="tok-comment"># most recent command starting with 'docker'</span>
history | grep rsync       <span class="tok-comment"># search without re-running anything</span></code></pre>
<pre><code><span class="tok-comment"># A space before a command keeps it out of history — for one-off secrets</span>
 export TOKEN=sk-live-secret        <span class="tok-comment"># note the leading space</span></code></pre>
<p>That works because of <code>ignorespace</code>, included in the <code>ignoreboth</code> setting above. It is a convenience, not a security control — the value is still in the process environment (Lesson 8.3) and visible in <code>/proc</code> — but it does keep a credential out of a file that gets backed up and read over your shoulder.</p>

<div class="callout warn"><strong>Whether a leading space protects you depends on the machine</strong> — checked on 28/09/2026. Ubuntu's default <code>~/.bashrc</code> sets <code>HISTCONTROL=ignoreboth</code>, so it does. Fedora 44 sets <code>HISTCONTROL=ignoredups</code> in <code>/etc/profile</code> (it only upgrades to <code>ignoreboth</code> if you already had <code>ignorespace</code>), so a leading space is <em>saved</em>. macOS zsh saves it too unless you <code>setopt HIST_IGNORE_SPACE</code>: in a scratch <code>ZDOTDIR</code>, the line <code>" echo co-dau-cach-TOKEN"</code> landed in the history file with default settings and was absent after the <code>setopt</code>. If a secret did get saved, <code>history -d N</code> removes entry N from memory and <code>history -w</code> rewrites the file — then rotate the secret anyway.</div>

<h3>shopt: options worth turning on</h3>
<pre><code>shopt -s globstar        <span class="tok-comment"># ** matches recursively (Lesson 2.2)</span>
shopt -s nullglob        <span class="tok-comment"># unmatched glob expands to nothing, not itself</span>
shopt -s extglob         <span class="tok-comment"># !(pattern), +(pattern), @(a|b)</span>
shopt -s checkwinsize    <span class="tok-comment"># update LINES/COLUMNS after each command</span>
shopt -s cdspell         <span class="tok-comment"># fix minor typos in cd arguments</span>
shopt -s autocd          <span class="tok-comment"># typing a directory name cds into it</span>
shopt -s cmdhist         <span class="tok-comment"># keep a multi-line command as ONE history entry</span>

shopt                    <span class="tok-comment"># show everything and its state</span>
shopt -p globstar        <span class="tok-comment"># print it in a form you can paste back</span></code></pre>
<div class="callout warn"><code>nullglob</code> is genuinely useful in scripts and mildly hazardous interactively: with it set, <code>ls *.nonexistent</code> becomes a bare <code>ls</code> and lists the whole directory rather than reporting nothing found. Set it inside scripts where you control the code (Lesson 2.2); think twice before making it a global interactive default.</div>

<h3>Completion</h3>
<pre><code><span class="tok-comment"># Usually already enabled by /etc/bash.bashrc; if not:</span>
if ! shopt -oq posix; then
  [[ -f /usr/share/bash-completion/bash_completion ]] &amp;&amp; . /usr/share/bash-completion/bash_completion
fi

sudo apt install bash-completion

<span class="tok-comment"># Many tools generate their own</span>
docker completion bash | sudo tee /etc/bash_completion.d/docker &gt;/dev/null
kubectl completion bash &gt; ~/.local/share/bash-completion/completions/kubectl</code></pre>
<div class="out">$ git che&lt;TAB&gt;
checkout    cherry      cherry-pick
$ git checkout ma&lt;TAB&gt;
main</div>
<p>Completion goes well beyond filenames: with the package installed, <code>git</code> completes branch names, <code>docker</code> completes container names, <code>systemctl</code> completes unit names, and <code>ssh</code> completes hosts from your config. That last one alone removes a class of typo from your day.</p>

<h3>Readline: the editing keys</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Ctrl-A · Ctrl-E</span><span class="v">Start of line · end of line.</span></div>
  <div class="kv"><span class="k">Ctrl-W · Alt-D</span><span class="v">Delete the word before · after the cursor.</span></div>
  <div class="kv"><span class="k">Ctrl-U · Ctrl-K</span><span class="v">Delete to start · to end. <code>Ctrl-U</code> is how you clear a half-typed command.</span></div>
  <div class="kv"><span class="k">Ctrl-Y</span><span class="v">Paste back whatever the last delete removed.</span></div>
  <div class="kv"><span class="k">Ctrl-L</span><span class="v">Clear the screen, keeping the current line.</span></div>
  <div class="kv"><span class="k">Ctrl-X Ctrl-E</span><span class="v">Open the current command line in <code>\$EDITOR</code>. Invaluable for a long pipeline.</span></div>
</div>
<pre><code><span class="tok-comment"># ~/.inputrc — readline settings, used by bash, psql, python and more</span>
set completion-ignore-case on
set show-all-if-ambiguous on
"\\e[A": history-search-backward        <span class="tok-comment"># Up arrow searches by prefix</span>
"\\e[B": history-search-forward</code></pre>
<div class="callout ok">Those last two lines are the single best terminal ergonomics change available. Type <code>doc</code>, press Up, and you cycle through only the commands that started with <code>doc</code> — instead of walking backwards through everything. It takes one file and applies to every readline program on the machine, not just bash.</div>

<h3>Keeping it manageable</h3>
${slide('lx-08', 24, 'Dotfile gọn gàng: mỗi thứ một chỗ')}
<pre><code><span class="tok-comment"># Split by topic, source what exists</span>
for f in ~/.bashrc.d/*.sh; do
  [[ -r \$f ]] &amp;&amp; . "\$f"
done
unset f</code></pre>
<div class="callout">Once <code>~/.bashrc</code> passes a couple of hundred lines, split it: <code>10-env.sh</code>, <code>20-aliases.sh</code>, <code>30-prompt.sh</code>, <code>40-work.sh</code>. It makes the whole thing versionable in git, and it means a machine-specific piece can simply be absent rather than wrapped in a conditional. Keep the files idempotent (Lesson 7.3) so re-sourcing is harmless — you will do it often while editing them.</div>


<h3>Flag table: history and its variables</h3>
<table>
<tr><th>Command / variable</th><th>Meaning</th><th>Example</th></tr>
<tr><td><code>history N</code></td><td>last N entries</td><td><code>history 20</code></td></tr>
<tr><td><code>history -d N</code></td><td>delete entry N from the in-memory list</td><td>after typing a password by mistake</td></tr>
<tr><td><code>history -c</code></td><td>clear the in-memory list</td><td>then <code>history -w</code> to empty the file too</td></tr>
<tr><td><code>history -a</code> · <code>-w</code></td><td>append new lines to the file · rewrite the whole file</td><td><code>PROMPT_COMMAND='history -a'</code></td></tr>
<tr><td><code>history -n</code> · <code>-r</code></td><td>read lines other sessions appended · re-read the whole file</td><td>share history between tabs</td></tr>
<tr><td><code>HISTCONTROL</code></td><td><code>ignorespace</code> · <code>ignoredups</code> · <code>ignoreboth</code> · <code>erasedups</code></td><td><code>HISTCONTROL=ignoreboth</code></td></tr>
<tr><td><code>HISTIGNORE</code></td><td>colon list of patterns never saved</td><td><code>'ls:cd:exit'</code></td></tr>
<tr><td><code>HISTSIZE</code> · <code>HISTFILESIZE</code></td><td>lines kept in memory · in the file</td><td><code>100000</code> · <code>200000</code></td></tr>
<tr><td><code>HISTTIMEFORMAT</code></td><td>strftime format; turns timestamps on</td><td><code>'%F %T '</code></td></tr>
<tr><td><code>HISTFILE</code></td><td>where history is written</td><td>point it at <code>/dev/null</code> for one throw-away session</td></tr>
</table>

<h3>Try it step by step</h3>
<p>Start a clean shell with <code>bash --norc</code> (no rc file, so nothing of yours interferes) and type these, predicting each result.</p>
<pre><code>mkdir -p /tmp/t84 &amp;&amp; cd /tmp/t84
printf 'alias ll="ls -l"\\nll /etc/hostname\\n' &gt; a.sh
bash a.sh
alias mkcd='mkdir -p \$1 &amp;&amp; cd \$1'
mkcd newdir
mkcd() { mkdir -p -- "\$1" &amp;&amp; cd -- "\$1"; }
unalias mkcd
mkcd() { mkdir -p -- "\$1" &amp;&amp; cd -- "\$1"; }
mkcd newdir &amp;&amp; pwd
PS1='\${?#0}\\\$ '
false
true</code></pre>
<div class="out">a.sh: line 2: ll: command not found
mkdir: missing operand
Try 'mkdir --help' for more information.
bash: syntax error near unexpected token &#96;('
/tmp/t84/newdir
$ false
1$ true
$</div>
<p>Three lessons in twelve lines. The script cannot see the alias. The alias cannot take <code>\$1</code>. And the one most people never expect: <strong>you cannot define a function while an alias of the same name exists</strong> — the alias is expanded inside the definition, bash sees <code>mkdir -p \$1 &amp;&amp; cd \$1() {</code>, and reports a syntax error. <code>unalias</code> first. Then the prompt shows the exit code only after a failure. The history half, with a pattern written as <code>sk-[l]ive</code> so the <code>grep</code> line does not match itself:</p>
<pre><code>HISTFILE=/tmp/h84 HISTCONTROL=ignorespace
 export TOKEN=sk-live-bimat
echo \${#TOKEN}
history -w; grep -c 'sk-[l]ive' /tmp/h84
HISTCONTROL=
 echo sk-live-lan-hai
history -w; grep 'sk-[l]ive' /tmp/h84</code></pre>
<div class="out">13
0
sk-live-lan-hai
 echo sk-live-lan-hai</div>
<p>The token is set (13 characters) but not in the file; with <code>HISTCONTROL</code> emptied, the same leading space no longer helps.</p>

<h3>On macOS and WSL</h3>
<table>
<tr><th>Thing</th><th>bash (Ubuntu / WSL2 / Fedora)</th><th>zsh (macOS default)</th></tr>
<tr><td>Where it goes</td><td><code>~/.bashrc</code></td><td><code>~/.zshrc</code></td></tr>
<tr><td>Prompt</td><td><code>PS1='\\u@\\h:\\w\\\$ '</code></td><td><code>PROMPT='%n@%m:%~%# '</code> — different escapes, and colour as <code>%F{green}…%f</code> (no <code>\\[ \\]</code> needed)</td></tr>
<tr><td>Skip lines starting with a space</td><td><code>HISTCONTROL=ignorespace</code></td><td><code>setopt HIST_IGNORE_SPACE</code></td></tr>
<tr><td>Write history immediately</td><td><code>shopt -s histappend</code> + <code>history -a</code></td><td><code>setopt INC_APPEND_HISTORY</code> (or <code>SHARE_HISTORY</code>)</td></tr>
<tr><td>Key bindings</td><td><code>~/.inputrc</code> (readline)</td><td><code>bindkey</code> in <code>~/.zshrc</code> — zsh does not use readline</td></tr>
<tr><td><code>which</code> on an alias</td><td>does not see it</td><td>shows it (builtin)</td></tr>
</table>
<p>WSL2 runs real bash, so everything in this lesson applies unchanged; only the terminal window around it is a Windows program. The zsh equivalents are here so you recognise them — Chapter 15 covers zsh properly.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> you are about to publish your dotfiles on GitHub so the whole SWP391 team can copy your setup, and you are sharing the group VPS login with them. Before you do, make sure the history keeps no secrets and the shell makes production unmistakable. Work in a container started with <code>docker run --rm -it --hostname prod-lab ubuntu:24.04 bash</code>.</p><ol>
<li>Create <code>~/.bashrc.d/</code> with <code>10-history.sh</code> (<code>HISTCONTROL=ignoreboth</code>, <code>histappend</code>, <code>PROMPT_COMMAND='history -a'</code>) and <code>20-prompt.sh</code> (the <code>case \$(hostname) in *prod*)</code> red banner from this lesson). Load them from <code>~/.bashrc</code> with the <code>for f in ~/.bashrc.d/*.sh</code> loop, then <code>exec bash</code>.</li>
<li>Type <code> export TOKEN=sk-test-123</code> (leading space) and one normal command. Prove with <code>grep -c 'sk-[t]est' ~/.bash_history</code> that the token line never reached the file, while <code>echo \${#TOKEN}</code> shows the variable exists.</li>
<li>Put the token in <code>~/.secrets</code> created with <code>install -m 600</code>, load it from <code>~/.bashrc</code> with <code>[ -r ~/.secrets ] &amp;&amp; . ~/.secrets</code>, and write a <code>.gitignore</code> that keeps it out of the repository.</li>
<li>Note the shell's PID with <code>echo \$\$</code>, then from a second terminal (<code>docker exec -it … bash</code>) run <code>kill -9 &lt;that PID&gt;</code>; open a new shell and check the last normal command is still in <code>history</code>.</li></ol>
<p><strong>Done when:</strong> the prompt shows the red <code>PRODUCTION</code> banner, the grep in step 2 prints <code>0</code>, <code>ls -l ~/.secrets</code> starts with <code>-rw-------</code>, and history survived the <code>kill -9</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Alias</span><span class="v">A word replaced by text at the start of a command, in interactive shells only.</span></div>
  <div class="kv"><span class="k">Function</span><span class="v">A named block of shell code that takes arguments (<code>\$1</code>, <code>\$@</code>).</span></div>
  <div class="kv"><span class="k">PS1</span><span class="v">The variable that defines the main prompt; <code>\\u</code>, <code>\\h</code>, <code>\\w</code>, <code>\\\$</code> are its escapes.</span></div>
  <div class="kv"><span class="k">Non-printing sequence <code>\\[ \\]</code></span><span class="v">Markers telling readline that colour codes take no width on screen.</span></div>
  <div class="kv"><span class="k">HISTCONTROL</span><span class="v">Controls which lines history skips: leading-space lines, duplicates, or both.</span></div>
  <div class="kv"><span class="k">histappend</span><span class="v">Append to the history file on exit instead of overwriting it.</span></div>
  <div class="kv"><span class="k">Readline / <code>~/.inputrc</code></span><span class="v">The line-editing library behind bash's keys, and its settings file.</span></div>
  <div class="kv"><span class="k">shopt</span><span class="v">The builtin that turns bash's optional behaviours on (<code>-s</code>) and off (<code>-u</code>).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Aliases are text substitution for interactive shells; anything with arguments or logic is a function, and you must <code>unalias</code> a name before defining a function with it.</li>
<li><code>PS1</code> escapes (<code>\\u \\h \\w \\\$</code>) build the prompt; colour codes must sit inside <code>\\[ \\]</code> or line editing breaks.</li>
<li><code>histappend</code> + <code>PROMPT_COMMAND='history -a'</code> make every command durable the moment it runs.</li>
<li>A leading space keeps a line out of history only with <code>ignorespace</code> — on by default on Ubuntu, off on Fedora and macOS zsh.</li>
<li>Keep secrets in a 600 file outside the dotfiles repository; the environment still exposes them to child processes.</li>
<li>Split a growing rc into <code>~/.bashrc.d/*.sh</code>, keep each piece idempotent, and reload with <code>source</code> or <code>exec bash -l</code>.</li>
</ul>

<a class="link-card" href="https://www.gnu.org/software/bash/manual/html_node/Controlling-the-Prompt.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Bash Manual — Controlling the Prompt</span><span class="lc-sub">Every <code>PS1</code> escape, and the explanation of why <code>\\[</code> and <code>\\]</code> exist. Short, and it fixes the wrapping problem for good.</span></span>
</a>
<a class="link-card" href="https://www.gnu.org/software/bash/manual/html_node/Bash-History-Facilities.html" target="_blank" rel="noopener">
  <span class="lc-ico">🕘</span>
  <span class="lc-body"><span class="lc-title">Bash Manual — History Facilities</span><span class="lc-sub">All the <code>HIST*</code> variables and the history-expansion syntax (<code>!!</code>, <code>!\$</code>, <code>^old^new</code>), stated precisely.</span></span>
</a>
<a class="link-card" href="https://tiswww.case.edu/php/chet/readline/rluserman.html" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Readline User Manual</span><span class="lc-sub">Every editing key and every <code>~/.inputrc</code> setting. Applies to bash, psql, python, gdb and anything else linked against readline.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: build a bashrc</span><span class="lc-sub">Graded tasks: convert a broken alias into a function, fix a prompt that wraps wrongly, and configure history so nothing is lost when a terminal is killed.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> putting anything that <em>prints</em> in <code>~/.bashrc</code> — a welcome message, <code>neofetch</code>, a fortune, a "you have N updates" line. Interactive logins look fine, and then <code>scp</code>, <code>rsync</code> and <code>git push</code> over SSH start failing with protocol errors, because those tools expect the stream to contain only their own data (Lesson 8.2). The interactive guard at the top of the file is what protects you, so anything that prints must go <em>below</em> it — and ideally in <code>~/.profile</code>, which non-interactive sessions never read at all.</div>
<p class="note-ct"><strong>If you adopt only three things from this lesson:</strong> <code>shopt -s histappend</code> with <code>PROMPT_COMMAND='history -a'</code>, so history survives a killed terminal and multiple sessions; the two <code>history-search-backward</code> lines in <code>~/.inputrc</code>, so Up arrow filters by what you have already typed; and a coloured or banner prompt on any production host. The first two you will notice within a day, and the third the one time it matters.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.4</span>
<h2>Tuỳ biến shell</h2>
<p class="lead">Mọi thứ trong bài này đều đi vào <code>~/.bashrc</code>, nằm DƯỚI cái chốt tương tác ở Bài 8.2. Không thứ nào ảnh hưởng tới script, không thứ nào nên chứa bí mật, và tất cả đều là tuỳ chọn — nhưng vài thiết lập trong đó thật sự làm đổi mức độ bạn tin được cái terminal của mình, nhất là mấy thiết lập về lịch sử.</p>

<h3>Bí danh: một lối viết tắt, không phải một hàm</h3>
${slide('lx-08', 21, 'Bí danh là phép thay chữ — cần tham số thì viết hàm')}
<pre><code>alias ll='ls -alF'
alias ..='cd ..'
alias gs='git status -sb'
alias grep='grep --color=auto'
alias df='df -h'
alias please='sudo'

alias                     <span class="tok-comment"># liệt kê mọi bí danh</span>
alias ll                  <span class="tok-comment"># chỉ hiện cái này</span>
unalias ll                <span class="tok-comment"># gỡ nó đi</span>
\\ls                       <span class="tok-comment"># gạch chéo ngược bỏ qua bí danh cho đúng một lần gọi</span>
command ls                <span class="tok-comment"># cùng ý tưởng, rõ hơn</span></code></pre>
<div class="callout">Một bí danh là phép thay thế văn bản thuần tuý ở <em>ĐẦU</em> một lệnh, thực hiện trước mọi thứ khác (Bài 8.1). Đó là toàn bộ cơ chế của nó, và nó giải thích cả hai giới hạn: nó không nhận được tham số ở giữa, và nó không tồn tại trong script, vì bí danh bị tắt trong shell không tương tác. Nếu bạn thấy mình muốn có <code>\$1</code>, thứ bạn muốn là một HÀM.</div>
<pre><code><span class="tok-comment"># Tham số luôn luôn chỉ rơi vào CUỐI</span>
alias gc='git commit -m'
gc "sửa cái đó"                 <span class="tok-comment"># chạy được: git commit -m "sửa cái đó"</span>

alias mkcd='mkdir -p \$1 &amp;&amp; cd \$1'
mkcd newdir                     <span class="tok-comment"># HỎNG: \$1 rỗng, newdir rơi xuống cuối</span></code></pre>
<div class="out">mkdir: missing operand</div>

<h3>Hàm: khi bạn cần tham số hoặc cần logic</h3>
<pre><code>mkcd() { mkdir -p -- "\$1" &amp;&amp; cd -- "\$1"; }

extract() {
  [[ -f \$1 ]] || { echo "không có file: \$1" &gt;&amp;2; return 1; }
  case \$1 in
    *.tar.gz|*.tgz) tar -xzf "\$1" ;;
    *.tar.xz)       tar -xJf "\$1" ;;
    *.tar.zst)      tar --zstd -xf "\$1" ;;
    *.zip)          unzip "\$1" ;;
    *.gz)           gunzip "\$1" ;;
    *) echo "không rõ loại kho nén: \$1" &gt;&amp;2; return 1 ;;
  esac
}

<span class="tok-comment"># Bọc một lệnh, giữ nguyên mọi tham số (Bài 6.2)</span>
d() { docker "\$@"; }

<span class="tok-comment"># Một lệnh git log đáng có</span>
gl() { git log --oneline --graph --decorate -"\${1:-20}"; }</code></pre>
<div class="out">$ gl 5
* a1b2c3d (HEAD -> main) feat: add smoke test
* 9f8e7d6 fix: quote the path
* 4c5b6a7 docs: update README</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Dùng bí danh</span><span class="v">Lối viết tắt thuần tuý, nơi tham số tự nhiên rơi vào cuối. Hai chữ, không logic.</span></div>
  <div class="kv"><span class="k">Dùng hàm</span><span class="v">Mọi thứ có <code>\$1</code>, có điều kiện, có vòng lặp, hay có nhiều hơn một lệnh. Cũng dùng cho mọi thứ bạn có thể muốn dùng lại từ một script — một hàm thì <code>source</code> được, còn bí danh thì về cơ bản là không.</span></div>
</div>
<div class="callout warn">Hãy cẩn thận khi che khuất một lệnh thật. <code>alias rm='rm -i'</code> là thói quen an toàn thường gặp, và nó xây nên một phản xạ nguy hiểm: bạn quen với việc ĐƯỢC HỎI, nên trên một cái máy không có bí danh đó — một máy chủ, một container, laptop của đồng nghiệp — bạn xoá mà không có lời hỏi mà bạn đang chờ đợi. Hãy ưu tiên một lệnh an toàn mang <em>TÊN KHÁC</em> (<code>alias rmi='rm -i'</code>), và để cái tên thật cư xử đúng như nó vẫn cư xử ở mọi nơi khác.</div>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Bí danh</span><span class="lz-t">thay thế văn bản ở đầu một lệnh</span><span class="lz-d">Hai chữ, không nhận tham số ở giữa, vô hình với script. <code>alias gs='git status'</code>.</span></div>
  <div class="lz-step"><span class="lz-k">Hàm</span><span class="lz-t">một hàm shell thật sự, có \$1 và có logic</span><span class="lz-d">Mọi thứ có tham số, có điều kiện, hoặc có nhiều hơn một lệnh. Một script source lại được nó.</span></div>
  <div class="lz-step"><span class="lz-k">Script nằm trên PATH</span><span class="lz-t">một file trong ~/.local/bin</span><span class="lz-d">Khi nó dài hơn dăm dòng, hoặc khi bạn muốn cron và người khác dùng được. Chính là bộ khung ở Chương 7.</span></div>
  <div class="lz-step"><span class="lz-k">Một chương trình thật</span><span class="lz-t">Python, Go, thứ nào hợp thì dùng</span><span class="lz-d">Khi nó TÍNH TOÁN thay vì ĐIỀU PHỐI (Bài 7.5). Bước tiến này một chiều — mọi thứ đi xuống danh sách này, hiếm khi quay ngược lên.</span></div>
</div>
<h3>Dấu nhắc</h3>
${slide('lx-08', 22, 'PS1: đọc từng ký hiệu — mã màu phải bọc \\[ \\]')}
<pre><code>PS1='\\u@\\h:\\w\\\$ '                     <span class="tok-comment"># người dùng@máy:đường dẫn\$</span>
PS1='\\[\\e[32m\\]\\u@\\h\\[\\e[0m\\]:\\[\\e[34m\\]\\w\\[\\e[0m\\]\\\$ '   <span class="tok-comment"># có màu</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>\\u</code> <code>\\h</code> <code>\\H</code></span><span class="v">Tên người dùng · tên máy ngắn · tên máy đầy đủ.</span></div>
  <div class="kv"><span class="k"><code>\\w</code> <code>\\W</code></span><span class="v">Thư mục làm việc đầy đủ (có <code>~</code>) · chỉ phần cuối cùng.</span></div>
  <div class="kv"><span class="k"><code>\\\$</code></span><span class="v">Dấu <code>#</code> khi là root, còn lại là <code>\$</code> — chính chỗ phân biệt ở Bài 1.1, được dựng sẵn.</span></div>
  <div class="kv"><span class="k"><code>\\t</code> <code>\\d</code></span><span class="v">Giờ · ngày. Hữu ích một cách bất ngờ: phần đã cuộn qua của bạn trở thành một dòng thời gian ghi lại lúc nào chạy lệnh nào.</span></div>
  <div class="kv"><span class="k"><code>\\[</code> … <code>\\]</code></span><span class="v">Bọc quanh những ký tự không in ra. <strong>BẮT BUỘC</strong> phải có quanh mã màu — xem cái bẫy bên dưới.</span></div>
</div>
<pre><code><span class="tok-comment"># Hiện mã thoát của lệnh vừa rồi, chỉ khi nó hỏng</span>
PS1='\${?#0}\\u@\\h:\\w\\\$ '

<span class="tok-comment"># Làm cho máy production không thể nhầm lẫn được</span>
case \$(hostname) in
  *prod*) PS1='\\[\\e[41;97m\\] PRODUCTION \\[\\e[0m\\] \\u@\\h:\\w\\\$ ' ;;
  *)      PS1='\\u@\\h:\\w\\\$ ' ;;
esac</code></pre>
<div class="callout ok">Một dải băng đỏ trên dấu nhắc của máy production là một trong những lớp bảo vệ vận hành rẻ nhất từng có. Về mặt kỹ thuật nó chẳng ngăn được gì, nhưng "mình đang ở đúng máy chủ chưa" là câu hỏi mà người ta trả lời SAI khi bị áp lực thời gian, và một dấu nhắc trả lời câu đó mà chẳng cần ai hỏi thì tốn ba dòng trong một file dùng chung ở <code>/etc/profile.d/</code>.</div>
<div class="callout warn"><strong>Mã màu BẮT BUỘC phải bọc trong <code>\\[</code> và <code>\\]</code>.</strong> Hai dấu đó nói với readline rằng "mấy byte này không chiếm chiều rộng màn hình nào". Thiếu chúng thì bash đếm sai độ dài dấu nhắc, nên dòng lệnh dài bẻ dòng sai chỗ, con trỏ nhảy vào nhầm ký tự, và phép tìm lịch sử Ctrl-R vẽ đè lên chữ của bạn. Nó TRÔNG như một lỗi của terminal mà thật ra là thiếu một cặp ngoặc.</div>

<h3>Lịch sử: những thiết lập có ý nghĩa</h3>
${slide('lx-08', 23, 'Lịch sử: ghi ngay mỗi lệnh, và giữ bí mật ra ngoài')}
<pre><code><span class="tok-comment"># Trong ~/.bashrc</span>
HISTSIZE=100000                  <span class="tok-comment"># số dòng giữ trong bộ nhớ</span>
HISTFILESIZE=200000              <span class="tok-comment"># số dòng giữ trong file</span>
HISTCONTROL=ignoreboth:erasedups <span class="tok-comment"># bỏ dòng trùng và dòng bắt đầu bằng dấu cách</span>
HISTIGNORE='ls:ll:cd:pwd:exit:clear:history'
HISTTIMEFORMAT='%F %T '          <span class="tok-comment"># gắn dấu thời gian cho từng mục</span>
shopt -s histappend              <span class="tok-comment"># NỐI THÊM lúc thoát, không ghi đè</span>
PROMPT_COMMAND='history -a'      <span class="tok-comment"># ghi ra sau MỖI lệnh</span></code></pre>
<div class="out">$ history 3
 4821  2026-08-22 15:41:02 docker compose up -d
 4822  2026-08-22 15:41:19 curl -s localhost:3000/health
 4823  2026-08-22 15:42:03 history 3</div>
<div class="callout ok">Hai dòng cuối mới là hai dòng quan trọng. Mặc định, bash ghi lịch sử <em>CHỈ KHI THOÁT SẠCH SẼ</em> và <strong>GHI ĐÈ</strong> lên file — nên mở vài terminal cùng lúc nghĩa là cái đóng sau cùng thắng còn lịch sử của những cái kia mất trắng, và bất kỳ terminal nào sập hoặc bị giết đều mất sạch. <code>histappend</code> cộng với <code>history -a</code> làm mỗi lệnh bền vững ngay khoảnh khắc bạn chạy nó. Nếu có lúc nào bạn nghĩ "rõ ràng hôm qua mình đã chạy lệnh đó mà giờ không thấy trong lịch sử", lý do là đây.</div>
<pre><code>Ctrl-R                     <span class="tok-comment"># tìm ngược; nhấn Ctrl-R lần nữa để tới kết quả kế</span>
Ctrl-G                     <span class="tok-comment"># huỷ phép tìm</span>
!!                         <span class="tok-comment"># lệnh trước đó — sudo !! là kinh điển</span>
!\$                         <span class="tok-comment"># tham số cuối của lệnh trước đó</span>
Alt-.                      <span class="tok-comment"># y hệt, nhưng chèn ra để bạn sửa được</span>
!docker                    <span class="tok-comment"># lệnh gần nhất bắt đầu bằng 'docker'</span>
history | grep rsync       <span class="tok-comment"># tìm mà không chạy lại gì cả</span></code></pre>
<pre><code><span class="tok-comment"># Một dấu cách đứng trước lệnh giữ nó ra khỏi lịch sử — cho bí mật dùng một lần</span>
 export TOKEN=sk-live-secret        <span class="tok-comment"># để ý dấu cách đứng đầu</span></code></pre>
<p>Nó chạy được nhờ <code>ignorespace</code>, vốn nằm trong thiết lập <code>ignoreboth</code> ở trên. Đó là một tiện nghi, không phải một biện pháp an ninh — giá trị đó vẫn nằm trong môi trường tiến trình (Bài 8.3) và vẫn nhìn thấy được trong <code>/proc</code> — nhưng nó giữ được một thông tin xác thực ra khỏi một file vốn hay được sao lưu và bị người ngồi sau lưng đọc thấy.</p>

<div class="callout warn"><strong>Dấu cách đầu dòng có bảo vệ bạn hay không là TUỲ MÁY</strong> — kiểm ngày 28/09/2026. <code>~/.bashrc</code> mặc định của Ubuntu đặt <code>HISTCONTROL=ignoreboth</code>, nên có. Fedora 44 đặt <code>HISTCONTROL=ignoredups</code> trong <code>/etc/profile</code> (chỉ nâng lên <code>ignoreboth</code> nếu bạn vốn đã có <code>ignorespace</code>), nên dòng có dấu cách đầu VẪN ĐƯỢC LƯU. zsh trên macOS cũng lưu, trừ khi bạn <code>setopt HIST_IGNORE_SPACE</code>: trong một <code>ZDOTDIR</code> nháp, dòng <code>" echo co-dau-cach-TOKEN"</code> nằm trong file lịch sử với thiết lập mặc định và biến mất sau khi <code>setopt</code>. Nếu bí mật lỡ bị lưu, <code>history -d N</code> gỡ mục N khỏi bộ nhớ và <code>history -w</code> ghi lại file — rồi dù sao cũng xoay bí mật đó.</div>

<h3>shopt: những tuỳ chọn đáng bật</h3>
<pre><code>shopt -s globstar        <span class="tok-comment"># ** khớp đệ quy (Bài 2.2)</span>
shopt -s nullglob        <span class="tok-comment"># glob không khớp thì thành rỗng, không thành chính nó</span>
shopt -s extglob         <span class="tok-comment"># !(mẫu), +(mẫu), @(a|b)</span>
shopt -s checkwinsize    <span class="tok-comment"># cập nhật LINES/COLUMNS sau mỗi lệnh</span>
shopt -s cdspell         <span class="tok-comment"># sửa lỗi gõ nhẹ trong tham số của cd</span>
shopt -s autocd          <span class="tok-comment"># gõ tên một thư mục là cd luôn vào đó</span>
shopt -s cmdhist         <span class="tok-comment"># giữ một lệnh nhiều dòng thành MỘT mục lịch sử</span>

shopt                    <span class="tok-comment"># xem tất cả và trạng thái của chúng</span>
shopt -p globstar        <span class="tok-comment"># in ra ở dạng dán lại được</span></code></pre>
<div class="callout warn"><code>nullglob</code> thật sự hữu ích trong script và hơi nguy khi gõ tay: khi bật nó, <code>ls *.khongtontai</code> trở thành một lệnh <code>ls</code> trần và liệt kê cả thư mục thay vì báo là không tìm thấy gì. Hãy bật nó BÊN TRONG script nơi bạn kiểm soát được mã (Bài 2.2); còn hãy nghĩ hai lần trước khi lấy nó làm mặc định toàn cục cho lúc gõ tay.</div>

<h3>Gợi ý hoàn tất lệnh</h3>
<pre><code><span class="tok-comment"># Thường đã được /etc/bash.bashrc bật sẵn; nếu chưa:</span>
if ! shopt -oq posix; then
  [[ -f /usr/share/bash-completion/bash_completion ]] &amp;&amp; . /usr/share/bash-completion/bash_completion
fi

sudo apt install bash-completion

<span class="tok-comment"># Nhiều công cụ tự sinh ra phần gợi ý của chúng</span>
docker completion bash | sudo tee /etc/bash_completion.d/docker &gt;/dev/null
kubectl completion bash &gt; ~/.local/share/bash-completion/completions/kubectl</code></pre>
<div class="out">$ git che&lt;TAB&gt;
checkout    cherry      cherry-pick
$ git checkout ma&lt;TAB&gt;
main</div>
<p>Gợi ý hoàn tất đi xa hơn tên file rất nhiều: khi đã cài gói, <code>git</code> gợi ý tên nhánh, <code>docker</code> gợi ý tên container, <code>systemctl</code> gợi ý tên unit, và <code>ssh</code> gợi ý các máy lấy từ file cấu hình của bạn. Riêng cái cuối đã gỡ được cả một loại lỗi gõ sai khỏi ngày làm việc của bạn.</p>

<h3>Readline: các phím soạn thảo</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Ctrl-A · Ctrl-E</span><span class="v">Về đầu dòng · về cuối dòng.</span></div>
  <div class="kv"><span class="k">Ctrl-W · Alt-D</span><span class="v">Xoá từ đứng trước · đứng sau con trỏ.</span></div>
  <div class="kv"><span class="k">Ctrl-U · Ctrl-K</span><span class="v">Xoá về đầu · về cuối. <code>Ctrl-U</code> là cách bạn xoá sạch một lệnh gõ dở.</span></div>
  <div class="kv"><span class="k">Ctrl-Y</span><span class="v">Dán lại thứ mà lần xoá vừa rồi đã gỡ đi.</span></div>
  <div class="kv"><span class="k">Ctrl-L</span><span class="v">Xoá màn hình, giữ nguyên dòng đang gõ.</span></div>
  <div class="kv"><span class="k">Ctrl-X Ctrl-E</span><span class="v">Mở dòng lệnh hiện tại trong <code>\$EDITOR</code>. Vô giá với một chuỗi ống dài.</span></div>
</div>
<pre><code><span class="tok-comment"># ~/.inputrc — thiết lập của readline, dùng bởi bash, psql, python và nhiều thứ khác</span>
set completion-ignore-case on
set show-all-if-ambiguous on
"\\e[A": history-search-backward        <span class="tok-comment"># Mũi tên lên tìm theo tiền tố</span>
"\\e[B": history-search-forward</code></pre>
<div class="callout ok">Hai dòng cuối đó là thay đổi công thái học terminal tốt nhất mà bạn có được. Gõ <code>doc</code>, nhấn phím Lên, và bạn chỉ đi qua những lệnh từng bắt đầu bằng <code>doc</code> — thay vì lùi ngược qua mọi thứ. Nó chỉ tốn một file và áp dụng cho MỌI chương trình dùng readline trên máy, không chỉ bash.</div>

<h3>Giữ cho nó còn quản được</h3>
${slide('lx-08', 24, 'Dotfile gọn gàng: mỗi thứ một chỗ')}
<pre><code><span class="tok-comment"># Chia theo chủ đề, source những cái có tồn tại</span>
for f in ~/.bashrc.d/*.sh; do
  [[ -r \$f ]] &amp;&amp; . "\$f"
done
unset f</code></pre>
<div class="callout">Khi <code>~/.bashrc</code> vượt vài trăm dòng, hãy chia nó ra: <code>10-env.sh</code>, <code>20-aliases.sh</code>, <code>30-prompt.sh</code>, <code>40-work.sh</code>. Nó làm cả bộ quản lý được bằng git, và nghĩa là một mảnh chỉ dành cho một máy cụ thể có thể đơn giản là VẮNG MẶT thay vì phải bọc trong một câu điều kiện. Hãy giữ các file bền vững khi chạy lại (Bài 7.3) để việc source lại là vô hại — bạn sẽ làm việc đó luôn tay trong lúc sửa chúng.</div>


<h3>Bảng cờ: history và các biến của nó</h3>
<table>
<tr><th>Lệnh / biến</th><th>Nghĩa</th><th>Ví dụ</th></tr>
<tr><td><code>history N</code></td><td>N mục gần nhất</td><td><code>history 20</code></td></tr>
<tr><td><code>history -d N</code></td><td>xoá mục N khỏi danh sách trong bộ nhớ</td><td>sau khi lỡ gõ mật khẩu vào dòng lệnh</td></tr>
<tr><td><code>history -c</code></td><td>xoá sạch danh sách trong bộ nhớ</td><td>rồi <code>history -w</code> để làm rỗng cả file</td></tr>
<tr><td><code>history -a</code> · <code>-w</code></td><td>nối các dòng mới vào file · ghi lại toàn bộ file</td><td><code>PROMPT_COMMAND='history -a'</code></td></tr>
<tr><td><code>history -n</code> · <code>-r</code></td><td>đọc các dòng mà phiên khác đã nối vào · đọc lại cả file</td><td>dùng chung lịch sử giữa các tab</td></tr>
<tr><td><code>HISTCONTROL</code></td><td><code>ignorespace</code> · <code>ignoredups</code> · <code>ignoreboth</code> · <code>erasedups</code></td><td><code>HISTCONTROL=ignoreboth</code></td></tr>
<tr><td><code>HISTIGNORE</code></td><td>danh sách mẫu (ngăn bằng dấu hai chấm) không bao giờ lưu</td><td><code>'ls:cd:exit'</code></td></tr>
<tr><td><code>HISTSIZE</code> · <code>HISTFILESIZE</code></td><td>số dòng giữ trong bộ nhớ · trong file</td><td><code>100000</code> · <code>200000</code></td></tr>
<tr><td><code>HISTTIMEFORMAT</code></td><td>định dạng strftime; bật dấu thời gian</td><td><code>'%F %T '</code></td></tr>
<tr><td><code>HISTFILE</code></td><td>chỗ lịch sử được ghi ra</td><td>trỏ nó vào <code>/dev/null</code> cho một phiên dùng-rồi-bỏ</td></tr>
</table>

<h3>Chạy thử từng bước</h3>
<p>Mở một shell sạch bằng <code>bash --norc</code> (không file rc, nên không thứ gì của bạn chen vào) rồi gõ lần lượt, đoán trước từng kết quả.</p>
<pre><code>mkdir -p /tmp/t84 &amp;&amp; cd /tmp/t84
printf 'alias ll="ls -l"\\nll /etc/hostname\\n' &gt; a.sh
bash a.sh
alias mkcd='mkdir -p \$1 &amp;&amp; cd \$1'
mkcd newdir
mkcd() { mkdir -p -- "\$1" &amp;&amp; cd -- "\$1"; }
unalias mkcd
mkcd() { mkdir -p -- "\$1" &amp;&amp; cd -- "\$1"; }
mkcd newdir &amp;&amp; pwd
PS1='\${?#0}\\\$ '
false
true</code></pre>
<div class="out">a.sh: line 2: ll: command not found
mkdir: missing operand
Try 'mkdir --help' for more information.
bash: syntax error near unexpected token &#96;('
/tmp/t84/newdir
$ false
1$ true
$</div>
<p>Ba bài học trong mười hai dòng. Script không thấy bí danh. Bí danh không nhận được <code>\$1</code>. Và cái ít ai ngờ nhất: <strong>bạn KHÔNG định nghĩa được một hàm khi đang có bí danh cùng tên</strong> — bí danh bị khai triển ngay trong lời định nghĩa, bash thấy <code>mkdir -p \$1 &amp;&amp; cd \$1() {</code> và báo lỗi cú pháp. Phải <code>unalias</code> trước. Rồi dấu nhắc chỉ hiện mã thoát sau một lần hỏng. Nửa về lịch sử, với mẫu viết là <code>sk-[l]ive</code> để dòng <code>grep</code> không tự khớp chính nó:</p>
<pre><code>HISTFILE=/tmp/h84 HISTCONTROL=ignorespace
 export TOKEN=sk-live-bimat
echo \${#TOKEN}
history -w; grep -c 'sk-[l]ive' /tmp/h84
HISTCONTROL=
 echo sk-live-lan-hai
history -w; grep 'sk-[l]ive' /tmp/h84</code></pre>
<div class="out">13
0
sk-live-lan-hai
 echo sk-live-lan-hai</div>
<p>Token đã được đặt (13 ký tự) nhưng không có trong file; khi làm rỗng <code>HISTCONTROL</code>, cũng dấu cách đầu đó chẳng còn giúp gì.</p>

<h3>Trên macOS và WSL khác gì</h3>
<table>
<tr><th>Thứ</th><th>bash (Ubuntu / WSL2 / Fedora)</th><th>zsh (mặc định trên macOS)</th></tr>
<tr><td>Đặt ở đâu</td><td><code>~/.bashrc</code></td><td><code>~/.zshrc</code></td></tr>
<tr><td>Dấu nhắc</td><td><code>PS1='\\u@\\h:\\w\\\$ '</code></td><td><code>PROMPT='%n@%m:%~%# '</code> — ký hiệu khác, và màu viết <code>%F{green}…%f</code> (không cần <code>\\[ \\]</code>)</td></tr>
<tr><td>Bỏ qua dòng có dấu cách đầu</td><td><code>HISTCONTROL=ignorespace</code></td><td><code>setopt HIST_IGNORE_SPACE</code></td></tr>
<tr><td>Ghi lịch sử ngay</td><td><code>shopt -s histappend</code> + <code>history -a</code></td><td><code>setopt INC_APPEND_HISTORY</code> (hoặc <code>SHARE_HISTORY</code>)</td></tr>
<tr><td>Gán phím</td><td><code>~/.inputrc</code> (readline)</td><td><code>bindkey</code> trong <code>~/.zshrc</code> — zsh không dùng readline</td></tr>
<tr><td><code>which</code> gặp một bí danh</td><td>không thấy</td><td>có thấy (lệnh dựng sẵn)</td></tr>
</table>
<p>WSL2 chạy bash thật, nên mọi thứ trong bài áp dụng nguyên xi; chỉ có cửa sổ terminal bao quanh nó là một chương trình Windows. Các dạng tương đương của zsh để ở đây cho bạn nhận ra chúng — Chương 15 dạy zsh đầy đủ.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bạn sắp đưa bộ dotfile lên GitHub để cả nhóm SWP391 chép cấu hình của bạn, và bạn đang dùng chung tài khoản VPS của nhóm với họ. Trước đó, hãy chắc rằng lịch sử không giữ bí mật nào và shell làm cho máy production không thể nhầm. Làm trong một container khởi động bằng <code>docker run --rm -it --hostname prod-lab ubuntu:24.04 bash</code>.</p><ol>
<li>Tạo <code>~/.bashrc.d/</code> gồm <code>10-history.sh</code> (<code>HISTCONTROL=ignoreboth</code>, <code>histappend</code>, <code>PROMPT_COMMAND='history -a'</code>) và <code>20-prompt.sh</code> (dải băng đỏ <code>case \$(hostname) in *prod*)</code> của bài này). Nạp chúng từ <code>~/.bashrc</code> bằng vòng <code>for f in ~/.bashrc.d/*.sh</code>, rồi <code>exec bash</code>.</li>
<li>Gõ <code> export TOKEN=sk-test-123</code> (có dấu cách đầu) và một lệnh bình thường. Chứng minh bằng <code>grep -c 'sk-[t]est' ~/.bash_history</code> rằng dòng token không bao giờ vào file, trong khi <code>echo \${#TOKEN}</code> cho thấy biến vẫn tồn tại.</li>
<li>Chuyển token sang <code>~/.secrets</code> tạo bằng <code>install -m 600</code>, nạp nó từ <code>~/.bashrc</code> bằng <code>[ -r ~/.secrets ] &amp;&amp; . ~/.secrets</code>, và viết một <code>.gitignore</code> giữ nó ra khỏi kho mã.</li>
<li>Ghi lại PID của shell bằng <code>echo \$\$</code>, rồi từ một terminal thứ hai (<code>docker exec -it … bash</code>) chạy <code>kill -9 &lt;PID đó&gt;</code>; mở một shell mới và kiểm rằng lệnh bình thường cuối cùng vẫn còn trong <code>history</code>.</li></ol>
<p><strong>Đạt khi:</strong> dấu nhắc hiện dải băng đỏ <code>PRODUCTION</code>, lệnh grep ở bước 2 in <code>0</code>, <code>ls -l ~/.secrets</code> mở đầu bằng <code>-rw-------</code>, và lịch sử sống sót qua <code>kill -9</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Alias (bí danh)</span><span class="v">Một từ được thay bằng đoạn chữ ở đầu lệnh, chỉ trong shell tương tác.</span></div>
  <div class="kv"><span class="k">Function (hàm)</span><span class="v">Một khối mã shell có tên, nhận tham số (<code>\$1</code>, <code>\$@</code>).</span></div>
  <div class="kv"><span class="k">PS1 (dấu nhắc chính)</span><span class="v">Biến định nghĩa dấu nhắc; <code>\\u</code>, <code>\\h</code>, <code>\\w</code>, <code>\\\$</code> là các ký hiệu của nó.</span></div>
  <div class="kv"><span class="k">Non-printing sequence <code>\\[ \\]</code> (đoạn không in)</span><span class="v">Dấu báo cho readline biết mã màu không chiếm chiều rộng trên màn hình.</span></div>
  <div class="kv"><span class="k">HISTCONTROL (điều khiển lịch sử)</span><span class="v">Quyết định lịch sử bỏ qua dòng nào: dòng có dấu cách đầu, dòng trùng, hay cả hai.</span></div>
  <div class="kv"><span class="k">histappend (nối thêm lịch sử)</span><span class="v">Nối vào file lịch sử lúc thoát thay vì ghi đè lên nó.</span></div>
  <div class="kv"><span class="k">Readline / <code>~/.inputrc</code> (thư viện soạn dòng)</span><span class="v">Thư viện đứng sau các phím soạn thảo của bash, và file thiết lập của nó.</span></div>
  <div class="kv"><span class="k">shopt (tuỳ chọn shell)</span><span class="v">Lệnh dựng sẵn bật (<code>-s</code>) và tắt (<code>-u</code>) các hành vi tuỳ chọn của bash.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Bí danh là phép thay chữ cho shell tương tác; thứ gì có tham số hay logic thì là hàm, và phải <code>unalias</code> một tên trước khi dùng nó đặt tên hàm.</li>
<li>Các ký hiệu của <code>PS1</code> (<code>\\u \\h \\w \\\$</code>) dựng nên dấu nhắc; mã màu phải nằm trong <code>\\[ \\]</code>, không thì việc soạn dòng hỏng.</li>
<li><code>histappend</code> + <code>PROMPT_COMMAND='history -a'</code> làm mỗi lệnh bền vững ngay khoảnh khắc nó chạy.</li>
<li>Dấu cách đầu dòng chỉ giữ dòng khỏi lịch sử khi có <code>ignorespace</code> — Ubuntu bật sẵn, Fedora và zsh trên macOS thì không.</li>
<li>Giữ bí mật trong một file 600 nằm ngoài kho dotfile; môi trường vẫn phơi chúng ra cho tiến trình con.</li>
<li>Chia một file rc đang phình ra thành <code>~/.bashrc.d/*.sh</code>, giữ từng mảnh bền vững khi chạy lại, và nạp lại bằng <code>source</code> hoặc <code>exec bash -l</code>.</li>
</ul>

<a class="link-card" href="https://www.gnu.org/software/bash/manual/html_node/Controlling-the-Prompt.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Bash Manual — Controlling the Prompt</span><span class="lc-sub">Mọi ký hiệu thoát của <code>PS1</code>, và lời giải thích vì sao <code>\\[</code> và <code>\\]</code> tồn tại. Ngắn, và nó chữa dứt điểm vấn đề bẻ dòng sai.</span></span>
</a>
<a class="link-card" href="https://www.gnu.org/software/bash/manual/html_node/Bash-History-Facilities.html" target="_blank" rel="noopener">
  <span class="lc-ico">🕘</span>
  <span class="lc-body"><span class="lc-title">Bash Manual — History Facilities</span><span class="lc-sub">Toàn bộ các biến <code>HIST*</code> và cú pháp khai triển lịch sử (<code>!!</code>, <code>!\$</code>, <code>^cũ^mới</code>), phát biểu chính xác.</span></span>
</a>
<a class="link-card" href="https://tiswww.case.edu/php/chet/readline/rluserman.html" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Readline User Manual</span><span class="lc-sub">Mọi phím soạn thảo và mọi thiết lập của <code>~/.inputrc</code>. Áp dụng cho bash, psql, python, gdb và mọi thứ khác có liên kết với readline.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: dựng một file bashrc</span><span class="lc-sub">Bài chấm điểm: chuyển một bí danh hỏng thành một hàm, chữa một dấu nhắc bẻ dòng sai, và cấu hình lịch sử sao cho không mất gì khi một terminal bị giết.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> đặt bất cứ thứ gì có <em>IN RA</em> vào <code>~/.bashrc</code> — một lời chào mừng, <code>neofetch</code>, một câu danh ngôn, một dòng "bạn có N bản cập nhật". Đăng nhập tương tác thì trông vẫn ổn, rồi <code>scp</code>, <code>rsync</code> và <code>git push</code> qua SSH bắt đầu hỏng với lỗi giao thức, vì mấy công cụ đó chờ đợi dòng dữ liệu chỉ chứa đúng dữ liệu của chúng (Bài 8.2). Cái chốt tương tác ở đầu file mới là thứ bảo vệ bạn, nên mọi thứ có in ra đều phải nằm <em>DƯỚI</em> nó — và tốt nhất là nằm trong <code>~/.profile</code>, thứ mà các phiên không tương tác không bao giờ đọc.</div>
<p class="note-ct"><strong>Nếu bạn chỉ lấy ba thứ từ bài này:</strong> <code>shopt -s histappend</code> đi cùng <code>PROMPT_COMMAND='history -a'</code>, để lịch sử sống sót qua một terminal bị giết và qua nhiều phiên cùng lúc; hai dòng <code>history-search-backward</code> trong <code>~/.inputrc</code>, để phím Lên lọc theo đúng thứ bạn đã gõ; và một dấu nhắc có màu hoặc có dải băng trên mọi máy production. Hai cái đầu bạn sẽ thấy tác dụng trong vòng một ngày, còn cái thứ ba thì thấy đúng một lần — cái lần mà nó quan trọng.</p>
</div>
`,
    },
    /* ─────────────────────────── 8.5 Quiz ─────────────────────────── */
    {
      title: '8.5 — Chapter 8 quiz|||8.5 — Kiểm tra Chương 8',
      slug: 'lnx-8-5-quiz',
      type: 'QUIZ',
      description: 'Mười câu tình huống: cron không thấy lệnh, biến chưa export, bảng băm giữ đường cũ, ~/.bash_profile che ~/.profile, ssh host lệnh và nvm, sudo -E, .env có dấu cách, tab Terminal trên Mac, HISTCONTROL, và thứ in ra trong ~/.bashrc làm hỏng scp.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations from real servers and laptops. Most ask what a command prints or which line fixes the problem — reading the environment correctly is the skill this chapter is about. Every answer was checked on Ubuntu 24.04 or on a Mac on 28/09/2026.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain the lookup order alias → function → builtin → hash → PATH, and use <code>type -a</code> and <code>hash -r</code>.</li>
<li>I can say which startup files a login, an interactive and a non-interactive bash read — and what <code>ssh host 'cmd'</code> reads.</li>
<li>I know why cron says <code>command not found</code> and can fix it without touching <code>~/.bashrc</code>.</li>
<li>I can tell a shell variable from an exported one, and I know a running process never sees later changes.</li>
<li>I can load a <code>.env</code> correctly and name the places a secret leaks from.</li>
<li>I can explain why <code>sudo -E</code> does not fix <code>sudo: node: command not found</code>.</li>
</ul>
${slide('lx-08', 27, 'Bảng tra nhanh Chương 8 (1/2): PATH & file khởi động')}
${slide('lx-08', 28, 'Bảng tra nhanh Chương 8 (2/2): biến, bí mật, tuỳ biến')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống lấy từ máy chủ và laptop thật. Phần lớn câu hỏi "lệnh này in ra gì" hay "dòng nào chữa được lỗi" — đọc đúng môi trường chính là kỹ năng của chương này. Mọi đáp án đã được kiểm trên Ubuntu 24.04 hoặc trên Mac ngày 28/09/2026.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được thứ tự tra bí danh → hàm → lệnh dựng sẵn → bảng băm → PATH, và dùng được <code>type -a</code> với <code>hash -r</code>.</li>
<li>Tôi nói được bash login, bash tương tác và bash không tương tác đọc những file khởi động nào — và <code>ssh host 'lệnh'</code> đọc gì.</li>
<li>Tôi biết vì sao cron báo <code>command not found</code> và chữa được mà không đụng tới <code>~/.bashrc</code>.</li>
<li>Tôi phân biệt được biến shell với biến đã export, và biết một tiến trình đang chạy không bao giờ thấy thay đổi đến sau.</li>
<li>Tôi nạp được <code>.env</code> cho đúng và kể được những chỗ bí mật rò ra.</li>
<li>Tôi giải thích được vì sao <code>sudo -E</code> không chữa được <code>sudo: node: command not found</code>.</li>
</ul>
${slide('lx-08', 27, 'Bảng tra nhanh Chương 8 (1/2): PATH & file khởi động')}
${slide('lx-08', 28, 'Bảng tra nhanh Chương 8 (2/2): biến, bí mật, tuỳ biến')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'A backup script calls mytool (in /usr/local/bin). Typed by hand it works; from cron the log says "/bin/sh: 1: mytool: not found". Which fix is the most robust?|||Script sao lưu gọi mytool (nằm ở /usr/local/bin). Gõ tay thì chạy; chạy bằng cron thì log báo "/bin/sh: 1: mytool: not found". Cách chữa nào bền nhất?',
            options: [
              'Add export PATH=/usr/local/bin:$PATH to ~/.bashrc|||Thêm export PATH=/usr/local/bin:$PATH vào ~/.bashrc',
              'Run hash -r at the top of the script|||Chạy hash -r ở đầu script',
              'Set PATH at the top of the script (or call /usr/local/bin/mytool by its absolute path)|||Đặt PATH ngay đầu script (hoặc gọi /usr/local/bin/mytool bằng đường dẫn tuyệt đối)',
              'chmod +x /usr/local/bin/mytool|||chmod +x /usr/local/bin/mytool',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: cron gives the job PATH=/usr/bin:/bin and runs it with /bin/sh, reading no startup file — so the script must bring its own PATH or use absolute paths. ~/.bashrc is tempting but cron never reads it; hash -r cannot find a directory that is not on PATH; the file is already executable, since it works by hand.|||VI: cron trao cho công việc PATH=/usr/bin:/bin và chạy nó bằng /bin/sh, không đọc file khởi động nào — nên script phải tự mang PATH theo hoặc dùng đường tuyệt đối. ~/.bashrc nghe hấp dẫn nhưng cron không bao giờ đọc nó; hash -r không tìm ra được một thư mục không có trong PATH; còn file vốn đã chạy được, vì gõ tay thì chạy.',
          },
          {
            question: 'What does this print?  MAU=do; bash -c \'echo "[$MAU]"\'|||Lệnh này in ra gì?  MAU=do; bash -c \'echo "[$MAU]"\'',
            options: [
              '[]',
              '[do]',
              'bash: MAU: unbound variable',
              '[$MAU]',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: MAU is a shell variable — it was never exported, so the child bash does not have it, and the single quotes stop the parent from expanding it first. [do] would need export MAU (measured: exactly that change turns [] into [do]). There is no unbound-variable error without set -u.|||VI: MAU là biến shell — nó chưa bao giờ được export, nên bash con không có nó, và cặp nháy đơn chặn shell cha khai triển nó trước. Muốn ra [do] thì phải export MAU (đo thật: đổi đúng chỗ đó là [] thành [do]). Không có lỗi unbound variable khi chưa bật set -u.',
          },
          {
            question: 'You remove /usr/local/bin/node (another node still exists in /usr/bin, and PATH is unchanged). In the same shell, node --version prints "bash: /usr/local/bin/node: No such file or directory". Why the old path?|||Bạn gỡ /usr/local/bin/node (vẫn còn một node khác ở /usr/bin, và PATH không đổi). Trong cùng shell đó, node --version in "bash: /usr/local/bin/node: No such file or directory". Vì sao lại là đường CŨ?',
            options: [
              'PATH still lists /usr/local/bin before /usr/bin|||PATH vẫn liệt kê /usr/local/bin trước /usr/bin',
              'The node in /usr/bin is not executable|||Bản node ở /usr/bin không có quyền chạy',
              'Removing a file only takes effect after logging out|||Xoá file chỉ có hiệu lực sau khi đăng xuất',
              'Bash hashed the full path earlier and goes straight to it without searching PATH — hash -r fixes it|||Bash đã băm đường dẫn đầy đủ từ trước và đi thẳng tới đó mà không lục PATH — hash -r chữa được',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: the hash table remembers where node was found; after the file disappears, bash still execs the remembered path. The PATH order is irrelevant here — a real PATH search would skip the missing file and find /usr/bin/node, which is exactly what happens after hash -r (or any assignment to PATH, which also flushes the table).|||VI: bảng băm nhớ chỗ node từng được tìm thấy; file biến mất rồi mà bash vẫn exec đúng đường đã nhớ. Thứ tự PATH không liên quan ở đây — một lần lục PATH thật sẽ bỏ qua file đã mất và tìm ra /usr/bin/node, chính là điều xảy ra sau hash -r (hoặc sau bất kỳ phép gán PATH nào, vì nó cũng xoá bảng).',
          },
          {
            question: 'On an Ubuntu VPS you add ~/.local/bin to PATH in ~/.profile, but new SSH logins do not get it. ls -a ~ shows a .bash_profile created by some installer. What is going on?|||Trên VPS Ubuntu bạn thêm ~/.local/bin vào PATH trong ~/.profile, nhưng các lần đăng nhập SSH mới không nhận. ls -a ~ cho thấy có một .bash_profile do trình cài đặt nào đó tạo ra. Chuyện gì đang xảy ra?',
            options: [
              'SSH logins read only ~/.bashrc|||Đăng nhập SSH chỉ đọc ~/.bashrc',
              'A login bash reads only the FIRST of ~/.bash_profile, ~/.bash_login, ~/.profile — so ~/.profile is now skipped|||Bash login chỉ đọc cái ĐẦU TIÊN có mặt trong ~/.bash_profile, ~/.bash_login, ~/.profile — nên giờ ~/.profile bị bỏ qua',
              '~/.profile is read, but PATH may only be set in /etc/environment|||~/.profile có được đọc, nhưng PATH chỉ được đặt trong /etc/environment',
              'The change needs a reboot of the VPS|||Thay đổi cần khởi động lại VPS',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: measured with markers — once ~/.bash_profile exists, bash -l prints /etc/profile then ~/.bash_profile, and ~/.profile never runs. Fix: have ~/.bash_profile source ~/.profile. An interactive SSH login is a login shell, so "only ~/.bashrc" is wrong; nothing needs a reboot — the next login reads files afresh.|||VI: đo bằng dấu mốc — khi ~/.bash_profile đã tồn tại, bash -l in /etc/profile rồi ~/.bash_profile, còn ~/.profile không bao giờ chạy. Chữa: cho ~/.bash_profile source ~/.profile. Đăng nhập SSH tương tác là shell login, nên "chỉ ~/.bashrc" là sai; cũng chẳng cần khởi động lại — lần đăng nhập sau đọc file từ đầu.',
          },
          {
            question: 'nvm added its lines at the END of ~/.bashrc on the VPS. "ssh vps \'node --version\'" says command not found. Which command works (measured on Ubuntu 24.04)?|||nvm thêm các dòng của nó vào CUỐI ~/.bashrc trên VPS. "ssh vps \'node --version\'" báo command not found. Lệnh nào chạy được (đo trên Ubuntu 24.04)?',
            options: [
              'ssh vps \'bash -lc "node --version"\'',
              'ssh vps \'source ~/.profile; node --version\'',
              'ssh vps \'~/.nvm/versions/node/v22.6.0/bin/node --version\'',
              'ssh vps \'export PATH; node --version\'',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: the absolute path needs no lookup at all. bash -lc looks like the classic fix, but a login shell that is not interactive reads ~/.profile, which sources ~/.bashrc — and the interactive guard returns before nvm\'s lines (measured: still "command not found"). Sourcing ~/.profile by hand hits the same guard; export PATH just re-exports the PATH you already have.|||VI: đường dẫn tuyệt đối không cần tra gì cả. bash -lc trông như cách chữa kinh điển, nhưng một shell login mà không tương tác đọc ~/.profile, file này source ~/.bashrc — và cái chốt tương tác quay về trước khi tới các dòng của nvm (đo thật: vẫn "command not found"). Tự source ~/.profile cũng đụng đúng cái chốt đó; export PATH chỉ export lại cái PATH bạn đang có.',
          },
          {
            question: 'node works for you, but both "sudo node --version" and "sudo -E node --version" print "sudo: node: command not found". Why?|||node chạy được với bạn, nhưng cả "sudo node --version" lẫn "sudo -E node --version" đều in "sudo: node: command not found". Vì sao?',
            options: [
              'sudo replaces PATH with secure_path from /etc/sudoers, and -E does not change that|||sudo thay PATH bằng secure_path trong /etc/sudoers, và -E không đổi được điều đó',
              'root has no permission to read your home directory|||root không có quyền đọc thư mục nhà của bạn',
              '-E only works together with -i|||-E chỉ có tác dụng khi đi cùng -i',
              'node must be reinstalled system-wide for root|||node phải được cài lại cho toàn hệ thống cho root',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: sudo env | grep ^PATH shows secure_path, with or without -E — -E keeps your other variables but PATH is still replaced. root can read your home directory (and sudo "$(command -v node)" --version works, measured), so it is not a permission problem; no reinstall is needed.|||VI: sudo env | grep ^PATH cho thấy secure_path, có hay không có -E cũng vậy — -E giữ các biến khác của bạn nhưng PATH vẫn bị thay. root đọc được thư mục nhà của bạn (và sudo "$(command -v node)" --version chạy được, đã đo), nên đây không phải chuyện quyền; cũng không cần cài lại gì.',
          },
          {
            question: '.env contains the single line DB_URL=postgres://app:mat khau@localhost/app (no quotes). What does  . ./.env; echo "[$DB_URL]"  print?|||.env chứa đúng một dòng DB_URL=postgres://app:mat khau@localhost/app (không có nháy). Lệnh  . ./.env; echo "[$DB_URL]"  in ra gì?',
            options: [
              '[postgres://app:mat khau@localhost/app]',
              '[postgres://app:mat]',
              '[khau@localhost/app]',
              './.env: line 1: khau@localhost/app: No such file or directory — then []|||./.env: line 1: khau@localhost/app: No such file or directory — rồi []',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: source runs the line as bash code: DB_URL=postgres://app:mat becomes a prefix for a command named khau@localhost/app, which does not exist (exit 127), and a prefix never reaches your shell — so DB_URL stays empty. [postgres://app:mat] is the attractive guess, but the assignment was only for that one failed command. Quote the value.|||VI: source chạy dòng đó như mã bash: DB_URL=postgres://app:mat thành tiền tố cho một lệnh tên khau@localhost/app, thứ không tồn tại (mã 127), mà tiền tố thì không bao giờ tới được shell của bạn — nên DB_URL vẫn rỗng. [postgres://app:mat] là phương án dễ bị chọn, nhưng phép gán đó chỉ dành cho đúng cái lệnh hỏng kia. Hãy bọc giá trị trong nháy.',
          },
          {
            question: 'On a Mac, you open a new Terminal tab (zsh). Which of your files are read, in order?|||Trên Mac, bạn mở một tab Terminal mới (zsh). Những file nào của bạn được đọc, theo thứ tự nào?',
            options: [
              '~/.zshrc only|||Chỉ ~/.zshrc',
              '~/.zshenv → ~/.zprofile → ~/.zshrc → ~/.zlogin',
              '~/.zprofile → ~/.zshrc',
              '~/.zshenv → ~/.zshrc',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Terminal.app opens a login, interactive shell (ps shows -zsh), and measured with ZDOTDIR a login+interactive zsh reads .zshenv, .zprofile, .zshrc, .zlogin (and .zlogout on exit). ".zshenv → .zshrc" is what a non-login interactive zsh reads — the Linux-desktop habit that does not apply on a Mac.|||VI: Terminal.app mở một shell login, tương tác (ps thấy -zsh), và đo bằng ZDOTDIR thì zsh login+tương tác đọc .zshenv, .zprofile, .zshrc, .zlogin (và .zlogout lúc thoát). ".zshenv → .zshrc" là thứ zsh tương tác KHÔNG login đọc — thói quen của Linux để bàn, không đúng trên Mac.',
          },
          {
            question: 'With HISTCONTROL=ignorespace you type " export TOKEN=sk-live-x" (note the leading space). What is true afterwards?|||Với HISTCONTROL=ignorespace, bạn gõ " export TOKEN=sk-live-x" (để ý dấu cách đầu). Điều gì đúng sau đó?',
            options: [
              'The line is not saved, and TOKEN is not set either|||Dòng đó không được lưu, và TOKEN cũng không được đặt',
              'The line is saved, but with the value masked|||Dòng đó được lưu, nhưng giá trị bị che đi',
              'The line stays out of the history file, but TOKEN is set and every child process inherits it|||Dòng đó không vào file lịch sử, nhưng TOKEN vẫn được đặt và mọi tiến trình con đều thừa kế nó',
              'The value is also hidden from /proc/PID/environ|||Giá trị cũng bị giấu khỏi /proc/PID/environ',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: ignorespace only affects history (measured: grep finds 0 matches in the file while echo ${#TOKEN} prints 13). The command still runs, so the variable exists and is exported to children and visible in /proc. bash never masks values. And on Fedora or macOS zsh, where ignorespace is off by default, the line would be saved.|||VI: ignorespace chỉ tác động tới lịch sử (đo thật: grep tìm được 0 dòng trong file trong khi echo ${#TOKEN} in 13). Lệnh vẫn chạy, nên biến vẫn tồn tại, được export cho tiến trình con và thấy được trong /proc. bash không bao giờ che giá trị. Và trên Fedora hay zsh của macOS, nơi ignorespace mặc định tắt, dòng đó SẼ được lưu.',
          },
          {
            question: 'You add echo "Chào mừng!" as the FIRST line of ~/.bashrc on the VPS, above the interactive guard. Interactive logins look fine. What breaks?|||Bạn thêm echo "Chào mừng!" làm dòng ĐẦU TIÊN của ~/.bashrc trên VPS, phía trên cái chốt tương tác. Đăng nhập tương tác trông vẫn ổn. Cái gì hỏng?',
            options: [
              'scp, rsync and git over SSH — the remote non-interactive bash still runs the top of ~/.bashrc and the text pollutes their data stream|||scp, rsync và git qua SSH — bash không tương tác ở đầu kia vẫn chạy phần đầu ~/.bashrc và dòng chữ làm bẩn luồng dữ liệu của chúng',
              'cron jobs, because cron sources ~/.bashrc|||Các công việc cron, vì cron source ~/.bashrc',
              'sudo, because it re-reads ~/.bashrc as root|||sudo, vì nó đọc lại ~/.bashrc với quyền root',
              'Nothing — non-interactive shells never read ~/.bashrc|||Không gì cả — shell không tương tác không bao giờ đọc ~/.bashrc',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: measured with a real sshd — "ssh host cmd" makes Debian/Ubuntu bash read ~/.bashrc until the guard, so a line above the guard runs and prints into the channel scp/rsync/git use for data. "Nothing" is the attractive wrong answer: it is true for scripts and cron, not for commands started by sshd. cron reads no rc file at all.|||VI: đo bằng sshd thật — "ssh host lệnh" làm bash của Debian/Ubuntu đọc ~/.bashrc tới cái chốt, nên một dòng nằm trên cái chốt vẫn chạy và in chữ vào đúng kênh mà scp/rsync/git dùng để truyền dữ liệu. "Không gì cả" là phương án sai hấp dẫn: nó đúng với script và cron, không đúng với lệnh do sshd khởi động. cron thì không đọc file rc nào.',
          },
        ],
      },
    },
  ],
};
