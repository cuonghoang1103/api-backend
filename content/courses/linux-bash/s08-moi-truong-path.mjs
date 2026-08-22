/**
 * Linux & Bash — Chương 8: Môi trường, PATH & file khởi động.
 * PATH và "command not found" · file khởi động · biến môi trường và bí mật · tuỳ biến shell · quiz.
 * Output CHẠY THẬT Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Flinux-bash%2Flearn&reflabel=Linux%20%26%20Bash';

export default {
  title: 'Chapter 8 — Environment, PATH & startup files|||Chương 8 — Môi trường, PATH & file khởi động',
  description: 'Vì sao có "command not found", sửa file nào, và shell đăng nhập khác shell tương tác ra sao. Chương này giải thích dứt điểm câu hỏi "chạy tay thì được, cron thì hỏng" và chỉ chỗ đặt biến môi trường cho từng loại tiến trình.',
  lessons: [
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
<pre><code>which node                       <span class="tok-comment"># /usr/local/bin/node</span>
sudo mv /usr/local/bin/node /opt/node/bin/
export PATH="/opt/node/bin:\$PATH"
node --version</code></pre>
<div class="out">bash: /usr/local/bin/node: No such file or directory</div>
<p>The error names the <em>old</em> path, even though <code>PATH</code> now points somewhere else — because bash remembered where it found <code>node</code> last time and did not look again. Three ways out:</p>
<pre><code>hash -r                 <span class="tok-comment"># forget every remembered path</span>
hash -d node            <span class="tok-comment"># forget just this one</span>
hash                    <span class="tok-comment"># show the current table</span></code></pre>
<div class="out">hits    command
   4    /usr/bin/git
   2    /usr/bin/docker</div>
<div class="callout">This is also the answer to "I just installed it and bash says command not found". If bash previously <em>failed</em> to find the command it does not cache the failure — but if a shell was open before you added a new directory to <code>PATH</code>, that shell's <code>PATH</code> is still the old one entirely. <code>hash -r</code> fixes a stale <em>hit</em>; a new shell (or re-sourcing your rc file) fixes a stale <code>PATH</code>. Knowing which of the two you have saves a reboot.</div>

<h3>Order decides which version runs</h3>
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
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: find the command</span><span class="lc-sub">Graded scenarios: a shadowed binary, a stale hash entry, a directory missing from PATH, and a script that works interactively but not under <code>env -i</code>.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> <code>sudo</code> uses a <em>different</em> <code>PATH</code> from yours. For security, <code>sudo</code> resets it to <code>secure_path</code> from <code>/etc/sudoers</code> — typically <code>/usr/sbin:/usr/bin:/sbin:/bin</code>, with none of your additions. So <code>node --version</code> works and <code>sudo node --version</code> says "command not found", which looks like a permission problem and is not. Use the absolute path (<code>sudo "\$(command -v node)" …</code>), or <code>sudo -E</code> to preserve the environment, or <code>sudo env "PATH=\$PATH" node …</code>. Do not edit <code>secure_path</code> to add your home directory — that hands root a directory you can write to, which is exactly what the setting exists to prevent.</div>
<p class="note-ct"><strong>Three commands worth keeping:</strong> <code>type -a &lt;cmd&gt;</code> to see everything that could run under that name and in what order; <code>echo "\$PATH" | tr ':' '\\n'</code> to read the list as a list; and <code>hash -r</code> when a command you just moved is still being looked up in its old home. Between them they answer nearly every "why is it running the wrong thing" question in under ten seconds.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>PATH, và vì sao có "command not found"</h2>
<p class="lead">Bạn gõ <code>node</code> và một thứ gì đó chạy. Thứ nào, và shell đã quyết định ra sao? Câu trả lời là một danh sách thư mục ngăn nhau bằng dấu hai chấm, được tìm từ trái sang phải — cộng thêm ba lối tắt được tra trước. Gần như mọi lỗi "command not found", "nó chạy nhầm phiên bản" và "máy tôi thì được mà cron thì hỏng" đều truy về đúng phép tra cứu này.</p>

<h3>PATH thật ra là gì</h3>
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
<pre><code>which node                       <span class="tok-comment"># /usr/local/bin/node</span>
sudo mv /usr/local/bin/node /opt/node/bin/
export PATH="/opt/node/bin:\$PATH"
node --version</code></pre>
<div class="out">bash: /usr/local/bin/node: No such file or directory</div>
<p>Thông báo lỗi gọi tên đường dẫn <em>CŨ</em>, dù <code>PATH</code> giờ đã trỏ chỗ khác — vì bash nhớ chỗ nó tìm thấy <code>node</code> lần trước và không đi tìm lại. Ba lối ra:</p>
<pre><code>hash -r                 <span class="tok-comment"># quên mọi đường dẫn đã nhớ</span>
hash -d node            <span class="tok-comment"># chỉ quên đúng cái này</span>
hash                    <span class="tok-comment"># xem bảng hiện tại</span></code></pre>
<div class="out">hits    command
   4    /usr/bin/git
   2    /usr/bin/docker</div>
<div class="callout">Đây cũng là câu trả lời cho "tôi vừa cài xong mà bash bảo command not found". Nếu bash trước đó <em>KHÔNG</em> tìm thấy lệnh thì nó không lưu lại thất bại — nhưng nếu một shell đã mở TRƯỚC khi bạn thêm thư mục mới vào <code>PATH</code>, thì <code>PATH</code> của shell đó vẫn hoàn toàn là bản cũ. <code>hash -r</code> chữa một kết quả TRÚNG đã cũ; còn một shell mới (hoặc source lại file rc) mới chữa được một <code>PATH</code> cũ. Biết mình đang gặp cái nào trong hai cái đó thì đỡ phải khởi động lại máy.</div>

<h3>Thứ tự quyết định phiên bản nào chạy</h3>
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
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: tìm cho ra cái lệnh</span><span class="lc-sub">Các tình huống chấm điểm: một chương trình bị che khuất, một mục băm đã cũ, một thư mục thiếu khỏi PATH, và một script chạy tay thì được mà chạy dưới <code>env -i</code> thì hỏng.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> <code>sudo</code> dùng một <code>PATH</code> <em>KHÁC</em> với của bạn. Vì lý do an ninh, <code>sudo</code> đặt lại nó về <code>secure_path</code> lấy từ <code>/etc/sudoers</code> — thường là <code>/usr/sbin:/usr/bin:/sbin:/bin</code>, không có bất kỳ phần bổ sung nào của bạn. Nên <code>node --version</code> chạy được còn <code>sudo node --version</code> lại nói "command not found", thứ TRÔNG như một vấn đề quyền mà không phải. Hãy dùng đường dẫn tuyệt đối (<code>sudo "\$(command -v node)" …</code>), hoặc <code>sudo -E</code> để giữ lại môi trường, hoặc <code>sudo env "PATH=\$PATH" node …</code>. Đừng sửa <code>secure_path</code> để thêm thư mục nhà của bạn vào — làm thế là trao cho root một thư mục mà bạn ghi được, và đó chính xác là thứ mà thiết lập đó sinh ra để ngăn chặn.</div>
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

<h3>The decision table</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Login shell</span><span class="lz-t">/etc/profile → then the FIRST of: ~/.bash_profile, ~/.bash_login, ~/.profile</span><span class="lz-d">Only the first one that exists is read; the others are ignored entirely. This is why creating ~/.bash_profile can silently disable your ~/.profile.</span></div>
  <div class="lz-step"><span class="lz-k">Interactive non-login</span><span class="lz-t">/etc/bash.bashrc → ~/.bashrc</span><span class="lz-d">The profile files are NOT read. Every new terminal tab takes this path.</span></div>
  <div class="lz-step"><span class="lz-k">Non-interactive</span><span class="lz-t">nothing — unless BASH_ENV is set</span><span class="lz-d">A script gets no rc file at all. This is the entire explanation of "works in my terminal, fails in cron".</span></div>
  <div class="lz-step"><span class="lz-k">Logout</span><span class="lz-t">~/.bash_logout</span><span class="lz-d">Only for login shells, on exit. Rarely used; occasionally handy for clearing a screen or a ssh-agent.</span></div>
</div>
<div class="callout warn"><strong>On a login shell, bash reads only the FIRST profile file it finds.</strong> The order is <code>~/.bash_profile</code>, then <code>~/.bash_login</code>, then <code>~/.profile</code>. Debian and Ubuntu ship a <code>~/.profile</code>; the moment some installer creates a <code>~/.bash_profile</code>, your <code>~/.profile</code> stops being read and everything in it — often the <code>PATH</code> additions — silently disappears from SSH sessions while still working in your desktop terminal. If you have both files, the <code>~/.bash_profile</code> must source the other one explicitly.</div>

<h3>Why an SSH session behaves differently from a terminal tab</h3>
<pre><code><span class="tok-comment"># Interactive login shell — reads .profile, and .profile usually sources .bashrc</span>
ssh vps

<span class="tok-comment"># NON-interactive, non-login — reads NOTHING</span>
ssh vps 'echo \$PATH'
ssh vps 'node --version'</code></pre>
<div class="out">/usr/local/bin:/usr/bin:/bin
bash: node: command not found</div>
<p>Same machine, same user, two different answers. Logging in interactively runs the profile chain; passing a command to <code>ssh</code> does not, so a <code>PATH</code> set up by nvm or a version manager is simply absent. This catches people deploying over SSH constantly.</p>
<pre><code><span class="tok-comment"># Force a login shell for a remote command</span>
ssh vps 'bash -lc "node --version"'

<span class="tok-comment"># Or, better in a script: use the absolute path</span>
ssh vps '/home/deploy/.nvm/versions/node/v22.6.0/bin/node --version'</code></pre>

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
<pre><code><span class="tok-comment"># What a cron job actually gets</span>
* * * * * env &gt; /tmp/cron-env.txt
cat /tmp/cron-env.txt</code></pre>
<div class="out">HOME=/home/deploy
LOGNAME=deploy
PATH=/usr/bin:/bin
SHELL=/bin/sh
PWD=/home/deploy</div>
<p>Five variables, a <code>PATH</code> with two entries, and <code>SHELL=/bin/sh</code> — not bash. No <code>~/.profile</code>, no <code>~/.bashrc</code>, none of your version managers, none of your exports. Everything you rely on interactively is absent.</p>
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
<pre><code><span class="tok-comment"># Put a marker in each file, temporarily</span>
echo 'echo "read: ~/.profile" &gt;&amp;2' &gt;&gt; ~/.profile
echo 'echo "read: ~/.bashrc"  &gt;&amp;2' &gt;&gt; ~/.bashrc

bash -lc true      <span class="tok-comment"># login</span>
bash -ic true      <span class="tok-comment"># interactive non-login</span>
bash -c true       <span class="tok-comment"># non-interactive</span></code></pre>
<div class="out">read: ~/.profile
read: ~/.bashrc
read: ~/.bashrc
</div>
<p>Three invocations, three different answers, and the third prints nothing at all — which is the whole lesson in one experiment. Send the markers to stderr (<code>&gt;&amp;2</code>) so they cannot corrupt an <code>scp</code> while you are testing, and remove them afterwards.</p>
<pre><code>bash -lx -c true 2&gt;&amp;1 | grep -E '^\\+.*(profile|bashrc)'   <span class="tok-comment"># trace the whole chain</span></code></pre>

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

<h3>Bảng quyết định</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Shell đăng nhập</span><span class="lz-t">/etc/profile → rồi CÁI ĐẦU TIÊN trong: ~/.bash_profile, ~/.bash_login, ~/.profile</span><span class="lz-d">Chỉ cái đầu tiên TỒN TẠI được đọc; những cái còn lại bị bỏ qua hoàn toàn. Đây là lý do tạo ra ~/.bash_profile có thể âm thầm vô hiệu hoá ~/.profile của bạn.</span></div>
  <div class="lz-step"><span class="lz-k">Tương tác, không đăng nhập</span><span class="lz-t">/etc/bash.bashrc → ~/.bashrc</span><span class="lz-d">Các file profile KHÔNG được đọc. Mỗi tab terminal mới đều đi theo đường này.</span></div>
  <div class="lz-step"><span class="lz-k">Không tương tác</span><span class="lz-t">không gì cả — trừ khi có đặt BASH_ENV</span><span class="lz-d">Một script hoàn toàn không nhận file rc nào. Đây là toàn bộ lời giải thích cho câu "chạy ở terminal thì được, cron thì hỏng".</span></div>
  <div class="lz-step"><span class="lz-k">Đăng xuất</span><span class="lz-t">~/.bash_logout</span><span class="lz-d">Chỉ với shell đăng nhập, lúc thoát. Ít dùng; thi thoảng tiện để xoá màn hình hay dọn một ssh-agent.</span></div>
</div>
<div class="callout warn"><strong>Với shell đăng nhập, bash chỉ đọc file profile ĐẦU TIÊN nó tìm thấy.</strong> Thứ tự là <code>~/.bash_profile</code>, rồi <code>~/.bash_login</code>, rồi <code>~/.profile</code>. Debian và Ubuntu kèm sẵn một <code>~/.profile</code>; khoảnh khắc một trình cài đặt nào đó tạo ra <code>~/.bash_profile</code>, file <code>~/.profile</code> của bạn thôi được đọc và mọi thứ trong đó — thường là các phần bổ sung <code>PATH</code> — âm thầm biến mất khỏi các phiên SSH trong khi vẫn chạy tốt ở terminal trên máy để bàn. Nếu bạn có cả hai file, cái <code>~/.bash_profile</code> BẮT BUỘC phải source cái kia một cách tường minh.</div>

<h3>Vì sao một phiên SSH hành xử khác một tab terminal</h3>
<pre><code><span class="tok-comment"># Shell đăng nhập tương tác — đọc .profile, và .profile thường source .bashrc</span>
ssh vps

<span class="tok-comment"># KHÔNG tương tác, không đăng nhập — KHÔNG đọc gì cả</span>
ssh vps 'echo \$PATH'
ssh vps 'node --version'</code></pre>
<div class="out">/usr/local/bin:/usr/bin:/bin
bash: node: command not found</div>
<p>Cùng một máy, cùng một người dùng, hai câu trả lời khác nhau. Đăng nhập tương tác thì chạy chuỗi profile; còn truyền một lệnh vào cho <code>ssh</code> thì không, nên một <code>PATH</code> do nvm hay một trình quản lý phiên bản dựng lên đơn giản là vắng mặt. Chuyện này bẫy những người deploy qua SSH suốt ngày.</p>
<pre><code><span class="tok-comment"># Ép một shell đăng nhập cho lệnh chạy từ xa</span>
ssh vps 'bash -lc "node --version"'

<span class="tok-comment"># Hoặc, tốt hơn trong một script: dùng đường dẫn tuyệt đối</span>
ssh vps '/home/deploy/.nvm/versions/node/v22.6.0/bin/node --version'</code></pre>

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
<pre><code><span class="tok-comment"># Một công việc cron THẬT SỰ nhận được gì</span>
* * * * * env &gt; /tmp/cron-env.txt
cat /tmp/cron-env.txt</code></pre>
<div class="out">HOME=/home/deploy
LOGNAME=deploy
PATH=/usr/bin:/bin
SHELL=/bin/sh
PWD=/home/deploy</div>
<p>Năm biến, một <code>PATH</code> có hai mục, và <code>SHELL=/bin/sh</code> — không phải bash. Không <code>~/.profile</code>, không <code>~/.bashrc</code>, không trình quản lý phiên bản nào của bạn, không biến export nào của bạn. Mọi thứ bạn dựa vào khi gõ tay đều vắng mặt.</p>
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
<pre><code><span class="tok-comment"># Đặt một dấu mốc vào mỗi file, tạm thời thôi</span>
echo 'echo "đã đọc: ~/.profile" &gt;&amp;2' &gt;&gt; ~/.profile
echo 'echo "đã đọc: ~/.bashrc"  &gt;&amp;2' &gt;&gt; ~/.bashrc

bash -lc true      <span class="tok-comment"># đăng nhập</span>
bash -ic true      <span class="tok-comment"># tương tác, không đăng nhập</span>
bash -c true       <span class="tok-comment"># không tương tác</span></code></pre>
<div class="out">đã đọc: ~/.profile
đã đọc: ~/.bashrc
đã đọc: ~/.bashrc
</div>
<p>Ba cách gọi, ba câu trả lời khác nhau, và cái thứ ba chẳng in ra gì cả — đó là toàn bộ bài học gói trong một thí nghiệm. Hãy đưa các dấu mốc ra stderr (<code>&gt;&amp;2</code>) để chúng không thể làm hỏng một lệnh <code>scp</code> trong lúc bạn đang thử, và nhớ xoá chúng đi sau đó.</p>
<pre><code>bash -lx -c true 2&gt;&amp;1 | grep -E '^\\+.*(profile|bashrc)'   <span class="tok-comment"># lần theo cả chuỗi</span></code></pre>

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

<h3>Setting a variable for exactly one command</h3>
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

<h3>Four places a variable can come from</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Command prefix</span><span class="lz-lnote"><code>KEY=value cmd</code> — one process, nothing inherited by your shell. Use for experiments and per-invocation overrides.</span></div>
  <div class="lz-layer"><span class="lz-lname">Shell session</span><span class="lz-lnote"><code>export KEY=value</code> in <code>~/.profile</code> — this shell and everything it starts, for the whole session (Lesson 8.2).</span></div>
  <div class="lz-layer"><span class="lz-lname">Service unit</span><span class="lz-lnote"><code>Environment=</code> or <code>EnvironmentFile=</code> in a systemd unit — the only thing a daemon reads. No shell files apply.</span></div>
  <div class="lz-layer"><span class="lz-lname">Container</span><span class="lz-lnote"><code>ENV</code> in a Dockerfile (baked into the image), <code>-e</code> / <code>env_file</code> at run time (not baked). Two very different lifetimes.</span></div>
</div>
<div class="callout warn">The container distinction matters and is regularly got wrong. <code>ENV API_KEY=…</code> in a Dockerfile is stored <em>in the image layer</em> — anyone who can pull the image can read it with <code>docker history</code>, forever, including after you rotate the key. Same for <code>ARG</code> passed with <code>--build-arg</code>: it appears in the build history. Secrets belong at <em>run</em> time, via <code>-e</code>, <code>--env-file</code> or a secrets mount — never in the image.</div>

<h3>.env files: what they are and are not</h3>
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
<pre><code><span class="tok-comment"># And source only trusted files: .env is EXECUTED as shell code</span>
echo 'rm -rf /tmp/important' &gt;&gt; .env
source .env          <span class="tok-comment"># that line runs</span></code></pre>
<p><code>source</code> does not parse key–value pairs; it runs the file as a bash script. A <code>.env</code> that came from a colleague, a CI artefact or an unfamiliar repository is code you are about to execute as yourself. That is fine for a file you wrote; it is not a safe way to consume a file you did not.</p>

<h3>Why secrets in the environment are not actually secret</h3>
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

<h3>Đặt biến cho đúng một lệnh</h3>
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

<h3>Bốn nơi một biến có thể đến từ đó</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Tiền tố dòng lệnh</span><span class="lz-lnote"><code>KHOÁ=giá trị lệnh</code> — một tiến trình, shell của bạn không thừa kế gì. Dùng cho thử nghiệm và cho việc ghi đè theo từng lần gọi.</span></div>
  <div class="lz-layer"><span class="lz-lname">Phiên shell</span><span class="lz-lnote"><code>export KHOÁ=giá trị</code> trong <code>~/.profile</code> — shell này và mọi thứ nó khởi động, suốt cả phiên (Bài 8.2).</span></div>
  <div class="lz-layer"><span class="lz-lname">Unit của dịch vụ</span><span class="lz-lnote"><code>Environment=</code> hoặc <code>EnvironmentFile=</code> trong một unit systemd — thứ DUY NHẤT mà một daemon đọc. Không file shell nào áp dụng.</span></div>
  <div class="lz-layer"><span class="lz-lname">Container</span><span class="lz-lnote"><code>ENV</code> trong Dockerfile (nung vào ảnh), <code>-e</code> / <code>env_file</code> lúc chạy (không nung vào). Hai vòng đời rất khác nhau.</span></div>
</div>
<div class="callout warn">Chỗ phân biệt của container là quan trọng và thường xuyên bị làm sai. <code>ENV API_KEY=…</code> trong một Dockerfile được lưu <em>NGAY TRONG LỚP CỦA ẢNH</em> — ai kéo được ảnh về đều đọc ra bằng <code>docker history</code>, vĩnh viễn, kể cả sau khi bạn xoay khoá. Tương tự với <code>ARG</code> truyền qua <code>--build-arg</code>: nó hiện trong lịch sử dựng. Bí mật thuộc về lúc <em>CHẠY</em>, qua <code>-e</code>, <code>--env-file</code> hay một mount bí mật — không bao giờ nằm trong ảnh.</div>

<h3>File .env: nó là gì và không là gì</h3>
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
<pre><code><span class="tok-comment"># Và chỉ source những file tin được: .env được THỰC THI như mã shell</span>
echo 'rm -rf /tmp/important' &gt;&gt; .env
source .env          <span class="tok-comment"># dòng đó chạy thật</span></code></pre>
<p><code>source</code> KHÔNG phân tích các cặp khoá–giá trị; nó CHẠY cái file như một script bash. Một file <code>.env</code> đến từ một đồng nghiệp, từ một tệp phẩm CI hay từ một kho mã lạ chính là MÃ mà bạn sắp thực thi với danh nghĩa của mình. Với một file do chính bạn viết thì không sao; nhưng đó không phải cách an toàn để tiêu thụ một file không phải của bạn.</p>

<h3>Vì sao bí mật đặt trong môi trường thật ra không bí mật</h3>
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
DATABASE_URL=postgres://app:DA_CHE@localhost:5432/app
API_KEY=DA_CHE
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
<pre><code><span class="tok-comment"># Split by topic, source what exists</span>
for f in ~/.bashrc.d/*.sh; do
  [[ -r \$f ]] &amp;&amp; . "\$f"
done
unset f</code></pre>
<div class="callout">Once <code>~/.bashrc</code> passes a couple of hundred lines, split it: <code>10-env.sh</code>, <code>20-aliases.sh</code>, <code>30-prompt.sh</code>, <code>40-work.sh</code>. It makes the whole thing versionable in git, and it means a machine-specific piece can simply be absent rather than wrapped in a conditional. Keep the files idempotent (Lesson 7.3) so re-sourcing is harmless — you will do it often while editing them.</div>

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
<pre><code><span class="tok-comment"># Chia theo chủ đề, source những cái có tồn tại</span>
for f in ~/.bashrc.d/*.sh; do
  [[ -r \$f ]] &amp;&amp; . "\$f"
done
unset f</code></pre>
<div class="callout">Khi <code>~/.bashrc</code> vượt vài trăm dòng, hãy chia nó ra: <code>10-env.sh</code>, <code>20-aliases.sh</code>, <code>30-prompt.sh</code>, <code>40-work.sh</code>. Nó làm cả bộ quản lý được bằng git, và nghĩa là một mảnh chỉ dành cho một máy cụ thể có thể đơn giản là VẮNG MẶT thay vì phải bọc trong một câu điều kiện. Hãy giữ các file bền vững khi chạy lại (Bài 7.3) để việc source lại là vô hại — bạn sẽ làm việc đó luôn tay trong lúc sửa chúng.</div>

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
      description: 'Tám câu về thứ tự tra cứu lệnh, bảng băm, dấu chấm trong PATH, file profile đầu tiên thắng, vì sao ssh host cmd khác ssh host, ENV của Dockerfile, /proc/PID/environ, và histappend.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on PATH, startup files, environment variables and shell customisation. Answer from memory; they follow the lesson order.</p>
<div class="callout ok">Aim for 7/8. The three that matter most in real work: why <code>ssh host 'cmd'</code> sees a different <code>PATH</code> from <code>ssh host</code> (8.2), why a secret in a Dockerfile <code>ENV</code> survives rotation (8.3), and what <code>histappend</code> actually fixes (8.4).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về PATH, file khởi động, biến môi trường và việc tuỳ biến shell. Trả lời bằng trí nhớ; các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Ba câu quan trọng nhất trong việc thật: vì sao <code>ssh host 'cmd'</code> thấy một <code>PATH</code> khác với <code>ssh host</code> (bài 8.2), vì sao một bí mật đặt trong <code>ENV</code> của Dockerfile vẫn sống sót sau khi xoay khoá (bài 8.3), và <code>histappend</code> thật ra chữa cái gì (bài 8.4).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'You define a function named ls. What runs when you type ls?|||Bạn định nghĩa một hàm tên là ls. Khi bạn gõ ls thì cái gì chạy?',
            options: [
              '/bin/ls, because a real program always wins over a function|||/bin/ls, vì một chương trình thật luôn thắng một hàm',
              'Your function — the lookup order is alias, function, builtin, hash, then PATH|||Hàm của bạn — thứ tự tra cứu là bí danh, hàm, lệnh dựng sẵn, bảng băm, rồi mới tới PATH',
              'Bash reports an ambiguous command error|||Bash báo lỗi lệnh mơ hồ',
              'Whichever was defined most recently|||Cái nào được định nghĩa gần đây nhất',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You move a binary and update PATH, but bash still reports the OLD path in its error. Why?|||Bạn di chuyển một chương trình và cập nhật PATH, nhưng bash vẫn báo lỗi kèm đường dẫn CŨ. Vì sao?',
            options: [
              'PATH changes need a reboot to take effect|||Thay đổi PATH cần khởi động lại máy mới có hiệu lực',
              'Bash caches where it found each command in a hash table and did not look again — run hash -r|||Bash lưu chỗ nó tìm thấy mỗi lệnh vào một bảng băm và không đi tìm lại — hãy chạy hash -r',
              'The new directory must be listed last in PATH|||Thư mục mới bắt buộc phải được liệt kê cuối cùng trong PATH',
              'The binary kept a symlink to its old location|||Chương trình đó giữ lại một liên kết tượng trưng tới chỗ cũ',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why is a "." (or an empty entry) in PATH a security problem?|||Vì sao một dấu "." (hoặc một mục rỗng) trong PATH là một vấn đề an ninh?',
            options: [
              'It makes command lookup measurably slower|||Nó làm việc tra cứu lệnh chậm đi một cách đo được',
              'It breaks relative paths in scripts|||Nó làm hỏng các đường dẫn tương đối trong script',
              'cd-ing into a directory someone else controls and typing a normal command like ls can run THEIR file with your privileges|||cd vào một thư mục do người khác kiểm soát rồi gõ một lệnh bình thường như ls có thể chạy FILE CỦA HỌ với đặc quyền của bạn',
              'It prevents sudo from working|||Nó làm sudo không chạy được',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'For a LOGIN shell, which of ~/.bash_profile, ~/.bash_login and ~/.profile are read?|||Với một shell ĐĂNG NHẬP, những file nào trong ~/.bash_profile, ~/.bash_login và ~/.profile được đọc?',
            options: [
              'All three, in that order|||Cả ba, theo đúng thứ tự đó',
              'Only the FIRST one that exists — the others are ignored entirely, which is why creating ~/.bash_profile can silently disable ~/.profile|||Chỉ cái ĐẦU TIÊN tồn tại — những cái còn lại bị bỏ qua hoàn toàn, và đó là lý do tạo ra ~/.bash_profile có thể âm thầm vô hiệu hoá ~/.profile',
              'Only ~/.profile, since it is the POSIX name|||Chỉ ~/.profile, vì đó là cái tên chuẩn POSIX',
              'None — login shells read ~/.bashrc|||Không cái nào — shell đăng nhập đọc ~/.bashrc',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: '"ssh vps" finds node, but "ssh vps \'node --version\'" says command not found. Why?|||"ssh vps" thì tìm thấy node, nhưng "ssh vps \'node --version\'" lại báo command not found. Vì sao?',
            options: [
              'The second form runs as a different user|||Dạng thứ hai chạy với một người dùng khác',
              'Passing a command makes it a NON-interactive, non-login shell, which reads no startup files at all — so a PATH set by a version manager is absent|||Truyền vào một lệnh làm nó thành shell KHÔNG tương tác, không đăng nhập, và loại đó không đọc file khởi động nào cả — nên PATH do một trình quản lý phiên bản dựng lên là vắng mặt',
              'SSH strips environment variables for security|||SSH bóc bỏ biến môi trường vì lý do an ninh',
              'node must be reinstalled system-wide|||node phải được cài lại cho toàn hệ thống',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why should a secret never go in a Dockerfile ENV or --build-arg?|||Vì sao một bí mật không bao giờ nên nằm trong ENV của Dockerfile hay trong --build-arg?',
            options: [
              'Those values are too long for the image format|||Những giá trị đó quá dài so với định dạng ảnh',
              'They are stored in the image layer and readable with docker history by anyone who can pull the image — forever, including after you rotate the key|||Chúng được lưu ngay trong lớp của ảnh và ai kéo được ảnh cũng đọc ra bằng docker history — vĩnh viễn, kể cả sau khi bạn đã xoay khoá',
              'ENV values are not available to the running process|||Giá trị ENV không dùng được với tiến trình đang chạy',
              'Docker refuses to build if ENV contains a key-like string|||Docker từ chối dựng nếu ENV chứa một chuỗi trông giống khoá',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does "env $(grep -v \'^#\' .env | xargs) node app.js" get wrong?|||Lệnh "env $(grep -v \'^#\' .env | xargs) node app.js" sai ở chỗ nào?',
            options: [
              'Nothing — it is the standard way to load a .env file|||Không sai gì — đó là cách chuẩn để nạp một file .env',
              'It goes through word splitting, so any value containing a space (a password, a connection string) is torn into several arguments|||Nó đi qua phép cắt từ, nên mọi giá trị có chứa dấu cách (một mật khẩu, một chuỗi kết nối) bị xé thành nhiều tham số',
              'grep -v cannot match comment lines|||grep -v không khớp được các dòng chú thích',
              'env cannot set more than one variable at a time|||env không đặt được nhiều hơn một biến một lúc',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What problem do "shopt -s histappend" and PROMPT_COMMAND=\'history -a\' solve?|||Cặp "shopt -s histappend" và PROMPT_COMMAND=\'history -a\' giải quyết vấn đề gì?',
            options: [
              'They make history searches faster|||Chúng làm việc tìm trong lịch sử nhanh hơn',
              'By default bash writes history only on clean exit and OVERWRITES the file — so a killed terminal loses everything and the last session to close wins|||Mặc định bash chỉ ghi lịch sử khi thoát sạch sẽ và GHI ĐÈ lên file — nên một terminal bị giết mất sạch, và phiên đóng sau cùng thì thắng',
              'They deduplicate the history file|||Chúng khử trùng lặp trong file lịch sử',
              'They add timestamps to each entry|||Chúng thêm dấu thời gian cho từng mục',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
