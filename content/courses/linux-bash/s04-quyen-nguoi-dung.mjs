/**
 * Linux & Bash — Chương 4: Quyền, người dùng & sudo.
 * Mô hình rwx · chmod/chown/umask · bit đặc biệt + ACL · người dùng và nhóm · sudo · chẩn đoán · quiz.
 * Output CHẠY THẬT Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * Nâng cấp 28/09/2026: bài 4.0 slide (deck lx-04, 32 slide) + slide/🧪/🗂/📌 trong 4.1–4.5; đào sâu: luồng kiểm quyền
 * của nhân (4.1), umask 0002 do pam_umask + bẫy 033 + bảng cờ (4.2), ACL setfacl/getfacl + mask (4.3), cờ useradd/usermod,
 * dựng lại -G và nhóm cũ, đọc luật sudoers (4.4), ba mã lỗi EACCES/EPERM/EROFS (4.5); "Chạy thử từng bước" và
 * "macOS/Fedora/WSL khác gì" mỗi bài; quiz 10 câu. Sửa chỗ SAI cũ: chmod 775 KHÔNG gỡ setgid của thư mục trên GNU,
 * journalctl -u sudo → _COMM=sudo, mount | grep ' ro,' → '(ro,', danh sách setuid thiếu chfn.
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Flinux-bash%2Flearn&reflabel=Linux%20%26%20Bash';

export default {
  title: 'Chapter 4 — Permissions, users & sudo|||Chương 4 — Quyền, người dùng & sudo',
  description: 'rwx, chmod, chown, umask, nhóm — và vì sao "Permission denied" thường không phải chuyện thiếu quyền trên chính cái file đó. Chương này kết thúc bằng một quy trình chẩn đoán để bạn đọc ra nguyên nhân thay vì vớ lấy sudo.',
  lessons: [
    /* ─────────────────────────── 4.0 ─────────────────────────── */
    {
      title: '4.0 — Chapter 4 slides: permissions, users and sudo in pictures|||4.0 — Slide Chương 4: quyền, người dùng và sudo bằng hình',
      slug: 'lnx-4-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 32 slide của Chương 4: lưới rwx và hệ tám, luồng kiểm quyền của nhân, rwx trên thư mục, chmod/umask/chown, setuid/setgid/bit dính, ACL, passwd/group/sudoers, và quy trình chẩn đoán “Permission denied” — output thật trên Ubuntu, Fedora và macOS.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Slides</span>
<h2>The whole chapter in 32 slides</h2>
<p class="lead">Permissions are easier to see than to read about. These slides draw the ten characters of <code>ls -l</code> as a grid of bits, the kernel's decision "owner, else group, else other" as a flow, the umask as a mask that clears bits, and the walk along a path where one closed directory breaks everything behind it.</p>
<p>Slides 3–7 belong to Lesson 4.1, 8–12 to 4.2 (chmod, umask, chown, SSH keys), 13–18 to 4.3 (setuid, setgid, sticky bit, ACLs, auditing), 19–24 to 4.4 (accounts, groups, sudo, sudoers) and 25–28 to 4.5 (the diagnosis procedure, error numbers, macOS and Fedora). The last four are the common mistakes, a two-page cheat sheet and a 40-minute practice session. Every terminal is real output recorded on 28/09/2026 in an Ubuntu 24.04 container, on a Fedora 44 machine and on a Mac M1; commands that change users or system files were run only inside throwaway containers. The slides are in Vietnamese; the diagrams and code read the same in any language.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Slide</span>
<h2>Cả chương trong 32 slide</h2>
<p class="lead">Quyền thì NHÌN dễ hơn ĐỌC. Bộ slide này vẽ mười ký tự của <code>ls -l</code> thành một lưới bit, vẽ phép quyết định của nhân "chủ, không thì nhóm, không nữa thì khác" thành một luồng, vẽ umask thành một mặt nạ xoá bit, và vẽ cuộc đi dọc một đường dẫn nơi chỉ một thư mục đóng cửa là hỏng hết phía sau.</p>
<p>Slide 3–7 thuộc Bài 4.1, 8–12 thuộc 4.2 (chmod, umask, chown, khoá SSH), 13–18 thuộc 4.3 (setuid, setgid, bit dính, ACL, rà soát), 19–24 thuộc 4.4 (tài khoản, nhóm, sudo, sudoers) và 25–28 thuộc 4.5 (quy trình chẩn đoán, mã lỗi, macOS và Fedora). Bốn slide cuối là những sai lầm hay gặp, bảng tra nhanh hai trang và một buổi thực hành 40 phút. Mọi terminal là output THẬT, ghi ngày 28/09/2026 trong container Ubuntu 24.04, trên máy Fedora 44 và trên Mac M1; những lệnh đổi người dùng hay file hệ thống chỉ được chạy bên trong container vứt đi. Hãy lướt bộ này trước khi vào bài, rồi quay lại sau bài kiểm tra như một tờ ôn tập.</p>
</div>
${gallery('lx-04', [
  [1, 'Bìa'], [2, 'Bản đồ chương'], [3, 'Mười ký tự và hệ tám'],
  [4, 'Nhân chọn một lớp'], [5, 'rwx trên thư mục'], [6, 'Xoá file là sửa thư mục'],
  [7, 'namei -l chỉ ra chỗ gãy'], [8, 'chmod ký hiệu và hệ tám'], [9, 'chmod -R 755 và chữ X hoa'],
  [10, 'umask là mặt nạ'], [11, 'chown và chgrp'], [12, 'Quyền của khoá SSH'],
  [13, 'setuid và passwd'], [14, 'setgid trên thư mục'], [15, 'Bit dính'],
  [16, 's/S, t/T và chữ số thứ tư'], [17, 'ACL: setfacl/getfacl'], [18, 'Rà file setuid, capability'],
  [19, '/etc/passwd 7 trường'], [20, 'Nhóm chính và nhóm phụ'], [21, 'usermod -aG'],
  [22, 'Nhóm mới và shell cũ'], [23, 'sudo và su'], [24, 'sudoers và visudo'],
  [25, 'Chẩn đoán 6 bước'], [26, 'Thử bằng đúng danh tính, đọc errno'], [27, 'Chỉ-đọc, bất biến, noexec'],
  [28, 'macOS và Fedora'], [29, 'Sai lầm hay gặp'], [30, 'Bảng tra nhanh (1/2)'],
  [31, 'Bảng tra nhanh (2/2)'], [32, 'Thực hành chương 4'],
])}
`,
    },

    /* ─────────────────────────── 4.1 ─────────────────────────── */
    {
      title: '4.1 — The permission model, and what rwx means on a directory|||4.1 — Mô hình quyền, và rwx nghĩa là gì trên một thư mục',
      slug: 'lnx-4-1-mo-hinh-quyen',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Ba lớp người dùng và ba quyền, cách đọc mười ký tự của ls -l, và điểm quan trọng nhất chương: rwx trên THƯ MỤC mang nghĩa hoàn toàn khác trên file.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>The permission model</h2>
<p class="lead">Linux permissions are simpler than their reputation: three classes of user, three permissions each, nine bits total. What makes them <em>feel</em> complicated is that <code>r</code>, <code>w</code> and <code>x</code> mean something completely different on a directory than on a file — and almost nobody is taught that explicitly. That one fact explains most "Permission denied" errors that make no sense.</p>

<h3>Reading the ten characters</h3>
${slide('lx-04', 3, 'Mười ký tự: 1 loại + 3 lớp rwx, mỗi lớp một chữ số hệ tám')}
<pre><code class="language-bash">ls -l deploy.sh</code></pre>
<div class="out">-rwxr-xr--  1 deploy  developers  2048 Aug 22 10:14 deploy.sh</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">-</span><span class="lz-lnote">Type. <code>-</code> regular file · <code>d</code> directory · <code>l</code> symlink · <code>c</code>/<code>b</code> device · <code>s</code> socket · <code>p</code> pipe.</span></div>
  <div class="lz-layer"><span class="lz-lname">rwx</span><span class="lz-lnote"><strong>User</strong> — the owner, here <code>deploy</code>. Read, write, execute: all three.</span></div>
  <div class="lz-layer"><span class="lz-lname">r-x</span><span class="lz-lnote"><strong>Group</strong> — members of <code>developers</code>. Read and execute, but not write.</span></div>
  <div class="lz-layer"><span class="lz-lname">r--</span><span class="lz-lnote"><strong>Other</strong> — everyone else on the system. Read only.</span></div>
</div>

<div class="callout"><strong>Only one class applies to you</strong>, and the kernel picks it in this order: if you are the owner, the <em>user</em> bits decide — full stop. Otherwise, if you are in the group, the <em>group</em> bits decide. Otherwise <em>other</em>. This is why a file can be <code>r--rwxrwx</code> and its own owner still cannot write to it: being the owner means the user bits apply, and they say read-only. The permissions are not cumulative and the most permissive class does not win.</div>

<h3>How the kernel picks your class — and what root skips</h3>
${slide('lx-04', 4, 'Nhân chỉ chọn MỘT lớp — lớp khớp đầu tiên, không cộng dồn')}
<p>Every <code>open()</code>, every program start and every step through a directory goes through the same short decision. The kernel never looks at your user <em>name</em>; it looks at the process's <strong>effective UID</strong> (EUID — the identity the process is currently acting as) and its list of groups:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">EUID = 0?</span><span class="lz-d">Root. Read and write checks are skipped completely. One exception: to <em>execute</em> a regular file, at least one of its three x bits must be set, even for root.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">EUID = the file's owner UID?</span><span class="lz-d">Use the owner triplet, and stop. Even if it says <code>r--</code> and the other two say <code>rwx</code>.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">File's GID in the process's groups?</span><span class="lz-d">Primary or supplementary group — either counts. Use the group triplet, and stop.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Otherwise</span><span class="lz-d">Use the "other" triplet.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Is the needed bit there?</span><span class="lz-d">Yes → allowed. No → <code>EACCES</code>, which your shell prints as <em>Permission denied</em>.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># as an ordinary user: owner of a file that is r--rwxrwx</span>
echo hi &gt; note.txt &amp;&amp; chmod 477 note.txt
echo more &gt;&gt; note.txt

<span class="tok-comment"># as root: a script with no x bit at all, then with x for the owner only</span>
chmod 644 nx.sh; ./nx.sh; echo "exit=$?"
chmod 744 nx.sh; ./nx.sh</code></pre>
<div class="out">bash: note.txt: Permission denied
bash: ./nx.sh: Permission denied
exit=126
chay</div>
<p>The first line is the "no accumulation" rule in action: <code>an</code> owns the file, so only <code>r--</code> is consulted. The root lines show the single place where root still obeys the bits: with no <code>x</code> anywhere, even root gets exit code 126; with <code>x</code> for the owner only (who is not root), root may run it. Everything else — reading a <code>000</code> file, writing into someone's <code>700</code> home — root does without asking. That is exactly why "it works with sudo" proves nothing about permissions (Lesson 4.5).</p>

<h3>What rwx means on a FILE</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>r</code> read</span><span class="v">Open and read the contents. <code>cat</code>, <code>less</code>, <code>cp</code> as the source.</span></div>
  <div class="kv"><span class="k"><code>w</code> write</span><span class="v">Modify the contents. Note: <strong>not</strong> permission to delete or rename it — that is controlled by the directory.</span></div>
  <div class="kv"><span class="k"><code>x</code> execute</span><span class="v">Run it as a program. A shell script also needs <code>r</code> (the interpreter must read it); a compiled binary needs only <code>x</code>.</span></div>
</div>

<h3>What rwx means on a DIRECTORY — the part that matters</h3>
${slide('lx-04', 5, 'Trên thư mục, rwx là quyền trên danh sách tên')}
<p>A directory is a file whose contents are a list of names mapped to inode numbers (Lesson 2.4). Permissions apply to <em>that list</em>, which produces three meanings you would never guess:</p>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">r on a directory</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">List the names inside</span><span class="lz-nsub"><code>ls</code> works. But you learn only the NAMES — reading each entry's details needs x as well.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">x on a directory</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Traverse — enter, and reach things inside</span><span class="lz-nsub">Called the "search" bit. Needed by <code>cd</code>, and by ANY access to a path that passes through this directory. This is the one people forget.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">w on a directory</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Create, delete and rename entries</span><span class="lz-nsub">Deleting a file requires w on its DIRECTORY, not on the file. A read-only file in a writable directory can be deleted.</span></div></div>
  </div>
</div>

<pre><code class="language-bash">ls -ld secret/
<span class="tok-comment"># d--x------  can enter, cannot list</span>
cd secret/          <span class="tok-comment"># works — x is enough</span>
ls                  <span class="tok-comment"># FAILS — needs r</span>
cat secret/key.txt  <span class="tok-comment"># works IF you already know the name</span></code></pre>
<div class="out">ls: cannot open directory '.': Permission denied
hunter2</div>
<div class="callout ok">A directory with <code>x</code> but not <code>r</code> is a real technique, not a curiosity: it is how <code>/home</code> is often configured. You can reach <code>/home/you</code>, but you cannot enumerate who else has an account. Web servers use the same trick for upload directories — files are servable by exact URL, but the directory cannot be browsed.</div>

<h3>The consequence that surprises everyone</h3>
${slide('lx-04', 6, 'Xoá file là sửa THƯ MỤC')}
<pre><code class="language-bash">ls -l notes.txt
<span class="tok-comment"># -r--r--r--  root root  notes.txt   ← owned by root, read-only</span>
ls -ld .
<span class="tok-comment"># drwxrwxrwx  you  you   .           ← YOUR directory, writable</span>

rm notes.txt</code></pre>
<div class="out">rm: remove write-protected regular file 'notes.txt'? y
$ ls notes.txt
ls: cannot access 'notes.txt': No such file or directory</div>
<p>The file was owned by root and marked read-only, and you deleted it anyway. Deleting is not an operation on the file — it is <code>unlink()</code>, which removes a <em>name from a directory</em> (Lesson 2.4). The permission that matters is <code>w</code> on the directory, which you have. <code>rm</code> asks for confirmation as a courtesy, and <code>rm -f</code> does not even do that.</p>
<div class="callout warn">This is why "make the config read-only so nothing can overwrite it" does not work as a safety measure. An attacker — or a careless script — with write access to the directory can delete your file and create a new one with the same name. To actually protect a file you need to restrict the <em>directory</em>, or use the immutable attribute: <code>sudo chattr +i important.conf</code>, which even root must undo deliberately with <code>-i</code>.</div>

<h3>Every component of the path is checked</h3>
${slide('lx-04', 7, 'Mọi thư mục trên đường dẫn cần x — namei -l chỉ ra chỗ gãy')}
<pre><code class="language-bash">cat /srv/app/config/db.yml</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">/</span><span class="lz-t">need x</span><span class="lz-d">Traverse the root directory. Essentially always granted.</span></div>
  <div class="lz-step"><span class="lz-k">/srv</span><span class="lz-t">need x</span><span class="lz-d">Traverse. Not r — you never listed it.</span></div>
  <div class="lz-step"><span class="lz-k">/srv/app</span><span class="lz-t">need x</span><span class="lz-d">Traverse.</span></div>
  <div class="lz-step"><span class="lz-k">/srv/app/config</span><span class="lz-t">need x</span><span class="lz-d">Traverse. If THIS one is 0750 and you are not in the group, the whole thing fails here.</span></div>
  <div class="lz-step"><span class="lz-k">db.yml</span><span class="lz-t">need r</span><span class="lz-d">Only now do the file's own permissions matter.</span></div>
</div>
<p>Five checks, and the error message for all five is the same three words. That is why "Permission denied" on a file you can see perfectly well is so common: the failure is usually a directory partway up the path, not the file at the end. Lesson 4.5 turns this into a diagnostic procedure — and <code>namei -l /srv/app/config/db.yml</code> prints the permissions of every component in one shot.</p>

<h3>Numbers: the octal shorthand</h3>
<p>Each class is three bits, so each class is one octal digit:</p>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>r</code> = 4</span><span class="v">read</span></div>
  <div class="kv"><span class="k"><code>w</code> = 2</span><span class="v">write</span></div>
  <div class="kv"><span class="k"><code>x</code> = 1</span><span class="v">execute</span></div>
</div>
<pre><code>rwx = 4+2+1 = 7        r-x = 4+0+1 = 5        r-- = 4+0+0 = 4
rw- = 4+2+0 = 6        -wx = 0+2+1 = 3        --- = 0</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>644</code></span><span class="v"><code>rw-r--r--</code> — the normal file. Owner edits, everyone reads.</span></div>
  <div class="kv"><span class="k"><code>755</code></span><span class="v"><code>rwxr-xr-x</code> — a script or a directory. Owner does everything, others run/enter and read.</span></div>
  <div class="kv"><span class="k"><code>600</code></span><span class="v"><code>rw-------</code> — private. SSH keys, <code>.env</code> files, anything with a secret in it.</span></div>
  <div class="kv"><span class="k"><code>700</code></span><span class="v"><code>rwx------</code> — a private directory. <code>~/.ssh</code> must be exactly this.</span></div>
  <div class="kv"><span class="k"><code>664</code> / <code>775</code></span><span class="v">The same as 644/755 but with group write — for a directory a team shares.</span></div>
</div>
<div class="callout">You will see <code>777</code> suggested on the internet as a fix for permission problems. It is never the fix. It grants every user on the machine write access, and on a shared or internet-facing host that is a genuine vulnerability — one that also masks the real cause, so the actual bug stays. Lesson 4.5 is the alternative.</div>

<h3>Run it step by step</h3>
<p>Ten commands in the course sandbox, as your normal user. Predict each output before you press Enter.</p>
<pre><code class="language-bash">mkdir -p ~/thu-linux/ch4 &amp;&amp; cd ~/thu-linux/ch4
echo 'echo deploy OK' &gt; deploy.sh &amp;&amp; chmod 754 deploy.sh
ls -l deploy.sh
stat -c '%A %a %U:%G %n' deploy.sh
echo hi &gt; note.txt &amp;&amp; chmod 477 note.txt
echo more &gt;&gt; note.txt
mkdir secret &amp;&amp; echo hunter2 &gt; secret/key.txt &amp;&amp; chmod 100 secret
ls secret
cat secret/key.txt
chmod 755 secret</code></pre>
<div class="out">-rwxr-xr-- 1 an an 15 Sep 28 09:29 deploy.sh
-rwxr-xr-- 754 an:an deploy.sh
bash: note.txt: Permission denied
ls: cannot open directory 'secret': Permission denied
hunter2</div>
<p>Reading it: <code>stat -c</code> prints the same mode as letters and as the number you would type into <code>chmod</code> (7 = 4+2+1, 5 = 4+1, 4 = 4); the owner could not append to his own <code>r--rwxrwx</code> file; and a directory with only <code>x</code> refused <code>ls</code> but handed over a file whose name you already knew. The last line restores <code>secret</code> so you can delete the sandbox later. (Output recorded 28/09/2026 in an Ubuntu 24.04 container as user <code>an</code>.)</p>

<h3>On macOS, Fedora and WSL: what is different</h3>
<table>
<tr><th>Thing</th><th>Ubuntu 24.04</th><th>Fedora 44</th><th>macOS (BSD tools)</th></tr>
<tr><td>Mark after the mode</td><td>none</td><td><code>.</code> = has an SELinux label: <code>-rwsr-xr-x.</code></td><td><code>@</code> = extended attributes, <code>+</code> = ACL: <code>drwxr-x---+ /Users/admin</code></td></tr>
<tr><td>Octal mode</td><td><code>stat -c '%a' f</code></td><td>same (GNU)</td><td><code>stat -f '%Lp' f</code> → <code>750</code></td></tr>
<tr><td>A new home directory</td><td><code>drwxr-x---</code> (750, <code>HOME_MODE 0750</code>)</td><td><code>drwx------</code> (700)</td><td><code>drwxr-x---+</code> (750 + an ACL)</td></tr>
<tr><td><code>namei</code></td><td>yes (util-linux)</td><td>yes</td><td>not installed — walk the path with <code>ls -ld</code> on each parent</td></tr>
</table>
<p><strong>WSL:</strong> files in your Linux home (<code>~</code>) behave exactly as on Ubuntu. Files under <code>/mnt/c</code> are Windows files: without the <code>metadata</code> mount option (off by default), WSL computes the bits from your <em>Windows</em> permissions and shows the same value for user, group and other, and <code>chmod</code> has almost no effect — removing every write bit only sets the Windows "Read-only" attribute (Microsoft, "File Permissions for WSL"). That is why a teammate's <code>chmod +x deploy.sh</code> on <code>/mnt/c/…</code> "does nothing": keep projects inside the Linux filesystem.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> after a deploy, nginx on your group's VPS answers 403 for <code>/srv/app/config/db.yml</code>, while <code>ls -l</code> says the file is <code>-rw-r--r--</code>. Rebuild the scene in a throwaway container and find the broken door without changing the file.</p><ol>
<li><code>docker run --rm -it --name lx04-u ubuntu:24.04 bash</code>, then <code>useradd -m an</code>.</li>
<li><code>mkdir -p /srv/app/config &amp;&amp; echo 'db: prod' &gt; /srv/app/config/db.yml &amp;&amp; chown -R an:an /srv/app &amp;&amp; chmod 750 /srv/app</code>.</li>
<li>Try <code>su -s /bin/bash www-data -c 'cat /srv/app/config/db.yml'</code>, then run <code>namei -l /srv/app/config/db.yml</code> and name the component where the walk stops and the class (owner/group/other) that <code>www-data</code> falls into there.</li>
<li>Fix it by changing <em>one</em> directory, not the file, and run the same <code>su</code> command again.</li></ol>
<p><strong>Done when:</strong> the first <code>cat</code> printed <code>Permission denied</code>, <code>namei -l</code> showed <code>drwxr-x--- an an app</code>, and after your one change (for example <code>chmod o+x /srv/app</code>) the same command printed <code>db: prod</code> while <code>db.yml</code> is still <code>644</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Permission bits (mode)</span><span class="v">The nine r/w/x flags of a file, three for each class, stored in its inode.</span></div>
  <div class="kv"><span class="k">Owner / group / other</span><span class="v">The three classes; the kernel uses exactly one of them for each access.</span></div>
  <div class="kv"><span class="k">Octal notation</span><span class="v">Writing each class as one digit, r=4 w=2 x=1: <code>rwxr-x---</code> is <code>750</code>.</span></div>
  <div class="kv"><span class="k">Effective UID (EUID)</span><span class="v">The identity a process is acting as right now; what permission checks compare.</span></div>
  <div class="kv"><span class="k">Traverse (search) bit</span><span class="v">The <code>x</code> on a directory: permission to pass through it to reach names inside.</span></div>
  <div class="kv"><span class="k">unlink</span><span class="v">The system call behind <code>rm</code>: it removes a name from a directory, so it needs <code>w</code> on the directory.</span></div>
  <div class="kv"><span class="k">EACCES</span><span class="v">The error number (13) behind "Permission denied": a permission bit said no.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Ten characters: one type letter plus three triplets; each triplet is one octal digit (r=4, w=2, x=1).</li>
<li>The kernel picks exactly one class — owner, else group, else other — and permissions never add up.</li>
<li>Root skips read and write checks; to execute, a file still needs at least one x bit.</li>
<li>On a directory, r lists names, w creates/deletes/renames entries, x lets you pass through.</li>
<li>Deleting is an edit of the directory, so a read-only file in a writable directory can be deleted.</li>
<li>Every directory on the path needs x; <code>namei -l</code> shows the one that is blocking.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/man7/path_resolution.7.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">path_resolution(7) — how the kernel walks a path</span><span class="lc-sub">The authoritative description of the per-component <code>x</code> check. Short, and it makes the whole model click.</span></span>
</a>
<a class="link-card" href="https://www.gnu.org/software/coreutils/manual/html_node/Mode-Structure.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Coreutils — Mode Structure</span><span class="lc-sub">GNU's own explanation of the permission bits, including how they differ on directories and what the special bits do.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: read a permission line</span><span class="lc-sub">Graded exercises that give you an <code>ls -l</code> output and a user, and ask what that user can actually do.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> assuming permissions accumulate. If a file is <code>rw-r-----</code> owned by <code>root:developers</code> and you are root <em>and</em> in <code>developers</code>, only the <strong>user</strong> bits apply, because owner matches first. Being in a group with more access changes nothing once the owner class has matched. The same logic makes <code>chmod o+r</code> useless for a group member, and it is why "but I added myself to the group" so often fails to fix anything.</div>
<p class="note-ct"><strong>The single sentence to remember from this lesson:</strong> <code>x</code> on a directory means "you may pass through", and every directory in the path needs it. Once that is in your head, the confusing half of Linux permissions disappears — and <code>namei -l &lt;path&gt;</code> becomes the first command you run whenever access is refused.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Mô hình quyền</h2>
<p class="lead">Quyền trên Linux đơn giản hơn tiếng tăm của nó: ba lớp người dùng, mỗi lớp ba quyền, tổng cộng chín bit. Thứ làm nó <em>CÓ CẢM GIÁC</em> rắc rối là <code>r</code>, <code>w</code> và <code>x</code> mang nghĩa hoàn toàn khác trên một THƯ MỤC so với trên một file — và gần như không ai được dạy điều đó một cách tường minh. Chỉ một sự thật ấy giải thích phần lớn những lỗi "Permission denied" trông chẳng có lý gì.</p>

<h3>Đọc mười ký tự</h3>
${slide('lx-04', 3, 'Mười ký tự: 1 loại + 3 lớp rwx, mỗi lớp một chữ số hệ tám')}
<pre><code class="language-bash">ls -l deploy.sh</code></pre>
<div class="out">-rwxr-xr--  1 deploy  developers  2048 Aug 22 10:14 deploy.sh</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">-</span><span class="lz-lnote">Loại. <code>-</code> file thường · <code>d</code> thư mục · <code>l</code> liên kết tượng trưng · <code>c</code>/<code>b</code> thiết bị · <code>s</code> socket · <code>p</code> ống.</span></div>
  <div class="lz-layer"><span class="lz-lname">rwx</span><span class="lz-lnote"><strong>User</strong> — chủ sở hữu, ở đây là <code>deploy</code>. Đọc, ghi, chạy: đủ cả ba.</span></div>
  <div class="lz-layer"><span class="lz-lname">r-x</span><span class="lz-lnote"><strong>Group</strong> — thành viên nhóm <code>developers</code>. Đọc và chạy, nhưng không ghi.</span></div>
  <div class="lz-layer"><span class="lz-lname">r--</span><span class="lz-lnote"><strong>Other</strong> — mọi người còn lại trên hệ thống. Chỉ đọc.</span></div>
</div>

<div class="callout"><strong>Chỉ đúng MỘT lớp áp dụng cho bạn</strong>, và nhân chọn lớp đó theo thứ tự này: nếu bạn là chủ sở hữu, các bit <em>user</em> quyết định — hết chuyện. Nếu không, nếu bạn thuộc nhóm đó, các bit <em>group</em> quyết định. Nếu không nữa thì <em>other</em>. Đó là lý do một file có thể mang <code>r--rwxrwx</code> mà chính chủ của nó vẫn không ghi được: là chủ nghĩa là các bit user áp dụng, và chúng nói chỉ-đọc. Quyền KHÔNG cộng dồn, và lớp rộng rãi nhất KHÔNG thắng.</div>

<h3>Nhân chọn lớp cho bạn thế nào — và root được bỏ qua những gì</h3>
${slide('lx-04', 4, 'Nhân chỉ chọn MỘT lớp — lớp khớp đầu tiên, không cộng dồn')}
<p>Mỗi lần <code>open()</code>, mỗi lần khởi chạy một chương trình và mỗi bước đi xuyên qua một thư mục đều đi qua cùng một phép quyết định ngắn. Nhân không bao giờ nhìn <em>TÊN</em> người dùng; nó nhìn <strong>UID hiệu lực</strong> (effective UID — EUID, danh tính mà tiến trình đang mang để hành động) và danh sách nhóm của tiến trình:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">EUID = 0?</span><span class="lz-d">Root. Phép kiểm đọc và ghi bị bỏ qua hoàn toàn. Một ngoại lệ: muốn <em>CHẠY</em> một file thường thì ít nhất một trong ba bit x phải bật, kể cả với root.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">EUID = UID chủ file?</span><span class="lz-d">Dùng bộ ba của CHỦ, và dừng. Kể cả khi nó ghi <code>r--</code> còn hai bộ kia ghi <code>rwx</code>.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">GID của file nằm trong nhóm của tiến trình?</span><span class="lz-d">Nhóm chính hay nhóm phụ đều tính. Dùng bộ ba của NHÓM, và dừng.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Còn lại</span><span class="lz-d">Dùng bộ ba "khác" (other).</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Có đúng bit cần không?</span><span class="lz-d">Có → cho phép. Không → <code>EACCES</code>, thứ shell in ra thành <em>Permission denied</em>.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># người dùng thường: làm chủ một file mang r--rwxrwx</span>
echo hi &gt; note.txt &amp;&amp; chmod 477 note.txt
echo more &gt;&gt; note.txt

<span class="tok-comment"># root: một script không có bit x nào, rồi có x chỉ cho chủ</span>
chmod 644 nx.sh; ./nx.sh; echo "exit=$?"
chmod 744 nx.sh; ./nx.sh</code></pre>
<div class="out">bash: note.txt: Permission denied
bash: ./nx.sh: Permission denied
exit=126
chay</div>
<p>Dòng đầu là luật "không cộng dồn" đang chạy: <code>an</code> là chủ file, nên chỉ <code>r--</code> được xét. Các dòng của root cho thấy chỗ DUY NHẤT root còn nghe lời các bit: không có <code>x</code> ở đâu cả thì root cũng nhận mã thoát 126; có <code>x</code> chỉ cho chủ (mà chủ đâu phải root) thì root vẫn chạy được. Mọi thứ khác — đọc một file <code>000</code>, ghi vào thư mục nhà <code>700</code> của người khác — root làm mà không cần hỏi. Đó chính là lý do "chạy bằng sudo thì được" chẳng chứng minh được gì về quyền (Bài 4.5).</p>

<h3>rwx nghĩa là gì trên một FILE</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>r</code> đọc</span><span class="v">Mở ra và đọc nội dung. <code>cat</code>, <code>less</code>, <code>cp</code> ở vai nguồn.</span></div>
  <div class="kv"><span class="k"><code>w</code> ghi</span><span class="v">Sửa nội dung. Lưu ý: <strong>KHÔNG</strong> phải quyền xoá hay đổi tên nó — thứ đó do thư mục quyết định.</span></div>
  <div class="kv"><span class="k"><code>x</code> chạy</span><span class="v">Chạy nó như một chương trình. Một script shell còn cần thêm <code>r</code> (trình thông dịch phải đọc được nó); một chương trình đã biên dịch thì chỉ cần <code>x</code>.</span></div>
</div>

<h3>rwx nghĩa là gì trên một THƯ MỤC — phần quan trọng</h3>
${slide('lx-04', 5, 'Trên thư mục, rwx là quyền trên danh sách tên')}
<p>Một thư mục là một file mà nội dung của nó là danh sách các tên ánh xạ tới số inode (Bài 2.4). Quyền áp dụng lên <em>CHÍNH DANH SÁCH ĐÓ</em>, và điều đó sinh ra ba ý nghĩa mà bạn sẽ không bao giờ đoán ra:</p>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">r trên thư mục</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Liệt kê các tên bên trong</span><span class="lz-nsub"><code>ls</code> chạy được. Nhưng bạn chỉ biết được các TÊN — muốn đọc chi tiết từng mục thì còn cần cả x.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">x trên thư mục</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Đi xuyên qua — bước vào, và với tới thứ bên trong</span><span class="lz-nsub">Gọi là bit "tìm kiếm". Cần cho <code>cd</code>, và cho BẤT KỲ truy cập nào tới một đường dẫn đi ngang qua thư mục này. Đây là cái người ta hay quên.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">w trên thư mục</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Tạo, xoá và đổi tên các mục</span><span class="lz-nsub">Xoá một file cần w trên THƯ MỤC của nó, không phải trên file. Một file chỉ-đọc nằm trong thư mục ghi được thì vẫn xoá được.</span></div></div>
  </div>
</div>

<pre><code class="language-bash">ls -ld secret/
<span class="tok-comment"># d--x------  vào được, không liệt kê được</span>
cd secret/          <span class="tok-comment"># chạy được — chỉ x là đủ</span>
ls                  <span class="tok-comment"># HỎNG — cần r</span>
cat secret/key.txt  <span class="tok-comment"># chạy được NẾU bạn đã biết sẵn cái tên</span></code></pre>
<div class="out">ls: cannot open directory '.': Permission denied
hunter2</div>
<div class="callout ok">Một thư mục có <code>x</code> mà không có <code>r</code> là một kỹ thuật thật sự, không phải chuyện lạ: đó là cách <code>/home</code> thường được cấu hình. Bạn với tới được <code>/home/ban</code>, nhưng không liệt kê ra được còn ai khác có tài khoản. Máy chủ web dùng đúng mẹo đó cho thư mục tải lên — file phục vụ được nếu biết chính xác URL, nhưng thư mục thì không duyệt được.</div>

<h3>Hệ quả làm ai cũng bất ngờ</h3>
${slide('lx-04', 6, 'Xoá file là sửa THƯ MỤC')}
<pre><code class="language-bash">ls -l notes.txt
<span class="tok-comment"># -r--r--r--  root root  notes.txt   ← root sở hữu, chỉ đọc</span>
ls -ld .
<span class="tok-comment"># drwxrwxrwx  you  you   .           ← thư mục CỦA BẠN, ghi được</span>

rm notes.txt</code></pre>
<div class="out">rm: remove write-protected regular file 'notes.txt'? y
$ ls notes.txt
ls: cannot access 'notes.txt': No such file or directory</div>
<p>File thuộc về root và được đánh dấu chỉ-đọc, vậy mà bạn vẫn xoá được. Xoá KHÔNG phải là một thao tác lên file — nó là <code>unlink()</code>, thứ gỡ một <em>CÁI TÊN KHỎI MỘT THƯ MỤC</em> (Bài 2.4). Quyền có ý nghĩa ở đây là <code>w</code> trên thư mục, mà bạn thì có. <code>rm</code> hỏi lại cho lịch sự, còn <code>rm -f</code> thì thậm chí không hỏi.</p>
<div class="callout warn">Đây là lý do cách "đặt file cấu hình thành chỉ-đọc để không gì ghi đè được" KHÔNG có tác dụng như một chốt an toàn. Một kẻ tấn công — hay một script bất cẩn — có quyền ghi vào thư mục thì xoá file của bạn rồi tạo file mới cùng tên. Muốn thật sự bảo vệ một file, bạn phải siết <em>THƯ MỤC</em>, hoặc dùng thuộc tính bất biến: <code>sudo chattr +i important.conf</code>, thứ mà ngay cả root cũng phải cố ý gỡ bằng <code>-i</code>.</div>

<h3>Mọi thành phần của đường dẫn đều bị kiểm</h3>
${slide('lx-04', 7, 'Mọi thư mục trên đường dẫn cần x — namei -l chỉ ra chỗ gãy')}
<pre><code class="language-bash">cat /srv/app/config/db.yml</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">/</span><span class="lz-t">cần x</span><span class="lz-d">Đi xuyên qua thư mục gốc. Về cơ bản luôn được cấp.</span></div>
  <div class="lz-step"><span class="lz-k">/srv</span><span class="lz-t">cần x</span><span class="lz-d">Đi xuyên qua. Không cần r — bạn có liệt kê nó đâu.</span></div>
  <div class="lz-step"><span class="lz-k">/srv/app</span><span class="lz-t">cần x</span><span class="lz-d">Đi xuyên qua.</span></div>
  <div class="lz-step"><span class="lz-k">/srv/app/config</span><span class="lz-t">cần x</span><span class="lz-d">Đi xuyên qua. Nếu CÁI NÀY là 0750 và bạn không ở trong nhóm đó, cả lệnh chết ngay tại đây.</span></div>
  <div class="lz-step"><span class="lz-k">db.yml</span><span class="lz-t">cần r</span><span class="lz-d">Tới lúc này quyền của chính file mới có ý nghĩa.</span></div>
</div>
<p>Năm phép kiểm, và thông báo lỗi cho cả năm đều là đúng ba chữ giống hệt nhau. Đó là lý do "Permission denied" trên một file mà bạn nhìn thấy rõ ràng lại phổ biến đến thế: chỗ hỏng thường là một thư mục nằm lưng chừng đường dẫn, không phải cái file ở cuối. Bài 4.5 biến chuyện này thành một quy trình chẩn đoán — và <code>namei -l /srv/app/config/db.yml</code> in ra quyền của mọi thành phần chỉ trong một lần.</p>

<h3>Con số: cách viết tắt bằng hệ tám</h3>
<p>Mỗi lớp là ba bit, nên mỗi lớp là một chữ số hệ tám:</p>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>r</code> = 4</span><span class="v">đọc</span></div>
  <div class="kv"><span class="k"><code>w</code> = 2</span><span class="v">ghi</span></div>
  <div class="kv"><span class="k"><code>x</code> = 1</span><span class="v">chạy</span></div>
</div>
<pre><code>rwx = 4+2+1 = 7        r-x = 4+0+1 = 5        r-- = 4+0+0 = 4
rw- = 4+2+0 = 6        -wx = 0+2+1 = 3        --- = 0</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>644</code></span><span class="v"><code>rw-r--r--</code> — file bình thường. Chủ sửa, mọi người đọc.</span></div>
  <div class="kv"><span class="k"><code>755</code></span><span class="v"><code>rwxr-xr-x</code> — một script hoặc một thư mục. Chủ làm mọi thứ, người khác chạy/bước vào và đọc.</span></div>
  <div class="kv"><span class="k"><code>600</code></span><span class="v"><code>rw-------</code> — riêng tư. Khoá SSH, file <code>.env</code>, mọi thứ có bí mật bên trong.</span></div>
  <div class="kv"><span class="k"><code>700</code></span><span class="v"><code>rwx------</code> — thư mục riêng tư. <code>~/.ssh</code> BẮT BUỘC phải đúng số này.</span></div>
  <div class="kv"><span class="k"><code>664</code> / <code>775</code></span><span class="v">Giống 644/755 nhưng cho nhóm ghi — dành cho thư mục mà cả đội dùng chung.</span></div>
</div>
<div class="callout">Bạn sẽ thấy trên mạng người ta gợi ý <code>777</code> như cách chữa lỗi quyền. Nó KHÔNG BAO GIỜ là cách chữa. Nó cấp quyền ghi cho mọi người dùng trên máy, và trên một máy dùng chung hay một máy hướng ra Internet thì đó là một lỗ hổng thật sự — lại còn che mất nguyên nhân thật, nên cái lỗi gốc vẫn nằm nguyên đó. Bài 4.5 là con đường thay thế.</div>

<h3>Chạy thử từng bước</h3>
<p>Mười lệnh trong sân tập của khoá, bằng người dùng thường của bạn. Đoán trước output của từng lệnh rồi mới bấm Enter.</p>
<pre><code class="language-bash">mkdir -p ~/thu-linux/ch4 &amp;&amp; cd ~/thu-linux/ch4
echo 'echo deploy OK' &gt; deploy.sh &amp;&amp; chmod 754 deploy.sh
ls -l deploy.sh
stat -c '%A %a %U:%G %n' deploy.sh
echo hi &gt; note.txt &amp;&amp; chmod 477 note.txt
echo more &gt;&gt; note.txt
mkdir secret &amp;&amp; echo hunter2 &gt; secret/key.txt &amp;&amp; chmod 100 secret
ls secret
cat secret/key.txt
chmod 755 secret</code></pre>
<div class="out">-rwxr-xr-- 1 an an 15 Sep 28 09:29 deploy.sh
-rwxr-xr-- 754 an:an deploy.sh
bash: note.txt: Permission denied
ls: cannot open directory 'secret': Permission denied
hunter2</div>
<p>Đọc kết quả: <code>stat -c</code> in cùng một chế độ ở dạng chữ và ở dạng con số bạn sẽ gõ vào <code>chmod</code> (7 = 4+2+1, 5 = 4+1, 4 = 4); chính chủ không ghi thêm được vào file <code>r--rwxrwx</code> của mình; và một thư mục chỉ có <code>x</code> thì từ chối <code>ls</code> nhưng vẫn đưa ra file mà bạn đã biết sẵn tên. Dòng cuối trả <code>secret</code> về như cũ để sau này bạn xoá được sân tập. (Output ghi ngày 28/09/2026 trong container Ubuntu 24.04, người dùng <code>an</code>.)</p>

<h3>Trên macOS, Fedora và WSL khác gì</h3>
<table>
<tr><th>Thứ</th><th>Ubuntu 24.04</th><th>Fedora 44</th><th>macOS (công cụ BSD)</th></tr>
<tr><td>Ký hiệu sau cột quyền</td><td>không có</td><td><code>.</code> = có nhãn SELinux: <code>-rwsr-xr-x.</code></td><td><code>@</code> = thuộc tính mở rộng, <code>+</code> = ACL: <code>drwxr-x---+ /Users/admin</code></td></tr>
<tr><td>Chế độ hệ tám</td><td><code>stat -c '%a' f</code></td><td>như Ubuntu (GNU)</td><td><code>stat -f '%Lp' f</code> → <code>750</code></td></tr>
<tr><td>Thư mục nhà mới tạo</td><td><code>drwxr-x---</code> (750, <code>HOME_MODE 0750</code>)</td><td><code>drwx------</code> (700)</td><td><code>drwxr-x---+</code> (750 + một ACL)</td></tr>
<tr><td><code>namei</code></td><td>có (util-linux)</td><td>có</td><td>không có — đi dọc đường dẫn bằng <code>ls -ld</code> trên từng thư mục cha</td></tr>
</table>
<p><strong>WSL:</strong> file trong thư mục nhà Linux (<code>~</code>) hành xử y như trên Ubuntu. File dưới <code>/mnt/c</code> là file của Windows: khi chưa bật tuỳ chọn gắn <code>metadata</code> (mặc định là tắt), WSL tính các bit từ quyền <em>WINDOWS</em> của bạn và hiện CÙNG một giá trị cho chủ, nhóm và khác, còn <code>chmod</code> gần như không có tác dụng — bỏ hết bit ghi thì chỉ bật thuộc tính "Read-only" của Windows (Microsoft, "File Permissions for WSL"). Đó là lý do bạn cùng nhóm gõ <code>chmod +x deploy.sh</code> trên <code>/mnt/c/…</code> mà "chẳng có gì xảy ra": hãy để dự án bên trong hệ thống file Linux.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> sau một lần deploy, nginx trên VPS của nhóm trả 403 cho <code>/srv/app/config/db.yml</code>, trong khi <code>ls -l</code> nói file là <code>-rw-r--r--</code>. Dựng lại hiện trường trong một container vứt đi và tìm ra "cánh cửa" hỏng mà không đụng vào cái file.</p><ol>
<li><code>docker run --rm -it --name lx04-u ubuntu:24.04 bash</code>, rồi <code>useradd -m an</code>.</li>
<li><code>mkdir -p /srv/app/config &amp;&amp; echo 'db: prod' &gt; /srv/app/config/db.yml &amp;&amp; chown -R an:an /srv/app &amp;&amp; chmod 750 /srv/app</code>.</li>
<li>Thử <code>su -s /bin/bash www-data -c 'cat /srv/app/config/db.yml'</code>, rồi chạy <code>namei -l /srv/app/config/db.yml</code> và gọi tên thành phần mà cuộc đi dừng lại, cùng lớp (chủ/nhóm/khác) mà <code>www-data</code> rơi vào ở đó.</li>
<li>Sửa bằng cách đổi <em>MỘT</em> thư mục, không đổi file, rồi chạy lại đúng lệnh <code>su</code> đó.</li></ol>
<p><strong>Đạt khi:</strong> lệnh <code>cat</code> đầu tiên in <code>Permission denied</code>, <code>namei -l</code> hiện <code>drwxr-x--- an an app</code>, và sau MỘT thay đổi của bạn (ví dụ <code>chmod o+x /srv/app</code>) cùng lệnh đó in ra <code>db: prod</code> trong khi <code>db.yml</code> vẫn là <code>644</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Permission bits / mode (bit quyền / chế độ)</span><span class="v">Chín cờ r/w/x của một file, ba cho mỗi lớp, cất trong inode của nó.</span></div>
  <div class="kv"><span class="k">Owner / group / other (chủ / nhóm / khác)</span><span class="v">Ba lớp người dùng; mỗi lần truy cập nhân chỉ dùng đúng một lớp.</span></div>
  <div class="kv"><span class="k">Octal notation (cách viết hệ tám)</span><span class="v">Viết mỗi lớp thành một chữ số, r=4 w=2 x=1: <code>rwxr-x---</code> là <code>750</code>.</span></div>
  <div class="kv"><span class="k">Effective UID — EUID (UID hiệu lực)</span><span class="v">Danh tính mà tiến trình đang mang để hành động; phép kiểm quyền so sánh đúng con số này.</span></div>
  <div class="kv"><span class="k">Traverse / search bit (bit đi xuyên qua)</span><span class="v">Chữ <code>x</code> trên thư mục: quyền đi ngang qua nó để với tới các tên bên trong.</span></div>
  <div class="kv"><span class="k">unlink (gỡ liên kết)</span><span class="v">Lời gọi hệ thống đứng sau <code>rm</code>: gỡ một tên khỏi thư mục, nên cần <code>w</code> trên THƯ MỤC.</span></div>
  <div class="kv"><span class="k">EACCES (mã lỗi 13)</span><span class="v">Con số lỗi đứng sau câu "Permission denied": một bit quyền đã nói không.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mười ký tự: một chữ chỉ loại cộng ba bộ ba; mỗi bộ ba là một chữ số hệ tám (r=4, w=2, x=1).</li>
<li>Nhân chọn đúng một lớp — chủ, không thì nhóm, không nữa thì khác — và quyền không bao giờ cộng dồn.</li>
<li>Root bỏ qua phép kiểm đọc và ghi; muốn chạy, file vẫn cần ít nhất một bit x.</li>
<li>Trên thư mục: r liệt kê tên, w tạo/xoá/đổi tên mục, x cho đi xuyên qua.</li>
<li>Xoá là sửa thư mục, nên một file chỉ-đọc nằm trong thư mục ghi được vẫn bị xoá được.</li>
<li>Mọi thư mục trên đường dẫn cần x; <code>namei -l</code> chỉ ra đúng cái đang chặn.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/man7/path_resolution.7.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">path_resolution(7) — nhân đi qua một đường dẫn ra sao</span><span class="lc-sub">Mô tả chính thống về phép kiểm <code>x</code> trên từng thành phần. Ngắn, và nó làm cả mô hình bật ra trong đầu.</span></span>
</a>
<a class="link-card" href="https://www.gnu.org/software/coreutils/manual/html_node/Mode-Structure.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Coreutils — Mode Structure</span><span class="lc-sub">Lời giải thích của chính GNU về các bit quyền, gồm cả chỗ chúng khác nhau trên thư mục và các bit đặc biệt làm gì.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: đọc một dòng quyền</span><span class="lc-sub">Bài chấm điểm đưa cho bạn một output <code>ls -l</code> và một người dùng, rồi hỏi người đó thật sự làm được gì.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> tưởng rằng quyền cộng dồn. Nếu một file là <code>rw-r-----</code> thuộc <code>root:developers</code> và bạn vừa là root <em>VỪA</em> ở trong nhóm <code>developers</code>, chỉ các bit <strong>user</strong> áp dụng, vì lớp chủ sở hữu khớp trước. Việc bạn ở trong một nhóm có nhiều quyền hơn chẳng thay đổi gì một khi lớp chủ sở hữu đã khớp. Cùng logic đó làm <code>chmod o+r</code> trở nên vô ích với một thành viên nhóm, và đó là lý do câu "nhưng tôi đã thêm mình vào nhóm rồi mà" lại thường không sửa được gì cả.</div>
<p class="note-ct"><strong>Một câu duy nhất cần nhớ từ bài này:</strong> <code>x</code> trên một thư mục nghĩa là "bạn được phép đi xuyên qua", và MỌI thư mục trên đường dẫn đều cần nó. Khi câu đó nằm sẵn trong đầu, nửa rắc rối của hệ thống quyền Linux biến mất — và <code>namei -l &lt;đường-dẫn&gt;</code> trở thành lệnh đầu tiên bạn chạy mỗi khi bị từ chối truy cập.</p>
</div>
`,
    },
    /* ─────────────────────────── 4.2 ─────────────────────────── */
    {
      title: '4.2 — chmod, chown and umask: changing what you found|||4.2 — chmod, chown và umask: đổi thứ bạn vừa đọc ra',
      slug: 'lnx-4-2-chmod-chown-umask',
      type: 'LESSON',
      description: 'Hai cú pháp của chmod và khi nào dùng cái nào, chmod -R với cái bẫy làm file dữ liệu thành file chạy được, chown/chgrp, và umask quyết định quyền của MỌI file mới bạn tạo ra.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>Changing what you found</h2>
<p class="lead">Three commands cover almost all permission work: <code>chmod</code> changes the bits, <code>chown</code> changes who owns them, and <code>umask</code> decides what every <em>new</em> file gets before you touch it. The third is the one nobody configures and everyone eventually trips over.</p>

<h3>chmod: two syntaxes for the same nine bits</h3>
${slide('lx-04', 8, 'chmod: ký hiệu chỉnh vài bit, hệ tám đặt lại cả 9 bit')}
<pre><code class="language-bash"><span class="tok-comment"># Octal — sets ALL nine bits at once, absolutely</span>
chmod 644 notes.txt
chmod 755 deploy.sh
chmod 600 ~/.ssh/id_ed25519

<span class="tok-comment"># Symbolic — adjusts SOME bits, relative to what is there</span>
chmod +x deploy.sh            <span class="tok-comment"># add execute for everyone (subject to umask)</span>
chmod u+x deploy.sh           <span class="tok-comment"># add execute for the owner only</span>
chmod g-w shared.txt          <span class="tok-comment"># remove group write</span>
chmod o= secret.txt           <span class="tok-comment"># set "other" to NOTHING</span>
chmod a+r public.txt          <span class="tok-comment"># a = all three classes</span>
chmod u=rw,g=r,o= config.yml  <span class="tok-comment"># several clauses at once</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Use octal when</span><span class="v">You know exactly what the final state should be. <code>chmod 600 key</code> is unambiguous no matter what the file was before — which is exactly what you want for a secret.</span></div>
  <div class="kv"><span class="k">Use symbolic when</span><span class="v">You want to change one thing and leave the rest alone. <code>chmod +x</code> on a script does not disturb whatever read permissions were already set.</span></div>
</div>
<div class="callout">The classes are <code>u</code> (user/owner), <code>g</code> (group), <code>o</code> (other) and <code>a</code> (all). The operators are <code>+</code> add, <code>-</code> remove, and <code>=</code> set exactly — <code>=</code> is the one to reach for when you want to clear bits you may not know about. There is also <code>chmod --reference=other.txt file</code>, which copies another file's mode; handy when one file in a directory is right and the rest are not.</div>

<h3>The recursive trap</h3>
${slide('lx-04', 9, 'chmod -R 755 và chữ X hoa')}
<pre><code class="language-bash">chmod -R 755 /srv/app        <span class="tok-comment"># WRONG — every .env, .jpg and .json is now executable</span></code></pre>
<p><code>-R</code> applies the same mode to files and directories alike, but directories need <code>x</code> and data files must not have it. The correct form uses the capital <code>X</code>, which means "execute, but <strong>only</strong> for directories and for files that already have some execute bit":</p>
<pre><code class="language-bash">chmod -R u=rwX,go=rX /srv/app      <span class="tok-comment"># directories get x, plain files do not</span>

<span class="tok-comment"># Or split it explicitly with find</span>
find /srv/app -type d -exec chmod 755 {} +
find /srv/app -type f -exec chmod 644 {} +</code></pre>
<div class="out">$ ls -l /srv/app
drwxr-xr-x  config
-rw-r--r--  package.json
-rwxr-xr-x  deploy.sh</div>
<div class="callout ok">Capital <code>X</code> is one of the highest-value details in this chapter. It preserves the executable bit on scripts that already had it, adds traversal to every directory, and leaves data files alone — in a single command that is safe to re-run.</div>
<div class="callout warn"><strong>…but only if you run it BEFORE the damage.</strong> <code>X</code> decides by looking at whether a file <em>already</em> has an execute bit. After a <code>chmod -R 755</code>, every file has one, so <code>chmod -R u=rwX,go=rX</code> keeps them all executable. And <code>go=rX</code> also <em>opens</em> things: a <code>.env</code> that was <code>600</code> becomes <code>644</code>. Rebuilt in a sandbox tree (<code>.env</code> 600, <code>config/</code> 700, <code>deploy.sh</code> 755):</div>
<pre><code class="language-bash">chmod -R 755 . ; chmod -R u=rwX,go=rX . ; find . -printf '%M %p\\n' | sort -k2
find . -type f -exec chmod 644 {} + ; chmod +x deploy.sh ; chmod 600 .env</code></pre>
<div class="out">-rwxr-xr-x ./.env
drwxr-xr-x ./config
-rwxr-xr-x ./deploy.sh
-rwxr-xr-x ./package.json</div>
<p>The repair after the fact is the explicit <code>find -type f</code> reset, then putting back by hand the few things that really must differ: the script's <code>x</code>, the secret's <code>600</code>. That is why the note at the end of this lesson says to list what a recursive change will touch <em>before</em> running it.</p>

<h3>chown and chgrp: who owns it</h3>
${slide('lx-04', 11, 'Đổi chủ cần root; đổi nhóm chỉ sang nhóm mình đang ở')}
<pre><code class="language-bash">sudo chown deploy file.txt              <span class="tok-comment"># change owner</span>
sudo chown deploy:developers file.txt   <span class="tok-comment"># owner AND group</span>
sudo chown :developers file.txt         <span class="tok-comment"># group only (note the colon)</span>
sudo chgrp developers file.txt          <span class="tok-comment"># same thing, dedicated command</span>
sudo chown -R deploy:deploy /srv/app    <span class="tok-comment"># the whole tree</span>
sudo chown --reference=other.txt f.txt  <span class="tok-comment"># copy another file's ownership</span></code></pre>
<div class="callout warn">Changing the owner <strong>requires root</strong>, always — even to give your own file away. That is deliberate: on a system with disk quotas, being able to hand a file to another user would let you dump your storage onto their account. Changing the <em>group</em> is allowed without root, but only to a group you belong to. So <code>chgrp developers f</code> works if you are in <code>developers</code>, and fails otherwise.</div>

<h3>umask: the permissions of files you have not created yet</h3>
${slide('lx-04', 10, 'umask là mặt nạ gỡ bit, không phải phép trừ')}
<pre><code>umask</code></pre>
<div class="out">0022</div>
<p><code>umask</code> is a <em>mask</em>: it lists the bits to <strong>remove</strong> from the default. Programs ask for 666 when creating a file and 777 when creating a directory; the kernel subtracts the umask:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Request</span><span class="lz-t">666 for a file · 777 for a directory</span><span class="lz-d">No program ever asks for the execute bit on a plain file — that is why new files are never executable.</span></div>
  <div class="lz-step"><span class="lz-k">Mask</span><span class="lz-t">umask 022 = remove w from group and other</span><span class="lz-d">The bits in the mask are cleared, not subtracted arithmetically.</span></div>
  <div class="lz-step"><span class="lz-k">Result</span><span class="lz-t">644 for files · 755 for directories</span><span class="lz-d">Which is why every file you create looks like that, on every Linux machine, without you configuring anything.</span></div>
</div>
<pre><code>umask 022      <span class="tok-comment"># default: 644 / 755 — others can read</span>
umask 077      <span class="tok-comment"># private: 600 / 700 — nobody else sees anything</span>
umask 002      <span class="tok-comment"># team: 664 / 775 — the GROUP can write</span>
umask -S       <span class="tok-comment"># show it in symbolic form instead</span></code></pre>
<div class="out">u=rwx,g=rx,o=rx</div>
<div class="callout"><code>umask</code> is a property of the <em>process</em>, inherited by its children, so setting it in a terminal affects only that terminal. To make it permanent, put it in <code>~/.bashrc</code> (Chapter 8). To make it apply to a service, set it in the systemd unit (<code>UMask=0027</code>) — a script that inherits the wrong umask silently creates world-readable files, and nothing will warn you.</div>

<h3>Why your umask may say 0002, not 0022</h3>
<p>Run <code>umask</code> after logging in to an Ubuntu 24.04 server and you will very likely see <code>0002</code>, not the <code>0022</code> printed above. Nothing is broken. Ubuntu's PAM stack loads <code>pam_umask</code> with the <code>usergroups</code> behaviour (<code>USERGROUPS_ENAB yes</code> in <code>/etc/login.defs</code>): when a user is not root and the username equals the primary group name — the default "user private group" that <code>useradd</code> creates — the group bits of the mask are made equal to the owner bits, so <code>022</code> becomes <code>002</code>.</p>
<pre><code class="language-bash">su - an -c umask                  <span class="tok-comment"># a login through PAM, like SSH</span>
su - -c umask                     <span class="tok-comment"># root, same machine, same PAM</span>
docker exec -u an lx04-u bash -c umask   <span class="tok-comment"># no PAM at all</span></code></pre>
<div class="out">0002
0022
0022</div>
<p>Three answers on one machine: root is excluded from <code>usergroups</code>, and <code>docker exec</code> starts the shell without PAM, so it keeps the image default. umask is inherited from whatever started the process. On Fedora 44 (<code>linux-nha</code>) the login umask is <code>0022</code>; systemd services get <code>0022</code> unless the unit sets <code>UMask=</code>. So never assume — print <code>umask</code> in the context that creates the files, and set it explicitly in scripts and units that care.</p>
<div class="callout warn"><strong>The mask clears bits; it does not subtract.</strong> With <code>umask 033</code> the arithmetic guess "666 − 033 = 633" is wrong: a file asks for <code>rw-rw-rw-</code>, the mask <code>---wx-wx</code> can only clear the <code>w</code> bits that exist, and the result is <code>644</code> (a directory: 777 → <code>744</code>). Tested: <code>(umask 033; touch f; mkdir d)</code> gives <code>644 f</code> and <code>744 d</code>.</div>
<div class="callout"><strong><code>+x</code> and <code>a+x</code> are not the same.</strong> When the "who" letter is left out, chmod applies the umask to the change: under <code>umask 077</code>, <code>chmod +x p</code> gives <code>-rwx------</code>, while <code>chmod a+x p</code> gives <code>-rwx--x--x</code>. Write <code>u+x</code> or <code>a+x</code> when it matters.</div>

<h3>Where this bites in practice</h3>
${slide('lx-04', 12, 'SSH bỏ qua khoá riêng mà người khác đọc được')}
<pre><code class="language-bash">ssh vps
<span class="tok-comment"># Permissions 0644 for '/home/you/.ssh/id_ed25519' are too open.</span>
<span class="tok-comment"># It is required that your private key files are NOT accessible by others.</span>
<span class="tok-comment"># This private key will be ignored.</span>

chmod 600 ~/.ssh/id_ed25519
chmod 700 ~/.ssh
chmod 644 ~/.ssh/id_ed25519.pub
chmod 600 ~/.ssh/authorized_keys</code></pre>
<p>SSH refuses to use a private key that anyone else can read, and it refuses loudly rather than falling back — which is correct, and which is the single most common permission error people meet. The numbers above are the ones SSH expects; <code>700</code> on the directory matters as much as <code>600</code> on the key.</p>
<pre><code class="language-bash"><span class="tok-comment"># A web app cannot write its upload directory</span>
sudo chown -R www-data:www-data /srv/app/uploads
sudo chmod 755 /srv/app/uploads

<span class="tok-comment"># A shared team directory where new files stay group-writable</span>
sudo chgrp developers /srv/shared
sudo chmod 2775 /srv/shared      <span class="tok-comment"># the leading 2 is setgid — Lesson 4.3</span></code></pre>

<h3>Checking without guessing</h3>
<pre><code>stat -c '%a %U:%G %n' file.txt     <span class="tok-comment"># octal mode, owner, group, name</span>
stat file.txt                      <span class="tok-comment"># everything, verbosely</span>
namei -l /srv/app/config/db.yml    <span class="tok-comment"># EVERY component of the path</span></code></pre>
<div class="out">644 deploy:developers file.txt

f: /srv/app/config/db.yml
drwxr-xr-x root   root   /
drwxr-xr-x root   root   srv
drwxr-xr-x deploy deploy app
drwx------ deploy deploy config      ← here
-rw-r--r-- deploy deploy db.yml</div>
<p><code>namei -l</code> is the command that ends permission arguments. It prints the mode and ownership of every directory on the way to the file, so the failing component is visible rather than inferred — in this case <code>config</code>, which no one but <code>deploy</code> may enter, regardless of how open <code>db.yml</code> itself looks.</p>

<h3>Flags worth knowing: chmod, chown, chgrp</h3>
<table>
<tr><th>Flag</th><th>Meaning</th><th>Example</th></tr>
<tr><td><code>-R</code></td><td>recursive — files and directories alike (see the trap above)</td><td><code>chmod -R u=rwX,go=rX dir</code></td></tr>
<tr><td><code>-v</code> / <code>-c</code></td><td>print every file / print only files that actually changed</td><td><code>chown -c alice:dev *.txt</code></td></tr>
<tr><td><code>--reference=F</code></td><td>copy the mode (chmod) or owner and group (chown) of file F</td><td><code>chmod --reference=ok.conf bad.conf</code></td></tr>
<tr><td><code>-h</code> (chown)</td><td>change the symlink itself, not what it points to</td><td><code>chown -h deploy current</code></td></tr>
<tr><td><code>user:</code> (chown)</td><td>trailing colon = also set the group to that user's login group</td><td><code>chown -R deploy: /srv/app</code></td></tr>
<tr><td><code>--preserve-root</code></td><td>refuse to recurse on <code>/</code>. <strong>Not</strong> the default for chmod/chown/chgrp (only <code>rm</code> has it on) — add it in scripts</td><td><code>chmod -R --preserve-root 755 "$DIR"</code></td></tr>
</table>
<p>Two outputs worth recognising. Changing an owner without root, or a group you are not in, fails with <code>Operation not permitted</code> — not "Permission denied": the bits are not the problem, you simply are not allowed to perform that operation (Lesson 4.5 uses the difference). And <code>chown -v</code> reports <code>changed ownership of 'bao-cao.txt' from an:developers to alice:developers</code>, which is a handy audit line in a deploy log.</p>

<pre><code class="language-bash">chmod -R --preserve-root 755 /</code></pre>
<div class="out">chmod: it is dangerous to operate recursively on '/'
chmod: use --no-preserve-root to override this failsafe</div>
<p>That guard is what saves you when a script runs <code>chmod -R 755 "$APP_DIR/"</code> with <code>APP_DIR</code> empty — the path collapses to <code>/</code>. Without the flag, GNU chmod would start walking the whole disk.</p>

<h3>Run it step by step</h3>
<p>Logged in as your normal user (on Ubuntu the login umask is <code>0002</code>, see above), in the sandbox:</p>
<pre><code class="language-bash">cd ~/thu-linux/ch4
for m in 022 077 002 027; do (umask $m; touch f$m; mkdir d$m); done
stat -c '%a %n' f0* d0* | sort -k2
id -Gn
chgrp developers f022 &amp;&amp; ls -l f022
chown root f022</code></pre>
<div class="out">775 d002
755 d022
750 d027
700 d077
664 f002
644 f022
640 f027
600 f077
an developers
-rw-r--r-- 1 an developers 0 Sep 28 09:53 f022
chown: changing ownership of 'f022': Operation not permitted</div>
<p>Each pair of lines is one mask: files never get <code>x</code>, directories do, and the mask removes the same bits from both. <code>chgrp</code> to a group you are in works without root; <code>chown</code> never does. (Ubuntu 24.04 container, user <code>an</code> in group <code>developers</code>, logged in with <code>su - an</code>.)</p>

<h3>On macOS and WSL: what is different</h3>
<table>
<tr><th>Thing</th><th>Ubuntu / WSL (Linux files)</th><th>macOS</th></tr>
<tr><td>Octal mode of a file</td><td><code>stat -c '%a' f</code></td><td><code>stat -f '%Lp' f</code> (<code>stat -c</code> → <code>illegal option</code>)</td></tr>
<tr><td><code>chmod --reference</code>, <code>-c</code>, <code>--preserve-root</code></td><td>yes (GNU)</td><td>no — BSD chmod has <code>-R</code>, <code>-v</code>, <code>-h</code> and ACL options <code>+a</code>/<code>-a</code></td></tr>
<tr><td>umask of a login shell</td><td><code>0002</code> for a normal user (pam_umask), <code>0022</code> for root</td><td><code>022</code> (zsh prints three digits)</td></tr>
<tr><td><code>chmod</code> on Windows files</td><td><code>/mnt/c/…</code>: almost no effect without <code>metadata</code></td><td>—</td></tr>
</table>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> a teammate "fixed" a permission error on the group's server with <code>chmod -R 755</code> on the project. Now the <code>.env</code> is world-readable and every image is executable. Repair it in the sandbox so that only what must differ is different.</p><ol>
<li>Build the damage: <code>mkdir -p ~/thu-linux/ch4/app3/config &amp;&amp; cd ~/thu-linux/ch4/app3 &amp;&amp; touch .env logo.png package.json &amp;&amp; printf '#!/bin/bash\\necho hi\\n' &gt; deploy.sh &amp;&amp; chmod -R 755 .</code></li>
<li>List what a repair will touch <em>before</em> doing it: <code>find . -type f -perm -u+x</code>.</li>
<li>Reset: directories <code>755</code>, files <code>644</code>, using two <code>find … -exec chmod … {} +</code> lines.</li>
<li>Put back what must differ: <code>chmod +x deploy.sh</code>, <code>chmod 600 .env</code>. Check with <code>stat -c '%a %n' .env deploy.sh logo.png config</code>.</li></ol>
<p><strong>Done when:</strong> step 2 listed all four files, and the final <code>stat</code> prints exactly <code>600 .env</code>, <code>755 deploy.sh</code>, <code>644 logo.png</code>, <code>755 config</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Symbolic mode</span><span class="v"><code>who op perm</code> — <code>u+x</code>, <code>go=rX</code>: changes some bits relative to what is there.</span></div>
  <div class="kv"><span class="k">Absolute (octal) mode</span><span class="v"><code>chmod 640</code>: sets all nine bits, whatever they were before.</span></div>
  <div class="kv"><span class="k">Capital X</span><span class="v">Execute only for directories and for files that already have some x bit.</span></div>
  <div class="kv"><span class="k">umask</span><span class="v">A per-process mask of bits to clear from every new file (666) and directory (777).</span></div>
  <div class="kv"><span class="k">User private group</span><span class="v">A group with the same name as the user, created for each account; why Ubuntu logins get umask 002.</span></div>
  <div class="kv"><span class="k">Recursive (-R)</span><span class="v">Apply to a directory and everything below it — files and directories alike.</span></div>
  <div class="kv"><span class="k">EPERM</span><span class="v">"Operation not permitted": you may not do this operation at all (for example chown without root).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Octal when you know the final state (<code>chmod 600 key</code>), symbolic when you change one thing (<code>chmod u+x</code>).</li>
<li><code>chmod -R 755</code> makes data files executable; use <code>u=rwX,go=rX</code> before damage, <code>find -type f/-type d</code> after.</li>
<li>umask clears bits from 666/777; it is not subtraction, and it is inherited per process.</li>
<li>On Ubuntu a normal login gets umask 0002 (pam_umask usergroups), root and <code>docker exec</code> get 0022 — print it, do not assume.</li>
<li>Changing the owner always needs root; changing the group works only to a group you belong to.</li>
<li>SSH ignores a private key with any group/other bit: <code>600</code> for the key, <code>700</code> for <code>~/.ssh</code>.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/man1/chmod.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">chmod(1) — including the capital X</span><span class="lc-sub">The symbolic-mode grammar in full. The paragraph on <code>X</code> is short and worth reading twice.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man2/umask.2.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">umask(2) — the system call</span><span class="lc-sub">Explains that umask is per-process and inherited, which is the part that makes service permissions behave "randomly" until you know it.</span></span>
</a>
<a class="link-card" href="https://www.ssh.com/academy/ssh/authorized-keys-openssh" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">OpenSSH — required permissions for keys</span><span class="lc-sub">The exact modes SSH insists on for <code>~/.ssh</code>, private keys and <code>authorized_keys</code>, and why it refuses rather than warns.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: fix a broken permission set</span><span class="lc-sub">Graded tasks: an app tree with wrong modes and ownership, to be repaired with <code>chmod -R …X</code>, <code>find -type</code> and <code>chown</code>.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> <code>chmod -R 777</code> as a fix. It appears to work, which is the problem — the app starts, so the real cause is never found, and you have granted every user and every process on the machine write access to your application. On a server running anything internet-facing, that turns one bug into a way in. Use <code>namei -l</code> to find the component that is actually failing, then change that one thing. If you genuinely need shared write access, the answer is a group plus setgid (Lesson 4.3), never <code>777</code>.</div>
<p class="note-ct"><strong>Two habits:</strong> use <code>stat -c '%a %U:%G %n'</code> instead of squinting at <code>ls -l</code> — the octal number is what you type into <code>chmod</code>, so reading it in the same form removes a translation step. And before any recursive <code>chmod</code> or <code>chown</code>, run the same command with <code>find … -print</code> to see the list; recursive permission changes are as irreversible as <code>rm</code>, and far quieter about it.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Đổi thứ bạn vừa đọc ra</h2>
<p class="lead">Ba lệnh bao gần hết công việc về quyền: <code>chmod</code> đổi các bit, <code>chown</code> đổi người sở hữu chúng, và <code>umask</code> quyết định mọi file <em>MỚI</em> nhận được gì trước cả khi bạn đụng vào. Cái thứ ba là thứ chẳng ai cấu hình và ai rồi cũng vấp.</p>

<h3>chmod: hai cú pháp cho cùng chín bit</h3>
${slide('lx-04', 8, 'chmod: ký hiệu chỉnh vài bit, hệ tám đặt lại cả 9 bit')}
<pre><code class="language-bash"><span class="tok-comment"># Hệ tám — đặt CẢ chín bit một lượt, một cách tuyệt đối</span>
chmod 644 notes.txt
chmod 755 deploy.sh
chmod 600 ~/.ssh/id_ed25519

<span class="tok-comment"># Ký hiệu — chỉnh MỘT SỐ bit, tương đối với thứ đang có</span>
chmod +x deploy.sh            <span class="tok-comment"># thêm quyền chạy cho tất cả (còn tuỳ umask)</span>
chmod u+x deploy.sh           <span class="tok-comment"># chỉ thêm quyền chạy cho chủ sở hữu</span>
chmod g-w shared.txt          <span class="tok-comment"># bỏ quyền ghi của nhóm</span>
chmod o= secret.txt           <span class="tok-comment"># đặt "other" thành KHÔNG CÓ GÌ</span>
chmod a+r public.txt          <span class="tok-comment"># a = cả ba lớp</span>
chmod u=rw,g=r,o= config.yml  <span class="tok-comment"># nhiều mệnh đề một lượt</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Dùng hệ tám khi</span><span class="v">Bạn biết chính xác trạng thái cuối cùng phải là gì. <code>chmod 600 key</code> không mập mờ dù trước đó file mang quyền gì — và đó đúng là thứ bạn muốn với một file bí mật.</span></div>
  <div class="kv"><span class="k">Dùng ký hiệu khi</span><span class="v">Bạn muốn đổi đúng một thứ và để yên phần còn lại. <code>chmod +x</code> trên một script không đụng tới các quyền đọc đã được đặt sẵn.</span></div>
</div>
<div class="callout">Các lớp là <code>u</code> (user/chủ sở hữu), <code>g</code> (group), <code>o</code> (other) và <code>a</code> (tất cả). Các toán tử là <code>+</code> thêm, <code>-</code> bỏ, và <code>=</code> đặt đúng bằng — <code>=</code> là thứ nên với tay lấy khi bạn muốn xoá sạch những bit mà mình có thể không biết là đang có. Còn có <code>chmod --reference=other.txt file</code>, chép nguyên chế độ của một file khác; tiện khi một file trong thư mục đã đúng còn số còn lại thì chưa.</div>

<h3>Cái bẫy của -R</h3>
${slide('lx-04', 9, 'chmod -R 755 và chữ X hoa')}
<pre><code class="language-bash">chmod -R 755 /srv/app        <span class="tok-comment"># SAI — mọi file .env, .jpg và .json giờ đều chạy được</span></code></pre>
<p><code>-R</code> áp cùng một chế độ lên cả file lẫn thư mục, nhưng thư mục thì CẦN <code>x</code> còn file dữ liệu thì KHÔNG ĐƯỢC có. Dạng đúng dùng chữ <code>X</code> viết hoa, nghĩa là "quyền chạy, nhưng <strong>CHỈ</strong> cho thư mục và cho những file vốn đã có sẵn một bit chạy nào đó":</p>
<pre><code class="language-bash">chmod -R u=rwX,go=rX /srv/app      <span class="tok-comment"># thư mục được x, file thường thì không</span>

<span class="tok-comment"># Hoặc tách tường minh bằng find</span>
find /srv/app -type d -exec chmod 755 {} +
find /srv/app -type f -exec chmod 644 {} +</code></pre>
<div class="out">$ ls -l /srv/app
drwxr-xr-x  config
-rw-r--r--  package.json
-rwxr-xr-x  deploy.sh</div>
<div class="callout ok">Chữ <code>X</code> viết hoa là một trong những chi tiết giá trị nhất của chương này. Nó giữ nguyên bit chạy trên những script vốn đã có, thêm quyền đi xuyên qua cho mọi thư mục, và để yên file dữ liệu — gói trong một lệnh duy nhất mà chạy lại bao nhiêu lần cũng an toàn.</div>
<div class="callout warn"><strong>…nhưng CHỈ khi bạn chạy nó TRƯỚC khi lỡ tay.</strong> <code>X</code> quyết định bằng cách nhìn xem file <em>ĐÃ</em> có bit chạy chưa. Sau một lần <code>chmod -R 755</code>, file nào cũng có, nên <code>chmod -R u=rwX,go=rX</code> giữ nguyên tất cả ở trạng thái chạy được. Và <code>go=rX</code> còn <em>MỞ</em> thêm: một <code>.env</code> đang <code>600</code> thành <code>644</code>. Dựng lại trong một cây ở sân tập (<code>.env</code> 600, <code>config/</code> 700, <code>deploy.sh</code> 755):</div>
<pre><code class="language-bash">chmod -R 755 . ; chmod -R u=rwX,go=rX . ; find . -printf '%M %p\\n' | sort -k2
find . -type f -exec chmod 644 {} + ; chmod +x deploy.sh ; chmod 600 .env</code></pre>
<div class="out">-rwxr-xr-x ./.env
drwxr-xr-x ./config
-rwxr-xr-x ./deploy.sh
-rwxr-xr-x ./package.json</div>
<p>Cách chữa sau khi đã lỡ là đặt lại tường minh bằng <code>find -type f</code>, rồi trả lại bằng tay đúng mấy thứ thật sự phải khác: bit <code>x</code> của script, số <code>600</code> của file bí mật. Đó là lý do lời dặn cuối bài bảo bạn liệt kê những gì một lệnh đệ quy sẽ đụng tới <em>TRƯỚC</em> khi chạy nó.</p>

<h3>chown và chgrp: ai sở hữu nó</h3>
${slide('lx-04', 11, 'Đổi chủ cần root; đổi nhóm chỉ sang nhóm mình đang ở')}
<pre><code class="language-bash">sudo chown deploy file.txt              <span class="tok-comment"># đổi chủ sở hữu</span>
sudo chown deploy:developers file.txt   <span class="tok-comment"># chủ sở hữu VÀ nhóm</span>
sudo chown :developers file.txt         <span class="tok-comment"># chỉ nhóm (để ý dấu hai chấm)</span>
sudo chgrp developers file.txt          <span class="tok-comment"># y hệt, bằng lệnh riêng</span>
sudo chown -R deploy:deploy /srv/app    <span class="tok-comment"># cả cây thư mục</span>
sudo chown --reference=other.txt f.txt  <span class="tok-comment"># chép quyền sở hữu của file khác</span></code></pre>
<div class="callout warn">Đổi chủ sở hữu <strong>BẮT BUỘC cần root</strong>, luôn luôn — kể cả khi bạn muốn CHO ĐI chính file của mình. Đó là chủ ý: trên một hệ thống có hạn mức đĩa, việc trao được một file cho người khác đồng nghĩa với việc bạn đổ dung lượng của mình sang tài khoản họ. Đổi <em>NHÓM</em> thì không cần root, nhưng chỉ đổi được sang một nhóm mà bạn thuộc về. Nên <code>chgrp developers f</code> chạy được nếu bạn ở trong <code>developers</code>, và hỏng nếu không.</div>

<h3>umask: quyền của những file bạn CHƯA tạo ra</h3>
${slide('lx-04', 10, 'umask là mặt nạ gỡ bit, không phải phép trừ')}
<pre><code>umask</code></pre>
<div class="out">0022</div>
<p><code>umask</code> là một <em>MẶT NẠ</em>: nó liệt kê những bit cần <strong>GỠ BỎ</strong> khỏi mặc định. Chương trình xin 666 khi tạo file và 777 khi tạo thư mục; nhân trừ đi umask:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Xin</span><span class="lz-t">666 cho file · 777 cho thư mục</span><span class="lz-d">Không chương trình nào xin bit chạy cho một file thường — đó là lý do file mới không bao giờ chạy được.</span></div>
  <div class="lz-step"><span class="lz-k">Che</span><span class="lz-t">umask 022 = gỡ w khỏi group và other</span><span class="lz-d">Các bit trong mặt nạ bị XOÁ, không phải bị trừ theo phép tính số học.</span></div>
  <div class="lz-step"><span class="lz-k">Kết quả</span><span class="lz-t">644 cho file · 755 cho thư mục</span><span class="lz-d">Và đó là lý do mọi file bạn tạo đều trông như vậy, trên mọi máy Linux, mà chẳng cần bạn cấu hình gì.</span></div>
</div>
<pre><code>umask 022      <span class="tok-comment"># mặc định: 644 / 755 — người khác đọc được</span>
umask 077      <span class="tok-comment"># riêng tư: 600 / 700 — không ai khác thấy gì</span>
umask 002      <span class="tok-comment"># cho đội: 664 / 775 — NHÓM ghi được</span>
umask -S       <span class="tok-comment"># hiện ra dưới dạng ký hiệu thay vì số</span></code></pre>
<div class="out">u=rwx,g=rx,o=rx</div>
<div class="callout"><code>umask</code> là thuộc tính của <em>TIẾN TRÌNH</em>, được các tiến trình con thừa kế, nên đặt nó trong một terminal chỉ ảnh hưởng terminal đó. Muốn nó lâu dài thì đặt vào <code>~/.bashrc</code> (Chương 8). Muốn nó áp cho một dịch vụ thì đặt trong unit của systemd (<code>UMask=0027</code>) — một script thừa kế nhầm umask sẽ âm thầm tạo ra những file cả thế giới đọc được, và sẽ không có gì cảnh báo bạn.</div>

<h3>Vì sao umask của bạn có thể là 0002 chứ không phải 0022</h3>
<p>Đăng nhập vào một máy chủ Ubuntu 24.04 rồi gõ <code>umask</code>, rất có thể bạn sẽ thấy <code>0002</code>, không phải <code>0022</code> như in ở trên. Không có gì hỏng cả. Bộ PAM của Ubuntu nạp <code>pam_umask</code> với hành vi <code>usergroups</code> (<code>USERGROUPS_ENAB yes</code> trong <code>/etc/login.defs</code>): khi người dùng không phải root và tên người dùng trùng tên nhóm chính — chính là "nhóm riêng của người dùng" (user private group) mà <code>useradd</code> tạo mặc định — các bit nhóm của mặt nạ được đặt bằng các bit của chủ, nên <code>022</code> thành <code>002</code>.</p>
<pre><code class="language-bash">su - an -c umask                  <span class="tok-comment"># đăng nhập qua PAM, giống SSH</span>
su - -c umask                     <span class="tok-comment"># root, cùng máy, cùng PAM</span>
docker exec -u an lx04-u bash -c umask   <span class="tok-comment"># hoàn toàn không qua PAM</span></code></pre>
<div class="out">0002
0022
0022</div>
<p>Ba câu trả lời trên cùng một máy: root bị loại khỏi <code>usergroups</code>, còn <code>docker exec</code> khởi chạy shell mà không qua PAM, nên giữ mặc định của ảnh. umask được thừa kế từ bất cứ thứ gì đã khởi chạy tiến trình. Trên Fedora 44 (<code>linux-nha</code>) umask lúc đăng nhập là <code>0022</code>; dịch vụ systemd nhận <code>0022</code> trừ khi unit đặt <code>UMask=</code>. Nên đừng bao giờ đoán — hãy in <code>umask</code> ngay trong ngữ cảnh đang tạo file, và đặt nó tường minh trong script hay unit nào cần.</p>
<div class="callout warn"><strong>Mặt nạ XOÁ bit, không TRỪ số.</strong> Với <code>umask 033</code>, đoán kiểu số học "666 − 033 = 633" là SAI: file xin <code>rw-rw-rw-</code>, mặt nạ <code>---wx-wx</code> chỉ xoá được những bit <code>w</code> đang có, và kết quả là <code>644</code> (thư mục: 777 → <code>744</code>). Đã thử: <code>(umask 033; touch f; mkdir d)</code> cho <code>644 f</code> và <code>744 d</code>.</div>
<div class="callout"><strong><code>+x</code> và <code>a+x</code> không giống nhau.</strong> Khi bỏ trống chữ chỉ "ai", chmod áp umask lên phép đổi: dưới <code>umask 077</code>, <code>chmod +x p</code> cho <code>-rwx------</code>, còn <code>chmod a+x p</code> cho <code>-rwx--x--x</code>. Hãy viết rõ <code>u+x</code> hay <code>a+x</code> khi chuyện đó quan trọng.</div>

<h3>Chỗ này cắn ở đâu trong thực tế</h3>
${slide('lx-04', 12, 'SSH bỏ qua khoá riêng mà người khác đọc được')}
<pre><code class="language-bash">ssh vps
<span class="tok-comment"># Permissions 0644 for '/home/you/.ssh/id_ed25519' are too open.</span>
<span class="tok-comment"># It is required that your private key files are NOT accessible by others.</span>
<span class="tok-comment"># This private key will be ignored.</span>

chmod 600 ~/.ssh/id_ed25519
chmod 700 ~/.ssh
chmod 644 ~/.ssh/id_ed25519.pub
chmod 600 ~/.ssh/authorized_keys</code></pre>
<p>SSH từ chối dùng một khoá riêng mà người khác đọc được, và nó từ chối một cách ồn ào chứ không lặng lẽ lùi về cách khác — điều đó là đúng, và đó cũng là lỗi quyền phổ biến nhất người ta gặp. Những con số ở trên là thứ SSH mong đợi; <code>700</code> trên thư mục quan trọng ngang <code>600</code> trên cái khoá.</p>
<pre><code class="language-bash"><span class="tok-comment"># Một ứng dụng web không ghi được vào thư mục tải lên của nó</span>
sudo chown -R www-data:www-data /srv/app/uploads
sudo chmod 755 /srv/app/uploads

<span class="tok-comment"># Một thư mục dùng chung cho cả đội, file mới vẫn giữ quyền ghi cho nhóm</span>
sudo chgrp developers /srv/shared
sudo chmod 2775 /srv/shared      <span class="tok-comment"># chữ số 2 đứng đầu là setgid — Bài 4.3</span></code></pre>

<h3>Kiểm tra thay vì đoán</h3>
<pre><code>stat -c '%a %U:%G %n' file.txt     <span class="tok-comment"># chế độ hệ tám, chủ, nhóm, tên</span>
stat file.txt                      <span class="tok-comment"># tất cả, một cách dài dòng</span>
namei -l /srv/app/config/db.yml    <span class="tok-comment"># MỌI thành phần của đường dẫn</span></code></pre>
<div class="out">644 deploy:developers file.txt

f: /srv/app/config/db.yml
drwxr-xr-x root   root   /
drwxr-xr-x root   root   srv
drwxr-xr-x deploy deploy app
drwx------ deploy deploy config      ← chỗ này
-rw-r--r-- deploy deploy db.yml</div>
<p><code>namei -l</code> là cái lệnh kết thúc mọi tranh cãi về quyền. Nó in ra chế độ và quyền sở hữu của mọi thư mục trên đường tới file, nên thành phần đang hỏng HIỆN RA chứ không phải để suy đoán — trong ví dụ này là <code>config</code>, thứ mà ngoài <code>deploy</code> không ai bước vào được, bất kể chính <code>db.yml</code> trông thoáng đến đâu.</p>

<h3>Những cờ đáng biết: chmod, chown, chgrp</h3>
<table>
<tr><th>Cờ</th><th>Nghĩa</th><th>Ví dụ</th></tr>
<tr><td><code>-R</code></td><td>đệ quy — file và thư mục như nhau (xem cái bẫy ở trên)</td><td><code>chmod -R u=rwX,go=rX dir</code></td></tr>
<tr><td><code>-v</code> / <code>-c</code></td><td>in mọi file / chỉ in file thật sự có đổi</td><td><code>chown -c alice:dev *.txt</code></td></tr>
<tr><td><code>--reference=F</code></td><td>chép chế độ (chmod) hoặc chủ và nhóm (chown) của file F</td><td><code>chmod --reference=ok.conf bad.conf</code></td></tr>
<tr><td><code>-h</code> (chown)</td><td>đổi chính symlink, không đổi thứ nó trỏ tới</td><td><code>chown -h deploy current</code></td></tr>
<tr><td><code>user:</code> (chown)</td><td>dấu hai chấm cuối = đặt luôn nhóm thành nhóm đăng nhập của user đó</td><td><code>chown -R deploy: /srv/app</code></td></tr>
<tr><td><code>--preserve-root</code></td><td>từ chối đệ quy trên <code>/</code>. <strong>KHÔNG</strong> phải mặc định của chmod/chown/chgrp (chỉ <code>rm</code> bật sẵn) — hãy thêm vào script</td><td><code>chmod -R --preserve-root 755 "$DIR"</code></td></tr>
</table>
<p>Hai output nên nhận ra ngay. Đổi chủ mà không phải root, hay đổi sang một nhóm mình không thuộc, hỏng với <code>Operation not permitted</code> — không phải "Permission denied": vấn đề không nằm ở các bit, mà là bạn đơn giản không được phép làm thao tác đó (Bài 4.5 dùng đúng sự khác biệt này). Còn <code>chown -v</code> báo <code>changed ownership of 'bao-cao.txt' from an:developers to alice:developers</code>, một dòng kiểm tra tiện lợi trong log deploy.</p>
<pre><code class="language-bash">chmod -R --preserve-root 755 /</code></pre>
<div class="out">chmod: it is dangerous to operate recursively on '/'
chmod: use --no-preserve-root to override this failsafe</div>
<p>Cái chốt đó cứu bạn khi một script chạy <code>chmod -R 755 "$APP_DIR/"</code> mà <code>APP_DIR</code> rỗng — đường dẫn sụp thành <code>/</code>. Không có cờ này, chmod của GNU sẽ bắt đầu đi khắp cả ổ đĩa.</p>

<h3>Chạy thử từng bước</h3>
<p>Đăng nhập bằng người dùng thường (trên Ubuntu umask lúc đăng nhập là <code>0002</code>, xem ở trên), trong sân tập:</p>
<pre><code class="language-bash">cd ~/thu-linux/ch4
for m in 022 077 002 027; do (umask $m; touch f$m; mkdir d$m); done
stat -c '%a %n' f0* d0* | sort -k2
id -Gn
chgrp developers f022 &amp;&amp; ls -l f022
chown root f022</code></pre>
<div class="out">775 d002
755 d022
750 d027
700 d077
664 f002
644 f022
640 f027
600 f077
an developers
-rw-r--r-- 1 an developers 0 Sep 28 09:53 f022
chown: changing ownership of 'f022': Operation not permitted</div>
<p>Mỗi cặp dòng là một mặt nạ: file không bao giờ có <code>x</code>, thư mục thì có, và mặt nạ gỡ cùng những bit đó khỏi cả hai. <code>chgrp</code> sang một nhóm mình đang ở thì chạy được mà không cần root; <code>chown</code> thì không bao giờ. (Container Ubuntu 24.04, người dùng <code>an</code> thuộc nhóm <code>developers</code>, đăng nhập bằng <code>su - an</code>.)</p>

<h3>Trên macOS và WSL khác gì</h3>
<table>
<tr><th>Thứ</th><th>Ubuntu / WSL (file Linux)</th><th>macOS</th></tr>
<tr><td>Chế độ hệ tám của file</td><td><code>stat -c '%a' f</code></td><td><code>stat -f '%Lp' f</code> (<code>stat -c</code> → <code>illegal option</code>)</td></tr>
<tr><td><code>chmod --reference</code>, <code>-c</code>, <code>--preserve-root</code></td><td>có (GNU)</td><td>không — chmod BSD có <code>-R</code>, <code>-v</code>, <code>-h</code> và các tuỳ chọn ACL <code>+a</code>/<code>-a</code></td></tr>
<tr><td>umask của shell đăng nhập</td><td><code>0002</code> cho người dùng thường (pam_umask), <code>0022</code> cho root</td><td><code>022</code> (zsh in ba chữ số)</td></tr>
<tr><td><code>chmod</code> trên file Windows</td><td><code>/mnt/c/…</code>: gần như vô tác dụng khi chưa bật <code>metadata</code></td><td>—</td></tr>
</table>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> một bạn cùng nhóm "chữa" lỗi quyền trên máy chủ của nhóm bằng <code>chmod -R 755</code> lên cả dự án. Giờ <code>.env</code> thì ai cũng đọc được còn mọi ảnh đều chạy được. Sửa lại trong sân tập sao cho CHỈ những thứ phải khác mới khác.</p><ol>
<li>Dựng chỗ hỏng: <code>mkdir -p ~/thu-linux/ch4/app3/config &amp;&amp; cd ~/thu-linux/ch4/app3 &amp;&amp; touch .env logo.png package.json &amp;&amp; printf '#!/bin/bash\\necho hi\\n' &gt; deploy.sh &amp;&amp; chmod -R 755 .</code></li>
<li>Liệt kê những gì lần sửa sẽ đụng tới <em>TRƯỚC</em> khi làm: <code>find . -type f -perm -u+x</code>.</li>
<li>Đặt lại: thư mục <code>755</code>, file <code>644</code>, bằng hai dòng <code>find … -exec chmod … {} +</code>.</li>
<li>Trả lại thứ phải khác: <code>chmod +x deploy.sh</code>, <code>chmod 600 .env</code>. Kiểm bằng <code>stat -c '%a %n' .env deploy.sh logo.png config</code>.</li></ol>
<p><strong>Đạt khi:</strong> bước 2 liệt kê đủ bốn file, và <code>stat</code> cuối cùng in đúng <code>600 .env</code>, <code>755 deploy.sh</code>, <code>644 logo.png</code>, <code>755 config</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Symbolic mode (chế độ ký hiệu)</span><span class="v"><code>ai phép quyền</code> — <code>u+x</code>, <code>go=rX</code>: đổi vài bit, tương đối với thứ đang có.</span></div>
  <div class="kv"><span class="k">Absolute / octal mode (chế độ tuyệt đối, hệ tám)</span><span class="v"><code>chmod 640</code>: đặt cả chín bit, bất kể trước đó ra sao.</span></div>
  <div class="kv"><span class="k">Capital X (chữ X hoa)</span><span class="v">Quyền chạy chỉ cho thư mục và cho file vốn đã có một bit x nào đó.</span></div>
  <div class="kv"><span class="k">umask (mặt nạ quyền)</span><span class="v">Mặt nạ của từng tiến trình, liệt kê các bit bị xoá khỏi mọi file (666) và thư mục (777) mới.</span></div>
  <div class="kv"><span class="k">User private group (nhóm riêng của người dùng)</span><span class="v">Nhóm trùng tên người dùng, tạo kèm mỗi tài khoản; lý do Ubuntu cho umask 002 lúc đăng nhập.</span></div>
  <div class="kv"><span class="k">Recursive -R (đệ quy)</span><span class="v">Áp lên một thư mục và mọi thứ bên dưới — file và thư mục như nhau.</span></div>
  <div class="kv"><span class="k">EPERM (mã lỗi 1)</span><span class="v">"Operation not permitted": bạn không được làm thao tác này (ví dụ chown khi không phải root).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Hệ tám khi biết trạng thái cuối (<code>chmod 600 key</code>), ký hiệu khi đổi một thứ (<code>chmod u+x</code>).</li>
<li><code>chmod -R 755</code> làm file dữ liệu chạy được; dùng <code>u=rwX,go=rX</code> trước khi lỡ, <code>find -type f/-type d</code> sau khi lỡ.</li>
<li>umask xoá bit khỏi 666/777; nó không phải phép trừ, và được thừa kế theo từng tiến trình.</li>
<li>Trên Ubuntu, đăng nhập thường nhận umask 0002 (pam_umask usergroups), root và <code>docker exec</code> nhận 0022 — hãy in ra, đừng đoán.</li>
<li>Đổi chủ luôn cần root; đổi nhóm chỉ được sang nhóm mình đang thuộc.</li>
<li>SSH bỏ qua khoá riêng có bất kỳ bit nào cho nhóm/khác: <code>600</code> cho khoá, <code>700</code> cho <code>~/.ssh</code>.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/man1/chmod.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">chmod(1) — gồm cả chữ X viết hoa</span><span class="lc-sub">Toàn bộ ngữ pháp của chế độ ký hiệu. Đoạn nói về <code>X</code> thì ngắn và đáng đọc hai lần.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man2/umask.2.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">umask(2) — lời gọi hệ thống</span><span class="lc-sub">Giải thích rằng umask thuộc về từng tiến trình và được thừa kế, và chính phần đó làm quyền của dịch vụ hành xử "ngẫu nhiên" cho tới khi bạn biết.</span></span>
</a>
<a class="link-card" href="https://www.ssh.com/academy/ssh/authorized-keys-openssh" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">OpenSSH — các quyền bắt buộc cho khoá</span><span class="lc-sub">Chính xác những chế độ SSH đòi hỏi cho <code>~/.ssh</code>, khoá riêng và <code>authorized_keys</code>, cùng lý do nó từ chối thay vì chỉ cảnh báo.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: sửa một bộ quyền đã hỏng</span><span class="lc-sub">Bài chấm điểm: một cây thư mục ứng dụng sai chế độ và sai quyền sở hữu, cần chữa bằng <code>chmod -R …X</code>, <code>find -type</code> và <code>chown</code>.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> lấy <code>chmod -R 777</code> làm cách chữa. Nó TRÔNG như chạy được, và đó mới là vấn đề — ứng dụng lên được, nên nguyên nhân thật chẳng bao giờ được tìm ra, còn bạn thì vừa cấp quyền ghi vào ứng dụng của mình cho mọi người dùng và mọi tiến trình trên máy. Trên một máy chủ chạy bất cứ thứ gì hướng ra Internet, việc đó biến một lỗi thành một lối vào. Hãy dùng <code>namei -l</code> để tìm ra thành phần thật sự đang hỏng, rồi đổi đúng một thứ đó. Nếu bạn thật sự cần quyền ghi dùng chung, câu trả lời là một nhóm cộng với setgid (Bài 4.3), không bao giờ là <code>777</code>.</div>
<p class="note-ct"><strong>Hai thói quen:</strong> dùng <code>stat -c '%a %U:%G %n'</code> thay vì nheo mắt nhìn <code>ls -l</code> — con số hệ tám chính là thứ bạn gõ vào <code>chmod</code>, nên đọc nó ở cùng một dạng sẽ bỏ được một bước phiên dịch. Và trước mọi lệnh <code>chmod</code> hay <code>chown</code> đệ quy, hãy chạy đúng lệnh đó với <code>find … -print</code> để xem danh sách; đổi quyền đệ quy thì không thể hoàn tác y như <code>rm</code>, mà lại còn im lặng hơn nhiều.</p>
</div>
`,
    },
    /* ─────────────────────────── 4.3 ─────────────────────────── */
    {
      title: '4.3 — setuid, setgid and the sticky bit|||4.3 — setuid, setgid và bit dính',
      slug: 'lnx-4-3-bit-dac-biet',
      type: 'LESSON',
      description: 'Ba bit ở chữ số thứ tư: vì sao passwd chạy được với quyền root mà vẫn an toàn, setgid làm thư mục dùng chung hoạt động, bit dính bảo vệ /tmp, và cách rà soát file setuid trên máy chủ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2>The fourth digit</h2>
<p class="lead">You have seen <code>chmod 755</code>. There is a fourth digit in front — <code>chmod 4755</code> — holding three bits that change <em>who a program runs as</em> and <em>who owns what you create</em>. They explain how an ordinary user can change their own password in a root-only file, why a shared team directory actually stays shared, and why nobody can delete your files out of <code>/tmp</code>.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">4 — setuid</span><span class="lz-lnote">On an executable: run it as the file's OWNER, not as the person who launched it. Shows as <code>s</code> in the user-execute slot.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 — setgid</span><span class="lz-lnote">On an executable: run as the file's GROUP. On a DIRECTORY: new files inherit the directory's group. The directory case is the useful one.</span></div>
  <div class="lz-layer"><span class="lz-lname">1 — sticky</span><span class="lz-lnote">On a directory: you may delete only your OWN files, even if the directory is world-writable. Shows as <code>t</code>.</span></div>
</div>

<h3>setuid: how passwd works</h3>
${slide('lx-04', 13, 'setuid: passwd chạy với EUID của chủ file')}
<pre><code class="language-bash">ls -l /usr/bin/passwd
ls -l /etc/shadow</code></pre>
<div class="out">-rwsr-xr-x 1 root root 68208 Mar 23 14:57 /usr/bin/passwd
-rw-r----- 1 root shadow 1847 Aug 22 09:31 /etc/shadow</div>
<p>Look at the two lines together. <code>/etc/shadow</code> holds password hashes and is readable only by root — as it must be. Yet any user can run <code>passwd</code> and change their own entry. The <code>s</code> in <code>-rw<strong>s</strong>r-xr-x</code> is why: when you execute that file, the kernel gives the process root's identity, because root owns the file.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">You run it</span><span class="lz-t">$ passwd</span><span class="lz-d">Your shell asks the kernel to execute /usr/bin/passwd.</span></div>
  <div class="lz-step"><span class="lz-k">Kernel sees setuid</span><span class="lz-t">effective UID := file owner (root)</span><span class="lz-d">The process now has root's privileges, though your real UID is unchanged — that is how passwd still knows WHICH account to change.</span></div>
  <div class="lz-step"><span class="lz-k">Program restricts itself</span><span class="lz-t">passwd only edits YOUR line</span><span class="lz-d">The safety is in the program's own logic, not in the permission system. This is the entire risk of setuid.</span></div>
</div>
<div class="callout warn"><strong>A setuid-root program is a security boundary written in C by a human.</strong> If it can be tricked into running arbitrary commands, reading arbitrary files, or writing where it should not, an ordinary user becomes root. That is why the list of setuid binaries on a well-run system is short, audited, and shrinking — and why you should essentially never create one. If you need a user to run one specific privileged action, use <code>sudo</code> with a narrow rule (Lesson 4.4), which is auditable and revocable; a setuid script is neither. Linux ignores the setuid bit on shell scripts entirely, precisely because making one safe is not achievable.</div>

<pre><code class="language-bash"><span class="tok-comment"># Audit every setuid binary on the machine — do this on a server you inherit</span>
find / -perm -4000 -type f 2&gt;/dev/null | sort

<span class="tok-comment"># setgid binaries too</span>
find / -perm -2000 -type f 2&gt;/dev/null | sort</code></pre>
<div class="out">/usr/bin/chfn
/usr/bin/chsh
/usr/bin/gpasswd
/usr/bin/mount
/usr/bin/newgrp
/usr/bin/passwd
/usr/bin/su
/usr/bin/sudo
/usr/bin/umount</div>
<p>That list should look roughly like this on a stock Ubuntu. Anything unexpected in it — especially in <code>/tmp</code>, <code>/home</code> or an application directory — is worth investigating, because "drop a setuid-root shell somewhere" is a classic way to keep root access after an intrusion.</p>

<h3>setgid on a directory: the one you will actually use</h3>
${slide('lx-04', 14, 'setgid trên thư mục: file mới theo nhóm của thư mục')}
<p>Normally a new file gets <em>your</em> primary group. In a shared directory that is wrong: files created by different people end up in different groups, and the team loses access to each other's work. setgid on the directory fixes it:</p>
<pre><code class="language-bash">sudo mkdir /srv/shared
sudo chgrp developers /srv/shared
sudo chmod 2775 /srv/shared        <span class="tok-comment"># 2 = setgid, 775 = rwxrwxr-x</span>
ls -ld /srv/shared</code></pre>
<div class="out">drwxrwsr-x 3 root developers 4096 Aug 22 11:02 /srv/shared</div>
<p>Note the <code>s</code> in the group-execute position. Now every file created inside inherits the group <code>developers</code> regardless of who made it, and — because setgid also propagates to new subdirectories — the whole tree keeps the behaviour without further work.</p>
<pre><code class="language-bash"><span class="tok-comment"># Verify</span>
touch /srv/shared/from-alice.txt
ls -l /srv/shared/</code></pre>
<div class="out">-rw-rw-r-- 1 alice developers 0 Aug 22 11:03 from-alice.txt</div>
<div class="callout ok">setgid handles the <em>group</em>. To also make new files group-writable you need <code>umask 002</code> in that context (Lesson 4.2), because the default <code>022</code> strips group write before setgid ever applies. The complete recipe for a shared directory is therefore: <strong>chgrp + chmod 2775 + umask 002</strong>. Missing the umask is the reason a "correctly configured" shared directory still produces read-only files for teammates.</div>

<h3>The sticky bit: how /tmp survives</h3>
${slide('lx-04', 15, 'Bit dính: ai cũng ghi, chỉ xoá được file của mình')}
<pre><code class="language-bash">ls -ld /tmp</code></pre>
<div class="out">drwxrwxrwt 10 root root 4096 Aug 22 11:10 /tmp</div>
<p><code>/tmp</code> is <code>777</code> — every user can create files there, which is the point. But recall Lesson 4.1: <code>w</code> on a directory means you may delete <em>any</em> entry in it. Without protection, any user could delete every other user's temporary files, including the socket your database is listening on.</p>
<p>The <code>t</code> at the end is the sticky bit, and it adds one rule: <strong>you may only remove or rename an entry if you own the entry, or own the directory, or are root</strong>. World-writable stays world-writable; only deletion is restricted.</p>
<pre><code class="language-bash">sudo chmod 1777 /srv/scratch        <span class="tok-comment"># 1 = sticky</span>
ls -ld /srv/scratch</code></pre>
<div class="out">drwxrwxrwt 2 root root 4096 Aug 22 11:12 /srv/scratch</div>
<div class="callout">Any directory you make world-writable should have the sticky bit — the two go together, and a <code>777</code> directory <em>without</em> it is a real vulnerability rather than a stylistic issue. If you ever type <code>chmod 777</code> on a shared directory, the number you meant was <code>1777</code>.</div>

<h3>Reading the letters</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>rws</code> in the user slot</span><span class="v">setuid AND executable. The normal case.</span></div>
  <div class="kv"><span class="k"><code>rwS</code> — capital S</span><span class="v">setuid set but <strong>not</strong> executable. Almost always a mistake: the bit does nothing without <code>x</code>.</span></div>
  <div class="kv"><span class="k"><code>rwt</code> / <code>rwT</code></span><span class="v">Same rule for the sticky bit: lowercase <code>t</code> means sticky + executable, capital <code>T</code> means sticky without <code>x</code>.</span></div>
</div>
<p>The capital-letter forms are a built-in warning. If <code>ls -l</code> shows you an <code>S</code> or a <code>T</code>, a special bit was set on something that cannot use it — usually a <code>chmod</code> typo, occasionally something more interesting.</p>

<h3>Setting and clearing them</h3>
${slide('lx-04', 16, 's/S, t/T — và chmod 775 không gỡ setgid của thư mục')}
<pre><code class="language-bash">chmod 4755 prog        <span class="tok-comment"># setuid, octal</span>
chmod u+s prog         <span class="tok-comment"># setuid, symbolic</span>
chmod 2775 dir         <span class="tok-comment"># setgid</span>
chmod g+s dir          <span class="tok-comment"># setgid, symbolic</span>
chmod 1777 dir         <span class="tok-comment"># sticky</span>
chmod +t dir           <span class="tok-comment"># sticky, symbolic</span>
chmod 0755 prog        <span class="tok-comment"># clear ALL special bits (leading 0)</span></code></pre>
<div class="callout warn"><strong>Corrected on 28/09/2026 — this box used to say the opposite for Linux.</strong> On GNU coreutils (Ubuntu, Fedora, WSL), a numeric <code>chmod</code> on a <em>directory</em> <strong>keeps</strong> its setuid and setgid bits: <code>chmod 775 /srv/shared</code>, and even <code>chmod 0775</code>, leave <code>drwxrwsr-x</code> as it was. The chmod(1) manual says so directly: "For directories chmod preserves set-user-ID and set-group-ID bits unless you explicitly specify otherwise." To clear them you need <code>g-s</code>, a double leading zero (<code>00775</code>) or <code>=775</code>. The fear is still justified in three places: on a regular <em>file</em>, <code>chmod 755</code> clears setuid/setgid immediately; the sticky bit is not preserved (<code>chmod 777</code> removes the <code>t</code> of a <code>1777</code> directory); and on <strong>macOS</strong>, <code>chmod 775</code> does clear the <code>s</code> of a directory (tested). So the habit stays the same: when a directory has special bits, write all four digits and read <code>ls -ld</code> afterwards.</div>
<pre><code class="language-bash">chmod 775 /srv/shared;   ls -ld /srv/shared
chmod 0775 /srv/shared;  ls -ld /srv/shared
chmod 00775 /srv/shared; ls -ld /srv/shared</code></pre>
<div class="out">drwxrwsr-x 3 root developers 4096 Sep 28 09:30 /srv/shared
drwxrwsr-x 3 root developers 4096 Sep 28 09:30 /srv/shared
drwxrwxr-x 3 root developers 4096 Sep 28 09:30 /srv/shared</div>

<h3>POSIX ACLs in practice: one more person, without changing owner or group</h3>
${slide('lx-04', 17, 'ACL: cấp cho đúng một người, không đổi chủ hay nhóm')}
<p>The nine bits give you exactly one owner and one group. Real life asks for more: "nginx must be able to write the uploads directory, but it belongs to <code>an</code> and should stay that way". An <strong>ACL</strong> (Access Control List) adds named entries — one user or one group each — on top of the bits. Ubuntu needs the small <code>acl</code> package for the two commands; the kernel and ext4/xfs/btrfs support it already.</p>
<pre><code class="language-bash">ls -ld uploads
su -s /bin/bash www-data -c 'touch uploads/t.txt'
setfacl -m u:www-data:rwx uploads
ls -ld uploads
getfacl -c uploads</code></pre>
<div class="out">drwxr-x--- 2 an an 4096 Sep 28 09:32 uploads
touch: cannot touch 'uploads/t.txt': Permission denied
drwxrwx---+ 2 an an 4096 Sep 28 09:32 uploads
user::rwx
user:www-data:rwx
group::r-x
mask::rwx
other::---</div>
<table>
<tr><th>Question</th><th>Permission bits</th><th>POSIX ACL</th></tr>
<tr><td>Who can get rights?</td><td>1 owner, 1 group, everyone else</td><td>any number of named users and groups</td></tr>
<tr><td>Read it with</td><td><code>ls -l</code>, <code>stat</code></td><td><code>getfacl</code> — <code>ls -l</code> only shows a <code>+</code></td></tr>
<tr><td>Change it with</td><td><code>chmod</code></td><td><code>setfacl -m</code> add/modify · <code>-x</code> remove one · <code>-b</code> remove all</td></tr>
<tr><td>New files inherit?</td><td>only the group, via setgid</td><td>yes — a <em>default</em> ACL: <code>setfacl -d -m u:www-data:rwX dir</code></td></tr>
<tr><td>The "group" column of <code>ls -l</code></td><td>the group's rights</td><td>the <strong>mask</strong> — the ceiling for every named entry and the group</td></tr>
<tr><td>Survives backup/copy?</td><td>yes, almost everywhere</td><td>only with <code>cp -a</code>, <code>tar --acls</code>, <code>rsync -A</code></td></tr>
</table>
<div class="callout warn"><strong>The mask trap.</strong> On a file with an ACL, <code>chmod</code>'s group digit changes the <em>mask</em>, not the group. Run <code>chmod 750 uploads</code> "to tidy up" and every named entry is silently capped: <code>getfacl</code> now prints <code>user:www-data:rwx	#effective:r-x</code>, and the uploads break again. With ACLs, change rights through <code>setfacl</code>, and read <code>getfacl</code>, not <code>ls -l</code>.</div>
<p>When to use which: a whole team sharing a directory → group + setgid (simpler, visible in <code>ls -l</code>). One service or one extra person who must not become a member of your group → ACL. On macOS the equivalent is <code>chmod +a "user:_www allow read" f</code> and <code>ls -le</code>, a different (NFSv4-style) ACL system with its own syntax.</p>

<h3>What these bits cannot do</h3>
${slide('lx-04', 18, 'Rà file setuid; capability là lối thay thế')}
<p>The three special bits are the whole of the classic Unix model, and it is coarse: one owner, one group, three classes. Modern systems layer more on top, and knowing the names is enough for now:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">POSIX ACLs</span><span class="v"><code>setfacl -m u:alice:rw file</code> — per-user permissions beyond the single owner/group. <code>getfacl</code> reads them; a <code>+</code> at the end of the <code>ls -l</code> mode means a file has one.</span></div>
  <div class="kv"><span class="k">Capabilities</span><span class="v"><code>setcap cap_net_bind_service=+ep /usr/bin/node</code> grants exactly one root power — here, binding to port 80 — instead of all of them. The modern replacement for setuid-root.</span></div>
  <div class="kv"><span class="k">SELinux / AppArmor</span><span class="v">Mandatory access control layered <em>above</em> the permission bits. On RHEL and Ubuntu respectively, this is why an operation is sometimes refused even when <code>ls -l</code> says it should be allowed — check <code>ausearch</code> or <code>dmesg</code>.</span></div>
</div>

<h3>Run it step by step</h3>
<p>The full shared-directory recipe, in a throwaway container as root (<code>alice</code> and <code>bob</code> both in <code>developers</code>). <code>su -</code> logs in through PAM, so each user gets Ubuntu's login umask <code>0002</code>; the last two lines repeat the test with <code>umask 022</code>.</p>
<pre><code class="language-bash">mkdir /srv/shared &amp;&amp; chgrp developers /srv/shared &amp;&amp; chmod 2775 /srv/shared
ls -ld /srv/shared
su - alice -c 'touch /srv/shared/ke-hoach.md'
su - bob -c 'echo sua-boi-bob &gt;&gt; /srv/shared/ke-hoach.md &amp;&amp; ls -l /srv/shared'
su - alice -c 'umask 022; touch /srv/shared/khoa.md'
su - bob -c 'echo x &gt;&gt; /srv/shared/khoa.md'</code></pre>
<div class="out">drwxrwsr-x 2 root developers 4096 Sep 28 09:56 /srv/shared
total 4
-rw-rw-r-- 1 alice developers 12 Sep 28 09:56 ke-hoach.md
-bash: line 1: /srv/shared/khoa.md: Permission denied</div>
<p>Setgid made both files belong to <code>developers</code>; only the umask decided whether that group could write. <code>khoa.md</code> came out <code>-rw-r--r--</code> and Bob was refused — the "correctly configured" shared directory that still produces read-only files.</p>

<h3>On macOS: what is different</h3>
<ul>
<li><strong>Setgid on directories is not needed:</strong> BSD semantics give every new file the group of its <em>directory</em>, always. Tested in a scratch folder owned by group <code>wheel</code>: a file created by <code>admin</code> (primary group <code>staff</code>) came out <code>admin wheel</code>.</li>
<li><code>chmod 775</code> on a directory <em>does</em> clear its setgid bit on macOS (unlike GNU).</li>
<li><code>sudo</code> itself is setuid there too: <code>-r-s--x--x root wheel /usr/bin/sudo</code>.</li>
<li>ACLs use <code>chmod +a</code> / <code>chmod -a</code> and are read with <code>ls -le</code>; there is no <code>getfacl</code>/<code>setfacl</code>.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> for the SWP391 project, three teammates share <code>/srv/swp391</code> on the group VPS. Last week Bob could not edit Alice's files, and someone deleted a teammate's work from the shared <code>/srv/swp391/tmp</code>. Build a layout where both problems cannot happen. Do it in a container as root.</p><ol>
<li>Create <code>alice</code>, <code>bob</code> and group <code>swp</code>; add both users to it.</li>
<li><code>/srv/swp391</code>: group <code>swp</code>, mode <code>2775</code>. <code>/srv/swp391/tmp</code>: mode <code>1777</code>.</li>
<li>As Alice (<code>su - alice</code>), create <code>/srv/swp391/bao-cao.md</code> and <code>/srv/swp391/tmp/nhap.txt</code>. As Bob, append a line to the report and try to <code>rm</code> Alice's draft.</li>
<li>Give the <code>www-data</code> user read access to <code>bao-cao.md</code> with an ACL, without touching its owner or group.</li></ol>
<p><strong>Done when:</strong> <code>ls -l</code> shows the report as <code>alice swp</code> with <code>rw-rw-</code>; Bob's append worked and his <code>rm</code> failed with <code>Operation not permitted</code>; and <code>getfacl -c /srv/swp391/bao-cao.md</code> contains <code>user:www-data:r--</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">setuid</span><span class="v">Bit 4000: a program runs with the file owner's identity as its effective UID.</span></div>
  <div class="kv"><span class="k">setgid</span><span class="v">Bit 2000: on a program, run as the file's group; on a directory, new files inherit the directory's group.</span></div>
  <div class="kv"><span class="k">Sticky bit</span><span class="v">Bit 1000 on a directory: only an entry's owner, the directory's owner or root may delete it.</span></div>
  <div class="kv"><span class="k">Real vs effective UID</span><span class="v">Who started the process vs whose rights it is using; setuid changes only the second.</span></div>
  <div class="kv"><span class="k">ACL (access control list)</span><span class="v">Extra named user/group entries on top of the nine bits; <code>getfacl</code>/<code>setfacl</code>.</span></div>
  <div class="kv"><span class="k">ACL mask</span><span class="v">The ceiling on all named ACL entries; shown in the group column of <code>ls -l</code>.</span></div>
  <div class="kv"><span class="k">Capability</span><span class="v">One slice of root's power (e.g. binding port 80) that can be given to one program.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>The fourth digit: 4 setuid, 2 setgid, 1 sticky — shown as <code>s</code>, <code>s</code>, <code>t</code> (capital when x is missing).</li>
<li>setuid gives a program its owner's rights; Linux ignores it on scripts; audit with <code>find / -xdev -perm -4000</code>.</li>
<li>A shared directory needs group + <code>2775</code> + a group-writable umask; setgid alone decides only the group.</li>
<li>Sticky (<code>1777</code>) is mandatory on any world-writable directory.</li>
<li>GNU chmod keeps a directory's setgid on <code>chmod 775</code>; use <code>g-s</code> or <code>00775</code> to clear it (macOS clears it).</li>
<li>ACLs add named users/groups; change them with <code>setfacl</code>, and remember <code>chmod</code> edits the mask.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/man7/inode.7.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">inode(7) — the mode bits in full</span><span class="lc-sub">The kernel's own table of every bit including S_ISUID, S_ISGID and S_ISVTX, with the exact rules for directories.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man7/capabilities.7.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">capabilities(7) — setuid's replacement</span><span class="lc-sub">The full list of individual root powers. Worth skimming once: it reframes "root" as forty separate privileges rather than one.</span></span>
</a>
<a class="link-card" href="https://gtfobins.github.io/" target="_blank" rel="noopener">
  <span class="lc-ico">⚠️</span>
  <span class="lc-body"><span class="lc-title">GTFOBins — why a stray setuid binary matters</span><span class="lc-sub">A catalogue of ordinary commands that become root shells when setuid. Read it as the argument for auditing <code>find / -perm -4000</code>, not as a toolkit.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: build a shared directory that works</span><span class="lc-sub">Graded task: two users, one directory, files each can edit — using group + setgid + umask, and verified by actually writing as both.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> setting setuid on a shell script and assuming it worked. Linux <strong>ignores</strong> the setuid bit on interpreted scripts — <code>ls -l</code> shows the <code>s</code>, <code>chmod</code> reported no error, and the script simply runs with your own privileges. The reason is a genuine race condition between the kernel checking the file and the interpreter opening it, which cannot be closed. So the bit is not a subtle security risk here; it is inert. Use <code>sudo</code> with a specific rule instead.</div>
<p class="note-ct"><strong>Two things to take from this lesson.</strong> On any server you inherit, run <code>find / -perm -4000 -type f 2&gt;/dev/null</code> once and read the list — it takes ten seconds and it is one of the few checks that finds a backdoor rather than a bug. And whenever a team shares a directory, remember the trio: <strong>chgrp, chmod 2775, umask 002</strong>. Two out of three produces a directory that looks configured and quietly is not.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2>Chữ số thứ tư</h2>
<p class="lead">Bạn đã thấy <code>chmod 755</code>. Có một chữ số thứ tư đứng phía trước — <code>chmod 4755</code> — giữ ba bit làm đổi <em>CHƯƠNG TRÌNH CHẠY VỚI DANH NGHĨA AI</em> và <em>AI SỞ HỮU THỨ BẠN TẠO RA</em>. Chúng giải thích vì sao một người dùng thường đổi được mật khẩu của chính mình trong một file chỉ root đọc được, vì sao một thư mục dùng chung của đội thật sự vẫn dùng chung được, và vì sao không ai xoá nổi file của bạn trong <code>/tmp</code>.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">4 — setuid</span><span class="lz-lnote">Trên một file chạy được: chạy nó với danh nghĩa CHỦ SỞ HỮU file, không phải người khởi chạy. Hiện ra thành chữ <code>s</code> ở ô quyền chạy của user.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 — setgid</span><span class="lz-lnote">Trên file chạy được: chạy với danh nghĩa NHÓM của file. Trên THƯ MỤC: file mới thừa kế nhóm của thư mục. Trường hợp thư mục mới là cái hữu dụng.</span></div>
  <div class="lz-layer"><span class="lz-lname">1 — dính (sticky)</span><span class="lz-lnote">Trên thư mục: bạn chỉ xoá được file CỦA CHÍNH MÌNH, kể cả khi thư mục cả thế giới ghi được. Hiện ra thành chữ <code>t</code>.</span></div>
</div>

<h3>setuid: passwd hoạt động thế nào</h3>
${slide('lx-04', 13, 'setuid: passwd chạy với EUID của chủ file')}
<pre><code class="language-bash">ls -l /usr/bin/passwd
ls -l /etc/shadow</code></pre>
<div class="out">-rwsr-xr-x 1 root root 68208 Mar 23 14:57 /usr/bin/passwd
-rw-r----- 1 root shadow 1847 Aug 22 09:31 /etc/shadow</div>
<p>Hãy nhìn hai dòng đó cùng lúc. <code>/etc/shadow</code> chứa băm mật khẩu và chỉ root đọc được — đúng như nó phải thế. Vậy mà người dùng nào cũng chạy được <code>passwd</code> để đổi mục của chính mình. Chữ <code>s</code> trong <code>-rw<strong>s</strong>r-xr-x</code> là lý do: khi bạn chạy file đó, nhân trao cho tiến trình danh tính của root, vì root sở hữu cái file.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Bạn chạy nó</span><span class="lz-t">$ passwd</span><span class="lz-d">Shell của bạn nhờ nhân chạy /usr/bin/passwd.</span></div>
  <div class="lz-step"><span class="lz-k">Nhân thấy setuid</span><span class="lz-t">UID hiệu lực := chủ file (root)</span><span class="lz-d">Tiến trình giờ mang đặc quyền của root, dù UID thật của bạn không đổi — chính nhờ vậy passwd vẫn biết phải đổi TÀI KHOẢN NÀO.</span></div>
  <div class="lz-step"><span class="lz-k">Chương trình tự siết mình</span><span class="lz-t">passwd chỉ sửa dòng CỦA BẠN</span><span class="lz-d">Sự an toàn nằm trong logic của chính chương trình, không nằm trong hệ thống quyền. Đó là toàn bộ rủi ro của setuid.</span></div>
</div>
<div class="callout warn"><strong>Một chương trình setuid-root là một ranh giới an ninh do con người viết bằng C.</strong> Nếu nó bị lừa để chạy lệnh tuỳ ý, đọc file tuỳ ý, hay ghi vào chỗ không được phép, thì một người dùng thường trở thành root. Đó là lý do danh sách file setuid trên một hệ thống được quản trị tốt thì ngắn, được rà soát, và ngày càng ngắn đi — và là lý do bạn về cơ bản KHÔNG BAO GIỜ nên tạo ra một cái. Nếu cần cho một người chạy đúng một hành động đặc quyền, hãy dùng <code>sudo</code> với một luật hẹp (Bài 4.4), thứ vừa ghi lại được vừa thu hồi được; một script setuid thì không có cả hai. Linux BỎ QUA hoàn toàn bit setuid trên script shell, chính vì làm cho một cái như thế an toàn là chuyện không đạt được.</div>

<pre><code class="language-bash"><span class="tok-comment"># Rà soát mọi file setuid trên máy — hãy làm việc này với một máy chủ bạn tiếp quản</span>
find / -perm -4000 -type f 2&gt;/dev/null | sort

<span class="tok-comment"># cả file setgid nữa</span>
find / -perm -2000 -type f 2&gt;/dev/null | sort</code></pre>
<div class="out">/usr/bin/chfn
/usr/bin/chsh
/usr/bin/gpasswd
/usr/bin/mount
/usr/bin/newgrp
/usr/bin/passwd
/usr/bin/su
/usr/bin/sudo
/usr/bin/umount</div>
<p>Danh sách đó nên trông đại khái như thế này trên một bản Ubuntu nguyên gốc. Bất cứ thứ gì lạ nằm trong đó — nhất là trong <code>/tmp</code>, <code>/home</code> hay một thư mục ứng dụng — đều đáng đi điều tra, vì "thả một shell setuid-root ở đâu đó" là cách kinh điển để giữ quyền root sau một vụ xâm nhập.</p>

<h3>setgid trên thư mục: cái bạn sẽ thật sự dùng</h3>
${slide('lx-04', 14, 'setgid trên thư mục: file mới theo nhóm của thư mục')}
<p>Bình thường một file mới nhận nhóm chính của <em>BẠN</em>. Trong một thư mục dùng chung thì điều đó sai: file do những người khác nhau tạo ra rơi vào những nhóm khác nhau, và cả đội mất quyền truy cập vào việc của nhau. setgid trên thư mục chữa đúng chuyện đó:</p>
<pre><code class="language-bash">sudo mkdir /srv/shared
sudo chgrp developers /srv/shared
sudo chmod 2775 /srv/shared        <span class="tok-comment"># 2 = setgid, 775 = rwxrwxr-x</span>
ls -ld /srv/shared</code></pre>
<div class="out">drwxrwsr-x 3 root developers 4096 Aug 22 11:02 /srv/shared</div>
<p>Để ý chữ <code>s</code> ở vị trí quyền chạy của nhóm. Giờ mọi file tạo ra bên trong đều thừa kế nhóm <code>developers</code> bất kể ai tạo, và — vì setgid cũng lan sang các thư mục con mới — cả cây giữ được hành vi đó mà không cần làm gì thêm.</p>
<pre><code class="language-bash"><span class="tok-comment"># Kiểm lại</span>
touch /srv/shared/from-alice.txt
ls -l /srv/shared/</code></pre>
<div class="out">-rw-rw-r-- 1 alice developers 0 Aug 22 11:03 from-alice.txt</div>
<div class="callout ok">setgid lo phần <em>NHÓM</em>. Muốn file mới cũng cho nhóm ghi được thì bạn cần <code>umask 002</code> trong ngữ cảnh đó (Bài 4.2), vì mặc định <code>022</code> đã bóc mất quyền ghi của nhóm trước cả khi setgid kịp áp dụng. Nên công thức đầy đủ cho một thư mục dùng chung là: <strong>chgrp + chmod 2775 + umask 002</strong>. Thiếu cái umask chính là lý do một thư mục dùng chung "cấu hình đúng rồi" vẫn đẻ ra file chỉ-đọc với đồng đội.</div>

<h3>Bit dính: /tmp sống sót ra sao</h3>
${slide('lx-04', 15, 'Bit dính: ai cũng ghi, chỉ xoá được file của mình')}
<pre><code class="language-bash">ls -ld /tmp</code></pre>
<div class="out">drwxrwxrwt 10 root root 4096 Aug 22 11:10 /tmp</div>
<p><code>/tmp</code> là <code>777</code> — người dùng nào cũng tạo file ở đó được, và đó chính là mục đích. Nhưng hãy nhớ lại Bài 4.1: <code>w</code> trên một thư mục nghĩa là bạn xoá được <em>BẤT KỲ</em> mục nào trong đó. Không có gì bảo vệ thì người dùng nào cũng xoá được file tạm của mọi người khác, kể cả cái socket mà cơ sở dữ liệu của bạn đang lắng nghe trên đó.</p>
<p>Chữ <code>t</code> ở cuối chính là bit dính, và nó thêm đúng một luật: <strong>bạn chỉ gỡ hoặc đổi tên được một mục nếu bạn sở hữu mục đó, hoặc sở hữu thư mục, hoặc là root</strong>. Cả thế giới vẫn ghi được như cũ; chỉ việc XOÁ là bị siết.</p>
<pre><code class="language-bash">sudo chmod 1777 /srv/scratch        <span class="tok-comment"># 1 = dính</span>
ls -ld /srv/scratch</code></pre>
<div class="out">drwxrwxrwt 2 root root 4096 Aug 22 11:12 /srv/scratch</div>
<div class="callout">Bất kỳ thư mục nào bạn cho cả thế giới ghi đều nên có bit dính — hai thứ đi liền nhau, và một thư mục <code>777</code> mà <em>KHÔNG</em> có nó là một lỗ hổng thật sự chứ không phải chuyện hình thức. Nếu có lúc nào bạn gõ <code>chmod 777</code> lên một thư mục dùng chung, con số bạn định gõ là <code>1777</code>.</div>

<h3>Đọc các chữ cái</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>rws</code> ở ô user</span><span class="v">setuid VÀ chạy được. Trường hợp bình thường.</span></div>
  <div class="kv"><span class="k"><code>rwS</code> — chữ S hoa</span><span class="v">setuid được đặt nhưng <strong>KHÔNG</strong> chạy được. Gần như luôn là nhầm lẫn: cái bit chẳng làm gì nếu thiếu <code>x</code>.</span></div>
  <div class="kv"><span class="k"><code>rwt</code> / <code>rwT</code></span><span class="v">Cùng luật đó cho bit dính: <code>t</code> thường nghĩa là dính + chạy được, <code>T</code> hoa nghĩa là dính mà không có <code>x</code>.</span></div>
</div>
<p>Các dạng chữ hoa chính là một lời cảnh báo dựng sẵn. Nếu <code>ls -l</code> cho bạn thấy một chữ <code>S</code> hay <code>T</code>, tức là một bit đặc biệt đã được đặt lên thứ không dùng được nó — thường là gõ nhầm <code>chmod</code>, thi thoảng là chuyện đáng quan tâm hơn.</p>

<h3>Đặt và gỡ chúng</h3>
${slide('lx-04', 16, 's/S, t/T — và chmod 775 không gỡ setgid của thư mục')}
<pre><code class="language-bash">chmod 4755 prog        <span class="tok-comment"># setuid, hệ tám</span>
chmod u+s prog         <span class="tok-comment"># setuid, ký hiệu</span>
chmod 2775 dir         <span class="tok-comment"># setgid</span>
chmod g+s dir          <span class="tok-comment"># setgid, ký hiệu</span>
chmod 1777 dir         <span class="tok-comment"># dính</span>
chmod +t dir           <span class="tok-comment"># dính, ký hiệu</span>
chmod 0755 prog        <span class="tok-comment"># xoá TẤT CẢ bit đặc biệt (số 0 đứng đầu)</span></code></pre>
<div class="callout warn"><strong>Đã sửa ngày 28/09/2026 — khung này trước đây nói NGƯỢC lại với Linux.</strong> Trên coreutils của GNU (Ubuntu, Fedora, WSL), <code>chmod</code> dạng số trên một <em>THƯ MỤC</em> <strong>GIỮ NGUYÊN</strong> bit setuid và setgid: <code>chmod 775 /srv/shared</code>, và cả <code>chmod 0775</code>, để yên <code>drwxrwsr-x</code> như cũ. Trang chmod(1) nói thẳng: "For directories chmod preserves set-user-ID and set-group-ID bits unless you explicitly specify otherwise" (với thư mục, chmod giữ bit set-user-ID và set-group-ID trừ khi bạn chỉ định rõ khác đi). Muốn gỡ thì phải dùng <code>g-s</code>, hai số 0 đứng đầu (<code>00775</code>) hoặc <code>=775</code>. Nỗi lo cũ vẫn đúng ở ba chỗ: trên một <em>FILE</em> thường, <code>chmod 755</code> gỡ setuid/setgid ngay lập tức; bit dính KHÔNG được giữ (<code>chmod 777</code> gỡ chữ <code>t</code> của một thư mục <code>1777</code>); và trên <strong>macOS</strong>, <code>chmod 775</code> CÓ gỡ chữ <code>s</code> của thư mục (đã thử). Nên thói quen vẫn thế: khi thư mục có bit đặc biệt, hãy viết đủ bốn chữ số rồi đọc lại <code>ls -ld</code>.</div>
<pre><code class="language-bash">chmod 775 /srv/shared;   ls -ld /srv/shared
chmod 0775 /srv/shared;  ls -ld /srv/shared
chmod 00775 /srv/shared; ls -ld /srv/shared</code></pre>
<div class="out">drwxrwsr-x 3 root developers 4096 Sep 28 09:30 /srv/shared
drwxrwsr-x 3 root developers 4096 Sep 28 09:30 /srv/shared
drwxrwxr-x 3 root developers 4096 Sep 28 09:30 /srv/shared</div>

<h3>ACL POSIX trong thực tế: thêm một người, không đổi chủ, không đổi nhóm</h3>
${slide('lx-04', 17, 'ACL: cấp cho đúng một người, không đổi chủ hay nhóm')}
<p>Chín bit cho bạn đúng một chủ và một nhóm. Đời thật đòi nhiều hơn: "nginx phải ghi được vào thư mục uploads, nhưng thư mục là của <code>an</code> và phải giữ nguyên như thế". Một <strong>ACL</strong> (Access Control List — danh sách kiểm soát truy cập) thêm các mục có tên — mỗi mục một người dùng hoặc một nhóm — chồng lên các bit. Ubuntu cần gói nhỏ <code>acl</code> để có hai lệnh; nhân và ext4/xfs/btrfs thì hỗ trợ sẵn.</p>
<pre><code class="language-bash">ls -ld uploads
su -s /bin/bash www-data -c 'touch uploads/t.txt'
setfacl -m u:www-data:rwx uploads
ls -ld uploads
getfacl -c uploads</code></pre>
<div class="out">drwxr-x--- 2 an an 4096 Sep 28 09:32 uploads
touch: cannot touch 'uploads/t.txt': Permission denied
drwxrwx---+ 2 an an 4096 Sep 28 09:32 uploads
user::rwx
user:www-data:rwx
group::r-x
mask::rwx
other::---</div>
<table>
<tr><th>Câu hỏi</th><th>Bit quyền</th><th>ACL POSIX</th></tr>
<tr><td>Ai nhận được quyền?</td><td>1 chủ, 1 nhóm, mọi người còn lại</td><td>bao nhiêu người dùng và nhóm có tên cũng được</td></tr>
<tr><td>Đọc bằng</td><td><code>ls -l</code>, <code>stat</code></td><td><code>getfacl</code> — <code>ls -l</code> chỉ hiện một dấu <code>+</code></td></tr>
<tr><td>Đổi bằng</td><td><code>chmod</code></td><td><code>setfacl -m</code> thêm/sửa · <code>-x</code> gỡ một mục · <code>-b</code> gỡ hết</td></tr>
<tr><td>File mới có kế thừa?</td><td>chỉ nhóm, qua setgid</td><td>có — ACL <em>MẶC ĐỊNH</em>: <code>setfacl -d -m u:www-data:rwX dir</code></td></tr>
<tr><td>Cột "nhóm" của <code>ls -l</code></td><td>quyền của nhóm</td><td><strong>mask</strong> (mặt nạ) — trần cho mọi mục có tên và cho nhóm</td></tr>
<tr><td>Sao lưu/chép có giữ?</td><td>có, gần như ở mọi nơi</td><td>chỉ với <code>cp -a</code>, <code>tar --acls</code>, <code>rsync -A</code></td></tr>
</table>
<div class="callout warn"><strong>Cái bẫy mask.</strong> Trên một file có ACL, chữ số nhóm của <code>chmod</code> đổi <em>MASK</em>, không đổi nhóm. Chạy <code>chmod 750 uploads</code> "cho gọn" là mọi mục có tên bị chặn trần trong im lặng: <code>getfacl</code> giờ in <code>user:www-data:rwx	#effective:r-x</code>, và chức năng tải lên lại hỏng. Có ACL thì đổi quyền qua <code>setfacl</code>, và đọc <code>getfacl</code>, đừng đọc <code>ls -l</code>.</div>
<p>Khi nào dùng cái nào: cả đội dùng chung một thư mục → nhóm + setgid (đơn giản hơn, thấy được trong <code>ls -l</code>). Một dịch vụ hay một người thêm mà không nên vào nhóm của bạn → ACL. Trên macOS thứ tương đương là <code>chmod +a "user:_www allow read" f</code> và <code>ls -le</code>, một hệ ACL khác (kiểu NFSv4) với cú pháp riêng.</p>

<h3>Những gì ba bit này KHÔNG làm được</h3>
${slide('lx-04', 18, 'Rà file setuid; capability là lối thay thế')}
<p>Ba bit đặc biệt là toàn bộ mô hình Unix cổ điển, và nó thô: một chủ sở hữu, một nhóm, ba lớp. Hệ thống đời mới xếp thêm nhiều tầng lên trên, và biết tên chúng lúc này là đủ:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">POSIX ACL</span><span class="v"><code>setfacl -m u:alice:rw file</code> — quyền cho từng người dùng, vượt ra ngoài một chủ/một nhóm. <code>getfacl</code> để đọc; một dấu <code>+</code> ở cuối phần chế độ trong <code>ls -l</code> nghĩa là file đó có ACL.</span></div>
  <div class="kv"><span class="k">Capability</span><span class="v"><code>setcap cap_net_bind_service=+ep /usr/bin/node</code> cấp đúng MỘT quyền của root — ở đây là quyền gắn vào cổng 80 — thay vì cấp tất cả. Đây là thứ thay thế cho setuid-root ở thời hiện đại.</span></div>
  <div class="kv"><span class="k">SELinux / AppArmor</span><span class="v">Kiểm soát truy cập bắt buộc, xếp <em>PHÍA TRÊN</em> các bit quyền. Trên RHEL và Ubuntu tương ứng, đây là lý do đôi khi một thao tác bị từ chối kể cả khi <code>ls -l</code> nói lẽ ra phải được phép — hãy xem <code>ausearch</code> hoặc <code>dmesg</code>.</span></div>
</div>

<h3>Chạy thử từng bước</h3>
<p>Trọn công thức thư mục dùng chung, trong một container vứt đi với quyền root (<code>alice</code> và <code>bob</code> đều thuộc <code>developers</code>). <code>su -</code> đăng nhập qua PAM, nên mỗi người nhận umask lúc đăng nhập của Ubuntu là <code>0002</code>; hai dòng cuối lặp lại phép thử với <code>umask 022</code>.</p>
<pre><code class="language-bash">mkdir /srv/shared &amp;&amp; chgrp developers /srv/shared &amp;&amp; chmod 2775 /srv/shared
ls -ld /srv/shared
su - alice -c 'touch /srv/shared/ke-hoach.md'
su - bob -c 'echo sua-boi-bob &gt;&gt; /srv/shared/ke-hoach.md &amp;&amp; ls -l /srv/shared'
su - alice -c 'umask 022; touch /srv/shared/khoa.md'
su - bob -c 'echo x &gt;&gt; /srv/shared/khoa.md'</code></pre>
<div class="out">drwxrwsr-x 2 root developers 4096 Sep 28 09:56 /srv/shared
total 4
-rw-rw-r-- 1 alice developers 12 Sep 28 09:56 ke-hoach.md
-bash: line 1: /srv/shared/khoa.md: Permission denied</div>
<p>Setgid làm cả hai file thuộc nhóm <code>developers</code>; chỉ umask mới quyết định nhóm đó có ghi được hay không. <code>khoa.md</code> ra đời với <code>-rw-r--r--</code> và Bob bị từ chối — đúng cái thư mục dùng chung "đã cấu hình chuẩn" mà vẫn đẻ ra file chỉ-đọc.</p>

<h3>Trên macOS khác gì</h3>
<ul>
<li><strong>Không cần setgid trên thư mục:</strong> theo ngữ nghĩa BSD, file mới LUÔN lấy nhóm của <em>THƯ MỤC</em>. Đã thử trong một thư mục scratch thuộc nhóm <code>wheel</code>: file do <code>admin</code> (nhóm chính <code>staff</code>) tạo ra mang <code>admin wheel</code>.</li>
<li><code>chmod 775</code> trên thư mục <em>CÓ</em> gỡ bit setgid trên macOS (khác GNU).</li>
<li>Bản thân <code>sudo</code> ở đó cũng là setuid: <code>-r-s--x--x root wheel /usr/bin/sudo</code>.</li>
<li>ACL dùng <code>chmod +a</code> / <code>chmod -a</code> và đọc bằng <code>ls -le</code>; không có <code>getfacl</code>/<code>setfacl</code>.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> với đồ án SWP391, ba thành viên dùng chung <code>/srv/swp391</code> trên VPS của nhóm. Tuần trước Bob không sửa được file của Alice, và có người xoá mất bài của đồng đội trong <code>/srv/swp391/tmp</code> dùng chung. Dựng một bố cục mà cả hai chuyện đó không thể xảy ra. Làm trong container với quyền root.</p><ol>
<li>Tạo <code>alice</code>, <code>bob</code> và nhóm <code>swp</code>; đưa cả hai vào nhóm.</li>
<li><code>/srv/swp391</code>: nhóm <code>swp</code>, chế độ <code>2775</code>. <code>/srv/swp391/tmp</code>: chế độ <code>1777</code>.</li>
<li>Với tư cách Alice (<code>su - alice</code>), tạo <code>/srv/swp391/bao-cao.md</code> và <code>/srv/swp391/tmp/nhap.txt</code>. Với tư cách Bob, nối thêm một dòng vào báo cáo và thử <code>rm</code> bản nháp của Alice.</li>
<li>Cho người dùng <code>www-data</code> quyền đọc <code>bao-cao.md</code> bằng ACL, không đụng tới chủ hay nhóm của nó.</li></ol>
<p><strong>Đạt khi:</strong> <code>ls -l</code> hiện báo cáo là <code>alice swp</code> với <code>rw-rw-</code>; Bob nối thêm được còn lệnh <code>rm</code> của Bob hỏng với <code>Operation not permitted</code>; và <code>getfacl -c /srv/swp391/bao-cao.md</code> có dòng <code>user:www-data:r--</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">setuid (đặt UID khi chạy)</span><span class="v">Bit 4000: chương trình chạy với danh tính của chủ file làm UID hiệu lực.</span></div>
  <div class="kv"><span class="k">setgid (đặt GID khi chạy)</span><span class="v">Bit 2000: trên chương trình thì chạy như nhóm của file; trên thư mục thì file mới kế thừa nhóm của thư mục.</span></div>
  <div class="kv"><span class="k">Sticky bit (bit dính)</span><span class="v">Bit 1000 trên thư mục: chỉ chủ mục đó, chủ thư mục hoặc root mới xoá được mục.</span></div>
  <div class="kv"><span class="k">Real vs effective UID (UID thật và UID hiệu lực)</span><span class="v">Ai khởi chạy tiến trình và tiến trình đang dùng quyền của ai; setuid chỉ đổi cái thứ hai.</span></div>
  <div class="kv"><span class="k">ACL (danh sách kiểm soát truy cập)</span><span class="v">Các mục người dùng/nhóm có tên chồng lên chín bit; <code>getfacl</code>/<code>setfacl</code>.</span></div>
  <div class="kv"><span class="k">ACL mask (mặt nạ ACL)</span><span class="v">Trần cho mọi mục ACL có tên; hiện ở cột nhóm của <code>ls -l</code>.</span></div>
  <div class="kv"><span class="k">Capability (năng lực, quyền lẻ)</span><span class="v">Một lát cắt quyền của root (ví dụ gắn cổng 80) có thể trao riêng cho một chương trình.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Chữ số thứ tư: 4 setuid, 2 setgid, 1 dính — hiện thành <code>s</code>, <code>s</code>, <code>t</code> (chữ hoa khi thiếu x).</li>
<li>setuid trao cho chương trình quyền của chủ file; Linux bỏ qua nó trên script; rà bằng <code>find / -xdev -perm -4000</code>.</li>
<li>Thư mục dùng chung cần nhóm + <code>2775</code> + umask cho nhóm ghi; setgid một mình chỉ quyết định nhóm.</li>
<li>Bit dính (<code>1777</code>) là bắt buộc trên mọi thư mục cả thế giới ghi được.</li>
<li>chmod của GNU giữ setgid của thư mục khi <code>chmod 775</code>; gỡ bằng <code>g-s</code> hoặc <code>00775</code> (macOS thì gỡ luôn).</li>
<li>ACL thêm người dùng/nhóm có tên; đổi bằng <code>setfacl</code>, và nhớ <code>chmod</code> sửa mask.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/man7/inode.7.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">inode(7) — đầy đủ các bit chế độ</span><span class="lc-sub">Bảng của chính nhân về mọi bit, gồm S_ISUID, S_ISGID và S_ISVTX, kèm luật chính xác dành cho thư mục.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man7/capabilities.7.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">capabilities(7) — thứ thay thế setuid</span><span class="lc-sub">Danh sách đầy đủ từng quyền lẻ của root. Đáng lướt qua một lần: nó định nghĩa lại "root" thành bốn mươi đặc quyền riêng biệt thay vì một khối duy nhất.</span></span>
</a>
<a class="link-card" href="https://gtfobins.github.io/" target="_blank" rel="noopener">
  <span class="lc-ico">⚠️</span>
  <span class="lc-body"><span class="lc-title">GTFOBins — vì sao một file setuid lạc chỗ lại nghiêm trọng</span><span class="lc-sub">Một danh mục những lệnh bình thường sẽ trở thành shell root khi mang setuid. Hãy đọc nó như lý lẽ cho việc rà soát <code>find / -perm -4000</code>, không phải như một bộ đồ nghề.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: dựng một thư mục dùng chung thật sự chạy được</span><span class="lc-sub">Bài chấm điểm: hai người dùng, một thư mục, file mà cả hai đều sửa được — bằng nhóm + setgid + umask, và được kiểm bằng cách ghi thật với cả hai tài khoản.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> đặt setuid lên một script shell rồi tưởng là nó đã có tác dụng. Linux <strong>BỎ QUA</strong> bit setuid trên script thông dịch — <code>ls -l</code> vẫn hiện chữ <code>s</code>, <code>chmod</code> không báo lỗi nào, và script đơn giản là chạy với đặc quyền của chính bạn. Lý do là một tình huống tranh chấp có thật giữa lúc nhân kiểm file và lúc trình thông dịch mở nó ra, và tình huống đó không bịt được. Nên ở đây cái bit không phải một rủi ro an ninh tinh vi; nó chỉ là vô tác dụng. Hãy dùng <code>sudo</code> với một luật cụ thể thay vào.</div>
<p class="note-ct"><strong>Hai thứ nên mang theo từ bài này.</strong> Với bất kỳ máy chủ nào bạn tiếp quản, hãy chạy <code>find / -perm -4000 -type f 2&gt;/dev/null</code> một lần và ĐỌC danh sách — mất mười giây, và đó là một trong số ít phép kiểm tìm ra cửa hậu chứ không phải tìm ra lỗi. Và mỗi khi một đội dùng chung thư mục, hãy nhớ bộ ba: <strong>chgrp, chmod 2775, umask 002</strong>. Làm hai trong ba thì ra một thư mục TRÔNG như đã cấu hình và lặng lẽ thì không.</p>
</div>
`,
    },
    /* ─────────────────────────── 4.4 ─────────────────────────── */
    {
      title: '4.4 — Users, groups and sudo|||4.4 — Người dùng, nhóm và sudo',
      slug: 'lnx-4-4-nguoi-dung-nhom-sudo',
      type: 'LESSON',
      description: '/etc/passwd, /etc/shadow và /etc/group đọc thế nào, tài khoản hệ thống với tài khoản người, nhóm chính với nhóm phụ, sudo so với su, sudoers và visudo, và vì sao thêm nhóm xong phải đăng nhập lại.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.4</span>
<h2>Users, groups and sudo</h2>
<p class="lead">A Linux "user" is not a person. It is a number, a home directory, a shell and a set of group memberships, recorded in three text files you can read right now. Most of what feels magical about accounts and <code>sudo</code> becomes obvious once you have looked at those files.</p>

<h3>/etc/passwd — the account list</h3>
${slide('lx-04', 19, '/etc/passwd 7 trường — UID mới là danh tính')}
<pre><code class="language-bash">grep -E '^(root|deploy):' /etc/passwd</code></pre>
<div class="out">root:x:0:0:root:/root:/bin/bash
deploy:x:1001:1001:Deploy user:/home/deploy:/bin/bash</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">deploy</span><span class="lz-lnote">Username. Only a label — the system works in numbers.</span></div>
  <div class="lz-layer"><span class="lz-lname">x</span><span class="lz-lnote">Where the password hash used to live. The <code>x</code> means "look in /etc/shadow instead" — because this file must stay world-readable.</span></div>
  <div class="lz-layer"><span class="lz-lname">1001</span><span class="lz-lnote">UID. <strong>This is the identity.</strong> Permissions compare numbers, never names. UID 0 is root — not the name "root".</span></div>
  <div class="lz-layer"><span class="lz-lname">1001</span><span class="lz-lnote">GID of the PRIMARY group — the group new files get by default.</span></div>
  <div class="lz-layer"><span class="lz-lname">Deploy user</span><span class="lz-lnote">GECOS: a free-text comment. Historically the person's full name and office phone.</span></div>
  <div class="lz-layer"><span class="lz-lname">/home/deploy</span><span class="lz-lnote">Home directory. Becomes <code>\$HOME</code> and the value of <code>~</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">/bin/bash</span><span class="lz-lnote">Login shell. <code>/usr/sbin/nologin</code> here means the account cannot log in interactively — see below.</span></div>
</div>
<div class="callout"><strong>UID 0 is root, whatever it is called.</strong> Renaming root changes nothing, and creating a second account with UID 0 creates a second root — which is why a stray <code>uid=0</code> line is something to look for on a machine you suspect. Check with <code>awk -F: '\$3 == 0' /etc/passwd</code>; it should print exactly one line.</div>

<h3>System accounts versus people</h3>
<pre><code class="language-bash">awk -F: '\$3 &lt; 1000 {print \$1, \$3, \$7}' /etc/passwd | head
awk -F: '\$3 &gt;= 1000 {print \$1, \$3, \$7}' /etc/passwd</code></pre>
<div class="out">root 0 /bin/bash
daemon 1 /usr/sbin/nologin
www-data 33 /usr/sbin/nologin
postgres 114 /bin/bash

deploy 1001 /bin/bash</div>
<p>UIDs below 1000 are system accounts, created by packages so that each service runs as its own restricted identity rather than as root. <code>www-data</code> owns nothing but what nginx needs; if nginx is compromised, the attacker gets <code>www-data</code>, not the machine. Most of them have <code>/usr/sbin/nologin</code> as their shell — the account exists to own files and run a process, and cannot be logged into.</p>
<div class="callout ok">This is a pattern to copy. When you deploy an application, give it its own user (<code>sudo useradd -r -s /usr/sbin/nologin appname</code>) rather than running it as root or as yourself. It costs one command, and it means a bug in your app cannot reach anything the app does not own.</div>

<h3>/etc/shadow and /etc/group</h3>
${slide('lx-04', 20, 'Nhóm chính ở passwd, nhóm phụ ở group — id gộp cả hai')}
<pre><code class="language-bash">sudo grep deploy /etc/shadow
grep developers /etc/group</code></pre>
<div class="out">deploy:\$y\$j9T\$Xk2...redacted...:19958:0:99999:7:::
developers:x:1002:deploy,alice,bob</div>
<p><code>/etc/shadow</code> is <code>rw-r-----</code> owned by <code>root:shadow</code>, and holds the hash plus password-ageing fields: last change, minimum and maximum age, warning period. <code>/etc/group</code> lists each group's GID and its <em>secondary</em> members. Note that <code>deploy</code>'s primary group does not appear in that member list — primary membership lives in <code>/etc/passwd</code>, secondary membership lives here, and that split confuses people.</p>
<pre><code>id deploy
groups deploy</code></pre>
<div class="out">uid=1001(deploy) gid=1001(deploy) groups=1001(deploy),1002(developers),27(sudo)
deploy : deploy developers sudo</div>
<p><code>id</code> is the command that answers "who am I, really". Run it whenever a permission question comes up — before guessing about groups, look.</p>

<h3>Managing accounts</h3>
${slide('lx-04', 21, 'usermod -G trần thay cả danh sách nhóm — luôn -aG')}
<pre><code>sudo adduser alice                       <span class="tok-comment"># Debian/Ubuntu: interactive, sets up the home dir</span>
sudo useradd -m -s /bin/bash alice       <span class="tok-comment"># portable and scriptable: -m makes the home dir</span>
sudo useradd -r -s /usr/sbin/nologin app <span class="tok-comment"># -r: a system account for a service</span>

sudo passwd alice                        <span class="tok-comment"># set a password</span>
sudo usermod -aG developers alice         <span class="tok-comment"># ADD to a secondary group</span>
sudo usermod -g developers alice          <span class="tok-comment"># change the PRIMARY group</span>
sudo gpasswd -d alice developers          <span class="tok-comment"># remove from a group</span>
sudo deluser alice                        <span class="tok-comment"># delete (add --remove-home to take the files)</span>
sudo usermod -L alice                     <span class="tok-comment"># lock: disable the password, keep the account</span></code></pre>
<div class="callout warn"><strong><code>-aG</code>, never bare <code>-G</code>.</strong> <code>usermod -G developers alice</code> <em>replaces</em> Alice's entire secondary group list with just <code>developers</code> — silently removing her from <code>sudo</code>, <code>docker</code> and everything else. The <code>-a</code> means append. This has locked administrators out of their own servers; if it happens, you need console access or another sudo account to fix it.</div>

<h3>Flags of useradd and usermod, and the -G accident reproduced</h3>
<table>
<tr><th>Command · flag</th><th>Meaning</th><th>Example</th></tr>
<tr><td><code>useradd -m</code></td><td>create the home directory (without it: no home at all)</td><td><code>useradd -m -s /bin/bash alice</code></td></tr>
<tr><td><code>useradd -s</code></td><td>login shell; <code>/usr/sbin/nologin</code> for services</td><td><code>useradd -r -s /usr/sbin/nologin app</code></td></tr>
<tr><td><code>useradd -r</code></td><td>system account: UID below 1000, no ageing</td><td>got UID 999 in the test below</td></tr>
<tr><td><code>useradd -G</code> / <code>-c</code></td><td>secondary groups at creation / GECOS comment</td><td><code>useradd -m -G developers -c "Deploy user" deploy</code></td></tr>
<tr><td><code>usermod -aG</code></td><td><strong>append</strong> secondary groups</td><td><code>usermod -aG docker alice</code></td></tr>
<tr><td><code>usermod -G</code></td><td><strong>replace</strong> the whole secondary list</td><td>the accident below</td></tr>
<tr><td><code>usermod -g</code> · <code>-s</code> · <code>-L</code>/<code>-U</code></td><td>primary group · shell · lock/unlock the password</td><td><code>usermod -L alice</code></td></tr>
<tr><td><code>passwd -S</code> · <code>chage -l</code></td><td>password status (P set, L locked, NP none) · ageing</td><td><code>passwd -S deploy</code></td></tr>
</table>
<pre><code>id alice
usermod -G docker alice; id alice
usermod -aG developers alice; id alice</code></pre>
<div class="out">uid=1001(alice) gid=1002(alice) groups=1002(alice),1001(developers)
uid=1001(alice) gid=1002(alice) groups=1002(alice),1005(docker)
uid=1001(alice) gid=1002(alice) groups=1002(alice),1001(developers),1005(docker)</div>
<p>One missing letter and <code>developers</code> was gone. If that group had been <code>sudo</code> and Alice your only admin, the next step would have been the provider's recovery console. <code>useradd -r</code> is worth a test too: <code>useradd -r -s /usr/sbin/nologin cuongapp</code> produced <code>cuongapp:x:999:999::/home/cuongapp:/usr/sbin/nologin</code>, and <code>su cuongapp -c id</code> answered <code>This account is currently not available.</code> — exactly what a service account should do.</p>

<h3>Group membership does not apply until you log in again</h3>
${slide('lx-04', 22, 'Nhóm mới không vào shell đang chạy')}
<pre><code class="language-bash">sudo usermod -aG docker \$USER
docker ps</code></pre>
<div class="out">permission denied while trying to connect to the Docker daemon socket</div>
<p>The change is real — <code>id \$USER</code> confirms it — but your <em>current shell</em> still carries the group list it was given at login. Group membership is copied into the process at login time and inherited by children; nothing re-reads <code>/etc/group</code> for a running process.</p>
<pre><code>id                    <span class="tok-comment"># the OLD list — this shell's copy</span>
id \$USER              <span class="tok-comment"># the NEW list — read fresh from the files</span>
newgrp docker         <span class="tok-comment"># start a subshell with the new group</span>
<span class="tok-comment"># or: log out and back in. For SSH, close the connection entirely.</span></code></pre>
<div class="callout">"I added myself to the <code>docker</code> group and it still says permission denied" is one of the most-asked questions in Linux, and the answer is always this. The two <code>id</code> commands above are the fastest way to prove it to yourself: same user, two different answers, because one reads the process and the other reads the file.</div>
<p>Reproduced in a container, so you can see the two lists side by side. A shell for Alice is started first and kept alive for two seconds; while it runs, Alice is added to <code>sudo</code>:</p>
<pre><code>( su alice -c 'sleep 2; echo "old shell: $(id -Gn)"' ) &amp;
usermod -aG sudo alice; wait
su alice -c 'echo "new login: $(id -Gn)"'
id -Gn alice</code></pre>
<div class="out">old shell: alice developers docker
new login: alice sudo developers docker
alice sudo developers docker</div>
<p>Same user, same second, two answers. The running shell kept the list it was given; every new login reads the files again. A systemd service is no different — it keeps its groups until <code>systemctl restart</code>.</p>

<h3>sudo versus su</h3>
${slide('lx-04', 23, 'sudo hỏi mật khẩu của bạn; su hỏi mật khẩu của đích')}
<div class="kv-grid">
  <div class="kv"><span class="k"><code>sudo cmd</code></span><span class="v">Run ONE command as root. Asks for <strong>your own</strong> password, logs who ran what, and can be restricted per-command. The default on Ubuntu and the right answer almost always.</span></div>
  <div class="kv"><span class="k"><code>sudo -i</code></span><span class="v">A full root login shell — root's environment, root's home, root's <code>PATH</code>. Use when you have several things to do.</span></div>
  <div class="kv"><span class="k"><code>sudo -u postgres cmd</code></span><span class="v">Run as a different non-root user. This is how you run <code>psql</code> as the database owner.</span></div>
  <div class="kv"><span class="k"><code>su -</code></span><span class="v">Switch user, asking for the <strong>target account's</strong> password. Needs a root password to exist, which Ubuntu does not set by default. Largely superseded.</span></div>
</div>
<pre><code>sudo -u www-data ls /var/www/private     <span class="tok-comment"># test what the web server can see</span>
sudo -l                                  <span class="tok-comment"># what am I allowed to run?</span>
sudo -k                                  <span class="tok-comment"># forget the cached credential now</span>
sudo !!                                  <span class="tok-comment"># re-run the last command with sudo</span></code></pre>
<div class="callout ok"><code>sudo -u www-data</code> is a diagnostic tool worth remembering. When an application says it cannot read a file, running the exact same command as the application's user answers "is this really a permission problem?" in one step, instead of reasoning about it.</div>

<h3>sudoers: granting narrow permission</h3>
${slide('lx-04', 24, 'sudoers: ai · máy = (chạy như) lệnh — kiểm bằng visudo -c')}
<pre><code>sudo visudo                              <span class="tok-comment"># ALWAYS edit through visudo</span>
sudo visudo -f /etc/sudoers.d/deploy     <span class="tok-comment"># better: a separate file per rule</span></code></pre>
<pre><code><span class="tok-comment"># /etc/sudoers.d/deploy</span>
<span class="tok-comment"># user  host = (runas)  commands</span>
deploy  ALL = (root) NOPASSWD: /bin/systemctl restart myapp
deploy  ALL = (root) NOPASSWD: /bin/systemctl status myapp
%developers ALL = (root) /usr/bin/journalctl</code></pre>
<p>This lets the <code>deploy</code> account restart exactly one service without a password — enough for a CI pipeline — while granting nothing else. The <code>%</code> prefix means a group rather than a user. Narrow rules like these are the entire point of <code>sudo</code>: they are auditable, revocable, and they appear in the logs.</p>
<div class="callout warn"><strong>Always use <code>visudo</code>.</strong> It syntax-checks the file before saving, and a syntax error in <code>/etc/sudoers</code> makes <code>sudo</code> refuse to run <em>at all</em> — including the <code>sudo</code> you would need to fix it. Recovering from that means single-user mode or a rescue console. Before closing your editor, keep a second terminal open with a working <code>sudo</code> session, and test the new rule there.</div>

<h3>Reading a sudoers rule field by field, and proving it works</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">deploy</span><span class="lz-t">who</span><span class="lz-d">A user; <code>%developers</code> means a group.</span></div>
  <div class="lz-step"><span class="lz-k">ALL=</span><span class="lz-t">on which host</span><span class="lz-d">Matters only when one sudoers file is shared by many machines; almost always <code>ALL</code>.</span></div>
  <div class="lz-step"><span class="lz-k">(root)</span><span class="lz-t">run as</span><span class="lz-d">The target user; <code>(postgres)</code> would allow <code>sudo -u postgres</code> only.</span></div>
  <div class="lz-step"><span class="lz-k">NOPASSWD:</span><span class="lz-t">tag</span><span class="lz-d">No password prompt — needed for CI. Note the colon: it is part of the syntax.</span></div>
  <div class="lz-step"><span class="lz-k">/usr/bin/systemctl restart myapp</span><span class="lz-t">command</span><span class="lz-d">Absolute path, and the arguments too: <code>systemctl stop myapp</code> is NOT allowed by this line.</span></div>
</div>
<pre><code>visudo -cf /tmp/bad.rule           <span class="tok-comment"># the colon after NOPASSWD is missing</span>
install -m 0440 /tmp/deploy.rule /etc/sudoers.d/deploy
visudo -c
sudo -l -U deploy</code></pre>
<div class="out">/tmp/bad.rule:1:39: syntax error
deploy ALL=(root) NOPASSWD /usr/bin/id
                                      ^
/etc/sudoers: parsed OK
/etc/sudoers.d/README: parsed OK
/etc/sudoers.d/deploy: parsed OK
Matching Defaults entries for deploy on lab:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\\:/usr/local/bin\\:/usr/sbin\\:/usr/bin\\:/sbin\\:/bin\\:/snap/bin, use_pty

User deploy may run the following commands on lab:
    (root) NOPASSWD: /usr/bin/systemctl restart myapp, /usr/bin/systemctl status myapp
    (root) /usr/bin/journalctl</div>
<p>Then test from the user's side. With a rule for <code>/usr/bin/id</code> only, as <code>deploy</code>:</p>
<pre><code class="language-bash">sudo -n id -un
sudo cat /etc/shadow
sudo -k; sudo -n true</code></pre>
<div class="out">root
Sorry, user deploy is not allowed to execute '/usr/bin/cat /etc/shadow' as root on lab.
sudo: a password is required</div>
<p><code>-n</code> (non-interactive) makes sudo fail at once instead of waiting for a password — exactly what you want inside a script or CI job, where a hidden prompt would hang forever. <code>sudo -k</code> forgets the cached credential (15 minutes by default on Ubuntu), which is how you check that a <code>NOPASSWD</code> rule really works on its own. Files in <code>/etc/sudoers.d/</code> must be mode <code>0440</code>, and their names must not contain a dot or end in <code>~</code>, or sudo silently skips them.</p>
<pre><code class="language-bash"><span class="tok-comment"># Who ran what</span>
sudo journalctl _COMM=sudo --since today
sudo grep sudo /var/log/auth.log | tail -20</code></pre>
<div class="out">Aug 22 11:42:03 vps sudo: deploy : TTY=pts/1 ; PWD=/srv/app ;
  USER=root ; COMMAND=/bin/systemctl restart myapp</div>
<div class="callout warn"><strong>Corrected on 28/09/2026.</strong> This block used to say <code>journalctl -u sudo</code>. That filters by the systemd <em>unit</em> <code>sudo.service</code>, which does not exist — sudo runs inside your login session — so it always prints <code>-- No entries --</code>. Filter by the program instead: <code>journalctl _COMM=sudo</code> or <code>journalctl -t sudo</code>. Real output on Fedora 44, including a refused attempt:</div>
<pre><code class="language-bash">journalctl -u sudo -n 2
journalctl -t sudo -n 1</code></pre>
<div class="out">-- No entries --
Sep 23 20:14:10 CuongThai sudo[367644]: Cuong03dx : a password is required ; PWD=/home/Cuong03dx ; USER=root ; COMMAND=/usr/sbin/true</div>

<h3>Run it step by step</h3>
<p>In a throwaway container as root (<code>apt-get install -y sudo</code> first). Every command changes the system, which is exactly why it belongs in a container.</p>
<pre><code class="language-bash">groupadd developers
useradd -m -s /bin/bash -G developers -c "Deploy user" deploy
grep '^deploy:' /etc/passwd
id deploy
echo 'deploy:MatKhau#2026' | chpasswd &amp;&amp; passwd -S deploy
echo 'deploy ALL=(root) NOPASSWD: /usr/bin/id' &gt; /etc/sudoers.d/deploy
chmod 0440 /etc/sudoers.d/deploy &amp;&amp; visudo -c
su - deploy -c 'sudo -n id -un; sudo -n whoami'</code></pre>
<div class="out">deploy:x:1000:1001:Deploy user:/home/deploy:/bin/bash
uid=1000(deploy) gid=1001(deploy) groups=1001(deploy),1000(developers)
deploy P 2026-09-28 0 99999 7 -1
/etc/sudoers: parsed OK
/etc/sudoers.d/README: parsed OK
/etc/sudoers.d/deploy: parsed OK
root
sudo: a password is required</div>
<p>Read the last two lines together: <code>id</code> is in the rule and runs as root without a password; <code>whoami</code> is not, so sudo wants a password, and <code>-n</code> turns that into an immediate failure. (Numbers from a fresh <code>ubuntu:24.04</code> container after removing the image's own <code>ubuntu</code> user; on your machine the UIDs may differ.)</p>

<h3>On macOS and WSL: what is different</h3>
<table>
<tr><th>Thing</th><th>Ubuntu / WSL</th><th>macOS</th></tr>
<tr><td>Where accounts live</td><td><code>/etc/passwd</code>, <code>/etc/shadow</code>, <code>/etc/group</code></td><td>Open Directory; <code>/etc/passwd</code> says it is "consulted directly only when the system is running in single-user mode"</td></tr>
<tr><td>Read an account</td><td><code>getent passwd an</code></td><td><code>dscl . -read /Users/admin UniqueID PrimaryGroupID</code> → <code>UniqueID: 501</code>, <code>PrimaryGroupID: 20</code></td></tr>
<tr><td>First human UID</td><td>1000</td><td>501 (<code>id</code>: <code>uid=501(admin) gid=20(staff)</code>)</td></tr>
<tr><td>Who may sudo</td><td>group <code>sudo</code> (Fedora: <code>wheel</code>)</td><td>group <code>admin</code> (<code>dscl . -read /Groups/admin GroupMembership</code> → <code>root admin</code>)</td></tr>
<tr><td>Create a user</td><td><code>useradd</code> / <code>adduser</code></td><td>System Settings, or <code>sysadminctl</code> — not <code>useradd</code></td></tr>
</table>
<p><strong>WSL:</strong> the user created at first start is in the <code>sudo</code> group, like a fresh Ubuntu server. Forgot its password? From PowerShell, <code>wsl --user root</code> opens a shell as <code>root</code> (Microsoft's "Basic commands for WSL"), and <code>passwd yourname</code> resets it — a reminder that whoever controls the Windows side controls the Linux accounts.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> your group's GitHub Actions job must restart the API on the VPS after each deploy, but nobody wants to give CI a full root key. Set up a <code>ci</code> account that can do exactly one privileged thing, in a container as root.</p><ol>
<li><code>apt-get install -y sudo</code>; create <code>ci</code> with a home and <code>/bin/bash</code>, and set a password with <code>chpasswd</code>.</li>
<li>Write <code>/etc/sudoers.d/ci</code> allowing <code>ci</code> to run <code>/usr/bin/id</code> as root without a password (stand-in for <code>systemctl restart</code>); mode <code>0440</code>; check with <code>visudo -c</code>.</li>
<li>As <code>ci</code>: <code>sudo -n id -un</code>, then <code>sudo -n cat /etc/shadow</code>.</li>
<li>Show the rule from the admin side with <code>sudo -l -U ci</code>, then lock the account with <code>usermod -L ci</code> and read <code>passwd -S ci</code>.</li></ol>
<p><strong>Done when:</strong> step 3 prints <code>root</code> and then <code>sudo: a password is required</code> (with <code>-n</code>, a command outside the rule fails instead of asking); <code>sudo -l -U ci</code> lists exactly <code>(root) NOPASSWD: /usr/bin/id</code>; and <code>passwd -S ci</code> shows <code>L</code> after locking.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">UID / GID</span><span class="v">The numbers that are a user's and a group's real identity; names are only labels.</span></div>
  <div class="kv"><span class="k">Primary vs secondary group</span><span class="v">The GID in <code>/etc/passwd</code> (new files get it) vs extra groups listed in <code>/etc/group</code>.</span></div>
  <div class="kv"><span class="k">System account</span><span class="v">A UID below 1000 created for a service, usually with <code>/usr/sbin/nologin</code> as its shell.</span></div>
  <div class="kv"><span class="k">NSS / getent</span><span class="v">The lookup layer that can read local files or LDAP; <code>getent</code> asks it the way programs do.</span></div>
  <div class="kv"><span class="k">sudoers</span><span class="v">The rules file (<code>/etc/sudoers</code> + <code>/etc/sudoers.d/*</code>): who may run what as whom.</span></div>
  <div class="kv"><span class="k">visudo</span><span class="v">The editor wrapper that syntax-checks sudoers before saving; <code>-c</code> checks only.</span></div>
  <div class="kv"><span class="k">Credential cache</span><span class="v">sudo remembers your password for a while (15 min on Ubuntu); <code>sudo -k</code> clears it.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A user is a UID; UID 0 is root whatever its name — <code>awk -F: '$3==0' /etc/passwd</code> must print one line.</li>
<li>Primary group lives in <code>/etc/passwd</code>, secondary groups in <code>/etc/group</code>; <code>id</code> shows both.</li>
<li><code>usermod -aG</code> appends; bare <code>-G</code> replaces the whole list.</li>
<li>Group changes reach only new logins: compare <code>id</code> with <code>id name</code>, then log out or <code>newgrp</code>.</li>
<li>sudo asks for your own password, logs, and can be narrowed; <code>su -</code> needs root's password, locked on Ubuntu.</li>
<li>Edit rules with <code>visudo -f /etc/sudoers.d/name</code>, check with <code>visudo -c</code>, prove with <code>sudo -l -U</code> and <code>sudo -n</code>.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/man5/passwd.5.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">passwd(5), shadow(5), group(5)</span><span class="lc-sub">The three file formats, field by field. Ten minutes of reading that removes most of the mystery from Linux accounts.</span></span>
</a>
<a class="link-card" href="https://www.sudo.ws/docs/man/sudoers.man/" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">sudoers(5) — the full grammar</span><span class="lc-sub">Long, but the "EXAMPLES" section near the end gives you copy-ready narrow rules, which is what you actually want.</span></span>
</a>
<a class="link-card" href="https://ubuntu.com/server/docs/user-management" target="_blank" rel="noopener">
  <span class="lc-ico">🐧</span>
  <span class="lc-body"><span class="lc-title">Ubuntu Server — User Management</span><span class="lc-sub">The distribution's own guidance, including why root has no password by default and how <code>adduser</code> differs from <code>useradd</code>.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: set up a deploy account</span><span class="lc-sub">Graded task: create a service user, put it in a group, write a narrow sudoers rule, and verify it can do exactly one thing and nothing more.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> <code>sudo cmd &gt; /etc/somefile</code>. The redirection is performed by <em>your</em> shell, before <code>sudo</code> runs anything, so it fails with "Permission denied" while <code>sudo</code> looks like the problem. You met this in Lesson 3.1; it belongs here too because it is where people conclude that "sudo is broken". The fixes are <code>cmd | sudo tee /etc/somefile</code> or <code>sudo bash -c 'cmd &gt; /etc/somefile'</code>. Same for <code>sudo cd /root</code> — <code>cd</code> is a shell builtin, so there is no program for <code>sudo</code> to elevate; use <code>sudo -i</code>.</div>
<p class="note-ct"><strong>Two commands to reach for first.</strong> <code>id</code> answers "what identity and groups do I actually have right now" — and comparing <code>id</code> with <code>id \$USER</code> catches the stale-group problem instantly. <code>sudo -l</code> answers "what am I permitted to run", which is far better than discovering it one denied command at a time. Both are read-only, so run them freely.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.4</span>
<h2>Người dùng, nhóm và sudo</h2>
<p class="lead">Một "người dùng" trên Linux không phải một CON NGƯỜI. Nó là một con số, một thư mục nhà, một shell và một tập tư cách thành viên nhóm, ghi trong ba file văn bản mà bạn đọc được ngay bây giờ. Phần lớn những gì có vẻ huyền bí về tài khoản và <code>sudo</code> trở nên hiển nhiên khi bạn đã nhìn vào mấy file đó.</p>

<h3>/etc/passwd — danh sách tài khoản</h3>
${slide('lx-04', 19, '/etc/passwd 7 trường — UID mới là danh tính')}
<pre><code class="language-bash">grep -E '^(root|deploy):' /etc/passwd</code></pre>
<div class="out">root:x:0:0:root:/root:/bin/bash
deploy:x:1001:1001:Deploy user:/home/deploy:/bin/bash</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">deploy</span><span class="lz-lnote">Tên đăng nhập. Chỉ là một cái nhãn — hệ thống làm việc bằng con số.</span></div>
  <div class="lz-layer"><span class="lz-lname">x</span><span class="lz-lnote">Chỗ băm mật khẩu từng nằm. Chữ <code>x</code> nghĩa là "hãy tìm trong /etc/shadow" — vì file này bắt buộc phải để cả thế giới đọc được.</span></div>
  <div class="lz-layer"><span class="lz-lname">1001</span><span class="lz-lnote">UID. <strong>ĐÂY mới là danh tính.</strong> Quyền so sánh CON SỐ, không bao giờ so tên. UID 0 là root — không phải cái tên "root".</span></div>
  <div class="lz-layer"><span class="lz-lname">1001</span><span class="lz-lnote">GID của NHÓM CHÍNH — nhóm mà file mới nhận theo mặc định.</span></div>
  <div class="lz-layer"><span class="lz-lname">Deploy user</span><span class="lz-lnote">GECOS: một dòng chú thích tự do. Về lịch sử là họ tên đầy đủ và số điện thoại văn phòng.</span></div>
  <div class="lz-layer"><span class="lz-lname">/home/deploy</span><span class="lz-lnote">Thư mục nhà. Trở thành <code>\$HOME</code> và là giá trị của dấu <code>~</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">/bin/bash</span><span class="lz-lnote">Shell đăng nhập. Nếu ở đây là <code>/usr/sbin/nologin</code> thì tài khoản không đăng nhập tương tác được — xem bên dưới.</span></div>
</div>
<div class="callout"><strong>UID 0 LÀ root, bất kể nó tên gì.</strong> Đổi tên root chẳng thay đổi gì, và tạo một tài khoản thứ hai với UID 0 là tạo ra một root thứ hai — đó là lý do một dòng <code>uid=0</code> lạc chỗ là thứ cần tìm trên một máy bạn nghi ngờ. Kiểm bằng <code>awk -F: '\$3 == 0' /etc/passwd</code>; nó phải in ra đúng một dòng.</div>

<h3>Tài khoản hệ thống so với con người</h3>
<pre><code class="language-bash">awk -F: '\$3 &lt; 1000 {print \$1, \$3, \$7}' /etc/passwd | head
awk -F: '\$3 &gt;= 1000 {print \$1, \$3, \$7}' /etc/passwd</code></pre>
<div class="out">root 0 /bin/bash
daemon 1 /usr/sbin/nologin
www-data 33 /usr/sbin/nologin
postgres 114 /bin/bash

deploy 1001 /bin/bash</div>
<p>UID dưới 1000 là tài khoản hệ thống, do các gói phần mềm tạo ra để mỗi dịch vụ chạy dưới một danh tính bị hạn chế của riêng nó thay vì chạy bằng root. <code>www-data</code> không sở hữu gì ngoài những thứ nginx cần; nếu nginx bị chiếm, kẻ tấn công có được <code>www-data</code>, không có được cả cái máy. Phần lớn chúng lấy <code>/usr/sbin/nologin</code> làm shell — tài khoản tồn tại để sở hữu file và chạy một tiến trình, và không đăng nhập vào được.</p>
<div class="callout ok">Đây là một khuôn mẫu đáng chép lại. Khi bạn triển khai một ứng dụng, hãy cho nó một người dùng riêng (<code>sudo useradd -r -s /usr/sbin/nologin tenapp</code>) thay vì chạy bằng root hay bằng chính bạn. Tốn đúng một lệnh, và đổi lại một lỗi trong ứng dụng của bạn không với tới được bất cứ thứ gì mà ứng dụng không sở hữu.</div>

<h3>/etc/shadow và /etc/group</h3>
${slide('lx-04', 20, 'Nhóm chính ở passwd, nhóm phụ ở group — id gộp cả hai')}
<pre><code class="language-bash">sudo grep deploy /etc/shadow
grep developers /etc/group</code></pre>
<div class="out">deploy:\$y\$j9T\$Xk2...đã che...:19958:0:99999:7:::
developers:x:1002:deploy,alice,bob</div>
<p><code>/etc/shadow</code> mang chế độ <code>rw-r-----</code> thuộc <code>root:shadow</code>, và giữ phần băm cùng các trường về tuổi mật khẩu: lần đổi gần nhất, tuổi tối thiểu và tối đa, khoảng cảnh báo. <code>/etc/group</code> liệt kê GID của mỗi nhóm và các thành viên <em>PHỤ</em> của nó. Để ý rằng nhóm chính của <code>deploy</code> KHÔNG xuất hiện trong danh sách thành viên đó — tư cách thành viên chính nằm trong <code>/etc/passwd</code>, tư cách thành viên phụ nằm ở đây, và sự chia đôi này làm người ta rối.</p>
<pre><code>id deploy
groups deploy</code></pre>
<div class="out">uid=1001(deploy) gid=1001(deploy) groups=1001(deploy),1002(developers),27(sudo)
deploy : deploy developers sudo</div>
<p><code>id</code> là lệnh trả lời câu "thật ra tôi là ai". Hãy chạy nó mỗi khi có câu hỏi về quyền — trước khi đoán mò về nhóm, hãy NHÌN.</p>

<h3>Quản lý tài khoản</h3>
${slide('lx-04', 21, 'usermod -G trần thay cả danh sách nhóm — luôn -aG')}
<pre><code>sudo adduser alice                       <span class="tok-comment"># Debian/Ubuntu: tương tác, tự dựng thư mục nhà</span>
sudo useradd -m -s /bin/bash alice       <span class="tok-comment"># khả chuyển và viết script được: -m tạo thư mục nhà</span>
sudo useradd -r -s /usr/sbin/nologin app <span class="tok-comment"># -r: một tài khoản hệ thống cho dịch vụ</span>

sudo passwd alice                        <span class="tok-comment"># đặt mật khẩu</span>
sudo usermod -aG developers alice         <span class="tok-comment"># THÊM vào một nhóm phụ</span>
sudo usermod -g developers alice          <span class="tok-comment"># đổi nhóm CHÍNH</span>
sudo gpasswd -d alice developers          <span class="tok-comment"># gỡ khỏi một nhóm</span>
sudo deluser alice                        <span class="tok-comment"># xoá (thêm --remove-home để lấy luôn file)</span>
sudo usermod -L alice                     <span class="tok-comment"># khoá: vô hiệu mật khẩu, giữ lại tài khoản</span></code></pre>
<div class="callout warn"><strong>Phải là <code>-aG</code>, không bao giờ là <code>-G</code> trần.</strong> Lệnh <code>usermod -G developers alice</code> <em>THAY THẾ</em> toàn bộ danh sách nhóm phụ của Alice bằng mỗi <code>developers</code> — âm thầm gỡ cô ấy khỏi <code>sudo</code>, <code>docker</code> và mọi thứ khác. Chữ <code>-a</code> nghĩa là nối thêm. Chuyện này đã khoá quản trị viên ra khỏi chính máy chủ của họ; nếu nó xảy ra, bạn cần quyền vào console hoặc một tài khoản sudo khác để chữa.</div>

<h3>Cờ của useradd và usermod, và dựng lại tai nạn -G</h3>
<table>
<tr><th>Lệnh · cờ</th><th>Nghĩa</th><th>Ví dụ</th></tr>
<tr><td><code>useradd -m</code></td><td>tạo thư mục nhà (thiếu cờ này: không có nhà)</td><td><code>useradd -m -s /bin/bash alice</code></td></tr>
<tr><td><code>useradd -s</code></td><td>shell đăng nhập; <code>/usr/sbin/nologin</code> cho dịch vụ</td><td><code>useradd -r -s /usr/sbin/nologin app</code></td></tr>
<tr><td><code>useradd -r</code></td><td>tài khoản hệ thống: UID dưới 1000, không tính tuổi mật khẩu</td><td>nhận UID 999 trong phép thử bên dưới</td></tr>
<tr><td><code>useradd -G</code> / <code>-c</code></td><td>nhóm phụ lúc tạo / chú thích GECOS</td><td><code>useradd -m -G developers -c "Deploy user" deploy</code></td></tr>
<tr><td><code>usermod -aG</code></td><td><strong>NỐI THÊM</strong> nhóm phụ</td><td><code>usermod -aG docker alice</code></td></tr>
<tr><td><code>usermod -G</code></td><td><strong>THAY</strong> cả danh sách nhóm phụ</td><td>tai nạn bên dưới</td></tr>
<tr><td><code>usermod -g</code> · <code>-s</code> · <code>-L</code>/<code>-U</code></td><td>nhóm chính · shell · khoá/mở mật khẩu</td><td><code>usermod -L alice</code></td></tr>
<tr><td><code>passwd -S</code> · <code>chage -l</code></td><td>trạng thái mật khẩu (P có, L khoá, NP không có) · tuổi mật khẩu</td><td><code>passwd -S deploy</code></td></tr>
</table>
<pre><code>id alice
usermod -G docker alice; id alice
usermod -aG developers alice; id alice</code></pre>
<div class="out">uid=1001(alice) gid=1002(alice) groups=1002(alice),1001(developers)
uid=1001(alice) gid=1002(alice) groups=1002(alice),1005(docker)
uid=1001(alice) gid=1002(alice) groups=1002(alice),1001(developers),1005(docker)</div>
<p>Thiếu một chữ cái là <code>developers</code> biến mất. Nếu nhóm đó là <code>sudo</code> và Alice là quản trị viên duy nhất, bước tiếp theo là console cứu hộ của nhà cung cấp. <code>useradd -r</code> cũng đáng thử: <code>useradd -r -s /usr/sbin/nologin cuongapp</code> tạo ra <code>cuongapp:x:999:999::/home/cuongapp:/usr/sbin/nologin</code>, và <code>su cuongapp -c id</code> trả lời <code>This account is currently not available.</code> — đúng thứ một tài khoản dịch vụ nên làm.</p>

<h3>Vào nhóm mới chưa có hiệu lực cho tới khi đăng nhập lại</h3>
${slide('lx-04', 22, 'Nhóm mới không vào shell đang chạy')}
<pre><code class="language-bash">sudo usermod -aG docker \$USER
docker ps</code></pre>
<div class="out">permission denied while trying to connect to the Docker daemon socket</div>
<p>Thay đổi là có thật — <code>id \$USER</code> xác nhận điều đó — nhưng <em>SHELL HIỆN TẠI</em> của bạn vẫn mang danh sách nhóm mà nó được cấp lúc đăng nhập. Tư cách thành viên nhóm được CHÉP vào tiến trình lúc đăng nhập rồi được các tiến trình con thừa kế; không có gì đọc lại <code>/etc/group</code> cho một tiến trình đang chạy.</p>
<pre><code>id                    <span class="tok-comment"># danh sách CŨ — bản chép của shell này</span>
id \$USER              <span class="tok-comment"># danh sách MỚI — đọc tươi từ file</span>
newgrp docker         <span class="tok-comment"># mở một shell con với nhóm mới</span>
<span class="tok-comment"># hoặc: đăng xuất rồi đăng nhập lại. Với SSH thì phải đóng hẳn kết nối.</span></code></pre>
<div class="callout">"Tôi đã thêm mình vào nhóm <code>docker</code> rồi mà nó vẫn báo permission denied" là một trong những câu hỏi được hỏi nhiều nhất về Linux, và câu trả lời luôn là chuyện này. Hai lệnh <code>id</code> ở trên là cách nhanh nhất để tự chứng minh: cùng một người dùng, hai câu trả lời khác nhau, vì một cái đọc TIẾN TRÌNH còn cái kia đọc FILE.</div>
<p>Dựng lại trong container để bạn thấy hai danh sách cạnh nhau. Một shell của Alice được khởi chạy trước và sống thêm hai giây; trong lúc nó chạy, Alice được thêm vào <code>sudo</code>:</p>
<pre><code>( su alice -c 'sleep 2; echo "old shell: $(id -Gn)"' ) &amp;
usermod -aG sudo alice; wait
su alice -c 'echo "new login: $(id -Gn)"'
id -Gn alice</code></pre>
<div class="out">old shell: alice developers docker
new login: alice sudo developers docker
alice sudo developers docker</div>
<p>Cùng một người, cùng một giây, hai câu trả lời. Shell đang chạy giữ danh sách nó được cấp; mỗi lần đăng nhập mới lại đọc file. Một dịch vụ systemd cũng y như vậy — nó giữ nhóm cũ cho tới khi <code>systemctl restart</code>.</p>

<h3>sudo so với su</h3>
${slide('lx-04', 23, 'sudo hỏi mật khẩu của bạn; su hỏi mật khẩu của đích')}
<div class="kv-grid">
  <div class="kv"><span class="k"><code>sudo lệnh</code></span><span class="v">Chạy MỘT lệnh với quyền root. Hỏi mật khẩu <strong>CỦA CHÍNH BẠN</strong>, ghi lại ai chạy gì, và giới hạn được theo từng lệnh. Mặc định trên Ubuntu và gần như luôn là câu trả lời đúng.</span></div>
  <div class="kv"><span class="k"><code>sudo -i</code></span><span class="v">Một shell đăng nhập root đầy đủ — môi trường của root, thư mục nhà của root, <code>PATH</code> của root. Dùng khi bạn có mấy việc phải làm.</span></div>
  <div class="kv"><span class="k"><code>sudo -u postgres lệnh</code></span><span class="v">Chạy với danh nghĩa một người dùng khác không phải root. Đây là cách bạn chạy <code>psql</code> với tư cách chủ sở hữu cơ sở dữ liệu.</span></div>
  <div class="kv"><span class="k"><code>su -</code></span><span class="v">Đổi người dùng, hỏi mật khẩu <strong>CỦA TÀI KHOẢN ĐÍCH</strong>. Cần có sẵn mật khẩu root, thứ mà Ubuntu mặc định không đặt. Phần lớn đã bị thay thế.</span></div>
</div>
<pre><code>sudo -u www-data ls /var/www/private     <span class="tok-comment"># thử xem máy chủ web nhìn thấy gì</span>
sudo -l                                  <span class="tok-comment"># tôi được phép chạy những gì?</span>
sudo -k                                  <span class="tok-comment"># quên ngay thông tin xác thực đang nhớ tạm</span>
sudo !!                                  <span class="tok-comment"># chạy lại lệnh vừa rồi kèm sudo</span></code></pre>
<div class="callout ok"><code>sudo -u www-data</code> là một công cụ chẩn đoán đáng nhớ. Khi một ứng dụng nói nó không đọc được một file, chạy đúng lệnh đó với danh nghĩa người dùng của ứng dụng sẽ trả lời câu "đây có thật sự là vấn đề quyền không?" chỉ trong một bước, thay vì phải ngồi suy luận.</div>

<h3>sudoers: cấp quyền một cách hẹp</h3>
${slide('lx-04', 24, 'sudoers: ai · máy = (chạy như) lệnh — kiểm bằng visudo -c')}
<pre><code>sudo visudo                              <span class="tok-comment"># LUÔN sửa thông qua visudo</span>
sudo visudo -f /etc/sudoers.d/deploy     <span class="tok-comment"># tốt hơn: mỗi luật một file riêng</span></code></pre>
<pre><code><span class="tok-comment"># /etc/sudoers.d/deploy</span>
<span class="tok-comment"># người  máy = (chạy dưới danh nghĩa)  lệnh</span>
deploy  ALL = (root) NOPASSWD: /bin/systemctl restart myapp
deploy  ALL = (root) NOPASSWD: /bin/systemctl status myapp
%developers ALL = (root) /usr/bin/journalctl</code></pre>
<p>Cái này cho tài khoản <code>deploy</code> khởi động lại đúng MỘT dịch vụ mà không cần mật khẩu — đủ cho một đường ống CI — trong khi không cấp gì khác. Tiền tố <code>%</code> nghĩa là một nhóm chứ không phải một người dùng. Những luật hẹp như thế chính là toàn bộ mục đích của <code>sudo</code>: chúng ghi lại được, thu hồi được, và chúng hiện lên trong log.</p>
<div class="callout warn"><strong>Luôn dùng <code>visudo</code>.</strong> Nó kiểm cú pháp trước khi lưu, mà một lỗi cú pháp trong <code>/etc/sudoers</code> làm <code>sudo</code> từ chối chạy <em>HOÀN TOÀN</em> — kể cả cái <code>sudo</code> mà bạn cần để đi sửa nó. Khôi phục từ tình huống đó nghĩa là chế độ đơn người dùng hoặc một console cứu hộ. Trước khi đóng trình soạn thảo, hãy giữ một terminal thứ hai đang có phiên <code>sudo</code> chạy được, và thử luật mới ở đó.</div>

<h3>Đọc một luật sudoers từng trường, và chứng minh nó chạy</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">deploy</span><span class="lz-t">ai</span><span class="lz-d">Một người dùng; <code>%developers</code> nghĩa là một nhóm.</span></div>
  <div class="lz-step"><span class="lz-k">ALL=</span><span class="lz-t">trên máy nào</span><span class="lz-d">Chỉ có ý nghĩa khi một file sudoers dùng chung cho nhiều máy; gần như luôn là <code>ALL</code>.</span></div>
  <div class="lz-step"><span class="lz-k">(root)</span><span class="lz-t">chạy như ai</span><span class="lz-d">Người dùng đích; <code>(postgres)</code> thì chỉ cho <code>sudo -u postgres</code>.</span></div>
  <div class="lz-step"><span class="lz-k">NOPASSWD:</span><span class="lz-t">nhãn</span><span class="lz-d">Không hỏi mật khẩu — cần cho CI. Để ý dấu hai chấm: nó là một phần của cú pháp.</span></div>
  <div class="lz-step"><span class="lz-k">/usr/bin/systemctl restart myapp</span><span class="lz-t">lệnh</span><span class="lz-d">Đường dẫn tuyệt đối, và cả tham số: <code>systemctl stop myapp</code> KHÔNG được dòng này cho phép.</span></div>
</div>
<pre><code>visudo -cf /tmp/bad.rule           <span class="tok-comment"># thiếu dấu hai chấm sau NOPASSWD</span>
install -m 0440 /tmp/deploy.rule /etc/sudoers.d/deploy
visudo -c
sudo -l -U deploy</code></pre>
<div class="out">/tmp/bad.rule:1:39: syntax error
deploy ALL=(root) NOPASSWD /usr/bin/id
                                      ^
/etc/sudoers: parsed OK
/etc/sudoers.d/README: parsed OK
/etc/sudoers.d/deploy: parsed OK
Matching Defaults entries for deploy on lab:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\\:/usr/local/bin\\:/usr/sbin\\:/usr/bin\\:/sbin\\:/bin\\:/snap/bin, use_pty

User deploy may run the following commands on lab:
    (root) NOPASSWD: /usr/bin/systemctl restart myapp, /usr/bin/systemctl status myapp
    (root) /usr/bin/journalctl</div>
<p>Rồi thử từ phía người dùng. Với một luật chỉ cho <code>/usr/bin/id</code>, đăng nhập bằng <code>deploy</code>:</p>
<pre><code class="language-bash">sudo -n id -un
sudo cat /etc/shadow
sudo -k; sudo -n true</code></pre>
<div class="out">root
Sorry, user deploy is not allowed to execute '/usr/bin/cat /etc/shadow' as root on lab.
sudo: a password is required</div>
<p><code>-n</code> (non-interactive — không tương tác) làm sudo hỏng ngay thay vì chờ mật khẩu — đúng thứ bạn cần trong script hay job CI, nơi một lời hỏi mật khẩu vô hình sẽ treo mãi mãi. <code>sudo -k</code> quên thông tin xác thực đang nhớ tạm (mặc định 15 phút trên Ubuntu), đó là cách kiểm một luật <code>NOPASSWD</code> có thật sự tự chạy được không. File trong <code>/etc/sudoers.d/</code> phải mang chế độ <code>0440</code>, và tên file không được chứa dấu chấm hay kết thúc bằng <code>~</code>, nếu không sudo lặng lẽ bỏ qua.</p>
<pre><code class="language-bash"><span class="tok-comment"># Ai đã chạy gì</span>
sudo journalctl _COMM=sudo --since today
sudo grep sudo /var/log/auth.log | tail -20</code></pre>
<div class="out">Aug 22 11:42:03 vps sudo: deploy : TTY=pts/1 ; PWD=/srv/app ;
  USER=root ; COMMAND=/bin/systemctl restart myapp</div>
<div class="callout warn"><strong>Đã sửa ngày 28/09/2026.</strong> Khối này trước đây ghi <code>journalctl -u sudo</code>. Lệnh đó lọc theo <em>UNIT</em> systemd <code>sudo.service</code>, thứ không hề tồn tại — sudo chạy bên trong phiên đăng nhập của bạn — nên nó luôn in <code>-- No entries --</code>. Hãy lọc theo chương trình: <code>journalctl _COMM=sudo</code> hoặc <code>journalctl -t sudo</code>. Output thật trên Fedora 44, gồm cả một lần bị từ chối:</div>
<pre><code class="language-bash">journalctl -u sudo -n 2
journalctl -t sudo -n 1</code></pre>
<div class="out">-- No entries --
Sep 23 20:14:10 CuongThai sudo[367644]: Cuong03dx : a password is required ; PWD=/home/Cuong03dx ; USER=root ; COMMAND=/usr/sbin/true</div>

<h3>Chạy thử từng bước</h3>
<p>Trong một container vứt đi với quyền root (chạy <code>apt-get install -y sudo</code> trước). Lệnh nào cũng đổi hệ thống, và đó chính là lý do chúng thuộc về container.</p>
<pre><code class="language-bash">groupadd developers
useradd -m -s /bin/bash -G developers -c "Deploy user" deploy
grep '^deploy:' /etc/passwd
id deploy
echo 'deploy:MatKhau#2026' | chpasswd &amp;&amp; passwd -S deploy
echo 'deploy ALL=(root) NOPASSWD: /usr/bin/id' &gt; /etc/sudoers.d/deploy
chmod 0440 /etc/sudoers.d/deploy &amp;&amp; visudo -c
su - deploy -c 'sudo -n id -un; sudo -n whoami'</code></pre>
<div class="out">deploy:x:1000:1001:Deploy user:/home/deploy:/bin/bash
uid=1000(deploy) gid=1001(deploy) groups=1001(deploy),1000(developers)
deploy P 2026-09-28 0 99999 7 -1
/etc/sudoers: parsed OK
/etc/sudoers.d/README: parsed OK
/etc/sudoers.d/deploy: parsed OK
root
sudo: a password is required</div>
<p>Đọc hai dòng cuối cùng nhau: <code>id</code> có trong luật nên chạy với quyền root mà không cần mật khẩu; <code>whoami</code> thì không có, nên sudo đòi mật khẩu, và <code>-n</code> biến chuyện đó thành thất bại tức thì. (Số liệu từ một container <code>ubuntu:24.04</code> mới sau khi xoá người dùng <code>ubuntu</code> có sẵn của ảnh; trên máy bạn UID có thể khác.)</p>

<h3>Trên macOS và WSL khác gì</h3>
<table>
<tr><th>Thứ</th><th>Ubuntu / WSL</th><th>macOS</th></tr>
<tr><td>Tài khoản nằm ở đâu</td><td><code>/etc/passwd</code>, <code>/etc/shadow</code>, <code>/etc/group</code></td><td>Open Directory; <code>/etc/passwd</code> tự ghi rằng nó "chỉ được đọc trực tiếp khi hệ thống chạy ở chế độ single-user"</td></tr>
<tr><td>Đọc một tài khoản</td><td><code>getent passwd an</code></td><td><code>dscl . -read /Users/admin UniqueID PrimaryGroupID</code> → <code>UniqueID: 501</code>, <code>PrimaryGroupID: 20</code></td></tr>
<tr><td>UID người thật đầu tiên</td><td>1000</td><td>501 (<code>id</code>: <code>uid=501(admin) gid=20(staff)</code>)</td></tr>
<tr><td>Ai được sudo</td><td>nhóm <code>sudo</code> (Fedora: <code>wheel</code>)</td><td>nhóm <code>admin</code> (<code>dscl . -read /Groups/admin GroupMembership</code> → <code>root admin</code>)</td></tr>
<tr><td>Tạo người dùng</td><td><code>useradd</code> / <code>adduser</code></td><td>System Settings, hoặc <code>sysadminctl</code> — không phải <code>useradd</code></td></tr>
</table>
<p><strong>WSL:</strong> người dùng được tạo lúc khởi động lần đầu nằm trong nhóm <code>sudo</code>, giống một máy chủ Ubuntu mới. Quên mật khẩu? Từ PowerShell, <code>wsl --user root</code> mở một shell với tư cách <code>root</code> (trang "Basic commands for WSL" của Microsoft), và <code>passwd tên-bạn</code> đặt lại — một lời nhắc rằng ai nắm phía Windows thì nắm luôn tài khoản Linux.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> job GitHub Actions của nhóm phải khởi động lại API trên VPS sau mỗi lần deploy, nhưng không ai muốn trao cho CI một khoá root đầy đủ. Dựng một tài khoản <code>ci</code> làm được đúng MỘT việc đặc quyền, trong container với quyền root.</p><ol>
<li><code>apt-get install -y sudo</code>; tạo <code>ci</code> có thư mục nhà và <code>/bin/bash</code>, đặt mật khẩu bằng <code>chpasswd</code>.</li>
<li>Viết <code>/etc/sudoers.d/ci</code> cho <code>ci</code> chạy <code>/usr/bin/id</code> với quyền root không cần mật khẩu (đứng thay cho <code>systemctl restart</code>); chế độ <code>0440</code>; kiểm bằng <code>visudo -c</code>.</li>
<li>Với tư cách <code>ci</code>: <code>sudo -n id -un</code>, rồi <code>sudo -n cat /etc/shadow</code>.</li>
<li>Xem luật từ phía quản trị bằng <code>sudo -l -U ci</code>, rồi khoá tài khoản bằng <code>usermod -L ci</code> và đọc <code>passwd -S ci</code>.</li></ol>
<p><strong>Đạt khi:</strong> bước 3 in <code>root</code> rồi <code>sudo: a password is required</code> (có <code>-n</code>, lệnh nằm ngoài luật hỏng luôn thay vì hỏi mật khẩu); <code>sudo -l -U ci</code> liệt kê đúng <code>(root) NOPASSWD: /usr/bin/id</code>; và <code>passwd -S ci</code> hiện <code>L</code> sau khi khoá.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">UID / GID (mã người dùng / mã nhóm)</span><span class="v">Những con số là danh tính thật của người dùng và nhóm; tên chỉ là nhãn.</span></div>
  <div class="kv"><span class="k">Primary vs secondary group (nhóm chính và nhóm phụ)</span><span class="v">GID trong <code>/etc/passwd</code> (file mới nhận nhóm này) so với các nhóm thêm liệt kê trong <code>/etc/group</code>.</span></div>
  <div class="kv"><span class="k">System account (tài khoản hệ thống)</span><span class="v">UID dưới 1000 tạo cho một dịch vụ, thường mang shell <code>/usr/sbin/nologin</code>.</span></div>
  <div class="kv"><span class="k">NSS / getent (lớp tra cứu tên)</span><span class="v">Lớp tra cứu đọc được file cục bộ hay LDAP; <code>getent</code> hỏi nó đúng như các chương trình hỏi.</span></div>
  <div class="kv"><span class="k">sudoers (file luật sudo)</span><span class="v"><code>/etc/sudoers</code> + <code>/etc/sudoers.d/*</code>: ai được chạy gì với danh nghĩa ai.</span></div>
  <div class="kv"><span class="k">visudo (trình sửa sudoers an toàn)</span><span class="v">Lớp bọc trình soạn thảo, kiểm cú pháp trước khi lưu; <code>-c</code> chỉ kiểm.</span></div>
  <div class="kv"><span class="k">Credential cache (bộ nhớ tạm xác thực)</span><span class="v">sudo nhớ mật khẩu một lúc (15 phút trên Ubuntu); <code>sudo -k</code> xoá nó.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Người dùng là một UID; UID 0 là root bất kể tên gì — <code>awk -F: '$3==0' /etc/passwd</code> phải in đúng một dòng.</li>
<li>Nhóm chính nằm ở <code>/etc/passwd</code>, nhóm phụ ở <code>/etc/group</code>; <code>id</code> hiện cả hai.</li>
<li><code>usermod -aG</code> nối thêm; <code>-G</code> trần thay cả danh sách.</li>
<li>Đổi nhóm chỉ tới được lần đăng nhập mới: so <code>id</code> với <code>id tên</code>, rồi đăng xuất hoặc <code>newgrp</code>.</li>
<li>sudo hỏi mật khẩu của chính bạn, ghi log, và siết hẹp được; <code>su -</code> cần mật khẩu root, thứ Ubuntu khoá sẵn.</li>
<li>Sửa luật bằng <code>visudo -f /etc/sudoers.d/tên</code>, kiểm bằng <code>visudo -c</code>, chứng minh bằng <code>sudo -l -U</code> và <code>sudo -n</code>.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/man5/passwd.5.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">passwd(5), shadow(5), group(5)</span><span class="lc-sub">Ba định dạng file, từng trường một. Mười phút đọc đủ để gỡ bỏ phần lớn sự huyền bí quanh tài khoản Linux.</span></span>
</a>
<a class="link-card" href="https://www.sudo.ws/docs/man/sudoers.man/" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">sudoers(5) — toàn bộ ngữ pháp</span><span class="lc-sub">Dài, nhưng mục "EXAMPLES" gần cuối cho bạn những luật hẹp chép về dùng được ngay, và đó mới là thứ bạn thật sự cần.</span></span>
</a>
<a class="link-card" href="https://ubuntu.com/server/docs/user-management" target="_blank" rel="noopener">
  <span class="lc-ico">🐧</span>
  <span class="lc-body"><span class="lc-title">Ubuntu Server — Quản lý người dùng</span><span class="lc-sub">Hướng dẫn của chính bản phân phối, gồm cả lý do root mặc định không có mật khẩu và <code>adduser</code> khác <code>useradd</code> ra sao.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: dựng một tài khoản deploy</span><span class="lc-sub">Bài chấm điểm: tạo một người dùng dịch vụ, đưa vào một nhóm, viết một luật sudoers hẹp, rồi kiểm rằng nó làm được đúng một việc và không làm được gì hơn.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> <code>sudo lệnh &gt; /etc/mộtfile</code>. Phép chuyển hướng do <em>SHELL CỦA BẠN</em> thực hiện, trước khi <code>sudo</code> kịp chạy bất cứ thứ gì, nên nó hỏng với "Permission denied" trong khi <code>sudo</code> trông như thủ phạm. Bạn đã gặp chuyện này ở Bài 3.1; nó thuộc về cả chỗ này nữa, vì đây là nơi người ta kết luận rằng "sudo bị hỏng". Cách chữa là <code>lệnh | sudo tee /etc/mộtfile</code> hoặc <code>sudo bash -c 'lệnh &gt; /etc/mộtfile'</code>. Tương tự với <code>sudo cd /root</code> — <code>cd</code> là lệnh dựng sẵn của shell, nên chẳng có chương trình nào để <code>sudo</code> nâng quyền cả; hãy dùng <code>sudo -i</code>.</div>
<p class="note-ct"><strong>Hai lệnh nên với tay lấy đầu tiên.</strong> <code>id</code> trả lời "ngay lúc này tôi thật sự mang danh tính và những nhóm nào" — và so <code>id</code> với <code>id \$USER</code> bắt được ngay chuyện nhóm bị cũ. <code>sudo -l</code> trả lời "tôi được phép chạy những gì", tốt hơn nhiều so với việc phát hiện ra từng chút một qua mỗi lệnh bị từ chối. Cả hai đều chỉ đọc, nên cứ chạy thoải mái.</p>
</div>
`,
    },
    /* ─────────────────────────── 4.5 ─────────────────────────── */
    {
      title: '4.5 — Diagnosing "Permission denied" instead of reaching for sudo|||4.5 — Chẩn đoán "Permission denied" thay vì vớ lấy sudo',
      slug: 'lnx-4-5-chan-doan-permission-denied',
      type: 'LESSON',
      description: 'Một quy trình sáu bước đọc ra nguyên nhân thật: ai đang chạy, đường dẫn hỏng ở thành phần nào, có phải quyền không, hay là hệ thống file chỉ-đọc / AppArmor / thiếu bit chạy — và mười triệu chứng thường gặp kèm cách chữa đúng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.5</span>
<h2>Diagnosing "Permission denied"</h2>
<p class="lead">Three words, and at least eight distinct causes — several of which are not permission problems at all. This lesson is the procedure that turns the guess into a reading. It takes about thirty seconds to run, and it ends with you changing one specific thing rather than escalating until the error goes away.</p>

<h3>The procedure</h3>
${slide('lx-04', 25, 'Chẩn đoán 6 bước: đọc ra nguyên nhân, đừng vớ sudo')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Who</span><span class="lz-t">id</span><span class="lz-d">Which UID and which groups is the failing process ACTUALLY running as? For a service, not you — check the unit or use ps.</span></div>
  <div class="lz-step"><span class="lz-k">2 · What path</span><span class="lz-t">namei -l /full/path/to/thing</span><span class="lz-d">Prints the mode and owner of EVERY component. The failing one is usually a directory partway up, not the file at the end.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Prove it</span><span class="lz-t">sudo -u &lt;theuser&gt; &lt;the exact command&gt;</span><span class="lz-d">Reproduce the failure as that identity. If it now succeeds, the problem is not the file — it is the environment, the working directory, or something above.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Not permissions?</span><span class="lz-t">mount | grep '(ro,' · lsattr file · df -h</span><span class="lz-d">Read-only filesystem, immutable attribute, or a full disk all report as denial or failure. None is fixed by chmod.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Above the bits</span><span class="lz-t">dmesg -T | tail · ausearch -m avc -ts recent</span><span class="lz-d">AppArmor or SELinux denials never show up in ls -l. If the bits look right and it still fails, look here.</span></div>
  <div class="lz-step"><span class="lz-k">6 · Fix one thing</span><span class="lz-t">chmod / chown / usermod on the ONE component you identified</span><span class="lz-d">Then re-run step 3 to confirm. Never chmod 777 and move on.</span></div>
</div>

<h3>Step 1: who is actually running this</h3>
<pre><code class="language-bash">id                                    <span class="tok-comment"># you, right now</span>
ps -o user,group,pid,cmd -C nginx     <span class="tok-comment"># what a running process runs as</span>
systemctl show myapp -p User -p Group <span class="tok-comment"># what a unit is configured to use</span></code></pre>
<div class="out">uid=1001(deploy) gid=1001(deploy) groups=1001(deploy),1002(developers)
USER     GROUP    PID CMD
root     root     812 nginx: master process
www-data www-data 813 nginx: worker process</div>
<div class="callout">nginx's master runs as root — it must, to bind port 80 — but the <em>workers</em> that read your files run as <code>www-data</code>. So "nginx cannot read my file" is a question about <code>www-data</code>, not about root, and testing as root proves nothing. The same split exists for most servers: a privileged parent and unprivileged children.</div>

<h3>Step 2: read the whole path</h3>
<pre><code>namei -l /srv/app/config/db.yml</code></pre>
<div class="out">f: /srv/app/config/db.yml
 dr-xr-xr-x root   root   /
 drwxr-xr-x root   root   srv
 drwxr-x--- deploy deploy app        ← other has NOTHING here
 drwxr-xr-x deploy deploy config
 -rw-r--r-- deploy deploy db.yml</div>
<p>The file is world-readable. It does not matter: <code>www-data</code> is not <code>deploy</code> and not in the <code>deploy</code> group, so it cannot traverse <code>app</code>, and the walk stops there (Lesson 4.1). Every <code>chmod</code> applied to <code>db.yml</code> will have no effect at all — which is exactly the situation in which people conclude permissions are broken and reach for <code>777</code>.</p>
<pre><code class="language-bash"><span class="tok-comment"># The correct fix: grant traversal on the one directory that blocks it</span>
sudo chmod o+x /srv/app
<span class="tok-comment"># or, better, use a group</span>
sudo chgrp -R webread /srv/app/config &amp;&amp; sudo usermod -aG webread www-data</code></pre>

<h3>Step 3: reproduce as the right user</h3>
${slide('lx-04', 26, 'Thử bằng đúng danh tính — rồi đọc câu báo lỗi')}
<pre><code>sudo -u www-data cat /srv/app/config/db.yml
sudo -u www-data test -r /srv/app/config/db.yml &amp;&amp; echo readable || echo NOT readable
sudo -u postgres psql -c 'select 1'</code></pre>
<div class="out">cat: /srv/app/config/db.yml: Permission denied
NOT readable</div>
<p>This is the step that converts an argument into evidence. If the command succeeds as that user, then the file is fine and the real difference is elsewhere — a different working directory, a different <code>PATH</code>, a systemd sandbox setting, or a relative path resolved from somewhere you did not expect.</p>

<h3>Step 4: the causes that are not permissions</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Read-only filesystem</span><span class="v"><code>mount | grep '(ro,'</code>. A disk that hit an I/O error gets remounted read-only by the kernel to protect it. Everything looks writable in <code>ls -l</code> and nothing can be written. Check <code>dmesg -T | grep -i 'remount\\|I/O error'</code>.</span></div>
  <div class="kv"><span class="k">Immutable attribute</span><span class="v"><code>lsattr file</code> showing <code>----i---------</code>. Even root cannot write it until <code>sudo chattr -i file</code>. Rare, and utterly baffling if you do not know the attribute exists.</span></div>
  <div class="kv"><span class="k">Disk or inodes full</span><span class="v"><code>df -h</code> and <code>df -i</code>. A full disk usually says "No space left", but some programs report the failed write as a permission problem. Inode exhaustion is worse: <code>df -h</code> shows free space while every create fails.</span></div>
  <div class="kv"><span class="k">Missing execute bit</span><span class="v"><code>./script.sh: Permission denied</code> with the file plainly there. <code>chmod +x</code>. This is the most common one of all, and Chapter 1 met it already.</span></div>
  <div class="kv"><span class="k">Bad interpreter</span><span class="v"><code>bad interpreter: No such file or directory</code> on a script that exists. Usually Windows line endings — the shebang reads <code>#!/bin/bash\\r</code>. <code>tr -d '\\r'</code> or <code>dos2unix</code> (Lesson 3.4).</span></div>
  <div class="kv"><span class="k">noexec mount</span><span class="v">Scripts in <code>/tmp</code> refusing to run on a hardened server. <code>mount | grep /tmp</code> shows <code>noexec</code> — the filesystem forbids execution regardless of the mode bits.</span></div>
</div>

<h3>Three messages, three different problems</h3>
${slide('lx-04', 27, 'Chỉ-đọc, bất biến, noexec: chmod vô dụng')}
<p>Before running any fix, read <em>which</em> of three sentences you got. They come from three different error numbers, and each points somewhere else:</p>
<table>
<tr><th>Message</th><th>errno</th><th>What it usually means</th><th>First check</th></tr>
<tr><td><code>Permission denied</code></td><td>EACCES (13)</td><td>a permission bit said no: the file, a directory on the path, or a <code>noexec</code> mount</td><td><code>namei -l</code>, <code>id</code></td></tr>
<tr><td><code>Operation not permitted</code></td><td>EPERM (1)</td><td>you may not do this operation at all: chown/chmod on someone else's file, deleting in a sticky directory, an immutable file, a missing capability</td><td><code>ls -l</code> (owner), <code>lsattr</code></td></tr>
<tr><td><code>Read-only file system</code></td><td>EROFS (30)</td><td>the whole filesystem is mounted read-only — root included</td><td><code>findmnt -O ro</code>, <code>dmesg</code></td></tr>
</table>
<pre><code class="language-bash"><span class="tok-comment"># as root, on a tmpfs, in a container started with --cap-add LINUX_IMMUTABLE</span>
chattr +i app.conf; lsattr app.conf
echo x &gt;&gt; app.conf
rm app.conf
chattr -i app.conf &amp;&amp; rm app.conf &amp;&amp; echo removed

<span class="tok-comment"># a container started with --read-only</span>
touch /etc/thu
findmnt -no TARGET,OPTIONS -T /etc | cut -c1-20

<span class="tok-comment"># a tmpfs mounted with noexec</span>
/mnt/nx/a.sh; echo $?
sh /mnt/nx/a.sh</code></pre>
<div class="out">----i----------------- app.conf
bash: app.conf: Operation not permitted
rm: cannot remove 'app.conf': Operation not permitted
removed
touch: cannot touch '/etc/thu': Read-only file system
/      ro,relatime
bash: /mnt/nx/a.sh: Permission denied
126
chay</div>
<p>Three details to keep. Root got <code>Operation not permitted</code> on an immutable file — no <code>chmod</code> or <code>sudo</code> changes that; only <code>chattr -i</code>. <code>noexec</code> blocks <em>executing</em> the file, not reading it, so <code>sh script</code> still runs it — it is a speed bump, not a security wall. And the check in Step 4 above was corrected on 28/09/2026: <code>mount | grep ' ro,'</code> can never match, because the first option always follows a <code>(</code> — <code>overlay on / type overlay (ro,relatime,…)</code>. Tested: the old pattern matched 0 lines in a read-only container, <code>grep '(ro,'</code> matched 13. Better still, <code>findmnt -O ro</code> lists read-only mounts directly.</p>

<h3>Step 5: above the permission bits</h3>
<pre><code>sudo dmesg -T | grep -i 'apparmor\\|denied' | tail -5      <span class="tok-comment"># Ubuntu/Debian</span>
sudo ausearch -m avc -ts recent                          <span class="tok-comment"># RHEL/Fedora, SELinux</span>
getenforce                                               <span class="tok-comment"># is SELinux even on?</span></code></pre>
<div class="out">[Fri Aug 22 12:04:11 2026] audit: type=1400 apparmor="DENIED"
  operation="open" profile="/usr/sbin/mysqld" name="/srv/backup/dump.sql"
  requested_mask="r" denied_mask="r" fcntl=110 ouid=1001</div>
<p>Here the permissions are perfect and the access is still refused, because AppArmor's profile for <code>mysqld</code> lists the directories it may touch and <code>/srv/backup</code> is not one of them. Nothing in <code>ls -l</code> hints at this. If you have checked ownership, mode and path traversal and it still fails, this is where to look — and the log line names the profile, the operation and the path, which is everything you need.</p>

<h3>Ten symptoms and their real fixes</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">./deploy.sh: Permission denied</span><span class="v">Missing <code>x</code>. → <code>chmod +x deploy.sh</code></span></div>
  <div class="kv"><span class="k">bad interpreter: No such file or directory</span><span class="v">CRLF line endings, or the shebang path is wrong. → <code>dos2unix</code>, or check <code>head -1</code>.</span></div>
  <div class="kv"><span class="k">WARNING: UNPROTECTED PRIVATE KEY FILE</span><span class="v">SSH key readable by others. → <code>chmod 600 ~/.ssh/id_ed25519 &amp;&amp; chmod 700 ~/.ssh</code></span></div>
  <div class="kv"><span class="k">docker: permission denied … docker.sock</span><span class="v">Not in the <code>docker</code> group, or in it but not re-logged-in. → <code>usermod -aG docker \$USER</code>, then log out and back in.</span></div>
  <div class="kv"><span class="k">EACCES: permission denied, mkdir '/usr/lib/node_modules'</span><span class="v">npm installing globally without root. → use a Node version manager, or <code>npm config set prefix ~/.npm-global</code>. Do NOT <code>sudo npm i -g</code>.</span></div>
  <div class="kv"><span class="k">nginx: 13: Permission denied (upstream)</span><span class="v">nginx cannot traverse to your socket or files as <code>www-data</code>. → <code>namei -l</code> the socket path; usually a home directory at <code>700</code>.</span></div>
  <div class="kv"><span class="k">bind: Permission denied on port 80</span><span class="v">Ports below 1024 need privilege. → <code>setcap 'cap_net_bind_service=+ep' \$(which node)</code>, or put nginx in front.</span></div>
  <div class="kv"><span class="k">could not open file "…": Permission denied (postgres)</span><span class="v">The <code>postgres</code> user cannot reach a path under your home. → move the file to <code>/tmp</code> or <code>/var/lib/postgresql</code>.</span></div>
  <div class="kv"><span class="k">Operation not permitted (as root!)</span><span class="v">Not a permission bit at all: immutable attribute, read-only mount, or a container without the capability. → <code>lsattr</code>, <code>mount</code>, then the container's <code>--cap-add</code>.</span></div>
  <div class="kv"><span class="k">sudo: /etc/sudoers is world writable</span><span class="v">sudo refuses to run at all. → recovery console, then <code>chmod 440 /etc/sudoers</code>. This is why <code>visudo</code> exists.</span></div>
</div>

<h3>A worked example</h3>
<pre><code><span class="tok-comment"># Symptom: the app's uploads fail in production, works locally</span>
sudo -u www-data touch /srv/app/uploads/test.txt</code></pre>
<div class="out">touch: cannot touch '/srv/app/uploads/test.txt': Permission denied</div>
<pre><code>namei -l /srv/app/uploads</code></pre>
<div class="out">f: /srv/app/uploads
 dr-xr-xr-x root   root   /
 drwxr-xr-x root   root   srv
 drwxr-xr-x deploy deploy app
 drwxr-xr-x deploy deploy uploads     ← www-data can enter and READ, but not WRITE</div>
<pre><code class="language-bash">id www-data
<span class="tok-comment"># uid=33(www-data) gid=33(www-data) groups=33(www-data)</span>

<span class="tok-comment"># Not the owner, not in the deploy group → the "other" bits apply: r-x. No w.</span>
<span class="tok-comment"># Fix: give the directory to the user that must write it.</span>
sudo chown www-data:www-data /srv/app/uploads
sudo chmod 755 /srv/app/uploads

<span class="tok-comment"># Verify with the SAME command that failed</span>
sudo -u www-data touch /srv/app/uploads/test.txt &amp;&amp; echo OK</code></pre>
<div class="out">OK</div>
<p>Six commands, no guessing, and the change was to exactly one directory. Compare with <code>chmod -R 777 /srv/app</code>, which would also have "worked", would have made every file on the site world-writable, and would have taught you nothing about why.</p>

<h3>Run it step by step</h3>
<p>The whole procedure on the <code>db.yml</code> case from Lesson 4.1, in a container as root (user <code>an</code> exists, <code>sudo</code> installed):</p>
<pre><code class="language-bash">mkdir -p /srv/app/config &amp;&amp; echo 'db: prod' &gt; /srv/app/config/db.yml
chown -R an:an /srv/app &amp;&amp; chmod 750 /srv/app
id www-data                                  <span class="tok-comment"># 1 who</span>
sudo -u www-data cat /srv/app/config/db.yml  <span class="tok-comment"># 3 prove it</span>
namei -l /srv/app/config/db.yml              <span class="tok-comment"># 2 which door</span>
findmnt -no OPTIONS -T /srv/app | cut -d, -f1  <span class="tok-comment"># 4 read-only?</span>
chmod o+x /srv/app                           <span class="tok-comment"># 6 one change</span>
sudo -u www-data cat /srv/app/config/db.yml
stat -c '%A %a %n' /srv/app
sudo -u www-data ls /srv/app</code></pre>
<div class="out">uid=33(www-data) gid=33(www-data) groups=33(www-data)
cat: /srv/app/config/db.yml: Permission denied
f: /srv/app/config/db.yml
drwxr-xr-x root root /
drwxr-xr-x root root srv
drwxr-x--- an   an   app
drwxr-xr-x an   an   config
-rw-r--r-- an   an   db.yml
rw
db: prod
drwxr-x--x 751 /srv/app
ls: cannot open directory '/srv/app': Permission denied</div>
<p>The last two lines are the elegant part: <code>751</code> gives <code>www-data</code> only the traverse bit on <code>app</code>. It can reach the one file whose path it is configured with, and it still cannot list what else lives there — the least access that makes the error go away.</p>

<h3>On macOS and Fedora: what is different</h3>
${slide('lx-04', 28, 'macOS và Fedora khác gì: ACL, dscl, nhãn SELinux')}
<ul>
<li><strong>Fedora adds SELinux</strong>, a mandatory layer above the bits (it is <code>Enforcing</code> on <code>linux-nha</code>). The trailing <code>.</code> in <code>ls -l</code> means a label is attached; <code>ls -Z</code> shows it: <code>system_u:object_r:shadow_t:s0 /etc/shadow</code>. A web server may be refused a file with perfect bits because its label is wrong — Chapter 14 covers <code>ausearch</code>/<code>audit2why</code>. On the same machine <code>/etc/shadow</code> is <code>----------</code> (mode 000): only root, which skips the bits, can read it.</li>
<li><strong>Ubuntu uses AppArmor</strong> instead: profiles per program, denials in <code>dmesg</code>/<code>journalctl -k</code> as <code>apparmor="DENIED"</code> (Step 5).</li>
<li><strong>macOS has no <code>namei</code></strong>. Walk the path yourself: <code>p=$HOME/Library/Keychains; while [ "$p" != / ]; do ls -lde "$p"; p=$(dirname "$p"); done</code> — the <code>-e</code> also prints ACL lines such as <code>0: group:everyone deny delete</code> on <code>~/Library</code>.</li>
<li><strong>WSL</strong> behaves like Ubuntu inside <code>~</code>; for "Permission denied" under <code>/mnt/c</code>, the answer is usually a Windows permission or a file locked by a Windows program, not a Linux bit.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> three tickets arrive after a deploy, all saying "Permission denied or similar". Diagnose each in a container and name the cause <em>before</em> fixing it.</p><ol>
<li>Start <code>docker run --rm -it --name lx04-u --cap-add LINUX_IMMUTABLE --tmpfs /mnt/nx:noexec --tmpfs /mnt/tm ubuntu:24.04 bash</code>, then <code>useradd -m an</code>.</li>
<li>Ticket A — uploads: <code>mkdir -p /srv/web/uploads &amp;&amp; chown -R an:an /srv/web &amp;&amp; chmod 755 /srv/web/uploads</code>; <code>www-data</code> must be able to create files there.</li>
<li>Ticket B — config: <code>echo 'port: 3000' &gt; /mnt/tm/app.conf &amp;&amp; chattr +i /mnt/tm/app.conf</code>; even root cannot append to it.</li>
<li>Ticket C — script: put a two-line script in <code>/mnt/nx</code>, <code>chmod +x</code> it, and run it.</li></ol>
<p><strong>Done when:</strong> for each ticket you wrote down the exact message (A: <code>Permission denied</code>, B: <code>Operation not permitted</code>, C: <code>Permission denied</code> with exit code 126), the command that proved the cause (<code>namei -l</code> + <code>id www-data</code>; <code>lsattr</code>; <code>mount | grep /mnt/nx</code> showing <code>noexec</code>), and a fix that touched one thing — for A, <code>sudo -u www-data touch /srv/web/uploads/test.txt &amp;&amp; echo OK</code> prints <code>OK</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">errno</span><span class="v">The number a failed system call returns; the message you read is its text (13 EACCES, 1 EPERM, 30 EROFS).</span></div>
  <div class="kv"><span class="k">Path traversal check</span><span class="v">The x check on every directory of a path; <code>namei -l</code> prints them all.</span></div>
  <div class="kv"><span class="k">Immutable attribute</span><span class="v">A filesystem flag (<code>chattr +i</code>) that forbids any change, even by root, until removed.</span></div>
  <div class="kv"><span class="k">Mount option</span><span class="v">A rule for a whole filesystem (<code>ro</code>, <code>noexec</code>, <code>nosuid</code>) that overrides the bits.</span></div>
  <div class="kv"><span class="k">MAC (mandatory access control)</span><span class="v">A policy layer above the bits — AppArmor on Ubuntu, SELinux on Fedora/RHEL.</span></div>
  <div class="kv"><span class="k">Security context (SELinux label)</span><span class="v">The <code>user:role:type:level</code> tag shown by <code>ls -Z</code>; the type (e.g. <code>shadow_t</code>) is what policy checks.</span></div>
  <div class="kv"><span class="k">Least privilege</span><span class="v">Give exactly the access that is needed — <code>751</code> instead of <code>777</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Six steps: who (<code>id</code>/<code>ps</code>), which door (<code>namei -l</code>), prove it (<code>sudo -u</code>), not the bits?, above the bits, fix one thing.</li>
<li>Never test a permission problem as root: root skips the bits and proves nothing.</li>
<li>Read the message: <code>Permission denied</code> = a bit, <code>Operation not permitted</code> = ownership/attribute/capability, <code>Read-only file system</code> = the mount.</li>
<li><code>chattr +i</code> stops even root; <code>noexec</code> stops executing but not <code>sh file</code>.</li>
<li>Use <code>findmnt -O ro</code> (or <code>grep '(ro,'</code>) — <code>grep ' ro,'</code> never matches.</li>
<li>On Fedora an SELinux label can refuse what the bits allow; on macOS walk the path with <code>ls -lde</code>.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/man1/namei.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">namei(1) — the path-walking tool</span><span class="lc-sub">Short man page for the single most useful permission-debugging command. <code>-l</code> is the flag you want, every time.</span></span>
</a>
<a class="link-card" href="https://ubuntu.com/server/docs/apparmor" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">Ubuntu — AppArmor</span><span class="lc-sub">How to read a DENIED log line, put a profile into complain mode to diagnose without breaking things, and where profiles live.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man1/chattr.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">chattr(1) / lsattr(1) — file attributes</span><span class="lc-sub">The immutable and append-only flags: what they block, and why even root has to remove them deliberately.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: five broken permissions, five diagnoses</span><span class="lc-sub">Each scenario fails with the same message and has a different cause — path traversal, wrong user, missing <code>x</code>, read-only mount, immutable bit. Graded on the fix, not the symptom.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> testing with <code>sudo</code> and concluding the file is fine. <code>sudo cat /srv/app/config/db.yml</code> works because root bypasses permission checks entirely — it tells you nothing about whether <code>www-data</code> can read it. Every test must be run <em>as the identity that is failing</em>: <code>sudo -u www-data cat …</code>. Using root to check a permission problem is like using the master key to test whether someone's key works.</div>
<p class="note-ct"><strong>The two commands that solve most of these:</strong> <code>namei -l &lt;path&gt;</code> to see where the walk stops, and <code>sudo -u &lt;user&gt; &lt;command&gt;</code> to reproduce the failure as the right identity. Run those two before changing anything, and you will find that the fix is nearly always a single <code>chmod</code> or <code>chgrp</code> on one directory — and you will know why it worked, which is what makes it stay fixed.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.5</span>
<h2>Chẩn đoán "Permission denied"</h2>
<p class="lead">Ba chữ, và ít nhất tám nguyên nhân khác nhau — trong đó vài cái hoàn toàn không phải chuyện quyền. Bài này là cái quy trình biến việc đoán mò thành việc ĐỌC RA. Nó chạy hết chừng ba mươi giây, và kết thúc bằng việc bạn đổi đúng một thứ cụ thể thay vì cứ nâng quyền lên cho tới khi thông báo lỗi biến mất.</p>

<h3>Quy trình</h3>
${slide('lx-04', 25, 'Chẩn đoán 6 bước: đọc ra nguyên nhân, đừng vớ sudo')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Ai</span><span class="lz-t">id</span><span class="lz-d">Tiến trình đang hỏng THẬT SỰ chạy với UID nào và những nhóm nào? Với một dịch vụ thì không phải bạn — hãy xem unit hoặc dùng ps.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Đường dẫn nào</span><span class="lz-t">namei -l /đường/dẫn/đầy/đủ</span><span class="lz-d">In ra chế độ và chủ sở hữu của MỌI thành phần. Cái đang hỏng thường là một thư mục nằm lưng chừng, không phải file ở cuối.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Chứng minh</span><span class="lz-t">sudo -u &lt;người-đó&gt; &lt;đúng lệnh đó&gt;</span><span class="lz-d">Dựng lại chỗ hỏng với danh tính đó. Nếu giờ nó chạy được thì vấn đề không nằm ở file — nó nằm ở môi trường, ở thư mục làm việc, hoặc ở đâu đó phía trên.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Không phải quyền?</span><span class="lz-t">mount | grep '(ro,' · lsattr file · df -h</span><span class="lz-d">Hệ thống file chỉ-đọc, thuộc tính bất biến, hay đĩa đầy đều báo ra thành từ chối hoặc thất bại. Không cái nào chữa được bằng chmod.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Phía trên các bit</span><span class="lz-t">dmesg -T | tail · ausearch -m avc -ts recent</span><span class="lz-d">Từ chối của AppArmor hay SELinux KHÔNG BAO GIỜ hiện ra trong ls -l. Nếu các bit trông đúng mà vẫn hỏng, hãy nhìn vào đây.</span></div>
  <div class="lz-step"><span class="lz-k">6 · Sửa một thứ</span><span class="lz-t">chmod / chown / usermod lên ĐÚNG thành phần bạn vừa xác định</span><span class="lz-d">Rồi chạy lại bước 3 để xác nhận. Đừng bao giờ chmod 777 rồi đi tiếp.</span></div>
</div>

<h3>Bước 1: ai thật sự đang chạy cái này</h3>
<pre><code class="language-bash">id                                    <span class="tok-comment"># bạn, ngay lúc này</span>
ps -o user,group,pid,cmd -C nginx     <span class="tok-comment"># một tiến trình đang chạy dưới danh nghĩa ai</span>
systemctl show myapp -p User -p Group <span class="tok-comment"># một unit được cấu hình dùng danh nghĩa nào</span></code></pre>
<div class="out">uid=1001(deploy) gid=1001(deploy) groups=1001(deploy),1002(developers)
USER     GROUP    PID CMD
root     root     812 nginx: master process
www-data www-data 813 nginx: worker process</div>
<div class="callout">Tiến trình chủ của nginx chạy bằng root — nó buộc phải thế, để gắn được vào cổng 80 — nhưng những <em>TIẾN TRÌNH THỢ</em> vốn là thứ đi đọc file của bạn thì chạy bằng <code>www-data</code>. Nên câu "nginx không đọc được file của tôi" là câu hỏi về <code>www-data</code>, không phải về root, và thử bằng root thì chẳng chứng minh được gì. Sự chia đôi đó tồn tại ở phần lớn máy chủ: một tiến trình cha có đặc quyền và những tiến trình con không có.</div>

<h3>Bước 2: đọc cả đường dẫn</h3>
<pre><code>namei -l /srv/app/config/db.yml</code></pre>
<div class="out">f: /srv/app/config/db.yml
 dr-xr-xr-x root   root   /
 drwxr-xr-x root   root   srv
 drwxr-x--- deploy deploy app        ← other KHÔNG có gì ở đây
 drwxr-xr-x deploy deploy config
 -rw-r--r-- deploy deploy db.yml</div>
<p>File thì cả thế giới đọc được. Chuyện đó không quan trọng: <code>www-data</code> không phải <code>deploy</code> và không ở trong nhóm <code>deploy</code>, nên nó không đi xuyên qua được <code>app</code>, và cuộc đi dừng lại ngay đó (Bài 4.1). Mọi lệnh <code>chmod</code> áp lên <code>db.yml</code> sẽ hoàn toàn không có tác dụng — và đó chính xác là tình huống mà người ta kết luận rằng hệ thống quyền bị hỏng rồi vớ lấy <code>777</code>.</p>
<pre><code class="language-bash"><span class="tok-comment"># Cách chữa đúng: cấp quyền đi xuyên qua trên đúng cái thư mục đang chặn</span>
sudo chmod o+x /srv/app
<span class="tok-comment"># hoặc, tốt hơn, dùng một nhóm</span>
sudo chgrp -R webread /srv/app/config &amp;&amp; sudo usermod -aG webread www-data</code></pre>

<h3>Bước 3: dựng lại với đúng người dùng</h3>
${slide('lx-04', 26, 'Thử bằng đúng danh tính — rồi đọc câu báo lỗi')}
<pre><code>sudo -u www-data cat /srv/app/config/db.yml
sudo -u www-data test -r /srv/app/config/db.yml &amp;&amp; echo đọc được || echo KHÔNG đọc được
sudo -u postgres psql -c 'select 1'</code></pre>
<div class="out">cat: /srv/app/config/db.yml: Permission denied
KHÔNG đọc được</div>
<p>Đây là bước biến một cuộc tranh cãi thành bằng chứng. Nếu lệnh chạy được với danh nghĩa người dùng đó, thì file không có vấn đề gì và khác biệt thật nằm ở chỗ khác — một thư mục làm việc khác, một <code>PATH</code> khác, một thiết lập hộp cát của systemd, hay một đường dẫn tương đối được giải từ chỗ bạn không ngờ tới.</p>

<h3>Bước 4: những nguyên nhân KHÔNG phải quyền</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Hệ thống file chỉ-đọc</span><span class="v"><code>mount | grep '(ro,'</code>. Một cái đĩa gặp lỗi I/O sẽ bị nhân gắn lại ở chế độ chỉ-đọc để bảo vệ nó. Mọi thứ nhìn trong <code>ls -l</code> đều ghi được mà chẳng ghi được gì cả. Hãy kiểm <code>dmesg -T | grep -i 'remount\\|I/O error'</code>.</span></div>
  <div class="kv"><span class="k">Thuộc tính bất biến</span><span class="v"><code>lsattr file</code> hiện ra <code>----i---------</code>. Ngay cả root cũng không ghi được cho tới khi <code>sudo chattr -i file</code>. Hiếm, và cực kỳ khó hiểu nếu bạn không biết là có cái thuộc tính đó.</span></div>
  <div class="kv"><span class="k">Hết đĩa hoặc hết inode</span><span class="v"><code>df -h</code> và <code>df -i</code>. Đĩa đầy thường báo "No space left", nhưng vài chương trình báo lần ghi hỏng đó thành vấn đề quyền. Hết inode còn tệ hơn: <code>df -h</code> hiện ra vẫn còn chỗ trống trong khi mọi lệnh tạo file đều hỏng.</span></div>
  <div class="kv"><span class="k">Thiếu bit chạy</span><span class="v"><code>./script.sh: Permission denied</code> trong khi file rành rành ở đó. <code>chmod +x</code>. Đây là cái phổ biến nhất trong tất cả, và Chương 1 đã gặp rồi.</span></div>
  <div class="kv"><span class="k">Sai trình thông dịch</span><span class="v"><code>bad interpreter: No such file or directory</code> trên một script có thật. Thường là kết thúc dòng kiểu Windows — dòng shebang đọc ra thành <code>#!/bin/bash\\r</code>. Dùng <code>tr -d '\\r'</code> hoặc <code>dos2unix</code> (Bài 3.4).</span></div>
  <div class="kv"><span class="k">Gắn với cờ noexec</span><span class="v">Script trong <code>/tmp</code> từ chối chạy trên một máy chủ đã gia cố. <code>mount | grep /tmp</code> hiện ra <code>noexec</code> — hệ thống file CẤM chạy bất kể các bit chế độ.</span></div>
</div>

<h3>Ba câu báo lỗi, ba vấn đề khác nhau</h3>
${slide('lx-04', 27, 'Chỉ-đọc, bất biến, noexec: chmod vô dụng')}
<p>Trước khi sửa bất cứ gì, hãy đọc xem mình nhận được <em>CÂU NÀO</em> trong ba câu. Chúng đến từ ba mã lỗi khác nhau, và mỗi câu chỉ về một hướng khác:</p>
<table>
<tr><th>Câu báo lỗi</th><th>errno</th><th>Thường nghĩa là</th><th>Kiểm đầu tiên</th></tr>
<tr><td><code>Permission denied</code></td><td>EACCES (13)</td><td>một bit quyền nói không: chính file, một thư mục trên đường, hay một điểm gắn <code>noexec</code></td><td><code>namei -l</code>, <code>id</code></td></tr>
<tr><td><code>Operation not permitted</code></td><td>EPERM (1)</td><td>bạn không được làm thao tác này: chown/chmod file của người khác, xoá trong thư mục có bit dính, file bất biến, thiếu capability</td><td><code>ls -l</code> (chủ), <code>lsattr</code></td></tr>
<tr><td><code>Read-only file system</code></td><td>EROFS (30)</td><td>cả hệ thống file đang gắn chỉ-đọc — root cũng chịu</td><td><code>findmnt -O ro</code>, <code>dmesg</code></td></tr>
</table>
<pre><code class="language-bash"><span class="tok-comment"># root, trên tmpfs, trong container chạy với --cap-add LINUX_IMMUTABLE</span>
chattr +i app.conf; lsattr app.conf
echo x &gt;&gt; app.conf
rm app.conf
chattr -i app.conf &amp;&amp; rm app.conf &amp;&amp; echo removed

<span class="tok-comment"># container chạy với --read-only</span>
touch /etc/thu
findmnt -no TARGET,OPTIONS -T /etc | cut -c1-20

<span class="tok-comment"># tmpfs gắn với noexec</span>
/mnt/nx/a.sh; echo $?
sh /mnt/nx/a.sh</code></pre>
<div class="out">----i----------------- app.conf
bash: app.conf: Operation not permitted
rm: cannot remove 'app.conf': Operation not permitted
removed
touch: cannot touch '/etc/thu': Read-only file system
/      ro,relatime
bash: /mnt/nx/a.sh: Permission denied
126
chay</div>
<p>Ba chi tiết cần giữ. Root nhận <code>Operation not permitted</code> trên một file bất biến — không <code>chmod</code> hay <code>sudo</code> nào đổi được chuyện đó; chỉ <code>chattr -i</code>. <code>noexec</code> chặn việc <em>CHẠY</em> file, không chặn việc đọc, nên <code>sh script</code> vẫn chạy được nó — đó là một gờ giảm tốc, không phải bức tường an ninh. Và phép kiểm ở Bước 4 phía trên đã được sửa ngày 28/09/2026: <code>mount | grep ' ro,'</code> không bao giờ khớp được, vì tuỳ chọn đầu tiên luôn đứng sau một dấu <code>(</code> — <code>overlay on / type overlay (ro,relatime,…)</code>. Đã thử: mẫu cũ khớp 0 dòng trong một container chỉ-đọc, <code>grep '(ro,'</code> khớp 13 dòng. Tốt hơn nữa, <code>findmnt -O ro</code> liệt kê thẳng các điểm gắn chỉ-đọc.</p>

<h3>Bước 5: phía trên các bit quyền</h3>
<pre><code>sudo dmesg -T | grep -i 'apparmor\\|denied' | tail -5      <span class="tok-comment"># Ubuntu/Debian</span>
sudo ausearch -m avc -ts recent                          <span class="tok-comment"># RHEL/Fedora, SELinux</span>
getenforce                                               <span class="tok-comment"># SELinux có bật không đã?</span></code></pre>
<div class="out">[Fri Aug 22 12:04:11 2026] audit: type=1400 apparmor="DENIED"
  operation="open" profile="/usr/sbin/mysqld" name="/srv/backup/dump.sql"
  requested_mask="r" denied_mask="r" fcntl=110 ouid=1001</div>
<p>Ở đây quyền hoàn hảo mà truy cập vẫn bị từ chối, vì hồ sơ AppArmor cho <code>mysqld</code> liệt kê những thư mục nó được phép đụng vào và <code>/srv/backup</code> không nằm trong số đó. Không có gì trong <code>ls -l</code> gợi ý chuyện này. Nếu bạn đã kiểm quyền sở hữu, chế độ và việc đi xuyên qua đường dẫn mà vẫn hỏng, đây là chỗ cần nhìn — và dòng log nêu tên hồ sơ, thao tác và đường dẫn, tức là đủ mọi thứ bạn cần.</p>

<h3>Mười triệu chứng và cách chữa thật của chúng</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">./deploy.sh: Permission denied</span><span class="v">Thiếu <code>x</code>. → <code>chmod +x deploy.sh</code></span></div>
  <div class="kv"><span class="k">bad interpreter: No such file or directory</span><span class="v">Kết thúc dòng CRLF, hoặc đường dẫn shebang sai. → <code>dos2unix</code>, hoặc kiểm <code>head -1</code>.</span></div>
  <div class="kv"><span class="k">WARNING: UNPROTECTED PRIVATE KEY FILE</span><span class="v">Khoá SSH người khác đọc được. → <code>chmod 600 ~/.ssh/id_ed25519 &amp;&amp; chmod 700 ~/.ssh</code></span></div>
  <div class="kv"><span class="k">docker: permission denied … docker.sock</span><span class="v">Không ở trong nhóm <code>docker</code>, hoặc đã ở trong mà chưa đăng nhập lại. → <code>usermod -aG docker \$USER</code>, rồi đăng xuất và vào lại.</span></div>
  <div class="kv"><span class="k">EACCES: permission denied, mkdir '/usr/lib/node_modules'</span><span class="v">npm cài toàn cục mà không có root. → dùng một trình quản lý phiên bản Node, hoặc <code>npm config set prefix ~/.npm-global</code>. ĐỪNG <code>sudo npm i -g</code>.</span></div>
  <div class="kv"><span class="k">nginx: 13: Permission denied (upstream)</span><span class="v">nginx không đi xuyên tới được socket hay file của bạn với danh nghĩa <code>www-data</code>. → chạy <code>namei -l</code> lên đường dẫn socket; thường là một thư mục nhà đang để <code>700</code>.</span></div>
  <div class="kv"><span class="k">bind: Permission denied trên cổng 80</span><span class="v">Cổng dưới 1024 cần đặc quyền. → <code>setcap 'cap_net_bind_service=+ep' \$(which node)</code>, hoặc đặt nginx đứng trước.</span></div>
  <div class="kv"><span class="k">could not open file "…": Permission denied (postgres)</span><span class="v">Người dùng <code>postgres</code> không với tới được một đường dẫn nằm dưới thư mục nhà của bạn. → chuyển file sang <code>/tmp</code> hoặc <code>/var/lib/postgresql</code>.</span></div>
  <div class="kv"><span class="k">Operation not permitted (dù đang là root!)</span><span class="v">Hoàn toàn không phải bit quyền: thuộc tính bất biến, gắn chỉ-đọc, hoặc một container thiếu capability. → <code>lsattr</code>, <code>mount</code>, rồi tới <code>--cap-add</code> của container.</span></div>
  <div class="kv"><span class="k">sudo: /etc/sudoers is world writable</span><span class="v">sudo từ chối chạy hoàn toàn. → console cứu hộ, rồi <code>chmod 440 /etc/sudoers</code>. Đây chính là lý do <code>visudo</code> tồn tại.</span></div>
</div>

<h3>Một ví dụ làm từ đầu tới cuối</h3>
<pre><code><span class="tok-comment"># Triệu chứng: chức năng tải lên của ứng dụng hỏng trên production, chạy tốt ở máy nhà</span>
sudo -u www-data touch /srv/app/uploads/test.txt</code></pre>
<div class="out">touch: cannot touch '/srv/app/uploads/test.txt': Permission denied</div>
<pre><code>namei -l /srv/app/uploads</code></pre>
<div class="out">f: /srv/app/uploads
 dr-xr-xr-x root   root   /
 drwxr-xr-x root   root   srv
 drwxr-xr-x deploy deploy app
 drwxr-xr-x deploy deploy uploads     ← www-data vào và ĐỌC được, nhưng không GHI được</div>
<pre><code class="language-bash">id www-data
<span class="tok-comment"># uid=33(www-data) gid=33(www-data) groups=33(www-data)</span>

<span class="tok-comment"># Không phải chủ, không ở trong nhóm deploy → các bit "other" áp dụng: r-x. Không có w.</span>
<span class="tok-comment"># Chữa: giao thư mục cho đúng người dùng phải ghi vào nó.</span>
sudo chown www-data:www-data /srv/app/uploads
sudo chmod 755 /srv/app/uploads

<span class="tok-comment"># Kiểm lại bằng CHÍNH cái lệnh vừa hỏng</span>
sudo -u www-data touch /srv/app/uploads/test.txt &amp;&amp; echo OK</code></pre>
<div class="out">OK</div>
<p>Sáu lệnh, không đoán mò, và thay đổi rơi vào đúng một thư mục. Hãy so với <code>chmod -R 777 /srv/app</code>, thứ cũng sẽ "chạy được", cũng sẽ làm mọi file của trang web trở nên cả thế giới ghi được, và cũng sẽ chẳng dạy bạn được gì về lý do.</p>

<h3>Chạy thử từng bước</h3>
<p>Trọn quy trình trên đúng ca <code>db.yml</code> của Bài 4.1, trong container với quyền root (đã có người dùng <code>an</code>, đã cài <code>sudo</code>):</p>
<pre><code class="language-bash">mkdir -p /srv/app/config &amp;&amp; echo 'db: prod' &gt; /srv/app/config/db.yml
chown -R an:an /srv/app &amp;&amp; chmod 750 /srv/app
id www-data                                  <span class="tok-comment"># 1 ai</span>
sudo -u www-data cat /srv/app/config/db.yml  <span class="tok-comment"># 3 chứng minh</span>
namei -l /srv/app/config/db.yml              <span class="tok-comment"># 2 cửa nào</span>
findmnt -no OPTIONS -T /srv/app | cut -d, -f1  <span class="tok-comment"># 4 chỉ-đọc?</span>
chmod o+x /srv/app                           <span class="tok-comment"># 6 một thay đổi</span>
sudo -u www-data cat /srv/app/config/db.yml
stat -c '%A %a %n' /srv/app
sudo -u www-data ls /srv/app</code></pre>
<div class="out">uid=33(www-data) gid=33(www-data) groups=33(www-data)
cat: /srv/app/config/db.yml: Permission denied
f: /srv/app/config/db.yml
drwxr-xr-x root root /
drwxr-xr-x root root srv
drwxr-x--- an   an   app
drwxr-xr-x an   an   config
-rw-r--r-- an   an   db.yml
rw
db: prod
drwxr-x--x 751 /srv/app
ls: cannot open directory '/srv/app': Permission denied</div>
<p>Hai dòng cuối là phần đẹp nhất: <code>751</code> chỉ cho <code>www-data</code> đúng bit đi xuyên qua trên <code>app</code>. Nó với tới được đúng cái file mà nó được cấu hình đường dẫn, và vẫn không liệt kê được còn gì khác ở đó — quyền ít nhất đủ để lỗi biến mất.</p>

<h3>Trên macOS và Fedora khác gì</h3>
${slide('lx-04', 28, 'macOS và Fedora khác gì: ACL, dscl, nhãn SELinux')}
<ul>
<li><strong>Fedora có thêm SELinux</strong>, một lớp bắt buộc nằm trên các bit (đang <code>Enforcing</code> trên <code>linux-nha</code>). Dấu <code>.</code> cuối cột quyền của <code>ls -l</code> nghĩa là file có nhãn; <code>ls -Z</code> in ra nhãn đó: <code>system_u:object_r:shadow_t:s0 /etc/shadow</code>. Một máy chủ web có thể bị từ chối một file có bit hoàn hảo vì nhãn sai — Chương 14 dạy <code>ausearch</code>/<code>audit2why</code>. Cũng trên máy đó, <code>/etc/shadow</code> là <code>----------</code> (chế độ 000): chỉ root, kẻ bỏ qua các bit, mới đọc được.</li>
<li><strong>Ubuntu dùng AppArmor</strong> thay vào: hồ sơ cho từng chương trình, lời từ chối nằm trong <code>dmesg</code>/<code>journalctl -k</code> dạng <code>apparmor="DENIED"</code> (Bước 5).</li>
<li><strong>macOS không có <code>namei</code></strong>. Tự đi dọc đường dẫn: <code>p=$HOME/Library/Keychains; while [ "$p" != / ]; do ls -lde "$p"; p=$(dirname "$p"); done</code> — cờ <code>-e</code> in luôn các dòng ACL như <code>0: group:everyone deny delete</code> trên <code>~/Library</code>.</li>
<li><strong>WSL</strong> hành xử như Ubuntu bên trong <code>~</code>; còn "Permission denied" dưới <code>/mnt/c</code> thì câu trả lời thường là quyền của Windows hoặc một file đang bị chương trình Windows khoá, không phải một bit Linux.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> sau một lần deploy có ba phiếu báo lỗi, phiếu nào cũng ghi "Permission denied hay gì đó tương tự". Chẩn đoán từng phiếu trong container và gọi tên nguyên nhân <em>TRƯỚC</em> khi sửa.</p><ol>
<li>Chạy <code>docker run --rm -it --name lx04-u --cap-add LINUX_IMMUTABLE --tmpfs /mnt/nx:noexec --tmpfs /mnt/tm ubuntu:24.04 bash</code>, rồi <code>useradd -m an</code>.</li>
<li>Phiếu A — uploads: <code>mkdir -p /srv/web/uploads &amp;&amp; chown -R an:an /srv/web &amp;&amp; chmod 755 /srv/web/uploads</code>; <code>www-data</code> phải tạo được file ở đó.</li>
<li>Phiếu B — cấu hình: <code>echo 'port: 3000' &gt; /mnt/tm/app.conf &amp;&amp; chattr +i /mnt/tm/app.conf</code>; ngay cả root cũng không ghi thêm được.</li>
<li>Phiếu C — script: đặt một script hai dòng vào <code>/mnt/nx</code>, <code>chmod +x</code> rồi chạy nó.</li></ol>
<p><strong>Đạt khi:</strong> với mỗi phiếu bạn ghi lại đúng câu báo lỗi (A: <code>Permission denied</code>, B: <code>Operation not permitted</code>, C: <code>Permission denied</code> với mã thoát 126), lệnh đã chứng minh nguyên nhân (<code>namei -l</code> + <code>id www-data</code>; <code>lsattr</code>; <code>mount | grep /mnt/nx</code> hiện <code>noexec</code>), và một cách chữa chỉ đụng một thứ — với A, <code>sudo -u www-data touch /srv/web/uploads/test.txt &amp;&amp; echo OK</code> in ra <code>OK</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">errno (mã lỗi hệ thống)</span><span class="v">Con số mà một lời gọi hệ thống thất bại trả về; câu bạn đọc là chữ của nó (13 EACCES, 1 EPERM, 30 EROFS).</span></div>
  <div class="kv"><span class="k">Path traversal check (kiểm đi xuyên đường dẫn)</span><span class="v">Phép kiểm x trên mọi thư mục của một đường dẫn; <code>namei -l</code> in ra tất cả.</span></div>
  <div class="kv"><span class="k">Immutable attribute (thuộc tính bất biến)</span><span class="v">Cờ của hệ thống file (<code>chattr +i</code>) cấm mọi thay đổi, kể cả của root, cho tới khi gỡ.</span></div>
  <div class="kv"><span class="k">Mount option (tuỳ chọn gắn)</span><span class="v">Luật cho cả một hệ thống file (<code>ro</code>, <code>noexec</code>, <code>nosuid</code>) đè lên các bit.</span></div>
  <div class="kv"><span class="k">MAC — mandatory access control (kiểm soát truy cập bắt buộc)</span><span class="v">Lớp chính sách nằm trên các bit — AppArmor trên Ubuntu, SELinux trên Fedora/RHEL.</span></div>
  <div class="kv"><span class="k">Security context (nhãn SELinux)</span><span class="v">Thẻ <code>user:role:type:level</code> mà <code>ls -Z</code> in ra; phần type (ví dụ <code>shadow_t</code>) là thứ chính sách kiểm.</span></div>
  <div class="kv"><span class="k">Least privilege (quyền tối thiểu)</span><span class="v">Cấp đúng lượng quyền cần thiết — <code>751</code> thay vì <code>777</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Sáu bước: ai (<code>id</code>/<code>ps</code>), cửa nào (<code>namei -l</code>), chứng minh (<code>sudo -u</code>), không phải bit?, phía trên các bit, sửa một thứ.</li>
<li>Đừng bao giờ thử một vấn đề quyền bằng root: root bỏ qua các bit và chẳng chứng minh được gì.</li>
<li>Đọc câu báo lỗi: <code>Permission denied</code> = một bit, <code>Operation not permitted</code> = quyền sở hữu/thuộc tính/capability, <code>Read-only file system</code> = điểm gắn.</li>
<li><code>chattr +i</code> chặn cả root; <code>noexec</code> chặn chạy nhưng không chặn <code>sh file</code>.</li>
<li>Dùng <code>findmnt -O ro</code> (hoặc <code>grep '(ro,'</code>) — <code>grep ' ro,'</code> không bao giờ khớp.</li>
<li>Trên Fedora nhãn SELinux có thể từ chối thứ mà các bit cho phép; trên macOS đi dọc đường dẫn bằng <code>ls -lde</code>.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/man1/namei.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">namei(1) — công cụ đi dọc đường dẫn</span><span class="lc-sub">Trang man ngắn cho cái lệnh gỡ lỗi quyền hữu ích nhất. <code>-l</code> là cờ bạn cần, lần nào cũng vậy.</span></span>
</a>
<a class="link-card" href="https://ubuntu.com/server/docs/apparmor" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">Ubuntu — AppArmor</span><span class="lc-sub">Cách đọc một dòng log DENIED, cách đưa một hồ sơ vào chế độ complain để chẩn đoán mà không làm hỏng gì, và các hồ sơ nằm ở đâu.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man1/chattr.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">chattr(1) / lsattr(1) — thuộc tính file</span><span class="lc-sub">Các cờ bất biến và chỉ-nối-thêm: chúng chặn những gì, và vì sao ngay cả root cũng phải cố ý gỡ chúng.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: năm chỗ hỏng quyền, năm chẩn đoán</span><span class="lc-sub">Mỗi tình huống đều hỏng với cùng một thông báo và có một nguyên nhân khác nhau — đi xuyên đường dẫn, sai người dùng, thiếu <code>x</code>, gắn chỉ-đọc, bit bất biến. Chấm điểm theo CÁCH CHỮA, không theo triệu chứng.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> thử bằng <code>sudo</code> rồi kết luận file không sao. <code>sudo cat /srv/app/config/db.yml</code> chạy được vì root bỏ qua hoàn toàn mọi phép kiểm quyền — nó chẳng nói cho bạn biết gì về việc <code>www-data</code> có đọc được hay không. Mọi phép thử đều phải chạy <em>VỚI ĐÚNG DANH TÍNH ĐANG HỎNG</em>: <code>sudo -u www-data cat …</code>. Dùng root để kiểm một vấn đề quyền cũng như dùng chìa khoá vạn năng để thử xem chìa của người ta có mở được không.</div>
<p class="note-ct"><strong>Hai lệnh giải quyết phần lớn những chuyện này:</strong> <code>namei -l &lt;đường-dẫn&gt;</code> để thấy cuộc đi dừng ở đâu, và <code>sudo -u &lt;người-dùng&gt; &lt;lệnh&gt;</code> để dựng lại chỗ hỏng với đúng danh tính. Hãy chạy hai cái đó TRƯỚC KHI đổi bất cứ thứ gì, rồi bạn sẽ thấy cách chữa gần như luôn là đúng một lệnh <code>chmod</code> hoặc <code>chgrp</code> trên một thư mục — và bạn sẽ BIẾT vì sao nó chạy được, và chính điều đó làm nó ở nguyên trạng thái đã chữa.</p>
</div>
`,
    },
    /* ─────────────────────────── 4.6 Quiz ─────────────────────────── */
    {
      title: '4.6 — Chapter 4 quiz|||4.6 — Kiểm tra Chương 4',
      slug: 'lnx-4-6-quiz',
      type: 'QUIZ',
      description: 'Mười câu tình huống: lớp quyền không cộng dồn, bit x trên thư mục, umask 027, X hoa sau chmod -R 755, setgid và chmod 775, bit dính, usermod -G, sudo -n trong CI, journalctl và sudo, mask của ACL.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten questions, mostly "what does this print?" and "which change fixes it?". Every expected output was run on 28/09/2026 in an Ubuntu 24.04 container (and on Fedora 44 where the question says so).</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can read a mode like <code>drwxr-x--x</code>, say its octal number, and say which class applies to a given user.</li>
<li>I can explain what r, w and x mean on a directory, and find the blocking directory with <code>namei -l</code>.</li>
<li>I can predict the mode of a new file and directory from a umask, and fix a tree damaged by <code>chmod -R</code>.</li>
<li>I can build a shared team directory (group, setgid, umask), protect a world-writable one (sticky) and add one user with an ACL.</li>
<li>I can create accounts, add groups with <code>-aG</code>, and write a narrow sudoers rule checked by <code>visudo -c</code>.</li>
<li>I can tell "Permission denied", "Operation not permitted" and "Read-only file system" apart and test as the failing user.</li>
</ul>
${slide('lx-04', 30, 'Bảng tra nhanh Chương 4 (1/2): đọc và đổi quyền')}
${slide('lx-04', 31, 'Bảng tra nhanh Chương 4 (2/2): người dùng, sudo, chẩn đoán')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười câu, phần lớn là "lệnh này in ra gì?" và "thay đổi nào chữa được?". Mọi output trong đáp án đã chạy thật ngày 28/09/2026 trong container Ubuntu 24.04 (và trên Fedora 44 khi câu hỏi nói vậy).</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi đọc được một chế độ như <code>drwxr-x--x</code>, nói được số hệ tám của nó, và nói được lớp nào áp dụng cho một người dùng cho trước.</li>
<li>Tôi giải thích được r, w, x nghĩa là gì trên thư mục, và tìm ra thư mục đang chặn bằng <code>namei -l</code>.</li>
<li>Tôi đoán được chế độ của file và thư mục mới từ một umask, và sửa được một cây bị <code>chmod -R</code> làm hỏng.</li>
<li>Tôi dựng được thư mục dùng chung cho đội (nhóm, setgid, umask), bảo vệ được thư mục ai cũng ghi (bit dính) và thêm một người bằng ACL.</li>
<li>Tôi tạo được tài khoản, thêm nhóm bằng <code>-aG</code>, và viết được luật sudoers hẹp đã kiểm bằng <code>visudo -c</code>.</li>
<li>Tôi phân biệt được "Permission denied", "Operation not permitted" và "Read-only file system", và thử bằng đúng người dùng đang hỏng.</li>
</ul>
${slide('lx-04', 30, 'Bảng tra nhanh Chương 4 (1/2): đọc và đổi quyền')}
${slide('lx-04', 31, 'Bảng tra nhanh Chương 4 (2/2): người dùng, sudo, chẩn đoán')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'You are an (member of developers). ls -l shows "-r--rwxrwx 1 an developers 3 note.txt". You run: echo more >> note.txt. What happens?|||Bạn là an (thuộc nhóm developers). ls -l hiện "-r--rwxrwx 1 an developers 3 note.txt". Bạn chạy: echo more >> note.txt. Chuyện gì xảy ra?',
            options: [
              'The line is appended — group and other both allow w|||Dòng được nối thêm — cả nhóm lẫn khác đều cho w',
              'bash: note.txt: Permission denied',
              'It works only because an is also in developers|||Chạy được, chỉ vì an cũng thuộc developers',
              'bash: note.txt: Operation not permitted',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: The kernel picks ONE class: an is the owner, so only r-- is checked and the write fails with EACCES, printed as "Permission denied" (tested). Group membership never adds to the owner class. "Operation not permitted" is EPERM — ownership, sticky bit or immutable file — not a missing bit.|||VI: Nhân chỉ chọn MỘT lớp: an là chủ, nên chỉ r-- được xét và lệnh ghi hỏng với EACCES, in ra "Permission denied" (đã thử). Thuộc nhóm không bao giờ cộng thêm vào lớp chủ. "Operation not permitted" là EPERM — chuyện sở hữu, bit dính hay file bất biến — không phải thiếu bit.',
          },
          {
            question: 'namei -l shows "drwxr-x--- an an app" on the way to /srv/app/config/db.yml (the file is -rw-r--r--). nginx runs as www-data. Which ONE change lets it read db.yml while it still cannot list /srv/app?|||namei -l hiện "drwxr-x--- an an app" trên đường tới /srv/app/config/db.yml (file là -rw-r--r--). nginx chạy bằng www-data. Thay đổi DUY NHẤT nào cho nó đọc được db.yml mà vẫn không liệt kê được /srv/app?',
            options: [
              'chmod 644 /srv/app/config/db.yml',
              'chmod -R 777 /srv/app',
              'chmod o+r /srv/app',
              'chmod o+x /srv/app',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: www-data is "other" on app, and other has ---, so the walk stops there. x on a directory is traverse: after chmod o+x (mode 751, tested) cat prints "db: prod" while ls /srv/app still says Permission denied. o+r is the tempting one, but r only lists names — without x you still cannot pass through. The file is already 644, and 777 opens everything.|||VI: www-data là "khác" với app, mà khác có ---, nên cuộc đi dừng ở đó. x trên thư mục là đi xuyên qua: sau chmod o+x (chế độ 751, đã thử) cat in "db: prod" còn ls /srv/app vẫn báo Permission denied. o+r là phương án hấp dẫn, nhưng r chỉ liệt kê tên — thiếu x thì vẫn không đi qua được. File vốn đã 644, còn 777 thì mở toang mọi thứ.',
          },
          {
            question: 'In a shell with umask 027 you run: touch f; mkdir d; stat -c "%a %n" f d. What is printed?|||Trong một shell có umask 027 bạn chạy: touch f; mkdir d; stat -c "%a %n" f d. Lệnh in ra gì?',
            options: [
              '640 f · 750 d',
              '750 f · 750 d',
              '640 f · 640 d',
              '751 f · 750 d',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Files are requested as 666 and directories as 777; the mask 027 clears w for the group and everything for other: 666 → 640, 777 → 750 (tested: "640 f027", "750 d027"). 750 for a file is the arithmetic trap — new files never get x, because nothing asks for it.|||VI: File được xin 666, thư mục 777; mặt nạ 027 xoá w của nhóm và xoá hết của khác: 666 → 640, 777 → 750 (đã thử: "640 f027", "750 d027"). 750 cho file là cái bẫy số học — file mới không bao giờ có x, vì chẳng ai xin nó.',
          },
          {
            question: 'A teammate ran chmod -R 755 . on the project. You now run chmod -R u=rwX,go=rX . — what is the mode of .env (it was 600 before the accident)?|||Một bạn cùng nhóm đã chạy chmod -R 755 . trên dự án. Giờ bạn chạy chmod -R u=rwX,go=rX . — .env mang chế độ nào (trước tai nạn nó là 600)?',
            options: [
              '-rw-r--r-- (644)',
              '-rw------- (600)',
              '-rwxr-xr-x (755)',
              '-rwx------ (700)',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Capital X adds x to directories AND to files that already have an execute bit. After the 755 accident every file has one, so X keeps it: .env stays -rwxr-xr-x (tested). 644 is what you get before the accident; after it, reset files with find . -type f -exec chmod 644 {} + and then chmod 600 .env.|||VI: X hoa thêm x cho thư mục VÀ cho file đã có sẵn một bit chạy. Sau tai nạn 755 file nào cũng có, nên X giữ nguyên: .env vẫn là -rwxr-xr-x (đã thử). 644 là kết quả nếu chạy TRƯỚC tai nạn; sau đó phải đặt lại file bằng find . -type f -exec chmod 644 {} + rồi chmod 600 .env.',
          },
          {
            question: 'On Ubuntu 24.04, /srv/shared is drwxrwsr-x root developers. As root you run: chmod 775 /srv/shared; ls -ld /srv/shared. What does ls show?|||Trên Ubuntu 24.04, /srv/shared là drwxrwsr-x root developers. Với quyền root bạn chạy: chmod 775 /srv/shared; ls -ld /srv/shared. ls hiện gì?',
            options: [
              'drwxrwxr-x — a 3-digit chmod clears setgid|||drwxrwxr-x — chmod 3 chữ số gỡ setgid',
              'drwxrwsr-x — GNU chmod keeps setgid on directories|||drwxrwsr-x — chmod của GNU giữ setgid trên thư mục',
              'drwxrwSr-x — setgid kept but x removed|||drwxrwSr-x — giữ setgid nhưng mất x',
              'chmod: invalid mode: 775',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: chmod(1): "For directories chmod preserves set-user-ID and set-group-ID bits unless you explicitly specify otherwise". Tested: 775 and 0775 keep the s; 00775, =775 or g-s remove it. "Cleared" is the tempting answer because it is true for regular files and on macOS — the lesson itself said so until it was corrected.|||VI: chmod(1): "For directories chmod preserves set-user-ID and set-group-ID bits unless you explicitly specify otherwise". Đã thử: 775 và 0775 giữ chữ s; 00775, =775 hay g-s mới gỡ. "Bị gỡ" là đáp án hấp dẫn vì nó đúng với file thường và trên macOS — chính bài học từng viết như vậy trước khi được sửa.',
          },
          {
            question: 'In /srv/scratch (drwxrwxrwt root root) alice created cua-alice.txt. bob runs: rm cua-alice.txt. What is printed?|||Trong /srv/scratch (drwxrwxrwt root root) alice đã tạo cua-alice.txt. bob chạy: rm cua-alice.txt. Lệnh in ra gì?',
            options: [
              "rm: cannot remove 'cua-alice.txt': Operation not permitted",
              "rm: cannot remove 'cua-alice.txt': Permission denied",
              'Nothing — the directory is world-writable, so the file is removed|||Không gì cả — thư mục ai cũng ghi được, nên file bị xoá',
              "rm: remove write-protected regular file 'cua-alice.txt'?",
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: The t (sticky bit) adds one rule: only the entry’s owner, the directory’s owner or root may remove it. The refusal is EPERM, printed as "Operation not permitted" (tested) — Bob has w on the directory, so it is not a missing bit. Without the t (chmod -t), the same rm succeeds, which is the tempting answer.|||VI: Chữ t (bit dính) thêm một luật: chỉ chủ của mục đó, chủ thư mục hoặc root mới gỡ được nó. Lời từ chối là EPERM, in ra "Operation not permitted" (đã thử) — Bob có w trên thư mục, nên không phải thiếu bit. Bỏ chữ t đi (chmod -t) thì cùng lệnh rm chạy được, và đó là đáp án hấp dẫn.',
          },
          {
            question: 'id alice shows groups=1002(alice),27(sudo),1001(developers). An admin runs: usermod -G docker alice. What does id alice show now?|||id alice hiện groups=1002(alice),27(sudo),1001(developers). Một quản trị viên chạy: usermod -G docker alice. Giờ id alice hiện gì?',
            options: [
              'groups=1002(alice),27(sudo),1001(developers),1005(docker)',
              'usermod: option -G requires -a',
              'gid=1005(docker) — the primary group was changed|||gid=1005(docker) — nhóm chính bị đổi',
              'groups=1002(alice),1005(docker)',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Bare -G REPLACES the whole secondary list: sudo and developers are gone (tested, only alice + docker remain). Appending is -aG, which is the tempting answer. The primary group changes only with -g. If alice was the only sudo user, the fix now needs another admin or the recovery console.|||VI: -G trần THAY cả danh sách nhóm phụ: sudo và developers biến mất (đã thử, chỉ còn alice + docker). Nối thêm là -aG, và đó là đáp án hấp dẫn. Nhóm chính chỉ đổi với -g. Nếu alice là người sudo duy nhất, giờ phải nhờ quản trị viên khác hoặc console cứu hộ.',
          },
          {
            question: 'A GitHub Actions job SSHes into the VPS as deploy and runs "sudo systemctl restart myapp". It hangs or fails with "a terminal is required to read the password". What is the right fix?|||Một job GitHub Actions SSH vào VPS bằng deploy và chạy "sudo systemctl restart myapp". Nó treo hoặc hỏng với "a terminal is required to read the password". Cách chữa đúng là gì?',
            options: [
              'Run sudo -k before the command|||Chạy sudo -k trước lệnh đó',
              'Use sudo -i so a root shell is opened first|||Dùng sudo -i để mở shell root trước',
              'A visudo -f /etc/sudoers.d/deploy rule "deploy ALL=(root) NOPASSWD: /usr/bin/systemctl restart myapp", and call it with sudo -n|||Một luật visudo -f /etc/sudoers.d/deploy "deploy ALL=(root) NOPASSWD: /usr/bin/systemctl restart myapp", và gọi bằng sudo -n',
              'chmod u+s /usr/bin/systemctl so no sudo is needed|||chmod u+s /usr/bin/systemctl để khỏi cần sudo',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: sudo is waiting for a password that nobody can type. A narrow NOPASSWD rule for exactly that command removes the prompt and nothing else; sudo -n makes any other case fail at once instead of hanging (tested: "sudo: a password is required"). sudo -i still asks for the password, sudo -k only forgets a cached one, and a setuid systemctl would hand root to every user.|||VI: sudo đang chờ một mật khẩu không ai gõ được. Một luật NOPASSWD hẹp cho đúng lệnh đó gỡ lời hỏi và không mở thêm gì; sudo -n làm mọi trường hợp khác hỏng ngay thay vì treo (đã thử: "sudo: a password is required"). sudo -i vẫn hỏi mật khẩu, sudo -k chỉ quên mật khẩu đang nhớ, còn một systemctl setuid thì trao root cho mọi người dùng.',
          },
          {
            question: 'You used sudo several times today, but "journalctl -u sudo --since today" prints "-- No entries --". Why?|||Hôm nay bạn đã dùng sudo nhiều lần, nhưng "journalctl -u sudo --since today" in "-- No entries --". Vì sao?',
            options: [
              '-u filters by systemd unit and sudo is not a unit; use journalctl _COMM=sudo or -t sudo|||-u lọc theo unit systemd mà sudo không phải unit; dùng journalctl _COMM=sudo hoặc -t sudo',
              'sudo does not log anything unless auditd is installed|||sudo không ghi log gì trừ khi cài auditd',
              'journalctl must itself be run with sudo to see any entry|||Phải chạy chính journalctl bằng sudo mới thấy mục nào',
              'The journal was rotated at midnight|||Journal đã xoay vòng lúc nửa đêm',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: sudo runs inside your session, not as sudo.service, so -u sudo matches nothing (tested on Fedora 44: "-- No entries --", while journalctl -t sudo showed the entry). Reading the system journal may indeed need privileges, but then journalctl warns about it rather than matching nothing. The lesson itself used -u sudo until 28/09/2026.|||VI: sudo chạy bên trong phiên đăng nhập của bạn, không phải sudo.service, nên -u sudo không khớp gì (đã thử trên Fedora 44: "-- No entries --", trong khi journalctl -t sudo hiện ra mục đó). Đọc journal hệ thống có thể cần quyền thật, nhưng khi đó journalctl cảnh báo chứ không lặng lẽ trả rỗng. Chính bài học đã dùng -u sudo cho tới ngày 28/09/2026.',
          },
          {
            question: 'uploads has the ACL user:www-data:rwx and uploads worked. Someone ran chmod 750 uploads, and now www-data cannot create files. What does getfacl -c uploads show for www-data?|||uploads có ACL user:www-data:rwx và chức năng tải lên chạy tốt. Ai đó chạy chmod 750 uploads, giờ www-data không tạo được file. getfacl -c uploads hiện gì cho www-data?',
            options: [
              'Nothing — chmod deletes all ACL entries|||Không gì cả — chmod xoá hết mọi mục ACL',
              'user:www-data:r-x',
              'user:www-data:rwx, and the group line changed to r-x only|||user:www-data:rwx, và chỉ dòng group đổi thành r-x',
              'user:www-data:rwx	#effective:r-x',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: On a file with an ACL, chmod’s group digit sets the MASK, the ceiling of every named entry. The entry itself still says rwx, but getfacl marks it "#effective:r-x" (tested). Fix it with setfacl -m m::rwx uploads (or re-run setfacl -m u:www-data:rwx), not by guessing at ls -l, whose group column now shows the mask.|||VI: Trên file có ACL, chữ số nhóm của chmod đặt MASK, trần của mọi mục có tên. Bản thân mục vẫn ghi rwx, nhưng getfacl đánh dấu "#effective:r-x" (đã thử). Sửa bằng setfacl -m m::rwx uploads (hoặc chạy lại setfacl -m u:www-data:rwx), đừng đoán qua ls -l, vì cột nhóm của nó giờ hiện mask.',
          },
        ],
      },
    },
  ],
};
