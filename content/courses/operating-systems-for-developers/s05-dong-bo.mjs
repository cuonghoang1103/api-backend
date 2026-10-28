/**
 * Operating Systems for Developers — Chương 5: Đồng bộ — race và khoá (soạn 28/10/2026 theo _HOP-DONG.md).
 * Output CHẠY THẬT trong ảnh `os-lab` (lab/code/ch05 → lab/out/c51-race, c52-mutex, c53-sem, c54-node) và trong hai container
 * vứt đi `postgres:17` (os-pg5 → lab/out/c54-db) và `redis:7` (os-redis5 → lab/out/c54-redis) — cùng bộ chạy `phien`.
 * Máy đo: Docker Desktop trên Apple Silicon (arm64, 10 lõi, nhân 7.0 linuxkit), gcc 15, Java 21, Node 22, PostgreSQL 17, Redis 7.
 * LUẬT escaping: < > → &lt; &gt;; & → &amp;; backtick trần → &#96;; không gạch chéo ngược trong thân bài.
 */
import { run, src, card, kv } from './_ui.mjs';
import { lab } from './_lab.mjs';
import G51 from './giang/os-05-1.mjs';
import G52 from './giang/os-05-2.mjs';
import G53 from './giang/os-05-3.mjs';
import G54 from './giang/os-05-4.mjs';

const L = (href, ico, t, s, cta) => card(href, ico, t, s, cta);
const OSG = '/courses/operating-systems/learn?lessonSlug=osg202-2-5-ipc-dong-bo';
const PG11 = '/courses/postgresql/learn?lessonSlug=postgresql-11-4-khoa-deadlock';
const DBI8 = '/courses/introduction-to-databases/learn?lessonSlug=dbi202-slide-dbi8-1';

