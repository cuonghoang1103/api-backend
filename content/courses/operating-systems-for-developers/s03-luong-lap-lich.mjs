/**
 * Operating Systems for Developers — Chương 3: Luồng và lập lịch CPU (soạn 28/10/2026 theo _HOP-DONG.md).
 * Output CHẠY THẬT trong ảnh `os-lab` (lab/code/ch03/*.sh → lab/out/c3*.out.txt). Mô phỏng: scheduler (mọi preset) +
 * process/threads. LUẬT escaping: < > → &lt; &gt;; & → &amp;; không backtick trần; ${ của bash → \${.
 *
 * Chạy lại output (từ thư mục lab/):
 *   docker run --rm --label oslab=1 --hostname oslab -v "$PWD/code/ch03":/lab/ch03 -w /lab/ch03 [cờ] os-lab bash -c "phien <kb>.sh 2>&1" > out/<kb>.out.txt
 *   cờ: c32-lich --cap-add SYS_NICE · c33-cs, c34-loi --cap-add PERFMON --security-opt seccomp=unconfined ·
 *       c34-quota --cpus 1.5 · c34-cpuset --cpuset-cpus 0,1 · c31-luong, c35-loop: không cờ
 */
import { run, src, card, kv, cmd } from './_ui.mjs';
import { lab } from './_lab.mjs';
import G31 from './giang/os-03-1.mjs';
import G32 from './giang/os-03-2.mjs';
import G33 from './giang/os-03-3.mjs';
import G34 from './giang/os-03-4.mjs';
import G35 from './giang/os-03-5.mjs';

const REF = '?ref=%2Fcourses%2Foperating-systems-for-developers%2Flearn&reflabel=Operating%20Systems%20for%20Developers';
const L = (href, ico, t, s, cta) => card(href, ico, t, s, cta);
const OSG = (slug) => '/courses/operating-systems/learn?lessonSlug=' + slug;

