/**
 * Linux & Bash — Chương 4: Quyền, người dùng & sudo.
 * Mô hình rwx · chmod/chown/umask · bit đặc biệt · người dùng và nhóm · sudo · chẩn đoán · quiz.
 * Output CHẠY THẬT Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Flinux-bash%2Flearn&reflabel=Linux%20%26%20Bash';

export default {
  title: 'Chapter 4 — Permissions, users & sudo|||Chương 4 — Quyền, người dùng & sudo',
  description: 'rwx, chmod, chown, umask, nhóm — và vì sao "Permission denied" thường không phải chuyện thiếu quyền trên chính cái file đó. Chương này kết thúc bằng một quy trình chẩn đoán để bạn đọc ra nguyên nhân thay vì vớ lấy sudo.',
  lessons: [
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
<pre><code>ls -l deploy.sh</code></pre>
<div class="out">-rwxr-xr--  1 deploy  developers  2048 Aug 22 10:14 deploy.sh</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">-</span><span class="lz-lnote">Type. <code>-</code> regular file · <code>d</code> directory · <code>l</code> symlink · <code>c</code>/<code>b</code> device · <code>s</code> socket · <code>p</code> pipe.</span></div>
  <div class="lz-layer"><span class="lz-lname">rwx</span><span class="lz-lnote"><strong>User</strong> — the owner, here <code>deploy</code>. Read, write, execute: all three.</span></div>
  <div class="lz-layer"><span class="lz-lname">r-x</span><span class="lz-lnote"><strong>Group</strong> — members of <code>developers</code>. Read and execute, but not write.</span></div>
  <div class="lz-layer"><span class="lz-lname">r--</span><span class="lz-lnote"><strong>Other</strong> — everyone else on the system. Read only.</span></div>
</div>

<div class="callout"><strong>Only one class applies to you</strong>, and the kernel picks it in this order: if you are the owner, the <em>user</em> bits decide — full stop. Otherwise, if you are in the group, the <em>group</em> bits decide. Otherwise <em>other</em>. This is why a file can be <code>r--rwxrwx</code> and its own owner still cannot write to it: being the owner means the user bits apply, and they say read-only. The permissions are not cumulative and the most permissive class does not win.</div>

<h3>What rwx means on a FILE</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>r</code> read</span><span class="v">Open and read the contents. <code>cat</code>, <code>less</code>, <code>cp</code> as the source.</span></div>
  <div class="kv"><span class="k"><code>w</code> write</span><span class="v">Modify the contents. Note: <strong>not</strong> permission to delete or rename it — that is controlled by the directory.</span></div>
  <div class="kv"><span class="k"><code>x</code> execute</span><span class="v">Run it as a program. A shell script also needs <code>r</code> (the interpreter must read it); a compiled binary needs only <code>x</code>.</span></div>
</div>

<h3>What rwx means on a DIRECTORY — the part that matters</h3>
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

<pre><code>ls -ld secret/
<span class="tok-comment"># d--x------  can enter, cannot list</span>
cd secret/          <span class="tok-comment"># works — x is enough</span>
ls                  <span class="tok-comment"># FAILS — needs r</span>
cat secret/key.txt  <span class="tok-comment"># works IF you already know the name</span></code></pre>
<div class="out">ls: cannot open directory '.': Permission denied
hunter2</div>
<div class="callout ok">A directory with <code>x</code> but not <code>r</code> is a real technique, not a curiosity: it is how <code>/home</code> is often configured. You can reach <code>/home/you</code>, but you cannot enumerate who else has an account. Web servers use the same trick for upload directories — files are servable by exact URL, but the directory cannot be browsed.</div>

<h3>The consequence that surprises everyone</h3>
<pre><code>ls -l notes.txt
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
<pre><code>cat /srv/app/config/db.yml</code></pre>
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
<pre><code>ls -l deploy.sh</code></pre>
<div class="out">-rwxr-xr--  1 deploy  developers  2048 Aug 22 10:14 deploy.sh</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">-</span><span class="lz-lnote">Loại. <code>-</code> file thường · <code>d</code> thư mục · <code>l</code> liên kết tượng trưng · <code>c</code>/<code>b</code> thiết bị · <code>s</code> socket · <code>p</code> ống.</span></div>
  <div class="lz-layer"><span class="lz-lname">rwx</span><span class="lz-lnote"><strong>User</strong> — chủ sở hữu, ở đây là <code>deploy</code>. Đọc, ghi, chạy: đủ cả ba.</span></div>
  <div class="lz-layer"><span class="lz-lname">r-x</span><span class="lz-lnote"><strong>Group</strong> — thành viên nhóm <code>developers</code>. Đọc và chạy, nhưng không ghi.</span></div>
  <div class="lz-layer"><span class="lz-lname">r--</span><span class="lz-lnote"><strong>Other</strong> — mọi người còn lại trên hệ thống. Chỉ đọc.</span></div>
</div>

<div class="callout"><strong>Chỉ đúng MỘT lớp áp dụng cho bạn</strong>, và nhân chọn lớp đó theo thứ tự này: nếu bạn là chủ sở hữu, các bit <em>user</em> quyết định — hết chuyện. Nếu không, nếu bạn thuộc nhóm đó, các bit <em>group</em> quyết định. Nếu không nữa thì <em>other</em>. Đó là lý do một file có thể mang <code>r--rwxrwx</code> mà chính chủ của nó vẫn không ghi được: là chủ nghĩa là các bit user áp dụng, và chúng nói chỉ-đọc. Quyền KHÔNG cộng dồn, và lớp rộng rãi nhất KHÔNG thắng.</div>

<h3>rwx nghĩa là gì trên một FILE</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>r</code> đọc</span><span class="v">Mở ra và đọc nội dung. <code>cat</code>, <code>less</code>, <code>cp</code> ở vai nguồn.</span></div>
  <div class="kv"><span class="k"><code>w</code> ghi</span><span class="v">Sửa nội dung. Lưu ý: <strong>KHÔNG</strong> phải quyền xoá hay đổi tên nó — thứ đó do thư mục quyết định.</span></div>
  <div class="kv"><span class="k"><code>x</code> chạy</span><span class="v">Chạy nó như một chương trình. Một script shell còn cần thêm <code>r</code> (trình thông dịch phải đọc được nó); một chương trình đã biên dịch thì chỉ cần <code>x</code>.</span></div>
</div>

<h3>rwx nghĩa là gì trên một THƯ MỤC — phần quan trọng</h3>
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

<pre><code>ls -ld secret/
<span class="tok-comment"># d--x------  vào được, không liệt kê được</span>
cd secret/          <span class="tok-comment"># chạy được — chỉ x là đủ</span>
ls                  <span class="tok-comment"># HỎNG — cần r</span>
cat secret/key.txt  <span class="tok-comment"># chạy được NẾU bạn đã biết sẵn cái tên</span></code></pre>
<div class="out">ls: cannot open directory '.': Permission denied
hunter2</div>
<div class="callout ok">Một thư mục có <code>x</code> mà không có <code>r</code> là một kỹ thuật thật sự, không phải chuyện lạ: đó là cách <code>/home</code> thường được cấu hình. Bạn với tới được <code>/home/ban</code>, nhưng không liệt kê ra được còn ai khác có tài khoản. Máy chủ web dùng đúng mẹo đó cho thư mục tải lên — file phục vụ được nếu biết chính xác URL, nhưng thư mục thì không duyệt được.</div>

<h3>Hệ quả làm ai cũng bất ngờ</h3>
<pre><code>ls -l notes.txt
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
<pre><code>cat /srv/app/config/db.yml</code></pre>
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
<pre><code><span class="tok-comment"># Octal — sets ALL nine bits at once, absolutely</span>
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
<pre><code>chmod -R 755 /srv/app        <span class="tok-comment"># WRONG — every .env, .jpg and .json is now executable</span></code></pre>
<p><code>-R</code> applies the same mode to files and directories alike, but directories need <code>x</code> and data files must not have it. The correct form uses the capital <code>X</code>, which means "execute, but <strong>only</strong> for directories and for files that already have some execute bit":</p>
<pre><code>chmod -R u=rwX,go=rX /srv/app      <span class="tok-comment"># directories get x, plain files do not</span>

<span class="tok-comment"># Or split it explicitly with find</span>
find /srv/app -type d -exec chmod 755 {} +
find /srv/app -type f -exec chmod 644 {} +</code></pre>
<div class="out">$ ls -l /srv/app
drwxr-xr-x  config
-rw-r--r--  package.json
-rwxr-xr-x  deploy.sh</div>
<div class="callout ok">Capital <code>X</code> is one of the highest-value details in this chapter. It preserves the executable bit on scripts that already had it, adds traversal to every directory, and leaves data files alone — in a single command that is safe to re-run.</div>

<h3>chown and chgrp: who owns it</h3>
<pre><code>sudo chown deploy file.txt              <span class="tok-comment"># change owner</span>
sudo chown deploy:developers file.txt   <span class="tok-comment"># owner AND group</span>
sudo chown :developers file.txt         <span class="tok-comment"># group only (note the colon)</span>
sudo chgrp developers file.txt          <span class="tok-comment"># same thing, dedicated command</span>
sudo chown -R deploy:deploy /srv/app    <span class="tok-comment"># the whole tree</span>
sudo chown --reference=other.txt f.txt  <span class="tok-comment"># copy another file's ownership</span></code></pre>
<div class="callout warn">Changing the owner <strong>requires root</strong>, always — even to give your own file away. That is deliberate: on a system with disk quotas, being able to hand a file to another user would let you dump your storage onto their account. Changing the <em>group</em> is allowed without root, but only to a group you belong to. So <code>chgrp developers f</code> works if you are in <code>developers</code>, and fails otherwise.</div>

<h3>umask: the permissions of files you have not created yet</h3>
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

<h3>Where this bites in practice</h3>
<pre><code>ssh vps
<span class="tok-comment"># Permissions 0644 for '/home/you/.ssh/id_ed25519' are too open.</span>
<span class="tok-comment"># It is required that your private key files are NOT accessible by others.</span>
<span class="tok-comment"># This private key will be ignored.</span>

chmod 600 ~/.ssh/id_ed25519
chmod 700 ~/.ssh
chmod 644 ~/.ssh/id_ed25519.pub
chmod 600 ~/.ssh/authorized_keys</code></pre>
<p>SSH refuses to use a private key that anyone else can read, and it refuses loudly rather than falling back — which is correct, and which is the single most common permission error people meet. The numbers above are the ones SSH expects; <code>700</code> on the directory matters as much as <code>600</code> on the key.</p>
<pre><code><span class="tok-comment"># A web app cannot write its upload directory</span>
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
<pre><code><span class="tok-comment"># Hệ tám — đặt CẢ chín bit một lượt, một cách tuyệt đối</span>
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
<pre><code>chmod -R 755 /srv/app        <span class="tok-comment"># SAI — mọi file .env, .jpg và .json giờ đều chạy được</span></code></pre>
<p><code>-R</code> áp cùng một chế độ lên cả file lẫn thư mục, nhưng thư mục thì CẦN <code>x</code> còn file dữ liệu thì KHÔNG ĐƯỢC có. Dạng đúng dùng chữ <code>X</code> viết hoa, nghĩa là "quyền chạy, nhưng <strong>CHỈ</strong> cho thư mục và cho những file vốn đã có sẵn một bit chạy nào đó":</p>
<pre><code>chmod -R u=rwX,go=rX /srv/app      <span class="tok-comment"># thư mục được x, file thường thì không</span>

<span class="tok-comment"># Hoặc tách tường minh bằng find</span>
find /srv/app -type d -exec chmod 755 {} +
find /srv/app -type f -exec chmod 644 {} +</code></pre>
<div class="out">$ ls -l /srv/app
drwxr-xr-x  config
-rw-r--r--  package.json
-rwxr-xr-x  deploy.sh</div>
<div class="callout ok">Chữ <code>X</code> viết hoa là một trong những chi tiết giá trị nhất của chương này. Nó giữ nguyên bit chạy trên những script vốn đã có, thêm quyền đi xuyên qua cho mọi thư mục, và để yên file dữ liệu — gói trong một lệnh duy nhất mà chạy lại bao nhiêu lần cũng an toàn.</div>

<h3>chown và chgrp: ai sở hữu nó</h3>
<pre><code>sudo chown deploy file.txt              <span class="tok-comment"># đổi chủ sở hữu</span>
sudo chown deploy:developers file.txt   <span class="tok-comment"># chủ sở hữu VÀ nhóm</span>
sudo chown :developers file.txt         <span class="tok-comment"># chỉ nhóm (để ý dấu hai chấm)</span>
sudo chgrp developers file.txt          <span class="tok-comment"># y hệt, bằng lệnh riêng</span>
sudo chown -R deploy:deploy /srv/app    <span class="tok-comment"># cả cây thư mục</span>
sudo chown --reference=other.txt f.txt  <span class="tok-comment"># chép quyền sở hữu của file khác</span></code></pre>
<div class="callout warn">Đổi chủ sở hữu <strong>BẮT BUỘC cần root</strong>, luôn luôn — kể cả khi bạn muốn CHO ĐI chính file của mình. Đó là chủ ý: trên một hệ thống có hạn mức đĩa, việc trao được một file cho người khác đồng nghĩa với việc bạn đổ dung lượng của mình sang tài khoản họ. Đổi <em>NHÓM</em> thì không cần root, nhưng chỉ đổi được sang một nhóm mà bạn thuộc về. Nên <code>chgrp developers f</code> chạy được nếu bạn ở trong <code>developers</code>, và hỏng nếu không.</div>

<h3>umask: quyền của những file bạn CHƯA tạo ra</h3>
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

<h3>Chỗ này cắn ở đâu trong thực tế</h3>
<pre><code>ssh vps
<span class="tok-comment"># Permissions 0644 for '/home/you/.ssh/id_ed25519' are too open.</span>
<span class="tok-comment"># It is required that your private key files are NOT accessible by others.</span>
<span class="tok-comment"># This private key will be ignored.</span>

chmod 600 ~/.ssh/id_ed25519
chmod 700 ~/.ssh
chmod 644 ~/.ssh/id_ed25519.pub
chmod 600 ~/.ssh/authorized_keys</code></pre>
<p>SSH từ chối dùng một khoá riêng mà người khác đọc được, và nó từ chối một cách ồn ào chứ không lặng lẽ lùi về cách khác — điều đó là đúng, và đó cũng là lỗi quyền phổ biến nhất người ta gặp. Những con số ở trên là thứ SSH mong đợi; <code>700</code> trên thư mục quan trọng ngang <code>600</code> trên cái khoá.</p>
<pre><code><span class="tok-comment"># Một ứng dụng web không ghi được vào thư mục tải lên của nó</span>
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
<pre><code>ls -l /usr/bin/passwd
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

<pre><code><span class="tok-comment"># Audit every setuid binary on the machine — do this on a server you inherit</span>
find / -perm -4000 -type f 2&gt;/dev/null | sort

<span class="tok-comment"># setgid binaries too</span>
find / -perm -2000 -type f 2&gt;/dev/null | sort</code></pre>
<div class="out">/usr/bin/chsh
/usr/bin/gpasswd
/usr/bin/mount
/usr/bin/newgrp
/usr/bin/passwd
/usr/bin/su
/usr/bin/sudo
/usr/bin/umount</div>
<p>That list should look roughly like this on a stock Ubuntu. Anything unexpected in it — especially in <code>/tmp</code>, <code>/home</code> or an application directory — is worth investigating, because "drop a setuid-root shell somewhere" is a classic way to keep root access after an intrusion.</p>

<h3>setgid on a directory: the one you will actually use</h3>
<p>Normally a new file gets <em>your</em> primary group. In a shared directory that is wrong: files created by different people end up in different groups, and the team loses access to each other's work. setgid on the directory fixes it:</p>
<pre><code>sudo mkdir /srv/shared
sudo chgrp developers /srv/shared
sudo chmod 2775 /srv/shared        <span class="tok-comment"># 2 = setgid, 775 = rwxrwxr-x</span>
ls -ld /srv/shared</code></pre>
<div class="out">drwxrwsr-x 3 root developers 4096 Aug 22 11:02 /srv/shared</div>
<p>Note the <code>s</code> in the group-execute position. Now every file created inside inherits the group <code>developers</code> regardless of who made it, and — because setgid also propagates to new subdirectories — the whole tree keeps the behaviour without further work.</p>
<pre><code><span class="tok-comment"># Verify</span>
touch /srv/shared/from-alice.txt
ls -l /srv/shared/</code></pre>
<div class="out">-rw-rw-r-- 1 alice developers 0 Aug 22 11:03 from-alice.txt</div>
<div class="callout ok">setgid handles the <em>group</em>. To also make new files group-writable you need <code>umask 002</code> in that context (Lesson 4.2), because the default <code>022</code> strips group write before setgid ever applies. The complete recipe for a shared directory is therefore: <strong>chgrp + chmod 2775 + umask 002</strong>. Missing the umask is the reason a "correctly configured" shared directory still produces read-only files for teammates.</div>

<h3>The sticky bit: how /tmp survives</h3>
<pre><code>ls -ld /tmp</code></pre>
<div class="out">drwxrwxrwt 10 root root 4096 Aug 22 11:10 /tmp</div>
<p><code>/tmp</code> is <code>777</code> — every user can create files there, which is the point. But recall Lesson 4.1: <code>w</code> on a directory means you may delete <em>any</em> entry in it. Without protection, any user could delete every other user's temporary files, including the socket your database is listening on.</p>
<p>The <code>t</code> at the end is the sticky bit, and it adds one rule: <strong>you may only remove or rename an entry if you own the entry, or own the directory, or are root</strong>. World-writable stays world-writable; only deletion is restricted.</p>
<pre><code>sudo chmod 1777 /srv/scratch        <span class="tok-comment"># 1 = sticky</span>
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
<pre><code>chmod 4755 prog        <span class="tok-comment"># setuid, octal</span>
chmod u+s prog         <span class="tok-comment"># setuid, symbolic</span>
chmod 2775 dir         <span class="tok-comment"># setgid</span>
chmod g+s dir          <span class="tok-comment"># setgid, symbolic</span>
chmod 1777 dir         <span class="tok-comment"># sticky</span>
chmod +t dir           <span class="tok-comment"># sticky, symbolic</span>
chmod 0755 prog        <span class="tok-comment"># clear ALL special bits (leading 0)</span></code></pre>
<div class="callout warn">A three-digit <code>chmod</code> on a directory that has setgid <strong>clears it silently</strong>: <code>chmod 775 /srv/shared</code> looks like a no-op but removes the <code>s</code>, and files created afterwards get the wrong group. Nothing errors, and the breakage shows up days later as "Bob cannot edit my files any more". When a directory has special bits, always use four digits.</div>

<h3>What these bits cannot do</h3>
<p>The three special bits are the whole of the classic Unix model, and it is coarse: one owner, one group, three classes. Modern systems layer more on top, and knowing the names is enough for now:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">POSIX ACLs</span><span class="v"><code>setfacl -m u:alice:rw file</code> — per-user permissions beyond the single owner/group. <code>getfacl</code> reads them; a <code>+</code> at the end of the <code>ls -l</code> mode means a file has one.</span></div>
  <div class="kv"><span class="k">Capabilities</span><span class="v"><code>setcap cap_net_bind_service=+ep /usr/bin/node</code> grants exactly one root power — here, binding to port 80 — instead of all of them. The modern replacement for setuid-root.</span></div>
  <div class="kv"><span class="k">SELinux / AppArmor</span><span class="v">Mandatory access control layered <em>above</em> the permission bits. On RHEL and Ubuntu respectively, this is why an operation is sometimes refused even when <code>ls -l</code> says it should be allowed — check <code>ausearch</code> or <code>dmesg</code>.</span></div>
</div>

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
<pre><code>ls -l /usr/bin/passwd
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

<pre><code><span class="tok-comment"># Rà soát mọi file setuid trên máy — hãy làm việc này với một máy chủ bạn tiếp quản</span>
find / -perm -4000 -type f 2&gt;/dev/null | sort

<span class="tok-comment"># cả file setgid nữa</span>
find / -perm -2000 -type f 2&gt;/dev/null | sort</code></pre>
<div class="out">/usr/bin/chsh
/usr/bin/gpasswd
/usr/bin/mount
/usr/bin/newgrp
/usr/bin/passwd
/usr/bin/su
/usr/bin/sudo
/usr/bin/umount</div>
<p>Danh sách đó nên trông đại khái như thế này trên một bản Ubuntu nguyên gốc. Bất cứ thứ gì lạ nằm trong đó — nhất là trong <code>/tmp</code>, <code>/home</code> hay một thư mục ứng dụng — đều đáng đi điều tra, vì "thả một shell setuid-root ở đâu đó" là cách kinh điển để giữ quyền root sau một vụ xâm nhập.</p>

<h3>setgid trên thư mục: cái bạn sẽ thật sự dùng</h3>
<p>Bình thường một file mới nhận nhóm chính của <em>BẠN</em>. Trong một thư mục dùng chung thì điều đó sai: file do những người khác nhau tạo ra rơi vào những nhóm khác nhau, và cả đội mất quyền truy cập vào việc của nhau. setgid trên thư mục chữa đúng chuyện đó:</p>
<pre><code>sudo mkdir /srv/shared
sudo chgrp developers /srv/shared
sudo chmod 2775 /srv/shared        <span class="tok-comment"># 2 = setgid, 775 = rwxrwxr-x</span>
ls -ld /srv/shared</code></pre>
<div class="out">drwxrwsr-x 3 root developers 4096 Aug 22 11:02 /srv/shared</div>
<p>Để ý chữ <code>s</code> ở vị trí quyền chạy của nhóm. Giờ mọi file tạo ra bên trong đều thừa kế nhóm <code>developers</code> bất kể ai tạo, và — vì setgid cũng lan sang các thư mục con mới — cả cây giữ được hành vi đó mà không cần làm gì thêm.</p>
<pre><code><span class="tok-comment"># Kiểm lại</span>
touch /srv/shared/from-alice.txt
ls -l /srv/shared/</code></pre>
<div class="out">-rw-rw-r-- 1 alice developers 0 Aug 22 11:03 from-alice.txt</div>
<div class="callout ok">setgid lo phần <em>NHÓM</em>. Muốn file mới cũng cho nhóm ghi được thì bạn cần <code>umask 002</code> trong ngữ cảnh đó (Bài 4.2), vì mặc định <code>022</code> đã bóc mất quyền ghi của nhóm trước cả khi setgid kịp áp dụng. Nên công thức đầy đủ cho một thư mục dùng chung là: <strong>chgrp + chmod 2775 + umask 002</strong>. Thiếu cái umask chính là lý do một thư mục dùng chung "cấu hình đúng rồi" vẫn đẻ ra file chỉ-đọc với đồng đội.</div>

<h3>Bit dính: /tmp sống sót ra sao</h3>
<pre><code>ls -ld /tmp</code></pre>
<div class="out">drwxrwxrwt 10 root root 4096 Aug 22 11:10 /tmp</div>
<p><code>/tmp</code> là <code>777</code> — người dùng nào cũng tạo file ở đó được, và đó chính là mục đích. Nhưng hãy nhớ lại Bài 4.1: <code>w</code> trên một thư mục nghĩa là bạn xoá được <em>BẤT KỲ</em> mục nào trong đó. Không có gì bảo vệ thì người dùng nào cũng xoá được file tạm của mọi người khác, kể cả cái socket mà cơ sở dữ liệu của bạn đang lắng nghe trên đó.</p>
<p>Chữ <code>t</code> ở cuối chính là bit dính, và nó thêm đúng một luật: <strong>bạn chỉ gỡ hoặc đổi tên được một mục nếu bạn sở hữu mục đó, hoặc sở hữu thư mục, hoặc là root</strong>. Cả thế giới vẫn ghi được như cũ; chỉ việc XOÁ là bị siết.</p>
<pre><code>sudo chmod 1777 /srv/scratch        <span class="tok-comment"># 1 = dính</span>
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
<pre><code>chmod 4755 prog        <span class="tok-comment"># setuid, hệ tám</span>
chmod u+s prog         <span class="tok-comment"># setuid, ký hiệu</span>
chmod 2775 dir         <span class="tok-comment"># setgid</span>
chmod g+s dir          <span class="tok-comment"># setgid, ký hiệu</span>
chmod 1777 dir         <span class="tok-comment"># dính</span>
chmod +t dir           <span class="tok-comment"># dính, ký hiệu</span>
chmod 0755 prog        <span class="tok-comment"># xoá TẤT CẢ bit đặc biệt (số 0 đứng đầu)</span></code></pre>
<div class="callout warn">Một lệnh <code>chmod</code> ba chữ số trên thư mục đang có setgid sẽ <strong>XOÁ NÓ TRONG IM LẶNG</strong>: <code>chmod 775 /srv/shared</code> trông như chẳng làm gì nhưng gỡ mất chữ <code>s</code>, và những file tạo ra sau đó nhận nhầm nhóm. Không có lỗi nào, và chỗ hỏng lộ ra vài ngày sau dưới dạng "Bob không sửa được file của tôi nữa". Khi một thư mục có bit đặc biệt, hãy luôn dùng bốn chữ số.</div>

<h3>Những gì ba bit này KHÔNG làm được</h3>
<p>Ba bit đặc biệt là toàn bộ mô hình Unix cổ điển, và nó thô: một chủ sở hữu, một nhóm, ba lớp. Hệ thống đời mới xếp thêm nhiều tầng lên trên, và biết tên chúng lúc này là đủ:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">POSIX ACL</span><span class="v"><code>setfacl -m u:alice:rw file</code> — quyền cho từng người dùng, vượt ra ngoài một chủ/một nhóm. <code>getfacl</code> để đọc; một dấu <code>+</code> ở cuối phần chế độ trong <code>ls -l</code> nghĩa là file đó có ACL.</span></div>
  <div class="kv"><span class="k">Capability</span><span class="v"><code>setcap cap_net_bind_service=+ep /usr/bin/node</code> cấp đúng MỘT quyền của root — ở đây là quyền gắn vào cổng 80 — thay vì cấp tất cả. Đây là thứ thay thế cho setuid-root ở thời hiện đại.</span></div>
  <div class="kv"><span class="k">SELinux / AppArmor</span><span class="v">Kiểm soát truy cập bắt buộc, xếp <em>PHÍA TRÊN</em> các bit quyền. Trên RHEL và Ubuntu tương ứng, đây là lý do đôi khi một thao tác bị từ chối kể cả khi <code>ls -l</code> nói lẽ ra phải được phép — hãy xem <code>ausearch</code> hoặc <code>dmesg</code>.</span></div>
</div>

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
<pre><code>grep -E '^(root|deploy):' /etc/passwd</code></pre>
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
<pre><code>awk -F: '\$3 &lt; 1000 {print \$1, \$3, \$7}' /etc/passwd | head
awk -F: '\$3 &gt;= 1000 {print \$1, \$3, \$7}' /etc/passwd</code></pre>
<div class="out">root 0 /bin/bash
daemon 1 /usr/sbin/nologin
www-data 33 /usr/sbin/nologin
postgres 114 /bin/bash

deploy 1001 /bin/bash</div>
<p>UIDs below 1000 are system accounts, created by packages so that each service runs as its own restricted identity rather than as root. <code>www-data</code> owns nothing but what nginx needs; if nginx is compromised, the attacker gets <code>www-data</code>, not the machine. Most of them have <code>/usr/sbin/nologin</code> as their shell — the account exists to own files and run a process, and cannot be logged into.</p>
<div class="callout ok">This is a pattern to copy. When you deploy an application, give it its own user (<code>sudo useradd -r -s /usr/sbin/nologin appname</code>) rather than running it as root or as yourself. It costs one command, and it means a bug in your app cannot reach anything the app does not own.</div>

<h3>/etc/shadow and /etc/group</h3>
<pre><code>sudo grep deploy /etc/shadow
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

<h3>Group membership does not apply until you log in again</h3>
<pre><code>sudo usermod -aG docker \$USER
docker ps</code></pre>
<div class="out">permission denied while trying to connect to the Docker daemon socket</div>
<p>The change is real — <code>id \$USER</code> confirms it — but your <em>current shell</em> still carries the group list it was given at login. Group membership is copied into the process at login time and inherited by children; nothing re-reads <code>/etc/group</code> for a running process.</p>
<pre><code>id                    <span class="tok-comment"># the OLD list — this shell's copy</span>
id \$USER              <span class="tok-comment"># the NEW list — read fresh from the files</span>
newgrp docker         <span class="tok-comment"># start a subshell with the new group</span>
<span class="tok-comment"># or: log out and back in. For SSH, close the connection entirely.</span></code></pre>
<div class="callout">"I added myself to the <code>docker</code> group and it still says permission denied" is one of the most-asked questions in Linux, and the answer is always this. The two <code>id</code> commands above are the fastest way to prove it to yourself: same user, two different answers, because one reads the process and the other reads the file.</div>

<h3>sudo versus su</h3>
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
<pre><code>sudo visudo                              <span class="tok-comment"># ALWAYS edit through visudo</span>
sudo visudo -f /etc/sudoers.d/deploy     <span class="tok-comment"># better: a separate file per rule</span></code></pre>
<pre><code><span class="tok-comment"># /etc/sudoers.d/deploy</span>
<span class="tok-comment"># user  host = (runas)  commands</span>
deploy  ALL = (root) NOPASSWD: /bin/systemctl restart myapp
deploy  ALL = (root) NOPASSWD: /bin/systemctl status myapp
%developers ALL = (root) /usr/bin/journalctl</code></pre>
<p>This lets the <code>deploy</code> account restart exactly one service without a password — enough for a CI pipeline — while granting nothing else. The <code>%</code> prefix means a group rather than a user. Narrow rules like these are the entire point of <code>sudo</code>: they are auditable, revocable, and they appear in the logs.</p>
<div class="callout warn"><strong>Always use <code>visudo</code>.</strong> It syntax-checks the file before saving, and a syntax error in <code>/etc/sudoers</code> makes <code>sudo</code> refuse to run <em>at all</em> — including the <code>sudo</code> you would need to fix it. Recovering from that means single-user mode or a rescue console. Before closing your editor, keep a second terminal open with a working <code>sudo</code> session, and test the new rule there.</div>
<pre><code><span class="tok-comment"># Who ran what</span>
sudo journalctl -u sudo --since today
sudo grep sudo /var/log/auth.log | tail -20</code></pre>
<div class="out">Aug 22 11:42:03 vps sudo: deploy : TTY=pts/1 ; PWD=/srv/app ;
  USER=root ; COMMAND=/bin/systemctl restart myapp</div>

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
<pre><code>grep -E '^(root|deploy):' /etc/passwd</code></pre>
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
<pre><code>awk -F: '\$3 &lt; 1000 {print \$1, \$3, \$7}' /etc/passwd | head
awk -F: '\$3 &gt;= 1000 {print \$1, \$3, \$7}' /etc/passwd</code></pre>
<div class="out">root 0 /bin/bash
daemon 1 /usr/sbin/nologin
www-data 33 /usr/sbin/nologin
postgres 114 /bin/bash

deploy 1001 /bin/bash</div>
<p>UID dưới 1000 là tài khoản hệ thống, do các gói phần mềm tạo ra để mỗi dịch vụ chạy dưới một danh tính bị hạn chế của riêng nó thay vì chạy bằng root. <code>www-data</code> không sở hữu gì ngoài những thứ nginx cần; nếu nginx bị chiếm, kẻ tấn công có được <code>www-data</code>, không có được cả cái máy. Phần lớn chúng lấy <code>/usr/sbin/nologin</code> làm shell — tài khoản tồn tại để sở hữu file và chạy một tiến trình, và không đăng nhập vào được.</p>
<div class="callout ok">Đây là một khuôn mẫu đáng chép lại. Khi bạn triển khai một ứng dụng, hãy cho nó một người dùng riêng (<code>sudo useradd -r -s /usr/sbin/nologin tenapp</code>) thay vì chạy bằng root hay bằng chính bạn. Tốn đúng một lệnh, và đổi lại một lỗi trong ứng dụng của bạn không với tới được bất cứ thứ gì mà ứng dụng không sở hữu.</div>

<h3>/etc/shadow và /etc/group</h3>
<pre><code>sudo grep deploy /etc/shadow
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

<h3>Vào nhóm mới chưa có hiệu lực cho tới khi đăng nhập lại</h3>
<pre><code>sudo usermod -aG docker \$USER
docker ps</code></pre>
<div class="out">permission denied while trying to connect to the Docker daemon socket</div>
<p>Thay đổi là có thật — <code>id \$USER</code> xác nhận điều đó — nhưng <em>SHELL HIỆN TẠI</em> của bạn vẫn mang danh sách nhóm mà nó được cấp lúc đăng nhập. Tư cách thành viên nhóm được CHÉP vào tiến trình lúc đăng nhập rồi được các tiến trình con thừa kế; không có gì đọc lại <code>/etc/group</code> cho một tiến trình đang chạy.</p>
<pre><code>id                    <span class="tok-comment"># danh sách CŨ — bản chép của shell này</span>
id \$USER              <span class="tok-comment"># danh sách MỚI — đọc tươi từ file</span>
newgrp docker         <span class="tok-comment"># mở một shell con với nhóm mới</span>
<span class="tok-comment"># hoặc: đăng xuất rồi đăng nhập lại. Với SSH thì phải đóng hẳn kết nối.</span></code></pre>
<div class="callout">"Tôi đã thêm mình vào nhóm <code>docker</code> rồi mà nó vẫn báo permission denied" là một trong những câu hỏi được hỏi nhiều nhất về Linux, và câu trả lời luôn là chuyện này. Hai lệnh <code>id</code> ở trên là cách nhanh nhất để tự chứng minh: cùng một người dùng, hai câu trả lời khác nhau, vì một cái đọc TIẾN TRÌNH còn cái kia đọc FILE.</div>

<h3>sudo so với su</h3>
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
<pre><code>sudo visudo                              <span class="tok-comment"># LUÔN sửa thông qua visudo</span>
sudo visudo -f /etc/sudoers.d/deploy     <span class="tok-comment"># tốt hơn: mỗi luật một file riêng</span></code></pre>
<pre><code><span class="tok-comment"># /etc/sudoers.d/deploy</span>
<span class="tok-comment"># người  máy = (chạy dưới danh nghĩa)  lệnh</span>
deploy  ALL = (root) NOPASSWD: /bin/systemctl restart myapp
deploy  ALL = (root) NOPASSWD: /bin/systemctl status myapp
%developers ALL = (root) /usr/bin/journalctl</code></pre>
<p>Cái này cho tài khoản <code>deploy</code> khởi động lại đúng MỘT dịch vụ mà không cần mật khẩu — đủ cho một đường ống CI — trong khi không cấp gì khác. Tiền tố <code>%</code> nghĩa là một nhóm chứ không phải một người dùng. Những luật hẹp như thế chính là toàn bộ mục đích của <code>sudo</code>: chúng ghi lại được, thu hồi được, và chúng hiện lên trong log.</p>
<div class="callout warn"><strong>Luôn dùng <code>visudo</code>.</strong> Nó kiểm cú pháp trước khi lưu, mà một lỗi cú pháp trong <code>/etc/sudoers</code> làm <code>sudo</code> từ chối chạy <em>HOÀN TOÀN</em> — kể cả cái <code>sudo</code> mà bạn cần để đi sửa nó. Khôi phục từ tình huống đó nghĩa là chế độ đơn người dùng hoặc một console cứu hộ. Trước khi đóng trình soạn thảo, hãy giữ một terminal thứ hai đang có phiên <code>sudo</code> chạy được, và thử luật mới ở đó.</div>
<pre><code><span class="tok-comment"># Ai đã chạy gì</span>
sudo journalctl -u sudo --since today
sudo grep sudo /var/log/auth.log | tail -20</code></pre>
<div class="out">Aug 22 11:42:03 vps sudo: deploy : TTY=pts/1 ; PWD=/srv/app ;
  USER=root ; COMMAND=/bin/systemctl restart myapp</div>

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
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Who</span><span class="lz-t">id</span><span class="lz-d">Which UID and which groups is the failing process ACTUALLY running as? For a service, not you — check the unit or use ps.</span></div>
  <div class="lz-step"><span class="lz-k">2 · What path</span><span class="lz-t">namei -l /full/path/to/thing</span><span class="lz-d">Prints the mode and owner of EVERY component. The failing one is usually a directory partway up, not the file at the end.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Prove it</span><span class="lz-t">sudo -u &lt;theuser&gt; &lt;the exact command&gt;</span><span class="lz-d">Reproduce the failure as that identity. If it now succeeds, the problem is not the file — it is the environment, the working directory, or something above.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Not permissions?</span><span class="lz-t">mount | grep ' ro,' · lsattr file · df -h</span><span class="lz-d">Read-only filesystem, immutable attribute, or a full disk all report as denial or failure. None is fixed by chmod.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Above the bits</span><span class="lz-t">dmesg -T | tail · ausearch -m avc -ts recent</span><span class="lz-d">AppArmor or SELinux denials never show up in ls -l. If the bits look right and it still fails, look here.</span></div>
  <div class="lz-step"><span class="lz-k">6 · Fix one thing</span><span class="lz-t">chmod / chown / usermod on the ONE component you identified</span><span class="lz-d">Then re-run step 3 to confirm. Never chmod 777 and move on.</span></div>
</div>

<h3>Step 1: who is actually running this</h3>
<pre><code>id                                    <span class="tok-comment"># you, right now</span>
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
<pre><code><span class="tok-comment"># The correct fix: grant traversal on the one directory that blocks it</span>
sudo chmod o+x /srv/app
<span class="tok-comment"># or, better, use a group</span>
sudo chgrp -R webread /srv/app/config &amp;&amp; sudo usermod -aG webread www-data</code></pre>

<h3>Step 3: reproduce as the right user</h3>
<pre><code>sudo -u www-data cat /srv/app/config/db.yml
sudo -u www-data test -r /srv/app/config/db.yml &amp;&amp; echo readable || echo NOT readable
sudo -u postgres psql -c 'select 1'</code></pre>
<div class="out">cat: /srv/app/config/db.yml: Permission denied
NOT readable</div>
<p>This is the step that converts an argument into evidence. If the command succeeds as that user, then the file is fine and the real difference is elsewhere — a different working directory, a different <code>PATH</code>, a systemd sandbox setting, or a relative path resolved from somewhere you did not expect.</p>

<h3>Step 4: the causes that are not permissions</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Read-only filesystem</span><span class="v"><code>mount | grep ' ro,'</code>. A disk that hit an I/O error gets remounted read-only by the kernel to protect it. Everything looks writable in <code>ls -l</code> and nothing can be written. Check <code>dmesg -T | grep -i 'remount\\|I/O error'</code>.</span></div>
  <div class="kv"><span class="k">Immutable attribute</span><span class="v"><code>lsattr file</code> showing <code>----i---------</code>. Even root cannot write it until <code>sudo chattr -i file</code>. Rare, and utterly baffling if you do not know the attribute exists.</span></div>
  <div class="kv"><span class="k">Disk or inodes full</span><span class="v"><code>df -h</code> and <code>df -i</code>. A full disk usually says "No space left", but some programs report the failed write as a permission problem. Inode exhaustion is worse: <code>df -h</code> shows free space while every create fails.</span></div>
  <div class="kv"><span class="k">Missing execute bit</span><span class="v"><code>./script.sh: Permission denied</code> with the file plainly there. <code>chmod +x</code>. This is the most common one of all, and Chapter 1 met it already.</span></div>
  <div class="kv"><span class="k">Bad interpreter</span><span class="v"><code>bad interpreter: No such file or directory</code> on a script that exists. Usually Windows line endings — the shebang reads <code>#!/bin/bash\\r</code>. <code>tr -d '\\r'</code> or <code>dos2unix</code> (Lesson 3.4).</span></div>
  <div class="kv"><span class="k">noexec mount</span><span class="v">Scripts in <code>/tmp</code> refusing to run on a hardened server. <code>mount | grep /tmp</code> shows <code>noexec</code> — the filesystem forbids execution regardless of the mode bits.</span></div>
</div>

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
<pre><code>id www-data
<span class="tok-comment"># uid=33(www-data) gid=33(www-data) groups=33(www-data)</span>

<span class="tok-comment"># Not the owner, not in the deploy group → the "other" bits apply: r-x. No w.</span>
<span class="tok-comment"># Fix: give the directory to the user that must write it.</span>
sudo chown www-data:www-data /srv/app/uploads
sudo chmod 755 /srv/app/uploads

<span class="tok-comment"># Verify with the SAME command that failed</span>
sudo -u www-data touch /srv/app/uploads/test.txt &amp;&amp; echo OK</code></pre>
<div class="out">OK</div>
<p>Six commands, no guessing, and the change was to exactly one directory. Compare with <code>chmod -R 777 /srv/app</code>, which would also have "worked", would have made every file on the site world-writable, and would have taught you nothing about why.</p>

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
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Ai</span><span class="lz-t">id</span><span class="lz-d">Tiến trình đang hỏng THẬT SỰ chạy với UID nào và những nhóm nào? Với một dịch vụ thì không phải bạn — hãy xem unit hoặc dùng ps.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Đường dẫn nào</span><span class="lz-t">namei -l /đường/dẫn/đầy/đủ</span><span class="lz-d">In ra chế độ và chủ sở hữu của MỌI thành phần. Cái đang hỏng thường là một thư mục nằm lưng chừng, không phải file ở cuối.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Chứng minh</span><span class="lz-t">sudo -u &lt;người-đó&gt; &lt;đúng lệnh đó&gt;</span><span class="lz-d">Dựng lại chỗ hỏng với danh tính đó. Nếu giờ nó chạy được thì vấn đề không nằm ở file — nó nằm ở môi trường, ở thư mục làm việc, hoặc ở đâu đó phía trên.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Không phải quyền?</span><span class="lz-t">mount | grep ' ro,' · lsattr file · df -h</span><span class="lz-d">Hệ thống file chỉ-đọc, thuộc tính bất biến, hay đĩa đầy đều báo ra thành từ chối hoặc thất bại. Không cái nào chữa được bằng chmod.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Phía trên các bit</span><span class="lz-t">dmesg -T | tail · ausearch -m avc -ts recent</span><span class="lz-d">Từ chối của AppArmor hay SELinux KHÔNG BAO GIỜ hiện ra trong ls -l. Nếu các bit trông đúng mà vẫn hỏng, hãy nhìn vào đây.</span></div>
  <div class="lz-step"><span class="lz-k">6 · Sửa một thứ</span><span class="lz-t">chmod / chown / usermod lên ĐÚNG thành phần bạn vừa xác định</span><span class="lz-d">Rồi chạy lại bước 3 để xác nhận. Đừng bao giờ chmod 777 rồi đi tiếp.</span></div>
</div>

<h3>Bước 1: ai thật sự đang chạy cái này</h3>
<pre><code>id                                    <span class="tok-comment"># bạn, ngay lúc này</span>
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
<pre><code><span class="tok-comment"># Cách chữa đúng: cấp quyền đi xuyên qua trên đúng cái thư mục đang chặn</span>
sudo chmod o+x /srv/app
<span class="tok-comment"># hoặc, tốt hơn, dùng một nhóm</span>
sudo chgrp -R webread /srv/app/config &amp;&amp; sudo usermod -aG webread www-data</code></pre>

<h3>Bước 3: dựng lại với đúng người dùng</h3>
<pre><code>sudo -u www-data cat /srv/app/config/db.yml
sudo -u www-data test -r /srv/app/config/db.yml &amp;&amp; echo đọc được || echo KHÔNG đọc được
sudo -u postgres psql -c 'select 1'</code></pre>
<div class="out">cat: /srv/app/config/db.yml: Permission denied
KHÔNG đọc được</div>
<p>Đây là bước biến một cuộc tranh cãi thành bằng chứng. Nếu lệnh chạy được với danh nghĩa người dùng đó, thì file không có vấn đề gì và khác biệt thật nằm ở chỗ khác — một thư mục làm việc khác, một <code>PATH</code> khác, một thiết lập hộp cát của systemd, hay một đường dẫn tương đối được giải từ chỗ bạn không ngờ tới.</p>

<h3>Bước 4: những nguyên nhân KHÔNG phải quyền</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Hệ thống file chỉ-đọc</span><span class="v"><code>mount | grep ' ro,'</code>. Một cái đĩa gặp lỗi I/O sẽ bị nhân gắn lại ở chế độ chỉ-đọc để bảo vệ nó. Mọi thứ nhìn trong <code>ls -l</code> đều ghi được mà chẳng ghi được gì cả. Hãy kiểm <code>dmesg -T | grep -i 'remount\\|I/O error'</code>.</span></div>
  <div class="kv"><span class="k">Thuộc tính bất biến</span><span class="v"><code>lsattr file</code> hiện ra <code>----i---------</code>. Ngay cả root cũng không ghi được cho tới khi <code>sudo chattr -i file</code>. Hiếm, và cực kỳ khó hiểu nếu bạn không biết là có cái thuộc tính đó.</span></div>
  <div class="kv"><span class="k">Hết đĩa hoặc hết inode</span><span class="v"><code>df -h</code> và <code>df -i</code>. Đĩa đầy thường báo "No space left", nhưng vài chương trình báo lần ghi hỏng đó thành vấn đề quyền. Hết inode còn tệ hơn: <code>df -h</code> hiện ra vẫn còn chỗ trống trong khi mọi lệnh tạo file đều hỏng.</span></div>
  <div class="kv"><span class="k">Thiếu bit chạy</span><span class="v"><code>./script.sh: Permission denied</code> trong khi file rành rành ở đó. <code>chmod +x</code>. Đây là cái phổ biến nhất trong tất cả, và Chương 1 đã gặp rồi.</span></div>
  <div class="kv"><span class="k">Sai trình thông dịch</span><span class="v"><code>bad interpreter: No such file or directory</code> trên một script có thật. Thường là kết thúc dòng kiểu Windows — dòng shebang đọc ra thành <code>#!/bin/bash\\r</code>. Dùng <code>tr -d '\\r'</code> hoặc <code>dos2unix</code> (Bài 3.4).</span></div>
  <div class="kv"><span class="k">Gắn với cờ noexec</span><span class="v">Script trong <code>/tmp</code> từ chối chạy trên một máy chủ đã gia cố. <code>mount | grep /tmp</code> hiện ra <code>noexec</code> — hệ thống file CẤM chạy bất kể các bit chế độ.</span></div>
</div>

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
<pre><code>id www-data
<span class="tok-comment"># uid=33(www-data) gid=33(www-data) groups=33(www-data)</span>

<span class="tok-comment"># Không phải chủ, không ở trong nhóm deploy → các bit "other" áp dụng: r-x. Không có w.</span>
<span class="tok-comment"># Chữa: giao thư mục cho đúng người dùng phải ghi vào nó.</span>
sudo chown www-data:www-data /srv/app/uploads
sudo chmod 755 /srv/app/uploads

<span class="tok-comment"># Kiểm lại bằng CHÍNH cái lệnh vừa hỏng</span>
sudo -u www-data touch /srv/app/uploads/test.txt &amp;&amp; echo OK</code></pre>
<div class="out">OK</div>
<p>Sáu lệnh, không đoán mò, và thay đổi rơi vào đúng một thư mục. Hãy so với <code>chmod -R 777 /srv/app</code>, thứ cũng sẽ "chạy được", cũng sẽ làm mọi file của trang web trở nên cả thế giới ghi được, và cũng sẽ chẳng dạy bạn được gì về lý do.</p>

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
      description: 'Tám câu về lớp quyền không cộng dồn, x trên thư mục, xoá file chỉ-đọc, chmod -R với chữ X, umask, setgid, nhóm chưa có hiệu lực, và cách kiểm một vấn đề quyền cho đúng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on permissions, users and diagnosis. Answer from memory; they follow the lesson order.</p>
<div class="callout ok">Aim for 7/8. The three that matter most in real work: what <code>x</code> means on a directory (4.1), why deleting a read-only file works (4.1), and why testing with <code>sudo</code> proves nothing (4.5).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về quyền, người dùng và chẩn đoán. Trả lời bằng trí nhớ; các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Ba câu quan trọng nhất trong việc thật: <code>x</code> trên một thư mục nghĩa là gì (bài 4.1), vì sao xoá được một file chỉ-đọc (bài 4.1), và vì sao thử bằng <code>sudo</code> thì chẳng chứng minh được gì (bài 4.5).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'A file is r--rwxrwx and you are its owner. Can you write to it?|||Một file mang quyền r--rwxrwx và bạn là chủ sở hữu của nó. Bạn ghi vào được không?',
            options: [
              'Yes — group and other both grant write, and permissions accumulate|||Được — cả group lẫn other đều cho ghi, mà quyền thì cộng dồn',
              'No — being the owner means only the USER bits apply, and they say read-only|||Không — là chủ sở hữu nghĩa là CHỈ các bit USER áp dụng, và chúng nói chỉ-đọc',
              'Yes, but only after running chmod on it first|||Được, nhưng phải chạy chmod lên nó trước đã',
              'Only if you are also in the file\'s group|||Chỉ khi bạn cũng ở trong nhóm của file',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does the x bit mean on a DIRECTORY?|||Bit x trên một THƯ MỤC nghĩa là gì?',
            options: [
              'You may run the files inside it as programs|||Bạn được chạy các file bên trong nó như chương trình',
              'You may traverse it — enter it, and reach anything on a path that passes through it|||Bạn được đi xuyên qua nó — bước vào, và với tới bất cứ thứ gì trên đường dẫn đi ngang qua nó',
              'You may list the names inside it|||Bạn được liệt kê các tên bên trong nó',
              'You may create and delete entries in it|||Bạn được tạo và xoá các mục trong nó',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'notes.txt is owned by root and mode r--r--r--, but sits in a directory you own and can write. Can you delete it?|||notes.txt thuộc về root và mang chế độ r--r--r--, nhưng nằm trong một thư mục bạn sở hữu và ghi được. Bạn xoá được nó không?',
            options: [
              'No — the file is read-only and owned by root|||Không — file chỉ-đọc và thuộc về root',
              'Only with sudo|||Chỉ khi dùng sudo',
              'Yes — deleting removes a NAME from a directory, so what matters is w on the DIRECTORY, which you have|||Được — xoá là gỡ một CÁI TÊN khỏi một thư mục, nên thứ có ý nghĩa là w trên THƯ MỤC, mà bạn thì có',
              'Yes, but only if you first chmod the file|||Được, nhưng phải chmod cái file trước đã',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'Why is "chmod -R 755 /srv/app" wrong, and what should you use instead?|||Vì sao "chmod -R 755 /srv/app" là sai, và nên dùng gì thay vào?',
            options: [
              'It is too slow; use find with -exec instead for performance|||Nó quá chậm; hãy dùng find với -exec cho nhanh hơn',
              'It makes every data file executable; use capital X (chmod -R u=rwX,go=rX) which adds x only to directories and already-executable files|||Nó làm mọi file dữ liệu thành chạy được; hãy dùng chữ X hoa (chmod -R u=rwX,go=rX), thứ chỉ thêm x cho thư mục và những file vốn đã chạy được',
              'It does not recurse into hidden directories; add --all|||Nó không đệ quy vào thư mục ẩn; hãy thêm --all',
              'Nothing is wrong with it; 755 is the standard mode for a whole tree|||Chẳng có gì sai cả; 755 là chế độ chuẩn cho cả một cây thư mục',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Your umask is 022. What mode does a newly created FILE get, and why?|||umask của bạn là 022. Một FILE vừa được tạo sẽ mang chế độ nào, và vì sao?',
            options: [
              '755, because 777 minus 022 is 755|||755, vì 777 trừ 022 bằng 755',
              '644 — programs request 666 for files (never the execute bit), and the mask clears group and other write|||644 — chương trình xin 666 cho file (không bao giờ xin bit chạy), và mặt nạ xoá quyền ghi của group và other',
              '622, because the mask only affects the owner|||622, vì mặt nạ chỉ ảnh hưởng tới chủ sở hữu',
              '600, because umask always makes new files private|||600, vì umask luôn làm file mới thành riêng tư',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does setgid on a DIRECTORY do, and what else does a shared team directory need?|||setgid trên một THƯ MỤC làm gì, và một thư mục dùng chung của đội còn cần gì nữa?',
            options: [
              'It makes programs inside run as root; nothing else is needed|||Nó làm các chương trình bên trong chạy với quyền root; không cần gì thêm',
              'New files inherit the DIRECTORY\'s group instead of the creator\'s — and you also need umask 002, or group write is stripped before setgid applies|||File mới thừa kế nhóm CỦA THƯ MỤC thay vì nhóm của người tạo — và bạn còn cần umask 002, nếu không quyền ghi của nhóm bị bóc mất trước khi setgid kịp áp dụng',
              'It prevents anyone but the owner from deleting files|||Nó ngăn mọi người trừ chủ sở hữu xoá file',
              'It makes the directory world-writable automatically|||Nó tự động làm thư mục thành cả thế giới ghi được',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You run "sudo usermod -aG docker $USER", then "docker ps" still fails. Why?|||Bạn chạy "sudo usermod -aG docker $USER", rồi "docker ps" vẫn hỏng. Vì sao?',
            options: [
              'The docker group does not grant socket access; you need sudo permanently|||Nhóm docker không cấp quyền truy cập socket; bạn cần sudo vĩnh viễn',
              'You needed -G without the -a|||Đáng lẽ phải dùng -G không có -a',
              'Group membership is copied into the process at login and inherited by children — your current shell still holds the old list. Log out and back in, or use newgrp|||Tư cách thành viên nhóm được chép vào tiến trình lúc đăng nhập rồi cho tiến trình con thừa kế — shell hiện tại của bạn vẫn giữ danh sách cũ. Hãy đăng xuất rồi vào lại, hoặc dùng newgrp',
              'usermod needs a system restart to take effect|||usermod cần khởi động lại cả hệ thống mới có hiệu lực',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'nginx cannot read a file. Which test actually tells you whether it is a permission problem?|||nginx không đọc được một file. Phép thử nào THẬT SỰ cho bạn biết đó có phải vấn đề quyền hay không?',
            options: [
              'sudo cat the file — if that works, permissions are fine|||sudo cat cái file — nếu chạy được thì quyền không có vấn đề',
              'chmod 777 the file and see if the error goes away|||chmod 777 cái file rồi xem lỗi có biến mất không',
              'sudo -u www-data cat the file, plus namei -l on the full path — test as the identity that is actually failing|||sudo -u www-data cat cái file, cộng namei -l lên toàn bộ đường dẫn — thử với đúng cái danh tính đang hỏng',
              'Restart nginx and check the log again|||Khởi động lại nginx rồi xem log lần nữa',
            ],
            correctIndex: 2,
            points: 1,
          },
        ],
      },
    },
  ],
};
