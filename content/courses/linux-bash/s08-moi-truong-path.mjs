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
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
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
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
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
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
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
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: đặt nó vào đúng file</span><span class="lc-sub">Các tình huống chấm điểm: một PATH biến mất khi qua SSH, một bí danh không chạy trong script, một file rc làm hỏng scp, và một công việc cron không tìm thấy node.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> đặt <code>export PATH=…</code> vào <code>~/.bashrc</code> rồi kết luận là nó chạy được, vì terminal của bạn có đọc file đó. Rồi một công việc cron, một unit systemd hay lệnh <code>ssh host 'cmd'</code> hỏng với "command not found" — cả ba đều bỏ qua <code>~/.bashrc</code> hoàn toàn. Trong khi đó, một terminal trên máy để bàn thì đọc nó, một lần đăng nhập SSH thì đọc <code>~/.profile</code> mà file này thường source nó, còn một script thì chẳng đọc gì: ba môi trường, ba kết quả, từ một thiết lập duy nhất. Hãy đặt môi trường vào profile, và với mọi thứ chạy tự động thì đừng dựa vào file shell chút nào — hãy khai báo nó ngay trong crontab, trong file unit, hoặc trong chính script.</div>
<p class="note-ct"><strong>Hai dòng trả lời được mọi biến thể của câu hỏi này:</strong> <code>shopt -q login_shell &amp;&amp; echo đăng nhập</code> và <code>[[ \$- == *i* ]] &amp;&amp; echo tương tác</code>. Hãy chạy chúng trong đúng cái ngữ cảnh đang cư xử lạ — một terminal, một lệnh <code>ssh host 'cmd'</code>, một công việc cron ghi ra file — và cái bảng quyết định ở trên lập tức nói cho bạn biết ngữ cảnh đó đã đọc file nào, và do đó thiết lập của bạn cần nằm ở đâu.</p>
</div>
`,
    },
  ],
};
