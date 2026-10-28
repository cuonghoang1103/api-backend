/**
 * Operating Systems for Developers — Chương 6: Deadlock và các bài toán kinh điển (soạn 28/10/2026 theo _HOP-DONG.md).
 * Output CHẠY THẬT trong ảnh `os-lab` (lab/code/ch06 → lab/out/c61-dl [container --privileged vứt đi, để đọc
 * /proc/<pid>/task/<tid>/stack], c62-live [--cap-add SYS_NICE cho SCHED_FIFO], c63-philo, c64-bank) và trong container vứt đi
 * `postgres:17` (os-pg6, logging_collector bật → lab/out/c64-db) — cùng bộ chạy `phien`. Kịch bản chép mã sang /tmp/w rồi
 * dựng ở đó (không để lại tệp nhị phân trong repo).
 * Máy đo: Docker Desktop trên Apple Silicon (arm64, 10 lõi, nhân linuxkit), gcc 15, gdb, Java 21, Node 22, Python 3.14,
 * PostgreSQL 17.11.
 * LUẬT escaping: < > → &lt; &gt;; & → &amp;; không backtick trần, không gạch chéo ngược trong thân bài.
 */
import { run, src, card, kv, cmd, details } from './_ui.mjs';
import { lab } from './_lab.mjs';
import G61 from './giang/os-06-1.mjs';
import G62 from './giang/os-06-2.mjs';
import G63 from './giang/os-06-3.mjs';
import G64 from './giang/os-06-4.mjs';

const L = (href, ico, t, s, cta) => card(href, ico, t, s, cta);
const OSG61 = '/courses/operating-systems/learn?lessonSlug=osg202-6-1-deadlock';
const OSG62 = '/courses/operating-systems/learn?lessonSlug=osg202-6-2-banker';
const OSG26 = '/courses/operating-systems/learn?lessonSlug=osg202-2-6-bai-toan-ipc';
const PG11 = '/courses/postgresql/learn?lessonSlug=postgresql-11-4-khoa-deadlock';
const OSTEP = 'https://pages.cs.wisc.edu/~remzi/OSTEP/threads-bugs.pdf';
const MARS = 'https://www.cs.cornell.edu/courses/cs614/1999sp/papers/pathfinder.html';