export default {
  title: 'Chapter 3 — Threads and CPU scheduling|||Chương 3 — Luồng và lập lịch CPU',
  description: 'Nhiều việc chạy "cùng lúc" trên vài lõi — và ai được CPU, lúc nào: luồng chia sẻ gì và không chia sẻ gì, các thuật toán lập lịch từ FCFS tới EEVDF và nice đo thật, giá của một lần chuyển ngữ cảnh, đa lõi/affinity/CPU quota trong container, và event loop của Node so với thread pool của Spring Boot.',
  lessons: [
    /* ───────────────────────── 3.1 — Luồng ───────────────────────── */
    {
      title: '3.1 — Threads: what they share and what they do not|||3.1 — Luồng: chia sẻ gì và không chia sẻ gì',
      slug: 'os-3-1-luong',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Một tiến trình nhiều luồng: cùng PID, khác TID; heap và biến toàn cục chung, stack và thanh ghi riêng — đo bằng /proc/<pid>/task; stack 8 MB ảo mỗi luồng; luồng nhân 1:1 so với virtual thread của Java 21 (10 000 việc chờ, đo thật).',
      content: `${G31}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>A thread is a second line of execution inside the same process</h2>
<p class="lead">A backend serves many requests at once, and most of the time each request is just <em>waiting</em> — for the database, for another API, for the disk. Forking a new process per request (Chapter 1) works, but each process has its own memory, so sharing a cache or a connection pool between them is hard and expensive. A <strong>thread</strong> is the cheaper answer: another independent flow of execution <em>inside the same process</em>, seeing the same memory. This lesson answers one precise question with measurements — what exactly do two threads of one process share, and what does each keep for itself?</p>
${lab('process', 'threads', 'en', 'Three pthread_create calls: still ONE process (one PID) with four threads sharing memory; then fork() gives a child with its OWN copy. Step through it.')}

<h3>One process, four threads — measured</h3>
<p>This C program starts three threads. Every thread (and <code>main</code>) prints its process ID, its own thread ID, and three addresses: a local variable (on its stack), a global variable, and a heap block from <code>malloc</code>. Each thread names itself so the kernel can show the name:</p>
${src('ch03/luong.c', 'c')}
${run('c31-luong', './luong > luong.txt')}
<p>Read it column by column. <code>pid=17</code> on every line: <strong>one process</strong>. <code>tid</code> differs: 17, 19, 20, 21 — four <strong>threads</strong>, and the main thread's TID equals the PID. <code>&amp;global</code> and <code>heap</code> are the <em>same address</em> in all four: one copy, shared. <code>&amp;local</code> is different in each — every thread has its <strong>own stack</strong>. Subtract two neighbours (<code>0xffff9b12e8a4 − 0xffff9a91e8a4 = 0x810000</code>) and you get 8 MiB + 64 KiB: an 8 MB stack plus a guard page per thread.</p>

<h3>What the kernel sees: tasks with a shared ID</h3>
<p>To Linux, a thread is just another schedulable <em>task</em> that happens to share the address space, the file table and a few other things with its siblings. <code>ps -L</code> lists them as LWPs ("light-weight processes"):</p>
${run('c31-luong', 'ps -L')}
${run('c31-luong', 'ls /proc/$PID/task', 2)}
<p>Every thread has a folder under <code>/proc/&lt;pid&gt;/task/</code>. Open one and the kernel tells you the trick behind "PID" — what you call the PID is really the <strong>thread-group ID</strong> (<code>Tgid</code>):</p>
${run('c31-luong', 'T=$(ls', 2)}
<p>Thread 19 has <code>Pid: 19</code> (its task ID) but <code>Tgid: 17</code>: it belongs to process 17. And all four threads' fd 1 point to the same file — the file descriptor table is shared too. When the threads finish, main sees the writes every thread made:</p>
${run('c31-luong', 'wait $PID')}
<p>This is the <strong>1:1 model</strong> Linux uses for pthreads: each user thread is exactly one kernel task, created with <code>clone()</code> and scheduled independently. That last point matters for the rest of this chapter — the scheduler does not schedule <em>processes</em>, it schedules <em>tasks</em>. A process with 200 threads competes for the CPU as 200 runnable things.</p>

<table>
<tr><th>Shared by all threads of a process</th><th>Private to each thread</th></tr>
<tr><td>code, global variables, heap (<code>malloc</code>/<code>new</code>)</td><td>stack (locals, return addresses) — 8 MB reserved by default</td></tr>
<tr><td>open files and sockets (fd table), current directory</td><td>registers: program counter, stack pointer</td></tr>
<tr><td>PID (thread-group ID), user/group, signal handlers</td><td>TID, signal mask, <code>errno</code>, thread-local storage</td></tr>
<tr><td>memory limits and the OOM verdict — one thread's leak kills all</td><td>scheduling state: each thread is queued, run and preempted on its own</td></tr>
</table>

<div class="pitfall co-tieu-de">
<p><strong>"Shared memory" is both the feature and the bug.</strong> Because the heap is shared, two threads can update the same object at the same instant; above we serialised with a mutex, so <code>global</code> came out 3. Remove the lock and do it a million times and you lose updates — that is a race condition, and it is the whole of Chapter 5. The other half of the trap: one thread that writes past an array or leaks memory takes down every other thread, because there is only one address space and one OOM verdict.</p>
</div>

<h3>Stacks are reserved, not used — VSZ vs RSS again</h3>
<p>Each thread reserves an 8 MB stack (<code>ulimit -s</code> = 8192 KB) but only touches a few KB. Create 1, 100 and 1 000 sleeping threads and read <code>/proc/self/status</code>:</p>
${run('c31-luong', 'ulimit -s')}
${run('c31-luong', 'for n in 1 100 1000', 2)}
<p>1 000 threads: <strong>8.2 GB of VSZ</strong> but <strong>9.8 MB of RSS</strong>. Exactly the lesson-1.1 trap at a larger scale: a Java server with 500 threads "using 4 GB" is usually using a fraction of that. The real ceilings are elsewhere — <code>threads-max</code> for the whole kernel, and the cgroup <code>pids.max</code> of your container, which counts <em>threads</em>, not just processes. Docker's <code>--pids-limit</code> or a Kubernetes pod limit turns into <code>pthread_create</code> failing — in Java, <code>OutOfMemoryError: unable to create native thread</code>, which has nothing to do with heap.</p>

<h3>Your runtime already has threads</h3>
<p>"Node is single-threaded" means your <em>JavaScript</em> runs on one thread. The process has more:</p>
${run('c31-luong', "node -e 'setTimeout")}
<p>Seven threads before you wrote a line: the main thread running JS and the event loop, V8's platform workers (garbage collection, compiling in the background) and a delayed-task scheduler. The libuv thread pool for files and crypto appears on first use (lesson 3.5).</p>

<h3>Kernel threads vs user-level threads: Java virtual threads, measured</h3>
<p>A kernel thread costs a <code>clone()</code>, a stack mapping and a slot in the scheduler. Java 21 adds <strong>virtual threads</strong>: threads the JVM schedules itself (an M:N model) on a small pool of kernel "carrier" threads. When a virtual thread blocks in <code>sleep</code> or on I/O, the JVM unmounts it and runs another on the same carrier. Same job — 10 000 tasks that each wait 2 seconds — both ways:</p>
${src('ch03/Vt.java', 'java')}
${run('c31-luong', 'java Vt platform', 2)}
<p>With one kernel thread per task, creating 10 000 of them took several seconds here (about 0.45 ms each in this VM), so they never all overlapped: one second after the last submit only 2 464 were still alive, and the whole job took 6.6 s instead of 2. With virtual threads the kernel saw <strong>31 threads</strong>, RAM was about half, and all 10 000 waits overlapped: 2.07 s. Node's event loop and Go's goroutines are the same idea — many cheap waits multiplexed onto few kernel threads — and lesson 3.5 measures it on a real HTTP server.</p>
${lab('threadpool', 'virtual', 'en', 'Virtual threads in a server: one virtual thread per request, so the worker limit disappears and 380 req/s go through — until the next pool (10 database connections) becomes the ceiling. Switch “Threads” back to a platform pool and watch the queue return.')}

<h3>If you have done OSG202 lesson 2.2</h3>
<p>There you learned the textbook picture: thread = PC + registers + stack, user-level vs kernel-level threads, many-to-one, one-to-one, many-to-many. Here you have seen each of those words as a number: TIDs in <code>/proc/&lt;pid&gt;/task</code>, 8 MB stacks, 1:1 pthreads, and an M:N runtime (virtual threads) using 31 kernel threads for 10 000 tasks.</p>
${L(OSG('osg202-2-2-luong-dong-bo'), '🎓', 'OSG202 · 2.2 — Threads &amp; synchronization', 'The textbook models of threads, as the exam asks them.', 'Open')}

<h3>🧪 Practice (20 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> during a traffic spike the team's Java service dies with <code>OutOfMemoryError: unable to create native thread</code>, yet the heap graph is only half full. You want to understand where thread limits really live before anyone "adds more heap".</p>
<ol>
<li>Build and run <code>luong.c</code> in the lab. From <code>/proc/&lt;pid&gt;/task</code> list the TIDs, and from one task's <code>status</code> show that <code>Tgid</code> is the process's PID.</li>
<li>Run <code>./many 1000</code> and note VmSize vs VmRSS. Then <code>ulimit -s 1024</code> and run it again: how much VSZ does each thread reserve now?</li>
<li>Start a container with a thread budget: <code>docker run --rm -it --pids-limit 100 os-lab</code>, compile <code>many.c</code> and run <code>./many 200</code>. At which thread does <code>pthread_create</code> fail, and what does <code>cat /sys/fs/cgroup/pids.max</code> say?</li>
<li>Run <code>java Vt platform 10000</code> and <code>java Vt virtual 10000</code> yourself and compare <code>Threads:</code> and the total time.</li>
</ol>
<p><strong>Done when:</strong> you can show (a) one PID with several TIDs, (b) that 1 000 threads cost ~8 GB of VSZ but only a few MB of RSS, and (c) that a pids limit of 100 stops thread creation just under 100 — i.e. "unable to create native thread" is a thread budget, not a heap problem.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['thread (luồng)', 'An independent flow of execution inside a process: its own stack and registers, everything else shared.'],
  ['TID / TGID', 'Each thread’s own task ID / the thread-group ID that the rest of the world calls the PID.'],
  ['LWP', 'What <code>ps -L</code> calls a thread: “light-weight process”, i.e. one kernel task.'],
  ['thread stack (stack của luồng)', 'Per-thread memory for locals and calls; 8 MB reserved by default, only touched pages use RAM.'],
  ['1:1 model', 'Each user thread is exactly one kernel task (Linux pthreads, Java platform threads).'],
  ['M:N / virtual thread', 'Many runtime-scheduled threads multiplexed onto few kernel threads (Java 21 virtual threads, goroutines).'],
  ['pids.max', 'The cgroup limit on tasks — threads included — in a container.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Threads of one process share code, globals, heap, open files and the PID; each keeps its own stack, registers and TID.</li>
<li>Linux schedules threads, not processes: each pthread is a kernel task (1:1), visible under <code>/proc/&lt;pid&gt;/task</code>.</li>
<li>Each thread reserves an 8 MB stack virtually; 1 000 threads ≈ 8.2 GB VSZ but ~10 MB RSS. The real limits are <code>threads-max</code> and the container’s <code>pids.max</code>.</li>
<li>Shared memory makes threads cheap to cooperate — and makes races and whole-process crashes possible (Chapter 5).</li>
<li>User-level (M:N) threads like Java virtual threads run 10 000 waits on ~31 kernel threads: measured 2.07 s vs 6.6 s.</li>
</ul>
${L('https://man7.org/linux/man-pages/man7/pthreads.7.html', '📄', 'man 7 pthreads', 'What threads share and what is per-thread, per POSIX and Linux.', 'Open')}
${L('https://pages.cs.wisc.edu/~remzi/OSTEP/threads-intro.pdf', '📘', 'OSTEP — Concurrency: an introduction', 'Why threads exist and what a thread really is (free chapter).', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Luồng là một dòng thực thi thứ hai nằm trong cùng một tiến trình</h2>
<p class="lead">Một backend phục vụ nhiều yêu cầu cùng lúc, và phần lớn thời gian mỗi yêu cầu chỉ đang <em>chờ</em> — chờ cơ sở dữ liệu, chờ API khác, chờ đĩa. Fork một tiến trình mới cho mỗi yêu cầu (Chương 1) thì chạy được, nhưng mỗi tiến trình có bộ nhớ riêng, nên chia sẻ một bộ đệm hay một pool kết nối giữa chúng vừa khó vừa tốn. <strong>Luồng (thread)</strong> là câu trả lời rẻ hơn: thêm một dòng thực thi độc lập <em>bên trong cùng tiến trình</em>, nhìn thấy cùng một bộ nhớ. Bài này trả lời một câu hỏi chính xác bằng số đo — hai luồng của một tiến trình chia sẻ đúng những gì, và mỗi luồng giữ riêng cái gì?</p>
${lab('process', 'threads', 'vi', 'Ba lần pthread_create: vẫn MỘT tiến trình (một PID) với bốn luồng dùng chung bộ nhớ; rồi fork() cho ra một con có bản sao RIÊNG. Bấm từng bước.')}

<h3>Một tiến trình, bốn luồng — đo thật</h3>
<p>Chương trình C này tạo ba luồng. Mỗi luồng (và <code>main</code>) in mã tiến trình, mã luồng của chính nó, và ba địa chỉ: một biến cục bộ (nằm trên stack của nó), một biến toàn cục, và một khối heap từ <code>malloc</code>. Mỗi luồng tự đặt tên để nhân hiển thị được:</p>
${src('ch03/luong.c', 'c')}
${run('c31-luong', './luong > luong.txt')}
<p>Đọc theo từng cột. <code>pid=17</code> ở mọi dòng: <strong>một tiến trình</strong>. <code>tid</code> khác nhau: 17, 19, 20, 21 — bốn <strong>luồng</strong>, và TID của luồng chính bằng đúng PID. <code>&amp;global</code> và <code>heap</code> là <em>cùng một địa chỉ</em> ở cả bốn: một bản, dùng chung. <code>&amp;local</code> khác nhau ở mỗi luồng — mỗi luồng có <strong>stack riêng</strong>. Lấy hai luồng cạnh nhau trừ nhau (<code>0xffff9b12e8a4 − 0xffff9a91e8a4 = 0x810000</code>) được 8 MiB + 64 KiB: một stack 8 MB cộng một trang canh (guard page) cho mỗi luồng.</p>

<h3>Nhân nhìn thấy gì: các task có chung một mã</h3>
<p>Với Linux, một luồng chỉ là thêm một <em>task</em> có thể lập lịch, tình cờ dùng chung không gian địa chỉ, bảng file và vài thứ khác với anh em của nó. <code>ps -L</code> liệt kê chúng dưới tên LWP ("tiến trình nhẹ"):</p>
${run('c31-luong', 'ps -L')}
${run('c31-luong', 'ls /proc/$PID/task', 2)}
<p>Mỗi luồng có một thư mục dưới <code>/proc/&lt;pid&gt;/task/</code>. Mở một cái ra, nhân sẽ cho bạn thấy mánh đằng sau chữ "PID" — thứ bạn gọi là PID thật ra là <strong>mã nhóm luồng (thread-group ID)</strong> (<code>Tgid</code>):</p>
${run('c31-luong', 'T=$(ls', 2)}
<p>Luồng 19 có <code>Pid: 19</code> (mã task của nó) nhưng <code>Tgid: 17</code>: nó thuộc tiến trình 17. Và fd 1 của cả bốn luồng trỏ tới cùng một file — bảng file descriptor cũng dùng chung. Khi các luồng xong, main thấy được mọi thứ mà từng luồng đã ghi:</p>
${run('c31-luong', 'wait $PID')}
<p>Đây là <strong>mô hình 1:1</strong> mà Linux dùng cho pthreads: mỗi luồng người dùng đúng bằng một task của nhân, tạo bằng <code>clone()</code> và được lập lịch độc lập. Điểm cuối này quan trọng cho cả chương: bộ lập lịch không lập lịch <em>tiến trình</em>, nó lập lịch <em>task</em>. Một tiến trình có 200 luồng tranh CPU như 200 thứ đang chờ chạy.</p>

<table>
<tr><th>Mọi luồng của một tiến trình dùng chung</th><th>Riêng của từng luồng</th></tr>
<tr><td>mã, biến toàn cục, heap (<code>malloc</code>/<code>new</code>)</td><td>stack (biến cục bộ, địa chỉ trả về) — mặc định đặt trước 8 MB</td></tr>
<tr><td>file và socket đang mở (bảng fd), thư mục hiện tại</td><td>thanh ghi: bộ đếm chương trình, con trỏ stack</td></tr>
<tr><td>PID (mã nhóm luồng), user/group, trình xử lý tín hiệu</td><td>TID, mặt nạ tín hiệu, <code>errno</code>, bộ nhớ riêng của luồng (TLS)</td></tr>
<tr><td>giới hạn bộ nhớ và phán quyết OOM — một luồng rò rỉ là giết cả bọn</td><td>trạng thái lập lịch: mỗi luồng được xếp hàng, chạy và bị giành CPU riêng</td></tr>
</table>

<div class="pitfall co-tieu-de">
<p><strong>"Bộ nhớ dùng chung" vừa là tính năng vừa là lỗi.</strong> Vì heap dùng chung, hai luồng có thể sửa cùng một đối tượng đúng cùng một lúc; ở trên ta đã xếp hàng chúng bằng một mutex nên <code>global</code> ra đúng 3. Bỏ khoá đi và làm một triệu lần thì bạn sẽ mất bớt lần cập nhật — đó là race condition, và đó là toàn bộ Chương 5. Nửa còn lại của cái bẫy: một luồng ghi tràn mảng hay rò rỉ bộ nhớ sẽ kéo sập mọi luồng khác, vì chỉ có một không gian địa chỉ và một phán quyết OOM.</p>
</div>

<h3>Stack là đặt trước, không phải dùng — lại là VSZ vs RSS</h3>
<p>Mỗi luồng đặt trước một stack 8 MB (<code>ulimit -s</code> = 8192 KB) nhưng chỉ chạm vài KB. Tạo 1, 100 và 1 000 luồng ngủ rồi đọc <code>/proc/self/status</code>:</p>
${run('c31-luong', 'ulimit -s')}
${run('c31-luong', 'for n in 1 100 1000', 2)}
<p>1 000 luồng: <strong>8,2 GB VSZ</strong> nhưng chỉ <strong>9,8 MB RSS</strong>. Đúng cái bẫy của bài 1.1, ở cỡ lớn hơn: một máy chủ Java có 500 luồng "đang dùng 4 GB" thường chỉ dùng một phần nhỏ trong đó. Trần thật nằm chỗ khác — <code>threads-max</code> cho cả nhân, và <code>pids.max</code> của cgroup container, thứ đếm cả <em>luồng</em> chứ không chỉ tiến trình. <code>--pids-limit</code> của Docker hay giới hạn của một pod Kubernetes biến thành <code>pthread_create</code> thất bại — trong Java là <code>OutOfMemoryError: unable to create native thread</code>, chẳng liên quan gì tới heap.</p>

<h3>Runtime của bạn vốn đã có luồng</h3>
<p>"Node chạy một luồng" nghĩa là <em>JavaScript</em> của bạn chạy trên một luồng. Tiến trình thì có nhiều hơn:</p>
${run('c31-luong', "node -e 'setTimeout")}
<p>Bảy luồng trước khi bạn viết dòng nào: luồng chính chạy JS và event loop, các luồng phụ của V8 (gom rác, biên dịch nền) và một bộ hẹn giờ việc trễ. Thread pool của libuv cho file và mã hoá chỉ xuất hiện ở lần dùng đầu tiên (bài 3.5).</p>

<h3>Luồng nhân vs luồng mức người dùng: virtual thread của Java, đo thật</h3>
<p>Một luồng nhân tốn một lần <code>clone()</code>, một vùng stack và một chỗ trong bộ lập lịch. Java 21 thêm <strong>virtual thread (luồng ảo)</strong>: luồng do chính JVM lập lịch (mô hình M:N) trên một nhóm nhỏ luồng nhân "chở" (carrier). Khi một luồng ảo bị chặn ở <code>sleep</code> hay I/O, JVM gỡ nó ra và chạy luồng ảo khác trên cùng carrier. Cùng một việc — 10 000 tác vụ, mỗi cái chờ 2 giây — làm theo hai cách:</p>
${src('ch03/Vt.java', 'java')}
${run('c31-luong', 'java Vt platform', 2)}
<p>Với một luồng nhân cho mỗi tác vụ, tạo 10 000 luồng mất mấy giây ở đây (khoảng 0,45 ms mỗi luồng trong VM này), nên chúng không bao giờ cùng chờ một lúc: một giây sau lần submit cuối chỉ còn 2 464 luồng sống, và cả việc mất 6,6 s thay vì 2. Với luồng ảo, nhân chỉ thấy <strong>31 luồng</strong>, RAM còn khoảng một nửa, và cả 10 000 lần chờ chồng lên nhau: 2,07 s. Event loop của Node và goroutine của Go cùng một ý — rất nhiều lần chờ rẻ dồn lên vài luồng nhân — và bài 3.5 sẽ đo nó trên một máy chủ HTTP thật.</p>
${lab('threadpool', 'virtual', 'vi', 'Luồng ảo trong một máy chủ: mỗi request một luồng ảo nên giới hạn worker biến mất và 380 req/s chạy được — cho tới khi pool kế tiếp (10 kết nối CSDL) thành trần. Đổi “Luồng” về thread pool thường và nhìn hàng đợi quay lại.')}

<h3>Nếu bạn đã học OSG202 bài 2.2</h3>
<p>Ở đó bạn học bức tranh giáo trình: luồng = PC + thanh ghi + stack, luồng mức người dùng vs mức nhân, nhiều-một, một-một, nhiều-nhiều. Ở đây bạn đã thấy từng chữ đó thành con số: TID trong <code>/proc/&lt;pid&gt;/task</code>, stack 8 MB, pthreads 1:1, và một runtime M:N (luồng ảo) dùng 31 luồng nhân cho 10 000 tác vụ.</p>
${L(OSG('osg202-2-2-luong-dong-bo'), '🎓', 'OSG202 · 2.2 — Luồng &amp; đồng bộ hoá', 'Các mô hình luồng theo giáo trình, đúng cách đề thi hỏi.', 'Mở')}

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> lúc lưu lượng tăng vọt, dịch vụ Java của nhóm chết với <code>OutOfMemoryError: unable to create native thread</code>, trong khi biểu đồ heap mới đầy một nửa. Bạn muốn hiểu giới hạn luồng thật sự nằm ở đâu trước khi có ai đó "tăng heap lên".</p>
<ol>
<li>Dịch và chạy <code>luong.c</code> trong lab. Từ <code>/proc/&lt;pid&gt;/task</code> liệt kê các TID, và từ <code>status</code> của một task chỉ ra rằng <code>Tgid</code> là PID của tiến trình.</li>
<li>Chạy <code>./many 1000</code> và ghi lại VmSize so với VmRSS. Rồi <code>ulimit -s 1024</code> và chạy lại: giờ mỗi luồng đặt trước bao nhiêu VSZ?</li>
<li>Mở một container có "ngân sách luồng": <code>docker run --rm -it --pids-limit 100 os-lab</code>, dịch <code>many.c</code> và chạy <code>./many 200</code>. <code>pthread_create</code> thất bại ở luồng thứ mấy, và <code>cat /sys/fs/cgroup/pids.max</code> nói gì?</li>
<li>Tự chạy <code>java Vt platform 10000</code> và <code>java Vt virtual 10000</code>, so <code>Threads:</code> và tổng thời gian.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chỉ ra được (a) một PID với nhiều TID, (b) 1 000 luồng tốn ~8 GB VSZ nhưng chỉ vài MB RSS, và (c) giới hạn pids 100 chặn việc tạo luồng ngay dưới 100 — tức "unable to create native thread" là chuyện ngân sách luồng, không phải heap.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['thread (luồng)', 'Một dòng thực thi độc lập trong tiến trình: stack và thanh ghi riêng, mọi thứ khác dùng chung.'],
  ['TID / TGID', 'Mã task riêng của từng luồng / mã nhóm luồng mà cả thế giới gọi là PID.'],
  ['LWP (tiến trình nhẹ)', 'Cách <code>ps -L</code> gọi một luồng — tức một task của nhân.'],
  ['thread stack (stack của luồng)', 'Bộ nhớ riêng mỗi luồng cho biến cục bộ và lời gọi hàm; mặc định đặt trước 8 MB, chỉ trang nào chạm mới tốn RAM.'],
  ['1:1 model (mô hình 1:1)', 'Mỗi luồng người dùng đúng bằng một task của nhân (pthreads trên Linux, luồng nền tảng của Java).'],
  ['M:N / virtual thread (luồng ảo)', 'Nhiều luồng do runtime lập lịch, dồn lên vài luồng nhân (luồng ảo Java 21, goroutine).'],
  ['pids.max', 'Giới hạn số task — tính cả luồng — của cgroup trong một container.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Các luồng của một tiến trình dùng chung mã, biến toàn cục, heap, file đang mở và PID; mỗi luồng giữ riêng stack, thanh ghi và TID.</li>
<li>Linux lập lịch luồng chứ không lập lịch tiến trình: mỗi pthread là một task của nhân (1:1), thấy được dưới <code>/proc/&lt;pid&gt;/task</code>.</li>
<li>Mỗi luồng đặt trước 8 MB stack ảo; 1 000 luồng ≈ 8,2 GB VSZ nhưng ~10 MB RSS. Trần thật là <code>threads-max</code> và <code>pids.max</code> của container.</li>
<li>Bộ nhớ chung giúp luồng phối hợp rẻ — và cũng sinh ra race condition và sập cả tiến trình (Chương 5).</li>
<li>Luồng mức người dùng (M:N) như luồng ảo Java chạy 10 000 lần chờ trên ~31 luồng nhân: đo được 2,07 s so với 6,6 s.</li>
</ul>
${L('https://man7.org/linux/man-pages/man7/pthreads.7.html', '📄', 'man 7 pthreads', 'Những gì các luồng dùng chung và những gì riêng từng luồng, theo POSIX và Linux.', 'Mở')}
${L('https://pages.cs.wisc.edu/~remzi/OSTEP/threads-intro.pdf', '📘', 'OSTEP — Nhập môn đồng thời', 'Vì sao có luồng và luồng thật ra là gì (chương miễn phí).', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 3.2 — Lập lịch ───────────────────────── */
    {
      title: '3.2 — Scheduling: FIFO, RR, MLFQ, CFS and EEVDF (with nice measured)|||3.2 — Lập lịch: FIFO, RR, MLFQ, CFS và EEVDF (đo nice thật)',
      slug: 'os-3-2-lap-lich',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Thông lượng vs đáp ứng; FCFS, SJF/SRTF, round robin, MLFQ tính bằng số và chạy trong mô phỏng; Linux từ CFS sang EEVDF (6.6); trọng số nice đo thật (75%/25%), nice vô tác dụng khi còn lõi rảnh, và độ trễ thức dậy của việc tương tác.',
      content: `${G32}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>More runnable threads than cores: who runs next, and for how long?</h2>
<p class="lead">Your laptop has a few cores and a few thousand threads. Most are asleep, but whenever more threads are <em>ready</em> than there are cores, the kernel's scheduler must choose. Every policy trades two things that pull in opposite directions: finishing work efficiently (<strong>throughput, turnaround</strong>) and reacting quickly (<strong>response time</strong>). This lesson walks the classic policies with numbers, then measures what Linux actually does — including the <code>nice</code> knob you can turn today.</p>

<h3>Three numbers that every exam (and every SRE) uses</h3>
<ul>
<li><strong>Turnaround</strong> = finish time − arrival time: how long the whole job took.</li>
<li><strong>Waiting</strong> = time spent ready but not running.</li>
<li><strong>Response</strong> = first time on the CPU − arrival: how long until it <em>started</em> (what a user feels).</li>
</ul>
<p>The textbook set: P1 arrives at 0 needing 8 units of CPU, P2 at 1 needing 4, P3 at 2 needing 9, P4 at 3 needing 5. These averages come from the same engine as the simulator below (you can reproduce every one):</p>
<table>
<tr><th>Policy</th><th>Order on the CPU</th><th>Avg waiting</th><th>Avg response</th></tr>
<tr><td>FCFS (first come, first served)</td><td>P1 0–8 · P2 8–12 · P3 12–21 · P4 21–26</td><td>8.75</td><td>8.75</td></tr>
<tr><td>SJF (shortest job first, non-preemptive)</td><td>P1 0–8 · P2 8–12 · P4 12–17 · P3 17–26</td><td>7.75</td><td>7.75</td></tr>
<tr><td>SRTF (shortest remaining time, preemptive)</td><td>P1 0–1 · P2 1–5 · P4 5–10 · P1 10–17 · P3 17–26</td><td><strong>6.5</strong></td><td>4.25</td></tr>
<tr><td>Round robin, quantum 4</td><td>P1 P2 P3 P4 P1 P3 P4 P3 in slices of ≤4</td><td>11.75</td><td>4.5</td></tr>
<tr><td>Round robin, quantum 2</td><td>slices of 2, 12 switches</td><td>12.75</td><td><strong>2.0</strong></td></tr>
</table>
${lab('scheduler', 'textbook', 'en', 'The textbook set. Switch the policy between FCFS, SJF, SRTF and RR and watch the Gantt chart and the three averages change.', { tour: 'sched-policies' })}
<p>Read the table as a law, not trivia: <strong>SRTF minimises average waiting but needs to know the future</strong> (how long each job will run), which a real OS never does. <strong>Round robin has the worst waiting but the best response</strong> — every job starts quickly. Shrinking the quantum improves response further and costs more switches (lesson 3.3 measures what a switch costs).</p>

<h3>FCFS and the convoy effect</h3>
<p>One long job at the front of the queue makes every short job behind it wait. With a 14-unit <code>BUILD</code> in front of <code>curl</code>, <code>ls</code> and <code>git</code>, FCFS gives an average wait of 10.25 units; round robin with quantum 2 gives 2.25.</p>
${lab('scheduler', 'convoy', 'en', 'A long build at the head of an FCFS queue: three one-second commands wait behind it. Switch to RR and see them escape.')}

<h3>MLFQ: learn from behaviour instead of predicting the future</h3>
<p>The multi-level feedback queue gives up guessing job lengths and <em>watches</em> instead: a thread that burns its whole quantum is probably batch work and drops to a lower-priority queue; a thread that gives the CPU back early to wait for I/O (an editor, a shell, a web handler) stays high. In the simulator's "interactive + batch" set, MLFQ gives an average response of 1 unit versus 4.33 for FCFS. Its known weakness — long jobs can starve under a stream of short ones — is why real MLFQs periodically boost everyone back to the top (the simulator deliberately has no boost, so you can see starvation).</p>
${lab('scheduler', 'interactive', 'en', 'An interactive editor (short CPU bursts, then I/O) against video encoding and a backup. MLFQ keeps the editor responsive; compare with FCFS and RR.')}

<h3>Linux: CFS (2007–2023), then EEVDF (since 6.6)</h3>
<p>Linux's normal policy (<code>SCHED_OTHER</code>) does not use fixed queues. <strong>CFS</strong>, the Completely Fair Scheduler, kept for each task a <em>virtual runtime</em> — CPU time used, scaled by its weight — and always ran the task with the smallest one. Since Linux 6.6 (2023) the same fairness is implemented by <strong>EEVDF</strong> (Earliest Eligible Virtual Deadline First): each task gets a time slice and a virtual deadline, and among tasks that are owed CPU ("eligible") the earliest deadline runs. Weights work as before. The lab image runs kernel 7.0, so you can read the live values:</p>
${run('c32-lich', 'taskset -c 0 nice -n 5 ./hog w')}
<p><code>policy 0</code> is <code>SCHED_OTHER</code>; <code>prio 125</code> is 120 + nice 5; <code>se.slice 2800000</code> ns = a 2.8 ms slice on this 10-CPU machine (the kernel scales a small base slice up with the number of CPUs); <code>se.load.weight 343040</code> = 335 × 1024 — the weight of nice 5. Nice 0 is 1024; each nice step changes the weight by about ×1.25.</p>

<h3>nice, measured — and the case where it does nothing</h3>
<p><code>hog.c</code> spins until it receives SIGTERM, then prints how much CPU it got. First two hogs on this 10-core machine, one at nice 5:</p>
${src('ch03/hog.c', 'c')}
${run('c32-lich', './hog nice0 & ./hog nice5-free', 1, { drop: /^# / })}
<p>4.11 s each. <strong>nice changed nothing</strong>, because there was no contention: each hog had a core to itself. Now pin both to CPU 0 with <code>taskset</code> so they must share:</p>
${run('c32-lich', 'taskset -c 0 ./hog nice0 & taskset -c 0 nice -n 5', 2)}
<p>3.01 s vs 0.99 s — exactly 1024 : 335 ≈ <strong>75% : 25%</strong>. Nice 19 (weight 15) against nice 0: 3.94 s vs 0.06 s, about 98.5% : 1.5%. Nice is a <em>share under contention</em>, not a cap. The simulator's CFS preset shows the same 3 : 1 split:</p>
${lab('scheduler', 'nice', 'en', 'Two equal jobs, nice 0 vs nice 5, on one core under simplified CFS: the nice-0 job gets about three slices for every one of the other.')}

<div class="pitfall co-tieu-de">
<p><strong>"I reniced the backup, so it can't hurt the API" — on an idle box it still takes a whole core.</strong> nice only decides who wins when tasks compete for the <em>same</em> CPU. With free cores, a nice-19 job runs at full speed (above: 4.11 s of CPU in 4 s). If you need a ceiling — "this job may use at most half a core" — that is a cgroup CPU quota (<code>cpu.max</code>, Docker <code>--cpus</code>), lesson 3.4. And nice cannot fix memory or disk contention at all.</p>
</div>

<h3>Response time, measured: waking up next to CPU hogs</h3>
<p>A latency-sensitive thread mostly sleeps and wants the CPU <em>immediately</em> when it wakes — like a request handler that has just received its database reply. <code>wakeup.c</code> sleeps 1 ms, 2 000 times, and records how late each wake-up was. All runs on CPU 0:</p>
${run('c32-lich', 'taskset -c 0 ./wakeup', 1, { drop: /^# / })}
${run('c32-lich', 'for i in 1 2 3; do taskset -c 0 ./hog bg', 3)}
<p>With three nice-0 hogs on the same core the p99 delay is <strong>3.0 ms — one 2.8 ms slice</strong>: sometimes the sleeper must wait for a running hog's slice to end. With the hogs at nice 19 the p99 falls to 1.3 ms. Switching the sleeper to the real-time policy <code>SCHED_FIFO</code> (<code>chrt -f</code>) makes it preempt every normal task at once: median 1 µs, p99 29 µs. (Two honest notes: the "alone" median is <em>higher</em> because an idle core drops into a sleep state and takes time to wake — in a VM, the whole virtual CPU is halted; and single maxima are noisy in a VM, so trust the p99.)</p>

<div class="pitfall co-tieu-de">
<p><strong>Real-time priority is not a speed button.</strong> A <code>SCHED_FIFO</code> thread runs until it blocks or yields; if it spins, nothing of normal priority runs on that core. Linux keeps a safety valve — by default real-time tasks may use at most 950 ms of every second (<code>sched_rt_runtime_us</code> 950000 of <code>sched_rt_period_us</code> 1000000) — but a runaway RT thread will still freeze that core for the rest. Use it for audio and control loops, never for a web server.</p>
</div>

<h3>If you have done OSG202 lesson 2.4</h3>
<p>That lesson drills the Gantt-chart calculations the exam asks for: FCFS, SJF, SRTF, priority and RR with averages. Use the simulator here to check every one of your hand calculations, then remember what the measurements added: Linux does none of those policies literally; it shares by weight (nice) with a slice of a few milliseconds.</p>
${L(OSG('osg202-2-4-lap-lich-tinh-toan'), '🎓', 'OSG202 · 2.4 — Scheduling algorithms, calculated', 'Exam-style Gantt charts and averages.', 'Open')}

<h3>🧪 Practice (20 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> on a 2-vCPU VPS a nightly report job makes the API slow. A teammate proposes "just renice the report to 19". You want numbers before agreeing.</p>
<ol>
<li>In the lab, compute FCFS, SJF, SRTF and RR (q = 2) for the textbook set on paper, then check each in the simulator. Which policy has the best response, which the best waiting?</li>
<li>Run two <code>./hog</code> on the free machine with one of them at nice 19. Does nice change their CPU time?</li>
<li>Now pin both with <code>taskset -c 0</code> and repeat for nice 5 and nice 19. Do the CPU times match 1024 : 335 and 1024 : 15?</li>
<li>Run <code>taskset -c 0 ./wakeup</code> next to three hogs at nice 0, then at nice 19. Write down the p99.</li>
</ol>
<p><strong>Done when:</strong> you can state, with your numbers, that nice only matters under contention (so renicing helps the API only if both actually share a core), and that a nice-19 neighbour gives the latency-sensitive thread a lower p99 than a nice-0 one.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['turnaround / waiting / response', 'Finish − arrival / time spent ready but not running / first run − arrival.'],
  ['convoy effect (hiệu ứng đoàn xe)', 'Short jobs stuck behind one long job under FCFS.'],
  ['quantum / time slice', 'How long a task may run before the scheduler may switch: smaller = better response, more switches.'],
  ['MLFQ', 'Multi-level feedback queue: demote tasks that use their whole quantum, keep I/O-bound tasks high.'],
  ['vruntime / weight', 'CFS/EEVDF bookkeeping: CPU time scaled by weight; nice 0 = 1024, nice 5 = 335, nice 19 = 15.'],
  ['EEVDF', 'Linux’s fair scheduler since 6.6: earliest virtual deadline among eligible tasks, per-task slice (2.8 ms here).'],
  ['SCHED_FIFO', 'A real-time policy: preempts all normal tasks and runs until it blocks.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Scheduling trades turnaround/waiting against response: SRTF has the best waiting (6.5 on the textbook set) but needs the future; RR q = 2 has the best response (2.0).</li>
<li>FCFS suffers the convoy effect; MLFQ approximates SJF by watching behaviour and keeps interactive tasks responsive.</li>
<li>Linux shares the CPU by weight: CFS until 6.5, EEVDF since 6.6, with a few-ms slice (2.8 ms here).</li>
<li>Measured: nice 0 vs nice 5 on one core = 75% : 25%; nice 19 = 98.5% : 1.5%; on free cores nice does nothing.</li>
<li>A sleeper next to CPU hogs waits up to about one slice (p99 3.0 ms); SCHED_FIFO cuts it to µs but can freeze a core.</li>
</ul>
${L('https://docs.kernel.org/scheduler/sched-eevdf.html', '📄', 'kernel.org — EEVDF Scheduler', 'The current Linux fair scheduler, from the kernel docs.', 'Open')}
${L('https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-sched-mlfq.pdf', '📘', 'OSTEP — Multi-level feedback', 'MLFQ rules, starvation and the priority boost (free chapter).', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Số luồng sẵn sàng nhiều hơn số lõi: ai chạy tiếp, và chạy bao lâu?</h2>
<p class="lead">Laptop của bạn có vài lõi và vài nghìn luồng. Phần lớn đang ngủ, nhưng hễ số luồng <em>sẵn sàng</em> nhiều hơn số lõi là bộ lập lịch của nhân phải chọn. Mọi chính sách đều đánh đổi hai thứ kéo về hai phía: làm xong việc hiệu quả (<strong>thông lượng, thời gian hoàn thành</strong>) và phản ứng nhanh (<strong>thời gian đáp ứng</strong>). Bài này đi qua các chính sách kinh điển bằng con số, rồi đo xem Linux thật sự làm gì — kể cả cái núm <code>nice</code> bạn vặn được ngay hôm nay.</p>

<h3>Ba con số mà đề thi (và mọi kỹ sư vận hành) đều dùng</h3>
<ul>
<li><strong>Turnaround (thời gian hoàn thành)</strong> = lúc xong − lúc đến: cả việc mất bao lâu.</li>
<li><strong>Waiting (thời gian chờ)</strong> = thời gian sẵn sàng mà không được chạy.</li>
<li><strong>Response (thời gian đáp ứng)</strong> = lần đầu lên CPU − lúc đến: bao lâu mới <em>bắt đầu</em> (thứ người dùng cảm thấy).</li>
</ul>
<p>Bộ đề giáo trình: P1 đến lúc 0 cần 8 đơn vị CPU, P2 lúc 1 cần 4, P3 lúc 2 cần 9, P4 lúc 3 cần 5. Các trung bình dưới đây ra từ đúng bộ máy của mô phỏng bên dưới (bạn tái hiện được từng con số):</p>
<table>
<tr><th>Chính sách</th><th>Thứ tự trên CPU</th><th>Chờ TB</th><th>Đáp ứng TB</th></tr>
<tr><td>FCFS (đến trước phục vụ trước)</td><td>P1 0–8 · P2 8–12 · P3 12–21 · P4 21–26</td><td>8,75</td><td>8,75</td></tr>
<tr><td>SJF (việc ngắn trước, không giành)</td><td>P1 0–8 · P2 8–12 · P4 12–17 · P3 17–26</td><td>7,75</td><td>7,75</td></tr>
<tr><td>SRTF (còn lại ngắn nhất, có giành)</td><td>P1 0–1 · P2 1–5 · P4 5–10 · P1 10–17 · P3 17–26</td><td><strong>6,5</strong></td><td>4,25</td></tr>
<tr><td>Round robin, quantum 4</td><td>P1 P2 P3 P4 P1 P3 P4 P3, mỗi lát ≤4</td><td>11,75</td><td>4,5</td></tr>
<tr><td>Round robin, quantum 2</td><td>lát 2, 12 lần chuyển</td><td>12,75</td><td><strong>2,0</strong></td></tr>
</table>
${lab('scheduler', 'textbook', 'vi', 'Bộ đề giáo trình. Đổi chính sách giữa FCFS, SJF, SRTF và RR, nhìn sơ đồ Gantt và ba con số trung bình thay đổi.', { tour: 'sched-policies' })}
<p>Đọc bảng như một định luật chứ đừng như chuyện vặt: <strong>SRTF cho thời gian chờ trung bình nhỏ nhất nhưng cần biết trước tương lai</strong> (mỗi việc sẽ chạy bao lâu) — điều mà hệ điều hành thật không bao giờ biết. <strong>Round robin chờ lâu nhất nhưng đáp ứng tốt nhất</strong> — việc nào cũng được bắt đầu sớm. Thu nhỏ quantum thì đáp ứng còn tốt hơn nữa, đổi lại tốn thêm lần chuyển (bài 3.3 đo một lần chuyển tốn bao nhiêu).</p>

<h3>FCFS và hiệu ứng đoàn xe</h3>
<p>Một việc dài đứng đầu hàng bắt mọi việc ngắn phía sau phải chờ. Với một <code>BUILD</code> 14 đơn vị đứng trước <code>curl</code>, <code>ls</code> và <code>git</code>, FCFS cho thời gian chờ trung bình 10,25 đơn vị; round robin quantum 2 cho 2,25.</p>
${lab('scheduler', 'convoy', 'vi', 'Một lần build dài đứng đầu hàng FCFS: ba lệnh một giây phải chờ sau nó. Đổi sang RR để thấy chúng thoát ra.')}

<h3>MLFQ: học từ hành vi thay vì đoán tương lai</h3>
<p>Hàng đợi phản hồi đa mức (MLFQ) bỏ việc đoán độ dài và chuyển sang <em>quan sát</em>: luồng nào đốt hết quantum có lẽ là việc chạy nền và bị hạ xuống hàng ưu tiên thấp hơn; luồng nào trả CPU sớm để chờ I/O (trình soạn thảo, shell, handler web) thì ở lại hàng cao. Trong bộ "tương tác + chạy nền" của mô phỏng, MLFQ cho đáp ứng trung bình 1 đơn vị so với 4,33 của FCFS. Điểm yếu đã biết — việc dài có thể bị bỏ đói dưới một dòng việc ngắn liên tục — là lý do MLFQ thật định kỳ đẩy mọi việc lên lại hàng đầu (boost); mô phỏng cố ý không có boost để bạn thấy được đói.</p>
${lab('scheduler', 'interactive', 'vi', 'Một trình soạn thảo tương tác (đốt CPU ngắn rồi chờ I/O) đấu với mã hoá video và sao lưu. MLFQ giữ trình soạn thảo nhanh nhạy; so với FCFS và RR.')}

<h3>Linux: CFS (2007–2023), rồi EEVDF (từ 6.6)</h3>
<p>Chính sách thường của Linux (<code>SCHED_OTHER</code>) không dùng hàng đợi cố định. <strong>CFS</strong> (Completely Fair Scheduler — bộ lập lịch hoàn toàn công bằng) giữ cho mỗi task một <em>thời gian chạy ảo (vruntime)</em> — thời gian CPU đã dùng, chia theo trọng số — và luôn chạy task có vruntime nhỏ nhất. Từ Linux 6.6 (2023), cùng sự công bằng ấy được hiện thực bằng <strong>EEVDF</strong> (Earliest Eligible Virtual Deadline First — hạn ảo sớm nhất trong số task đủ điều kiện): mỗi task có một lát thời gian và một hạn chót ảo, và trong các task đang "được nợ" CPU (eligible), task có hạn sớm nhất được chạy. Trọng số vẫn như cũ. Ảnh lab chạy nhân 7.0, nên bạn đọc được giá trị sống:</p>
${run('c32-lich', 'taskset -c 0 nice -n 5 ./hog w')}
<p><code>policy 0</code> là <code>SCHED_OTHER</code>; <code>prio 125</code> là 120 + nice 5; <code>se.slice 2800000</code> ns = lát 2,8 ms trên máy 10 CPU này (nhân nhân một lát gốc nhỏ theo số CPU); <code>se.load.weight 343040</code> = 335 × 1024 — trọng số của nice 5. Nice 0 là 1024; mỗi nấc nice đổi trọng số khoảng ×1,25.</p>

<h3>nice, đo thật — và trường hợp nó chẳng làm gì</h3>
<p><code>hog.c</code> quay vòng tới khi nhận SIGTERM rồi in ra nó được bao nhiêu CPU. Đầu tiên hai con "hog" trên máy 10 lõi này, một con ở nice 5:</p>
${src('ch03/hog.c', 'c')}
${run('c32-lich', './hog nice0 & ./hog nice5-free', 1, { drop: /^# / })}
<p>Mỗi con 4,11 s. <strong>nice chẳng đổi gì</strong>, vì không có tranh chấp: mỗi con có riêng một lõi. Giờ ghim cả hai lên CPU 0 bằng <code>taskset</code> để chúng buộc phải chia nhau:</p>
${run('c32-lich', 'taskset -c 0 ./hog nice0 & taskset -c 0 nice -n 5', 2)}
<p>3,01 s so với 0,99 s — đúng 1024 : 335 ≈ <strong>75% : 25%</strong>. Nice 19 (trọng số 15) đấu nice 0: 3,94 s so với 0,06 s, khoảng 98,5% : 1,5%. Nice là <em>phần chia khi có tranh chấp</em>, không phải trần. Preset CFS của mô phỏng cho đúng tỉ lệ 3 : 1 ấy:</p>
${lab('scheduler', 'nice', 'vi', 'Hai việc như nhau, nice 0 vs nice 5, trên một lõi với CFS rút gọn: việc nice 0 được khoảng ba lát cho mỗi một lát của việc kia.')}

<div class="pitfall co-tieu-de">
<p><strong>"Tôi đã renice bản sao lưu rồi, nó không làm phiền API được" — trên máy rảnh nó vẫn chiếm trọn một lõi.</strong> nice chỉ quyết định ai thắng khi các task tranh <em>cùng một</em> CPU. Còn lõi rảnh thì việc nice 19 vẫn chạy hết tốc lực (ở trên: 4,11 s CPU trong 4 s). Nếu cần một cái trần — "việc này chỉ được dùng tối đa nửa lõi" — thì đó là CPU quota của cgroup (<code>cpu.max</code>, Docker <code>--cpus</code>), bài 3.4. Và nice hoàn toàn không giải quyết được tranh chấp bộ nhớ hay đĩa.</p>
</div>

<h3>Thời gian đáp ứng, đo thật: thức dậy cạnh những con "hog"</h3>
<p>Một luồng nhạy độ trễ phần lớn thời gian ngủ và muốn có CPU <em>ngay lập tức</em> khi thức — như một handler vừa nhận được kết quả từ cơ sở dữ liệu. <code>wakeup.c</code> ngủ 1 ms, 2 000 lần, và ghi lại mỗi lần thức muộn bao nhiêu. Mọi lần chạy đều trên CPU 0:</p>
${run('c32-lich', 'taskset -c 0 ./wakeup', 1, { drop: /^# / })}
${run('c32-lich', 'for i in 1 2 3; do taskset -c 0 ./hog bg', 3)}
<p>Với ba con hog nice 0 cùng lõi, trễ p99 là <strong>3,0 ms — đúng một lát 2,8 ms</strong>: đôi khi luồng ngủ phải chờ một con hog đang chạy dùng hết lát của nó. Hạ các con hog xuống nice 19 thì p99 còn 1,3 ms. Chuyển luồng ngủ sang chính sách thời gian thực <code>SCHED_FIFO</code> (<code>chrt -f</code>) thì nó giành CPU khỏi mọi task thường ngay tức thì: trung vị 1 µs, p99 29 µs. (Hai ghi chú trung thực: trung vị khi "chạy một mình" lại <em>cao hơn</em> vì một lõi rảnh sẽ rơi vào trạng thái ngủ và cần thời gian để tỉnh — trong VM thì cả CPU ảo bị dừng hẳn; và giá trị max đơn lẻ trong VM rất nhiễu, nên hãy tin p99.)</p>

<div class="pitfall co-tieu-de">
<p><strong>Ưu tiên thời gian thực không phải nút tăng tốc.</strong> Một luồng <code>SCHED_FIFO</code> chạy tới khi nó bị chặn hay tự nhường; nếu nó quay vòng, không task thường nào chạy được trên lõi đó. Linux có một van an toàn — mặc định task thời gian thực chỉ được dùng tối đa 950 ms mỗi giây (<code>sched_rt_runtime_us</code> 950000 trên <code>sched_rt_period_us</code> 1000000) — nhưng một luồng RT chạy mất kiểm soát vẫn làm lõi đó gần như đóng băng. Dùng nó cho âm thanh và vòng điều khiển, đừng bao giờ dùng cho máy chủ web.</p>
</div>

<h3>Nếu bạn đã học OSG202 bài 2.4</h3>
<p>Bài đó luyện các phép tính sơ đồ Gantt mà đề thi hỏi: FCFS, SJF, SRTF, ưu tiên và RR kèm trung bình. Dùng mô phỏng ở đây để kiểm từng phép tính tay của bạn, rồi nhớ những gì số đo bổ sung: Linux không làm đúng nguyên văn chính sách nào trong đó cả; nó chia theo trọng số (nice) với lát vài mili giây.</p>
${L(OSG('osg202-2-4-lap-lich-tinh-toan'), '🎓', 'OSG202 · 2.4 — Thuật toán lập lịch, tính bằng số', 'Sơ đồ Gantt và trung bình kiểu đề thi.', 'Mở')}

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> trên một VPS 2 vCPU, job báo cáo chạy đêm làm API chậm. Một bạn đề xuất "cứ renice báo cáo xuống 19". Bạn muốn có số trước khi gật đầu.</p>
<ol>
<li>Trong lab, tính tay FCFS, SJF, SRTF và RR (q = 2) cho bộ đề giáo trình, rồi kiểm từng cái trong mô phỏng. Chính sách nào đáp ứng tốt nhất, chính sách nào chờ ít nhất?</li>
<li>Chạy hai <code>./hog</code> trên máy rảnh, một con ở nice 19. nice có đổi thời gian CPU của chúng không?</li>
<li>Giờ ghim cả hai bằng <code>taskset -c 0</code> và lặp lại với nice 5 và nice 19. Thời gian CPU có khớp 1024 : 335 và 1024 : 15 không?</li>
<li>Chạy <code>taskset -c 0 ./wakeup</code> cạnh ba con hog nice 0, rồi nice 19. Ghi lại p99.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn khẳng định được, bằng số của mình, rằng nice chỉ có tác dụng khi có tranh chấp (nên renice chỉ giúp API nếu hai bên thật sự chung một lõi), và hàng xóm nice 19 cho luồng nhạy độ trễ p99 thấp hơn hàng xóm nice 0.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['turnaround / waiting / response', 'Lúc xong − lúc đến / thời gian sẵn sàng mà không được chạy / lần chạy đầu − lúc đến.'],
  ['convoy effect (hiệu ứng đoàn xe)', 'Việc ngắn kẹt sau một việc dài khi dùng FCFS.'],
  ['quantum / time slice (lát thời gian)', 'Một task được chạy bao lâu trước khi bộ lập lịch có thể chuyển: nhỏ hơn = đáp ứng tốt hơn, nhiều lần chuyển hơn.'],
  ['MLFQ (hàng đợi phản hồi đa mức)', 'Hạ cấp task dùng hết quantum, giữ task hay chờ I/O ở hàng cao.'],
  ['vruntime / weight (trọng số)', 'Sổ sách của CFS/EEVDF: thời gian CPU chia theo trọng số; nice 0 = 1024, nice 5 = 335, nice 19 = 15.'],
  ['EEVDF', 'Bộ lập lịch công bằng của Linux từ 6.6: hạn ảo sớm nhất trong các task đủ điều kiện, lát riêng mỗi task (ở đây 2,8 ms).'],
  ['SCHED_FIFO', 'Chính sách thời gian thực: giành CPU khỏi mọi task thường và chạy tới khi bị chặn.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Lập lịch đánh đổi thời gian hoàn thành/chờ với đáp ứng: SRTF chờ ít nhất (6,5 với bộ giáo trình) nhưng cần biết tương lai; RR q = 2 đáp ứng tốt nhất (2,0).</li>
<li>FCFS dính hiệu ứng đoàn xe; MLFQ xấp xỉ SJF bằng cách quan sát hành vi và giữ cho việc tương tác nhanh nhạy.</li>
<li>Linux chia CPU theo trọng số: CFS tới 6.5, EEVDF từ 6.6, với lát vài mili giây (ở đây 2,8 ms).</li>
<li>Đo thật: nice 0 vs nice 5 trên một lõi = 75% : 25%; nice 19 = 98,5% : 1,5%; trên lõi rảnh nice chẳng làm gì.</li>
<li>Một luồng ngủ cạnh các con hog phải chờ tới khoảng một lát (p99 3,0 ms); SCHED_FIFO kéo xuống mức µs nhưng có thể làm đứng cả lõi.</li>
</ul>
${L('https://docs.kernel.org/scheduler/sched-eevdf.html', '📄', 'kernel.org — EEVDF Scheduler', 'Bộ lập lịch công bằng hiện tại của Linux, từ tài liệu nhân.', 'Mở')}
${L('https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-sched-mlfq.pdf', '📘', 'OSTEP — Multi-level feedback', 'Luật MLFQ, đói và cú đẩy ưu tiên (chương miễn phí).', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 3.3 — Chuyển ngữ cảnh ───────────────────────── */
    {
      title: '3.3 — Context switches and their cost, measured|||3.3 — Chuyển ngữ cảnh và cái giá của nó, đo thật',
      slug: 'os-3-3-context-switch',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Một lần chuyển ngữ cảnh làm gì; đếm bằng vmstat, perf stat, pidstat và /proc/<pid>/status (tự nguyện vs bị giành); đo ~1 µs mỗi lần trên một lõi và ~12× khi qua lõi khác; khi nào thêm luồng không sao và khi nào làm chậm gấp 9 lần.',
      content: `${G33}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>Switching the CPU from one thread to another is work too</h2>
<p class="lead">Every policy in lesson 3.2 assumed switching was free. It is not: the kernel must save one thread, choose another and restore it, and the caches the old thread had warmed up are now partly useless. How much does one switch cost, how do you count them on a live server, and when is "too many context switches" the real problem — rather than a scary number on a dashboard?</p>

<h3>What a context switch does</h3>
<ol>
<li>The running thread enters the kernel — because it blocked (read, sleep, lock: a <strong>voluntary</strong> switch) or because a timer interrupt or a waking task preempted it (an <strong>involuntary</strong> switch).</li>
<li>The kernel saves its registers (program counter, stack pointer, general registers) into its <code>task_struct</code>.</li>
<li>The scheduler picks the next task (lesson 3.2).</li>
<li>If the next task belongs to a <em>different process</em>, the kernel also switches the page tables, so address translations cached in the TLB are lost (Chapter 7). Threads of the same process skip this step.</li>
<li>It restores the next task's registers and returns to user mode — where its data is probably no longer in the CPU caches.</li>
</ol>
<p>Steps 1–5 are the <em>direct</em> cost; the cold caches afterwards are the <em>indirect</em> cost, and often the bigger one.</p>

<h3>Counting switches: vmstat</h3>
<p><code>vmstat 1</code> prints one line per second; the <code>cs</code> column is context switches per second for the whole machine (ignore the first line: it is an average since boot). An idle lab:</p>
${run('c33-cs', 'vmstat 1 3')}
<p>About a thousand per second. Now start <code>pingpong</code> — two processes that hand one byte back and forth through two pipes, so each must sleep until the other answers:</p>
${src('ch03/pingpong.c', 'c')}
${run('c33-cs', './pingpong 4000000')}
<p>From ~1 000 to <strong>~180 000–217 000 switches per second</strong>, and the <code>sy</code> (kernel) share of CPU went up. This is what a chatty design — two components that ping each other for every tiny item — looks like from the outside.</p>

<h3>The price of one switch</h3>
<p>Pinned to one core with <code>taskset -c 0</code>, every round trip is exactly two switches (parent → child → parent). Then let the two processes sit on two different cores:</p>
${run('c33-cs', 'taskset -c 0 ./pingpong 200000', 2)}
<p>On one core: about <strong>2 µs per round trip, ~1 µs per switch</strong> — including the two pipe syscalls on each side. On two cores it is <strong>~12× slower</strong>: the partner's core goes idle while it waits, and waking an idle core needs an inter-processor interrupt and the core leaving its sleep state (in a VM, the hypervisor must also wake the virtual CPU). Handing work between threads on different cores can cost far more than the switch itself. <code>perf stat</code> confirms the arithmetic straight from the kernel's counters:</p>
${run('c33-cs', 'perf stat')}
<p>100 000 round trips, <strong>200 006 context switches</strong>, one migration between cores. (In the lab, <code>perf</code> needs <code>--cap-add PERFMON --security-opt seccomp=unconfined</code> on <code>docker run</code>; on Docker Desktop only software events like these work, not hardware cache counters.)</p>
${lab('scheduler', 'rr', 'en', 'Round robin with quantum 2. Now set "context switch" cost to 1: every switch eats a tick, the last job finishes at 20 instead of 13 and average waiting rises from 5 to 8.25. Try quantum 1 vs 4.')}

<h3>Voluntary or involuntary? Read /proc/&lt;pid&gt;/status</h3>
<p>The kernel counts both kinds for every task. Two CPU hogs forced to share one core, for 3 seconds, then a process that just sleeps:</p>
${run('c33-cs', 'taskset -c 0 ./hog A')}
${run('c33-cs', 'sleep 2 & S=$!')}
<p>The hog was <strong>preempted 510 times</strong> (nonvoluntary): 3 s of shared CPU in ~2.8 ms slices, half of them for each hog. It almost never gave the CPU up by itself. <code>sleep</code> switched exactly once, voluntarily. <code>pidstat -w</code> shows the same per second, live:</p>
${run('c33-cs', 'taskset -c 0 ./pingpong 3000000', 1, { drop: /^# / })}
<p>The pingpong parent does ~240 000 of each per second. Voluntary: it blocks in <code>read</code>. Involuntary: when it <code>write</code>s, the kernel wakes the child on the same core and lets it preempt the writer immediately.</p>
<div class="callout warn"><p><strong>How to read the two counters on a real server:</strong> high <code>cswch/s</code> (voluntary) = the program waits a lot — I/O, locks, sleeps — which is normal for a web server. High <code>nvcswch/s</code> (involuntary) = it wanted to keep running but was taken off the CPU: there are more runnable threads than cores, or a CPU quota is throttling you (lesson 3.4).</p></div>

<h3>More threads: when it costs nothing, and when it costs 9×</h3>
<p><code>crowd.c</code> splits one fixed job across T threads on 4 cores. In <code>cpu</code> mode each thread counts on its own; in <code>lock</code> mode every step takes a shared mutex — the shape of "update a shared counter or cache entry per request":</p>
${src('ch03/crowd.c', 'c')}
${run('c33-cs', 'for t in 1 4 64 512')}
<p>Independent CPU work: 4 threads on 4 cores give the expected 3.9× speedup, and 512 threads on the same 4 cores are only ~20% slower than 4. A switch costs ~1 µs and happens every few ms, so oversubscription alone is cheap. Now the same 4 cores with a shared lock:</p>
${run('c33-cs', 'for t in 1 4 64; do perf stat')}
<p><strong>One thread: 118 ms. 64 threads: 1 086 ms — 9× slower, with 230 000 context switches and 4.3 s of CPU burned instead of 0.12 s.</strong> Each time the lock is taken, the waiters go to sleep in the kernel (a futex) and must be woken and rescheduled; the lock and the counter bounce between the caches of different cores. Adding threads to work that serialises on one lock makes it slower <em>and</em> more expensive. Chapter 5 fixes this properly (shorter critical sections, atomics, sharding).</p>

<div class="pitfall co-tieu-de">
<p><strong>"The service is slow — raise the thread pool from 50 to 500."</strong> If the threads mostly <em>wait</em> on independent I/O, more threads can help. If they compete for one lock, one connection pool or the CPU, you just measured the result: more switches, more CPU, less throughput. And the opposite mistake: seeing "200k cs/s" on a dashboard and panicking. A context-switch rate means nothing without a baseline — compare with the same service on a normal day, and look at the split between voluntary and involuntary before blaming the scheduler.</p>
</div>

<h3>🧪 Practice (20 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> after someone raised a worker pool from 50 to 500 threads, the API's p99 got <em>worse</em>. You want to show the mechanism on a small scale before the post-mortem.</p>
<ol>
<li>Run <code>vmstat 1 5</code> on the idle lab and note the <code>cs</code> baseline. Then run <code>./pingpong 4000000 &amp;</code> and watch <code>cs</code> and <code>sy</code> change.</li>
<li>Measure one switch: <code>taskset -c 0 ./pingpong 200000</code>, then <code>taskset -c 0,1</code>. Confirm with <code>perf stat -e context-switches</code> that switches ≈ 2 × round trips.</li>
<li>Put two <code>./hog</code> on one core for 3 s and read <code>voluntary_ctxt_switches</code>/<code>nonvoluntary_ctxt_switches</code> in <code>/proc/&lt;pid&gt;/status</code>. Which one grows, and why?</li>
<li>Run <code>crowd</code> with 1, 4, 64 threads in <code>cpu</code> and in <code>lock</code> mode under <code>perf stat -e context-switches,task-clock</code>. Plot time vs threads for both.</li>
</ol>
<p><strong>Done when:</strong> you can state your machine's cost of one switch (same core vs cross-core), and show with your own numbers that more threads leave independent work almost unchanged but make lock-bound work several times slower and more CPU-hungry.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['context switch (chuyển ngữ cảnh)', 'Saving one task’s registers and restoring another’s so it can run on this CPU.'],
  ['voluntary switch', 'The task gave up the CPU because it blocked: I/O, sleep, lock. <code>voluntary_ctxt_switches</code>, <code>cswch/s</code>.'],
  ['involuntary switch', 'The task was preempted: slice used up or a waking task took over. <code>nonvoluntary_ctxt_switches</code>, <code>nvcswch/s</code>.'],
  ['vmstat cs', 'Machine-wide context switches per second (first line = average since boot).'],
  ['cpu-migration', 'A task moved from one CPU to another; its cache contents stay behind.'],
  ['IPI (inter-processor interrupt)', 'How one core wakes another — part of why cross-core hand-offs are slower.'],
  ['oversubscription', 'More runnable threads than cores: cheap for independent work, costly with shared locks.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>A context switch saves and restores registers, may switch page tables, and leaves cold caches behind.</li>
<li>Measured: ~1 µs per switch on one core (pipe syscalls included); a cross-core hand-off ~12× more.</li>
<li>Count them with <code>vmstat</code> (whole machine), <code>pidstat -w</code> and <code>/proc/&lt;pid&gt;/status</code> (per task), <code>perf stat</code> (per run).</li>
<li>Voluntary = waiting (normal for servers); involuntary = wanted the CPU but lost it (too many runnable threads or throttling).</li>
<li>512 threads of independent work cost ~20% over 4; 64 threads on one lock cost 9× the time and 36× the CPU of one thread.</li>
</ul>
${L('https://man7.org/linux/man-pages/man5/proc_pid_status.5.html', '📄', 'man 5 proc_pid_status', 'Every field of /proc/&lt;pid&gt;/status, including the two context-switch counters.', 'Open')}
${L('https://man7.org/linux/man-pages/man1/perf-stat.1.html', '📄', 'man 1 perf-stat', 'Counting context switches, migrations and more for one command.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Chuyển CPU từ luồng này sang luồng khác cũng là một việc phải làm</h2>
<p class="lead">Mọi chính sách ở bài 3.2 đều giả sử chuyển qua lại là miễn phí. Không phải vậy: nhân phải cất một luồng, chọn luồng khác rồi khôi phục nó, và bộ đệm (cache) mà luồng cũ đã làm "nóng" giờ phần lớn vô dụng. Một lần chuyển tốn bao nhiêu, đếm chúng trên một máy chủ đang chạy thế nào, và khi nào "quá nhiều chuyển ngữ cảnh" là vấn đề thật — chứ không chỉ là một con số đáng sợ trên dashboard?</p>

<h3>Một lần chuyển ngữ cảnh làm những gì</h3>
<ol>
<li>Luồng đang chạy đi vào nhân — vì nó bị chặn (read, sleep, khoá: chuyển <strong>tự nguyện</strong>) hoặc vì ngắt bộ định thời hay một task vừa thức giành lấy CPU (chuyển <strong>bị giành / không tự nguyện</strong>).</li>
<li>Nhân cất các thanh ghi của nó (bộ đếm chương trình, con trỏ stack, thanh ghi chung) vào <code>task_struct</code>.</li>
<li>Bộ lập lịch chọn task tiếp theo (bài 3.2).</li>
<li>Nếu task tiếp theo thuộc <em>tiến trình khác</em>, nhân còn phải đổi bảng trang, nên các phép dịch địa chỉ đã cache trong TLB bị mất (Chương 7). Các luồng cùng tiến trình bỏ qua bước này.</li>
<li>Nhân khôi phục thanh ghi của task tiếp theo rồi quay về user mode — nơi dữ liệu của nó nhiều khả năng đã không còn trong cache CPU.</li>
</ol>
<p>Bước 1–5 là chi phí <em>trực tiếp</em>; cache nguội sau đó là chi phí <em>gián tiếp</em>, và thường lớn hơn.</p>

<h3>Đếm số lần chuyển: vmstat</h3>
<p><code>vmstat 1</code> in mỗi giây một dòng; cột <code>cs</code> là số lần chuyển ngữ cảnh mỗi giây của cả máy (bỏ qua dòng đầu: đó là trung bình từ lúc khởi động). Lab đang rảnh:</p>
${run('c33-cs', 'vmstat 1 3')}
<p>Khoảng một nghìn lần mỗi giây. Giờ chạy <code>pingpong</code> — hai tiến trình chuyền qua lại một byte qua hai pipe, nên mỗi bên phải ngủ tới khi bên kia trả lời:</p>
${src('ch03/pingpong.c', 'c')}
${run('c33-cs', './pingpong 4000000')}
<p>Từ ~1 000 lên <strong>~180 000–217 000 lần mỗi giây</strong>, và phần CPU của nhân (<code>sy</code>) tăng lên. Đây là hình dạng nhìn từ ngoài của một thiết kế "lắm lời" — hai thành phần gọi nhau cho từng mẩu việc tí hon.</p>

<h3>Giá của một lần chuyển</h3>
<p>Ghim lên một lõi bằng <code>taskset -c 0</code>, mỗi vòng chuyền đúng bằng hai lần chuyển (cha → con → cha). Rồi để hai tiến trình nằm trên hai lõi khác nhau:</p>
${run('c33-cs', 'taskset -c 0 ./pingpong 200000', 2)}
<p>Trên một lõi: khoảng <strong>2 µs mỗi vòng, ~1 µs mỗi lần chuyển</strong> — đã tính cả hai syscall pipe ở mỗi bên. Trên hai lõi thì <strong>chậm hơn ~12 lần</strong>: lõi của bên kia rảnh trong lúc chờ, và đánh thức một lõi rảnh cần một ngắt liên bộ xử lý (IPI) và lõi đó phải ra khỏi trạng thái ngủ (trong VM, trình ảo hoá còn phải đánh thức CPU ảo). Chuyền việc giữa các luồng trên các lõi khác nhau có thể tốn hơn hẳn bản thân lần chuyển. <code>perf stat</code> xác nhận phép tính, lấy thẳng từ bộ đếm của nhân:</p>
${run('c33-cs', 'perf stat')}
<p>100 000 vòng, <strong>200 006 lần chuyển ngữ cảnh</strong>, một lần di cư giữa các lõi. (Trong lab, <code>perf</code> cần thêm <code>--cap-add PERFMON --security-opt seccomp=unconfined</code> cho <code>docker run</code>; trên Docker Desktop chỉ đếm được sự kiện phần mềm như mấy cái này, không đếm được bộ đếm cache phần cứng.)</p>
${lab('scheduler', 'rr', 'vi', 'Round robin quantum 2. Giờ đặt chi phí "context switch" = 1: mỗi lần chuyển ăn mất một nhịp, việc cuối xong ở 20 thay vì 13 và thời gian chờ trung bình tăng từ 5 lên 8,25. Thử quantum 1 so với 4.')}

<h3>Tự nguyện hay bị giành? Đọc /proc/&lt;pid&gt;/status</h3>
<p>Nhân đếm cả hai loại cho từng task. Hai con hog buộc phải chung một lõi trong 3 giây, rồi một tiến trình chỉ ngủ:</p>
${run('c33-cs', 'taskset -c 0 ./hog A')}
${run('c33-cs', 'sleep 2 & S=$!')}
<p>Con hog <strong>bị giành CPU 510 lần</strong> (nonvoluntary): 3 s CPU chia đôi theo lát ~2,8 ms, mỗi con một nửa. Nó gần như không bao giờ tự nhường CPU. <code>sleep</code> chuyển đúng một lần, tự nguyện. <code>pidstat -w</code> cho cùng thông tin theo từng giây, trực tiếp:</p>
${run('c33-cs', 'taskset -c 0 ./pingpong 3000000', 1, { drop: /^# / })}
<p>Tiến trình cha của pingpong làm ~240 000 lần mỗi loại mỗi giây. Tự nguyện: nó bị chặn ở <code>read</code>. Bị giành: khi nó <code>write</code>, nhân đánh thức con trên cùng lõi và cho con giành CPU khỏi bên ghi ngay lập tức.</p>
<div class="callout warn"><p><strong>Đọc hai bộ đếm này trên máy chủ thật:</strong> <code>cswch/s</code> (tự nguyện) cao = chương trình chờ nhiều — I/O, khoá, ngủ — bình thường với máy chủ web. <code>nvcswch/s</code> (bị giành) cao = nó muốn chạy tiếp nhưng bị đẩy khỏi CPU: số luồng sẵn sàng nhiều hơn số lõi, hoặc CPU quota đang bóp bạn (bài 3.4).</p></div>

<h3>Thêm luồng: khi nào không tốn gì, khi nào tốn gấp 9</h3>
<p><code>crowd.c</code> chia một khối việc cố định cho T luồng trên 4 lõi. Ở chế độ <code>cpu</code> mỗi luồng tự đếm riêng; ở chế độ <code>lock</code> mỗi bước đều lấy một mutex chung — đúng dáng "cập nhật một bộ đếm hay một mục cache chung cho mỗi request":</p>
${src('ch03/crowd.c', 'c')}
${run('c33-cs', 'for t in 1 4 64 512')}
<p>Việc CPU độc lập: 4 luồng trên 4 lõi tăng tốc 3,9× như mong đợi, và 512 luồng trên cùng 4 lõi chỉ chậm hơn 4 luồng ~20%. Một lần chuyển tốn ~1 µs và vài mili giây mới xảy ra một lần, nên riêng chuyện dư luồng thì rẻ. Giờ cùng 4 lõi nhưng có khoá chung:</p>
${run('c33-cs', 'for t in 1 4 64; do perf stat')}
<p><strong>Một luồng: 118 ms. 64 luồng: 1 086 ms — chậm gấp 9, với 230 000 lần chuyển ngữ cảnh và đốt 4,3 s CPU thay vì 0,12 s.</strong> Mỗi lần khoá bị lấy, các luồng đang chờ đi ngủ trong nhân (futex) và phải được đánh thức rồi lập lịch lại; ổ khoá và bộ đếm bị đẩy qua đẩy lại giữa cache của các lõi. Thêm luồng cho việc bị xếp hàng qua một ổ khoá làm nó vừa chậm hơn <em>vừa</em> tốn hơn. Chương 5 sửa chuyện này tận gốc (vùng găng ngắn hơn, phép nguyên tử, chia nhỏ dữ liệu).</p>

<div class="pitfall co-tieu-de">
<p><strong>"Dịch vụ chậm — tăng thread pool từ 50 lên 500."</strong> Nếu các luồng chủ yếu <em>chờ</em> I/O độc lập, thêm luồng có thể giúp. Nếu chúng tranh nhau một ổ khoá, một pool kết nối hay CPU, bạn vừa đo được kết quả: nhiều lần chuyển hơn, nhiều CPU hơn, thông lượng thấp hơn. Và lỗi ngược lại: thấy "200k cs/s" trên dashboard rồi hoảng. Tốc độ chuyển ngữ cảnh chẳng nói lên gì nếu không có mốc so sánh — so với chính dịch vụ đó vào một ngày bình thường, và nhìn tỉ lệ tự nguyện/bị giành trước khi đổ lỗi cho bộ lập lịch.</p>
</div>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> sau khi có người tăng worker pool từ 50 lên 500 luồng, p99 của API lại <em>tệ hơn</em>. Bạn muốn chỉ ra cơ chế ở quy mô nhỏ trước buổi họp rút kinh nghiệm.</p>
<ol>
<li>Chạy <code>vmstat 1 5</code> khi lab đang rảnh, ghi lại mốc <code>cs</code>. Rồi chạy <code>./pingpong 4000000 &amp;</code> và nhìn <code>cs</code> và <code>sy</code> thay đổi.</li>
<li>Đo một lần chuyển: <code>taskset -c 0 ./pingpong 200000</code>, rồi <code>taskset -c 0,1</code>. Xác nhận bằng <code>perf stat -e context-switches</code> rằng số lần chuyển ≈ 2 × số vòng.</li>
<li>Cho hai <code>./hog</code> chung một lõi trong 3 s rồi đọc <code>voluntary_ctxt_switches</code>/<code>nonvoluntary_ctxt_switches</code> trong <code>/proc/&lt;pid&gt;/status</code>. Cái nào tăng, vì sao?</li>
<li>Chạy <code>crowd</code> với 1, 4, 64 luồng ở chế độ <code>cpu</code> và <code>lock</code> dưới <code>perf stat -e context-switches,task-clock</code>. Vẽ thời gian theo số luồng cho cả hai.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn nói được giá một lần chuyển trên máy mình (cùng lõi vs khác lõi), và chỉ ra bằng số của chính mình rằng thêm luồng gần như không đổi gì với việc độc lập nhưng làm việc bị khoá chậm và tốn CPU hơn nhiều lần.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['context switch (chuyển ngữ cảnh)', 'Cất thanh ghi của một task và khôi phục của task khác để nó chạy trên CPU này.'],
  ['voluntary switch (chuyển tự nguyện)', 'Task nhường CPU vì bị chặn: I/O, ngủ, khoá. <code>voluntary_ctxt_switches</code>, <code>cswch/s</code>.'],
  ['involuntary switch (bị giành CPU)', 'Task bị cướp CPU: hết lát hoặc một task vừa thức chen vào. <code>nonvoluntary_ctxt_switches</code>, <code>nvcswch/s</code>.'],
  ['vmstat cs', 'Số lần chuyển ngữ cảnh mỗi giây của cả máy (dòng đầu = trung bình từ lúc khởi động).'],
  ['cpu-migration (di cư CPU)', 'Task bị chuyển từ CPU này sang CPU khác; dữ liệu cache của nó nằm lại chỗ cũ.'],
  ['IPI (ngắt liên bộ xử lý)', 'Cách một lõi đánh thức lõi khác — một phần lý do chuyền việc qua lõi khác chậm hơn.'],
  ['oversubscription (dư luồng)', 'Số luồng sẵn sàng nhiều hơn số lõi: rẻ với việc độc lập, đắt khi có khoá chung.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một lần chuyển ngữ cảnh cất và khôi phục thanh ghi, có thể đổi bảng trang, và để lại cache nguội.</li>
<li>Đo thật: ~1 µs mỗi lần trên một lõi (đã gồm syscall pipe); chuyền việc qua lõi khác tốn ~12 lần.</li>
<li>Đếm bằng <code>vmstat</code> (cả máy), <code>pidstat -w</code> và <code>/proc/&lt;pid&gt;/status</code> (từng task), <code>perf stat</code> (từng lần chạy).</li>
<li>Tự nguyện = đang chờ (bình thường với máy chủ); bị giành = muốn CPU mà mất (quá nhiều luồng sẵn sàng hoặc bị bóp quota).</li>
<li>512 luồng làm việc độc lập chỉ tốn thêm ~20% so với 4; 64 luồng chung một khoá tốn gấp 9 thời gian và 36 lần CPU so với một luồng.</li>
</ul>
${L('https://man7.org/linux/man-pages/man5/proc_pid_status.5.html', '📄', 'man 5 proc_pid_status', 'Mọi trường của /proc/&lt;pid&gt;/status, gồm cả hai bộ đếm chuyển ngữ cảnh.', 'Mở')}
${L('https://man7.org/linux/man-pages/man1/perf-stat.1.html', '📄', 'man 1 perf-stat', 'Đếm chuyển ngữ cảnh, di cư CPU và hơn thế cho một lệnh.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 3.4 — Đa lõi, affinity, giới hạn CPU ───────────────────────── */
    {
      title: '3.4 — Multicore, affinity, NUMA and CPU limits in containers|||3.4 — Đa lõi, affinity, NUMA và giới hạn CPU trong container',
      slug: 'os-3-4-da-loi',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Ba con số "có bao nhiêu lõi": lõi của máy, lõi được phép (affinity/cpuset) và thời gian CPU được phép (quota); taskset và tăng tốc song song đo thật; --cpus 1.5 làm Node báo 1 lõi, Java 2, Python 10; throttling đẩy p99 từ 2,4 ms lên 60 ms.',
      content: `${G34}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.4</span>
<h2>"How many cores do I have?" has three different answers</h2>
<p class="lead">Thread pools, Node's cluster module, the JVM's garbage collector and parallel streams all size themselves from "the number of CPUs". But there are three numbers that people call that: the CPUs the <strong>machine</strong> has, the CPUs your process is <strong>allowed to run on</strong> (affinity, cpuset), and the CPU <strong>time</strong> your container is allowed to use (quota). Runtimes read different ones — and when they guess wrong inside a container, you get throttling and terrible tail latency. This lesson measures all three.</p>

<h3>The machine's CPUs, and the ones you may use</h3>
${run('c34-loi', 'nproc; taskset -p $$')}
${run('c34-loi', 'lscpu')}
<p>Ten CPUs, one hardware thread per core, one cluster. The affinity mask <code>3ff</code> is ten 1-bits: this shell may run on CPUs 0–9. <code>taskset</code> narrows it, and <code>nproc</code> respects the narrower mask:</p>
${run('c34-loi', 'taskset -c 0 nproc')}

<h3>Parallel speedup, measured</h3>
<p>The same 4-thread CPU job from lesson 3.3, allowed one core, four cores, or anything:</p>
${run('c34-loi', 'taskset -c 0 ./crowd 4 cpu', 3)}
<p>One core: 889 ms. Four cores: 232 ms — a 3.8× speedup for 4 threads. Unpinned (ten cores free): the same, because four threads cannot use more than four cores. Threads only run in parallel when there are free cores to put them on.</p>
${lab('scheduler', 'multicore', 'en', 'Six threads on two cores under round robin: watch both CPU rows fill and threads hop between cores. Set cores to 1, then 4, and compare the finish time.')}

<h3>Where does a thread run? psr, migrations and pinning</h3>
<p>The scheduler prefers to keep a thread on the core it last ran on — its data is still in that core's cache. A lone hog, sampled five times:</p>
${run('c34-loi', './hog x')}
<p>Always CPU 7. You can also move a running process. <code>taskset -p</code> prints its mask (<code>20</code> hex = bit 5 = CPU 5), and <code>-p -c 7</code> re-pins it:</p>
${run('c34-loi', 'taskset -c 5 ./hog y')}
<p>Each move between cores is a <strong>cpu-migration</strong>, and <code>perf stat</code> counts them. 64 threads free to use all ten cores vs confined to four:</p>
${run('c34-loi', 'perf stat -e cpu-migrations', 2)}
<p>Free: 131 ms on ten cores. Pinned to four: 237 ms, and the scheduler moved threads around more (52 migrations) to balance four busy run queues. Pinning is a tool for isolation — keeping a noisy job off the cores that serve requests, or keeping a latency-critical thread on a warm cache — not a free speedup.</p>

<h3>NUMA: when "memory" is not one place</h3>
<p>On a big server with two or more CPU sockets, each socket has its own RAM; reading memory attached to the <em>other</em> socket takes noticeably longer. That is NUMA (non-uniform memory access), and on such machines <code>lscpu</code> prints <code>NUMA node(s): 2</code> and tools like <code>numactl</code> pin both threads and memory to one node. Our lab VM printed no NUMA line at all: it is a single memory node, so there is nothing to measure here — and the same is true for most small cloud VMs. Remember the word for when you meet a 2-socket database server.</p>

<h3>Container limit #1: cpuset — fewer CPUs, visibly</h3>
<p><code>docker run --cpuset-cpus 0,1</code> changes the affinity of everything in the container. Everybody can see it — almost:</p>
${run('c34-cpuset', 'cat /sys/fs/cgroup/cpu.max')}
${run('c34-cpuset', 'bash cores.sh')}
<p><code>nproc</code>, Node's <code>os.availableParallelism()</code>, Java and Python's <code>os.process_cpu_count()</code> say 2. Node's <code>os.cpus().length</code> and Python's <code>os.cpu_count()</code> still say 10: they list the machine's CPUs, not the ones you may use.</p>

<h3>Container limit #2: CPU quota — invisible, and it bites</h3>
<p><code>docker run --cpus 1.5</code> does not hide any CPU. It sets a cgroup <strong>quota</strong>: in every 100 ms period, the container's threads together may run for at most 150 ms of CPU time, on any of the ten cores.</p>
${run('c34-quota', 'cat /sys/fs/cgroup/cpu.max')}
${run('c34-quota', 'bash cores.sh')}
<p><code>150000 100000</code> = 150 ms per 100 ms. Now the answers disagree: this <code>nproc</code> rounds the quota up to 2; Node's <code>availableParallelism()</code> rounds it down to <strong>1</strong>; Java rounds up to 2 (and gives the ForkJoin common pool 1); Python ignores the quota entirely and says 10; <code>os.cpus().length</code> says 10. Any code that sizes a pool from <code>os.cpus().length</code> starts ten workers to share one and a half CPUs. When the threads want more than the quota, the kernel <strong>throttles</strong> the whole container until the next period — and counts it:</p>
${run('c34-quota', 'cat /sys/fs/cgroup/cpu.stat')}
${run('c34-quota', 'time ./crowd 4 cpu', 2)}
<p>Even before our test, 4 of the first 8 periods were throttled — that was the JVM compiling <code>Cores.java</code> with several threads at once. The 4-thread job then ran at <code>user 0.903 s</code> in <code>real 0.576 s</code>: 1.57 CPUs on average, pinned to the quota no matter how many cores were idle, and 6 more periods throttled. (<code>throttled_usec</code> is summed over the CPUs the container's threads were stopped on.)</p>
${lab('cgroup', 'cpuquota', 'en', 'cpu.max on a timeline: one thread needs 120 ms of CPU under a quota of 50 ms per 100 ms period. It spends the budget early in each period, is frozen for the rest, and finishes at 220 ms instead of 120. Watch nr_throttled in cpu.stat climb.')}

<h3>What throttling does to latency</h3>
<p><code>lat.c</code> serves 300 "requests" that each need 2 ms of CPU, while a background job in the same container burns 3 threads — the shape of an API container that also runs a report or an image resize:</p>
${run('c34-quota', './lat 0', 2)}
<p>Median unchanged at 2.0 ms, but <strong>p99 from 2.4 ms to 60.4 ms</strong>. Four busy threads use up the 150 ms quota in about 37 ms of wall time; then every thread in the container — including the request handler — is frozen for the rest of the 100 ms period. A request that arrives in that window waits up to ~62 ms (max measured: 63.3). Average CPU usage graphs look fine the whole time; only <code>cpu.stat</code> and the p99 show it.</p>
${lab('cgroup', 'cputhreads', 'en', 'Why parallel work makes it worse: 4 threads × 30 ms of CPU under the same 50/100 quota finish at about 205 ms instead of 30 — together they burn each period’s budget in a few milliseconds, then every thread in the group (a request handler too) waits for the next period.')}

<div class="pitfall co-tieu-de">
<p><strong>"CPU is at 40% but p99 is terrible" in a container: look at nr_throttled first.</strong> A quota is enforced in 100 ms windows, so a burst of parallel work can be throttled even when the per-minute average is low. Fixes, in order of preference: size thread pools and worker counts to the <em>quota</em> (Node: <code>os.availableParallelism()</code>, never <code>os.cpus().length</code>; JVM: it reads the quota itself, or set <code>-XX:ActiveProcessorCount</code>); move background CPU work out of the latency-sensitive container; raise the quota; or use a relative weight (<code>cpu.weight</code>, Docker <code>--cpu-shares</code>) instead of a hard cap when the machine is not shared with strangers.</p>
</div>
<p>The same arithmetic runs this site's deploys: image builds moved off the small VPS onto a 12-core home machine, where the two images build in parallel in roughly 3–6 minutes instead of ~15 minutes sequentially on the VPS. "Parallel" only buys you the CPUs you actually have.</p>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a Node API runs in a container with <code>--cpus 1.5</code> on a 10-core host. It forks <code>os.cpus().length</code> cluster workers, and every few seconds a few requests take 60 ms+ while the CPU graph shows 40%. You need evidence and a fix.</p>
<ol>
<li>Start <code>docker run --rm -it --cpus 1.5 os-lab</code>. Read <code>/sys/fs/cgroup/cpu.max</code>, then run the four lines of <code>cores.sh</code>. Which runtime would start the most workers?</li>
<li>Read <code>cpu.stat</code>, run <code>time ./crowd 4 cpu</code>, read <code>cpu.stat</code> again. How many periods were throttled, and what is <code>user/real</code>?</li>
<li>Run <code>./lat 0</code> and <code>./lat 3</code>. Then restart the container with <code>--cpus 4</code> and run <code>./lat 3</code> again.</li>
<li>Restart with <code>--cpuset-cpus 0,1</code> instead and run <code>cores.sh</code>: which runtimes now agree?</li>
</ol>
<p><strong>Done when:</strong> you can show, with <code>nr_throttled</code> and p99 numbers, that the 60 ms requests are quota throttling (they disappear with <code>--cpus 4</code>), and name the API each runtime should use to size its worker pool.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['CPU affinity (ái lực CPU)', 'The set of CPUs a thread may run on; set with <code>taskset</code> / <code>sched_setaffinity</code>.'],
  ['cpuset', 'The cgroup version of affinity: <code>--cpuset-cpus</code>; visible to <code>nproc</code> and most runtimes.'],
  ['CPU quota (cpu.max)', '“At most Q µs of CPU per period P µs” for a whole cgroup: <code>--cpus 1.5</code> = 150000 100000.'],
  ['throttling (bị bóp CPU)', 'All threads of a cgroup stopped until the next period because the quota is used up; see <code>cpu.stat</code>.'],
  ['nr_throttled / throttled_usec', '<code>cpu.stat</code> counters: how many periods were throttled and for how long.'],
  ['cpu-migration', 'A thread moved to another CPU; pinning reduces it but also limits parallelism.'],
  ['NUMA', 'Non-uniform memory access: on multi-socket servers, memory near one socket is slower from another.'],
  ['os.availableParallelism()', 'Node’s quota- and affinity-aware CPU count; <code>os.cpus().length</code> is the machine’s.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>"Number of CPUs" means three things: machine CPUs, allowed CPUs (affinity/cpuset) and allowed CPU time (quota).</li>
<li>Measured: 4 threads gain 3.8× on 4 cores; the scheduler keeps a thread on a warm core; pinning isolates but does not speed up.</li>
<li>Under <code>--cpus 1.5</code>: <code>nproc</code> 2, Node <code>availableParallelism</code> 1, Java 2, Python 10, <code>os.cpus().length</code> 10.</li>
<li>Quota is enforced per 100 ms: busy background threads freeze the whole container; p99 went from 2.4 ms to 60.4 ms.</li>
<li>Diagnose with <code>cpu.stat</code> (<code>nr_throttled</code>), size pools to the quota, and keep CPU-heavy side jobs out of latency-critical containers.</li>
</ul>
${L('https://docs.kernel.org/scheduler/sched-bwc.html', '📄', 'kernel.org — CFS Bandwidth Control', 'How cpu.max quotas, periods and throttling work.', 'Open')}
${L('https://docs.docker.com/engine/containers/resource_constraints/', '🐳', 'Docker — Resource constraints', '--cpus, --cpuset-cpus and --cpu-shares in one page.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>"Tôi có bao nhiêu lõi?" có ba câu trả lời khác nhau</h2>
<p class="lead">Thread pool, module cluster của Node, bộ gom rác của JVM và parallel stream đều tự chọn kích thước theo "số CPU". Nhưng có tới ba con số mà người ta cùng gọi như vậy: số CPU của <strong>máy</strong>, số CPU tiến trình được <strong>phép chạy trên đó</strong> (affinity, cpuset), và <strong>thời gian</strong> CPU container được phép dùng (quota). Mỗi runtime đọc một con số khác nhau — và khi chúng đoán sai trong container, bạn nhận về throttling và độ trễ đuôi tệ hại. Bài này đo cả ba.</p>

<h3>CPU của máy, và những CPU bạn được dùng</h3>
${run('c34-loi', 'nproc; taskset -p $$')}
${run('c34-loi', 'lscpu')}
<p>Mười CPU, mỗi lõi một luồng phần cứng, một cụm. Mặt nạ affinity <code>3ff</code> là mười bit 1: shell này được chạy trên CPU 0–9. <code>taskset</code> thu hẹp nó, và <code>nproc</code> tôn trọng mặt nạ hẹp hơn:</p>
${run('c34-loi', 'taskset -c 0 nproc')}

<h3>Tăng tốc song song, đo thật</h3>
<p>Cùng việc CPU 4 luồng ở bài 3.3, được phép dùng một lõi, bốn lõi, hoặc tuỳ ý:</p>
${run('c34-loi', 'taskset -c 0 ./crowd 4 cpu', 3)}
<p>Một lõi: 889 ms. Bốn lõi: 232 ms — tăng tốc 3,8× với 4 luồng. Không ghim (mười lõi rảnh): y vậy, vì bốn luồng không dùng được quá bốn lõi. Luồng chỉ chạy song song khi có lõi rảnh để đặt chúng lên.</p>
${lab('scheduler', 'multicore', 'vi', 'Sáu luồng trên hai lõi với round robin: nhìn cả hai hàng CPU đầy lên và luồng nhảy giữa các lõi. Đặt số lõi = 1 rồi 4 và so thời điểm xong.')}

<h3>Luồng chạy ở đâu? psr, di cư và ghim lõi</h3>
<p>Bộ lập lịch thích giữ một luồng ở lõi nó vừa chạy — dữ liệu của nó vẫn còn trong cache lõi đó. Một con hog đơn độc, lấy mẫu năm lần:</p>
${run('c34-loi', './hog x')}
<p>Luôn là CPU 7. Bạn cũng có thể dời một tiến trình đang chạy. <code>taskset -p</code> in ra mặt nạ của nó (<code>20</code> hệ 16 = bit 5 = CPU 5), và <code>-p -c 7</code> ghim lại:</p>
${run('c34-loi', 'taskset -c 5 ./hog y')}
<p>Mỗi lần chuyển giữa các lõi là một lần <strong>di cư CPU (cpu-migration)</strong>, và <code>perf stat</code> đếm được. 64 luồng được dùng cả mười lõi so với bị nhốt trong bốn lõi:</p>
${run('c34-loi', 'perf stat -e cpu-migrations', 2)}
<p>Tự do: 131 ms trên mười lõi. Ghim vào bốn: 237 ms, và bộ lập lịch dời luồng nhiều hơn (52 lần di cư) để cân bốn hàng chạy đang bận. Ghim lõi là công cụ để cô lập — giữ một job ồn ào khỏi các lõi đang phục vụ request, hoặc giữ một luồng nhạy độ trễ trên cache còn nóng — chứ không phải tăng tốc miễn phí.</p>

<h3>NUMA: khi "bộ nhớ" không nằm ở một chỗ</h3>
<p>Trên máy chủ lớn có hai socket CPU trở lên, mỗi socket có RAM riêng; đọc bộ nhớ gắn với socket <em>bên kia</em> chậm hơn thấy rõ. Đó là NUMA (truy cập bộ nhớ không đồng nhất), và trên những máy như vậy <code>lscpu</code> in ra <code>NUMA node(s): 2</code>, còn công cụ như <code>numactl</code> ghim cả luồng lẫn bộ nhớ vào một node. VM lab của ta không in dòng NUMA nào: nó chỉ có một node bộ nhớ, nên ở đây không có gì để đo — phần lớn VM đám mây nhỏ cũng vậy. Hãy nhớ từ này cho lúc bạn gặp một máy chủ cơ sở dữ liệu hai socket.</p>

<h3>Giới hạn container #1: cpuset — ít CPU hơn, nhìn thấy được</h3>
<p><code>docker run --cpuset-cpus 0,1</code> đổi affinity của mọi thứ trong container. Ai cũng thấy — gần như vậy:</p>
${run('c34-cpuset', 'cat /sys/fs/cgroup/cpu.max')}
${run('c34-cpuset', 'bash cores.sh')}
<p><code>nproc</code>, <code>os.availableParallelism()</code> của Node, Java và <code>os.process_cpu_count()</code> của Python nói 2. <code>os.cpus().length</code> của Node và <code>os.cpu_count()</code> của Python vẫn nói 10: chúng liệt kê CPU của máy, không phải CPU bạn được dùng.</p>

<h3>Giới hạn container #2: CPU quota — vô hình, và nó cắn</h3>
<p><code>docker run --cpus 1.5</code> không giấu CPU nào cả. Nó đặt một <strong>quota</strong> của cgroup: trong mỗi chu kỳ 100 ms, tất cả luồng của container cộng lại chỉ được chạy tối đa 150 ms thời gian CPU, trên bất kỳ lõi nào trong mười lõi.</p>
${run('c34-quota', 'cat /sys/fs/cgroup/cpu.max')}
${run('c34-quota', 'bash cores.sh')}
<p><code>150000 100000</code> = 150 ms mỗi 100 ms. Giờ các câu trả lời vênh nhau: <code>nproc</code> này làm tròn quota lên 2; <code>availableParallelism()</code> của Node làm tròn xuống <strong>1</strong>; Java làm tròn lên 2 (và cho common pool của ForkJoin 1); Python bỏ qua quota hoàn toàn và nói 10; <code>os.cpus().length</code> nói 10. Đoạn mã nào chọn cỡ pool theo <code>os.cpus().length</code> sẽ khởi mười worker để chia nhau một lõi rưỡi. Khi các luồng muốn nhiều hơn quota, nhân <strong>bóp (throttle)</strong> cả container tới chu kỳ sau — và đếm lại:</p>
${run('c34-quota', 'cat /sys/fs/cgroup/cpu.stat')}
${run('c34-quota', 'time ./crowd 4 cpu', 2)}
<p>Ngay cả trước phép thử, 4 trong 8 chu kỳ đầu đã bị bóp — đó là JVM biên dịch <code>Cores.java</code> bằng nhiều luồng cùng lúc. Việc 4 luồng sau đó chạy <code>user 0.903 s</code> trong <code>real 0.576 s</code>: trung bình 1,57 CPU, dính đúng quota bất kể bao nhiêu lõi đang rảnh, và thêm 6 chu kỳ bị bóp. (<code>throttled_usec</code> là tổng cộng trên các CPU nơi luồng của container bị dừng.)</p>
${lab('cgroup', 'cpuquota', 'vi', 'cpu.max trên dòng thời gian: một luồng cần 120 ms CPU dưới quota 50 ms mỗi chu kỳ 100 ms. Nó tiêu hết ngân sách sớm trong mỗi chu kỳ, bị đóng băng phần còn lại, và xong lúc 220 ms thay vì 120. Nhìn nr_throttled trong cpu.stat tăng dần.')}

<h3>Throttling làm gì với độ trễ</h3>
<p><code>lat.c</code> phục vụ 300 "request", mỗi cái cần 2 ms CPU, trong khi một job nền trong cùng container đốt 3 luồng — đúng dáng một container API kiêm chạy báo cáo hay thu nhỏ ảnh:</p>
${run('c34-quota', './lat 0', 2)}
<p>Trung vị vẫn 2,0 ms, nhưng <strong>p99 từ 2,4 ms lên 60,4 ms</strong>. Bốn luồng bận dùng hết quota 150 ms chỉ trong khoảng 37 ms đồng hồ; sau đó mọi luồng trong container — kể cả handler đang xử lý request — bị đóng băng hết phần còn lại của chu kỳ 100 ms. Request nào rơi vào khoảng đó phải chờ tới ~62 ms (max đo được: 63,3). Biểu đồ CPU trung bình nhìn vẫn ổn suốt; chỉ <code>cpu.stat</code> và p99 cho thấy nó.</p>
${lab('cgroup', 'cputhreads', 'vi', 'Vì sao việc song song làm tệ hơn: 4 luồng × 30 ms CPU dưới cùng quota 50/100 xong lúc khoảng 205 ms thay vì 30 — cùng nhau chúng đốt ngân sách của mỗi chu kỳ trong vài mili giây, rồi mọi luồng trong nhóm (cả handler request) chờ chu kỳ sau.')}

<div class="pitfall co-tieu-de">
<p><strong>"CPU mới 40% mà p99 tệ quá" trong container: nhìn nr_throttled trước tiên.</strong> Quota được áp theo từng cửa sổ 100 ms, nên một đợt việc song song có thể bị bóp dù trung bình theo phút vẫn thấp. Cách sửa, theo thứ tự nên dùng: chọn cỡ thread pool và số worker theo <em>quota</em> (Node: <code>os.availableParallelism()</code>, đừng bao giờ dùng <code>os.cpus().length</code>; JVM: nó tự đọc quota, hoặc đặt <code>-XX:ActiveProcessorCount</code>); dời việc nặng CPU chạy nền ra khỏi container nhạy độ trễ; nâng quota; hoặc dùng trọng số tương đối (<code>cpu.weight</code>, Docker <code>--cpu-shares</code>) thay cho trần cứng khi máy không dùng chung với người lạ.</p>
</div>
<p>Chính phép tính đó đang chạy các lần deploy của trang này: việc dựng ảnh đã dời khỏi VPS nhỏ sang một máy 12 lõi ở nhà, nơi hai ảnh dựng song song mất khoảng 3–6 phút thay vì ~15 phút dựng tuần tự trên VPS. "Song song" chỉ mua được số CPU bạn thật sự có.</p>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một API Node chạy trong container <code>--cpus 1.5</code> trên máy 10 lõi. Nó fork <code>os.cpus().length</code> worker cluster, và cứ vài giây lại có vài request mất 60 ms trở lên trong khi biểu đồ CPU chỉ 40%. Bạn cần bằng chứng và cách sửa.</p>
<ol>
<li>Mở <code>docker run --rm -it --cpus 1.5 os-lab</code>. Đọc <code>/sys/fs/cgroup/cpu.max</code>, rồi chạy bốn dòng của <code>cores.sh</code>. Runtime nào sẽ khởi nhiều worker nhất?</li>
<li>Đọc <code>cpu.stat</code>, chạy <code>time ./crowd 4 cpu</code>, đọc lại <code>cpu.stat</code>. Bao nhiêu chu kỳ bị bóp, và <code>user/real</code> bằng bao nhiêu?</li>
<li>Chạy <code>./lat 0</code> và <code>./lat 3</code>. Rồi mở lại container với <code>--cpus 4</code> và chạy lại <code>./lat 3</code>.</li>
<li>Mở lại với <code>--cpuset-cpus 0,1</code> thay vào đó và chạy <code>cores.sh</code>: giờ những runtime nào nói giống nhau?</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chỉ ra được, bằng <code>nr_throttled</code> và số p99, rằng các request 60 ms là do bị bóp quota (chúng biến mất với <code>--cpus 4</code>), và gọi tên được API mà mỗi runtime nên dùng để chọn cỡ worker pool.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['CPU affinity (ái lực CPU)', 'Tập CPU mà một luồng được chạy trên đó; đặt bằng <code>taskset</code> / <code>sched_setaffinity</code>.'],
  ['cpuset', 'Phiên bản cgroup của affinity: <code>--cpuset-cpus</code>; <code>nproc</code> và phần lớn runtime đều thấy.'],
  ['CPU quota (cpu.max)', '"Tối đa Q µs CPU mỗi chu kỳ P µs" cho cả cgroup: <code>--cpus 1.5</code> = 150000 100000.'],
  ['throttling (bị bóp CPU)', 'Mọi luồng của một cgroup bị dừng tới chu kỳ sau vì đã dùng hết quota; xem <code>cpu.stat</code>.'],
  ['nr_throttled / throttled_usec', 'Bộ đếm trong <code>cpu.stat</code>: bao nhiêu chu kỳ bị bóp và bị bóp bao lâu.'],
  ['cpu-migration (di cư CPU)', 'Luồng bị dời sang CPU khác; ghim lõi giảm việc này nhưng cũng giới hạn song song.'],
  ['NUMA', 'Truy cập bộ nhớ không đồng nhất: trên máy nhiều socket, bộ nhớ gần socket này đọc từ socket kia chậm hơn.'],
  ['os.availableParallelism()', 'Số CPU của Node có tính quota và affinity; <code>os.cpus().length</code> là số CPU của máy.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>"Số CPU" có ba nghĩa: CPU của máy, CPU được phép dùng (affinity/cpuset) và thời gian CPU được phép (quota).</li>
<li>Đo thật: 4 luồng tăng tốc 3,8× trên 4 lõi; bộ lập lịch giữ luồng trên lõi còn nóng cache; ghim lõi để cô lập chứ không để tăng tốc.</li>
<li>Dưới <code>--cpus 1.5</code>: <code>nproc</code> 2, <code>availableParallelism</code> của Node 1, Java 2, Python 10, <code>os.cpus().length</code> 10.</li>
<li>Quota áp theo từng 100 ms: luồng nền bận làm đóng băng cả container; p99 từ 2,4 ms lên 60,4 ms.</li>
<li>Chẩn đoán bằng <code>cpu.stat</code> (<code>nr_throttled</code>), chọn cỡ pool theo quota, và để việc phụ nặng CPU ra khỏi container nhạy độ trễ.</li>
</ul>
${L('https://docs.kernel.org/scheduler/sched-bwc.html', '📄', 'kernel.org — CFS Bandwidth Control', 'Quota cpu.max, chu kỳ và throttling hoạt động thế nào.', 'Mở')}
${L('https://docs.docker.com/engine/containers/resource_constraints/', '🐳', 'Docker — Resource constraints', '--cpus, --cpuset-cpus và --cpu-shares trong một trang.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 3.5 — Event loop vs thread pool ───────────────────────── */
    {
      title: '3.5 — Event loop vs thread pool: Node and Spring Boot, measured|||3.5 — Event loop vs thread pool: Node và Spring Boot, đo thật',
      slug: 'os-3-5-event-loop',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Hai cách phục vụ hàng nghìn request: một luồng JS + event loop (Node) và mỗi request một luồng trong pool (Tomcat/Spring Boot). Đo thật: 100 lần chờ 200 ms trên một luồng, chặn event loop 1,5 s, pool libuv 4 luồng, pool Java 10/200 luồng vs virtual thread, định luật Little.',
      content: `${G35}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.5</span>
<h2>Two ways to serve thousands of requests — both are scheduling decisions</h2>
<p class="lead">Node.js serves many clients with <strong>one JavaScript thread and an event loop</strong>. Spring Boot on Tomcat gives <strong>each request its own thread from a pool</strong>. People argue about them like religions. They are really two answers to the question of this chapter — how to share a few cores among many things that mostly wait — and each has one way to fail badly. We put both under the same load: requests that wait 200 ms (a database call), and requests that burn CPU.</p>

<h3>Node: one JS thread, many waits</h3>
<p>A tiny server: <code>/io</code> waits like a database call (a timer: the thread is free while waiting), <code>/cpu</code> burns CPU in a loop, <code>/fast</code> answers at once, and <code>/lag</code> reports how late the event loop's own 10 ms timer has been firing — i.e. how long the JS thread was busy:</p>
${src('ch03/loop-server.js', 'javascript')}
${run('c35-loop', 'cat server.log')}
${run('c35-loop', "node load.js 'http://localhost:8080/io")}
${run('c35-loop', "curl -s 'http://localhost:8080/lag'")}
<p><strong>100 requests, each waiting 200 ms, all done in 277 ms — on one JavaScript thread.</strong> Waiting is not running: while a request waits, its callback is just an entry in a timer list (for sockets, an fd registered with epoll — Chapter 10), and the thread runs other callbacks. The loop was never late by more than 5 ms. This is why Node is excellent at I/O-heavy APIs.</p>

<h3>Blocking the event loop: one slow request stalls everyone</h3>
<p>Now one client hits <code>/cpu?ms=1500</code> and, 0.1 s later, another hits <code>/fast</code>:</p>
${run('c35-loop', "curl -s 'http://localhost:8080/cpu?ms=1500'", 2)}
<p><code>/fast</code> took <strong>1.39 s</strong>, and the event loop was blocked for 1 491 ms. JavaScript callbacks are never preempted: the scheduler of the event loop is pure FCFS, so one long callback is a convoy for every user of the process. Ten CPU requests of 100 ms each are served strictly one after another:</p>
${run('c35-loop', "node load.js 'http://localhost:8080/cpu", 2)}
${lab('eventloop', 'block', 'en', 'The real event loop: one request runs 200 ms of synchronous work on the only JavaScript thread, and the requests that arrive meanwhile — almost no work each — wait about 197 and 194 ms. Watch the call stack stay busy while their callbacks pile up; then switch to “offload”.', { tour: 'eventloop-block' })}
<div class="pitfall co-tieu-de">
<p><strong>"I made it async, so it can't block."</strong> <code>async</code>/<code>await</code> does not move work off the thread; it only lets you wait for work that happens <em>elsewhere</em> (the kernel, the libuv pool, another server). A CPU-heavy <code>await</code>ed function — <code>JSON.parse</code> of a 50 MB body, a synchronous <code>bcrypt</code>, a catastrophic regex, <code>fs.readFileSync</code> in a handler, building a big PDF — still blocks the loop for everyone. Move such work to <code>worker_threads</code> (Chapter 4), to a job queue, or chunk it.</p>
</div>

<h3>Node's hidden thread pool (libuv)</h3>
<p>Some work cannot be done by epoll: file-system calls, <code>dns.lookup</code>, and CPU-heavy built-ins like <code>crypto.pbkdf2</code> and <code>zlib</code>. libuv runs those on its own <strong>thread pool, 4 threads by default</strong> (<code>UV_THREADPOOL_SIZE</code>). Eight pbkdf2 hashes at once:</p>
${src('ch03/pool.js', 'javascript')}
${run('c35-loop', 'node pool.js')}
${run('c35-loop', 'UV_THREADPOOL_SIZE=8')}
<p>Default pool: <strong>4 finish at 176 ms, the other 4 at ~351 ms</strong> — two waves, exactly like a 4-core scheduler with 8 jobs. With 8 threads all finish at ~180 ms. And you can see the pool appear: 7 threads before, 11 after (four <code>libuv-worker</code>), 15 with size 8. Set the size from the CPUs you really have (<code>os.availableParallelism()</code>, lesson 3.4) and before the first use — the pool is created once. Network sockets do <em>not</em> use this pool.</p>
${lab('eventloop', 'pool', 'en', 'The same experiment in slow motion: 8 pbkdf2 calls on a pool of 4 threads finish in two waves (100 and 200 ms), a 1 ms readFile queued behind them waits until 201 ms, and an https request (epoll, no pool thread) is not delayed. Change UV_THREADPOOL_SIZE to 1, 2, 4, 8.')}

<h3>Spring Boot / Tomcat: one request, one thread</h3>
<p>The JVM side, shrunk to its essence: an HTTP server whose handler blocks for 200 ms (as a JDBC call does), run on a fixed pool of N threads — which is what Tomcat inside Spring Boot is — or on virtual threads:</p>
${src('ch03/PoolServer.java', 'java')}
${run('c35-loop', 'javac -d . PoolServer.java', 4)}
<p>Pool of <strong>10</strong>: 100 requests took <strong>2.17 s</strong> — ten waves of 200 ms. Pool of <strong>200</strong>: 0.57 s, with 173 threads alive. <strong>Virtual threads</strong>: 0.36 s with only 31 kernel threads. The pool size is a hard ceiling on concurrency, given by <strong>Little's law</strong>: throughput ≤ threads ÷ time per request = 10 ÷ 0.2 s = <strong>50 requests/s</strong> — and 100 requests in 2.17 s is 46/s.</p>
${lab('threadpool', 'overload', 'en', 'A real worker pool instead of “cores”: capacity = threads ÷ time per request (8 ÷ 25 ms = 320 req/s). At 360 req/s — only 12% too much — the queue grows without end and latency climbs in a straight line. Raise the worker threads and watch the capacity line move.')}
<p>What that means in Spring Boot (defaults from the official property reference): Tomcat's <code>server.tomcat.threads.max</code> is <strong>200</strong> (with 10 kept idle, <code>threads.min-spare</code>), and up to 100 further connections wait in the accept queue (<code>server.tomcat.accept-count</code>). With <code>spring.threads.virtual.enabled=true</code> (Java 21+, default <code>false</code>) requests run on virtual threads instead and <code>threads.max</code> no longer applies. Two caveats from the measurements above: a bigger pool helps only while threads <em>wait</em> — for CPU-bound handlers the cores are the limit (lesson 3.3); and the bottleneck moves to the next pool: HikariCP's default <code>maximumPoolSize</code> is <strong>10</strong> connections, so 200 Tomcat threads (or 10 000 virtual threads) still reach the database ten at a time.</p>
${lab('threadpool', 'dbpool', 'en', 'The next pool: 50 worker threads but only 5 database connections. Adding threads does nothing — they sit waiting for a connection (yellow). The ceiling is the pool behind you, just like 200 Tomcat threads in front of HikariCP’s 10.')}

<h3>Choosing between them</h3>
<table>
<tr><th>Workload</th><th>Node (event loop)</th><th>Spring Boot (thread pool / virtual threads)</th></tr>
<tr><td>Many slow I/O waits (DB, HTTP calls, websockets)</td><td>Excellent: one thread, thousands of waits</td><td>Pool caps you at threads ÷ latency; virtual threads remove that cap</td></tr>
<tr><td>CPU-heavy work in a request</td><td>Blocks everyone — move it to worker_threads or a queue</td><td>Fine up to the number of cores; then it queues</td></tr>
<tr><td>Blocking libraries (JDBC, old SDKs)</td><td>Must not be used on the JS thread</td><td>The classic case for a pool (or virtual threads)</td></tr>
<tr><td>How it fails</td><td>One slow callback freezes all requests (latency spike everywhere)</td><td>Pool exhausted: requests queue, then time out; too many threads thrash a lock (3.3)</td></tr>
</table>
<p>This site's backend is Express on Node, so its rule is the left column: any synchronous CPU-heavy step inside a request handler stalls every other user for its whole duration — exactly the 1.39 s <code>/fast</code> you measured.</p>

<h3>If you have done OSG202 ⭐ CS.3</h3>
<p>The OSG202 deep-dive deck "Threads in backend" goes further on pool sizing, virtual threads and the libuv pool with its own measurements. This lesson is the scheduling view of the same story: an event loop is a non-preemptive FCFS scheduler on one thread; a thread pool is N preemptive workers and Little's law.</p>
${L(OSG('osg202-slide-cs3-1'), '🎓', 'OSG202 · ⭐ CS.3 — Threads in backend', 'Thread-per-request, pool size, virtual threads, the event loop.', 'Open')}

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> an Express endpoint that builds a report makes the whole API freeze for about 2 s, several times an hour; meanwhile the Java team asks whether to raise Tomcat's pool from 200 to 1 000. You answer both with measurements.</p>
<ol>
<li>Run <code>loop-server.js</code>. Fire <code>node load.js 'http://localhost:8080/io?ms=200' 100</code>, then call <code>/cpu?ms=2000</code> and <code>/fast</code> together and read <code>/lag</code>. Write down how long <code>/fast</code> waited.</li>
<li>Run <code>node pool.js</code> with <code>UV_THREADPOOL_SIZE</code> unset, 2 and 8. Sketch when each of the 8 hashes finishes.</li>
<li>Start <code>java PoolServer fixed 10</code>. Predict with Little's law how long 100 requests take, then measure with <code>load.js</code>. Repeat for <code>fixed 50</code> and <code>virtual</code>, and read <code>Threads:</code> from <code>/proc/&lt;pid&gt;/status</code> each time.</li>
<li>Write two sentences for the team: what fixes the Express freeze, and what the Tomcat pool size really limits.</li>
</ol>
<p><strong>Done when:</strong> your Little's-law prediction for <code>fixed 10</code> (≈ 2 s) is within ~10% of the measurement; for <code>fixed 50</code> (≈ 0.4 s) you ran it twice and can explain why the first run is slower (JIT warm-up, threads and connections being created — measured here: 0.70 s cold, 0.48 s warm); and you can explain why moving the report off the JS thread fixes the freeze while a bigger Tomcat pool would not help a CPU-bound or DB-pool-bound service.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['event loop', 'One thread that runs ready callbacks one at a time and sleeps in epoll when none are ready.'],
  ['blocking the event loop (chặn event loop)', 'A long synchronous callback: no other request is served until it returns.'],
  ['libuv thread pool', 'Node’s worker threads for file system, DNS lookup, crypto and zlib; 4 by default (<code>UV_THREADPOOL_SIZE</code>).'],
  ['thread-per-request', 'Each request occupies one thread from a pool until it finishes (Tomcat/Spring MVC).'],
  ['server.tomcat.threads.max', 'Spring Boot’s Tomcat pool size, default 200; ignored when virtual threads are enabled.'],
  ['virtual threads (luồng ảo)', 'JVM-scheduled threads; blocking unmounts them so a few kernel threads carry thousands of requests.'],
  ['Little’s law (định luật Little)', 'Concurrency = throughput × latency, so a pool of N gives at most N ÷ latency requests per second.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Node: one JS thread served 100 concurrent 200 ms waits in 277 ms — waiting costs no thread.</li>
<li>The event loop is non-preemptive FCFS: one 1.5 s CPU callback made <code>/fast</code> wait 1.39 s; move CPU work off the JS thread.</li>
<li>libuv’s pool (4 by default) runs fs/dns/crypto/zlib: 8 hashes finished in two waves (176 / 351 ms) until the pool was 8.</li>
<li>Thread-per-request is capped by Little’s law: pool 10 × 200 ms ⇒ ~50 req/s (100 requests in 2.17 s); pool 200 or virtual threads remove that cap.</li>
<li>Spring Boot defaults: Tomcat 200 threads, accept queue 100, virtual threads off; HikariCP 10 connections is often the real limit.</li>
</ul>
${L('https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop', '🟩', 'Node.js — Don’t block the event loop', 'The official guide to the event loop, the worker pool and what blocks them.', 'Open')}
${L('https://docs.spring.io/spring-boot/appendix/application-properties/index.html', '🍃', 'Spring Boot — Application properties', 'server.tomcat.threads.*, accept-count and spring.threads.virtual.enabled with defaults.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.5</span>
<h2>Hai cách phục vụ hàng nghìn request — cả hai đều là quyết định lập lịch</h2>
<p class="lead">Node.js phục vụ nhiều client bằng <strong>một luồng JavaScript và một event loop</strong>. Spring Boot trên Tomcat cho <strong>mỗi request một luồng riêng lấy từ một pool</strong>. Người ta cãi nhau về chúng như hai tôn giáo. Thật ra chúng là hai câu trả lời cho đúng câu hỏi của chương này — chia vài lõi cho thật nhiều thứ phần lớn thời gian chỉ chờ — và mỗi cách có một kiểu hỏng nặng. Ta đặt cả hai dưới cùng một tải: request chờ 200 ms (một lần gọi cơ sở dữ liệu), và request đốt CPU.</p>

<h3>Node: một luồng JS, rất nhiều lần chờ</h3>
<p>Một máy chủ tí hon: <code>/io</code> chờ như gọi cơ sở dữ liệu (một bộ hẹn giờ: luồng rảnh trong lúc chờ), <code>/cpu</code> đốt CPU trong một vòng lặp, <code>/fast</code> trả lời ngay, và <code>/lag</code> báo bộ hẹn giờ 10 ms của chính event loop đã chạy muộn bao nhiêu — tức luồng JS đã bận bao lâu:</p>
${src('ch03/loop-server.js', 'javascript')}
${run('c35-loop', 'cat server.log')}
${run('c35-loop', "node load.js 'http://localhost:8080/io")}
${run('c35-loop', "curl -s 'http://localhost:8080/lag'")}
<p><strong>100 request, mỗi cái chờ 200 ms, xong hết trong 277 ms — trên một luồng JavaScript.</strong> Chờ không phải là chạy: trong lúc một request chờ, callback của nó chỉ là một mục trong danh sách hẹn giờ (với socket thì là một fd đăng ký với epoll — Chương 10), và luồng đi chạy callback khác. Event loop chưa bao giờ trễ quá 5 ms. Đó là lý do Node rất giỏi với API nặng I/O.</p>

<h3>Chặn event loop: một request chậm làm đứng tất cả</h3>
<p>Giờ một client gọi <code>/cpu?ms=1500</code> và 0,1 s sau, một client khác gọi <code>/fast</code>:</p>
${run('c35-loop', "curl -s 'http://localhost:8080/cpu?ms=1500'", 2)}
<p><code>/fast</code> mất <strong>1,39 s</strong>, và event loop bị chặn 1 491 ms. Callback JavaScript không bao giờ bị giành CPU: bộ lập lịch của event loop là FCFS thuần, nên một callback dài là một đoàn xe cho mọi người dùng của tiến trình. Mười request CPU, mỗi cái 100 ms, được phục vụ lần lượt từng cái một:</p>
${run('c35-loop', "node load.js 'http://localhost:8080/cpu", 2)}
${lab('eventloop', 'block', 'vi', 'Event loop thật: một request chạy 200 ms việc đồng bộ trên luồng JavaScript duy nhất, và các request tới trong lúc đó — mỗi cái gần như không tốn việc — phải chờ khoảng 197 và 194 ms. Nhìn call stack bận suốt trong khi callback của chúng dồn lại; rồi chuyển sang “offload”.', { tour: 'eventloop-block' })}
<div class="pitfall co-tieu-de">
<p><strong>"Tôi đã viết async rồi, nên nó không chặn được."</strong> <code>async</code>/<code>await</code> không dời việc ra khỏi luồng; nó chỉ cho bạn chờ những việc diễn ra <em>ở chỗ khác</em> (nhân, pool libuv, một máy chủ khác). Một hàm nặng CPU được <code>await</code> — <code>JSON.parse</code> một body 50 MB, <code>bcrypt</code> đồng bộ, một regex thảm hoạ, <code>fs.readFileSync</code> trong handler, dựng một PDF lớn — vẫn chặn event loop của mọi người. Dời việc đó sang <code>worker_threads</code> (Chương 4), sang hàng đợi job, hoặc chia nhỏ ra.</p>
</div>

<h3>Thread pool ẩn của Node (libuv)</h3>
<p>Có những việc epoll không làm được: lời gọi hệ thống file, <code>dns.lookup</code>, và các hàm dựng sẵn nặng CPU như <code>crypto.pbkdf2</code> và <code>zlib</code>. libuv chạy chúng trên <strong>thread pool riêng, mặc định 4 luồng</strong> (<code>UV_THREADPOOL_SIZE</code>). Tám lần băm pbkdf2 cùng lúc:</p>
${src('ch03/pool.js', 'javascript')}
${run('c35-loop', 'node pool.js')}
${run('c35-loop', 'UV_THREADPOOL_SIZE=8')}
<p>Pool mặc định: <strong>4 cái xong lúc 176 ms, 4 cái còn lại lúc ~351 ms</strong> — hai đợt, y như bộ lập lịch 4 lõi gặp 8 việc. Với 8 luồng, tất cả xong khoảng 180 ms. Và bạn thấy được pool xuất hiện: 7 luồng lúc trước, 11 lúc sau (bốn <code>libuv-worker</code>), 15 khi cỡ là 8. Hãy đặt cỡ theo số CPU bạn thật sự có (<code>os.availableParallelism()</code>, bài 3.4) và đặt trước lần dùng đầu tiên — pool chỉ được tạo một lần. Socket mạng <em>không</em> dùng pool này.</p>
${lab('eventloop', 'pool', 'vi', 'Cùng thí nghiệm, chiếu chậm: 8 lần pbkdf2 trên pool 4 luồng xong thành hai đợt (100 và 200 ms), một readFile 1 ms xếp sau chúng phải chờ tới 201 ms, còn request https (epoll, không cần luồng pool) không bị trễ. Đổi UV_THREADPOOL_SIZE thành 1, 2, 4, 8.')}

<h3>Spring Boot / Tomcat: một request, một luồng</h3>
<p>Phía JVM, thu gọn tới cốt lõi: một máy chủ HTTP có handler bị chặn 200 ms (như một lời gọi JDBC), chạy trên một pool cố định N luồng — chính là Tomcat bên trong Spring Boot — hoặc trên luồng ảo:</p>
${src('ch03/PoolServer.java', 'java')}
${run('c35-loop', 'javac -d . PoolServer.java', 4)}
<p>Pool <strong>10</strong>: 100 request mất <strong>2,17 s</strong> — mười đợt 200 ms. Pool <strong>200</strong>: 0,57 s, với 173 luồng đang sống. <strong>Luồng ảo</strong>: 0,36 s với chỉ 31 luồng nhân. Cỡ pool là trần cứng của số việc làm đồng thời, cho bởi <strong>định luật Little</strong>: thông lượng ≤ số luồng ÷ thời gian mỗi request = 10 ÷ 0,2 s = <strong>50 request/giây</strong> — và 100 request trong 2,17 s là 46/giây.</p>
${lab('threadpool', 'overload', 'vi', 'Một pool worker thật thay cho “lõi”: sức chứa = số luồng ÷ thời gian mỗi request (8 ÷ 25 ms = 320 req/s). Ở 360 req/s — chỉ thừa 12% — hàng đợi dài ra mãi và độ trễ leo theo đường thẳng. Tăng số luồng worker và nhìn đường sức chứa dịch chuyển.')}
<p>Điều đó nghĩa là gì trong Spring Boot (mặc định lấy từ bảng thuộc tính chính thức): <code>server.tomcat.threads.max</code> của Tomcat là <strong>200</strong> (giữ sẵn 10 luồng rảnh, <code>threads.min-spare</code>), và thêm tối đa 100 kết nối nữa chờ trong hàng nhận (<code>server.tomcat.accept-count</code>). Với <code>spring.threads.virtual.enabled=true</code> (Java 21+, mặc định <code>false</code>) request chạy trên luồng ảo và <code>threads.max</code> không còn tác dụng. Hai lưu ý từ số đo ở trên: pool to hơn chỉ giúp khi luồng đang <em>chờ</em> — với handler nặng CPU thì số lõi mới là giới hạn (bài 3.3); và nút cổ chai dời sang pool kế tiếp: <code>maximumPoolSize</code> mặc định của HikariCP là <strong>10</strong> kết nối, nên 200 luồng Tomcat (hay 10 000 luồng ảo) vẫn tới cơ sở dữ liệu mười cái một lúc.</p>
${lab('threadpool', 'dbpool', 'vi', 'Pool kế tiếp: 50 luồng worker nhưng chỉ 5 kết nối CSDL. Thêm luồng chẳng được gì — chúng ngồi chờ kết nối (màu vàng). Trần là cái pool phía sau, y như 200 luồng Tomcat đứng trước 10 kết nối của HikariCP.')}

<h3>Chọn giữa hai cách</h3>
<table>
<tr><th>Loại tải</th><th>Node (event loop)</th><th>Spring Boot (thread pool / luồng ảo)</th></tr>
<tr><td>Nhiều lần chờ I/O chậm (CSDL, gọi HTTP, websocket)</td><td>Rất tốt: một luồng, hàng nghìn lần chờ</td><td>Pool chặn trần ở số luồng ÷ độ trễ; luồng ảo gỡ trần đó</td></tr>
<tr><td>Việc nặng CPU trong request</td><td>Chặn tất cả — dời sang worker_threads hoặc hàng đợi</td><td>Ổn tới số lõi; quá đó thì xếp hàng</td></tr>
<tr><td>Thư viện chặn (JDBC, SDK cũ)</td><td>Không được dùng trên luồng JS</td><td>Trường hợp kinh điển cho pool (hoặc luồng ảo)</td></tr>
<tr><td>Hỏng kiểu gì</td><td>Một callback chậm làm đứng mọi request (độ trễ vọt lên ở khắp nơi)</td><td>Cạn pool: request xếp hàng rồi hết giờ; quá nhiều luồng thì tranh khoá (3.3)</td></tr>
</table>
<p>Backend của chính trang này là Express trên Node, nên luật của nó là cột bên trái: bất kỳ bước đồng bộ nặng CPU nào trong handler cũng làm đứng mọi người dùng khác suốt thời gian nó chạy — đúng cái <code>/fast</code> 1,39 s bạn vừa đo.</p>

<h3>Nếu bạn đã học OSG202 ⭐ CS.3</h3>
<p>Deck chuyên sâu "Luồng trong backend" của OSG202 đi xa hơn về chọn cỡ pool, luồng ảo và pool libuv với số đo riêng của nó. Bài này là góc nhìn lập lịch của cùng câu chuyện: event loop là một bộ lập lịch FCFS không giành CPU trên một luồng; thread pool là N thợ có giành CPU cộng với định luật Little.</p>
${L(OSG('osg202-slide-cs3-1'), '🎓', 'OSG202 · ⭐ CS.3 — Luồng trong backend', 'Mỗi request một luồng, cỡ pool, luồng ảo, event loop.', 'Mở')}

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một endpoint Express dựng báo cáo làm cả API đứng khoảng 2 s, vài lần mỗi giờ; cùng lúc nhóm Java hỏi có nên tăng pool Tomcat từ 200 lên 1 000 không. Bạn trả lời cả hai bằng số đo.</p>
<ol>
<li>Chạy <code>loop-server.js</code>. Bắn <code>node load.js 'http://localhost:8080/io?ms=200' 100</code>, rồi gọi <code>/cpu?ms=2000</code> và <code>/fast</code> cùng lúc và đọc <code>/lag</code>. Ghi lại <code>/fast</code> đã phải chờ bao lâu.</li>
<li>Chạy <code>node pool.js</code> với <code>UV_THREADPOOL_SIZE</code> không đặt, bằng 2 và bằng 8. Phác ra lúc mỗi trong 8 lần băm xong.</li>
<li>Khởi <code>java PoolServer fixed 10</code>. Dùng định luật Little đoán 100 request mất bao lâu, rồi đo bằng <code>load.js</code>. Lặp lại với <code>fixed 50</code> và <code>virtual</code>, mỗi lần đọc <code>Threads:</code> trong <code>/proc/&lt;pid&gt;/status</code>.</li>
<li>Viết hai câu cho nhóm: cái gì sửa được cơn đứng của Express, và cỡ pool Tomcat thật ra giới hạn cái gì.</li>
</ol>
<p><strong>Đạt khi:</strong> dự đoán bằng định luật Little cho <code>fixed 10</code> (≈ 2 s) lệch số đo không quá ~10%; với <code>fixed 50</code> (≈ 0,4 s) bạn đã chạy hai lần và giải thích được vì sao lần đầu chậm hơn (JIT còn nguội, luồng và kết nối đang được tạo — đo ở đây: 0,70 s lần đầu, 0,48 s lần sau); và bạn giải thích được vì sao dời báo cáo khỏi luồng JS sửa được cơn đứng, còn pool Tomcat to hơn không giúp một dịch vụ bị giới hạn bởi CPU hay pool kết nối CSDL.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['event loop (vòng lặp sự kiện)', 'Một luồng chạy lần lượt các callback đã sẵn sàng và ngủ trong epoll khi không có cái nào.'],
  ['blocking the event loop (chặn event loop)', 'Một callback đồng bộ dài: không request nào khác được phục vụ tới khi nó trả về.'],
  ['libuv thread pool', 'Các luồng thợ của Node cho hệ thống file, tra DNS, mã hoá và nén; mặc định 4 (<code>UV_THREADPOOL_SIZE</code>).'],
  ['thread-per-request (mỗi request một luồng)', 'Mỗi request chiếm một luồng của pool tới khi xong (Tomcat/Spring MVC).'],
  ['server.tomcat.threads.max', 'Cỡ pool Tomcat của Spring Boot, mặc định 200; bị bỏ qua khi bật luồng ảo.'],
  ['virtual threads (luồng ảo)', 'Luồng do JVM lập lịch; khi bị chặn thì được gỡ ra, nên vài luồng nhân chở được hàng nghìn request.'],
  ['Little’s law (định luật Little)', 'Số việc đồng thời = thông lượng × độ trễ, nên pool N luồng cho tối đa N ÷ độ trễ request mỗi giây.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Node: một luồng JS phục vụ 100 lần chờ 200 ms đồng thời trong 277 ms — chờ không tốn luồng.</li>
<li>Event loop là FCFS không giành CPU: một callback CPU 1,5 s bắt <code>/fast</code> chờ 1,39 s; hãy dời việc CPU khỏi luồng JS.</li>
<li>Pool của libuv (mặc định 4) chạy fs/dns/crypto/zlib: 8 lần băm xong thành hai đợt (176 / 351 ms) cho tới khi pool là 8.</li>
<li>Mỗi request một luồng bị định luật Little chặn trần: pool 10 × 200 ms ⇒ ~50 request/giây (100 request trong 2,17 s); pool 200 hoặc luồng ảo gỡ trần đó.</li>
<li>Mặc định Spring Boot: Tomcat 200 luồng, hàng nhận 100, luồng ảo tắt; 10 kết nối của HikariCP thường mới là giới hạn thật.</li>
</ul>
${L('https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop', '🟩', 'Node.js — Don’t block the event loop', 'Hướng dẫn chính thức về event loop, worker pool và những gì chặn chúng.', 'Mở')}
${L('https://docs.spring.io/spring-boot/appendix/application-properties/index.html', '🍃', 'Spring Boot — Application properties', 'server.tomcat.threads.*, accept-count và spring.threads.virtual.enabled kèm mặc định.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 3.6 — Quiz ───────────────────────── */
    {
      title: '3.6 — Chapter 3 check|||3.6 — Kiểm tra Chương 3',
      slug: 'os-3-6-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống về luồng (TID, stack, VSZ), lập lịch (SRTF, nice dưới tranh chấp), chuyển ngữ cảnh (perf stat), số lõi trong container và throttling, event loop của Node và pool của Spring theo định luật Little.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Check</span>
<h2>Do you understand threads and scheduling?</h2>
<p class="lead">Ten scenario questions, most built on outputs you measured in this chapter — because reading a real number and knowing what it means is the skill.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can show what threads of one process share and what each keeps, using <code>/proc/&lt;pid&gt;/task</code>.</li>
<li>I can compute FCFS/SJF/SRTF/RR averages and explain why Linux shares the CPU by weight instead.</li>
<li>I can count context switches with <code>vmstat</code>, <code>pidstat -w</code>, <code>perf stat</code> and tell voluntary from involuntary.</li>
<li>I know the three meanings of "number of CPUs" in a container and how to spot quota throttling.</li>
<li>I can explain when Node's event loop blocks and what a Tomcat pool size really limits.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Kiểm tra</span>
<h2>Bạn đã hiểu luồng và lập lịch chưa?</h2>
<p class="lead">Mười câu tình huống, phần lớn dựng trên chính output bạn đã đo trong chương — vì đọc một con số thật và biết nó nghĩa là gì mới là kỹ năng.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi chỉ ra được các luồng của một tiến trình dùng chung gì và giữ riêng gì, bằng <code>/proc/&lt;pid&gt;/task</code>.</li>
<li>Tôi tính được trung bình FCFS/SJF/SRTF/RR và giải thích vì sao Linux lại chia CPU theo trọng số.</li>
<li>Tôi đếm được số lần chuyển ngữ cảnh bằng <code>vmstat</code>, <code>pidstat -w</code>, <code>perf stat</code> và phân biệt tự nguyện với bị giành.</li>
<li>Tôi biết ba nghĩa của "số CPU" trong container và cách phát hiện bị bóp quota.</li>
<li>Tôi giải thích được khi nào event loop của Node bị chặn và cỡ pool Tomcat thật ra giới hạn cái gì.</li>
</ul>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          { question: 'Four threads of one C program print: same <code>pid=17</code>, different <code>tid</code>, the same <code>&amp;global</code> and <code>heap</code> address, but a different <code>&amp;local</code> each. What does this show?|||Bốn luồng của một chương trình C in ra: cùng <code>pid=17</code>, <code>tid</code> khác nhau, cùng địa chỉ <code>&amp;global</code> và <code>heap</code>, nhưng <code>&amp;local</code> mỗi luồng một khác. Điều này cho thấy gì?',
            options: ['Each thread is a separate process with copied memory|||Mỗi luồng là một tiến trình riêng với bộ nhớ được chép', 'Globals and the heap are shared; each thread has its own stack|||Biến toàn cục và heap dùng chung; mỗi luồng có stack riêng', 'Everything is shared, including local variables|||Mọi thứ đều dùng chung, kể cả biến cục bộ', 'The heap is per-thread; globals are shared|||Heap là riêng từng luồng; biến toàn cục dùng chung'],
            correctIndex: 1, points: 1,
            explanation: 'EN: Same PID = one process; identical addresses for the global and the malloc block = one shared copy; different local addresses (8 MiB + 64 KiB apart) = one stack per thread. A forked process would have a different PID, and the heap is not per-thread.|||VI: Cùng PID = một tiến trình; địa chỉ biến toàn cục và khối malloc giống hệt = một bản dùng chung; địa chỉ biến cục bộ khác nhau (cách nhau 8 MiB + 64 KiB) = mỗi luồng một stack. Một tiến trình fork ra sẽ có PID khác, và heap không phải riêng từng luồng.' },
          { question: 'An Express handler runs a synchronous 1.5-second CPU loop. While it runs, another user calls <code>GET /fast</code>, which normally answers in 1 ms. What happens?|||Một handler Express chạy vòng lặp CPU đồng bộ 1,5 giây. Trong lúc đó, người dùng khác gọi <code>GET /fast</code>, bình thường trả lời trong 1 ms. Chuyện gì xảy ra?',
            options: ['/fast answers in ~1 ms because Node is asynchronous|||/fast trả lời trong ~1 ms vì Node là bất đồng bộ', '/fast runs on a libuv pool thread in parallel|||/fast chạy song song trên một luồng của pool libuv', 'The kernel preempts the loop every 2.8 ms, so /fast waits a few ms|||Nhân giành CPU khỏi vòng lặp mỗi 2,8 ms nên /fast chỉ chờ vài ms', '/fast waits until the loop ends (~1.4 s): JS callbacks run one at a time and are never preempted|||/fast chờ tới khi vòng lặp xong (~1,4 s): callback JS chạy lần lượt và không bao giờ bị giành CPU'],
            correctIndex: 3, points: 1,
            explanation: 'EN: Measured in lesson 3.5: /fast took 1.39 s. The kernel can preempt the Node thread, but it resumes the same JS callback — the event loop itself is FCFS and cannot switch to another callback mid-function. HTTP handling does not go to the libuv pool.|||VI: Đo ở bài 3.5: /fast mất 1,39 s. Nhân có thể giành CPU khỏi luồng Node, nhưng rồi lại chạy tiếp đúng callback JS đó — event loop là FCFS và không thể chuyển sang callback khác giữa chừng một hàm. Xử lý HTTP không đi qua pool libuv.' },
          { question: 'A process with 1 000 threads shows <code>VmSize 8 259 408 kB</code> and <code>VmRSS 9 792 kB</code>. A teammate says "threads are eating 8 GB of RAM". Correct?|||Một tiến trình 1 000 luồng hiện <code>VmSize 8 259 408 kB</code> và <code>VmRSS 9 792 kB</code>. Một bạn nói "luồng đang ăn 8 GB RAM". Đúng không?',
            options: ['No: each thread reserves an 8 MB stack virtually; only touched pages count, ~10 MB of real RAM|||Không: mỗi luồng đặt trước 8 MB stack ảo; chỉ trang đã chạm mới tính, RAM thật ~10 MB', 'Yes: VmSize is the RAM in use|||Đúng: VmSize là RAM đang dùng', 'Yes, but only until the threads exit|||Đúng, nhưng chỉ tới khi các luồng thoát', 'No: threads use no memory at all|||Không: luồng không tốn chút bộ nhớ nào'],
            correctIndex: 0, points: 1,
            explanation: 'EN: VSZ counts every mapping, including 1 000 × 8 MB of reserved stacks; RSS (9.8 MB) is the physical RAM. Threads do cost something (the touched stack pages, kernel structures), which is why RSS grew from 1.5 to 9.8 MB — but nowhere near 8 GB.|||VI: VSZ đếm mọi ánh xạ, gồm 1 000 × 8 MB stack đặt trước; RSS (9,8 MB) mới là RAM vật lý. Luồng có tốn chút ít (trang stack đã chạm, cấu trúc của nhân), nên RSS tăng từ 1,5 lên 9,8 MB — nhưng còn rất xa 8 GB.' },
          { question: 'P1 (arrives 0, burst 8), P2 (1, 4), P3 (2, 9), P4 (3, 5). Average waiting time under SRTF?|||P1 (đến 0, cần 8), P2 (1, 4), P3 (2, 9), P4 (3, 5). Thời gian chờ trung bình theo SRTF?',
            options: ['8.75|||8,75', '7.75|||7,75', '6.5|||6,5', '11.75|||11,75'],
            correctIndex: 2, points: 1,
            explanation: 'EN: SRTF runs P1 0–1, P2 1–5, P4 5–10, P1 10–17, P3 17–26. Waiting: P1 9, P2 0, P3 15, P4 2 → 26 / 4 = 6.5. 8.75 is FCFS, 7.75 non-preemptive SJF, 11.75 RR with quantum 4.|||VI: SRTF chạy P1 0–1, P2 1–5, P4 5–10, P1 10–17, P3 17–26. Chờ: P1 9, P2 0, P3 15, P4 2 → 26 / 4 = 6,5. 8,75 là FCFS, 7,75 là SJF không giành, 11,75 là RR quantum 4.' },
          { question: 'Two CPU hogs are pinned to the same core for 4 s, one at nice 0 and one at nice 5. Roughly how much CPU time does each get?|||Hai con hog bị ghim cùng một lõi trong 4 s, một ở nice 0 và một ở nice 5. Mỗi con được khoảng bao nhiêu thời gian CPU?',
            options: ['2.0 s and 2.0 s — nice only affects I/O|||2,0 s và 2,0 s — nice chỉ ảnh hưởng I/O', '3.0 s and 1.0 s — weights 1024 : 335|||3,0 s và 1,0 s — trọng số 1024 : 335', '4.0 s and 0 s — nice 5 never runs while nice 0 is busy|||4,0 s và 0 s — nice 5 không bao giờ chạy khi nice 0 đang bận', '2.5 s and 1.5 s — each nice step is 5%|||2,5 s và 1,5 s — mỗi nấc nice là 5%'],
            correctIndex: 1, points: 1,
            explanation: 'EN: Measured 3.01 s vs 0.99 s: CFS/EEVDF share by weight, 1024 / (1024 + 335) ≈ 75%. A lower-priority normal task is never starved completely; even nice 19 got 0.06 s. Each nice step is about ×1.25 in weight, not 5%.|||VI: Đo được 3,01 s và 0,99 s: CFS/EEVDF chia theo trọng số, 1024 / (1024 + 335) ≈ 75%. Task thường ưu tiên thấp không bao giờ bị bỏ đói hoàn toàn; ngay cả nice 19 cũng được 0,06 s. Mỗi nấc nice đổi trọng số khoảng ×1,25, không phải 5%.' },
          { question: 'The same two hogs (nice 0 and nice 5) run on an otherwise idle 10-core machine, not pinned. What happens?|||Vẫn hai con hog đó (nice 0 và nice 5) chạy trên máy 10 lõi đang rảnh, không ghim. Chuyện gì xảy ra?',
            options: ['Both get about 4 s of CPU — with free cores there is no contention, so nice changes nothing|||Cả hai được khoảng 4 s CPU — còn lõi rảnh thì không có tranh chấp, nên nice chẳng đổi gì', 'nice 0 gets 75% of one core, nice 5 gets 25%|||nice 0 được 75% một lõi, nice 5 được 25%', 'nice 5 is capped at half a core|||nice 5 bị giới hạn ở nửa lõi', 'The kernel puts both on CPU 0 to respect priorities|||Nhân đặt cả hai lên CPU 0 để tôn trọng ưu tiên'],
            correctIndex: 0, points: 1,
            explanation: 'EN: Measured 4.11 s each. nice is a share under contention, not a cap; each hog had its own core. To cap a job you need a cgroup quota (cpu.max / --cpus).|||VI: Đo được mỗi con 4,11 s. nice là phần chia khi có tranh chấp, không phải trần; mỗi con có riêng một lõi. Muốn đặt trần cho một job thì cần quota của cgroup (cpu.max / --cpus).' },
          { question: '<code>perf stat -e context-switches taskset -c 0 ./pingpong 100000</code> — parent and child bounce a byte through two pipes 100 000 times on one core. About how many context switches?|||<code>perf stat -e context-switches taskset -c 0 ./pingpong 100000</code> — cha và con chuyền một byte qua hai pipe 100 000 lần trên một lõi. Khoảng bao nhiêu lần chuyển ngữ cảnh?',
            options: ['About 100|||Khoảng 100', 'About 100 000|||Khoảng 100 000', 'About 400 000|||Khoảng 400 000', 'About 200 000 — two per round trip|||Khoảng 200 000 — hai lần mỗi vòng'],
            correctIndex: 3, points: 1,
            explanation: 'EN: Measured 200 006. Each round trip is parent → child → parent on one core: two switches. The read/write syscalls do not themselves switch tasks unless a task blocks; that is why it is not 400 000.|||VI: Đo được 200 006. Mỗi vòng là cha → con → cha trên một lõi: hai lần chuyển. Bản thân syscall read/write không chuyển task trừ khi task bị chặn; vì thế không phải 400 000.' },
          { question: 'A container runs with <code>--cpus 1.5</code> on a 10-core host. What do Node’s <code>os.cpus().length</code> and <code>os.availableParallelism()</code> return?|||Một container chạy với <code>--cpus 1.5</code> trên máy 10 lõi. <code>os.cpus().length</code> và <code>os.availableParallelism()</code> của Node trả về gì?',
            options: ['2 and 2|||2 và 2', '10 and 10|||10 và 10', '10 and 1|||10 và 1', '1.5 and 1.5|||1,5 và 1,5'],
            correctIndex: 2, points: 1,
            explanation: 'EN: Measured: os.cpus().length lists the machine’s 10 CPUs; availableParallelism() honours the quota and rounds 1.5 down to 1. In the same container nproc and Java said 2 and Python’s os.cpu_count() said 10 — so sizing a cluster from os.cpus().length starts 10 workers on 1.5 CPUs.|||VI: Đo thật: os.cpus().length liệt kê 10 CPU của máy; availableParallelism() tính quota và làm tròn 1,5 xuống 1. Cùng container đó nproc và Java nói 2, còn os.cpu_count() của Python nói 10 — nên chọn số worker cluster theo os.cpus().length sẽ khởi 10 worker trên 1,5 CPU.' },
          { question: 'In a <code>--cpus 1</code> container, average CPU looks like 40%, yet every few seconds some requests take 60 ms instead of 2 ms. What proves the cause?|||Trong container <code>--cpus 1</code>, CPU trung bình trông như 40%, nhưng cứ vài giây lại có request mất 60 ms thay vì 2 ms. Cái gì chứng minh được nguyên nhân?',
            options: ['vmstat shows high cs|||vmstat có cs cao', '/sys/fs/cgroup/cpu.stat: nr_throttled and throttled_usec growing — the quota is used up early in each 100 ms period|||/sys/fs/cgroup/cpu.stat: nr_throttled và throttled_usec tăng — quota bị dùng hết sớm trong mỗi chu kỳ 100 ms', 'dmesg shows the OOM killer|||dmesg hiện OOM killer', 'nproc returns 1|||nproc trả về 1'],
            correctIndex: 1, points: 1,
            explanation: 'EN: The quota is enforced per period: busy threads burn it early, then the whole cgroup is frozen until the next period. In lesson 3.4 p99 went from 2.4 to 60.4 ms with 3 background threads, and cpu.stat counted the throttled periods. nproc only tells you the size, not that throttling happens; OOM is about memory.|||VI: Quota được áp theo từng chu kỳ: luồng bận đốt hết sớm, rồi cả cgroup bị đóng băng tới chu kỳ sau. Ở bài 3.4 p99 từ 2,4 lên 60,4 ms với 3 luồng nền, và cpu.stat đếm được các chu kỳ bị bóp. nproc chỉ cho biết cỡ, không cho biết có bị bóp; OOM là chuyện bộ nhớ.' },
          { question: 'A thread-per-request server has a pool of 10 threads; each request blocks for 200 ms on the database. 100 requests arrive at once. About how long until all are answered?|||Một máy chủ mỗi request một luồng có pool 10 luồng; mỗi request bị chặn 200 ms chờ cơ sở dữ liệu. 100 request tới cùng lúc. Khoảng bao lâu thì tất cả được trả lời?',
            options: ['About 2 s — at most 10 ÷ 0.2 s = 50 requests per second (Little’s law)|||Khoảng 2 s — tối đa 10 ÷ 0,2 s = 50 request mỗi giây (định luật Little)', 'About 0.2 s — threads run in parallel|||Khoảng 0,2 s — các luồng chạy song song', 'About 20 s — one request at a time|||Khoảng 20 s — từng request một', 'It depends only on the number of CPU cores|||Chỉ phụ thuộc vào số lõi CPU'],
            correctIndex: 0, points: 1,
            explanation: 'EN: Ten requests run per 200 ms wave, so 100 requests need 10 waves ≈ 2 s; measured 2.17 s. 0.2 s needs ≥100 threads or virtual threads (measured 0.36 s). The threads are waiting, not computing, so CPU cores are not the limit here.|||VI: Mỗi đợt 200 ms chạy được mười request, nên 100 request cần 10 đợt ≈ 2 s; đo được 2,17 s. Muốn 0,2 s thì cần ≥100 luồng hoặc luồng ảo (đo được 0,36 s). Các luồng đang chờ chứ không tính toán, nên số lõi CPU không phải giới hạn ở đây.' },
        ],
      },
    },
  ],
};
