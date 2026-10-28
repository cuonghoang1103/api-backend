/**
 * Operating Systems for Developers — Chương 4: Tự viết chương trình đồng thời (soạn 29/10/2026 theo _HOP-DONG.md).
 * Chủ kênh: "máy tính chạy nhiều việc cùng lúc bằng cách nào… nên để tôi tự viết tiến trình xử lý song song" ⇒ chương
 * THỰC HÀNH: cùng một việc CPU (đếm số nguyên tố) và cùng một việc I/O (gọi API chậm slow.js) viết bằng C, Java, Node,
 * Python; đo speedup theo số lõi (taskset, lấy lần nhanh nhất trong 3 vì máy soạn bài dùng chung), Amdahl/Gustafson,
 * false sharing, chọn số luồng, đường ống có giới hạn, map-reduce, huỷ/hạn chờ; dự án cuối: phân tích log song song
 * bằng Java và Node. Mỗi bài kết thúc bằng một bài "tự viết" + lời giải mẫu trong lab/code/ch04/giai/.
 *
 * Output CHẠY THẬT trong ảnh `os-lab` (lab/code/ch04/c4*.sh → lab/out/c4*.out.txt). Chạy lại (từ thư mục lab/):
 *   docker run --rm --label oslab=1 --hostname oslab --tmpfs /data:size=600m -v "$PWD/code/ch04":/lab/ch04 -w /lab/ch04 \
 *     os-lab bash -c "phien <kb>.sh 2>&1" > out/<kb>.out.txt
 * (chạy TUẦN TỰ từng kịch bản — chúng đo thời gian, chạy song song là tự làm nhiễu số đo.)
 * Không nhắc lại Ch3 (luồng/lập lịch/event loop vs pool), Ch5 (race, khoá), Ch6 (deadlock), Ch10 (epoll, C10K) — trỏ sang.
 * LUẬT escaping: < > → &lt; &gt;; & → &amp;; không backtick trần; ${ của bash → \${.
 */
import { run, src, card, kv, cmd } from './_ui.mjs';
import { lab } from './_lab.mjs';
import G41 from './giang/os-04-1.mjs';
import G42 from './giang/os-04-2.mjs';
import G43 from './giang/os-04-3.mjs';
import G44 from './giang/os-04-4.mjs';
import G45 from './giang/os-04-5.mjs';
import G46 from './giang/os-04-6.mjs';
import G47 from './giang/os-04-7.mjs';
import G48 from './giang/os-04-8.mjs';

const L = (href, ico, t, s, cta) => card(href, ico, t, s, cta);
const OS = (slug) => '/courses/operating-systems-for-developers/learn?lessonSlug=' + slug;
const OSG = (slug) => '/courses/operating-systems/learn?lessonSlug=' + slug;

