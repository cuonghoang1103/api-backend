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
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
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
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
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
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
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
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
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
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
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
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: dựng một thư mục dùng chung thật sự chạy được</span><span class="lc-sub">Bài chấm điểm: hai người dùng, một thư mục, file mà cả hai đều sửa được — bằng nhóm + setgid + umask, và được kiểm bằng cách ghi thật với cả hai tài khoản.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> đặt setuid lên một script shell rồi tưởng là nó đã có tác dụng. Linux <strong>BỎ QUA</strong> bit setuid trên script thông dịch — <code>ls -l</code> vẫn hiện chữ <code>s</code>, <code>chmod</code> không báo lỗi nào, và script đơn giản là chạy với đặc quyền của chính bạn. Lý do là một tình huống tranh chấp có thật giữa lúc nhân kiểm file và lúc trình thông dịch mở nó ra, và tình huống đó không bịt được. Nên ở đây cái bit không phải một rủi ro an ninh tinh vi; nó chỉ là vô tác dụng. Hãy dùng <code>sudo</code> với một luật cụ thể thay vào.</div>
<p class="note-ct"><strong>Hai thứ nên mang theo từ bài này.</strong> Với bất kỳ máy chủ nào bạn tiếp quản, hãy chạy <code>find / -perm -4000 -type f 2&gt;/dev/null</code> một lần và ĐỌC danh sách — mất mười giây, và đó là một trong số ít phép kiểm tìm ra cửa hậu chứ không phải tìm ra lỗi. Và mỗi khi một đội dùng chung thư mục, hãy nhớ bộ ba: <strong>chgrp, chmod 2775, umask 002</strong>. Làm hai trong ba thì ra một thư mục TRÔNG như đã cấu hình và lặng lẽ thì không.</p>
</div>
`,
    },
  ],
};
