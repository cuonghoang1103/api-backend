/**
 * Operating Systems for Developers — Chương 1: Tiến trình.
 * Bài mẫu (cùng Mục 0) cho các agent soạn chương sau — xem _HOP-DONG.md và _PROMPT-AGENT.md.
 * Output CHẠY THẬT trong ảnh `os-lab` (xem lab/moi-truong, lab/out/*.out.txt). LUẬT escaping: < > → &lt; &gt;; & → &amp;;
 * backtick trần → &#96;; ${ của bash → \${ (xem scripts/course-content-check.mjs).
 */
import { code, out, run, grab, whole, src, card, kv, details, ul, esc } from './_ui.mjs';
import { lab } from './_lab.mjs';
import G11 from './giang/os-01-1.mjs';

const REF = '?ref=%2Fcourses%2Foperating-systems-for-developers%2Flearn&reflabel=Operating%20Systems%20for%20Developers';
const L = (href, ico, t, s, cta) => card(href, ico, t, s, cta);

export default {
  title: 'Chapter 1 — Processes|||Chương 1 — Tiến trình',
  description: 'Chương trình đang chạy là gì trong mắt nhân: không gian địa chỉ, thanh ghi, file đang mở, PID; fork/exec/wait và cách mọi tiến trình ra đời; ranh giới user/kernel và giá của một syscall; trạng thái, tín hiệu và mã thoát (exit 137); và PID 1 trong container.',
  lessons: [
    /* ───────────────────────── 1.1 — Tiến trình là gì ───────────────────────── */
    {
      title: '1.1 — What a process is: address space, registers, open files, a PID|||1.1 — Tiến trình là gì: không gian địa chỉ, thanh ghi, file đang mở, một PID',
      slug: 'os-1-1-tien-trinh',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Chương trình vs tiến trình; những gì nhân giữ cho mỗi tiến trình (PCB/task_struct); đọc hết hồ sơ của một tiến trình thật qua /proc/<pid>/{status,maps,fd,limits}; nối sang ps/top của linux-bash.',
      content: `${G11}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>A program is a file; a process is that file running</h2>
<p class="lead">A <strong>program</strong> is dead: bytes of machine code and data sitting in a file on disk (<code>/usr/local/bin/node</code>). A <strong>process</strong> is that program brought to life — given its own view of memory, a set of open files, an identity, and a number. Everything you do to a running thing in this course — scheduling it, killing it, limiting it, debugging it — is an operation on a process.</p>

<h3>What the kernel keeps for every process</h3>
<p>For each process the kernel holds a record — the <em>process control block</em>, called <code>task_struct</code> in Linux. It contains, among much else:</p>
<ul>
<li>a <strong>PID</strong> (its number) and a <strong>PPID</strong> (its parent's number);</li>
<li>an <strong>address space</strong>: its private view of memory — code, data, heap, stack, mapped libraries (Chapter 7);</li>
<li>the <strong>registers</strong> (including the program counter and stack pointer) saved whenever it is not running, so it can be resumed exactly where it stopped;</li>
<li>a <strong>file descriptor table</strong>: the open files, sockets and pipes, by small integers (Chapter 10);</li>
<li>its <strong>identity</strong> — the user and group it runs as (permissions, Chapter 9);</li>
<li>its <strong>state</strong>, current working directory, resource limits, and accounting (how much CPU it has used).</li>
</ul>
<p>You can read almost all of it, because Linux exposes each process as a folder under <code>/proc/&lt;pid&gt;</code>. Let's open a real one.</p>

<h3>Reading a live process through /proc</h3>
<p>We start a tiny Node web server and inspect it. First, its one-line summary from <code>ps</code>:</p>
${run('c11-proc', 'ps -o pid,ppid,stat,nlwp')}
<p><code>STAT</code> is <code>Sl</code> — S means sleeping (waiting for a connection), l means it has multiple threads; <code>NLWP 7</code> confirms seven threads (Node's libuv pool — Chapter 3). <code>RSS 49324</code> is the physical RAM it holds, in KB. Now the kernel's own summary of it:</p>
${run('c11-proc', "grep -E '^(Name")}
<p>Every field of the <code>task_struct</code> that matters is here: its state, parent, user id, thread count, virtual size vs resident size, and how many times it has been context-switched (Chapter 3). Its command line and where it runs:</p>
${run('c11-proc', "tr ", 2)}
<p>Its open files — this is the file descriptor table, live:</p>
${run('c11-proc', 'ls -l /proc/', 1)}
<p>fd 0/1/2 are stdin/stdout/stderr; the <code>eventpoll</code> and <code>eventfd</code> entries are how Node waits for I/O (Chapter 10); fd 18 is the listening socket. Its memory map and its limits:</p>
${run('c11-proc', "grep -E 'heap", 1)}
${run('c11-proc', "grep -E 'Max open")}
<p>That <code>node</code> region is the executable's code, loaded read-and-execute; <code>[heap]</code> and <code>[stack]</code> are exactly the regions from lesson 0.2. "Max open files 1048576" is the ceiling on that fd table (Chapter 10's "Too many open files"). Explore the layout interactively:</p>
${lab('memory', 'layout', 'en', 'The regions /proc/<pid>/maps shows — code, data, heap, mmap, stack — and how ASLR shuffles them each run.')}

<div class="pitfall co-tieu-de">
<p><strong>VSZ is almost always a lie; RSS is the number you want.</strong> <code>VmSize</code> (VSZ) counts everything the process has <em>mapped</em> — every shared library, memory reserved but never touched. Our Node server shows ~486 MB VSZ but only ~49 MB RSS. People panic at VSZ and page the on-call for nothing. The physical RAM in use is <code>VmRSS</code>. (And even RSS double-counts shared libraries across processes — Chapter 7 has the honest number, PSS.)</p>
</div>

<h3>If you have done Linux &amp; Bash Chapter 5</h3>
<p>There you learned <code>ps</code>, <code>top</code> and signals as <em>commands</em> — how to look and how to kill. Here we are one level down: those commands are just pretty-printers for exactly these <code>/proc</code> files, and this chapter explains what the kernel is actually doing underneath them. When you understand <code>task_struct</code>, the STAT letters and the fd table stop being trivia and start being a diagnosis.</p>
${L('/courses/linux-bash/learn' + REF.replace('operating-systems-for-developers', 'linux-bash'), '🐧', 'Linux & Bash · Chapter 5', 'ps/top/kill at the command level — the view from above this chapter.', 'Open')}

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a teammate says "the API process is using 480 MB, we have a leak!" You want to check before believing it.</p>
<ol>
<li>In the lab start a long-lived process: <code>node -e "setInterval(()=>{},1e9)" &amp;</code> (or <code>sleep 1000 &amp;</code>). Get its PID with <code>pgrep</code> or <code>jobs -p</code>.</li>
<li>Read <code>cat /proc/&lt;pid&gt;/status | grep -E 'VmRSS|VmSize|Threads|State'</code>. Which number is the real memory use?</li>
<li>List its open files: <code>ls -l /proc/&lt;pid&gt;/fd</code>. How many, and what are fd 0/1/2?</li>
<li>Find its parent: <code>cat /proc/&lt;pid&gt;/status | grep PPid</code>, then look at that PID's command line.</li>
<li>Compare <code>ps -o pid,vsz,rss,stat -p &lt;pid&gt;</code> with the <code>/proc</code> values — same numbers, different clothes.</li>
</ol>
<p><strong>Done when:</strong> you can state the process's real RSS (not VSZ), its thread count, its three standard fds, and its parent — all from <code>/proc</code>.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['program vs process (chương trình vs tiến trình)', 'Program = the file on disk. Process = that program running, with its own memory and state.'],
  ['PID / PPID', 'The process’s number and its parent’s number. PID 1 is the root of the tree.'],
  ['task_struct / PCB', 'The kernel’s record of a process: registers, address space, open files, identity, state.'],
  ['address space (không gian địa chỉ)', 'A process’s private view of memory: code, data, heap, stack, mapped libraries.'],
  ['/proc/&lt;pid&gt;', 'A live folder exposing a process’s status, maps, fd table and limits as readable files.'],
  ['RSS vs VSZ', 'RSS = physical RAM actually used. VSZ = everything mapped, usually much bigger and misleading.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>A process is a running program plus everything the kernel keeps for it: a PID, an address space, saved registers, open files, an identity and a state.</li>
<li>Linux exposes all of that under <code>/proc/&lt;pid&gt;</code>; <code>ps</code> and <code>top</code> are just views of it.</li>
<li><code>VmRSS</code> is the real memory use; <code>VmSize</code> (VSZ) counts everything mapped and usually overstates it wildly.</li>
<li>The file descriptor table, thread count and context-switch counts here feed straight into Chapters 3 and 10.</li>
</ul>
${L('https://man7.org/linux/man-pages/man5/proc.5.html', '📄', 'man 5 proc', 'Every file under /proc/<pid> and what it means.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Chương trình là một file; tiến trình là file đó đang chạy</h2>
<p class="lead">Một <strong>chương trình</strong> thì "chết": các byte mã máy và dữ liệu nằm yên trong một file trên đĩa (<code>/usr/local/bin/node</code>). Một <strong>tiến trình</strong> là chương trình đó được "làm cho sống" — được cấp một góc nhìn riêng về bộ nhớ, một tập file đang mở, một danh tính, và một con số. Mọi việc bạn làm với một thứ đang chạy trong khoá này — lập lịch, giết, giới hạn, gỡ lỗi — đều là thao tác trên một tiến trình.</p>

<h3>Nhân giữ gì cho mỗi tiến trình</h3>
<p>Với mỗi tiến trình, nhân giữ một bản ghi — <em>khối điều khiển tiến trình</em> (process control block), ở Linux gọi là <code>task_struct</code>. Trong đó, ngoài nhiều thứ khác, có:</p>
<ul>
<li>một <strong>PID</strong> (con số của nó) và một <strong>PPID</strong> (con số của cha nó);</li>
<li>một <strong>không gian địa chỉ (address space)</strong>: góc nhìn bộ nhớ riêng của nó — code, data, heap, stack, thư viện được ánh xạ (Chương 7);</li>
<li>các <strong>thanh ghi (registers)</strong> (gồm bộ đếm chương trình và con trỏ stack) được lưu mỗi khi nó không chạy, để chạy tiếp đúng chỗ đã dừng;</li>
<li>một <strong>bảng file descriptor</strong>: file, socket và pipe đang mở, đánh bằng số nguyên nhỏ (Chương 10);</li>
<li><strong>danh tính</strong> của nó — người dùng và nhóm nó chạy dưới (quyền, Chương 9);</li>
<li><strong>trạng thái</strong>, thư mục làm việc hiện tại, giới hạn tài nguyên, và sổ sách (đã dùng bao nhiêu CPU).</li>
</ul>
<p>Bạn đọc được gần như tất cả, vì Linux phơi mỗi tiến trình thành một thư mục dưới <code>/proc/&lt;pid&gt;</code>. Hãy mở một cái thật ra xem.</p>

<h3>Đọc một tiến trình sống qua /proc</h3>
<p>Ta khởi động một máy chủ web Node tí hon rồi soi nó. Trước hết, dòng tóm tắt từ <code>ps</code>:</p>
${run('c11-proc', 'ps -o pid,ppid,stat,nlwp')}
<p><code>STAT</code> là <code>Sl</code> — S là đang ngủ (chờ một kết nối), l là có nhiều luồng; <code>NLWP 7</code> xác nhận bảy luồng (pool libuv của Node — Chương 3). <code>RSS 49324</code> là RAM vật lý nó đang giữ, tính theo KB. Giờ tới bản tóm tắt của chính nhân về nó:</p>
${run('c11-proc', "grep -E '^(Name")}
<p>Mọi trường quan trọng của <code>task_struct</code> đều ở đây: trạng thái, cha, uid, số luồng, kích thước ảo so với thường trú, và nó đã bị chuyển ngữ cảnh bao nhiêu lần (Chương 3). Dòng lệnh của nó và nơi nó chạy:</p>
${run('c11-proc', "tr ", 2)}
<p>File đang mở của nó — đây chính là bảng file descriptor, sống:</p>
${run('c11-proc', 'ls -l /proc/', 1)}
<p>fd 0/1/2 là stdin/stdout/stderr; các mục <code>eventpoll</code> và <code>eventfd</code> là cách Node chờ I/O (Chương 10); fd 18 là socket đang lắng nghe. Bản đồ bộ nhớ và giới hạn của nó:</p>
${run('c11-proc', "grep -E 'heap", 1)}
${run('c11-proc', "grep -E 'Max open")}
<p>Vùng <code>node</code> đó là mã của tệp thực thi, nạp ở chế độ đọc-và-thực-thi; <code>[heap]</code> và <code>[stack]</code> đúng là các vùng ở bài 0.2. "Max open files 1048576" là trần của bảng fd đó (lỗi "Too many open files" ở Chương 10). Khám phá bố cục một cách tương tác:</p>
${lab('memory', 'layout', 'vi', 'Các vùng mà /proc/<pid>/maps hiện ra — code, data, heap, mmap, stack — và ASLR xáo chúng mỗi lần chạy ra sao.')}

<div class="pitfall co-tieu-de">
<p><strong>VSZ gần như luôn là lời nói dối; RSS mới là con số bạn cần.</strong> <code>VmSize</code> (VSZ) đếm mọi thứ tiến trình đã <em>ánh xạ</em> — mọi thư viện dùng chung, bộ nhớ đã đặt chỗ nhưng chưa bao giờ chạm. Máy chủ Node của ta hiện ~486 MB VSZ nhưng chỉ ~49 MB RSS. Người ta hoảng vì VSZ rồi gọi trực ban giữa đêm vì không có gì. RAM vật lý đang dùng là <code>VmRSS</code>. (Và ngay cả RSS cũng đếm trùng thư viện dùng chung giữa các tiến trình — Chương 7 có con số trung thực, PSS.)</p>
</div>

<h3>Nếu bạn đã học Linux &amp; Bash Chương 5</h3>
<p>Ở đó bạn học <code>ps</code>, <code>top</code> và tín hiệu như những <em>lệnh</em> — cách nhìn và cách giết. Ở đây ta thấp hơn một tầng: những lệnh đó chỉ là trình in đẹp cho đúng các file <code>/proc</code> này, và chương này giải thích nhân thật sự làm gì bên dưới chúng. Khi hiểu <code>task_struct</code>, các chữ cái STAT và bảng fd thôi là chuyện vặt và trở thành một chẩn đoán.</p>
${L('/courses/linux-bash/learn' + REF.replace('operating-systems-for-developers', 'linux-bash'), '🐧', 'Linux & Bash · Chương 5', 'ps/top/kill ở mức lệnh — góc nhìn phía trên chương này.', 'Mở')}

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một bạn trong nhóm nói "tiến trình API đang dùng 480 MB, chắc rò rỉ rồi!" Bạn muốn kiểm trước khi tin.</p>
<ol>
<li>Trong lab khởi động một tiến trình sống lâu: <code>node -e "setInterval(()=>{},1e9)" &amp;</code> (hoặc <code>sleep 1000 &amp;</code>). Lấy PID bằng <code>pgrep</code> hoặc <code>jobs -p</code>.</li>
<li>Đọc <code>cat /proc/&lt;pid&gt;/status | grep -E 'VmRSS|VmSize|Threads|State'</code>. Con số nào là bộ nhớ thật sự đang dùng?</li>
<li>Liệt kê file đang mở: <code>ls -l /proc/&lt;pid&gt;/fd</code>. Bao nhiêu, và fd 0/1/2 là gì?</li>
<li>Tìm cha nó: <code>cat /proc/&lt;pid&gt;/status | grep PPid</code>, rồi xem dòng lệnh của PID đó.</li>
<li>So <code>ps -o pid,vsz,rss,stat -p &lt;pid&gt;</code> với các giá trị <code>/proc</code> — cùng con số, khác bộ áo.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn nói được RSS thật của tiến trình (không phải VSZ), số luồng, ba fd chuẩn, và cha của nó — tất cả từ <code>/proc</code>.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['program vs process (chương trình vs tiến trình)', 'Chương trình = file trên đĩa. Tiến trình = chương trình đó đang chạy, có bộ nhớ và trạng thái riêng.'],
  ['PID / PPID', 'Con số của tiến trình và con số của cha nó. PID 1 là gốc của cây.'],
  ['task_struct / PCB', 'Bản ghi của nhân về một tiến trình: thanh ghi, không gian địa chỉ, file đang mở, danh tính, trạng thái.'],
  ['address space (không gian địa chỉ)', 'Góc nhìn bộ nhớ riêng của một tiến trình: code, data, heap, stack, thư viện ánh xạ.'],
  ['/proc/&lt;pid&gt;', 'Thư mục sống phơi trạng thái, maps, bảng fd và giới hạn của một tiến trình thành các file đọc được.'],
  ['RSS vs VSZ', 'RSS = RAM vật lý thật sự dùng. VSZ = mọi thứ đã ánh xạ, thường lớn hơn nhiều và gây hiểu nhầm.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Tiến trình là một chương trình đang chạy cộng tất cả những gì nhân giữ cho nó: một PID, một không gian địa chỉ, thanh ghi đã lưu, file đang mở, một danh tính và một trạng thái.</li>
<li>Linux phơi tất cả dưới <code>/proc/&lt;pid&gt;</code>; <code>ps</code> và <code>top</code> chỉ là góc nhìn của nó.</li>
<li><code>VmRSS</code> là bộ nhớ thật đang dùng; <code>VmSize</code> (VSZ) đếm mọi thứ ánh xạ và thường thổi phồng dữ dội.</li>
<li>Bảng file descriptor, số luồng và số lần chuyển ngữ cảnh ở đây đi thẳng vào Chương 3 và 10.</li>
</ul>
${L('https://man7.org/linux/man-pages/man5/proc.5.html', '📄', 'man 5 proc', 'Mọi file dưới /proc/<pid> và ý nghĩa của chúng.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 1.2 — fork/exec/wait ───────────────────────── */
    {
      title: '1.2 — fork, exec, wait: how every process is born|||1.2 — fork, exec, wait: mọi tiến trình ra đời thế nào',
      slug: 'os-1-2-fork-exec',
      type: 'LESSON',
      isFreePreview: true,
      description: 'fork() trả về hai lần, copy-on-write, exec thay chương trình giữ nguyên PID, wait thu con; viết một shell tí hon bằng C; câu thi fork();fork();fork(); bẫy bộ đệm stdio; và cách Node/Java/Python tạo tiến trình con.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>Every process is forked from another</h2>
<p class="lead">There is no "create a process" call that conjures one from nothing. Instead a process clones itself with <strong>fork()</strong>, and the clone usually replaces its own program with <strong>exec()</strong>. The parent collects the result with <strong>wait()</strong>. That triad — fork, exec, wait — is how your shell runs every command, how a server spawns a worker, and how Docker starts your container. Watch it once and the whole system makes sense.</p>
${lab('process', 'shell', 'en', 'A shell running one command: fork clones it, the child execs into ls, the parent waits, then reaps the zombie. Step through it.')}

<h3>fork() returns twice</h3>
<p>This is the idea that trips everyone up at first:</p>
${src('ch01/fork1.c', 'c')}
${run('c12-fork', 'gcc -Wall -O2 fork1.c')}
<p>One call to <code>fork()</code>, two return values. In the <strong>child</strong>, <code>fork()</code> returns 0; in the <strong>parent</strong>, it returns the child's PID (16). Both continue from the same next line, each with its <em>own copy</em> of every variable — the child did <code>x += 1</code> and sees 101, the parent still sees 100. They do not share memory (that is threads — lesson 1.1's NLWP, and Chapter 3).</p>
<p>Copying all of the parent's memory would be slow, so the kernel cheats with <strong>copy-on-write</strong>: parent and child share the same physical pages, marked read-only, until one of them writes — only then is that one page copied. A <code>fork()</code> of a 2 GB process is nearly instant and uses almost no extra memory until the child starts changing things (this is exactly how Redis saves a snapshot — Chapter 7).</p>

<h3>exec() replaces the program, keeps the PID</h3>
<p>fork gives you a second copy of the <em>same</em> program. To run a <em>different</em> one, the child calls exec:</p>
${src('ch01/exec.c', 'c')}
${run('c12-fork', 'gcc -O2 exec.c')}
<p>The process printed as <code>exec.c</code>, then <em>became</em> <code>ps</code> — same PID (76), brand-new program. <code>execlp</code> throws away the old code, data and heap and loads the new executable in place. On success it never returns, which is why the <code>perror</code> line only runs if exec <em>fails</em>. "fork then exec" is the universal pattern: clone yourself, then become the thing you wanted to run.</p>

<h3>Build a shell in sixty lines</h3>
<p>Put fork + exec + wait together and you have a shell. This one reads a line, splits it, forks, execs the command, and waits — plus <code>cd</code> and <code>exit</code> as built-ins:</p>
${src('ch01/ctsh.c', 'c')}
${run('c12-fork', "printf 'echo hello", 1)}
<p>Read the exit codes in the prompt: <code>echo</code> gave 0, <code>ls /nope</code> gave 2, an unknown command gave 127, and when a child was killed by a signal the shell reported <code>[killed by signal 11]</code> and 139. Notice <code>cd</code> had to be a <em>built-in</em>: if the shell forked a child to run <code>cd /tmp</code>, the child would change <em>its</em> directory and exit, leaving the shell exactly where it was. You will finish and harden this shell in the Chapter 17 capstone.</p>
<p>Under the hood it is exactly clone → execve → wait4. Here is the same shell traced running one command:</p>
${whole('c12-strace')}

<h3>The exam classic, and a real trap</h3>
<p>The question everyone gets in an OS exam:</p>
${src('ch01/fork3.c', 'c')}
${run('c12-fork', './fork3 | wc -l')}
<p>Eight. Each <code>fork()</code> doubles the number of processes, so three in a row give 2³ = 8. Step through the tree to see why:</p>
${lab('process', 'fork3', 'en', 'fork(); fork(); fork(); — one process becomes eight. Watch each fork double the tree.')}
<p>And a trap that bites real programs — stdio buffering survives fork:</p>
${src('ch01/buffer.c', 'c')}
${run('c12-fork', 'gcc -O2 buffer.c -o buffer', 1)}
${run('c12-fork', './buffer | cat')}
<p>To a terminal, <code>printf</code> flushes on the newline, so you see one <code>hello</code>. But into a <em>pipe</em>, stdout is block-buffered, so <code>hello</code> is still sitting in the buffer when <code>fork()</code> copies it — and both parent and child flush it, so <code>hello</code> prints <em>twice</em>. The fix: <code>fflush(stdout)</code> before forking, or write to fd 1 directly. Node, Python and Java hit this too when they fork with unflushed buffers.</p>

<h3>The same idea in Node, Python and Java</h3>
<p>You rarely call fork directly in those languages, but it is always underneath:</p>
${run('c12-fork', 'node spawn.js')}
${run('c12-fork', 'java Spawn.java')}
<p>Node's <code>child_process.spawn</code>, Python's <code>subprocess</code>, and Java's <code>ProcessBuilder</code> all do fork (or the faster <code>posix_spawn</code>) + exec + wait for you, returning a handle with the child's PID. The child prints its own <code>$$</code> and <code>$PPID</code> — a real process with your program as its parent.</p>
<div class="callout warn"><p><strong>Why <code>posix_spawn</code> exists.</strong> <code>fork()</code> on a huge process must set up copy-on-write for its entire address space; for a 4 GB JVM that is measurable overhead just to immediately throw it all away with exec. <code>posix_spawn</code> (and Linux's <code>vfork</code>/<code>clone</code>) create the child without that duplication. Measured in the lab, spawning <code>/bin/true</code> 2000 times:</p>${run('c12-fork', 'gcc -O2 spawncost.c -o spawncost', 1)}<p>posix_spawn beat fork+exec, and creating a thread was cheaper still — the cost ladder behind Chapter 3's "why servers use thread pools, not a process per request".</p></div>

<h3>🧪 Practice (20 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> you are implementing a feature that shells out to a command, and you want to understand exactly what happens.</p>
<ol>
<li>Compile and run <code>fork1.c</code>. Add a <code>printf("x is now %d (pid %d)\\n", x, getpid())</code> after the <code>if</code>/<code>else</code> so <em>both</em> run it. Predict the two lines, then check.</li>
<li>Run <code>./fork3 | sort</code> and <code>./fork3 | wc -l</code>. Now add a fourth <code>fork()</code> — how many lines? Verify.</li>
<li>Build <code>ctsh.c</code> and run commands in it: <code>ls</code>, <code>false; echo</code> (watch the exit code in the prompt), <code>cd ..</code> then <code>pwd</code>. Why does <code>cd</code> have to be built in?</li>
<li>Run <code>buffer.c</code> to a terminal and then piped to <code>cat</code>. Explain the doubled line, then fix it with <code>fflush</code>.</li>
</ol>
<p><strong>Done when:</strong> you can explain fork's two return values, why 3 forks make 8 processes, why <code>cd</code> is a built-in, and the stdio-buffer-after-fork trap.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['fork()', 'Clone the calling process. Returns the child’s PID to the parent and 0 to the child; both continue from the next line.'],
  ['copy-on-write (COW)', 'Parent and child share physical pages read-only until one writes, so fork is cheap.'],
  ['exec() (execvp/execve)', 'Replace the current process’s program with a new one, keeping the PID. Never returns on success.'],
  ['wait() / waitpid()', 'A parent blocks until a child exits and collects its exit status, reaping the zombie.'],
  ['posix_spawn', 'fork+exec in one call without duplicating the address space — cheaper for large processes.'],
  ['built-in (lệnh dựng sẵn)', 'A command the shell runs itself (cd, exit) instead of forking, because it must affect the shell.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Processes are born by <code>fork()</code> (clone, two returns) usually followed by <code>exec()</code> (become a new program, same PID); the parent <code>wait()</code>s.</li>
<li>fork is cheap thanks to copy-on-write; <code>posix_spawn</code> is cheaper still for big processes, and a thread is cheaper again.</li>
<li>A shell is just fork + exec + wait in a loop; <code>cd</code> must be a built-in because a forked child cannot change the shell’s directory.</li>
<li>Three forks make eight processes; and stdio buffers survive fork, so flush before forking or output doubles into a pipe.</li>
<li>Node/Python/Java spawn children with this exact machinery underneath.</li>
</ul>
${L('https://man7.org/linux/man-pages/man2/fork.2.html', '📄', 'man 2 fork', 'The authoritative description of fork and copy-on-write.', 'Open')}
${L('https://man7.org/linux/man-pages/man2/execve.2.html', '📄', 'man 2 execve', 'How exec replaces the process image.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Mọi tiến trình đều được fork ra từ một tiến trình khác</h2>
<p class="lead">Không có lời gọi "tạo một tiến trình" nào biến nó ra từ hư không. Thay vào đó, một tiến trình tự nhân bản bằng <strong>fork()</strong>, và bản sao thường thay chương trình của chính nó bằng <strong>exec()</strong>. Cha thu kết quả bằng <strong>wait()</strong>. Bộ ba đó — fork, exec, wait — là cách shell chạy mọi lệnh, cách một máy chủ sinh worker, và cách Docker khởi động container của bạn. Nhìn nó một lần là cả hệ thống sáng ra.</p>
${lab('process', 'shell', 'vi', 'Một shell chạy một lệnh: fork nhân bản nó, con exec thành ls, cha chờ, rồi dọn zombie. Đi từng bước.')}

<h3>fork() trả về hai lần</h3>
<p>Đây là ý mà ai mới học cũng vấp:</p>
${src('ch01/fork1.c', 'c')}
${run('c12-fork', 'gcc -Wall -O2 fork1.c')}
<p>Một lời gọi <code>fork()</code>, hai giá trị trả về. Ở <strong>con</strong>, <code>fork()</code> trả về 0; ở <strong>cha</strong>, nó trả về PID của con (16). Cả hai chạy tiếp từ cùng một dòng sau, mỗi bên với <em>bản sao riêng</em> của mọi biến — con làm <code>x += 1</code> và thấy 101, cha vẫn thấy 100. Chúng không chung bộ nhớ (đó là luồng — NLWP ở bài 1.1, và Chương 3).</p>
<p>Chép hết bộ nhớ của cha thì chậm, nên nhân "gian lận" bằng <strong>copy-on-write</strong>: cha và con dùng chung các trang vật lý, đánh dấu chỉ đọc, cho tới khi một bên ghi — chỉ lúc đó đúng trang ấy mới được chép. <code>fork()</code> một tiến trình 2 GB gần như tức thì và gần như không tốn bộ nhớ thêm cho tới khi con bắt đầu đổi thứ gì (đây đúng là cách Redis lưu một ảnh chụp — Chương 7).</p>

<h3>exec() thay chương trình, giữ nguyên PID</h3>
<p>fork cho bạn một bản sao thứ hai của <em>cùng</em> chương trình. Để chạy một chương trình <em>khác</em>, con gọi exec:</p>
${src('ch01/exec.c', 'c')}
${run('c12-fork', 'gcc -O2 exec.c')}
<p>Tiến trình in ra là <code>exec.c</code>, rồi <em>trở thành</em> <code>ps</code> — cùng PID (76), chương trình mới toanh. <code>execlp</code> vứt bỏ mã, data và heap cũ và nạp tệp thực thi mới vào chỗ đó. Thành công thì nó không bao giờ quay lại, vì thế dòng <code>perror</code> chỉ chạy khi exec <em>thất bại</em>. "fork rồi exec" là khuôn mẫu phổ quát: tự nhân bản, rồi trở thành thứ bạn muốn chạy.</p>

<h3>Dựng một shell trong sáu mươi dòng</h3>
<p>Ghép fork + exec + wait lại là bạn có một shell. Cái này đọc một dòng, tách nó, fork, exec lệnh, và chờ — thêm <code>cd</code> và <code>exit</code> làm lệnh dựng sẵn:</p>
${src('ch01/ctsh.c', 'c')}
${run('c12-fork', "printf 'echo hello", 1)}
<p>Đọc các mã thoát ngay trên dấu nhắc: <code>echo</code> cho 0, <code>ls /nope</code> cho 2, lệnh lạ cho 127, và khi một con bị tín hiệu giết thì shell báo <code>[killed by signal 11]</code> và 139. Để ý <code>cd</code> buộc phải là một <em>lệnh dựng sẵn</em>: nếu shell fork một con để chạy <code>cd /tmp</code>, con sẽ đổi thư mục của <em>chính nó</em> rồi thoát, để shell y nguyên chỗ cũ. Bạn sẽ hoàn thiện và gia cố shell này trong dự án cuối Chương 17.</p>
<p>Bên dưới nó đúng là clone → execve → wait4. Đây là chính shell đó khi chạy một lệnh, soi bằng strace:</p>
${whole('c12-strace')}

<h3>Câu thi kinh điển, và một cái bẫy thật</h3>
<p>Câu ai cũng gặp trong đề thi hệ điều hành:</p>
${src('ch01/fork3.c', 'c')}
${run('c12-fork', './fork3 | wc -l')}
<p>Tám. Mỗi <code>fork()</code> nhân đôi số tiến trình, nên ba lần liên tiếp cho 2³ = 8. Đi từng bước trên cây để thấy vì sao:</p>
${lab('process', 'fork3', 'vi', 'fork(); fork(); fork(); — một tiến trình thành tám. Nhìn mỗi fork nhân đôi cây.')}
<p>Và một cái bẫy cắn chương trình thật — bộ đệm stdio sống sót qua fork:</p>
${src('ch01/buffer.c', 'c')}
${run('c12-fork', 'gcc -O2 buffer.c -o buffer', 1)}
${run('c12-fork', './buffer | cat')}
<p>Ra terminal, <code>printf</code> xả ở dấu xuống dòng, nên bạn thấy một <code>hello</code>. Nhưng vào một <em>pipe</em>, stdout được đệm theo khối, nên <code>hello</code> vẫn còn nằm trong bộ đệm lúc <code>fork()</code> chép nó — và cả cha lẫn con đều xả, nên <code>hello</code> in ra <em>hai lần</em>. Cách sửa: <code>fflush(stdout)</code> trước khi fork, hoặc ghi thẳng vào fd 1. Node, Python và Java cũng dính chuyện này khi fork với bộ đệm chưa xả.</p>

<h3>Cùng ý tưởng đó trong Node, Python và Java</h3>
<p>Bạn hiếm khi gọi fork trực tiếp trong các ngôn ngữ đó, nhưng nó luôn nằm bên dưới:</p>
${run('c12-fork', 'node spawn.js')}
${run('c12-fork', 'java Spawn.java')}
<p><code>child_process.spawn</code> của Node, <code>subprocess</code> của Python, và <code>ProcessBuilder</code> của Java đều làm fork (hoặc <code>posix_spawn</code> nhanh hơn) + exec + wait hộ bạn, trả về một tay cầm kèm PID của con. Con in ra <code>$$</code> và <code>$PPID</code> của chính nó — một tiến trình thật với chương trình của bạn làm cha.</p>
<div class="callout warn"><p><strong>Vì sao có <code>posix_spawn</code>.</strong> <code>fork()</code> một tiến trình to phải dựng copy-on-write cho cả không gian địa chỉ của nó; với một JVM 4 GB đó là chi phí đo được chỉ để ngay sau đó vứt hết bằng exec. <code>posix_spawn</code> (và <code>vfork</code>/<code>clone</code> của Linux) tạo con mà không nhân bản đó. Đo trong lab, tạo <code>/bin/true</code> 2000 lần:</p>${run('c12-fork', 'gcc -O2 spawncost.c -o spawncost', 1)}<p>posix_spawn thắng fork+exec, và tạo một luồng còn rẻ hơn nữa — thang chi phí nằm sau câu "vì sao máy chủ dùng thread pool chứ không một tiến trình mỗi yêu cầu" của Chương 3.</p></div>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> bạn đang làm một tính năng gọi ra một lệnh ngoài, và muốn hiểu chính xác chuyện gì xảy ra.</p>
<ol>
<li>Biên dịch và chạy <code>fork1.c</code>. Thêm một <code>printf("x is now %d (pid %d)\\n", x, getpid())</code> sau <code>if</code>/<code>else</code> để <em>cả hai</em> chạy nó. Đoán hai dòng, rồi kiểm.</li>
<li>Chạy <code>./fork3 | sort</code> và <code>./fork3 | wc -l</code>. Giờ thêm <code>fork()</code> thứ tư — bao nhiêu dòng? Kiểm lại.</li>
<li>Dựng <code>ctsh.c</code> và chạy lệnh trong nó: <code>ls</code>, <code>false; echo</code> (nhìn mã thoát trên dấu nhắc), <code>cd ..</code> rồi <code>pwd</code>. Vì sao <code>cd</code> phải dựng sẵn?</li>
<li>Chạy <code>buffer.c</code> ra terminal rồi ống dẫn vào <code>cat</code>. Giải thích dòng bị nhân đôi, rồi sửa bằng <code>fflush</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn giải thích được hai giá trị trả về của fork, vì sao 3 fork thành 8 tiến trình, vì sao <code>cd</code> là lệnh dựng sẵn, và cái bẫy bộ đệm stdio sau fork.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['fork()', 'Nhân bản tiến trình đang gọi. Trả PID của con cho cha và 0 cho con; cả hai chạy tiếp từ dòng sau.'],
  ['copy-on-write (COW)', 'Cha và con dùng chung trang vật lý chỉ-đọc cho tới khi một bên ghi, nên fork rẻ.'],
  ['exec() (execvp/execve)', 'Thay chương trình của tiến trình hiện tại bằng một chương trình mới, giữ nguyên PID. Thành công thì không quay lại.'],
  ['wait() / waitpid()', 'Cha chặn lại cho tới khi một con thoát và thu mã thoát của nó, dọn zombie.'],
  ['posix_spawn', 'fork+exec trong một lời gọi, không nhân bản không gian địa chỉ — rẻ hơn cho tiến trình lớn.'],
  ['built-in (lệnh dựng sẵn)', 'Lệnh mà shell tự chạy (cd, exit) thay vì fork, vì nó phải tác động lên chính shell.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Tiến trình ra đời bằng <code>fork()</code> (nhân bản, trả hai lần) thường kèm <code>exec()</code> (trở thành chương trình mới, cùng PID); cha gọi <code>wait()</code>.</li>
<li>fork rẻ nhờ copy-on-write; <code>posix_spawn</code> còn rẻ hơn cho tiến trình to, và một luồng lại rẻ hơn nữa.</li>
<li>Shell chỉ là fork + exec + wait trong một vòng lặp; <code>cd</code> phải dựng sẵn vì một con đã fork không đổi được thư mục của shell.</li>
<li>Ba fork thành tám tiến trình; và bộ đệm stdio sống sót qua fork, nên hãy xả trước khi fork kẻo output nhân đôi khi vào pipe.</li>
<li>Node/Python/Java sinh con bằng đúng bộ máy này ở bên dưới.</li>
</ul>
${L('https://man7.org/linux/man-pages/man2/fork.2.html', '📄', 'man 2 fork', 'Mô tả chuẩn mực về fork và copy-on-write.', 'Mở')}
${L('https://man7.org/linux/man-pages/man2/execve.2.html', '📄', 'man 2 execve', 'exec thay ảnh tiến trình ra sao.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 1.3 — Chế độ ───────────────────────── */
    {
      title: '1.3 — User mode, kernel mode and the system-call boundary|||1.3 — Chế độ người dùng, chế độ nhân và ranh giới lời gọi hệ thống',
      slug: 'os-1-3-che-do',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Hai chế độ của CPU và vì sao; lệnh đặc quyền bị chặn; một syscall tốn bao nhiêu (đo thật so với lời gọi hàm thường); vDSO; và strace -c đếm syscall của một chương trình.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>Your code runs in a padded room</h2>
<p class="lead">The CPU has (at least) two privilege levels. Your code runs in <strong>user mode</strong>, where dangerous instructions — talk to a device, disable interrupts, touch another process's memory — are simply forbidden. The kernel runs in <strong>kernel mode</strong>, where everything is allowed. The only way across is a <strong>system call</strong>: a controlled doorway where you hand the kernel a request and it does the privileged work for you. This one boundary is what makes the OS safe, and crossing it has a measurable cost you should know.</p>

<h3>What happens if user code tries to act like the kernel</h3>
<p>We wrote a program that tries two privileged things: disable CPU interrupts, and read a kernel address. Both are refused:</p>
${src('ch01/priv.c', 'c')}
${run('c13-priv', 'gcc -O0 priv.c')}
${run('c13-priv', './priv kernel')}
<p>The interrupt-disable instruction is privileged, so the CPU raised an "illegal instruction" trap and the kernel killed the process (SIGILL, exit 132). Reading a kernel address gave SIGSEGV (exit 139): the page tables mark kernel memory as off-limits in user mode. This is not politeness — it is the hardware refusing, and the kernel turning the refusal into a signal. It is also why one buggy program cannot take down the machine, and the foundation the security chapter builds on.</p>

<h3>A system call is the door — and it is not free</h3>
<p>When you <em>do</em> need the kernel, you ask through a syscall (<code>read</code>, <code>write</code>, <code>open</code>, <code>getpid</code>…). Crossing into kernel mode and back costs far more than a normal function call. Measured in the lab:</p>
${run('c13-mode', 'gcc -O2 syscost.c')}
<p>A plain function call is a couple of nanoseconds; a real system call (<code>getppid</code>, which does almost nothing in the kernel) is ~190 ns — about a hundred times more, almost all of it the mode switch. A pipe round trip (<code>write</code> then <code>read</code>, two syscalls plus scheduling) is ~450 ns. The lesson for your code: <strong>syscalls are expensive, so batch them</strong>. Reading a file one byte at a time is a million <code>read</code> calls; reading it in 64 KB chunks is sixteen — that is what buffered I/O (<code>BufferedReader</code>, stdio) is <em>for</em>.</p>

<div class="callout warn">
<p><strong>vDSO: the syscall so common the kernel skips the door.</strong> Look at the <code>clock_gettime</code> number: ~20 ns, ten times faster than a real syscall. Getting the time is so frequent that the kernel maps a tiny read-only page — the <strong>vDSO</strong> — into every process, and <code>clock_gettime</code> reads the clock from there <em>without</em> entering the kernel at all. You can see it in the process's memory map:</p>
${run('c13-mode', 'grep -m1 vdso /proc/self/maps')}
</div>

<h3>Counting a program's syscalls with strace</h3>
<p><code>strace -c</code> runs a program and tallies every system call it makes. It turns "what is this program actually asking the OS to do?" into a table. Here, <code>ls -l /etc</code>:</p>
${run('c13-mode', 'strace -c -o sc.txt ls -l /etc')}
<p>651 syscalls to list a directory — mostly <code>statx</code> (one per file, for the <code>-l</code> details), <code>openat</code>, <code>read</code> and <code>close</code>. Now compare how much three runtimes ask of the kernel just to print "1" and exit:</p>
${run('c13-mode', 'strace -c -f -o sc.txt node', 1)}
${run('c13-mode', 'strace -c -f -o sc.txt python3', 1)}
${run('c13-mode', 'strace -c -f -o sc.txt java', 1)}
<p>Python: ~344 syscalls. Node: ~671. A JVM starting up: ~1258. That gap is why a Python or shell script starts instantly while a JVM has a noticeable warm-up — most of those extra syscalls are <code>mmap</code> and <code>openat</code> loading the runtime and its libraries. <code>strace</code> is the single best tool for "why is this slow to start / why is it hitting the disk / what file can it not find" — Chapter 15 goes deep, but you already have the core move.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a script that "does almost nothing" is mysteriously slow, and you suspect it is hammering the OS.</p>
<ol>
<li>Run <code>strace -c ls /etc &gt; /dev/null</code> and read the table. Which syscall is called the most, and why?</li>
<li>Compare <code>strace -c -f python3 -c "print(1)"</code> with <code>strace -c -f node -e "console.log(1)"</code>. Which asks the kernel for more, and roughly how many <code>mmap</code> / <code>openat</code> does each make?</li>
<li>Write a program (any language) that reads a 10 MB file one byte at a time, then one that reads it in 64 KB chunks. Time both; run each under <code>strace -c</code> and compare the <code>read</code> count.</li>
<li>Run <code>strace -e trace=openat someprogram</code> to see every file it opens — a great way to find a missing config file.</li>
</ol>
<p><strong>Done when:</strong> you can show that chunked reads make ~1000× fewer <code>read</code> syscalls and run faster, and you can read a <code>strace -c</code> summary.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['user mode / kernel mode (chế độ người dùng / nhân)', 'Two CPU privilege levels. User mode forbids dangerous instructions; kernel mode allows everything.'],
  ['privileged instruction (lệnh đặc quyền)', 'An instruction only kernel mode may run (disable interrupts, load page tables). Running it in user mode traps.'],
  ['system call (lời gọi hệ thống)', 'The controlled transition into the kernel to request a privileged operation. ~100× a function call.'],
  ['mode switch (chuyển chế độ)', 'The CPU state change user↔kernel; the main cost of a syscall (distinct from a context switch, Ch.3).'],
  ['vDSO', 'A kernel page mapped into every process so hot calls like clock_gettime run without entering the kernel.'],
  ['strace -c', 'Run a program and tally its system calls — the fastest way to see what it asks the OS to do.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Your code runs in user mode, where privileged instructions and kernel memory are forbidden; the CPU traps violations and the kernel turns them into signals (SIGILL, SIGSEGV).</li>
<li>A system call is the one controlled door into the kernel, and it costs ~100× a function call — so batch syscalls (buffered I/O) instead of making millions of tiny ones.</li>
<li>The vDSO lets ultra-frequent calls like <code>clock_gettime</code> skip the kernel entirely.</li>
<li><code>strace -c</code> tallies a program's syscalls; it is your first tool for slow starts, missing files and mystery disk I/O.</li>
</ul>
${L('https://man7.org/linux/man-pages/man2/syscall.2.html', '📄', 'man 2 syscall', 'How the syscall instruction works and the calling convention.', 'Open')}
${L('https://man7.org/linux/man-pages/man7/vdso.7.html', '📄', 'man 7 vdso', 'The virtual shared object and which calls it accelerates.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>Code của bạn chạy trong một căn phòng bọc đệm</h2>
<p class="lead">CPU có (ít nhất) hai mức đặc quyền. Code của bạn chạy ở <strong>chế độ người dùng (user mode)</strong>, nơi các lệnh nguy hiểm — nói chuyện với thiết bị, tắt ngắt, chạm bộ nhớ tiến trình khác — đơn giản là bị cấm. Nhân chạy ở <strong>chế độ nhân (kernel mode)</strong>, nơi mọi thứ được phép. Đường duy nhất băng qua là một <strong>lời gọi hệ thống</strong>: một cánh cửa có kiểm soát, nơi bạn trao cho nhân một yêu cầu và nó làm phần việc đặc quyền hộ bạn. Chính ranh giới này khiến hệ điều hành an toàn, và băng qua nó có một cái giá đo được mà bạn nên biết.</p>

<h3>Chuyện gì xảy ra nếu code người dùng làm như nhân</h3>
<p>Ta viết một chương trình thử hai việc đặc quyền: tắt ngắt CPU, và đọc một địa chỉ của nhân. Cả hai bị từ chối:</p>
${src('ch01/priv.c', 'c')}
${run('c13-priv', 'gcc -O0 priv.c')}
${run('c13-priv', './priv kernel')}
<p>Lệnh tắt ngắt là lệnh đặc quyền, nên CPU dựng một bẫy "lệnh bất hợp lệ" và nhân giết tiến trình (SIGILL, mã thoát 132). Đọc một địa chỉ nhân cho SIGSEGV (mã thoát 139): bảng trang đánh dấu bộ nhớ nhân là cấm truy cập ở chế độ người dùng. Đây không phải sự lịch sự — đó là phần cứng từ chối, và nhân biến sự từ chối thành một tín hiệu. Đó cũng là lý do một chương trình lỗi không hạ gục được cả máy, và là nền mà chương bảo mật xây lên.</p>

<h3>Lời gọi hệ thống là cánh cửa — và nó không miễn phí</h3>
<p>Khi bạn <em>thật sự</em> cần nhân, bạn nhờ qua một syscall (<code>read</code>, <code>write</code>, <code>open</code>, <code>getpid</code>…). Băng vào chế độ nhân rồi trở ra tốn hơn nhiều một lời gọi hàm thường. Đo trong lab:</p>
${run('c13-mode', 'gcc -O2 syscost.c')}
<p>Một lời gọi hàm thường là vài nano giây; một lời gọi hệ thống thật (<code>getppid</code>, làm gần như không gì trong nhân) là ~190 ns — khoảng một trăm lần, gần như toàn bộ là chuyển chế độ. Một vòng pipe (<code>write</code> rồi <code>read</code>, hai syscall cộng lập lịch) là ~450 ns. Bài học cho code của bạn: <strong>syscall đắt, nên gộp lại</strong>. Đọc một file từng byte một là một triệu lời gọi <code>read</code>; đọc theo khối 64 KB là mười sáu — đó chính là lý do có I/O có đệm (<code>BufferedReader</code>, stdio).</p>

<div class="callout warn">
<p><strong>vDSO: syscall phổ biến đến mức nhân bỏ luôn cánh cửa.</strong> Nhìn con số <code>clock_gettime</code>: ~20 ns, nhanh gấp mười một syscall thật. Lấy giờ phổ biến tới mức nhân ánh xạ một trang chỉ-đọc tí hon — <strong>vDSO</strong> — vào mọi tiến trình, và <code>clock_gettime</code> đọc đồng hồ từ đó mà <em>không</em> vào nhân chút nào. Bạn thấy nó trong bản đồ bộ nhớ của tiến trình:</p>
${run('c13-mode', 'grep -m1 vdso /proc/self/maps')}
</div>

<h3>Đếm syscall của một chương trình bằng strace</h3>
<p><code>strace -c</code> chạy một chương trình và cộng dồn mọi lời gọi hệ thống nó thực hiện. Nó biến câu "chương trình này thật ra đang nhờ hệ điều hành làm gì?" thành một bảng. Đây, <code>ls -l /etc</code>:</p>
${run('c13-mode', 'strace -c -o sc.txt ls -l /etc')}
<p>651 syscall để liệt kê một thư mục — phần lớn là <code>statx</code> (mỗi file một lần, cho chi tiết <code>-l</code>), <code>openat</code>, <code>read</code> và <code>close</code>. Giờ so xem ba trình chạy nhờ nhân bao nhiêu chỉ để in "1" rồi thoát:</p>
${run('c13-mode', 'strace -c -f -o sc.txt node', 1)}
${run('c13-mode', 'strace -c -f -o sc.txt python3', 1)}
${run('c13-mode', 'strace -c -f -o sc.txt java', 1)}
<p>Python: ~344 syscall. Node: ~671. Một JVM khởi động: ~1258. Khoảng cách đó là lý do một script Python hay shell khởi động tức thì còn JVM thì có độ hâm nóng thấy rõ — phần lớn số syscall thêm đó là <code>mmap</code> và <code>openat</code> nạp trình chạy và thư viện của nó. <code>strace</code> là công cụ số một cho "sao khởi động chậm / sao nó đang đụng đĩa / nó không tìm thấy file nào" — Chương 15 đi sâu, nhưng bạn đã có nước đi cốt lõi.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một script "gần như không làm gì" lại chậm bí ẩn, và bạn nghi nó đang dần hệ điều hành.</p>
<ol>
<li>Chạy <code>strace -c ls /etc &gt; /dev/null</code> và đọc bảng. Syscall nào bị gọi nhiều nhất, vì sao?</li>
<li>So <code>strace -c -f python3 -c "print(1)"</code> với <code>strace -c -f node -e "console.log(1)"</code>. Cái nào nhờ nhân nhiều hơn, và mỗi cái làm cỡ bao nhiêu <code>mmap</code> / <code>openat</code>?</li>
<li>Viết một chương trình (ngôn ngữ nào cũng được) đọc một file 10 MB từng byte một, rồi một cái đọc theo khối 64 KB. Đo giờ cả hai; chạy mỗi cái dưới <code>strace -c</code> và so số <code>read</code>.</li>
<li>Chạy <code>strace -e trace=openat chương-trình</code> để xem mọi file nó mở — cách tuyệt vời để tìm một file cấu hình bị thiếu.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn cho thấy đọc theo khối làm ~1000× ít lời gọi <code>read</code> hơn và chạy nhanh hơn, và bạn đọc được bản tóm tắt <code>strace -c</code>.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['user mode / kernel mode (chế độ người dùng / nhân)', 'Hai mức đặc quyền của CPU. User mode cấm lệnh nguy hiểm; kernel mode cho phép mọi thứ.'],
  ['privileged instruction (lệnh đặc quyền)', 'Lệnh chỉ kernel mode được chạy (tắt ngắt, nạp bảng trang). Chạy nó ở user mode sẽ dựng bẫy.'],
  ['system call (lời gọi hệ thống)', 'Chuyển có kiểm soát vào nhân để xin một thao tác đặc quyền. ~100× một lời gọi hàm.'],
  ['mode switch (chuyển chế độ)', 'Thay đổi trạng thái CPU user↔kernel; cái giá chính của một syscall (khác chuyển ngữ cảnh, Ch.3).'],
  ['vDSO', 'Một trang nhân ánh xạ vào mọi tiến trình để các lời gọi nóng như clock_gettime chạy mà không vào nhân.'],
  ['strace -c', 'Chạy một chương trình và cộng dồn syscall của nó — cách nhanh nhất để thấy nó nhờ hệ điều hành làm gì.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Code của bạn chạy ở chế độ người dùng, nơi lệnh đặc quyền và bộ nhớ nhân bị cấm; CPU dựng bẫy khi vi phạm và nhân biến chúng thành tín hiệu (SIGILL, SIGSEGV).</li>
<li>Lời gọi hệ thống là cánh cửa có kiểm soát duy nhất vào nhân, và tốn ~100× một lời gọi hàm — nên hãy gộp syscall (I/O có đệm) thay vì làm hàng triệu lời gọi tí hon.</li>
<li>vDSO cho các lời gọi siêu phổ biến như <code>clock_gettime</code> bỏ qua nhân hoàn toàn.</li>
<li><code>strace -c</code> cộng dồn syscall của một chương trình; nó là công cụ đầu tiên cho khởi động chậm, file thiếu và I/O đĩa bí ẩn.</li>
</ul>
${L('https://man7.org/linux/man-pages/man2/syscall.2.html', '📄', 'man 2 syscall', 'Lệnh syscall hoạt động ra sao và quy ước gọi.', 'Mở')}
${L('https://man7.org/linux/man-pages/man7/vdso.7.html', '📄', 'man 7 vdso', 'Đối tượng dùng chung ảo và những lời gọi nó tăng tốc.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 1.4 — Trạng thái, tín hiệu, mã thoát ───────────────────────── */
    {
      title: '1.4 — Process states, signals and exit codes (why exit 137 = OOM)|||1.4 — Trạng thái tiến trình, tín hiệu và mã thoát (vì sao exit 137 = OOM)',
      slug: 'os-1-4-vong-doi',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Năm trạng thái R/S/D/T/Z nhìn từ nhân; tín hiệu được giao thế nào, cái nào bắt được và SIGKILL thì không; quy ước mã thoát 128+N và vì sao exit 137 = SIGKILL (thường là OOM), 139 = SIGSEGV, 134 = SIGABRT; zombie và mồ côi; tắt êm bằng SIGTERM.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.4</span>
<h2>The life and death of a process</h2>
<p class="lead">A process is not always running — it spends most of its life waiting, and it can be paused, interrupted and killed. The letters you see in <code>ps</code> (R, S, D, T, Z) are its state; <strong>signals</strong> are how it gets interrupted; and its <strong>exit code</strong> tells you how it died. Read these three right and "the container exited with 137" stops being a mystery and becomes a diagnosis.</p>
${lab('process', 'shell', 'en', 'The state machine on the right shows which state each process is in and the transitions as they happen. Try the zombie and orphan scenarios too.')}

<h3>The five states</h3>
<p>From the kernel's point of view a process is always in exactly one state:</p>
${kv([
  ['R — running or runnable', 'On a CPU right now, or ready and waiting its turn. (ps shows both as R.)'],
  ['S — interruptible sleep', 'Waiting for something — a timer, input, a lock — and can be woken by a signal. Most processes, most of the time.'],
  ['D — uninterruptible sleep', 'Waiting on I/O (usually disk/NFS) in a way that cannot be interrupted, not even by SIGKILL. Many D processes = an I/O problem (Chapter 9).'],
  ['T — stopped', 'Suspended by SIGSTOP / Ctrl-Z, frozen until SIGCONT. Not dead, just paused.'],
  ['Z — zombie (defunct)', 'Finished, but its exit code has not been collected by its parent yet. Uses no CPU or RAM, but holds a PID.'],
])}
<p>You can drive a process through them by hand. Stop and continue one:</p>
${run('c14-sig', 'sleep 100 & sleep 0.2; kill -STOP')}
<p>It went to <code>T</code> on SIGSTOP and back to <code>R/S</code> on SIGCONT — the machinery behind pausing a job with Ctrl-Z.</p>

<h3>Signals: the kernel tapping a process on the shoulder</h3>
<p>A <strong>signal</strong> is a small numbered message delivered to a process asynchronously. Some you can <em>catch</em> and handle; two you cannot. This program catches SIGTERM to shut down cleanly:</p>
${src('ch01/sig.c', 'c')}
${run('c14-sig', './sig & sleep 0.5; kill -TERM')}
<p>It received SIGTERM, ran its handler, flushed and exited cleanly with 0. That is how a well-behaved server handles <code>docker stop</code> or a deploy: stop accepting new work, finish what is in flight, then exit — no dropped requests. But two signals bypass the process entirely, handled by the kernel itself:</p>
<ul>
<li><strong>SIGKILL (9)</strong> — kill immediately. Cannot be caught, blocked or ignored. No cleanup, no final log line. This is what the OOM killer and <code>kill -9</code> use.</li>
<li><strong>SIGSTOP (19)</strong> — stop immediately. Also uncatchable.</li>
</ul>

<h3>Exit codes, and why 137 means OOM</h3>
<p>When a process ends, its parent gets a status. The shell turns that into a number you can read with <code>echo $?</code>. The rule: a process that <em>exited</em> gives its own code (0–255); a process that was <em>killed by a signal N</em> gives <strong>128 + N</strong>. Watch all three outcomes:</p>
${run('c14-sig', "sleep 100 & kill -INT")}
${run('c14-sig', "sleep 100 & kill -TERM")}
${run('c14-sig', "sleep 100 & kill -KILL")}
<p>SIGINT (2) → 130, SIGTERM (15) → 143, SIGKILL (9) → 137. So the codes you will meet constantly decode instantly:</p>
${kv([
  ['137 = 128 + 9 (SIGKILL)', 'Something sent an uncatchable kill. On a container, almost always the OOM killer ran out of memory (Chapter 8), or docker stop timed out and escalated to SIGKILL.'],
  ['143 = 128 + 15 (SIGTERM)', 'A polite shutdown request the process did not catch — or caught and exited. docker stop sends this first.'],
  ['139 = 128 + 11 (SIGSEGV)', 'A segmentation fault — touched memory it may not (lesson 0.2). A crash, not a kill.'],
  ['134 = 128 + 6 (SIGABRT)', 'abort() — e.g. a stack-smash detected, a failed C++ assert, or Node’s fatal error.'],
  ['130 = 128 + 2 (SIGINT)', 'You pressed Ctrl-C.'],
])}
<div class="pitfall co-tieu-de">
<p><strong>Exit 137 almost never means "my code had a bug".</strong> It means <em>something outside</em> sent SIGKILL. On a container the usual culprit is the kernel's OOM killer: your process grew past its memory limit and was killed with no chance to log anything — so your application logs just stop, with no error. We will reproduce this exactly in the next lesson and all of Chapter 8. When you see 137, do not grep your code first; check <code>dmesg</code> / <code>journalctl -k</code> for "Out of memory" and the container's memory limit.</p>
</div>

<h3>Zombies and orphans</h3>
<p>When a child exits, it does not vanish — it becomes a <strong>zombie</strong> until its parent calls <code>wait()</code> to collect the exit code. If the parent never waits, the zombies pile up:</p>
${run('c14-sig', './zombie & sleep 0.5; ps')}
<p>Three <code>Z</code> / <code>&lt;defunct&gt;</code> entries. They use no CPU or memory, but each holds a PID, and PIDs are finite — a server that leaks zombies eventually cannot <code>fork()</code> at all. <code>kill -9</code> on a zombie does nothing; it is already dead. The fix is in the parent: call <code>wait()</code>, or ignore SIGCHLD so the kernel reaps automatically. The opposite case — the parent dies first — makes the child an <strong>orphan</strong>, which the kernel re-parents to PID 1:</p>
${run('c14-sig', 'gcc -O2 orphan.c -o orphan')}
<p>The child's parent became 1 the moment its real parent exited. That is why PID 1 matters so much — the subject of lesson 1.5.</p>

<h3>🧪 Practice (20 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a container keeps dying and the logs just stop with no error. You need to tell OOM from a crash from a clean stop.</p>
<ol>
<li>In the lab run <code>sleep 100 &amp;</code> and kill it three ways in turn (<code>-INT</code>, <code>-TERM</code>, <code>-KILL</code>), checking <code>wait $!; echo $?</code> each time. Match each code to its signal with the 128+N rule.</li>
<li>Compile <code>sig.c</code>. Send it SIGTERM (it cleans up and exits 0) and then SIGKILL (no cleanup). Prove SIGKILL cannot be caught.</li>
<li>Run <code>zombie.c</code> in the background; find the <code>Z</code> processes with <code>ps -o pid,ppid,stat,cmd --ppid &lt;pid&gt;</code>. Try <code>kill -9</code> on one — does it go away? Now kill the parent — where do they go?</li>
<li>Make a program segfault (dereference NULL) and one that <code>abort()</code>s; check their exit codes are 139 and 134.</li>
</ol>
<p><strong>Done when:</strong> given an exit code (137/143/139/134/130) you can name the signal and the likely cause, and you can explain why <code>kill -9</code> on a zombie is pointless.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['process state R/S/D/T/Z', 'Running/runnable, interruptible sleep, uninterruptible (I/O) sleep, stopped, zombie.'],
  ['signal (tín hiệu)', 'A numbered async message to a process. Catchable ones (SIGTERM, SIGINT) can run a handler; SIGKILL/SIGSTOP cannot.'],
  ['SIGTERM vs SIGKILL', 'TERM (15) asks politely and can be handled for cleanup; KILL (9) is immediate and uncatchable.'],
  ['exit code / 128+N', 'A normal exit gives 0–255; a kill by signal N gives 128+N. So 137 = 128+9 = SIGKILL.'],
  ['zombie / <defunct>', 'A finished child whose exit code the parent has not collected. Holds a PID; kill -9 does nothing.'],
  ['orphan (mồ côi)', 'A process whose parent died; the kernel re-parents it to PID 1 (or a subreaper).'],
  ['graceful shutdown (tắt êm)', 'Catching SIGTERM to stop new work, finish in-flight work, and exit without dropping requests.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>A process is always in one state: R (run/ready), S (sleep), D (uninterruptible I/O), T (stopped), Z (zombie).</li>
<li>Signals interrupt a process; SIGTERM can be caught for a clean shutdown, SIGKILL and SIGSTOP cannot be caught at all.</li>
<li>Exit code = own code (0–255), or 128+N when killed by signal N — so 137=SIGKILL (usually OOM), 143=SIGTERM, 139=SIGSEGV, 134=SIGABRT.</li>
<li>A finished child is a zombie until the parent <code>wait()</code>s; a child whose parent died is an orphan adopted by PID 1.</li>
</ul>
${L('https://man7.org/linux/man-pages/man7/signal.7.html', '📄', 'man 7 signal', 'Every signal, its default action, and which cannot be caught.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.4</span>
<h2>Sinh và tử của một tiến trình</h2>
<p class="lead">Một tiến trình không phải lúc nào cũng chạy — nó dành phần lớn cuộc đời để chờ, và có thể bị tạm dừng, bị ngắt và bị giết. Các chữ cái bạn thấy trong <code>ps</code> (R, S, D, T, Z) là trạng thái của nó; <strong>tín hiệu (signal)</strong> là cách nó bị ngắt; và <strong>mã thoát (exit code)</strong> cho biết nó chết thế nào. Đọc đúng ba thứ này thì "container thoát với 137" thôi là bí ẩn và thành một chẩn đoán.</p>
${lab('process', 'shell', 'vi', 'Máy trạng thái bên phải cho thấy mỗi tiến trình đang ở trạng thái nào và các chuyển trạng thái khi chúng xảy ra. Thử cả kịch bản zombie và mồ côi.')}

<h3>Năm trạng thái</h3>
<p>Dưới con mắt nhân, một tiến trình luôn ở đúng một trạng thái:</p>
${kv([
  ['R — đang chạy hoặc sẵn sàng', 'Đang trên một CPU, hoặc sẵn sàng chờ tới lượt. (ps hiện cả hai là R.)'],
  ['S — ngủ ngắt được', 'Đang chờ thứ gì đó — một bộ hẹn giờ, dữ liệu vào, một khoá — và có thể bị đánh thức bằng tín hiệu. Phần lớn tiến trình, phần lớn thời gian.'],
  ['D — ngủ không ngắt được', 'Đang chờ I/O (thường là đĩa/NFS) theo kiểu không ngắt được, kể cả SIGKILL. Nhiều tiến trình D = một vấn đề I/O (Chương 9).'],
  ['T — tạm dừng', 'Bị treo bởi SIGSTOP / Ctrl-Z, đóng băng tới khi có SIGCONT. Không chết, chỉ dừng.'],
  ['Z — zombie (defunct)', 'Đã xong, nhưng mã thoát chưa được cha thu. Không tốn CPU hay RAM, nhưng giữ một PID.'],
])}
<p>Bạn lùa một tiến trình qua chúng bằng tay được. Dừng rồi cho chạy tiếp một cái:</p>
${run('c14-sig', 'sleep 100 & sleep 0.2; kill -STOP')}
<p>Nó sang <code>T</code> khi gặp SIGSTOP và quay lại <code>R/S</code> khi có SIGCONT — bộ máy đằng sau việc tạm dừng một job bằng Ctrl-Z.</p>

<h3>Tín hiệu: nhân vỗ vai một tiến trình</h3>
<p>Một <strong>tín hiệu</strong> là một thông điệp nhỏ có đánh số, giao cho một tiến trình một cách bất đồng bộ. Một số bạn <em>bắt</em> và xử lý được; hai cái thì không. Chương trình này bắt SIGTERM để tắt êm:</p>
${src('ch01/sig.c', 'c')}
${run('c14-sig', './sig & sleep 0.5; kill -TERM')}
<p>Nó nhận SIGTERM, chạy handler, xả và thoát sạch với 0. Đó là cách một máy chủ ngoan xử lý <code>docker stop</code> hay một lần deploy: ngừng nhận việc mới, làm nốt việc đang dở, rồi thoát — không rớt yêu cầu nào. Nhưng hai tín hiệu bỏ qua tiến trình hoàn toàn, do chính nhân xử lý:</p>
<ul>
<li><strong>SIGKILL (9)</strong> — giết ngay. Không bắt, chặn hay lờ được. Không dọn dẹp, không dòng log cuối. Đây là thứ OOM killer và <code>kill -9</code> dùng.</li>
<li><strong>SIGSTOP (19)</strong> — dừng ngay. Cũng không bắt được.</li>
</ul>

<h3>Mã thoát, và vì sao 137 nghĩa là OOM</h3>
<p>Khi một tiến trình kết thúc, cha nó nhận một status. Shell biến nó thành một con số bạn đọc được bằng <code>echo $?</code>. Quy tắc: một tiến trình <em>tự thoát</em> cho mã của chính nó (0–255); một tiến trình <em>bị tín hiệu N giết</em> cho <strong>128 + N</strong>. Nhìn cả ba kết cục:</p>
${run('c14-sig', "sleep 100 & kill -INT")}
${run('c14-sig', "sleep 100 & kill -TERM")}
${run('c14-sig', "sleep 100 & kill -KILL")}
<p>SIGINT (2) → 130, SIGTERM (15) → 143, SIGKILL (9) → 137. Nên các mã bạn gặp liên tục giải mã được tức thì:</p>
${kv([
  ['137 = 128 + 9 (SIGKILL)', 'Thứ gì đó gửi một cú giết không bắt được. Trên container, gần như luôn là OOM killer hết bộ nhớ (Chương 8), hoặc docker stop hết giờ và leo lên SIGKILL.'],
  ['143 = 128 + 15 (SIGTERM)', 'Một yêu cầu tắt lịch sự mà tiến trình không bắt — hoặc bắt rồi thoát. docker stop gửi cái này trước.'],
  ['139 = 128 + 11 (SIGSEGV)', 'Một segmentation fault — chạm bộ nhớ không được phép (bài 0.2). Một cú sập, không phải bị giết.'],
  ['134 = 128 + 6 (SIGABRT)', 'abort() — vd. phát hiện đập stack, một assert C++ hỏng, hoặc lỗi chí tử của Node.'],
  ['130 = 128 + 2 (SIGINT)', 'Bạn bấm Ctrl-C.'],
])}
<div class="pitfall co-tieu-de">
<p><strong>Exit 137 gần như không bao giờ nghĩa là "code của tôi có lỗi".</strong> Nó nghĩa là <em>thứ gì đó bên ngoài</em> gửi SIGKILL. Trên container thủ phạm thường là OOM killer của nhân: tiến trình của bạn phình quá giới hạn bộ nhớ và bị giết mà không kịp log gì — nên log ứng dụng của bạn đột ngột dừng, không có lỗi. Ta sẽ tái hiện đúng chuyện này ở bài kế và cả Chương 8. Hễ thấy 137, đừng grep code trước; hãy xem <code>dmesg</code> / <code>journalctl -k</code> tìm "Out of memory" và giới hạn bộ nhớ của container.</p>
</div>

<h3>Zombie và mồ côi</h3>
<p>Khi một con thoát, nó không biến mất — nó thành <strong>zombie</strong> cho tới khi cha gọi <code>wait()</code> thu mã thoát. Nếu cha không bao giờ chờ, zombie chất đống:</p>
${run('c14-sig', './zombie & sleep 0.5; ps')}
<p>Ba mục <code>Z</code> / <code>&lt;defunct&gt;</code>. Chúng không tốn CPU hay bộ nhớ, nhưng mỗi cái giữ một PID, mà PID thì hữu hạn — một máy chủ rò zombie đến lúc không <code>fork()</code> nổi nữa. <code>kill -9</code> một zombie chẳng làm gì; nó đã chết rồi. Cách sửa nằm ở cha: gọi <code>wait()</code>, hoặc lờ SIGCHLD để nhân tự dọn. Trường hợp ngược — cha chết trước — biến con thành <strong>mồ côi (orphan)</strong>, và nhân chuyển nó cho PID 1 nuôi:</p>
${run('c14-sig', 'gcc -O2 orphan.c -o orphan')}
<p>Cha của con thành 1 ngay khi cha thật của nó thoát. Đó là lý do PID 1 quan trọng đến thế — chủ đề bài 1.5.</p>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một container cứ chết và log đột ngột dừng không lỗi. Bạn cần phân biệt OOM với sập với tắt sạch.</p>
<ol>
<li>Trong lab chạy <code>sleep 100 &amp;</code> và giết nó ba cách lần lượt (<code>-INT</code>, <code>-TERM</code>, <code>-KILL</code>), kiểm <code>wait $!; echo $?</code> mỗi lần. Khớp mỗi mã với tín hiệu của nó bằng quy tắc 128+N.</li>
<li>Biên dịch <code>sig.c</code>. Gửi SIGTERM (nó dọn và thoát 0) rồi SIGKILL (không dọn). Chứng minh SIGKILL không bắt được.</li>
<li>Chạy <code>zombie.c</code> ở nền; tìm các tiến trình <code>Z</code> bằng <code>ps -o pid,ppid,stat,cmd --ppid &lt;pid&gt;</code>. Thử <code>kill -9</code> một cái — nó biến mất không? Giờ giết cha — chúng đi đâu?</li>
<li>Làm một chương trình segfault (truy cập NULL) và một cái <code>abort()</code>; kiểm mã thoát là 139 và 134.</li>
</ol>
<p><strong>Đạt khi:</strong> cho một mã thoát (137/143/139/134/130) bạn gọi được tên tín hiệu và nguyên nhân có thể, và giải thích được vì sao <code>kill -9</code> một zombie là vô ích.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['trạng thái R/S/D/T/Z', 'Chạy/sẵn sàng, ngủ ngắt được, ngủ không ngắt được (I/O), tạm dừng, zombie.'],
  ['signal (tín hiệu)', 'Thông điệp bất đồng bộ có số gửi tới một tiến trình. Cái bắt được (SIGTERM, SIGINT) chạy được handler; SIGKILL/SIGSTOP thì không.'],
  ['SIGTERM vs SIGKILL', 'TERM (15) hỏi lịch sự và xử lý được để dọn dẹp; KILL (9) tức thì và không bắt được.'],
  ['exit code / 128+N', 'Thoát thường cho 0–255; bị tín hiệu N giết cho 128+N. Nên 137 = 128+9 = SIGKILL.'],
  ['zombie / <defunct>', 'Một con đã xong mà cha chưa thu mã thoát. Giữ một PID; kill -9 chẳng làm gì.'],
  ['orphan (mồ côi)', 'Một tiến trình có cha đã chết; nhân chuyển nó cho PID 1 (hoặc một subreaper).'],
  ['graceful shutdown (tắt êm)', 'Bắt SIGTERM để ngừng việc mới, làm nốt việc đang dở, và thoát mà không rớt yêu cầu.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một tiến trình luôn ở một trạng thái: R (chạy/sẵn sàng), S (ngủ), D (I/O không ngắt được), T (tạm dừng), Z (zombie).</li>
<li>Tín hiệu ngắt một tiến trình; SIGTERM bắt được để tắt sạch, SIGKILL và SIGSTOP hoàn toàn không bắt được.</li>
<li>Mã thoát = mã riêng (0–255), hoặc 128+N khi bị tín hiệu N giết — nên 137=SIGKILL (thường OOM), 143=SIGTERM, 139=SIGSEGV, 134=SIGABRT.</li>
<li>Một con đã xong là zombie tới khi cha <code>wait()</code>; một con có cha đã chết là mồ côi do PID 1 nhận nuôi.</li>
</ul>
${L('https://man7.org/linux/man-pages/man7/signal.7.html', '📄', 'man 7 signal', 'Mọi tín hiệu, hành động mặc định, và cái nào không bắt được.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 1.5 — PID 1 ───────────────────────── */
    {
      title: '1.5 — PID 1, init systems and processes in containers|||1.5 — PID 1, hệ thống init và tiến trình trong container',
      slug: 'os-1-5-pid1',
      type: 'LESSON',
      isFreePreview: true,
      description: 'PID 1 là gì và vì sao nó đặc biệt; vì sao app của bạn làm PID 1 trong container không nhận SIGTERM và không dọn zombie; docker stop chờ 10 giây rồi SIGKILL (exit 137); sửa bằng tini/--init và bắt SIGTERM; tái hiện OOM exit 137.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.5</span>
<h2>The process with no parent</h2>
<p class="lead">Every process has a parent except one: PID 1, the first process the kernel starts at boot. It is the root of the whole tree, it adopts every orphan, and it has one special rule that bites almost everyone who containerises an app. Getting PID 1 right is the difference between a container that stops in 0.1 seconds and one that takes 10 and exits 137 for no reason.</p>

<h3>What PID 1 does</h3>
<p>On a normal Linux machine PID 1 is an <strong>init system</strong> — <code>systemd</code> on Ubuntu/Fedora/Debian. It starts and supervises all the services, and it is the final parent of every orphaned process, whose job is to <code>wait()</code> on them so they do not stay zombies forever. It is a program written to do exactly that.</p>
<p>In a container, PID 1 is whatever your <code>CMD</code> is — often <em>your app</em>. And your app was not written to be an init system. That causes two real problems.</p>

<h3>Problem 1: PID 1 ignores signals it has no handler for</h3>
<p>The kernel gives PID 1 special treatment: signals with a default action (like SIGTERM's "terminate") are <em>not</em> applied to PID 1 unless it has installed a handler for them. This protects the real init from being killed by a stray signal — but it means a container app that does not explicitly catch SIGTERM will simply ignore it. Watch what <code>docker stop</code> does to a Node server with <em>no</em> SIGTERM handler:</p>
${run('c15-pid1', 'docker run -d --name os-p1a', 1)}
${run('c15-pid1', 'docker exec os-p1a ps', 1)}
${run('c15-pid1', 'docker stop os-p1a', 1)}
${run('c15-pid1', "docker inspect -f '{{.State.ExitCode}}' os-p1a", 1)}
<p><code>docker stop</code> sends SIGTERM and waits <strong>10 seconds</strong> for a clean exit. PID 1 ignored it, so after 10 seconds Docker escalated to SIGKILL — <strong>exit 137</strong>. Every <code>docker stop</code> and every deploy of this container takes 10 seconds and kills the app hard. Now the <em>same</em> server that <em>does</em> catch SIGTERM (the <code>sig.c</code> pattern from 1.4):</p>
${run('c15-pid1', 'docker stop os-p1b', 1)}
${run('c15-pid1', 'docker logs os-p1b')}
<p>0.1 seconds, exit 0, "bye" in the logs. The only difference is a four-line SIGTERM handler. <strong>Catch SIGTERM in every service you containerise</strong> — in Node, Python and Spring Boot it is a few lines, and it is what makes deploys zero-downtime.</p>

<h3>Problem 2: PID 1 must reap orphans</h3>
<p>Remember orphans get re-parented to PID 1. On a real system, <code>systemd</code> reaps them. But if your app is PID 1 and it spawns children (a shell, a sidecar, anything that forks), the orphans land on <em>it</em> — and if it does not call <code>wait()</code>, they pile up as zombies that nobody can clear. Reproduced:</p>
${run('c15-pid1', "docker exec os-p1e sh -c 'sleep 1 & exit'", 1)}
${run('c15-pid1', 'docker exec os-p1e ps', 1)}
<p>A <code>&lt;defunct&gt;</code> zombie under PID 1 that will never be reaped. Over days, a container that shells out a lot can exhaust its PID limit.</p>

<h3>The fix: a tiny real init, or --init</h3>
<p>The clean fix is to put a minimal init as PID 1 whose only jobs are to forward signals and reap zombies. Docker has one built in — add <code>--init</code> (it runs <code>tini</code>):</p>
${run('c15-pid1', 'docker run -d --init --name os-p1c', 1)}
${run('c15-pid1', 'docker exec os-p1c ps', 1)}
<p>Now PID 1 is <code>docker-init</code> and your app is PID 7, a normal child. Signals get forwarded (so <code>docker stop</code> is fast and clean — exit 143), and orphans get reaped. In production you either add <code>--init</code> / <code>tini</code> <em>and</em> catch SIGTERM in the app, or use an entrypoint that <code>exec</code>s your app so it becomes PID 1 directly and handles signals itself.</p>
<div class="pitfall co-tieu-de"><p><strong>The sneaky version: a shell as PID 1.</strong> If your Dockerfile does <code>CMD node server.js</code> in <em>shell form</em> (or <code>sh -c "node server.js"</code>), PID 1 is <code>/bin/sh</code>, your app is its child, and the shell does not forward SIGTERM — so again <code>docker stop</code> waits 10 seconds and SIGKILLs. Use exec form (<code>CMD ["node", "server.js"]</code>) or <code>exec node server.js</code> in your entrypoint so your app becomes PID 1.</p></div>

<h3>Reproducing exit 137 the other way: OOM</h3>
<p>The other common 137 is the OOM killer. Give a container 256 MB and a program that keeps allocating:</p>
${run('c14-oom', 'docker run --name os-oom --memory 256m', 1)}
${run('c14-oom', "docker inspect -f '{{.State.OOMKilled}} {{.State.ExitCode}}' os-oom")}
${run('c14-oom', 'dmesg | grep', 1)}
<p>At 256 MB the kernel's cgroup OOM killer sent SIGKILL — exit 137, and <code>OOMKilled: true</code> in <code>docker inspect</code>. The kernel log says exactly which process and how much it was using. So the two faces of 137 — <code>docker stop</code> escalation and OOM — both decode the same way (SIGKILL) but have opposite fixes: catch SIGTERM / add <code>--init</code> for the first, raise the limit or cut memory use for the second. The <code>docker inspect</code> <code>OOMKilled</code> flag and <code>dmesg</code> tell them apart. Chapter 8 is all about the second.</p>

<h3>🧪 Practice (20 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> your team's container takes 10 seconds to stop and sometimes exits 137 on deploy. Diagnose and fix it.</p>
<ol>
<li>Run a container whose CMD is a server with no SIGTERM handler (<code>server-nohandler.js</code> from the course). Time <code>docker stop</code> and read the exit code.</li>
<li>Add a SIGTERM handler (or run with <code>--init</code>). Time <code>docker stop</code> again and compare the exit code (143 or 0 vs 137).</li>
<li>Confirm PID 1 with <code>docker exec &lt;c&gt; ps -o pid,ppid,cmd</code> in both cases — who is PID 1?</li>
<li>Separately, reproduce OOM: <code>docker run --rm --memory 100m os-lab python3 -c "a=[];</code>&hairsp;<code>while 1:a.append(bytearray(10**7))"</code>; check the exit code and <code>docker inspect --format '{{.State.OOMKilled}}'</code>.</li>
</ol>
<p><strong>Done when:</strong> you turned a 10-second / exit-137 stop into a fast / exit-0 stop, and you can tell a <code>docker stop</code> 137 from an OOM 137 using <code>OOMKilled</code> and <code>dmesg</code>.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['PID 1 / init', 'The first process at boot, root of the tree. Starts services and reaps all orphans. systemd on most distros.'],
  ['PID 1 signal rule', 'The kernel does not apply a signal’s default action to PID 1 unless PID 1 installed a handler — so an app as PID 1 ignores SIGTERM.'],
  ['tini / docker --init', 'A tiny init run as PID 1 that forwards signals and reaps zombies for your app.'],
  ['exec form vs shell form', 'CMD ["node","x"] makes your app PID 1; CMD node x runs a shell as PID 1 that swallows signals.'],
  ['docker stop grace period', 'docker stop sends SIGTERM, waits 10 s, then SIGKILL (→ exit 137) if the process has not exited.'],
  ['OOMKilled', 'docker inspect flag: true when the kernel’s OOM killer SIGKILLed the container (the other cause of exit 137).'],
])}

<h3>📌 Summary</h3>
<ul>
<li>PID 1 is the first process and the parent of all orphans; on a real machine it is an init like systemd.</li>
<li>In a container your app is often PID 1, and the kernel's PID 1 signal rule means it ignores SIGTERM unless it installs a handler — so <code>docker stop</code> waits 10 s and SIGKILLs it (exit 137).</li>
<li>Fix it by catching SIGTERM in the app and/or running a tiny init (<code>--init</code>/tini) as PID 1, and by using exec form so a shell is not PID 1.</li>
<li>The other exit 137 is the OOM killer; <code>docker inspect</code>'s <code>OOMKilled</code> and <code>dmesg</code> tell the two apart. Chapter 8 goes deep on OOM.</li>
</ul>
${L('https://github.com/krallin/tini', '🧩', 'tini — a tiny init for containers', 'The init Docker runs with --init; the README explains the zombie and signal problems.', 'Open')}
${L('https://man7.org/linux/man-pages/man2/wait.2.html', '📄', 'man 2 wait', 'wait/waitpid and how a process reaps its children.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.5</span>
<h2>Tiến trình không có cha</h2>
<p class="lead">Mọi tiến trình đều có cha, trừ một: PID 1, tiến trình đầu tiên nhân khởi động lúc boot. Nó là gốc của cả cây, nó nhận nuôi mọi đứa mồ côi, và nó có một luật đặc biệt cắn gần như ai đóng gói một app vào container. Làm đúng PID 1 là khác biệt giữa một container dừng trong 0,1 giây và một cái mất 10 giây rồi thoát 137 vô cớ.</p>

<h3>PID 1 làm gì</h3>
<p>Trên một máy Linux thường, PID 1 là một <strong>hệ thống init</strong> — <code>systemd</code> trên Ubuntu/Fedora/Debian. Nó khởi động và giám sát mọi dịch vụ, và là cha cuối cùng của mọi tiến trình mồ côi, với nhiệm vụ <code>wait()</code> chúng để chúng không nằm lại làm zombie mãi. Nó là một chương trình được viết để làm đúng việc đó.</p>
<p>Trong một container, PID 1 là bất cứ thứ gì <code>CMD</code> của bạn là — thường là <em>chính app của bạn</em>. Và app của bạn không được viết để làm một hệ thống init. Chuyện đó gây ra hai vấn đề thật.</p>

<h3>Vấn đề 1: PID 1 lờ các tín hiệu nó không có handler</h3>
<p>Nhân đối xử đặc biệt với PID 1: các tín hiệu có hành động mặc định (như "kết thúc" của SIGTERM) <em>không</em> được áp lên PID 1 trừ khi nó đã cài một handler cho chúng. Điều này bảo vệ init thật khỏi bị một tín hiệu lạc giết — nhưng nó nghĩa là một app container không bắt SIGTERM một cách rõ ràng sẽ đơn giản là lờ nó đi. Nhìn <code>docker stop</code> làm gì với một máy chủ Node <em>không</em> có handler SIGTERM:</p>
${run('c15-pid1', 'docker run -d --name os-p1a', 1)}
${run('c15-pid1', 'docker exec os-p1a ps', 1)}
${run('c15-pid1', 'docker stop os-p1a', 1)}
${run('c15-pid1', "docker inspect -f '{{.State.ExitCode}}' os-p1a", 1)}
<p><code>docker stop</code> gửi SIGTERM và chờ <strong>10 giây</strong> để thoát sạch. PID 1 lờ nó, nên sau 10 giây Docker leo lên SIGKILL — <strong>exit 137</strong>. Mỗi <code>docker stop</code> và mỗi lần deploy container này mất 10 giây và giết app một cách thô bạo. Giờ tới <em>cùng</em> máy chủ đó nhưng <em>có</em> bắt SIGTERM (khuôn <code>sig.c</code> ở bài 1.4):</p>
${run('c15-pid1', 'docker stop os-p1b', 1)}
${run('c15-pid1', 'docker logs os-p1b')}
<p>0,1 giây, exit 0, "bye" trong log. Khác biệt duy nhất là một handler SIGTERM bốn dòng. <strong>Hãy bắt SIGTERM trong mọi dịch vụ bạn đóng gói</strong> — trong Node, Python và Spring Boot nó là vài dòng, và nó là thứ làm deploy không rớt request.</p>

<h3>Vấn đề 2: PID 1 phải dọn con mồ côi</h3>
<p>Nhớ rằng con mồ côi được chuyển cho PID 1 nuôi. Trên một hệ thật, <code>systemd</code> dọn chúng. Nhưng nếu app của bạn là PID 1 và nó sinh con (một shell, một sidecar, bất cứ thứ gì fork), con mồ côi rơi vào <em>nó</em> — và nếu nó không gọi <code>wait()</code>, chúng chất đống thành zombie mà không ai dọn được. Tái hiện:</p>
${run('c15-pid1', "docker exec os-p1e sh -c 'sleep 1 & exit'", 1)}
${run('c15-pid1', 'docker exec os-p1e ps', 1)}
<p>Một zombie <code>&lt;defunct&gt;</code> dưới PID 1 mà sẽ không bao giờ được dọn. Qua nhiều ngày, một container hay gọi ra shell có thể vét cạn giới hạn PID của nó.</p>

<h3>Cách sửa: một init thật tí hon, hoặc --init</h3>
<p>Cách sửa sạch là đặt một init tối giản làm PID 1, nhiệm vụ duy nhất là chuyển tiếp tín hiệu và dọn zombie. Docker có sẵn một cái — thêm <code>--init</code> (nó chạy <code>tini</code>):</p>
${run('c15-pid1', 'docker run -d --init --name os-p1c', 1)}
${run('c15-pid1', 'docker exec os-p1c ps', 1)}
<p>Giờ PID 1 là <code>docker-init</code> và app của bạn là PID 7, một đứa con bình thường. Tín hiệu được chuyển tiếp (nên <code>docker stop</code> nhanh và sạch — exit 143), và con mồ côi được dọn. Trên production bạn hoặc thêm <code>--init</code> / <code>tini</code> <em>và</em> bắt SIGTERM trong app, hoặc dùng một entrypoint <code>exec</code> app của bạn để nó thành PID 1 trực tiếp và tự xử lý tín hiệu.</p>
<div class="pitfall co-tieu-de"><p><strong>Bản tinh vi: một shell làm PID 1.</strong> Nếu Dockerfile của bạn ghi <code>CMD node server.js</code> ở <em>dạng shell</em> (hoặc <code>sh -c "node server.js"</code>), PID 1 là <code>/bin/sh</code>, app của bạn là con nó, và shell không chuyển tiếp SIGTERM — nên lại <code>docker stop</code> chờ 10 giây rồi SIGKILL. Dùng dạng exec (<code>CMD ["node", "server.js"]</code>) hoặc <code>exec node server.js</code> trong entrypoint để app của bạn thành PID 1.</p></div>

<h3>Tái hiện exit 137 theo cách kia: OOM</h3>
<p>Cái 137 phổ biến còn lại là OOM killer. Cho một container 256 MB và một chương trình cứ cấp phát:</p>
${run('c14-oom', 'docker run --name os-oom --memory 256m', 1)}
${run('c14-oom', "docker inspect -f '{{.State.OOMKilled}} {{.State.ExitCode}}' os-oom")}
${run('c14-oom', 'dmesg | grep', 1)}
<p>Ở 256 MB, OOM killer theo cgroup của nhân gửi SIGKILL — exit 137, và <code>OOMKilled: true</code> trong <code>docker inspect</code>. Log của nhân nói chính xác tiến trình nào và nó đang dùng bao nhiêu. Nên hai bộ mặt của 137 — leo thang của <code>docker stop</code> và OOM — đều giải mã giống nhau (SIGKILL) nhưng cách sửa trái ngược: bắt SIGTERM / thêm <code>--init</code> cho cái đầu, nâng giới hạn hoặc cắt bộ nhớ cho cái sau. Cờ <code>OOMKilled</code> của <code>docker inspect</code> và <code>dmesg</code> phân biệt chúng. Chương 8 nói trọn về cái sau.</p>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> container của nhóm bạn mất 10 giây để dừng và đôi khi thoát 137 lúc deploy. Chẩn đoán và sửa.</p>
<ol>
<li>Chạy một container có CMD là một máy chủ không có handler SIGTERM (<code>server-nohandler.js</code> của khoá). Đo <code>docker stop</code> và đọc mã thoát.</li>
<li>Thêm một handler SIGTERM (hoặc chạy với <code>--init</code>). Đo <code>docker stop</code> lại và so mã thoát (143 hoặc 0 so với 137).</li>
<li>Xác nhận PID 1 bằng <code>docker exec &lt;c&gt; ps -o pid,ppid,cmd</code> ở cả hai trường hợp — ai là PID 1?</li>
<li>Riêng ra, tái hiện OOM: <code>docker run --rm --memory 100m os-lab python3 -c "a=[];</code>&hairsp;<code>while 1:a.append(bytearray(10**7))"</code>; kiểm mã thoát và <code>docker inspect --format '{{.State.OOMKilled}}'</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn biến một lần stop 10 giây / exit 137 thành nhanh / exit 0, và phân biệt được 137 do <code>docker stop</code> với 137 do OOM bằng <code>OOMKilled</code> và <code>dmesg</code>.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['PID 1 / init', 'Tiến trình đầu tiên lúc boot, gốc của cây. Khởi động dịch vụ và dọn mọi con mồ côi. systemd trên phần lớn distro.'],
  ['luật tín hiệu của PID 1', 'Nhân không áp hành động mặc định của một tín hiệu cho PID 1 trừ khi PID 1 cài handler — nên một app làm PID 1 lờ SIGTERM.'],
  ['tini / docker --init', 'Một init tí hon chạy làm PID 1, chuyển tiếp tín hiệu và dọn zombie hộ app của bạn.'],
  ['dạng exec vs dạng shell', 'CMD ["node","x"] làm app bạn thành PID 1; CMD node x chạy một shell làm PID 1 và nuốt tín hiệu.'],
  ['thời gian ân hạn của docker stop', 'docker stop gửi SIGTERM, chờ 10 giây, rồi SIGKILL (→ exit 137) nếu tiến trình chưa thoát.'],
  ['OOMKilled', 'Cờ của docker inspect: true khi OOM killer của nhân đã SIGKILL container (nguyên nhân kia của exit 137).'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>PID 1 là tiến trình đầu tiên và là cha của mọi con mồ côi; trên một máy thật nó là một init như systemd.</li>
<li>Trong container app của bạn thường là PID 1, và luật tín hiệu của PID 1 khiến nó lờ SIGTERM trừ khi cài handler — nên <code>docker stop</code> chờ 10 giây rồi SIGKILL (exit 137).</li>
<li>Sửa bằng cách bắt SIGTERM trong app và/hoặc chạy một init tí hon (<code>--init</code>/tini) làm PID 1, và dùng dạng exec để một shell không làm PID 1.</li>
<li>Cái exit 137 còn lại là OOM killer; <code>OOMKilled</code> của <code>docker inspect</code> và <code>dmesg</code> phân biệt hai cái. Chương 8 đi sâu về OOM.</li>
</ul>
${L('https://github.com/krallin/tini', '🧩', 'tini — một init tí hon cho container', 'Init mà Docker chạy với --init; README giải thích vấn đề zombie và tín hiệu.', 'Mở')}
${L('https://man7.org/linux/man-pages/man2/wait.2.html', '📄', 'man 2 wait', 'wait/waitpid và cách một tiến trình dọn con của nó.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 1.6 — Quiz ───────────────────────── */
    {
      title: '1.6 — Chapter 1 check|||1.6 — Kiểm tra Chương 1',
      slug: 'os-1-6-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu về tiến trình: /proc và RSS vs VSZ, fork/exec/wait, copy-on-write, user/kernel mode và giá syscall, trạng thái, tín hiệu, mã thoát 128+N, zombie/mồ côi và PID 1 trong container.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Check</span>
<h2>Do you understand processes?</h2>
<p class="lead">Ten scenario questions. Several are "read this and say what happens" or "which exit code" — because decoding a real process is the skill.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can read a process's real memory use, thread count and open files from <code>/proc</code>.</li>
<li>I can explain fork's two return values, copy-on-write, and why <code>cd</code> is a shell built-in.</li>
<li>I know why a syscall costs ~100× a function call and how to see a program's syscalls.</li>
<li>Given exit code 137 / 143 / 139 / 134, I can name the signal and the likely cause.</li>
<li>I know why an app as PID 1 ignores SIGTERM and how to fix a slow <code>docker stop</code>.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Kiểm tra</span>
<h2>Bạn đã hiểu tiến trình chưa?</h2>
<p class="lead">Mười câu tình huống. Vài câu là "đọc cái này và nói chuyện gì xảy ra" hoặc "mã thoát nào" — vì giải mã một tiến trình thật mới là kỹ năng.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi đọc được bộ nhớ thật, số luồng và file đang mở của một tiến trình từ <code>/proc</code>.</li>
<li>Tôi giải thích được hai giá trị trả về của fork, copy-on-write, và vì sao <code>cd</code> là lệnh dựng sẵn.</li>
<li>Tôi biết vì sao một syscall tốn ~100× một lời gọi hàm và cách xem syscall của một chương trình.</li>
<li>Cho mã thoát 137 / 143 / 139 / 134, tôi gọi được tên tín hiệu và nguyên nhân có thể.</li>
<li>Tôi biết vì sao một app làm PID 1 lờ SIGTERM và cách sửa một <code>docker stop</code> chậm.</li>
</ul>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          { question: 'A process shows VmSize 486 MB and VmRSS 49 MB. How much physical RAM is it actually using?|||Một tiến trình hiện VmSize 486 MB và VmRSS 49 MB. Nó thật sự dùng bao nhiêu RAM vật lý?',
            options: ['486 MB|||486 MB', '49 MB|||49 MB', '486 + 49 = 535 MB|||486 + 49 = 535 MB', 'Cannot tell|||Không biết được'],
            correctIndex: 1, points: 1,
            explanation: 'EN: RSS (resident set size) is the physical RAM actually in use — 49 MB. VSZ (VmSize) counts everything mapped, including libraries and untouched reservations, and is almost always much larger and misleading.|||VI: RSS (resident set size) là RAM vật lý thật sự đang dùng — 49 MB. VSZ (VmSize) đếm mọi thứ đã ánh xạ, kể cả thư viện và chỗ đặt trước chưa chạm, và gần như luôn lớn hơn nhiều và gây hiểu nhầm.' },
          { question: 'In C, <code>pid_t p = fork();</code> then <code>if (p == 0) {…}</code>. What is true?|||Trong C, <code>pid_t p = fork();</code> rồi <code>if (p == 0) {…}</code>. Điều nào đúng?',
            options: ['fork runs the block once in the parent|||fork chạy khối đó một lần ở cha', 'fork returns twice: 0 in the child (runs the block) and the child’s PID in the parent|||fork trả về hai lần: 0 ở con (chạy khối đó) và PID của con ở cha', 'fork creates a thread, not a process|||fork tạo một luồng, không phải tiến trình', 'The block never runs|||Khối đó không bao giờ chạy'],
            correctIndex: 1, points: 1,
            explanation: 'EN: fork returns 0 to the child and the child’s PID to the parent; both continue from the next line with their own copy of memory (copy-on-write). The if (p==0) block is the child-only path. fork makes a process, not a thread.|||VI: fork trả 0 cho con và PID của con cho cha; cả hai chạy tiếp từ dòng sau với bản sao bộ nhớ riêng (copy-on-write). Khối if (p==0) là nhánh chỉ của con. fork tạo tiến trình, không phải luồng.' },
          { question: 'Why must <code>cd</code> be a shell built-in rather than an external program the shell forks?|||Vì sao <code>cd</code> phải là lệnh dựng sẵn của shell chứ không phải một chương trình ngoài mà shell fork?',
            options: ['cd is too fast to fork|||cd quá nhanh để fork', 'A forked child changing its own directory does not affect the shell’s directory|||Một con đã fork đổi thư mục của chính nó thì không ảnh hưởng thư mục của shell', 'cd needs root|||cd cần quyền root', 'There is no cd program on disk ever|||Không bao giờ có chương trình cd trên đĩa'],
            correctIndex: 1, points: 1,
            explanation: 'EN: Each process has its own working directory. If the shell forked a child to run cd, the child would chdir and exit, leaving the shell unchanged. So cd must run in the shell process itself — a built-in.|||VI: Mỗi tiến trình có thư mục làm việc riêng. Nếu shell fork một con để chạy cd, con sẽ chdir rồi thoát, để shell y nguyên. Nên cd phải chạy trong chính tiến trình shell — một lệnh dựng sẵn.' },
          { question: 'Roughly how much more expensive is a real system call than a plain function call, and why?|||Một lời gọi hệ thống thật đắt hơn một lời gọi hàm thường khoảng bao nhiêu, và vì sao?',
            options: ['About the same; both are function calls|||Xấp xỉ nhau; cả hai là lời gọi hàm', 'About 100×, mostly the user↔kernel mode switch|||Khoảng 100×, phần lớn là chuyển chế độ user↔kernel', 'About 2×, due to argument copying|||Khoảng 2×, do chép tham số', 'Cheaper, because the kernel is optimised|||Rẻ hơn, vì nhân được tối ưu'],
            correctIndex: 1, points: 1,
            explanation: 'EN: Measured, a function call is ~2 ns and getppid ~190 ns — about 100×, almost all of it the mode switch into the kernel and back. That is why buffered I/O batches reads/writes instead of making millions of tiny syscalls, and why the vDSO exists.|||VI: Đo thật, một lời gọi hàm ~2 ns và getppid ~190 ns — khoảng 100×, gần như toàn bộ là chuyển chế độ vào nhân rồi ra. Vì thế I/O có đệm gộp read/write thay vì làm hàng triệu syscall tí hon, và vì thế có vDSO.' },
          { question: 'A process is in state <code>D</code> and <code>kill -9</code> does not remove it. Why?|||Một tiến trình ở trạng thái <code>D</code> và <code>kill -9</code> không xoá được nó. Vì sao?',
            options: ['It is a zombie|||Nó là zombie', 'D is uninterruptible sleep (usually disk I/O); even SIGKILL is deferred until the I/O completes|||D là ngủ không ngắt được (thường là I/O đĩa); kể cả SIGKILL cũng bị hoãn tới khi I/O xong', 'You need sudo|||Bạn cần sudo', 'D processes cannot be killed ever|||Tiến trình D không bao giờ giết được'],
            correctIndex: 1, points: 1,
            explanation: 'EN: D means the process is waiting on I/O in a state that cannot be interrupted, so even SIGKILL waits for the I/O to finish. Lots of D processes points at a storage/NFS problem, not at the processes themselves. A zombie (Z) is different — already dead.|||VI: D nghĩa là tiến trình đang chờ I/O ở trạng thái không ngắt được, nên kể cả SIGKILL cũng phải chờ I/O xong. Nhiều tiến trình D chỉ ra vấn đề lưu trữ/NFS, không phải bản thân tiến trình. Zombie (Z) thì khác — đã chết rồi.' },
          { question: 'A container exits with code <code>143</code>. What happened?|||Một container thoát với mã <code>143</code>. Chuyện gì xảy ra?',
            options: ['It ran out of memory|||Nó hết bộ nhớ', 'It was terminated by SIGTERM (128 + 15) — e.g. a normal docker stop it handled or did not catch|||Nó bị SIGTERM kết thúc (128 + 15) — vd. một docker stop bình thường mà nó xử lý hoặc không bắt', 'It segfaulted|||Nó segfault', 'It exited successfully|||Nó thoát thành công'],
            correctIndex: 1, points: 1,
            explanation: 'EN: 143 = 128 + 15 = SIGTERM, the polite stop signal docker stop sends first. 137 (128+9, SIGKILL) would be OOM or a stop that timed out; 139 (128+11) is SIGSEGV; 0 is success.|||VI: 143 = 128 + 15 = SIGTERM, tín hiệu dừng lịch sự mà docker stop gửi trước. 137 (128+9, SIGKILL) mới là OOM hoặc một lần stop hết giờ; 139 (128+11) là SIGSEGV; 0 là thành công.' },
          { question: 'Your Node container takes exactly 10 seconds to <code>docker stop</code> and exits 137. The app is PID 1. Most likely cause?|||Container Node của bạn mất đúng 10 giây để <code>docker stop</code> và thoát 137. App là PID 1. Nguyên nhân khả dĩ nhất?',
            options: ['Out of memory|||Hết bộ nhớ', 'The app as PID 1 has no SIGTERM handler, so it ignores SIGTERM; after a 10 s grace period Docker sends SIGKILL|||App làm PID 1 không có handler SIGTERM, nên lờ SIGTERM; sau 10 giây ân hạn Docker gửi SIGKILL', 'The disk is full|||Đĩa đầy', 'The network is down|||Mạng sập'],
            correctIndex: 1, points: 1,
            explanation: 'EN: The kernel does not apply SIGTERM’s default action to PID 1 unless it has a handler. docker stop sends SIGTERM, waits 10 s, then SIGKILLs → exit 137. OOM also gives 137 but without the 10-second wait and with OOMKilled:true. Fix: catch SIGTERM, or run --init.|||VI: Nhân không áp hành động mặc định của SIGTERM cho PID 1 trừ khi nó có handler. docker stop gửi SIGTERM, chờ 10 giây, rồi SIGKILL → exit 137. OOM cũng cho 137 nhưng không có 10 giây chờ và có OOMKilled:true. Sửa: bắt SIGTERM, hoặc chạy --init.' },
          { question: 'What is a zombie process, and does <code>kill -9</code> clear it?|||Tiến trình zombie là gì, và <code>kill -9</code> có xoá được nó không?',
            options: ['A hung process; kill -9 clears it|||Một tiến trình treo; kill -9 xoá được', 'A finished child whose exit code the parent has not collected; kill -9 does nothing — the fix is the parent calling wait()|||Một con đã xong mà cha chưa thu mã thoát; kill -9 chẳng làm gì — cách sửa là cha gọi wait()', 'A process using 100% CPU|||Một tiến trình dùng 100% CPU', 'A process with no memory|||Một tiến trình không có bộ nhớ'],
            correctIndex: 1, points: 1,
            explanation: 'EN: A zombie has already exited; only a tiny record (PID + exit status) remains until the parent reaps it with wait(). It uses no CPU/RAM but holds a PID. kill -9 cannot kill the already-dead; you must make the parent wait() (or kill the parent, so PID 1 reaps the orphan).|||VI: Một zombie đã thoát rồi; chỉ còn một bản ghi nhỏ (PID + status) tới khi cha dọn bằng wait(). Nó không tốn CPU/RAM nhưng giữ một PID. kill -9 không giết được thứ đã chết; bạn phải làm cha wait() (hoặc giết cha, để PID 1 dọn con mồ côi).' },
          { question: 'What does <code>fork(); fork(); fork();</code> followed by one print produce?|||<code>fork(); fork(); fork();</code> rồi một lệnh in sẽ cho ra gì?',
            options: ['3 lines (2³−1)|||3 dòng (2³−1)', '8 lines — each fork doubles the processes, 2³ = 8|||8 dòng — mỗi fork nhân đôi số tiến trình, 2³ = 8', '6 lines|||6 dòng', '4 lines|||4 dòng'],
            correctIndex: 1, points: 1,
            explanation: 'EN: After the first fork there are 2 processes, after the second 4, after the third 8 — all of which reach the print. In general n forks in a row give 2ⁿ processes (2ⁿ−1 of them newly created).|||VI: Sau fork thứ nhất có 2 tiến trình, sau thứ hai 4, sau thứ ba 8 — tất cả đều tới lệnh in. Tổng quát n fork liên tiếp cho 2ⁿ tiến trình (2ⁿ−1 là mới tạo).' },
          { question: 'Why does adding <code>--init</code> (tini) to a container fix both a slow stop and leaking zombies?|||Vì sao thêm <code>--init</code> (tini) vào một container sửa được cả stop chậm lẫn rò rỉ zombie?',
            options: ['It makes the app faster|||Nó làm app nhanh hơn', 'tini becomes PID 1: it forwards signals (so SIGTERM reaches your app) and calls wait() to reap orphans|||tini thành PID 1: nó chuyển tiếp tín hiệu (nên SIGTERM tới app của bạn) và gọi wait() để dọn con mồ côi', 'It adds more memory|||Nó thêm bộ nhớ', 'It disables the OOM killer|||Nó tắt OOM killer'],
            correctIndex: 1, points: 1,
            explanation: 'EN: tini runs as PID 1 and does the two jobs a normal app does not: forward signals to your app (now a child, so it is no longer protected by the PID 1 rule and SIGTERM works) and reap orphaned zombies. It does not change speed or memory, and does not touch the OOM killer.|||VI: tini chạy làm PID 1 và làm hai việc mà một app thường không làm: chuyển tín hiệu tới app của bạn (giờ là con, nên không còn được luật PID 1 che và SIGTERM hoạt động) và dọn các zombie mồ côi. Nó không đổi tốc độ hay bộ nhớ, và không đụng OOM killer.' },
        ],
      },
    },
  ],
};