export default {
  title: 'Chapter 5 — Synchronization: races and locks|||Chương 5 — Đồng bộ: race và khoá',
  description: 'Hai luồng đụng cùng một dữ liệu: race condition tái hiện được bằng C/Java/Node; mutex, spinlock, futex và biến điều kiện đo thật; semaphore, khoá đọc-ghi, nguyên tử/CAS và tầm nhìn bộ nhớ (volatile); rồi chính các lỗi đó trong backend — đặt ghế trùng, trừ tiền hai lần, SELECT … FOR UPDATE, khoá Redis và idempotency key.',
  lessons: [
    /* ───────────────────────── 5.1 — Race condition ───────────────────────── */
    {
      title: '5.1 — Race conditions you can reproduce: counter++ in C, Java and Node|||5.1 — Race condition tái hiện được: counter++ trong C, Java và Node',
      slug: 'os-5-1-race',
      type: 'LESSON',
      isFreePreview: true,
      description: 'counter++ không nguyên tử: 4 luồng × 1 triệu lần tăng ra ~1,2 triệu; đọc ba lệnh máy nạp–cộng–ghi; vì sao lỗi trốn khi chạy một lõi hoặc bật -O2; cùng lỗi đó trong Java và Node worker_threads + SharedArrayBuffer.',
      content: `${G51}
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Two threads, one variable, a wrong answer</h2>
<p class="lead">Four threads each add 1 to a shared counter one million times. The answer should be 4,000,000. On a real machine it comes out around 1,200,000 — and a different number every run. Nothing crashed, no error was printed, the code "looks right". This lesson makes that bug happen on demand, shows you the exact machine instructions where the increments disappear, and explains why the same bug can hide on your laptop and explode in production.</p>

<h3>Reproduce it in C</h3>
<p>Threads (Chapter 3) share one address space, so a global variable is literally the same bytes for every thread. Here is the smallest program that breaks:</p>
${src('ch05/race.c', 'c')}
${run('c51-race', 'nproc', 3)}
${run('c51-race', './race 2')}
${run('c51-race', 'for i in 1 2 3 4 5')}
<p>One thread: exact. Two threads: almost half the increments vanish. Four threads: about 70% vanish, and no two runs agree. That last part matters as much as the wrong total — the bug is <strong>nondeterministic</strong>, so a test that runs once proves nothing.</p>

<h3>Why: counter++ is three instructions, not one</h3>
<p>In C, Java or JavaScript, <code>counter++</code> looks like one step. The CPU does three: <strong>load</strong> the value from memory into a register, <strong>add</strong> 1 to the register, <strong>store</strong> the register back. Here is the compiled loop body (arm64, <code>-O0</code>):</p>
${run('c51-race', 'objdump -d --no-show-raw-insn race ')}
<p><code>ldr x0, [x0]</code> loads <code>counter</code>, <code>add x1, x0, #0x1</code> adds one, <code>str x1, [x0]</code> stores it (the <code>adrp/add</code> pairs just compute the address). Now interleave two threads:</p>
<table>
<tr><th>step</th><th>Thread 1</th><th>Thread 2</th><th>counter in memory</th></tr>
<tr><td>1</td><td>load → r = 5</td><td></td><td>5</td></tr>
<tr><td>2</td><td></td><td>load → r = 5</td><td>5</td></tr>
<tr><td>3</td><td>add → r = 6; store</td><td></td><td>6</td></tr>
<tr><td>4</td><td></td><td>add → r = 6; store</td><td><strong>6, not 7</strong></td></tr>
</table>
<p>Both threads did an increment; memory went up by one. That is a <strong>lost update</strong>, and it is the whole chapter in four rows. With ten cores running truly in parallel, the windows overlap constantly — hence 70% lost. Step through it yourself, choose who runs next, then press <em>Run it 1,000 times</em> to see the spread of final values:</p>
${lab('race', 'none', 'en', 'counter++ split into load / add / store for two threads. Step manually or randomly, then run 1,000 random interleavings and look at the histogram of final values.')}
<p>Three words you will use for the rest of the course:</p>
<ul>
<li><strong>Race condition</strong> — the result depends on the timing of threads (who ran first).</li>
<li><strong>Data race</strong> — two threads access the same memory at the same time, at least one writes, and nothing orders them. In C/C++ this is undefined behaviour; in Java it is allowed but gives surprising results.</li>
<li><strong>Critical section</strong> — the piece of code that touches the shared data (here: load–add–store). The fix in every later lesson is: make the critical section behave as if only one thread can be inside it at a time.</li>
</ul>

<h3>Why it hid on your laptop</h3>
<p>Pin the same program to <strong>one</strong> core:</p>
${run('c51-race', 'taskset -c 0')}
<p>Perfect — and it was perfect in every one-core run we made while preparing this lesson. On one core the threads take turns; a thread is only interrupted when its time slice ends (milliseconds), and the chance that this happens exactly between its <code>ldr</code> and its <code>str</code> is tiny. Tiny is not zero: run long enough on one core and you will still lose updates. Now turn on optimisation:</p>
${run('c51-race', 'for i in 1 2 3; do ./race-O2')}
${run('c51-race', 'objdump -d --no-show-raw-insn race-O2')}
<p>Correct again — because <code>gcc -O2</code> noticed nothing else could change <code>counter</code> inside the loop (it is allowed to assume no data race) and replaced a million increments with <em>one</em> <code>ldr</code>, <code>add x0, x0, x1</code> (add the whole loop count), <code>str</code>. The race is still there — two threads can both load before either stores — the window is just a few nanoseconds wide. Change the loop body slightly (call a function, log something) and the compiler can no longer do this, and the bug is back.</p>

<div class="pitfall co-tieu-de">
<p><strong>"It passed on my machine" proves nothing for concurrent code.</strong> A single-core CI runner, a debug build vs a release build, an extra <code>console.log</code> that changes timing — each can make a race vanish or appear. The counter here was right on one core and at <code>-O2</code>, and wrong by 70% on ten cores at <code>-O0</code>. The only real fixes are the ones in the next lessons (lock, atomic, or do not share); "run the test again" is not one of them.</p>
</div>

<h3>The same bug in Java and in Node</h3>
${src('ch05/Race.java', 'java')}
${run('c51-race', 'java Race.java', 2)}
<p>Java compiles <code>count++</code> to <code>getfield / iadd / putfield</code> — the same three steps — and the JIT then turns those into the same load/add/store you saw above. About 35% lost.</p>
<p>Node runs your JavaScript on one thread, so ordinary objects are never touched by two threads at once. But <code>worker_threads</code> are real OS threads, and a <code>SharedArrayBuffer</code> is memory they genuinely share:</p>
${src('ch05/race-sab.js', 'javascript')}
${run('c51-race', 'node race-sab.js plain', 2)}
<p>Same story: <code>a[0]++</code> on shared memory is load–add–store, and up to half the increments vanish. (Lesson 5.3 runs the <code>atomics</code> mode.) Node also has a second kind of race that needs no threads at all — a check-then-act split by an <code>await</code> — and that one is the bug you will actually meet in a backend. Lesson 5.4 is about it.</p>

<h3>If you have done OSG202 lesson 2.5</h3>
<p>There you met race conditions, critical sections and the critical-section requirements (mutual exclusion, progress, bounded waiting) on paper. Here you have the same thing running: a measured 70% loss, the three instructions it happens in, and the reasons it hides. Keep the OSG202 vocabulary — the exam asks for it — and use these numbers when someone says "a race is just theory".</p>
${L(OSG, '🎓', 'OSG202 · 2.5 — IPC &amp; synchronization', 'Races, critical sections, mutex and semaphore as in the course textbook.', 'Open')}

<h3>🧪 Practice (20 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> the "views" counter of your blog post shows noticeably fewer views than nginx logged requests. The handler does <code>post.views++</code> from a pool of worker threads. Before touching the code, you want proof that this pattern loses updates — and to know why nobody saw it in testing.</p>
<ol>
<li>In the lab, build <code>race.c</code> with <code>-O0</code> and run it with 1, 2, 4 and 8 threads (1,000,000 iterations). Write the lost percentage for each in a small table.</li>
<li>Run the 4-thread case five times. Are any two results equal?</li>
<li>Run it under <code>taskset -c 0</code>, then rebuild with <code>-O2</code>. Explain in one sentence each why the loss disappears.</li>
<li>Run <code>java Race.java</code> and <code>node race-sab.js plain</code>. Which instruction sequence is losing the updates in each?</li>
</ol>
<p><strong>Done when:</strong> your table shows the loss growing with thread count, and you can explain — with the load/add/store table — why one core or <code>-O2</code> hid the bug without fixing it.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['race condition', 'A bug where the result depends on the timing/order of threads.'],
  ['data race', 'Unsynchronised concurrent access to the same memory, at least one a write. Undefined behaviour in C/C++.'],
  ['critical section (vùng găng)', 'Code that touches shared data and must not be run by two threads at once.'],
  ['lost update', 'Two read-modify-write sequences overlap and one write overwrites the other.'],
  ['atomic (nguyên tử)', 'Indivisible: other threads see it either not started or finished, never half-done.'],
  ['nondeterminism', 'Same input, different output each run — why one passing test proves nothing.'],
  ['SharedArrayBuffer', 'Memory that Node/browser worker threads really share (ordinary JS objects are copied).'],
])}

<h3>📌 Summary</h3>
<ul>
<li><code>counter++</code> is three machine instructions — load, add, store — and two threads interleaving them lose updates.</li>
<li>Measured on 10 cores: 4 threads × 1,000,000 increments gave about 1.2 million, a different number every run.</li>
<li>One core or <code>-O2</code> shrank the window so the result looked right; the race was still there.</li>
<li>Java <code>count++</code> and Node <code>worker_threads</code> on a <code>SharedArrayBuffer</code> lose updates the same way.</li>
<li>The cure is to make the critical section exclusive — locks (5.2), atomics (5.3) — or to stop sharing.</li>
</ul>
${L('https://pages.cs.wisc.edu/~remzi/OSTEP/threads-intro.pdf', '📘', 'OSTEP — Concurrency: An Introduction', 'The free textbook chapter on exactly this counter and its race.', 'Open')}
${L('https://man7.org/linux/man-pages/man7/pthreads.7.html', '📄', 'man 7 pthreads', 'POSIX threads on Linux: what is shared between threads and what is not.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Hai luồng, một biến, một đáp án sai</h2>
<p class="lead">Bốn luồng, mỗi luồng cộng 1 vào một biến đếm chung một triệu lần. Đáp án phải là 4.000.000. Trên máy thật nó ra khoảng 1.200.000 — và mỗi lần chạy một số khác. Không có gì sập, không có lỗi nào in ra, code "nhìn thì đúng". Bài này làm cho lỗi đó xảy ra theo ý muốn, chỉ cho bạn đúng những lệnh máy nơi các lần tăng biến mất, và giải thích vì sao cùng một lỗi có thể trốn trên laptop của bạn rồi nổ tung trên production.</p>

<h3>Tái hiện bằng C</h3>
<p>Các luồng (Chương 3) dùng chung một không gian địa chỉ, nên một biến toàn cục đúng nghĩa là cùng những byte đó với mọi luồng. Đây là chương trình nhỏ nhất làm nó hỏng:</p>
${src('ch05/race.c', 'c')}
${run('c51-race', 'nproc', 3)}
${run('c51-race', './race 2')}
${run('c51-race', 'for i in 1 2 3 4 5')}
<p>Một luồng: chính xác. Hai luồng: gần một nửa số lần tăng biến mất. Bốn luồng: khoảng 70% biến mất, và không có hai lần chạy nào giống nhau. Điểm cuối quan trọng không kém con số sai — lỗi này <strong>không tất định (nondeterministic)</strong>, nên một bài test chạy một lần không chứng minh được gì.</p>

<h3>Vì sao: counter++ là ba lệnh, không phải một</h3>
<p>Trong C, Java hay JavaScript, <code>counter++</code> trông như một bước. CPU làm ba bước: <strong>nạp (load)</strong> giá trị từ bộ nhớ vào thanh ghi, <strong>cộng (add)</strong> 1 vào thanh ghi, <strong>ghi (store)</strong> thanh ghi trở lại bộ nhớ. Đây là thân vòng lặp đã biên dịch (arm64, <code>-O0</code>):</p>
${run('c51-race', 'objdump -d --no-show-raw-insn race ')}
<p><code>ldr x0, [x0]</code> nạp <code>counter</code>, <code>add x1, x0, #0x1</code> cộng một, <code>str x1, [x0]</code> ghi lại (các cặp <code>adrp/add</code> chỉ để tính địa chỉ). Giờ cho hai luồng chạy xen kẽ:</p>
<table>
<tr><th>bước</th><th>Luồng 1</th><th>Luồng 2</th><th>counter trong bộ nhớ</th></tr>
<tr><td>1</td><td>nạp → r = 5</td><td></td><td>5</td></tr>
<tr><td>2</td><td></td><td>nạp → r = 5</td><td>5</td></tr>
<tr><td>3</td><td>cộng → r = 6; ghi</td><td></td><td>6</td></tr>
<tr><td>4</td><td></td><td>cộng → r = 6; ghi</td><td><strong>6, không phải 7</strong></td></tr>
</table>
<p>Cả hai luồng đều đã tăng; bộ nhớ chỉ lên một. Đó là một <strong>lần cập nhật bị mất (lost update)</strong>, và cả chương này nằm trong bốn dòng đó. Với mười lõi chạy song song thật, các khe hở chồng lên nhau liên tục — nên mất 70%. Tự bước qua từng lệnh, chọn ai chạy tiếp, rồi bấm <em>Chạy 1.000 lần</em> để xem các giá trị cuối phân tán ra sao:</p>
${lab('race', 'none', 'vi', 'counter++ tách thành nạp / cộng / ghi cho hai luồng. Bước tay hoặc ngẫu nhiên, rồi chạy 1.000 lần xen kẽ ngẫu nhiên và xem biểu đồ tần suất các giá trị cuối.')}
<p>Ba từ bạn sẽ dùng suốt phần còn lại của khoá:</p>
<ul>
<li><strong>Race condition (điều kiện tương tranh)</strong> — kết quả phụ thuộc vào thời điểm chạy của các luồng (ai chạy trước).</li>
<li><strong>Data race (tranh chấp dữ liệu)</strong> — hai luồng truy cập cùng một ô nhớ cùng lúc, ít nhất một bên ghi, và không có gì sắp thứ tự chúng. Trong C/C++ đây là hành vi không xác định (undefined behaviour); trong Java thì được phép nhưng cho kết quả bất ngờ.</li>
<li><strong>Critical section (vùng găng)</strong> — đoạn code đụng vào dữ liệu chung (ở đây: nạp–cộng–ghi). Cách sửa trong mọi bài sau là: làm cho vùng găng hành xử như thể chỉ một luồng được ở trong đó tại một thời điểm.</li>
</ul>

<h3>Vì sao nó trốn trên laptop của bạn</h3>
<p>Ghim cùng chương trình đó vào <strong>một</strong> lõi:</p>
${run('c51-race', 'taskset -c 0')}
<p>Hoàn hảo — và nó hoàn hảo trong mọi lần chạy một lõi chúng tôi làm khi soạn bài này. Trên một lõi các luồng thay phiên nhau; một luồng chỉ bị ngắt khi hết lát thời gian (vài mili giây), và xác suất việc đó rơi đúng giữa <code>ldr</code> và <code>str</code> của nó là rất nhỏ. Rất nhỏ không phải bằng không: chạy đủ lâu trên một lõi bạn vẫn sẽ mất cập nhật. Giờ bật tối ưu:</p>
${run('c51-race', 'for i in 1 2 3; do ./race-O2')}
${run('c51-race', 'objdump -d --no-show-raw-insn race-O2')}
<p>Lại đúng — vì <code>gcc -O2</code> nhận ra trong vòng lặp không gì khác đổi được <code>counter</code> (nó được phép giả định không có data race) và thay một triệu lần tăng bằng <em>một</em> <code>ldr</code>, <code>add x0, x0, x1</code> (cộng cả số vòng một lần), <code>str</code>. Race vẫn còn — hai luồng vẫn có thể cùng nạp trước khi bên nào ghi — chỉ là khe hở hẹp còn vài nano giây. Đổi thân vòng lặp một chút (gọi một hàm, ghi log) là trình biên dịch không làm thế được nữa, và lỗi quay lại.</p>

<div class="pitfall co-tieu-de">
<p><strong>"Máy tôi chạy qua" không chứng minh được gì với code đồng thời.</strong> Một máy CI chỉ có một lõi, bản debug so với bản release, thêm một <code>console.log</code> làm đổi thời điểm — mỗi thứ đều có thể làm race biến mất hoặc hiện ra. Biến đếm ở đây đúng khi chạy một lõi và khi bật <code>-O2</code>, sai 70% trên mười lõi với <code>-O0</code>. Cách sửa thật chỉ là những cách ở các bài sau (khoá, nguyên tử, hoặc đừng dùng chung); "chạy lại test" không phải là một trong số đó.</p>
</div>

<h3>Cùng lỗi đó trong Java và trong Node</h3>
${src('ch05/Race.java', 'java')}
${run('c51-race', 'java Race.java', 2)}
<p>Java biên dịch <code>count++</code> thành <code>getfield / iadd / putfield</code> — đúng ba bước đó — rồi JIT biến chúng thành chính bộ nạp/cộng/ghi bạn thấy ở trên. Mất khoảng 35%.</p>
<p>Node chạy JavaScript của bạn trên một luồng, nên object thường không bao giờ bị hai luồng đụng cùng lúc. Nhưng <code>worker_threads</code> là luồng hệ điều hành thật, và <code>SharedArrayBuffer</code> là bộ nhớ chúng dùng chung thật sự:</p>
${src('ch05/race-sab.js', 'javascript')}
${run('c51-race', 'node race-sab.js plain', 2)}
<p>Cùng câu chuyện: <code>a[0]++</code> trên bộ nhớ chung là nạp–cộng–ghi, và có lúc tới một nửa số lần tăng biến mất. (Bài 5.3 chạy chế độ <code>atomics</code>.) Node còn một kiểu race thứ hai không cần luồng nào — kiểm-rồi-làm bị một <code>await</code> chẻ đôi — và đó mới là lỗi bạn thật sự gặp trong backend. Bài 5.4 nói về nó.</p>

<h3>Nếu bạn đã học OSG202 bài 2.5</h3>
<p>Ở đó bạn gặp race condition, vùng găng và các yêu cầu của vùng găng (loại trừ lẫn nhau, tiến triển, chờ có giới hạn) trên giấy. Ở đây bạn có đúng thứ đó đang chạy: mất 70% đo được, ba lệnh nơi nó xảy ra, và những lý do khiến nó trốn. Giữ nguyên từ vựng của OSG202 — đề thi hỏi đúng những từ đó — và dùng các con số này khi ai đó bảo "race chỉ là lý thuyết".</p>
${L(OSG, '🎓', 'OSG202 · 2.5 — IPC &amp; đồng bộ', 'Tương tranh, miền găng, mutex và semaphore theo giáo trình môn học.', 'Mở')}

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> bộ đếm "lượt xem" của một bài blog hiện ít hơn hẳn số yêu cầu nginx ghi lại. Handler làm <code>post.views++</code> từ một pool các luồng. Trước khi sửa code, bạn muốn có bằng chứng kiểu code này làm mất cập nhật — và biết vì sao lúc test không ai thấy.</p>
<ol>
<li>Trong lab, biên dịch <code>race.c</code> với <code>-O0</code> và chạy với 1, 2, 4 và 8 luồng (1.000.000 vòng). Ghi phần trăm bị mất của mỗi lần vào một bảng nhỏ.</li>
<li>Chạy trường hợp 4 luồng năm lần. Có hai kết quả nào bằng nhau không?</li>
<li>Chạy dưới <code>taskset -c 0</code>, rồi biên dịch lại với <code>-O2</code>. Giải thích mỗi trường hợp trong một câu vì sao phần mất biến mất.</li>
<li>Chạy <code>java Race.java</code> và <code>node race-sab.js plain</code>. Ở mỗi cái, dãy lệnh nào đang làm mất cập nhật?</li>
</ol>
<p><strong>Đạt khi:</strong> bảng của bạn cho thấy phần mất tăng theo số luồng, và bạn giải thích được — bằng bảng nạp/cộng/ghi — vì sao một lõi hay <code>-O2</code> giấu lỗi mà không sửa lỗi.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['race condition (điều kiện tương tranh)', 'Lỗi mà kết quả phụ thuộc vào thời điểm/thứ tự chạy của các luồng.'],
  ['data race (tranh chấp dữ liệu)', 'Truy cập đồng thời không đồng bộ vào cùng ô nhớ, ít nhất một bên ghi. Là hành vi không xác định trong C/C++.'],
  ['critical section (vùng găng)', 'Đoạn code đụng vào dữ liệu chung và không được để hai luồng chạy cùng lúc.'],
  ['lost update (mất cập nhật)', 'Hai chuỗi đọc-sửa-ghi chồng nhau và lần ghi này đè mất lần ghi kia.'],
  ['atomic (nguyên tử)', 'Không chia cắt được: luồng khác chỉ thấy nó chưa bắt đầu hoặc đã xong, không bao giờ thấy nửa chừng.'],
  ['nondeterminism (không tất định)', 'Cùng đầu vào, mỗi lần chạy ra kết quả khác — vì thế một lần test qua không chứng minh gì.'],
  ['SharedArrayBuffer', 'Vùng nhớ mà các worker thread của Node/trình duyệt dùng chung thật (object JS thường thì bị sao chép).'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>counter++</code> là ba lệnh máy — nạp, cộng, ghi — và hai luồng chạy xen kẽ chúng sẽ làm mất cập nhật.</li>
<li>Đo trên 10 lõi: 4 luồng × 1.000.000 lần tăng ra khoảng 1,2 triệu, mỗi lần chạy một số khác.</li>
<li>Một lõi hoặc <code>-O2</code> thu hẹp khe hở nên kết quả trông đúng; race vẫn còn đó.</li>
<li><code>count++</code> của Java và <code>worker_threads</code> của Node trên <code>SharedArrayBuffer</code> mất cập nhật y như vậy.</li>
<li>Thuốc chữa là làm vùng găng độc quyền — khoá (5.2), nguyên tử (5.3) — hoặc thôi dùng chung.</li>
</ul>
${L('https://pages.cs.wisc.edu/~remzi/OSTEP/threads-intro.pdf', '📘', 'OSTEP — Concurrency: An Introduction', 'Chương sách miễn phí nói đúng về biến đếm này và race của nó.', 'Mở')}
${L('https://man7.org/linux/man-pages/man7/pthreads.7.html', '📄', 'man 7 pthreads', 'Luồng POSIX trên Linux: cái gì dùng chung giữa các luồng, cái gì không.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 5.2 — Mutex, spinlock, condition variable ───────────────────────── */
    {
      title: '5.2 — Mutexes, spinlocks and condition variables, measured|||5.2 — Mutex, spinlock và biến điều kiện, đo thật',
      slug: 'os-5-2-mutex',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Sửa race bằng mutex, spinlock, nguyên tử và "đừng dùng chung", đo giá từng cách; futex — khoá chỉ vào nhân khi có tranh chấp; spinlock đốt 66 giây CPU khi luồng nhiều hơn lõi; synchronized/ReentrantLock; producer–consumer với biến điều kiện và vì sao phải chờ bằng while.',
      content: `${G52}
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>Making one thread wait for another — and what it costs</h2>
<p class="lead">Lesson 5.1 lost 70% of the increments. The textbook fix is a lock around the critical section. But which lock, and at what price? Here the same job — ten million increments — is protected five different ways and timed. You will see that an uncontended lock never enters the kernel, that a spinlock can burn a whole minute of CPU doing nothing, and that the fastest "lock" is the one you avoid by not sharing.</p>

<h3>Five ways to protect counter++</h3>
<p>One program, five modes: <code>none</code> (the race), <code>mutex</code> (<code>pthread_mutex_lock</code>), <code>spin</code> (<code>pthread_spin_lock</code>, busy-waits), <code>atomic</code> (one indivisible add — lesson 5.3), and <code>local</code> (each thread counts in its own variable and adds to the total once, under a lock):</p>
${src('ch05/lockcost.c', 'c')}
<p>First with <strong>one</strong> thread — nobody to fight with, so this is the bare price of each mechanism:</p>
${run('c52-mutex', 'for m in none mutex spin atomic local; do ./lockcost $m 1 ')}
<p>Then <strong>four</strong> threads on the same ten million increments:</p>
${run('c52-mutex', 'for m in none mutex spin atomic local; do ./lockcost $m 4 ')}
<p>Read it like an engineer:</p>
<ul>
<li><strong>none</strong> is fast and <strong>WRONG</strong> — a correct-looking speed for an incorrect answer.</li>
<li>Uncontended, a mutex costs about 11 ns per lock/unlock pair — roughly 25× a plain increment, but still tiny for real work.</li>
<li>Contended (4 threads), the mutex costs ~65 ns per increment and the whole job is <em>slower</em> than one thread doing it alone. The lock is not the expensive part; the <em>sharing</em> is: the cache line holding <code>counter</code> and the lock bounces between cores on every operation.</li>
<li><strong>local</strong> is correct and as fast as the broken version, because threads no longer share anything until the very end. That is the most important result on this page.</li>
</ul>

<h3>futex: a lock that only calls the kernel when it must</h3>
<p>Does <code>pthread_mutex_lock</code> make a system call (Chapter 1: ~100× a function call)? Count them:</p>
${run('c52-mutex', 'strace -f -c -e trace=futex ./lockcost mutex 1 ')}
${run('c52-mutex', 'strace -f -c -e trace=futex ./lockcost mutex 4 ')}
<p>One million lock/unlock pairs with one thread: <strong>one</strong> <code>futex</code> call in total (that one is <code>pthread_join</code> waiting for the thread to finish). Ten million pairs with four threads fighting: a few thousand calls — well under 0.1% of the operations. A Linux mutex is a <strong>futex</strong> ("fast userspace mutex"): locking is a single atomic compare-and-swap in user space; only when the lock is <em>already taken</em> does the thread call <code>futex(FUTEX_WAIT)</code> and sleep in the kernel, and the unlocker calls <code>futex(FUTEX_WAKE)</code> only if someone is sleeping. Java's <code>synchronized</code>/<code>ReentrantLock</code> and Go's <code>sync.Mutex</code> sit on the same mechanism on Linux.</p>

<h3>Spinlock vs mutex: what happens when threads outnumber cores</h3>
<p>A spinlock never sleeps: a waiting thread loops "is it free yet?" on its core. Four threads on ten cores looked survivable above (2.4× slower than the mutex). Now 32 threads on 10 cores — like a web server with a too-big thread pool:</p>
${run('c52-mutex', '/usr/bin/time -f "%e s wall, %U s user + %S s kernel CPU" ./lockcost mutex 32')}
${run('c52-mutex', '/usr/bin/time -f "%e s wall, %U s user + %S s kernel CPU" ./lockcost spin 32')}
<p>Same correct answer. The mutex took half a second; the spinlock took <strong>7.45 seconds and burned 66.7 seconds of CPU</strong> — nine cores spinning flat out. With more threads than cores, the thread holding the lock is regularly <em>descheduled</em> (Chapter 3), and everyone waiting for it spins through their whole time slice achieving nothing. The mutex threads instead went to sleep in the kernel (that is the 3.45 s of kernel CPU: futex sleeps and wake-ups) and let the holder run.</p>
<div class="pitfall co-tieu-de">
<p><strong>"Spinlocks are faster because they never make a syscall."</strong> Only when the critical section is a few instructions long <em>and</em> every waiting thread has its own core. That is true inside the kernel (which disables preemption while holding a spinlock) and almost never true in an application, where the scheduler can preempt the lock holder at any moment. In user space use a mutex: glibc's and the JVM's already spin briefly before sleeping, so you get the cheap case for free without the 66-second disaster.</p>
</div>

<h3>Java: synchronized and ReentrantLock</h3>
${src('ch05/Locks.java', 'java')}
${run('c52-mutex', 'java Locks.java')}
<p>Both locks give exactly 8,000,000; no lock gives a wrong number. On this JVM and this micro-benchmark <code>ReentrantLock</code> was about 5× faster than <code>synchronized</code>; on other JVM versions and other contention patterns the gap shrinks or flips, so do not choose a lock from a blog benchmark. Choose <code>synchronized</code> for simple cases, and <code>ReentrantLock</code> when you need what it adds: <code>tryLock()</code> with a timeout, interruptible waiting, an optional fair queue, and several condition variables per lock. Either way, release in <code>finally</code> — an exception inside the critical section must not leave the lock held forever.</p>
<p>See the fix instruction by instruction — the second thread now waits at the lock instead of slipping between load and store — and press <em>Run it 1,000 times</em>: every run ends at the same value:</p>
${lab('race', 'mutex', 'en', 'The same two threads, now with lock(m) / unlock(m) around load-add-store. Only the holder may enter; run 1,000 random interleavings and the histogram collapses to one bar.')}

<h3>Condition variables: waiting for a state, not for a lock</h3>
<p>A mutex answers "may I enter?". Often a thread needs "wait until there is something to do" — a consumer waiting for a job, a producer waiting for space. Spinning on a flag wastes a core; sleeping a fixed time adds latency. The tool is a <strong>condition variable</strong>: <code>pthread_cond_wait(&amp;cv, &amp;mu)</code> atomically <em>releases the mutex and sleeps</em>; when woken it re-acquires the mutex before returning. Here is the classic <strong>producer–consumer</strong> (bounded buffer): two producers, four consumers, a 4-slot ring buffer:</p>
${src('ch05/pc.c', 'c')}
${run('c52-mutex', './pc while')}
${run('c52-mutex', './pc if', 2)}
<p>With <code>while</code> every item is consumed exactly once and no consumer ever finds the buffer empty after waking. With <code>if</code>, consumers woke up to an <strong>empty</strong> buffer tens of thousands of times. The reason: one <code>broadcast</code> wakes all sleeping consumers; the first one to re-acquire the mutex takes the item; the others return from <code>wait</code> with the buffer empty again. POSIX also allows <em>spurious wakeups</em> (waking with no signal at all). Our program counts those cases instead of crashing; real code written with <code>if</code> would read an empty slot, drive <code>count</code> negative and hand garbage to the next request.</p>
<div class="callout warn"><p><strong>Rule:</strong> always wait in a loop that re-checks the condition: <code>while (!condition) wait(cv, mu);</code>. Java's <code>Object.wait()</code> and <code>Condition.await()</code> have the same rule in their documentation. This is the exact pattern inside every job queue you use: Java's <code>ArrayBlockingQueue</code>, the task queue of Tomcat's thread pool, the work queue of Node's libuv thread pool.</p></div>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> after a teammate "optimised" the order service by replacing its mutex with a spinlock, CPU on the box sits at 100% and throughput <em>dropped</em>. The service runs 64 worker threads on an 8-vCPU VM. You need numbers for the review.</p>
<ol>
<li>Build <code>lockcost.c</code> with <code>-O2 -pthread</code>. Run <code>mutex</code> and <code>spin</code> with 4 threads, then with 32 threads (250,000 iterations), each under <code>/usr/bin/time -f "%e s wall, %U s user + %S s kernel CPU"</code>.</li>
<li>Count futex calls for the mutex with 1 and with 4 threads using <code>strace -f -c -e trace=futex</code>. What fraction of lock operations entered the kernel?</li>
<li>Run the <code>local</code> mode with 4 threads. What does that tell you about the real fix for a hot counter?</li>
<li>Run <code>./pc while</code> and <code>./pc if</code>. Change <code>pthread_cond_broadcast</code> to <code>pthread_cond_signal</code> in the producer and run <code>./pc if</code> again — does the problem disappear completely? Why is relying on that still wrong?</li>
</ol>
<p><strong>Done when:</strong> you can show — with wall time and CPU time — why the spinlock lost with 32 threads, state how many futex calls a contended mutex really made, and explain why condition waits must use <code>while</code>.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['mutex (mutual exclusion lock)', 'Lock that lets one thread into a critical section; others sleep until it is released.'],
  ['spinlock', 'Lock whose waiters busy-loop on a core instead of sleeping. Good only for tiny sections with a core per waiter.'],
  ['futex', 'Linux "fast userspace mutex": lock/unlock are atomic instructions in user space; the kernel is called only to sleep or wake under contention.'],
  ['contention (tranh chấp)', 'Several threads want the same lock or cache line at once; this, not the lock itself, is what is expensive.'],
  ['condition variable (biến điều kiện)', 'Lets a thread release a mutex and sleep until another thread signals that a condition may have changed.'],
  ['spurious wakeup', 'Waking from a condition wait without the condition being true — why waits go in a while loop.'],
  ['producer–consumer / bounded buffer', 'Producers add items to a fixed-size queue, consumers remove them; each side waits when full/empty.'],
  ['synchronized / ReentrantLock', 'Java’s built-in monitor lock, and the library lock adding tryLock, timeouts, fairness and multiple conditions.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>A lock makes the critical section exclusive; measured, an uncontended pthread mutex costs ~11 ns per lock/unlock.</li>
<li>The expensive part is contention: with 4 threads the locked counter was slower than one thread — and giving each thread its own counter was both correct and nearly free.</li>
<li>Linux mutexes are futexes: 10 million contended lock operations made only a few thousand system calls.</li>
<li>Spinlocks collapse when threads outnumber cores: 7.45 s and 66.7 s of CPU vs 0.5 s for a mutex. In applications, use a mutex.</li>
<li>Condition variables let threads sleep until there is work; always re-check the condition in a <code>while</code> loop.</li>
</ul>
${L('https://man7.org/linux/man-pages/man7/futex.7.html', '📄', 'man 7 futex', 'How fast user-space locking works and when it calls the kernel.', 'Open')}
${L('https://pages.cs.wisc.edu/~remzi/OSTEP/threads-cv.pdf', '📘', 'OSTEP — Condition Variables', 'Producer–consumer step by step, including why while and not if.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Bắt một luồng chờ luồng kia — và cái giá của nó</h2>
<p class="lead">Bài 5.1 mất 70% số lần tăng. Cách sửa trong giáo trình là đặt một khoá quanh vùng găng. Nhưng khoá nào, và giá bao nhiêu? Ở đây cùng một việc — mười triệu lần tăng — được bảo vệ theo năm cách khác nhau và bấm giờ. Bạn sẽ thấy một khoá không bị tranh chấp thì không bao giờ vào nhân, một spinlock có thể đốt cả phút CPU để không làm gì, và "khoá" nhanh nhất là khoá bạn tránh được nhờ không dùng chung.</p>

<h3>Năm cách bảo vệ counter++</h3>
<p>Một chương trình, năm chế độ: <code>none</code> (race), <code>mutex</code> (<code>pthread_mutex_lock</code>), <code>spin</code> (<code>pthread_spin_lock</code>, chờ bận), <code>atomic</code> (một phép cộng không chia cắt — bài 5.3), và <code>local</code> (mỗi luồng đếm vào biến riêng rồi cộng vào tổng đúng một lần, có khoá):</p>
${src('ch05/lockcost.c', 'c')}
<p>Trước hết với <strong>một</strong> luồng — không có ai để tranh, nên đây là giá trần của từng cơ chế:</p>
${run('c52-mutex', 'for m in none mutex spin atomic local; do ./lockcost $m 1 ')}
<p>Rồi <strong>bốn</strong> luồng trên cùng mười triệu lần tăng:</p>
${run('c52-mutex', 'for m in none mutex spin atomic local; do ./lockcost $m 4 ')}
<p>Đọc như một kỹ sư:</p>
<ul>
<li><strong>none</strong> nhanh và <strong>SAI</strong> — một tốc độ trông đẹp cho một đáp án sai.</li>
<li>Không tranh chấp, mutex tốn khoảng 11 ns cho một cặp lock/unlock — cỡ 25 lần một phép tăng trần, nhưng vẫn rất nhỏ so với việc thật.</li>
<li>Có tranh chấp (4 luồng), mutex tốn ~65 ns mỗi lần tăng và cả việc còn <em>chậm hơn</em> một luồng làm một mình. Cái đắt không phải là khoá; cái đắt là <em>dùng chung</em>: dòng cache chứa <code>counter</code> và khoá bị chuyền qua lại giữa các lõi ở mỗi thao tác.</li>
<li><strong>local</strong> đúng và nhanh ngang bản hỏng, vì các luồng không dùng chung gì cho tới tận lúc cuối. Đó là kết quả quan trọng nhất trang này.</li>
</ul>

<h3>futex: khoá chỉ gọi nhân khi bắt buộc</h3>
<p><code>pthread_mutex_lock</code> có làm lời gọi hệ thống không (Chương 1: ~100 lần một lời gọi hàm)? Đếm thử:</p>
${run('c52-mutex', 'strace -f -c -e trace=futex ./lockcost mutex 1 ')}
${run('c52-mutex', 'strace -f -c -e trace=futex ./lockcost mutex 4 ')}
<p>Một triệu cặp lock/unlock với một luồng: tổng cộng <strong>một</strong> lời gọi <code>futex</code> (cái đó là <code>pthread_join</code> chờ luồng xong). Mười triệu cặp với bốn luồng tranh nhau: vài nghìn lời gọi — dưới 0,1% số thao tác. Mutex của Linux là một <strong>futex</strong> ("fast userspace mutex" — mutex nhanh ở không gian người dùng): khoá là một lệnh compare-and-swap nguyên tử ở user space; chỉ khi khoá <em>đã có người giữ</em> luồng mới gọi <code>futex(FUTEX_WAIT)</code> và ngủ trong nhân, và người mở khoá chỉ gọi <code>futex(FUTEX_WAKE)</code> nếu có ai đang ngủ. <code>synchronized</code>/<code>ReentrantLock</code> của Java và <code>sync.Mutex</code> của Go đều dựa trên đúng cơ chế đó trên Linux.</p>

<h3>Spinlock vs mutex: chuyện gì xảy ra khi luồng nhiều hơn lõi</h3>
<p>Spinlock không bao giờ ngủ: luồng đang chờ cứ quay vòng hỏi "trống chưa?" trên lõi của nó. Bốn luồng trên mười lõi ở trên trông còn chịu được (chậm hơn mutex 2,4 lần). Giờ 32 luồng trên 10 lõi — như một máy chủ web có pool luồng quá to:</p>
${run('c52-mutex', '/usr/bin/time -f "%e s wall, %U s user + %S s kernel CPU" ./lockcost mutex 32')}
${run('c52-mutex', '/usr/bin/time -f "%e s wall, %U s user + %S s kernel CPU" ./lockcost spin 32')}
<p>Cùng một đáp án đúng. Mutex mất nửa giây; spinlock mất <strong>7,45 giây và đốt 66,7 giây CPU</strong> — chín lõi quay hết công suất. Khi luồng nhiều hơn lõi, luồng đang giữ khoá thường xuyên bị <em>đẩy khỏi CPU</em> (Chương 3), và mọi luồng chờ nó quay hết lát thời gian của mình mà không được gì. Các luồng mutex thì đi ngủ trong nhân (đó là 3,45 giây CPU nhân: những lần ngủ và đánh thức futex) và nhường cho người giữ khoá chạy.</p>
<div class="pitfall co-tieu-de">
<p><strong>"Spinlock nhanh hơn vì không bao giờ gọi syscall."</strong> Chỉ khi vùng găng dài vài lệnh <em>và</em> mỗi luồng chờ có lõi riêng. Điều đó đúng bên trong nhân (nhân tắt chiếm quyền — preemption — trong lúc giữ spinlock) và gần như không bao giờ đúng trong một ứng dụng, nơi bộ lập lịch có thể đẩy người giữ khoá ra bất cứ lúc nào. Ở user space hãy dùng mutex: mutex của glibc và của JVM vốn đã quay một chút trước khi ngủ, nên bạn có trường hợp rẻ miễn phí mà không gặp thảm hoạ 66 giây.</p>
</div>

<h3>Java: synchronized và ReentrantLock</h3>
${src('ch05/Locks.java', 'java')}
${run('c52-mutex', 'java Locks.java')}
<p>Cả hai khoá cho đúng 8.000.000; không khoá thì ra số sai. Trên JVM này và bài đo nhỏ này <code>ReentrantLock</code> nhanh hơn <code>synchronized</code> khoảng 5 lần; ở phiên bản JVM khác và kiểu tranh chấp khác khoảng cách thu hẹp hoặc đảo chiều, nên đừng chọn khoá theo một bài đo trên blog. Dùng <code>synchronized</code> cho trường hợp đơn giản, và <code>ReentrantLock</code> khi bạn cần thứ nó thêm vào: <code>tryLock()</code> có thời hạn, chờ có thể bị ngắt, hàng đợi công bằng tuỳ chọn, và nhiều biến điều kiện trên một khoá. Cách nào cũng vậy, nhả khoá trong <code>finally</code> — một ngoại lệ trong vùng găng không được để khoá bị giữ mãi mãi.</p>
<p>Xem cách sửa từng lệnh máy — luồng thứ hai giờ chờ ở khoá thay vì lọt vào giữa nạp và ghi — rồi bấm <em>Chạy 1.000 lần</em>: lần nào cũng kết thúc cùng một giá trị:</p>
${lab('race', 'mutex', 'vi', 'Vẫn hai luồng đó, giờ có lock(m) / unlock(m) bao quanh nạp-cộng-ghi. Chỉ người giữ khoá được vào; chạy 1.000 lần xen kẽ ngẫu nhiên và biểu đồ co lại còn một cột.')}

<h3>Biến điều kiện: chờ một trạng thái, không phải chờ một khoá</h3>
<p>Mutex trả lời câu "tôi được vào không?". Nhiều khi một luồng cần "chờ tới khi có việc" — consumer chờ một job, producer chờ có chỗ trống. Quay vòng trên một cờ thì phí một lõi; ngủ một khoảng cố định thì thêm độ trễ. Công cụ đúng là <strong>biến điều kiện (condition variable)</strong>: <code>pthread_cond_wait(&amp;cv, &amp;mu)</code> <em>nhả mutex và đi ngủ</em> trong một bước nguyên tử; khi được đánh thức nó lấy lại mutex rồi mới trả về. Đây là bài <strong>producer–consumer</strong> (bộ đệm giới hạn) kinh điển: hai producer, bốn consumer, một bộ đệm vòng 4 ô:</p>
${src('ch05/pc.c', 'c')}
${run('c52-mutex', './pc while')}
${run('c52-mutex', './pc if', 2)}
<p>Với <code>while</code>, mọi phần tử được lấy đúng một lần và không consumer nào tỉnh dậy mà thấy bộ đệm rỗng. Với <code>if</code>, các consumer tỉnh dậy trước một bộ đệm <strong>rỗng</strong> hàng chục nghìn lần. Lý do: một lần <code>broadcast</code> đánh thức mọi consumer đang ngủ; người đầu tiên lấy lại được mutex lấy mất phần tử; những người còn lại trả về từ <code>wait</code> với bộ đệm lại rỗng. POSIX còn cho phép <em>đánh thức giả (spurious wakeup)</em> (tỉnh dậy mà chẳng có tín hiệu nào). Chương trình của ta đếm những trường hợp đó thay vì sập; code thật viết bằng <code>if</code> sẽ đọc một ô rỗng, đẩy <code>count</code> xuống âm và trao rác cho yêu cầu kế tiếp.</p>
<div class="callout warn"><p><strong>Luật:</strong> luôn chờ trong một vòng lặp kiểm lại điều kiện: <code>while (!điều_kiện) wait(cv, mu);</code>. Tài liệu của <code>Object.wait()</code> và <code>Condition.await()</code> trong Java ghi đúng luật đó. Đây chính là khuôn bên trong mọi hàng đợi việc bạn dùng: <code>ArrayBlockingQueue</code> của Java, hàng đợi tác vụ của thread pool Tomcat, hàng đợi việc của thread pool libuv trong Node.</p></div>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> sau khi một bạn trong nhóm "tối ưu" dịch vụ đơn hàng bằng cách thay mutex bằng spinlock, CPU của máy nằm lì 100% và thông lượng lại <em>giảm</em>. Dịch vụ chạy 64 luồng worker trên một VM 8 vCPU. Bạn cần số liệu cho buổi review.</p>
<ol>
<li>Biên dịch <code>lockcost.c</code> với <code>-O2 -pthread</code>. Chạy <code>mutex</code> và <code>spin</code> với 4 luồng, rồi 32 luồng (250.000 vòng), mỗi lần dưới <code>/usr/bin/time -f "%e s wall, %U s user + %S s kernel CPU"</code>.</li>
<li>Đếm lời gọi futex của mutex với 1 và 4 luồng bằng <code>strace -f -c -e trace=futex</code>. Bao nhiêu phần trăm thao tác khoá phải vào nhân?</li>
<li>Chạy chế độ <code>local</code> với 4 luồng. Điều đó nói gì về cách sửa thật cho một biến đếm nóng?</li>
<li>Chạy <code>./pc while</code> và <code>./pc if</code>. Đổi <code>pthread_cond_broadcast</code> thành <code>pthread_cond_signal</code> ở producer rồi chạy lại <code>./pc if</code> — vấn đề có biến mất hẳn không? Vì sao dựa vào đó vẫn là sai?</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chỉ ra được — bằng thời gian thực và thời gian CPU — vì sao spinlock thua với 32 luồng, nói được một mutex bị tranh chấp thật sự gọi futex bao nhiêu lần, và giải thích vì sao chờ điều kiện phải dùng <code>while</code>.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['mutex (khoá loại trừ lẫn nhau)', 'Khoá cho một luồng vào vùng găng; luồng khác ngủ tới khi khoá được nhả.'],
  ['spinlock (khoá quay)', 'Khoá mà người chờ quay vòng trên lõi thay vì ngủ. Chỉ tốt cho vùng găng tí hon khi mỗi người chờ có một lõi.'],
  ['futex', '"Fast userspace mutex" của Linux: khoá/mở là lệnh nguyên tử ở user space; chỉ gọi nhân để ngủ hoặc đánh thức khi có tranh chấp.'],
  ['contention (tranh chấp)', 'Nhiều luồng cùng muốn một khoá hoặc một dòng cache; chính nó — không phải bản thân khoá — mới đắt.'],
  ['condition variable (biến điều kiện)', 'Cho một luồng nhả mutex và ngủ tới khi luồng khác báo rằng điều kiện có thể đã đổi.'],
  ['spurious wakeup (đánh thức giả)', 'Tỉnh dậy khỏi lần chờ điều kiện mà điều kiện chưa đúng — vì thế phải chờ trong vòng while.'],
  ['producer–consumer / bounded buffer', 'Producer thêm phần tử vào hàng đợi cỡ cố định, consumer lấy ra; mỗi bên chờ khi đầy/rỗng.'],
  ['synchronized / ReentrantLock', 'Khoá monitor dựng sẵn của Java, và khoá thư viện thêm tryLock, thời hạn, công bằng và nhiều điều kiện.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Khoá làm vùng găng độc quyền; đo thật, một pthread mutex không tranh chấp tốn ~11 ns mỗi cặp lock/unlock.</li>
<li>Phần đắt là tranh chấp: với 4 luồng, biến đếm có khoá còn chậm hơn một luồng — còn cho mỗi luồng một biến đếm riêng thì vừa đúng vừa gần như miễn phí.</li>
<li>Mutex của Linux là futex: 10 triệu thao tác khoá có tranh chấp chỉ làm vài nghìn lời gọi hệ thống.</li>
<li>Spinlock sụp khi luồng nhiều hơn lõi: 7,45 giây và 66,7 giây CPU so với 0,5 giây của mutex. Trong ứng dụng, dùng mutex.</li>
<li>Biến điều kiện cho luồng ngủ tới khi có việc; luôn kiểm lại điều kiện trong vòng <code>while</code>.</li>
</ul>
${L('https://man7.org/linux/man-pages/man7/futex.7.html', '📄', 'man 7 futex', 'Khoá nhanh ở user space hoạt động thế nào và khi nào nó gọi nhân.', 'Mở')}
${L('https://pages.cs.wisc.edu/~remzi/OSTEP/threads-cv.pdf', '📘', 'OSTEP — Condition Variables', 'Producer–consumer từng bước, kể cả vì sao dùng while chứ không phải if.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 5.3 — Semaphore, RW lock, atomics/CAS, visibility ───────────────────────── */
    {
      title: '5.3 — Semaphores, read-write locks, atomics/CAS and memory visibility|||5.3 — Semaphore, khoá đọc-ghi, nguyên tử/CAS và tầm nhìn bộ nhớ',
      slug: 'os-5-3-semaphore',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Semaphore giới hạn số người vào (như pool kết nối CSDL); khoá đọc-ghi cho bài readers–writers; compare-and-swap và số lần thử lại; AtomicLong vs LongAdder; Atomics của Node; và tầm nhìn bộ nhớ — vòng lặp không bao giờ thấy cờ, volatile của Java, phép thử store-buffering trên ARM.',
      content: `${G53}
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>More tools than a mutex — and a bug no lock count shows</h2>
<p class="lead">A mutex lets exactly one thread in. Real systems also need "at most three at a time", "many readers or one writer", and "no lock at all, just an indivisible update". This lesson measures each of those. Then it shows a stranger bug: a thread that loops forever waiting for a flag another thread already set — no lost update anywhere, the write simply never becomes <em>visible</em>.</p>

<h3>Semaphore: at most N inside</h3>
<p>A <strong>semaphore</strong> is a counter with two atomic operations: <code>wait</code> (Dijkstra's P) takes one unit and sleeps if there are none; <code>post</code> (V) returns one and wakes a sleeper. Initialise it to 3 and at most three threads can be past <code>wait</code> at once. Ten requests, each holding a "database connection" for 100 ms:</p>
${src('ch05/sem.c', 'c')}
${run('c53-sem', './sem 0')}
${run('c53-sem', './sem 3')}
<p>Without the semaphore all ten ran together (peak 10, 101 ms). With it, never more than three at once, and the ten requests went through in four waves — ⌈10 / 3⌉ = 4 × 100 ms ≈ 404 ms. This is exactly what your <strong>database connection pool</strong> is: Prisma's <code>connection_limit</code>, HikariCP's <code>maximumPoolSize</code>, <code>pg.Pool({ max })</code>. Request number 4 does not fail; it waits — which is why a pool that is too small shows up as latency, not as errors. A semaphore initialised to 1 behaves like a mutex, with one difference: it has no owner, so any thread may <code>post</code> — useful for signalling, dangerous as a lock.</p>

<h3>Read-write lock: the readers–writers problem</h3>
<p>Many shared structures are read far more than written — a config table, a cache, a routing table. A mutex makes readers queue behind each other for no reason. A <strong>read-write lock</strong> lets any number of readers in together, or exactly one writer alone:</p>
${src('ch05/rw.c', 'c')}
${run('c53-sem', './rw mutex')}
${run('c53-sem', './rw rwlock')}
<p>With 99% reads, the read-write lock roughly doubled throughput (638 → 1,348 operations per ms) on the same 8 threads. Two caveats, both from the classic <em>readers–writers problem</em>: if readers keep arriving, a writer can wait forever (<strong>writer starvation</strong>) — glibc's default prefers readers, and <code>pthread_rwlockattr_setkind_np</code> can change that; and when the critical section is only a few instructions long, the read-write lock's own bookkeeping can make it slower than a plain mutex. Measure before switching. Java has <code>ReentrantReadWriteLock</code>; PostgreSQL's <code>FOR SHARE</code> vs <code>FOR UPDATE</code> row locks (lesson 5.4) are the same idea.</p>

<h3>Atomics and compare-and-swap: no lock at all</h3>
<p>For a single word of memory the CPU offers indivisible read-modify-write instructions. The most general is <strong>compare-and-swap (CAS)</strong>: "if this location still holds <em>old</em>, write <em>new</em>; tell me whether you did". Every lock-free algorithm is built from it. Here is <code>counter++</code> rebuilt with CAS, counting how often a thread lost the race and had to retry:</p>
${src('ch05/cas.c', 'c')}
${run('c53-sem', './cas 1 ')}
${run('c53-sem', './cas 4 ')}
<p>Always correct — and with four threads, more than one retry per increment on average: lock-free does not mean wait-free or free of contention. For plain counting the CPU has a dedicated instruction (<code>lock xadd</code> on x86, <code>ldadd</code> on ARM), which is what the <code>atomic</code> mode in lesson 5.2 used: ~8 ns alone, ~51 ns under contention. Java gives you both styles:</p>
${src('ch05/Atomics.java', 'java')}
${run('c53-sem', 'java Atomics.java')}
<p><code>AtomicLong</code> is one shared word, so eight threads still fight over one cache line. <code>LongAdder</code> gives each thread its own cell and only adds them up when you call <code>sum()</code> — the <code>local</code> idea from lesson 5.2 packaged as a class — and it was more than 15× faster here. Use it for metrics and hit counters. And Node, with the <code>atomics</code> mode of the program from lesson 5.1:</p>
${run('c53-sem', 'node race-sab.js atomics')}
<p>Zero lost (the broken <code>plain</code> mode lost up to half), at roughly three times the time of the broken version. Correctness has a price; it is still far cheaper than a wrong balance.</p>
${lab('race', 'atomic', 'en', 'counter++ as ONE indivisible atomic instruction: the other thread can never slip between load and store. Run 1,000 interleavings — one bar at the right value, and no lock was taken.')}

<h3>Memory visibility: the write that never arrives</h3>
<p>A different bug. One thread spins until a flag becomes 1; the main thread sets it after 100 ms. Nothing is incremented, so nothing can be lost:</p>
${src('ch05/flag.c', 'c')}
${run('c53-sem', 'timeout 3 ./flag plain')}
${run('c53-sem', './flag atomic')}
<p>With a plain <code>int</code> the waiter never saw the flag; <code>timeout</code> killed it after 3 s (exit 124). The compiler read <code>ready</code> once, kept it in a register and looped on the register forever — legal, because a plain variable changed by another thread without synchronisation is a data race, and the compiler may assume there is none. With <code>atomic_load</code> every iteration really reads memory. Java does the same thing at run time, in the JIT:</p>
${src('ch05/Stop.java', 'java')}
${run('c53-sem', 'timeout 5 java Stop.java plain')}
${run('c53-sem', 'java Stop.java volatile')}
<p>Without <code>volatile</code> the worker never stopped. Once the JIT has compiled the hot loop it may hoist the read of <code>stop</code> out of it; the Java Memory Model only promises that a write is visible to another thread if there is a <em>happens-before</em> edge between them — and <code>volatile</code>, <code>synchronized</code>, locks and atomics are what create such edges. (While preparing this lesson, a version that set the flag after only 100 ms finished normally on one run: whether the bug shows depends on whether the JIT got there first. Another reason a passing run proves nothing.)</p>

<h3>The CPU reorders too: store buffering</h3>
<p>Even when the compiler keeps your order, the CPU need not. Each core writes into a private <em>store buffer</em> before the write reaches the cache other cores see, so a core can read a variable <em>before</em> its own earlier write to a different variable is visible. The famous test: thread A does <code>x = 1; r1 = y;</code>, thread B does <code>y = 1; r2 = x;</code>. In program order at least one of them must see a 1 — so <code>r1 = r2 = 0</code> looks impossible:</p>
${src('ch05/sb.c', 'c')}
${run('c53-sem', './sb relaxed', 2)}
${run('c53-sem', 'objdump -d --no-show-raw-insn sb')}
<p>With relaxed atomics, the "impossible" result happened in almost every one of the million runs on this ARM machine, and the disassembly shows it was not the compiler: the relaxed version is a plain <code>str</code> followed by <code>ldr</code>, in your order. The CPU let the load overtake the store. With sequentially-consistent atomics (the default in C11 and the semantics of Java <code>volatile</code>), the compiler emits <code>stlr</code>/<code>ldar</code>, which forbid that reordering — zero occurrences. x86 allows this particular reordering too. You will almost never write relaxed atomics in application code; the point is that locks and default atomics already contain these barriers, and a home-made flag does not.</p>

<div class="pitfall co-tieu-de">
<p><strong>"Make it <code>volatile</code> and it is thread-safe."</strong> Two different languages, two different meanings. In <strong>Java</strong>, <code>volatile</code> guarantees visibility and ordering for that one field — it fixes <code>Stop.java</code>, but <code>count++</code> on a volatile int is still load–add–store and still loses updates. In <strong>C/C++</strong>, <code>volatile</code> only stops the compiler from caching the variable in a register; it gives no atomicity and no ordering between cores. Lesson 5.2's <code>none</code> mode used a <code>volatile long</code> counter and still lost 70% of its increments. For threads in C use <code>_Atomic</code>/<code>stdatomic.h</code> or a lock; in Java use <code>volatile</code> only for flags and published references, atomics or locks for anything read-modify-write.</p>
</div>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> on shutdown your Spring Boot service hangs until Kubernetes kills it (exit 137 — Chapter 1). A background worker loops on <code>while (running) { … }</code> and the shutdown hook sets <code>running = false</code>. Separately, the team wants to know why requests queue up when the DB pool is set to 3.</p>
<ol>
<li>Run <code>java Stop.java plain</code> under <code>timeout 5</code> and then <code>java Stop.java volatile</code>. Note the exit codes.</li>
<li>Build <code>flag.c</code> with <code>-O2</code>; run <code>plain</code> under <code>timeout 3</code> and <code>atomic</code>. Then build with <code>-O0</code> and run <code>plain</code> again — what changes, and why is <code>-O0</code> not a fix?</li>
<li>Run <code>./sem 0</code>, <code>./sem 3</code> and <code>./sem 5</code>. Predict the total time of each from ⌈10/N⌉ × 100 ms before running.</li>
<li>Run <code>java Atomics.java</code>. Which class would you use for a per-endpoint request counter that is written on every request and read once a minute?</li>
</ol>
<p><strong>Done when:</strong> you can explain the hang as a visibility problem and name the one-word fix, predict the semaphore timings within ~10%, and justify <code>LongAdder</code> vs <code>AtomicLong</code> with your own numbers.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['semaphore (P/V, wait/post)', 'A counter of permits; wait takes one or sleeps, post returns one. Initialised to N = at most N inside.'],
  ['read-write lock (khoá đọc-ghi)', 'Many readers together, or one writer alone. Solves readers–writers; watch for writer starvation.'],
  ['compare-and-swap (CAS)', 'Atomically: if the location holds old, write new, and report success. The building block of lock-free code.'],
  ['lock-free', 'No thread ever blocks holding a lock; threads may still retry under contention.'],
  ['LongAdder', 'Java counter that spreads increments over per-thread cells and sums on read — fast for write-heavy counters.'],
  ['memory visibility (tầm nhìn bộ nhớ)', 'Whether and when a write by one thread can be seen by another.'],
  ['happens-before', 'The Java/C++ memory-model rule: a write is guaranteed visible to a later read only if a synchronising edge orders them.'],
  ['memory barrier / ordering', 'An instruction or atomic mode that stops the CPU and compiler reordering memory operations across it.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>A semaphore limits concurrency: initialised to 3, ten 100 ms requests ran three at a time in ≈ 404 ms — the same behaviour as a DB connection pool.</li>
<li>A read-write lock doubled throughput for a 99%-read table; mind writer starvation and short critical sections.</li>
<li>CAS gives correct lock-free updates but retries under contention; <code>LongAdder</code> beat <code>AtomicLong</code> by more than 15× by not sharing one word.</li>
<li>Visibility is a separate bug from lost updates: a plain flag loop hung forever in C at <code>-O2</code> and in Java's JIT; atomics/<code>volatile</code> fixed it.</li>
<li>CPUs reorder a store and a later load: the "impossible" (0, 0) appeared in almost every run with relaxed atomics and never with sequentially consistent ones.</li>
</ul>
${L('https://man7.org/linux/man-pages/man7/sem_overview.7.html', '📄', 'man 7 sem_overview', 'POSIX semaphores on Linux: named and unnamed, wait and post.', 'Open')}
${L('https://docs.oracle.com/javase/specs/jls/se21/html/jls-17.html', '☕', 'JLS §17 — Threads and Locks', 'The Java Memory Model: happens-before, volatile, final fields.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>Nhiều công cụ hơn mutex — và một lỗi không đếm khoá nào thấy</h2>
<p class="lead">Mutex cho đúng một luồng vào. Hệ thống thật còn cần "tối đa ba người cùng lúc", "nhiều người đọc hoặc một người ghi", và "không khoá gì cả, chỉ một phép cập nhật không chia cắt". Bài này đo từng thứ đó. Rồi nó cho thấy một lỗi lạ hơn: một luồng quay vòng mãi mãi chờ một cờ mà luồng khác đã bật — không mất cập nhật nào, chỉ là lần ghi đó không bao giờ <em>hiện ra</em> với luồng kia.</p>

<h3>Semaphore: tối đa N người bên trong</h3>
<p><strong>Semaphore</strong> là một biến đếm với hai thao tác nguyên tử: <code>wait</code> (P của Dijkstra) lấy một đơn vị và ngủ nếu hết; <code>post</code> (V) trả lại một đơn vị và đánh thức một người đang ngủ. Khởi tạo bằng 3 thì tối đa ba luồng đi qua được <code>wait</code> cùng lúc. Mười yêu cầu, mỗi cái giữ một "kết nối CSDL" trong 100 ms:</p>
${src('ch05/sem.c', 'c')}
${run('c53-sem', './sem 0')}
${run('c53-sem', './sem 3')}
<p>Không có semaphore, cả mười chạy cùng lúc (đỉnh 10, 101 ms). Có nó, không bao giờ quá ba cùng lúc, và mười yêu cầu đi qua trong bốn đợt — ⌈10 / 3⌉ = 4 × 100 ms ≈ 404 ms. Đây đúng là thứ mà <strong>pool kết nối CSDL</strong> của bạn đang là: <code>connection_limit</code> của Prisma, <code>maximumPoolSize</code> của HikariCP, <code>pg.Pool({ max })</code>. Yêu cầu thứ 4 không lỗi; nó chờ — vì thế một pool quá nhỏ hiện ra thành độ trễ, không phải thành lỗi. Semaphore khởi tạo bằng 1 hành xử như mutex, khác một điểm: nó không có chủ, nên luồng nào cũng <code>post</code> được — hữu ích để báo hiệu, nguy hiểm khi dùng làm khoá.</p>

<h3>Khoá đọc-ghi: bài toán readers–writers</h3>
<p>Nhiều cấu trúc dùng chung được đọc nhiều hơn ghi rất nhiều — bảng cấu hình, cache, bảng định tuyến. Mutex bắt người đọc xếp hàng sau nhau vô ích. <strong>Khoá đọc-ghi (read-write lock)</strong> cho bao nhiêu người đọc cũng được vào cùng lúc, hoặc đúng một người ghi vào một mình:</p>
${src('ch05/rw.c', 'c')}
${run('c53-sem', './rw mutex')}
${run('c53-sem', './rw rwlock')}
<p>Với 99% là đọc, khoá đọc-ghi tăng thông lượng khoảng gấp đôi (638 → 1.348 thao tác mỗi ms) trên cùng 8 luồng. Hai lưu ý, đều từ <em>bài toán readers–writers</em> kinh điển: nếu người đọc cứ đến liên tục, người ghi có thể chờ mãi (<strong>người ghi bị đói — writer starvation</strong>) — mặc định của glibc ưu tiên người đọc, và <code>pthread_rwlockattr_setkind_np</code> đổi được điều đó; và khi vùng găng chỉ dài vài lệnh, phần sổ sách của chính khoá đọc-ghi có thể làm nó chậm hơn mutex thường. Đo trước khi đổi. Java có <code>ReentrantReadWriteLock</code>; khoá dòng <code>FOR SHARE</code> vs <code>FOR UPDATE</code> của PostgreSQL (bài 5.4) là cùng ý tưởng.</p>

<h3>Nguyên tử và compare-and-swap: không khoá gì cả</h3>
<p>Với một từ nhớ (word), CPU cung cấp các lệnh đọc-sửa-ghi không chia cắt. Tổng quát nhất là <strong>compare-and-swap (CAS — so sánh rồi hoán đổi)</strong>: "nếu ô này vẫn giữ <em>old</em> thì ghi <em>new</em>; cho tôi biết đã ghi hay chưa". Mọi thuật toán không khoá (lock-free) đều dựng từ nó. Đây là <code>counter++</code> dựng lại bằng CAS, có đếm số lần một luồng thua và phải thử lại:</p>
${src('ch05/cas.c', 'c')}
${run('c53-sem', './cas 1 ')}
${run('c53-sem', './cas 4 ')}
<p>Luôn đúng — và với bốn luồng, trung bình hơn một lần thử lại cho mỗi lần tăng: không khoá không có nghĩa là không phải chờ hay không có tranh chấp. Riêng việc đếm thì CPU có lệnh chuyên dụng (<code>lock xadd</code> trên x86, <code>ldadd</code> trên ARM), chính là thứ chế độ <code>atomic</code> ở bài 5.2 dùng: ~8 ns khi một mình, ~51 ns khi tranh chấp. Java cho bạn cả hai kiểu:</p>
${src('ch05/Atomics.java', 'java')}
${run('c53-sem', 'java Atomics.java')}
<p><code>AtomicLong</code> là một từ nhớ dùng chung, nên tám luồng vẫn tranh nhau một dòng cache. <code>LongAdder</code> cho mỗi luồng một ô riêng và chỉ cộng lại khi bạn gọi <code>sum()</code> — ý tưởng <code>local</code> của bài 5.2 đóng gói thành một lớp — và ở đây nó nhanh hơn trên 15 lần. Dùng nó cho số liệu đo (metrics) và bộ đếm lượt truy cập. Còn Node, với chế độ <code>atomics</code> của chương trình bài 5.1:</p>
${run('c53-sem', 'node race-sab.js atomics')}
<p>Không mất lần nào (chế độ <code>plain</code> hỏng có lúc mất tới một nửa), với thời gian cỡ gấp ba bản hỏng. Đúng thì có giá; vẫn rẻ hơn nhiều so với một số dư tài khoản sai.</p>
${lab('race', 'atomic', 'vi', 'counter++ thành MỘT lệnh nguyên tử không chia cắt: luồng kia không bao giờ lọt vào giữa nạp và ghi. Chạy 1.000 lần xen kẽ — một cột ở đúng giá trị, và không cần khoá nào.')}

<h3>Tầm nhìn bộ nhớ: lần ghi không bao giờ tới</h3>
<p>Một lỗi khác. Một luồng quay vòng tới khi cờ thành 1; luồng main bật cờ sau 100 ms. Không tăng gì cả, nên không có gì để mất:</p>
${src('ch05/flag.c', 'c')}
${run('c53-sem', 'timeout 3 ./flag plain')}
${run('c53-sem', './flag atomic')}
<p>Với <code>int</code> thường, luồng chờ không bao giờ thấy cờ; <code>timeout</code> giết nó sau 3 giây (exit 124). Trình biên dịch đọc <code>ready</code> một lần, giữ trong thanh ghi và quay vòng trên thanh ghi mãi — hợp lệ, vì một biến thường bị luồng khác đổi mà không đồng bộ là data race, và trình biên dịch được phép giả định không có data race. Với <code>atomic_load</code>, mỗi vòng đều đọc bộ nhớ thật. Java làm đúng chuyện đó lúc chạy, trong JIT:</p>
${src('ch05/Stop.java', 'java')}
${run('c53-sem', 'timeout 5 java Stop.java plain')}
${run('c53-sem', 'java Stop.java volatile')}
<p>Không có <code>volatile</code>, worker không bao giờ dừng. Khi JIT đã biên dịch vòng lặp nóng, nó được phép kéo lệnh đọc <code>stop</code> ra khỏi vòng; Java Memory Model chỉ hứa một lần ghi hiện ra với luồng khác nếu giữa chúng có một cạnh <em>happens-before</em> (xảy ra trước) — và <code>volatile</code>, <code>synchronized</code>, khoá và nguyên tử là những thứ tạo ra cạnh đó. (Khi soạn bài này, một phiên bản bật cờ sau chỉ 100 ms có một lần chạy kết thúc bình thường: lỗi có hiện hay không tuỳ JIT tới kịp trước hay không. Thêm một lý do một lần chạy qua không chứng minh được gì.)</p>

<h3>CPU cũng đảo thứ tự: store buffering</h3>
<p>Ngay cả khi trình biên dịch giữ nguyên thứ tự của bạn, CPU thì không nhất thiết. Mỗi lõi ghi vào một <em>bộ đệm ghi (store buffer)</em> riêng trước khi lần ghi tới được cache mà lõi khác thấy, nên một lõi có thể đọc một biến <em>trước</em> khi lần ghi trước đó của chính nó vào một biến khác hiện ra. Phép thử nổi tiếng: luồng A làm <code>x = 1; r1 = y;</code>, luồng B làm <code>y = 1; r2 = x;</code>. Theo thứ tự trong mã, ít nhất một bên phải thấy 1 — nên <code>r1 = r2 = 0</code> trông như không thể:</p>
${src('ch05/sb.c', 'c')}
${run('c53-sem', './sb relaxed', 2)}
${run('c53-sem', 'objdump -d --no-show-raw-insn sb')}
<p>Với nguyên tử relaxed, kết quả "không thể" xảy ra ở gần như mọi lần trong một triệu lần chạy trên máy ARM này, và bản dịch ngược cho thấy không phải do trình biên dịch: bản relaxed là một <code>str</code> thường rồi tới <code>ldr</code>, đúng thứ tự của bạn. Chính CPU đã cho lệnh nạp vượt lên trước lệnh ghi. Với nguyên tử tuần tự nhất quán (sequentially consistent — mặc định của C11 và là ngữ nghĩa của <code>volatile</code> trong Java), trình biên dịch sinh <code>stlr</code>/<code>ldar</code>, cấm kiểu đảo đó — không lần nào. x86 cũng cho phép đúng kiểu đảo này. Bạn gần như sẽ không bao giờ viết nguyên tử relaxed trong code ứng dụng; điểm chính là khoá và nguyên tử mặc định đã chứa sẵn các rào chắn (barrier) đó, còn một cờ tự chế thì không.</p>

<div class="pitfall co-tieu-de">
<p><strong>"Cứ thêm <code>volatile</code> là an toàn luồng."</strong> Hai ngôn ngữ, hai nghĩa khác nhau. Trong <strong>Java</strong>, <code>volatile</code> bảo đảm tầm nhìn và thứ tự cho đúng trường đó — nó sửa được <code>Stop.java</code>, nhưng <code>count++</code> trên một int volatile vẫn là nạp–cộng–ghi và vẫn mất cập nhật. Trong <strong>C/C++</strong>, <code>volatile</code> chỉ ngăn trình biên dịch giữ biến trong thanh ghi; nó không cho tính nguyên tử và không sắp thứ tự giữa các lõi. Chế độ <code>none</code> của bài 5.2 dùng một biến đếm <code>volatile long</code> và vẫn mất 70% số lần tăng. Với luồng trong C hãy dùng <code>_Atomic</code>/<code>stdatomic.h</code> hoặc khoá; trong Java chỉ dùng <code>volatile</code> cho cờ và tham chiếu được công bố, còn mọi thứ đọc-sửa-ghi thì dùng nguyên tử hoặc khoá.</p>
</div>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> khi tắt, dịch vụ Spring Boot của bạn treo tới khi Kubernetes giết nó (exit 137 — Chương 1). Một worker nền quay vòng <code>while (running) { … }</code> và shutdown hook đặt <code>running = false</code>. Riêng một chuyện khác, nhóm muốn biết vì sao yêu cầu xếp hàng khi pool CSDL đặt bằng 3.</p>
<ol>
<li>Chạy <code>java Stop.java plain</code> dưới <code>timeout 5</code> rồi <code>java Stop.java volatile</code>. Ghi lại mã thoát.</li>
<li>Biên dịch <code>flag.c</code> với <code>-O2</code>; chạy <code>plain</code> dưới <code>timeout 3</code> và <code>atomic</code>. Rồi biên dịch với <code>-O0</code> và chạy lại <code>plain</code> — cái gì đổi, và vì sao <code>-O0</code> không phải là cách sửa?</li>
<li>Chạy <code>./sem 0</code>, <code>./sem 3</code> và <code>./sem 5</code>. Đoán trước tổng thời gian của mỗi cái bằng ⌈10/N⌉ × 100 ms rồi mới chạy.</li>
<li>Chạy <code>java Atomics.java</code>. Bạn sẽ dùng lớp nào cho một bộ đếm yêu cầu theo từng endpoint, được ghi ở mọi yêu cầu và đọc mỗi phút một lần?</li>
</ol>
<p><strong>Đạt khi:</strong> bạn giải thích được vụ treo là một vấn đề tầm nhìn và gọi tên cách sửa một chữ, đoán thời gian của semaphore sai không quá ~10%, và biện luận <code>LongAdder</code> vs <code>AtomicLong</code> bằng chính số liệu của bạn.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['semaphore (P/V, wait/post)', 'Một bộ đếm "giấy phép"; wait lấy một cái hoặc ngủ, post trả lại một cái. Khởi tạo N = tối đa N người bên trong.'],
  ['read-write lock (khoá đọc-ghi)', 'Nhiều người đọc cùng lúc, hoặc một người ghi một mình. Giải bài readers–writers; coi chừng người ghi bị đói.'],
  ['compare-and-swap (CAS)', 'Nguyên tử: nếu ô nhớ đang giữ old thì ghi new, và báo có thành công không. Viên gạch của code không khoá.'],
  ['lock-free (không khoá)', 'Không luồng nào bị chặn khi đang giữ khoá; các luồng vẫn có thể phải thử lại khi tranh chấp.'],
  ['LongAdder', 'Bộ đếm Java chia các lần tăng ra nhiều ô theo luồng và cộng lại khi đọc — nhanh cho bộ đếm ghi nhiều.'],
  ['memory visibility (tầm nhìn bộ nhớ)', 'Lần ghi của một luồng có được luồng khác thấy không, và khi nào.'],
  ['happens-before (xảy ra trước)', 'Luật của mô hình bộ nhớ Java/C++: lần ghi chắc chắn hiện ra với lần đọc sau chỉ khi một cạnh đồng bộ sắp thứ tự chúng.'],
  ['memory barrier / ordering (rào chắn bộ nhớ)', 'Lệnh hoặc chế độ nguyên tử ngăn CPU và trình biên dịch đảo thứ tự các thao tác bộ nhớ qua nó.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Semaphore giới hạn mức đồng thời: khởi tạo 3, mười yêu cầu 100 ms chạy ba cái một lúc trong ≈ 404 ms — y như một pool kết nối CSDL.</li>
<li>Khoá đọc-ghi tăng gấp đôi thông lượng cho một bảng 99% đọc; coi chừng người ghi bị đói và vùng găng quá ngắn.</li>
<li>CAS cho phép cập nhật đúng mà không khoá nhưng phải thử lại khi tranh chấp; <code>LongAdder</code> nhanh hơn <code>AtomicLong</code> trên 15 lần nhờ không dùng chung một từ nhớ.</li>
<li>Tầm nhìn là một lỗi khác với mất cập nhật: vòng lặp trên cờ thường treo mãi trong C với <code>-O2</code> và trong JIT của Java; nguyên tử/<code>volatile</code> sửa được.</li>
<li>CPU đảo một lệnh ghi với lệnh nạp phía sau: (0, 0) "không thể" xuất hiện ở gần như mọi lần với nguyên tử relaxed và không lần nào với nguyên tử tuần tự nhất quán.</li>
</ul>
${L('https://man7.org/linux/man-pages/man7/sem_overview.7.html', '📄', 'man 7 sem_overview', 'Semaphore POSIX trên Linux: có tên và không tên, wait và post.', 'Mở')}
${L('https://docs.oracle.com/javase/specs/jls/se21/html/jls-17.html', '☕', 'JLS §17 — Threads and Locks', 'Mô hình bộ nhớ Java: happens-before, volatile, trường final.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 5.4 — Backend ───────────────────────── */
    {
      title: '5.4 — The same bugs in backend code: double booking, FOR UPDATE, Redis locks, idempotency|||5.4 — Chính các lỗi đó trong code backend: đặt trùng, FOR UPDATE, khoá Redis, idempotency',
      slug: 'os-5-4-backend',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Node một luồng vẫn bán một ghế cho hai người qua một await; đặt ghế trùng và trừ tiền hai lần tái hiện trong PostgreSQL 17; sửa bằng SELECT … FOR UPDATE, UPDATE có điều kiện và idempotency key; khoá phân tán Redis SET NX PX, cái bẫy hết hạn khoá, token và fencing token.',
      content: `${G54}
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.4</span>
<h2>Requests are threads, rows are shared memory</h2>
<p class="lead">Your backend does not write <code>counter++</code> on a global. But it runs many requests at once — on Node's event loop, on a Spring thread pool, across several containers behind nginx — and they all read and write the same rows. Swap "thread" for "request" and "variable" for "row" and every bug from lessons 5.1–5.3 comes back: two customers get the same seat, a customer is charged twice. This lesson reproduces both in a real PostgreSQL 17 and fixes them the way production systems do.</p>

<h3>Node has one thread — and still sells one seat twice</h3>
${src('ch05/async-race.js', 'javascript')}
${run('c54-node', 'node async-race.js', 2)}
<p>No threads, no shared memory, and both customers got the last seat. Every <code>await</code> is a point where the event loop runs <em>other</em> requests: alice reads "1 seat left", awaits; bob reads "1 seat left", awaits; both write. It is lesson 5.1's load–add–store with <code>await</code> in place of a context switch. The in-process lock (<code>lock</code> mode) fixes it — for <strong>one</strong> process. Run two instances (PM2 cluster, two containers, a second VPS) and each has its own lock and its own idea of the truth. The shared state lives in the database, so the lock must live there too.</p>

<h3>Double booking, reproduced in PostgreSQL</h3>
<p>Two sessions run the same "read, check, then write" script at the same time (each <code>psql</code> is one connection, like one request in your app):</p>
${src('ch05/schema.sql', 'sql')}
${src('ch05/book-naive.sql', 'sql')}
${run('c54-db', 'psql -qX -v who=alice -f book-naive.sql', 2)}
<p>Both were told "booked" and both got a confirmation e-mail; the row says bob, because his <code>UPDATE</code> silently overwrote alice's. A plain <code>SELECT</code> takes no lock — in PostgreSQL readers never block writers (MVCC, PostgreSQL course 11.2) — so both reads saw a free seat during the half second the app spent doing other work.</p>

<h3>Fix 1 — SELECT … FOR UPDATE: a mutex whose name is a row</h3>
<p>Add two words to the read: <code>FOR UPDATE</code> locks the selected row until the transaction ends.</p>
${src('ch05/book-lock.sql', 'sql')}
${run('c54-db', 'psql -qX -v who=alice -f book-lock.sql', 2)}
<p>While alice's transaction held the row, bob's <code>SELECT … FOR UPDATE</code> was <em>waiting</em> — <code>pg_stat_activity</code> shows it with <code>wait_event_type = Lock</code>. When alice committed, PostgreSQL woke bob and re-read the <strong>latest</strong> version of the row, so his check now saw alice and refused. This is exactly a mutex from lesson 5.2: the lock key is the row, the critical section is the transaction, and the waiting connection sleeps instead of spinning. The same lesson-5.2 rules apply: keep the critical section short (never call a payment provider or send an e-mail while holding a row lock — every waiting request also holds a pooled connection), and lock several rows in a fixed order or you get a deadlock (Chapter 6).</p>
${lab('race', 'mutex', 'en', 'Read “thread” as “request” and “counter” as “the seat row”: FOR UPDATE is lock(m) around read–check–write. Step it and watch the second request wait.')}

<h3>Fix 2 — make check-and-write one statement</h3>
<p>Often you do not need to read first at all. Put the check <em>in</em> the write:</p>
${src('ch05/book-cond.sql', 'sql')}
${run('c54-db', 'psql -qX -v who=alice -f book-cond.sql', 2)}
<p><code>UPDATE … WHERE booked_by IS NULL</code> is the database's compare-and-swap (lesson 5.3): "set it only if it is still free". The row is locked for the duration of the statement, bob's update waited, re-checked the condition against alice's committed row, matched nothing and reported <code>UPDATE 0</code> — the app turns 0 rows into "sorry, taken". No extra round trip, no window. As a last line of defence, put the invariant in the schema too: a <code>bookings</code> table with <code>PRIMARY KEY (show_id, seat)</code> makes a second insert fail with a unique violation no matter what the code does.</p>

<h3>Charged twice: when the duplicate is the same request</h3>
<p>The second classic is not two customers but <strong>one request delivered twice</strong>: the mobile app timed out and retried, the user double-clicked "Pay", the message queue redelivered (most queues promise at-least-once delivery). Each copy is a perfectly valid request:</p>
${src('ch05/pay.sql', 'sql')}
${run('c54-db', 'psql -qX -v who=request -f pay.sql', 2)}
<p>100 − 30 − 30 = 40, and two payment rows for one order. No lock helps: even run strictly one after the other, both copies would charge. What the server needs is a way to recognise "I have already done <em>this</em>".</p>

<h3>Fix — an idempotency key</h3>
<p>The client generates a unique key (a UUID) for each logical operation and sends it with every attempt — Stripe's API takes it as the <code>Idempotency-Key</code> header. The server records the key under a <code>UNIQUE</code>/<code>PRIMARY KEY</code> constraint <em>in the same transaction</em> as the side effect, and stores the response to replay:</p>
${src('ch05/pay-idem.sql', 'sql')}
${run('c54-db', 'psql -qX -v who=request -v key', 2)}
<p>Charged once, one payment row, and the retry received the same answer the first request produced. The two copies even arrived together: the retry's <code>INSERT … ON CONFLICT DO NOTHING</code> waited on the first transaction's uncommitted key (the unique index acts as a lock), then saw the conflict and inserted nothing. In practice: keep keys for a bounded time (Stripe documents 24 hours), scope them per user, and return the stored response rather than an error, so a retry is indistinguishable from the original.</p>

<h3>A distributed lock with Redis — and its trap</h3>
<p>Sometimes the critical section is not inside one database: a cron job that must run on only one of three instances, generating a report once, calling an external API that has no idempotency. The usual tool is a Redis lock: <code>SET key token NX PX ttl</code> — set only if absent, with an expiry so a crashed holder cannot block everyone forever. Watch what the expiry does:</p>
${run('c54-redis', 'redis-cli SET lock:seat:A7 worker-A', 2)}
${run('c54-redis', 'sleep 2.5', 5)}
<p>Worker A took the lock with a 2 s lease, B was refused (<code>(nil)</code>). Then A stalled for 2.5 s — a GC pause, a slow query, a VM migration — and the lease expired (<code>PTTL -2</code>: key gone). B took the lock, legitimately. A woke up, finished, and released "its" lock with <code>DEL</code> — deleting <strong>B's</strong> lock — and C walked in. B and C now both believe they hold the lock, and A also did its work after losing it. Two fixes, both run here:</p>
${src('ch05/unlock.lua', 'lua')}
${run('c54-redis', 'redis-cli EVAL "$(cat unlock.lua)" 1 lock:seat:A7 worker-A', 3)}
<p>Releasing with a token check (one atomic Lua script) means A can no longer delete someone else's lock. But it cannot undo the work A did after its lease expired. For that the <em>resource</em> must refuse stale holders: each lock acquisition gets an increasing <strong>fencing token</strong> (<code>INCR</code>), and the storage rejects any write carrying a token older than one it has already seen:</p>
${src('ch05/fenced-write.lua', 'lua')}
${run('c54-redis', 'redis-cli INCR fence', 5)}
<p>B (token 2) wrote; the late A (token 1) was rejected. In PostgreSQL the same check is a column: <code>UPDATE … SET fence = $token WHERE fence &lt; $token</code>.</p>

<div class="pitfall co-tieu-de">
<p><strong>"A Redis lock is a mutex across servers."</strong> A lock with an expiry is a <em>lease</em>: it guarantees mutual exclusion only if no holder ever pauses longer than the TTL — and processes do pause (GC, swapping, a container being throttled, Chapter 3). Use Redis locks to avoid <em>duplicate work</em> (efficiency). For <em>correctness</em> — money, seats, stock — let the database enforce it: row locks, conditional updates, unique constraints, idempotency keys, fencing tokens. Martin Kleppmann's essay below is the classic explanation, including why multi-node Redlock does not change this.</p>
</div>

<h3>Where this continues</h3>
<p>The PostgreSQL course measures lost updates, <code>FOR UPDATE</code>/<code>NOWAIT</code>/<code>SKIP LOCKED</code> job queues and a real deadlock in lesson 11.4; DBI202 covers transactions and ACID for the exam. Chapter 6 of this course takes the deadlock side: what happens when two of these row locks are taken in opposite orders.</p>
${L(PG11, '🐘', 'PostgreSQL · 11.4 — Row locks, lost updates and deadlocks', 'FOR UPDATE, NOWAIT, SKIP LOCKED and a real deadlock, measured.', 'Open')}
${L(DBI8, '🎓', 'DBI202 · Transactions &amp; ACID', 'The exam view of transactions, isolation and locking.', 'Open')}

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> after a flash sale on your ticket site, support reports two seats sold to two people each and three customers charged twice for one order. You have the booking SQL and the payment SQL. Reproduce both, then prove your fixes.</p>
<ol>
<li>Start a throw-away database: <code>docker run -d --rm --label oslab=1 --name os-pg5 -e POSTGRES_HOST_AUTH_METHOD=trust -v "$PWD/ch05":/lab/ch05 postgres:17</code>, then <code>docker exec -it -u postgres -w /lab/ch05 os-pg5 bash</code>.</li>
<li>Load <code>schema.sql</code> and run <code>book-naive.sql</code> twice in parallel (alice and bob, with <code>&amp;</code>). Check the row. Repeat with <code>book-lock.sql</code> and, while bob waits, query <code>pg_stat_activity</code> for <code>wait_event_type = 'Lock'</code>.</li>
<li>Run <code>book-cond.sql</code> twice in parallel. What does the second one's row count tell the app?</li>
<li>Run <code>pay.sql</code> twice, check balance and payments; reset and run <code>pay-idem.sql</code> twice with the <em>same</em> key, then once with a <em>different</em> key. Explain each balance.</li>
<li>(Optional) In a <code>redis:7</code> container, reproduce the expired-lease scenario with <code>SET … NX PX 2000</code>, <code>sleep 2.5</code> and a naive <code>DEL</code>; then release with <code>unlock.lua</code>.</li>
</ol>
<p><strong>Done when:</strong> you have reproduced the double booking and the double charge, fixed each (FOR UPDATE or conditional update; idempotency key), and can explain why the Redis lock alone would not have protected the money. Remove the container afterwards (<code>docker rm -f os-pg5</code>).</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['check-then-act', 'Read a condition, then act on it in a separate step — racy unless the two are made one atomic operation.'],
  ['SELECT … FOR UPDATE', 'Reads rows and locks them until the transaction ends; other lockers wait, then see the latest version.'],
  ['conditional update', 'UPDATE … WHERE &lt;still valid&gt;: the database’s compare-and-swap; 0 rows means you lost.'],
  ['idempotency key', 'A client-chosen unique key per operation; the server performs the operation once per key and replays the result.'],
  ['at-least-once delivery', 'Retries and queues may deliver the same request more than once; the receiver must tolerate duplicates.'],
  ['distributed lock / lease', 'A lock in a shared store (Redis) with an expiry; holds only while the holder is not paused past the TTL.'],
  ['fencing token', 'An increasing number issued with each lock grant; the resource rejects writes with an older token.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>In a backend, requests are the threads and rows are the shared memory; a single-threaded Node process still double-books across an <code>await</code>.</li>
<li>Measured in PostgreSQL 17: read-check-write sold one seat to two people; <code>FOR UPDATE</code> or a conditional <code>UPDATE … WHERE booked_by IS NULL</code> fixed it.</li>
<li>Duplicates of the same request (retries, double clicks, redelivery) charged twice; an idempotency key under a unique constraint, in the same transaction, charged once and replayed the response.</li>
<li>Redis <code>SET NX PX</code> locks expire: a paused holder led to two holders at once; token-checked release and fencing tokens close the gap.</li>
<li>Rule: Redis locks for efficiency, database constraints and locks for correctness.</li>
</ul>
${L('https://www.postgresql.org/docs/current/explicit-locking.html', '🐘', 'PostgreSQL docs — Explicit Locking', 'Row-level lock modes, FOR UPDATE/FOR SHARE, deadlocks, advisory locks.', 'Open')}
${L('https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html', '🔒', 'Kleppmann — How to do distributed locking', 'Why lock expiry breaks mutual exclusion, and fencing tokens.', 'Open')}
${L('https://docs.stripe.com/api/idempotent_requests', '💳', 'Stripe — Idempotent requests', 'How a real payments API uses the Idempotency-Key header.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.4</span>
<h2>Yêu cầu là luồng, dòng dữ liệu là bộ nhớ chung</h2>
<p class="lead">Backend của bạn không viết <code>counter++</code> trên một biến toàn cục. Nhưng nó chạy nhiều yêu cầu cùng lúc — trên event loop của Node, trên thread pool của Spring, qua nhiều container sau nginx — và tất cả cùng đọc và ghi những dòng dữ liệu giống nhau. Đổi "luồng" thành "yêu cầu" và "biến" thành "dòng" là mọi lỗi của bài 5.1–5.3 quay lại: hai khách nhận cùng một ghế, một khách bị trừ tiền hai lần. Bài này tái hiện cả hai trong PostgreSQL 17 thật và sửa chúng theo đúng cách hệ thống production làm.</p>

<h3>Node một luồng — mà vẫn bán một ghế hai lần</h3>
${src('ch05/async-race.js', 'javascript')}
${run('c54-node', 'node async-race.js', 2)}
<p>Không có luồng, không có bộ nhớ chung, vậy mà cả hai khách đều nhận ghế cuối. Mỗi <code>await</code> là một điểm mà event loop chạy các yêu cầu <em>khác</em>: alice đọc "còn 1 ghế", await; bob đọc "còn 1 ghế", await; cả hai cùng ghi. Đó chính là nạp–cộng–ghi của bài 5.1 với <code>await</code> thay cho chuyển ngữ cảnh. Khoá trong tiến trình (chế độ <code>lock</code>) sửa được — cho <strong>một</strong> tiến trình. Chạy hai instance (PM2 cluster, hai container, một VPS thứ hai) là mỗi cái có khoá riêng và "sự thật" riêng. Trạng thái dùng chung nằm trong CSDL, nên khoá cũng phải nằm ở đó.</p>

<h3>Đặt ghế trùng, tái hiện trong PostgreSQL</h3>
<p>Hai phiên chạy cùng một kịch bản "đọc, kiểm, rồi ghi" cùng lúc (mỗi <code>psql</code> là một kết nối, như một yêu cầu trong app của bạn):</p>
${src('ch05/schema.sql', 'sql')}
${src('ch05/book-naive.sql', 'sql')}
${run('c54-db', 'psql -qX -v who=alice -f book-naive.sql', 2)}
<p>Cả hai đều được báo "đã đặt" và cả hai nhận e-mail xác nhận; dòng dữ liệu ghi bob, vì lệnh <code>UPDATE</code> của bob lặng lẽ đè lên của alice. Một <code>SELECT</code> thường không lấy khoá nào — trong PostgreSQL người đọc không bao giờ chặn người ghi (MVCC, khoá PostgreSQL bài 11.2) — nên cả hai lần đọc đều thấy ghế trống trong nửa giây app bận làm việc khác.</p>

<h3>Sửa 1 — SELECT … FOR UPDATE: một mutex mang tên một dòng</h3>
<p>Thêm hai chữ vào lệnh đọc: <code>FOR UPDATE</code> khoá dòng đã chọn tới khi giao dịch kết thúc.</p>
${src('ch05/book-lock.sql', 'sql')}
${run('c54-db', 'psql -qX -v who=alice -f book-lock.sql', 2)}
<p>Trong lúc giao dịch của alice giữ dòng, lệnh <code>SELECT … FOR UPDATE</code> của bob <em>đang chờ</em> — <code>pg_stat_activity</code> hiện nó với <code>wait_event_type = Lock</code>. Khi alice commit, PostgreSQL đánh thức bob và đọc lại phiên bản <strong>mới nhất</strong> của dòng, nên lần kiểm của bob giờ thấy alice và từ chối. Đây đúng là một mutex của bài 5.2: khoá mang tên dòng, vùng găng là giao dịch, và kết nối đang chờ thì ngủ chứ không quay vòng. Các luật của bài 5.2 vẫn áp dụng: giữ vùng găng ngắn (đừng bao giờ gọi cổng thanh toán hay gửi e-mail trong lúc giữ khoá dòng — mỗi yêu cầu đang chờ cũng đang giữ một kết nối trong pool), và khoá nhiều dòng theo một thứ tự cố định nếu không muốn deadlock (Chương 6).</p>
${lab('race', 'mutex', 'vi', 'Đọc “luồng” thành “yêu cầu” và “counter” thành “dòng ghế”: FOR UPDATE chính là lock(m) bao quanh đọc–kiểm–ghi. Bước từng lệnh và nhìn yêu cầu thứ hai phải chờ.')}

<h3>Sửa 2 — gộp kiểm và ghi thành một câu lệnh</h3>
<p>Nhiều khi bạn chẳng cần đọc trước. Đặt phép kiểm <em>vào trong</em> lệnh ghi:</p>
${src('ch05/book-cond.sql', 'sql')}
${run('c54-db', 'psql -qX -v who=alice -f book-cond.sql', 2)}
<p><code>UPDATE … WHERE booked_by IS NULL</code> là compare-and-swap của cơ sở dữ liệu (bài 5.3): "chỉ ghi nếu nó vẫn trống". Dòng bị khoá trong suốt câu lệnh, lệnh update của bob chờ, kiểm lại điều kiện trên dòng alice đã commit, không khớp dòng nào và báo <code>UPDATE 0</code> — app biến 0 dòng thành "xin lỗi, ghế đã có người". Không thêm lượt đi-về, không có khe hở. Làm lớp phòng thủ cuối, hãy đưa bất biến vào cả lược đồ: một bảng <code>bookings</code> với <code>PRIMARY KEY (show_id, seat)</code> khiến lần insert thứ hai thất bại vì vi phạm ràng buộc duy nhất, bất kể code làm gì.</p>

<h3>Trừ tiền hai lần: khi bản trùng là cùng một yêu cầu</h3>
<p>Ca kinh điển thứ hai không phải hai khách mà là <strong>một yêu cầu được gửi tới hai lần</strong>: app di động hết thời gian chờ rồi gửi lại, người dùng bấm "Thanh toán" hai lần, hàng đợi thông điệp giao lại (đa số hàng đợi chỉ hứa giao ít nhất một lần). Mỗi bản sao đều là một yêu cầu hoàn toàn hợp lệ:</p>
${src('ch05/pay.sql', 'sql')}
${run('c54-db', 'psql -qX -v who=request -f pay.sql', 2)}
<p>100 − 30 − 30 = 40, và hai dòng thanh toán cho một đơn. Không khoá nào giúp được: kể cả chạy tuần tự từng cái một, cả hai bản sao vẫn trừ tiền. Thứ máy chủ cần là một cách nhận ra "tôi đã làm <em>đúng việc này</em> rồi".</p>

<h3>Sửa — một idempotency key</h3>
<p>Client sinh một khoá duy nhất (một UUID) cho mỗi thao tác logic và gửi kèm ở mọi lần thử — API của Stripe nhận nó qua header <code>Idempotency-Key</code>. Máy chủ ghi khoá đó dưới một ràng buộc <code>UNIQUE</code>/<code>PRIMARY KEY</code> <em>trong cùng giao dịch</em> với tác dụng phụ, và lưu câu trả lời để phát lại:</p>
${src('ch05/pay-idem.sql', 'sql')}
${run('c54-db', 'psql -qX -v who=request -v key', 2)}
<p>Trừ tiền một lần, một dòng thanh toán, và lần gửi lại nhận đúng câu trả lời mà yêu cầu đầu đã tạo ra. Hai bản sao thậm chí tới cùng lúc: lệnh <code>INSERT … ON CONFLICT DO NOTHING</code> của lần gửi lại phải chờ khoá chưa commit của giao dịch đầu (chỉ mục duy nhất hoạt động như một khoá), rồi thấy xung đột và không chèn gì. Thực tế: giữ khoá trong một thời gian có hạn (Stripe ghi 24 giờ), gắn khoá theo người dùng, và trả lại câu trả lời đã lưu thay vì báo lỗi, để lần gửi lại không phân biệt được với lần gốc.</p>

<h3>Khoá phân tán bằng Redis — và cái bẫy của nó</h3>
<p>Có khi vùng găng không nằm gọn trong một CSDL: một cron job chỉ được chạy trên một trong ba instance, sinh một báo cáo đúng một lần, gọi một API ngoài không có idempotency. Công cụ thường dùng là khoá Redis: <code>SET key token NX PX ttl</code> — chỉ đặt nếu chưa có, kèm thời hạn để một người giữ khoá bị sập không chặn mọi người mãi mãi. Xem thời hạn đó làm gì:</p>
${run('c54-redis', 'redis-cli SET lock:seat:A7 worker-A', 2)}
${run('c54-redis', 'sleep 2.5', 5)}
<p>Worker A lấy khoá với hợp đồng thuê (lease) 2 giây, B bị từ chối (<code>(nil)</code>). Rồi A bị kẹt 2,5 giây — GC dừng, truy vấn chậm, VM bị di chuyển — và hợp đồng hết hạn (<code>PTTL -2</code>: khoá đã mất). B lấy khoá, hoàn toàn hợp lệ. A tỉnh dậy, làm nốt, rồi nhả "khoá của mình" bằng <code>DEL</code> — xoá mất khoá của <strong>B</strong> — và C bước vào. Giờ B và C đều tin mình đang giữ khoá, còn A cũng đã làm việc sau khi mất khoá. Hai cách sửa, đều chạy ở đây:</p>
${src('ch05/unlock.lua', 'lua')}
${run('c54-redis', 'redis-cli EVAL "$(cat unlock.lua)" 1 lock:seat:A7 worker-A', 3)}
<p>Nhả khoá có so token (một script Lua nguyên tử) khiến A không còn xoá được khoá của người khác. Nhưng nó không xoá được việc A đã làm sau khi hết hạn. Muốn vậy, chính <em>tài nguyên</em> phải từ chối người giữ khoá đã cũ: mỗi lần cấp khoá kèm một <strong>fencing token</strong> tăng dần (<code>INCR</code>), và kho dữ liệu từ chối mọi lệnh ghi mang token cũ hơn token nó đã từng thấy:</p>
${src('ch05/fenced-write.lua', 'lua')}
${run('c54-redis', 'redis-cli INCR fence', 5)}
<p>B (token 2) ghi được; A tới muộn (token 1) bị từ chối. Trong PostgreSQL phép kiểm đó là một cột: <code>UPDATE … SET fence = $token WHERE fence &lt; $token</code>.</p>

<div class="pitfall co-tieu-de">
<p><strong>"Khoá Redis là một mutex xuyên máy chủ."</strong> Một khoá có thời hạn là một <em>hợp đồng thuê (lease)</em>: nó chỉ bảo đảm loại trừ lẫn nhau nếu không người giữ khoá nào bị dừng lâu hơn TTL — mà tiến trình thì có dừng thật (GC, swap, container bị bóp CPU, Chương 3). Dùng khoá Redis để tránh <em>làm trùng việc</em> (hiệu quả). Còn với <em>tính đúng</em> — tiền, ghế, tồn kho — hãy để CSDL ép: khoá dòng, update có điều kiện, ràng buộc duy nhất, idempotency key, fencing token. Bài viết của Martin Kleppmann bên dưới là lời giải thích kinh điển, kể cả vì sao Redlock nhiều nút không đổi được điều này.</p>
</div>

<h3>Đi tiếp ở đâu</h3>
<p>Khoá PostgreSQL đo lost update, hàng đợi việc bằng <code>FOR UPDATE</code>/<code>NOWAIT</code>/<code>SKIP LOCKED</code> và một deadlock thật ở bài 11.4; DBI202 dạy giao dịch và ACID cho kỳ thi. Chương 6 của khoá này đi phía deadlock: chuyện gì xảy ra khi hai khoá dòng kiểu này được lấy theo thứ tự ngược nhau.</p>
${L(PG11, '🐘', 'PostgreSQL · 11.4 — Khoá dòng, lost update và deadlock', 'FOR UPDATE, NOWAIT, SKIP LOCKED và một deadlock thật, đo đạc đầy đủ.', 'Mở')}
${L(DBI8, '🎓', 'DBI202 · Giao dịch &amp; ACID', 'Góc nhìn thi cử về giao dịch, mức cô lập và khoá.', 'Mở')}

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> sau một đợt flash sale trên trang bán vé của bạn, bộ phận hỗ trợ báo hai ghế bị bán cho mỗi ghế hai người và ba khách bị trừ tiền hai lần cho một đơn. Bạn có SQL đặt ghế và SQL thanh toán. Hãy tái hiện cả hai, rồi chứng minh cách sửa của bạn.</p>
<ol>
<li>Dựng một CSDL vứt đi: <code>docker run -d --rm --label oslab=1 --name os-pg5 -e POSTGRES_HOST_AUTH_METHOD=trust -v "$PWD/ch05":/lab/ch05 postgres:17</code>, rồi <code>docker exec -it -u postgres -w /lab/ch05 os-pg5 bash</code>.</li>
<li>Nạp <code>schema.sql</code> và chạy <code>book-naive.sql</code> hai lần song song (alice và bob, có <code>&amp;</code>). Xem dòng dữ liệu. Làm lại với <code>book-lock.sql</code> và, trong lúc bob chờ, truy vấn <code>pg_stat_activity</code> tìm <code>wait_event_type = 'Lock'</code>.</li>
<li>Chạy <code>book-cond.sql</code> hai lần song song. Số dòng của lần thứ hai nói gì với app?</li>
<li>Chạy <code>pay.sql</code> hai lần, xem số dư và các khoản thanh toán; nạp lại lược đồ rồi chạy <code>pay-idem.sql</code> hai lần với <em>cùng</em> một key, rồi một lần với key <em>khác</em>. Giải thích từng số dư.</li>
<li>(Tuỳ chọn) Trong một container <code>redis:7</code>, tái hiện kịch bản hết hạn khoá bằng <code>SET … NX PX 2000</code>, <code>sleep 2.5</code> và một lệnh <code>DEL</code> ngây thơ; rồi nhả khoá bằng <code>unlock.lua</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đã tái hiện được đặt ghế trùng và trừ tiền hai lần, sửa từng cái (FOR UPDATE hoặc update có điều kiện; idempotency key), và giải thích được vì sao riêng khoá Redis thì không bảo vệ được tiền. Xoá container khi xong (<code>docker rm -f os-pg5</code>).</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['check-then-act (kiểm-rồi-làm)', 'Đọc một điều kiện rồi hành động ở một bước riêng — có race trừ khi gộp hai bước thành một thao tác nguyên tử.'],
  ['SELECT … FOR UPDATE', 'Đọc các dòng và khoá chúng tới khi giao dịch kết thúc; người khoá sau phải chờ, rồi thấy phiên bản mới nhất.'],
  ['conditional update (update có điều kiện)', 'UPDATE … WHERE &lt;vẫn còn hợp lệ&gt;: compare-and-swap của CSDL; 0 dòng nghĩa là bạn thua.'],
  ['idempotency key (khoá luỹ đẳng)', 'Khoá duy nhất do client chọn cho mỗi thao tác; máy chủ làm thao tác đúng một lần mỗi khoá và phát lại kết quả.'],
  ['at-least-once delivery (giao ít nhất một lần)', 'Gửi lại và hàng đợi có thể giao cùng một yêu cầu nhiều lần; bên nhận phải chịu được bản trùng.'],
  ['distributed lock / lease (khoá phân tán / hợp đồng thuê)', 'Khoá trong một kho chung (Redis) có thời hạn; chỉ giữ được khi người giữ không bị dừng quá TTL.'],
  ['fencing token', 'Số tăng dần cấp kèm mỗi lần cấp khoá; tài nguyên từ chối lệnh ghi mang token cũ hơn.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Trong backend, yêu cầu là luồng và dòng dữ liệu là bộ nhớ chung; một tiến trình Node một luồng vẫn đặt trùng qua một <code>await</code>.</li>
<li>Đo trong PostgreSQL 17: đọc-kiểm-ghi bán một ghế cho hai người; <code>FOR UPDATE</code> hoặc <code>UPDATE … WHERE booked_by IS NULL</code> có điều kiện sửa được.</li>
<li>Bản trùng của cùng một yêu cầu (gửi lại, bấm hai lần, giao lại) trừ tiền hai lần; idempotency key dưới ràng buộc duy nhất, trong cùng giao dịch, trừ một lần và phát lại câu trả lời.</li>
<li>Khoá Redis <code>SET NX PX</code> có hết hạn: một người giữ khoá bị dừng dẫn tới hai người cùng giữ; nhả khoá có so token và fencing token bịt khe hở đó.</li>
<li>Luật: khoá Redis cho hiệu quả, ràng buộc và khoá của CSDL cho tính đúng.</li>
</ul>
${L('https://www.postgresql.org/docs/current/explicit-locking.html', '🐘', 'Tài liệu PostgreSQL — Explicit Locking', 'Các chế độ khoá dòng, FOR UPDATE/FOR SHARE, deadlock, advisory lock.', 'Mở')}
${L('https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html', '🔒', 'Kleppmann — How to do distributed locking', 'Vì sao hết hạn khoá phá vỡ loại trừ lẫn nhau, và fencing token.', 'Mở')}
${L('https://docs.stripe.com/api/idempotent_requests', '💳', 'Stripe — Idempotent requests', 'Một API thanh toán thật dùng header Idempotency-Key ra sao.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 5.5 — Quiz ───────────────────────── */
    {
      title: '5.5 — Chapter 5 check|||5.5 — Kiểm tra Chương 5',
      slug: 'os-5-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống về đồng bộ: counter++ mất cập nhật, vì sao lỗi trốn khi một lõi, futex, spinlock khi luồng nhiều hơn lõi, chờ điều kiện bằng while, semaphore và pool kết nối, volatile, FOR UPDATE, idempotency key và khoá Redis hết hạn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Check</span>
<h2>Can you find the race and pick the right lock?</h2>
<p class="lead">Ten scenario questions, every one built on a number measured in this chapter. Most ask "what explains this output" or "which fix is actually correct" — because in a code review or an incident, that is the question.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain, with load/add/store, why counter++ loses updates — and why one core or -O2 can hide it.</li>
<li>I know when a mutex enters the kernel (futex) and why a spinlock collapses when threads outnumber cores.</li>
<li>I always wait on a condition variable in a while loop and can say why.</li>
<li>I can tell a visibility bug from a lost update, and what volatile does (and does not) do in Java and in C.</li>
<li>I can fix double booking and double charging in SQL, and explain why a Redis lock with a TTL is not enough for money.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Kiểm tra</span>
<h2>Bạn có tìm ra race và chọn đúng khoá không?</h2>
<p class="lead">Mười câu tình huống, câu nào cũng dựng trên một con số đã đo trong chương này. Phần lớn hỏi "điều gì giải thích output này" hoặc "cách sửa nào thật sự đúng" — vì khi review code hay xử lý sự cố, đó chính là câu hỏi.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được, bằng nạp/cộng/ghi, vì sao counter++ mất cập nhật — và vì sao một lõi hay -O2 có thể giấu nó.</li>
<li>Tôi biết khi nào mutex vào nhân (futex) và vì sao spinlock sụp khi luồng nhiều hơn lõi.</li>
<li>Tôi luôn chờ biến điều kiện trong vòng while và nói được vì sao.</li>
<li>Tôi phân biệt được lỗi tầm nhìn với mất cập nhật, và biết volatile làm (và không làm) gì trong Java và trong C.</li>
<li>Tôi sửa được đặt ghế trùng và trừ tiền hai lần bằng SQL, và giải thích được vì sao một khoá Redis có TTL không đủ để bảo vệ tiền.</li>
</ul>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          { question: 'Four threads each run <code>counter++</code> one million times on a shared <code>long</code>, no lock, on a 10-core machine. The program prints <code>got=1199378</code>, and a different number every run. Why?|||Bốn luồng, mỗi luồng chạy <code>counter++</code> một triệu lần trên một biến <code>long</code> dùng chung, không khoá, trên máy 10 lõi. Chương trình in <code>got=1199378</code>, mỗi lần chạy một số khác. Vì sao?',
            options: ['The counter overflowed|||Biến đếm bị tràn số', 'Some threads never started|||Vài luồng không bao giờ khởi động', 'counter++ is load, add, store; when threads interleave those steps, one store overwrites another and increments are lost|||counter++ là nạp, cộng, ghi; khi các luồng chạy xen kẽ các bước đó, lần ghi này đè lần ghi kia và các lần tăng bị mất', 'printf is buffered and prints an old value|||printf có đệm nên in ra giá trị cũ'],
            correctIndex: 2, points: 1,
            explanation: 'EN: Two threads can both load the same value, both add 1 and both store it — memory goes up by one for two increments. With real parallelism that happens constantly (≈70% lost in our run) and the exact loss depends on timing, hence a different number each run. A long cannot overflow at 4 million, and all threads ran: one thread alone was exact.|||VI: Hai luồng có thể cùng nạp một giá trị, cùng cộng 1 và cùng ghi — bộ nhớ chỉ tăng một cho hai lần tăng. Với song song thật điều đó xảy ra liên tục (mất ≈70% trong lần chạy của ta) và lượng mất phụ thuộc thời điểm, nên mỗi lần một số khác. Một long không thể tràn ở 4 triệu, và mọi luồng đều đã chạy: chạy một luồng thì chính xác.' },
          { question: 'The same racy program, pinned with <code>taskset -c 0</code> (one core), prints exactly 4,000,000 every time you try. What should you conclude?|||Cùng chương trình có race đó, ghim bằng <code>taskset -c 0</code> (một lõi), lần nào thử cũng in đúng 4.000.000. Bạn nên kết luận gì?',
            options: ['The race is still there; on one core a thread is rarely preempted exactly between load and store, so the bug only became rare|||Race vẫn còn; trên một lõi luồng hiếm khi bị ngắt đúng giữa nạp và ghi, nên lỗi chỉ trở nên hiếm', 'Running on one core fixes data races, so deploy with taskset|||Chạy một lõi sửa được data race, nên hãy deploy với taskset', 'taskset adds a hidden mutex around global variables|||taskset thêm một mutex ẩn quanh biến toàn cục', 'The original bug was a compiler bug that taskset avoids|||Lỗi gốc là lỗi trình biên dịch mà taskset né được'],
            correctIndex: 0, points: 1,
            explanation: 'EN: On one core threads take turns and are interrupted only at the end of a time slice; the chance that this lands exactly between ldr and str is tiny but not zero. Nothing was synchronised, so it is still a race — just one that will appear rarely, which is worse to debug. taskset only restricts which CPUs may run the threads.|||VI: Trên một lõi các luồng thay phiên và chỉ bị ngắt khi hết lát thời gian; xác suất điều đó rơi đúng giữa ldr và str rất nhỏ nhưng không bằng không. Không có gì được đồng bộ, nên vẫn là race — chỉ là thứ hiếm khi hiện, còn khó gỡ hơn. taskset chỉ giới hạn CPU nào được chạy các luồng.' },
          { question: 'A mobile app times out waiting for <code>POST /pay</code> and retries. The customer is charged twice for one order. Which fix actually prevents this?|||App di động hết thời gian chờ <code>POST /pay</code> và gửi lại. Khách bị trừ tiền hai lần cho một đơn. Cách sửa nào thật sự ngăn được chuyện này?',
            options: ['Wrap the charge in <code>SELECT … FOR UPDATE</code> on the wallet row|||Bọc lệnh trừ tiền trong <code>SELECT … FOR UPDATE</code> trên dòng ví', 'Take a Redis lock named after the order during the charge|||Lấy một khoá Redis mang tên đơn hàng trong lúc trừ tiền', 'Increase the client timeout so it retries less|||Tăng thời gian chờ của client để nó ít gửi lại hơn', 'The client sends an idempotency key; the server records it under a unique constraint in the same transaction as the charge and replays the stored response for repeats|||Client gửi một idempotency key; máy chủ ghi nó dưới ràng buộc duy nhất trong cùng giao dịch với lệnh trừ tiền và phát lại câu trả lời đã lưu cho các lần lặp'],
            correctIndex: 3, points: 1,
            explanation: 'EN: The two requests are legitimate copies of the same operation; even executed one after the other, both would charge (our run: balance 100 → 40, two payment rows). A row lock or a Redis lock only serialises them. Only remembering "this key was already done" — atomically with the charge — makes the second a no-op (our run: 70, one payment, response replayed). A longer timeout reduces retries but cannot eliminate them.|||VI: Hai yêu cầu là hai bản sao hợp lệ của cùng một thao tác; kể cả chạy lần lượt, cả hai vẫn trừ tiền (lần chạy của ta: số dư 100 → 40, hai dòng thanh toán). Khoá dòng hay khoá Redis chỉ bắt chúng xếp hàng. Chỉ có ghi nhớ "khoá này đã làm rồi" — nguyên tử cùng lệnh trừ tiền — mới biến lần thứ hai thành không làm gì (lần chạy của ta: 70, một khoản thanh toán, câu trả lời được phát lại). Thời gian chờ dài hơn giảm số lần gửi lại nhưng không loại bỏ được.' },
          { question: '<code>strace -f -c -e trace=futex</code> on 4 threads doing 10 million <code>pthread_mutex_lock/unlock</code> pairs shows about 6,700 futex calls. What does this tell you?|||<code>strace -f -c -e trace=futex</code> trên 4 luồng làm 10 triệu cặp <code>pthread_mutex_lock/unlock</code> cho thấy khoảng 6.700 lời gọi futex. Điều này nói gì?',
            options: ['Every lock operation is a system call, strace just samples them|||Mọi thao tác khoá đều là syscall, strace chỉ lấy mẫu', 'Locking is an atomic instruction in user space; the kernel (futex) is entered only to sleep or wake a thread when the lock is contended|||Khoá là một lệnh nguyên tử ở user space; chỉ vào nhân (futex) để ngủ hoặc đánh thức luồng khi khoá bị tranh chấp', 'The mutex was broken and skipped most locks|||Mutex bị hỏng và bỏ qua phần lớn lần khoá', 'futex is only used for unlock|||futex chỉ dùng cho unlock'],
            correctIndex: 1, points: 1,
            explanation: 'EN: A Linux mutex is a futex: the fast path is a compare-and-swap with no syscall; only a thread that finds the lock taken calls futex(FUTEX_WAIT), and unlock calls FUTEX_WAKE only if someone sleeps. So about 0.07% of operations entered the kernel, and the result was still exactly right. With one thread there was a single futex call in total.|||VI: Mutex của Linux là futex: đường nhanh là một compare-and-swap không có syscall; chỉ luồng thấy khoá đã bị giữ mới gọi futex(FUTEX_WAIT), và unlock chỉ gọi FUTEX_WAKE nếu có ai đang ngủ. Vì thế khoảng 0,07% thao tác vào nhân, và kết quả vẫn đúng tuyệt đối. Với một luồng, tổng cộng chỉ có một lời gọi futex.' },
          { question: '32 threads share a counter on a 10-core machine. With a mutex: 0.50 s wall. With a spinlock: 7.45 s wall and 66.7 s of user CPU. Best explanation?|||32 luồng dùng chung một biến đếm trên máy 10 lõi. Với mutex: 0,50 giây. Với spinlock: 7,45 giây và 66,7 giây CPU user. Giải thích đúng nhất?',
            options: ['With more threads than cores the lock holder is often descheduled, and every waiter spins through its whole time slice doing nothing; mutex waiters sleep and let the holder run|||Khi luồng nhiều hơn lõi, người giữ khoá thường bị đẩy khỏi CPU, và mọi người chờ quay hết lát thời gian mà không làm được gì; người chờ mutex thì ngủ và nhường người giữ khoá chạy', 'The spinlock makes a system call on every lock|||Spinlock gọi syscall ở mỗi lần khoá', 'The spinlock produced a wrong total and had to retry|||Spinlock cho tổng sai và phải chạy lại', 'The mutex used more cores, so it finished sooner|||Mutex dùng nhiều lõi hơn nên xong sớm hơn'],
            correctIndex: 0, points: 1,
            explanation: 'EN: Spinning is only cheap when the holder is running on another core and will release within nanoseconds. Oversubscribed, the holder may be off-CPU for a whole time slice while nine cores spin — 66.7 s of CPU burned. Both gave the correct total; the spinlock makes no syscalls at all (0.02 s kernel), which is exactly why it cannot get out of the way.|||VI: Quay vòng chỉ rẻ khi người giữ khoá đang chạy trên lõi khác và sẽ nhả trong vài nano giây. Khi quá tải luồng, người giữ có thể nằm ngoài CPU cả một lát thời gian trong khi chín lõi quay — đốt 66,7 giây CPU. Cả hai cho tổng đúng; spinlock không gọi syscall nào (0,02 giây trong nhân), và chính vì thế nó không biết tránh đường.' },
          { question: 'A consumer does <code>pthread_mutex_lock(&amp;mu); if (count == 0) pthread_cond_wait(&amp;not_empty, &amp;mu); take(); …</code> and producers use <code>pthread_cond_broadcast</code>. What is wrong?|||Một consumer làm <code>pthread_mutex_lock(&amp;mu); if (count == 0) pthread_cond_wait(&amp;not_empty, &amp;mu); take(); …</code> và producer dùng <code>pthread_cond_broadcast</code>. Sai ở đâu?',
            options: ['Nothing — the mutex protects take()|||Không sai gì — mutex đã bảo vệ take()', 'It should use a spinlock instead of a condition variable|||Nên dùng spinlock thay cho biến điều kiện', 'After waking, the buffer may be empty again (another consumer took the item first, or a spurious wakeup), so the condition must be re-checked in a while loop|||Sau khi tỉnh dậy, bộ đệm có thể lại rỗng (consumer khác đã lấy trước, hoặc đánh thức giả), nên phải kiểm lại điều kiện trong vòng while', 'pthread_cond_wait keeps the mutex locked while sleeping, so producers deadlock|||pthread_cond_wait giữ mutex trong lúc ngủ, nên producer bị deadlock'],
            correctIndex: 2, points: 1,
            explanation: 'EN: Our pc.c measured it: with if, consumers woke to an empty buffer tens of thousands of times; with while, zero. broadcast wakes every sleeper but only one gets the item, and POSIX allows spurious wakeups. cond_wait does release the mutex while sleeping — that is its whole point — so there is no deadlock.|||VI: pc.c của ta đã đo: với if, consumer tỉnh dậy trước bộ đệm rỗng hàng chục nghìn lần; với while thì không lần nào. broadcast đánh thức mọi người đang ngủ nhưng chỉ một người lấy được phần tử, và POSIX cho phép đánh thức giả. cond_wait có nhả mutex trong lúc ngủ — đó chính là mục đích của nó — nên không có deadlock.' },
          { question: 'Your service has a DB connection pool of 3. Ten requests arrive at once, each needs a connection for 100 ms. What happens?|||Dịch vụ của bạn có pool kết nối CSDL bằng 3. Mười yêu cầu đến cùng lúc, mỗi cái cần một kết nối trong 100 ms. Chuyện gì xảy ra?',
            options: ['Seven requests fail immediately with an error|||Bảy yêu cầu thất bại ngay với một lỗi', 'All ten run together; the pool size is only a hint|||Cả mười chạy cùng lúc; cỡ pool chỉ là gợi ý', 'All finish in about 100 ms because the database is fast|||Tất cả xong trong khoảng 100 ms vì CSDL nhanh', 'At most three run at once and the rest wait their turn, so the last finishes after roughly four waves ≈ 400 ms|||Tối đa ba chạy cùng lúc, số còn lại chờ tới lượt, nên cái cuối xong sau khoảng bốn đợt ≈ 400 ms'],
            correctIndex: 3, points: 1,
            explanation: 'EN: A pool behaves like a counting semaphore initialised to 3: sem.c measured peak 3 and ≈ 404 ms (⌈10/3⌉ = 4 waves × 100 ms) vs 101 ms with no limit. Requests wait rather than fail (until the pool’s acquire timeout), which is why an undersized pool shows up as latency.|||VI: Pool hành xử như một semaphore đếm khởi tạo bằng 3: sem.c đo được đỉnh 3 và ≈ 404 ms (⌈10/3⌉ = 4 đợt × 100 ms) so với 101 ms khi không giới hạn. Yêu cầu chờ chứ không lỗi (tới khi hết thời hạn lấy kết nối của pool), vì thế pool quá nhỏ hiện ra thành độ trễ.' },
          { question: 'A background thread runs <code>while (running) { work(); }</code>. On shutdown another thread sets <code>running = false</code>, but the loop never ends. <code>running</code> is a plain <code>boolean</code> field. Correct fix?|||Một luồng nền chạy <code>while (running) { work(); }</code>. Khi tắt, luồng khác đặt <code>running = false</code>, nhưng vòng lặp không bao giờ dừng. <code>running</code> là một trường <code>boolean</code> thường. Cách sửa đúng?',
            options: ['Make the field static|||Cho trường thành static', 'Declare it <code>volatile</code> (or use <code>AtomicBoolean</code>) so the write is guaranteed visible to the looping thread|||Khai báo nó <code>volatile</code> (hoặc dùng <code>AtomicBoolean</code>) để lần ghi chắc chắn hiện ra với luồng đang lặp', 'Make the field an <code>int</code> instead of a <code>boolean</code>|||Đổi trường thành <code>int</code> thay vì <code>boolean</code>', 'Make only the setter <code>synchronized</code>|||Chỉ cho setter thành <code>synchronized</code>'],
            correctIndex: 1, points: 1,
            explanation: 'EN: This is a visibility bug, not a lost update: the JIT may hoist the read of a non-volatile field out of a hot loop (Stop.java hung until timeout, exit 124; the volatile version stopped). volatile creates a happens-before edge between the write and later reads. Synchronising only the writer gives the reader no such edge; the field type and static do not matter.|||VI: Đây là lỗi tầm nhìn, không phải mất cập nhật: JIT được phép kéo lệnh đọc một trường không volatile ra khỏi vòng lặp nóng (Stop.java treo tới khi hết giờ, exit 124; bản volatile thì dừng). volatile tạo một cạnh happens-before giữa lần ghi và các lần đọc sau. Chỉ đồng bộ bên ghi thì bên đọc không có cạnh nào; kiểu dữ liệu hay static chẳng liên quan.' },
          { question: 'A booking handler does <code>SELECT booked_by … WHERE seat=\'A7\'</code>; if it is NULL the app does some work and then <code>UPDATE … SET booked_by = $user</code>, all inside one transaction at READ COMMITTED. Two users both get "booked". Which change makes it correct?|||Một handler đặt ghế làm <code>SELECT booked_by … WHERE seat=\'A7\'</code>; nếu NULL thì app làm vài việc rồi <code>UPDATE … SET booked_by = $user</code>, tất cả trong một giao dịch ở READ COMMITTED. Hai người đều được "đã đặt". Thay đổi nào làm nó đúng?',
            options: ['Nothing more is needed — it is already inside a transaction|||Không cần gì thêm — nó đã nằm trong một giao dịch rồi', 'Cache the seat status in Redis and read it from there|||Lưu trạng thái ghế vào Redis và đọc từ đó', 'Read with <code>SELECT … FOR UPDATE</code>, or replace both steps with <code>UPDATE … WHERE seat=\'A7\' AND booked_by IS NULL</code> and treat 0 rows as "taken"|||Đọc bằng <code>SELECT … FOR UPDATE</code>, hoặc thay cả hai bước bằng <code>UPDATE … WHERE seat=\'A7\' AND booked_by IS NULL</code> và coi 0 dòng là "đã có người"', 'Retry the transaction if it fails|||Thử lại giao dịch nếu thất bại'],
            correctIndex: 2, points: 1,
            explanation: 'EN: Our naive script already used BEGIN/COMMIT and still double-booked: a plain SELECT takes no lock, so both sessions saw NULL. FOR UPDATE makes the second session wait and then re-read the latest row; the conditional UPDATE puts the check inside the write (the database’s compare-and-swap). A Redis cache adds a second copy of the truth; nothing failed, so there is nothing to retry.|||VI: Kịch bản ngây thơ của ta đã dùng BEGIN/COMMIT mà vẫn đặt trùng: SELECT thường không lấy khoá, nên cả hai phiên đều thấy NULL. FOR UPDATE bắt phiên thứ hai chờ rồi đọc lại dòng mới nhất; UPDATE có điều kiện đặt phép kiểm vào trong lệnh ghi (compare-and-swap của CSDL). Cache Redis thêm một bản sao thứ hai của sự thật; không có gì thất bại nên chẳng có gì để thử lại.' },
          { question: 'Worker A takes a Redis lock with <code>SET lock worker-A NX PX 2000</code>, then pauses 2.5 s (GC). Meanwhile B takes the lock. A resumes, finishes and runs <code>DEL lock</code>; then C takes the lock. What went wrong, and what is the fix?|||Worker A lấy khoá Redis bằng <code>SET lock worker-A NX PX 2000</code>, rồi bị dừng 2,5 giây (GC). Trong lúc đó B lấy khoá. A chạy tiếp, làm xong và chạy <code>DEL lock</code>; rồi C lấy khoá. Sai ở đâu, và sửa thế nào?',
            options: ['A’s lease expired, so B legitimately held the lock and A’s DEL removed B’s lock — B and C now both hold it. Release only if the token is still yours (atomic Lua), and make the resource reject stale holders with fencing tokens or DB constraints|||Hợp đồng của A đã hết hạn, nên B giữ khoá hợp lệ và lệnh DEL của A xoá mất khoá của B — giờ B và C cùng giữ. Chỉ nhả khi token vẫn là của mình (Lua nguyên tử), và để tài nguyên từ chối người giữ cũ bằng fencing token hoặc ràng buộc CSDL', 'Nothing — Redis is single-threaded, so its locks are always safe|||Không sai gì — Redis đơn luồng nên khoá của nó luôn an toàn', 'Redis lost the key because persistence was off; enable AOF|||Redis mất khoá vì tắt lưu trữ bền; hãy bật AOF', 'Use a longer TTL; with 60 s this cannot happen|||Dùng TTL dài hơn; với 60 giây chuyện này không thể xảy ra'],
            correctIndex: 0, points: 1,
            explanation: 'EN: Our c54-redis run shows exactly this: PTTL -2 after the pause, B gets OK, A’s DEL returns 1, C gets OK. Redis being single-threaded makes each command atomic, not your critical section; the key expired on purpose, not because of persistence; and a longer TTL only makes a longer pause necessary — pauses have no upper bound. The token-checked unlock returned 0 for A, and the fenced write rejected token 1 after token 2.|||VI: Lần chạy c54-redis của ta cho thấy đúng thế: PTTL -2 sau lần dừng, B nhận OK, DEL của A trả 1, C nhận OK. Redis đơn luồng chỉ làm mỗi lệnh nguyên tử, không làm vùng găng của bạn nguyên tử; khoá hết hạn đúng như được đặt, không phải do lưu trữ bền; còn TTL dài hơn chỉ đòi một lần dừng dài hơn — mà lần dừng thì không có giới hạn trên. Lệnh nhả có so token trả 0 cho A, và lệnh ghi có fencing từ chối token 1 sau token 2.' },
        ],
      },
    },
  ],
};
