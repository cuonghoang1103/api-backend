/**
 * Linux & Bash — Mục 0: Giới thiệu · Shell là gì · Cài đặt · Cách học.
 * Song ngữ EN/VI qua .ml-en / .ml-vi (số khối phải bằng nhau).
 * LUẬT: backtick → &#96;; ${ → \${; < > trong code → &lt; &gt;; & → &amp;.
 * Khối .out (output chạy thật) LUÔN đóng bằng </div>, KHÔNG </code></pre>.
 * KHÔNG dùng <svg> — sanitizeHtml() xoá sạch nó, sơ đồ biến mất không báo lỗi.
 */
const REF = '?ref=%2Fcourses%2Flinux-bash%2Flearn&reflabel=Linux%20%26%20Bash';

export default {
  title: 'Section 0 — Introduction, what a shell is & setup|||Mục 0 — Giới thiệu, shell là gì & cài đặt',
  description: 'Đọc trước tiên: khoá này dành cho ai, vì sao dòng lệnh vẫn là công cụ mạnh nhất sau năm mươi năm, phân biệt kernel/shell/terminal (chỗ ai cũng lẫn), cách có một shell Linux thật trên Windows/macOS/Linux, và bộ lệnh sinh tồn để không bao giờ bị kẹt.',
  lessons: [
    /* ─────────────────────────── 0.1 ─────────────────────────── */
    {
      title: '0.1 — Who this course is for & the full roadmap|||0.1 — Khoá này cho ai & lộ trình toàn khoá',
      slug: 'lnx-0-1-gioi-thieu-lo-trinh',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Vì sao một giao diện chữ từ 1971 vẫn thắng mọi GUI ở những việc nhất định, khoá này lấp khoảng trống nào, và bản đồ 13 chương từ lệnh cd đầu tiên tới vận hành một máy chủ thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>Why a text interface from 1971 still wins</h2>
<p class="lead">Every few years someone declares the command line obsolete, and every year it becomes more central — because deployment, containers, CI, servers and half of modern development happen on machines with no screen attached. If you have ever followed a tutorial by pasting commands you did not understand and hoping, this course closes exactly that gap.</p>

<h3>What the terminal is actually better at</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Repetition</span><span class="v">Renaming 4,000 files by a pattern is one line. In a file manager it is an afternoon, and you will make mistakes.</span></div>
  <div class="kv"><span class="k">Composition</span><span class="v">Small tools joined by pipes solve problems nobody wrote a tool for. No GUI lets you connect two programs you did not plan to connect.</span></div>
  <div class="kv"><span class="k">Remote work</span><span class="v">A server has no desktop. SSH plus a shell is the entire interface — and it works over a bad connection from a phone.</span></div>
  <div class="kv"><span class="k">Reproducibility</span><span class="v">A command can be pasted into a document, reviewed, versioned in Git, and run identically a year later. A sequence of clicks cannot.</span></div>
  <div class="kv"><span class="k">Speed at scale</span><span class="v">Searching ten million lines with <code>grep</code> takes a second. Opening them in an editor takes minutes and may not fit in memory.</span></div>
</div>
<div class="callout ok">The point is not that the terminal beats a GUI at everything — it does not. Reading a photograph, laying out a document, exploring an unfamiliar API: use the tool with pictures. The terminal wins when the task is <em>repeated, composed, remote or reproducible</em>, and that describes most of what happens between writing code and running it in production.</div>

<h3>Who this is for</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">The paster</span><span class="v">You copy commands from tutorials and they usually work. Start at 0.2 — after Chapter 6 you will read a command instead of trusting it.</span></div>
  <div class="kv"><span class="k">The developer who deploys</span><span class="v">You can code, but SSH-ing into a server makes you nervous. Chapters 4, 5, 9 and 11 are written for you.</span></div>
  <div class="kv"><span class="k">The self-taught engineer</span><span class="v">You know twenty commands and suspect there is a system underneath. Chapters 1, 3 and 6 are that system.</span></div>
  <div class="kv"><span class="k">The person on-call</span><span class="v">A server is misbehaving now. Chapter 12 is a recipe book, readable out of order.</span></div>
</div>

<h3>What you will be able to do at the end</h3>
<ul>
  <li>Read an unfamiliar command and predict what it does — including the ones with pipes, redirects and quoting.</li>
  <li>Find any file on a machine by name, size, age or content, and act on all of them in one line.</li>
  <li>Understand permissions well enough to fix "Permission denied" instead of reaching for <code>sudo</code>.</li>
  <li>See what a machine is actually doing: which process is eating the CPU, what is holding a port, why the disk is full.</li>
  <li>Write shell scripts that fail loudly instead of silently, with argument checking and cleanup on exit.</li>
  <li>Run a service under <code>systemd</code>, schedule work, read the logs, and harden SSH.</li>
  <li>Diagnose a server you have never seen before, using nothing but a terminal.</li>
</ul>

<h3>The 13-chapter roadmap</h3>
<div class="lz-map">
  <div class="lz-stage">Part 1 — Moving around (Ch 1–3)</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">The shell &amp; the filesystem</div><div class="lz-nsub">What a shell really is, absolute vs relative paths, the directory tree and what each top-level folder is for</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Files &amp; directories</div><div class="lz-nsub">Create, copy, move, delete safely · globs · find · links · archives</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Text, pipes &amp; redirection</div><div class="lz-nsub">The idea that makes Unix work: small tools, one job each, joined by pipes. grep, sed, awk, sort, cut</div></div></div>
</div>
<div class="lz-map">
  <div class="lz-stage">Part 2 — How the machine works (Ch 4–5)</div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Permissions, users &amp; sudo</div><div class="lz-nsub">rwx, chmod, chown, umask, groups — and why "Permission denied" is usually not a sudo problem</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Processes, jobs &amp; signals</div><div class="lz-nsub">ps, top, kill, background jobs, nohup — what Ctrl-C actually sends and why some programs ignore it</div></div></div>
</div>
<div class="lz-map">
  <div class="lz-stage">Part 3 — The shell as a language (Ch 6–8)</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Variables, quoting &amp; expansion</div><div class="lz-nsub">The chapter that stops commands from breaking on a space in a filename. Exit codes, conditionals, loops, functions</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Writing production scripts</div><div class="lz-nsub">set -euo pipefail, arguments, validation, trap for cleanup, and how to debug a script</div></div></div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Environment, PATH &amp; startup files</div><div class="lz-nsub">Why "command not found" happens, which file to edit, and login vs interactive shells</div></div></div>
</div>
<div class="lz-map">
  <div class="lz-stage">Part 4 — Running a machine (Ch 9–13)</div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Networking &amp; remote machines</div><div class="lz-nsub">ss, ip, curl, dig, ssh, scp, rsync — and reading a firewall</div></div></div>
  <div class="lz-node"><div class="lz-badge">10</div><div class="lz-nbody"><div class="lz-ntitle">Disk, packages &amp; logs</div><div class="lz-nsub">df vs du, finding what filled the disk, apt/dnf, journalctl, log rotation</div></div></div>
  <div class="lz-node"><div class="lz-badge">11</div><div class="lz-nbody"><div class="lz-ntitle">systemd, cron &amp; administration</div><div class="lz-nsub">Running your app as a service that restarts itself, scheduled work, hardening SSH</div></div></div>
  <div class="lz-node"><div class="lz-badge">12</div><div class="lz-nbody"><div class="lz-ntitle">Diagnosing a real server</div><div class="lz-nsub">A recipe book: disk full, port in use, service will not start, machine is slow, out of memory</div></div></div>
</div>

<h3>Bash, and the other shells</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">bash</span><span class="v">What this course teaches. The default on nearly every Linux server, and the language of almost every script you will inherit.</span></div>
  <div class="kv"><span class="k">zsh</span><span class="v">macOS's default since 2019. Nearly all of this course applies unchanged; differences are flagged where they matter.</span></div>
  <div class="kv"><span class="k">sh / dash</span><span class="v">The POSIX minimum. Scripts starting <code>#!/bin/sh</code> must avoid Bash-only features — Chapter 7 covers the trap.</span></div>
  <div class="kv"><span class="k">fish</span><span class="v">Friendlier interactively, deliberately not POSIX-compatible. Fine as your daily shell; do not write scripts in it for servers.</span></div>
</div>

<a class="link-card" href="https://www.gnu.org/software/bash/manual/bash.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">The GNU Bash Reference Manual</span><span class="lc-sub">The definitive source. Dense, complete, and the place to settle any argument about expansion.</span></span>
</a>
<a class="link-card" href="https://linuxjourney.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🧭</span>
  <span class="lc-body"><span class="lc-title">Linux Journey — a free structured tour of Linux</span><span class="lc-sub">Good companion reading: shorter lessons, same order as this course.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: the Linux &amp; Bash track on Code Lab</span><span class="lc-sub">Graded exercises that mirror these chapters. Read here, drill there.</span></span>
</a>

<div class="pitfall"><strong>The trap this course exists to break:</strong> running commands you do not understand because a blog post said to. Most of the time it works, which is exactly the problem — the one time it does not, you have no idea what state the machine is in, and the command that "fixed" it for someone else may have deleted something for you. By Chapter 6 you will be able to read <code>find . -name '*.log' -mtime +30 -delete</code> and know precisely what it will remove before pressing Enter.</div>
<p class="note-ct"><strong>How to use this course:</strong> keep a throwaway Linux machine open beside it and run every command as you read. Lesson 0.3 sets one up — a container or a VM you can destroy and rebuild in thirty seconds. Reading about <code>rm -rf</code> teaches nothing; running it somewhere consequence-free teaches permanently.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Vì sao một giao diện chữ từ năm 1971 tới giờ vẫn thắng</h2>
<p class="lead">Cứ vài năm lại có người tuyên bố dòng lệnh đã lỗi thời, và năm nào nó cũng trở nên trung tâm hơn — vì triển khai, container, CI, máy chủ và một nửa việc phát triển phần mềm hiện đại diễn ra trên những cái máy không gắn màn hình nào. Nếu bạn từng làm theo một hướng dẫn bằng cách dán những lệnh mình không hiểu rồi hy vọng, khoá này lấp đúng khoảng trống đó.</p>

<h3>Terminal thật sự giỏi hơn ở chỗ nào</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Lặp lại</span><span class="v">Đổi tên 4.000 file theo một quy luật là một dòng lệnh. Trong trình quản lý file thì mất cả buổi chiều, và bạn sẽ làm sai.</span></div>
  <div class="kv"><span class="k">Ghép nối</span><span class="v">Những công cụ nhỏ nối bằng ống dẫn giải được những bài toán chưa ai viết công cụ riêng. Không GUI nào cho bạn nối hai chương trình mà người ta không tính trước là sẽ nối.</span></div>
  <div class="kv"><span class="k">Làm việc từ xa</span><span class="v">Một máy chủ không có màn hình. SSH cộng một shell là toàn bộ giao diện — và nó chạy được qua một đường mạng tồi, từ điện thoại.</span></div>
  <div class="kv"><span class="k">Tái lập được</span><span class="v">Một lệnh dán được vào tài liệu, review được, lưu phiên bản trong Git được, và một năm sau chạy lại y hệt. Một chuỗi cú bấm chuột thì không.</span></div>
  <div class="kv"><span class="k">Nhanh ở quy mô lớn</span><span class="v">Tìm trong mười triệu dòng bằng <code>grep</code> mất một giây. Mở chúng trong trình soạn thảo mất vài phút và có thể không vừa bộ nhớ.</span></div>
</div>
<div class="callout ok">Điểm mấu chốt không phải là terminal thắng GUI ở mọi thứ — không hề. Xem một tấm ảnh, dàn trang một tài liệu, khám phá một API lạ: hãy dùng công cụ có hình. Terminal thắng khi công việc là <em>lặp lại, ghép nối, từ xa hoặc cần tái lập</em>, và đó chính là mô tả cho phần lớn những gì diễn ra giữa lúc viết mã và lúc chạy nó trên production.</div>

<h3>Khoá này dành cho ai</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Người quen dán lệnh</span><span class="v">Bạn chép lệnh từ hướng dẫn và chúng thường chạy được. Bắt đầu từ bài 0.2 — sau Chương 6 bạn sẽ ĐỌC một lệnh thay vì tin nó.</span></div>
  <div class="kv"><span class="k">Lập trình viên có deploy</span><span class="v">Bạn code được, nhưng SSH vào máy chủ thì thấy lo lo. Chương 4, 5, 9 và 11 viết cho bạn.</span></div>
  <div class="kv"><span class="k">Kỹ sư tự học</span><span class="v">Bạn biết hai mươi lệnh và ngờ rằng bên dưới có một hệ thống. Chương 1, 3 và 6 chính là cái hệ thống đó.</span></div>
  <div class="kv"><span class="k">Người đang trực</span><span class="v">Có một máy chủ đang trục trặc ngay lúc này. Chương 12 là sách công thức, đọc lẻ được.</span></div>
</div>

<h3>Học xong bạn làm được gì</h3>
<ul>
  <li>Đọc một lệnh lạ và đoán trước nó làm gì — kể cả những lệnh có ống dẫn, chuyển hướng và dấu nháy.</li>
  <li>Tìm mọi file trên một máy theo tên, kích thước, tuổi hay nội dung, và tác động lên tất cả chúng trong một dòng.</li>
  <li>Hiểu quyền đủ sâu để sửa lỗi "Permission denied" thay vì vớ lấy <code>sudo</code>.</li>
  <li>Nhìn ra máy đang thật sự làm gì: tiến trình nào ngốn CPU, cái gì đang giữ một cổng, vì sao đĩa đầy.</li>
  <li>Viết script shell hỏng thì kêu to chứ không hỏng trong im lặng, có kiểm tham số và dọn dẹp khi thoát.</li>
  <li>Chạy một dịch vụ dưới <code>systemd</code>, hẹn giờ công việc, đọc log, và gia cố SSH.</li>
  <li>Chẩn đoán một máy chủ bạn chưa từng thấy, chỉ bằng một cái terminal.</li>
</ul>

<h3>Lộ trình 13 chương</h3>
<div class="lz-map">
  <div class="lz-stage">Phần 1 — Đi lại trong máy (Ch 1–3)</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Shell &amp; hệ thống file</div><div class="lz-nsub">Shell thật ra là gì, đường dẫn tuyệt đối vs tương đối, cây thư mục và mỗi thư mục gốc dùng để làm gì</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">File &amp; thư mục</div><div class="lz-nsub">Tạo, chép, chuyển, xoá an toàn · glob · find · liên kết · nén và giải nén</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Văn bản, ống dẫn &amp; chuyển hướng</div><div class="lz-nsub">Ý tưởng làm nên Unix: công cụ nhỏ, mỗi cái một việc, nối bằng ống. grep, sed, awk, sort, cut</div></div></div>
</div>
<div class="lz-map">
  <div class="lz-stage">Phần 2 — Máy hoạt động thế nào (Ch 4–5)</div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Quyền, người dùng &amp; sudo</div><div class="lz-nsub">rwx, chmod, chown, umask, nhóm — và vì sao "Permission denied" thường không phải chuyện thiếu sudo</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Tiến trình, job &amp; tín hiệu</div><div class="lz-nsub">ps, top, kill, chạy nền, nohup — Ctrl-C thật ra gửi cái gì và vì sao vài chương trình lờ nó đi</div></div></div>
</div>
<div class="lz-map">
  <div class="lz-stage">Phần 3 — Shell như một ngôn ngữ (Ch 6–8)</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Biến, dấu nháy &amp; khai triển</div><div class="lz-nsub">Chương làm cho lệnh của bạn thôi vỡ vì một dấu cách trong tên file. Mã thoát, rẽ nhánh, vòng lặp, hàm</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Viết script cho production</div><div class="lz-nsub">set -euo pipefail, tham số, kiểm tính hợp lệ, trap để dọn dẹp, và cách gỡ lỗi một script</div></div></div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Môi trường, PATH &amp; file khởi động</div><div class="lz-nsub">Vì sao có "command not found", sửa file nào, và shell đăng nhập vs shell tương tác</div></div></div>
</div>
<div class="lz-map">
  <div class="lz-stage">Phần 4 — Vận hành một cái máy (Ch 9–13)</div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Mạng &amp; máy từ xa</div><div class="lz-nsub">ss, ip, curl, dig, ssh, scp, rsync — và đọc một cái tường lửa</div></div></div>
  <div class="lz-node"><div class="lz-badge">10</div><div class="lz-nbody"><div class="lz-ntitle">Đĩa, gói phần mềm &amp; log</div><div class="lz-nsub">df vs du, tìm ra thứ làm đầy đĩa, apt/dnf, journalctl, xoay vòng log</div></div></div>
  <div class="lz-node"><div class="lz-badge">11</div><div class="lz-nbody"><div class="lz-ntitle">systemd, cron &amp; quản trị</div><div class="lz-nsub">Chạy ứng dụng của bạn như một dịch vụ tự khởi động lại, hẹn giờ công việc, gia cố SSH</div></div></div>
  <div class="lz-node"><div class="lz-badge">12</div><div class="lz-nbody"><div class="lz-ntitle">Chẩn đoán một máy chủ thật</div><div class="lz-nsub">Sách công thức: đĩa đầy, cổng bị chiếm, dịch vụ không lên, máy chậm, hết bộ nhớ</div></div></div>
</div>

<h3>Bash, và những shell khác</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">bash</span><span class="v">Thứ khoá này dạy. Mặc định trên gần như mọi máy chủ Linux, và là ngôn ngữ của gần như mọi script bạn sẽ tiếp quản.</span></div>
  <div class="kv"><span class="k">zsh</span><span class="v">Mặc định của macOS từ 2019. Gần như toàn bộ khoá này áp dụng nguyên vẹn; những chỗ khác biệt đáng kể đều được ghi chú.</span></div>
  <div class="kv"><span class="k">sh / dash</span><span class="v">Mức tối thiểu theo POSIX. Script bắt đầu bằng <code>#!/bin/sh</code> phải tránh các tính năng chỉ có ở Bash — Chương 7 nói về cái bẫy này.</span></div>
  <div class="kv"><span class="k">fish</span><span class="v">Thân thiện hơn khi gõ tay, cố tình không tương thích POSIX. Dùng làm shell hằng ngày thì ổn; đừng viết script cho máy chủ bằng nó.</span></div>
</div>

<a class="link-card" href="https://www.gnu.org/software/bash/manual/bash.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Sách tra cứu Bash của GNU</span><span class="lc-sub">Nguồn chuẩn mực. Đặc, đầy đủ, và là nơi dàn xếp mọi tranh cãi về khai triển.</span></span>
</a>
<a class="link-card" href="https://linuxjourney.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🧭</span>
  <span class="lc-body"><span class="lc-title">Linux Journey — chuyến tham quan Linux miễn phí, có cấu trúc</span><span class="lc-sub">Đọc kèm rất hợp: bài ngắn hơn, cùng thứ tự với khoá này.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: track Linux &amp; Bash trên Code Lab</span><span class="lc-sub">Bài tập chấm điểm bám theo các chương này. Đọc ở đây, luyện ở đó.</span></span>
</a>

<div class="pitfall"><strong>Cái bẫy mà khoá này sinh ra để phá:</strong> chạy những lệnh bạn không hiểu chỉ vì một bài blog bảo thế. Phần lớn thời gian nó chạy được, và đó chính là vấn đề — cái lần duy nhất nó không chạy được, bạn chẳng biết cái máy đang ở trạng thái nào, và cái lệnh "chữa được" cho người khác có thể đã xoá mất thứ gì đó của bạn. Tới Chương 6 bạn sẽ đọc được <code>find . -name '*.log' -mtime +30 -delete</code> và biết chính xác nó sẽ xoá gì trước khi bấm Enter.</div>
<p class="note-ct"><strong>Cách dùng khoá này:</strong> hãy mở sẵn một máy Linux vứt đi bên cạnh và chạy mọi lệnh khi bạn đọc tới. Bài 0.3 dựng cho bạn một cái — một container hay một máy ảo mà bạn phá và dựng lại trong ba mươi giây. Đọc về <code>rm -rf</code> không dạy được gì; chạy nó ở một nơi không có hậu quả thì dạy được vĩnh viễn.</p>
</div>
`,
    },

    /* ─────────────────────────── 0.2 ─────────────────────────── */
    {
      title: '0.2 — Kernel, shell, terminal: three things people confuse|||0.2 — Kernel, shell, terminal: ba thứ người ta hay lẫn',
      slug: 'lnx-0-2-kernel-shell-terminal',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Phân biệt ba lớp mà ai cũng gọi nhầm là "terminal", triết lý Unix trong một câu, vì sao "mọi thứ là một file", và bức tranh giúp mọi chương sau đọc được.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>The three layers behind that black window</h2>
<p class="lead">People say "the terminal", "the shell", "the command line" and "Linux" as if they were one thing. They are four, they sit in layers, and knowing which is which explains half the confusing errors you will meet.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Terminal emulator</span><span class="lz-v">The <strong>window</strong>. iTerm, Windows Terminal, GNOME Terminal, the panel in VS Code. It draws characters and captures keystrokes. It runs no commands.</span></div>
  <div class="lz-layer"><span class="lz-k">Shell</span><span class="lz-v">The <strong>program</strong> running inside that window — <code>bash</code>, <code>zsh</code>, <code>fish</code>. It reads what you type, interprets it, and starts other programs.</span></div>
  <div class="lz-layer"><span class="lz-k">Utilities</span><span class="lz-v">The <strong>programs</strong> the shell starts: <code>ls</code>, <code>grep</code>, <code>curl</code>. Separate executables on disk, not part of the shell.</span></div>
  <div class="lz-layer"><span class="lz-k">Kernel</span><span class="lz-v">Linux itself. The only thing that actually touches hardware — files, memory, network, processes. Every program asks it for everything.</span></div>
</div>
<pre><code><span class="tok-comment"># Which shell am I in, and where does it live?</span>
<span class="tok-keyword">echo</span> \$SHELL
ps -p \$\$ -o comm=
<span class="tok-comment"># Is 'ls' a program or part of the shell?</span>
<span class="tok-keyword">type</span> ls; <span class="tok-keyword">type</span> cd</code></pre>
<div class="out">/bin/bash
bash
ls is /usr/bin/ls
cd is a shell builtin</div>
<div class="callout ok">That last pair is the distinction made concrete. <code>ls</code> is a file on disk that the shell launches. <code>cd</code> cannot be — changing directory means changing the shell's <em>own</em> state, and a separate program could not do that. Every "why is <code>cd</code> special?" question has this answer.</div>

<h3>The Unix philosophy, in one sentence</h3>
<div class="callout ok"><strong>Write programs that do one thing well, and that work together, on text streams.</strong> That is the entire design, from 1978, and it is why Chapter 3's pipes are the most important idea in this course.</div>
<p>Compare the two worlds. A monolithic tool has a "search" feature, a "sort" feature and an "export" feature, and can only combine them in ways its author anticipated. Unix ships <code>grep</code>, <code>sort</code> and <code>tee</code> as separate programs — so you can combine them in ways nobody anticipated:</p>
<pre><code><span class="tok-comment"># Nobody wrote "top 5 IPs by 500-error count". You just did.</span>
grep <span class="tok-string">' 500 '</span> access.log | awk <span class="tok-string">'{print \$1}'</span> | sort | uniq -c | sort -rn | head -5</code></pre>
<div class="out">    412 203.0.113.44
     87 198.51.100.9
     31 203.0.113.7</div>
<p>Five programs, none of which knows the others exist. That composability is what a GUI structurally cannot offer.</p>

<h3>"Everything is a file"</h3>
<p>Unix exposes almost everything through the same interface — open, read, write, close — so the same tools work on all of it:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Ordinary files</span><span class="v"><code>/etc/hostname</code>, your source code. What you expect.</span></div>
  <div class="kv"><span class="k">Directories</span><span class="v">A file listing what is inside it. That is why permissions on a directory behave oddly until Chapter 4 explains it.</span></div>
  <div class="kv"><span class="k">Devices</span><span class="v"><code>/dev/sda</code> is your disk, <code>/dev/null</code> discards anything written to it, <code>/dev/urandom</code> produces random bytes forever.</span></div>
  <div class="kv"><span class="k">Kernel state</span><span class="v"><code>/proc/cpuinfo</code>, <code>/proc/meminfo</code>, <code>/sys/class/…</code>. Not real files — the kernel generates them when you read.</span></div>
  <div class="kv"><span class="k">Processes</span><span class="v"><code>/proc/1234/</code> is process 1234: its command line, environment, open files. Chapter 5 uses this.</span></div>
</div>
<pre><code>cat /proc/meminfo | head -3        <span class="tok-comment"># kernel state, read like a text file</span>
<span class="tok-keyword">echo</span> <span class="tok-string">"noise"</span> &gt; /dev/null            <span class="tok-comment"># the universal wastebasket</span>
head -c 8 /dev/urandom | xxd       <span class="tok-comment"># randomness, read like a file</span></code></pre>
<div class="out">MemTotal:       16316904 kB
MemFree:         2184532 kB
MemAvailable:    9847220 kB</div>

<h3>What happens when you press Enter</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">The terminal sends the line</div><div class="lz-d">Your keystrokes reach the shell as text.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">The shell expands it</div><div class="lz-d">Variables, <code>*</code> globs, quotes, <code>\$(…)</code> — Chapter 6. The command that runs is often not what you typed.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">It finds the program</div><div class="lz-d">Searches each directory in <code>PATH</code> in order — Chapter 8, and the source of "command not found".</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">It asks the kernel to run it</div><div class="lz-d">A new process is created with three streams already open: stdin, stdout, stderr.</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">It waits, then reports</div><div class="lz-d">The program exits with a status code; the shell stores it in <code>\$?</code> — Chapter 6.</div></div>
</div>
<div class="callout warn">Step 2 is where beginners lose control. <code>rm *.txt</code> never reaches <code>rm</code> as <code>*.txt</code> — the shell expands the glob first, and <code>rm</code> receives a list of filenames it has no idea was ever a pattern. When a command behaves unexpectedly, the question is usually "what did the shell turn this into?", not "what does this program do?".</div>

<h3>Distributions: what actually differs</h3>
<p>Ubuntu, Debian, Fedora, Alpine and Arch all run the Linux kernel and all give you a shell. For everything in this course, the differences are narrow:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Package manager</span><span class="v"><code>apt</code> (Debian/Ubuntu) · <code>dnf</code> (Fedora/RHEL) · <code>apk</code> (Alpine) · <code>pacman</code> (Arch). Chapter 10.</span></div>
  <div class="kv"><span class="k">Init system</span><span class="v"><code>systemd</code> nearly everywhere; Alpine uses OpenRC. Chapter 11.</span></div>
  <div class="kv"><span class="k">Default shell &amp; utilities</span><span class="v">Alpine ships BusyBox — smaller versions of the same commands, missing some flags. A script that works on Ubuntu can fail in an Alpine container for exactly this reason.</span></div>
</div>

<a class="link-card" href="https://en.wikipedia.org/wiki/Unix_philosophy" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">The Unix philosophy — McIlroy's original formulation</span><span class="lc-sub">Four sentences from 1978 that explain the design of everything in this course.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man7/proc.7.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">proc(7) — the /proc filesystem, documented</span><span class="lc-sub">Every file the kernel exposes about itself and about running processes.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> assuming a command failed because "Linux is broken", when the shell never ran the command you meant. A stray space, an unquoted variable containing a space, or a glob that matched nothing all produce errors that name the <em>program</em> and hide the real cause. Chapter 6 gives you <code>set -x</code>, which prints the command after expansion — and settles the question in one line.</div>
<p class="note-ct"><strong>The picture to carry forward:</strong> you type into a <em>terminal</em>, which feeds a <em>shell</em>, which expands what you wrote and asks the <em>kernel</em> to run separate <em>programs</em>. Every chapter of this course lives at one of those layers, and knowing which one a problem belongs to is most of the diagnosis.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Ba lớp đằng sau cái cửa sổ đen ấy</h2>
<p class="lead">Người ta nói "terminal", "shell", "dòng lệnh" và "Linux" như thể chúng là một thứ. Chúng là bốn thứ, xếp thành lớp, và biết cái nào là cái nào sẽ giải thích được một nửa số lỗi khó hiểu bạn sẽ gặp.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Trình giả lập terminal</span><span class="lz-v">Cái <strong>CỬA SỔ</strong>. iTerm, Windows Terminal, GNOME Terminal, ô terminal trong VS Code. Nó vẽ ký tự và bắt phím. Nó không chạy lệnh nào cả.</span></div>
  <div class="lz-layer"><span class="lz-k">Shell</span><span class="lz-v">Cái <strong>CHƯƠNG TRÌNH</strong> chạy bên trong cửa sổ đó — <code>bash</code>, <code>zsh</code>, <code>fish</code>. Nó đọc thứ bạn gõ, diễn giải, rồi khởi động các chương trình khác.</span></div>
  <div class="lz-layer"><span class="lz-k">Các tiện ích</span><span class="lz-v">Những <strong>CHƯƠNG TRÌNH</strong> mà shell khởi động: <code>ls</code>, <code>grep</code>, <code>curl</code>. Là các file thực thi riêng trên đĩa, không thuộc về shell.</span></div>
  <div class="lz-layer"><span class="lz-k">Kernel (nhân)</span><span class="lz-v">Chính là Linux. Thứ duy nhất thật sự chạm vào phần cứng — file, bộ nhớ, mạng, tiến trình. Mọi chương trình đều phải xin nó mọi thứ.</span></div>
</div>
<pre><code><span class="tok-comment"># Tôi đang ở shell nào, và nó nằm ở đâu?</span>
<span class="tok-keyword">echo</span> \$SHELL
ps -p \$\$ -o comm=
<span class="tok-comment"># 'ls' là một chương trình hay là một phần của shell?</span>
<span class="tok-keyword">type</span> ls; <span class="tok-keyword">type</span> cd</code></pre>
<div class="out">/bin/bash
bash
ls is /usr/bin/ls
cd is a shell builtin</div>
<div class="callout ok">Cặp cuối cùng đó là sự phân biệt được cụ thể hoá. <code>ls</code> là một file trên đĩa mà shell khởi chạy. <code>cd</code> thì không thể như thế — đổi thư mục nghĩa là đổi trạng thái <em>CỦA CHÍNH</em> shell, và một chương trình riêng biệt không làm được điều đó. Mọi câu hỏi "vì sao <code>cd</code> lại đặc biệt?" đều có câu trả lời này.</div>

<h3>Triết lý Unix, trong một câu</h3>
<div class="callout ok"><strong>Hãy viết những chương trình làm một việc và làm giỏi, và phối hợp được với nhau, trên các dòng văn bản.</strong> Đó là toàn bộ thiết kế, từ năm 1978, và đó là lý do ống dẫn ở Chương 3 là ý tưởng quan trọng nhất của khoá này.</div>
<p>Hãy so hai thế giới. Một công cụ nguyên khối có tính năng "tìm", tính năng "sắp xếp" và tính năng "xuất ra", và chỉ ghép chúng lại được theo những cách mà tác giả nó lường trước. Unix giao <code>grep</code>, <code>sort</code> và <code>tee</code> như những chương trình riêng — nên bạn ghép chúng theo những cách chẳng ai lường trước:</p>
<pre><code><span class="tok-comment"># Không ai viết công cụ "top 5 IP theo số lỗi 500". Bạn vừa tự viết ra.</span>
grep <span class="tok-string">' 500 '</span> access.log | awk <span class="tok-string">'{print \$1}'</span> | sort | uniq -c | sort -rn | head -5</code></pre>
<div class="out">    412 203.0.113.44
     87 198.51.100.9
     31 203.0.113.7</div>
<p>Năm chương trình, không cái nào biết những cái kia tồn tại. Khả năng ghép nối đó là thứ mà một GUI, về mặt cấu trúc, không cung cấp nổi.</p>

<h3>"Mọi thứ đều là một file"</h3>
<p>Unix phơi gần như mọi thứ ra qua cùng một giao diện — mở, đọc, ghi, đóng — nên cùng một bộ công cụ chạy được trên tất cả:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">File thông thường</span><span class="v"><code>/etc/hostname</code>, mã nguồn của bạn. Đúng như bạn nghĩ.</span></div>
  <div class="kv"><span class="k">Thư mục</span><span class="v">Một file liệt kê những gì nằm bên trong nó. Vì thế quyền trên một thư mục hành xử hơi lạ, cho tới khi Chương 4 giải thích.</span></div>
  <div class="kv"><span class="k">Thiết bị</span><span class="v"><code>/dev/sda</code> là cái đĩa của bạn, <code>/dev/null</code> vứt bỏ mọi thứ ghi vào nó, <code>/dev/urandom</code> sinh byte ngẫu nhiên mãi mãi.</span></div>
  <div class="kv"><span class="k">Trạng thái kernel</span><span class="v"><code>/proc/cpuinfo</code>, <code>/proc/meminfo</code>, <code>/sys/class/…</code>. Không phải file thật — kernel sinh ra chúng vào lúc bạn đọc.</span></div>
  <div class="kv"><span class="k">Tiến trình</span><span class="v"><code>/proc/1234/</code> chính là tiến trình 1234: dòng lệnh, môi trường, các file đang mở của nó. Chương 5 dùng tới cái này.</span></div>
</div>
<pre><code>cat /proc/meminfo | head -3        <span class="tok-comment"># trạng thái kernel, đọc như một file chữ</span>
<span class="tok-keyword">echo</span> <span class="tok-string">"noise"</span> &gt; /dev/null            <span class="tok-comment"># cái sọt rác vạn năng</span>
head -c 8 /dev/urandom | xxd       <span class="tok-comment"># sự ngẫu nhiên, đọc như một file</span></code></pre>
<div class="out">MemTotal:       16316904 kB
MemFree:         2184532 kB
MemAvailable:    9847220 kB</div>

<h3>Chuyện gì xảy ra khi bạn bấm Enter</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Terminal gửi dòng chữ đi</div><div class="lz-d">Các phím bạn gõ tới tay shell dưới dạng văn bản.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Shell khai triển nó</div><div class="lz-d">Biến, glob <code>*</code>, dấu nháy, <code>\$(…)</code> — Chương 6. Lệnh được chạy thường KHÔNG phải thứ bạn gõ.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Nó tìm chương trình</div><div class="lz-d">Lần lượt tìm trong từng thư mục của <code>PATH</code> — Chương 8, và là nguồn gốc của "command not found".</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Nó nhờ kernel chạy chương trình</div><div class="lz-d">Một tiến trình mới ra đời với ba dòng đã mở sẵn: stdin, stdout, stderr.</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Nó chờ, rồi báo cáo</div><div class="lz-d">Chương trình thoát kèm một mã trạng thái; shell lưu nó vào <code>\$?</code> — Chương 6.</div></div>
</div>
<div class="callout warn">Bước 2 là chỗ người mới mất quyền kiểm soát. <code>rm *.txt</code> không bao giờ tới tay <code>rm</code> dưới dạng <code>*.txt</code> — shell khai triển cái glob trước, và <code>rm</code> nhận một danh sách tên file mà nó chẳng hề biết từng là một mẫu. Khi một lệnh hành xử ngoài dự đoán, câu hỏi thường là "shell đã biến cái này thành gì?", chứ không phải "chương trình này làm gì?".</div>

<h3>Các bản phân phối: thật ra khác nhau ở đâu</h3>
<p>Ubuntu, Debian, Fedora, Alpine và Arch đều chạy nhân Linux và đều cho bạn một shell. Với mọi thứ trong khoá này, khác biệt là rất hẹp:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Trình quản lý gói</span><span class="v"><code>apt</code> (Debian/Ubuntu) · <code>dnf</code> (Fedora/RHEL) · <code>apk</code> (Alpine) · <code>pacman</code> (Arch). Chương 10.</span></div>
  <div class="kv"><span class="k">Hệ khởi động</span><span class="v"><code>systemd</code> ở gần như mọi nơi; Alpine dùng OpenRC. Chương 11.</span></div>
  <div class="kv"><span class="k">Shell và tiện ích mặc định</span><span class="v">Alpine đi kèm BusyBox — phiên bản nhỏ hơn của cùng những lệnh đó, thiếu một số cờ. Một script chạy tốt trên Ubuntu có thể hỏng trong container Alpine đúng vì lý do này.</span></div>
</div>

<a class="link-card" href="https://en.wikipedia.org/wiki/Unix_philosophy" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">Triết lý Unix — bản phát biểu gốc của McIlroy</span><span class="lc-sub">Bốn câu từ năm 1978 giải thích thiết kế của mọi thứ trong khoá này.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man7/proc.7.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">proc(7) — hệ thống file /proc, có tài liệu đầy đủ</span><span class="lc-sub">Mọi file mà kernel phơi ra về chính nó và về các tiến trình đang chạy.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> cho rằng một lệnh hỏng vì "Linux dở hơi", trong khi shell chưa bao giờ chạy cái lệnh bạn định chạy. Một dấu cách lạc, một biến không bọc nháy có chứa dấu cách, hay một glob không khớp gì — tất cả đều sinh ra lỗi mang tên <em>CHƯƠNG TRÌNH</em> và giấu đi nguyên nhân thật. Chương 6 cho bạn <code>set -x</code>, thứ in ra cái lệnh SAU khi khai triển — và dàn xếp câu hỏi đó trong một dòng.</div>
<p class="note-ct"><strong>Bức tranh cần mang theo:</strong> bạn gõ vào một <em>terminal</em>, nó nạp cho một <em>shell</em>, shell khai triển thứ bạn viết rồi nhờ <em>kernel</em> chạy những <em>chương trình</em> riêng biệt. Mọi chương của khoá này sống ở một trong các lớp đó, và biết một vấn đề thuộc lớp nào đã là phần lớn của việc chẩn đoán.</p>
</div>
`,
    },

    /* ─────────────────────────── 0.3 ─────────────────────────── */
    {
      title: '0.3 — Getting a real Linux shell on any machine|||0.3 — Có một shell Linux thật trên mọi loại máy',
      slug: 'lnx-0-3-cai-dat',
      type: 'LESSON',
      isFreePreview: true,
      description: 'WSL2 trên Windows, macOS và chỗ nó khác Linux, Docker làm sân tập vứt đi, và cấu hình terminal tối thiểu để phần còn lại của khoá dễ chịu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>A machine you are allowed to destroy</h2>
<p class="lead">Everything in this course should be run, not read. That means a Linux shell you can break without consequence — and on every platform there is a good option that takes under ten minutes.</p>

<h3>Windows — WSL2</h3>
<pre><code><span class="tok-comment"># In PowerShell as Administrator, once:</span>
wsl --install
<span class="tok-comment"># Reboot, then set a username and password when Ubuntu first starts.</span>

wsl --list --verbose        <span class="tok-comment"># check it is version 2</span>
wsl                          <span class="tok-comment"># enter the Linux shell</span></code></pre>
<p>WSL2 runs a genuine Linux kernel in a lightweight VM. It is not an emulation layer — <code>apt</code>, <code>systemd</code>, Docker and everything in this course behave as they do on a server.</p>
<div class="callout warn"><strong>Keep your project files inside the Linux filesystem</strong>, at <code>~/projects</code>, not on <code>/mnt/c/Users/…</code>. Crossing the Windows/Linux boundary makes file access roughly ten times slower, and permissions do not translate — a script you <code>chmod +x</code> on <code>/mnt/c</code> may not stay executable. Open the folder from VS Code with the WSL extension and it feels native.</div>

<h3>macOS — close, but not Linux</h3>
<p>macOS is Unix, so the shape is the same and most of this course applies unchanged. The differences are worth knowing before they confuse you:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">BSD utilities, not GNU</span><span class="v"><code>sed -i</code> needs an argument on macOS (<code>sed -i '' …</code>), <code>ls</code> colours differ, some <code>find</code> flags are missing. Scripts written on macOS often break on a Linux server.</span></div>
  <div class="kv"><span class="k">No systemd</span><span class="v">macOS uses <code>launchd</code>. Chapter 11 is Linux-only; read it, and run it on a container or a server.</span></div>
  <div class="kv"><span class="k">Different filesystem layout</span><span class="v">No <code>/proc</code>. Package installs land in <code>/opt/homebrew</code> or <code>/usr/local</code>, not <code>/usr</code>.</span></div>
</div>
<pre><code><span class="tok-comment"># Get the GNU tools so commands behave as on a server:</span>
brew install coreutils findutils gnu-sed grep gawk
<span class="tok-comment"># They install with a 'g' prefix: gsed, ggrep, gfind. Either use those,</span>
<span class="tok-comment"># or put the gnubin directories first in PATH (Chapter 8).</span></code></pre>

<h3>Linux — you are already there</h3>
<pre><code>cat /etc/os-release | head -2
uname -srm</code></pre>
<div class="out">NAME="Ubuntu"
VERSION="24.04.1 LTS (Noble Numbat)"
Linux 6.8.0-45-generic x86_64</div>

<h3>The disposable playground — Docker</h3>
<p>Even on Linux, a container is the right place to run the destructive parts of this course. It starts in a second and <code>exit</code> throws it away entirely:</p>
<pre><code><span class="tok-comment"># A clean Ubuntu shell. --rm deletes the container when you leave.</span>
docker run --rm -it ubuntu:24.04 bash

<span class="tok-comment"># Inside, get the tools this course uses:</span>
apt update &amp;&amp; apt install -y \\
  curl less tree file findutils procps iproute2 vim ca-certificates</code></pre>
<div class="callout ok">This is where you run <code>rm -rf</code>, fill the disk, kill init, and break permissions — the experiments that teach the most and that you must never try on a real machine. Type <code>exit</code> and the damage ceases to exist. Rebuilding takes one command.</div>
<pre><code><span class="tok-comment"># Keep a lab container between sessions, with a folder shared from your machine:</span>
docker run -it --name lab -v <span class="tok-string">"\$PWD/lab:/root/lab"</span> ubuntu:24.04 bash
<span class="tok-comment"># Later:</span>
docker start -ai lab</code></pre>
<div class="callout warn">A container is not a full machine. There is no <code>systemd</code> by default (Chapter 11 needs a VM or a real server), the network is isolated, and the base image is minimal — many commands are simply not installed until you add them. When something is "missing", check whether it is a container limitation before assuming Linux lacks it.</div>

<h3>A minimal terminal setup</h3>
<pre><code><span class="tok-comment"># Confirm which shell you are running, and switch to bash if you want to</span>
<span class="tok-comment"># follow this course exactly (macOS defaults to zsh).</span>
<span class="tok-keyword">echo</span> \$SHELL
chsh -s /bin/bash            <span class="tok-comment"># optional; log out and back in</span>

<span class="tok-comment"># Make history useful — big, deduplicated, and shared across windows.</span>
cat &gt;&gt; ~/.bashrc &lt;&lt;<span class="tok-string">'EOF'</span>
HISTSIZE=100000
HISTFILESIZE=200000
HISTCONTROL=ignoreboth:erasedups
shopt -s histappend cmdhist checkwinsize
EOF
<span class="tok-keyword">source</span> ~/.bashrc</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Ctrl-R</span><span class="v">Search backwards through history. The single most useful key combination in this course.</span></div>
  <div class="kv"><span class="k">Tab</span><span class="v">Complete a command, path or option. Press it twice to list the possibilities.</span></div>
  <div class="kv"><span class="k">Ctrl-A / Ctrl-E</span><span class="v">Jump to the start / end of the line.</span></div>
  <div class="kv"><span class="k">Ctrl-U / Ctrl-W</span><span class="v">Delete to the start of the line / delete the previous word.</span></div>
  <div class="kv"><span class="k">Ctrl-L</span><span class="v">Clear the screen without losing what you have typed.</span></div>
</div>
<pre><code><span class="tok-comment"># Two optional installs that pay for themselves immediately:</span>
sudo apt install -y tldr bat   <span class="tok-comment"># short examples; a nicer cat with syntax highlighting</span>
tldr tar                        <span class="tok-comment"># the five tar commands anyone actually uses</span></code></pre>

<h3>Verify you are ready</h3>
<pre><code>uname -a &amp;&amp; <span class="tok-keyword">echo</span> <span class="tok-string">"---"</span> &amp;&amp; \\
<span class="tok-keyword">for</span> c <span class="tok-keyword">in</span> bash ls grep sed awk find curl ps; <span class="tok-keyword">do</span>
  <span class="tok-keyword">command</span> -v <span class="tok-string">"\$c"</span> &gt;/dev/null &amp;&amp; <span class="tok-keyword">echo</span> <span class="tok-string">"ok   \$c"</span> || <span class="tok-keyword">echo</span> <span class="tok-string">"MISSING \$c"</span>
<span class="tok-keyword">done</span></code></pre>
<div class="out">Linux lab 6.8.0-45-generic #45-Ubuntu SMP x86_64 GNU/Linux
---
ok   bash
ok   ls
ok   grep
ok   sed
ok   awk
ok   find
ok   curl
ok   ps</div>
<p>You will not understand that loop yet — it is Chapter 6. Run it anyway; by the end of this course you will read it at a glance.</p>

<h3>Four ways to get a shell, and what each one really is</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">WSL2</span><span class="lz-t">A real Linux kernel on Windows</span><span class="lz-d">Full syscall compatibility, and the filesystem boundary is the thing to watch — keep projects under <code>~</code>, not <code>/mnt/c</code>, or every file operation crosses a translation layer.</span></div>
  <div class="lz-node"><span class="lz-k">macOS Terminal</span><span class="lz-t">BSD userland, not Linux</span><span class="lz-d"><code>sed</code>, <code>date</code> and <code>xargs</code> take different flags. Scripts written here break on a server; install the GNU tools if you want them to match.</span></div>
  <div class="lz-node"><span class="lz-k">A Linux desktop</span><span class="lz-t">Already the target</span><span class="lz-d">Nothing to install, and the only setup that guarantees your local commands behave the way the VPS will.</span></div>
  <div class="lz-node"><span class="lz-k">A Docker container</span><span class="lz-t">Disposable and identical</span><span class="lz-d"><code>docker run -it --rm debian bash</code>. Break it freely, and it matches the distribution your server actually runs.</span></div>
</div>
<a class="link-card" href="https://learn.microsoft.com/en-us/windows/wsl/install" target="_blank" rel="noopener">
  <span class="lc-ico">🪟</span>
  <span class="lc-body"><span class="lc-title">Microsoft Docs — Install WSL</span><span class="lc-sub">Official setup, plus the VS Code integration and the filesystem performance note.</span></span>
</a>
<a class="link-card" href="https://tldr.sh/" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">tldr pages — practical examples for every command</span><span class="lc-sub">What you want when <code>man</code> gives you 900 lines and you need the common case.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> learning on macOS and deploying to Linux without knowing the utilities differ. The classic casualty is <code>sed -i</code>: on Linux <code>sed -i 's/a/b/' f</code> edits in place, while macOS requires <code>sed -i '' 's/a/b/' f</code> — and the Linux form silently creates a backup file named after your expression. Test anything destined for a server on Linux, in a container if nothing else.</div>
<p class="note-ct"><strong>Set up the lab container now, before Chapter 1.</strong> Every chapter has commands that are only educational when you can afford for them to go wrong — filling a disk, killing the wrong process, removing a permission you need. Having a place where that costs nothing is the difference between learning this material and reading about it.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Một cái máy mà bạn được phép phá</h2>
<p class="lead">Mọi thứ trong khoá này nên được CHẠY, không phải chỉ đọc. Nghĩa là bạn cần một shell Linux có thể phá mà không hậu quả — và trên nền tảng nào cũng có một lựa chọn tốt, mất chưa tới mười phút.</p>

<h3>Windows — WSL2</h3>
<pre><code><span class="tok-comment"># Trong PowerShell với quyền Administrator, một lần:</span>
wsl --install
<span class="tok-comment"># Khởi động lại, rồi đặt tên người dùng và mật khẩu khi Ubuntu chạy lần đầu.</span>

wsl --list --verbose        <span class="tok-comment"># kiểm xem có đúng phiên bản 2 không</span>
wsl                          <span class="tok-comment"># vào shell Linux</span></code></pre>
<p>WSL2 chạy một nhân Linux thật trong một máy ảo nhẹ. Nó không phải một lớp giả lập — <code>apt</code>, <code>systemd</code>, Docker và mọi thứ trong khoá này hành xử đúng như trên một máy chủ.</p>
<div class="callout warn"><strong>Hãy để file dự án BÊN TRONG hệ thống file Linux</strong>, ở <code>~/projects</code>, đừng để trên <code>/mnt/c/Users/…</code>. Vượt qua ranh giới Windows/Linux làm việc truy cập file chậm khoảng mười lần, và quyền thì không quy đổi được — một script bạn <code>chmod +x</code> trên <code>/mnt/c</code> có thể không giữ được bit thực thi. Hãy mở thư mục từ VS Code bằng tiện ích WSL và nó chạy như bản địa.</div>

<h3>macOS — gần giống, nhưng không phải Linux</h3>
<p>macOS là Unix, nên hình dạng giống nhau và phần lớn khoá này áp dụng nguyên vẹn. Những khác biệt đáng biết trước khi chúng làm bạn rối:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Tiện ích BSD, không phải GNU</span><span class="v"><code>sed -i</code> trên macOS cần một tham số (<code>sed -i '' …</code>), màu của <code>ls</code> khác, vài cờ của <code>find</code> không có. Script viết trên macOS thường hỏng trên máy chủ Linux.</span></div>
  <div class="kv"><span class="k">Không có systemd</span><span class="v">macOS dùng <code>launchd</code>. Chương 11 chỉ dành cho Linux; hãy đọc nó, và chạy nó trên một container hay một máy chủ.</span></div>
  <div class="kv"><span class="k">Bố cục hệ thống file khác</span><span class="v">Không có <code>/proc</code>. Gói cài đặt rơi vào <code>/opt/homebrew</code> hoặc <code>/usr/local</code>, không phải <code>/usr</code>.</span></div>
</div>
<pre><code><span class="tok-comment"># Cài bộ công cụ GNU để các lệnh hành xử như trên máy chủ:</span>
brew install coreutils findutils gnu-sed grep gawk
<span class="tok-comment"># Chúng cài kèm tiền tố 'g': gsed, ggrep, gfind. Hoặc dùng những tên đó,</span>
<span class="tok-comment"># hoặc đưa các thư mục gnubin lên đầu PATH (Chương 8).</span></code></pre>

<h3>Linux — bạn đã ở sẵn đó rồi</h3>
<pre><code>cat /etc/os-release | head -2
uname -srm</code></pre>
<div class="out">NAME="Ubuntu"
VERSION="24.04.1 LTS (Noble Numbat)"
Linux 6.8.0-45-generic x86_64</div>

<h3>Sân tập vứt đi — Docker</h3>
<p>Ngay cả khi đang ở Linux, một container vẫn là chỗ đúng để chạy những phần phá hoại của khoá này. Nó khởi động trong một giây và <code>exit</code> là vứt nó đi hoàn toàn:</p>
<pre><code><span class="tok-comment"># Một shell Ubuntu sạch. --rm xoá container khi bạn rời đi.</span>
docker run --rm -it ubuntu:24.04 bash

<span class="tok-comment"># Bên trong, cài các công cụ khoá này dùng:</span>
apt update &amp;&amp; apt install -y \\
  curl less tree file findutils procps iproute2 vim ca-certificates</code></pre>
<div class="callout ok">Đây là chỗ bạn chạy <code>rm -rf</code>, làm đầy đĩa, giết init, và phá quyền — những thí nghiệm dạy được nhiều nhất và tuyệt đối không được thử trên máy thật. Gõ <code>exit</code> là thiệt hại thôi tồn tại. Dựng lại tốn một lệnh.</div>
<pre><code><span class="tok-comment"># Giữ một container thí nghiệm qua nhiều buổi, có chia sẻ một thư mục từ máy bạn:</span>
docker run -it --name lab -v <span class="tok-string">"\$PWD/lab:/root/lab"</span> ubuntu:24.04 bash
<span class="tok-comment"># Về sau:</span>
docker start -ai lab</code></pre>
<div class="callout warn">Một container không phải một cái máy đầy đủ. Mặc định không có <code>systemd</code> (Chương 11 cần một máy ảo hoặc một máy chủ thật), mạng bị cô lập, và ảnh nền là bản tối giản — nhiều lệnh đơn giản là chưa được cài cho tới khi bạn thêm vào. Khi thấy thứ gì "thiếu", hãy kiểm xem đó có phải giới hạn của container không trước khi cho rằng Linux không có nó.</div>

<h3>Cấu hình terminal tối thiểu</h3>
<pre><code><span class="tok-comment"># Xác nhận bạn đang chạy shell nào, và đổi sang bash nếu muốn theo</span>
<span class="tok-comment"># khoá này thật sát (macOS mặc định là zsh).</span>
<span class="tok-keyword">echo</span> \$SHELL
chsh -s /bin/bash            <span class="tok-comment"># tuỳ chọn; đăng xuất rồi vào lại</span>

<span class="tok-comment"># Làm cho lịch sử lệnh có ích — dài, khử trùng lặp, dùng chung giữa các cửa sổ.</span>
cat &gt;&gt; ~/.bashrc &lt;&lt;<span class="tok-string">'EOF'</span>
HISTSIZE=100000
HISTFILESIZE=200000
HISTCONTROL=ignoreboth:erasedups
shopt -s histappend cmdhist checkwinsize
EOF
<span class="tok-keyword">source</span> ~/.bashrc</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Ctrl-R</span><span class="v">Tìm ngược trong lịch sử lệnh. Tổ hợp phím hữu ích nhất của cả khoá này.</span></div>
  <div class="kv"><span class="k">Tab</span><span class="v">Hoàn thành một lệnh, đường dẫn hay tuỳ chọn. Bấm hai lần để liệt kê các khả năng.</span></div>
  <div class="kv"><span class="k">Ctrl-A / Ctrl-E</span><span class="v">Nhảy về đầu / cuối dòng.</span></div>
  <div class="kv"><span class="k">Ctrl-U / Ctrl-W</span><span class="v">Xoá tới đầu dòng / xoá từ đứng trước.</span></div>
  <div class="kv"><span class="k">Ctrl-L</span><span class="v">Xoá màn hình mà không mất thứ bạn đang gõ.</span></div>
</div>
<pre><code><span class="tok-comment"># Hai thứ tuỳ chọn nhưng trả công ngay lập tức:</span>
sudo apt install -y tldr bat   <span class="tok-comment"># ví dụ ngắn gọn; một cat đẹp hơn có tô màu cú pháp</span>
tldr tar                        <span class="tok-comment"># năm lệnh tar mà người ta thật sự dùng</span></code></pre>

<h3>Kiểm xem đã sẵn sàng chưa</h3>
<pre><code>uname -a &amp;&amp; <span class="tok-keyword">echo</span> <span class="tok-string">"---"</span> &amp;&amp; \\
<span class="tok-keyword">for</span> c <span class="tok-keyword">in</span> bash ls grep sed awk find curl ps; <span class="tok-keyword">do</span>
  <span class="tok-keyword">command</span> -v <span class="tok-string">"\$c"</span> &gt;/dev/null &amp;&amp; <span class="tok-keyword">echo</span> <span class="tok-string">"ok   \$c"</span> || <span class="tok-keyword">echo</span> <span class="tok-string">"MISSING \$c"</span>
<span class="tok-keyword">done</span></code></pre>
<div class="out">Linux lab 6.8.0-45-generic #45-Ubuntu SMP x86_64 GNU/Linux
---
ok   bash
ok   ls
ok   grep
ok   sed
ok   awk
ok   find
ok   curl
ok   ps</div>
<p>Bạn chưa hiểu cái vòng lặp đó đâu — nó là Chương 6. Cứ chạy đi; tới cuối khoá này bạn sẽ đọc nó chỉ bằng một cái liếc mắt.</p>

<h3>Bốn cách để có một shell, và mỗi cách thật ra là gì</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">WSL2</span><span class="lz-t">Một nhân Linux thật trên Windows</span><span class="lz-d">Tương thích lời gọi hệ thống đầy đủ, và cái ranh giới hệ tệp mới là thứ cần để ý — hãy giữ dự án dưới <code>~</code>, đừng để ở <code>/mnt/c</code>, không thì mọi thao tác file đều đi qua một lớp phiên dịch.</span></div>
  <div class="lz-node"><span class="lz-k">Terminal của macOS</span><span class="lz-t">Bộ lệnh BSD, không phải Linux</span><span class="lz-d"><code>sed</code>, <code>date</code> và <code>xargs</code> nhận cờ khác nhau. Script viết ở đây sẽ vỡ trên máy chủ; hãy cài bộ công cụ GNU nếu muốn chúng khớp nhau.</span></div>
  <div class="lz-node"><span class="lz-k">Một máy để bàn Linux</span><span class="lz-t">Vốn đã là đích đến</span><span class="lz-d">Chẳng phải cài gì, và là thiết lập duy nhất bảo đảm các lệnh ở máy bạn cư xử đúng như trên VPS.</span></div>
  <div class="lz-node"><span class="lz-k">Một container Docker</span><span class="lz-t">Vứt đi được và giống hệt</span><span class="lz-d"><code>docker run -it --rm debian bash</code>. Cứ phá thoải mái, và nó khớp với bản phân phối mà máy chủ của bạn thật sự chạy.</span></div>
</div>
<a class="link-card" href="https://learn.microsoft.com/en-us/windows/wsl/install" target="_blank" rel="noopener">
  <span class="lc-ico">🪟</span>
  <span class="lc-body"><span class="lc-title">Microsoft Docs — Cài đặt WSL</span><span class="lc-sub">Hướng dẫn chính thức, kèm tích hợp VS Code và ghi chú về hiệu năng hệ thống file.</span></span>
</a>
<a class="link-card" href="https://tldr.sh/" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">tldr pages — ví dụ thực dụng cho mọi lệnh</span><span class="lc-sub">Thứ bạn muốn khi <code>man</code> đưa ra 900 dòng còn bạn chỉ cần trường hợp thường gặp.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> học trên macOS rồi deploy lên Linux mà không biết các tiện ích khác nhau. Nạn nhân kinh điển là <code>sed -i</code>: trên Linux <code>sed -i 's/a/b/' f</code> sửa tại chỗ, còn macOS đòi <code>sed -i '' 's/a/b/' f</code> — và dạng của Linux thì âm thầm tạo một file sao lưu mang tên chính cái biểu thức của bạn. Hãy kiểm mọi thứ sắp lên máy chủ trên Linux, ít nhất là trong một container.</div>
<p class="note-ct"><strong>Hãy dựng container thí nghiệm NGAY BÂY GIỜ, trước Chương 1.</strong> Mọi chương đều có những lệnh chỉ mang tính giáo dục khi bạn kham nổi việc chúng đi sai — làm đầy đĩa, giết nhầm tiến trình, gỡ mất một quyền bạn đang cần. Có một nơi mà việc đó không tốn gì chính là khác biệt giữa HỌC được tài liệu này và chỉ ĐỌC về nó.</p>
</div>
`,
    },

    /* ─────────────────────────── 0.4 ─────────────────────────── */
    {
      title: '0.4 — Survival commands & how to study this course|||0.4 — Bộ lệnh sinh tồn & cách học khoá này',
      slug: 'lnx-0-4-cach-hoc',
      type: 'LESSON',
      description: 'Cách tự tra cứu (man, --help, tldr, ExplainShell), cách thoát khỏi mọi thứ đang kẹt kể cả vim, ba câu hỏi phải trả lời trước mọi lệnh phá huỷ, và nhịp học cả khoá.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>How to never be stuck</h2>
<p class="lead">Nobody remembers the flags. What separates people who are comfortable in a terminal from people who are not is knowing how to look things up in five seconds and how to get out of anything. Both are learnable today.</p>

<h3>The four ways to look something up</h3>
<pre><code>man tar                    <span class="tok-comment"># the full manual. Complete, dense, offline.</span>
tar --help | head -20      <span class="tok-comment"># a summary. Faster, and usually enough.</span>
tldr tar                   <span class="tok-comment"># the five commands people actually use.</span>
<span class="tok-keyword">type</span> -a python            <span class="tok-comment"># what IS this thing, and where does it live?</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">man</span><span class="v">Inside it: <kbd>/</kbd> searches, <kbd>n</kbd> is the next match, <kbd>q</kbd> quits, <kbd>g</kbd>/<kbd>G</kbd> jump to the start/end. It is <code>less</code>, so those keys work in any pager.</span></div>
  <div class="kv"><span class="k">--help</span><span class="v">Works for nearly everything and prints in a second. Pipe it into <code>grep</code> when you know the flag exists but not its name.</span></div>
  <div class="kv"><span class="k">tldr</span><span class="v">Community examples. The right first stop for <code>tar</code>, <code>find</code>, <code>ffmpeg</code> — the commands with a hundred flags and five real uses.</span></div>
  <div class="kv"><span class="k">apropos</span><span class="v"><code>apropos compress</code> searches man page descriptions when you do not know the command's name at all.</span></div>
</div>
<pre><code><span class="tok-comment"># The move that finds a flag in ten seconds:</span>
ls --help | grep -i <span class="tok-string">"sort"</span></code></pre>
<div class="out">      --sort=WORD            sort by WORD instead of name: none (-U), size (-S),
                               time (-t), version (-v), extension (-X), width
  -t                         sort by time, newest first; see --time
  -S                         sort by file size, largest first</div>

<h3>Reading a command you did not write</h3>
<p>Manuals explain one command; a real line has five joined by pipes. Two habits handle that:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Split at the pipes</div><div class="lz-d">Each <code>|</code> is a boundary. Read left to right: each stage takes the previous stage's output.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Run the first stage alone</div><div class="lz-d">Then add one stage at a time and watch the output change. This is the whole technique.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Look up only the unknown flag</div><div class="lz-d"><code>man</code> plus <kbd>/</kbd> and the flag name, rather than reading the page.</div></div>
</div>
<a class="link-card" href="https://explainshell.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🔎</span>
  <span class="lc-body"><span class="lc-title">ExplainShell — paste a command, get every flag annotated</span><span class="lc-sub">Built for exactly the case above: an unfamiliar line with six flags and three pipes.</span></span>
</a>

<h3>Getting out of anything</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Ctrl-C</span><span class="v">Interrupt the running program. The first thing to try, always.</span></div>
  <div class="kv"><span class="k">Ctrl-D</span><span class="v">End of input. Exits the shell, or ends a program reading from stdin (<code>cat</code>, <code>python</code>).</span></div>
  <div class="kv"><span class="k">q</span><span class="v">Quits <code>man</code>, <code>less</code>, <code>git log</code>, <code>top</code> — anything showing a page of text.</span></div>
  <div class="kv"><span class="k">:q!</span><span class="v">Quits <code>vim</code> without saving. <kbd>Esc</kbd> first. This is the one everybody needs once.</span></div>
  <div class="kv"><span class="k">Ctrl-X Ctrl-C</span><span class="v">Quits <code>nano</code>? No — nano is <kbd>Ctrl-X</kbd>. The hint bar at the bottom shows <code>^X</code>, meaning Ctrl-X.</span></div>
  <div class="kv"><span class="k">Ctrl-Z then kill %1</span><span class="v">Suspend a program that ignores Ctrl-C, then kill it. Chapter 5.</span></div>
  <div class="kv"><span class="k">reset</span><span class="v">Terminal showing garbage after you <code>cat</code>-ed a binary? <code>reset</code> fixes it. Type it blind if you cannot see.</span></div>
</div>
<div class="callout ok">Git and many other tools open <code>less</code> to show you output. If a command seems to have "frozen" with a <code>:</code> at the bottom of the screen, it has not — it is waiting for you. Press <kbd>q</kbd>.</div>

<h3>Three questions before any destructive command</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Which files will this actually hit?</div><div class="lz-d">The shell expands globs before the program sees them. Run <code>ls</code> with the same pattern first.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Where am I?</div><div class="lz-d"><code>pwd</code>. The same <code>rm -rf *</code> is harmless in <code>/tmp/lab</code> and catastrophic in <code>/</code>.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Am I root?</div><div class="lz-d">A <code>#</code> prompt instead of <code>$</code> means no permission will stop you. Chapter 4.</div></div>
</div>
<pre><code><span class="tok-comment"># The habit: preview with ls, then swap in the destructive command.</span>
ls -la *.log                    <span class="tok-comment"># ← LOOK first</span>
rm *.log                        <span class="tok-comment"># ← then act</span>

<span class="tok-comment"># find has a built-in preview: run it without -delete first.</span>
find . -name <span class="tok-string">'*.tmp'</span> -mtime +30              <span class="tok-comment"># list</span>
find . -name <span class="tok-string">'*.tmp'</span> -mtime +30 -delete      <span class="tok-comment"># then delete</span></code></pre>
<div class="callout danger">There is no undo and no recycle bin. <code>rm</code> asks the kernel to unlink the file and the space is reusable immediately. The habits above are not caution for beginners — they are what experienced people do, because they are the ones who have deleted something that mattered.</div>

<h3>How to pace the course</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Chapters 1–3</span><span class="v">In order, with a terminal open. This is the foundation; everything later assumes it. Roughly one chapter per sitting.</span></div>
  <div class="kv"><span class="k">Chapters 4–5</span><span class="v">How the machine works. Best learned in the throwaway container, where breaking permissions costs nothing.</span></div>
  <div class="kv"><span class="k">Chapters 6–8</span><span class="v">The shell as a language. Slower going, and the highest-value part of the course — this is where pasted commands become written ones.</span></div>
  <div class="kv"><span class="k">Chapters 9–12</span><span class="v">Reference-shaped. Read what you need when you need it; Chapter 12 is a cookbook to open mid-incident.</span></div>
</div>

<h3>Building the muscle</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Use the terminal for one real task a day</span><span class="lz-v">Rename a batch of files, search a log, check what is using a port. Ten minutes of real work beats an hour of exercises.</span></div>
  <div class="lz-layer"><span class="lz-k">When you copy a command, read it first</span><span class="lz-v">Name each flag out loud, or paste it into ExplainShell. The habit costs twenty seconds and is the entire difference this course is after.</span></div>
  <div class="lz-layer"><span class="lz-k">Keep a personal cheat file</span><span class="lz-v">One text file of commands that solved something. You will reuse it constantly, and writing it is itself the revision.</span></div>
  <div class="lz-layer"><span class="lz-k">Break the container on purpose</span><span class="lz-v">Fill the disk, kill PID 1, remove read permission from your own home directory. Recovering teaches more than any lesson can.</span></div>
</div>

<a class="link-card" href="https://man7.org/linux/man-pages/" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">man7.org — the Linux man pages, online and searchable</span><span class="lc-sub">The same pages as <code>man</code>, but linkable and readable on a phone.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice after each chapter: the Linux &amp; Bash track</span><span class="lc-sub">Graded exercises with solutions, ordered to match these chapters.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> running a command from the internet with <code>sudo</code> in front of it because it failed without. <code>sudo</code> removes the protection that just stopped you, and the most common reason for "Permission denied" is that the command is wrong — the wrong path, the wrong user, a file owned by someone else for a reason. Chapter 4 teaches you to read the error instead. Reaching for <code>sudo</code> reflexively is how a small mistake becomes a system-wide one.</div>
<p class="note-ct"><strong>On memorising:</strong> do not. There are thousands of commands and every one has more flags than anybody remembers. Learn the <em>model</em> — files, processes, streams, permissions — and about forty commands; look everything else up. Someone who understands the model finds the right flag in a minute, while someone who memorised flags is stuck the moment the situation is slightly different.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Cách để không bao giờ bị kẹt</h2>
<p class="lead">Không ai thuộc hết các cờ. Thứ phân biệt người thoải mái trong terminal với người thì không là biết cách tra cứu trong năm giây và biết cách thoát ra khỏi mọi thứ. Cả hai đều học được ngay hôm nay.</p>

<h3>Bốn cách tra cứu</h3>
<pre><code>man tar                    <span class="tok-comment"># sách hướng dẫn đầy đủ. Trọn vẹn, đặc, chạy ngoại tuyến.</span>
tar --help | head -20      <span class="tok-comment"># bản tóm tắt. Nhanh hơn, và thường là đủ.</span>
tldr tar                   <span class="tok-comment"># năm lệnh mà người ta thật sự dùng.</span>
<span class="tok-keyword">type</span> -a python            <span class="tok-comment"># cái này LÀ cái gì, và nó nằm ở đâu?</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">man</span><span class="v">Bên trong nó: <kbd>/</kbd> để tìm, <kbd>n</kbd> tới kết quả kế tiếp, <kbd>q</kbd> để thoát, <kbd>g</kbd>/<kbd>G</kbd> nhảy về đầu/cuối. Nó chính là <code>less</code>, nên các phím đó chạy trong mọi trình phân trang.</span></div>
  <div class="kv"><span class="k">--help</span><span class="v">Chạy được với gần như mọi thứ và in ra trong một giây. Đưa nó vào <code>grep</code> khi bạn biết có cái cờ đó nhưng không nhớ tên.</span></div>
  <div class="kv"><span class="k">tldr</span><span class="v">Ví dụ do cộng đồng viết. Điểm dừng đầu tiên đúng đắn cho <code>tar</code>, <code>find</code>, <code>ffmpeg</code> — những lệnh có một trăm cờ và năm cách dùng thật.</span></div>
  <div class="kv"><span class="k">apropos</span><span class="v"><code>apropos compress</code> tìm trong phần mô tả của các trang man khi bạn hoàn toàn không biết tên lệnh.</span></div>
</div>
<pre><code><span class="tok-comment"># Nước đi tìm ra một cái cờ trong mười giây:</span>
ls --help | grep -i <span class="tok-string">"sort"</span></code></pre>
<div class="out">      --sort=WORD            sort by WORD instead of name: none (-U), size (-S),
                               time (-t), version (-v), extension (-X), width
  -t                         sort by time, newest first; see --time
  -S                         sort by file size, largest first</div>

<h3>Đọc một lệnh không phải bạn viết</h3>
<p>Sách hướng dẫn giải thích MỘT lệnh; một dòng thật có năm lệnh nối bằng ống. Hai thói quen xử lý được chuyện đó:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Chẻ ra ở các dấu ống</div><div class="lz-d">Mỗi <code>|</code> là một ranh giới. Đọc từ trái sang phải: mỗi chặng nhận output của chặng trước.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Chạy riêng chặng đầu tiên</div><div class="lz-d">Rồi thêm từng chặng một và nhìn output đổi đi. Toàn bộ kỹ thuật chỉ có vậy.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Chỉ tra cái cờ bạn chưa biết</div><div class="lz-d"><code>man</code> rồi <kbd>/</kbd> và tên cái cờ, thay vì đọc cả trang.</div></div>
</div>
<a class="link-card" href="https://explainshell.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🔎</span>
  <span class="lc-body"><span class="lc-title">ExplainShell — dán một lệnh vào, nhận chú giải cho từng cờ</span><span class="lc-sub">Dựng ra đúng cho tình huống trên: một dòng lạ với sáu cái cờ và ba dấu ống.</span></span>
</a>

<h3>Thoát ra khỏi mọi thứ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Ctrl-C</span><span class="v">Ngắt chương trình đang chạy. Thứ đầu tiên nên thử, lúc nào cũng vậy.</span></div>
  <div class="kv"><span class="k">Ctrl-D</span><span class="v">Kết thúc đầu vào. Thoát khỏi shell, hoặc kết thúc một chương trình đang đọc stdin (<code>cat</code>, <code>python</code>).</span></div>
  <div class="kv"><span class="k">q</span><span class="v">Thoát <code>man</code>, <code>less</code>, <code>git log</code>, <code>top</code> — mọi thứ đang hiện một trang chữ.</span></div>
  <div class="kv"><span class="k">:q!</span><span class="v">Thoát <code>vim</code> mà không lưu. Bấm <kbd>Esc</kbd> trước. Đây là thứ ai cũng cần đúng một lần.</span></div>
  <div class="kv"><span class="k">Ctrl-X Ctrl-C</span><span class="v">Thoát <code>nano</code> à? Không — nano là <kbd>Ctrl-X</kbd>. Thanh gợi ý ở đáy hiện <code>^X</code>, nghĩa là Ctrl-X.</span></div>
  <div class="kv"><span class="k">Ctrl-Z rồi kill %1</span><span class="v">Tạm dừng một chương trình lờ Ctrl-C đi, rồi giết nó. Chương 5.</span></div>
  <div class="kv"><span class="k">reset</span><span class="v">Terminal hiện toàn ký tự rác sau khi bạn <code>cat</code> một file nhị phân? <code>reset</code> chữa được. Cứ gõ mù nếu không nhìn thấy gì.</span></div>
</div>
<div class="callout ok">Git và nhiều công cụ khác mở <code>less</code> để hiện output cho bạn. Nếu một lệnh có vẻ "đơ" với dấu <code>:</code> ở đáy màn hình thì nó không đơ đâu — nó đang chờ bạn. Bấm <kbd>q</kbd>.</div>

<h3>Ba câu hỏi trước mọi lệnh phá huỷ</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Lệnh này thật ra sẽ chạm vào những file nào?</div><div class="lz-d">Shell khai triển glob TRƯỚC khi chương trình nhìn thấy. Hãy chạy <code>ls</code> với cùng cái mẫu đó trước.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Tôi đang ở đâu?</div><div class="lz-d"><code>pwd</code>. Cùng một lệnh <code>rm -rf *</code> là vô hại ở <code>/tmp/lab</code> và là thảm hoạ ở <code>/</code>.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Tôi có đang là root không?</div><div class="lz-d">Dấu nhắc <code>#</code> thay vì <code>$</code> nghĩa là không có quyền nào chặn bạn lại. Chương 4.</div></div>
</div>
<pre><code><span class="tok-comment"># Thói quen: xem trước bằng ls, rồi mới thay bằng lệnh phá huỷ.</span>
ls -la *.log                    <span class="tok-comment"># ← NHÌN trước</span>
rm *.log                        <span class="tok-comment"># ← rồi mới hành động</span>

<span class="tok-comment"># find có sẵn chế độ xem trước: chạy nó mà chưa có -delete.</span>
find . -name <span class="tok-string">'*.tmp'</span> -mtime +30              <span class="tok-comment"># liệt kê</span>
find . -name <span class="tok-string">'*.tmp'</span> -mtime +30 -delete      <span class="tok-comment"># rồi mới xoá</span></code></pre>
<div class="callout danger">Không có hoàn tác và không có thùng rác. <code>rm</code> nhờ kernel gỡ liên kết tới file và chỗ trống đó dùng lại được ngay lập tức. Những thói quen trên không phải sự thận trọng dành cho người mới — đó là thứ người có kinh nghiệm làm, vì họ chính là những người đã từng xoá mất thứ gì đó quan trọng.</div>

<h3>Nhịp học cả khoá</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Chương 1–3</span><span class="v">Theo thứ tự, mở sẵn một terminal. Đây là nền móng; mọi thứ về sau đều giả định nó. Khoảng một chương mỗi buổi.</span></div>
  <div class="kv"><span class="k">Chương 4–5</span><span class="v">Máy hoạt động thế nào. Học tốt nhất trong container vứt đi, nơi phá hỏng quyền chẳng tốn gì.</span></div>
  <div class="kv"><span class="k">Chương 6–8</span><span class="v">Shell như một ngôn ngữ. Đi chậm hơn, và là phần giá trị nhất của khoá — đây là chỗ những lệnh đi chép trở thành những lệnh do bạn viết.</span></div>
  <div class="kv"><span class="k">Chương 9–12</span><span class="v">Dạng tra cứu. Đọc cái nào cần lúc cần; Chương 12 là sách công thức để mở ra giữa lúc sự cố.</span></div>
</div>

<h3>Luyện cho thành cơ bắp</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Mỗi ngày dùng terminal cho một việc THẬT</span><span class="lz-v">Đổi tên một mớ file, tìm trong một file log, kiểm xem cái gì đang chiếm một cổng. Mười phút việc thật hơn một giờ bài tập.</span></div>
  <div class="lz-layer"><span class="lz-k">Khi chép một lệnh, hãy đọc nó trước</span><span class="lz-v">Gọi tên từng cái cờ thành tiếng, hoặc dán nó vào ExplainShell. Thói quen đó tốn hai mươi giây và chính là toàn bộ khác biệt mà khoá này nhắm tới.</span></div>
  <div class="lz-layer"><span class="lz-k">Giữ một file mẹo cá nhân</span><span class="lz-v">Một file văn bản chứa những lệnh đã giải quyết được việc gì đó. Bạn sẽ dùng lại nó liên tục, và chính việc viết nó ra đã là ôn tập.</span></div>
  <div class="lz-layer"><span class="lz-k">Phá container một cách có chủ ý</span><span class="lz-v">Làm đầy đĩa, giết PID 1, gỡ quyền đọc khỏi chính thư mục nhà của bạn. Việc cứu hộ dạy được nhiều hơn mọi bài giảng.</span></div>
</div>

<a class="link-card" href="https://man7.org/linux/man-pages/" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">man7.org — các trang man của Linux, trực tuyến và tìm được</span><span class="lc-sub">Đúng những trang mà <code>man</code> hiện ra, nhưng gửi link được và đọc được trên điện thoại.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện sau mỗi chương: track Linux &amp; Bash</span><span class="lc-sub">Bài tập chấm điểm kèm lời giải, sắp xếp khớp với các chương này.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> chạy một lệnh lấy trên mạng kèm <code>sudo</code> phía trước chỉ vì không có nó thì hỏng. <code>sudo</code> gỡ bỏ đúng cái lớp bảo vệ vừa chặn bạn lại, và lý do phổ biến nhất của "Permission denied" là lệnh đó SAI — sai đường dẫn, sai người dùng, hoặc một file thuộc về người khác vì một lý do nào đó. Chương 4 dạy bạn đọc cái thông báo lỗi thay vì thế. Vớ lấy <code>sudo</code> theo phản xạ là cách một sai lầm nhỏ trở thành một sai lầm ở tầm toàn hệ thống.</div>
<p class="note-ct"><strong>Về việc học thuộc:</strong> đừng. Có hàng nghìn lệnh và cái nào cũng có nhiều cờ hơn số ai nhớ nổi. Hãy học <em>MÔ HÌNH</em> — file, tiến trình, dòng dữ liệu, quyền — cùng khoảng bốn mươi lệnh; còn lại thì tra. Người hiểu mô hình tìm ra cái cờ đúng trong một phút, còn người học thuộc cờ thì tắc ngay khi tình huống khác đi một chút.</p>
</div>
`,
    },
  ],
};