export default {
  title: 'Chapter 4 — Writing concurrent programs|||Chương 4 — Tự viết chương trình đồng thời',
  description: 'Bạn tự viết chương trình đồng thời và song song rồi đo tốc độ và cái giá: cùng một việc CPU và một việc I/O viết bằng C (fork, pthreads, hàng đợi việc), Java (Thread, ExecutorService, CompletableFuture, parallelStream, virtual threads), Node (worker_threads, cluster, Promise.all) và Python (GIL, multiprocessing, asyncio); định luật Amdahl và Gustafson đo trên đường speedup thật, false sharing, chọn số luồng, đường ống có giới hạn, map-reduce, huỷ và hạn chờ; dự án cuối là bộ phân tích log song song bằng Java và Node.',
  lessons: [
    /* ───────────────────────── 4.1 — C ───────────────────────── */
    {
      title: '4.1 — C: fork, pthreads and a work queue — speedup measured core by core|||4.1 — C: fork, pthreads và hàng đợi việc — đo speedup từng lõi một',
      slug: 'os-4-1-pthreads',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Đếm số nguyên tố dưới 20 triệu bằng ba cách trong C — fork + wait qua pipe, pthreads chia khối cố định, pthreads + hàng đợi việc — đo trên 1–10 lõi: hàng đợi đạt 7,9×, khối cố định 6,1× vì luồng chậm nhất quyết định; bài tự viết: Mandelbrot chia tĩnh vs động (1 201 vs 661 ms).',
      content: `${G41}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Write it, split it, time it: your first parallel program</h2>
<p class="lead">Chapter 3 showed that Linux runs threads on cores. Now you are the one who decides how a job is cut up. The question of this lesson sounds simple and is not: <strong>you have one CPU-heavy job and 10 cores — how do you split it so that 10 cores really finish it close to 10 times faster, and why does it almost never reach 10?</strong> We answer it in C, the language closest to the kernel, with three programs you can read line by line.</p>

<h3>The job: count the primes below 20 million</h3>
<p>The workload of this whole chapter is deliberately boring: for every number below N, test whether it is prime by trial division. No files, no network — pure CPU. One function counts a range; everything else in the program is about who counts which range:</p>
${src('ch04/primes.c', 'c')}
${run('c41-c', 'gcc -O2 -Wall', 3)}
<p>One thread: 1 270 607 primes in about 2.1 s. Keep one property in mind: the work is <strong>uneven</strong>. Testing a prime near 20 million needs up to √n ≈ 2 236 trial divisions (by odd numbers, so about 1 100); near one million only about 500. Equal ranges of numbers are not equal amounts of work.</p>

<h3>Way 1: fork + wait — processes that report through a pipe</h3>
<p>The oldest way to use several cores on Unix: <code>fork()</code> four children, give each a quarter of the numbers, let each write its count into a pipe and <code>_exit</code>. The parent reads the results and then <code>wait()</code>s for every child, so none is left as a zombie (lesson 1.4):</p>
${run('c41-c', './primes fork 4')}
<p>Four children, four different finishing times: 305, 499, 617, 706 ms. The program is done when the <em>last</em> child is done. The child with the biggest numbers had the most work.</p>

<h3>Way 2: pthreads with fixed blocks — same staircase</h3>
<p>Threads instead of processes, the same four blocks. Each thread writes its count into its own slot of an array that <code>main</code> reads after <code>pthread_join</code> — no pipe needed, because threads share memory:</p>
${run('c41-c', './primes block 4')}
<p>The same staircase, 308 → 706 ms. Changing processes for threads did not change the problem, because the problem is the split.</p>

<h3>Way 3: pthreads + a work queue — whoever is free takes the next piece</h3>
<p>Cut the numbers into 2 000 chunks of 10 000. The "queue" is just a counter protected by a mutex: <code>take_chunk()</code> returns the next chunk number or −1. A thread that finishes a cheap chunk early simply comes back for another:</p>
${run('c41-c', './primes queue 4')}
<p>All four threads busy for 535 ms, each with about 500 chunks, finishing together. 535 ms instead of 706 ms on the same four cores — a quarter less time from nothing but the split. The mutex was taken 2 000 times in half a second: invisible. (A lock taken <em>millions</em> of times per second is a different story — that is lesson 5.2.)</p>

<h3>fork and pthread_create are the same system call</h3>
<p>What does the kernel actually do differently? Ask <code>strace</code>:</p>
${run('c41-c', 'strace -f -e trace=clone,clone3,wait4')}
${run('c41-c', 'strace -f -e trace=clone,clone3 ./primes queue')}
<p>Both are <code>clone()</code>. <code>fork</code> passes almost no sharing flags (just <code>SIGCHLD</code>, "tell my parent when I die"): the child gets its own copy of the address space. <code>pthread_create</code> passes <code>CLONE_VM | CLONE_FILES | CLONE_SIGHAND | CLONE_THREAD …</code>: the new task shares memory, the file table and the thread group (PID). That is lesson 3.1 seen from the system-call side. The <code>clone3 … ENOSYS</code> line is Docker's seccomp profile refusing the newer call; glibc quietly falls back to <code>clone</code> (Chapter 11).</p>

<h3>Speedup, core by core</h3>
<p><code>sweep.sh</code> runs a command pinned to 1, 2, 4… cores with <code>taskset</code>, three times per level, and keeps the fastest run — this Mac is shared with other work, so a slow run is usually somebody else's fault, not your program's:</p>
${src('ch04/sweep.sh', 'bash')}
${run('c41-c', './sweep.sh "./primes block')}
${run('c41-c', './sweep.sh "./primes queue')}
${run('c41-c', './sweep.sh "./primes fork')}
<p>The work queue stays near the ideal up to 6 cores (5.80×, 97% efficient) and reaches <strong>7.92× on 10</strong>. Fixed blocks and fork bend from the first step (1.60× on 2 cores: one thread has 2/3 of the work) and end at 6.13× and 6.50×. Why does even the queue lose efficiency after 8 cores? Look at the hardware: Docker's VM gets the 10 cores of an <strong>Apple M1 Max, which has 8 performance cores and 2 efficiency cores</strong> — the 9th and 10th threads land on slower cores — and the machine also runs other people's work. Lesson 4.5 adds the third reason, the serial parts of the program, and puts a formula on it.</p>
${lab('scheduler', 'multicore', 'en', 'Six jobs of different lengths on 1–4 cores: the finish time is set by the core that ends last. Change the core count and watch idle gaps appear when the split is uneven.', { tour: 'scheduler-start' })}
${lab('amdahl', 'hetero', 'en', 'Why even the work queue bends after 8 cores: switch between uniform cores and 8 P + 2 E cores and lower the E-core speed. The curve breaks at the 9th thread with no serial part at all — the hardware, not the program (a model, labelled as such).')}

<div class="pitfall co-tieu-de">
<p><strong>"I gave every thread the same number of items, so the work is balanced."</strong> Only if every item costs the same. Primes near 20 million, Mandelbrot rows through the black body, users with 10 000 orders vs users with 3, images of 40 MB vs 40 KB — real work is uneven far more often than not. Measured here: equal blocks wasted the first thread's core for 400 of 706 ms. Split into <em>many small pieces</em> and let free workers pull the next one; check by printing each worker's busy time, as <code>-v</code> does.</p>
</div>

<h3>Processes or threads?</h3>
<table>
<tr><th></th><th>fork (processes)</th><th>pthreads (threads)</th></tr>
<tr><td>Memory</td><td>a copy each (copy-on-write, Chapter 7)</td><td>shared: one heap, one set of globals</td></tr>
<tr><td>Getting results back</td><td>pipe, file, shared memory, exit code</td><td>write a variable (and avoid races, Chapter 5)</td></tr>
<tr><td>One worker crashes</td><td>only that child dies</td><td>the whole process dies</td></tr>
<tr><td>Who uses it</td><td>nginx workers, PostgreSQL backends, Node <code>cluster</code>, Python <code>multiprocessing</code></td><td>the JVM, Tomcat, Go's runtime, libuv's pool</td></tr>
</table>
<p>Speed did not separate them in this measurement — fork used fixed blocks and matched way 2. Choose by isolation and by how results must travel.</p>

<h3>✍️ Write it yourself: a Mandelbrot strip</h3>
<p>Render the Mandelbrot set at 1600 × 1200 (up to 2 000 iterations per pixel) with four pthreads, twice: (1) <em>static</em> — thread i gets rows <code>[i·H/T, (i+1)·H/T)</code>; (2) <em>dynamic</em> — a shared row counter, <code>atomic_fetch_add(&amp;next_row, 1)</code>, no mutex at all. Print each thread's busy time and a checksum (the sum of all iteration counts) — both versions must print the same checksum. Try it before opening the reference solution <code>lab/code/ch04/giai/mandel.c</code>:</p>
${run('c41-c', './mandel static 4 ascii')}
${run('c41-c', './mandel dynamic 4')}
${run('c41-c', './sweep.sh "./mandel dynamic')}
<p>Static: threads 1 and 2 hold the black body and run 1.2 s while threads 0 and 3 are done after 91 ms. Dynamic: 661 ms, everyone busy to the end, same checksum 765 456 517 — and 7.58× on 8 cores.</p>
${lab('amdahl', 'balance', 'en', 'Fixed equal blocks vs a shared queue on uneven work: compare the busy bars (primes 308/498/616/706 ms vs 535 ms each; Mandelbrot 91/1 199/1 201/91 vs 661). The run ends when the slowest thread ends — notice how much the queue saves with the same cores.')}

<h3>If you have done OSG202 lesson 2.2</h3>
<p>OSG202 asks you to name the benefits of multithreading — responsiveness, resource sharing, economy, scalability. Here "scalability" became a curve you measured, and you met the reason it bends that exam questions rarely mention: the split.</p>
${L(OSG('osg202-2-2-luong-dong-bo'), '🎓', 'OSG202 · 2.2 — Threads &amp; synchronization', 'The textbook view of threads and multicore programming.', 'Open')}

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a teammate parallelised a nightly report job with 8 threads and "only got 5×". They want to buy a bigger server. You suspect the split.</p>
<ol>
<li>In the lab, build <code>primes.c</code> and run <code>./primes block 8 20000000 -v</code> and <code>./primes queue 8 20000000 -v</code>. Write down the busy time of the fastest and the slowest thread in each.</li>
<li>Run <code>./sweep.sh "./primes block {k} 20000000" 1 2 4 8</code> and the same for <code>queue</code>. Plot both speedup curves (paper is fine).</li>
<li>Change <code>CHUNK</code> to 1 000 000 (only 20 chunks), rebuild, and sweep <code>queue</code> again. Then try 100. What happens at each extreme, and why?</li>
<li>Write your Mandelbrot program; compare static and dynamic with <code>-v</code>-style busy times.</li>
</ol>
<p><strong>Done when:</strong> you can show with busy times that fixed blocks leave cores idle, that the queue version is within ~10% of ideal on 4 cores, and you can explain why chunks that are too big (imbalance again) or too small (queue overhead) both hurt.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['speedup', 'Time on 1 core ÷ time on k cores. Ideal = k.'],
  ['efficiency (hiệu suất)', 'Speedup ÷ cores: how much of each extra core you actually used.'],
  ['static partitioning (chia tĩnh)', 'Each worker gets a fixed share decided up front; fair only if all items cost the same.'],
  ['work queue / dynamic partitioning (chia động)', 'Workers pull the next small piece when free; balances uneven work automatically.'],
  ['load imbalance (mất cân bằng tải)', 'Some workers finish early and sit idle while one still works; wall time = the slowest.'],
  ['clone()', 'The Linux system call behind both fork (share nothing) and pthread_create (share memory, files, PID).'],
  ['taskset', 'Runs a program on a chosen set of CPUs — the way to measure on 1…k cores.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>One CPU job, three ways in C: fork + pipe + wait, pthreads with fixed blocks, pthreads with a work queue.</li>
<li>Primes near 20 million cost more than primes near 1 million, so equal blocks finished at 308…706 ms; the queue finished all threads together at 535 ms.</li>
<li>Measured on 10 cores: queue 7.92×, fork 6.50×, fixed blocks 6.13× — the split mattered more than processes vs threads.</li>
<li>fork and pthread_create are both <code>clone()</code>; the flags decide what is shared.</li>
<li>Speedup also bends because of unequal cores (8 P + 2 E on this M1 Max), neighbours on the machine and serial parts (lesson 4.5).</li>
</ul>
${L('https://man7.org/linux/man-pages/man3/pthread_create.3.html', '📄', 'man 3 pthread_create', 'Creating and joining POSIX threads, with a complete example.', 'Open')}
${L('https://pages.cs.wisc.edu/~remzi/OSTEP/threads-api.pdf', '📘', 'OSTEP — Interlude: Thread API', 'pthread_create, join, locks and condition variables (free chapter).', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Viết, chia, bấm giờ: chương trình song song đầu tiên của bạn</h2>
<p class="lead">Chương 3 cho thấy Linux chạy các luồng trên các lõi. Giờ chính bạn là người quyết định một việc được cắt ra thế nào. Câu hỏi của bài nghe đơn giản mà không đơn giản: <strong>bạn có một việc nặng CPU và 10 lõi — chia thế nào để 10 lõi thật sự làm xong nhanh gần gấp 10, và vì sao gần như không bao giờ đạt 10?</strong> Ta trả lời bằng C, ngôn ngữ gần nhân nhất, với ba chương trình đọc được từng dòng.</p>

<h3>Việc cần làm: đếm số nguyên tố dưới 20 triệu</h3>
<p>Việc của cả chương này cố tình nhàm chán: với mỗi số dưới N, kiểm xem nó có phải số nguyên tố không bằng phép chia thử. Không file, không mạng — thuần CPU. Một hàm đếm một khoảng; mọi thứ còn lại trong chương trình chỉ là chuyện ai đếm khoảng nào:</p>
${src('ch04/primes.c', 'c')}
${run('c41-c', 'gcc -O2 -Wall', 3)}
<p>Một luồng: 1 270 607 số nguyên tố trong khoảng 2,1 s. Hãy nhớ một tính chất: việc này <strong>không đều</strong>. Kiểm một số nguyên tố gần 20 triệu cần tới √n ≈ 2 236 phép chia thử (chỉ chia cho số lẻ nên khoảng 1 100); gần một triệu thì chỉ khoảng 500. Các khoảng số bằng nhau không phải các phần việc bằng nhau.</p>

<h3>Cách 1: fork + wait — các tiến trình gửi kết quả qua pipe</h3>
<p>Cách lâu đời nhất để dùng nhiều lõi trên Unix: <code>fork()</code> bốn tiến trình con, mỗi con một phần tư dãy số, mỗi con ghi số đếm vào một pipe rồi <code>_exit</code>. Tiến trình cha đọc kết quả rồi <code>wait()</code> từng con để không đứa nào thành zombie (bài 1.4):</p>
${run('c41-c', './primes fork 4')}
<p>Bốn con, bốn thời điểm xong khác nhau: 305, 499, 617, 706 ms. Chương trình chỉ xong khi đứa con <em>cuối cùng</em> xong. Đứa nhận các số lớn nhất có nhiều việc nhất.</p>

<h3>Cách 2: pthreads chia khối cố định — vẫn cái bậc thang ấy</h3>
<p>Luồng thay cho tiến trình, vẫn bốn khối đó. Mỗi luồng ghi số đếm vào ô riêng của một mảng mà <code>main</code> đọc sau <code>pthread_join</code> — không cần pipe, vì các luồng dùng chung bộ nhớ:</p>
${run('c41-c', './primes block 4')}
<p>Vẫn bậc thang 308 → 706 ms. Đổi tiến trình sang luồng không đổi được vấn đề, vì vấn đề nằm ở cách chia.</p>

<h3>Cách 3: pthreads + hàng đợi việc — ai rảnh thì lấy mẩu kế tiếp</h3>
<p>Cắt dãy số thành 2 000 mẩu, mỗi mẩu 10 000 số. "Hàng đợi" chỉ là một bộ đếm được bảo vệ bằng mutex: <code>take_chunk()</code> trả về số thứ tự mẩu kế tiếp hoặc −1. Luồng nào làm xong sớm một mẩu rẻ thì quay lại lấy mẩu khác:</p>
${run('c41-c', './primes queue 4')}
<p>Cả bốn luồng bận 535 ms, mỗi luồng khoảng 500 mẩu, xong cùng lúc. 535 ms thay vì 706 ms trên cùng bốn lõi — bớt một phần tư thời gian chỉ nhờ cách chia. Mutex bị lấy 2 000 lần trong nửa giây: không thấy được. (Một khoá bị lấy <em>hàng triệu</em> lần mỗi giây là chuyện khác — đó là bài 5.2.)</p>

<h3>fork và pthread_create là cùng một lời gọi hệ thống</h3>
<p>Vậy nhân thật ra làm gì khác nhau? Hỏi <code>strace</code>:</p>
${run('c41-c', 'strace -f -e trace=clone,clone3,wait4')}
${run('c41-c', 'strace -f -e trace=clone,clone3 ./primes queue')}
<p>Cả hai đều là <code>clone()</code>. <code>fork</code> gần như không truyền cờ chia sẻ nào (chỉ <code>SIGCHLD</code>, "báo cho cha khi con chết"): con nhận bản sao riêng của không gian địa chỉ. <code>pthread_create</code> truyền <code>CLONE_VM | CLONE_FILES | CLONE_SIGHAND | CLONE_THREAD …</code>: task mới dùng chung bộ nhớ, bảng file và nhóm luồng (PID). Đó chính là bài 3.1 nhìn từ phía lời gọi hệ thống. Dòng <code>clone3 … ENOSYS</code> là hồ sơ seccomp của Docker từ chối lời gọi mới hơn; glibc lặng lẽ lùi về <code>clone</code> (Chương 11).</p>

<h3>Speedup, từng lõi một</h3>
<p><code>sweep.sh</code> chạy một lệnh ghim vào 1, 2, 4… lõi bằng <code>taskset</code>, mỗi mức ba lần, giữ lần nhanh nhất — máy Mac này dùng chung với việc khác, nên một lần chạy chậm thường là lỗi của người khác chứ không phải của chương trình bạn:</p>
${src('ch04/sweep.sh', 'bash')}
${run('c41-c', './sweep.sh "./primes block')}
${run('c41-c', './sweep.sh "./primes queue')}
${run('c41-c', './sweep.sh "./primes fork')}
<p>Hàng đợi việc bám sát lý tưởng tới 6 lõi (5,80×, hiệu suất 97%) và đạt <strong>7,92× trên 10 lõi</strong>. Khối cố định và fork bẻ cong ngay bước đầu (1,60× trên 2 lõi: một luồng ôm 2/3 việc) và dừng ở 6,13× và 6,50×. Vì sao ngay cả hàng đợi cũng mất hiệu suất sau 8 lõi? Nhìn phần cứng: VM của Docker nhận 10 lõi của một <strong>Apple M1 Max, gồm 8 lõi hiệu năng và 2 lõi tiết kiệm điện</strong> — luồng thứ 9 và 10 rơi vào lõi chậm hơn — và máy còn đang chạy việc của người khác. Bài 4.5 thêm lý do thứ ba, phần tuần tự của chương trình, và gắn cho nó một công thức.</p>
${lab('scheduler', 'multicore', 'vi', 'Sáu việc dài ngắn khác nhau trên 1–4 lõi: lúc xong là lúc lõi về đích cuối cùng xong. Đổi số lõi và xem các khoảng ngồi không hiện ra khi việc chia lệch.', { tour: 'scheduler-start' })}
${lab('amdahl', 'hetero', 'vi', 'Vì sao ngay cả hàng đợi việc cũng gãy sau 8 lõi: chuyển giữa lõi đều nhau và 8 lõi P + 2 lõi E, rồi hạ tốc độ lõi E. Đường cong gãy ở luồng thứ 9 dù không có phần tuần tự nào — do phần cứng, không do chương trình (đây là mô hình, có ghi rõ).')}

<div class="pitfall co-tieu-de">
<p><strong>"Tôi đã chia cho mỗi luồng số phần tử bằng nhau, vậy là việc đã cân."</strong> Chỉ đúng khi mọi phần tử tốn như nhau. Số nguyên tố gần 20 triệu, hàng Mandelbrot cắt qua thân đen, người dùng có 10 000 đơn hàng so với người có 3, ảnh 40 MB so với 40 KB — việc thật lệch nhau thường xuyên hơn nhiều so với đều. Đo được ở đây: chia khối bằng nhau đã bỏ phí lõi của luồng đầu tiên 400 trên 706 ms. Hãy chia thành <em>nhiều mẩu nhỏ</em> và để worker rảnh tự kéo mẩu kế tiếp; kiểm bằng cách in thời gian bận của từng worker như <code>-v</code> làm.</p>
</div>

<h3>Tiến trình hay luồng?</h3>
<table>
<tr><th></th><th>fork (tiến trình)</th><th>pthreads (luồng)</th></tr>
<tr><td>Bộ nhớ</td><td>mỗi đứa một bản sao (copy-on-write, Chương 7)</td><td>dùng chung: một heap, một bộ biến toàn cục</td></tr>
<tr><td>Đưa kết quả về</td><td>pipe, file, bộ nhớ chia sẻ, mã thoát</td><td>ghi vào một biến (và tránh race, Chương 5)</td></tr>
<tr><td>Một worker sập</td><td>chỉ đứa con đó chết</td><td>cả tiến trình chết</td></tr>
<tr><td>Ai dùng</td><td>worker của nginx, backend PostgreSQL, <code>cluster</code> của Node, <code>multiprocessing</code> của Python</td><td>JVM, Tomcat, runtime của Go, pool của libuv</td></tr>
</table>
<p>Trong phép đo này tốc độ không phân định được hai cách — fork dùng khối cố định và ngang cách 2. Hãy chọn theo mức cô lập và theo đường đi của kết quả.</p>

<h3>✍️ Tự viết: một dải Mandelbrot</h3>
<p>Vẽ tập Mandelbrot 1600 × 1200 (tối đa 2 000 vòng lặp mỗi điểm) bằng bốn pthread, hai lần: (1) <em>tĩnh</em> — luồng i nhận các hàng <code>[i·H/T, (i+1)·H/T)</code>; (2) <em>động</em> — một bộ đếm hàng chung, <code>atomic_fetch_add(&amp;next_row, 1)</code>, không cần mutex. In thời gian bận của từng luồng và một checksum (tổng mọi số vòng lặp) — hai bản phải in cùng một checksum. Tự làm trước rồi mới mở lời giải mẫu <code>lab/code/ch04/giai/mandel.c</code>:</p>
${run('c41-c', './mandel static 4 ascii')}
${run('c41-c', './mandel dynamic 4')}
${run('c41-c', './sweep.sh "./mandel dynamic')}
<p>Tĩnh: luồng 1 và 2 ôm phần thân đen và chạy 1,2 s trong khi luồng 0 và 3 xong sau 91 ms. Động: 661 ms, ai cũng bận tới cuối, cùng checksum 765 456 517 — và 7,58× trên 8 lõi.</p>
${lab('amdahl', 'balance', 'vi', 'Chia khối bằng nhau vs hàng đợi chung trên việc lệch: so các thanh bận (số nguyên tố 308/498/616/706 ms vs đều 535 ms; Mandelbrot 91/1 199/1 201/91 vs 661). Lượt chạy xong khi luồng chậm nhất xong — để ý hàng đợi tiết kiệm bao nhiêu trên cùng số lõi.')}

<h3>Nếu bạn đã học OSG202 bài 2.2</h3>
<p>OSG202 bắt bạn kể lợi ích của đa luồng — đáp ứng nhanh, dùng chung tài nguyên, tiết kiệm, khả năng mở rộng. Ở đây "khả năng mở rộng" thành một đường cong bạn tự đo, và bạn gặp lý do khiến nó bẻ cong mà đề thi ít khi nhắc: cách chia việc.</p>
${L(OSG('osg202-2-2-luong-dong-bo'), '🎓', 'OSG202 · 2.2 — Luồng &amp; đồng bộ hoá', 'Luồng và lập trình đa lõi theo giáo trình.', 'Mở')}

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một bạn trong nhóm song song hoá job báo cáo chạy đêm bằng 8 luồng và "chỉ được 5×". Bạn ấy muốn mua máy chủ to hơn. Bạn nghi là do cách chia.</p>
<ol>
<li>Trong lab, dịch <code>primes.c</code> rồi chạy <code>./primes block 8 20000000 -v</code> và <code>./primes queue 8 20000000 -v</code>. Ghi lại thời gian bận của luồng nhanh nhất và chậm nhất ở mỗi bản.</li>
<li>Chạy <code>./sweep.sh "./primes block {k} 20000000" 1 2 4 8</code> và tương tự cho <code>queue</code>. Vẽ hai đường speedup (giấy cũng được).</li>
<li>Đổi <code>CHUNK</code> thành 1 000 000 (chỉ còn 20 mẩu), dịch lại, sweep <code>queue</code> lần nữa. Rồi thử 100. Ở mỗi thái cực chuyện gì xảy ra, vì sao?</li>
<li>Viết chương trình Mandelbrot của bạn; so tĩnh và động bằng thời gian bận kiểu <code>-v</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chỉ ra bằng thời gian bận rằng khối cố định để lõi ngồi không, rằng bản hàng đợi cách lý tưởng không quá ~10% trên 4 lõi, và giải thích được vì sao mẩu quá to (lại mất cân bằng) hay quá nhỏ (tốn công lấy việc) đều hại.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['speedup (tăng tốc)', 'Thời gian trên 1 lõi ÷ thời gian trên k lõi. Lý tưởng = k.'],
  ['efficiency (hiệu suất)', 'Speedup ÷ số lõi: bạn thật sự dùng được bao nhiêu phần của mỗi lõi thêm vào.'],
  ['static partitioning (chia tĩnh)', 'Mỗi worker nhận phần cố định định sẵn từ đầu; chỉ công bằng khi mọi phần tử tốn như nhau.'],
  ['work queue / dynamic partitioning (hàng đợi việc / chia động)', 'Worker rảnh tự kéo mẩu nhỏ kế tiếp; tự cân việc lệch.'],
  ['load imbalance (mất cân bằng tải)', 'Vài worker xong sớm rồi ngồi không trong khi một worker vẫn làm; thời gian = của đứa chậm nhất.'],
  ['clone()', 'Lời gọi hệ thống Linux đứng sau cả fork (không chung gì) lẫn pthread_create (chung bộ nhớ, file, PID).'],
  ['taskset', 'Chạy chương trình trên một tập CPU chọn sẵn — cách để đo trên 1…k lõi.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một việc CPU, ba cách bằng C: fork + pipe + wait, pthreads chia khối cố định, pthreads với hàng đợi việc.</li>
<li>Số nguyên tố gần 20 triệu đắt hơn gần 1 triệu, nên các khối bằng nhau xong lệch nhau 308…706 ms; hàng đợi cho mọi luồng xong cùng lúc ở 535 ms.</li>
<li>Đo trên 10 lõi: hàng đợi 7,92×, fork 6,50×, khối cố định 6,13× — cách chia quan trọng hơn chuyện tiến trình hay luồng.</li>
<li>fork và pthread_create đều là <code>clone()</code>; cờ quyết định cái gì được dùng chung.</li>
<li>Speedup còn bẻ cong vì lõi không đều (8 P + 2 E trên M1 Max này), việc của người khác trên cùng máy và phần tuần tự (bài 4.5).</li>
</ul>
${L('https://man7.org/linux/man-pages/man3/pthread_create.3.html', '📄', 'man 3 pthread_create', 'Tạo và join luồng POSIX, có ví dụ đầy đủ.', 'Mở')}
${L('https://pages.cs.wisc.edu/~remzi/OSTEP/threads-api.pdf', '📘', 'OSTEP — Interlude: Thread API', 'pthread_create, join, khoá và biến điều kiện (chương miễn phí).', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 4.2 — Java ───────────────────────── */
    {
      title: '4.2 — Java: Thread, ExecutorService, CompletableFuture, parallelStream, virtual threads|||4.2 — Java: Thread, ExecutorService, CompletableFuture, parallelStream, virtual thread',
      slug: 'os-4-2-java',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Cùng bài đếm số nguyên tố viết bằng năm API của Java (4 lõi: Thread thô 726 ms vì mất cân bằng, các API chia task nhỏ ~550–590 ms), đường speedup của pool và parallelStream; 100 lời gọi API chậm: tuần tự 11,2 s, pool 10 luồng 1,16 s (định luật Little), virtual thread 172 ms với 46 luồng nền tảng; bài tự viết: Semaphore giới hạn 20 lời gọi.',
      content: `${G42}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>Five doors into parallel Java — and which one fits which job</h2>
<p class="lead">Spring Boot, Kafka consumers, batch jobs — most backend Java you will touch runs work in parallel through one of five APIs: a raw <code>Thread</code>, an <code>ExecutorService</code>, <code>CompletableFuture</code>, <code>parallelStream</code>, or (since Java 21) <strong>virtual threads</strong>. They look interchangeable in tutorials. They are not: this lesson puts the same CPU job and the same I/O job through all five and answers, with numbers, <strong>which one you should reach for when the work burns CPU, and which one when the work waits.</strong></p>

<h3>The CPU job in five APIs</h3>
<p>The prime count of lesson 4.1, ported line by line. Read <code>threads</code> (one block per thread, like way 2), <code>pool</code> (2 000 small <code>Callable</code>s on a fixed pool), <code>cf</code> (the same tasks as <code>CompletableFuture</code>s), <code>stream</code> (one line) and the virtual-thread executor:</p>
${src('ch04/Primes.java', 'java')}
<p>Each run is done twice in the same JVM — "cold" while the JIT compiler is still warming up, then "warm" — and we report the warm one. On one core, then on four (best of three runs each, with <code>best3.sh</code>):</p>
${run('c42-java', 'taskset -c 0 java Primes.java')}
${run('c42-java', 'for m in threads pool cf stream virtual')}
<p>One core: 2 155 ms. Four cores: raw threads with fixed blocks are the slowest at 726 ms — the imbalance of lesson 4.1, in Java. Every API that cuts the job into many small tasks lands at 551–587 ms, about 3.8×. On CPU work, <em>which</em> API matters much less than <em>how small the pieces are</em>.</p>

<h3>Speedup of a pool and of parallelStream</h3>
${run('c42-java', './sweep.sh "java Primes.java pool')}
${run('c42-java', './sweep.sh "java Primes.java stream')}
<p>The pool reaches 7.01× on 8 cores and then stalls (309 ms on 10): the last two cores of this M1 Max are efficiency cores. <code>parallelStream</code> sized itself: it runs on <code>ForkJoinPool.commonPool()</code>, whose parallelism comes from <code>availableProcessors()</code>, which follows <code>taskset</code> (and container limits, lesson 3.4). It splits the range recursively and lets idle workers <em>steal</em> halves from busy ones — a work queue you did not have to write.</p>

<div class="pitfall co-tieu-de">
<p><strong>"Virtual threads are faster threads, so use them for everything."</strong> Not for CPU work: measured above, 551 ms on 4 cores — the same as a 4-thread pool, because a virtual thread only <em>runs</em> while mounted on a carrier thread, and the JVM keeps one carrier per core. Thousands of virtual threads computing in parallel still have four cores. What virtual threads make cheap is <em>waiting</em>. (And one more trap from the same family: <code>parallelStream</code> everywhere shares ONE common pool per JVM — slow blocking calls inside one stream hold workers that every other stream in the application is waiting for.)</p>
</div>

<h3>The I/O job: 100 calls to a slow API</h3>
<p>The second workload of this chapter is a tiny Node server, <code>slow.js</code>, that answers every request after 100 ms — a stand-in for a database query or a call to another service. It also counts the peak number of requests waiting at the same time:</p>
${src('ch04/slow.js', 'javascript')}
${src('ch04/Fetch.java', 'java')}
${run('c42-java', 'java Fetch.java seq', 6)}
<p>Read it as a table:</p>
<table>
<tr><th>100 calls × 100 ms</th><th>Time</th><th>Peak platform threads</th><th>Why</th></tr>
<tr><td>sequential</td><td>11 220 ms</td><td>10</td><td>100 waits one after another</td></tr>
<tr><td>pool of 10</td><td>1 162 ms</td><td>31</td><td>10 waits at a time = 10 rounds (Little's law: 10 ÷ 0.1 s = 100 calls/s)</td></tr>
<tr><td>pool of 100</td><td>186 ms</td><td>156</td><td>one kernel thread blocked per call</td></tr>
<tr><td>virtual threads</td><td>172 ms</td><td>46</td><td>100 cheap waits multiplexed on a few carriers</td></tr>
<tr><td>async (<code>sendAsync</code>)</td><td>181 ms</td><td>118</td><td>no thread waits; callbacks run on HttpClient's default (cached) executor</td></tr>
<tr><td>virtual threads, <strong>1 core</strong></td><td>213 ms</td><td>35</td><td>waiting needs no core at all</td></tr>
</table>
<p>"Peak platform threads" are real kernel threads (the JVM's own — compiler, GC, HttpClient's selector — are counted too, which is why sequential already shows 10). The last row is the whole lesson in one line: <strong>100 concurrent waits on a single core in 213 ms</strong>. For I/O, concurrency is about having enough things to wait <em>in</em>, not enough cores.</p>
${lab('threadpool', 'virtual', 'en', 'Requests that mostly wait: a pool of N platform threads caps throughput at N ÷ latency; switch to virtual threads and the cap moves to the cores and the database pool behind them.', { tour: 'threadpool-start' })}
${lab('threadpool', 'healthy', 'en', 'A healthy pool: arrivals below capacity, queue near empty. Raise the arrival rate until you find the knee where p99 explodes.')}
<p>Lesson 3.5 measured the same effect on the <em>server</em> side (Tomcat's pool vs virtual threads); here you wrote the client. The next bottleneck always moves to whatever is behind — and that is the exercise.</p>

<h3>Which Java API for which job</h3>
<table>
<tr><th>Job</th><th>Use</th><th>Avoid</th></tr>
<tr><td>CPU work, split into pieces</td><td><code>Executors.newFixedThreadPool(cores)</code>, ForkJoinPool, <code>parallelStream</code> (pure, non-blocking lambdas)</td><td>one raw <code>Thread</code> per block; blocking calls inside <code>parallelStream</code></td></tr>
<tr><td>Many blocking calls (JDBC, HTTP, files)</td><td>virtual threads (Java 21+), or a pool sized by lesson 4.5's formula</td><td>a fixed pool smaller than the concurrency you need</td></tr>
<tr><td>Combine async results</td><td><code>CompletableFuture</code>: <code>thenApply</code>, <code>thenCombine</code>, <code>allOf</code></td><td>calling <code>get()</code> right after each <code>submit</code> (that is sequential again)</td></tr>
<tr><td>Protect a limited resource</td><td>a <code>Semaphore</code> around the call</td><td>"virtual threads are free, so no limit needed"</td></tr>
</table>

<h3>✍️ Write it yourself: virtual threads with a limit of 20</h3>
<p>The API (or the database: HikariCP defaults to 10 connections) behind your calls can take only 20 requests at a time. Write <code>Limited.java</code>: make 300 calls to <code>slow.js</code> with one virtual thread each, but never more than 20 in flight. Hints: <code>java.util.concurrent.Semaphore</code>, <code>acquire()</code> before the call, <code>release()</code> in a <code>finally</code>. Prove the limit with the server's <code>peak</code>. Reference solution: <code>lab/code/ch04/giai/Limited.java</code>.</p>
${run('c42-java', 'java giai/Limited.java')}
<p>The server saw a peak of exactly <strong>20</strong>; 300 calls took 1.7 s ≈ 300 ÷ 20 × 100 ms plus connection and JIT overhead. Virtual threads made the waiting cheap; the semaphore keeps them from drowning what is behind them.</p>

<h3>If you have done OSG202 ⭐ CS.3</h3>
<p>The deep-dive deck "Threads in backend" explains thread-per-request, pool sizing and virtual threads from the server's side. This lesson is the hands-on half: you wrote the five forms yourself and measured which one fits CPU and which fits waiting.</p>
${L(OSG('osg202-slide-cs3-1'), '🎓', 'OSG202 · ⭐ CS.3 — Threads in backend', 'Thread-per-request, pool size, virtual threads, the event loop.', 'Open')}

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a Spring service enriches each order by calling a pricing API (~100 ms). A teammate wrapped the loop in <code>orders.parallelStream()</code> and says "it's parallel now, but only ~9 calls happen at once and the whole app got slower".</p>
<ol>
<li>Start <code>node slow.js &amp;</code> in the lab. Run <code>java Fetch.java pool 100 10</code>, <code>pool 100 100</code> and <code>virtual 100</code>; note time and peak platform threads.</li>
<li>Add a mode to <code>Fetch.java</code> that does the 100 calls with <code>IntStream.range(0, 100).parallel().mapToObj(i -&gt; call()).toList()</code> (not <code>.count()</code> — the stream may skip the map entirely). Read <code>/stats</code> afterwards: what peak did the server see? Run it again under <code>taskset -c 0-1</code>.</li>
<li>Rerun everything under <code>taskset -c 0-1</code>. Which modes changed and which did not?</li>
<li>Write <code>Limited.java</code> and show <code>peak=20</code>.</li>
</ol>
<p><strong>Done when:</strong> you can show from your own numbers that the parallel stream's concurrency is neither 100 nor under your control — it depends on the cores and on how the common pool reacts to blocking — while virtual threads barely care about <code>taskset</code> for this job, and you can say where the semaphore belongs.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['ExecutorService', 'A pool of worker threads that runs submitted tasks; you get a Future back.'],
  ['Future / CompletableFuture', 'A handle to a result that will exist later; CompletableFuture can be chained and combined without blocking.'],
  ['ForkJoinPool / work stealing', 'The pool behind parallel streams: tasks split in halves, idle workers steal from busy ones.'],
  ['parallelStream', 'A stream whose operations run on ForkJoinPool.commonPool(), one pool shared by the whole JVM.'],
  ['virtual thread (luồng ảo)', 'A JVM-scheduled thread mounted on a carrier only while running; blocking unmounts it.'],
  ['carrier thread', 'The platform (kernel) thread that runs virtual threads; one per core by default.'],
  ['Semaphore', 'N permits: acquire to enter, release to leave — a concurrency limit in one object.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>CPU job on 4 cores: raw threads with fixed blocks 726 ms; pool, CompletableFuture, parallelStream, virtual threads 551–587 ms (~3.8×).</li>
<li>Speedup: pool 7.01× on 8 cores; parallelStream sizes itself from <code>availableProcessors()</code>, which follows taskset and container limits.</li>
<li>Virtual threads do not speed up CPU work — they run on one carrier per core.</li>
<li>100 calls × 100 ms: sequential 11.2 s, pool of 10 1.16 s (Little's law), pool of 100 186 ms with 156 threads, virtual threads 172 ms with 46 — and 213 ms on one core.</li>
<li>Cheap waiting needs a limit: a Semaphore held the server's peak to exactly 20.</li>
</ul>
${L('https://docs.oracle.com/en/java/javase/21/core/virtual-threads.html', '☕', 'Oracle — Virtual Threads (Java 21)', 'What virtual threads are, carriers, pinning, and when to use them.', 'Open')}
${L('https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/CompletableFuture.html', '📄', 'CompletableFuture (Java 21 API)', 'supplyAsync, thenApply, thenCombine, allOf, orTimeout.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Năm cánh cửa vào Java song song — và cửa nào hợp việc nào</h2>
<p class="lead">Spring Boot, consumer Kafka, job xử lý lô — phần lớn code Java backend bạn sẽ đụng tới đều chạy việc song song qua một trong năm API: <code>Thread</code> thô, <code>ExecutorService</code>, <code>CompletableFuture</code>, <code>parallelStream</code>, hoặc (từ Java 21) <strong>virtual thread</strong>. Trong các bài hướng dẫn chúng trông như thay được cho nhau. Không phải vậy: bài này đưa cùng một việc CPU và cùng một việc I/O qua cả năm và trả lời bằng số đo <strong>nên với tay tới cái nào khi việc đốt CPU, và cái nào khi việc chủ yếu là chờ.</strong></p>

<h3>Việc CPU bằng năm API</h3>
<p>Bài đếm số nguyên tố của bài 4.1, chuyển sang Java từng dòng. Đọc <code>threads</code> (mỗi luồng một khối, như cách 2), <code>pool</code> (2 000 <code>Callable</code> nhỏ trên một pool cố định), <code>cf</code> (cũng các task đó nhưng dạng <code>CompletableFuture</code>), <code>stream</code> (một dòng) và executor virtual thread:</p>
${src('ch04/Primes.java', 'java')}
<p>Mỗi lần chạy làm hai lượt trong cùng một JVM — "cold" khi trình biên dịch JIT còn đang nóng máy, rồi "warm" — và ta lấy lượt warm. Trên một lõi, rồi trên bốn lõi (mỗi cách lấy lần nhanh nhất trong ba, bằng <code>best3.sh</code>):</p>
${run('c42-java', 'taskset -c 0 java Primes.java')}
${run('c42-java', 'for m in threads pool cf stream virtual')}
<p>Một lõi: 2 155 ms. Bốn lõi: luồng thô chia khối cố định chậm nhất, 726 ms — đúng cái mất cân bằng của bài 4.1, nay bằng Java. Mọi API cắt việc thành nhiều task nhỏ đều về 551–587 ms, khoảng 3,8×. Với việc CPU, dùng API <em>nào</em> quan trọng kém xa chuyện <em>mẩu việc nhỏ cỡ nào</em>.</p>

<h3>Speedup của một pool và của parallelStream</h3>
${run('c42-java', './sweep.sh "java Primes.java pool')}
${run('c42-java', './sweep.sh "java Primes.java stream')}
<p>Pool đạt 7,01× trên 8 lõi rồi chững lại (309 ms trên 10 lõi): hai lõi cuối của M1 Max này là lõi tiết kiệm điện. <code>parallelStream</code> tự chọn cỡ: nó chạy trên <code>ForkJoinPool.commonPool()</code>, có độ song song lấy từ <code>availableProcessors()</code>, thứ đi theo <code>taskset</code> (và giới hạn container, bài 3.4). Nó chia đôi dải số liên tục và cho worker rảnh <em>trộm</em> nửa việc của worker bận — một hàng đợi việc bạn không phải tự viết.</p>

<div class="pitfall co-tieu-de">
<p><strong>"Virtual thread là luồng nhanh hơn, cứ dùng cho mọi thứ."</strong> Không phải với việc CPU: đo ở trên, 551 ms trên 4 lõi — bằng pool 4 luồng, vì virtual thread chỉ <em>chạy</em> khi được gắn lên một carrier thread, và JVM giữ mỗi lõi một carrier. Hàng nghìn virtual thread cùng tính toán thì vẫn chỉ có bốn lõi. Thứ virtual thread làm rẻ đi là <em>chờ</em>. (Và một cái bẫy cùng họ: mọi <code>parallelStream</code> trong ứng dụng dùng chung MỘT common pool của JVM — những lời gọi chặn chậm bên trong một stream giữ chặt các worker mà mọi stream khác đang chờ.)</p>
</div>

<h3>Việc I/O: 100 lời gọi tới một API chậm</h3>
<p>Việc thứ hai của chương là một máy chủ Node tí hon, <code>slow.js</code>, trả lời mỗi request sau 100 ms — đóng vai một truy vấn CSDL hay một lời gọi sang dịch vụ khác. Nó còn đếm số request đang chờ cùng lúc cao nhất:</p>
${src('ch04/slow.js', 'javascript')}
${src('ch04/Fetch.java', 'java')}
${run('c42-java', 'java Fetch.java seq', 6)}
<p>Đọc thành bảng:</p>
<table>
<tr><th>100 lời gọi × 100 ms</th><th>Thời gian</th><th>Luồng nền tảng cao nhất</th><th>Vì sao</th></tr>
<tr><td>tuần tự</td><td>11 220 ms</td><td>10</td><td>100 lần chờ nối đuôi nhau</td></tr>
<tr><td>pool 10 luồng</td><td>1 162 ms</td><td>31</td><td>mỗi lúc 10 lần chờ = 10 lượt (định luật Little: 10 ÷ 0,1 s = 100 lời gọi/giây)</td></tr>
<tr><td>pool 100 luồng</td><td>186 ms</td><td>156</td><td>mỗi lời gọi chặn một luồng nhân</td></tr>
<tr><td>virtual thread</td><td>172 ms</td><td>46</td><td>100 lần chờ rẻ dồn lên vài carrier</td></tr>
<tr><td>async (<code>sendAsync</code>)</td><td>181 ms</td><td>118</td><td>không luồng nào chờ; callback chạy trên executor mặc định (cached) của HttpClient</td></tr>
<tr><td>virtual thread, <strong>1 lõi</strong></td><td>213 ms</td><td>35</td><td>chờ thì chẳng cần lõi nào</td></tr>
</table>
<p>"Luồng nền tảng cao nhất" là luồng nhân thật (luồng riêng của JVM — trình biên dịch, GC, selector của HttpClient — cũng được đếm, nên bản tuần tự đã thấy 10). Dòng cuối là cả bài trong một câu: <strong>100 lần chờ đồng thời trên một lõi duy nhất trong 213 ms</strong>. Với I/O, đồng thời là chuyện có đủ chỗ để <em>chờ</em>, không phải đủ lõi.</p>
${lab('threadpool', 'virtual', 'vi', 'Request chủ yếu là chờ: pool N luồng nền tảng chặn thông lượng ở N ÷ độ trễ; chuyển sang virtual thread thì trần dời sang số lõi và pool CSDL phía sau.', { tour: 'threadpool-start' })}
${lab('threadpool', 'healthy', 'vi', 'Một pool khoẻ: request đến dưới sức chứa, hàng đợi gần rỗng. Tăng tốc độ đến cho tới khi gặp khúc gãy nơi p99 bùng lên.')}
<p>Bài 3.5 đã đo cùng hiệu ứng ở phía <em>máy chủ</em> (pool Tomcat so với virtual thread); ở đây bạn tự viết phía client. Nút thắt kế tiếp luôn dời sang thứ đứng phía sau — và đó là bài tự viết.</p>

<h3>API Java nào cho việc nào</h3>
<table>
<tr><th>Việc</th><th>Dùng</th><th>Tránh</th></tr>
<tr><td>Việc CPU chia thành mẩu</td><td><code>Executors.newFixedThreadPool(số lõi)</code>, ForkJoinPool, <code>parallelStream</code> (lambda thuần, không chặn)</td><td>mỗi khối một <code>Thread</code> thô; lời gọi chặn trong <code>parallelStream</code></td></tr>
<tr><td>Nhiều lời gọi chặn (JDBC, HTTP, file)</td><td>virtual thread (Java 21+), hoặc pool cỡ theo công thức bài 4.5</td><td>pool cố định nhỏ hơn mức đồng thời bạn cần</td></tr>
<tr><td>Ghép kết quả bất đồng bộ</td><td><code>CompletableFuture</code>: <code>thenApply</code>, <code>thenCombine</code>, <code>allOf</code></td><td>gọi <code>get()</code> ngay sau mỗi <code>submit</code> (thế là lại tuần tự)</td></tr>
<tr><td>Bảo vệ tài nguyên có hạn</td><td>một <code>Semaphore</code> bọc lời gọi</td><td>"virtual thread miễn phí nên khỏi cần giới hạn"</td></tr>
</table>

<h3>✍️ Tự viết: virtual thread với giới hạn 20</h3>
<p>API (hay CSDL: HikariCP mặc định 10 kết nối) phía sau chỉ chịu được 20 request cùng lúc. Viết <code>Limited.java</code>: gọi <code>slow.js</code> 300 lần, mỗi lời gọi một virtual thread, nhưng không bao giờ quá 20 lời gọi đang bay. Gợi ý: <code>java.util.concurrent.Semaphore</code>, <code>acquire()</code> trước lời gọi, <code>release()</code> trong <code>finally</code>. Chứng minh giới hạn bằng <code>peak</code> của server. Lời giải mẫu: <code>lab/code/ch04/giai/Limited.java</code>.</p>
${run('c42-java', 'java giai/Limited.java')}
<p>Server thấy đỉnh đúng <strong>20</strong>; 300 lời gọi mất 1,7 s ≈ 300 ÷ 20 × 100 ms cộng chi phí kết nối và JIT. Virtual thread làm việc chờ rẻ đi; semaphore giữ chúng khỏi dìm chết thứ đứng phía sau.</p>

<h3>Nếu bạn đã học OSG202 ⭐ CS.3</h3>
<p>Deck chuyên sâu "Threads in backend" giảng thread-per-request, chọn cỡ pool và virtual thread từ phía máy chủ. Bài này là nửa thực hành: bạn tự viết cả năm dạng và đo xem dạng nào hợp việc CPU, dạng nào hợp việc chờ.</p>
${L(OSG('osg202-slide-cs3-1'), '🎓', 'OSG202 · ⭐ CS.3 — Luồng trong backend', 'Thread-per-request, cỡ pool, virtual thread, event loop.', 'Mở')}

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một service Spring làm giàu từng đơn hàng bằng cách gọi API giá (~100 ms). Một bạn bọc vòng lặp bằng <code>orders.parallelStream()</code> và kể "giờ đã song song, nhưng chỉ ~9 lời gọi cùng lúc và cả app chậm đi".</p>
<ol>
<li>Chạy <code>node slow.js &amp;</code> trong lab. Chạy <code>java Fetch.java pool 100 10</code>, <code>pool 100 100</code> và <code>virtual 100</code>; ghi thời gian và số luồng nền tảng cao nhất.</li>
<li>Thêm vào <code>Fetch.java</code> một chế độ gọi 100 lần bằng <code>IntStream.range(0, 100).parallel().mapToObj(i -&gt; call()).toList()</code> (đừng dùng <code>.count()</code> — stream có thể bỏ qua hẳn bước map). Đọc <code>/stats</code> sau đó: server thấy đỉnh bao nhiêu? Chạy lại dưới <code>taskset -c 0-1</code>.</li>
<li>Chạy lại tất cả dưới <code>taskset -c 0-1</code>. Chế độ nào đổi, chế độ nào không?</li>
<li>Viết <code>Limited.java</code> và chỉ ra <code>peak=20</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chỉ ra bằng số của chính mình rằng mức đồng thời của parallel stream không phải 100 và cũng không nằm trong tay bạn — nó tuỳ số lõi và cách common pool phản ứng khi bị chặn — trong khi virtual thread gần như chẳng bận tâm <code>taskset</code> với việc này, và nói được semaphore nên đặt ở đâu.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['ExecutorService', 'Một pool luồng worker chạy các task được nộp vào; bạn nhận lại một Future.'],
  ['Future / CompletableFuture', 'Tay cầm tới một kết quả sẽ có sau; CompletableFuture nối và ghép được mà không phải chặn.'],
  ['ForkJoinPool / work stealing (trộm việc)', 'Pool đứng sau parallel stream: task chia đôi, worker rảnh trộm việc của worker bận.'],
  ['parallelStream', 'Stream có các phép toán chạy trên ForkJoinPool.commonPool(), một pool dùng chung cả JVM.'],
  ['virtual thread (luồng ảo)', 'Luồng do JVM lập lịch, chỉ gắn lên carrier khi đang chạy; bị chặn thì được gỡ ra.'],
  ['carrier thread (luồng chở)', 'Luồng nền tảng (luồng nhân) chạy các virtual thread; mặc định mỗi lõi một cái.'],
  ['Semaphore', 'N giấy phép: acquire để vào, release để ra — một giới hạn đồng thời gói trong một đối tượng.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Việc CPU trên 4 lõi: luồng thô chia khối cố định 726 ms; pool, CompletableFuture, parallelStream, virtual thread 551–587 ms (~3,8×).</li>
<li>Speedup: pool 7,01× trên 8 lõi; parallelStream tự chọn cỡ theo <code>availableProcessors()</code>, thứ đi theo taskset và giới hạn container.</li>
<li>Virtual thread không làm việc CPU nhanh hơn — chúng chạy trên mỗi lõi một carrier.</li>
<li>100 lời gọi × 100 ms: tuần tự 11,2 s, pool 10 luồng 1,16 s (định luật Little), pool 100 luồng 186 ms với 156 luồng, virtual thread 172 ms với 46 — và 213 ms trên một lõi.</li>
<li>Chờ rẻ thì cần giới hạn: một Semaphore giữ đỉnh của server đúng 20.</li>
</ul>
${L('https://docs.oracle.com/en/java/javase/21/core/virtual-threads.html', '☕', 'Oracle — Virtual Threads (Java 21)', 'Virtual thread là gì, carrier, pinning, khi nào nên dùng.', 'Mở')}
${L('https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/CompletableFuture.html', '📄', 'CompletableFuture (Java 21 API)', 'supplyAsync, thenApply, thenCombine, allOf, orTimeout.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 4.3 — Node ───────────────────────── */
    {
      title: '4.3 — Node: worker_threads, cluster and Promise.all — one JS thread is not the limit|||4.3 — Node: worker_threads, cluster và Promise.all — một luồng JS không phải giới hạn',
      slug: 'os-4-3-node',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Đếm số nguyên tố bằng worker_threads với hàng đợi là một số nguyên SharedArrayBuffer + Atomics (7,0× trên 10 lõi); 100 rồi 1 000 lời gọi chậm trên một luồng JS bằng Promise.all (188 ms, 393 ms) so với await trong vòng lặp (10,8 s); cluster 1/4/8 tiến trình: 49 → 191 → 364 req/s và một event loop quá tải không công bằng (request chờ 8,1 s); bài tự viết: pool worker cố định giữ /fast dưới 1 ms.',
      content: `${G43}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2>One JavaScript thread is where Node starts, not where it stops</h2>
<p class="lead">This site's backend is Express on Node. Lesson 3.5 measured the danger: one synchronous CPU loop in a handler froze every user for 1.4 s. The fix people quote — "use worker threads" or "use cluster" — is rarely shown with numbers. This lesson writes all three Node tools yourself and measures them: <strong>worker_threads</strong> for CPU work inside one process, <strong>Promise.all</strong> for many waits on the one JS thread, and <strong>cluster</strong> for more processes on more cores. The question: <strong>which of the three fixes which problem, and what does each cost?</strong></p>

<h3>CPU work: worker_threads and a queue that is one integer</h3>
<p>The prime count again. The main thread starts T workers; each worker repeatedly takes the next chunk number with <code>Atomics.add</code> on a 4-byte <code>SharedArrayBuffer</code> — an atomic fetch-and-add, the lock-free twin of lesson 4.1's mutex queue. With <code>T = 0</code> the count runs on the main thread, as a baseline:</p>
${src('ch04/primes.js', 'javascript')}
${run('c43-node', 'node primes.js 0')}
${run('c43-node', './sweep.sh "node primes.js')}
<p>About 3.1 s on the main thread (JavaScript numbers are doubles, so the division loop is slower than C's), 7.03× on 10 cores with workers. While the workers count, the main thread's event loop is idle and could keep answering requests — the <code>setInterval</code> in the code is there to prove the loop is still alive.</p>
${lab('eventloop', 'offload', 'en', 'A CPU-heavy handler moved to a worker: the main thread keeps running callbacks while the worker computes; compare with the block preset where it does not.', { tour: 'eventloop-block' })}

<div class="pitfall co-tieu-de">
<p><strong>"Workers share my objects, like Java threads do."</strong> They do not. Each worker is a separate V8 isolate with its own heap and its own event loop; <code>postMessage</code> <em>copies</em> data (structured clone) unless you transfer an <code>ArrayBuffer</code> or use a <code>SharedArrayBuffer</code>. Sending a 50 MB object to a worker for every request costs a 50 MB copy each way — measure it before you design around it. And creating a worker is not free either: it boots a new isolate (the exercise below keeps a fixed pool for exactly this reason).</p>
</div>

<h3>Waiting: Promise.all on one thread</h3>
<p>The same 100 calls to <code>slow.js</code> (100 ms each) as lesson 4.2, now from one JavaScript thread:</p>
${src('ch04/fetch.js', 'javascript')}
${run('c43-node', 'node fetch.js seq', 4)}
<p><code>await</code> inside a <code>for</code> loop: 10.8 s — each call waits for the previous one. <code>Promise.all</code>: 188 ms, and the server saw all 100 in flight at once. A thousand calls: 393 ms with 1 000 in flight — no extra thread at all, because each <code>fetch</code> is a socket parked in epoll while the thread runs other callbacks (Chapter 10). The 10-lane version is Little's law again: 10 ÷ 0.1 s = 100 calls/s ⇒ 1.12 s.</p>
<p>Notice what "no limit" did: the server received <strong>1 000 simultaneous requests</strong> from one client. Against a real API that is rate-limited, or a database with 10 connections, that is how one batch job takes down production. Choose the number of lanes on purpose — exactly the Java semaphore of lesson 4.2.</p>

<h3>More cores for HTTP: cluster</h3>
<p><code>cluster</code> forks W worker <em>processes</em>; each calls <code>listen(8080)</code>, and the primary process accepts connections and hands them out round-robin. Every request burns 20 ms of CPU (think password hashing or image resizing), so one process can serve at most 50 requests per second. <code>hit.js</code> sends 400 requests, 32 at a time:</p>
${src('ch04/cluster.js', 'javascript')}
${run('c43-node', 'cat /tmp/c.log', 2)}
${run('c43-node', 'ps -o pid,ppid,rss', 3)}
<p>1 worker: 49 req/s — the 50/s ceiling. 4 workers: 191 req/s; 8 workers: 364 req/s, median wait from 425 ms down to 76 ms. Each worker is a complete Node process: about 49 MB of RSS and 7 threads, four times the memory for four times the throughput. That is the cluster trade-off — and the same one as running several containers behind nginx.</p>

<div class="pitfall co-tieu-de">
<p><strong>"Under overload everybody just waits a bit longer, in order."</strong> Look at the 1-worker line again: median 425 ms, but the slowest request waited <strong>8.1 s</strong> — almost the whole run — and it had been sent only 33 ms after the start, on a new connection. Now the same load against one plain process without <code>cluster</code>, with a look at the listening socket two seconds in:</p>
${run('c43-node', "node hit.js http://localhost:8080/ 400 32 > /tmp/h.txt")}
<p>Same 49 req/s, but max 1.9 s and p99 1.2 s instead of 7.8 s. <code>Recv-Q 0</code> on the <code>LISTEN</code> socket says nobody was stuck in the kernel's accept queue (lesson 10.1). With <code>cluster</code> the primary accepts every connection at once and passes it to the worker as a message over an IPC channel; a worker saturated by its keep-alive clients — each of which sends the next request immediately — gets around to new connections late. Same throughput, a completely different tail. An overloaded event loop makes no fairness promise: watch p99 and max, not the average, and do not run a worker at 100% in the first place.</p>
</div>

<h3>✍️ Write it yourself: a fixed worker pool</h3>
<p>Write <code>pool-server.js</code>: an HTTP server with <code>/hash</code> (50 ms of CPU) and <code>/fast</code>. Mode <code>inline</code> does the hash on the main thread; mode <code>pool N</code> creates N <code>worker_threads</code> <em>once</em> at startup, gives each job to an idle worker or queues it, and resolves the request's promise when the worker answers. Then load <code>/hash</code> with 80 requests, 20 at a time, and time one <code>/fast</code> in the middle. Reference solution: <code>lab/code/ch04/giai/pool-server.js</code>.</p>
${run('c43-node', 'cat /tmp/p.log', 5)}
<p>Inline: <code>/fast</code> waited <strong>3.79 s</strong> behind 80 hashes. Pool of 4: <strong>0.49 ms</strong>. The hashes still take the time they take — 77 req/s, close to the pool's ceiling of 4 ÷ 50 ms = 80/s — but they no longer stand in front of everybody else.</p>
${lab('eventloop', 'pool', 'en', 'libuv’s own pool works the same way: four threads, a queue in front of them, and jobs that wait for a free thread. Change the pool size and watch the waves.')}

<h3>Which Node tool for which problem</h3>
<table>
<tr><th>Problem</th><th>Tool</th><th>Cost</th></tr>
<tr><td>Many slow calls (APIs, DB)</td><td><code>Promise.all</code> with a concurrency limit</td><td>almost none; just a limit to choose</td></tr>
<tr><td>CPU-heavy step inside a request</td><td>a fixed pool of <code>worker_threads</code></td><td>a V8 isolate per worker; data copied unless shared</td></tr>
<tr><td>More requests per second than one core can do</td><td><code>cluster</code>, or several containers behind nginx</td><td>a full process per worker (~49 MB here); no shared memory</td></tr>
</table>
<p>In a container, size all three from <code>os.availableParallelism()</code>, never <code>os.cpus().length</code> (lesson 3.4).</p>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> the CV-export endpoint of an Express app builds a PDF in about 300 ms of CPU. When five people export at once, the whole site stalls; someone proposes "just add <code>cluster</code> with 10 workers" on a container limited to <code>--cpus 2</code>.</p>
<ol>
<li>Run <code>node cluster.js 1</code> and <code>node hit.js http://localhost:8080/ 400 32</code>; then 4 workers. Record req/s, p50, p99 and max.</li>
<li>Start a container with <code>--cpus 2</code> and repeat with 2, 4 and 10 workers. Where does throughput stop growing, and what happens to p99?</li>
<li>Write <code>pool-server.js</code> and show <code>/fast</code> stays under a few ms during the <code>/hash</code> load.</li>
<li>Write one paragraph for the team: what each of the three tools would fix in the CV-export case.</li>
</ol>
<p><strong>Done when:</strong> your numbers show cluster scaling only up to the CPUs the container really has, and your worker pool keeps <code>/fast</code> fast while the CPU work queues behind a fixed number of workers.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['worker_threads', 'Extra JavaScript threads in one Node process, each with its own V8 isolate, heap and event loop.'],
  ['SharedArrayBuffer / Atomics', 'Memory really shared between workers, and indivisible operations on it (add, compareExchange, wait/notify).'],
  ['postMessage / structured clone', 'How workers talk: the data is copied, unless transferred or shared.'],
  ['Promise.all', 'Waits for many promises at once; with I/O promises, many waits run concurrently on one thread.'],
  ['concurrency limit (giới hạn đồng thời)', 'At most C operations in flight — lanes, a semaphore, p-limit.'],
  ['cluster', 'Node module that forks worker processes sharing one listening port; the primary distributes connections.'],
  ['worker pool', 'N workers created once, a queue in front; requests wait for a free worker instead of creating one.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>worker_threads + a SharedArrayBuffer counter: the prime count went from 3.1 s on the main thread to 7.03× faster on 10 cores, with the event loop free.</li>
<li>Workers do not share ordinary objects; messages are copied; creating a worker is expensive — keep a fixed pool.</li>
<li>Promise.all: 100 slow calls in 188 ms, 1 000 in 393 ms on one thread; a 10-lane limit gives 1.12 s (Little's law). No limit means 1 000 requests at the service behind you.</li>
<li>cluster: 49 → 191 → 364 req/s with 1 → 4 → 8 processes of ~49 MB each.</li>
<li>An overloaded worker is unfair: with 1 cluster worker the median was 425 ms but one request on a new connection waited 8.1 s (a plain process: max 1.9 s). A fixed worker pool kept /fast at 0.49 ms instead of 3.79 s.</li>
</ul>
${L('https://nodejs.org/api/worker_threads.html', '🟩', 'Node.js — worker_threads', 'Worker, SharedArrayBuffer, transfer lists and resource limits.', 'Open')}
${L('https://nodejs.org/api/cluster.html', '🟩', 'Node.js — cluster', 'How the primary distributes connections to worker processes.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2>Một luồng JavaScript là chỗ Node bắt đầu, không phải chỗ nó dừng</h2>
<p class="lead">Backend của trang này là Express trên Node. Bài 3.5 đã đo mối nguy: một vòng lặp CPU đồng bộ trong handler làm đứng hình mọi người dùng 1,4 s. Cách chữa người ta hay nói — "dùng worker thread" hay "dùng cluster" — hiếm khi được chỉ ra bằng số đo. Bài này bạn tự viết cả ba công cụ của Node và đo: <strong>worker_threads</strong> cho việc CPU trong một tiến trình, <strong>Promise.all</strong> cho nhiều lần chờ trên một luồng JS, và <strong>cluster</strong> cho thêm tiến trình trên thêm lõi. Câu hỏi: <strong>công cụ nào chữa vấn đề nào, và mỗi cái tốn gì?</strong></p>

<h3>Việc CPU: worker_threads và một hàng đợi chỉ là một số nguyên</h3>
<p>Lại bài đếm số nguyên tố. Luồng chính khởi động T worker; mỗi worker liên tục lấy số thứ tự mẩu kế tiếp bằng <code>Atomics.add</code> trên một <code>SharedArrayBuffer</code> 4 byte — phép "lấy rồi cộng" nguyên tử, người anh em không khoá của hàng đợi có mutex ở bài 4.1. Với <code>T = 0</code> việc đếm chạy ngay trên luồng chính, làm mốc:</p>
${src('ch04/primes.js', 'javascript')}
${run('c43-node', 'node primes.js 0')}
${run('c43-node', './sweep.sh "node primes.js')}
<p>Khoảng 3,1 s trên luồng chính (số trong JavaScript là số thực double nên vòng lặp chia chậm hơn C), 7,03× trên 10 lõi với worker. Trong lúc worker đếm, event loop của luồng chính rảnh và vẫn có thể trả lời request — <code>setInterval</code> trong mã có mặt để chứng minh vòng lặp vẫn sống.</p>
${lab('eventloop', 'offload', 'vi', 'Một handler nặng CPU được chuyển sang worker: luồng chính vẫn chạy callback trong khi worker tính; so với preset block, nơi điều đó không xảy ra.', { tour: 'eventloop-block' })}

<div class="pitfall co-tieu-de">
<p><strong>"Worker dùng chung đối tượng của tôi, như luồng Java."</strong> Không. Mỗi worker là một isolate V8 riêng với heap riêng và event loop riêng; <code>postMessage</code> <em>sao chép</em> dữ liệu (structured clone) trừ khi bạn chuyển hẳn một <code>ArrayBuffer</code> hoặc dùng <code>SharedArrayBuffer</code>. Gửi một đối tượng 50 MB cho worker ở mỗi request là chép 50 MB mỗi chiều — đo trước khi thiết kế quanh nó. Và tạo worker cũng không miễn phí: nó khởi động cả một isolate mới (bài tự viết bên dưới giữ một pool cố định chính vì vậy).</p>
</div>

<h3>Việc chờ: Promise.all trên một luồng</h3>
<p>Vẫn 100 lời gọi tới <code>slow.js</code> (mỗi lời gọi 100 ms) như bài 4.2, giờ từ một luồng JavaScript:</p>
${src('ch04/fetch.js', 'javascript')}
${run('c43-node', 'node fetch.js seq', 4)}
<p><code>await</code> trong vòng <code>for</code>: 10,8 s — lời gọi sau chờ lời gọi trước. <code>Promise.all</code>: 188 ms, server thấy cả 100 đang bay cùng lúc. Một nghìn lời gọi: 393 ms với 1 000 đang bay — không thêm luồng nào, vì mỗi <code>fetch</code> là một socket nằm chờ trong epoll trong khi luồng chạy callback khác (Chương 10). Bản 10 làn lại là định luật Little: 10 ÷ 0,1 s = 100 lời gọi/giây ⇒ 1,12 s.</p>
<p>Để ý "không giới hạn" đã làm gì: server nhận <strong>1 000 request cùng lúc</strong> từ một client. Với một API thật có giới hạn tốc độ, hay một CSDL 10 kết nối, đó là cách một job xử lý lô đánh sập production. Hãy chọn số làn có chủ đích — đúng như semaphore Java ở bài 4.2.</p>

<h3>Thêm lõi cho HTTP: cluster</h3>
<p><code>cluster</code> fork W <em>tiến trình</em> worker; mỗi worker gọi <code>listen(8080)</code>, còn tiến trình chính nhận kết nối rồi chia vòng tròn. Mỗi request đốt 20 ms CPU (hình dung băm mật khẩu hay co ảnh), nên một tiến trình phục vụ tối đa 50 request mỗi giây. <code>hit.js</code> gửi 400 request, mỗi lúc 32:</p>
${src('ch04/cluster.js', 'javascript')}
${run('c43-node', 'cat /tmp/c.log', 2)}
${run('c43-node', 'ps -o pid,ppid,rss', 3)}
<p>1 worker: 49 req/s — đúng trần 50/s. 4 worker: 191 req/s; 8 worker: 364 req/s, thời gian chờ trung vị từ 425 ms xuống 76 ms. Mỗi worker là một tiến trình Node trọn vẹn: khoảng 49 MB RSS và 7 luồng, gấp bốn bộ nhớ để có gấp bốn thông lượng. Đó là cái giá của cluster — và cũng là cái giá khi chạy nhiều container sau nginx.</p>

<div class="pitfall co-tieu-de">
<p><strong>"Khi quá tải thì ai cũng chỉ chờ lâu hơn một chút, theo thứ tự."</strong> Nhìn lại dòng 1 worker: trung vị 425 ms, nhưng request chậm nhất chờ <strong>8,1 s</strong> — gần hết cả lượt chạy — và nó được gửi chỉ 33 ms sau lúc bắt đầu, trên một kết nối mới. Giờ cùng mức tải đó vào một tiến trình thường không có <code>cluster</code>, kèm một lần nhìn socket đang nghe sau hai giây:</p>
${run('c43-node', "node hit.js http://localhost:8080/ 400 32 > /tmp/h.txt")}
<p>Vẫn 49 req/s, nhưng max 1,9 s và p99 1,2 s thay vì 7,8 s. <code>Recv-Q 0</code> trên socket <code>LISTEN</code> nói rằng không ai bị kẹt trong hàng accept của nhân (bài 10.1). Với <code>cluster</code>, tiến trình chính accept mọi kết nối ngay lập tức rồi chuyển cho worker dưới dạng một tin nhắn qua kênh IPC; một worker đã bị khách keep-alive làm bão hoà — mỗi khách gửi ngay request kế tiếp — thì xử lý kết nối mới rất muộn. Cùng thông lượng, phần đuôi khác hẳn. Event loop quá tải không hứa hẹn công bằng: hãy nhìn p99 và max chứ không phải trung bình, và ngay từ đầu đừng chạy một worker ở 100%.</p>
</div>

<h3>✍️ Tự viết: một pool worker cố định</h3>
<p>Viết <code>pool-server.js</code>: một máy chủ HTTP có <code>/hash</code> (50 ms CPU) và <code>/fast</code>. Chế độ <code>inline</code> băm ngay trên luồng chính; chế độ <code>pool N</code> tạo N <code>worker_threads</code> <em>một lần</em> lúc khởi động, giao mỗi việc cho một worker rảnh hoặc xếp hàng, và resolve promise của request khi worker trả lời. Rồi bắn 80 request <code>/hash</code>, mỗi lúc 20, và bấm giờ một lần <code>/fast</code> chen giữa. Lời giải mẫu: <code>lab/code/ch04/giai/pool-server.js</code>.</p>
${run('c43-node', 'cat /tmp/p.log', 5)}
<p>Inline: <code>/fast</code> chờ <strong>3,79 s</strong> sau 80 lần băm. Pool 4 worker: <strong>0,49 ms</strong>. Việc băm vẫn tốn đúng thời gian của nó — 77 req/s, sát trần của pool là 4 ÷ 50 ms = 80/s — nhưng nó không còn đứng chắn trước mặt mọi người nữa.</p>
${lab('eventloop', 'pool', 'vi', 'Pool riêng của libuv chạy y như vậy: bốn luồng, một hàng đợi đứng trước, và việc phải chờ luồng rảnh. Đổi cỡ pool và xem các đợt.')}

<h3>Công cụ Node nào cho vấn đề nào</h3>
<table>
<tr><th>Vấn đề</th><th>Công cụ</th><th>Cái giá</th></tr>
<tr><td>Nhiều lời gọi chậm (API, CSDL)</td><td><code>Promise.all</code> kèm giới hạn đồng thời</td><td>gần như không; chỉ cần chọn giới hạn</td></tr>
<tr><td>Một bước nặng CPU trong request</td><td>một pool <code>worker_threads</code> cố định</td><td>mỗi worker một isolate V8; dữ liệu bị chép trừ khi dùng chung</td></tr>
<tr><td>Nhiều request mỗi giây hơn một lõi làm nổi</td><td><code>cluster</code>, hoặc nhiều container sau nginx</td><td>mỗi worker một tiến trình trọn vẹn (~49 MB ở đây); không chung bộ nhớ</td></tr>
</table>
<p>Trong container, chọn cỡ cho cả ba theo <code>os.availableParallelism()</code>, đừng bao giờ theo <code>os.cpus().length</code> (bài 3.4).</p>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> endpoint xuất CV của một app Express dựng PDF mất khoảng 300 ms CPU. Năm người cùng xuất là cả trang đứng hình; có người đề xuất "thêm <code>cluster</code> 10 worker là xong" trên một container giới hạn <code>--cpus 2</code>.</p>
<ol>
<li>Chạy <code>node cluster.js 1</code> và <code>node hit.js http://localhost:8080/ 400 32</code>; rồi 4 worker. Ghi req/s, p50, p99 và max.</li>
<li>Mở container với <code>--cpus 2</code> rồi lặp lại với 2, 4 và 10 worker. Thông lượng dừng tăng ở đâu, p99 ra sao?</li>
<li>Viết <code>pool-server.js</code> và chỉ ra <code>/fast</code> vẫn dưới vài ms trong lúc tải <code>/hash</code>.</li>
<li>Viết một đoạn gửi nhóm: mỗi công cụ trong ba công cụ sẽ chữa được gì trong vụ xuất CV.</li>
</ol>
<p><strong>Đạt khi:</strong> số đo của bạn cho thấy cluster chỉ mở rộng tới số CPU mà container thật sự có, và pool worker của bạn giữ <code>/fast</code> nhanh trong khi việc CPU xếp hàng sau một số worker cố định.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['worker_threads', 'Thêm luồng JavaScript trong một tiến trình Node, mỗi luồng có isolate V8, heap và event loop riêng.'],
  ['SharedArrayBuffer / Atomics', 'Bộ nhớ thật sự dùng chung giữa các worker, và các phép toán không chia cắt trên nó (add, compareExchange, wait/notify).'],
  ['postMessage / structured clone', 'Cách worker nói chuyện: dữ liệu bị sao chép, trừ khi chuyển hẳn hoặc dùng chung.'],
  ['Promise.all', 'Chờ nhiều promise cùng lúc; với promise I/O, nhiều lần chờ chạy đồng thời trên một luồng.'],
  ['concurrency limit (giới hạn đồng thời)', 'Tối đa C thao tác đang bay — làn, semaphore, p-limit.'],
  ['cluster', 'Module Node fork các tiến trình worker dùng chung một cổng nghe; tiến trình chính chia kết nối.'],
  ['worker pool (pool worker)', 'N worker tạo một lần, có hàng đợi đứng trước; request chờ worker rảnh thay vì tạo worker mới.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>worker_threads + một bộ đếm SharedArrayBuffer: đếm số nguyên tố từ 3,1 s trên luồng chính thành nhanh 7,03× trên 10 lõi, event loop vẫn rảnh.</li>
<li>Worker không dùng chung đối tượng thường; tin nhắn bị sao chép; tạo worker đắt — hãy giữ một pool cố định.</li>
<li>Promise.all: 100 lời gọi chậm trong 188 ms, 1 000 trong 393 ms trên một luồng; giới hạn 10 làn cho 1,12 s (định luật Little). Không giới hạn nghĩa là 1 000 request dội vào dịch vụ phía sau.</li>
<li>cluster: 49 → 191 → 364 req/s với 1 → 4 → 8 tiến trình, mỗi cái ~49 MB.</li>
<li>Worker quá tải thì bất công: với 1 worker cluster, trung vị 425 ms nhưng một request trên kết nối mới chờ 8,1 s (tiến trình thường: max 1,9 s). Pool worker cố định giữ /fast ở 0,49 ms thay vì 3,79 s.</li>
</ul>
${L('https://nodejs.org/api/worker_threads.html', '🟩', 'Node.js — worker_threads', 'Worker, SharedArrayBuffer, transfer list và giới hạn tài nguyên.', 'Mở')}
${L('https://nodejs.org/api/cluster.html', '🟩', 'Node.js — cluster', 'Tiến trình chính chia kết nối cho các tiến trình worker ra sao.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 4.4 — Python ───────────────────────── */
    {
      title: '4.4 — Python: the GIL, threading vs multiprocessing vs asyncio, measured|||4.4 — Python: GIL, threading vs multiprocessing vs asyncio, đo thật',
      slug: 'os-4-4-python',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Python 3.14 trong lab có GIL (bản free-threaded 3.14t không có trong apt của Ubuntu 26.04): 4 luồng đếm số nguyên tố vẫn 4,4 s (1,00×), 4 tiến trình 1,3 s, 10 tiến trình 7,05×; ps thấy 4 luồng mỗi luồng ~25% lõi; với I/O luồng vẫn giúp (100 lời gọi 139 ms) và asyncio 1 000 lời gọi 266 ms; GIL không bảo vệ dữ liệu: mất 1,2–1,4 triệu lần cập nhật; bài tự viết: asyncio + Semaphore + ProcessPoolExecutor.',
      content: `${G44}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.4</span>
<h2>Python has real threads — and one lock that decides who runs</h2>
<p class="lead">Python is the language of AI work, scripts and a lot of backends (Django, FastAPI). Ask "how do I make it parallel?" and you get three answers that sound alike — <code>threading</code>, <code>multiprocessing</code>, <code>asyncio</code> — plus one word everybody repeats: the <strong>GIL</strong>. This lesson measures what the GIL really costs: <strong>for CPU work and for waiting, which of the three tools actually uses more cores or more concurrency, and what does the GIL still not protect?</strong></p>

<h3>Does this Python have a GIL?</h3>
<p>The Global Interpreter Lock is a mutex inside CPython: a thread must hold it to execute Python bytecode. Since 3.13 CPython can also be built <em>without</em> it ("free-threaded", PEP 703, usually installed as <code>python3.13t</code> / <code>python3.14t</code>). One line tells you which interpreter you have:</p>
${src('ch04/gil.py', 'python')}
${run('c44-python', 'python3 gil.py')}
<p>Our lab runs Ubuntu 26.04's Python 3.14.4: <code>Py_GIL_DISABLED = 0</code>, GIL on. Is a free-threaded build available in the lab image? We asked the package manager:</p>
${run('c44-ft', 'ls /usr/bin/python3', 3)}
<p>Only <code>python3</code> and <code>python3.14</code>; apt has no <code>…t</code> / <code>nogil</code> package for 3.13+ in this release (the search counts 0 matches, and <code>apt-cache policy</code> knows neither name). So <strong>every number in this lesson is with the GIL</strong>, and we do not claim a free-threaded measurement. If you want to try one yourself: python.org's macOS and Windows installers offer it as an option, and tools such as <code>uv</code> can install a <code>3.14t</code> interpreter — run <code>primes.py threads</code> under it and compare.</p>

<h3>CPU work: threads vs processes</h3>
<p>The same prime count — with a smaller N, because pure Python is about 50 times slower than C at this loop (lesson 4.5 has the table). <code>threads</code> runs T <code>threading.Thread</code>s pulling chunks from a <code>queue.Queue</code>; <code>procs</code> uses <code>multiprocessing.Pool(T).map</code> over the same chunks:</p>
${src('ch04/primes.py', 'python')}
${run('c44-python', 'python3 primes.py seq', 3)}
${run('c44-python', './sweep.sh "python3 primes.py threads')}
${run('c44-python', './sweep.sh "python3 primes.py procs')}
<p>Threads: <strong>1.00× on 1, 2 and 4 cores</strong> — exactly nothing. Processes: 3.40× on 4 cores, 7.05× on 10. The GIL is visible from outside with the tools of Chapter 2:</p>
${run('c44-python', 'python3 primes.py threads 4 2000000 &')}
<p>Four real kernel threads (<code>ps -L</code> shows LWPs 370–373, lesson 3.1), each at only 22–28% of a core, and <code>top</code> shows the whole process at 100%: one core's worth of work, passed between threads as they take turns holding the lock. The threads are real; the parallelism is not.</p>
${lab('scheduler', 'multicore', 'en', 'Set the cores to 4 and imagine only one of them may run Python at any instant: that is four threads under the GIL. multiprocessing is four separate one-core schedulers.', { tour: 'scheduler-start' })}

<h3>I/O work: threads do help</h3>
<p>The same 100 calls to <code>slow.js</code>. A thread blocked in a socket read has <em>released</em> the GIL, so the others run:</p>
${src('ch04/fetch.py', 'python')}
${run('c44-python', 'python3 fetch.py seq', 5)}
<p>Sequential 11.1 s; 10 threads 1.13 s (Little's law again); 100 threads 139 ms with the server seeing 100 in flight; asyncio 130 ms on one thread, and 1 000 calls in 266 ms. The GIL serialises <em>running Python code</em>, not waiting. For a few hundred blocking calls (an SDK without async support, <code>requests</code>, a database driver) a <code>ThreadPoolExecutor</code> is fine; for thousands, asyncio — one thread over epoll, the same model as Node.</p>

<h3>The GIL is not a lock for your data</h3>
<p>A common belief: "with the GIL only one thread runs at a time, so my counters are safe". Four threads each deposit 1 000 000 times into one balance — once as <code>balance += 1</code>, once the way real code looks (read through a function, write through a function), once under a <code>threading.Lock</code>:</p>
${src('ch04/race.py', 'python')}
${run('c44-python', 'python3 race.py inline', 4)}
${lab('race', 'none', 'en', 'counter++ as load → add → store, two threads interleaved: the GIL only guarantees that one bytecode runs at a time, not that your read–modify–write stays together.', { tour: 'race-lost-update' })}

<div class="pitfall co-tieu-de">
<p><strong>"The GIL makes my code thread-safe."</strong> Measured: the one-line <code>balance += 1</code> survived on this interpreter, but read → call a function → write lost <strong>1 225 015 and 1 393 049</strong> of 4 000 000 updates in two runs. CPython may hand the GIL to another thread between bytecodes (on a call, on a loop back-edge, every few milliseconds), so any read–modify–write that spans more than one bytecode is a race — and whether a one-liner happens to survive depends on the CPython version (it is not a promise; on a free-threaded build it certainly does not). Protect shared state with <code>threading.Lock</code>, exactly as in Chapter 5.</p>
</div>

<h3>✍️ Write it yourself: asyncio for waiting, processes for CPU</h3>
<p>Write one asyncio program that (1) makes 100 calls to <code>slow.js</code> with at most 10 in flight (<code>asyncio.Semaphore</code>), and (2) counts the primes below 2 000 000 in 4 <em>processes</em> via <code>loop.run_in_executor(ProcessPoolExecutor(4), …)</code> while a 100 ms "heartbeat" coroutine keeps ticking — proof that the event loop is never blocked. Reference solution: <code>lab/code/ch04/giai/hybrid.py</code>.</p>
${run('c44-python', 'python3 giai/hybrid.py')}
<p>The server saw exactly 10 in flight (100 calls ÷ 10 × 100 ms ≈ 1.1 s). The CPU part took 1.6 s in 4 processes, and during it the heartbeat ticked 14 times with its longest gap 102 ms — the loop never stalled. Call <code>count_primes</code> directly inside the coroutine instead and the heartbeat goes silent for the whole count: try it and measure the gap.</p>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a FastAPI service resizes uploaded images in a request handler and calls an external OCR API. A teammate "made it parallel" with a <code>ThreadPoolExecutor(16)</code> around everything; CPU is stuck at ~100% of one core and OCR calls queue up.</p>
<ol>
<li>Run <code>primes.py threads 4</code> and <code>procs 4</code> under <code>taskset -c 0-3</code>. While the threads version runs, show the per-thread CPU with <code>ps -L -o lwp,pcpu</code>.</li>
<li>Run <code>fetch.py threads 100 10</code> and <code>asyncio 100</code>; read the server's peak.</li>
<li>Run <code>race.py split</code> twice and <code>race.py lock</code>; explain the difference in one sentence.</li>
<li>Write <code>hybrid.py</code>; then deliberately call <code>count_primes</code> directly in the coroutine and record the longest heartbeat gap.</li>
</ol>
<p><strong>Done when:</strong> you can tell your teammate, with your numbers, which part needs processes (the resize), which part threads or asyncio are fine for (the OCR calls), and why their shared counters need a lock even with the GIL.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['GIL (Global Interpreter Lock)', 'A lock in CPython: only the thread holding it runs bytecode; it is released while waiting for I/O.'],
  ['free-threaded build (3.13t/3.14t)', 'CPython compiled without the GIL (PEP 703); <code>sys._is_gil_enabled()</code> tells you.'],
  ['multiprocessing / ProcessPoolExecutor', 'Worker processes, each with its own interpreter and GIL; data is pickled between them.'],
  ['pickle', 'Python’s serialisation format — how arguments and results cross between processes.'],
  ['ThreadPoolExecutor', 'A pool of threads; useful for blocking I/O, useless for pure-Python CPU work under the GIL.'],
  ['asyncio', 'One thread, one event loop over epoll; <code>await</code> parks a coroutine while it waits.'],
  ['run_in_executor', 'Runs a blocking or CPU function in a pool so the event loop stays free.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>The lab's Python 3.14.4 has the GIL; Ubuntu 26.04 packages no free-threaded build, so no free-threaded numbers here.</li>
<li>CPU: 4 threads 4.4 s = no speedup (each thread ~25% of a core); processes 3.40× on 4 cores, 7.05× on 10.</li>
<li>I/O: the GIL is released while waiting — 100 threads 139 ms, asyncio 130 ms, asyncio with 1 000 calls 266 ms.</li>
<li>The GIL does not protect your data: read → call → write lost 1.2–1.4 million of 4 million updates; a Lock fixed it.</li>
<li>Rule: processes for CPU, threads or asyncio for waiting, <code>run_in_executor</code> to mix them without blocking the loop.</li>
</ul>
${L('https://docs.python.org/3/howto/free-threading-python.html', '🐍', 'Python docs — Free-threaded CPython', 'How to install and check a build without the GIL, and what changes.', 'Open')}
${L('https://docs.python.org/3/library/multiprocessing.html', '🐍', 'Python docs — multiprocessing', 'Pool, Process, start methods and what gets pickled.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.4</span>
<h2>Python có luồng thật — và một cái khoá quyết định ai được chạy</h2>
<p class="lead">Python là ngôn ngữ của việc AI, script và khá nhiều backend (Django, FastAPI). Hỏi "làm sao cho nó song song?" là bạn nhận ba câu trả lời nghe na ná nhau — <code>threading</code>, <code>multiprocessing</code>, <code>asyncio</code> — cộng một chữ ai cũng nhắc: <strong>GIL</strong>. Bài này đo xem GIL thật sự tốn gì: <strong>với việc CPU và với việc chờ, công cụ nào trong ba cái thật sự dùng thêm được lõi hay thêm được đồng thời, và GIL vẫn KHÔNG bảo vệ được gì?</strong></p>

<h3>Python này có GIL không?</h3>
<p>Global Interpreter Lock là một mutex bên trong CPython: luồng phải giữ nó mới được chạy bytecode Python. Từ 3.13, CPython còn có thể được dựng <em>không có</em> nó ("free-threaded", PEP 703, thường cài dưới tên <code>python3.13t</code> / <code>python3.14t</code>). Một dòng cho bạn biết mình đang có trình thông dịch nào:</p>
${src('ch04/gil.py', 'python')}
${run('c44-python', 'python3 gil.py')}
<p>Lab chạy Python 3.14.4 của Ubuntu 26.04: <code>Py_GIL_DISABLED = 0</code>, GIL bật. Ảnh lab có bản free-threaded không? Ta hỏi trình quản lý gói:</p>
${run('c44-ft', 'ls /usr/bin/python3', 3)}
<p>Chỉ có <code>python3</code> và <code>python3.14</code>; apt của bản phát hành này không có gói <code>…t</code> / <code>nogil</code> nào cho 3.13+ (tìm ra 0 kết quả, và <code>apt-cache policy</code> không biết cả hai cái tên). Vậy <strong>mọi con số trong bài này đều có GIL</strong>, và ta không nhận là đã đo bản free-threaded. Muốn tự thử: bộ cài python.org cho macOS và Windows có tuỳ chọn cài nó, và các công cụ như <code>uv</code> cài được trình thông dịch <code>3.14t</code> — chạy <code>primes.py threads</code> bằng nó rồi so.</p>

<h3>Việc CPU: luồng vs tiến trình</h3>
<p>Vẫn bài đếm số nguyên tố — với N nhỏ hơn, vì Python thuần chậm hơn C khoảng 50 lần ở vòng lặp này (bảng ở bài 4.5). <code>threads</code> chạy T <code>threading.Thread</code> kéo mẩu việc từ một <code>queue.Queue</code>; <code>procs</code> dùng <code>multiprocessing.Pool(T).map</code> trên cùng các mẩu:</p>
${src('ch04/primes.py', 'python')}
${run('c44-python', 'python3 primes.py seq', 3)}
${run('c44-python', './sweep.sh "python3 primes.py threads')}
${run('c44-python', './sweep.sh "python3 primes.py procs')}
<p>Luồng: <strong>1,00× trên 1, 2 và 4 lõi</strong> — đúng bằng không. Tiến trình: 3,40× trên 4 lõi, 7,05× trên 10. GIL nhìn thấy được từ bên ngoài bằng chính công cụ của Chương 2:</p>
${run('c44-python', 'python3 primes.py threads 4 2000000 &')}
<p>Bốn luồng nhân thật (<code>ps -L</code> thấy LWP 370–373, bài 3.1), mỗi luồng chỉ 22–28% một lõi, và <code>top</code> thấy cả tiến trình ở 100%: đúng lượng việc của một lõi, được chuyền qua lại giữa các luồng khi chúng lần lượt giữ khoá. Luồng là thật; sự song song thì không.</p>
${lab('scheduler', 'multicore', 'vi', 'Đặt 4 lõi và hình dung mỗi lúc chỉ một lõi được chạy Python: đó là bốn luồng dưới GIL. multiprocessing là bốn bộ lập lịch một lõi riêng biệt.', { tour: 'scheduler-start' })}

<h3>Việc I/O: luồng có giúp</h3>
<p>Vẫn 100 lời gọi tới <code>slow.js</code>. Một luồng đang chặn ở lệnh đọc socket đã <em>nhả</em> GIL, nên các luồng khác chạy được:</p>
${src('ch04/fetch.py', 'python')}
${run('c44-python', 'python3 fetch.py seq', 5)}
<p>Tuần tự 11,1 s; 10 luồng 1,13 s (lại định luật Little); 100 luồng 139 ms, server thấy 100 đang bay; asyncio 130 ms trên một luồng, và 1 000 lời gọi trong 266 ms. GIL xếp hàng việc <em>chạy mã Python</em>, không xếp hàng việc chờ. Với vài trăm lời gọi chặn (một SDK không hỗ trợ async, <code>requests</code>, driver CSDL) dùng <code>ThreadPoolExecutor</code> là ổn; với hàng nghìn, dùng asyncio — một luồng trên epoll, cùng mô hình với Node.</p>

<h3>GIL không phải khoá cho dữ liệu của bạn</h3>
<p>Một niềm tin phổ biến: "có GIL thì mỗi lúc chỉ một luồng chạy, nên bộ đếm của tôi an toàn". Bốn luồng, mỗi luồng nạp 1 000 000 lần vào một số dư — một lần viết <code>balance += 1</code>, một lần viết kiểu code thật (đọc qua một hàm, ghi qua một hàm), một lần dưới <code>threading.Lock</code>:</p>
${src('ch04/race.py', 'python')}
${run('c44-python', 'python3 race.py inline', 4)}
${lab('race', 'none', 'vi', 'counter++ là nạp → cộng → ghi, hai luồng xen kẽ: GIL chỉ bảo đảm mỗi lúc một bytecode chạy, không bảo đảm chuỗi đọc–sửa–ghi của bạn đi liền một mạch.', { tour: 'race-lost-update' })}

<div class="pitfall co-tieu-de">
<p><strong>"GIL làm code của tôi an toàn với luồng."</strong> Đo được: dòng <code>balance += 1</code> qua được trên trình thông dịch này, nhưng đọc → gọi hàm → ghi đã mất <strong>1 225 015 và 1 393 049</strong> trong 4 000 000 lần cập nhật ở hai lần chạy. CPython có thể trao GIL cho luồng khác giữa các bytecode (khi gọi hàm, ở cuối vòng lặp, cứ vài mili-giây), nên mọi chuỗi đọc–sửa–ghi dài hơn một bytecode đều là race — còn chuyện một dòng ngắn tình cờ qua được thì tuỳ phiên bản CPython (không phải lời hứa; trên bản free-threaded thì chắc chắn không). Bảo vệ trạng thái dùng chung bằng <code>threading.Lock</code>, đúng như Chương 5.</p>
</div>

<h3>✍️ Tự viết: asyncio cho việc chờ, tiến trình cho việc CPU</h3>
<p>Viết một chương trình asyncio (1) gọi <code>slow.js</code> 100 lần, tối đa 10 lời gọi đang bay (<code>asyncio.Semaphore</code>), và (2) đếm số nguyên tố dưới 2 000 000 trong 4 <em>tiến trình</em> qua <code>loop.run_in_executor(ProcessPoolExecutor(4), …)</code> trong khi một coroutine "nhịp tim" 100 ms vẫn đập — bằng chứng event loop không bao giờ bị chặn. Lời giải mẫu: <code>lab/code/ch04/giai/hybrid.py</code>.</p>
${run('c44-python', 'python3 giai/hybrid.py')}
<p>Server thấy đúng 10 đang bay (100 lời gọi ÷ 10 × 100 ms ≈ 1,1 s). Phần CPU mất 1,6 s trong 4 tiến trình, và trong lúc đó nhịp tim đập 14 lần, khoảng hở dài nhất 102 ms — vòng lặp không hề khựng. Thử gọi thẳng <code>count_primes</code> trong coroutine xem: nhịp tim sẽ im bặt suốt thời gian đếm — hãy đo khoảng hở đó.</p>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một service FastAPI co ảnh người dùng tải lên ngay trong handler và gọi một API OCR bên ngoài. Một bạn "song song hoá" bằng <code>ThreadPoolExecutor(16)</code> bọc tất cả; CPU kẹt ở ~100% một lõi và lời gọi OCR xếp hàng.</p>
<ol>
<li>Chạy <code>primes.py threads 4</code> và <code>procs 4</code> dưới <code>taskset -c 0-3</code>. Trong lúc bản threads chạy, xem CPU từng luồng bằng <code>ps -L -o lwp,pcpu</code>.</li>
<li>Chạy <code>fetch.py threads 100 10</code> và <code>asyncio 100</code>; đọc đỉnh của server.</li>
<li>Chạy <code>race.py split</code> hai lần và <code>race.py lock</code>; giải thích khác biệt trong một câu.</li>
<li>Viết <code>hybrid.py</code>; rồi cố tình gọi thẳng <code>count_primes</code> trong coroutine và ghi lại khoảng hở nhịp tim dài nhất.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn nói được với bạn mình, bằng số của bạn, phần nào cần tiến trình (co ảnh), phần nào dùng luồng hoặc asyncio là ổn (gọi OCR), và vì sao bộ đếm dùng chung vẫn cần khoá dù có GIL.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['GIL (khoá toàn cục của trình thông dịch)', 'Một khoá trong CPython: chỉ luồng giữ nó mới chạy bytecode; nó được nhả ra khi chờ I/O.'],
  ['free-threaded build (bản không GIL, 3.13t/3.14t)', 'CPython dựng không có GIL (PEP 703); <code>sys._is_gil_enabled()</code> cho bạn biết.'],
  ['multiprocessing / ProcessPoolExecutor', 'Các tiến trình worker, mỗi cái một trình thông dịch và một GIL riêng; dữ liệu được pickle giữa chúng.'],
  ['pickle', 'Định dạng tuần tự hoá của Python — cách đối số và kết quả đi qua lại giữa các tiến trình.'],
  ['ThreadPoolExecutor', 'Một pool luồng; hữu ích cho I/O chặn, vô dụng cho việc CPU thuần Python dưới GIL.'],
  ['asyncio', 'Một luồng, một event loop trên epoll; <code>await</code> cho coroutine nằm chờ.'],
  ['run_in_executor', 'Chạy một hàm chặn hoặc nặng CPU trong một pool để event loop được rảnh.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Python 3.14.4 của lab có GIL; Ubuntu 26.04 không đóng gói bản free-threaded, nên ở đây không có số đo không-GIL.</li>
<li>CPU: 4 luồng 4,4 s = không tăng tốc (mỗi luồng ~25% lõi); tiến trình 3,40× trên 4 lõi, 7,05× trên 10.</li>
<li>I/O: GIL được nhả trong lúc chờ — 100 luồng 139 ms, asyncio 130 ms, asyncio 1 000 lời gọi 266 ms.</li>
<li>GIL không bảo vệ dữ liệu của bạn: đọc → gọi → ghi mất 1,2–1,4 triệu trong 4 triệu lần cập nhật; một Lock đã sửa được.</li>
<li>Luật: tiến trình cho CPU, luồng hoặc asyncio cho việc chờ, <code>run_in_executor</code> để trộn hai thứ mà không chặn vòng lặp.</li>
</ul>
${L('https://docs.python.org/3/howto/free-threading-python.html', '🐍', 'Python docs — Free-threaded CPython', 'Cách cài và kiểm một bản không GIL, và điều gì thay đổi.', 'Mở')}
${L('https://docs.python.org/3/library/multiprocessing.html', '🐍', 'Python docs — multiprocessing', 'Pool, Process, cách khởi động và thứ gì bị pickle.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 4.5 — Đo lại: Amdahl, Gustafson, số luồng ───────────────────────── */
    {
      title: '4.5 — Measuring it: Amdahl, Gustafson, Karp–Flatt, thread count, four languages|||4.5 — Đo lại: Amdahl, Gustafson, Karp–Flatt, số luồng, bốn ngôn ngữ',
      slug: 'os-4-5-so-sanh',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Một chương trình có phần tuần tự biết trước, đo trên 1–10 lõi: 10% tuần tự ⇒ 4,97× (Amdahl dự đoán 5,26×), 25% ⇒ 3,02× (3,08×); Gustafson: 10 lõi làm 9,1× việc trong 1,19× thời gian; Karp–Flatt đọc lại 10,6–11,8%; công thức N_cpu × (1 + W/C) thử trên pool thật (2, 10, 100 luồng); bảng đếm số nguyên tố bằng C, Java, Node, Python trên 1 và 4 lõi.',
      content: `${G45}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.5</span>
<h2>Before you add cores, know how much they can possibly give</h2>
<p class="lead">You have now measured speedup curves in four languages, and every one of them bent. Two laws from the 1960s and 1980s predict how much they bend, and one formula tells you how many threads a pool needs. This lesson builds a program whose serial part we control, checks the laws against real measurements, reads the serial fraction back from them, and ends with the four languages in one table. The question: <strong>before you buy more cores or start more threads, how do you know what you will get?</strong></p>

<h3>A program with a known serial part</h3>
<p><code>amdahl.c</code> does 4 000 identical units of CPU work. The first S% of them run on one thread (think: read the input, parse the config, merge the results); the rest are pulled from a queue by T threads. It prints the two parts separately:</p>
${src('ch04/amdahl.c', 'c')}
${run('c45-amdahl', './amdahl 1 10')}

<h3>Amdahl's law: the serial part sets a ceiling</h3>
<p>If a fraction <em>s</em> of the work can only run on one core, then with <em>n</em> cores the best possible speedup is</p>
<p style="text-align:center"><strong>S(n) = 1 / (s + (1 − s) / n)</strong></p>
<p>and as <em>n</em> grows without limit, S approaches <strong>1/s</strong>: 10% serial can never be more than 10× faster, 25% serial never more than 4×, no matter how many cores you buy. Measured against the formula (<code>predict.py</code> prints the theory):</p>
${run('c45-amdahl', './sweep.sh "./amdahl {k} 0"')}
${run('c45-amdahl', './sweep.sh "./amdahl {k} 10" 1 2 4 8 10', 2)}
${run('c45-amdahl', './sweep.sh "./amdahl {k} 25"', 2)}
<table>
<tr><th>cores</th><th>0% serial</th><th>10%: measured</th><th>10%: Amdahl</th><th>25%: measured</th><th>25%: Amdahl</th></tr>
<tr><td>2</td><td>1.96×</td><td>1.82×</td><td>1.82×</td><td>1.62×</td><td>1.60×</td></tr>
<tr><td>4</td><td>3.86×</td><td>3.04×</td><td>3.08×</td><td>2.28×</td><td>2.29×</td></tr>
<tr><td>8</td><td>7.53×</td><td>4.59×</td><td>4.71×</td><td>2.93×</td><td>2.91×</td></tr>
<tr><td>10</td><td>8.59×</td><td>4.97×</td><td>5.26×</td><td>3.02×</td><td>3.08×</td></tr>
</table>
<p>At 25% the formula is almost exact. At 10% the measurement falls a little below it on 8–10 cores, because Amdahl assumes the parallel part scales perfectly — and the 0%-serial run shows it does not quite here (8.59× on 10 cores: the two efficiency cores and the neighbours from lesson 4.1). Notice how brutal the law is: a quarter of serial work turns 10 cores into 3×. That is why profiling the serial part — the single-threaded startup, the one lock everyone takes, the final merge — often buys more than another 10 cores.</p>
${lab('amdahl', 'amdahl', 'en', 'Drag the serial part s and the core count n: the Amdahl curve flattens towards the ceiling 1/s, and the measured points of this lesson (0 %, 10 %, 25 %) sit on or just under it. Notice that at s = 25 % no number of cores ever gets past 4×.', { tour: 'amdahl-ceiling' })}

<h3>Gustafson's law: more cores, more work</h3>
<p>Amdahl fixes the problem and asks how fast it gets. In practice we often fix the <em>time</em> and grow the problem with the machine — more users, bigger images, a longer log. With <code>grow</code>, the parallel part becomes T times bigger while the serial part stays the same:</p>
${run('c45-amdahl', 'for k in 1 2 4 8 10; do taskset')}
<p>10 threads did <strong>9.1 times the work</strong> (36 400 units instead of 4 000) in only <strong>1.19 times the time</strong> (3 612 vs 3 048 ms): a scaled speedup of about 7.7×. Gustafson's law, <strong>S(n) = s + (1 − s) · n</strong>, predicts 9.1× for 10% serial; the gap is again the imperfect parallel part. Both laws are right — they answer different questions: <em>how much faster</em> (Amdahl) and <em>how much more</em> (Gustafson).</p>
${lab('amdahl', 'gustafson', 'en', 'The same s, the other question: Gustafson grows the job with the machine, S(n) = s + (1 − s)·n. Compare the straight Gustafson line with the flat Amdahl curve and find the grow run (4 000 → 36 400 units) on the chart.')}

<h3>Karp–Flatt: read the serial fraction off your own numbers</h3>
<p>Real programs do not tell you their <em>s</em>. Turn the formula around: from a measured speedup S on n cores, the <strong>Karp–Flatt metric</strong> <em>e = (1/S − 1/n) / (1 − 1/n)</em> is the serial fraction that would explain it. If <em>e</em> stays flat as n grows, you have a classic serial part; if it rises, something grows with the number of threads (a lock, memory bandwidth, slower extra cores):</p>
${run('c45-amdahl', './sweep.sh "./amdahl {k} 10" 1 2 4 8 10 | python3')}
${run('c45-amdahl', './sweep.sh "./primes queue {k} 20000000" 1 2 4 8 10 | python3')}
<p>For <code>amdahl.c</code> it found 10.6–11.8% — the 10% we built in, plus a little overhead. For lesson 4.1's work queue: 0.8–3%, almost nothing serial, which is why it scaled so well. The jump to 3.0% at 10 cores is the efficiency-core effect showing up as "serial".</p>
${lab('amdahl', 'karp', 'en', 'Karp–Flatt on a sweep table: the amdahl 10 % run and the prime-counting runs of lesson 4.1 are preloaded. Read e for each core count — flat means a classic serial part, rising means something grows with the threads — then paste your own sweep.sh output and read the 16/32/64-core prediction.', { tour: 'amdahl-karp' })}

<div class="pitfall co-tieu-de">
<p><strong>"It got 3× faster on 4 cores, so it will be 30× faster on 40."</strong> Extrapolating a speedup linearly is the most common way to overspend on hardware. Measured above: the 10%-serial program gave 3.04× on 4 cores — and Amdahl with the Karp–Flatt fraction says ~5.8× on 16 cores and under 8.6× on <em>any</em> number. Measure on at least three core counts, compute <em>e</em>, and predict from that.</p>
</div>
${lab('threadpool', 'mm1', 'en', 'The queueing side of the same question: one server, random arrivals. Push utilisation towards 100% and watch waiting time explode long before the server is "full".', { tour: 'threadpool-start' })}

<h3>How many threads should a pool have?</h3>
<p>For CPU work the answer is "the number of cores" — more threads only add context switches (lesson 3.3). For work that waits, Brian Goetz's rule (<em>Java Concurrency in Practice</em>) is</p>
<p style="text-align:center"><strong>N<sub>threads</sub> ≈ N<sub>cpu</sub> × U × (1 + W / C)</strong></p>
<p>with W the time a task waits, C the time it computes, and U the CPU utilisation you want (here 1). <code>Sizing.java</code> runs 200 tasks that burn exactly C ms of <em>thread CPU time</em> and then sleep W ms, on pools of different sizes, pinned to 2 cores:</p>
${src('ch04/Sizing.java', 'java')}
${run('c45-amdahl', 'taskset -c 0-1 java Sizing.java 10 0')}
${run('c45-amdahl', 'taskset -c 0-1 java Sizing.java 10 40')}
${run('c45-amdahl', 'taskset -c 0-1 java Sizing.java 2 98')}
<ul>
<li><strong>W/C = 0</strong> (pure CPU): 2 threads = 199 tasks/s, the ceiling of 2 cores ÷ 10 ms. 4 and 8 threads add nothing.</li>
<li><strong>W/C = 4</strong>: formula 2 × 5 = 10. At 10 threads 149/s, the plateau (186–191/s, close to the 200/s ceiling) from 16. The formula gives the knee; a little above it absorbs the randomness of real timing.</li>
<li><strong>W/C = 49</strong>: formula 100. 100 threads: 600/s; 200 threads: 552/s — past the optimum, more threads only cost.</li>
</ul>
${lab('threadpool', 'overload', 'en', 'Too few workers for the arrival rate: the queue grows without bound and p99 explodes. Add workers until the queue drains — then notice the cores become the limit.')}
<p>Lesson 4.2's HTTP calls fit this exactly: C ≈ 0, W = 100 ms ⇒ the formula says "as many as you have calls" — which is why virtual threads, which make waiting threads cheap, are the natural answer there.</p>

<h3>Four languages, one table</h3>
<p>Primes below 2 000 000 — a small job — on 1 core and on 4, each the best of three runs:</p>
${run('c45-amdahl', './best3.sh taskset -c 0 ./primes seq', 4)}
<table>
<tr><th>Primes below 2 000 000</th><th>1 core</th><th>4 cores</th><th>Speedup</th><th>vs C on 1 core</th></tr>
<tr><td>C, pthreads + queue</td><td>81 ms</td><td>22 ms</td><td>3.7×</td><td>1×</td></tr>
<tr><td>Java, fixed pool</td><td>90 ms</td><td>32 ms</td><td>2.8×</td><td>1.1×</td></tr>
<tr><td>Node, worker_threads</td><td>124 ms</td><td>61 ms</td><td>2.0×</td><td>1.5×</td></tr>
<tr><td>Python, threading</td><td>4 330 ms</td><td>4 362 ms</td><td>1.0×</td><td>53×</td></tr>
<tr><td>Python, multiprocessing</td><td>4 330 ms</td><td>1 299 ms</td><td>3.3×</td><td>53×</td></tr>
</table>
<p>Two different lessons sit in this table. <strong>Speedup</strong> is about the parallel design — and on a job this small, start-up is a big serial part: Node's workers each boot a V8 isolate, so 4 cores only doubled the speed (on 20 million it reached 3.7×, lesson 4.3). <strong>The last column</strong> is about the language: Python's processes scale well, from a start 53 times slower than C. Four Python processes are still 16 times slower than <em>one</em> C thread. Sometimes the best "parallelisation" is a faster language or algorithm for the hot loop — exactly what NumPy does for Python.</p>

<h3>✍️ Write it yourself: Karp–Flatt on your own program</h3>
<p>Write <code>karp.py</code>: it reads the table that <code>sweep.sh</code> prints (or a string like <code>"1:3115 2:1870 4:1171"</code>), prints the Karp–Flatt <em>e</em> for every core count, and predicts the speedup on 16, 32 and 64 cores with Amdahl's law using the <em>e</em> of the largest run. Use it on <code>amdahl.c</code> and on one program of your own from lessons 4.1–4.4. Reference solution: <code>lab/code/ch04/giai/karp.py</code>; its output for <code>amdahl.c</code> is the first Karp–Flatt block above (ceiling 8.6×; 5.8× predicted on 16 cores).</p>

<h3>If you have done OSG202</h3>
<p>Amdahl's law is in the OSG202 syllabus as a formula to apply. Here you saw it hold within a few percent on a real program — and saw its blind spot: it assumes the parallel part scales perfectly, which unequal cores and shared hardware do not.</p>
${L(OSG('osg202-2-2-luong-dong-bo'), '🎓', 'OSG202 · 2.2 — Threads &amp; synchronization', 'Multicore programming and Amdahl’s law as the exam asks it.', 'Open')}

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> your team's report generator takes 60 s on a 4-core VM: 12 s to load data (single-threaded), 48 s to compute (parallel). Management offers a 32-core machine and expects "8× faster". You need a prediction before the purchase.</p>
<ol>
<li>Compute with Amdahl: s = 12/60. What is the predicted time on 32 cores, and the ceiling?</li>
<li>Reproduce the situation with <code>./amdahl T 20</code> on 1, 2, 4, 8, 10 cores and run the output through <code>karp.py</code>. Is <em>e</em> flat or rising?</li>
<li>Run <code>Sizing.java</code> with your own C and W (for example C = 5, W = 45) on 2 cores; compare the best pool size with the formula.</li>
<li>Write two sentences for management: what 32 cores will give, and what to fix first instead.</li>
</ol>
<p><strong>Done when:</strong> your Amdahl prediction (about 4.4× on 32 cores, ceiling 5×) matches the trend of your own sweep within ~15%, and you can point at the serial load step as the thing to optimise first.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['Amdahl’s law', 'Fixed problem: S(n) = 1 / (s + (1 − s)/n); the speedup can never exceed 1/s.'],
  ['Gustafson’s law', 'Problem grows with n: scaled speedup s + (1 − s)·n — more cores, more work in the same time.'],
  ['strong / weak scaling', 'Same job on more cores (Amdahl) vs a proportionally bigger job on more cores (Gustafson).'],
  ['serial fraction (phần tuần tự)', 'The share of the work that can only run on one core.'],
  ['Karp–Flatt metric', 'e = (1/S − 1/n)/(1 − 1/n): the serial fraction implied by a measured speedup.'],
  ['N × (1 + W/C)', 'Thread-pool size rule: cores times one plus waiting time over computing time.'],
  ['knee (khúc gãy)', 'The point where adding threads stops adding throughput.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Amdahl held: 25% serial → 3.02× on 10 cores (formula 3.08×); 10% → 4.97× (5.26×). The ceiling is 1/s whatever you buy.</li>
<li>Gustafson: with the work growing, 10 cores did 9.1× the work in 1.19× the time.</li>
<li>Karp–Flatt read the serial fraction back: 10.6–11.8% for the 10% program, 0.8–3% for the prime queue.</li>
<li>Thread count: pure CPU → cores (2); W/C = 4 → knee at the formula’s 10, plateau from 16; W/C = 49 → best at 100.</li>
<li>Four languages: C 3.7×, Java 2.8×, Node 2.0× (start-up on a small job), Python threads 1.0×, Python processes 3.3× from a start 53× slower than C.</li>
</ul>
${L('https://en.wikipedia.org/wiki/Amdahl%27s_law', '📘', 'Amdahl’s law', 'Derivation, the 1/s limit, and its relation to Gustafson’s law.', 'Open')}
${L('https://en.wikipedia.org/wiki/Karp%E2%80%93Flatt_metric', '📘', 'Karp–Flatt metric', 'Measuring the experimentally determined serial fraction.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.5</span>
<h2>Trước khi thêm lõi, hãy biết chúng tối đa cho được bao nhiêu</h2>
<p class="lead">Bạn đã đo đường speedup bằng bốn ngôn ngữ, và đường nào cũng cong. Hai định luật từ thập niên 1960 và 1980 dự đoán chúng cong bao nhiêu, và một công thức cho biết một pool cần bao nhiêu luồng. Bài này dựng một chương trình có phần tuần tự do ta điều khiển, đem các định luật đối chiếu với số đo thật, đọc ngược phần tuần tự từ chính số đo, và kết thúc bằng bốn ngôn ngữ trong một bảng. Câu hỏi: <strong>trước khi mua thêm lõi hay mở thêm luồng, làm sao biết mình sẽ được gì?</strong></p>

<h3>Một chương trình có phần tuần tự biết trước</h3>
<p><code>amdahl.c</code> làm 4 000 đơn vị việc CPU giống hệt nhau. S% đầu tiên chạy trên một luồng (hình dung: đọc input, phân tích cấu hình, gộp kết quả); phần còn lại được T luồng kéo từ một hàng đợi. Nó in riêng hai phần:</p>
${src('ch04/amdahl.c', 'c')}
${run('c45-amdahl', './amdahl 1 10')}

<h3>Định luật Amdahl: phần tuần tự đặt ra cái trần</h3>
<p>Nếu một phần <em>s</em> của việc chỉ chạy được trên một lõi, thì với <em>n</em> lõi, speedup tốt nhất có thể là</p>
<p style="text-align:center"><strong>S(n) = 1 / (s + (1 − s) / n)</strong></p>
<p>và khi <em>n</em> tăng mãi, S tiến tới <strong>1/s</strong>: 10% tuần tự không bao giờ nhanh hơn quá 10 lần, 25% tuần tự không bao giờ quá 4 lần, dù bạn mua bao nhiêu lõi. Đo đối chiếu với công thức (<code>predict.py</code> in phần lý thuyết):</p>
${run('c45-amdahl', './sweep.sh "./amdahl {k} 0"')}
${run('c45-amdahl', './sweep.sh "./amdahl {k} 10" 1 2 4 8 10', 2)}
${run('c45-amdahl', './sweep.sh "./amdahl {k} 25"', 2)}
<table>
<tr><th>số lõi</th><th>0% tuần tự</th><th>10%: đo</th><th>10%: Amdahl</th><th>25%: đo</th><th>25%: Amdahl</th></tr>
<tr><td>2</td><td>1,96×</td><td>1,82×</td><td>1,82×</td><td>1,62×</td><td>1,60×</td></tr>
<tr><td>4</td><td>3,86×</td><td>3,04×</td><td>3,08×</td><td>2,28×</td><td>2,29×</td></tr>
<tr><td>8</td><td>7,53×</td><td>4,59×</td><td>4,71×</td><td>2,93×</td><td>2,91×</td></tr>
<tr><td>10</td><td>8,59×</td><td>4,97×</td><td>5,26×</td><td>3,02×</td><td>3,08×</td></tr>
</table>
<p>Ở 25% công thức gần như chính xác. Ở 10% số đo thấp hơn công thức một chút trên 8–10 lõi, vì Amdahl giả định phần song song mở rộng hoàn hảo — và lượt 0% tuần tự cho thấy ở đây nó không hẳn vậy (8,59× trên 10 lõi: hai lõi tiết kiệm điện và hàng xóm của bài 4.1). Để ý định luật khắc nghiệt cỡ nào: một phần tư việc tuần tự biến 10 lõi thành 3×. Vì thế đo hồ sơ phần tuần tự — đoạn khởi động một luồng, cái khoá ai cũng lấy, bước gộp cuối — thường được lợi hơn thêm 10 lõi.</p>
${lab('amdahl', 'amdahl', 'vi', 'Kéo phần tuần tự s và số lõi n: đường Amdahl dẹt dần về trần 1/s, và các chấm đo thật của bài này (0 %, 10 %, 25 %) nằm trên hoặc ngay dưới nó. Để ý: với s = 25 % thì bao nhiêu lõi cũng không vượt nổi 4×.', { tour: 'amdahl-ceiling' })}

<h3>Định luật Gustafson: thêm lõi, thêm việc</h3>
<p>Amdahl giữ cố định bài toán và hỏi nó nhanh lên bao nhiêu. Thực tế ta hay giữ cố định <em>thời gian</em> và cho bài toán lớn theo máy — thêm người dùng, ảnh lớn hơn, log dài hơn. Với <code>grow</code>, phần song song lớn gấp T lần còn phần tuần tự giữ nguyên:</p>
${run('c45-amdahl', 'for k in 1 2 4 8 10; do taskset')}
<p>10 luồng làm <strong>gấp 9,1 lần khối việc</strong> (36 400 đơn vị thay vì 4 000) trong chỉ <strong>1,19 lần thời gian</strong> (3 612 so với 3 048 ms): speedup theo quy mô khoảng 7,7×. Định luật Gustafson, <strong>S(n) = s + (1 − s) · n</strong>, dự đoán 9,1× cho 10% tuần tự; khoảng chênh lại là phần song song không hoàn hảo. Cả hai định luật đều đúng — chúng trả lời hai câu khác nhau: <em>nhanh hơn bao nhiêu</em> (Amdahl) và <em>làm được thêm bao nhiêu</em> (Gustafson).</p>
${lab('amdahl', 'gustafson', 'vi', 'Cùng s, câu hỏi kia: Gustafson cho bài toán lớn theo máy, S(n) = s + (1 − s)·n. So đường thẳng Gustafson với đường Amdahl dẹt và tìm lượt grow (4 000 → 36 400 đơn vị) trên biểu đồ.')}

<h3>Karp–Flatt: đọc phần tuần tự từ chính số đo của bạn</h3>
<p>Chương trình thật không nói cho bạn <em>s</em> của nó. Lật ngược công thức: từ speedup S đo được trên n lõi, <strong>chỉ số Karp–Flatt</strong> <em>e = (1/S − 1/n) / (1 − 1/n)</em> là phần tuần tự đủ để giải thích nó. Nếu <em>e</em> đứng yên khi n tăng, bạn có một phần tuần tự kinh điển; nếu nó tăng, có thứ gì đó lớn lên theo số luồng (một cái khoá, băng thông bộ nhớ, những lõi thêm vào chậm hơn):</p>
${run('c45-amdahl', './sweep.sh "./amdahl {k} 10" 1 2 4 8 10 | python3')}
${run('c45-amdahl', './sweep.sh "./primes queue {k} 20000000" 1 2 4 8 10 | python3')}
<p>Với <code>amdahl.c</code> nó tìm ra 10,6–11,8% — đúng 10% ta cài vào, cộng một chút chi phí. Với hàng đợi việc của bài 4.1: 0,8–3%, gần như không có gì tuần tự, nên nó mới mở rộng tốt như thế. Cú nhảy lên 3,0% ở 10 lõi là hiệu ứng lõi tiết kiệm điện hiện ra dưới dạng "tuần tự".</p>
${lab('amdahl', 'karp', 'vi', 'Karp–Flatt trên một bảng sweep: nạp sẵn lượt amdahl 10 % và các lượt đếm số nguyên tố của bài 4.1. Đọc e ở từng số lõi — đứng yên là phần tuần tự kinh điển, tăng dần là có thứ lớn lên theo số luồng — rồi dán output sweep.sh của chính bạn và đọc dự đoán 16/32/64 lõi.', { tour: 'amdahl-karp' })}

<div class="pitfall co-tieu-de">
<p><strong>"Trên 4 lõi nó nhanh gấp 3, vậy trên 40 lõi sẽ nhanh gấp 30."</strong> Ngoại suy speedup theo đường thẳng là cách phổ biến nhất để mua thừa phần cứng. Đo ở trên: chương trình 10% tuần tự cho 3,04× trên 4 lõi — và Amdahl với phần Karp–Flatt nói ~5,8× trên 16 lõi và dưới 8,6× trên <em>bất kỳ</em> số lõi nào. Hãy đo ở ít nhất ba mức lõi, tính <em>e</em>, rồi dự đoán từ đó.</p>
</div>
${lab('threadpool', 'mm1', 'vi', 'Phía hàng đợi của cùng câu hỏi: một máy phục vụ, request đến ngẫu nhiên. Đẩy mức bận về gần 100% và xem thời gian chờ bùng nổ từ rất lâu trước khi máy "đầy".', { tour: 'threadpool-start' })}

<h3>Một pool nên có bao nhiêu luồng?</h3>
<p>Với việc CPU câu trả lời là "bằng số lõi" — thêm luồng chỉ thêm chuyển ngữ cảnh (bài 3.3). Với việc có chờ, luật của Brian Goetz (<em>Java Concurrency in Practice</em>) là</p>
<p style="text-align:center"><strong>N<sub>luồng</sub> ≈ N<sub>cpu</sub> × U × (1 + W / C)</strong></p>
<p>với W là thời gian một việc chờ, C là thời gian nó tính, U là mức bận CPU bạn muốn (ở đây 1). <code>Sizing.java</code> chạy 200 việc, mỗi việc đốt đúng C ms <em>thời gian CPU của luồng</em> rồi ngủ W ms, trên các pool cỡ khác nhau, ghim vào 2 lõi:</p>
${src('ch04/Sizing.java', 'java')}
${run('c45-amdahl', 'taskset -c 0-1 java Sizing.java 10 0')}
${run('c45-amdahl', 'taskset -c 0-1 java Sizing.java 10 40')}
${run('c45-amdahl', 'taskset -c 0-1 java Sizing.java 2 98')}
<ul>
<li><strong>W/C = 0</strong> (thuần CPU): 2 luồng = 199 việc/giây, đúng trần 2 lõi ÷ 10 ms. 4 và 8 luồng không thêm gì.</li>
<li><strong>W/C = 4</strong>: công thức 2 × 5 = 10. Ở 10 luồng được 149/giây, đi ngang (186–191/giây, sát trần 200/giây) từ 16. Công thức cho ra khúc gãy; nhỉnh hơn nó một chút để hấp thụ độ ngẫu nhiên của thời gian thật.</li>
<li><strong>W/C = 49</strong>: công thức 100. 100 luồng: 600/giây; 200 luồng: 552/giây — đã qua điểm tốt nhất, thêm luồng chỉ tốn thêm.</li>
</ul>
${lab('threadpool', 'overload', 'vi', 'Quá ít worker so với tốc độ request đến: hàng đợi phình mãi và p99 bùng nổ. Thêm worker cho tới khi hàng đợi rút — rồi để ý số lõi trở thành giới hạn.')}
<p>Các lời gọi HTTP của bài 4.2 khớp đúng công thức này: C ≈ 0, W = 100 ms ⇒ công thức nói "bao nhiêu lời gọi thì bấy nhiêu luồng" — đó là lý do virtual thread, thứ làm luồng đang chờ trở nên rẻ, là câu trả lời tự nhiên ở đó.</p>

<h3>Bốn ngôn ngữ, một bảng</h3>
<p>Số nguyên tố dưới 2 000 000 — một việc nhỏ — trên 1 lõi và trên 4 lõi, mỗi cách lấy lần nhanh nhất trong ba:</p>
${run('c45-amdahl', './best3.sh taskset -c 0 ./primes seq', 4)}
<table>
<tr><th>Số nguyên tố dưới 2 000 000</th><th>1 lõi</th><th>4 lõi</th><th>Speedup</th><th>so với C trên 1 lõi</th></tr>
<tr><td>C, pthreads + hàng đợi</td><td>81 ms</td><td>22 ms</td><td>3,7×</td><td>1×</td></tr>
<tr><td>Java, pool cố định</td><td>90 ms</td><td>32 ms</td><td>2,8×</td><td>1,1×</td></tr>
<tr><td>Node, worker_threads</td><td>124 ms</td><td>61 ms</td><td>2,0×</td><td>1,5×</td></tr>
<tr><td>Python, threading</td><td>4 330 ms</td><td>4 362 ms</td><td>1,0×</td><td>53×</td></tr>
<tr><td>Python, multiprocessing</td><td>4 330 ms</td><td>1 299 ms</td><td>3,3×</td><td>53×</td></tr>
</table>
<p>Bảng này chứa hai bài học khác nhau. <strong>Speedup</strong> là chuyện thiết kế song song — và với một việc nhỏ cỡ này, khởi động là một phần tuần tự lớn: mỗi worker của Node phải dựng một isolate V8, nên 4 lõi chỉ nhân đôi được tốc độ (với 20 triệu số nó đạt 3,7×, bài 4.3). <strong>Cột cuối</strong> là chuyện ngôn ngữ: tiến trình Python mở rộng tốt, từ điểm xuất phát chậm hơn C 53 lần. Bốn tiến trình Python vẫn chậm hơn <em>một</em> luồng C 16 lần. Đôi khi cách "song song hoá" tốt nhất là một ngôn ngữ hay thuật toán nhanh hơn cho vòng lặp nóng — đúng thứ NumPy làm cho Python.</p>

<h3>✍️ Tự viết: Karp–Flatt cho chương trình của chính bạn</h3>
<p>Viết <code>karp.py</code>: đọc bảng mà <code>sweep.sh</code> in ra (hoặc một chuỗi kiểu <code>"1:3115 2:1870 4:1171"</code>), in <em>e</em> Karp–Flatt cho từng số lõi, và dự đoán speedup trên 16, 32 và 64 lõi bằng định luật Amdahl với <em>e</em> của lượt lớn nhất. Dùng nó cho <code>amdahl.c</code> và cho một chương trình của bạn ở bài 4.1–4.4. Lời giải mẫu: <code>lab/code/ch04/giai/karp.py</code>; output của nó cho <code>amdahl.c</code> là khối Karp–Flatt đầu tiên ở trên (trần 8,6×; dự đoán 5,8× trên 16 lõi).</p>

<h3>Nếu bạn đã học OSG202</h3>
<p>Định luật Amdahl nằm trong giáo trình OSG202 như một công thức để áp dụng. Ở đây bạn đã thấy nó đúng tới vài phần trăm trên một chương trình thật — và thấy cả điểm mù của nó: nó giả định phần song song mở rộng hoàn hảo, điều mà lõi không đều và phần cứng dùng chung không cho phép.</p>
${L(OSG('osg202-2-2-luong-dong-bo'), '🎓', 'OSG202 · 2.2 — Luồng &amp; đồng bộ hoá', 'Lập trình đa lõi và định luật Amdahl đúng cách đề thi hỏi.', 'Mở')}

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> bộ sinh báo cáo của nhóm mất 60 s trên VM 4 lõi: 12 s nạp dữ liệu (một luồng), 48 s tính toán (song song). Sếp đề nghị máy 32 lõi và chờ "nhanh gấp 8". Bạn cần một dự đoán trước khi mua.</p>
<ol>
<li>Tính bằng Amdahl: s = 12/60. Thời gian dự đoán trên 32 lõi là bao nhiêu, và trần là bao nhiêu?</li>
<li>Tái hiện tình huống bằng <code>./amdahl T 20</code> trên 1, 2, 4, 8, 10 lõi rồi đưa output qua <code>karp.py</code>. <em>e</em> đứng yên hay tăng?</li>
<li>Chạy <code>Sizing.java</code> với C và W của riêng bạn (ví dụ C = 5, W = 45) trên 2 lõi; so cỡ pool tốt nhất với công thức.</li>
<li>Viết hai câu gửi sếp: 32 lõi sẽ mang lại gì, và nên sửa cái gì trước.</li>
</ol>
<p><strong>Đạt khi:</strong> dự đoán Amdahl của bạn (khoảng 4,4× trên 32 lõi, trần 5×) khớp xu hướng của lượt sweep của chính bạn trong khoảng ~15%, và bạn chỉ ra được bước nạp dữ liệu tuần tự là thứ cần tối ưu trước.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Amdahl’s law (định luật Amdahl)', 'Bài toán cố định: S(n) = 1 / (s + (1 − s)/n); speedup không bao giờ vượt 1/s.'],
  ['Gustafson’s law (định luật Gustafson)', 'Bài toán lớn theo n: speedup theo quy mô s + (1 − s)·n — thêm lõi, thêm việc trong cùng thời gian.'],
  ['strong / weak scaling (mở rộng mạnh / yếu)', 'Cùng việc trên nhiều lõi hơn (Amdahl) vs việc lớn tương ứng trên nhiều lõi hơn (Gustafson).'],
  ['serial fraction (phần tuần tự)', 'Phần việc chỉ chạy được trên một lõi.'],
  ['Karp–Flatt metric (chỉ số Karp–Flatt)', 'e = (1/S − 1/n)/(1 − 1/n): phần tuần tự suy ra từ một speedup đo được.'],
  ['N × (1 + W/C)', 'Luật chọn cỡ thread pool: số lõi nhân với một cộng thời gian chờ chia thời gian tính.'],
  ['knee (khúc gãy)', 'Điểm mà thêm luồng không còn thêm thông lượng.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Amdahl đúng: 25% tuần tự → 3,02× trên 10 lõi (công thức 3,08×); 10% → 4,97× (5,26×). Trần là 1/s dù bạn mua gì.</li>
<li>Gustafson: khi việc lớn theo, 10 lõi làm gấp 9,1 lần việc trong 1,19 lần thời gian.</li>
<li>Karp–Flatt đọc ngược ra phần tuần tự: 10,6–11,8% cho chương trình 10%, 0,8–3% cho hàng đợi số nguyên tố.</li>
<li>Số luồng: thuần CPU → bằng số lõi (2); W/C = 4 → khúc gãy ở con số 10 của công thức, đi ngang từ 16; W/C = 49 → tốt nhất ở 100.</li>
<li>Bốn ngôn ngữ: C 3,7×, Java 2,8×, Node 2,0× (khởi động trên việc nhỏ), Python luồng 1,0×, Python tiến trình 3,3× từ điểm xuất phát chậm hơn C 53 lần.</li>
</ul>
${L('https://en.wikipedia.org/wiki/Amdahl%27s_law', '📘', 'Định luật Amdahl', 'Dẫn xuất, giới hạn 1/s và quan hệ với định luật Gustafson.', 'Mở')}
${L('https://en.wikipedia.org/wiki/Karp%E2%80%93Flatt_metric', '📘', 'Chỉ số Karp–Flatt', 'Đo phần tuần tự xác định bằng thực nghiệm.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 4.6 — False sharing ───────────────────────── */
    {
      title: '4.6 — False sharing: threads that share nothing and still slow each other down|||4.6 — False sharing: các luồng không chung gì mà vẫn làm chậm nhau',
      slug: 'os-4-6-false-sharing',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Mỗi luồng chỉ tăng bộ đếm của riêng nó: 4 luồng với bộ đếm sát nhau 398 ms so với 179 ms khi cách 128 byte, 8 luồng 777 so với 192 ms; getconf báo dòng cache 64 byte nhưng Apple M1 cần đệm 128; perf stat thấy CPU bận gấp đôi mà không ai ngủ; bài tự viết bằng Java: AtomicLongArray sát nhau 6 s, có đệm ~1 s, LongAdder 0,4 s, biến cục bộ 25 ms.',
      content: `${G46}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.6</span>
<h2>The bug with no race, no lock and no wrong answer</h2>
<p class="lead">Chapter 5 teaches the bugs you get when threads share data. This lesson is about the strange opposite: threads that share <em>nothing</em> in the code — each writes only its own counter — and still slow each other down, sometimes by 4× or more, while every result stays correct. The question: <strong>how can private data be shared, and how do you find and fix it?</strong> The answer is below your code, in how the CPU caches memory.</p>

<h3>The program: one counter per thread</h3>
<p>T threads, each increments <em>its own</em> <code>long</code> 100 million times. The counters live in one block of memory, <code>GAP</code> bytes apart; nothing else changes between runs:</p>
${src('ch04/fs.c', 'c')}
${run('c46-false', 'gcc -O2')}
${run('c46-false', 'for g in 8 64 128 256; do ./best3.sh taskset -c 0 ./fs 1')}
<p>One thread alone: ~172 ms, whatever the gap. With T threads on T cores, each doing the same 100 million increments on its own counter, the ideal time is still ~172 ms.</p>

<h3>Four and eight threads: the gap decides</h3>
${run('c46-false', 'for g in 8 64 128 256; do ./best3.sh taskset -c 0-3 ./fs 4')}
${run('c46-false', 'for g in 8 64 128 256; do ./best3.sh taskset -c 0-7 ./fs 8')}
${run('c46-false', './best3.sh taskset -c 0-7 ./fs 8 local')}
<p>Counters 8 bytes apart: 398 ms with 4 threads, <strong>777 ms with 8</strong> — 2.2× and 4× slower than the padded runs (179 and 192 ms, close to the one-thread time). It gets worse with every thread added. And the last line is the real fix: each thread counts in a local variable and writes its result once — 38 ms for all eight.</p>

<h3>Why: the CPU moves cache lines, not bytes</h3>
<p>A core never reads or writes a single <code>long</code> from RAM. Its cache holds memory in fixed blocks called <strong>cache lines</strong>, and a coherence protocol (MESI and its relatives) guarantees that before a core <em>writes</em> a line, it holds the only valid copy — every other core's copy is invalidated. Put four counters in one line and each increment by thread 0 invalidates the line in cores 1–3; their next increment must fetch it back, invalidating thread 0's copy… The line ping-pongs between cores at the speed of the interconnect instead of staying in L1. That is <strong>false sharing</strong>: the data is not shared, but the line is.</p>
${lab('race', 'atomic', 'en', 'Several threads updating the same memory word: even a correct atomic increment serialises them on one location. False sharing is the same queue, at the granularity of a whole cache line instead of one variable.', { tour: 'race-lost-update' })}
${lab('cacheline', 'false', 'en', 'Eight counters 8 bytes apart in one 64-byte line: step the writes and watch the line jump from core to core, each copy flipping between M and I (MESI) while the bounce counter climbs. Then move the counters apart or to local variables and watch the bouncing stop.', { tour: 'cacheline-bounce' })}

<h3>getconf says 64 — the hardware says 128</h3>
${run('c46-false', 'getconf LEVEL1_DCACHE_LINESIZE')}
<p>Linux in the VM reports a 64-byte line, and most articles say "pad to 64 bytes". Yet padding to 64 still cost 17% with 4 threads and 40% with 8; only 128 matched the single-thread time. The Mac itself answers why: <code>sysctl hw.cachelinesize</code> prints <strong>128</strong> — Apple's M1 tracks coherence in 128-byte lines, so two counters 64 bytes apart still share one. (Many x86 server CPUs also fetch 64-byte lines in adjacent pairs, which is why the JDK pads its hot fields to 128 bytes everywhere.) The lesson is the method, not the constant: <strong>sweep the gap and measure</strong>.</p>
${lab('cacheline', 'm1', 'en', 'Counters 64 bytes apart, as getconf suggests: switch the line size between 64 B (getconf) and 128 B (the real M1) and see why pairs of counters still share a line — 269 ms instead of 192.')}

<h3>The CPU was busy — doing nothing useful</h3>
${run('c46-false', 'perf stat -e task-clock,context-switches taskset -c 0-3 ./fs 4 8 ', 2)}
<p>Same work, same result: 1 430 ms of CPU for the side-by-side counters vs 713 ms padded, with only 14 and 7 context switches. Nobody slept, nobody waited on a lock — the cores were <em>stalled</em> on memory, and every monitoring tool would show them 100% busy. That is what makes false sharing hard to find: it hides inside "CPU usage".</p>

<div class="pitfall co-tieu-de">
<p><strong>"Each thread has its own slot in the array, so there is no contention."</strong> Per-thread slots in one array — <code>long hits[NTHREADS]</code>, a stats array indexed by worker id, a Java <code>AtomicLongArray</code> — are the classic false-sharing layout. Symptoms: speedup that <em>falls</em> as you add threads, CPU at 100%, no lock in the hot loop. Measured here: 8 threads on neighbouring slots were 4× slower than padded slots and 20× slower than local accumulation.</p>
</div>

<h3>✍️ Write it yourself: the same bug in Java</h3>
<p>Write <code>FalseShare.java</code>: four threads each increment their own slot 50 million times, four ways — (1) slots 0, 1, 2, 3 of an <code>AtomicLongArray</code>; (2) slots 0, 16, 32, 48 (16 longs = 128 bytes apart); (3) one shared <code>LongAdder</code>; (4) a local <code>long</code>, added to the total once at the end. Reference solution: <code>lab/code/ch04/giai/FalseShare.java</code>.</p>
${run('c46-false', 'taskset -c 0-3 java giai/FalseShare.java')}
<p>Neighbouring atomic slots: 6.1 s. Padded: 1.1 s. <code>LongAdder</code> — the JDK's striped counter, whose internal cells are padded with <code>@Contended</code> — 0.39 s for <em>one</em> logical counter shared by all four threads. Local variables: 25 ms. The order of the fixes is the order of preference: <strong>don't share</strong> (local, publish once); use a <strong>striped</strong> structure (<code>LongAdder</code>, per-CPU counters in the kernel); and only if a shared array is unavoidable, <strong>pad</strong> to the measured line size.</p>
${lab('cacheline', 'java', 'en', 'The four Java variants side by side — adjacent AtomicLongArray slots, padded by 16 longs, LongAdder, local and add once. Step the writes for each and match the bounce count to the measured 6 086 / 1 064 / 385 / 25 ms.')}

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a metrics library keeps <code>long requests[NUM_WORKERS]</code>, and each worker thread increments its own slot on every request. Going from 4 to 8 workers made the service <em>slower</em>, CPU is at 100%, and the profiler shows no lock.</p>
<ol>
<li>Run <code>fs</code> with 1, 4 and 8 threads for gaps 8, 64, 128, 256 (<code>best3.sh</code>, <code>taskset</code>). Plot time against gap.</li>
<li>Run the two <code>perf stat</code> lines; compare task-clock and context switches.</li>
<li>Change <code>fs.c</code> so each slot is a <code>struct { long v; char pad[120]; }</code> — or use <code>_Alignas(128)</code> — and confirm the 8-byte case disappears.</li>
<li>Write <code>FalseShare.java</code> and rank the four variants.</li>
</ol>
<p><strong>Done when:</strong> you can show that time depends only on the gap (not on any lock), name the line size that removes the effect on <em>this</em> machine, and propose the fix for the metrics library (per-thread local counting or a <code>LongAdder</code>).</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['cache line (dòng cache)', 'The unit in which caches hold and move memory: 64 bytes on most x86, 128 bytes for coherence on Apple M1.'],
  ['cache coherence / MESI', 'The protocol that keeps all cores’ copies consistent; a core must own a line exclusively to write it.'],
  ['false sharing', 'Different threads write different variables that sit in the same cache line, so the line bounces between cores.'],
  ['padding / alignment (đệm / căn lề)', 'Spacing data so each hot variable gets its own line: <code>_Alignas(128)</code>, filler bytes, slots 16 longs apart.'],
  ['striped counter (bộ đếm phân mảnh)', 'Several padded cells summed on read — Java’s <code>LongAdder</code>, per-CPU counters in the kernel.'],
  ['local accumulation', 'Each thread works in its own variable and publishes the result once — no sharing at all.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Threads that never touch each other’s data still slowed down: 4 threads 398 vs 179 ms, 8 threads 777 vs 192 ms, depending only on the gap.</li>
<li>Caches move whole lines; writing a line needs exclusive ownership, so a shared line ping-pongs between cores.</li>
<li><code>getconf</code> said 64, but padding to 64 still cost 17–40%; Apple M1 needs 128. Sweep and measure.</li>
<li>perf stat: twice the CPU time for the same work, almost no context switches — false sharing hides inside “busy”.</li>
<li>Fixes in order: don’t share (local, 38 ms for 8 threads), striped counters (<code>LongAdder</code> 0.39 s), padding.</li>
</ul>
${L('https://docs.kernel.org/kernel-hacking/false-sharing.html', '📄', 'kernel.org — False Sharing', 'How the kernel finds and fixes false sharing, with real cases and tools.', 'Open')}
${L('https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/atomic/LongAdder.html', '☕', 'LongAdder (Java 21 API)', 'Why a striped counter beats AtomicLong under contention.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.6</span>
<h2>Cái lỗi không race, không khoá, không sai kết quả</h2>
<p class="lead">Chương 5 dạy những lỗi bạn gặp khi các luồng dùng chung dữ liệu. Bài này nói về chiều ngược lạ lùng: các luồng <em>không</em> dùng chung gì trong mã — mỗi luồng chỉ ghi bộ đếm của riêng nó — mà vẫn làm chậm nhau, có khi tới 4 lần hoặc hơn, trong khi mọi kết quả vẫn đúng. Câu hỏi: <strong>làm sao dữ liệu riêng lại bị chia sẻ, và tìm, sửa nó thế nào?</strong> Câu trả lời nằm bên dưới mã của bạn, ở cách CPU giữ bộ nhớ trong cache.</p>

<h3>Chương trình: mỗi luồng một bộ đếm</h3>
<p>T luồng, mỗi luồng tăng <code>long</code> <em>của chính nó</em> 100 triệu lần. Các bộ đếm nằm trong một khối bộ nhớ, cách nhau <code>GAP</code> byte; ngoài ra không có gì thay đổi giữa các lần chạy:</p>
${src('ch04/fs.c', 'c')}
${run('c46-false', 'gcc -O2')}
${run('c46-false', 'for g in 8 64 128 256; do ./best3.sh taskset -c 0 ./fs 1')}
<p>Một luồng chạy một mình: ~172 ms, dù khoảng cách là bao nhiêu. Với T luồng trên T lõi, mỗi luồng làm đúng 100 triệu lần tăng trên bộ đếm của riêng nó, thời gian lý tưởng vẫn là ~172 ms.</p>

<h3>Bốn và tám luồng: khoảng cách quyết định</h3>
${run('c46-false', 'for g in 8 64 128 256; do ./best3.sh taskset -c 0-3 ./fs 4')}
${run('c46-false', 'for g in 8 64 128 256; do ./best3.sh taskset -c 0-7 ./fs 8')}
${run('c46-false', './best3.sh taskset -c 0-7 ./fs 8 local')}
<p>Bộ đếm cách nhau 8 byte: 398 ms với 4 luồng, <strong>777 ms với 8</strong> — chậm hơn 2,2 và 4 lần so với bản có đệm (179 và 192 ms, sát thời gian một luồng). Càng thêm luồng càng tệ. Và dòng cuối là cách sửa thật: mỗi luồng đếm trong một biến cục bộ và ghi kết quả một lần — 38 ms cho cả tám.</p>

<h3>Vì sao: CPU chuyển dòng cache, không chuyển từng byte</h3>
<p>Một lõi không bao giờ đọc hay ghi một <code>long</code> lẻ từ RAM. Cache của nó giữ bộ nhớ theo các khối cố định gọi là <strong>dòng cache (cache line)</strong>, và một giao thức nhất quán (MESI và họ hàng) bảo đảm rằng trước khi một lõi <em>ghi</em> vào một dòng, nó giữ bản hợp lệ duy nhất — bản sao ở mọi lõi khác bị vô hiệu. Đặt bốn bộ đếm trong một dòng thì mỗi lần luồng 0 tăng là dòng ở lõi 1–3 bị vô hiệu; lần tăng kế tiếp của chúng phải kéo dòng về, lại vô hiệu bản của luồng 0… Dòng cache nảy qua nảy lại giữa các lõi với tốc độ của đường nối liên lõi thay vì nằm yên trong L1. Đó là <strong>false sharing (chia sẻ giả)</strong>: dữ liệu không chung, nhưng dòng cache thì chung.</p>
${lab('race', 'atomic', 'vi', 'Nhiều luồng cùng cập nhật một ô nhớ: ngay cả phép tăng nguyên tử đúng đắn cũng bắt chúng xếp hàng trên một chỗ. False sharing là cùng cái hàng đó, ở cỡ cả một dòng cache thay vì một biến.', { tour: 'race-lost-update' })}
${lab('cacheline', 'false', 'vi', 'Tám bộ đếm cách nhau 8 byte trong một dòng 64 byte: bấm từng lần ghi và xem dòng nhảy từ lõi này sang lõi khác, mỗi bản sao lật giữa M và I (MESI) trong khi bộ đếm lần nhảy tăng. Rồi giãn các bộ đếm ra hoặc chuyển sang biến cục bộ và xem dòng thôi nhảy.', { tour: 'cacheline-bounce' })}

<h3>getconf nói 64 — phần cứng nói 128</h3>
${run('c46-false', 'getconf LEVEL1_DCACHE_LINESIZE')}
<p>Linux trong VM báo dòng 64 byte, và đa số bài viết nói "đệm tới 64 byte". Vậy mà đệm tới 64 vẫn tốn thêm 17% với 4 luồng và 40% với 8; chỉ 128 mới bằng thời gian một luồng. Chính máy Mac trả lời vì sao: <code>sysctl hw.cachelinesize</code> in ra <strong>128</strong> — M1 của Apple theo dõi nhất quán theo dòng 128 byte, nên hai bộ đếm cách nhau 64 byte vẫn chung một dòng. (Nhiều CPU máy chủ x86 cũng kéo dòng 64 byte theo từng cặp kề nhau, nên JDK đệm các trường nóng tới 128 byte ở mọi nơi.) Bài học là phương pháp, không phải hằng số: <strong>quét khoảng cách và đo</strong>.</p>
${lab('cacheline', 'm1', 'vi', 'Bộ đếm cách nhau 64 byte, đúng như getconf gợi ý: đổi cỡ dòng giữa 64 B (getconf) và 128 B (M1 thật) và xem vì sao từng cặp bộ đếm vẫn chung một dòng — 269 ms thay vì 192.')}

<h3>CPU bận suốt — mà chẳng làm gì có ích</h3>
${run('c46-false', 'perf stat -e task-clock,context-switches taskset -c 0-3 ./fs 4 8 ', 2)}
<p>Cùng việc, cùng kết quả: 1 430 ms CPU cho các bộ đếm sát nhau so với 713 ms khi có đệm, chỉ 14 và 7 lần chuyển ngữ cảnh. Không ai ngủ, không ai chờ khoá — các lõi bị <em>kẹt</em> chờ bộ nhớ, và mọi công cụ giám sát đều thấy chúng bận 100%. Chính vì vậy false sharing khó tìm: nó trốn bên trong "mức dùng CPU".</p>

<div class="pitfall co-tieu-de">
<p><strong>"Mỗi luồng có ô riêng trong mảng, nên không có tranh chấp."</strong> Các ô theo từng luồng trong cùng một mảng — <code>long hits[NTHREADS]</code>, mảng thống kê đánh chỉ số theo worker, một <code>AtomicLongArray</code> của Java — chính là bố cục false sharing kinh điển. Triệu chứng: speedup <em>giảm</em> khi thêm luồng, CPU 100%, không có khoá nào trong vòng lặp nóng. Đo ở đây: 8 luồng trên các ô kề nhau chậm hơn 4 lần so với ô có đệm và chậm hơn 20 lần so với cộng dồn cục bộ.</p>
</div>

<h3>✍️ Tự viết: cùng lỗi đó bằng Java</h3>
<p>Viết <code>FalseShare.java</code>: bốn luồng, mỗi luồng tăng ô của riêng nó 50 triệu lần, theo bốn cách — (1) ô 0, 1, 2, 3 của một <code>AtomicLongArray</code>; (2) ô 0, 16, 32, 48 (cách nhau 16 long = 128 byte); (3) một <code>LongAdder</code> dùng chung; (4) một <code>long</code> cục bộ, cộng vào tổng một lần ở cuối. Lời giải mẫu: <code>lab/code/ch04/giai/FalseShare.java</code>.</p>
${run('c46-false', 'taskset -c 0-3 java giai/FalseShare.java')}
<p>Các ô atomic kề nhau: 6,1 s. Có đệm: 1,1 s. <code>LongAdder</code> — bộ đếm phân mảnh của JDK, các ô bên trong được đệm bằng <code>@Contended</code> — 0,39 s cho <em>một</em> bộ đếm logic dùng chung cả bốn luồng. Biến cục bộ: 25 ms. Thứ tự các cách sửa cũng là thứ tự nên ưu tiên: <strong>đừng chia sẻ</strong> (cục bộ, công bố một lần); dùng cấu trúc <strong>phân mảnh</strong> (<code>LongAdder</code>, bộ đếm theo CPU trong nhân); và chỉ khi buộc phải có một mảng chung mới <strong>đệm</strong> tới kích thước dòng đã đo.</p>
${lab('cacheline', 'java', 'vi', 'Bốn biến thể Java cạnh nhau — ô AtomicLongArray kề nhau, đệm 16 long, LongAdder, cục bộ rồi cộng một lần. Bấm từng lần ghi cho từng cách và khớp số lần dòng nhảy với số đo 6 086 / 1 064 / 385 / 25 ms.')}

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một thư viện metrics giữ <code>long requests[NUM_WORKERS]</code>, và mỗi luồng worker tăng ô của nó ở mỗi request. Từ 4 lên 8 worker thì service lại <em>chậm hơn</em>, CPU 100%, và profiler không thấy khoá nào.</p>
<ol>
<li>Chạy <code>fs</code> với 1, 4 và 8 luồng cho khoảng cách 8, 64, 128, 256 (<code>best3.sh</code>, <code>taskset</code>). Vẽ thời gian theo khoảng cách.</li>
<li>Chạy hai dòng <code>perf stat</code>; so task-clock và số lần chuyển ngữ cảnh.</li>
<li>Sửa <code>fs.c</code> cho mỗi ô là một <code>struct { long v; char pad[120]; }</code> — hoặc dùng <code>_Alignas(128)</code> — và xác nhận trường hợp 8 byte biến mất.</li>
<li>Viết <code>FalseShare.java</code> và xếp hạng bốn biến thể.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chỉ ra được thời gian chỉ phụ thuộc vào khoảng cách (không phải khoá nào), nêu được kích thước dòng làm hiệu ứng biến mất trên <em>chính máy này</em>, và đề xuất cách sửa cho thư viện metrics (đếm cục bộ theo luồng hoặc một <code>LongAdder</code>).</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['cache line (dòng cache)', 'Đơn vị cache giữ và chuyển bộ nhớ: 64 byte trên đa số x86, 128 byte cho nhất quán trên Apple M1.'],
  ['cache coherence / MESI (nhất quán cache)', 'Giao thức giữ bản sao của mọi lõi khớp nhau; lõi phải nắm độc quyền một dòng mới được ghi.'],
  ['false sharing (chia sẻ giả)', 'Các luồng ghi các biến khác nhau nằm chung một dòng cache, nên dòng nảy qua lại giữa các lõi.'],
  ['padding / alignment (đệm / căn lề)', 'Giãn dữ liệu để mỗi biến nóng có dòng riêng: <code>_Alignas(128)</code>, byte độn, ô cách nhau 16 long.'],
  ['striped counter (bộ đếm phân mảnh)', 'Nhiều ô có đệm, đọc thì cộng lại — <code>LongAdder</code> của Java, bộ đếm theo CPU trong nhân.'],
  ['local accumulation (cộng dồn cục bộ)', 'Mỗi luồng làm trên biến riêng rồi công bố kết quả một lần — không chia sẻ gì cả.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Các luồng không hề đụng dữ liệu của nhau vẫn chậm đi: 4 luồng 398 so với 179 ms, 8 luồng 777 so với 192 ms, chỉ tuỳ vào khoảng cách.</li>
<li>Cache chuyển cả dòng; ghi một dòng cần độc quyền, nên một dòng dùng chung nảy qua lại giữa các lõi.</li>
<li><code>getconf</code> nói 64, nhưng đệm 64 vẫn tốn thêm 17–40%; Apple M1 cần 128. Hãy quét và đo.</li>
<li>perf stat: gấp đôi thời gian CPU cho cùng việc, gần như không chuyển ngữ cảnh — false sharing trốn bên trong "bận".</li>
<li>Cách sửa theo thứ tự: đừng chia sẻ (cục bộ, 38 ms cho 8 luồng), bộ đếm phân mảnh (<code>LongAdder</code> 0,39 s), đệm.</li>
</ul>
${L('https://docs.kernel.org/kernel-hacking/false-sharing.html', '📄', 'kernel.org — False Sharing', 'Nhân Linux tìm và sửa false sharing ra sao, kèm ca thật và công cụ.', 'Mở')}
${L('https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/atomic/LongAdder.html', '☕', 'LongAdder (Java 21 API)', 'Vì sao bộ đếm phân mảnh thắng AtomicLong khi tranh chấp.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 4.7 — Đường ống, map-reduce, huỷ ───────────────────────── */
    {
      title: '4.7 — Pipelines with bounded queues, map-reduce on one machine, cancellation and timeouts|||4.7 — Đường ống với hàng đợi có giới hạn, map-reduce trên một máy, huỷ việc và hạn chờ',
      slug: 'os-4-7-pipeline',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Producer–consumer bằng Java: hàng đợi có giới hạn giữ heap ~76 MB, hàng không giới hạn 189 MB rồi với 2 triệu dòng thì hết bộ nhớ, chết câm với kết quả sai, hoặc chậm 4 lần; map-reduce đếm từ: gửi vị trí file thay vì dữ liệu (249 ms với 8 tiến trình, gửi từng dòng thì chậm 40 lần); huỷ việc là hợp tác: Java interrupt, Node AbortSignal, Python asyncio — và những thứ chỉ thôi chờ chứ không dừng việc; bài tự viết: đường ống ba tầng có hạn chót.',
      content: `${G47}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.7</span>
<h2>Splitting work is half the job — the other half is the plumbing</h2>
<p class="lead">Every program so far split one job into pieces. Real backends are shaped differently: a stream of work flows through stages (read → parse → enrich → write), results from many workers must be combined, and some work must be <em>stopped</em> because the user left or a deadline passed. Three patterns cover most of it — <strong>producer–consumer pipelines, map-reduce, and cancellation with timeouts</strong> — and each has one mistake that only shows up under load. The question: <strong>what goes between the workers, and how do you stop them?</strong> Lesson 5.2 built the bounded buffer from a mutex and condition variables, and lesson 6.3 solved it as an exam problem; here we use the ready-made ones and measure what the bound buys you.</p>

<h3>Producer–consumer: a bounded queue between stages</h3>
<p>One reader thread produces log lines fast; K consumer threads process them more slowly (a deliberately slow regex). They talk through a <code>BlockingQueue</code> — <code>ArrayBlockingQueue(1024)</code> (bounded) or <code>LinkedBlockingQueue</code> (no bound). The program ends with a "poison pill": the producer puts K <code>END</code> markers, one per consumer. A monitor samples queue depth and heap every 20 ms; the JVM gets 256 MB of heap:</p>
${src('ch04/Pipeline.java', 'java')}
${run('c47-pipe', 'java -Xmx256m Pipeline.java bounded 1000000', 3)}
<p>Same time either way (~1 s for a million lines) — the consumers set the pace, a bigger queue cannot make them faster. But the unbounded queue held <strong>910 748 lines</strong> and 189 MB of heap, against 1 024 lines and 76 MB. Now two million lines, three tries:</p>
${run('c47-pipe', 'for i in 1 2 3; do java -Xmx256m Pipeline.java unbounded')}
<p>Run 1: the producer hit <code>OutOfMemoryError</code> with 1.8 million lines waiting. Run 2 is the scary one: <strong>both consumers died</strong> of <code>OutOfMemoryError</code>, the program printed <code>errors=3,840</code> instead of 40 000, and exited with code <strong>0</strong> — a silent wrong answer. Run 3 survived, at 247 MB and 5.2 s, four times slower than the bounded run (1.3 s), because the garbage collector was fighting for every last megabyte.</p>
${lab('sync', 'pcwhile', 'en', 'A bounded buffer with condition variables: the producer sleeps when the buffer is full, consumers sleep when it is empty — the mechanism inside every BlockingQueue (lesson 5.2).', { tour: 'sync-start' })}

<div class="pitfall co-tieu-de">
<p><strong>"An unbounded queue can't block, so it's safer."</strong> It can't block — so instead of slowing the producer down, it converts the speed difference into memory until something dies, and not always the thread you expect. A bounded queue gives you <strong>backpressure</strong>: when it is full, <code>put()</code> waits and the producer runs at the consumers' speed. The same idea is a full socket buffer (lesson 10.8), a full Kafka partition lag alert, a 429 from an API. Every queue between stages needs a bound — and a decision about what happens when it is full (wait, drop, or reject).</p>
</div>

<h3>Map-reduce on one machine</h3>
<p>Map-reduce is the pattern behind Hadoop and Spark, and it works just as well inside one machine: <strong>map</strong> each slice of the input to a partial result in its own worker, then <strong>reduce</strong> the partial results into one. No locks, no shared state — each worker owns its partial result. The whole question is <em>what travels</em> between processes. <code>mr.py</code> counts words in a 34 MB file four ways:</p>
${src('ch04/mr.py', 'python')}
${run('c47-pipe', 'python3 mr.py gen', 5)}
<p>One process: 867 ms. Sending the lines to 4 workers in chunks of 10 000: 456 ms. Sending only <code>(path, start, end)</code> — each worker opens the file and reads its own slice, aligned to line boundaries — 405 ms with 4 workers and 249 ms with 8. And the cost of doing it badly, on 100 000 lines:</p>
${run('c47-pipe', 'head -n 100000', 4)}
<p>One line per message (<code>chunksize=1</code>): <strong>3 462 ms instead of 88</strong> — 39 times <em>slower</em> than not parallelising at all. Every line was pickled, written to a pipe, read and unpickled; the counting was the cheap part. Granularity is the work-queue lesson of 4.1 again, from the other side: pieces too big cause imbalance, pieces too small drown in overhead. When the data is big, move the code to the data — send offsets, not lines.</p>

<h3>Cancellation is a request, not a kill</h3>
<p>You stop waiting for something — a user cancelled, a deadline passed. Does the <em>work</em> stop too? In all three runtimes the answer is "only if the work cooperates". Java first: <code>Future.cancel(true)</code> interrupts the task's thread, which only <strong>sets a flag</strong>:</p>
${src('ch04/Cancel.java', 'java')}
${run('c47-pipe', 'java Cancel.java sleep', 4)}
<p><code>sleep</code>: <code>Thread.sleep</code> checks the flag, throws <code>InterruptedException</code>, the task stops 17 ms after the cancel. <code>spin</code>: a CPU loop that never looks at the flag — <code>cancel</code> returned <code>true</code>, <code>isCancelled()</code> said <code>true</code>, and the task did <strong>71 million more iterations</strong> in the next half second; the executor could not shut down, only <code>System.exit</code> ended it. <code>check</code>: one <code>Thread.interrupted()</code> per iteration and it stopped at 310 ms. <code>http</code>: <code>HttpRequest.timeout</code> is the library doing that check for you.</p>
${src('ch04/cancel.js', 'javascript')}
${run('c47-pipe', 'node cancel.js fetch', 3)}
${src('ch04/cancel.py', 'python')}
${run('c47-pipe', 'python3 cancel.py asyncio', 3)}
<table>
<tr><th></th><th>Really stops the work</th><th>Only stops <em>you</em> waiting</th></tr>
<tr><td>Java</td><td>interrupt + code that checks it; <code>HttpRequest.timeout</code></td><td><code>Future.get(timeout)</code> alone; <code>cancel(true)</code> on a loop that never checks</td></tr>
<tr><td>Node</td><td><code>AbortSignal.timeout()</code> passed to <code>fetch</code>; <code>worker.terminate()</code></td><td><code>Promise.race</code> with a timer — the work finished at 2 011 ms and wrote its result</td></tr>
<tr><td>Python</td><td><code>asyncio.timeout()</code> (task cancelled at its <code>await</code>); <code>Process.terminate()</code> (exit −15 = SIGTERM)</td><td><code>future.result(timeout)</code> on a thread — <code>cancel()</code> returned False and the program waited 2 s for it</td></tr>
</table>
<p>Why it matters in a backend: a request that "timed out" at the proxy but keeps running still holds a thread, a database connection and maybe a lock. Ten such requests per second and the pool of lesson 3.5 is full of work nobody will ever read. Every wait needs a deadline, and the deadline must reach the code doing the work (lesson 10.8 has the server-side checklist).</p>
${lab('threadpool', 'timeout', 'en', 'Requests with a client timeout: when the queue grows, the pool keeps working on requests whose clients already gave up — goodput collapses. Turn on "drop expired requests" and watch it recover.', { tour: 'threadpool-start' })}

<h3>✍️ Write it yourself: a three-stage pipeline with a deadline</h3>
<p>Write <code>Pipeline3.java</code>: reader → bounded queue → K parser threads (extract the status code) → bounded queue → one aggregator (count per status). End cleanly with poison pills: the reader puts K pills; each parser passes exactly one pill on and stops; the aggregator finishes after K pills. Add a deadline for the whole job: if the aggregator is not done in time, <code>shutdownNow()</code> (which interrupts every blocked <code>take</code>/<code>put</code>), print the partial counts, and prove that every thread stopped. Reference solution: <code>lab/code/ch04/giai/Pipeline3.java</code>.</p>
${run('c47-pipe', 'node gen-log.js /data/access.log 300000', 3)}
<p>With 10 s it finished 300 000 lines in 173 ms. With 50 ms it stopped at 55 ms with a partial, clearly labelled count of 67 766 lines — and <code>all threads stopped: true</code>, because every stage blocks in <code>take</code>/<code>put</code>, which respond to interrupts.</p>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a nightly import job (reader → transform → database writer) sometimes dies with <code>OutOfMemoryError</code>, sometimes finishes with too few rows and exit code 0. And when the database is slow, the job runs past the morning deadline and blocks the backups.</p>
<ol>
<li>Run <code>Pipeline.java</code> bounded and unbounded with 1 and 2 million lines under <code>-Xmx256m</code>. Record depth, heap, time and exit code; run unbounded 2 M several times.</li>
<li>Run <code>mr.py</code> <code>lines1</code>, <code>lines</code> and <code>ranges</code> on the small file; explain the 40× in one sentence.</li>
<li>Run the three <code>Cancel.java</code> modes and the three <code>cancel.py</code> modes; for each, say whether the work stopped or only the waiting.</li>
<li>Write <code>Pipeline3.java</code> and run it with a generous and a tiny deadline.</li>
</ol>
<p><strong>Done when:</strong> you can explain both failure modes of the import job (unbounded queue; consumers that die without failing the job), propose the fix (bounded queues + failing loudly when a stage dies + a deadline that reaches every stage), and show your pipeline stopping all threads on the tiny deadline.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['producer–consumer', 'Stages connected by a queue: producers put work in, consumers take it out.'],
  ['bounded queue / backpressure', 'A queue with a capacity; when full, the producer waits — the slow stage sets the pace for everyone.'],
  ['poison pill (thuốc độc)', 'A special item that tells a consumer to stop; one per consumer, sent after the real work.'],
  ['map-reduce', 'Map each slice to a partial result independently, then reduce the partial results into one.'],
  ['granularity (độ mịn)', 'How big each piece of work is; too small and the overhead of moving it dominates.'],
  ['cooperative cancellation (huỷ hợp tác)', 'Cancelling only sets a flag or aborts a signal; the work stops when it checks it.'],
  ['deadline (hạn chót)', 'A point in time after which the result is no longer wanted; it must reach every stage.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>A bounded queue (1 024) kept the heap at ~76–80 MB; an unbounded one used 189 MB for 1 M lines and, for 2 M, died, returned a wrong count with exit 0, or ran 4× slower.</li>
<li>Backpressure: a full bounded queue makes the producer wait — the right behaviour, not a bug.</li>
<li>Map-reduce on one machine: send offsets, not data — 249 ms on 8 workers vs 867 ms on one; one line per message was 39× slower than one process.</li>
<li>Cancellation is cooperative everywhere: Java interrupt must be checked; Node <code>Promise.race</code> and Python thread futures only stop the waiting.</li>
<li>Use the tools that stop work — <code>AbortSignal.timeout</code>, <code>asyncio.timeout</code>, <code>HttpRequest.timeout</code>, terminating a process — and give the whole job a deadline.</li>
</ul>
${L('https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/BlockingQueue.html', '☕', 'BlockingQueue (Java 21 API)', 'put/take/offer/poll, bounded vs unbounded implementations.', 'Open')}
${L('https://docs.python.org/3/library/asyncio-task.html', '🐍', 'Python docs — Coroutines and Tasks', 'asyncio.timeout, cancellation and what a CancelledError means.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.7</span>
<h2>Chia việc mới là một nửa — nửa kia là đường ống nối</h2>
<p class="lead">Mọi chương trình từ đầu chương đều chia một việc thành mẩu. Backend thật có hình dạng khác: một dòng việc chảy qua các tầng (đọc → tách → làm giàu → ghi), kết quả của nhiều worker phải được gộp lại, và có việc phải <em>dừng</em> vì người dùng đã bỏ đi hoặc đã quá hạn. Ba mẫu thiết kế phủ gần hết — <strong>đường ống producer–consumer, map-reduce, và huỷ việc kèm hạn chờ</strong> — và mỗi mẫu có một sai lầm chỉ lộ ra khi có tải. Câu hỏi: <strong>giữa các worker đặt cái gì, và dừng chúng thế nào?</strong> Bài 5.2 đã tự dựng bộ đệm giới hạn từ mutex và biến điều kiện, bài 6.3 giải nó như bài thi; ở đây ta dùng hàng có sẵn và đo xem giới hạn mang lại gì.</p>

<h3>Producer–consumer: một hàng đợi có giới hạn giữa các tầng</h3>
<p>Một luồng đọc tạo dòng log thật nhanh; K luồng consumer xử lý chậm hơn (một regex cố tình chậm). Chúng nói chuyện qua một <code>BlockingQueue</code> — <code>ArrayBlockingQueue(1024)</code> (có giới hạn) hoặc <code>LinkedBlockingQueue</code> (không giới hạn). Chương trình kết thúc bằng "viên thuốc độc" (poison pill): producer đặt K dấu <code>END</code>, mỗi consumer một viên. Một luồng theo dõi lấy mẫu độ sâu hàng đợi và heap mỗi 20 ms; JVM được 256 MB heap:</p>
${src('ch04/Pipeline.java', 'java')}
${run('c47-pipe', 'java -Xmx256m Pipeline.java bounded 1000000', 3)}
<p>Thời gian như nhau (~1 s cho một triệu dòng) — consumer quyết định nhịp, hàng đợi to hơn không làm chúng nhanh hơn. Nhưng hàng không giới hạn đã giữ <strong>910 748 dòng</strong> và 189 MB heap, so với 1 024 dòng và 76 MB. Giờ hai triệu dòng, thử ba lần:</p>
${run('c47-pipe', 'for i in 1 2 3; do java -Xmx256m Pipeline.java unbounded')}
<p>Lần 1: producer dính <code>OutOfMemoryError</code> khi 1,8 triệu dòng đang chờ. Lần 2 là lần đáng sợ: <strong>cả hai consumer chết</strong> vì <code>OutOfMemoryError</code>, chương trình in <code>errors=3,840</code> thay vì 40 000, và thoát với mã <strong>0</strong> — một kết quả sai câm lặng. Lần 3 sống sót, ở 247 MB và 5,2 s, chậm gấp bốn lần bản có giới hạn (1,3 s), vì bộ gom rác phải giành giật từng megabyte cuối.</p>
${lab('sync', 'pcwhile', 'vi', 'Bộ đệm giới hạn với biến điều kiện: producer ngủ khi bộ đệm đầy, consumer ngủ khi nó rỗng — chính cơ chế bên trong mọi BlockingQueue (bài 5.2).', { tour: 'sync-start' })}

<div class="pitfall co-tieu-de">
<p><strong>"Hàng đợi không giới hạn thì không bao giờ chặn, nên an toàn hơn."</strong> Nó không chặn — nên thay vì làm producer chậm lại, nó đổi chênh lệch tốc độ thành bộ nhớ cho tới khi có thứ chết, và không phải lúc nào cũng là luồng bạn đoán. Hàng có giới hạn cho bạn <strong>backpressure (áp ngược)</strong>: đầy thì <code>put()</code> chờ và producer chạy theo tốc độ của consumer. Cùng một ý là bộ đệm socket đầy (bài 10.8), cảnh báo lag của partition Kafka, mã 429 của một API. Mọi hàng đợi giữa các tầng đều cần giới hạn — và một quyết định khi nó đầy thì làm gì (chờ, bỏ, hay từ chối).</p>
</div>

<h3>Map-reduce trên một máy</h3>
<p>Map-reduce là mẫu đứng sau Hadoop và Spark, và nó chạy tốt y như vậy bên trong một máy: <strong>map</strong> mỗi lát dữ liệu thành một kết quả dở trong worker riêng, rồi <strong>reduce</strong> các kết quả dở thành một. Không khoá, không trạng thái chung — mỗi worker sở hữu kết quả dở của nó. Toàn bộ câu hỏi là <em>cái gì phải đi</em> giữa các tiến trình. <code>mr.py</code> đếm từ trong file 34 MB theo bốn cách:</p>
${src('ch04/mr.py', 'python')}
${run('c47-pipe', 'python3 mr.py gen', 5)}
<p>Một tiến trình: 867 ms. Gửi các dòng cho 4 worker theo khúc 10 000 dòng: 456 ms. Chỉ gửi <code>(path, start, end)</code> — mỗi worker tự mở file và đọc lát của mình, căn theo ranh giới dòng — 405 ms với 4 worker và 249 ms với 8. Và cái giá của làm sai, trên 100 000 dòng:</p>
${run('c47-pipe', 'head -n 100000', 4)}
<p>Mỗi dòng một tin nhắn (<code>chunksize=1</code>): <strong>3 462 ms thay vì 88</strong> — <em>chậm hơn</em> 39 lần so với không song song gì cả. Mỗi dòng bị pickle, ghi vào pipe, đọc ra và unpickle; việc đếm mới là phần rẻ. Độ mịn chính là bài hàng đợi việc của 4.1 nhìn từ phía bên kia: mẩu quá to gây mất cân bằng, mẩu quá nhỏ chết chìm trong chi phí. Khi dữ liệu lớn, hãy đưa mã tới chỗ dữ liệu — gửi vị trí, đừng gửi dòng.</p>

<h3>Huỷ là một lời đề nghị, không phải một nhát giết</h3>
<p>Bạn thôi chờ một việc — người dùng huỷ, quá hạn. Vậy <em>việc</em> có dừng theo không? Ở cả ba runtime câu trả lời là "chỉ khi việc đó hợp tác". Java trước: <code>Future.cancel(true)</code> interrupt luồng của task, mà interrupt chỉ <strong>đặt một cờ</strong>:</p>
${src('ch04/Cancel.java', 'java')}
${run('c47-pipe', 'java Cancel.java sleep', 4)}
<p><code>sleep</code>: <code>Thread.sleep</code> kiểm cờ, ném <code>InterruptedException</code>, task dừng 17 ms sau lệnh huỷ. <code>spin</code>: một vòng lặp CPU không bao giờ nhìn cờ — <code>cancel</code> trả về <code>true</code>, <code>isCancelled()</code> nói <code>true</code>, và task chạy thêm <strong>71 triệu vòng</strong> trong nửa giây tiếp theo; executor không tắt nổi, chỉ <code>System.exit</code> mới kết thúc được. <code>check</code>: mỗi vòng một lần <code>Thread.interrupted()</code> là nó dừng ở 310 ms. <code>http</code>: <code>HttpRequest.timeout</code> là thư viện làm giúp bạn việc kiểm đó.</p>
${src('ch04/cancel.js', 'javascript')}
${run('c47-pipe', 'node cancel.js fetch', 3)}
${src('ch04/cancel.py', 'python')}
${run('c47-pipe', 'python3 cancel.py asyncio', 3)}
<table>
<tr><th></th><th>Dừng việc thật</th><th>Chỉ khiến <em>bạn</em> thôi chờ</th></tr>
<tr><td>Java</td><td>interrupt + mã có kiểm cờ; <code>HttpRequest.timeout</code></td><td>chỉ <code>Future.get(timeout)</code>; <code>cancel(true)</code> lên vòng lặp không bao giờ kiểm</td></tr>
<tr><td>Node</td><td><code>AbortSignal.timeout()</code> truyền vào <code>fetch</code>; <code>worker.terminate()</code></td><td><code>Promise.race</code> với hẹn giờ — việc vẫn xong lúc 2 011 ms và ghi kết quả</td></tr>
<tr><td>Python</td><td><code>asyncio.timeout()</code> (task bị huỷ ở chỗ <code>await</code>); <code>Process.terminate()</code> (mã −15 = SIGTERM)</td><td><code>future.result(timeout)</code> trên luồng — <code>cancel()</code> trả False và chương trình chờ nó 2 s</td></tr>
</table>
<p>Vì sao điều này quan trọng với backend: một request đã "quá hạn" ở proxy mà vẫn chạy tiếp thì vẫn giữ một luồng, một kết nối CSDL và có khi một cái khoá. Mười request như thế mỗi giây là pool của bài 3.5 đầy ắp những việc không ai còn đọc kết quả. Mọi lần chờ cần hạn chót, và hạn chót phải chạm tới đoạn mã đang làm việc (bài 10.8 có checklist phía máy chủ).</p>
${lab('threadpool', 'timeout', 'vi', 'Request có hạn chờ phía client: khi hàng đợi dài ra, pool vẫn cặm cụi làm những request mà client đã bỏ đi — goodput sập. Bật "bỏ request quá hạn" và xem nó hồi lại.', { tour: 'threadpool-start' })}

<h3>✍️ Tự viết: đường ống ba tầng có hạn chót</h3>
<p>Viết <code>Pipeline3.java</code>: luồng đọc → hàng có giới hạn → K luồng tách (lấy mã status) → hàng có giới hạn → một luồng gộp (đếm theo status). Kết thúc êm bằng thuốc độc: luồng đọc đặt K viên; mỗi luồng tách chuyển đúng một viên sang hàng sau rồi dừng; luồng gộp xong sau K viên. Thêm hạn chót cho cả việc: nếu luồng gộp chưa xong kịp, <code>shutdownNow()</code> (nó interrupt mọi <code>take</code>/<code>put</code> đang chặn), in số đếm dở, và chứng minh mọi luồng đã dừng. Lời giải mẫu: <code>lab/code/ch04/giai/Pipeline3.java</code>.</p>
${run('c47-pipe', 'node gen-log.js /data/access.log 300000', 3)}
<p>Với hạn 10 s nó xử lý xong 300 000 dòng trong 173 ms. Với 50 ms nó dừng ở 55 ms với số đếm dở 67 766 dòng, ghi nhãn rõ ràng — và <code>all threads stopped: true</code>, vì tầng nào cũng chặn ở <code>take</code>/<code>put</code>, những lời gọi biết phản hồi interrupt.</p>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một job nhập dữ liệu chạy đêm (đọc → biến đổi → ghi CSDL) lúc thì chết vì <code>OutOfMemoryError</code>, lúc thì xong với thiếu dòng mà mã thoát vẫn 0. Và khi CSDL chậm, job chạy lố sang giờ sáng và chặn luôn việc sao lưu.</p>
<ol>
<li>Chạy <code>Pipeline.java</code> có và không giới hạn với 1 và 2 triệu dòng dưới <code>-Xmx256m</code>. Ghi độ sâu, heap, thời gian và mã thoát; chạy bản không giới hạn 2 triệu vài lần.</li>
<li>Chạy <code>mr.py</code> <code>lines1</code>, <code>lines</code> và <code>ranges</code> trên file nhỏ; giải thích con số 40 lần trong một câu.</li>
<li>Chạy ba chế độ <code>Cancel.java</code> và ba chế độ <code>cancel.py</code>; với mỗi cái, nói việc đã dừng hay chỉ việc chờ dừng.</li>
<li>Viết <code>Pipeline3.java</code> rồi chạy với hạn rộng rãi và hạn rất ngắn.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn giải thích được cả hai kiểu hỏng của job nhập (hàng không giới hạn; consumer chết mà job không báo lỗi), đề xuất cách sửa (hàng có giới hạn + báo lỗi to khi một tầng chết + hạn chót chạm tới mọi tầng), và cho thấy đường ống của bạn dừng mọi luồng khi hạn rất ngắn.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['producer–consumer (người sản xuất – người tiêu thụ)', 'Các tầng nối bằng hàng đợi: producer đặt việc vào, consumer lấy ra.'],
  ['bounded queue / backpressure (hàng có giới hạn / áp ngược)', 'Hàng có sức chứa; đầy thì producer chờ — tầng chậm quyết định nhịp cho tất cả.'],
  ['poison pill (thuốc độc)', 'Một phần tử đặc biệt báo consumer dừng; mỗi consumer một viên, gửi sau việc thật.'],
  ['map-reduce', 'Map từng lát thành kết quả dở một cách độc lập, rồi reduce các kết quả dở thành một.'],
  ['granularity (độ mịn)', 'Mỗi mẩu việc to cỡ nào; quá nhỏ thì chi phí di chuyển nó lấn át.'],
  ['cooperative cancellation (huỷ hợp tác)', 'Huỷ chỉ đặt một cờ hoặc kích một tín hiệu abort; việc dừng khi nó tự kiểm.'],
  ['deadline (hạn chót)', 'Mốc thời gian sau đó kết quả không còn ai cần; nó phải chạm tới mọi tầng.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Hàng có giới hạn (1 024) giữ heap ở ~76–80 MB; hàng không giới hạn dùng 189 MB cho 1 triệu dòng và với 2 triệu thì chết, trả số đếm sai với mã 0, hoặc chạy chậm 4 lần.</li>
<li>Backpressure: hàng có giới hạn đầy thì producer chờ — đó là hành vi đúng, không phải lỗi.</li>
<li>Map-reduce trên một máy: gửi vị trí, đừng gửi dữ liệu — 249 ms với 8 worker so với 867 ms một tiến trình; mỗi dòng một tin nhắn thì chậm hơn một tiến trình 39 lần.</li>
<li>Ở đâu huỷ cũng là hợp tác: interrupt của Java phải được kiểm; <code>Promise.race</code> của Node và future trên luồng của Python chỉ dừng việc chờ.</li>
<li>Dùng công cụ dừng được việc — <code>AbortSignal.timeout</code>, <code>asyncio.timeout</code>, <code>HttpRequest.timeout</code>, kết thúc tiến trình — và cho cả việc một hạn chót.</li>
</ul>
${L('https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/BlockingQueue.html', '☕', 'BlockingQueue (Java 21 API)', 'put/take/offer/poll, các cài đặt có và không giới hạn.', 'Mở')}
${L('https://docs.python.org/3/library/asyncio-task.html', '🐍', 'Python docs — Coroutines and Tasks', 'asyncio.timeout, huỷ task và CancelledError nghĩa là gì.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 4.8 — Dự án nhỏ: phân tích log song song ───────────────────────── */
    {
      title: '4.8 — Mini project: a parallel log analyzer in Java and Node, built and compared|||4.8 — Dự án nhỏ: bộ phân tích log song song bằng Java và Node, dựng và so sánh',
      slug: 'os-4-8-du-an',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Dự án cuối chương: phân tích 2 triệu dòng access log (183 MB) — đếm status, top 5 đường dẫn, p95 độ trễ, MB — bằng cách chia file theo khoảng byte căn dòng, mỗi worker một kết quả dở, gộp cuối; bản Java và bản Node ra kết quả giống hệt (diff); Node 4,8× trên 10 lõi, Java khi JVM còn lạnh chỉ ~2× vì JIT là phần tuần tự, khi ấm 5,8×; chi phí CPU và RSS; bài mở rộng tự làm.',
      content: `${G48}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.8 · Mini project</span>
<h2>One tool, two languages: analyse a day of traffic in parallel</h2>
<p class="lead">The chapter ends with something you can run on your own server: a <strong>parallel log analyzer</strong>. Given a day of nginx-style access log, it answers the questions you ask during an incident — how many errors, which endpoints are busiest, how slow they are at p95 — using every core. You build it twice, in Java and in Node, with the same algorithm, check that both give exactly the same answer, and compare speed, CPU and memory. The question: <strong>how do you design a parallel data job that is correct at the boundaries, scales, and does not cost more than it saves?</strong></p>

<h3>The input: two million log lines</h3>
<p><code>gen-log.js</code> writes a deterministic log (fixed seed), in the format the site's nginx uses plus the request time in seconds. 12 endpoints with realistic weights — the feed, token refresh, messages, the slow AI chat and CV parsing — and a mix of 200/304/404/5xx. The file lives on a <code>tmpfs</code> inside the container, so it never touches the Mac's disk:</p>
${run('c48-log', 'node gen-log.js', 2)}
<p>As a baseline, <code>awk</code> counts just the status codes on one core:</p>
${run('c48-log', 'time awk')}

<h3>The design: split the data, share nothing, merge at the end</h3>
<ol>
<li><strong>Split by data, not by tasks.</strong> The file has S bytes; worker i gets the byte range <code>[S·i/W, S·(i+1)/W)</code>. No queue, no coordination while working.</li>
<li><strong>Own the boundaries.</strong> A cut almost always lands in the middle of a line. Rule: a worker owns every line that <em>starts</em> in its range. So it skips the partial first line (it belongs to the previous worker) and finishes its last line even past <code>end</code>. Every line is counted exactly once.</li>
<li><strong>Stream in blocks.</strong> Each worker reads its range in 4 MiB blocks, carrying the unfinished line over to the next block — memory does not grow with the file.</li>
<li><strong>Partial results that merge.</strong> Each worker fills its own maps: status → count, path → {count, bytes, latency histogram}. No locks, no false sharing (lesson 4.6). p95 comes from a histogram of 10 000 one-millisecond buckets, because histograms can be <em>added</em>; per-worker p95s cannot be averaged into a correct overall p95.</li>
<li><strong>Merge.</strong> The main thread adds the partial results — the "reduce" of lesson 4.7.</li>
</ol>

<h3>The Java version</h3>
${src('ch04/LogAnalyzer.java', 'java')}
<h3>The Node version</h3>
${src('ch04/loganalyzer.js', 'javascript')}
${run('c48-log', 'javac -d . LogAnalyzer.java')}
${run('c48-log', 'java LogAnalyzer /data/access.log 4', 2)}

<h3>Check correctness before speed</h3>
${run('c48-log', 'diff <(java LogAnalyzer')}
<p>Java with <strong>one</strong> worker and Node with <strong>eight</strong> produce identical reports (the <code>sed</code> strips only the "java W=…" / "node W=…" prefix). That single line tests the boundary rule: with a different worker count, the cuts land in different places; if any line were lost or counted twice, the numbers would differ. The feed's p95 is 109 ms; 22 225 + 22 222 + 5 131 requests failed with 5xx.</p>

<h3>Speedup: Node scales, cold Java stalls</h3>
${run('c48-log', './sweep.sh "java LogAnalyzer /data/access.log {k}" 1')}
${run('c48-log', './sweep.sh "node loganalyzer.js')}
<p>Node: 982 ms on one core, 206 ms on ten — 4.77×. Java in a fresh JVM: 458 ms on one core but only ~2× at best (212 ms on ten), with 8 cores no better than 4. Is Java bad at threads? Run the whole analysis three times in the <em>same</em> JVM:</p>
${run('c48-log', 'java LogAnalyzer /data/access.log 8 3', 2)}
<p>258 → 140 → 72 ms with the same 8 threads. On the first run the hot parsing loop is still being <em>interpreted</em> while the JIT compiler works out the machine code; that warm-up does not get faster with more worker threads — it is a serial part, and lesson 4.5's Amdahl punishes it: on a job this short it is a big share of the total. Warm, Java goes from 375 to 65 ms: <strong>5.77×</strong>, the best curve of the three. A one-shot command-line tool pays the warm-up on every run; a long-running service pays it once.</p>
${lab('race', 'mutex', 'en', 'The design we did NOT choose: all workers updating one shared map behind a mutex. Step through and count how often a thread waits — that waiting is why each worker keeps its own partial result.', { tour: 'race-lost-update' })}

<div class="pitfall co-tieu-de">
<p><strong>"I'll just let every worker update one shared map with a lock — simpler."</strong> 2 million lines means 2 million lock acquisitions on the hottest path, and every worker serialised on one lock — lesson 5.2 measured what that costs. Per-worker partial results with a single merge at the end need no lock at all. The other half of the trap: averaging per-worker p95s. If worker 1 saw mostly fast requests and worker 2 mostly slow ones, the average of their p95s is not the p95 of all requests. Merge the <em>data</em> (histograms, counts, sums), then compute the statistic once.</p>
</div>

<h3>What it costs</h3>
${run('c48-log', '/usr/bin/time -f "java W=4', 4)}
<table>
<tr><th></th><th>Wall</th><th>CPU (user)</th><th>Max RSS</th></tr>
<tr><td>Java, 1 worker</td><td>0.45 s</td><td>0.47 s</td><td>275 MB</td></tr>
<tr><td>Java, 4 workers</td><td>0.27 s</td><td>0.90 s</td><td>555 MB</td></tr>
<tr><td>Node, 1 worker</td><td>0.93 s</td><td>0.89 s</td><td>179 MB</td></tr>
<tr><td>Node, 4 workers</td><td>0.31 s</td><td>1.06 s</td><td>383 MB</td></tr>
</table>
<p>Four workers cut the wall time but <em>raised</em> the total CPU time (Java 0.47 → 0.90 s, Node 0.89 → 1.06 s) and doubled the memory: each Java worker holds its own 4 MiB buffers and strings, each Node worker is a whole V8 isolate. On the site's small VPS, running this during an incident on all cores would compete with the API it is trying to diagnose. Parallelism buys time with CPU and RAM; on a shared machine, give it a <code>--cpus</code> limit or use fewer workers.</p>

<h3>Java or Node for this job?</h3>
<table>
<tr><th></th><th>Java (thread pool)</th><th>Node (worker_threads)</th></tr>
<tr><td>One run on 8 cores</td><td>~236 ms (cold JVM)</td><td>~207 ms</td></tr>
<tr><td>Repeated inside a service</td><td><strong>~66 ms</strong> once warm</td><td>~207 ms (new isolates each run)</td></tr>
<tr><td>Memory, 4 workers</td><td>555 MB</td><td>383 MB</td></tr>
<tr><td>Getting results back</td><td>threads share the heap — just return objects</td><td>each partial result is copied by <code>postMessage</code></td></tr>
</table>
<p>For a one-shot CLI either is fine (and <code>awk</code> at 0.4 s for the simplest question is hard to beat). Inside a long-running service, warm Java won; Node would need the reused worker pool of lesson 4.3 so it stops paying isolate start-up per run.</p>

<h3>✍️ Your turn: extend the project</h3>
<p>The two analyzers above are the reference solutions of this project (<code>lab/code/ch04/LogAnalyzer.java</code>, <code>lab/code/ch04/loganalyzer.js</code>). Build your own version first, in the language you use most, then extend it:</p>
<ol>
<li>Add the <strong>top 5 client IPs</strong> and the number of <strong>5xx responses per minute</strong> — both must merge correctly across workers.</li>
<li>Prove correctness: W = 1, 3 and 7 must give byte-identical output (odd counts move the cuts to awkward places).</li>
<li>Port it to a third language — C with pthreads (lesson 4.1) or Python with <code>multiprocessing</code> sending offsets (lesson 4.7) — and add its curve to the chart.</li>
<li>Run it in a container with <code>--cpus 2</code> and find the best worker count; explain it with lesson 3.4.</li>
</ol>

<h3>🧪 Practice (45 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> at 02:00 the API's error rate jumps. You have a 180 MB access log on a 4-vCPU VPS and need, within a minute, the failing endpoints, their p95, and whether the errors started at a particular minute — without slowing the API further.</p>
<ol>
<li>Generate the log, then run both analyzers with W = 1 and 4, and the <code>diff</code> check.</li>
<li>Run the sweeps for both, plus the warm Java sweep; plot the three curves.</li>
<li>Measure wall, CPU and RSS with <code>/usr/bin/time</code> for W = 1 and 4.</li>
<li>Add "5xx per minute" to the analyzer of your choice and find the minute with the most errors in the generated log.</li>
</ol>
<p><strong>Done when:</strong> your outputs are identical for every W, you can explain the cold-JVM plateau with Amdahl's law, and you can say how many workers you would use on the busy 4-vCPU VPS and why (hint: not 4).</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['data partitioning (chia theo dữ liệu)', 'Split the input itself (byte ranges, files, partitions) so workers never coordinate while working.'],
  ['boundary ownership (sở hữu ranh giới)', 'A rule for records that straddle a cut: here, a line belongs to the range where it starts.'],
  ['partial result / merge', 'Each worker’s private result; the final answer is the merge of all partials.'],
  ['mergeable statistic', 'Counts, sums, histograms add up correctly; percentiles and averages of percentiles do not.'],
  ['JIT warm-up (khởi động JIT)', 'The first runs of hot code are interpreted while the compiler works — a serial cost per process.'],
  ['cold vs warm (lạnh vs ấm)', 'A fresh process that pays start-up costs vs the same process after its code is compiled and caches are filled.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Design: byte ranges per worker, lines owned by where they start, 4 MiB streaming, per-worker histograms, one merge.</li>
<li>Java W = 1 and Node W = 8 produced identical reports — the boundary rule works.</li>
<li>Node: 4.77× on 10 cores. Java in a fresh JVM: ~2×, because JIT warm-up is a serial part; warm Java: 5.77× (375 → 65 ms).</li>
<li>Parallel costs CPU and memory: 4 workers raised total CPU time and doubled RSS (Java 275 → 555 MB, Node 179 → 383 MB).</li>
<li>Checklist for any parallel data job: split by data, own the boundaries, mergeable partials, stream, measure cold and warm.</li>
</ul>
${L('https://nodejs.org/api/worker_threads.html', '🟩', 'Node.js — worker_threads', 'workerData, postMessage and what is copied between threads.', 'Open')}
${L('https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ExecutorService.html', '☕', 'ExecutorService (Java 21 API)', 'submit, Future, shutdown — the pool behind the Java analyzer.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.8 · Dự án nhỏ</span>
<h2>Một công cụ, hai ngôn ngữ: phân tích song song lưu lượng của một ngày</h2>
<p class="lead">Chương kết thúc bằng một thứ bạn chạy được trên chính máy chủ của mình: một <strong>bộ phân tích log song song</strong>. Đưa vào access log kiểu nginx của một ngày, nó trả lời đúng những câu bạn hỏi lúc sự cố — bao nhiêu lỗi, endpoint nào đông nhất, p95 chậm cỡ nào — bằng mọi lõi. Bạn dựng nó hai lần, bằng Java và bằng Node, cùng một thuật toán, kiểm rằng cả hai cho ra đúng một đáp án, rồi so tốc độ, CPU và bộ nhớ. Câu hỏi: <strong>thiết kế một việc xử lý dữ liệu song song thế nào cho đúng ở ranh giới, mở rộng được, và không tốn hơn cái nó tiết kiệm?</strong></p>

<h3>Đầu vào: hai triệu dòng log</h3>
<p><code>gen-log.js</code> ghi ra một file log tất định (hạt giống cố định), đúng định dạng nginx của trang này cộng thời gian xử lý request tính bằng giây. 12 endpoint với tỉ trọng như thật — feed, làm mới token, tin nhắn, AI chat chậm và phân tích CV — và trộn 200/304/404/5xx. File nằm trên <code>tmpfs</code> bên trong container nên không bao giờ chạm vào đĩa của máy Mac:</p>
${run('c48-log', 'node gen-log.js', 2)}
<p>Làm mốc, <code>awk</code> đếm riêng mã status trên một lõi:</p>
${run('c48-log', 'time awk')}

<h3>Thiết kế: chia dữ liệu, không chung gì, gộp ở cuối</h3>
<ol>
<li><strong>Chia theo dữ liệu, không theo task.</strong> File có S byte; worker i nhận khoảng byte <code>[S·i/W, S·(i+1)/W)</code>. Không hàng đợi, không phối hợp gì trong lúc làm.</li>
<li><strong>Định rõ ranh giới.</strong> Nhát cắt gần như luôn rơi giữa một dòng. Luật: worker sở hữu mọi dòng <em>bắt đầu</em> trong khoảng của nó. Vậy nó bỏ nửa dòng đầu (thuộc về worker trước) và đọc nốt dòng cuối dù vượt quá <code>end</code>. Mỗi dòng được đếm đúng một lần.</li>
<li><strong>Đọc theo khối.</strong> Mỗi worker đọc khoảng của mình theo khối 4 MiB, mang phần dòng dở sang khối sau — bộ nhớ không lớn lên theo file.</li>
<li><strong>Kết quả dở gộp được.</strong> Mỗi worker điền map riêng: status → số lượng, path → {số lượng, byte, histogram độ trễ}. Không khoá, không false sharing (bài 4.6). p95 lấy từ histogram 10 000 ô mỗi ô một mili-giây, vì histogram <em>cộng</em> được; còn p95 của từng worker thì không thể lấy trung bình ra p95 tổng đúng.</li>
<li><strong>Gộp.</strong> Luồng chính cộng các kết quả dở — chính là bước "reduce" của bài 4.7.</li>
</ol>

<h3>Bản Java</h3>
${src('ch04/LogAnalyzer.java', 'java')}
<h3>Bản Node</h3>
${src('ch04/loganalyzer.js', 'javascript')}
${run('c48-log', 'javac -d . LogAnalyzer.java')}
${run('c48-log', 'java LogAnalyzer /data/access.log 4', 2)}

<h3>Kiểm đúng trước, đo nhanh sau</h3>
${run('c48-log', 'diff <(java LogAnalyzer')}
<p>Java với <strong>một</strong> worker và Node với <strong>tám</strong> worker cho ra báo cáo giống hệt nhau (<code>sed</code> chỉ bỏ tiền tố "java W=…" / "node W=…"). Một dòng đó kiểm luôn luật ranh giới: khác số worker thì nhát cắt rơi chỗ khác; nếu có dòng nào bị mất hay bị đếm hai lần, các con số sẽ lệch. p95 của feed là 109 ms; 22 225 + 22 222 + 5 131 request lỗi 5xx.</p>

<h3>Speedup: Node mở rộng, Java lạnh thì chững</h3>
${run('c48-log', './sweep.sh "java LogAnalyzer /data/access.log {k}" 1')}
${run('c48-log', './sweep.sh "node loganalyzer.js')}
<p>Node: 982 ms trên một lõi, 206 ms trên mười — 4,77×. Java trong JVM mới: 458 ms trên một lõi nhưng tốt nhất chỉ ~2× (212 ms trên mười), 8 lõi không hơn 4. Java kém luồng chăng? Chạy cả phép phân tích ba lần trong <em>cùng</em> một JVM:</p>
${run('c48-log', 'java LogAnalyzer /data/access.log 8 3', 2)}
<p>258 → 140 → 72 ms với cùng 8 luồng. Ở lượt đầu, vòng lặp tách dòng nóng vẫn đang được <em>thông dịch</em> trong lúc trình biên dịch JIT dựng mã máy; việc khởi động đó không nhanh lên khi thêm luồng worker — nó là một phần tuần tự, và định luật Amdahl của bài 4.5 trừng phạt nó: với một việc ngắn cỡ này, nó chiếm một phần lớn tổng thời gian. Khi đã ấm, Java đi từ 375 xuống 65 ms: <strong>5,77×</strong>, đường đẹp nhất trong ba. Một công cụ dòng lệnh chạy một lần trả chi phí khởi động mỗi lần chạy; một service chạy lâu chỉ trả một lần.</p>
${lab('race', 'mutex', 'vi', 'Thiết kế ta KHÔNG chọn: mọi worker cùng cập nhật một map chung sau một mutex. Bấm từng bước và đếm xem một luồng phải chờ bao nhiêu lần — chính việc chờ đó là lý do mỗi worker giữ kết quả dở riêng.', { tour: 'race-lost-update' })}

<div class="pitfall co-tieu-de">
<p><strong>"Cứ cho mọi worker cập nhật một map chung có khoá — cho đơn giản."</strong> 2 triệu dòng nghĩa là 2 triệu lần lấy khoá trên đúng đường nóng nhất, và mọi worker xếp hàng sau một cái khoá — bài 5.2 đã đo cái giá đó. Kết quả dở theo từng worker với một lần gộp ở cuối thì không cần khoá nào. Nửa còn lại của cái bẫy: lấy trung bình p95 của từng worker. Nếu worker 1 toàn gặp request nhanh còn worker 2 toàn gặp request chậm, trung bình hai p95 không phải p95 của toàn bộ request. Hãy gộp <em>dữ liệu</em> (histogram, số đếm, tổng), rồi tính chỉ số một lần.</p>
</div>

<h3>Cái giá phải trả</h3>
${run('c48-log', '/usr/bin/time -f "java W=4', 4)}
<table>
<tr><th></th><th>Thời gian thực</th><th>CPU (user)</th><th>RSS tối đa</th></tr>
<tr><td>Java, 1 worker</td><td>0,45 s</td><td>0,47 s</td><td>275 MB</td></tr>
<tr><td>Java, 4 worker</td><td>0,27 s</td><td>0,90 s</td><td>555 MB</td></tr>
<tr><td>Node, 1 worker</td><td>0,93 s</td><td>0,89 s</td><td>179 MB</td></tr>
<tr><td>Node, 4 worker</td><td>0,31 s</td><td>1,06 s</td><td>383 MB</td></tr>
</table>
<p>Bốn worker rút ngắn thời gian thực nhưng lại <em>tăng</em> tổng thời gian CPU (Java 0,47 → 0,90 s, Node 0,89 → 1,06 s) và gấp đôi bộ nhớ: mỗi worker Java giữ bộ đệm 4 MiB và chuỗi riêng, mỗi worker Node là cả một isolate V8. Trên VPS nhỏ của trang này, chạy nó bằng mọi lõi giữa lúc sự cố sẽ tranh tài nguyên với chính cái API mà nó đang chẩn đoán. Song song mua thời gian bằng CPU và RAM; trên máy dùng chung, hãy cho nó một giới hạn <code>--cpus</code> hoặc dùng ít worker hơn.</p>

<h3>Java hay Node cho việc này?</h3>
<table>
<tr><th></th><th>Java (thread pool)</th><th>Node (worker_threads)</th></tr>
<tr><td>Một lần chạy trên 8 lõi</td><td>~236 ms (JVM lạnh)</td><td>~207 ms</td></tr>
<tr><td>Chạy lặp trong một service</td><td><strong>~66 ms</strong> khi đã ấm</td><td>~207 ms (mỗi lượt isolate mới)</td></tr>
<tr><td>Bộ nhớ, 4 worker</td><td>555 MB</td><td>383 MB</td></tr>
<tr><td>Đưa kết quả về</td><td>các luồng chung heap — trả đối tượng là xong</td><td>mỗi kết quả dở bị <code>postMessage</code> sao chép</td></tr>
</table>
<p>Với công cụ dòng lệnh chạy một lần thì bản nào cũng ổn (và <code>awk</code> 0,4 s cho câu hỏi đơn giản nhất thì khó mà thắng). Bên trong một service chạy lâu, Java đã ấm thắng; Node sẽ cần pool worker dùng lại của bài 4.3 để thôi trả chi phí khởi động isolate mỗi lượt.</p>

<h3>✍️ Tới lượt bạn: mở rộng dự án</h3>
<p>Hai bộ phân tích ở trên là lời giải mẫu của dự án (<code>lab/code/ch04/LogAnalyzer.java</code>, <code>lab/code/ch04/loganalyzer.js</code>). Hãy tự dựng bản của bạn trước, bằng ngôn ngữ bạn dùng nhiều nhất, rồi mở rộng:</p>
<ol>
<li>Thêm <strong>5 IP gọi nhiều nhất</strong> và số <strong>phản hồi 5xx theo từng phút</strong> — cả hai phải gộp đúng qua các worker.</li>
<li>Chứng minh tính đúng: W = 1, 3 và 7 phải cho output giống từng byte (số lẻ đẩy nhát cắt vào chỗ khó).</li>
<li>Chuyển sang ngôn ngữ thứ ba — C với pthreads (bài 4.1) hoặc Python với <code>multiprocessing</code> gửi vị trí (bài 4.7) — và thêm đường của nó vào biểu đồ.</li>
<li>Chạy trong container <code>--cpus 2</code> và tìm số worker tốt nhất; giải thích bằng bài 3.4.</li>
</ol>

<h3>🧪 Thực hành (45 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> 02:00 sáng, tỉ lệ lỗi của API nhảy vọt. Bạn có access log 180 MB trên một VPS 4 vCPU và cần, trong vòng một phút, biết các endpoint đang lỗi, p95 của chúng, và lỗi có bắt đầu ở một phút cụ thể nào không — mà không làm API chậm thêm.</p>
<ol>
<li>Sinh log, rồi chạy cả hai bộ phân tích với W = 1 và 4, cùng phép kiểm <code>diff</code>.</li>
<li>Chạy sweep cho cả hai, cộng sweep Java ấm; vẽ ba đường.</li>
<li>Đo thời gian thực, CPU và RSS bằng <code>/usr/bin/time</code> với W = 1 và 4.</li>
<li>Thêm "5xx theo phút" vào bộ phân tích bạn chọn và tìm phút có nhiều lỗi nhất trong log đã sinh.</li>
</ol>
<p><strong>Đạt khi:</strong> output của bạn giống hệt nhau với mọi W, bạn giải thích được đoạn chững của JVM lạnh bằng định luật Amdahl, và nói được bạn sẽ dùng bao nhiêu worker trên VPS 4 vCPU đang bận, vì sao (gợi ý: không phải 4).</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['data partitioning (chia theo dữ liệu)', 'Chia chính đầu vào (khoảng byte, file, partition) để worker không phải phối hợp trong lúc làm.'],
  ['boundary ownership (sở hữu ranh giới)', 'Luật cho bản ghi nằm vắt qua nhát cắt: ở đây, một dòng thuộc về khoảng nơi nó bắt đầu.'],
  ['partial result / merge (kết quả dở / gộp)', 'Kết quả riêng của từng worker; đáp án cuối là kết quả gộp của tất cả.'],
  ['mergeable statistic (chỉ số gộp được)', 'Số đếm, tổng, histogram cộng lại vẫn đúng; phân vị và trung bình các phân vị thì không.'],
  ['JIT warm-up (khởi động JIT)', 'Những lượt đầu của mã nóng chạy thông dịch trong lúc trình biên dịch làm việc — chi phí tuần tự mỗi tiến trình.'],
  ['cold vs warm (lạnh vs ấm)', 'Tiến trình mới phải trả chi phí khởi động, so với cùng tiến trình đó sau khi mã đã được dịch và cache đã đầy.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Thiết kế: mỗi worker một khoảng byte, dòng thuộc về nơi nó bắt đầu, đọc theo khối 4 MiB, histogram riêng từng worker, gộp một lần.</li>
<li>Java W = 1 và Node W = 8 cho báo cáo giống hệt — luật ranh giới đúng.</li>
<li>Node: 4,77× trên 10 lõi. Java trong JVM mới: ~2×, vì khởi động JIT là phần tuần tự; Java đã ấm: 5,77× (375 → 65 ms).</li>
<li>Song song tốn CPU và bộ nhớ: 4 worker làm tăng tổng thời gian CPU và gấp đôi RSS (Java 275 → 555 MB, Node 179 → 383 MB).</li>
<li>Checklist cho mọi việc dữ liệu song song: chia theo dữ liệu, định rõ ranh giới, kết quả dở gộp được, đọc theo khối, đo cả lạnh lẫn ấm.</li>
</ul>
${L('https://nodejs.org/api/worker_threads.html', '🟩', 'Node.js — worker_threads', 'workerData, postMessage và thứ gì bị sao chép giữa các luồng.', 'Mở')}
${L('https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ExecutorService.html', '☕', 'ExecutorService (Java 21 API)', 'submit, Future, shutdown — pool đứng sau bản Java.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 4.9 — Quiz ───────────────────────── */
    {
      title: '4.9 — Chapter 4 check|||4.9 — Kiểm tra Chương 4',
      slug: 'os-4-9-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống trên chính số đo của chương: chia khối cố định vs hàng đợi việc, GIL, Amdahl, chọn số luồng, false sharing, huỷ việc trong Java, hàng đợi không giới hạn, Promise.all, map-reduce gửi vị trí, và JVM lạnh trong dự án phân tích log.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Check</span>
<h2>Can you write — and judge — a concurrent program?</h2>
<p class="lead">Ten scenario questions built on the numbers you measured in this chapter. Most ask what a measurement means, because writing parallel code is easy; knowing whether it helped is the skill.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can split a CPU job across threads or processes in C, Java, Node and Python, and measure its speedup on 1…k cores.</li>
<li>I can explain why equal blocks are often unbalanced, and fix it with a work queue.</li>
<li>I can predict a speedup with Amdahl’s law, read a serial fraction with Karp–Flatt, and size a pool with N × (1 + W/C).</li>
<li>I can recognise false sharing, an unbounded queue and a cancellation that only stops the waiting.</li>
<li>I built a parallel log analyzer that gives the same answer for every worker count.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Kiểm tra</span>
<h2>Bạn đã viết được — và đánh giá được — một chương trình đồng thời chưa?</h2>
<p class="lead">Mười câu tình huống dựng trên chính các con số bạn đã đo trong chương. Phần lớn hỏi một số đo có nghĩa là gì, vì viết code song song thì dễ; biết nó có giúp hay không mới là kỹ năng.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi chia được một việc CPU cho nhiều luồng hoặc tiến trình bằng C, Java, Node và Python, và đo speedup trên 1…k lõi.</li>
<li>Tôi giải thích được vì sao chia khối bằng nhau thường lệch, và sửa bằng hàng đợi việc.</li>
<li>Tôi dự đoán được speedup bằng định luật Amdahl, đọc phần tuần tự bằng Karp–Flatt, và chọn cỡ pool bằng N × (1 + W/C).</li>
<li>Tôi nhận ra được false sharing, hàng đợi không giới hạn và một lệnh huỷ chỉ dừng việc chờ.</li>
<li>Tôi đã dựng một bộ phân tích log song song cho cùng một đáp án với mọi số worker.</li>
</ul>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          { question: 'Four pthreads count primes below 20 million, each over a fixed quarter of the range. <code>-v</code> prints their busy times: 308, 498, 616 and 706 ms. Roughly how long does the whole program take?|||Bốn pthread đếm số nguyên tố dưới 20 triệu, mỗi luồng một phần tư cố định của dãy. <code>-v</code> in thời gian bận: 308, 498, 616 và 706 ms. Cả chương trình mất khoảng bao lâu?',
            options: ['About 532 ms — the average of the four|||Khoảng 532 ms — trung bình của bốn luồng', 'About 706 ms — the slowest thread decides|||Khoảng 706 ms — luồng chậm nhất quyết định', 'About 308 ms — the first thread to finish|||Khoảng 308 ms — luồng xong đầu tiên', 'About 2 128 ms — the sum, because they share one core|||Khoảng 2 128 ms — tổng, vì chúng chung một lõi'],
            correctIndex: 1, points: 1,
            explanation: 'EN: Measured: block x4 = 706 ms. The program ends at pthread_join of the last thread; the others sit idle after finishing. The average (532) is what a perfectly balanced split would give — the work queue reached 535 ms. Four cores were available, so the times do not add up.|||VI: Đo được: block x4 = 706 ms. Chương trình kết thúc ở pthread_join của luồng cuối; các luồng khác xong rồi ngồi không. Trung bình (532) là con số của một cách chia cân hoàn hảo — hàng đợi việc đạt 535 ms. Có bốn lõi nên thời gian không cộng dồn.' },
          { question: 'On the lab’s Python 3.14 (<code>Py_GIL_DISABLED = 0</code>), the prime count takes 4.4 s in one thread. You run it with 4 <code>threading.Thread</code>s on 4 cores. What speedup do you get?|||Trên Python 3.14 của lab (<code>Py_GIL_DISABLED = 0</code>), bài đếm số nguyên tố mất 4,4 s với một luồng. Bạn chạy bằng 4 <code>threading.Thread</code> trên 4 lõi. Được speedup bao nhiêu?',
            options: ['About 4× — one thread per core|||Khoảng 4× — mỗi lõi một luồng', 'About 2× — the GIL halves the gain|||Khoảng 2× — GIL cắt một nửa lợi ích', 'About 0.5× — threads fight over the GIL and double the time|||Khoảng 0,5× — các luồng giành GIL nên gấp đôi thời gian', 'About 1.0× — only the thread holding the GIL runs Python code|||Khoảng 1,0× — chỉ luồng đang giữ GIL được chạy mã Python'],
            correctIndex: 3, points: 1,
            explanation: 'EN: Measured 1.00× on 1, 2 and 4 cores; ps -L showed four threads at ~25% of a core each, top showed the process at 100%. multiprocessing gave 3.40× on 4 cores. The slowdown option is a myth for this workload — the time stayed the same.|||VI: Đo được 1,00× trên 1, 2 và 4 lõi; ps -L thấy bốn luồng mỗi luồng ~25% một lõi, top thấy tiến trình 100%. multiprocessing cho 3,40× trên 4 lõi. Phương án chậm đi gấp đôi là ngộ nhận với việc này — thời gian giữ nguyên.' },
          { question: 'A program spends 25% of its single-core time in a part that only one thread can run. What is the best speedup Amdahl’s law allows on 10 cores?|||Một chương trình dành 25% thời gian chạy một lõi cho một phần chỉ một luồng chạy được. Định luật Amdahl cho phép speedup tốt nhất bao nhiêu trên 10 lõi?',
            options: ['About 3.1× — 1 / (0.25 + 0.75/10)|||Khoảng 3,1× — 1 / (0,25 + 0,75/10)', 'About 7.5× — 75% of 10 cores|||Khoảng 7,5× — 75% của 10 lõi', '10× — every core helps equally|||10× — lõi nào cũng giúp như nhau', '4× — the limit 1/s|||4× — giới hạn 1/s'],
            correctIndex: 0, points: 1,
            explanation: 'EN: 1 / (0.25 + 0.075) = 3.08×; amdahl.c measured 3.02×. 4× is the ceiling as cores go to infinity — tempting, but 10 cores do not reach it. 7.5× forgets that the serial part still takes its full time.|||VI: 1 / (0,25 + 0,075) = 3,08×; amdahl.c đo được 3,02×. 4× là trần khi số lõi tiến tới vô cùng — dễ chọn nhầm, nhưng 10 lõi chưa chạm tới. 7,5× quên rằng phần tuần tự vẫn tốn trọn thời gian của nó.' },
          { question: 'On 2 cores, each task computes for C = 10 ms and then waits W = 40 ms for the database. Which pool size does the rule N<sub>cpu</sub> × (1 + W/C) suggest?|||Trên 2 lõi, mỗi việc tính C = 10 ms rồi chờ CSDL W = 40 ms. Luật N<sub>cpu</sub> × (1 + W/C) gợi ý pool cỡ bao nhiêu?',
            options: ['2 — one thread per core|||2 — mỗi lõi một luồng', '4 — W/C|||4 — W/C', '10 — 2 × (1 + 40/10)|||10 — 2 × (1 + 40/10)', '50 — C + W|||50 — C + W'],
            correctIndex: 2, points: 1,
            explanation: 'EN: 2 × 5 = 10. Sizing.java measured 149 tasks/s at 10 threads (the knee) and a plateau of ~190/s from 16, close to the ceiling of 2 cores ÷ 10 ms = 200/s. 2 threads is right only for pure CPU work (W = 0); there it already gave 199/s.|||VI: 2 × 5 = 10. Sizing.java đo 149 việc/giây ở 10 luồng (khúc gãy) và đi ngang ~190/giây từ 16, sát trần 2 lõi ÷ 10 ms = 200/giây. 2 luồng chỉ đúng cho việc thuần CPU (W = 0); ở đó nó đã đạt 199/giây.' },
          { question: 'Eight threads each increment only their own counter. Counters 8 bytes apart: 777 ms. Counters 128 bytes apart: 192 ms. No locks, the sums are correct. What causes the difference?|||Tám luồng, mỗi luồng chỉ tăng bộ đếm của chính nó. Bộ đếm cách nhau 8 byte: 777 ms. Cách nhau 128 byte: 192 ms. Không khoá, tổng đều đúng. Nguyên nhân khác biệt là gì?',
            options: ['A hidden lock inside libc that serialises the increments|||Một cái khoá ẩn trong libc bắt các lần tăng xếp hàng', 'False sharing: the counters share a cache line, which bounces between cores on every write|||False sharing: các bộ đếm chung một dòng cache, dòng này nảy qua lại giữa các lõi mỗi lần ghi', 'More context switches when the counters are close together|||Chuyển ngữ cảnh nhiều hơn khi các bộ đếm nằm gần nhau', 'The compiler optimises the 128-byte version into one addition|||Trình biên dịch tối ưu bản 128 byte thành một phép cộng'],
            correctIndex: 1, points: 1,
            explanation: 'EN: Writing a cache line needs exclusive ownership, so neighbouring counters force the line to move between cores. perf stat showed twice the CPU time with only 14 vs 7 context switches — not a scheduling effect. Both versions use volatile increments, so the compiler cannot fold either loop.|||VI: Ghi một dòng cache cần quyền độc quyền, nên các bộ đếm kề nhau bắt dòng đó chạy qua lại giữa các lõi. perf stat thấy gấp đôi thời gian CPU với chỉ 14 so với 7 lần chuyển ngữ cảnh — không phải chuyện lập lịch. Cả hai bản đều tăng biến volatile nên trình biên dịch không gộp được vòng lặp nào.' },
          { question: 'A Java task runs <code>while (true) counter++;</code> and never checks anything. After a 300 ms timeout you call <code>future.cancel(true)</code>. What did the lab measure?|||Một task Java chạy <code>while (true) counter++;</code> và không bao giờ kiểm gì. Sau hạn 300 ms bạn gọi <code>future.cancel(true)</code>. Lab đo được gì?',
            options: ['cancel returned true and isCancelled() was true — and the loop kept running (71 million more iterations in 0.5 s)|||cancel trả về true và isCancelled() là true — và vòng lặp vẫn chạy (thêm 71 triệu vòng trong 0,5 s)', 'The JVM killed the thread immediately|||JVM giết luồng ngay lập tức', 'cancel returned false because the task was running|||cancel trả về false vì task đang chạy', 'An InterruptedException was thrown inside the loop|||Một InterruptedException được ném ra bên trong vòng lặp'],
            correctIndex: 0, points: 1,
            explanation: 'EN: Interrupting only sets a flag. sleep/wait/take check it and throw InterruptedException; a plain loop never does, so the Future is marked cancelled while the thread burns a core and the executor cannot terminate. Adding a Thread.interrupted() check stopped it at 310 ms.|||VI: Interrupt chỉ đặt một cờ. sleep/wait/take kiểm cờ và ném InterruptedException; vòng lặp trơn thì không bao giờ kiểm, nên Future bị đánh dấu đã huỷ trong khi luồng vẫn đốt một lõi và executor không tắt được. Thêm một lần kiểm Thread.interrupted() là nó dừng ở 310 ms.' },
          { question: 'A fast producer feeds 2 million lines to slow consumers through a <code>LinkedBlockingQueue</code> (no bound), with <code>-Xmx256m</code>. Which outcomes did the three runs in the lab show?|||Một producer nhanh đẩy 2 triệu dòng cho các consumer chậm qua <code>LinkedBlockingQueue</code> (không giới hạn), với <code>-Xmx256m</code>. Ba lần chạy trong lab cho thấy kết quả nào?',
            options: ['It finished faster than the bounded queue every time|||Lần nào nó cũng xong nhanh hơn hàng có giới hạn', 'It always failed at once with OutOfMemoryError in the producer|||Lần nào nó cũng chết ngay với OutOfMemoryError ở producer', 'The same memory as the bounded queue, because the GC frees lines|||Bộ nhớ như hàng có giới hạn, vì GC giải phóng các dòng', 'Different each time: producer OOM; consumers dead with a wrong count and exit 0; or success 4× slower|||Mỗi lần một khác: producer OOM; consumer chết với số đếm sai và mã thoát 0; hoặc thành công nhưng chậm 4 lần'],
            correctIndex: 3, points: 1,
            explanation: 'EN: Exactly the three runs: producer OutOfMemoryError with 1.8 M lines queued; both consumers died and the program printed errors=3,840 (instead of 40 000) with exit 0; and a survivor at 247 MB and 5.2 s vs 1.3 s bounded. A bounded queue applies backpressure and kept the heap at ~80 MB.|||VI: Đúng ba lần chạy: producer OutOfMemoryError khi 1,8 triệu dòng đang chờ; cả hai consumer chết và chương trình in errors=3,840 (thay vì 40 000) với mã 0; và một lần sống sót ở 247 MB và 5,2 s so với 1,3 s của bản có giới hạn. Hàng có giới hạn tạo backpressure và giữ heap ở ~80 MB.' },
          { question: 'Node, one JavaScript thread: 100 calls to an API that answers after 100 ms. Version A awaits each call inside a <code>for</code> loop; version B uses <code>Promise.all</code>. What did the lab measure?|||Node, một luồng JavaScript: 100 lời gọi tới một API trả lời sau 100 ms. Bản A await từng lời gọi trong vòng <code>for</code>; bản B dùng <code>Promise.all</code>. Lab đo được gì?',
            options: ['Both ~10 s — one thread can only wait for one thing|||Cả hai ~10 s — một luồng chỉ chờ được một thứ', 'B needs 100 threads from the libuv pool|||B cần 100 luồng của pool libuv', 'A ~10.8 s, B ~0.19 s on the same single thread|||A ~10,8 s, B ~0,19 s trên cùng một luồng', 'A is faster because it reuses one connection|||A nhanh hơn vì dùng lại một kết nối'],
            correctIndex: 2, points: 1,
            explanation: 'EN: Measured 10 762 ms vs 188 ms (and 1 000 calls in 393 ms). Each fetch is a socket waiting in epoll, so one thread can have hundreds in flight; sockets do not use the libuv thread pool. The server saw 100 requests in flight at once — which is also why you need a limit.|||VI: Đo được 10 762 ms so với 188 ms (và 1 000 lời gọi trong 393 ms). Mỗi fetch là một socket chờ trong epoll, nên một luồng giữ được hàng trăm lời gọi đang bay; socket không dùng pool luồng của libuv. Server thấy 100 request cùng lúc — và đó cũng là lý do bạn cần giới hạn.' },
          { question: 'Counting words in 100 000 lines: one process takes 88 ms; <code>Pool(4).map(count_line, lines, chunksize=1)</code> takes 3 462 ms. What is the best fix?|||Đếm từ trong 100 000 dòng: một tiến trình mất 88 ms; <code>Pool(4).map(count_line, lines, chunksize=1)</code> mất 3 462 ms. Cách sửa tốt nhất là gì?',
            options: ['Send each worker only its byte range and let it read its own slice; merge the Counters|||Chỉ gửi cho mỗi worker khoảng byte của nó để nó tự đọc lát của mình; gộp các Counter', 'Use 16 workers instead of 4|||Dùng 16 worker thay vì 4', 'Use threads instead of processes, so nothing is pickled|||Dùng luồng thay cho tiến trình để khỏi phải pickle', 'Increase the pipe buffer size|||Tăng kích thước bộ đệm của pipe'],
            correctIndex: 0, points: 1,
            explanation: 'EN: The cost is moving the data — 100 000 pickled messages — not counting. Sending offsets took 97 ms here and 249 ms vs 867 ms on the 34 MB file with 8 workers. More workers means more messages; threads avoid pickling but then the GIL serialises the counting (lesson 4.4).|||VI: Cái đắt là di chuyển dữ liệu — 100 000 tin nhắn bị pickle — chứ không phải việc đếm. Gửi vị trí mất 97 ms ở đây, và 249 ms so với 867 ms trên file 34 MB với 8 worker. Thêm worker là thêm tin nhắn; dùng luồng thì khỏi pickle nhưng GIL lại bắt việc đếm xếp hàng (bài 4.4).' },
          { question: 'The Java log analyzer in a fresh JVM: 458 ms with 1 worker, 236 ms with 8. Three runs in the same JVM with 8 workers: 258 → 140 → 72 ms. Why does the cold run stop near 2×?|||Bộ phân tích log Java trong JVM mới: 458 ms với 1 worker, 236 ms với 8. Ba lượt trong cùng JVM với 8 worker: 258 → 140 → 72 ms. Vì sao lượt lạnh dừng quanh 2×?',
            options: ['The disk is too slow to feed 8 threads|||Đĩa quá chậm để cấp dữ liệu cho 8 luồng', 'Long garbage-collection pauses stop all threads|||Các lần dừng gom rác dài làm đứng mọi luồng', 'Java threads cannot run in parallel without virtual threads|||Luồng Java không chạy song song được nếu không có virtual thread', 'JIT warm-up — interpreting while compiling the hot loop — is a serial part of every fresh process|||Khởi động JIT — chạy thông dịch trong lúc dịch vòng lặp nóng — là phần tuần tự của mọi tiến trình mới'],
            correctIndex: 3, points: 1,
            explanation: 'EN: The same threads on the same data got 3.6× faster between run 1 and run 3, so neither the disk (the file is on tmpfs, in RAM) nor threading is the limit — and every run allocates the same objects, so the garbage collector cannot explain a 3.6× change either. Warm, the analyzer reached 5.77× on 10 cores — Amdahl: the warm-up is serial work that more threads cannot shrink.|||VI: Cùng các luồng trên cùng dữ liệu nhanh lên 3,6 lần từ lượt 1 tới lượt 3, nên giới hạn không phải đĩa (file nằm trên tmpfs, trong RAM) cũng không phải luồng — và lượt nào cũng cấp phát đúng những đối tượng đó, nên bộ gom rác cũng không giải thích được chênh lệch 3,6 lần. Khi đã ấm, bộ phân tích đạt 5,77× trên 10 lõi — đúng Amdahl: khởi động là việc tuần tự mà thêm luồng không thu nhỏ được.' },
        ],
      },
    },
  ],
};