export default {
  title: 'Chapter 6 — Deadlock and classic problems|||Chương 6 — Deadlock và các bài toán kinh điển',
  description: 'Khi mọi người cùng chờ nhau: deadlock tái hiện bằng C/Java và chẩn đoán bằng ps, /proc, gdb, jstack; bốn điều kiện Coffman và đồ thị chờ; phòng bằng thứ tự khoá và try-lock; livelock, đói và đảo ngược ưu tiên (Mars Pathfinder, 540 ms → 40 ms); triết gia ăn tối giải ba cách, bộ đệm giới hạn và đọc-ghi dạng đề thi; thuật toán Banker từng bước, thuật toán phát hiện, deadlock thật trong PostgreSQL 17 và deadlock pool kết nối trong Node.',
  lessons: [
    /* ───────────────────────── 6.1 — Deadlock ───────────────────────── */
    {
      title: '6.1 — Deadlock: the four Coffman conditions, found with gdb and jstack|||6.1 — Deadlock: bốn điều kiện Coffman, tìm ra bằng gdb và jstack',
      slug: 'os-6-1-deadlock',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Hai lệnh chuyển tiền ngược chiều làm chương trình C và Java treo vĩnh viễn với 0% CPU; tìm vòng chờ bằng ps, wchan, stack nhân, gdb và jstack; bốn điều kiện Coffman, đồ thị cấp phát và đồ thị chờ; phòng bằng thứ tự khoá cố định và try-lock có thời hạn.',
      content: `${G61}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Two transfers that wait for each other forever</h2>
<p class="lead">Chapter 5 made every critical section correct with a lock. Now give a transfer two locks — one per account — and run two transfers in opposite directions. The program stops. No crash, no error, no CPU: just two threads, each holding what the other needs. How do you prove that from outside a frozen process, and how do you make it impossible?</p>

<h3>Make it happen in C</h3>
<p>A transfer must change two balances atomically, so it locks both accounts. That is correct for a single thread. T1 moves money A → B, T2 moves money B → A, 5,000 times each:</p>
${src('ch06/dl.c', 'c')}
${run('c61-dl', 'timeout 5 ./dl naive')}
<p>Exit code <strong>124</strong> means <code>timeout</code> had to kill it: in five seconds the program never finished even one round of transfers. The <code>usleep(1)</code> between the two locks stands for "read the balance, check the daily limit" — in a real service it is a database call or a log write, and the window is wider still.</p>

<h3>Prove it from outside: ps, wchan and the kernel stack</h3>
<p>Run it again in the background and look at it the way you would look at a stuck production process:</p>
${run('c61-dl', './dl naive & sleep 1', 3)}
${run('c61-dl', 'grep -m 4 .')}
<p>Three facts. Every thread is in state <strong>S</strong> (sleeping) at <strong>0.0% CPU</strong> — a deadlock looks <em>idle</em>, so a CPU alert will never fire. <code>wchan</code> (the kernel function a sleeping thread waits in) and the kernel stack (readable by root) both say <code>futex_do_wait</code>: the slow path of a mutex from lesson 5.2. And the kernel cannot tell you more — it knows the threads wait on futex words, not which thread is supposed to release them.</p>

<h3>gdb: who holds what</h3>
<p>The answer lives in user space, so attach a debugger to the live process (it keeps running afterwards):</p>
${run('c61-dl', 'gdb -p $P -batch -ex "thread', 2)}
<p>LWP 30 is inside <code>transfer(from=B, to=A)</code> and blocked locking <strong>A</strong>; LWP 29 is inside <code>transfer(from=A, to=B)</code> and blocked locking <strong>B</strong>. glibc stores the owner's thread id inside the mutex, so the last command reads it directly: A is owned by 29, B by 30. Each thread waits for a lock its partner owns. Step through exactly this in the lab — pick who runs next and watch the dashed "waits for" arrows close into a loop:</p>
${lab('race', 'deadlock', 'en', 'Two bank transfers, T1 locks A then B, T2 locks B then A. Step them one instruction at a time; when each holds one lock and waits for the other, the wait-for arrows form a cycle and nothing can move.', { tour: 'race-deadlock' })}

<h3>The four Coffman conditions</h3>
<p>In 1971 Coffman, Elphick and Shoshani showed that a deadlock needs <strong>all four</strong> of these at once:</p>
<ol>
<li><strong>Mutual exclusion</strong> — a resource can be held by only one thread (a mutex, a row lock, a file lock).</li>
<li><strong>Hold and wait</strong> — a thread keeps what it holds while waiting for more (T1 keeps A while asking for B).</li>
<li><strong>No preemption</strong> — nobody can take a lock away; only the holder releases it.</li>
<li><strong>Circular wait</strong> — T1 waits for T2, T2 waits for T1: a cycle.</li>
</ol>
<p>Remove any one and deadlock is impossible. That is the whole theory of prevention, and every fix in this chapter is "break condition N".</p>

<h3>Resource-allocation graph and wait-for graph</h3>
<p>The textbook draws a <strong>resource-allocation graph</strong>: circles for threads, boxes for resources (a dot per instance), an <em>assignment</em> edge from a resource to the thread holding it, a <em>request</em> edge from a thread to the resource it waits for. For our program: A → T1, T1 → B, B → T2, T2 → A. Collapse the resources and you get the <strong>wait-for graph</strong>: T1 → T2 → T1. With one instance per resource, <em>a cycle in the wait-for graph means deadlock</em>. With several instances (a pool of 10 connections) a cycle only means deadlock is possible — lesson 6.4 handles that case.</p>
<table>
<tr><th>graph</th><th>nodes</th><th>edges</th><th>a cycle means</th></tr>
<tr><td>resource-allocation</td><td>threads + resources</td><td>request (T → R), assignment (R → T)</td><td>deadlock if every resource has one instance; otherwise maybe</td></tr>
<tr><td>wait-for</td><td>threads only</td><td>T1 → T2 if T1 waits for something T2 holds</td><td>deadlock (single-instance resources) — what gdb, jstack and PostgreSQL look for</td></tr>
</table>
${lab('deadlock', 'cycle', 'en', 'A resource-allocation graph with multi-instance resources: there is a cycle, yet no deadlock — one process can still finish and free what the others wait for. Step the detection algorithm to see why, then compare with the single-instance case above.', { tour: 'deadlock-detect' })}

<h3>Java: jstack finds the cycle for you</h3>
<p>The same two transfers with <code>synchronized</code>:</p>
${details('Transfer.java — naive / watchdog / trylock', src('ch06/Transfer.java', 'java'))}
${run('c61-dl', 'java Transfer.java naive')}
${run('c61-dl', 'jstack $J')}
<p>The JVM tracks the owner of every monitor, so <code>jstack &lt;pid&gt;</code> runs the cycle search itself and prints <strong>"Found one Java-level deadlock"</strong>, both threads, which object each waits for, who holds it, and the exact line (<code>Transfer.java:21</code>). In a Spring Boot service that "stops answering" this is the first command to run — <code>jcmd &lt;pid&gt; Thread.print</code> gives the same report. A service can also check itself:</p>
${run('c61-dl', 'java Transfer.java watchdog')}
<p><code>ThreadMXBean.findDeadlockedThreads()</code> (polled every 0.5 s) found the cycle, the watchdog logged it and exited with code 2 so the orchestrator restarts the container. That is <em>detection and recovery</em>, not a fix: the deadlock still happens, you just stop waiting for a human to notice.</p>

<div class="pitfall co-tieu-de">
<p><strong>"It only hangs under load, so it's the server."</strong> A lock-order deadlock needs both transfers to be in the window between their first and second lock at the same moment. At low traffic that almost never happens; at peak, or after someone adds a slow call between the two locks, it happens daily. And because a deadlocked process shows 0% CPU and no errors, it looks exactly like "the server is just slow". Before you scale up, take <code>jstack</code> / <code>gdb</code> of the stuck process: a cycle is a bug in the code, and more replicas only give it more chances.</p>
</div>

<h3>Prevention 1: one global lock order</h3>
<p>Break <em>circular wait</em>: every thread takes locks in the same global order. Here: always lock the account with the smaller id first.</p>
${run('c61-dl', './dl ordered')}
<p>Both transfers now try A before B; whoever gets A finishes, the other waits its turn. 10,000 transfers in 1.35 s, balances intact, zero timeouts. The order must be <strong>total and stable</strong> — an id or a primary key. In Java avoid ordering by <code>System.identityHashCode</code> (two objects can share it); in a database it is <code>ORDER BY id</code> (lesson 6.4).</p>

<h3>Prevention 2: try-lock with a timeout, then back off</h3>
<p>Break <em>hold and wait</em>: if the second lock does not come within a deadline, give back the first and try again later.</p>
${run('c61-dl', './dl trylock')}
<p>Correct — but 5.56 s instead of 1.35 s, because 1,816 times a thread waited the full 2 ms for nothing. The pause after giving up must be <strong>random</strong>; with a fixed pause both threads can retry in lockstep forever, which is the livelock of lesson 6.2. Java's version is <code>ReentrantLock.tryLock(10, MILLISECONDS)</code>:</p>
${run('c61-dl', 'java Transfer.java trylock')}
${lab('race', 'ordered', 'en', 'The fix: both transfers take A before B. Try every interleaving — a cycle can no longer form; at worst one thread waits for the other to finish.', { tour: 'race-deadlock' })}
<table>
<tr><th>technique</th><th>breaks</th><th>measured / cost</th></tr>
<tr><td>global lock order</td><td>circular wait</td><td>1.35 s, 0 timeouts — free; needs a rule everyone follows</td></tr>
<tr><td>try-lock + timeout + random backoff</td><td>hold and wait</td><td>5.56 s, 1,816 timeouts — always correct, costs time</td></tr>
<tr><td>take all locks at once</td><td>hold and wait</td><td>must know every lock up front</td></tr>
<tr><td>one big lock</td><td>(only one lock left)</td><td>no deadlock and no parallelism</td></tr>
<tr><td>kill a victim</td><td>no preemption</td><td>what databases do — lesson 6.4</td></tr>
</table>

<h3>If you have done OSG202 lesson 6.1</h3>
<p>There you learned the four conditions and the four strategies (ignore, prevent, avoid, detect) on paper. Here they are with a real process: 0% CPU, <code>futex_do_wait</code>, two mutex owners from gdb, and a jstack report. Keep the OSG202 wording for the exam; use these tools at work.</p>
${L(OSG61, '🎓', 'OSG202 · 6.1 — Deadlock: conditions &amp; handling', 'The four conditions and the four strategies as in the course textbook.', 'Open')}

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> the payment worker of your app "freezes" a few times a week; restarting the container fixes it. Logs show nothing. The code locks the payer's wallet, then the payee's wallet.</p>
<ol>
<li>Build <code>dl.c</code> with <code>-g</code>, run <code>./dl naive &amp;</code>, and capture <code>ps -L -o pid,lwp,stat,pcpu,wchan:16 -p $!</code>.</li>
<li>Attach <code>gdb -p</code> and print <code>A.m.__data.__owner</code> and <code>B.m.__data.__owner</code>. Draw the wait-for graph with the real LWP numbers.</li>
<li>Run <code>java Transfer.java naive &amp;</code>, then <code>jstack</code> it. Which line number appears for both threads?</li>
<li>Apply the global-order fix and the try-lock fix; record time and timeouts for each.</li>
</ol>
<p><strong>Done when:</strong> you have one wait-for graph drawn from your own gdb output, and a two-row table (ordered vs try-lock) with seconds and timeouts, and you can say which Coffman condition each row breaks.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['deadlock', 'A set of threads each waiting for something only another thread in the set can release — forever.'],
  ['Coffman conditions', 'Mutual exclusion, hold and wait, no preemption, circular wait. All four are needed; break one and deadlock is impossible.'],
  ['wait-for graph', 'Threads as nodes, an edge T1 → T2 when T1 waits for something T2 holds. A cycle = deadlock (single-instance resources).'],
  ['resource-allocation graph', 'Threads and resources as nodes, request and assignment edges. Collapse resources to get the wait-for graph.'],
  ['wchan', 'The kernel function a sleeping thread waits in (/proc/PID/task/TID/wchan). futex_do_wait = waiting on a lock.'],
  ['lock ordering', 'Every thread takes locks in one global order (by id). Breaks circular wait at no run-time cost.'],
  ['try-lock with timeout', 'Wait a bounded time for the next lock; on failure release everything and retry. Breaks hold and wait.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Two transfers locking two accounts in opposite order hung forever: exit 124 after a 5 s timeout.</li>
<li>A deadlocked process is quiet: threads in S, 0.0% CPU, <code>futex_do_wait</code> — dashboards that watch CPU miss it.</li>
<li>gdb shows where each thread waits and who owns each mutex; jstack prints "Found one Java-level deadlock" with the line number.</li>
<li>Deadlock needs all four Coffman conditions; the cycle in the wait-for graph is condition 4.</li>
<li>Fix by one global lock order (free, 1.35 s) or try-lock + random backoff (correct, 5.56 s here).</li>
</ul>
${L(OSTEP, '📘', 'OSTEP — Common Concurrency Problems', 'The free textbook chapter on deadlock, its conditions and prevention.', 'Open')}
${L('https://docs.oracle.com/en/java/javase/21/docs/specs/man/jstack.html', '☕', 'jstack — Java 21 documentation', 'Print thread stacks of a running JVM, including deadlock detection.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Hai lệnh chuyển tiền chờ nhau mãi mãi</h2>
<p class="lead">Chương 5 làm cho mọi vùng găng đúng bằng một khoá. Giờ cho một lệnh chuyển tiền hai khoá — mỗi tài khoản một khoá — rồi chạy hai lệnh chuyển ngược chiều nhau. Chương trình dừng. Không sập, không lỗi, không tốn CPU: chỉ là hai luồng, mỗi luồng giữ đúng thứ luồng kia cần. Làm sao chứng minh điều đó từ bên ngoài một tiến trình đang đứng im, và làm sao để nó không thể xảy ra?</p>

<h3>Làm cho nó xảy ra bằng C</h3>
<p>Một lệnh chuyển phải đổi hai số dư một cách nguyên tử, nên nó khoá cả hai tài khoản. Với một luồng thì đúng. T1 chuyển A → B, T2 chuyển B → A, mỗi bên 5.000 lần:</p>
${src('ch06/dl.c', 'c')}
${run('c61-dl', 'timeout 5 ./dl naive')}
<p>Mã thoát <strong>124</strong> nghĩa là <code>timeout</code> phải giết nó: trong năm giây chương trình không xong nổi một lượt chuyển. Lệnh <code>usleep(1)</code> giữa hai lần khoá đại diện cho "đọc số dư, kiểm hạn mức trong ngày" — trong dịch vụ thật đó là một lời gọi CSDL hay một lần ghi log, và khe hở còn rộng hơn.</p>

<h3>Chứng minh từ bên ngoài: ps, wchan và stack nhân</h3>
<p>Chạy lại ở chế độ nền và nhìn nó như nhìn một tiến trình bị kẹt trên production:</p>
${run('c61-dl', './dl naive & sleep 1', 3)}
${run('c61-dl', 'grep -m 4 .')}
<p>Ba sự thật. Mọi luồng ở trạng thái <strong>S</strong> (đang ngủ) với <strong>0,0% CPU</strong> — deadlock trông như đang <em>rảnh</em>, nên cảnh báo CPU sẽ không bao giờ kêu. <code>wchan</code> (hàm trong nhân mà luồng đang ngủ chờ ở đó) và stack nhân (root mới đọc được) đều nói <code>futex_do_wait</code>: đường chậm của mutex ở bài 5.2. Và nhân không nói được gì thêm — nó biết các luồng chờ trên các ô futex, không biết luồng nào lẽ ra phải nhả chúng.</p>

<h3>gdb: ai giữ cái gì</h3>
<p>Câu trả lời nằm ở phía người dùng, nên gắn trình gỡ lỗi vào tiến trình đang sống (nó vẫn chạy tiếp sau đó):</p>
${run('c61-dl', 'gdb -p $P -batch -ex "thread', 2)}
<p>LWP 30 đang ở trong <code>transfer(from=B, to=A)</code> và bị chặn khi khoá <strong>A</strong>; LWP 29 ở trong <code>transfer(from=A, to=B)</code> và bị chặn khi khoá <strong>B</strong>. glibc lưu id luồng chủ sở hữu ngay trong mutex, nên lệnh cuối đọc thẳng ra: A do 29 giữ, B do 30 giữ. Mỗi luồng chờ một khoá mà bạn đồng hành của nó đang giữ. Hãy tự bước qua đúng cảnh này trong lab — chọn ai chạy tiếp và xem các mũi tên đứt "đang chờ" khép thành vòng:</p>
${lab('race', 'deadlock', 'vi', 'Hai lệnh chuyển tiền, T1 khoá A rồi B, T2 khoá B rồi A. Bước từng lệnh một; khi mỗi bên giữ một khoá và chờ khoá kia, các mũi tên chờ tạo thành vòng và không gì nhúc nhích được nữa.', { tour: 'race-deadlock' })}

<h3>Bốn điều kiện Coffman</h3>
<p>Năm 1971 Coffman, Elphick và Shoshani chỉ ra rằng deadlock cần <strong>cả bốn</strong> điều sau cùng lúc:</p>
<ol>
<li><strong>Loại trừ lẫn nhau (mutual exclusion)</strong> — một tài nguyên chỉ một luồng giữ được (mutex, khoá dòng, khoá file).</li>
<li><strong>Giữ và chờ (hold and wait)</strong> — luồng giữ nguyên thứ đang có trong lúc chờ thêm (T1 giữ A trong lúc xin B).</li>
<li><strong>Không thể giành lại (no preemption)</strong> — không ai lấy được khoá khỏi tay người giữ; chỉ người giữ tự nhả.</li>
<li><strong>Chờ vòng tròn (circular wait)</strong> — T1 chờ T2, T2 chờ T1: một vòng.</li>
</ol>
<p>Bỏ đi một điều bất kỳ là deadlock không thể xảy ra. Đó là toàn bộ lý thuyết phòng ngừa, và mọi cách sửa trong chương này đều là "phá điều kiện số N".</p>

<h3>Đồ thị cấp phát tài nguyên và đồ thị chờ</h3>
<p>Giáo trình vẽ <strong>đồ thị cấp phát tài nguyên (resource-allocation graph)</strong>: hình tròn là luồng, hình vuông là tài nguyên (mỗi bản một chấm), cạnh <em>cấp phát</em> đi từ tài nguyên tới luồng đang giữ nó, cạnh <em>yêu cầu</em> đi từ luồng tới tài nguyên nó đang chờ. Với chương trình của ta: A → T1, T1 → B, B → T2, T2 → A. Gộp các tài nguyên lại là được <strong>đồ thị chờ (wait-for graph)</strong>: T1 → T2 → T1. Khi mỗi tài nguyên chỉ có một bản, <em>có vòng trong đồ thị chờ nghĩa là deadlock</em>. Khi có nhiều bản (pool 10 kết nối), có vòng chỉ nghĩa là có thể deadlock — bài 6.4 xử lý trường hợp đó.</p>
<table>
<tr><th>đồ thị</th><th>nút</th><th>cạnh</th><th>có vòng nghĩa là</th></tr>
<tr><td>cấp phát tài nguyên</td><td>luồng + tài nguyên</td><td>yêu cầu (T → R), cấp phát (R → T)</td><td>deadlock nếu mỗi tài nguyên có một bản; nếu không thì "có thể"</td></tr>
<tr><td>đồ thị chờ</td><td>chỉ luồng</td><td>T1 → T2 nếu T1 chờ thứ T2 đang giữ</td><td>deadlock (tài nguyên một bản) — thứ mà gdb, jstack và PostgreSQL đi tìm</td></tr>
</table>
${lab('deadlock', 'cycle', 'vi', 'Đồ thị cấp phát tài nguyên với tài nguyên nhiều bản: có vòng, nhưng không deadlock — vẫn có một tiến trình chạy xong và trả lại thứ người khác đang chờ. Bước thuật toán phát hiện để thấy vì sao, rồi so với trường hợp mỗi tài nguyên một bản ở trên.', { tour: 'deadlock-detect' })}

<h3>Java: jstack tìm vòng giúp bạn</h3>
<p>Cùng hai lệnh chuyển, viết bằng <code>synchronized</code>:</p>
${details('Transfer.java — naive / watchdog / trylock', src('ch06/Transfer.java', 'java'))}
${run('c61-dl', 'java Transfer.java naive')}
${run('c61-dl', 'jstack $J')}
<p>JVM theo dõi chủ sở hữu của mọi monitor, nên <code>jstack &lt;pid&gt;</code> tự chạy phép tìm vòng và in <strong>"Found one Java-level deadlock"</strong>, cả hai luồng, mỗi luồng chờ đối tượng nào, ai đang giữ nó, và đúng dòng code (<code>Transfer.java:21</code>). Khi một dịch vụ Spring Boot "không trả lời nữa", đây là lệnh đầu tiên nên chạy — <code>jcmd &lt;pid&gt; Thread.print</code> cho cùng báo cáo. Dịch vụ cũng có thể tự kiểm chính nó:</p>
${run('c61-dl', 'java Transfer.java watchdog')}
<p><code>ThreadMXBean.findDeadlockedThreads()</code> (hỏi mỗi 0,5 giây) tìm ra vòng, luồng canh ghi log rồi thoát với mã 2 để hệ thống điều phối khởi động lại container. Đó là <em>phát hiện và phục hồi</em>, không phải sửa: deadlock vẫn xảy ra, chỉ là bạn thôi phải chờ một người tình cờ nhận ra.</p>

<div class="pitfall co-tieu-de">
<p><strong>"Nó chỉ treo khi tải cao, chắc tại máy chủ."</strong> Deadlock do thứ tự khoá cần cả hai lệnh chuyển cùng lúc nằm trong khe hở giữa khoá thứ nhất và khoá thứ hai. Lúc vắng khách gần như không bao giờ xảy ra; lúc cao điểm, hoặc sau khi ai đó chèn một lời gọi chậm giữa hai lần khoá, nó xảy ra hằng ngày. Và vì tiến trình bị deadlock hiện 0% CPU, không lỗi, nó trông y như "máy chủ chỉ hơi chậm". Trước khi tăng cấu hình, hãy lấy <code>jstack</code> / <code>gdb</code> của tiến trình đang kẹt: có vòng là lỗi trong code, và thêm bản sao chỉ cho lỗi thêm cơ hội.</p>
</div>

<h3>Phòng ngừa 1: một thứ tự khoá chung</h3>
<p>Phá <em>chờ vòng tròn</em>: mọi luồng lấy khoá theo cùng một thứ tự toàn cục. Ở đây: luôn khoá tài khoản có id nhỏ hơn trước.</p>
${run('c61-dl', './dl ordered')}
<p>Giờ cả hai lệnh chuyển đều thử A trước B; ai lấy được A thì làm xong, người kia chờ tới lượt. 10.000 lệnh chuyển trong 1,35 giây, số dư đúng, không lần hết hạn nào. Thứ tự phải <strong>toàn phần và ổn định</strong> — một id hay khoá chính. Trong Java đừng sắp theo <code>System.identityHashCode</code> (hai đối tượng có thể trùng); trong CSDL thì là <code>ORDER BY id</code> (bài 6.4).</p>

<h3>Phòng ngừa 2: thử khoá có thời hạn, rồi lùi lại</h3>
<p>Phá <em>giữ và chờ</em>: nếu khoá thứ hai không tới trước hạn chót, trả lại khoá thứ nhất và thử lại sau.</p>
${run('c61-dl', './dl trylock')}
<p>Đúng — nhưng 5,56 giây thay vì 1,35 giây, vì 1.816 lần một luồng chờ trọn 2 ms mà không được gì. Khoảng nghỉ sau khi bỏ cuộc phải <strong>ngẫu nhiên</strong>; với khoảng nghỉ cố định, hai luồng có thể thử lại cùng nhịp mãi mãi, đó là livelock của bài 6.2. Bản Java là <code>ReentrantLock.tryLock(10, MILLISECONDS)</code>:</p>
${run('c61-dl', 'java Transfer.java trylock')}
${lab('race', 'ordered', 'vi', 'Cách sửa: cả hai lệnh chuyển đều lấy A trước B. Thử mọi cách xen kẽ — vòng chờ không thể hình thành nữa; tệ nhất là một luồng chờ luồng kia làm xong.', { tour: 'race-deadlock' })}
<table>
<tr><th>kỹ thuật</th><th>phá</th><th>đo được / giá phải trả</th></tr>
<tr><td>thứ tự khoá chung</td><td>chờ vòng tròn</td><td>1,35 s, 0 lần hết hạn — miễn phí; cần một luật ai cũng theo</td></tr>
<tr><td>thử khoá + thời hạn + lùi ngẫu nhiên</td><td>giữ và chờ</td><td>5,56 s, 1.816 lần hết hạn — luôn đúng, tốn thời gian</td></tr>
<tr><td>lấy mọi khoá một lần</td><td>giữ và chờ</td><td>phải biết trước mọi khoá</td></tr>
<tr><td>một khoá lớn</td><td>(chỉ còn một khoá)</td><td>không deadlock và cũng không song song</td></tr>
<tr><td>giết một nạn nhân</td><td>không thể giành lại</td><td>cách CSDL làm — bài 6.4</td></tr>
</table>

<h3>Nếu bạn đã học OSG202 bài 6.1</h3>
<p>Ở đó bạn học bốn điều kiện và bốn chiến lược (phớt lờ, phòng ngừa, tránh, phát hiện) trên giấy. Ở đây chúng hiện ra trên một tiến trình thật: 0% CPU, <code>futex_do_wait</code>, hai chủ sở hữu mutex lấy từ gdb, và một báo cáo jstack. Giữ cách nói của OSG202 cho kỳ thi; dùng các công cụ này khi đi làm.</p>
${L(OSG61, '🎓', 'OSG202 · 6.1 — Deadlock: điều kiện &amp; xử lý', 'Bốn điều kiện và bốn chiến lược theo giáo trình môn học.', 'Mở')}

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> worker thanh toán của app "đứng hình" vài lần mỗi tuần; khởi động lại container là hết. Log không có gì. Code khoá ví người trả, rồi khoá ví người nhận.</p>
<ol>
<li>Biên dịch <code>dl.c</code> với <code>-g</code>, chạy <code>./dl naive &amp;</code>, và lấy <code>ps -L -o pid,lwp,stat,pcpu,wchan:16 -p $!</code>.</li>
<li>Gắn <code>gdb -p</code> và in <code>A.m.__data.__owner</code>, <code>B.m.__data.__owner</code>. Vẽ đồ thị chờ với đúng số LWP thật.</li>
<li>Chạy <code>java Transfer.java naive &amp;</code>, rồi <code>jstack</code> nó. Số dòng nào xuất hiện ở cả hai luồng?</li>
<li>Áp dụng cách sửa theo thứ tự chung và cách sửa thử khoá; ghi lại thời gian và số lần hết hạn của mỗi cách.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có một đồ thị chờ vẽ từ chính output gdb của mình, và một bảng hai dòng (theo thứ tự / thử khoá) có số giây và số lần hết hạn, và nói được mỗi dòng phá điều kiện Coffman nào.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['deadlock (khoá chết)', 'Một nhóm luồng mà mỗi luồng chờ một thứ chỉ luồng khác trong nhóm mới nhả được — mãi mãi.'],
  ['Coffman conditions (điều kiện Coffman)', 'Loại trừ lẫn nhau, giữ và chờ, không thể giành lại, chờ vòng tròn. Cần đủ cả bốn; phá một là deadlock không thể xảy ra.'],
  ['wait-for graph (đồ thị chờ)', 'Nút là luồng, có cạnh T1 → T2 khi T1 chờ thứ T2 đang giữ. Có vòng = deadlock (tài nguyên một bản).'],
  ['resource-allocation graph (đồ thị cấp phát tài nguyên)', 'Nút là luồng và tài nguyên, có cạnh yêu cầu và cạnh cấp phát. Gộp tài nguyên lại thì ra đồ thị chờ.'],
  ['wchan (kênh chờ)', 'Hàm trong nhân mà luồng đang ngủ chờ ở đó (/proc/PID/task/TID/wchan). futex_do_wait = đang chờ khoá.'],
  ['lock ordering (thứ tự khoá)', 'Mọi luồng lấy khoá theo một thứ tự chung (theo id). Phá chờ vòng tròn, không tốn gì lúc chạy.'],
  ['try-lock with timeout (thử khoá có thời hạn)', 'Chờ khoá tiếp theo trong thời gian giới hạn; hụt thì nhả hết và thử lại. Phá giữ và chờ.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Hai lệnh chuyển khoá hai tài khoản theo thứ tự ngược nhau làm chương trình treo vĩnh viễn: exit 124 sau 5 giây timeout.</li>
<li>Tiến trình bị deadlock rất yên lặng: luồng ở trạng thái S, 0,0% CPU, <code>futex_do_wait</code> — bảng theo dõi chỉ nhìn CPU sẽ bỏ sót.</li>
<li>gdb cho thấy mỗi luồng chờ ở đâu và ai sở hữu mutex nào; jstack in "Found one Java-level deadlock" kèm số dòng.</li>
<li>Deadlock cần đủ bốn điều kiện Coffman; vòng trong đồ thị chờ chính là điều kiện 4.</li>
<li>Sửa bằng một thứ tự khoá chung (miễn phí, 1,35 s) hoặc thử khoá + lùi ngẫu nhiên (đúng, 5,56 s ở đây).</li>
</ul>
${L(OSTEP, '📘', 'OSTEP — Common Concurrency Problems', 'Chương sách miễn phí về deadlock, các điều kiện và cách phòng ngừa.', 'Mở')}
${L('https://docs.oracle.com/en/java/javase/21/docs/specs/man/jstack.html', '☕', 'jstack — tài liệu Java 21', 'In stack các luồng của một JVM đang chạy, kèm phát hiện deadlock.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 6.2 — Livelock, starvation, priority inversion ───────────────────────── */
    {
      title: '6.2 — Livelock, starvation and priority inversion: Mars Pathfinder, measured|||6.2 — Livelock, đói và đảo ngược ưu tiên: Mars Pathfinder, đo thật',
      slug: 'os-6-2-livelock',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Ba kiểu "không tiến được" mà không phải deadlock: livelock (200.000 lần thử lại, 0 việc xong, CPU vẫn cháy) và cách phá bằng ngẫu nhiên; người ghi bị đói 3 giây sau khoá đọc-ghi; đảo ngược ưu tiên kiểu Mars Pathfinder tái hiện bằng SCHED_FIFO — 540 ms còn 40 ms nhờ kế thừa ưu tiên.',
      content: `${G62}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>No deadlock — and still no progress</h2>
<p class="lead">Lesson 6.1 broke the deadlock with try-lock and backoff. But a program can avoid every deadlock and still get nowhere: threads busy yielding to each other, a writer that never gets its turn, an urgent task stuck behind an unimportant one. In 1997 the last of these kept resetting a spacecraft on Mars. What do these look like when you measure them — and what fixes each?</p>

<h3>Three ways to make no progress</h3>
<table>
<tr><th></th><th>what threads do</th><th>CPU</th><th>who suffers</th></tr>
<tr><td><strong>deadlock</strong></td><td>sleep, each waiting for another in a cycle</td><td>≈ 0</td><td>everyone in the cycle, forever</td></tr>
<tr><td><strong>livelock</strong></td><td>keep reacting to each other, never finishing</td><td>busy</td><td>everyone involved</td></tr>
<tr><td><strong>starvation</strong></td><td>the system makes progress — just not for one thread</td><td>normal</td><td>one unlucky waiter</td></tr>
</table>
<p>Keep the deadlock from 6.1 as the baseline:</p>
${run('c62-live', '/usr/bin/time -f "%e s wall, %U s user + %S s kernel CPU" timeout 3')}
<p>Three seconds of wall time, <strong>0.00 s</strong> of CPU. Now compare.</p>

<h3>Livelock: two very polite threads</h3>
<p>Each thread takes its own lock, <em>tries</em> the other's, and if that fails it releases its own and says "after you". It never holds one lock while waiting for another, so it cannot deadlock. But if both move in the same rhythm, each always finds the other's lock taken — like two people in a corridor stepping aside the same way again and again. The program forces that rhythm with a barrier (<code>lockstep</code>), then adds a coin flip (<code>lockstep-random</code>), then removes the forced rhythm (<code>real</code>):</p>
${details('livelock.c — lockstep / lockstep-random / real', src('ch06/livelock.c', 'c'))}
${run('c62-live', '/usr/bin/time -f "%e s wall, %U s user + %S s kernel CPU" ./livelock lockstep')}
<p><strong>200,000 polite retries, zero jobs done, 1.9 s of CPU in 3.7 s.</strong> That is livelock: every thread is running and changing state, nobody finishes. Unlike the deadlock, the CPU graph says "busy" and the log says "retrying" — it looks like heavy load, not like a hang.</p>
${run('c62-live', '/usr/bin/time -f "%e s wall, %U s user + %S s kernel CPU" ./livelock lockstep-random', 2)}
<p>Breaking the symmetry is enough: after a miss, each thread flips a coin and may sit out one beat, and 28,530 jobs finish. Without a forced rhythm (<code>real</code>), the scheduler's own jitter already de-synchronises the threads — but roughly half of all attempts are still wasted. This is why every retry policy worth using has <strong>random jitter</strong>: Ethernet's random backoff after a collision, exponential backoff with jitter in cloud SDKs, Raft's randomised election timeouts.</p>

<div class="pitfall co-tieu-de">
<p><strong>"Retry every 1 second" is a synchronised clock.</strong> When a database restarts, every client notices at the same moment and, with a fixed delay, retries at the same moment — again and again. The database comes back to a wall of simultaneous connections, chokes, and they all retry together once more. That is livelock at fleet scale (also called a thundering herd). Always add jitter: <code>delay = base × 2^attempt × random(0.5…1.5)</code>, capped.</p>
</div>

<h3>Starvation: a writer behind endless readers</h3>
<p>Lesson 5.3 measured that a read-write lock doubles throughput for a read-mostly table, and warned about writer starvation. Here it is: four reader threads overlap so someone is always reading; one writer wants to update the price table once.</p>
${details('starve.c — readers / writers', src('ch06/starve.c', 'c'))}
${run('c62-live', './starve readers', 2)}
<p>glibc's default read-write lock <strong>prefers readers</strong>: a new reader may enter while a writer waits, and with overlapping readers the writer never finds a gap. It gave up after 3 seconds while almost 31,000 reads went by. (Yes, <code>ETIMEDOUT</code>'s message really is "Connection timed out".) With <code>PTHREAD_RWLOCK_PREFER_WRITER_NONRECURSIVE_NP</code>, new readers queue behind a waiting writer and it gets in after 0.2 ms.</p>
${lab('sync', 'readers', 'en', 'The same starvation, step by step: overlapping readers keep the read lock busy, so the writer never finds a gap (0 writes). Switch “Lock prefers” to writers: new readers queue behind the waiting writer and it gets in.')}
<p>The same thing happens in CPU schedulers. With strict preemptive priority, a low-priority job runs only when nothing more important is ready — keep important work arriving and it never runs. The classic fix is <strong>aging</strong>: the longer a job waits, the higher its priority. Linux CFS/EEVDF avoid the problem differently: priorities (nice values) are <em>weights</em>, so even nice 19 gets a small share. See it in the scheduler lab: switch the policy to <strong>Prio-P</strong> and watch the least important process wait for everyone else:</p>
${lab('scheduler', 'textbook', 'en', 'Four processes with priorities. Choose Prio-P (preemptive priority): the lowest-priority job waits until every more important job is done — add more important arrivals and it may never run. Compare with RR or CFS.', { tour: 'sched-policies' })}

<h3>Priority inversion: what happened on Mars</h3>
<p>Mars Pathfinder landed on 4 July 1997. A few days later, after it started gathering weather data, its computer began <strong>resetting itself</strong>, losing data each time. The software ran on VxWorks with preemptive priority scheduling, and three tasks mattered:</p>
<ul>
<li><strong>High</strong>: the bus management task, run often, moving data through a shared "information bus" guarded by a <strong>mutex</strong>.</li>
<li><strong>Low</strong>: the meteorological task, run rarely, taking the same mutex to publish its data.</li>
<li><strong>Medium</strong>: a long-running communications task that did not need the mutex at all.</li>
</ul>
<p>Low held the mutex; High woke up and blocked on it; then Medium became ready and — having higher priority than Low — took the CPU and ran on and on. High was now waiting for Medium, a task it shared nothing with. A watchdog noticed that the bus task had not run for a while, decided something was badly wrong, and reset the whole system. That is <strong>priority inversion</strong>: an important task effectively running at a lower priority than an unimportant one.</p>

<h3>Reproduce it: H waits 540 ms</h3>
<p><code>pi.c</code> rebuilds the scene with real-time threads (<code>SCHED_FIFO</code>, the policy where a higher priority always runs first) pinned to one CPU — it needs <code>--cap-add SYS_NICE</code> in the container. L (priority 10) takes the mutex and needs 50 ms of CPU; at 10 ms H (30) wants the mutex; M (20) then has 500 ms of unrelated work:</p>
${details('pi.c — none / inherit', src('ch06/pi.c', 'c'))}
${run('c62-live', './pi none')}
<p>H waited <strong>540.2 ms</strong> — for M, a thread it shares nothing with. M preempted L, L could not finish its critical section, and H sat behind both.</p>
${run('c62-live', './pi inherit')}
<p>With a <code>PTHREAD_PRIO_INHERIT</code> mutex, the moment H blocks, L runs at H's priority 30. M (20) can no longer preempt it, L finishes its remaining 40 ms, H gets the mutex after <strong>40.0 ms</strong>, and M runs afterwards. One attribute line, and the kernel does the rest:</p>
${lab('deadlock', 'inversion', 'en', 'H, M and L on one core, as in pi.c: without inheritance H waits 540 ms behind M; switch priority inheritance on and it waits 40 ms. Turn on the 125 ms watchdog to see what happened on Mars: RESET.')}
${run('c62-live', 'strace -f -e trace=futex ./pi none', 2)}
<p>With the inherit protocol glibc uses <code>FUTEX_LOCK_PI</code> / <code>FUTEX_UNLOCK_PI</code>: the futex word holds the owner's thread id, so the kernel (its <code>rt_mutex</code> code) knows whom to boost while a higher-priority thread waits.</p>
<p>How JPL fixed it: engineers reproduced a reset on an identical replica with VxWorks' full event trace switched on and found the mutex had been created with priority inheritance <em>off</em> — it had been judged too slow for such a frequent, time-critical task. VxWorks' built-in C interpreter was still enabled on the spacecraft, so they uploaded a short program that flipped the global flags to TRUE. The resets stopped. One or two unexplained resets had appeared during pre-flight testing and had been written off as hardware glitches.</p>
<p>Backend twins of the same shape: a nightly report holding a row lock that an urgent checkout needs; a batch job holding pool connections while the health check waits behind it (lesson 6.4 measures 1.9 s); a low-priority thread holding a cache lock while GC or a noisy neighbour delays it. Web servers rarely use real-time priorities, so the fix there is short critical sections, separate pools, and timeouts on every wait.</p>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> after every database restart your API is down for several minutes even though the database is back within seconds; the database log shows waves of connection attempts exactly one second apart.</p>
<ol>
<li>Run <code>./livelock lockstep</code>, <code>lockstep-random</code> and <code>real</code> under <code>/usr/bin/time</code>; tabulate jobs done, retries and CPU seconds.</li>
<li>Explain in two sentences how the database restart is the same pattern as <code>lockstep</code>, and write the retry delay formula you would use instead.</li>
<li>Run <code>./starve readers</code> and <code>./starve writers</code>. Which one would you use for a price table updated once a minute and read 10,000 times a second?</li>
<li>In a container started with <code>--cap-add SYS_NICE</code>, run <code>./pi none</code> and <code>./pi inherit</code> and draw both timelines (L, M, H) from the printed milliseconds.</li>
</ol>
<p><strong>Done when:</strong> your table shows lockstep with 0 jobs and non-zero CPU, you have a jittered backoff formula, and your two timelines show H waiting about 540 ms vs 40 ms with the reason for each.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['livelock', 'Threads keep changing state in reaction to each other but none makes progress. CPU is busy, unlike deadlock.'],
  ['starvation', 'One thread waits indefinitely while others keep progressing (writer behind readers, low priority behind high).'],
  ['backoff with jitter', 'After a failure, wait a growing and random delay so competing retries stop happening in step.'],
  ['aging', 'Raising the priority of a job the longer it waits, so it cannot starve.'],
  ['priority inversion', 'A high-priority task waits for a lock held by a low-priority task, which a medium-priority task keeps preempting.'],
  ['priority inheritance', 'While a high-priority thread waits for a lock, its holder temporarily runs at that higher priority (PTHREAD_PRIO_INHERIT).'],
  ['SCHED_FIFO', 'Linux real-time policy: the highest-priority runnable thread always runs, with no time slicing among different priorities.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Deadlock sleeps (0.00 s CPU); livelock burns CPU — lockstep made 200,000 retries and 0 jobs in 1.9 s of CPU.</li>
<li>Randomness breaks the symmetry: a coin flip gave 28,530 jobs; always add jitter to retries.</li>
<li>A reader-preferring rwlock starved a writer for 3 s; writer preference let it in after 0.2 ms.</li>
<li>Priority inversion on one core: H waited 540.2 ms behind an unrelated M; with priority inheritance, 40.0 ms.</li>
<li>Mars Pathfinder was fixed from Earth by switching that one mutex option on; on a backend the same shape is fixed with short critical sections, separate pools and timeouts.</li>
</ul>
${L(MARS, '🚀', 'What really happened on Mars Rover Pathfinder', 'Mike Jones’ 1997 account of the priority inversion and how JPL fixed it.', 'Open')}
${L('https://man7.org/linux/man-pages/man3/pthread_mutexattr_setprotocol.3p.html', '📄', 'man pthread_mutexattr_setprotocol', 'PTHREAD_PRIO_INHERIT and PTHREAD_PRIO_PROTECT for mutexes.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Không deadlock — mà vẫn không tiến được</h2>
<p class="lead">Bài 6.1 phá deadlock bằng thử khoá và lùi lại. Nhưng một chương trình có thể tránh mọi deadlock mà vẫn chẳng đi tới đâu: các luồng bận nhường nhau, một người ghi không bao giờ tới lượt, một việc gấp kẹt sau một việc chẳng quan trọng. Năm 1997, kiểu cuối cùng liên tục khởi động lại một con tàu trên sao Hoả. Khi đo, chúng trông ra sao — và mỗi kiểu sửa thế nào?</p>

<h3>Ba kiểu không tiến được</h3>
<table>
<tr><th></th><th>các luồng làm gì</th><th>CPU</th><th>ai chịu thiệt</th></tr>
<tr><td><strong>deadlock</strong></td><td>ngủ, mỗi luồng chờ một luồng khác trong vòng</td><td>≈ 0</td><td>mọi bên trong vòng, mãi mãi</td></tr>
<tr><td><strong>livelock</strong></td><td>liên tục phản ứng với nhau, không bao giờ xong</td><td>bận</td><td>mọi bên dính vào</td></tr>
<tr><td><strong>đói (starvation)</strong></td><td>hệ thống vẫn tiến — chỉ là không tiến cho một luồng</td><td>bình thường</td><td>một người chờ kém may</td></tr>
</table>
<p>Lấy deadlock của bài 6.1 làm mốc:</p>
${run('c62-live', '/usr/bin/time -f "%e s wall, %U s user + %S s kernel CPU" timeout 3')}
<p>Ba giây đồng hồ, <strong>0,00 giây</strong> CPU. Giờ so sánh.</p>

<h3>Livelock: hai luồng quá lịch sự</h3>
<p>Mỗi luồng lấy khoá của mình, <em>thử</em> khoá của bên kia, và nếu hụt thì nhả khoá mình ra và "mời bạn trước". Nó không bao giờ vừa giữ một khoá vừa chờ khoá khác, nên không thể deadlock. Nhưng nếu cả hai đi cùng nhịp, bên nào cũng luôn thấy khoá kia bị giữ — như hai người ở hành lang cứ cùng bước sang một phía để tránh nhau. Chương trình ép nhịp đó bằng một barrier (<code>lockstep</code>), rồi thêm tung đồng xu (<code>lockstep-random</code>), rồi bỏ việc ép nhịp (<code>real</code>):</p>
${details('livelock.c — lockstep / lockstep-random / real', src('ch06/livelock.c', 'c'))}
${run('c62-live', '/usr/bin/time -f "%e s wall, %U s user + %S s kernel CPU" ./livelock lockstep')}
<p><strong>200.000 lần nhường nhau, không việc nào xong, 1,9 giây CPU trong 3,7 giây.</strong> Đó là livelock: luồng nào cũng đang chạy và đổi trạng thái, không ai xong việc. Khác với deadlock, biểu đồ CPU nói "bận" và log nói "đang thử lại" — nó trông như tải nặng, không giống bị treo.</p>
${run('c62-live', '/usr/bin/time -f "%e s wall, %U s user + %S s kernel CPU" ./livelock lockstep-random', 2)}
<p>Phá sự đối xứng là đủ: sau mỗi lần hụt, mỗi luồng tung đồng xu và có thể nghỉ một nhịp, và 28.530 việc xong. Khi không bị ép nhịp (<code>real</code>), độ lệch tự nhiên của bộ lập lịch đã làm các luồng lệch nhịp — nhưng khoảng một nửa số lần thử vẫn phí. Vì thế mọi chính sách thử lại đáng dùng đều có <strong>độ lệch ngẫu nhiên (jitter)</strong>: Ethernet lùi ngẫu nhiên sau khi va chạm, các SDK đám mây dùng exponential backoff có jitter, Raft dùng thời hạn bầu cử ngẫu nhiên.</p>

<div class="pitfall co-tieu-de">
<p><strong>"Cứ 1 giây thử lại một lần" là một chiếc đồng hồ đồng bộ.</strong> Khi CSDL khởi động lại, mọi client nhận ra cùng một lúc và, với khoảng chờ cố định, thử lại cùng một lúc — lần này qua lần khác. CSDL sống lại đúng lúc gặp một bức tường kết nối đồng thời, nghẹt, và tất cả lại cùng thử lại. Đó là livelock ở quy mô cả hệ thống (còn gọi là thundering herd — đàn bò giẫm đạp). Luôn thêm jitter: <code>delay = base × 2^lần_thử × random(0,5…1,5)</code>, có trần.</p>
</div>

<h3>Đói: người ghi đứng sau những người đọc không dứt</h3>
<p>Bài 5.3 đã đo khoá đọc-ghi tăng gấp đôi thông lượng cho bảng chủ yếu được đọc, và cảnh báo người ghi bị đói. Đây là nó: bốn luồng đọc chồng lên nhau nên lúc nào cũng có người đang đọc; một người ghi muốn cập nhật bảng giá đúng một lần.</p>
${details('starve.c — readers / writers', src('ch06/starve.c', 'c'))}
${run('c62-live', './starve readers', 2)}
<p>Khoá đọc-ghi mặc định của glibc <strong>ưu tiên người đọc</strong>: người đọc mới được vào trong lúc người ghi đang chờ, và khi người đọc chồng lên nhau thì người ghi không bao giờ tìm được khe hở. Nó bỏ cuộc sau 3 giây trong lúc gần 31.000 lượt đọc trôi qua. (Đúng vậy, thông điệp của <code>ETIMEDOUT</code> là "Connection timed out".) Với <code>PTHREAD_RWLOCK_PREFER_WRITER_NONRECURSIVE_NP</code>, người đọc mới phải xếp sau người ghi đang chờ và nó vào được sau 0,2 ms.</p>
${lab('sync', 'readers', 'vi', 'Cùng cơn đói đó, từng bước: người đọc chồng nhau giữ khoá đọc liên tục nên người ghi không bao giờ tìm được khe (0 lượt ghi). Đổi “Khoá ưu tiên” sang người ghi: người đọc mới xếp sau người ghi đang chờ và người ghi vào được.')}
<p>Bộ lập lịch CPU cũng gặp đúng chuyện này. Với ưu tiên cắt ngang thuần tuý, việc ưu tiên thấp chỉ chạy khi không còn việc nào quan trọng hơn sẵn sàng — cứ có việc quan trọng đến liên tục là nó không bao giờ chạy. Cách sửa kinh điển là <strong>lão hoá (aging)</strong>: chờ càng lâu, ưu tiên càng cao. Linux CFS/EEVDF tránh vấn đề theo cách khác: mức ưu tiên (nice) là <em>trọng số</em>, nên kể cả nice 19 vẫn có một phần nhỏ CPU. Xem trong lab lập lịch: chuyển chính sách sang <strong>Prio-P</strong> và nhìn tiến trình kém quan trọng nhất chờ mọi người khác:</p>
${lab('scheduler', 'textbook', 'vi', 'Bốn tiến trình có mức ưu tiên. Chọn Prio-P (ưu tiên có cắt ngang): việc ưu tiên thấp nhất phải chờ tới khi mọi việc quan trọng hơn xong — cho thêm việc quan trọng đến là nó có thể không bao giờ chạy. So với RR hoặc CFS.', { tour: 'sched-policies' })}

<h3>Đảo ngược ưu tiên: chuyện gì đã xảy ra trên sao Hoả</h3>
<p>Mars Pathfinder hạ cánh ngày 4/7/1997. Vài ngày sau, khi bắt đầu thu dữ liệu thời tiết, máy tính của nó bắt đầu <strong>tự khởi động lại</strong>, mỗi lần mất một ít dữ liệu. Phần mềm chạy trên VxWorks với lập lịch ưu tiên có cắt ngang, và có ba tác vụ đáng chú ý:</p>
<ul>
<li><strong>Cao</strong>: tác vụ quản lý bus, chạy thường xuyên, chuyển dữ liệu qua một "bus thông tin" dùng chung được bảo vệ bằng <strong>mutex</strong>.</li>
<li><strong>Thấp</strong>: tác vụ khí tượng, ít chạy, lấy cùng mutex đó để công bố dữ liệu.</li>
<li><strong>Trung bình</strong>: tác vụ liên lạc chạy lâu, hoàn toàn không cần mutex đó.</li>
</ul>
<p>Thấp đang giữ mutex; Cao thức dậy và bị chặn ở mutex; rồi Trung bình sẵn sàng và — vì ưu tiên cao hơn Thấp — giành CPU và chạy mãi. Giờ Cao đang chờ Trung bình, một tác vụ nó chẳng dùng chung gì. Một bộ canh (watchdog) thấy tác vụ bus lâu rồi không chạy, kết luận có chuyện nghiêm trọng, và khởi động lại cả hệ thống. Đó là <strong>đảo ngược ưu tiên (priority inversion)</strong>: một việc quan trọng thực chất chạy với ưu tiên thấp hơn một việc chẳng quan trọng.</p>

<h3>Tái hiện: H chờ 540 ms</h3>
<p><code>pi.c</code> dựng lại cảnh đó bằng luồng thời gian thực (<code>SCHED_FIFO</code>, chính sách mà ưu tiên cao hơn luôn chạy trước) ghim vào một CPU — cần <code>--cap-add SYS_NICE</code> cho container. L (ưu tiên 10) lấy mutex và cần 50 ms CPU; ở mốc 10 ms H (30) muốn mutex; M (20) sau đó có 500 ms việc không liên quan:</p>
${details('pi.c — none / inherit', src('ch06/pi.c', 'c'))}
${run('c62-live', './pi none')}
<p>H chờ <strong>540,2 ms</strong> — vì M, một luồng nó chẳng dùng chung gì. M giành CPU khỏi L, L không làm xong vùng găng, và H ngồi sau cả hai.</p>
${run('c62-live', './pi inherit')}
<p>Với mutex <code>PTHREAD_PRIO_INHERIT</code>, ngay khi H bị chặn, L chạy với ưu tiên 30 của H. M (20) không giành được CPU nữa, L làm nốt 40 ms còn lại, H có mutex sau <strong>40,0 ms</strong>, và M chạy sau đó. Một dòng thuộc tính, phần còn lại nhân lo:</p>
${lab('deadlock', 'inversion', 'vi', 'H, M và L trên một lõi, như pi.c: không kế thừa ưu tiên thì H chờ 540 ms sau M; bật kế thừa ưu tiên thì chỉ chờ 40 ms. Bật watchdog 125 ms để thấy chuyện đã xảy ra trên sao Hoả: RESET.')}
${run('c62-live', 'strace -f -e trace=futex ./pi none', 2)}
<p>Với giao thức kế thừa, glibc dùng <code>FUTEX_LOCK_PI</code> / <code>FUTEX_UNLOCK_PI</code>: ô futex chứa id luồng chủ sở hữu, nên nhân (phần <code>rt_mutex</code>) biết cần nâng ưu tiên cho ai trong lúc một luồng ưu tiên cao hơn đang chờ.</p>
<p>JPL sửa thế nào: các kỹ sư tái hiện được một lần khởi động lại trên bản sao giống hệt với tính năng ghi vết sự kiện đầy đủ của VxWorks, và thấy mutex đã được tạo với kế thừa ưu tiên <em>tắt</em> — vì bị cho là quá chậm với một tác vụ chạy dày đặc và gấp như thế. Bộ thông dịch C có sẵn của VxWorks vẫn còn bật trên tàu, nên họ gửi lên một chương trình ngắn đổi các cờ toàn cục thành TRUE. Lỗi khởi động lại chấm dứt. Trước khi phóng, một hai lần khởi động lại không giải thích được đã xuất hiện khi thử nghiệm và bị cho là trục trặc phần cứng.</p>
<p>Các bản sao trong backend có cùng hình dạng: báo cáo ban đêm giữ khoá dòng mà lệnh thanh toán gấp đang cần; một job chạy lô giữ kết nối pool trong khi health check chờ phía sau (bài 6.4 đo được 1,9 giây); một luồng ưu tiên thấp giữ khoá cache trong lúc GC hay một hàng xóm ồn ào làm nó chậm lại. Máy chủ web hiếm khi dùng ưu tiên thời gian thực, nên cách sửa ở đó là vùng găng ngắn, tách pool, và thời hạn cho mọi lần chờ.</p>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> mỗi lần CSDL khởi động lại, API của bạn sập mấy phút dù CSDL đã sống lại sau vài giây; log CSDL cho thấy từng đợt kết nối cách nhau đúng một giây.</p>
<ol>
<li>Chạy <code>./livelock lockstep</code>, <code>lockstep-random</code> và <code>real</code> dưới <code>/usr/bin/time</code>; lập bảng số việc xong, số lần thử lại và số giây CPU.</li>
<li>Giải thích trong hai câu vì sao lần khởi động lại CSDL cùng kiểu với <code>lockstep</code>, và viết công thức thời gian chờ thử lại bạn sẽ dùng thay thế.</li>
<li>Chạy <code>./starve readers</code> và <code>./starve writers</code>. Với một bảng giá cập nhật mỗi phút một lần và được đọc 10.000 lần mỗi giây, bạn chọn kiểu nào?</li>
<li>Trong container chạy với <code>--cap-add SYS_NICE</code>, chạy <code>./pi none</code> và <code>./pi inherit</code> và vẽ cả hai dòng thời gian (L, M, H) từ các mốc mili giây in ra.</li>
</ol>
<p><strong>Đạt khi:</strong> bảng của bạn cho thấy lockstep có 0 việc xong và CPU khác 0, bạn có một công thức lùi có jitter, và hai dòng thời gian cho thấy H chờ khoảng 540 ms so với 40 ms kèm lý do của từng cái.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['livelock (khoá sống)', 'Các luồng liên tục đổi trạng thái để phản ứng với nhau nhưng không ai tiến được. CPU bận, khác với deadlock.'],
  ['starvation (đói)', 'Một luồng chờ vô hạn trong khi các luồng khác vẫn tiến (người ghi sau người đọc, ưu tiên thấp sau ưu tiên cao).'],
  ['backoff with jitter (lùi có độ lệch ngẫu nhiên)', 'Sau thất bại, chờ một khoảng tăng dần và ngẫu nhiên để các lần thử lại cạnh tranh không còn cùng nhịp.'],
  ['aging (lão hoá)', 'Tăng ưu tiên của một việc theo thời gian nó đã chờ, để nó không thể bị đói.'],
  ['priority inversion (đảo ngược ưu tiên)', 'Việc ưu tiên cao chờ khoá do việc ưu tiên thấp giữ, trong khi việc ưu tiên trung bình liên tục giành CPU khỏi việc thấp.'],
  ['priority inheritance (kế thừa ưu tiên)', 'Trong lúc luồng ưu tiên cao chờ khoá, người giữ khoá tạm chạy với ưu tiên cao đó (PTHREAD_PRIO_INHERIT).'],
  ['SCHED_FIFO', 'Chính sách thời gian thực của Linux: luồng sẵn sàng có ưu tiên cao nhất luôn chạy, không chia lát thời gian giữa các mức ưu tiên khác nhau.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Deadlock thì ngủ (0,00 s CPU); livelock thì đốt CPU — lockstep làm 200.000 lần thử lại, 0 việc xong, trong 1,9 s CPU.</li>
<li>Ngẫu nhiên phá được đối xứng: tung đồng xu cho 28.530 việc xong; luôn thêm jitter khi thử lại.</li>
<li>Khoá đọc-ghi ưu tiên người đọc bỏ đói người ghi 3 giây; ưu tiên người ghi cho nó vào sau 0,2 ms.</li>
<li>Đảo ngược ưu tiên trên một lõi: H chờ 540,2 ms sau một M chẳng liên quan; có kế thừa ưu tiên thì 40,0 ms.</li>
<li>Mars Pathfinder được sửa từ Trái Đất bằng cách bật đúng tuỳ chọn mutex đó; trong backend, cùng hình dạng ấy được sửa bằng vùng găng ngắn, tách pool và thời hạn.</li>
</ul>
${L(MARS, '🚀', 'What really happened on Mars Rover Pathfinder', 'Bài kể năm 1997 của Mike Jones về lỗi đảo ngược ưu tiên và cách JPL sửa.', 'Mở')}
${L('https://man7.org/linux/man-pages/man3/pthread_mutexattr_setprotocol.3p.html', '📄', 'man pthread_mutexattr_setprotocol', 'PTHREAD_PRIO_INHERIT và PTHREAD_PRIO_PROTECT cho mutex.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 6.3 — Classic problems ───────────────────────── */
    {
      title: '6.3 — Dining philosophers solved three ways, readers-writers and bounded buffer|||6.3 — Triết gia ăn tối giải ba cách, đọc-ghi và bộ đệm giới hạn',
      slug: 'os-6-3-kinh-dien',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Năm triết gia đứng hình trong C và Java; ba lời giải (thứ tự đũa, người phục vụ semaphore 4, thử đũa rồi đặt lại) đo thông lượng và độ công bằng; lời giải không deadlock vẫn bỏ đói 4/5 người; bộ đệm giới hạn và đọc-ghi viết bằng semaphore theo dạng đề thi, và deadlock khi đổi chỗ hai dòng.',
      content: `${G63}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.3</span>
<h2>Five philosophers, five forks, zero meals</h2>
<p class="lead">Every OS exam has the same three problems: dining philosophers, the bounded buffer and readers–writers. They look like puzzles, but each is a pattern you will write in real code — two accounts in one transfer, a job queue, a cache read a thousand times per write. Here they run as real programs: which solutions actually work, how fast, and how fair?</p>

<h3>The problem</h3>
<p>Dijkstra posed it in 1965 (Hoare gave it the philosophers): five philosophers sit at a round table with one fork between each pair. To eat, philosopher <em>i</em> needs both neighbouring forks — fork <em>i</em> on the left and fork <em>i+1</em> on the right (philosopher 4's right fork is fork 0). Then they put the forks down and think. Forks are locks, philosophers are threads. Our program runs it for 2 seconds; <code>main</code> is a watchdog that declares deadlock if nobody eats for a full second:</p>
${details('philo.c — naive / ordered / waiter / trylock', src('ch06/philo.c', 'c'))}
${run('c63-philo', './philo naive')}
<p>Zero meals. Everyone picked up the left fork, and each right fork is someone else's left fork. The watchdog even shows it: every philosopher holds exactly one fork. Java's built-in detector draws the cycle for us:</p>
${run('c63-philo', 'java Philo.java naive')}
<p>0 → 1 → 2 → 3 → 4 → 0: all four Coffman conditions hold. The three classic solutions each break one of them.</p>
${lab('deadlock', 'philosophers', 'en', 'Five philosophers, five forks, four strategies: naive (everyone hungry at once ⇒ deadlock), ordered forks, a waiter (N − 1 seats) and try-lock + random pause. Watch each philosopher’s meal counter — it shows deadlock and starvation alike.')}

<h3>Solution 1: order the forks (break circular wait)</h3>
<p>Always pick up the <strong>lower-numbered</strong> fork first. For philosophers 0–3 nothing changes; philosopher 4 now reaches for fork 0 before fork 4, so the cycle cannot close — the same rule as "lock the smaller account id first" in 6.1.</p>
${run('c63-philo', './philo ordered')}
${lab('race', 'ordered', 'en', 'The two-lock version of the same rule: when every thread takes locks in one global order, the wait-for arrows can never close into a cycle. Ordering the forks is this, with five locks.', { tour: 'race-deadlock' })}
<p>Fastest of the three — 12,412 meals in 2 s — but uneven: philosophers 0 and 4 both start with fork 0, compete for it, and eat about half as much as philosopher 3.</p>

<h3>Solution 2: a waiter (break circular wait with a semaphore)</h3>
<p>Let at most <strong>four</strong> philosophers sit at once — a counting semaphore initialised to N − 1. With four people and five forks, by the pigeonhole principle at least one of them gets both forks, so the cycle of five can never form.</p>
${run('c63-philo', './philo waiter')}
<p>Slightly fewer meals (11,345: someone always waits for a seat), but almost perfectly fair: 2,265 to 2,271 each.</p>

<h3>Solution 3: try the second fork, put the first back (break hold and wait)</h3>
<p>Pick up the left fork, <em>try</em> the right one; if it is taken, put the left one down and pause a random time — the try-lock fix from 6.1.</p>
${run('c63-philo', './philo trylock')}
<p>Lowest throughput (8,734 meals — time lost putting forks back and pausing) but fair and needing no global rule. Without the random pause, five philosophers could pick up and put down in lockstep forever: the livelock of 6.2.</p>
<table>
<tr><th>solution</th><th>breaks</th><th>meals in 2 s</th><th>per philosopher</th><th>note</th></tr>
<tr><td>left then right</td><td>— (all four hold)</td><td>0</td><td>0 0 0 0 0</td><td>deadlock, exit 3</td></tr>
<tr><td>ordered forks</td><td>circular wait</td><td>12,412</td><td>1,699 … 3,159</td><td>fastest, uneven</td></tr>
<tr><td>waiter, semaphore 4</td><td>circular wait</td><td>11,345</td><td>2,265 … 2,271</td><td>fair, one extra semaphore</td></tr>
<tr><td>try-lock + random pause</td><td>hold and wait</td><td>8,734</td><td>1,701 … 1,828</td><td>no global rule; slowest</td></tr>
</table>
<p>Other answers you will see: <strong>Chandy–Misra</strong> (1984) — forks are "dirty" or "clean" and are handed over on request, which works for any graph of neighbours; and one global mutex around picking up both forks, which is correct but lets only one philosopher pick up at a time.</p>

<h3>Deadlock-free is not starvation-free</h3>
${details('Philo.java — naive / ordered / waiter', src('ch06/Philo.java', 'java'))}
${run('c63-philo', 'java Philo.java ordered', 2)}
<p>The same ordered solution in Java, with <code>ReentrantLock</code> (not fair by default): <strong>philosopher 3 ate 8,407 times; philosophers 0, 1 and 4 once each.</strong> No deadlock — and four of five starved. A thread that releases a lock and immediately asks again is still on a CPU and usually wins; the woken waiter is not. The waiter version spread meals out (749 to 2,449). If fairness matters, say so in code: <code>new ReentrantLock(true)</code> or a FIFO queue — and measure the throughput you pay for it.</p>

<div class="pitfall co-tieu-de">
<p><strong>"It no longer deadlocks, ship it."</strong> The exam question "is your solution starvation-free?" exists because the answer is often no. Our deadlock-free Java solution let one thread do 99.7% of the work. In a server the same shape means one tenant or one request type monopolises a lock, a pool or a queue while others time out — and every health check still says "no deadlock". Measure per-thread (per-tenant) progress, not just total throughput.</p>
</div>

<h3>Bounded buffer with semaphores — the exam form</h3>
<p>Lesson 5.2 built a producer–consumer queue with a condition variable. The exam wants it with three semaphores: <code>empty</code> counts free slots, <code>full</code> counts filled slots, <code>mutex</code> guards the few lines that touch the array.</p>
${cmd('semaphore empty = N, full = 0, mutex = 1;',
  '',
  'producer:                consumer:',
  '  wait(empty);             wait(full);',
  '  wait(mutex);             wait(mutex);',
  '  put(item);               item = take();',
  '  signal(mutex);           signal(mutex);',
  '  signal(full);            signal(empty);')}
${details('bb.c — right / wrong', src('ch06/bb.c', 'c'))}
${run('c63-philo', './bb right')}
<p>The rule: wait on the <strong>counting</strong> semaphore first, take the <strong>mutex</strong> last. Swap the two waits in the producer and see:</p>
${run('c63-philo', './bb wrong')}
<p>Deadlock as soon as the buffer filled (4 produced). The producer took <code>mutex</code> and went to sleep on <code>empty = 0</code> — holding the mutex. The consumer had already taken a <code>full</code> ticket (full went 4 → 3) and now waits for <code>mutex = 0</code> before it can free a slot. Each holds what the other needs. This exact swap is a favourite exam trap.</p>

<h3>Readers–writers — the exam form</h3>
${cmd('semaphore rw = 1, mutex = 1;  int readers = 0;',
  '',
  'writer:          reader:',
  '  wait(rw);        wait(mutex);',
  '  write();         if (++readers == 1) wait(rw);   // first reader locks writers out',
  '  signal(rw);      signal(mutex);',
  '                   read();',
  '                   wait(mutex);',
  '                   if (--readers == 0) signal(rw); // last reader lets them in',
  '                   signal(mutex);')}
<p>Many readers read together; a writer writes alone. This is the <em>first</em> readers–writers solution, and it prefers readers: as long as readers keep overlapping, <code>rw</code> is never released and the writer starves — exactly what <code>./starve readers</code> measured in 6.2 (gave up after 3,000 ms). The second solution gives writers priority (then readers can starve); a fair queue serves both in arrival order. In real code use <code>pthread_rwlock_t</code> or <code>ReentrantReadWriteLock</code> (lesson 5.3).</p>
${lab('sync', 'writerpref', 'en', 'The second readers–writers solution: a waiting writer blocks new readers, so it gets in quickly. Switch “Lock prefers” back to readers to watch the first solution starve it.')}
${L(OSG26, '🎓', 'OSG202 · 2.6 — Classic IPC problems', 'Dining philosophers, readers–writers and the sleeping barber as in the course textbook.', 'Open')}

<h3>How to answer in an exam or an interview</h3>
<table>
<tr><th>they ask</th><th>answer (and draw)</th></tr>
<tr><td>why do the philosophers deadlock?</td><td>all four Coffman conditions; the cycle P0 → P1 → … → P4 → P0 of "holds left, waits for right"</td></tr>
<tr><td>give a fix</td><td>order the forks (P4 takes fork 0 first) / at most N − 1 at the table / pick up both or none — and say which condition it breaks</td></tr>
<tr><td>is it starvation-free?</td><td>not automatically: an unfair lock let one philosopher eat 8,407 times while three ate once</td></tr>
<tr><td>order of the waits in the bounded buffer?</td><td>counting semaphore first, mutex second — the other order deadlocks when the buffer is full</td></tr>
<tr><td>weakness of the readers–writers solution?</td><td>the first version starves writers; fix with writer priority or a fair queue</td></tr>
</table>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> your team's job runner has five workers and five shared resources arranged in a ring (each job needs the resource on its left and right). It froze twice last month. You must propose a fix and prove it is fair.</p>
<ol>
<li>Run <code>./philo</code> in all four modes and <code>java Philo.java</code> in all three; put meals and per-philosopher counts in one table.</li>
<li>For each working solution, write which Coffman condition it breaks.</li>
<li>Change <code>Philo.java</code> to use <code>new ReentrantLock(true)</code> and run <code>ordered</code> again. What happens to the per-philosopher numbers and to the total?</li>
<li>Run <code>./bb wrong</code> and explain the printed <code>empty=0 full=3 mutex=0</code> line by line.</li>
</ol>
<p><strong>Done when:</strong> your table shows which solution is fastest and which is fairest with real numbers, you have measured the effect of a fair lock, and you can explain the bounded-buffer deadlock from its three semaphore values.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['dining philosophers', 'N threads in a ring, each needing its two neighbouring locks. The standard model of multi-lock deadlock.'],
  ['resource ordering', 'Take locks in increasing number; for the philosophers, the last one takes fork 0 first. Breaks circular wait.'],
  ['waiter (N − 1 seats)', 'A counting semaphore lets at most N − 1 philosophers try at once, so one always gets both forks.'],
  ['bounded buffer', 'A fixed-size queue between producers and consumers; semaphores empty/full count slots, a mutex guards the array.'],
  ['readers–writers', 'Many readers together or one writer alone; the first solution starves writers, the second starves readers.'],
  ['fair lock', 'A lock that grants waiters in arrival order (ReentrantLock(true)); prevents starvation at some throughput cost.'],
  ['Chandy–Misra', 'A 1984 philosophers solution with dirty/clean forks passed on request; generalises to any neighbour graph.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Naive philosophers (left, then right) deadlock at once: 0 meals, each holding one fork, a cycle of five.</li>
<li>Ordered forks: 12,412 meals but uneven; waiter (semaphore 4): 11,345 and fair; try-lock + random pause: 8,734.</li>
<li>Deadlock-free ≠ starvation-free: Java's unfair lock let one philosopher eat 8,407 times, three others once.</li>
<li>Bounded buffer: counting semaphore first, mutex second — swapping them deadlocked after 4 items.</li>
<li>The first readers–writers solution starves writers; measured in 6.2 as a 3-second wait.</li>
</ul>
${L(OSTEP, '📘', 'OSTEP — Common Concurrency Problems', 'Deadlock, the dining philosophers and their fixes, free.', 'Open')}
${L('https://pages.cs.wisc.edu/~remzi/OSTEP/threads-sema.pdf', '📘', 'OSTEP — Semaphores', 'Bounded buffer, readers–writers and dining philosophers with semaphores.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.3</span>
<h2>Năm triết gia, năm chiếc đũa, không bữa ăn nào</h2>
<p class="lead">Đề thi hệ điều hành nào cũng có ba bài giống nhau: triết gia ăn tối, bộ đệm giới hạn và đọc-ghi. Chúng trông như câu đố, nhưng mỗi bài là một khuôn mẫu bạn sẽ viết trong code thật — hai tài khoản trong một lệnh chuyển, một hàng đợi việc, một cache được đọc nghìn lần mỗi lần ghi. Ở đây chúng chạy thành chương trình thật: lời giải nào thực sự đúng, nhanh cỡ nào, và công bằng cỡ nào?</p>

<h3>Bài toán</h3>
<p>Dijkstra đặt ra bài này năm 1965 (Hoare là người đưa các triết gia vào): năm triết gia ngồi quanh bàn tròn, giữa mỗi hai người có một chiếc đũa. Muốn ăn, triết gia <em>i</em> cần cả hai chiếc bên cạnh — đũa <em>i</em> bên trái và đũa <em>i+1</em> bên phải (đũa phải của triết gia 4 là đũa 0). Ăn xong đặt đũa xuống và suy nghĩ. Đũa là khoá, triết gia là luồng. Chương trình của ta chạy 2 giây; <code>main</code> là bộ canh, báo deadlock nếu suốt một giây không ai được ăn:</p>
${details('philo.c — naive / ordered / waiter / trylock', src('ch06/philo.c', 'c'))}
${run('c63-philo', './philo naive')}
<p>Không bữa nào. Ai cũng cầm đũa trái, mà đũa phải của mỗi người lại là đũa trái của người khác. Bộ canh cho thấy rõ: mỗi triết gia cầm đúng một chiếc. Bộ phát hiện có sẵn của Java vẽ vòng giúp ta:</p>
${run('c63-philo', 'java Philo.java naive')}
<p>0 → 1 → 2 → 3 → 4 → 0: cả bốn điều kiện Coffman đều đúng. Ba lời giải kinh điển, mỗi cái phá một điều.</p>
${lab('deadlock', 'philosophers', 'vi', 'Năm triết gia, năm chiếc đũa, bốn chiến lược: ngây thơ (cùng đói một lúc ⇒ deadlock), đánh số đũa, người phục vụ (N − 1 chỗ ngồi) và trylock + nghỉ ngẫu nhiên. Nhìn bộ đếm bữa của từng người — nó cho thấy cả deadlock lẫn chết đói.')}

<h3>Lời giải 1: sắp thứ tự đũa (phá chờ vòng tròn)</h3>
<p>Luôn cầm chiếc đũa <strong>số nhỏ</strong> trước. Với triết gia 0–3 không gì thay đổi; triết gia 4 giờ với đũa 0 trước đũa 4, nên vòng không thể khép — đúng luật "khoá tài khoản id nhỏ trước" ở bài 6.1.</p>
${run('c63-philo', './philo ordered')}
${lab('race', 'ordered', 'vi', 'Bản hai khoá của cùng một luật: khi mọi luồng lấy khoá theo một thứ tự chung, các mũi tên chờ không bao giờ khép thành vòng. Sắp thứ tự đũa chính là điều này, với năm khoá.', { tour: 'race-deadlock' })}
<p>Nhanh nhất trong ba cách — 12.412 bữa trong 2 giây — nhưng không đều: triết gia 0 và 4 cùng bắt đầu bằng đũa 0, tranh nhau nó, và chỉ ăn khoảng một nửa so với triết gia 3.</p>

<h3>Lời giải 2: người phục vụ (phá chờ vòng tròn bằng semaphore)</h3>
<p>Cho tối đa <strong>bốn</strong> triết gia ngồi cùng lúc — một semaphore đếm khởi tạo bằng N − 1. Bốn người với năm chiếc đũa thì theo nguyên lý chuồng bồ câu ít nhất một người có đủ hai chiếc, nên vòng năm người không bao giờ hình thành.</p>
${run('c63-philo', './philo waiter')}
<p>Ít bữa hơn một chút (11.345: luôn có người chờ chỗ ngồi), nhưng gần như công bằng tuyệt đối: mỗi người 2.265 tới 2.271 bữa.</p>

<h3>Lời giải 3: thử chiếc thứ hai, đặt lại chiếc đầu (phá giữ và chờ)</h3>
<p>Cầm đũa trái, <em>thử</em> đũa phải; nếu đang bị giữ thì đặt đũa trái xuống và nghỉ một khoảng ngẫu nhiên — chính cách thử khoá ở bài 6.1.</p>
${run('c63-philo', './philo trylock')}
<p>Thông lượng thấp nhất (8.734 bữa — mất thời gian đặt đũa xuống và nghỉ) nhưng công bằng và không cần luật chung nào. Không có khoảng nghỉ ngẫu nhiên, năm triết gia có thể cầm lên đặt xuống cùng nhịp mãi mãi: livelock của bài 6.2.</p>
<table>
<tr><th>lời giải</th><th>phá</th><th>số bữa trong 2 s</th><th>mỗi triết gia</th><th>ghi chú</th></tr>
<tr><td>trái rồi phải</td><td>— (đủ cả bốn)</td><td>0</td><td>0 0 0 0 0</td><td>deadlock, exit 3</td></tr>
<tr><td>sắp thứ tự đũa</td><td>chờ vòng tròn</td><td>12.412</td><td>1.699 … 3.159</td><td>nhanh nhất, không đều</td></tr>
<tr><td>người phục vụ, semaphore 4</td><td>chờ vòng tròn</td><td>11.345</td><td>2.265 … 2.271</td><td>công bằng, thêm một semaphore</td></tr>
<tr><td>thử khoá + nghỉ ngẫu nhiên</td><td>giữ và chờ</td><td>8.734</td><td>1.701 … 1.828</td><td>không cần luật chung; chậm nhất</td></tr>
</table>
<p>Các đáp án khác bạn sẽ gặp: <strong>Chandy–Misra</strong> (1984) — đũa "bẩn" hoặc "sạch" và được chuyền theo yêu cầu, áp dụng được cho mọi đồ thị láng giềng; và một mutex chung bao quanh việc cầm cả hai đũa, đúng nhưng mỗi lúc chỉ một triết gia được cầm.</p>

<h3>Không deadlock chưa chắc đã không đói</h3>
${details('Philo.java — naive / ordered / waiter', src('ch06/Philo.java', 'java'))}
${run('c63-philo', 'java Philo.java ordered', 2)}
<p>Cùng lời giải sắp thứ tự trong Java, với <code>ReentrantLock</code> (mặc định không công bằng): <strong>triết gia 3 ăn 8.407 lần; triết gia 0, 1 và 4 mỗi người một lần.</strong> Không deadlock — mà bốn trên năm người bị đói. Luồng vừa nhả khoá rồi xin lại ngay vẫn đang ở trên CPU và thường thắng; người chờ vừa được đánh thức thì không. Bản người phục vụ chia đều hơn (749 tới 2.449). Nếu công bằng là yêu cầu, hãy nói rõ trong code: <code>new ReentrantLock(true)</code> hoặc một hàng đợi FIFO — và đo phần thông lượng bạn phải trả.</p>

<div class="pitfall co-tieu-de">
<p><strong>"Hết deadlock rồi, cho lên production."</strong> Câu hỏi thi "lời giải của bạn có tránh được đói không?" tồn tại vì câu trả lời thường là không. Lời giải Java không deadlock của ta để một luồng làm 99,7% công việc. Trên máy chủ, cùng hình dạng đó nghĩa là một khách hàng hay một loại request độc chiếm một khoá, một pool hay một hàng đợi trong khi những người khác hết thời gian chờ — và mọi health check vẫn báo "không deadlock". Hãy đo tiến độ theo từng luồng (từng khách hàng), không chỉ tổng thông lượng.</p>
</div>

<h3>Bộ đệm giới hạn bằng semaphore — dạng đề thi</h3>
<p>Bài 5.2 dựng hàng đợi producer–consumer bằng biến điều kiện. Đề thi muốn viết bằng ba semaphore: <code>empty</code> đếm chỗ trống, <code>full</code> đếm chỗ đã có hàng, <code>mutex</code> bảo vệ mấy dòng đụng vào mảng.</p>
${cmd('semaphore empty = N, full = 0, mutex = 1;',
  '',
  'producer:                consumer:',
  '  wait(empty);             wait(full);',
  '  wait(mutex);             wait(mutex);',
  '  put(item);               item = take();',
  '  signal(mutex);           signal(mutex);',
  '  signal(full);            signal(empty);')}
${details('bb.c — right / wrong', src('ch06/bb.c', 'c'))}
${run('c63-philo', './bb right')}
<p>Luật: chờ semaphore <strong>đếm</strong> trước, lấy <strong>mutex</strong> sau cùng. Đổi chỗ hai lệnh chờ trong producer và xem:</p>
${run('c63-philo', './bb wrong')}
<p>Deadlock ngay khi bộ đệm đầy (đã sản xuất 4). Producer lấy <code>mutex</code> rồi đi ngủ chờ <code>empty = 0</code> — trong lúc vẫn giữ mutex. Consumer đã lấy một "vé" <code>full</code> (full từ 4 xuống 3) và giờ chờ <code>mutex = 0</code> trước khi kịp giải phóng một chỗ. Mỗi bên giữ đúng thứ bên kia cần. Chính cú đổi chỗ này là cái bẫy đề thi rất thích.</p>

<h3>Đọc-ghi — dạng đề thi</h3>
${cmd('semaphore rw = 1, mutex = 1;  int readers = 0;',
  '',
  'writer:          reader:',
  '  wait(rw);        wait(mutex);',
  '  write();         if (++readers == 1) wait(rw);   // người đọc đầu tiên chặn người ghi',
  '  signal(rw);      signal(mutex);',
  '                   read();',
  '                   wait(mutex);',
  '                   if (--readers == 0) signal(rw); // người đọc cuối cùng mở cửa',
  '                   signal(mutex);')}
<p>Nhiều người đọc cùng lúc; người ghi ghi một mình. Đây là lời giải đọc-ghi <em>thứ nhất</em>, và nó ưu tiên người đọc: chừng nào người đọc còn chồng lên nhau, <code>rw</code> không bao giờ được nhả và người ghi bị đói — đúng điều <code>./starve readers</code> đã đo ở bài 6.2 (bỏ cuộc sau 3.000 ms). Lời giải thứ hai ưu tiên người ghi (khi đó người đọc có thể bị đói); một hàng đợi công bằng phục vụ cả hai theo thứ tự đến. Trong code thật hãy dùng <code>pthread_rwlock_t</code> hoặc <code>ReentrantReadWriteLock</code> (bài 5.3).</p>
${lab('sync', 'writerpref', 'vi', 'Lời giải readers–writers thứ hai: người ghi đang chờ chặn người đọc mới, nên nó vào được nhanh. Đổi “Khoá ưu tiên” về người đọc để thấy lời giải thứ nhất bỏ đói nó.')}
${L(OSG26, '🎓', 'OSG202 · 2.6 — Các bài toán IPC kinh điển', 'Triết gia ăn tối, đọc-ghi và thợ cắt tóc ngủ gật theo giáo trình môn học.', 'Mở')}

<h3>Trả lời thế nào khi đi thi hay phỏng vấn</h3>
<table>
<tr><th>họ hỏi</th><th>trả lời (và vẽ)</th></tr>
<tr><td>vì sao các triết gia bị deadlock?</td><td>đủ bốn điều kiện Coffman; vòng P0 → P1 → … → P4 → P0 kiểu "cầm trái, chờ phải"</td></tr>
<tr><td>đưa một cách sửa</td><td>sắp thứ tự đũa (P4 cầm đũa 0 trước) / tối đa N − 1 người ngồi / cầm cả hai hoặc không cầm — và nói nó phá điều kiện nào</td></tr>
<tr><td>có tránh được đói không?</td><td>không tự động: một khoá không công bằng để một triết gia ăn 8.407 lần trong khi ba người ăn một lần</td></tr>
<tr><td>thứ tự các lệnh chờ trong bộ đệm giới hạn?</td><td>semaphore đếm trước, mutex sau — thứ tự ngược lại sẽ deadlock khi bộ đệm đầy</td></tr>
<tr><td>điểm yếu của lời giải đọc-ghi?</td><td>bản thứ nhất bỏ đói người ghi; sửa bằng ưu tiên người ghi hoặc hàng đợi công bằng</td></tr>
</table>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> bộ chạy job của nhóm bạn có năm worker và năm tài nguyên dùng chung xếp thành vòng (mỗi job cần tài nguyên bên trái và bên phải). Tháng trước nó đứng hình hai lần. Bạn phải đề xuất cách sửa và chứng minh nó công bằng.</p>
<ol>
<li>Chạy <code>./philo</code> ở cả bốn chế độ và <code>java Philo.java</code> ở cả ba; đưa số bữa và số bữa từng triết gia vào một bảng.</li>
<li>Với mỗi lời giải chạy được, ghi nó phá điều kiện Coffman nào.</li>
<li>Sửa <code>Philo.java</code> dùng <code>new ReentrantLock(true)</code> và chạy lại <code>ordered</code>. Số bữa từng triết gia và tổng số thay đổi ra sao?</li>
<li>Chạy <code>./bb wrong</code> và giải thích từng giá trị trong dòng <code>empty=0 full=3 mutex=0</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bảng của bạn cho thấy lời giải nào nhanh nhất và lời giải nào công bằng nhất bằng số thật, bạn đã đo tác động của khoá công bằng, và giải thích được deadlock bộ đệm giới hạn từ ba giá trị semaphore của nó.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['dining philosophers (triết gia ăn tối)', 'N luồng xếp vòng, mỗi luồng cần hai khoá bên cạnh. Mô hình chuẩn của deadlock nhiều khoá.'],
  ['resource ordering (sắp thứ tự tài nguyên)', 'Lấy khoá theo số tăng dần; với các triết gia, người cuối cầm đũa 0 trước. Phá chờ vòng tròn.'],
  ['waiter (người phục vụ, N − 1 chỗ)', 'Một semaphore đếm cho tối đa N − 1 triết gia cùng thử, nên luôn có một người cầm được đủ hai đũa.'],
  ['bounded buffer (bộ đệm giới hạn)', 'Hàng đợi cỡ cố định giữa producer và consumer; semaphore empty/full đếm chỗ, mutex bảo vệ mảng.'],
  ['readers–writers (đọc-ghi)', 'Nhiều người đọc cùng lúc hoặc một người ghi một mình; lời giải thứ nhất bỏ đói người ghi, thứ hai bỏ đói người đọc.'],
  ['fair lock (khoá công bằng)', 'Khoá trao cho người chờ theo thứ tự đến (ReentrantLock(true)); chống đói, đổi lại tốn chút thông lượng.'],
  ['Chandy–Misra', 'Lời giải triết gia năm 1984 với đũa bẩn/sạch được chuyền theo yêu cầu; mở rộng được cho mọi đồ thị láng giềng.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Triết gia ngây thơ (trái rồi phải) deadlock ngay: 0 bữa, mỗi người cầm một chiếc đũa, một vòng năm người.</li>
<li>Sắp thứ tự đũa: 12.412 bữa nhưng không đều; người phục vụ (semaphore 4): 11.345 và công bằng; thử khoá + nghỉ ngẫu nhiên: 8.734.</li>
<li>Không deadlock ≠ không đói: khoá không công bằng của Java để một triết gia ăn 8.407 lần, ba người khác một lần.</li>
<li>Bộ đệm giới hạn: semaphore đếm trước, mutex sau — đổi chỗ hai dòng là deadlock sau 4 phần tử.</li>
<li>Lời giải đọc-ghi thứ nhất bỏ đói người ghi; bài 6.2 đo được là chờ 3 giây.</li>
</ul>
${L(OSTEP, '📘', 'OSTEP — Common Concurrency Problems', 'Deadlock, triết gia ăn tối và các cách sửa, miễn phí.', 'Mở')}
${L('https://pages.cs.wisc.edu/~remzi/OSTEP/threads-sema.pdf', '📘', 'OSTEP — Semaphores', 'Bộ đệm giới hạn, đọc-ghi và triết gia ăn tối bằng semaphore.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 6.4 — Banker's, detection, PostgreSQL, Node ───────────────────────── */
    {
      title: "6.4 — Detection and avoidance: Banker's algorithm, PostgreSQL and Node pools|||6.4 — Phát hiện và tránh: thuật toán Banker, PostgreSQL và pool trong Node",
      slug: 'os-6-4-banker',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bốn chiến lược xử lý deadlock; thuật toán Banker chạy từng bước (dãy an toàn, cấp, chờ, từ chối) và thuật toán phát hiện; deadlock thật giữa hai phiên PostgreSQL 17 (ERROR 40P01 sau deadlock_timeout 1 s, pg_blocking_pids) và cách sửa bằng thứ tự khoá; deadlock pool kết nối, vòng await và pool bị đói trong Node.',
      content: `${G64}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.4</span>
<h2>Avoid it, or let it happen and catch it</h2>
<p class="lead">Lessons 6.1–6.3 prevented deadlock by changing the code. Two other strategies exist. <em>Avoidance</em> refuses any request that could lead to deadlock — the Banker's algorithm, the exam's favourite table. <em>Detection</em> lets deadlocks happen, finds the cycle and kills a victim — what your database does every day. Which one runs where, and what does it mean for the code you write?</p>

<h3>Four ways to deal with deadlock</h3>
<table>
<tr><th>strategy</th><th>idea</th><th>where you meet it</th></tr>
<tr><td>ignore ("ostrich")</td><td>assume it is rare, restart when it happens</td><td>Linux/Windows for application locks; your container's restart policy</td></tr>
<tr><td>prevent</td><td>break a Coffman condition by design</td><td>lock ordering, try-lock (6.1, 6.3)</td></tr>
<tr><td>avoid</td><td>know maximum needs; grant only if the state stays safe</td><td>Banker's algorithm — exams, and pool-sizing reasoning</td></tr>
<tr><td>detect &amp; recover</td><td>look for a cycle, abort a victim, retry</td><td>PostgreSQL, MySQL InnoDB, SQL Server, the JVM's ThreadMXBean</td></tr>
</table>

<h3>The Banker's algorithm, step by step</h3>
<p>Dijkstra's idea: a bank lends to customers who declared a credit limit, and never lends so much that it could not satisfy <em>some</em> customer's full limit, let them finish and repay, then the next, until everyone is done. Such an order is a <strong>safe sequence</strong>; a state that has one is <strong>safe</strong>. Per process and resource type:</p>
<ul>
<li><strong>Allocation</strong> — held now; <strong>Max</strong> — declared worst case; <strong>Need = Max − Allocation</strong> — what it may still ask for;</li>
<li><strong>Available</strong> — free in the system now.</li>
</ul>
<p>The textbook example: five processes, three resource types A, B, C with 10, 5 and 7 instances. Seven, two and five are allocated, so Available = (3,3,2). <code>banker.py</code> prints exactly the table you would write on paper, then runs the safety algorithm:</p>
${details('banker.py — safety / request / detect / pool', src('ch06/banker.py', 'python'))}
${run('c64-bank', 'python3 banker.py safety')}
<p>The safety algorithm: <strong>Work = Available</strong>; find any unfinished process whose <strong>Need ≤ Work</strong>; it can run to the end and give back its Allocation, so <strong>Work += Allocation</strong>; repeat. Everyone finishes ⇒ safe. Our scan gives &lt;P1, P3, P4, P0, P2&gt;; other orders (for example the textbook's &lt;P1, P3, P4, P2, P0&gt;) are also safe — any one is enough.</p>
${lab('deadlock', 'banker', 'en', 'The Banker’s algorithm on the textbook example (A B C = 10 5 7): step the safety check, watch Work grow as each process finishes and returns its Allocation, and read off the safe sequence ⟨P1, P3, P4, P0, P2⟩ — the same scan order as banker.py.', { tour: 'deadlock-banker' })}
<p>Now requests. For each one: (1) Request ≤ Need, or the process lied about its maximum; (2) Request ≤ Available, or it must wait; (3) <em>pretend</em> to grant, run safety on the new state, keep it if safe, roll back if not.</p>
${run('c64-bank', 'python3 banker.py request')}
<p>P1's (1,0,2) is granted — the new state is still safe. P4's (3,3,0) waits because only (2,3,0) is free. P0's (0,2,0) <strong>fits</strong> in Available, yet it is <strong>denied</strong>: afterwards Work = (2,1,0) satisfies nobody's Need, so the state would be unsafe. That is avoidance in one line: it refuses requests that <em>could</em> lead to deadlock, even when the resources are sitting free. Unsafe is not the same as deadlocked — it means that if everyone asked for their maximum, a deadlock could not be ruled out.</p>
${lab('deadlock', 'request', 'en', 'Three requests through the same check: P1 (1,0,2) is granted, P4 (3,3,0) must wait, and P0 (0,2,0) is refused although it fits in Available — granting it would leave no safe sequence.', { tour: 'deadlock-banker' })}

<h3>Detection: the same loop, with current requests</h3>
<p>Detection needs no maximums. Replace Need with the <strong>Request</strong> matrix (what each process is waiting for right now) and run the same loop starting from what is free:</p>
${run('c64-bank', 'python3 banker.py detect', 2)}
<p>In the first state everyone can finish. When P2 asks for one more C, only P0 can finish and <strong>P1–P4 are deadlocked</strong> — each waits for something only another stuck process holds. With single-instance resources this loop is just "find a cycle in the wait-for graph" from 6.1.</p>
${lab('deadlock', 'detect', 'en', 'Detection with the Request matrix (A, B, C = 7, 2, 6 instances): in the first state everyone can finish. Choose “P2 asks for one more C” and only P0 finishes — P1 to P4 are stuck. The graph shows who waits for whom.', { tour: 'deadlock-detect' })}
<p><strong>Recovery</strong> means somebody loses: abort every process in the cycle (lots of lost work), abort one victim at a time and re-run detection (pick the cheapest: least work done, fewest locks, lowest priority), or preempt resources and roll back to a checkpoint. A database transaction is exactly a unit you can roll back — which is why databases chose detection.</p>

<h3>PostgreSQL: a real deadlock, detected in one second</h3>
<p>Two sessions run the same transfer in opposite directions, inside a throwaway <code>postgres:17</code> container. Each updates its "from" row, calls a slow fraud check (here <code>pg_sleep(0.5)</code>) while holding that row lock, then updates the "to" row:</p>
${src('ch06/transfer.sql', 'sql')}
${run('c64-db', 'psql -X -c "SHOW deadlock_timeout"')}
${run('c64-db', 'psql -X -v from=1 -v to=2 -f transfer.sql', 2)}
<p>T1 got <strong>ERROR 40P01: deadlock detected</strong> about one second after it started waiting, with both processes and both transactions in the DETAIL, and was rolled back; T2 then committed. The money moved exactly once (alice 1100, bob 900). How it works: a backend that blocks on a lock first sleeps for <code>deadlock_timeout</code> (1 s by default) — most waits end sooner, and checking is not free — then builds the wait-for graph. If it finds a cycle, it cancels <em>its own</em> transaction. T1 started waiting first, so its timer fired first and T1 became the victim. The server log names the statement:</p>
${run('c64-db', 'grep -h -A4')}
<p>Want to see the cycle before the detector fires? Raise <code>deadlock_timeout</code> to 10 s and ask PostgreSQL who blocks whom:</p>
${run('c64-db', 'psql -qX -v from=1 -v to=2 -f transfer.sql >')}
<p><code>pg_blocking_pids()</code> <em>is</em> the wait-for graph: 130 is blocked by 133 and 133 by 130 — the same cycle gdb showed in C. The fix is the one from 6.1, written in SQL: lock both rows first, always in the same order.</p>
${src('ch06/transfer-ordered.sql', 'sql')}
${run('c64-db', 'psql -X -v from=1 -v to=2 -f transfer-ordered.sql', 2)}
<p>Same two opposite transfers, same sleep: T2's <code>SELECT … ORDER BY id FOR UPDATE</code> simply waits for T1, then runs. Both commit, no error, balances back to 1000/1000.</p>
${lab('race', 'deadlock', 'en', 'What PostgreSQL’s detector searches for: each transaction holds one row lock and waits for the other, and the wait-for arrows close into a cycle. The database breaks it by cancelling one of them.', { tour: 'race-deadlock' })}

<div class="pitfall co-tieu-de">
<p><strong>Catching 40P01 and retrying is necessary — and not a fix.</strong> Every write path that can deadlock must retry the whole transaction on SQLSTATE 40P01 (and 40001). But if deadlocks show up daily, each one costs a full second of a held connection plus a rolled-back transaction, and under load the retries collide again. Raising <code>deadlock_timeout</code> "to get fewer errors" only makes every deadlock last longer. Find the two statements in the server log and give them one lock order.</p>
</div>

<h3>Node: deadlock with no threads and no locks</h3>
<p>Node runs your JavaScript on one thread, so it cannot have a mutex deadlock. It can still wait forever — through a <strong>counting</strong> resource. <code>pool.js</code> is a tiny pool with the same behaviour as node-postgres' <code>Pool</code>: at most <code>max</code> connections, then callers queue; <code>connectionTimeoutMillis = 0</code> (the default) means wait forever.</p>
${details('pool.js — a minimal pool with pg.Pool semantics', src('ch06/pool.js', 'javascript'))}
${src('ch06/pool-deadlock.js', 'javascript')}
${run('c64-bank', 'node pool-deadlock.js 1')}
${run('c64-bank', 'node pool-deadlock.js 2;')}
<p>One order at a time works. Two at once, with a pool of two: each order holds one connection for its transaction, then <code>getPrice()</code> asks the same pool for a second — and there is none, and none will come back. "2 in use, 0 idle, 2 waiting", forever. That is a resource-allocation cycle through a multi-instance resource: exactly the case the Banker's algorithm reasons about.</p>
${run('c64-bank', 'python3 banker.py pool')}
<p>With two requests each holding one connection, the state is <strong>unsafe</strong>. The pool-sizing rule that falls out: with <em>c</em> concurrent requests each holding up to <em>m</em> connections, the pool needs more than <em>c × (m − 1)</em> connections. Better: never hold two. With a timeout, one request becomes the victim, as in PostgreSQL; passing the transaction's client down removes the cycle:</p>
${lab('deadlock', 'pool', 'en', 'The pool deadlock as a graph: 2 connections, each request holds one and asks for one more. Every instance is held by someone who is waiting — a cycle through a multi-instance resource, and this time a real deadlock.', { tour: 'deadlock-detect' })}
${run('c64-bank', 'node pool-deadlock.js 2 timeout')}
${run('c64-bank', 'node pool-deadlock.js 2 pass-client')}

<h3>An await cycle</h3>
<p>A cached loader where <code>config</code> needs <code>secrets</code> and <code>secrets</code> needs <code>config</code> makes a promise wait for itself — the same pattern as a dependency-injection container with a circular dependency:</p>
${src('ch06/await-cycle.mjs', 'javascript')}
${run('c64-bank', 'node await-cycle.mjs;')}
<p>As a script, Node notices that the event loop is empty while a top-level <code>await</code> is still pending, prints a warning and exits with code <strong>13</strong>. As a server, the listening socket keeps the loop alive, so nothing exits and nothing is logged — every request just hangs:</p>
${run('c64-bank', 'node await-cycle.mjs server', 2)}
<p><code>curl</code> gave up after 2 s (exit 28), and the process sits at about 2% CPU looking healthy. No thread dump will show a lock cycle; you find it by noticing that requests never complete and following the <code>await</code> chain.</p>

<h3>Pool starvation: not a deadlock, still an outage</h3>
${src('ch06/pool-starve.js', 'javascript')}
${run('c64-bank', 'node pool-starve.js shared')}
${run('c64-bank', 'node pool-starve.js bulkhead')}
<p>With one shared pool of two, four one-second reports queue first and a 5 ms health check waits <strong>1.9 s</strong> — long enough for a load balancer to declare the instance dead. Separate pools (a "bulkhead": one connection for reports, one for the API) answer the health check in 6 ms, and the reports now take 4 s instead of 2. Starvation is a choice of who waits; make it on purpose.</p>

<h3>Why real systems rarely run the Banker's algorithm</h3>
<ul>
<li>It needs every process's <strong>maximum</strong> in advance — a web request does not know how many rows or connections it will need.</li>
<li>It assumes a fixed set of processes and resources; real ones come and go.</li>
<li>It runs a safety check on <strong>every</strong> request (O(m·n²)), and refuses requests that would have been fine.</li>
</ul>
<p>So in practice: <strong>prevent</strong> in your own code (lock order, short critical sections, never two pool connections at once), <strong>detect</strong> in the database (deadlock_timeout, a victim, an application retry on 40P01), and put a <strong>timeout</strong> on everything that waits. The Banker survives in exams — and in the pool-size reasoning above.</p>
${L(OSG62, '🎓', 'OSG202 · 6.2 — Resource graphs &amp; Banker’s algorithm', 'The full hand-worked Banker’s example as in the course.', 'Open')}
${L(PG11, '🐘', 'PostgreSQL · 11.4 — Row locks, lost updates and deadlocks', 'FOR UPDATE, NOWAIT, SKIP LOCKED and lock queues in depth.', 'Open')}

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> your order service logs "deadlock detected" a few times a day, and last week it stopped answering entirely for ten minutes with "2 in use, 0 idle, N waiting" in its pool metrics.</p>
<ol>
<li>By hand, run the safety algorithm on the textbook state and on the state after granting P1 (1,0,2); check your steps against <code>python3 banker.py</code>.</li>
<li>In a throwaway <code>postgres:17</code> container, run the two <code>transfer.sql</code> sessions, then find the victim's statement in the server log and the cycle with <code>pg_blocking_pids()</code>.</li>
<li>Switch to <code>transfer-ordered.sql</code> and show that both sessions commit.</li>
<li>Run <code>node pool-deadlock.js 2</code>, then fix it two ways: a <code>connectionTimeoutMillis</code>, and passing the client down. Which one is a real fix?</li>
</ol>
<p><strong>Done when:</strong> your hand-worked safe sequence matches a valid order, you have the ERROR 40P01 output and the pg_blocking_pids cycle from your own run, and you can explain the pool hang with the rule pool size &gt; c × (m − 1).</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['safe state', 'A state with at least one order in which every process can get its maximum need and finish.'],
  ["Banker's algorithm", 'Grant a request only if, after pretending to grant it, the state is still safe. Needs every Max in advance.'],
  ['Need', 'Max − Allocation: what a process may still request. The safety check compares Need with Work.'],
  ['detection algorithm', 'The same loop with current Requests instead of Need; whoever cannot finish is deadlocked.'],
  ['deadlock_timeout', 'How long a PostgreSQL backend waits on a lock before running the deadlock check (default 1 s).'],
  ['40P01', 'SQLSTATE for deadlock_detected. The victim transaction is rolled back; the application must retry it.'],
  ['pool exhaustion deadlock', 'Requests each hold some pool connections and wait for more that only other waiting requests hold.'],
  ['bulkhead', 'Separate pools (or limits) per kind of work, so one kind cannot starve another.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Four strategies: ignore, prevent, avoid (Banker's), detect and recover (databases).</li>
<li>Banker's: Need = Max − Allocation; finish anyone with Need ≤ Work; a request is granted only if the pretended state stays safe — P0's (0,2,0) was denied although it fit.</li>
<li>Detection uses current Requests; P2 asking one more C left P1–P4 deadlocked.</li>
<li>PostgreSQL waits deadlock_timeout (1 s), finds the cycle, cancels one transaction with 40P01; consistent row order (ORDER BY id FOR UPDATE) removes it.</li>
<li>Node can deadlock through a pool (2 in use, 2 waiting, forever) or an await cycle (exit 13 / hanging requests); pass the client down, add timeouts, separate pools.</li>
</ul>
${L('https://www.postgresql.org/docs/current/explicit-locking.html', '🐘', 'PostgreSQL docs — Explicit Locking', 'Row locks, deadlocks and how to avoid them.', 'Open')}
${L('https://node-postgres.com/apis/pool', '🟩', 'node-postgres — Pool', 'max, connectionTimeoutMillis and releasing clients.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.4</span>
<h2>Tránh nó, hoặc để nó xảy ra rồi bắt lấy</h2>
<p class="lead">Bài 6.1–6.3 phòng deadlock bằng cách sửa code. Còn hai chiến lược khác. <em>Tránh</em> từ chối mọi yêu cầu có thể dẫn tới deadlock — thuật toán Banker, cái bảng đề thi yêu thích nhất. <em>Phát hiện</em> để deadlock xảy ra, tìm vòng chờ và giết một nạn nhân — việc CSDL của bạn làm mỗi ngày. Cách nào chạy ở đâu, và nó có ý nghĩa gì với code bạn viết?</p>

<h3>Bốn cách xử lý deadlock</h3>
<table>
<tr><th>chiến lược</th><th>ý tưởng</th><th>gặp ở đâu</th></tr>
<tr><td>phớt lờ ("đà điểu")</td><td>coi như hiếm, xảy ra thì khởi động lại</td><td>Linux/Windows với khoá của ứng dụng; chính sách restart của container</td></tr>
<tr><td>phòng ngừa</td><td>phá một điều kiện Coffman ngay từ thiết kế</td><td>thứ tự khoá, thử khoá (6.1, 6.3)</td></tr>
<tr><td>tránh</td><td>biết nhu cầu tối đa; chỉ cấp nếu trạng thái vẫn an toàn</td><td>thuật toán Banker — đề thi, và cách tính cỡ pool</td></tr>
<tr><td>phát hiện &amp; phục hồi</td><td>tìm vòng, huỷ một nạn nhân, thử lại</td><td>PostgreSQL, MySQL InnoDB, SQL Server, ThreadMXBean của JVM</td></tr>
</table>

<h3>Thuật toán Banker, từng bước</h3>
<p>Ý tưởng của Dijkstra: một ngân hàng cho những khách đã khai hạn mức vay, và không bao giờ cho vay nhiều tới mức không còn đáp ứng được trọn hạn mức của <em>ít nhất một</em> khách, để khách đó xong việc và trả nợ, rồi tới khách tiếp theo, cho tới khi mọi người xong. Một thứ tự như thế là <strong>dãy an toàn (safe sequence)</strong>; trạng thái có một dãy như thế là <strong>an toàn</strong>. Với mỗi tiến trình và loại tài nguyên:</p>
<ul>
<li><strong>Allocation</strong> — đang giữ; <strong>Max</strong> — mức tối đa đã khai; <strong>Need = Max − Allocation</strong> — còn có thể xin;</li>
<li><strong>Available</strong> — đang rảnh trong hệ thống.</li>
</ul>
<p>Ví dụ trong giáo trình: năm tiến trình, ba loại tài nguyên A, B, C với 10, 5 và 7 bản. Đã cấp 7, 2 và 5, nên Available = (3,3,2). <code>banker.py</code> in đúng cái bảng bạn sẽ viết trên giấy, rồi chạy thuật toán an toàn:</p>
${details('banker.py — safety / request / detect / pool', src('ch06/banker.py', 'python'))}
${run('c64-bank', 'python3 banker.py safety')}
<p>Thuật toán an toàn: <strong>Work = Available</strong>; tìm một tiến trình chưa xong có <strong>Need ≤ Work</strong>; nó chạy được tới cuối và trả lại Allocation, nên <strong>Work += Allocation</strong>; lặp lại. Mọi tiến trình đều xong ⇒ an toàn. Cách quét của ta cho &lt;P1, P3, P4, P0, P2&gt;; các thứ tự khác (ví dụ &lt;P1, P3, P4, P2, P0&gt; trong giáo trình) cũng an toàn — chỉ cần một.</p>
${lab('deadlock', 'banker', 'vi', 'Thuật toán Banker trên ví dụ giáo trình (A B C = 10 5 7): bước từng lần kiểm an toàn, nhìn Work tăng khi mỗi tiến trình chạy xong và trả lại Allocation, rồi đọc dãy an toàn ⟨P1, P3, P4, P0, P2⟩ — đúng thứ tự quét của banker.py.', { tour: 'deadlock-banker' })}
<p>Giờ tới các yêu cầu. Với mỗi yêu cầu: (1) Request ≤ Need, không thì tiến trình đã khai sai mức tối đa; (2) Request ≤ Available, không thì phải chờ; (3) <em>giả vờ</em> cấp, chạy thuật toán an toàn trên trạng thái mới, an toàn thì giữ, không thì quay lui.</p>
${run('c64-bank', 'python3 banker.py request')}
<p>Yêu cầu (1,0,2) của P1 được cấp — trạng thái mới vẫn an toàn. Yêu cầu (3,3,0) của P4 phải chờ vì chỉ còn (2,3,0). Yêu cầu (0,2,0) của P0 <strong>vừa</strong> trong Available, vậy mà bị <strong>từ chối</strong>: sau đó Work = (2,1,0) không đáp ứng được Need của ai, nên trạng thái sẽ không an toàn. Tránh deadlock gói gọn trong một dòng: nó từ chối những yêu cầu <em>có thể</em> dẫn tới deadlock, kể cả khi tài nguyên đang nằm rảnh. Không an toàn không phải là đang deadlock — nó nghĩa là nếu mọi người cùng xin mức tối đa thì không loại trừ được deadlock.</p>
${lab('deadlock', 'request', 'vi', 'Ba yêu cầu qua cùng phép kiểm: P1 (1,0,2) được cấp, P4 (3,3,0) phải chờ, còn P0 (0,2,0) bị từ chối dù vừa với Available — cấp nó thì không còn dãy an toàn nào.', { tour: 'deadlock-banker' })}

<h3>Phát hiện: cùng vòng lặp, với yêu cầu hiện tại</h3>
<p>Phát hiện không cần mức tối đa. Thay Need bằng ma trận <strong>Request</strong> (thứ mỗi tiến trình đang chờ ngay lúc này) và chạy cùng vòng lặp bắt đầu từ phần đang rảnh:</p>
${run('c64-bank', 'python3 banker.py detect', 2)}
<p>Ở trạng thái đầu, ai cũng xong được. Khi P2 xin thêm một C, chỉ P0 xong được và <strong>P1–P4 bị deadlock</strong> — mỗi bên chờ thứ chỉ một tiến trình đang kẹt khác giữ. Với tài nguyên một bản, vòng lặp này chính là "tìm vòng trong đồ thị chờ" của bài 6.1.</p>
${lab('deadlock', 'detect', 'vi', 'Phát hiện bằng ma trận Request (A, B, C = 7, 2, 6 bản): ở trạng thái đầu ai cũng chạy xong được. Chọn “P2 xin thêm một C” thì chỉ P0 xong — P1 tới P4 kẹt. Đồ thị cho thấy ai chờ ai.', { tour: 'deadlock-detect' })}
<p><strong>Phục hồi</strong> nghĩa là ai đó phải thua: huỷ mọi tiến trình trong vòng (mất nhiều công), huỷ từng nạn nhân một rồi chạy lại phát hiện (chọn bên rẻ nhất: làm được ít việc nhất, giữ ít khoá nhất, ưu tiên thấp nhất), hoặc giành lại tài nguyên và quay lui về một điểm lưu. Giao dịch CSDL đúng là một đơn vị quay lui được — vì thế CSDL chọn phát hiện.</p>

<h3>PostgreSQL: một deadlock thật, phát hiện trong một giây</h3>
<p>Hai phiên chạy cùng lệnh chuyển theo hai chiều ngược nhau, trong một container <code>postgres:17</code> vứt đi. Mỗi phiên cập nhật dòng "từ", gọi một kiểm tra chống gian lận chậm (ở đây là <code>pg_sleep(0.5)</code>) trong lúc giữ khoá dòng đó, rồi cập nhật dòng "tới":</p>
${src('ch06/transfer.sql', 'sql')}
${run('c64-db', 'psql -X -c "SHOW deadlock_timeout"')}
${run('c64-db', 'psql -X -v from=1 -v to=2 -f transfer.sql', 2)}
<p>T1 nhận <strong>ERROR 40P01: deadlock detected</strong> khoảng một giây sau khi bắt đầu chờ, kèm hai tiến trình và hai giao dịch trong phần DETAIL, và bị quay lui; rồi T2 commit. Tiền chuyển đúng một lần (alice 1100, bob 900). Cơ chế: một backend bị chặn ở khoá sẽ ngủ hết <code>deadlock_timeout</code> (mặc định 1 giây) trước — phần lớn các lần chờ kết thúc sớm hơn, và việc kiểm tra không miễn phí — rồi mới dựng đồ thị chờ. Nếu thấy vòng, nó huỷ giao dịch <em>của chính mình</em>. T1 bắt đầu chờ trước nên đồng hồ của nó hết trước và T1 thành nạn nhân. Log máy chủ ghi rõ câu lệnh:</p>
${run('c64-db', 'grep -h -A4')}
<p>Muốn nhìn thấy vòng trước khi bộ phát hiện chạy? Nâng <code>deadlock_timeout</code> lên 10 giây và hỏi PostgreSQL ai chặn ai:</p>
${run('c64-db', 'psql -qX -v from=1 -v to=2 -f transfer.sql >')}
<p><code>pg_blocking_pids()</code> <em>chính là</em> đồ thị chờ: 130 bị 133 chặn và 133 bị 130 chặn — đúng vòng mà gdb đã cho thấy trong C. Cách sửa là cách của bài 6.1, viết bằng SQL: khoá cả hai dòng trước, luôn theo cùng một thứ tự.</p>
${src('ch06/transfer-ordered.sql', 'sql')}
${run('c64-db', 'psql -X -v from=1 -v to=2 -f transfer-ordered.sql', 2)}
<p>Vẫn hai lệnh chuyển ngược chiều, vẫn khoảng ngủ đó: <code>SELECT … ORDER BY id FOR UPDATE</code> của T2 chỉ việc chờ T1, rồi chạy. Cả hai commit, không lỗi, số dư trở về 1000/1000.</p>
${lab('race', 'deadlock', 'vi', 'Thứ mà bộ phát hiện của PostgreSQL đi tìm: mỗi giao dịch giữ một khoá dòng và chờ khoá kia, các mũi tên chờ khép thành vòng. CSDL phá vòng bằng cách huỷ một trong hai.', { tour: 'race-deadlock' })}

<div class="pitfall co-tieu-de">
<p><strong>Bắt 40P01 rồi thử lại là cần thiết — nhưng chưa phải sửa.</strong> Mọi đường ghi có thể deadlock đều phải thử lại cả giao dịch khi gặp SQLSTATE 40P01 (và 40001). Nhưng nếu deadlock xuất hiện hằng ngày, mỗi lần tốn trọn một giây giữ kết nối cộng một giao dịch bị quay lui, và lúc tải cao các lần thử lại lại đụng nhau. Nâng <code>deadlock_timeout</code> "cho đỡ lỗi" chỉ làm mỗi deadlock kéo dài hơn. Hãy tìm hai câu lệnh trong log máy chủ và cho chúng một thứ tự khoá chung.</p>
</div>

<h3>Node: deadlock không cần luồng, không cần khoá</h3>
<p>Node chạy JavaScript của bạn trên một luồng, nên không thể có deadlock mutex. Nó vẫn có thể chờ mãi — qua một tài nguyên <strong>đếm</strong>. <code>pool.js</code> là một pool tí hon có cùng hành vi với <code>Pool</code> của node-postgres: tối đa <code>max</code> kết nối, hết thì người xin xếp hàng; <code>connectionTimeoutMillis = 0</code> (mặc định) nghĩa là chờ mãi.</p>
${details('pool.js — pool tối giản cùng ngữ nghĩa với pg.Pool', src('ch06/pool.js', 'javascript'))}
${src('ch06/pool-deadlock.js', 'javascript')}
${run('c64-bank', 'node pool-deadlock.js 1')}
${run('c64-bank', 'node pool-deadlock.js 2;')}
<p>Một đơn một lúc thì chạy. Hai đơn cùng lúc, pool hai kết nối: mỗi đơn giữ một kết nối cho giao dịch, rồi <code>getPrice()</code> xin cùng pool đó kết nối thứ hai — mà không còn cái nào, và sẽ không cái nào quay về. "2 đang dùng, 0 rảnh, 2 đang chờ", mãi mãi. Đó là một vòng cấp phát tài nguyên qua một tài nguyên nhiều bản: đúng trường hợp mà thuật toán Banker suy luận.</p>
${run('c64-bank', 'python3 banker.py pool')}
<p>Hai yêu cầu, mỗi bên giữ một kết nối, là trạng thái <strong>không an toàn</strong>. Luật tính cỡ pool rút ra được: với <em>c</em> yêu cầu đồng thời, mỗi yêu cầu giữ tối đa <em>m</em> kết nối, pool cần nhiều hơn <em>c × (m − 1)</em> kết nối. Tốt hơn: đừng bao giờ giữ hai. Có thời hạn thì một yêu cầu thành nạn nhân, như PostgreSQL; truyền client của giao dịch xuống thì vòng biến mất:</p>
${lab('deadlock', 'pool', 'vi', 'Deadlock pool nhìn thành đồ thị: 2 kết nối, mỗi request giữ một và xin thêm một. Bản nào cũng bị một kẻ đang chờ giữ — một vòng đi qua tài nguyên nhiều bản, và lần này là deadlock thật.', { tour: 'deadlock-detect' })}
${run('c64-bank', 'node pool-deadlock.js 2 timeout')}
${run('c64-bank', 'node pool-deadlock.js 2 pass-client')}

<h3>Một vòng await</h3>
<p>Một bộ nạp có cache mà <code>config</code> cần <code>secrets</code> còn <code>secrets</code> lại cần <code>config</code> làm một promise tự chờ chính nó — cùng khuôn với một container dependency injection có phụ thuộc vòng:</p>
${src('ch06/await-cycle.mjs', 'javascript')}
${run('c64-bank', 'node await-cycle.mjs;')}
<p>Khi là script, Node nhận ra event loop đã trống trong khi một <code>await</code> cấp cao nhất còn treo, in cảnh báo và thoát với mã <strong>13</strong>. Khi là máy chủ, socket đang nghe giữ vòng lặp sống, nên không gì thoát và không gì được ghi log — mọi yêu cầu chỉ treo:</p>
${run('c64-bank', 'node await-cycle.mjs server', 2)}
<p><code>curl</code> bỏ cuộc sau 2 giây (exit 28), còn tiến trình ngồi ở khoảng 2% CPU, trông rất khoẻ. Không bản dump luồng nào cho thấy vòng khoá; bạn tìm ra nó bằng cách nhận thấy yêu cầu không bao giờ xong và lần theo chuỗi <code>await</code>.</p>

<h3>Pool bị đói: không phải deadlock, vẫn là sự cố</h3>
${src('ch06/pool-starve.js', 'javascript')}
${run('c64-bank', 'node pool-starve.js shared')}
${run('c64-bank', 'node pool-starve.js bulkhead')}
<p>Với một pool chung hai kết nối, bốn báo cáo một giây xếp hàng trước và health check 5 ms phải chờ <strong>1,9 giây</strong> — đủ lâu để load balancer coi instance là đã chết. Tách pool (một "vách ngăn" — bulkhead: một kết nối cho báo cáo, một cho API) trả lời health check trong 6 ms, còn báo cáo giờ mất 4 giây thay vì 2. Đói là lựa chọn ai phải chờ; hãy chọn có chủ đích.</p>

<h3>Vì sao hệ thống thật hiếm khi chạy thuật toán Banker</h3>
<ul>
<li>Nó cần biết trước <strong>mức tối đa</strong> của mọi tiến trình — một web request không biết mình sẽ cần bao nhiêu dòng hay bao nhiêu kết nối.</li>
<li>Nó giả định tập tiến trình và tài nguyên cố định; ngoài đời chúng đến rồi đi.</li>
<li>Nó chạy phép kiểm an toàn cho <strong>mọi</strong> yêu cầu (O(m·n²)), và từ chối cả những yêu cầu lẽ ra không sao.</li>
</ul>
<p>Nên thực tế: <strong>phòng ngừa</strong> trong code của bạn (thứ tự khoá, vùng găng ngắn, không bao giờ giữ hai kết nối pool một lúc), <strong>phát hiện</strong> trong CSDL (deadlock_timeout, một nạn nhân, ứng dụng thử lại khi gặp 40P01), và đặt <strong>thời hạn</strong> cho mọi thứ phải chờ. Banker sống tiếp trong đề thi — và trong cách tính cỡ pool ở trên.</p>
${L(OSG62, '🎓', 'OSG202 · 6.2 — Đồ thị tài nguyên &amp; thuật toán Nhà băng', 'Ví dụ Banker làm tay đầy đủ theo môn học.', 'Mở')}
${L(PG11, '🐘', 'PostgreSQL · 11.4 — Khoá dòng, lost update và deadlock', 'FOR UPDATE, NOWAIT, SKIP LOCKED và hàng đợi khoá, đào sâu.', 'Mở')}

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> dịch vụ đơn hàng của bạn ghi "deadlock detected" vài lần mỗi ngày, và tuần trước nó ngừng trả lời hoàn toàn mười phút, số liệu pool hiện "2 in use, 0 idle, N waiting".</p>
<ol>
<li>Làm tay thuật toán an toàn trên trạng thái giáo trình và trên trạng thái sau khi cấp (1,0,2) cho P1; đối chiếu từng bước với <code>python3 banker.py</code>.</li>
<li>Trong một container <code>postgres:17</code> vứt đi, chạy hai phiên <code>transfer.sql</code>, rồi tìm câu lệnh của nạn nhân trong log máy chủ và vòng chờ bằng <code>pg_blocking_pids()</code>.</li>
<li>Chuyển sang <code>transfer-ordered.sql</code> và cho thấy cả hai phiên đều commit.</li>
<li>Chạy <code>node pool-deadlock.js 2</code>, rồi sửa bằng hai cách: một <code>connectionTimeoutMillis</code>, và truyền client xuống. Cách nào mới là sửa thật?</li>
</ol>
<p><strong>Đạt khi:</strong> dãy an toàn bạn làm tay là một thứ tự hợp lệ, bạn có output ERROR 40P01 và vòng pg_blocking_pids từ chính lần chạy của mình, và giải thích được vụ treo pool bằng luật cỡ pool &gt; c × (m − 1).</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['safe state (trạng thái an toàn)', 'Trạng thái có ít nhất một thứ tự mà mọi tiến trình đều lấy được nhu cầu tối đa và chạy xong.'],
  ["Banker's algorithm (thuật toán Nhà băng)", 'Chỉ cấp một yêu cầu nếu sau khi giả vờ cấp, trạng thái vẫn an toàn. Cần biết trước mọi Max.'],
  ['Need (nhu cầu còn lại)', 'Max − Allocation: thứ tiến trình còn có thể xin. Phép kiểm an toàn so Need với Work.'],
  ['detection algorithm (thuật toán phát hiện)', 'Cùng vòng lặp với Request hiện tại thay cho Need; ai không xong được là bị deadlock.'],
  ['deadlock_timeout', 'Thời gian một backend PostgreSQL chờ khoá trước khi chạy phép kiểm deadlock (mặc định 1 giây).'],
  ['40P01', 'SQLSTATE của deadlock_detected. Giao dịch nạn nhân bị quay lui; ứng dụng phải thử lại.'],
  ['pool exhaustion deadlock (deadlock cạn pool)', 'Các yêu cầu mỗi bên giữ vài kết nối pool và chờ thêm, mà phần còn lại nằm trong tay những yêu cầu cũng đang chờ.'],
  ['bulkhead (vách ngăn)', 'Tách pool (hoặc giới hạn) theo loại việc, để loại này không bỏ đói loại kia.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Bốn chiến lược: phớt lờ, phòng ngừa, tránh (Banker), phát hiện và phục hồi (CSDL).</li>
<li>Banker: Need = Max − Allocation; cho xong bất kỳ ai có Need ≤ Work; chỉ cấp nếu trạng thái giả định vẫn an toàn — yêu cầu (0,2,0) của P0 bị từ chối dù vừa đủ.</li>
<li>Phát hiện dùng Request hiện tại; P2 xin thêm một C là P1–P4 bị deadlock.</li>
<li>PostgreSQL chờ deadlock_timeout (1 s), tìm vòng, huỷ một giao dịch với 40P01; khoá dòng theo cùng thứ tự (ORDER BY id FOR UPDATE) là hết.</li>
<li>Node có thể deadlock qua pool (2 đang dùng, 2 đang chờ, mãi mãi) hoặc một vòng await (exit 13 / yêu cầu treo); truyền client xuống, thêm thời hạn, tách pool.</li>
</ul>
${L('https://www.postgresql.org/docs/current/explicit-locking.html', '🐘', 'Tài liệu PostgreSQL — Explicit Locking', 'Khoá dòng, deadlock và cách tránh.', 'Mở')}
${L('https://node-postgres.com/apis/pool', '🟩', 'node-postgres — Pool', 'max, connectionTimeoutMillis và trả client về pool.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 6.5 — Quiz ───────────────────────── */
    {
      title: '6.5 — Chapter 6 check|||6.5 — Kiểm tra Chương 6',
      slug: 'os-6-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống về deadlock: đọc ps/gdb của tiến trình treo, sửa bằng thứ tự khoá, điều kiện Coffman mà mỗi cách sửa phá, livelock, đảo ngược ưu tiên, thuật toán Banker (dãy an toàn, yêu cầu bị từ chối), deadlock PostgreSQL 40P01, deadlock pool kết nối Node và bẫy bộ đệm giới hạn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Check</span>
<h2>Can you find the cycle and break it?</h2>
<p class="lead">Ten scenario questions built on the outputs of this chapter. Most ask "what does this output mean" or "which fix actually works" — the questions you face with a hung process at 2 a.m., and in the OS exam.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can tell a deadlock from a livelock by looking at ps and CPU time, and find the cycle with gdb or jstack.</li>
<li>I can name the four Coffman conditions and say which one lock ordering, try-lock and the waiter break.</li>
<li>I can explain priority inversion with Mars Pathfinder and what priority inheritance changes.</li>
<li>I can run the Banker's safety algorithm and decide a request by hand.</li>
<li>I know what PostgreSQL does on a deadlock, and how a Node connection pool can deadlock without any lock.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Kiểm tra</span>
<h2>Bạn có tìm ra vòng chờ và phá được nó không?</h2>
<p class="lead">Mười câu tình huống dựng trên output của chương này. Phần lớn hỏi "output này nghĩa là gì" hoặc "cách sửa nào thật sự có tác dụng" — đúng những câu bạn gặp với một tiến trình treo lúc 2 giờ sáng, và trong đề thi môn hệ điều hành.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi phân biệt được deadlock với livelock bằng ps và thời gian CPU, và tìm ra vòng chờ bằng gdb hoặc jstack.</li>
<li>Tôi kể được bốn điều kiện Coffman và nói được thứ tự khoá, thử khoá và người phục vụ phá điều kiện nào.</li>
<li>Tôi giải thích được đảo ngược ưu tiên qua Mars Pathfinder và kế thừa ưu tiên thay đổi điều gì.</li>
<li>Tôi chạy tay được thuật toán an toàn của Banker và quyết định được một yêu cầu.</li>
<li>Tôi biết PostgreSQL làm gì khi gặp deadlock, và một pool kết nối Node có thể deadlock mà không cần khoá nào ra sao.</li>
</ul>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          { question: 'A worker process stopped answering. <code>ps -L -o pid,lwp,stat,pcpu,wchan:16</code> shows all its threads in state <code>Sl</code>, <code>0.0</code> %CPU, WCHAN <code>futex_do_wait</code>, for minutes. What is the most likely diagnosis?|||Một tiến trình worker ngừng trả lời. <code>ps -L -o pid,lwp,stat,pcpu,wchan:16</code> cho thấy mọi luồng của nó ở trạng thái <code>Sl</code>, <code>0.0</code> %CPU, WCHAN <code>futex_do_wait</code>, suốt nhiều phút. Chẩn đoán khả dĩ nhất?',
            options: ['A livelock: the threads keep retrying|||Livelock: các luồng liên tục thử lại', 'Threads blocked on locks that will never be released — a deadlock; confirm the cycle with gdb or jstack|||Các luồng bị chặn ở những khoá sẽ không bao giờ được nhả — deadlock; xác nhận vòng chờ bằng gdb hoặc jstack', 'The process is CPU-bound and the scheduler starves it|||Tiến trình nặng CPU và bộ lập lịch bỏ đói nó', 'The process is waiting for disk I/O|||Tiến trình đang chờ I/O đĩa'],
            correctIndex: 1, points: 1,
            explanation: 'EN: futex_do_wait is the kernel side of a contended mutex, S means sleeping, and 0% CPU means nobody is spinning — exactly our dl naive run. A livelock burns CPU (lockstep used 1.9 s of CPU), a CPU-bound process would show R and high %CPU, and disk waits show state D with an I/O wchan. gdb (mutex __owner) or jstack then shows the cycle.|||VI: futex_do_wait là phía nhân của một mutex bị tranh chấp, S là đang ngủ, và 0% CPU nghĩa là không ai đang quay vòng — đúng lần chạy dl naive của ta. Livelock thì đốt CPU (lockstep dùng 1,9 s CPU), tiến trình nặng CPU sẽ hiện R và %CPU cao, còn chờ đĩa hiện trạng thái D với wchan của I/O. Sau đó gdb (__owner của mutex) hoặc jstack cho thấy vòng chờ.' },
          { question: 'gdb on a hung C program shows: LWP 29 in <code>transfer(from=A, to=B)</code> blocked in <code>pthread_mutex_lock(B)</code>; LWP 30 in <code>transfer(from=B, to=A)</code> blocked in <code>pthread_mutex_lock(A)</code>. Which change makes this deadlock impossible?|||gdb trên một chương trình C bị treo cho thấy: LWP 29 ở <code>transfer(from=A, to=B)</code> bị chặn trong <code>pthread_mutex_lock(B)</code>; LWP 30 ở <code>transfer(from=B, to=A)</code> bị chặn trong <code>pthread_mutex_lock(A)</code>. Thay đổi nào làm deadlock này không thể xảy ra?',
            options: ['Lock the two accounts in one global order, e.g. smaller id first, in every transfer|||Khoá hai tài khoản theo một thứ tự chung, ví dụ id nhỏ trước, trong mọi lệnh chuyển', 'Remove the usleep between the two locks|||Bỏ usleep giữa hai lần khoá', 'Make the balances volatile|||Khai báo các số dư là volatile', 'Run the program pinned to one CPU with taskset|||Chạy chương trình ghim vào một CPU bằng taskset'],
            correctIndex: 0, points: 1,
            explanation: 'EN: With one order (A before B for both), the cycle T1 → T2 → T1 cannot form: our dl ordered finished 10,000 transfers in 1.35 s. Removing the sleep only narrows the window — the deadlock becomes rarer, not impossible (the same lesson as races hiding in 5.1). volatile is about visibility, and one CPU still interleaves threads between the two locks.|||VI: Có một thứ tự (cả hai đều A trước B) thì vòng T1 → T2 → T1 không thể hình thành: dl ordered của ta xong 10.000 lệnh chuyển trong 1,35 s. Bỏ lệnh ngủ chỉ thu hẹp khe hở — deadlock hiếm hơn chứ không biến mất (cùng bài học race ẩn mình ở 5.1). volatile là chuyện tầm nhìn, còn một CPU vẫn xen kẽ các luồng giữa hai lần khoá.' },
          { question: 'In the dining philosophers, each philosopher picks up the left fork, then <em>tries</em> the right one; if it is taken, puts the left one back and pauses a random time. Which Coffman condition does this break?|||Trong bài triết gia ăn tối, mỗi người cầm đũa trái, rồi <em>thử</em> đũa phải; nếu đang bị giữ thì đặt đũa trái xuống và nghỉ một khoảng ngẫu nhiên. Cách này phá điều kiện Coffman nào?',
            options: ['Mutual exclusion|||Loại trừ lẫn nhau', 'Circular wait|||Chờ vòng tròn', 'Hold and wait|||Giữ và chờ', 'No preemption|||Không thể giành lại'],
            correctIndex: 2, points: 1,
            explanation: 'EN: A philosopher never waits while holding a fork, so hold-and-wait cannot occur (8,734 meals, no deadlock). Forks are still exclusive, and nobody takes a fork from another — the holder gives it back voluntarily. Circular wait is what the ordered-forks and waiter solutions break; here a momentary cycle can still appear, it just cannot persist because nobody keeps waiting.|||VI: Triết gia không bao giờ vừa cầm đũa vừa chờ, nên giữ-và-chờ không thể xảy ra (8.734 bữa, không deadlock). Đũa vẫn độc quyền, và không ai giành đũa của người khác — người cầm tự nguyện trả lại. Chờ vòng tròn là thứ mà lời giải sắp thứ tự đũa và người phục vụ phá; ở đây một vòng thoáng qua vẫn có thể xuất hiện, nhưng không tồn tại được vì không ai ngồi chờ.' },
          { question: 'Two threads use a polite try-lock protocol with a fixed delay. Under <code>/usr/bin/time</code> you see: <code>0 jobs done, 100000 polite retries</code> for each thread and <code>3.67 s wall, 0.19 s user + 1.75 s kernel CPU</code>. What is happening, and what fixes it?|||Hai luồng dùng giao thức thử khoá lịch sự với khoảng chờ cố định. Dưới <code>/usr/bin/time</code> bạn thấy: <code>0 jobs done, 100000 polite retries</code> cho mỗi luồng và <code>3.67 s wall, 0.19 s user + 1.75 s kernel CPU</code>. Chuyện gì đang xảy ra, và sửa thế nào?',
            options: ['A deadlock; add a timeout to the lock|||Deadlock; thêm thời hạn cho khoá', 'Starvation of thread 1; use a fair lock|||Thread 1 bị đói; dùng khoá công bằng', 'The program is just slow; give it more CPUs|||Chương trình chỉ chậm thôi; cho thêm CPU', 'A livelock: both retry in lockstep; add random backoff (jitter) so one of them steps aside|||Livelock: cả hai thử lại cùng nhịp; thêm lùi ngẫu nhiên (jitter) để một bên chịu nhường'],
            correctIndex: 3, points: 1,
            explanation: 'EN: Busy CPU (1.9 s) but zero progress for both threads is livelock — a deadlock would show 0.00 s of CPU and no retries. It already uses try-lock, so a timeout changes nothing; both threads are equally stuck, so it is not one thread starving. A coin flip after a miss gave 28,530 jobs in our run.|||VI: CPU bận (1,9 s) mà cả hai luồng đều không tiến là livelock — deadlock sẽ hiện 0,00 s CPU và không có lần thử lại nào. Nó vốn đã dùng thử khoá, nên thêm thời hạn không đổi gì; cả hai luồng kẹt như nhau, nên không phải một luồng bị đói. Tung đồng xu sau mỗi lần hụt cho 28.530 việc xong trong lần chạy của ta.' },
          { question: 'On one CPU with SCHED_FIFO: L (prio 10) holds a mutex; H (prio 30) blocks on it; M (prio 20), which never touches the mutex, runs 500 ms. H waits 540 ms. Which change brings H’s wait down to about L’s remaining critical section (40 ms)?|||Trên một CPU với SCHED_FIFO: L (ưu tiên 10) giữ một mutex; H (ưu tiên 30) bị chặn ở mutex đó; M (ưu tiên 20), không bao giờ đụng mutex, chạy 500 ms. H chờ 540 ms. Thay đổi nào đưa thời gian chờ của H xuống khoảng phần vùng găng còn lại của L (40 ms)?',
            options: ['Create the mutex with PTHREAD_PRIO_INHERIT so L runs at H’s priority while H waits|||Tạo mutex với PTHREAD_PRIO_INHERIT để L chạy ở ưu tiên của H trong lúc H chờ', 'Give M a higher priority than H|||Cho M ưu tiên cao hơn H', 'Replace the mutex with a spinlock in H|||Thay mutex bằng spinlock trong H', 'Lower H’s priority to 15|||Hạ ưu tiên của H xuống 15'],
            correctIndex: 0, points: 1,
            explanation: 'EN: This is priority inversion, the Mars Pathfinder bug. With priority inheritance L is boosted to 30, M cannot preempt it, L finishes, and H got the bus after 40.0 ms in our pi inherit run (glibc switches to FUTEX_LOCK_PI). Raising M makes it worse; a spinning H on the only CPU would prevent L from ever running; lowering H just makes H unimportant.|||VI: Đây là đảo ngược ưu tiên, đúng lỗi của Mars Pathfinder. Với kế thừa ưu tiên, L được nâng lên 30, M không giành được CPU, L làm xong, và H có bus sau 40,0 ms trong lần chạy pi inherit của ta (glibc chuyển sang FUTEX_LOCK_PI). Nâng M chỉ tệ hơn; H quay vòng trên CPU duy nhất sẽ khiến L không bao giờ chạy được; hạ H chỉ làm H thành việc không quan trọng.' },
          { question: 'Banker’s state (A B C): Available = (2,3,0). P0: Allocation (0,1,0), Need (7,4,3). P1: Allocation (3,0,2), Need (0,2,0). P2: (3,0,2) / (6,0,0). P3: (2,1,1) / (0,1,1). P4: (0,0,2) / (4,3,1). P0 requests (0,2,0). What does the Banker do?|||Trạng thái Banker (A B C): Available = (2,3,0). P0: Allocation (0,1,0), Need (7,4,3). P1: Allocation (3,0,2), Need (0,2,0). P2: (3,0,2) / (6,0,0). P3: (2,1,1) / (0,1,1). P4: (0,0,2) / (4,3,1). P0 xin (0,2,0). Banker làm gì?',
            options: ['Grants it, because (0,2,0) ≤ Available|||Cấp, vì (0,2,0) ≤ Available', 'Denies it: after granting, Work = (2,1,0) satisfies no process’s Need, so the state would be unsafe|||Từ chối: sau khi cấp, Work = (2,1,0) không đáp ứng Need của tiến trình nào, nên trạng thái sẽ không an toàn', 'Rejects it as an error because it exceeds P0’s Need|||Báo lỗi vì vượt quá Need của P0', 'Grants it and immediately detects a deadlock|||Cấp rồi lập tức phát hiện deadlock'],
            correctIndex: 1, points: 1,
            explanation: 'EN: Fitting in Available is only check 2. Pretending to grant leaves Available (2,1,0); P1 needs (0,2,0) (B 2 > 1), P3 needs (0,1,1) (C 1 > 0), and the others need far more — nobody can finish, so the state is unsafe and P0 waits; banker.py printed exactly this. (0,2,0) ≤ (7,4,3), so it is not an error, and unsafe does not mean a deadlock already exists.|||VI: Vừa trong Available mới chỉ là phép kiểm thứ 2. Giả vờ cấp thì còn Available (2,1,0); P1 cần (0,2,0) (B 2 > 1), P3 cần (0,1,1) (C 1 > 0), các tiến trình khác cần nhiều hơn hẳn — không ai xong được, nên trạng thái không an toàn và P0 phải chờ; banker.py in đúng như vậy. (0,2,0) ≤ (7,4,3) nên không phải lỗi, và không an toàn không có nghĩa là đã có deadlock.' },
          { question: 'Available = (3,3,2). Need: P0 (7,4,3), P1 (1,2,2), P2 (6,0,0), P3 (0,1,1), P4 (4,3,1). Allocation: P0 (0,1,0), P1 (2,0,0), P2 (3,0,2), P3 (2,1,1), P4 (0,0,2). Which of these is a safe sequence?|||Available = (3,3,2). Need: P0 (7,4,3), P1 (1,2,2), P2 (6,0,0), P3 (0,1,1), P4 (4,3,1). Allocation: P0 (0,1,0), P1 (2,0,0), P2 (3,0,2), P3 (2,1,1), P4 (0,0,2). Dãy nào sau đây là dãy an toàn?',
            options: ['&lt;P0, P1, P3, P4, P2&gt;', '&lt;P4, P1, P3, P0, P2&gt;', '&lt;P1, P3, P4, P0, P2&gt;', '&lt;P2, P1, P3, P4, P0&gt;'],
            correctIndex: 2, points: 1,
            explanation: 'EN: Work (3,3,2) → P1 needs (1,2,2) ✓, Work (5,3,2) → P3 (0,1,1) ✓, Work (7,4,3) → P4 (4,3,1) ✓, Work (7,4,5) → P0 (7,4,3) ✓, Work (7,5,5) → P2 (6,0,0) ✓ — the order banker.py printed. The others fail at the first step: P0 needs 7 A, P4 needs 4 A and P2 needs 6 A, but only 3 A are free.|||VI: Work (3,3,2) → P1 cần (1,2,2) ✓, Work (5,3,2) → P3 (0,1,1) ✓, Work (7,4,3) → P4 (4,3,1) ✓, Work (7,4,5) → P0 (7,4,3) ✓, Work (7,5,5) → P2 (6,0,0) ✓ — đúng thứ tự banker.py in ra. Các phương án khác hỏng ngay bước đầu: P0 cần 7 A, P4 cần 4 A và P2 cần 6 A, mà chỉ có 3 A rảnh.' },
          { question: 'Two PostgreSQL sessions transfer money in opposite directions. One of them gets <code>ERROR: 40P01: deadlock detected</code> after about 1,000 ms; the other commits. What should the application do?|||Hai phiên PostgreSQL chuyển tiền theo hai chiều ngược nhau. Một phiên nhận <code>ERROR: 40P01: deadlock detected</code> sau khoảng 1.000 ms; phiên kia commit. Ứng dụng nên làm gì?',
            options: ['Ignore it — the deadlock was resolved, so the transfer happened|||Bỏ qua — deadlock đã được gỡ, nên lệnh chuyển đã xong', 'Increase deadlock_timeout so the error happens less often|||Tăng deadlock_timeout cho lỗi đỡ xảy ra', 'Re-run only the statement that failed|||Chỉ chạy lại câu lệnh bị lỗi', 'Retry the whole transaction, and fix the cause by locking rows in one order (e.g. SELECT … ORDER BY id FOR UPDATE)|||Thử lại cả giao dịch, và sửa tận gốc bằng cách khoá các dòng theo một thứ tự (ví dụ SELECT … ORDER BY id FOR UPDATE)'],
            correctIndex: 3, points: 1,
            explanation: 'EN: The victim’s whole transaction was rolled back (our T1 printed ROLLBACK; only T2’s transfer happened), so its work is lost unless retried — and the statement alone cannot be re-run because the transaction is aborted. deadlock_timeout (1 s) is how long a backend waits before checking; raising it makes every deadlock last longer. transfer-ordered.sql removed the deadlock entirely.|||VI: Cả giao dịch của nạn nhân đã bị quay lui (T1 của ta in ROLLBACK; chỉ lệnh chuyển của T2 xảy ra), nên công việc của nó mất trừ khi thử lại — và không chạy lại riêng câu lệnh được vì giao dịch đã bị huỷ. deadlock_timeout (1 s) là thời gian backend chờ trước khi kiểm; tăng nó làm mỗi deadlock kéo dài hơn. transfer-ordered.sql loại bỏ hẳn deadlock.' },
          { question: 'A Node service with a pg pool of <code>max: 2</code> hangs whenever two requests arrive together; the pool reports <code>2 in use, 0 idle, 2 waiting</code> forever. Each handler opens a transaction with <code>pool.connect()</code> and then calls a helper that uses <code>pool.query()</code>. Best fix?|||Một dịch vụ Node với pool pg <code>max: 2</code> bị treo mỗi khi hai yêu cầu đến cùng lúc; pool báo <code>2 in use, 0 idle, 2 waiting</code> mãi mãi. Mỗi handler mở giao dịch bằng <code>pool.connect()</code> rồi gọi một hàm phụ dùng <code>pool.query()</code>. Cách sửa tốt nhất?',
            options: ['Pass the transaction’s client to the helper so a request never holds two connections|||Truyền client của giao dịch cho hàm phụ để một yêu cầu không bao giờ giữ hai kết nối', 'Node is single-threaded, so this cannot be a deadlock; add more CPU|||Node đơn luồng nên đây không thể là deadlock; thêm CPU', 'Wrap the handler in a mutex|||Bọc handler trong một mutex', 'Set connectionTimeoutMillis and treat the errors as normal load shedding|||Đặt connectionTimeoutMillis và coi các lỗi đó là giảm tải bình thường'],
            correctIndex: 0, points: 1,
            explanation: 'EN: Each request holds one of two connections and waits for a second: a resource cycle through a counting resource, which the Banker’s view calls unsafe. pass-client committed both orders in 85 ms. A timeout only turns the hang into a failed request (order 1 FAILED after 1 s) — useful as a safety net, not a fix. A mutex around the handler serialises all requests; more CPU changes nothing.|||VI: Mỗi yêu cầu giữ một trong hai kết nối và chờ cái thứ hai: một vòng tài nguyên qua tài nguyên đếm, mà góc nhìn Banker gọi là không an toàn. pass-client commit cả hai đơn trong 85 ms. Thời hạn chỉ biến vụ treo thành một yêu cầu lỗi (order 1 FAILED sau 1 s) — hữu ích làm lưới an toàn, không phải cách sửa. Mutex bọc handler bắt mọi yêu cầu xếp hàng; thêm CPU chẳng đổi gì.' },
          { question: 'A bounded buffer uses <code>empty = N</code>, <code>full = 0</code>, <code>mutex = 1</code>. A student writes the producer as <code>wait(mutex); wait(empty); put(item); signal(mutex); signal(full);</code>. What happens?|||Một bộ đệm giới hạn dùng <code>empty = N</code>, <code>full = 0</code>, <code>mutex = 1</code>. Một sinh viên viết producer là <code>wait(mutex); wait(empty); put(item); signal(mutex); signal(full);</code>. Chuyện gì xảy ra?',
            options: ['Nothing — the order of the two waits does not matter|||Không sao — thứ tự hai lệnh chờ không quan trọng', 'When the buffer is full the producer sleeps on empty while holding mutex, and the consumer blocks on mutex before it can free a slot: deadlock|||Khi bộ đệm đầy, producer ngủ chờ empty trong lúc giữ mutex, còn consumer bị chặn ở mutex trước khi kịp giải phóng một chỗ: deadlock', 'Items are overwritten because mutex is released too early|||Phần tử bị ghi đè vì mutex được nhả quá sớm', 'Only performance suffers, because the mutex is held longer|||Chỉ chậm hơn, vì mutex bị giữ lâu hơn'],
            correctIndex: 1, points: 1,
            explanation: 'EN: Our bb wrong deadlocked after 4 items with empty=0 full=3 mutex=0: the producer holds mutex and waits for empty; the consumer already took a full ticket and waits for mutex. Rule: wait on the counting semaphore first, the mutex last. Nothing is overwritten — the program simply stops — and it is far worse than a slowdown.|||VI: bb wrong của ta deadlock sau 4 phần tử với empty=0 full=3 mutex=0: producer giữ mutex và chờ empty; consumer đã lấy một vé full và chờ mutex. Luật: chờ semaphore đếm trước, mutex sau cùng. Không có gì bị ghi đè — chương trình chỉ đứng im — và nó tệ hơn nhiều so với chậm.' },
        ],
      },
    },
  ],
};
